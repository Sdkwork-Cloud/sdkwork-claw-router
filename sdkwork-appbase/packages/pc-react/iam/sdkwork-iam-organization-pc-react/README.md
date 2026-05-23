# @sdkwork/iam-organization-pc-react

Reusable organization foundation for appbase PC React applications.

The package exposes an organization controller over the common `SdkworkIamService`. It keeps tree building, selected organization state, and member administration centralized while allowing every independent app to inject a different generated app/backend SDK pair at runtime.

## Standard Surface

- `createSdkworkIamOrganizationController(serviceOrInput)`
- `listOrganizations(params)`
- `buildOrganizationTree(organizations?)`
- `selectOrganization(organizationId)`
- `listMembers(organizationId, params)`
- `addMember(organizationId, body)`
- `getState()`

This package must not create raw HTTP clients, manually assemble auth headers, or import a concrete generated SDK.
