import type { AdminSkillArtifactListResponse } from './admin-skill-artifact-list-response';

export interface FetchSkillArtifactsResult {
  /** Business response code. */
  code: string;
  data?: AdminSkillArtifactListResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
