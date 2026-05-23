import { describe, expect, it } from "vitest";
import * as installModule from "../src";

function createVariants() {
  return [
    {
      dependencies: [
        {
          autoFixAvailable: false,
          detail: "Node 20+",
          id: "nodejs",
          label: "Node.js",
          status: "warning",
        },
      ],
      description: "Runtime for managed containers.",
      estimatedMinutes: 8,
      hostPlatforms: ["windows", "linux"],
      id: "runtime-docker",
      installPath: "C:\\SDKWORK\\Runtime",
      recommended: true,
      route: "/install?variantId=runtime-docker",
      runtimePlatform: "container",
      tags: ["docker", "runtime"],
      targetKind: "runtime",
      title: "Container Runtime",
    },
    {
      dependencies: [
        {
          autoFixAvailable: true,
          detail: "Core runtime must be installed first",
          id: "core-runtime",
          label: "Core Runtime",
          status: "blocked",
        },
      ],
      description: "Desktop app package.",
      estimatedMinutes: 5,
      hostPlatforms: ["windows"],
      id: "app-installer",
      installPath: "C:\\SDKWORK\\Apps",
      recommended: false,
      route: "/install?variantId=app-installer",
      runtimePlatform: "native",
      tags: ["app"],
      targetKind: "app",
      title: "Desktop App Installer",
    },
  ];
}

describe("sdkwork-install-pc-react service", () => {
  it("resolves recommended variant, readiness, and target filtering", async () => {
    const createSdkworkInstallService = (installModule as Record<string, any>).createSdkworkInstallService;

    expect(createSdkworkInstallService).toBeTypeOf("function");

    const service = createSdkworkInstallService({
      getRuntimeContext: () => ({
        hasContainerRuntime: true,
        hostPlatform: "windows",
        nodeAvailable: false,
        runtimeReady: true,
      }),
      getSessionTokens: () => ({
        authToken: "token-123",
      }),
      variants: createVariants(),
    });

    expect(
      service.getEmptyCatalog({
        targetKind: "runtime",
      }),
    ).toMatchObject({
      hostPlatform: "windows",
      isAuthenticated: true,
      selectedVariantId: "runtime-docker",
      variants: [
        {
          id: "runtime-docker",
        },
      ],
    });

    const catalog = await service.getCatalog({
      targetKind: "runtime",
    });

    expect(catalog.selectedVariantId).toBe("runtime-docker");
    expect(catalog.recommendedInstallPath).toBe("C:\\SDKWORK\\Runtime");
    expect(catalog.readiness).toMatchObject({
      blockedDependencies: 0,
      status: "warning",
      warningDependencies: 1,
    });
    expect(catalog.progress).toMatchObject({
      completedSteps: 1,
      totalSteps: 5,
    });
    expect(catalog.routeIntents.variants.route).toContain("section=variants");
    expect(catalog.variants.map((item: { id: string }) => item.id)).toEqual([
      "runtime-docker",
    ]);
  });
});
