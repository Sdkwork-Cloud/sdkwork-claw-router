import type { ForumFeedItem } from './forum-feed-item';

/** Feeds retrieve result schema exposed by Claw Router. */
export interface FeedsRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on feeds retrieve result. */
  data?: ForumFeedItem;
  /** Human-readable response message. */
  msg?: string;
}
