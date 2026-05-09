import type { AdminAnnouncementMutationResponse } from './admin-announcement-mutation-response';

export interface AddAnnouncementResult {
  /** Business response code. */
  code: string;
  data?: AdminAnnouncementMutationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
