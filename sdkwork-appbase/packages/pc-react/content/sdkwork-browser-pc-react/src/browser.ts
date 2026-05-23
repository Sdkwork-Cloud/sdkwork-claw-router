export type SdkworkBrowserSafeMode = "balanced" | "open" | "strict";
export type SdkworkBrowserSessionPosture = "offline" | "review" | "secure";
export type SdkworkBrowserPermissionReadiness = "blocked" | "ready" | "review";
export type SdkworkBrowserGroupTrustLevel = "blocked" | "review" | "trusted";
export type SdkworkBrowserSortBy = "activity" | "name" | "posture";

export interface SdkworkBrowserPermission {
  granted: boolean;
  id: string;
  required: boolean;
}

export interface SdkworkBrowserTab {
  active: boolean;
  groupId: string;
  id: string;
  lastVisitedAt: string;
  permissionReadiness: SdkworkBrowserPermissionReadiness;
  permissions: SdkworkBrowserPermission[];
  pinned: boolean;
  posture: SdkworkBrowserSessionPosture;
  route: string;
  safeMode: SdkworkBrowserSafeMode;
  title: string;
  url: string;
}

export interface SdkworkBrowserSiteGroup {
  description: string;
  domains: string[];
  id: string;
  title: string;
  trustLevel: SdkworkBrowserGroupTrustLevel;
}

export interface SdkworkBrowserWorkspaceContext {
  isAuthenticated: boolean;
  workspaceId?: string;
}

export interface SdkworkBrowserSessionPolicy {
  defaultSafeMode: SdkworkBrowserSafeMode;
  permissionGuardEnabled: boolean;
  posture: SdkworkBrowserSessionPosture;
}

export interface SdkworkBrowserFilterOption<T extends string> {
  count: number;
  id: T | "all";
  label: string;
}

export interface SdkworkBrowserSortOption {
  id: SdkworkBrowserSortBy;
  label: string;
}

export interface SdkworkBrowserWorkspaceFilters {
  groupOptions: SdkworkBrowserFilterOption<string>[];
  safeModeOptions: SdkworkBrowserFilterOption<SdkworkBrowserSafeMode>[];
  sortOptions: SdkworkBrowserSortOption[];
}

export interface SdkworkBrowserWorkspaceSummary {
  activeTabs: number;
  blockedTabs: number;
  groupCount: number;
  pinnedTabs: number;
  reviewTabs: number;
  strictModeTabs: number;
  tabCount: number;
}

export interface SdkworkBrowserWorkspaceData {
  context: SdkworkBrowserWorkspaceContext;
  filters: SdkworkBrowserWorkspaceFilters;
  groups: SdkworkBrowserSiteGroup[];
  policy: SdkworkBrowserSessionPolicy;
  summary: SdkworkBrowserWorkspaceSummary;
  tabs: SdkworkBrowserTab[];
}

export interface SdkworkBrowserCapabilityManifest {
  description: string;
  host?: string;
  id: string;
  packageNames: string[];
  theme?: string;
  title: string;
}

export interface SdkworkBrowserWorkspaceManifest extends SdkworkBrowserCapabilityManifest {
  capability: "browser";
  routePath: string;
}

export interface CreateBrowserWorkspaceManifestOptions
  extends Partial<
    Pick<SdkworkBrowserCapabilityManifest, "description" | "host" | "id" | "packageNames" | "theme" | "title">
  > {
  routePath?: string;
}

export interface SdkworkBrowserRouteIntent {
  focusWindow: boolean;
  groupId?: string;
  route: string;
  safeMode?: SdkworkBrowserSafeMode;
  source: "browser-workspace";
  tabId?: string;
  type: "browser-route-intent";
}

export interface CreateBrowserRouteIntentOptions {
  basePath?: string;
  focusWindow?: boolean;
  groupId?: string;
  safeMode?: SdkworkBrowserSafeMode;
  tabId?: string;
}

export interface CreateEmptySdkworkBrowserWorkspaceOptions {
  context?: Partial<SdkworkBrowserWorkspaceContext>;
  groups?: readonly SdkworkBrowserSiteGroup[];
  policy?: Partial<SdkworkBrowserSessionPolicy>;
  tabs?: readonly SdkworkBrowserTab[];
}

export interface FilterSdkworkBrowserTabsOptions {
  activeGroupId: string;
  activeSafeMode: SdkworkBrowserSafeMode | "all";
  query: string;
  sortBy: SdkworkBrowserSortBy;
}

const SORT_OPTIONS: SdkworkBrowserSortOption[] = [
  {
    id: "activity",
    label: "Activity",
  },
  {
    id: "posture",
    label: "Posture",
  },
  {
    id: "name",
    label: "Name",
  },
];

const SAFE_MODE_LABELS: Record<SdkworkBrowserSafeMode, string> = {
  balanced: "Balanced",
  open: "Open",
  strict: "Strict",
};

const POSTURE_ORDER: Record<SdkworkBrowserSessionPosture, number> = {
  secure: 0,
  review: 1,
  offline: 2,
};

const SAFE_MODE_ORDER: Record<SdkworkBrowserSafeMode, number> = {
  strict: 0,
  balanced: 1,
  open: 2,
};

function normalizeBasePath(basePath: string | undefined): string {
  const normalized = (basePath ?? "/browser").trim();
  if (!normalized || normalized === "/") {
    return "/browser";
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

function toTitleCase(value: string): string {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function countBy<T extends string>(
  values: readonly T[],
): Record<T, number> {
  return values.reduce<Record<T, number>>((accumulator, value) => {
    accumulator[value] = (accumulator[value] ?? 0) + 1;
    return accumulator;
  }, {} as Record<T, number>);
}

export function createDefaultSdkworkBrowserGroups(): SdkworkBrowserSiteGroup[] {
  return [
    {
      description: "Trusted product docs and first-party references.",
      domains: ["docs.sdkwork.local", "platform.sdkwork.local"],
      id: "docs",
      title: "Documentation",
      trustLevel: "trusted",
    },
    {
      description: "Operational consoles with write-capable permissions.",
      domains: ["ops.sdkwork.local", "deploy.sdkwork.local"],
      id: "operations",
      title: "Operations",
      trustLevel: "review",
    },
    {
      description: "External links that stay in stricter posture by default.",
      domains: ["example.org", "news.example.org"],
      id: "external",
      title: "External",
      trustLevel: "blocked",
    },
  ];
}

export function createDefaultSdkworkBrowserTabs(): SdkworkBrowserTab[] {
  return [
    {
      active: true,
      groupId: "docs",
      id: "tab-platform-docs",
      lastVisitedAt: "2026-04-03T09:00:00.000Z",
      permissionReadiness: "ready",
      permissions: [
        {
          granted: true,
          id: "clipboard.read",
          required: false,
        },
      ],
      pinned: true,
      posture: "secure",
      route: "/browser?tabId=tab-platform-docs",
      safeMode: "strict",
      title: "Platform Docs",
      url: "https://docs.sdkwork.local/platform",
    },
    {
      active: false,
      groupId: "operations",
      id: "tab-release-console",
      lastVisitedAt: "2026-04-03T08:20:00.000Z",
      permissionReadiness: "review",
      permissions: [
        {
          granted: true,
          id: "cookie.store",
          required: true,
        },
        {
          granted: false,
          id: "clipboard.write",
          required: true,
        },
      ],
      pinned: false,
      posture: "review",
      route: "/browser?tabId=tab-release-console",
      safeMode: "balanced",
      title: "Release Console",
      url: "https://ops.sdkwork.local/releases",
    },
    {
      active: false,
      groupId: "external",
      id: "tab-external-reference",
      lastVisitedAt: "2026-04-02T18:10:00.000Z",
      permissionReadiness: "blocked",
      permissions: [
        {
          granted: false,
          id: "window.open",
          required: true,
        },
      ],
      pinned: false,
      posture: "offline",
      route: "/browser?tabId=tab-external-reference",
      safeMode: "strict",
      title: "External Reference",
      url: "https://example.org/reference",
    },
    {
      active: false,
      groupId: "docs",
      id: "tab-api-guides",
      lastVisitedAt: "2026-04-01T10:00:00.000Z",
      permissionReadiness: "ready",
      permissions: [],
      pinned: true,
      posture: "secure",
      route: "/browser?tabId=tab-api-guides",
      safeMode: "balanced",
      title: "API Guides",
      url: "https://docs.sdkwork.local/api-guides",
    },
  ];
}

export function sortSdkworkBrowserTabs(
  tabs: readonly SdkworkBrowserTab[],
  sortBy: SdkworkBrowserSortBy = "activity",
): SdkworkBrowserTab[] {
  return [...tabs].sort((left, right) => {
    if (sortBy === "name") {
      return left.title.localeCompare(right.title);
    }

    if (sortBy === "posture") {
      return (POSTURE_ORDER[left.posture] ?? Number.MAX_SAFE_INTEGER)
        - (POSTURE_ORDER[right.posture] ?? Number.MAX_SAFE_INTEGER)
        || (SAFE_MODE_ORDER[left.safeMode] ?? Number.MAX_SAFE_INTEGER)
        - (SAFE_MODE_ORDER[right.safeMode] ?? Number.MAX_SAFE_INTEGER)
        || left.title.localeCompare(right.title);
    }

    return Number(right.pinned) - Number(left.pinned)
      || Number(right.active) - Number(left.active)
      || (POSTURE_ORDER[left.posture] ?? Number.MAX_SAFE_INTEGER)
        - (POSTURE_ORDER[right.posture] ?? Number.MAX_SAFE_INTEGER)
      || toTimestamp(right.lastVisitedAt) - toTimestamp(left.lastVisitedAt)
      || left.title.localeCompare(right.title);
  });
}

export function filterSdkworkBrowserTabs(
  tabs: readonly SdkworkBrowserTab[],
  options: FilterSdkworkBrowserTabsOptions,
): SdkworkBrowserTab[] {
  const query = normalizeText(options.query);
  const filtered = tabs.filter((tab) => {
    if (options.activeGroupId !== "all" && tab.groupId !== options.activeGroupId) {
      return false;
    }

    if (options.activeSafeMode !== "all" && tab.safeMode !== options.activeSafeMode) {
      return false;
    }

    if (!query) {
      return true;
    }

    const fields = [
      tab.id,
      tab.title,
      tab.url,
      tab.groupId,
      ...tab.permissions.map((permission) => permission.id),
    ];
    return fields.some((value) => normalizeText(value).includes(query));
  });

  return sortSdkworkBrowserTabs(filtered, options.sortBy);
}

function buildGroupOptions(
  tabs: readonly SdkworkBrowserTab[],
  groups: readonly SdkworkBrowserSiteGroup[],
): SdkworkBrowserFilterOption<string>[] {
  const counts = countBy(tabs.map((tab) => tab.groupId));
  const knownGroupMap = new Map(groups.map((group) => [group.id, group.title]));
  const keys = Object.keys(counts).sort((left, right) => (counts[right] ?? 0) - (counts[left] ?? 0) || left.localeCompare(right));

  return [
    {
      count: tabs.length,
      id: "all",
      label: "All groups",
    },
    ...keys.map((key) => ({
      count: counts[key] ?? 0,
      id: key,
      label: knownGroupMap.get(key) ?? toTitleCase(key),
    })),
  ];
}

function buildSafeModeOptions(
  tabs: readonly SdkworkBrowserTab[],
): SdkworkBrowserFilterOption<SdkworkBrowserSafeMode>[] {
  const counts = countBy(tabs.map((tab) => tab.safeMode));
  const keys: SdkworkBrowserSafeMode[] = ["strict", "balanced", "open"];

  return [
    {
      count: tabs.length,
      id: "all",
      label: "All modes",
    },
    ...keys.filter((key) => (counts[key] ?? 0) > 0).map((key) => ({
      count: counts[key] ?? 0,
      id: key,
      label: SAFE_MODE_LABELS[key],
    })),
  ];
}

export function summarizeSdkworkBrowserWorkspace(
  tabs: readonly SdkworkBrowserTab[],
  groups: readonly SdkworkBrowserSiteGroup[],
): SdkworkBrowserWorkspaceSummary {
  return tabs.reduce<SdkworkBrowserWorkspaceSummary>(
    (summary, tab) => {
      summary.tabCount += 1;
      if (tab.active) {
        summary.activeTabs += 1;
      }
      if (tab.pinned) {
        summary.pinnedTabs += 1;
      }
      if (tab.permissionReadiness === "blocked") {
        summary.blockedTabs += 1;
      }
      if (tab.permissionReadiness === "review") {
        summary.reviewTabs += 1;
      }
      if (tab.safeMode === "strict") {
        summary.strictModeTabs += 1;
      }
      return summary;
    },
    {
      activeTabs: 0,
      blockedTabs: 0,
      groupCount: groups.length,
      pinnedTabs: 0,
      reviewTabs: 0,
      strictModeTabs: 0,
      tabCount: 0,
    },
  );
}

export function createEmptySdkworkBrowserWorkspace(
  options: CreateEmptySdkworkBrowserWorkspaceOptions = {},
): SdkworkBrowserWorkspaceData {
  const groups = options.groups?.length ? [...options.groups] : createDefaultSdkworkBrowserGroups();
  const tabs = options.tabs?.length
    ? sortSdkworkBrowserTabs(options.tabs, "activity")
    : sortSdkworkBrowserTabs(createDefaultSdkworkBrowserTabs(), "activity");

  return {
    context: {
      isAuthenticated: false,
      ...options.context,
    },
    filters: {
      groupOptions: buildGroupOptions(tabs, groups),
      safeModeOptions: buildSafeModeOptions(tabs),
      sortOptions: SORT_OPTIONS,
    },
    groups,
    policy: {
      defaultSafeMode: "strict",
      permissionGuardEnabled: true,
      posture: "secure",
      ...options.policy,
    },
    summary: summarizeSdkworkBrowserWorkspace(tabs, groups),
    tabs,
  };
}

export function createBrowserWorkspaceManifest({
  description = "Browser capability for workspace tabs, grouped sites, and safe-mode permission posture routing.",
  host,
  id = "sdkwork-browser",
  packageNames = [
    "@sdkwork/browser-pc-react",
    "@sdkwork/terminal-pc-react",
    "@sdkwork/canvas-pc-react",
  ],
  routePath = "/browser",
  theme,
  title = "Browser Workspace",
}: CreateBrowserWorkspaceManifestOptions = {}): SdkworkBrowserWorkspaceManifest {
  return {
    capability: "browser",
    description,
    ...(host ? { host } : {}),
    id,
    packageNames: [...packageNames],
    routePath: normalizeBasePath(routePath),
    ...(theme ? { theme } : {}),
    title,
  };
}

export function createBrowserRouteIntent(
  options: CreateBrowserRouteIntentOptions = {},
): SdkworkBrowserRouteIntent {
  const basePath = normalizeBasePath(options.basePath);
  const queryParams = new URLSearchParams();

  if (options.groupId) {
    queryParams.set("groupId", options.groupId);
  }
  if (options.safeMode) {
    queryParams.set("safeMode", options.safeMode);
  }
  if (options.tabId) {
    queryParams.set("tabId", options.tabId);
  }

  return {
    focusWindow: options.focusWindow !== false,
    ...(options.groupId ? { groupId: options.groupId } : {}),
    route: queryParams.toString() ? `${basePath}?${queryParams.toString()}` : basePath,
    ...(options.safeMode ? { safeMode: options.safeMode } : {}),
    source: "browser-workspace",
    ...(options.tabId ? { tabId: options.tabId } : {}),
    type: "browser-route-intent",
  };
}

export const browserPackageMeta = {
  architecture: "pc-react",
  domain: "content",
  package: "@sdkwork/browser-pc-react",
  status: "ready",
} as const;

export type BrowserPackageMeta = typeof browserPackageMeta;
