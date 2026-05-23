# SDKWORK Local API Proxy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `@sdkwork/local-api-proxy` as the canonical single-package local gateway capability for SDKWORK PC React applications, with strong domain contracts, capability-driven routing, dual-dialect storage definitions, host bridge contracts, and reusable diagnostics surfaces.

**Architecture:** Keep the package as one workspace unit under `packages/pc-react/intelligence/sdkwork-local-api-proxy`, but enforce internal isolation through `types`, `domain`, `repository`, `gateway`, `services`, `host`, `components`, `pages`, `hooks`, and `presentation`. Implement the foundation in test-first order: package registration, domain schema and runtime-plan compilation, gateway capability catalogs, storage schema builders for SQLite and PostgreSQL, then host bridge and UI shells.

**Tech Stack:** TypeScript, React 19, Vitest, Testing Library, `@sdkwork/appbase-pc-react`, `@sdkwork/core-pc-react`, `@sdkwork/ui-pc-react`, pnpm workspace scripts, Tauri bridge contracts, Rust runtime scaffolding under `native/tauri-rust`

## Implementation progress note

As of 2026-04-18, Tasks 1 through 7 have been implemented inside `packages/pc-react/intelligence/sdkwork-local-api-proxy`.
Package-level Vitest runs, package `typecheck`, and `review:structure` pass.
Workspace-wide `pnpm test` is currently not a reliable completion gate for this package because unrelated scaffold packages in the same workspace still fail independently of `@sdkwork/local-api-proxy`.

---

### Task 1: Register and scaffold the package

**Files:**
- Modify: `scripts/package-catalog.mjs`
- Create: `packages/pc-react/intelligence/sdkwork-local-api-proxy/README.md`
- Create: `packages/pc-react/intelligence/sdkwork-local-api-proxy/package.json`
- Create: `packages/pc-react/intelligence/sdkwork-local-api-proxy/tsconfig.json`
- Create: `packages/pc-react/intelligence/sdkwork-local-api-proxy/src/index.ts`
- Create: `packages/pc-react/intelligence/sdkwork-local-api-proxy/tests/package.test.ts`

- [ ] Step 1: Add `sdkwork-local-api-proxy` to the `pc-react/intelligence` catalog with a description that matches the approved spec.
- [ ] Step 2: Run `pnpm scaffold:packages` so the package directory, `README.md`, `package.json`, `tsconfig.json`, and `src/index.ts` are generated from the updated catalog.
- [ ] Step 3: Replace the scaffold defaults with package metadata that uses the approved naming exception `@sdkwork/local-api-proxy`.
- [ ] Step 4: Write a failing `package.test.ts` that asserts the package exports `localApiProxyPackageMeta` with architecture `pc-react`, domain `intelligence`, and package name `@sdkwork/local-api-proxy`.
- [ ] Step 5: Run `pnpm test -- packages/pc-react/intelligence/sdkwork-local-api-proxy/tests/package.test.ts` and confirm failure because the export does not exist yet.
- [ ] Step 6: Export `localApiProxyPackageMeta` from `src/index.ts` and re-run `pnpm test -- packages/pc-react/intelligence/sdkwork-local-api-proxy/tests/package.test.ts` until green.
- [ ] Step 7: Run `pnpm run review:structure` and confirm the new package is accepted by structure review.

### Task 2: Lock the authority model and capability contracts

**Files:**
- Create: `packages/pc-react/intelligence/sdkwork-local-api-proxy/src/types/localApiProxyTypes.ts`
- Create: `packages/pc-react/intelligence/sdkwork-local-api-proxy/src/types/localApiProxyHost.ts`
- Create: `packages/pc-react/intelligence/sdkwork-local-api-proxy/src/domain/localApiProxyConfig.ts`
- Create: `packages/pc-react/intelligence/sdkwork-local-api-proxy/tests/localApiProxyConfig.test.ts`

- [ ] Step 1: Write failing tests for `LocalApiProxyConfig`, `LocalApiProxyRoute`, `LocalApiCapability`, `RouteCapabilityBinding`, `LocalApiProxyModelBinding`, and `ProxyUpstreamIdentity`.
- [ ] Step 2: Verify the tests fail with missing export or missing symbol errors.
- [ ] Step 3: Add the public types with exact unions from the spec, including `desktop-local` and `server-managed`, `lap_` table naming, and capability enums such as `chat`, `response`, `embedding`, `image-generation`, and `custom`.
- [ ] Step 4: Implement domain helpers that create a default config and normalize route ids, capability bindings, and exposure targets.
- [ ] Step 5: Re-run `pnpm test -- packages/pc-react/intelligence/sdkwork-local-api-proxy/tests/localApiProxyConfig.test.ts` until green.

### Task 3: Build runtime-plan compilation and gateway operation catalogs

**Files:**
- Create: `packages/pc-react/intelligence/sdkwork-local-api-proxy/src/domain/localApiProxyRuntimePlan.ts`
- Create: `packages/pc-react/intelligence/sdkwork-local-api-proxy/src/gateway/localApiProxyOperations.ts`
- Create: `packages/pc-react/intelligence/sdkwork-local-api-proxy/src/gateway/localApiProxyRouteGroups.ts`
- Create: `packages/pc-react/intelligence/sdkwork-local-api-proxy/tests/localApiProxyRuntimePlan.test.ts`
- Create: `packages/pc-react/intelligence/sdkwork-local-api-proxy/tests/localApiProxyOperations.test.ts`

- [ ] Step 1: Write failing tests for runtime-plan compilation from config, default route selection, active-capability filtering, and consumer exposure filtering.
- [ ] Step 2: Write failing tests for gateway operation catalogs and route groups such as `text-and-chat`, `compat-and-model`, `embedding-and-moderation`, and `files-and-batches`.
- [ ] Step 3: Verify the new tests fail for missing runtime-plan and operation-catalog implementations.
- [ ] Step 4: Implement `compileLocalApiProxyRuntimePlan()` so it turns `LocalApiProxyConfig` into a deterministic active-runtime view.
- [ ] Step 5: Implement operation definitions with stable ids like `openai.v1.chat.completions.create` and `openai.v1.responses.create`, plus capability metadata, method, path pattern, and streaming flags.
- [ ] Step 6: Re-run the runtime-plan and operation tests until green.

### Task 4: Add storage contracts and dialect-specific schema builders

**Files:**
- Create: `packages/pc-react/intelligence/sdkwork-local-api-proxy/src/repository/localApiProxyRepository.ts`
- Create: `packages/pc-react/intelligence/sdkwork-local-api-proxy/src/repository/localApiProxySchema.ts`
- Create: `packages/pc-react/intelligence/sdkwork-local-api-proxy/src/repository/localApiProxySqlite.ts`
- Create: `packages/pc-react/intelligence/sdkwork-local-api-proxy/src/repository/localApiProxyPostgresql.ts`
- Create: `packages/pc-react/intelligence/sdkwork-local-api-proxy/tests/localApiProxySchema.test.ts`
- Create: `packages/pc-react/intelligence/sdkwork-local-api-proxy/tests/localApiProxyRepository.test.ts`

- [ ] Step 1: Write failing tests for storage config parsing, table naming, SQLite DDL generation, PostgreSQL DDL generation, and repository-port signatures.
- [ ] Step 2: Verify the tests fail because the schema builders and repository contracts do not exist.
- [ ] Step 3: Implement storage config types for `sqlitePath`, `postgresUrl`, and optional PostgreSQL schema defaulting to `local_api_proxy`.
- [ ] Step 4: Implement schema builders that emit the full `lap_` table set, including `lap_schema_migrations`, `lap_config`, `lap_routes`, `lap_route_capabilities`, `lap_route_models`, `lap_route_exposures`, `lap_runtime_settings`, `lap_probe_records`, `lap_credentials`, `lap_request_logs`, `lap_message_logs`, `lap_capture_settings`, and `lap_runtime_events`.
- [ ] Step 5: Define `LocalApiProxyControlRepository` and `LocalApiProxyObservabilityRepository` TypeScript ports that are dialect-agnostic.
- [ ] Step 6: Re-run the schema and repository tests until green.

### Task 5: Add host-bridge contracts and Tauri adapter shell

**Files:**
- Create: `packages/pc-react/intelligence/sdkwork-local-api-proxy/src/host/tauri/localApiProxyTauriBridge.ts`
- Create: `packages/pc-react/intelligence/sdkwork-local-api-proxy/src/services/localApiProxyHostService.ts`
- Create: `packages/pc-react/intelligence/sdkwork-local-api-proxy/tests/localApiProxyTauriBridge.test.ts`

- [ ] Step 1: Write failing tests for typed Tauri command names, event names, bridge mapping, and host service behavior using injected invoke and listen functions.
- [ ] Step 2: Verify failure because the bridge contract does not exist.
- [ ] Step 3: Implement a typed bridge that owns commands for config load/save, validation, runtime lifecycle, probe, request logs, message logs, and capture settings.
- [ ] Step 4: Implement the host service on top of the bridge and re-run `pnpm test -- packages/pc-react/intelligence/sdkwork-local-api-proxy/tests/localApiProxyTauriBridge.test.ts` until green.

### Task 6: Add package services and minimal reusable UI shells

**Files:**
- Create: `packages/pc-react/intelligence/sdkwork-local-api-proxy/src/services/localApiProxyConfigService.ts`
- Create: `packages/pc-react/intelligence/sdkwork-local-api-proxy/src/services/localApiProxyRuntimeService.ts`
- Create: `packages/pc-react/intelligence/sdkwork-local-api-proxy/src/services/localApiProxyObservabilityService.ts`
- Create: `packages/pc-react/intelligence/sdkwork-local-api-proxy/src/components/LocalApiProxyRuntimeSummary.tsx`
- Create: `packages/pc-react/intelligence/sdkwork-local-api-proxy/src/components/LocalApiProxyRouteList.tsx`
- Create: `packages/pc-react/intelligence/sdkwork-local-api-proxy/src/pages/LocalApiProxyPage.tsx`
- Create: `packages/pc-react/intelligence/sdkwork-local-api-proxy/tests/localApiProxyServices.test.ts`
- Create: `packages/pc-react/intelligence/sdkwork-local-api-proxy/tests/localApiProxyPage.test.tsx`

- [ ] Step 1: Write failing service tests for config loading, runtime status composition, and request-log pagination using injected repository and host ports.
- [ ] Step 2: Write failing component and page tests for route list rendering and runtime-summary rendering.
- [ ] Step 3: Verify the tests fail with missing services and UI exports.
- [ ] Step 4: Implement the minimal package services and UI surfaces needed to make the package consumable from `claw-studio` without product-owned reimplementation.
- [ ] Step 5: Re-run the service and UI tests until green.

### Task 7: Add native runtime scaffold and document the package

**Files:**
- Create: `packages/pc-react/intelligence/sdkwork-local-api-proxy/native/tauri-rust/Cargo.toml`
- Create: `packages/pc-react/intelligence/sdkwork-local-api-proxy/native/tauri-rust/src/lib.rs`
- Create: `packages/pc-react/intelligence/sdkwork-local-api-proxy/native/tauri-rust/src/runtime/mod.rs`
- Create: `packages/pc-react/intelligence/sdkwork-local-api-proxy/native/tauri-rust/src/commands/mod.rs`
- Modify: `packages/pc-react/intelligence/sdkwork-local-api-proxy/README.md`
- Modify: `packages/pc-react/intelligence/sdkwork-local-api-proxy/src/index.ts`

- [ ] Step 1: Create a native runtime scaffold that mirrors the package structure and makes the embedded Rust runtime an explicit owned boundary of the package.
- [ ] Step 2: Export every public TypeScript type, service, and UI surface from `src/index.ts`.
- [ ] Step 3: Update the README with package purpose, ownership boundary, public API, and the fact that SQLite local and PostgreSQL server modes share one authority model.

### Task 8: Verify the full package and structure rules

**Files:**
- Modify: `docs/superpowers/specs/2026-04-18-sdkwork-appbase-local-api-proxy-design.md`
- Modify: `docs/superpowers/plans/2026-04-18-sdkwork-appbase-local-api-proxy.md`

- [ ] Step 1: Run `pnpm test -- packages/pc-react/intelligence/sdkwork-local-api-proxy/tests`.
- [ ] Step 2: Run `pnpm --filter @sdkwork/local-api-proxy typecheck`.
- [ ] Step 3: Run `pnpm run review:structure`.
- [ ] Step 4: Run `pnpm test`.
- [ ] Step 5: Reflect any verification-driven corrections back into the spec and plan documents.
- [ ] Step 6: Commit the package foundation with a Conventional Commit message scoped to the new package.
