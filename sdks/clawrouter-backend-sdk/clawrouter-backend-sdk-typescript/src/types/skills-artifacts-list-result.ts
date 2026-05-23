import type { AdminSkillArtifactListResponse } from './admin-skill-artifact-list-response';

/** Skills artifacts list result schema exposed by Claw Router. */
export interface SkillsArtifactsListResult {
  /** Business response code. */
  code: string;
  /** Data field on skills artifacts list result. */
  data?: AdminSkillArtifactListResponse;
  /** Human-readable response message. */
  msg?: string;
}
