import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  createSdkworkWorkspaceBlueprint,
  createSdkworkWorkspaceManifest,
  createSdkworkWorkspaceNavigationSections,
  createSdkworkWorkspaceTabs,
  SdkworkWorkspaceProvider,
  SdkworkWorkspaceSurface,
  summarizeSdkworkWorkspaceBlueprint,
  useSdkworkWorkspace,
} from "../src";

class ResizeObserverMock {
  disconnect() {}

  observe() {}

  unobserve() {}
}

if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = ResizeObserverMock as typeof ResizeObserver;
}

if (typeof Element !== "undefined" && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

const navigationSections = createSdkworkWorkspaceNavigationSections([
  {
    enabled: false,
    id: "legacy",
    items: [
      {
        id: "legacy",
        label: "Legacy",
      },
    ],
    title: "Legacy",
  },
  {
    id: "library",
    items: [
      {
        description: "Inspect indexed knowledge sources",
        id: "knowledge",
        label: "Knowledge",
        order: 2,
        status: "attention",
      },
      {
        enabled: false,
        id: "hidden",
        label: "Hidden",
      },
    ],
    order: 2,
    title: "Library",
  },
  {
    id: "workspace",
    items: [
      {
        description: "Open assistant sessions",
        id: "chat",
        label: "Chat",
        order: 1,
        status: "ready",
      },
    ],
    order: 1,
    title: "Workspace",
  },
]);

const workspaceTabs = createSdkworkWorkspaceTabs([
  {
    id: "overview",
    label: "Overview",
    modified: true,
    order: 2,
  },
  {
    id: "activity",
    label: "Activity",
    order: 1,
  },
  {
    enabled: false,
    id: "hidden",
    label: "Hidden",
  },
]);

const workspaceBlueprint = createSdkworkWorkspaceBlueprint({
  description: "Model routing and knowledge orchestration.",
  isBottomPanelOpenByDefault: true,
  isInspectorOpenByDefault: true,
  navigationSections,
  tabs: workspaceTabs,
  title: "AI Workspace",
});

function WorkspaceProbe() {
  const workspace = useSdkworkWorkspace();

  return (
    <div>
      <span>{workspace.activeNavigationItemId}</span>
      <span>{workspace.activeTabId}</span>
      <span>{workspace.isInspectorOpen ? "inspector-open" : "inspector-closed"}</span>
      <span>{workspace.isBottomPanelOpen ? "bottom-open" : "bottom-closed"}</span>
      <button
        type="button"
        onClick={() => workspace.setActiveNavigationItemId("knowledge")}
      >
        set-knowledge
      </button>
      <button
        type="button"
        onClick={() => workspace.setActiveTabId("overview")}
      >
        set-overview
      </button>
      <button
        type="button"
        onClick={workspace.toggleInspectorOpen}
      >
        toggle-inspector
      </button>
      <button
        type="button"
        onClick={workspace.toggleBottomPanelOpen}
      >
        toggle-bottom
      </button>
    </div>
  );
}

describe("sdkwork-workspace-pc-react", () => {
  it("normalizes navigation sections and tabs, then derives a deterministic blueprint summary", () => {
    expect(navigationSections).toEqual([
      {
        id: "workspace",
        items: [
          {
            description: "Open assistant sessions",
            id: "chat",
            label: "Chat",
            order: 1,
            status: "ready",
          },
        ],
        order: 1,
        title: "Workspace",
      },
      {
        id: "library",
        items: [
          {
            description: "Inspect indexed knowledge sources",
            id: "knowledge",
            label: "Knowledge",
            order: 2,
            status: "attention",
          },
        ],
        order: 2,
        title: "Library",
      },
    ]);

    expect(workspaceTabs).toEqual([
      {
        id: "activity",
        label: "Activity",
        order: 1,
      },
      {
        id: "overview",
        label: "Overview",
        modified: true,
        order: 2,
      },
    ]);

    expect(workspaceBlueprint).toMatchObject({
      defaultActiveNavigationItemId: "chat",
      defaultActiveTabId: "activity",
      description: "Model routing and knowledge orchestration.",
      id: "sdkwork-workspace-blueprint",
      isBottomPanelOpenByDefault: true,
      isInspectorOpenByDefault: true,
      navigationSections,
      tabs: workspaceTabs,
      title: "AI Workspace",
    });

    expect(summarizeSdkworkWorkspaceBlueprint(workspaceBlueprint)).toEqual({
      attentionItemIds: ["knowledge"],
      defaultActiveNavigationItemId: "chat",
      defaultActiveTabId: "activity",
      navigationItemIds: ["chat", "knowledge"],
      navigationSectionIds: ["workspace", "library"],
      tabIds: ["activity", "overview"],
      totalAttentionItems: 1,
      totalNavigationItems: 2,
      totalTabs: 2,
    });
  });

  it("creates a workspace manifest with scaffold defaults and derived section metadata", () => {
    expect(
      createSdkworkWorkspaceManifest({
        blueprint: workspaceBlueprint,
        packageNames: [
          "@sdkwork/workspace-pc-react",
          "@sdkwork/workspace-pc-react",
        ],
        theme: {
          color: "green-tech",
        },
      }),
    ).toEqual({
      architecture: "pc-react",
      capability: "workspace",
      defaultActiveNavigationItemId: "chat",
      defaultActiveTabId: "activity",
      description: "Model routing and knowledge orchestration.",
      host: "tauri",
      id: "sdkwork-workspace",
      isBottomPanelOpenByDefault: true,
      isInspectorOpenByDefault: true,
      navigationSectionIds: ["workspace", "library"],
      packageNames: ["@sdkwork/workspace-pc-react"],
      tabIds: ["activity", "overview"],
      theme: {
        color: "green-tech",
        preset: "sdkwork",
        selection: "system",
      },
      title: "AI Workspace",
    });
  });

  it("manages workspace-local active item, active tab, and dock visibility", () => {
    render(
      <SdkworkWorkspaceProvider
        blueprint={workspaceBlueprint}
        defaultBottomPanelOpen={false}
      >
        <WorkspaceProbe />
      </SdkworkWorkspaceProvider>,
    );

    expect(screen.getByText("chat")).toBeInTheDocument();
    expect(screen.getByText("activity")).toBeInTheDocument();
    expect(screen.getByText("inspector-open")).toBeInTheDocument();
    expect(screen.getByText("bottom-closed")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "set-knowledge" }));
    fireEvent.click(screen.getByRole("button", { name: "set-overview" }));
    fireEvent.click(screen.getByRole("button", { name: "toggle-inspector" }));
    fireEvent.click(screen.getByRole("button", { name: "toggle-bottom" }));

    expect(screen.getByText("knowledge")).toBeInTheDocument();
    expect(screen.getByText("overview")).toBeInTheDocument();
    expect(screen.getByText("inspector-closed")).toBeInTheDocument();
    expect(screen.getByText("bottom-open")).toBeInTheDocument();
  });

  it("renders navigation, tabs, main workbench, inspector, and bottom panel using the shared scaffold", () => {
    const onNavigationItemSelect = vi.fn();
    const onTabChange = vi.fn();

    render(
      <SdkworkWorkspaceProvider blueprint={workspaceBlueprint}>
        <SdkworkWorkspaceSurface
          blueprint={workspaceBlueprint}
          bottom={<div>Execution timeline</div>}
          bottomTitle="Timeline"
          detail={<div>Models inspector</div>}
          detailTitle="Inspector"
          main={<div>Workspace content</div>}
          onNavigationItemSelect={onNavigationItemSelect}
          onTabChange={onTabChange}
          title="AI Workspace"
        />
      </SdkworkWorkspaceProvider>,
    );

    expect(screen.getAllByText("AI Workspace").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Model routing and knowledge orchestration.").length).toBeGreaterThan(0);
    expect(screen.getByText("Workspace content")).toBeInTheDocument();
    expect(screen.getByText("Models inspector")).toBeInTheDocument();
    expect(screen.getByText("Execution timeline")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Chat/ })).toHaveAttribute("data-active", "true");
    expect(screen.getByRole("tab", { name: "Activity" })).toHaveAttribute("aria-selected", "true");

    fireEvent.click(screen.getByRole("button", { name: /^Knowledge/ }));
    fireEvent.click(screen.getByRole("tab", { name: "Overview" }));

    expect(onNavigationItemSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "knowledge",
        label: "Knowledge",
      }),
    );
    expect(onTabChange).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "overview",
        label: "Overview",
      }),
    );
    expect(screen.getByRole("button", { name: /^Knowledge/ })).toHaveAttribute("data-active", "true");
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute("aria-selected", "true");
  });
});
