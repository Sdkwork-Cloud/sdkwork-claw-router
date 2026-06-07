import type { MessagingMutationResponse } from './messaging-mutation-response';

/** Verification policies update result schema exposed by Claw Router. */
export interface VerificationPoliciesUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on verification policies update result. */
  data?: MessagingMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
