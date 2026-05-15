import type { AdminUserItem } from './admin-user-item';

/** Admin users response schema exposed by Claw Router. */
export interface AdminUsersResponse {
  /** Items field on admin users response. */
  items: AdminUserItem[];
}
