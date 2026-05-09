export interface CheckoutStatusResponse {
  /** Checkout amount as a canonical decimal money string. */
  amount: string;
  createdAt: string;
  expiresAt: string;
  nextAction: string;
  orderNo: string;
  orderStatus: 'pending' | 'success' | 'failed' | 'expired' | 'refunding' | 'refunded';
  outTradeNo: string;
  paidAt: string;
  paymentMethod: string;
  paymentStatus: 'pending' | 'success' | 'failed' | 'expired' | 'refunding' | 'refunded';
  points: number;
  qrCodePayload: string;
  rechargeStatus: 'pending' | 'success' | 'failed' | 'expired' | 'refunding' | 'refunded';
  status: 'pending' | 'success' | 'failed' | 'expired' | 'refunding' | 'refunded';
}
