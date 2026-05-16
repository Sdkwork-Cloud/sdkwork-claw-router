# Install By Release Version

This guide explains how to install SDKWork Claw Router from a formal release package. The current release version comes from [docs/release/VERSION.md](../../release/VERSION.md); the current version is `0.2.0`.

Use the platform-native installers for the fastest deployment path:

- Ubuntu/Debian: install the `.deb` package with `apt install ./...deb`.
- Windows: install the `.msi` package with `msiexec` or the Windows installer UI.
- macOS: install the `.pkg` package with `installer`.

Use `archive` packages only when you need a portable directory layout that is managed by your own deployment scripts.

## 1. Choose The Right Package

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

- `archive`: portable server directory, local SQLite by default; PostgreSQL recommended for production.
- `service`: host service installer, local SQLite by default; PostgreSQL recommended for production.
- `container`: container build package, local SQLite by default; mount PostgreSQL configuration for production.
- `desktop`: single-machine installer, SQLite by default.

Common package names:

```text
clawrouter-linux-x64-service-0.2.0.deb
clawrouter-linux-x64-desktop-0.2.0.deb
clawrouter-windows-x64-service-0.2.0.msi
clawrouter-windows-x64-desktop-0.2.0.msi
clawrouter-macos-arm64-service-0.2.0.pkg
clawrouter-macos-arm64-desktop-0.2.0.pkg
clawrouter-linux-x64-archive-0.2.0.tar.gz
clawrouter-windows-x64-archive-0.2.0.zip
```

From a source checkout, inspect the full matrix:

```bash
node scripts/plan-claw-router-install-packages.mjs --json
```

## 2. Fast Install Recipes

### Ubuntu/Debian Service

Use this path for a long-running server on Ubuntu or Debian:

```bash
sudo apt install ./clawrouter-linux-x64-service-0.2.0.deb
curl http://127.0.0.1:3900/healthz
curl http://127.0.0.1:3900/readyz
```

The `.deb` package creates the `sdkwork` system user, `/etc/clawrouter/clawrouter.toml`, `/etc/default/clawrouter`, `/var/lib/clawrouter`, `/var/log/clawrouter`, and the systemd unit. On systemd hosts it enables and starts `clawrouter.service` during installation. The first start runs `clawrouterctl ensure` and `clawrouterctl refresh-catalog --force` automatically from `ExecStartPre`.

The default database is local SQLite:

```toml
[database]
engine = "sqlite"
url = "sqlite:///var/lib/clawrouter/clawrouter.sqlite"
max_connections = 1

[paths]
data_directory = "/var/lib/clawrouter"

[runtime]
deployment_mode = "server"
```

For production or multi-node deployments, set the PostgreSQL URL in `/etc/default/clawrouter`:

```text
SDKWORK_CLAW_DATABASE_URL=postgresql://sdkwork_claw_router:<password>@db.example.com:5432/sdkwork_claw_router
```

or set it in `/etc/clawrouter/clawrouter.toml`:

```toml
[database]
engine = "postgresql"
url = "postgresql://sdkwork_claw_router:<password>@db.example.com:5432/sdkwork_claw_router"
max_connections = 16

[runtime]
deployment_mode = "server"
```

The `.deb` post-install script creates:

- `/opt/clawrouter`
- `/etc/clawrouter`
- `/var/lib/clawrouter`
- `/var/log/clawrouter`
- `/etc/default/clawrouter`
- `/lib/systemd/system/clawrouter.service` for `service` packages

Read startup logs and capture the first admin password if initialization happened during startup:

```bash
sudo journalctl -u clawrouter -n 200 --no-pager
```

### Linux Desktop

Use this path for a local Linux trial with SQLite:

```bash
sudo apt install ./clawrouter-linux-x64-desktop-0.2.0.deb
/opt/clawrouter/bin/clawrouterctl ensure
/opt/clawrouter/bin/clawrouterctl refresh-catalog --force
/opt/clawrouter/bin/clawrouter
```

The desktop profile uses the current OS user's config and data directories and does not require PostgreSQL unless you explicitly configure it.

### Windows Desktop Or Service Files

Install the MSI:

```powershell
msiexec /i .\clawrouter-windows-x64-desktop-0.2.0.msi
```

Default install root:

```text
C:\Program Files\ClawRouter
```

Initialize and start from an elevated PowerShell when using a server/service profile, or from a normal PowerShell for a desktop profile:

```powershell
Set-Location "C:\Program Files\ClawRouter"
.\bin\clawrouterctl.exe ensure
.\bin\clawrouterctl.exe refresh-catalog --force
.\bin\clawrouter.exe
```

For production or multi-node server/service deployment, set `SDKWORK_CLAW_DATABASE_URL` in the protected service environment or in the runtime TOML before starting the gateway:

```powershell
$env:SDKWORK_CLAW_DATABASE_URL="postgresql://sdkwork_claw_router:<password>@db.example.com:5432/sdkwork_claw_router"
```

### macOS Desktop Or Service Files

Install the package:

```bash
sudo installer -pkg clawrouter-macos-arm64-desktop-0.2.0.pkg -target /
```

Default runtime files:

```text
Binaries: /opt/clawrouter/bin
Config template: /Library/Application Support/SdkWork/ClawRouter/clawrouter.toml.example
Service plist for service package: /Library/LaunchDaemons/com.sdkwork.clawrouter.plist
```

Initialize and start:

```bash
/opt/clawrouter/bin/clawrouterctl ensure
/opt/clawrouter/bin/clawrouterctl refresh-catalog --force
/opt/clawrouter/bin/clawrouter
```

### Portable Archive

Use archive packages only when your deployment system manages files, service registration, writable directories, and secrets:

Linux/macOS:

```bash
mkdir -p /opt/clawrouter
tar -xzf clawrouter-linux-x64-archive-0.2.0.tar.gz -C /opt/clawrouter
cd /opt/clawrouter
cp .env.release.example .env.release.local
editor .env.release.local
./bin/clawrouterctl ensure
./bin/clawrouterctl refresh-catalog --force
./bin/clawrouter
```

Windows:

```powershell
Expand-Archive .\clawrouter-windows-x64-archive-0.2.0.zip -DestinationPath C:\clawrouter
Set-Location C:\clawrouter
Copy-Item .env.release.example .env.release.local
notepad .env.release.local
.\bin\clawrouterctl.exe ensure
.\bin\clawrouterctl.exe refresh-catalog --force
.\bin\clawrouter.exe
```

## 3. Package Contents

Release packages include the runtime files needed to start Claw Router:

- `bin/clawrouter` or `bin/clawrouter.exe`
- `bin/clawrouterctl` or `bin/clawrouterctl.exe`
- `portal/dist`
- `portal/dist/sdk-archives`
- `.env.release.example`
- `config/clawrouter.toml.example`
- `INSTALL.md`
- `install-manifest.json`

`service` and `desktop` release assets are platform-native installers:

- Linux: `.deb`
- Windows: `.msi`
- macOS: `.pkg`

`archive` and `container` release assets remain portable `.tar.gz` or `.zip` packages.

Never package or commit `.env.release.local`. Archive deployments may generate it on the target host, while Linux service deployments use `/etc/default/clawrouter` created by the `.deb` package. Keep `PORTAL_PUBLIC_*` values browser-safe; do not put database passwords, provider secrets, or admin credentials in `PORTAL_PUBLIC_*` variables.

## 4. Database Policy

`desktop` packages use SQLite by default:

```text
Windows: %LOCALAPPDATA%/SdkWork/ClawRouter/clawrouter.sqlite
Linux: ${XDG_DATA_HOME:-~/.local/share}/clawrouter/clawrouter.sqlite
macOS: ~/Library/Application Support/SdkWork/ClawRouter/clawrouter.sqlite
```

`archive`, `service`, and `container` packages use local SQLite by default so a single node can start without an external database. For production or multi-node deployments, set `SDKWORK_CLAW_DATABASE_URL` or write the same PostgreSQL DSN to the runtime TOML.

Server/service SQLite default:

```text
Linux: /var/lib/clawrouter/clawrouter.sqlite
Windows: %ProgramData%/SdkWork/ClawRouter/Data/clawrouter.sqlite
macOS: /Library/Application Support/SdkWork/ClawRouter/clawrouter.sqlite
```

See [initialization.md](./initialization.md) for default config paths, database examples, and bootstrap admin settings.

## 5. Initialize Database And Catalog

Run initialization before first startup whenever possible:

Linux/macOS package root:

```bash
./bin/clawrouterctl status
./bin/clawrouterctl ensure
./bin/clawrouterctl refresh-catalog --force
```

Windows package root:

```powershell
.\bin\clawrouterctl.exe status
.\bin\clawrouterctl.exe ensure
.\bin\clawrouterctl.exe refresh-catalog --force
```

Native Linux/macOS install path:

```bash
/opt/clawrouter/bin/clawrouterctl status
/opt/clawrouter/bin/clawrouterctl ensure
/opt/clawrouter/bin/clawrouterctl refresh-catalog --force
```

Installer commands print JSON. A successful first install can include:

```json
{"status":"installed","changed":true,"bootstrapAdmin":{"username":"admin","initialPassword":"..."}}
```

Save `bootstrapAdmin.initialPassword` immediately. The same one-time password can also appear in startup logs as `initial_password` if the service initializes the database automatically. Later `ensure` runs and restarts omit `bootstrapAdmin` once the admin login is complete.

Catalog refresh success returns:

```json
{"status":"refreshed_catalog"}
```

## 6. Start And Verify

Start from a package root:

```bash
./bin/clawrouter
```

Windows:

```powershell
.\bin\clawrouter.exe
```

Linux service:

```bash
sudo systemctl status clawrouter --no-pager
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

`/healthz` confirms the edge process is running. `/readyz` confirms database-backed app/admin/gateway readiness.

## 7. Container Packages

`container` packages include:

- `container/Containerfile`
- `container/entrypoint` or `container/entrypoint.ps1`
- `container/metadata.json`

Example:

```bash
tar -xzf clawrouter-linux-x64-container-0.2.0.tar.gz -C /opt/clawrouter
cd /opt/clawrouter
docker build -f container/Containerfile -t clawrouter:0.2.0 .
docker run --rm -p 3900:3900 \
  -e SDKWORK_CLAW_DATABASE_URL="postgresql://sdkwork_claw_router:<password>@db.example.com:5432/sdkwork_claw_router" \
  clawrouter:0.2.0
```

Service and container deployments must mount runtime configuration, logs, and mutable data as writable resources, and must inject the database URL through protected environment variables or protected TOML files.

## 8. Upgrade A Release

1. Read the target release note, for example [v0.2.0](../../release/2026-05-16-v0.2.0.md).
2. Back up the database and runtime configuration.
3. Stop the old service.
4. Install or extract the new release package.
5. Preserve target-local `/etc/default/clawrouter`, `.env.release.local` if used by archive deployments, and runtime TOML files.
6. For Linux service packages, start the service and let systemd run `ensure` and `refresh-catalog --force`.
7. For archive/manual deployments, run `clawrouterctl ensure` and `clawrouterctl refresh-catalog --force`.
8. Start the new version and check `/healthz` and `/readyz`.

## 9. Troubleshooting

- `missing_database_url`: a deployment explicitly required PostgreSQL but no PostgreSQL URL was provided.
- `invalid_argument`: unsupported command or malformed option.
- `invalid_state`: current installation state cannot satisfy the requested command.
- `database_error`: database is unreachable, permissions are missing, or schema initialization failed.
- `catalog_error`: model catalog path, version, or content validation failed.
- `/healthz` succeeds but `/readyz` fails: the edge process is up, but gateway/admin/app/portal upstreams or database dependencies are not ready.
- Linux service exits immediately: check `/etc/default/clawrouter`, `/etc/clawrouter/clawrouter.toml`, and `journalctl -u clawrouter`.
