import { describe, expect, it } from "vitest";
import {
  createVipRouteIntent,
  createVipWorkspaceManifest,
  summarizeSdkworkVipBenefits,
  summarizeSdkworkVipLevels,
  vipPackageMeta,
} from "../src";

describe("sdkwork-vip-pc-react headless contract", () => {
  it("creates reusable VIP manifests, route intents, and commercial digests", () => {
    expect(vipPackageMeta).toMatchObject({
      domain: "commerce",
      package: "@sdkwork/vip-pc-react",
    });

    expect(
      createVipWorkspaceManifest({
        title: "VIP",
      }),
    ).toMatchObject({
      capability: "vip",
      packageNames: ["@sdkwork/vip-pc-react"],
      routePath: "/vip",
      title: "VIP",
    });

    expect(
      createVipRouteIntent({
        sectionId: "benefits",
      }),
    ).toEqual({
      focusWindow: true,
      route: "/vip?section=benefits",
      sectionId: "benefits",
      source: "vip-workspace",
      type: "vip-route-intent",
    });

    expect(
      summarizeSdkworkVipBenefits([
        {
          claimed: true,
          id: "a",
          name: "Priority rendering",
          usageLimit: 10,
          usedCount: 2,
        },
        {
          claimed: false,
          id: "b",
          name: "Priority support",
          usageLimit: 1,
          usedCount: 0,
        },
      ]),
    ).toMatchObject({
      claimedBenefits: 1,
      limitedBenefits: 2,
      totalBenefits: 2,
      unusedLimitedBenefits: 1,
    });

    expect(
      summarizeSdkworkVipLevels([
        {
          id: "1",
          isCurrent: false,
          levelValue: 1,
          name: "Free",
          requiredPoints: 0,
        },
        {
          id: "2",
          isCurrent: true,
          levelValue: 2,
          name: "Plus",
          requiredPoints: 200,
        },
        {
          id: "3",
          isCurrent: false,
          levelValue: 3,
          name: "Pro",
          requiredPoints: 500,
        },
      ]),
    ).toMatchObject({
      currentLevelName: "Plus",
      highestLevelName: "Pro",
      levelCount: 3,
      nextLevelName: "Pro",
    });
  });
});
