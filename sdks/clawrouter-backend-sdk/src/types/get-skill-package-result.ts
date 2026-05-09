import type { AdminSkillPackageMutationResponse } from './admin-skill-package-mutation-response';

export interface GetSkillPackageResult {
  /** Business response code. */
  code: string;
  data?: AdminSkillPackageMutationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
