import type { AdminSkillCategoryMutationResponse } from './admin-skill-category-mutation-response';

export interface CreateSkillCategoryResult {
  /** Business response code. */
  code: string;
  data?: AdminSkillCategoryMutationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
