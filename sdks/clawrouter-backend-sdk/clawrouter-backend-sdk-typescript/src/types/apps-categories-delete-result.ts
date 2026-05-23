import type { AdminAppCategoryDeleteResponse } from './admin-app-category-delete-response';

/** Apps categories delete result schema exposed by Claw Router. */
export interface AppsCategoriesDeleteResult {
  /** Business response code. */
  code: string;
  /** Data field on apps categories delete result. */
  data?: AdminAppCategoryDeleteResponse;
  /** Human-readable response message. */
  msg?: string;
}
