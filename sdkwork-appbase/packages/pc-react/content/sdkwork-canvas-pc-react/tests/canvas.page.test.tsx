import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SdkworkThemeProvider } from "@sdkwork/ui-pc-react/theme";
import * as canvasModule from "../src";

describe("sdkwork-canvas-pc-react page", () => {
  it("renders canvas page and switches selected board", async () => {
    const Page = (canvasModule as Record<string, any>).SdkworkCanvasPage;

    render(
      <SdkworkThemeProvider defaultTheme="light">
        <Page
          service={{
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
                  nodes: [{ id: "node-a", kind: "logic", status: "active", title: "Node A", x: 0, y: 0 }],
                  title: "Board A",
                  updatedAt: "2026-04-03T01:00:00.000Z",
                },
                {
                  edges: [],
                  id: "board-b",
                  nodes: [{ id: "node-b", kind: "prompt", status: "idle", title: "Node B", x: 1, y: 1 }],
                  title: "Board B",
                  updatedAt: "2026-04-02T01:00:00.000Z",
                },
              ],
              digest: { activeBoards: 1, totalBoards: 2, totalEdges: 0, totalNodes: 2 },
              isAuthenticated: true,
            }),
          }}
        />
      </SdkworkThemeProvider>,
    );

    expect(await screen.findByRole("heading", { name: /canvas workspace/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /open board board b/i }));
    expect(screen.getAllByText("Node B").length).toBeGreaterThan(0);
  });
});
