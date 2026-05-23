import type { ForumFeedItem } from './forum-feed-item';

/** Feeds collections current delete result schema exposed by Claw Router. */
export interface FeedsCollectionsCurrentDeleteResult {
  /** Business response code. */
  code: string;
  /** Data field on feeds collections current delete result. */
  data?: ForumFeedItem;
  /** Human-readable response message. */
  msg?: string;
}
