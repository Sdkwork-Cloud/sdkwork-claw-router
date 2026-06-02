import type { AdminSiteModelMutationResponse } from './admin-site-model-mutation-response';

/** Site models create result schema exposed by Claw Router. */
export interface SiteModelsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on site models create result. */
  data?: AdminSiteModelMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
