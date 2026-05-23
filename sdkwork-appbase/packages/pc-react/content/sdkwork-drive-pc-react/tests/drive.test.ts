import { describe, expect, it } from "vitest";
import * as driveModule from "../src";

describe("sdkwork-drive-pc-react domain contract", () => {
  it("creates workspace manifest, route intents, and deterministic drive workspace", () => {
    const {
      createDriveRouteIntent,
      createDriveWorkspaceManifest,
      createEmptySdkworkDriveWorkspace,
      drivePackageMeta,
    } = driveModule as Record<string, any>;

    expect(drivePackageMeta).toMatchObject({
      domain: "content",
      package: "@sdkwork/drive-pc-react",
      status: "ready",
    });

    expect(
      createDriveWorkspaceManifest({
        title: "Drive Control Room",
      }),
    ).toMatchObject({
      capability: "drive",
      routePath: "/drive",
      title: "Drive Control Room",
    });

    expect(
      createDriveRouteIntent({
        entryId: "entry-ops-spec",
        locationId: "shared-ops",
      }),
    ).toEqual({
      entryId: "entry-ops-spec",
      focusWindow: true,
      locationId: "shared-ops",
      route: "/drive?locationId=shared-ops&entryId=entry-ops-spec",
      source: "drive-workspace",
      type: "drive-route-intent",
    });

    expect(createEmptySdkworkDriveWorkspace()).toMatchObject({
      digest: {
        totalEntries: 4,
        totalLocations: 3,
      },
      isAuthenticated: false,
      locations: expect.arrayContaining([
        expect.objectContaining({ id: "shared-ops" }),
      ]),
    });
  });
});
