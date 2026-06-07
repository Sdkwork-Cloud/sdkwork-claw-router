import type { MessagingMutationResponse } from './messaging-mutation-response';

/** Provider accounts create result schema exposed by Claw Router. */
export interface ProviderAccountsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on provider accounts create result. */
  data?: MessagingMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
