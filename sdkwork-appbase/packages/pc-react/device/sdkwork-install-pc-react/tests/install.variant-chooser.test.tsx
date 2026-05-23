import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SdkworkThemeProvider } from "@sdkwork/ui-pc-react/theme";
import * as installModule from "../src";

const variants = [
  {
    dependencies: [
      {
        autoFixAvailable: false,
        detail: "Node.js runtime available",
        id: "nodejs",
        label: "Node.js",
        status: "ready",
      },
    ],
    description: "Desktop application installer",
    estimatedMinutes: 6,
    hostPlatforms: ["windows"],
    id: "app-installer",
    installPath: "C:\\SDKWORK\\Apps",
    recommended: true,
    route: "/install?variantId=app-installer",
    runtimePlatform: "native",
    tags: ["app", "recommended"],
    targetKind: "app",
    title: "Desktop App Installer",
  },
  {
    dependencies: [
      {
        autoFixAvailable: true,
        detail: "Docker engine",
        id: "docker",
        label: "Docker",
        status: "warning",
      },
    ],
    description: "Container runtime package",
    estimatedMinutes: 9,
    hostPlatforms: ["windows", "linux"],
    id: "runtime-docker",
    installPath: "C:\\SDKWORK\\Runtime",
    recommended: false,
    route: "/install?variantId=runtime-docker",
    runtimePlatform: "container",
    tags: ["runtime", "docker"],
    targetKind: "runtime",
    title: "Container Runtime",
  },
];

describe("sdkwork-install-pc-react variant chooser", () => {
  it("renders install variants, supports selection, and triggers route navigation", () => {
    const InstallVariantChooser = (installModule as Record<string, any>).SdkworkInstallVariantChooser;
    const onNavigate = vi.fn();
    const onSelectVariant = vi.fn();

    expect(InstallVariantChooser).toBeTypeOf("function");

    render(
      <SdkworkThemeProvider defaultTheme="light">
        <InstallVariantChooser
          onNavigate={onNavigate}
          onSelectVariant={onSelectVariant}
          selectedVariantId="app-installer"
          variants={variants}
        />
      </SdkworkThemeProvider>,
    );

    expect(screen.getByText("Desktop App Installer")).toBeTruthy();
    expect(screen.getByText("Container Runtime")).toBeTruthy();

    fireEvent.click(
      screen.getByRole("button", {
        name: /select container runtime/i,
      }),
    );
    expect(onSelectVariant).toHaveBeenCalledWith("runtime-docker");

    fireEvent.click(
      screen.getByRole("button", {
        name: /open install route for desktop app installer/i,
      }),
    );
    expect(onNavigate).toHaveBeenCalledWith("/install?variantId=app-installer");
  });
});
