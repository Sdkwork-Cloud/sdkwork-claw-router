# pc-react/iam

Canonical IAM capability domain for SDKWork Tauri + React and web applications.

This directory is the source of truth for new shared tenant, organization, user, authentication, session, role, permission, policy, API-key, security-event, and audit-event modules.

## Standard ownership

- `../../common/iam/sdkwork-iam-contracts`: canonical API, database, SDK, security, context, and table contracts.
- `../../common/iam/sdkwork-iam-sdk-ports`: generated SDK client port contracts for app/backend SDK injection.
- `../../common/iam/sdkwork-iam-service`: framework-independent IAM service facade.
- `../../common/iam/sdkwork-iam-runtime`: deployment mode, token store, and AppContext/ShardingContext runtime.
- `../../common/iam/sdkwork-iam-sdk-adapter`: generated SDK compatibility adapter for apps whose SDKs have not yet regenerated into the resource-style IAM surface.
- `sdkwork-iam-react`: React provider and hooks over the common IAM runtime.
- `sdkwork-iam-tenant-pc-react`: tenant list, tenant selection, and tenant member controller over the common IAM service.
- `sdkwork-iam-organization-pc-react`: organization list/tree, selected organization, and organization member controller over the common IAM service.
- `sdkwork-iam-permission-pc-react`: IAM roles, permissions, policies, user-role, role-permission, and authorization hint controller over the common IAM service.
- UI packages compose from `sdkwork-iam-react` and common IAM services, but they must not create raw HTTP clients or manually assemble auth headers.
- `sdkwork-iam-core-pc-react` is a compatibility aggregation package that re-exports the common IAM contracts, SDK adapter, SDK ports, service, and runtime. New standard-domain logic still belongs in the common IAM packages.
- Existing `pc-react/iam` packages are legacy compatibility packages and should migrate toward this domain boundary when touched.
- Existing `sdkwork-permission-pc-react` under `system` is a host/application permission center; IAM authorization and role permission policy belongs here.

## Integration rule

- Use `iam`, not `identity`, for new API, database, SDK, frontend package, event, and permission contracts.
- Use generated app SDK and backend SDK clients injected into `IamRuntimeProvider(...)`, `createIamRuntime(...)`, or `createSdkworkIamService(...)`.
- If an existing generated SDK still exposes legacy methods, normalize it once through `createIamSdkAdapters(...)` before creating the runtime/service.
- App SDK and backend SDK packages may differ, but resource method shape must remain standard.
- Login/session creation stays on app API. Backend API can manage IAM resources but must not expose login endpoints.
- Backend management calls do not fall back to app SDK self-service resources.

## Fast React integration

```tsx
import {
  IamRuntimeProvider,
  createMemoryIamTokenStore,
} from "@sdkwork/iam-react";

const tokenStore = createMemoryIamTokenStore();

<IamRuntimeProvider
  clients={{
    app: appSdkClient,
    backend: backendSdkClient,
  }}
  config={{
    appId: "sdkwork-router",
    deploymentMode: "saas",
    environment: "prod",
  }}
  tokenStore={tokenStore}
>
  <App />
</IamRuntimeProvider>;
```

## Standard SDK surface

```ts
appClient.auth.sessions.create(body)
appClient.auth.sessions.current.retrieve()
appClient.auth.sessions.refresh(body)
appClient.auth.sessions.current.delete()
appClient.iam.users.current.retrieve()

backendClient.iam.tenants.list(params)
backendClient.iam.organizations.members.create(organizationId, body)
backendClient.iam.roles.permissions.delete(roleId, permissionId)
```

## Common controllers

```ts
createSdkworkIamTenantController(iamService)
createSdkworkIamOrganizationController(iamService)
createSdkworkIamPermissionController(iamService)
```

These controllers are the reusable base for tenant context, organization structure, user-role assignment, role-permission assignment, and permission checks across independent apps.

## Governance entrypoints

- Root specs: `../../../../../specs/README.md`
- API: `../../../../../specs/API_SPEC.md`
- IAM: `../../../../../specs/IAM_SPEC.md`
- SDK: `../../../../../specs/SDK_SPEC.md`
- Module: `../../../../../specs/MODULE_SPEC.md`
- Frontend: `../../../../../specs/FRONTEND_SPEC.md`
