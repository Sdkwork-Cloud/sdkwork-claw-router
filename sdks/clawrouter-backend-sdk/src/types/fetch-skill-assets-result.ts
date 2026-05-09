import type { AdminSkillAssetListResponse } from './admin-skill-asset-list-response';

export interface FetchSkillAssetsResult {
  /** Business response code. */
  code: string;
  data?: AdminSkillAssetListResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
