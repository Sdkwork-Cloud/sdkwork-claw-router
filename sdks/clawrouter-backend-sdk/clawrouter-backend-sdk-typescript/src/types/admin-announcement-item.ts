/** Persisted announcement snapshot returned by the backend. */
export interface AdminAnnouncementItem {
  /** Content field on admin announcement item. */
  content: string;
  /** Date field on admin announcement item. */
  date: string;
  /** Id field on admin announcement item. */
  id: string;
  /** Status field on admin announcement item. */
  status: 'published' | 'draft';
  /** Target field on admin announcement item. */
  target: 'all' | 'vip' | 'free' | 'beta';
  /** Title field on admin announcement item. */
  title: string;
}
