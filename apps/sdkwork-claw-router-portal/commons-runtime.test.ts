import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { getLoadErrorMessage } from "./packages/sdkwork-claw-router-commons/src/load-error.ts";
import { createRequestParams, createRequestToken } from "./packages/sdkwork-claw-router-commons/src/request-id.ts";
import {
  ensurePlusApiSuccess,
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
  } from "./packages/sdkwork-claw-router-commons/src/app-session-token.ts";
import {
  buildPortalAuthLoginRedirect,
  hasStoredPortalSession,
  resolvePortalLoginRequiredAction,
} from "./packages/sdkwork-claw-router-commons/src/portal-auth.ts";
import { normalizeGeneratedSdkBaseUrl } from "./packages/sdkwork-claw-router-commons/src/sdk-base-url.ts";
import { resetClawRouterSdkClients } from "./packages/sdkwork-claw-router-commons/src/sdk-clients.ts";
import {
  optionalBoundedPositiveInteger,
  optionalInteger,
  optionalPositiveInteger,
  optionalText,
  pruneUndefinedQueryParams,
  requiredSafePathSegment,
} from "./packages/sdkwork-claw-router-commons/src/sdk-request-boundary.ts";
import { createAppSession } from "./packages/sdkwork-claw-router-commons/src/sessionService.ts";
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

test("ensurePlusApiSuccess accepts generated SDK data objects and raw success envelopes", () => {
  assert.doesNotThrow(() => ensurePlusApiSuccess({ code: 0, data: { ok: true } }, "Failed to fetch apps"));
  assert.doesNotThrow(() => ensurePlusApiSuccess({ code: "200", data: { ok: true } }, "Failed to fetch apps"));
  assert.doesNotThrow(() => ensurePlusApiSuccess({ items: [] }, "Failed to fetch apps"));
  assert.doesNotThrow(() => ensurePlusApiSuccess({ items: [{ id: "runtime-model" }] }, "Failed to fetch models"));
  assert.doesNotThrow(() => ensurePlusApiSuccess([{ id: "runtime-model" }], "Failed to fetch models"));
  assert.doesNotThrow(() =>
    ensurePlusApiSuccess(
      { code: "default", name: "Default group", message: "Standard routing group" },
      "Failed to add group",
    ),
  );
  assert.throws(
    () => ensurePlusApiSuccess({}, "Failed to fetch apps"),
    /Failed to fetch apps/,
  );
  assert.throws(
    () => ensurePlusApiSuccess([], "Failed to fetch models"),
    /Failed to fetch models/,
  );
  assert.throws(
    () => ensurePlusApiSuccess("<!doctype html><html></html>", "Failed to fetch apps"),
    /Failed to fetch apps/,
  );
  assert.throws(
    () => ensurePlusApiSuccess({ code: "4001", msg: "Invalid group", data: null }, "Failed to add group"),
    /Invalid group/,
  );
  assert.throws(
    () => ensurePlusApiSuccess({ code: "4001", msg: "Invalid group" }, "Failed to add group"),
    /Invalid group/,
  );
  assert.throws(
    () => ensurePlusApiSuccess({ code: "4001" }, "Failed to add group"),
    /Failed to add group: 4001/,
  );
  assert.throws(
    () => ensurePlusApiSuccess({ code: 5000, message: "System error", data: null }, "Failed to add group"),
    /System error/,
  );
  assert.throws(
    () => ensurePlusApiSuccess({ code: 5000, message: "System error" }, "Failed to add group"),
    /System error/,
  );
  assert.throws(
    () => ensurePlusApiSuccess({ code: 5000 }, "Failed to add group"),
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
