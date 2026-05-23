import { describe, expect, it, vi } from "vitest";
import * as installModule from "../src";

function createCatalog() {
  return {
    hostPlatform: "windows",
    isAuthenticated: true,
    progress: {
      blockedSteps: 0,
      completedSteps: 2,
      pendingSteps: 2,
      progressPercent: 40,
      runningStepId: "configure",
      totalSteps: 5,
      warningSteps: 0,
    },
    readiness: {
      blockedDependencies: 0,
      readyDependencies: 2,
      status: "ready",
      totalDependencies: 2,
      warningDependencies: 0,
    },
    recommendedInstallPath: "C:\\SDKWORK\\Apps",
    recommendedVariantId: "app-installer",
    routeIntents: {
      overview: {
        focusWindow: true,
        route: "/install",
        source: "install-workspace",
        type: "install-route-intent",
      },
      steps: {
        focusWindow: true,
        route: "/install?section=steps",
        section: "steps",
        source: "install-workspace",
        type: "install-route-intent",
      },
      variants: {
        focusWindow: true,
        route: "/install?section=variants",
        section: "variants",
        source: "install-workspace",
        type: "install-route-intent",
      },
    },
    selectedVariantId: "app-installer",
    steps: [
      {
        description: "Validate prerequisites.",
        id: "dependencies",
        progressPercent: 100,
        status: "completed",
        title: "Dependencies",
      },
      {
        description: "Apply package install.",
        id: "install",
        progressPercent: 100,
        status: "completed",
        title: "Install",
      },
      {
        description: "Configure runtime.",
        id: "configure",
        progressPercent: 50,
        status: "running",
        title: "Configure",
      },
      {
        description: "Initialize resources.",
        id: "initialize",
        progressPercent: 0,
        status: "pending",
        title: "Initialize",
      },
      {
        description: "Verify readiness.",
        id: "verify",
        progressPercent: 0,
        status: "pending",
        title: "Verify",
      },
    ],
    targetSummary: {
      app: 1,
      runtime: 1,
      tooling: 1,
    },
    variants: [
      {
        dependencies: [],
        description: "Desktop app package",
        estimatedMinutes: 6,
        hostPlatforms: ["windows"],
        id: "app-installer",
        installPath: "C:\\SDKWORK\\Apps",
        recommended: true,
        route: "/install?variantId=app-installer",
        runtimePlatform: "native",
        tags: ["app"],
        targetKind: "app",
        title: "Desktop App Installer",
      },
      {
        dependencies: [],
        description: "Tooling support package",
        estimatedMinutes: 3,
        hostPlatforms: ["windows", "macos", "linux"],
        id: "tooling-cli",
        installPath: "C:\\SDKWORK\\Tooling",
        recommended: false,
        route: "/install?variantId=tooling-cli",
        runtimePlatform: "native",
        tags: ["tooling"],
        targetKind: "tooling",
        title: "CLI Tooling",
      },
    ],
  };
}

describe("sdkwork-install-pc-react controller", () => {
  it("bootstraps install data, filters variants, and keeps valid selection", async () => {
    const createSdkworkInstallController = (installModule as Record<string, any>).createSdkworkInstallController;

    expect(createSdkworkInstallController).toBeTypeOf("function");

    const service = {
      getCatalog: vi.fn().mockResolvedValue(createCatalog()),
      getEmptyCatalog: vi.fn().mockReturnValue({
        ...createCatalog(),
        isAuthenticated: false,
        selectedVariantId: "tooling-cli",
        variants: [createCatalog().variants[1]],
      }),
    };

    const controller = createSdkworkInstallController({
      service,
    });

    expect(controller.getState().selectedVariantId).toBe("tooling-cli");
    expect(controller.getState().visibleVariants).toHaveLength(1);

    await controller.bootstrap();
    expect(controller.getState().selectedVariantId).toBe("app-installer");
    expect(controller.getState().visibleVariants).toHaveLength(2);

    controller.setTargetKind("tooling");
    expect(controller.getState().visibleVariants.map((item: { id: string }) => item.id)).toEqual([
      "tooling-cli",
    ]);
    expect(controller.getState().selectedVariantId).toBe("tooling-cli");

    controller.setTargetKind("all");
    controller.selectVariant("app-installer");
    expect(controller.getState().selectedVariantId).toBe("app-installer");

    await controller.refresh();
    expect(controller.getState().selectedVariantId).toBe("app-installer");
  });
});
