import type { AdminSkillPackageMutationResponse } from './admin-skill-package-mutation-response';

/** Skills package disable result schema exposed by Claw Router. */
export interface SkillsPackageDisableResult {
  /** Business response code. */
  code: string;
  /** Data field on skills package disable result. */
  data?: AdminSkillPackageMutationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
