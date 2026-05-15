# SDKWork API Specification

This document is the canonical API contract standard for SDKWork application
APIs, backend management APIs, OpenAPI documents, and generated SDKs. Product
code must follow this standard before adding compatibility shims.

## Scope

- App API: `/app/v3/api/**`
- Backend management API: `/backend/v3/api/**`
- OpenAI-compatible gateway API: `/v1/**`
- OpenAPI source: `generated/openapi/*.json`
- Contract source: `docs/schema-registry/frontend-field-contracts.yaml`
- Generated SDKs:
  - `@sdkwork/clawrouter-app-sdk`
  - `@sdkwork/clawrouter-backend-sdk`
  - `@sdkwork/clawrouter-open-sdk`

## API Surfaces

| Surface | Prefix | Client | Responsibility |
| --- | --- | --- | --- |
| `app` | `/app/v3/api` | `SdkworkAppClient` | Product, console, public browsing, user session, and user-owned operations. |
| `backend` | `/backend/v3/api` | `SdkworkBackendClient` | Admin and management operations. It must not duplicate app login/session APIs. |
| `openai_v1` | `/v1` | `SdkworkAiClient` | OpenAI-compatible gateway operations. |

The app and backend API versions must move together. Do not introduce
`/app/v4/api` without the corresponding backend version plan and SDK release
plan.

## Naming

Static path segments use lowercase `lower_snake_case`. Query parameter names
are URL wire names: single-word names stay lowercase without underscores, and
multi-word names use `lower_snake_case`.

```text
GET /app/v3/api/router/model_rankings?rank_scope=overall&q=gpt
```

TypeScript SDK parameter names use `lowerCamelCase`.

```ts
client.ai.modelRankings.list({ rankScope: 'overall', searchQuery: 'gpt' });
```

JSON request and response fields use `lowerCamelCase` unless the payload is an
OpenAI-compatible `/v1` pass-through contract.

Forbidden URL query aliases:

| Forbidden | Required |
| --- | --- |
| `search_query` | `q` |
| `keyword` | `q` |
| `search` | `q` |
| `size` | `page_size` |
| `page_no` | `page` |

Search text must be `q` in URL/OpenAPI and may be exposed as `searchQuery` in
generated SDK or service variables. Do not mechanically feed SDK variable names
back into OpenAPI wire names.

## Path Design

Use resource nouns, not UI action phrases.

```text
GET    /app/v3/api/auth/sessions/current
POST   /app/v3/api/auth/sessions
POST   /app/v3/api/auth/sessions/refresh
DELETE /app/v3/api/auth/sessions/current
```

Use path parameters for resource identity and query parameters for filtering,
pagination, sorting, sparse projections, and time ranges.

Path parameter names use `lowerCamelCase` in URL templates and SDK method
parameters.

```text
GET /backend/v3/api/ecosystem/skills/{skillId}
```

```ts
client.ecosystem.skills.retrieve(skillId);
```

## Query Parameters

Common list parameters:

| URL name | SDK name | Type | Rule |
| --- | --- | --- | --- |
| `page` | `page` | integer | 1-based page index. |
| `page_size` | `pageSize` | integer | Bounded by endpoint contract. |
| `q` | `searchQuery` | string | Trimmed search text. |
| `status` | `status` | string | Domain enum when possible. |
| `start_time` | `startTime` | date-time string | Inclusive range start. |
| `end_time` | `endTime` | date-time string | Exclusive or contract-documented range end. |
| `sort` | `sort` | string array | Explicit field and direction tokens. |

Multi-value query filters must be arrays in OpenAPI and SDKs. Use
`style: form` and `explode: false` unless an endpoint explicitly requires
repeated parameters.

```yaml
- name: vendor_codes
  in: query
  schema:
    type: array
    items:
      type: string
  style: form
  explode: false
```

```ts
client.ai.models.list({ vendorCodes: ['openai', 'anthropic'] });
```

This serializes as:

```text
vendor_codes=openai,anthropic
```

Do not join arrays manually in application service code when the generated SDK
can serialize the query parameter.

## OperationId

Every OpenAPI operation must define a stable resource-tree `operationId`.

Format:

```text
<resource>[.<subresource>...].<action>
```

Actions:

| Action | HTTP intent | SDK method |
| --- | --- | --- |
| `list` | collection read | `.list()` |
| `retrieve` | single resource read | `.retrieve()` |
| `create` | collection create | `.create()` |
| `update` | full or partial update | `.update()` |
| `delete` | delete current or identified resource | `.delete()` |
| `enable` | state transition | `.enable()` |
| `disable` | state transition | `.disable()` |
| `publish` | state transition | `.publish()` |
| `offline` | state transition | `.offline()` |
| `refresh` | token/cache/derived data refresh | `.refresh()` |
| `verify` | verification operation | `.verify()` |

Examples:

| OperationId | SDK shape |
| --- | --- |
| `sessions.create` | `client.auth.sessions.create()` |
| `sessions.current.retrieve` | `client.auth.sessions.current.retrieve()` |
| `sessions.current.update` | `client.auth.sessions.current.update()` |
| `sessions.current.delete` | `client.auth.sessions.current.delete()` |
| `sessions.refresh` | `client.auth.sessions.refresh()` |
| `registrations.create` | `client.auth.registrations.create()` |
| `passwordResetRequests.create` | `client.auth.passwordResetRequests.create()` |
| `verificationCodes.verify` | `client.auth.verificationCodes.verify()` |
| `skills.list` | `client.ecosystem.skills.list()` |
| `skills.assets.create` | `client.ecosystem.skills.assets.create()` |

Do not use flat method names such as `createSession`, `fetchModels`,
`enableSkill`, or `getSkills` in generated SDK public APIs when a resource-tree
method can express the operation.

## Auth And Context

SDKWork uses dual-token context for app and backend calls:

- Auth token: `Authorization: Bearer <auth_token>`
- Access token: `Sdkwork-Access-Token: <access_token>`

`auth_token` represents authenticated user/session identity. `access_token`
represents application, tenant, organization, deployment, and access isolation
context. AppContext and ShardingContext must be derived transparently from these
tokens in Java SaaS deployments and Rust standalone deployments.

Tenant and organization isolation must not be supplied by ordinary request body
fields. If a token-bound tenant, organization, user, or app identity is needed,
the handler must read it from the request context.

Backend APIs must not define a separate login/session system. Session,
registration, password reset, verification code, and OAuth session operations
belong to the app API auth domain.

Public read endpoints can allow anonymous access only when the contract declares
that the data is tenant-public or globally public. Mutating operations require
context.

## OpenAPI

OpenAPI documents use OpenAPI 3.x. This project emits OpenAPI `3.1.2` with JSON
Schema 2020-12.

Required top-level fields:

- `openapi`
- `jsonSchemaDialect`
- `info.title`
- `info.version`
- `info.description`
- `servers`
- `paths`
- `components.schemas`

Every operation must define:

- `operationId`
- `tags`
- `summary`
- `description`
- request body schema for body-bearing methods
- explicit success response schema
- `default` error response with `application/problem+json`

Do not use generic success components such as `OperationResponse`, `PageResult`,
or untyped `Record<string, unknown>` DTOs. Use operation-specific request and
response schemas.

## Error Contract

Errors use RFC 7807 compatible `ProblemDetail` payloads and
`application/problem+json`.

Minimum fields:

- `type`
- `title`
- `status`
- `detail`
- `instance`
- `requestId`
- `code`

Validation errors should include a structured field error list. Do not return a
successful HTTP status for a failed business operation.

## Pagination

Collection APIs that can grow must return explicit pagination metadata.

Request:

```text
page=1&page_size=50
```

Response:

```json
{
  "items": [],
  "total": 0,
  "page": 1,
  "pageSize": 50
}
```

Cursor pagination can be used for streaming or append-only feeds, but it must be
documented in the operation schema and not mixed with page pagination on the
same endpoint.

## Idempotency

Create/update/action endpoints that can cause billing, provisioning, publishing,
or external side effects must require:

- `Idempotency-Key`
- optional `X-Request-Id`

Idempotency keys are scoped by tenant, app, user, operation, and request body
hash.

## SDK Generation

Generated SDK output is derived only from the contract chain:

1. `docs/schema-registry/frontend-field-contracts.yaml`
2. `generated/api/api-contract-manifest.json`
3. `generated/openapi/clawrouter-app-openapi.json`
4. `generated/openapi/clawrouter-backend-openapi.json`
5. `sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript`
6. `sdks/clawrouter-backend-sdk/clawrouter-backend-sdk-typescript`

Never hand-edit generated files under `sdks/*/*-typescript/src`. Fix the
contract, manifest generator, OpenAPI generator, or SDK generator input and
regenerate.

Generated SDKs must expose:

- URL/query lower_snake_case only in generated HTTP serialization.
- Public TypeScript params as lowerCamelCase.
- Resource-tree method groups from `operationId`.
- Array query filters as arrays, not pre-joined strings.
- App and backend clients that can be initialized with environment-specific
  base URLs and token managers.

## Verification

Run these gates after contract or SDK changes:

```powershell
python -B -m tools.api_contract_manifest --check
python -B -m tools.clawrouter_openapi_generator --check
python -B -m tools.clawrouter_payload_sdk_audit
python -B -m tools.clawrouter_sdk_guardian
python -B -m tools.clawrouter_skill_guardian
python -B -m tools.schema_quality_gate
pnpm.cmd --dir sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript run build
pnpm.cmd --dir sdks/clawrouter-backend-sdk/clawrouter-backend-sdk-typescript run build
```
