import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

import { clearStoredAppSessionToken } from "./packages/sdkwork-clawrouter-pc-commons/src/app-session-token.ts";
import { resetClawRouterSdkClients } from "./packages/sdkwork-clawrouter-pc-commons/src/sdk-clients.ts";
import {
  CheckoutService,
  appPromotionDiscountApplicationReversalsCreate,
  appPromotionDiscountApplicationsCreate,
  appPromotionDiscountApplicationsRelease,
  appPromotionDiscountApplicationsSettle,
} from "./packages/sdkwork-clawrouter-pc-console-checkout/src/checkoutService.ts";
import { MembershipService } from "./packages/sdkwork-clawrouter-pc-console-memberships/src/membershipService.ts";
import { RechargeService } from "./packages/sdkwork-clawrouter-pc-console-recharge/src/rechargeService.ts";
import { SettlementsService } from "./packages/sdkwork-clawrouter-pc-console-settlements/src/settlementsService.ts";
import { WalletService } from "./packages/sdkwork-clawrouter-pc-console-wallet/src/walletService.ts";

type CapturedSdkRequest = {
  body: string;
  method: string;
  url: string;
};

const retiredPackageNames = [
  "sdkwork-clawrouter-pc-console-commerce",
  "sdkwork-clawrouter-pc-admin-commerce",
  "sdkwork-clawrouter-pc-admin-vip",
];

const consoleBusinessPackages = {
  "sdkwork-clawrouter-pc-console-account": "/console/account",
  "sdkwork-clawrouter-pc-console-wallet": "/console/wallet",
  "sdkwork-clawrouter-pc-console-recharge": "/console/recharge",
  "sdkwork-clawrouter-pc-console-checkout": "/console/checkout",
  "sdkwork-clawrouter-pc-console-memberships": "/console/memberships",
  "sdkwork-clawrouter-pc-console-settlements": "/console/settlements",
} as const;

const hiddenConsoleBusinessRoutes = new Set([
  "/console/recharge",
  "/console/checkout",
]);

const adminBusinessPackages = {
  "sdkwork-clawrouter-pc-admin-catalog": "/admin/catalog",
  "sdkwork-clawrouter-pc-admin-inventory": "/admin/inventory",
  "sdkwork-clawrouter-pc-admin-orders": "/admin/orders",
  "sdkwork-clawrouter-pc-admin-payments": "/admin/payments",
  "sdkwork-clawrouter-pc-admin-memberships": "/admin/memberships",
  "sdkwork-clawrouter-pc-admin-wallet": "/admin/wallet",
  "sdkwork-clawrouter-pc-admin-finance": "/admin/finance",
} as const;

const originalFetch = globalThis.fetch;
const originalWindowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");

function readPortalFile(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function readCommerceProductAdminFile(relativePath: string): string {
  return readFileSync(
    new URL(
      `../../../sdkwork-commerce/apps/sdkwork-commerce-pc/packages/sdkwork-commerce-pc-admin-product/src/${relativePath}`,
      import.meta.url,
    ),
    "utf8",
  );
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
  const consoleLayout = readPortalFile("./packages/sdkwork-clawrouter-pc-console-core/src/ConsoleLayout.tsx");
  const adminModuleRegistry = readPortalFile("./src/adminModuleRegistry.ts");

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
    assert.match(adminModuleRegistry, new RegExp(escapeRegExp(routePath)));
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
  const navbarSource = readPortalFile("./packages/sdkwork-clawrouter-pc-commons/src/components/Navbar.tsx");

  assert.match(navbarSource, /t\('nav\.buyVip', 'Buy VIP'\)/u);
  assert.match(navbarSource, /href: '\/vip'/u);
  assert.doesNotMatch(navbarSource, /href: '\/console\/memberships'/u);
  assert.doesNotMatch(navbarSource, /\/console\/billing/u);
});

test("console business services live in business packages instead of commons", () => {
  const commonsIndex = readPortalFile("./packages/sdkwork-clawrouter-pc-commons/src/index.ts");
  const serviceExpectations = {
    "sdkwork-clawrouter-pc-console-account/src/accountService.ts": "export class AccountService",
    "sdkwork-clawrouter-pc-console-recharge/src/rechargeService.ts": "export class RechargeService",
    "sdkwork-clawrouter-pc-console-checkout/src/checkoutService.ts": "export class CheckoutService",
    "sdkwork-clawrouter-pc-console-memberships/src/membershipService.ts": "export class MembershipService",
    "sdkwork-clawrouter-pc-console-wallet/src/walletService.ts": "export class WalletService",
    "sdkwork-clawrouter-pc-console-settlements/src/settlementsService.ts": "export class SettlementsService",
  } as const;

  assert.doesNotMatch(commonsIndex, /commerce-console-service/);
  assert.equal(existsSync(new URL("./packages/sdkwork-clawrouter-pc-commons/src/commerce-console-service.ts", import.meta.url)), false);
  for (const [servicePath, marker] of Object.entries(serviceExpectations)) {
    const serviceSource = readPortalFile(`./packages/${servicePath}`);
    assert.match(serviceSource, new RegExp(escapeRegExp(marker)));
  }
});

test("commerce business services consume the Commerce service facade instead of ClawRouter commerce SDK trees", () => {
  const servicePaths = [
    "sdkwork-clawrouter-pc-console-account/src/accountService.ts",
    "sdkwork-clawrouter-pc-console-recharge/src/rechargeService.ts",
    "sdkwork-clawrouter-pc-console-checkout/src/checkoutService.ts",
    "sdkwork-clawrouter-pc-console-memberships/src/membershipService.ts",
    "sdkwork-clawrouter-pc-console-wallet/src/walletService.ts",
    "sdkwork-clawrouter-pc-console-settlements/src/settlementsService.ts",
    "sdkwork-clawrouter-pc-vip/src/vipService.ts",
    "sdkwork-clawrouter-pc-admin-inventory/src/inventoryService.ts",
    "sdkwork-clawrouter-pc-admin-orders/src/ordersService.ts",
    "sdkwork-clawrouter-pc-admin-payments/src/paymentsService.ts",
    "sdkwork-clawrouter-pc-admin-memberships/src/membershipsService.ts",
    "sdkwork-clawrouter-pc-admin-wallet/src/walletService.ts",
    "sdkwork-clawrouter-pc-admin-finance/src/financeService.ts",
  ] as const;

  for (const servicePath of servicePaths) {
    const serviceSource = readPortalFile(`./packages/${servicePath}`);
    assert.match(serviceSource, /getSdkworkCommerceService/, `${servicePath} must use Commerce service facade`);
    assert.doesNotMatch(
      serviceSource,
      /getClawRouterAppSdkClient\(\)\.commerce|getClawRouterBackendSdkClient\(\)\.commerce/,
      `${servicePath} must not consume ClawRouter generated commerce trees`,
    );
    assert.doesNotMatch(
      serviceSource,
      /getClawRouterAppSdkClient\(\)\.system\.promotions|getClawRouterBackendSdkClient\(\)\.system\.promotions/,
      `${servicePath} must not consume ClawRouter promotion SDK trees for Commerce-owned promotion resources`,
    );
    assert.doesNotMatch(
      serviceSource,
      /type\s+(?:AppCommerce|BackendCommerce)\s*=\s*ReturnType<typeof getClawRouter(?:App|Backend)SdkClient>\['commerce'\]/,
      `${servicePath} must not type against ClawRouter generated commerce trees`,
    );
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
            priceAmount: "100.00",
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

      assert.equal(packages[0]?.id, "pkg-100");
      assert.equal(requestPath(captured[0]?.url), "/app/v3/api/recharges/packages");
      assert.equal(captured[0]?.method, "GET");
    },
  );

  await withCommerceSdkResponse(
    {
      code: "2000",
      data: {
        applicationId: "discount-application-1",
      },
    },
    async (captured) => {
      await appPromotionDiscountApplicationsCreate({ orderId: "order-1" });
      await appPromotionDiscountApplicationsSettle("discount-application-1", { orderId: "order-1" });
      await appPromotionDiscountApplicationsRelease("discount-application-1", { reason: "checkout-timeout" });
      await appPromotionDiscountApplicationReversalsCreate({ applicationId: "discount-application-1" });

      assert.deepEqual(
        captured.map((request) => [request.method, requestPath(request.url)]),
        [
          ["POST", "/app/v3/api/promotions/discount_applications"],
          ["POST", "/app/v3/api/promotions/discount_applications/discount-application-1/settlements"],
          ["POST", "/app/v3/api/promotions/discount_applications/discount-application-1/releases"],
          ["POST", "/app/v3/api/promotions/discount_applications/reversals"],
        ],
      );
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
      const result = await RechargeService.submitRecharge("99.90", "USD", "wechat", "pkg-100");

      assert.deepEqual(result, { success: true, orderNo: "recharge-order-1" });
      assert.equal(requestPath(captured[0]?.url), "/app/v3/api/recharges/orders");
      assert.equal(captured[0]?.method, "POST");
      assert.match(captured[0]?.body ?? "", /console-recharge/);
      assert.match(captured[0]?.body ?? "", /USD/);
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
        packageId: "1",
      });
    },
  );

  await withCommerceSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            id: "billing-history-1",
            historyNo: "BH-recharge-1",
            type: "recharge",
            relatedOrderNo: "recharge-order-1",
            amount: "99.90",
            paymentMethod: "wechat",
            occurredAt: "2026-05-21T00:00:00Z",
            status: "success",
          },
        ],
      },
    },
    async (captured) => {
      const history = await WalletService.fetchRechargeHistory();

      assert.equal(history[0]?.id, "billing-history-1");
      assert.equal(requestPath(captured[0]?.url), "/app/v3/api/billing/history");
      assert.equal(captured[0]?.method, "GET");
      assert.match(captured[0]?.url ?? "", /type=recharge/);
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
      assert.equal(requestPath(captured[0]?.url), "/app/v3/api/promotions/codes/redemptions");
      assert.equal(captured[0]?.method, "POST");
      const body = JSON.parse(captured[0]?.body ?? "{}");
      assert.equal(body.code, "GIFT-2026");
      assert.equal(body.source, "console-wallet");
      assert.equal(body.metadata, undefined);
    },
  );
});

test("settlements dashboard uses generated app SDK wallet ledger and invoice paths", async () => {
  await withCommerceSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            amount: "12.3456",
            createdAt: "2026-05-21T00:00:00Z",
            id: "settlement-entry-1",
            invoiceAmount: "12.3456",
            invoiceNo: "INV-2026-05",
            sourceType: "image_generation",
            status: "issued",
          },
        ],
      },
    },
    async (captured) => {
      const dashboard = await SettlementsService.fetchDashboardData({ year: "2026" });

      assert.deepEqual(
        captured.map((request) => requestPath(request.url)).sort(),
        ["/app/v3/api/invoices", "/app/v3/api/wallet/ledger_entries"],
      );
      assert.equal(captured.every((request) => request.method === "GET"), true);
      const ledgerRequestUrl = new URL(captured.find((request) => requestPath(request.url) === "/app/v3/api/wallet/ledger_entries")?.url ?? "", "http://localhost");
      const invoiceRequestUrl = new URL(captured.find((request) => requestPath(request.url) === "/app/v3/api/invoices")?.url ?? "", "http://localhost");
      assert.equal(ledgerRequestUrl.searchParams.get("page_size"), "200");
      assert.equal(invoiceRequestUrl.searchParams.get("page_size"), "100");
      assert.equal(dashboard.chartData[0]?.image, "12.345600");
      assert.equal(dashboard.bills[0]?.id, "INV-2026-05");
    },
  );
});

test("admin commerce packages are split by product, inventory, order, payment, membership, wallet, and finance capability", () => {
  const packageExpectations = {
    "sdkwork-clawrouter-pc-admin-catalog": [
      "CatalogAdmin",
      "sdkwork-commerce-pc-admin-product",
      "createCommerceProductAdminService",
    ],
    "sdkwork-clawrouter-pc-admin-inventory": [
      "InventoryAdmin",
      "getSdkworkCommerceService().admin.inventory.stocks.list",
      "getSdkworkCommerceService().admin.inventory.reservations.list",
      "getSdkworkCommerceService().admin.inventory.ledgerEntries.list",
    ],
    "sdkwork-clawrouter-pc-admin-orders": [
      "OrdersAdmin",
      "getSdkworkCommerceService().admin.orders.management.list",
      "getSdkworkCommerceService().admin.orders.management.cancel",
      "getSdkworkCommerceService().admin.orders.management.close",
      "getSdkworkCommerceService().admin.refunds.management.list",
      "getSdkworkCommerceService().admin.refunds.approvals.create",
      "getSdkworkCommerceService().admin.refunds.attempts.create",
      "getSdkworkCommerceService().admin.fulfillments.list",
      "getSdkworkCommerceService().admin.fulfillments.create",
      "getSdkworkCommerceService().admin.fulfillments.update",
      "getSdkworkCommerceService().admin.fulfillments.shipments.create",
      "getSdkworkCommerceService().admin.fulfillments.shipments.update",
      "getSdkworkCommerceService().admin.fulfillments.trackingEvents.create",
      "getSdkworkCommerceService().admin.shipments.list",
    ],
    "sdkwork-clawrouter-pc-admin-payments": [
      "PaymentsAdmin",
      "getSdkworkCommerceService().admin.payments.providers.list",
      "getSdkworkCommerceService().admin.payments.providerAccounts.list",
      "getSdkworkCommerceService().admin.payments.providerAccounts.create",
      "getSdkworkCommerceService().admin.payments.methods.list",
      "getSdkworkCommerceService().admin.payments.channels.list",
      "getSdkworkCommerceService().admin.payments.routeRules.list",
      "getSdkworkCommerceService().admin.payments.runtime.snapshot.retrieve",
      "getSdkworkCommerceService().admin.payments.intents.list",
      "getSdkworkCommerceService().admin.payments.attempts.list",
      "getSdkworkCommerceService().admin.payments.webhookEvents.list",
      "getSdkworkCommerceService().admin.payments.reconciliationRuns.list",
    ],
    "sdkwork-clawrouter-pc-admin-memberships": [
      "MembershipsAdmin",
      "getSdkworkCommerceService().admin.memberships.plans.list",
      "getSdkworkCommerceService().admin.memberships.packages.list",
      "getSdkworkCommerceService().admin.memberships.entitlements.list",
      "getSdkworkCommerceService().admin.recharges.packages.list",
      "getSdkworkCommerceService().admin.recharges.packages.create",
      "getSdkworkCommerceService().admin.recharges.packages.update",
      "getSdkworkCommerceService().admin.recharges.packages.delete",
    ],
    "sdkwork-clawrouter-pc-admin-wallet": [
      "WalletAdmin",
      "getSdkworkCommerceService().admin.wallet.accounts.list",
      "getSdkworkCommerceService().admin.wallet.ledgerEntries.list",
    ],
    "sdkwork-clawrouter-pc-admin-finance": [
      "FinanceAdmin",
      "getSdkworkCommerceService().admin.invoices.list",
      "getSdkworkCommerceService().admin.commerceReports.paymentReconciliation.retrieve",
      "getSdkworkCommerceService().admin.audit.commerceEvents.list",
    ],
  };

  assert.equal(existsSync(new URL("./packages/sdkwork-clawrouter-pc-commons/src/commerce-runtime.ts", import.meta.url)), false);

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
    assert.doesNotMatch(viewSource, /sdkwork-clawrouter-pc-commons\/runtime/);
    if (packageName === "sdkwork-clawrouter-pc-admin-catalog") {
      assert.match(serviceSource, /sdkwork-commerce-pc-admin-product/);
    } else {
      assert.match(serviceSource, /getSdkworkCommerceService/);
      assert.doesNotMatch(
        serviceSource,
        /getClawRouterAppSdkClient\(\)\.commerce|getClawRouterBackendSdkClient\(\)\.commerce/,
      );
    }
    assert.doesNotMatch(serviceSource, /\bfetch\s*\(|axios|XMLHttpRequest/);
    if (packageName === "sdkwork-clawrouter-pc-admin-wallet") {
      assert.doesNotMatch(viewSource, /rechargePackages/);
      assert.doesNotMatch(serviceSource, /recharges\.packages\.list/);
      assert.doesNotMatch(serviceSource, /backendRechargesPackagesList/);
    }
  }
});

test("admin orders center uses server pagination and exposes common row actions", () => {
  const viewSource = readPortalFile("./packages/sdkwork-clawrouter-pc-admin-orders/src/index.tsx");
  const serviceSource = readPortalFile("./packages/sdkwork-clawrouter-pc-admin-orders/src/ordersService.ts");
  const resourceCenterSource = readPortalFile("./packages/sdkwork-clawrouter-pc-commons/src/components/AdminResourceCenter.tsx");
  const i18nSource = readPortalFile("./packages/sdkwork-clawrouter-pc-i18n/src/resources/admin-commerce/orders.ts");

  assert.match(viewSource, /load:\s*\(params\)\s*=>\s*backendOrdersList\(params\)/);
  assert.doesNotMatch(viewSource, /backendOrdersList\(DEFAULT_PAGE_PARAMS\)/);
  assert.match(viewSource, /pagination:\s*\{\s*initialPageSize:\s*50\s*\}/);
  assert.match(viewSource, /rowActions:\s*\[/);
  assert.match(viewSource, /label:\s*t\('admin\.commerce\.orders\.actions\.view', 'View'\)/);
  assert.match(viewSource, /label:\s*t\('admin\.commerce\.orders\.actions\.cancel', 'Cancel order'\)/);
  assert.match(viewSource, /isDisabled:\s*\(record\)\s*=>\s*!canCancelOrderRecord\(record\)/);
  assert.match(viewSource, /cancelled_at/);
  assert.match(viewSource, /pending_payment/);

  assert.match(resourceCenterSource, /import \{ BottomPagination \} from '\.\/BottomPagination'/);
  assert.match(resourceCenterSource, /export type AdminResourcePagination/);
  assert.match(resourceCenterSource, /readAdminResourceCollectionMeta/);
  assert.match(resourceCenterSource, /section\.load\(section\.pagination \? pageState : undefined\)/);
  assert.match(resourceCenterSource, /footer=\{paginationFooter\}/);
  assert.match(resourceCenterSource, /recordRowActions/);
  assert.match(resourceCenterSource, /className="m-5 mt-4 min-h-0 flex-1 rounded-xl"/);
  assert.match(resourceCenterSource, /disabled=\{actionDisabled\}/);

  assert.match(serviceSource, /backendOrdersList\(params\?: Parameters<OrderManagementService\['list'\]>\[0\]\)/);
  assert.match(serviceSource, /backendRefundsList\(params\?: Parameters<RefundManagementService\['list'\]>\[0\]\)/);
  assert.match(serviceSource, /toSdkListParams\(params\)/);
  assert.doesNotMatch(serviceSource, /\bfetch\s*\(|axios|XMLHttpRequest/);

  for (const key of [
    "admin.commerce.orders.actions.view",
    "admin.commerce.orders.actions.cancel",
    "admin.commerce.orders.actions.cancelReady",
    "admin.commerce.orders.actions.cancelUnavailable",
    "admin.commerce.orders.actions.close",
    "admin.commerce.orders.actions.approveRefund",
    "admin.commerce.orders.actions.rejectRefund",
    "admin.commerce.orders.actions.executeRefund",
    "admin.commerce.orders.actions.createShipment",
    "admin.commerce.orders.actions.markShipped",
    "admin.commerce.orders.actions.addTracking",
    "admin.commerce.orders.pagination.showing",
    "admin.commerce.orders.pagination.page",
    "admin.commerce.orders.pagination.pageSize",
  ]) {
    assert.match(i18nSource, new RegExp(`"${escapeRegExp(key)}"`));
  }
  assert.doesNotMatch(i18nSource, /cancelPendingBackend/);
});

test("admin catalog product center exposes product edit route and dedicated sku management", () => {
  const appSource = readPortalFile("./src/App.tsx");
  const catalogIndexSource = readCommerceProductAdminFile("index.tsx");
  const productListSource = readCommerceProductAdminFile("ProductListPage.tsx");

  assert.match(appSource, /path="catalog\/products\/:productId\/edit"/);
  assert.match(catalogIndexSource, /type CatalogAdminTab =[\s\S]*'productEdit'/);
  assert.match(catalogIndexSource, /useParams/);
  assert.match(catalogIndexSource, /<ProductCreatePage[\s\S]*mode="edit"[\s\S]*productId=\{productId\}/);
  assert.match(catalogIndexSource, /<SkuManagementPage \/>/);
  assert.match(productListSource, /\/admin\/catalog\/products\/\$\{encodeURIComponent\(productId\)\}\/edit/);
});

test("admin catalog category management uses compact cascade columns and modal editing", () => {
  const categorySource = readCommerceProductAdminFile("CategoryManagementPage.tsx");
  const handleMoveSource = categorySource.match(/async function handleCategoryMove[\s\S]*?\n  }\n\n  return \(/)?.[0] ?? "";

  assert.match(categorySource, /data-admin-category-cascade-manager/);
  assert.match(categorySource, /data-admin-category-cascade-column/);
  assert.match(categorySource, /data-admin-category-create-modal/);
  assert.match(categorySource, /openCategoryModal\('create'/);
  assert.match(categorySource, /openCategoryModal\('edit'/);
  assert.match(categorySource, /handleCategoryMove/);
  assert.match(categorySource, /data-admin-category-hover-actions/);
  assert.match(categorySource, /data-admin-category-more-action/);
  assert.match(categorySource, /data-admin-category-inline-move-up/);
  assert.match(categorySource, /data-admin-category-inline-move-down/);
  assert.match(categorySource, /data-admin-category-context-menu/);
  assert.match(categorySource, /data-admin-category-action-create-child/);
  assert.match(categorySource, /data-admin-category-action-edit/);
  assert.match(categorySource, /data-admin-category-action-delete/);
  assert.match(categorySource, /data-admin-category-action-move-up/);
  assert.match(categorySource, /data-admin-category-action-move-down/);
  assert.match(categorySource, /onContextMenu/);
  assert.match(categorySource, /moveCategorySortOrder/);
  assert.match(categorySource, /applyCategoryMoveLocally/);
  assert.match(handleMoveSource, /setState\(/);
  assert.doesNotMatch(handleMoveSource, /loadCategories\(\)/);
  assert.doesNotMatch(handleMoveSource, new RegExp(escapeRegExp("分类排序已更新")));
  assert.match(categorySource, /updateCommerceCategory\(record\.id/);
  assert.match(categorySource, /buildCategoryColumns/);
  assert.match(categorySource, /activePathIds/);
  assert.match(categorySource, /pageSize:\s*(?:String\(CATEGORY_LIST_PAGE_SIZE\)|['"]200['"]|200)/);
  assert.match(categorySource, /relative flex h-full min-h-0 w-full flex-col overflow-hidden/);
  assert.match(categorySource, /flex min-h-0 flex-1 flex-col gap-3 overflow-hidden/);
  assert.match(categorySource, /grid min-h-0 flex-1 overflow-hidden gap-3/);
  assert.match(categorySource, /flex h-full min-h-0 overflow-hidden/);
  assert.match(categorySource, /flex h-full min-h-0 overflow-x-auto/);
  assert.match(categorySource, /w-\[360px\]/);
  assert.match(categorySource, /data-admin-category-scroll-shell/);
  assert.match(categorySource, /data-admin-category-cascade-columns/);
  assert.match(categorySource, /data-admin-category-toolbar/);
  assert.match(categorySource, /generateCategoryNo/);
  assert.match(categorySource, /data-admin-category-generated-no/);
  assert.match(categorySource, /CategoryParentCascader/);
  assert.match(categorySource, /data-admin-category-parent-cascader/);
  assert.match(categorySource, /buildCategoryParentColumns/);
  assert.match(categorySource, /findCategoryPathIds/);
  assert.match(categorySource, /readOnly/);
  assert.match(categorySource, /data-admin-category-initialize-button/);
  assert.match(categorySource, /CATEGORY_SEED_DATASETS\s*=\s*\['product'\]\s*as const/);
  assert.doesNotMatch(categorySource, /Catalog Taxonomy/);
  assert.doesNotMatch(categorySource, /\u7c7b\u76ee\u521d\u59cb\u5316\u4e0e\u7ef4\u62a4/u);
  assert.doesNotMatch(categorySource, /\u6309\u4e1a\u52a1\u57df\u521d\u59cb\u5316\u6807\u51c6\u5206\u7c7b/u);
  assert.doesNotMatch(categorySource, new RegExp(escapeRegExp('<CategoryInput label="分类编号"')));
  assert.doesNotMatch(categorySource, /<select[\s\S]*value=\{form\.parentId\}/);
  assert.doesNotMatch(categorySource, /data-admin-category-editor-panel/);
  assert.doesNotMatch(categorySource, /data-admin-category-detail-panel/);
  assert.doesNotMatch(categorySource, /CategoryEditorPanel/);
  assert.doesNotMatch(categorySource, /function CategoryIconAction/);
  assert.doesNotMatch(categorySource, /lg:grid-cols-\[minmax\(0,1fr\)_320px\]/);
  assert.doesNotMatch(categorySource, /data-admin-category-seed-dataset/);
  assert.doesNotMatch(categorySource, /selectedDatasets/);
  assert.doesNotMatch(categorySource, /onDatasetToggle/);
  assert.doesNotMatch(categorySource, /categorySeedDatasetLabel/);
  assert.doesNotMatch(categorySource, /'courses'|'agents'|'agent-skills'|'mcp'|'apps'/);
  assert.doesNotMatch(categorySource, /pageSize:\s*500/);
  assert.doesNotMatch(categorySource, new RegExp(escapeRegExp("选择一个分类")));
});

test("admin catalog product edit reuses product create flow and updates existing skus", () => {
  const productCreateSource = readCommerceProductAdminFile("ProductCreatePage.tsx");
  const catalogServiceSource = readCommerceProductAdminFile("catalogService.ts");

  assert.match(catalogServiceSource, /catalog\.products\.update\(productId, body\)/);
  assert.match(catalogServiceSource, /catalog\.products\.delete\(productId\)/);
  assert.match(catalogServiceSource, /catalog\.skus\.update\(skuId, body\)/);
  assert.match(catalogServiceSource, /catalog\.skus\.delete\(skuId\)/);
  assert.doesNotMatch(catalogServiceSource, /getClawRouterBackendSdkClient/);
  assert.doesNotMatch(catalogServiceSource, /\bfetch\s*\(|axios|XMLHttpRequest/);
  assert.match(productCreateSource, /export function ProductCreatePage\(\{[\s\S]*mode = 'create'/);
  assert.match(productCreateSource, /loadProductDraftForEdit/);
  assert.match(productCreateSource, /updateCommerceProduct\(options\.productId/);
  assert.match(productCreateSource, /updateCommerceSku\(sku\.backendSkuId/);
  assert.doesNotMatch(productCreateSource, /pageSize:\s*500/);
});

test("admin catalog product edit opens the detail step instead of the basic step", () => {
  const productCreateSource = readCommerceProductAdminFile("ProductCreatePage.tsx");

  assert.match(productCreateSource, /useState<ProductCreateStep>\(\(\) => initialProductCreateStep\(mode\)\)/);
  assert.match(productCreateSource, /function initialProductCreateStep\(mode: ProductCreatePageMode\): ProductCreateStep/);
  assert.match(productCreateSource, /mode === 'edit'\s*\?\s*'detail'\s*:\s*'basic'/);
});

test("admin catalog sku management supports list create edit view and archive operations", () => {
  const skuManagementSource = readCommerceProductAdminFile("SkuManagementPage.tsx");

  assert.match(skuManagementSource, /data-admin-catalog-sku-management-page/);
  assert.match(skuManagementSource, /listCommerceSkus/);
  assert.match(skuManagementSource, /createCommerceSku/);
  assert.match(skuManagementSource, /updateCommerceSku/);
  assert.match(skuManagementSource, /deleteCommerceSku/);
  assert.match(skuManagementSource, /mode: 'create' \| 'edit' \| 'view'/);
  assert.match(skuManagementSource, /archiveSku/);
  assert.match(skuManagementSource, /readSkuRecords/);
  assert.doesNotMatch(skuManagementSource, /\bfetch\s*\(|axios|XMLHttpRequest/);
});

test("admin catalog contract and backend sdk ownership moved to Commerce", () => {
  const localContractIndex = readPortalFile("../../docs/schema-registry/frontend-field-contracts/index.yaml");
  const localBackendOpenApi = readPortalFile("../../generated/openapi/clawrouter-backend-openapi.json");
  const commerceBackendOpenApi = readFileSync(
    new URL("../../../sdkwork-commerce/generated/openapi/commerce-backend-api.openapi.json", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(localContractIndex, /operations\/backend-commerce-catalog\.yaml/);
  assert.doesNotMatch(localContractIndex, /operations\/app-commerce-catalog\.yaml/);
  assert.doesNotMatch(localBackendOpenApi, /\/backend\/v3\/api\/catalog\/products/);
  assert.doesNotMatch(localBackendOpenApi, /catalog\.products\.delete/);
  assert.doesNotMatch(localBackendOpenApi, /catalog\.skus\.delete/);
  assert.match(commerceBackendOpenApi, /"\/backend\/v3\/api\/catalog\/products\/\{productId\}"/);
  assert.match(commerceBackendOpenApi, /"operationId": "catalog\.products\.delete"/);
  assert.match(commerceBackendOpenApi, /"operationId": "catalog\.skus\.delete"/);
});

test("admin payments center exposes complete payment modules and aligned provider account controls", () => {
  const viewSource = readPortalFile("./packages/sdkwork-clawrouter-pc-admin-payments/src/index.tsx");
  const serviceSource = readPortalFile("./packages/sdkwork-clawrouter-pc-admin-payments/src/paymentsService.ts");
  const adminResourceCenterSource = readPortalFile("./packages/sdkwork-clawrouter-pc-commons/src/components/AdminResourceCenter.tsx");
  const backendCommerceSdk = readFileSync(
    new URL(
      "../../../sdkwork-commerce/sdks/sdkwork-commerce-backend-sdk/sdkwork-commerce-backend-sdk-typescript/generated/server-openapi/src/api/payments.ts",
      import.meta.url,
    ),
    "utf8",
  );
  const i18nSource = [
    readPortalFile("./packages/sdkwork-clawrouter-pc-i18n/src/resources/admin-commerce/payments.ts"),
    readPortalFile("./packages/sdkwork-clawrouter-pc-i18n/src/resources/admin/core-columns.ts"),
  ].join("\n");
  const contractSource = readFileSync(new URL("../../docs/schema-registry/frontend-field-contracts/operations/backend-commerce-payments.yaml", import.meta.url), "utf8");

  for (const sectionId of [
    "providers",
    "providerAccounts",
    "methods",
    "channels",
    "routeRules",
    "intents",
    "attempts",
    "webhookEvents",
    "reconciliationRuns",
  ]) {
    assert.match(viewSource, new RegExp(`id: '${sectionId}'`));
  }
  assert.match(viewSource, /activeSectionId=\{activeSectionId\}/);
  assert.match(viewSource, /initialSectionId=\{DEFAULT_PAYMENTS_SECTION_ID\}/);
  assert.match(viewSource, /key=\{activeSectionId\}/);
  assert.match(viewSource, /showSectionNavigation=\{false\}/);
  assert.doesNotMatch(viewSource, /showSectionNavigation=\{true\}/);
  assert.match(viewSource, /refreshKey=\{providerAccountRefreshKey\}/);
  assert.match(viewSource, /setProviderAccountRefreshKey\(\(current\) => current \+ 1\)/);
  assert.match(viewSource, /PaymentProviderAccountSelect/);
  assert.match(viewSource, /const \[paymentProviderCodeOptions, setPaymentProviderCodeOptions\] = useState/);
  assert.match(viewSource, /void loadPaymentProviderOptions\(\)/);
  assert.match(viewSource, /backendPaymentsProvidersList\(DEFAULT_PAGE_PARAMS\)/);
  assert.match(viewSource, /readPaymentProviderCodeOptions/);
  assert.match(viewSource, /paymentProviderCodeOptions\.length === 0/);
  assert.doesNotMatch(viewSource, /const paymentProviderCodeOptions = useMemo<readonly PaymentProviderAccountSelectOption\[]>/);
  assert.match(viewSource, /PAYMENT_PROVIDER_CODES/);
  assert.match(viewSource, /PAYMENT_PROVIDER_ENVIRONMENTS/);
  assert.match(viewSource, /PAYMENT_PROVIDER_ACCOUNT_STATUSES/);
  assert.match(viewSource, /rowActions:\s*\[/);
  assert.match(viewSource, /backendPaymentsProviderAccountsUpdate/);
  assert.match(viewSource, /backendPaymentsProviderAccountsDelete/);
  assert.match(viewSource, /backendPaymentsProviderAccountsStatusUpdate/);
  assert.match(viewSource, /providerAccountFormMode/);
  assert.match(viewSource, /selectedPaymentProviderCode/);
  assert.match(viewSource, /data-admin-payment-provider-account-shell/);
  assert.match(viewSource, /data-admin-payment-provider-list/);
  assert.match(viewSource, /data-admin-payment-provider-logo/);
  assert.match(viewSource, /data-admin-payment-provider-account-form/);
  assert.match(viewSource, /h-\[calc\(100vh-16px\)\]/);
  assert.match(viewSource, /max-h-\[980px\]/);
  assert.match(viewSource, /max-w-\[min\(1720px,calc\(100vw-16px\)\)\]/);
  assert.match(viewSource, /xl:grid-cols-\[232px_minmax\(0,1fr\)\]/);
  assert.match(viewSource, /data-admin-payment-provider-compact-form/);
  assert.doesNotMatch(viewSource, /xl:grid-cols-\[minmax\(0,1fr\)_360px\]/);
  assert.match(viewSource, /xl:grid-cols-4/);
  assert.match(viewSource, /mt-1 h-20/);
  assert.doesNotMatch(viewSource, /selectedPaymentProviderOption \? \(/);
  assert.match(viewSource, /PaymentProviderLogo/);
  assert.doesNotMatch(viewSource, /generatedAccountNo/);
  assert.doesNotMatch(viewSource, /createGeneratedPaymentProviderAccountNo/);
  assert.doesNotMatch(viewSource, /const accountNo = requiredText\(form\.accountNo, 'accountNo'\)/);
  assert.doesNotMatch(viewSource, /\baccountNo,\s*$/m);
  assert.doesNotMatch(viewSource, /accountNo: form\./);
  assert.match(viewSource, /PaymentProviderCredentialModeSwitch/);
  assert.match(viewSource, /PAYMENT_PROVIDER_CREDENTIAL_PROFILES/);
  assert.doesNotMatch(viewSource, /PAYMENT_PROVIDER_SETUP_GUIDES/);
  assert.match(viewSource, /resolvePaymentProviderCredentialProfile/);
  assert.match(viewSource, /showPaymentProviderCredentialField/);
  assert.match(viewSource, /allowFileUpload/);
  assert.match(viewSource, /data-admin-payment-provider-credential-file-upload/);
  assert.match(viewSource, /type="file"/);
  assert.match(viewSource, /PAYMENT_PROVIDER_CREDENTIAL_FILE_ACCEPT/);
  assert.match(viewSource, /\.text\(\)/);
  assert.match(viewSource, /admin\.commerce\.payments\.providerAccounts\.credentials\.uploadFile/);
  assert.match(viewSource, /admin\.commerce\.payments\.providerAccounts\.credentials\.fileReadError/);
  assert.match(viewSource, /paymentProviderAccountMerchantIdLabel/);
  assert.match(viewSource, /paymentProviderCredentialFieldPlaceholder/);
  assert.doesNotMatch(viewSource, /<PaymentProviderRequiredProgress/);
  assert.doesNotMatch(viewSource, /<PaymentProviderSetupGuide/);
  assert.doesNotMatch(viewSource, /PaymentProviderRequiredProgress\(/);
  assert.doesNotMatch(viewSource, /PaymentProviderSetupGuide\(/);
  assert.doesNotMatch(viewSource, /requiredPaymentCredentialProgress/);
  assert.doesNotMatch(viewSource, /missingPaymentCredentialLabels/);
  assert.match(viewSource, /paymentProviderAccountChannelScopeLabel/);
  assert.match(viewSource, /formatPaymentProviderAccountAvailability/);
  assert.match(viewSource, /admin\.commerce\.payments\.providerAccounts\.channelScope/);
  assert.match(viewSource, /admin\.commerce\.payments\.providerAccounts\.availability\.activeOnly/);
  assert.doesNotMatch(viewSource, /data-admin-payment-provider-credential-profile/);
  assert.match(viewSource, /paymentApiKey/);
  assert.match(viewSource, /paymentClientId/);
  assert.match(viewSource, /paymentClientSecret/);
  assert.match(viewSource, /rsaPrivateKey/);
  assert.match(viewSource, /rsaPublicKey/);
  assert.match(viewSource, /aesKey/);
  assert.match(viewSource, /webhookSigningKey/);
  assert.match(viewSource, /wechatPayApiV3Key/);
  assert.match(viewSource, /paypalClientSecret/);
  assert.match(viewSource, /stripeSecretKey/);
  assert.match(viewSource, /credentialMode/);
  assert.match(viewSource, /accountRole/);
  assert.match(viewSource, /merchant/);
  assert.match(viewSource, /service_provider/);
  assert.match(viewSource, /PaymentProviderAccountTextArea/);
  assert.match(viewSource, /admin\.commerce\.payments\.providerAccounts\.note/);
  assert.match(viewSource, /note: form\.note\.trim\(\)/);
  assert.match(contractSource, /operation_id: payments\.providerAccounts\.list[\s\S]*read_sources:[\s\S]*- commerce_payment_provider_account[\s\S]*- ops_audit_log/);
  assert.match(contractSource, /operation_id: payments\.providerAccounts\.update/);
  assert.match(contractSource, /operation_id: payments\.providerAccounts\.delete/);
  assert.match(contractSource, /operation_id: payments\.providerAccounts\.status\.update/);
  const mutationRequestSchema = contractSource.slice(
    contractSource.indexOf("name: CommercePaymentProviderAccountMutationRequest"),
    contractSource.indexOf("response_schema: &commercePaymentProviderAccountMutationResponse"),
  );
  assert.match(mutationRequestSchema, /- providerCode/);
  assert.doesNotMatch(mutationRequestSchema, /- accountNo/);
  assert.doesNotMatch(mutationRequestSchema, /\baccountNo:/);
  assert.match(viewSource, /admin\.commerce\.payments\.providerAccounts\.rotatedAt/);
  assert.match(viewSource, /rotatedAt: form\.rotatedAt\.trim\(\)/);
  assert.match(adminResourceCenterSource, /isVisible\?: \(record: AdminResourceRecord\) => boolean/);
  assert.match(adminResourceCenterSource, /recordRowActions\.filter\(\(action\) => action\.isVisible\?\.\(record\) \?\? true\)\.map/);
  assert.match(viewSource, /ConfirmDialog/);
  assert.match(viewSource, /providerAccountDeleteConfirmation/);
  assert.match(viewSource, /executeConfirmedProviderAccountDelete/);
  assert.match(viewSource, /data-admin-payment-provider-account-feedback/);
  assert.doesNotMatch(viewSource, /window\.confirm/);
  assert.match(viewSource, /providerAccounts\.actions\.enable', 'Enable'/);
  assert.match(viewSource, /providerAccounts\.actions\.setAvailable', 'Set available'/);
  assert.match(viewSource, /updateProviderAccountStatus\(record, 'inactive'\)/);
  assert.match(viewSource, /updateProviderAccountStatus\(record, 'active'\)/);
  assert.match(viewSource, /updateProviderAccountStatus\(record, 'disabled'\)/);
  assert.match(viewSource, /isVisible: \(record\) => readRecordText\(record, 'status'\) === 'disabled'/);
  assert.match(viewSource, /isVisible: \(record\) => readRecordText\(record, 'status'\) === 'inactive'/);
  assert.match(viewSource, /isVisible: \(record\) => \['active', 'inactive'\]\.includes\(readRecordText\(record, 'status'\)\)/);
  assert.match(viewSource, /providerAccounts\.status\.setAvailableSuccess', 'Provider account is now the available account/);
  assert.match(viewSource, /providerAccounts\.status\.enableSuccess', 'Provider account enabled as a standby account/);
  for (const key of [
    "admin.commerce.payments.providerAccounts.accountNo",
    "admin.commerce.payments.providerAccounts.status",
    "admin.commerce.payments.providerAccounts.channelScope",
    "admin.commerce.payments.providerAccounts.availability",
    "admin.commerce.payments.providerAccounts.availability.activeOnly",
    "admin.commerce.payments.providerAccounts.availability.standby",
    "admin.commerce.payments.providerAccounts.availability.disabled",
    "admin.commerce.payments.providerAccounts.accountRole",
    "admin.commerce.payments.providerAccounts.accountRole.merchant",
    "admin.commerce.payments.providerAccounts.accountRole.serviceProvider",
    "admin.commerce.payments.providerAccounts.credentials.paymentApiKey",
    "admin.commerce.payments.providerAccounts.credentials.paymentClientId",
    "admin.commerce.payments.providerAccounts.credentials.paymentClientSecret",
    "admin.commerce.payments.providerAccounts.credentials.uploadFile",
    "admin.commerce.payments.providerAccounts.credentials.fileReadError",
    "admin.commerce.payments.providerAccounts.credentials.requiredProgress",
    "admin.commerce.payments.providerAccounts.credentials.setupGuide",
    "admin.commerce.payments.providerAccounts.credentials.placeholder.privateKey",
    "admin.commerce.payments.providerAccounts.credentials.placeholder.stripeSecretKey",
    "admin.commerce.payments.providerAccounts.merchantId.wechatPayMerchant",
    "admin.commerce.payments.providerAccounts.merchantId.wechatPayServiceProvider",
    "admin.commerce.payments.providerAccounts.merchantId.alipay",
    "admin.commerce.payments.providerAccounts.merchantId.stripe",
    "admin.commerce.payments.providerAccounts.credentials.source.wechatPay",
    "admin.commerce.payments.providerAccounts.credentials.source.alipay",
    "admin.commerce.payments.providerAccounts.credentials.source.paypal",
    "admin.commerce.payments.providerAccounts.credentials.source.stripe",
    "admin.commerce.payments.providerAccounts.credentials.credentialMode",
    "admin.commerce.payments.providerAccounts.credentials.credentialMode.rsa",
    "admin.commerce.payments.providerAccounts.credentials.credentialMode.aes",
    "admin.commerce.payments.providerAccounts.credentials.rsaPrivateKey",
    "admin.commerce.payments.providerAccounts.credentials.rsaPublicKey",
    "admin.commerce.payments.providerAccounts.credentials.aesKey",
    "admin.commerce.payments.providerAccounts.credentials.webhookSigningKey",
    "admin.commerce.payments.providerAccounts.credentials.certificateSerialNo",
    "admin.commerce.payments.providerAccounts.credentials.profile.wechatPay",
    "admin.commerce.payments.providerAccounts.credentials.profile.wechatPay.desc",
    "admin.commerce.payments.providerAccounts.credentials.profile.alipay",
    "admin.commerce.payments.providerAccounts.credentials.profile.alipay.desc",
    "admin.commerce.payments.providerAccounts.credentials.profile.paypal",
    "admin.commerce.payments.providerAccounts.credentials.profile.paypal.desc",
    "admin.commerce.payments.providerAccounts.credentials.profile.stripe",
    "admin.commerce.payments.providerAccounts.credentials.profile.stripe.desc",
    "admin.commerce.payments.providerAccounts.credentials.profile.applePay",
    "admin.commerce.payments.providerAccounts.credentials.profile.googlePay",
    "admin.commerce.payments.providerAccounts.credentials.wechatPayApiV3Key",
    "admin.commerce.payments.providerAccounts.credentials.alipayAppId",
    "admin.commerce.payments.providerAccounts.credentials.stripeSecretKey",
    "admin.commerce.payments.providerAccounts.credentials.paypalClientId",
    "admin.commerce.payments.providerAccounts.credentials.paypalClientSecret",
    "admin.commerce.payments.providerAccounts.note",
    "admin.commerce.payments.providerAccounts.rotatedAt",
    "admin.commerce.payments.providerAccounts.actions.edit",
    "admin.commerce.payments.providerAccounts.actions.enable",
    "admin.commerce.payments.providerAccounts.actions.setAvailable",
    "admin.commerce.payments.providerAccounts.actions.disable",
    "admin.commerce.payments.providerAccounts.actions.delete",
    "admin.commerce.payments.providerAccounts.deleteTitle",
    "admin.commerce.payments.providerAccounts.deleteConfirm",
    "admin.commerce.payments.providerAccounts.environment.sandbox",
    "admin.commerce.payments.providerAccounts.environment.production",
    "admin.commerce.payments.providerAccounts.status.active",
    "admin.commerce.payments.providerAccounts.status.inactive",
    "admin.commerce.payments.providerAccounts.status.disabled",
    "admin.commerce.payments.providerAccounts.status.enableNote",
    "admin.commerce.payments.providerAccounts.status.setAvailableNote",
    "admin.commerce.payments.providerAccounts.status.enableSuccess",
    "admin.commerce.payments.providerAccounts.status.setAvailableSuccess",
    "admin.commerce.payments.providerAccounts.providerOptionsEmpty",
    "admin.commerce.payments.providerAccounts.providerOptionsError",
  ]) {
    assert.match(i18nSource, new RegExp(`"${escapeRegExp(key)}"`));
  }
  assert.doesNotMatch(
    viewSource,
    /PaymentProviderAccountInput label=\{t\('admin\.commerce\.payments\.providerAccounts\.accountNo'/,
  );
  assert.doesNotMatch(
    viewSource,
    /PaymentProviderAccountInput label=\{t\('admin\.commerce\.payments\.providerAccounts\.providerCode'/,
  );
  assert.doesNotMatch(
    viewSource,
    /PaymentProviderAccountInput label=\{t\('admin\.commerce\.payments\.providerAccounts\.environment'/,
  );
  assert.doesNotMatch(
    viewSource,
    /PaymentProviderAccountInput label=\{t\('admin\.commerce\.payments\.providerAccounts\.status'/,
  );
  assert.doesNotMatch(
    viewSource,
    /PaymentProviderAccountInput label=\{t\('admin\.commerce\.payments\.providerAccounts\.secretRef'/,
  );
  assert.doesNotMatch(
    viewSource,
    /PaymentProviderAccountInput label=\{t\('admin\.commerce\.payments\.providerAccounts\.webhookSecretRef'/,
  );
  assert.doesNotMatch(
    viewSource,
    /PaymentProviderAccountInput label=\{t\('admin\.commerce\.payments\.providerAccounts\.certificateRef'/,
  );
  assert.doesNotMatch(viewSource, /provider\.providerType, provider\.settlementType, provider\.status/);
  assert.match(serviceSource, /backendPaymentsProviderAccountsUpdate/);
  assert.match(serviceSource, /backendPaymentsProviderAccountsDelete/);
  assert.match(serviceSource, /backendPaymentsProviderAccountsStatusUpdate/);
  assert.match(serviceSource, /getSdkworkCommerceService\(\)\.admin\.payments\.providerAccounts\.update/);
  assert.match(serviceSource, /getSdkworkCommerceService\(\)\.admin\.payments\.providerAccounts\.delete/);
  assert.match(serviceSource, /getSdkworkCommerceService\(\)\.admin\.payments\.providerAccounts\.status\.update/);
  assert.match(backendCommerceSdk, /class PaymentsProviderAccountsStatusApi/);
  assert.match(backendCommerceSdk, /async update\(providerAccountId: string/);
  assert.match(backendCommerceSdk, /async delete\(providerAccountId: string/);
  assert.match(backendCommerceSdk, /public readonly status: PaymentsProviderAccountsStatusApi/);
  assert.match(backendCommerceSdk, /class PaymentsRuntimeSnapshotApi/);
  assert.match(backendCommerceSdk, /public readonly snapshot: PaymentsRuntimeSnapshotApi/);
  assert.doesNotMatch(serviceSource, /\bfetch\s*\(|axios|XMLHttpRequest/);
});

test("admin payments center table columns match payment SDK list item contracts", () => {
  const viewSource = readPortalFile("./packages/sdkwork-clawrouter-pc-admin-payments/src/index.tsx");
  const i18nSource = [
    readPortalFile("./packages/sdkwork-clawrouter-pc-i18n/src/resources/admin-commerce/payments.ts"),
    readPortalFile("./packages/sdkwork-clawrouter-pc-i18n/src/resources/admin/core-columns.ts"),
  ].join("\n");

  assertPaymentSectionColumns(viewSource, "providers", [
    "providerCode",
    "displayName",
    "providerType",
    "supportedCountries",
    "supportedCurrencies",
    "capabilities",
    "status",
    "updatedAt",
  ]);
  assertPaymentSectionColumns(viewSource, "providerAccounts", [
    "accountNo",
    "providerCode",
    "accountRole",
    "merchantId",
    "environment",
    "countryCode",
    "settlementCurrency",
    "status",
    "rotatedAt",
    "note",
    "updatedAt",
  ]);
  assertPaymentSectionColumns(viewSource, "methods", [
    "methodCode",
    "displayName",
    "methodType",
    "providerCode",
    "checkoutScenes",
    "sortOrder",
    "status",
    "updatedAt",
  ]);
  assertPaymentSectionColumns(viewSource, "channels", [
    "channelNo",
    "methodCode",
    "providerCode",
    "providerAccountId",
    "sceneCode",
    "countryCode",
    "currencyCode",
    "priority",
    "status",
    "updatedAt",
  ]);
  assertPaymentSectionColumns(viewSource, "routeRules", [
    "ruleNo",
    "methodCode",
    "sceneCode",
    "countryCode",
    "currencyCode",
    "channelId",
    "fallbackEnabled",
    "priority",
    "status",
    "updatedAt",
  ]);
  assertPaymentSectionColumns(viewSource, "intents", [
    "intentNo",
    "orderId",
    "subjectType",
    "methodCode",
    "providerCode",
    "amount",
    "currencyCode",
    "status",
    "createdAt",
    "updatedAt",
  ]);
  assertPaymentSectionColumns(viewSource, "attempts", [
    "attemptNo",
    "intentId",
    "methodCode",
    "providerCode",
    "externalTradeNo",
    "amount",
    "currencyCode",
    "status",
    "paidAt",
    "createdAt",
    "updatedAt",
  ]);
  assertPaymentSectionColumns(viewSource, "webhookEvents", [
    "eventNo",
    "providerCode",
    "eventType",
    "externalEventId",
    "processStatus",
    "receivedAt",
    "processedAt",
  ]);
  assertPaymentSectionColumns(viewSource, "reconciliationRuns", [
    "runNo",
    "providerCode",
    "businessDate",
    "status",
    "createdAt",
    "finishedAt",
  ]);

  for (const key of [
    "admin.col.scene",
    "admin.col.fallback",
    "admin.col.externalTrade",
    "admin.col.externalEvent",
    "admin.col.paid",
    "admin.col.processed",
    "admin.col.countries",
    "admin.col.currencies",
    "admin.col.capabilities",
    "admin.col.scenes",
    "admin.col.rotated",
  ]) {
    assert.match(i18nSource, new RegExp(`"${escapeRegExp(key)}"`));
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
    qrCodePayload: "https://pay.example.com/cashier/recharge-order-1",
  };
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function adminServiceFileName(packageName: string): string {
  switch (packageName) {
    case "sdkwork-clawrouter-pc-admin-catalog":
      return "catalogService.ts";
    case "sdkwork-clawrouter-pc-admin-inventory":
      return "inventoryService.ts";
    case "sdkwork-clawrouter-pc-admin-orders":
      return "ordersService.ts";
    case "sdkwork-clawrouter-pc-admin-payments":
      return "paymentsService.ts";
    case "sdkwork-clawrouter-pc-admin-memberships":
      return "membershipsService.ts";
    case "sdkwork-clawrouter-pc-admin-wallet":
      return "walletService.ts";
    case "sdkwork-clawrouter-pc-admin-finance":
      return "financeService.ts";
    default:
      throw new Error(`Unknown admin package ${packageName}`);
  }
}

function assertPaymentSectionColumns(source: string, sectionId: string, expectedKeys: readonly string[]): void {
  const sectionSource = paymentSectionSource(source, sectionId);
  for (const key of expectedKeys) {
    assert.match(sectionSource, new RegExp(`key: '${escapeRegExp(key)}'`));
  }
}

function paymentSectionSource(source: string, sectionId: string): string {
  const startToken = `id: '${sectionId}'`;
  const start = source.indexOf(startToken);
  assert.notEqual(start, -1, `payment section ${sectionId} must exist`);
  const next = source.indexOf("\n    {\n      id: '", start + startToken.length);
  return next === -1 ? source.slice(start) : source.slice(start, next);
}

function requestPath(url: string | undefined): string {
  assert.ok(url, "captured request URL is required");
  return url.split("?", 1)[0] ?? url;
}
