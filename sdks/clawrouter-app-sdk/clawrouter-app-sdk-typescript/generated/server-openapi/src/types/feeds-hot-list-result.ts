import type { ForumFeedItemList } from './forum-feed-item-list';

/** Feeds hot list result schema exposed by Claw Router. */
export interface FeedsHotListResult {
  /** Business response code. */
  code: string;
  /** Data field on feeds hot list result. */
  data?: ForumFeedItemList;
  /** Human-readable response message. */
  msg?: string;
}
