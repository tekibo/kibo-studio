# Update Flow

Electrobun checks `<baseUrl>/<channel>-<platform>-update.json` for the latest version. If an update is available, it either downloads a small BSDIFF patch (from the immediately previous version) or falls back to the full `.tar.zst`.

## What to upload

**Upload ALL files in `artifacts/`.** After every build, the folder contains:

| File | Purpose | Size |
|---|---|---|
| `*-update.json` | Metadata: version, hash, platform | ~70 B |
| `*.tar.zst` | Full app bundle (needed for fresh installs & skip-version updates) | ~30 MB |
| `*-Setup.zip` | Windows installer | ~30 MB |

- **You need all of them.** The `update.json` is the entry point Electrobun fetches first. The `.tar.zst` is the fallback when no patch chain exists.
- Subsequent builds will also include a `*-patch-from-<prev>.tar.zst` file — **a tiny delta (often KBs)**. Upload that too.
- Electrobun generates a single patch — only from the *immediately previous* version. Users more than one version behind download the full `.tar.zst` automatically.

## Release workflow

```
1. Bump version in electrobun.config.ts  (e.g. 0.0.1 → 0.0.2)
2. Run build:stable                       (produces artifacts/)
3. Create a new GitHub Release with tag   (e.g. v0.0.2)
4. Attach ALL files from artifacts/       (drag & drop or use gh CLI)
5. Publish
```

That's it. Users launch the app → Electrobun fetches `update.json` → sees newer version → downloads patch or full build → restarts.

## Tag naming

Tags are for you. Electrobun reads versions from `update.json`, not git tags. Use anything: `v0.0.2`, `v0.0.2-canary`, etc.

## Speed note

GitHub Releases asset upload is slow (~1-5 MB/s). For a ~65 MB upload, expect 30s–2 min. Use `gh release upload` (resumable) instead of the browser drag-and-drop if it's timing out.

## Canary limitation

`/releases/latest/download` does not point to prerelease (canary) releases. If you need canary auto-updates, use S3/R2 instead of GitHub Releases.

## CI

See `.github/workflows/release.yml` — push a tag and it builds + publishes automatically.
