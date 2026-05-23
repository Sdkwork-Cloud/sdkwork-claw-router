import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SdkworkThemeProvider } from "@sdkwork/ui-pc-react/theme";
import * as driveModule from "../src";

describe("sdkwork-drive-pc-react page", () => {
  it("renders drive control room and filters entries by search input", async () => {
    const Page = (driveModule as Record<string, any>).SdkworkDrivePage;
    expect(Page).toBeTypeOf("function");

    render(
      <SdkworkThemeProvider defaultTheme="light">
        <Page
          service={{
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
                  updatedAt: "2026-04-03T03:15:00.000Z",
                },
                {
                  id: "entry-design-archive",
                  kind: "folder",
                  locationId: "design-vault",
                  sizeLabel: "12 GB",
                  syncPosture: "healthy",
                  title: "Design Archive",
                  updatedAt: "2026-04-02T03:15:00.000Z",
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
          }}
        />
      </SdkworkThemeProvider>,
    );

    expect(await screen.findByRole("heading", { name: /drive control room/i })).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/search drive/i), {
      target: { value: "ops" },
    });

    await waitFor(() => {
      expect(screen.queryByText("Design Archive")).not.toBeInTheDocument();
    });
  });
});
