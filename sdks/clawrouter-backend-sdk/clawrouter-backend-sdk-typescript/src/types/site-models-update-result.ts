import type { AdminSiteModelMutationResponse } from './admin-site-model-mutation-response';

/** Site models update result schema exposed by Claw Router. */
export interface SiteModelsUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on site models update result. */
  data?: AdminSiteModelMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
