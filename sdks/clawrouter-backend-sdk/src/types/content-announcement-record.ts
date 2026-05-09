export interface ContentAnnouncementRecord {
  announcement_type?: string;
  audience_filter?: Record<string, unknown>;
  content?: string;
  created_at?: string;
  data_scope?: string;
  deleted_at?: string;
  deleted_by?: string;
  effective_from?: string;
  effective_to?: string;
  id?: string;
  metadata?: Record<string, unknown>;
  organization_id?: string;
  pinned?: boolean;
  published_at?: string;
  status?: string;
  target_scope?: string;
  tenant_id?: string;
  title?: string;
  updated_at?: string;
  uuid?: string;
  version?: string;
}
