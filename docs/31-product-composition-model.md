# Product Composition Model

> Version: 1.0  
> Date: 2026-06-20  
> Status: **active** — supersedes App Center ownership in `30-platform-data-model-v4.md`

## 1. Principle

`sdkwork-clawrouter` is the AI gateway and product shell. It **composes** bounded contexts; it does not duplicate their database contracts or business logic.

| Capability | System of record | Table prefix | Repository |
| --- | --- | --- | --- |
| Application center / marketplace | `sdkwork-appstore` | `appstore_` | `../sdkwork-appstore` |
| IAM | `sdkwork-appbase` | `iam_` | `../sdkwork-appbase` |
| Commerce base | `sdkwork-commerce` | `commerce_` (base) | `../sdkwork-commerce` |
| AI model catalog (vendors, models, pricing evidence, rankings) | `sdkwork-models` | `ai_model_*` (catalog tables) | `../sdkwork-models` |
| AI gateway / skills / routing | `sdkwork-clawrouter` | `ai_` (runtime), `ops_`, … | this repo |

## 2. Database lifecycle

`database/database.manifest.json` declares module dependencies for appbase, commerce, appstore, and sdkwork-models. Claw-router bootstrap applies only those imported baselines plus claw-router generated schema (`ai_*` runtime tables, …).

Bootstrap order in claw-router:

1. appbase-iam  
2. commerce-core  
3. appstore  
4. sdkwork-models (catalog dictionary via `sdkwork-models-database-bootstrap`)  
5. claw-router generated schema (`ai_*` runtime tables, …)

Claw-router Schema Registry entries for imported domains use `generated_by_this_project: false`, `imported: true`, and the correct `write_owner`. Owner registries live in sibling modules:

- `../sdkwork-appbase/docs/schema-registry/appbase-iam.tables.yaml` — IAM verification tables
- `../sdkwork-appbase/docs/schema-registry/appbase-messaging.tables.yaml` — external SMS/email delivery tables
- `../sdkwork-models/docs/schema-registry/sdkwork-models.tables.yaml` — model catalog dictionary tables

Assembly registry declares explicit `registry_dependencies` and generates only claw-router-owned DDL (`generated/schema/postgres/schema.sql`). Imported DDL is applied from composed sibling modules through their bootstrap crates (for example `commerce_initial_migration_sql()` and `models_catalog_foundation_migration_sql()`), not by embedding sibling `database/ddl` paths in claw-router.

## 3. Retired in claw-router

Do not add or regenerate DDL for:

- `platform_*` (fully replaced by `appstore_*`, including `appstore_app_template*`)
- Core `iam_*` from appbase (OAuth subset still applied via appbase migrations)

`0002_clawrouter_legacy_projection.sql` is retired (empty stub). Composed-module DDL for appstore comes from sibling baselines.

`c_category` remains for skill/agent/MCP classification until those domains are extracted.

## 4. API and frontend

- App center UI and APIs consume `sdkwork-appstore-*-sdk` and appstore route crates.
- Admin OAuth (`/admin/oauth/*`) is owned by `sdkwork-appbase` IAM: `dependency_owned` routes use `sdkwork-appbase-backend-sdk`, `iam_oauth_resource_account`, and backend operation contracts in `operations/backend-iam-oauth.yaml`; UI lives in `sdkwork-clawrouter-pc-admin-oauth`.
- Claw-router OpenAPI must not duplicate appstore/appbase IAM operations; declare them in `specs/dependency-api-surfaces.json`.
- Schema registry composition follows `../sdkwork-specs/SCHEMA_REGISTRY_SPEC.md` and the canonical composer in `../sdkwork-web-framework` (`sdkwork-web-schema-registry`, `tools/schema_registry/`). Assembly registries declare owned overlays and `source_refs`; sibling module tables load through `database/database.manifest.json` module order instead of per-app duplication.

