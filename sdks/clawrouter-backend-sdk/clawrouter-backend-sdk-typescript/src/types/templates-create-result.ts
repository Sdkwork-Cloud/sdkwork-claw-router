import type { MessagingMutationResponse } from './messaging-mutation-response';

/** Templates create result schema exposed by Claw Router. */
export interface TemplatesCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on templates create result. */
  data?: MessagingMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
