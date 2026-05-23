import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it, vi } from "vitest";
import { SdkworkThemeProvider } from "@sdkwork/ui-pc-react/theme";
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
      {
        author: "SDKWORK",
        categories: ["automation"],
        categoryId: "automation",
        description: "App console for operations.",
        downloads: 3300,
        featured: false,
        id: "app-ops-center",
        installRoute: "/apps/install?id=app-ops-center",
        installed: false,
        kind: "app",
        lastUpdatedAt: "2026-03-01T09:00:00.000Z",
        rating: 4.6,
        recommended: false,
        route: "/market/items/app-ops-center",
        sourceKind: "market",
        tags: ["ops"],
        title: "Ops Center",
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

describe("sdkwork-market-pc-react page", () => {
  it("renders market center, applies kind filter, and routes install actions", async () => {
    const Page = (marketModule as Record<string, any>).SdkworkMarketPage;
    const onNavigate = vi.fn();

    expect(Page).toBeTypeOf("function");

    render(
      <SdkworkThemeProvider defaultTheme="light">
        <Page
          onNavigate={onNavigate}
          service={{
            getCatalog: vi.fn().mockResolvedValue(createCatalog()),
            getEmptyCatalog: vi.fn().mockReturnValue({
              ...createCatalog(),
              items: createCatalog().items.slice(0, 1),
              summary: {
                ...createCatalog().summary,
                itemCount: 1,
              },
            }),
          }}
        />
      </SdkworkThemeProvider>,
    );

    expect(
      await screen.findByRole("heading", {
        name: /market center/i,
      }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: /^templates$/i })[0]);

    expect(screen.getAllByText("Workflow Template Pack").length).toBeGreaterThan(0);

    fireEvent.click(
      screen.getByRole("button", {
        name: /install workflow template pack/i,
      }),
    );
    expect(onNavigate).toHaveBeenCalledWith("/templates/open?id=template-workflow-pack");
  });
});
