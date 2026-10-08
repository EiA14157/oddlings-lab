# 엉뚱이 공방 · Oddlings

Private source snapshot for https://oddlings-lab.knightatha.chatgpt.site (Sites v2), verified on 2026-10-08. Original deployment source commit: `0fc4c041b2669a7f4c28390471c203077d099cbe`. The GitHub repository begins with a new snapshot commit and contains no prior private Git history.

## Run

Run `node serve.mjs`, then open http://127.0.0.1:4176/. No runtime dependencies or build step are required.

## Checks

Browser test pages: `/?qa&tests` and `/?qa&friendTests`. The optional `qa/run-friends.mjs` runner needs `npm ci` and installed Chrome (or set `CHROME_PATH`). Browser output is excluded from Git.

## Hosting and source

The Sites manifest preserves the public project identifier and static directory. This backup does not change the running site or its settings.

Runtime files in `dist/` are copied byte-for-byte from the deployment source commit. See `source-snapshot.json` for original file hashes. Development imports, dependency manifests and this documentation are normalized for a standalone checkout.

## Assets and exclusions

See `ASSET-NOTES.md`. Existing Git metadata, credentials, environment files, node_modules, caches, browser profiles, downloads, archives, deployment tokens, personal logs and QA screenshots/results are excluded. No essential production file was excluded. No open-source code license has been assigned. Keep this repository private; future publication requires a separate authorized decision.
