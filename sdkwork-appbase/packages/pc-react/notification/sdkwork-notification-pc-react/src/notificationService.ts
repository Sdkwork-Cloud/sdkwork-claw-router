import type {
  SdkworkNotificationItem,
  SdkworkNotificationKind,
  SdkworkNotificationStatus,
} from "./notificationCenter";

export type SdkworkGeneratedNotificationType = "alert" | "billing" | "info" | "warning";

export interface SdkworkGeneratedNotificationItem {
  actionUrl?: string | null;
  appId: string;
  archived: boolean;
  content: string;
  desc: string;
  id: string;
  popupSeen: boolean;
  read: boolean;
  showAsPopup: boolean;
  time: string;
  title: string;
  type: SdkworkGeneratedNotificationType;
}

export interface SdkworkNotificationListResult {
  code?: string;
  items?: unknown;
  data?: {
    items?: unknown;
  };
  message?: string;
  msg?: string;
}

export interface SdkworkNotificationMutationResult {
  code?: string;
  data?: {
    state?: "acknowledged" | "popup_seen";
    updated?: boolean;
  };
  message?: string;
  msg?: string;
}

export interface SdkworkNotificationGeneratedClient {
  notification: {
    listNotifications(params?: SdkworkNotificationListParams): Promise<SdkworkNotificationListResult>;
    acknowledge: {
      create(
        notificationId: string,
        params?: SdkworkNotificationMutationParams,
      ): Promise<SdkworkNotificationMutationResult>;
    };
    popupSeen: {
      create(
        notificationId: string,
        params?: SdkworkNotificationMutationParams,
      ): Promise<SdkworkNotificationMutationResult>;
    };
  };
}

export interface SdkworkNotificationListParams {
  appId?: string;
  includeArchived?: boolean;
  page?: number;
  pageSize?: number;
}

export interface SdkworkNotificationMutationParams {
  appId?: string;
}

export interface SdkworkNotificationServiceListOptions {
  includeArchived?: boolean;
  page?: number;
  pageSize?: number;
}

export interface SdkworkNotificationService {
  acknowledge(notificationId: string): Promise<void>;
  list(options?: SdkworkNotificationServiceListOptions): Promise<SdkworkNotificationItem[]>;
  markPopupSeen(notificationId: string): Promise<void>;
}

export interface CreateSdkworkNotificationServiceOptions {
  appId: string;
  client: SdkworkNotificationGeneratedClient;
  pageSize?: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 50;

export function createSdkworkNotificationService({
  appId,
  client,
  pageSize = DEFAULT_PAGE_SIZE,
}: CreateSdkworkNotificationServiceOptions): SdkworkNotificationService {
  const normalizedAppId = appId.trim();
  if (!normalizedAppId) {
    throw new Error("Notification app id is required");
  }

  return {
    async list(options = {}) {
      const result = await client.notification.listNotifications({
        appId: normalizedAppId,
        includeArchived: options.includeArchived ?? false,
        page: options.page ?? DEFAULT_PAGE,
        pageSize: options.pageSize ?? pageSize,
      });
      ensureSdkworkNotificationSuccess(result, "Failed to list notifications");
      return readNotificationItems(result);
    },
    async acknowledge(notificationId) {
      const result = await client.notification.acknowledge.create(notificationId, {
        appId: normalizedAppId,
      });
      ensureSdkworkNotificationSuccess(result, "Failed to acknowledge notification");
    },
    async markPopupSeen(notificationId) {
      const result = await client.notification.popupSeen.create(notificationId, {
        appId: normalizedAppId,
      });
      ensureSdkworkNotificationSuccess(result, "Failed to mark notification popup seen");
    },
  };
}

export function toSdkworkNotificationItem(
  item: SdkworkGeneratedNotificationItem,
): SdkworkNotificationItem {
  const status = resolveNotificationStatus(item);
  const kind = toNotificationKind(item.type);

  return {
    actionUrl: item.actionUrl ?? null,
    appId: item.appId,
    archived: item.archived,
    content: item.content,
    createdAt: item.time,
    desc: item.desc,
    id: item.id,
    kind,
    popupSeen: item.popupSeen,
    read: item.read,
    route: item.actionUrl ?? undefined,
    showAsPopup: item.showAsPopup,
    status,
    time: item.time,
    title: item.title,
    type: item.type,
  };
}

function readNotificationItems(result: SdkworkNotificationListResult): SdkworkNotificationItem[] {
  const items = readNotificationItemsPayload(result);
  if (!Array.isArray(items)) {
    throw new Error("Notification list response missing items");
  }

  return items.map((item) => toSdkworkNotificationItem(readNotificationItem(item)));
}

function readNotificationItemsPayload(
  result: SdkworkNotificationListResult,
): unknown[] | undefined {
  if (Array.isArray(result.items)) {
    return result.items;
  }

  if (Array.isArray(result.data?.items)) {
    return result.data.items;
  }

  return undefined;
}

function ensureSdkworkNotificationSuccess(
  result: SdkworkNotificationListResult | SdkworkNotificationMutationResult,
  message: string,
): void {
  if (result.code === undefined || result.code === "2000" || result.code === "0") {
    return;
  }

  throw new Error(result.message ?? result.msg ?? message);
}

function readNotificationItem(value: unknown): SdkworkGeneratedNotificationItem {
  if (!isRecord(value)) {
    throw new Error("Notification record is required");
  }

  return {
    actionUrl: readNullableString(value, "actionUrl"),
    appId: readRequiredString(value, "appId", "Notification app id is required"),
    archived: readRequiredBoolean(value, "archived", "Notification archived state is required"),
    content: readRequiredString(value, "content", "Notification content is required"),
    desc: readRequiredString(value, "desc", "Notification description is required"),
    id: readRequiredString(value, "id", "Notification id is required"),
    popupSeen: readRequiredBoolean(value, "popupSeen", "Notification popup seen state is required"),
    read: readRequiredBoolean(value, "read", "Notification read state is required"),
    showAsPopup: readRequiredBoolean(value, "showAsPopup", "Notification popup display state is required"),
    time: readRequiredString(value, "time", "Notification time is required"),
    title: readRequiredString(value, "title", "Notification title is required"),
    type: readNotificationType(value.type),
  };
}

function resolveNotificationStatus(item: SdkworkGeneratedNotificationItem): SdkworkNotificationStatus {
  if (item.archived) {
    return "archived";
  }

  return item.read ? "read" : "unread";
}

function toNotificationKind(type: SdkworkGeneratedNotificationType): SdkworkNotificationKind {
  if (type === "alert") {
    return "error";
  }

  return type === "billing" ? "info" : type;
}

function readNotificationType(value: unknown): SdkworkGeneratedNotificationType {
  if (value === "alert" || value === "billing" || value === "info" || value === "warning") {
    return value;
  }

  throw new Error("Notification type is required");
}

function readRequiredString(
  value: Record<string, unknown>,
  field: string,
  errorMessage: string,
): string {
  const rawValue = value[field];
  if (typeof rawValue !== "string" || !rawValue.trim()) {
    throw new Error(errorMessage);
  }

  return rawValue;
}

function readNullableString(
  value: Record<string, unknown>,
  field: string,
): string | null {
  const rawValue = value[field];
  if (rawValue === undefined || rawValue === null || rawValue === "") {
    return null;
  }
  if (typeof rawValue !== "string") {
    throw new Error(`Notification ${field} must be a string`);
  }

  return rawValue;
}

function readRequiredBoolean(
  value: Record<string, unknown>,
  field: string,
  errorMessage: string,
): boolean {
  const rawValue = value[field];
  if (typeof rawValue !== "boolean") {
    throw new Error(errorMessage);
  }

  return rawValue;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
