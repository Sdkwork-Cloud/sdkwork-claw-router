import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { clearStoredAppSessionToken } from "./packages/sdkwork-claw-router-commons/src/app-session-token.ts";
import { resetClawRouterSdkClients } from "./packages/sdkwork-claw-router-commons/src/sdk-clients.ts";
import { MarketingService } from "./packages/sdkwork-claw-router-admin-marketing/src/marketingService.ts";

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

test("admin marketing package owns referral growth analytics only", () => {
  const appSource = readPortalFile("./src/App.tsx");
  const packageJson = readPortalFile("./package.json");
  const packageSource = readPortalFile("./packages/sdkwork-claw-router-admin-marketing/src/index.tsx");
  const serviceSource = readPortalFile("./packages/sdkwork-claw-router-admin-marketing/src/marketingService.ts");

  assert.match(appSource, /import\('sdkwork-claw-router-admin-marketing'\)/);
  assert.match(appSource, /<Route path="marketing" element=\{<MarketingAdmin \/>\} \/>/);
  assert.match(packageJson, /"sdkwork-claw-router-admin-marketing": "workspace:\*"/);

  assert.match(packageSource, /Referral Stats/);
  assert.match(packageSource, /MarketingService\.fetchReferralStats/);
  assert.match(serviceSource, /getClawRouterBackendSdkClient\(\)\.system\.marketing\.referralStats\.list\(\)/);

  for (const retiredResponsibility of [
    "createRechargePackage",
    "listRechargePackages",
    "fetchRechargeRecords",
    "createCoupon",
    "fetchCoupons",
    "coupon_batches",
    "billing/recharges",
    "payments",
    "orders",
  ]) {
    assert.doesNotMatch(packageSource, new RegExp(escapeRegExp(retiredResponsibility)));
    assert.doesNotMatch(serviceSource, new RegExp(escapeRegExp(retiredResponsibility)));
  }
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
  const walletSource = readPortalFile("./packages/sdkwork-claw-router-admin-wallet/src/index.tsx");
  const paymentsSource = readPortalFile("./packages/sdkwork-claw-router-admin-payments/src/index.tsx");
  const ordersSource = readPortalFile("./packages/sdkwork-claw-router-admin-orders/src/index.tsx");
  const routeClassification = readPortalFile("../../docs/schema-registry/frontend-route-classification.yaml");

  assert.match(walletSource, /backendRechargesPackagesList/);
  assert.match(walletSource, /backendWalletLedgerEntriesList/);
  assert.match(paymentsSource, /PaymentsAdmin/);
  assert.match(ordersSource, /OrdersAdmin/);

  assert.match(routeClassification, /route: \/admin\/wallet[\s\S]*package: sdkwork-claw-router-admin-wallet/);
  assert.match(routeClassification, /route: \/admin\/payments[\s\S]*package: sdkwork-claw-router-admin-payments/);
  assert.match(routeClassification, /route: \/admin\/orders[\s\S]*package: sdkwork-claw-router-admin-orders/);
  assert.doesNotMatch(routeClassification, /route: \/admin\/commerce/);
  assert.doesNotMatch(routeClassification, /route: \/admin\/billing/);
  assert.doesNotMatch(routeClassification, /route: \/admin\/vip/);
});

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
