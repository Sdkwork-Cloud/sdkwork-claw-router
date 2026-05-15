import type { AdminSkillCategoryMutationResponse } from './admin-skill-category-mutation-response';

/** Skills categories create result schema exposed by Claw Router. */
export interface SkillsCategoriesCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on skills categories create result. */
  data?: AdminSkillCategoryMutationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
