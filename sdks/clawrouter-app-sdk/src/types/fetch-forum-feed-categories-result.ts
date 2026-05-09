import type { ForumFeedCategoriesResponse } from './forum-feed-categories-response';

export interface FetchForumFeedCategoriesResult {
  /** Business response code. */
  code: string;
  data?: ForumFeedCategoriesResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
