import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SdkworkThemeProvider } from "@sdkwork/ui-pc-react/theme";
import * as mediaModule from "../src";

describe("sdkwork-media-pc-react page", () => {
  it("renders media control room and filters by search input", async () => {
    const Page = (mediaModule as Record<string, any>).SdkworkMediaPage;
    expect(Page).toBeTypeOf("function");

    const { container } = render(
      <SdkworkThemeProvider defaultTheme="light">
        <Page
          service={{
            getEmptyWorkspace: vi.fn().mockReturnValue({
              digest: {
                publishReady: 0,
                queueCount: 0,
                reviewAttention: 0,
                totalItems: 0,
              },
              isAuthenticated: false,
              items: [],
              queues: [],
            }),
            getWorkspace: vi.fn().mockResolvedValue({
              digest: {
                publishReady: 1,
                queueCount: 2,
                reviewAttention: 1,
                totalItems: 2,
              },
              isAuthenticated: true,
              items: [
                {
                  durationLabel: "00:45",
                  id: "media-launch-teaser",
                  kind: "video",
                  publishPosture: "ready",
                  queueId: "launch-review",
                  title: "Launch Teaser",
                  updatedAt: "2026-04-03T03:30:00.000Z",
                },
                {
                  durationLabel: "03:15",
                  id: "media-podcast-cut",
                  kind: "audio",
                  publishPosture: "blocked",
                  queueId: "podcast-review",
                  title: "Podcast Cut",
                  updatedAt: "2026-04-02T03:30:00.000Z",
                },
              ],
              queues: [
                { id: "launch-review", itemCount: 1, title: "Launch Review" },
                { id: "podcast-review", itemCount: 1, title: "Podcast Review" },
              ],
            }),
          }}
        />
      </SdkworkThemeProvider>,
    );

    expect(await screen.findByRole("heading", { name: /media control room/i })).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/search media/i), {
      target: { value: "podcast" },
    });

    await waitFor(() => {
      expect(screen.queryByText("Launch Teaser")).not.toBeInTheDocument();
    });
    expect(container.innerHTML).not.toContain("border-white/10");
    expect(container.innerHTML).not.toContain("text-white/72");
    expect(container.innerHTML).not.toContain("text-white/60");
  });

  it("applies host localization overrides across the media page seam", async () => {
    const Page = (mediaModule as Record<string, any>).SdkworkMediaPage;

    render(
      <SdkworkThemeProvider defaultTheme="light">
        <Page
          messages={{
            page: {
              searchPlaceholder: "Host media search",
              title: "Host media cockpit",
            },
            publishPosture: {
              all: "Host all",
            },
            queues: {
              all: "Host queues",
            },
          }}
          service={{
            getEmptyWorkspace: vi.fn().mockReturnValue({
              digest: {
                publishReady: 0,
                queueCount: 0,
                reviewAttention: 0,
                totalItems: 0,
              },
              isAuthenticated: false,
              items: [],
              queues: [],
            }),
            getWorkspace: vi.fn().mockResolvedValue({
              digest: {
                publishReady: 0,
                queueCount: 0,
                reviewAttention: 0,
                totalItems: 0,
              },
              isAuthenticated: true,
              items: [],
              queues: [],
            }),
          }}
        />
      </SdkworkThemeProvider>,
    );

    expect(await screen.findByRole("heading", { name: "Host media cockpit" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Host media search")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Host queues" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Host all" })).toBeInTheDocument();
  });
});
