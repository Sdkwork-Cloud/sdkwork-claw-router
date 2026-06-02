import type { JsonValue } from './json-value';

/** Ai site model record schema exposed by Claw Router. */
export interface AiSiteModelRecord {
  /** Capabilities field on ai site model record. */
  capabilities?: Record<string, JsonValue>;
  /** Capability field on ai site model record. */
  capability?: string;
  /** Catalog key field on ai site model record. */
  catalog_key?: string;
  /** Consecutive error count field on ai site model record. */
  consecutive_error_count?: string;
  /** Context tokens field on ai site model record. */
  context_tokens?: string;
  /** Created at field on ai site model record. */
  created_at?: string;
  /** Data scope field on ai site model record. */
  data_scope?: string;
  /** Default parameters field on ai site model record. */
  default_parameters?: Record<string, JsonValue>;
  /** Deleted at field on ai site model record. */
  deleted_at?: string;
  /** Deleted by field on ai site model record. */
  deleted_by?: string;
  /** Display name field on ai site model record. */
  display_name?: string;
  /** Effective from field on ai site model record. */
  effective_from?: string;
  /** Effective to field on ai site model record. */
  effective_to?: string;
  /** Health status field on ai site model record. */
  health_status?: string;
  /** Id field on ai site model record. */
  id?: string;
  /** Last latency ms field on ai site model record. */
  last_latency_ms?: number;
  /** Last sync at field on ai site model record. */
  last_sync_at?: string;
  /** Max input tokens field on ai site model record. */
  max_input_tokens?: string;
  /** Max output tokens field on ai site model record. */
  max_output_tokens?: string;
  /** Metadata field on ai site model record. */
  metadata?: Record<string, JsonValue>;
  /** Modality field on ai site model record. */
  modality?: string;
  /** Model aliases field on ai site model record. */
  model_aliases?: Record<string, JsonValue>;
  /** Model code field on ai site model record. */
  model_code: string;
  /** Model id field on ai site model record. */
  model_id?: string;
  /** Model name field on ai site model record. */
  model_name: string;
  /** Organization id field on ai site model record. */
  organization_id: string;
  /** Pricing snapshot field on ai site model record. */
  pricing_snapshot?: Record<string, JsonValue>;
  /** Provider model field on ai site model record. */
  provider_model?: string;
  /** Provider native model field on ai site model record. */
  provider_native_model?: string;
  /** Service type field on ai site model record. */
  service_type: string;
  /** Site code field on ai site model record. */
  site_code: string;
  /** Site id field on ai site model record. */
  site_id: string;
  /** Site service code field on ai site model record. */
  site_service_code?: string;
  /** Site service id field on ai site model record. */
  site_service_id: string;
  /** Status field on ai site model record. */
  status: string;
  /** Supports json schema field on ai site model record. */
  supports_json_schema?: boolean;
  /** Supports streaming field on ai site model record. */
  supports_streaming?: boolean;
  /** Supports tools field on ai site model record. */
  supports_tools?: boolean;
  /** Tenant id field on ai site model record. */
  tenant_id: string;
  /** Updated at field on ai site model record. */
  updated_at?: string;
  /** Uuid field on ai site model record. */
  uuid: string;
  /** Vendor code field on ai site model record. */
  vendor_code?: string;
  /** Version field on ai site model record. */
  version?: string;
}
