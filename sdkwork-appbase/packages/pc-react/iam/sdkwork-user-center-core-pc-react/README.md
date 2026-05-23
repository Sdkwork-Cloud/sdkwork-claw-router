# @sdkwork/user-center-core-pc-react

Server-safe canonical IAM and user-center contract package for SDKWork applications.

This package is the non-UI root of the unified user-center and login-validation system. It is the correct integration surface for server runtimes, runtime bridges, deployment/env generation, native Rust boundaries, route builders, and application wrappers that need canonical IAM behavior without React UI concerns.

## What this package owns

- canonical app-facing auth and user-center route contracts
- token, header, session, and handshake rules shared by web, desktop, server, and native hosts
- deployment-profile generation for `desktop-local`, `server-private`, and `cloud-saas`
- canonical command-matrix generation across `desktop`, `web`, and `server` surfaces
- seed-contract schemas for authority, auth-development, catalog, and starter-workspace domains
- runtime bridge factories and runtime-binding contracts
- server plugin definitions and route-projection helpers
- native parity contracts consumed by `native/tauri-rust`

UI composition intentionally stays outside this package in `@sdkwork/user-center-pc-react` and `@sdkwork/auth-pc-react`.

## Canonical entrypoints

- `createUserCenterDeploymentProfiles(...)` and `createIdentityDeploymentProfile(...)`
- `createUserCenterDeploymentEnvArtifact(...)` and `renderUserCenterDeploymentEnvTemplate(...)`
- `createUserCenterCommandMatrix()`
- `createUserCenterSeedContractCatalog()`
- `createCanonicalUserCenterRuntimeBridge(...)`
- `createSdkworkCanonicalUserCenterDefinition(...)`
- `createUserCenterServerPluginDefinition(...)`

## Deployment and seed rules

- `desktop-local`: builtin-local provider, embedded authority, SQLite storage, builtin bootstrap user, fixed verify code, and starter workspace contracts enabled
- `server-private` with `builtin-local`: same facade contract as every other mode, but authority lives on the dedicated application server
- `server-private` with `external-user-center`: same facade contract, provider switching happens behind the server boundary, and callers must not assume builtin-local seed data exists
- `cloud-saas`: upstream `sdkwork-cloud-app-api`, upstream-managed authority, builtin-local authority seed and fixed verify code disabled, fail closed when upstream bridge env is incomplete

Remote providers must not silently synthesize builtin-local bootstrap users, starter projects, or verification-code fallbacks.

## Thin-wrapper integration

Application wrappers should supply only app-local inputs such as namespace, routes, titles, sqlite paths, storage topology, and branding metadata.

- use `createSdkworkCanonicalUserCenterDefinition(...)` to bind package identity, routes, title, and namespace
- use `definition.createConfig(...)`, `definition.createPluginDefinition(...)`, `definition.createServerPluginDefinition(...)`, and `definition.createServerOperations(...)` instead of rebuilding route or manifest defaults locally
- use `createCanonicalUserCenterRuntimeBridge(...)` when a runtime needs canonical bridge config, runtime config, and runtime client assembly from one shared definition
- pair this package with `createCanonicalAuthRuntimeComposition(...)` from `@sdkwork/auth-runtime-pc-react` when the shared auth surface should receive governed development-prefill behavior

## Governance

- `pnpm --dir sdkwork-appbase test:workspace-vitest -- --run sdkwork-appbase/packages/pc-react/iam/sdkwork-user-center-core-pc-react/tests/userCenterDeploymentContract.test.ts sdkwork-appbase/packages/pc-react/iam/sdkwork-user-center-core-pc-react/tests/userCenterCommandMatrixContract.test.ts sdkwork-appbase/packages/pc-react/iam/sdkwork-user-center-core-pc-react/tests/userCenterSeedContract.test.ts`
- `pnpm --dir sdkwork-appbase test:user-center-standard-contracts`
- `node sdkwork-appbase/scripts/run-iam-standard-governance.mjs`

If an application-specific change would alter deployment semantics, command naming, handshake behavior, or seed rules, move that change into this package first and then let the product wrapper consume it.
