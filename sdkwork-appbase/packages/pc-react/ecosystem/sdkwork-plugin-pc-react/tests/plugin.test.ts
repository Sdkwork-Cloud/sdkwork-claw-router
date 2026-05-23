import { describe, expect, it } from "vitest";
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

describe("sdkwork-plugin-pc-react headless contract", () => {
  it("creates manifests and route intents while sorting, filtering, and summarizing plugin registries", () => {
    const {
      createEmptySdkworkPluginRegistry,
      createPluginActionRouteIntent,
      createPluginRouteIntent,
      createPluginWorkspaceManifest,
      filterSdkworkPlugins,
      pluginPackageMeta,
      sortSdkworkPlugins,
      summarizeSdkworkPlugins,
    } = pluginModule as unknown as Record<string, (...args: any[]) => any> & {
      pluginPackageMeta?: unknown;
    };

    expect(pluginPackageMeta).toMatchObject({
      domain: "ecosystem",
      package: "@sdkwork/plugin-pc-react",
      status: "ready",
    });

    expect(
      createPluginWorkspaceManifest({
        title: "Plugin Center",
      }),
    ).toMatchObject({
      capability: "plugin",
      packageNames: [
        "@sdkwork/plugin-pc-react",
        "@sdkwork/market-pc-react",
        "@sdkwork/permission-pc-react",
        "@sdkwork/apps-pc-react",
      ],
      routePath: "/plugins",
      title: "Plugin Center",
    });

    expect(
      createPluginRouteIntent({
        pluginId: "plugin-agentops",
      }),
    ).toEqual({
      focusWindow: true,
      pluginId: "plugin-agentops",
      route: "/plugins?pluginId=plugin-agentops",
      source: "plugin-workspace",
      type: "plugin-route-intent",
    });

    expect(
      createPluginActionRouteIntent({
        action: "install",
        pluginId: "plugin-agentops",
      }),
    ).toEqual({
      action: "install",
      focusWindow: true,
      pluginId: "plugin-agentops",
      route: "/plugins/action?action=install&pluginId=plugin-agentops",
      source: "plugin-workspace",
      type: "plugin-action-route-intent",
    });

    const sorted = sortSdkworkPlugins([
      createPlugin({
        id: "plugin-market-ops",
        installRoute: "/plugins/action?action=install&pluginId=plugin-market-ops",
        installState: "update-available",
        name: "Market Ops Plugin",
        sourceKind: "market",
        updateAvailable: true,
      }),
      createPlugin({
        id: "plugin-legacy",
        compatibility: "incompatible",
        health: "blocked",
        installRoute: "/plugins/action?action=enable&pluginId=plugin-legacy",
        installState: "disabled",
        name: "Legacy Connector",
        permissionReadiness: "missing",
        riskLevel: "high",
        sourceKind: "local",
      }),
      createPlugin({
        id: "plugin-bundled-core",
        name: "Bundled Core Plugin",
      }),
    ]);

    expect(sorted.map((plugin: { id: string }) => plugin.id)).toEqual([
      "plugin-market-ops",
      "plugin-bundled-core",
      "plugin-legacy",
    ]);

    const filtered = filterSdkworkPlugins(sorted, {
      activeInstallState: "all",
      activeRiskLevel: "all",
      activeSourceKind: "market",
      query: "ops",
      sortBy: "readiness",
    });
    expect(filtered.map((plugin: { id: string }) => plugin.id)).toEqual(["plugin-market-ops"]);

    expect(summarizeSdkworkPlugins(sorted)).toMatchObject({
      blockedPlugins: 1,
      highRiskPlugins: 1,
      installedPlugins: 2,
      pluginCount: 3,
      readyPlugins: 2,
      updatesAvailable: 1,
    });

    const emptyRegistry = createEmptySdkworkPluginRegistry();
    expect(emptyRegistry.plugins.length).toBeGreaterThanOrEqual(4);
    expect(emptyRegistry.summary.pluginCount).toBeGreaterThanOrEqual(4);
    expect(emptyRegistry.filters.sourceOptions.length).toBeGreaterThan(0);
  });
});
