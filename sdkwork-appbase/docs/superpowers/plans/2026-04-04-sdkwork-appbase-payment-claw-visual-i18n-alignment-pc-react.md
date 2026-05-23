# SDKWORK Payment Claw Visual And I18n Alignment PC React Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align `@sdkwork/payment-pc-react` with `claw-studio` visual, theme, and internationalization standards without changing payment backend contracts.

**Architecture:** Add a package-local payment copy/context layer with built-in English and Chinese dictionaries, then refactor the exported payment surfaces to consume that layer while upgrading the hero, method rail, create dialog, detail drawer, and transaction workbench to a Claw-style purchase rhythm. Keep payment controller and service logic stable except for locale-safe formatting helpers and lifecycle-tone presentation helpers at the view boundary.

**Tech Stack:** React 19, TypeScript, Vitest, Testing Library, `@sdkwork/ui-pc-react`, `@sdkwork/wallet-pc-react`, `qrcode`, package-local copy/context helpers

---

### Task 1: Lock the payment localization seam with tests

**Files:**
- Modify: `packages/pc-react/commerce/sdkwork-payment-pc-react/tests/payment.page.test.tsx`
- Create: `packages/pc-react/commerce/sdkwork-payment-pc-react/tests/payment.intl.test.tsx`

- [ ] Step 1: Add a failing test for built-in Chinese copy rendering through the payment page.
- [ ] Step 2: Add a failing test that host `messages` overrides win over the localized payment dictionary without replacing untouched copy.
- [ ] Step 3: Add a failing test that a standalone exported payment component keeps usable default English copy without a host provider.
- [ ] Step 4: Add a failing test that a standalone exported payment component consumes Chinese copy when wrapped by `SdkworkPaymentIntlProvider`.
- [ ] Step 5: Run the focused localization tests and confirm they fail for missing copy/context support.

### Task 2: Add package-local payment copy and formatting infrastructure

**Files:**
- Create: `packages/pc-react/commerce/sdkwork-payment-pc-react/src/payment-copy.ts`
- Create: `packages/pc-react/commerce/sdkwork-payment-pc-react/src/payment-intl.tsx`
- Create: `packages/pc-react/commerce/sdkwork-payment-pc-react/src/payment-appearance.ts`
- Modify: `packages/pc-react/commerce/sdkwork-payment-pc-react/src/index.ts`

- [ ] Step 1: Define normalized locale handling and built-in `en-US` / `zh-CN` dictionaries.
- [ ] Step 2: Add a payment intl provider and hook with safe English fallback.
- [ ] Step 3: Add formatting helpers for timestamps, CNY values, polling descriptions, status labels, and product-type labels.
- [ ] Step 4: Add lifecycle-tone helpers so page cards, list pills, and drawer metrics resolve from actual payment status.
- [ ] Step 5: Export the new copy/context primitives from the package entrypoint.
- [ ] Step 6: Re-run the focused localization tests until green.

### Task 3: Refactor the payment page onto the copy layer and Claw visual rhythm

**Files:**
- Modify: `packages/pc-react/commerce/sdkwork-payment-pc-react/src/pages/PaymentPage.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-payment-pc-react/src/components/payment-stat-grid.tsx`

- [ ] Step 1: Replace hardcoded strings with payment copy/context lookups across the page and stat grid.
- [ ] Step 2: Install the page-level `locale` / `messages` seam without breaking existing page consumers.
- [ ] Step 3: Upgrade the hero, method rail, and payment workbench to match Claw commercial hierarchy and semantic color usage.
- [ ] Step 4: Make the method rail feel like a selectable payment lane rather than a flat configuration list.
- [ ] Step 5: Re-run targeted page tests and fix regressions until green.

### Task 4: Refine the create dialog and detail drawer

**Files:**
- Modify: `packages/pc-react/commerce/sdkwork-payment-pc-react/src/components/payment-create-dialog.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-payment-pc-react/src/components/payment-detail-drawer.tsx`
- Create: `packages/pc-react/commerce/sdkwork-payment-pc-react/tests/payment.create-dialog.test.tsx`
- Create: `packages/pc-react/commerce/sdkwork-payment-pc-react/tests/payment.detail-drawer.test.tsx`

- [ ] Step 1: Add a failing create-dialog test for localized copy, selected lane wording, and submit behavior.
- [ ] Step 2: Run `payment.create-dialog.test.tsx` and confirm the dialog coverage fails for the intended reason.
- [ ] Step 3: Refactor the create dialog onto the payment intl seam and lift its visual quality toward Claw modal surfaces.
- [ ] Step 4: Re-run the create-dialog tests until green.
- [ ] Step 5: Add a failing detail-drawer test for localized timestamps, status tones, QR/polling copy, and action labels.
- [ ] Step 6: Run `payment.detail-drawer.test.tsx` and confirm the drawer coverage fails for the intended reason.
- [ ] Step 7: Refactor the detail drawer to use localized timestamps, QR/polling wording, and payment-state summary surfaces.
- [ ] Step 8: Re-run focused dialog and drawer tests until green.

### Task 5: Update docs and run package/workspace verification

**Files:**
- Modify: `packages/pc-react/commerce/sdkwork-payment-pc-react/README.md`
- Modify: `docs/superpowers/specs/2026-04-04-sdkwork-appbase-payment-claw-visual-i18n-alignment-pc-react-design.md`
- Modify: `docs/superpowers/plans/2026-04-04-sdkwork-appbase-payment-claw-visual-i18n-alignment-pc-react.md`

- [ ] Step 1: Update the package README to describe the new payment copy/context seam and Claw alignment standard.
- [ ] Step 2: Run `pnpm test -- packages/pc-react/commerce/sdkwork-payment-pc-react`.
- [ ] Step 3: Run `pnpm --dir packages/pc-react/commerce/sdkwork-payment-pc-react exec tsc --noEmit`.
- [ ] Step 4: Run `pnpm test -- packages/pc-react/commerce`.
- [ ] Step 5: Run `pnpm run review:structure`.
- [ ] Step 6: Reflect verification-driven changes back into the design and plan docs.
