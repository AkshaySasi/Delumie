# Release Setup

## One-time setup before first release

### 1. Generate the updater signing key
Run this in the `app/` directory:
```
npx tauri signer generate -w ~/.tauri/delumie.key
```
Copy the **public key** output and paste it into `tauri.conf.json` → `plugins.updater.pubkey`.

### 2. Add GitHub Secrets
Go to repo → Settings → Secrets → Actions and add:

| Secret | Value |
|--------|-------|
| `TAURI_SIGNING_PRIVATE_KEY` | Contents of `~/.tauri/delumie.key` |
| `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` | Password you chose (or empty) |
| `APPLE_CERTIFICATE` | (macOS only) Base64-encoded .p12 cert |
| `APPLE_CERTIFICATE_PASSWORD` | .p12 password |
| `APPLE_SIGNING_IDENTITY` | Developer ID Application: Name (TEAMID) |
| `APPLE_ID` | Your Apple ID email |
| `APPLE_TEAM_ID` | Your Apple Team ID |
| `APPLE_PASSWORD` | App-specific password from appleid.apple.com |

### 3. Trigger a release
```bash
git tag v0.1.0
git push origin v0.1.0
```

The workflow will build Windows (.exe installer) and macOS (.dmg universal), create a GitHub Release, and upload the binaries.

### 4. Update the updater endpoint
The auto-updater looks for:
```
https://github.com/AkshaySasi/Delumie/releases/latest/download/latest.json
```
Tauri's action creates this file automatically when `releaseDraft: false`.

### Windows code signing (optional but recommended)
Without a certificate, Windows SmartScreen will warn users. Options:
- **EV Certificate** (~$300/yr) — removes SmartScreen completely
- **OV Certificate** (~$150/yr) — reduces warnings after reputation builds up
- **Self-signed** (free) — always shows warning; acceptable for beta

Add `WINDOWS_CERTIFICATE` and `WINDOWS_CERTIFICATE_PASSWORD` secrets and uncomment the signing block in the workflow when ready.
