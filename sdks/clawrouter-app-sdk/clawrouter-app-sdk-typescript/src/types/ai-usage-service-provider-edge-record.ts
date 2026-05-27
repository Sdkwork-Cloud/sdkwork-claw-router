import type { JsonValue } from './json-value';

/** Ai usage service provider edge record schema exposed by Claw Router. */
export interface AiUsageServiceProviderEdgeRecord {
  /** Amount role field on ai usage service provider edge record. */
  amount_role?: string;
  /** Billable quantity field on ai usage service provider edge record. */
  billable_quantity?: string;
  /** Billing meter code field on ai usage service provider edge record. */
  billing_meter_code?: string;
  /** Buyer provider id field on ai usage service provider edge record. */
  buyer_provider_id?: string;
  /** Buyer snapshot field on ai usage service provider edge record. */
  buyer_snapshot?: Record<string, JsonValue>;
  /** Chain id field on ai usage service provider edge record. */
  chain_id?: string;
  /** Charge amount field on ai usage service provider edge record. */
  charge_amount?: string;
  /** Converted charge amount field on ai usage service provider edge record. */
  converted_charge_amount?: string;
  /** Created at field on ai usage service provider edge record. */
  created_at?: string;
  /** Currency field on ai usage service provider edge record. */
  currency?: string;
  /** Edge depth field on ai usage service provider edge record. */
  edge_depth?: number;
  /** Edge id field on ai usage service provider edge record. */
  edge_id?: string;
  /** Fx rate snapshot field on ai usage service provider edge record. */
  fx_rate_snapshot?: string;
  /** Id field on ai usage service provider edge record. */
  id?: string;
  /** Legal hold field on ai usage service provider edge record. */
  legal_hold?: boolean;
  /** Metadata field on ai usage service provider edge record. */
  metadata?: Record<string, JsonValue>;
  /** Occurred at field on ai usage service provider edge record. */
  occurred_at?: string;
  /** Organization id field on ai usage service provider edge record. */
  organization_id?: string;
  /** Payload hash field on ai usage service provider edge record. */
  payload_hash?: string;
  /** Price snapshot field on ai usage service provider edge record. */
  price_snapshot?: Record<string, JsonValue>;
  /** Pricing plan id field on ai usage service provider edge record. */
  pricing_plan_id?: string;
  /** Pricing rule id field on ai usage service provider edge record. */
  pricing_rule_id?: string;
  /** Request id field on ai usage service provider edge record. */
  request_id?: string;
  /** Retention until field on ai usage service provider edge record. */
  retention_until?: string;
  /** Seller provider id field on ai usage service provider edge record. */
  seller_provider_id?: string;
  /** Seller snapshot field on ai usage service provider edge record. */
  seller_snapshot?: Record<string, JsonValue>;
  /** Settlement currency field on ai usage service provider edge record. */
  settlement_currency?: string;
  /** Settlement status field on ai usage service provider edge record. */
  settlement_status?: string;
  /** Status field on ai usage service provider edge record. */
  status?: string;
  /** Tenant id field on ai usage service provider edge record. */
  tenant_id?: string;
  /** Token kind field on ai usage service provider edge record. */
  token_kind?: string;
  /** Trace id field on ai usage service provider edge record. */
  trace_id?: string;
  /** Unit price field on ai usage service provider edge record. */
  unit_price?: string;
  /** Unit size field on ai usage service provider edge record. */
  unit_size?: string;
  /** Usage fact id field on ai usage service provider edge record. */
  usage_fact_id?: string;
  /** User id field on ai usage service provider edge record. */
  user_id?: string;
  /** Uuid field on ai usage service provider edge record. */
  uuid?: string;
}
