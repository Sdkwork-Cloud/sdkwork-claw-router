import { describe, expect, it, vi } from "vitest";
import { createSdkworkCanvasService } from "../src";

describe("sdkwork-canvas-pc-react service", () => {
  it("uses fallback boards when list call rejects", async () => {
    const listBoards = vi.fn()
      .mockResolvedValueOnce([
        {
          edges: [],
          id: "remote-board",
          nodes: [],
          title: "Remote Board",
          updatedAt: "2026-04-03T01:00:00.000Z",
        },
      ])
      .mockRejectedValueOnce(new Error("offline"));

    const service = createSdkworkCanvasService({
      boards: [
        {
          edges: [],
          id: "fallback-board",
          nodes: [],
          title: "Fallback Board",
          updatedAt: "2026-03-01T01:00:00.000Z",
        },
      ],
      getSessionTokens: () => ({ authToken: "token" }),
      listBoards,
    });

    const first = await service.getWorkspace();
    expect(first.boards[0]?.id).toBe("remote-board");
    expect(first.isAuthenticated).toBe(true);

    const second = await service.getWorkspace();
    expect(second.boards[0]?.id).toBe("fallback-board");
  });
});
