import type { ForumFeedItem } from './forum-feed-item';

export interface FetchForumFeedDetailResult {
  /** Business response code. */
  code: string;
  data?: ForumFeedItem;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
