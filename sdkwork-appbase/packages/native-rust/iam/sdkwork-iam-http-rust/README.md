# sdkwork_iam_http

Rust IAM HTTP route contracts.

Owns standard route definitions for:

- `/app/v3/api/auth/*`
- `/app/v3/api/iam/users/current`
- `/backend/v3/api/iam/*`

Backend routes must not expose login or session creation.
