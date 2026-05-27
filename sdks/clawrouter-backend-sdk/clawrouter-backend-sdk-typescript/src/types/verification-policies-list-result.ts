import type { MessagingCollectionResponse } from './messaging-collection-response';

/** Verification policies list result schema exposed by Claw Router. */
export interface VerificationPoliciesListResult {
  /** Business response code. */
  code: string;
  /** Data field on verification policies list result. */
  data?: MessagingCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
