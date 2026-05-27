import type { JsonValue } from './json-value';

/** Promotion external binding record schema exposed by Claw Router. */
export interface PromotionExternalBindingRecord {
  /** Binding no field on promotion external binding record. */
  binding_no: string;
  /** Claim code hash field on promotion external binding record. */
  claim_code_hash?: string;
  /** Claim code suffix field on promotion external binding record. */
  claim_code_suffix?: string;
  /** Code id field on promotion external binding record. */
  code_id?: string;
  /** Created at field on promotion external binding record. */
  created_at: string;
  /** Created by field on promotion external binding record. */
  created_by?: string;
  /** External currency code field on promotion external binding record. */
  external_currency_code: string;
  /** External merchant id field on promotion external binding record. */
  external_merchant_id?: string;
  /** External object id field on promotion external binding record. */
  external_object_id: string;
  /** External object type field on promotion external binding record. */
  external_object_type: string;
  /** Last error code field on promotion external binding record. */
  last_error_code?: string;
  /** Last error message field on promotion external binding record. */
  last_error_message?: string;
  /** Last sync at field on promotion external binding record. */
  last_sync_at?: string;
  /** Metadata json field on promotion external binding record. */
  metadata_json?: Record<string, JsonValue>;
  /** Offer id field on promotion external binding record. */
  offer_id?: string;
  /** Offer version id field on promotion external binding record. */
  offer_version_id?: string;
  /** Organization id field on promotion external binding record. */
  organization_id?: string;
  /** Platform field on promotion external binding record. */
  platform: string;
  /** Platform card id field on promotion external binding record. */
  platform_card_id?: string;
  /** Platform coupon id field on promotion external binding record. */
  platform_coupon_id?: string;
  /** Platform stock id field on promotion external binding record. */
  platform_stock_id?: string;
  /** Platform template id field on promotion external binding record. */
  platform_template_id?: string;
  /** Stock id field on promotion external binding record. */
  stock_id?: string;
  /** Sync status field on promotion external binding record. */
  sync_status: string;
  /** Tenant id field on promotion external binding record. */
  tenant_id: string;
  /** Updated at field on promotion external binding record. */
  updated_at: string;
  /** Updated by field on promotion external binding record. */
  updated_by?: string;
  /** User coupon id field on promotion external binding record. */
  user_coupon_id?: string;
}
