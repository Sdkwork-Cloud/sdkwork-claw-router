import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

import { clearStoredAppSessionToken } from "./packages/sdkwork-clawrouter-pc-commons/src/app-session-token.ts";
import { resetClawRouterSdkClients } from "./packages/sdkwork-clawrouter-pc-commons/src/sdk-clients.ts";
import {
  MarketingService,
  backendPromotionCodeRedemptionsList,
  backendPromotionOffersList,
} from "./packages/sdkwork-clawrouter-pc-admin-marketing/src/marketingService.ts";

type CapturedBackendRequest = {
  body?: unknown;
  method: string;
  url: string;
};

const originalFetch = globalThis.fetch;
const originalWindowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");

function readPortalFile(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

async function withBackendSdkResponse<T>(
  responseBody: unknown,
  fn: (captured: CapturedBackendRequest[]) => Promise<T>,
): Promise<T> {
  const captured: CapturedBackendRequest[] = [];
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    enumerable: true,
    value: {},
  });
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    captured.push({
      body: init?.body ? JSON.parse(String(init.body)) : undefined,
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

test("admin marketing package owns standardized promotion lifecycle and referral analytics", () => {
  const appSource = readPortalFile("./src/App.tsx");
  const packageJson = readPortalFile("./package.json");
  const packageSource = readPortalFile("./packages/sdkwork-clawrouter-pc-admin-marketing/src/index.tsx");
  const serviceSource = readPortalFile("./packages/sdkwork-clawrouter-pc-admin-marketing/src/marketingService.ts");
  const backendPromotionContract = readPortalFile("../../docs/schema-registry/frontend-field-contracts/operations/backend-promotion.yaml");
  const legacyMarketingFormExists = existsSync(new URL(
    "./packages/sdkwork-clawrouter-pc-admin-marketing/src/marketingForm.ts",
    import.meta.url,
  ));

  assert.match(appSource, /import\('sdkwork-clawrouter-pc-admin-marketing'\)/);
  assert.match(appSource, /<Route path="marketing" element=\{<MarketingAdmin \/>\} \/>/);
  assert.match(appSource, /<Route path="marketing\/offers" element=\{<MarketingAdmin sectionId="promotionOffers" \/>\} \/>/);
  assert.match(appSource, /<Route path="marketing\/promotion-coupon-stocks" element=\{<MarketingAdmin sectionId="promotionCouponStocks" \/>\} \/>/);
  assert.match(appSource, /<Route path="marketing\/promotion-codes" element=\{<MarketingAdmin sectionId="promotionCodes" \/>\} \/>/);
  assert.match(appSource, /<Route path="marketing\/promotion-code-redemptions" element=\{<MarketingAdmin sectionId="promotionCodeRedemptions" \/>\} \/>/);
  assert.match(appSource, /<Route path="marketing\/promotion-coupon-ledger" element=\{<MarketingAdmin sectionId="promotionCouponLedger" \/>\} \/>/);
  assert.doesNotMatch(appSource, /marketing\/coupon-stocks|marketing\/coupon-ledger|marketing\/coupon-codes|marketing\/coupon-code-redemptions|sectionId="couponStocks"|sectionId="couponLedger"|sectionId="couponCodes"|sectionId="couponCodeRedemptions"/);
  assert.doesNotMatch(appSource, /marketing\/codes/);
  assert.doesNotMatch(appSource, /marketing\/code-redemptions/);
  assert.match(packageJson, /"sdkwork-clawrouter-pc-admin-marketing": "workspace:\*"/);

  assert.match(packageSource, /AdminResourceCenter/);
  assert.match(packageSource, /promotionOffers/);
  assert.match(packageSource, /promotionCouponStocks/);
  assert.match(packageSource, /promotionCodes/);
  assert.match(packageSource, /promotionCodeRedemptions/);
  assert.match(packageSource, /promotionCouponLedger/);
  assert.doesNotMatch(packageSource, /couponStocks|couponLedger|couponCodes|couponCodeRedemptions/);
  assert.match(packageSource, /Referral Stats/);
  assert.match(packageSource, /backendPromotionOffersList/);
  assert.match(packageSource, /backendPromotionCodeRedemptionsList/);
  assert.match(packageSource, /MarketingService\.fetchReferralStats/);
  assert.match(serviceSource, /getClawRouterBackendSdkClient\(\)\.system\.promotions\.offers\.management\.list/);
  assert.match(serviceSource, /getClawRouterBackendSdkClient\(\)\.system\.promotions\.codes\.redemptions\.list/);
  assert.match(serviceSource, /getClawRouterBackendSdkClient\(\)\.system\.marketing\.referralStats\.list\(\)/);
  assert.equal(legacyMarketingFormExists, false, "admin marketing must not keep legacy coupon form helpers");
  assert.match(backendPromotionContract, /summary:\s*Promotion Coupon Codes List/);
  assert.match(backendPromotionContract, /summary:\s*Promotion Coupon Code Redemptions List/);
  assert.doesNotMatch(backendPromotionContract, /summary:\s*Promotion Codes List/);
  assert.doesNotMatch(backendPromotionContract, /summary:\s*Promotion Code Redemptions List/);
  assertMarketingSectionUsesColumns(packageSource, "promotionOffers", [
    "offer_no",
    "offer_code",
    "name",
    "offer_type",
    "audience_scope",
    "combinability",
    "status",
    "starts_at",
    "ends_at",
  ]);
  assertMarketingSectionOmitsColumns(packageSource, "promotionOffers", [
    "currency_code",
    "minimum_order_amount_minor",
  ]);

  assertMarketingSectionUsesColumns(packageSource, "promotionCouponStocks", [
    "stock_no",
    "code_mode",
    "issue_channel",
    "currency_code",
    "available_quantity",
    "claimed_quantity",
    "activation_status",
    "can_resend",
    "status",
  ]);
  assertMarketingSectionUsesColumns(packageSource, "promotionCodes", [
    "code_no",
    "promotion_code_last4",
    "claim_code_suffix",
    "stock_id",
    "code_type",
    "currency_code",
    "claimed_quantity",
    "activation_status",
    "can_resend",
    "status",
  ]);
  assertMarketingSectionOmitsColumns(packageSource, "promotionCodes", [
    "code_batch_no",
    "redeemed_quantity",
    "redeemed_at",
  ]);
  assertMarketingSectionUsesColumns(packageSource, "promotionCodeRedemptions", [
    "redemption_no",
    "submitted_code_suffix",
    "stock_id",
    "owner_user_id",
    "currency_code",
    "result_status",
    "failure_code",
    "redemption_channel",
    "occurred_at",
  ]);
  assertMarketingSectionOmitsColumns(packageSource, "promotionCodeRedemptions", [
    "id",
    "status",
    "redeemed_at",
  ]);
  assertMarketingSectionUsesColumns(packageSource, "userCoupons", [
    "coupon_no",
    "coupon_code_suffix",
    "claim_code_suffix",
    "owner_user_id",
    "face_value_minor",
    "currency_code",
    "verify_method",
    "activation_status",
    "status",
    "expires_at",
  ]);
  assertMarketingSectionUsesColumns(packageSource, "externalBindings", [
    "binding_no",
    "platform",
    "platform_template_id",
    "platform_stock_id",
    "platform_coupon_id",
    "claim_code_suffix",
    "external_currency_code",
    "sync_status",
    "last_sync_at",
  ]);
  assertMarketingSectionOmitsColumns(packageSource, "externalBindings", [
    "external_object_type",
    "external_object_id",
  ]);
  assertMarketingSectionUsesColumns(packageSource, "discountApplications", [
    "application_no",
    "order_no",
    "user_coupon_id",
    "discount_amount_minor",
    "currency_code",
    "status",
    "failure_code",
    "settled_at",
  ]);
  assertMarketingSectionOmitsColumns(packageSource, "discountApplications", [
    "id",
  ]);
  assertMarketingSectionUsesColumns(packageSource, "discountAllocations", [
    "application_id",
    "order_id",
    "order_item_id",
    "sku_id",
    "allocation_amount_minor",
    "currency_code",
    "allocation_ratio_bps",
    "created_at",
  ]);
  assertMarketingSectionOmitsColumns(packageSource, "discountAllocations", [
    "id",
  ]);
  assertMarketingSectionUsesColumns(packageSource, "promotionCouponLedger", [
    "ledger_no",
    "business_type",
    "direction",
    "stock_id",
    "user_coupon_id",
    "quantity_delta",
    "balance_after",
    "occurred_at",
  ]);
  assertMarketingSectionOmitsColumns(packageSource, "promotionCouponLedger", [
    "id",
  ]);
  assertMarketingSectionUsesColumns(packageSource, "budgetLedger", [
    "ledger_no",
    "budget_account_id",
    "business_type",
    "direction",
    "amount_delta_minor",
    "balance_amount_minor",
    "currency_code",
    "occurred_at",
  ]);
  assertMarketingSectionOmitsColumns(packageSource, "budgetLedger", [
    "id",
  ]);
  assertMarketingSectionUsesColumns(packageSource, "promotionEvents", [
    "event_no",
    "event_type",
    "aggregate_type",
    "aggregate_id",
    "event_version",
    "status",
    "occurred_at",
    "published_at",
    "next_retry_at",
  ]);
  assertMarketingSectionOmitsColumns(packageSource, "promotionEvents", [
    "id",
    "retry_count",
  ]);

  for (const retiredResponsibility of [
    "backendCoupons",
    "commerce.coupons",
    "createRechargePackage",
    "listRechargePackages",
    "fetchRechargeRecords",
    "createCoupon",
    "fetchCoupons",
    "coupon_batches",
    "couponTemplates",
    "couponCampaigns",
    "billing/recharges",
  ]) {
    assert.doesNotMatch(packageSource, new RegExp(escapeRegExp(retiredResponsibility)));
    assert.doesNotMatch(serviceSource, new RegExp(escapeRegExp(retiredResponsibility)));
  }
});

test("admin marketing service reads promotion lifecycle records through generated backend SDKs", async () => {
  await withBackendSdkResponse(
    {
      code: "2000",
      data: {
        items: [{ id: "offer-1", status: "active" }],
      },
    },
    async (captured) => {
      const offers = await backendPromotionOffersList({ page: 1, pageSize: 100, status: "active" });

      assert.deepEqual(offers, [{ id: "offer-1", status: "active" }]);
      assert.equal(captured.length, 1);
      assert.equal(captured[0]?.method, "GET");
      assert.equal(requestPath(captured[0]?.url), "/backend/v3/api/promotions/offers");
      assert.match(captured[0]?.url ?? "", /page=1/);
      assert.match(captured[0]?.url ?? "", /page_size=100/);
      assert.match(captured[0]?.url ?? "", /status=active/);
    },
  );

  await withBackendSdkResponse(
    {
      code: "2000",
      data: {
        items: [{ id: "redemption-1", status: "redeemed" }],
      },
    },
    async (captured) => {
      const redemptions = await backendPromotionCodeRedemptionsList({ codeStatus: "redeemed" });

      assert.deepEqual(redemptions, [{ id: "redemption-1", status: "redeemed" }]);
      assert.equal(captured.length, 1);
      assert.equal(captured[0]?.method, "GET");
      assert.equal(requestPath(captured[0]?.url), "/backend/v3/api/promotions/codes/redemptions");
      assert.match(captured[0]?.url ?? "", /code_status=redeemed/);
    },
  );
});

test("admin marketing service reads referral stats through the generated backend SDK", async () => {
  await withBackendSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            id: "referral-1",
            inviter: "Ada",
            total_invited: 12,
            total_revenue: "1888.50",
            bonus_awarded: "188.85",
            link: "https://example.test/r/ada",
          },
        ],
      },
    },
    async (captured) => {
      const stats = await MarketingService.fetchReferralStats();

      assert.equal(captured.length, 1);
      assert.equal(captured[0]?.method, "GET");
      assert.equal(captured[0]?.url, "/backend/v3/api/system/marketing/referral_stats");
      assert.deepEqual(stats, [
        {
          id: "referral-1",
          inviter: "Ada",
          total_invited: 12,
          total_revenue: "1888.50",
          bonus_awarded: "188.85",
          link: "https://example.test/r/ada",
        },
      ]);
    },
  );
});

test("admin marketing service fails closed when referral rows omit required fields", async () => {
  for (const [field, message] of [
    ["id", /Referral stat id is required/],
    ["inviter", /Referral inviter is required/],
    ["total_invited", /Referral invited total is required/],
    ["total_revenue", /Referral revenue is required/],
    ["bonus_awarded", /Referral bonus is required/],
    ["link", /Referral link is required/],
  ] as const) {
    await withBackendSdkResponse(
      {
        code: "2000",
        data: {
          items: [
            (() => {
              const row = {
                id: "referral-1",
                inviter: "Ada",
                total_invited: 12,
                total_revenue: "1888.50",
                bonus_awarded: "188.85",
                link: "https://example.test/r/ada",
              } as Record<string, unknown>;
              delete row[field];
              return row;
            })(),
          ],
        },
      },
      async () => {
        await assert.rejects(
          () => MarketingService.fetchReferralStats(),
          message,
        );
      },
    );
  }
});

test("admin marketing package path governance keeps recharge and payment capabilities in their business owners", () => {
  const walletSource = readPortalFile("./packages/sdkwork-clawrouter-pc-admin-wallet/src/index.tsx");
  const paymentsSource = readPortalFile("./packages/sdkwork-clawrouter-pc-admin-payments/src/index.tsx");
  const ordersSource = readPortalFile("./packages/sdkwork-clawrouter-pc-admin-orders/src/index.tsx");
  const routeClassification = readPortalFile("../../docs/schema-registry/frontend-route-classification.yaml");

  assert.doesNotMatch(walletSource, /backendRechargesPackagesList/);
  assert.doesNotMatch(walletSource, /rechargePackages/);
  assert.match(walletSource, /backendWalletLedgerEntriesList/);
  assert.match(paymentsSource, /PaymentsAdmin/);
  assert.match(ordersSource, /OrdersAdmin/);

  assert.match(routeClassification, /route: \/admin\/wallet[\s\S]*package: sdkwork-clawrouter-pc-admin-wallet/);
  assert.doesNotMatch(routeClassification, /route: \/admin\/wallet\/recharge-packages/);
  assert.match(routeClassification, /route: \/admin\/memberships\/recharge-packages[\s\S]*package: sdkwork-clawrouter-pc-admin-memberships/);
  assert.match(routeClassification, /route: \/admin\/payments[\s\S]*package: sdkwork-clawrouter-pc-admin-payments/);
  assert.match(routeClassification, /route: \/admin\/orders[\s\S]*package: sdkwork-clawrouter-pc-admin-orders/);
  assert.doesNotMatch(routeClassification, /route: \/admin\/commerce/);
  assert.doesNotMatch(routeClassification, /route: \/admin\/billing/);
  assert.doesNotMatch(routeClassification, /route: \/admin\/vip/);
});

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function assertMarketingSectionUsesColumns(source: string, sectionId: string, columns: string[]): void {
  const sectionSource = readMarketingSectionSource(source, sectionId);
  for (const column of columns) {
    assert.match(sectionSource, columnKeyPattern(column), `${sectionId} must show ${column}`);
  }
}

function assertMarketingSectionOmitsColumns(source: string, sectionId: string, columns: string[]): void {
  const sectionSource = readMarketingSectionSource(source, sectionId);
  for (const column of columns) {
    assert.doesNotMatch(sectionSource, columnKeyPattern(column), `${sectionId} must not show ${column}`);
  }
}

function readMarketingSectionSource(source: string, sectionId: string): string {
  const marker = `id: '${sectionId}'`;
  const start = source.indexOf(marker);
  assert.notEqual(start, -1, `marketing section ${sectionId} is required`);
  const nextSectionStart = source.indexOf("\n    {\n      id:", start + marker.length);
  const sectionsEnd = source.indexOf("\n  ];", start + marker.length);
  const end = nextSectionStart === -1 ? sectionsEnd : nextSectionStart;
  assert.notEqual(end, -1, `marketing section ${sectionId} source boundary is required`);
  return source.slice(start, end);
}

function columnKeyPattern(column: string): RegExp {
  return new RegExp(`key:\\s*'${escapeRegExp(column)}'`);
}

function requestPath(url: string | undefined): string {
  assert.ok(url, "captured request URL is required");
  return url.split("?", 1)[0] ?? url;
}
