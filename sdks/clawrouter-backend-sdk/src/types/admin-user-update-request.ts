export interface AdminUserUpdateRequest {
  /** Optional access group update. */
  group?: string;
  /** User identifier. */
  id: number;
  status?: 'active' | 'banned';
  /** Optional display name update. */
  username?: string;
}
