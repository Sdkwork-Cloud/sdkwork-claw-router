import type { MessagingMutationResponse } from './messaging-mutation-response';

/** Sender identities create result schema exposed by Claw Router. */
export interface SenderIdentitiesCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on sender identities create result. */
  data?: MessagingMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
