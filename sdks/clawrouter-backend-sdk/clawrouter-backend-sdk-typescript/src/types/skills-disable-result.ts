import type { AdminSkillMutationResponse } from './admin-skill-mutation-response';

/** Skills disable result schema exposed by Claw Router. */
export interface SkillsDisableResult {
  /** Business response code. */
  code: string;
  /** Data field on skills disable result. */
  data?: AdminSkillMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
