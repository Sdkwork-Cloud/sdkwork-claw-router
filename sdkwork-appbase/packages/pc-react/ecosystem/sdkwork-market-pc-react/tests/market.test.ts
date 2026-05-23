import { describe, expect, it } from "vitest";
import * as marketModule from "../src";

function createItem(overrides: Record<string, unknown> = {}) {
  return {
    author: "SDKWORK",
    categories: ["automation"],
    categoryId: "automation",
    description: "Market capability item.",
    downloads: 1200,
    featured: false,
    id: "item",
    installRoute: "/plugins/install?id=item",
    installed: false,
    kind: "plugin",
    lastUpdatedAt: "2026-01-01T00:00:00.000Z",
    rating: 4.6,
    recommended: false,
    route: "/market/item",
    sourceKind: "market",
    tags: ["tooling"],
    title: "Item",
    ...overrides,
  };
}

describe("sdkwork-market-pc-react headless contract", () => {
  it("creates manifests, route intents, install intents, sorting, filtering, and baseline catalog", () => {
    const {
      createEmptySdkworkMarketCatalog,
      createMarketInstallRouteIntent,
      createMarketRouteIntent,
      createMarketWorkspaceManifest,
      filterSdkworkMarketItems,
      marketPackageMeta,
      sortSdkworkMarketItems,
      summarizeSdkworkMarketItems,
    } = marketModule as unknown as Record<string, (...args: any[]) => any> & {
      marketPackageMeta?: unknown;
    };

    expect(marketPackageMeta).toMatchObject({
      domain: "ecosystem",
      package: "@sdkwork/market-pc-react",
      status: "ready",
    });

    expect(
      createMarketWorkspaceManifest({
        title: "Market",
      }),
    ).toMatchObject({
      capability: "market",
      packageNames: [
        "@sdkwork/market-pc-react",
        "@sdkwork/plugin-pc-react",
        "@sdkwork/apps-pc-react",
        "@sdkwork/skills-pc-react",
        "@sdkwork/models-pc-react",
      ],
      routePath: "/market",
      title: "Market",
    });

    expect(
      createMarketRouteIntent({
        categoryId: "automation",
        kind: "plugin",
        searchQuery: "agent",
        sortBy: "rating",
      }),
    ).toEqual({
      categoryId: "automation",
      focusWindow: true,
      kind: "plugin",
      route: "/market?kind=plugin&categoryId=automation&q=agent&sort=rating",
      searchQuery: "agent",
      sortBy: "rating",
      source: "market-workspace",
      type: "market-route-intent",
    });

    expect(
      createMarketInstallRouteIntent({
        itemId: "plugin-gitops",
        kind: "plugin",
        sourceKind: "market",
      }),
    ).toEqual({
      focusWindow: true,
      itemId: "plugin-gitops",
      kind: "plugin",
      route: "/market/install?kind=plugin&itemId=plugin-gitops&source=market",
      source: "market-workspace",
      sourceKind: "market",
      type: "market-install-route-intent",
    });

    const sorted = sortSdkworkMarketItems(
      [
        createItem({
          downloads: 2000,
          id: "plugin-agent",
          rating: 4.9,
          recommended: true,
          title: "Agent Plugin",
        }),
        createItem({
          featured: true,
          id: "app-ops",
          kind: "app",
          rating: 4.5,
          title: "Ops App",
        }),
        createItem({
          categoryId: "templates",
          id: "template-kit",
          kind: "template",
          rating: 4.7,
          title: "Template Kit",
        }),
      ],
      "recommended",
    );

    expect(sorted.map((item: { id: string }) => item.id)).toEqual([
      "app-ops",
      "plugin-agent",
      "template-kit",
    ]);

    const filtered = filterSdkworkMarketItems(sorted, {
      activeCategoryId: "all",
      activeKind: "plugin",
      activeSourceKind: "all",
      query: "agent",
      sortBy: "recommended",
    });

    expect(filtered.map((item: { id: string }) => item.id)).toEqual(["plugin-agent"]);

    expect(summarizeSdkworkMarketItems(sorted)).toMatchObject({
      categoryCount: 2,
      featuredItemId: "app-ops",
      installedItems: 0,
      itemCount: 3,
      recommendedItemIds: ["plugin-agent"],
    });

    const emptyCatalog = createEmptySdkworkMarketCatalog();
    expect(emptyCatalog.items.length).toBeGreaterThanOrEqual(5);
    expect(emptyCatalog.filters.sortOptions.length).toBeGreaterThan(0);
    expect(emptyCatalog.summary.featuredItemId).toBeTruthy();
  });
});
