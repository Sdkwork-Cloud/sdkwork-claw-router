import type { ForumFeedItem } from './forum-feed-item';

/** Feeds likes create result schema exposed by Claw Router. */
export interface FeedsLikesCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on feeds likes create result. */
  data?: ForumFeedItem;
  /** Human-readable response message. */
  msg?: string;
}
