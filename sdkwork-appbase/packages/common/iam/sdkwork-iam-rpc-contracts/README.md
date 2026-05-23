# SDKWork IAM RPC Contracts

Canonical IAM proto contracts for SDKWork app and backend RPC surfaces.

The app package owns login/session/current-user flows. The backend package owns
operator/admin IAM management services. Backend RPC must not expose session
creation or user-facing auth flows.
