import type { MessagingCollectionResponse } from './messaging-collection-response';

/** Send requests list result schema exposed by Claw Router. */
export interface SendRequestsListResult {
  /** Business response code. */
  code: string;
  /** Data field on send requests list result. */
  data?: MessagingCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
