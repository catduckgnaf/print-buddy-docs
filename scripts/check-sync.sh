#!/usr/bin/env bash
# check-sync.sh — compare upstream Print Buddy docs against this site.
#
# Source of truth: catduckgnaf/print-buddy, docs/*.md on main.
# Site copies live in docs/ here, with file names and inter-document links
# rewritten, so a direct diff would always differ. Instead, drift is
# detected with scripts/sync-manifest.tsv: for each published guide it
# records the upstream file, the site file, and the SHA-256 of the upstream
# file at the last sync. If an upstream hash no longer matches, the page
# has drifted. Upstream .md files that are neither in the manifest nor on
# the exclude list below are reported as ADDED; manifest files missing
# upstream are reported as REMOVED.
#
# Usage:
#   scripts/check-sync.sh
#   PRINT_BUDDY_DIR=/path/to/print-buddy-checkout scripts/check-sync.sh
#
# Output: one line per drifted page (CHANGED/ADDED/REMOVED), a
# "NO DRIFT" line when everything matches, and — for every drifted page —
# the wiki-check prompt described in README.md.
# Exit code: 0 = no drift, 1 = drift found, 2 = setup error.
set -u

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MANIFEST="$REPO_ROOT/scripts/sync-manifest.tsv"
UPSTREAM_REPO="https://github.com/catduckgnaf/print-buddy.git"

# Internal / research-only files in upstream docs/ that are deliberately
# NOT published on the site. Keep in step with README.md.
EXCLUDE=" BAMBU-CONNECTIVITY.md DOCKER-117-ACCEPTANCE.md DOCKER-117-PROGRESS.md INTERNAL_RELEASE_NOTES.md ISSUE-126-TIMELAPSE.md KICAD-EVALUATION.md RELEASE-NOTES.md RENAME-MIGRATION.md REUSE-MAP.md hardcoded-inventory.md home-assistant-panic.md "

cleanup=""
if [ -n "${PRINT_BUDDY_DIR:-}" ]; then
  UPSTREAM_DOCS="$PRINT_BUDDY_DIR/docs"
else
  TMPDIR_SYNC="$(mktemp -d)"
  cleanup="$TMPDIR_SYNC"
  if ! git clone --depth 1 --quiet "$UPSTREAM_REPO" "$TMPDIR_SYNC/print-buddy"; then
    echo "ERROR: could not clone $UPSTREAM_REPO" >&2
    exit 2
  fi
  UPSTREAM_DOCS="$TMPDIR_SYNC/print-buddy/docs"
fi
trap '[ -n "$cleanup" ] && rm -rf "$cleanup"' EXIT

if [ ! -f "$MANIFEST" ]; then
  echo "ERROR: manifest not found: $MANIFEST" >&2
  exit 2
fi
if [ ! -d "$UPSTREAM_DOCS" ]; then
  echo "ERROR: upstream docs directory not found: $UPSTREAM_DOCS" >&2
  exit 2
fi

sha256_of() {
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum "$1" | awk '{print $1}'
  else
    shasum -a 256 "$1" | awk '{print $1}'
  fi
}

drift=0
drift_pages=""

# Changed / removed: walk the manifest.
while IFS="$(printf '\t')" read -r upstream_file site_file recorded_hash; do
  case "$upstream_file" in
    ''|'#'*) continue ;;
  esac
  if [ ! -f "$UPSTREAM_DOCS/$upstream_file" ]; then
    echo "REMOVED: $upstream_file (site: docs/$site_file)"
    drift=1; drift_pages="$drift_pages $upstream_file"
  elif [ ! -f "$REPO_ROOT/docs/$site_file" ]; then
    echo "MISSING-SITE-COPY: $upstream_file (expected docs/$site_file)"
    drift=1; drift_pages="$drift_pages $upstream_file"
  else
    current_hash="$(sha256_of "$UPSTREAM_DOCS/$upstream_file")"
    if [ "$current_hash" != "$recorded_hash" ]; then
      echo "CHANGED: $upstream_file (site: docs/$site_file)"
      drift=1; drift_pages="$drift_pages $upstream_file"
    fi
  fi
done < "$MANIFEST"

# Added: upstream .md files in neither the manifest nor the exclude list.
for f in "$UPSTREAM_DOCS"/*.md; do
  base="$(basename "$f")"
  case "$EXCLUDE" in
    *" $base "*) continue ;;
  esac
  if ! awk -F '\t' -v b="$base" '$1 == b {found=1} END {exit !found}' "$MANIFEST"; then
    echo "ADDED: $base (not in manifest, not excluded — decide whether to publish it)"
    drift=1; drift_pages="$drift_pages $base"
  fi
done

if [ "$drift" -eq 0 ]; then
  echo "NO DRIFT: all published guides match upstream at the last sync, and no new user-facing guides were found upstream."
  exit 0
fi

echo ""
echo "Wiki check — required before this drift can be closed out:"
echo "The GitHub wiki for catduckgnaf/print-buddy (Home, _Sidebar,"
echo "Discord-Bot-Setup and any pages linked from them) is a separate"
echo "surface from this site. For each drifted page below, check the wiki"
echo "and record exactly one decision per page:"
for page in $drift_pages; do
  echo "  - $page: wiki-updated / wiki-not-needed  (record which, in the 'Docs sync needed' issue)"
done
echo "A sync is not complete until every drifted page has a wiki decision recorded."
exit 1
