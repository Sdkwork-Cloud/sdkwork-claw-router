import type { ForumFeedItemList } from './forum-feed-item-list';

/** Feeds list result schema exposed by Claw Router. */
export interface FeedsListResult {
  /** Business response code. */
  code: string;
  /** Data field on feeds list result. */
  data?: ForumFeedItemList;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
