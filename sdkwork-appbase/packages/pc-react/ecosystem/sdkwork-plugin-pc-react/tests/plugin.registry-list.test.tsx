import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it, vi } from "vitest";
import { SdkworkThemeProvider } from "@sdkwork/ui-pc-react/theme";
import * as pluginModule from "../src";

const plugins = [
  {
    author: "SDKWORK",
    compatibility: "compatible",
    description: "Bundled plugin.",
    health: "healthy",
    id: "plugin-bundled-core",
    installRoute: "/plugins/action?action=open&pluginId=plugin-bundled-core",
    installState: "installed",
    kind: "plugin",
    lastUpdatedAt: "2026-03-01T00:00:00.000Z",
    name: "Bundled Core Plugin",
    permissionReadiness: "ready",
    permissions: [
      {
        granted: true,
        id: "workspace.read",
        required: true,
      },
    ],
    riskLevel: "low",
    route: "/plugins/plugin-bundled-core",
    sourceKind: "bundled",
    updateAvailable: false,
    version: "1.2.0",
  },
  {
    author: "SDKWORK",
    compatibility: "compatible",
    description: "Market plugin.",
    health: "healthy",
    id: "plugin-market-ops",
    installRoute: "/plugins/action?action=install&pluginId=plugin-market-ops",
    installState: "update-available",
    kind: "plugin",
    lastUpdatedAt: "2026-03-18T00:00:00.000Z",
    name: "Market Ops Plugin",
    permissionReadiness: "ready",
    permissions: [
      {
        granted: true,
        id: "workspace.write",
        required: true,
      },
    ],
    riskLevel: "medium",
    route: "/plugins/plugin-market-ops",
    sourceKind: "market",
    updateAvailable: true,
    version: "1.6.0",
  },
];

describe("sdkwork-plugin-pc-react registry list", () => {
  it("renders plugin rows and dispatches selection plus lifecycle actions", () => {
    const RegistryList = (pluginModule as Record<string, any>).SdkworkPluginRegistryList;
    const onNavigate = vi.fn();
    const onSelectPlugin = vi.fn();

    expect(RegistryList).toBeTypeOf("function");

    render(
      <SdkworkThemeProvider defaultTheme="light">
        <RegistryList
          onNavigate={onNavigate}
          onSelectPlugin={onSelectPlugin}
          plugins={plugins}
          selectedPluginId="plugin-bundled-core"
        />
      </SdkworkThemeProvider>,
    );

    expect(screen.getByText("Bundled Core Plugin")).toBeInTheDocument();
    expect(screen.getByText("Market Ops Plugin")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: /select market ops plugin/i,
      }),
    );
    expect(onSelectPlugin).toHaveBeenCalledWith("plugin-market-ops");

    fireEvent.click(
      screen.getByRole("button", {
        name: /update market ops plugin/i,
      }),
    );
    expect(onNavigate).toHaveBeenCalledWith("/plugins/action?action=install&pluginId=plugin-market-ops");
  });
});
