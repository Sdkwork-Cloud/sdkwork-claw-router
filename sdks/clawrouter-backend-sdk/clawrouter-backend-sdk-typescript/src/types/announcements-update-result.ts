import type { AdminAnnouncementMutationResponse } from './admin-announcement-mutation-response';

/** Announcements update result schema exposed by Claw Router. */
export interface AnnouncementsUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on announcements update result. */
  data?: AdminAnnouncementMutationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
