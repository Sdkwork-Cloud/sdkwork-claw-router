import type { AdminSkillCategoryMutationResponse } from './admin-skill-category-mutation-response';

/** Skills categories update result schema exposed by Claw Router. */
export interface SkillsCategoriesUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on skills categories update result. */
  data?: AdminSkillCategoryMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
