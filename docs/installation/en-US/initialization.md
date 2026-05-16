# Initialization Guide

Initialization creates runtime configuration, installs the database schema, imports or refreshes the model catalog, and confirms health-check paths. Database defaults differ by deployment mode.

## Initialization Order

Recommended order:

1. Prepare `.env.release.local` or protected process environment variables.
2. Prepare runtime TOML configuration.
3. Set the database URL.
4. Run `sdkwork-claw-installer ensure`.
5. Run `sdkwork-claw-installer refresh-catalog --force`.
6. Start `sdkwork-claw-gateway`.
7. Check `/healthz` and `/readyz`.

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

## Database Policy

desktop:

- SQLite by default
- `max_connections = 1` by default
- best for single-machine experience, desktop app usage, and lightweight local deployments

server/service/container:

- PostgreSQL by default
- `max_connections = 16` by default
- placeholder PostgreSQL URLs must be replaced
- best for teams, production, SaaS, managed services, and commercial deployments

Example TOML:

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
{"status":"error","errorCode":"missing_database_url","message":"..."}
```

Stable error codes:

- `missing_database_url`
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

## First Account And IAM

Claw Router login methods, registration, QR login, verification-code policy, and recovery options are controlled by IAM runtime settings. `v0.2.0` keeps a strict default posture: password login is available by default, while QR login, code login, OAuth, and session bridge require explicit enablement.

Do not assume a fixed default administrator account. Production deployments should connect to the existing IAM tenant or organization policy, or create administrator accounts through an authorized initialization process.
