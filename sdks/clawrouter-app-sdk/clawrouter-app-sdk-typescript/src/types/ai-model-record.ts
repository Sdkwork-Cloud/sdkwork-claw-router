import type { JsonValue } from './json-value';

/** Ai model record schema exposed by Claw Router. */
export interface AiModelRecord {
  /** Api format field on ai model record. */
  api_format?: string;
  /** Capabilities field on ai model record. */
  capabilities?: Record<string, JsonValue>;
  /** Capability field on ai model record. */
  capability?: string;
  /** Capability intro field on ai model record. */
  capability_intro?: string;
  /** Catalog key field on ai model record. */
  catalog_key: string;
  /** Color token field on ai model record. */
  color_token?: string;
  /** Context tokens field on ai model record. */
  context_tokens?: string;
  /** Created at field on ai model record. */
  created_at?: string;
  /** Data scope field on ai model record. */
  data_scope?: string;
  /** Default pricing id field on ai model record. */
  default_pricing_id?: string;
  /** Deleted at field on ai model record. */
  deleted_at?: string;
  /** Deleted by field on ai model record. */
  deleted_by?: string;
  /** Deprecated at field on ai model record. */
  deprecated_at?: string;
  /** Description field on ai model record. */
  description?: string;
  /** Display name field on ai model record. */
  display_name: string;
  /** Docs url field on ai model record. */
  docs_url?: string;
  /** Family code field on ai model record. */
  family_code?: string;
  /** Family id field on ai model record. */
  family_id?: string;
  /** Icon url field on ai model record. */
  icon_url?: string;
  /** Id field on ai model record. */
  id?: string;
  /** Input modalities field on ai model record. */
  input_modalities?: Record<string, JsonValue>;
  /** License type field on ai model record. */
  license_type?: string;
  /** Limitations field on ai model record. */
  limitations?: Record<string, JsonValue>;
  /** Max duration seconds field on ai model record. */
  max_duration_seconds?: number;
  /** Max input tokens field on ai model record. */
  max_input_tokens?: string;
  /** Max output tokens field on ai model record. */
  max_output_tokens?: string;
  /** Metadata field on ai model record. */
  metadata?: Record<string, JsonValue>;
  /** Modalities field on ai model record. */
  modalities?: Record<string, JsonValue>;
  /** Model field on ai model record. */
  model: string;
  /** Model aliases field on ai model record. */
  model_aliases?: Record<string, JsonValue>;
  /** Model family field on ai model record. */
  model_family?: string;
  /** Model version field on ai model record. */
  model_version?: string;
  /** Organization id field on ai model record. */
  organization_id: string;
  /** Output modalities field on ai model record. */
  output_modalities?: Record<string, JsonValue>;
  /** Performance profile field on ai model record. */
  performance_profile?: Record<string, JsonValue>;
  /** Provider hint field on ai model record. */
  provider_hint?: string;
  /** Rank score field on ai model record. */
  rank_score?: string;
  /** Region code field on ai model record. */
  region_code: string;
  /** Release stage field on ai model record. */
  release_stage: string;
  /** Replacement model field on ai model record. */
  replacement_model?: string;
  /** Retired at field on ai model record. */
  retired_at?: string;
  /** Routing state field on ai model record. */
  routing_state: string;
  /** Shelf state field on ai model record. */
  shelf_state: string;
  /** Status field on ai model record. */
  status: string;
  /** Supported languages field on ai model record. */
  supported_languages?: Record<string, JsonValue>;
  /** Supports json schema field on ai model record. */
  supports_json_schema?: boolean;
  /** Supports streaming field on ai model record. */
  supports_streaming?: boolean;
  /** Supports tools field on ai model record. */
  supports_tools?: boolean;
  /** Tenant id field on ai model record. */
  tenant_id: string;
  /** Training data cutoff field on ai model record. */
  training_data_cutoff?: string;
  /** Updated at field on ai model record. */
  updated_at?: string;
  /** Use cases field on ai model record. */
  use_cases?: Record<string, JsonValue>;
  /** Uuid field on ai model record. */
  uuid: string;
  /** Vendor code field on ai model record. */
  vendor_code: string;
  /** Vendor id field on ai model record. */
  vendor_id?: string;
  /** Vendor name snapshot field on ai model record. */
  vendor_name_snapshot?: string;
  /** Version field on ai model record. */
  version?: string;
}
