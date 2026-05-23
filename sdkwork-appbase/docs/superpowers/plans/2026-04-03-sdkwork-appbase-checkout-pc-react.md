# Checkout PC React Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `@sdkwork/checkout-pc-react` as the reusable checkout orchestration package for `sdkwork-appbase` commerce applications.

**Architecture:** The package follows the existing commerce pattern with a headless contract layer, a composed service, a local controller, reusable UI components, and a routeable page. It composes `pricing`, `coupon`, `wallet`, `subscription`, `payment`, `order`, and `invoice` instead of duplicating transport or domain logic.

**Tech Stack:** TypeScript, React 18, Vitest, Testing Library, `@sdkwork/ui-pc-react`, `@sdkwork/core-pc-react`, workspace commerce packages

---

## File Map

- Create: `packages/pc-react/commerce/sdkwork-checkout-pc-react/package.json`
- Create: `packages/pc-react/commerce/sdkwork-checkout-pc-react/README.md`
- Create: `packages/pc-react/commerce/sdkwork-checkout-pc-react/tsconfig.json`
- Create: `packages/pc-react/commerce/sdkwork-checkout-pc-react/src/checkout.ts`
- Create: `packages/pc-react/commerce/sdkwork-checkout-pc-react/src/checkout-service.ts`
- Create: `packages/pc-react/commerce/sdkwork-checkout-pc-react/src/checkout-controller.ts`
- Create: `packages/pc-react/commerce/sdkwork-checkout-pc-react/src/components/CheckoutPaymentMethods.tsx`
- Create: `packages/pc-react/commerce/sdkwork-checkout-pc-react/src/components/CheckoutSummaryRail.tsx`
- Create: `packages/pc-react/commerce/sdkwork-checkout-pc-react/src/pages/CheckoutPage.tsx`
- Create: `packages/pc-react/commerce/sdkwork-checkout-pc-react/src/index.ts`
- Create: `packages/pc-react/commerce/sdkwork-checkout-pc-react/tests/checkout.test.ts`
- Create: `packages/pc-react/commerce/sdkwork-checkout-pc-react/tests/checkout.service.test.ts`
- Create: `packages/pc-react/commerce/sdkwork-checkout-pc-react/tests/checkout.controller.test.ts`
- Create: `packages/pc-react/commerce/sdkwork-checkout-pc-react/tests/checkout.payment-methods.test.tsx`
- Create: `packages/pc-react/commerce/sdkwork-checkout-pc-react/tests/checkout.summary-rail.test.tsx`
- Create: `packages/pc-react/commerce/sdkwork-checkout-pc-react/tests/checkout.page.test.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-commerce-pc-react/src/commerce.ts`
- Modify: `packages/pc-react/commerce/sdkwork-commerce-pc-react/tests/commerce.test.ts`
- Modify: `packages/pc-react/foundation/sdkwork-appbase-pc-react/src/catalog.ts`
- Modify: `packages/pc-react/foundation/sdkwork-appbase-pc-react/tests/catalog.test.ts`
- Modify: `packages/pc-react/commerce/README.md`
- Modify: `scripts/package-catalog.mjs`

### Task 1: Headless Checkout Contract

**Files:**
- Create: `packages/pc-react/commerce/sdkwork-checkout-pc-react/tests/checkout.test.ts`
- Create: `packages/pc-react/commerce/sdkwork-checkout-pc-react/src/checkout.ts`

- [ ] Step 1: Write failing tests for workspace manifest, route intent, empty session helpers, amount breakdown helpers, and package metadata.
- [ ] Step 2: Run `pnpm test packages/pc-react/commerce/sdkwork-checkout-pc-react/tests/checkout.test.ts` and confirm failure.
- [ ] Step 3: Implement `checkout.ts` with checkout source kinds, normalized session contracts, helper factories, amount calculators, and route helpers.
- [ ] Step 4: Re-run the headless checkout test and confirm pass.

### Task 2: Checkout Service Composition

**Files:**
- Create: `packages/pc-react/commerce/sdkwork-checkout-pc-react/tests/checkout.service.test.ts`
- Create: `packages/pc-react/commerce/sdkwork-checkout-pc-react/src/checkout-service.ts`

- [ ] Step 1: Write failing tests for safe empty fallback, subscription session normalization, wallet recharge session normalization, coupon application, and submit orchestration.
- [ ] Step 2: Run `pnpm test packages/pc-react/commerce/sdkwork-checkout-pc-react/tests/checkout.service.test.ts` and confirm failure.
- [ ] Step 3: Implement the checkout service with safe fallbacks and composition over pricing, coupon, wallet, subscription, payment, order, and invoice packages.
- [ ] Step 4: Re-run the checkout service tests and confirm pass.

### Task 3: Checkout Controller

**Files:**
- Create: `packages/pc-react/commerce/sdkwork-checkout-pc-react/tests/checkout.controller.test.ts`
- Create: `packages/pc-react/commerce/sdkwork-checkout-pc-react/src/checkout-controller.ts`

- [ ] Step 1: Write failing tests for bootstrap, source selection, coupon selection, payment-method selection, invoice toggles, submit state, and refresh behavior.
- [ ] Step 2: Run `pnpm test packages/pc-react/commerce/sdkwork-checkout-pc-react/tests/checkout.controller.test.ts` and confirm failure.
- [ ] Step 3: Implement controller state, derived summary behavior, submit lifecycle, and React hooks.
- [ ] Step 4: Re-run controller tests and confirm pass.

### Task 4: Checkout UI Components

**Files:**
- Create: `packages/pc-react/commerce/sdkwork-checkout-pc-react/tests/checkout.payment-methods.test.tsx`
- Create: `packages/pc-react/commerce/sdkwork-checkout-pc-react/tests/checkout.summary-rail.test.tsx`
- Create: `packages/pc-react/commerce/sdkwork-checkout-pc-react/src/components/CheckoutPaymentMethods.tsx`
- Create: `packages/pc-react/commerce/sdkwork-checkout-pc-react/src/components/CheckoutSummaryRail.tsx`

- [ ] Step 1: Write failing component tests for payment-method rendering, selection dispatch, locked state hints, summary rows, and submit-state presentation.
- [ ] Step 2: Run the two component test files and confirm failure.
- [ ] Step 3: Implement the reusable Claw-style payment-method picker and checkout summary rail.
- [ ] Step 4: Re-run the component tests and confirm pass.

### Task 5: Checkout Page

**Files:**
- Create: `packages/pc-react/commerce/sdkwork-checkout-pc-react/tests/checkout.page.test.tsx`
- Create: `packages/pc-react/commerce/sdkwork-checkout-pc-react/src/pages/CheckoutPage.tsx`
- Create: `packages/pc-react/commerce/sdkwork-checkout-pc-react/src/index.ts`
- Create: `packages/pc-react/commerce/sdkwork-checkout-pc-react/package.json`
- Create: `packages/pc-react/commerce/sdkwork-checkout-pc-react/README.md`
- Create: `packages/pc-react/commerce/sdkwork-checkout-pc-react/tsconfig.json`

- [ ] Step 1: Write a failing page test for bootstrapping, source card rendering, payment-method switching, and submit action dispatch.
- [ ] Step 2: Run `pnpm test packages/pc-react/commerce/sdkwork-checkout-pc-react/tests/checkout.page.test.tsx` and confirm failure.
- [ ] Step 3: Implement the page shell, premium checkout hero, locked package details card, payment-method section, and summary rail integration.
- [ ] Step 4: Re-run the page test and confirm pass.

### Task 6: Commerce Registration

**Files:**
- Modify: `packages/pc-react/commerce/sdkwork-commerce-pc-react/src/commerce.ts`
- Modify: `packages/pc-react/commerce/sdkwork-commerce-pc-react/tests/commerce.test.ts`
- Modify: `packages/pc-react/foundation/sdkwork-appbase-pc-react/src/catalog.ts`
- Modify: `packages/pc-react/foundation/sdkwork-appbase-pc-react/tests/catalog.test.ts`
- Modify: `packages/pc-react/commerce/README.md`
- Modify: `scripts/package-catalog.mjs`

- [ ] Step 1: Write or extend failing expectations for the checkout package in commerce registration and capability catalog tests.
- [ ] Step 2: Run the affected registration tests and confirm failure.
- [ ] Step 3: Register the new checkout package in commerce workspace manifests, the appbase starter catalog, and architecture catalog docs.
- [ ] Step 4: Re-run the registration tests and confirm pass.

### Task 7: Full Verification

**Files:**
- Review only

- [ ] Step 1: Run targeted checkout tests.
- [ ] Step 2: Run `pnpm typecheck`.
- [ ] Step 3: Run `pnpm test`.
- [ ] Step 4: Run `pnpm run review:structure`.
- [ ] Step 5: Review remaining commercialization gaps after checkout lands.
