import {
  createIdempotencyParams,
  isRecord,
  readApiRecord,
  readString,
  type ApiRecord,
} from 'sdkwork-clawrouter-pc-commons/runtime';
import { getSdkworkCommerceService } from '@sdkwork/commerce-service';

export type CheckoutStatusValue = 'pending' | 'success' | 'failed' | 'expired' | 'refunding' | 'refunded';
export type CheckoutPaymentMethod = 'wechat' | 'alipay' | 'card';
export type CheckoutPaymentProduct = 'wechat_native' | 'wechat_jsapi' | 'alipay_page' | 'alipay_wap' | 'card';
export type CheckoutNextAction = 'scan_qr' | 'request_payment' | 'open_url' | 'completed' | 'pending';

export interface CheckoutStatus {
  orderNo: string;
  outTradeNo: string;
  amount: string;
  points: number;
  providerCode: string;
  paymentMethod: CheckoutPaymentMethod;
  paymentProduct: CheckoutPaymentProduct;
  orderStatus: CheckoutStatusValue;
  paymentStatus: CheckoutStatusValue;
  rechargeStatus: CheckoutStatusValue;
  status: CheckoutStatusValue;
  createdAt: string;
  expiresAt: string;
  paidAt: string;
  nextAction: CheckoutNextAction;
  cashierUrl: string;
  qrCodePayload: string;
  requestPaymentPayload?: string | null;
}

export class CheckoutService {
  static async fetchCheckoutStatus(orderNo: string): Promise<CheckoutStatus> {
    const safeOrderNo = requiredText(orderNo, 'orderNo');
    const result = await appRechargesOrdersRetrieve(safeOrderNo);
    return normalizeCheckoutStatus(readCommerceResourceRecord(result, 'Checkout order record is required'), safeOrderNo);
  }
}

type AppCommerceService = ReturnType<typeof getSdkworkCommerceService>;

export async function appAddressesList(params?: Parameters<AppCommerceService['addresses']['list']>[0]) {
  return getSdkworkCommerceService().addresses.list(params);
}

export async function appAddressesCreate(body: Parameters<AppCommerceService['addresses']['create']>[0]) {
  return getSdkworkCommerceService().addresses.create(body, createIdempotencyParams('app-address-create'));
}

export async function appAddressesUpdate(addressId: string, body: Parameters<AppCommerceService['addresses']['update']>[1]) {
  return getSdkworkCommerceService().addresses.update(addressId, body, createIdempotencyParams('app-address-update'));
}

export async function appAddressesDelete(addressId: string) {
  return getSdkworkCommerceService().addresses.delete(addressId, createIdempotencyParams('app-address-delete'));
}

export async function appAddressesDefaultSelectionCreate(addressId: string) {
  return getSdkworkCommerceService().addresses.defaultSelection.create(
    addressId,
    { clientRequestNo: createIdempotencyParams('app-address-default-selection').idempotencyKey, metadata: {} },
    createIdempotencyParams('app-address-default-selection'),
  );
}

export async function appCartCurrentRetrieve() {
  return getSdkworkCommerceService().cart.current.retrieve();
}

export async function appCartItemsCreate(body: Parameters<AppCommerceService['cart']['items']['create']>[0]) {
  return getSdkworkCommerceService().cart.items.create(body, createIdempotencyParams('app-cart-item-create'));
}

export async function appCartItemsUpdate(cartItemId: string, body: Parameters<AppCommerceService['cart']['items']['update']>[1]) {
  return getSdkworkCommerceService().cart.items.update(cartItemId, body, createIdempotencyParams('app-cart-item-update'));
}

export async function appCartItemsDelete(cartItemId: string) {
  return getSdkworkCommerceService().cart.items.delete(cartItemId, createIdempotencyParams('app-cart-item-delete'));
}

export async function appCheckoutSessionsCreate(body: Parameters<AppCommerceService['checkout']['sessions']['create']>[0]) {
  return getSdkworkCommerceService().checkout.sessions.create(body, createIdempotencyParams('app-checkout-session-create'));
}

export async function appCheckoutSessionsRetrieve(checkoutSessionId: string) {
  return getSdkworkCommerceService().checkout.sessions.retrieve(checkoutSessionId);
}

export async function appCheckoutSessionsOrdersCreate(
  checkoutSessionId: string,
  body: Parameters<AppCommerceService['checkout']['sessions']['orders']['create']>[1],
) {
  return getSdkworkCommerceService().checkout.sessions.orders.create(
    checkoutSessionId,
    body,
    createIdempotencyParams('app-checkout-session-order-create'),
  );
}

export async function appCheckoutSessionsQuotesCreate(
  checkoutSessionId: string,
  body: Parameters<AppCommerceService['checkout']['sessions']['quotes']['create']>[1],
) {
  return getSdkworkCommerceService().checkout.sessions.quotes.create(
    checkoutSessionId,
    body,
    createIdempotencyParams('app-checkout-session-quote-create'),
  );
}

export async function appOrdersList(params?: Parameters<AppCommerceService['orders']['list']>[0]) {
  return getSdkworkCommerceService().orders.list(params);
}

export async function appOrdersRetrieve(orderId: string) {
  return getSdkworkCommerceService().orders.retrieve(orderId);
}

export async function appOrdersEventsList(orderId: string, params?: Parameters<AppCommerceService['orders']['events']['list']>[1]) {
  return getSdkworkCommerceService().orders.events.list(orderId, params);
}

export async function appOrdersCancellationsCreate(
  orderId: string,
  body: Parameters<AppCommerceService['orders']['cancellations']['create']>[1],
) {
  return getSdkworkCommerceService().orders.cancellations.create(
    orderId,
    body,
    createIdempotencyParams('app-order-cancellation-create'),
  );
}

export async function appPaymentsMethodsList(params?: Parameters<AppCommerceService['payments']['methods']['list']>[0]) {
  return getSdkworkCommerceService().payments.methods.list(params);
}

export async function appPaymentsIntentsCreate(body: Parameters<AppCommerceService['payments']['intents']['create']>[0]) {
  return getSdkworkCommerceService().payments.intents.create(body, createIdempotencyParams('app-payment-intent-create'));
}

export async function appPaymentsIntentsRetrieve(paymentIntentId: string) {
  return getSdkworkCommerceService().payments.intents.retrieve(paymentIntentId);
}

export async function appPaymentsIntentsAttemptsCreate(
  paymentIntentId: string,
  body: Parameters<AppCommerceService['payments']['intents']['attempts']['create']>[1],
) {
  return getSdkworkCommerceService().payments.intents.attempts.create(
    paymentIntentId,
    body,
    createIdempotencyParams('app-payment-intent-attempt-create'),
  );
}

export async function appPaymentsAttemptsRetrieve(paymentAttemptId: string) {
  return getSdkworkCommerceService().payments.attempts.retrieve(paymentAttemptId);
}

export async function appRechargesOrdersRetrieve(orderId: string) {
  return getSdkworkCommerceService().recharges.orders.retrieve(orderId);
}

export async function appRefundsList(params?: Parameters<AppCommerceService['refunds']['list']>[0]) {
  return getSdkworkCommerceService().refunds.list(params);
}

export async function appRefundsCreate(body: Parameters<AppCommerceService['refunds']['create']>[0]) {
  return getSdkworkCommerceService().refunds.create(body, createIdempotencyParams('app-refund-create'));
}

export async function appRefundsRetrieve(refundId: string) {
  return getSdkworkCommerceService().refunds.retrieve(refundId);
}

export async function appFulfillmentsList(params?: Parameters<AppCommerceService['fulfillments']['list']>[0]) {
  return getSdkworkCommerceService().fulfillments.list(params);
}

export async function appFulfillmentsRetrieve(fulfillmentId: string) {
  return getSdkworkCommerceService().fulfillments.retrieve(fulfillmentId);
}

export async function appShipmentsRetrieve(shipmentId: string) {
  return getSdkworkCommerceService().shipments.retrieve(shipmentId);
}

export async function appPromotionDiscountApplicationsCreate(
  body: Parameters<AppCommerceService['promotions']['discountApplications']['create']>[0],
) {
  return getSdkworkCommerceService().promotions.discountApplications.create(
    body,
    createIdempotencyParams('app-promotion-discount-application-create'),
  );
}

export async function appPromotionDiscountApplicationsSettle(
  applicationId: string,
  body: Parameters<AppCommerceService['promotions']['discountApplications']['settle']>[1],
) {
  return getSdkworkCommerceService().promotions.discountApplications.settle(
    applicationId,
    body,
    createIdempotencyParams('app-promotion-discount-application-settle'),
  );
}

export async function appPromotionDiscountApplicationsRelease(
  applicationId: string,
  body: Parameters<AppCommerceService['promotions']['discountApplications']['release']>[1],
) {
  return getSdkworkCommerceService().promotions.discountApplications.release(
    applicationId,
    body,
    createIdempotencyParams('app-promotion-discount-application-release'),
  );
}

export async function appPromotionDiscountApplicationReversalsCreate(
  body: Parameters<AppCommerceService['promotions']['discountApplications']['reversals']['create']>[0],
) {
  return getSdkworkCommerceService().promotions.discountApplications.reversals.create(
    body,
    createIdempotencyParams('app-promotion-discount-application-reversal-create'),
  );
}

function requiredText(value: string, fieldName: string): string {
  const normalized = value.trim();
  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }
  return normalized;
}

function readCommerceResourceRecord(result: unknown, message: string): ApiRecord {
  const data = readApiRecord(result);
  if (isRecord(data.item)) {
    return data.item;
  }
  if (isRecord(data.record)) {
    return data.record;
  }
  if (Object.keys(data).length > 0) {
    return data;
  }
  throw new Error(message);
}

function normalizeCheckoutStatus(item: ApiRecord, fallbackOrderNo: string): CheckoutStatus {
  const amount = readFirstMoneyString(
    item,
    ['amount', 'priceAmount', 'price_amount', 'totalAmount', 'total_amount'],
    'Checkout amount is required',
    'Checkout amount must be a money string',
  );
  const orderNo = readFirstString(item, ['orderNo', 'order_no', 'requestNo', 'request_no', 'id']) || fallbackOrderNo;
  const paymentStatus = readCheckoutStatusValue(readFirstString(item, ['paymentStatus', 'payment_status', 'payStatus', 'pay_status', 'status']));
  const orderStatus = readCheckoutStatusValue(readFirstString(item, ['orderStatus', 'order_status', 'status']));
  const rechargeStatus = readCheckoutStatusValue(readFirstString(item, ['rechargeStatus', 'recharge_status', 'grantStatus', 'grant_status', 'status']));
  const status = readCheckoutStatusValue(readFirstString(item, ['status', 'paymentStatus', 'payment_status']));
  const providerCode = readFirstString(item, ['providerCode', 'provider_code']) || readCheckoutProviderCode(readFirstString(item, ['paymentMethod', 'payment_method', 'method']));
  const paymentMethod = readCheckoutPaymentMethod(readFirstString(item, ['paymentMethod', 'payment_method', 'method']));
  const paymentProduct = readCheckoutPaymentProduct(readFirstString(item, ['paymentProduct', 'payment_product']), paymentMethod);
  const nextAction = readCheckoutNextAction(readFirstString(item, ['nextAction', 'next_action']));
  const cashierUrl = readCheckoutCashierUrl(item, nextAction);
  const requestPaymentPayload = readCheckoutRequestPaymentPayload(item);
  return {
    orderNo,
    outTradeNo: readFirstString(item, ['outTradeNo', 'out_trade_no', 'externalTradeNo', 'external_trade_no']),
    amount,
    points: readFirstNonNegativeNumber(item, ['points', 'grantAmount', 'grant_amount'], 'Checkout points are required'),
    providerCode,
    paymentMethod,
    paymentProduct,
    orderStatus,
    paymentStatus,
    rechargeStatus,
    status,
    createdAt: readFirstString(item, ['createdAt', 'created_at']) || '-',
    expiresAt: readFirstString(item, ['expiresAt', 'expires_at']) || '-',
    paidAt: readFirstString(item, ['paidAt', 'paid_at']),
    nextAction,
    cashierUrl,
    qrCodePayload: readCheckoutQrCodePayload(item, nextAction, cashierUrl),
    ...(requestPaymentPayload !== undefined ? { requestPaymentPayload } : {}),
  };
}

function readCheckoutProviderCode(value: string): string {
  const normalized = value.trim().toLowerCase();
  if (!normalized || normalized === 'wechat' || normalized === 'wechat_pay' || normalized === 'wechatpay' || normalized === 'wxpay') {
    return 'wechat_pay';
  }
  if (normalized === 'alipay' || normalized === 'ali' || normalized === 'alipay_page') {
    return 'alipay';
  }
  if (normalized === 'card' || normalized === 'stripe' || normalized === 'credit_card') {
    return 'stripe';
  }
  return normalized;
}

function readCheckoutStatusValue(value: string): CheckoutStatusValue {
  const status = value.trim().toLowerCase();
  if (!status) {
    return 'pending';
  }
  if (status === 'success' || status === 'succeeded' || status === 'paid' || status === 'posted') {
    return 'success';
  }
  if (status === 'failed' || status === 'closed' || status === 'cancelled' || status === 'canceled') {
    return 'failed';
  }
  if (status === 'expired') {
    return 'expired';
  }
  if (status === 'refunding') {
    return 'refunding';
  }
  if (status === 'refunded') {
    return 'refunded';
  }
  if (status === 'pending' || status === 'processing' || status === 'created') {
    return 'pending';
  }
  throw new Error(`Unsupported checkout status: ${status}`);
}

function readCheckoutPaymentMethod(value: string): CheckoutPaymentMethod {
  const normalized = value.trim().toLowerCase();
  if (!normalized || normalized === 'wechat' || normalized === 'wechat_pay' || normalized === 'wechatpay' || normalized === 'wxpay') {
    return 'wechat';
  }
  if (normalized === 'alipay' || normalized === 'ali' || normalized === 'alipay_page') {
    return 'alipay';
  }
  if (normalized === 'card' || normalized === 'stripe' || normalized === 'credit_card') {
    return 'card';
  }
  throw new Error(`Unsupported checkout payment method: ${normalized}`);
}

function readCheckoutPaymentProduct(value: string, paymentMethod: CheckoutPaymentMethod): CheckoutPaymentProduct {
  const normalized = value.trim().toLowerCase();
  if (normalized === 'wechat_native' || normalized === 'wechat_jsapi' || normalized === 'alipay_page' || normalized === 'alipay_wap' || normalized === 'card') {
    return normalized;
  }
  if (paymentMethod === 'wechat') {
    return 'wechat_native';
  }
  if (paymentMethod === 'alipay') {
    return 'alipay_page';
  }
  return 'card';
}

function readCheckoutNextAction(value: string): CheckoutNextAction {
  const normalized = value.trim().toLowerCase();
  if (!normalized) {
    return 'scan_qr';
  }
  if (normalized === 'scan_qr' || normalized === 'scanqr' || normalized === 'qr') {
    return 'scan_qr';
  }
  if (normalized === 'request_payment' || normalized === 'requestpayment') {
    return 'request_payment';
  }
  if (normalized === 'awaitpayment') {
    return 'scan_qr';
  }
  if (normalized === 'redirect' || normalized === 'open_url' || normalized === 'browser_redirect') {
    return 'open_url';
  }
  if (normalized === 'contactsupport' || normalized === 'restartpayment' || normalized === 'awaitrefund') {
    return 'pending';
  }
  if (normalized === 'completed' || normalized === 'complete' || normalized === 'success' || normalized === 'succeeded') {
    return 'completed';
  }
  if (normalized === 'refundcompleted') {
    return 'completed';
  }
  if (normalized === 'pending' || normalized === 'wait' || normalized === 'processing') {
    return 'pending';
  }
  throw new Error(`Unsupported checkout next action: ${normalized}`);
}

function readCheckoutCashierUrl(item: ApiRecord, nextAction: CheckoutNextAction): string {
  const payload = readFirstString(item, ['cashierUrl', 'cashier_url', 'qrCodePayload', 'qr_code_payload']);
  if (nextAction === 'scan_qr' || nextAction === 'open_url') {
    if (!payload) {
      throw new Error('Checkout cashierUrl is required for scan_qr and open_url payments');
    }
    if (!isHttpUrl(payload)) {
      throw new Error('Checkout cashierUrl must be an http(s) url for scan_qr and open_url payments');
    }
  }
  return payload;
}

function readCheckoutQrCodePayload(item: ApiRecord, nextAction: CheckoutNextAction, cashierUrl: string): string {
  const payload = readFirstString(item, ['qrCodePayload', 'qr_code_payload']) || cashierUrl;
  if (nextAction !== 'scan_qr') {
    return payload;
  }
  if (!payload) {
    throw new Error('Checkout qrCodePayload is required for scan_qr payments');
  }
  if (!isHttpUrl(payload)) {
    throw new Error('Checkout qrCodePayload must be an http(s) url for scan_qr payments');
  }
  return payload;
}

function readCheckoutRequestPaymentPayload(item: ApiRecord): string | null | undefined {
  const hasCamelCase = Object.prototype.hasOwnProperty.call(item, 'requestPaymentPayload');
  const hasSnakeCase = Object.prototype.hasOwnProperty.call(item, 'request_payment_payload');
  if (!hasCamelCase && !hasSnakeCase) {
    return undefined;
  }
  const value = hasCamelCase ? item.requestPaymentPayload : item.request_payment_payload;
  if (value === null || value === '') {
    return null;
  }
  return typeof value === 'string' ? value : JSON.stringify(value);
}

function readFirstString(item: ApiRecord, keys: readonly string[]): string {
  for (const key of keys) {
    const value = readString(item, key).trim();
    if (value) {
      return value;
    }
  }
  return '';
}

function readFirstNonNegativeNumber(item: ApiRecord, keys: readonly string[], message: string): number {
  for (const key of keys) {
    const value = item[key];
    if (value === undefined || value === null || value === '') {
      continue;
    }
    const number = typeof value === 'number' ? value : typeof value === 'string' ? Number(value.trim()) : Number.NaN;
    if (Number.isFinite(number) && number >= 0) {
      return number;
    }
    throw new Error(`${key} must be a non-negative number`);
  }
  throw new Error(message);
}

function readFirstMoneyString(
  item: ApiRecord,
  keys: readonly string[],
  missingMessage: string,
  invalidMessage: string,
): string {
  const value = readFirstString(item, keys);
  if (!value) {
    throw new Error(missingMessage);
  }
  if (!/^-?\d+(?:\.\d{1,2})?$/.test(value)) {
    throw new Error(invalidMessage);
  }
  return formatMoneyString(value);
}

function formatMoneyString(value: string): string {
  const sign = value.startsWith('-') ? '-' : '';
  const unsigned = sign ? value.slice(1) : value;
  const [whole, fraction = ''] = unsigned.split('.');
  return `${sign}${whole}.${fraction.padEnd(2, '0').slice(0, 2)}`;
}

function isHttpUrl(value: string): boolean {
  return /^https?:\/\//iu.test(value.trim());
}
