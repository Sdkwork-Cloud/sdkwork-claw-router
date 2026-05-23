import type { AdminSkillPackageMutationResponse } from './admin-skill-package-mutation-response';

/** Skills package enable result schema exposed by Claw Router. */
export interface SkillsPackageEnableResult {
  /** Business response code. */
  code: string;
  /** Data field on skills package enable result. */
  data?: AdminSkillPackageMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
