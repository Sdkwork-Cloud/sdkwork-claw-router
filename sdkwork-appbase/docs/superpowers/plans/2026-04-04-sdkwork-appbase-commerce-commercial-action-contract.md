# SDKWORK Commerce Commercial Action Contract Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Introduce a shared commerce action contract in `sdkwork-offer-pc-react` and migrate pricing, checkout, billing, entitlement, and offer models to use it consistently.

**Architecture:** Keep the shared action contract in an upstream commerce package to avoid dependency cycles, then let each domain package expose its next-step action as a normalized `SdkworkCommercialAction`. Replace loose label/route pairs in pricing and checkout with a nested action object while preserving domain-specific metadata in billing and entitlement.

**Tech Stack:** React 18, TypeScript, Vitest, Testing Library, workspace package composition

**Status:** Completed and verified on 2026-04-04.

**Implementation note:** Contract assertions were folded into the existing package test suites instead of introducing dedicated `*.action-contract.test.ts` files, so the shared action rules stay covered alongside each package's real behavioral tests.

---

### Task 1: Lock the shared commerce action contract with failing tests

**Files:**
- Modify: `packages/pc-react/commerce/sdkwork-offer-pc-react/tests/offer.test.ts`
- Modify: `docs/superpowers/specs/2026-04-04-sdkwork-appbase-commerce-commercial-action-contract-design.md`
- Create: `packages/pc-react/commerce/sdkwork-pricing-pc-react/tests/pricing.action-contract.test.ts`
- Create: `packages/pc-react/commerce/sdkwork-checkout-pc-react/tests/checkout.action-contract.test.ts`
- Create: `packages/pc-react/commerce/sdkwork-billing-pc-react/tests/billing.action-contract.test.ts`
- Create: `packages/pc-react/commerce/sdkwork-entitlement-pc-react/tests/entitlement.action-contract.test.ts`

- [x] Step 1: Add failing tests for `SdkworkCommercialAction` creation and typed offer actions
- [x] Step 2: Add failing tests asserting pricing plans expose nested actions instead of loose CTA fields
- [x] Step 3: Add failing tests asserting checkout sources expose nested actions instead of loose action strings
- [x] Step 4: Add failing tests asserting billing and entitlement actions expose `capability`, `intent`, `label`, and `route`
- [x] Step 5: Run the focused tests and confirm they fail for the intended contract gaps

### Task 2: Implement the shared action contract in the offer package

**Files:**
- Create: `packages/pc-react/commerce/sdkwork-offer-pc-react/src/commercial-action.ts`
- Modify: `packages/pc-react/commerce/sdkwork-offer-pc-react/src/offer.ts`
- Modify: `packages/pc-react/commerce/sdkwork-offer-pc-react/src/offer-service.ts`
- Modify: `packages/pc-react/commerce/sdkwork-offer-pc-react/src/index.ts`
- Modify: `packages/pc-react/commerce/sdkwork-offer-pc-react/tests/offer.service.test.ts`
- Modify: `packages/pc-react/commerce/sdkwork-offer-pc-react/tests/offer.page.test.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-offer-pc-react/tests/offer.controller.test.ts`

- [x] Step 1: Add the shared capability and intent unions plus `createSdkworkCommercialAction`
- [x] Step 2: Re-type offer actions as specializations of the shared contract
- [x] Step 3: Update offer service fixtures and tests to include explicit action intents
- [x] Step 4: Re-run offer package tests until green

### Task 3: Migrate pricing and checkout to nested shared actions

**Files:**
- Modify: `packages/pc-react/commerce/sdkwork-pricing-pc-react/src/pricing.ts`
- Modify: `packages/pc-react/commerce/sdkwork-pricing-pc-react/src/pricing-service.ts`
- Modify: `packages/pc-react/commerce/sdkwork-pricing-pc-react/src/components/PricingPlanCards.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-pricing-pc-react/src/pages/PricingPage.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-pricing-pc-react/tests/pricing.test.ts`
- Modify: `packages/pc-react/commerce/sdkwork-pricing-pc-react/tests/pricing.service.test.ts`
- Modify: `packages/pc-react/commerce/sdkwork-pricing-pc-react/tests/pricing.page.test.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-pricing-pc-react/tests/pricing.plan-cards.test.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-checkout-pc-react/src/checkout.ts`
- Modify: `packages/pc-react/commerce/sdkwork-checkout-pc-react/src/checkout-service.ts`
- Modify: `packages/pc-react/commerce/sdkwork-checkout-pc-react/src/components/CheckoutSummaryRail.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-checkout-pc-react/src/pages/CheckoutPage.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-checkout-pc-react/tests/checkout.test.ts`
- Modify: `packages/pc-react/commerce/sdkwork-checkout-pc-react/tests/checkout.service.test.ts`
- Modify: `packages/pc-react/commerce/sdkwork-checkout-pc-react/tests/checkout.page.test.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-checkout-pc-react/tests/checkout.summary-rail.test.tsx`

- [x] Step 1: Replace pricing plan CTA strings with a nested shared `action`
- [x] Step 2: Assign explicit `intent` values for renew, upgrade, purchase, review, and recharge pricing actions
- [x] Step 3: Replace checkout source action strings with a nested shared `action`
- [x] Step 4: Update pricing and checkout UI components to read the shared action shape
- [x] Step 5: Re-run pricing and checkout tests until green

### Task 4: Migrate billing and entitlement actions to the shared contract

**Files:**
- Modify: `packages/pc-react/commerce/sdkwork-billing-pc-react/src/billing.ts`
- Modify: `packages/pc-react/commerce/sdkwork-billing-pc-react/tests/billing.test.ts`
- Modify: `packages/pc-react/commerce/sdkwork-billing-pc-react/tests/billing.service.test.ts`
- Modify: `packages/pc-react/commerce/sdkwork-billing-pc-react/tests/billing.page.test.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-billing-pc-react/tests/billing.controller.test.ts`
- Modify: `packages/pc-react/commerce/sdkwork-entitlement-pc-react/src/entitlement.ts`
- Modify: `packages/pc-react/commerce/sdkwork-entitlement-pc-react/tests/entitlement.test.ts`
- Modify: `packages/pc-react/commerce/sdkwork-entitlement-pc-react/tests/entitlement.service.test.ts`
- Modify: `packages/pc-react/commerce/sdkwork-entitlement-pc-react/tests/entitlement.page.test.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-entitlement-pc-react/tests/entitlement.controller.test.ts`
- Modify: `packages/pc-react/commerce/sdkwork-entitlement-pc-react/tests/entitlement.gate.test.tsx`

- [x] Step 1: Re-type billing actions around shared `capability` and explicit `intent`
- [x] Step 2: Preserve billing-only `reason` metadata on top actions
- [x] Step 3: Re-type entitlement recommended actions and top actions around the shared contract
- [x] Step 4: Re-run billing and entitlement tests until green

### Task 5: Final commerce verification and documentation

**Files:**
- Modify: `packages/pc-react/commerce/sdkwork-offer-pc-react/README.md`
- Modify: `packages/pc-react/commerce/sdkwork-pricing-pc-react/README.md`
- Modify: `packages/pc-react/commerce/sdkwork-checkout-pc-react/README.md`
- Modify: `packages/pc-react/commerce/sdkwork-billing-pc-react/README.md`
- Modify: `packages/pc-react/commerce/sdkwork-entitlement-pc-react/README.md`
- Modify: `docs/superpowers/specs/2026-04-04-sdkwork-appbase-commerce-commercial-action-contract-design.md`
- Modify: `docs/superpowers/plans/2026-04-04-sdkwork-appbase-commerce-commercial-action-contract.md`

- [x] Step 1: Update package READMEs to document the shared action contract
- [x] Step 2: Run `pnpm test -- packages/pc-react/commerce/sdkwork-offer-pc-react/tests`
- [x] Step 3: Run `pnpm test -- packages/pc-react/commerce/sdkwork-pricing-pc-react/tests`
- [x] Step 4: Run `pnpm test -- packages/pc-react/commerce/sdkwork-checkout-pc-react/tests`
- [x] Step 5: Run `pnpm test -- packages/pc-react/commerce/sdkwork-billing-pc-react/tests`
- [x] Step 6: Run `pnpm test -- packages/pc-react/commerce/sdkwork-entitlement-pc-react/tests`
- [x] Step 7: Run `pnpm test -- packages/pc-react/commerce`
- [x] Step 8: Run `pnpm run review:structure`
- [x] Step 9: Reflect any verification-driven fixes back into docs
