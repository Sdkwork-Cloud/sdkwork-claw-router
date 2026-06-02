# @sdkwork/user-pc-react

## Purpose

Shared user center surface for profile, notification, and security settings.

This package is the standard user-center UI layer for appbase-based desktop apps. Host applications should integrate it directly instead of rebuilding their own profile page structure.

## Placement

- Architecture: `pc-react`
- Domain: `iam`
- Capability: `user`
- Status: `ready`

## Standard surface model

- `SdkworkUserCenterPage` is the default page-level entry for fast integration.
- `SdkworkUserPageShell` is the reusable shell abstraction for hosts that need to compose their own body content while keeping the same platform shell.
- `appearance` is the single customization contract. It supports:
  - `theme`: token-level theme overrides
  - `slots`: component replacement for page shell surfaces
  - `slotProps`: class/style injection per shell surface
  - `...ClassName` and `...Style`: targeted visual overrides
- `resolveSdkworkUserAppearance(...)` converts a raw `appearance` config into a fully merged runtime appearance so nested sections and custom surfaces stay consistent.

## Main exports

- Root entry: `@sdkwork/user-pc-react`

Key exports:

- `SdkworkUserCenterPage`
- `SdkworkUserPageShell`
- `createSdkworkCanonicalUserDefinition`
- `createSdkworkCanonicalUserCapability`
- `createSdkworkCanonicalUserRouteIntent`
- `createSdkworkCanonicalUserSectionRouteIntent`
- `createSdkworkCanonicalUserWorkspaceManifest`
- `createSdkworkCanonicalUserProfileAdapter`
- `createSdkworkCanonicalUserService`
- `createSdkworkCanonicalUserController`
- `createSdkworkUserProfileFromCanonicalIdentity`
- `SdkworkUserOverviewSection`
- `SdkworkUserProfileSection`
- `SdkworkUserNotificationsSection`
- `SdkworkUserSecuritySection`
- `createSdkworkUserAppearancePreset`
- `createSdkworkUserThemeAppearance`
- `mergeSdkworkUserAppearanceConfigs`
- `resolveSdkworkUserAppearance`

## Fast integration

```tsx
import { SdkworkUserCenterPage } from "@sdkwork/user-pc-react";

export function AccountRoute() {
  return <SdkworkUserCenterPage />;
}
```

## Canonical authority integration

When an app already has a unified user-center runtime or local/private profile authority, do not rebuild a local controller stack in the app layer. Use the root-package canonical builders and keep the app adapter thin.

```tsx
import {
  createSdkworkCanonicalUserController,
  createSdkworkCanonicalUserProfileAdapter,
  createSdkworkCanonicalUserService,
  createSdkworkUserProfileFromCanonicalIdentity,
  resolveSdkworkCanonicalUserDisplayName,
} from "@sdkwork/user-pc-react";

const service = createSdkworkCanonicalUserService({
  preferences: {
    defaults: defaultPreferences,
    read: () => runtimeClient.getPreferences(),
    write: (preferences) => runtimeClient.updatePreferences(preferences),
  },
  profile: createSdkworkCanonicalUserProfileAdapter({
    mapUserProfileToSnapshot(profile, snapshot, user) {
      return {
        ...snapshot,
        displayName: resolveSdkworkCanonicalUserDisplayName(profile, user.email),
      };
    },
    read: () => readProfileSnapshot(),
    resolveIdentity(user, snapshot) {
      return {
        avatar: user.avatar,
        displayName: snapshot.displayName || user.name || user.email,
        email: user.email,
      };
    },
    toUserProfile(snapshot, user) {
      return createSdkworkUserProfileFromCanonicalIdentity({
        avatar: user.avatar,
        displayName: snapshot.displayName || user.name || user.email,
        email: user.email,
      });
    },
    write: (snapshot) => writeProfileSnapshot(snapshot),
  }),
  user,
});

const controller = createSdkworkCanonicalUserController({
  locale: "zh-CN",
  service,
});
```

## Thin app-wrapper integration

When an application needs its own package identity but should not duplicate user-center capability, route intent, or workspace-manifest assembly, build the wrapper from the root package:

```ts
import {
  createSdkworkCanonicalUserCapability,
  createSdkworkCanonicalUserRouteIntent,
  createSdkworkCanonicalUserSectionRouteIntent,
  createSdkworkCanonicalUserWorkspaceManifest,
} from "@sdkwork/user-pc-react";

const capability = createSdkworkCanonicalUserCapability({
  routePath: "/user",
  sourcePackageName: "@sdkwork/user-pc-react",
});

const manifest = createSdkworkCanonicalUserWorkspaceManifest({
  architecture: "app-user",
  bridgePackageName: "@example/app-user",
  host: "server",
  id: "example-app-user",
  packageNames: ["@example/app-user"],
  routePath: capability.routePath,
  sourcePackageName: "@sdkwork/user-pc-react",
  title: "User",
});

const userIntent = createSdkworkCanonicalUserRouteIntent({
  basePath: capability.routePath,
  sourcePackageName: "@sdkwork/user-pc-react",
});

const sectionIntent = createSdkworkCanonicalUserSectionRouteIntent("security", {
  basePath: capability.routePath,
  sourcePackageName: "@sdkwork/user-pc-react",
});
```

This keeps app packages limited to their own namespace, route base path, and storage metadata while the user-center standard stays centralized in `sdkwork-appbase`.

If the app wants one reusable bound definition instead of repeatedly passing the same route path, package name, bridge package, and manifest defaults, use `createSdkworkCanonicalUserDefinition(...)` and call `definition.createCapability(...)`, `definition.createWorkspaceManifest(...)`, `definition.createRouteIntent(...)`, and `definition.createSectionRouteIntent(...)` from the app wrapper.

## Theme configuration

```tsx
import {
  SdkworkUserCenterPage,
  createSdkworkUserAppearancePreset,
  mergeSdkworkUserAppearanceConfigs,
} from "@sdkwork/user-pc-react";

const appearance = mergeSdkworkUserAppearanceConfigs(
  createSdkworkUserAppearancePreset("midnight"),
  {
    theme: {
      pageBackgroundColor: "#020617",
      shellShadow: "0 32px 96px rgba(2,6,23,0.46)",
      standardsCardBackgroundColor: "rgba(255,255,255,0.10)",
    },
  },
);

export function AccountRoute() {
  return <SdkworkUserCenterPage appearance={appearance} />;
}
```

## Slot-based composition

```tsx
import {
  SdkworkUserPageShell,
  type SdkworkUserSurfaceSlots,
} from "@sdkwork/user-pc-react";

const slots: SdkworkUserSurfaceSlots = {
  Hero({ badge, className, description, icon, style, title }) {
    return (
      <section className={className} style={style}>
        <div className="grid gap-5 lg:grid-cols-[auto,1fr]">
          {icon}
          <div>
            {badge}
            {title}
            {description}
          </div>
        </div>
      </section>
    );
  },
};

export function CustomAccountFrame({ children }: { children: React.ReactNode }) {
  return (
    <SdkworkUserPageShell
      appearance={{
        slots,
        slotProps: {
          content: { className: "mt-2" },
        },
      }}
      badge="Account"
      description="Shared user-center surface"
      heroIcon={null}
      standardsContent={null}
      title="User Center"
    >
      {children}
    </SdkworkUserPageShell>
  );
}
```

## Integration rule

- Host apps should only wrap or configure this package.
- Do not fork the page structure for product-level customization.
- Prefer root-package `appearance` and slot exports for theme and composition changes.
