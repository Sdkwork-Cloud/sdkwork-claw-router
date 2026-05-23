# SDKWORK Image Claw Visual And I18n Alignment PC React Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align `@sdkwork/image-pc-react` with `claw-studio` visual, theme, and internationalization standards while preserving image controller and service behavior.

**Architecture:** Add a package-local image copy/context layer, refactor the page and exported components to consume it, and replace page-local hero and chip styling with reusable token-driven appearance helpers.

**Tech Stack:** React 19, TypeScript, Vitest, Testing Library, `@sdkwork/ui-pc-react`, `@sdkwork/core-pc-react`, package-local copy/context helpers

---

### Task 1: Lock the image localization and appearance seams with failing tests

**Files:**
- Create: `packages/pc-react/content/sdkwork-image-pc-react/tests/image.intl.test.tsx`
- Create: `packages/pc-react/content/sdkwork-image-pc-react/tests/image.appearance.test.ts`
- Modify: `packages/pc-react/content/sdkwork-image-pc-react/tests/image.page.test.tsx`
- Modify: `packages/pc-react/content/sdkwork-image-pc-react/tests/image.controller.test.ts`

- [ ] Step 1: Add a failing page test for host message overrides on the image page seam.
- [ ] Step 2: Add a failing standalone component intl-provider test.
- [ ] Step 3: Add a failing controller fallback override test.
- [ ] Step 4: Add a failing appearance export test.
- [ ] Step 5: Run the focused image tests and verify they fail on the missing seam work.

### Task 2: Add package-local image copy, intl, and appearance infrastructure

**Files:**
- Create: `packages/pc-react/content/sdkwork-image-pc-react/src/image-copy.ts`
- Create: `packages/pc-react/content/sdkwork-image-pc-react/src/image-intl.tsx`
- Create: `packages/pc-react/content/sdkwork-image-pc-react/src/image-appearance.ts`
- Modify: `packages/pc-react/content/sdkwork-image-pc-react/src/index.ts`

- [ ] Step 1: Define locale normalization and built-in dictionaries.
- [ ] Step 2: Add provider/hook and reusable formatting helpers.
- [ ] Step 3: Export copy, intl, and appearance seams from the package entrypoint.

### Task 3: Refactor image surfaces onto the new seams

**Files:**
- Modify: `packages/pc-react/content/sdkwork-image-pc-react/src/pages/ImagePage.tsx`
- Modify: `packages/pc-react/content/sdkwork-image-pc-react/src/components/ImageGallery.tsx`
- Modify: `packages/pc-react/content/sdkwork-image-pc-react/src/components/ImageSummaryCards.tsx`
- Modify: `packages/pc-react/content/sdkwork-image-pc-react/src/image-controller.ts`

- [ ] Step 1: Replace hardcoded strings with copy/context lookups.
- [ ] Step 2: Replace raw cyan chip states with appearance helpers.
- [ ] Step 3: Localize controller fallback error copy.
- [ ] Step 4: Re-run focused image tests until green.

### Task 4: Update docs and run package verification

**Files:**
- Modify: `packages/pc-react/content/sdkwork-image-pc-react/README.md`
- Modify: `docs/superpowers/specs/2026-04-04-sdkwork-appbase-image-claw-visual-i18n-alignment-pc-react-design.md`
- Modify: `docs/superpowers/plans/2026-04-04-sdkwork-appbase-image-claw-visual-i18n-alignment-pc-react.md`

- [ ] Step 1: Update the README to describe the new reuse seams.
- [ ] Step 2: Run `pnpm test -- packages/pc-react/content/sdkwork-image-pc-react`.
- [ ] Step 3: Run `pnpm --dir packages/pc-react/content/sdkwork-image-pc-react exec tsc --noEmit`.
- [ ] Step 4: Reflect any verification-driven changes back into the design and plan docs.
