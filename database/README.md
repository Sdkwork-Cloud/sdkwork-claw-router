# CLAW_ROUTER Database Module

Canonical lifecycle assets for `sdkwork-clawrouter` per `DATABASE_FRAMEWORK_SPEC.md`.

- moduleId: `clawrouter`
- serviceCode: `CLAW_ROUTER`
- tablePrefix: `ai_` (claw-router-owned generated schema)

## Composition

Claw-router **does not** own app center, IAM, or commerce base tables. Those domains bootstrap from sibling modules declared in `database.manifest.json`:

| Order | Module | Locator |
| --- | --- | --- |
| 10 | appbase-iam | `../sdkwork-appbase/database` |
| 20 | commerce-core | `../sdkwork-commerce/database` |
| 30 | appstore | `../sdkwork-appstore/database` |

Course persistence (`course_*`) is owned by `../sdkwork-course` and is **not** bootstrapped by claw-router.

Generated claw-router DDL (`generated/schema/postgres/schema.sql`) contains only product-owned prefixes (`ai_*`, `ops_*`, …). See `docs/31-product-composition-model.md`.

`0002_clawrouter_legacy_projection.sql` is retired (empty stub). Composed-module DDL for appstore comes from sibling baselines.

## Commands

```bash
pnpm run db:validate
pnpm run db:plan
pnpm run db:init
pnpm run db:migrate
pnpm run db:seed
pnpm run db:status
pnpm run db:drift:check
```

Runtime services MUST create pools through `sdkwork-database-sqlx` and register `DefaultDatabaseModule` at bootstrap.
