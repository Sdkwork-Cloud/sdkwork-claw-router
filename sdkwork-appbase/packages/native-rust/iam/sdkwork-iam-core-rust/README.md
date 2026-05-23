# sdkwork_iam_core

Rust IAM core contracts for local/private deployments.

Owns:

- `IamAppContext`
- `IamShardingContext`
- dual-token context validation
- environment/deployment/auth-level enums

No HTTP framework, SQL runtime, or Tauri dependency belongs in this crate.
