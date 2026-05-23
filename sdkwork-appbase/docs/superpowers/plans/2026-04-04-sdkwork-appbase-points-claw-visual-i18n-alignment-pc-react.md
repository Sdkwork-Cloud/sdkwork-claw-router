# SDKWORK Points Claw Visual And I18n Alignment PC React Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align `@sdkwork/points-pc-react` with `claw-studio` visual, theme, and internationalization standards while preserving the existing points dashboard and wallet-derived business contracts.

**Architecture:** Promote points copy and formatting into package-local `points-copy.ts` and `points-intl.tsx`, expose reusable Claw-style appearance helpers in `points-appearance.ts`, then refactor page, quick panel, header entry, dialogs, and transaction list onto those seams.

**Tech Stack:** React 19, TypeScript, Vitest, Testing Library, `@sdkwork/ui-pc-react`, `@sdkwork/wallet-pc-react`, package-local copy/context helpers

---

### Task 1: Lock localization and appearance seams with tests

**Files:**
- Create: `packages/pc-react/commerce/sdkwork-points-pc-react/tests/points.intl.test.tsx`
- Create: `packages/pc-react/commerce/sdkwork-points-pc-react/tests/points.appearance.test.ts`

- [x] Step 1: Add a failing test for Chinese copy rendering through the points page seam.
- [x] Step 2: Add a failing test for host copy overrides on top of the localized seam.
- [x] Step 3: Add a failing test that standalone points components keep safe English fallback without a host provider.
- [x] Step 4: Add a failing test for the exported points appearance helper surface.

### Task 2: Add package-local points copy, intl, and appearance infrastructure

**Files:**
- Create: `packages/pc-react/commerce/sdkwork-points-pc-react/src/points-copy.ts`
- Create: `packages/pc-react/commerce/sdkwork-points-pc-react/src/points-intl.tsx`
- Create: `packages/pc-react/commerce/sdkwork-points-pc-react/src/points-appearance.ts`
- Modify: `packages/pc-react/commerce/sdkwork-points-pc-react/src/index.ts`

- [x] Step 1: Define normalized locale handling and built-in `en-US` / `zh-CN` dictionaries.
- [x] Step 2: Add a points intl provider and hook with safe English fallback.
- [x] Step 3: Add reusable appearance helpers for hero, backdrop, panels, and tone chips.
- [x] Step 4: Export the new copy/context/appearance primitives from the package entrypoint.

### Task 3: Refactor points exports onto the new package seams

**Files:**
- Modify: `packages/pc-react/commerce/sdkwork-points-pc-react/src/pages/PointsPage.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-points-pc-react/src/components/points-header-entry.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-points-pc-react/src/components/points-quick-panel.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-points-pc-react/src/components/points-recharge-dialog.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-points-pc-react/src/components/points-upgrade-dialog.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-points-pc-react/src/components/points-transaction-list.tsx`

- [x] Step 1: Replace hardcoded strings across page, quick entry, dialogs, and transaction surfaces with points copy/context lookups.
- [x] Step 2: Add page-level `locale` and `messages` props for host-driven copy alignment.
- [x] Step 3: Move plan title, plan duration, points rate, payment method, status, and timestamp wording onto locale-aware formatting helpers.
- [x] Step 4: Restyle hero, quick panel, header entry, and dialogs with reusable Claw-aligned appearance helpers.

### Task 4: Update docs and run package/workspace verification

**Files:**
- Modify: `packages/pc-react/commerce/sdkwork-points-pc-react/README.md`
- Create: `docs/superpowers/specs/2026-04-04-sdkwork-appbase-points-claw-visual-i18n-alignment-pc-react-design.md`
- Create: `docs/superpowers/plans/2026-04-04-sdkwork-appbase-points-claw-visual-i18n-alignment-pc-react.md`

- [x] Step 1: Update the package README to describe the new copy/context seam and Claw alignment contract.
- [x] Step 2: Run `pnpm test -- packages/pc-react/commerce/sdkwork-points-pc-react/tests/points.intl.test.tsx`.
- [x] Step 3: Run `pnpm test -- packages/pc-react/commerce/sdkwork-points-pc-react/tests/points.appearance.test.ts`.
- [x] Step 4: Run `pnpm test -- packages/pc-react/commerce/sdkwork-points-pc-react`.
- [x] Step 5: Run `pnpm --dir packages/pc-react/commerce/sdkwork-points-pc-react exec tsc --noEmit`.
- [ ] Step 6: Run `pnpm test -- packages/pc-react/commerce`.
- [ ] Step 7: Run `pnpm run review:structure`.
