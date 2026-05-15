import type { AdminSkillMutationResponse } from './admin-skill-mutation-response';

/** Skills review reject result schema exposed by Claw Router. */
export interface SkillsReviewRejectResult {
  /** Business response code. */
  code: string;
  /** Data field on skills review reject result. */
  data?: AdminSkillMutationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
