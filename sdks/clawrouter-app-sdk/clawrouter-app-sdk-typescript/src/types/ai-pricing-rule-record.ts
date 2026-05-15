import type { JsonValue } from './json-value';

/** Ai pricing rule record schema exposed by Claw Router. */
export interface AiPricingRuleRecord {
  /** Billing meter code field on ai pricing rule record. */
  billing_meter_code: string;
  /** Billing meter id field on ai pricing rule record. */
  billing_meter_id?: string;
  /** Billing mode field on ai pricing rule record. */
  billing_mode?: string;
  /** Billing type field on ai pricing rule record. */
  billing_type?: string;
  /** Capability code field on ai pricing rule record. */
  capability_code?: string;
  /** Channel id field on ai pricing rule record. */
  channel_id?: string;
  /** Created at field on ai pricing rule record. */
  created_at?: string;
  /** Data scope field on ai pricing rule record. */
  data_scope?: string;
  /** Deleted at field on ai pricing rule record. */
  deleted_at?: string;
  /** Deleted by field on ai pricing rule record. */
  deleted_by?: string;
  /** Effective from field on ai pricing rule record. */
  effective_from: string;
  /** Effective to field on ai pricing rule record. */
  effective_to?: string;
  /** Expression field on ai pricing rule record. */
  expression?: string;
  /** Expression hash field on ai pricing rule record. */
  expression_hash?: string;
  /** Fallback mode field on ai pricing rule record. */
  fallback_mode?: string;
  /** Family code field on ai pricing rule record. */
  family_code?: string;
  /** Formula mode field on ai pricing rule record. */
  formula_mode: string;
  /** Id field on ai pricing rule record. */
  id?: string;
  /** Included quantity field on ai pricing rule record. */
  included_quantity?: string;
  /** Markup amount field on ai pricing rule record. */
  markup_amount?: string;
  /** Match type field on ai pricing rule record. */
  match_type?: string;
  /** Metadata field on ai pricing rule record. */
  metadata?: Record<string, JsonValue>;
  /** Metering mode field on ai pricing rule record. */
  metering_mode?: string;
  /** Minimum quantity field on ai pricing rule record. */
  minimum_quantity?: string;
  /** Model field on ai pricing rule record. */
  model?: string;
  /** Model id field on ai pricing rule record. */
  model_id?: string;
  /** Multiplier field on ai pricing rule record. */
  multiplier?: string;
  /** Organization id field on ai pricing rule record. */
  organization_id: string;
  /** Platform code field on ai pricing rule record. */
  platform_code?: string;
  /** Price item type field on ai pricing rule record. */
  price_item_type?: string;
  /** Price side field on ai pricing rule record. */
  price_side?: string;
  /** Pricing plan code field on ai pricing rule record. */
  pricing_plan_code?: string;
  /** Pricing plan id field on ai pricing rule record. */
  pricing_plan_id: string;
  /** Priority field on ai pricing rule record. */
  priority: number;
  /** Provider code field on ai pricing rule record. */
  provider_code?: string;
  /** Provider model field on ai pricing rule record. */
  provider_model?: string;
  /** Quantity formula field on ai pricing rule record. */
  quantity_formula?: string;
  /** Quantity source field on ai pricing rule record. */
  quantity_source?: string;
  /** Quantity step field on ai pricing rule record. */
  quantity_step?: string;
  /** Reference price side field on ai pricing rule record. */
  reference_price_side?: string;
  /** Reference pricing id field on ai pricing rule record. */
  reference_pricing_id?: string;
  /** Reference pricing scope field on ai pricing rule record. */
  reference_pricing_scope?: string;
  /** Region field on ai pricing rule record. */
  region?: string;
  /** Result selector field on ai pricing rule record. */
  result_selector?: string;
  /** Rule code field on ai pricing rule record. */
  rule_code: string;
  /** Rule name field on ai pricing rule record. */
  rule_name?: string;
  /** Service tier field on ai pricing rule record. */
  service_tier?: string;
  /** Status field on ai pricing rule record. */
  status: string;
  /** Tenant id field on ai pricing rule record. */
  tenant_id: string;
  /** Unit field on ai pricing rule record. */
  unit?: string;
  /** Unit price override field on ai pricing rule record. */
  unit_price_override?: string;
  /** Unit size field on ai pricing rule record. */
  unit_size?: string;
  /** Updated at field on ai pricing rule record. */
  updated_at?: string;
  /** Uuid field on ai pricing rule record. */
  uuid: string;
  /** Vendor code field on ai pricing rule record. */
  vendor_code?: string;
  /** Version field on ai pricing rule record. */
  version?: string;
}
