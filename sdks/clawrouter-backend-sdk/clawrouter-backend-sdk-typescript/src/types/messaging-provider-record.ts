import type { JsonValue } from './json-value';
import type { MediaResource } from './media-resource';

/** Messaging provider record schema exposed by Claw Router. */
export interface MessagingProviderRecord {
  /** Channel field on messaging provider record. */
  channel?: string;
  /** Created at field on messaging provider record. */
  created_at?: string;
  /** Data scope field on messaging provider record. */
  data_scope?: string;
  /** Deleted at field on messaging provider record. */
  deleted_at?: string;
  /** Deleted by field on messaging provider record. */
  deleted_by?: string;
  /** Display name field on messaging provider record. */
  display_name: string;
  /** Docs url field on messaging provider record. */
  docs_url?: string;
  /** Icon field on messaging provider record. */
  icon?: MediaResource;
  /** Id field on messaging provider record. */
  id?: string;
  /** Metadata field on messaging provider record. */
  metadata?: Record<string, JsonValue>;
  /** Metadata schema version field on messaging provider record. */
  metadata_schema_version?: string;
  /** Organization id field on messaging provider record. */
  organization_id: string;
  /** Provider code field on messaging provider record. */
  provider_code: string;
  /** Provider type field on messaging provider record. */
  provider_type?: string;
  /** Sort order field on messaging provider record. */
  sort_order?: number;
  /** Status field on messaging provider record. */
  status: string;
  /** Tenant id field on messaging provider record. */
  tenant_id: string;
  /** Updated at field on messaging provider record. */
  updated_at?: string;
  /** Uuid field on messaging provider record. */
  uuid: string;
  /** Version field on messaging provider record. */
  version?: string;
  /** Website url field on messaging provider record. */
  website_url?: string;
}
