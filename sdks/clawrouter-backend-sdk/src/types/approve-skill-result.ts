import type { AdminSkillMutationResponse } from './admin-skill-mutation-response';

export interface ApproveSkillResult {
  /** Business response code. */
  code: string;
  data?: AdminSkillMutationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
