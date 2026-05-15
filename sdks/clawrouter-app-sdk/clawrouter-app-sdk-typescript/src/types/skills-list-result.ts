import type { SkillsCatalogResponse } from './skills-catalog-response';

/** Skills list result schema exposed by Claw Router. */
export interface SkillsListResult {
  /** Business response code. */
  code: string;
  /** Data field on skills list result. */
  data?: SkillsCatalogResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
