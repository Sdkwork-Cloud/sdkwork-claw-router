import { describe, expect, it } from "vitest";

import * as authRuntimePackage from "../src/index.ts";

function requireExport<T>(name: string): T {
  return (authRuntimePackage as Record<string, unknown>)[name] as T;
}

describe("auth-runtime composition", () => {
  it("derives builtin-local development prefill from canonical runtime inputs", () => {
    const createCanonicalAuthRuntimeComposition = requireExport<
      ((options: {
        authConfig?: Record<string, unknown> | null;
        developmentPrefill?: Record<string, unknown>;
        namespace: string;
        surface?: "desktop" | "server" | "web";
      }) => {
        authRuntimeConfig: {
          developmentPrefill?: {
            account?: string;
            email?: string;
            enabled?: boolean;
            loginMethod?: string;
            password?: string;
          };
          loginMethods?: string[];
        };
        developmentPrefill?: {
          account?: string;
          email?: string;
          enabled?: boolean;
          loginMethod?: string;
          password?: string;
        };
        identityDeploymentProfile: {
          identityMode: string;
          providerKind: string;
          surface: string;
          transportKind: string;
        };
        userCenterDeploymentProfile: {
          kind: string;
          providerKind: string;
        };
      })
      | undefined
    >("createCanonicalAuthRuntimeComposition");

    expect(createCanonicalAuthRuntimeComposition).toBeTypeOf("function");

    const runtime = createCanonicalAuthRuntimeComposition?.({
      authConfig: {
        loginMethods: ["password", "emailCode"],
        supportsLocalCredentials: true,
      },
      namespace: "sdkwork-example",
      surface: "desktop",
    });

    expect(runtime?.identityDeploymentProfile).toEqual({
      identityMode: "desktop-local",
      providerKind: "builtin-local",
      surface: "desktop",
      transportKind: "local-api",
    });
    expect(runtime?.userCenterDeploymentProfile).toMatchObject({
      kind: "builtin-local",
      providerKind: "builtin-local",
    });
    expect(runtime?.developmentPrefill).toEqual({
      account: "local-default@sdkwork-example.local",
      email: "local-default@sdkwork-example.local",
      enabled: true,
      loginMethod: "password",
      password: "dev123456",
    });
    expect(runtime?.authRuntimeConfig.developmentPrefill).toEqual(
      runtime?.developmentPrefill,
    );
    expect(runtime?.authRuntimeConfig.loginMethods).toEqual(["password", "emailCode"]);
  });

  it("does not leak builtin-local defaults into cloud mode unless explicitly configured", () => {
    const createCanonicalAuthRuntimeComposition = requireExport<
      ((options: {
        authConfig?: Record<string, unknown> | null;
        developmentPrefill?: Record<string, unknown>;
        mode?: string;
        namespace: string;
        provider?: {
          baseUrl?: string;
          kind: string;
          providerKey?: string;
        };
        surface?: "desktop" | "server" | "web";
      }) => {
        authRuntimeConfig: {
          developmentPrefill?: {
            account?: string;
            enabled?: boolean;
            loginMethod?: string;
            password?: string;
          };
          loginMethods?: string[];
        };
        developmentPrefill?: {
          account?: string;
          enabled?: boolean;
          loginMethod?: string;
          password?: string;
        };
        identityDeploymentProfile: {
          identityMode: string;
          providerKind: string;
          surface: string;
          transportKind: string;
        };
        userCenterDeploymentProfile: {
          kind: string;
          providerKind: string;
        };
      })
      | undefined
    >("createCanonicalAuthRuntimeComposition");

    expect(createCanonicalAuthRuntimeComposition).toBeTypeOf("function");

    const cloudRuntime = createCanonicalAuthRuntimeComposition?.({
      authConfig: {
        supportsLocalCredentials: false,
        supportsSessionExchange: true,
      },
      mode: "app-api-hub",
      namespace: "sdkwork-example",
      provider: {
        baseUrl: "https://app-api.sdkwork.local/app",
        kind: "sdkwork-cloud-app-api",
        providerKey: "example-cloud",
      },
      surface: "web",
    });

    expect(cloudRuntime?.identityDeploymentProfile).toEqual({
      identityMode: "cloud-saas",
      providerKind: "sdkwork-cloud-app-api",
      surface: "web",
      transportKind: "remote-http",
    });
    expect(cloudRuntime?.userCenterDeploymentProfile).toMatchObject({
      kind: "sdkwork-cloud-app-api",
      providerKind: "sdkwork-cloud-app-api",
    });
    expect(cloudRuntime?.developmentPrefill).toBeUndefined();
    expect(cloudRuntime?.authRuntimeConfig.developmentPrefill).toBeUndefined();
    expect(cloudRuntime?.authRuntimeConfig.loginMethods).toEqual(["sessionBridge"]);

    const explicitCloudRuntime = createCanonicalAuthRuntimeComposition?.({
      developmentPrefill: {
        account: "qa-cloud@sdkwork-example.local",
        enabled: true,
        loginMethod: "emailCode",
      },
      mode: "app-api-hub",
      namespace: "sdkwork-example",
      provider: {
        baseUrl: "https://app-api.sdkwork.local/app",
        kind: "sdkwork-cloud-app-api",
        providerKey: "example-cloud",
      },
      surface: "web",
    });

    expect(explicitCloudRuntime?.developmentPrefill).toEqual({
      account: "qa-cloud@sdkwork-example.local",
      enabled: true,
      loginMethod: "emailCode",
    });
    expect(explicitCloudRuntime?.authRuntimeConfig.developmentPrefill).toEqual({
      account: "qa-cloud@sdkwork-example.local",
      enabled: true,
      loginMethod: "emailCode",
    });
  });
});
