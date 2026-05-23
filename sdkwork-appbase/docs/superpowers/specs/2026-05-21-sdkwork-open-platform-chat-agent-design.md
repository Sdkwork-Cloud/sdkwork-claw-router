# SDKWork Open Platform Chat Agent Design

## Goal

Build a standard SDKWork appbase system for open platform accounts, public-account and mini-app entry points, webhook deliveries, menus, notices, payment bindings, and channel delivery into the existing chat and agent model.

This is a new-application standard. It does not preserve legacy `wechat.*` config shapes, `wechatAccountKey`, `support_sessions`, `support_messages`, or flattened `conversationMessages` SDK resources.

## Core Decision

`conversation` is the canonical chat unit.

Do not use `thread` for product chat APIs. Do not use `conversion`; that word means business conversion, not conversation.

The platform boundary is:

- `conversation` owns `Conversation`, `ConversationTurn`, `ConversationItem`, `ConversationMessage`, participants, handoff, and external-message references.
- `agent` owns agent definitions, versions, runs, steps, tools, memory, metering, and runtime output.
- `platform` owns the provider-neutral open platform API: provider manifests, accounts, entries, hooks, deliveries, events, platform windows, outbox records, menus, notices, payment bindings, SDK ports, and provider adapters.
- `commerce` owns payment providers, merchant accounts, payment channels, payment intents, refunds, payment webhook events, and reconciliation.

## Appbase Packages

Create the common appbase packages first:

- `@sdkwork/conversation`
- `@sdkwork/platform`
- `@sdkwork/platform-service`
- `@sdkwork/platform-runtime`

PC packages are consumers:

- `@sdkwork/chat-pc-react` uses the common conversation module for its AI chat UI surface.
- `@sdkwork/agent-pc-react` uses common agent contracts/runtime.
- `@sdkwork/platform-admin-pc-react` provides the management UI over generated backend SDK methods.

## Conversation Standard

`Conversation` is the user-visible conversation. It can be listed, renamed, archived, deleted, bound to an agent run, and linked to external channel identity.

`ConversationTurn` is one user-intent interaction inside a conversation.

`ConversationItem` is the ordered timeline item. It can represent a message, tool call, tool result, reasoning summary, command, file edit, agent event, result, or system event.

`ConversationMessage` is the normalized message view for UI, official-account messages, customer-service replies, agent output, and channel integration.

Open platform messages must enter the chat system as normal chat data:

```text
PlatformDelivery -> PlatformEvent -> Conversation -> ConversationTurn -> ConversationMessage
```

Open platform must not introduce a parallel support session/message model. Customer-service replies are `ConversationMessage(role=support, source=customer_service, channel=customer_service)`.

## Open Platform Standard

The HTTP namespace is `open_platform` because `API_SPEC.md` requires static path segments to use lowercase `lower_snake_case`.

The package namespace is the business module:

```text
@sdkwork/platform
```

The TypeScript model prefix remains concise:

```text
PlatformAccount
PlatformEntry
PlatformHook
PlatformDelivery
PlatformEvent
PlatformWindow
PlatformOutbox
PlatformMenu
PlatformNotice
PlatformPayBinding
```

Provider-specific behavior lives in provider manifests and adapters, not in core model fields.

## Provider Manifest

Each provider/type pair must publish a versioned manifest:

```ts
interface PlatformProviderManifest {
  key: string;
  provider: PlatformProvider;
  type: PlatformAccountType;
  version: string;
  caps: PlatformCap[];
  secrets: PlatformSecretSlot[];
  entries: PlatformEntryType[];
  hooks: PlatformHookMode[];
  events: string[];
  replies: PlatformReplySpec;
  windows?: PlatformWindowSpec[];
  menus?: PlatformMenuSpec;
  notices?: PlatformNoticeSpec[];
  pays?: PlatformPaySpec[];
  schema: PlatformConfigSchema;
}
```

Manifest examples:

- `wechat_official` supports hooks, signatures, encryption, menus, notices, inbound messages, passive replies, customer-service replies, chat, login, and pay binding.
- `wechat_mini` supports mini-app entry links, QR entry, subscription notices, login/register entry, and mini-app pay binding.
- `douyin_mini` supports mini-app entry links, cashier or escrow payment binding, subscription notices, login/register entry, and event callbacks.

## Public Account Message Flow

For a WeChat official account:

```text
WeChat POST XML
-> PlatformDelivery raw save
-> signature verification before parse
-> decrypt when manifest requires encrypted mode
-> adapter normalizes to PlatformEvent
-> PlatformWindow refreshes customer-service window
-> Conversation resolve/create by external identity
-> ConversationMessage(role=user, source=open_platform, channel=official_account)
-> ConversationTurn create
-> AgentRun create through chat/agent port
-> ConversationMessage(role=assistant, source=agent, channel=official_account)
-> ReplyOrchestrator selects outbox mode
```

Reply modes:

- `passive`: reply inside the provider passive window, for WeChat official accounts rendered as XML.
- `customer`: send through provider customer-service message API after fast ACK.
- `notice`: send template or subscription notices.

The passive reply window is provider-defined. The runtime must not wait until the last millisecond. A WeChat official manifest may define:

```text
passiveDeadlineMs = 5000
passiveSafetyMs = 700
```

If the agent result is not ready before the safety deadline, webhook handling returns provider success and dispatches the final chat message through customer-service outbox when the platform window is still open.

## Platform Window

`PlatformWindow` models external platform delivery constraints. It is not a chat conversation.

For a WeChat official account, the customer-service window is a `PlatformWindow` with `type = customer`. It answers whether an existing `ChatMessage` can be delivered through customer-service messaging.

## Platform Outbox

`PlatformOutbox` is the external delivery record for a `ChatMessage` or notice.

It stores:

- account and channel
- conversation id
- message id when the source is a conversation message
- recipient external user id
- mode: `passive`, `customer`, or `notice`
- reply type and provider payload
- status, provider error, and retry count

`PlatformOutbox` is not a message table. The content remains in chat or notice records.

## QR Login And Register

QR login/register is coordinated by `@sdkwork/platform`, while IAM owns
credential validation and token issuing.

The platform module owns:

- `open_platform_qr_auth_session`
- `open_platform_qr_auth_scan`
- `open_platform_qr_auth_event`
- `open_platform_qr_auth_log`

The session stores the purpose (`login` or `register`), selected default
platform account and entry, QR content, fallback URL, status, and expiry. It
must not store passwords, password hashes, access tokens, or refresh tokens.

QR content selection:

1. If no default official account or mini app is configured, QR content is a
   fallback URL. Any scanner can open it and continue with password login.
2. If a default official account is configured, QR content routes the scanner to
   the official-account entry and webhook flow.
3. If a default mini app is configured, QR content uses the configured mini app
   URL entry and must follow the provider URL format rules.

Frontend state delivery supports polling and event stream:

- `qrAuth.sessions.retrieve` for polling.
- `qrAuth.sessions.events.list` for event-stream style updates.

Webhook completion writes scan/event/log records, links any conversation message
when applicable, then asks IAM to issue the final login/register result.

## Payment Binding

Official accounts and mini apps can bind payment accounts. The open platform module stores only binding and scene mapping:

```ts
interface PlatformPayBinding {
  key: string;
  account: string;
  provider: PlatformProvider;
  paymentAccount: string;
  channel?: string;
  scenes: PlatformPayScene[];
  mode: PlatformPayMode;
  status: PlatformStatus;
  config?: PlatformConfig;
}
```

Payment account, channel, intent, refund, callback, and reconciliation remain in commerce.

## API Standard

Follow `specs/API_SPEC.md`:

- static path segments use `lower_snake_case`
- path params use `lowerCamelCase`
- query params use wire `lower_snake_case`
- JSON fields use `lowerCamelCase`
- operationId uses resource-tree format
- generated SDK public methods follow the operationId tree
- errors use `application/problem+json`
- list responses use `{ items, total, page, pageSize }`
- side-effecting create/update/action endpoints require `Idempotency-Key`

Correct operationIds:

```text
conversations.messages.list
conversations.turns.create
conversations.turns.response.create
accounts.entries.list
accounts.hooks.create
deliveries.replays.create
outbox.attempts.create
menus.publishes.create
accounts.payBindings.create
```

Incorrect operationIds:

```text
conversationMessages.list
conversationTurns.create
accountEntries.list
deliveryReplays.create
```

## Database Contract

Chat:

- `conversation`
- `conversation_turn`
- `conversation_item`
- `conversation_message`
- `conversation_message_part`
- `conversation_external`
- `conversation_message_external`

Open platform:

- `open_platform_provider`
- `open_platform_manifest`
- `open_platform_account`
- `open_platform_entry`
- `open_platform_hook`
- `open_platform_delivery`
- `open_platform_event`
- `open_platform_window`
- `open_platform_outbox`
- `open_platform_outbox_attempt`
- `open_platform_menu`
- `open_platform_menu_publish`
- `open_platform_notice_template`
- `open_platform_notice`
- `open_platform_notice_attempt`
- `open_platform_pay_binding`
- `open_platform_log`

Commerce owns payment tables:

- `commerce_payment_provider`
- `commerce_payment_provider_account`
- `commerce_payment_method`
- `commerce_payment_channel`
- `commerce_payment_intent`
- `commerce_payment_attempt`
- `commerce_payment_webhook_event`

## Runtime Rules

1. Do not accept legacy `wechat.*` fields.
2. Do not use `open-platform` in API paths.
3. Do not create support sessions/messages in open platform.
4. Do not store secret values in account config; store only secret refs.
5. Do not parse webhook payloads before verification.
6. Do not run agent directly from provider adapter.
7. Do not block webhook ACK on long-running agent output.
8. Do not duplicate payment account config in open platform.
9. Do not expose provider error codes as business decisions without normalization.
10. Do not hand-edit generated SDKs.

## First Landing Slice

The first implementation slice is intentionally narrow:

1. Add `@sdkwork/conversation` with conversation route contracts, neutral table contracts, generated SDK method-tree assertions, and official-account/customer-service message rules.
2. Add `@sdkwork/platform` with provider/account/entry/hook/delivery/window/outbox/menu/notice/pay binding route contracts, table contracts, generated SDK method-tree assertions, and explicit conversation boundary rules.
3. Add QR login/register session, scan, event, log, fallback URL, default account, webhook completion, and frontend status contracts inside `@sdkwork/platform`.
4. Update appbase package catalog, tsconfig aliases, and workspace dev dependencies.

Backend schema migrations, generated SDK regeneration, and admin UI come after this appbase contract foundation passes.
