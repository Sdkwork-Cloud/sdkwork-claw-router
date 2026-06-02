import type { JsonValue } from './json-value';

/** Commerce checkout line record schema exposed by Claw Router. */
export interface CommerceCheckoutLineRecord {
  /** Checkout session id field on commerce checkout line record. */
  checkout_session_id: string;
  /** Created at field on commerce checkout line record. */
  created_at: string;
  /** Fulfillment type field on commerce checkout line record. */
  fulfillment_type: string;
  /** Id field on commerce checkout line record. */
  id?: string;
  /** Inventory reservation id field on commerce checkout line record. */
  inventory_reservation_id?: string;
  /** Organization id field on commerce checkout line record. */
  organization_id?: string;
  /** Price snapshot json field on commerce checkout line record. */
  price_snapshot_json?: Record<string, JsonValue>;
  /** Promotion snapshot json field on commerce checkout line record. */
  promotion_snapshot_json?: Record<string, JsonValue>;
  /** Purchase type field on commerce checkout line record. */
  purchase_type: string;
  /** Quantity field on commerce checkout line record. */
  quantity: string;
  /** Sku id field on commerce checkout line record. */
  sku_id: string;
  /** Tenant id field on commerce checkout line record. */
  tenant_id: string;
}
