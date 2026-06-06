import type { AdminAppTemplateMutationResponse } from './admin-app-template-mutation-response';

/** Apps templates update result schema exposed by Claw Router. */
export interface AppsTemplatesUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on apps templates update result. */
  data?: AdminAppTemplateMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
