import type { ForumFeedItem } from './forum-feed-item';

/** Feeds likes current delete result schema exposed by Claw Router. */
export interface FeedsLikesCurrentDeleteResult {
  /** Business response code. */
  code: string;
  /** Data field on feeds likes current delete result. */
  data?: ForumFeedItem;
  /** Human-readable response message. */
  msg?: string;
}
