import { describe, expect, it } from "vitest";
import * as canvasModule from "../src";

describe("sdkwork-canvas-pc-react domain contract", () => {
  it("creates route intents and deterministic canvas workspace", () => {
    const {
      canvasPackageMeta,
      createCanvasRouteIntent,
      createCanvasWorkspaceManifest,
      createEmptySdkworkCanvasWorkspace,
    } = canvasModule as Record<string, any>;

    expect(canvasPackageMeta).toMatchObject({
      domain: "content",
      package: "@sdkwork/canvas-pc-react",
      status: "ready",
    });

    expect(createCanvasWorkspaceManifest()).toMatchObject({
      capability: "canvas",
      routePath: "/canvas",
    });

    expect(
      createCanvasRouteIntent({
        boardId: "board-generation-flow",
      }),
    ).toEqual({
      boardId: "board-generation-flow",
      focusWindow: true,
      route: "/canvas?boardId=board-generation-flow",
      source: "canvas-workspace",
      type: "canvas-route-intent",
    });

    expect(createEmptySdkworkCanvasWorkspace()).toMatchObject({
      digest: {
        totalBoards: 2,
      },
      boards: expect.arrayContaining([
        expect.objectContaining({ id: "board-generation-flow" }),
      ]),
      isAuthenticated: false,
    });
  });
});
