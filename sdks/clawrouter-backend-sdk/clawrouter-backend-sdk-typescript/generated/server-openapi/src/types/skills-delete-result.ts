import type { AdminSkillDeleteResponse } from './admin-skill-delete-response';

/** Skills delete result schema exposed by Claw Router. */
export interface SkillsDeleteResult {
  /** Business response code. */
  code: string;
  /** Data field on skills delete result. */
  data?: AdminSkillDeleteResponse;
  /** Human-readable response message. */
  msg?: string;
}
