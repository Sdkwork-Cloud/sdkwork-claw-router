import type { JsonValue } from './json-value';

/** Integration channel model record schema exposed by Claw Router. */
export interface IntegrationChannelModelRecord {
  /** Capability field on integration channel model record. */
  capability?: string;
  /** Catalog key field on integration channel model record. */
  catalog_key?: string;
  /** Channel id field on integration channel model record. */
  channel_id?: string;
  /** Created at field on integration channel model record. */
  created_at?: string;
  /** Data scope field on integration channel model record. */
  data_scope?: string;
  /** Default parameters field on integration channel model record. */
  default_parameters?: Record<string, JsonValue>;
  /** Deleted at field on integration channel model record. */
  deleted_at?: string;
  /** Deleted by field on integration channel model record. */
  deleted_by?: string;
  /** Effective from field on integration channel model record. */
  effective_from?: string;
  /** Effective to field on integration channel model record. */
  effective_to?: string;
  /** Id field on integration channel model record. */
  id?: string;
  /** Max input tokens field on integration channel model record. */
  max_input_tokens?: string;
  /** Max output tokens field on integration channel model record. */
  max_output_tokens?: string;
  /** Metadata field on integration channel model record. */
  metadata?: Record<string, JsonValue>;
  /** Model field on integration channel model record. */
  model?: string;
  /** Model aliases field on integration channel model record. */
  model_aliases?: Record<string, JsonValue>;
  /** Model id field on integration channel model record. */
  model_id?: string;
  /** Organization id field on integration channel model record. */
  organization_id?: string;
  /** Provider model field on integration channel model record. */
  provider_model?: string;
  /** Status field on integration channel model record. */
  status?: string;
  /** Supports streaming field on integration channel model record. */
  supports_streaming?: boolean;
  /** Supports tools field on integration channel model record. */
  supports_tools?: boolean;
  /** Tenant id field on integration channel model record. */
  tenant_id?: string;
  /** Updated at field on integration channel model record. */
  updated_at?: string;
  /** Uuid field on integration channel model record. */
  uuid?: string;
  /** Vendor code field on integration channel model record. */
  vendor_code?: string;
  /** Version field on integration channel model record. */
  version?: string;
}
