import type { JsonValue } from './json-value';

/** Ai resource record schema exposed by Claw Router. */
export interface AiResourceRecord {
  /** Api code field on ai resource record. */
  api_code?: string;
  /** Api endpoint id field on ai resource record. */
  api_endpoint_id?: string;
  /** Catalog key field on ai resource record. */
  catalog_key?: string;
  /** Created at field on ai resource record. */
  created_at?: string;
  /** Data scope field on ai resource record. */
  data_scope?: string;
  /** Deleted at field on ai resource record. */
  deleted_at?: string;
  /** Deleted by field on ai resource record. */
  deleted_by?: string;
  /** Description field on ai resource record. */
  description?: string;
  /** Display name field on ai resource record. */
  display_name?: string;
  /** Id field on ai resource record. */
  id?: string;
  /** Metadata field on ai resource record. */
  metadata?: Record<string, JsonValue>;
  /** Metadata schema field on ai resource record. */
  metadata_schema?: Record<string, JsonValue>;
  /** Modality code field on ai resource record. */
  modality_code?: string;
  /** Modality id field on ai resource record. */
  modality_id?: string;
  /** Model field on ai resource record. */
  model?: string;
  /** Model code field on ai resource record. */
  model_code?: string;
  /** Model id field on ai resource record. */
  model_id?: string;
  /** Organization id field on ai resource record. */
  organization_id: string;
  /** Provider native model field on ai resource record. */
  provider_native_model?: string;
  /** Resource code field on ai resource record. */
  resource_code: string;
  /** Resource schema field on ai resource record. */
  resource_schema?: Record<string, JsonValue>;
  /** Resource type field on ai resource record. */
  resource_type: string;
  /** Sort order field on ai resource record. */
  sort_order?: number;
  /** Status field on ai resource record. */
  status: string;
  /** Tenant id field on ai resource record. */
  tenant_id: string;
  /** Updated at field on ai resource record. */
  updated_at?: string;
  /** Uuid field on ai resource record. */
  uuid: string;
  /** Vendor code field on ai resource record. */
  vendor_code?: string;
  /** Vendor id field on ai resource record. */
  vendor_id?: string;
  /** Version field on ai resource record. */
  version?: string;
}
