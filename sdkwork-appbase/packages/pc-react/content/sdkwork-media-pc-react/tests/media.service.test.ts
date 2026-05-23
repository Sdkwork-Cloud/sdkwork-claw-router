import { describe, expect, it, vi } from "vitest";
import * as mediaModule from "../src";

describe("sdkwork-media-pc-react service", () => {
  it("keeps deterministic fallback media when list operation fails", async () => {
    const createSdkworkMediaService = (mediaModule as Record<string, any>).createSdkworkMediaService;
    expect(createSdkworkMediaService).toBeTypeOf("function");

    const listItems = vi.fn()
      .mockResolvedValueOnce([
        {
          durationLabel: "00:45",
          id: "remote-media",
          kind: "video",
          publishPosture: "ready",
          queueId: "launch-review",
          title: "Remote Media",
          updatedAt: "2026-04-03T04:00:00.000Z",
        },
      ])
      .mockRejectedValueOnce(new Error("offline"));

    const service = createSdkworkMediaService({
      getSessionTokens: () => ({
        authToken: "token",
      }),
      items: [
        {
          durationLabel: "03:15",
          id: "fallback-media",
          kind: "audio",
          publishPosture: "draft",
          queueId: "launch-review",
          title: "Fallback Media",
          updatedAt: "2026-04-01T01:00:00.000Z",
        },
      ],
      listItems,
      queues: [
        {
          id: "launch-review",
          itemCount: 1,
          title: "Launch Review",
        },
      ],
    });

    const first = await service.getWorkspace();
    expect(first.isAuthenticated).toBe(true);
    expect(first.items[0]?.id).toBe("remote-media");

    const second = await service.getWorkspace();
    expect(second.items[0]?.id).toBe("fallback-media");
  });
});
