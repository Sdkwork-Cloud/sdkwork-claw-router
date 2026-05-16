# Initialization Guide

Initialization creates runtime configuration, installs the database schema, imports or refreshes the model catalog, and confirms health-check paths. Database defaults differ by deployment mode.

For the fastest path, initialize before first startup:

```bash
sdkwork-claw-installer status
sdkwork-claw-installer ensure
sdkwork-claw-installer refresh-catalog --force
sdkwork-claw-gateway
```

If you installed a native Linux or macOS package, the binaries are under `/opt/sdkwork-claw-router/bin`:

```bash
/opt/sdkwork-claw-router/bin/sdkwork-claw-installer ensure
/opt/sdkwork-claw-router/bin/sdkwork-claw-installer refresh-catalog --force
/opt/sdkwork-claw-router/bin/sdkwork-claw-gateway
```

If you installed the Windows MSI, the default install root is:

```text
C:\Program Files\SdkWork Claw Router
```

## Initialization Order

Recommended order for archive/manual deployments:

1. Prepare protected process environment variables when defaults are not enough.
2. Prepare runtime TOML configuration.
3. Set the database URL only when using managed PostgreSQL.
4. Run `sdkwork-claw-installer ensure`.
5. Run `sdkwork-claw-installer refresh-catalog --force`.
6. Start `sdkwork-claw-gateway`.
7. Check `/healthz` and `/readyz`.

For Linux `service` deployments, the `.deb` creates the default runtime TOML and `/etc/default/sdkwork-claw-router`. The systemd unit runs `ensure` and `refresh-catalog --force` automatically before the gateway starts.

Linux service packages should follow this order:

```bash
sudo apt install ./sdkwork-claw-router-linux-x64-service-0.2.0.deb
sudo systemctl enable --now sdkwork-claw-router
sudo systemctl status sdkwork-claw-router --no-pager
```

## Runtime Config Paths

server/service/container defaults:

| Platform | Config file |
| --- | --- |
| Windows | `%ProgramData%/SdkWork/Claw Router/sdkwork-claw-router.toml` |
| Linux | `/etc/sdkwork-claw-router/sdkwork-claw-router.toml` |
| macOS | `/Library/Application Support/SdkWork/Claw Router/sdkwork-claw-router.toml` |

desktop defaults:

| Platform | Config file |
| --- | --- |
| Windows | `%APPDATA%/SdkWork/Claw Router/sdkwork-claw-router.toml` |
| Linux | `${XDG_CONFIG_HOME:-~/.config}/sdkwork-claw-router/sdkwork-claw-router.toml` |
| macOS | `~/Library/Application Support/SdkWork/Claw Router/sdkwork-claw-router.toml` |

Override with `SDKWORK_CLAW_CONFIG_FILE`:

```bash
export SDKWORK_CLAW_CONFIG_FILE="/etc/sdkwork-claw-router/sdkwork-claw-router.toml"
```

PowerShell:

```powershell
$env:SDKWORK_CLAW_CONFIG_FILE="C:\ProgramData\SdkWork\Claw Router\sdkwork-claw-router.toml"
```

Native package install locations:

| Platform | Binaries | Notes |
| --- | --- | --- |
| Linux `.deb` | `/opt/sdkwork-claw-router/bin` | `service` packages also install `/lib/systemd/system/sdkwork-claw-router.service`. |
| Windows `.msi` | `C:\Program Files\SdkWork Claw Router\bin` | The MSI installs runtime files; configure service hosting separately when needed. |
| macOS `.pkg` | `/opt/sdkwork-claw-router/bin` | `service` packages also install `/Library/LaunchDaemons/com.sdkwork.claw-router.plist`. |

## Database Policy

desktop:

- SQLite by default
- `max_connections = 1` by default
- best for single-machine experience, desktop app usage, and lightweight local deployments

server/service/container:

- SQLite by default for single-node zero-config startup
- `max_connections = 1` by default for local SQLite
- PostgreSQL is recommended for teams, production, SaaS, managed services, multi-node deployments, and commercial deployments
- PostgreSQL deployments should use `max_connections = 16` or another capacity-planned value

For a default Linux service deployment, the package creates this runtime database configuration:

```toml
[database]
engine = "sqlite"
url = "sqlite:///var/lib/sdkwork-claw-router/sdkwork-claw-router.sqlite"
max_connections = 1

[paths]
data_directory = "/var/lib/sdkwork-claw-router"

[runtime]
deployment_mode = "server"
```

For production or multi-node server/service/container deployments, set:

```bash
export SDKWORK_CLAW_DATABASE_URL="postgresql://sdkwork_claw_router:<password>@db.example.com:5432/sdkwork_claw_router"
```

Systemd service packages read `/etc/default/sdkwork-claw-router`, so put the same value there for Linux service deployments:

```text
SDKWORK_CLAW_DATABASE_URL=postgresql://sdkwork_claw_router:<password>@db.example.com:5432/sdkwork_claw_router
```

Production PostgreSQL TOML:

```toml
[database]
engine = "postgresql"
url = "postgresql://sdkwork_claw_router:<password>@db.example.com:5432/sdkwork_claw_router"
max_connections = 16

[paths]
data_directory = "/var/lib/sdkwork-claw-router"

[runtime]
deployment_mode = "server"
```

Desktop SQLite example:

```toml
[database]
engine = "sqlite"
url = "sqlite:///home/sdkwork/.local/share/sdkwork-claw-router/sdkwork-claw-router.sqlite"
max_connections = 1

[runtime]
deployment_mode = "desktop"
```

## Installer Commands

The examples below assume `sdkwork-claw-installer` is on `PATH`. From an extracted release package root, use `./bin/sdkwork-claw-installer` on Linux/macOS and `.\bin\sdkwork-claw-installer.exe` on Windows.

From native Linux/macOS packages, use:

```bash
/opt/sdkwork-claw-router/bin/sdkwork-claw-installer status
/opt/sdkwork-claw-router/bin/sdkwork-claw-installer ensure
/opt/sdkwork-claw-router/bin/sdkwork-claw-installer refresh-catalog --force
```

From the default Windows MSI install directory, use:

```powershell
Set-Location "C:\Program Files\SdkWork Claw Router"
.\bin\sdkwork-claw-installer.exe status
.\bin\sdkwork-claw-installer.exe ensure
.\bin\sdkwork-claw-installer.exe refresh-catalog --force
```

Status:

```bash
sdkwork-claw-installer status
```

Install or repair schema:

```bash
sdkwork-claw-installer ensure
```

Refresh the model catalog:

```bash
sdkwork-claw-installer refresh-catalog --force
```

Refresh one vendor:

```bash
sdkwork-claw-installer refresh-catalog --vendor openai
```

Use an external model catalog:

```bash
sdkwork-claw-installer refresh-catalog --catalog-root /opt/sdkwork-models --catalog-version 2026.05.08.1 --force
```

Dry-run refresh:

```bash
sdkwork-claw-installer refresh-catalog --vendor openai --dry-run
```

Windows commands use `.exe`:

```powershell
.\bin\sdkwork-claw-installer.exe ensure
.\bin\sdkwork-claw-installer.exe refresh-catalog --force
```

## Output And Errors

Installer stdout is one JSON object. Errors are JSON on stderr:

```json
{"status":"error","errorCode":"database_error","message":"..."}
```

Stable error codes:

- `missing_database_url` when a deployment explicitly requires PostgreSQL but no PostgreSQL URL is provided
- `invalid_argument`
- `invalid_state`
- `database_error`
- `catalog_error`
- `installer_error`

## Health Checks

After startup:

```bash
curl http://127.0.0.1:3900/healthz
curl http://127.0.0.1:3900/readyz
```

`/healthz` reports edge server process health. `/readyz` checks gateway, backend/admin API, app API, portal upstream, and database-dependent readiness.

For Linux services, also check systemd and logs:

```bash
sudo systemctl status sdkwork-claw-router --no-pager
sudo journalctl -u sdkwork-claw-router -n 200 --no-pager
```

## First Account And IAM

On first install or first startup, Claw Router creates or repairs a bootstrap administrator login if the configured bootstrap admin is not complete. The default account is:

- username: `admin`
- tenant: `default` (`tenantId: "10"`)
- organization: `root` (`organizationId: "20"`)

The initial password is generated from the operating-system random source unless `SDKWORK_CLAW_BOOTSTRAP_ADMIN_PASSWORD` is set. When a new password is written, it is exposed once in two places:

- installer JSON output under `bootstrapAdmin.initialPassword`
- startup logs from gateway/admin/app services as `initial_password`

Save the password immediately and rotate it after the first login. Re-running `ensure` or restarting after the admin login is complete does not print or reset the password. If the admin user already has an active password and only related IAM membership data needs repair, startup repairs the membership without changing or printing the password.

Bootstrap admin environment variables:

| Variable | Default | Description |
| --- | --- | --- |
| `SDKWORK_CLAW_BOOTSTRAP_ADMIN_ENABLED` | `true` | Set to `false` to disable automatic bootstrap admin creation and repair. |
| `SDKWORK_CLAW_BOOTSTRAP_ADMIN_USERNAME` | `admin` | Bootstrap username. Letters, digits, `.`, `-`, and `_` are allowed. |
| `SDKWORK_CLAW_BOOTSTRAP_ADMIN_DISPLAY_NAME` | `Administrator` | Display name for the bootstrap user. |
| `SDKWORK_CLAW_BOOTSTRAP_ADMIN_EMAIL` | `admin@sdkwork.local` | Email identity for the bootstrap user. |
| `SDKWORK_CLAW_BOOTSTRAP_ADMIN_PASSWORD` | generated | Optional explicit initial password. Must be 12 to 128 characters. |

Example installer output:

```json
{
  "status": "installed",
  "changed": true,
  "bootstrapAdmin": {
    "status": "created",
    "tenantId": "10",
    "organizationId": "20",
    "userId": "1",
    "username": "admin",
    "displayName": "Administrator",
    "email": "admin@sdkwork.local",
    "initialPassword": "generated-or-configured-password",
    "generatedPassword": true
  }
}
```

Claw Router login methods, registration, QR login, verification-code policy, and recovery options are controlled by IAM runtime settings. `v0.2.0` keeps a strict default posture: password login is available by default, while QR login, code login, OAuth, and session bridge require explicit enablement.

After first login, use the admin backend to configure IAM policy for login methods, QR login, registration verification, OAuth visibility, and account recovery.
