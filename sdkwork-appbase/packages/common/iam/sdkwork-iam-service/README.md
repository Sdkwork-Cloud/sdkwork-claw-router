# @sdkwork/iam-service

Framework-independent IAM service facade.

The service composes generated app/backend SDK clients through ports:

- Session creation, current session, logout, and refresh always use the app SDK.
- Administrative IAM resources prefer the backend SDK when provided.
- Current user self-service stays on the app SDK.
- Session normalization requires both `authToken` and `accessToken`.

No React, Tauri, browser storage, or app-specific SDK package is imported here.
