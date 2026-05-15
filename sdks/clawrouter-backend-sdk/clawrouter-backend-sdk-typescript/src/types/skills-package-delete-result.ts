import type { AdminSkillPackageDeleteResponse } from './admin-skill-package-delete-response';

/** Skills package delete result schema exposed by Claw Router. */
export interface SkillsPackageDeleteResult {
  /** Business response code. */
  code: string;
  /** Data field on skills package delete result. */
  data?: AdminSkillPackageDeleteResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
