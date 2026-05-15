/** Admin announcement update request schema exposed by Claw Router. */
export interface AdminAnnouncementUpdateRequest {
  /** Optional announcement body content update. */
  content?: string;
  /** Optional announcement publication state update. */
  status?: 'published' | 'draft';
  /** Optional announcement audience segment update. */
  target?: 'all' | 'vip' | 'free' | 'beta';
  /** Optional announcement title update. */
  title?: string;
}
