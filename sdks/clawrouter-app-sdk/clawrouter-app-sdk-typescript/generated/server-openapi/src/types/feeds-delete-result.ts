import type { ForumBooleanResponse } from './forum-boolean-response';

/** Feeds delete result schema exposed by Claw Router. */
export interface FeedsDeleteResult {
  /** Business response code. */
  code: string;
  /** Data field on feeds delete result. */
  data?: ForumBooleanResponse;
  /** Human-readable response message. */
  msg?: string;
}
