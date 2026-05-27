import { describe, expect, it, vi } from "vitest";

import {
  SDKWORK_API_PREFIXES,
  createSdkworkRuntimeBootstrap,
  normalizeSdkworkApiBaseUrl,
} from "@sdkwork/runtime-bootstrap";

describe("sdkwork runtime bootstrap", () => {
  it("preserves injected generated SDK clients and validates them before exposure", () => {
    const appClient = { auth: { sessions: { create: vi.fn() } } };
    const backendClient = { iam: { users: { list: vi.fn() } } };
    const validateAppClient = vi.fn();
    const validateBackendClient = vi.fn();

    const runtime = createSdkworkRuntimeBootstrap({
      clients: {
        app: appClient,
        backend: backendClient,
      },
      config: {
        appId: "sdkwork",
        appApiBaseUrl: "https://api.example.com/app/v3/api",
        backendApiBaseUrl: "https://api.example.com/backend/v3/api",
        deploymentMode: "saas",
        environment: "prod",
      },
      validateAppClient,
      validateBackendClient,
    });

    expect(validateAppClient).toHaveBeenCalledWith(appClient);
    expect(validateBackendClient).toHaveBeenCalledWith(backendClient);
    expect(runtime.clients.app).toBe(appClient);
    expect(runtime.clients.backend).toBe(backendClient);
  });

  it("fails closed when an injected app or backend SDK client does not pass its validator", () => {
    expect(() =>
      createSdkworkRuntimeBootstrap({
        clients: {
          app: {},
        },
        config: {
          appId: "sdkwork",
          deploymentMode: "saas",
          environment: "prod",
        },
        validateAppClient: () => {
          throw new Error("Generated app SDK client is missing standard methods");
        },
      }),
    ).toThrow(/app SDK client is missing standard methods/);

    expect(() =>
      createSdkworkRuntimeBootstrap({
        clients: {
          app: {},
          backend: {},
        },
        config: {
          appId: "sdkwork",
          deploymentMode: "saas",
          environment: "prod",
        },
        validateBackendClient: () => {
          throw new Error("Generated backend SDK client is missing standard methods");
        },
      }),
    ).toThrow(/backend SDK client is missing standard methods/);
  });

  it("builds standard request headers without exposing refresh tokens or client request ids", async () => {
    const runtime = createSdkworkRuntimeBootstrap({
      clients: {
        app: {},
      },
      config: {
        appId: "sdkwork",
        deploymentMode: "saas",
        environment: "prod",
      },
      localeProvider: () => "zh-CN",
      tokenStore: {
        get: async () => ({
          accessToken: "access-token",
          authToken: "auth-token",
          refreshToken: "refresh-token",
        }),
      },
    });

    await expect(runtime.getRequestHeaders()).resolves.toEqual({
      "Accept-Language": "zh-CN",
      Authorization: "Bearer auth-token",
      "Access-Token": "access-token",
    });
  });

  it("normalizes app and backend API base URLs to the v3 standard prefixes", () => {
    expect(SDKWORK_API_PREFIXES).toEqual({
      app: "/app/v3/api",
      backend: "/backend/v3/api",
    });

    expect(normalizeSdkworkApiBaseUrl("https://api.example.com", "app")).toBe(
      "https://api.example.com/app/v3/api",
    );
    expect(normalizeSdkworkApiBaseUrl("https://api.example.com/", "backend")).toBe(
      "https://api.example.com/backend/v3/api",
    );
    expect(normalizeSdkworkApiBaseUrl("https://api.example.com/app/v3/api", "app")).toBe(
      "https://api.example.com/app/v3/api",
    );
    expect(normalizeSdkworkApiBaseUrl(" https://api.example.com/ ", "app")).toBe(
      "https://api.example.com/app/v3/api",
    );
  });

  it("rejects mismatched and legacy API base URL prefixes during bootstrap", () => {
    const legacyAppApiPrefix = ["api", "app", "v3"].join("/");
    const legacyAppVersionPrefix = ["app", "v2"].join("/");

    expect(() => normalizeSdkworkApiBaseUrl("https://api.example.com/backend/v3/api", "app")).toThrow(
      /must not already include \/backend\/v3\/api/,
    );
    expect(() =>
      normalizeSdkworkApiBaseUrl(`https://api.example.com/${legacyAppApiPrefix}`, "app"),
    ).toThrow(/noncanonical SDKWork API prefix/);
    expect(() =>
      normalizeSdkworkApiBaseUrl(`https://api.example.com/${legacyAppVersionPrefix}`, "app"),
    ).toThrow(/noncanonical SDKWork API prefix/);
  });
});
