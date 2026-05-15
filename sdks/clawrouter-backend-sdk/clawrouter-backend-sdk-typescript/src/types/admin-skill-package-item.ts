/** Enabled skill package snapshot returned by the backend. */
export interface AdminSkillPackageItem {
  /** Category id field on admin skill package item. */
  categoryId?: string | null;
  /** Cover image field on admin skill package item. */
  coverImage?: string;
  /** Created at field on admin skill package item. */
  createdAt: string;
  /** Description field on admin skill package item. */
  description?: string;
  /** Enabled field on admin skill package item. */
  enabled: boolean;
  /** Featured field on admin skill package item. */
  featured: boolean;
  /** Icon field on admin skill package item. */
  icon?: string;
  /** Id field on admin skill package item. */
  id: string;
  /** Latest published at field on admin skill package item. */
  latestPublishedAt?: string;
  /** Name field on admin skill package item. */
  name: string;
  /** Package key field on admin skill package item. */
  packageKey: string;
  /** Sort weight field on admin skill package item. */
  sortWeight: number;
  /** Summary field on admin skill package item. */
  summary?: string;
  /** Tags field on admin skill package item. */
  tags: string[];
  /** Updated at field on admin skill package item. */
  updatedAt: string;
}
