# SDKWORK Subscription Claw Visual And I18n Alignment PC React Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align `@sdkwork/subscription-pc-react` with `claw-studio` visual, theme, and internationalization standards without changing backend subscription contracts.

**Architecture:** Add a package-local subscription copy/context layer with built-in English and Chinese dictionaries, then refactor the exported subscription surfaces to consume that layer while upgrading the visual hierarchy to a Claw-style premium purchase rhythm. Keep controller and service logic stable unless user-facing copy currently leaks from service defaults.

**Tech Stack:** React 19, TypeScript, Vitest, Testing Library, `@sdkwork/ui-pc-react`, `@sdkwork/wallet-pc-react`, package-local copy/context helpers

---

### Task 1: Lock the localization seam with tests

**Files:**
- Create: `packages/pc-react/commerce/sdkwork-subscription-pc-react/tests/subscription.intl.test.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-subscription-pc-react/tests/subscription.page.test.tsx`

- [ ] Step 1: Add a failing test for built-in Chinese copy rendering through the subscription page or provider seam.
- [ ] Step 2: Add a failing test that standalone subscription components keep usable default English copy without a host provider.
- [ ] Step 3: Run the focused localization tests and confirm they fail for missing copy/context support.

### Task 2: Add package-local subscription copy and formatting infrastructure

**Files:**
- Create: `packages/pc-react/commerce/sdkwork-subscription-pc-react/src/subscription-copy.ts`
- Create: `packages/pc-react/commerce/sdkwork-subscription-pc-react/src/subscription-intl.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-subscription-pc-react/src/index.ts`

- [ ] Step 1: Define normalized locale handling and built-in `en-US` / `zh-CN` dictionaries.
- [ ] Step 2: Add a subscription intl provider and hook with safe English fallback.
- [ ] Step 3: Export the new copy/context primitives from the package entrypoint.
- [ ] Step 4: Re-run the focused localization tests until green.

### Task 3: Refactor exported subscription components onto the copy layer and Claw visual rhythm

**Files:**
- Create: `packages/pc-react/commerce/sdkwork-subscription-pc-react/src/subscription-appearance.ts`
- Create: `packages/pc-react/commerce/sdkwork-subscription-pc-react/tests/subscription.appearance.test.ts`
- Modify: `packages/pc-react/commerce/sdkwork-subscription-pc-react/src/pages/SubscriptionPage.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-subscription-pc-react/src/components/subscription-hero.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-subscription-pc-react/src/components/subscription-stage-shell.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-subscription-pc-react/src/components/subscription-plan-grid.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-subscription-pc-react/src/components/subscription-level-grid.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-subscription-pc-react/src/components/subscription-selected-plan-card.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-subscription-pc-react/src/components/subscription-coupon-list.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-subscription-pc-react/src/components/subscription-payment-methods.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-subscription-pc-react/src/components/subscription-price-summary.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-subscription-pc-react/src/components/subscription-checkout-panel.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-subscription-pc-react/src/index.ts`

- [ ] Step 1: Replace hardcoded strings with copy/context lookups across all exported subscription surfaces.
- [ ] Step 2: Move locale-sensitive duration, currency, coupon, and payment wording onto the new formatting helpers.
- [ ] Step 3: Add a reusable subscription appearance layer, then restyle the premium hero, stage shell, plan cards, checkout rail, and summary surfaces to align with `claw-studio`.
- [ ] Step 4: Re-run targeted subscription component tests and fix regressions until green.

### Task 4: Update docs and run package/workspace verification

**Files:**
- Modify: `packages/pc-react/commerce/sdkwork-subscription-pc-react/README.md`
- Modify: `docs/superpowers/specs/2026-04-04-sdkwork-appbase-subscription-claw-visual-i18n-alignment-pc-react-design.md`
- Modify: `docs/superpowers/plans/2026-04-04-sdkwork-appbase-subscription-claw-visual-i18n-alignment-pc-react.md`

- [ ] Step 1: Update the package README to describe the new copy/context seam and Claw alignment standard.
- [ ] Step 2: Run `pnpm test -- packages/pc-react/commerce/sdkwork-subscription-pc-react`.
- [ ] Step 3: Run `pnpm --dir packages/pc-react/commerce/sdkwork-subscription-pc-react exec tsc --noEmit`.
- [ ] Step 4: Run `pnpm test -- packages/pc-react/commerce`.
- [ ] Step 5: Run `pnpm run review:structure`.
- [ ] Step 6: Reflect verification-driven changes back into the design and plan docs.
