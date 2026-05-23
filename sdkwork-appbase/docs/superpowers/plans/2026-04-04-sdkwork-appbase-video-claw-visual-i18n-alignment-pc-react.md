# SDKWORK Video Claw Visual And I18n Alignment PC React Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align `@sdkwork/video-pc-react` with `claw-studio` visual, theme, and internationalization standards while preserving video controller and service behavior.

**Architecture:** Add a package-local video copy/context layer, refactor the page and exported components to consume it, and replace page-local hero and chip styling with reusable token-driven appearance helpers shared across the aligned content packages.

**Tech Stack:** React 19, TypeScript, Vitest, Testing Library, `@sdkwork/ui-pc-react`, `@sdkwork/core-pc-react`, package-local copy/context helpers

---

### Task 1: Lock the video localization and appearance seams with failing tests

**Files:**
- Create: `packages/pc-react/content/sdkwork-video-pc-react/tests/video.intl.test.tsx`
- Create: `packages/pc-react/content/sdkwork-video-pc-react/tests/video.appearance.test.ts`
- Modify: `packages/pc-react/content/sdkwork-video-pc-react/tests/video.page.test.tsx`
- Modify: `packages/pc-react/content/sdkwork-video-pc-react/tests/video.controller.test.ts`

- [ ] Step 1: Add a failing page test for host message overrides on the video page seam.
- [ ] Step 2: Add a failing standalone component intl-provider test.
- [ ] Step 3: Add a failing controller fallback override test.
- [ ] Step 4: Add a failing appearance export test.
- [ ] Step 5: Run the focused video tests and verify they fail on the missing seam work.

### Task 2: Add package-local video copy, intl, and appearance infrastructure

**Files:**
- Create: `packages/pc-react/content/sdkwork-video-pc-react/src/video-copy.ts`
- Create: `packages/pc-react/content/sdkwork-video-pc-react/src/video-intl.tsx`
- Create: `packages/pc-react/content/sdkwork-video-pc-react/src/video-appearance.ts`
- Modify: `packages/pc-react/content/sdkwork-video-pc-react/src/index.ts`

- [ ] Step 1: Define locale normalization and built-in dictionaries.
- [ ] Step 2: Add provider/hook and reusable formatting helpers.
- [ ] Step 3: Export copy, intl, and appearance seams from the package entrypoint.

### Task 3: Refactor video surfaces onto the new seams

**Files:**
- Modify: `packages/pc-react/content/sdkwork-video-pc-react/src/pages/VideoPage.tsx`
- Modify: `packages/pc-react/content/sdkwork-video-pc-react/src/components/VideoGallery.tsx`
- Modify: `packages/pc-react/content/sdkwork-video-pc-react/src/components/VideoSummaryCards.tsx`
- Modify: `packages/pc-react/content/sdkwork-video-pc-react/src/video-controller.ts`

- [ ] Step 1: Replace hardcoded strings with copy/context lookups.
- [ ] Step 2: Replace raw cyan/sky chip states with appearance helpers.
- [ ] Step 3: Localize controller fallback error copy.
- [ ] Step 4: Re-run focused video tests until green.

### Task 4: Update docs and run package verification

**Files:**
- Modify: `packages/pc-react/content/sdkwork-video-pc-react/README.md`
- Modify: `docs/superpowers/specs/2026-04-04-sdkwork-appbase-video-claw-visual-i18n-alignment-pc-react-design.md`
- Modify: `docs/superpowers/plans/2026-04-04-sdkwork-appbase-video-claw-visual-i18n-alignment-pc-react.md`

- [ ] Step 1: Update the README to describe the new reuse seams.
- [ ] Step 2: Run `pnpm test -- packages/pc-react/content/sdkwork-video-pc-react`.
- [ ] Step 3: Run `pnpm --dir packages/pc-react/content/sdkwork-video-pc-react exec tsc --noEmit`.
- [ ] Step 4: Reflect any verification-driven changes back into the design and plan docs.
