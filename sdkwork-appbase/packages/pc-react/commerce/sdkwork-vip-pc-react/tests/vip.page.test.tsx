import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SdkworkThemeProvider } from "@sdkwork/ui-pc-react/theme";
import { SdkworkVipPage, createSdkworkVipController } from "../src";

describe("sdkwork-vip-pc-react page", () => {
  it("renders the reusable VIP center with plans, benefits, and level comparison", async () => {
    const controller = createSdkworkVipController({
      service: {
        getDashboard: vi.fn().mockResolvedValue({
          benefits: [
            {
              claimed: true,
              description: "Jump the queue for premium workloads.",
              id: "vip-benefit-2",
              name: "Priority rendering",
              type: "quota",
              usageLimit: 10,
              usedCount: 2,
            },
          ],
          levels: [
            {
              description: "Professional tier",
              id: "vip-level-3",
              isCurrent: true,
              levelValue: 3,
              name: "Pro",
              requiredPoints: 500,
            },
          ],
          plans: [
            {
              description: "Best for teams",
              durationDays: 365,
              id: "vip-plan-3",
              includedPoints: 60000,
              name: "Pro Annual",
              packageId: 3,
              priceCny: 699,
              recommended: true,
              tags: ["Annual"],
            },
          ],
          summary: {
            currentLevelName: "Pro",
            currentLevelValue: 3,
            growthValue: 180,
            isAuthenticated: true,
            isVip: true,
            pointBalance: 2400,
            remainingDays: 88,
            status: "vip" as const,
            totalSpent: 399,
            upgradeGrowthValue: 500,
            vipPoints: 3200,
          },
        }),
        getEmptyDashboard: vi.fn().mockReturnValue({
          benefits: [],
          levels: [],
          plans: [],
          summary: {
            currentLevelName: "Guest",
            currentLevelValue: null,
            growthValue: null,
            isAuthenticated: false,
            isVip: false,
            pointBalance: null,
            remainingDays: null,
            status: "guest" as const,
            totalSpent: null,
            upgradeGrowthValue: null,
            vipPoints: null,
          },
        }),
        purchaseMembership: vi.fn(),
        renewMembership: vi.fn(),
        upgradeMembership: vi.fn(),
      },
    });

    render(
      <SdkworkThemeProvider defaultTheme="light">
        <SdkworkVipPage controller={controller} />
      </SdkworkThemeProvider>,
    );

    expect(
      await screen.findByRole("heading", {
        name: /vip center/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /upgrade now/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Priority rendering")).toBeInTheDocument();
    expect(screen.getAllByText("Pro Annual").length).toBeGreaterThan(0);
  });
});
