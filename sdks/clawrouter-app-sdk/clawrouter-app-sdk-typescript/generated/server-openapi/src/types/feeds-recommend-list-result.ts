import type { ForumFeedItemList } from './forum-feed-item-list';

/** Feeds recommend list result schema exposed by Claw Router. */
export interface FeedsRecommendListResult {
  /** Business response code. */
  code: string;
  /** Data field on feeds recommend list result. */
  data?: ForumFeedItemList;
  /** Human-readable response message. */
  msg?: string;
}
