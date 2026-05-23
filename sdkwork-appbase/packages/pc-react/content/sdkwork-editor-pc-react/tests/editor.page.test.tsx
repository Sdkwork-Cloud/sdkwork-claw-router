import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SdkworkThemeProvider } from "@sdkwork/ui-pc-react/theme";
import * as editorModule from "../src";

describe("sdkwork-editor-pc-react page", () => {
  it("renders editor page, filters results, and opens focused path", async () => {
    const Page = (editorModule as Record<string, any>).SdkworkEditorPage;
    const onOpenPath = vi.fn();

    const { container } = render(
      <SdkworkThemeProvider defaultTheme="light">
        <Page
          onOpenPath={onOpenPath}
          service={{
            getEmptyWorkspace: vi.fn().mockReturnValue({
              digest: {
                activeDrafts: 0,
                modeSummary: { code: 0, markdown: 0, "rich-text": 0 },
                reviewedDocuments: 0,
                totalDocuments: 0,
              },
              documents: [],
              isAuthenticated: false,
            }),
            getWorkspace: vi.fn().mockResolvedValue({
              digest: {
                activeDrafts: 1,
                modeSummary: { code: 1, markdown: 1, "rich-text": 0 },
                reviewedDocuments: 0,
                totalDocuments: 2,
              },
              documents: [
                {
                  id: "script",
                  mode: "code",
                  path: "/scripts/agent.ts",
                  status: "draft",
                  summary: "Agent automation script",
                  tags: ["automation"],
                  title: "Agent Script",
                  updatedAt: "2026-04-03T03:00:00.000Z",
                  wordCount: 250,
                },
                {
                  id: "guide",
                  mode: "markdown",
                  path: "/docs/guide.md",
                  status: "published",
                  summary: "Guide content",
                  tags: ["docs"],
                  title: "Guide",
                  updatedAt: "2026-04-01T03:00:00.000Z",
                  wordCount: 700,
                },
              ],
              isAuthenticated: true,
            }),
          }}
        />
      </SdkworkThemeProvider>,
    );

    expect(await screen.findByRole("heading", { name: /editor workspace/i })).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/search documents/i), {
      target: { value: "guide" },
    });

    await waitFor(() => {
      expect(screen.queryByText("Agent Script")).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /open guide/i }));
    fireEvent.click(screen.getByRole("button", { name: /open \/docs\/guide\.md/i }));

    expect(onOpenPath).toHaveBeenCalledWith("/docs/guide.md");
    expect(container.innerHTML).not.toContain("bg-white/12");
    expect(container.innerHTML).not.toContain("text-white/75");
    expect(container.innerHTML).not.toContain("text-white/70");
  });
});
