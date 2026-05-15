import type { JsonValue } from './json-value';

/** Ai generation asset record schema exposed by Claw Router. */
export interface AiGenerationAssetRecord {
  /** Active index field on ai generation asset record. */
  active_index?: number;
  /** Asset type field on ai generation asset record. */
  asset_type?: string;
  /** Asset url field on ai generation asset record. */
  asset_url?: string;
  /** Created at field on ai generation asset record. */
  created_at?: string;
  /** Data scope field on ai generation asset record. */
  data_scope?: string;
  /** Deleted at field on ai generation asset record. */
  deleted_at?: string;
  /** Deleted by field on ai generation asset record. */
  deleted_by?: string;
  /** Download count field on ai generation asset record. */
  download_count?: string;
  /** Duration seconds field on ai generation asset record. */
  duration_seconds?: string;
  /** Expire at field on ai generation asset record. */
  expire_at?: string;
  /** Favorite field on ai generation asset record. */
  favorite?: boolean;
  /** File size field on ai generation asset record. */
  file_size?: string;
  /** Height field on ai generation asset record. */
  height?: number;
  /** Id field on ai generation asset record. */
  id?: string;
  /** Job id field on ai generation asset record. */
  job_id?: string;
  /** Last accessed at field on ai generation asset record. */
  last_accessed_at?: string;
  /** Metadata field on ai generation asset record. */
  metadata?: Record<string, JsonValue>;
  /** Mime type field on ai generation asset record. */
  mime_type?: string;
  /** Model snapshot field on ai generation asset record. */
  model_snapshot?: string;
  /** Organization id field on ai generation asset record. */
  organization_id?: string;
  /** Owner id field on ai generation asset record. */
  owner_id?: string;
  /** Owner type field on ai generation asset record. */
  owner_type?: string;
  /** Parameter snapshot field on ai generation asset record. */
  parameter_snapshot?: Record<string, JsonValue>;
  /** Prompt snapshot field on ai generation asset record. */
  prompt_snapshot?: string;
  /** Share token hash field on ai generation asset record. */
  share_token_hash?: string;
  /** Shared field on ai generation asset record. */
  shared?: boolean;
  /** Status field on ai generation asset record. */
  status?: string;
  /** Storage key field on ai generation asset record. */
  storage_key?: string;
  /** Storage provider field on ai generation asset record. */
  storage_provider?: string;
  /** Tenant id field on ai generation asset record. */
  tenant_id?: string;
  /** Thumbnail url field on ai generation asset record. */
  thumbnail_url?: string;
  /** Updated at field on ai generation asset record. */
  updated_at?: string;
  /** User id field on ai generation asset record. */
  user_id?: string;
  /** Uuid field on ai generation asset record. */
  uuid?: string;
  /** Version field on ai generation asset record. */
  version?: string;
  /** Visibility field on ai generation asset record. */
  visibility?: string;
  /** Width field on ai generation asset record. */
  width?: number;
}
