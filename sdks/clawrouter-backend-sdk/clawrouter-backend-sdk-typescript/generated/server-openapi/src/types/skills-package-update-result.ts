import type { AdminSkillPackageMutationResponse } from './admin-skill-package-mutation-response';

/** Skills package update result schema exposed by Claw Router. */
export interface SkillsPackageUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on skills package update result. */
  data?: AdminSkillPackageMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
