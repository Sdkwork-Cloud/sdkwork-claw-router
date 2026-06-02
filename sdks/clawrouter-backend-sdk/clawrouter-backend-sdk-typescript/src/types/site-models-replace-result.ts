import type { AdminSiteModelsReplaceResponse } from './admin-site-models-replace-response';

/** Site models replace result schema exposed by Claw Router. */
export interface SiteModelsReplaceResult {
  /** Business response code. */
  code: string;
  /** Data field on site models replace result. */
  data?: AdminSiteModelsReplaceResponse;
  /** Human-readable response message. */
  msg?: string;
}
