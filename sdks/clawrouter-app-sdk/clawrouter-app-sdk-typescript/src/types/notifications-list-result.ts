import type { MessagesResponse } from './messages-response';

/** Notifications list result schema exposed by Claw Router. */
export interface NotificationsListResult {
  /** Business response code. */
  code: string;
  /** Data field on notifications list result. */
  data?: MessagesResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
