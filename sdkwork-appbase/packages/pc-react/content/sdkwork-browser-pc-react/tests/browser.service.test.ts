import { describe, expect, it, vi } from "vitest";
import { createSdkworkBrowserService } from "../src";

describe("sdkwork-browser-pc-react service", () => {
  it("returns runtime-aware browser workspace and falls back on rejected list calls", async () => {
    const listTabs = vi.fn()
      .mockResolvedValueOnce([
        {
          active: true,
          groupId: "operations",
          id: "tab-release-console",
          lastVisitedAt: "2026-04-03T08:20:00.000Z",
          permissionReadiness: "review",
          permissions: [],
          pinned: false,
          posture: "review",
          route: "/browser?tabId=tab-release-console",
          safeMode: "strict",
          title: "Release Console",
          url: "https://ops.sdkwork.local/releases",
        },
      ])
      .mockRejectedValueOnce(new Error("offline"));

    const service = createSdkworkBrowserService({
      fallbackGroups: [
        {
          description: "Docs",
          domains: ["docs.sdkwork.local"],
          id: "docs",
          title: "Documentation",
          trustLevel: "trusted",
        },
      ],
      fallbackTabs: [
        {
          active: false,
          groupId: "docs",
          id: "tab-docs",
          lastVisitedAt: "2026-04-02T08:20:00.000Z",
          permissionReadiness: "ready",
          permissions: [],
          pinned: true,
          posture: "secure",
          route: "/browser?tabId=tab-docs",
          safeMode: "balanced",
          title: "Platform Docs",
          url: "https://docs.sdkwork.local/platform",
        },
      ],
      getSessionTokens: () => ({ authToken: "token" }),
      listTabs,
      workspaceId: "workspace-1",
    });

    const first = await service.getWorkspace();
    expect(first.context.isAuthenticated).toBe(true);
    expect(first.context.workspaceId).toBe("workspace-1");
    expect(first.tabs[0]?.id).toBe("tab-release-console");

    const second = await service.getWorkspace();
    expect(second.tabs[0]?.id).toBe("tab-docs");
    expect(second.summary.tabCount).toBe(1);
  });
});
