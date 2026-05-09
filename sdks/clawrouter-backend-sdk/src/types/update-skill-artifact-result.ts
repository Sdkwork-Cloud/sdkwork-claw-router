import type { AdminSkillArtifactMutationResponse } from './admin-skill-artifact-mutation-response';

export interface UpdateSkillArtifactResult {
  /** Business response code. */
  code: string;
  data?: AdminSkillArtifactMutationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
