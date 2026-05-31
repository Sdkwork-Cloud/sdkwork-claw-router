import type { JsonValue } from './json-value';

/** Ai provider object route record schema exposed by Claw Router. */
export interface AiProviderObjectRouteRecord {
  /** Api code field on ai provider object route record. */
  api_code?: string;
  /** Api key id field on ai provider object route record. */
  api_key_id?: string;
  /** Catalog key field on ai provider object route record. */
  catalog_key?: string;
  /** Channel group id field on ai provider object route record. */
  channel_group_id?: string;
  /** Channel id field on ai provider object route record. */
  channel_id: string;
  /** Created at field on ai provider object route record. */
  created_at?: string;
  /** Data scope field on ai provider object route record. */
  data_scope?: string;
  /** Deleted at field on ai provider object route record. */
  deleted_at?: string;
  /** Deleted by field on ai provider object route record. */
  deleted_by?: string;
  /** Endpoint id field on ai provider object route record. */
  endpoint_id?: string;
  /** Expires at field on ai provider object route record. */
  expires_at?: string;
  /** Id field on ai provider object route record. */
  id?: string;
  /** Last seen at field on ai provider object route record. */
  last_seen_at?: string;
  /** Metadata field on ai provider object route record. */
  metadata?: Record<string, JsonValue>;
  /** Object id field on ai provider object route record. */
  object_id: string;
  /** Object key hash field on ai provider object route record. */
  object_key_hash: string;
  /** Object type field on ai provider object route record. */
  object_type: string;
  /** Organization id field on ai provider object route record. */
  organization_id: string;
  /** Parent object id field on ai provider object route record. */
  parent_object_id?: string;
  /** Parent object type field on ai provider object route record. */
  parent_object_type?: string;
  /** Provider code field on ai provider object route record. */
  provider_code?: string;
  /** Provider model field on ai provider object route record. */
  provider_model?: string;
  /** Region code field on ai provider object route record. */
  region_code?: string;
  /** Status field on ai provider object route record. */
  status: string;
  /** Sticky scope field on ai provider object route record. */
  sticky_scope?: string;
  /** Tenant id field on ai provider object route record. */
  tenant_id: string;
  /** Updated at field on ai provider object route record. */
  updated_at?: string;
  /** Uuid field on ai provider object route record. */
  uuid: string;
  /** Vendor code field on ai provider object route record. */
  vendor_code?: string;
  /** Version field on ai provider object route record. */
  version?: string;
}
