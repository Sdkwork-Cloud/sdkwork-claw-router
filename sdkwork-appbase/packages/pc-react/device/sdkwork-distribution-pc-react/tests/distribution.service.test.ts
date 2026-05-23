import { describe, expect, it } from "vitest";
import * as distributionModule from "../src";

function createArtifacts() {
  return [
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
  ];
}

function createChannels() {
  return [
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
  ];
}

describe("sdkwork-distribution-pc-react service", () => {
  it("builds channel-focused catalogs and rollout summary", async () => {
    const createSdkworkDistributionService = (distributionModule as Record<string, any>).createSdkworkDistributionService;

    expect(createSdkworkDistributionService).toBeTypeOf("function");

    const service = createSdkworkDistributionService({
      artifacts: createArtifacts(),
      channels: createChannels(),
      getSessionTokens: () => ({
        authToken: "distribution-token",
      }),
    });

    expect(
      service.getEmptyCatalog({
        channelType: "stable",
      }),
    ).toMatchObject({
      isAuthenticated: true,
      selectedChannelId: "stable-global",
      channels: [
        {
          id: "stable-global",
        },
      ],
    });

    const catalog = await service.getCatalog({
      channelType: "stable",
    });

    expect(catalog.selectedChannelId).toBe("stable-global");
    expect(catalog.summary).toMatchObject({
      approvalPending: 2,
      blockedArtifacts: 0,
      channelCount: 1,
      readyArtifacts: 1,
    });
    expect(catalog.coverage).toMatchObject({
      coveredPlatforms: 2,
      totalPlatforms: 4,
    });
    expect(catalog.routeIntents.channels.route).toContain("section=channels");
  });
});
