import { describe, expect, it } from "vitest";
import * as distributionModule from "../src";

describe("sdkwork-distribution-pc-react headless contract", () => {
  it("creates manifests, route intents, and empty distribution catalog", () => {
    const {
      createDistributionRouteIntent,
      createDistributionWorkspaceManifest,
      createEmptySdkworkDistributionCatalog,
      distributionPackageMeta,
    } = distributionModule as unknown as Record<string, (...args: any[]) => any> & {
      distributionPackageMeta?: unknown;
    };

    expect(distributionPackageMeta).toMatchObject({
      domain: "device",
      package: "@sdkwork/distribution-pc-react",
      status: "ready",
    });

    expect(
      createDistributionWorkspaceManifest({
        title: "Distribution Center",
      }),
    ).toMatchObject({
      capability: "distribution",
      routePath: "/distribution",
      title: "Distribution Center",
    });

    expect(
      createDistributionRouteIntent({
        channelId: "stable-global",
        platform: "windows-x64",
        section: "artifacts",
      }),
    ).toEqual({
      channelId: "stable-global",
      focusWindow: true,
      platform: "windows-x64",
      route: "/distribution?section=artifacts&channelId=stable-global&platform=windows-x64",
      section: "artifacts",
      source: "distribution-workspace",
      type: "distribution-route-intent",
    });

    expect(
      createEmptySdkworkDistributionCatalog({
        selectedChannelId: "stable-global",
      }),
    ).toMatchObject({
      isAuthenticated: false,
      selectedChannelId: "stable-global",
      summary: {
        blockedArtifacts: 0,
        channelCount: 3,
        readyArtifacts: 4,
      },
      coverage: {
        coveredPlatforms: 4,
        totalPlatforms: 4,
      },
    });
  });
});
