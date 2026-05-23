import {
  createSdkworkAppCapabilityManifest,
  type CreateSdkworkAppCapabilityManifestOptions,
  type SdkworkAppCapabilityManifest,
} from "@sdkwork/appbase-pc-react";

export type SdkworkHomeShortcutKind =
  | "app"
  | "automation"
  | "communication"
  | "docs"
  | "system";
export type SdkworkHomeRecommendationSeverity = "critical" | "info" | "warning";
export type SdkworkHomeSectionTone = "attention" | "featured" | "neutral";
export type SdkworkHomeStatus = "attention" | "curated" | "ready";
export type SdkworkHomeStartupMode = "dashboard" | "home" | "last-route" | "workspace";
export type SdkworkHomeEntryType = "recommendation" | "shortcut";

export interface SdkworkHomeShortcut {
  id: string;
  kind: SdkworkHomeShortcutKind;
  pinned?: boolean;
  priority: number;
  recent?: boolean;
  route: string;
  sectionId: string;
  title: string;
}

export interface SdkworkHomeRecommendation {
  id: string;
  priority: number;
  route: string;
  sectionId: string;
  severity: SdkworkHomeRecommendationSeverity;
  title: string;
}

export interface SdkworkHomeSection {
  enabled?: boolean;
  id: string;
  priority: number;
  title: string;
}

export interface SdkworkHomeSectionSummary {
  id: string;
  priority: number;
  recommendationIds: string[];
  shortcutIds: string[];
  title: string;
  tone: SdkworkHomeSectionTone;
}

export interface SdkworkHomeQuickStart {
  featuredShortcutIds: string[];
  recommendationIds: string[];
  sectionSummaries: SdkworkHomeSectionSummary[];
  status: SdkworkHomeStatus;
}

export type SdkworkHomeEntryDigestStatus =
  | "attention"
  | "current"
  | "featured"
  | "restricted"
  | "standard";

export interface CreateHomeEntryDigestOptions {
  activeSectionId?: string;
  currentRoute?: string;
  entryTypeFilter?: SdkworkHomeEntryType;
  route?: string | null;
  startupRoute?: string;
}

export interface SdkworkHomeEntryDigestBase {
  digestStatus: SdkworkHomeEntryDigestStatus;
  entryId: string;
  entryType: SdkworkHomeEntryType;
  isAvailable: boolean;
  isCurrent: boolean;
  isStartupTarget: boolean;
  matchesSection: boolean;
  matchesType: boolean;
  priority: number;
  route?: string;
  sectionId: string;
  title: string;
}

export interface SdkworkHomeShortcutDigest extends SdkworkHomeEntryDigestBase {
  entryType: "shortcut";
  isPinned: boolean;
  isRecent: boolean;
  kind: SdkworkHomeShortcutKind;
}

export interface SdkworkHomeRecommendationDigest extends SdkworkHomeEntryDigestBase {
  entryType: "recommendation";
  severity: SdkworkHomeRecommendationSeverity;
}

export type SdkworkHomeEntryDigest =
  | SdkworkHomeRecommendationDigest
  | SdkworkHomeShortcutDigest;

export interface SdkworkHomeEntryDigestSummary {
  attentionEntries: number;
  availableEntries: number;
  currentEntries: number;
  featuredEntries: number;
  recommendationEntries: number;
  restrictedEntries: number;
  shortcutEntries: number;
  startupEntries: number;
  totalEntries: number;
}

export type SdkworkHomeEntryAction = "open-entry" | "set-startup";

export type SdkworkHomeEntryIssue =
  | "already-startup-target"
  | "entry-type-mismatch"
  | "missing-route"
  | "section-mismatch";

export interface EvaluateHomeEntryReadinessOptions {
  action?: SdkworkHomeEntryAction;
}

export interface SdkworkHomeEntryChecklist {
  hasRoute: boolean;
  isAvailable: boolean;
  isStartupTarget: boolean;
  matchesSection: boolean;
  matchesType: boolean;
}

export interface SdkworkHomeEntryCapabilities {
  canOpenEntry: boolean;
  canSetStartup: boolean;
}

export interface SdkworkHomeEntryReadiness {
  capabilities: SdkworkHomeEntryCapabilities;
  checklist: SdkworkHomeEntryChecklist;
  degraded: boolean;
  issues: SdkworkHomeEntryIssue[];
  ready: boolean;
}

export interface BuildHomeQuickStartInput {
  recommendations: readonly SdkworkHomeRecommendation[];
  sections: readonly SdkworkHomeSection[];
  shortcuts: readonly SdkworkHomeShortcut[];
}

export interface ResolveHomeStartupRouteOptions {
  fallbackRoute?: string;
  lastRoute?: string;
  startupMode?: SdkworkHomeStartupMode;
  workspaceRoute?: string;
}

export interface SdkworkHomeWorkspaceManifest extends SdkworkAppCapabilityManifest {
  capability: "home";
  recommendationRoutePattern: string;
  routePath: string;
}

export interface CreateHomeWorkspaceManifestOptions
  extends Partial<
    Pick<CreateSdkworkAppCapabilityManifestOptions, "description" | "host" | "id" | "packageNames" | "theme" | "title">
  > {
  routePath?: string;
}

export interface SdkworkHomeRouteIntent {
  focusWindow: boolean;
  route: string;
  section?: string;
  source: "home-workspace";
  type: "home-route-intent";
}

export interface CreateHomeRouteIntentOptions {
  basePath?: string;
  focusWindow?: boolean;
  section?: string;
}

export interface SdkworkHomeRecommendationRouteIntent {
  focusWindow: boolean;
  recommendationId: string;
  route: string;
  source: "home-workspace";
  type: "home-recommendation-route-intent";
}

export interface CreateHomeRecommendationRouteIntentOptions {
  basePath?: string;
  focusWindow?: boolean;
}

const RECOMMENDATION_SEVERITY_ORDER: readonly SdkworkHomeRecommendationSeverity[] = [
  "critical",
  "warning",
  "info",
];

function normalizeRoute(route: string | null | undefined): string | undefined {
  const normalizedRoute = route?.trim();
  return normalizedRoute ? normalizedRoute : undefined;
}

function resolveHomeEntryType(
  entry: SdkworkHomeRecommendation | SdkworkHomeShortcut,
): SdkworkHomeEntryType {
  return "kind" in entry ? "shortcut" : "recommendation";
}

function isAttentionSeverity(
  severity: SdkworkHomeRecommendationSeverity,
): boolean {
  return severity === "critical" || severity === "warning";
}

function compareRecommendationSeverity(
  left: SdkworkHomeRecommendationSeverity,
  right: SdkworkHomeRecommendationSeverity,
): number {
  return RECOMMENDATION_SEVERITY_ORDER.indexOf(left) - RECOMMENDATION_SEVERITY_ORDER.indexOf(right);
}

function toUniqueStrings(values: readonly string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function toUniquePackages(packageNames: readonly string[]): string[] {
  return toUniqueStrings(packageNames);
}

function sortShortcuts(shortcuts: readonly SdkworkHomeShortcut[]): SdkworkHomeShortcut[] {
  return [...shortcuts].sort((left, right) => {
    const leftPinned = left.pinned === true;
    const rightPinned = right.pinned === true;
    if (leftPinned !== rightPinned) {
      return leftPinned ? -1 : 1;
    }

    const leftRecent = left.recent === true;
    const rightRecent = right.recent === true;
    if (leftRecent !== rightRecent) {
      return leftRecent ? -1 : 1;
    }

    if (left.priority !== right.priority) {
      return left.priority - right.priority;
    }

    return left.title.localeCompare(right.title);
  });
}

function sortRecommendations(
  recommendations: readonly SdkworkHomeRecommendation[],
): SdkworkHomeRecommendation[] {
  return [...recommendations].sort((left, right) => {
    const severityDifference = compareRecommendationSeverity(left.severity, right.severity);
    if (severityDifference !== 0) {
      return severityDifference;
    }

    if (left.priority !== right.priority) {
      return left.priority - right.priority;
    }

    return left.title.localeCompare(right.title);
  });
}

function hasAttentionRecommendation(
  recommendations: readonly SdkworkHomeRecommendation[],
): boolean {
  return recommendations.some(
    (recommendation) =>
      recommendation.severity === "critical" || recommendation.severity === "warning",
  );
}

export function createHomeEntryDigest(
  entry: SdkworkHomeRecommendation | SdkworkHomeShortcut,
  options: CreateHomeEntryDigestOptions = {},
): SdkworkHomeEntryDigest {
  const entryType = resolveHomeEntryType(entry);
  const route = Object.prototype.hasOwnProperty.call(options, "route")
    ? normalizeRoute(options.route)
    : normalizeRoute(entry.route);
  const isAvailable = Boolean(route);
  const isCurrent = route === options.currentRoute;
  const isStartupTarget = route === options.startupRoute;
  const matchesSection = options.activeSectionId ? options.activeSectionId === entry.sectionId : true;
  const matchesType = options.entryTypeFilter ? options.entryTypeFilter === entryType : true;

  if ("kind" in entry) {
    const isPinned = entry.pinned === true;
    const isRecent = entry.recent === true;

    let digestStatus: SdkworkHomeEntryDigestStatus = "standard";
    if (!isAvailable) {
      digestStatus = "restricted";
    } else if (isCurrent) {
      digestStatus = "current";
    } else if (isPinned || isRecent) {
      digestStatus = "featured";
    }

    return {
      digestStatus,
      entryId: entry.id,
      entryType: "shortcut",
      isAvailable,
      isCurrent,
      isPinned,
      isRecent,
      isStartupTarget,
      kind: entry.kind,
      matchesSection,
      matchesType,
      priority: entry.priority,
      ...(route ? { route } : {}),
      sectionId: entry.sectionId,
      title: entry.title,
    };
  }

  let digestStatus: SdkworkHomeEntryDigestStatus = "standard";
  if (!isAvailable) {
    digestStatus = "restricted";
  } else if (isCurrent) {
    digestStatus = "current";
  } else if (isAttentionSeverity(entry.severity)) {
    digestStatus = "attention";
  }

  return {
    digestStatus,
    entryId: entry.id,
    entryType: "recommendation",
    isAvailable,
    isCurrent,
    isStartupTarget,
    matchesSection,
    matchesType,
    priority: entry.priority,
    ...(route ? { route } : {}),
    sectionId: entry.sectionId,
    severity: entry.severity,
    title: entry.title,
  };
}

export function summarizeHomeEntryDigests(
  digests: readonly SdkworkHomeEntryDigest[],
): SdkworkHomeEntryDigestSummary {
  return digests.reduce<SdkworkHomeEntryDigestSummary>(
    (summary, digest) => {
      summary.totalEntries += 1;

      if (digest.isAvailable) {
        summary.availableEntries += 1;
      }

      if (digest.isCurrent) {
        summary.currentEntries += 1;
      }

      if (digest.digestStatus === "featured") {
        summary.featuredEntries += 1;
      }

      if (digest.digestStatus === "attention") {
        summary.attentionEntries += 1;
      }

      if (digest.digestStatus === "restricted") {
        summary.restrictedEntries += 1;
      }

      if (digest.entryType === "shortcut") {
        summary.shortcutEntries += 1;
      } else {
        summary.recommendationEntries += 1;
      }

      if (digest.isStartupTarget) {
        summary.startupEntries += 1;
      }

      return summary;
    },
    {
      attentionEntries: 0,
      availableEntries: 0,
      currentEntries: 0,
      featuredEntries: 0,
      recommendationEntries: 0,
      restrictedEntries: 0,
      shortcutEntries: 0,
      startupEntries: 0,
      totalEntries: 0,
    },
  );
}

export function evaluateHomeEntryReadiness(
  digest: SdkworkHomeEntryDigest,
  options: EvaluateHomeEntryReadinessOptions = {},
): SdkworkHomeEntryReadiness {
  const action = options.action ?? "open-entry";
  const capabilities: SdkworkHomeEntryCapabilities = {
    canOpenEntry: digest.isAvailable,
    canSetStartup: digest.isAvailable && !digest.isStartupTarget,
  };
  const checklist: SdkworkHomeEntryChecklist = {
    hasRoute: Boolean(digest.route),
    isAvailable: digest.isAvailable,
    isStartupTarget: digest.isStartupTarget,
    matchesSection: digest.matchesSection,
    matchesType: digest.matchesType,
  };

  const issues: SdkworkHomeEntryIssue[] = [];
  if (!digest.matchesSection) {
    issues.push("section-mismatch");
  }

  if (!digest.matchesType) {
    issues.push("entry-type-mismatch");
  }

  if (!digest.route) {
    issues.push("missing-route");
  }

  if (action === "set-startup" && digest.isStartupTarget) {
    issues.push("already-startup-target");
  }

  return {
    capabilities,
    checklist,
    degraded: issues.includes("section-mismatch") || issues.includes("entry-type-mismatch"),
    issues,
    ready: action === "set-startup" ? capabilities.canSetStartup : capabilities.canOpenEntry,
  };
}

export function buildHomeQuickStart(
  input: BuildHomeQuickStartInput,
): SdkworkHomeQuickStart {
  const sortedShortcuts = sortShortcuts(input.shortcuts);
  const sortedRecommendations = sortRecommendations(input.recommendations);

  const sectionSummaries = input.sections
    .filter((section) => section.enabled !== false)
    .sort((left, right) => left.priority - right.priority || left.title.localeCompare(right.title))
    .map((section) => {
      const sectionShortcuts = sortedShortcuts.filter((shortcut) => shortcut.sectionId === section.id);
      const sectionRecommendations = sortedRecommendations.filter(
        (recommendation) => recommendation.sectionId === section.id,
      );
      const tone: SdkworkHomeSectionTone = hasAttentionRecommendation(sectionRecommendations)
        ? "attention"
        : sectionShortcuts.some((shortcut) => shortcut.pinned || shortcut.recent)
          ? "featured"
          : "neutral";

      return {
        id: section.id,
        priority: section.priority,
        recommendationIds: sectionRecommendations.map((recommendation) => recommendation.id),
        shortcutIds: sectionShortcuts.map((shortcut) => shortcut.id),
        title: section.title,
        tone,
      };
    });

  return {
    featuredShortcutIds: sortedShortcuts.slice(0, 3).map((shortcut) => shortcut.id),
    recommendationIds: sortedRecommendations.map((recommendation) => recommendation.id),
    sectionSummaries,
    status: hasAttentionRecommendation(sortedRecommendations)
      ? "attention"
      : sortedShortcuts.some((shortcut) => shortcut.pinned || shortcut.recent)
        ? "curated"
        : "ready",
  };
}

export function resolveHomeStartupRoute(
  options: ResolveHomeStartupRouteOptions = {},
): string {
  switch (options.startupMode) {
    case "dashboard":
      return "/dashboard";
    case "last-route":
      return options.lastRoute || options.workspaceRoute || options.fallbackRoute || "/home";
    case "workspace":
      return options.workspaceRoute || options.fallbackRoute || "/home";
    case "home":
    default:
      return options.fallbackRoute || "/home";
  }
}

export function createHomeWorkspaceManifest({
  description = "Home workspace for quick-start composition, personalized entry routing, and startup handoff.",
  host,
  id = "sdkwork-home",
  packageNames = [
    "@sdkwork/home-pc-react",
    "@sdkwork/dashboard-pc-react",
    "@sdkwork/apps-pc-react",
  ],
  routePath = "/home",
  theme,
  title = "Home",
}: CreateHomeWorkspaceManifestOptions = {}): SdkworkHomeWorkspaceManifest {
  return {
    ...createSdkworkAppCapabilityManifest({
      description,
      host,
      id,
      packageNames: toUniquePackages(packageNames),
      theme,
      title,
    }),
    capability: "home",
    recommendationRoutePattern: `${routePath}/recommendations/:recommendationId`,
    routePath,
  };
}

export function createHomeRouteIntent(
  options: CreateHomeRouteIntentOptions = {},
): SdkworkHomeRouteIntent {
  const queryParams = new URLSearchParams();

  if (options.section) {
    queryParams.set("section", options.section);
  }

  const querySuffix = queryParams.toString() ? `?${queryParams.toString()}` : "";

  return {
    focusWindow: options.focusWindow !== false,
    route: `${options.basePath ?? "/home"}${querySuffix}`,
    ...(options.section ? { section: options.section } : {}),
    source: "home-workspace",
    type: "home-route-intent",
  };
}

export function createHomeRecommendationRouteIntent(
  recommendationId: string,
  options: CreateHomeRecommendationRouteIntentOptions = {},
): SdkworkHomeRecommendationRouteIntent {
  return {
    focusWindow: options.focusWindow !== false,
    recommendationId,
    route: `${options.basePath ?? "/home"}/recommendations/${recommendationId}`,
    source: "home-workspace",
    type: "home-recommendation-route-intent",
  };
}

export const homePackageMeta = {
  architecture: "pc-react",
  domain: "system",
  package: "@sdkwork/home-pc-react",
  status: "ready",
} as const;

export type HomePackageMeta = typeof homePackageMeta;
