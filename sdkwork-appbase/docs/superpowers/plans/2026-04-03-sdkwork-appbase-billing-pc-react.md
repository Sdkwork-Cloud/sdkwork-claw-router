# SDKWORK Appbase Billing PC React Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Land `@sdkwork/billing-pc-react` as the reusable billing-center and metered consumption package for SDKWORK desktop apps, then register it across appbase commerce catalogs.

**Architecture:** Build one focused commerce package that composes wallet, points, subscription, order, payment, invoice, and offer services into a normalized billing dashboard. Expose the result through pure headless helpers, a filter-aware controller, reusable summary and breakdown components, and a Claw-inspired billing page. Keep payment, invoice, order, and subscription mutations inside their existing packages.

**Tech Stack:** TypeScript, React 18, Vitest, Testing Library, `@sdkwork/appbase-pc-react`, `@sdkwork/ui-pc-react`, `@sdkwork/core-pc-react`, `@sdkwork/wallet-pc-react`, `@sdkwork/points-pc-react`, `@sdkwork/subscription-pc-react`, `@sdkwork/order-pc-react`, `@sdkwork/payment-pc-react`, `@sdkwork/invoice-pc-react`, `@sdkwork/offer-pc-react`, `lucide-react`.

---

### Task 1: Freeze The Billing Boundary

**Files:**
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\docs\superpowers\specs\2026-04-03-sdkwork-appbase-billing-pc-react-design.md`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\docs\superpowers\plans\2026-04-03-sdkwork-appbase-billing-pc-react.md`

- [ ] **Step 1: Freeze the distinction between billing posture and payment or invoice execution**
- [ ] **Step 2: Freeze the budget-policy, alert, and action-routing strategy**

### Task 2: Scaffold The Billing Package

**Files:**
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\packages\pc-react\commerce\sdkwork-billing-pc-react\package.json`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\packages\pc-react\commerce\sdkwork-billing-pc-react\README.md`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\packages\pc-react\commerce\sdkwork-billing-pc-react\tsconfig.json`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\packages\pc-react\commerce\sdkwork-billing-pc-react\src\index.ts`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\packages\pc-react\commerce\sdkwork-billing-pc-react\tests\.gitkeep`

- [ ] **Step 1: Add workspace metadata and dependency edges for appbase, UI, wallet, points, subscription, order, payment, invoice, and offer**
- [ ] **Step 2: Document the package as the billing center layer, not the payment or invoice execution layer**

### Task 3: Add RED Tests For Headless Helpers, Service, Controller, Components, And Page

**Files:**
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\packages\pc-react\commerce\sdkwork-billing-pc-react\tests\billing.test.ts`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\packages\pc-react\commerce\sdkwork-billing-pc-react\tests\billing.service.test.ts`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\packages\pc-react\commerce\sdkwork-billing-pc-react\tests\billing.controller.test.ts`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\packages\pc-react\commerce\sdkwork-billing-pc-react\tests\billing.summary-cards.test.tsx`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\packages\pc-react\commerce\sdkwork-billing-pc-react\tests\billing.breakdown-table.test.tsx`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\packages\pc-react\commerce\sdkwork-billing-pc-react\tests\billing.page.test.tsx`
- Modify: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\packages\pc-react\commerce\sdkwork-commerce-pc-react\tests\commerce.test.ts`
- Modify: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\packages\pc-react\foundation\sdkwork-appbase-pc-react\tests\catalog.test.ts`

- [ ] **Step 1: Write failing headless tests for budget policy, posture evaluation, usage aggregation, manifest, and route intents**
- [ ] **Step 2: Write failing service tests for healthy, watch, over-budget, and payment-attention scenarios**
- [ ] **Step 3: Write failing controller tests for bootstrap, tab selection, breakdown selection, and refresh**
- [ ] **Step 4: Write failing component and page tests for summary cards, breakdown rendering, tab switching, and navigation callbacks**
- [ ] **Step 5: Update commerce and appbase catalog tests to expect the new billing package**
- [ ] **Step 6: Run targeted tests and verify RED**

### Task 4: Implement Headless Billing Models And Composition Service

**Files:**
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\packages\pc-react\commerce\sdkwork-billing-pc-react\src\billing.ts`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\packages\pc-react\commerce\sdkwork-billing-pc-react\src\billing-service.ts`

- [ ] **Step 1: Implement usage-record, digest, breakdown, budget-policy, alert, manifest, and route-intent contracts**
- [ ] **Step 2: Implement deterministic posture evaluation and usage aggregation helpers**
- [ ] **Step 3: Implement the composed billing dashboard service on top of wallet, points, subscription, order, payment, invoice, and offer services**
- [ ] **Step 4: Run targeted headless and service tests again and verify GREEN**

### Task 5: Implement The Controller And Reusable UI Surfaces

**Files:**
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\packages\pc-react\commerce\sdkwork-billing-pc-react\src\billing-controller.ts`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\packages\pc-react\commerce\sdkwork-billing-pc-react\src\components\BillingSummaryCards.tsx`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\packages\pc-react\commerce\sdkwork-billing-pc-react\src\components\BillingBreakdownTable.tsx`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\packages\pc-react\commerce\sdkwork-billing-pc-react\src\pages\BillingPage.tsx`

- [ ] **Step 1: Implement the controller with tab state, selected breakdown state, visible usage derivation, and refresh stability**
- [ ] **Step 2: Implement reusable summary cards for current spend, projected spend, budget, and posture**
- [ ] **Step 3: Implement reusable breakdown table and recent-usage list surfaces**
- [ ] **Step 4: Implement the Claw-style billing center page with hero, overview tab, invoice attention tab, and top action rail**
- [ ] **Step 5: Run targeted controller and React tests again and verify GREEN**

### Task 6: Register Billing Across Commerce Catalogs

**Files:**
- Modify: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\packages\pc-react\commerce\README.md`
- Modify: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\packages\pc-react\commerce\sdkwork-commerce-pc-react\src\commerce.ts`
- Modify: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\packages\pc-react\foundation\sdkwork-appbase-pc-react\src\catalog.ts`
- Modify: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\scripts\package-catalog.mjs`

- [ ] **Step 1: Add `@sdkwork/billing-pc-react` to the commerce domain catalog and README**
- [ ] **Step 2: Add `@sdkwork/billing-pc-react` to the commerce manifest package graph**
- [ ] **Step 3: Re-run targeted catalog and commerce manifest tests**

### Task 7: Verify The Workspace

**Files:**
- Modify: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\pnpm-lock.yaml` if workspace linkage changes it

- [ ] **Step 1: Run `pnpm install` from `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase` if dependency linkage changes**
- [ ] **Step 2: Run `pnpm test -- packages/pc-react/commerce/sdkwork-billing-pc-react/tests/billing.test.ts packages/pc-react/commerce/sdkwork-billing-pc-react/tests/billing.service.test.ts packages/pc-react/commerce/sdkwork-billing-pc-react/tests/billing.controller.test.ts packages/pc-react/commerce/sdkwork-billing-pc-react/tests/billing.summary-cards.test.tsx packages/pc-react/commerce/sdkwork-billing-pc-react/tests/billing.breakdown-table.test.tsx packages/pc-react/commerce/sdkwork-billing-pc-react/tests/billing.page.test.tsx packages/pc-react/commerce/sdkwork-commerce-pc-react/tests/commerce.test.ts packages/pc-react/foundation/sdkwork-appbase-pc-react/tests/catalog.test.ts`**
- [ ] **Step 3: Run `pnpm typecheck` from `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase`**
- [ ] **Step 4: Run `pnpm test` from `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase`**
- [ ] **Step 5: Run `pnpm run review:structure` from `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase`**
- [ ] **Step 6: Review the next commercialization gap after billing stabilizes**

## Execution Note

The user explicitly asked for autonomous execution without pauses in this session, so this plan should be executed inline without waiting for a separate human handoff.
