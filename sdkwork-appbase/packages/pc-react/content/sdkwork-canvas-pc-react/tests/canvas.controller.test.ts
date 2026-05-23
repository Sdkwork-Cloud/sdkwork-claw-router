import { describe, expect, it, vi } from "vitest";
import { createSdkworkCanvasController } from "../src";

describe("sdkwork-canvas-pc-react controller", () => {
  it("bootstraps and resolves active board and selected node", async () => {
    const controller = createSdkworkCanvasController({
      service: {
        getEmptyWorkspace: vi.fn().mockReturnValue({
          boards: [],
          digest: { activeBoards: 0, totalBoards: 0, totalEdges: 0, totalNodes: 0 },
          isAuthenticated: false,
        }),
        getWorkspace: vi.fn().mockResolvedValue({
          boards: [
            {
              edges: [],
              id: "board-a",
              nodes: [
                { id: "node-a", kind: "logic", status: "active", title: "Node A", x: 0, y: 0 },
              ],
              title: "Board A",
              updatedAt: "2026-04-03T01:00:00.000Z",
            },
          ],
          digest: { activeBoards: 1, totalBoards: 1, totalEdges: 0, totalNodes: 1 },
          isAuthenticated: true,
        }),
      },
    });

    await controller.bootstrap();
    expect(controller.getState().activeBoardId).toBe("board-a");
    expect(controller.getState().selectedNodeId).toBe("node-a");
  });
});
