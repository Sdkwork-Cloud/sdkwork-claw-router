# @sdkwork/vip-admin-pc-react

Admin VIP management package for SDKWork PC React applications.

This package owns the admin-facing VIP management surface. It uses the shared
`@sdkwork/commerce-service` SDK boundary and calls `admin.vip.*` resources for:

- VIP levels
- VIP packages
- VIP memberships
- VIP entitlement inventory

Runtime ownership stays separated from user-facing membership purchase flows:
`@sdkwork/vip-pc-react` owns member dashboards and purchase actions, while this
package owns admin review and mutation workflows.
