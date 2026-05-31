import type { JsonValue } from './json-value';

/** Ai resource route profile record schema exposed by Claw Router. */
export interface AiResourceRouteProfileRecord {
  /** Billing meter code field on ai resource route profile record. */
  billing_meter_code?: string;
  /** Cache ttl seconds field on ai resource route profile record. */
  cache_ttl_seconds?: string;
  /** Capability field on ai resource route profile record. */
  capability?: string;
  /** Created at field on ai resource route profile record. */
  created_at?: string;
  /** Data scope field on ai resource route profile record. */
  data_scope?: string;
  /** Deleted at field on ai resource route profile record. */
  deleted_at?: string;
  /** Deleted by field on ai resource route profile record. */
  deleted_by?: string;
  /** Http method field on ai resource route profile record. */
  http_method?: string;
  /** Id field on ai resource route profile record. */
  id?: string;
  /** Metadata field on ai resource route profile record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ai resource route profile record. */
  organization_id: string;
  /** Parent object types field on ai resource route profile record. */
  parent_object_types?: Record<string, JsonValue>;
  /** Path pattern field on ai resource route profile record. */
  path_pattern?: string;
  /** Request extractors field on ai resource route profile record. */
  request_extractors?: Record<string, JsonValue>;
  /** Resource code field on ai resource route profile record. */
  resource_code: string;
  /** Resource id field on ai resource route profile record. */
  resource_id?: string;
  /** Response bindings field on ai resource route profile record. */
  response_bindings?: Record<string, JsonValue>;
  /** Route key field on ai resource route profile record. */
  route_key: string;
  /** Sort order field on ai resource route profile record. */
  sort_order?: number;
  /** Status field on ai resource route profile record. */
  status: string;
  /** Sticky object type field on ai resource route profile record. */
  sticky_object_type?: string;
  /** Sticky scope field on ai resource route profile record. */
  sticky_scope?: string;
  /** Tenant id field on ai resource route profile record. */
  tenant_id: string;
  /** Updated at field on ai resource route profile record. */
  updated_at?: string;
  /** Uuid field on ai resource route profile record. */
  uuid: string;
  /** Version field on ai resource route profile record. */
  version?: string;
}
