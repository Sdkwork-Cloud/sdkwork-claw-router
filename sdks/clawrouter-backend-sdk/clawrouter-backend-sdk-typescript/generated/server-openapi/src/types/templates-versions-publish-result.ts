import type { MessagingMutationResponse } from './messaging-mutation-response';

/** Templates versions publish result schema exposed by Claw Router. */
export interface TemplatesVersionsPublishResult {
  /** Business response code. */
  code: string;
  /** Data field on templates versions publish result. */
  data?: MessagingMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
