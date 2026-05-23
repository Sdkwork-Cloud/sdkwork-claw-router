# @sdkwork/auth-runtime-pc-react

Headless auth runtime composition package for SDKWORK IAM integrations.

This package belongs to `pc-react/iam` and exposes non-UI runtime wiring for auth configuration, user-center deployment profiles, and development prefill resolution. UI packages consume it through package exports instead of deep-copying runtime composition logic.

## Scope

- Domain: `iam`
- Architecture: `pc-react`
- Capability: `auth-runtime`
- Root entry: `@sdkwork/auth-runtime-pc-react`

## Ownership

- Keep UI rendering in `@sdkwork/auth-pc-react` and `@sdkwork/user-center-pc-react`.
- Keep cross-framework contracts in `packages/common/iam`.
- Keep local/private backend parity in `packages/native-rust/iam`.
- Keep app-specific route, namespace, and branding decisions in the consuming application.

## Runtime IAM Controller

For applications that already create a standard `@sdkwork/iam-runtime`, prefer the runtime-backed controller factory instead of writing app-local auth adapters:

```ts
import { createSdkworkIamRuntimeAuthController } from "@sdkwork/auth-runtime-pc-react";

export const authController = createSdkworkIamRuntimeAuthController({
  getRuntime: getAppIamRuntime,
});
```

The runtime-backed controller keeps login, registration, verification code, password reset, OAuth, session bridge, current-session bootstrap, and logout mapped through the shared IAM runtime service. AppContext, ShardingContext, dual-token persistence, and SaaS/local backend switching remain runtime concerns, not UI concerns.

## Governance

Run from `apps/sdkwork-appbase`:

```sh
pnpm run test:user-center-standard-contracts
pnpm run test:iam-standard-governance
```
