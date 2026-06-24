# CLAW_ROUTER Database Module

Canonical lifecycle assets for `sdkwork-clawrouter` per `DATABASE_FRAMEWORK_SPEC.md`.

- moduleId: `clawrouter`
- serviceCode: `CLAW_ROUTER`
- tablePrefix: `ai_` (claw-router-owned generated schema)

## Composition

Claw-router owns **only** generated gateway schema. Sibling product tables (appbase IAM base, commerce, models catalog, messaging, appstore, drive) are **not** composed in `database.manifest.json` or schema registry dependencies.

| Domain | Owner | Claw-router |
| --- | --- | --- |
| Gateway / routing / ops | `clawrouter` | `generated/schema/postgres/schema.sql` |
| Usage settlement projections | `clawrouter` | `commerce_usage_*`, `analytics_*` in generated schema |
| IAM / commerce / models / messaging / appstore / drive | Sibling products | External SDK/API only |

See `docs/31-product-composition-model.md`.

`0002_clawrouter_legacy_projection.sql` is retired (empty stub).

## Commands

```bash
pnpm run db:validate
pnpm run db:plan
pnpm run db:init
pnpm run db:migrate
pnpm run db:seed
pnpm run db:status
pnpm run db:drift:check
pnpm run check:database-ownership
```

Runtime services create pools through `sdkwork-database-sqlx` and register `DefaultDatabaseModule` at bootstrap.
