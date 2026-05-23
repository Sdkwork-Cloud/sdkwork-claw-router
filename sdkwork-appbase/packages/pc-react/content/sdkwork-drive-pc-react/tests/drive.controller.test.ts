import { describe, expect, it, vi } from "vitest";
import * as driveModule from "../src";

describe("sdkwork-drive-pc-react controller", () => {
  it("filters entries by location, sync posture, and search state", async () => {
    const createSdkworkDriveController = (driveModule as Record<string, any>).createSdkworkDriveController;
    expect(createSdkworkDriveController).toBeTypeOf("function");

    const controller = createSdkworkDriveController({
      service: {
        getEmptyWorkspace: vi.fn().mockReturnValue({
          digest: {
            healthySyncs: 0,
            sharedSpaces: 0,
            totalEntries: 0,
            totalLocations: 0,
          },
          entries: [],
          isAuthenticated: false,
          locations: [],
          recentActions: [],
        }),
        getWorkspace: vi.fn().mockResolvedValue({
          digest: {
            healthySyncs: 1,
            sharedSpaces: 1,
            totalEntries: 2,
            totalLocations: 2,
          },
          entries: [
            {
              id: "entry-ops-spec",
              kind: "file",
              locationId: "shared-ops",
              sizeLabel: "820 KB",
              syncPosture: "attention",
              title: "Ops Spec",
              updatedAt: "2026-04-03T02:15:00.000Z",
            },
            {
              id: "entry-design-archive",
              kind: "folder",
              locationId: "design-vault",
              sizeLabel: "12 GB",
              syncPosture: "healthy",
              title: "Design Archive",
              updatedAt: "2026-04-02T02:15:00.000Z",
            },
          ],
          isAuthenticated: true,
          locations: [
            {
              entryCount: 1,
              id: "shared-ops",
              storagePosture: "balanced",
              syncPosture: "attention",
              title: "Shared Ops",
            },
            {
              entryCount: 1,
              id: "design-vault",
              storagePosture: "heavy",
              syncPosture: "healthy",
              title: "Design Vault",
            },
          ],
          recentActions: [
            {
              action: "Synced runbook bundle",
              id: "action-1",
              timestamp: "2026-04-03T01:15:00.000Z",
            },
          ],
        }),
      },
    });

    await controller.bootstrap();

    controller.setLocation("shared-ops");
    expect(controller.getState().visibleEntries).toHaveLength(1);

    controller.setSyncPosture("attention");
    expect(controller.getState().visibleEntries).toHaveLength(1);

    controller.setSearchQuery("design");
    expect(controller.getState().visibleEntries).toHaveLength(0);
  });
});
