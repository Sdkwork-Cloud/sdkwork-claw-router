/** Persisted admin user snapshot returned by the backend. */
export interface AdminUserItem {
  /** Balance field on admin user item. */
  balance: string;
  /** Created at field on admin user item. */
  createdAt: string;
  /** Email field on admin user item. */
  email: string;
  /** Group field on admin user item. */
  group: string;
  /** Id field on admin user item. */
  id: number;
  /** Last active field on admin user item. */
  lastActive: string;
  /** Last used field on admin user item. */
  lastUsed: string;
  /** Role field on admin user item. */
  role: string;
  /** Status field on admin user item. */
  status: 'active' | 'banned';
  /** Username field on admin user item. */
  username: string;
}
