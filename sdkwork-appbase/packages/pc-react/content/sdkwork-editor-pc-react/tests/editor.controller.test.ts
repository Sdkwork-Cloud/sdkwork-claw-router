import { describe, expect, it, vi } from "vitest";
import { createSdkworkEditorController } from "../src";

describe("sdkwork-editor-pc-react controller", () => {
  it("bootstraps and filters documents by mode/query", async () => {
    const controller = createSdkworkEditorController({
      service: {
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
            reviewedDocuments: 1,
            totalDocuments: 2,
          },
          documents: [
            {
              id: "doc-code",
              mode: "code",
              path: "/doc-code.ts",
              status: "draft",
              summary: "Code summary",
              tags: ["code"],
              title: "Code Document",
              updatedAt: "2026-04-03T00:00:00.000Z",
              wordCount: 320,
            },
            {
              id: "doc-markdown",
              mode: "markdown",
              path: "/doc-markdown.md",
              status: "review",
              summary: "Markdown summary",
              tags: ["notes"],
              title: "Markdown Document",
              updatedAt: "2026-04-01T00:00:00.000Z",
              wordCount: 410,
            },
          ],
          isAuthenticated: true,
        }),
      },
    });

    await controller.bootstrap();

    controller.setMode("markdown");
    expect(controller.getState().visibleDocuments).toHaveLength(1);

    controller.setSearchQuery("code");
    expect(controller.getState().visibleDocuments).toHaveLength(0);
  });
});
