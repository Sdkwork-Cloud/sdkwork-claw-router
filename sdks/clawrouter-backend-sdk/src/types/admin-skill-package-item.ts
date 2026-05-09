/** Enabled skill package snapshot returned by the backend. */
export interface AdminSkillPackageItem {
  categoryId?: string | null;
  coverImage?: string;
  createdAt: string;
  description?: string;
  enabled: boolean;
  featured: boolean;
  icon?: string;
  id: string;
  latestPublishedAt?: string;
  name: string;
  packageKey: string;
  sortWeight: number;
  summary?: string;
  tags: string[];
  updatedAt: string;
}
