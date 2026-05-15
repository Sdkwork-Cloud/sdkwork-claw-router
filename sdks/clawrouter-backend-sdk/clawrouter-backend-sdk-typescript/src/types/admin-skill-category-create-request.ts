/** Admin skill category create request schema exposed by Claw Router. */
export interface AdminSkillCategoryCreateRequest {
  /** Optional stable category code. */
  code?: string;
  /** Optional category description. */
  description?: string;
  /** Optional icon URL or asset path. */
  icon?: string;
  /** Skill category display name. */
  name: string;
  /** Parent id field on admin skill category create request. */
  parentId?: string | null;
  /** Path field on admin skill category create request. */
  path?: string;
  /** Sort weight field on admin skill category create request. */
  sortWeight?: number;
  /** Status field on admin skill category create request. */
  status?: number;
  /** Type field on admin skill category create request. */
  type?: 19 | 20;
  /** Visible field on admin skill category create request. */
  visible?: boolean;
}
