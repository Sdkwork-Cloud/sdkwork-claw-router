import type { ForumFeedItem } from './forum-feed-item';

/** Feeds collections create result schema exposed by Claw Router. */
export interface FeedsCollectionsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on feeds collections create result. */
  data?: ForumFeedItem;
  /** Human-readable response message. */
  msg?: string;
}
