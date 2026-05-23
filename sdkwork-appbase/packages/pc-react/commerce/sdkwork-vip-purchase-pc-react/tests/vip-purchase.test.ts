import { describe, expect, it } from "vitest";
import {
  createSdkworkVipPurchaseService,
  createVipPurchaseRouteIntent,
  createVipPurchaseWorkspaceManifest,
  resolveSdkworkVipPurchaseMode,
  vipPurchasePackageMeta,
} from "../src";
import {
  configureCommerceServiceMockSession,
  createCommerceServiceMock,
  resetCommerceServiceMockSession,
} from "../../test-utils/commerce-service-mock";
import { vi } from "vitest";

describe("sdkwork-vip-purchase-pc-react headless contract", () => {
  it("creates independent VIP purchase manifests, route intents, and purchase mode decisions", () => {
    expect(vipPurchasePackageMeta).toMatchObject({
      domain: "commerce",
      package: "@sdkwork/vip-purchase-pc-react",
    });

    expect(createVipPurchaseWorkspaceManifest()).toMatchObject({
      capability: "vip-purchase",
      packageNames: ["@sdkwork/vip-purchase-pc-react", "@sdkwork/vip-pc-react"],
      routePath: "/vip/purchase",
      title: "VIP Purchase",
    });

    expect(createVipPurchaseRouteIntent({
      mode: "purchase",
      packageId: 2,
    })).toEqual({
      focusWindow: true,
      mode: "purchase",
      packageId: 2,
      route: "/vip/purchase?mode=purchase&packageId=2",
      source: "vip-purchase-workspace",
      type: "vip-purchase-route-intent",
    });

    expect(resolveSdkworkVipPurchaseMode({
      summary: {
        isVip: false,
        remainingDays: null,
      },
    })).toBe("purchase");
    expect(resolveSdkworkVipPurchaseMode({
      plan: {
        durationDays: 365,
        packageId: 3,
      },
      summary: {
        isVip: true,
        remainingDays: 20,
      },
    })).toBe("renew");
    expect(resolveSdkworkVipPurchaseMode({
      plan: {
        durationDays: 365,
        packageId: 3,
      },
      summary: {
        isVip: true,
        remainingDays: 180,
      },
    })).toBe("upgrade");
  });

  it("submits package purchase, renewal, and upgrade through the VIP purchase service boundary", async () => {
    configureCommerceServiceMockSession({ authToken: "vip-purchase-auth-token" });
    const purchase = vi.fn().mockResolvedValue({
      code: "2000",
      data: {
        amount: "199.00",
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
        orderId: "VIP-RENEW-3",
        packageId: 3,
        packageName: "Pro Annual",
        status: "SUCCESS",
        targetLevelName: "Pro",
      },
    });
    const upgrade = vi.fn().mockResolvedValue({
      code: "2000",
      data: {
        amount: 99,
        durationDays: 30,
        orderId: "VIP-UPGRADE-4",
        packageId: 4,
        packageName: "Team Plus",
        status: "PENDING",
        targetLevelName: "Team",
      },
    });
    const service = createSdkworkVipPurchaseService({
      commerceService: createCommerceServiceMock({
        vip: {
          purchase: {
            create: purchase,
            renew,
            upgrade,
          },
        },
      }),
    });

    await expect(
      service.submitPackagePurchase({
        packageId: 2,
        paymentMethod: "WECHAT",
        summary: {
          isVip: false,
          remainingDays: null,
        },
      }),
    ).resolves.toMatchObject({
      amountCny: 199,
      mode: "purchase",
      orderId: "VIP-PURCHASE-2",
      packageId: 2,
      status: "completed",
    });
    await expect(
      service.submitPackagePurchase({
        packageId: 3,
        paymentMethod: "ALIPAY",
        plan: {
          durationDays: 365,
          packageId: 3,
        },
        summary: {
          isVip: true,
          remainingDays: 20,
        },
      }),
    ).resolves.toMatchObject({
      mode: "renew",
      orderId: "VIP-RENEW-3",
      packageId: 3,
      status: "completed",
    });
    await expect(
      service.submitPackagePurchase({
        packageId: 4,
        paymentMethod: "WECHAT",
        plan: {
          durationDays: 365,
          packageId: 4,
        },
        summary: {
          isVip: true,
          remainingDays: 180,
        },
      }),
    ).resolves.toMatchObject({
      mode: "upgrade",
      orderId: "VIP-UPGRADE-4",
      packageId: 4,
      status: "pending",
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
    expect(upgrade).toHaveBeenCalledWith({
      couponId: undefined,
      packageId: 4,
      paymentMethod: "WECHAT",
    });

    resetCommerceServiceMockSession();
  });

  it("keeps the package purchase submit method safe when passed as a callback", async () => {
    configureCommerceServiceMockSession({ authToken: "vip-purchase-auth-token" });
    const purchase = vi.fn().mockResolvedValue({
      code: "2000",
      data: {
        amount: 199,
        orderId: "VIP-PURCHASE-CALLBACK-1",
        packageId: 2,
        status: "SUCCESS",
      },
    });
    const service = createSdkworkVipPurchaseService({
      commerceService: createCommerceServiceMock({
        vip: {
          purchase: {
            create: purchase,
          },
        },
      }),
    });
    const { submitPackagePurchase } = service;

    await expect(
      submitPackagePurchase({
        packageId: 2,
        summary: {
          isVip: false,
          remainingDays: null,
        },
      }),
    ).resolves.toMatchObject({
      mode: "purchase",
      orderId: "VIP-PURCHASE-CALLBACK-1",
    });

    expect(purchase).toHaveBeenCalledWith({
      couponId: undefined,
      packageId: 2,
      paymentMethod: undefined,
    });
    resetCommerceServiceMockSession();
  });
});
