import {
  ensurePlusApiSuccess,
  getClawRouterAppSdkClient,
  readApiRecord,
  readRequiredNonNegativeNumber,
  readRequiredString,
  requiredSafePathSegment,
  readString,
  type ApiRecord,
} from 'sdkwork-claw-router-commons/runtime';
import type { CheckoutStatusResponse as SdkCheckoutStatusResponse } from '@sdkwork/clawrouter-app-sdk';

export type CheckoutPaymentStatus = 'pending' | 'success' | 'failed' | 'expired' | 'refunding' | 'refunded';
const CHECKOUT_PAYMENT_STATUSES = ['pending', 'success', 'failed', 'expired', 'refunding', 'refunded'] as const;

export interface CheckoutStatus {
  orderNo: SdkCheckoutStatusResponse['orderNo'];
  outTradeNo: SdkCheckoutStatusResponse['outTradeNo'];
  amount: string & SdkCheckoutStatusResponse['amount'];
  points: SdkCheckoutStatusResponse['points'];
  paymentMethod: SdkCheckoutStatusResponse['paymentMethod'];
  orderStatus: SdkCheckoutStatusResponse['orderStatus'];
  paymentStatus: SdkCheckoutStatusResponse['paymentStatus'];
  rechargeStatus: SdkCheckoutStatusResponse['rechargeStatus'];
  status: SdkCheckoutStatusResponse['status'];
  createdAt: SdkCheckoutStatusResponse['createdAt'];
  expiresAt: SdkCheckoutStatusResponse['expiresAt'];
  paidAt: SdkCheckoutStatusResponse['paidAt'];
  nextAction: SdkCheckoutStatusResponse['nextAction'];
  qrCodePayload: SdkCheckoutStatusResponse['qrCodePayload'];
}

export class CheckoutService {
  static async fetchCheckoutStatus(orderNo: string): Promise<CheckoutStatus> {
    const normalizedOrderNo = requiredSafePathSegment(orderNo, 'orderNo');
    const result = await getClawRouterAppSdkClient().billing.payments.checkout.retrieve(normalizedOrderNo);
    ensurePlusApiSuccess(result, 'console.billing.errors.checkoutStatusFallback');
    return normalizeCheckoutStatus(readApiRecord(result));
  }
}

function normalizeCheckoutStatus(item: ApiRecord): CheckoutStatus {
  return {
    orderNo: readRequiredString(item, 'orderNo', 'Checkout order number is required'),
    outTradeNo: readRequiredStringAllowEmpty(item, 'outTradeNo', 'Checkout outer trade number is required'),
    amount: readRequiredMoneyString(item, 'amount', 'Checkout amount is required', 'Checkout amount must be a money string'),
    points: readRequiredNonNegativeNumber(item, 'points', 'Checkout points are required'),
    paymentMethod: readRequiredString(item, 'paymentMethod', 'Checkout payment method is required'),
    orderStatus: readCheckoutStatus(item, 'orderStatus', 'order status'),
    paymentStatus: readCheckoutStatus(item, 'paymentStatus', 'payment status'),
    rechargeStatus: readCheckoutStatus(item, 'rechargeStatus', 'recharge status'),
    status: readCheckoutStatus(item, 'status', 'status'),
    createdAt: readRequiredString(item, 'createdAt', 'Checkout created time is required'),
    expiresAt: readRequiredString(item, 'expiresAt', 'Checkout expiry time is required'),
    paidAt: readRequiredStringAllowEmpty(item, 'paidAt', 'Checkout paid time is required'),
    nextAction: readRequiredStringAllowEmpty(item, 'nextAction', 'Checkout next action is required'),
    qrCodePayload: readRequiredStringAllowEmpty(item, 'qrCodePayload', 'Checkout QR code payload is required'),
  };
}

function readRequiredStringAllowEmpty(record: ApiRecord, key: string, message: string): string {
  const value = record[key];
  if (value === undefined || value === null) {
    throw new Error(message);
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  throw new Error(message);
}

function readRequiredMoneyString(item: ApiRecord, key: string, missingMessage: string, invalidMessage: string): string {
  const value = readRequiredString(item, key, missingMessage);
  if (!/^\d+(?:\.\d{1,2})?$/.test(value)) {
    throw new Error(invalidMessage);
  }
  return formatMoneyString(value);
}

function formatMoneyString(value: string): string {
  const [whole, fraction = ''] = value.split('.');
  return `${whole}.${fraction.padEnd(2, '0').slice(0, 2)}`;
}

function readCheckoutStatus(item: ApiRecord, key: string, label: string): CheckoutPaymentStatus {
  const status = readRequiredString(item, key, `Checkout ${label} is required`).toLowerCase();
  if (isCheckoutPaymentStatus(status)) {
    return status;
  }
  throw new Error(`Unsupported checkout ${label}: ${status}`);
}

function isCheckoutPaymentStatus(value: string): value is CheckoutPaymentStatus {
  return CHECKOUT_PAYMENT_STATUSES.includes(value as CheckoutPaymentStatus);
}
