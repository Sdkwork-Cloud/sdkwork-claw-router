import type { AdminSkillMutationResponse } from './admin-skill-mutation-response';

/** Skills review approve result schema exposed by Claw Router. */
export interface SkillsReviewApproveResult {
  /** Business response code. */
  code: string;
  /** Data field on skills review approve result. */
  data?: AdminSkillMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
