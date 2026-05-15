import type { ForumFeedItemList } from './forum-feed-item-list';

/** Feeds top list result schema exposed by Claw Router. */
export interface FeedsTopListResult {
  /** Business response code. */
  code: string;
  /** Data field on feeds top list result. */
  data?: ForumFeedItemList;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
