import type { JsonValue } from './json-value';

/** Commerce recharge order create response schema exposed by Claw Router. */
export interface CommerceRechargeOrderCreateResponse {
  /** Amount field on commerce recharge order create response. */
  amount: string;
  /** Cashier url field on commerce recharge order create response. */
  cashierUrl: string;
  /** Currency code field on commerce recharge order create response. */
  currencyCode: string;
  /** Next action field on commerce recharge order create response. */
  nextAction: string;
  /** Order no field on commerce recharge order create response. */
  orderNo: string;
  /** Standardized payment method code for portal consumption. Prefer business-facing values such as wechat, alipay, or card. */
  paymentMethod: string;
  /** Payment product field on commerce recharge order create response. */
  paymentProduct: string;
  /** Points field on commerce recharge order create response. */
  points: number;
  /** Provider code field on commerce recharge order create response. */
  providerCode: string;
  /** Qr code payload field on commerce recharge order create response. */
  qrCodePayload: string;
  /** Request payment payload field on commerce recharge order create response. */
  requestPaymentPayload?: Record<string, JsonValue> | null;
  /** Status field on commerce recharge order create response. */
  status: string;
  /** Success field on commerce recharge order create response. */
  success: boolean;
}
