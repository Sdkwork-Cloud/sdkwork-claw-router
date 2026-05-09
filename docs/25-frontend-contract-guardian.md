# Frontend Contract Guardian

`tools.frontend_contract_guardian` keeps the database design aligned with the actual
`apps/sdkwork-claw-router-portal` application instead of relying on a manual checklist.

## Scope

- Parse `apps/sdkwork-claw-router-portal/src/App.tsx` and extract the public, console, and admin routes that are actually mounted by React Router.
- Compare every actual route with `generated/schema/manifest/schema-manifest.json`.
- Validate `docs/schema-registry/frontend-field-contracts.yaml`, which declares the route-level tables and page-critical columns required by the portal service/interface/mock data.
- Run `tools.frontend_field_audit` against portal service/data/type files, extract exported TypeScript data interfaces, and require every interface to be registered with exact fields.
- Require every registered frontend model to declare `data_sources`, and verify those tables are also present in that route's `required_tables`.
- Run `tools.frontend_operation_audit` against portal service files, extract exported service operations, and require every read/write action to declare route, operation kind, read sources, and write tables.
- Require every write operation (`create`, `update`, `delete`, `action`, `sync`) to declare `write_tables`, and verify those write tables are present in the route-level table contract.
- Require every frontend service operation to declare an API contract: `api_surface`, `api_method`, and `api_path`.
- Enforce Java-compatible path surfaces: app/console/public operations must use `/app/v3/api/**`, admin operations must use `/backend/v3/api/**`, and OpenAI runtime compatibility is reserved for `/v1/**`.
- Enforce method semantics by operation kind. App reads use `GET`; backend reads may use `GET` or the Java backend standard `POST /list` style; creates/actions/syncs use `POST`; updates use `PUT` or `PATCH`; deletes use `DELETE`.
- Accept Java-owned legacy physical columns through `physical_columns.own`, while keeping those tables out of generated DDL.

## Current Gaps Closed

- `/console/account` now depends on `ai_usage_fact` for monthly consumption and service consumption breakdowns.
- `/admin/ratelimit` now depends on `iam_gateway_api_key` and `iam_gateway_api_key_group` for token limit and group rule displays.
- `/admin/marketing` now depends on `plus_user` for inviter/user display, `ops_coupon_issue_batch` for promo-code batch generation metadata, and `ops_referral_stat_snapshot` for high-performance referral statistics.
- AppCenter and SkillsHub now share `studio_catalog_asset` and `studio_catalog_artifact` for screenshots, release artifacts, package sizes, frameworks, and image/artifact references while preserving `plus_app`, `plus_agent_skill`, `plus_agent_skill_package`, and `plus_category` as the source-of-truth domain tables.
- Frontend field audit now covers 54 data interfaces from 31 portal service/data/type files and records the `route` plus `data_sources` in `generated/schema/frontend/frontend-field-audit.json`.
- `/courses` now includes `content_course_relation`, because the actual `Course` frontend model exposes `relatedCourseIds` on the list data model.
- Frontend operation audit now covers 76 service operations from 25 portal service files, including 30 mutating operations, and records read/write table mappings in `generated/schema/frontend/frontend-operation-audit.json`.
- Frontend operation audit now also records `api_surface`, `api_method`, and `api_path` for all 76 operations so the portal can switch between Claw Router Rust services and Java `spring-ai-plus-app-api`/`spring-ai-plus-backend-api` compatible paths without changing UI modules.
- AppCenter operations are mapped to the Java `PlusApp` app-store contract (`/app/v3/api/app/store/**`), and SkillsHub operations are mapped to the Java AgentSkills contract (`/app/v3/api/skills/**`) with category reads kept under the Java category-backed surfaces.
- `/console/recharge` now includes `plus_order`, `plus_order_item`, and `plus_payment` because `submitRecharge` creates a trade/payment workflow, not only a recharge pack selection.
- `/console/billing` now includes `plus_account_history` because coupon redemption changes account balance and must leave a Java-compatible account ledger entry.
- `/console/routing` now includes `iam_gateway_api_key` because the routing console service fetches API keys for route/key context.
- `/admin/model` now includes `ai_model_capability`, `ai_pricing_import_snapshot`, and `ops_audit_log` for model sync and admin model mutations.
- Admin write surfaces for channel, group, marketing, ratelimit, user, model, and announcement now include `ops_audit_log` where the actual service exposes mutating operations.

## Commands

```bash
python -B -m tools.frontend_contract_guardian
python -B -m tools.frontend_field_audit --check
python -B -m tools.frontend_operation_audit --check
python -B -m tools.schema_quality_gate
```

`tools.schema_quality_gate` runs this guardian after Schema Guardian, DDL freshness,
domain type freshness, schema manifest freshness, OpenAPI component freshness, Java legacy audit freshness, frontend field audit freshness, and frontend operation audit freshness.
