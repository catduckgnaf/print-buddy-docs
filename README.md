# Print Buddy Documentation

The documentation site for [Print Buddy](https://github.com/catduckgnaf/print-buddy) — prepare and manage 3D prints from Discord, with an explicit confirmation before printing.

**Live site:** https://catduckgnaf.github.io/print-buddy-docs/

This repository contains only the documentation site. It is not the Print Buddy project itself.

## Source of truth

The content in `docs/` is copied from [`catduckgnaf/print-buddy/docs`](https://github.com/catduckgnaf/print-buddy/tree/main/docs), which remains the source of truth. Guides that are internal or research-only in that repo are not published here; where a published guide links to one, the link points back to the file on GitHub.

See [catduckgnaf/print-buddy#312](https://github.com/catduckgnaf/print-buddy/issues/312) for the tracking issue.

Internal file names were lowercased for the site (for example `DISCORD-BOT-SETUP.md` became `discord-bot-setup.md`), and inter-document links were rewritten to site-internal routes or, for targets that are not published here, to absolute GitHub URLs in the Print Buddy repo.

## Run locally

Requires Node.js 20 or newer.

```bash
npm ci
npm run docs:dev
```

Then open the local URL VitePress prints.

To produce the production build:

```bash
npm run docs:build
npm run docs:preview
```

## How updates work

For now, re-syncing content is manual — but it always starts with the sync
check, and it always ends with a wiki decision (next section).

1. Run the sync check (below) to see exactly which pages drifted.
2. Copy the changed user-facing guides from `print-buddy/docs/` into `docs/` here, lowercasing file names.
3. Rewrite inter-document links the same way as the existing pages (site-internal for published pages, absolute GitHub URLs for anything else in the Print Buddy repo).
4. Update the SHA-256 column for each re-synced page in `scripts/sync-manifest.tsv`.
5. Run `scripts/check-sync.sh` (must report no drift) and `npm run docs:build` (fix any dead links it reports).
6. Make the per-page wiki decision (below) and record it.
7. Push to `main` — the Deploy workflow publishes the site to GitHub Pages.

## Keeping the site in sync — and the wiki check

**Anything updated goes through a check to see if the wiki should be updated.**

### Drift detection

`scripts/sync-manifest.tsv` is the comparison record: for each published
guide it lists the upstream file in `catduckgnaf/print-buddy/docs`, the
site file here, and the SHA-256 of the upstream file at the last sync.
The site copies have rewritten file names and links, so the check hashes
the *upstream* files rather than diffing the copies.

- Locally: `scripts/check-sync.sh` — clones upstream `main` (or uses
  `PRINT_BUDDY_DIR=/path/to/print-buddy` if set), prints every
  CHANGED / ADDED / REMOVED page, then prints the wiki-check prompt.
  Exit 0 means no drift; exit 1 means drift.
- In CI: the **Docs sync check** workflow
  (`.github/workflows/docs-sync-check.yml`) runs the same script daily
  and on `workflow_dispatch`, using only the workflow `GITHUB_TOKEN`
  (`contents: read`, `issues: write`). The drift report is always written
  to the workflow summary and uploaded as an artifact. If there is drift,
  the workflow opens — or, if one is already open, comments on — a single
  open issue titled **Docs sync needed** in this repo, listing exactly
  which pages differ. If a `GITHUB_TOKEN` issue write were ever refused,
  the run would fail at that step and the drift report would still be in
  the summary/artifact — the check never reports a silent success.

Excluded upstream files (internal/research-only, not published here) are
listed in `scripts/check-sync.sh`: `BAMBU-CONNECTIVITY.md`,
`DOCKER-117-*.md`, `INTERNAL_RELEASE_NOTES.md`, `ISSUE-126-TIMELAPSE.md`,
`KICAD-EVALUATION.md`, `MULTI-PRINTER-DESIGN.md` (a design proposal for
unimplemented work; the site publishes shipped guides), `RELEASE-NOTES.md`,
`RENAME-MIGRATION.md`,
`REUSE-MAP.md`, `hardcoded-inventory.md`, `home-assistant-panic.md`
(and `material_temps.yaml`, which is not a guide).

### The wiki decision

The [Print Buddy wiki](https://github.com/catduckgnaf/print-buddy/wiki)
(Home, `_Sidebar`, Discord-Bot-Setup and any pages linked from them) is a
separate surface that points readers at these guides. For **each**
changed or added guide in a sync, someone must check the wiki and record
exactly one decision per page — **wiki-updated** or **wiki-not-needed** —
in the Docs sync needed issue. That issue must not be closed until every
drifted page has its wiki decision recorded (and any `wiki-updated`
change has actually been pushed to the wiki).

The site is built with [VitePress](https://vitepress.dev/), modelled on the [openevse documentation site](https://firstof9.github.io/openevse/).

## License

MIT — see [LICENSE](LICENSE). This matches the Print Buddy project.
