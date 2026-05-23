import { describe, expect, it, vi } from "vitest";
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

describe("sdkwork-plugin-pc-react controller", () => {
  it("bootstraps registry, applies source and install-state filters, and keeps selection on refresh", async () => {
    const createEmptySdkworkPluginRegistry = (pluginModule as Record<string, any>).createEmptySdkworkPluginRegistry;
    const createSdkworkPluginController = (pluginModule as Record<string, any>).createSdkworkPluginController;

    expect(createSdkworkPluginController).toBeTypeOf("function");

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
          riskLevel: "medium",
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

    const service = {
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
    };

    const controller = createSdkworkPluginController({
      service,
    });

    expect(controller.getState().selectedPluginId).toBe("plugin-bundled-core");
    expect(controller.getState().visiblePlugins).toHaveLength(1);

    await controller.bootstrap();
    expect(controller.getState().visiblePlugins).toHaveLength(3);

    controller.setSourceKind("private");
    expect(controller.getState().visiblePlugins.map((plugin: { id: string }) => plugin.id)).toEqual([
      "plugin-private-audit",
    ]);

    controller.setInstallState("not-installed");
    expect(controller.getState().visiblePlugins.map((plugin: { id: string }) => plugin.id)).toEqual([
      "plugin-private-audit",
    ]);

    controller.setSearchQuery("market");
    expect(controller.getState().visiblePlugins).toHaveLength(0);

    controller.setSourceKind("all");
    controller.setInstallState("all");
    controller.setRiskLevel("medium");
    controller.setSearchQuery("ops");
    expect(controller.getState().visiblePlugins.map((plugin: { id: string }) => plugin.id)).toEqual([
      "plugin-market-ops",
    ]);

    controller.selectPlugin("plugin-market-ops");
    expect(controller.getState().selectedPluginId).toBe("plugin-market-ops");

    await controller.refresh();
    expect(controller.getState().selectedPluginId).toBe("plugin-market-ops");
  });
});
