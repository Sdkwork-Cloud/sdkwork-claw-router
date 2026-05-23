import { describe, expect, it, vi } from "vitest";
import * as assetsModule from "../src";

describe("sdkwork-assets-pc-react controller", () => {
  it("filters assets by collection, readiness, and query state", async () => {
    const createSdkworkAssetsController = (assetsModule as Record<string, any>).createSdkworkAssetsController;
    expect(createSdkworkAssetsController).toBeTypeOf("function");

    const controller = createSdkworkAssetsController({
      service: {
        getEmptyWorkspace: vi.fn().mockReturnValue({
          assets: [],
          collections: [],
          digest: {
            attentionRequired: 0,
            collectionCount: 0,
            readyAssets: 0,
            totalAssets: 0,
          },
          isAuthenticated: false,
        }),
        getWorkspace: vi.fn().mockResolvedValue({
          assets: [
            {
              collectionId: "brand-system",
              format: "svg",
              id: "asset-brand-logo",
              licenseTone: "approved",
              readiness: "ready",
              sizeLabel: "512 KB",
              tags: ["brand"],
              title: "Brand Logo",
              updatedAt: "2026-04-03T02:00:00.000Z",
            },
            {
              collectionId: "campaign-kit",
              format: "png",
              id: "asset-launch-poster",
              licenseTone: "restricted",
              readiness: "needs-license",
              sizeLabel: "4.0 MB",
              tags: ["campaign"],
              title: "Launch Poster",
              updatedAt: "2026-04-02T02:00:00.000Z",
            },
          ],
          collections: [
            { assetCount: 1, id: "brand-system", licenseTone: "approved", title: "Brand System" },
            { assetCount: 1, id: "campaign-kit", licenseTone: "restricted", title: "Campaign Kit" },
          ],
          digest: {
            attentionRequired: 1,
            collectionCount: 2,
            readyAssets: 1,
            totalAssets: 2,
          },
          isAuthenticated: true,
        }),
      },
    });

    await controller.bootstrap();

    controller.setCollection("campaign-kit");
    expect(controller.getState().visibleAssets).toHaveLength(1);

    controller.setReadiness("needs-license");
    expect(controller.getState().visibleAssets).toHaveLength(1);

    controller.setSearchQuery("brand");
    expect(controller.getState().visibleAssets).toHaveLength(0);
  });
});
