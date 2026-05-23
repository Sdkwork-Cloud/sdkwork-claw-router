import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it, vi } from "vitest";
import { SdkworkThemeProvider } from "@sdkwork/ui-pc-react/theme";
import * as pluginModule from "../src";

function createPlugin(overrides: Record<string, unknown> = {}) {
  return {
    author: "SDKWORK",
    compatibility: "compatible",
    description: "Plugin capability entry.",
    health: "healthy",
    id: "plugin",
    installRoute: "/plugins/action?action=open&pluginId=plugin",
    installState: "installed",
    kind: "plugin",
    lastUpdatedAt: "2026-03-01T00:00:00.000Z",
    name: "Plugin",
    permissionReadiness: "ready",
    permissions: [
      {
        granted: true,
        id: "workspace.read",
        required: true,
      },
    ],
    riskLevel: "low",
    route: "/plugins/plugin",
    sourceKind: "bundled",
    updateAvailable: false,
    version: "1.0.0",
    ...overrides,
  };
}

describe("sdkwork-plugin-pc-react page", () => {
  it("renders plugin center, filters by source, and routes install actions from selected plugin", async () => {
    const createEmptySdkworkPluginRegistry = (pluginModule as Record<string, any>).createEmptySdkworkPluginRegistry;
    const Page = (pluginModule as Record<string, any>).SdkworkPluginPage;
    const onNavigate = vi.fn();

    expect(Page).toBeTypeOf("function");

    const fullRegistry = createEmptySdkworkPluginRegistry({
      context: {
        isAuthenticated: true,
        workspaceId: "workspace-1",
      },
      plugins: [
        createPlugin({
          id: "plugin-bundled-core",
          name: "Bundled Core Plugin",
        }),
        createPlugin({
          id: "plugin-market-ops",
          installRoute: "/plugins/action?action=install&pluginId=plugin-market-ops",
          installState: "update-available",
          name: "Market Ops Plugin",
          sourceKind: "market",
          updateAvailable: true,
        }),
        createPlugin({
          compatibility: "partial",
          health: "degraded",
          id: "plugin-private-audit",
          installRoute: "/plugins/action?action=install&pluginId=plugin-private-audit",
          installState: "not-installed",
          name: "Private Audit Plugin",
          permissionReadiness: "review",
          riskLevel: "high",
          sourceKind: "private",
        }),
      ],
    });

    render(
      <SdkworkThemeProvider defaultTheme="light">
        <Page
          onNavigate={onNavigate}
          service={{
            getEmptyRegistry: vi.fn().mockReturnValue(
              createEmptySdkworkPluginRegistry({
                context: {
                  isAuthenticated: true,
                  workspaceId: "workspace-1",
                },
                plugins: [
                  createPlugin({
                    id: "plugin-bundled-core",
                    name: "Bundled Core Plugin",
                  }),
                ],
              }),
            ),
            getRegistry: vi.fn().mockResolvedValue(fullRegistry),
          }}
        />
      </SdkworkThemeProvider>,
    );

    expect(
      await screen.findByRole("heading", {
        name: /plugin center/i,
      }),
    ).toBeInTheDocument();

    expect(await screen.findByText("Market Ops Plugin")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: /^private$/i,
      }),
    );
    expect(screen.getAllByText("Private Audit Plugin").length).toBeGreaterThan(0);

    fireEvent.click(
      screen.getByRole("button", {
        name: /select private audit plugin/i,
      }),
    );
    fireEvent.click(
      screen.getAllByRole("button", {
        name: /install private audit plugin/i,
      })[0],
    );
    expect(onNavigate).toHaveBeenCalledWith("/plugins/action?action=install&pluginId=plugin-private-audit");
  });
});
