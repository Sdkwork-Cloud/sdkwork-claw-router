import type { NotificationItem } from './notification-item';

/** Notifications response schema exposed by Claw Router. */
export interface NotificationsResponse {
  /** Items field on notifications response. */
  items: NotificationItem[];
}
