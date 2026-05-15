import type { AdminSkillAssetItem } from './admin-skill-asset-item';

/** Admin skill asset list response schema exposed by Claw Router. */
export interface AdminSkillAssetListResponse {
  /** Skill catalog assets attached to the agent skill. */
  items: AdminSkillAssetItem[];
}
