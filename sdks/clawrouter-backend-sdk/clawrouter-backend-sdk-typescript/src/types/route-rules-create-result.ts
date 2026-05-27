import type { MessagingMutationResponse } from './messaging-mutation-response';

/** Route rules create result schema exposed by Claw Router. */
export interface RouteRulesCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on route rules create result. */
  data?: MessagingMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
