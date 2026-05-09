import type { AdminSkillCategoryListResponse } from './admin-skill-category-list-response';

export interface FetchSkillCategoriesResult {
  /** Business response code. */
  code: string;
  data?: AdminSkillCategoryListResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
