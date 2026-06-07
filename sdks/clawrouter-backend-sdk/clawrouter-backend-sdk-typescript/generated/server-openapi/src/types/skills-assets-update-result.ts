import type { AdminSkillAssetMutationResponse } from './admin-skill-asset-mutation-response';

/** Skills assets update result schema exposed by Claw Router. */
export interface SkillsAssetsUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on skills assets update result. */
  data?: AdminSkillAssetMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
