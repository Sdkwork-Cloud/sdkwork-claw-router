# CLAW_ROUTER Database Module

Canonical lifecycle assets for `sdkwork-claw-router` per `DATABASE_FRAMEWORK_SPEC.md`.

- moduleId: `clawrouter`
- serviceCode: `CLAW_ROUTER`
- tablePrefix: `ai_` (claw-router-owned generated schema)

## Composition

Claw-router **does not** own app center, course, IAM, or commerce base tables. Those domains bootstrap from sibling modules declared in `database.manifest.json`:

| Order | Module | Locator |
| --- | --- | --- |
| 10 | appbase-iam | `../sdkwork-appbase/database` |
| 20 | commerce-core | `../sdkwork-commerce/database` |
| 30 | appstore | `../sdkwork-appstore/database` |
| 40 | course | `../sdkwork-course/database` |

Generated claw-router DDL (`generated/schema/postgres/schema.sql`) contains only product-owned prefixes (`ai_*`, `ops_*`, …). See `docs/31-product-composition-model.md`.

Legacy `platform_*` and `content_course*` projection DDL lives in `ddl/baseline/postgres/0002_clawrouter_legacy_projection.sql` until appstore/course seed migration completes.

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
