import type { JsonValue } from './json-value';
import type { MediaResource } from './media-resource';

/** Ai provider record schema exposed by Claw Router. */
export interface AiProviderRecord {
  /** Auth type field on ai provider record. */
  auth_type?: string;
  /** Base url field on ai provider record. */
  base_url?: string;
  /** Color token field on ai provider record. */
  color_token?: string;
  /** Created at field on ai provider record. */
  created_at?: string;
  /** Data scope field on ai provider record. */
  data_scope?: string;
  /** Default vendor code field on ai provider record. */
  default_vendor_code?: string;
  /** Deleted at field on ai provider record. */
  deleted_at?: string;
  /** Deleted by field on ai provider record. */
  deleted_by?: string;
  /** Description field on ai provider record. */
  description?: string;
  /** Display name field on ai provider record. */
  display_name: string;
  /** Docs url field on ai provider record. */
  docs_url?: string;
  /** Icon field on ai provider record. */
  icon?: MediaResource;
  /** Id field on ai provider record. */
  id?: string;
  /** Metadata field on ai provider record. */
  metadata?: Record<string, JsonValue>;
  /** Metadata schema version field on ai provider record. */
  metadata_schema_version?: string;
  /** Organization id field on ai provider record. */
  organization_id: string;
  /** Protocol code field on ai provider record. */
  protocol_code?: string;
  /** Provider code field on ai provider record. */
  provider_code: string;
  /** Provider type field on ai provider record. */
  provider_type?: string;
  /** Resource schema field on ai provider record. */
  resource_schema?: Record<string, JsonValue>;
  /** Sort order field on ai provider record. */
  sort_order?: number;
  /** Status field on ai provider record. */
  status: string;
  /** Tenant id field on ai provider record. */
  tenant_id: string;
  /** Updated at field on ai provider record. */
  updated_at?: string;
  /** Uuid field on ai provider record. */
  uuid: string;
  /** Version field on ai provider record. */
  version?: string;
  /** Website url field on ai provider record. */
  website_url?: string;
}
