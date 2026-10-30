#!/usr/bin/env python3
"""sync-docs.py — apply the docs sync from an upstream Print Handy checkout.

This is the automated form of the manual sync described in README.md
("How updates work"). It regenerates every published site copy from the
source of truth (catduckgnaf/print-handy/docs at the checkout given with
--upstream, which the caller has already resolved to the ref being
synced), applying the site's established transformations:

- file names are lowercased per scripts/sync-manifest.tsv,
- a markdown link to another published guide becomes ./<site file>,
- a markdown link to anything else in the Print Handy repo becomes the
  absolute GitHub URL (https://github.com/catduckgnaf/print-handy/blob/main/<path>);
  a link to a directory (an extensionless target) becomes the tree URL
  (https://github.com/catduckgnaf/print-handy/tree/main/<path>) instead of
  surviving as a relative link the site cannot resolve,
- the manifest's SHA-256 column is updated to the upstream file's hash.

It also handles the two structural cases the manual process handles:

- ADDED: an upstream guide that is neither in the manifest nor on the
  exclude list in scripts/check-sync.sh is published: site copy created,
  manifest row appended, and a sidebar entry added to the "Guide"
  section of docs/.vitepress/config.mjs titled from the guide's first
  heading. The placement and title are defaults for a human reviewer to
  adjust in the sync PR — what automation guarantees is that the guide
  is published and reachable, not hidden.
- REMOVED: a manifest guide whose upstream file is gone loses its site
  copy, its manifest row and its sidebar entry, and links to it in the
  hand-maintained home page (docs/index.md) are reduced to plain text.
  (Links in synced pages are regenerated from upstream each run, so a
  link to a removed guide becomes the GitHub URL automatically if the
  upstream source still has it.)

Usage:
  scripts/sync-docs.py --upstream /path/to/print-handy-checkout

Output: one CHANGED / ADDED / REMOVED line per affected page, then a
summary line. Exit code: 0 on success (including "nothing to do"),
2 on a setup error. The working tree is modified in place; committing
and opening the PR is the caller's job (see
.github/workflows/docs-auto-sync.yml).
"""

import argparse
import hashlib
import posixpath
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
DOCS_DIR = REPO_ROOT / "docs"
MANIFEST = REPO_ROOT / "scripts" / "sync-manifest.tsv"
CHECK_SYNC = REPO_ROOT / "scripts" / "check-sync.sh"
CONFIG = DOCS_DIR / ".vitepress" / "config.mjs"
GITHUB_BLOB = "https://github.com/catduckgnaf/print-handy/blob/main/"
GITHUB_TREE = "https://github.com/catduckgnaf/print-handy/tree/main/"
LINK_RE = re.compile(r"\]\(([^)\s]+)((?:\s+\"[^\"]*\")?)\)")


def sha256_of(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load_excludes():
    match = re.search(r'^EXCLUDE="([^"]*)"', CHECK_SYNC.read_text(), re.M)
    if not match:
        raise SystemExit(f"could not parse EXCLUDE from {CHECK_SYNC}")
    return set(match.group(1).split())


def load_manifest():
    """Return (header_lines, rows) with rows as [upstream, site, hash]."""
    header, rows = [], []
    for line in MANIFEST.read_text().splitlines():
        if line.startswith("#") or not line.strip():
            header.append(line)
        else:
            rows.append(line.split("\t"))
    return header, rows


def sidebar_title(upstream_path, site_name):
    for line in upstream_path.read_text().splitlines():
        if line.startswith("# "):
            title = line[2:].strip()
            title = re.sub(r"\s*\((?:#\d+|issue[^)]*)\)\s*$", "", title)
            title = title.split(":")[0].split(" — ")[0].strip()
            if title:
                return title
            break
    return site_name.replace("-", " ").title()


def rewrite_links(text, upstream_to_site):
    def replace(match):
        target, title = match.group(1), match.group(2)
        if target.startswith(("#", "http://", "https://", "mailto:")):
            return match.group(0)
        path, _, anchor = target.partition("#")
        if "." not in posixpath.basename(path):
            if "/" not in path:
                return match.group(0)  # anchor-only or a placeholder like (URL)
            # An extensionless target with a path separator is a link to a
            # directory in the repo (e.g. ../firmware/commands): point it at
            # the GitHub tree view rather than leaving a relative link the
            # site cannot resolve (a dead link fails the site build).
            resolved_dir = posixpath.normpath(posixpath.join("docs", path))
            new_target = GITHUB_TREE + resolved_dir
            if anchor:
                new_target += "#" + anchor
            return f"]({new_target}{title})"
        resolved = posixpath.normpath(posixpath.join("docs", path))
        base = posixpath.basename(resolved)
        if (resolved.startswith("docs/") and path.lower().endswith(".md")
                and base in upstream_to_site):
            new_target = "./" + upstream_to_site[base]
        else:
            # Anything else in the repo — an unpublished guide, a file
            # outside docs/, a data file — links at its GitHub URL.
            new_target = GITHUB_BLOB + resolved
        if anchor:
            new_target += "#" + anchor
        return f"]({new_target}{title})"

    return LINK_RE.sub(replace, text)


def add_sidebar_entry(site_name, title):
    lines = CONFIG.read_text().splitlines(keepends=True)
    link = f"'/{site_name[:-3]}'"
    if any(link in line for line in lines):
        return
    group = next(
        i for i, line in enumerate(lines) if "text: 'Guide'," in line)
    close = next(
        i for i in range(group, len(lines)) if lines[i].strip() == "],")
    indent = re.match(r"\s*", lines[close - 1]).group(0)
    # The title is free text from the guide's first heading, interpolated
    # into a single-quoted JS string: escape backslashes first, then
    # apostrophes, so a heading like "Cloudflare's free tier" cannot
    # break the generated config (that is what failed the 2.2.0 build).
    js_title = title.replace("\\", "\\\\").replace("'", "\\'")
    lines.insert(close, f"{indent}{{ text: '{js_title}', link: {link} }},\n")
    CONFIG.write_text("".join(lines))


def remove_sidebar_entry(site_name):
    link = f"'/{site_name[:-3]}'"
    lines = CONFIG.read_text().splitlines(keepends=True)
    CONFIG.write_text(
        "".join(line for line in lines if link not in line))


def strip_home_links(site_name):
    index = DOCS_DIR / "index.md"
    if not index.exists():
        return
    route = "/" + site_name[:-3]
    text = index.read_text()
    text = re.sub(r"\[([^\]]*)\]\(" + re.escape(route) + r"\)", r"\1", text)
    text = re.sub(
        r"\[([^\]]*)\]\(\./" + re.escape(site_name) + r"\)", r"\1", text)
    index.write_text(text)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--upstream", required=True,
                        help="path to a catduckgnaf/print-handy checkout")
    args = parser.parse_args()
    upstream_docs = Path(args.upstream) / "docs"
    if not upstream_docs.is_dir():
        print(f"ERROR: upstream docs directory not found: {upstream_docs}",
              file=sys.stderr)
        return 2

    excludes = load_excludes()
    header, rows = load_manifest()
    # Only guides that still exist upstream belong in the link map, so a
    # link to a guide removed by this very sync becomes its GitHub URL
    # instead of a site link to a page that is about to disappear.
    upstream_to_site = {
        row[0]: row[1] for row in rows
        if (upstream_docs / row[0]).exists()
    }

    events = []

    # Decide the full map first (existing rows + additions), so link
    # rewriting in this run already points at pages added by this run.
    added = []
    for path in sorted(upstream_docs.glob("*.md")):
        base = path.name
        if base in excludes or base in upstream_to_site:
            continue
        site_name = base.lower()
        upstream_to_site[base] = site_name
        added.append((base, site_name))

    new_rows = []
    for upstream_name, site_name, _old_hash in rows:
        upstream_file = upstream_docs / upstream_name
        site_file = DOCS_DIR / site_name
        if not upstream_file.exists():
            if site_file.exists():
                site_file.unlink()
            remove_sidebar_entry(site_name)
            strip_home_links(site_name)
            events.append(f"REMOVED: {upstream_name} (site: docs/{site_name})")
            continue
        content = rewrite_links(
            upstream_file.read_text(), upstream_to_site)
        if not site_file.exists() or site_file.read_text() != content:
            site_file.write_text(content)
            events.append(f"CHANGED: {upstream_name} (site: docs/{site_name})")
        new_rows.append(
            [upstream_name, site_name, sha256_of(upstream_file)])

    for base, site_name in added:
        upstream_file = upstream_docs / base
        content = rewrite_links(
            upstream_file.read_text(), upstream_to_site)
        (DOCS_DIR / site_name).write_text(content)
        add_sidebar_entry(site_name, sidebar_title(upstream_file, site_name))
        new_rows.append([base, site_name, sha256_of(upstream_file)])
        events.append(f"ADDED: {base} (site: docs/{site_name})")

    manifest_lines = header + ["\t".join(row) for row in new_rows]
    MANIFEST.write_text("\n".join(manifest_lines) + "\n")

    for event in events:
        print(event)
    if events:
        print(f"SYNCED: {len(events)} page(s) updated from upstream.")
    else:
        print("NO DRIFT: site already matches upstream; nothing to sync.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
