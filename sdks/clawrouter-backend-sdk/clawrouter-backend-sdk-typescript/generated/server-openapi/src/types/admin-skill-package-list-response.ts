import type { AdminSkillPackageItem } from './admin-skill-package-item';

/** Admin skill package list response schema exposed by Claw Router. */
export interface AdminSkillPackageListResponse {
  /** Skill package snapshots returned by the backend. */
  items: AdminSkillPackageItem[];
}
