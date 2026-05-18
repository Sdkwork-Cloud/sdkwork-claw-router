import {
  ensurePlusApiSuccess,
  isRecord,
  readRequiredApiItems,
  readRequiredString,
  readBoolean,
  readString,
} from './api-result.ts';
import { getClawRouterAppSdkClient } from './sdk-clients.ts';
import type { NotificationItem as SdkNotificationItem } from '@sdkwork/clawrouter-app-sdk';

export interface NotificationItem {
  id: SdkNotificationItem['id'];
  title: SdkNotificationItem['title'];
  desc: SdkNotificationItem['desc'];
  content: SdkNotificationItem['content'];
  time: SdkNotificationItem['time'];
  type: SdkNotificationItem['type'];
  read: SdkNotificationItem['read'];
  showAsPopup: boolean;
}

export class NotificationService {
  static async fetchNotifications(): Promise<NotificationItem[]> {
    const result = await getClawRouterAppSdkClient().communication.notifications.list();
    ensurePlusApiSuccess(result, 'Failed to fetch notifications');
    return readRequiredApiItems(result, 'Failed to fetch notifications').map(readNotification);
  }
}

function readNotification(value: unknown): NotificationItem {
  if (!isRecord(value)) {
    throw new Error('Notification record is required');
  }

  return {
    id: readRequiredString(value, 'id', 'Notification id is required'),
    title: readRequiredString(value, 'title', 'Notification title is required'),
    desc: readRequiredString(value, 'desc', 'Notification description is required'),
    content: readRequiredString(value, 'content', 'Notification content is required'),
    time: readRequiredString(value, 'time', 'Notification time is required'),
    type: readNotificationType(value.type),
    read: readNotificationRead(value.read),
    showAsPopup: readBoolean(value, 'showAsPopup', false),
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
