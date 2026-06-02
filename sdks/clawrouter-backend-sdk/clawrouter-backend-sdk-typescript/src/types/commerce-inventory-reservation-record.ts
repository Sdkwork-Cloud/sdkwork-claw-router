/** Commerce inventory reservation record schema exposed by Claw Router. */
export interface CommerceInventoryReservationRecord {
  /** Checkout session id field on commerce inventory reservation record. */
  checkout_session_id?: string;
  /** Created at field on commerce inventory reservation record. */
  created_at: string;
  /** Expires at field on commerce inventory reservation record. */
  expires_at: string;
  /** Id field on commerce inventory reservation record. */
  id?: string;
  /** Idempotency key field on commerce inventory reservation record. */
  idempotency_key: string;
  /** Order id field on commerce inventory reservation record. */
  order_id?: string;
  /** Organization id field on commerce inventory reservation record. */
  organization_id?: string;
  /** Quantity field on commerce inventory reservation record. */
  quantity: string;
  /** Reservation no field on commerce inventory reservation record. */
  reservation_no: string;
  /** Sku id field on commerce inventory reservation record. */
  sku_id: string;
  /** Status field on commerce inventory reservation record. */
  status: string;
  /** Tenant id field on commerce inventory reservation record. */
  tenant_id: string;
  /** Updated at field on commerce inventory reservation record. */
  updated_at: string;
  /** Warehouse id field on commerce inventory reservation record. */
  warehouse_id?: string;
}
