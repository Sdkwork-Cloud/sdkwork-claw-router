import type { MediaResource } from './media-resource';

/** Admin skill package update request schema exposed by Claw Router. */
export interface AdminSkillPackageUpdateRequest {
  /** Category id field on admin skill package update request. */
  categoryId?: string | null;
  /** Cover field on admin skill package update request. */
  cover?: MediaResource;
  /** Description field on admin skill package update request. */
  description?: string | null;
  /** Enabled field on admin skill package update request. */
  enabled?: boolean;
  /** Featured field on admin skill package update request. */
  featured?: boolean;
  /** Icon field on admin skill package update request. */
  icon?: MediaResource;
  /** Name field on admin skill package update request. */
  name?: string;
  /** Package key field on admin skill package update request. */
  packageKey?: string;
  /** Sort weight field on admin skill package update request. */
  sortWeight?: number;
  /** Summary field on admin skill package update request. */
  summary?: string;
  /** Tags field on admin skill package update request. */
  tags?: string[];
}
