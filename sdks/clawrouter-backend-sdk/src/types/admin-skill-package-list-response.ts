import type { AdminSkillPackageItem } from './admin-skill-package-item';

export interface AdminSkillPackageListResponse {
  /** Skill package snapshots returned by the backend. */
  items: AdminSkillPackageItem[];
}
