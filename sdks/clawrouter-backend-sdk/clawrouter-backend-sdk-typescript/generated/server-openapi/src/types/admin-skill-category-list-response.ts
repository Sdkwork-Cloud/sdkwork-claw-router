import type { AdminSkillCategoryItem } from './admin-skill-category-item';

/** Admin skill category list response schema exposed by Claw Router. */
export interface AdminSkillCategoryListResponse {
  /** Skill category snapshots returned by the backend. */
  items: AdminSkillCategoryItem[];
}
