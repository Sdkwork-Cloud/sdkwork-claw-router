import type { MediaResource } from './media-resource';

/** Updated skill category snapshot returned by the backend. */
export interface AdminSkillCategoryItem {
  /** Code field on admin skill category item. */
  code?: string;
  /** Description field on admin skill category item. */
  description?: string;
  /** Icon field on admin skill category item. */
  icon?: MediaResource;
  /** Id field on admin skill category item. */
  id: string;
  /** Name field on admin skill category item. */
  name: string;
  /** Parent id field on admin skill category item. */
  parentId?: string | null;
  /** Path field on admin skill category item. */
  path?: string;
  /** Sort weight field on admin skill category item. */
  sortWeight: number;
  /** Status field on admin skill category item. */
  status: number;
  /** Type field on admin skill category item. */
  type: 19 | 20;
  /** Visible field on admin skill category item. */
  visible: boolean;
}
