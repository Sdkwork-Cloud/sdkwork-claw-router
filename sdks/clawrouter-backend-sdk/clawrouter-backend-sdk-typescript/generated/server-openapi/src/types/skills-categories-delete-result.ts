import type { AdminSkillCategoryDeleteResponse } from './admin-skill-category-delete-response';

/** Skills categories delete result schema exposed by Claw Router. */
export interface SkillsCategoriesDeleteResult {
  /** Business response code. */
  code: string;
  /** Data field on skills categories delete result. */
  data?: AdminSkillCategoryDeleteResponse;
  /** Human-readable response message. */
  msg?: string;
}
