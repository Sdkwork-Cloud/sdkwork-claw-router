import { describe, expect, it } from "vitest";
import * as editorModule from "../src";

describe("sdkwork-editor-pc-react domain contract", () => {
  it("creates manifests, route intents, and deterministic workspace data", () => {
    const {
      createEditorRouteIntent,
      createEditorWorkspaceManifest,
      createEmptySdkworkEditorWorkspace,
      editorPackageMeta,
    } = editorModule as Record<string, any>;

    expect(editorPackageMeta).toMatchObject({
      domain: "content",
      package: "@sdkwork/editor-pc-react",
      status: "ready",
    });

    expect(
      createEditorWorkspaceManifest({
        title: "Editor Center",
      }),
    ).toMatchObject({
      capability: "editor",
      routePath: "/editor",
      title: "Editor Center",
    });

    expect(
      createEditorRouteIntent({
        documentId: "guide-release-flow",
        mode: "markdown",
      }),
    ).toEqual({
      documentId: "guide-release-flow",
      focusWindow: true,
      mode: "markdown",
      route: "/editor?mode=markdown&documentId=guide-release-flow",
      source: "editor-workspace",
      type: "editor-route-intent",
    });

    expect(createEmptySdkworkEditorWorkspace()).toMatchObject({
      digest: {
        totalDocuments: 4,
      },
      documents: expect.arrayContaining([
        expect.objectContaining({
          id: "agent-ops-script",
          mode: "code",
        }),
      ]),
      isAuthenticated: false,
    });
  });
});
