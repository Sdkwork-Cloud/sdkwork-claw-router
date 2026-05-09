export interface AdminSkillPackageCreateRequest {
  categoryId?: string | null;
  coverImage?: string;
  description?: string;
  enabled?: boolean;
  featured?: boolean;
  icon?: string;
  name: string;
  packageKey: string;
  sortWeight?: number;
  summary?: string;
  tags?: string[];
}
