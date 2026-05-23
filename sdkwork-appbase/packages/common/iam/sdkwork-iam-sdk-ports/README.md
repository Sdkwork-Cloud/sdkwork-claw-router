# @sdkwork/iam-sdk-ports

Generated SDK port contracts for IAM.

This package defines the generated client surface that reusable IAM modules consume. It deliberately does not import any app-specific SDK package. Applications inject generated SDK clients that match:

```ts
client.auth.sessions.create(body)
client.auth.sessions.current.retrieve()
client.iam.users.current.retrieve()
client.iam.roles.permissions.delete(roleId, permissionId)
```

Backend SDK clients must not expose auth session creation.
