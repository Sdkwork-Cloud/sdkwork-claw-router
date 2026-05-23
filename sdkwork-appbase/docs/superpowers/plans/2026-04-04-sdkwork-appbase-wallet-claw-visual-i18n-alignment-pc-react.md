# SDKWORK Wallet Claw Visual And I18n Alignment PC React Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align `@sdkwork/wallet-pc-react` with `claw-studio` visual, theme, and internationalization standards while preserving the existing wallet service and controller contracts.

**Architecture:** Add a package-local wallet copy/context layer with safe `en-US` fallback and first-class `zh-CN` support, then refactor all exported wallet surfaces to consume that seam while promoting the visual system into reusable Claw-style appearance helpers.

**Tech Stack:** React 19, TypeScript, Vitest, Testing Library, `@sdkwork/ui-pc-react`, `@sdkwork/core-pc-react`, package-local copy/context helpers

---

### Task 1: Lock localization and appearance seams with tests

**Files:**
- Create: `packages/pc-react/commerce/sdkwork-wallet-pc-react/tests/wallet.intl.test.tsx`
- Create: `packages/pc-react/commerce/sdkwork-wallet-pc-react/tests/wallet.appearance.test.ts`

- [x] Step 1: Add a failing test for Chinese copy rendering through the wallet page seam.
- [x] Step 2: Add a failing test for standalone wallet components keeping usable English fallback copy.
- [x] Step 3: Add a failing test for the exported wallet appearance helper surface.
- [x] Step 4: Run the focused tests and confirm they fail for missing copy/context or appearance support.

### Task 2: Add package-local wallet copy and formatting infrastructure

**Files:**
- Create: `packages/pc-react/commerce/sdkwork-wallet-pc-react/src/wallet-copy.ts`
- Create: `packages/pc-react/commerce/sdkwork-wallet-pc-react/src/wallet-intl.tsx`
- Create: `packages/pc-react/commerce/sdkwork-wallet-pc-react/src/wallet-appearance.ts`
- Modify: `packages/pc-react/commerce/sdkwork-wallet-pc-react/src/index.ts`

- [x] Step 1: Define normalized locale handling and built-in `en-US` / `zh-CN` dictionaries.
- [x] Step 2: Add a wallet intl provider and hook with safe English fallback for standalone components.
- [x] Step 3: Add reusable appearance helpers for wallet hero, backdrop, panels, and tone chips.
- [x] Step 4: Export the new copy/context/appearance primitives from the package entrypoint.

### Task 3: Refactor wallet exports onto the new package seams

**Files:**
- Modify: `packages/pc-react/commerce/sdkwork-wallet-pc-react/src/pages/WalletPage.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-wallet-pc-react/src/components/wallet-balance-panel.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-wallet-pc-react/src/components/wallet-summary-cards.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-wallet-pc-react/src/components/wallet-transaction-list.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-wallet-pc-react/src/components/wallet-quick-panel.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-wallet-pc-react/src/components/wallet-header-entry.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-wallet-pc-react/src/components/wallet-recharge-dialog.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-wallet-pc-react/src/components/wallet-membership-dialog.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-wallet-pc-react/src/components/wallet-withdraw-dialog.tsx`

- [x] Step 1: Replace hardcoded strings across page, quick entry, dialogs, and transaction surfaces with wallet copy/context lookups.
- [x] Step 2: Move membership, amount, rate, withdraw destination, and remarks wording onto locale-aware wallet formatting helpers.
- [x] Step 3: Add the page-level `locale` and `messages` seam so hosts can override wallet copy without forking the package.
- [x] Step 4: Restyle hero, quick panel, and dialog summary sections with Claw-aligned appearance helpers.

### Task 4: Update docs and run package/workspace verification

**Files:**
- Modify: `packages/pc-react/commerce/sdkwork-wallet-pc-react/README.md`
- Create: `docs/superpowers/specs/2026-04-04-sdkwork-appbase-wallet-claw-visual-i18n-alignment-pc-react-design.md`
- Create: `docs/superpowers/plans/2026-04-04-sdkwork-appbase-wallet-claw-visual-i18n-alignment-pc-react.md`

- [x] Step 1: Update the package README to describe the new copy/context seam and Claw alignment contract.
- [x] Step 2: Run `pnpm test -- packages/pc-react/commerce/sdkwork-wallet-pc-react/tests/wallet.intl.test.tsx`.
- [x] Step 3: Run `pnpm test -- packages/pc-react/commerce/sdkwork-wallet-pc-react/tests/wallet.appearance.test.ts`.
- [x] Step 4: Run `pnpm test -- packages/pc-react/commerce/sdkwork-wallet-pc-react`.
- [x] Step 5: Run `pnpm --dir packages/pc-react/commerce/sdkwork-wallet-pc-react exec tsc --noEmit`.
- [ ] Step 6: Run `pnpm test -- packages/pc-react/commerce`.
- [ ] Step 7: Run `pnpm run review:structure`.
