import type { AdminSkillMutationResponse } from './admin-skill-mutation-response';

/** Skills enable result schema exposed by Claw Router. */
export interface SkillsEnableResult {
  /** Business response code. */
  code: string;
  /** Data field on skills enable result. */
  data?: AdminSkillMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
