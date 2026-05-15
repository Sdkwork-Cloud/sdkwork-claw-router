import type { AdminSkillAssetListResponse } from './admin-skill-asset-list-response';

/** Skills assets list result schema exposed by Claw Router. */
export interface SkillsAssetsListResult {
  /** Business response code. */
  code: string;
  /** Data field on skills assets list result. */
  data?: AdminSkillAssetListResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
