import type { AdminSkillArtifactDeleteResponse } from './admin-skill-artifact-delete-response';

export interface DeleteSkillArtifactResult {
  /** Business response code. */
  code: string;
  data?: AdminSkillArtifactDeleteResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
