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

describe("sdkwork-plugin-pc-react service", () => {
  it("builds plugin registry data with source, install-state, and readiness summaries", async () => {
    const createSdkworkPluginService = (pluginModule as Record<string, any>).createSdkworkPluginService;

    expect(createSdkworkPluginService).toBeTypeOf("function");

    const service = createSdkworkPluginService({
      fallbackPlugins: [
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
      getSessionTokens: () => ({
        authToken: "runtime-token",
      }),
      listPlugins: vi.fn().mockResolvedValue([
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
      ]),
    });

    const emptyRegistry = service.getEmptyRegistry();
    expect(emptyRegistry.plugins.length).toBe(2);

    const registry = await service.getRegistry();
    expect(registry.context).toMatchObject({
      isAuthenticated: true,
    });
    expect(registry.summary).toMatchObject({
      highRiskPlugins: 1,
      installedPlugins: 1,
      pluginCount: 2,
      updatesAvailable: 1,
    });
    expect(registry.plugins[0]).toMatchObject({
      id: "plugin-market-ops",
      installState: "update-available",
    });
    expect(registry.filters.sourceOptions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "market",
        }),
        expect.objectContaining({
          id: "private",
        }),
      ]),
    );
  });
});
