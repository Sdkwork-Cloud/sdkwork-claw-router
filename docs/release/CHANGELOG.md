# Changelog

All notable changes to `sdkwork-claw-router` release records will be documented here.

## 2026-05-16 - v0.2.0

### Scope

- Adds a complete runtime authentication settings capability after the successful `v0.1.0` release.
- No separately published failed version exists after `v0.1.0`; an initial `v0.2.0` package workflow failed before build due to Git LFS budget exhaustion and is folded into this successful release record.

### Delivered

- Added admin-managed auth settings for login methods, QR login, OAuth visibility, recovery methods, registration methods, and verification policy.
- Added app runtime auth settings retrieval so the portal can render login behavior from the active policy instead of a static local matrix.
- Added SQL-backed auth settings stores for SQLite and PostgreSQL and registered them through the product infrastructure modules.
- Enforced auth settings across password, email code, phone code, QR, session bridge, recovery, and registration flows while keeping password-only as the strict default.
- Added portal admin routing and UI for auth settings management.
- Regenerated OpenAPI documents, API contract manifests, schema registry outputs, frontend manifests, and app/backend/open SDK surfaces for the new contracts.
- Updated Rust tests to explicitly opt into non-default auth methods when testing bridge, QR, code login, and registration verification behavior.
- Updated installer CLI tests so SQLite scenarios explicitly run under the desktop deployment profile.
- Added native installer release assets for service and desktop modes: Linux `.deb`, Windows `.msi`, and macOS `.pkg`.
- Updated release packaging so portable archives remain for `archive` and `container`, while native installers are uploaded for `service` and `desktop`.
- Changed server/service package defaults to local SQLite for single-node zero-config startup, with PostgreSQL documented as the production and multi-node option.
- Updated Linux `.deb` service installation so the package creates `/etc/default/clawrouter`, generates the default runtime TOML, and runs installer initialization from systemd before starting the gateway.
- Simplified English and Chinese installation and initialization guides so Ubuntu/Debian service install is `apt install` plus `systemctl enable --now`.
- Standardized the external runtime surface on `clawrouter`, including `clawrouter-*` release assets, the `clawrouter` gateway process, the `clawrouterctl` installer/admin CLI, `clawrouter.service`, and `/opt/clawrouter`, `/etc/clawrouter`, `/etc/default/clawrouter`, `/var/lib/clawrouter`, and `/var/log/clawrouter` runtime paths.
- Removed release checkout dependency on Git LFS by committing curated runtime skill seed JSON files directly to Git while leaving large ClawHub mirror snapshots as optional LFS data.

### Verification

- `cargo fmt --all`
- `cargo test -p sdkwork-claw-app-api --test app_session_route -- --nocapture`
- `cargo test -p sdkwork-claw-product --test app_auth_api -- --nocapture`
- `cargo test -p sdkwork-claw-installer --test installer_cli installer_cli_reports_invalid_env_catalog_root_as_machine_readable_config_error -- --nocapture`
- `node scripts/plan-claw-router-install-packages.mjs --check`
- `node scripts/build-claw-router-install-package.mjs --all --check --dry-run --json`
- `node scripts/build-claw-router-native-installer.mjs --all --check --dry-run --json`
- `node scripts/run-claw-router-product.test.mjs`
- `node scripts/release-preflight.mjs --dry-run --json`
- `cargo test -p sdkwork-claw-product --test database_installer sqlite_installer_repairs`
- Local Windows WiX fixture build for `windows-x64-desktop` `.msi`
- GitHub Actions `Release Package` run `25957200472`, covering Linux x64, Linux arm64, Windows x64, Windows arm64, macOS x64, and macOS arm64.

### Release Gate Status

- Sibling SDK/shared repository gate is satisfied: `sdkwork-appbase` is clean at `3280447`, `sdkwork-core` was committed and pushed at `339ab3e`, `sdkwork-ui` was committed and pushed at `a4c9094`, and the user-specified `sdkwork-im-sdk` checkout under `apps\craw-chat\sdks\sdkwork-im-sdk` was committed and pushed at `8245ff9`.
- Full `pnpm verify` was skipped by release-operator instruction for this release attempt.
- Git LFS is no longer a release package build requirement; it is only required when refreshing large ClawHub mirror snapshots.

## 2026-05-15 - v0.1.0

### Scope

- First formal release record for this repository.
- No prior successful release tag existed, so this release aggregates the full baseline from the initial commit through the current release-ready state.

### Delivered

- Added runtime configuration management with OS-standard config paths for server and desktop deployments.
- Made server deployments default to PostgreSQL and block startup when the database URL is missing or still points at the placeholder value.
- Made desktop deployments default to SQLite and auto-initialize a platform-appropriate config and data location.
- Added release environment contract tooling so `.env.release.local` can be generated and validated from the executable contract instead of hand-written.
- Added release preflight checks for environment completeness, root cleanliness, and release-safe configuration values.
- Added manifest-backed install package planning and archive generation for Windows, Linux, and macOS across x64 and arm64.
- Added install package coverage for archive, service, container, and desktop deployment modes.
- Added install initialization smoke coverage to prove the release package can initialize without starting `pnpm dev`.
- Added portal and SDK runtime base URL configuration so gateway, app, backend, and open API surfaces can be addressed explicitly.
- Added repository delivery and LFS seed guards so release validation can fail fast when shared content or seed material is missing.
- Documented release record conventions so future releases can append cleanly without inventing new formats.

### Architecture Capability Impact

- Server and desktop deployments now follow distinct database policies instead of sharing a one-size-fits-all default.
- Release packages carry a single versioned matrix for platform, architecture, and deployment mode, which makes downstream packaging and CI selection deterministic.
- Release configuration is contract-driven, which reduces drift between environment files, runtime behavior, and install package metadata.
- The release flow can be validated through dry-run and smoke-style checks without starting the edge development server.

### Verification

- `node scripts/run-claw-router-product.test.mjs`
- `node scripts/plan-claw-router-install-packages.mjs --check`
- `node scripts/build-claw-router-install-package.mjs --check --dry-run --all`
- `node scripts/smoke-install-package-init.mjs --check --dry-run`

### Risks / Remaining Work

- Full binary release packaging still depends on the broader release environment and should be exercised in a real packaging run before shipping artifacts.
- Shared sibling repositories must remain aligned with their committed `origin/main` revisions before publishing a release.
- Future releases should continue to keep the release environment contract, install package matrix, and runtime configuration help text in sync.
