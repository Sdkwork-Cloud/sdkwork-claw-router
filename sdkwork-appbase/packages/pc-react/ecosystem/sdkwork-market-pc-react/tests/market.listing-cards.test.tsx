import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it, vi } from "vitest";
import { SdkworkThemeProvider } from "@sdkwork/ui-pc-react/theme";
import * as marketModule from "../src";

const items = [
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
];

describe("sdkwork-market-pc-react listing cards", () => {
  it("renders listing cards, supports selection, and triggers install route intents", () => {
    const ListingCards = (marketModule as Record<string, any>).SdkworkMarketListingCards;
    const onNavigate = vi.fn();
    const onSelectItem = vi.fn();

    expect(ListingCards).toBeTypeOf("function");

    render(
      <SdkworkThemeProvider defaultTheme="light">
        <ListingCards
          items={items}
          onNavigate={onNavigate}
          onSelectItem={onSelectItem}
          selectedItemId="plugin-agentops"
        />
      </SdkworkThemeProvider>,
    );

    expect(screen.getByText("AgentOps Plugin")).toBeInTheDocument();
    expect(screen.getByText("Workflow Template Pack")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: /select workflow template pack/i,
      }),
    );
    expect(onSelectItem).toHaveBeenCalledWith("template-workflow-pack");

    fireEvent.click(
      screen.getByRole("button", {
        name: /install workflow template pack/i,
      }),
    );
    expect(onNavigate).toHaveBeenCalledWith("/templates/open?id=template-workflow-pack");
  });
});
