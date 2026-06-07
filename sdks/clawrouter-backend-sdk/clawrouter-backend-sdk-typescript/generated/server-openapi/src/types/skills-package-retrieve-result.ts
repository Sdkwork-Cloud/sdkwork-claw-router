import type { AdminSkillPackageMutationResponse } from './admin-skill-package-mutation-response';

/** Skills package retrieve result schema exposed by Claw Router. */
export interface SkillsPackageRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on skills package retrieve result. */
  data?: AdminSkillPackageMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
