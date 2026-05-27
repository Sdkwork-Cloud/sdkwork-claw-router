# sdkwork-studio-storage-sqlx-rust

Canonical Studio SQL storage contract and migration text for app templates,
shared catalog assets, prompt assets, and MCP catalog records in local/private
deployments.

## Contract

- Domain: `studio`
- Capability: `app-template-storage`
- Package: `sdkwork_studio_storage_sqlx`
- Public entrypoints:
  - `studio_database_tables()`
  - `studio_shared_catalog_tables()`
  - `studio_app_template_tables()`
  - `studio_prompt_tables()`
  - `studio_mcp_tables()`
  - `studio_initial_migration_sql()`
  - `studio_storage_capability_manifest()`

The crate is database-contract only in this slice. It does not construct SDK
clients, expose HTTP handlers, or own product-specific template transformation
logic.

## Verification

```bash
cargo test --manifest-path apps/sdkwork-appbase/packages/native-rust/studio/sdkwork-studio-storage-sqlx-rust/Cargo.toml
```
