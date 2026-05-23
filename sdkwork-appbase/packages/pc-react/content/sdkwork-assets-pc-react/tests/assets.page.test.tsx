import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SdkworkThemeProvider } from "@sdkwork/ui-pc-react/theme";
import * as assetsModule from "../src";

describe("sdkwork-assets-pc-react page", () => {
  it("renders asset catalog and filters assets by search input", async () => {
    const Page = (assetsModule as Record<string, any>).SdkworkAssetsPage;
    expect(Page).toBeTypeOf("function");

    render(
      <SdkworkThemeProvider defaultTheme="light">
        <Page
          service={{
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
                  collectionId: "campaign-kit",
                  format: "png",
                  id: "asset-launch-poster",
                  licenseTone: "restricted",
                  readiness: "needs-license",
                  sizeLabel: "4.0 MB",
                  tags: ["campaign"],
                  title: "Launch Poster",
                  updatedAt: "2026-04-03T03:00:00.000Z",
                },
                {
                  collectionId: "brand-system",
                  format: "svg",
                  id: "asset-logo-lockup",
                  licenseTone: "approved",
                  readiness: "ready",
                  sizeLabel: "512 KB",
                  tags: ["brand"],
                  title: "Logo Lockup",
                  updatedAt: "2026-04-02T03:00:00.000Z",
                },
              ],
              collections: [
                { assetCount: 1, id: "campaign-kit", licenseTone: "restricted", title: "Campaign Kit" },
                { assetCount: 1, id: "brand-system", licenseTone: "approved", title: "Brand System" },
              ],
              digest: {
                attentionRequired: 1,
                collectionCount: 2,
                readyAssets: 1,
                totalAssets: 2,
              },
              isAuthenticated: true,
            }),
          }}
        />
      </SdkworkThemeProvider>,
    );

    expect(await screen.findByRole("heading", { name: /asset catalog/i })).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/search assets/i), {
      target: { value: "poster" },
    });

    await waitFor(() => {
      expect(screen.queryByText("Logo Lockup")).not.toBeInTheDocument();
    });
  });
});
