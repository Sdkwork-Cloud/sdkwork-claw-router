import type { JsonValue } from './json-value';

/** Ai usage fact record schema exposed by Claw Router. */
export interface AiUsageFactRecord {
  /** Api key id field on ai usage fact record. */
  api_key_id?: string;
  /** Api key name snapshot field on ai usage fact record. */
  api_key_name_snapshot?: string;
  /** Audio seconds field on ai usage fact record. */
  audio_seconds?: string;
  /** Bandwidth bytes field on ai usage fact record. */
  bandwidth_bytes?: string;
  /** Base input unit price field on ai usage fact record. */
  base_input_unit_price?: string;
  /** Base output unit price field on ai usage fact record. */
  base_output_unit_price?: string;
  /** Billable quantity field on ai usage fact record. */
  billable_quantity?: string;
  /** Billable unit field on ai usage fact record. */
  billable_unit?: string;
  /** Billing meter code field on ai usage fact record. */
  billing_meter_code?: string;
  /** Billing meter id field on ai usage fact record. */
  billing_meter_id?: string;
  /** Billing mode field on ai usage fact record. */
  billing_mode?: string;
  /** Billing tier field on ai usage fact record. */
  billing_tier?: string;
  /** Billing type field on ai usage fact record. */
  billing_type?: string;
  /** Cache read unit price field on ai usage fact record. */
  cache_read_unit_price?: string;
  /** Cached tokens field on ai usage fact record. */
  cached_tokens?: string;
  /** Catalog key field on ai usage fact record. */
  catalog_key: string;
  /** Channel group id field on ai usage fact record. */
  channel_group_id?: string;
  /** Channel group snapshot field on ai usage fact record. */
  channel_group_snapshot?: string;
  /** Channel id field on ai usage fact record. */
  channel_id?: string;
  /** Character count field on ai usage fact record. */
  character_count?: string;
  /** Completion tokens field on ai usage fact record. */
  completion_tokens?: string;
  /** Cost amount field on ai usage fact record. */
  cost_amount?: string;
  /** Created at field on ai usage fact record. */
  created_at?: string;
  /** Currency field on ai usage fact record. */
  currency?: string;
  /** Customer charge amount field on ai usage fact record. */
  customer_charge_amount?: string;
  /** Decision log id field on ai usage fact record. */
  decision_log_id?: string;
  /** Id field on ai usage fact record. */
  id?: string;
  /** Image count field on ai usage fact record. */
  image_count?: string;
  /** Item count field on ai usage fact record. */
  item_count?: string;
  /** Legacy api key id field on ai usage fact record. */
  legacy_api_key_id?: string;
  /** Legal hold field on ai usage fact record. */
  legal_hold?: boolean;
  /** Metadata field on ai usage fact record. */
  metadata?: Record<string, JsonValue>;
  /** Modality field on ai usage fact record. */
  modality?: string;
  /** Model field on ai usage fact record. */
  model?: string;
  /** Occurred at field on ai usage fact record. */
  occurred_at?: string;
  /** Official reference amount field on ai usage fact record. */
  official_reference_amount?: string;
  /** Organization id field on ai usage fact record. */
  organization_id?: string;
  /** Owner id field on ai usage fact record. */
  owner_id?: string;
  /** Owner name snapshot field on ai usage fact record. */
  owner_name_snapshot?: string;
  /** Owner type field on ai usage fact record. */
  owner_type?: string;
  /** Payload hash field on ai usage fact record. */
  payload_hash?: string;
  /** Pricing id field on ai usage fact record. */
  pricing_id?: string;
  /** Pricing plan code field on ai usage fact record. */
  pricing_plan_code?: string;
  /** Pricing plan id field on ai usage fact record. */
  pricing_plan_id?: string;
  /** Pricing rule id field on ai usage fact record. */
  pricing_rule_id?: string;
  /** Pricing snapshot field on ai usage fact record. */
  pricing_snapshot?: Record<string, JsonValue>;
  /** Pricing tier id field on ai usage fact record. */
  pricing_tier_id?: string;
  /** Prompt tokens field on ai usage fact record. */
  prompt_tokens?: string;
  /** Provider id field on ai usage fact record. */
  provider_id?: string;
  /** Provider native model field on ai usage fact record. */
  provider_native_model?: string;
  /** Rate multiplier field on ai usage fact record. */
  rate_multiplier?: string;
  /** Reasoning effort field on ai usage fact record. */
  reasoning_effort?: string;
  /** Reference multiplier field on ai usage fact record. */
  reference_multiplier?: string;
  /** Region code field on ai usage fact record. */
  region_code?: string;
  /** Request count field on ai usage fact record. */
  request_count?: string;
  /** Request id field on ai usage fact record. */
  request_id?: string;
  /** Requested model catalog key field on ai usage fact record. */
  requested_model_catalog_key?: string;
  /** Result count field on ai usage fact record. */
  result_count?: string;
  /** Retention until field on ai usage fact record. */
  retention_until?: string;
  /** Settlement id field on ai usage fact record. */
  settlement_id?: string;
  /** Settlement status field on ai usage fact record. */
  settlement_status?: string;
  /** Status field on ai usage fact record. */
  status?: string;
  /** Storage byte hours field on ai usage fact record. */
  storage_byte_hours?: string;
  /** Tenant id field on ai usage fact record. */
  tenant_id?: string;
  /** Total tokens field on ai usage fact record. */
  total_tokens?: string;
  /** Trace id field on ai usage fact record. */
  trace_id?: string;
  /** Unit price snapshot field on ai usage fact record. */
  unit_price_snapshot?: string;
  /** Upstream cost amount field on ai usage fact record. */
  upstream_cost_amount?: string;
  /** Usage type field on ai usage fact record. */
  usage_type?: string;
  /** User id field on ai usage fact record. */
  user_id?: string;
  /** Uuid field on ai usage fact record. */
  uuid: string;
  /** Video seconds field on ai usage fact record. */
  video_seconds?: string;
}
