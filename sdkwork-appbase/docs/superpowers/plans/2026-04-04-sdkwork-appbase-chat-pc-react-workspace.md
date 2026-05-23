# SDKWORK Chat Workspace PC React Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `@sdkwork/chat-pc-react` from a headless contract package into a reusable routeable chat workspace for PC React applications.

**Architecture:** Keep the existing headless chat modeling API intact, then layer a service, controller, reusable components, and a page on top. Compose model catalog and route readiness from existing intelligence packages instead of introducing product-local backend logic.

**Tech Stack:** React 18, TypeScript, Vitest, Testing Library, `@sdkwork/ui-pc-react`, `@sdkwork/core-pc-react`, existing `sdkwork-appbase` intelligence packages

---

### Task 1: Lock the workspace contract with tests

**Files:**
- Modify: `packages/pc-react/intelligence/sdkwork-chat-pc-react/tests/chat.test.ts`
- Create: `packages/pc-react/intelligence/sdkwork-chat-pc-react/tests/chat.service.test.ts`
- Create: `packages/pc-react/intelligence/sdkwork-chat-pc-react/tests/chat.controller.test.ts`
- Create: `packages/pc-react/intelligence/sdkwork-chat-pc-react/tests/chat.session-rail.test.tsx`
- Create: `packages/pc-react/intelligence/sdkwork-chat-pc-react/tests/chat.transcript.test.tsx`
- Create: `packages/pc-react/intelligence/sdkwork-chat-pc-react/tests/chat.composer.test.tsx`
- Create: `packages/pc-react/intelligence/sdkwork-chat-pc-react/tests/chat.page.test.tsx`

- [ ] Step 1: Extend `chat.test.ts` with failing assertions for workspace defaults, digest helpers, and curated fallback data.
- [ ] Step 2: Run `pnpm test -- packages/pc-react/intelligence/sdkwork-chat-pc-react/tests/chat.test.ts` and confirm the new assertions fail for the intended reasons.
- [ ] Step 3: Write failing service tests for auth-aware workspace loading, fallback sessions/models/routes, and readiness composition.
- [ ] Step 4: Run `pnpm test -- packages/pc-react/intelligence/sdkwork-chat-pc-react/tests/chat.service.test.ts` and confirm failure.
- [ ] Step 5: Write failing controller tests for bootstrap, search, session selection, draft mutation, model selection, and send flow.
- [ ] Step 6: Run `pnpm test -- packages/pc-react/intelligence/sdkwork-chat-pc-react/tests/chat.controller.test.ts` and confirm failure.
- [ ] Step 7: Write failing component and page tests for session rail, transcript, composer, and integrated page rendering.
- [ ] Step 8: Run the new component/page tests and confirm they fail cleanly.

### Task 2: Add workspace contracts and service composition

**Files:**
- Modify: `packages/pc-react/intelligence/sdkwork-chat-pc-react/src/chat.ts`
- Create: `packages/pc-react/intelligence/sdkwork-chat-pc-react/src/chat-service.ts`
- Modify: `packages/pc-react/intelligence/sdkwork-chat-pc-react/package.json`

- [ ] Step 1: Add workspace data, execution digest, and curated fallback helpers to `chat.ts`.
- [ ] Step 2: Implement a chat service that composes runtime auth state, optional sessions, model catalog, and route catalog into one workspace.
- [ ] Step 3: Keep service hooks narrow and optional so real apps can inject transport-backed loaders later.
- [ ] Step 4: Re-run `chat.test.ts` and `chat.service.test.ts` until green.

### Task 3: Implement controller state and optimistic send flow

**Files:**
- Create: `packages/pc-react/intelligence/sdkwork-chat-pc-react/src/chat-controller.ts`
- Modify: `packages/pc-react/intelligence/sdkwork-chat-pc-react/tests/chat.controller.test.ts`

- [ ] Step 1: Implement controller bootstrap, refresh, search, session selection, draft mutation, and model selection state.
- [ ] Step 2: Implement send behavior that appends a user message, adds an optimistic assistant message, finalizes it from a synthesized summary, and clears the draft.
- [ ] Step 3: Ensure selected model persists to the active session where appropriate.
- [ ] Step 4: Re-run `pnpm test -- packages/pc-react/intelligence/sdkwork-chat-pc-react/tests/chat.controller.test.ts` until green.

### Task 4: Build reusable chat workspace components

**Files:**
- Create: `packages/pc-react/intelligence/sdkwork-chat-pc-react/src/components/ChatComposerPanel.tsx`
- Create: `packages/pc-react/intelligence/sdkwork-chat-pc-react/src/components/ChatExecutionSummary.tsx`
- Create: `packages/pc-react/intelligence/sdkwork-chat-pc-react/src/components/ChatSessionRail.tsx`
- Create: `packages/pc-react/intelligence/sdkwork-chat-pc-react/src/components/ChatTranscript.tsx`
- Create: `packages/pc-react/intelligence/sdkwork-chat-pc-react/src/pages/ChatPage.tsx`
- Modify: `packages/pc-react/intelligence/sdkwork-chat-pc-react/src/index.ts`

- [ ] Step 1: Implement a session rail with search result state and active-session highlighting.
- [ ] Step 2: Implement transcript rendering for user and assistant messages plus tool-call and error hints.
- [ ] Step 3: Implement the composer panel with model selector, draft textarea, attachment summary, and send-state feedback.
- [ ] Step 4: Implement an execution summary surface showing readiness, route label, and blocker/warning counts.
- [ ] Step 5: Compose the full `ChatPage` using the controller and reusable components.
- [ ] Step 6: Re-run the component and page tests until green.

### Task 5: Export, document, and verify the package

**Files:**
- Modify: `packages/pc-react/intelligence/sdkwork-chat-pc-react/README.md`
- Modify: `docs/superpowers/specs/2026-04-04-sdkwork-appbase-chat-pc-react-workspace-design.md`
- Modify: `docs/superpowers/plans/2026-04-04-sdkwork-appbase-chat-pc-react-workspace.md`

- [ ] Step 1: Update the README to document the new service/controller/page/component exports and ownership boundary.
- [ ] Step 2: Run `pnpm --dir packages/pc-react/intelligence/sdkwork-chat-pc-react exec tsc --noEmit`.
- [ ] Step 3: Run `pnpm test -- packages/pc-react/intelligence/sdkwork-chat-pc-react/tests`.
- [ ] Step 4: Run `pnpm test -- packages/pc-react/intelligence`.
- [ ] Step 5: Run `pnpm run review:structure`.
- [ ] Step 6: Reflect any verification-driven adjustments back into the spec and plan docs.
