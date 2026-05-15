/** Admin user update request schema exposed by Claw Router. */
export interface AdminUserUpdateRequest {
  /** Optional access group update. */
  group?: string;
  /** User identifier. */
  id: number;
  /** Status field on admin user update request. */
  status?: 'active' | 'banned';
  /** Optional display name update. */
  username?: string;
}
