# Product Composition Model

> Version: 1.0  
> Date: 2026-06-20  
> Status: **active** — supersedes App Center / course ownership in `30-platform-data-model-v4.md`

## 1. Principle

`sdkwork-claw-router` is the AI gateway and product shell. It **composes** bounded contexts; it does not duplicate their database contracts or business logic.

| Capability | System of record | Table prefix | Repository |
| --- | --- | --- | --- |
| Application center / marketplace | `sdkwork-appstore` | `appstore_` | `../sdkwork-appstore` |
| Courses | `sdkwork-course` | `course_` | `../sdkwork-course` |
| IAM | `sdkwork-appbase` | `iam_` | `../sdkwork-appbase` |
| Commerce base | `sdkwork-commerce` | `commerce_` (base) | `../sdkwork-commerce` |
| AI gateway / skills / routing | `sdkwork-claw-router` | `ai_`, `ops_`, … | this repo |

## 2. Database lifecycle

`database/database.manifest.json` declares module dependencies. Bootstrap order:

1. appbase-iam  
2. commerce-core  
3. appstore  
4. course  
5. claw-router generated schema (`ai_*`, …)

Claw-router Schema Registry entries for imported domains use `generated_by_this_project: false` and the correct `write_owner`. DDL is applied from sibling module baselines in `installer.rs`, not compiled into `generated/schema/postgres/schema.sql`.

## 3. Retired in claw-router

Do not add or regenerate DDL for:

- `platform_*` (fully replaced by `appstore_*`, including `appstore_app_template*`)
- `content_course*` (replaced by `course_*`)
- Core `iam_*` from appbase (OAuth subset still applied via appbase migrations)

`0002_clawrouter_legacy_projection.sql` is retired (empty stub). All composed-module DDL comes from sibling baselines.

`c_category` remains for skill/agent/MCP classification until those domains are extracted.

## 4. API and frontend

- App center UI and APIs consume `sdkwork-appstore-*-sdk` and appstore route crates.
- Course UI and APIs consume `sdkwork-course-*-sdk` and course route crates.
- Claw-router OpenAPI must not duplicate appstore/course operations; declare them in `specs/dependency-api-surfaces.json`.
