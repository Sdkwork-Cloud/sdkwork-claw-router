/** Admin announcement create request schema exposed by Claw Router. */
export interface AdminAnnouncementCreateRequest {
  /** Announcement body content. */
  content: string;
  /** Publication state for the announcement. */
  status: 'published' | 'draft';
  /** Audience segment that should receive the announcement. */
  target: 'all' | 'vip' | 'free' | 'beta';
  /** Announcement title displayed in admin and console surfaces. */
  title: string;
}
