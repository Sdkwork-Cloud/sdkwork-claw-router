import {
  createSdkworkAppCapabilityManifest,
  type CreateSdkworkAppCapabilityManifestOptions,
  type SdkworkAppCapabilityManifest,
} from "@sdkwork/appbase-pc-react";

export type SdkworkImConnectionStatus =
  | "connecting"
  | "degraded"
  | "offline"
  | "online"
  | "reconnecting";
export type SdkworkImConversationKind =
  | "assistant"
  | "channel"
  | "direct"
  | "group"
  | "system";
export type SdkworkImMessageKind =
  | "audio"
  | "event"
  | "file"
  | "image"
  | "system"
  | "text"
  | "video";
export type SdkworkImMessageStatus =
  | "delivered"
  | "draft"
  | "failed"
  | "read"
  | "sending"
  | "sent";

export interface SdkworkImParticipant {
  avatarUrl?: string;
  id: string;
  isBot?: boolean;
  name: string;
  presence?: "away" | "busy" | "offline" | "online";
}

export interface SdkworkImConversation {
  id: string;
  isArchived?: boolean;
  isMuted?: boolean;
  isPinned?: boolean;
  isReadOnly?: boolean;
  kind: SdkworkImConversationKind;
  lastActivityAt?: Date | number | string | null;
  mentionCount?: number;
  participants?: readonly SdkworkImParticipant[];
  preview?: string;
  tags?: readonly string[];
  title: string;
  unreadCount?: number;
}

export interface SdkworkImAttachment {
  id: string;
  mimeType?: string;
  name?: string;
  sizeBytes?: number;
  type: Extract<SdkworkImMessageKind, "audio" | "file" | "image" | "video">;
  url: string;
}

export interface SdkworkImMessage {
  attachments?: readonly SdkworkImAttachment[];
  authorId: string;
  authorName: string;
  content: string;
  conversationId: string;
  createdAt: Date | number | string;
  id: string;
  isOwn?: boolean;
  kind: SdkworkImMessageKind;
  status: SdkworkImMessageStatus;
}

export interface FilterImConversationsOptions {
  includeArchived?: boolean;
  kinds?: readonly SdkworkImConversationKind[];
  onlyUnread?: boolean;
  query?: string;
}

export interface SdkworkImUnreadSummary {
  hasAttentionDemand: boolean;
  mentionedMessages: number;
  mutedMessages: number;
  unreadConversations: number;
  unreadMessages: number;
}

export type SdkworkImConversationDigestStatus =
  | "archived"
  | "attention"
  | "muted-unread"
  | "pinned"
  | "quiet";

export interface CreateImConversationDigestOptions {
  activeConversationId?: string;
}

export interface SdkworkImConversationDigest {
  id: string;
  isActive: boolean;
  isArchived?: boolean;
  isMuted?: boolean;
  isPinned?: boolean;
  kind: SdkworkImConversationKind;
  lastActivityAt?: Date | number | string | null;
  mentionCount: number;
  participantCount: number;
  preview?: string;
  status: SdkworkImConversationDigestStatus;
  title: string;
  unreadCount: number;
}

export interface SdkworkImConversationDigestSummary {
  archivedConversations: number;
  attentionConversations: number;
  mutedConversations: number;
  pinnedConversations: number;
  totalConversations: number;
  totalUnreadMessages: number;
  unreadConversations: number;
}

export type SdkworkImMessageClusterPosition = "end" | "middle" | "single" | "start";

export interface SdkworkImTimelineItem extends SdkworkImMessage {
  clusterPosition: SdkworkImMessageClusterPosition;
}

export interface SdkworkImTimelineGroup {
  dateKey: string;
  items: SdkworkImTimelineItem[];
  label: string;
}

export interface ResolveImComposerCapabilitiesOptions {
  connectionStatus?: SdkworkImConnectionStatus;
}

export interface SdkworkImComposerCapabilities {
  canAttachFiles: boolean;
  canRecordAudio: boolean;
  canSendMessages: boolean;
  canUseCommands: boolean;
  reason?: "archived" | "offline" | "read-only";
}

export interface SdkworkImSendDraft {
  attachments?: readonly SdkworkImAttachment[];
  text?: string;
}

export type SdkworkImSendIssue = "archived" | "degraded-connection" | "empty-draft" | "offline" | "read-only";

export interface SdkworkImSendPayload {
  attachmentCount: number;
  attachments: readonly SdkworkImAttachment[];
  conversationId: string;
  hasAttachments: boolean;
  hasText: boolean;
  text: string;
}

export interface SdkworkImSendReadiness {
  capabilities: SdkworkImComposerCapabilities;
  degraded: boolean;
  issues: SdkworkImSendIssue[];
  payload?: SdkworkImSendPayload;
  ready: boolean;
}

export interface SdkworkImWorkspaceManifest extends SdkworkAppCapabilityManifest {
  badgeBehavior: "mentions-first" | "unread-only";
  capability: "im";
  detailRoutePattern: string;
  routePath: string;
}

export interface CreateImWorkspaceManifestOptions
  extends Partial<
    Pick<CreateSdkworkAppCapabilityManifestOptions, "description" | "host" | "id" | "packageNames" | "theme" | "title">
  > {
  badgeBehavior?: "mentions-first" | "unread-only";
  conversationRouteSegment?: string;
  routePath?: string;
}

export interface SdkworkImDesktopNotificationIntent {
  body: string;
  conversationId: string;
  focusWindow: boolean;
  messageId?: string;
  route: string;
  source: "desktop-notification";
  title: string;
  type: "im-notification-intent";
}

export interface CreateImDesktopNotificationIntentOptions {
  basePath?: string;
  body: string;
  conversationId: string;
  conversationTitle: string;
  focusWindow?: boolean;
  messageId?: string;
}

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

function toDateKey(value: Date | number | string): string {
  const timestamp = toTimestamp(value);
  return new Date(timestamp).toISOString().slice(0, 10);
}

function includesNormalized(value: string | undefined, query: string): boolean {
  return Boolean(value?.toLowerCase().includes(query));
}

function matchesConversationQuery(conversation: SdkworkImConversation, query: string): boolean {
  if (!query) {
    return true;
  }

  return (
    includesNormalized(conversation.title, query) ||
    includesNormalized(conversation.preview, query) ||
    Boolean(conversation.tags?.some((tag) => tag.toLowerCase().includes(query)))
  );
}

function toUniquePackages(packageNames: readonly string[]): string[] {
  return Array.from(new Set(packageNames.map((packageName) => packageName.trim()).filter(Boolean)));
}

function toUniqueSendIssues(issues: readonly SdkworkImSendIssue[]): SdkworkImSendIssue[] {
  const seen = new Set<SdkworkImSendIssue>();
  const uniqueIssues: SdkworkImSendIssue[] = [];

  for (const issue of issues) {
    if (seen.has(issue)) {
      continue;
    }

    seen.add(issue);
    uniqueIssues.push(issue);
  }

  return uniqueIssues;
}

function resolveConversationDigestStatus(
  conversation: SdkworkImConversation,
): SdkworkImConversationDigestStatus {
  const unreadCount = conversation.unreadCount ?? 0;
  const mentionCount = conversation.mentionCount ?? 0;

  if (conversation.isArchived) {
    return "archived";
  }

  if (mentionCount > 0 || (unreadCount > 0 && !conversation.isMuted)) {
    return "attention";
  }

  if (conversation.isMuted && unreadCount > 0) {
    return "muted-unread";
  }

  if (conversation.isPinned) {
    return "pinned";
  }

  return "quiet";
}

function buildClusterPosition(
  previousMessage: SdkworkImMessage | undefined,
  currentMessage: SdkworkImMessage,
  nextMessage: SdkworkImMessage | undefined,
): SdkworkImMessageClusterPosition {
  const withinThreadWindowMs = 5 * 60 * 1000;
  const continuesFromPrevious =
    previousMessage?.authorId === currentMessage.authorId &&
    toDateKey(previousMessage.createdAt) === toDateKey(currentMessage.createdAt) &&
    toTimestamp(currentMessage.createdAt) - toTimestamp(previousMessage.createdAt) <= withinThreadWindowMs;
  const continuesWithNext =
    nextMessage?.authorId === currentMessage.authorId &&
    toDateKey(nextMessage.createdAt) === toDateKey(currentMessage.createdAt) &&
    toTimestamp(nextMessage.createdAt) - toTimestamp(currentMessage.createdAt) <= withinThreadWindowMs;

  if (continuesFromPrevious && continuesWithNext) {
    return "middle";
  }

  if (continuesFromPrevious) {
    return "end";
  }

  if (continuesWithNext) {
    return "start";
  }

  return "single";
}

export function sortImConversations(
  conversations: readonly SdkworkImConversation[],
): SdkworkImConversation[] {
  return [...conversations].sort((left, right) => {
    if (Boolean(left.isPinned) !== Boolean(right.isPinned)) {
      return Number(Boolean(right.isPinned)) - Number(Boolean(left.isPinned));
    }

    const activityDifference = toTimestamp(right.lastActivityAt) - toTimestamp(left.lastActivityAt);
    if (activityDifference !== 0) {
      return activityDifference;
    }

    const unreadDifference = (right.unreadCount ?? 0) - (left.unreadCount ?? 0);
    if (unreadDifference !== 0) {
      return unreadDifference;
    }

    return left.title.localeCompare(right.title);
  });
}

export function filterImConversations(
  conversations: readonly SdkworkImConversation[],
  options: FilterImConversationsOptions = {},
): SdkworkImConversation[] {
  const query = normalizeQuery(options.query);
  const allowedKinds = options.kinds ? new Set(options.kinds) : null;

  return sortImConversations(conversations).filter((conversation) => {
    if (!options.includeArchived && conversation.isArchived) {
      return false;
    }

    if (options.onlyUnread && (conversation.unreadCount ?? 0) <= 0) {
      return false;
    }

    if (allowedKinds && !allowedKinds.has(conversation.kind)) {
      return false;
    }

    return matchesConversationQuery(conversation, query);
  });
}

export function summarizeImUnread(
  conversations: readonly SdkworkImConversation[],
): SdkworkImUnreadSummary {
  return conversations.reduce<SdkworkImUnreadSummary>(
    (summary, conversation) => {
      const unreadCount = conversation.unreadCount ?? 0;
      const mentionCount = conversation.mentionCount ?? 0;

      if (unreadCount > 0) {
        summary.unreadConversations += 1;
      }

      summary.mentionedMessages += mentionCount;
      summary.mutedMessages += conversation.isMuted ? unreadCount : 0;
      summary.unreadMessages += unreadCount;
      summary.hasAttentionDemand ||= mentionCount > 0 || (unreadCount > 0 && !conversation.isMuted);
      return summary;
    },
    {
      hasAttentionDemand: false,
      mentionedMessages: 0,
      mutedMessages: 0,
      unreadConversations: 0,
      unreadMessages: 0,
    },
  );
}

export function createImConversationDigest(
  conversation: SdkworkImConversation,
  options: CreateImConversationDigestOptions = {},
): SdkworkImConversationDigest {
  return {
    id: conversation.id,
    isActive: conversation.id === options.activeConversationId,
    ...(conversation.isArchived ? { isArchived: true } : {}),
    ...(conversation.isMuted ? { isMuted: true } : {}),
    ...(conversation.isPinned ? { isPinned: true } : {}),
    kind: conversation.kind,
    ...(conversation.lastActivityAt !== undefined ? { lastActivityAt: conversation.lastActivityAt } : {}),
    mentionCount: conversation.mentionCount ?? 0,
    participantCount: conversation.participants?.length ?? 0,
    ...(conversation.preview ? { preview: conversation.preview } : {}),
    status: resolveConversationDigestStatus(conversation),
    title: conversation.title,
    unreadCount: conversation.unreadCount ?? 0,
  };
}

export function summarizeImConversationDigests(
  digests: readonly SdkworkImConversationDigest[],
): SdkworkImConversationDigestSummary {
  let archivedConversations = 0;
  let attentionConversations = 0;
  let mutedConversations = 0;
  let pinnedConversations = 0;
  let totalUnreadMessages = 0;
  let unreadConversations = 0;

  for (const digest of digests) {
    totalUnreadMessages += digest.unreadCount;
    if (digest.unreadCount > 0) {
      unreadConversations += 1;
    }

    switch (digest.status) {
      case "archived":
        archivedConversations += 1;
        break;
      case "attention":
        attentionConversations += 1;
        break;
      default:
        break;
    }

    if (digest.isPinned) {
      pinnedConversations += 1;
    }

    if (digest.isMuted) {
      mutedConversations += 1;
    }
  }

  return {
    archivedConversations,
    attentionConversations,
    mutedConversations,
    pinnedConversations,
    totalConversations: digests.length,
    totalUnreadMessages,
    unreadConversations,
  };
}

export function buildImMessageTimeline(
  messages: readonly SdkworkImMessage[],
): SdkworkImTimelineGroup[] {
  const sortedMessages = [...messages].sort(
    (left, right) => toTimestamp(left.createdAt) - toTimestamp(right.createdAt),
  );
  const grouped = new Map<string, SdkworkImTimelineItem[]>();

  for (let index = 0; index < sortedMessages.length; index += 1) {
    const message = sortedMessages[index];
    const dateKey = toDateKey(message.createdAt);
    const items = grouped.get(dateKey) ?? [];
    items.push({
      ...message,
      clusterPosition: buildClusterPosition(
        sortedMessages[index - 1],
        message,
        sortedMessages[index + 1],
      ),
    });
    grouped.set(dateKey, items);
  }

  return Array.from(grouped.entries()).map(([dateKey, items]) => ({
    dateKey,
    items,
    label: dateKey,
  }));
}

export function resolveImComposerCapabilities(
  conversation: SdkworkImConversation,
  options: ResolveImComposerCapabilitiesOptions = {},
): SdkworkImComposerCapabilities {
  const connectionStatus = options.connectionStatus ?? "online";

  if (connectionStatus === "offline" || connectionStatus === "connecting") {
    return {
      canAttachFiles: false,
      canRecordAudio: false,
      canSendMessages: false,
      canUseCommands: false,
      reason: "offline",
    };
  }

  if (conversation.isArchived) {
    return {
      canAttachFiles: false,
      canRecordAudio: false,
      canSendMessages: false,
      canUseCommands: false,
      reason: "archived",
    };
  }

  if (conversation.isReadOnly || conversation.kind === "system") {
    return {
      canAttachFiles: false,
      canRecordAudio: false,
      canSendMessages: false,
      canUseCommands: false,
      reason: "read-only",
    };
  }

  return {
    canAttachFiles: true,
    canRecordAudio: true,
    canSendMessages: true,
    canUseCommands: conversation.kind === "assistant",
    reason: undefined,
  };
}

export function evaluateImSendReadiness(
  conversation: SdkworkImConversation,
  draft: SdkworkImSendDraft = {},
  options: ResolveImComposerCapabilitiesOptions = {},
): SdkworkImSendReadiness {
  const capabilities = resolveImComposerCapabilities(conversation, options);
  const text = draft.text?.trim() ?? "";
  const attachments = draft.attachments ?? [];
  const payload: SdkworkImSendPayload = {
    attachmentCount: attachments.length,
    attachments,
    conversationId: conversation.id,
    hasAttachments: attachments.length > 0,
    hasText: text.length > 0,
    text,
  };
  const issues = toUniqueSendIssues([
    ...(capabilities.reason ? [capabilities.reason] : []),
    ...((options.connectionStatus === "degraded" || options.connectionStatus === "reconnecting")
      ? ["degraded-connection" as const]
      : []),
    ...(text.length === 0 && attachments.length === 0 ? ["empty-draft" as const] : []),
  ]);
  const blockedIssues = new Set<SdkworkImSendIssue>(["archived", "empty-draft", "offline", "read-only"]);
  const ready =
    capabilities.canSendMessages &&
    issues.every((issue) => !blockedIssues.has(issue));

  return {
    capabilities,
    degraded: issues.includes("degraded-connection"),
    issues,
    ...(capabilities.canSendMessages ? { payload } : {}),
    ready,
  };
}

export function createImWorkspaceManifest({
  badgeBehavior = "unread-only",
  conversationRouteSegment = "conversations",
  description = "Instant messaging workspace for conversations, unread state, and desktop notification routing.",
  host,
  id = "sdkwork-im",
  packageNames = ["@sdkwork/im-pc-react"],
  routePath = "/messages",
  theme,
  title = "Messages",
}: CreateImWorkspaceManifestOptions = {}): SdkworkImWorkspaceManifest {
  return {
    ...createSdkworkAppCapabilityManifest({
      description,
      host,
      id,
      packageNames: toUniquePackages(packageNames),
      theme,
      title,
    }),
    badgeBehavior,
    capability: "im",
    detailRoutePattern: `${routePath}/${conversationRouteSegment}/:conversationId`,
    routePath,
  };
}

export function createImDesktopNotificationIntent({
  basePath = "/messages",
  body,
  conversationId,
  conversationTitle,
  focusWindow = true,
  messageId,
}: CreateImDesktopNotificationIntentOptions): SdkworkImDesktopNotificationIntent {
  const route = `${basePath}/conversations/${conversationId}${
    messageId ? `?message=${encodeURIComponent(messageId)}` : ""
  }`;

  return {
    body,
    conversationId,
    focusWindow,
    messageId,
    route,
    source: "desktop-notification",
    title: conversationTitle,
    type: "im-notification-intent",
  };
}

export const imPackageMeta = {
  architecture: "pc-react",
  domain: "communication",
  package: "@sdkwork/im-pc-react",
  status: "ready",
} as const;

export type ImPackageMeta = typeof imPackageMeta;
