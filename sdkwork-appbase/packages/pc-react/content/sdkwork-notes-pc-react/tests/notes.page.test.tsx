import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SdkworkThemeProvider } from "@sdkwork/ui-pc-react/theme";
import * as notesModule from "../src";

describe("sdkwork-notes-pc-react page", () => {
  it("renders notes workspace and filters by search input", async () => {
    const Page = (notesModule as Record<string, any>).SdkworkNotesPage;

    render(
      <SdkworkThemeProvider defaultTheme="light">
        <Page
          service={{
            getEmptyWorkspace: vi.fn().mockReturnValue({
              digest: { notebookCount: 0, sharedNotes: 0, starredNotes: 0, totalNotes: 0 },
              isAuthenticated: false,
              notebooks: [],
              notes: [],
            }),
            getWorkspace: vi.fn().mockResolvedValue({
              digest: { notebookCount: 1, sharedNotes: 2, starredNotes: 1, totalNotes: 2 },
              isAuthenticated: true,
              notebooks: [
                { id: "workspace-playbooks", title: "Workspace Playbooks" },
              ],
              notes: [
                {
                  id: "release-note",
                  notebookId: "workspace-playbooks",
                  preview: "Release checklist",
                  starred: true,
                  tags: ["release"],
                  title: "Release Note",
                  updatedAt: "2026-04-03T02:00:00.000Z",
                  visibility: "workspace",
                },
                {
                  id: "design-note",
                  notebookId: "workspace-playbooks",
                  preview: "Design review",
                  starred: false,
                  tags: ["design"],
                  title: "Design Note",
                  updatedAt: "2026-04-02T02:00:00.000Z",
                  visibility: "shared",
                },
              ],
            }),
          }}
        />
      </SdkworkThemeProvider>,
    );

    expect(await screen.findByRole("heading", { name: /notes workspace/i })).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/search notes/i), {
      target: { value: "release" },
    });

    await waitFor(() => {
      expect(screen.queryByText("Design Note")).not.toBeInTheDocument();
    });
  });
});
