import type { ForumFeedItem } from './forum-feed-item';

/** Feeds shares create result schema exposed by Claw Router. */
export interface FeedsSharesCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on feeds shares create result. */
  data?: ForumFeedItem;
  /** Human-readable response message. */
  msg?: string;
}
