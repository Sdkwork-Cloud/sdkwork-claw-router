import type { AdminSkillPackageListResponse } from './admin-skill-package-list-response';

/** Skills package list result schema exposed by Claw Router. */
export interface SkillsPackageListResult {
  /** Business response code. */
  code: string;
  /** Data field on skills package list result. */
  data?: AdminSkillPackageListResponse;
  /** Human-readable response message. */
  msg?: string;
}
