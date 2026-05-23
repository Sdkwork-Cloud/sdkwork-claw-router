import { describe, expect, it } from "vitest";
import * as assetsModule from "../src";

describe("sdkwork-assets-pc-react domain contract", () => {
  it("creates workspace manifest, route intents, and deterministic assets workspace", () => {
    const {
      assetsPackageMeta,
      createAssetsRouteIntent,
      createAssetsWorkspaceManifest,
      createEmptySdkworkAssetsWorkspace,
    } = assetsModule as Record<string, any>;

    expect(assetsPackageMeta).toMatchObject({
      domain: "content",
      package: "@sdkwork/assets-pc-react",
      status: "ready",
    });

    expect(
      createAssetsWorkspaceManifest({
        title: "Asset Catalog",
      }),
    ).toMatchObject({
      capability: "assets",
      routePath: "/assets",
      title: "Asset Catalog",
    });

    expect(
      createAssetsRouteIntent({
        assetId: "asset-logo-lockup",
        collectionId: "brand-system",
      }),
    ).toEqual({
      assetId: "asset-logo-lockup",
      collectionId: "brand-system",
      focusWindow: true,
      route: "/assets?collectionId=brand-system&assetId=asset-logo-lockup",
      source: "assets-workspace",
      type: "assets-route-intent",
    });

    expect(createEmptySdkworkAssetsWorkspace()).toMatchObject({
      collections: expect.arrayContaining([
        expect.objectContaining({ id: "brand-system" }),
      ]),
      digest: {
        collectionCount: 3,
        totalAssets: 4,
      },
      isAuthenticated: false,
    });
  });
});
