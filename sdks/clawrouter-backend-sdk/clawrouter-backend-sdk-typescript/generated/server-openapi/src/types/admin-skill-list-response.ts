import type { AdminSkillItem } from './admin-skill-item';

/** Admin skill list response schema exposed by Claw Router. */
export interface AdminSkillListResponse {
  /** Agent skill snapshots returned by the backend. */
  items: AdminSkillItem[];
}
