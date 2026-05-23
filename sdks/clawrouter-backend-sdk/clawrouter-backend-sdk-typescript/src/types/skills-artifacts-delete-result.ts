import type { AdminSkillArtifactDeleteResponse } from './admin-skill-artifact-delete-response';

/** Skills artifacts delete result schema exposed by Claw Router. */
export interface SkillsArtifactsDeleteResult {
  /** Business response code. */
  code: string;
  /** Data field on skills artifacts delete result. */
  data?: AdminSkillArtifactDeleteResponse;
  /** Human-readable response message. */
  msg?: string;
}
