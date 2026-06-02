import type { AdminSiteDeleteResponse } from './admin-site-delete-response';

/** Site models delete result schema exposed by Claw Router. */
export interface SiteModelsDeleteResult {
  /** Business response code. */
  code: string;
  /** Data field on site models delete result. */
  data?: AdminSiteDeleteResponse;
  /** Human-readable response message. */
  msg?: string;
}
