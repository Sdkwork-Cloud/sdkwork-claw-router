import type { ForumFeedItems } from './forum-feed-items';

export interface FetchMostLikedForumFeedsResult {
  /** Business response code. */
  code: string;
  data?: ForumFeedItems;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
