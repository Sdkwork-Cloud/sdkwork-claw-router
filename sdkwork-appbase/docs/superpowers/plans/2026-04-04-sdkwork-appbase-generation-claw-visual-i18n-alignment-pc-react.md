# SDKWORK Generation Claw Visual And I18n Alignment PC React Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align `@sdkwork/generation-pc-react` with `claw-studio` visual, theme, and internationalization standards while preserving generation controller and service behavior.

**Architecture:** Add a package-local generation copy/context layer with built-in English and Chinese dictionaries, refactor the exported generation surfaces to consume it, and replace hardcoded hero and selection styles with token-driven appearance helpers that match the Claw workspace shell rhythm.

**Tech Stack:** React 19, TypeScript, Vitest, Testing Library, `@sdkwork/ui-pc-react`, `@sdkwork/core-pc-react`, package-local copy/context helpers

---

### Task 1: Lock the localization and appearance seams with failing tests

**Files:**
- Create: `packages/pc-react/content/sdkwork-generation-pc-react/tests/generation.intl.test.tsx`
- Create: `packages/pc-react/content/sdkwork-generation-pc-react/tests/generation.appearance.test.ts`
- Modify: `packages/pc-react/content/sdkwork-generation-pc-react/tests/generation.page.test.tsx`
- Modify: `packages/pc-react/content/sdkwork-generation-pc-react/tests/generation.controller.test.ts`

- [ ] Step 1: Add a failing page test for Chinese copy rendering through the generation page seam.
- [ ] Step 2: Add a failing intl test for safe English fallback formatting without a host provider.
- [ ] Step 3: Add a failing controller test for localized fallback load error copy.
- [ ] Step 4: Add a failing appearance test for the new generation visual helpers.
- [ ] Step 5: Run the focused generation tests and verify they fail for the missing seam work.

### Task 2: Add package-local generation copy and formatting infrastructure

**Files:**
- Create: `packages/pc-react/content/sdkwork-generation-pc-react/src/generation-copy.ts`
- Create: `packages/pc-react/content/sdkwork-generation-pc-react/src/generation-intl.tsx`
- Modify: `packages/pc-react/content/sdkwork-generation-pc-react/src/index.ts`

- [ ] Step 1: Define locale normalization and built-in `en-US` / `zh-CN` dictionaries for page, summary, list, detail, and service copy.
- [ ] Step 2: Add a generation intl provider and hook with safe English fallback.
- [ ] Step 3: Export the new copy and intl primitives from the package entrypoint.
- [ ] Step 4: Re-run the focused intl tests until green.

### Task 3: Refactor generation page and components onto the copy and appearance layers

**Files:**
- Create: `packages/pc-react/content/sdkwork-generation-pc-react/src/generation-appearance.ts`
- Modify: `packages/pc-react/content/sdkwork-generation-pc-react/src/pages/GenerationPage.tsx`
- Modify: `packages/pc-react/content/sdkwork-generation-pc-react/src/components/GenerationRunSummary.tsx`
- Modify: `packages/pc-react/content/sdkwork-generation-pc-react/src/components/GenerationRunList.tsx`
- Modify: `packages/pc-react/content/sdkwork-generation-pc-react/src/components/GenerationRunDetail.tsx`
- Modify: `packages/pc-react/content/sdkwork-generation-pc-react/src/generation-controller.ts`
- Modify: `packages/pc-react/content/sdkwork-generation-pc-react/src/index.ts`

- [ ] Step 1: Replace hardcoded strings with localized copy/context lookups across the page and exported components.
- [ ] Step 2: Add locale-aware formatting for status labels, metrics, and latency values.
- [ ] Step 3: Introduce reusable appearance helpers and restyle the hero, summary cards, list selection state, and detail panel to align with Claw shell surfaces.
- [ ] Step 4: Re-run targeted page and controller tests until green.

### Task 4: Update package docs and run verification

**Files:**
- Modify: `packages/pc-react/content/sdkwork-generation-pc-react/README.md`
- Modify: `docs/superpowers/specs/2026-04-04-sdkwork-appbase-generation-claw-visual-i18n-alignment-pc-react-design.md`
- Modify: `docs/superpowers/plans/2026-04-04-sdkwork-appbase-generation-claw-visual-i18n-alignment-pc-react.md`

- [ ] Step 1: Update the README to describe the generation copy, intl, and appearance seams.
- [ ] Step 2: Run `pnpm test -- packages/pc-react/content/sdkwork-generation-pc-react`.
- [ ] Step 3: Run `pnpm --dir packages/pc-react/content/sdkwork-generation-pc-react exec tsc --noEmit`.
- [ ] Step 4: Reflect any verification-driven changes back into the design and plan docs.
