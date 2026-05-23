import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { clearStoredAppSessionToken } from "./packages/sdkwork-claw-router-commons/src/app-session-token.ts";
import { resetClawRouterSdkClients } from "./packages/sdkwork-claw-router-commons/src/sdk-clients.ts";
import { CheckoutService } from "./packages/sdkwork-claw-router-console-checkout/src/checkoutService.ts";
import { RechargeService } from "./packages/sdkwork-claw-router-console-recharge/src/rechargeService.ts";
import { WalletService } from "./packages/sdkwork-claw-router-console-wallet/src/walletService.ts";

type CapturedSdkRequest = {
  body: string;
  method: string;
  url: string;
};

const originalFetch = globalThis.fetch;
const originalWindowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");

function readPortalFile(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

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
      body: typeof init?.body === "string" ? init.body : "",
      method: init?.method ?? "GET",
      url,
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

test("billing capability is split into wallet, recharge, and checkout business packages", () => {
  const appSource = readPortalFile("./src/App.tsx");
  const packageJson = readPortalFile("./package.json");
  const routeClassification = readPortalFile("../../docs/schema-registry/frontend-route-classification.yaml");

  for (const packageName of [
    "sdkwork-claw-router-console-wallet",
    "sdkwork-claw-router-console-recharge",
    "sdkwork-claw-router-console-checkout",
    "sdkwork-claw-router-console-memberships",
  ]) {
    assert.match(packageJson, new RegExp(`"${packageName}": "workspace:\\*"`));
    assert.match(appSource, new RegExp(`import\\('${packageName}'\\)`));
  }

  for (const route of ["/console/wallet", "/console/recharge", "/console/checkout", "/console/memberships"]) {
    assert.match(appSource, new RegExp(escapeRegExp(route)));
    assert.match(routeClassification, new RegExp(`route: ${escapeRegExp(route)}`));
  }

  for (const retiredToken of [
    "sdkwork-claw-router-console-commerce",
    "/console/billing",
    "/console/commerce",
    "/app/v3/api/billing",
  ]) {
    assert.doesNotMatch(appSource, new RegExp(escapeRegExp(retiredToken)));
    assert.doesNotMatch(packageJson, new RegExp(escapeRegExp(retiredToken)));
    assert.doesNotMatch(routeClassification, new RegExp(escapeRegExp(retiredToken)));
  }
});

test("wallet redeem code uses the generated app SDK coupon redemption path", async () => {
  await withBillingSdkResponse(
    { code: "2000", msg: "Redeemed", data: { amount: "12.5", message: "Redeemed" } },
    async (captured) => {
      const result = await WalletService.redeemCode(" GIFT-2026 ");

      assert.deepEqual(result, {
        amount: "12.50",
        message: "Redeemed",
        success: true,
      });
      assert.equal(captured.length, 1);
      assert.equal(requestPath(captured[0]?.url), "/app/v3/api/coupons/redemptions");
      assert.equal(captured[0]?.method, "POST");
      assert.match(captured[0]?.body ?? "", /coupon-redemption/);
      assert.match(captured[0]?.body ?? "", /console-wallet/);
      assert.match(captured[0]?.body ?? "", /GIFT-2026/);
    },
  );
});

test("wallet redeem code rejects blank codes before calling generated app SDK", async () => {
  await withBillingSdkResponse(
    { code: "2000", data: { amount: "99.99" } },
    async (captured) => {
      const result = await WalletService.redeemCode("   ");

      assert.equal(result.success, false);
      assert.match(result.message, /code is required/);
      assert.equal(captured.length, 0);
    },
  );
});

test("wallet redeem code does not invent an amount when app SDK omits optional amount", async () => {
  await withBillingSdkResponse(
    { code: "2000", data: { message: "Redeemed successfully" } },
    async () => {
      const result = await WalletService.redeemCode("GIFT-2026");

      assert.deepEqual(result, {
        message: "Redeemed successfully",
        success: true,
      });
    },
  );
});

test("wallet redeem code fails closed when app SDK returns invalid optional amount", async () => {
  await withBillingSdkResponse(
    { code: "2000", data: { amount: "free" } },
    async () => {
      const result = await WalletService.redeemCode("GIFT-2026");

      assert.deepEqual(result, {
        message: "Redeem amount must be a money string",
        success: false,
      });
    },
  );
});

test("wallet recharge history uses the generated app SDK wallet ledger path", async () => {
  await withBillingSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            id: "ledger-1",
            orderNo: "recharge-order-1",
            method: "wechat",
            amount: "99.9",
            date: "2026-05-21T00:00:00Z",
            status: "posted",
          },
        ],
      },
    },
    async (captured) => {
      const history = await WalletService.fetchRechargeHistory();

      assert.deepEqual(history, [
        {
          amount: "99.90",
          date: "2026-05-21T00:00:00Z",
          id: "ledger-1",
          method: "wechat",
          orderNo: "recharge-order-1",
          status: "success",
        },
      ]);
      assert.equal(requestPath(captured[0]?.url), "/app/v3/api/wallet/ledger_entries");
      assert.equal(captured[0]?.method, "GET");
      assert.match(captured[0]?.url ?? "", /page=1/);
      assert.match(captured[0]?.url ?? "", /page_size=100/);
      assert.match(captured[0]?.url ?? "", /status=posted/);
    },
  );
});

test("wallet recharge history fails closed when ledger rows omit stable ids", async () => {
  await withBillingSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            orderNo: "recharge-order-1",
            method: "wechat",
            amount: "99.90",
            date: "2026-05-21T00:00:00Z",
            status: "posted",
          },
        ],
      },
    },
    async () => {
      await assert.rejects(
        () => WalletService.fetchRechargeHistory(),
        /Recharge history id is required/,
      );
    },
  );
});

test("recharge package list and order creation use standard recharge paths", async () => {
  await withBillingSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            id: "pkg-100",
            priceAmount: "100",
            points: 1000,
            bonus: 100,
          },
        ],
      },
    },
    async (captured) => {
      const packages = await RechargeService.fetchPackages();

      assert.deepEqual(packages, [{ bonus: 100, id: "pkg-100", points: 1000, rmb: "100.00" }]);
      assert.equal(requestPath(captured[0]?.url), "/app/v3/api/recharges/packages");
      assert.equal(captured[0]?.method, "GET");
    },
  );

  await withBillingSdkResponse(
    { code: "2000", data: { orderNo: "recharge-order-1", success: true } },
    async (captured) => {
      const result = await RechargeService.submitRecharge("99.90", "wechat", "pkg-100");

      assert.deepEqual(result, { orderNo: "recharge-order-1", success: true });
      assert.equal(requestPath(captured[0]?.url), "/app/v3/api/recharges/orders");
      assert.equal(captured[0]?.method, "POST");
      assert.match(captured[0]?.body ?? "", /console-recharge/);
      assert.match(captured[0]?.body ?? "", /wechat/);
      assert.match(captured[0]?.body ?? "", /pkg-100/);
    },
  );
});

test("console recharge page matches the product recharge reference layout", () => {
  const rechargeViewSource = readPortalFile(
    "./packages/sdkwork-claw-router-console-recharge/src/RechargeView.tsx",
  );

  assert.match(rechargeViewSource, /data-console-recharge-reference-panel/);
  assert.match(rechargeViewSource, /console\.recharge\.tabs\.redeem/);
  assert.match(rechargeViewSource, /console\.recharge\.tabs\.online/);
  assert.match(rechargeViewSource, /选择充值金额 \(USD\)/);
  assert.match(rechargeViewSource, /自定义金额/);
  assert.match(rechargeViewSource, /获得积分:/);
  assert.match(rechargeViewSource, /实际支付金额:/);
  assert.match(rechargeViewSource, /去支付/);

  for (const amount of ["10", "50", "100", "200", "500", "1000", "2000", "5000"]) {
    assert.match(rechargeViewSource, new RegExp(`amount: '${amount}\\.00'`));
  }

  for (const retiredLayoutToken of [
    "AccountService",
    "PaymentMethodRadio",
    "当前可用虚拟余额",
    "支付方式",
    "充值确认",
    "ShieldCheck",
  ]) {
    assert.doesNotMatch(rechargeViewSource, new RegExp(escapeRegExp(retiredLayoutToken)));
  }
});

test("recharge order creation validates amount and method before calling app SDK", async () => {
  await withBillingSdkResponse(
    { code: "2000", data: { orderNo: "unexpected", success: true } },
    async (captured) => {
      await assert.rejects(
        () => RechargeService.submitRecharge("0", "wechat", "pkg-100"),
        /amount must be greater than zero/,
      );
      await assert.rejects(
        () => RechargeService.submitRecharge("99.90", "   ", "pkg-100"),
        /method is required/,
      );
      assert.equal(captured.length, 0);
    },
  );
});

test("checkout status uses the generated app SDK recharge order path", async () => {
  await withBillingSdkResponse(
    { code: "2000", data: checkoutStatusResponse() },
    async (captured) => {
      const result = await CheckoutService.fetchCheckoutStatus("recharge-order-1");

      assert.deepEqual(result, checkoutStatusResponse());
      assert.equal(requestPath(captured[0]?.url), "/app/v3/api/recharges/orders/recharge-order-1");
      assert.equal(captured[0]?.method, "GET");
    },
  );
});

test("checkout status fails closed for malformed recharge order records", async () => {
  await withBillingSdkResponse(
    { code: "2000", data: { ...checkoutStatusResponse(), amount: "free" } },
    async () => {
      await assert.rejects(
        () => CheckoutService.fetchCheckoutStatus("recharge-order-1"),
        /Checkout amount must be a money string/,
      );
    },
  );
});

function checkoutStatusResponse(): Record<string, unknown> {
  return {
    amount: "99.90",
    createdAt: "2026-05-21T00:00:00Z",
    expiresAt: "2026-05-21T00:15:00Z",
    nextAction: "scan_qr",
    orderNo: "recharge-order-1",
    orderStatus: "pending",
    outTradeNo: "provider-order-1",
    paidAt: "",
    paymentMethod: "wechat",
    paymentStatus: "pending",
    points: 999,
    qrCodePayload: "weixin://wxpay/bizpayurl?pr=recharge-order-1",
    rechargeStatus: "pending",
    status: "pending",
  };
}

function requestPath(url: string | undefined): string {
  assert.ok(url, "captured request URL is required");
  return url.split("?", 1)[0] ?? url;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
