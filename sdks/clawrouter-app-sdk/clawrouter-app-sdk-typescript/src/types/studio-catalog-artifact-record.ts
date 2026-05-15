import type { JsonValue } from './json-value';

/** Studio catalog artifact record schema exposed by Claw Router. */
export interface StudioCatalogArtifactRecord {
  /** Artifact ref field on studio catalog artifact record. */
  artifact_ref?: string;
  /** Artifact size bytes field on studio catalog artifact record. */
  artifact_size_bytes?: string;
  /** Artifact type field on studio catalog artifact record. */
  artifact_type?: string;
  /** Artifact url field on studio catalog artifact record. */
  artifact_url?: string;
  /** Checksum hash field on studio catalog artifact record. */
  checksum_hash?: string;
  /** Created at field on studio catalog artifact record. */
  created_at?: string;
  /** Data scope field on studio catalog artifact record. */
  data_scope?: string;
  /** Deleted at field on studio catalog artifact record. */
  deleted_at?: string;
  /** Deleted by field on studio catalog artifact record. */
  deleted_by?: string;
  /** Deprecated at field on studio catalog artifact record. */
  deprecated_at?: string;
  /** Frameworks field on studio catalog artifact record. */
  frameworks?: Record<string, JsonValue>;
  /** Id field on studio catalog artifact record. */
  id?: string;
  /** License name field on studio catalog artifact record. */
  license_name?: string;
  /** Metadata field on studio catalog artifact record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on studio catalog artifact record. */
  organization_id?: string;
  /** Os name field on studio catalog artifact record. */
  os_name?: string;
  /** Platform type field on studio catalog artifact record. */
  platform_type?: string;
  /** Published at field on studio catalog artifact record. */
  published_at?: string;
  /** Release notes field on studio catalog artifact record. */
  release_notes?: string;
  /** Runtime field on studio catalog artifact record. */
  runtime?: string;
  /** Status field on studio catalog artifact record. */
  status?: string;
  /** Target id field on studio catalog artifact record. */
  target_id?: string;
  /** Target type field on studio catalog artifact record. */
  target_type?: string;
  /** Tenant id field on studio catalog artifact record. */
  tenant_id?: string;
  /** Updated at field on studio catalog artifact record. */
  updated_at?: string;
  /** Uuid field on studio catalog artifact record. */
  uuid?: string;
  /** Version field on studio catalog artifact record. */
  version?: string;
}
