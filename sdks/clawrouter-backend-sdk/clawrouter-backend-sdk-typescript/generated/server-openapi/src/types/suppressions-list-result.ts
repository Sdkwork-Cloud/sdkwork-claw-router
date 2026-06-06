import type { MessagingCollectionResponse } from './messaging-collection-response';

/** Suppressions list result schema exposed by Claw Router. */
export interface SuppressionsListResult {
  /** Business response code. */
  code: string;
  /** Data field on suppressions list result. */
  data?: MessagingCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
