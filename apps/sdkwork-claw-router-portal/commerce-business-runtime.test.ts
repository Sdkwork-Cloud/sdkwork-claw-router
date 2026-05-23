import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

import { clearStoredAppSessionToken } from "./packages/sdkwork-claw-router-commons/src/app-session-token.ts";
import { resetClawRouterSdkClients } from "./packages/sdkwork-claw-router-commons/src/sdk-clients.ts";
import { CheckoutService } from "./packages/sdkwork-claw-router-console-checkout/src/checkoutService.ts";
import { MembershipService } from "./packages/sdkwork-claw-router-console-memberships/src/membershipService.ts";
import { RechargeService } from "./packages/sdkwork-claw-router-console-recharge/src/rechargeService.ts";
import { WalletService } from "./packages/sdkwork-claw-router-console-wallet/src/walletService.ts";

type CapturedSdkRequest = {
  body: string;
  method: string;
  url: string;
};

const retiredPackageNames = [
  "sdkwork-claw-router-console-commerce",
  "sdkwork-claw-router-admin-commerce",
  "sdkwork-claw-router-admin-vip",
];

const consoleBusinessPackages = {
  "sdkwork-claw-router-console-account": "/console/account",
  "sdkwork-claw-router-console-wallet": "/console/wallet",
  "sdkwork-claw-router-console-recharge": "/console/recharge",
  "sdkwork-claw-router-console-checkout": "/console/checkout",
  "sdkwork-claw-router-console-memberships": "/console/memberships",
  "sdkwork-claw-router-console-settlements": "/console/settlements",
} as const;

const hiddenConsoleBusinessRoutes = new Set([
  "/console/recharge",
  "/console/checkout",
]);

const adminBusinessPackages = {
  "sdkwork-claw-router-admin-catalog": "/admin/catalog",
  "sdkwork-claw-router-admin-inventory": "/admin/inventory",
  "sdkwork-claw-router-admin-orders": "/admin/orders",
  "sdkwork-claw-router-admin-payments": "/admin/payments",
  "sdkwork-claw-router-admin-memberships": "/admin/memberships",
  "sdkwork-claw-router-admin-wallet": "/admin/wallet",
  "sdkwork-claw-router-admin-finance": "/admin/finance",
} as const;

const originalFetch = globalThis.fetch;
const originalWindowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");

function readPortalFile(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

async function withCommerceSdkResponse<T>(
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

test("commerce routes are owned by business-scoped packages without retired aggregate packages", () => {
  const appSource = readPortalFile("./src/App.tsx");
  const packageJson = readPortalFile("./package.json");
  const lockfile = readPortalFile("./pnpm-lock.yaml");
  const tsconfig = readPortalFile("./tsconfig.typecheck.json");
  const routeClassification = readPortalFile("../../docs/schema-registry/frontend-route-classification.yaml");
  const consoleLayout = readPortalFile("./packages/sdkwork-claw-router-console-core/src/ConsoleLayout.tsx");
  const adminLayout = readPortalFile("./src/AdminLayout.tsx");

  for (const [packageName, routePath] of Object.entries(consoleBusinessPackages)) {
    assert.equal(existsSync(new URL(`./packages/${packageName}/package.json`, import.meta.url)), true);
    assert.match(packageJson, new RegExp(`"${packageName}": "workspace:\\*"`));
    assert.match(tsconfig, new RegExp(`"${packageName}"`));
    assert.match(appSource, new RegExp(`import\\('${packageName}'\\)`));
    assert.match(appSource, new RegExp(escapeRegExp(routePath)));
    if (!hiddenConsoleBusinessRoutes.has(routePath)) {
      assert.match(consoleLayout, new RegExp(escapeRegExp(routePath)));
    }
    assert.match(routeClassification, new RegExp(`route: ${escapeRegExp(routePath)}[\\s\\S]*package: ${packageName}`));
  }

  for (const hiddenRoute of hiddenConsoleBusinessRoutes) {
    assert.doesNotMatch(consoleLayout, new RegExp(escapeRegExp(hiddenRoute)));
  }

  for (const [packageName, routePath] of Object.entries(adminBusinessPackages)) {
    assert.equal(existsSync(new URL(`./packages/${packageName}/package.json`, import.meta.url)), true);
    assert.match(packageJson, new RegExp(`"${packageName}": "workspace:\\*"`));
    assert.match(tsconfig, new RegExp(`"${packageName}"`));
    assert.match(appSource, new RegExp(`import\\('${packageName}'\\)`));
    assert.match(appSource, new RegExp(escapeRegExp(routePath)));
    assert.match(adminLayout, new RegExp(escapeRegExp(routePath)));
    assert.match(routeClassification, new RegExp(`route: ${escapeRegExp(routePath)}[\\s\\S]*package: ${packageName}`));
  }

  for (const packageName of retiredPackageNames) {
    assert.equal(existsSync(new URL(`./packages/${packageName}`, import.meta.url)), false);
    assert.doesNotMatch(appSource, new RegExp(escapeRegExp(packageName)));
    assert.doesNotMatch(packageJson, new RegExp(escapeRegExp(packageName)));
    assert.doesNotMatch(lockfile, new RegExp(escapeRegExp(packageName)));
    assert.doesNotMatch(tsconfig, new RegExp(escapeRegExp(packageName)));
    assert.doesNotMatch(routeClassification, new RegExp(escapeRegExp(packageName)));
  }

  for (const retiredRoute of ["/console/commerce", "/admin/commerce", "/admin/vip", "/console/billing"]) {
    assert.doesNotMatch(appSource, new RegExp(escapeRegExp(retiredRoute)));
    assert.doesNotMatch(routeClassification, new RegExp(escapeRegExp(retiredRoute)));
  }
});

test("navbar preserves the existing VIP purchase entry and public VIP route", () => {
  const navbarSource = readPortalFile("./packages/sdkwork-claw-router-commons/src/components/Navbar.tsx");

  assert.match(navbarSource, /t\('nav\.buyVip', 'Buy VIP'\)/u);
  assert.match(navbarSource, /href: '\/vip'/u);
  assert.doesNotMatch(navbarSource, /href: '\/console\/memberships'/u);
  assert.doesNotMatch(navbarSource, /\/console\/billing/u);
});

test("console business services live in business packages instead of commons", () => {
  const commonsIndex = readPortalFile("./packages/sdkwork-claw-router-commons/src/index.ts");
  const serviceExpectations = {
    "sdkwork-claw-router-console-account/src/accountService.ts": "export class AccountService",
    "sdkwork-claw-router-console-recharge/src/rechargeService.ts": "export class RechargeService",
    "sdkwork-claw-router-console-checkout/src/checkoutService.ts": "export class CheckoutService",
    "sdkwork-claw-router-console-memberships/src/membershipService.ts": "export class MembershipService",
    "sdkwork-claw-router-console-wallet/src/walletService.ts": "export class WalletService",
    "sdkwork-claw-router-console-settlements/src/settlementsService.ts": "export class SettlementsService",
  } as const;

  assert.doesNotMatch(commonsIndex, /commerce-console-service/);
  assert.equal(existsSync(new URL("./packages/sdkwork-claw-router-commons/src/commerce-console-service.ts", import.meta.url)), false);
  for (const [servicePath, marker] of Object.entries(serviceExpectations)) {
    const serviceSource = readPortalFile(`./packages/${servicePath}`);
    assert.match(serviceSource, new RegExp(escapeRegExp(marker)));
  }
});

test("console business services use standard membership, recharge, checkout, wallet, and coupon API paths", async () => {
  await withCommerceSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            id: "pkg-100",
            price_amount: "100.00",
            points: 1000,
            bonus: 100,
          },
        ],
      },
    },
    async (captured) => {
      const packages = await RechargeService.fetchPackages();

      assert.equal(packages[0]?.id, "pkg-100");
      assert.equal(requestPath(captured[0]?.url), "/app/v3/api/recharges/packages");
      assert.equal(captured[0]?.method, "GET");
    },
  );

  await withCommerceSdkResponse(
    {
      code: "2000",
      data: {
        success: true,
        orderNo: "recharge-order-1",
      },
    },
    async (captured) => {
      const result = await RechargeService.submitRecharge("99.90", "wechat", "pkg-100");

      assert.deepEqual(result, { success: true, orderNo: "recharge-order-1" });
      assert.equal(requestPath(captured[0]?.url), "/app/v3/api/recharges/orders");
      assert.equal(captured[0]?.method, "POST");
      assert.match(captured[0]?.body ?? "", /console-recharge/);
      assert.match(captured[0]?.body ?? "", /wechat/);
    },
  );

  await withCommerceSdkResponse(
    {
      code: "2000",
      data: checkoutStatusResponse(),
    },
    async (captured) => {
      const result = await CheckoutService.fetchCheckoutStatus("recharge-order-1");

      assert.equal(result.orderNo, "recharge-order-1");
      assert.equal(requestPath(captured[0]?.url), "/app/v3/api/recharges/orders/recharge-order-1");
      assert.equal(captured[0]?.method, "GET");
    },
  );

  await withCommerceSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            package_no: "member-pkg-1",
            plan_id: "vip-pro",
            sku_id: "sku-vip-pro",
            price_amount: "199.00",
            currency_code: "CNY",
            duration_days: 365,
            status: "active",
          },
        ],
      },
    },
    async (captured) => {
      const packages = await MembershipService.fetchMembershipPackages();

      assert.equal(packages[0]?.id, "member-pkg-1");
      assert.equal(requestPath(captured[0]?.url), "/app/v3/api/memberships/packages");
      assert.equal(captured[0]?.method, "GET");
    },
  );

  await withCommerceSdkResponse(
    {
      code: "2000",
      data: {
        requestNo: "membership-request-1",
        status: "accepted",
        success: true,
      },
    },
    async (captured) => {
      const result = await MembershipService.purchaseMembership("1");

      assert.deepEqual(result, {
        requestNo: "membership-request-1",
        status: "accepted",
        success: true,
      });
      assert.equal(requestPath(captured[0]?.url), "/app/v3/api/memberships/purchases");
      assert.equal(captured[0]?.method, "POST");
      assert.deepEqual(JSON.parse(captured[0]?.body ?? "{}"), {
        packageId: 1,
        paymentMethod: "wechat",
      });
    },
  );

  await withCommerceSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            id: "ledger-1",
            orderNo: "recharge-order-1",
            amount: "99.90",
            payment_method: "wechat",
            created_at: "2026-05-21T00:00:00Z",
            status: "posted",
          },
        ],
      },
    },
    async (captured) => {
      const history = await WalletService.fetchRechargeHistory();

      assert.equal(history[0]?.id, "ledger-1");
      assert.equal(requestPath(captured[0]?.url), "/app/v3/api/wallet/ledger_entries");
      assert.equal(captured[0]?.method, "GET");
    },
  );

  await withCommerceSdkResponse(
    {
      code: "2000",
      data: {
        amount: "12.50",
        message: "Redeemed",
      },
    },
    async (captured) => {
      const result = await WalletService.redeemCode(" GIFT-2026 ");

      assert.deepEqual(result, {
        amount: "12.50",
        message: "Redeemed",
        success: true,
      });
      assert.equal(requestPath(captured[0]?.url), "/app/v3/api/coupons/redemptions");
      assert.equal(captured[0]?.method, "POST");
      assert.match(captured[0]?.body ?? "", /console-wallet/);
      assert.match(captured[0]?.body ?? "", /GIFT-2026/);
    },
  );
});

test("admin commerce packages are split by product, inventory, order, payment, membership, wallet, and finance capability", () => {
  const packageExpectations = {
    "sdkwork-claw-router-admin-catalog": [
      "CatalogAdmin",
      "getClawRouterBackendSdkClient().commerce.catalog.products.list",
      "getClawRouterBackendSdkClient().commerce.catalog.skus.list",
      "getClawRouterBackendSdkClient().commerce.catalog.categories.list",
    ],
    "sdkwork-claw-router-admin-inventory": [
      "InventoryAdmin",
      "getClawRouterBackendSdkClient().commerce.inventory.stocks.list",
      "getClawRouterBackendSdkClient().commerce.inventory.reservations.list",
      "getClawRouterBackendSdkClient().commerce.inventory.ledgerEntries.list",
    ],
    "sdkwork-claw-router-admin-orders": [
      "OrdersAdmin",
      "getClawRouterBackendSdkClient().commerce.orders.list",
      "getClawRouterBackendSdkClient().commerce.refunds.list",
      "getClawRouterBackendSdkClient().commerce.fulfillments.list",
      "getClawRouterBackendSdkClient().commerce.shipments.list",
    ],
    "sdkwork-claw-router-admin-payments": [
      "PaymentsAdmin",
      "getClawRouterBackendSdkClient().commerce.payments.providers.list",
      "getClawRouterBackendSdkClient().commerce.payments.providerAccounts.list",
      "getClawRouterBackendSdkClient().commerce.payments.routeRules.list",
    ],
    "sdkwork-claw-router-admin-memberships": [
      "MembershipsAdmin",
      "getClawRouterBackendSdkClient().commerce.memberships.plans.list",
      "getClawRouterBackendSdkClient().commerce.memberships.packages.list",
      "getClawRouterBackendSdkClient().commerce.memberships.entitlements.list",
    ],
    "sdkwork-claw-router-admin-wallet": [
      "WalletAdmin",
      "getClawRouterBackendSdkClient().commerce.recharges.packages.list",
      "getClawRouterBackendSdkClient().commerce.wallet.accounts.list",
      "getClawRouterBackendSdkClient().commerce.wallet.ledgerEntries.list",
    ],
    "sdkwork-claw-router-admin-finance": [
      "FinanceAdmin",
      "getClawRouterBackendSdkClient().commerce.invoices.list",
      "getClawRouterBackendSdkClient().commerce.commerceReports.paymentReconciliation.retrieve",
      "getClawRouterBackendSdkClient().commerce.audit.commerceEvents.list",
    ],
  };

  assert.equal(existsSync(new URL("./packages/sdkwork-claw-router-commons/src/commerce-runtime.ts", import.meta.url)), false);

  for (const [packageName, expectedTokens] of Object.entries(packageExpectations)) {
    const viewSource = readPortalFile(`./packages/${packageName}/src/index.tsx`);
    const serviceSource = readPortalFile(`./packages/${packageName}/src/${adminServiceFileName(packageName)}`);
    for (const retiredToken of retiredPackageNames) {
      assert.doesNotMatch(viewSource, new RegExp(escapeRegExp(retiredToken)));
      assert.doesNotMatch(serviceSource, new RegExp(escapeRegExp(retiredToken)));
    }
    for (const expected of expectedTokens) {
      if (expected.endsWith("Admin")) {
        assert.match(viewSource, new RegExp(escapeRegExp(expected)));
      } else {
        assert.match(serviceSource, new RegExp(escapeRegExp(expected)));
      }
    }
    assert.doesNotMatch(viewSource, /sdkwork-claw-router-commons\/runtime/);
    assert.match(serviceSource, /sdkwork-claw-router-commons\/runtime/);
  }
});

function checkoutStatusResponse(): Record<string, unknown> {
  return {
    orderNo: "recharge-order-1",
    outTradeNo: "provider-order-1",
    amount: "99.90",
    points: 999,
    paymentMethod: "wechat",
    orderStatus: "pending",
    paymentStatus: "pending",
    rechargeStatus: "pending",
    status: "pending",
    createdAt: "2026-05-21T00:00:00Z",
    expiresAt: "2026-05-21T00:15:00Z",
    paidAt: "",
    nextAction: "scan_qr",
    qrCodePayload: "weixin://wxpay/bizpayurl?pr=recharge-order-1",
  };
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function adminServiceFileName(packageName: string): string {
  switch (packageName) {
    case "sdkwork-claw-router-admin-catalog":
      return "catalogService.ts";
    case "sdkwork-claw-router-admin-inventory":
      return "inventoryService.ts";
    case "sdkwork-claw-router-admin-orders":
      return "ordersService.ts";
    case "sdkwork-claw-router-admin-payments":
      return "paymentsService.ts";
    case "sdkwork-claw-router-admin-memberships":
      return "membershipsService.ts";
    case "sdkwork-claw-router-admin-wallet":
      return "walletService.ts";
    case "sdkwork-claw-router-admin-finance":
      return "financeService.ts";
    default:
      throw new Error(`Unknown admin package ${packageName}`);
  }
}

function requestPath(url: string | undefined): string {
  assert.ok(url, "captured request URL is required");
  return url.split("?", 1)[0] ?? url;
}
