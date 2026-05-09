export interface ContentForumPostRecord {
  author_id?: string;
  author_snapshot?: Record<string, unknown>;
  body?: string;
  category?: string;
  comment_count?: string;
  content_snippet?: string;
  created_at?: string;
  data_scope?: string;
  deleted_at?: string;
  deleted_by?: string;
  id?: string;
  last_replied_at?: string;
  like_count?: string;
  metadata?: Record<string, unknown>;
  organization_id?: string;
  owner_id?: string;
  owner_type?: string;
  pinned?: boolean;
  status?: string;
  tags?: Record<string, unknown>;
  tenant_id?: string;
  title?: string;
  updated_at?: string;
  user_id?: string;
  uuid?: string;
  version?: string;
  view_count?: string;
}
