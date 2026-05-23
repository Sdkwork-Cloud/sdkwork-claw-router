import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  configureCommerceServiceMockSession,
  createCommerceServiceMock,
  resetCommerceServiceMockSession,
} from "../../test-utils/commerce-service-mock";
import { createSdkworkVipService } from "../src";

describe("sdkwork-vip-pc-react service", () => {
  beforeEach(() => {
    configureCommerceServiceMockSession({ authToken: "vip-auth-token" });
  });

  afterEach(() => {
    resetCommerceServiceMockSession();
  });

  it("maps VIP membership, levels, benefits, and packages into a reusable VIP dashboard", async () => {
    const commerceService = createCommerceServiceMock({
      vip: {
        info: {
          retrieve: vi.fn().mockResolvedValue({
            code: "2000",
            data: {
              expireTime: "2026-06-30T00:00:00.000Z",
              growthValue: 180,
              remainingDays: 88,
              totalSpent: 399,
              upgradeGrowthValue: 500,
              vipLevel: 3,
              vipLevelName: "Pro",
              vipPoints: 3200,
              vipStatus: "ACTIVE",
            },
          }),
        },
        status: {
          retrieve: vi.fn().mockResolvedValue({
            code: "2000",
            data: {
              isVip: true,
              pointBalance: 2400,
              vipLevel: 3,
            },
          }),
        },
        benefits: {
          list: vi.fn().mockResolvedValue({
            code: "2000",
            data: [
              {
                benefitKey: "priority-rendering",
                claimed: true,
                description: "Jump the queue for premium workloads.",
                id: 2,
                name: "Priority rendering",
                type: "quota",
                usageLimit: 10,
                usedCount: 2,
              },
              {
                benefitKey: "vip-support",
                claimed: false,
                description: "Priority support responses.",
                id: 1,
                name: "Priority support",
                type: "service",
                usageLimit: 1,
                usedCount: 0,
              },
            ],
          }),
        },
        levels: {
          list: vi.fn().mockResolvedValue({
            code: "2000",
            data: [
              {
                description: "Entry tier",
                id: 1,
                levelValue: 1,
                name: "Free",
                requiredPoints: 0,
              },
              {
                description: "Professional tier",
                id: 3,
                levelValue: 3,
                name: "Pro",
                requiredPoints: 500,
              },
              {
                description: "Growing teams",
                id: 2,
                levelValue: 2,
                name: "Plus",
                requiredPoints: 200,
              },
            ],
          }),
        },
        packages: {
          list: vi.fn().mockResolvedValue({
            code: "2000",
            data: [
              {
                description: "Best for teams",
                id: 2,
                levelName: "Pro",
                name: "Pro Monthly",
                originalPrice: 249,
                pointAmount: 5000,
                price: 199,
                recommended: true,
                sortWeight: 20,
                tags: ["Popular"],
                vipDurationDays: 30,
              },
              {
                description: "Long-running annual plan",
                id: 3,
                levelName: "Pro",
                name: "Pro Annual",
                originalPrice: 899,
                pointAmount: 60000,
                price: 699,
                recommended: false,
                sortWeight: 15,
                tags: ["Annual"],
                vipDurationDays: 365,
              },
            ],
          }),
        },
      },
    });

    const service = createSdkworkVipService({
      commerceService,
    });

    const dashboard = await service.getDashboard();

    expect(dashboard.summary).toMatchObject({
      currentLevelName: "Pro",
      isAuthenticated: true,
      isVip: true,
      remainingDays: 88,
      status: "vip",
    });
    expect(
      dashboard.levels.map((level) => ({
        isCurrent: level.isCurrent,
        name: level.name,
      })),
    ).toEqual([
      { isCurrent: false, name: "Free" },
      { isCurrent: false, name: "Plus" },
      { isCurrent: true, name: "Pro" },
    ]);
    expect(dashboard.benefits[0]).toMatchObject({
      claimed: true,
      id: "vip-benefit-2",
      name: "Priority rendering",
      usedCount: 2,
    });
    expect(dashboard.plans[0]).toMatchObject({
      name: "Pro Monthly",
      packageId: 2,
      recommended: true,
    });
  });

  it("returns a guest-safe VIP dashboard with public package plans when the wallet overview is anonymous", async () => {
    resetCommerceServiceMockSession();
    const packagesList = vi.fn().mockResolvedValue({
      code: "2000",
      data: [
        {
          description: "Starter public plan",
          id: 1,
          levelName: "Plus",
          name: "Plus Monthly",
          originalPrice: 99,
          pointAmount: 1200,
          price: 39,
          recommended: true,
          tags: ["Starter"],
          vipDurationDays: 30,
        },
      ],
    });
    const service = createSdkworkVipService({
      commerceService: createCommerceServiceMock({
        vip: {
          packages: {
            list: packagesList,
          },
        },
      }),
    });

    const dashboard = await service.getDashboard();

    expect(dashboard.summary.isAuthenticated).toBe(false);
    expect(dashboard.summary.status).toBe("guest");
    expect(dashboard.levels).toEqual([]);
    expect(dashboard.benefits).toEqual([]);
    expect(dashboard.plans).toEqual([
      expect.objectContaining({
        name: "Plus Monthly",
        packageId: 1,
        recommended: true,
      }),
    ]);
    expect(packagesList).toHaveBeenCalledTimes(1);
  });

  it("purchases, renews, and upgrades membership through the generated SDK boundary", async () => {
    const purchase = vi.fn().mockResolvedValue({
      code: "2000",
      data: {
        amount: 199,
        durationDays: 30,
        orderId: "VIP-PURCHASE-2",
        packageId: 2,
        packageName: "Pro Monthly",
        status: "SUCCESS",
        targetLevelName: "Pro",
      },
    });
    const renew = vi.fn().mockResolvedValue({
      code: "2000",
      data: {
        amount: 399,
        durationDays: 365,
        orderId: "VIP-RENEW-2",
        packageId: 3,
        packageName: "Pro Annual",
        status: "SUCCESS",
        targetLevelName: "Pro",
      },
    });
    const upgrade = vi.fn().mockResolvedValue({
      code: "2000",
      data: {
        amount: 199,
        durationDays: 30,
        orderId: "VIP-UPGRADE-2",
        packageId: 2,
        packageName: "Pro Monthly",
        status: "SUCCESS",
        targetLevelName: "Pro",
      },
    });
    const commerceService = createCommerceServiceMock({
      vip: {
        purchase: {
          create: purchase,
          renew,
          upgrade,
        },
      },
    });
    const service = createSdkworkVipService({
      commerceService,
    });

    await expect(
      service.purchaseMembership({
        packageId: 2,
        paymentMethod: "WECHAT",
      }),
    ).resolves.toMatchObject({
      amountCny: 199,
      orderId: "VIP-PURCHASE-2",
      packageId: 2,
      status: "completed",
    });

    await expect(
      service.upgradeMembership({
        packageId: 2,
        paymentMethod: "WECHAT",
      }),
    ).resolves.toMatchObject({
      amountCny: 199,
      orderId: "VIP-UPGRADE-2",
      packageId: 2,
      status: "completed",
    });

    await expect(
      service.renewMembership({
        packageId: 3,
        paymentMethod: "ALIPAY",
      }),
    ).resolves.toMatchObject({
      amountCny: 399,
      orderId: "VIP-RENEW-2",
      packageId: 3,
      status: "completed",
    });

    expect(upgrade).toHaveBeenCalledWith({
      couponId: undefined,
      packageId: 2,
      paymentMethod: "WECHAT",
    });
    expect(purchase).toHaveBeenCalledWith({
      couponId: undefined,
      packageId: 2,
      paymentMethod: "WECHAT",
    });
    expect(renew).toHaveBeenCalledWith({
      couponId: undefined,
      packageId: 3,
      paymentMethod: "ALIPAY",
    });
  });

  it("localizes VIP auth and mutation fallback errors at the membership boundary", async () => {
    resetCommerceServiceMockSession();
    const localizedAuthService = createSdkworkVipService({
      locale: "zh-CN",
    });

    await expect(
      localizedAuthService.purchaseMembership({
        packageId: 2,
      }),
    ).rejects.toThrow("请先登录后再管理会员。");

    configureCommerceServiceMockSession({ authToken: "vip-auth-token" });
    const localizedMutationService = createSdkworkVipService({
      commerceService: createCommerceServiceMock({
        vip: {
          purchase: {
            create: vi.fn().mockResolvedValue({
              code: "5000",
            }),
          },
        },
      }),
      locale: "zh-CN",
    });

    await expect(
      localizedMutationService.purchaseMembership({
        packageId: 2,
      }),
    ).rejects.toThrow("购买会员失败。");
  });
});
