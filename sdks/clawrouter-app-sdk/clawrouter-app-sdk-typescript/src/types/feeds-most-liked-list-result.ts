import type { ForumFeedItemList } from './forum-feed-item-list';

/** Feeds most liked list result schema exposed by Claw Router. */
export interface FeedsMostLikedListResult {
  /** Business response code. */
  code: string;
  /** Data field on feeds most liked list result. */
  data?: ForumFeedItemList;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
