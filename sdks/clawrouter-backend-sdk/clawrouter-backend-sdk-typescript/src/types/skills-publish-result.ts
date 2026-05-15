import type { AdminSkillMutationResponse } from './admin-skill-mutation-response';

/** Skills publish result schema exposed by Claw Router. */
export interface SkillsPublishResult {
  /** Business response code. */
  code: string;
  /** Data field on skills publish result. */
  data?: AdminSkillMutationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
