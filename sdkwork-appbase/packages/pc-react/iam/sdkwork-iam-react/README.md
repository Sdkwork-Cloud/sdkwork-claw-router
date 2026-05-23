# @sdkwork/iam-react

React integration for the framework-independent IAM runtime.

This package provides provider components and hooks for Tauri + React applications. It does not create generated SDK clients and does not manually assemble raw API calls.

## Fast Integration

```tsx
import {
  IamRuntimeProvider,
  createMemoryIamTokenStore,
} from "@sdkwork/iam-react";

const tokenStore = createMemoryIamTokenStore();

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
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
      {children}
    </IamRuntimeProvider>
  );
}
```

`appSdkClient` is generated from `/app/v3/api` and owns login, session, OAuth, password reset, verification code, and current-user self-service APIs.

`backendSdkClient` is generated from `/backend/v3/api` and owns tenant, organization, user directory, role, permission, policy, API key, security event, and audit event management APIs. It must not expose `auth.*` or app-only self-service methods.

Use `useIamRuntime()` when components need token/context helpers and `useIamService()` when components need the IAM business service facade.
