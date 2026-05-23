import { describe, expect, it } from "vitest";
import type { SdkworkModelCatalogItem } from "@sdkwork/models-pc-react";
import {
  createLlmProviderRouteCatalog,
  createLlmExecutionDetailRouteIntent,
  createLlmPlaygroundRouteIntent,
  createLlmWorkspaceManifest,
  evaluateLlmExecutionReadiness,
  reduceLlmStreamEvents,
  resolveLlmExecutionPlan,
  selectLlmProviderRoute,
  summarizeLlmProviderRouteCatalog,
  summarizeLlmExecutionTelemetry,
} from "../src";

const models: SdkworkModelCatalogItem[] = [
  {
    accessTier: "pro",
    capabilities: ["reasoning", "structured-output", "tool-calling", "vision"],
    contextWindowTokens: 400_000,
    id: "gpt-5.4",
    modalities: ["image", "text"],
    name: "GPT-5.4",
    pricing: {
      inputPerMillionUsd: 2.5,
      outputPerMillionUsd: 10,
      tier: "paid",
    },
    providerId: "openai",
    purchaseMode: "purchase-required",
    status: "available",
  },
  {
    accessTier: "standard",
    capabilities: ["code", "reasoning", "tool-calling"],
    contextWindowTokens: 200_000,
    id: "claude-sonnet-4.5",
    modalities: ["text"],
    name: "Claude Sonnet 4.5",
    pricing: {
      inputPerMillionUsd: 1.4,
      outputPerMillionUsd: 7,
      tier: "paid",
    },
    providerId: "anthropic",
    purchaseMode: "included",
    status: "available",
  },
];

const routes = [
  {
    allowedModelIds: ["gpt-5.4", "o4-mini"],
    averageLatencyMs: 920,
    enabled: true,
    health: "healthy",
    id: "openai-primary",
    isDefault: true,
    label: "OpenAI Primary",
    priority: 90,
    protocol: "openai-responses",
    providerId: "openai",
    supportsReasoning: true,
    supportsStreaming: true,
    supportsStructuredOutput: true,
    supportsToolCalling: true,
    supportsVision: true,
  },
  {
    allowedModelIds: ["gpt-5.4", "gpt-4.1-mini"],
    averageLatencyMs: 120,
    enabled: true,
    health: "healthy",
    id: "local-fallback",
    label: "Local Fallback",
    priority: 40,
    protocol: "openai-chat-completions",
    providerId: "openai",
    supportsReasoning: false,
    supportsStreaming: false,
    supportsStructuredOutput: false,
    supportsToolCalling: true,
    supportsVision: false,
  },
  {
    allowedModelIds: ["claude-sonnet-4.5"],
    averageLatencyMs: 600,
    enabled: true,
    health: "healthy",
    id: "anthropic-primary",
    isDefault: true,
    label: "Anthropic Primary",
    priority: 80,
    protocol: "anthropic-messages",
    providerId: "anthropic",
    supportsReasoning: true,
    supportsStreaming: true,
    supportsStructuredOutput: false,
    supportsToolCalling: true,
    supportsVision: false,
  },
] as const;

describe("sdkwork-llm-pc-react", () => {
  it("creates route catalogs and summarizes provider coverage for diagnostics surfaces", () => {
    const catalog = createLlmProviderRouteCatalog(
      [
        routes[1],
        {
          allowedModelIds: undefined,
          averageLatencyMs: 2_200,
          enabled: true,
          health: "offline",
          id: "openai-disaster-recovery",
          label: "OpenAI Disaster Recovery",
          priority: 5,
          protocol: "openai-chat-completions",
          providerId: "openai",
          supportsReasoning: false,
          supportsStreaming: false,
          supportsStructuredOutput: false,
          supportsToolCalling: false,
          supportsVision: false,
        },
        routes[2],
        routes[0],
      ],
      { models },
    );

    expect(catalog.map((route) => route.id)).toEqual([
      "openai-primary",
      "anthropic-primary",
      "local-fallback",
      "openai-disaster-recovery",
    ]);
    expect(catalog[0]).toMatchObject({
      id: "openai-primary",
      modelCoverage: "specific-models",
      modelCount: 1,
      modelIds: ["gpt-5.4"],
      supports: {
        reasoning: true,
        streaming: true,
        structuredOutput: true,
        toolCalling: true,
        vision: true,
      },
    });
    expect(catalog[3]).toMatchObject({
      id: "openai-disaster-recovery",
      modelCoverage: "provider-models",
      modelCount: 1,
      modelIds: ["gpt-5.4"],
    });

    expect(summarizeLlmProviderRouteCatalog(catalog)).toEqual({
      defaultRouteIds: ["openai-primary", "anthropic-primary"],
      degradedRoutes: 0,
      enabledRoutes: 4,
      healthyRoutes: 3,
      modelCoverageCount: 2,
      offlineRoutes: 1,
      providerCount: 2,
      reasoningRoutes: 2,
      routeCount: 4,
      streamingRoutes: 2,
      structuredOutputRoutes: 1,
      toolCallingRoutes: 3,
      visionRoutes: 1,
    });
  });

  it("evaluates execution readiness and reports degraded feature coverage without throwing", () => {
    expect(
      evaluateLlmExecutionReadiness([routes[1]], {
        maxOutputTokens: 3_200,
        messages: [
          {
            parts: [{ text: "You are a precise assistant.", type: "text" }],
            role: "system",
          },
          {
            parts: [
              { text: "Describe the image and answer in JSON.", type: "text" },
              { mimeType: "image/png", type: "image", url: "https://example.com/cat.png" },
            ],
            role: "user",
          },
        ],
        mode: "stream",
        model: models[0],
        outputFormat: "json-schema",
        reasoningEffort: "deep",
        tools: [{ id: "web-search", name: "web_search", type: "function" }],
      }),
    ).toMatchObject({
      candidateRouteIds: ["local-fallback"],
      degraded: true,
      issues: [
        "streaming-degraded",
        "structured-output-degraded",
        "reasoning-degraded",
        "vision-degraded",
      ],
      plan: {
        mode: "sync",
        outputFormat: "text",
        providerId: "openai",
        routeId: "local-fallback",
        warnings: [
          "streaming-not-supported",
          "structured-output-not-supported",
          "reasoning-not-supported",
          "vision-not-supported",
        ],
      },
      ready: true,
      route: {
        id: "local-fallback",
      },
    });
  });

  it("returns a stable no-route readiness result when no viable route can serve the model", () => {
    expect(
      evaluateLlmExecutionReadiness([routes[2]], {
        messages: [
          {
            parts: [{ text: "Summarize the release notes.", type: "text" }],
            role: "user",
          },
        ],
        model: models[0],
      }),
    ).toEqual({
      candidateRouteIds: [],
      degraded: false,
      issues: ["no-route"],
      ready: false,
    });
  });

  it("selects the best provider route for the requested model and execution needs", () => {
    expect(
      selectLlmProviderRoute(routes, {
        mode: "stream",
        model: models[0],
        requiresReasoning: true,
        requiresStructuredOutput: true,
        requiresToolCalling: true,
        requiresVision: true,
      }),
    ).toEqual(routes[0]);
  });

  it("normalizes an execution plan and records explicit fallback warnings", () => {
    expect(
      resolveLlmExecutionPlan(routes[1], {
        maxOutputTokens: 3_200,
        messages: [
          {
            parts: [{ text: "You are a precise assistant.", type: "text" }],
            role: "system",
          },
          {
            parts: [
              { text: "Describe the image and answer in JSON.", type: "text" },
              { mimeType: "image/png", type: "image", url: "https://example.com/cat.png" },
            ],
            role: "user",
          },
        ],
        mode: "stream",
        model: models[0],
        outputFormat: "json-schema",
        reasoningEffort: "deep",
        tools: [{ id: "web-search", name: "web_search", type: "function" }],
      }),
    ).toEqual({
      features: {
        reasoning: false,
        streaming: false,
        structuredOutput: false,
        toolCalling: true,
        vision: false,
      },
      mode: "sync",
      modelId: "gpt-5.4",
      outputFormat: "text",
      promptSummary: {
        attachmentCount: 1,
        inputTokenBudget: 396_800,
        messageCount: 2,
        toolCount: 1,
      },
      providerId: "openai",
      protocol: "openai-chat-completions",
      reasoningEffort: "none",
      routeId: "local-fallback",
      warnings: [
        "streaming-not-supported",
        "structured-output-not-supported",
        "reasoning-not-supported",
        "vision-not-supported",
      ],
    });
  });

  it("reduces provider-neutral stream events into a stable execution summary", () => {
    expect(
      reduceLlmStreamEvents([
        {
          modelId: "gpt-5.4",
          requestId: "req-1",
          routeId: "openai-primary",
          startedAt: 1_000,
          type: "start",
        },
        {
          at: 1_200,
          delta: "Hello",
          type: "text-delta",
        },
        {
          at: 1_500,
          delta: "thinking...",
          type: "reasoning-delta",
        },
        {
          argumentsText: "{\"q\":\"hello\"}",
          at: 1_700,
          name: "web_search",
          toolCallId: "tool-1",
          type: "tool-call",
        },
        {
          at: 1_900,
          delta: ", world",
          type: "text-delta",
        },
        {
          at: 2_100,
          inputTokens: 128,
          outputTokens: 64,
          totalTokens: 192,
          type: "usage",
        },
        {
          at: 2_500,
          finishReason: "completed",
          type: "finish",
        },
      ]),
    ).toEqual({
      completedAt: 2_500,
      durationMs: 1_500,
      finishReason: "completed",
      firstTokenLatencyMs: 200,
      outputText: "Hello, world",
      reasoningText: "thinking...",
      requestId: "req-1",
      startedAt: 1_000,
      status: "completed",
      toolCalls: [{ argumentsText: "{\"q\":\"hello\"}", id: "tool-1", name: "web_search" }],
      usage: {
        inputTokens: 128,
        outputTokens: 64,
        totalTokens: 192,
      },
    });
  });

  it("preserves partial output when a stream terminates with an error", () => {
    expect(
      reduceLlmStreamEvents([
        {
          modelId: "claude-sonnet-4.5",
          requestId: "req-2",
          routeId: "anthropic-primary",
          startedAt: 2_000,
          type: "start",
        },
        {
          at: 2_120,
          delta: "Partial answer",
          type: "text-delta",
        },
        {
          at: 2_450,
          code: "upstream-timeout",
          message: "Gateway timed out while waiting for upstream.",
          type: "error",
        },
      ]),
    ).toEqual({
      completedAt: 2_450,
      durationMs: 450,
      error: {
        code: "upstream-timeout",
        message: "Gateway timed out while waiting for upstream.",
      },
      firstTokenLatencyMs: 120,
      outputText: "Partial answer",
      reasoningText: "",
      requestId: "req-2",
      startedAt: 2_000,
      status: "failed",
      toolCalls: [],
      usage: undefined,
    });
  });

  it("summarizes telemetry and creates workspace manifests plus route intents", () => {
    const summary = reduceLlmStreamEvents([
      {
        modelId: "gpt-5.4",
        requestId: "req-1",
        routeId: "openai-primary",
        startedAt: 1_000,
        type: "start",
      },
      {
        at: 1_200,
        delta: "Hello",
        type: "text-delta",
      },
      {
        at: 2_100,
        inputTokens: 128,
        outputTokens: 64,
        totalTokens: 192,
        type: "usage",
      },
      {
        at: 2_500,
        finishReason: "completed",
        type: "finish",
      },
    ]);

    expect(
      summarizeLlmExecutionTelemetry({
        cachedInputTokens: 32,
        mode: "stream",
        route: routes[0],
        spendUsd: 0.0144,
        summary,
        warnings: ["streaming-not-supported"],
      }),
    ).toEqual({
      cachedInputTokens: 32,
      firstTokenLatencyMs: 200,
      inputTokens: 128,
      latencyMs: 1_500,
      mode: "stream",
      outputTokens: 64,
      outputTokensPerSecond: 42.67,
      protocol: "openai-responses",
      providerId: "openai",
      routeId: "openai-primary",
      spendUsd: 0.0144,
      totalTokens: 192,
      warningCount: 1,
    });

    expect(
      createLlmWorkspaceManifest({
        packageNames: [
          "@sdkwork/llm-pc-react",
          "@sdkwork/models-pc-react",
          "@sdkwork/llm-pc-react",
        ],
        title: "LLM",
      }),
    ).toEqual({
      architecture: "pc-react",
      capability: "llm",
      description: "LLM workspace for execution planning, playground routing, and runtime telemetry.",
      executionRoutePattern: "/llm/executions/:executionId",
      host: "tauri",
      id: "sdkwork-llm",
      packageNames: ["@sdkwork/llm-pc-react", "@sdkwork/models-pc-react"],
      playgroundRoutePattern: "/llm/playground",
      routePath: "/llm",
      theme: {
        color: "lobster",
        preset: "sdkwork",
        selection: "system",
      },
      title: "LLM",
    });

    expect(
      createLlmPlaygroundRouteIntent({
        modelId: "gpt-5.4",
        providerId: "openai",
      }),
    ).toEqual({
      focusWindow: true,
      modelId: "gpt-5.4",
      providerId: "openai",
      route: "/llm/playground?provider=openai&model=gpt-5.4",
      source: "llm-workspace",
      type: "llm-playground-route-intent",
    });

    expect(createLlmExecutionDetailRouteIntent("exec-42")).toEqual({
      executionId: "exec-42",
      focusWindow: true,
      route: "/llm/executions/exec-42",
      source: "llm-workspace",
      type: "llm-execution-detail-route-intent",
    });
  });
});
