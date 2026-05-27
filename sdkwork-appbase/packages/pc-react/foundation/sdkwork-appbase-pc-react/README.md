# @sdkwork/appbase-pc-react

## Purpose

Composable application preset, capability registry, and package selection surface for SDKWork PC React applications.

## Placement

- Architecture: `pc-react`
- Domain: `foundation`
- Capability: `appbase`
- Status: `ready`

## Depends on

- `@sdkwork/ui-pc-react` for shared UI primitives and patterns
- Appbase capability packages for shell, routing, workspace, command, and search composition
- Commerce capability packages are registered as independent modules rather than bundled into wallet or membership

## Ownership

This package owns the app-level capability catalog and manifest helpers. It does not own generated SDK clients, domain services, or feature UI internals.

## Runtime Boundary

Feature packages expose their own service and route contracts. `@sdkwork/appbase-pc-react` composes package names, domains, and preset manifests without adding package-local SDK forks or transport bypasses.

## Verification

- `pnpm --filter @sdkwork/appbase-pc-react typecheck`
- `pnpm exec vitest run packages/pc-react/foundation/sdkwork-appbase-pc-react/tests/catalog.test.ts --config vitest.config.ts --configLoader native --pool vmThreads`
