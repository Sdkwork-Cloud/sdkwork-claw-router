# Admin Model Mapping Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add admin model mapping configuration with schema, backend CRUD/resolve APIs, generated backend SDK coverage, and portal admin UI.

**Architecture:** Use one tenant-scoped `ai_model_mapping_rule` table with `scope_type` for global/vendor/channel rules. Backend resolution applies `channel > vendor > global`, then priority sorting inside a scope. Portal code calls the generated backend SDK only.

**Tech Stack:** Rust Axum + sqlx SQLite/Postgres stores, schema registry YAML + generated OpenAPI/SDK, React/TypeScript admin portal.

---

### Task 1: Contract Tests

- [ ] Add `tests/test_admin_model_mapping_runtime_standard.py`.
- [ ] Add `apps/sdkwork-claw-router-portal/admin-model-mapping-runtime.test.ts`.
- [ ] Run both tests and confirm RED.

### Task 2: Schema And API Contract

- [ ] Add `ai_model_mapping_rule` to the AI schema registry.
- [ ] Add `/admin/model/mappings` frontend models.
- [ ] Add backend operations for list/create/update/delete/resolve.
- [ ] Regenerate manifest, OpenAPI, and backend SDK.

### Task 3: Rust Backend

- [ ] Extend the admin model store port with mapping CRUD/resolve types.
- [ ] Add Axum routes under `/backend/v3/api/ai/model_mappings`.
- [ ] Implement SQLite and Postgres persistence.
- [ ] Add focused API/store tests for `channel > vendor > global`.

### Task 4: Portal UI

- [ ] Add `ModelMappingService` using `getClawRouterBackendSdkClient().ai.modelMappings`.
- [ ] Add `ModelMappingAdmin` under `/admin/model/mappings`.
- [ ] Add navigation and i18n keys.
- [ ] Keep UI dense and operational: list, scope filters, form, resolve preview.

### Task 5: Verification

- [ ] Run focused Python contract test.
- [ ] Run focused Node runtime tests.
- [ ] Run focused Rust tests.
- [ ] Run SDK guardian and portal type/build checks; report unrelated existing failures.
