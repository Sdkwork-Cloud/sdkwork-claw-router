/** Persisted announcement snapshot returned by the backend. */
export interface AdminAnnouncementItem {
  content: string;
  date: string;
  id: string;
  status: 'published' | 'draft';
  target: 'all' | 'vip' | 'free' | 'beta';
  title: string;
}
