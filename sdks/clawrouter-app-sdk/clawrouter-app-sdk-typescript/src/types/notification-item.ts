/** Notification item schema exposed by Claw Router. */
export interface NotificationItem {
  /** Action url field on notification item. */
  actionUrl?: string | null;
  /** App id field on notification item. */
  appId: string;
  /** Archived field on notification item. */
  archived: boolean;
  /** Content field on notification item. */
  content: string;
  /** User-facing short notification summary. */
  desc: string;
  /** Id field on notification item. */
  id: string;
  /** Server-side per-user state indicating that the popup has already been presented for this app. */
  popupSeen: boolean;
  /** Read field on notification item. */
  read: boolean;
  /** Whether this notification should be displayed as a modal popup when the frontend loads. */
  showAsPopup: boolean;
  /** Time field on notification item. */
  time: string;
  /** Title field on notification item. */
  title: string;
  /** Type field on notification item. */
  type: 'info' | 'billing' | 'warning' | 'alert';
}
