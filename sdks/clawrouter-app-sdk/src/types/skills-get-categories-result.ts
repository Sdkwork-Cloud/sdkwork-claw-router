import type { SkillCategoriesResponse } from './skill-categories-response';

export interface SkillsGetCategoriesResult {
  /** Business response code. */
  code: string;
  data?: SkillCategoriesResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
