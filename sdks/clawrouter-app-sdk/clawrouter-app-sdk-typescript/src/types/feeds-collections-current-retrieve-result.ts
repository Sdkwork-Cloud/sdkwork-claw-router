import type { ForumBooleanResponse } from './forum-boolean-response';

/** Feeds collections current retrieve result schema exposed by Claw Router. */
export interface FeedsCollectionsCurrentRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on feeds collections current retrieve result. */
  data?: ForumBooleanResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
