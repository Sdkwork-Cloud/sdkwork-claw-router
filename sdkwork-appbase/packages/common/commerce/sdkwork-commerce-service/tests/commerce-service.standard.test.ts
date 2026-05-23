import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it, vi } from "vitest";

import {
  SDKWORK_COMMERCE_APP_SDK_REQUIRED_METHODS,
  SDKWORK_COMMERCE_BACKEND_SDK_REQUIRED_METHODS,
} from "@sdkwork/commerce-sdk-ports";

import {
  configureSdkworkCommerceSessionTokenProvider,
  createSdkworkCommerceService,
  formatSdkworkCommerceCurrencyCny,
  formatSdkworkCommercePoints,
  formatSdkworkCommercePointsDelta,
  formatSdkworkCommercePointsRate,
  getSdkworkCommerceSessionTokens,
  hasSdkworkCommerceSession,
  requireSdkworkCommerceSession,
  toNullableSdkworkCommerceNumber,
  toSdkworkCommerceMutationStatus,
  toSdkworkCommerceNumber,
  toSdkworkCommerceOptionalString,
  unwrapSdkworkCommerceResponse,
  type CommerceAppSdkClient,
  type CommerceBackendSdkClient,
} from "../src/index";

describe("SDKWork commerce service", () => {
  it("exposes appbase app services over generated SDK commerce clients", async () => {
    const appClient = createMockClient<CommerceAppSdkClient>(SDKWORK_COMMERCE_APP_SDK_REQUIRED_METHODS, {
      "commerce.accounts.current.summary.retrieve": { accountId: "acct-1" },
      "commerce.cart.current.retrieve": { cartId: "cart-1" },
      "commerce.cart.items.create": { cartItemId: "item-1" },
      "commerce.addresses.defaultSelection.create": { addressId: "addr-1", selected: true },
      "commerce.checkout.sessions.orders.create": { orderNo: "order-1" },
      "commerce.payments.intents.attempts.create": { attemptId: "attempt-1" },
      "commerce.wallet.accounts.points.retrieve": { balance: "5200" },
      "commerce.memberships.purchases.create": { orderId: "membership-order-1" },
      "commerce.memberships.current.retrieve": { membershipId: "membership-1" },
      "commerce.memberships.packages.list": [{ packageId: "package-1" }],
      "commerce.recharges.orders.create": { orderNo: "recharge-order-1" },
      "commerce.wallet.ledgerEntries.retrieve": { entryId: "ledger-1" },
      "commerce.coupons.redemptions.create": { redemptionId: "redemption-1" },
      "commerce.coupons.templates.list": [{ templateId: "coupon-template-1" }],
      "commerce.invoices.create": { invoiceId: "invoice-1" },
    });
    const service = createSdkworkCommerceService({ appClient });

    await expect(service.accounts.current.summary.retrieve()).resolves.toEqual({ accountId: "acct-1" });
    await expect(service.cart.current.retrieve()).resolves.toEqual({ cartId: "cart-1" });
    await expect(service.cart.items.create({ skuId: "sku-1", quantity: 1 })).resolves.toEqual({
      cartItemId: "item-1",
    });
    await expect(service.addresses.defaultSelection.create({ addressId: "addr-1" })).resolves.toEqual({
      addressId: "addr-1",
      selected: true,
    });
    await expect(service.checkout.sessions.orders.create("session-1", {})).resolves.toEqual({ orderNo: "order-1" });
    await expect(service.payments.intents.attempts.create("intent-1", {})).resolves.toEqual({
      attemptId: "attempt-1",
    });
    await expect(service.account.points.retrieve()).resolves.toEqual({ balance: "5200" });
    await expect(service.vip.info.retrieve()).resolves.toEqual({ membershipId: "membership-1" });
    await expect(service.vip.packages.list()).resolves.toEqual([{ packageId: "package-1" }]);
    await expect(service.memberships.purchases.create({ packageId: "package-1" })).resolves.toEqual({
      orderId: "membership-order-1",
    });
    await expect(service.recharges.orders.create({ packageId: "points-100" })).resolves.toEqual({
      orderNo: "recharge-order-1",
    });
    await expect(service.wallet.ledgerEntries.retrieve("ledger-1")).resolves.toEqual({ entryId: "ledger-1" });
    await expect(service.coupons.redemptions.create({ couponCode: "WELCOME" })).resolves.toEqual({
      redemptionId: "redemption-1",
    });
    await expect(service.coupons.catalog.list()).resolves.toEqual([{ templateId: "coupon-template-1" }]);
    await expect(service.invoices.create({ orderNo: "order-1" })).resolves.toEqual({ invoiceId: "invoice-1" });

    expect(appClient.commerce.cart.items.create).toHaveBeenCalledWith({ skuId: "sku-1", quantity: 1 });
    expect(appClient.commerce.checkout.sessions.orders.create).toHaveBeenCalledWith("session-1", {});
    expect(appClient.commerce.coupons.redemptions.create).toHaveBeenCalledWith({ couponCode: "WELCOME" });
    expect(appClient.commerce.coupons.templates.list).toHaveBeenCalledWith();
    expect(appClient.commerce.memberships.current.retrieve).toHaveBeenCalledWith();
    expect(appClient.commerce.memberships.packages.list).toHaveBeenCalledWith();
    expect(appClient.commerce.memberships.purchases.create).toHaveBeenCalledWith({ packageId: "package-1" });
    expect(appClient.commerce.wallet.accounts.points.retrieve).toHaveBeenCalledWith();
  });

  it("exposes appbase admin services over generated backend commerce clients", async () => {
    const backendClient = createMockClient<CommerceBackendSdkClient>(SDKWORK_COMMERCE_BACKEND_SDK_REQUIRED_METHODS, {
      "commerce.catalog.products.create": { productId: "spu-1" },
      "commerce.inventory.stocks.update": { skuId: "sku-1", availableQuantity: 10 },
      "commerce.payments.providerAccounts.create": { providerAccountId: "wechat-main" },
      "commerce.payments.reconciliationRuns.list": [{ runNo: "recon-1" }],
      "commerce.refunds.retrieve": { refundNo: "refund-1" },
      "commerce.shipments.trackingEvents.list": [{ shipmentNo: "shipment-1" }],
      "commerce.memberships.plans.list": [{ levelId: "vip-level-1" }],
      "commerce.wallet.adjustments.create": { adjustmentNo: "wallet-adjust-1" },
      "commerce.commerceReports.paymentReconciliation.retrieve": { diffAmount: "0.00" },
      "commerce.audit.commerceEvents.list": [{ eventId: "event-1" }],
    });
    const service = createSdkworkCommerceService({
      appClient: createMockClient<CommerceAppSdkClient>(SDKWORK_COMMERCE_APP_SDK_REQUIRED_METHODS),
      backendClient,
    });

    await expect(service.admin.catalog.products.create({ title: "Standard product" })).resolves.toEqual({
      productId: "spu-1",
    });
    await expect(service.admin.inventory.stocks.update("sku-1", { availableQuantity: 10 })).resolves.toEqual({
      skuId: "sku-1",
      availableQuantity: 10,
    });
    await expect(service.admin.payments.providerAccounts.create({ providerCode: "wechat_pay" })).resolves.toEqual({
      providerAccountId: "wechat-main",
    });
    await expect(service.admin.payments.reconciliationRuns.list({ providerCode: "stripe" })).resolves.toEqual([
      { runNo: "recon-1" },
    ]);
    await expect(service.admin.refunds.retrieve("refund-1")).resolves.toEqual({ refundNo: "refund-1" });
    await expect(service.admin.shipments.trackingEvents.list({ shipmentNo: "shipment-1" })).resolves.toEqual([
      { shipmentNo: "shipment-1" },
    ]);
    await expect(service.admin.vip.levels.list({ status: "active" })).resolves.toEqual([
      { levelId: "vip-level-1" },
    ]);
    await expect(service.admin.wallet.adjustments.create({ amount: "10.00" })).resolves.toEqual({
      adjustmentNo: "wallet-adjust-1",
    });
    await expect(service.admin.commerceReports.paymentReconciliation.retrieve({ period: "2026-05" })).resolves.toEqual({
      diffAmount: "0.00",
    });
    await expect(service.admin.audit.commerceEvents.list({ aggregateId: "order-1" })).resolves.toEqual([
      { eventId: "event-1" },
    ]);

    expect(backendClient.commerce.catalog.products.create).toHaveBeenCalledWith({ title: "Standard product" });
    expect(backendClient.commerce.payments.providerAccounts.create).toHaveBeenCalledWith({
      providerCode: "wechat_pay",
    });
    expect(backendClient.commerce.memberships.plans.list).toHaveBeenCalledWith({ status: "active" });
    expect(backendClient.commerce.commerceReports.paymentReconciliation.retrieve).toHaveBeenCalledWith({
      period: "2026-05",
    });
  });

  it("keeps the service source centered on commerce-root SDK input and appbase output", () => {
    const source = readFileSync(
      resolve(process.cwd(), "packages/common/commerce/sdkwork-commerce-service/src/index.ts"),
      "utf8",
    );

    for (const required of [
      "APP_COMMERCE_METHOD_TREE",
      "BACKEND_COMMERCE_METHOD_TREE",
      "input.appClient.commerce",
      "input.backendClient?.commerce",
      "APP_FACADE_METHOD_ALIASES",
      "BACKEND_FACADE_METHOD_ALIASES",
    ]) {
      expect(source).toContain(required);
    }

    for (const retired of [
      "input.appClient.billing",
      "input.backendClient?.billing",
      "CommerceBilling",
    ]) {
      expect(source).not.toContain(retired);
    }

    expect(source).not.toMatch(/\bas unknown as\b/);
  });

  it("unwraps standard response envelopes and rejects non-success envelopes", async () => {
    const appClient = createMockClient<CommerceAppSdkClient>(SDKWORK_COMMERCE_APP_SDK_REQUIRED_METHODS, {
      "commerce.cart.current.retrieve": { cartId: "cart-1" },
      "commerce.coupons.redemptions.create": { code: 500, msg: "coupon rejected" },
    });
    const service = createSdkworkCommerceService({ appClient });

    await expect(service.cart.current.retrieve()).resolves.toEqual({ cartId: "cart-1" });
    await expect(service.coupons.redemptions.create({ code: "WELCOME" })).rejects.toThrow("coupon rejected");
  });

  it("exposes one standard response envelope runtime for commerce feature services", () => {
    expect(unwrapSdkworkCommerceResponse({ code: 0, data: { orderId: "order-1" } }, "order failed")).toEqual({
      orderId: "order-1",
    });
    expect(unwrapSdkworkCommerceResponse({ code: "2000", data: ["coupon-1"] }, "coupon failed")).toEqual([
      "coupon-1",
    ]);
    expect(unwrapSdkworkCommerceResponse({ amount: "10.00" }, "payment failed")).toEqual({ amount: "10.00" });
    expect(() => unwrapSdkworkCommerceResponse({ code: 500, msg: "payment rejected" }, "payment failed")).toThrow(
      "payment rejected",
    );
  });

  it("exposes shared scalar normalizers and display formatters", () => {
    expect(toSdkworkCommerceOptionalString(" user-1 ")).toBe("user-1");
    expect(toSdkworkCommerceOptionalString(123)).toBe("123");
    expect(toSdkworkCommerceOptionalString("   ")).toBeUndefined();
    expect(toNullableSdkworkCommerceNumber("10.50")).toBe(10.5);
    expect(toNullableSdkworkCommerceNumber("not-a-number")).toBeNull();
    expect(toSdkworkCommerceNumber("not-a-number", 7)).toBe(7);
    expect(toSdkworkCommerceMutationStatus("PAID")).toBe("completed");
    expect(toSdkworkCommerceMutationStatus("FAILED")).toBe("failed");
    expect(toSdkworkCommerceMutationStatus(undefined)).toBe("pending");
    expect(formatSdkworkCommercePoints(5200)).toBe("5,200");
    expect(formatSdkworkCommerceCurrencyCny(199)).toContain("199");
    expect(formatSdkworkCommerceCurrencyCny(null)).toBe("--");
    expect(formatSdkworkCommercePointsRate(200, "en-US")).toBe("200 pts / CNY 1");
    expect(formatSdkworkCommercePointsDelta(1200)).toBe("+1,200");
  });

  it("owns commerce session token access without PC core session adapters", () => {
    configureSdkworkCommerceSessionTokenProvider(() => ({
      accessToken: " access-1 ",
      authToken: " auth-1 ",
      refreshToken: " refresh-1 ",
    }));

    expect(getSdkworkCommerceSessionTokens()).toEqual({
      accessToken: "access-1",
      authToken: "auth-1",
      refreshToken: "refresh-1",
    });
    expect(hasSdkworkCommerceSession()).toBe(true);
    expect(() => requireSdkworkCommerceSession("commerce auth required")).not.toThrow();

    configureSdkworkCommerceSessionTokenProvider(null);
    expect(getSdkworkCommerceSessionTokens()).toEqual({});
    expect(hasSdkworkCommerceSession()).toBe(false);
    expect(() => requireSdkworkCommerceSession("commerce auth required")).toThrow("commerce auth required");
  });

  it("fails fast when a generated commerce SDK method is missing", async () => {
    const appClient = createMockClient<CommerceAppSdkClient>(SDKWORK_COMMERCE_APP_SDK_REQUIRED_METHODS);
    delete (appClient.commerce.coupons.redemptions as { create?: unknown }).create;
    const service = createSdkworkCommerceService({
      appClient,
    });

    await expect(service.coupons.redemptions.create({ code: "WELCOME" })).rejects.toThrow(
      /commerce\.coupons\.redemptions\.create/,
    );
  });
});

type MockNode = ReturnType<typeof vi.fn> | { [key: string]: MockNode };

function createMockClient<TClient>(methods: readonly string[], responses: Record<string, unknown> = {}): TClient {
  const root: { [key: string]: MockNode } = {};
  for (const method of methods) {
    let node = root;
    const segments = method.split(".");
    for (const segment of segments.slice(0, -1)) {
      let child = node[segment];
      if (!child || typeof child === "function") {
        child = {};
        node[segment] = child;
      }
      node = child as { [key: string]: MockNode };
    }
    const payload = responses[method] ?? { method };
    node[segments.at(-1)!] =
      payload && typeof payload === "object" && "code" in payload
        ? vi.fn().mockResolvedValue(payload)
        : vi.fn().mockResolvedValue({ data: payload });
  }
  return root as TClient;
}
