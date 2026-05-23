import type { AdminSkillPackageMutationResponse } from './admin-skill-package-mutation-response';

/** Skills package create result schema exposed by Claw Router. */
export interface SkillsPackageCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on skills package create result. */
  data?: AdminSkillPackageMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
