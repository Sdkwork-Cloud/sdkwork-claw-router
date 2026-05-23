# @sdkwork/iam-permission-pc-react

Reusable IAM authorization foundation for appbase PC React applications.

The package exposes role, permission, policy, role-permission, and user-role controllers over `SdkworkIamService`. It is a shared application-layer boundary for fast app integration and SDK switching.

## Standard Surface

- `createSdkworkIamPermissionController(serviceOrInput)`
- `listRoles(params)`
- `listPermissions(params)`
- `listPolicies(params)`
- `listRolePermissions(roleId, params)`
- `assignRolePermission(roleId, permissionId)`
- `revokeRolePermission(roleId, permissionId)`
- `listUserRoles(userId, params)`
- `assignUserRole(userId, roleId)`
- `revokeUserRole(userId, roleId)`
- `can(hint)`

This package must not create raw HTTP clients, manually assemble auth headers, or import a concrete generated SDK.
