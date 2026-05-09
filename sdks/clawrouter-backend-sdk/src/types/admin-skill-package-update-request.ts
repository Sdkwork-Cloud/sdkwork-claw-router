export interface AdminSkillPackageUpdateRequest {
  categoryId?: string | null;
  coverImage?: string | null;
  description?: string | null;
  enabled?: boolean;
  featured?: boolean;
  icon?: string | null;
  name?: string;
  packageKey?: string;
  sortWeight?: number;
  summary?: string;
  tags?: string[];
}
