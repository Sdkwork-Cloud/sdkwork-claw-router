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
      membership: "/app/v3/api/memberships/current",
      tenantRoot: "/app/v3/api/iam/tenants/current",
      userProfile: "/app/v3/api/iam/users/current",
      userSettings: "/app/v3/api/iam/users/current",
    });
    expect(Object.hasOwn(routes, "vipInfo")).toBe(false);
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

  it("publishes membership-first route and capability naming without vip aliases", () => {
    const createUserCenterLocalApiRoutes = requireExport<
      (basePath?: string) => Record<string, string>
    >("createUserCenterLocalApiRoutes");
    const createUserCenterBridgeConfig = requireExport<
      (options: Record<string, unknown>) => Record<string, unknown>
    >("createUserCenterBridgeConfig");
    const createUserCenterPluginDefinition = requireExport<
      (options: Record<string, unknown>) => Record<string, unknown>
    >("createUserCenterPluginDefinition");
    const createUserCenterServerPluginDefinition = requireExport<
      (options: Record<string, unknown>) => Record<string, unknown>
    >("createUserCenterServerPluginDefinition");

    const localApiRoutes = createUserCenterLocalApiRoutes();
    const bridgeConfig = createUserCenterBridgeConfig({
      namespace: "example-app",
      routes: {
        authBasePath: "/auth",
        membershipRoutePath: "/memberships",
        userRoutePath: "/user",
      },
    });
    const pluginDefinition = createUserCenterPluginDefinition({
      namespace: "example-app",
      routes: {
        authBasePath: "/auth",
        membershipRoutePath: "/memberships",
        userRoutePath: "/user",
      },
    });
    const serverPluginDefinition = createUserCenterServerPluginDefinition({
      namespace: "example-app",
      routes: {
        authBasePath: "/auth",
        membershipRoutePath: "/memberships",
        userRoutePath: "/user",
      },
    });
    const manifests = pluginDefinition.manifests as Record<string, { capability?: string; routePath?: string }>;
    const server = serverPluginDefinition.server as {
      authority: {
        api: { operations: Array<{ operationId: string; routeKey: string }> };
        localAuthority: {
          schema: {
            tables: Array<{
              columns: Array<{ name: string }>;
              standardEntityName: string;
              tableName: string;
            }>;
          };
        };
        repositories: Array<{ entityNames: string[]; id: string }>;
        services: Array<{ id: string; operationIds: string[] }>;
      };
    };
    const membershipTable = server.authority.localAuthority.schema.tables.find(
      (table) => table.standardEntityName === "IamMembership",
    );

    expect(localApiRoutes.membership).toBe("/app/v3/api/memberships/current");
    expect(Object.hasOwn(localApiRoutes, "vipInfo")).toBe(false);
    expect((bridgeConfig.routes as Record<string, string>).membershipRoutePath).toBe(
      "/memberships",
    );
    expect(Object.hasOwn(bridgeConfig.routes as Record<string, string>, "vipRoutePath")).toBe(
      false,
    );
    expect(pluginDefinition.capabilities).toEqual(["auth", "user", "membership"]);
    expect(manifests.membership).toMatchObject({
      capability: "membership",
      routePath: "/memberships",
    });
    expect(Object.hasOwn(manifests, "vip")).toBe(false);
    expect(server.authority.api.operations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          operationId: "membership.current.get",
          routeKey: "membershipCurrentGet",
        }),
        expect.objectContaining({
          operationId: "membership.current.update",
          routeKey: "membershipCurrentUpdate",
        }),
      ]),
    );
    expect(server.authority.repositories).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          entityNames: ["IamMembership"],
          id: "membership-repository",
        }),
      ]),
    );
    expect(server.authority.services).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "membership-service",
          operationIds: ["membership.current.get", "membership.current.update"],
        }),
      ]),
    );
    expect(membershipTable).toMatchObject({
      standardEntityName: "IamMembership",
      tableName: "iam_membership",
    });
    expect(membershipTable?.columns.map((column) => column.name)).toContain(
      "membership_level_id",
    );
    expect(membershipTable?.columns.map((column) => column.name)).not.toContain("vip_level_id");
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

  it("uses neutral auth strategy names while keeping the wire access token header standard", () => {
    const createUserCenterBridgeConfig = requireExport<
      (options: Record<string, unknown>) => {
        auth: {
          mode: string;
          tokenHeaders: { accessTokenHeaderName: string };
          validationStrategy: string;
        };
      }
    >("createUserCenterBridgeConfig");
    const USER_CENTER_DEPLOYMENT_VARIABLE_NAMES = requireExport<Record<string, string>>(
      "USER_CENTER_DEPLOYMENT_VARIABLE_NAMES",
    );

    const bridgeConfig = createUserCenterBridgeConfig({
      namespace: "example-app",
    });

    expect(bridgeConfig.auth.mode).toBe("dual-token");
    expect(bridgeConfig.auth.validationStrategy).toBe("dual-token");
    expect(bridgeConfig.auth.tokenHeaders.accessTokenHeaderName).toBe("Access-Token");
    expect(USER_CENTER_DEPLOYMENT_VARIABLE_NAMES.accessTokenHeaderName).toBe(
      "USER_CENTER_ACCESS_TOKEN_HEADER_NAME",
    );
    expect(USER_CENTER_DEPLOYMENT_VARIABLE_NAMES.allowAuthorizationFallbackToAccessToken).toBe(
      "USER_CENTER_ALLOW_AUTHORIZATION_FALLBACK_TO_ACCESS_TOKEN",
    );
    const brandedPrefix = ["SDK", "WORK_"].join("");
    expect(USER_CENTER_DEPLOYMENT_VARIABLE_NAMES.accessTokenHeaderName.startsWith(brandedPrefix)).toBe(
      false,
    );
    expect(
      USER_CENTER_DEPLOYMENT_VARIABLE_NAMES.allowAuthorizationFallbackToAccessToken.startsWith(
        brandedPrefix,
      ),
    ).toBe(false);
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
