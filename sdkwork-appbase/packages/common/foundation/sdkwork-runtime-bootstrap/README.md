# @sdkwork/runtime-bootstrap

Shared runtime bootstrap for SDKWork generated SDK clients.

The package owns:

- App/backend API base URL normalization to `/app/v3/api` and `/backend/v3/api`.
- Generated app and backend SDK client injection.
- Optional generated SDK surface validation through caller-provided validators.
- Standard request context header creation for auth token, access token, request id, and locale.

Refresh tokens remain available in the token snapshot for dedicated session-refresh flows, but they are not attached to ordinary request headers.

This package does not create concrete SDK classes, call raw HTTP, or import generated app/backend SDK packages. Applications and domain runtimes create generated SDK clients at their entry boundary, then pass those clients into this bootstrap.
