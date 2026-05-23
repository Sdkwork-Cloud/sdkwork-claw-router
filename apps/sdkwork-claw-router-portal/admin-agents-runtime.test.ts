import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { clearStoredAppSessionToken } from "./packages/sdkwork-claw-router-commons/src/app-session-token.ts";
import { resetClawRouterSdkClients } from "./packages/sdkwork-claw-router-commons/src/sdk-clients.ts";
import { AdminAgentService } from "./packages/sdkwork-claw-router-admin-agents/src/agentService.ts";

const adminAgentsSourcePath = new URL(
  "./packages/sdkwork-claw-router-admin-agents/src/index.tsx",
  import.meta.url,
);

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
    value: {
      dispatchEvent: () => true,
    },
  });
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    captured.push({
      url,
      method: init?.method ?? "GET",
      headers: Object.fromEntries(new Headers(init?.headers).entries()),
      body: typeof init?.body === "string" ? init.body : "",
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

function sampleAgent(overrides: Record<string, unknown> = {}) {
  return {
    id: "agent-1",
    ownerUserId: 42,
    code: "product-studio-agent",
    name: "Product Studio Agent",
    description: "Creates product content.",
    visibility: "private",
    status: "active",
    avatarUrl: "/agents/product.svg",
    templateSource: "custom",
    createdAt: "2026-05-17T08:00:00Z",
    updatedAt: "2026-05-17T08:30:00Z",
    defaultVersion: {
      id: "version-1",
      versionNo: 1,
      releaseStatus: "draft",
      model: "gpt-4.1",
      systemPrompt: "You are a product assistant.",
      toolPolicy: { tools: [{ name: "web_search" }] },
      memoryPolicy: { enabled: true },
      mcpPolicy: { servers: [{ code: "linear" }, { code: "github" }] },
      skillPolicy: { skills: [{ code: "brief" }] },
      runtimePolicy: { maxSteps: 8 },
      createdAt: "2026-05-17T08:00:00Z",
      updatedAt: "2026-05-17T08:30:00Z",
    },
    capabilities: {
      memoryEnabled: true,
      mcpServerCount: 2,
      skillBindingCount: 1,
    },
    ...overrides,
  };
}

test("admin agent service lists agents through generated backend SDK and normalizes filters", async () => {
  await withBackendSdkFetch(
    (url) => {
      assert.equal(url, "/backend/v3/api/agents?q=studio&owner_user_id=42&status=active&visibility=private&page=2&page_size=25");
      return { items: [sampleAgent()] };
    },
    async (captured) => {
      const items = await AdminAgentService.listAgents({
        page: 2,
        pageSize: 25,
        q: " studio ",
        ownerUserId: 42,
        status: "active",
        visibility: "private",
      });

      assert.equal(captured.length, 1);
      assert.equal(captured[0].method, "GET");
      assert.equal(items[0].id, "agent-1");
      assert.equal(items[0].ownerUserId, 42);
      assert.equal(items[0].defaultVersion.model, "gpt-4.1");
      assert.deepEqual(items[0].capabilities, {
        memoryEnabled: true,
        mcpServerCount: 2,
        skillBindingCount: 1,
      });
    },
  );
});

test("admin agent service retrieves details through generated backend SDK and rejects unsafe ids", async () => {
  await withBackendSdkFetch(
    (url) => {
      assert.equal(url, "/backend/v3/api/agents/product-studio-agent");
      return sampleAgent({ id: "product-studio-agent" });
    },
    async (captured) => {
      const item = await AdminAgentService.retrieveAgent("product-studio-agent");
      assert.equal(captured.length, 1);
      assert.equal(captured[0].method, "GET");
      assert.equal(item.id, "product-studio-agent");

      await assert.rejects(
        () => AdminAgentService.retrieveAgent("../unsafe"),
        /agent id contains unsupported characters/,
      );
      assert.equal(captured.length, 1);
    },
  );
});

test("admin agent management uses category navigation and drawer-based details", async () => {
  const source = await readFile(adminAgentsSourcePath, "utf8");

  [
    "data-admin-agent-layout",
    "data-admin-agent-category-tree",
    "data-admin-agent-table-card",
    "data-admin-agent-details-drawer",
    "function AdminAgentCategoryTree",
    "function AgentDetailsDrawer",
    "selectedCategoryId",
    "setSelectedCategoryId",
    "onClick={() => { void openDetails(agent); }}",
    "xl:grid-cols-[320px_minmax(0,1fr)]",
  ].forEach((marker) => {
    assert.ok(source.includes(marker), `expected admin agents source to include ${marker}`);
  });

  [
    "xl:grid-cols-[minmax(0,1fr)_420px]",
    "<aside className=\"min-h-[420px]",
    "BusinessStatePanel kind=\"empty\" title={t('admin.agents.details.noSelection')}",
  ].forEach((legacyMarker) => {
    assert.equal(source.includes(legacyMarker), false, `legacy right-side detail panel marker remains: ${legacyMarker}`);
  });
});

test("admin agent management uses bottom pagination controls", async () => {
  const source = await readFile(adminAgentsSourcePath, "utf8");
  const i18nSource = await readFile(
    new URL("./packages/sdkwork-claw-router-i18n/src/index.ts", import.meta.url),
    "utf8",
  );

  for (const expected of [
    "data-admin-agent-pagination",
    "BottomPagination",
    "const [page, setPage] = useState(1);",
    "page,",
    "nextQuery.pageSize = normalizedPageSize;",
    "setPage(1)",
    "setPage((current) => Math.max(1, current - 1))",
    "setPage((current) => current + 1)",
    "hasNextPage={filteredAgents.length >= Number(pageSize)}",
  ]) {
    assert.ok(source.includes(expected), `missing admin agent pagination marker: ${expected}`);
  }

  for (const key of [
    "admin.agents.pagination.showing",
    "admin.agents.pagination.page",
    "admin.agents.pagination.pageSize",
  ]) {
    assert.ok(source.includes(`t('${key}'`), `admin agents page should consume i18n key ${key}`);
    assert.equal(
      i18nSource.split(`"${key}":`).length - 1,
      2,
      `admin agent i18n key ${key} must exist once in English and once in Chinese resources`,
    );
  }
});

test("admin agent management table fills the available admin viewport", async () => {
  const source = await readFile(adminAgentsSourcePath, "utf8");

  for (const expected of [
    "AdminTableShell",
    "data-admin-agent-table-card",
    "data-admin-agent-table-viewport",
    "data-admin-agent-pagination",
    "flex h-full w-full min-w-0 flex-col",
    "data-admin-agent-layout className=\"grid min-h-0 flex-1",
    "footer={",
    "sticky top-0 z-10",
  ]) {
    assert.ok(source.includes(expected), `missing adaptive admin agent table marker: ${expected}`);
  }

  assert.ok(
    source.indexOf("data-admin-agent-table-viewport") < source.indexOf("data-admin-agent-pagination"),
    "admin agent pagination should render outside the scrollable table viewport",
  );
});
