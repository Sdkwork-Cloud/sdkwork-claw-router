import { describe, expect, it, vi } from "vitest";
import * as driveModule from "../src";

describe("sdkwork-drive-pc-react service", () => {
  it("keeps deterministic fallback entries when list operation fails", async () => {
    const createSdkworkDriveService = (driveModule as Record<string, any>).createSdkworkDriveService;
    expect(createSdkworkDriveService).toBeTypeOf("function");

    const listEntries = vi.fn()
      .mockResolvedValueOnce([
        {
          id: "remote-entry",
          kind: "file",
          locationId: "shared-ops",
          sizeLabel: "1.2 MB",
          syncPosture: "healthy",
          title: "Remote Entry",
          updatedAt: "2026-04-03T05:00:00.000Z",
        },
      ])
      .mockRejectedValueOnce(new Error("offline"));

    const service = createSdkworkDriveService({
      entries: [
        {
          id: "fallback-entry",
          kind: "file",
          locationId: "shared-ops",
          sizeLabel: "820 KB",
          syncPosture: "attention",
          title: "Fallback Entry",
          updatedAt: "2026-04-01T02:00:00.000Z",
        },
      ],
      getSessionTokens: () => ({
        authToken: "token",
      }),
      listEntries,
      locations: [
        {
          entryCount: 1,
          id: "shared-ops",
          storagePosture: "balanced",
          syncPosture: "healthy",
          title: "Shared Ops",
        },
      ],
    });

    const first = await service.getWorkspace();
    expect(first.isAuthenticated).toBe(true);
    expect(first.entries[0]?.id).toBe("remote-entry");

    const second = await service.getWorkspace();
    expect(second.entries[0]?.id).toBe("fallback-entry");
  });
});
