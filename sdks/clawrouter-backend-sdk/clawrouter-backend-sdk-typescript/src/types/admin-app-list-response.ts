import type { AdminAppItemResponse } from './admin-app-item-response';

/** Admin app list response schema exposed by Claw Router. */
export interface AdminAppListResponse {
  /** Has next page field on admin app list response. */
  hasNextPage: boolean;
  /** PlusApp snapshots returned by the backend management API. */
  items: AdminAppItemResponse[];
  /** Page field on admin app list response. */
  page: number;
  /** Page size field on admin app list response. */
  pageSize: number;
  /** Total field on admin app list response. */
  total: number;
}
