import {
  createSdkworkAppCapabilityManifest,
  type CreateSdkworkAppCapabilityManifestOptions,
  type SdkworkAppCapabilityManifest,
} from "@sdkwork/appbase-pc-react";

export type SdkworkChannelKind =
  | "custom"
  | "discord"
  | "email"
  | "feishu"
  | "googlechat"
  | "imessage"
  | "line"
  | "matrix"
  | "msteams"
  | "signal"
  | "slack"
  | "telegram"
  | "webhook"
  | "wecom"
  | "whatsapp";
export type SdkworkChannelRegion = "domestic" | "global";
export type SdkworkChannelStatus =
  | "connected"
  | "degraded"
  | "disabled"
  | "disconnected"
  | "setup-required";
export type SdkworkChannelConnectorDigestStatus =
  | "attention"
  | "connected"
  | "disabled"
  | "issue"
  | "setup";
export type SdkworkChannelSetupIssue =
  | "channel-disabled"
  | "degraded-connection"
  | "disconnected"
  | "missing-fields"
  | "missing-scopes"
  | "setup-required";

export interface SdkworkChannelConnector {
  accountId?: string;
  displayName: string;
  enabled?: boolean;
  id: string;
  kind: SdkworkChannelKind;
  lastActivityAt?: Date | number | string | null;
  mentionCount?: number;
  status: SdkworkChannelStatus;
  unreadCount?: number;
}

export interface CreateChannelConnectorDigestOptions {
  activeChannelId?: string;
  configuredFieldCount?: number;
  requiredFieldCount?: number;
}

export interface SdkworkChannelConnectorDigest {
  configuredFieldCount: number;
  displayName: string;
  hasOfficialDocs: boolean;
  id: string;
  isActive: boolean;
  kind: SdkworkChannelKind;
  lastActivityAt?: Date | number | string | null;
  mentionCount: number;
  region: SdkworkChannelRegion;
  requiredFieldCount: number;
  setupCompletionRatio: number;
  status: SdkworkChannelConnectorDigestStatus;
  unreadCount: number;
}

export interface SdkworkChannelConnectorDigestSummary {
  attentionChannels: number;
  channelsWithOfficialDocs: number;
  connectedChannels: number;
  disabledChannels: number;
  domesticChannels: number;
  globalChannels: number;
  issueChannels: number;
  setupChannels: number;
  totalChannels: number;
  totalUnreadMessages: number;
}

export interface EvaluateChannelSetupReadinessOptions {
  configuredFieldCount?: number;
  grantedScopes?: readonly string[];
  requiredFieldCount?: number;
  requiredScopes?: readonly string[];
  supportsStatusProbe?: boolean;
}

export interface SdkworkChannelSetupProgress {
  configuredFieldCount: number;
  grantedScopeCount: number;
  requiredFieldCount: number;
  requiredScopeCount: number;
  setupCompletionRatio: number;
}

export interface SdkworkChannelSetupReadiness {
  degraded: boolean;
  issues: SdkworkChannelSetupIssue[];
  progress: SdkworkChannelSetupProgress;
  quickActions: SdkworkChannelQuickActions;
  ready: boolean;
}

export interface FilterChannelConnectorsOptions {
  attentionOnly?: boolean;
  query?: string;
  regions?: readonly SdkworkChannelRegion[];
  statuses?: readonly SdkworkChannelStatus[];
}

export interface SdkworkChannelRegionGroups<T> {
  domestic: T[];
  global: T[];
}

export interface SdkworkChannelSummary {
  attentionChannels: number;
  connectedChannels: number;
  degradedChannels: number;
  setupRequiredChannels: number;
  unreadMessages: number;
}

export interface SdkworkChannelQuickActions {
  canDisable: boolean;
  canOpenInbox: boolean;
  canOpenSetup: boolean;
  canRetryConnection: boolean;
  reason?: "channel-disabled" | "setup-required";
}

export interface SdkworkChannelMeta {
  kind: SdkworkChannelKind;
  label: string;
  monogram: string;
  officialUrl?: string;
  region: SdkworkChannelRegion;
}

export interface SdkworkChannelWorkspaceManifest extends SdkworkAppCapabilityManifest {
  capability: "channel";
  detailRoutePattern: string;
  routePath: string;
  setupRoutePattern: string;
}

export interface CreateChannelWorkspaceManifestOptions
  extends Partial<
    Pick<CreateSdkworkAppCapabilityManifestOptions, "description" | "host" | "id" | "packageNames" | "theme" | "title">
  > {
  routePath?: string;
}

export interface SdkworkChannelRouteIntent {
  accountId?: string;
  channelId: string;
  focusWindow: boolean;
  route: string;
  source: "channel-catalog";
  type: "channel-route-intent";
}

export interface CreateChannelRouteIntentOptions {
  accountId?: string;
  basePath?: string;
  focusWindow?: boolean;
}

const channelMetaMap: Record<SdkworkChannelKind, Omit<SdkworkChannelMeta, "kind">> = {
  custom: {
    label: "Custom",
    monogram: "CH",
    region: "global",
  },
  discord: {
    label: "Discord",
    monogram: "DS",
    officialUrl: "https://discord.com/developers/applications",
    region: "global",
  },
  email: {
    label: "Email",
    monogram: "EM",
    region: "global",
  },
  feishu: {
    label: "Feishu",
    monogram: "FS",
    officialUrl: "https://open.feishu.cn/app?lang=zh-CN",
    region: "domestic",
  },
  googlechat: {
    label: "Google Chat",
    monogram: "GC",
    officialUrl: "https://developers.google.com/workspace/chat",
    region: "global",
  },
  imessage: {
    label: "iMessage",
    monogram: "IM",
    region: "global",
  },
  line: {
    label: "LINE",
    monogram: "LI",
    region: "global",
  },
  matrix: {
    label: "Matrix",
    monogram: "MX",
    region: "global",
  },
  msteams: {
    label: "Microsoft Teams",
    monogram: "MT",
    officialUrl: "https://learn.microsoft.com/microsoftteams/platform/overview",
    region: "global",
  },
  signal: {
    label: "Signal",
    monogram: "SG",
    region: "global",
  },
  slack: {
    label: "Slack",
    monogram: "SL",
    officialUrl: "https://api.slack.com/apps",
    region: "global",
  },
  telegram: {
    label: "Telegram",
    monogram: "TG",
    officialUrl: "https://core.telegram.org/bots",
    region: "global",
  },
  webhook: {
    label: "Webhook",
    monogram: "WB",
    region: "global",
  },
  wecom: {
    label: "WeCom",
    monogram: "WC",
    officialUrl:
      "https://work.weixin.qq.com/wework_admin/loginpage_wx?redirect_uri=https%3A%2F%2Fwork.weixin.qq.com%2Fwework_admin%2Fframe",
    region: "domestic",
  },
  whatsapp: {
    label: "WhatsApp",
    monogram: "WA",
    region: "global",
  },
};

function toTimestamp(value: Date | number | string | null | undefined): number {
  if (value === null || value === undefined) {
    return 0;
  }

  const timestamp = value instanceof Date ? value.getTime() : new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function normalizeQuery(value: string | undefined): string {
  return value?.trim().toLowerCase() ?? "";
}

function statusRank(status: SdkworkChannelStatus): number {
  switch (status) {
    case "connected":
      return 0;
    case "degraded":
      return 1;
    case "setup-required":
      return 2;
    case "disconnected":
      return 3;
    case "disabled":
      return 4;
    default:
      return 5;
  }
}

function toUniquePackages(packageNames: readonly string[]): string[] {
  return Array.from(new Set(packageNames.map((packageName) => packageName.trim()).filter(Boolean)));
}

function toPositiveCount(value: number | undefined): number {
  if (value === undefined || !Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.round(value));
}

function toUniqueChannelSetupIssues(
  issues: readonly SdkworkChannelSetupIssue[],
): SdkworkChannelSetupIssue[] {
  const seen = new Set<SdkworkChannelSetupIssue>();
  const uniqueIssues: SdkworkChannelSetupIssue[] = [];

  for (const issue of issues) {
    if (seen.has(issue)) {
      continue;
    }

    seen.add(issue);
    uniqueIssues.push(issue);
  }

  return uniqueIssues;
}

function toSetupCompletionRatio(
  configuredFieldCount: number,
  requiredFieldCount: number,
): number {
  if (requiredFieldCount <= 0) {
    return 1;
  }

  return Math.round((Math.min(configuredFieldCount, requiredFieldCount) / requiredFieldCount) * 100) / 100;
}

function countGrantedScopes(
  grantedScopes: readonly string[] | undefined,
  requiredScopes: readonly string[] | undefined,
): number {
  const required = new Set((requiredScopes ?? []).map((scope) => scope.trim()).filter(Boolean));

  if (required.size === 0) {
    return 0;
  }

  const granted = new Set((grantedScopes ?? []).map((scope) => scope.trim()).filter(Boolean));
  let grantedScopeCount = 0;

  for (const scope of required) {
    if (granted.has(scope)) {
      grantedScopeCount += 1;
    }
  }

  return grantedScopeCount;
}

function resolveChannelConnectorDigestStatus(
  connector: SdkworkChannelConnector,
): SdkworkChannelConnectorDigestStatus {
  if (connector.enabled === false || connector.status === "disabled") {
    return "disabled";
  }

  if (connector.status === "setup-required") {
    return "setup";
  }

  if (connector.status === "degraded" || connector.status === "disconnected") {
    return "issue";
  }

  if ((connector.mentionCount ?? 0) > 0) {
    return "attention";
  }

  return "connected";
}

export function getChannelMeta(
  kind: SdkworkChannelKind,
): SdkworkChannelMeta {
  const meta = channelMetaMap[kind];

  return {
    kind,
    label: meta.label,
    monogram: meta.monogram,
    officialUrl: meta.officialUrl,
    region: meta.region,
  };
}

export function sortChannelConnectors(
  connectors: readonly SdkworkChannelConnector[],
): SdkworkChannelConnector[] {
  return [...connectors].sort((left, right) => {
    const statusDifference = statusRank(left.status) - statusRank(right.status);
    if (statusDifference !== 0) {
      return statusDifference;
    }

    const mentionDifference = (right.mentionCount ?? 0) - (left.mentionCount ?? 0);
    if (mentionDifference !== 0) {
      return mentionDifference;
    }

    const unreadDifference = (right.unreadCount ?? 0) - (left.unreadCount ?? 0);
    if (unreadDifference !== 0) {
      return unreadDifference;
    }

    const activityDifference = toTimestamp(right.lastActivityAt) - toTimestamp(left.lastActivityAt);
    if (activityDifference !== 0) {
      return activityDifference;
    }

    return left.displayName.localeCompare(right.displayName);
  });
}

export function filterChannelConnectors(
  connectors: readonly SdkworkChannelConnector[],
  options: FilterChannelConnectorsOptions = {},
): SdkworkChannelConnector[] {
  const query = normalizeQuery(options.query);
  const regions = options.regions ? new Set(options.regions) : null;
  const statuses = options.statuses ? new Set(options.statuses) : null;

  return sortChannelConnectors(connectors).filter((connector) => {
    if (regions && !regions.has(getChannelMeta(connector.kind).region)) {
      return false;
    }

    if (statuses && !statuses.has(connector.status)) {
      return false;
    }

    if (options.attentionOnly && (connector.mentionCount ?? 0) <= 0) {
      return false;
    }

    if (!query) {
      return true;
    }

    return (
      connector.displayName.toLowerCase().includes(query) ||
      connector.kind.toLowerCase().includes(query) ||
      connector.accountId?.toLowerCase().includes(query) === true
    );
  });
}

export function partitionChannelConnectorsByRegion(
  connectors: readonly SdkworkChannelConnector[],
): SdkworkChannelRegionGroups<SdkworkChannelConnector> {
  return connectors.reduce<SdkworkChannelRegionGroups<SdkworkChannelConnector>>(
    (groups, connector) => {
      groups[getChannelMeta(connector.kind).region].push(connector);
      return groups;
    },
    {
      domestic: [],
      global: [],
    },
  );
}

export function summarizeChannelConnectors(
  connectors: readonly SdkworkChannelConnector[],
): SdkworkChannelSummary {
  return {
    attentionChannels: connectors.filter((connector) => (connector.mentionCount ?? 0) > 0).length,
    connectedChannels: connectors.filter((connector) => connector.status === "connected").length,
    degradedChannels: connectors.filter((connector) => connector.status === "degraded").length,
    setupRequiredChannels: connectors.filter((connector) => connector.status === "setup-required").length,
    unreadMessages: connectors.reduce((sum, connector) => sum + (connector.unreadCount ?? 0), 0),
  };
}

export function createChannelConnectorDigest(
  connector: SdkworkChannelConnector,
  options: CreateChannelConnectorDigestOptions = {},
): SdkworkChannelConnectorDigest {
  const meta = getChannelMeta(connector.kind);
  const configuredFieldCount = toPositiveCount(options.configuredFieldCount);
  const requiredFieldCount = toPositiveCount(options.requiredFieldCount);

  return {
    configuredFieldCount,
    displayName: connector.displayName,
    hasOfficialDocs: Boolean(meta.officialUrl),
    id: connector.id,
    isActive: connector.id === options.activeChannelId,
    kind: connector.kind,
    ...(connector.lastActivityAt !== undefined ? { lastActivityAt: connector.lastActivityAt } : {}),
    mentionCount: connector.mentionCount ?? 0,
    region: meta.region,
    requiredFieldCount,
    setupCompletionRatio: toSetupCompletionRatio(configuredFieldCount, requiredFieldCount),
    status: resolveChannelConnectorDigestStatus(connector),
    unreadCount: connector.unreadCount ?? 0,
  };
}

export function summarizeChannelConnectorDigests(
  digests: readonly SdkworkChannelConnectorDigest[],
): SdkworkChannelConnectorDigestSummary {
  let attentionChannels = 0;
  let channelsWithOfficialDocs = 0;
  let connectedChannels = 0;
  let disabledChannels = 0;
  let domesticChannels = 0;
  let globalChannels = 0;
  let issueChannels = 0;
  let setupChannels = 0;
  let totalUnreadMessages = 0;

  for (const digest of digests) {
    totalUnreadMessages += digest.unreadCount;

    if (digest.hasOfficialDocs) {
      channelsWithOfficialDocs += 1;
    }

    if (digest.region === "domestic") {
      domesticChannels += 1;
    } else {
      globalChannels += 1;
    }

    switch (digest.status) {
      case "attention":
        attentionChannels += 1;
        break;
      case "connected":
        connectedChannels += 1;
        break;
      case "disabled":
        disabledChannels += 1;
        break;
      case "issue":
        issueChannels += 1;
        break;
      case "setup":
        setupChannels += 1;
        break;
      default:
        break;
    }
  }

  return {
    attentionChannels,
    channelsWithOfficialDocs,
    connectedChannels,
    disabledChannels,
    domesticChannels,
    globalChannels,
    issueChannels,
    setupChannels,
    totalChannels: digests.length,
    totalUnreadMessages,
  };
}

export function resolveChannelQuickActions(
  connector: SdkworkChannelConnector,
): SdkworkChannelQuickActions {
  if (connector.status === "disabled" || connector.enabled === false) {
    return {
      canDisable: false,
      canOpenInbox: false,
      canOpenSetup: true,
      canRetryConnection: false,
      reason: "channel-disabled",
    };
  }

  if (connector.status === "setup-required") {
    return {
      canDisable: false,
      canOpenInbox: false,
      canOpenSetup: true,
      canRetryConnection: false,
      reason: "setup-required",
    };
  }

  if (connector.status === "connected") {
    return {
      canDisable: true,
      canOpenInbox: true,
      canOpenSetup: false,
      canRetryConnection: false,
      reason: undefined,
    };
  }

  return {
    canDisable: true,
    canOpenInbox: false,
    canOpenSetup: true,
    canRetryConnection: true,
    reason: undefined,
  };
}

export function evaluateChannelSetupReadiness(
  connector: SdkworkChannelConnector,
  options: EvaluateChannelSetupReadinessOptions = {},
): SdkworkChannelSetupReadiness {
  const configuredFieldCount = toPositiveCount(options.configuredFieldCount);
  const requiredFieldCount = toPositiveCount(options.requiredFieldCount);
  const requiredScopeCount = (options.requiredScopes ?? []).map((scope) => scope.trim()).filter(Boolean).length;
  const grantedScopeCount = countGrantedScopes(options.grantedScopes, options.requiredScopes);
  const progress: SdkworkChannelSetupProgress = {
    configuredFieldCount,
    grantedScopeCount,
    requiredFieldCount,
    requiredScopeCount,
    setupCompletionRatio: toSetupCompletionRatio(configuredFieldCount, requiredFieldCount),
  };
  const issues = toUniqueChannelSetupIssues([
    ...(connector.enabled === false || connector.status === "disabled" ? ["channel-disabled" as const] : []),
    ...(connector.status === "degraded" ? ["degraded-connection" as const] : []),
    ...(connector.status === "disconnected" ? ["disconnected" as const] : []),
    ...(connector.status === "setup-required" ? ["setup-required" as const] : []),
    ...(configuredFieldCount < requiredFieldCount ? ["missing-fields" as const] : []),
    ...(grantedScopeCount < requiredScopeCount ? ["missing-scopes" as const] : []),
  ]);
  const blockedIssues = new Set<SdkworkChannelSetupIssue>([
    "channel-disabled",
    "disconnected",
    "missing-fields",
    "missing-scopes",
    "setup-required",
  ]);

  return {
    degraded: issues.includes("degraded-connection"),
    issues,
    progress,
    quickActions: resolveChannelQuickActions(connector),
    ready: issues.every((issue) => !blockedIssues.has(issue)),
  };
}

export function createChannelWorkspaceManifest({
  description = "Channel workspace for connector catalogs, inbox routing, and setup entry points.",
  host,
  id = "sdkwork-channel",
  packageNames = ["@sdkwork/channel-pc-react"],
  routePath = "/channels",
  theme,
  title = "Channels",
}: CreateChannelWorkspaceManifestOptions = {}): SdkworkChannelWorkspaceManifest {
  return {
    ...createSdkworkAppCapabilityManifest({
      description,
      host,
      id,
      packageNames: toUniquePackages(packageNames),
      theme,
      title,
    }),
    capability: "channel",
    detailRoutePattern: `${routePath}/:channelId`,
    routePath,
    setupRoutePattern: `${routePath}/:channelId/setup`,
  };
}

export function createChannelRouteIntent(
  channelId: string,
  options: CreateChannelRouteIntentOptions = {},
): SdkworkChannelRouteIntent {
  const accountSuffix = options.accountId ? `?account=${encodeURIComponent(options.accountId)}` : "";

  return {
    accountId: options.accountId,
    channelId,
    focusWindow: options.focusWindow !== false,
    route: `${options.basePath ?? "/channels"}/${channelId}${accountSuffix}`,
    source: "channel-catalog",
    type: "channel-route-intent",
  };
}

export const channelPackageMeta = {
  architecture: "pc-react",
  domain: "communication",
  package: "@sdkwork/channel-pc-react",
  status: "ready",
} as const;

export type ChannelPackageMeta = typeof channelPackageMeta;
