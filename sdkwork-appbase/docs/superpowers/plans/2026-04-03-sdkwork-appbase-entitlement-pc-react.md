# SDKWORK Appbase Entitlement PC React Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Land `@sdkwork/entitlement-pc-react` as the reusable commercial access and paywall package for SDKWORK desktop apps, then register it across appbase commerce catalogs.

**Architecture:** Build one focused commerce package that normalizes capability descriptors into entitlement decisions by composing wallet, VIP, points, and offer services. Expose the result through pure headless helpers, a filter-aware controller, an embeddable gate component, and a Claw-style entitlement center page. Keep payment, invoice, VIP mutation, and recharge execution inside their existing packages.

**Tech Stack:** TypeScript, React 18, Vitest, Testing Library, `@sdkwork/appbase-pc-react`, `@sdkwork/ui-pc-react`, `@sdkwork/wallet-pc-react`, `@sdkwork/vip-pc-react`, `@sdkwork/points-pc-react`, `@sdkwork/offer-pc-react`, `@sdkwork/subscription-pc-react`, `lucide-react`.

---

### Task 1: Freeze The Entitlement Boundary

**Files:**
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\docs\superpowers\specs\2026-04-03-sdkwork-appbase-entitlement-pc-react-design.md`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\docs\superpowers\plans\2026-04-03-sdkwork-appbase-entitlement-pc-react.md`

- [ ] **Step 1: Freeze the distinction between system permissions and commercial entitlements**
- [ ] **Step 2: Freeze the starter-catalog and action-routing strategy**

### Task 2: Scaffold The Entitlement Package

**Files:**
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\packages\pc-react\commerce\sdkwork-entitlement-pc-react\package.json`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\packages\pc-react\commerce\sdkwork-entitlement-pc-react\README.md`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\packages\pc-react\commerce\sdkwork-entitlement-pc-react\tsconfig.json`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\packages\pc-react\commerce\sdkwork-entitlement-pc-react\src\index.ts`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\packages\pc-react\commerce\sdkwork-entitlement-pc-react\tests\.gitkeep`

- [ ] **Step 1: Add workspace metadata and dependency edges for appbase, UI, wallet, VIP, points, offer, and subscription**
- [ ] **Step 2: Document the package as the commercial access layer, not the membership or permission layer**

### Task 3: Add RED Tests For Headless Helpers, Service, Controller, Gate, And Page

**Files:**
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\packages\pc-react\commerce\sdkwork-entitlement-pc-react\tests\entitlement.test.ts`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\packages\pc-react\commerce\sdkwork-entitlement-pc-react\tests\entitlement.service.test.ts`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\packages\pc-react\commerce\sdkwork-entitlement-pc-react\tests\entitlement.controller.test.ts`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\packages\pc-react\commerce\sdkwork-entitlement-pc-react\tests\entitlement.gate.test.tsx`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\packages\pc-react\commerce\sdkwork-entitlement-pc-react\tests\entitlement.page.test.tsx`
- Modify: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\packages\pc-react\commerce\sdkwork-commerce-pc-react\tests\commerce.test.ts`
- Modify: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\packages\pc-react\foundation\sdkwork-appbase-pc-react\tests\catalog.test.ts`

- [ ] **Step 1: Write failing headless tests for descriptor evaluation, digests, starter catalog, manifest, and route intents**
- [ ] **Step 2: Write failing service tests for guest locking, upgrade and recharge routing, and top-action composition**
- [ ] **Step 3: Write failing controller tests for bootstrap, filter changes, selection, and refresh**
- [ ] **Step 4: Write failing gate and page tests for paywall fallback, near-limit messaging, and navigate callbacks**
- [ ] **Step 5: Update commerce and appbase catalog tests to expect the new package boundary**
- [ ] **Step 6: Run targeted tests and verify RED**

### Task 4: Implement Headless Entitlement Models And Composition Service

**Files:**
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\packages\pc-react\commerce\sdkwork-entitlement-pc-react\src\entitlement.ts`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\packages\pc-react\commerce\sdkwork-entitlement-pc-react\src\entitlement-service.ts`

- [ ] **Step 1: Implement descriptor contracts, starter catalog helpers, manifest helpers, route helpers, and digest helpers**
- [ ] **Step 2: Implement deterministic entitlement evaluation rules for guest, upgrade, recharge, quota, and near-limit states**
- [ ] **Step 3: Implement the composed dashboard service on top of wallet, VIP, points, offer, and subscription routes**
- [ ] **Step 4: Run targeted headless and service tests again and verify GREEN**

### Task 5: Implement The Controller And UI Surfaces

**Files:**
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\packages\pc-react\commerce\sdkwork-entitlement-pc-react\src\entitlement-controller.ts`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\packages\pc-react\commerce\sdkwork-entitlement-pc-react\src\components\EntitlementGate.tsx`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\packages\pc-react\commerce\sdkwork-entitlement-pc-react\src\pages\EntitlementPage.tsx`

- [ ] **Step 1: Implement the controller with filter state, selected capability state, visible decision derivation, and refresh stability**
- [ ] **Step 2: Implement the embeddable gate surface for ready, limited, and blocked commercial states**
- [ ] **Step 3: Implement the Claw-style entitlement center with hero, status metrics, decision cards, and selected detail panel**
- [ ] **Step 4: Run targeted controller and React tests again and verify GREEN**

### Task 6: Register Entitlement Across Commerce Catalogs

**Files:**
- Modify: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\packages\pc-react\commerce\README.md`
- Modify: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\packages\pc-react\commerce\sdkwork-commerce-pc-react\src\commerce.ts`
- Modify: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\packages\pc-react\foundation\sdkwork-appbase-pc-react\src\catalog.ts`
- Modify: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\scripts\package-catalog.mjs`

- [ ] **Step 1: Add `@sdkwork/entitlement-pc-react` to the commerce domain catalog and README**
- [ ] **Step 2: Add `@sdkwork/entitlement-pc-react` to the commerce manifest package graph**
- [ ] **Step 3: Re-run targeted catalog and commerce manifest tests**

### Task 7: Verify The Workspace

**Files:**
- Modify: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\pnpm-lock.yaml` if workspace linkage changes it

- [ ] **Step 1: Run `pnpm install` from `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase` if dependency linkage changes**
- [ ] **Step 2: Run `pnpm test -- packages/pc-react/commerce/sdkwork-entitlement-pc-react/tests/entitlement.test.ts packages/pc-react/commerce/sdkwork-entitlement-pc-react/tests/entitlement.service.test.ts packages/pc-react/commerce/sdkwork-entitlement-pc-react/tests/entitlement.controller.test.ts packages/pc-react/commerce/sdkwork-entitlement-pc-react/tests/entitlement.gate.test.tsx packages/pc-react/commerce/sdkwork-entitlement-pc-react/tests/entitlement.page.test.tsx packages/pc-react/commerce/sdkwork-commerce-pc-react/tests/commerce.test.ts packages/pc-react/foundation/sdkwork-appbase-pc-react/tests/catalog.test.ts`**
- [ ] **Step 3: Run `pnpm typecheck` from `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase`**
- [ ] **Step 4: Run `pnpm test` from `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase`**
- [ ] **Step 5: Run `pnpm run review:structure` from `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase`**
- [ ] **Step 6: Review the next commercialization gap after entitlement stabilizes**

## Execution Note

The user explicitly asked for autonomous execution without pauses in this session, so this plan should be executed inline without waiting for a separate human handoff.
