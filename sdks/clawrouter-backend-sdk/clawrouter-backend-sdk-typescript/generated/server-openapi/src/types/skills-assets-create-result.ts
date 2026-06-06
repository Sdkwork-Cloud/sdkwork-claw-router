import type { AdminSkillAssetMutationResponse } from './admin-skill-asset-mutation-response';

/** Skills assets create result schema exposed by Claw Router. */
export interface SkillsAssetsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on skills assets create result. */
  data?: AdminSkillAssetMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
