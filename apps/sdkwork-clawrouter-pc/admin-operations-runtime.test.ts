import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { resetClawRouterSdkClients } from "./packages/sdkwork-clawrouter-pc-commons/src/sdk-clients.ts";
import { AdminAnalyticsService } from "./packages/sdkwork-clawrouter-pc-admin-analytics/src/analyticsService.ts";
import { AdminDashboardService } from "./packages/sdkwork-clawrouter-pc-admin-dashboard/src/dashboardService.ts";
import {
  backendCommerceReportsOrderRevenueList,
  backendInvoicesTitlesList,
} from "./packages/sdkwork-clawrouter-pc-admin-finance/src/financeService.ts";
import { MonitorService } from "./packages/sdkwork-clawrouter-pc-admin-monitor/src/monitorService.ts";
import { createModelInputFromForm, updateModelInputFromForm } from "./packages/sdkwork-clawrouter-pc-admin-model/src/modelForm.ts";
import { ModelService, type Model } from "./packages/sdkwork-clawrouter-pc-admin-model/src/modelService.ts";
import { RecordService } from "./packages/sdkwork-clawrouter-pc-admin-record/src/recordService.ts";
import { ServiceNodeService } from "./packages/sdkwork-clawrouter-pc-admin-service-nodes/src/serviceNodeService.ts";
import { SiteSettingsService } from "./packages/sdkwork-clawrouter-pc-admin-site/src/SiteSettingsService.ts";
import {
  DEFAULT_RUNTIME_REGION_SETTINGS,
  RuntimeRegionService,
} from "./packages/sdkwork-clawrouter-pc-admin-runtime-region/src/runtimeRegionService.ts";

const originalFetch = globalThis.fetch;
const originalWindowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");

type CapturedSdkRequest = {
  url: string;
  method: string;
  body: string;
};

async function withBackendSdkFetch<T>(
  handler: (url: string, init?: RequestInit) => unknown,
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
    const result = handler(url, init);
    return new Response(JSON.stringify({ code: "2000", data: result }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }) as typeof fetch;
  resetClawRouterSdkClients();

  try {
    return await fn(captured);
  } finally {
    resetClawRouterSdkClients();
    globalThis.fetch = originalFetch;
    if (originalWindowDescriptor) {
      Object.defineProperty(globalThis, "window", originalWindowDescriptor);
    } else {
      delete (globalThis as { window?: Window }).window;
    }
  }
}

function isSystemRecordsRequest(url: string, init?: RequestInit): boolean {
  return new URL(url, "http://localhost").pathname === "/backend/v3/api/system/records"
    && (init?.method ?? "GET") === "GET";
}

function readAdminRecordSource(): string {
  return readFileSync(
    new URL("./packages/sdkwork-clawrouter-pc-admin-record/src/index.tsx", import.meta.url),
    "utf8",
  );
}

function readAdminMonitorSource(): string {
  return readFileSync(
    new URL("./packages/sdkwork-clawrouter-pc-admin-monitor/src/index.tsx", import.meta.url),
    "utf8",
  );
}

function readAdminFinanceSource(): string {
  return readFileSync(
    new URL("./packages/sdkwork-clawrouter-pc-admin-finance/src/index.tsx", import.meta.url),
    "utf8",
  );
}

function readAdminPaymentsSource(): string {
  return readFileSync(
    new URL("./packages/sdkwork-clawrouter-pc-admin-payments/src/index.tsx", import.meta.url),
    "utf8",
  );
}

function readAdminWalletSource(): string {
  return readFileSync(
    new URL("./packages/sdkwork-clawrouter-pc-admin-wallet/src/index.tsx", import.meta.url),
    "utf8",
  );
}

function readAdminCatalogSource(): string {
  return readFileSync(
    new URL(
      "../../../sdkwork-commerce/apps/sdkwork-commerce-pc/packages/sdkwork-commerce-pc-admin-product/src/index.tsx",
      import.meta.url,
    ),
    "utf8",
  );
}

function readAdminMarketingSource(): string {
  return readFileSync(
    new URL("./packages/sdkwork-clawrouter-pc-admin-marketing/src/index.tsx", import.meta.url),
    "utf8",
  );
}

function readAdminOrdersSource(): string {
  return readFileSync(
    new URL("./packages/sdkwork-clawrouter-pc-admin-orders/src/index.tsx", import.meta.url),
    "utf8",
  );
}

function readAdminInventorySource(): string {
  return readFileSync(
    new URL("./packages/sdkwork-clawrouter-pc-admin-inventory/src/index.tsx", import.meta.url),
    "utf8",
  );
}

function readAdminMessagingSource(): string {
  return readFileSync(
    new URL("./packages/sdkwork-clawrouter-pc-admin-messaging/src/index.tsx", import.meta.url),
    "utf8",
  );
}

function readAdminOAuthSource(): string {
  return readFileSync(
    new URL("./packages/sdkwork-clawrouter-pc-admin-oauth/src/index.tsx", import.meta.url),
    "utf8",
  );
}

function readAdminServiceProviderSource(): string {
  return readFileSync(
    new URL("./packages/sdkwork-clawrouter-pc-admin-service-provider/src/index.tsx", import.meta.url),
    "utf8",
  );
}

function readAdminCacheSource(): string {
  return readFileSync(
    new URL("./packages/sdkwork-clawrouter-pc-admin-cache/src/index.tsx", import.meta.url),
    "utf8",
  );
}

function readAdminSiteSettingsSource(): string {
  return readFileSync(
    new URL("./packages/sdkwork-clawrouter-pc-admin-site/src/index.tsx", import.meta.url),
    "utf8",
  );
}

function readAdminRuntimeRegionSource(): string {
  return readFileSync(
    new URL("./packages/sdkwork-clawrouter-pc-admin-runtime-region/src/index.tsx", import.meta.url),
    "utf8",
  );
}

function readAdminServiceNodesSource(): string {
  return readFileSync(
    new URL("./packages/sdkwork-clawrouter-pc-admin-service-nodes/src/index.tsx", import.meta.url),
    "utf8",
  );
}

function readAdminServiceNodesServiceSource(): string {
  return readFileSync(
    new URL("./packages/sdkwork-clawrouter-pc-admin-service-nodes/src/serviceNodeService.ts", import.meta.url),
    "utf8",
  );
}

function readAdminDashboardSource(): string {
  return readFileSync(
    new URL("./packages/sdkwork-clawrouter-pc-admin-dashboard/src/index.tsx", import.meta.url),
    "utf8",
  );
}

function readAdminAnalyticsSource(): string {
  return readFileSync(
    new URL("./packages/sdkwork-clawrouter-pc-admin-analytics/src/index.tsx", import.meta.url),
    "utf8",
  );
}

function readAdminAnalyticsServiceSource(): string {
  return readFileSync(
    new URL("./packages/sdkwork-clawrouter-pc-admin-analytics/src/analyticsService.ts", import.meta.url),
    "utf8",
  );
}

function readI18nSource(): string {
  return [
    "./packages/sdkwork-clawrouter-pc-i18n/src/index.ts",
    "./packages/sdkwork-clawrouter-pc-i18n/src/resources/index.ts",
    "./packages/sdkwork-clawrouter-pc-i18n/src/resources/admin/core-navigation.ts",
    "./packages/sdkwork-clawrouter-pc-i18n/src/resources/admin/site-settings.ts",
    "./packages/sdkwork-clawrouter-pc-i18n/src/resources/admin/runtime-region.ts",
    "./packages/sdkwork-clawrouter-pc-i18n/src/resources/admin/analytics-record.ts",
    "./packages/sdkwork-clawrouter-pc-i18n/src/resources/admin/service-nodes.ts",
  ].map((path) => readFileSync(new URL(path, import.meta.url), "utf8")).join("\n");
}

function readAdminLayoutSource(): string {
  return readFileSync(new URL("./src/AdminLayout.tsx", import.meta.url), "utf8");
}

function readAdminModuleRegistrySource(): string {
  return readFileSync(new URL("./src/adminModuleRegistry.ts", import.meta.url), "utf8");
}

function readAdminResourceCenterSource(): string {
  return readFileSync(new URL("./packages/sdkwork-clawrouter-pc-commons/src/components/AdminResourceCenter.tsx", import.meta.url), "utf8");
}

function readAdminStoragePageShellSource(): string {
  return readFileSync(new URL("./packages/sdkwork-clawrouter-pc-admin-file-platform/src/components/StoragePageShell.tsx", import.meta.url), "utf8");
}

function readAdminCoursePageShellSource(): string {
  return readFileSync(new URL("./packages/sdkwork-clawrouter-pc-admin-courses/src/components/CoursePageShell.tsx", import.meta.url), "utf8");
}

function readAdminMembershipPageShellSource(): string {
  return readFileSync(new URL("./packages/sdkwork-clawrouter-pc-admin-memberships/src/components/MembershipAdminPageShell.tsx", import.meta.url), "utf8");
}

function readAdminAuthSettingsSource(): string {
  return readFileSync(new URL("./packages/sdkwork-clawrouter-pc-admin-site/src/ClawRouterAuthSettingsPage.tsx", import.meta.url), "utf8");
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function readAdminDriveSource(): string {
  return readFileSync(new URL("./packages/sdkwork-clawrouter-pc-admin-file-platform/src/index.tsx", import.meta.url), "utf8");
}

function readAdminCourseEntrySource(): string {
  return readFileSync(new URL("./packages/sdkwork-clawrouter-pc-admin-courses/src/index.tsx", import.meta.url), "utf8");
}

function readAdminMembershipsSource(): string {
  return readFileSync(new URL("./packages/sdkwork-clawrouter-pc-admin-memberships/src/index.tsx", import.meta.url), "utf8");
}

function readAdminRateLimitSource(): string {
  return readFileSync(new URL("./packages/sdkwork-clawrouter-pc-admin-ratelimit/src/index.tsx", import.meta.url), "utf8");
}

function readAdminGroupSource(): string {
  return readFileSync(new URL("./packages/sdkwork-clawrouter-pc-admin-group/src/index.tsx", import.meta.url), "utf8");
}

function readAdminAppCenterSource(): string {
  return readFileSync(new URL("./packages/sdkwork-clawrouter-pc-admin-app/src/pages/AppAdmin.tsx", import.meta.url), "utf8");
}

function readAppSource(): string {
  return readFileSync(new URL("./src/App.tsx", import.meta.url), "utf8");
}

function assertAdminResourceCenterHasNoPageHeaderProps(source: string, label: string): void {
  const match = source.match(/<AdminResourceCenter(?:<[^>]+>)?[\s\S]*?\/>/);
  assert.ok(match, `${label} must render AdminResourceCenter`);
  const resourceCenterUsage = match[0];
  assert.doesNotMatch(resourceCenterUsage, /\n\s+(?:title|description|icon)=\{/, `${label} must not pass duplicate page header props`);
}

function readAdminAnalyticsContractSource(): string {
  return readFileSync(new URL("../../docs/schema-registry/frontend-field-contracts.yaml", import.meta.url), "utf8");
}

function readAdminAnalyticsRouteClassificationSource(): string {
  return readFileSync(new URL("../../docs/schema-registry/frontend-route-classification.yaml", import.meta.url), "utf8");
}

function readClawRouterTablesRegistrySource(): string {
  return readFileSync(new URL("../../generated/schema/registry/sdkwork-claw-router.tables.effective.yaml", import.meta.url), "utf8");
}

function readFrontendContractSource(): string {
  return readFileSync(new URL("../../docs/schema-registry/frontend-field-contracts.yaml", import.meta.url), "utf8");
}

function readSchemaManifestSource(): string {
  return readFileSync(new URL("../../generated/schema/manifest/schema-manifest.json", import.meta.url), "utf8");
}

function adminDashboardFixture(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    userConsumption: [],
    multimodal: [],
    traffic: [],
    modelDistribution: [],
    recentUsage: [],
    ...overrides,
  };
}

function adminAnalyticsFixture(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    timeRange: "daily",
    startTime: "2026-05-01T00:00:00Z",
    endTime: "2026-05-18T23:59:59Z",
    limit: 10,
    summary: {
      totalUsers: 3,
      activeUsers: 2,
      activeModels: 2,
      totalRequests: 42,
      successfulRequests: 40,
      failedRequests: 2,
      totalTokens: 128000,
      totalPoints: 91.5,
      upstreamCost: 38.25,
      averageTokensPerRequest: 3047.62,
      averagePointsPerRequest: 2.18,
      errorRate: 4.76,
    },
    trend: [
      { time: "2026-05-18", requests: 42, tokens: 128000, points: 91.5, users: 2 },
    ],
    userRankings: {
      points: [
        { rank: 1, userId: "101", userName: "alice", email: "alice@example.com", requestCount: 24, totalTokens: 76000, points: 58.2, modelDistribution: [{ name: "gpt-4o", value: 14, color: "#2563eb" }] },
      ],
      tokens: [
        { rank: 1, userId: "102", userName: "bob", requestCount: 18, totalTokens: 82000, points: 33.3, modelDistribution: [{ name: "claude-sonnet", value: 18, color: "#16a34a" }] },
      ],
      requests: [
        { rank: 1, userId: "101", userName: "alice", requestCount: 24, totalTokens: 76000, points: 58.2, modelDistribution: [{ name: "gpt-4o", value: 14, color: "#2563eb" }] },
      ],
    },
    modelRankings: {
      points: [
        { rank: 1, model: "gpt-4o", catalogKey: "openai/gpt-4o", vendor: "openai", modality: "text", requestCount: 24, totalTokens: 76000, points: 58.2, upstreamCost: 21.4, userCount: 2, averageTokensPerRequest: 3166.67, errorRate: 0 },
      ],
      tokens: [
        { rank: 1, model: "claude-sonnet", catalogKey: "anthropic/claude-sonnet", vendor: "anthropic", modality: "text", requestCount: 18, totalTokens: 82000, points: 33.3, upstreamCost: 16.85, userCount: 1, averageTokensPerRequest: 4555.56, errorRate: 5 },
      ],
      requests: [
        { rank: 1, model: "gpt-4o", catalogKey: "openai/gpt-4o", vendor: "openai", modality: "text", requestCount: 24, totalTokens: 76000, points: 58.2, upstreamCost: 21.4, userCount: 2, averageTokensPerRequest: 3166.67, errorRate: 0 },
      ],
    },
    modelDistribution: [{ name: "gpt-4o", value: 24, color: "#2563eb" }],
    modalityDistribution: [{ name: "text", value: 42, color: "#2563eb" }],
    insights: [
      { key: "errorRate", title: "Request failure rate", value: "4.8%", severity: "info", detail: "Failure rate is calculated from request traces." },
    ],
    ...overrides,
  };
}

function emptyAdminAnalyticsFixture(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return adminAnalyticsFixture({
    summary: {
      totalUsers: 0,
      activeUsers: 0,
      activeModels: 0,
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      totalTokens: 0,
      totalPoints: 0,
      upstreamCost: 0,
      averageTokensPerRequest: 0,
      averagePointsPerRequest: 0,
      errorRate: 0,
    },
    trend: [],
    userRankings: {
      points: [],
      tokens: [],
      requests: [],
    },
    modelRankings: {
      points: [],
      tokens: [],
      requests: [],
    },
    modelDistribution: [],
    modalityDistribution: [],
    insights: [],
    ...overrides,
  });
}

test("admin routed pages use compact 5px chrome and avoid duplicate page title headers", () => {
  const adminLayoutSource = readAdminLayoutSource();
  const resourceCenterSource = readAdminResourceCenterSource();
  const storageShellSource = readAdminStoragePageShellSource();
  const courseShellSource = readAdminCoursePageShellSource();
  const membershipShellSource = readAdminMembershipPageShellSource();
  const authSettingsSource = readAdminAuthSettingsSource();
  const driveSource = readAdminDriveSource();
  const courseEntrySource = readAdminCourseEntrySource();
  const membershipsSource = readAdminMembershipsSource();
  const recordSource = readAdminRecordSource();
  const rateLimitSource = readAdminRateLimitSource();
  const groupSource = readAdminGroupSource();
  const monitorSource = readAdminMonitorSource();
  const financeSource = readAdminFinanceSource();
  const paymentsSource = readAdminPaymentsSource();
  const walletSource = readAdminWalletSource();
  const catalogSource = readAdminCatalogSource();
  const marketingSource = readAdminMarketingSource();
  const ordersSource = readAdminOrdersSource();
  const inventorySource = readAdminInventorySource();
  const messagingSource = readAdminMessagingSource();
  const serviceProviderSource = readAdminServiceProviderSource();
  const oauthSource = readAdminOAuthSource();
  const appCenterSource = readAdminAppCenterSource();
  const announcementSource = readFileSync(new URL("./packages/sdkwork-clawrouter-pc-admin-announcement/src/index.tsx", import.meta.url), "utf8");

  assert.match(adminLayoutSource, /className="[^"]*flex[^"]*min-h-0[^"]*flex-1[^"]*flex-col[^"]*p-\[5px\][^"]*"/);
  assert.doesNotMatch(adminLayoutSource, /className="[^"]*(?:p-6|md:p-8|lg:p-8)[^"]*"/);

  assert.doesNotMatch(resourceCenterSource, /<h2[^>]*>\s*\{icon\}\s*\{title\}\s*<\/h2>/);
  assert.doesNotMatch(resourceCenterSource, /<p[^>]*>\{description\}<\/p>/);
  assert.doesNotMatch(resourceCenterSource, /<h3[^>]*>\{activeSection\.title\}<\/h3>/);
  assert.doesNotMatch(resourceCenterSource, /\{activeSection\.description\}/);
  const resourceCenterProps = resourceCenterSource.match(/export interface AdminResourceCenterProps[\s\S]*?\n}/)?.[0] ?? "";
  assert.ok(resourceCenterProps, "AdminResourceCenterProps must be declared");
  assert.doesNotMatch(resourceCenterProps, /\n\s+(?:title|description|icon):/, "AdminResourceCenterProps must not expose page header props");

  for (const [label, source] of [
    ["finance admin", financeSource],
    ["payments admin", paymentsSource],
    ["wallet admin", walletSource],
    ["catalog admin", catalogSource],
    ["marketing admin", marketingSource],
    ["orders admin", ordersSource],
    ["inventory admin", inventorySource],
    ["messaging admin", messagingSource],
    ["service provider admin", serviceProviderSource],
    ["OAuth admin", oauthSource],
  ] as const) {
    assertAdminResourceCenterHasNoPageHeaderProps(source, label);
  }

  for (const source of [storageShellSource, courseShellSource, membershipShellSource]) {
    assert.doesNotMatch(source, /<h3[^>]*>\{title\}<\/h3>/);
    assert.doesNotMatch(source, /\{description\}/);
    assert.doesNotMatch(source, /\n\s+(?:title|description): string/);
  }

  assert.doesNotMatch(authSettingsSource, /<h2[\s\S]*admin\.authSettings\.title/);
  assert.doesNotMatch(authSettingsSource, /admin\.authSettings\.description/);
  assert.doesNotMatch(driveSource, /<h1[\s\S]*admin\.filePlatform\.drive\.title/);
  assert.doesNotMatch(driveSource, /admin\.filePlatform\.drive\.desc/);
  assert.doesNotMatch(announcementSource, /<h2[\s\S]*admin\.announcement\.title/);
  assert.doesNotMatch(announcementSource, /admin\.announcement\.subtitle/);
  assert.doesNotMatch(courseEntrySource, /<h2[\s\S]*admin\.courses\.title/);
  assert.doesNotMatch(courseEntrySource, /admin\.courses\.subtitle/);
  assert.doesNotMatch(membershipsSource, /<h2[\s\S]*admin\.commerce\.memberships\.title/);
  assert.doesNotMatch(membershipsSource, /admin\.commerce\.memberships\.desc/);
  assert.doesNotMatch(recordSource, /<h1[\s\S]*admin\.record\.index\.text\.1trrvl5/);
  assert.doesNotMatch(recordSource, /admin\.record\.index\.text\.knx8o5/);
  assert.doesNotMatch(rateLimitSource, /<h2[\s\S]*admin\.ratelimit\.index\.text\.1q9or2q/);
  assert.doesNotMatch(rateLimitSource, /admin\.ratelimit\.index\.text\.1s2axdq/);
  assert.doesNotMatch(groupSource, /flex h-full min-h-0 w-full flex-col gap-6 overflow-hidden/);
  assert.doesNotMatch(monitorSource, /flex h-full min-h-0 w-full flex-col gap-6 overflow-hidden/);
  assert.doesNotMatch(messagingSource, /h-\[calc\(100vh-/);
  assert.doesNotMatch(oauthSource, /admin\.oauth\.(?:title|description)/);
  assert.doesNotMatch(appCenterSource, /<h2[\s\S]*admin\.app\.title/);
  assert.doesNotMatch(appCenterSource, /admin\.app\.subtitle/);
});

test("admin site settings uses generated backend SDK and is reachable from admin navigation", async () => {
  const adminModuleRegistrySource = readAdminModuleRegistrySource();
  const appSource = readAppSource();
  const i18nSource = readI18nSource();
  const contractSource = readFrontendContractSource();

  for (const marker of [
    "/admin/site",
    "admin.menu.ops.system",
    "admin.menu.siteSettings",
  ]) {
    assert.ok(adminModuleRegistrySource.includes(marker), `missing admin site navigation marker: ${marker}`);
  }

  assert.ok(appSource.includes("ClawRouterSiteSettingsPage"), "App routes must lazy-load the site settings page");
  assert.ok(appSource.includes("sdkwork-clawrouter-pc-admin-site"), "Site settings page must live in the admin site package");
  assert.ok(appSource.includes('path="site"'), "App routes must expose /admin/site");
  assert.ok(i18nSource.includes("admin.siteSettings.title"), "i18n must include admin site settings copy");
  assert.ok(contractSource.includes("site.settings.retrieve"), "schema registry must declare site settings retrieve");
  assert.ok(contractSource.includes("site.runtime.retrieve"), "schema registry must declare public site runtime retrieve");

  await withBackendSdkFetch(
    (url, init) => {
      const parsed = new URL(url, "http://localhost");
      assert.equal(parsed.pathname, "/backend/v3/api/system/site/settings");
      if ((init?.method ?? "GET") === "PATCH") {
        const body = String(init?.body ?? "");
        assert.match(body, /"siteName":"Tenant AI Gateway"/);
        assert.match(body, /"icpRecordNumber":"京ICP备2026000000号-1"/);
        assert.match(body, /"icpRecordUrl":"https:\/\/beian\.miit\.gov\.cn\//);
        assert.match(body, /"policeRecordNumber":"京公网安备11010502000000号"/);
        assert.match(body, /"policeRecordUrl":"https:\/\/www\.beian\.gov\.cn\/portal\/registerSystemInfo\?recordcode=11010502000000"/);
      }
      return {
        siteName: "Tenant AI Gateway",
        shortName: "Tenant AI",
        description: "Tenant-branded AI gateway",
        logoUrl: "https://cdn.example.com/logo.svg",
        iconUrl: "https://cdn.example.com/icon.svg",
        faviconUrl: "https://cdn.example.com/favicon.ico",
        brandColor: "#2563eb",
        accentColor: "#16a34a",
        footerCopyright: "Tenant AI. All rights reserved.",
        seoTitle: "Tenant AI Gateway",
        seoDescription: "Tenant-branded AI gateway",
        supportUrl: "https://support.example.com",
        docsUrl: "https://docs.example.com",
        privacyUrl: "https://example.com/privacy",
        termsUrl: "https://example.com/terms",
        icpRecordNumber: "京ICP备2026000000号-1",
        icpRecordUrl: "https://beian.miit.gov.cn/",
        policeRecordNumber: "京公网安备11010502000000号",
        policeRecordUrl: "https://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010502000000",
        customCss: "",
      };
    },
    async (captured) => {
      const current = await SiteSettingsService.fetchSettings();
      assert.equal(current.siteName, "Tenant AI Gateway");
      assert.equal(current.icpRecordNumber, "京ICP备2026000000号-1");
      assert.equal(current.policeRecordNumber, "京公网安备11010502000000号");

      const saved = await SiteSettingsService.updateSettings({
        ...current,
        siteName: "Tenant AI Gateway",
      });
      assert.equal(saved.shortName, "Tenant AI");
      assert.equal(saved.icpRecordNumber, "京ICP备2026000000号-1");
      assert.equal(saved.icpRecordUrl, "https://beian.miit.gov.cn/");
      assert.equal(saved.policeRecordNumber, "京公网安备11010502000000号");
      assert.equal(saved.policeRecordUrl, "https://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010502000000");
      assert.deepEqual(
        captured.map((request) => [request.method, request.url]),
        [
          ["GET", "/backend/v3/api/system/site/settings"],
          ["PATCH", "/backend/v3/api/system/site/settings"],
        ],
      );
    },
  );
});

test("admin runtime region settings use generated backend SDK and default to China", async () => {
  const adminModuleRegistrySource = readAdminModuleRegistrySource();
  const appSource = readAppSource();
  const i18nSource = readI18nSource();
  const contractSource = readFrontendContractSource();

  assert.equal(DEFAULT_RUNTIME_REGION_SETTINGS.currentRegionCode, "cn");
  assert.equal(DEFAULT_RUNTIME_REGION_SETTINGS.currentRegionName, "China");

  for (const marker of [
    "/admin/runtime-region",
    "admin.menu.ops.system",
    "admin.menu.runtimeRegion",
  ]) {
    assert.ok(adminModuleRegistrySource.includes(marker), `missing admin runtime region navigation marker: ${marker}`);
  }

  assert.ok(appSource.includes("RuntimeRegionAdmin"), "App routes must lazy-load the runtime region page");
  assert.ok(appSource.includes("sdkwork-clawrouter-pc-admin-runtime-region"), "Runtime region page must live in its own admin package");
  assert.ok(appSource.includes('path="runtime-region"'), "App routes must expose /admin/runtime-region");
  assert.ok(i18nSource.includes("admin.runtimeRegion.title"), "i18n must include runtime region copy");
  assert.ok(contractSource.includes("runtimeRegion.settings.retrieve"), "schema registry must declare runtime region retrieve");
  assert.ok(contractSource.includes("/backend/v3/api/system/runtime_region/settings"), "schema registry must use the canonical backend runtime region path");

  await withBackendSdkFetch(
    (url, init) => {
      const parsed = new URL(url, "http://localhost");
      assert.equal(parsed.pathname, "/backend/v3/api/system/runtime_region/settings");
      if ((init?.method ?? "GET") === "PATCH") {
        const body = String(init?.body ?? "");
        assert.match(body, /"currentRegionCode":"us"/);
        assert.match(body, /"currentRegionName":"United States"/);
      }
      return {
        currentRegionCode: "cn",
        currentRegionName: "China",
        remark: "Default runtime region for route, endpoint, and regional pricing selection.",
      };
    },
    async (captured) => {
      const current = await RuntimeRegionService.fetchSettings();
      assert.equal(current.currentRegionCode, "cn");
      assert.equal(current.currentRegionName, "China");

      const saved = await RuntimeRegionService.updateSettings({
        currentRegionCode: "us",
        currentRegionName: "United States",
        remark: "Route default traffic to the US runtime cell.",
      });
      assert.equal(saved.currentRegionCode, "cn");
      assert.equal(saved.currentRegionName, "China");
      assert.deepEqual(
        captured.map((request) => [request.method, request.url]),
        [
          ["GET", "/backend/v3/api/system/runtime_region/settings"],
          ["PATCH", "/backend/v3/api/system/runtime_region/settings"],
        ],
      );
    },
  );
});

test("admin OAuth account management is reachable from admin navigation", () => {
  const appSource = readFileSync(new URL("./src/App.tsx", import.meta.url), "utf8");
  const adminModuleRegistrySource = readAdminModuleRegistrySource();
  const i18nSource = readI18nSource();
  const oauthSource = readAdminOAuthSource();
  const oauthServiceSource = readFileSync(
    new URL("./packages/sdkwork-clawrouter-pc-admin-oauth/src/oauthAdminService.ts", import.meta.url),
    "utf8",
  );
  const packageJson = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8")) as {
    dependencies: Record<string, string>;
  };

  assert.equal(packageJson.dependencies["sdkwork-clawrouter-pc-admin-oauth"], "workspace:*");
  assert.match(appSource, /const OAuthAdmin = lazyRoute\(\(\) => import\('sdkwork-clawrouter-pc-admin-oauth'\), 'OAuthAdmin'\);/);
  assert.match(appSource, /<Route path="oauth" element=\{<Navigate to="\/admin\/oauth\/overview" replace \/>} \/>/);
  assert.match(appSource, /<Route path="oauth\/resource-accounts\/official-accounts" element=\{<OAuthAdmin sectionId="officialAccounts" \/>} \/>/);
  assert.match(appSource, /<Route path="oauth\/resource-accounts\/mini-programs" element=\{<OAuthAdmin sectionId="miniPrograms" \/>} \/>/);
  assert.match(appSource, /<Route path="oauth\/login\/mini-programs" element=\{<OAuthAdmin sectionId="miniProgramLogin" \/>} \/>/);
  assert.match(adminModuleRegistrySource, /id:\s*'oauth'/);
  assert.match(adminModuleRegistrySource, /path:\s*'\/admin\/oauth\/resource-accounts\/official-accounts'/);
  assert.match(adminModuleRegistrySource, /labelKey:\s*'admin\.menu\.oauth\.officialAccounts'/);
  assert.match(adminModuleRegistrySource, /path:\s*'\/admin\/oauth\/resource-accounts\/mini-programs'/);
  assert.match(adminModuleRegistrySource, /labelKey:\s*'admin\.menu\.oauth\.miniPrograms'/);
  assert.match(i18nSource, /"admin\.menu\.oauth\.officialAccounts":\s*"Official Accounts"/);
  assert.match(i18nSource, /"admin\.menu\.oauth\.miniPrograms":\s*"Mini Programs"/);
  assert.match(oauthSource, /WeChat Official Account/);
  assert.match(oauthSource, /WeChat Mini Program/);
  assert.match(oauthSource, /Alipay Mini Program/);
  assert.match(oauthSource, /Self-managed account or operator-authorized account/);
  assert.match(oauthSource, /Self-managed AppID\/AppSecret or component platform authorization/);
  assert.match(oauthServiceSource, /getSdkworkAppbaseBackendSdkClient/);
  assert.match(oauthServiceSource, /iam\.oauth\.resourceAccounts/);
  assert.match(oauthServiceSource, /iam\.oauth\.operatorPlatforms/);
  assert.match(oauthServiceSource, /iam\.oauth\.resourceAuthorizations/);
  assert.doesNotMatch(oauthServiceSource, /\bfetch\s*\(/);
  assert.doesNotMatch(oauthServiceSource, /\baxios\b/);
  assert.doesNotMatch(oauthServiceSource, /\/backend\/v3\/api/);
});

test("admin site settings fills blank filing fields with default compliance information", async () => {
  await withBackendSdkFetch(
    (url) => {
      const parsed = new URL(url, "http://localhost");
      assert.equal(parsed.pathname, "/backend/v3/api/system/site/settings");
      return {
        siteName: "Tenant AI Gateway",
        shortName: "Tenant AI",
        description: "Tenant-branded AI gateway",
        logoUrl: "",
        iconUrl: "",
        faviconUrl: "",
        brandColor: "#2563eb",
        accentColor: "#16a34a",
        footerCopyright: "Tenant AI. All rights reserved.",
        seoTitle: "Tenant AI Gateway",
        seoDescription: "Tenant-branded AI gateway",
        supportUrl: "",
        docsUrl: "https://docs.example.com",
        privacyUrl: "https://example.com/privacy",
        termsUrl: "https://example.com/terms",
        icpRecordNumber: "",
        icpRecordUrl: "",
        policeRecordNumber: "   ",
        policeRecordUrl: "",
        customCss: "",
      };
    },
    async () => {
      const current = await SiteSettingsService.fetchSettings();
      assert.equal(current.icpRecordNumber, "京ICP备2026000000号-1");
      assert.equal(current.icpRecordUrl, "https://beian.miit.gov.cn/");
      assert.equal(current.policeRecordNumber, "京公网安备11010502000000号");
      assert.equal(
        current.policeRecordUrl,
        "https://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010502000000",
      );
    },
  );
});

test("admin analytics service reads overview through generated backend SDK query path", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      assert.equal(init?.method ?? "GET", "GET");
      const requestUrl = new URL(url, "http://localhost");
      assert.equal(requestUrl.pathname, "/backend/v3/api/system/analytics/admin/overview");
      assert.equal(requestUrl.searchParams.get("time_range"), "monthly");
      assert.equal(requestUrl.searchParams.get("start_time"), "2026-05-01T00:00:00Z");
      assert.equal(requestUrl.searchParams.get("end_time"), "2026-05-31T23:59:59Z");
      assert.equal(requestUrl.searchParams.get("limit"), "12");
      return adminAnalyticsFixture({
        timeRange: "monthly",
        limit: 12,
      });
    },
    async (captured) => {
      const result = await AdminAnalyticsService.fetchOverview({
        timeRange: "monthly",
        startTime: "2026-05-01T00:00:00Z",
        endTime: "2026-05-31T23:59:59Z",
        limit: 12,
      });

      assert.equal(captured.length, 1);
      assert.equal(result.summary.totalRequests, 42);
      assert.equal(result.userRankings.points[0].userName, "alice");
      assert.equal(result.modelRankings.points[0].model, "gpt-4o");
      assert.equal(result.modelDistribution[0].value, 24);
    },
  );
});

test("admin analytics service keeps backend empty overview as real zero state", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      assert.equal(init?.method ?? "GET", "GET");
      const requestUrl = new URL(url, "http://localhost");
      assert.equal(requestUrl.pathname, "/backend/v3/api/system/analytics/admin/overview");
      return emptyAdminAnalyticsFixture({
        timeRange: "weekly",
      });
    },
    async () => {
      const result = await AdminAnalyticsService.fetchOverview({ timeRange: "weekly" });

      assert.equal(result.timeRange, "weekly");
      assert.equal(result.summary.totalRequests, 0);
      assert.equal(result.summary.totalTokens, 0);
      assert.equal(result.summary.totalPoints, 0);
      assert.equal(result.trend.length, 0);
      assert.equal(result.userRankings.points.length, 0);
      assert.equal(result.modelRankings.requests.length, 0);
      assert.equal(result.modelDistribution.length, 0);
      assert.equal(result.modalityDistribution.length, 0);
      assert.equal(result.insights.length, 0);
    },
  );
});

test("admin analytics service keeps empty backend overview truthful instead of inventing usage", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      assert.equal(init?.method ?? "GET", "GET");
      const requestUrl = new URL(url, "http://localhost");
      assert.equal(requestUrl.pathname, "/backend/v3/api/system/analytics/admin/overview");
      return emptyAdminAnalyticsFixture({
        timeRange: "daily",
      });
    },
    async () => {
      const result = await AdminAnalyticsService.fetchOverview({ timeRange: "daily" });

      assert.equal(result.summary.totalRequests, 0);
      assert.equal(result.summary.totalTokens, 0);
      assert.equal(result.summary.totalPoints, 0);
      assert.deepEqual(result.trend, []);
      assert.deepEqual(result.userRankings.points, []);
      assert.deepEqual(result.userRankings.tokens, []);
      assert.deepEqual(result.userRankings.requests, []);
      assert.deepEqual(result.modelRankings.points, []);
      assert.deepEqual(result.modelDistribution, []);
      assert.deepEqual(result.modalityDistribution, []);
      assert.deepEqual(result.insights, []);
    },
  );
});

test("admin analytics service derives only from real partial backend data and never seeds fake ranking rows", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      assert.equal(init?.method ?? "GET", "GET");
      const requestUrl = new URL(url, "http://localhost");
      assert.equal(requestUrl.pathname, "/backend/v3/api/system/analytics/admin/overview");
      return emptyAdminAnalyticsFixture({
        summary: {
          totalUsers: 1,
          activeUsers: 1,
          activeModels: 1,
          totalRequests: 9,
          successfulRequests: 8,
          failedRequests: 1,
          totalTokens: 900,
          totalPoints: 18,
          upstreamCost: 9,
          averageTokensPerRequest: 100,
          averagePointsPerRequest: 2,
          errorRate: 11.11111111111111,
        },
        trend: [],
        userRankings: {
          points: [],
          tokens: [],
          requests: [],
        },
        modelRankings: {
          points: [],
          tokens: [],
          requests: [],
        },
        modelDistribution: [],
        modalityDistribution: [],
        insights: [],
      });
    },
    async () => {
      const result = await AdminAnalyticsService.fetchOverview({ timeRange: "daily" });

      assert.equal(result.summary.totalRequests, 9);
      assert.equal(result.summary.totalTokens, 900);
      assert.equal(result.userRankings.points.length, 0);
      assert.equal(result.modelRankings.requests.length, 0);
      assert.deepEqual(result.modelDistribution, []);
      assert.deepEqual(result.modalityDistribution, []);
      assert.equal(result.trend.length, 1);
      assert.equal(result.trend[0].requests, 9);
      assert.equal(result.insights.length, 1);
      assert.equal(result.insights[0].title, "admin.analytics.insights.requestSuccessRate.title");
    },
  );
});

test("admin analytics service derives missing visualization dimensions only from real ranking data", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      assert.equal(init?.method ?? "GET", "GET");
      const requestUrl = new URL(url, "http://localhost");
      assert.equal(requestUrl.pathname, "/backend/v3/api/system/analytics/admin/overview");
      return adminAnalyticsFixture({
        summary: {
          totalUsers: 8,
          activeUsers: 6,
          activeModels: 3,
          totalRequests: 7,
          successfulRequests: 7,
          failedRequests: 0,
          totalTokens: 2300,
          totalPoints: 5.75,
          upstreamCost: 1.25,
          averageTokensPerRequest: 328.57,
          averagePointsPerRequest: 0.82,
          errorRate: 0,
        },
        trend: [],
        modelDistribution: [],
        modalityDistribution: [],
        insights: [],
      });
    },
    async () => {
      const result = await AdminAnalyticsService.fetchOverview({ timeRange: "daily" });

      assert.equal(result.summary.totalRequests, 7);
      assert.equal(result.summary.totalTokens, 2300);
      assert.equal(result.userRankings.points[0].userName, "alice");
      assert.ok(result.trend.length > 0);
      assert.ok(result.modelDistribution.length > 0);
      assert.ok(result.modalityDistribution.length > 0);
      assert.ok(result.insights.length > 0);
      assert.deepEqual(result.modelDistribution.map((item) => item.name), ["gpt-4o"]);
      assert.deepEqual(result.modalityDistribution.map((item) => item.name), ["text"]);
    },
  );
});

test("admin analytics package is routed as a compact statistics workspace", () => {
  const appSource = readFileSync(new URL("./src/App.tsx", import.meta.url), "utf8");
  const moduleRegistrySource = readAdminModuleRegistrySource();
  const packageJson = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8")) as { dependencies: Record<string, string> };
  const source = readAdminAnalyticsSource();
  const serviceSource = readAdminAnalyticsServiceSource();

  assert.equal(packageJson.dependencies["sdkwork-clawrouter-pc-admin-analytics"], "workspace:*");
  assert.match(appSource, /import\('sdkwork-clawrouter-pc-admin-analytics'\)/);
  assert.match(appSource, /<Route path="analytics" element=\{<AnalyticsAdmin \/>}/);
  assert.match(moduleRegistrySource, /path:\s*'\/admin\/analytics'/);
  assert.match(moduleRegistrySource, /labelKey:\s*'admin\.menu\.analytics'/);
  assert.match(source, /AdminAnalyticsService\.fetchOverview/);
  assert.match(source, /data-admin-analytics-sidebar/);
  assert.match(source, /data-admin-analytics-table/);
  assert.match(source, /className="flex min-h-\[320px\] max-h-\[min\(640px,calc\(100dvh-260px\)\)\] flex-col overflow-hidden/);
  assert.match(source, /className="min-h-0 flex-1 overflow-auto"/);
  assert.match(source, /data-admin-analytics-metric-card/);
  assert.match(source, /admin\.analytics\.states\.loadingShort/);
  assert.doesNotMatch(source, /Math\.random|generateFake|mockAnalytics/i);
  assert.match(source, /admin\.analytics\.states\.noTrend/);
  assert.match(source, /admin\.analytics\.states\.noModelDistribution/);
  assert.match(source, /admin\.analytics\.states\.noUsers/);
  assert.match(source, /admin\.analytics\.states\.noModels/);
  assert.doesNotMatch(source, /title="(?:Loading analytics|No distribution data)/);
  assert.doesNotMatch(serviceSource, /sdkwork-clawrouter-pc-commons\/runtime/);
  assert.doesNotMatch(serviceSource, /Request success rate|Derived from normalized backend analytics summary/);
  assert.match(serviceSource, /admin\.analytics\.insights\.requestSuccessRate\.title/);
  assert.match(serviceSource, /admin\.analytics\.insights\.requestSuccessRate\.detail/);
});

test("admin analytics page localizes controls, generated labels, and backend category sentinels", () => {
  const source = readAdminAnalyticsSource();
  const serviceSource = readAdminAnalyticsServiceSource();
  const i18nSource = readI18nSource();

  const requiredAnalyticsKeys = new Set([
    "admin.analytics.rankMetric.points",
    "admin.analytics.rankMetric.tokens",
    "admin.analytics.rankMetric.requests",
    "admin.analytics.sections.overview",
    "admin.analytics.sections.users",
    "admin.analytics.sections.models",
    "admin.analytics.sections.distributions",
    "admin.analytics.sections.insights",
    "admin.analytics.timeRange.hourly",
    "admin.analytics.timeRange.daily",
    "admin.analytics.timeRange.weekly",
    "admin.analytics.timeRange.monthly",
    "admin.analytics.timeRange.yearly",
    "admin.analytics.insights.title",
    "admin.analytics.labels.unknown",
    "admin.analytics.labels.others",
    "admin.analytics.modality.text",
    "admin.analytics.modality.image",
    "admin.analytics.modality.video",
    "admin.analytics.modality.audio",
    "admin.analytics.modality.music",
    "admin.analytics.modality.embedding",
  ]);
  const staticAnalyticsKeyPattern = /admin\.analytics\.[A-Za-z0-9.]+/g;
  for (const analyticsSource of [source, serviceSource]) {
    for (const match of analyticsSource.matchAll(staticAnalyticsKeyPattern)) {
      const rawKey = match[0];
      if (!rawKey.endsWith(".")) {
        requiredAnalyticsKeys.add(rawKey);
      }
    }
  }

  for (const key of requiredAnalyticsKeys) {
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    assert.equal(
      i18nSource.match(new RegExp(`"${escapedKey}"\\s*:`, "g"))?.length,
      2,
      `${key} must be present in both English and Chinese analytics resources`,
    );
  }

  assert.match(source, /translateAnalyticsLabel/);
  assert.match(source, /translateAnalyticsLabel\(item\.modality,\s*t\)/);
  assert.match(source, /<AnalyticsTooltip\s+t=\{t\}/);
  assert.match(source, /<InlineDistribution\s+data=\{item\.modelDistribution\}\s+t=\{t\}/);
  assert.match(source, /i18n\.resolvedLanguage/);
  assert.doesNotMatch(source, /toLocaleString\('en-US'/);

  assert.doesNotMatch(serviceSource, /createSeededOverview|createSeededDistribution|seedModelPrimary|seedModalityText|Model A|\$\{name\} 2/);
  assert.doesNotMatch(i18nSource, /admin\.analytics\.labels\.seed/);
});

test("admin analytics contracts declare the route, SDK runtime, table sources, and all exported view models", () => {
  const contractSource = readAdminAnalyticsContractSource();
  const classificationSource = readAdminAnalyticsRouteClassificationSource();
  const tableRegistrySource = readClawRouterTablesRegistrySource();
  const schemaManifestSource = readSchemaManifestSource();
  const analyticsSourcePath = "apps/sdkwork-clawrouter-pc/packages/sdkwork-clawrouter-pc-admin-analytics/src/analyticsService.ts";

  for (const interfaceName of [
    "AdminAnalyticsQuery",
    "PieChartData",
    "AdminAnalyticsSummary",
    "AdminAnalyticsTrendPoint",
    "AdminAnalyticsUserRankItem",
    "AdminAnalyticsModelRankItem",
    "AdminAnalyticsInsight",
    "AdminAnalyticsOverview",
  ]) {
    assert.match(
      contractSource,
      new RegExp(
        `(?:^|\\r?\\n)\\s*- route: \\/admin\\/analytics\\r?\\n\\s+source: ${analyticsSourcePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\r?\\n\\s+interface: ${interfaceName}\\r?\\n`,
      ),
    );
  }

  assert.match(contractSource, /interface: AdminAnalyticsOverview[\s\S]*?modelDistribution\.name[\s\S]*?insights\.detail/);
  assert.doesNotMatch(
    contractSource,
    /interface: AdminAnalyticsOverview[\s\S]*?fields: \[[^\]]*userRankings\.points[^\]]*\]/,
  );

  assert.match(
    classificationSource,
    /route: \/admin\/analytics[\s\S]*?package: sdkwork-clawrouter-pc-admin-analytics[\s\S]*?delivery_kind: sdk_backed_business_runtime[\s\S]*?api_surface: backend/,
  );

  for (const tableName of ["ai_request_trace", "ai_usage_fact"]) {
    assert.match(
      tableRegistrySource,
      new RegExp(`table: ${tableName}[\\s\\S]*?frontend_routes:\\r?\\n(?:\\s+- [^\\r\\n]+\\r?\\n)*\\s+- \\/admin\\/analytics`),
    );
  }

  const schemaManifest = JSON.parse(schemaManifestSource) as {
    routes: Record<string, { tables: string[]; route_scope: string; required_api_surface: string }>;
  };
  assert.deepEqual(schemaManifest.routes["/admin/analytics"]?.tables, ["ai_request_trace", "ai_usage_fact"]);
  assert.equal(schemaManifest.routes["/admin/analytics"]?.route_scope, "admin");
  assert.equal(schemaManifest.routes["/admin/analytics"]?.required_api_surface, "backend");
});

test("admin dashboard service reads generated backend SDK dashboard data", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      assert.equal(init?.method ?? "GET", "GET");
      assert.equal(url, "/backend/v3/api/system/dashboard/admin/overview");
      return {
        userConsumption: [{ name: "Enterprise", value: 80, color: "#2563eb" }],
        multimodal: [{ name: "image", value: 12, color: "#7c3aed" }],
        traffic: [{ time: "10:00", tokens: 1200, requests: 12, cost: 0.24 }],
        modelDistribution: [{ name: "gpt-4o-mini", value: 55, color: "#16a34a" }],
        recentUsage: [
          {
            id: "usage-1",
            user: "ops@example.com",
            isApiUser: true,
            model: "gpt-4o-mini",
            type: "text",
            billingMode: "tokens",
            usageIn: "128",
            usageOut: 256,
            time: "2026-05-05T08:00:00Z",
            status: "success",
            cost: "0.03",
          },
        ],
      };
    },
    async (captured) => {
      const result = await AdminDashboardService.fetchDashboardData();

      assert.equal(captured.length, 1);
      assert.deepEqual(result.userConsumption.map((item) => item.name), ["Enterprise"]);
      assert.equal(result.traffic[0].tokens, 1200);
      assert.equal(result.recentUsage[0].usageIn, 128);
      assert.equal(result.recentUsage[0].isApiUser, true);
    },
  );
});

test("admin dashboard service derives summary cards from backend snapshot without synthetic traffic", async () => {
  const serviceSource = readFileSync(
    new URL("./packages/sdkwork-clawrouter-pc-admin-dashboard/src/dashboardService.ts", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(serviceSource, /generateTrafficData/);
  assert.doesNotMatch(serviceSource, /Math\.(sin|cos|random)/);

  await withBackendSdkFetch(
    (url) => {
      assert.equal(url, "/backend/v3/api/system/dashboard/admin/overview");
      return {
        userConsumption: [
          { name: "alice@example.com", value: 12.5, color: "#2563eb" },
          { name: "bob@example.com", value: 7.5, color: "#16a34a" },
        ],
        multimodal: [
          { name: "text", value: 3, color: "#2563eb" },
          { name: "image", value: 2, color: "#7c3aed" },
        ],
        traffic: [
          { time: "2026-05-15", tokens: 1500, requests: 3, cost: 0.12 },
          { time: "2026-05-16", tokens: 2500, requests: 5, cost: 0.2 },
        ],
        modelDistribution: [
          { name: "gpt-4o-mini", value: 4, color: "#16a34a" },
          { name: "claude-sonnet", value: 2, color: "#7c3aed" },
        ],
        recentUsage: [
          {
            id: "usage-1",
            user: "alice@example.com",
            isApiUser: true,
            model: "gpt-4o-mini",
            type: "text",
            billingMode: "usage",
            usageIn: 100,
            usageOut: 50,
            usageCount: 2,
            time: "2026-05-16T08:00:00Z",
            status: "success",
            cost: "0.030000",
          },
          {
            id: "usage-2",
            user: "bob@example.com",
            isApiUser: false,
            model: "claude-sonnet",
            type: "image",
            billingMode: "usage",
            usageIn: 10,
            usageOut: 5,
            usageCount: 1,
            time: "2026-05-16T08:01:00Z",
            status: "failed",
            cost: "0.010000",
          },
        ],
      };
    },
    async () => {
      const result = await AdminDashboardService.fetchDashboardData();

      assert.deepEqual(result.traffic, [
        { time: "2026-05-15", tokens: 1500, requests: 3, cost: 0.12 },
        { time: "2026-05-16", tokens: 2500, requests: 5, cost: 0.2 },
      ]);
      assert.deepEqual(
        result.summaryCards.map((card) => [card.label, card.value, card.detail]),
        [
          ["活跃用户", "2", "$20.00 用户消费"],
          ["模型覆盖", "2", "6 次模型调用"],
          ["总请求", "8", "来自后端 traffic 快照"],
          ["总 Tokens", "4K", "累计计费 $0.32"],
          ["模态调用", "5", "2 个模态"],
          ["实时流水", "2", "1 成功 / 1 失败"],
          ["最近 API 调用", "1", "50.0% API Key"],
          ["平均单次成本", "$0.04", "按请求数计算"],
        ],
      );
    },
  );
});

test("admin model form keeps persisted capability fields from the model editor", () => {
  const form = new FormData();
  form.set("model", "gpt-capability-pro");
  form.set("displayName", "GPT Capability Pro");
  form.set("type", "Chat");
  form.set("priceIn.global", "0.120000");
  form.set("priceOut.global", "0.450000");
  form.set("contextTokens", "128k");
  form.set("maxOutputTokens", "8192");
  form.set("description", "Commercial chat model for production traffic.");
  form.set("capabilityIntro", "Low latency chat, structured output, and tool calling.");
  form.set("limitations", "No medical diagnosis, No legal advice");
  form.set("supportedLanguages", "English, Chinese, English");
  form.set("useCases", "Customer support, Data extraction");
  form.set("supportsStreaming", "on");
  form.set("supportsTools", "true");
  form.set("supportsJsonSchema", "1");

  const created = createModelInputFromForm(form, "vendor-1");
  assert.deepEqual(created, {
    vendorId: "vendor-1",
    model: "gpt-capability-pro",
    displayName: "GPT Capability Pro",
    type: "Chat",
    regionPrices: [
      {
        regionCode: "global",
        currency: "USD",
        priceIn: "0.120000",
        priceOut: "0.450000",
        cacheReadPrice: "",
        cacheWritePrice: "",
      },
    ],
    contextTokens: "128k",
    maxOutputTokens: 8192,
    description: "Commercial chat model for production traffic.",
    capabilityIntro: "Low latency chat, structured output, and tool calling.",
    limitations: ["No medical diagnosis", "No legal advice"],
    supportedLanguages: ["English", "Chinese"],
    useCases: ["Customer support", "Data extraction"],
    supportsStreaming: true,
    supportsTools: true,
    supportsJsonSchema: true,
  });

  const currentModel = {
    id: "model-1",
    vendorId: "vendor-1",
    vendorCode: "openai",
    model: "gpt-capability-pro",
    displayName: "GPT Capability Pro",
    name: "gpt-capability-pro",
    type: "Chat",
    regionPrices: [
      {
        regionCode: "global",
        currency: "USD",
        priceIn: "0.120000",
        priceOut: "0.450000",
        cacheReadPrice: "",
        cacheWritePrice: "",
      },
    ],
    status: "active",
    calls: "0",
    description: null,
    modalities: ["text"],
    inputModalities: ["text"],
    outputModalities: ["text"],
    apiFormat: "openai_responses",
    capabilityIntro: null,
    limitations: [],
    supportedLanguages: [],
    useCases: [],
    trainingDataCutoff: null,
    contextTokens: 128000,
    maxOutputTokens: null,
    supportsStreaming: true,
    supportsTools: true,
    supportsJsonSchema: true,
    releaseStage: 1,
    shelfState: 1,
    routingState: 1,
    replacementModel: null,
  } satisfies Model;

  assert.deepEqual(updateModelInputFromForm(form, "vendor-1", currentModel), {
    ...created,
    currentType: "Chat",
  });
});

test("admin model service sends capability fields through the generated backend SDK", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      assert.equal(url, "/backend/v3/api/ai/models");
      assert.equal(init?.method ?? "GET", "POST");
      assert.deepEqual(JSON.parse(String(init?.body ?? "{}")), {
        vendorId: "vendor-1",
        model: "gpt-capability-pro",
        displayName: "GPT Capability Pro",
        type: "Chat",
        regionPrices: [
          {
            regionCode: "global",
            currency: "USD",
            priceIn: "0.120000",
            priceOut: "0.450000",
          },
        ],
        contextTokens: "128k",
        description: "Commercial chat model for production traffic.",
        capabilityIntro: "Low latency chat, structured output, and tool calling.",
        limitations: ["No medical diagnosis", "No legal advice"],
        supportedLanguages: ["English", "Chinese"],
        useCases: ["Customer support", "Data extraction"],
        maxOutputTokens: "8192",
        supportsStreaming: true,
        supportsTools: true,
        supportsJsonSchema: true,
        modalities: ["text"],
        inputModalities: ["text", "image"],
        outputModalities: ["text"],
        apiFormat: "openai_responses",
        releaseStage: "1",
        shelfState: "1",
        routingState: "1",
      });
      return {
        item: {
          id: "model-1",
          vendorId: "vendor-1",
          vendorCode: "openai",
          model: "gpt-capability-pro",
          displayName: "GPT Capability Pro",
          type: "Chat",
          regionPrices: [
            {
              regionCode: "global",
              currency: "USD",
              priceIn: "0.120000",
              priceOut: "0.450000",
              cacheReadPrice: "",
              cacheWritePrice: "",
            },
          ],
          status: "active",
          calls: "0",
          description: "Commercial chat model for production traffic.",
          modalities: ["text"],
          inputModalities: ["text", "image"],
          outputModalities: ["text"],
          apiFormat: "openai_responses",
          capabilityIntro: "Low latency chat, structured output, and tool calling.",
          limitations: ["No medical diagnosis", "No legal advice"],
          supportedLanguages: ["English", "Chinese"],
          useCases: ["Customer support", "Data extraction"],
          trainingDataCutoff: null,
          contextTokens: 128000,
          maxOutputTokens: 8192,
          supportsStreaming: true,
          supportsTools: true,
          supportsJsonSchema: true,
          releaseStage: 1,
          shelfState: 1,
          routingState: 1,
          replacementModel: null,
        },
      };
    },
    async () => {
      const result = await ModelService.addModel({
        vendorId: "vendor-1",
        model: "gpt-capability-pro",
        displayName: "GPT Capability Pro",
        type: "Chat",
        regionPrices: [
          {
            regionCode: "global",
            currency: "USD",
            priceIn: "0.120000",
            priceOut: "0.450000",
          },
        ],
        contextTokens: "128k",
        description: "Commercial chat model for production traffic.",
        capabilityIntro: "Low latency chat, structured output, and tool calling.",
        limitations: ["No medical diagnosis", "No legal advice"],
        supportedLanguages: ["English", "Chinese"],
        useCases: ["Customer support", "Data extraction"],
        maxOutputTokens: 8192,
        supportsStreaming: true,
        supportsTools: true,
        supportsJsonSchema: true,
      });

      assert.equal(result.maxOutputTokens, 8192);
      assert.equal(result.supportsTools, true);
    },
  );
});
test("admin finance uses standard commerce management resources without legacy billing routes", async () => {
  const source = readAdminFinanceSource();
  const serviceSource = readFileSync(
    new URL("./packages/sdkwork-clawrouter-pc-admin-finance/src/financeService.ts", import.meta.url),
    "utf8",
  );

  assert.match(source, /AdminResourceCenter/);
  assert.match(source, /backendInvoicesTitlesList\(DEFAULT_PAGE_PARAMS\)/);
  assert.match(source, /backendCommerceReportsOrderRevenueList\(DEFAULT_PAGE_PARAMS\)/);
  assert.match(serviceSource, /getSdkworkCommerceService\(\)\.admin\.invoices\.titles\.list/);
  assert.match(serviceSource, /getSdkworkCommerceService\(\)\.admin\.commerceReports\.orderRevenue\.list/);
  assert.match(serviceSource, /getSdkworkCommerceService\(\)\.admin\.commerceReports\.refunds\.list/);
  assert.match(serviceSource, /getSdkworkCommerceService\(\)\.admin\.audit\.commerceEvents\.list/);
  assert.doesNotMatch(serviceSource, /getClawRouterBackendSdkClient\(\)\.commerce/);
  assert.doesNotMatch(serviceSource, /billing\/finance/);

  await withBackendSdkFetch(
    (url) => {
      if (url === "/backend/v3/api/invoices/titles?page=1&page_size=100") {
        return { items: [{ title_no: "title-1", owner_user_id: "user-1", invoice_type: "company", tax_no: "tax-1", status: "active" }] };
      }
      if (url === "/backend/v3/api/commerce_reports/order_revenue?page=1&page_size=100") {
        return { items: [{ period: "2026-05", order_count: 3, gross_amount: "99.00", currency_code: "CNY", product_type: "membership" }] };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async (captured) => {
      await backendInvoicesTitlesList({ page: 1, pageSize: 100 });
      await backendCommerceReportsOrderRevenueList({ page: 1, pageSize: 100 });

      assert.deepEqual(captured.map((request) => request.url), [
        "/backend/v3/api/invoices/titles?page=1&page_size=100",
        "/backend/v3/api/commerce_reports/order_revenue?page=1&page_size=100",
      ]);
    },
  );
});

test("admin orders exposes real order, refund, fulfillment, and shipment management actions", () => {
  const source = readAdminOrdersSource();
  const serviceSource = readFileSync(
    new URL("./packages/sdkwork-clawrouter-pc-admin-orders/src/ordersService.ts", import.meta.url),
    "utf8",
  );

  for (const expected of [
    "backendOrdersManagementCancel",
    "backendOrdersManagementClose",
    "backendRefundApprovalCreate",
    "backendRefundAttemptCreate",
    "backendFulfillmentCreate",
    "backendFulfillmentUpdate",
    "backendFulfillmentShipmentCreate",
    "backendFulfillmentShipmentUpdate",
    "backendFulfillmentTrackingEventCreate",
    "getSdkworkCommerceService().admin.orders.management.cancel",
    "getSdkworkCommerceService().admin.orders.management.close",
    "getSdkworkCommerceService().admin.refunds.approvals.create",
    "getSdkworkCommerceService().admin.refunds.attempts.create",
    "getSdkworkCommerceService().admin.fulfillments.shipments.create",
    "getSdkworkCommerceService().admin.fulfillments.shipments.update",
    "getSdkworkCommerceService().admin.fulfillments.trackingEvents.create",
  ]) {
    assert.match(serviceSource, new RegExp(escapeRegExp(expected)));
  }

  for (const expected of [
    "handleOrderManagementCancel",
    "handleOrderManagementClose",
    "handleRefundApproval",
    "handleRefundAttempt",
    "handleFulfillmentShipmentCreate",
    "handleFulfillmentShipmentUpdate",
    "handleShipmentTrackingEventCreate",
    "Cancel order",
    "Close order",
    "Approve refund",
    "Reject refund",
    "Execute refund",
    "Create shipment",
    "Mark shipped",
    "Add tracking",
  ]) {
    assert.match(source, new RegExp(escapeRegExp(expected)));
  }

  for (const expected of [
    "ConfirmDialog",
    "orderActionConfirmation",
    "executeConfirmedOrderAction",
    "data-admin-orders-layout",
    "data-admin-order-action-feedback",
    "data-admin-order-shipment-form",
    "data-admin-order-tracking-form",
    "submitOrderShipmentForm",
    "submitOrderTrackingForm",
  ]) {
    assert.match(source, new RegExp(escapeRegExp(expected)));
  }

  assert.doesNotMatch(source + serviceSource, /noopOrderAction/);
  assert.doesNotMatch(source + serviceSource, /Backend cancellation API is not available yet/);
  assert.doesNotMatch(source, /window\.(?:confirm|prompt|alert)/);
  assert.doesNotMatch(source, /confirmOrderAction|readPromptValue|reportOrderActionError/);
  assert.doesNotMatch(source + serviceSource, /\bfetch\s*\(|axios|XMLHttpRequest/);
  assert.doesNotMatch(source + serviceSource, /getClawRouterBackendSdkClient/);
});

test("admin dashboard live traces link to full records and render backend status", () => {
  const source = readAdminDashboardSource();

  assert.match(source, /import \{ Link \} from 'react-router-dom'/);
  assert.match(source, /<Link\s+to="\/admin\/record"/);
  assert.doesNotMatch(source, /<button className="text-xs text-blue-500/);
  assert.match(source, /className="min-h-0 flex-1 overflow-auto"/);
  assert.match(source, /className="bg-white dark:bg-\[#1a1a1a\] border border-slate-200 dark:border-white\/10 rounded-xl p-5 shadow-sm shrink-0 flex min-h-\[320px\] flex-1 flex-col overflow-hidden mt-2"/);
  assert.match(source, /item\.status\.trim\(\)\.toLowerCase\(\) === 'success'/);
  assert.match(source, /item\.status\.trim\(\) \|\| 'unknown'/);
  assert.doesNotMatch(source, /<div className="w-1\.5 h-1\.5 rounded-full bg-emerald-500" \/> 成功/);
});

test("admin monitor service reads nodes alerts and performance through backend SDK paths", async () => {
  await withBackendSdkFetch(
    (url) => {
      if (url === "/backend/v3/api/system/monitor/nodes") {
        return {
          items: [
            {
              id: "node-1",
              name: "edge-shanghai",
              region: "cn-east",
              status: "warning",
              cpu: "72.5",
              memory: 61,
              uptime: "99.99%",
              ip: "10.0.0.10",
            },
          ],
        };
      }
      if (url === "/backend/v3/api/system/monitor/alerts") {
        return {
          items: [
            {
              id: "alert-1",
              severity: "critical",
              title: "High latency",
              message: "P95 latency exceeded threshold",
              time: "2026-05-05T08:00:00Z",
              status: "resolved",
              source: "gateway",
            },
          ],
        };
      }
      if (url === "/backend/v3/api/system/monitor/performance") {
        return {
          items: [{ time: "10:00", cpu: 70, memory: "64", network: 220 }],
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async (captured) => {
      const nodes = await MonitorService.fetchNodes();
      const alerts = await MonitorService.fetchAlerts();
      const performance = await MonitorService.fetchPerformanceData();

      assert.deepEqual(captured.map((request) => request.url), [
        "/backend/v3/api/system/monitor/nodes",
        "/backend/v3/api/system/monitor/alerts",
        "/backend/v3/api/system/monitor/performance",
      ]);
      assert.equal(nodes[0].status, "warning");
      assert.equal(nodes[0].cpu, 72.5);
      assert.equal(alerts[0].severity, "critical");
      assert.equal(alerts[0].status, "resolved");
      assert.equal(performance[0].memory, 64);
    },
  );
});

test("admin service node management is independently routed under operations and declared in contracts", () => {
  const appSource = readAppSource();
  const moduleRegistrySource = readAdminModuleRegistrySource();
  const packageJson = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8")) as {
    dependencies: Record<string, string>;
  };
  const i18nSource = readI18nSource();
  const contractSource = readFrontendContractSource();
  const tableRegistrySource = readClawRouterTablesRegistrySource();
  const serviceNodesSource = readAdminServiceNodesSource();
  const serviceNodesServiceSource = readAdminServiceNodesServiceSource();

  assert.equal(packageJson.dependencies["sdkwork-clawrouter-pc-admin-service-nodes"], "workspace:*");
  assert.match(appSource, /const ServiceNodesAdmin = lazyRoute\(\(\) => import\('sdkwork-clawrouter-pc-admin-service-nodes'\), 'ServiceNodesAdmin'\);/);
  assert.match(appSource, /<Route path="service-nodes" element=\{<ServiceNodesAdmin \/>} \/>/);
  assert.match(moduleRegistrySource, /pathPrefixes:\s*\[[^\]]*'\/admin\/service-nodes'/);
  assert.match(moduleRegistrySource, /groupBlock\('admin\.menu\.ops\.infrastructure'[\s\S]*path:\s*'\/admin\/service-nodes'[\s\S]*labelKey:\s*'admin\.menu\.serviceNodes'/);
  assert.equal(i18nSource.match(/"admin\.menu\.serviceNodes"\s*:/g)?.length, 2);
  assert.equal(i18nSource.match(/"admin\.serviceNodes\.actions\.search"\s*:/g)?.length, 2);
  assert.equal(i18nSource.match(/"admin\.serviceNodes\.metrics\.total"\s*:/g)?.length, 2);
  assert.equal(i18nSource.match(/"admin\.serviceNodes\.states\.emptyDesc"\s*:/g)?.length, 2);
  assert.match(contractSource, /operation_id: serviceNodes\.list/);
  assert.match(contractSource, /operation_id: serviceNodes\.create/);
  assert.match(contractSource, /operation_id: serviceNodes\.update/);
  assert.match(contractSource, /operation_id: serviceNodes\.status\.update/);
  assert.match(contractSource, /operation_id: serviceNodes\.delete/);
  assert.match(
    tableRegistrySource,
    /table: ops_gateway_instance[\s\S]*?frontend_routes:\r?\n(?:\s+- [^\r\n]+\r?\n)*\s+- \/admin\/service-nodes/,
  );
  assert.match(serviceNodesSource, /AdminTableShell/);
  assert.match(serviceNodesSource, /data-admin-service-nodes-table-card/);
  assert.match(serviceNodesSource, /data-admin-service-nodes-table-viewport/);
  assert.match(serviceNodesSource, /className="flex-1 min-h-0 rounded-xl dark:bg-\[#1a1a1a\]"/);
  assert.match(serviceNodesSource, /viewportClassName="min-h-0 flex-1 relative"/);
  assert.match(serviceNodesSource, /ServiceNodeService\.fetchNodes/);
  assert.match(serviceNodesSource, /ServiceNodeService\.createNode/);
  assert.match(serviceNodesSource, /ServiceNodeService\.updateNodeStatus/);
  assert.match(serviceNodesSource, /ServiceNodeService\.deleteNode/);
  assert.match(serviceNodesSource, /placeholder=\{t\('admin\.serviceNodes\.search\.placeholder'/);
  assert.match(serviceNodesSource, /admin\.serviceNodes\.actions\.search/);
  assert.match(serviceNodesSource, /max-h-\[calc\(100vh-2rem\)\]/);
  assert.match(serviceNodesSource, /overflow-y-auto/);
  assert.doesNotMatch(serviceNodesServiceSource, /\bfetch\(|axios|XMLHttpRequest|Authorization/);
  assert.match(serviceNodesServiceSource, /getClawRouterBackendSdkClient\(\)\.system\.serviceNodes\./);
});

test("admin service node service performs full CRUD through generated backend SDK paths", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      const method = init?.method ?? "GET";
      const parsed = new URL(url, "http://localhost");
      if (method === "GET" && parsed.pathname === "/backend/v3/api/system/service_nodes") {
        assert.equal(parsed.searchParams.get("q"), "shanghai");
        assert.equal(parsed.searchParams.get("status"), "enabled");
        return {
          items: [
            {
              id: "node-1",
              name: "edge-shanghai-01",
              domain: "edge-shanghai.example.com",
              ip: "10.0.0.10",
              remark: "Shanghai relay node",
              status: "enabled",
              healthStatus: "online",
              updatedAt: "2026-05-26T08:00:00Z",
            },
          ],
        };
      }
      if (method === "POST" && parsed.pathname === "/backend/v3/api/system/service_nodes") {
        assert.match(String(init?.body ?? ""), /"name":"edge-beijing-01"/);
        assert.match(String(init?.body ?? ""), /"domain":"edge-beijing\.example\.com"/);
        assert.match(String(init?.body ?? ""), /"ip":"10\.0\.1\.10"/);
        return {
          item: {
            id: "node-2",
            name: "edge-beijing-01",
            domain: "edge-beijing.example.com",
            ip: "10.0.1.10",
            remark: "Beijing relay node",
            status: "enabled",
            healthStatus: "unknown",
            updatedAt: "2026-05-26T08:10:00Z",
          },
        };
      }
      if (method === "PUT" && parsed.pathname === "/backend/v3/api/system/service_nodes/node-1") {
        assert.match(String(init?.body ?? ""), /"remark":"Primary Shanghai relay"/);
        return {
          item: {
            id: "node-1",
            name: "edge-shanghai-01",
            domain: "edge-shanghai.example.com",
            ip: "10.0.0.10",
            remark: "Primary Shanghai relay",
            status: "enabled",
            healthStatus: "online",
            updatedAt: "2026-05-26T08:20:00Z",
          },
        };
      }
      if (method === "PUT" && parsed.pathname === "/backend/v3/api/system/service_nodes/node-1/status") {
        assert.match(String(init?.body ?? ""), /"status":"disabled"/);
        return {
          item: {
            id: "node-1",
            name: "edge-shanghai-01",
            domain: "edge-shanghai.example.com",
            ip: "10.0.0.10",
            remark: "Primary Shanghai relay",
            status: "disabled",
            healthStatus: "offline",
            updatedAt: "2026-05-26T08:30:00Z",
          },
        };
      }
      if (method === "DELETE" && parsed.pathname === "/backend/v3/api/system/service_nodes/node-1") {
        return { deleted: true };
      }
      throw new Error(`unexpected service node SDK request: ${method} ${url}`);
    },
    async (captured) => {
      const nodes = await ServiceNodeService.fetchNodes({ search: "shanghai", status: "enabled" });
      const created = await ServiceNodeService.createNode({
        name: "edge-beijing-01",
        domain: "edge-beijing.example.com",
        ip: "10.0.1.10",
        remark: "Beijing relay node",
        status: "enabled",
      });
      const updated = await ServiceNodeService.updateNode("node-1", {
        remark: "Primary Shanghai relay",
      });
      const disabled = await ServiceNodeService.updateNodeStatus("node-1", "disabled");
      const deleted = await ServiceNodeService.deleteNode("node-1");

      assert.deepEqual(captured.map((request) => [request.method, request.url]), [
        ["GET", "/backend/v3/api/system/service_nodes?q=shanghai&status=enabled"],
        ["POST", "/backend/v3/api/system/service_nodes"],
        ["PUT", "/backend/v3/api/system/service_nodes/node-1"],
        ["PUT", "/backend/v3/api/system/service_nodes/node-1/status"],
        ["DELETE", "/backend/v3/api/system/service_nodes/node-1"],
      ]);
      assert.equal(nodes[0].domain, "edge-shanghai.example.com");
      assert.equal(nodes[0].healthStatus, "online");
      assert.equal(created.id, "node-2");
      assert.equal(updated.remark, "Primary Shanghai relay");
      assert.equal(disabled.status, "disabled");
      assert.equal(deleted.deleted, true);
    },
  );
});

test("admin service node service validates commands before generated SDK calls", async () => {
  await withBackendSdkFetch(
    () => {
      throw new Error("backend SDK must not be called for invalid service node commands");
    },
    async (captured) => {
      await assert.rejects(() => ServiceNodeService.fetchNodes({ search: "x".repeat(129) }), /search must be visible text and at most 128 characters/);
      await assert.rejects(() => ServiceNodeService.fetchNodes({ search: "bad\nterm" }), /search must be visible text and at most 128 characters/);
      await assert.rejects(() => ServiceNodeService.createNode({ name: "", domain: "edge.example.com", ip: "10.0.0.1", remark: "" }), /name is required/);
      await assert.rejects(() => ServiceNodeService.createNode({ name: "edge", domain: "bad domain", ip: "10.0.0.1", remark: "" }), /domain must be a hostname or URL host/);
      await assert.rejects(() => ServiceNodeService.createNode({ name: "edge", domain: "localhost", ip: "10.0.0.1", remark: "" }), /domain must be a hostname or URL host/);
      await assert.rejects(() => ServiceNodeService.createNode({ name: "edge", domain: "edge.example.com", ip: "", remark: "" }), /ip is required/);
      await assert.rejects(() => ServiceNodeService.createNode({ name: "edge", domain: "edge.example.com", ip: "999.0.0.1", remark: "" }), /ip must be a valid IPv4 or IPv6 address/);
      await assert.rejects(() => ServiceNodeService.createNode({ name: "edge\ninvalid", domain: "edge.example.com", ip: "10.0.0.1", remark: "" }), /name must be visible text and at most 128 characters/);
      await assert.rejects(() => ServiceNodeService.updateNode("", { remark: "x" }), /node id is required/);
      await assert.rejects(() => ServiceNodeService.updateNode("node-1", { status: "disabled" }), /status must be changed through updateNodeStatus/);
      await assert.rejects(() => ServiceNodeService.updateNodeStatus("node-1", "paused" as never), /Unsupported service node status/);
      await assert.rejects(() => ServiceNodeService.deleteNode(""), /node id is required/);
      assert.equal(captured.length, 0);
    },
  );
});

test("admin service node service supports localized names and search terms through generated backend SDK", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      const method = init?.method ?? "GET";
      const parsed = new URL(url, "http://localhost");
      if (method === "GET" && parsed.pathname === "/backend/v3/api/system/service_nodes") {
        assert.equal(parsed.searchParams.get("q"), "上海边缘");
        return {
          items: [
            {
              id: "node-cn-1",
              name: "上海边缘节点",
              domain: "edge-shanghai.example.com",
              ip: "2001:db8::1",
              remark: "华东主节点",
              status: "enabled",
              healthStatus: "online",
              updatedAt: "2026-05-26T08:45:00Z",
            },
          ],
        };
      }
      if (method === "POST" && parsed.pathname === "/backend/v3/api/system/service_nodes") {
        const body = JSON.parse(String(init?.body ?? "{}")) as Record<string, unknown>;
        assert.equal(body.name, "上海边缘节点");
        assert.equal(body.domain, "edge-shanghai.example.com");
        assert.equal(body.ip, "2001:db8::1");
        assert.equal(body.remark, "华东主节点");
        return {
          item: {
            id: "node-cn-2",
            name: "上海边缘节点",
            domain: "edge-shanghai.example.com",
            ip: "2001:db8::1",
            remark: "华东主节点",
            status: "enabled",
            healthStatus: "unknown",
            updatedAt: "2026-05-26T08:50:00Z",
          },
        };
      }
      throw new Error(`unexpected service node SDK request: ${method} ${url}`);
    },
    async (captured) => {
      const nodes = await ServiceNodeService.fetchNodes({ search: " 上海边缘 " });
      const created = await ServiceNodeService.createNode({
        name: " 上海边缘节点 ",
        domain: "https://EDGE-SHANGHAI.EXAMPLE.COM/admin",
        ip: "2001:db8::1",
        remark: " 华东主节点 ",
        status: "enabled",
      });

      assert.deepEqual(captured.map((request) => [request.method, new URL(request.url, "http://localhost").pathname]), [
        ["GET", "/backend/v3/api/system/service_nodes"],
        ["POST", "/backend/v3/api/system/service_nodes"],
      ]);
      assert.equal(nodes[0].name, "上海边缘节点");
      assert.equal(created.name, "上海边缘节点");
    },
  );
});

test("admin service node service supports clearing optional remarks through generated backend SDK", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      const method = init?.method ?? "GET";
      const parsed = new URL(url, "http://localhost");
      if (method === "PUT" && parsed.pathname === "/backend/v3/api/system/service_nodes/node-1") {
        assert.equal(String(init?.body ?? ""), "{\"remark\":\"\"}");
        return {
          item: {
            id: "node-1",
            name: "edge-shanghai-01",
            domain: "edge-shanghai.example.com",
            ip: "10.0.0.10",
            remark: "",
            status: "enabled",
            healthStatus: "online",
            updatedAt: "2026-05-26T08:40:00Z",
          },
        };
      }
      throw new Error(`unexpected service node SDK request: ${method} ${url}`);
    },
    async () => {
      const updated = await ServiceNodeService.updateNode("node-1", { remark: "" });
      assert.equal(updated.remark, "");
    },
  );
});

test("admin record service reads backend logs and total from generated backend SDK data", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      const requestUrl = new URL(url, "http://localhost");
      assert.equal(requestUrl.pathname, "/backend/v3/api/system/records");
      assert.equal(init?.method ?? "GET", "GET");
      assert.equal(requestUrl.searchParams.get("user"), "user-1");
      assert.equal(requestUrl.searchParams.get("model"), "gpt-4o-mini");
      assert.equal(typeof init?.body === "string" ? init.body : "", "");
      return {
        total: "1",
        logs: [
          {
            id: "log-1",
            user: "user-1",
            requestId: "req-1",
            time: "2026-05-05T08:00:00Z",
            tokenName: "prod-key",
            group: "default",
            type: "chat",
            model: "gpt-4o-mini",
            providerNativeModel: "gpt-4o-mini-2026-05-13",
            requestedModelCatalogKey: "openai/gpt-4o-mini",
            status: "success",
            httpStatus: 200,
            httpMethod: "POST",
            errorCode: "",
            errorType: "",
            errorMessage: "",
            totalTime: "120ms",
            ttft: "30ms",
            isStream: true,
            inputTokens: "100",
            cacheReadTokens: 20,
            outputTokens: 40,
            cost: "0.012345",
            multiplier: "1.5",
            baseInputPrice: "0.15",
            baseOutputPrice: "0.6",
            cacheReadPrice: "0.02",
            path: "/v1/chat/completions",
            reasoningEffort: "medium",
            ip: "10.0.0.11",
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0.0.0",
          },
        ],
      };
    },
    async (captured) => {
      const result = await RecordService.fetchLogs({ user: "user-1", model: "gpt-4o-mini" });

      assert.equal(captured.length, 1);
      assert.equal(result.total, 1);
      assert.equal(result.logs[0].requestId, "req-1");
      assert.equal(result.logs[0].inputTokens, 100);
      assert.equal(result.logs[0].isStream, true);
      assert.equal(result.logs[0].cost, "0.012345");
      assert.equal(result.logs[0].providerNativeModel, "gpt-4o-mini-2026-05-13");
      assert.equal(result.logs[0].requestedModelCatalogKey, "openai/gpt-4o-mini");
      assert.equal(result.logs[0].status, "success");
      assert.equal(result.logs[0].httpStatus, 200);
      assert.equal(result.logs[0].httpMethod, "POST");
      assert.equal(result.logs[0].errorCode, "");
      assert.equal(result.logs[0].errorType, "");
      assert.equal(result.logs[0].errorMessage, "");
      assert.equal(result.logs[0].path, "/v1/chat/completions");
      assert.equal(result.logs[0].userAgent, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0.0.0");
    },
  );
});

test("admin record service exposes console-aligned request and error audit fields", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      if (isSystemRecordsRequest(url, init)) {
        return {
          total: 1,
          logs: [
            {
              id: "log-err-1",
              user: "ops@example.com",
              requestId: "req-error-1",
              time: "2026-05-05T08:00:00Z",
              tokenName: "prod-key",
              group: "default",
              type: "chat",
              model: "gpt-4o-mini",
              providerNativeModel: "gpt-4o-mini-2026-05-13",
              requestedModelCatalogKey: "openai/gpt-4o-mini",
              status: "error",
              httpStatus: 429,
              httpMethod: "POST",
              errorCode: "rate_limit_exceeded",
              errorType: "provider_error",
              errorMessage: "Provider quota exceeded",
              totalTime: "120ms",
              ttft: "30ms",
              isStream: false,
              inputTokens: 100,
              cacheReadTokens: 20,
              outputTokens: 40,
              cost: "0.012345",
              multiplier: "1.5",
              baseInputPrice: "0.15",
              baseOutputPrice: "0.6",
              cacheReadPrice: "0.02",
              path: "/v1/chat/completions",
              reasoningEffort: "medium",
              ip: "10.0.0.11",
              userAgent: "curl/8.7.1",
            },
          ],
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      const result = await RecordService.fetchLogs();
      const log = result.logs[0];

      assert.equal(log.status, "error");
      assert.equal(log.httpStatus, 429);
      assert.equal(log.httpMethod, "POST");
      assert.equal(log.errorCode, "rate_limit_exceeded");
      assert.equal(log.errorType, "provider_error");
      assert.equal(log.errorMessage, "Provider quota exceeded");
      assert.equal(log.providerNativeModel, "gpt-4o-mini-2026-05-13");
      assert.equal(log.requestedModelCatalogKey, "openai/gpt-4o-mini");
      assert.equal(log.path, "/v1/chat/completions");
      assert.equal(log.userAgent, "curl/8.7.1");
    },
  );
});

test("admin record service normalizes log filters before generated backend SDK call", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      const requestUrl = new URL(url, "http://localhost");
      assert.equal(requestUrl.pathname, "/backend/v3/api/system/records");
      assert.equal(init?.method ?? "GET", "GET");
      assert.equal(requestUrl.searchParams.get("page"), "2");
      assert.equal(requestUrl.searchParams.get("page_size"), "200");
      assert.equal(requestUrl.searchParams.get("user"), "owner@example.com");
      assert.equal(requestUrl.searchParams.get("token"), "prod-key");
      assert.equal(requestUrl.searchParams.get("model"), "gpt-4o-mini");
      assert.equal(requestUrl.searchParams.has("pageNo"), false);
      return { total: 0, logs: [] };
    },
    async (captured) => {
      const result = await RecordService.fetchLogs({
        page: "2",
        pageSize: "200",
        user: " owner@example.com ",
        token: " prod-key ",
        model: " gpt-4o-mini ",
        ignored: "drop-me",
        empty: "",
      });

      assert.equal(captured.length, 1);
      assert.equal(result.total, 0);
      assert.deepEqual(result.logs, []);
    },
  );
});

test("admin record page uses backend-backed pagination instead of static fake pages", () => {
  const source = readAdminRecordSource();

  assert.match(source, /const \[page, setPage\] = useState\(1\)/);
  assert.match(source, /const \[pageSize, setPageSize\] = useState\(20\)/);
  assert.match(source, /RecordService\.fetchLogs\(\{ \.\.\.filters, page, pageSize \}\)/);
  assert.match(source, /onClick=\{\(\) => setPage\(\(current\) => Math\.max\(1, current - 1\)\)\}/);
  assert.match(source, /onClick=\{\(\) => setPage\(\(current\) => Math\.min\(totalPages, current \+ 1\)\)\}/);
  assert.match(source, /value=\{pageSize\}/);
  assert.match(source, /onChange=\{\(event\) => \{/);
  assert.equal(source.includes(">2</button>"), false);
  assert.equal(source.includes(">325</button>"), false);
  assert.equal(source.includes("<SlidersHorizontal"), false);
  assert.equal(source.includes("readOnly"), false);
});

test("admin monitor page exposes only local filters and no unsupported alert mutations", () => {
  const source = readAdminMonitorSource();

  assert.match(source, /const \[nodeSearch, setNodeSearch\] = useState\(''\)/);
  assert.match(source, /const filteredNodes = nodes\.filter/);
  assert.match(source, /value=\{nodeSearch\}/);
  assert.match(source, /onChange=\{\(event\) => setNodeSearch\(event\.target\.value\)\}/);
  assert.match(source, /const \[severityFilter, setSeverityFilter\] = useState<'all' \| Alert\['severity'\]>\('all'\)/);
  assert.match(source, /const \[statusFilter, setStatusFilter\] = useState<'all' \| Alert\['status'\]>\('all'\)/);
  assert.match(source, /const filteredAlerts = alerts\.filter/);
  assert.match(source, /Critical Alerts/);
  assert.match(source, /alerts\.filter\(\(alert\) => alert\.severity === 'critical' && alert\.status === 'active'\)\.length/);
  assert.equal(source.includes("Acknowledge"), false);
  assert.equal(source.includes("value: '1,248'"), false);
  assert.equal(source.includes("value: '98.5%'"), false);
});

test("admin record service rejects invalid log filters before generated backend SDK call", async () => {
  await withBackendSdkFetch(
    () => {
      throw new Error("backend SDK must not be called for invalid record log filters");
    },
    async (captured) => {
      await assert.rejects(() => RecordService.fetchLogs({ page: 0 }), /page must be a positive integer/);
      await assert.rejects(() => RecordService.fetchLogs({ pageSize: 0 }), /pageSize must be between 1 and 200/);
      await assert.rejects(() => RecordService.fetchLogs({ pageSize: 201 }), /pageSize must be between 1 and 200/);
      await assert.rejects(
        () => RecordService.fetchLogs({ user: "x".repeat(129) }),
        /user must be visible ASCII and at most 128 characters/,
      );
      await assert.rejects(
        () => RecordService.fetchLogs({ model: "bad\u0001model" }),
        /model must be visible ASCII and at most 128 characters/,
      );
      await assert.rejects(
        () => RecordService.fetchLogs({ token: { value: "prod-key" } }),
        /token must be a string/,
      );
      assert.equal(captured.length, 0);
    },
  );
});

test("admin dashboard recent usage fails closed when backend omits stable row ids", async () => {
  await withBackendSdkFetch(
    (url) => {
      if (url === "/backend/v3/api/system/dashboard/admin/overview") {
        return adminDashboardFixture({
          recentUsage: [
            {
              user: "ops@example.com",
              isApiUser: true,
              model: "gpt-4o-mini",
              type: "text",
              billingMode: "tokens",
              usageIn: "128",
              time: "2026-05-05T08:00:00Z",
              status: "success",
              cost: "0.03",
            },
          ],
        });
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => AdminDashboardService.fetchDashboardData(),
        /Recent usage trace id is required/,
      );
    },
  );
});

test("admin dashboard lists fail closed when backend returns malformed dashboard rows", async () => {
  for (const [field, row, message] of [
    ["userConsumption", "not-a-pie-record", /Dashboard pie chart record is required/],
    ["multimodal", "not-a-pie-record", /Dashboard pie chart record is required/],
    ["traffic", "not-a-traffic-record", /Dashboard traffic record is required/],
    ["modelDistribution", "not-a-pie-record", /Dashboard pie chart record is required/],
    ["recentUsage", "not-a-usage-record", /Recent usage trace record is required/],
  ] as const) {
    await withBackendSdkFetch(
      (url) => {
        if (url === "/backend/v3/api/system/dashboard/admin/overview") {
          return adminDashboardFixture({
            [field]: [row],
          });
        }
        throw new Error(`unexpected SDK URL: ${url}`);
      },
      async () => {
        await assert.rejects(
          () => AdminDashboardService.fetchDashboardData(),
          message,
        );
      },
    );
  }
});

test("admin dashboard lists fail closed when backend omits required top-level dashboard fields", async () => {
  for (const [field, message] of [
    ["userConsumption", /Dashboard userConsumption is required/],
    ["multimodal", /Dashboard multimodal is required/],
    ["traffic", /Dashboard traffic is required/],
    ["modelDistribution", /Dashboard modelDistribution is required/],
    ["recentUsage", /Dashboard recentUsage is required/],
  ] as const) {
    await withBackendSdkFetch(
      (url) => {
        if (url === "/backend/v3/api/system/dashboard/admin/overview") {
          const response = adminDashboardFixture();
          delete response[field];
          return response;
        }
        throw new Error(`unexpected SDK URL: ${url}`);
      },
      async () => {
        await assert.rejects(
          () => AdminDashboardService.fetchDashboardData(),
          message,
        );
      },
    );
  }
});

test("admin dashboard lists fail closed when backend omits required dashboard fields", async () => {
  await withBackendSdkFetch(
    (url) => {
      if (url === "/backend/v3/api/system/dashboard/admin/overview") {
        return adminDashboardFixture({
          userConsumption: [{ value: 80, color: "#2563eb" }],
        });
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => AdminDashboardService.fetchDashboardData(),
        /Dashboard pie chart name is required/,
      );
    },
  );

  await withBackendSdkFetch(
    (url) => {
      if (url === "/backend/v3/api/system/dashboard/admin/overview") {
        return adminDashboardFixture({
          userConsumption: [{ name: "Enterprise", value: 80 }],
        });
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => AdminDashboardService.fetchDashboardData(),
        /Dashboard pie chart color is required/,
      );
    },
  );

  await withBackendSdkFetch(
    (url) => {
      if (url === "/backend/v3/api/system/dashboard/admin/overview") {
        return adminDashboardFixture({
          traffic: [{ tokens: 1200, requests: 12, cost: 0.24 }],
        });
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => AdminDashboardService.fetchDashboardData(),
        /Dashboard traffic time is required/,
      );
    },
  );

  await withBackendSdkFetch(
    (url) => {
      if (url === "/backend/v3/api/system/dashboard/admin/overview") {
        return adminDashboardFixture({
          recentUsage: [
            {
              id: "usage-1",
              isApiUser: true,
              model: "gpt-4o-mini",
              type: "text",
              billingMode: "tokens",
              time: "2026-05-05T08:00:00Z",
              status: "success",
              cost: "0.03",
            },
          ],
        });
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => AdminDashboardService.fetchDashboardData(),
        /Recent usage trace user is required/,
      );
    },
  );
});

test("admin dashboard recent usage fails closed when backend returns invalid money values", async () => {
  await withBackendSdkFetch(
    (url) => {
      if (url === "/backend/v3/api/system/dashboard/admin/overview") {
        return adminDashboardFixture({
          recentUsage: [
            {
              id: "usage-1",
              user: "ops@example.com",
              isApiUser: true,
              model: "gpt-4o-mini",
              type: "text",
              billingMode: "tokens",
              time: "2026-05-05T08:00:00Z",
              status: "success",
              cost: "not-a-decimal",
            },
          ],
        });
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => AdminDashboardService.fetchDashboardData(),
        /Recent usage trace cost must be a decimal string/,
      );
    },
  );
});

test("admin monitor lists fail closed when backend omits stable node or alert ids", async () => {
  await withBackendSdkFetch(
    (url) => {
      if (url === "/backend/v3/api/system/monitor/nodes") {
        return {
          items: [
            {
              name: "edge-shanghai",
              region: "cn-east",
              status: "warning",
              cpu: "72.5",
              memory: 61,
              uptime: "99.99%",
              ip: "10.0.0.10",
            },
          ],
        };
      }
      if (url === "/backend/v3/api/system/monitor/alerts") {
        return {
          items: [
            {
              severity: "critical",
              title: "High latency",
              message: "P95 latency exceeded threshold",
              time: "2026-05-05T08:00:00Z",
              status: "resolved",
              source: "gateway",
            },
          ],
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => MonitorService.fetchNodes(),
        /System node id is required/,
      );
      await assert.rejects(
        () => MonitorService.fetchAlerts(),
        /Alert id is required/,
      );
    },
  );
});

test("admin monitor lists fail closed when backend returns malformed monitor rows", async () => {
  await withBackendSdkFetch(
    (url) => {
      if (url === "/backend/v3/api/system/monitor/nodes") {
        return { items: ["not-a-node-record"] };
      }
      if (url === "/backend/v3/api/system/monitor/alerts") {
        return { items: ["not-an-alert-record"] };
      }
      if (url === "/backend/v3/api/system/monitor/performance") {
        return { items: ["not-a-performance-record"] };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => MonitorService.fetchNodes(),
        /System node record is required/,
      );
      await assert.rejects(
        () => MonitorService.fetchAlerts(),
        /Alert record is required/,
      );
      await assert.rejects(
        () => MonitorService.fetchPerformanceData(),
        /Performance record is required/,
      );
    },
  );
});

test("admin monitor lists fail closed when backend omits required monitor fields", async () => {
  await withBackendSdkFetch(
    (url) => {
      if (url === "/backend/v3/api/system/monitor/nodes") {
        return {
          items: [
            {
              id: "node-1",
              region: "cn-east",
              status: "warning",
              cpu: "72.5",
              memory: 61,
              uptime: "99.99%",
              ip: "10.0.0.10",
            },
          ],
        };
      }
      if (url === "/backend/v3/api/system/monitor/alerts") {
        return {
          items: [
            {
              id: "alert-1",
              severity: "critical",
              message: "P95 latency exceeded threshold",
              time: "2026-05-05T08:00:00Z",
              status: "resolved",
              source: "gateway",
            },
          ],
        };
      }
      if (url === "/backend/v3/api/system/monitor/performance") {
        return {
          items: [{ cpu: 70, memory: "64", network: 220 }],
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => MonitorService.fetchNodes(),
        /System node name is required/,
      );
      await assert.rejects(
        () => MonitorService.fetchAlerts(),
        /Alert title is required/,
      );
      await assert.rejects(
        () => MonitorService.fetchPerformanceData(),
        /Performance time is required/,
      );
    },
  );
});

test("admin monitor lists fail closed when backend returns unsupported monitor enums", async () => {
  await withBackendSdkFetch(
    (url) => {
      if (url === "/backend/v3/api/system/monitor/nodes") {
        return {
          items: [
            {
              id: "node-1",
              name: "edge-shanghai",
              region: "cn-east",
              status: "degraded",
              cpu: "72.5",
              memory: 61,
              uptime: "99.99%",
              ip: "10.0.0.10",
            },
          ],
        };
      }
      if (url === "/backend/v3/api/system/monitor/alerts") {
        return {
          items: [
            {
              id: "alert-1",
              severity: "urgent",
              title: "High latency",
              message: "P95 latency exceeded threshold",
              time: "2026-05-05T08:00:00Z",
              status: "muted",
              source: "gateway",
            },
          ],
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => MonitorService.fetchNodes(),
        /Unsupported system node status: degraded/,
      );
      await assert.rejects(
        () => MonitorService.fetchAlerts(),
        /Unsupported alert severity: urgent/,
      );
    },
  );
});

test("admin record log list fails closed when backend omits stable log ids", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      if (isSystemRecordsRequest(url, init)) {
        return {
          total: 1,
          logs: [
            {
              user: "user-1",
              requestId: "req-1",
              time: "2026-05-05T08:00:00Z",
              tokenName: "prod-key",
              group: "default",
              type: "chat",
              model: "gpt-4o-mini",
              totalTime: "120ms",
              ttft: "30ms",
              isStream: true,
              inputTokens: "100",
              cacheReadTokens: 20,
              outputTokens: 40,
              cost: "0.012345",
              multiplier: "1.5",
              baseInputPrice: "0.15",
              baseOutputPrice: "0.6",
              cacheReadPrice: "0.02",
              path: "/v1/chat/completions",
              reasoningEffort: "medium",
              ip: "10.0.0.11",
            },
          ],
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => RecordService.fetchLogs(),
        /Log record id is required/,
      );
    },
  );
});

test("admin record log list fails closed when backend returns malformed log rows", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      if (isSystemRecordsRequest(url, init)) {
        return {
          total: 1,
          logs: ["not-a-log-record"],
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => RecordService.fetchLogs(),
        /Log record is required/,
      );
    },
  );
});

test("admin record log list fails closed when backend omits required audit fields", async () => {
  for (const [field, message] of [
    ["requestId", /Log request id is required/],
    ["inputTokens", /Log input tokens are required/],
    ["cost", /Log cost is required/],
    ["httpMethod", /Log HTTP method is required/],
  ] as const) {
    await withBackendSdkFetch(
      (url, init) => {
        if (isSystemRecordsRequest(url, init)) {
          const log = {
            id: "log-1",
            user: "user-1",
            requestId: "req-1",
            time: "2026-05-05T08:00:00Z",
            tokenName: "prod-key",
            group: "default",
            type: "chat",
            model: "gpt-4o-mini",
            totalTime: "120ms",
            ttft: "30ms",
            isStream: true,
            inputTokens: "100",
            cacheReadTokens: 20,
            outputTokens: 40,
            cost: "0.012345",
            multiplier: "1.5",
            baseInputPrice: "0.15",
            baseOutputPrice: "0.6",
            cacheReadPrice: "0.02",
            httpMethod: "POST",
            path: "/v1/chat/completions",
            reasoningEffort: "medium",
            ip: "10.0.0.11",
          } as Record<string, unknown>;
          delete log[field];
          return {
            total: 1,
            logs: [log],
          };
        }
        throw new Error(`unexpected SDK URL: ${url}`);
      },
      async () => {
        await assert.rejects(
          () => RecordService.fetchLogs(),
          message,
        );
      },
    );
  }
});

test("admin record log list fails closed when backend returns invalid decimal audit values", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      if (isSystemRecordsRequest(url, init)) {
        return {
          total: 1,
          logs: [
            {
              id: "log-1",
              user: "user-1",
              requestId: "req-1",
              time: "2026-05-05T08:00:00Z",
              tokenName: "prod-key",
              group: "default",
              type: "chat",
              model: "gpt-4o-mini",
              totalTime: "120ms",
              ttft: "30ms",
              isStream: true,
              inputTokens: "100",
              cacheReadTokens: 20,
              outputTokens: 40,
              cost: "not-a-decimal",
              multiplier: "1.5",
              baseInputPrice: "0.15",
              baseOutputPrice: "0.6",
              cacheReadPrice: "0.02",
              httpMethod: "POST",
              path: "/v1/chat/completions",
              reasoningEffort: "medium",
              ip: "10.0.0.11",
            },
          ],
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => RecordService.fetchLogs(),
        /Log cost must be a decimal string/,
      );
    },
  );
});

test("admin record log list fails closed when backend omits or corrupts pagination total", async () => {
  for (const total of [undefined, -1, "not-a-number"]) {
    await withBackendSdkFetch(
      (url, init) => {
        if (isSystemRecordsRequest(url, init)) {
          return {
            ...(total === undefined ? {} : { total }),
            logs: [
              {
                id: "log-1",
                user: "user-1",
                requestId: "req-1",
                time: "2026-05-05T08:00:00Z",
                tokenName: "prod-key",
                group: "default",
                type: "chat",
                model: "gpt-4o-mini",
                totalTime: "120ms",
                ttft: "30ms",
                isStream: true,
                inputTokens: "100",
                cacheReadTokens: 20,
                outputTokens: 40,
                cost: "0.012345",
                multiplier: "1.5",
                baseInputPrice: "0.15",
                baseOutputPrice: "0.6",
                cacheReadPrice: "0.02",
                httpMethod: "POST",
                path: "/v1/chat/completions",
                reasoningEffort: "medium",
                ip: "10.0.0.11",
              },
            ],
          };
        }
        throw new Error(`unexpected SDK URL: ${url}`);
      },
      async () => {
        await assert.rejects(
          () => RecordService.fetchLogs(),
          /Backend log total is required/,
        );
      },
    );
  }
});

test("admin finance tables fill the available admin viewport", () => {
  const source = readAdminFinanceSource();

  for (const expected of [
    "AdminResourceCenter",
    "tableViewportDataAttribute=\"admin-finance-table-viewport\"",
    "sections={sections}",
    "showSectionNavigation={false}",
  ]) {
    assert.ok(source.includes(expected), `missing adaptive admin finance table marker: ${expected}`);
  }
});

test("admin adjacent operation pages keep content inside the admin viewport", () => {
  const cacheSource = readAdminCacheSource();
  const paymentsSource = readAdminPaymentsSource();
  const serviceProviderSource = readAdminServiceProviderSource();
  const siteSettingsSource = readAdminSiteSettingsSource();
  const runtimeRegionSource = readAdminRuntimeRegionSource();

  for (const expected of [
    "flex h-full min-h-0 w-full flex-col gap-4 overflow-hidden",
    "grid min-h-0 flex-1 grid-cols-1 gap-4",
    "flex min-h-0 flex-col overflow-hidden",
    "min-h-0 flex-1 overflow-auto",
    "flex min-h-0 flex-col gap-4 overflow-y-auto",
  ]) {
    assert.ok(cacheSource.includes(expected), `missing adaptive admin cache layout marker: ${expected}`);
  }

  for (const expected of [
    "data-admin-payments-layout",
    "flex h-full min-h-0 w-full flex-col gap-3 overflow-hidden",
    "className=\"min-h-0 flex-1 overflow-hidden\"",
    "tableViewportDataAttribute=\"admin-payments-table-viewport\"",
  ]) {
    assert.ok(paymentsSource.includes(expected), `missing adaptive admin payments layout marker: ${expected}`);
  }

  for (const expected of [
    "data-admin-service-provider=\"commercial-center\"",
    "flex h-full min-h-0 w-full flex-col gap-3 overflow-hidden",
    "className=\"min-h-0 flex-1 overflow-hidden\"",
    "tableViewportDataAttribute=\"admin-service-provider-table\"",
  ]) {
    assert.ok(serviceProviderSource.includes(expected), `missing adaptive admin service provider layout marker: ${expected}`);
  }

  for (const [label, source, gridMarker] of [
    ["site settings", siteSettingsSource, "data-admin-site-settings-scroll"],
    ["runtime region", runtimeRegionSource, "data-admin-runtime-region-scroll"],
  ] as const) {
    assert.ok(source.includes("flex h-full min-h-0 w-full min-w-0 flex-col gap-3 overflow-hidden"), `${label} root must fill the admin viewport`);
    assert.ok(source.includes("shrink-0"), `${label} top controls and feedback must not scroll with the form body`);
    assert.ok(source.includes(`className=\"min-h-0 flex-1 overflow-y-auto pr-1\" ${gridMarker}`), `${label} form body must scroll inside the page viewport`);
    assert.match(source, /<div className="min-h-0 flex-1 overflow-y-auto pr-1" data-admin-(?:site-settings|runtime-region)-scroll>\s*<div className="grid min-h-0 grid-cols-1 gap-5/, `${label} form grid must be nested inside the dedicated scroll container`);
  }
});

test("admin record table fills the available admin viewport", () => {
  const source = readAdminRecordSource();

  for (const expected of [
    "AdminTableShell",
    "data-admin-record-table-card",
    "data-admin-record-table-viewport",
    "flex h-full min-h-0 w-full flex-col",
    "className=\"flex-1 min-h-0 rounded-xl dark:bg-[#1a1a1a]\"",
    "viewportClassName=\"min-h-0 flex-1 relative\"",
    "sticky top-0 z-10",
    "footer={",
  ]) {
    assert.ok(source.includes(expected), `missing adaptive admin record table marker: ${expected}`);
  }
});

test("admin record table surfaces console usage request fields without requiring row expansion", () => {
  const source = readAdminRecordSource();
  const tableHeaderSource = source.slice(source.indexOf("<thead"), source.indexOf("</thead>"));
  const mainRowSource = source.slice(source.indexOf("logs.map((log) => {"), source.indexOf("{/* Expanded Detail Panel */}"));

  assert.match(tableHeaderSource, /admin\.record\.table\.status/);
  assert.match(tableHeaderSource, /admin\.record\.table\.type/);
  assert.match(tableHeaderSource, /admin\.record\.table\.requestUrl/);
  assert.match(tableHeaderSource, /admin\.record\.table\.userAgent/);
  assert.match(mainRowSource, /log\.status === 'error'/);
  assert.match(mainRowSource, /log\.httpStatus > 0/);
  assert.match(mainRowSource, /const requestUrlSignature = `\$\{log\.httpMethod\} \$\{log\.path\}`;/);
  assert.match(mainRowSource, /title=\{requestUrlSignature\}/);
  assert.match(mainRowSource, /\{requestUrlSignature\}/);
  assert.match(mainRowSource, /title=\{log\.userAgent\}/);
  assert.match(mainRowSource, /formatUserAgentDeviceLabel\(log\.userAgent\)/);
  assert.match(mainRowSource, /const displayModel = log\.providerNativeModel \|\| log\.model;/);
  assert.match(mainRowSource, /const modelTooltip = log\.requestedModelCatalogKey \|\| displayModel;/);
  assert.match(mainRowSource, /title=\{modelTooltip\}/);
  assert.match(source, /colSpan=\{14\}/);
});

test("admin monitor table fills the available admin viewport", () => {
  const source = readAdminMonitorSource();

  for (const expected of [
    "AdminTableShell",
    "data-admin-monitor-table-card",
    "data-admin-monitor-table-viewport",
    "flex h-full min-h-0 w-full flex-col",
    "className=\"flex-1 min-h-0 rounded-xl dark:bg-[#1a1a1a]\"",
    "viewportClassName=\"min-h-0 flex-1\"",
    "sticky top-0 z-10",
  ]) {
    assert.ok(source.includes(expected), `missing adaptive admin monitor table marker: ${expected}`);
  }
});
