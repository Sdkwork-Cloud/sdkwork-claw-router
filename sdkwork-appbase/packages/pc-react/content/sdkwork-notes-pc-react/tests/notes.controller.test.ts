import { describe, expect, it, vi } from "vitest";
import { createSdkworkNotesController } from "../src";

describe("sdkwork-notes-pc-react controller", () => {
  it("filters notes by notebook, starred, and query state", async () => {
    const controller = createSdkworkNotesController({
      service: {
        getEmptyWorkspace: vi.fn().mockReturnValue({
          digest: { notebookCount: 0, sharedNotes: 0, starredNotes: 0, totalNotes: 0 },
          isAuthenticated: false,
          notebooks: [],
          notes: [],
        }),
        getWorkspace: vi.fn().mockResolvedValue({
          digest: { notebookCount: 2, sharedNotes: 2, starredNotes: 1, totalNotes: 2 },
          isAuthenticated: true,
          notebooks: [
            { id: "alpha", title: "Alpha" },
            { id: "beta", title: "Beta" },
          ],
          notes: [
            {
              id: "n1",
              notebookId: "alpha",
              preview: "First note",
              starred: true,
              tags: ["ops"],
              title: "Ops Note",
              updatedAt: "2026-04-03T01:00:00.000Z",
              visibility: "workspace",
            },
            {
              id: "n2",
              notebookId: "beta",
              preview: "Second note",
              starred: false,
              tags: ["docs"],
              title: "Docs Note",
              updatedAt: "2026-04-02T01:00:00.000Z",
              visibility: "shared",
            },
          ],
        }),
      },
    });

    await controller.bootstrap();
    controller.setNotebook("alpha");
    expect(controller.getState().visibleNotes).toHaveLength(1);

    controller.setShowStarredOnly(true);
    expect(controller.getState().visibleNotes).toHaveLength(1);

    controller.setSearchQuery("docs");
    expect(controller.getState().visibleNotes).toHaveLength(0);
  });
});
