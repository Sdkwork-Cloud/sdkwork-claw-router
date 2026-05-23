import {
  createSdkworkAppCapabilityManifest,
  type CreateSdkworkAppCapabilityManifestOptions,
  type SdkworkAppCapabilityManifest,
} from "@sdkwork/appbase-pc-react";

export type SdkworkDashboardSeverity = "critical" | "healthy" | "info" | "warning";
export type SdkworkDashboardOverviewStatus = "attention" | "healthy" | "monitoring";
export type SdkworkDashboardSectionSortMode = "priority" | "severity" | "title";
export type SdkworkDashboardSectionId =
  | "activity"
  | "automation"
  | "communication"
  | "intelligence"
  | "operations"
  | "overview"
  | "permissions"
  | (string & {});

export interface SdkworkDashboardCard {
  caption?: string;
  delta?: string;
  id: string;
  priority: number;
  route?: string;
  sectionId: SdkworkDashboardSectionId;
  severity: SdkworkDashboardSeverity;
  title: string;
  value: number | string;
}

export interface SdkworkDashboardSignal {
  capabilityId?: string;
  id: string;
  route?: string;
  score: number;
  sectionId: SdkworkDashboardSectionId;
  severity: SdkworkDashboardSeverity;
  tags?: readonly string[];
  title: string;
}

export interface SdkworkDashboardAction {
  id: string;
  priority: number;
  route: string;
  sectionId: SdkworkDashboardSectionId;
  severity: SdkworkDashboardSeverity;
  title: string;
}

export interface SdkworkDashboardSection {
  deferred?: boolean;
  enabled?: boolean;
  id: SdkworkDashboardSectionId;
  priority: number;
  title: string;
}

export interface SdkworkDashboardSignalSummary {
  attentionIds: string[];
  averageScore: number;
  healthyIds: string[];
  highestSeverity: SdkworkDashboardSeverity;
  severityCounts: Record<SdkworkDashboardSeverity, number>;
}

export interface SdkworkDashboardSectionSummary {
  actionIds: readonly string[];
  cardIds: readonly string[];
  deferred: boolean;
  id: string;
  itemCount: number;
  severity: SdkworkDashboardSeverity;
  signalIds: readonly string[];
  title: string;
}

export type SdkworkDashboardSectionDigestStatus =
  | "attention"
  | "current"
  | "deferred"
  | "healthy"
  | "restricted"
  | "standard";

export interface CreateDashboardSectionDigestOptions {
  activeSectionId?: string;
  activeSeverity?: SdkworkDashboardSeverity;
  basePath?: string;
  hydratedSectionIds?: readonly string[];
  route?: string | null;
  summary?: SdkworkDashboardSectionSummary;
}

export interface SdkworkDashboardSectionDigest {
  actionCount: number;
  cardCount: number;
  digestStatus: SdkworkDashboardSectionDigestStatus;
  hasItems: boolean;
  id: string;
  isAvailable: boolean;
  isCurrent: boolean;
  isDeferred: boolean;
  isHydrated: boolean;
  itemCount: number;
  matchesSection: boolean;
  matchesSeverity: boolean;
  route?: string;
  severity: SdkworkDashboardSeverity;
  signalCount: number;
  title: string;
}

export interface SdkworkDashboardSectionDigestSummary {
  attentionSections: number;
  currentSections: number;
  deferredSections: number;
  healthySections: number;
  hydratedSections: number;
  populatedSections: number;
  restrictedSections: number;
  standardSections: number;
  totalSections: number;
}

export type SdkworkDashboardActionReadinessAction =
  | "hydrate-section"
  | "open-route"
  | "open-section";

export type SdkworkDashboardActionReadinessIssue =
  | "already-hydrated"
  | "missing-route"
  | "section-disabled"
  | "section-mismatch"
  | "section-not-deferred"
  | "section-not-hydrated"
  | "severity-mismatch";

export interface EvaluateDashboardActionReadinessOptions {
  action?: SdkworkDashboardActionReadinessAction;
}

export interface SdkworkDashboardActionChecklist {
  hasRoute: boolean;
  isAvailable: boolean;
  isDeferred: boolean;
  isHydrated: boolean;
  matchesSection: boolean;
  matchesSeverity: boolean;
}

export interface SdkworkDashboardActionCapabilities {
  canHydrateSection: boolean;
  canOpenRoute: boolean;
  canOpenSection: boolean;
}

export interface SdkworkDashboardActionReadiness {
  capabilities: SdkworkDashboardActionCapabilities;
  checklist: SdkworkDashboardActionChecklist;
  degraded: boolean;
  issues: SdkworkDashboardActionReadinessIssue[];
  ready: boolean;
}

export interface SdkworkDashboardOverview {
  attentionSignalIds: string[];
  featuredCardIds: string[];
  healthScore: number;
  recommendedActionIds: string[];
  sectionSummaries: SdkworkDashboardSectionSummary[];
  status: SdkworkDashboardOverviewStatus;
}

export interface BuildDashboardOverviewInput {
  actions: readonly SdkworkDashboardAction[];
  cards: readonly SdkworkDashboardCard[];
  sections: readonly SdkworkDashboardSection[];
  signals: readonly SdkworkDashboardSignal[];
}

export interface BuildDashboardOverviewOptions {
  featuredCardCount?: number;
  recommendedActionCount?: number;
  sectionSort?: SdkworkDashboardSectionSortMode;
}

export type SdkworkDashboardDeferredSectionsState = Record<string, boolean>;

export interface ScheduleDashboardSectionHydrationInput {
  batchDelayMs?: number;
  batches: readonly (readonly string[])[];
  clearScheduledTimeout?: (handle: number) => void;
  onBatchReady: (patch: SdkworkDashboardDeferredSectionsState) => void;
  scheduleTimeout?: (callback: () => void, delay: number) => number;
  startDelayMs?: number;
}

export interface SdkworkDashboardWorkspaceManifest extends SdkworkAppCapabilityManifest {
  capability: "dashboard";
  detailRoutePattern: string;
  routePath: string;
}

export interface CreateDashboardWorkspaceManifestOptions
  extends Partial<
    Pick<CreateSdkworkAppCapabilityManifestOptions, "description" | "host" | "id" | "packageNames" | "theme" | "title">
  > {
  routePath?: string;
}

export interface SdkworkDashboardOverviewRouteIntent {
  focusWindow: boolean;
  route: string;
  section?: string;
  severity?: SdkworkDashboardSeverity;
  source: "dashboard-workspace";
  type: "dashboard-overview-route-intent";
}

export interface CreateDashboardOverviewRouteIntentOptions {
  basePath?: string;
  focusWindow?: boolean;
  section?: string;
  severity?: SdkworkDashboardSeverity;
}

export interface SdkworkDashboardSectionRouteIntent {
  focusWindow: boolean;
  route: string;
  sectionId: string;
  source: "dashboard-workspace";
  type: "dashboard-section-route-intent";
}

export interface CreateDashboardSectionRouteIntentOptions {
  basePath?: string;
  focusWindow?: boolean;
}

const SEVERITY_ORDER: readonly SdkworkDashboardSeverity[] = [
  "critical",
  "warning",
  "info",
  "healthy",
];
const SEVERITY_PENALTIES: Record<SdkworkDashboardSeverity, number> = {
  critical: 20,
  healthy: 0,
  info: 4,
  warning: 12,
};

function createSeverityCounts(): Record<SdkworkDashboardSeverity, number> {
  return {
    critical: 0,
    healthy: 0,
    info: 0,
    warning: 0,
  };
}

function compareSeverity(
  left: SdkworkDashboardSeverity,
  right: SdkworkDashboardSeverity,
): number {
  return SEVERITY_ORDER.indexOf(left) - SEVERITY_ORDER.indexOf(right);
}

function clampScore(score: number): number {
  if (!Number.isFinite(score)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

function sortBySeverityPriorityTitle<T extends { priority: number; severity: SdkworkDashboardSeverity; title: string }>(
  items: readonly T[],
): T[] {
  return [...items].sort((left, right) => {
    const severityDifference = compareSeverity(left.severity, right.severity);
    if (severityDifference !== 0) {
      return severityDifference;
    }

    if (left.priority !== right.priority) {
      return left.priority - right.priority;
    }

    return left.title.localeCompare(right.title);
  });
}

function sortSignals(signals: readonly SdkworkDashboardSignal[]): SdkworkDashboardSignal[] {
  return [...signals].sort((left, right) => {
    const severityDifference = compareSeverity(left.severity, right.severity);
    if (severityDifference !== 0) {
      return severityDifference;
    }

    if (right.score !== left.score) {
      return right.score - left.score;
    }

    return left.title.localeCompare(right.title);
  });
}

function highestSeverity(values: readonly SdkworkDashboardSeverity[]): SdkworkDashboardSeverity {
  return values.length === 0
    ? "healthy"
    : [...values].sort((left, right) => compareSeverity(left, right))[0] ?? "healthy";
}

function hasAttentionSeverity(severity: SdkworkDashboardSeverity): boolean {
  return severity === "critical" || severity === "warning";
}

function toUniqueStrings(values: readonly string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function toUniquePackages(packageNames: readonly string[]): string[] {
  return toUniqueStrings(packageNames);
}

function createIdSet(ids: readonly string[] | undefined): Set<string> {
  return new Set(ids ?? []);
}

function resolveDashboardSectionSummary(
  sectionId: string,
  summary: SdkworkDashboardSectionSummary | undefined,
): SdkworkDashboardSectionSummary | undefined {
  return summary?.id === sectionId ? summary : undefined;
}

function normalizeRoute(route: string | null | undefined): string | undefined {
  const normalizedRoute = route?.trim();
  return normalizedRoute ? normalizedRoute : undefined;
}

function resolveDashboardSectionRoute(
  sectionId: string,
  options: Pick<CreateDashboardSectionDigestOptions, "basePath" | "route">,
): string | undefined {
  if (Object.prototype.hasOwnProperty.call(options, "route")) {
    return normalizeRoute(options.route);
  }

  return `${options.basePath ?? "/dashboard"}/${sectionId}`;
}

function createDeferredSectionPatch(
  sectionIds: readonly string[],
): SdkworkDashboardDeferredSectionsState {
  return mergeDashboardDeferredSections(
    createInitialDashboardDeferredSections(sectionIds),
    Object.fromEntries(toUniqueStrings(sectionIds).map((sectionId) => [sectionId, true] as const)),
  );
}

function sortSectionSummaries(
  sectionSummaries: readonly SdkworkDashboardSectionSummary[],
  mode: SdkworkDashboardSectionSortMode,
): SdkworkDashboardSectionSummary[] {
  if (mode === "priority") {
    return [...sectionSummaries];
  }

  return [...sectionSummaries].sort((left, right) => {
    if (mode === "severity") {
      const severityDifference = compareSeverity(left.severity, right.severity);
      if (severityDifference !== 0) {
        return severityDifference;
      }
    }

    if (mode === "title") {
      return left.title.localeCompare(right.title);
    }

    return left.title.localeCompare(right.title);
  });
}

export function summarizeDashboardSignals(
  signals: readonly SdkworkDashboardSignal[],
): SdkworkDashboardSignalSummary {
  const severityCounts = createSeverityCounts();
  const attentionIds: string[] = [];
  const healthyIds: string[] = [];

  for (const signal of sortSignals(signals)) {
    severityCounts[signal.severity] += 1;

    if (signal.severity === "critical" || signal.severity === "warning") {
      attentionIds.push(signal.id);
    }

    if (signal.severity === "healthy") {
      healthyIds.push(signal.id);
    }
  }

  const averageScore =
    signals.length === 0
      ? 100
      : Math.round(
          signals.reduce((total, signal) => total + clampScore(signal.score), 0) /
            signals.length,
        );

  return {
    attentionIds,
    averageScore,
    healthyIds,
    highestSeverity: highestSeverity(signals.map((signal) => signal.severity)),
    severityCounts,
  };
}

export function calculateDashboardHealthScore(
  signals: readonly SdkworkDashboardSignal[],
): number {
  if (signals.length === 0) {
    return 100;
  }

  const total = signals.reduce((sum, signal) => {
    const adjustedScore = clampScore(signal.score) - SEVERITY_PENALTIES[signal.severity];
    return sum + Math.max(adjustedScore, 0);
  }, 0);

  return Math.round(total / signals.length);
}

export function buildDashboardOverview(
  input: BuildDashboardOverviewInput,
  options: BuildDashboardOverviewOptions = {},
): SdkworkDashboardOverview {
  const signalSummary = summarizeDashboardSignals(input.signals);
  const healthScore = calculateDashboardHealthScore(input.signals);
  const sortedCards = sortBySeverityPriorityTitle(input.cards);
  const sortedActions = sortBySeverityPriorityTitle(input.actions);
  const cardsBySection = new Map<string, SdkworkDashboardCard[]>();
  const actionsBySection = new Map<string, SdkworkDashboardAction[]>();
  const signalsBySection = new Map<string, SdkworkDashboardSignal[]>();

  for (const card of sortedCards) {
    const bucket = cardsBySection.get(card.sectionId) ?? [];
    bucket.push(card);
    cardsBySection.set(card.sectionId, bucket);
  }

  for (const action of sortedActions) {
    const bucket = actionsBySection.get(action.sectionId) ?? [];
    bucket.push(action);
    actionsBySection.set(action.sectionId, bucket);
  }

  for (const signal of sortSignals(input.signals)) {
    const bucket = signalsBySection.get(signal.sectionId) ?? [];
    bucket.push(signal);
    signalsBySection.set(signal.sectionId, bucket);
  }

  const sectionSummaries = input.sections
    .filter((section) => section.enabled !== false)
    .sort((left, right) => left.priority - right.priority || left.title.localeCompare(right.title))
    .map((section) => {
      const cards = cardsBySection.get(section.id) ?? [];
      const actions = actionsBySection.get(section.id) ?? [];
      const signals = signalsBySection.get(section.id) ?? [];

      return {
        actionIds: actions.map((action) => action.id),
        cardIds: cards.map((card) => card.id),
        deferred: section.deferred === true,
        id: section.id,
        itemCount: cards.length + actions.length + signals.length,
        severity: highestSeverity([
          ...cards.map((card) => card.severity),
          ...actions.map((action) => action.severity),
          ...signals.map((signal) => signal.severity),
        ]),
        signalIds: signals.map((signal) => signal.id),
        title: section.title,
      } satisfies SdkworkDashboardSectionSummary;
    });

  const status: SdkworkDashboardOverviewStatus =
    signalSummary.attentionIds.length > 0
      ? "attention"
      : signalSummary.highestSeverity === "info"
        ? "monitoring"
        : "healthy";

  return {
    attentionSignalIds: signalSummary.attentionIds,
    featuredCardIds: sortedCards
      .slice(0, options.featuredCardCount ?? 3)
      .map((card) => card.id),
    healthScore,
    recommendedActionIds: sortedActions
      .slice(0, options.recommendedActionCount ?? 3)
      .map((action) => action.id),
    sectionSummaries: sortSectionSummaries(sectionSummaries, options.sectionSort ?? "priority"),
    status,
  };
}

export function createDashboardSectionDigest(
  section: SdkworkDashboardSection,
  options: CreateDashboardSectionDigestOptions = {},
): SdkworkDashboardSectionDigest {
  const hydratedSectionIds = createIdSet(options.hydratedSectionIds);
  const summary = resolveDashboardSectionSummary(section.id, options.summary);
  const isAvailable = section.enabled !== false;
  const isCurrent = options.activeSectionId === section.id;
  const isDeferred = section.deferred === true;
  const isHydrated = isAvailable && (!isDeferred || hydratedSectionIds.has(section.id));
  const severity = summary?.severity ?? "healthy";
  const route = resolveDashboardSectionRoute(section.id, options);
  const matchesSection = options.activeSectionId ? options.activeSectionId === section.id : true;
  const matchesSeverity = options.activeSeverity ? options.activeSeverity === severity : true;

  let digestStatus: SdkworkDashboardSectionDigestStatus = "standard";
  if (!isAvailable) {
    digestStatus = "restricted";
  } else if (isCurrent) {
    digestStatus = "current";
  } else if (isDeferred && !isHydrated) {
    digestStatus = "deferred";
  } else if (hasAttentionSeverity(severity)) {
    digestStatus = "attention";
  } else if (severity === "healthy") {
    digestStatus = "healthy";
  }

  return {
    actionCount: summary?.actionIds.length ?? 0,
    cardCount: summary?.cardIds.length ?? 0,
    digestStatus,
    hasItems: (summary?.itemCount ?? 0) > 0,
    id: section.id,
    isAvailable,
    isCurrent,
    isDeferred,
    isHydrated,
    itemCount: summary?.itemCount ?? 0,
    matchesSection,
    matchesSeverity,
    ...(route ? { route } : {}),
    severity,
    signalCount: summary?.signalIds.length ?? 0,
    title: section.title,
  };
}

export function summarizeDashboardSectionDigests(
  digests: readonly SdkworkDashboardSectionDigest[],
): SdkworkDashboardSectionDigestSummary {
  return digests.reduce<SdkworkDashboardSectionDigestSummary>(
    (summary, digest) => {
      summary.totalSections += 1;

      if (digest.isCurrent) {
        summary.currentSections += 1;
      }

      if (digest.isDeferred && !digest.isHydrated) {
        summary.deferredSections += 1;
      }

      if (digest.isHydrated) {
        summary.hydratedSections += 1;
      }

      if (digest.hasItems) {
        summary.populatedSections += 1;
      }

      if (!digest.isAvailable) {
        summary.restrictedSections += 1;
      }

      if (hasAttentionSeverity(digest.severity) && digest.isAvailable) {
        summary.attentionSections += 1;
      }

      if (digest.severity === "healthy" && digest.isAvailable) {
        summary.healthySections += 1;
      }

      if (digest.digestStatus === "standard") {
        summary.standardSections += 1;
      }

      return summary;
    },
    {
      attentionSections: 0,
      currentSections: 0,
      deferredSections: 0,
      healthySections: 0,
      hydratedSections: 0,
      populatedSections: 0,
      restrictedSections: 0,
      standardSections: 0,
      totalSections: 0,
    },
  );
}

export function evaluateDashboardActionReadiness(
  digest: SdkworkDashboardSectionDigest,
  options: EvaluateDashboardActionReadinessOptions = {},
): SdkworkDashboardActionReadiness {
  const action = options.action ?? "open-section";
  const capabilities: SdkworkDashboardActionCapabilities = {
    canHydrateSection: digest.isAvailable && digest.isDeferred && !digest.isHydrated,
    canOpenRoute:
      digest.isAvailable && (!digest.isDeferred || digest.isHydrated) && Boolean(digest.route),
    canOpenSection: digest.isAvailable && (!digest.isDeferred || digest.isHydrated),
  };
  const checklist: SdkworkDashboardActionChecklist = {
    hasRoute: Boolean(digest.route),
    isAvailable: digest.isAvailable,
    isDeferred: digest.isDeferred,
    isHydrated: digest.isHydrated,
    matchesSection: digest.matchesSection,
    matchesSeverity: digest.matchesSeverity,
  };

  const issues: SdkworkDashboardActionReadinessIssue[] = [];
  if (!digest.isAvailable) {
    issues.push("section-disabled");
  }

  if (!digest.matchesSection) {
    issues.push("section-mismatch");
  }

  if (!digest.matchesSeverity) {
    issues.push("severity-mismatch");
  }

  if ((action === "open-section" || action === "open-route") && digest.isDeferred && !digest.isHydrated) {
    issues.push("section-not-hydrated");
  }

  if (action === "open-route" && !digest.route) {
    issues.push("missing-route");
  }

  if (action === "hydrate-section") {
    if (!digest.isDeferred) {
      issues.push("section-not-deferred");
    } else if (digest.isHydrated) {
      issues.push("already-hydrated");
    }
  }

  const ready =
    action === "hydrate-section"
      ? capabilities.canHydrateSection
      : action === "open-route"
        ? capabilities.canOpenRoute
        : capabilities.canOpenSection;

  return {
    capabilities,
    checklist,
    degraded: issues.includes("section-mismatch") || issues.includes("severity-mismatch"),
    issues,
    ready,
  };
}

export function createInitialDashboardDeferredSections(
  sectionIds: readonly string[],
): SdkworkDashboardDeferredSectionsState {
  return Object.fromEntries(toUniqueStrings(sectionIds).map((sectionId) => [sectionId, false] as const));
}

export function mergeDashboardDeferredSections(
  current: SdkworkDashboardDeferredSectionsState,
  patch: Partial<SdkworkDashboardDeferredSectionsState>,
): SdkworkDashboardDeferredSectionsState {
  const nextState: SdkworkDashboardDeferredSectionsState = {
    ...current,
  };

  for (const [sectionId, hydrated] of Object.entries(patch)) {
    if (typeof hydrated === "boolean") {
      nextState[sectionId] = hydrated;
    }
  }

  return {
    ...nextState,
  };
}

export function scheduleDashboardSectionHydration(
  input: ScheduleDashboardSectionHydrationInput,
): () => void {
  const {
    batchDelayMs = 120,
    batches,
    clearScheduledTimeout = (handle) => window.clearTimeout(handle),
    onBatchReady,
    scheduleTimeout = (callback, delay) => window.setTimeout(callback, delay),
    startDelayMs = 80,
  } = input;
  let cancelled = false;
  let nextIndex = 0;
  let scheduledHandle: number | null = null;

  const runNextBatch = () => {
    scheduledHandle = null;
    if (cancelled || nextIndex >= batches.length) {
      return;
    }

    const batch = batches[nextIndex] ?? [];
    nextIndex += 1;
    onBatchReady(createDeferredSectionPatch(batch));

    if (cancelled || nextIndex >= batches.length) {
      return;
    }

    scheduledHandle = scheduleTimeout(runNextBatch, batchDelayMs);
  };

  scheduledHandle = scheduleTimeout(runNextBatch, startDelayMs);

  return () => {
    cancelled = true;
    if (scheduledHandle !== null) {
      clearScheduledTimeout(scheduledHandle);
      scheduledHandle = null;
    }
  };
}

export function createDashboardWorkspaceManifest({
  description = "Dashboard workspace for cross-capability health, overview composition, and operational routing.",
  host,
  id = "sdkwork-dashboard",
  packageNames = [
    "@sdkwork/dashboard-pc-react",
    "@sdkwork/settings-pc-react",
    "@sdkwork/notification-pc-react",
    "@sdkwork/permission-pc-react",
  ],
  routePath = "/dashboard",
  theme,
  title = "Dashboard",
}: CreateDashboardWorkspaceManifestOptions = {}): SdkworkDashboardWorkspaceManifest {
  return {
    ...createSdkworkAppCapabilityManifest({
      description,
      host,
      id,
      packageNames: toUniquePackages(packageNames),
      theme,
      title,
    }),
    capability: "dashboard",
    detailRoutePattern: `${routePath}/:sectionId`,
    routePath,
  };
}

export function createDashboardOverviewRouteIntent(
  options: CreateDashboardOverviewRouteIntentOptions = {},
): SdkworkDashboardOverviewRouteIntent {
  const queryParams = new URLSearchParams();

  if (options.section) {
    queryParams.set("section", options.section);
  }

  if (options.severity) {
    queryParams.set("severity", options.severity);
  }

  const querySuffix = queryParams.toString() ? `?${queryParams.toString()}` : "";

  return {
    focusWindow: options.focusWindow !== false,
    route: `${options.basePath ?? "/dashboard"}${querySuffix}`,
    ...(options.section ? { section: options.section } : {}),
    ...(options.severity ? { severity: options.severity } : {}),
    source: "dashboard-workspace",
    type: "dashboard-overview-route-intent",
  };
}

export function createDashboardSectionRouteIntent(
  sectionId: string,
  options: CreateDashboardSectionRouteIntentOptions = {},
): SdkworkDashboardSectionRouteIntent {
  return {
    focusWindow: options.focusWindow !== false,
    route: `${options.basePath ?? "/dashboard"}/${sectionId}`,
    sectionId,
    source: "dashboard-workspace",
    type: "dashboard-section-route-intent",
  };
}

export const dashboardPackageMeta = {
  architecture: "pc-react",
  domain: "system",
  package: "@sdkwork/dashboard-pc-react",
  status: "ready",
} as const;

export type DashboardPackageMeta = typeof dashboardPackageMeta;
