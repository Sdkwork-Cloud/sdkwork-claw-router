import type { AdminSkillAssetMutationResponse } from './admin-skill-asset-mutation-response';

/** Skills assets retrieve result schema exposed by Claw Router. */
export interface SkillsAssetsRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on skills assets retrieve result. */
  data?: AdminSkillAssetMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
