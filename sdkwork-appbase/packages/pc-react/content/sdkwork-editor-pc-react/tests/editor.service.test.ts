import { describe, expect, it, vi } from "vitest";
import { createSdkworkEditorService } from "../src";

describe("sdkwork-editor-pc-react service", () => {
  it("hydrates auth state from runtime session and falls back on list failures", async () => {
    const listDocuments = vi.fn()
      .mockResolvedValueOnce([
        {
          id: "playbook",
          mode: "markdown",
          path: "/docs/playbook.md",
          status: "review",
          summary: "Operations playbook",
          tags: ["ops"],
          title: "Playbook",
          updatedAt: "2026-04-02T00:00:00.000Z",
          wordCount: 300,
        },
      ])
      .mockRejectedValueOnce(new Error("network"));

    const service = createSdkworkEditorService({
      documents: [
        {
          id: "fallback",
          mode: "code",
          path: "/scripts/fallback.ts",
          status: "draft",
          summary: "Fallback document",
          tags: ["fallback"],
          title: "Fallback",
          updatedAt: "2026-03-20T00:00:00.000Z",
          wordCount: 200,
        },
      ],
      getSessionTokens: () => ({
        authToken: "token",
      }),
      listDocuments,
    });

    const first = await service.getWorkspace();
    expect(first.isAuthenticated).toBe(true);
    expect(first.documents[0]?.id).toBe("playbook");

    const second = await service.getWorkspace();
    expect(second.documents[0]?.id).toBe("fallback");
  });
});
