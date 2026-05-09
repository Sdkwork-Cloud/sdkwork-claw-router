/** Persisted skill category snapshot returned by the backend. */
export interface AdminSkillCategoryItem {
  code?: string;
  description?: string;
  icon?: string;
  id: string;
  name: string;
  parentId?: string | null;
  path?: string;
  sortWeight: number;
  status: number;
  type: 19 | 20;
  visible: boolean;
}
