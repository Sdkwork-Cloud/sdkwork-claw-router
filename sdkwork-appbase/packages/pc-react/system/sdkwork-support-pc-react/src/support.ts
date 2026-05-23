import {
  createSdkworkAppCapabilityManifest,
  type CreateSdkworkAppCapabilityManifestOptions,
  type SdkworkAppCapabilityManifest,
} from "@sdkwork/appbase-pc-react";

export type SdkworkSupportCaseSeverity = "critical" | "high" | "low" | "normal";
export type SdkworkSupportChannelKind =
  | "business"
  | "chat"
  | "community"
  | "email"
  | "ticket";
export type SdkworkSupportOverviewStatus = "attention" | "monitoring" | "stable";
export type SdkworkSupportSystemStatus =
  | "degraded"
  | "maintenance"
  | "operational"
  | "outage";

export interface SdkworkSupportCategory {
  description?: string;
  enabled?: boolean;
  id: string;
  priority: number;
  title: string;
}

export interface SdkworkSupportFaq {
  answer: string;
  categoryId?: string;
  id: string;
  priority: number;
  question: string;
  tags?: readonly string[];
}

export interface SdkworkSupportSystemSignal {
  detail?: string;
  id: string;
  priority: number;
  route?: string;
  status: SdkworkSupportSystemStatus;
  title: string;
}

export interface SdkworkSupportChannel {
  categoryIds?: readonly string[];
  id: string;
  kind: SdkworkSupportChannelKind;
  maxSeverity?: SdkworkSupportCaseSeverity;
  priority: number;
  recommended?: boolean;
  route: string;
  supportsHuman?: boolean;
  title: string;
}

export interface SdkworkSupportQuickLink {
  categoryIds?: readonly string[];
  description?: string;
  id: string;
  priority: number;
  route: string;
  title: string;
}

export interface SdkworkSupportSystemSummary {
  attentionIds: string[];
  highestStatus: SdkworkSupportSystemStatus;
  operationalIds: string[];
  statusCounts: Record<SdkworkSupportSystemStatus, number>;
}

export interface RecommendSupportChannelsOptions {
  categoryId?: string;
  prefersHuman?: boolean;
  severity?: SdkworkSupportCaseSeverity;
}

export interface SdkworkSupportCategorySummary {
  channelIds: string[];
  faqIds: string[];
  id: string;
  priority: number;
  quickLinkIds: string[];
  title: string;
}

export interface SdkworkSupportOverview {
  categorySummaries: SdkworkSupportCategorySummary[];
  featuredFaqIds: string[];
  quickLinkIds: string[];
  recommendedChannelIds: string[];
  status: SdkworkSupportOverviewStatus;
  systemAttentionIds: string[];
}

export interface BuildSupportOverviewInput {
  categories: readonly SdkworkSupportCategory[];
  channels: readonly SdkworkSupportChannel[];
  faqs: readonly SdkworkSupportFaq[];
  quickLinks: readonly SdkworkSupportQuickLink[];
  systemSignals: readonly SdkworkSupportSystemSignal[];
}

export type SdkworkSupportChannelDigestStatus = "available" | "recommended" | "restricted" | "standby";

export interface CreateSupportChannelDigestOptions extends RecommendSupportChannelsOptions {
  activeChannelId?: string;
}

export interface SdkworkSupportChannelDigest {
  categoryMatch: boolean;
  digestStatus: SdkworkSupportChannelDigestStatus;
  id: string;
  isActive: boolean;
  isRecommended: boolean;
  kind: SdkworkSupportChannelKind;
  maxSeverity?: SdkworkSupportCaseSeverity;
  route: string;
  supportsHuman: boolean;
  supportsRequestedSeverity: boolean;
  title: string;
}

export interface SdkworkSupportChannelDigestSummary {
  humanChannels: number;
  readyChannels: number;
  recommendedChannels: number;
  restrictedChannels: number;
  standbyChannels: number;
  ticketChannels: number;
  totalChannels: number;
}

export type SdkworkSupportEscalationIssue =
  | "category-mismatch"
  | "human-support-required"
  | "incident-active"
  | "severity-unsupported";

export interface EvaluateSupportEscalationReadinessOptions extends RecommendSupportChannelsOptions {
  requiresHuman?: boolean;
  systemSignals?: readonly SdkworkSupportSystemSignal[];
}

export interface SdkworkSupportEscalationCapabilities {
  acceptsSeverity: boolean;
  canEscalate: boolean;
  categoryMatch: boolean;
  supportsHuman: boolean;
}

export interface SdkworkSupportEscalationReadiness {
  capabilities: SdkworkSupportEscalationCapabilities;
  degraded: boolean;
  issues: SdkworkSupportEscalationIssue[];
  ready: boolean;
}

export interface SdkworkSupportWorkspaceManifest extends SdkworkAppCapabilityManifest {
  capability: "support";
  channelRoutePattern: string;
  routePath: string;
}

export interface CreateSupportWorkspaceManifestOptions
  extends Partial<
    Pick<CreateSdkworkAppCapabilityManifestOptions, "description" | "host" | "id" | "packageNames" | "theme" | "title">
  > {
  routePath?: string;
}

export interface SdkworkSupportRouteIntent {
  categoryId?: string;
  focusWindow: boolean;
  query?: string;
  route: string;
  source: "support-workspace";
  type: "support-route-intent";
}

export interface CreateSupportRouteIntentOptions {
  basePath?: string;
  categoryId?: string;
  focusWindow?: boolean;
  query?: string;
}

export interface SdkworkSupportEscalationRouteIntent {
  categoryId?: string;
  channelId: string;
  focusWindow: boolean;
  route: string;
  severity?: SdkworkSupportCaseSeverity;
  source: "support-workspace";
  type: "support-escalation-route-intent";
}

export interface CreateSupportEscalationRouteIntentOptions {
  basePath?: string;
  categoryId?: string;
  focusWindow?: boolean;
  severity?: SdkworkSupportCaseSeverity;
}

const SYSTEM_STATUS_ORDER: readonly SdkworkSupportSystemStatus[] = [
  "outage",
  "degraded",
  "maintenance",
  "operational",
];
const SEVERITY_ORDER: readonly SdkworkSupportCaseSeverity[] = [
  "low",
  "normal",
  "high",
  "critical",
];
const CHANNEL_KIND_ORDER: readonly SdkworkSupportChannelKind[] = [
  "ticket",
  "chat",
  "email",
  "business",
  "community",
];

function isEnabled(value: { enabled?: boolean }): boolean {
  return value.enabled !== false;
}

function comparePriorityTitle(
  left: { priority: number; title: string },
  right: { priority: number; title: string },
): number {
  if (left.priority !== right.priority) {
    return left.priority - right.priority;
  }

  return left.title.localeCompare(right.title);
}

function normalizeQuery(value: string): string {
  return value.trim().toLowerCase();
}

function toUniqueStrings(values: readonly string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function toUniquePackages(packageNames: readonly string[]): string[] {
  return toUniqueStrings(packageNames);
}

function normalizeBasePath(basePath: string | undefined): string {
  const normalized = (basePath ?? "/support").trim();
  if (!normalized || normalized === "/") {
    return "/support";
  }

  return normalized.endsWith("/") ? normalized.slice(0, -1) : normalized;
}

function compareSystemStatus(
  left: SdkworkSupportSystemStatus,
  right: SdkworkSupportSystemStatus,
): number {
  return SYSTEM_STATUS_ORDER.indexOf(left) - SYSTEM_STATUS_ORDER.indexOf(right);
}

function supportsSeverity(
  channel: SdkworkSupportChannel,
  severity: SdkworkSupportCaseSeverity,
): boolean {
  if (!channel.maxSeverity) {
    return true;
  }

  return SEVERITY_ORDER.indexOf(channel.maxSeverity) >= SEVERITY_ORDER.indexOf(severity);
}

function isCategoryRelevant(
  value: { categoryIds?: readonly string[] },
  categoryId: string,
): boolean {
  return value.categoryIds?.length ? value.categoryIds.includes(categoryId) : true;
}

function channelRecommendationScore(
  channel: SdkworkSupportChannel,
  options: RecommendSupportChannelsOptions,
): number {
  let score = 0;

  if (options.categoryId && isCategoryRelevant(channel, options.categoryId)) {
    score += channel.categoryIds?.includes(options.categoryId) ? 4 : 1;
  }

  if (options.severity ? supportsSeverity(channel, options.severity) : true) {
    score += 2;
  }

  if (options.prefersHuman && channel.supportsHuman === true) {
    score += 1;
  }

  if (channel.recommended === true) {
    score += 1;
  }

  return score;
}

function resolveSupportChannelDigestStatus(
  channel: SdkworkSupportChannel,
  options: RecommendSupportChannelsOptions,
): SdkworkSupportChannelDigestStatus {
  const severity = options.severity ?? "normal";
  const categoryMatch = options.categoryId ? isCategoryRelevant(channel, options.categoryId) : true;

  if (!supportsSeverity(channel, severity)) {
    return "restricted";
  }

  if (channel.recommended === true && categoryMatch) {
    return "recommended";
  }

  if (!categoryMatch) {
    return "standby";
  }

  return "available";
}

function toUniqueSupportEscalationIssues(
  issues: readonly SdkworkSupportEscalationIssue[],
): SdkworkSupportEscalationIssue[] {
  return Array.from(new Set(issues));
}

function sortSupportFaqs(faqs: readonly SdkworkSupportFaq[]): SdkworkSupportFaq[] {
  return [...faqs].sort((left, right) => {
    if (left.priority !== right.priority) {
      return left.priority - right.priority;
    }

    return left.question.localeCompare(right.question);
  });
}

function sortSupportChannels(
  channels: readonly SdkworkSupportChannel[],
  options: RecommendSupportChannelsOptions,
): SdkworkSupportChannel[] {
  return [...channels].sort((left, right) => {
    const scoreDifference =
      channelRecommendationScore(right, options) - channelRecommendationScore(left, options);
    if (scoreDifference !== 0) {
      return scoreDifference;
    }

    const leftKindOrder = CHANNEL_KIND_ORDER.indexOf(left.kind);
    const rightKindOrder = CHANNEL_KIND_ORDER.indexOf(right.kind);
    if (leftKindOrder !== rightKindOrder) {
      return leftKindOrder - rightKindOrder;
    }

    const priorityDifference = comparePriorityTitle(left, right);
    if (priorityDifference !== 0) {
      return priorityDifference;
    }

    return left.id.localeCompare(right.id);
  });
}

function createStatusCounts(): Record<SdkworkSupportSystemStatus, number> {
  return {
    degraded: 0,
    maintenance: 0,
    operational: 0,
    outage: 0,
  };
}

export function filterSupportFaqs(
  faqs: readonly SdkworkSupportFaq[],
  query: string,
): SdkworkSupportFaq[] {
  const normalizedQuery = normalizeQuery(query);
  const sortedFaqs = sortSupportFaqs(faqs);

  if (!normalizedQuery) {
    return sortedFaqs;
  }

  return sortedFaqs.filter((faq) => {
    const tagText = faq.tags?.join(" ").toLowerCase() ?? "";
    return (
      faq.question.toLowerCase().includes(normalizedQuery) ||
      faq.answer.toLowerCase().includes(normalizedQuery) ||
      tagText.includes(normalizedQuery)
    );
  });
}

export function summarizeSupportSystemStatus(
  signals: readonly SdkworkSupportSystemSignal[],
): SdkworkSupportSystemSummary {
  const sortedSignals = [...signals].sort((left, right) => {
    const statusDifference = compareSystemStatus(left.status, right.status);
    if (statusDifference !== 0) {
      return statusDifference;
    }

    return comparePriorityTitle(left, right);
  });
  const statusCounts = createStatusCounts();

  for (const signal of sortedSignals) {
    statusCounts[signal.status] += 1;
  }

  return {
    attentionIds: sortedSignals
      .filter((signal) => signal.status === "outage" || signal.status === "degraded")
      .map((signal) => signal.id),
    highestStatus: sortedSignals[0]?.status ?? "operational",
    operationalIds: sortedSignals
      .filter((signal) => signal.status === "operational")
      .map((signal) => signal.id),
    statusCounts,
  };
}

export function recommendSupportChannels(
  channels: readonly SdkworkSupportChannel[],
  options: RecommendSupportChannelsOptions = {},
): string[] {
  const severity = options.severity ?? "normal";
  const supportedChannels = channels.filter((channel) => supportsSeverity(channel, severity));
  const candidateChannels = supportedChannels.length > 0 ? supportedChannels : [...channels];

  return sortSupportChannels(candidateChannels, {
    ...options,
    severity,
  }).map((channel) => channel.id);
}

export function createSupportChannelDigest(
  channel: SdkworkSupportChannel,
  options: CreateSupportChannelDigestOptions = {},
): SdkworkSupportChannelDigest {
  const severity = options.severity ?? "normal";
  const categoryMatch = options.categoryId ? isCategoryRelevant(channel, options.categoryId) : true;

  return {
    categoryMatch,
    digestStatus: resolveSupportChannelDigestStatus(channel, {
      ...options,
      severity,
    }),
    id: channel.id,
    isActive: channel.id === options.activeChannelId,
    isRecommended: channel.recommended === true,
    kind: channel.kind,
    ...(channel.maxSeverity ? { maxSeverity: channel.maxSeverity } : {}),
    route: channel.route,
    supportsHuman: channel.supportsHuman === true,
    supportsRequestedSeverity: supportsSeverity(channel, severity),
    title: channel.title,
  };
}

export function summarizeSupportChannelDigests(
  digests: readonly SdkworkSupportChannelDigest[],
): SdkworkSupportChannelDigestSummary {
  let humanChannels = 0;
  let readyChannels = 0;
  let recommendedChannels = 0;
  let restrictedChannels = 0;
  let standbyChannels = 0;
  let ticketChannels = 0;

  for (const digest of digests) {
    if (digest.supportsHuman) {
      humanChannels += 1;
    }

    if (digest.digestStatus !== "restricted") {
      readyChannels += 1;
    }

    if (digest.digestStatus === "recommended") {
      recommendedChannels += 1;
    }

    if (digest.digestStatus === "restricted") {
      restrictedChannels += 1;
    }

    if (digest.digestStatus === "standby") {
      standbyChannels += 1;
    }

    if (digest.kind === "ticket") {
      ticketChannels += 1;
    }
  }

  return {
    humanChannels,
    readyChannels,
    recommendedChannels,
    restrictedChannels,
    standbyChannels,
    ticketChannels,
    totalChannels: digests.length,
  };
}

export function evaluateSupportEscalationReadiness(
  channel: SdkworkSupportChannel,
  options: EvaluateSupportEscalationReadinessOptions = {},
): SdkworkSupportEscalationReadiness {
  const severity = options.severity ?? "normal";
  const categoryMatch = options.categoryId ? isCategoryRelevant(channel, options.categoryId) : true;
  const acceptsSeverity = supportsSeverity(channel, severity);
  const supportsHumanRouting = channel.supportsHuman === true;
  const incidentActive = options.systemSignals
    ? summarizeSupportSystemStatus(options.systemSignals).highestStatus !== "operational"
    : false;
  const issues = toUniqueSupportEscalationIssues([
    ...(acceptsSeverity ? [] : ["severity-unsupported" as const]),
    ...(!options.requiresHuman || supportsHumanRouting ? [] : ["human-support-required" as const]),
    ...(categoryMatch ? [] : ["category-mismatch" as const]),
    ...(incidentActive ? ["incident-active" as const] : []),
  ]);
  const blockedIssues = new Set<SdkworkSupportEscalationIssue>([
    "severity-unsupported",
    "human-support-required",
  ]);
  const ready = issues.every((issue) => !blockedIssues.has(issue));
  const capabilities: SdkworkSupportEscalationCapabilities = {
    acceptsSeverity,
    canEscalate: ready,
    categoryMatch,
    supportsHuman: supportsHumanRouting,
  };

  return {
    capabilities,
    degraded: ready && issues.length > 0,
    issues,
    ready,
  };
}

export function buildSupportOverview(
  input: BuildSupportOverviewInput,
): SdkworkSupportOverview {
  const activeCategories = input.categories
    .filter((category) => isEnabled(category))
    .sort(comparePriorityTitle);
  const activeCategoryIds = new Set(activeCategories.map((category) => category.id));
  const sortedQuickLinks = [...input.quickLinks].sort(comparePriorityTitle);
  const systemSummary = summarizeSupportSystemStatus(input.systemSignals);

  const categorySummaries = activeCategories.map((category) => {
    const faqIds = filterSupportFaqs(
      input.faqs.filter(
        (faq) => !faq.categoryId || (activeCategoryIds.has(faq.categoryId) && faq.categoryId === category.id),
      ),
      "",
    ).map((faq) => faq.id);
    const quickLinkIds = sortedQuickLinks
      .filter((link) => isCategoryRelevant(link, category.id))
      .map((link) => link.id);
    const channelIds = recommendSupportChannels(
      input.channels.filter((channel) => isCategoryRelevant(channel, category.id)),
      {
        categoryId: category.id,
        severity: "normal",
      },
    );

    return {
      channelIds,
      faqIds,
      id: category.id,
      priority: category.priority,
      quickLinkIds,
      title: category.title,
    } satisfies SdkworkSupportCategorySummary;
  });

  const status: SdkworkSupportOverviewStatus =
    systemSummary.highestStatus === "outage"
      ? "attention"
      : systemSummary.highestStatus === "degraded" || systemSummary.highestStatus === "maintenance"
        ? "monitoring"
        : "stable";

  return {
    categorySummaries,
    featuredFaqIds: filterSupportFaqs(
      input.faqs.filter((faq) => !faq.categoryId || activeCategoryIds.has(faq.categoryId)),
      "",
    )
      .slice(0, 3)
      .map((faq) => faq.id),
    quickLinkIds: sortedQuickLinks.map((link) => link.id),
    recommendedChannelIds: recommendSupportChannels(input.channels, {
      prefersHuman: true,
      severity: "high",
    }).slice(0, 3),
    status,
    systemAttentionIds: systemSummary.attentionIds,
  };
}

export function createSupportWorkspaceManifest({
  description = "Support workspace for FAQ discovery, escalation routing, and operational help surfaces.",
  host,
  id = "sdkwork-support",
  packageNames = [
    "@sdkwork/support-pc-react",
    "@sdkwork/docs-pc-react",
  ],
  routePath = "/support",
  theme,
  title = "Support",
}: CreateSupportWorkspaceManifestOptions = {}): SdkworkSupportWorkspaceManifest {
  return {
    ...createSdkworkAppCapabilityManifest({
      description,
      host,
      id,
      packageNames: toUniquePackages(packageNames),
      theme,
      title,
    }),
    capability: "support",
    channelRoutePattern: `${routePath}/channels/:channelId`,
    routePath,
  };
}

export function createSupportRouteIntent(
  options: CreateSupportRouteIntentOptions = {},
): SdkworkSupportRouteIntent {
  const queryParams = new URLSearchParams();
  if (options.categoryId) {
    queryParams.set("category", options.categoryId);
  }

  if (options.query) {
    queryParams.set("query", options.query);
  }

  const querySuffix = queryParams.toString() ? `?${queryParams.toString()}` : "";

  return {
    ...(options.categoryId ? { categoryId: options.categoryId } : {}),
    focusWindow: options.focusWindow !== false,
    ...(options.query ? { query: options.query } : {}),
    route: `${normalizeBasePath(options.basePath)}${querySuffix}`,
    source: "support-workspace",
    type: "support-route-intent",
  };
}

export function createSupportEscalationRouteIntent(
  channelId: string,
  options: CreateSupportEscalationRouteIntentOptions = {},
): SdkworkSupportEscalationRouteIntent {
  const queryParams = new URLSearchParams();
  if (options.categoryId) {
    queryParams.set("category", options.categoryId);
  }

  if (options.severity) {
    queryParams.set("severity", options.severity);
  }

  const querySuffix = queryParams.toString() ? `?${queryParams.toString()}` : "";

  return {
    ...(options.categoryId ? { categoryId: options.categoryId } : {}),
    channelId,
    focusWindow: options.focusWindow !== false,
    route: `${normalizeBasePath(options.basePath)}/channels/${channelId}${querySuffix}`,
    ...(options.severity ? { severity: options.severity } : {}),
    source: "support-workspace",
    type: "support-escalation-route-intent",
  };
}

export const supportPackageMeta = {
  architecture: "pc-react",
  domain: "system",
  package: "@sdkwork/support-pc-react",
  status: "ready",
} as const;

export type SupportPackageMeta = typeof supportPackageMeta;
