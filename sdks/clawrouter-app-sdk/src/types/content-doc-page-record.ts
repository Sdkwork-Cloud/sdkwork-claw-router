export interface ContentDocPageRecord {
  content_hash?: string;
  content_source?: string;
  created_at?: string;
  data_scope?: string;
  deleted_at?: string;
  deleted_by?: string;
  doc_code?: string;
  doc_type?: string;
  id?: string;
  metadata?: Record<string, unknown>;
  organization_id?: string;
  path?: string;
  published_at?: string;
  slug?: string;
  sort_order?: number;
  source_ref?: string;
  status?: string;
  summary?: string;
  tenant_id?: string;
  title?: string;
  updated_at?: string;
  uuid?: string;
  version?: string;
}
