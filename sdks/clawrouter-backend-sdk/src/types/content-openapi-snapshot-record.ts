export interface ContentOpenapiSnapshotRecord {
  api_surface?: string;
  api_system?: string;
  category_tree?: Record<string, unknown>;
  created_at?: string;
  endpoint_count?: number;
  example_manifest?: Record<string, unknown>;
  id?: string;
  metadata?: Record<string, unknown>;
  openapi_hash?: string;
  organization_id?: string;
  published_at?: string;
  rebuild_version?: string;
  source_id?: string;
  source_ref?: string;
  source_type?: string;
  source_version?: string;
  status?: string;
  tenant_id?: string;
  title?: string;
  updated_at?: string;
  uuid?: string;
  version?: string;
}
