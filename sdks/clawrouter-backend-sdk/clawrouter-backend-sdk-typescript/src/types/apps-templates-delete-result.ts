import type { AdminAppTemplateDeleteResponse } from './admin-app-template-delete-response';

/** Apps templates delete result schema exposed by Claw Router. */
export interface AppsTemplatesDeleteResult {
  /** Business response code. */
  code: string;
  /** Data field on apps templates delete result. */
  data?: AdminAppTemplateDeleteResponse;
  /** Human-readable response message. */
  msg?: string;
}
