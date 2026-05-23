/** Commerce inventory reservation item schema exposed by Claw Router. */
export interface CommerceInventoryReservationItem {
  /** Checkout session id field on commerce inventory reservation item. */
  checkoutSessionId?: string | null;
  /** Created at field on commerce inventory reservation item. */
  createdAt: string;
  /** Expires at field on commerce inventory reservation item. */
  expiresAt: string;
  /** Id field on commerce inventory reservation item. */
  id: string;
  /** Order id field on commerce inventory reservation item. */
  orderId?: string | null;
  /** Quantity field on commerce inventory reservation item. */
  quantity: number;
  /** Reservation no field on commerce inventory reservation item. */
  reservationNo: string;
  /** Sku id field on commerce inventory reservation item. */
  skuId: string;
  /** Status field on commerce inventory reservation item. */
  status: 'reserved' | 'confirmed' | 'released' | 'expired' | 'deducted';
}
