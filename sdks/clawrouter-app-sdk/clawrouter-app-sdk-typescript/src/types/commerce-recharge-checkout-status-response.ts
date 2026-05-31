import type { JsonValue } from './json-value';

/** Commerce recharge checkout status response schema exposed by Claw Router. */
export interface CommerceRechargeCheckoutStatusResponse {
  /** Amount field on commerce recharge checkout status response. */
  amount: string;
  /** Standard cashier page URL for scan_qr and open_url payment flows. */
  cashierUrl: string;
  /** Created at field on commerce recharge checkout status response. */
  createdAt: string;
  /** Currency code field on commerce recharge checkout status response. */
  currencyCode: string;
  /** Expires at field on commerce recharge checkout status response. */
  expiresAt: string;
  /** For PC qr checkout, scan_qr means the client should render a QR image from qrCodePayload and ask the user to scan it with the target payment app. request_payment means the H5 cashier should invoke a bridge payment request. open_url means the client should open cashierUrl in a browser context. */
  nextAction: string;
  /** Order no field on commerce recharge checkout status response. */
  orderNo: string;
  /** Order status field on commerce recharge checkout status response. */
  orderStatus: string;
  /** Out trade no field on commerce recharge checkout status response. */
  outTradeNo: string;
  /** Paid at field on commerce recharge checkout status response. */
  paidAt: string;
  /** Payment method field on commerce recharge checkout status response. */
  paymentMethod: string;
  /** Payment product field on commerce recharge checkout status response. */
  paymentProduct: string;
  /** Payment status field on commerce recharge checkout status response. */
  paymentStatus: string;
  /** Points field on commerce recharge checkout status response. */
  points: number;
  /** Provider code field on commerce recharge checkout status response. */
  providerCode: string;
  /** Standard QR payload field for recharge checkout. When nextAction is scan_qr, this value must be an http or https payment page URL rather than a native app scheme. */
  qrCodePayload: string;
  /** Recharge status field on commerce recharge checkout status response. */
  rechargeStatus: string;
  /** Request payment payload field on commerce recharge checkout status response. */
  requestPaymentPayload?: Record<string, JsonValue> | null;
  /** Status field on commerce recharge checkout status response. */
  status: string;
}
