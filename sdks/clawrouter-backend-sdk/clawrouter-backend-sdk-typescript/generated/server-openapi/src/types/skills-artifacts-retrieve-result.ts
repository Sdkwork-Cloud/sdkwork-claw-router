import type { AdminSkillArtifactMutationResponse } from './admin-skill-artifact-mutation-response';

/** Skills artifacts retrieve result schema exposed by Claw Router. */
export interface SkillsArtifactsRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on skills artifacts retrieve result. */
  data?: AdminSkillArtifactMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
