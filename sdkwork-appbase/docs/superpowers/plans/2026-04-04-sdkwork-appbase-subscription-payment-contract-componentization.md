# SDKWORK Subscription Payment Contract Componentization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor `sdkwork-subscription-pc-react` so checkout payment methods come from a reusable runtime-backed contract and the monolithic checkout panel is split into reusable components.

**Architecture:** Keep the subscription backend mutation boundary narrow while exposing a richer payment option model to the UI. Pull payment methods from `sdkwork-payment-pc-react`, normalize them in the subscription service, and compose smaller checkout panel components around the staged Claw-style purchase flow.

**Tech Stack:** React 18, TypeScript, Vitest, Testing Library, workspace package composition

---

### Task 1: Lock the target contract with tests

**Files:**
- Modify: `packages/pc-react/commerce/sdkwork-subscription-pc-react/tests/subscription.service.test.ts`
- Modify: `packages/pc-react/commerce/sdkwork-subscription-pc-react/tests/subscription.controller.test.ts`
- Create: `packages/pc-react/commerce/sdkwork-subscription-pc-react/tests/subscription.payment-methods.test.tsx`
- Create: `packages/pc-react/commerce/sdkwork-subscription-pc-react/tests/subscription.checkout-panel.test.tsx`

- [ ] Step 1: Write failing tests for runtime-backed payment method options and selected payment method ids
- [ ] Step 2: Run the targeted subscription tests and confirm the new expectations fail for the intended reason
- [ ] Step 3: Write failing component tests for the extracted payment methods and checkout panel composition
- [ ] Step 4: Run the targeted component tests and confirm they fail cleanly

### Task 2: Implement the payment contract and service mapping

**Files:**
- Modify: `packages/pc-react/commerce/sdkwork-subscription-pc-react/src/subscription.ts`
- Modify: `packages/pc-react/commerce/sdkwork-subscription-pc-react/src/subscription-service.ts`
- Modify: `packages/pc-react/commerce/sdkwork-subscription-pc-react/package.json`

- [ ] Step 1: Add the subscription payment option model and selected payment method id/code fields
- [ ] Step 2: Add fallback payment option helpers and backend submit adapters
- [ ] Step 3: Integrate `sdkwork-payment-pc-react` service into subscription service dashboard loading
- [ ] Step 4: Re-run the subscription service tests and make them pass

### Task 3: Refactor controller state around payment option ids

**Files:**
- Modify: `packages/pc-react/commerce/sdkwork-subscription-pc-react/src/subscription-controller.ts`
- Modify: `packages/pc-react/commerce/sdkwork-subscription-pc-react/tests/subscription.controller.test.ts`
- Modify: `packages/pc-react/commerce/sdkwork-subscription-pc-react/tests/subscription.page.test.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-subscription-pc-react/tests/subscription.test.ts`
- Modify: `packages/pc-react/commerce/sdkwork-subscription-pc-react/tests/subscription.stage-shell.test.tsx`

- [ ] Step 1: Move controller state from selected payment enum to selected payment method id
- [ ] Step 2: Resolve checkout estimates from selected payment option id/code
- [ ] Step 3: Map the selected option back to the submit enum only during mutation
- [ ] Step 4: Re-run controller and page tests until green

### Task 4: Split the checkout panel into reusable components

**Files:**
- Modify: `packages/pc-react/commerce/sdkwork-subscription-pc-react/src/components/subscription-checkout-panel.tsx`
- Create: `packages/pc-react/commerce/sdkwork-subscription-pc-react/src/components/subscription-selected-plan-card.tsx`
- Create: `packages/pc-react/commerce/sdkwork-subscription-pc-react/src/components/subscription-coupon-list.tsx`
- Create: `packages/pc-react/commerce/sdkwork-subscription-pc-react/src/components/subscription-payment-methods.tsx`
- Create: `packages/pc-react/commerce/sdkwork-subscription-pc-react/src/components/subscription-price-summary.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-subscription-pc-react/src/index.ts`

- [ ] Step 1: Implement a focused selected-plan card
- [ ] Step 2: Implement coupon selection list component
- [ ] Step 3: Implement payment methods selector component using the new option model
- [ ] Step 4: Implement price summary component
- [ ] Step 5: Compose them in the checkout panel and export reusable pieces
- [ ] Step 6: Re-run the new component tests until green

### Task 5: Final verification and documentation update

**Files:**
- Modify: `packages/pc-react/commerce/sdkwork-subscription-pc-react/README.md`
- Modify: `docs/superpowers/specs/2026-04-04-sdkwork-appbase-subscription-payment-contract-componentization-design.md`
- Modify: `docs/superpowers/plans/2026-04-04-sdkwork-appbase-subscription-payment-contract-componentization.md`

- [ ] Step 1: Update README to document runtime payment methods and reusable checkout panel components
- [ ] Step 2: Run `pnpm --dir packages/pc-react/commerce/sdkwork-subscription-pc-react exec tsc --noEmit`
- [ ] Step 3: Run `pnpm test -- packages/pc-react/commerce/sdkwork-subscription-pc-react/tests`
- [ ] Step 4: Run `pnpm test -- packages/pc-react/commerce`
- [ ] Step 5: Run `pnpm run review:structure`
- [ ] Step 6: Reflect any verification-driven fixes back into docs
