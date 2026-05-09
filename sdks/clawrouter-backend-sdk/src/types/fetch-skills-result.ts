import type { AdminSkillListResponse } from './admin-skill-list-response';

export interface FetchSkillsResult {
  /** Business response code. */
  code: string;
  data?: AdminSkillListResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
