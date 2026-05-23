import {
  createSdkworkAppCapabilityManifest,
  type CreateSdkworkAppCapabilityManifestOptions,
  type SdkworkAppCapabilityManifest,
} from "@sdkwork/appbase-pc-react";

export type SdkworkPluginKind = "extension" | "plugin";
export type SdkworkPluginSourceKind = "bundled" | "local" | "market" | "private";
export type SdkworkPluginInstallState = "disabled" | "installed" | "not-installed" | "update-available";
export type SdkworkPluginHealth = "blocked" | "degraded" | "healthy";
export type SdkworkPluginRiskLevel = "high" | "low" | "medium";
export type SdkworkPluginCompatibility = "compatible" | "incompatible" | "partial";
export type SdkworkPluginPermissionReadiness = "missing" | "ready" | "review";
export type SdkworkPluginSortBy = "name" | "readiness" | "risk" | "updated";
export type SdkworkPluginAction = "disable" | "enable" | "install" | "open" | "uninstall" | "update";

export interface SdkworkPluginWorkspaceManifest extends SdkworkAppCapabilityManifest {
  capability: "plugin";
  routePath: string;
}

export interface CreatePluginWorkspaceManifestOptions
  extends Partial<
    Pick<CreateSdkworkAppCapabilityManifestOptions, "description" | "host" | "id" | "packageNames" | "theme" | "title">
  > {
  routePath?: string;
}

export interface SdkworkPluginRouteIntent {
  focusWindow: boolean;
  installState?: SdkworkPluginInstallState;
  pluginId?: string;
  route: string;
  source: "plugin-workspace";
  sourceKind?: SdkworkPluginSourceKind;
  type: "plugin-route-intent";
}

export interface CreatePluginRouteIntentOptions {
  basePath?: string;
  focusWindow?: boolean;
  installState?: SdkworkPluginInstallState;
  pluginId?: string;
  sourceKind?: SdkworkPluginSourceKind;
}

export interface SdkworkPluginActionRouteIntent {
  action: SdkworkPluginAction;
  focusWindow: boolean;
  pluginId: string;
  route: string;
  source: "plugin-workspace";
  type: "plugin-action-route-intent";
}

export interface CreatePluginActionRouteIntentOptions {
  action: SdkworkPluginAction;
  basePath?: string;
  focusWindow?: boolean;
  pluginId: string;
}

export interface SdkworkPluginPermission {
  granted: boolean;
  id: string;
  required: boolean;
}

export interface SdkworkPlugin {
  author: string;
  compatibility: SdkworkPluginCompatibility;
  description: string;
  health: SdkworkPluginHealth;
  id: string;
  installRoute: string;
  installState: SdkworkPluginInstallState;
  kind: SdkworkPluginKind;
  lastUpdatedAt: string;
  name: string;
  permissions: SdkworkPluginPermission[];
  permissionReadiness: SdkworkPluginPermissionReadiness;
  riskLevel: SdkworkPluginRiskLevel;
  route: string;
  sourceKind: SdkworkPluginSourceKind;
  updateAvailable: boolean;
  version: string;
}

export interface SdkworkPluginRegistryContext {
  isAuthenticated: boolean;
  workspaceId?: string;
}

export interface SdkworkPluginFilterOption<T extends string> {
  count: number;
  id: T | "all";
  label: string;
}

export interface SdkworkPluginSortOption {
  id: SdkworkPluginSortBy;
  label: string;
}

export interface SdkworkPluginRegistryFilters {
  installStateOptions: SdkworkPluginFilterOption<SdkworkPluginInstallState>[];
  riskOptions: SdkworkPluginFilterOption<SdkworkPluginRiskLevel>[];
  sortOptions: SdkworkPluginSortOption[];
  sourceOptions: SdkworkPluginFilterOption<SdkworkPluginSourceKind>[];
}

export interface SdkworkPluginRegistrySummary {
  blockedPlugins: number;
  highRiskPlugins: number;
  installedPlugins: number;
  pluginCount: number;
  readyPlugins: number;
  updatesAvailable: number;
}

export interface SdkworkPluginRegistryData {
  context: SdkworkPluginRegistryContext;
  filters: SdkworkPluginRegistryFilters;
  plugins: SdkworkPlugin[];
  summary: SdkworkPluginRegistrySummary;
}

export interface CreateEmptySdkworkPluginRegistryOptions {
  context?: Partial<SdkworkPluginRegistryContext>;
  plugins?: readonly SdkworkPlugin[];
}

export interface FilterSdkworkPluginsOptions {
  activeInstallState: SdkworkPluginInstallState | "all";
  activeRiskLevel: SdkworkPluginRiskLevel | "all";
  activeSourceKind: SdkworkPluginSourceKind | "all";
  query: string;
  sortBy: SdkworkPluginSortBy;
}

const SOURCE_LABELS: Record<SdkworkPluginSourceKind, string> = {
  bundled: "Bundled",
  local: "Local",
  market: "Market",
  private: "Private",
};

const INSTALL_STATE_LABELS: Record<SdkworkPluginInstallState, string> = {
  disabled: "Disabled",
  installed: "Installed",
  "not-installed": "Not installed",
  "update-available": "Updates available",
};

const RISK_LABELS: Record<SdkworkPluginRiskLevel, string> = {
  high: "High risk",
  low: "Low risk",
  medium: "Medium risk",
};

const SORT_OPTIONS: SdkworkPluginSortOption[] = [
  {
    id: "readiness",
    label: "Readiness",
  },
  {
    id: "risk",
    label: "Risk",
  },
  {
    id: "updated",
    label: "Recently updated",
  },
  {
    id: "name",
    label: "Name",
  },
];

const INSTALL_STATE_ORDER: Record<SdkworkPluginInstallState, number> = {
  "update-available": 0,
  installed: 1,
  "not-installed": 2,
  disabled: 3,
};

const READINESS_ORDER: Record<SdkworkPluginPermissionReadiness, number> = {
  ready: 0,
  review: 1,
  missing: 2,
};

const HEALTH_ORDER: Record<SdkworkPluginHealth, number> = {
  healthy: 0,
  degraded: 1,
  blocked: 2,
};

const RISK_ORDER_SAFE_FIRST: Record<SdkworkPluginRiskLevel, number> = {
  low: 0,
  medium: 1,
  high: 2,
};

const RISK_ORDER_HIGH_FIRST: Record<SdkworkPluginRiskLevel, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

function normalizeBasePath(basePath: string | undefined, fallback: string): string {
  const normalized = (basePath ?? fallback).trim();
  if (!normalized || normalized === "/") {
    return fallback;
  }

  return normalized.endsWith("/") ? normalized.slice(0, -1) : normalized;
}

function normalizeText(value: string | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function toTimestamp(value: string): number {
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function countBy<T extends string>(
  values: readonly T[],
): Record<T, number> {
  return values.reduce<Record<T, number>>((accumulator, value) => {
    accumulator[value] = (accumulator[value] ?? 0) + 1;
    return accumulator;
  }, {} as Record<T, number>);
}

function createDefaultSdkworkPlugins(): SdkworkPlugin[] {
  return [
    {
      author: "SDKWORK",
      compatibility: "compatible",
      description: "Core bundled plugin for workspace automation and lifecycle orchestration.",
      health: "healthy",
      id: "plugin-bundled-core",
      installRoute: createPluginActionRouteIntent({
        action: "open",
        pluginId: "plugin-bundled-core",
      }).route,
      installState: "installed",
      kind: "plugin",
      lastUpdatedAt: "2026-03-10T10:00:00.000Z",
      name: "Bundled Core Plugin",
      permissions: [
        {
          granted: true,
          id: "workspace.read",
          required: true,
        },
      ],
      permissionReadiness: "ready",
      riskLevel: "low",
      route: "/plugins/plugin-bundled-core",
      sourceKind: "bundled",
      updateAvailable: false,
      version: "1.2.0",
    },
    {
      author: "SDKWORK",
      compatibility: "compatible",
      description: "Market plugin for advanced operations and release workflows.",
      health: "healthy",
      id: "plugin-market-ops",
      installRoute: createPluginActionRouteIntent({
        action: "install",
        pluginId: "plugin-market-ops",
      }).route,
      installState: "update-available",
      kind: "plugin",
      lastUpdatedAt: "2026-03-18T10:00:00.000Z",
      name: "Market Ops Plugin",
      permissions: [
        {
          granted: true,
          id: "workspace.write",
          required: true,
        },
      ],
      permissionReadiness: "ready",
      riskLevel: "medium",
      route: "/plugins/plugin-market-ops",
      sourceKind: "market",
      updateAvailable: true,
      version: "1.6.0",
    },
    {
      author: "SDKWORK",
      compatibility: "partial",
      description: "Private compliance plugin that requires elevated permissions before activation.",
      health: "degraded",
      id: "plugin-private-audit",
      installRoute: createPluginActionRouteIntent({
        action: "install",
        pluginId: "plugin-private-audit",
      }).route,
      installState: "not-installed",
      kind: "plugin",
      lastUpdatedAt: "2026-02-10T10:00:00.000Z",
      name: "Private Audit Plugin",
      permissions: [
        {
          granted: false,
          id: "workspace.admin",
          required: true,
        },
      ],
      permissionReadiness: "review",
      riskLevel: "high",
      route: "/plugins/plugin-private-audit",
      sourceKind: "private",
      updateAvailable: false,
      version: "0.8.1",
    },
    {
      author: "SDKWORK",
      compatibility: "incompatible",
      description: "Legacy local extension that stays disabled until host compatibility is resolved.",
      health: "blocked",
      id: "plugin-local-legacy",
      installRoute: createPluginActionRouteIntent({
        action: "enable",
        pluginId: "plugin-local-legacy",
      }).route,
      installState: "disabled",
      kind: "extension",
      lastUpdatedAt: "2025-12-21T08:00:00.000Z",
      name: "Local Legacy Extension",
      permissions: [
        {
          granted: false,
          id: "host.native",
          required: true,
        },
      ],
      permissionReadiness: "missing",
      riskLevel: "high",
      route: "/plugins/plugin-local-legacy",
      sourceKind: "local",
      updateAvailable: false,
      version: "0.4.2",
    },
  ];
}

function buildSourceOptions(
  plugins: readonly SdkworkPlugin[],
): SdkworkPluginFilterOption<SdkworkPluginSourceKind>[] {
  const counts = countBy(plugins.map((plugin) => plugin.sourceKind));
  const keys: SdkworkPluginSourceKind[] = ["bundled", "market", "private", "local"];

  return [
    {
      count: plugins.length,
      id: "all",
      label: "All sources",
    },
    ...keys.filter((key) => (counts[key] ?? 0) > 0).map((key) => ({
      count: counts[key] ?? 0,
      id: key,
      label: SOURCE_LABELS[key],
    })),
  ];
}

function buildInstallStateOptions(
  plugins: readonly SdkworkPlugin[],
): SdkworkPluginFilterOption<SdkworkPluginInstallState>[] {
  const counts = countBy(plugins.map((plugin) => plugin.installState));
  const keys: SdkworkPluginInstallState[] = ["installed", "update-available", "not-installed", "disabled"];

  return [
    {
      count: plugins.length,
      id: "all",
      label: "All states",
    },
    ...keys.filter((key) => (counts[key] ?? 0) > 0).map((key) => ({
      count: counts[key] ?? 0,
      id: key,
      label: INSTALL_STATE_LABELS[key],
    })),
  ];
}

function buildRiskOptions(
  plugins: readonly SdkworkPlugin[],
): SdkworkPluginFilterOption<SdkworkPluginRiskLevel>[] {
  const counts = countBy(plugins.map((plugin) => plugin.riskLevel));
  const keys: SdkworkPluginRiskLevel[] = ["low", "medium", "high"];

  return [
    {
      count: plugins.length,
      id: "all",
      label: "All risks",
    },
    ...keys.filter((key) => (counts[key] ?? 0) > 0).map((key) => ({
      count: counts[key] ?? 0,
      id: key,
      label: RISK_LABELS[key],
    })),
  ];
}

export function sortSdkworkPlugins(
  plugins: readonly SdkworkPlugin[],
  sortBy: SdkworkPluginSortBy = "readiness",
): SdkworkPlugin[] {
  return [...plugins].sort((left, right) => {
    if (sortBy === "name") {
      return left.name.localeCompare(right.name);
    }

    if (sortBy === "updated") {
      return toTimestamp(right.lastUpdatedAt) - toTimestamp(left.lastUpdatedAt)
        || left.name.localeCompare(right.name);
    }

    if (sortBy === "risk") {
      return (RISK_ORDER_HIGH_FIRST[left.riskLevel] ?? Number.MAX_SAFE_INTEGER)
        - (RISK_ORDER_HIGH_FIRST[right.riskLevel] ?? Number.MAX_SAFE_INTEGER)
        || (HEALTH_ORDER[left.health] ?? Number.MAX_SAFE_INTEGER)
        - (HEALTH_ORDER[right.health] ?? Number.MAX_SAFE_INTEGER)
        || left.name.localeCompare(right.name);
    }

    return (INSTALL_STATE_ORDER[left.installState] ?? Number.MAX_SAFE_INTEGER)
      - (INSTALL_STATE_ORDER[right.installState] ?? Number.MAX_SAFE_INTEGER)
      || (READINESS_ORDER[left.permissionReadiness] ?? Number.MAX_SAFE_INTEGER)
      - (READINESS_ORDER[right.permissionReadiness] ?? Number.MAX_SAFE_INTEGER)
      || (HEALTH_ORDER[left.health] ?? Number.MAX_SAFE_INTEGER)
      - (HEALTH_ORDER[right.health] ?? Number.MAX_SAFE_INTEGER)
      || (RISK_ORDER_SAFE_FIRST[left.riskLevel] ?? Number.MAX_SAFE_INTEGER)
      - (RISK_ORDER_SAFE_FIRST[right.riskLevel] ?? Number.MAX_SAFE_INTEGER)
      || toTimestamp(right.lastUpdatedAt) - toTimestamp(left.lastUpdatedAt)
      || left.name.localeCompare(right.name);
  });
}

export function filterSdkworkPlugins(
  plugins: readonly SdkworkPlugin[],
  options: FilterSdkworkPluginsOptions,
): SdkworkPlugin[] {
  const query = normalizeText(options.query);
  const filtered = plugins.filter((plugin) => {
    if (options.activeSourceKind !== "all" && plugin.sourceKind !== options.activeSourceKind) {
      return false;
    }

    if (options.activeInstallState !== "all" && plugin.installState !== options.activeInstallState) {
      return false;
    }

    if (options.activeRiskLevel !== "all" && plugin.riskLevel !== options.activeRiskLevel) {
      return false;
    }

    if (!query) {
      return true;
    }

    const keywordFields = [
      plugin.id,
      plugin.name,
      plugin.description,
      plugin.author,
      ...plugin.permissions.map((permission) => permission.id),
    ];

    return keywordFields.some((value) => normalizeText(value).includes(query));
  });

  return sortSdkworkPlugins(filtered, options.sortBy);
}

export function summarizeSdkworkPlugins(
  plugins: readonly SdkworkPlugin[],
): SdkworkPluginRegistrySummary {
  return plugins.reduce<SdkworkPluginRegistrySummary>(
    (summary, plugin) => {
      summary.pluginCount += 1;

      if (plugin.installState === "installed" || plugin.installState === "update-available") {
        summary.installedPlugins += 1;
      }

      if (plugin.updateAvailable || plugin.installState === "update-available") {
        summary.updatesAvailable += 1;
      }

      if (plugin.riskLevel === "high") {
        summary.highRiskPlugins += 1;
      }

      if (plugin.health === "blocked") {
        summary.blockedPlugins += 1;
      }

      if (
        plugin.permissionReadiness === "ready"
        && plugin.health !== "blocked"
        && plugin.compatibility !== "incompatible"
      ) {
        summary.readyPlugins += 1;
      }

      return summary;
    },
    {
      blockedPlugins: 0,
      highRiskPlugins: 0,
      installedPlugins: 0,
      pluginCount: 0,
      readyPlugins: 0,
      updatesAvailable: 0,
    },
  );
}

export function createEmptySdkworkPluginRegistry(
  options: CreateEmptySdkworkPluginRegistryOptions = {},
): SdkworkPluginRegistryData {
  const plugins = options.plugins?.length
    ? sortSdkworkPlugins(options.plugins, "readiness")
    : sortSdkworkPlugins(createDefaultSdkworkPlugins(), "readiness");

  return {
    context: {
      isAuthenticated: false,
      ...options.context,
    },
    filters: {
      installStateOptions: buildInstallStateOptions(plugins),
      riskOptions: buildRiskOptions(plugins),
      sortOptions: SORT_OPTIONS,
      sourceOptions: buildSourceOptions(plugins),
    },
    plugins,
    summary: summarizeSdkworkPlugins(plugins),
  };
}

export function createPluginWorkspaceManifest({
  description = "Plugin lifecycle center for extension registry visibility, compatibility and risk posture, and operational route intents.",
  host,
  id = "sdkwork-plugin",
  packageNames = [
    "@sdkwork/plugin-pc-react",
    "@sdkwork/market-pc-react",
    "@sdkwork/permission-pc-react",
    "@sdkwork/apps-pc-react",
  ],
  routePath = "/plugins",
  theme,
  title = "Plugin Center",
}: CreatePluginWorkspaceManifestOptions = {}): SdkworkPluginWorkspaceManifest {
  return {
    ...createSdkworkAppCapabilityManifest({
      description,
      host,
      id,
      packageNames,
      theme,
      title,
    }),
    capability: "plugin",
    routePath: normalizeBasePath(routePath, "/plugins"),
  };
}

export function createPluginRouteIntent(
  options: CreatePluginRouteIntentOptions = {},
): SdkworkPluginRouteIntent {
  const basePath = normalizeBasePath(options.basePath, "/plugins");
  const queryParams = new URLSearchParams();

  if (options.sourceKind) {
    queryParams.set("source", options.sourceKind);
  }

  if (options.installState) {
    queryParams.set("installState", options.installState);
  }

  if (options.pluginId) {
    queryParams.set("pluginId", options.pluginId);
  }

  const querySuffix = queryParams.toString() ? `?${queryParams.toString()}` : "";

  return {
    focusWindow: options.focusWindow !== false,
    ...(options.installState ? { installState: options.installState } : {}),
    ...(options.pluginId ? { pluginId: options.pluginId } : {}),
    route: `${basePath}${querySuffix}`,
    source: "plugin-workspace",
    ...(options.sourceKind ? { sourceKind: options.sourceKind } : {}),
    type: "plugin-route-intent",
  };
}

export function createPluginActionRouteIntent(
  options: CreatePluginActionRouteIntentOptions,
): SdkworkPluginActionRouteIntent {
  const basePath = normalizeBasePath(options.basePath, "/plugins/action");
  const queryParams = new URLSearchParams();
  queryParams.set("action", options.action);
  queryParams.set("pluginId", options.pluginId);

  return {
    action: options.action,
    focusWindow: options.focusWindow !== false,
    pluginId: options.pluginId,
    route: `${basePath}?${queryParams.toString()}`,
    source: "plugin-workspace",
    type: "plugin-action-route-intent",
  };
}

export const pluginPackageMeta = {
  architecture: "pc-react",
  domain: "ecosystem",
  package: "@sdkwork/plugin-pc-react",
  status: "ready",
} as const;

export type PluginPackageMeta = typeof pluginPackageMeta;
