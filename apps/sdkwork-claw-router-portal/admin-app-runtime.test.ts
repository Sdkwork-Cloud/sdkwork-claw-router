import assert from "node:assert/strict";
import test from "node:test";

import { clearStoredAppSessionToken } from "./packages/sdkwork-claw-router-commons/src/app-session-token.ts";
import type { JsonObject } from "./packages/sdkwork-claw-router-commons/src/json-value.ts";
import { resetClawRouterSdkClients } from "./packages/sdkwork-claw-router-commons/src/sdk-clients.ts";
import {
  AdminAppService,
  createAdminAppInputFromForm,
  updateAdminAppInputFromForm,
} from "./packages/sdkwork-claw-router-app-center/src/services/adminAppService.ts";

const originalFetch = globalThis.fetch;
const originalWindowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");

type CapturedBackendRequest = {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string;
};

async function withBackendSdkFetch<T>(
  handler: (url: string, init?: RequestInit) => unknown,
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
    const body = typeof init?.body === "string" ? init.body : "";
    const headers = Object.fromEntries(new Headers(init?.headers).entries());
    captured.push({
      url,
      method: init?.method ?? "GET",
      headers,
      body,
    });
    const result = handler(url, init);
    return new Response(JSON.stringify({ code: "2000", data: result }), {
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

function sampleApp(overrides: Record<string, unknown> = {}) {
  return {
    id: "8101",
    uuid: "app-browser-smoke-admin",
    userId: "42",
    name: "Browser Smoke Admin App",
    description: "Production smoke validates backend SDK app management rendering.",
    version: "1.0.0",
    icon: { source: "browser-smoke" },
    iconUrl: "/apps/browser-smoke.svg",
    resourceList: { assets: ["artifact://apps/browser-smoke/app.zip"] },
    projectId: "1001",
    accessUrl: "https://apps.example.test/browser-smoke",
    config: { standard: { appKey: "app-browser-smoke" } },
    appKey: "app-browser-smoke",
    status: "ACTIVE",
    marketStatus: "DRAFT",
    appType: "web",
    platforms: { web: true },
    installPlatforms: { web: true },
    installSkill: { skillKey: "browser_smoke_admin_skill" },
    installConfig: { entry: "index.html" },
    releaseNotes: [{ version: "1.0.0", notes: "Initial release" }],
    packageName: "com.sdkwork.browser.smoke",
    bundleId: "com.sdkwork.browser.smoke.web",
    storeUrl: "https://store.example.test/browser-smoke",
    downloadUrl: "https://cdn.example.test/browser-smoke/app.zip",
    createdAt: "2026-05-09T00:00:00Z",
    updatedAt: "2026-05-09T00:00:00Z",
    ...overrides,
  };
}

test("admin app form helpers create normalized backend DTOs", () => {
  const createForm = new FormData();
  createForm.set("name", " Browser Smoke Admin App ");
  createForm.set("description", " Production smoke app ");
  createForm.set("version", " 1.0.0 ");
  createForm.set("status", "ACTIVE");
  createForm.set("marketStatus", "PUBLISHED");
  createForm.set("appType", " web ");
  createForm.set("packageName", " com.sdkwork.browser.smoke ");
  createForm.set("bundleId", " com.sdkwork.browser.smoke.web ");
  createForm.set("accessUrl", " /apps/browser-smoke ");
  createForm.set("icon", '{"source":"portal","name":"browser-smoke"}');
  createForm.set("resourceList", '{"assets":["artifact://apps/browser-smoke/app.zip"]}');
  createForm.set("appKey", " app-browser-smoke ");
  createForm.set("config", '{"portal":{"featured":true}}');
  createForm.set("platforms", '{"web":true}');
  createForm.set("installPlatforms", '{"web":true,"desktop":false}');
  createForm.set("installSkill", '{"skillKey":"browser_smoke_admin_skill"}');
  createForm.set("installConfig", '{"entry":"index.html"}');
  createForm.set("releaseNotes", '[{"version":"1.0.0","notes":"Initial release"}]');
  createForm.set("userId", "42");
  createForm.set("projectId", "1001");

  assert.deepEqual(createAdminAppInputFromForm(createForm), {
    name: "Browser Smoke Admin App",
    description: "Production smoke app",
    version: "1.0.0",
    status: "ACTIVE",
    marketStatus: "PUBLISHED",
    appType: "web",
    packageName: "com.sdkwork.browser.smoke",
    bundleId: "com.sdkwork.browser.smoke.web",
    accessUrl: "/apps/browser-smoke",
    icon: { source: "portal", name: "browser-smoke" },
    resourceList: { assets: ["artifact://apps/browser-smoke/app.zip"] },
    config: { portal: { featured: true }, standard: { appKey: "app-browser-smoke" } },
    platforms: { web: true },
    installPlatforms: { web: true, desktop: false },
    installSkill: { skillKey: "browser_smoke_admin_skill" },
    installConfig: { entry: "index.html" },
    releaseNotes: [{ version: "1.0.0", notes: "Initial release" }],
    userId: "42",
    projectId: "1001",
  });

  const updateForm = new FormData();
  updateForm.set("name", " ");
  updateForm.set("description", " Browser Smoke Admin App Pro ");
  updateForm.set("icon", '{"source":"portal","name":"browser-smoke-pro"}');
  updateForm.set("resourceList", '{"assets":["artifact://apps/browser-smoke/pro.zip"]}');
  updateForm.set("appKey", " app-browser-smoke-pro ");
  updateForm.set("config", '{"standard":{"theme":"dark"},"portal":{"featured":true}}');
  updateForm.set("installPlatforms", '{"desktop":true}');
  updateForm.set("installSkill", '{"skillKey":"browser_smoke_admin_skill_pro"}');
  updateForm.set("releaseNotes", "[]");

  assert.deepEqual(updateAdminAppInputFromForm(updateForm), {
    description: "Browser Smoke Admin App Pro",
    icon: { source: "portal", name: "browser-smoke-pro" },
    resourceList: { assets: ["artifact://apps/browser-smoke/pro.zip"] },
    config: { standard: { theme: "dark", appKey: "app-browser-smoke-pro" }, portal: { featured: true } },
    installPlatforms: { desktop: true },
    installSkill: { skillKey: "browser_smoke_admin_skill_pro" },
    releaseNotes: [],
  });
});

test("admin app form helpers clear nullable update fields when submitted blank", () => {
  const updateForm = new FormData();
  updateForm.set("description", " ");
  updateForm.set("version", " ");
  updateForm.set("iconUrl", " ");
  updateForm.set("projectId", " ");
  updateForm.set("accessUrl", " ");
  updateForm.set("appType", " ");
  updateForm.set("packageName", " ");
  updateForm.set("bundleId", " ");
  updateForm.set("storeUrl", " ");
  updateForm.set("downloadUrl", " ");
  updateForm.set("userId", " ");

  assert.deepEqual(updateAdminAppInputFromForm(updateForm), {
    description: null,
    version: null,
    iconUrl: null,
    projectId: null,
    accessUrl: null,
    appType: null,
    packageName: null,
    bundleId: null,
    storeUrl: null,
    downloadUrl: null,
    userId: null,
  });
});

test("admin app form helpers reject non-standard runtime status values", () => {
  for (const status of ["active", "ENABLED", "DISABLED", "1", "0", "PUBLISHED", "OFFLINE"]) {
    const form = new FormData();
    form.set("name", "Invalid Status App");
    form.set("status", status);

    assert.throws(
      () => createAdminAppInputFromForm(form),
      /Unsupported app status/,
      status,
    );
  }
});

test("admin app form helpers reject non-standard market status values", () => {
  for (const marketStatus of ["published", "draft", "offline", "ACTIVE", "INACTIVE", "ENABLED", "1", "0"]) {
    const form = new FormData();
    form.set("name", "Invalid Market Status App");
    form.set("marketStatus", marketStatus);

    assert.throws(
      () => createAdminAppInputFromForm(form),
      /Unsupported app market status/,
      marketStatus,
    );
  }
});

test("admin app service calls generated backend SDK paths and normalizes lifecycle state", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      const method = init?.method ?? "GET";
      if (url === "/backend/v3/api/platform/apps?q=browser&status=ACTIVE&market_status=PUBLISHED&app_type=web&page=1&page_size=20" && method === "GET") {
        return { items: [sampleApp()] };
      }
      if (url === "/backend/v3/api/platform/apps/8101" && method === "GET") {
        return { item: sampleApp({ marketStatus: "PUBLISHED" }) };
      }
      if (url === "/backend/v3/api/platform/apps" && method === "POST") {
        return { item: sampleApp({ id: "9001", name: "Draft App" }) };
      }
      if (url === "/backend/v3/api/platform/apps/8101" && method === "PUT") {
        return { item: sampleApp({ name: "Browser Smoke Admin App Pro" }) };
      }
      if (url === "/backend/v3/api/platform/apps/8101/publish" && method === "POST") {
        return { item: sampleApp({ marketStatus: "PUBLISHED" }) };
      }
      if (url === "/backend/v3/api/platform/apps/8101/unpublish" && method === "POST") {
        return { item: sampleApp({ marketStatus: "OFFLINE" }) };
      }
      if (url === "/backend/v3/api/platform/apps/8101/disable" && method === "POST") {
        return { item: sampleApp({ status: "INACTIVE" }) };
      }
      if (url === "/backend/v3/api/platform/apps/8101/enable" && method === "POST") {
        return { item: sampleApp({ status: "ACTIVE" }) };
      }
      if (url === "/backend/v3/api/platform/apps/8101" && method === "DELETE") {
        return { deleted: true };
      }
      throw new Error(`Unexpected request ${method} ${url}`);
    },
    async (captured) => {
      const apps = await AdminAppService.fetchApps({
        searchQuery: "browser",
        status: "ACTIVE",
        marketStatus: "PUBLISHED",
        appType: "web",
        page: 1,
        pageSize: 20,
      });
      const app = await AdminAppService.fetchApp("8101");
      const created = await AdminAppService.createApp({
        name: "Draft App",
        config: { standard: { appKey: "draft-app" } },
        status: "ACTIVE",
        marketStatus: "DRAFT",
      });
      const updated = await AdminAppService.updateApp("8101", {
        name: "Browser Smoke Admin App Pro",
      });
      const published = await AdminAppService.publishApp("8101");
      const offline = await AdminAppService.offlineApp("8101");
      const disabled = await AdminAppService.disableApp("8101");
      const enabled = await AdminAppService.enableApp("8101");
      const deleted = await AdminAppService.deleteApp("8101");

      assert.equal(apps[0].uuid, "app-browser-smoke-admin");
      assert.equal(app.marketStatus, "PUBLISHED");
      assert.equal(created.id, "9001");
      assert.equal(updated.name, "Browser Smoke Admin App Pro");
      assert.equal(published.marketStatus, "PUBLISHED");
      assert.equal(offline.marketStatus, "OFFLINE");
      assert.equal(disabled.status, "INACTIVE");
      assert.equal(enabled.status, "ACTIVE");
      assert.equal(deleted, true);

      assert.deepEqual(captured.map((request) => `${request.method} ${request.url}`), [
        "GET /backend/v3/api/platform/apps?q=browser&status=ACTIVE&market_status=PUBLISHED&app_type=web&page=1&page_size=20",
        "GET /backend/v3/api/platform/apps/8101",
        "POST /backend/v3/api/platform/apps",
        "PUT /backend/v3/api/platform/apps/8101",
        "POST /backend/v3/api/platform/apps/8101/publish",
        "POST /backend/v3/api/platform/apps/8101/unpublish",
        "POST /backend/v3/api/platform/apps/8101/disable",
        "POST /backend/v3/api/platform/apps/8101/enable",
        "DELETE /backend/v3/api/platform/apps/8101",
      ]);

      assert.equal(captured[0].body, "");
      assert.deepEqual(JSON.parse(captured[2].body), {
        name: "Draft App",
        icon: {},
        resourceList: {},
        config: { standard: { appKey: "draft-app" } },
        status: "ACTIVE",
        marketStatus: "DRAFT",
        platforms: {},
        installPlatforms: {},
        installSkill: {},
        installConfig: {},
        releaseNotes: [],
      });
      assert.deepEqual(JSON.parse(captured[3].body), { name: "Browser Smoke Admin App Pro" });
      for (const request of captured.filter((item) => item.headers["x-request-id"] !== undefined)) {
        assert.match(request.headers["x-request-id"], /^admin-app-/);
      }
    },
  );
});

test("admin app service validates path segments and structured JSON form fields", async () => {
  await assert.rejects(() => AdminAppService.fetchApp("../admin"), /appId must be a safe path segment/);
  await assert.rejects(() => AdminAppService.updateApp("app/1", { name: "x" }), /appId must be a safe path segment/);
  await assert.rejects(() => AdminAppService.createApp({ name: "" }), /name is required/);
  await assert.rejects(
    () => AdminAppService.createApp({ name: "Missing App Key" }),
    /config.standard.appKey is required/,
  );
  await assert.rejects(
    () => AdminAppService.createApp({ name: "Invalid App Key", config: { standard: { appKey: "admin_app" } } }),
    /appKey must use lowercase kebab-case/,
  );
  await assert.rejects(
    () => AdminAppService.updateApp("8101", { config: { standard: {} } }),
    /config.standard.appKey is required/,
  );
  await assert.rejects(
    () => AdminAppService.updateApp("8101", { config: { standard: { appKey: "Admin-App" } } }),
    /appKey must use lowercase kebab-case/,
  );
  await assert.rejects(
    () => AdminAppService.createApp({ name: "Invalid", config: [] as unknown as JsonObject }),
    /config must be a JSON object/,
  );

  const objectForm = new FormData();
  objectForm.set("name", "Invalid JSON");
  objectForm.set("config", "[1,2,3]");
  assert.throws(() => createAdminAppInputFromForm(objectForm), /config must be a JSON object/);

  const arrayForm = new FormData();
  arrayForm.set("name", "Invalid Release Notes");
  arrayForm.set("releaseNotes", "{}");
  assert.throws(() => createAdminAppInputFromForm(arrayForm), /releaseNotes must be a JSON array of objects/);
});

test("admin app service fails closed when backend app config omits the standard app key", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      if (url === "/backend/v3/api/platform/apps/8101" && (init?.method ?? "GET") === "GET") {
        return { item: sampleApp({ config: {} }) };
      }
      throw new Error(`Unexpected request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => AdminAppService.fetchApp("8101"),
        /config.standard.appKey is required/,
      );
    },
  );
});
