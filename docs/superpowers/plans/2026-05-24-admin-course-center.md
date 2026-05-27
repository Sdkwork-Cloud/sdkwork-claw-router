# Admin Course Center Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an independent admin Course Center that manages course catalog, sections, lessons, relations, applications, comments, and engagement through standard backend contracts and generated SDKs.

**Architecture:** Course Center is a first-class admin module with its own portal package, backend management API, store ports, SQLite/Postgres persistence, OpenAPI contract, generated backend SDK surface, admin header entry, and sidebar groups. The first phase uses existing course tables (`content_course`, `content_course_section`, `content_course_lesson`, `content_course_relation`, `content_course_application`, `content_reaction`, `content_forum_comment`) and stores advanced operation metadata in existing `metadata` columns instead of adding tables.

**Tech Stack:** Rust/Axum/sqlx for backend APIs and persistence, TypeScript/React/Vite for admin UI, generated `@sdkwork/clawrouter-backend-sdk` for management-surface frontend calls, schema registry contract generation, Vitest/static runtime tests, cargo tests.

---

### Task 1: Pin Admin Course Center Behavior With Tests

**Files:**
- Create: `apps/sdkwork-claw-router-portal/admin-course-runtime.test.ts`
- Modify: `tests/test_admin_course_runtime_standard.py`
- Test: `apps/sdkwork-claw-router-portal/admin-course-runtime.test.ts`
- Test: `tests/test_admin_course_runtime_standard.py`

- [ ] Write tests requiring an independent `sdkwork-claw-router-admin-courses` package, `CourseAdmin` export, `/admin/courses/*` routes, `courseCenter` admin header module, sidebar menu labels, and backend contract paths.
- [ ] Run the new tests and verify they fail because the module does not exist yet.

### Task 2: Add Backend Admin Course API

**Files:**
- Create: `services/sdkwork-claw-product/src/api/admin_course.rs`
- Create: `services/sdkwork-claw-product/src/ports/admin_course_store.rs`
- Create: `services/sdkwork-claw-product/src/infrastructure/sql/sqlite/admin_course_store.rs`
- Create: `services/sdkwork-claw-product/src/infrastructure/sql/postgres/admin_course_store.rs`
- Modify: `services/sdkwork-claw-product/src/api/mod.rs`
- Modify: `services/sdkwork-claw-product/src/ports/mod.rs`
- Modify: `services/sdkwork-claw-product/src/infrastructure/sql/sqlite/mod.rs`
- Modify: `services/sdkwork-claw-product/src/infrastructure/sql/postgres/mod.rs`
- Modify: `services/sdkwork-claw-admin-api/src/lib.rs`
- Test: `services/sdkwork-claw-product/tests/sqlite_admin_course_store.rs`
- Test: `services/sdkwork-claw-product/tests/admin_course_api.rs`

- [ ] Write failing store/API tests for listing dashboard metrics, courses, sections, lessons, relations, applications, comments, and engagement summaries.
- [ ] Implement admin course port types and command/query contracts.
- [ ] Implement SQLite/Postgres stores using existing course tables with tenant/organization scoping and soft-delete filtering.
- [ ] Implement Axum routes under `/backend/v3/api/content/courses` and sibling course resource paths.
- [ ] Mount the router in the admin runtime for SQLite and Postgres.

### Task 3: Register Contract And Regenerate Backend SDK

**Files:**
- Modify: `docs/schema-registry/frontend-field-contracts/index.yaml`
- Create or Modify: `docs/schema-registry/frontend-field-contracts/models/admin-courses.yaml`
- Modify: `docs/schema-registry/frontend-field-contracts/operations/backend-content.yaml`
- Modify: `docs/schema-registry/frontend-field-contracts/routes/routes.yaml`
- Generated: `generated/api/api-contract-manifest.json`
- Generated: `generated/openapi/clawrouter-backend-openapi.json`
- Generated: `sdks/clawrouter-backend-sdk/clawrouter-backend-sdk-typescript/**`

- [ ] Add backend content operations for course dashboard, courses, sections, lessons, relations, applications, comments, and engagement.
- [ ] Run `python -B -m tools.api_contract_manifest`.
- [ ] Run `python -B -m tools.clawrouter_openapi_generator`.
- [ ] Run `node sdks\clawrouter-backend-sdk\bin\generate-sdk.mjs --language typescript`.
- [ ] Run `python -B -m tools.clawrouter_sdk_guardian`.

### Task 4: Add Independent Admin Courses Package

**Files:**
- Create: `apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-courses/package.json`
- Create: `apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-courses/tsconfig.json`
- Create: `apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-courses/src/courseAdminService.ts`
- Create: `apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-courses/src/courseAdminTypes.ts`
- Create: `apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-courses/src/index.tsx`
- Modify: `apps/sdkwork-claw-router-portal/package.json`

- [ ] Implement a backend SDK boundary that imports only from `sdkwork-claw-router-commons/runtime` and `@sdkwork/clawrouter-backend-sdk`.
- [ ] Implement `CourseAdmin` with tabs for dashboard, catalog, sections, lessons, relations, applications, comments, and engagement.
- [ ] Use existing admin shell components and avoid raw fetch or local SDK forks.

### Task 5: Wire Admin Navigation And I18n

**Files:**
- Modify: `apps/sdkwork-claw-router-portal/src/App.tsx`
- Modify: `apps/sdkwork-claw-router-portal/src/AdminHeader.tsx`
- Modify: `apps/sdkwork-claw-router-portal/src/AdminLayout.tsx`
- Modify: `apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-i18n/src/index.ts`

- [ ] Add lazy route import for `sdkwork-claw-router-admin-courses`.
- [ ] Add `/admin/courses` routes and default redirect.
- [ ] Add `courseCenter` module to `AdminHeader`.
- [ ] Add Course Center sidebar groups and items to `AdminLayout`.
- [ ] Add English and Chinese i18n labels.

### Task 6: Verification And Cleanup

**Files:**
- All touched files.

- [ ] Run `pnpm --dir apps/sdkwork-claw-router-portal typecheck`.
- [ ] Run `pnpm --dir apps/sdkwork-claw-router-portal exec vitest run admin-course-runtime.test.ts`.
- [ ] Run `python -B -m pytest tests/test_admin_course_runtime_standard.py`.
- [ ] Run targeted Rust tests for admin course store/API.
- [ ] Run `python -B -m tools.schema_quality_gate`.
- [ ] Review `git diff` and ensure no unrelated user changes were reverted.
