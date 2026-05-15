import type { AdminAppItemResponse } from './admin-app-item-response';

/** Admin app list response schema exposed by Claw Router. */
export interface AdminAppListResponse {
  /** PlusApp snapshots returned by the backend management API. */
  items: AdminAppItemResponse[];
}
