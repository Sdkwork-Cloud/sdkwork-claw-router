import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it, vi } from "vitest";
import { SdkworkThemeProvider } from "@sdkwork/ui-pc-react/theme";
import {
  createEmptySdkworkBrowserWorkspace,
  SdkworkBrowserPage,
} from "../src";

describe("sdkwork-browser-pc-react page", () => {
  it("renders browser workspace, filters tabs by group, and routes open action", async () => {
    const onNavigate = vi.fn();

    const fullWorkspace = createEmptySdkworkBrowserWorkspace({
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

    const { container } = render(
      <SdkworkThemeProvider defaultTheme="light">
        <SdkworkBrowserPage
          onNavigate={onNavigate}
          service={{
            getEmptyWorkspace: vi.fn().mockReturnValue(
              createEmptySdkworkBrowserWorkspace({
                groups: fullWorkspace.groups,
                tabs: fullWorkspace.tabs.slice(0, 1),
              }),
            ),
            getWorkspace: vi.fn().mockResolvedValue(fullWorkspace),
          }}
        />
      </SdkworkThemeProvider>,
    );

    expect(
      await screen.findByRole("heading", {
        name: /browser workspace/i,
      }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /operations/i }));
    expect(screen.getAllByText("Ops Console").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: /select ops console/i }));
    fireEvent.click(screen.getAllByRole("button", { name: /open ops console/i })[0]);
    expect(onNavigate).toHaveBeenCalledWith("/browser?tabId=tab-ops");
    expect(container.innerHTML).not.toContain("bg-white/8");
    expect(container.innerHTML).not.toContain("text-white/72");
    expect(container.innerHTML).not.toContain("text-white/65");
  });
});
