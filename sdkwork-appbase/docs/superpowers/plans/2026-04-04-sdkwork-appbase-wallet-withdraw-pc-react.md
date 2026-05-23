# SDKWORK Wallet Withdraw PC React Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend `@sdkwork/wallet-pc-react` with reusable cash-withdraw capabilities across service, controller, page, and header-entry surfaces.

**Architecture:** Keep withdraw inside the wallet package, following the existing recharge and membership flow architecture. Use the generated app SDK `account.withdraw` contract already provided by `spring-ai-plus-app-api`, add a stable wallet-facing withdraw contract, and wire a reusable dialog plus shared CTA entrypoints without creating a new commerce package.

**Tech Stack:** React 18, TypeScript, Vitest, Testing Library, `@sdkwork/ui-pc-react`, `@sdkwork/core-pc-react`

---

### Task 1: Lock the withdraw contract with tests

**Files:**
- Modify: `packages/pc-react/commerce/sdkwork-wallet-pc-react/tests/wallet.service.test.ts`
- Modify: `packages/pc-react/commerce/sdkwork-wallet-pc-react/tests/wallet.controller.test.ts`
- Modify: `packages/pc-react/commerce/sdkwork-wallet-pc-react/tests/wallet.page.test.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-wallet-pc-react/tests/wallet.quick-panel.test.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-wallet-pc-react/tests/wallet.header-entry.test.tsx`
- Create: `packages/pc-react/commerce/sdkwork-wallet-pc-react/tests/wallet.withdraw-dialog.test.tsx`

- [ ] Step 1: Add failing withdraw assertions to the wallet service test for request mapping and result normalization.
- [ ] Step 2: Add failing controller assertions for `openWithdraw`, `closeWithdraw`, and post-withdraw overview refresh.
- [ ] Step 3: Add a new withdraw dialog rendering test and extend page, quick-panel, and header-entry tests with withdraw expectations.
- [ ] Step 4: Run the targeted wallet tests and confirm they fail for missing withdraw support.

### Task 2: Add wallet withdraw contracts and service/controller support

**Files:**
- Modify: `packages/pc-react/commerce/sdkwork-wallet-pc-react/src/wallet-service.ts`
- Modify: `packages/pc-react/commerce/sdkwork-wallet-pc-react/src/wallet-controller.ts`
- Modify: `packages/pc-react/commerce/sdkwork-wallet-pc-react/src/wallet.ts`

- [ ] Step 1: Add withdraw destination, input, and result contracts in the wallet package public surface.
- [ ] Step 2: Extend the wallet service client boundary with optional `account.withdraw` and implement `withdrawCash` strictly through that generated SDK method, with no manual HTTP fallback.
- [ ] Step 3: Add controller state and actions for opening, closing, and executing withdraw mutations.
- [ ] Step 4: Re-run wallet service and controller tests until green.

### Task 3: Build the reusable withdraw dialog and shared entrypoints

**Files:**
- Create: `packages/pc-react/commerce/sdkwork-wallet-pc-react/src/components/wallet-withdraw-dialog.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-wallet-pc-react/src/components/wallet-balance-panel.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-wallet-pc-react/src/components/wallet-quick-panel.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-wallet-pc-react/src/components/wallet-header-entry.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-wallet-pc-react/src/pages/WalletPage.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-wallet-pc-react/src/index.ts`

- [ ] Step 1: Implement a withdraw dialog with available-cash summary, amount input, destination selection, and submit guardrails.
- [ ] Step 2: Keep destination selection scoped to payout rails only; do not add payout-account management, KYC, or beneficiary-editing flows.
- [ ] Step 3: Add withdraw action buttons to the balance panel and quick panel.
- [ ] Step 4: Mount the dialog in both the wallet page and the header entry so withdraw works from either context, while `wallet-quick-panel` stays callback-driven and reusable.
- [ ] Step 5: Re-run the dialog, page, quick-panel, and header-entry tests until green.

### Task 4: Verify and document the wallet package

**Files:**
- Modify: `packages/pc-react/commerce/sdkwork-wallet-pc-react/README.md`
- Modify: `packages/pc-react/commerce/README.md`
- Modify: `docs/superpowers/specs/2026-04-04-sdkwork-appbase-wallet-withdraw-pc-react-design.md`
- Modify: `docs/superpowers/plans/2026-04-04-sdkwork-appbase-wallet-withdraw-pc-react.md`

- [ ] Step 1: Update README documentation for wallet withdraw ownership and exported capabilities.
- [ ] Step 2: Run `pnpm test -- packages/pc-react/commerce/sdkwork-wallet-pc-react/tests/wallet.service.test.ts packages/pc-react/commerce/sdkwork-wallet-pc-react/tests/wallet.controller.test.ts packages/pc-react/commerce/sdkwork-wallet-pc-react/tests/wallet.withdraw-dialog.test.tsx packages/pc-react/commerce/sdkwork-wallet-pc-react/tests/wallet.page.test.tsx packages/pc-react/commerce/sdkwork-wallet-pc-react/tests/wallet.quick-panel.test.tsx packages/pc-react/commerce/sdkwork-wallet-pc-react/tests/wallet.header-entry.test.tsx`.
- [ ] Step 3: Run `pnpm --dir packages/pc-react/commerce/sdkwork-wallet-pc-react exec tsc --noEmit`.
- [ ] Step 4: Run `pnpm test -- packages/pc-react/commerce/sdkwork-wallet-pc-react`.
- [ ] Step 5: Run `pnpm test -- packages/pc-react/commerce` because wallet changes affect shared commerce composition and cross-package workspace health.
- [ ] Step 6: Run `pnpm run review:structure`.
- [ ] Step 7: Reflect any verification-driven changes back into the spec and plan docs.
