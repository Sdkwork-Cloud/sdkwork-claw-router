import type { ContentAnnouncementRecord } from './content-announcement-record';

export interface FetchAnnouncementsResult {
  /** Business response code. */
  code: string;
  data?: ContentAnnouncementRecord[];
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
