import type { AdminSkillArtifactItem } from './admin-skill-artifact-item';

export interface AdminSkillArtifactListResponse {
  /** Skill catalog artifacts attached to the agent skill. */
  items: AdminSkillArtifactItem[];
}
