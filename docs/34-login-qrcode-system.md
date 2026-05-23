# Login QRCode System

This document describes the Claw Router login and registration QRCode flow. It is intentionally limited to QR authentication and the open platform account/entry configuration that feeds QR generation.

## Canonical Model

QR login is owned by the provider-neutral `openPlatform.qrAuth.sessions` resource tree. The old IAM QR resources are retired and must not be reintroduced:

- retired paths: `/app/v3/api/auth/qr_login_codes/**`
- retired SDK methods: `loginQrCodes.*`, `loginQrCodeCallbacks.*`
- retired identifiers: `qrKey`, `appKey`, `openidHash`, `unionidHash`

The canonical public identifier is `sessionKey`. URLs carry it as `session_key`; JSON and SDK payloads use `sessionKey`.

Supported QR purposes are `login` and `register`. Both use the same session resource. The password completion endpoint decides whether to run the IAM login or registration flow from the stored session purpose.

## API Contract

App/product APIs:

```text
POST /app/v3/api/open_platform/qr_auth/sessions
GET  /app/v3/api/open_platform/qr_auth/sessions/{sessionKey}
POST /app/v3/api/open_platform/qr_auth/sessions/{sessionKey}/scans
POST /app/v3/api/open_platform/qr_auth/sessions/{sessionKey}/passwords
```

Generated app SDK shape:

```ts
client.openPlatform.qrAuth.sessions.create({ purpose: "login" | "register" })
client.openPlatform.qrAuth.sessions.retrieve(sessionKey)
client.openPlatform.qrAuth.sessions.scans.create(sessionKey, body)
client.openPlatform.qrAuth.sessions.passwords.create(sessionKey, body)
```

Admin/backend open platform configuration APIs:

```text
GET    /backend/v3/api/open_platform/providers
GET    /backend/v3/api/open_platform/manifests
GET    /backend/v3/api/open_platform/accounts
POST   /backend/v3/api/open_platform/accounts
GET    /backend/v3/api/open_platform/accounts/{accountId}
PATCH  /backend/v3/api/open_platform/accounts/{accountId}
DELETE /backend/v3/api/open_platform/accounts/{accountId}
GET    /backend/v3/api/open_platform/accounts/{accountId}/entries
POST   /backend/v3/api/open_platform/accounts/{accountId}/entries
PATCH  /backend/v3/api/open_platform/accounts/{accountId}/entries/{entryId}
DELETE /backend/v3/api/open_platform/accounts/{accountId}/entries/{entryId}
GET    /backend/v3/api/open_platform/accounts/{accountId}/pay_bindings
POST   /backend/v3/api/open_platform/accounts/{accountId}/pay_bindings
DELETE /backend/v3/api/open_platform/accounts/{accountId}/pay_bindings/{bindingId}
```

Generated backend SDK shape is under `client.openPlatform.*`. Admin UI must call it through `@sdkwork/clawrouter-backend-sdk`; app login UI must call QR auth through `@sdkwork/clawrouter-app-sdk`.

All API operation IDs follow `API_SPEC`: dotted lowerCamel resource-tree IDs such as app `qrAuth.sessions.create`, app `qrAuth.sessions.scans.create`, and backend `accounts.entries.create`. The SDK namespace supplies `openPlatform` on the generated client. URL query names use lower snake case; JSON fields use lowerCamelCase.

## Admin Configuration

Open platform configuration is provider-neutral. Accounts describe a configured external platform identity; entries describe a scannable login surface for that account.

Account fields are compact:

- `key`: stable account key.
- `name`: display name.
- `provider`: `wechat`, `alipay`, `douyin`, `baidu`, `kuaishou`, or `feishu`.
- `type`: `official_account`, `mini_app`, `life_account`, or `bot`.
- `appId`: external platform app id when available.
- `secretRef`, `tokenRef`, `aesKeyRef`: secret locators only. Plain secrets are rejected.
- `defaultEntryId`: default entry used by QR login for this account.
- `qrDefault`: marks this account as the QR login default for its tenant and organization.
- `status`: `active` or `inactive`.

Entry fields are compact:

- `key`: stable entry key, for example `login`.
- `type`: `url`, `qr`, or `mini_app_url`.
- `url`: scannable entry URL.
- `status`: `active` or `inactive`.

Multiple official accounts and mini apps can be configured. QR login selects one active `qrDefault` account and its active `defaultEntryId`. Login currently uses the default entry only; user-facing QR generation does not expose account selection.

Payment bindings are managed under the same account because official accounts and mini apps often bind a payment merchant/channel. They are configuration data for payment flows; QR login only stores and returns account/entry identity.

## QR Content Rules

Session creation always creates a fallback URL. The fallback URL is a normal web URL that any scanner can open:

```text
https://<public-origin>/auth/qr/<sessionKey>?session_key=<sessionKey>&purpose=<purpose>&scan_source=browser
```

`<sessionKey>` is percent-encoded in both the path and query. The backend builds `<public-origin>` from `SDKWORK_CLAW_PUBLIC_ORIGIN`, `PORTAL_PUBLIC_ORIGIN`, `X-Forwarded-Host`, or `Host`, in that order. Environment origins must be pure `http` or `https` origins with no path, query, fragment, or userinfo. Header hosts must be authority-safe hostnames, IPv4 addresses, or bracketed IPv6 literals with optional non-zero ports. Unsafe host input falls back to `localhost`.

When no active default open platform entry exists, `qrContent` is:

```json
{
  "mode": "fallback_url",
  "content": "https://.../auth/qr/..."
}
```

When an official account default is configured, the backend returns:

```json
{
  "mode": "official_account_entry",
  "content": "<configured-entry-url>?session_key=...&purpose=...&account_id=...&entry_id=..."
}
```

Official account entries must be `url` or `qr`, must use `https`, must be printable ASCII, and must not contain fragments or userinfo. They should lead the scanner into the official account follow/entry/login scene. Provider webhook adapters or intermediate pages must preserve the appended session context.

When a mini app default is configured, the backend returns:

```json
{
  "mode": "mini_app_url",
  "content": "<provider-mini-app-url>?session_key=...&purpose=...&account_id=...&entry_id=..."
}
```

Mini app entries must use `mini_app_url` and match provider URL rules. Current accepted prefixes include WeChat URL Link/business links, Alipay mini app links, Douyin mini app links, Baidu smart program links, Kuaishou mini app links, and Feishu mini program applinks.

The backend appends only current session context. If the configured URL already contains reserved QR params, they are removed and overwritten:

- `session_key`
- `purpose`
- `account_id`
- `entry_id`
- `scan_source`

Configured non-reserved query params, such as campaign tags, are preserved. Added query keys and values are percent-encoded. If configured content is not scannable or fails runtime validation, the response falls back to `fallback_url` and writes `qr_auth.session.fallback` without logging the unsafe raw URL.

## Scanner Flow

The scanner must record a scan before completing login or registration.

For web fallback:

1. Desktop creates `qrAuth.sessions.create({ purpose })`.
2. Desktop renders the QR image from `qrContent.content` and polls `sessions.retrieve(sessionKey)`.
3. Scanner opens `/auth/qr/{sessionKey}`.
4. Scanner page calls `sessions.scans.create(sessionKey, { scanSource: "browser" })`.
5. Scanner enters password or registration data.
6. Scanner page calls `sessions.passwords.create(sessionKey, body)`.
7. Desktop poll receives `status: "completed"` plus `session`, `token`, and `userInfo`, applies the IAM session, and redirects.

For official account or mini app QR:

1. Desktop creates the QR auth session.
2. The QR content opens the configured official account or mini app entry.
3. The entry page or adapter records the scan with `scanSource` `official_account`, `mini_app`, or `webhook`, and includes `accountId` and `entryId` from the QR URL.
4. If the scanner must use password, route to the standard login/register page with `session_key`, `purpose`, `account_id`, `entry_id`, and `scan_source` preserved.
5. Password completion uses the same `sessions.passwords.create` endpoint.

The scan endpoint validates that supplied `accountId` and `entryId` match the default account and entry stored on the session. Once scanner metadata is recorded, later calls cannot rewrite `scanSource`, `externalUserId`, `ipHash`, or `userAgent` to another identity.

## Password Completion

The password endpoint accepts the same essential IAM credentials as login/registration:

- `username`
- `password`
- optional `confirmPassword`
- optional `email`, `phone`, `channel`, `verificationCode`

For `purpose: "login"`, the endpoint delegates to the existing password login path and issues the same IAM dual-token session payload.

For `purpose: "register"`, the endpoint delegates to the existing registration path. Verification-code requirements stay controlled by IAM registration policy. After success, the QR session becomes completed and desktop polling receives the issued session.

Password completion before a scan is rejected. Completion after terminal states is idempotent only where the stored completed session can be returned safely; otherwise terminal sessions reject mutation.

## Polling And Frontend Receipt

The desktop login page uses polling, not SSE, for the current implementation:

```ts
const created = await client.openPlatform.qrAuth.sessions.create({ purpose });
renderQr(created.qrContent.content);
const status = await client.openPlatform.qrAuth.sessions.retrieve(created.sessionKey);
```

Frontend status mapping:

- backend `pending` -> UI waits for scan.
- backend `scanned` -> UI can show scanned/waiting state.
- backend `completed` -> UI treats this as confirmed, reads `session` or `token`, stores auth context, then redirects.
- backend `expired` -> UI stops polling and asks for a refresh.
- backend `cancelled` -> UI treats it as terminal.

A completed QR response without a session payload is not accepted as a successful desktop login. The frontend attempts session bootstrap and otherwise enters an error state. This prevents a malformed proxy or stale adapter from leaving the desktop in a confirmed-but-unauthenticated state.

## Webhook Boundary

`sdkwork-appbase` defines the fuller platform QR auth standard, including backend management resources for external completion, webhook deliveries, events, and logs. Claw Router currently implements the app-side QR session, scan, password completion, and polling endpoints. It does not yet expose Claw Router backend OpenAPI endpoints for QR webhook delivery management.

When webhook management is added to Claw Router, it must be a thin backend adapter over the same QR session state machine:

- verify provider signatures before accepting the delivery.
- normalize provider user identity to `externalUserId` or a hash; never store raw provider secrets or raw OpenID-style identifiers in security logs.
- record a scan before external completion.
- require `accountId` and `entryId` to match the session default.
- complete through IAM token issuing, not by storing tokens in the webhook layer.
- expose delivery/event/log reads through generated backend SDK methods under `openPlatform.qrAuth.*`.

Until that backend webhook surface is generated and wired, official account and mini app entries should call the app-side scan and password endpoints or route users to the normal web login/register page with the QR context preserved.

## Logs And Security

QR auth writes security events to `iam_security_event`:

- `qr_auth.session.created`
- `qr_auth.session.scanned`
- `qr_auth.session.completed`
- `qr_auth.session.fallback`
- `qr_auth.session.expired`

Security-event detail stores `sessionKeyHash`, not the raw `sessionKey`. Scanner identifiers are recorded as hashes where applicable, for example `externalUserIdHash` and `userAgentHash`. Raw `externalUserId`, raw user agent, raw unsafe configured URLs, and provider secrets are not written to security logs.

Input hardening:

- QR purpose is restricted to `login` or `register`.
- scan source is restricted to `app`, `browser`, `mini_app`, `official_account`, or `webhook`.
- `accountId`, `entryId`, and `externalUserId` are compact provider-neutral identifiers.
- `ipHash` must be a SHA-256 hex hash.
- `userAgent` is printable ASCII and length-limited before it is hashed for logs.
- fallback URL host/origin sources reject path, query, fragment, userinfo, percent-encoded authority tricks, and multi-host forwarded values.

## Implementation Map

Backend QR auth implementation:

- `services/sdkwork-claw-product/src/api/app_auth.rs`
- `services/sdkwork-claw-product/tests/app_auth_api.rs`

Open platform admin store and SQL stores:

- `services/sdkwork-claw-product/src/ports/admin_open_platform_store.rs`
- `services/sdkwork-claw-product/src/infrastructure/sql/sqlite/admin_open_platform_store.rs`
- `services/sdkwork-claw-product/src/infrastructure/sql/postgres/admin_open_platform_store.rs`

Admin UI and SDK boundary:

- `apps/sdkwork-claw-router-portal/src/App.tsx`
- `apps/sdkwork-claw-router-portal/src/AdminLayout.tsx`
- `apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-open-platform/src/openPlatformAdminService.ts`

Auth UI and appbase IAM runtime:

- `sdkwork-appbase/packages/pc-react/iam/sdkwork-auth-pc-react/src/auth-service.ts`
- `sdkwork-appbase/packages/pc-react/iam/sdkwork-auth-pc-react/src/auth-iam-runtime.ts`
- `sdkwork-appbase/packages/pc-react/iam/sdkwork-auth-pc-react/src/pages/AuthPage.tsx`

Contract and generated SDK chain:

- `docs/schema-registry/frontend-field-contracts.yaml`
- `generated/api/api-contract-manifest.json`
- `generated/openapi/clawrouter-app-openapi.json`
- `generated/openapi/clawrouter-backend-openapi.json`
- `sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript`
- `sdks/clawrouter-backend-sdk/clawrouter-backend-sdk-typescript`
