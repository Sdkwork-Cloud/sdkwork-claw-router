import { describe, expect, it, vi } from "vitest";
import * as marketModule from "../src";

describe("sdkwork-market-pc-react service", () => {
  it("builds market catalog data from deterministic source records", async () => {
    const createSdkworkMarketService = (marketModule as Record<string, any>).createSdkworkMarketService;

    expect(createSdkworkMarketService).toBeTypeOf("function");

    const service = createSdkworkMarketService({
      getSessionTokens: () => ({
        authToken: "runtime-token",
      }),
      listItems: vi.fn().mockResolvedValue([
        {
          author: "SDKWORK",
          categories: ["automation", "plugin"],
          categoryId: "automation",
          description: "Install market-ready plugins for orchestrations.",
          downloads: 4200,
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
          categories: ["models"],
          categoryId: "models",
          description: "Production model catalog for deployable routes.",
          downloads: 2700,
          featured: false,
          id: "model-pro-routes",
          installRoute: "/models/open?id=model-pro-routes",
          installed: false,
          kind: "model",
          lastUpdatedAt: "2026-02-18T08:00:00.000Z",
          rating: 4.7,
          recommended: false,
          route: "/market/items/model-pro-routes",
          sourceKind: "bundled",
          tags: ["model", "route"],
          title: "Pro Routes Model Pack",
        },
      ]),
    });

    const emptyCatalog = service.getEmptyCatalog();
    expect(emptyCatalog.summary.itemCount).toBeGreaterThanOrEqual(5);

    const catalog = await service.getCatalog();
    expect(catalog.summary).toMatchObject({
      featuredItemId: "plugin-agentops",
      installedItems: 1,
      itemCount: 2,
      recommendedItemIds: ["plugin-agentops"],
    });
    expect(catalog.filters.categories).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "all",
        }),
        expect.objectContaining({
          id: "automation",
        }),
      ]),
    );
    expect(catalog.items[0]).toMatchObject({
      featured: true,
      id: "plugin-agentops",
      kind: "plugin",
    });
    expect(catalog.context).toMatchObject({
      isAuthenticated: true,
    });
  });
});
