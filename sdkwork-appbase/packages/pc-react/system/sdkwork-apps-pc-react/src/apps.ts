import {
  createSdkworkAppCapabilityManifest,
  type CreateSdkworkAppCapabilityManifestOptions,
  type SdkworkAppCapabilityManifest,
} from "@sdkwork/appbase-pc-react";

export type SdkworkAppInstallState = "attention" | "installed" | "ready" | "unknown";

export interface SdkworkAppCatalogEntry {
  category: string;
  description?: string;
  developer: string;
  id: string;
  installSummary?: string;
  installTags?: readonly string[];
  installable?: boolean;
  name: string;
  supportedHostLabels?: readonly string[];
}

export interface SdkworkAppCatalogCategory {
  apps: readonly SdkworkAppCatalogEntry[];
  title: string;
}

export interface SdkworkAppInstallSurfaceSummary {
  appId: string;
  blockingIssueCount: number;
  dependencyAttentionCount: number;
  ready: boolean;
  state: Exclude<SdkworkAppInstallState, "unknown">;
  warningIssueCount: number;
}

export interface SdkworkAppUsageRecord {
  appId: string;
  lastOpenedAt?: string;
  launchCount: number;
  pinned?: boolean;
}

export interface SdkworkAppsOverview {
  attentionApps: number;
  installableApps: number;
  installedApps: number;
  readyApps: number;
  totalApps: number;
  totalCategories: number;
}

export interface SdkworkAppsLauncherEntry {
  appId: string;
  lastOpenedAt?: string;
  launchCount: number;
  pinned: boolean;
  reason: "install-state" | "pinned" | "recent" | "suggested";
  state: SdkworkAppInstallState;
}

export interface BuildAppsLauncherEntriesOptions {
  installSurfaceById?: Record<string, SdkworkAppInstallSurfaceSummary | undefined>;
  limit?: number;
  usageRecords?: readonly SdkworkAppUsageRecord[];
}

export interface SdkworkAppsMetadataField {
  id: "defaultSoftwareName" | "registry" | "selectedSoftwareName" | "supportedHosts";
  value: string;
}

export interface CreateAppsMetadataFieldsOptions {
  defaultSoftwareName?: string | null;
  registryName?: string | null;
  selectedSoftwareName?: string | null;
  supportedHostLabels?: readonly string[];
}

export type SdkworkAppCatalogDigestStatus =
  | "attention"
  | "current"
  | "installable"
  | "installed"
  | "ready"
  | "restricted";

export interface CreateAppCatalogDigestOptions {
  activeCategory?: string;
  activeState?: SdkworkAppInstallState;
  basePath?: string;
  currentAppId?: string;
  hostLabel?: string;
  installSurfaceById?: Record<string, SdkworkAppInstallSurfaceSummary | undefined>;
  usageRecords?: readonly SdkworkAppUsageRecord[];
}

export interface SdkworkAppCatalogDigest {
  appId: string;
  blockingIssueCount: number;
  category: string;
  dependencyAttentionCount: number;
  developer: string;
  digestStatus: SdkworkAppCatalogDigestStatus;
  isAvailable: boolean;
  isCompatibleHost: boolean;
  isCurrent: boolean;
  isInstallable: boolean;
  isPinned: boolean;
  launchCount: number;
  matchesCategory: boolean;
  matchesState: boolean;
  name: string;
  ready: boolean;
  route: string;
  state: SdkworkAppInstallState;
  supportedHostCount: number;
  tagCount: number;
  warningIssueCount: number;
}

export interface SdkworkAppCatalogDigestSummary {
  attentionApps: number;
  currentApps: number;
  installableApps: number;
  installedApps: number;
  pinnedApps: number;
  readyApps: number;
  restrictedApps: number;
  totalApps: number;
}

export type SdkworkAppInstallAction =
  | "install"
  | "launch"
  | "open-detail"
  | "uninstall";

export type SdkworkAppInstallIssue =
  | "already-installed"
  | "blocking-issues"
  | "category-mismatch"
  | "dependency-attention"
  | "host-unsupported"
  | "install-surface-missing"
  | "not-installable"
  | "not-installed"
  | "not-ready"
  | "state-mismatch";

export interface EvaluateAppInstallReadinessOptions {
  action?: SdkworkAppInstallAction;
  activeCategory?: string;
  activeState?: SdkworkAppInstallState;
  hostLabel?: string;
  installSurface?: SdkworkAppInstallSurfaceSummary;
}

export interface SdkworkAppInstallChecklist {
  hasInstallSurface: boolean;
  isCompatibleHost: boolean;
  isInstallable: boolean;
  isInstalled: boolean;
  isReady: boolean;
  matchesCategory: boolean;
  matchesState: boolean;
}

export interface SdkworkAppInstallCapabilities {
  canInstall: boolean;
  canLaunch: boolean;
  canOpenDetail: boolean;
  canUninstall: boolean;
}

export interface SdkworkAppInstallReadiness {
  capabilities: SdkworkAppInstallCapabilities;
  checklist: SdkworkAppInstallChecklist;
  degraded: boolean;
  issues: SdkworkAppInstallIssue[];
  ready: boolean;
}

export interface SdkworkAppsWorkspaceManifest extends SdkworkAppCapabilityManifest {
  capability: "apps";
  detailRoutePattern: string;
  routePath: string;
}

export interface CreateAppsWorkspaceManifestOptions
  extends Partial<
    Pick<CreateSdkworkAppCapabilityManifestOptions, "description" | "host" | "id" | "packageNames" | "theme" | "title">
  > {
  routePath?: string;
}

export interface SdkworkAppsLibraryRouteIntent {
  category?: string;
  focusWindow: boolean;
  route: string;
  source: "apps-workspace";
  state?: SdkworkAppInstallState;
  type: "apps-library-route-intent";
}

export interface CreateAppsLibraryRouteIntentOptions {
  basePath?: string;
  category?: string;
  focusWindow?: boolean;
  state?: SdkworkAppInstallState;
}

export interface SdkworkAppDetailRouteIntent {
  appId: string;
  focusWindow: boolean;
  route: string;
  source: "apps-workspace";
  type: "app-detail-route-intent";
}

export interface CreateAppDetailRouteIntentOptions {
  basePath?: string;
  focusWindow?: boolean;
}

const INSTALL_STATE_ORDER: readonly SdkworkAppInstallState[] = [
  "installed",
  "ready",
  "attention",
  "unknown",
];

function normalizeQuery(value: string): string {
  return value.trim().toLowerCase();
}

function matchesQuery(value: string | undefined, query: string): boolean {
  return value?.toLowerCase().includes(query) ?? false;
}

function appMatchesQuery(app: SdkworkAppCatalogEntry, query: string): boolean {
  if (!query) {
    return true;
  }

  return (
    matchesQuery(app.name, query) ||
    matchesQuery(app.developer, query) ||
    matchesQuery(app.category, query) ||
    matchesQuery(app.description, query) ||
    matchesQuery(app.installSummary, query) ||
    app.installTags?.some((tag) => matchesQuery(tag, query)) === true ||
    app.supportedHostLabels?.some((label) => matchesQuery(label, query)) === true
  );
}

function flattenAppCategories(
  categories: readonly SdkworkAppCatalogCategory[],
): SdkworkAppCatalogEntry[] {
  return categories.flatMap((category) => category.apps);
}

function resolveAppInstallState(
  appId: string,
  installSurfaceById: Record<string, SdkworkAppInstallSurfaceSummary | undefined>,
): SdkworkAppInstallState {
  return installSurfaceById[appId]?.state ?? "unknown";
}

function normalizeHostLabel(value: string): string {
  return value.trim().toLowerCase();
}

function isHostCompatible(
  app: Pick<SdkworkAppCatalogEntry, "supportedHostLabels">,
  hostLabel: string | undefined,
): boolean {
  if (!hostLabel) {
    return true;
  }

  const supportedHosts = app.supportedHostLabels ?? [];
  if (supportedHosts.length === 0) {
    return true;
  }

  const normalizedHost = normalizeHostLabel(hostLabel);
  return supportedHosts.some((label) => normalizeHostLabel(label) === normalizedHost);
}

function compareInstallState(
  left: SdkworkAppInstallState,
  right: SdkworkAppInstallState,
): number {
  return INSTALL_STATE_ORDER.indexOf(left) - INSTALL_STATE_ORDER.indexOf(right);
}

function toUniqueStrings(values: readonly string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function toUniquePackages(packageNames: readonly string[]): string[] {
  return toUniqueStrings(packageNames);
}

function parseTimestamp(value: string | undefined): number {
  if (!value) {
    return 0;
  }

  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : 0;
}

export function filterAppCategories(
  categories: readonly SdkworkAppCatalogCategory[],
  query: string,
): SdkworkAppCatalogCategory[] {
  const normalizedQuery = normalizeQuery(query);
  if (!normalizedQuery) {
    return categories.map((category) => ({
      ...category,
      apps: [...category.apps],
    }));
  }

  return categories
    .map((category) => ({
      ...category,
      apps: category.apps.filter((app) => appMatchesQuery(app, normalizedQuery)),
    }))
    .filter((category) => category.apps.length > 0);
}

export function collectInstallableAppIds(
  categories: readonly SdkworkAppCatalogCategory[],
): string[] {
  return Array.from(
    new Set(
      flattenAppCategories(categories)
        .filter((app) => app.installable)
        .map((app) => app.id),
    ),
  );
}

export function collectPriorityInstallableAppIds(
  categories: readonly SdkworkAppCatalogCategory[],
  limit = 6,
): string[] {
  return collectInstallableAppIds(categories).slice(0, Math.max(limit, 0));
}

export function createAppsOverview(
  categories: readonly SdkworkAppCatalogCategory[],
  installSurfaceById: Record<string, SdkworkAppInstallSurfaceSummary | undefined> = {},
): SdkworkAppsOverview {
  const apps = flattenAppCategories(categories);
  const installableApps = apps.filter((app) => app.installable);

  let attentionApps = 0;
  let installedApps = 0;
  let readyApps = 0;

  for (const app of installableApps) {
    const state = resolveAppInstallState(app.id, installSurfaceById);
    if (state === "installed") {
      installedApps += 1;
      continue;
    }

    if (state === "ready") {
      readyApps += 1;
      continue;
    }

    if (state === "attention") {
      attentionApps += 1;
    }
  }

  return {
    attentionApps,
    installableApps: installableApps.length,
    installedApps,
    readyApps,
    totalApps: apps.length,
    totalCategories: categories.length,
  };
}

export function buildAppsLauncherEntries(
  categories: readonly SdkworkAppCatalogCategory[],
  options: BuildAppsLauncherEntriesOptions = {},
): SdkworkAppsLauncherEntry[] {
  const apps = flattenAppCategories(categories);
  const installSurfaceById = options.installSurfaceById ?? {};
  const usageById = new Map(
    (options.usageRecords ?? []).map((record) => [record.appId, record] as const),
  );

  return [...apps]
    .sort((left, right) => {
      const leftUsage = usageById.get(left.id);
      const rightUsage = usageById.get(right.id);
      const leftPinned = leftUsage?.pinned === true;
      const rightPinned = rightUsage?.pinned === true;
      if (leftPinned !== rightPinned) {
        return leftPinned ? -1 : 1;
      }

      const leftLastOpenedAt = parseTimestamp(leftUsage?.lastOpenedAt);
      const rightLastOpenedAt = parseTimestamp(rightUsage?.lastOpenedAt);
      if (leftLastOpenedAt !== rightLastOpenedAt) {
        return rightLastOpenedAt - leftLastOpenedAt;
      }

      const installStateDifference = compareInstallState(
        resolveAppInstallState(left.id, installSurfaceById),
        resolveAppInstallState(right.id, installSurfaceById),
      );
      if (installStateDifference !== 0) {
        return installStateDifference;
      }

      if (Boolean(left.installable) !== Boolean(right.installable)) {
        return left.installable ? -1 : 1;
      }

      return left.name.localeCompare(right.name);
    })
    .slice(0, options.limit ?? 6)
    .map((app) => {
      const usage = usageById.get(app.id);
      const state = resolveAppInstallState(app.id, installSurfaceById);
      const pinned = usage?.pinned === true;
      const reason: SdkworkAppsLauncherEntry["reason"] = pinned
        ? "pinned"
        : usage?.lastOpenedAt
          ? "recent"
          : state !== "unknown"
            ? "install-state"
            : "suggested";

      return {
        appId: app.id,
        ...(usage?.lastOpenedAt ? { lastOpenedAt: usage.lastOpenedAt } : {}),
        launchCount: usage?.launchCount ?? 0,
        pinned,
        reason,
        state,
      };
    });
}

export function createAppsMetadataFields({
  defaultSoftwareName,
  registryName,
  selectedSoftwareName,
  supportedHostLabels = [],
}: CreateAppsMetadataFieldsOptions): SdkworkAppsMetadataField[] {
  const fields: SdkworkAppsMetadataField[] = [];
  const normalizedSupportedHosts = toUniqueStrings(supportedHostLabels);

  if (registryName?.trim()) {
    fields.push({
      id: "registry",
      value: registryName.trim(),
    });
  }

  if (defaultSoftwareName?.trim()) {
    fields.push({
      id: "defaultSoftwareName",
      value: defaultSoftwareName.trim(),
    });
  }

  if (selectedSoftwareName?.trim()) {
    fields.push({
      id: "selectedSoftwareName",
      value: selectedSoftwareName.trim(),
    });
  }

  if (normalizedSupportedHosts.length > 0) {
    fields.push({
      id: "supportedHosts",
      value: normalizedSupportedHosts.join(", "),
    });
  }

  return fields;
}

export function createAppCatalogDigest(
  app: SdkworkAppCatalogEntry,
  options: CreateAppCatalogDigestOptions = {},
): SdkworkAppCatalogDigest {
  const installSurface = options.installSurfaceById?.[app.id];
  const usageRecord = options.usageRecords?.find((record) => record.appId === app.id);
  const state = installSurface?.state ?? "unknown";
  const isInstallable = app.installable !== false;
  const isCompatibleHost = isHostCompatible(app, options.hostLabel);
  const isAvailable = isInstallable && isCompatibleHost;
  const isCurrent = options.currentAppId === app.id;
  const matchesCategory = options.activeCategory ? options.activeCategory === app.category : true;
  const matchesState = options.activeState ? options.activeState === state : true;

  let digestStatus: SdkworkAppCatalogDigestStatus = "installable";
  if (!isAvailable) {
    digestStatus = "restricted";
  } else if (isCurrent) {
    digestStatus = "current";
  } else if (state === "installed") {
    digestStatus = "installed";
  } else if (state === "ready") {
    digestStatus = "ready";
  } else if (state === "attention") {
    digestStatus = "attention";
  }

  return {
    appId: app.id,
    blockingIssueCount: installSurface?.blockingIssueCount ?? 0,
    category: app.category,
    dependencyAttentionCount: installSurface?.dependencyAttentionCount ?? 0,
    developer: app.developer,
    digestStatus,
    isAvailable,
    isCompatibleHost,
    isCurrent,
    isInstallable,
    isPinned: usageRecord?.pinned === true,
    launchCount: usageRecord?.launchCount ?? 0,
    matchesCategory,
    matchesState,
    name: app.name,
    ready: installSurface?.ready ?? false,
    route: `${options.basePath ?? "/apps"}/${app.id}`,
    state,
    supportedHostCount: app.supportedHostLabels?.length ?? 0,
    tagCount: app.installTags?.length ?? 0,
    warningIssueCount: installSurface?.warningIssueCount ?? 0,
  };
}

export function summarizeAppCatalogDigests(
  digests: readonly SdkworkAppCatalogDigest[],
): SdkworkAppCatalogDigestSummary {
  return digests.reduce<SdkworkAppCatalogDigestSummary>(
    (summary, digest) => {
      summary.totalApps += 1;

      if (digest.isInstallable) {
        summary.installableApps += 1;
      }

      if (digest.isCurrent) {
        summary.currentApps += 1;
      }

      if (digest.state === "installed") {
        summary.installedApps += 1;
      }

      if (digest.state === "ready") {
        summary.readyApps += 1;
      }

      if (digest.state === "attention") {
        summary.attentionApps += 1;
      }

      if (digest.digestStatus === "restricted") {
        summary.restrictedApps += 1;
      }

      if (digest.isPinned) {
        summary.pinnedApps += 1;
      }

      return summary;
    },
    {
      attentionApps: 0,
      currentApps: 0,
      installableApps: 0,
      installedApps: 0,
      pinnedApps: 0,
      readyApps: 0,
      restrictedApps: 0,
      totalApps: 0,
    },
  );
}

export function evaluateAppInstallReadiness(
  app: SdkworkAppCatalogEntry,
  options: EvaluateAppInstallReadinessOptions = {},
): SdkworkAppInstallReadiness {
  const action = options.action ?? "open-detail";
  const installSurface = options.installSurface;
  const isInstallable = app.installable !== false;
  const isCompatibleHost = isHostCompatible(app, options.hostLabel);
  const hasInstallSurface = Boolean(installSurface);
  const state = installSurface?.state ?? "unknown";
  const isInstalled = state === "installed";
  const isReady = installSurface?.ready === true;
  const matchesCategory = options.activeCategory ? options.activeCategory === app.category : true;
  const matchesState = options.activeState ? options.activeState === state : true;

  const capabilities: SdkworkAppInstallCapabilities = {
    canInstall:
      isInstallable
      && isCompatibleHost
      && hasInstallSurface
      && !isInstalled
      && isReady
      && (installSurface?.blockingIssueCount ?? 0) === 0
      && (installSurface?.dependencyAttentionCount ?? 0) === 0,
    canLaunch: isInstalled,
    canOpenDetail: true,
    canUninstall: isInstalled,
  };

  const checklist: SdkworkAppInstallChecklist = {
    hasInstallSurface,
    isCompatibleHost,
    isInstallable,
    isInstalled,
    isReady,
    matchesCategory,
    matchesState,
  };

  const issues: SdkworkAppInstallIssue[] = [];
  if (!matchesCategory) {
    issues.push("category-mismatch");
  }

  if (!matchesState) {
    issues.push("state-mismatch");
  }

  if (action === "install") {
    if (!isInstallable) {
      issues.push("not-installable");
    }

    if (!isCompatibleHost) {
      issues.push("host-unsupported");
    }

    if (!installSurface) {
      issues.push("install-surface-missing");
    } else {
      if (isInstalled) {
        issues.push("already-installed");
      }

      if (installSurface.blockingIssueCount > 0) {
        issues.push("blocking-issues");
      }

      if (installSurface.dependencyAttentionCount > 0) {
        issues.push("dependency-attention");
      }

      if (
        !installSurface.ready
        && installSurface.blockingIssueCount === 0
        && installSurface.dependencyAttentionCount === 0
      ) {
        issues.push("not-ready");
      }
    }
  }

  if ((action === "launch" || action === "uninstall") && !isInstalled) {
    issues.push("not-installed");
  }

  const ready =
    action === "install"
      ? capabilities.canInstall
      : action === "launch"
        ? capabilities.canLaunch
        : action === "uninstall"
          ? capabilities.canUninstall
          : capabilities.canOpenDetail;

  return {
    capabilities,
    checklist,
    degraded: issues.includes("category-mismatch") || issues.includes("state-mismatch"),
    issues,
    ready,
  };
}

export function createAppsWorkspaceManifest({
  description = "Apps workspace for catalog browsing, install readiness, and launcher routing.",
  host,
  id = "sdkwork-apps",
  packageNames = [
    "@sdkwork/apps-pc-react",
    "@sdkwork/dashboard-pc-react",
  ],
  routePath = "/apps",
  theme,
  title = "Apps",
}: CreateAppsWorkspaceManifestOptions = {}): SdkworkAppsWorkspaceManifest {
  return {
    ...createSdkworkAppCapabilityManifest({
      description,
      host,
      id,
      packageNames: toUniquePackages(packageNames),
      theme,
      title,
    }),
    capability: "apps",
    detailRoutePattern: `${routePath}/:appId`,
    routePath,
  };
}

export function createAppsLibraryRouteIntent(
  options: CreateAppsLibraryRouteIntentOptions = {},
): SdkworkAppsLibraryRouteIntent {
  const queryParams = new URLSearchParams();

  if (options.category) {
    queryParams.set("category", options.category);
  }

  if (options.state) {
    queryParams.set("state", options.state);
  }

  const querySuffix = queryParams.toString() ? `?${queryParams.toString()}` : "";

  return {
    ...(options.category ? { category: options.category } : {}),
    focusWindow: options.focusWindow !== false,
    route: `${options.basePath ?? "/apps"}${querySuffix}`,
    source: "apps-workspace",
    ...(options.state ? { state: options.state } : {}),
    type: "apps-library-route-intent",
  };
}

export function createAppDetailRouteIntent(
  appId: string,
  options: CreateAppDetailRouteIntentOptions = {},
): SdkworkAppDetailRouteIntent {
  return {
    appId,
    focusWindow: options.focusWindow !== false,
    route: `${options.basePath ?? "/apps"}/${appId}`,
    source: "apps-workspace",
    type: "app-detail-route-intent",
  };
}

export const appsPackageMeta = {
  architecture: "pc-react",
  domain: "system",
  package: "@sdkwork/apps-pc-react",
  status: "ready",
} as const;

export type AppsPackageMeta = typeof appsPackageMeta;
