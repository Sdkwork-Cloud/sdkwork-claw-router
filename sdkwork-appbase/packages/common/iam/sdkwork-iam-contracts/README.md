# @sdkwork/iam-contracts

Canonical IAM contracts for SDKWork foundation modules.

This package owns stable IAM constants and types shared by SaaS Java, Rust local/private, generated SDKs, and frontend modules:

- API prefixes, paths, tags, and dotted `operationId` values.
- Dual-token header names.
- `AppContext` and `ShardingContext` models.
- Canonical `iam_` database table names.

It has no UI, network, storage, or generated SDK dependency.
