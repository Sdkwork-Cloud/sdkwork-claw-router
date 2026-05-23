import { describe, expect, it, vi } from "vitest";
import * as videoModule from "../src";

describe("sdkwork-video-pc-react service", () => {
  it("keeps deterministic fallback videos when list operation fails", async () => {
    const createSdkworkVideoService = (videoModule as Record<string, any>).createSdkworkVideoService;
    const service = createSdkworkVideoService({
      getSessionTokens: () => ({ authToken: "token" }),
      listVideos: vi.fn()
        .mockResolvedValueOnce([
          { durationLabel: "00:50", id: "remote-video", presetId: "launch-teaser", resolution: "1920x1080", sceneCount: 8, status: "rendering", title: "Remote Video", updatedAt: "2026-04-03T01:00:00.000Z" },
        ])
        .mockRejectedValueOnce(new Error("offline")),
      presets: [
        { id: "launch-teaser", itemCount: 1, title: "Launch Teaser" },
      ],
      videos: [
        { durationLabel: "00:20", id: "fallback-video", presetId: "launch-teaser", resolution: "1080x1920", sceneCount: 4, status: "ready", title: "Fallback Video", updatedAt: "2026-04-01T01:00:00.000Z" },
      ],
    });

    const first = await service.getWorkspace();
    expect(first.isAuthenticated).toBe(true);
    expect(first.videos[0]?.id).toBe("remote-video");

    const second = await service.getWorkspace();
    expect(second.videos[0]?.id).toBe("fallback-video");
  });
});
