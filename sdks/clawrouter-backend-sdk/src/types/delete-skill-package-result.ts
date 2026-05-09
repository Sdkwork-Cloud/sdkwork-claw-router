import type { AdminSkillPackageDeleteResponse } from './admin-skill-package-delete-response';

export interface DeleteSkillPackageResult {
  /** Business response code. */
  code: string;
  data?: AdminSkillPackageDeleteResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
