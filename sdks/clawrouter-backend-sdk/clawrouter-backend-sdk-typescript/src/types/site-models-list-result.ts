import type { AdminSiteModelsResponse } from './admin-site-models-response';

/** Site models list result schema exposed by Claw Router. */
export interface SiteModelsListResult {
  /** Business response code. */
  code: string;
  /** Data field on site models list result. */
  data?: AdminSiteModelsResponse;
  /** Human-readable response message. */
  msg?: string;
}
