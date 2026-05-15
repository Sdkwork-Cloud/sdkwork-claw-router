import type { AdminDeleteResponse } from './admin-delete-response';

/** Announcements delete result schema exposed by Claw Router. */
export interface AnnouncementsDeleteResult {
  /** Business response code. */
  code: string;
  /** Data field on announcements delete result. */
  data?: AdminDeleteResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
