# SDKWORK Appbase Local API Proxy Design

**Date:** 2026-04-18

## Why this package is next

`claw-studio` already contains a substantial local proxy implementation, but it is still product-owned and spread across multiple layers:

- Rust runtime and protocol translation in the desktop host
- route normalization and runtime snapshot materialization
- Tauri command bridging
- TypeScript service composition
- settings and diagnostics UI

That shape is useful for proving the feature, but it is not a clean reusable standard.
If the same capability is extracted later by copying from product code again, every new app will inherit:

- multiple overlapping configuration authorities
- route, runtime, and projection concepts mixed together
- Tauri-specific details leaking into TypeScript services and UI
- local-only persistence assumptions
- endpoint-by-endpoint growth instead of capability-driven growth

`sdkwork-appbase` should own the canonical version of this capability so applications become assembly layers rather than new sources of proxy logic duplication.

## Reference inputs

This design is grounded in the current workspace state on 2026-04-18.

Primary current inputs:

- `apps/claw-studio/packages/sdkwork-claw-desktop/src-tauri/src/framework/services/local_ai_proxy.rs`
- `apps/claw-studio/packages/sdkwork-claw-desktop/src-tauri/src/framework/services/local_ai_proxy_snapshot.rs`
- `apps/claw-studio/packages/sdkwork-claw-desktop/src-tauri/src/framework/services/local_ai_proxy/observability.rs`
- `apps/claw-studio/packages/sdkwork-claw-desktop/src-tauri/src/framework/services/local_ai_proxy_observability.rs`
- `apps/claw-studio/packages/sdkwork-claw-core/src/services/localAiProxyRouteService.ts`
- `apps/claw-studio/packages/sdkwork-claw-settings/src/services/localAiProxyLogsService.ts`
- `apps/claw-studio/packages/sdkwork-claw-desktop/src/desktop/tauriBridge.ts`

Structural reference for the local package:

- capability-oriented route groups
- explicit upstream identity
- request-context-first routing
- usage and observability treated as first-class concerns

The local package must not inherit the wrong parts for this scope:

- multi-tenant product control plane
- pricing and ledger semantics
- release-governance complexity
- product-wide API breadth as an implementation requirement for v1

## Goal

Build one reusable package in `sdkwork-appbase`:

- directory: `packages/pc-react/intelligence/sdkwork-local-api-proxy`
- package name: `@sdkwork/local-api-proxy`

The package must become the canonical local API gateway capability for SDKWORK desktop applications.

It must provide:

- one authoritative configuration model
- one package boundary
- one storage configuration surface
- a clean Rust runtime for local loopback proxying
- Tauri host integration
- TypeScript services and reusable UI surfaces
- a growth path from desktop-local SQLite to server-managed PostgreSQL
- capability-driven API expansion without endpoint-by-endpoint technical debt

## Approved direction

The package is intentionally a **single workspace package**.

It does not split into separate `host`, `runtime`, or `ui` workspace packages.
Instead, it keeps strict internal layering inside one package so the operational and maintenance surface remains small.

The package uses these top-level standards:

- single package: `@sdkwork/local-api-proxy`
- single authority model: `LocalApiProxyConfig`
- single runtime compilation product: `LocalApiProxyRuntimePlan`
- single database configuration surface
- single database file for SQLite and single schema for PostgreSQL
- short table prefix: `lap_`
- capability-first routing and operation registration
- Rust runtime treated as an internal implementation of the package rather than a separate architecture

This package is also a deliberate naming exception inside `sdkwork-appbase`.
Most appbase packages follow the `@sdkwork/<capability>-pc-react` pattern, but this package is a foundational local gateway capability that includes:

- reusable PC React surfaces
- host-facing Tauri integration
- embedded Rust runtime
- server-ready domain and repository contracts

For that reason it remains `@sdkwork/local-api-proxy` and the appbase scaffold and review tooling should explicitly allow this package name and directory as an approved exception rather than treating it as an irregular drift.

## Non-goals

This package does not attempt to become a general-purpose service mesh, API gateway platform, or arbitrary HTTP reverse proxy.

It is specifically responsible for local and service-managed AI/API proxy capabilities needed by SDKWORK applications.

This design does not require v1 implementation of every possible API surface.
The standard must support growth, but v1 implementation may begin with the most important operation families:

- chat
- response
- embedding
- model catalog
- compatibility endpoints for OpenAI, Anthropic, and Gemini consumers

## Package boundary

`@sdkwork/local-api-proxy` owns:

- local API proxy domain types and schema
- route, capability, exposure, and credential models
- runtime plan compilation
- SQLite and PostgreSQL persistence adapters
- request and message observability model
- protocol adapters and canonical request or response translation
- Tauri host bridge contracts and implementation
- reusable PC React services, hooks, pages, and diagnostics UI
- embedded Tauri Rust runtime
- server-ready runtime mode contracts

`@sdkwork/local-api-proxy` does not own:

- product-specific provider-center pages outside package-owned proxy UI
- global product identity, billing, or quota policy
- app shell routing outside the package's exported page surfaces
- product-specific secrets management backends
- external service deployment packaging beyond the runtime standards defined here

## Internal package architecture

The package remains single, but internally layered.

```text
packages/pc-react/intelligence/sdkwork-local-api-proxy/
  README.md
  package.json
  src/
    index.ts
    types/
    components/
    repository/
    services/
    pages/
    domain/
    gateway/
    hooks/
    host/
      tauri/
    presentation/
  native/
    tauri-rust/
      Cargo.toml
      src/
```

Internal responsibilities:

- `types/`
  - public type contracts, schema DTOs, command and event contracts
- `components/`
  - reusable UI building blocks owned by the package
- `domain/`
  - domain models, policies, normalization rules, runtime plan compiler
- `repository/`
  - persistence ports plus SQLite and PostgreSQL adapters
- `services/`
  - TypeScript orchestration services for config, runtime, logs, testing, health
- `pages/`
  - route-level package-owned UI entry surfaces
- `gateway/`
  - operation registry, route groups, request context, protocol adapters, usage, observability
- `hooks/`
  - package-local React hooks
- `host/tauri/`
  - Tauri command catalog, bridge mappers, runtime invocation helpers
- `presentation/`
  - copy, formatting, derived UI view models, and presentation helpers
- `native/tauri-rust/`
  - embedded Rust runtime, commands, storage adapters, protocol translation, observability recording

## Core design principles

### 1. One authoritative configuration model

`LocalApiProxyConfig` is the only long-lived configuration authority.

This package must not create multiple competing authorities such as:

- UI-owned route state
- runtime-owned mutable snapshot state
- host-owned projection state
- consumer-specific managed config files treated as primary source

Those can exist as outputs, caches, or projections, but never as equal configuration sources.

### 2. Runtime plan is a compilation product, not a second config system

`LocalApiProxyRuntimePlan` is generated from `LocalApiProxyConfig`.

It exists to:

- normalize defaults
- select active routes
- pre-resolve capability bindings
- derive runtime-safe credential references
- drive embedded runtime startup

It must not be editable through the UI as if it were another configuration document.

### 3. Capability-first extensibility

The package must scale by adding capabilities and operations, not by creating new hardcoded route types or copy-pasted endpoint handlers.

### 4. One package, strong internal isolation

The package can remain maintainable only if internal boundaries are explicit and stable.
Single package does not mean miscellaneous package.

### 5. Storage simplicity first

The default persistence shape is:

- SQLite: one file
- PostgreSQL: one schema

Logical separation happens in table groups and repository boundaries, not by default physical database fragmentation.

## Domain model

### LocalApiProxyConfig

The root authority object:

- `schemaVersion`
- `mode`
  - `desktop-local`
  - `server-managed`
- `bind`
  - `host`
  - `port`
  - `publicBaseUrl`
- `storage`
  - dialect configuration
- `capture`
  - capture defaults and redaction posture
- `routes`
- `defaults`
  - default route selection rules by capability or protocol
- `policies`
  - reusable request and response policy references
- `runtime`
  - runtime-level tuning such as retry or cleanup posture

### LocalApiProxyRoute

One route describes one upstream connection boundary plus the capability bindings that route exposes.

Fields:

- `id`
- `name`
- `enabled`
- `managedBy`
  - `system`
  - `user`
- `providerId`
- `clientProtocol`
- `upstreamProtocol`
- `upstream`
  - `baseUrl`
  - `credentialRef`
  - `mirrorProtocolIdentity`
- `capabilities`
- `modelBindings`
- `runtimePolicy`
- `exposures`
- `tags`
- `notes`

### LocalApiCapability

The package standardizes capability families instead of treating each vendor endpoint as a new kind of route.

Initial standard capability set:

- `chat`
- `response`
- `embedding`
- `model-catalog`
- `image-generation`
- `image-edit`
- `audio-speech`
- `audio-transcription`
- `audio-translation`
- `file-transfer`
- `batch`
- `moderation`
- `rerank`
- `vector-store`
- `search`
- `custom`

### RouteCapabilityBinding

Each route declares which capabilities it supports and how they should be exposed.

Fields:

- `capability`
- `enabled`
- `operationSet`
- `streaming`
- `timeoutMs`
- `pathOverride`
- `methodOverride`
- `requestPolicyRef`
- `responsePolicyRef`

`operationSet` is the contract that tells the runtime which operations under a capability family are available.
For example, `chat` may expose `openai.v1.chat.completions.create` while `response` may expose `openai.v1.responses.create`.

### LocalApiProxyModelBinding

Model binding is role-based instead of fixed to three hardcoded fields.

Fields:

- `role`
  - `default`
  - `reasoning`
  - `embedding`
  - `vision`
  - `speech`
  - `rerank`
  - `custom`
- `modelId`
- `capability`
- `label`

### LocalApiProxyExposure

The proxy package must treat consumers as first-class explicit exposures.

Initial exposure targets:

- `openclaw`
- `desktop-clients`
- `internal-sdk`
- `custom`

### ProxyUpstreamIdentity

Standard upstream identity shape:

- `providerId`
- `protocolKind`
- `mirrorProtocolIdentity`
- `baseUrl`
- `credentialRef`

This keeps upstream modeling useful without bringing remote tenant or pricing semantics into the local package.

## Gateway runtime model

The runtime is organized around operations, route groups, adapters, and a canonical request context.

### LocalGatewayRequestContext

Every request entering the proxy runtime must be normalized to a standard context:

- `traceId`
- `requestId`
- `routeId`
- `routeName`
- `capability`
- `operationId`
- `consumer`
- `streaming`
- `capturePolicy`
- `startedAtMs`

This replaces ad hoc per-endpoint logging and enables consistent observability.

### GatewayOperation

Every supported proxy action is registered as a `GatewayOperation`.

Fields:

- `id`
- `capability`
- `consumerProtocol`
- `method`
- `pathPattern`
- `streaming`
- `requestNormalizer`
- `responseTranslator`
- `usageExtractor`
- `probeSupport`

The operation registry is the main extensibility surface.
Adding support for more APIs should mean registering more operations and, where necessary, more protocol-adapter handlers.

### Route groups

Operations are grouped by capability family rather than by vendor.

Initial route groups:

- `text-and-chat`
- `compat-and-model`
- `embedding-and-moderation`
- `image-and-audio`
- `files-and-batches`
- `vector-and-search`
- `custom`

### Protocol adapters

The package standardizes protocol adapters for upstream translation:

- `openai-compatible`
- `anthropic`
- `gemini`
- `ollama`
- `azure-openai`
- `openrouter`
- `sdkwork`
- `custom-http`

Each adapter must declare:

- supported capabilities
- supported operations
- streaming support
- model catalog support
- usage extraction support
- health probe support
- canonical request and response translation

## Canonical request and response model

The package must not let UI services or logs depend directly on upstream-native request or response JSON shapes.

The gateway uses canonical envelopes:

- `CanonicalOperationRequest`
- `CanonicalOperationResponse`
- `CanonicalOperationChunk`
- `CanonicalUsage`
- `CanonicalProxyError`

These envelopes are capability-aware.
For example, `chat`, `response`, and `embedding` requests may use different internal payload variants, but they all flow through the same gateway operation lifecycle.

This gives the package a stable extension surface for future APIs without rewriting the outer runtime and UI each time.

## Storage standard

### Storage configuration

The package exposes one storage configuration contract:

```ts
type LocalApiProxyStorageConfig =
  | {
      dialect: 'sqlite';
      sqlitePath: string;
    }
  | {
      dialect: 'postgresql';
      postgresUrl: string;
      schema?: string;
    };
```

Defaults:

- SQLite file path is explicitly configured by the host
- PostgreSQL schema defaults to `local_api_proxy`

### Physical storage topology

The standard default is intentionally simple:

- desktop-local: one SQLite database file named `local-api-proxy.db`
- server-managed: one PostgreSQL database schema named `local_api_proxy`

The package does not default to:

- multiple SQLite files
- multiple PostgreSQL schemas
- database-per-plane layouts

Logical separation remains in repository boundaries and table groups.

### Table naming

All tables use the short prefix `lap_`.

Core tables:

- `lap_schema_migrations`
- `lap_config`
- `lap_routes`
- `lap_route_capabilities`
- `lap_route_models`
- `lap_route_exposures`
- `lap_runtime_settings`
- `lap_probe_records`
- `lap_credentials`
- `lap_request_logs`
- `lap_message_logs`
- `lap_capture_settings`
- `lap_runtime_events`

### Table responsibilities

#### `lap_schema_migrations`

Tracks database schema version history for both SQLite and PostgreSQL adapters.

#### `lap_config`

Stores singleton configuration metadata for the root `LocalApiProxyConfig`.

#### `lap_routes`

Stores route identities and primary transport configuration.

#### `lap_route_capabilities`

Stores capability bindings per route.

#### `lap_route_models`

Stores role-based model bindings.

#### `lap_route_exposures`

Stores which consumers are allowed to use which route.

#### `lap_runtime_settings`

Stores runtime-level cleanup, retry, timeout, and housekeeping settings that are not route-specific.

#### `lap_probe_records`

Stores latest and historical route or operation probe results.

#### `lap_credentials`

Stores redacted credential metadata and references only.
Secrets are never treated as plain durable values inside the main relational store.

#### `lap_request_logs`

Stores request-level observability:

- `request_id`
- `trace_id`
- `route_id`
- `capability`
- `operation_id`
- `consumer`
- `status`
- `streaming`
- `latency_ms`
- `ttft_ms`
- `input_tokens`
- `output_tokens`
- `total_tokens`
- `request_preview`
- `response_preview`
- `error_summary`
- `created_at`

#### `lap_message_logs`

Stores message-level capture records linked to `lap_request_logs`.

#### `lap_capture_settings`

Stores message capture enablement plus redaction and retention posture.

#### `lap_runtime_events`

Stores lifecycle and operational events such as:

- startup
- shutdown
- route reload
- port rebind
- degraded state
- runtime failure

## Cross-dialect data rules

To keep SQLite and PostgreSQL behavior aligned:

- ids use string ULIDs
- timestamps use epoch milliseconds stored as integer or bigint
- booleans use adapter-native boolean representation
- JSON payloads use text in SQLite and JSONB in PostgreSQL
- query contracts are defined in repository ports, not in SQL-specific return shapes

This keeps the upper layers stable across local and server deployments.

## Credential and secret policy

The database stores references, not authoritative plaintext secrets.

Rules:

- route records store `credentialRef`
- secret values are resolved at runtime through host-provided secret providers
- SQLite and PostgreSQL stores persist only redacted metadata or lookup references
- exported config and logs must not leak raw secrets
- probe and diagnostics surfaces must redact sensitive headers and token-like values

Local secret resolution examples:

- protected token file
- keychain-backed reference
- Tauri secret bridge

Server secret resolution examples:

- environment-backed provider
- vault-backed provider
- platform secret manager adapter

## Runtime modes

The same package supports two runtime modes.

### Desktop-local

Primary initial implementation mode.

Characteristics:

- embedded in the desktop runtime
- loopback-only binding by default
- SQLite persistence
- Tauri commands and events
- local diagnostics surfaced through the app UI

### Server-managed

First-class design target even if implementation ships incrementally.

Characteristics:

- standalone service process or service-hosted runtime
- PostgreSQL persistence
- externally managed deployment lifecycle
- same domain model and operation registry
- same table naming and migration rules

The runtime core must be designed so the embedded Tauri mode and the service-managed mode share the same domain, gateway, and repository contracts.
This is a runtime deployment mode of the same package standard, not a separate `sdkwork-appbase` architecture tree.

## Tauri and Rust host standard

The Rust implementation remains internal to the package under `native/tauri-rust`.

It should be split into focused modules:

- `config`
- `repository`
- `gateway/context`
- `gateway/operations`
- `gateway/route_groups`
- `protocol/adapters`
- `runtime/lifecycle`
- `runtime/health`
- `observability`
- `commands`

The desktop host exposes typed commands for:

- loading effective config
- saving config
- validating config
- starting runtime
- stopping runtime
- restarting runtime
- reading runtime status
- probing a route or operation
- listing request logs
- listing message logs
- updating capture settings
- opening diagnostics artifacts when appropriate

Typed events should include:

- runtime state changed
- route probe completed
- config reloaded
- request log appended
- degraded or failed state emitted

## TypeScript service standard

The TypeScript side of the package should expose focused services, not one large god-service.

Recommended service surfaces:

- `createLocalApiProxyConfigService`
- `createLocalApiProxyRuntimeService`
- `createLocalApiProxyObservabilityService`
- `createLocalApiProxyProbeService`
- `createLocalApiProxyHostService`

These services depend on package-internal ports rather than directly on Tauri APIs.
The Tauri bridge exists as one adapter, not as the center of the TypeScript design.

## UI surface standard

The package should export reusable PC React surfaces rather than a monolithic one-off settings screen.

Recommended initial UI exports:

- `LocalApiProxyPage`
- `LocalApiProxyRouteList`
- `LocalApiProxyRouteEditor`
- `LocalApiProxyRuntimeSummary`
- `LocalApiProxyHealthPanel`
- `LocalApiProxyRequestLogExplorer`
- `LocalApiProxyMessageLogExplorer`
- `LocalApiProxyCaptureSettingsPanel`

The package owns the proxy experience.
Applications choose how to route to these surfaces, but they should not reimplement the capability itself.

## Consumer projection rules

The package may project route information to consumers such as bundled OpenClaw or desktop clients.
Those projections are outputs from the package authority model.

Projection rules:

- projections are generated from `LocalApiProxyRuntimePlan`
- projections are idempotent
- projections are consumer-specific
- projections are never treated as independent configuration sources

This avoids the technical debt that comes from multiple mutable configuration authorities.

## Failure handling

The package must degrade safely rather than crash the host application.

Rules:

- config validation failure blocks invalid save, not app boot
- runtime start failure marks the runtime degraded or failed
- UI remains available for recovery and diagnostics
- probe failure records evidence without corrupting route state
- capture and observability failures do not silently disable the whole runtime without an event trail

## Testing scope

The package standard should require tests at these layers:

- domain normalization and runtime-plan compilation
- capability binding validation
- SQLite repository behavior
- PostgreSQL repository behavior
- protocol adapter translation
- gateway operation registration and dispatch
- runtime lifecycle and degraded-state handling
- Tauri bridge contract mapping
- TypeScript services and controllers
- UI rendering and operator actions

## Implementation phases

### Phase 1: package foundation and authority model

Deliver:

- package scaffold
- authoritative config model
- runtime plan compiler
- repository ports
- SQLite implementation
- core route and capability services

### Phase 2: embedded runtime and host bridge

Deliver:

- Rust runtime extraction from `claw-studio`
- Tauri command and event bridge
- runtime lifecycle and health APIs
- request and message observability

### Phase 3: reusable UI and diagnostics

Deliver:

- route list and editor
- runtime summary and probe surfaces
- request and message log explorers
- capture policy management

### Phase 4: PostgreSQL adapter and server-managed posture

Deliver:

- PostgreSQL repository adapter
- migration compatibility between SQLite and PostgreSQL schemas
- server-managed runtime configuration path
- service-mode verification

### Phase 5: capability expansion

Deliver:

- additional operations for images, audio, files, and vector features
- adapter-specific growth without changing the authority model

## Implementation refinements

The package implementation should keep two additional standards explicit:

- the embedded native runtime remains inside the package boundary under `native/tauri-rust` and is treated as package-owned implementation, not a separate workspace package
- the minimal reusable UI surface should ship as package-owned building blocks and page shell exports so product applications remain assembly layers instead of reimplementing route lists or runtime summaries

## Completion criteria

This package is successful when all of the following are true:

- one reusable package in `sdkwork-appbase` owns the entire local API proxy capability
- `claw-studio` can consume the package instead of owning its own local proxy implementation
- the package supports one authoritative config model and one runtime plan compilation path
- the package supports local SQLite and server PostgreSQL through the same repository contracts
- API growth happens by adding capabilities and operations rather than inventing new configuration systems
- observability, probe, and diagnostics remain first-class and uniform across runtime modes
