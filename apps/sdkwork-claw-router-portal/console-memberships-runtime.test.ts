import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { clearStoredAppSessionToken } from "./packages/sdkwork-claw-router-commons/src/app-session-token.ts";
import { resetClawRouterSdkClients } from "./packages/sdkwork-claw-router-commons/src/sdk-clients.ts";
import { resources } from "./packages/sdkwork-claw-router-i18n/src/resources/index.ts";
import { MembershipService } from "./packages/sdkwork-claw-router-console-memberships/src/membershipService.ts";

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

async function withMembershipSdkResponses<T>(
  responder: (path: string, request: CapturedSdkRequest) => unknown,
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
    const request = {
      body: typeof init?.body === "string" ? init.body : "",
      method: init?.method ?? "GET",
      url,
    };
    captured.push(request);
    return new Response(JSON.stringify(responder(requestPath(url), request)), {
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

test("console membership service loads the complete app SDK membership overview", async () => {
  await withMembershipSdkResponses(
    (path) => {
      if (path === "/app/v3/api/memberships/current") {
        return {
          code: "2000",
          data: {
            membership_no: "MEM-2026-001",
            plan_id: "501",
            plan_name: "Pro",
            status: "active",
            starts_at: "2026-05-21T00:00:00Z",
            expires_at: "2027-05-21T00:00:00Z",
          },
        };
      }
      if (path === "/app/v3/api/memberships/package_groups") {
        return {
          code: "2000",
          data: {
            items: [
              {
                id: 2,
                group_no: "annual",
                name: "Annual packages",
                description: "Yearly billing",
                sort_weight: 20,
                status: "active",
              },
            ],
          },
        };
      }
      if (path === "/app/v3/api/memberships/package_groups/2/packages") {
        return {
          code: "2000",
          data: {
            items: [
              {
                id: 401,
                package_no: "vip-pro-year",
                package_group_id: 2,
                plan_id: "501",
                plan_name: "Pro",
                sku_id: "sku-pro-year",
                price_amount: "199.00",
                currency_code: "CNY",
                duration_days: "365",
                recurrence_cycle: "yearly",
                status: "active",
              },
            ],
          },
        };
      }
      if (path === "/app/v3/api/memberships/benefits") {
        return {
          code: "2000",
          data: {
            items: [
              {
                entitlement_code: "fast_lane",
                name: "Fast lane",
                quota_amount: "100",
                quota_period: "month",
                reset_policy: "calendar_month",
                status: "active",
              },
            ],
          },
        };
      }
      if (path === "/app/v3/api/memberships/points/balance") {
        return { code: "2000", data: { item: { balance: "8800", status: "active" } } };
      }
      if (path === "/app/v3/api/memberships/points/history") {
        return {
          code: "2000",
          data: {
            items: [
              {
                id: "points-1",
                title: "Daily reward",
                amount: "50",
                occurred_at: "2026-05-21T01:02:03Z",
                status: "success",
              },
            ],
          },
        };
      }
      if (path === "/app/v3/api/memberships/points/daily_rewards/status") {
        return { code: "2000", data: { item: { available: true, reward_points: "50", status: "available" } } };
      }
      if (path === "/app/v3/api/memberships/privileges/usage") {
        return {
          code: "2000",
          data: {
            item: {
              speed_up_available: true,
              speed_up_remaining: "3",
              items: [
                {
                  code: "fast_lane",
                  name: "Fast lane",
                  used_amount: "4",
                  quota_amount: "100",
                  balance_after: "96",
                },
              ],
            },
          },
        };
      }
      return { code: "2000", data: { items: [] } };
    },
    async (captured) => {
      const overview = await MembershipService.fetchMembershipOverview();

      assert.equal(overview.summary?.membershipNo, "MEM-2026-001");
      assert.equal(overview.summary?.planName, "Pro");
      assert.equal(overview.packageGroups.length, 1);
      assert.equal(overview.packageGroups[0]?.id, "2");
      assert.equal(overview.packageGroups[0]?.packages[0]?.id, "401");
      assert.equal(overview.packageGroups[0]?.packages[0]?.planName, "Pro");
      assert.equal(overview.benefits[0]?.code, "fast_lane");
      assert.equal(overview.pointsBalance.balance, 8800);
      assert.equal(overview.pointsHistory[0]?.amount, "50");
      assert.equal(overview.dailyReward.available, true);
      assert.equal(overview.privilegeUsage.speedUpAvailable, true);
      assert.equal(overview.privilegeUsage.items[0]?.remaining, "96");

      const paths = captured.map((request) => requestPath(request.url));
      assert.deepEqual(paths, [
        "/app/v3/api/memberships/current",
        "/app/v3/api/memberships/package_groups",
        "/app/v3/api/memberships/benefits",
        "/app/v3/api/memberships/points/balance",
        "/app/v3/api/memberships/points/history",
        "/app/v3/api/memberships/points/daily_rewards/status",
        "/app/v3/api/memberships/privileges/usage",
        "/app/v3/api/memberships/package_groups/2/packages",
      ]);
    },
  );
});

test("console membership service keeps overview loaded when optional panels are unavailable", async () => {
  await withMembershipSdkResponses(
    (path) => {
      if (path === "/app/v3/api/memberships/current") {
        return { code: "2000", data: {} };
      }
      if (path === "/app/v3/api/memberships/package_groups") {
        return {
          code: "2000",
          data: {
            items: [
              {
                id: 2,
                group_no: "annual",
                name: "Annual packages",
                status: "active",
              },
            ],
          },
        };
      }
      if (path === "/app/v3/api/memberships/package_groups/2/packages") {
        return {
          code: "2000",
          data: {
            items: [
              {
                id: 401,
                package_no: "vip-pro-year",
                package_group_id: 2,
                plan_id: "501",
                plan_name: "Pro",
                sku_id: "sku-pro-year",
                price_amount: "199.00",
                currency_code: "CNY",
                duration_days: "365",
                recurrence_cycle: "yearly",
                status: "active",
              },
            ],
          },
        };
      }
      return { code: "2000", data: {} };
    },
    async () => {
      const overview = await MembershipService.fetchMembershipOverview();

      assert.equal(overview.summary, null);
      assert.equal(overview.packageGroups.length, 1);
      assert.equal(overview.packageGroups[0]?.packages[0]?.id, "401");
      assert.deepEqual(overview.benefits, []);
      assert.equal(overview.pointsBalance.balance, 0);
      assert.equal(overview.pointsBalance.status, "inactive");
      assert.deepEqual(overview.pointsHistory, []);
      assert.equal(overview.dailyReward.available, false);
      assert.equal(overview.privilegeUsage.speedUpAvailable, false);
      assert.deepEqual(overview.privilegeUsage.items, []);
    },
  );
});

test("console membership service falls back to the package catalog when group package loading fails", async () => {
  await withMembershipSdkResponses(
    (path) => {
      if (path === "/app/v3/api/memberships/current") {
        return { code: "2000", data: {} };
      }
      if (path === "/app/v3/api/memberships/package_groups") {
        return {
          code: "2000",
          data: {
            items: [
              {
                id: 2,
                group_no: "annual",
                name: "Annual packages",
                status: "active",
              },
            ],
          },
        };
      }
      if (path === "/app/v3/api/memberships/package_groups/2/packages") {
        return { code: "2000", data: {} };
      }
      if (path === "/app/v3/api/memberships/packages") {
        return {
          code: "2000",
          data: {
            items: [
              {
                id: 401,
                package_no: "vip-pro-year",
                package_group_id: 2,
                plan_id: "501",
                plan_name: "Pro",
                sku_id: "sku-pro-year",
                price_amount: "199.00",
                currency_code: "CNY",
                duration_days: "365",
                recurrence_cycle: "yearly",
                status: "active",
              },
            ],
          },
        };
      }
      return { code: "2000", data: { items: [] } };
    },
    async (captured) => {
      const overview = await MembershipService.fetchMembershipOverview();

      assert.equal(overview.packageGroups.length, 1);
      assert.equal(overview.packageGroups[0]?.id, "2");
      assert.equal(overview.packageGroups[0]?.packages.length, 1);
      assert.equal(overview.packageGroups[0]?.packages[0]?.id, "401");
      assert.ok(captured.some((request) => requestPath(request.url) === "/app/v3/api/memberships/packages"));
    },
  );
});

test("console membership service exposes purchase, renew, upgrade, reward, and speed-up actions", async () => {
  await withMembershipSdkResponses(
    (path) => {
      if (path === "/app/v3/api/memberships/points/daily_rewards") {
        return { code: "2000", data: { item: { requestNo: "daily-reward-1", success: true, status: "accepted", reward_points: "50" } } };
      }
      if (path === "/app/v3/api/memberships/privileges/speed_ups") {
        return { code: "2000", data: { requestNo: "speed-up-1", success: true, status: "accepted" } };
      }
      return { code: "2000", data: { requestNo: `${path.split("/").pop()}-1`, success: true, status: "accepted" } };
    },
    async (captured) => {
      const purchase = await MembershipService.purchaseMembership("401");
      const renew = await MembershipService.renewMembership("401");
      const upgrade = await MembershipService.upgradeMembership("402");
      const reward = await MembershipService.claimDailyReward();
      const speedUp = await MembershipService.activateSpeedUp();

      assert.equal(purchase.requestNo, "purchases-1");
      assert.equal(renew.requestNo, "renew-1");
      assert.equal(upgrade.requestNo, "upgrade-1");
      assert.equal(reward.requestNo, "daily-reward-1");
      assert.equal(reward.rewardPoints, 50);
      assert.equal(speedUp.requestNo, "speed-up-1");
      assert.deepEqual(captured.map((request) => requestPath(request.url)), [
        "/app/v3/api/memberships/purchases",
        "/app/v3/api/memberships/purchases/renew",
        "/app/v3/api/memberships/purchases/upgrade",
        "/app/v3/api/memberships/points/daily_rewards",
        "/app/v3/api/memberships/privileges/speed_ups",
      ]);
      assert.deepEqual(JSON.parse(captured[0]?.body ?? "{}"), { packageId: 401, paymentMethod: "wechat" });
      assert.deepEqual(JSON.parse(captured[1]?.body ?? "{}"), { packageId: 401, paymentMethod: "wechat" });
      assert.deepEqual(JSON.parse(captured[2]?.body ?? "{}"), { packageId: 402, paymentMethod: "wechat" });
    },
  );
});

test("console membership page uses dedicated i18n keys and renders the complete membership workflow", () => {
  const source = readPortalFile("./packages/sdkwork-claw-router-console-memberships/src/MembershipsView.tsx");
  const serviceSource = readPortalFile("./packages/sdkwork-claw-router-console-memberships/src/membershipService.ts");
  const packageJson = readPortalFile("./packages/sdkwork-claw-router-console-memberships/package.json");

  for (const marker of [
    "MembershipService.fetchMembershipOverview",
    "MembershipService.claimDailyReward",
    "MembershipService.activateSpeedUp",
    "VipPurchaseModal",
    "vipPurchaseModalOpen",
    "MembershipStatusHero",
    "EntitlementOverviewPanel",
    "EntitlementStatusSummary",
    "UsageSnapshotPanel",
    "EntitlementAccessBadge",
    "entitlementRows",
    "entitlementAccessCounts",
    "console.memberships.actions.openVipPurchase",
    "console.memberships.dashboard.heroEyebrow",
    "console.memberships.entitlements.includedTitle",
    "console.memberships.entitlements.tableHeaderBenefit",
    "console.memberships.entitlements.tableHeaderQuota",
    "console.memberships.entitlements.tableHeaderPeriod",
    "console.memberships.entitlements.tableHeaderAccess",
    "console.memberships.entitlements.accessIncluded",
    "console.memberships.points.title",
    "console.memberships.privileges.title",
    "table-fixed",
    "formatMembershipLocalTime",
  ]) {
    assert.match(source, new RegExp(escapeRegExp(marker)));
  }

  assert.equal(
    (source.match(/console\.memberships\.actions\.openVipPurchase/g) ?? []).length,
    1,
    "console membership page should expose a single VIP purchase CTA",
  );

  for (const retiredMarker of [
    "MembershipPackageCard",
    "handleMembershipPackageAction",
    "runPackageAction",
    "selectedMembershipPackageId",
    "PackageConfigurationPanel",
    "PackageSummaryRow",
    "MembershipLifecyclePanel",
    "console.memberships.lifecycle.title",
    "mt-1 rounded-xl bg-lobster-50 p-2 text-lobster-600",
    "console.memberships.packageGroups.title",
    "console.memberships.packages.configuredGroups",
  ]) {
    assert.doesNotMatch(source, new RegExp(escapeRegExp(retiredMarker)));
  }

  assert.doesNotMatch(source, /console\.commerce\./);
  assert.doesNotMatch(serviceSource, /fetch\(/);
  assert.doesNotMatch(serviceSource, /axios/);
  assert.match(serviceSource, /getClawRouterAppSdkClient\(\)\.commerce\.memberships\.packageGroups\.list/);
  assert.match(serviceSource, /getClawRouterAppSdkClient\(\)\.commerce\.memberships\.packageGroups\.packages\.list/);
  assert.match(serviceSource, /getClawRouterAppSdkClient\(\)\.commerce\.memberships\.points\.dailyRewards\.create/);
  assert.match(serviceSource, /getClawRouterAppSdkClient\(\)\.commerce\.memberships\.privileges\.speedUps\.create/);
  assert.match(packageJson, /"sdkwork-claw-router-vip": "workspace:\*"/);
});

test("console membership page uses the available console content width", () => {
  const source = readPortalFile("./packages/sdkwork-claw-router-console-memberships/src/MembershipsView.tsx");

  assert.match(source, /className="[^"]*\bw-full\b[^"]*\bbox-border\b[^"]*"/);
  assert.match(source, /className="[^"]*\bw-full\b[^"]*\bmin-w-0\b[^"]*\bspace-y-6\b[^"]*"/);
  assert.doesNotMatch(source, /max-w-(?:7xl|\[[^\]]+\])/);
  assert.doesNotMatch(source, /mx-auto w-full max-w/);
});

test("console membership i18n resources are registered with matching English and Chinese keys", () => {
  const en = resources.en.translation;
  const zh = resources.zh.translation;
  const requiredKeys = [
    "console.memberships.title",
    "console.memberships.description",
    "console.memberships.current.title",
    "console.memberships.actions.purchase",
    "console.memberships.actions.renew",
    "console.memberships.actions.upgrade",
    "console.memberships.actions.claimDailyReward",
    "console.memberships.actions.activateSpeedUp",
    "console.memberships.points.title",
    "console.memberships.privileges.title",
    "console.memberships.history.title",
    "console.memberships.actions.openVipPurchase",
    "console.memberships.dashboard.heroEyebrow",
    "console.memberships.entitlements.includedTitle",
    "console.memberships.entitlements.tableHeaderBenefit",
    "console.memberships.entitlements.tableHeaderQuota",
    "console.memberships.entitlements.tableHeaderPeriod",
    "console.memberships.entitlements.tableHeaderAccess",
    "console.memberships.entitlements.accessIncluded",
    "console.memberships.entitlements.accessInactive",
    "console.memberships.entitlements.accessUnavailable",
    "console.memberships.usage.title",
    "console.memberships.errors.overviewFallback",
  ];

  for (const key of requiredKeys) {
    assert.equal(typeof en[key], "string", `${key} must exist in English resources`);
    assert.equal(typeof zh[key], "string", `${key} must exist in Chinese resources`);
    assert.notEqual(en[key], "");
    assert.notEqual(zh[key], "");
  }
});

test("console membership schema contract covers the complete overview service surface", () => {
  const contract = readPortalFile("../../docs/schema-registry/frontend-field-contracts.yaml");

  for (const interfaceName of [
    "MembershipActionResult",
    "MembershipBenefit",
    "MembershipDailyRewardStatus",
    "MembershipOverview",
    "MembershipPackage",
    "MembershipPackageGroup",
    "MembershipPointsBalance",
    "MembershipPointsHistoryItem",
    "MembershipPrivilegeUsage",
    "MembershipPrivilegeUsageItem",
    "MembershipSummary",
  ]) {
    assert.match(contract, new RegExp(`interface: ${interfaceName}\\b`));
  }

  for (const fieldName of ["planName", "packageGroupId", "isPurchasable"]) {
    assert.match(contract, new RegExp(`\\n  - ${fieldName}\\b`));
  }

  for (const operationName of [
    "fetchMembershipOverview",
    "renewMembership",
    "upgradeMembership",
    "claimDailyReward",
    "activateSpeedUp",
  ]) {
    assert.match(contract, new RegExp(`operation: ${operationName}\\b`));
  }
});

function requestPath(url: string | undefined): string {
  assert.ok(url, "captured request URL is required");
  return url.split("?", 1)[0] ?? url;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
