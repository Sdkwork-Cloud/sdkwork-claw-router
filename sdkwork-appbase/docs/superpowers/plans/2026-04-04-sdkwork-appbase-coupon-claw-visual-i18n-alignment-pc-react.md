# SDKWORK Coupon Claw Visual And I18n Alignment PC React Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align `@sdkwork/coupon-pc-react` with `claw-studio` visual, theme, and internationalization standards without changing coupon backend contracts.

**Architecture:** Add a package-local coupon copy/context layer with built-in English and Chinese dictionaries, then refactor the exported coupon surfaces to consume that layer while upgrading the hero, inventory workbench, redeem dialog, and detail drawer to a Claw-style commercial rhythm. Keep coupon controller and service logic stable except for locale-safe formatting helpers at the view boundary.

**Tech Stack:** React 19, TypeScript, Vitest, Testing Library, `@sdkwork/ui-pc-react`, `@sdkwork/wallet-pc-react`, package-local copy/context helpers

---

### Task 1: Lock the localization seam with tests

**Files:**
- Modify: `packages/pc-react/commerce/sdkwork-coupon-pc-react/tests/coupon.intl.test.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-coupon-pc-react/tests/coupon.page.test.tsx`

- [ ] Step 1: Add a failing test for built-in Chinese copy rendering through the coupon page or provider seam.
- [ ] Step 2: Add a failing test that host `messages` overrides win over the localized dictionary without replacing untouched copy.
- [ ] Step 3: Add a failing test that a standalone exported coupon component keeps usable default English copy without a host provider.
- [ ] Step 4: Add a failing test that standalone exported coupon components consume Chinese copy when wrapped by `SdkworkCouponIntlProvider`.
- [ ] Step 5: Run the focused localization tests and confirm they fail for missing copy/context support.

### Task 2: Add package-local coupon copy and formatting infrastructure

**Files:**
- Create: `packages/pc-react/commerce/sdkwork-coupon-pc-react/src/coupon-copy.ts`
- Create: `packages/pc-react/commerce/sdkwork-coupon-pc-react/src/coupon-intl.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-coupon-pc-react/src/index.ts`

- [ ] Step 1: Define normalized locale handling and built-in `en-US` / `zh-CN` dictionaries.
- [ ] Step 2: Add a coupon intl provider and hook with safe English fallback.
- [ ] Step 3: Add formatting helpers for coupon amount, point cost, timestamps, status labels, and boolean availability labels.
- [ ] Step 4: Export the new copy/context primitives from the package entrypoint.
- [ ] Step 5: Re-run the focused localization tests until green.

### Task 3: Refactor the coupon page onto the copy layer and Claw visual rhythm

**Files:**
- Modify: `packages/pc-react/commerce/sdkwork-coupon-pc-react/src/pages/CouponPage.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-coupon-pc-react/src/components/coupon-stat-grid.tsx`

- [ ] Step 1: Replace hardcoded strings with coupon copy/context lookups across the page and stat grid.
- [ ] Step 2: Install the page-level `locale` / `messages` seam without breaking existing page consumers.
- [ ] Step 3: Upgrade the hero, summary cards, and inventory workbench to match Claw commercial hierarchy and semantic color usage.
- [ ] Step 4: Keep discover / my / history separation but make the inventory cards and controls more intentional and less admin-flat.
- [ ] Step 5: Re-run targeted page tests and fix regressions until green.

### Task 4: Refine the redeem dialog and detail drawer

**Files:**
- Modify: `packages/pc-react/commerce/sdkwork-coupon-pc-react/src/components/coupon-redeem-dialog.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-coupon-pc-react/src/components/coupon-detail-drawer.tsx`
- Create: `packages/pc-react/commerce/sdkwork-coupon-pc-react/tests/coupon.redeem-dialog.test.tsx`
- Create: `packages/pc-react/commerce/sdkwork-coupon-pc-react/tests/coupon.detail-drawer.test.tsx`

- [ ] Step 1: Add a failing redeem dialog test for localized copy, localized error framing, and trimmed redeem-code submission.
- [ ] Step 2: Run `coupon.redeem-dialog.test.tsx` and confirm the new dialog coverage fails for the intended reason.
- [ ] Step 3: Refactor the redeem dialog onto the coupon intl seam and lift its visual quality toward Claw modal surfaces.
- [ ] Step 4: Re-run the redeem dialog tests until green.
- [ ] Step 5: Add a failing owned-detail drawer test for localized timestamps, status wording, and operational labels.
- [ ] Step 6: Add a failing catalog-detail drawer test for localized claim and points-exchange actions.
- [ ] Step 7: Run the focused drawer tests and confirm they fail for the intended reason.
- [ ] Step 8: Refactor the detail drawer to use localized timestamps, status wording, section copy, and action labels.
- [ ] Step 9: Re-run focused dialog and drawer tests until green.

### Task 5: Update docs and run package/workspace verification

**Files:**
- Modify: `packages/pc-react/commerce/sdkwork-coupon-pc-react/README.md`
- Modify: `docs/superpowers/specs/2026-04-04-sdkwork-appbase-coupon-claw-visual-i18n-alignment-pc-react-design.md`
- Modify: `docs/superpowers/plans/2026-04-04-sdkwork-appbase-coupon-claw-visual-i18n-alignment-pc-react.md`

- [ ] Step 1: Update the package README to describe the new coupon copy/context seam and Claw alignment standard.
- [ ] Step 2: Run `pnpm test -- packages/pc-react/commerce/sdkwork-coupon-pc-react`.
- [ ] Step 3: Run `pnpm --dir packages/pc-react/commerce/sdkwork-coupon-pc-react exec tsc --noEmit`.
- [ ] Step 4: Run `pnpm test -- packages/pc-react/commerce`.
- [ ] Step 5: Run `pnpm run review:structure`.
- [ ] Step 6: Reflect verification-driven changes back into the design and plan docs.
