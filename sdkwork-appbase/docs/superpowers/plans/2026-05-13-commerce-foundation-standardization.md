# Commerce Foundation Standardization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `sdkwork-appbase` the canonical reusable commerce foundation for account, wallet, points, VIP, coupon, recharge, exchange, preflight, ledger, and admin operations, then align ClawRouter app/backend SDK usage to that foundation.

**Architecture:** `sdkwork-appbase` owns the standard domain vocabulary, route tree, data model catalog, SDK port surface, service facade, runtime flags, and private Rust storage/runtime contracts. ClawRouter consumes the same standard through generated app/backend SDKs and product-specific Rust adapters, with no compatibility routes or product-private `plus_*` names in the public foundation.

**Tech Stack:** TypeScript/Vitest workspace packages, Rust crates with Cargo tests, SQLite-compatible SQL migrations for private runtime, ClawRouter YAML API contract manifest, generated OpenAPI, and generated TypeScript SDKs.

---

### Task 1: Appbase TypeScript Standard Contracts

**Files:**
- Modify: `packages/common/commerce/sdkwork-commerce-contracts/tests/commerce-contracts.standard.test.ts`
- Modify: `packages/common/commerce/sdkwork-commerce-contracts/src/index.ts`

- [ ] Add failing tests that require coupon, coupon campaign, coupon batch, coupon code, user coupon, coupon redemption, recharge package, recharge order, payment attempt, exchange rule, and exchange transaction tables.
- [ ] Add failing tests for canonical app routes under `client.billing.*`: coupon catalog, claims, redeem, usage, current-user coupons, recharge packages/orders, exchange rules, wallet exchanges, and payment checkout/records.
- [ ] Add failing tests for backend/admin route constants under `/backend/v3/api/billing/*`, including coupon administration, user coupon inventory, balance adjustments, recharge package/record management, exchange rule management, finance ledger, and usage statements.
- [ ] Implement the domain model table catalog, fields, capability mapping, app routes, backend routes, and operation-id flattening.
- [ ] Run `pnpm exec vitest packages/common/commerce/sdkwork-commerce-contracts/tests/commerce-contracts.standard.test.ts --run` and keep the package green.

### Task 2: Appbase SDK Ports

**Files:**
- Modify: `packages/common/commerce/sdkwork-commerce-sdk-ports/tests/commerce-sdk-ports.standard.test.ts`
- Modify: `packages/common/commerce/sdkwork-commerce-sdk-ports/src/index.ts`

- [ ] Add failing tests that derive app required methods from app route contracts and backend required methods from backend route contracts.
- [ ] Add failing tests that accept only nested `billing.*` generated app/backend SDK surfaces.
- [ ] Add failing tests that reject top-level commerce namespaces such as `account`, `wallet`, `points`, `vip`, `coupon`, `coupons`, `recharge`, and `exchange`.
- [ ] Implement typed app and backend billing client interfaces plus app/backend SDK assertions.
- [ ] Run `pnpm exec vitest packages/common/commerce/sdkwork-commerce-sdk-ports/tests/commerce-sdk-ports.standard.test.ts --run`.

### Task 3: Appbase Service And Runtime

**Files:**
- Modify: `packages/common/commerce/sdkwork-commerce-service/tests/commerce-service.standard.test.ts`
- Modify: `packages/common/commerce/sdkwork-commerce-service/src/index.ts`
- Modify: `packages/common/commerce/sdkwork-commerce-runtime/tests/commerce-runtime.standard.test.ts`
- Modify: `packages/common/commerce/sdkwork-commerce-runtime/src/index.ts`

- [ ] Add failing tests that route coupon, recharge, exchange, payment, account, wallet, VIP, and preflight app calls through injected generated SDK methods.
- [ ] Add failing tests that route backend/admin coupon, recharge, exchange, balance adjustment, finance ledger, and usage statement calls through injected generated backend SDK methods.
- [ ] Add failing tests that runtime bootstrap validates both app and backend SDK clients when a backend client is provided.
- [ ] Implement service facades without raw HTTP helpers, fake success branches, or handwritten endpoint strings.
- [ ] Add runtime feature flags for coupon, recharge, exchange, payments, account ledger, and admin operations.
- [ ] Run service and runtime Vitest tests.

### Task 4: Appbase Rust Private Runtime Foundation

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-core-rust/tests/commerce_core_standard.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-core-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-http-rust/tests/commerce_http_standard.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-http-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-tauri-rust/tests/commerce_tauri_standard.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/tests/commerce_storage_standard.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/migrations/0001_commerce_foundation.sql`

- [ ] Add failing tests for coupon, recharge, payment, and exchange enums/status validators.
- [ ] Add failing tests requiring the Rust route catalog to match the TypeScript app standard route count and important app operation IDs.
- [ ] Add failing tests requiring the storage catalog and migration SQL to include standard coupon, recharge, payment, and exchange tables with tenant-scoped uniqueness and hot-path indexes.
- [ ] Implement Rust value objects, route constants, table catalog, index catalog, and migration SQL.
- [ ] Run Cargo tests for all native commerce crates.

### Task 5: ClawRouter Contract And SDK Alignment

**Files:**
- Modify: `docs/schema-registry/frontend-field-contracts.yaml`
- Regenerate: `generated/api/api-contract-manifest.json`
- Regenerate: `generated/openapi/clawrouter-app-openapi.json`
- Regenerate: `generated/openapi/clawrouter-backend-openapi.json`
- Regenerate: `sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript`
- Regenerate: `sdks/clawrouter-backend-sdk/clawrouter-backend-sdk-typescript`

- [ ] Add or normalize app/backend billing operations to match appbase route and operation-id standards.
- [ ] Run `python -B -m tools.api_contract_manifest`.
- [ ] Run `python -B -m tools.clawrouter_openapi_generator`.
- [ ] Run `python -B -m tools.clawrouter_sdk_runtime_standardizer`.
- [ ] Run `node sdks\clawrouter-app-sdk\bin\generate-sdk.mjs --language typescript`.
- [ ] Run `node sdks\clawrouter-backend-sdk\bin\generate-sdk.mjs --language typescript`.
- [ ] Run `python -B -m tools.clawrouter_sdk_guardian`.

### Task 6: ClawRouter Console/Admin Product API Usage

**Files:**
- Modify: `apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-console-account/src/accountService.ts`
- Modify: `apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-console-recharge/src/rechargeService.ts`
- Modify: `apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-console-billing/src/billingService.ts`
- Modify: `apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-console-billing/src/commerceFoundationService.ts`
- Modify: `apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-marketing/src/marketingService.ts`
- Modify: `apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-user/src/userService.ts`
- Modify: `apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-finance/src/financeService.ts`
- Modify tests under `apps/sdkwork-claw-router-portal/*runtime.test.ts` and `tests/test_*runtime_standard.py`

- [ ] Add failing portal/runtime tests for generated app SDK calls used by account, coupon, points, recharge, exchange, and payment console services.
- [ ] Add failing portal/runtime tests for generated backend SDK calls used by marketing, admin user, finance, recharge, exchange, and coupon administration services.
- [ ] Replace unknown pass-throughs with typed service wrappers where the appbase standard now defines a concrete operation.
- [ ] Keep UI visuals unchanged and do not add raw HTTP or manual auth headers.
- [ ] Run portal runtime tests and Python runtime standards.

### Task 7: Verification And Review Loop

**Files:**
- No manual generated SDK edits.

- [ ] Run `pnpm run test:commerce-standard-contracts` from `apps/sdkwork-appbase`.
- [ ] Run ClawRouter SDK guardian, schema quality gate, billing/runtime/admin tests, and Rust app API contract route tests.
- [ ] Run Java `CommerceBillingAppApiStandardContractTest` if SaaS app API contract files are changed.
- [ ] Review generated app/backend SDK method names against the appbase standard and correct the contract source if any method shape diverges.
- [ ] Document any command that cannot run with the exact failure and residual risk.
