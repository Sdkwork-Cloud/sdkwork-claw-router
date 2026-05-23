import { describe, expect, it, vi } from "vitest";
import * as distributionModule from "../src";

function createCatalog() {
  return {
    artifacts: [
      {
        approvalRequired: false,
        id: "artifact-win-x64",
        mirrorStrategy: "global",
        platform: "windows-x64",
        sizeMb: 128,
        status: "ready",
        title: "Desktop Win x64",
        updateSource: "self-hosted",
        version: "2.5.0",
      },
      {
        approvalRequired: true,
        id: "artifact-linux-x64",
        mirrorStrategy: "regional",
        platform: "linux-x64",
        sizeMb: 124,
        status: "building",
        title: "Desktop Linux x64",
        updateSource: "self-hosted",
        version: "2.5.0",
      },
    ],
    channelDigests: {
      "preview-regional": {
        approvalPending: 1,
        blockedArtifacts: 0,
        readyArtifacts: 0,
      },
      "stable-global": {
        approvalPending: 1,
        blockedArtifacts: 0,
        readyArtifacts: 1,
      },
    },
    channels: [
      {
        approvalRequired: true,
        artifactIds: ["artifact-win-x64", "artifact-linux-x64"],
        description: "Progressive production release channel.",
        id: "stable-global",
        riskLevel: "low",
        rolloutPercent: 30,
        targetScope: {
          regions: ["global"],
          tenantRings: ["production"],
        },
        title: "Stable",
        type: "stable",
      },
      {
        approvalRequired: false,
        artifactIds: ["artifact-linux-x64"],
        description: "Preview release channel.",
        id: "preview-regional",
        riskLevel: "medium",
        rolloutPercent: 10,
        targetScope: {
          regions: ["cn", "global"],
          tenantRings: ["preview"],
        },
        title: "Preview",
        type: "preview",
      },
    ],
    coverage: {
      coveredPlatforms: 2,
      missingPlatforms: ["windows-arm64", "macos-universal"],
      totalPlatforms: 4,
    },
    isAuthenticated: true,
    routeIntents: {
      artifacts: {
        focusWindow: true,
        route: "/distribution?section=artifacts",
        section: "artifacts",
        source: "distribution-workspace",
        type: "distribution-route-intent",
      },
      channels: {
        focusWindow: true,
        route: "/distribution?section=channels",
        section: "channels",
        source: "distribution-workspace",
        type: "distribution-route-intent",
      },
      overview: {
        focusWindow: true,
        route: "/distribution",
        source: "distribution-workspace",
        type: "distribution-route-intent",
      },
    },
    selectedChannelId: "stable-global",
    summary: {
      approvalPending: 2,
      blockedArtifacts: 0,
      channelCount: 2,
      highestRiskLevel: "medium",
      readyArtifacts: 1,
      rolloutAveragePercent: 20,
      totalArtifacts: 2,
    },
  };
}

describe("sdkwork-distribution-pc-react controller", () => {
  it("bootstraps distribution data and filters channels by type", async () => {
    const createSdkworkDistributionController = (distributionModule as Record<string, any>).createSdkworkDistributionController;

    expect(createSdkworkDistributionController).toBeTypeOf("function");

    const service = {
      getCatalog: vi.fn().mockResolvedValue(createCatalog()),
      getEmptyCatalog: vi.fn().mockReturnValue({
        ...createCatalog(),
        channels: [createCatalog().channels[1]],
        selectedChannelId: "preview-regional",
      }),
    };

    const controller = createSdkworkDistributionController({
      service,
    });

    expect(controller.getState().selectedChannelId).toBe("preview-regional");
    expect(controller.getState().visibleChannels).toHaveLength(1);

    await controller.bootstrap();
    expect(controller.getState().selectedChannelId).toBe("stable-global");
    expect(controller.getState().visibleChannels).toHaveLength(2);

    controller.setChannelType("preview");
    expect(controller.getState().visibleChannels.map((channel: { id: string }) => channel.id)).toEqual([
      "preview-regional",
    ]);

    controller.setChannelType("all");
    controller.selectChannel("stable-global");
    expect(controller.getState().selectedChannelId).toBe("stable-global");
  });
});
