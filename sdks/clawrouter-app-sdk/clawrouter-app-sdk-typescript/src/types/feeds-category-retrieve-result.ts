import type { ForumFeedItemList } from './forum-feed-item-list';

/** Feeds category retrieve result schema exposed by Claw Router. */
export interface FeedsCategoryRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on feeds category retrieve result. */
  data?: ForumFeedItemList;
  /** Human-readable response message. */
  msg?: string;
}
