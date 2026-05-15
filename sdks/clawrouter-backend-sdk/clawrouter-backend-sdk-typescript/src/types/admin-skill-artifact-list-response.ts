import type { AdminSkillArtifactItem } from './admin-skill-artifact-item';

/** Admin skill artifact list response schema exposed by Claw Router. */
export interface AdminSkillArtifactListResponse {
  /** Skill catalog artifacts attached to the agent skill. */
  items: AdminSkillArtifactItem[];
}
