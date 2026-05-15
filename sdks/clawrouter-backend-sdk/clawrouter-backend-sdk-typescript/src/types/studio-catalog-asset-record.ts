import type { JsonValue } from './json-value';

/** Studio catalog asset record schema exposed by Claw Router. */
export interface StudioCatalogAssetRecord {
  /** Alt text field on studio catalog asset record. */
  alt_text?: string;
  /** Artifact id field on studio catalog asset record. */
  artifact_id?: string;
  /** Asset type field on studio catalog asset record. */
  asset_type?: string;
  /** Asset url field on studio catalog asset record. */
  asset_url?: string;
  /** Created at field on studio catalog asset record. */
  created_at?: string;
  /** Data scope field on studio catalog asset record. */
  data_scope?: string;
  /** Deleted at field on studio catalog asset record. */
  deleted_at?: string;
  /** Deleted by field on studio catalog asset record. */
  deleted_by?: string;
  /** Duration seconds field on studio catalog asset record. */
  duration_seconds?: string;
  /** File size field on studio catalog asset record. */
  file_size?: string;
  /** Height field on studio catalog asset record. */
  height?: number;
  /** Id field on studio catalog asset record. */
  id?: string;
  /** Metadata field on studio catalog asset record. */
  metadata?: Record<string, JsonValue>;
  /** Mime type field on studio catalog asset record. */
  mime_type?: string;
  /** Organization id field on studio catalog asset record. */
  organization_id?: string;
  /** Published at field on studio catalog asset record. */
  published_at?: string;
  /** Sort order field on studio catalog asset record. */
  sort_order?: number;
  /** Status field on studio catalog asset record. */
  status?: string;
  /** Target id field on studio catalog asset record. */
  target_id?: string;
  /** Target type field on studio catalog asset record. */
  target_type?: string;
  /** Tenant id field on studio catalog asset record. */
  tenant_id?: string;
  /** Thumbnail url field on studio catalog asset record. */
  thumbnail_url?: string;
  /** Title field on studio catalog asset record. */
  title?: string;
  /** Updated at field on studio catalog asset record. */
  updated_at?: string;
  /** Uuid field on studio catalog asset record. */
  uuid?: string;
  /** Version field on studio catalog asset record. */
  version?: string;
  /** Width field on studio catalog asset record. */
  width?: number;
}
