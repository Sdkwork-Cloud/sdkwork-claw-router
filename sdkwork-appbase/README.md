# SDKWORK Appbase

`sdkwork-appbase` is the capability workspace for composable SDKWORK applications.

This workspace does not replace:

- `sdkwork-ui`: shared UI primitives, patterns, and theme tokens
- `sdkwork-core`: shared SDK clients, runtime bootstrap, and session handling

This workspace sits above both of them and defines reusable application capability packages.

## Design goals

- Group by architecture first so future `mobile-react` and `mobile-flutter` packages fit without restructuring.
- Group by capability domain second so teams can discover related packages quickly.
- Keep host adapters isolated so React capabilities do not depend directly on Tauri.
- Let applications become assembly layers, not new sources of duplicated business code.

## Naming

- Directory: `sdkwork-<capability>-pc-react`
- Workspace package name: `@sdkwork/<capability>-pc-react`

Future architectures follow the same rule:

- `sdkwork-<capability>-mobile-react`
- `sdkwork-<capability>-mobile-flutter`

## Workspace layout

```text
sdkwork-appbase/
  packages/
    common/
      foundation/
      iam/
      commerce/
    native-rust/
      iam/
      commerce/
    pc-react/
      foundation/
      host/
      system/
      iam/
      communication/
      intelligence/
      content/
      commerce/
      device/
      ecosystem/
    mobile-react/
    mobile-flutter/
```

## Capability building-block standard

Applications integrate appbase capabilities as assembly layers. A concrete
application may inject generated SDK clients, runtime config, route/menu
registration, product seed data, and product-specific adapters. It must not fork
base business stores, invent local SDK clients, or bypass generated SDK ports.

The machine-readable source of truth is
[`specs/appbase-capabilities.yaml`](./specs/appbase-capabilities.yaml). A
capability can declare `maturity: L3` only when it owns the full reusable loop:

- `contracts`: canonical domain models, API shapes, events, table contracts,
  operationIds, and error semantics.
- `sdk_ports`: generated SDK client shapes without importing a concrete app SDK.
- `service` and `runtime`: business facade, request context, idempotency,
  feature flags, deployment mode, and dependency injection.
- `native_rust_core` and `native_rust_storage_sqlx`: Rust domain/storage
  implementation with migrations, seeds, completeness checks, and parity tests.
- `pc_react`: React provider, hooks, and reusable product surfaces.
- `qualityGates`: contract, runtime, storage, and frontend verification commands.

The dependency direction is always one-way:

```text
app integration -> appbase runtime -> appbase service -> sdk ports -> contracts
```

Reusable appbase packages must not import concrete application SDKs such as
`@sdkwork/example-app-sdk`, `@sdkwork/example-backend-sdk`, or
`@sdkwork/example-open-sdk`. They must receive those clients through declared
ports/adapters.

## Current status

- `common/foundation` is the canonical framework-independent runtime bootstrap layer for generated app/backend SDK client injection, v3 API base URL normalization, and standard request context headers.
- `common/iam` is the canonical framework-independent IAM foundation for contracts, generated SDK ports, service facades, and runtime bootstrap.
- `native-rust/iam` is the local/private Rust implementation foundation with Java SaaS API, token, context, and database parity.
- `common/commerce` is the canonical framework-independent account, wallet, points, token, VIP, privilege, immutable ledger, idempotency, checkout, and reporting foundation exposed through generated app/backend SDK `commerce.*` resource trees.
- `native-rust/commerce` is the local/private Rust commerce implementation foundation with Java SaaS domain routes such as `/app/v3/api/catalog/spus`, `/app/v3/api/wallet/transactions`, and `/backend/v3/api/reports/commerce_overview`, operationId, token, context, and `commerce_*` database parity.
- `pc-react/iam` is the React integration layer over the common IAM runtime. New IAM work and productized auth/user packages go here.
- IM and RTC integrations use the active craw-chat SDK workspaces at `../craw-chat/sdks/sdkwork-im-sdk` and `../craw-chat/sdks/sdkwork-rtc-sdk`, while preserving public packages `@sdkwork/im-sdk` and `@sdkwork/rtc-sdk`.
- `pc-react` is now the active, productized extraction target with reusable packages across `foundation`, `host`, `system`, `iam`, `communication`, and `intelligence`.
- `mobile-react` and `mobile-flutter` keep the same domain grouping and now carry wave-1 package planning inside their architecture READMEs.
- New architecture scaffolds still originate from `scripts/package-catalog.mjs`, but productized package contracts are maintained intentionally rather than regenerated blindly.

## Review model

This workspace keeps architecture review executable:

- `pnpm run scaffold:packages`: generate grouped package skeletons from the catalog
- `pnpm run review:structure`: verify grouped structure, required files, and reserved flat-directory placement
- `pnpm run test:iam-standard-contracts`: verify IAM API/SDK/database/context parity across TypeScript and Rust
- `pnpm run test:commerce-standard-contracts`: verify commerce API/SDK/database/ledger/context parity across TypeScript and Rust
- `pnpm run list:packages`: print the package matrix summary
- From an integrating application workspace, run
  `python -B -m tools.appbase_capability_guardian --root .` to verify the
  appbase capability catalog, L3 layer completeness, and reusable SDK boundary.

## Industry references

The grouping strategy intentionally borrows from current official platform patterns:

- Tauri plugin and host capability separation: https://v2.tauri.app/plugin/
- VS Code extension host and lazy activation boundaries: https://code.visualstudio.com/api/advanced-topics/extension-host
- Figma plugin runtime separation between document actions and iframe UI: https://developers.figma.com/docs/plugins/plugin-quickstart-guide/
- Notion block and content capability modeling for structured content systems: https://developers.notion.com/reference/block
