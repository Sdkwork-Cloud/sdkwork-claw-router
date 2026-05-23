import {
  createSdkworkAppCapabilityManifest,
  type CreateSdkworkAppCapabilityManifestOptions,
  type SdkworkAppCapabilityManifest,
} from "@sdkwork/appbase-pc-react";
import type { SdkworkLlmTool } from "@sdkwork/llm-pc-react";

export type SdkworkMcpServerSource = "bundle" | "config" | "workspace";
export type SdkworkMcpTransportKind = "sse" | "stdio" | "streamable-http" | "unknown";
export type SdkworkMcpServerReadiness =
  | "disabled"
  | "incomplete-config"
  | "ready"
  | "unsupported-transport";
export type SdkworkMcpCapabilityKind = "prompts" | "resources" | "tools" | (string & {});
export type SdkworkMcpDiagnosticCode =
  | "missing-command"
  | "missing-transport"
  | "unsupported-transport";

export interface SdkworkMcpDiagnostic {
  code: SdkworkMcpDiagnosticCode;
  message: string;
}

export interface SdkworkMcpCapabilityDescriptor {
  kind: SdkworkMcpCapabilityKind;
  label: string;
}

export interface SdkworkMcpServerTransportConfig {
  args?: readonly string[];
  command?: string;
  type?: string;
  url?: string;
}

export interface SdkworkMcpServerCatalogEntry {
  capabilities?: readonly SdkworkMcpCapabilityKind[];
  description?: string;
  enabled?: boolean;
  id: string;
  label?: string;
  pluginId?: string;
  source?: SdkworkMcpServerSource;
  transport?: SdkworkMcpServerTransportConfig;
}

export interface SdkworkMcpServerCatalogGroup {
  id: string;
  label: string;
  pluginId?: string;
  servers: readonly SdkworkMcpServerCatalogEntry[];
  source: SdkworkMcpServerSource;
}

export interface SdkworkMcpCatalogResult {
  groups: readonly SdkworkMcpServerCatalogGroup[];
}

export interface SdkworkMcpServerDescriptor {
  capabilities: SdkworkMcpCapabilityDescriptor[];
  description: string;
  diagnostics: SdkworkMcpDiagnostic[];
  enabled: boolean;
  groupId: string;
  groupLabel: string;
  id: string;
  label: string;
  pluginId?: string;
  readiness: SdkworkMcpServerReadiness;
  source: SdkworkMcpServerSource;
  supportedTransport: boolean;
  transport: SdkworkMcpTransportKind;
}

export interface FlattenMcpServerCatalogOptions {
  supportedTransports?: readonly SdkworkMcpTransportKind[];
}

export interface FilterMcpServerCatalogOptions {
  capability?: readonly SdkworkMcpCapabilityKind[];
  query?: string;
  readiness?: readonly SdkworkMcpServerReadiness[];
  source?: readonly SdkworkMcpServerSource[];
  transport?: readonly SdkworkMcpTransportKind[];
}

export interface CompileMcpServersForLlmOptions {
  maxServers?: number;
}

export interface SdkworkMcpServerCatalogSummary {
  diagnosticCount: number;
  readiness: Record<SdkworkMcpServerReadiness, number>;
  supportedServerIds: string[];
  unsupportedServerIds: string[];
}

export interface SdkworkMcpWorkspaceManifest extends SdkworkAppCapabilityManifest {
  capability: "mcp";
  detailRoutePattern: string;
  routePath: string;
}

export interface CreateMcpWorkspaceManifestOptions
  extends Partial<
    Pick<CreateSdkworkAppCapabilityManifestOptions, "description" | "host" | "id" | "packageNames" | "theme" | "title">
  > {
  routePath?: string;
}

export interface SdkworkMcpLibraryRouteIntent {
  capability?: SdkworkMcpCapabilityKind;
  focusWindow: boolean;
  readiness?: SdkworkMcpServerReadiness;
  route: string;
  source: "mcp-workspace";
  transport?: SdkworkMcpTransportKind;
  type: "mcp-library-route-intent";
}

export interface CreateMcpLibraryRouteIntentOptions {
  basePath?: string;
  capability?: SdkworkMcpCapabilityKind;
  focusWindow?: boolean;
  readiness?: SdkworkMcpServerReadiness;
  transport?: SdkworkMcpTransportKind;
}

export interface SdkworkMcpServerDetailRouteIntent {
  focusWindow: boolean;
  route: string;
  serverId: string;
  source: "mcp-workspace";
  type: "mcp-server-detail-route-intent";
}

export interface CreateMcpServerDetailRouteIntentOptions {
  basePath?: string;
  focusWindow?: boolean;
}

const DEFAULT_SUPPORTED_TRANSPORTS: readonly SdkworkMcpTransportKind[] = ["stdio"];
const MCP_CAPABILITY_ORDER = ["tools", "resources", "prompts"] as const;

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

function normalizeCapabilityKind(value: SdkworkMcpCapabilityKind): SdkworkMcpCapabilityKind {
  return value.trim().toLowerCase() as SdkworkMcpCapabilityKind;
}

function capabilityLabel(kind: SdkworkMcpCapabilityKind): string {
  switch (kind) {
    case "tools":
      return "Tools";
    case "resources":
      return "Resources";
    case "prompts":
      return "Prompts";
    default:
      return titleCaseIdentifier(kind);
  }
}

function normalizeCapabilityDescriptors(
  capabilities: readonly SdkworkMcpCapabilityKind[] | undefined,
): SdkworkMcpCapabilityDescriptor[] {
  const uniqueKinds = Array.from(
    new Set((capabilities ?? []).map((capability) => normalizeCapabilityKind(capability))),
  );

  return uniqueKinds
    .map((kind) => ({
      kind,
      label: capabilityLabel(kind),
    }))
    .sort((left, right) => {
      const leftIndex = MCP_CAPABILITY_ORDER.indexOf(left.kind as (typeof MCP_CAPABILITY_ORDER)[number]);
      const rightIndex = MCP_CAPABILITY_ORDER.indexOf(right.kind as (typeof MCP_CAPABILITY_ORDER)[number]);

      if (leftIndex !== -1 || rightIndex !== -1) {
        if (leftIndex === -1) {
          return 1;
        }
        if (rightIndex === -1) {
          return -1;
        }
        if (leftIndex !== rightIndex) {
          return leftIndex - rightIndex;
        }
      }

      return left.label.localeCompare(right.label);
    });
}

function inferTransportKind(
  transport: SdkworkMcpServerTransportConfig | undefined,
): SdkworkMcpTransportKind {
  const explicitType = transport?.type?.trim().toLowerCase();

  switch (explicitType) {
    case "stdio":
      return "stdio";
    case "sse":
      return "sse";
    case "http":
    case "http-stream":
    case "streamable-http":
    case "streamable_http":
      return "streamable-http";
    default:
      break;
  }

  if (transport?.command?.trim()) {
    return "stdio";
  }

  const url = transport?.url?.trim().toLowerCase();
  if (!url) {
    return "unknown";
  }

  if (url.includes("/sse") || url.includes("transport=sse")) {
    return "sse";
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return "streamable-http";
  }

  return "unknown";
}

function buildDiagnostics(params: {
  id: string;
  transport: SdkworkMcpTransportKind;
  transportConfig: SdkworkMcpServerTransportConfig | undefined;
  supportedTransports: ReadonlySet<SdkworkMcpTransportKind>;
  enabled: boolean;
}): SdkworkMcpDiagnostic[] {
  if (!params.enabled) {
    return [];
  }

  if (params.transport === "unknown") {
    return [
      {
        code: "missing-transport",
        message: `MCP server ${params.id} does not declare a command or URL transport.`,
      },
    ];
  }

  if (params.transport === "stdio" && !params.transportConfig?.command?.trim()) {
    return [
      {
        code: "missing-command",
        message: `MCP server ${params.id} declares stdio transport but does not provide a command.`,
      },
    ];
  }

  if (!params.supportedTransports.has(params.transport)) {
    return [
      {
        code: "unsupported-transport",
        message:
          `MCP server ${params.id} uses ${params.transport} transport, but the current runtime only supports: ` +
          `${[...params.supportedTransports].join(", ")}.`,
      },
    ];
  }

  return [];
}

function resolveReadiness(
  enabled: boolean,
  diagnostics: readonly SdkworkMcpDiagnostic[],
): SdkworkMcpServerReadiness {
  if (!enabled) {
    return "disabled";
  }

  if (diagnostics.some((diagnostic) => diagnostic.code === "missing-command" || diagnostic.code === "missing-transport")) {
    return "incomplete-config";
  }

  if (diagnostics.some((diagnostic) => diagnostic.code === "unsupported-transport")) {
    return "unsupported-transport";
  }

  return "ready";
}

function toUniquePackages(packageNames: readonly string[]): string[] {
  return Array.from(new Set(packageNames.map((packageName) => packageName.trim()).filter(Boolean)));
}

function searchValues(server: SdkworkMcpServerDescriptor): string[] {
  return [
    server.id,
    server.label,
    server.description,
    server.groupId,
    server.groupLabel,
    server.source,
    server.transport,
    ...server.capabilities.flatMap((capability) => [capability.kind, capability.label]),
    ...server.diagnostics.map((diagnostic) => diagnostic.message),
  ];
}

export function flattenMcpServerCatalog(
  catalog: SdkworkMcpCatalogResult,
  options: FlattenMcpServerCatalogOptions = {},
): SdkworkMcpServerDescriptor[] {
  const supportedTransports = new Set(options.supportedTransports ?? DEFAULT_SUPPORTED_TRANSPORTS);
  const descriptorMap = new Map<string, SdkworkMcpServerDescriptor>();

  for (const group of catalog.groups) {
    for (const server of group.servers) {
      if (!server.id || descriptorMap.has(server.id)) {
        continue;
      }

      const transport = inferTransportKind(server.transport);
      const enabled = server.enabled !== false;
      const diagnostics = buildDiagnostics({
        enabled,
        id: server.id,
        supportedTransports,
        transport,
        transportConfig: server.transport,
      });

      descriptorMap.set(server.id, {
        capabilities: normalizeCapabilityDescriptors(server.capabilities),
        description: server.description?.trim() || server.label?.trim() || titleCaseIdentifier(server.id),
        diagnostics,
        enabled,
        groupId: group.id,
        groupLabel: group.label,
        id: server.id,
        label: server.label?.trim() || titleCaseIdentifier(server.id),
        ...(server.pluginId ?? group.pluginId ? { pluginId: server.pluginId ?? group.pluginId } : {}),
        readiness: resolveReadiness(enabled, diagnostics),
        source: server.source ?? group.source,
        supportedTransport: transport !== "unknown" && supportedTransports.has(transport),
        transport,
      });
    }
  }

  return [...descriptorMap.values()].sort((left, right) => left.label.localeCompare(right.label));
}

export function filterMcpServerCatalog(
  servers: readonly SdkworkMcpServerDescriptor[],
  options: FilterMcpServerCatalogOptions = {},
): SdkworkMcpServerDescriptor[] {
  const capability = options.capability ? new Set(options.capability.map(normalizeCapabilityKind)) : null;
  const readiness = options.readiness ? new Set(options.readiness) : null;
  const source = options.source ? new Set(options.source) : null;
  const transport = options.transport ? new Set(options.transport) : null;
  const query = normalizeQuery(options.query);

  return [...servers]
    .filter((server) =>
      capability
        ? server.capabilities.some((descriptor) => capability.has(descriptor.kind))
        : true,
    )
    .filter((server) => (readiness ? readiness.has(server.readiness) : true))
    .filter((server) => (source ? source.has(server.source) : true))
    .filter((server) => (transport ? transport.has(server.transport) : true))
    .filter((server) =>
      query ? searchValues(server).some((value) => value.toLowerCase().includes(query)) : true,
    )
    .sort((left, right) => left.label.localeCompare(right.label));
}

export function summarizeMcpServerCatalog(
  servers: readonly SdkworkMcpServerDescriptor[],
): SdkworkMcpServerCatalogSummary {
  const readiness: Record<SdkworkMcpServerReadiness, number> = {
    disabled: 0,
    "incomplete-config": 0,
    ready: 0,
    "unsupported-transport": 0,
  };
  const supportedServerIds: string[] = [];
  const unsupportedServerIds: string[] = [];
  let diagnosticCount = 0;

  for (const server of servers) {
    readiness[server.readiness] += 1;
    diagnosticCount += server.diagnostics.length;

    if (server.readiness === "ready") {
      supportedServerIds.push(server.id);
    } else {
      unsupportedServerIds.push(server.id);
    }
  }

  supportedServerIds.sort((left, right) => left.localeCompare(right));
  unsupportedServerIds.sort((left, right) => left.localeCompare(right));

  return {
    diagnosticCount,
    readiness,
    supportedServerIds,
    unsupportedServerIds,
  };
}

export function compileMcpServersForLlm(
  servers: readonly SdkworkMcpServerDescriptor[],
  options: CompileMcpServersForLlmOptions = {},
): SdkworkLlmTool[] {
  return filterMcpServerCatalog(servers, {
    readiness: ["ready"],
  })
    .slice(0, options.maxServers ?? Number.POSITIVE_INFINITY)
    .map((server) => ({
      id: server.id,
      name: server.id,
      type: "mcp",
    }));
}

export function createMcpWorkspaceManifest({
  description = "MCP workspace for server catalogs, transport readiness, and capability-aware routing.",
  host,
  id = "sdkwork-mcp",
  packageNames = ["@sdkwork/mcp-pc-react", "@sdkwork/llm-pc-react"],
  routePath = "/mcp",
  theme,
  title = "MCP",
}: CreateMcpWorkspaceManifestOptions = {}): SdkworkMcpWorkspaceManifest {
  return {
    ...createSdkworkAppCapabilityManifest({
      description,
      host,
      id,
      packageNames: toUniquePackages(packageNames),
      theme,
      title,
    }),
    capability: "mcp",
    detailRoutePattern: `${routePath}/:serverId`,
    routePath,
  };
}

export function createMcpLibraryRouteIntent(
  options: CreateMcpLibraryRouteIntentOptions = {},
): SdkworkMcpLibraryRouteIntent {
  const queryParams = new URLSearchParams();

  if (options.capability) {
    queryParams.set("capability", options.capability);
  }

  if (options.transport) {
    queryParams.set("transport", options.transport);
  }

  if (options.readiness) {
    queryParams.set("readiness", options.readiness);
  }

  const querySuffix = queryParams.toString() ? `?${queryParams.toString()}` : "";

  return {
    ...(options.capability ? { capability: options.capability } : {}),
    focusWindow: options.focusWindow !== false,
    ...(options.readiness ? { readiness: options.readiness } : {}),
    route: `${options.basePath ?? "/mcp"}${querySuffix}`,
    source: "mcp-workspace",
    ...(options.transport ? { transport: options.transport } : {}),
    type: "mcp-library-route-intent",
  };
}

export function createMcpServerDetailRouteIntent(
  serverId: string,
  options: CreateMcpServerDetailRouteIntentOptions = {},
): SdkworkMcpServerDetailRouteIntent {
  return {
    focusWindow: options.focusWindow !== false,
    route: `${options.basePath ?? "/mcp"}/${serverId}`,
    serverId,
    source: "mcp-workspace",
    type: "mcp-server-detail-route-intent",
  };
}

export const mcpPackageMeta = {
  architecture: "pc-react",
  domain: "intelligence",
  package: "@sdkwork/mcp-pc-react",
  status: "ready",
} as const;

export type McpPackageMeta = typeof mcpPackageMeta;
