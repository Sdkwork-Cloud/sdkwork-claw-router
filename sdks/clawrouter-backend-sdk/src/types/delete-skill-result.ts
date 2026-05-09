import type { AdminSkillDeleteResponse } from './admin-skill-delete-response';

export interface DeleteSkillResult {
  /** Business response code. */
  code: string;
  data?: AdminSkillDeleteResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
