import type { AdminSkillItem } from './admin-skill-item';

export interface AdminSkillListResponse {
  /** Agent skill snapshots returned by the backend. */
  items: AdminSkillItem[];
}
