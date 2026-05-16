# Initialization Guide

Initialization creates runtime configuration, installs the database schema, imports or refreshes the model catalog, and confirms health-check paths. Database defaults differ by deployment mode.

For the fastest path, initialize before first startup:

```bash
clawrouterctl status
clawrouterctl ensure
clawrouterctl refresh-catalog --force
clawrouter
```

If you installed a native Linux or macOS package, the binaries are under `/opt/clawrouter/bin`:

```bash
/opt/clawrouter/bin/clawrouterctl ensure
/opt/clawrouter/bin/clawrouterctl refresh-catalog --force
/opt/clawrouter/bin/clawrouter
```

If you installed the Windows MSI, the default install root is:

```text
C:\Program Files\ClawRouter
```

## Initialization Order

Recommended order for archive/manual deployments:

1. Prepare PostgreSQL and protected process environment variables when defaults are not enough.
2. Prepare runtime TOML configuration.
3. Set `host`, `database`, `username`, and either `password_file` or protected `password`.
4. Run `clawrouterctl ensure`.
5. Run `clawrouterctl refresh-catalog --force`.
6. Start `clawrouter`.
7. Check `/healthz` and `/readyz`.

For Linux `service` deployments, the `.deb` creates the default runtime TOML, `/etc/clawrouter/clawrouter.env`, and `/etc/clawrouter/database.secret`. The systemd unit runs `ensure` and `refresh-catalog --force` automatically before the gateway starts.

Linux service packages should follow this order:

```bash
sudo apt install ./clawrouter-linux-x64-service-0.2.0.deb
sudo editor /etc/clawrouter/clawrouter.toml
sudo systemctl start clawrouter
sudo systemctl status clawrouter --no-pager
```

## Runtime Config Paths

server/service/container defaults:

| Platform | Config file |
| --- | --- |
| Windows | `%ProgramData%/SdkWork/ClawRouter/clawrouter.toml` |
| Linux | `/etc/clawrouter/clawrouter.toml` |
| macOS | `/Library/Application Support/SdkWork/ClawRouter/clawrouter.toml` |

desktop defaults:

| Platform | Config file |
| --- | --- |
| Windows | `%APPDATA%/SdkWork/ClawRouter/clawrouter.toml` |
| Linux | `${XDG_CONFIG_HOME:-~/.config}/clawrouter/clawrouter.toml` |
| macOS | `~/Library/Application Support/SdkWork/ClawRouter/clawrouter.toml` |

Override with `SDKWORK_CLAW_CONFIG_FILE`:

```bash
export SDKWORK_CLAW_CONFIG_FILE="/etc/clawrouter/clawrouter.toml"
```

PowerShell:

```powershell
$env:SDKWORK_CLAW_CONFIG_FILE="C:\ProgramData\SdkWork\ClawRouter\clawrouter.toml"
```

Native package install locations:

| Platform | Binaries | Notes |
| --- | --- | --- |
| Linux `.deb` | `/opt/clawrouter/bin` | `service` packages also install `/lib/systemd/system/clawrouter.service`. |
| Windows `.msi` | `C:\Program Files\ClawRouter\bin` | The MSI installs runtime files; configure service hosting separately when needed. |
| macOS `.pkg` | `/opt/clawrouter/bin` | `service` packages also install `/Library/LaunchDaemons/com.sdkwork.clawrouter.plist`. |

## Database Policy

desktop:

- SQLite by default
- `max_connections = 1` by default
- best for single-machine experience, desktop app usage, and lightweight local deployments

server/service/container:

- PostgreSQL by default
- `max_connections = 16` by default
- PostgreSQL is required for teams, production, SaaS, managed services, multi-node deployments, and commercial deployments
- PostgreSQL deployments should use `max_connections = 16` or another capacity-planned value

For a default Linux service deployment, the package creates this runtime database configuration:

```toml
[database]
engine = "postgresql"
host = "db.example.com"
port = 5432
database = "sdkwork_claw_router"
username = "sdkwork_claw_router"
password_file = "/etc/clawrouter/database.secret"
# password = "change-me"
ssl_mode = "require"
max_connections = 16

[paths]
data_directory = "/var/lib/clawrouter"

[runtime]
deployment_mode = "server"
```

The `.deb` package creates `/etc/clawrouter/database.secret` with the placeholder value `change-me`. Replace that file with the real PostgreSQL password before starting `clawrouter`; startup rejects server configurations that still use `db.example.com` or `change-me`.

For production server/service/container deployments, use the structured TOML fields above. `password_file` is the preferred secret path. Direct `password` is supported only when the TOML file is protected as a secret-bearing file:

- `password_file` can be absolute.
- `password_file` can be relative to the directory containing `clawrouter.toml`.
- `password_file` can use `${VAR}`, `$VAR`, `%VAR%`, or `~` expansion for platform-managed secret paths.

```toml
[database]
engine = "postgresql"
host = "db.internal"
port = 5432
database = "sdkwork_claw_router"
username = "sdkwork_claw_router"
password = "real-password"
ssl_mode = "require"
max_connections = 16

[paths]
data_directory = "/var/lib/clawrouter"

[runtime]
deployment_mode = "server"
```

`SDKWORK_CLAW_DATABASE_URL` remains available in `/etc/clawrouter/clawrouter.env` or the process environment only as an explicit operator override:

```text
SDKWORK_CLAW_DATABASE_URL=postgresql://sdkwork_claw_router:<password>@db.example.com:5432/sdkwork_claw_router
```

Desktop SQLite example:

```toml
[database]
engine = "sqlite"
url = "sqlite:///home/sdkwork/.local/share/clawrouter/clawrouter.sqlite"
max_connections = 1

[runtime]
deployment_mode = "desktop"
```

## Installer Commands

The examples below assume `clawrouterctl` is on `PATH`. From an extracted release package root, use `./bin/clawrouterctl` on Linux/macOS and `.\bin\clawrouterctl.exe` on Windows.

From native Linux/macOS packages, use:

```bash
/opt/clawrouter/bin/clawrouterctl status
/opt/clawrouter/bin/clawrouterctl ensure
/opt/clawrouter/bin/clawrouterctl refresh-catalog --force
```

From the default Windows MSI install directory, use:

```powershell
Set-Location "C:\Program Files\ClawRouter"
.\bin\clawrouterctl.exe status
.\bin\clawrouterctl.exe ensure
.\bin\clawrouterctl.exe refresh-catalog --force
```

Status:

```bash
clawrouterctl status
```

Install or repair schema:

```bash
clawrouterctl ensure
```

Refresh the model catalog:

```bash
clawrouterctl refresh-catalog --force
```

Refresh one vendor:

```bash
clawrouterctl refresh-catalog --vendor openai
```

Use an external model catalog:

```bash
clawrouterctl refresh-catalog --catalog-root /opt/sdkwork-models --catalog-version 2026.05.08.1 --force
```

Dry-run refresh:

```bash
clawrouterctl refresh-catalog --vendor openai --dry-run
```

Windows commands use `.exe`:

```powershell
.\bin\clawrouterctl.exe ensure
.\bin\clawrouterctl.exe refresh-catalog --force
```

## Output And Errors

Installer stdout is one JSON object. Errors are JSON on stderr:

```json
{"status":"error","errorCode":"database_error","message":"..."}
```

Stable error codes:

- `missing_database_url` when a deployment explicitly requires PostgreSQL but no PostgreSQL configuration is provided
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
sudo systemctl status clawrouter --no-pager
sudo journalctl -u clawrouter -n 200 --no-pager
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
