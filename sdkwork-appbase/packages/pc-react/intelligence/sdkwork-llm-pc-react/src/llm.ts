import {
  createSdkworkAppCapabilityManifest,
  type CreateSdkworkAppCapabilityManifestOptions,
  type SdkworkAppCapabilityManifest,
} from "@sdkwork/appbase-pc-react";
import type { SdkworkModelCapability, SdkworkModelCatalogItem } from "@sdkwork/models-pc-react";

export type SdkworkLlmTransportProtocol =
  | "anthropic-messages"
  | "google-gemini"
  | "openai-chat-completions"
  | "openai-responses";
export type SdkworkLlmRouteHealth = "degraded" | "healthy" | "offline";
export type SdkworkLlmExecutionMode = "stream" | "sync";
export type SdkworkLlmReasoningEffort = "deep" | "none";
export type SdkworkLlmOutputFormat = "json-object" | "json-schema" | "text";
export type SdkworkLlmExecutionWarning =
  | "reasoning-not-supported"
  | "streaming-not-supported"
  | "structured-output-not-supported"
  | "tool-calling-not-supported"
  | "vision-not-supported";
export type SdkworkLlmToolType = "builtin" | "function" | "mcp";
export type SdkworkLlmStreamFinishReason = "cancelled" | "completed" | "length" | "tool-call";

export interface SdkworkLlmProviderRoute {
  allowedModelIds?: readonly string[];
  averageLatencyMs?: number;
  enabled: boolean;
  health: SdkworkLlmRouteHealth;
  id: string;
  isDefault?: boolean;
  label: string;
  priority?: number;
  protocol: SdkworkLlmTransportProtocol;
  providerId: string;
  supportsReasoning: boolean;
  supportsStreaming: boolean;
  supportsStructuredOutput: boolean;
  supportsToolCalling: boolean;
  supportsVision: boolean;
}

export type SdkworkLlmProviderRouteModelCoverage = "provider-models" | "specific-models" | "unbounded";

export interface SdkworkLlmProviderRouteCatalogEntry {
  averageLatencyMs?: number;
  enabled: boolean;
  health: SdkworkLlmRouteHealth;
  id: string;
  isDefault: boolean;
  label: string;
  modelCount: number;
  modelCoverage: SdkworkLlmProviderRouteModelCoverage;
  modelIds: string[];
  priority: number;
  protocol: SdkworkLlmTransportProtocol;
  providerId: string;
  supports: {
    reasoning: boolean;
    streaming: boolean;
    structuredOutput: boolean;
    toolCalling: boolean;
    vision: boolean;
  };
}

export interface CreateLlmProviderRouteCatalogOptions {
  models?: readonly Pick<SdkworkModelCatalogItem, "id" | "providerId">[];
}

export interface SdkworkLlmProviderRouteCatalogSummary {
  defaultRouteIds: string[];
  degradedRoutes: number;
  enabledRoutes: number;
  healthyRoutes: number;
  modelCoverageCount: number;
  offlineRoutes: number;
  providerCount: number;
  reasoningRoutes: number;
  routeCount: number;
  streamingRoutes: number;
  structuredOutputRoutes: number;
  toolCallingRoutes: number;
  visionRoutes: number;
}

export interface SdkworkLlmTextPart {
  text: string;
  type: "text";
}

export interface SdkworkLlmImagePart {
  mimeType?: string;
  type: "image";
  url: string;
}

export interface SdkworkLlmFilePart {
  fileId?: string;
  mimeType?: string;
  type: "file";
  url?: string;
}

export type SdkworkLlmMessagePart = SdkworkLlmFilePart | SdkworkLlmImagePart | SdkworkLlmTextPart;
export type SdkworkLlmMessageRole = "assistant" | "developer" | "system" | "tool" | "user";

export interface SdkworkLlmMessage {
  parts: readonly SdkworkLlmMessagePart[];
  role: SdkworkLlmMessageRole;
}

export interface SdkworkLlmTool {
  id: string;
  name: string;
  type: SdkworkLlmToolType;
}

export interface SelectLlmProviderRouteOptions {
  mode?: SdkworkLlmExecutionMode;
  model: Pick<SdkworkModelCatalogItem, "capabilities" | "id" | "providerId">;
  requiresReasoning?: boolean;
  requiresStructuredOutput?: boolean;
  requiresToolCalling?: boolean;
  requiresVision?: boolean;
}

export interface ResolveLlmExecutionPlanOptions {
  maxOutputTokens?: number;
  messages: readonly SdkworkLlmMessage[];
  mode?: SdkworkLlmExecutionMode;
  model: Pick<SdkworkModelCatalogItem, "capabilities" | "contextWindowTokens" | "id">;
  outputFormat?: SdkworkLlmOutputFormat;
  reasoningEffort?: SdkworkLlmReasoningEffort;
  tools?: readonly SdkworkLlmTool[];
}

export interface SdkworkLlmExecutionPlan {
  features: {
    reasoning: boolean;
    streaming: boolean;
    structuredOutput: boolean;
    toolCalling: boolean;
    vision: boolean;
  };
  mode: SdkworkLlmExecutionMode;
  modelId: string;
  outputFormat: SdkworkLlmOutputFormat;
  promptSummary: {
    attachmentCount: number;
    inputTokenBudget: number;
    messageCount: number;
    toolCount: number;
  };
  providerId: string;
  protocol: SdkworkLlmTransportProtocol;
  reasoningEffort: SdkworkLlmReasoningEffort;
  routeId: string;
  warnings: SdkworkLlmExecutionWarning[];
}

export type SdkworkLlmExecutionReadinessIssue =
  | "no-route"
  | "reasoning-degraded"
  | "streaming-degraded"
  | "structured-output-degraded"
  | "tool-calling-degraded"
  | "vision-degraded";

export interface EvaluateLlmExecutionReadinessOptions extends ResolveLlmExecutionPlanOptions {}

export interface SdkworkLlmExecutionReadinessSummary {
  candidateRouteIds: string[];
  degraded: boolean;
  issues: SdkworkLlmExecutionReadinessIssue[];
  plan?: SdkworkLlmExecutionPlan;
  ready: boolean;
  route?: SdkworkLlmProviderRoute;
}

export interface SdkworkLlmStreamStartEvent {
  modelId: string;
  requestId: string;
  routeId: string;
  startedAt: number;
  type: "start";
}

export interface SdkworkLlmTextDeltaEvent {
  at: number;
  delta: string;
  type: "text-delta";
}

export interface SdkworkLlmReasoningDeltaEvent {
  at: number;
  delta: string;
  type: "reasoning-delta";
}

export interface SdkworkLlmToolCallEvent {
  argumentsText: string;
  at: number;
  name: string;
  toolCallId: string;
  type: "tool-call";
}

export interface SdkworkLlmUsageEvent {
  at: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  type: "usage";
}

export interface SdkworkLlmFinishEvent {
  at: number;
  finishReason: SdkworkLlmStreamFinishReason;
  type: "finish";
}

export interface SdkworkLlmErrorEvent {
  at: number;
  code: string;
  message: string;
  type: "error";
}

export type SdkworkLlmStreamEvent =
  | SdkworkLlmErrorEvent
  | SdkworkLlmFinishEvent
  | SdkworkLlmReasoningDeltaEvent
  | SdkworkLlmStreamStartEvent
  | SdkworkLlmTextDeltaEvent
  | SdkworkLlmToolCallEvent
  | SdkworkLlmUsageEvent;

export interface SdkworkLlmStreamSummary {
  completedAt?: number;
  durationMs?: number;
  error?: {
    code: string;
    message: string;
  };
  finishReason?: SdkworkLlmStreamFinishReason;
  firstTokenLatencyMs?: number;
  outputText: string;
  reasoningText: string;
  requestId?: string;
  startedAt?: number;
  status: "completed" | "failed";
  toolCalls: Array<{
    argumentsText: string;
    id: string;
    name: string;
  }>;
  usage:
    | {
        inputTokens: number;
        outputTokens: number;
        totalTokens: number;
      }
    | undefined;
}

export interface SummarizeLlmExecutionTelemetryOptions {
  cachedInputTokens?: number;
  mode: SdkworkLlmExecutionMode;
  route: SdkworkLlmProviderRoute;
  spendUsd?: number;
  summary: SdkworkLlmStreamSummary;
  warnings?: readonly SdkworkLlmExecutionWarning[];
}

export interface SdkworkLlmExecutionTelemetry {
  cachedInputTokens: number;
  firstTokenLatencyMs: number;
  inputTokens: number;
  latencyMs: number;
  mode: SdkworkLlmExecutionMode;
  outputTokens: number;
  outputTokensPerSecond: number;
  protocol: SdkworkLlmTransportProtocol;
  providerId: string;
  routeId: string;
  spendUsd?: number;
  totalTokens: number;
  warningCount: number;
}

export interface SdkworkLlmWorkspaceManifest extends SdkworkAppCapabilityManifest {
  capability: "llm";
  executionRoutePattern: string;
  playgroundRoutePattern: string;
  routePath: string;
}

export interface CreateLlmWorkspaceManifestOptions
  extends Partial<
    Pick<CreateSdkworkAppCapabilityManifestOptions, "description" | "host" | "id" | "packageNames" | "theme" | "title">
  > {
  routePath?: string;
}

export interface SdkworkLlmPlaygroundRouteIntent {
  focusWindow: boolean;
  modelId?: string;
  providerId?: string;
  route: string;
  source: "llm-workspace";
  type: "llm-playground-route-intent";
}

export interface CreateLlmPlaygroundRouteIntentOptions {
  basePath?: string;
  focusWindow?: boolean;
  modelId?: string;
  providerId?: string;
}

export interface SdkworkLlmExecutionDetailRouteIntent {
  executionId: string;
  focusWindow: boolean;
  route: string;
  source: "llm-workspace";
  type: "llm-execution-detail-route-intent";
}

export interface CreateLlmExecutionDetailRouteIntentOptions {
  basePath?: string;
  focusWindow?: boolean;
}

function modelSupports(
  model: Pick<SdkworkModelCatalogItem, "capabilities">,
  capability: SdkworkModelCapability,
): boolean {
  return model.capabilities.includes(capability);
}

function countAttachments(messages: readonly SdkworkLlmMessage[]): number {
  return messages.reduce((count, message) => {
    return (
      count +
      message.parts.filter((part) => part.type === "file" || part.type === "image").length
    );
  }, 0);
}

function usesVision(messages: readonly SdkworkLlmMessage[]): boolean {
  return messages.some((message) => message.parts.some((part) => part.type === "image"));
}

function roundTo(value: number, digits: number): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function toUniquePackages(packageNames: readonly string[]): string[] {
  return Array.from(new Set(packageNames.map((packageName) => packageName.trim()).filter(Boolean)));
}

function healthRank(health: SdkworkLlmRouteHealth): number {
  switch (health) {
    case "healthy":
      return 2;
    case "degraded":
      return 1;
    case "offline":
      return 0;
    default:
      return 0;
  }
}

function getViableLlmProviderRoutes(
  routes: readonly SdkworkLlmProviderRoute[],
  options: SelectLlmProviderRouteOptions,
): SdkworkLlmProviderRoute[] {
  return routes.filter((route) => {
    if (!route.enabled || route.health === "offline") {
      return false;
    }

    if (route.allowedModelIds && route.allowedModelIds.length > 0) {
      return route.allowedModelIds.includes(options.model.id);
    }

    return true;
  });
}

function sortLlmProviderRoutesForSelection(
  routes: readonly SdkworkLlmProviderRoute[],
  options: SelectLlmProviderRouteOptions,
): SdkworkLlmProviderRoute[] {
  return [...routes].sort((left, right) => {
    const leftScore = routeScore(left, options);
    const rightScore = routeScore(right, options);

    if (rightScore !== leftScore) {
      return rightScore - leftScore;
    }

    return left.label.localeCompare(right.label);
  });
}

function toLlmSelectionOptions(
  options: ResolveLlmExecutionPlanOptions,
): SelectLlmProviderRouteOptions {
  const providerId =
    "providerId" in options.model && typeof options.model.providerId === "string"
      ? options.model.providerId
      : "";

  return {
    mode: options.mode,
    model: {
      capabilities: options.model.capabilities,
      id: options.model.id,
      providerId,
    },
    requiresReasoning: (options.reasoningEffort ?? "none") !== "none",
    requiresStructuredOutput: (options.outputFormat ?? "text") !== "text",
    requiresToolCalling: (options.tools?.length ?? 0) > 0,
    requiresVision: usesVision(options.messages),
  };
}

function deriveRouteModelIds(
  route: SdkworkLlmProviderRoute,
  models: readonly Pick<SdkworkModelCatalogItem, "id" | "providerId">[] | undefined,
): { modelCoverage: SdkworkLlmProviderRouteModelCoverage; modelIds: string[] } {
  if (route.allowedModelIds && route.allowedModelIds.length > 0) {
    const allowedModelIds = new Set(route.allowedModelIds);
    const modelIds = models
      ? models.filter((model) => allowedModelIds.has(model.id)).map((model) => model.id)
      : Array.from(allowedModelIds);

    return {
      modelCoverage: "specific-models",
      modelIds: Array.from(new Set(modelIds)),
    };
  }

  if (models && models.length > 0) {
    const providerModelIds = models
      .filter((model) => model.providerId === route.providerId)
      .map((model) => model.id);

    if (providerModelIds.length > 0) {
      return {
        modelCoverage: "provider-models",
        modelIds: Array.from(new Set(providerModelIds)),
      };
    }
  }

  return {
    modelCoverage: "unbounded",
    modelIds: [],
  };
}

function selectFirstTokenLatency(
  currentLatency: number | undefined,
  startedAt: number | undefined,
  at: number,
): number | undefined {
  if (currentLatency !== undefined || startedAt === undefined) {
    return currentLatency;
  }

  return Math.max(at - startedAt, 0);
}

export function selectLlmProviderRoute(
  routes: readonly SdkworkLlmProviderRoute[],
  options: SelectLlmProviderRouteOptions,
): SdkworkLlmProviderRoute {
  const candidates = getViableLlmProviderRoutes(routes, options);

  if (candidates.length === 0) {
    throw new Error(`No viable LLM provider route is available for model ${options.model.id}.`);
  }

  return sortLlmProviderRoutesForSelection(candidates, options)[0]!;
}

function routeScore(route: SdkworkLlmProviderRoute, options: SelectLlmProviderRouteOptions): number {
  let score = 0;

  if (route.providerId === options.model.providerId) {
    score += 40_000;
  }

  if (route.health === "healthy") {
    score += 30_000;
  }

  if (route.health === "degraded") {
    score += 15_000;
  }

  if (route.isDefault) {
    score += 20_000;
  }

  score += (route.priority ?? 0) * 100;

  if (options.mode === "stream" && route.supportsStreaming) {
    score += 10_000;
  }

  if (options.requiresStructuredOutput && route.supportsStructuredOutput) {
    score += 9_000;
  }

  if (options.requiresReasoning && route.supportsReasoning) {
    score += 8_000;
  }

  if (options.requiresToolCalling && route.supportsToolCalling) {
    score += 7_000;
  }

  if (options.requiresVision && route.supportsVision) {
    score += 6_000;
  }

  score -= route.averageLatencyMs ?? 0;

  return score;
}

export function resolveLlmExecutionPlan(
  route: SdkworkLlmProviderRoute,
  options: ResolveLlmExecutionPlanOptions,
): SdkworkLlmExecutionPlan {
  const warnings: SdkworkLlmExecutionWarning[] = [];
  const requestedStreaming = options.mode === "stream";
  const requestedStructuredOutput = (options.outputFormat ?? "text") !== "text";
  const requestedReasoning = (options.reasoningEffort ?? "none") !== "none";
  const requestedToolCalling = (options.tools?.length ?? 0) > 0;
  const requestedVision = usesVision(options.messages);

  const streamingEnabled = requestedStreaming && route.supportsStreaming;
  if (requestedStreaming && !route.supportsStreaming) {
    warnings.push("streaming-not-supported");
  }

  const structuredOutputEnabled =
    requestedStructuredOutput &&
    route.supportsStructuredOutput &&
    modelSupports(options.model, "structured-output");
  if (requestedStructuredOutput && !structuredOutputEnabled) {
    warnings.push("structured-output-not-supported");
  }

  const reasoningEnabled =
    requestedReasoning && route.supportsReasoning && modelSupports(options.model, "reasoning");
  if (requestedReasoning && !reasoningEnabled) {
    warnings.push("reasoning-not-supported");
  }

  const toolCallingEnabled =
    requestedToolCalling && route.supportsToolCalling && modelSupports(options.model, "tool-calling");
  if (requestedToolCalling && !toolCallingEnabled) {
    warnings.push("tool-calling-not-supported");
  }

  const visionEnabled = requestedVision && route.supportsVision && modelSupports(options.model, "vision");
  if (requestedVision && !visionEnabled) {
    warnings.push("vision-not-supported");
  }

  return {
    features: {
      reasoning: reasoningEnabled,
      streaming: streamingEnabled,
      structuredOutput: structuredOutputEnabled,
      toolCalling: toolCallingEnabled,
      vision: visionEnabled,
    },
    mode: streamingEnabled ? "stream" : "sync",
    modelId: options.model.id,
    outputFormat: structuredOutputEnabled ? options.outputFormat ?? "text" : "text",
    promptSummary: {
      attachmentCount: countAttachments(options.messages),
      inputTokenBudget: Math.max(
        (options.model.contextWindowTokens ?? 0) - (options.maxOutputTokens ?? 0),
        0,
      ),
      messageCount: options.messages.length,
      toolCount: options.tools?.length ?? 0,
    },
    providerId: route.providerId,
    protocol: route.protocol,
    reasoningEffort: reasoningEnabled ? options.reasoningEffort ?? "none" : "none",
    routeId: route.id,
    warnings,
  };
}

export function reduceLlmStreamEvents(
  events: readonly SdkworkLlmStreamEvent[],
): SdkworkLlmStreamSummary {
  const toolCalls = new Map<string, { argumentsText: string; id: string; name: string }>();
  let requestId: string | undefined;
  let startedAt: number | undefined;
  let completedAt: number | undefined;
  let firstTokenLatencyMs: number | undefined;
  let outputText = "";
  let reasoningText = "";
  let finishReason: SdkworkLlmStreamFinishReason | undefined;
  let usage: SdkworkLlmStreamSummary["usage"];
  let error: SdkworkLlmStreamSummary["error"];
  let status: SdkworkLlmStreamSummary["status"] = "completed";

  for (const event of events) {
    switch (event.type) {
      case "start":
        requestId = event.requestId;
        startedAt = event.startedAt;
        break;
      case "text-delta":
        firstTokenLatencyMs = selectFirstTokenLatency(firstTokenLatencyMs, startedAt, event.at);
        outputText += event.delta;
        break;
      case "reasoning-delta":
        firstTokenLatencyMs = selectFirstTokenLatency(firstTokenLatencyMs, startedAt, event.at);
        reasoningText += event.delta;
        break;
      case "tool-call":
        firstTokenLatencyMs = selectFirstTokenLatency(firstTokenLatencyMs, startedAt, event.at);
        toolCalls.set(event.toolCallId, {
          argumentsText: event.argumentsText,
          id: event.toolCallId,
          name: event.name,
        });
        break;
      case "usage":
        usage = {
          inputTokens: event.inputTokens,
          outputTokens: event.outputTokens,
          totalTokens: event.totalTokens,
        };
        break;
      case "finish":
        completedAt = event.at;
        finishReason = event.finishReason;
        status = "completed";
        break;
      case "error":
        completedAt = event.at;
        error = {
          code: event.code,
          message: event.message,
        };
        status = "failed";
        break;
      default:
        break;
    }
  }

  return {
    completedAt,
    durationMs:
      startedAt !== undefined && completedAt !== undefined ? Math.max(completedAt - startedAt, 0) : undefined,
    ...(error ? { error } : {}),
    ...(finishReason ? { finishReason } : {}),
    ...(firstTokenLatencyMs !== undefined ? { firstTokenLatencyMs } : {}),
    outputText,
    reasoningText,
    ...(requestId ? { requestId } : {}),
    ...(startedAt !== undefined ? { startedAt } : {}),
    status,
    toolCalls: [...toolCalls.values()],
    usage,
  };
}

export function summarizeLlmExecutionTelemetry({
  cachedInputTokens = 0,
  mode,
  route,
  spendUsd,
  summary,
  warnings = [],
}: SummarizeLlmExecutionTelemetryOptions): SdkworkLlmExecutionTelemetry {
  const latencyMs = summary.durationMs ?? 0;
  const inputTokens = summary.usage?.inputTokens ?? 0;
  const outputTokens = summary.usage?.outputTokens ?? 0;
  const totalTokens = summary.usage?.totalTokens ?? 0;

  return {
    cachedInputTokens,
    firstTokenLatencyMs: summary.firstTokenLatencyMs ?? 0,
    inputTokens,
    latencyMs,
    mode,
    outputTokens,
    outputTokensPerSecond:
      latencyMs > 0 && outputTokens > 0 ? roundTo(outputTokens / (latencyMs / 1000), 2) : 0,
    protocol: route.protocol,
    providerId: route.providerId,
    routeId: route.id,
    ...(spendUsd !== undefined ? { spendUsd } : {}),
    totalTokens,
    warningCount: warnings.length,
  };
}

export function createLlmProviderRouteCatalog(
  routes: readonly SdkworkLlmProviderRoute[],
  options: CreateLlmProviderRouteCatalogOptions = {},
): SdkworkLlmProviderRouteCatalogEntry[] {
  return [...routes]
    .map((route) => {
      const { modelCoverage, modelIds } = deriveRouteModelIds(route, options.models);

      return {
        averageLatencyMs: route.averageLatencyMs,
        enabled: route.enabled,
        health: route.health,
        id: route.id,
        isDefault: route.isDefault === true,
        label: route.label,
        modelCount: modelIds.length,
        modelCoverage,
        modelIds,
        priority: route.priority ?? 0,
        protocol: route.protocol,
        providerId: route.providerId,
        supports: {
          reasoning: route.supportsReasoning,
          streaming: route.supportsStreaming,
          structuredOutput: route.supportsStructuredOutput,
          toolCalling: route.supportsToolCalling,
          vision: route.supportsVision,
        },
      };
    })
    .sort((left, right) => {
      if (right.enabled !== left.enabled) {
        return Number(right.enabled) - Number(left.enabled);
      }

      const healthDifference = healthRank(right.health) - healthRank(left.health);
      if (healthDifference !== 0) {
        return healthDifference;
      }

      if (right.isDefault !== left.isDefault) {
        return Number(right.isDefault) - Number(left.isDefault);
      }

      if (right.priority !== left.priority) {
        return right.priority - left.priority;
      }

      return left.label.localeCompare(right.label);
    });
}

export function summarizeLlmProviderRouteCatalog(
  catalog: readonly SdkworkLlmProviderRouteCatalogEntry[],
): SdkworkLlmProviderRouteCatalogSummary {
  const modelIds = new Set<string>();

  for (const route of catalog) {
    for (const modelId of route.modelIds) {
      modelIds.add(modelId);
    }
  }

  return {
    defaultRouteIds: catalog.filter((route) => route.isDefault).map((route) => route.id),
    degradedRoutes: catalog.filter((route) => route.health === "degraded").length,
    enabledRoutes: catalog.filter((route) => route.enabled).length,
    healthyRoutes: catalog.filter((route) => route.health === "healthy").length,
    modelCoverageCount: modelIds.size,
    offlineRoutes: catalog.filter((route) => route.health === "offline").length,
    providerCount: new Set(catalog.map((route) => route.providerId)).size,
    reasoningRoutes: catalog.filter((route) => route.supports.reasoning).length,
    routeCount: catalog.length,
    streamingRoutes: catalog.filter((route) => route.supports.streaming).length,
    structuredOutputRoutes: catalog.filter((route) => route.supports.structuredOutput).length,
    toolCallingRoutes: catalog.filter((route) => route.supports.toolCalling).length,
    visionRoutes: catalog.filter((route) => route.supports.vision).length,
  };
}

export function evaluateLlmExecutionReadiness(
  routes: readonly SdkworkLlmProviderRoute[],
  options: EvaluateLlmExecutionReadinessOptions,
): SdkworkLlmExecutionReadinessSummary {
  const selectionOptions = toLlmSelectionOptions(options);
  const viableRoutes = sortLlmProviderRoutesForSelection(
    getViableLlmProviderRoutes(routes, selectionOptions),
    selectionOptions,
  );

  if (viableRoutes.length === 0) {
    return {
      candidateRouteIds: [],
      degraded: false,
      issues: ["no-route"],
      ready: false,
    };
  }

  const route = viableRoutes[0]!;
  const plan = resolveLlmExecutionPlan(route, options);
  const issues: SdkworkLlmExecutionReadinessIssue[] = [];

  if (options.mode === "stream" && !plan.features.streaming) {
    issues.push("streaming-degraded");
  }

  if ((options.outputFormat ?? "text") !== "text" && !plan.features.structuredOutput) {
    issues.push("structured-output-degraded");
  }

  if ((options.reasoningEffort ?? "none") !== "none" && !plan.features.reasoning) {
    issues.push("reasoning-degraded");
  }

  if ((options.tools?.length ?? 0) > 0 && !plan.features.toolCalling) {
    issues.push("tool-calling-degraded");
  }

  if (usesVision(options.messages) && !plan.features.vision) {
    issues.push("vision-degraded");
  }

  return {
    candidateRouteIds: viableRoutes.map((candidateRoute) => candidateRoute.id),
    degraded: issues.length > 0,
    issues,
    plan,
    ready: true,
    route,
  };
}

export function createLlmWorkspaceManifest({
  description = "LLM workspace for execution planning, playground routing, and runtime telemetry.",
  host,
  id = "sdkwork-llm",
  packageNames = ["@sdkwork/llm-pc-react"],
  routePath = "/llm",
  theme,
  title = "LLM",
}: CreateLlmWorkspaceManifestOptions = {}): SdkworkLlmWorkspaceManifest {
  return {
    ...createSdkworkAppCapabilityManifest({
      description,
      host,
      id,
      packageNames: toUniquePackages(packageNames),
      theme,
      title,
    }),
    capability: "llm",
    executionRoutePattern: `${routePath}/executions/:executionId`,
    playgroundRoutePattern: `${routePath}/playground`,
    routePath,
  };
}

export function createLlmPlaygroundRouteIntent(
  options: CreateLlmPlaygroundRouteIntentOptions = {},
): SdkworkLlmPlaygroundRouteIntent {
  const queryParams = new URLSearchParams();

  if (options.providerId) {
    queryParams.set("provider", options.providerId);
  }

  if (options.modelId) {
    queryParams.set("model", options.modelId);
  }

  const querySuffix = queryParams.toString() ? `?${queryParams.toString()}` : "";

  return {
    focusWindow: options.focusWindow !== false,
    ...(options.modelId ? { modelId: options.modelId } : {}),
    ...(options.providerId ? { providerId: options.providerId } : {}),
    route: `${options.basePath ?? "/llm"}/playground${querySuffix}`,
    source: "llm-workspace",
    type: "llm-playground-route-intent",
  };
}

export function createLlmExecutionDetailRouteIntent(
  executionId: string,
  options: CreateLlmExecutionDetailRouteIntentOptions = {},
): SdkworkLlmExecutionDetailRouteIntent {
  return {
    executionId,
    focusWindow: options.focusWindow !== false,
    route: `${options.basePath ?? "/llm"}/executions/${executionId}`,
    source: "llm-workspace",
    type: "llm-execution-detail-route-intent",
  };
}

export const llmPackageMeta = {
  architecture: "pc-react",
  domain: "intelligence",
  package: "@sdkwork/llm-pc-react",
  status: "ready",
} as const;

export type LlmPackageMeta = typeof llmPackageMeta;
