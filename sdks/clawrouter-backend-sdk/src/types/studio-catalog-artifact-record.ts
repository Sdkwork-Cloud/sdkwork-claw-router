export interface StudioCatalogArtifactRecord {
  artifact_ref?: string;
  artifact_size_bytes?: string;
  artifact_type?: string;
  artifact_url?: string;
  checksum_hash?: string;
  created_at?: string;
  data_scope?: string;
  deleted_at?: string;
  deleted_by?: string;
  deprecated_at?: string;
  frameworks?: Record<string, unknown>;
  id?: string;
  license_name?: string;
  metadata?: Record<string, unknown>;
  organization_id?: string;
  os_name?: string;
  platform_type?: string;
  published_at?: string;
  release_notes?: string;
  runtime?: string;
  status?: string;
  target_id?: string;
  target_type?: string;
  tenant_id?: string;
  updated_at?: string;
  uuid?: string;
  version?: string;
}
