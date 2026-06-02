# Admin Model Sites Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add admin “模型管理 > 中转站管理” with `ai_site` database structure, `/backend/v3/api/sites` CRUD APIs, generated backend SDK coverage, and portal CRUD UI.

**Architecture:** Treat a site as the user-facing relay website/service provider. Keep `ai_site_service` as an internal service facet defaulted to `serviceType=ai_model_relay`, keep model capability catalog at `ai_site_model`, and bind runtime channels through existing `ai_channel` fields instead of adding a route table.

**Tech Stack:** Rust Axum + sqlx SQLite/Postgres stores, schema registry YAML + generated DDL/manifest/OpenAPI, generated `@sdkwork/clawrouter-backend-sdk`, React/TypeScript admin portal.

---

### Task 1: Contract And Runtime Tests

**Files:**
- Create: `tests/test_admin_site_runtime_standard.py`
- Create: `apps/sdkwork-claw-router-portal/admin-model-site-runtime.test.ts`

- [ ] **Step 1: Write failing schema/API contract test**

Create a Python unittest that asserts `ai_site`, `ai_site_service`, `ai_site_model`, and new `ai_channel` site binding columns exist in schema registry/generated schema, that `/backend/v3/api/sites` operations are present in frontend field contract and manifest, and that rejected names/routes (`relay_stations`, `/backend/v3/api/integration/sites`, `integration_site`, service-nested model APIs) are absent.

- [ ] **Step 2: Write failing portal runtime test**

Create a Node strip-types test that asserts admin model service code imports/uses `getClawRouterBackendSdkClient().sites`, does not use raw fetch/axios, exposes `SiteService`, and admin model UI contains a route/view marker for 中转站管理.

- [ ] **Step 3: Run tests and confirm RED**

Run:
```powershell
python -B -m unittest tests.test_admin_site_runtime_standard
node --experimental-strip-types apps/sdkwork-claw-router-portal/admin-model-site-runtime.test.ts
```
Expected: FAIL because site schema/contract/service/UI do not exist yet.

### Task 2: Schema Registry And Generated Database Artifacts

**Files:**
- Modify: `docs/schema-registry/tables/013-integration.yaml`
- Modify: `docs/schema-registry/frontend-field-contracts/models/admin-model.yaml`
- Modify: `docs/schema-registry/frontend-field-contracts/operations/backend-ai.yaml`
- Modify: `docs/schema-registry/frontend-field-contracts/index.yaml`
- Generated: `docs/schema-registry/frontend-field-contracts.yaml`
- Generated: `generated/schema/registry/sdkwork-claw-router.tables.effective.yaml`
- Generated: `generated/schema/postgres/schema.sql`
- Generated: `generated/schema/manifest/schema-manifest.json`
- Generated: `generated/schema/frontend/frontend-field-audit.json`
- Generated: `generated/schema/frontend/frontend-operation-audit.json`
- Generated: `generated/api/api-contract-manifest.json`
- Generated: `generated/openapi/clawrouter-backend-openapi.json`
- Generated: `sdks/clawrouter-backend-sdk/clawrouter-backend-sdk-typescript/**`

- [ ] **Step 1: Add `ai_site`, `ai_site_service`, `ai_site_model` table definitions**

Use tenant-scoped common columns, no plaintext credential fields, `site_service_id NOT NULL`, `service_type`, health/sync fields, and indexes starting with `tenant_id, organization_id` where scoped.

- [ ] **Step 2: Extend `ai_channel` schema**

Add `site_id`, `site_service_id`, `site_code`, `site_service_code`, `site_channel_role` plus indexes `idx_ai_channel_site_status`, `idx_ai_channel_site_service_status`, `idx_ai_channel_site_code`.

- [ ] **Step 3: Add frontend/API operation contract**

Declare backend SDK operations rooted at `/backend/v3/api/sites`, with model APIs under `/sites/{siteId}/models` and channel/test/health endpoints under site paths. Do not add `/integration/sites` or `/services/{serviceId}/models`.

- [ ] **Step 4: Regenerate schema/contract/SDK artifacts**

Run relevant generators:
```powershell
python -B -m tools.schema_quality_gate
python -B -m tools.api_contract_manifest
python -B -m tools.clawrouter_openapi_generator
node sdks\clawrouter-backend-sdk\bin\generate-sdk.mjs --language typescript
python -B -m tools.clawrouter_sdk_guardian
```

- [ ] **Step 5: Re-run contract/runtime tests**

Run Python and Node runtime tests; expected contract portions pass once frontend service/UI are implemented.

### Task 3: Rust Backend Ports, API, And SQL Stores

**Files:**
- Create: `services/sdkwork-claw-product/src/ports/admin_site_store.rs`
- Modify: `services/sdkwork-claw-product/src/ports/mod.rs`
- Create: `services/sdkwork-claw-product/src/api/admin_site.rs`
- Modify: `services/sdkwork-claw-product/src/api/mod.rs`
- Create: `services/sdkwork-claw-product/src/infrastructure/sql/sql_admin_site.rs`
- Modify: `services/sdkwork-claw-product/src/infrastructure/sql/mod.rs`
- Create: `services/sdkwork-claw-product/src/infrastructure/sql/sqlite/admin_site_store.rs`
- Modify: `services/sdkwork-claw-product/src/infrastructure/sql/sqlite/mod.rs`
- Create: `services/sdkwork-claw-product/src/infrastructure/sql/postgres/admin_site_store.rs`
- Modify: `services/sdkwork-claw-product/src/infrastructure/sql/postgres/mod.rs`
- Modify: `services/sdkwork-claw-admin-api/src/lib.rs`
- Test: `services/sdkwork-claw-admin-api/tests/database_config_router.rs`

- [ ] **Step 1: Add failing Rust API test**

Add a SQLite router test that creates a site, lists it, updates it, adds a model under `/sites/{siteId}/models`, lists site models, health-checks the site, and deletes the model/site. Assert response does not expose `credentialRef`.

- [ ] **Step 2: Define port types and trait**

Add subject/query/command/item structs for site CRUD, model CRUD/upsert, channel list, test/health operations.

- [ ] **Step 3: Implement Axum router**

Add `/backend/v3/api/sites` routes with validation, default `serviceType=ai_model_relay`, generated UUIDs/request IDs, safe credential masking, and PlusApiResult responses.

- [ ] **Step 4: Implement SQLite and Postgres stores**

Create default `ai_site_service` during site creation, resolve default service for model operations, write mutation audit rows to `ops_audit_log`, list channels from existing `ai_channel` binding fields, update health status without external network dependency.

- [ ] **Step 5: Register stores and router**

Wire sqlite/postgres stores into admin API runtime and merge router under the existing admin subject boundary.

- [ ] **Step 6: Run focused Rust tests**

Run:
```powershell
cargo test -p sdkwork-claw-admin-api admin_site
```
Expected: PASS after implementation.

### Task 4: Portal Admin Model Site UI

**Files:**
- Modify: `apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-model/src/modelService.ts`
- Modify: `apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-model/src/index.tsx`
- Modify: `apps/sdkwork-claw-router-portal/src/App.tsx`
- Modify: `apps/sdkwork-claw-router-portal/src/adminModuleRegistry.ts`
- Modify: i18n resources under `apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-i18n/src/resources/admin/`

- [ ] **Step 1: Add SDK-backed `SiteService` boundary**

Use only `getClawRouterBackendSdkClient().sites.*` generated SDK methods. Normalize site/model/channel/test responses, no raw fetch/axios/manual URLs.

- [ ] **Step 2: Add 中转站管理 view under model admin**

Provide route/view marker `/admin/model/sites`, list/search, create/edit/delete site, model catalog CRUD within selected site, channel list, and connection/health actions.

- [ ] **Step 3: Add nav/module entry and i18n copy**

Expose “中转站管理” in model management navigation without changing existing header/product visual language.

- [ ] **Step 4: Run portal tests/build**

Run:
```powershell
node --experimental-strip-types apps/sdkwork-claw-router-portal/admin-model-site-runtime.test.ts
pnpm.cmd --dir apps/sdkwork-claw-router-portal build
```
Expected: PASS or report unrelated pre-existing failures with exact location.

### Task 5: Final Verification

**Files:** all touched files

- [ ] **Step 1: Run focused gates**

Run Python runtime test, Node runtime test, focused Rust test, SDK guardian, schema quality gate, and portal build.

- [ ] **Step 2: Inspect final diff**

Run:
```powershell
git status --short
git diff --stat
```
Confirm no generated SDK was hand-edited and no unrelated file was reverted.

- [ ] **Step 3: Report result**

Summarize implemented database/API/UI, exact verification commands, any failures/blockers, and key file references.
