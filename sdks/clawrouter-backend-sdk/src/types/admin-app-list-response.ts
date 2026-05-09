import type { AdminAppItemResponse } from './admin-app-item-response';

export interface AdminAppListResponse {
  /** PlusApp snapshots returned by the backend management API. */
  items: AdminAppItemResponse[];
}
