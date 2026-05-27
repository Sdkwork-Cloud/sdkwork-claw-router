import type { MessagingCollectionResponse } from './messaging-collection-response';

/** Rate limit buckets list result schema exposed by Claw Router. */
export interface RateLimitBucketsListResult {
  /** Business response code. */
  code: string;
  /** Data field on rate limit buckets list result. */
  data?: MessagingCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
