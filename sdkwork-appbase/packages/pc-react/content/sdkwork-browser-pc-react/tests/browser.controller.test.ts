import { describe, expect, it, vi } from "vitest";
import {
  createEmptySdkworkBrowserWorkspace,
  createSdkworkBrowserController,
} from "../src";

describe("sdkwork-browser-pc-react controller", () => {
  it("bootstraps browser workspace and applies group/safe-mode/search filters", async () => {
    const fullWorkspace = createEmptySdkworkBrowserWorkspace({
      context: {
        isAuthenticated: true,
      },
      groups: [
        {
          description: "Docs",
          domains: ["docs.sdkwork.local"],
          id: "docs",
          title: "Documentation",
          trustLevel: "trusted",
        },
        {
          description: "Ops",
          domains: ["ops.sdkwork.local"],
          id: "operations",
          title: "Operations",
          trustLevel: "review",
        },
      ],
      tabs: [
        {
          active: true,
          groupId: "docs",
          id: "tab-docs",
          lastVisitedAt: "2026-04-03T09:00:00.000Z",
          permissionReadiness: "ready",
          permissions: [],
          pinned: true,
          posture: "secure",
          route: "/browser?tabId=tab-docs",
          safeMode: "balanced",
          title: "Platform Docs",
          url: "https://docs.sdkwork.local/platform",
        },
        {
          active: false,
          groupId: "operations",
          id: "tab-ops",
          lastVisitedAt: "2026-04-03T08:00:00.000Z",
          permissionReadiness: "review",
          permissions: [],
          pinned: false,
          posture: "review",
          route: "/browser?tabId=tab-ops",
          safeMode: "strict",
          title: "Ops Console",
          url: "https://ops.sdkwork.local/releases",
        },
      ],
    });

    const controller = createSdkworkBrowserController({
      service: {
        getEmptyWorkspace: vi.fn().mockReturnValue(
          createEmptySdkworkBrowserWorkspace({
            groups: fullWorkspace.groups,
            tabs: fullWorkspace.tabs.slice(0, 1),
          }),
        ),
        getWorkspace: vi.fn().mockResolvedValue(fullWorkspace),
      },
    });

    expect(controller.getState().visibleTabs).toHaveLength(1);
    await controller.bootstrap();
    expect(controller.getState().visibleTabs).toHaveLength(2);

    controller.setGroupId("operations");
    expect(controller.getState().visibleTabs.map((tab) => tab.id)).toEqual(["tab-ops"]);

    controller.setSafeMode("strict");
    expect(controller.getState().visibleTabs.map((tab) => tab.id)).toEqual(["tab-ops"]);

    controller.setSearchQuery("docs");
    expect(controller.getState().visibleTabs).toHaveLength(0);

    controller.setGroupId("all");
    controller.setSafeMode("all");
    controller.setSearchQuery("ops");
    expect(controller.getState().visibleTabs.map((tab) => tab.id)).toEqual(["tab-ops"]);
  });
});
