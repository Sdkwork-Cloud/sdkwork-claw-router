import type { JsonValue } from './json-value';

/** Ai model api endpoint record schema exposed by Claw Router. */
export interface AiModelApiEndpointRecord {
  /** Api endpoint id field on ai model api endpoint record. */
  api_endpoint_id?: string;
  /** Catalog key field on ai model api endpoint record. */
  catalog_key: string;
  /** Created at field on ai model api endpoint record. */
  created_at?: string;
  /** Data scope field on ai model api endpoint record. */
  data_scope?: string;
  /** Default parameters field on ai model api endpoint record. */
  default_parameters?: Record<string, JsonValue>;
  /** Deleted at field on ai model api endpoint record. */
  deleted_at?: string;
  /** Deleted by field on ai model api endpoint record. */
  deleted_by?: string;
  /** Endpoint code field on ai model api endpoint record. */
  endpoint_code: string;
  /** Id field on ai model api endpoint record. */
  id?: string;
  /** Metadata field on ai model api endpoint record. */
  metadata?: Record<string, JsonValue>;
  /** Model field on ai model api endpoint record. */
  model?: string;
  /** Model id field on ai model api endpoint record. */
  model_id?: string;
  /** Organization id field on ai model api endpoint record. */
  organization_id: string;
  /** Provider native model field on ai model api endpoint record. */
  provider_native_model?: string;
  /** Sort order field on ai model api endpoint record. */
  sort_order?: number;
  /** Status field on ai model api endpoint record. */
  status: string;
  /** Supported field on ai model api endpoint record. */
  supported?: boolean;
  /** Supports streaming field on ai model api endpoint record. */
  supports_streaming?: boolean;
  /** Tenant id field on ai model api endpoint record. */
  tenant_id: string;
  /** Updated at field on ai model api endpoint record. */
  updated_at?: string;
  /** Uuid field on ai model api endpoint record. */
  uuid: string;
  /** Vendor code field on ai model api endpoint record. */
  vendor_code?: string;
  /** Version field on ai model api endpoint record. */
  version?: string;
}
