# sdkwork-clawrouter-pc-admin-oauth

Domain: iam
Capability: oauth
Package type: node-package
Status: standardizing

This package owns the Claw Router backend-admin OAuth workspace at `/admin/oauth`. It composes the appbase IAM OAuth management surface through `@sdkwork/appbase-backend-sdk` via the shared Claw Router SDK client runtime.

## Public API

- `src/index.tsx`

## Required SDK Surface

- `@sdkwork/appbase-backend-sdk`
- Backend-admin IAM OAuth resources under the generated SDK tree `iamOauth.iam.oauth.*`
- The service boundary also accepts the legacy/direct `iam.oauth.*` tree during appbase SDK transition, but new generated SDK verification is anchored on `iamOauth.iam.oauth.*`.

## Boundary

This package does not own OAuth persistence, provider callback ingress, app login callbacks, account linking runtime, or provider token exchange. Those are appbase IAM responsibilities. This package is only the backend-admin operator workspace for appbase-owned OAuth configuration, diagnostics, and resource governance.

## Runtime Coverage

The appbase backend TypeScript SDK exposes the OAuth management resources consumed by this package. Claw Router's same-origin backend currently does not mount production-capable `/backend/v3/api/iam/oauth/*` handlers or install the appbase IAM OAuth SQL tables. Until that backend integration is added or an explicit appbase backend base URL is configured, the UI service boundary is valid but list/create/update calls can still fail at the HTTP layer.

## Verification

- `pnpm --filter sdkwork-clawrouter-pc-admin-oauth typecheck`
- `pnpm --dir apps/sdkwork-clawrouter-pc exec tsx admin-oauth-runtime.test.ts`
