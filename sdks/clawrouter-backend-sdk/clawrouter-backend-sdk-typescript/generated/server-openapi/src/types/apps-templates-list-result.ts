import type { AdminAppTemplateListResponse } from './admin-app-template-list-response';

/** Apps templates list result schema exposed by Claw Router. */
export interface AppsTemplatesListResult {
  /** Business response code. */
  code: string;
  /** Data field on apps templates list result. */
  data?: AdminAppTemplateListResponse;
  /** Human-readable response message. */
  msg?: string;
}
