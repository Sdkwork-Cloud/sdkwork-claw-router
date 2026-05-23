import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it, vi } from "vitest";
import { SdkworkThemeProvider } from "@sdkwork/ui-pc-react/theme";
import { SdkworkBrowserTabStrip } from "../src";

describe("sdkwork-browser-pc-react tab strip", () => {
  it("renders tabs and dispatches selection and open actions", () => {
    const onOpenTab = vi.fn();
    const onSelectTab = vi.fn();

    render(
      <SdkworkThemeProvider defaultTheme="light">
        <SdkworkBrowserTabStrip
          onOpenTab={onOpenTab}
          onSelectTab={onSelectTab}
          selectedTabId="tab-docs"
          tabs={[
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
          ]}
        />
      </SdkworkThemeProvider>,
    );

    expect(screen.getByText("Platform Docs")).toBeInTheDocument();
    expect(screen.getByText("Ops Console")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /select ops console/i }));
    expect(onSelectTab).toHaveBeenCalledWith("tab-ops");

    fireEvent.click(screen.getByRole("button", { name: /open ops console/i }));
    expect(onOpenTab).toHaveBeenCalledWith("/browser?tabId=tab-ops");
  });
});
