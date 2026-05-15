import type { AdminSkillCategoryListResponse } from './admin-skill-category-list-response';

/** Skills categories list result schema exposed by Claw Router. */
export interface SkillsCategoriesListResult {
  /** Business response code. */
  code: string;
  /** Data field on skills categories list result. */
  data?: AdminSkillCategoryListResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
