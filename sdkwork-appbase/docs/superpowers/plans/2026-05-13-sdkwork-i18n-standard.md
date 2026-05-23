# SDKWork PC React I18n Standard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the PC React i18n foundation and migrate IAM auth to consume it without retaining legacy `locale/messages` props.

**Architecture:** `@sdkwork/i18n-pc-react` wraps `i18next/react-i18next` behind SDKWork APIs. `@sdkwork/auth-pc-react` exports a typed `iam.auth` catalog and resolves all copy from the global provider.

**Tech Stack:** TypeScript, React, i18next, react-i18next, Vitest, Testing Library.

---

### Task 1: Foundation I18n Package

**Files:**
- Create: `packages/pc-react/foundation/sdkwork-i18n-pc-react/package.json`
- Create: `packages/pc-react/foundation/sdkwork-i18n-pc-react/README.md`
- Create: `packages/pc-react/foundation/sdkwork-i18n-pc-react/tsconfig.json`
- Create: `packages/pc-react/foundation/sdkwork-i18n-pc-react/src/index.ts`
- Create: `packages/pc-react/foundation/sdkwork-i18n-pc-react/src/catalog.ts`
- Create: `packages/pc-react/foundation/sdkwork-i18n-pc-react/src/SdkworkI18nProvider.tsx`
- Create: `packages/pc-react/foundation/sdkwork-i18n-pc-react/tests/i18n.test.tsx`
- Modify: `package.json`
- Modify: `pnpm-workspace.yaml`
- Modify: `tsconfig.base.json`
- Modify: `scripts/package-catalog.mjs`

- [ ] Write failing tests for catalog merge, locale normalization, parity, and provider lookup.
- [ ] Run `pnpm.cmd exec vitest run packages/pc-react/foundation/sdkwork-i18n-pc-react/tests/i18n.test.tsx` and confirm it fails because the package does not exist.
- [ ] Implement the package with SDKWork APIs over i18next.
- [ ] Add package metadata, workspace alias, and dependencies.
- [ ] Re-run the foundation test and typecheck.

### Task 2: Auth Catalog And Runtime Migration

**Files:**
- Modify: `packages/pc-react/iam/sdkwork-auth-pc-react/src/auth-copy.ts`
- Modify: `packages/pc-react/iam/sdkwork-auth-pc-react/src/auth-intl.tsx`
- Modify: `packages/pc-react/iam/sdkwork-auth-pc-react/src/auth-controller.ts`
- Modify: `packages/pc-react/iam/sdkwork-auth-pc-react/src/auth-service.ts`
- Modify: `packages/pc-react/iam/sdkwork-auth-pc-react/src/auth-local-service.ts`
- Modify: `packages/pc-react/iam/sdkwork-auth-pc-react/src/pages/AuthPage.tsx`
- Modify: `packages/pc-react/iam/sdkwork-auth-pc-react/src/pages/AuthOAuthCallbackPage.tsx`
- Modify: `packages/pc-react/iam/sdkwork-auth-pc-react/src/pages/IamAuthRoutes.tsx`
- Modify: `packages/pc-react/iam/sdkwork-auth-pc-react/package.json`
- Modify: `packages/pc-react/iam/sdkwork-auth-pc-react/tests/auth.page.test.tsx`
- Create: `packages/pc-react/iam/sdkwork-auth-pc-react/tests/auth.i18n-contract.test.tsx`

- [ ] Write failing auth tests that require `SdkworkI18nProvider` and reject legacy props.
- [ ] Run the auth i18n tests and confirm they fail against current code.
- [ ] Export `SDKWORK_AUTH_I18N_CATALOG` and rewrite auth hooks to consume `useSdkworkModuleMessages`.
- [ ] Remove auth `locale/messages` options and wrapping providers from page/controller/service APIs.
- [ ] Update tests and docs references.
- [ ] Re-run auth tests and typecheck.

### Task 3: Verification

- [ ] Run `pnpm.cmd exec vitest run packages/pc-react/foundation/sdkwork-i18n-pc-react/tests`.
- [ ] Run `pnpm.cmd exec vitest run packages/pc-react/iam/sdkwork-auth-pc-react/tests`.
- [ ] Run `pnpm.cmd exec tsc --noEmit -p packages/pc-react/foundation/sdkwork-i18n-pc-react/tsconfig.json`.
- [ ] Run `pnpm.cmd exec tsc --noEmit -p packages/pc-react/iam/sdkwork-auth-pc-react/tsconfig.json`.
- [ ] Report exact command results and any remaining migration scope.
