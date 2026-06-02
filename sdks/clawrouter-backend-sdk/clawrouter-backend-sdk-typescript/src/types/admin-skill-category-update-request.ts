import type { MediaResource } from './media-resource';

/** Admin skill category update request schema exposed by Claw Router. */
export interface AdminSkillCategoryUpdateRequest {
  /** Code field on admin skill category update request. */
  code?: string | null;
  /** Description field on admin skill category update request. */
  description?: string | null;
  /** Icon field on admin skill category update request. */
  icon?: MediaResource;
  /** Skill category display name. */
  name?: string;
  /** Parent id field on admin skill category update request. */
  parentId?: string | null;
  /** Path field on admin skill category update request. */
  path?: string | null;
  /** Sort weight field on admin skill category update request. */
  sortWeight?: number;
  /** Status field on admin skill category update request. */
  status?: number;
  /** Type field on admin skill category update request. */
  type?: 19 | 20;
  /** Visible field on admin skill category update request. */
  visible?: boolean;
}
