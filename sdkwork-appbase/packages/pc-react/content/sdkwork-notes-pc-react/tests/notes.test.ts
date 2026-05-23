import { describe, expect, it } from "vitest";
import * as notesModule from "../src";

describe("sdkwork-notes-pc-react domain contract", () => {
  it("creates workspace manifest, route intents, and deterministic notes workspace", () => {
    const {
      createEmptySdkworkNotesWorkspace,
      createNotesRouteIntent,
      createNotesWorkspaceManifest,
      notesPackageMeta,
    } = notesModule as Record<string, any>;

    expect(notesPackageMeta).toMatchObject({
      domain: "content",
      package: "@sdkwork/notes-pc-react",
      status: "ready",
    });

    expect(
      createNotesWorkspaceManifest({
        title: "Notes Workspace",
      }),
    ).toMatchObject({
      capability: "notes",
      routePath: "/notes",
      title: "Notes Workspace",
    });

    expect(
      createNotesRouteIntent({
        notebookId: "handoff-notes",
      }),
    ).toEqual({
      focusWindow: true,
      notebookId: "handoff-notes",
      route: "/notes?notebookId=handoff-notes",
      source: "notes-workspace",
      type: "notes-route-intent",
    });

    expect(createEmptySdkworkNotesWorkspace()).toMatchObject({
      digest: {
        notebookCount: 3,
        totalNotes: 3,
      },
      isAuthenticated: false,
      notebooks: expect.arrayContaining([
        expect.objectContaining({ id: "workspace-playbooks" }),
      ]),
    });
  });
});
