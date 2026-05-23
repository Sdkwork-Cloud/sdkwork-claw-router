# SDKWork Appbase Commerce Local Private Rust Runtime Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first local/private Rust commerce runtime slice for `sdkwork-appbase` with core, account, promotion/coupon, order, payment, membership/VIP, invoice, runtime, storage, HTTP, and Tauri standards.

**Architecture:** Rust is the authoritative local/private execution layer. Business-domain crates own domain rules and service ports; infrastructure crates expose runtime composition, storage schema catalogs, HTTP routes, and Tauri command manifests. This slice intentionally does not add compatibility packages or app-specific SDK adapters.

**Tech Stack:** Rust 2021, Cargo tests, existing appbase native-rust crate conventions, SQL migration catalogs, Tauri command manifest contracts.

---

### Task 1: Freeze Final Rust-First Spec

**Files:**
- Modify: `docs/superpowers/specs/2026-05-17-sdkwork-appbase-commerce-domain-packaging-design.md`

- [x] Rewrite the spec around local/private Rust backend execution.
- [x] Remove compatibility-layer assumptions from the target standard.
- [x] Define the first implementation slice: `core`, `account`, `promotion`, `order`, `payment`, `membership`, `invoice`, `runtime`, `storage`, `http`, `tauri`.

### Task 2: Core Runtime Primitives

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-core-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-core-rust/tests/commerce_core_standard.rs`

- [x] Write failing tests for `CommerceSurfaceProfile`, `CommerceServiceError`, idempotency metadata, request hash conflict behavior, capability flags, and status transition helper expectations.
- [x] Run `cargo test --manifest-path packages/native-rust/commerce/sdkwork-commerce-core-rust/Cargo.toml` and confirm the new tests fail.
- [x] Implement the minimal core primitives.
- [x] Re-run the core tests and confirm they pass.

### Task 3: Account Domain Crate

**Files:**
- Create: `packages/native-rust/commerce/sdkwork-commerce-account-rust/Cargo.toml`
- Create: `packages/native-rust/commerce/sdkwork-commerce-account-rust/src/lib.rs`
- Create: `packages/native-rust/commerce/sdkwork-commerce-account-rust/tests/account_standard.rs`

- [x] Write failing tests for account summary defaults, immutable ledger entry construction, prehold lifecycle, and append-only ledger policy.
- [x] Run `cargo test --manifest-path packages/native-rust/commerce/sdkwork-commerce-account-rust/Cargo.toml` and confirm failure.
- [x] Implement the account domain types and service helpers.
- [x] Re-run the account tests and confirm they pass.

### Task 4: Order Domain Crate

**Files:**
- Create: `packages/native-rust/commerce/sdkwork-commerce-order-rust/Cargo.toml`
- Create: `packages/native-rust/commerce/sdkwork-commerce-order-rust/src/lib.rs`
- Create: `packages/native-rust/commerce/sdkwork-commerce-order-rust/tests/order_standard.rs`

- [x] Write failing tests for order amount breakdown, order status transitions, cancellation rules, and paid-order invoice/payment references.
- [x] Run `cargo test --manifest-path packages/native-rust/commerce/sdkwork-commerce-order-rust/Cargo.toml` and confirm failure.
- [x] Implement order domain types and transition functions.
- [x] Re-run the order tests and confirm they pass.

### Task 5: Payment Domain Crate

**Files:**
- Create: `packages/native-rust/commerce/sdkwork-commerce-payment-rust/Cargo.toml`
- Create: `packages/native-rust/commerce/sdkwork-commerce-payment-rust/src/lib.rs`
- Create: `packages/native-rust/commerce/sdkwork-commerce-payment-rust/tests/payment_standard.rs`

- [x] Write failing tests for payment intent creation, payment status transitions, refund transitions, provider-port command shape, and unsupported provider errors.
- [x] Run `cargo test --manifest-path packages/native-rust/commerce/sdkwork-commerce-payment-rust/Cargo.toml` and confirm failure.
- [x] Implement payment domain types and transition functions.
- [x] Re-run the payment tests and confirm they pass.

### Task 6: Promotion/Coupon Domain Crate

**Files:**
- Create: `packages/native-rust/commerce/sdkwork-commerce-promotion-rust/Cargo.toml`
- Create: `packages/native-rust/commerce/sdkwork-commerce-promotion-rust/src/lib.rs`
- Create: `packages/native-rust/commerce/sdkwork-commerce-promotion-rust/tests/promotion_standard.rs`

- [x] Write failing tests for coupon templates, claim/redemption idempotency, coupon lifecycle, and promotion repository command shape.
- [x] Run `cargo test --manifest-path packages/native-rust/commerce/sdkwork-commerce-promotion-rust/Cargo.toml` and confirm failure.
- [x] Implement promotion/coupon domain types and transition functions.
- [x] Re-run the promotion tests and confirm they pass.

### Task 7: Membership/VIP Domain Crate

**Files:**
- Create: `packages/native-rust/commerce/sdkwork-commerce-membership-rust/Cargo.toml`
- Create: `packages/native-rust/commerce/sdkwork-commerce-membership-rust/src/lib.rs`
- Create: `packages/native-rust/commerce/sdkwork-commerce-membership-rust/tests/membership_standard.rs`

- [x] Write failing tests for VIP level definitions, membership activation, membership lifecycle, entitlement grants, and membership repository command shape.
- [x] Run `cargo test --manifest-path packages/native-rust/commerce/sdkwork-commerce-membership-rust/Cargo.toml` and confirm failure.
- [x] Implement membership/VIP domain types and transition functions.
- [x] Re-run the membership tests and confirm they pass.

### Task 8: Invoice Domain Crate

**Files:**
- Create: `packages/native-rust/commerce/sdkwork-commerce-invoice-rust/Cargo.toml`
- Create: `packages/native-rust/commerce/sdkwork-commerce-invoice-rust/src/lib.rs`
- Create: `packages/native-rust/commerce/sdkwork-commerce-invoice-rust/tests/invoice_standard.rs`

- [x] Write failing tests for invoice title validation, invoice status transitions, order/payment linkage, and provider-port command shape.
- [x] Run `cargo test --manifest-path packages/native-rust/commerce/sdkwork-commerce-invoice-rust/Cargo.toml` and confirm failure.
- [x] Implement invoice domain types and transition functions.
- [x] Re-run the invoice tests and confirm they pass.

### Task 9: Runtime Composition Crate

**Files:**
- Create: `packages/native-rust/commerce/sdkwork-commerce-runtime-rust/Cargo.toml`
- Create: `packages/native-rust/commerce/sdkwork-commerce-runtime-rust/src/lib.rs`
- Create: `packages/native-rust/commerce/sdkwork-commerce-runtime-rust/tests/runtime_standard.rs`

- [x] Write failing tests for local/private runtime config, first-slice capability manifest, required service names, and local/private deployment validation.
- [x] Run `cargo test --manifest-path packages/native-rust/commerce/sdkwork-commerce-runtime-rust/Cargo.toml` and confirm failure.
- [x] Implement runtime composition metadata.
- [x] Re-run the runtime tests and confirm they pass.

### Task 10: Storage, HTTP, and Tauri First-Slice Standards

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/tests/commerce_storage_standard.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-http-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-http-rust/tests/commerce_http_standard.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-tauri-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-tauri-rust/tests/commerce_tauri_standard.rs`

- [x] Write failing tests for first-slice table catalog, migration names, app routes, backend routes, and Tauri command manifest.
- [x] Run cargo tests for storage, HTTP, and Tauri crates and confirm failure.
- [x] Implement first-slice storage, HTTP, and Tauri manifest updates.
- [x] Re-run these tests and confirm they pass.

### Task 11: Business Crate Module and Service Contract Standardization

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-core-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-core-rust/tests/commerce_core_standard.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-*/src/**`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-runtime-rust/src/lib.rs`
- Create: `packages/native-rust/commerce/sdkwork-commerce-runtime-rust/tests/domain_crate_structure_standard.rs`
- Create: `packages/native-rust/commerce/sdkwork-commerce-runtime-rust/tests/domain_service_contracts_standard.rs`

- [x] Write failing tests requiring every business crate to expose `domain`, `commands`, `queries`, `ports`, `service`, and `validation` modules.
- [x] Write failing tests requiring every business crate to expose a validated reusable service contract.
- [x] Refactor `account`, `promotion`, `order`, `payment`, `membership`, and `invoice` into the standard module layout while keeping root re-exports stable.
- [x] Add `CommerceServiceContract`, first-slice service contract composition, operation-to-service bindings, and Tauri command-to-service bindings.
- [x] Re-run core, business crate, runtime, and Tauri tests and confirm they pass.

### Task 12: Final Verification

**Files:**
- No new implementation files.

- [x] Run all first-slice cargo tests:
  - `cargo test --manifest-path packages/native-rust/commerce/sdkwork-commerce-core-rust/Cargo.toml`
  - `cargo test --manifest-path packages/native-rust/commerce/sdkwork-commerce-account-rust/Cargo.toml`
  - `cargo test --manifest-path packages/native-rust/commerce/sdkwork-commerce-order-rust/Cargo.toml`
  - `cargo test --manifest-path packages/native-rust/commerce/sdkwork-commerce-payment-rust/Cargo.toml`
  - `cargo test --manifest-path packages/native-rust/commerce/sdkwork-commerce-promotion-rust/Cargo.toml`
  - `cargo test --manifest-path packages/native-rust/commerce/sdkwork-commerce-membership-rust/Cargo.toml`
  - `cargo test --manifest-path packages/native-rust/commerce/sdkwork-commerce-invoice-rust/Cargo.toml`
  - `cargo test --manifest-path packages/native-rust/commerce/sdkwork-commerce-runtime-rust/Cargo.toml`
  - `cargo test --manifest-path packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/Cargo.toml`
  - `cargo test --manifest-path packages/native-rust/commerce/sdkwork-commerce-http-rust/Cargo.toml`
  - `cargo test --manifest-path packages/native-rust/commerce/sdkwork-commerce-tauri-rust/Cargo.toml`
- [x] Run `git diff --check`.
- [x] Summarize exact remaining gaps if any verification fails.

### Task 13: Runtime Executable Service Boundary

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-core-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-core-rust/tests/commerce_core_standard.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-runtime-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-runtime-rust/tests/domain_service_contracts_standard.rs`

- [x] Write failing tests for operation contracts, read/write execution policy, idempotency requirements, transaction requirements, and capability checks.
- [x] Run focused core/runtime cargo tests and confirm the new tests fail.
- [x] Implement the standard operation execution metadata in core and compose it in runtime.
- [x] Re-run focused core/runtime tests and confirm they pass.

### Task 14: Runtime Execution Plan Guard

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-runtime-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-runtime-rust/tests/domain_service_contracts_standard.rs`

- [x] Write failing tests for a runtime execution plan that resolves operation contracts, validates context, enforces capability flags, and rejects missing write idempotency before service dispatch.
- [x] Run focused runtime tests and confirm failure.
- [x] Implement `CommerceRuntimeExecutionPlan` and `prepare_operation_execution` as the standard pre-dispatch guard.
- [x] Re-run focused runtime tests and confirm they pass.

### Task 15: Idempotency, Transaction, and Storage Repository Boundary

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-core-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-core-rust/tests/commerce_core_standard.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/tests/commerce_storage_standard.rs`

- [x] Write failing tests for idempotency repository commands, lock/complete/fail outcomes, transaction scope metadata, and storage repository-to-table bindings.
- [x] Run focused core/storage tests and confirm failure.
- [x] Implement reusable core port contracts for idempotency and transaction boundaries.
- [x] Implement storage repository binding metadata for the first-slice tables.
- [x] Re-run focused core/storage tests and confirm they pass.

### Task 16: Transport Execution Metadata

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-http-rust/Cargo.toml`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-http-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-http-rust/tests/commerce_http_standard.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-tauri-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-tauri-rust/tests/commerce_tauri_standard.rs`

- [x] Write failing tests requiring HTTP route execution metadata and Tauri command execution metadata to expose service name, execution policy, capability, idempotency requirement, and transaction requirement.
- [x] Run focused HTTP/Tauri tests and confirm failure.
- [x] Implement transport metadata by deriving from runtime operation contracts.
- [x] Re-run focused HTTP/Tauri tests and confirm they pass.

### Task 17: Runtime Service Dispatch Boundary

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-runtime-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-runtime-rust/tests/domain_service_contracts_standard.rs`

- [x] Write failing tests for a service registry and executor that dispatches prepared runtime execution plans to registered domain services.
- [x] Run focused runtime tests and confirm failure.
- [x] Implement `CommerceRuntimeServiceHandler`, `CommerceRuntimeServiceRegistry`, `CommerceRuntimeServiceRequest`, and `CommerceRuntimeServiceResponse`.
- [x] Re-run focused runtime tests and confirm they pass.

### Task 18: Idempotency-Aware Runtime Execution

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-runtime-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-runtime-rust/tests/domain_service_contracts_standard.rs`

- [x] Write failing tests for replaying completed idempotency records, rejecting hash conflicts, and locking/completing new write executions through the runtime executor.
- [x] Run focused runtime tests and confirm failure.
- [x] Implement `CommerceRuntimeIdempotencyStore`, `CommerceRuntimeExecutionOutcome`, and `execute_with_idempotency`.
- [x] Re-run focused runtime tests and confirm they pass.

### Task 19: Transaction-Aware Runtime Execution

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-runtime-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-runtime-rust/tests/domain_service_contracts_standard.rs`

- [x] Write failing tests requiring transactional writes to begin and commit around idempotency lock, service dispatch, and idempotency complete.
- [x] Write failing tests requiring failed transactional writes to rollback and mark idempotency failed.
- [x] Run focused runtime tests and confirm failure.
- [x] Implement `CommerceRuntimeTransactionManager` and `execute_with_transaction`.
- [x] Re-run focused runtime tests and confirm they pass.

### Task 20: Unified Runtime Operation Entrypoint

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-runtime-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-runtime-rust/tests/domain_service_contracts_standard.rs`

- [x] Write failing tests for `execute_runtime_operation` to prepare, dispatch, enforce capability, enforce idempotency, and use transaction boundaries through one host-facing entrypoint.
- [x] Run focused runtime tests and confirm failure.
- [x] Implement `CommerceRuntimeOperationInput`, `CommerceRuntimeOperationOutput`, and `execute_runtime_operation`.
- [x] Re-run focused runtime tests and confirm they pass.

### Task 21: Runtime Response Envelope Standardization

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-runtime-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-runtime-rust/tests/domain_service_contracts_standard.rs`

- [x] Write failing tests for success, replay, capability error, unknown operation, and service/storage error runtime operation envelopes.
- [x] Run focused runtime tests and confirm failure.
- [x] Implement `CommerceRuntimeOperationEnvelope`, `CommerceRuntimeOperationErrorEnvelope`, and `execute_runtime_operation_enveloped`.
- [x] Re-run focused runtime tests and confirm they pass.

### Task 22: Transport Response Envelope Metadata

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-http-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-http-rust/tests/commerce_http_standard.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-tauri-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-tauri-rust/tests/commerce_tauri_standard.rs`

- [x] Write failing tests requiring HTTP routes and Tauri command bindings to expose the shared runtime operation envelope contract.
- [x] Run focused HTTP/Tauri tests and confirm failure.
- [x] Implement transport envelope metadata derived from the runtime standard envelope.
- [x] Re-run focused HTTP/Tauri tests and confirm they pass.

### Task 23: Storage Idempotency Repository SQL Contract

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/tests/commerce_storage_standard.rs`

- [x] Write failing tests for the SQLx idempotency repository contract: table, columns, unique key, find/lock/complete/fail SQL, and conflict classification.
- [x] Run focused storage tests and confirm failure.
- [x] Implement reusable storage-side idempotency SQL contract metadata.
- [x] Re-run focused storage tests and confirm they pass.

### Task 24: Storage Transaction Boundary SQL Contract

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/tests/commerce_storage_standard.rs`

- [x] Write failing tests for the SQLx transaction boundary contract: begin, commit, rollback, scope naming, and transactional repository coverage.
- [x] Run focused storage tests and confirm failure.
- [x] Implement reusable storage-side transaction boundary metadata for the runtime transaction manager port.
- [x] Re-run focused storage tests and confirm they pass.

### Task 25: Business Repository SQL Operation Catalog

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/tests/commerce_storage_standard.rs`

- [x] Write failing tests requiring every first-slice business repository to expose a standard SQL operation catalog with read/write operation names, target tables, transaction requirement, and tenant scoping.
- [x] Run focused storage tests and confirm failure.
- [x] Implement reusable storage-side SQL operation catalog metadata for account, promotion, order, payment, membership, and invoice repositories.
- [x] Re-run focused storage tests and confirm they pass.

### Task 26: Storage Capability Manifest

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/tests/commerce_storage_standard.rs`

- [x] Write failing tests for a single storage capability manifest that exposes schema, migrations, repository bindings, idempotency SQL contract, transaction boundary contract, and business repository SQL catalogs.
- [x] Run focused storage tests and confirm failure.
- [x] Implement `commerce_storage_capability_manifest` as the reusable storage composition entrypoint.
- [x] Re-run focused storage tests and confirm they pass.

### Task 27: Transport Runtime Input Binding Metadata

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-http-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-http-rust/tests/commerce_http_standard.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-tauri-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-tauri-rust/tests/commerce_tauri_standard.rs`

- [x] Write failing tests requiring HTTP routes and Tauri command bindings to expose how transport requests map into `CommerceRuntimeOperationInput`.
- [x] Run focused HTTP/Tauri tests and confirm failure.
- [x] Implement runtime input binding metadata for context, operation id, body JSON, capability flags, idempotency key, and request hash.
- [x] Re-run focused HTTP/Tauri tests and confirm they pass.

### Task 28: Runtime Capability Manifest

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-runtime-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-runtime-rust/tests/runtime_standard.rs`

- [x] Write failing tests for a single runtime capability manifest that exposes service names, capability flags, service contracts, operation contracts, service bindings, and envelope/input standard names.
- [x] Run focused runtime tests and confirm failure.
- [x] Implement `commerce_runtime_capability_manifest` as the reusable runtime composition entrypoint.
- [x] Re-run focused runtime tests and confirm they pass.

### Task 29: Local Private Bootstrap Manifest Crate

**Files:**
- Create: `packages/native-rust/commerce/sdkwork-commerce-bootstrap-rust/Cargo.toml`
- Create: `packages/native-rust/commerce/sdkwork-commerce-bootstrap-rust/src/lib.rs`
- Create: `packages/native-rust/commerce/sdkwork-commerce-bootstrap-rust/tests/commerce_bootstrap_standard.rs`
- Modify: `packages/native-rust/commerce/README.md`

- [x] Write failing tests for a single bootstrap manifest that composes runtime, storage, HTTP, and Tauri manifests for local/private host startup.
- [x] Run focused bootstrap tests and confirm failure.
- [x] Implement the bootstrap crate as a thin composition layer with no business logic.
- [x] Re-run focused bootstrap tests and confirm they pass.
- [x] Update commerce README so the documented crate list matches the first-slice package structure.

### Task 30: Bootstrap Manifest Validation

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-bootstrap-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-bootstrap-rust/tests/commerce_bootstrap_standard.rs`

- [x] Write failing tests for cross-layer bootstrap contract validation across runtime, storage, HTTP, and Tauri manifests.
- [x] Run focused bootstrap tests and confirm failure.
- [x] Implement bootstrap-local validation errors and manifest validation without adding business logic to the composition crate.
- [x] Re-run focused bootstrap tests and confirm they pass.

### Task 31: Bootstrap Host Preflight Contract

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-bootstrap-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-bootstrap-rust/tests/commerce_bootstrap_standard.rs`

- [x] Write failing tests for a local/private host startup preflight result that validates the manifest and exposes runtime, storage, HTTP, and Tauri startup summary counts.
- [x] Run focused bootstrap tests and confirm failure.
- [x] Implement bootstrap preflight as a thin host-facing guard over `CommerceLocalPrivateBootstrapManifest::validate`.
- [x] Re-run focused bootstrap tests and confirm they pass.

### Task 32: Bootstrap Host Startup Stage Contract

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-bootstrap-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-bootstrap-rust/tests/commerce_bootstrap_standard.rs`
- Modify: `packages/native-rust/commerce/README.md`

- [x] Write failing tests for host startup stages that declare validation, storage, runtime, HTTP, and Tauri initialization order and dependencies.
- [x] Run focused bootstrap tests and confirm failure.
- [x] Implement startup stage metadata as a host-facing contract without running infrastructure side effects.
- [x] Re-run focused bootstrap tests and confirm they pass.
- [x] Update the commerce README to document bootstrap validation and preflight responsibilities.

### Task 33: Bootstrap Startup Stage Dependency Validation

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-bootstrap-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-bootstrap-rust/tests/commerce_bootstrap_standard.rs`

- [x] Write failing tests requiring startup stages to reject duplicate stage names, missing dependencies, and dependencies declared after the dependent stage.
- [x] Run focused bootstrap tests and confirm failure.
- [x] Implement startup stage dependency validation as part of `CommerceLocalPrivateBootstrapManifest::validate`.
- [x] Re-run focused bootstrap tests and confirm they pass.

### Task 34: Bootstrap Host Requirements Manifest

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-bootstrap-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-bootstrap-rust/tests/commerce_bootstrap_standard.rs`
- Modify: `packages/native-rust/commerce/README.md`

- [x] Write failing tests for host requirements that declare database, migration, idempotency store, transaction manager, service registry, authenticated context, HTTP binding, and Tauri binding responsibilities.
- [x] Run focused bootstrap tests and confirm failure.
- [x] Implement host requirements metadata and validate that startup stages reference declared host responsibilities.
- [x] Re-run focused bootstrap tests and confirm they pass.
- [x] Update the commerce README to document host-provided requirements.

### Task 35: Bootstrap Host Requirement Coverage Validation

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-bootstrap-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-bootstrap-rust/tests/commerce_bootstrap_standard.rs`

- [x] Write failing tests requiring host requirements to have unique names, include every standard host requirement, and cover every non-validation startup stage.
- [x] Run focused bootstrap tests and confirm failure.
- [x] Implement host requirement coverage validation as part of `CommerceLocalPrivateBootstrapManifest::validate`.
- [x] Re-run focused bootstrap tests and confirm they pass.

### Task 36: Bootstrap Preflight Requirement Stage Index

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-bootstrap-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-bootstrap-rust/tests/commerce_bootstrap_standard.rs`

- [x] Write failing tests requiring preflight output to expose host requirements grouped by startup stage in stage order.
- [x] Run focused bootstrap tests and confirm failure.
- [x] Implement requirement-by-stage metadata derived from validated startup stages and host requirements.
- [x] Re-run focused bootstrap tests and confirm they pass.

### Task 37: Storage Migration Plan Contract

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/tests/commerce_storage_standard.rs`

- [x] Write failing tests for a host-consumable storage migration plan that exposes migration order, names, domain, SQL source, SQL text, and checksum.
- [x] Run focused storage tests and confirm failure.
- [x] Implement migration plan metadata and expose it through `CommerceStorageCapabilityManifest`.
- [x] Re-run focused storage tests and confirm they pass.

### Task 38: Storage Migration Plan Validation

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/tests/commerce_storage_standard.rs`

- [x] Write failing tests requiring migration plan validation to reject sequence drift, name drift, checksum drift, missing SQL, and missing required table coverage.
- [x] Run focused storage tests and confirm failure.
- [x] Implement structured migration plan validation errors for host migration-runner preflight checks.
- [x] Re-run focused storage tests and confirm they pass.

### Task 39: Bootstrap Storage Migration Plan Validation

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-bootstrap-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-bootstrap-rust/tests/commerce_bootstrap_standard.rs`

- [x] Write failing tests requiring bootstrap validation to reject an invalid storage migration plan.
- [x] Run focused bootstrap tests and confirm the new migration-plan test fails.
- [x] Wire storage migration plan validation into the bootstrap storage contract guard.
- [x] Re-run focused bootstrap tests and confirm they pass.

### Task 40: Storage Migration Runner SQL Contract

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/tests/commerce_storage_standard.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-bootstrap-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-bootstrap-rust/tests/commerce_bootstrap_standard.rs`
- Modify: `packages/native-rust/commerce/README.md`

- [x] Write failing tests for a host-consumable migration runner SQL contract.
- [x] Run focused storage tests and confirm the new contract API is missing.
- [x] Implement the migration runner schema-version table, read-applied, insert-applied, conflict classifier, migration plan binding, and transaction manager binding metadata.
- [x] Re-run focused and full storage tests and confirm they pass.
- [x] Write failing bootstrap tests requiring the host migration-runner requirement and bootstrap validation to use the new contract.
- [x] Implement bootstrap host requirement and cross-storage migration runner validation.
- [x] Re-run focused and full bootstrap tests and confirm they pass.

### Task 41: Storage Migration Runner Contract Validation

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/tests/commerce_storage_standard.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-bootstrap-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-bootstrap-rust/tests/commerce_bootstrap_standard.rs`

- [x] Write failing tests for a structured migration runner SQL contract validator.
- [x] Run focused storage tests and confirm the validator API is missing.
- [x] Implement validation for runner name, schema-version table, columns, unique key, transaction requirement, SQL statements, conflict classifier, migration sequence, transaction boundary manager, and migration plan.
- [x] Re-run focused storage tests and confirm they pass.
- [x] Write a failing bootstrap test requiring invalid runner contracts to fail bootstrap validation.
- [x] Wire the storage runner validator into bootstrap validation.
- [x] Re-run full storage and bootstrap tests and confirm they pass.

### Task 42: Storage Migration Runner Applied-State Preflight

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/tests/commerce_storage_standard.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-bootstrap-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-bootstrap-rust/tests/commerce_bootstrap_standard.rs`
- Modify: `packages/native-rust/commerce/README.md`

- [x] Write failing tests for migration runner preflight over applied migration records.
- [x] Run focused storage tests and confirm the preflight API is missing.
- [x] Implement applied migration records, pending migration summary, and structured preflight errors.
- [x] Re-run focused and full storage tests and confirm they pass.
- [x] Write a failing bootstrap preflight test requiring storage pending migration summary.
- [x] Wire migration runner preflight summary into bootstrap preflight.
- [x] Re-run full bootstrap tests and confirm they pass.

### Task 43: Storage Migration Runner Execution Plan Contract

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/tests/commerce_storage_standard.rs`

- [x] Write failing tests for a host-consumable migration runner execution plan.
- [x] Run focused storage tests and confirm the execution plan API is missing.
- [x] Implement ordered execution steps for schema table creation, applied migration read, pending migration SQL application, and applied migration recording.
- [x] Re-run focused and full storage tests and confirm they pass.

### Task 44: Bootstrap Migration Execution Plan Summary

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-bootstrap-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-bootstrap-rust/tests/commerce_bootstrap_standard.rs`
- Modify: `packages/native-rust/commerce/README.md`

- [x] Write a failing bootstrap preflight test requiring migration execution step summary.
- [x] Wire storage migration runner execution plan summary into bootstrap preflight.
- [x] Re-run focused and full bootstrap tests and confirm they pass.

### Task 45: Storage Migration Execution Plan Validation

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/tests/commerce_storage_standard.rs`

- [x] Write failing tests for a structured migration execution plan validator.
- [x] Run focused storage tests and confirm the validator API is missing.
- [x] Implement validation for execution plan metadata, step count, step order, SQL statements, migration references, and transaction flags.
- [x] Re-run focused and full storage tests and confirm they pass.

### Task 46: Bootstrap Migration Execution Plan Contract Declaration

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-bootstrap-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-bootstrap-rust/tests/commerce_bootstrap_standard.rs`
- Modify: `packages/native-rust/commerce/README.md`

- [x] Replace a weak bootstrap summary test with failing tests requiring startup stage and host requirement declarations for `CommerceMigrationRunnerExecutionPlan`.
- [x] Add `CommerceMigrationRunnerExecutionPlan` to the storage startup stage and migration-runner host requirement contracts.
- [x] Wire execution plan validation into bootstrap preflight after plan construction.
- [x] Re-run focused and full bootstrap tests and confirm they pass.

### Task 47: Storage Migration Execution Result Contract

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/tests/commerce_storage_standard.rs`

- [x] Write failing tests for migration execution result construction and validation.
- [x] Run focused storage tests and confirm execution result APIs are missing.
- [x] Implement execution step result, execution result summary, applied records, and structured result validation errors.
- [x] Re-run focused and full storage tests and confirm they pass.

### Task 48: Bootstrap Migration Execution Result Contract Declaration

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-bootstrap-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-bootstrap-rust/tests/commerce_bootstrap_standard.rs`
- Modify: `packages/native-rust/commerce/README.md`

- [x] Write failing bootstrap tests requiring startup stage and host requirement declarations for `CommerceMigrationRunnerExecutionResult`.
- [x] Add `CommerceMigrationRunnerExecutionResult` to the storage startup stage and migration-runner host requirement contracts.
- [x] Re-run focused and full bootstrap tests and confirm they pass.

### Task 49: Storage Migration Execution Final State Reconciliation

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/tests/commerce_storage_standard.rs`

- [x] Write failing tests for migration execution final state construction after an empty database execution.
- [x] Write failing tests for appending pending migration records after a valid prefix applied state.
- [x] Write failing tests rejecting execution results that do not match the initial applied state.
- [x] Write failing tests rejecting duplicate or drifted final applied migration records.
- [x] Implement `CommerceMigrationRunnerFinalState`, final-state construction, and final-state validation over preflight plus execution result validation.
- [x] Re-run focused storage tests and confirm they pass.

### Task 50: Bootstrap Migration Final State Contract Declaration

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-bootstrap-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-bootstrap-rust/tests/commerce_bootstrap_standard.rs`
- Modify: `packages/native-rust/commerce/README.md`

- [x] Write failing bootstrap tests requiring preflight to expose migration final applied count, final pending count, and schema-current status after migrations.
- [x] Write failing bootstrap tests requiring startup stage and host requirement declarations for `CommerceMigrationRunnerFinalState`.
- [x] Add `CommerceMigrationRunnerFinalState` to the storage startup stage and migration-runner host requirement contracts.
- [x] Wire storage migration final-state construction and validation into bootstrap preflight.
- [x] Re-run focused bootstrap tests and confirm they pass.

### Task 51: Storage Migration Failure Recovery Contract

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/tests/commerce_storage_standard.rs`

- [x] Write failing tests for constructing a failed migration execution result that stops at the failed step.
- [x] Write failing tests requiring recovery to resume from the failed migration when no migration was safely recorded.
- [x] Write failing tests requiring recovery to preserve already recorded migration prefixes.
- [x] Write failing tests rejecting continued execution after the first failed step.
- [x] Write failing tests rejecting records for migrations whose failed step was not safely recorded.
- [x] Implement `CommerceMigrationRunnerFailureRecovery`, failed-result construction, and recovery validation over the standard execution plan and migration preflight.
- [x] Re-run focused storage tests and confirm they pass.

### Task 52: Bootstrap Migration Failure Recovery Contract Declaration

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-bootstrap-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-bootstrap-rust/tests/commerce_bootstrap_standard.rs`
- Modify: `packages/native-rust/commerce/README.md`

- [x] Write failing bootstrap tests requiring preflight to expose migration failure recovery resume migration, pending count, and rollback requirement.
- [x] Write failing bootstrap tests requiring startup stage and host requirement declarations for `CommerceMigrationRunnerFailureRecovery`.
- [x] Add `CommerceMigrationRunnerFailureRecovery` to the storage startup stage and migration-runner host requirement contracts.
- [x] Wire storage migration failure recovery construction and validation into bootstrap preflight.
- [x] Re-run focused bootstrap tests and confirm they pass.

### Task 53: Storage Migration Runner Exclusive Lock Contract

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/tests/commerce_storage_standard.rs`

- [x] Write failing tests requiring the migration runner SQL contract to expose a lock table, lock columns, unique key, acquire, heartbeat, and release operations.
- [x] Write failing tests requiring execution plans to acquire the migration lock before schema/applied reads and release it after execution.
- [x] Update successful and failed execution result tests to account for the lock guard steps.
- [x] Implement migration runner lock SQL metadata and wire lock steps into the standard execution plan.
- [x] Re-run focused storage tests and confirm they pass.

### Task 54: Bootstrap Migration Lock Contract Declaration

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-bootstrap-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-bootstrap-rust/tests/commerce_bootstrap_standard.rs`
- Modify: `packages/native-rust/commerce/README.md`

- [x] Write failing bootstrap tests requiring preflight to expose the migration lock table and lock owner binding.
- [x] Write failing bootstrap tests requiring startup stage and host requirement declarations for `CommerceMigrationRunnerLockContract`.
- [x] Add `CommerceMigrationRunnerLockContract` to the storage startup stage and migration-runner host requirement contracts.
- [x] Wire migration lock summary into bootstrap preflight.
- [x] Re-run focused bootstrap tests and confirm they pass.

### Task 55: Storage Migration Lock Lifecycle Contract

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/tests/commerce_storage_standard.rs`

- [x] Write failing tests for fresh lock acquisition, same-owner renewal, active other-owner blocking, expired lock stealing, and mismatched runner rejection.
- [x] Write failing tests for a host-consumable migration lock lifecycle summary and validator.
- [x] Implement lock record, acquire outcome, lifecycle summary, and structured lock validation errors without adding external time dependencies.
- [x] Re-run focused storage tests and confirm they pass.

### Task 56: Bootstrap Migration Lock Lifecycle Contract Declaration

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-bootstrap-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-bootstrap-rust/tests/commerce_bootstrap_standard.rs`
- Modify: `packages/native-rust/commerce/README.md`

- [x] Write failing bootstrap tests requiring preflight to expose migration lock lifecycle statuses and run permissions.
- [x] Write failing bootstrap tests requiring startup stage and host requirement declarations for `CommerceMigrationRunnerLockLifecycle`.
- [x] Add `CommerceMigrationRunnerLockLifecycle` to the storage startup stage and migration-runner host requirement contracts.
- [x] Wire storage migration lock lifecycle validation and summary into bootstrap preflight.
- [x] Re-run focused bootstrap tests and confirm they pass.

### Task 57: Storage Migration Lock Cleanup Contract

**Files:**
- Modify: `packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/tests/commerce_storage_standard.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-bootstrap-rust/src/lib.rs`
- Modify: `packages/native-rust/commerce/sdkwork-commerce-bootstrap-rust/tests/commerce_bootstrap_standard.rs`
- Modify: `packages/native-rust/commerce/README.md`

- [x] Write failing storage tests requiring failure recovery to require lock release after an acquired lock and skip release before lock acquisition.
- [x] Write failing storage tests for a host-consumable `CommerceMigrationRunnerLockCleanup` contract and validator.
- [x] Implement lock cleanup metadata, recovery release flags, owner requirement, and release operation binding.
- [x] Write failing bootstrap tests requiring lock cleanup preflight fields and startup/host requirement declarations.
- [x] Add `CommerceMigrationRunnerLockCleanup` to the storage startup stage and migration-runner host requirement contracts.
- [x] Wire storage migration lock cleanup validation and summary into bootstrap preflight.
- [x] Re-run focused storage and bootstrap tests and confirm they pass.
