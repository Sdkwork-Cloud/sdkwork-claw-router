import type { AdminAppCategoryMutationResponse } from './admin-app-category-mutation-response';

/** Apps categories update result schema exposed by Claw Router. */
export interface AppsCategoriesUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on apps categories update result. */
  data?: AdminAppCategoryMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
