# @sdkwork/iam-core-pc-react

Domain: iam
Capability: iam-core
Package type: service
Status: standard

`@sdkwork/iam-core-pc-react` is the canonical IAM service facade for SDKWork Tauri + React applications. It defines the stable service surface that reusable UI modules consume while generated app/backend SDK clients remain injectable.

## Public API

- `createSdkworkIamService(input)`
- `createIamSdkAdapters(input)`
- `createIamAppSdkAdapter(appClient)`
- `createIamBackendSdkAdapter(backendClient)`
- `SDKWORK_IAM_CORE_DOMAIN_RECORD`
- `SDKWORK_IAM_CORE_MODULE`
- IAM client surface, domain model, capability, session, user, tenant, organization, and permission types

## Required SDK Surface

```ts
client.auth.sessions.create(body)
client.auth.sessions.current.retrieve()
client.auth.sessions.refresh(body)
client.auth.sessions.current.delete()
client.iam.users.current.retrieve()
backendClient.iam.tenants.list(params)
backendClient.iam.organizationMemberships.create({ organizationId, userId })
backendClient.iam.roles.permissions.delete(roleId, permissionId)
```

## Configuration

```ts
const iam = createSdkworkIamService({
  appClient,
  backendClient,
  persistSession,
});
```

For apps whose generated SDKs still expose older method names, normalize the clients once before service/runtime creation:

```ts
const clients = createIamSdkAdapters({
  appClient: legacyAppClient,
  backendClient: legacyBackendClient,
});

const iam = createSdkworkIamService({
  appClient: clients.app,
  backendClient: clients.backend,
});
```

`appClient` owns login, session creation, OAuth, password reset, verification code, and current-user self-service APIs. `backendClient` owns administration and IAM management resources. Backend management calls do not fall back to `appClient.iam`; this keeps app API and backend API boundaries explicit.

## SaaS/Private/Local Behavior

SaaS Java, private Java/Rust, and local Rust deployments must provide clients with the same resource-style method shape. Client construction belongs in runtime/bootstrap, not this package.

## Security

Protected flows use the SDKWork dual token model:

- `Authorization: Bearer <auth_token>`
- `Access-Token: <access_token>`

This package stores token values only through injected callbacks. It does not assemble raw HTTP headers.

## Verification

```bash
pnpm vitest run packages/pc-react/iam/sdkwork-iam-core-pc-react/tests/iam-core.service.test.ts
```
