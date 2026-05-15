import type { AdminSkillArtifactMutationResponse } from './admin-skill-artifact-mutation-response';

/** Skills artifacts create result schema exposed by Claw Router. */
export interface SkillsArtifactsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on skills artifacts create result. */
  data?: AdminSkillArtifactMutationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
