# SDKWORK Chat Workspace PC React Design

## Why this package is next

`sdkwork-appbase` already has reusable UI-capable packages in `foundation`, `identity`, `commerce`, `content`, `device`, and `ecosystem`.
The biggest remaining gap in the AI-era package tree is `intelligence`: `@sdkwork/chat-pc-react` currently exposes only headless chat contracts and route intents, which is useful for modeling but not sufficient for assembling a real assistant desktop.

The `assistant-desktop` preset already treats the intelligence domain as a first-class application capability.
Without a routeable chat workspace package, every new assistant app would still need to rebuild:

- chat session loading and safe empty state behavior
- model selection and execution-readiness framing
- left-rail session navigation
- transcript rendering
- attachment-aware composer gating
- optimistic assistant reply handling
- Claw-style workspace presentation

That duplication breaks the core goal of `sdkwork-appbase`.

## Reference inputs

This extraction should be informed by:

- `claw-studio/packages/sdkwork-claw-chat`
- `sdkwork-chat-pc-react`
- existing `sdkwork-appbase` UI-capable packages such as:
  - `@sdkwork/generation-pc-react`
  - `@sdkwork/subscription-pc-react`
  - `@sdkwork/auth-pc-react`
  - `@sdkwork/shell-pc-react`

The package should follow the Claw desktop language:

- dense but premium workspace composition
- strong left-rail + main-pane rhythm
- dark editorial hero or shell accenting where it helps orientation
- soft zinc surfaces and elevated panels from `sdkwork-ui`
- explicit operational feedback instead of hidden state

## Goal

Build `@sdkwork/chat-pc-react` into a reusable PC React chat workspace package that sits above the existing headless chat contract layer and below product-specific transport/runtime adapters.

The result must be usable as a drop-in intelligence module for:

- assistant desktops
- model playground apps
- operator copilots
- knowledge workbenches
- hybrid AI + workflow desktop shells

## Ownership boundary

`@sdkwork/chat-pc-react` owns:

- reusable chat workspace data shape
- safe fallback session list and example transcript
- composition over runtime session state from `@sdkwork/core-pc-react`
- composition over `@sdkwork/models-pc-react` and `@sdkwork/llm-pc-react`
- model-aware chat workspace service
- chat workspace controller
- reusable session rail, transcript, composer, and workspace summary UI
- routeable `ChatPage`

`@sdkwork/chat-pc-react` does not own:

- real backend chat transport
- streaming websocket or SSE clients
- product-local persistence stores
- gateway-specific run history hydration
- MCP, tools, agent orchestration, or memory execution logic above generic chat

## Package architecture

The package will follow the proven appbase package shape:

1. `chat.ts`
   Extends the existing headless contracts with workspace data, digest, helper factories, and safe example data.
2. `chat-service.ts`
   Composes runtime session posture with optional model catalog and provider-route inputs.
   Exposes safe defaults so the workspace still renders when no backend integration is attached.
3. `chat-controller.ts`
   Owns workspace bootstrap, search, active session selection, composer draft state, active model, send flow, optimistic assistant message lifecycle, and refresh behavior.
4. `components/*`
   Reusable Claw-style surfaces for session rail, execution summary, transcript, and composer.
5. `pages/ChatPage.tsx`
   Routeable page that assembles the workspace into a premium assistant desktop surface.
6. `index.ts`
   Exports headless contracts plus the new workspace layer.

## Workspace data model

The service should normalize one reusable workspace payload:

- `isAuthenticated`
- `sessions`
- `activeSessionId`
- `availableModels`
- `activeModelId`
- `availableRoutes`
- `executionDigest`

The execution digest should summarize:

- selected model name
- selected provider route label
- whether execution is ready
- degraded state
- current blockers and warnings
- session count and total message count

This allows apps to reuse the same shell for direct LLM chat, local assistant routing, or workspace copilots.

## Service behavior

The service should support optional runtime hooks:

- `getSessionTokens`
- `listSessions`
- `listModels`
- `listRoutes`

If hooks are not supplied:

- session auth still derives from `readPcReactRuntimeSession()`
- workspace falls back to deterministic example sessions
- model catalog falls back to a curated built-in set
- route catalog falls back to a healthy local-default route

The service should precompute:

- session digests
- selected model object
- selected route candidate
- execution readiness from `evaluateChatExecutionReadiness`

## Controller behavior

The controller should manage:

- bootstrap and refresh
- session search query
- active session id
- draft text
- draft attachments
- active model id
- send state

On send:

1. validate composer and execution readiness
2. append a completed user message
3. append an optimistic assistant message
4. finalize the assistant message from a synthesized LLM stream summary
5. clear the draft
6. keep the selected model on the session

This preserves the reusable assistant interaction loop without pretending to own live transport.

## UI composition

The page should include:

- a compact Claw-style workspace hero with execution posture
- a left rail for sessions and session search
- a main transcript surface with clear user/assistant separation
- a composer panel with model selection, draft textarea, attachment count, and send CTA
- an execution summary strip or side card with readiness, route, and warning signals

The UI must use `sdkwork-ui` primitives and appbase package patterns rather than cloning Claw internals directly.

## Testing scope

Tests should cover:

- workspace creation defaults and digest calculation
- service fallback composition and runtime-aware authentication posture
- controller bootstrap, search, model selection, draft mutation, and send flow
- session rail rendering and filtering
- transcript rendering
- composer disabled/enabled states
- page bootstrap and integrated rendering

## Deliverable

After this lands, `@sdkwork/chat-pc-react` will become the first fully reusable intelligence workspace in `sdkwork-appbase`, establishing the pattern that `im`, `rtc`, `agent`, and `workflow` can follow next.
