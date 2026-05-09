export interface ContentForumCommentRecord {
  author_id?: string;
  author_snapshot?: Record<string, unknown>;
  body?: string;
  course_id?: string;
  created_at?: string;
  data_scope?: string;
  deleted_at?: string;
  deleted_by?: string;
  id?: string;
  like_count?: string;
  metadata?: Record<string, unknown>;
  organization_id?: string;
  owner_id?: string;
  owner_type?: string;
  parent_id?: string;
  post_id?: string;
  root_id?: string;
  status?: string;
  target_id?: string;
  target_type?: string;
  tenant_id?: string;
  updated_at?: string;
  user_id?: string;
  uuid?: string;
  version?: string;
}
