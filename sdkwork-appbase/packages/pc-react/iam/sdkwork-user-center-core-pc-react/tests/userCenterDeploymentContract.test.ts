import { describe, expect, it } from "vitest";

import * as userCenterCore from "../src/index.ts";

function requireExport<T>(name: string): T {
  return (userCenterCore as Record<string, unknown>)[name] as T;
}

describe("user-center deployment contract", () => {
  it("creates canonical app v3 local API routes", () => {
    const createUserCenterLocalApiRoutes = requireExport<
      (basePath?: string) => Record<string, string>
    >("createUserCenterLocalApiRoutes");

    expect(createUserCenterLocalApiRoutes).toBeTypeOf("function");

    const routes = createUserCenterLocalApiRoutes();

    expect(routes).toMatchObject({
      accountSummary: "/app/v3/api/accounts/current/summary",
      authConfig: "/app/v3/api/auth/config",
      authEmailLogin: "/app/v3/api/auth/sessions",
      authLogin: "/app/v3/api/auth/sessions",
      authLogout: "/app/v3/api/auth/sessions/current",
      authOAuthLogin: "/app/v3/api/auth/oauth_sessions",
      authOAuthUrl: "/app/v3/api/auth/oauth_authorization_urls",
      authPasswordReset: "/app/v3/api/auth/password_resets",
      authPasswordResetRequest: "/app/v3/api/auth/password_reset_requests",
      authPhoneLogin: "/app/v3/api/auth/sessions",
      authQrCallbackPattern: "/app/v3/api/open_platform/qr_auth/sessions/:sessionKey/scans",
      authQrConfirm: "/app/v3/api/open_platform/qr_auth/sessions/:sessionKey/passwords",
      authQrEntryPattern: "/app/v3/api/open_platform/qr_auth/sessions/:sessionKey/scans",
      authQrGenerate: "/app/v3/api/open_platform/qr_auth/sessions",
      authQrStatusPattern: "/app/v3/api/open_platform/qr_auth/sessions/:sessionKey",
      authRefresh: "/app/v3/api/auth/sessions/refresh",
      authRegister: "/app/v3/api/auth/registrations",
      authSession: "/app/v3/api/auth/sessions/current",
      authSessionExchange: "/app/v3/api/auth/sessions",
      authVerifyCheck: "/app/v3/api/auth/verification_codes/verify",
      authVerifySend: "/app/v3/api/auth/verification_codes",
      health: "/app/v3/api/health",
      tenantRoot: "/app/v3/api/iam/tenants/current",
      userProfile: "/app/v3/api/iam/users/current",
      userSettings: "/app/v3/api/iam/users/current",
      vipInfo: "/app/v3/api/memberships/current",
    });
    expect(
      Object.values(routes).every((route) => !route.includes("/api/app/")),
    ).toBe(true);
    expect(
      Object.values(routes).every((route) => !route.includes("/auth/qr_login_codes")),
    ).toBe(true);
    expect(
      Object.values(routes).every((route) => !route.includes("/billing/vip")),
    ).toBe(true);
  });

  it("creates canonical identity deployment profiles across builtin-local and cloud providers", () => {
    const createUserCenterBridgeConfig = requireExport<
      (options: Record<string, unknown>) => Record<string, unknown>
    >("createUserCenterBridgeConfig");
    const createUserCenterDeploymentProfiles = requireExport<
      (bridgeConfig: Record<string, unknown>) => Record<string, Record<string, unknown>>
    >("createUserCenterDeploymentProfiles");
    const createIdentityDeploymentProfile = requireExport<
      ((options: {
        profile: Record<string, unknown>;
        surface: "desktop" | "server" | "web";
      }) => Record<string, unknown>)
      | undefined
    >("createIdentityDeploymentProfile");

    expect(createUserCenterBridgeConfig).toBeTypeOf("function");
    expect(createUserCenterDeploymentProfiles).toBeTypeOf("function");
    expect(createIdentityDeploymentProfile).toBeTypeOf("function");

    const localBridgeConfig = createUserCenterBridgeConfig({
      namespace: "example-app",
    });
    const localProfiles = createUserCenterDeploymentProfiles(localBridgeConfig);

    expect(
      createIdentityDeploymentProfile?.({
        profile: localProfiles.builtinLocal,
        surface: "desktop",
      }),
    ).toEqual({
      authorityKind: "embedded",
      bootstrapEnabled: true,
      developmentPrefillEnabled: true,
      identityMode: "desktop-local",
      providerKind: "builtin-local",
      storageKind: "sqlite",
      surface: "desktop",
      transportKind: "local-api",
    });

    const cloudBridgeConfig = createUserCenterBridgeConfig({
      mode: "app-api-hub",
      namespace: "example-app",
      provider: {
        baseUrl: "https://app-api.sdkwork.local/app",
        kind: "sdkwork-cloud-app-api",
        providerKey: "example-app-cloud",
      },
    });
    const cloudProfiles = createUserCenterDeploymentProfiles(cloudBridgeConfig);

    expect(
      createIdentityDeploymentProfile?.({
        profile: cloudProfiles.externalAppApi,
        surface: "web",
      }),
    ).toEqual({
      authorityKind: "upstream",
      bootstrapEnabled: false,
      developmentPrefillEnabled: false,
      identityMode: "cloud-saas",
      providerKind: "sdkwork-cloud-app-api",
      storageKind: "upstream-managed",
      surface: "web",
      transportKind: "remote-http",
    });
  });

  it("generates environment artifacts directly from a canonical deployment profile", () => {
    const createUserCenterBridgeConfig = requireExport<
      (options: Record<string, unknown>) => Record<string, unknown>
    >("createUserCenterBridgeConfig");
    const createUserCenterDeploymentProfiles = requireExport<
      (bridgeConfig: Record<string, unknown>) => Record<string, Record<string, unknown>>
    >("createUserCenterDeploymentProfiles");
    const createUserCenterDeploymentEnvArtifactForProfile = requireExport<
      ((options: {
        audience: "application-runtime" | "gateway-runtime" | "service-runtime";
        envPrefix: string;
        fileName: string;
        profile: Record<string, unknown>;
        purpose: string;
        targets:
          | readonly [
              "application-runtime"
              | "external-authority-bridge"
              | "local-authority"
              | "upstream-bridge",
              ...(
                | "application-runtime"
                | "external-authority-bridge"
                | "local-authority"
                | "upstream-bridge"
              )[],
            ]
          | [
              "application-runtime"
              | "external-authority-bridge"
              | "local-authority"
              | "upstream-bridge",
              ...(
                | "application-runtime"
                | "external-authority-bridge"
                | "local-authority"
                | "upstream-bridge"
              )[],
            ];
      }) => {
        content: string;
        fileName: string;
        variables: Array<{ canonicalName?: string; envName: string }>;
      })
      | undefined
    >("createUserCenterDeploymentEnvArtifactForProfile");

    expect(createUserCenterDeploymentEnvArtifactForProfile).toBeTypeOf("function");

    const bridgeConfig = createUserCenterBridgeConfig({
      namespace: "example-app",
    });
    const profiles = createUserCenterDeploymentProfiles(bridgeConfig);
    const artifact = createUserCenterDeploymentEnvArtifactForProfile?.({
      audience: "application-runtime",
      envPrefix: "VITE_EXAMPLE_APP_",
      fileName: ".env.desktop-local",
      profile: profiles.builtinLocal,
      purpose: "Example app desktop-local runtime contract",
      targets: ["application-runtime", "local-authority"],
    });

    expect(artifact).toMatchObject({
      fileName: ".env.desktop-local",
    });
    expect(artifact?.variables.some((variable) => variable.envName === "VITE_EXAMPLE_APP_MODE")).toBe(
      true,
    );
    expect(
      artifact?.variables.some(
        (variable) => variable.canonicalName === "SDKWORK_USER_CENTER_LOCAL_API_BASE_PATH",
      ),
    ).toBe(true);
    expect(artifact?.content).toContain("VITE_EXAMPLE_APP_MODE=builtin-local");
    expect(artifact?.content).toContain("VITE_EXAMPLE_APP_LOCAL_API_BASE_PATH=/app/v3/api");
  });
});
