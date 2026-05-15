import type { AdminAccessGroupItem } from './admin-access-group-item';

/** Admin access groups response schema exposed by Claw Router. */
export interface AdminAccessGroupsResponse {
  /** Items field on admin access groups response. */
  items: AdminAccessGroupItem[];
}
