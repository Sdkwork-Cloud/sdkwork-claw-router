import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SdkworkThemeProvider } from "@sdkwork/ui-pc-react/theme";
import {
  SdkworkVipIntlProvider,
  SdkworkVipMembershipHero,
  SdkworkVipPage,
  createSdkworkVipController,
} from "../src";

function createDashboard() {
  return {
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
        originalPriceCny: 899,
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
  };
}

function createEmptyDashboard() {
  return {
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
  };
}

function createController() {
  return createSdkworkVipController({
    service: {
      getDashboard: vi.fn().mockResolvedValue(createDashboard()),
      getEmptyDashboard: vi.fn().mockReturnValue(createEmptyDashboard()),
      purchaseMembership: vi.fn(),
      renewMembership: vi.fn(),
      upgradeMembership: vi.fn(),
    },
  });
}

describe("sdkwork-vip-pc-react intl", () => {
  it("renders Chinese copy across the vip page when a Chinese locale is provided", async () => {
    const VipPage = SdkworkVipPage;
    const controller = createController();

    render(
      <SdkworkThemeProvider defaultTheme="light">
        <VipPage controller={controller} locale="zh-CN" />
      </SdkworkThemeProvider>,
    );

    expect(
      await screen.findByRole("heading", {
        name: "会员中心",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "立即升级" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "权益" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "会员方案" })).toBeInTheDocument();
  });

  it("applies host message overrides on top of the localized vip seam", async () => {
    const VipPage = SdkworkVipPage;
    const controller = createController();

    render(
      <SdkworkThemeProvider defaultTheme="light">
        <VipPage
          controller={controller}
          locale="zh-CN"
          messages={{
            hero: {
              title: "Host membership cockpit",
            },
            actions: {
              renew: "Renew from host",
            },
          }}
        />
      </SdkworkThemeProvider>,
    );

    expect(
      await screen.findByRole("heading", {
        name: "Host membership cockpit",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Renew from host" })).toBeInTheDocument();
  });

  it("falls back to built-in English copy for standalone vip components without a host intl provider", () => {
    const VipMembershipHero = SdkworkVipMembershipHero;

    render(
      <SdkworkThemeProvider defaultTheme="light">
        <VipMembershipHero
          isMutating={false}
          onPurchase={vi.fn()}
          onRenew={vi.fn()}
          onUpgrade={vi.fn()}
          selectedPlan={createDashboard().plans[0]}
          summary={createDashboard().summary}
        />
      </SdkworkThemeProvider>,
    );

    expect(screen.getByText("Membership")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /upgrade now/i })).toBeInTheDocument();
    expect(screen.getByText("Current level")).toBeInTheDocument();
  });

  it("lets standalone vip components consume Chinese copy through the intl provider", () => {
    const VipIntlProvider = SdkworkVipIntlProvider;
    const VipMembershipHero = SdkworkVipMembershipHero;

    expect(VipIntlProvider).toBeTypeOf("function");

    if (typeof VipIntlProvider !== "function") {
      return;
    }

    render(
      <SdkworkThemeProvider defaultTheme="light">
        <VipIntlProvider locale="zh-CN">
          <VipMembershipHero
            isMutating={false}
            onPurchase={vi.fn()}
            onRenew={vi.fn()}
            onUpgrade={vi.fn()}
            selectedPlan={createDashboard().plans[0]}
            summary={createDashboard().summary}
          />
        </VipIntlProvider>
      </SdkworkThemeProvider>,
    );

    expect(screen.getAllByText("会员").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "立即升级" })).toBeInTheDocument();
    expect(screen.getByText("当前等级")).toBeInTheDocument();
  });
});
