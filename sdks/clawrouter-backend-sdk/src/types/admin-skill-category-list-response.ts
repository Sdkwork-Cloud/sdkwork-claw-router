import type { AdminSkillCategoryItem } from './admin-skill-category-item';

export interface AdminSkillCategoryListResponse {
  /** Skill category snapshots returned by the backend. */
  items: AdminSkillCategoryItem[];
}
