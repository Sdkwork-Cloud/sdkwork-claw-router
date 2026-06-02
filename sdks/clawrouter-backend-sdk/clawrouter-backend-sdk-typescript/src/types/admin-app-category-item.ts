import type { MediaResource } from './media-resource';

/** Updated app store category snapshot returned by the backend. */
export interface AdminAppCategoryItem {
  /** Code field on admin app category item. */
  code?: string;
  /** Description field on admin app category item. */
  description?: string;
  /** Icon field on admin app category item. */
  icon?: MediaResource;
  /** Id field on admin app category item. */
  id: string;
  /** Name field on admin app category item. */
  name: string;
  /** Parent id field on admin app category item. */
  parentId?: string | null;
  /** Path field on admin app category item. */
  path?: string;
  /** Sort weight field on admin app category item. */
  sortWeight: number;
  /** Status field on admin app category item. */
  status: number;
  /** Type field on admin app category item. */
  type: 999999;
  /** Visible field on admin app category item. */
  visible: boolean;
}
