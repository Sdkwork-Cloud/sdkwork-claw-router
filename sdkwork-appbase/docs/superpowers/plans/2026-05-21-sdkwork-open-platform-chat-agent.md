# SDKWork Open Platform Chat Agent Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Land the appbase contract foundation for conversations and the provider-neutral platform module.

**Architecture:** Conversation owns conversations and messages, including public-account messages and customer-service replies. Platform owns provider accounts, open platform API routes, webhook delivery, menu, notice, payment-binding, platform-window, external outbox contracts, and generated SDK ports. Agent and commerce remain independent modules connected through ports.

**Tech Stack:** TypeScript, Vitest, pnpm workspace packages, SDKWork appbase package catalog, API_SPEC resource-tree operationIds.

---

## File Structure

Create:

- `sdkwork-appbase/packages/common/conversation/sdkwork-conversation/package.json`
- `sdkwork-appbase/packages/common/conversation/sdkwork-conversation/tsconfig.json`
- `sdkwork-appbase/packages/common/conversation/sdkwork-conversation/README.md`
- `sdkwork-appbase/packages/common/conversation/sdkwork-conversation/src/index.ts`
- `sdkwork-appbase/packages/common/conversation/sdkwork-conversation/tests/conversation.standard.test.ts`
- `sdkwork-appbase/packages/common/integration/sdkwork-platform/package.json`
- `sdkwork-appbase/packages/common/integration/sdkwork-platform/tsconfig.json`
- `sdkwork-appbase/packages/common/integration/sdkwork-platform/README.md`
- `sdkwork-appbase/packages/common/integration/sdkwork-platform/src/index.ts`
- `sdkwork-appbase/packages/common/integration/sdkwork-platform/tests/platform.standard.test.ts`

Modify:

- `sdkwork-appbase/package.json`
- `sdkwork-appbase/tsconfig.base.json`
- `sdkwork-appbase/scripts/package-catalog.mjs`

## Task 1: Conversation Module

**Files:**

- Create: `sdkwork-appbase/packages/common/conversation/sdkwork-conversation/tests/conversation.standard.test.ts`
- Create: `sdkwork-appbase/packages/common/conversation/sdkwork-conversation/src/index.ts`
- Create: package metadata files in `sdkwork-conversation`

- [ ] **Step 1: Write failing tests**

Assert:

- API prefixes are `/app/v3/api` and `/backend/v3/api`.
- App paths include `/app/v3/api/conversations/{conversationId}/messages`.
- operationIds include `conversations.messages.list`, `conversations.turns.create`, and `conversations.turns.response.create`.
- operationIds do not include `conversationMessages.list` or `conversationTurns.create`.
- static path segments follow API_SPEC lowercase snake case.
- tables include `conversation`, `conversation_turn`, `conversation_message`, `conversation_external`, and `conversation_message_external`.
- official-account messages and customer-service replies both use `conversation_message`.

- [ ] **Step 2: Run RED**

Run:

```powershell
pnpm --dir sdkwork-appbase exec vitest run packages/common/conversation/sdkwork-conversation/tests --config vitest.config.ts --configLoader native --pool vmThreads
```

Expected: FAIL because `../src/index` does not export the module yet.

- [ ] **Step 3: Implement minimal module**

Add types, constants, route flattening, table contracts, capability contracts, SDK method trees, and SDK assertions.

- [ ] **Step 4: Run GREEN**

Run the same Vitest command. Expected: PASS.

## Task 2: Platform Module

**Files:**

- Create: `sdkwork-appbase/packages/common/integration/sdkwork-platform/tests/platform.standard.test.ts`
- Create: `sdkwork-appbase/packages/common/integration/sdkwork-platform/src/index.ts`
- Create: package metadata files in `sdkwork-platform`

- [ ] **Step 1: Write failing tests**

Assert:

- API paths use `/open_platform`, never `/open-platform`.
- operationIds use resource trees such as `accounts.entries.list`, `deliveries.replays.create`, `outbox.attempts.create`, and `accounts.payBindings.create`.
- contracts include account, entry, hook, delivery, event, window, outbox, menu, notice, pay binding, and log tables.
- contracts include QR login/register session, scan, event, and log tables.
- provider manifest includes message, reply, window, menu, notice, and pay capability sections.
- official-account messages and customer-service replies reference `@sdkwork/conversation`.
- generated SDK methods are exposed through `openPlatform`.
- customer-service conversation writes stay in `conversations.messages.create`.
- QR login/register supports fallback URL, default configured official account or mini app entry, webhook completion, password fallback, and frontend polling/event-stream status.
- support sessions/messages are not domain models.

- [ ] **Step 2: Run RED**

Run:

```powershell
pnpm --dir sdkwork-appbase exec vitest run packages/common/integration/sdkwork-platform/tests --config vitest.config.ts --configLoader native --pool vmThreads
```

Expected: FAIL.

- [ ] **Step 3: Implement minimal platform module**

Add types, route contracts, table contracts, provider manifest model, conversation bridge, capability contracts, generated SDK method trees, client assertions, and forbidden-shape checks.

- [ ] **Step 4: Run GREEN**

Run the same command. Expected: PASS.

## Task 5: Workspace Integration

**Files:**

- Modify: `sdkwork-appbase/package.json`
- Modify: `sdkwork-appbase/tsconfig.base.json`
- Modify: `sdkwork-appbase/scripts/package-catalog.mjs`

- [ ] **Step 1: Add package catalog entries**

Add common `conversation` package for conversation and common `integration` package for platform.

- [ ] **Step 2: Add aliases and devDependencies**

Add `@sdkwork/conversation` and `@sdkwork/platform`.

- [ ] **Step 3: Run structure review**

Run:

```powershell
pnpm --dir sdkwork-appbase run review:structure
```

Expected: PASS.

## Task 6: Verification

- [ ] Run package tests:

```powershell
pnpm --dir sdkwork-appbase exec vitest run packages/common/conversation/sdkwork-conversation/tests packages/common/integration/sdkwork-platform/tests --config vitest.config.ts --configLoader native --pool vmThreads
```

- [ ] Run typecheck for new packages:

```powershell
pnpm --dir sdkwork-appbase --filter @sdkwork/conversation typecheck
pnpm --dir sdkwork-appbase --filter @sdkwork/platform typecheck
```

- [ ] Run structure review:

```powershell
pnpm --dir sdkwork-appbase run review:structure
```

## Later Plans

After this contract slice passes:

1. Add `chat-service` and `chat-runtime`.
2. Add `open-platform-service` and `open-platform-runtime`.
3. Standardize schema registry operationId from `conversationMessages.list` to `conversations.messages.list`.
4. Regenerate OpenAPI and SDKs through the contract pipeline.
5. Build `open-platform-admin-pc-react`.
6. Implement backend schema and provider adapters.
