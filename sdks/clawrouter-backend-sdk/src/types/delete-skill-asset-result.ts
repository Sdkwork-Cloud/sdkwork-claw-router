import type { AdminSkillAssetDeleteResponse } from './admin-skill-asset-delete-response';

export interface DeleteSkillAssetResult {
  /** Business response code. */
  code: string;
  data?: AdminSkillAssetDeleteResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
