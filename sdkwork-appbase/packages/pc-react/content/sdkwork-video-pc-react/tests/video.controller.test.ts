import { describe, expect, it, vi } from "vitest";
import * as videoModule from "../src";

describe("sdkwork-video-pc-react controller", () => {
  it("filters videos by preset, status, and search state", async () => {
    const createSdkworkVideoController = (videoModule as Record<string, any>).createSdkworkVideoController;

    const controller = createSdkworkVideoController({
      service: {
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
      },
    });

    await controller.bootstrap();
    controller.setPreset("product-demo");
    expect(controller.getState().visibleVideos).toHaveLength(1);
    controller.setStatus("queued");
    expect(controller.getState().visibleVideos).toHaveLength(1);
    controller.setSearchQuery("launch");
    expect(controller.getState().visibleVideos).toHaveLength(0);
  });

  it("uses host override fallback copy when video bootstrap fails without an Error instance", async () => {
    const createSdkworkVideoController = (videoModule as Record<string, any>).createSdkworkVideoController;

    const controller = createSdkworkVideoController({
      messages: {
        service: {
          loadWorkspaceFailed: "Host video load failed",
        },
      },
      service: {
        getEmptyWorkspace: vi.fn().mockReturnValue({
          digest: { activeRenders: 0, presetCount: 0, readyVideos: 0, totalVideos: 0 },
          isAuthenticated: false,
          presets: [],
          videos: [],
        }),
        getWorkspace: vi.fn().mockRejectedValue("boom"),
      },
    });

    await expect(controller.bootstrap()).rejects.toBe("boom");
    expect(controller.getState().lastError).toBe("Host video load failed");
  });
});
