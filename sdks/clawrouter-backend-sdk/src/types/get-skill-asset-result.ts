import type { AdminSkillAssetMutationResponse } from './admin-skill-asset-mutation-response';

export interface GetSkillAssetResult {
  /** Business response code. */
  code: string;
  data?: AdminSkillAssetMutationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
