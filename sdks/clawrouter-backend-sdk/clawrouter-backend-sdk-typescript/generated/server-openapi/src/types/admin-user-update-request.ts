/** Admin user update request schema exposed by Claw Router. */
export interface AdminUserUpdateRequest {
  /** Optional user group label update. */
  group?: string;
  /** User identifier. */
  id: string;
  /** Status field on admin user update request. */
  status?: 'active' | 'banned';
  /** Optional display name update. */
  username?: string;
}
