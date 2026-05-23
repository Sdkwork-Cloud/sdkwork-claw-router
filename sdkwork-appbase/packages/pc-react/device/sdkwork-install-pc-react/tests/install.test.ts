import { describe, expect, it } from "vitest";
import * as installModule from "../src";

describe("sdkwork-install-pc-react headless contract", () => {
  it("creates manifests, route intents, step flow, and empty catalog", () => {
    const {
      createEmptySdkworkInstallCatalog,
      createInstallRouteIntent,
      createInstallWorkspaceManifest,
      createSdkworkInstallStepFlow,
      installPackageMeta,
    } = installModule as unknown as Record<string, (...args: any[]) => any> & {
      installPackageMeta?: unknown;
    };

    expect(installPackageMeta).toMatchObject({
      domain: "device",
      package: "@sdkwork/install-pc-react",
      status: "ready",
    });

    expect(
      createInstallWorkspaceManifest({
        title: "Install Center",
      }),
    ).toMatchObject({
      capability: "install",
      routePath: "/install",
      title: "Install Center",
    });

    expect(
      createInstallRouteIntent({
        section: "variants",
        targetKind: "runtime",
        variantId: "runtime-docker",
      }),
    ).toEqual({
      focusWindow: true,
      route: "/install?section=variants&targetKind=runtime&variantId=runtime-docker",
      section: "variants",
      source: "install-workspace",
      targetKind: "runtime",
      type: "install-route-intent",
      variantId: "runtime-docker",
    });

    expect(
      createSdkworkInstallStepFlow({
        assessmentStatus: "ready",
        configurationStatus: "idle",
        dependenciesStatus: "success",
        initializationStatus: "idle",
        installStatus: "running",
      }),
    ).toMatchObject([
      { id: "dependencies", status: "completed" },
      { id: "install", status: "running" },
      { id: "configure", status: "pending" },
      { id: "initialize", status: "pending" },
      { id: "verify", status: "pending" },
    ]);

    expect(
      createEmptySdkworkInstallCatalog({
        hostPlatform: "windows",
      }),
    ).toMatchObject({
      hostPlatform: "windows",
      isAuthenticated: false,
      readiness: {
        status: "ready",
      },
      recommendedInstallPath: "C:\\SDKWORK\\Apps",
      routeIntents: {
        overview: {
          route: "/install",
        },
      },
      targetSummary: {
        app: 1,
        runtime: 1,
        tooling: 1,
      },
      variants: expect.arrayContaining([
        expect.objectContaining({
          id: "app-installer",
          targetKind: "app",
        }),
      ]),
    });
  });
});
