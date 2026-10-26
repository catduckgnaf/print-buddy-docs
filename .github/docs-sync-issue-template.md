# Docs sync needed

The docs sync check found drift between this site and the source of truth,
[`catduckgnaf/print-buddy/docs`](https://github.com/catduckgnaf/print-buddy/tree/main/docs)
on main.

## Drift found

<!-- The workflow replaces the line below with the exact drift list. -->
DRIFT_REPORT

## What to do

1. Re-sync each drifted page into `docs/` here (lowercase file name,
   inter-document links rewritten as in the existing pages).
2. Update the SHA-256 column for each re-synced page in
   `scripts/sync-manifest.tsv` to the current upstream hash.
3. For ADDED pages: publish the new guide, add it to
   `docs/.vitepress/config.mjs` (sidebar) and to the manifest — or record
   below why it is excluded instead.
4. Run `scripts/check-sync.sh` and `npm run docs:build` locally; both
   must pass.

## Wiki check — required, per page

Anything updated goes through a check to see if the wiki should be
updated. The GitHub wiki for `catduckgnaf/print-buddy`
([Home](https://github.com/catduckgnaf/print-buddy/wiki),
`_Sidebar`, `Discord-Bot-Setup` and any pages linked from them) points
readers at guides and may summarise them, so a changed guide can make a
wiki page stale.

For **each** changed or added guide, record exactly one decision —
`wiki-updated` or `wiki-not-needed` — next to the page:

<!-- The workflow generates one checklist line per drifted page. -->
WIKI_CHECKLIST

**Do not close this issue until every drifted page has a wiki decision
recorded above** (and, where the decision was `wiki-updated`, the wiki
change has actually been pushed).
