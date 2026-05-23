import { describe, expect, it, vi } from "vitest";
import { createSdkworkNotesService } from "../src";

describe("sdkwork-notes-pc-react service", () => {
  it("keeps deterministic fallback notes when list operation fails", async () => {
    const listNotes = vi.fn()
      .mockResolvedValueOnce([
        {
          id: "remote-note",
          notebookId: "workspace-playbooks",
          preview: "Remote note",
          starred: false,
          tags: ["remote"],
          title: "Remote Note",
          updatedAt: "2026-04-03T02:00:00.000Z",
          visibility: "shared",
        },
      ])
      .mockRejectedValueOnce(new Error("offline"));

    const service = createSdkworkNotesService({
      getSessionTokens: () => ({
        authToken: "token",
      }),
      listNotes,
      notes: [
        {
          id: "fallback-note",
          notebookId: "workspace-playbooks",
          preview: "Fallback note",
          starred: true,
          tags: ["fallback"],
          title: "Fallback Note",
          updatedAt: "2026-04-01T00:00:00.000Z",
          visibility: "workspace",
        },
      ],
    });

    const first = await service.getWorkspace();
    expect(first.isAuthenticated).toBe(true);
    expect(first.notes[0]?.id).toBe("remote-note");

    const second = await service.getWorkspace();
    expect(second.notes[0]?.id).toBe("fallback-note");
  });
});
