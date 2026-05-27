import type { AdminAppTemplateMutationResponse } from './admin-app-template-mutation-response';

/** Apps templates unpublish result schema exposed by Claw Router. */
export interface AppsTemplatesUnpublishResult {
  /** Business response code. */
  code: string;
  /** Data field on apps templates unpublish result. */
  data?: AdminAppTemplateMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
