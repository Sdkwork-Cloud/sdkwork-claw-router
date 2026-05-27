# SDKWork Studio Storage Sqlx Component Specs

This directory is the local standards index for `sdkwork_studio_storage_sqlx`.

Root SDKWork standards remain authoritative. Local component specs can narrow or
document this component, but they must not contradict
[the root standards](../../../../../../../specs/README.md).

## Component

| Field | Value |
| --- | --- |
| Name | `sdkwork_studio_storage_sqlx` |
| Type | `rust-crate` |
| Root | `sdkwork-appbase/packages/native-rust/studio/sdkwork-studio-storage-sqlx-rust` |
| Domain | `studio` |
| Capability | `app-template-storage` |
| Languages | `rust` |
| Status | `standardizing` |

## Contract Manifest

- [component.spec.json](./component.spec.json) is the machine-readable component contract.
- Consumers should integrate through public exports, runtime entrypoints, SDK clients, or adapters declared in the manifest.
- Generated SDK language outputs are represented at their SDK family root instead of duplicating local specs in generated folders.

## Canonical Specs

| Spec | Applies Because |
| --- | --- |
| [COMPONENT_SPEC.md](../../../../../../../specs/COMPONENT_SPEC.md) | Local component specs directory and manifest rules. |
| [CONFIG_SPEC.md](../../../../../../../specs/CONFIG_SPEC.md) | Runtime configuration, environment, SDK bootstrap, and feature flag rules. |
| [DATABASE_SPEC.md](../../../../../../../specs/DATABASE_SPEC.md) | Studio table contract, tenant scope, indexes, and schema evolution rules. |
| [DEPLOYMENT_SPEC.md](../../../../../../../specs/DEPLOYMENT_SPEC.md) | SaaS/private/local runtime parity and deployment rules. |
| [DOCUMENTATION_SPEC.md](../../../../../../../specs/DOCUMENTATION_SPEC.md) | Module README, examples, ADR, changelog, and runbook rules. |
| [DOMAIN_SPEC.md](../../../../../../../specs/DOMAIN_SPEC.md) | Canonical domain ownership and naming. |
| [GOVERNANCE_SPEC.md](../../../../../../../specs/GOVERNANCE_SPEC.md) | Standard ownership, exception, compatibility, and migration rules. |
| [MODULE_SPEC.md](../../../../../../../specs/MODULE_SPEC.md) | Reusable package contract and dependency direction. |
| [OBSERVABILITY_SPEC.md](../../../../../../../specs/OBSERVABILITY_SPEC.md) | Log, metric, trace, audit, and diagnostic rules. |
| [PERFORMANCE_SPEC.md](../../../../../../../specs/PERFORMANCE_SPEC.md) | Latency, pagination, bundle, scalability, and retry budget rules. |
| [PRIVACY_SPEC.md](../../../../../../../specs/PRIVACY_SPEC.md) | Personal, tenant, sensitive, and regulated data rules. |
| [README.md](../../../../../../../specs/README.md) | SDKWork root standards entrypoint. |
| [SECURITY_SPEC.md](../../../../../../../specs/SECURITY_SPEC.md) | Secure auth, token, secrets, CORS, validation, and logging rules. |
| [TEST_SPEC.md](../../../../../../../specs/TEST_SPEC.md) | Contract, database, security, parity, and documentation verification rules. |

## Public Exports

- `studio_database_tables()`
- `studio_shared_catalog_tables()`
- `studio_app_template_tables()`
- `studio_prompt_tables()`
- `studio_mcp_tables()`
- `studio_initial_migration_sql()`
- `studio_storage_capability_manifest()`

## SDK Clients

- No generated SDK client class is declared at this component boundary.

## Local Extension Specs

- No local extension specs are declared yet.

## Verification

- `cargo test --manifest-path apps/sdkwork-appbase/packages/native-rust/studio/sdkwork-studio-storage-sqlx-rust/Cargo.toml`
