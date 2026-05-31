import {
  isRecord,
  readRequiredString,
  readBoolean,
  readString,
} from './api-result.ts';
import { getClawRouterAppSdkClient } from './sdk-clients.ts';
import type {
  SdkworkNotificationItem,
  SdkworkNotificationService,
} from '@sdkwork/notification-pc-react';

const DEFAULT_NOTIFICATION_APP_ID = 'claw-router';
const DEFAULT_NOTIFICATION_PAGE = 1;
const DEFAULT_NOTIFICATION_PAGE_SIZE = 50;

type PortalNotificationClient = ReturnType<typeof getClawRouterAppSdkClient>;

export interface NotificationItem {
  actionUrl: string | null;
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
  type: 'info' | 'billing' | 'warning' | 'alert';
}

export class NotificationService {
  static async fetchNotifications(): Promise<NotificationItem[]> {
    const items = await createPortalNotificationService().list();
    return items.map(readNotification);
  }

  static async acknowledge(notificationId: string): Promise<void> {
    await createPortalNotificationService().acknowledge(notificationId);
  }

  static async markPopupSeen(notificationId: string): Promise<void> {
    await createPortalNotificationService().markPopupSeen(notificationId);
  }
}

export function createPortalNotificationService(
  client: PortalNotificationClient = getPortalNotificationClient(),
): SdkworkNotificationService {
  return {
    async list(options = {}) {
      const result = await client.notification.list({
        includeArchived: options.includeArchived ?? false,
        page: options.page ?? DEFAULT_NOTIFICATION_PAGE,
        pageSize: options.pageSize ?? DEFAULT_NOTIFICATION_PAGE_SIZE,
      });
      ensureNotificationSuccess(result, 'Failed to list notifications');
      return readNotificationItems(result).map((item) => toSdkworkNotificationItem(readNotification(item)));
    },
    async acknowledge(notificationId: string): Promise<void> {
      const result = await client.notification.acknowledge.create(notificationId);
      ensureNotificationSuccess(result, 'Failed to acknowledge notification');
    },
    async markPopupSeen(notificationId: string): Promise<void> {
      const result = await client.notification.popupSeen.create(notificationId);
      ensureNotificationSuccess(result, 'Failed to mark notification popup seen');
    },
  };
}

export function getPortalNotificationClient(): PortalNotificationClient {
  return getClawRouterAppSdkClient();
}

export function getPortalNotificationAppId(): string {
  return DEFAULT_NOTIFICATION_APP_ID;
}

function readNotification(value: unknown): NotificationItem {
  if (!isRecord(value)) {
    throw new Error('Notification record is required');
  }

  return {
    id: readRequiredString(value, 'id', 'Notification id is required'),
    appId: readRequiredString(value, 'appId', 'Notification app id is required'),
    title: readRequiredString(value, 'title', 'Notification title is required'),
    desc: readRequiredString(value, 'desc', 'Notification description is required'),
    content: readRequiredString(value, 'content', 'Notification content is required'),
    time: readRequiredString(value, 'time', 'Notification time is required'),
    type: readNotificationType(value.type),
    read: readNotificationRead(value.read),
    showAsPopup: readBoolean(value, 'showAsPopup', false),
    popupSeen: readBoolean(value, 'popupSeen', false),
    archived: readBoolean(value, 'archived', false),
    actionUrl: readString(value, 'actionUrl') || null,
  };
}

function ensureNotificationSuccess(value: { code?: string | number; msg?: string }, fallback: string): void {
  if (value.code === undefined || value.code === '2000' || value.code === '0' || value.code === 0) {
    return;
  }
  throw new Error(value.msg || `${fallback}: ${value.code}`);
}

function readNotificationItems(value: unknown): unknown[] {
  if (Array.isArray(value)) {
    return value;
  }
  if (!isRecord(value)) {
    throw new Error('Notification list response is required');
  }
  if (Array.isArray(value.items)) {
    return value.items;
  }
  if (isRecord(value.data) && Array.isArray(value.data.items)) {
    return value.data.items;
  }
  throw new Error('Notification list response missing items');
}

function toSdkworkNotificationItem(item: NotificationItem): SdkworkNotificationItem {
  return {
    actionUrl: item.actionUrl,
    appId: item.appId,
    archived: item.archived,
    createdAt: item.time,
    content: item.content,
    desc: item.desc,
    id: item.id,
    kind: item.type === 'alert' ? 'error' : item.type === 'billing' ? 'info' : item.type,
    popupSeen: item.popupSeen,
    read: item.read,
    route: item.actionUrl ?? undefined,
    showAsPopup: item.showAsPopup,
    status: item.archived ? 'archived' : item.read ? 'read' : 'unread',
    time: item.time,
    title: item.title,
    type: item.type,
  };
}

function readNotificationType(value: unknown): NotificationItem['type'] {
  if (value === 'info' || value === 'billing' || value === 'warning' || value === 'alert') {
    return value;
  }
  const notificationType = readString({ value }, 'value');
  throw new Error(notificationType ? `Unsupported notification type: ${notificationType}` : 'Notification type is required');
}

function readNotificationRead(value: unknown): boolean {
  if (typeof value === 'boolean') {
    return value;
  }
  throw new Error('Notification read state is required');
}
