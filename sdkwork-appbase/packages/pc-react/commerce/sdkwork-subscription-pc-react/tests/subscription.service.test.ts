import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  configureCommerceServiceMockSession,
  createCommerceServiceMock,
  resetCommerceServiceMockSession,
} from "../../test-utils/commerce-service-mock";
import { createSdkworkSubscriptionService } from "../src";

describe("sdkwork-subscription-pc-react service", () => {
  beforeEach(() => {
    configureCommerceServiceMockSession({ authToken: "subscription-auth-token" });
  });

  afterEach(() => {
    resetCommerceServiceMockSession();
  });

  it("maps VIP dashboard data and checkout-ready coupons into a reusable subscription dashboard", async () => {
    const commerceService = createCommerceServiceMock({
      users: {
        current: {
          coupons: {
            list: vi.fn().mockResolvedValue({
              code: "2000",
              data: {
                content: [
                  {
                    amount: 50,
                    available: true,
                    couponCode: "SPRING50",
                    couponId: "200",
                    couponName: "Spring Launch 50",
                    discount: undefined,
                    expireAt: "2026-05-20T00:00:00.000Z",
                    minConsume: 199,
                    remainingDays: 47,
                    status: "UNUSED",
                    statusName: "Available",
                    type: "CASH",
                    userCouponId: "UC-200",
                  },
                  {
                    amount: undefined,
                    available: true,
                    couponCode: "YEAR85",
                    couponId: "201",
                    couponName: "Yearly 8.5 Discount",
                    discount: 8.5,
                    expireAt: "2026-07-01T00:00:00.000Z",
                    minConsume: 300,
                    remainingDays: 89,
                    status: "UNUSED",
                    statusName: "Available",
                    type: "DISCOUNT",
                    userCouponId: "UC-201",
                  },
                ],
                totalElements: 2,
              },
            }),
          },
        },
      },
    });

    const service = createSdkworkSubscriptionService({
      commerceService,
      paymentService: {
        getDashboard: vi.fn().mockResolvedValue({
          clientType: "WEB",
          digest: {
            actionablePayments: 0,
            closedPayments: 0,
            failedPayments: 0,
            successfulPayments: 0,
            timedOutPayments: 0,
            totalAmountCny: 0,
            totalPayments: 0,
          },
          methods: [
            {
              available: true,
              code: "WECHAT_PAY",
              icon: "https://cdn.sdkwork.ai/icons/wechat.png",
              id: "wechat-pay",
              label: "WeChat Pay",
              productTypes: [
                {
                  available: true,
                  code: "native",
                  label: "Native",
                },
              ],
              recommendedProductType: "native",
              sort: 100,
            },
            {
              available: true,
              code: "ALIPAY",
              icon: "https://cdn.sdkwork.ai/icons/alipay.png",
              id: "alipay-pay",
              label: "Alipay",
              productTypes: [
                {
                  available: true,
                  code: "pc",
                  label: "PC Web",
                },
              ],
              recommendedProductType: "pc",
              sort: 90,
            },
            {
              available: true,
              code: "UNION_PAY",
              icon: "https://cdn.sdkwork.ai/icons/union-pay.png",
              id: "union-pay",
              label: "UnionPay",
              productTypes: [
                {
                  available: true,
                  code: "pc",
                  label: "PC Web",
                },
              ],
              recommendedProductType: "pc",
              sort: 80,
            },
          ],
          records: [],
          statistics: {
            closedPayments: 0,
            failedPayments: 0,
            pendingPayments: 0,
            successPayments: 0,
            timeoutPayments: 0,
            totalPayments: 0,
          },
        }),
        getEmptyDashboard: vi.fn().mockReturnValue({
          clientType: "WEB",
          digest: {
            actionablePayments: 0,
            closedPayments: 0,
            failedPayments: 0,
            successfulPayments: 0,
            timedOutPayments: 0,
            totalAmountCny: 0,
            totalPayments: 0,
          },
          methods: [],
          records: [],
          statistics: {
            closedPayments: 0,
            failedPayments: 0,
            pendingPayments: 0,
            successPayments: 0,
            timeoutPayments: 0,
            totalPayments: 0,
          },
        }),
      },
      vipService: {
        getDashboard: vi.fn().mockResolvedValue({
          benefits: [
            {
              claimed: true,
              id: "vip-benefit-2",
              name: "Priority rendering",
              usageLimit: 10,
              usedCount: 2,
            },
          ],
          levels: [
            {
              id: "vip-level-3",
              isCurrent: true,
              levelValue: 3,
              name: "Pro",
              requiredPoints: 500,
            },
          ],
          plans: [
            {
              description: "Best for professional creators.",
              durationDays: 30,
              id: "vip-plan-2",
              includedPoints: 5000,
              name: "Pro Monthly",
              packageId: 2,
              priceCny: 199,
              recommended: true,
              tags: ["Popular"],
            },
            {
              description: "Best for annual savings.",
              durationDays: 365,
              id: "vip-plan-3",
              includedPoints: 60000,
              name: "Pro Annual",
              packageId: 3,
              priceCny: 699,
              recommended: false,
              tags: ["Annual"],
            },
          ],
          summary: {
            currentLevelName: "Pro",
            currentLevelValue: 3,
            expireTime: "2026-06-30T00:00:00.000Z",
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
        getEmptyDashboard: vi.fn(),
        purchaseMembership: vi.fn(),
        renewMembership: vi.fn(),
        upgradeMembership: vi.fn(),
      },
    });

    const dashboard = await service.getDashboard();

    expect(dashboard.summary).toMatchObject({
      currentLevelName: "Pro",
      isAuthenticated: true,
      isVip: true,
      remainingDays: 88,
      status: "vip",
    });
    expect(dashboard.plans[0]).toMatchObject({
      name: "Pro Monthly",
      packageId: 2,
      recommended: true,
    });
    expect(dashboard.coupons[0]).toMatchObject({
      code: "SPRING50",
      discountAmountCny: 50,
      id: "user-coupon-UC-200",
      minimumSpendCny: 199,
      name: "Spring Launch 50",
      status: "available",
      type: "cash",
    });
    expect(dashboard.paymentMethods).toEqual([
      expect.objectContaining({
        code: "WECHAT_PAY",
        id: "wechat-pay",
        kind: "qr",
        label: "WeChat Pay",
        paymentMethod: "WECHAT",
        recommended: true,
        recommendedProductType: "native",
      }),
      expect.objectContaining({
        code: "ALIPAY",
        id: "alipay-pay",
        kind: "other",
        label: "Alipay",
        paymentMethod: "ALIPAY",
        recommended: false,
        recommendedProductType: "pc",
      }),
    ]);
    expect(dashboard.checkout).toMatchObject({
      action: "upgrade",
      discountAmountCny: 50,
      originalAmountCny: 199,
      payableAmountCny: 149,
      selectedCouponId: "user-coupon-UC-200",
      selectedPackageId: 2,
      selectedPaymentMethodCode: "WECHAT_PAY",
      selectedPaymentMethodId: "wechat-pay",
    });
  });

  it("returns a guest-safe subscription dashboard when the current membership is anonymous", async () => {
    const service = createSdkworkSubscriptionService({
      vipService: {
        getDashboard: vi.fn().mockResolvedValue({
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
        getEmptyDashboard: vi.fn(),
        purchaseMembership: vi.fn(),
        renewMembership: vi.fn(),
        upgradeMembership: vi.fn(),
      },
    });

    const dashboard = await service.getDashboard();

    expect(dashboard.summary.status).toBe("guest");
    expect(dashboard.coupons).toEqual([]);
    expect(dashboard.checkout).toMatchObject({
      action: "purchase",
      discountAmountCny: 0,
      payableAmountCny: 0,
      selectedCouponId: null,
      selectedPackageId: null,
    });
  });

  it("delegates purchase, renew, and upgrade actions to the VIP membership service boundary", async () => {
    const purchaseMembership = vi.fn().mockResolvedValue({
      amountCny: 199,
      durationDays: 30,
      orderId: "VIP-PURCHASE-1",
      packageId: 2,
      packageName: "Pro Monthly",
      status: "completed",
      targetLevelName: "Pro",
    });
    const renewMembership = vi.fn().mockResolvedValue({
      amountCny: 699,
      durationDays: 365,
      orderId: "VIP-RENEW-1",
      packageId: 3,
      packageName: "Pro Annual",
      status: "completed",
      targetLevelName: "Pro",
    });
    const upgradeMembership = vi.fn().mockResolvedValue({
      amountCny: 199,
      durationDays: 30,
      orderId: "VIP-UPGRADE-1",
      packageId: 2,
      packageName: "Pro Monthly",
      status: "completed",
      targetLevelName: "Pro",
    });
    const service = createSdkworkSubscriptionService({
      vipService: {
        getDashboard: vi.fn().mockResolvedValue({
          benefits: [],
          levels: [],
          plans: [],
          summary: {
            currentLevelName: "Free",
            currentLevelValue: 1,
            growthValue: 20,
            isAuthenticated: true,
            isVip: false,
            pointBalance: 100,
            remainingDays: null,
            status: "free" as const,
            totalSpent: 0,
            upgradeGrowthValue: 200,
            vipPoints: 20,
          },
        }),
        getEmptyDashboard: vi.fn(),
        purchaseMembership,
        renewMembership,
        upgradeMembership,
      },
    });

    await expect(
      service.purchaseSubscription({
        couponId: "UC-200",
        packageId: 2,
        paymentMethod: "ALIPAY",
      }),
    ).resolves.toMatchObject({
      amountCny: 199,
      orderId: "VIP-PURCHASE-1",
      packageId: 2,
      status: "completed",
    });

    await expect(
      service.renewSubscription({
        packageId: 3,
        paymentMethod: "WECHAT",
      }),
    ).resolves.toMatchObject({
      amountCny: 699,
      orderId: "VIP-RENEW-1",
      packageId: 3,
      status: "completed",
    });

    await expect(
      service.upgradeSubscription({
        couponId: "UC-200",
        packageId: 2,
        paymentMethod: "WECHAT",
      }),
    ).resolves.toMatchObject({
      amountCny: 199,
      orderId: "VIP-UPGRADE-1",
      packageId: 2,
      status: "completed",
    });

    expect(purchaseMembership).toHaveBeenCalledWith({
      couponId: "UC-200",
      packageId: 2,
      paymentMethod: "ALIPAY",
    });
    expect(renewMembership).toHaveBeenCalledWith({
      couponId: undefined,
      packageId: 3,
      paymentMethod: "WECHAT",
    });
    expect(upgradeMembership).toHaveBeenCalledWith({
      couponId: "UC-200",
      packageId: 2,
      paymentMethod: "WECHAT",
    });
  });

  it("localizes auth at subscription entry and uses VIP-owned mutation fallback errors", async () => {
    resetCommerceServiceMockSession();
    const localizedAuthService = createSdkworkSubscriptionService({
      locale: "zh-CN",
    });

    await expect(
      localizedAuthService.purchaseSubscription({
        packageId: 2,
      }),
    ).rejects.toThrow("请先登录后再管理订阅。");

    configureCommerceServiceMockSession({ authToken: "subscription-auth-token" });
    const localizedMutationService = createSdkworkSubscriptionService({
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
      localizedMutationService.purchaseSubscription({
        packageId: 2,
      }),
    ).rejects.toThrow("购买会员失败。");
  });
});
