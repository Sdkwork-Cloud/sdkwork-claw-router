import assert from "node:assert/strict";
import test from "node:test";

import { clearStoredAppSessionToken } from "./packages/sdkwork-claw-router-commons/src/app-session-token.ts";
import { resetClawRouterSdkClients } from "./packages/sdkwork-claw-router-commons/src/sdk-clients.ts";
import { BillingService } from "./packages/sdkwork-claw-router-console-billing/src/billingService.ts";
import { CheckoutService } from "./packages/sdkwork-claw-router-console-billing/src/checkoutService.ts";
import { CommerceFoundationService } from "./packages/sdkwork-claw-router-console-billing/src/commerceFoundationService.ts";

const originalFetch = globalThis.fetch;
const originalWindowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");

type CapturedSdkRequest = {
  url: string;
  method: string;
  body: string;
};

async function withBillingSdkResponse<T>(
  responseBody: unknown,
  fn: (captured: CapturedSdkRequest[]) => Promise<T>,
): Promise<T> {
  const captured: CapturedSdkRequest[] = [];
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    enumerable: true,
    value: {},
  });
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    captured.push({
      url,
      method: init?.method ?? "GET",
      body: typeof init?.body === "string" ? init.body : "",
    });
    return new Response(JSON.stringify(responseBody), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }) as typeof fetch;
  clearStoredAppSessionToken();
  resetClawRouterSdkClients();

  try {
    return await fn(captured);
  } finally {
    clearStoredAppSessionToken();
    resetClawRouterSdkClients();
    globalThis.fetch = originalFetch;
    if (originalWindowDescriptor) {
      Object.defineProperty(globalThis, "window", originalWindowDescriptor);
    } else {
      delete (globalThis as { window?: Window }).window;
    }
  }
}

test("billing redeem code uses the generated app SDK path and returns confirmed success data", async () => {
  await withBillingSdkResponse(
    { code: "2000", msg: "Redeemed", data: { amount: "12.5" } },
    async (captured) => {
      const result = await BillingService.redeemCode(" GIFT-2026 ");

      assert.deepEqual(result, {
        success: true,
        message: "Redeemed successfully",
        amount: "12.50",
      });
      assert.equal(captured.length, 1);
      assert.equal(captured[0].url, "/app/v3/api/billing/coupons/redeem");
      assert.equal(captured[0].method, "POST");
      assert.match(captured[0].body, /GIFT-2026/);
    },
  );
});

test("billing redeem code reports API business failures without throwing away the message", async () => {
  await withBillingSdkResponse(
    { code: "4001", msg: "Invalid redeem code", data: null },
    async () => {
      const result = await BillingService.redeemCode("BAD-CODE");

      assert.deepEqual(result, {
        success: false,
        message: "Invalid redeem code",
      });
    },
  );
});

test("billing redeem code rejects blank codes before calling generated app SDK", async () => {
  await withBillingSdkResponse(
    { code: "2000", msg: "unexpected", data: { amount: "99.99" } },
    async (captured) => {
      const result = await BillingService.redeemCode("   ");

      assert.equal(result.success, false);
      assert.match(result.message, /code is required/);
      assert.equal(captured.length, 0);
    },
  );
});

test("billing redeem code does not invent an amount when app SDK omits optional redeem amount", async () => {
  await withBillingSdkResponse(
    { code: "2000", msg: "Redeemed", data: { message: "Redeemed successfully" } },
    async () => {
      const result = await BillingService.redeemCode("GIFT-2026");

      assert.deepEqual(result, {
        success: true,
        message: "Redeemed successfully",
      });
    },
  );
});

test("billing redeem code fails closed when app SDK returns invalid optional redeem amounts", async () => {
  await withBillingSdkResponse(
    { code: "2000", msg: "Redeemed", data: { amount: "free" } },
    async () => {
      const result = await BillingService.redeemCode("GIFT-2026");

      assert.deepEqual(result, {
        success: false,
        message: "Redeem amount must be a money string",
      });
    },
  );
});

test("billing redeem code fails closed for non-API responses instead of returning fake success", async () => {
  await withBillingSdkResponse(
    { html: "<!doctype html>", data: { amount: "99.99" } },
    async () => {
      const result = await BillingService.redeemCode("SPA-FALLBACK");

      assert.equal(result.success, false);
      assert.match(result.message, /Failed to redeem code|Unknown error/);
      assert.equal("amount" in result, false);
    },
  );
});

test("billing redeem history fails closed when app SDK omits stable history ids", async () => {
  await withBillingSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            code: "GIFT-2026",
            amount: "12.50",
            date: "2026-05-05",
            status: "success",
          },
        ],
      },
    },
    async () => {
      await assert.rejects(
        () => BillingService.fetchRedeemHistory(),
        /Redeem history id is required/,
      );
    },
  );
});

test("billing redeem history fails closed when app SDK returns malformed history rows", async () => {
  await withBillingSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            id: 1,
            code: "GIFT-2026",
            amount: "12.50",
            date: "2026-05-05",
            status: "success",
          },
          "malformed-row",
        ],
      },
    },
    async () => {
      await assert.rejects(
        () => BillingService.fetchRedeemHistory(),
        /Redeem history record is required/,
      );
    },
  );
});

test("billing redeem history fails closed when app SDK omits redeem codes", async () => {
  await withBillingSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            id: 1,
            amount: "12.50",
            date: "2026-05-05",
            status: "success",
          },
        ],
      },
    },
    async () => {
      await assert.rejects(
        () => BillingService.fetchRedeemHistory(),
        /Redeem history code is required/,
      );
    },
  );
});

test("billing recharge history fails closed when app SDK omits stable history ids", async () => {
  await withBillingSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            orderNo: "order-1",
            method: "wechat",
            amount: "99.90",
            date: "2026-05-05",
            status: "success",
          },
        ],
      },
    },
    async () => {
      await assert.rejects(
        () => BillingService.fetchRechargeHistory(),
        /Recharge history id is required/,
      );
    },
  );
});

test("billing recharge history fails closed when app SDK omits order numbers", async () => {
  await withBillingSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            id: 1,
            method: "wechat",
            amount: "99.90",
            date: "2026-05-05",
            status: "success",
          },
        ],
      },
    },
    async () => {
      await assert.rejects(
        () => BillingService.fetchRechargeHistory(),
        /Recharge history order number is required/,
      );
    },
  );
});

test("billing redeem history fails closed when app SDK omits money amounts", async () => {
  await withBillingSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            id: 1,
            code: "GIFT-2026",
            date: "2026-05-05",
            status: "success",
          },
        ],
      },
    },
    async () => {
      await assert.rejects(
        () => BillingService.fetchRedeemHistory(),
        /Redeem history amount is required/,
      );
    },
  );
});

test("billing redeem history fails closed when app SDK returns invalid money amounts", async () => {
  await withBillingSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            id: 1,
            code: "GIFT-2026",
            amount: "free",
            date: "2026-05-05",
            status: "success",
          },
        ],
      },
    },
    async () => {
      await assert.rejects(
        () => BillingService.fetchRedeemHistory(),
        /Redeem history amount must be a money string/,
      );
    },
  );
});

test("billing redeem history fails closed when app SDK omits dates", async () => {
  await withBillingSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            id: 1,
            code: "GIFT-2026",
            amount: "12.50",
            status: "success",
          },
        ],
      },
    },
    async () => {
      await assert.rejects(
        () => BillingService.fetchRedeemHistory(),
        /Redeem history date is required/,
      );
    },
  );
});

test("billing redeem history fails closed when app SDK returns unsupported statuses", async () => {
  await withBillingSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            id: 1,
            code: "GIFT-2026",
            amount: "12.50",
            date: "2026-05-05",
            status: "cancelled",
          },
        ],
      },
    },
    async () => {
      await assert.rejects(
        () => BillingService.fetchRedeemHistory(),
        /Unsupported billing status: cancelled/,
      );
    },
  );
});

test("billing recharge history fails closed when app SDK omits payment methods", async () => {
  await withBillingSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            id: 1,
            orderNo: "order-1",
            amount: "99.90",
            date: "2026-05-05",
            status: "success",
          },
        ],
      },
    },
    async () => {
      await assert.rejects(
        () => BillingService.fetchRechargeHistory(),
        /Recharge history payment method is required/,
      );
    },
  );
});

test("billing recharge history fails closed when app SDK returns invalid money amounts", async () => {
  await withBillingSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            id: 1,
            orderNo: "order-1",
            method: "wechat",
            amount: "ten",
            date: "2026-05-05",
            status: "success",
          },
        ],
      },
    },
    async () => {
      await assert.rejects(
        () => BillingService.fetchRechargeHistory(),
        /Recharge history amount must be a money string/,
      );
    },
  );
});

test("checkout status uses the generated app SDK path and returns confirmed status data", async () => {
  await withBillingSdkResponse(
    {
      code: "2000",
      data: checkoutStatusResponse(),
    },
    async (captured) => {
      const result = await CheckoutService.fetchCheckoutStatus("ORDER-20260505");

      assert.deepEqual(result, checkoutStatusResponse());
      assert.equal(captured.length, 1);
      assert.equal(captured[0].url, "/app/v3/api/billing/payments/checkout/ORDER-20260505");
      assert.equal(captured[0].method, "GET");
    },
  );
});

test("checkout status rejects unsafe order numbers before calling generated app SDK", async () => {
  await withBillingSdkResponse(
    { code: "2000", data: checkoutStatusResponse() },
    async (captured) => {
      await assert.rejects(
        () => CheckoutService.fetchCheckoutStatus("bad/order"),
        /orderNo must be a safe path segment/,
      );
      assert.equal(captured.length, 0);
    },
  );
});

test("checkout status fails closed when app SDK omits order numbers", async () => {
  await withBillingSdkResponse(
    { code: "2000", data: checkoutStatusResponse({ orderNo: undefined }) },
    async () => {
      await assert.rejects(
        () => CheckoutService.fetchCheckoutStatus("ORDER-20260505"),
        /Checkout order number is required/,
      );
    },
  );
});

test("checkout status fails closed when app SDK omits amounts", async () => {
  await withBillingSdkResponse(
    { code: "2000", data: checkoutStatusResponse({ amount: undefined }) },
    async () => {
      await assert.rejects(
        () => CheckoutService.fetchCheckoutStatus("ORDER-20260505"),
        /Checkout amount is required/,
      );
    },
  );
});

test("checkout status fails closed when app SDK returns invalid amounts", async () => {
  await withBillingSdkResponse(
    { code: "2000", data: checkoutStatusResponse({ amount: "free" }) },
    async () => {
      await assert.rejects(
        () => CheckoutService.fetchCheckoutStatus("ORDER-20260505"),
        /Checkout amount must be a money string/,
      );
    },
  );
});

test("checkout status fails closed when app SDK returns malformed optional string fields", async () => {
  await withBillingSdkResponse(
    { code: "2000", data: checkoutStatusResponse({ outTradeNo: { value: "OUT-1" } }) },
    async () => {
      await assert.rejects(
        () => CheckoutService.fetchCheckoutStatus("ORDER-20260505"),
        /Checkout outer trade number is required/,
      );
    },
  );
});

test("checkout status fails closed when app SDK omits credited points", async () => {
  await withBillingSdkResponse(
    { code: "2000", data: checkoutStatusResponse({ points: undefined }) },
    async () => {
      await assert.rejects(
        () => CheckoutService.fetchCheckoutStatus("ORDER-20260505"),
        /Checkout points are required/,
      );
    },
  );
});

test("checkout status fails closed when app SDK returns unsupported payment statuses", async () => {
  await withBillingSdkResponse(
    { code: "2000", data: checkoutStatusResponse({ paymentStatus: "unknown" }) },
    async () => {
      await assert.rejects(
        () => CheckoutService.fetchCheckoutStatus("ORDER-20260505"),
        /Unsupported checkout payment status: unknown/,
      );
    },
  );
});

test("commerce foundation service calls generated app SDK account points paths", async () => {
  await withBillingSdkResponse(
    { code: "2000", data: { availablePoints: 125, frozenPoints: 0 } },
    async (captured) => {
      const result = await CommerceFoundationService.retrieveAccountPoints();

      assert.deepEqual(result, { availablePoints: 125, frozenPoints: 0 });
      assert.equal(captured.length, 1);
      assert.equal(captured[0].url, "/app/v3/api/billing/account/points");
      assert.equal(captured[0].method, "GET");
    },
  );
});

test("commerce foundation service uses generated SDK types instead of loose record wrappers", async () => {
  const source = await import("node:fs/promises").then((fs) =>
    fs.readFile(
      new URL("./packages/sdkwork-claw-router-console-billing/src/commerceFoundationService.ts", import.meta.url),
      "utf8",
    ),
  );

  assert.match(source, /CommerceWalletCommandRequest/);
  assert.doesNotMatch(source, /type\s+Params\s*=\s*Record<string,\s*unknown>/);
  assert.doesNotMatch(source, /type\s+Body\s*=\s*Record<string,\s*unknown>/);
});

function checkoutStatusResponse(overrides: Partial<Record<string, unknown>> = {}): Record<string, unknown> {
  const response: Record<string, unknown> = {
    orderNo: "ORDER-20260505",
    outTradeNo: "",
    amount: "99.90",
    points: 999,
    paymentMethod: "wechat",
    orderStatus: "pending",
    paymentStatus: "pending",
    rechargeStatus: "pending",
    status: "pending",
    createdAt: "2026-05-05T10:00:00Z",
    expiresAt: "2026-05-05T10:15:00Z",
    paidAt: "",
    nextAction: "scan_qr",
    qrCodePayload: "weixin://wxpay/bizpayurl?pr=ORDER-20260505",
  };
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) {
      delete response[key];
    } else {
      response[key] = value;
    }
  }
  return response;
}
