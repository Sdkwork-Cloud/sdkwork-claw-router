import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SdkworkThemeProvider } from "@sdkwork/ui-pc-react/theme";
import * as installModule from "../src";

function createCatalog() {
  return {
    hostPlatform: "windows",
    isAuthenticated: true,
    progress: {
      blockedSteps: 0,
      completedSteps: 1,
      pendingSteps: 3,
      progressPercent: 20,
      runningStepId: "install",
      totalSteps: 5,
      warningSteps: 1,
    },
    readiness: {
      blockedDependencies: 0,
      readyDependencies: 2,
      status: "warning",
      totalDependencies: 3,
      warningDependencies: 1,
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
        description: "Apply install package.",
        id: "install",
        progressPercent: 35,
        status: "running",
        title: "Install",
      },
      {
        description: "Configure system settings.",
        id: "configure",
        progressPercent: 0,
        status: "pending",
        title: "Configure",
      },
      {
        description: "Initialize workspace resources.",
        id: "initialize",
        progressPercent: 0,
        status: "pending",
        title: "Initialize",
      },
      {
        description: "Verify health checks.",
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
        description: "Desktop app installer.",
        estimatedMinutes: 5,
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
        description: "Container runtime package.",
        estimatedMinutes: 9,
        hostPlatforms: ["windows", "linux"],
        id: "runtime-docker",
        installPath: "C:\\SDKWORK\\Runtime",
        recommended: false,
        route: "/install?variantId=runtime-docker",
        runtimePlatform: "container",
        tags: ["runtime"],
        targetKind: "runtime",
        title: "Container Runtime",
      },
      {
        dependencies: [],
        description: "CLI support package.",
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

describe("sdkwork-install-pc-react page", () => {
  it("renders install center, filters variants by target kind, and navigates to selected install route", async () => {
    const Page = (installModule as Record<string, any>).SdkworkInstallPage;
    const onNavigate = vi.fn();

    expect(Page).toBeTypeOf("function");

    render(
      <SdkworkThemeProvider defaultTheme="light">
        <Page
          onNavigate={onNavigate}
          service={{
            getCatalog: vi.fn().mockResolvedValue(createCatalog()),
            getEmptyCatalog: vi.fn().mockReturnValue({
              ...createCatalog(),
              isAuthenticated: false,
              selectedVariantId: "tooling-cli",
              variants: [createCatalog().variants[2]],
            }),
          }}
        />
      </SdkworkThemeProvider>,
    );

    expect(
      await screen.findByRole("heading", {
        name: /install center/i,
      }),
    ).toBeTruthy();

    fireEvent.click(
      screen.getByRole("button", {
        name: /^runtime$/i,
      }),
    );
    expect(screen.getAllByText("Container Runtime").length).toBeGreaterThan(0);

    fireEvent.click(
      screen.getByRole("button", {
        name: /^app$/i,
      }),
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: /open install route for desktop app installer/i,
      }),
    );
    expect(onNavigate).toHaveBeenCalledWith("/install?variantId=app-installer");
  });
});
