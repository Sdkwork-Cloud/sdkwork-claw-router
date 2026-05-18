import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { clearStoredAppSessionToken } from "./packages/sdkwork-claw-router-commons/src/app-session-token.ts";
import { resetClawRouterSdkClients } from "./packages/sdkwork-claw-router-commons/src/sdk-clients.ts";
import { AgentService } from "./packages/sdkwork-claw-router-console-agents/src/agentService.ts";

const originalCryptoDescriptor = Object.getOwnPropertyDescriptor(globalThis, "crypto");
const originalFetch = globalThis.fetch;
const originalWindowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");

type CapturedSdkRequest = {
  url: string;
  method: string;
  body: string;
  headers: Record<string, string>;
};

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

async function withAgentSdkResponse<T>(
  responseBody: unknown,
  fn: (captured: CapturedSdkRequest[]) => Promise<T>,
): Promise<T> {
  const captured: CapturedSdkRequest[] = [];
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    enumerable: true,
    value: { dispatchEvent: () => true },
  });
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    captured.push({
      url,
      method: init?.method ?? "GET",
      body: typeof init?.body === "string" ? init.body : "",
      headers: Object.fromEntries(new Headers(init?.headers).entries()),
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

const agentItem = {
  id: "agent-1",
  ownerUserId: 30,
  code: "product-studio-agent",
  name: "Product Studio Agent",
  description: "Creates product launch assets",
  visibility: "private",
  status: "active",
  avatarUrl: null,
  templateSource: null,
  createdAt: "2026-05-17 08:00:00",
  updatedAt: "2026-05-17 08:00:00",
  defaultVersion: {
    id: "agent-version-1",
    versionNo: 1,
    releaseStatus: "draft",
    model: "gpt-5.1",
    systemPrompt: "You are a precise launch content agent.",
    toolPolicy: {},
    memoryPolicy: { enabled: true },
    mcpPolicy: { servers: ["filesystem"] },
    skillPolicy: { skills: ["image.generate"] },
    runtimePolicy: { executionMode: "interactive" },
    createdAt: "2026-05-17 08:00:00",
    updatedAt: "2026-05-17 08:00:00",
  },
  capabilities: {
    memoryEnabled: true,
    mcpServerCount: 1,
    skillBindingCount: 1,
  },
};

const agentI18nKeys = [
  "console.agents.title",
  "console.agents.summary.count",
  "console.agents.searchPlaceholder",
  "console.agents.errors.loadFailed",
  "console.agents.errors.detailLoadFailed",
  "console.agents.errors.createFailed",
  "console.agents.errors.nameRequired",
  "console.agents.errors.categoryNameRequired",
  "console.agents.errors.actionUnsupported",
  "console.agents.categories.title",
  "console.agents.categories.add",
  "console.agents.categories.all",
  "console.agents.categories.active",
  "console.agents.categories.draft",
  "console.agents.categories.memory",
  "console.agents.categories.mcp",
  "console.agents.categories.skills",
  "console.agents.categories.customFallback",
  "console.agents.categories.createTitle",
  "console.agents.categories.name",
  "console.agents.categories.description",
  "console.agents.categories.submit",
  "console.agents.table.title",
  "console.agents.table.agent",
  "console.agents.table.model",
  "console.agents.table.status",
  "console.agents.table.capabilities",
  "console.agents.table.updated",
  "console.agents.table.actions",
  "console.agents.actions.detail",
  "console.agents.actions.edit",
  "console.agents.actions.delete",
  "console.agents.edit.title",
  "console.agents.delete.title",
  "console.agents.delete.message",
  "console.agents.listTitle",
  "console.agents.states.loading",
  "console.agents.states.loadError",
  "console.agents.states.empty",
  "console.agents.states.emptyDescription",
  "console.agents.states.noSearchResult",
  "console.agents.states.detailLoading",
  "console.agents.states.detailLoadError",
  "console.agents.states.noSelection",
  "console.agents.states.noSelectionDescription",
  "console.agents.create.title",
  "console.agents.create.submit",
  "console.agents.form.name",
  "console.agents.form.code",
  "console.agents.form.model",
  "console.agents.form.description",
  "console.agents.form.systemPrompt",
  "console.agents.form.memory",
  "console.agents.form.mcpServers",
  "console.agents.form.skills",
  "console.agents.form.executionMode",
  "console.agents.executionMode.interactive",
  "console.agents.executionMode.autonomous",
  "console.agents.executionMode.reviewRequired",
  "console.agents.detail.model",
  "console.agents.detail.memory",
  "console.agents.detail.mcpServers",
  "console.agents.detail.skills",
  "console.agents.detail.systemPrompt",
  "console.agents.detail.memoryPolicy",
  "console.agents.detail.mcpPolicy",
  "console.agents.detail.skillPolicy",
  "console.agents.detail.toolPolicy",
  "console.agents.detail.runtimePolicy",
  "console.agents.value.unset",
  "console.agents.value.enabled",
  "console.agents.value.disabled",
  "console.agents.value.notConfigured",
  "console.agents.visibility.private",
  "console.agents.visibility.organization",
  "console.agents.visibility.public",
  "console.agents.status.active",
  "console.agents.status.disabled",
  "console.agents.releaseStatus.published",
  "console.agents.releaseStatus.archived",
  "console.agents.releaseStatus.draft",
];

test("console agent i18n resources include English and Chinese entries", () => {
  const source = readFileSync(
    new URL("./packages/sdkwork-claw-router-i18n/src/index.ts", import.meta.url),
    "utf8",
  );

  for (const key of agentI18nKeys) {
    assert.equal(
      source.match(new RegExp(`"${key}"`, "g"))?.length,
      2,
      `${key} must be translated in both locales`,
    );
  }
});

test("console agent list uses generated app SDK query parameters", async () => {
  await withAgentSdkResponse(
    { code: "2000", data: { items: [agentItem] } },
    async (captured) => {
      const result = await AgentService.listAgents({ page: 2, pageSize: 40, q: " studio " });

      assert.equal(result.length, 1);
      assert.equal(result[0].code, "product-studio-agent");
      assert.equal(captured.length, 1);
      assert.equal(captured[0].method, "GET");
      assert.equal(captured[0].url, "/app/v3/api/agents?page=2&page_size=40&q=studio");
    },
  );
});

test("console agent detail uses generated app SDK detail path", async () => {
  await withAgentSdkResponse(
    { code: "2000", data: agentItem },
    async (captured) => {
      const result = await AgentService.retrieveAgent("product-studio-agent");

      assert.equal(result.id, "agent-1");
      assert.equal(result.defaultVersion.model, "gpt-5.1");
      assert.equal(captured.length, 1);
      assert.equal(captured[0].method, "GET");
      assert.equal(captured[0].url, "/app/v3/api/agents/product-studio-agent");
    },
  );
});

test("console agent create sends standard idempotency and request headers through generated app SDK", async () => {
  let sequence = 0;
  await withAgentSdkResponse(
    { code: "2000", data: { item: agentItem } },
    async (captured) => {
      const result = await withCrypto(
        {
          randomUUID: () => {
            sequence += 1;
            return sequence === 1
              ? "11111111-2222-4333-8444-555555555555"
              : "66666666-7777-4888-9999-aaaaaaaaaaaa";
          },
        } as unknown as Crypto,
        () =>
          AgentService.createAgent({
            name: " Product Studio Agent ",
            code: " product-studio-agent ",
            description: " Creates product launch assets ",
            model: " gpt-5.1 ",
            systemPrompt: " You are a precise launch content agent. ",
            memoryEnabled: true,
            mcpServers: ["filesystem", " filesystem ", ""],
            skills: ["image.generate", "image.generate"],
            executionMode: " interactive ",
          }),
      );

      assert.equal(result.name, "Product Studio Agent");
      assert.equal(captured.length, 1);
      assert.equal(captured[0].method, "POST");
      assert.equal(captured[0].url, "/app/v3/api/agents");
      assert.equal(
        captured[0].headers["idempotency-key"],
        "create-agent-11111111-2222-4333-8444-555555555555",
      );
      assert.equal(
        captured[0].headers["x-request-id"],
        "request-66666666-7777-4888-9999-aaaaaaaaaaaa",
      );
      assert.equal(captured[0].headers["content-type"], "application/json");
      assert.deepEqual(JSON.parse(captured[0].body), {
        name: "Product Studio Agent",
        code: "product-studio-agent",
        description: "Creates product launch assets",
        model: "gpt-5.1",
        systemPrompt: "You are a precise launch content agent.",
        toolPolicy: {},
        memoryPolicy: { enabled: true },
        mcpPolicy: { servers: ["filesystem"] },
        skillPolicy: { skills: ["image.generate"] },
        runtimePolicy: { executionMode: "interactive" },
      });
    },
  );
});

test("console agent create validates blank names before generating request tokens or calling the SDK", async () => {
  await withAgentSdkResponse(
    { code: "2000", data: { item: agentItem } },
    async (captured) => {
      await assert.rejects(
        () => withCrypto(undefined, () => AgentService.createAgent({ name: "   " })),
        /name is required/,
      );
      assert.equal(captured.length, 0);
    },
  );
});

test("console agent view localizes blank-name validation before submit reaches the service", async () => {
  const source = await import("node:fs/promises").then((fs) =>
    fs.readFile(new URL("./packages/sdkwork-claw-router-console-agents/src/AgentsView.tsx", import.meta.url), "utf8"),
  );

  assert.match(source, /const agentName = form\.name\.trim\(\);/);
  assert.match(source, /if \(!agentName\)/);
  assert.match(source, /console\.agents\.errors\.nameRequired/);
  assert.doesNotMatch(source, /name is required/);
});

test("console agent view uses category sidebar, table, shared actions, and a left drawer", async () => {
  const source = await import("node:fs/promises").then((fs) =>
    fs.readFile(new URL("./packages/sdkwork-claw-router-console-agents/src/AgentsView.tsx", import.meta.url), "utf8"),
  );

  assert.match(source, /function AgentCategorySidebar/);
  assert.match(source, /function AgentTable/);
  assert.match(source, /function AgentActionButtons/);
  assert.match(source, /function AgentDrawer/);
  assert.match(source, /drawerState/);
  assert.match(source, /'category-create'/);
  assert.match(source, /'agent-detail'/);
  assert.match(source, /'agent-edit'/);
  assert.match(source, /'agent-delete'/);
  assert.match(source, /slide-in-from-left/);
  assert.doesNotMatch(source, /2xl:grid-cols-\[minmax\(0,1fr\)_420px\]/);
});

test("console agent list selection state is driven by the selected agent id", async () => {
  const source = await import("node:fs/promises").then((fs) =>
    fs.readFile(new URL("./packages/sdkwork-claw-router-console-agents/src/AgentsView.tsx", import.meta.url), "utf8"),
  );

  assert.match(source, /selectedAgentId === agent\.id/);
  assert.doesNotMatch(source, /selectedAgent\?\.id === agent\.id/);
});

test("console agent custom categories do not show all agents before backend assignment exists", async () => {
  const source = await import("node:fs/promises").then((fs) =>
    fs.readFile(new URL("./packages/sdkwork-claw-router-console-agents/src/AgentsView.tsx", import.meta.url), "utf8"),
  );

  assert.match(source, /if \(category === 'all'\)/);
  assert.match(source, /return false;\s*\}\s*function createAgentFormValues/);
});
