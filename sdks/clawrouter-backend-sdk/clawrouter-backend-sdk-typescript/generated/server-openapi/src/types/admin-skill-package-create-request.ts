import type { MediaResource } from './media-resource';

/** Admin skill package create request schema exposed by Claw Router. */
export interface AdminSkillPackageCreateRequest {
  /** Category id field on admin skill package create request. */
  categoryId?: string | null;
  /** Cover field on admin skill package create request. */
  cover?: MediaResource;
  /** Description field on admin skill package create request. */
  description?: string;
  /** Enabled field on admin skill package create request. */
  enabled?: boolean;
  /** Featured field on admin skill package create request. */
  featured?: boolean;
  /** Icon field on admin skill package create request. */
  icon?: MediaResource;
  /** Name field on admin skill package create request. */
  name: string;
  /** Package key field on admin skill package create request. */
  packageKey: string;
  /** Sort weight field on admin skill package create request. */
  sortWeight?: number;
  /** Summary field on admin skill package create request. */
  summary?: string;
  /** Tags field on admin skill package create request. */
  tags?: string[];
}
