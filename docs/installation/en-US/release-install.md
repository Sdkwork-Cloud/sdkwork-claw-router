# Install By Release Version

This guide explains how to install SDKWork Claw Router from a formal release package. The current release version comes from [docs/release/VERSION.md](../../release/VERSION.md); the current version is `0.2.0`.

## 1. Select A Package

Package IDs use three dimensions:

```text
<platform>-<architecture>-<deploymentMode>
```

Supported platforms:

- `windows`
- `linux`
- `macos`

Supported architectures:

- `x64`
- `arm64`

Supported deployment modes:

- `archive`
- `service`
- `container`
- `desktop`

Example package names:

```text
sdkwork-claw-router-windows-x64-desktop-0.2.0.zip
sdkwork-claw-router-linux-x64-archive-0.2.0.tar.gz
sdkwork-claw-router-linux-arm64-service-0.2.0.tar.gz
sdkwork-claw-router-macos-arm64-desktop-0.2.0.tar.gz
```

From a source checkout, inspect the full matrix:

```bash
node scripts/plan-claw-router-install-packages.mjs --json
```

Inspect an older version matrix:

```bash
node scripts/plan-claw-router-install-packages.mjs --version 0.1.0
```

## 2. Extract The Package

Windows:

```powershell
Expand-Archive .\sdkwork-claw-router-windows-x64-desktop-0.2.0.zip -DestinationPath C:\sdkwork-claw-router
Set-Location C:\sdkwork-claw-router
```

Linux:

```bash
mkdir -p /opt/sdkwork-claw-router
tar -xzf sdkwork-claw-router-linux-x64-archive-0.2.0.tar.gz -C /opt/sdkwork-claw-router
cd /opt/sdkwork-claw-router
```

macOS:

```bash
mkdir -p /opt/sdkwork-claw-router
tar -xzf sdkwork-claw-router-macos-arm64-desktop-0.2.0.tar.gz -C /opt/sdkwork-claw-router
cd /opt/sdkwork-claw-router
```

## 3. Configure Runtime Environment

Release packages contain:

- `bin/sdkwork-claw-gateway` or `bin/sdkwork-claw-gateway.exe`
- `bin/sdkwork-claw-installer` or `bin/sdkwork-claw-installer.exe`
- `portal/dist`
- `portal/dist/sdk-archives`
- `.env.release.example`
- `config/sdkwork-claw-router.toml.example`
- `INSTALL.md`
- `install-manifest.json`

Never package or commit `.env.release.local`. Generate or create it on the target host.

If the target host is not a source checkout, do not rely on `pnpm release:env:write`. Copy `.env.release.example` to `.env.release.local` and fill target-local values:

```bash
cp .env.release.example .env.release.local
```

Windows:

```powershell
Copy-Item .env.release.example .env.release.local
```

Keep `PORTAL_PUBLIC_*` values browser-safe. Never put database passwords, provider secrets, or admin credentials in `PORTAL_PUBLIC_*` variables.

## 4. Configure The Database

`desktop` packages use SQLite by default:

```text
Windows: %LOCALAPPDATA%/SdkWork/Claw Router/sdkwork-claw-router.sqlite
Linux: ${XDG_DATA_HOME:-~/.local/share}/sdkwork-claw-router/sdkwork-claw-router.sqlite
macOS: ~/Library/Application Support/SdkWork/Claw Router/sdkwork-claw-router.sqlite
```

`archive`, `service`, and `container` packages require PostgreSQL by default. Set `SDKWORK_CLAW_DATABASE_URL`:

```bash
export SDKWORK_CLAW_DATABASE_URL="postgresql://sdkwork_claw_router:<password>@db.example.com:5432/sdkwork_claw_router"
```

Windows PowerShell:

```powershell
$env:SDKWORK_CLAW_DATABASE_URL="postgresql://sdkwork_claw_router:<password>@db.example.com:5432/sdkwork_claw_router"
```

You can also place the database settings in the runtime TOML. See [initialization.md](./initialization.md) for default paths.

## 5. Initialize Database And Catalog

Linux/macOS:

```bash
./bin/sdkwork-claw-installer ensure
./bin/sdkwork-claw-installer refresh-catalog --force
```

Windows:

```powershell
.\bin\sdkwork-claw-installer.exe ensure
.\bin\sdkwork-claw-installer.exe refresh-catalog --force
```

Installer commands print JSON. A successful install looks like:

```json
{"status":"installed","changed":true}
```

Catalog refresh success returns `status: "refreshed_catalog"`.

## 6. Start

Archive and desktop packages:

```bash
./bin/sdkwork-claw-gateway
```

Windows:

```powershell
.\bin\sdkwork-claw-gateway.exe
```

Default portal:

```text
http://127.0.0.1:3900/
```

Health checks:

```bash
curl http://127.0.0.1:3900/healthz
curl http://127.0.0.1:3900/readyz
```

## 7. Service And Container Packages

`service` packages include host service manifests:

- Windows: `service/windows/sdkwork-claw-router.xml`
- Linux: `service/linux/sdkwork-claw-router.service`
- macOS: `service/macos/com.sdkwork.claw-router.plist`

`container` packages include:

- `container/Containerfile`
- `container/entrypoint` or `container/entrypoint.ps1`
- `container/metadata.json`

Service and container deployments must mount runtime configuration, logs, and mutable data as writable resources, and must inject the database URL through protected environment variables or protected TOML files.

## 8. Upgrade A Release

1. Read the target release note, for example [v0.2.0](../../release/2026-05-16-v0.2.0.md).
2. Back up the database and runtime configuration.
3. Stop the old service.
4. Extract the new release package to a new directory or replace the old directory.
5. Preserve target-local `.env.release.local` and runtime TOML files.
6. Run:

```bash
./bin/sdkwork-claw-installer ensure
./bin/sdkwork-claw-installer refresh-catalog --force
```

7. Start the new version and check `/healthz` and `/readyz`.

## 9. Troubleshooting

- `missing_database_url`: server/service/container mode has no PostgreSQL URL.
- `invalid_argument`: unsupported command or malformed option.
- `database_error`: database is unreachable, permissions are missing, or schema initialization failed.
- `catalog_error`: model catalog path, version, or content validation failed.
- `/healthz` succeeds but `/readyz` fails: the edge process is up, but gateway/admin/app/portal upstreams or database dependencies are not ready.
