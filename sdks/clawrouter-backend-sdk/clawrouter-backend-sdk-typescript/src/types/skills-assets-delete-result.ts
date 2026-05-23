import type { AdminSkillAssetDeleteResponse } from './admin-skill-asset-delete-response';

/** Skills assets delete result schema exposed by Claw Router. */
export interface SkillsAssetsDeleteResult {
  /** Business response code. */
  code: string;
  /** Data field on skills assets delete result. */
  data?: AdminSkillAssetDeleteResponse;
  /** Human-readable response message. */
  msg?: string;
}
