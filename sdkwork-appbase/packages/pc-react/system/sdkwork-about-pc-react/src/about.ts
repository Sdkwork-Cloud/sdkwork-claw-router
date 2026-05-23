import {
  createSdkworkAppCapabilityManifest,
  type CreateSdkworkAppCapabilityManifestOptions,
  type SdkworkAppCapabilityManifest,
} from "@sdkwork/appbase-pc-react";

export type SdkworkAboutQuickLinkKind =
  | "contact"
  | "docs"
  | "download"
  | "news"
  | "support"
  | "website";
export type SdkworkAboutLegalDocumentKind =
  | "license"
  | "notice"
  | "privacy"
  | "terms";
export type SdkworkAboutOverviewStatus = "attention" | "monitoring" | "stable";
export type SdkworkAboutRuntimeEnvironment =
  | "browser"
  | "desktop"
  | "linux"
  | "macos"
  | "unknown"
  | "windows"
  | "wsl";
export type SdkworkAboutRuntimeStatus = "error" | "healthy" | "missing" | "outdated";

export interface SdkworkAboutHighlight {
  description: string;
  id: string;
  priority: number;
  title: string;
}

export interface SdkworkAboutQuickLink {
  description?: string;
  href: string;
  id: string;
  kind: SdkworkAboutQuickLinkKind;
  priority: number;
  title: string;
}

export interface SdkworkAboutLegalDocument {
  id: string;
  kind: SdkworkAboutLegalDocumentKind;
  priority: number;
  route: string;
  title: string;
  updatedAt?: string;
}

export interface SdkworkAboutRuntimeDependency {
  currentVersion?: string;
  detail?: string;
  environment?: SdkworkAboutRuntimeEnvironment;
  id: string;
  latestVersion?: string;
  priority: number;
  status: SdkworkAboutRuntimeStatus;
  title: string;
}

export interface SdkworkAboutRuntimeSummary {
  attentionIds: string[];
  healthyIds: string[];
  highestStatus: SdkworkAboutRuntimeStatus;
  outdatedIds: string[];
  statusCounts: Record<SdkworkAboutRuntimeStatus, number>;
}

export interface BuildAboutOverviewInput {
  highlights: readonly SdkworkAboutHighlight[];
  legalDocuments: readonly SdkworkAboutLegalDocument[];
  quickLinks: readonly SdkworkAboutQuickLink[];
  runtimeDependencies: readonly SdkworkAboutRuntimeDependency[];
}

export interface SdkworkAboutOverview {
  highlightIds: string[];
  legalDocumentIds: string[];
  quickLinkIds: string[];
  runtimeAttentionIds: string[];
  runtimeStatus: SdkworkAboutOverviewStatus;
}

export type SdkworkAboutRuntimeDependencyDigestStatus =
  | "attention"
  | "current"
  | "healthy"
  | "outdated";

export interface CreateAboutRuntimeDependencyDigestOptions {
  activeEnvironment?: SdkworkAboutRuntimeEnvironment;
  currentDependencyId?: string;
  detailRoute?: string | null;
  installHref?: string | null;
  updateHref?: string | null;
}

export interface SdkworkAboutRuntimeDependencyDigest {
  currentVersion?: string;
  dependencyId: string;
  detailRoute?: string;
  digestStatus: SdkworkAboutRuntimeDependencyDigestStatus;
  environment?: SdkworkAboutRuntimeEnvironment;
  hasInstalledVersion: boolean;
  hasUpdateAvailable: boolean;
  installHref?: string;
  isCurrent: boolean;
  latestVersion?: string;
  matchesEnvironment: boolean;
  status: SdkworkAboutRuntimeStatus;
  title: string;
  updateHref?: string;
}

export interface SdkworkAboutRuntimeDependencyDigestSummary {
  attentionDependencies: number;
  currentDependencies: number;
  healthyDependencies: number;
  installedDependencies: number;
  missingDependencies: number;
  outdatedDependencies: number;
  totalDependencies: number;
  updateAvailableDependencies: number;
}

export type SdkworkAboutRuntimeDependencyAction =
  | "install"
  | "open-detail"
  | "update";

export type SdkworkAboutRuntimeDependencyIssue =
  | "detail-route-missing"
  | "environment-mismatch"
  | "install-link-missing"
  | "install-not-needed"
  | "update-link-missing"
  | "update-not-needed";

export interface EvaluateAboutRuntimeDependencyReadinessOptions {
  action?: SdkworkAboutRuntimeDependencyAction;
}

export interface SdkworkAboutRuntimeDependencyChecklist {
  hasDetailRoute: boolean;
  hasInstallHref: boolean;
  hasInstalledVersion: boolean;
  hasUpdateAvailable: boolean;
  hasUpdateHref: boolean;
  matchesEnvironment: boolean;
  needsInstall: boolean;
  needsUpdate: boolean;
}

export interface SdkworkAboutRuntimeDependencyCapabilities {
  canInstall: boolean;
  canOpenDetail: boolean;
  canUpdate: boolean;
}

export interface SdkworkAboutRuntimeDependencyReadiness {
  capabilities: SdkworkAboutRuntimeDependencyCapabilities;
  checklist: SdkworkAboutRuntimeDependencyChecklist;
  degraded: boolean;
  issues: SdkworkAboutRuntimeDependencyIssue[];
  ready: boolean;
}

export interface SdkworkAboutWorkspaceManifest extends SdkworkAppCapabilityManifest {
  capability: "about";
  legalRoutePattern: string;
  routePath: string;
}

export interface CreateAboutWorkspaceManifestOptions
  extends Partial<
    Pick<CreateSdkworkAppCapabilityManifestOptions, "description" | "host" | "id" | "packageNames" | "theme" | "title">
  > {
  routePath?: string;
}

export interface SdkworkAboutRouteIntent {
  focusWindow: boolean;
  route: string;
  sectionId?: string;
  source: "about-workspace";
  type: "about-route-intent";
}

export interface CreateAboutRouteIntentOptions {
  basePath?: string;
  focusWindow?: boolean;
  sectionId?: string;
}

export interface SdkworkAboutLegalRouteIntent {
  documentId: string;
  focusWindow: boolean;
  route: string;
  source: "about-workspace";
  type: "about-legal-route-intent";
}

export interface CreateAboutLegalRouteIntentOptions {
  basePath?: string;
  focusWindow?: boolean;
}

const RUNTIME_STATUS_ORDER: readonly SdkworkAboutRuntimeStatus[] = [
  "error",
  "missing",
  "outdated",
  "healthy",
];

function comparePriorityTitle(
  left: { priority: number; title: string },
  right: { priority: number; title: string },
): number {
  if (left.priority !== right.priority) {
    return left.priority - right.priority;
  }

  return left.title.localeCompare(right.title);
}

function toUniqueStrings(values: readonly string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function toUniquePackages(packageNames: readonly string[]): string[] {
  return toUniqueStrings(packageNames);
}

function normalizeRoute(value: string | null | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

function needsInstall(status: SdkworkAboutRuntimeStatus): boolean {
  return status === "missing";
}

function needsUpdate(status: SdkworkAboutRuntimeStatus): boolean {
  return status === "outdated";
}

function normalizeBasePath(basePath: string | undefined): string {
  const normalized = (basePath ?? "/about").trim();
  if (!normalized || normalized === "/") {
    return "/about";
  }

  return normalized.endsWith("/") ? normalized.slice(0, -1) : normalized;
}

function compareRuntimeStatus(
  left: SdkworkAboutRuntimeStatus,
  right: SdkworkAboutRuntimeStatus,
): number {
  return RUNTIME_STATUS_ORDER.indexOf(left) - RUNTIME_STATUS_ORDER.indexOf(right);
}

function sortRuntimeDependencies(
  dependencies: readonly SdkworkAboutRuntimeDependency[],
): SdkworkAboutRuntimeDependency[] {
  return [...dependencies].sort((left, right) => {
    const statusDifference = compareRuntimeStatus(left.status, right.status);
    if (statusDifference !== 0) {
      return statusDifference;
    }

    return comparePriorityTitle(left, right);
  });
}

function createRuntimeStatusCounts(): Record<SdkworkAboutRuntimeStatus, number> {
  return {
    error: 0,
    healthy: 0,
    missing: 0,
    outdated: 0,
  };
}

export function summarizeAboutRuntime(
  dependencies: readonly SdkworkAboutRuntimeDependency[],
): SdkworkAboutRuntimeSummary {
  const sortedDependencies = sortRuntimeDependencies(dependencies);
  const statusCounts = createRuntimeStatusCounts();

  for (const dependency of sortedDependencies) {
    statusCounts[dependency.status] += 1;
  }

  return {
    attentionIds: sortedDependencies
      .filter((dependency) => dependency.status !== "healthy")
      .map((dependency) => dependency.id),
    healthyIds: sortedDependencies
      .filter((dependency) => dependency.status === "healthy")
      .map((dependency) => dependency.id),
    highestStatus: sortedDependencies[0]?.status ?? "healthy",
    outdatedIds: sortedDependencies
      .filter((dependency) => dependency.status === "outdated")
      .map((dependency) => dependency.id),
    statusCounts,
  };
}

export function buildAboutOverview(
  input: BuildAboutOverviewInput,
): SdkworkAboutOverview {
  const runtimeSummary = summarizeAboutRuntime(input.runtimeDependencies);
  const runtimeStatus: SdkworkAboutOverviewStatus =
    runtimeSummary.highestStatus === "error" || runtimeSummary.highestStatus === "missing"
      ? "attention"
      : runtimeSummary.highestStatus === "outdated"
        ? "monitoring"
        : "stable";

  return {
    highlightIds: [...input.highlights].sort(comparePriorityTitle).map((highlight) => highlight.id),
    legalDocumentIds: [...input.legalDocuments]
      .sort(comparePriorityTitle)
      .map((document) => document.id),
    quickLinkIds: [...input.quickLinks].sort(comparePriorityTitle).map((link) => link.id),
    runtimeAttentionIds: runtimeSummary.attentionIds,
    runtimeStatus,
  };
}

export function createAboutRuntimeDependencyDigest(
  dependency: SdkworkAboutRuntimeDependency,
  options: CreateAboutRuntimeDependencyDigestOptions = {},
): SdkworkAboutRuntimeDependencyDigest {
  const isCurrent = options.currentDependencyId === dependency.id;
  const hasInstalledVersion = Boolean(dependency.currentVersion?.trim());
  const hasUpdateAvailable =
    dependency.status === "outdated"
    && Boolean(dependency.currentVersion?.trim())
    && Boolean(dependency.latestVersion?.trim())
    && dependency.currentVersion !== dependency.latestVersion;
  const matchesEnvironment = options.activeEnvironment
    ? options.activeEnvironment === dependency.environment
    : true;

  let digestStatus: SdkworkAboutRuntimeDependencyDigestStatus = "attention";
  if (isCurrent) {
    digestStatus = "current";
  } else if (dependency.status === "healthy") {
    digestStatus = "healthy";
  } else if (dependency.status === "outdated") {
    digestStatus = "outdated";
  }

  return {
    currentVersion: dependency.currentVersion,
    dependencyId: dependency.id,
    ...(normalizeRoute(options.detailRoute) ? { detailRoute: normalizeRoute(options.detailRoute) } : {}),
    digestStatus,
    environment: dependency.environment,
    hasInstalledVersion,
    hasUpdateAvailable,
    ...(normalizeRoute(options.installHref) ? { installHref: normalizeRoute(options.installHref) } : {}),
    isCurrent,
    latestVersion: dependency.latestVersion,
    matchesEnvironment,
    status: dependency.status,
    title: dependency.title,
    ...(normalizeRoute(options.updateHref) ? { updateHref: normalizeRoute(options.updateHref) } : {}),
  };
}

export function summarizeAboutRuntimeDependencyDigests(
  digests: readonly SdkworkAboutRuntimeDependencyDigest[],
): SdkworkAboutRuntimeDependencyDigestSummary {
  return digests.reduce<SdkworkAboutRuntimeDependencyDigestSummary>(
    (summary, digest) => {
      summary.totalDependencies += 1;

      if (digest.isCurrent) {
        summary.currentDependencies += 1;
      }

      if (digest.status === "healthy") {
        summary.healthyDependencies += 1;
      }

      if (digest.hasInstalledVersion) {
        summary.installedDependencies += 1;
      }

      if (digest.status === "missing") {
        summary.missingDependencies += 1;
      }

      if (digest.status === "outdated") {
        summary.outdatedDependencies += 1;
      }

      if (digest.hasUpdateAvailable) {
        summary.updateAvailableDependencies += 1;
      }

      if (digest.status === "error" || digest.status === "missing") {
        summary.attentionDependencies += 1;
      }

      return summary;
    },
    {
      attentionDependencies: 0,
      currentDependencies: 0,
      healthyDependencies: 0,
      installedDependencies: 0,
      missingDependencies: 0,
      outdatedDependencies: 0,
      totalDependencies: 0,
      updateAvailableDependencies: 0,
    },
  );
}

export function evaluateAboutRuntimeDependencyReadiness(
  digest: SdkworkAboutRuntimeDependencyDigest,
  options: EvaluateAboutRuntimeDependencyReadinessOptions = {},
): SdkworkAboutRuntimeDependencyReadiness {
  const action = options.action ?? "open-detail";
  const checklist: SdkworkAboutRuntimeDependencyChecklist = {
    hasDetailRoute: Boolean(digest.detailRoute),
    hasInstallHref: Boolean(digest.installHref),
    hasInstalledVersion: digest.hasInstalledVersion,
    hasUpdateAvailable: digest.hasUpdateAvailable,
    hasUpdateHref: Boolean(digest.updateHref),
    matchesEnvironment: digest.matchesEnvironment,
    needsInstall: needsInstall(digest.status),
    needsUpdate: needsUpdate(digest.status),
  };
  const capabilities: SdkworkAboutRuntimeDependencyCapabilities = {
    canInstall: checklist.needsInstall && checklist.hasInstallHref,
    canOpenDetail: checklist.hasDetailRoute,
    canUpdate: checklist.needsUpdate && checklist.hasUpdateHref,
  };

  const issues: SdkworkAboutRuntimeDependencyIssue[] = [];
  if (!checklist.matchesEnvironment) {
    issues.push("environment-mismatch");
  }

  if (action === "open-detail" && !checklist.hasDetailRoute) {
    issues.push("detail-route-missing");
  }

  if (action === "install") {
    if (!checklist.needsInstall) {
      issues.push("install-not-needed");
    }

    if (!checklist.hasInstallHref) {
      issues.push("install-link-missing");
    }
  }

  if (action === "update") {
    if (!checklist.needsUpdate) {
      issues.push("update-not-needed");
    }

    if (!checklist.hasUpdateHref) {
      issues.push("update-link-missing");
    }
  }

  return {
    capabilities,
    checklist,
    degraded: issues.includes("environment-mismatch"),
    issues,
    ready:
      action === "install"
        ? capabilities.canInstall
        : action === "update"
          ? capabilities.canUpdate
          : capabilities.canOpenDetail,
  };
}

export function createAboutWorkspaceManifest({
  description = "About workspace for app identity, runtime metadata, and legal navigation.",
  host,
  id = "sdkwork-about",
  packageNames = [
    "@sdkwork/about-pc-react",
    "@sdkwork/support-pc-react",
  ],
  routePath = "/about",
  theme,
  title = "About",
}: CreateAboutWorkspaceManifestOptions = {}): SdkworkAboutWorkspaceManifest {
  return {
    ...createSdkworkAppCapabilityManifest({
      description,
      host,
      id,
      packageNames: toUniquePackages(packageNames),
      theme,
      title,
    }),
    capability: "about",
    legalRoutePattern: `${routePath}/legal/:documentId`,
    routePath,
  };
}

export function createAboutRouteIntent(
  options: CreateAboutRouteIntentOptions = {},
): SdkworkAboutRouteIntent {
  const queryParams = new URLSearchParams();
  if (options.sectionId) {
    queryParams.set("section", options.sectionId);
  }

  const querySuffix = queryParams.toString() ? `?${queryParams.toString()}` : "";

  return {
    focusWindow: options.focusWindow !== false,
    route: `${normalizeBasePath(options.basePath)}${querySuffix}`,
    ...(options.sectionId ? { sectionId: options.sectionId } : {}),
    source: "about-workspace",
    type: "about-route-intent",
  };
}

export function createAboutLegalRouteIntent(
  documentId: string,
  options: CreateAboutLegalRouteIntentOptions = {},
): SdkworkAboutLegalRouteIntent {
  return {
    documentId,
    focusWindow: options.focusWindow !== false,
    route: `${normalizeBasePath(options.basePath)}/legal/${documentId}`,
    source: "about-workspace",
    type: "about-legal-route-intent",
  };
}

export const aboutPackageMeta = {
  architecture: "pc-react",
  domain: "system",
  package: "@sdkwork/about-pc-react",
  status: "ready",
} as const;

export type AboutPackageMeta = typeof aboutPackageMeta;
