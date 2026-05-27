import type { AdminAppTemplateMutationResponse } from './admin-app-template-mutation-response';

/** Apps templates create result schema exposed by Claw Router. */
export interface AppsTemplatesCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on apps templates create result. */
  data?: AdminAppTemplateMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
