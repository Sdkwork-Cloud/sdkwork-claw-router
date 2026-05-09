import type { AdminSkillAssetItem } from './admin-skill-asset-item';

export interface AdminSkillAssetListResponse {
  /** Skill catalog assets attached to the agent skill. */
  items: AdminSkillAssetItem[];
}
