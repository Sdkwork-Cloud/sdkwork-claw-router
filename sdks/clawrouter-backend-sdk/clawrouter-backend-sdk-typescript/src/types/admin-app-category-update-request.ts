import type { MediaResource } from './media-resource';

/** Admin app category update request schema exposed by Claw Router. */
export interface AdminAppCategoryUpdateRequest {
  /** Code field on admin app category update request. */
  code?: string | null;
  /** Description field on admin app category update request. */
  description?: string | null;
  /** Icon field on admin app category update request. */
  icon?: MediaResource;
  /** App store category display name. */
  name?: string;
  /** Parent id field on admin app category update request. */
  parentId?: string | null;
  /** Path field on admin app category update request. */
  path?: string | null;
  /** Sort weight field on admin app category update request. */
  sortWeight?: number;
  /** Status field on admin app category update request. */
  status?: number;
  /** Visible field on admin app category update request. */
  visible?: boolean;
}
