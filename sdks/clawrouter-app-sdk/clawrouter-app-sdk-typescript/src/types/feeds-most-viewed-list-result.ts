import type { ForumFeedItemList } from './forum-feed-item-list';

/** Feeds most viewed list result schema exposed by Claw Router. */
export interface FeedsMostViewedListResult {
  /** Business response code. */
  code: string;
  /** Data field on feeds most viewed list result. */
  data?: ForumFeedItemList;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
