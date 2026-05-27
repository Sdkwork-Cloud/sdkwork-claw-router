# @sdkwork/iam-tenant-pc-react

Reusable tenant foundation for appbase PC React applications.

This package is intentionally transport-free. It consumes `SdkworkIamService` from `@sdkwork/iam-service`, so host applications can switch between SaaS Java, private Java/Rust, local Rust, or app-specific generated SDKs without changing tenant UI/controller code.

## Standard Surface

- `createSdkworkIamTenantController(serviceOrInput)`
- `listTenants(params)`
- `listTenantMembers(tenantId, params)`
- `selectTenant(tenantId)`
- `getSelectedTenant()`
- `getState()`

Protected calls are delegated to the common IAM service and use the canonical dual-token model:

- `Authorization: Bearer <auth_token>`
- `Access-Token: <access_token>`

This package must not create raw HTTP clients, manually assemble headers, or import a concrete generated SDK.
