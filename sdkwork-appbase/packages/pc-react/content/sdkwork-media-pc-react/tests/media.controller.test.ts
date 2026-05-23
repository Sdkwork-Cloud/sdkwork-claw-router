import { describe, expect, it, vi } from "vitest";
import * as mediaModule from "../src";

describe("sdkwork-media-pc-react controller", () => {
  it("filters media by queue, publish posture, and search state", async () => {
    const createSdkworkMediaController = (mediaModule as Record<string, any>).createSdkworkMediaController;
    expect(createSdkworkMediaController).toBeTypeOf("function");

    const controller = createSdkworkMediaController({
      service: {
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
              updatedAt: "2026-04-03T02:30:00.000Z",
            },
            {
              durationLabel: "03:15",
              id: "media-podcast-cut",
              kind: "audio",
              publishPosture: "blocked",
              queueId: "podcast-review",
              title: "Podcast Cut",
              updatedAt: "2026-04-02T02:30:00.000Z",
            },
          ],
          queues: [
            { id: "launch-review", itemCount: 1, title: "Launch Review" },
            { id: "podcast-review", itemCount: 1, title: "Podcast Review" },
          ],
        }),
      },
    });

    await controller.bootstrap();

    controller.setQueue("podcast-review");
    expect(controller.getState().visibleItems).toHaveLength(1);

    controller.setPublishPosture("blocked");
    expect(controller.getState().visibleItems).toHaveLength(1);

    controller.setSearchQuery("launch");
    expect(controller.getState().visibleItems).toHaveLength(0);
  });

  it("uses host override fallback copy when media bootstrap fails without an Error instance", async () => {
    const createSdkworkMediaController = (mediaModule as Record<string, any>).createSdkworkMediaController;

    const controller = createSdkworkMediaController({
      messages: {
        service: {
          loadWorkspaceFailed: "Host media load failed",
        },
      },
      service: {
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
        getWorkspace: vi.fn().mockRejectedValue("boom"),
      },
    });

    await expect(controller.bootstrap()).rejects.toBe("boom");
    expect(controller.getState().lastError).toBe("Host media load failed");
  });
});
