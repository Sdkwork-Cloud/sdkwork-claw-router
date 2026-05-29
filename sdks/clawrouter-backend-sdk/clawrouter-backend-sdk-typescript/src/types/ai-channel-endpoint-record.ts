import type { JsonValue } from './json-value';

/** Ai channel endpoint record schema exposed by Claw Router. */
export interface AiChannelEndpointRecord {
  /** Api code field on ai channel endpoint record. */
  api_code: string;
  /** Api endpoint id field on ai channel endpoint record. */
  api_endpoint_id?: string;
  /** Base url field on ai channel endpoint record. */
  base_url: string;
  /** Channel code field on ai channel endpoint record. */
  channel_code: string;
  /** Channel id field on ai channel endpoint record. */
  channel_id: string;
  /** Channel type field on ai channel endpoint record. */
  channel_type: string;
  /** Consecutive error count field on ai channel endpoint record. */
  consecutive_error_count?: string;
  /** Created at field on ai channel endpoint record. */
  created_at?: string;
  /** Data scope field on ai channel endpoint record. */
  data_scope?: string;
  /** Deleted at field on ai channel endpoint record. */
  deleted_at?: string;
  /** Deleted by field on ai channel endpoint record. */
  deleted_by?: string;
  /** Effective from field on ai channel endpoint record. */
  effective_from?: string;
  /** Effective to field on ai channel endpoint record. */
  effective_to?: string;
  /** Id field on ai channel endpoint record. */
  id?: string;
  /** Last latency ms field on ai channel endpoint record. */
  last_latency_ms?: number;
  /** Metadata field on ai channel endpoint record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ai channel endpoint record. */
  organization_id: string;
  /** Path prefix field on ai channel endpoint record. */
  path_prefix?: string;
  /** Provider code field on ai channel endpoint record. */
  provider_code?: string;
  /** Region code field on ai channel endpoint record. */
  region_code: string;
  /** Retry policy field on ai channel endpoint record. */
  retry_policy?: Record<string, JsonValue>;
  /** Status field on ai channel endpoint record. */
  status: string;
  /** Tenant id field on ai channel endpoint record. */
  tenant_id: string;
  /** Timeout ms field on ai channel endpoint record. */
  timeout_ms?: number;
  /** Updated at field on ai channel endpoint record. */
  updated_at?: string;
  /** Uuid field on ai channel endpoint record. */
  uuid: string;
  /** Vendor code field on ai channel endpoint record. */
  vendor_code: string;
  /** Vendor id field on ai channel endpoint record. */
  vendor_id?: string;
  /** Version field on ai channel endpoint record. */
  version?: string;
}
