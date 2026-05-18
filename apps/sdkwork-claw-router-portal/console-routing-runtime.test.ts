import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  createMappingRuleDraft,
  isValidMappingModelName,
  hasDuplicateSourceModel,
} from "./packages/sdkwork-claw-router-console-routing/src/strategyRules.ts";
import {
  createRoutingChannelInputFromForm,
  createRoutingChannelUpdateInputFromForm,
  resolveRoutingMultiProtocolFormValue,
  resolveRoutingMultiProtocolSubmitValue,
  resolveRoutingSelectFormValue,
  resolveRoutingAuthTypeFormValue,
  resolveRoutingAuthTypeSubmitValue,
  type RoutingChannelFormValues,
} from "./packages/sdkwork-claw-router-console-routing/src/channelForm.ts";
import { clearStoredAppSessionToken } from "./packages/sdkwork-claw-router-commons/src/app-session-token.ts";
import { resetClawRouterSdkClients } from "./packages/sdkwork-claw-router-commons/src/sdk-clients.ts";
import { RoutingService, authTypesList, knownModelVendors, protocolsList } from "./packages/sdkwork-claw-router-console-routing/src/routingService.ts";

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
    value: { dispatchEvent: () => true },
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

function sampleRoutingChannel(overrides: Record<string, unknown> = {}) {
  return {
    id: "3001",
    name: "OpenAI Primary",
    vendor: "OpenAI",
    provider: "OpenAI",
    providerCode: "openai",
    protocol: "OpenAI",
    accessType: "api-key",
    baseUrl: "https://api.openai.com/v1",
    apiKey: "ref:***openai-main",
    models: ["gpt-4o-mini"],
    capabilities: ["llm"],
    isMultimodal: false,
    weight: 100,
    status: "active",
    latency: "120ms",
    rpm: 60,
    balance: "$12",
    errors: 0,
    ...overrides,
  };
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
    capabilities: ["llm", "image"],
    timeoutMs: "60000",
    retryEnabled: true,
    retryMaxAttempts: "3",
    retryableStatusCodes: "429, 503, 503",
    retryBackoffMs: "25",
    circuitBreakerEnabled: true,
    circuitBreakerFailureThreshold: "4",
    weight: 10,
    status: "active",
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
    timeoutMs: 60000,
    retryPolicy: {
      maxAttempts: 3,
      retryableStatusCodes: [429, 503],
      backoffMs: 25,
    },
    circuitBreakerPolicy: {
      failureThreshold: 4,
    },
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
    models: ["gpt-4o"],
    capabilities: [],
    timeoutMs: "",
    retryEnabled: false,
    retryMaxAttempts: "3",
    retryableStatusCodes: "429, 503",
    retryBackoffMs: "0",
    circuitBreakerEnabled: false,
    circuitBreakerFailureThreshold: "",
    weight: 20,
    status: "disabled",
  };
  const input = createRoutingChannelUpdateInputFromForm(values);

  assert.deepEqual(input, {
    name: "Updated",
    protocol: "OpenAI",
    accessType: "API Key",
    models: ["gpt-4o"],
    timeoutMs: null,
    retryPolicy: null,
    circuitBreakerPolicy: null,
    weight: 20,
    status: "disabled",
  });
  assert.equal("vendor" in input, false);
  assert.equal("baseUrl" in input, false);
  assert.equal("secretRef" in input, false);
  assert.equal("provider" in input, false);
  assert.equal("errors" in input, false);
});

test("routing channel auth type helpers preserve custom backend auth modes", () => {
  assert.equal(resolveRoutingAuthTypeFormValue(undefined, authTypesList), "api-key");
  assert.equal(resolveRoutingAuthTypeFormValue(" API Key ", authTypesList), "api-key");
  assert.equal(resolveRoutingAuthTypeFormValue("api-key", authTypesList), "api-key");
  assert.equal(resolveRoutingAuthTypeFormValue(" hmac-signed ", authTypesList), "hmac-signed");

  assert.equal(resolveRoutingAuthTypeSubmitValue("api-key", authTypesList), "API Key");
  assert.equal(resolveRoutingAuthTypeSubmitValue("hmac-signed", authTypesList), "hmac-signed");
  assert.throws(
    () => resolveRoutingAuthTypeSubmitValue(" ", authTypesList),
    /console\.routing\.validation\.authTypeRequired/,
  );
});

test("routing channel select helpers preserve custom vendors and protocols", () => {
  assert.equal(resolveRoutingSelectFormValue(undefined, knownModelVendors, "OpenAI"), "OpenAI");
  assert.equal(resolveRoutingSelectFormValue(" DeepSeek ", knownModelVendors, "OpenAI"), "DeepSeek");
  assert.equal(resolveRoutingSelectFormValue("AcmeAI", knownModelVendors, "OpenAI"), "AcmeAI");

  assert.deepEqual(resolveRoutingMultiProtocolFormValue(undefined, protocolsList, ["OpenAI"]), ["OpenAI"]);
  assert.deepEqual(resolveRoutingMultiProtocolFormValue("OpenAI compatible protocol", protocolsList, ["OpenAI"]), ["OpenAI"]);
  assert.deepEqual(resolveRoutingMultiProtocolFormValue("OpenAI, Anthropic protocol, Acme RPC", protocolsList, ["OpenAI"]), [
    "OpenAI",
    "Anthropic",
    "Acme RPC",
  ]);

  assert.equal(resolveRoutingMultiProtocolSubmitValue(["OpenAI", "Acme RPC"], protocolsList), "OpenAI compatible protocol, Acme RPC");
  assert.throws(
    () => resolveRoutingMultiProtocolSubmitValue([], protocolsList),
    /console\.routing\.validation\.protocolRequired/,
  );
});

test("routing channel form rejects invalid numeric high availability values", () => {
  assert.throws(
    () =>
      createRoutingChannelInputFromForm({
        name: "OpenAI",
        vendor: "OpenAI",
        protocol: "OpenAI",
        accessType: "API Key",
        baseUrl: "https://api.openai.com/v1",
        secretRef: "vault://providers/openai/main",
        models: ["gpt-4o"],
        capabilities: ["llm"],
        timeoutMs: "0",
        retryEnabled: true,
        retryMaxAttempts: "6",
        retryableStatusCodes: "429",
        retryBackoffMs: "0",
        weight: 10,
        status: "active",
      }),
    /console\.routing\.validation\.timeoutMsRange/,
  );

  assert.throws(
    () =>
      createRoutingChannelInputFromForm({
        name: "OpenAI",
        vendor: "OpenAI",
        protocol: "OpenAI",
        accessType: "API Key",
        baseUrl: "https://api.openai.com/v1",
        secretRef: "vault://providers/openai/main",
        models: ["gpt-4o"],
        capabilities: ["llm"],
        timeoutMs: "60000",
        retryEnabled: true,
        retryMaxAttempts: "3",
        retryableStatusCodes: "418",
        retryBackoffMs: "0",
        weight: 10,
        status: "active",
      }),
    /console\.routing\.validation\.retryStatusUnsupported/,
  );

  assert.throws(
    () =>
      createRoutingChannelUpdateInputFromForm({
        name: "Updated",
        vendor: "",
        protocol: "OpenAI",
        accessType: "API Key",
        baseUrl: "",
        secretRef: "",
        models: ["gpt-4o"],
        capabilities: ["llm"],
        weight: Number.NaN,
        status: "disabled",
      }),
    /console\.routing\.validation\.weightInteger/,
  );

  assert.throws(
    () =>
      createRoutingChannelInputFromForm({
        name: "OpenAI",
        vendor: "OpenAI",
        protocol: "OpenAI",
        accessType: "API Key",
        baseUrl: "https://api.openai.com/v1",
        secretRef: "vault://providers/openai/main",
        models: ["gpt-4o"],
        capabilities: ["llm"],
        weight: "10.4" as unknown as number,
        status: "active",
      }),
    /console\.routing\.validation\.weightInteger/,
  );

  assert.throws(
    () =>
      createRoutingChannelInputFromForm({
        name: "OpenAI",
        vendor: "OpenAI",
        protocol: "OpenAI",
        accessType: "API Key",
        baseUrl: "https://api.openai.com/v1",
        secretRef: "vault://providers/openai/main",
        models: ["gpt-4o"],
        capabilities: ["llm", "unknown"],
        weight: 10,
        status: "active",
      }),
    /console\.routing\.validation\.unsupportedCapability/,
  );
});

test("routing channel form normalizes and validates circuit breaker policy", () => {
  assert.deepEqual(
    createRoutingChannelInputFromForm({
      name: "OpenAI",
      vendor: "OpenAI",
      protocol: "OpenAI",
      accessType: "API Key",
      baseUrl: "https://api.openai.com/v1",
      secretRef: "vault://providers/openai/main",
      models: ["gpt-4o"],
      capabilities: ["llm"],
      circuitBreakerEnabled: true,
      circuitBreakerFailureThreshold: "2",
      weight: 10,
      status: "active",
    }).circuitBreakerPolicy,
    { failureThreshold: 2 },
  );
  assert.equal(
    createRoutingChannelInputFromForm({
      name: "OpenAI",
      vendor: "OpenAI",
      protocol: "OpenAI",
      accessType: "API Key",
      baseUrl: "https://api.openai.com/v1",
      secretRef: "vault://providers/openai/main",
      models: ["gpt-4o"],
      capabilities: ["llm"],
      circuitBreakerEnabled: false,
      circuitBreakerFailureThreshold: "2",
      weight: 10,
      status: "active",
    }).circuitBreakerPolicy,
    undefined,
  );
  assert.equal(
    createRoutingChannelUpdateInputFromForm({
      name: "OpenAI",
      vendor: "OpenAI",
      protocol: "OpenAI",
      accessType: "API Key",
      baseUrl: "https://api.openai.com/v1",
      secretRef: "vault://providers/openai/main",
      models: ["gpt-4o"],
      capabilities: ["llm"],
      circuitBreakerEnabled: false,
      circuitBreakerFailureThreshold: "",
      weight: 10,
      status: "active",
    }).circuitBreakerPolicy,
    null,
  );
  assert.throws(
    () =>
      createRoutingChannelInputFromForm({
        name: "OpenAI",
        vendor: "OpenAI",
        protocol: "OpenAI",
        accessType: "API Key",
        baseUrl: "https://api.openai.com/v1",
        secretRef: "vault://providers/openai/main",
        models: ["gpt-4o"],
        capabilities: ["llm"],
        circuitBreakerEnabled: true,
        circuitBreakerFailureThreshold: "101",
        weight: 10,
        status: "active",
      }),
    /console\.routing\.validation\.circuitBreakerPolicyFailureThresholdRange/,
  );
});

test("routing channel form requires explicit model bindings instead of synthetic defaults", () => {
  const values: RoutingChannelFormValues = {
    name: "OpenAI",
    vendor: "OpenAI",
    protocol: "OpenAI",
    accessType: "API Key",
    baseUrl: "https://api.openai.com/v1",
    secretRef: "vault://providers/openai/main",
    models: [],
    capabilities: ["llm"],
    weight: 10,
    status: "active",
  };

  assert.throws(
    () => createRoutingChannelInputFromForm(values),
    /console\.routing\.validation\.modelsRequired/,
  );
  assert.throws(
    () => createRoutingChannelUpdateInputFromForm(values),
    /console\.routing\.validation\.modelsRequired/,
  );
});

test("routing channel form rejects unsupported status instead of defaulting active", () => {
  assert.throws(
    () =>
      createRoutingChannelInputFromForm({
        name: "OpenAI",
        vendor: "OpenAI",
        protocol: "OpenAI",
        accessType: "API Key",
        baseUrl: "https://api.openai.com/v1",
        secretRef: "vault://providers/openai/main",
        models: ["gpt-4o"],
        capabilities: ["llm"],
        weight: 10,
        status: "paused",
      }),
    /console\.routing\.validation\.statusUnsupported/,
  );
});

test("routing service calls generated app SDK paths and normalizes routing responses", async () => {
  await withRoutingSdkFetch(
    (url, init) => {
      const method = init?.method ?? "GET";
      if (url === "/app/v3/api/ai/routing/channels" && method === "GET") {
        return {
          items: [
            sampleRoutingChannel({
              timeoutMs: 60000,
              retryPolicy: {
                maxAttempts: 3,
                retryableStatusCodes: [429, 503],
                backoffMs: 25,
              },
              circuitBreakerPolicy: {
                failureThreshold: 4,
              },
            }),
          ],
        };
      }
      if (url === "/app/v3/api/ai/routing/channels" && method === "POST") {
        return {
          item: sampleRoutingChannel({
            id: "4001",
            name: "Created Channel",
            apiKey: "ref:***created",
            timeoutMs: 60000,
            retryPolicy: {
              maxAttempts: 3,
              retryableStatusCodes: [429, 503],
              backoffMs: 25,
            },
            circuitBreakerPolicy: {
              failureThreshold: 4,
            },
            weight: 10,
          }),
        };
      }
      if (url === "/app/v3/api/ai/routing/channels/4001" && method === "PUT") {
        return {
          item: sampleRoutingChannel({
            id: "4001",
            name: "Updated Channel",
            apiKey: "ref:***updated",
            models: ["gpt-4o"],
            timeoutMs: 30000,
            circuitBreakerPolicy: null,
            weight: 20,
          }),
        };
      }
      if (url === "/app/v3/api/ai/routing/channels/4001/status" && method === "PUT") {
        return {
          item: sampleRoutingChannel({
            id: "4001",
            name: "Updated Channel",
            apiKey: "ref:***updated",
            models: ["gpt-4o"],
            timeoutMs: 30000,
            weight: 20,
            status: "disabled",
          }),
        };
      }
      if (url === "/app/v3/api/ai/routing/channels/4001/verify" && method === "POST") {
        return {
          channelId: "4001",
          success: true,
          status: "active",
          latency: "11ms",
          item: sampleRoutingChannel({
            id: "4001",
            name: "Updated Channel",
            apiKey: "ref:***updated",
            models: ["gpt-4o"],
            timeoutMs: 30000,
            weight: 20,
            latency: "11ms",
          }),
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
              traceId: "trace-openai-1",
              requestId: "req-openai-1",
              requestPath: "/v1/chat/completions",
              httpMethod: "POST",
              requestPayloadHash: "sha256:req",
              responsePayloadHash: "sha256:res",
              requestBytes: 512,
              responseBytes: 4096,
              providerErrorCode: null,
              errorType: null,
              errorMessageMasked: null,
              startedAt: "2026-04-29T12:01:00Z",
              endedAt: "2026-04-29T12:01:00.345Z",
              streaming: true,
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
        timeoutMs: 60000,
        retryPolicy: {
          maxAttempts: 3,
          retryableStatusCodes: [429, 503],
          backoffMs: 25,
        },
        circuitBreakerPolicy: {
          failureThreshold: 4,
        },
        weight: 10,
      });
      const updated = await RoutingService.updateChannel("4001", {
        name: "Updated Channel",
        models: ["gpt-4o"],
        timeoutMs: null,
        retryPolicy: null,
        circuitBreakerPolicy: null,
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
      assert.equal(channels[0].timeoutMs, 60000);
      assert.deepEqual(channels[0].retryPolicy, {
        maxAttempts: 3,
        retryableStatusCodes: [429, 503],
        backoffMs: 25,
      });
      assert.deepEqual(channels[0].circuitBreakerPolicy, { failureThreshold: 4 });
      assert.equal(created.id, "4001");
      assert.deepEqual(created.circuitBreakerPolicy, { failureThreshold: 4 });
      assert.equal(updated.name, "Updated Channel");
      assert.equal(updated.circuitBreakerPolicy, undefined);
      assert.equal(disabled.status, "disabled");
      assert.equal(tested.success, true);
      assert.equal(deleted, true);
      assert.equal(apiKeys[0].status, "enabled");
      assert.equal(traces[0].tokens, 150);
      assert.equal(traces[0].requestPath, "/v1/chat/completions");
      assert.equal(traces[0].requestPayloadHash, "sha256:req");
      assert.equal(traces[0].responsePayloadHash, "sha256:res");
      assert.equal(traces[0].streaming, true);
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
        timeoutMs: 60000,
        retryPolicy: {
          maxAttempts: 3,
          retryableStatusCodes: [429, 503],
          backoffMs: 25,
        },
        circuitBreakerPolicy: {
          failureThreshold: 4,
        },
        weight: 10,
      });
      assert.deepEqual(JSON.parse(captured[2].body), {
        name: "Updated Channel",
        models: ["gpt-4o"],
        timeoutMs: null,
        retryPolicy: null,
        circuitBreakerPolicy: null,
        weight: 20,
      });
      assert.equal(captured.every((request) => request.headers["content-type"] === "application/json"), true);
    },
  );
});

test("routing request trace data view does not render synthetic payload examples", () => {
  const source = readFileSync(
    new URL("./packages/sdkwork-claw-router-console-routing/src/components/RequestDataTab.tsx", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(source, /chatcmpl-123/);
  assert.doesNotMatch(source, /Explain quantum computing in simple terms/);
  assert.doesNotMatch(source, /Rate limit reached for requests/);
  assert.match(source, /requestPayloadHash/);
  assert.match(source, /responsePayloadHash/);
  assert.match(source, /errorMessageMasked/);
});

test("routing request trace data view search and export are wired to loaded app SDK data", () => {
  const source = readFileSync(
    new URL("./packages/sdkwork-claw-router-console-routing/src/components/RequestDataTab.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /const \[search, setSearch\] = useState\(''\)/);
  assert.match(source, /const filteredRequestTraces = requestTraces\.filter/);
  assert.match(source, /value=\{search\}/);
  assert.match(source, /onChange=\{\(event\) => setSearch\(event\.target\.value\)\}/);
  assert.match(source, /const exportLogs = \(\) => \{/);
  assert.match(source, /const blob = new Blob\(\[payload\], \{ type: 'application\/json;charset=utf-8;' \}\)/);
  assert.match(source, /link\.download = `routing-request-traces-\$\{new Date\(\)\.toISOString\(\)\.slice\(0, 10\)\}\.json`/);
  assert.match(source, /onClick=\{exportLogs\}/);
  assert.match(source, /disabled=\{filteredRequestTraces\.length === 0\}/);
});

test("routing usage view does not expose unwired filter controls", () => {
  const source = readFileSync(
    new URL("./packages/sdkwork-claw-router-console-routing/src/components/UsageTab.tsx", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(source, /筛选条件/);
  assert.doesNotMatch(source, /<Filter\b/);
});

test("routing fallback tab does not expose unwired editable global HA controls", () => {
  const source = readFileSync(
    new URL("./packages/sdkwork-claw-router-console-routing/src/components/FallbackTab.tsx", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(source, /<input\b/);
  assert.doesNotMatch(source, /cursor-pointer shadow-inner/);
  assert.match(source, /console\.routing\.components\.fallbacktab\.channelRetryTitle/);
});

test("routing channel modal does not expose unsupported per-channel model mapping controls", () => {
  const source = readFileSync(
    new URL("./packages/sdkwork-claw-router-console-routing/src/components/ChannelsTab.tsx", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(source, /模型映射/);
  assert.doesNotMatch(source, /快捷推荐配置/);
  assert.doesNotMatch(source, /仅示例/);
  assert.doesNotMatch(source, /Sonnet 4\.5/);
  assert.doesNotMatch(source, /modelMode === 'mapping'/);
  assert.doesNotMatch(source, /setMappings|addMapping|updateMapping/);
  assert.match(source, /models: whitelist/);
});

test("routing channel modal empty model state matches the required models contract", () => {
  const source = readFileSync(
    new URL("./packages/sdkwork-claw-router-console-routing/src/components/ChannelsTab.tsx", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(source, /全部放行/);
  assert.match(source, /至少添加一个模型/);
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
        () =>
          RoutingService.createChannel({
            name: "OpenAI",
            vendor: "OpenAI",
            secretRef: "vault://providers/openai/main",
            models: ["gpt-4o"],
            capabilities: ["llm", "unknown"],
          }),
        /Unsupported routing channel capability: unknown/,
      );
      await assert.rejects(
        () => RoutingService.updateChannel("", { name: "Updated" }),
        /channelId is required/,
      );
      await assert.rejects(
        () => RoutingService.setChannelStatus("4001", "error"),
        /Unsupported routing channel command status: error/,
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

test("routing channel test fails closed when app SDK returns unsupported test status", async () => {
  await withRoutingSdkFetch(
    (url, init) => {
      if (url === "/app/v3/api/ai/routing/channels/4001/verify" && init?.method === "POST") {
        return {
          channelId: "4001",
          success: true,
          status: "paused",
          latency: "11ms",
          item: sampleRoutingChannel({
            id: "4001",
            name: "Updated Channel",
            apiKey: "ref:***updated",
            models: ["gpt-4o"],
            weight: 20,
            latency: "11ms",
          }),
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => RoutingService.testChannel("4001"),
        /Unsupported routing channel status: paused/,
      );
    },
  );
});

test("routing channel delete fails closed unless app SDK confirms deletion", async () => {
  for (const response of [{}, { deleted: false }]) {
    await withRoutingSdkFetch(
      (url, init) => {
        if (url === "/app/v3/api/ai/routing/channels/4001" && init?.method === "DELETE") {
          return response;
        }
        throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
      },
      async () => {
        await assert.rejects(
          () => RoutingService.deleteChannel("4001"),
          /Routing channel delete confirmation is required/,
        );
      },
    );
  }
});

test("routing channel list fails closed when app SDK omits stable channel ids", async () => {
  await withRoutingSdkFetch(
    (url, init) => {
      if (url === "/app/v3/api/ai/routing/channels" && (init?.method ?? "GET") === "GET") {
        return {
          items: [
            sampleRoutingChannel({
              id: undefined,
              name: "Missing Id Channel",
            }),
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
            sampleRoutingChannel(),
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

test("routing channel list fails closed when app SDK returns malformed circuit breaker policy", async () => {
  await withRoutingSdkFetch(
    (url, init) => {
      if (url === "/app/v3/api/ai/routing/channels" && (init?.method ?? "GET") === "GET") {
        return {
          items: [
            sampleRoutingChannel({
              circuitBreakerPolicy: {
                failureThreshold: 0,
              },
            }),
          ],
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => RoutingService.fetchChannels(),
        /Routing channel circuitBreakerPolicy.failureThreshold must be between 1 and 100/,
      );
    },
  );
});

test("routing channel list fails closed when app SDK returns non-object circuit breaker policy", async () => {
  await withRoutingSdkFetch(
    (url, init) => {
      if (url === "/app/v3/api/ai/routing/channels" && (init?.method ?? "GET") === "GET") {
        return {
          items: [
            sampleRoutingChannel({
              circuitBreakerPolicy: "malformed-circuit-breaker-policy",
            }),
          ],
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => RoutingService.fetchChannels(),
        /Routing channel circuitBreakerPolicy must be an object/,
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
            sampleRoutingChannel({
              capabilities: ["llm"],
              models: undefined,
            }),
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

test("routing channel list fails closed when app SDK omits required channel weight", async () => {
  await withRoutingSdkFetch(
    (url, init) => {
      if (url === "/app/v3/api/ai/routing/channels" && (init?.method ?? "GET") === "GET") {
        return {
          items: [
            sampleRoutingChannel({ weight: undefined }),
          ],
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => RoutingService.fetchChannels(),
        /Routing channel weight is required/,
      );
    },
  );
});

test("routing channel list fails closed when app SDK returns fractional channel metrics", async () => {
  await withRoutingSdkFetch(
    (url, init) => {
      if (url === "/app/v3/api/ai/routing/channels" && (init?.method ?? "GET") === "GET") {
        return {
          items: [
            sampleRoutingChannel({ timeoutMs: 1.5 }),
          ],
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => RoutingService.fetchChannels(),
        /timeoutMs must be an integer between 1 and 600000/,
      );
    },
  );
});

test("routing channel list fails closed when app SDK returns unsupported channel status", async () => {
  await withRoutingSdkFetch(
    (url, init) => {
      if (url === "/app/v3/api/ai/routing/channels" && (init?.method ?? "GET") === "GET") {
        return {
          items: [
            sampleRoutingChannel({ status: "paused" }),
          ],
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => RoutingService.fetchChannels(),
        /Unsupported routing channel status: paused/,
      );
    },
  );
});

test("routing channel list fails closed when app SDK omits required operational fields", async () => {
  const baseChannel = {
    ...sampleRoutingChannel(),
  };

  for (const [field, message] of [
    ["provider", /Routing channel provider is required/],
    ["protocol", /Routing channel protocol is required/],
    ["accessType", /Routing channel access type is required/],
    ["baseUrl", /Routing channel base URL is required/],
    ["isMultimodal", /Routing channel multimodal flag is required/],
    ["latency", /Routing channel latency is required/],
    ["rpm", /Routing channel rpm is required/],
    ["balance", /Routing channel balance is required/],
    ["errors", /Routing channel errors are required/],
  ] as const) {
    await withRoutingSdkFetch(
      (url, init) => {
        if (url === "/app/v3/api/ai/routing/channels" && (init?.method ?? "GET") === "GET") {
          const channel = { ...baseChannel };
          delete channel[field];
          return { items: [channel] };
        }
        throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
      },
      async () => {
        await assert.rejects(
          () => RoutingService.fetchChannels(),
          message,
        );
      },
    );
  }
});

test("routing channel test fails closed when app SDK omits required test metadata", async () => {
  const baseItem = sampleRoutingChannel({
    id: "4001",
    name: "Updated Channel",
    apiKey: "ref:***updated",
    models: ["gpt-4o"],
    weight: 20,
    latency: "11ms",
    rpm: 10,
    balance: "$1",
  });

  for (const [field, message] of [
    ["channelId", /Routing channel test channel id is required/],
    ["latency", /Routing channel test latency is required/],
  ] as const) {
    await withRoutingSdkFetch(
      (url, init) => {
        if (url === "/app/v3/api/ai/routing/channels/4001/verify" && init?.method === "POST") {
          const response = {
            channelId: "4001",
            success: true,
            status: "active",
            latency: "11ms",
            item: baseItem,
          } as Record<string, unknown>;
          delete response[field];
          return response;
        }
        throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
      },
      async () => {
        await assert.rejects(
          () => RoutingService.testChannel("4001"),
          message,
        );
      },
    );
  }
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

test("routing API key list treats masked API key values as display-only", async () => {
  await withRoutingSdkFetch(
    (url, init) => {
      if (url === "/app/v3/api/ai/routing/api_keys" && (init?.method ?? "GET") === "GET") {
        return {
          items: [
            {
              id: "100",
              name: "Owner Key",
              key_display_masked: "sk-owner********ABCD",
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
      const result = await RoutingService.fetchApiKeys();

      assert.equal(result[0].displayKey, "sk-owner********ABCD");
      assert.equal(result[0].copyableKey, null);
    },
  );
});

test("routing API key list falls back to id label instead of prefix when name is missing", async () => {
  await withRoutingSdkFetch(
    (url, init) => {
      if (url === "/app/v3/api/ai/routing/api_keys" && (init?.method ?? "GET") === "GET") {
        return {
          items: [
            {
              id: "100",
              name: "",
              keyPrefix: "sk-owner",
              key_display_masked: "sk-owner********ABCD",
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
      const result = await RoutingService.fetchApiKeys();

      assert.equal(result[0].name, "API Key #100");
      assert.notEqual(result[0].name, "sk-owner");
    },
  );
});

test("routing API key list exposes copyableKey only when app SDK returns plaintext owner key", async () => {
  await withRoutingSdkFetch(
    (url, init) => {
      if (url === "/app/v3/api/ai/routing/api_keys" && (init?.method ?? "GET") === "GET") {
        return {
          items: [
            {
              id: "100",
              name: "Owner Key",
              displayKey: "sk-owner********ABCD",
              copyableKey: "sk-owner-secret",
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
      const result = await RoutingService.fetchApiKeys();

      assert.equal(result[0].displayKey, "sk-owner********ABCD");
      assert.equal(result[0].copyableKey, "sk-owner-secret");
    },
  );
});

test("routing API key table never copies masked key material", async () => {
  const source = await import("node:fs/promises").then((fs) =>
    fs.readFile(new URL("./packages/sdkwork-claw-router-console-routing/src/components/ApiKeysTab.tsx", import.meta.url), "utf8"),
  );

  assert.doesNotMatch(source, /text=\{k\.key\}/);
  assert.match(source, /k\.copyableKey/);
  assert.match(source, /text=\{k\.copyableKey\}/);
});

test("routing API key list fails closed when app SDK returns unsupported key status", async () => {
  await withRoutingSdkFetch(
    (url, init) => {
      if (url === "/app/v3/api/ai/routing/api_keys" && (init?.method ?? "GET") === "GET") {
        return {
          items: [
            {
              id: "100",
              name: "Owner Key",
              key: "sk-owner********ABCD",
              status: "revoked",
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
        /Unsupported routing API key status: revoked/,
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

test("routing request traces fail closed when app SDK omits required audit metadata", async () => {
  const baseTrace = {
    id: "trace-1",
    time: "2026-04-29 12:01:00",
    model: "gpt-4o-mini",
    channel: "OpenAI Primary",
    status: 200,
    duration: "345ms",
    tokens: 150,
    traceId: "trace-openai-1",
    requestId: "req-openai-1",
    requestPath: "/v1/chat/completions",
    httpMethod: "POST",
    requestPayloadHash: "sha256:req",
    responsePayloadHash: "sha256:res",
    requestBytes: 512,
    responseBytes: 4096,
    providerErrorCode: null,
    errorType: null,
    errorMessageMasked: null,
    startedAt: "2026-04-29T12:01:00Z",
    endedAt: "2026-04-29T12:01:00.345Z",
    streaming: true,
  } as Record<string, unknown>;

  for (const [field, message] of [
    ["traceId", /Request trace trace id is required/],
    ["requestId", /Request trace request id is required/],
    ["requestPath", /Request trace request path is required/],
    ["httpMethod", /Request trace HTTP method is required/],
    ["requestPayloadHash", /Request trace request payload hash is required/],
    ["responsePayloadHash", /Request trace response payload hash is required/],
    ["requestBytes", /Request trace request bytes are required/],
    ["responseBytes", /Request trace response bytes are required/],
    ["startedAt", /Request trace started time is required/],
    ["endedAt", /Request trace ended time is required/],
    ["streaming", /Request trace streaming flag is required/],
  ] as const) {
    await withRoutingSdkFetch(
      (url, init) => {
        if (url === "/app/v3/api/ai/routing/request_traces" && (init?.method ?? "GET") === "GET") {
          const trace = { ...baseTrace };
          delete trace[field];
          return { items: [trace] };
        }
        throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
      },
      async () => {
        await assert.rejects(
          () => RoutingService.fetchRequestTraces(),
          message,
        );
      },
    );
  }
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

test("routing local sidebar keeps channel account labels compact and single line", () => {
  const source = readFileSync(
    "packages/sdkwork-claw-router-console-routing/src/RoutingView.tsx",
    "utf8",
  );

  assert.match(source, /text=\{t\("console\.routing\.routingview\.text\.184dsbn", "渠道账号"\)\}/);
  assert.doesNotMatch(source, /渠道账号管理\s*\(Channel Accounts\)/);
  assert.match(source, /className="min-w-0 flex-1 truncate whitespace-nowrap text-left"/);
  assert.match(source, /<span className="min-w-0 flex-1 truncate whitespace-nowrap text-left">\{text\}<\/span>/);
});
