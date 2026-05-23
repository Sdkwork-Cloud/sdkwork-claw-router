# SDKWork SDK Downloader Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Land `sdkwork-sdk-downloader` as the reusable TypeScript/Node orchestration package that loads OpenAPI schemas, computes stable cache keys, invokes `sdkwork-sdk-generator`, packages downloadable artifacts, and manages retention safely for future app integrations.

**Architecture:** Add `sdks/sdkwork-sdk-downloader` as a standalone workspace package and keep generation internals in `sdkwork-sdk-generator`. Implement focused modules for schema loading, schema and request fingerprinting, cache registry persistence, artifact packaging, retention cleanup, generator orchestration, and the final downloader service. Use targeted Node-environment Vitest coverage to drive the implementation end to end.

**Tech Stack:** TypeScript, Node.js, Vitest, `js-yaml`, `@sdkwork/sdk-generator`, workspace root `pnpm` and `tsc`, filesystem APIs, zip packaging library if needed.

---

### Task 1: Wire `sdks` Into The Workspace Toolchain

**Files:**
- Modify: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\pnpm-workspace.yaml`
- Modify: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\tsconfig.json`
- Modify: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\vitest.config.ts`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\sdks\sdkwork-sdk-downloader\package.json`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\sdks\sdkwork-sdk-downloader\README.md`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\sdks\sdkwork-sdk-downloader\tsconfig.json`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\sdks\sdkwork-sdk-downloader\src\index.ts`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\sdks\sdkwork-sdk-downloader\tests\.gitkeep`

- [ ] **Step 1: Add `sdks/*` to the workspace catalog**

Update `pnpm-workspace.yaml` so `sdks/sdkwork-sdk-downloader` becomes a real workspace package.

- [ ] **Step 2: Extend root typecheck coverage to include `sdks/**/*.ts`**

Update `tsconfig.json` include patterns so the new package is checked by root `pnpm typecheck`.

- [ ] **Step 3: Extend root Vitest discovery to include `sdks/**/*.test.ts`**

Update `vitest.config.ts` includes. Keep the package tests in Node environment via per-file `// @vitest-environment node`.

- [ ] **Step 4: Create the downloader package scaffold**

Set package name, local dependency on `../../../sdk/sdkwork-sdk-generator`, and a minimal `src/index.ts` export surface.

- [ ] **Step 5: Run root smoke verification**

Run: `pnpm typecheck`
Expected: PASS, with the new empty package included and no root config regressions.

### Task 2: Build Schema Loading And Stable Fingerprinting With TDD

**Files:**
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\sdks\sdkwork-sdk-downloader\src\types.ts`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\sdks\sdkwork-sdk-downloader\src\schema-source.ts`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\sdks\sdkwork-sdk-downloader\src\schema-fingerprint.ts`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\sdks\sdkwork-sdk-downloader\src\request-fingerprint.ts`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\sdks\sdkwork-sdk-downloader\tests\fixtures\openapi.sample.json`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\sdks\sdkwork-sdk-downloader\tests\fixtures\openapi.sample.yaml`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\sdks\sdkwork-sdk-downloader\tests\schema-source.test.ts`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\sdks\sdkwork-sdk-downloader\tests\schema-fingerprint.test.ts`

- [ ] **Step 1: Write failing schema-source tests first**

Cover:
- local JSON file loading
- local YAML file loading
- raw string loading
- object input loading
- remote URL loading with timeout and max-size enforcement

Example assertion:

```ts
expect(result.schema.openapi).toBe("3.0.3");
expect(result.source.kind).toBe("file");
```

- [ ] **Step 2: Write failing schema and request fingerprint tests**

Cover:
- equivalent JSON and YAML payloads produce the same schema fingerprint
- changing `language` or `packageName` changes the request fingerprint
- changing only retention settings does not change the request fingerprint

Example assertion:

```ts
expect(jsonFingerprint).toBe(yamlFingerprint);
expect(tsRequestFingerprint).not.toBe(javaRequestFingerprint);
```

- [ ] **Step 3: Run the targeted tests and verify RED**

Run: `pnpm test -- sdks/sdkwork-sdk-downloader/tests/schema-source.test.ts sdks/sdkwork-sdk-downloader/tests/schema-fingerprint.test.ts`
Expected: FAIL because the new modules and exports do not exist yet.

- [ ] **Step 4: Implement the minimal schema source and fingerprint modules**

Implement:
- source normalization for `file`, `url`, `raw`, and `object`
- JSON and YAML parsing
- stable object canonicalization
- SHA-256 schema fingerprint
- request fingerprint composition that ignores non-output-affecting policy fields

- [ ] **Step 5: Re-run the targeted tests and verify GREEN**

Run: `pnpm test -- sdks/sdkwork-sdk-downloader/tests/schema-source.test.ts sdks/sdkwork-sdk-downloader/tests/schema-fingerprint.test.ts`
Expected: PASS.

### Task 3: Add Cache Registry And Cache Health Evaluation With TDD

**Files:**
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\sdks\sdkwork-sdk-downloader\src\cache-registry.ts`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\sdks\sdkwork-sdk-downloader\src\cache-health.ts`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\sdks\sdkwork-sdk-downloader\tests\cache-registry.test.ts`

- [ ] **Step 1: Write failing cache-registry tests**

Cover:
- registry bootstrap in an empty directory
- atomic persistence and readback
- lookup by request fingerprint
- access time update after a hit
- unhealthy entry rejection when workspace or archive is missing

Example assertion:

```ts
expect(snapshot.entriesByRequestFingerprint["abc"]?.archivePath).toContain("downloads");
expect(hit?.health.status).toBe("healthy");
```

- [ ] **Step 2: Run the targeted test and verify RED**

Run: `pnpm test -- sdks/sdkwork-sdk-downloader/tests/cache-registry.test.ts`
Expected: FAIL because registry and health helpers do not exist yet.

- [ ] **Step 3: Implement the registry and health modules**

Implement:
- registry schema versioning
- atomic write-through via temp file plus rename
- readback parsing
- request-fingerprint lookup
- health evaluation that rejects missing paths and degraded or invalid generator control-plane states

- [ ] **Step 4: Re-run the targeted test and verify GREEN**

Run: `pnpm test -- sdks/sdkwork-sdk-downloader/tests/cache-registry.test.ts`
Expected: PASS.

### Task 4: Add Zip Packaging And Retention Management With TDD

**Files:**
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\sdks\sdkwork-sdk-downloader\src\artifact-packager.ts`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\sdks\sdkwork-sdk-downloader\src\retention-manager.ts`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\sdks\sdkwork-sdk-downloader\tests\artifact-packager.test.ts`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\sdks\sdkwork-sdk-downloader\tests\retention-manager.test.ts`

- [ ] **Step 1: Write failing artifact-packager tests**

Cover:
- first `zip` archive creation from a workspace directory
- archive reuse when workspace content is unchanged
- archive regeneration when workspace content changes
- temp and lock files excluded from the archive

- [ ] **Step 2: Write failing retention-manager tests**

Cover:
- TTL expiration
- per-schema version cap
- max-total-size eviction
- locked entry preservation
- broken entry eviction before healthy entries

- [ ] **Step 3: Run the targeted tests and verify RED**

Run: `pnpm test -- sdks/sdkwork-sdk-downloader/tests/artifact-packager.test.ts sdks/sdkwork-sdk-downloader/tests/retention-manager.test.ts`
Expected: FAIL because the modules do not exist yet.

- [ ] **Step 4: Implement packaging and retention**

Implement:
- default `zip` archive packaging
- workspace content hash or equivalent reuse check
- retention ordering for broken, expired, over-cap, then global LRU
- size accounting and deletion helpers

- [ ] **Step 5: Re-run the targeted tests and verify GREEN**

Run: `pnpm test -- sdks/sdkwork-sdk-downloader/tests/artifact-packager.test.ts sdks/sdkwork-sdk-downloader/tests/retention-manager.test.ts`
Expected: PASS.

### Task 5: Add Generator Orchestration And Service Composition With TDD

**Files:**
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\sdks\sdkwork-sdk-downloader\src\generator-client.ts`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\sdks\sdkwork-sdk-downloader\src\generation-orchestrator.ts`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\sdks\sdkwork-sdk-downloader\src\sdk-downloader-service.ts`
- Modify: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\sdks\sdkwork-sdk-downloader\src\index.ts`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\sdks\sdkwork-sdk-downloader\tests\generation-orchestrator.test.ts`
- Create: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\sdks\sdkwork-sdk-downloader\tests\sdk-downloader-service.test.ts`

- [ ] **Step 1: Write failing orchestrator tests**

Cover:
- cache miss triggers generator call
- healthy cache hit skips generator call
- duplicate concurrent requests share one in-flight generation
- degraded control-plane state forces regeneration

Example assertion:

```ts
expect(generateSdkProject).toHaveBeenCalledTimes(1);
expect(result.cacheStatus).toBe("hit");
```

- [ ] **Step 2: Write failing service tests**

Cover:
- `prepareSdkArtifact`
- `resolveCachedArtifact`
- `inspectCacheEntry`
- `pruneCache`
- `getHealthReport`

- [ ] **Step 3: Run the targeted tests and verify RED**

Run: `pnpm test -- sdks/sdkwork-sdk-downloader/tests/generation-orchestrator.test.ts sdks/sdkwork-sdk-downloader/tests/sdk-downloader-service.test.ts`
Expected: FAIL because orchestration and service modules do not exist yet.

- [ ] **Step 4: Implement the generator adapter, orchestrator, and public service**

Implement:
- adapter around `generateSdkProject` and `readGenerateControlPlaneSnapshot`
- in-process single-flight map keyed by request fingerprint
- downloader root path policy
- cache lookup, generation, packaging, registry persistence, and incremental retention cleanup
- public service methods and exported types

- [ ] **Step 5: Re-run the targeted tests and verify GREEN**

Run: `pnpm test -- sdks/sdkwork-sdk-downloader/tests/generation-orchestrator.test.ts sdks/sdkwork-sdk-downloader/tests/sdk-downloader-service.test.ts`
Expected: PASS.

### Task 6: Finalize Documentation And Export Surface

**Files:**
- Modify: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\sdks\sdkwork-sdk-downloader\README.md`
- Modify: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\sdks\sdkwork-sdk-downloader\package.json`
- Modify: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\sdks\sdkwork-sdk-downloader\src\index.ts`

- [ ] **Step 1: Document the package contract**

Describe:
- supported schema inputs
- cache and retention behavior
- primary service methods
- default `zip` artifact output

- [ ] **Step 2: Freeze the public export surface**

Export only stable service factories, request and result types, and cache health types.

- [ ] **Step 3: Run a package import smoke test**

Run: `pnpm test -- sdks/sdkwork-sdk-downloader/tests/schema-source.test.ts sdks/sdkwork-sdk-downloader/tests/sdk-downloader-service.test.ts`
Expected: PASS with imports flowing through the package root.

### Task 7: Verify The Whole Workspace

**Files:**
- Modify: `D:\javasource\spring-ai-plus\spring-ai-plus-business\apps\sdkwork-appbase\pnpm-lock.yaml` if dependency installation changes it

- [ ] **Step 1: Install or refresh dependencies if the new package requires them**

Run: `pnpm install`
Expected: PASS and lockfile updated only if new dependencies were introduced.

- [ ] **Step 2: Run the downloader-focused test suite**

Run: `pnpm test -- sdks/sdkwork-sdk-downloader/tests/schema-source.test.ts sdks/sdkwork-sdk-downloader/tests/schema-fingerprint.test.ts sdks/sdkwork-sdk-downloader/tests/cache-registry.test.ts sdks/sdkwork-sdk-downloader/tests/artifact-packager.test.ts sdks/sdkwork-sdk-downloader/tests/retention-manager.test.ts sdks/sdkwork-sdk-downloader/tests/generation-orchestrator.test.ts sdks/sdkwork-sdk-downloader/tests/sdk-downloader-service.test.ts`
Expected: PASS.

- [ ] **Step 3: Run workspace typecheck**

Run: `pnpm typecheck`
Expected: PASS.

- [ ] **Step 4: Run full workspace tests**

Run: `pnpm test`
Expected: PASS.

- [ ] **Step 5: Review git diff for accidental cache or artifact output leakage**

Confirm no generated runtime cache directories, lock files, or archives are tracked.

## Execution Note

The user explicitly asked for autonomous execution without pauses in this session, so this plan should be executed inline rather than waiting for a separate handoff decision.
