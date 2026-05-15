import type { JsonValue } from './json-value';

/** Ai model pricing record schema exposed by Claw Router. */
export interface AiModelPricingRecord {
  /** Billing meter code field on ai model pricing record. */
  billing_meter_code: string;
  /** Billing meter id field on ai model pricing record. */
  billing_meter_id?: string;
  /** Billing mode field on ai model pricing record. */
  billing_mode: string;
  /** Billing type field on ai model pricing record. */
  billing_type?: string;
  /** Catalog key field on ai model pricing record. */
  catalog_key: string;
  /** Channel id field on ai model pricing record. */
  channel_id?: string;
  /** Created at field on ai model pricing record. */
  created_at?: string;
  /** Currency field on ai model pricing record. */
  currency: string;
  /** Data scope field on ai model pricing record. */
  data_scope?: string;
  /** Deleted at field on ai model pricing record. */
  deleted_at?: string;
  /** Deleted by field on ai model pricing record. */
  deleted_by?: string;
  /** Effective from field on ai model pricing record. */
  effective_from: string;
  /** Effective to field on ai model pricing record. */
  effective_to?: string;
  /** Id field on ai model pricing record. */
  id?: string;
  /** Import snapshot id field on ai model pricing record. */
  import_snapshot_id?: string;
  /** Included quantity field on ai model pricing record. */
  included_quantity?: string;
  /** Markup amount field on ai model pricing record. */
  markup_amount?: string;
  /** Metadata field on ai model pricing record. */
  metadata?: Record<string, JsonValue>;
  /** Metering mode field on ai model pricing record. */
  metering_mode?: string;
  /** Min charge amount field on ai model pricing record. */
  min_charge_amount?: string;
  /** Minimum quantity field on ai model pricing record. */
  minimum_quantity?: string;
  /** Model field on ai model pricing record. */
  model: string;
  /** Model id field on ai model pricing record. */
  model_id?: string;
  /** Observed at field on ai model pricing record. */
  observed_at?: string;
  /** Organization id field on ai model pricing record. */
  organization_id: string;
  /** Platform code field on ai model pricing record. */
  platform_code?: string;
  /** Price item type field on ai model pricing record. */
  price_item_type?: string;
  /** Price origin field on ai model pricing record. */
  price_origin?: string;
  /** Price side field on ai model pricing record. */
  price_side: string;
  /** Price version field on ai model pricing record. */
  price_version?: string;
  /** Pricing formula mode field on ai model pricing record. */
  pricing_formula_mode?: string;
  /** Pricing plan code field on ai model pricing record. */
  pricing_plan_code?: string;
  /** Pricing plan id field on ai model pricing record. */
  pricing_plan_id?: string;
  /** Pricing scope field on ai model pricing record. */
  pricing_scope?: string;
  /** Pricing scope id field on ai model pricing record. */
  pricing_scope_id?: string;
  /** Priority field on ai model pricing record. */
  priority?: number;
  /** Provider code field on ai model pricing record. */
  provider_code?: string;
  /** Provider model field on ai model pricing record. */
  provider_model?: string;
  /** Published at field on ai model pricing record. */
  published_at?: string;
  /** Quantity formula field on ai model pricing record. */
  quantity_formula?: string;
  /** Quantity source field on ai model pricing record. */
  quantity_source?: string;
  /** Quantity step field on ai model pricing record. */
  quantity_step?: string;
  /** Reference multiplier field on ai model pricing record. */
  reference_multiplier?: string;
  /** Reference price id field on ai model pricing record. */
  reference_price_id?: string;
  /** Reference price side field on ai model pricing record. */
  reference_price_side?: string;
  /** Region code field on ai model pricing record. */
  region_code: string;
  /** Result selector field on ai model pricing record. */
  result_selector?: string;
  /** Rounding mode field on ai model pricing record. */
  rounding_mode?: string;
  /** Service tier field on ai model pricing record. */
  service_tier?: string;
  /** Source hash field on ai model pricing record. */
  source_hash?: string;
  /** Source price id field on ai model pricing record. */
  source_price_id?: string;
  /** Source url field on ai model pricing record. */
  source_url?: string;
  /** Status field on ai model pricing record. */
  status: string;
  /** Tenant id field on ai model pricing record. */
  tenant_id: string;
  /** Unit field on ai model pricing record. */
  unit?: string;
  /** Unit price field on ai model pricing record. */
  unit_price: string;
  /** Unit size field on ai model pricing record. */
  unit_size: string;
  /** Updated at field on ai model pricing record. */
  updated_at?: string;
  /** Uuid field on ai model pricing record. */
  uuid: string;
  /** Vendor code field on ai model pricing record. */
  vendor_code: string;
  /** Version field on ai model pricing record. */
  version?: string;
}
