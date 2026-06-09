import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { clearStoredAppSessionToken } from "./packages/sdkwork-clawrouter-pc-commons/src/app-session-token.ts";
import { resetClawRouterSdkClients } from "./packages/sdkwork-clawrouter-pc-commons/src/sdk-clients.ts";
import { CheckoutService } from "./packages/sdkwork-clawrouter-pc-console-checkout/src/checkoutService.ts";
import { RechargeService } from "./packages/sdkwork-clawrouter-pc-console-recharge/src/rechargeService.ts";
import { WalletService } from "./packages/sdkwork-clawrouter-pc-console-wallet/src/walletService.ts";

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
    "sdkwork-clawrouter-pc-console-wallet",
    "sdkwork-clawrouter-pc-console-recharge",
    "sdkwork-clawrouter-pc-console-checkout",
    "sdkwork-clawrouter-pc-console-memberships",
  ]) {
    assert.match(packageJson, new RegExp(`"${packageName}": "workspace:\\*"`));
    assert.match(appSource, new RegExp(`import\\('${packageName}'\\)`));
  }

  for (const route of ["/console/wallet", "/console/recharge", "/console/checkout", "/console/memberships"]) {
    assert.match(appSource, new RegExp(escapeRegExp(route)));
    assert.match(routeClassification, new RegExp(`route: ${escapeRegExp(route)}`));
  }

  for (const retiredToken of [
    "sdkwork-clawrouter-pc-console-commerce",
    "/console/billing",
    "/console/commerce",
    "/app/v3/api/billing",
  ]) {
    assert.doesNotMatch(appSource, new RegExp(escapeRegExp(retiredToken)));
    assert.doesNotMatch(packageJson, new RegExp(escapeRegExp(retiredToken)));
    assert.doesNotMatch(routeClassification, new RegExp(escapeRegExp(retiredToken)));
  }
});

test("wallet redeem code uses the generated app SDK promotion code redemption path", async () => {
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
      assert.equal(requestPath(captured[0]?.url), "/app/v3/api/promotions/codes/redemptions");
      assert.equal(captured[0]?.method, "POST");
      assert.match(captured[0]?.body ?? "", /promotion-code-redemption/);
      const body = JSON.parse(captured[0]?.body ?? "{}");
      assert.equal(body.code, "GIFT-2026");
      assert.equal(body.source, "console-wallet");
      assert.equal(body.metadata, undefined);
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

test("wallet recharge history uses the generated app SDK billing history path", async () => {
  await withBillingSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            id: "billing-history-1",
            historyNo: "BH-recharge-1",
            type: "recharge",
            direction: "credit",
            assetType: "points",
            title: "Recharge",
            referenceNo: "RC1",
            relatedOrderNo: "RC1",
            paymentMethod: "wechat",
            amount: "99.9",
            pointsDelta: 999,
            occurredAt: "2026-05-21T00:00:00Z",
            status: "success",
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
          id: "billing-history-1",
          method: "wechat",
          orderNo: "RC1",
          status: "success",
        },
      ]);
      assert.equal(requestPath(captured[0]?.url), "/app/v3/api/billing/history");
      assert.equal(captured[0]?.method, "GET");
      assert.match(captured[0]?.url ?? "", /page=1/);
      assert.match(captured[0]?.url ?? "", /page_size=100/);
      assert.match(captured[0]?.url ?? "", /type=recharge/);
    },
  );
});

test("wallet recharge history fails closed when billing history rows omit stable ids", async () => {
  await withBillingSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            historyNo: "BH-recharge-1",
            type: "recharge",
            paymentMethod: "wechat",
            amount: "99.90",
            occurredAt: "2026-05-21T00:00:00Z",
            status: "success",
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

test("wallet redeem history fails closed when billing history rows omit stable ids", async () => {
  await withBillingSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            historyNo: "BH-redeem-1",
            type: "redeem",
            referenceNo: "GIFT-2026",
            amount: "12.50",
            occurredAt: "2026-05-21T00:00:00Z",
            status: "redeemed",
          },
        ],
      },
    },
    async () => {
      await assert.rejects(
        () => WalletService.fetchRedeemHistory(),
        /Redeem history id is required/,
      );
    },
  );
});

test("recharge package list, recharge settings, and order creation use standard recharge paths", async () => {
  await withBillingSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            id: "pkg-100",
            priceAmount: "100",
            currencyCode: "USD",
            bonusPoints: 100,
            grantAmount: 7100,
            points: 7100,
          },
        ],
      },
    },
    async (captured) => {
      const packages = await RechargeService.fetchPackages();

      assert.deepEqual(packages, [{
        bonusPoints: 100,
        currencyCode: "USD",
        grantAmount: 7100,
        id: "pkg-100",
        points: 7100,
        priceAmount: "100.00",
      }]);
      assert.equal(requestPath(captured[0]?.url), "/app/v3/api/recharges/packages");
      assert.equal(captured[0]?.method, "GET");
    },
  );

  await withBillingSdkResponse(
    {
      code: "2000",
      data: {
        baseCurrencyCode: "CNY",
        basePointsPerCny: "10",
        currencyToCnyRates: {
          CNY: "1",
          USD: "7",
        },
      },
    },
    async (captured) => {
      const settings = await RechargeService.fetchRechargeSettings();

      assert.deepEqual(settings, {
        baseCurrencyCode: "CNY",
        basePointsPerCny: "10",
        currencyToCnyRates: {
          CNY: "1",
          USD: "7",
        },
      });
      assert.equal(requestPath(captured[0]?.url), "/app/v3/api/recharges/settings");
      assert.equal(captured[0]?.method, "GET");
    },
  );

  await withBillingSdkResponse(
    {
      code: "2000",
      data: {
        orderNo: "recharge-order-1",
        success: true,
        providerCode: "wechat_pay",
        paymentMethod: "wechat",
        paymentProduct: "wechat_native",
        nextAction: "scan_qr",
        cashierUrl: "https://im.sdkwork.com/cashier?scene=recharge&orderId=recharge-order-1&outTradeNo=provider-order-1",
        qrCodePayload: "https://im.sdkwork.com/cashier?scene=recharge&orderId=recharge-order-1&outTradeNo=provider-order-1",
      },
    },
    async (captured) => {
      const result = await RechargeService.submitRecharge("99.90", "USD", "pkg-100");

      assert.deepEqual(result, {
        cashierUrl: "https://im.sdkwork.com/cashier?scene=recharge&orderId=recharge-order-1&outTradeNo=provider-order-1",
        nextAction: "scan_qr",
        orderNo: "recharge-order-1",
        paymentMethod: "wechat",
        paymentProduct: "wechat_native",
        providerCode: "wechat_pay",
        qrCodePayload: "https://im.sdkwork.com/cashier?scene=recharge&orderId=recharge-order-1&outTradeNo=provider-order-1",
        success: true,
      });
      assert.equal(requestPath(captured[0]?.url), "/app/v3/api/recharges/orders");
      assert.equal(captured[0]?.method, "POST");
      const body = JSON.parse(captured[0]?.body ?? "{}");
      assert.equal(body.clientRequestNo.startsWith("recharge-"), true);
      assert.deepEqual(body, {
        amount: "99.90",
        clientRequestNo: body.clientRequestNo,
        currencyCode: "USD",
        packageId: "pkg-100",
        source: "console-recharge",
      });
    },
  );
});

test("recharge order service no longer exposes a frontend cancellation path for package switching", () => {
  const rechargeServiceSource = readPortalFile(
    "./packages/sdkwork-clawrouter-pc-console-recharge/src/rechargeService.ts",
  );
  const checkoutServiceSource = readPortalFile(
    "./packages/sdkwork-clawrouter-pc-console-checkout/src/checkoutService.ts",
  );

  assert.doesNotMatch(rechargeServiceSource, /appRechargesOrdersCancel/);
  assert.doesNotMatch(rechargeServiceSource, /static async cancelRechargeOrder/);
  assert.doesNotMatch(rechargeServiceSource, /commerce\.orders\.cancellations\.create/);
  assert.match(checkoutServiceSource, /appOrdersCancellationsCreate/);
  assert.match(checkoutServiceSource, /getSdkworkCommerceService\(\)\.orders\.cancellations\.create/);
});

test("console recharge page matches the product recharge reference layout", () => {
  const rechargeViewSource = readPortalFile(
    "./packages/sdkwork-clawrouter-pc-console-recharge/src/RechargeView.tsx",
  );
  const walletViewSource = readPortalFile(
    "./packages/sdkwork-clawrouter-pc-console-wallet/src/WalletView.tsx",
  );
  const rechargeServiceSource = readPortalFile(
    "./packages/sdkwork-clawrouter-pc-console-recharge/src/rechargeService.ts",
  );
  const walletServiceSource = readPortalFile(
    "./packages/sdkwork-clawrouter-pc-console-wallet/src/walletService.ts",
  );

  assert.match(rechargeViewSource, /data-console-recharge-reference-panel/);
  assert.match(rechargeViewSource, /data-console-recharge-options="server-configured"/);
  assert.match(rechargeViewSource, /export function RechargePackageSelector/);
  assert.match(rechargeViewSource, /RechargeRecordsTabs/);
  assert.match(walletViewSource, /RechargeRecordsTabs/);
  assert.doesNotMatch(walletViewSource, /RedeemHistoryTable/);
  assert.doesNotMatch(walletViewSource, /BusinessStateTableRow/);
  assert.doesNotMatch(walletViewSource, /redeemHistory/);
  assert.doesNotMatch(walletViewSource, /loadHistory/);
  assert.match(rechargeServiceSource, /appBillingHistoryList/);
  assert.match(walletServiceSource, /RechargeService\.fetchBillingHistory/);
  assert.match(walletServiceSource, /appPromotionCodeRedemptionsCreate/);
  assert.doesNotMatch(walletServiceSource, /commerce\.coupons/);
  assert.doesNotMatch(walletServiceSource, /appCoupons/);
  assert.doesNotMatch(walletServiceSource, /appWalletLedgerEntriesList\(\{ page: 1, pageSize: 100/);
  assert.doesNotMatch(walletServiceSource, /commerce\.recharges\.orders\.list/);
  assert.match(rechargeViewSource, /console\.recharge\.tabs\.redeem/);
  assert.match(rechargeViewSource, /console\.recharge\.tabs\.online/);
  assert.match(rechargeViewSource, /console\.recharge\.records\.tabs\.all/);
  assert.match(rechargeViewSource, /console\.recharge\.records\.tabs\.redeem/);
  assert.match(rechargeViewSource, /console\.recharge\.records\.tabs\.recharge/);
  assert.match(rechargeViewSource, /console\.recharge\.amountTitle/);
  assert.match(rechargeViewSource, /自定义金额/);
  assert.match(rechargeViewSource, /获得积分:/);
  assert.match(rechargeViewSource, /实际支付金额:/);
  assert.match(rechargeViewSource, /去支付/);

  assert.match(rechargeServiceSource, /RechargeService\.fetchPackages/);
  assert.match(rechargeServiceSource, /RechargeService\.fetchRechargeSettings/);
  assert.doesNotMatch(rechargeServiceSource, /metadata:\s*\{/);
  assert.match(rechargeViewSource, /fetchRechargeSettings/);
  assert.match(rechargeViewSource, /computeGrantAmount/);
  assert.match(rechargeViewSource, /formatRechargeCurrencyAmount/);
  assert.match(rechargeViewSource, /currencyToCnyRates/);
  assert.match(rechargeViewSource, /listRechargeCurrencyCodes/);
  assert.match(rechargeViewSource, /customCurrencyCodes/);
  assert.match(rechargeViewSource, /handleCustomCurrencyChange/);
  assert.match(rechargeViewSource, /console\.recharge\.currency/);
  assert.match(rechargeViewSource, /data-console-recharge-custom-entry="inline-money"/);
  assert.match(rechargeViewSource, /value=\{customCurrencyCode\}/);
  assert.match(rechargeViewSource, /disabled=\{isSubmitting\}/);
  assert.doesNotMatch(rechargeViewSource, /value=\{currentCurrencyCode\}/);
  assert.doesNotMatch(rechargeViewSource, /Boolean\(selectedOption\) \|\| isSubmitting/);
  assert.doesNotMatch(rechargeViewSource, /pointer-events-none absolute left-4/);
  assert.doesNotMatch(rechargeViewSource, /pointsForAmount\(/);
  assert.doesNotMatch(rechargeViewSource, /referenceRechargeOptions/);
  assert.doesNotMatch(rechargeViewSource, /return referenceRechargeOptions/);
  assert.doesNotMatch(rechargeViewSource, /\{option\.currencyCode\}\s+\{formatDisplayAmount\(option\.amount\)\}/);

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

test("vip points purchase uses the shared server configured recharge options", () => {
  const rechargeViewSource = readPortalFile(
    "./packages/sdkwork-clawrouter-pc-console-recharge/src/RechargeView.tsx",
  );
  const vipViewSource = readPortalFile(
    "./packages/sdkwork-clawrouter-pc-vip/src/VipView.tsx",
  );

  assert.match(rechargeViewSource, /export function RechargePackageSelector/);
  assert.match(vipViewSource, /RechargePackageSelector/);
  assert.match(vipViewSource, /data-vip-points-purchase/);
  assert.match(vipViewSource, /onCheckoutCreated/);
  assert.doesNotMatch(vipViewSource, /RechargeService\.fetchPackages/);
  assert.doesNotMatch(vipViewSource, /rechargePackages\.map/);
  assert.doesNotMatch(vipViewSource, /createPointsCheckout\(firstPackage/);
});

test("recharge order creation validates amount and currency before calling app SDK", async () => {
  await withBillingSdkResponse(
    { code: "2000", data: { orderNo: "unexpected", success: true } },
    async (captured) => {
      await assert.rejects(
        () => RechargeService.submitRecharge("0", "USD", "pkg-100"),
        /amount must be greater than zero/,
      );
      await assert.rejects(
        () => RechargeService.submitRecharge("99.90", "   ", "pkg-100"),
        /currencyCode is required/,
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

test("checkout status standardizes payment method values and keeps qrCodePayload as the only public qr field", async () => {
  await withBillingSdkResponse(
    {
      code: "2000",
      data: {
        ...checkoutStatusResponse(),
        providerCode: "wechat_pay",
        paymentMethod: "wechat_pay",
        paymentProduct: "wechat_native",
        cashierUrl: "https://im.sdkwork.com/cashier?scene=recharge&orderId=recharge-order-1",
        qrCodePayload: "https://im.sdkwork.com/cashier?scene=recharge&orderId=recharge-order-1",
      },
    },
    async () => {
      const result = await CheckoutService.fetchCheckoutStatus("recharge-order-1");

      assert.equal(result.providerCode, "wechat_pay");
      assert.equal(result.paymentMethod, "wechat");
      assert.equal(result.paymentProduct, "wechat_native");
      assert.equal(result.cashierUrl, "https://im.sdkwork.com/cashier?scene=recharge&orderId=recharge-order-1");
      assert.equal(result.qrCodePayload, "https://im.sdkwork.com/cashier?scene=recharge&orderId=recharge-order-1");
    },
  );
});

test("checkout status requires scan_qr payloads to be web urls for pc qr payments", async () => {
  await withBillingSdkResponse(
    {
      code: "2000",
      data: {
        ...checkoutStatusResponse(),
        qrCodePayload: "weixin://wxpay/bizpayurl?pr=recharge-order-1",
      },
    },
    async () => {
      await assert.rejects(
        () => CheckoutService.fetchCheckoutStatus("recharge-order-1"),
        /Checkout qrCodePayload must be an http\(s\) url for scan_qr payments/,
      );
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

test("billing frontend services read the canonical app SDK requestPaymentPayload field only", () => {
  for (const relativePath of [
    "./packages/sdkwork-clawrouter-pc-console-recharge/src/rechargeService.ts",
    "./packages/sdkwork-clawrouter-pc-console-checkout/src/checkoutService.ts",
    "./packages/sdkwork-clawrouter-pc-vip/src/vipService.ts",
  ]) {
    const source = readPortalFile(relativePath);

    assert.match(source, /requestPaymentPayload/);
    assert.doesNotMatch(source, /request_payment_payload/);
    assert.doesNotMatch(source, /hasSnakeCase/);
    assert.doesNotMatch(source, /hasCamelCase/);
  }
});

test("billing frontend services read generated SDK camelCase response fields only", () => {
  for (const relativePath of [
    "./packages/sdkwork-clawrouter-pc-console-recharge/src/rechargeService.ts",
    "./packages/sdkwork-clawrouter-pc-console-checkout/src/checkoutService.ts",
  ]) {
    const source = readPortalFile(relativePath);
    for (const forbidden of [
      "provider_code",
      "payment_method",
      "payment_product",
      "next_action",
      "cashier_url",
      "qr_code_payload",
      "price_amount",
      "currency_code",
      "bonus_points",
      "grant_amount",
      "history_type",
      "source_type",
      "history_no",
      "asset_type",
      "points_delta",
      "reference_no",
      "source_id",
      "related_order_no",
      "occurred_at",
      "created_at",
      "total_amount",
      "order_no",
      "request_no",
      "payment_status",
      "pay_status",
      "order_status",
      "recharge_status",
      "grant_status",
      "out_trade_no",
      "external_trade_no",
      "paid_at",
    ]) {
      assert.doesNotMatch(source, new RegExp(escapeRegExp(forbidden)));
    }
  }
});

function checkoutStatusResponse(): Record<string, unknown> {
  return {
    amount: "99.90",
    cashierUrl: "https://im.sdkwork.com/cashier?scene=recharge&orderId=recharge-order-1",
    createdAt: "2026-05-21T00:00:00Z",
    expiresAt: "2026-05-21T00:15:00Z",
    nextAction: "scan_qr",
    orderNo: "recharge-order-1",
    orderStatus: "pending",
    outTradeNo: "provider-order-1",
    paidAt: "",
    paymentProduct: "wechat_native",
    providerCode: "wechat_pay",
    paymentMethod: "wechat",
    paymentStatus: "pending",
    points: 999,
    qrCodePayload: "https://im.sdkwork.com/cashier?scene=recharge&orderId=recharge-order-1",
    requestPaymentPayload: null,
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
