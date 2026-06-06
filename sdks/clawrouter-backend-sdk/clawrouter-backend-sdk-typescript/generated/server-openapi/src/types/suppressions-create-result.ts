import type { MessagingMutationResponse } from './messaging-mutation-response';

/** Suppressions create result schema exposed by Claw Router. */
export interface SuppressionsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on suppressions create result. */
  data?: MessagingMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
