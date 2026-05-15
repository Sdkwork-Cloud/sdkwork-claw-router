/** Checkout status response schema exposed by Claw Router. */
export interface CheckoutStatusResponse {
  /** Checkout amount as a canonical decimal money string. */
  amount: string;
  /** Created at field on checkout status response. */
  createdAt: string;
  /** Expires at field on checkout status response. */
  expiresAt: string;
  /** Next action field on checkout status response. */
  nextAction: string;
  /** Order no field on checkout status response. */
  orderNo: string;
  /** Order status field on checkout status response. */
  orderStatus: 'pending' | 'success' | 'failed' | 'expired' | 'refunding' | 'refunded';
  /** Out trade no field on checkout status response. */
  outTradeNo: string;
  /** Paid at field on checkout status response. */
  paidAt: string;
  /** Payment method field on checkout status response. */
  paymentMethod: string;
  /** Payment status field on checkout status response. */
  paymentStatus: 'pending' | 'success' | 'failed' | 'expired' | 'refunding' | 'refunded';
  /** Points field on checkout status response. */
  points: number;
  /** Qr code payload field on checkout status response. */
  qrCodePayload: string;
  /** Recharge status field on checkout status response. */
  rechargeStatus: 'pending' | 'success' | 'failed' | 'expired' | 'refunding' | 'refunded';
  /** Status field on checkout status response. */
  status: 'pending' | 'success' | 'failed' | 'expired' | 'refunding' | 'refunded';
}
