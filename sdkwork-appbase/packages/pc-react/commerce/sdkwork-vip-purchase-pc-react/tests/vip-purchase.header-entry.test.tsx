import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { configureSdkworkCommerceServiceProvider } from "@sdkwork/commerce-service";
import { SdkworkThemeProvider } from "@sdkwork/ui-pc-react/theme";
import { createSdkworkVipController } from "@sdkwork/vip-pc-react";
import {
  configureCommerceServiceMockSession,
  createCommerceServiceMock,
  resetCommerceServiceMockSession,
} from "../../test-utils/commerce-service-mock";
import type { SdkworkVipPurchaseService } from "../src";
import { SdkworkVipPurchaseHeaderEntry } from "../src";

function createDashboard() {
  return {
    benefits: [],
    levels: [],
    plans: [
      {
        description: "Best for teams",
        durationDays: 30,
        id: "vip-package-2",
        includedPoints: 5000,
        name: "Pro Monthly",
        packageId: 2,
        priceCny: 199,
        recommended: true,
        tags: ["Popular"],
      },
    ],
    summary: {
      currentLevelName: "Free",
      currentLevelValue: null,
      growthValue: null,
      isAuthenticated: true,
      isVip: false,
      pointBalance: 100,
      remainingDays: null,
      status: "free" as const,
      totalSpent: 0,
      upgradeGrowthValue: 200,
      vipPoints: 0,
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

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });

  return {
    promise,
    reject,
    resolve,
  };
}

function createVipPurchaseServiceStub(
  submitPackagePurchase: SdkworkVipPurchaseService["submitPackagePurchase"],
): SdkworkVipPurchaseService {
  const unusedMutation = vi.fn(async () => {
    throw new Error("Unexpected VIP purchase service method call.");
  });

  return {
    purchasePackage: unusedMutation,
    renewPackage: unusedMutation,
    submitPackagePurchase,
    upgradePackage: unusedMutation,
  };
}

describe("sdkwork-vip-purchase-pc-react header entry", () => {
  afterEach(() => {
    configureSdkworkCommerceServiceProvider(null);
    resetCommerceServiceMockSession();
  });

  it("opens the top-header VIP purchase menu and purchases the selected package through the default purchase service", async () => {
    const purchaseMembership = vi.fn().mockResolvedValue({
      amountCny: 199,
      orderId: "VIP-PURCHASE-1",
      packageId: 2,
      status: "completed",
    });
    const create = vi.fn().mockResolvedValue({
      code: "2000",
      data: {
        amount: 199,
        orderId: "VIP-PURCHASE-1",
        packageId: 2,
        status: "SUCCESS",
      },
    });
    configureCommerceServiceMockSession({ authToken: "vip-purchase-auth-token" });
    configureSdkworkCommerceServiceProvider(() => createCommerceServiceMock({
      vip: {
        purchase: {
          create,
        },
      },
    }));
    const controller = createSdkworkVipController({
      service: {
        getDashboard: vi.fn().mockResolvedValue(createDashboard()),
        getEmptyDashboard: vi.fn().mockReturnValue(createEmptyDashboard()),
        purchaseMembership,
        renewMembership: vi.fn(),
        upgradeMembership: vi.fn(),
      },
    });

    render(
      <SdkworkThemeProvider defaultTheme="light">
        <SdkworkVipPurchaseHeaderEntry controller={controller} />
      </SdkworkThemeProvider>,
    );

    fireEvent.click(await screen.findByRole("button", { name: /buy vip membership/i }));

    expect(await screen.findByText("VIP packages")).toBeInTheDocument();
    expect(screen.getByText("Pro Monthly")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /confirm payment/i }));

    expect(create).toHaveBeenCalledWith({
      couponId: undefined,
      packageId: 2,
      paymentMethod: "WECHAT",
    });
    expect(purchaseMembership).not.toHaveBeenCalled();
  });

  it("can route the header purchase action through the independent VIP purchase service", async () => {
    const submitPackagePurchase = vi.fn().mockResolvedValue({
      amountCny: 199,
      mode: "purchase",
      orderId: "VIP-PURCHASE-SERVICE-1",
      packageId: 2,
      status: "completed",
    });
    const purchaseService = createVipPurchaseServiceStub(submitPackagePurchase);
    const controller = createSdkworkVipController({
      service: {
        getDashboard: vi.fn().mockResolvedValue(createDashboard()),
        getEmptyDashboard: vi.fn().mockReturnValue(createEmptyDashboard()),
        purchaseMembership: vi.fn(),
        renewMembership: vi.fn(),
        upgradeMembership: vi.fn(),
      },
    });

    render(
      <SdkworkThemeProvider defaultTheme="light">
        <SdkworkVipPurchaseHeaderEntry controller={controller} purchaseService={purchaseService} />
      </SdkworkThemeProvider>,
    );

    fireEvent.click(await screen.findByRole("button", { name: /buy vip membership/i }));
    fireEvent.click(await screen.findByRole("button", { name: /confirm payment/i }));

    expect(submitPackagePurchase).toHaveBeenCalledWith({
      mode: "purchase",
      packageId: 2,
      paymentMethod: "WECHAT",
      plan: expect.objectContaining({
        packageId: 2,
      }),
      summary: expect.objectContaining({
        isVip: false,
      }),
    });
  });

  it("guards the package purchase submit action while a request is in flight", async () => {
    const deferred = createDeferred<{
      amountCny: number;
      mode: "purchase";
      orderId: string;
      packageId: number;
      status: "completed";
    }>();
    const submitPackagePurchase = vi.fn().mockReturnValue(deferred.promise);
    const purchaseService = createVipPurchaseServiceStub(submitPackagePurchase);
    const controller = createSdkworkVipController({
      service: {
        getDashboard: vi.fn().mockResolvedValue(createDashboard()),
        getEmptyDashboard: vi.fn().mockReturnValue(createEmptyDashboard()),
        purchaseMembership: vi.fn(),
        renewMembership: vi.fn(),
        upgradeMembership: vi.fn(),
      },
    });

    render(
      <SdkworkThemeProvider defaultTheme="light">
        <SdkworkVipPurchaseHeaderEntry controller={controller} purchaseService={purchaseService} />
      </SdkworkThemeProvider>,
    );

    fireEvent.click(await screen.findByRole("button", { name: /buy vip membership/i }));
    const confirmButton = await screen.findByRole("button", { name: /confirm payment/i });
    fireEvent.click(confirmButton);
    fireEvent.click(confirmButton);

    expect(submitPackagePurchase).toHaveBeenCalledTimes(1);

    deferred.resolve({
      amountCny: 199,
      mode: "purchase",
      orderId: "VIP-PURCHASE-PENDING-1",
      packageId: 2,
      status: "completed",
    });
  });

  it("keeps the purchase menu open and shows the service error when package purchase fails", async () => {
    const submitPackagePurchase = vi.fn().mockRejectedValue(new Error("Payment channel unavailable."));
    const purchaseService = createVipPurchaseServiceStub(submitPackagePurchase);
    const controller = createSdkworkVipController({
      service: {
        getDashboard: vi.fn().mockResolvedValue(createDashboard()),
        getEmptyDashboard: vi.fn().mockReturnValue(createEmptyDashboard()),
        purchaseMembership: vi.fn(),
        renewMembership: vi.fn(),
        upgradeMembership: vi.fn(),
      },
    });

    render(
      <SdkworkThemeProvider defaultTheme="light">
        <SdkworkVipPurchaseHeaderEntry controller={controller} purchaseService={purchaseService} />
      </SdkworkThemeProvider>,
    );

    fireEvent.click(await screen.findByRole("button", { name: /buy vip membership/i }));
    fireEvent.click(await screen.findByRole("button", { name: /confirm payment/i }));

    expect(await screen.findByText("Payment channel unavailable.")).toBeInTheDocument();
    expect(screen.getByText("VIP packages")).toBeInTheDocument();
  });

  it("delegates VIP center navigation to the host callback", async () => {
    const onOpenCenter = vi.fn();
    const controller = createSdkworkVipController({
      service: {
        getDashboard: vi.fn().mockResolvedValue(createDashboard()),
        getEmptyDashboard: vi.fn().mockReturnValue(createEmptyDashboard()),
        purchaseMembership: vi.fn(),
        renewMembership: vi.fn(),
        upgradeMembership: vi.fn(),
      },
    });

    render(
      <SdkworkThemeProvider defaultTheme="light">
        <SdkworkVipPurchaseHeaderEntry controller={controller} onOpenCenter={onOpenCenter} />
      </SdkworkThemeProvider>,
    );

    fireEvent.click(await screen.findByRole("button", { name: /buy vip membership/i }));
    fireEvent.click(await screen.findByRole("button", { name: /open vip center/i }));

    expect(onOpenCenter).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("VIP packages")).not.toBeInTheDocument();
  });
});
