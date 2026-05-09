import type { AdminSkillPackageListResponse } from './admin-skill-package-list-response';

export interface FetchSkillPackagesResult {
  /** Business response code. */
  code: string;
  data?: AdminSkillPackageListResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
