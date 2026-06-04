# Development PostgreSQL Configuration

This guide documents the local SDKWork Claw Router PostgreSQL development profile. `pnpm dev`, `pnpm server:dev`, and `pnpm tauri:dev` use PostgreSQL by default to exercise the server/runtime integration path. Desktop packages and desktop user data still use SQLite by default. The checked-in defaults match the SDKWork app stack local profile; `.env.postgres` remains available when a developer needs to override those fields without exporting environment variables.

Workspace desktop commands (`pnpm desktop:dev` and `pnpm tauri:dev`) use the PostgreSQL integration profile. They are workspace development commands, not the packaged desktop local-data policy.

Desktop SQLite defaults are unchanged by this profile:

```text
Windows: %USERPROFILE%/.sdkwork/router/data/clawrouter.sqlite
Linux: ~/.sdkwork/router/data/clawrouter.sqlite
macOS: ~/.sdkwork/router/data/clawrouter.sqlite
```

## 1. Create The Local Database

Create a database and user for local development:

```sql
CREATE USER sdkwork_ai_dev WITH PASSWORD 'sdkworkdev123';
CREATE DATABASE sdkwork_ai_dev OWNER sdkwork_ai_dev;
GRANT ALL PRIVILEGES ON DATABASE sdkwork_ai_dev TO sdkwork_ai_dev;
```

For an existing database, make sure the host, port, database name, username, and password match the default local profile or your local `.env.postgres` file.

## 2. Optional .env.postgres Override

`pnpm dev` reads `.env.postgres` for the local PostgreSQL profile. If the file is missing or you need to customize the PostgreSQL fields, copy the checked-in template:

```powershell
Copy-Item .env.postgres.example .env.postgres
```

On Linux or macOS:

```bash
cp .env.postgres.example .env.postgres
```

Edit `.env.postgres`:

```env
SDKWORK_CLAW_DATABASE_ENGINE=postgresql
SDKWORK_CLAW_DATABASE_HOST=[::1]
SDKWORK_CLAW_DATABASE_PORT=5432
SDKWORK_CLAW_DATABASE_NAME=sdkwork_ai_dev
SDKWORK_CLAW_DATABASE_SCHEMA=sdkwork_ai_dev
SDKWORK_CLAW_DATABASE_USERNAME=sdkwork_ai_dev
SDKWORK_CLAW_DATABASE_PASSWORD=sdkworkdev123
SDKWORK_CLAW_DATABASE_SSL_MODE=disable
SDKWORK_CLAW_DATABASE_MAX_CONNECTIONS=10
```

Do not commit `.env.postgres`. The repository only tracks `.env.postgres.example`.

## 3. Start With PostgreSQL

Start the full local workspace with PostgreSQL:

```powershell
pnpm dev
```

Equivalent explicit server entrypoint:

```powershell
pnpm server:dev
```

Tauri development uses the same workspace PostgreSQL profile by default:

```powershell
pnpm tauri:dev
```

Preview the resolved plan without starting services:

```powershell
pnpm server:plan
pnpm dev --dry-run
```

The default dev profile assembles:

```text
SDKWORK_CLAW_DATABASE_URL=postgresql://sdkwork_ai_dev:sdkworkdev123@[::1]:5432/sdkwork_ai_dev?sslmode=disable
```

and passes the URL plus `SDKWORK_CLAW_DATABASE_MAX_CONNECTIONS` to the installer, catalog refresh, gateway, and edge runtime steps.

`pnpm dev` already loads `.env.postgres`. These explicit PostgreSQL scripts are aliases for the same profile:

```powershell
pnpm dev:postgres
pnpm server:dev:postgres
pnpm server:plan:postgres
```

Use SQLite only through the explicit SQLite entrypoints:

```powershell
pnpm dev:sqlite
pnpm tauri:dev:sqlite
pnpm server:plan:sqlite
```

Use those SQLite entrypoints, or a desktop package, when validating desktop
local data behavior. The PostgreSQL dev profile is not the desktop persistence
default.

## 4. Configuration Precedence

Development startup resolves the database in this order:

1. `SDKWORK_CLAW_DATABASE_URL`
2. `SDKWORK_CLAW_DATABASE_ENGINE/HOST/PORT/NAME/USERNAME/PASSWORD/SSL_MODE`
3. Default local PostgreSQL dev database
4. Explicit SQLite entrypoints, which pass `--database-url sqlite://target/dev/clawrouter.sqlite`

Normal local PostgreSQL development should use the default profile or split fields. Set `SDKWORK_CLAW_DATABASE_URL` only for a temporary explicit override.

Unsupported engines fail startup. A PostgreSQL split-field profile must define `SDKWORK_CLAW_DATABASE_HOST`, `SDKWORK_CLAW_DATABASE_NAME`, `SDKWORK_CLAW_DATABASE_USERNAME`, and `SDKWORK_CLAW_DATABASE_PASSWORD`.

## 5. Troubleshooting

If startup shows SQLite in the dry-run output, check whether you used `pnpm dev:sqlite`, `pnpm tauri:dev:sqlite`, or passed `--database-url sqlite://target/dev/clawrouter.sqlite`.

If startup fails with a missing password error, add `SDKWORK_CLAW_DATABASE_PASSWORD` to `.env.postgres`. Empty passwords are not accepted for the split-field PostgreSQL profile.

If PostgreSQL rejects the connection, verify it manually:

```powershell
$env:PGPASSWORD = "sdkworkdev123"
psql -h 127.0.0.1 -p 5432 -U sdkwork_ai_dev -d sdkwork_ai_dev -c "select 1;"
```

Use `SDKWORK_CLAW_DATABASE_SSL_MODE=disable` for local unencrypted PostgreSQL. Use `require` only when the local PostgreSQL server supports TLS.
