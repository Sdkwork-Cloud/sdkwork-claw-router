import type { SkillsCatalogResponse } from './skills-catalog-response';

export interface GetSkillsResult {
  /** Business response code. */
  code: string;
  data?: SkillsCatalogResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
