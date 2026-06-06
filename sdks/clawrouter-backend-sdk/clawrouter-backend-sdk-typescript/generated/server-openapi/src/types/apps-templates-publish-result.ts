import type { AdminAppTemplateMutationResponse } from './admin-app-template-mutation-response';

/** Apps templates publish result schema exposed by Claw Router. */
export interface AppsTemplatesPublishResult {
  /** Business response code. */
  code: string;
  /** Data field on apps templates publish result. */
  data?: AdminAppTemplateMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
