import type { MessagingCollectionResponse } from './messaging-collection-response';

/** Sender identities list result schema exposed by Claw Router. */
export interface SenderIdentitiesListResult {
  /** Business response code. */
  code: string;
  /** Data field on sender identities list result. */
  data?: MessagingCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
