import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SdkworkThemeProvider } from "@sdkwork/ui-pc-react/theme";
import * as videoModule from "../src";

describe("sdkwork-video-pc-react page", () => {
  it("renders video workspace and filters videos by search input", async () => {
    const Page = (videoModule as Record<string, any>).SdkworkVideoPage;

    const { container } = render(
      <SdkworkThemeProvider defaultTheme="light">
        <Page
          service={{
            getEmptyWorkspace: vi.fn().mockReturnValue({
              digest: { activeRenders: 0, presetCount: 0, readyVideos: 0, totalVideos: 0 },
              isAuthenticated: false,
              presets: [],
              videos: [],
            }),
            getWorkspace: vi.fn().mockResolvedValue({
              digest: { activeRenders: 1, presetCount: 2, readyVideos: 1, totalVideos: 2 },
              isAuthenticated: true,
              presets: [
                { id: "launch-teaser", itemCount: 1, title: "Launch Teaser" },
                { id: "product-demo", itemCount: 1, title: "Product Demo" },
              ],
              videos: [
                { durationLabel: "00:45", id: "video-launch-cut", presetId: "launch-teaser", resolution: "1920x1080", sceneCount: 12, status: "ready", title: "Launch Cut", updatedAt: "2026-04-03T01:00:00.000Z" },
                { durationLabel: "01:30", id: "video-product-demo", presetId: "product-demo", resolution: "1920x1080", sceneCount: 18, status: "queued", title: "Product Demo", updatedAt: "2026-04-02T01:00:00.000Z" },
              ],
            }),
          }}
        />
      </SdkworkThemeProvider>,
    );

    expect(await screen.findByRole("heading", { name: /video workspace/i })).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/search videos/i), {
      target: { value: "product" },
    });

    await waitFor(() => {
      expect(screen.queryByText("Launch Cut")).not.toBeInTheDocument();
    });
    expect(container.innerHTML).not.toContain("border-white/10");
    expect(container.innerHTML).not.toContain("text-white/72");
    expect(container.innerHTML).not.toContain("text-white/60");
  });

  it("applies host localization overrides across the video page seam", async () => {
    const Page = (videoModule as Record<string, any>).SdkworkVideoPage;

    render(
      <SdkworkThemeProvider defaultTheme="light">
        <Page
          messages={{
            page: {
              searchPlaceholder: "Host video search",
              title: "Host video cockpit",
            },
            presets: {
              all: "Host presets",
            },
            status: {
              all: "Host all",
            },
          }}
          service={{
            getEmptyWorkspace: vi.fn().mockReturnValue({
              digest: { activeRenders: 0, presetCount: 0, readyVideos: 0, totalVideos: 0 },
              isAuthenticated: false,
              presets: [],
              videos: [],
            }),
            getWorkspace: vi.fn().mockResolvedValue({
              digest: { activeRenders: 0, presetCount: 0, readyVideos: 0, totalVideos: 0 },
              isAuthenticated: true,
              presets: [],
              videos: [],
            }),
          }}
        />
      </SdkworkThemeProvider>,
    );

    expect(await screen.findByRole("heading", { name: "Host video cockpit" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Host video search")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Host presets" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Host all" })).toBeInTheDocument();
  });
});
