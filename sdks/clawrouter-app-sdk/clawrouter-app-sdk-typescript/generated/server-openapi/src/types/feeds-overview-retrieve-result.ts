import type { ForumOverviewResponse } from './forum-overview-response';

/** Feeds overview retrieve result schema exposed by Claw Router. */
export interface FeedsOverviewRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on feeds overview retrieve result. */
  data?: ForumOverviewResponse;
  /** Human-readable response message. */
  msg?: string;
}
