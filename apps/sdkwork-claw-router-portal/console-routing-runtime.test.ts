import assert from "node:assert/strict";
import test from "node:test";

import {
  createMappingRuleDraft,
  isValidMappingModelName,
  hasDuplicateSourceModel,
} from "./packages/sdkwork-claw-router-console-routing/src/strategyRules.ts";
import {
  createRoutingChannelInputFromForm,
  createRoutingChannelUpdateInputFromForm,
  type RoutingChannelFormValues,
} from "./packages/sdkwork-claw-router-console-routing/src/channelForm.ts";
import { clearStoredAppSessionToken } from "./packages/sdkwork-claw-router-commons/src/app-session-token.ts";
import { resetClawRouterSdkClients } from "./packages/sdkwork-claw-router-commons/src/sdk-clients.ts";
import { RoutingService } from "./packages/sdkwork-claw-router-console-routing/src/routingService.ts";

const originalFetch = globalThis.fetch;
const originalWindowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");

type CapturedSdkRequest = {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string;
};

async function withRoutingSdkFetch<T>(
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
    const headers = Object.fromEntries(new Headers(init?.headers).entries());
    const body = typeof init?.body === "string" ? init.body : "";
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

test("routing strategy rule drafts use deterministic sequence ids instead of clocks", () => {
  const firstRule = createMappingRuleDraft([], " gpt-4 ", " azure-gpt4-32k ");
  const secondRule = createMappingRuleDraft([firstRule], " gpt-4o ", " claude-3-opus ");

  assert.deepEqual([firstRule.id, secondRule.id], ["rule-1", "rule-2"]);
  assert.equal(firstRule.sourceModel, "gpt-4");
  assert.equal(firstRule.targetModel, "azure-gpt4-32k");
});

test("routing strategy rule drafts advance past existing backend ids", () => {
  const rule = createMappingRuleDraft(
    [
      { id: "backend-rule", sourceModel: "gpt-4", targetModel: "gpt-4o" },
      { id: "rule-7", sourceModel: "gpt-4o-mini", targetModel: "claude-3-haiku" },
      { id: "rule-03", sourceModel: "gpt-3.5", targetModel: "llama-3" },
    ],
    "deepseek-chat",
    "deepseek-reasoner",
  );

  assert.deepEqual(rule, {
    id: "rule-8",
    sourceModel: "deepseek-chat",
    targetModel: "deepseek-reasoner",
  });
});

test("routing strategy model names are trimmed, length-bounded, and duplicate-checked case-insensitively", () => {
  assert.equal(isValidMappingModelName("gpt-4o"), true);
  assert.equal(isValidMappingModelName(" gpt-4o "), true);
  assert.equal(isValidMappingModelName(""), false);
  assert.equal(isValidMappingModelName("gpt 4o"), false);
  assert.equal(isValidMappingModelName("x".repeat(129)), false);

  assert.equal(
    hasDuplicateSourceModel(
      [{ id: "rule-1", sourceModel: "GPT-4O", targetModel: "target" }],
      " gpt-4o ",
    ),
    true,
  );
});

test("routing channel create form values normalize into a create command without view fields", () => {
  const values: RoutingChannelFormValues & Record<string, unknown> = {
    id: "view-channel",
    provider: "OpenAI Inc",
    providerCode: "openai-main",
    apiKey: "sk-view",
    isMultimodal: true,
    latency: "180ms",
    rpm: 120,
    balance: "$12",
    errors: 3,
    name: " Main OpenAI ",
    vendor: " OpenAI ",
    protocol: " OpenAI, OpenAI ",
    accessType: " API Key ",
    baseUrl: " https://api.openai.com/v1 ",
    secretRef: " vault://providers/openai/main ",
    models: [" gpt-4o ", "gpt-4o", " gpt-4o-mini "],
    capabilities: ["llm", "image", "unknown"],
    weight: 10.4,
    status: "paused",
  };
  const input = createRoutingChannelInputFromForm(values);

  assert.deepEqual(input, {
    name: "Main OpenAI",
    vendor: "OpenAI",
    protocol: "OpenAI, OpenAI",
    accessType: "API Key",
    baseUrl: "https://api.openai.com/v1",
    secretRef: "vault://providers/openai/main",
    models: ["gpt-4o", "gpt-4o-mini"],
    capabilities: ["llm", "image"],
    weight: 10,
    status: "active",
  });
  assert.equal("id" in input, false);
  assert.equal("apiKey" in input, false);
  assert.equal("providerCode" in input, false);
  assert.equal("latency" in input, false);
});

test("routing channel update form values keep command fields explicit and optional", () => {
  const values: RoutingChannelFormValues & Record<string, unknown> = {
    id: "view-channel",
    provider: "OpenAI Inc",
    providerCode: "openai-main",
    apiKey: "sk-view",
    isMultimodal: true,
    latency: "180ms",
    rpm: 120,
    balance: "$12",
    errors: 3,
    name: " Updated ",
    vendor: " ",
    protocol: "OpenAI",
    accessType: "API Key",
    baseUrl: "",
    secretRef: "",
    models: [],
    capabilities: [],
    weight: Number.NaN,
    status: "disabled",
  };
  const input = createRoutingChannelUpdateInputFromForm(values);

  assert.deepEqual(input, {
    name: "Updated",
    protocol: "OpenAI",
    accessType: "API Key",
    models: ["default-model"],
    weight: 1,
    status: "disabled",
  });
  assert.equal("vendor" in input, false);
  assert.equal("baseUrl" in input, false);
  assert.equal("secretRef" in input, false);
  assert.equal("provider" in input, false);
  assert.equal("errors" in input, false);
});

test("routing service calls generated app SDK paths and normalizes routing responses", async () => {
  await withRoutingSdkFetch(
    (url, init) => {
      const method = init?.method ?? "GET";
      if (url === "/app/v3/api/ai/routing/channels" && method === "GET") {
        return {
          items: [
            {
              id: "3001",
              name: "OpenAI Primary",
              vendor: "OpenAI",
              providerCode: "openai",
              apiKey: "ref:***openai-main",
              models: ["gpt-4o-mini"],
              capabilities: ["llm"],
              weight: 100,
              status: "active",
              latency: "120ms",
            },
          ],
        };
      }
      if (url === "/app/v3/api/ai/routing/channels" && method === "POST") {
        return {
          item: {
            id: "4001",
            name: "Created Channel",
            vendor: "OpenAI",
            providerCode: "openai",
            apiKey: "ref:***created",
            models: ["gpt-4o-mini"],
            capabilities: ["llm"],
            weight: 10,
            status: "active",
          },
        };
      }
      if (url === "/app/v3/api/ai/routing/channels/4001" && method === "PUT") {
        return {
          item: {
            id: "4001",
            name: "Updated Channel",
            vendor: "OpenAI",
            providerCode: "openai",
            apiKey: "ref:***updated",
            models: ["gpt-4o"],
            capabilities: ["llm"],
            weight: 20,
            status: "active",
          },
        };
      }
      if (url === "/app/v3/api/ai/routing/channels/4001/status" && method === "PUT") {
        return {
          item: {
            id: "4001",
            name: "Updated Channel",
            vendor: "OpenAI",
            providerCode: "openai",
            apiKey: "ref:***updated",
            models: ["gpt-4o"],
            capabilities: ["llm"],
            weight: 20,
            status: "disabled",
          },
        };
      }
      if (url === "/app/v3/api/ai/routing/channels/4001/verify" && method === "POST") {
        return {
          channelId: "4001",
          success: true,
          status: "active",
          latency: "11ms",
          item: {
            id: "4001",
            name: "Updated Channel",
            vendor: "OpenAI",
            providerCode: "openai",
            apiKey: "ref:***updated",
            models: ["gpt-4o"],
            capabilities: ["llm"],
            weight: 20,
            status: "active",
          },
        };
      }
      if (url === "/app/v3/api/ai/routing/channels/4001" && method === "DELETE") {
        return { deleted: true };
      }
      if (url === "/app/v3/api/ai/routing/api_keys") {
        return {
          items: [
            {
              id: "100",
              name: "Owner Key",
              key: "sk-owner********ABCD",
              status: "enabled",
              totalUsage: "5",
              createdAt: "2026-04-29 12:00:00",
            },
          ],
        };
      }
      if (url === "/app/v3/api/ai/routing/request_traces") {
        return {
          items: [
            {
              id: "trace-1",
              time: "2026-04-29 12:01:00",
              model: "gpt-4o-mini",
              channel: "OpenAI Primary",
              status: 200,
              duration: "345ms",
              tokens: 150,
            },
          ],
        };
      }
      if (url === "/app/v3/api/ai/routing/usage") {
        return {
          chartData: [{ time: "2026-04-29", requests: 1, latency: 345 }],
          modelStats: [{ m: "gpt-4o-mini", req: "1", sr: "100.0%", tok: "150", lat: "345ms" }],
        };
      }
      if (url === "/app/v3/api/ai/routing/strategy" && method === "GET") {
        return {
          strategy: "weighted",
          mappingRules: [{ id: "rule-1", sourceModel: "gpt-4", targetModel: "azure-gpt4-32k" }],
        };
      }
      if (url === "/app/v3/api/ai/routing/strategy" && method === "PUT") {
        return { success: true };
      }
      throw new Error(`Unexpected SDK request ${method} ${url}`);
    },
    async (captured) => {
      const channels = await RoutingService.fetchChannels();
      const created = await RoutingService.createChannel({
        name: " Created Channel ",
        vendor: " OpenAI ",
        protocol: "OpenAI",
        accessType: "Standard API Key",
        baseUrl: "https://created.example/v1",
        secretRef: "vault://providers/openai/created",
        models: ["gpt-4o-mini"],
        capabilities: ["llm"],
        weight: 10,
      });
      const updated = await RoutingService.updateChannel("4001", {
        name: "Updated Channel",
        models: ["gpt-4o"],
        weight: 20,
      });
      const disabled = await RoutingService.setChannelStatus("4001", "disabled");
      const tested = await RoutingService.testChannel("4001");
      const deleted = await RoutingService.deleteChannel("4001");
      const apiKeys = await RoutingService.fetchApiKeys();
      const traces = await RoutingService.fetchRequestTraces();
      const usage = await RoutingService.fetchUsageData();
      const strategy = await RoutingService.fetchStrategy();
      await RoutingService.updateStrategy({ strategy: "cost", mappingRules: [] });

      assert.equal(channels[0].name, "OpenAI Primary");
      assert.equal(created.id, "4001");
      assert.equal(updated.name, "Updated Channel");
      assert.equal(disabled.status, "disabled");
      assert.equal(tested.success, true);
      assert.equal(deleted, true);
      assert.equal(apiKeys[0].status, "enabled");
      assert.equal(traces[0].tokens, 150);
      assert.equal(usage.modelStats[0].m, "gpt-4o-mini");
      assert.equal(strategy.strategy, "weighted");
      assert.deepEqual(
        captured.map((request) => `${request.method} ${request.url}`),
        [
          "GET /app/v3/api/ai/routing/channels",
          "POST /app/v3/api/ai/routing/channels",
          "PUT /app/v3/api/ai/routing/channels/4001",
          "PUT /app/v3/api/ai/routing/channels/4001/status",
          "POST /app/v3/api/ai/routing/channels/4001/verify",
          "DELETE /app/v3/api/ai/routing/channels/4001",
          "GET /app/v3/api/ai/routing/api_keys",
          "GET /app/v3/api/ai/routing/request_traces",
          "GET /app/v3/api/ai/routing/usage",
          "GET /app/v3/api/ai/routing/strategy",
          "PUT /app/v3/api/ai/routing/strategy",
        ],
      );
      assert.deepEqual(JSON.parse(captured[1].body), {
        name: "Created Channel",
        vendor: "OpenAI",
        protocol: "OpenAI",
        accessType: "Standard API Key",
        baseUrl: "https://created.example/v1",
        secretRef: "vault://providers/openai/created",
        models: ["gpt-4o-mini"],
        capabilities: ["llm"],
        weight: 10,
      });
      assert.equal(captured.every((request) => request.headers["content-type"] === "application/json"), true);
    },
  );
});

test("routing service rejects invalid channel and strategy commands before calling generated app SDK", async () => {
  await withRoutingSdkFetch(
    () => {
      throw new Error("app SDK must not be called for invalid routing commands");
    },
    async (captured) => {
      await assert.rejects(
        () =>
          RoutingService.createChannel({
            name: "",
            vendor: "OpenAI",
            secretRef: "vault://providers/openai/main",
            models: ["gpt-4o"],
          }),
        /name is required/,
      );
      await assert.rejects(
        () =>
          RoutingService.createChannel({
            name: "OpenAI",
            vendor: "OpenAI",
            secretRef: "vault://providers/openai/main",
            models: [],
          }),
        /models must include at least one item/,
      );
      await assert.rejects(
        () => RoutingService.updateChannel("", { name: "Updated" }),
        /channelId is required/,
      );
      await assert.rejects(
        () =>
          RoutingService.updateStrategy({
            strategy: "weighted",
            mappingRules: [{ id: "rule-1", sourceModel: "", targetModel: "gpt-4o" }],
          }),
        /sourceModel is required/,
      );
      assert.equal(captured.length, 0);
    },
  );
});

test("routing service rejects unsafe channel path ids before calling generated app SDK", async () => {
  await withRoutingSdkFetch(
    () => {
      throw new Error("app SDK must not be called for unsafe routing channel path ids");
    },
    async (captured) => {
      await assert.rejects(
        () => RoutingService.updateChannel("4001/debug", { name: "Updated" }),
        /channelId must be a safe path segment/,
      );
      await assert.rejects(
        () => RoutingService.setChannelStatus("../4001", "disabled"),
        /channelId must be a safe path segment/,
      );
      await assert.rejects(
        () => RoutingService.testChannel("4001?debug=true"),
        /channelId must be a safe path segment/,
      );
      await assert.rejects(
        () => RoutingService.deleteChannel("4001/child"),
        /channelId must be a safe path segment/,
      );
      assert.equal(captured.length, 0);
    },
  );
});

test("routing channel test fails closed when app SDK success response omits the tested channel item", async () => {
  await withRoutingSdkFetch(
    (url, init) => {
      if (url === "/app/v3/api/ai/routing/channels/4001/verify" && init?.method === "POST") {
        return {
          channelId: "4001",
          success: true,
          status: "active",
          latency: "11ms",
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => RoutingService.testChannel("4001"),
        /Routing channel test response is missing channel data/,
      );
    },
  );
});

test("routing channel list fails closed when app SDK omits stable channel ids", async () => {
  await withRoutingSdkFetch(
    (url, init) => {
      if (url === "/app/v3/api/ai/routing/channels" && (init?.method ?? "GET") === "GET") {
        return {
          items: [
            {
              name: "Missing Id Channel",
              vendor: "OpenAI",
              providerCode: "openai",
              apiKey: "ref:***openai-main",
              models: ["gpt-4o-mini"],
              capabilities: ["llm"],
              weight: 100,
              status: "active",
            },
          ],
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => RoutingService.fetchChannels(),
        /Routing channel id is required/,
      );
    },
  );
});

test("routing channel list fails closed when app SDK returns malformed channel rows", async () => {
  await withRoutingSdkFetch(
    (url, init) => {
      if (url === "/app/v3/api/ai/routing/channels" && (init?.method ?? "GET") === "GET") {
        return {
          items: [
            {
              id: "3001",
              name: "OpenAI Primary",
              vendor: "OpenAI",
              providerCode: "openai",
              apiKey: "ref:***openai-main",
              models: ["gpt-4o-mini"],
              capabilities: ["llm"],
              weight: 100,
              status: "active",
            },
            "malformed-channel-row",
          ],
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => RoutingService.fetchChannels(),
        /Routing channel record is required/,
      );
    },
  );
});

test("routing channel list fails closed when app SDK omits channel models", async () => {
  await withRoutingSdkFetch(
    (url, init) => {
      if (url === "/app/v3/api/ai/routing/channels" && (init?.method ?? "GET") === "GET") {
        return {
          items: [
            {
              id: "3001",
              name: "OpenAI Primary",
              vendor: "OpenAI",
              providerCode: "openai",
              apiKey: "ref:***openai-main",
              capabilities: ["llm"],
              weight: 100,
              status: "active",
            },
          ],
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => RoutingService.fetchChannels(),
        /Routing channel models are required/,
      );
    },
  );
});

test("routing API key list fails closed when app SDK returns malformed key rows", async () => {
  await withRoutingSdkFetch(
    (url, init) => {
      if (url === "/app/v3/api/ai/routing/api_keys" && (init?.method ?? "GET") === "GET") {
        return {
          items: ["malformed-api-key-row"],
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => RoutingService.fetchApiKeys(),
        /Routing API key record is required/,
      );
    },
  );
});

test("routing API key list fails closed when app SDK omits masked key values", async () => {
  await withRoutingSdkFetch(
    (url, init) => {
      if (url === "/app/v3/api/ai/routing/api_keys" && (init?.method ?? "GET") === "GET") {
        return {
          items: [
            {
              id: "100",
              name: "Owner Key",
              status: "enabled",
              totalUsage: "5",
              createdAt: "2026-04-29 12:00:00",
            },
          ],
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => RoutingService.fetchApiKeys(),
        /Routing API key value is required/,
      );
    },
  );
});

test("routing request traces fail closed when app SDK omits stable trace ids", async () => {
  await withRoutingSdkFetch(
    (url, init) => {
      if (url === "/app/v3/api/ai/routing/request_traces" && (init?.method ?? "GET") === "GET") {
        return {
          items: [
            {
              time: "2026-04-29 12:01:00",
              model: "gpt-4o-mini",
              channel: "OpenAI Primary",
              status: 200,
              duration: "345ms",
              tokens: 150,
            },
          ],
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => RoutingService.fetchRequestTraces(),
        /Request trace id is required/,
      );
    },
  );
});

test("routing request traces fail closed when app SDK returns malformed trace rows", async () => {
  await withRoutingSdkFetch(
    (url, init) => {
      if (url === "/app/v3/api/ai/routing/request_traces" && (init?.method ?? "GET") === "GET") {
        return {
          items: ["malformed-trace-row"],
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => RoutingService.fetchRequestTraces(),
        /Request trace record is required/,
      );
    },
  );
});

test("routing request traces fail closed when app SDK omits token counts", async () => {
  await withRoutingSdkFetch(
    (url, init) => {
      if (url === "/app/v3/api/ai/routing/request_traces" && (init?.method ?? "GET") === "GET") {
        return {
          items: [
            {
              id: "trace-1",
              time: "2026-04-29 12:01:00",
              model: "gpt-4o-mini",
              channel: "OpenAI Primary",
              status: 200,
              duration: "345ms",
            },
          ],
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => RoutingService.fetchRequestTraces(),
        /Request trace tokens are required/,
      );
    },
  );
});

test("routing usage data fails closed when app SDK returns malformed chart rows", async () => {
  await withRoutingSdkFetch(
    (url, init) => {
      if (url === "/app/v3/api/ai/routing/usage" && (init?.method ?? "GET") === "GET") {
        return {
          chartData: ["malformed-chart-row"],
          modelStats: [{ m: "gpt-4o-mini", req: "1", sr: "100.0%", tok: "150", lat: "345ms" }],
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => RoutingService.fetchUsageData(),
        /Routing usage data record is required/,
      );
    },
  );
});

test("routing strategy fails closed when app SDK returns malformed mapping rules", async () => {
  await withRoutingSdkFetch(
    (url, init) => {
      if (url === "/app/v3/api/ai/routing/strategy" && (init?.method ?? "GET") === "GET") {
        return {
          strategy: "weighted",
          mappingRules: ["malformed-mapping-rule-row"],
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => RoutingService.fetchStrategy(),
        /Routing mapping rule record is required/,
      );
    },
  );
});

test("routing strategy fails closed when app SDK returns unsupported strategy type", async () => {
  await withRoutingSdkFetch(
    (url, init) => {
      if (url === "/app/v3/api/ai/routing/strategy" && (init?.method ?? "GET") === "GET") {
        return {
          strategy: "random",
          mappingRules: [],
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => RoutingService.fetchStrategy(),
        /Unsupported routing strategy: random/,
      );
    },
  );
});
