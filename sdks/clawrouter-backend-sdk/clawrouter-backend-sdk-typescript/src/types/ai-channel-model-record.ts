import type { JsonValue } from './json-value';

/** Ai channel model record schema exposed by Claw Router. */
export interface AiChannelModelRecord {
  /** Api code field on ai channel model record. */
  api_code?: string;
  /** Capability field on ai channel model record. */
  capability?: string;
  /** Catalog key field on ai channel model record. */
  catalog_key?: string;
  /** Channel id field on ai channel model record. */
  channel_id?: string;
  /** Created at field on ai channel model record. */
  created_at?: string;
  /** Data scope field on ai channel model record. */
  data_scope?: string;
  /** Default parameters field on ai channel model record. */
  default_parameters?: Record<string, JsonValue>;
  /** Deleted at field on ai channel model record. */
  deleted_at?: string;
  /** Deleted by field on ai channel model record. */
  deleted_by?: string;
  /** Effective from field on ai channel model record. */
  effective_from?: string;
  /** Effective to field on ai channel model record. */
  effective_to?: string;
  /** Id field on ai channel model record. */
  id?: string;
  /** Max input tokens field on ai channel model record. */
  max_input_tokens?: string;
  /** Max output tokens field on ai channel model record. */
  max_output_tokens?: string;
  /** Metadata field on ai channel model record. */
  metadata?: Record<string, JsonValue>;
  /** Model field on ai channel model record. */
  model?: string;
  /** Model aliases field on ai channel model record. */
  model_aliases?: Record<string, JsonValue>;
  /** Model id field on ai channel model record. */
  model_id?: string;
  /** Organization id field on ai channel model record. */
  organization_id?: string;
  /** Provider model field on ai channel model record. */
  provider_model?: string;
  /** Provider native model field on ai channel model record. */
  provider_native_model?: string;
  /** Status field on ai channel model record. */
  status?: string;
  /** Supports streaming field on ai channel model record. */
  supports_streaming?: boolean;
  /** Supports tools field on ai channel model record. */
  supports_tools?: boolean;
  /** Tenant id field on ai channel model record. */
  tenant_id?: string;
  /** Updated at field on ai channel model record. */
  updated_at?: string;
  /** Uuid field on ai channel model record. */
  uuid?: string;
  /** Vendor code field on ai channel model record. */
  vendor_code?: string;
  /** Version field on ai channel model record. */
  version?: string;
}
