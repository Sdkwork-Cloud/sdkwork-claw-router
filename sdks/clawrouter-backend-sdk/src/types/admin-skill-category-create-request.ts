export interface AdminSkillCategoryCreateRequest {
  /** Optional stable category code. */
  code?: string;
  /** Optional category description. */
  description?: string;
  /** Optional icon URL or asset path. */
  icon?: string;
  /** Skill category display name. */
  name: string;
  parentId?: string | null;
  path?: string;
  sortWeight?: number;
  status?: number;
  type?: 19 | 20;
  visible?: boolean;
}
