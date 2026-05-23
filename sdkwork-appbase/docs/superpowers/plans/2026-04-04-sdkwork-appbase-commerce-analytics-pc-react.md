# SDKWORK Commerce Analytics PC React Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend `@sdkwork/commerce-pc-react` with reusable revenue analytics, product-performance, and operator-alert capabilities.

**Architecture:** Keep the existing commerce hub intact, then add derived analytics contracts, service composition, and reusable dashboard panels on top of already-normalized commerce package data. Do not introduce app-local transport or Claw-specific dependencies.

**Tech Stack:** React 18, TypeScript, Vitest, Testing Library, `@sdkwork/ui-pc-react`, existing `sdkwork-appbase` commerce packages

---

### Task 1: Lock the analytics contract with tests

**Files:**
- Modify: `packages/pc-react/commerce/sdkwork-commerce-pc-react/tests/commerce.service.test.ts`
- Modify: `packages/pc-react/commerce/sdkwork-commerce-pc-react/tests/commerce.page.test.tsx`
- Create: `packages/pc-react/commerce/sdkwork-commerce-pc-react/tests/commerce.analytics-summary.test.tsx`
- Create: `packages/pc-react/commerce/sdkwork-commerce-pc-react/tests/commerce.revenue-panel.test.tsx`
- Create: `packages/pc-react/commerce/sdkwork-commerce-pc-react/tests/commerce.analytics-workbench.test.tsx`

- [ ] Step 1: Extend the service test with failing assertions for revenue trend, revenue records, product performance, and alerts.
- [ ] Step 2: Run `pnpm test -- packages/pc-react/commerce/sdkwork-commerce-pc-react/tests/commerce.service.test.ts` and confirm the new expectations fail.
- [ ] Step 3: Add failing component tests for analytics summary, revenue panel, and analytics workbench.
- [ ] Step 4: Run the new component tests and confirm they fail cleanly.
- [ ] Step 5: Extend the page test with analytics-specific expectations and confirm failure.

### Task 2: Add analytics contracts and derived service composition

**Files:**
- Modify: `packages/pc-react/commerce/sdkwork-commerce-pc-react/src/commerce-service.ts`

- [ ] Step 1: Add analytics summary, trend point, revenue record, product performance, and alert contracts.
- [ ] Step 2: Derive analytics from normalized order, payment, invoice, wallet, and offer data.
- [ ] Step 3: Keep the calculations deterministic and transport-agnostic.
- [ ] Step 4: Re-run `commerce.service.test.ts` until green.

### Task 3: Build reusable analytics components

**Files:**
- Create: `packages/pc-react/commerce/sdkwork-commerce-pc-react/src/components/commerce-analytics-summary.tsx`
- Create: `packages/pc-react/commerce/sdkwork-commerce-pc-react/src/components/commerce-revenue-panel.tsx`
- Create: `packages/pc-react/commerce/sdkwork-commerce-pc-react/src/components/commerce-analytics-workbench.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-commerce-pc-react/src/index.ts`

- [ ] Step 1: Implement summary KPI cards for revenue, AOV, orders, and alerts.
- [ ] Step 2: Implement a revenue panel with lightweight SVG trend rendering and product-share visualization.
- [ ] Step 3: Implement an analytics workbench for revenue records, product performance, and alerts.
- [ ] Step 4: Re-run the new component tests until green.

### Task 4: Integrate analytics into the commerce page

**Files:**
- Modify: `packages/pc-react/commerce/sdkwork-commerce-pc-react/src/pages/CommercePage.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-commerce-pc-react/tests/commerce.page.test.tsx`

- [ ] Step 1: Insert the analytics summary and revenue panel below the hero.
- [ ] Step 2: Add the analytics workbench before the existing recent-activity grid.
- [ ] Step 3: Preserve existing featured-offers and activity-grid behavior.
- [ ] Step 4: Re-run the page test until green.

### Task 5: Document and verify the expanded commerce hub

**Files:**
- Modify: `packages/pc-react/commerce/sdkwork-commerce-pc-react/README.md`
- Modify: `packages/pc-react/commerce/README.md`
- Modify: `docs/superpowers/specs/2026-04-04-sdkwork-appbase-commerce-analytics-pc-react-design.md`
- Modify: `docs/superpowers/plans/2026-04-04-sdkwork-appbase-commerce-analytics-pc-react.md`

- [ ] Step 1: Update README documentation for analytics ownership and new exports.
- [ ] Step 2: Run `pnpm --dir packages/pc-react/commerce/sdkwork-commerce-pc-react exec tsc --noEmit`.
- [ ] Step 3: Run `pnpm test -- packages/pc-react/commerce/sdkwork-commerce-pc-react/tests`.
- [ ] Step 4: Run `pnpm test -- packages/pc-react/commerce`.
- [ ] Step 5: Run `pnpm run review:structure`.
- [ ] Step 6: Reflect verification-driven fixes back into the spec and plan docs.
