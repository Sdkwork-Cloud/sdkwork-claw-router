import assert from "node:assert/strict";
import test from "node:test";

import { clearStoredAppSessionToken } from "./packages/sdkwork-claw-router-commons/src/app-session-token.ts";
import { resetClawRouterSdkClients } from "./packages/sdkwork-claw-router-commons/src/sdk-clients.ts";
import {
  KNOWN_VENDORS as ADMIN_KNOWN_VENDORS,
  ModelService,
  selectPreferredModelVendorId,
} from "./packages/sdkwork-claw-router-admin-model/src/modelService.ts";
import { deriveModelRankingRefreshDiagnostics } from "./packages/sdkwork-claw-router-admin-model/src/modelRankingRefreshDiagnostics.ts";
import {
  createModelInputFromForm,
  createVendorInputFromForm,
  updateModelInputFromForm,
} from "./packages/sdkwork-claw-router-admin-model/src/modelForm.ts";

const KNOWN_VENDORS = [
  { id: "v_openai", name: "OpenAI", desc: "Industry leading LLMs inclusive of GPT-4 and DALL-E." },
  { id: "custom", name: "Custom Provider", desc: "" },
] as const;

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

test("admin model vendor create input does not reuse returned vendor view model", () => {
  const form = new FormData();
  form.set("customName", " Acme AI ");
  form.set("description", " Enterprise gateway ");

  const input = createVendorInputFromForm(form, "custom", KNOWN_VENDORS, " Enterprise gateway ");

  assert.deepEqual(input, {
    name: "Acme AI",
    status: "active",
    color: "bg-indigo-500",
    description: "Enterprise gateway",
  });
  assert.equal("id" in input!, false);
});

test("admin model vendor create input resolves known vendor selection", () => {
  const input = createVendorInputFromForm(new FormData(), "v_openai", KNOWN_VENDORS, "");

  assert.deepEqual(input, {
    name: "OpenAI",
    status: "active",
    color: "bg-indigo-500",
    description: "Industry leading LLMs inclusive of GPT-4 and DALL-E.",
  });
});

test("admin model known vendor shortcuts only contain model publishers", () => {
  const ids = ADMIN_KNOWN_VENDORS.map((vendor) => vendor.id);
  const names = ADMIN_KNOWN_VENDORS.map((vendor) => vendor.name.toLowerCase());

  for (const providerOnly of ["v_openrouter", "v_ollama"]) {
    assert.equal(ids.includes(providerOnly), false);
  }
  for (const providerOnly of ["openrouter", "ollama", "azure openai", "aws bedrock"]) {
    assert.equal(names.includes(providerOnly), false);
  }
});

test("admin model vendor selection uses persisted vendor ids instead of shortcut ids", () => {
  const vendors = [
    {
      id: "model-vendor-openai",
      name: "OpenAI",
      status: "active",
      color: "bg-indigo-500",
      description: "Official OpenAI model vendor",
    },
    {
      id: "model-vendor-anthropic",
      name: "Anthropic",
      status: "active",
      color: "bg-orange-500",
      description: "Official Anthropic model vendor",
    },
  ] as const;

  assert.equal(selectPreferredModelVendorId(vendors, "v_openai"), "model-vendor-openai");
  assert.equal(selectPreferredModelVendorId(vendors, "model-vendor-anthropic"), "model-vendor-anthropic");
  assert.equal(selectPreferredModelVendorId([], "v_openai"), "");
});

test("admin ai model create input does not reuse returned model view model", () => {
  const form = new FormData();
  form.set("name", " gpt-4o-mini ");
  form.set("type", "Chat");
  form.set("priceIn", " 0.1500 ");
  form.set("priceOut", " 0.6000 ");
  form.set("contextTokens", " ");

  const input = createModelInputFromForm(form, "v_openai");

  assert.deepEqual(input, {
    vendorId: "v_openai",
    name: "gpt-4o-mini",
    type: "Chat",
    priceIn: "0.1500",
    priceOut: "0.6000",
    contextTokens: "8k",
  });
  for (const field of ["id", "calls", "status"]) {
    assert.equal(field in input, false);
  }
});

test("admin ai model update input preserves current type marker for partial updates", () => {
  const form = new FormData();
  form.set("name", " gpt-4o-mini ");
  form.set("type", "Chat");
  form.set("priceIn", " 0.2000 ");
  form.set("priceOut", " 0.8000 ");
  form.set("contextTokens", "128k");

  const input = updateModelInputFromForm(form, "v_openai", {
    id: "model-1",
    vendorId: "v_openai",
    name: "gpt-4o-mini",
    type: "Chat",
    priceIn: "0.1500",
    priceOut: "0.6000",
    status: "inactive",
    calls: "42",
    description: null,
    modalities: ["text"],
    inputModalities: ["text", "image"],
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
  });

  assert.deepEqual(input, {
    vendorId: "v_openai",
    name: "gpt-4o-mini",
    type: "Chat",
    priceIn: "0.2000",
    priceOut: "0.8000",
    contextTokens: "128k",
    currentType: "Chat",
  });
});

test("admin model service calls generated backend SDK paths and normalizes model catalog data", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      const method = init?.method ?? "GET";
      if (url === "/backend/v3/api/router/model-vendors" && method === "GET") {
        return {
          items: [
            {
              id: "vendor-1",
              name: "OpenAI",
              status: "inactive",
              color: "bg-green-600",
              description: "Public models",
            },
          ],
        };
      }
      if (url === "/backend/v3/api/model/list" && method === "POST") {
        return {
          items: [
            {
              id: "model-1",
              vendorId: "vendor-1",
              name: "gpt-4o-mini",
              type: "Image",
              priceIn: "0.1500",
              priceOut: "0.6000",
              status: "inactive",
              calls: "42",
              contextTokens: 128000,
              modalities: ["image"],
              inputModalities: ["text", "image"],
              outputModalities: ["image"],
              apiFormat: "openai_compatible",
              supportsStreaming: false,
              supportsTools: false,
              supportsJsonSchema: false,
            },
          ],
        };
      }
      if (url === "/backend/v3/api/router/model-rankings?limit=200" && method === "GET") {
        return {
          items: [
            {
              id: "rank-1",
              name: "gpt-4o-mini",
              requests: 1_234_567,
              baseVolume: 42,
            },
          ],
        };
      }
      if (url === "/backend/v3/api/router/models/sync" && method === "POST") {
        return {
          synced: true,
          source: "sdkwork_models",
          mode: "official_refresh",
          dryRun: false,
          catalogVersion: "2026.05.08.1",
          requestedCatalogVersion: "2026.05.08.1",
          catalogRoot: null,
          vendorCodes: ["anthropic"],
          sourceHash: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
          meterCount: 20,
          vendorCount: 1,
          familyCount: 1,
          modelCount: 1,
          capabilityCount: 1,
          priceCount: 3,
          rankingCount: 1,
          acceptedCount: 28,
          snapshotId: "snapshot-1",
          syncRunId: "sync-run-1",
          vendors: [
            {
              id: "vendor-2",
              name: "Anthropic",
              status: "active",
              color: "bg-orange-500",
              description: "Claude",
            },
          ],
          models: [
            {
              id: "model-2",
              vendorId: "vendor-2",
              name: "claude-3-5-sonnet",
              type: "Chat",
              priceIn: "3",
              priceOut: "15",
              status: "active",
              calls: "7",
              contextTokens: 200000,
              modalities: ["text"],
              inputModalities: ["text", "image"],
              outputModalities: ["text"],
              apiFormat: "openai_responses",
              supportsStreaming: true,
              supportsTools: true,
              supportsJsonSchema: true,
            },
          ],
        };
      }
      if (url === "/backend/v3/api/router/model-vendors" && method === "POST") {
        return {
          item: {
            id: "vendor-3",
            name: "Custom AI",
            status: "active",
            color: "bg-indigo-500",
            description: "Custom endpoint",
          },
        };
      }
      if (url === "/backend/v3/api/model" && method === "POST") {
        return {
          item: {
            id: "model-3",
            vendorId: "vendor-3",
            name: "custom/model-v1",
            type: "Embedding",
            priceIn: "0.01",
            priceOut: "0.02",
            status: "active",
            calls: "0",
            contextTokens: 32000,
            modalities: ["embedding"],
            inputModalities: ["text"],
            outputModalities: ["embedding"],
            apiFormat: "openai_compatible",
            supportsStreaming: false,
            supportsTools: false,
            supportsJsonSchema: false,
          },
        };
      }
      if (url === "/backend/v3/api/model/model-3" && method === "PATCH") {
        return {
          item: {
            id: "model-3",
            vendorId: "vendor-3",
            name: "custom/model-v2",
            type: "Embedding",
            priceIn: "0.03",
            priceOut: "0.04",
            status: "active",
            calls: "0",
            contextTokens: 64000,
            modalities: ["embedding"],
            inputModalities: ["text"],
            outputModalities: ["embedding"],
            apiFormat: "openai_compatible",
            supportsStreaming: false,
            supportsTools: false,
            supportsJsonSchema: false,
          },
        };
      }
      if (url === "/backend/v3/api/model/model-3" && method === "DELETE") {
        return { deleted: true };
      }
      throw new Error(`Unexpected SDK request ${method} ${url}`);
    },
    async (captured) => {
      const vendors = await ModelService.fetchVendors();
      const models = await ModelService.fetchModels();
      const synced = await ModelService.syncVendorsAndModels();
      const vendor = await ModelService.addVendor({
        name: " Custom AI ",
        status: "active",
        color: "bg-indigo-500",
        description: " Custom endpoint ",
      });
      const model = await ModelService.addModel({
        vendorId: "vendor-3",
        name: "custom/model-v1",
        type: "Embedding",
        priceIn: "0.01",
        priceOut: "0.02",
        contextTokens: "32k",
      });
      const updated = await ModelService.updateModel("model-3", {
        vendorId: "vendor-3",
        name: "custom/model-v2",
        type: "Embedding",
        currentType: "Embedding",
        priceIn: "0.03",
        priceOut: "0.04",
        contextTokens: "64k",
      });
      const deleted = await ModelService.deleteModel("model-3");

      assert.equal(vendors[0].status, "inactive");
      assert.equal(models[0].type, "Image");
      assert.equal(models[0].contextTokens, 128000);
      assert.equal(models[0].calls, "1.2M");
      assert.deepEqual(models[0].inputModalities, ["text", "image"]);
      assert.equal(synced.synced, true);
      assert.equal(synced.source, "sdkwork_models");
      assert.equal(synced.mode, "official_refresh");
      assert.equal(synced.dryRun, false);
      assert.equal(synced.catalogVersion, "2026.05.08.1");
      assert.equal(synced.requestedCatalogVersion, "2026.05.08.1");
      assert.equal(synced.catalogRoot, null);
      assert.deepEqual(synced.vendorCodes, ["anthropic"]);
      assert.equal(
        synced.sourceHash,
        "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
      );
      assert.equal(synced.meterCount, 20);
      assert.equal(synced.vendorCount, 1);
      assert.equal(synced.familyCount, 1);
      assert.equal(synced.modelCount, 1);
      assert.equal(synced.capabilityCount, 1);
      assert.equal(synced.priceCount, 3);
      assert.equal(synced.rankingCount, 1);
      assert.equal(synced.acceptedCount, 28);
      assert.equal(synced.snapshotId, "snapshot-1");
      assert.equal(synced.syncRunId, "sync-run-1");
      assert.equal(synced.vendors[0].name, "Anthropic");
      assert.equal(synced.models[0].contextTokens, 200000);
      assert.equal(vendor.id, "vendor-3");
      assert.equal(model.type, "Embedding");
      assert.equal(updated.name, "custom/model-v2");
      assert.equal(deleted, true);
      assert.deepEqual(
        captured.map((request) => `${request.method} ${request.url}`),
        [
          "GET /backend/v3/api/router/model-vendors",
          "POST /backend/v3/api/model/list",
          "GET /backend/v3/api/router/model-rankings?limit=200",
          "POST /backend/v3/api/router/models/sync",
          "POST /backend/v3/api/router/model-vendors",
          "POST /backend/v3/api/model",
          "PATCH /backend/v3/api/model/model-3",
          "DELETE /backend/v3/api/model/model-3",
        ],
      );
      assert.deepEqual(JSON.parse(captured[4].body), {
        name: "Custom AI",
        status: "active",
        color: "bg-indigo-500",
        description: "Custom endpoint",
      });
      assert.deepEqual(JSON.parse(captured[5].body), {
        vendorId: "vendor-3",
        name: "custom/model-v1",
        type: "Embedding",
        priceIn: "0.01",
        priceOut: "0.02",
        contextTokens: "32k",
        modalities: ["embedding"],
        inputModalities: ["text"],
        outputModalities: ["embedding"],
        apiFormat: "openai_compatible",
        supportsStreaming: false,
        supportsTools: false,
        supportsJsonSchema: false,
        releaseStage: 1,
        shelfState: 1,
        routingState: 1,
      });
      assert.deepEqual(JSON.parse(captured[6].body), {
        vendorId: "vendor-3",
        name: "custom/model-v2",
        priceIn: "0.03",
        priceOut: "0.04",
        contextTokens: "64k",
      });
      assert.equal(captured[3].headers["x-request-id"]?.startsWith("admin-model-catalog-sync-"), true);
      assert.equal(captured[4].headers["x-request-id"]?.startsWith("admin-model-vendor-create-"), true);
      assert.equal(captured[5].headers["x-request-id"]?.startsWith("admin-ai-model-create-"), true);
      assert.equal(captured[6].headers["x-request-id"]?.startsWith("admin-ai-model-update-"), true);
    },
  );
});

test("admin model service reads model ranking refresh status through generated backend SDK", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      if (url === "/backend/v3/api/router/model-rankings/status" && (init?.method ?? "GET") === "GET") {
        return {
          status: "ready",
          tenantId: 10,
          organizationId: 20,
          rankScope: "commercial-default",
          snapshotDate: "2026-05-08",
          snapshotPeriod: "daily",
          windowStart: "2026-05-07T00:00:00Z",
          windowEnd: "2026-05-08T00:00:00Z",
          generatedAt: "2026-05-08T00:05:00Z",
          refreshIntervalSeconds: 3600,
          nextRefreshAt: "2026-05-08T01:05:00Z",
          cacheMaxAgeSeconds: 60,
          generatedCount: 2,
          sourceCount: 10,
          sourceTables: ["ai_usage_fact", "ai_model", "ai_model_rank_snapshot"],
          latestJob: {
            id: "job-failed",
            jobName: "model_ranking_refresh",
            status: "failed",
            tenantId: 10,
            organizationId: 20,
            rankScope: "commercial-default",
            snapshotDate: "2026-05-08",
            snapshotPeriod: "daily",
            windowStart: "2026-05-08T00:00:00Z",
            windowEnd: "2026-05-09T00:00:00Z",
            startedAt: "2026-05-08T01:00:00Z",
            endedAt: "2026-05-08T01:00:01Z",
            durationMs: 1000,
            generatedCount: 0,
            sourceCount: 0,
            successCount: 0,
            failureCount: 1,
            nextRefreshAt: "2026-05-08T02:00:00Z",
            failureReason: "usage aggregate failed",
          },
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async (captured) => {
      const status = await ModelService.fetchModelRankingRefreshStatus();

      assert.equal(status.status, "ready");
      assert.equal(status.rankScope, "commercial-default");
      assert.equal(status.snapshotDate, "2026-05-08");
      assert.equal(status.generatedCount, 2);
      assert.equal(status.sourceCount, 10);
      assert.deepEqual(status.sourceTables, ["ai_usage_fact", "ai_model", "ai_model_rank_snapshot"]);
      assert.equal(status.latestJob?.id, "job-failed");
      assert.equal(status.latestJob?.status, "failed");
      assert.equal(status.latestJob?.failureReason, "usage aggregate failed");
      assert.deepEqual(
        captured.map((request) => `${request.method} ${request.url}`),
        ["GET /backend/v3/api/router/model-rankings/status"],
      );
    },
  );
});

test("admin model ranking refresh status rejects fractional counters", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      if (url === "/backend/v3/api/router/model-rankings/status" && (init?.method ?? "GET") === "GET") {
        return {
          status: "ready",
          tenantId: 10,
          organizationId: 20,
          rankScope: "commercial-default",
          snapshotDate: "2026-05-08",
          snapshotPeriod: "daily",
          windowStart: "2026-05-01T00:00:00.000Z",
          windowEnd: "2026-05-08T00:00:00.000Z",
          generatedAt: "2026-05-08T08:00:00.000Z",
          refreshIntervalSeconds: 3600,
          nextRefreshAt: "2026-05-08T09:00:00.000Z",
          cacheMaxAgeSeconds: 60,
          generatedCount: 2.5,
          sourceCount: 10,
          sourceTables: ["ai_usage_fact", "ai_model_rank_snapshot"],
          latestJob: null,
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => ModelService.fetchModelRankingRefreshStatus(),
        /Model ranking refresh status generated count must be a non-negative integer/,
      );
    },
  );
});

test("admin model service reads model ranking refresh job history through generated backend SDK", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      if (url === "/backend/v3/api/router/model-rankings/jobs?limit=20" && (init?.method ?? "GET") === "GET") {
        return {
          items: [
            {
              id: "job-failed",
              jobName: "model_ranking_refresh",
              status: "failed",
              tenantId: 10,
              organizationId: 20,
              rankScope: "commercial-default",
              snapshotDate: "2026-05-08",
              snapshotPeriod: "daily",
              windowStart: "2026-05-07T00:00:00Z",
              windowEnd: "2026-05-08T00:00:00Z",
              startedAt: "2026-05-08T01:00:00Z",
              endedAt: "2026-05-08T01:00:01Z",
              durationMs: 1000,
              generatedCount: 0,
              sourceCount: 0,
              successCount: 0,
              failureCount: 1,
              nextRefreshAt: "2026-05-08T02:00:00Z",
              failureReason: "usage aggregate failed",
            },
          ],
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async (captured) => {
      const page = await ModelService.fetchModelRankingRefreshJobs();

      assert.equal(page.items.length, 1);
      assert.equal(page.items[0].id, "job-failed");
      assert.equal(page.items[0].status, "failed");
      assert.equal(page.items[0].rankScope, "commercial-default");
      assert.equal(page.items[0].failureReason, "usage aggregate failed");
      assert.deepEqual(
        captured.map((request) => `${request.method} ${request.url}`),
        ["GET /backend/v3/api/router/model-rankings/jobs?limit=20"],
      );
    },
  );
});

test("admin model service triggers model ranking refresh through generated backend SDK", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      if (url === "/backend/v3/api/router/model-rankings/refresh" && init?.method === "POST") {
        return {
          triggered: true,
          status: "succeeded",
          tenantId: 10,
          organizationId: 20,
          rankScope: "commercial-default",
          snapshotDate: "2026-05-08",
          snapshotPeriod: "daily",
          windowStart: "2026-05-07T00:00:00Z",
          windowEnd: "2026-05-08T00:00:00Z",
          generatedCount: 7,
          sourceCount: 9,
          refreshIntervalSeconds: 3600,
          cacheMaxAgeSeconds: 60,
          nextRefreshAt: "2026-05-08T01:00:00Z",
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async (captured) => {
      const result = await ModelService.triggerModelRankingRefresh();

      assert.equal(result.triggered, true);
      assert.equal(result.status, "succeeded");
      assert.equal(result.rankScope, "commercial-default");
      assert.equal(result.generatedCount, 7);
      assert.deepEqual(
        captured.map((request) => `${request.method} ${request.url}`),
        ["POST /backend/v3/api/router/model-rankings/refresh"],
      );
      assert.deepEqual(JSON.parse(captured[0].body), {
        rankScope: "commercial-default",
        snapshotPeriod: "daily",
        limit: 200,
        lookbackDays: 7,
        refreshIntervalSeconds: 3600,
        cacheMaxAgeSeconds: 60,
      });
      assert.equal(captured[0].headers["x-request-id"]?.startsWith("admin-model-ranking-refresh-"), true);
    },
  );
});

test("admin model ranking refresh diagnostics surface latest failed execution evidence", () => {
  const diagnostics = deriveModelRankingRefreshDiagnostics(
    {
      status: "ready",
      tenantId: 10,
      organizationId: 20,
      rankScope: "commercial-default",
      snapshotDate: "2026-05-08",
      snapshotPeriod: "daily",
      windowStart: "2026-05-07T00:00:00Z",
      windowEnd: "2026-05-08T00:00:00Z",
      generatedAt: "2026-05-08T00:05:00Z",
      refreshIntervalSeconds: 3600,
      nextRefreshAt: "2026-05-08T01:05:00Z",
      cacheMaxAgeSeconds: 60,
      generatedCount: 2,
      sourceCount: 10,
      sourceTables: ["ai_usage_fact", "ai_model", "ai_model_rank_snapshot"],
      latestJob: {
        id: "job-failed",
        jobName: "model_ranking_refresh",
        status: "failed",
        tenantId: 10,
        organizationId: 20,
        rankScope: "commercial-default",
        snapshotDate: "2026-05-08",
        snapshotPeriod: "daily",
        windowStart: "2026-05-07T00:00:00Z",
        windowEnd: "2026-05-08T00:00:00Z",
        startedAt: "2026-05-08T01:00:00Z",
        endedAt: "2026-05-08T01:00:01Z",
        durationMs: 1000,
        generatedCount: 0,
        sourceCount: 0,
        successCount: 0,
        failureCount: 1,
        nextRefreshAt: "2026-05-08T02:00:00Z",
        failureReason: "usage aggregate failed",
      },
    },
  );

  assert.equal(diagnostics.statusLabel, "Ready");
  assert.equal(diagnostics.healthTone, "critical");
  assert.equal(diagnostics.latestJob?.statusLabel, "Failed");
  assert.equal(diagnostics.latestJob?.failureReason, "usage aggregate failed");
  assert.equal(diagnostics.generatedSummary, "2 ranking rows / 10 source rows");
  assert.equal(diagnostics.refreshSchedule, "Every 1h; next 2026-05-08 01:05:00 UTC");
  assert.equal(diagnostics.windowLabel, "2026-05-07 00:00:00 UTC -> 2026-05-08 00:00:00 UTC");
});

test("admin model ranking refresh diagnostics remain useful without job history", () => {
  const diagnostics = deriveModelRankingRefreshDiagnostics(
    {
      status: "empty",
      tenantId: 10,
      organizationId: 20,
      rankScope: "commercial-default",
      snapshotDate: "",
      snapshotPeriod: "daily",
      windowStart: "",
      windowEnd: "",
      generatedAt: "",
      refreshIntervalSeconds: 900,
      nextRefreshAt: "",
      cacheMaxAgeSeconds: 60,
      generatedCount: 0,
      sourceCount: 0,
      sourceTables: ["ai_usage_fact"],
      latestJob: null,
    },
  );

  assert.equal(diagnostics.statusLabel, "Empty");
  assert.equal(diagnostics.healthTone, "warning");
  assert.equal(diagnostics.latestJob, null);
  assert.equal(diagnostics.generatedSummary, "0 ranking rows / 0 source rows");
  assert.equal(diagnostics.refreshSchedule, "Every 15m; next unavailable");
  assert.equal(diagnostics.windowLabel, "Window unavailable");
});

test("admin model list remains usable when model ranking enhancement fails", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      const method = init?.method ?? "GET";
      if (url === "/backend/v3/api/model/list" && method === "POST") {
        return {
          items: [
            {
              id: "model-1",
              vendorId: "vendor-1",
              name: "gpt-4o-mini",
              type: "Chat",
              priceIn: "0.1500",
              priceOut: "0.6000",
              status: "active",
              calls: "42",
              contextTokens: 128000,
              modalities: ["text"],
              inputModalities: ["text"],
              outputModalities: ["text"],
              apiFormat: "openai_responses",
              supportsStreaming: true,
              supportsTools: true,
              supportsJsonSchema: true,
            },
          ],
        };
      }
      if (url === "/backend/v3/api/router/model-rankings?limit=200" && method === "GET") {
        throw new Error("ranking store unavailable");
      }
      throw new Error(`Unexpected SDK request ${method} ${url}`);
    },
    async (captured) => {
      const models = await ModelService.fetchModels();
      const capturedRequests = captured.map((request) => `${request.method} ${request.url}`);

      assert.equal(models.length, 1);
      assert.equal(models[0].name, "gpt-4o-mini");
      assert.equal(models[0].calls, "42");
      assert.equal(capturedRequests[0], "POST /backend/v3/api/model/list");
      assert.equal(capturedRequests.length >= 2, true);
      assert.equal(
        capturedRequests.slice(1).every((request) => request === "GET /backend/v3/api/router/model-rankings?limit=200"),
        true,
      );
    },
  );
});

test("admin model ranking summary rejects fractional request counters", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      const method = init?.method ?? "GET";
      if (url === "/backend/v3/api/router/model-rankings?limit=200" && method === "GET") {
        return {
          items: [
            {
              id: "openai/global/gpt-4o-mini",
              rank: 1,
              prevRank: 1,
              name: "gpt-4o-mini",
              vendor: "OpenAI",
              vendorCode: "openai",
              modality: "LLM",
              baseVolume: 1200,
              requests: 1200.5,
              tokens: 456000,
              cost: 12.34,
              currency: "USD",
              costIndicator: 2,
              latency: 120,
              isNew: false,
              color: "#10b981",
              strengths: ["Fast"],
            },
          ],
        };
      }
      throw new Error(`Unexpected SDK request ${method} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => ModelService.fetchModelRankings(),
        /Admin model ranking requests must be a non-negative integer/,
      );
    },
  );
});

test("admin model list keeps backend calls when ranking summary is malformed", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      const method = init?.method ?? "GET";
      if (url === "/backend/v3/api/model/list" && method === "POST") {
        return {
          items: [
            {
              id: "model-1",
              vendorId: "vendor-1",
              name: "gpt-4o-mini",
              type: "Chat",
              priceIn: "0.1500",
              priceOut: "0.6000",
              status: "active",
              calls: "42",
              contextTokens: 128000,
              modalities: ["text"],
              inputModalities: ["text"],
              outputModalities: ["text"],
              apiFormat: "openai_compatible",
              supportsStreaming: true,
              supportsTools: true,
              supportsJsonSchema: true,
            },
          ],
        };
      }
      if (url === "/backend/v3/api/router/model-rankings?limit=200" && method === "GET") {
        return {
          items: [
            {
              id: "openai/global/gpt-4o-mini",
              rank: 1,
              prevRank: 1,
              name: "gpt-4o-mini",
              vendor: "OpenAI",
              vendorCode: "openai",
              modality: "LLM",
              baseVolume: 1200,
              requests: 1200.5,
              tokens: 456000,
              cost: 12.34,
              currency: "USD",
              costIndicator: 2,
              latency: 120,
              isNew: false,
              color: "#10b981",
              strengths: ["Fast"],
            },
          ],
        };
      }
      throw new Error(`Unexpected SDK request ${method} ${url}`);
    },
    async () => {
      const models = await ModelService.fetchModels();

      assert.equal(models[0].calls, "42");
    },
  );
});

test("admin model service rejects invalid commands before calling generated backend SDK", async () => {
  await withBackendSdkFetch(
    () => {
      throw new Error("backend SDK must not be called for invalid model commands");
    },
    async (captured) => {
      await assert.rejects(
        () =>
          ModelService.addVendor({
            name: "",
            status: "active",
            color: "bg-indigo-500",
            description: "",
          }),
        /name is required/,
      );
      await assert.rejects(
        () =>
          ModelService.addModel({
            vendorId: "vendor-1",
            name: "gpt 4",
            type: "Chat",
            priceIn: "0.1",
            priceOut: "0.2",
            contextTokens: "8k",
          }),
        /name must use ASCII/,
      );
      await assert.rejects(
        () =>
          ModelService.addModel({
            vendorId: "vendor-1",
            name: "gpt-4o-mini",
            type: "Chat",
            priceIn: "0",
            priceOut: "0.2",
            contextTokens: "8k",
          }),
        /priceIn must be greater than zero/,
      );
      await assert.rejects(
        () =>
          ModelService.addModel({
            vendorId: "vendor-1",
            name: "gpt-4o-mini",
            type: "Vision" as never,
            priceIn: "0.1",
            priceOut: "0.2",
            contextTokens: "8k",
          }),
        /Unsupported model type: Vision/,
      );
      assert.equal(captured.length, 0);
    },
  );
});

test("admin model service rejects unsafe SDK path ids before calling generated backend SDK", async () => {
  await withBackendSdkFetch(
    () => {
      throw new Error("backend SDK must not be called for unsafe model path ids");
    },
    async (captured) => {
      await assert.rejects(
        () => ModelService.deleteModel("model/3"),
        /modelId must be a safe path segment/,
      );
      await assert.rejects(
        () =>
          ModelService.updateModel("model/3", {
            vendorId: "vendor-1",
            name: "gpt-4o-mini",
            type: "Chat",
            currentType: "Chat",
            priceIn: "0.1",
            priceOut: "0.2",
            contextTokens: "8k",
          }),
        /modelId must be a safe path segment/,
      );
      assert.equal(captured.length, 0);
    },
  );
});

test("admin model vendor list fails closed when backend omits stable vendor ids", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      if (url === "/backend/v3/api/router/model-vendors" && (init?.method ?? "GET") === "GET") {
        return {
          items: [
            {
              name: "Missing Id Vendor",
              status: "active",
              color: "bg-indigo-500",
              description: "Invalid contract",
            },
          ],
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => ModelService.fetchVendors(),
        /Vendor id is required/,
      );
    },
  );
});

test("admin model vendor list fails closed when backend returns malformed rows", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      if (url === "/backend/v3/api/router/model-vendors" && (init?.method ?? "GET") === "GET") {
        return {
          items: [
            {
              id: "vendor-1",
              name: "OpenAI",
              status: "active",
              color: "bg-indigo-500",
              description: "Valid row",
            },
            "malformed-vendor-row",
          ],
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => ModelService.fetchVendors(),
        /Vendor record is required/,
      );
    },
  );
});

test("admin model list fails closed when backend omits stable model ids", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      if (url === "/backend/v3/api/model/list" && init?.method === "POST") {
        return {
          items: [
            {
              vendorId: "vendor-1",
              name: "gpt-4o-mini",
              type: "Chat",
              priceIn: "0.15",
              priceOut: "0.60",
              status: "active",
              calls: "0",
              contextTokens: 128000,
            },
          ],
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => ModelService.fetchModels(),
        /Model id is required/,
      );
    },
  );
});

test("admin model list fails closed when backend returns malformed rows", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      if (url === "/backend/v3/api/model/list" && init?.method === "POST") {
        return {
          items: [
            {
              id: "model-1",
              vendorId: "vendor-1",
              name: "gpt-4o-mini",
              type: "Chat",
              priceIn: "0.15",
              priceOut: "0.60",
              status: "active",
              calls: "0",
              contextTokens: 128000,
            },
            "malformed-model-row",
          ],
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => ModelService.fetchModels(),
        /Model record is required/,
      );
    },
  );
});

test("admin model list fails closed when backend returns unsupported model types", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      if (url === "/backend/v3/api/model/list" && init?.method === "POST") {
        return {
          items: [
            {
              id: "model-1",
              vendorId: "vendor-1",
              name: "gpt-4o-mini",
              type: "Vision",
              priceIn: "0.15",
              priceOut: "0.60",
              status: "active",
              calls: "0",
              contextTokens: 128000,
            },
          ],
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => ModelService.fetchModels(),
        /Unsupported model type: Vision/,
      );
    },
  );
});

test("admin model catalog sync fails closed when backend returns malformed model rows", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      if (url === "/backend/v3/api/router/models/sync" && init?.method === "POST") {
        return {
          synced: true,
          source: "sdkwork_models",
          mode: "official_refresh",
          dryRun: false,
          catalogVersion: "2026.05.08.1",
          requestedCatalogVersion: null,
          catalogRoot: null,
          vendorCodes: ["openai"],
          sourceHash: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
          meterCount: 20,
          vendorCount: 1,
          familyCount: 1,
          modelCount: 1,
          capabilityCount: 1,
          priceCount: 3,
          rankingCount: 1,
          acceptedCount: 28,
          vendors: [
            {
              id: "vendor-1",
              name: "OpenAI",
              status: "active",
              color: "bg-indigo-500",
              description: "Valid row",
            },
          ],
          models: ["malformed-model-row"],
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => ModelService.syncVendorsAndModels(),
        /Model record is required/,
      );
    },
  );
});

test("admin model catalog sync fails closed when governance metadata is missing", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      if (url === "/backend/v3/api/router/models/sync" && init?.method === "POST") {
        return {
          synced: true,
          source: "sdkwork_models",
          dryRun: false,
          catalogVersion: "2026.05.08.1",
          vendorCodes: ["openai"],
          sourceHash: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
          meterCount: 20,
          vendorCount: 1,
          familyCount: 1,
          modelCount: 1,
          capabilityCount: 1,
          priceCount: 3,
          rankingCount: 1,
          acceptedCount: 28,
          vendors: [],
          models: [],
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => ModelService.syncVendorsAndModels(),
        /Model catalog sync response is missing mode/,
      );
    },
  );
});

test("admin model catalog sync rejects fractional fact counters", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      if (url === "/backend/v3/api/router/models/sync" && init?.method === "POST") {
        return {
          synced: true,
          source: "sdkwork_models",
          mode: "official_refresh",
          dryRun: false,
          catalogVersion: "2026.05.08.1",
          requestedCatalogVersion: null,
          catalogRoot: null,
          vendorCodes: ["openai"],
          sourceHash: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
          meterCount: 20.5,
          vendorCount: 1,
          familyCount: 1,
          modelCount: 1,
          capabilityCount: 1,
          priceCount: 3,
          rankingCount: 1,
          acceptedCount: 28,
          vendors: [],
          models: [],
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => ModelService.syncVendorsAndModels(),
        /Model catalog sync response meter count must be a non-negative integer/,
      );
    },
  );
});
