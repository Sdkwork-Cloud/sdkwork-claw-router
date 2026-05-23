import {
  createSdkworkAppCapabilityManifest,
  type CreateSdkworkAppCapabilityManifestOptions,
  type SdkworkAppCapabilityManifest,
} from "@sdkwork/appbase-pc-react";

export type SdkworkNotificationChannel = "desktop" | "email" | "in-app" | "push";
export type SdkworkNotificationKind =
  | "error"
  | "info"
  | "message"
  | "security"
  | "success"
  | "task"
  | "warning";
export type SdkworkNotificationStatus = "archived" | "read" | "unread";
export type SdkworkNotificationDigestStatus =
  | "actionable"
  | "archived"
  | "read"
  | "silent"
  | "unread";
export type SdkworkNotificationDeliveryIssue =
  | "all-channels-disabled"
  | "archived"
  | "missing-route"
  | "preferred-channel-disabled"
  | "read";

export interface SdkworkNotificationItem {
  actionUrl?: string | null;
  appId?: string;
  archived?: boolean;
  channels?: readonly SdkworkNotificationChannel[];
  content?: string;
  createdAt: string;
  desc?: string;
  id: string;
  kind: SdkworkNotificationKind;
  popupSeen?: boolean;
  read?: boolean;
  route?: string;
  showAsPopup?: boolean;
  status: SdkworkNotificationStatus;
  time?: string;
  title: string;
  type?: string;
}

export interface SdkworkNotificationDigest {
  channelCount: number;
  createdAt: string;
  hasRoute: boolean;
  id: string;
  isUnread: boolean;
  kind: SdkworkNotificationKind;
  primaryChannel?: SdkworkNotificationChannel;
  status: SdkworkNotificationDigestStatus;
  title: string;
}

export interface SdkworkNotificationDigestSummary {
  actionableNotifications: number;
  archivedNotifications: number;
  desktopNotifications: number;
  routedNotifications: number;
  securityNotifications: number;
  totalNotifications: number;
  unreadNotifications: number;
}

export interface SdkworkNotificationChannelAvailability {
  desktop?: boolean;
  email?: boolean;
  "in-app"?: boolean;
  push?: boolean;
}

export interface SdkworkNotificationDeliveryPlan {
  allowedChannels: SdkworkNotificationChannel[];
  blockedChannels: SdkworkNotificationChannel[];
  primaryChannel?: SdkworkNotificationChannel;
}

export interface EvaluateNotificationDeliveryReadinessOptions {
  enabledChannels?: SdkworkNotificationChannelAvailability;
  preferredChannel?: SdkworkNotificationChannel;
  requireRoute?: boolean;
}

export interface SdkworkNotificationDeliveryReadiness {
  degraded: boolean;
  delivery: SdkworkNotificationDeliveryPlan;
  issues: SdkworkNotificationDeliveryIssue[];
  ready: boolean;
}

export interface SdkworkNotificationWorkspaceManifest extends SdkworkAppCapabilityManifest {
  capability: "notification";
  detailRoutePattern: string;
  routePath: string;
  settingsRoutePath: string;
}

export interface CreateNotificationWorkspaceManifestOptions
  extends Partial<
    Pick<CreateSdkworkAppCapabilityManifestOptions, "description" | "host" | "id" | "packageNames" | "theme" | "title">
  > {
  routePath?: string;
  settingsRoutePath?: string;
}

export interface SdkworkNotificationRouteIntent {
  focusWindow: boolean;
  notificationId: string;
  route: string;
  source: "notification-center";
  type: "notification-route-intent";
}

export interface CreateNotificationRouteIntentOptions {
  basePath?: string;
  focusWindow?: boolean;
}

export interface SdkworkNotificationCenterState {
  items: SdkworkNotificationItem[];
  kindCounts: Record<SdkworkNotificationKind, number>;
  unreadCount: number;
}

export type SdkworkNotificationCenterAction =
  | {
      ids: string[];
      type: "archive" | "mark-read";
    }
  | {
      items: SdkworkNotificationItem[];
      type: "add";
    };

const NOTIFICATION_KIND_ORDER: readonly SdkworkNotificationKind[] = [
  "info",
  "success",
  "warning",
  "error",
  "message",
  "security",
  "task",
];

function createKindCounts(): Record<SdkworkNotificationKind, number> {
  return NOTIFICATION_KIND_ORDER.reduce<Record<SdkworkNotificationKind, number>>((accumulator, kind) => {
    accumulator[kind] = 0;
    return accumulator;
  }, {} as Record<SdkworkNotificationKind, number>);
}

function toUniqueChannels(
  channels: readonly SdkworkNotificationChannel[],
): SdkworkNotificationChannel[] {
  return Array.from(new Set(channels));
}

function normalizeNotificationChannels(
  item: SdkworkNotificationItem,
): SdkworkNotificationChannel[] {
  if (item.channels === undefined) {
    return ["in-app"];
  }

  return toUniqueChannels(item.channels);
}

function resolveNotificationDigestStatus(
  item: SdkworkNotificationItem,
  channels: readonly SdkworkNotificationChannel[],
): SdkworkNotificationDigestStatus {
  if (item.status === "archived") {
    return "archived";
  }

  if (channels.length === 0) {
    return "silent";
  }

  if (item.status === "unread" && item.route) {
    return "actionable";
  }

  if (item.status === "unread") {
    return "unread";
  }

  return "read";
}

function toUniqueDeliveryIssues(
  issues: readonly SdkworkNotificationDeliveryIssue[],
): SdkworkNotificationDeliveryIssue[] {
  const seen = new Set<SdkworkNotificationDeliveryIssue>();
  const uniqueIssues: SdkworkNotificationDeliveryIssue[] = [];

  for (const issue of issues) {
    if (seen.has(issue)) {
      continue;
    }

    seen.add(issue);
    uniqueIssues.push(issue);
  }

  return uniqueIssues;
}

function toUniquePackages(packageNames: readonly string[]): string[] {
  return Array.from(new Set(packageNames.map((packageName) => packageName.trim()).filter(Boolean)));
}

function sortNotifications(items: readonly SdkworkNotificationItem[]): SdkworkNotificationItem[] {
  return [...items].sort((left, right) => {
    return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
  });
}

function normalizeItems(items: readonly SdkworkNotificationItem[]): SdkworkNotificationItem[] {
  const itemsById = new Map<string, SdkworkNotificationItem>();

  for (const item of items) {
    itemsById.set(item.id, item);
  }

  return sortNotifications(Array.from(itemsById.values())).filter((item) => item.status !== "archived");
}

export function createNotificationCenterState(
  items: readonly SdkworkNotificationItem[],
): SdkworkNotificationCenterState {
  const normalizedItems = normalizeItems(items);
  const kindCounts = createKindCounts();
  let unreadCount = 0;

  for (const item of normalizedItems) {
    kindCounts[item.kind] += 1;
    if (item.status === "unread") {
      unreadCount += 1;
    }
  }

  return {
    items: normalizedItems,
    kindCounts,
    unreadCount,
  };
}

export function createNotificationDigest(
  item: SdkworkNotificationItem,
): SdkworkNotificationDigest {
  const channels = normalizeNotificationChannels(item);

  return {
    channelCount: channels.length,
    createdAt: item.createdAt,
    hasRoute: Boolean(item.route),
    id: item.id,
    isUnread: item.status === "unread",
    kind: item.kind,
    ...(channels[0] ? { primaryChannel: channels[0] } : {}),
    status: resolveNotificationDigestStatus(item, channels),
    title: item.title,
  };
}

export function summarizeNotificationDigests(
  digests: readonly SdkworkNotificationDigest[],
): SdkworkNotificationDigestSummary {
  let actionableNotifications = 0;
  let archivedNotifications = 0;
  let desktopNotifications = 0;
  let routedNotifications = 0;
  let securityNotifications = 0;
  let unreadNotifications = 0;

  for (const digest of digests) {
    if (digest.status === "actionable") {
      actionableNotifications += 1;
    }

    if (digest.status === "archived") {
      archivedNotifications += 1;
    }

    if (digest.primaryChannel === "desktop") {
      desktopNotifications += 1;
    }

    if (digest.hasRoute) {
      routedNotifications += 1;
    }

    if (digest.kind === "security") {
      securityNotifications += 1;
    }

    if (digest.isUnread) {
      unreadNotifications += 1;
    }
  }

  return {
    actionableNotifications,
    archivedNotifications,
    desktopNotifications,
    routedNotifications,
    securityNotifications,
    totalNotifications: digests.length,
    unreadNotifications,
  };
}

export function applyNotificationCenterAction(
  state: SdkworkNotificationCenterState,
  action: SdkworkNotificationCenterAction,
): SdkworkNotificationCenterState {
  if (action.type === "add") {
    return createNotificationCenterState([
      ...action.items,
      ...state.items,
    ]);
  }

  const ids = new Set(action.ids);

  return createNotificationCenterState(
    state.items.map((item) => {
      if (!ids.has(item.id)) {
        return item;
      }

      if (action.type === "archive") {
        return {
          ...item,
          status: "archived" as const,
        };
      }

      return {
        ...item,
        status: "read" as const,
      };
    }),
  );
}

export function evaluateNotificationDeliveryReadiness(
  item: SdkworkNotificationItem,
  options: EvaluateNotificationDeliveryReadinessOptions = {},
): SdkworkNotificationDeliveryReadiness {
  const channels = normalizeNotificationChannels(item);
  const allowedChannels = channels.filter((channel) => options.enabledChannels?.[channel] !== false);
  const blockedChannels = channels.filter((channel) => options.enabledChannels?.[channel] === false);
  const preferredChannelDisabled = Boolean(
    options.preferredChannel &&
      channels.includes(options.preferredChannel) &&
      !allowedChannels.includes(options.preferredChannel),
  );
  const delivery: SdkworkNotificationDeliveryPlan = {
    allowedChannels,
    blockedChannels,
    ...(allowedChannels[0]
      ? {
          primaryChannel:
            options.preferredChannel && allowedChannels.includes(options.preferredChannel)
              ? options.preferredChannel
              : allowedChannels[0],
        }
      : {}),
  };
  const issues = toUniqueDeliveryIssues([
    ...(item.status === "archived" ? ["archived" as const] : []),
    ...(item.status === "read" ? ["read" as const] : []),
    ...(allowedChannels.length === 0 ? ["all-channels-disabled" as const] : []),
    ...(preferredChannelDisabled ? ["preferred-channel-disabled" as const] : []),
    ...(!item.route && options.requireRoute ? ["missing-route" as const] : []),
  ]);
  const ready =
    item.status !== "archived" &&
    item.status !== "read" &&
    allowedChannels.length > 0 &&
    (!options.requireRoute || Boolean(item.route));

  return {
    degraded: ready && preferredChannelDisabled,
    delivery,
    issues,
    ready,
  };
}

export function groupNotificationsByDay(
  items: readonly SdkworkNotificationItem[],
): Array<{
  day: string;
  items: SdkworkNotificationItem[];
}> {
  const groups = new Map<string, SdkworkNotificationItem[]>();

  for (const item of sortNotifications(items)) {
    const day = item.createdAt.slice(0, 10);
    const bucket = groups.get(day) ?? [];
    bucket.push(item);
    groups.set(day, bucket);
  }

  return Array.from(groups.entries()).map(([day, groupedItems]) => ({
    day,
    items: groupedItems,
  }));
}

export function createNotificationWorkspaceManifest({
  description = "Notification workspace for inbox routing, delivery surfaces, and desktop attention orchestration.",
  host,
  id = "sdkwork-notification",
  packageNames = ["@sdkwork/notification-pc-react"],
  routePath = "/notifications",
  settingsRoutePath = "/settings/notifications",
  theme,
  title = "Notifications",
}: CreateNotificationWorkspaceManifestOptions = {}): SdkworkNotificationWorkspaceManifest {
  return {
    ...createSdkworkAppCapabilityManifest({
      description,
      host,
      id,
      packageNames: toUniquePackages(packageNames),
      theme,
      title,
    }),
    capability: "notification",
    detailRoutePattern: `${routePath}/:notificationId`,
    routePath,
    settingsRoutePath,
  };
}

export function createNotificationRouteIntent(
  item: SdkworkNotificationItem,
  options: CreateNotificationRouteIntentOptions = {},
): SdkworkNotificationRouteIntent {
  return {
    focusWindow: options.focusWindow !== false,
    notificationId: item.id,
    route: item.route ?? `${options.basePath ?? "/notifications"}/${item.id}`,
    source: "notification-center",
    type: "notification-route-intent",
  };
}

export const notificationPackageMeta = {
  architecture: "pc-react",
  domain: "notification",
  package: "@sdkwork/notification-pc-react",
  status: "ready",
} as const;

export type NotificationPackageMeta = typeof notificationPackageMeta;
