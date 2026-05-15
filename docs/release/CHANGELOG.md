# Changelog

All notable changes to `sdkwork-claw-router` release records will be documented here.

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
