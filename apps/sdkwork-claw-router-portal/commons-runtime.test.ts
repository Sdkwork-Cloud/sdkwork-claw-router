import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { getLoadErrorMessage } from "./packages/sdkwork-claw-router-commons/src/load-error.ts";
import { createRequestParams, createRequestToken } from "./packages/sdkwork-claw-router-commons/src/request-id.ts";
import {
  ensureSdkworkApiSuccess,
  readApiItems,
  readRequiredApiItems,
  readApiRecord,
  readRequiredNumber,
  readRequiredNonNegativeNumber,
  readRequiredString,
  readRequiredApiItem,
} from "./packages/sdkwork-claw-router-commons/src/api-result.ts";
import {
  clearStoredAppSessionToken,
  getStoredAppSessionAccessToken,
  getStoredAppSessionAuthToken,
  loadStoredAppSessionToken,
  storeAppSessionFromResult,
  } from "./packages/sdkwork-claw-router-commons/src/app-session-token.ts";
import {
  buildPortalAuthLoginRedirect,
  hasStoredPortalSession,
  resolvePortalLoginRequiredAction,
} from "./packages/sdkwork-claw-router-commons/src/portal-auth.ts";
import { normalizeGeneratedSdkBaseUrl } from "./packages/sdkwork-claw-router-commons/src/sdk-base-url.ts";
import {
  resetClawRouterSdkClients,
  SDK_SYSTEM_CONFIG,
} from "./packages/sdkwork-claw-router-commons/src/sdk-clients.ts";
import {
  optionalBoundedPositiveInteger,
  optionalInteger,
  optionalPositiveInteger,
  optionalText,
  pruneUndefinedQueryParams,
  requiredSafePathSegment,
} from "./packages/sdkwork-claw-router-commons/src/sdk-request-boundary.ts";
import { createAppSession, revokeAppSession } from "./packages/sdkwork-claw-router-commons/src/sessionService.ts";
import { verifyCurrentPortalAdminAccess } from "./packages/sdkwork-claw-router-commons/src/portal-session.ts";
import { API_BASE_URL } from "./packages/sdkwork-claw-router-commons/src/utils/env.ts";
import { syntaxHighlightJson } from "./packages/sdkwork-claw-router-commons/src/utils/index.ts";
import {
  createReferenceSidebarGroupElementId,
  createReferenceSidebarGroupKey,
  isReferenceSidebarGroupCollapsed,
  toggleReferenceSidebarGroup,
} from "./packages/sdkwork-claw-router-commons/src/reference-sidebar-groups.ts";

const originalCryptoDescriptor = Object.getOwnPropertyDescriptor(globalThis, "crypto");
const originalFetch = globalThis.fetch;
const originalWindowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");

function withCrypto<T>(cryptoValue: Crypto | undefined, fn: () => T): T {
  Object.defineProperty(globalThis, "crypto", {
    configurable: true,
    enumerable: true,
    value: cryptoValue,
  });

  try {
    return fn();
  } finally {
    if (originalCryptoDescriptor) {
      Object.defineProperty(globalThis, "crypto", originalCryptoDescriptor);
    } else {
      delete (globalThis as { crypto?: Crypto }).crypto;
    }
  }
}

test("createRequestToken uses randomUUID when available", () => {
  const token = withCrypto(
    {
      randomUUID: () => "11111111-2222-4333-8444-555555555555",
    } as unknown as Crypto,
    () => createRequestToken(" api-key "),
  );

  assert.equal(token, "api-key-11111111-2222-4333-8444-555555555555");
});

test("createRequestToken falls back only to cryptographic random bytes", () => {
  const token = withCrypto(
    {
      getRandomValues: (array: Uint8Array) => {
        for (let index = 0; index < array.length; index += 1) {
          array[index] = index + 1;
        }
        return array;
      },
    } as unknown as Crypto,
    () => createRequestToken("request"),
  );

  assert.equal(token, "request-0102030405060708090a0b0c0d0e0f10");
});

test("createRequestToken fails closed when secure randomness is unavailable", () => {
  assert.throws(
    () => withCrypto(undefined, () => createRequestToken("request")),
    /Secure random source is unavailable/,
  );
});

test("createRequestToken rejects an all-zero random byte result", () => {
  assert.throws(
    () =>
      withCrypto(
        {
          getRandomValues: (array: Uint8Array) => array,
        } as unknown as Crypto,
        () => createRequestToken("request"),
      ),
    /Secure random source returned an invalid token seed/,
  );
});

test("createRequestParams creates request id and idempotency key for generated SDK write calls", () => {
  let sequence = 0;
  const params = withCrypto(
    {
      randomUUID: () => {
        sequence += 1;
        return sequence === 1
          ? "11111111-2222-4333-8444-555555555555"
          : "66666666-7777-4888-9999-aaaaaaaaaaaa";
      },
    } as unknown as Crypto,
    () => createRequestParams(" commerce-wallet-topup "),
  );

  assert.deepEqual(params, {
    idempotencyKey: "commerce-wallet-topup-11111111-2222-4333-8444-555555555555",
    xRequestId: "commerce-wallet-topup-request-66666666-7777-4888-9999-aaaaaaaaaaaa",
  });
});

test("getLoadErrorMessage returns Error messages", () => {
  assert.equal(getLoadErrorMessage(new Error("network unavailable"), "Fallback"), "network unavailable");
});

test("getLoadErrorMessage falls back for empty or non-Error values", () => {
  assert.equal(getLoadErrorMessage(new Error(""), "Fallback"), "Fallback");
  assert.equal(getLoadErrorMessage("network unavailable", "Fallback"), "Fallback");
  assert.equal(getLoadErrorMessage({ message: "raw object" }, "Fallback"), "Fallback");
  assert.equal(getLoadErrorMessage(null, "Fallback"), "Fallback");
});

test("normalizeGeneratedSdkBaseUrl strips generated SDK API prefixes from deployment base URLs", () => {
  assert.equal(normalizeGeneratedSdkBaseUrl("/app/v3/api", "/app/v3/api"), "");
  assert.equal(normalizeGeneratedSdkBaseUrl("https://tenant.example.com/app/v3/api", "/app/v3/api"), "https://tenant.example.com");
  assert.equal(
    normalizeGeneratedSdkBaseUrl("https://tenant.example.com/base/app/v3/api", "/app/v3/api"),
    "https://tenant.example.com/base",
  );
  assert.equal(normalizeGeneratedSdkBaseUrl("/backend/v3/api", "/backend/v3/api"), "");
  assert.equal(normalizeGeneratedSdkBaseUrl("https://admin.example.com/backend/v3/api/", "/backend/v3/api"), "https://admin.example.com");
});

test("normalizeGeneratedSdkBaseUrl preserves raw origins and unrelated root-relative bases", () => {
  assert.equal(normalizeGeneratedSdkBaseUrl("https://tenant.example.com", "/app/v3/api"), "https://tenant.example.com");
  assert.equal(normalizeGeneratedSdkBaseUrl("/tenant-a", "/app/v3/api"), "/tenant-a");
  assert.equal(normalizeGeneratedSdkBaseUrl("", "/app/v3/api"), "");
});

test("reference sidebar group collapse state defaults expanded and toggles by system category key", () => {
  assert.equal(isReferenceSidebarGroupCollapsed({}, "gateway", "chat"), false);
  assert.equal(createReferenceSidebarGroupKey("gateway", "chat"), "gateway::chat");

  const collapsed = toggleReferenceSidebarGroup({}, "gateway", "chat");
  assert.deepEqual(collapsed, { "gateway::chat": true });
  assert.equal(isReferenceSidebarGroupCollapsed(collapsed, "gateway", "chat"), true);
  assert.equal(isReferenceSidebarGroupCollapsed(collapsed, "app", "chat"), false);

  const expanded = toggleReferenceSidebarGroup(collapsed, "gateway", "chat");
  assert.deepEqual(expanded, {});
  assert.equal(isReferenceSidebarGroupCollapsed(expanded, "gateway", "chat"), false);
});

test("reference sidebar group element ids are safe and stable for aria controls", () => {
  assert.equal(
    createReferenceSidebarGroupElementId("api-reference-sidebar-group", "Claw Router Open API", "Chat / Responses"),
    "api-reference-sidebar-group-claw-router-open-api-chat-responses",
  );
  assert.equal(
    createReferenceSidebarGroupElementId("sdk-reference-sidebar-group", "", ""),
    "sdk-reference-sidebar-group-system-category",
  );
});

test("api base url defaults to same-origin edge gateway path when runtime env is absent", () => {
  assert.equal(API_BASE_URL, "/v1");
});

test("generated SDK metadata declares independent runtime base URL variables for every SDK surface", () => {
  assert.equal(SDK_SYSTEM_CONFIG.gateway.runtimeEnvName, "VITE_CLAWROUTER_OPEN_API_BASE_URL");
  assert.equal(SDK_SYSTEM_CONFIG.app.runtimeEnvName, "VITE_CLAWROUTER_APP_API_BASE_URL");
  assert.equal(SDK_SYSTEM_CONFIG.backend.runtimeEnvName, "VITE_CLAWROUTER_BACKEND_API_BASE_URL");
});

test("commons exports an adaptive admin table shell with a fixed footer slot", () => {
  const shellSource = readFileSync(
    new URL("./packages/sdkwork-claw-router-commons/src/components/AdminTableShell.tsx", import.meta.url),
    "utf8",
  );
  const indexSource = readFileSync(
    new URL("./packages/sdkwork-claw-router-commons/src/index.ts", import.meta.url),
    "utf8",
  );

  for (const marker of [
    "export interface AdminTableShellProps",
    "export function AdminTableShell",
    "min-h-0 flex-1 overflow-hidden",
    "min-h-0 flex-1 overflow-auto",
    "data-admin-table-shell-viewport",
    "data-admin-table-shell-footer",
  ]) {
    assert.ok(shellSource.includes(marker), `missing admin table shell marker: ${marker}`);
  }

  assert.match(indexSource, /export \* from '\.\/components\/AdminTableShell';/);
});

test("navbar notification dropdown has a portal-side outside click dismiss guard", () => {
  const source = readFileSync(
    new URL("./packages/sdkwork-claw-router-commons/src/components/Navbar.tsx", import.meta.url),
    "utf8",
  );

  for (const marker of [
    "const notificationBellRef = useRef<HTMLDivElement>(null)",
    "const handleNotificationPointerDown = (event: PointerEvent) => {",
    "notificationBellRef.current.contains(target)",
    "notificationBellRef.current.querySelector('[role=\"menu\"]')",
    "notificationBellRef.current.querySelector<HTMLButtonElement>('button[aria-label]')",
    "toggleButton?.click()",
    "document.addEventListener('pointerdown', handleNotificationPointerDown, true)",
    "document.removeEventListener('pointerdown', handleNotificationPointerDown, true)",
    "ref={notificationBellRef}",
    "data-claw-notification-bell",
  ]) {
    assert.ok(source.includes(marker), `missing navbar notification dismiss marker: ${marker}`);
  }
});

test("portal notification service fetches console announcements without frontend app id", () => {
  const serviceSource = readFileSync(
    new URL("./packages/sdkwork-claw-router-commons/src/notificationService.ts", import.meta.url),
    "utf8",
  );
  const navbarSource = readFileSync(
    new URL("./packages/sdkwork-claw-router-commons/src/components/Navbar.tsx", import.meta.url),
    "utf8",
  );

  for (const marker of [
    "client.notification.listNotifications({",
    "includeArchived: options.includeArchived ?? false",
    "page: options.page ?? DEFAULT_NOTIFICATION_PAGE",
    "pageSize: options.pageSize ?? DEFAULT_NOTIFICATION_PAGE_SIZE",
    "client.notification.acknowledge.create(notificationId)",
    "client.notification.popupSeen.create(notificationId)",
  ]) {
    assert.ok(serviceSource.includes(marker), `missing app-id-free notification service marker: ${marker}`);
  }

  assert.doesNotMatch(serviceSource, /createSdkworkNotificationService/u);
  assert.doesNotMatch(serviceSource, /appId:\s*DEFAULT_NOTIFICATION_APP_ID/u);
  assert.ok(navbarSource.includes("service={notificationService}"));
  assert.ok(navbarSource.includes("const notificationService = useMemo(() => createPortalNotificationService(), [])"));
});

test("portal css stabilizes navbar notification dropdown empty state dimensions", () => {
  const cssSource = readFileSync(
    new URL("./src/index.css", import.meta.url),
    "utf8",
  );
  const navbarSource = readFileSync(
    new URL("./packages/sdkwork-claw-router-commons/src/components/Navbar.tsx", import.meta.url),
    "utf8",
  );

  assert.ok(
    navbarSource.includes('className="claw-router-navbar-notification-bell"'),
    "Navbar must pass the notification bell CSS scope class",
  );

  for (const marker of [
    ".claw-router-navbar-notification-bell",
    ".claw-router-navbar-notification-bell [role=\"menu\"]",
    "width: min(22rem, calc(100vw - 2rem));",
    "min-width: min(22rem, calc(100vw - 2rem));",
    ".claw-router-navbar-notification-bell [role=\"menu\"] > div:nth-child(2)",
    "min-height: 7rem;",
    ".claw-router-navbar-notification-bell [role=\"menu\"] > div:nth-child(2) > div:not(:has(*))",
    "white-space: normal;",
  ]) {
    assert.ok(cssSource.includes(marker), `missing navbar notification CSS marker: ${marker}`);
  }
});

test("navbar localizes notification unread counter and uses runtime site branding", () => {
  const navbarSource = readFileSync(
    new URL("./packages/sdkwork-claw-router-commons/src/components/Navbar.tsx", import.meta.url),
    "utf8",
  );
  const siteBrandingSource = readFileSync(
    new URL("./packages/sdkwork-claw-router-commons/src/siteBranding.ts", import.meta.url),
    "utf8",
  );

  for (const marker of [
    "useSiteBranding()",
    "siteBranding.siteName",
    "siteBranding.shortName",
    "siteBranding.logoUrl",
    "unreadCount: t('commons.navbar.unreadCount'",
    "0 ? t('commons.navbar.unreadCountZero'",
    "applySiteBrandingToDocument",
  ]) {
    assert.ok(navbarSource.includes(marker) || siteBrandingSource.includes(marker), `missing site branding marker: ${marker}`);
  }

  assert.doesNotMatch(navbarSource, />\s*Claw Router\s*</u, "Navbar must render the configurable site name instead of hard-coded text");
});

test("footer renders configurable site branding and copyright", () => {
  const footerSource = readFileSync(
    new URL("./packages/sdkwork-claw-router-commons/src/components/Footer.tsx", import.meta.url),
    "utf8",
  );

  for (const marker of [
    "useSiteBranding()",
    "siteBranding.siteName",
    "siteBranding.footerCopyright",
    "siteBranding.logoUrl",
    "siteBranding.icpRecordNumber",
    "siteBranding.icpRecordUrl",
    "siteBranding.policeRecordNumber",
    "siteBranding.policeRecordUrl",
    "footer.icpRecordLabel",
    "footer.policeRecordLabel",
  ]) {
    assert.ok(footerSource.includes(marker), `missing footer branding marker: ${marker}`);
  }

  assert.doesNotMatch(footerSource, />\s*Claw Router\s*</u, "Footer must render the configurable site name instead of hard-coded text");
  assert.doesNotMatch(footerSource, /XXXXXXX|浜琁CP|beian\.miit\.gov\.cn/, "Footer must render filing records from site branding instead of hard-coded placeholders");
  assert.ok(footerSource.includes('target="_blank"'), "Footer filing links must open official query pages in a new tab");
});

test("console layout keeps readable navigation labels and valid logout markup", () => {
  const source = readFileSync(
    new URL("./packages/sdkwork-claw-router-console-core/src/ConsoleLayout.tsx", import.meta.url),
    "utf8",
  );

  for (const label of [
    "仪表盘",
    "令牌管理",
    "调用统计",
    "充值兑换",
    "账单与报表",
    "消息中心",
    "工具配置",
    "本地路由",
    "账户详情",
    "配置中心",
    "退出登录",
  ]) {
    assert.match(source, new RegExp(`['">]${label}['"<]`));
  }

  assert.doesNotMatch(source, /浠|璋|閽|璐|娑|宸|鏈|閰|閫/);
  assert.doesNotMatch(source, /path:\s*'\/console\/recharge'/);
  assert.doesNotMatch(source, /path:\s*'\/console\/checkout'/);
  assert.doesNotMatch(source, /console\.recharge\.nav\.recharge/);
  assert.doesNotMatch(source, /console\.checkout\.nav\.checkout/);
  assert.match(source, /<span>\{t\("console\.core\.consolelayout\.text\.12hokt7", "退出登录"\)\}<\/span>/);
  assert.doesNotMatch(source, /<span>[^<]*\/span>/);
});

test("console wallet uses recharge exchange wording and concise tabs", () => {
  const walletSource = readFileSync(
    new URL("./packages/sdkwork-claw-router-console-wallet/src/WalletView.tsx", import.meta.url),
    "utf8",
  );
  const i18nSource = readFileSync(
    new URL("./packages/sdkwork-claw-router-i18n/src/index.ts", import.meta.url),
    "utf8",
  );
  const walletPackageJson = readFileSync(
    new URL("./packages/sdkwork-claw-router-console-wallet/package.json", import.meta.url),
    "utf8",
  );
  const rechargeSource = readFileSync(
    new URL("./packages/sdkwork-claw-router-console-recharge/src/RechargeView.tsx", import.meta.url),
    "utf8",
  );

  assert.match(walletSource, /"充值兑换"/);
  assert.match(walletSource, /"兑换"/);
  assert.match(walletSource, /"充值"/);
  assert.match(i18nSource, /"console\.billing\.billingview\.text\.gd62li": "充值兑换"/);
  assert.match(i18nSource, /"console\.billing\.billingview\.text\.1iq97ql": "兑换"/);
  assert.match(i18nSource, /"console\.billing\.billingview\.text\.1wlfhep": "充值"/);
  assert.match(i18nSource, /"console\.recharge\.tabs\.redeem": "兑换"/);
  assert.match(i18nSource, /"console\.recharge\.tabs\.online": "充值"/);
  assert.match(walletPackageJson, /"sdkwork-claw-router-console-recharge": "workspace:\*"/);
  assert.match(walletSource, /import \{ RechargePanel \} from 'sdkwork-claw-router-console-recharge';/);
  assert.match(walletSource, /const \[activeTab, setActiveTab\] = useState<'redeem' \| 'recharge'>\('redeem'\);/);
  assert.match(walletSource, /<RechargePanel embedded showTabs=\{false\} \/>/);
  assert.doesNotMatch(walletSource, /const \[historyTab, setHistoryTab\]/);
  assert.doesNotMatch(walletSource, /setHistoryTab\('recharge'\)/);
  assert.doesNotMatch(walletSource, /historyTab === 'recharge'/);
  assert.doesNotMatch(walletSource, /<WalletHistoryTable/);
  assert.doesNotMatch(walletSource, /fetchRechargeHistory/);
  assert.doesNotMatch(walletSource, /"钱包与充值"|"卡密兑换"/);
  assert.doesNotMatch(rechargeSource, /"卡密兑换"|"在线充值"/);
  assert.doesNotMatch(walletSource, /璐︽埛|鍏戞崲|姝ｅ湪|涓撳睘|鐘舵|鏈湀|棰勮|杈撳叆|渚嬪|绔嬪嵆|閭€璇|浜岀淮|閲戦|鏀粯|澶辫触|鏆傛棤|鍏呭€/);
  assert.doesNotMatch(i18nSource, /"console\.billing\.billingview\.text\.gd62li": "\u94b1\u5305\u4e0e\u5145\u503c"/u);
  assert.doesNotMatch(i18nSource, /"console\.billing\.billingview\.text\.1iq97ql": "\u5361\u5bc6\u5151\u6362"/u);
  assert.doesNotMatch(i18nSource, /"console\.billing\.billingview\.text\.1wlfhep": "\u5728\u7ebf\u5145\u503c"/u);
  assert.doesNotMatch(i18nSource, /"console\.recharge\.tabs\.redeem": "\u5361\u5bc6\u5151\u6362"/u);
  assert.doesNotMatch(i18nSource, /"console\.recharge\.tabs\.online": "\u5728\u7ebf\u5145\u503c"/u);
});

test("portal auth helpers preserve the current route for login-required actions", () => {
  clearStoredAppSessionToken();

  assert.equal(hasStoredPortalSession(), false);
  assert.equal(
    buildPortalAuthLoginRedirect({
      hash: "#comments",
      pathname: "/forum/42",
      search: "?sort=top",
    }),
    "/auth/login?redirect=%2Fforum%2F42%3Fsort%3Dtop%23comments",
  );
  assert.deepEqual(
    resolvePortalLoginRequiredAction({
      hasSession: false,
      location: {
        hash: "#install",
        pathname: "/skills-hub/skill-1",
        search: "?tab=config",
      },
    }),
    {
      allowed: false,
      redirectTo: "/auth/login?redirect=%2Fskills-hub%2Fskill-1%3Ftab%3Dconfig%23install",
    },
  );
  assert.deepEqual(
    resolvePortalLoginRequiredAction({
      hasSession: true,
      location: { pathname: "/courses", search: "", hash: "" },
    }),
    { allowed: true },
  );
});

test("navbar sign-in preserves the current public route while console links use route protection", () => {
  const navbarSource = readFileSync(
    new URL("./packages/sdkwork-claw-router-commons/src/components/Navbar.tsx", import.meta.url),
    "utf8",
  );

  assert.match(navbarSource, /buildPortalAuthLoginRedirect/u);
  assert.match(navbarSource, /const handleSignIn = \(\) => \{\s*navigate\(buildPortalAuthLoginRedirect\(location\)\);\s*\}/u);
  assert.match(navbarSource, /<Link to="\/console"/u);
  assert.doesNotMatch(navbarSource, /redirect=\/console/u);
});

test("navbar exposes the existing VIP purchase entry through the dedicated VIP route", () => {
  const navbarSource = readFileSync(
    new URL("./packages/sdkwork-claw-router-commons/src/components/Navbar.tsx", import.meta.url),
    "utf8",
  );

  assert.match(navbarSource, /href: '\/vip'/u);
  assert.match(navbarSource, /t\('nav\.buyVip'/u);
  assert.doesNotMatch(navbarSource, /href: '\/console\/memberships'/u);
  assert.doesNotMatch(navbarSource, /\/console\/billing\?vip/u);
});

test("navbar keeps the public GitHub repository entry hidden", () => {
  const navbarSource = readFileSync(
    new URL("./packages/sdkwork-claw-router-commons/src/components/Navbar.tsx", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(navbarSource, /github\.com\/Sdkwork-Cloud\/sdkwork-claw-router\.git/u);
  assert.doesNotMatch(navbarSource, /GitHub Repository/u);
  assert.doesNotMatch(navbarSource, /\bGithub\b/u);
});

test("sdk request boundary validates query primitives and safe path segments", () => {
  assert.equal(optionalInteger(" 2026 ", "year"), 2026);
  assert.equal(optionalPositiveInteger(" 2 ", "page"), 2);
  assert.equal(optionalBoundedPositiveInteger("100", "pageSize", 100), 100);
  assert.equal(optionalText(" query ", "searchQuery", 128), "query");
  assert.equal(optionalText(" ", "searchQuery", 128), undefined);
  assert.equal(requiredSafePathSegment("app-1_2.3~stable", "appId"), "app-1_2.3~stable");
  assert.deepEqual(
    pruneUndefinedQueryParams({
      page: 2,
      pageSize: 100,
      searchQuery: "gpt-4o",
      empty: undefined,
      zero: 0,
    }),
    {
      page: 2,
      pageSize: 100,
      searchQuery: "gpt-4o",
      zero: 0,
    },
  );

  assert.throws(() => optionalInteger("2026.5", "year"), /year must be an integer/);
  assert.throws(() => optionalInteger("1e2", "page"), /page must be an integer/);
  assert.throws(() => optionalPositiveInteger(0, "page"), /page must be a positive integer/);
  assert.throws(() => optionalBoundedPositiveInteger(101, "pageSize", 100), /pageSize must be between 1 and 100/);
  assert.throws(() => optionalText({ value: "2026-05-05" }, "startTime", 64), /startTime must be a string/);
  assert.throws(() => optionalText("x".repeat(129), "searchQuery", 128), /searchQuery must be at most 128 characters/);
  assert.throws(() => requiredSafePathSegment("", "appId"), /appId is required/);
  assert.throws(() => requiredSafePathSegment(" app-1 ", "appId"), /appId must be a safe path segment/);
  assert.throws(() => requiredSafePathSegment("../admin", "appId"), /appId must be a safe path segment/);
  assert.throws(() => requiredSafePathSegment("app?debug=true", "appId"), /appId must be a safe path segment/);
});

test("syntaxHighlightJson accepts unknown and unserializable display values", () => {
  const circular: Record<string, unknown> = { name: "cycle" };
  circular.self = circular;

  assert.equal(syntaxHighlightJson(undefined), "undefined");
  assert.match(syntaxHighlightJson({ ok: true }), /<span class="[^"]+">true<\/span>/);
  assert.match(syntaxHighlightJson("<script>"), /&lt;script&gt;/);
  assert.doesNotThrow(() => syntaxHighlightJson(circular));
  assert.match(syntaxHighlightJson(circular), /\[Unserializable JSON value\]/);
});

test("api result readers support generated SDK data objects and raw API envelopes", () => {
  const items = [{ id: "runtime-model" }];

  assert.deepEqual(readApiItems({ items }), items);
  assert.deepEqual(readApiItems({ data: items }), items);
  assert.deepEqual(readApiItems({ code: "2000", msg: "success", data: { items } }), items);
  assert.deepEqual(readApiItems(items), items);
  assert.deepEqual(readApiRecord({ items }), { items });
  assert.deepEqual(readApiRecord({ data: items, total: 1 }), { data: items, total: 1 });
  assert.deepEqual(readApiRecord({ code: "default", name: "Default group" }), {
    code: "default",
    name: "Default group",
  });
  assert.deepEqual(readApiRecord({ message: "Scheduled maintenance", status: "active" }), {
    message: "Scheduled maintenance",
    status: "active",
  });
  assert.deepEqual(readApiRecord({ code: "2000", data: { items } }), { items });
  assert.deepEqual(readApiRecord({ code: 0, data: { items } }), { items });
  assert.deepEqual(readApiRecord({ code: "200", data: { items } }), { items });
});

test("api result required list reader fails closed for malformed list payloads", () => {
  const items = [{ id: "runtime-model" }];

  assert.deepEqual(readRequiredApiItems({ items: [] }, "Model list is missing"), []);
  assert.deepEqual(readRequiredApiItems({ items }, "Model list is missing"), items);
  assert.deepEqual(readRequiredApiItems(items, "Model list is missing"), items);
  assert.deepEqual(readRequiredApiItems({ data: items }, "Model list is missing"), items);
  assert.deepEqual(readRequiredApiItems({ code: "2000", data: { items: [] } }, "Model list is missing"), []);
  assert.deepEqual(readRequiredApiItems({ code: "2000", data: { logs: [] } }, "Log list is missing", ["logs"]), []);
  assert.throws(
    () => readRequiredApiItems({ ok: true }, "Model list is missing"),
    /Model list is missing/,
  );
  assert.throws(
    () => readRequiredApiItems({ code: "2000", data: { ok: true } }, "Model list is missing"),
    /Model list is missing/,
  );
  assert.throws(
    () => readRequiredApiItems({ code: "2000", data: { item: { id: "model-1" } } }, "Model list is missing"),
    /Model list is missing/,
  );
});

test("api result required item reader fails closed when command responses omit returned entities", () => {
  assert.deepEqual(readRequiredApiItem({ item: { id: "group-1" } }, "Missing group"), { id: "group-1" });
  assert.deepEqual(readRequiredApiItem({ code: "2000", data: { item: { id: "group-2" } } }, "Missing group"), {
    id: "group-2",
  });
  assert.throws(
    () => readRequiredApiItem({ id: "direct-entity" }, "Missing nested item", ["item"]),
    /Missing nested item/,
  );
  assert.throws(
    () => readRequiredApiItem({ items: [] }, "Created group response is missing data"),
    /Created group response is missing data/,
  );
  assert.throws(
    () => readRequiredApiItem({ updated: true }, "Updated group response is missing data"),
    /Updated group response is missing data/,
  );
  assert.throws(
    () => readRequiredApiItem({ code: "2000", data: null }, "Created group response is missing data"),
    /Created group response is missing data/,
  );
});

test("api result required string reader rejects missing or blank stable fields", () => {
  assert.equal(readRequiredString({ id: " group-1 " }, "id", "Group id is required"), "group-1");
  assert.equal(readRequiredString({ id: 42 }, "id", "Group id is required"), "42");
  assert.throws(
    () => readRequiredString({ id: " " }, "id", "Group id is required"),
    /Group id is required/,
  );
  assert.throws(
    () => readRequiredString({}, "id", "Group id is required"),
    /Group id is required/,
  );
});

test("api result required number reader rejects missing or invalid stable numeric fields", () => {
  assert.equal(readRequiredNumber({ id: 42 }, "id", "User id is required"), 42);
  assert.equal(readRequiredNumber({ id: "42" }, "id", "User id is required"), 42);
  assert.throws(
    () => readRequiredNumber({ id: 0 }, "id", "User id is required"),
    /User id is required/,
  );
  assert.throws(
    () => readRequiredNumber({ id: "not-a-number" }, "id", "User id is required"),
    /User id is required/,
  );
});

test("api result required non-negative number reader rejects missing or invalid pagination totals", () => {
  assert.equal(readRequiredNonNegativeNumber({ total: 0 }, "total", "Total is required"), 0);
  assert.equal(readRequiredNonNegativeNumber({ total: "0" }, "total", "Total is required"), 0);
  assert.equal(readRequiredNonNegativeNumber({ total: "42" }, "total", "Total is required"), 42);
  assert.throws(
    () => readRequiredNonNegativeNumber({ total: -1 }, "total", "Total is required"),
    /Total is required/,
  );
  assert.throws(
    () => readRequiredNonNegativeNumber({ total: "not-a-number" }, "total", "Total is required"),
    /Total is required/,
  );
  assert.throws(
    () => readRequiredNonNegativeNumber({}, "total", "Total is required"),
    /Total is required/,
  );
});

test("ensureSdkworkApiSuccess accepts generated SDK data objects and raw success envelopes", () => {
  assert.doesNotThrow(() => ensureSdkworkApiSuccess({ code: 0, data: { ok: true } }, "Failed to fetch apps"));
  assert.doesNotThrow(() => ensureSdkworkApiSuccess({ code: "200", data: { ok: true } }, "Failed to fetch apps"));
  assert.doesNotThrow(() => ensureSdkworkApiSuccess({ items: [] }, "Failed to fetch apps"));
  assert.doesNotThrow(() => ensureSdkworkApiSuccess({ items: [{ id: "runtime-model" }] }, "Failed to fetch models"));
  assert.doesNotThrow(() => ensureSdkworkApiSuccess([{ id: "runtime-model" }], "Failed to fetch models"));
  assert.doesNotThrow(() =>
    ensureSdkworkApiSuccess(
      { code: "default", name: "Default group", message: "Standard routing group" },
      "Failed to add group",
    ),
  );
  assert.throws(
    () => ensureSdkworkApiSuccess({}, "Failed to fetch apps"),
    /Failed to fetch apps/,
  );
  assert.throws(
    () => ensureSdkworkApiSuccess([], "Failed to fetch models"),
    /Failed to fetch models/,
  );
  assert.throws(
    () => ensureSdkworkApiSuccess("<!doctype html><html></html>", "Failed to fetch apps"),
    /Failed to fetch apps/,
  );
  assert.throws(
    () => ensureSdkworkApiSuccess({ code: "4001", msg: "Invalid group", data: null }, "Failed to add group"),
    /Invalid group/,
  );
  assert.throws(
    () => ensureSdkworkApiSuccess({ code: "4001", msg: "Invalid group" }, "Failed to add group"),
    /Invalid group/,
  );
  assert.throws(
    () => ensureSdkworkApiSuccess({ code: "4001" }, "Failed to add group"),
    /Failed to add group: 4001/,
  );
  assert.throws(
    () => ensureSdkworkApiSuccess({ code: 5000, message: "System error", data: null }, "Failed to add group"),
    /System error/,
  );
  assert.throws(
    () => ensureSdkworkApiSuccess({ code: 5000, message: "System error" }, "Failed to add group"),
    /System error/,
  );
  assert.throws(
    () => ensureSdkworkApiSuccess({ code: 5000 }, "Failed to add group"),
    /Failed to add group: 5000/,
  );
});

test("createAppSession stores dual IAM tokens returned as generated SDK data objects", async () => {
  const captured: { url: string; method: string; headers: Record<string, string> }[] = [];
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
      headers: Object.fromEntries(new Headers(init?.headers).entries()),
    });
    return new Response(
      JSON.stringify({
        code: "2000",
        msg: "success",
        data: {
          accessToken: "access-token-2026",
          authToken: "auth-token-2026",
          refreshToken: "refresh-token-2026",
          expiresAt: new Date(Date.now() + 3600_000).toISOString(),
          sessionId: "session-2026",
          context: {
            appId: "sdkwork-claw-router",
            authLevel: "password",
            dataScope: ["tenant:tenant-2026"],
            deploymentMode: "saas",
            environment: "dev",
            organizationId: "org-2026",
            permissionScope: ["clawrouter:console"],
            sessionId: "session-2026",
            tenantId: "tenant-2026",
            userId: "user-2026",
          },
        },
      }),
      {
        status: 200,
        headers: { "content-type": "application/json" },
      },
    );
  }) as typeof fetch;
  clearStoredAppSessionToken();
  resetClawRouterSdkClients();

  try {
    const result = await createAppSession();

    assert.equal(captured.length, 1);
    assert.equal(captured[0].url, "/app/v3/api/auth/sessions");
    assert.equal(captured[0].method, "POST");
    assert.match(captured[0].headers["x-request-id"], /^app-session-/);
    assert.equal(getStoredAppSessionAuthToken(), "auth-token-2026");
    assert.equal(getStoredAppSessionAccessToken(), "access-token-2026");
    assert.equal(result.authToken, "auth-token-2026");
    assert.equal(result.accessToken, "access-token-2026");
    assert.equal(result.refreshToken, "refresh-token-2026");
    assert.equal(result.sessionId, "session-2026");
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
});

test("current session retrieval preserves stored refresh token when the server omits it", () => {
  clearStoredAppSessionToken();

  try {
    storeAppSessionFromResult({
      accessToken: "access-token-old",
      authToken: "auth-token-old",
      refreshToken: "refresh-token-2026",
      sessionId: "session-2026",
      expiresAt: new Date(Date.now() + 3600_000).toISOString(),
    });

    const stored = storeAppSessionFromResult({
      accessToken: "access-token-current",
      authToken: "auth-token-current",
      sessionId: "session-2026",
      expiresAt: new Date(Date.now() + 3600_000).toISOString(),
    });

    assert.equal(stored.refreshToken, "refresh-token-2026");
    assert.equal(stored.sessionId, "session-2026");
    assert.equal(loadStoredAppSessionToken()?.refreshToken, "refresh-token-2026");
    assert.equal(getStoredAppSessionAuthToken(), "auth-token-current");
    assert.equal(getStoredAppSessionAccessToken(), "access-token-current");
  } finally {
    clearStoredAppSessionToken();
  }
});

test("revokeAppSession deletes the persisted server session before clearing local tokens", async () => {
  const captured: { url: string; method: string; headers: Record<string, string> }[] = [];
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
      headers: Object.fromEntries(new Headers(init?.headers).entries()),
    });
    return new Response(JSON.stringify({ code: "2000", msg: "success", data: {} }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }) as typeof fetch;
  clearStoredAppSessionToken();
  resetClawRouterSdkClients();
  storeAppSessionFromResult({
    accessToken: "access-token-logout",
    authToken: "auth-token-logout",
    refreshToken: "refresh-token-logout",
    expiresAt: new Date(Date.now() + 3600_000).toISOString(),
    sessionId: "session-logout",
  });

  try {
    await revokeAppSession();

    assert.equal(captured.length, 1);
    assert.equal(captured[0].url, "/app/v3/api/auth/sessions/current");
    assert.equal(captured[0].method, "DELETE");
    assert.equal(captured[0].headers.authorization, "Bearer auth-token-logout");
    assert.equal(captured[0].headers["sdkwork-access-token"], "access-token-logout");
    assert.equal(getStoredAppSessionAuthToken(), undefined);
    assert.equal(getStoredAppSessionAccessToken(), undefined);
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
});

test("portal admin access check denies non-admin sessions and clears expired sessions", async () => {
  for (const [adminStatus, expectedState, shouldKeepTokens] of [
    [200, "allowed", true],
    [403, "forbidden", true],
    [401, "anonymous", false],
  ] as const) {
    const captured: { url: string; method: string }[] = [];
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      enumerable: true,
      value: {},
    });
    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
      captured.push({ url, method: init?.method ?? "GET" });
      if (url === "/app/v3/api/auth/sessions/current") {
        return new Response(
          JSON.stringify({
            code: "2000",
            data: {
              accessToken: `access-${adminStatus}`,
              authToken: `auth-${adminStatus}`,
              sessionId: `session-${adminStatus}`,
              expiresAt: new Date(Date.now() + 3600_000).toISOString(),
            },
          }),
          {
            status: 200,
            headers: { "content-type": "application/json" },
          },
        );
      }
      if (url === "/backend/v3/api/system/installation/status") {
        if (adminStatus === 200) {
          return new Response(JSON.stringify({ code: "2000", data: { status: "installed" } }), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        }
        return new Response(JSON.stringify({ code: String(adminStatus), msg: "admin access denied" }), {
          status: adminStatus,
          headers: { "content-type": "application/json" },
        });
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    }) as typeof fetch;
    clearStoredAppSessionToken();
    resetClawRouterSdkClients();

    try {
      const state = await verifyCurrentPortalAdminAccess();

      assert.equal(state, expectedState);
      assert.deepEqual(
        captured.map((request) => `${request.method} ${request.url}`),
        [
          "GET /app/v3/api/auth/sessions/current",
          "GET /backend/v3/api/system/installation/status",
        ],
      );
      assert.equal(getStoredAppSessionAuthToken(), shouldKeepTokens ? `auth-${adminStatus}` : undefined);
      assert.equal(getStoredAppSessionAccessToken(), shouldKeepTokens ? `access-${adminStatus}` : undefined);
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
});

test("portal admin access check allows admin sessions when system status succeeds", async () => {
  const captured: { url: string; method: string }[] = [];
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    enumerable: true,
    value: {},
  });
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    captured.push({ url, method: init?.method ?? "GET" });
    if (url === "/app/v3/api/auth/sessions/current") {
      return new Response(
        JSON.stringify({
          code: "2000",
          data: {
            accessToken: "access-admin",
            authToken: "auth-admin",
            sessionId: "session-admin",
            expiresAt: new Date(Date.now() + 3600_000).toISOString(),
          },
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        },
      );
    }
    if (url === "/backend/v3/api/system/installation/status") {
      return new Response(JSON.stringify({ code: "2000", data: { status: "installed" } }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }
    throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
  }) as typeof fetch;
  clearStoredAppSessionToken();
  resetClawRouterSdkClients();

  try {
    const state = await verifyCurrentPortalAdminAccess();

    assert.equal(state, "allowed");
    assert.deepEqual(
      captured.map((request) => `${request.method} ${request.url}`),
      [
        "GET /app/v3/api/auth/sessions/current",
        "GET /backend/v3/api/system/installation/status",
      ],
    );
    assert.equal(getStoredAppSessionAuthToken(), "auth-admin");
    assert.equal(getStoredAppSessionAccessToken(), "access-admin");
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
});

test("portal admin access check returns error when system status request stalls", async () => {
  const captured: { url: string; method: string }[] = [];
  let statusRequestAborted = false;
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    enumerable: true,
    value: {},
  });
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    captured.push({ url, method: init?.method ?? "GET" });
    if (url === "/app/v3/api/auth/sessions/current") {
      return new Response(
        JSON.stringify({
          code: "2000",
          data: {
            accessToken: "access-admin-stalled-status",
            authToken: "auth-admin-stalled-status",
            sessionId: "session-admin-stalled-status",
            expiresAt: new Date(Date.now() + 3600_000).toISOString(),
          },
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        },
      );
    }
    if (url === "/backend/v3/api/system/installation/status") {
      return new Promise<Response>((_resolve, reject) => {
        const abort = () => {
          statusRequestAborted = true;
          const error = new Error("aborted");
          error.name = "AbortError";
          reject(error);
        };
        if (init?.signal?.aborted) {
          abort();
          return;
        }
        init?.signal?.addEventListener("abort", abort, { once: true });
      });
    }
    throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
  }) as typeof fetch;
  clearStoredAppSessionToken();
  resetClawRouterSdkClients();

  try {
    const state = await Promise.race([
      verifyCurrentPortalAdminAccess({ timeoutMs: 10 }),
      new Promise<never>((_resolve, reject) => {
        setTimeout(() => reject(new Error("admin access check did not settle")), 80);
      }),
    ]);

    assert.equal(state, "error");
    assert.equal(statusRequestAborted, true);
    assert.deepEqual(
      captured.map((request) => `${request.method} ${request.url}`),
      [
        "GET /app/v3/api/auth/sessions/current",
        "GET /backend/v3/api/system/installation/status",
      ],
    );
    assert.equal(getStoredAppSessionAuthToken(), "auth-admin-stalled-status");
    assert.equal(getStoredAppSessionAccessToken(), "access-admin-stalled-status");
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
});

test("portal admin access check uses the generated backend SDK system status method", () => {
  const source = readFileSync(
    new URL("./packages/sdkwork-claw-router-commons/src/portal-session.ts", import.meta.url),
    "utf8",
  );

  assert.match(source, /system\.installation\.status\.retrieve\(\)/);
  assert.doesNotMatch(source, /system\.dashboardAdminOverviewRetrieve\(\)/);
  assert.doesNotMatch(source, /system\.dashboard\.admin\.overview\.retrieve/);
});
