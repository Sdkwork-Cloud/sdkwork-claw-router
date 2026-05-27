import type { JsonValue } from './json-value';

/** Promotion offer version record schema exposed by Claw Router. */
export interface PromotionOfferVersionRecord {
  /** Benefit definition id field on promotion offer version record. */
  benefit_definition_id?: string;
  /** Benefit kind field on promotion offer version record. */
  benefit_kind: string;
  /** Benefit quantity field on promotion offer version record. */
  benefit_quantity?: string;
  /** Breakage policy field on promotion offer version record. */
  breakage_policy: string;
  /** Created at field on promotion offer version record. */
  created_at: string;
  /** Created by field on promotion offer version record. */
  created_by?: string;
  /** Currency code field on promotion offer version record. */
  currency_code: string;
  /** Discount amount minor field on promotion offer version record. */
  discount_amount_minor?: string;
  /** Discount percent bps field on promotion offer version record. */
  discount_percent_bps?: number;
  /** Discount type field on promotion offer version record. */
  discount_type: string;
  /** Face value minor field on promotion offer version record. */
  face_value_minor: string;
  /** Fixed price minor field on promotion offer version record. */
  fixed_price_minor?: string;
  /** Liability policy field on promotion offer version record. */
  liability_policy: string;
  /** Lifecycle status field on promotion offer version record. */
  lifecycle_status: string;
  /** Maximum discount amount minor field on promotion offer version record. */
  maximum_discount_amount_minor?: string;
  /** Offer id field on promotion offer version record. */
  offer_id: string;
  /** Organization id field on promotion offer version record. */
  organization_id?: string;
  /** Published at field on promotion offer version record. */
  published_at?: string;
  /** Return policy field on promotion offer version record. */
  return_policy: string;
  /** Rule snapshot json field on promotion offer version record. */
  rule_snapshot_json: Record<string, JsonValue>;
  /** Settlement policy field on promotion offer version record. */
  settlement_policy: string;
  /** Stack strategy field on promotion offer version record. */
  stack_strategy: string;
  /** Tax treatment field on promotion offer version record. */
  tax_treatment: string;
  /** Tenant id field on promotion offer version record. */
  tenant_id: string;
  /** Updated at field on promotion offer version record. */
  updated_at: string;
  /** Updated by field on promotion offer version record. */
  updated_by?: string;
  /** Validity duration seconds field on promotion offer version record. */
  validity_duration_seconds?: string;
  /** Validity type field on promotion offer version record. */
  validity_type: string;
  /** Version no field on promotion offer version record. */
  version_no: string;
}
