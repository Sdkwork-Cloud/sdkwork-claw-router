import type { JsonValue } from './json-value';

/** Ai model capability record schema exposed by Claw Router. */
export interface AiModelCapabilityRecord {
  /** Capability field on ai model capability record. */
  capability?: string;
  /** Capability code field on ai model capability record. */
  capability_code: string;
  /** Catalog key field on ai model capability record. */
  catalog_key: string;
  /** Created at field on ai model capability record. */
  created_at?: string;
  /** Data scope field on ai model capability record. */
  data_scope?: string;
  /** Deleted at field on ai model capability record. */
  deleted_at?: string;
  /** Deleted by field on ai model capability record. */
  deleted_by?: string;
  /** Description field on ai model capability record. */
  description?: string;
  /** Endpoint formats field on ai model capability record. */
  endpoint_formats?: Record<string, JsonValue>;
  /** Id field on ai model capability record. */
  id?: string;
  /** Input modalities field on ai model capability record. */
  input_modalities?: Record<string, JsonValue>;
  /** Limit unit field on ai model capability record. */
  limit_unit?: string;
  /** Limit value field on ai model capability record. */
  limit_value?: string;
  /** Metadata field on ai model capability record. */
  metadata?: Record<string, JsonValue>;
  /** Modality field on ai model capability record. */
  modality?: string;
  /** Model field on ai model capability record. */
  model: string;
  /** Model id field on ai model capability record. */
  model_id: string;
  /** Organization id field on ai model capability record. */
  organization_id: string;
  /** Output modalities field on ai model capability record. */
  output_modalities?: Record<string, JsonValue>;
  /** Parameter name field on ai model capability record. */
  parameter_name?: string;
  /** Parameter schema field on ai model capability record. */
  parameter_schema?: Record<string, JsonValue>;
  /** Schema version field on ai model capability record. */
  schema_version?: string;
  /** Sort order field on ai model capability record. */
  sort_order?: number;
  /** Status field on ai model capability record. */
  status: string;
  /** Supported field on ai model capability record. */
  supported: boolean;
  /** Tenant id field on ai model capability record. */
  tenant_id: string;
  /** Updated at field on ai model capability record. */
  updated_at?: string;
  /** Uuid field on ai model capability record. */
  uuid: string;
  /** Vendor code field on ai model capability record. */
  vendor_code: string;
  /** Version field on ai model capability record. */
  version?: string;
}
