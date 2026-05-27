# SDKWork Appbase App Template Storage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the SDKWork appbase `studio` Rust storage contract for app templates, including migration SQL, table catalogs, manifest metadata, capability catalog registration, and tests.

**Architecture:** Introduce a focused `sdkwork-studio-storage-sqlx-rust` package under `packages/native-rust/studio`. Keep the first slice database-contract only: app template tables are new, shared `studio_catalog_*` tables remain compatible with ClawRouter and are reused for assets, artifacts, and actions.

**Tech Stack:** Rust 2021 library crate, Cargo tests, SQL migration files, YAML capability catalog, Node structure review.

---

### Task 1: Create Failing Studio Storage Standard Tests

**Files:**
- Create: `packages/native-rust/studio/sdkwork-studio-storage-sqlx-rust/Cargo.toml`
- Create: `packages/native-rust/studio/sdkwork-studio-storage-sqlx-rust/src/lib.rs`
- Create: `packages/native-rust/studio/sdkwork-studio-storage-sqlx-rust/tests/studio_storage_standard.rs`

- [ ] **Step 1: Add crate shell and standard tests**

Write tests that require:

- `studio_database_tables()`
- `studio_shared_catalog_tables()`
- `studio_app_template_tables()`
- `studio_initial_migration_sql()`
- `studio_storage_capability_manifest()`
- constants for `STUDIO_TARGET_TYPE_APP = 15` and `STUDIO_TARGET_TYPE_APP_TEMPLATE = 16`

- [ ] **Step 2: Run test and verify RED**

Run:

```powershell
cargo test --manifest-path sdkwork-appbase/packages/native-rust/studio/sdkwork-studio-storage-sqlx-rust/Cargo.toml
```

Expected: FAIL because the crate does not expose the required APIs or SQL yet.

### Task 2: Implement Studio Storage Catalog And Migration

**Files:**
- Create: `packages/native-rust/studio/sdkwork-studio-storage-sqlx-rust/migrations/0001_studio_catalog.sql`
- Create: `packages/native-rust/studio/sdkwork-studio-storage-sqlx-rust/migrations/0002_studio_app_template.sql`
- Modify: `packages/native-rust/studio/sdkwork-studio-storage-sqlx-rust/src/lib.rs`
- Modify: `packages/native-rust/studio/sdkwork-studio-storage-sqlx-rust/tests/studio_storage_standard.rs`

- [ ] **Step 1: Implement catalog table definitions**

Add compatible SQL for:

- `studio_catalog_action`
- `studio_catalog_asset`
- `studio_catalog_artifact`

- [ ] **Step 2: Implement app template table definitions**

Add SQL for:

- `studio_app_template`
- `studio_app_template_version`
- `studio_app_template_usage`

- [ ] **Step 3: Implement Rust catalog and manifest APIs**

Expose table lists, migration names, included SQL, repository bindings, and catalog target type constants.

- [ ] **Step 4: Run test and verify GREEN**

Run:

```powershell
cargo test --manifest-path sdkwork-appbase/packages/native-rust/studio/sdkwork-studio-storage-sqlx-rust/Cargo.toml
```

Expected: PASS.

### Task 3: Register Studio Capability And Structure Catalog

**Files:**
- Modify: `sdkwork-appbase/specs/appbase-capabilities.yaml`
- Modify: `sdkwork-appbase/scripts/package-catalog.mjs`

- [ ] **Step 1: Add `studio` capability catalog entry**

Register the storage package with a storage quality gate:

```text
cargo test --manifest-path packages/native-rust/studio/sdkwork-studio-storage-sqlx-rust/Cargo.toml
```

- [ ] **Step 2: Add native-rust studio package to structure catalog**

Register `sdkwork-studio-storage-sqlx-rust` under `native-rust/studio`.

- [ ] **Step 3: Run structure review**

Run:

```powershell
pnpm.cmd --dir sdkwork-appbase list:packages
```

Expected: command exits successfully and includes native-rust package counts.

### Task 4: Final Verification

**Files:**
- All files above

- [ ] **Step 1: Run focused cargo test**

Run:

```powershell
cargo test --manifest-path sdkwork-appbase/packages/native-rust/studio/sdkwork-studio-storage-sqlx-rust/Cargo.toml
```

Expected: PASS.

- [ ] **Step 2: Run appbase structure summary**

Run:

```powershell
pnpm.cmd --dir sdkwork-appbase list:packages
```

Expected: PASS.

- [ ] **Step 3: Inspect changed files**

Run:

```powershell
git -C sdkwork-appbase status --short
```

Expected: only intended app-template storage files plus previously created spec/plan changes are relevant to this task.
