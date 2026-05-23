import type { AdminAppCategoryMutationResponse } from './admin-app-category-mutation-response';

/** Apps categories create result schema exposed by Claw Router. */
export interface AppsCategoriesCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on apps categories create result. */
  data?: AdminAppCategoryMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
