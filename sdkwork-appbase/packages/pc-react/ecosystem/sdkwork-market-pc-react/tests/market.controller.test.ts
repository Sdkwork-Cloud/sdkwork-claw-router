import { describe, expect, it, vi } from "vitest";
import * as marketModule from "../src";

function createCatalog() {
  return {
    context: {
      isAuthenticated: true,
      workspaceId: "workspace-1",
    },
    filters: {
      categories: [
        { count: 3, id: "all", label: "All" },
        { count: 2, id: "automation", label: "Automation" },
        { count: 1, id: "templates", label: "Templates" },
      ],
      kindOptions: [
        { count: 3, id: "all", label: "All kinds" },
        { count: 1, id: "plugin", label: "Plugins" },
        { count: 1, id: "app", label: "Apps" },
        { count: 1, id: "template", label: "Templates" },
      ],
      sortOptions: [
        { id: "recommended", label: "Recommended" },
        { id: "rating", label: "Rating" },
      ],
      sourceOptions: [
        { count: 3, id: "all", label: "All sources" },
        { count: 2, id: "market", label: "Market" },
        { count: 1, id: "bundled", label: "Bundled" },
      ],
    },
    items: [
      {
        author: "SDKWORK",
        categories: ["automation"],
        categoryId: "automation",
        description: "Featured plugin.",
        downloads: 4500,
        featured: true,
        id: "plugin-agentops",
        installRoute: "/plugins/install?id=plugin-agentops",
        installed: true,
        kind: "plugin",
        lastUpdatedAt: "2026-03-11T12:00:00.000Z",
        rating: 4.9,
        recommended: true,
        route: "/market/items/plugin-agentops",
        sourceKind: "market",
        tags: ["agent", "ops"],
        title: "AgentOps Plugin",
      },
      {
        author: "SDKWORK",
        categories: ["automation"],
        categoryId: "automation",
        description: "Operations app.",
        downloads: 3200,
        featured: false,
        id: "app-ops-center",
        installRoute: "/apps/install?id=app-ops-center",
        installed: false,
        kind: "app",
        lastUpdatedAt: "2026-03-09T09:00:00.000Z",
        rating: 4.6,
        recommended: false,
        route: "/market/items/app-ops-center",
        sourceKind: "market",
        tags: ["ops", "workspace"],
        title: "Ops Center",
      },
      {
        author: "SDKWORK",
        categories: ["templates"],
        categoryId: "templates",
        description: "Reusable template set.",
        downloads: 900,
        featured: false,
        id: "template-workflow-pack",
        installRoute: "/templates/open?id=template-workflow-pack",
        installed: false,
        kind: "template",
        lastUpdatedAt: "2026-02-01T09:00:00.000Z",
        rating: 4.3,
        recommended: false,
        route: "/market/items/template-workflow-pack",
        sourceKind: "bundled",
        tags: ["template"],
        title: "Workflow Template Pack",
      },
    ],
    summary: {
      categoryCount: 2,
      featuredItemId: "plugin-agentops",
      installedItems: 1,
      itemCount: 3,
      recommendedItemIds: ["plugin-agentops"],
    },
  };
}

describe("sdkwork-market-pc-react controller", () => {
  it("bootstraps data, applies filters, and normalizes selection through refresh", async () => {
    const createSdkworkMarketController = (marketModule as Record<string, any>).createSdkworkMarketController;

    expect(createSdkworkMarketController).toBeTypeOf("function");

    const service = {
      getCatalog: vi.fn().mockResolvedValue(createCatalog()),
      getEmptyCatalog: vi.fn().mockReturnValue({
        ...createCatalog(),
        items: createCatalog().items.slice(0, 1),
        summary: {
          ...createCatalog().summary,
          itemCount: 1,
        },
      }),
    };

    const controller = createSdkworkMarketController({
      service,
    });

    expect(controller.getState().selectedItemId).toBe("plugin-agentops");
    expect(controller.getState().visibleItems).toHaveLength(1);

    await controller.bootstrap();
    expect(controller.getState().visibleItems).toHaveLength(3);
    expect(controller.getState().selectedItemId).toBe("plugin-agentops");

    controller.setKind("template");
    expect(controller.getState().visibleItems.map((item: { id: string }) => item.id)).toEqual([
      "template-workflow-pack",
    ]);

    controller.setSearchQuery("ops");
    expect(controller.getState().visibleItems).toHaveLength(0);

    controller.setKind("all");
    expect(controller.getState().visibleItems.map((item: { id: string }) => item.id)).toEqual([
      "plugin-agentops",
      "app-ops-center",
    ]);

    controller.selectItem("app-ops-center");
    expect(controller.getState().selectedItemId).toBe("app-ops-center");

    await controller.refresh();
    expect(controller.getState().selectedItemId).toBe("app-ops-center");
    expect(controller.getState().isBootstrapped).toBe(true);
  });
});
