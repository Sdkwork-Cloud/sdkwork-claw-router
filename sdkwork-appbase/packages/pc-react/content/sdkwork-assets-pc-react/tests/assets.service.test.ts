import { describe, expect, it, vi } from "vitest";
import * as assetsModule from "../src";

describe("sdkwork-assets-pc-react service", () => {
  it("keeps deterministic fallback assets when list operation fails", async () => {
    const createSdkworkAssetsService = (assetsModule as Record<string, any>).createSdkworkAssetsService;
    expect(createSdkworkAssetsService).toBeTypeOf("function");

    const listAssets = vi.fn()
      .mockResolvedValueOnce([
        {
          collectionId: "brand-system",
          format: "svg",
          id: "remote-asset",
          licenseTone: "approved",
          readiness: "ready",
          sizeLabel: "512 KB",
          tags: ["brand"],
          title: "Remote Asset",
          updatedAt: "2026-04-03T04:00:00.000Z",
        },
      ])
      .mockRejectedValueOnce(new Error("offline"));

    const service = createSdkworkAssetsService({
      assets: [
        {
          collectionId: "brand-system",
          format: "png",
          id: "fallback-asset",
          licenseTone: "approved",
          readiness: "ready",
          sizeLabel: "1.2 MB",
          tags: ["fallback"],
          title: "Fallback Asset",
          updatedAt: "2026-04-01T02:00:00.000Z",
        },
      ],
      collections: [
        {
          assetCount: 1,
          id: "brand-system",
          licenseTone: "approved",
          title: "Brand System",
        },
      ],
      getSessionTokens: () => ({
        authToken: "token",
      }),
      listAssets,
    });

    const first = await service.getWorkspace();
    expect(first.isAuthenticated).toBe(true);
    expect(first.assets[0]?.id).toBe("remote-asset");

    const second = await service.getWorkspace();
    expect(second.assets[0]?.id).toBe("fallback-asset");
  });
});
