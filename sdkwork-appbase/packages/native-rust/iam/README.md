# native-rust/iam

Rust IAM foundation for local/private deployments.

These crates mirror the Java SaaS contract and expose the same API paths, operationIds, token semantics, context model, and database table catalog.

## Crates

- `sdkwork-iam-core-rust`: domain context, AppContext, ShardingContext, and dual-token validation.
- `sdkwork-iam-http-rust`: route contracts for `/app/v3/api` and `/backend/v3/api`.
- `sdkwork-iam-rpc-rust`: gRPC service manifests, operationId mappings, and RPC surface split for IAM app/backend calls.
- `sdkwork-iam-storage-sqlx-rust`: SQL table catalog and initial migration text.
- `sdkwork-iam-tauri-rust`: Tauri host adapter manifest for local/private apps.

The crates intentionally avoid app-specific product logic. Applications compose them with repositories, generated SDKs, and host startup code.
