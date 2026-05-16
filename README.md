# sdkwork-claw-router

Commercial AI gateway and console workspace for Spring AI Plus.

This workspace contains the Rust product services, the React portal, generated
TypeScript SDKs, schema/OpenAPI generators, and delivery guardrails for the
Claw Router product. The core rule is simple: product UI and service code must
be backed by schema registry contracts, generated OpenAPI specs, generated SDKs,
Rust handlers, persistence implementations, and repeatable verification.

## Architecture

- Gateway service exposes OpenAI-compatible `/v1/*` APIs.
- App and public console business APIs live under `/app/v3/api`.
- Admin and backend management APIs live under `/backend/v3/api`.
- Frontend app/API calls must use `@sdkwork/clawrouter-app-sdk`.
- Frontend admin/API calls must use `@sdkwork/clawrouter-backend-sdk`.
- Generated SDKs are produced from `generated/openapi/*.json` and must not be
  hand-edited.
- Schema registry is the source of truth for business tables, field contracts,
  OpenAPI payloads, generated SDKs, and frontend data audits.
- Canonical standards live under `specs/`: `specs/API_SPEC.md` for API,
  OpenAPI, operationId, auth context, and SDK generation rules, and
  `specs/DATABASE_SPEC.md` for database and schema-registry rules.
- `docs/schema-registry/frontend-route-classification.yaml` is the source of
  truth for portal route delivery class. Every actual route is one of
  `sdk_backed_business_runtime`, `schema_provenanced_content`, or
  `local_developer_tool_api`.
- Route classification evidence must be repo-relative, must exist, and must
  bind the classified route to the package lazy-loaded by `App.tsx`. Schema
  content routes cannot hide runtime network clients; SDK or local tool routes
  must be classified explicitly. Schema content routes must declare
  `static_delivery` with an approved static mode, refresh policy, maximum
  staleness, runtime upgrade triggers, and `source_manifest_ref`. Static source
  hashes are generated from `docs/schema-registry/frontend-static-source-snapshots.yaml`
  into `generated/schema/frontend/frontend-static-source-manifest.json`, where
  each snapshot records a repo-relative source reference, ISO observation time,
  matching `sha256` content hash, and schema tables that stay within the route
  provenance set.
  Local tool routes must declare every raw browser `fetch` source in
  `browser_network_sources`, including
  `/openapi.json` readers, local tool APIs, and explicit external API
  playground requests. Each entry must use the standard purpose for its endpoint:
  `local_openapi_snapshot`, `local_tool_api`, or
  `explicit_api_playground_request`.

## Repository Layout

- `services/` - Rust product crates for gateway, app API, admin API, and shared
  product logic.
- `apps/sdkwork-claw-router-portal/` - React portal workspace.
- `sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/` - generated app API TypeScript SDK.
- `sdks/clawrouter-backend-sdk/clawrouter-backend-sdk-typescript/` - generated backend API TypeScript SDK.
- `sdks/clawrouter-open-sdk/clawrouter-open-sdk-typescript/` - generated OpenAI-compatible gateway TypeScript SDK.
- `docs/schema-registry/` - table and frontend contract registry.
- `specs/` - canonical API and database standards.
- `data/sdkwork-models/` - standalone model catalog submodule mount point for
  vendor-scoped JSON model facts, pricing data, overlays, and language SDK
  loaders. See `docs/32-sdkwork-models-standard.md` and
  `docs/33-sdkwork-models-install-flow.md`.
- `generated/` - generated OpenAPI, schema, audit, and manifest outputs.
- `tools/` - Python guardians and generators.
- `scripts/` - product launcher, verification runner, and integration runners.
- `tests/` - Python delivery, contract, runtime, and architecture standards.

## Development Commands

Run commands from this directory:

```powershell
pnpm.cmd dev
pnpm.cmd test
pnpm.cmd build
pnpm.cmd start
pnpm.cmd release
pnpm.cmd portal:dev
pnpm.cmd desktop:dev
pnpm.cmd service:dev
pnpm.cmd server:dev
pnpm.cmd smoke:dev
pnpm.cmd product:check
pnpm.cmd install:packages:plan
pnpm.cmd install:packages:check
pnpm.cmd install:package:check
pnpm.cmd install:init:smoke
```

Validate the standalone model catalog before installer or release work:

```powershell
pnpm.cmd models:check
node data\sdkwork-models\tools\build-index.mjs --check
node data\sdkwork-models\tools\validate-catalog.mjs
node data\sdkwork-models\tools\freshness-report.mjs --max-age-policy catalog-freshness-policy.json --as-of 2026-05-08
node data\sdkwork-models\tools\catalog-audit.mjs --as-of 2026-05-08
node data\sdkwork-models\tools\release-catalog.mjs --check --as-of 2026-05-08
cargo test -p sdkwork-models --offline
cargo test -p sdkwork-claw-product --test database_installer --offline
```

Model catalog release evidence is mandatory. `sources/vendor-sources.json`,
`sources/official-model-snapshots.json`, and
`sources/official-verification-policy.json` must stay in sync with
`sdkwork-models.json`; `sources/official-verification-policy.json` is the
release gate and must satisfy
`schemas/official-verification-policy.schema.json`. Every
`requiredVerifiedVendorRegions` entry must resolve to an officially verified
`vendorCode/regionCode` with an independent official snapshot before release or
installer import. The gate is bidirectional: every source declaration marked
`official_verified` must also appear in `requiredVerifiedVendorRegions`.
Each official snapshot also records a canonical `sourceSnapshotHash`; release
metadata stores those values under
`sourceEvidenceSha256.officialSnapshotHashes` by `vendorCode/regionCode` for
CI, approval, rollback, and supplier price-change auditing.

Set `SDKWORK_MODELS_CATALOG_ROOT` when a deployment should load an external
catalog artifact or updated submodule checkout instead of the bundled local
catalog:

```powershell
$env:SDKWORK_MODELS_CATALOG_ROOT="D:\release\sdkwork-models"
```

Refresh installed catalog rows without reinstalling the database:

```powershell
sdkwork-claw-installer refresh-catalog
sdkwork-claw-installer refresh-catalog --vendor openai
sdkwork-claw-installer refresh-catalog --catalog-root D:\release\sdkwork-models --catalog-version 2026.05.08.1
sdkwork-claw-installer refresh-catalog --vendor alibaba --dry-run
```

Installer commands print one JSON object to stdout. `status`, `install`,
`upgrade`, and `ensure` use the same camelCase fields as the admin installation
status API. `refresh-catalog` prints `status`, `synced`, `catalogVersion`,
`vendorCodes`, `meterCount`, `vendorCount`, `familyCount`, `modelCount`,
`capabilityCount`, `priceCount`, `rankingCount`, `acceptedCount`,
`snapshotId`, `syncRunId`, and `lastCatalogRefreshStatus`, so shell scripts and
deployment jobs can consume the refresh result directly. `acceptedCount` is the
total imported standard fact count across shared meters, selected vendors,
families, models, capabilities, prices, and ranking items.
Failures print one camelCase JSON object to stderr with `status: "error"`,
`errorCode`, and `message`; scripts should parse stderr JSON instead of
matching human-readable panic text.
Stable installer error codes are `missing_database_url`, `invalid_argument`,
`invalid_state`, `database_error`, `catalog_error`, and `installer_error`.
The CLI validates command syntax before reading database configuration, so
unsupported commands or refresh options always return `invalid_argument` even
when `SDKWORK_CLAW_DATABASE_URL` is missing. This keeps CI checks and language
wrappers able to validate invocations without requiring a live database.
`status`, `install`, `upgrade`, and `ensure` reject unexpected extra arguments;
only `refresh-catalog` accepts refresh-specific options.
Failed catalog refreshes are also persisted to `ai_model_catalog_sync_run`
with a masked error, requested vendor scope, and resolved catalog version when
the catalog was loadable. This includes vendor selection failures and sync
execution failures, so deployment automation can diagnose and retry without
losing the failed attempt history. Failed-refresh audit persistence is
best-effort and must not mask the original refresh error.
Non-dry-run refreshes commit catalog table upserts, the pricing import
snapshot, the sync-run row, and the audit log in one transaction; if any later
sync step fails, catalog-owned tables keep their previous values.
The backend admin API and generated backend SDK expose the same count contract
as `AdminModelCatalogSyncResponse`. Frontend or application service wrappers
should preserve the full report, including counts, `snapshotId`, and
`syncRunId`, instead of collapsing the response to only `vendors` and `models`.

`pnpm.cmd dev` / `pnpm.cmd server:dev` use the workspace-local
`data/sdkwork-models` directory as `SDKWORK_MODELS_CATALOG_ROOT` by default and
run a blocking `refresh-catalog --catalog-root data/sdkwork-models --force`
step after `ensure`. Local JSON model or pricing edits are therefore imported
into the dev database on every server-mode startup.

Command intent:

- `pnpm.cmd dev` starts the edge development workspace: gateway, admin API,
  app API, and the portal dev server, after ensuring schema installation and
  refreshing model catalog data from `data/sdkwork-models`.
- `pnpm.cmd test` runs the launcher/tooling contract tests.
- `pnpm.cmd build` builds production portal assets, builds the generated app
  and backend SDK runtime packages, creates SDK ZIP archives under
  `apps/sdkwork-claw-router-portal/dist/sdk-archives`, and builds the Rust edge
  server release binary.
- `pnpm.cmd start` serves the built production portal from
  `apps/sdkwork-claw-router-portal/dist` through the Rust edge server, using
  the release binary when it exists.
- `pnpm.cmd release` validates the release environment, regenerates
  `.env.release.local` from the release host process environment, runs strict
  `release:preflight`, and then runs the full `verify` gate.
- `pnpm.cmd portal:dev` starts the browser portal only.
- `pnpm.cmd desktop:dev` starts the full install-checked workspace with
  desktop environment flags.
- `pnpm.cmd service:dev` starts the full install-checked workspace with
  service-mode environment flags.
- `pnpm.cmd server:dev` starts Rust services plus the portal dev server.
- `pnpm.cmd smoke:dev` starts the root `pnpm dev` entrypoint on isolated
  random local ports, verifies the edge and direct OpenAPI/runtime URLs, and
  stops the spawned process tree.
- `pnpm.cmd product:check` runs portal typecheck and production build.
- `pnpm.cmd install:packages:plan` prints the deterministic cross-platform
  install package matrix without building packages or starting services.
- `pnpm.cmd install:packages:check` validates the same matrix for release and
  CI package-builder integration.
- `pnpm.cmd install:package:check` validates the install package builder in
  dry-run mode without requiring staged production artifacts.
- `pnpm.cmd install:init:smoke` validates the fast install initialization
  contract in dry-run mode without starting services or requiring built
  binaries.

Use `pnpm.cmd`, not `pnpm.ps1`, on Windows shells that block PowerShell scripts.

Edge startup prints the browser and API access matrix before launching
processes. With default ports, the Rust edge server at `3900` is the
single entrypoint and forwards portal/API traffic to the independent Rust
service ports and the portal dev server:

- Portal: `http://127.0.0.1:3900/`
- Edge Gateway OpenAPI: `http://127.0.0.1:3900/openapi.json`
- Edge Admin API OpenAPI:
  `http://127.0.0.1:3900/backend/v3/api/openapi.json`
- Edge App API OpenAPI:
  `http://127.0.0.1:3900/app/v3/api/openapi.json`
- Edge OpenAI-compatible Gateway API: `http://127.0.0.1:3900/v1`
- Edge Backend/Admin API: `http://127.0.0.1:3900/backend/v3/api`
- Edge App API: `http://127.0.0.1:3900/app/v3/api`
- Edge Server Health: `http://127.0.0.1:3900/healthz`
- Edge Server Ready: `http://127.0.0.1:3900/readyz`

`/healthz` reports the edge server process health. `/readyz` probes the
gateway, admin API, app API, and portal upstream `/healthz` endpoints and
returns `503` when any dependency is unavailable.

Direct service ports remain available for debugging and external reverse
proxies:

- Direct Portal Dev: `http://127.0.0.1:3901/`
- Direct Portal Gateway API Proxy: `http://127.0.0.1:3901/v1`
- Direct Portal Backend/Admin API Proxy:
  `http://127.0.0.1:3901/backend/v3/api`
- Direct Portal App API Proxy: `http://127.0.0.1:3901/app/v3/api`
- Direct Portal Gateway OpenAPI Proxy:
  `http://127.0.0.1:3901/openapi.json`
- Direct Portal Admin API OpenAPI Proxy:
  `http://127.0.0.1:3901/backend/v3/api/openapi.json`
- Direct Portal App API OpenAPI Proxy:
  `http://127.0.0.1:3901/app/v3/api/openapi.json`
- Gateway OpenAPI: `http://127.0.0.1:18080/openapi.json`
- Admin API OpenAPI:
  `http://127.0.0.1:18081/backend/v3/api/openapi.json`
- App API OpenAPI: `http://127.0.0.1:18082/app/v3/api/openapi.json`
- OpenAI-compatible Gateway API: `http://127.0.0.1:18080/v1`
- Backend/Admin API: `http://127.0.0.1:18081/backend/v3/api`
- App API: `http://127.0.0.1:18082/app/v3/api`

Use `pnpm.cmd server:plan` to print the same URLs and command plan without
starting processes. Forward bind overrides through `--`, for example:

```powershell
pnpm.cmd dev -- --gateway-bind 0.0.0.0:19080 --server-bind 0.0.0.0:12900 --portal-bind 0.0.0.0:13900
```

The Rust edge server forwarding targets default to the loopback address for
the matching service bind. Override them when the edge server should forward
to another host or container network:

```powershell
pnpm.cmd dev -- --gateway-forward-url http://gateway.internal:18080 --backend-api-forward-url http://admin.internal:18081 --app-api-forward-url http://app.internal:18082
```

Forwarding URLs must be HTTP/HTTPS origins only. The Rust edge server uses
those origins for internal service-to-service proxying. The browser runtime API
bases stay same-origin in server mode:

- `PORTAL_PUBLIC_API_BASE_URL=/v1`
- `PORTAL_PUBLIC_OPEN_API_BASE_URL=/v1`
- `PORTAL_PUBLIC_BACKEND_API_BASE_URL=/backend/v3/api`
- `PORTAL_PUBLIC_APP_API_BASE_URL=/app/v3/api`

This avoids publishing loopback addresses such as `127.0.0.1` into browser
configuration and keeps remote deployments reachable through the same edge host
that served the portal. Direct `3901` portal dev requests proxy the same
same-origin API paths to the Rust services, so opening the Vite dev server
directly exercises the same SDK base URLs as the unified edge entrypoint.
Direct `18080`, `18081`, and `18082` service ports continue to work for
debugging and external proxy setups.

Production `pnpm.cmd start` supports the same edge bind and upstream target
controls after `pnpm.cmd build` has created the release artifact:

```powershell
pnpm.cmd start -- --server-bind 0.0.0.0:12900 --gateway-forward-url http://gateway.internal:18080 --backend-api-forward-url http://admin.internal:18081 --app-api-forward-url http://app.internal:18082
```

Its startup output includes the edge URLs, upstream forwarding targets, direct
OpenAPI/API paths, public browser API bases, health checks, and the selected
start command source (`release`, `env`, or `cargo`).

When the edge server is deployed behind a controlled HTTPS reverse proxy,
set the reported external scheme explicitly:

```powershell
pnpm.cmd dev -- --external-scheme https
pnpm.cmd start -- --external-scheme https
```

Only enable trusted forwarded headers when the edge server is not directly
reachable by clients and every inbound request comes from that controlled proxy:

```powershell
pnpm.cmd dev -- --external-scheme https --trust-forwarded-headers
pnpm.cmd start -- --external-scheme https --trust-forwarded-headers
```

By default, the edge server ignores inbound `x-forwarded-host`,
`x-forwarded-proto`, `x-forwarded-for`, `Forwarded`, and `x-real-ip` values to
prevent client-side header spoofing. It also drops hop-by-hop headers declared
through the HTTP `Connection` header on both request and response proxy paths.

## Standard Verification

Run the full commercial gate before delivery:

```powershell
pnpm.cmd verify
```

`pnpm.cmd verify` runs the static, build, production-smoke, and broad test gates
without starting the live `pnpm dev` workspace by default:

- `cargo fmt --check`
- `cargo check --all-targets` with `RUSTFLAGS=-D warnings`
- `node scripts/run-claw-router-product.test.mjs`
- `python -B -m tools.repository_delivery_guardian`
- `python -B -m tools.clawrouter_sdk_guardian`
- `python -B -m tools.clawrouter_skill_guardian`
- `python -B -m tools.architecture_standard_guardian`
- `python -B -m tools.rust_backend_architecture_guardian`
- `python -B -m tools.clawrouter_openapi_precision_audit`
- `python -B -m tools.clawrouter_payload_sdk_audit`
- `python -B -m tools.frontend_static_source_manifest --check`
- `python -B -m tools.frontend_contract_guardian`
- `python -B -m tools.schema_guardian`
- `python -B -m tools.flyway_schema_contract_audit`
- `python -B -m tools.frontend_operation_audit`
- `python -B -m tools.frontend_field_audit`
- `python -B -m tools.java_legacy_contract_audit`
- portal forced typecheck
- production artifact build
- portal bundle budget audit
- portal production edge smoke test
- portal production browser DOM smoke test
- portal local tool API disabled-by-default browser smoke
- `cargo test --workspace`
- `python -B -m unittest discover tests`
- `python -B -m tools.schema_quality_gate`

For a faster local pass while editing contracts only:

```powershell
node scripts/verify-claw-router-product.mjs --skip-contract-guardians
```

Do not use `--skip-contract-guardians` for final delivery.

The live edge dev smoke still exists, but it is opt-in because it launches
the root `pnpm dev` entrypoint, installer/catalog startup, Rust services, and
the portal dev server. Run it directly when you need that coverage:

```powershell
pnpm.cmd smoke:dev
```

To include the same live dev smoke inside `verify`, opt in explicitly:

```powershell
pnpm.cmd verify -- --with-edge-dev-smoke
```

If the local shell sandbox blocks `child_process.spawn`, the smoke prints a
skip message instead of failing. CI and release environments that require this
coverage should make the smoke mandatory:

```powershell
$env:CLAWROUTER_EDGE_DEV_SMOKE_REQUIRED="1"
pnpm.cmd verify -- --with-edge-dev-smoke
```

`CLAWROUTER_VERIFY_EDGE_DEV_SMOKE=1` also opts `verify` into the live dev smoke.
Use `node scripts/verify-claw-router-product.mjs --skip-edge-dev-smoke` only to
override an environment that would otherwise enable it.

## Fast Local Iteration

Use the fast gate during Codex or developer edit loops:

```powershell
pnpm.cmd verify:fast
```

`pnpm.cmd verify:fast` runs only the low-cost checks that catch common tooling
and source-standard regressions:

- `python -B -m tools.repository_delivery_guardian`
- `node scripts/run-claw-router-product.test.mjs`
- `pnpm.cmd --dir apps/sdkwork-claw-router-portal exec tsx auth-runtime.test.ts`
- `python -B -m unittest tests.test_frontend_source_hygiene_standard`

It intentionally skips Rust compile/tests, SDK and architecture guardians,
portal typecheck/build, production smoke tests, broad Python tests, and schema
quality gate. This makes it suitable for frequent local iteration, not final
delivery. Always run `pnpm.cmd verify` before release or handoff.

Clean rebuildable local artifacts when Codex or local tools slow down because
of stale temporary output:

```powershell
pnpm.cmd clean:fast
```

The default cleanup removes only rebuildable local output such as `.tmp`,
Python tool caches, portal `.turbo`, and portal `dist`. It does not remove
`target`, portal `node_modules`, generated OpenAPI artifacts, generated SDK
source, or schema registry files. Keep `target` and `node_modules` unless disk
pressure is more important than fast recompilation/reinstall avoidance. For an
explicit deep cleanup, call the script directly with opt-in flags:

```powershell
node scripts/clean-claw-router-workspace.mjs --rust-target --node-modules
```

## Release Preflight

Run the lightweight preflight before the full commercial gate:

```powershell
pnpm.cmd release:preflight
```

The preflight is read-only. It checks that the current branch is `main`,
`main...origin/main` is synchronized, the `sdkwork-claw-router` application
worktree is clean, required commands are available, staging/Postgres
environment variables are present, Git LFS is available, LFS-managed bundled
skill seed JSON files are hydrated, and local Codex/Git IO footprint is not
large enough to slow command input. Missing staging environment variables are
warnings by default so local developers can still run the check before a
release host is provisioned. If a fresh clone has LFS pointer files instead of
real skill seed JSON, run `git lfs pull` before building or packaging.

Release preflight uses Node `child_process.spawn` probes through `execFile` to
inspect Git state and required tool availability. If the local execution
environment blocks process creation, for example with `spawn EPERM`, the
`runtime.childProcess` check fails, and Git, tool availability, and Git object
IO footprint checks are downgraded to warnings instead of being misreported as
missing commands or successful cleanliness checks. Run release preflight from a
local shell or CI runner that permits Node child process execution before
packaging a commercial release.

Use strict mode on CI, staging, or release packaging hosts:

```powershell
pnpm.cmd release:preflight -- --strict --env-file .env.release.local --strict-root-clean
```

## Release Environment Contract

Release and staging hosts must satisfy the executable environment contract in
`scripts/release-environment-contract.mjs`. The checked-in template is
`.env.release.example`; use it as a reviewable reference for release variable
names and example value shapes. Generate `.env.release.local` on the release
host from the host process environment, and never commit the local file.

Required release verification variable:

```text
SDKWORK_CLAW_POSTGRES_TEST_DATABASE_URL
```

Required browser-visible portal runtime variables:

```text
PORTAL_PUBLIC_API_BASE_URL
PORTAL_PUBLIC_APP_API_BASE_URL
PORTAL_PUBLIC_BACKEND_API_BASE_URL
PORTAL_PUBLIC_TOOL_API_ENABLED
```

Optional browser-visible SDK runtime override:

```text
PORTAL_PUBLIC_OPEN_API_BASE_URL
```

Run strict preflight against the local release env file before packaging:

```powershell
pnpm.cmd release:env:write -- --check
pnpm.cmd release:env:write
pnpm.cmd release:preflight -- --strict --env-file .env.release.local --strict-root-clean
```

`PORTAL_PUBLIC_*` values are intentionally visible to the browser through
`/runtime-env.js`; do not place secrets in them. The Postgres URL is used only
for release verification and Postgres contract tests.
`pnpm.cmd release:env:write` reads the contract variables from the release
host process environment, refuses to overwrite `.env.release.local` unless
`--force` is passed, refuses to write the checked-in `.env.release.example`
template, and prints only a safe summary without variable values.

`--strict` upgrades missing release environment variables to failures.
`--strict-root-clean` also fails when unrelated files outside this application
are dirty. For machine-readable CI output, add `--json`. For a non-probing
command plan, add `--dry-run`. Dry-run output marks local probe checks as
warnings with `dry-run:` details; it documents what would be checked, but it
does not prove the branch, worktree, required commands, child process runtime,
Codex session footprint, or Git object footprint are release-ready.

## Install Package Planning

The install package standard is executable through
`scripts/plan-claw-router-install-packages.mjs`. It is intentionally plan-only:
it does not run `pnpm dev`, does not launch the live edge dev smoke, does not
start production services, and does not build platform packages. Real archive,
service, container, and desktop builders must consume this plan so Windows,
Linux, macOS, x64, arm64, archive, service, container, desktop, and database
configuration delivery cannot drift.

Run the planner before wiring package builders:

```powershell
pnpm.cmd install:packages:plan
pnpm.cmd install:packages:check
pnpm.cmd install:package:check
pnpm.cmd install:init:smoke
node scripts/plan-claw-router-install-packages.mjs --json --check
```

The default matrix contains 24 package contracts: `windows`, `linux`, and
`macos` multiplied by `x64` and `arm64`, then by `archive`, `service`,
`container`, and `desktop`. Examples include `windows-x64-service`,
`linux-arm64-container`, and `macos-arm64-desktop`. Each package contract
declares:

- the Rust edge binary, `sdkwork-claw-gateway` or
  `sdkwork-claw-gateway.exe`
- the installer binary, `sdkwork-claw-installer` or
  `sdkwork-claw-installer.exe`
- `portal/dist` production assets
- `portal/dist/sdk-archives` generated SDK ZIP artifacts
- `.env.release.example` as a reference template only
- `config/sdkwork-claw-router.toml.example` as the runtime configuration
  template
- an `install-manifest.json`
- service manifests for service mode and container entrypoint metadata for
  container mode
- desktop metadata for desktop mode

Database defaults are explicit by package profile. `archive`, `service`, and
`container` are server release profiles and default to PostgreSQL. Server
packages require the deployed host to provide a managed PostgreSQL DSN in the
runtime TOML config or through `SDKWORK_CLAW_DATABASE_URL`. The desktop packages default to a local SQLite database in the operating system user data directory
and may still be pointed at another database through the same runtime config
file.

The runtime config file is TOML and supports:

```toml
[database]
engine = "postgresql"
url = "postgresql://sdkwork_claw_router:change-me@localhost:5432/sdkwork_claw_router"
max_connections = 16
```

Desktop templates use:

```toml
[database]
engine = "sqlite"
url = "sqlite://<os-user-data-dir>/sdkwork-claw-router.sqlite"
max_connections = 1
```

The standard config file locations are:

- Linux server: `/etc/sdkwork-claw-router/sdkwork-claw-router.toml`
- Linux desktop: `${XDG_CONFIG_HOME:-~/.config}/sdkwork-claw-router/sdkwork-claw-router.toml`
- Windows server: `%ProgramData%/SdkWork/Claw Router/sdkwork-claw-router.toml`
- Windows desktop: `%APPDATA%/SdkWork/Claw Router/sdkwork-claw-router.toml`
- macOS server: `/Library/Application Support/SdkWork/Claw Router/sdkwork-claw-router.toml`
- macOS desktop: `~/Library/Application Support/SdkWork/Claw Router/sdkwork-claw-router.toml`

At runtime, `SDKWORK_CLAW_CONFIG_FILE` can point to any explicit TOML config
file. `SDKWORK_CLAW_DATABASE_URL` and
`SDKWORK_CLAW_DATABASE_MAX_CONNECTIONS` override the file for emergency
operations and container orchestration. The Rust gateway, installer, admin API,
and app API all read this shared configuration layer through
`sdkwork-claw-config`.

Fast initialization is standardized around host-local environment generation
and installer commands:

```powershell
pnpm.cmd release:env:write -- --check
pnpm.cmd release:env:write -- --force
sdkwork-claw-installer ensure
sdkwork-claw-installer refresh-catalog --force
```

On Linux and macOS, the same package contract uses `pnpm` instead of
`pnpm.cmd` and extensionless binaries. Health and readiness checks are always
`/healthz` and `/readyz`.

Security defaults are part of the matrix: packages must not include secrets,
must not include `.env.release.local`, must generate local env files on the
install or release host, must treat `.env.release.example` as reference-only,
and must keep trusted forwarded headers disabled by default. Enable forwarded
header trust only when a controlled reverse proxy is the sole inbound client.

`scripts/build-claw-router-install-package.mjs` consumes the same matrix to
create one install package from a staged production directory. The default
`pnpm.cmd install:package:check` command is dry-run only, so it validates the
full 24-package builder matrix without requiring `pnpm.cmd build` output. To
build a real package, stage the package contents under a directory shaped like
the package plan and pass it explicitly:

```powershell
pnpm.cmd install:package:build -- --package-id windows-x64-archive --staging-root dist\install-package-staging --output-dir dist\install-packages
```

The builder writes the package archive, a per-package manifest, and
`install-packages-manifest.json` with file size and SHA-256 checksums. Windows
packages use real ZIP bytes for `.zip`; Linux and macOS packages use real
gzip-compressed tar bytes for `.tar.gz` and preserve executable mode on
extensionless binaries under `bin/`. The tar writer supports standard ustar
prefix paths for nested production asset names. Service packages generate
Windows service, systemd, or launchd manifests from the shared package plan.
All packages generate `config/sdkwork-claw-router.toml.example`. Container
packages generate a `container/Containerfile`, platform-specific
entrypoint (`container/entrypoint` on Linux/macOS,
`container/entrypoint.ps1` on Windows), and `container/metadata.json` without
starting services. Desktop packages generate `desktop/metadata.json` with the
desktop SQLite policy and OS config/data directories. The builder excludes
`.env.release.local` even if it exists in the staging directory. Add `--json`
for pure machine-readable output.

`scripts/smoke-install-package-init.mjs` validates the fast initialization
contract separately from service startup. The default root command is a dry-run
smoke that creates a temporary install root, writes a safe
`.env.release.local`, writes a temporary `sdkwork-claw-router.toml`, verifies
that server package dry-runs use PostgreSQL while desktop package dry-runs use
a file-backed SQLite URL, verifies `sdkwork-claw-installer ensure` plus
`sdkwork-claw-installer refresh-catalog --force` are the only installer
actions, and confirms `/healthz` plus `/readyz` remain the readiness contract.
It never starts `pnpm dev`, the live edge dev smoke, or production services.

```powershell
pnpm.cmd install:init:smoke
node scripts/smoke-install-package-init.mjs --package-id linux-arm64-container --check --dry-run --json
```

On a release host with a staged package or built installer binary, upgrade the
same smoke to a real installer check by passing `--installer-bin` and an
isolated `--tmp-root`:

```powershell
node scripts/smoke-install-package-init.mjs --package-id linux-x64-archive --package-root dist\install-package-staging --installer-bin bin\sdkwork-claw-installer --tmp-root target\install-init-smoke\linux-x64 --check
```

Relative `--installer-bin` values are resolved from `--package-root` first, then
from the workspace root. When `--package-root` is provided it must already
exist, which prevents a typo from silently creating and validating an empty
package directory.

## Production Browser Smoke

`pnpm.cmd verify` runs
`node apps/sdkwork-claw-router-portal/scripts/smoke-production-browser.mjs`
after the production edge smoke and before portal runtime tests. The script runs
the built portal through the Rust edge server in a real Chromium-family browser through Chrome
DevTools Protocol and verifies:

- `/runtime-env.js` loads before the hashed portal bundle.
- `window.__CLAWROUTER_ENV__` contains the expected public API, app SDK API,
  backend SDK API, and local tool API values.
- The browser locale is fixed to `en-US` through Chrome launch flags and
  Chrome DevTools Protocol, so DOM text assertions are stable on CI and release
  hosts with different OS languages.
- The public route matrix renders expected DOM content for `/models`,
  `/models/openai%2Fgpt-4o-mini`, `/rankings`, `/courses`, `/courses/c1`,
  `/forum`, `/forum/1`, `/apps`, `/apps/app-1`, `/skills-hub`,
  `/skills-hub/skill-1`, and `/api-reference`.
- SDK-backed `/models` routes also use route-scoped Chrome DevTools Protocol
  `Fetch` fixtures for `/app/v3/api/router/models`, proving the generated app
  SDK runtime catalog can render successful runtime models, access-group
  filtering, search no-result state, empty-runtime fallback to the static seed
  catalog, encoded runtime detail routes, public reference/unavailable price
  status, performance source labels, and `Try in Playground` detail actions
  without exposing private pricing tokens in the DOM.
- Schema-provenanced `/courses` routes also exercise catalog category
  filtering, level filtering, search filtering, card navigation,
  `/courses/c1` detail rendering, Bilibili iframe URL/referrer policy,
  lesson-grid interaction, related-course navigation, missing-detail fallback,
  deterministic snapshot labels, and discussion copy while rejecting unsafe
  runtime drift tokens such as `javascript:alert(1)`, `Math.random`, and
  `toLocaleDateString`.
- Schema-provenanced `/forum` routes also exercise catalog category filtering,
  search filtering, empty-result fallback, top-sort ordering, post-card
  navigation, `/forum/1` detail rendering, related-discussion navigation,
  missing-detail fallback, accessible search controls, deterministic snapshot
  labels, and comment copy while rejecting browser runtime drift tokens such as
  `Math.random` and `toLocaleDateString`.
- SDK-backed App Center and Skills Hub routes wait for their asynchronous
  route-specific DOM text before final assertions, so recoverable SDK/API
  failure states are verified in the production browser gate instead of being
  sampled while the route is still loading.
- SDK-backed App Center and Skills Hub success paths use route-scoped Chrome
  DevTools Protocol `Fetch` fixtures for `/app/v3/api` responses, proving the
  generated app SDK request path can render successful catalog, detail,
  artifact, and install-command UI without adding mock endpoints to the
  production portal runtime.
- SDK-backed App Center and Skills Hub edge paths also use route-scoped
  `/app/v3/api` CDP fixtures for empty catalog responses, catalog search/filter
  no-result states, detail missing-record fallback rendering, partial
  category-load business failures, and retry-click recovery after transient SDK
  failures. The retry routes intentionally fail the first generated SDK list
  request, click the visible `Retry` action in the browser, and then assert the
  successful catalog DOM replaces the error state.
- `/api-reference` API Playground paths use route-scoped Chrome DevTools
  Protocol fixtures for explicit external playground requests to
  `https://tenant-api.example.com/api/*`. The browser smoke now opens
  `Try it out`, verifies missing required path-variable validation, exercises
  bulk edit conversion and managed-header rejection, sends a real POST through
  the browser fetch path with CORS preflight handling, checks `200 OK`
  response body/header tabs, probes Save Response plus Copy Response without
  touching the host download directory or system clipboard, preserves JSON
  primitive/null response bodies through raw rendering, clipboard, and download
  actions, verifies `Send and Download`, switches to Bearer Token auth and
  verifies the outgoing `Authorization` header without exposing the token in
  rendered body text, simulates a deterministic `ConnectionFailed` browser
  fetch failure and verifies the `0 Network Error` response state, checks the
  drawer close path plus production max-width constraint, and verifies
  production-disabled local tool APIs keep the static code-snippet fallback
  visible without issuing a browser request to `/api/code-snippet`. The same
  static-snippet path switches TypeScript from `axios` to `fetch` in the
  production DOM and verifies `Copy code` writes the currently rendered snippet
  to the browser clipboard probe.
- browser runtime exceptions, console warnings/errors, and private pricing
  tokens are not present on the checked routes.

Local machines that cannot launch Chrome or Edge from Node may skip this smoke
with an explicit `[browser-smoke] skipped` message. CI and release packaging
must make the check mandatory:

```powershell
$env:CLAWROUTER_BROWSER_SMOKE_REQUIRED="1"
pnpm.cmd verify
```

Use `CLAWROUTER_BROWSER_EXECUTABLE` to point at a specific Chrome, Edge, or
Chromium executable. If the process cannot spawn a browser, start one outside
the Node process and provide its DevTools port:

```powershell
& "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --remote-debugging-address=127.0.0.1 --remote-debugging-port=9222 --user-data-dir="$env:TEMP\clawrouter-browser-smoke" about:blank
$env:CLAWROUTER_BROWSER_DEBUG_PORT="9222"
$env:CLAWROUTER_BROWSER_SMOKE_REQUIRED="1"
node apps\sdkwork-claw-router-portal\scripts\smoke-production-browser.mjs
```

## Postgres Integration

Optional Postgres contract tests:

```powershell
pnpm.cmd test:postgres
```

Required Postgres contract tests with an existing database:

```powershell
$env:SDKWORK_CLAW_POSTGRES_TEST_DATABASE_URL="postgres://user:password@127.0.0.1:5432/dbname"
pnpm.cmd test:postgres:required
```

Ephemeral Docker-backed Postgres contract tests:

```powershell
pnpm.cmd test:postgres:docker
```

Docker mode uses `docker-compose.postgres-test.yml`, Postgres 16, a tmpfs data
directory, health checks, and port `${SDKWORK_CLAW_POSTGRES_TEST_PORT:-15432}`.
Install and start Docker Desktop before using Docker mode.

## SDK And Contract Regeneration

When an app or backend endpoint, payload, field, or table contract changes,
regenerate through the contract pipeline instead of editing generated SDK files.

```powershell
python -B -m tools.api_contract_manifest
python -B -m tools.clawrouter_openapi_generator
python -B -m tools.clawrouter_gateway_openapi_generator
python -B -m tools.schema_quality_gate
```

If SDK package output must be regenerated, use the project skills under
`.agents/skills/` for the exact app and backend SDK commands.

## Commercial Delivery Rules

- No raw `/app/v3/api` or `/backend/v3/api` business calls in frontend product
  code. Use the generated SDK packages.
- No fake-success branches, local DTO forks, or mock async business data in
  commercial routes.
- No unclassified portal route. SDK-backed routes must have frontend operation
  contracts and use the expected generated SDK client. Schema content routes
  must name provenance tables, cite real evidence files, match the lazy-loaded
  route package, avoid browser runtime network clients, and declare
  `static_delivery` so static seed/catalog/reference content cannot silently
  replace required runtime APIs. All static delivery modes must reference the
  generated static source manifest through `source_manifest_ref`; inline
  `source_metadata` is rejected because hashes must be generated, not hand
  copied. Local tool routes must be gated by `VITE_TOOL_API_ENABLED` in the
  browser runtime and `PORTAL_PUBLIC_TOOL_API_ENABLED` in the Rust edge
  runtime, and every raw browser `fetch`
  source must be listed in
  `browser_network_sources` with the standard endpoint purpose.
- No manual edits to generated SDK output.
- No table, column, index, migration, or embedded database schema change without
  explicit approval.
- No sensitive values in logs, traces, UI state, screenshots, or generated docs.
- Root delivery docs stay ASCII-only so Windows, CI, and customer terminals show
  stable content.
- Every feature path must have schema, OpenAPI, SDK, backend, frontend, and test
  coverage appropriate to its risk.

## Portal Production Security

The Rust edge server emits strict portal security headers and disables local
tool APIs unless `PORTAL_PUBLIC_TOOL_API_ENABLED` is explicitly enabled. Its CSP `connect-src`
defaults to:

```text
'self' https://api.sdkwork.com
```

For private deployments whose browser needs to call a different API origin,
set `PORTAL_CSP_CONNECT_SRC` to a comma- or space-separated list of additional
HTTP/HTTPS origins, for example:

```powershell
$env:PORTAL_CSP_CONNECT_SRC="https://tenant-api.example.com https://admin-api.example.com"
```

Entries must be origins only, without paths, query strings, fragments, semicolon
directives, or quotes. Invalid values fail portal startup so a deployment cannot
silently run with an unsafe or broken CSP.

The portal also exposes browser runtime configuration through `/runtime-env.js`
so customer deployments can change API targets without rebuilding static
assets. Use only `PORTAL_PUBLIC_*` variables for values that are intended to be
visible in the browser:

```powershell
$env:PORTAL_PUBLIC_API_BASE_URL="https://tenant-api.example.com/api"
$env:PORTAL_PUBLIC_OPEN_API_BASE_URL="https://tenant-api.example.com/api"
$env:PORTAL_PUBLIC_APP_API_BASE_URL="/app/v3/api"
$env:PORTAL_PUBLIC_BACKEND_API_BASE_URL="/backend/v3/api"
$env:PORTAL_PUBLIC_TOOL_API_ENABLED="false"
$env:PORTAL_TOOL_API_RATE_LIMIT_REQUESTS="120"
$env:PORTAL_TOOL_API_RATE_LIMIT_WINDOW_SECONDS="60"
$env:PORTAL_TOOL_API_SDK_GENERATOR_BASE_URL=""
$env:PORTAL_TOOL_API_SDK_GENERATOR_API_KEY=""
$env:PORTAL_TOOL_API_SDK_ARCHIVE_ROOT="D:\release\clawrouter-sdk-archives"
```

`PORTAL_PUBLIC_API_BASE_URL`, `PORTAL_PUBLIC_OPEN_API_BASE_URL`,
`PORTAL_PUBLIC_APP_API_BASE_URL`, and `PORTAL_PUBLIC_BACKEND_API_BASE_URL`
accept HTTP/HTTPS URLs or root-relative paths. Query strings, fragments,
protocol-relative URLs, control characters, and non-HTTP schemes fail startup.
`PORTAL_PUBLIC_OPEN_API_BASE_URL` is the generated
`@sdkwork/clawrouter-open-sdk` base URL and defaults to
`PORTAL_PUBLIC_API_BASE_URL` when unset. Absolute runtime API origins are added to
the production CSP `connect-src` automatically. `/runtime-env.js` is served with
`Cache-Control: no-store` and is referenced before the hashed portal bundle so
SDK clients read deployment values before they are constructed.

When `PORTAL_PUBLIC_TOOL_API_ENABLED=true`, the Rust edge server serves the
local portal tool API under `/api/code-snippet`, `/api/sdk-readme`, and
`/api/generate-sdk`. These routes are disabled by default and are rate limited
by `PORTAL_TOOL_API_RATE_LIMIT_REQUESTS` per
`PORTAL_TOOL_API_RATE_LIMIT_WINDOW_SECONDS`. The limiter buckets by remote
client IP. When `SDKWORK_CLAW_EDGE_TRUST_FORWARDED_HEADERS=1`, the limiter uses
the first valid IP from `x-forwarded-for`; only enable that mode behind a
controlled reverse proxy. Limited requests return HTTP 429 with `Retry-After`,
`RateLimit-Limit`, `RateLimit-Remaining`, and `RateLimit-Reset` headers.

`/api/generate-sdk` calls the Rust SDK generator service and returns the
generated ZIP archive directly. `PORTAL_TOOL_API_SDK_GENERATOR_BASE_URL` may be
set to an explicit generator origin; when it is empty, the edge server defaults
to the current web page origin derived from the incoming request host and
scheme. Configure `PORTAL_TOOL_API_SDK_GENERATOR_API_KEY` when the generator
requires a bearer token. Standard `pnpm.cmd build` also creates generated
TypeScript app and backend SDK runtime packages and writes prebuilt SDK ZIP archives
into `apps/sdkwork-claw-router-portal/dist/sdk-archives`; `pnpm.cmd start`
uses that directory as `PORTAL_TOOL_API_SDK_ARCHIVE_ROOT` by default. When a
live generator request fails and `PORTAL_TOOL_API_SDK_ARCHIVE_ROOT` is
configured, the edge server falls back to a matching prebuilt ZIP.

Archive fallback lookup is constrained to the configured directory, rejects
path traversal identity values, returns `application/zip` with
`Content-Disposition: attachment`, and keeps `Cache-Control: no-store` plus
`X-Content-Type-Options: nosniff`. Only the generated TypeScript app and
backend SDK packages are available through the fallback path. Requests for any
other fallback package, language, or version return `unsupported_sdk_archive`,
even if a matching ZIP file exists in the archive directory.

The generated app SDK archive is:

```text
sdkwork-clawrouter-app-sdk-typescript-0.1.0.zip
```

The generated backend SDK archive is:

```text
sdkwork-clawrouter-backend-sdk-typescript-0.1.0.zip
```

If the live generator fails and `PORTAL_TOOL_API_SDK_ARCHIVE_ROOT` is not
configured, `/api/generate-sdk` returns `sdk_generator_failed`. If fallback is
configured but the normalized archive is missing, it returns
`sdk_archive_not_found`.

## Recommended Delivery Sequence

1. On CI or a release host, run `pnpm.cmd release`. The root release script
   runs `pnpm.cmd release:env:write -- --check`, regenerates
   `.env.release.local` with `--force`, runs strict release preflight, and then
   runs `pnpm.cmd verify`.
2. For local handoff without real release secrets, run
   `pnpm.cmd release:preflight` and `pnpm.cmd verify:fast`.
3. In CI or release packaging, opt into the live dev edge smoke when required
   with `pnpm.cmd verify -- --with-edge-dev-smoke` and
   `CLAWROUTER_EDGE_DEV_SMOKE_REQUIRED=1`.
4. In CI or release packaging, run the same gate with
   `CLAWROUTER_BROWSER_SMOKE_REQUIRED=1` and a working Chrome/Edge/Chromium
   DevTools target.
5. Run `pnpm.cmd test:postgres:docker` when Docker Desktop is available.
6. Review generated audits under `generated/schema/frontend/`.
7. Review `docs/schema-registry/frontend-route-classification.yaml` for any
   added or touched route, including evidence files, package binding, and
   delivery kind. For `schema_provenanced_content`, verify
   `source_manifest_ref` exists in
   `generated/schema/frontend/frontend-static-source-manifest.json`; refresh it
   with `python -B -m tools.frontend_static_source_manifest` after changing
   `docs/schema-registry/frontend-static-source-snapshots.yaml` or any
   referenced source file.
7. Confirm no touched frontend business path bypasses generated SDK clients.
8. Confirm production artifacts pass bundle budget and server smoke checks.
9. Record command evidence in `CHECK_RESULT.md`.

## License

SDKWork Claw Router application source is licensed under
`AGPL-3.0-or-later AND LicenseRef-SDKWork-Commercial-Restriction`. See
[LICENSE](./LICENSE) and [COMMERCIAL-LICENSE.md](./COMMERCIAL-LICENSE.md).

This is not an unmodified AGPL-only commercial grant. Commercial use requires
prior written authorization from SDKWork. Unauthorized commercial deployment,
SaaS or managed-service operation, commercial integration, resale, white-label
delivery, paid implementation services, and commercial production use are
prohibited.

未经 SDKWork 书面授权，禁止商业使用、商业部署、商业集成、转售、托管服务、
SaaS 服务、白标交付、付费咨询实施服务，以及任何营利性或商业组织生产环境使用。

Generated SDK packages, standalone data packages, vendored artifacts, and
third-party dependencies may include their own license files. Those package or
artifact license files govern the corresponding generated, standalone,
vendored, or third-party artifact unless SDKWork explicitly replaces that
license notice in its package directory.
