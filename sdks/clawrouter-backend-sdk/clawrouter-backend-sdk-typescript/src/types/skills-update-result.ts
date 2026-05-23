import type { AdminSkillMutationResponse } from './admin-skill-mutation-response';

/** Skills update result schema exposed by Claw Router. */
export interface SkillsUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on skills update result. */
  data?: AdminSkillMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
