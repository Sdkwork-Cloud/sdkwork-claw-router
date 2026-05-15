import type { AdminSkillListResponse } from './admin-skill-list-response';

/** Skills list result schema exposed by Claw Router. */
export interface SkillsListResult {
  /** Business response code. */
  code: string;
  /** Data field on skills list result. */
  data?: AdminSkillListResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
