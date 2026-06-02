import type { JsonValue } from './json-value';

/** Media resource record schema exposed by Claw Router. */
export interface MediaResourceRecord {
  /** Access json field on media resource record. */
  access_json?: Record<string, JsonValue>;
  /** Ai json field on media resource record. */
  ai_json?: Record<string, JsonValue>;
  /** Alt text field on media resource record. */
  alt_text?: string;
  /** Bucket id field on media resource record. */
  bucket_id?: string;
  /** Checksum json field on media resource record. */
  checksum_json?: Record<string, JsonValue>;
  /** Created at field on media resource record. */
  created_at?: string;
  /** Data scope field on media resource record. */
  data_scope?: string;
  /** Deleted at field on media resource record. */
  deleted_at?: string;
  /** Deleted by field on media resource record. */
  deleted_by?: string;
  /** Duration seconds field on media resource record. */
  duration_seconds?: string;
  /** File name field on media resource record. */
  file_name?: string;
  /** Height field on media resource record. */
  height?: number;
  /** Id field on media resource record. */
  id?: string;
  /** Kind field on media resource record. */
  kind?: string;
  /** Media resource no field on media resource record. */
  media_resource_no?: string;
  /** Metadata field on media resource record. */
  metadata?: Record<string, JsonValue>;
  /** Mime type field on media resource record. */
  mime_type?: string;
  /** Object blob id field on media resource record. */
  object_blob_id?: string;
  /** Object key field on media resource record. */
  object_key?: string;
  /** Object version field on media resource record. */
  object_version?: string;
  /** Organization id field on media resource record. */
  organization_id?: string;
  /** Owner id field on media resource record. */
  owner_id?: string;
  /** Owner type field on media resource record. */
  owner_type?: string;
  /** Renditions json field on media resource record. */
  renditions_json?: Record<string, JsonValue>;
  /** Size bytes field on media resource record. */
  size_bytes?: string;
  /** Source field on media resource record. */
  source?: string;
  /** Status field on media resource record. */
  status?: string;
  /** Tenant id field on media resource record. */
  tenant_id?: string;
  /** Title field on media resource record. */
  title?: string;
  /** Updated at field on media resource record. */
  updated_at?: string;
  /** Uri field on media resource record. */
  uri?: string;
  /** User id field on media resource record. */
  user_id?: string;
  /** Uuid field on media resource record. */
  uuid?: string;
  /** Version field on media resource record. */
  version?: string;
  /** Width field on media resource record. */
  width?: number;
}
