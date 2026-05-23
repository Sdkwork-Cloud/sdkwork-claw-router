import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function readPortalFile(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

const implementationCaveatPatterns = [
  /Read-only/i,
  /read-only/i,
  /command contract/i,
  /command contracts/i,
  /App SDK contract/i,
  /app contract/i,
  /contract/i,
  /before they can be enabled/i,
  /contract exists/i,
  /not available in the current app contract/i,
];

function assertNoImplementationCaveats(source: string): void {
  for (const pattern of implementationCaveatPatterns) {
    assert.doesNotMatch(source, pattern);
  }
}

const usageI18nKeys = [
  "console.usage.title",
  "console.usage.loadedCost",
  "console.usage.rows",
  "console.usage.tokens",
  "console.usage.startTimePlaceholder",
  "console.usage.endTimePlaceholder",
  "console.usage.searchPlaceholder",
  "console.usage.status.all",
  "console.usage.status.success",
  "console.usage.status.error",
  "console.usage.loading",
  "console.usage.loadErrorTitle",
  "console.usage.loadErrorFallback",
  "console.usage.emptyTitle",
  "console.usage.emptyDescription",
  "console.usage.table.time",
  "console.usage.table.key",
  "console.usage.table.group",
  "console.usage.table.type",
  "console.usage.table.model",
  "console.usage.table.latency",
  "console.usage.table.input",
  "console.usage.table.output",
  "console.usage.table.cost",
  "console.usage.table.ip",
  "console.usage.table.details",
  "console.usage.badge.stream",
  "console.usage.metric.cache",
  "console.usage.metric.multiplier",
  "console.usage.metric.input",
  "console.usage.metric.output",
  "console.usage.unit.tokens",
  "console.usage.detail.requestId",
  "console.usage.detail.cacheTokens",
  "console.usage.detail.pricing",
  "console.usage.detail.formula",
  "console.usage.detail.reasoning",
  "console.usage.detail.path",
  "console.usage.detail.inputPrice",
  "console.usage.detail.outputPrice",
  "console.usage.detail.cachePrice",
  "console.usage.detail.reference",
  "console.usage.pagination.showing",
  "console.usage.pagination.page",
  "console.usage.pagination.pageSize",
];

const usageHardcodedUiPatterns = [
  />\s*API usage logs\s*</,
  />\s*Loaded cost\s*</,
  />\s*Rows\s*</,
  />\s*Tokens\s*</,
  /placeholder="startTime, for example 2026-04-21T00:00:00Z"/,
  /placeholder="endTime, for example 2026-04-21T23:59:59Z"/,
  /placeholder="Search key, model, request, path\.\.\."/,
  />\s*All statuses\s*</,
  />\s*Success\s*</,
  />\s*Error\s*</,
  /title="Loading usage logs\.\.\."/,
  /title="Usage logs could not be loaded"/,
  /title="No usage logs found"/,
  /description="The usage logs API returned an empty page for the current query\."/,
  />\s*Time\s*</,
  />\s*Key\s*</,
  />\s*Group\s*</,
  />\s*Type\s*</,
  />\s*Model\s*</,
  />\s*Latency\s*</,
  />\s*Input\s*</,
  />\s*Output\s*</,
  />\s*Cost\s*</,
  />\s*IP\s*</,
  />\s*Details\s*</,
  />\s*Request ID\s*</,
  />\s*Cache tokens\s*</,
  />\s*Pricing\s*</,
  />\s*Formula\s*</,
  />\s*Reasoning\s*</,
  />\s*Path\s*</,
  />\s*Reference only; the ledger is the source of truth\.\s*</,
  /Showing \{visibleStart\} - \{visibleEnd\} of \{totalLogs\}/,
  /Page \{page\} \/ \{pageCount\}/,
  />\s*10 \/ page\s*</,
  />\s*20 \/ page\s*</,
  />\s*50 \/ page\s*</,
];

test("console usage logs copy is routed through i18n without read-only caveats", () => {
  const source = readPortalFile("./packages/sdkwork-claw-router-console-usage/src/UsageView.tsx");

  assert.match(source, /t\('console\.usage\.title', 'API usage logs'\)/);
  assert.match(source, /placeholder=\{t\('console\.usage\.startTimePlaceholder'/);
  assert.match(source, /placeholder=\{t\('console\.usage\.endTimePlaceholder'/);
  assert.match(source, /placeholder=\{t\('console\.usage\.searchPlaceholder'/);
  for (const pattern of usageHardcodedUiPatterns) {
    assert.doesNotMatch(source, pattern);
  }
  assertNoImplementationCaveats(source);
});

test("console usage logs i18n resources include English and Chinese entries", () => {
  const source = readPortalFile("./packages/sdkwork-claw-router-i18n/src/index.ts");

  for (const key of usageI18nKeys) {
    assert.equal(
      source.match(new RegExp(`"${key}"`, "g"))?.length,
      2,
      `${key} must be translated in both locales`,
    );
  }
});

test("console dashboard stays product-focused without read-only caveats", () => {
  const source = readPortalFile("./packages/sdkwork-claw-router-console-dashboard/src/DashboardView.tsx");

  assertNoImplementationCaveats(source);
});

test("console settlement reports stay product-focused without read-only caveats", () => {
  const source = readPortalFile("./packages/sdkwork-claw-router-console-settlements/src/SettlementsView.tsx");

  assertNoImplementationCaveats(source);
});

test("console commerce business pages stay product-focused without command-contract caveats", () => {
  const businessPageFiles = [
    "./packages/sdkwork-claw-router-console-account/src/AccountView.tsx",
    "./packages/sdkwork-claw-router-console-wallet/src/WalletView.tsx",
    "./packages/sdkwork-claw-router-console-recharge/src/RechargeView.tsx",
    "./packages/sdkwork-claw-router-console-checkout/src/CheckoutView.tsx",
    "./packages/sdkwork-claw-router-console-memberships/src/MembershipsView.tsx",
    "./packages/sdkwork-claw-router-console-settlements/src/SettlementsView.tsx",
  ];

  for (const file of businessPageFiles) {
    assertNoImplementationCaveats(readPortalFile(file));
  }
});

test("console message center stays product-focused without implementation caveats", () => {
  const source = readPortalFile("./packages/sdkwork-claw-router-console-messages/src/MessagesView.tsx");

  assert.match(source, /console\.messages\.title/);
  assertNoImplementationCaveats(source);
});

test("console gateway tooling stays product-focused without implementation caveats", () => {
  const source = readPortalFile("./packages/sdkwork-claw-router-console-gateway/src/GatewayView.tsx");

  assert.match(source, /console\.gateway\.title/);
  assertNoImplementationCaveats(source);
});

test("console provider configuration stays product-focused without implementation caveats", () => {
  const source = readPortalFile("./packages/sdkwork-claw-router-console-providers/src/ProvidersView.tsx");

  assert.match(source, /providers/);
  assertNoImplementationCaveats(source);
});

test("console account summary stays product-focused without implementation caveats", () => {
  const source = readPortalFile("./packages/sdkwork-claw-router-console-account/src/AccountView.tsx");

  assertNoImplementationCaveats(source);
});

test("console user settings stay product-focused without implementation caveats", () => {
  const source = readPortalFile("./packages/sdkwork-claw-router-console-user/src/UserView.tsx");

  assertNoImplementationCaveats(source);
});

test("console routing API keys stay product-focused without implementation caveats", () => {
  const source = readPortalFile("./packages/sdkwork-claw-router-console-routing/src/components/ApiKeysTab.tsx");

  assertNoImplementationCaveats(source);
});

test("console routing fallback stays product-focused without implementation caveats", () => {
  const source = readPortalFile("./packages/sdkwork-claw-router-console-routing/src/components/FallbackTab.tsx");

  assertNoImplementationCaveats(source);
});

test("console recharge stays product-focused without implementation caveats", () => {
  const source = readPortalFile("./packages/sdkwork-claw-router-console-recharge/src/RechargeView.tsx");

  assertNoImplementationCaveats(source);
});

test("console auth unavailable copy stays product-focused without app-contract caveats", () => {
  const routeSource = readPortalFile("./src/auth/ClawRouterAuthRoutes.tsx");
  const controllerSource = readPortalFile("./src/auth/clawRouterAuthController.ts");

  assertNoImplementationCaveats(routeSource);
  assertNoImplementationCaveats(controllerSource);
});

test("playground unavailable states stay product-focused without implementation caveats", () => {
  const files = [
    "./packages/sdkwork-claw-router-playground/src/components/views/AudioView.tsx",
    "./packages/sdkwork-claw-router-playground/src/components/views/ImageView.tsx",
    "./packages/sdkwork-claw-router-playground/src/components/views/MusicView.tsx",
    "./packages/sdkwork-claw-router-playground/src/components/views/SfxView.tsx",
    "./packages/sdkwork-claw-router-playground/src/components/views/VideoView.tsx",
    "./packages/sdkwork-claw-router-playground/src/components/views/SharedHistoryView.tsx",
  ];

  for (const file of files) {
    assertNoImplementationCaveats(readPortalFile(file));
  }
});

test("admin guidance copy stays product-focused without implementation caveats", () => {
  const adminUserSource = readPortalFile("./packages/sdkwork-claw-router-admin-user/src/index.tsx");
  const adminChannelSource = readPortalFile("./packages/sdkwork-claw-router-admin-channel/src/index.tsx");

  assert.doesNotMatch(adminUserSource, /backend contract/i);
  assert.doesNotMatch(adminChannelSource, /routing strategy contract/i);
});

test("shared navigation notifications stay product-focused without read-only labels", () => {
  const source = readPortalFile("./packages/sdkwork-claw-router-commons/src/components/Navbar.tsx");

  assert.doesNotMatch(source, /readOnlyNotifications/);
  assert.doesNotMatch(source, />\s*只读\s*</);
  assert.doesNotMatch(source, />\s*Read-only\s*</);
});

test("i18n product copy avoids implementation contract wording for routed model guidance", () => {
  const source = readPortalFile("./packages/sdkwork-claw-router-i18n/src/index.ts");

  assert.doesNotMatch(source, /current channel contract/i);
});
