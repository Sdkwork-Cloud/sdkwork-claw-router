# @sdkwork/iam-permission-pc-react

Reusable IAM authorization foundation for appbase PC React applications.

The package exposes role, permission, policy, role-permission, and scoped role-binding controllers over `SdkworkIamService`. It is a shared application-layer boundary for fast app integration and SDK switching.

## Standard Surface

- `createSdkworkIamPermissionController(serviceOrInput)`
- `listRoles(params)`
- `listPermissions(params)`
- `listPolicies(params)`
- `listRoleBindings(params)`
- `listRolePermissions(roleId, params)`
- `assignRoleBinding(body)`
- `assignRolePermission(roleId, permissionId)`
- `revokeRoleBinding(roleBindingId)`
- `revokeRolePermission(roleId, permissionId)`
- `can(hint)`

This package must not create raw HTTP clients, manually assemble auth headers, or import a concrete generated SDK.
