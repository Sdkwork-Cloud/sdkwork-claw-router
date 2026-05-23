# SDKWork SDK Downloader Design

## Context

`sdkwork-appbase` now contains an early `sdks/sdkwork-sdk-downloader/` area, but it is still only a placeholder. The real generation capability already exists in the sibling repository package [sdkwork-sdk-generator](D:/javasource/spring-ai-plus/spring-ai-plus-business/sdk/sdkwork-sdk-generator), which provides:

- programmatic generation entrypoints through [src/cli-runner.ts](D:/javasource/spring-ai-plus/spring-ai-plus-business/sdk/sdkwork-sdk-generator/src/cli-runner.ts)
- schema loading through [src/framework/spec-loader.ts](D:/javasource/spring-ai-plus/spring-ai-plus-business/sdk/sdkwork-sdk-generator/src/framework/spec-loader.ts)
- SDK version resolution through [src/framework/versioning.ts](D:/javasource/spring-ai-plus/spring-ai-plus-business/sdk/sdkwork-sdk-generator/src/framework/versioning.ts)
- safe output synchronization and change fingerprinting through [src/framework/output-sync.ts](D:/javasource/spring-ai-plus/spring-ai-plus-business/sdk/sdkwork-sdk-generator/src/framework/output-sync.ts)
- persisted control-plane inspection through [src/node/control-plane.ts](D:/javasource/spring-ai-plus/spring-ai-plus-business/sdk/sdkwork-sdk-generator/src/node/control-plane.ts)

The missing layer is not another generator. The missing layer is the reusable application-side orchestration service that other apps can call to:

- load OpenAPI schemas from local files, URLs, or in-memory input
- normalize equivalent JSON and YAML schemas
- reuse cached generation results when schema and request inputs are unchanged
- avoid duplicate concurrent generation
- package generated workspaces into download artifacts
- manage cache retention so old versions do not fill the disk
- expose a clean service contract for future Java, Rust, and other consumers

## Goal

Create a reusable TypeScript/Node orchestration package under `sdks/sdkwork-sdk-downloader` that standardizes:

- schema loading from file, URL, string, or object input
- stable schema fingerprinting across JSON and YAML source forms
- request-aware caching on top of `sdkwork-sdk-generator`
- generation orchestration for supported languages
- artifact packaging for download
- cache indexing, lookup, inspection, and cleanup
- service methods that other applications can integrate directly

This first phase should establish the single source of truth for generation orchestration. Language-specific folders such as `sdkwork-sdk-downloader-java` and `sdkwork-sdk-downloader-rust` should remain future consumers or wrappers around the same contract, not independent reimplementations of generation and cache logic.

## Source Of Truth

This package should align to these local references:

- [sdkwork-sdk-generator/src/cli-runner.ts](D:/javasource/spring-ai-plus/spring-ai-plus-business/sdk/sdkwork-sdk-generator/src/cli-runner.ts) for the version-resolve plus generate plus sync pipeline
- [sdkwork-sdk-generator/src/framework/spec-loader.ts](D:/javasource/spring-ai-plus/spring-ai-plus-business/sdk/sdkwork-sdk-generator/src/framework/spec-loader.ts) for accepted schema source modes
- [sdkwork-sdk-generator/src/framework/versioning.ts](D:/javasource/spring-ai-plus/spring-ai-plus-business/sdk/sdkwork-sdk-generator/src/framework/versioning.ts) for SDK version policy
- [sdkwork-sdk-generator/src/framework/output-sync.ts](D:/javasource/spring-ai-plus/spring-ai-plus-business/sdk/sdkwork-sdk-generator/src/framework/output-sync.ts) for protected output roots, change fingerprints, and safe file persistence
- [sdkwork-sdk-generator/src/node/control-plane.ts](D:/javasource/spring-ai-plus/spring-ai-plus-business/sdk/sdkwork-sdk-generator/src/node/control-plane.ts) for persisted health inspection
- existing appbase service style such as [generation-service.ts](D:/javasource/spring-ai-plus/spring-ai-plus-business/apps/sdkwork-appbase/packages/pc-react/content/sdkwork-generation-pc-react/src/generation-service.ts) for clean factory-based service boundaries

The downloader should reuse these generator contracts instead of recreating spec parsing, output synchronization, versioning, or control-plane logic locally.

## Problem Statement

Without a dedicated orchestration layer, every application that wants downloadable SDK generation will have to reimplement:

- schema source parsing and validation
- JSON versus YAML equivalence handling
- cache keys and cache lookup rules
- locking and duplicate generation avoidance
- artifact packaging and download path resolution
- disk cleanup and retention policy
- health inspection around partially written outputs

That creates several real risks:

- identical schemas can be regenerated repeatedly because the cache key is unstable
- equivalent JSON and YAML schemas can miss the cache because raw source text differs
- concurrent requests can trigger duplicated generation or corrupt outputs
- repeated generation can leave too many versions on disk and exhaust storage
- remote schema loading can become a security problem if host and response limits are not enforced
- downstream apps will integrate different contracts and become hard to maintain

## Approaches Considered

### Option A: Thin download wrapper over the generator

Pros:

- fastest possible implementation
- low initial code volume

Cons:

- cache logic stays ad hoc
- version retention and disk cleanup become scattered utility code
- future language consumers still need their own orchestration layer
- security and concurrency rules are too easy to miss

### Option B: Dedicated orchestration service on top of the generator

Pros:

- keeps generator as the generation source of truth
- centralizes schema normalization, caching, packaging, locking, and retention
- gives other apps one reusable service API
- makes future Java and Rust consumers wrappers over the same control plane

Cons:

- more code than a thin wrapper
- requires explicit cache and artifact metadata design

### Option C: Separate downloader implementation per language consumer

Pros:

- each consumer can feel native to its language

Cons:

- duplicated cache and storage rules
- inconsistent behavior across languages
- much higher maintenance cost
- easiest path to version sprawl and storage leaks

### Recommendation

Choose Option B.

The architecture is strongest when `sdkwork-sdk-generator` remains the single source of truth for generation, while `sdkwork-sdk-downloader` becomes the single source of truth for application-side orchestration, caching, packaging, and retention.

## Package Boundary

The first phase of `sdkwork-sdk-downloader` owns:

- schema input normalization and source metadata
- stable schema fingerprinting
- request fingerprinting
- cache registry persistence and lookup
- workspace generation orchestration
- packaging generated workspaces into downloadable archives
- lock management for duplicate-request collapse
- retention and cleanup policy
- control-plane based health inspection for cached outputs
- public service contracts for integration

The first phase does not own:

- language-specific SDK code generation internals
- SDK version increment rules independent from the generator
- custom per-language downloader business logic
- separate Java or Rust generation implementations

Those stay in `sdkwork-sdk-generator` or in future thin consumer wrappers.

## Architecture

The package should be decomposed into focused modules instead of a single service file.

### `schema-source`

Owns:

- loading schema input from file path, URL, raw string, or object
- preserving source metadata such as input kind, resolved path, URL, and content type
- returning both parsed object and canonical raw content when available

### `schema-fingerprint`

Owns:

- stable canonicalization of parsed OpenAPI objects
- SHA-256 schema fingerprint generation
- normalization so equivalent JSON and YAML content produce the same fingerprint

### `request-fingerprint`

Owns:

- combining schema fingerprint with generation-affecting options
- ensuring cache keys change when output-affecting inputs change

The request fingerprint must include:

- schema fingerprint
- language
- sdk type
- SDK name
- package name
- namespace
- common package override
- base URL
- API prefix
- generator identity
- any other stable option that changes generated output

### `cache-registry`

Owns:

- persisted metadata for cached workspaces and download archives
- lookup by request fingerprint
- tracking size, timestamps, health, and resolved paths
- atomic registry writes

### `generation-orchestrator`

Owns:

- single-flight generation per request fingerprint
- generator invocation through `generateSdkProject`
- linking cache registry state to real output directories
- validating generated control-plane health before serving cache hits

### `artifact-packager`

Owns:

- archive generation from a cached workspace
- idempotent reuse of existing archives when workspace content is unchanged
- archive metadata such as size, hash, and file path

The first phase should emit `zip` archives by default. Additional formats can be added later without changing the cache identity rules for the workspace itself.

### `retention-manager`

Owns:

- TTL expiration
- per-schema version cap
- global size cap
- LRU cleanup order
- removal of broken or incomplete cache entries

### `sdk-downloader-service`

Owns the application-facing API and composes all modules above.

## Core Request Model

The service should accept one normalized request shape with:

- `schema`: file path, URL, raw string, or object input
- `language`
- `sdkType`
- `name`
- `output identity` settings such as `packageName`, `namespace`, `commonPackage`
- generation options such as `baseUrl`, `apiPrefix`, `sdkVersion`, `fixedSdkVersion`, `sdkRoot`, `sdkName`, `npmPackageName`
- cache policy overrides where allowed
- packaging options

The request contract should be explicit about which fields affect generated output and which fields affect only runtime behavior such as retention or timeout.

## Cache And Artifact Model

The downloader should store outputs under its own root, separated from user workspaces.

Recommended structure:

```text
sdkwork-sdk-downloader/
  data/
    artifacts/
      <language>/
        <sdkType>/
          <schemaFingerprint>/
            <requestFingerprint>/
              workspace/
              downloads/
    index/
      cache-registry.json
    locks/
    tmp/
```

Why two fingerprints:

- `schemaFingerprint` groups all outputs generated from the same logical schema
- `requestFingerprint` uniquely identifies one output-affecting generation request

This allows:

- exact cache hits for one request
- retention policies that can prune multiple request variants under the same schema
- future reporting by schema family

Each cache entry should persist:

- schema fingerprint
- request fingerprint
- language
- sdk type
- SDK identity fields
- output workspace path
- archive path
- workspace size
- archive size
- created time
- last access time
- generator version or identity
- last known control-plane evaluation

Entries with missing workspace paths, missing archives, or degraded or invalid generator control-plane state must be treated as unhealthy and should not be returned as valid cache hits.

## Data Flow

Standard request flow:

1. Caller invokes `prepareSdkArtifact(request)`.
2. `schema-source` loads and parses the schema.
3. `schema-fingerprint` computes a stable schema fingerprint.
4. `request-fingerprint` computes a stable request fingerprint.
5. `cache-registry` checks for an existing healthy entry.
6. If a healthy cache hit exists, the service returns artifact metadata immediately.
7. Otherwise `generation-orchestrator` acquires a lock for the request fingerprint.
8. The generator runs through `generateSdkProject`.
9. The workspace is inspected through generator control-plane artifacts.
10. `artifact-packager` creates or reuses the download archive.
11. `cache-registry` persists the entry and updates access timestamps.
12. `retention-manager` runs incrementally after the request or in a follow-up step.

## Version Policy

Two different version layers must remain separate:

### Generated SDK version

This must continue to use `sdkwork-sdk-generator` versioning rules. The downloader should pass through version-related options and capture the resolved version in cache metadata.

### Downloader cache schema version

The downloader must maintain its own internal metadata schema version for registry and cache entry format. This version is for cache compatibility, not for generated SDK semantic versioning.

This separation prevents the downloader from accidentally inventing a second SDK release policy.

## Safety And Security

The downloader must enforce these rules:

- only allow `http` and `https` remote schema URLs
- support optional host allowlists and blocklists for remote fetches
- enforce remote response size limits
- enforce request timeout limits
- reject output paths outside the downloader-owned root
- use absolute path resolution and path-escape checks for all filesystem operations
- avoid packaging lock files, temp files, or unrelated artifacts
- collapse duplicate concurrent generation through lock files or in-process locks
- treat invalid or degraded generator control-plane outputs as cache misses, not valid hits

The package must be defensive around partial writes, stale temp files, and interrupted generation.

## Performance Strategy

The service should optimize for repeated requests:

- same request fingerprint must use single-flight generation
- healthy cache hits should not call the generator again
- existing archives should be reused when the workspace content is unchanged
- registry lookups should stay lightweight
- cleanup should prefer incremental eviction instead of full rescans on every request

The first phase does not need distributed locking. Local-process and local-filesystem safety is enough.

## Retention Strategy

The package must prevent disk growth from becoming unbounded.

Retention should combine three thresholds:

- `ttlMs`
- `maxEntriesPerSchema`
- `maxTotalSizeBytes`

Cleanup order:

1. broken or incomplete entries
2. expired entries
3. old entries beyond the per-schema cap
4. globally least-recently-used entries until size is under the cap

The cleanup logic should always preserve currently locked or actively served entries.

## Public Service API

The public API should stay service-oriented and easy to integrate.

Expected exports:

- `createSdkworkSdkDownloaderService`
- `type SdkworkSdkDownloaderService`
- `type PrepareSdkArtifactRequest`
- `type PrepareSdkArtifactResult`
- `type ResolveCachedArtifactRequest`
- `type SdkCacheEntry`
- `type SdkDownloaderHealthReport`

Core methods:

- `prepareSdkArtifact(request)`
- `resolveCachedArtifact(request)`
- `inspectCacheEntry(requestFingerprint | path)`
- `listCacheEntries(filters?)`
- `pruneCache(policy?)`
- `deleteCacheEntry(requestFingerprint)`
- `getHealthReport()`

`prepareSdkArtifact` should be the primary integration method for other applications.

## Integration Strategy

The package should be implemented as a standalone TypeScript package within `sdks/sdkwork-sdk-downloader`, with its own source, tests, and package metadata.

Future `sdkwork-sdk-downloader-java` and `sdkwork-sdk-downloader-rust` folders should build on the same downloader contract in one of two ways:

- call the Node downloader process or wrapper
- consume the same cache and artifact metadata contract as read-only clients

They should not reimplement schema fingerprinting, cache lookup, or retention rules.

## Testing Strategy

This work should be implemented with TDD across the following layers:

- schema-source tests for file, URL, string, object, JSON, and YAML inputs
- schema-fingerprint tests proving equivalent JSON and YAML produce the same fingerprint
- request-fingerprint tests proving output-affecting options change cache keys
- cache-registry tests for atomic writes, readback, access time updates, and invalid entry handling
- orchestrator tests for cache miss generation, cache hit reuse, and duplicate concurrent request collapse
- packager tests for archive reuse and archive regeneration when workspace changes
- retention tests for TTL, per-schema cap, total size cap, and lock-aware cleanup
- service tests for end-to-end request behavior using stubbed generator calls

Verification should include focused package tests plus workspace-level typecheck and test commands where applicable.

## Acceptance Bar

This phase is complete only when:

- one service call can accept file, URL, JSON, or YAML schema input and return a reusable download artifact result
- identical schema plus identical generation options hit the cache deterministically
- equivalent JSON and YAML schemas share the same schema fingerprint
- generator control-plane health is consulted before serving a cache hit
- duplicate concurrent requests are collapsed into one generation flow
- retention prevents unbounded version growth and disk consumption
- all new behavior is covered by targeted tests

## Approval Note

The user explicitly instructed autonomous iteration and asked me to continue making reasonable implementation decisions without pausing. This design is therefore treated as approved for implementation in this session.
