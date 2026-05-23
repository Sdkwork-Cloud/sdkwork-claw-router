import type { ForumFeedItem } from './forum-feed-item';

/** Feeds create result schema exposed by Claw Router. */
export interface FeedsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on feeds create result. */
  data?: ForumFeedItem;
  /** Human-readable response message. */
  msg?: string;
}
