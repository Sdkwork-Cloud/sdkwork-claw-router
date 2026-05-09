/** Persisted admin user snapshot returned by the backend. */
export interface AdminUserItem {
  balance: string;
  createdAt: string;
  email: string;
  group: string;
  id: number;
  lastActive: string;
  lastUsed: string;
  role: string;
  status: 'active' | 'banned';
  username: string;
}
