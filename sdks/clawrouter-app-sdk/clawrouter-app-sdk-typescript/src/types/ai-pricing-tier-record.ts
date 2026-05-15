import type { JsonValue } from './json-value';

/** Ai pricing tier record schema exposed by Claw Router. */
export interface AiPricingTierRecord {
  /** Audio unit price field on ai pricing tier record. */
  audio_unit_price?: string;
  /** Billing meter code field on ai pricing tier record. */
  billing_meter_code: string;
  /** Billing meter id field on ai pricing tier record. */
  billing_meter_id?: string;
  /** Billing mode field on ai pricing tier record. */
  billing_mode?: string;
  /** Cache read unit price field on ai pricing tier record. */
  cache_read_unit_price?: string;
  /** Cache write unit price field on ai pricing tier record. */
  cache_write_unit_price?: string;
  /** Created at field on ai pricing tier record. */
  created_at?: string;
  /** Currency field on ai pricing tier record. */
  currency?: string;
  /** Data scope field on ai pricing tier record. */
  data_scope?: string;
  /** Deleted at field on ai pricing tier record. */
  deleted_at?: string;
  /** Deleted by field on ai pricing tier record. */
  deleted_by?: string;
  /** Effective from field on ai pricing tier record. */
  effective_from: string;
  /** Effective to field on ai pricing tier record. */
  effective_to?: string;
  /** Id field on ai pricing tier record. */
  id?: string;
  /** Image unit price field on ai pricing tier record. */
  image_unit_price?: string;
  /** Included quantity field on ai pricing tier record. */
  included_quantity?: string;
  /** Input unit price field on ai pricing tier record. */
  input_unit_price?: string;
  /** Max quantity field on ai pricing tier record. */
  max_quantity?: string;
  /** Metadata field on ai pricing tier record. */
  metadata?: Record<string, JsonValue>;
  /** Min quantity field on ai pricing tier record. */
  min_quantity?: string;
  /** Model pricing id field on ai pricing tier record. */
  model_pricing_id?: string;
  /** Multiplier field on ai pricing tier record. */
  multiplier?: string;
  /** Organization id field on ai pricing tier record. */
  organization_id: string;
  /** Output unit price field on ai pricing tier record. */
  output_unit_price?: string;
  /** Per request price field on ai pricing tier record. */
  per_request_price?: string;
  /** Price item type field on ai pricing tier record. */
  price_item_type?: string;
  /** Pricing rule id field on ai pricing tier record. */
  pricing_rule_id?: string;
  /** Quantity step field on ai pricing tier record. */
  quantity_step?: string;
  /** Quantity unit field on ai pricing tier record. */
  quantity_unit?: string;
  /** Result selector field on ai pricing tier record. */
  result_selector?: string;
  /** Sort order field on ai pricing tier record. */
  sort_order: number;
  /** Status field on ai pricing tier record. */
  status: string;
  /** Tenant id field on ai pricing tier record. */
  tenant_id: string;
  /** Tier code field on ai pricing tier record. */
  tier_code: string;
  /** Tier label field on ai pricing tier record. */
  tier_label?: string;
  /** Updated at field on ai pricing tier record. */
  updated_at?: string;
  /** Uuid field on ai pricing tier record. */
  uuid: string;
  /** Version field on ai pricing tier record. */
  version?: string;
  /** Video unit price field on ai pricing tier record. */
  video_unit_price?: string;
}
