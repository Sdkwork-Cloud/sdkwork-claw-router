import type { AdminAppTemplateMutationResponse } from './admin-app-template-mutation-response';

/** Apps templates retrieve result schema exposed by Claw Router. */
export interface AppsTemplatesRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on apps templates retrieve result. */
  data?: AdminAppTemplateMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
