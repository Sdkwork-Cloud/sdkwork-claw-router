import type { AdminSkillMutationResponse } from './admin-skill-mutation-response';

/** Skills create result schema exposed by Claw Router. */
export interface SkillsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on skills create result. */
  data?: AdminSkillMutationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
