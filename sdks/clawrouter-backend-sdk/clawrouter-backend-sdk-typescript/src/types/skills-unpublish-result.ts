import type { AdminSkillMutationResponse } from './admin-skill-mutation-response';

/** Skills unpublish result schema exposed by Claw Router. */
export interface SkillsUnpublishResult {
  /** Business response code. */
  code: string;
  /** Data field on skills unpublish result. */
  data?: AdminSkillMutationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
