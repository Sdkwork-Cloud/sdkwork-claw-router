import type { AdminAppCategoryListResponse } from './admin-app-category-list-response';

/** Apps categories list result schema exposed by Claw Router. */
export interface AppsCategoriesListResult {
  /** Business response code. */
  code: string;
  /** Data field on apps categories list result. */
  data?: AdminAppCategoryListResponse;
  /** Human-readable response message. */
  msg?: string;
}
