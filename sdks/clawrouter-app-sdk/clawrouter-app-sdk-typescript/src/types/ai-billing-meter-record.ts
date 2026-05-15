import type { JsonValue } from './json-value';

/** Ai billing meter record schema exposed by Claw Router. */
export interface AiBillingMeterRecord {
  /** Aggregation mode field on ai billing meter record. */
  aggregation_mode?: string;
  /** Allow negative quantity field on ai billing meter record. */
  allow_negative_quantity?: boolean;
  /** Billing mode field on ai billing meter record. */
  billing_mode: string;
  /** Canonical price item type field on ai billing meter record. */
  canonical_price_item_type?: string;
  /** Created at field on ai billing meter record. */
  created_at?: string;
  /** Data scope field on ai billing meter record. */
  data_scope?: string;
  /** Default unit field on ai billing meter record. */
  default_unit: string;
  /** Default unit size field on ai billing meter record. */
  default_unit_size: string;
  /** Deleted at field on ai billing meter record. */
  deleted_at?: string;
  /** Deleted by field on ai billing meter record. */
  deleted_by?: string;
  /** Description field on ai billing meter record. */
  description?: string;
  /** Display name field on ai billing meter record. */
  display_name: string;
  /** Id field on ai billing meter record. */
  id?: string;
  /** Metadata field on ai billing meter record. */
  metadata?: Record<string, JsonValue>;
  /** Meter code field on ai billing meter record. */
  meter_code: string;
  /** Modality field on ai billing meter record. */
  modality?: string;
  /** Organization id field on ai billing meter record. */
  organization_id: string;
  /** Quantity precision field on ai billing meter record. */
  quantity_precision?: number;
  /** Quantity source field on ai billing meter record. */
  quantity_source?: string;
  /** Result selector field on ai billing meter record. */
  result_selector?: string;
  /** Sort order field on ai billing meter record. */
  sort_order?: number;
  /** Status field on ai billing meter record. */
  status: string;
  /** Supports expression field on ai billing meter record. */
  supports_expression?: boolean;
  /** Supports tier field on ai billing meter record. */
  supports_tier?: boolean;
  /** Tenant id field on ai billing meter record. */
  tenant_id: string;
  /** Updated at field on ai billing meter record. */
  updated_at?: string;
  /** Usage type field on ai billing meter record. */
  usage_type?: string;
  /** Uuid field on ai billing meter record. */
  uuid: string;
  /** Version field on ai billing meter record. */
  version?: string;
}
