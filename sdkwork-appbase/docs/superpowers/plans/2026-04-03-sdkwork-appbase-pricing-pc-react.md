# Pricing PC React Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `@sdkwork/pricing-pc-react` as the reusable pricing-center package for `sdkwork-appbase` commerce applications.

**Architecture:** The package follows the existing commerce pattern with a headless contract layer, a composed service, a local controller, reusable UI components, and a routeable page. It composes `wallet`, `subscription`, `offer`, and `billing` instead of duplicating pricing or transport logic.

**Tech Stack:** TypeScript, React 18, Vitest, Testing Library, `@sdkwork/ui-pc-react`, `@sdkwork/core-pc-react`, workspace commerce packages

---

## File Map

- Create: `packages/pc-react/commerce/sdkwork-pricing-pc-react/package.json`
- Create: `packages/pc-react/commerce/sdkwork-pricing-pc-react/README.md`
- Create: `packages/pc-react/commerce/sdkwork-pricing-pc-react/tsconfig.json`
- Create: `packages/pc-react/commerce/sdkwork-pricing-pc-react/src/pricing.ts`
- Create: `packages/pc-react/commerce/sdkwork-pricing-pc-react/src/pricing-service.ts`
- Create: `packages/pc-react/commerce/sdkwork-pricing-pc-react/src/pricing-controller.ts`
- Create: `packages/pc-react/commerce/sdkwork-pricing-pc-react/src/components/PricingPlanCards.tsx`
- Create: `packages/pc-react/commerce/sdkwork-pricing-pc-react/src/components/PricingComparisonTable.tsx`
- Create: `packages/pc-react/commerce/sdkwork-pricing-pc-react/src/pages/PricingPage.tsx`
- Create: `packages/pc-react/commerce/sdkwork-pricing-pc-react/src/index.ts`
- Create: `packages/pc-react/commerce/sdkwork-pricing-pc-react/tests/pricing.test.ts`
- Create: `packages/pc-react/commerce/sdkwork-pricing-pc-react/tests/pricing.service.test.ts`
- Create: `packages/pc-react/commerce/sdkwork-pricing-pc-react/tests/pricing.controller.test.ts`
- Create: `packages/pc-react/commerce/sdkwork-pricing-pc-react/tests/pricing.plan-cards.test.tsx`
- Create: `packages/pc-react/commerce/sdkwork-pricing-pc-react/tests/pricing.comparison-table.test.tsx`
- Create: `packages/pc-react/commerce/sdkwork-pricing-pc-react/tests/pricing.page.test.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-commerce-pc-react/src/commerce.ts`
- Modify: `packages/pc-react/commerce/sdkwork-commerce-pc-react/tests/commerce.test.ts`
- Modify: `packages/pc-react/foundation/sdkwork-appbase-pc-react/src/catalog.ts`
- Modify: `packages/pc-react/foundation/sdkwork-appbase-pc-react/tests/catalog.test.ts`
- Modify: `packages/pc-react/commerce/README.md`
- Modify: `scripts/package-catalog.mjs`

### Task 1: Headless Pricing Contract

**Files:**
- Create: `packages/pc-react/commerce/sdkwork-pricing-pc-react/tests/pricing.test.ts`
- Create: `packages/pc-react/commerce/sdkwork-pricing-pc-react/src/pricing.ts`

- [ ] Step 1: Write failing tests for workspace manifest, route intent, plan sorting, digest creation, and empty catalog helpers.
- [ ] Step 2: Run `pnpm test packages/pc-react/commerce/sdkwork-pricing-pc-react/tests/pricing.test.ts` and confirm failure.
- [ ] Step 3: Implement `pricing.ts` with normalized plan contracts, feature matrix helpers, sorting helpers, digest helpers, and package metadata.
- [ ] Step 4: Re-run the headless pricing test and confirm pass.

### Task 2: Pricing Service Composition

**Files:**
- Create: `packages/pc-react/commerce/sdkwork-pricing-pc-react/tests/pricing.service.test.ts`
- Create: `packages/pc-react/commerce/sdkwork-pricing-pc-react/src/pricing-service.ts`

- [ ] Step 1: Write failing tests for public baseline pricing, service composition, synthesized usage/prepaid/hybrid plans, and summary enrichment.
- [ ] Step 2: Run `pnpm test packages/pc-react/commerce/sdkwork-pricing-pc-react/tests/pricing.service.test.ts` and confirm failure.
- [ ] Step 3: Implement the pricing service with safe fallbacks and composition over wallet, subscription, offer, and billing packages.
- [ ] Step 4: Re-run the pricing service tests and confirm pass.

### Task 3: Pricing Controller

**Files:**
- Create: `packages/pc-react/commerce/sdkwork-pricing-pc-react/tests/pricing.controller.test.ts`
- Create: `packages/pc-react/commerce/sdkwork-pricing-pc-react/src/pricing-controller.ts`

- [ ] Step 1: Write failing tests for bootstrap, filtering by billing model, selection normalization, and refresh behavior.
- [ ] Step 2: Run `pnpm test packages/pc-react/commerce/sdkwork-pricing-pc-react/tests/pricing.controller.test.ts` and confirm failure.
- [ ] Step 3: Implement controller state, filtering, selection, and React hooks.
- [ ] Step 4: Re-run controller tests and confirm pass.

### Task 4: Pricing UI Components

**Files:**
- Create: `packages/pc-react/commerce/sdkwork-pricing-pc-react/tests/pricing.plan-cards.test.tsx`
- Create: `packages/pc-react/commerce/sdkwork-pricing-pc-react/tests/pricing.comparison-table.test.tsx`
- Create: `packages/pc-react/commerce/sdkwork-pricing-pc-react/src/components/PricingPlanCards.tsx`
- Create: `packages/pc-react/commerce/sdkwork-pricing-pc-react/src/components/PricingComparisonTable.tsx`

- [ ] Step 1: Write failing component tests for plan-card rendering, selection interaction, CTA dispatch, comparison headers, and feature values.
- [ ] Step 2: Run the two component test files and confirm failure.
- [ ] Step 3: Implement the reusable Claw-style plan-card grid and comparison table.
- [ ] Step 4: Re-run the component tests and confirm pass.

### Task 5: Pricing Page

**Files:**
- Create: `packages/pc-react/commerce/sdkwork-pricing-pc-react/tests/pricing.page.test.tsx`
- Create: `packages/pc-react/commerce/sdkwork-pricing-pc-react/src/pages/PricingPage.tsx`
- Create: `packages/pc-react/commerce/sdkwork-pricing-pc-react/src/index.ts`
- Create: `packages/pc-react/commerce/sdkwork-pricing-pc-react/package.json`
- Create: `packages/pc-react/commerce/sdkwork-pricing-pc-react/README.md`
- Create: `packages/pc-react/commerce/sdkwork-pricing-pc-react/tsconfig.json`

- [ ] Step 1: Write a failing page test for bootstrapping, filter switching, and plan CTA navigation.
- [ ] Step 2: Run `pnpm test packages/pc-react/commerce/sdkwork-pricing-pc-react/tests/pricing.page.test.tsx` and confirm failure.
- [ ] Step 3: Implement the page shell, premium hero, pricing filters, selected-plan sidebar, and comparison section.
- [ ] Step 4: Re-run the page test and confirm pass.

### Task 6: Commerce Registration

**Files:**
- Modify: `packages/pc-react/commerce/sdkwork-commerce-pc-react/src/commerce.ts`
- Modify: `packages/pc-react/commerce/sdkwork-commerce-pc-react/tests/commerce.test.ts`
- Modify: `packages/pc-react/foundation/sdkwork-appbase-pc-react/src/catalog.ts`
- Modify: `packages/pc-react/foundation/sdkwork-appbase-pc-react/tests/catalog.test.ts`
- Modify: `packages/pc-react/commerce/README.md`
- Modify: `scripts/package-catalog.mjs`

- [ ] Step 1: Write or extend failing expectations for the pricing package in commerce registration and capability catalog tests.
- [ ] Step 2: Run the affected registration tests and confirm failure.
- [ ] Step 3: Register the new pricing package in commerce workspace manifests, the appbase starter catalog, and architecture catalog docs.
- [ ] Step 4: Re-run the registration tests and confirm pass.

### Task 7: Full Verification

**Files:**
- Review only

- [ ] Step 1: Run targeted pricing tests.
- [ ] Step 2: Run `pnpm typecheck`.
- [ ] Step 3: Run `pnpm test`.
- [ ] Step 4: Run `pnpm run review:structure`.
- [ ] Step 5: Review remaining commercialization gaps after pricing lands.
