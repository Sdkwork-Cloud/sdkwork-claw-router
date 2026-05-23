import {
  createSdkworkAppCapabilityManifest,
  type CreateSdkworkAppCapabilityManifestOptions,
  type SdkworkAppCapabilityManifest,
} from "@sdkwork/appbase-pc-react";
import type { SdkworkLlmTool } from "@sdkwork/llm-pc-react";

export type SdkworkToolSource = "channel" | "core" | "plugin";
export type SdkworkToolAccess = "execute" | "read" | "write";
export type SdkworkToolCategory =
  | "automation"
  | "filesystem"
  | "integration"
  | "observability"
  | "reasoning";
export type SdkworkToolStatus = "beta" | "disabled" | "ready";
export type SdkworkToolRisk = "high" | "low" | "medium";
export type SdkworkToolProfileId = "coding" | "full" | "messaging" | "minimal";
export type SdkworkToolInputPropertyType = "array" | "boolean" | "number" | "object" | "string";

export interface SdkworkToolInputProperty {
  description?: string;
  enum?: readonly string[];
  type: SdkworkToolInputPropertyType;
}

export interface SdkworkToolInputSchema {
  properties: Record<string, SdkworkToolInputProperty>;
  required?: readonly string[];
  type: "object";
}

export interface SdkworkToolCatalogProfile {
  id: SdkworkToolProfileId;
  label: string;
}

export interface SdkworkToolCatalogEntry {
  defaultProfiles?: readonly SdkworkToolProfileId[];
  description?: string;
  id: string;
  inputSchema?: SdkworkToolInputSchema;
  label: string;
  optional?: boolean;
  pluginId?: string;
  source?: SdkworkToolSource;
}

export interface SdkworkToolCatalogGroup {
  id: string;
  label: string;
  pluginId?: string;
  source: SdkworkToolSource;
  tools: readonly SdkworkToolCatalogEntry[];
}

export interface SdkworkToolsCatalogResult {
  agentId?: string;
  groups: readonly SdkworkToolCatalogGroup[];
  profiles?: readonly SdkworkToolCatalogProfile[];
}

export interface SdkworkToolDescriptor {
  access: SdkworkToolAccess;
  category: SdkworkToolCategory;
  command: string;
  defaultProfiles: readonly SdkworkToolProfileId[];
  description: string;
  groupId: string;
  groupLabel: string;
  id: string;
  inputSchema?: SdkworkToolInputSchema;
  label: string;
  pluginId?: string;
  risk: SdkworkToolRisk;
  source: SdkworkToolSource;
  status: SdkworkToolStatus;
}

export interface FilterToolCatalogOptions {
  access?: readonly SdkworkToolAccess[];
  category?: readonly SdkworkToolCategory[];
  profile?: SdkworkToolProfileId;
  query?: string;
  risk?: readonly SdkworkToolRisk[];
  source?: readonly SdkworkToolSource[];
  status?: readonly SdkworkToolStatus[];
}

export interface CompileToolsForLlmOptions {
  maxTools?: number;
  profile?: SdkworkToolProfileId;
}

export interface SdkworkToolExecutionStartedEvent {
  at: number;
  toolCallId: string;
  toolId: string;
  type: "started";
}

export interface SdkworkToolExecutionProgressEvent {
  at: number;
  delta: string;
  locations?: readonly string[];
  toolCallId: string;
  toolId: string;
  type: "progress";
}

export interface SdkworkToolExecutionCompletedEvent {
  at: number;
  locations?: readonly string[];
  outputText?: string;
  toolCallId: string;
  toolId: string;
  type: "completed";
}

export interface SdkworkToolExecutionFailedEvent {
  at: number;
  error: string;
  locations?: readonly string[];
  outputText?: string;
  toolCallId: string;
  toolId: string;
  type: "failed";
}

export type SdkworkToolExecutionEvent =
  | SdkworkToolExecutionCompletedEvent
  | SdkworkToolExecutionFailedEvent
  | SdkworkToolExecutionProgressEvent
  | SdkworkToolExecutionStartedEvent;

export interface SdkworkToolExecutionSummary {
  completedAt?: number;
  durationMs?: number;
  error?: string;
  lastOutputText: string;
  locations: string[];
  startedAt?: number;
  status: "completed" | "failed" | "running";
  toolCallId?: string;
  toolId?: string;
}

export interface SdkworkToolsWorkspaceManifest extends SdkworkAppCapabilityManifest {
  capability: "tools";
  detailRoutePattern: string;
  executionRoutePattern: string;
  routePath: string;
}

export interface CreateToolsWorkspaceManifestOptions
  extends Partial<
    Pick<CreateSdkworkAppCapabilityManifestOptions, "description" | "host" | "id" | "packageNames" | "theme" | "title">
  > {
  routePath?: string;
}

export interface SdkworkToolsDirectoryRouteIntent {
  access?: SdkworkToolAccess;
  category?: SdkworkToolCategory;
  focusWindow: boolean;
  route: string;
  source: "tools-workspace";
  type: "tools-directory-route-intent";
}

export interface CreateToolsDirectoryRouteIntentOptions {
  access?: SdkworkToolAccess;
  basePath?: string;
  category?: SdkworkToolCategory;
  focusWindow?: boolean;
}

export interface SdkworkToolDetailRouteIntent {
  focusWindow: boolean;
  route: string;
  source: "tools-workspace";
  toolId: string;
  type: "tool-detail-route-intent";
}

export interface CreateToolDetailRouteIntentOptions {
  basePath?: string;
  focusWindow?: boolean;
}

export interface SdkworkToolExecutionRouteIntent {
  focusWindow: boolean;
  route: string;
  source: "tools-workspace";
  toolCallId: string;
  type: "tool-execution-route-intent";
}

export interface CreateToolExecutionRouteIntentOptions {
  basePath?: string;
  focusWindow?: boolean;
}

function titleCaseIdentifier(value: string): string {
  return value
    .split(/[_-]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeQuery(value: string | undefined): string {
  return value?.trim().toLowerCase() ?? "";
}

function inferToolAccess(toolId: string): SdkworkToolAccess {
  const normalized = toolId.toLowerCase();

  if (
    normalized.includes("read") ||
    normalized.includes("get") ||
    normalized.includes("list") ||
    normalized.includes("status") ||
    normalized.includes("search") ||
    normalized.includes("tail") ||
    normalized.includes("catalog") ||
    normalized.includes("resolve")
  ) {
    return "read";
  }

  if (
    normalized.includes("set") ||
    normalized.includes("update") ||
    normalized.includes("patch") ||
    normalized.includes("install") ||
    normalized.includes("create") ||
    normalized.includes("delete") ||
    normalized.includes("logout") ||
    normalized.includes("post") ||
    normalized.includes("push") ||
    normalized.includes("send") ||
    normalized.includes("notify")
  ) {
    return "write";
  }

  return "execute";
}

function inferToolCategory(
  groupId: string,
  tool: Pick<SdkworkToolCatalogEntry, "id" | "source">,
): SdkworkToolCategory {
  const source = `${groupId} ${tool.id} ${tool.source ?? ""}`.toLowerCase();

  if (source.includes("file") || source.includes("fs")) {
    return "filesystem";
  }

  if (source.includes("observe") || source.includes("search") || source.includes("browser")) {
    return "observability";
  }

  if (source.includes("reason") || source.includes("model")) {
    return "reasoning";
  }

  if (source.includes("exec") || source.includes("cron") || source.includes("agent")) {
    return "automation";
  }

  return "integration";
}

function inferToolRisk(access: SdkworkToolAccess): SdkworkToolRisk {
  switch (access) {
    case "read":
      return "low";
    case "write":
      return "medium";
    default:
      return "high";
  }
}

function searchValues(tool: SdkworkToolDescriptor): string[] {
  return [
    tool.id,
    tool.label,
    tool.description,
    tool.category,
    tool.access,
    tool.groupId,
    tool.groupLabel,
    tool.source,
  ];
}

function toUniquePackages(packageNames: readonly string[]): string[] {
  return Array.from(new Set(packageNames.map((packageName) => packageName.trim()).filter(Boolean)));
}

export function flattenToolCatalog(
  catalog: SdkworkToolsCatalogResult,
): SdkworkToolDescriptor[] {
  const toolMap = new Map<string, SdkworkToolDescriptor>();

  for (const group of catalog.groups) {
    for (const tool of group.tools) {
      if (!tool.id || toolMap.has(tool.id)) {
        continue;
      }

      const source = tool.source ?? group.source;
      const access = inferToolAccess(tool.id);
      const descriptor: SdkworkToolDescriptor = {
        access,
        category: inferToolCategory(group.id, {
          id: tool.id,
          source,
        }),
        command: `tool:${tool.id}`,
        defaultProfiles: [...(tool.defaultProfiles ?? [])],
        description: tool.description?.trim() || `${titleCaseIdentifier(tool.id)} tool exposed by the gateway.`,
        groupId: group.id,
        groupLabel: group.label,
        id: tool.id,
        ...(tool.inputSchema ? { inputSchema: tool.inputSchema } : {}),
        label: tool.label?.trim() || titleCaseIdentifier(tool.id),
        ...(tool.pluginId ?? group.pluginId ? { pluginId: tool.pluginId ?? group.pluginId } : {}),
        risk: inferToolRisk(access),
        source,
        status: tool.optional ? "beta" : "ready",
      };

      toolMap.set(tool.id, descriptor);
    }
  }

  return [...toolMap.values()].sort((left, right) => left.label.localeCompare(right.label));
}

export function filterToolCatalog(
  tools: readonly SdkworkToolDescriptor[],
  options: FilterToolCatalogOptions = {},
): SdkworkToolDescriptor[] {
  const access = options.access ? new Set(options.access) : null;
  const category = options.category ? new Set(options.category) : null;
  const risk = options.risk ? new Set(options.risk) : null;
  const source = options.source ? new Set(options.source) : null;
  const status = options.status ? new Set(options.status) : null;
  const query = normalizeQuery(options.query);

  return [...tools]
    .filter((tool) => (access ? access.has(tool.access) : true))
    .filter((tool) => (category ? category.has(tool.category) : true))
    .filter((tool) => (risk ? risk.has(tool.risk) : true))
    .filter((tool) => (source ? source.has(tool.source) : true))
    .filter((tool) => (status ? status.has(tool.status) : true))
    .filter((tool) =>
      options.profile ? tool.defaultProfiles.includes(options.profile) : true,
    )
    .filter((tool) =>
      query ? searchValues(tool).some((value) => value.toLowerCase().includes(query)) : true,
    )
    .sort((left, right) => left.label.localeCompare(right.label));
}

export function compileToolsForLlm(
  tools: readonly SdkworkToolDescriptor[],
  options: CompileToolsForLlmOptions = {},
): SdkworkLlmTool[] {
  return filterToolCatalog(tools, {
    profile: options.profile,
    status: ["beta", "ready"],
  })
    .slice(0, options.maxTools ?? Number.POSITIVE_INFINITY)
    .map((tool) => ({
      id: tool.id,
      name: tool.id,
      type: tool.source === "core" ? "builtin" : "function",
    }));
}

export function reduceToolExecutionEvents(
  events: readonly SdkworkToolExecutionEvent[],
): SdkworkToolExecutionSummary {
  const locations = new Set<string>();
  let startedAt: number | undefined;
  let completedAt: number | undefined;
  let toolCallId: string | undefined;
  let toolId: string | undefined;
  let lastOutputText = "";
  let error: string | undefined;
  let status: SdkworkToolExecutionSummary["status"] = "running";

  for (const event of events) {
    toolCallId = event.toolCallId;
    toolId = event.toolId;

    switch (event.type) {
      case "started":
        startedAt = event.at;
        break;
      case "progress":
        lastOutputText += event.delta;
        event.locations?.forEach((location) => locations.add(location));
        break;
      case "completed":
        completedAt = event.at;
        if (event.outputText) {
          lastOutputText = event.outputText;
        }
        event.locations?.forEach((location) => locations.add(location));
        status = "completed";
        break;
      case "failed":
        completedAt = event.at;
        if (event.outputText) {
          lastOutputText = event.outputText;
        }
        event.locations?.forEach((location) => locations.add(location));
        error = event.error;
        status = "failed";
        break;
      default:
        break;
    }
  }

  return {
    ...(completedAt !== undefined ? { completedAt } : {}),
    ...(startedAt !== undefined && completedAt !== undefined
      ? { durationMs: Math.max(completedAt - startedAt, 0) }
      : {}),
    ...(error ? { error } : {}),
    lastOutputText,
    locations: [...locations],
    ...(startedAt !== undefined ? { startedAt } : {}),
    status,
    ...(toolCallId ? { toolCallId } : {}),
    ...(toolId ? { toolId } : {}),
  };
}

export function createToolsWorkspaceManifest({
  description = "Tools workspace for catalog browsing, risk-aware selection, and execution summaries.",
  host,
  id = "sdkwork-tools",
  packageNames = ["@sdkwork/tools-pc-react", "@sdkwork/llm-pc-react"],
  routePath = "/tools",
  theme,
  title = "Tools",
}: CreateToolsWorkspaceManifestOptions = {}): SdkworkToolsWorkspaceManifest {
  return {
    ...createSdkworkAppCapabilityManifest({
      description,
      host,
      id,
      packageNames: toUniquePackages(packageNames),
      theme,
      title,
    }),
    capability: "tools",
    detailRoutePattern: `${routePath}/:toolId`,
    executionRoutePattern: `${routePath}/executions/:toolCallId`,
    routePath,
  };
}

export function createToolsDirectoryRouteIntent(
  options: CreateToolsDirectoryRouteIntentOptions = {},
): SdkworkToolsDirectoryRouteIntent {
  const queryParams = new URLSearchParams();

  if (options.access) {
    queryParams.set("access", options.access);
  }

  if (options.category) {
    queryParams.set("category", options.category);
  }

  const querySuffix = queryParams.toString() ? `?${queryParams.toString()}` : "";

  return {
    ...(options.access ? { access: options.access } : {}),
    ...(options.category ? { category: options.category } : {}),
    focusWindow: options.focusWindow !== false,
    route: `${options.basePath ?? "/tools"}${querySuffix}`,
    source: "tools-workspace",
    type: "tools-directory-route-intent",
  };
}

export function createToolDetailRouteIntent(
  toolId: string,
  options: CreateToolDetailRouteIntentOptions = {},
): SdkworkToolDetailRouteIntent {
  return {
    focusWindow: options.focusWindow !== false,
    route: `${options.basePath ?? "/tools"}/${toolId}`,
    source: "tools-workspace",
    toolId,
    type: "tool-detail-route-intent",
  };
}

export function createToolExecutionRouteIntent(
  toolCallId: string,
  options: CreateToolExecutionRouteIntentOptions = {},
): SdkworkToolExecutionRouteIntent {
  return {
    focusWindow: options.focusWindow !== false,
    route: `${options.basePath ?? "/tools"}/executions/${toolCallId}`,
    source: "tools-workspace",
    toolCallId,
    type: "tool-execution-route-intent",
  };
}

export const toolsPackageMeta = {
  architecture: "pc-react",
  domain: "intelligence",
  package: "@sdkwork/tools-pc-react",
  status: "ready",
} as const;

export type ToolsPackageMeta = typeof toolsPackageMeta;
