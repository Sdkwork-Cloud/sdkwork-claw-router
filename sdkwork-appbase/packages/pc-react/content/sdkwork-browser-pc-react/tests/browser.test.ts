import { describe, expect, it } from "vitest";
import * as browserModule from "../src";

function createTab(overrides: Record<string, unknown> = {}) {
  return {
    active: false,
    groupId: "docs",
    id: "tab",
    lastVisitedAt: "2026-04-03T01:00:00.000Z",
    permissionReadiness: "ready",
    permissions: [],
    pinned: false,
    posture: "secure",
    route: "/browser?tabId=tab",
    safeMode: "balanced",
    title: "Tab",
    url: "https://docs.sdkwork.local/tab",
    ...overrides,
  };
}

describe("sdkwork-browser-pc-react domain contract", () => {
  it("creates browser manifest, route intent, filtering, and deterministic workspace summary", () => {
    const {
      browserPackageMeta,
      createBrowserRouteIntent,
      createBrowserWorkspaceManifest,
      createEmptySdkworkBrowserWorkspace,
      filterSdkworkBrowserTabs,
      sortSdkworkBrowserTabs,
      summarizeSdkworkBrowserWorkspace,
    } = browserModule as Record<string, any>;

    expect(browserPackageMeta).toMatchObject({
      domain: "content",
      package: "@sdkwork/browser-pc-react",
      status: "ready",
    });

    expect(createBrowserWorkspaceManifest({ title: "Browser Workspace" })).toMatchObject({
      capability: "browser",
      routePath: "/browser",
      title: "Browser Workspace",
    });

    expect(
      createBrowserRouteIntent({
        groupId: "operations",
        safeMode: "strict",
        tabId: "tab-release",
      }),
    ).toEqual({
      focusWindow: true,
      groupId: "operations",
      route: "/browser?groupId=operations&safeMode=strict&tabId=tab-release",
      safeMode: "strict",
      source: "browser-workspace",
      tabId: "tab-release",
      type: "browser-route-intent",
    });

    const tabs = sortSdkworkBrowserTabs([
      createTab({
        id: "tab-ops",
        lastVisitedAt: "2026-04-03T02:00:00.000Z",
        permissionReadiness: "review",
        posture: "review",
        safeMode: "strict",
        title: "Ops Console",
      }),
      createTab({
        active: true,
        id: "tab-docs",
        pinned: true,
        title: "Docs",
      }),
      createTab({
        groupId: "external",
        id: "tab-external",
        permissionReadiness: "blocked",
        posture: "offline",
        safeMode: "strict",
        title: "External",
      }),
    ]);

    expect(tabs.map((tab: { id: string }) => tab.id)).toEqual([
      "tab-docs",
      "tab-ops",
      "tab-external",
    ]);

    const filtered = filterSdkworkBrowserTabs(tabs, {
      activeGroupId: "all",
      activeSafeMode: "strict",
      query: "ops",
      sortBy: "activity",
    });
    expect(filtered.map((tab: { id: string }) => tab.id)).toEqual(["tab-ops"]);

    const summary = summarizeSdkworkBrowserWorkspace(tabs, [
      {
        description: "Docs",
        domains: ["docs.sdkwork.local"],
        id: "docs",
        title: "Docs",
        trustLevel: "trusted",
      },
      {
        description: "External",
        domains: ["example.org"],
        id: "external",
        title: "External",
        trustLevel: "blocked",
      },
    ]);
    expect(summary).toMatchObject({
      blockedTabs: 1,
      groupCount: 2,
      strictModeTabs: 2,
      tabCount: 3,
    });

    const workspace = createEmptySdkworkBrowserWorkspace();
    expect(workspace.tabs.length).toBeGreaterThanOrEqual(4);
    expect(workspace.groups.length).toBeGreaterThanOrEqual(3);
    expect(workspace.summary.tabCount).toBeGreaterThanOrEqual(4);
  });
});
