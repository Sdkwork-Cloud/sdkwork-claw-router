import type { AdminAppCategoryItem } from './admin-app-category-item';

/** Admin app category list response schema exposed by Claw Router. */
export interface AdminAppCategoryListResponse {
  /** App store category snapshots returned by the backend. */
  items: AdminAppCategoryItem[];
}
