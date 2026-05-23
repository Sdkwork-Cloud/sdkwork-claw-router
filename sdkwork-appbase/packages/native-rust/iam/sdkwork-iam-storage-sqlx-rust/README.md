# sdkwork_iam_storage_sqlx

Rust IAM storage contract and SQL migration catalog.

This crate currently owns the canonical IAM table list and initial migration SQL text. It is intentionally framework-light so local/private applications can wire SQLite or Postgres repositories without changing IAM API contracts.
