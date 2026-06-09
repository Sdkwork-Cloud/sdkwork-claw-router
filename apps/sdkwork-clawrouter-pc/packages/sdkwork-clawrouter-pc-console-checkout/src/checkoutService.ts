import {
  createIdempotencyParams,
  isRecord,
  readApiRecord,
  readString,
  type ApiRecord,
} from 'sdkwork-clawrouter-pc-commons/runtime';
import { getClawRouterAppSdkClient } from 'sdkwork-clawrouter-pc-commons/sdk-clients';

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

type AppCommerceService = ReturnType<typeof getClawRouterAppSdkClient>['commerce'];

export async function appAddressesList(params?: Parameters<AppCommerceService['addresses']['list']>[0]) {
  return getClawRouterAppSdkClient().commerce.addresses.list(params);
}

export async function appAddressesCreate(body: Parameters<AppCommerceService['addresses']['create']>[0]) {
  return getClawRouterAppSdkClient().commerce.addresses.create(body);
}

export async function appAddressesUpdate(addressId: string, body: Parameters<AppCommerceService['addresses']['update']>[1]) {
  return getClawRouterAppSdkClient().commerce.addresses.update(addressId, body);
}

export async function appAddressesDelete(addressId: string) {
  return getClawRouterAppSdkClient().commerce.addresses.delete(addressId);
}

export async function appAddressesDefaultSelectionCreate(addressId: string) {
  return getClawRouterAppSdkClient().commerce.addresses.defaultSelection.create(
    addressId,
    { clientRequestNo: createIdempotencyParams('app-address-default-selection').idempotencyKey, metadata: {} },
  );
}

export async function appCartCurrentRetrieve() {
  return getClawRouterAppSdkClient().commerce.cart.current.retrieve();
}

export async function appCartItemsCreate(body: Parameters<AppCommerceService['cart']['items']['create']>[0]) {
  return getClawRouterAppSdkClient().commerce.cart.items.create(body);
}

export async function appCartItemsUpdate(cartItemId: string, body: Parameters<AppCommerceService['cart']['items']['update']>[1]) {
  return getClawRouterAppSdkClient().commerce.cart.items.update(cartItemId, body);
}

export async function appCartItemsDelete(cartItemId: string) {
  return getClawRouterAppSdkClient().commerce.cart.items.delete(cartItemId);
}

export async function appCheckoutSessionsCreate(body: Parameters<AppCommerceService['checkout']['sessions']['create']>[0]) {
  return getClawRouterAppSdkClient().commerce.checkout.sessions.create(body);
}

export async function appCheckoutSessionsRetrieve(checkoutSessionId: string) {
  return getClawRouterAppSdkClient().commerce.checkout.sessions.retrieve(checkoutSessionId);
}

export async function appCheckoutSessionsOrdersCreate(
  checkoutSessionId: string,
  body: Parameters<AppCommerceService['checkout']['sessions']['orders']['create']>[1],
) {
  return getClawRouterAppSdkClient().commerce.checkout.sessions.orders.create(
    checkoutSessionId,
    body,
  );
}

export async function appCheckoutSessionsQuotesCreate(
  checkoutSessionId: string,
  body: Parameters<AppCommerceService['checkout']['sessions']['quotes']['create']>[1],
) {
  return getClawRouterAppSdkClient().commerce.checkout.sessions.quotes.create(
    checkoutSessionId,
    body,
  );
}

export async function appOrdersList(params?: Parameters<AppCommerceService['orders']['list']>[0]) {
  return getClawRouterAppSdkClient().commerce.orders.list(params);
}

export async function appOrdersRetrieve(orderId: string) {
  return getClawRouterAppSdkClient().commerce.orders.retrieve(orderId);
}

export async function appOrdersEventsList(orderId: string) {
  return getClawRouterAppSdkClient().commerce.orders.events.list(orderId);
}

export async function appOrdersCancellationsCreate(
  orderId: string,
  body: Parameters<AppCommerceService['orders']['cancellations']['create']>[1],
) {
  return getClawRouterAppSdkClient().commerce.orders.cancellations.create(
    orderId,
    body,
  );
}

export async function appPaymentsMethodsList() {
  return getClawRouterAppSdkClient().commerce.payments.methods.list();
}

export async function appPaymentsIntentsCreate(body: Parameters<AppCommerceService['payments']['intents']['create']>[0]) {
  return getClawRouterAppSdkClient().commerce.payments.intents.create(body);
}

export async function appPaymentsIntentsRetrieve(paymentIntentId: string) {
  return getClawRouterAppSdkClient().commerce.payments.intents.retrieve(paymentIntentId);
}

export async function appPaymentsIntentsAttemptsCreate(
  paymentIntentId: string,
  body: Parameters<AppCommerceService['payments']['intents']['attempts']['create']>[1],
) {
  return getClawRouterAppSdkClient().commerce.payments.intents.attempts.create(
    paymentIntentId,
    body,
  );
}

export async function appPaymentsAttemptsRetrieve(paymentAttemptId: string) {
  return getClawRouterAppSdkClient().commerce.payments.attempts.retrieve(paymentAttemptId);
}

export async function appRechargesOrdersRetrieve(orderId: string) {
  return getClawRouterAppSdkClient().commerce.recharges.orders.retrieve(orderId);
}

export async function appRefundsList(params?: Parameters<AppCommerceService['refunds']['list']>[0]) {
  return getClawRouterAppSdkClient().commerce.refunds.list(params);
}

export async function appRefundsCreate(body: Parameters<AppCommerceService['refunds']['create']>[0]) {
  return getClawRouterAppSdkClient().commerce.refunds.create(body);
}

export async function appRefundsRetrieve(refundId: string) {
  return getClawRouterAppSdkClient().commerce.refunds.retrieve(refundId);
}

export async function appFulfillmentsList(params?: Parameters<AppCommerceService['fulfillments']['list']>[0]) {
  return getClawRouterAppSdkClient().commerce.fulfillments.list(params);
}

export async function appFulfillmentsRetrieve(fulfillmentId: string) {
  return getClawRouterAppSdkClient().commerce.fulfillments.retrieve(fulfillmentId);
}

export async function appShipmentsRetrieve(shipmentId: string) {
  return getClawRouterAppSdkClient().commerce.shipments.retrieve(shipmentId);
}

export async function appPromotionDiscountApplicationsCreate(
  body: Parameters<AppCommerceService['promotions']['discountApplications']['create']>[0],
) {
  return getClawRouterAppSdkClient().commerce.promotions.discountApplications.create(
    body,
  );
}

export async function appPromotionDiscountApplicationsSettle(
  applicationId: string,
  body: Parameters<AppCommerceService['promotions']['discountApplications']['settle']>[1],
) {
  return getClawRouterAppSdkClient().commerce.promotions.discountApplications.settle(
    applicationId,
    body,
  );
}

export async function appPromotionDiscountApplicationsRelease(
  applicationId: string,
  body: Parameters<AppCommerceService['promotions']['discountApplications']['release']>[1],
) {
  return getClawRouterAppSdkClient().commerce.promotions.discountApplications.release(
    applicationId,
    body,
  );
}

export async function appPromotionDiscountApplicationReversalsCreate(
  body: Parameters<AppCommerceService['promotions']['discountApplications']['reversals']['create']>[0],
) {
  return getClawRouterAppSdkClient().commerce.promotions.discountApplications.reversals.create(
    body,
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
    ['amount', 'priceAmount', 'totalAmount'],
    'Checkout amount is required',
    'Checkout amount must be a money string',
  );
  const paymentMethodValue = readFirstString(item, ['paymentMethod', 'method']);
  const orderNo = readFirstString(item, ['orderNo', 'requestNo', 'id']) || fallbackOrderNo;
  const paymentStatus = readCheckoutStatusValue(readFirstString(item, ['paymentStatus', 'payStatus', 'status']));
  const orderStatus = readCheckoutStatusValue(readFirstString(item, ['orderStatus', 'status']));
  const rechargeStatus = readCheckoutStatusValue(readFirstString(item, ['rechargeStatus', 'grantStatus', 'status']));
  const status = readCheckoutStatusValue(readFirstString(item, ['status', 'paymentStatus']));
  const providerCode = readFirstString(item, ['providerCode']) || readCheckoutProviderCode(paymentMethodValue);
  const paymentMethod = readCheckoutPaymentMethod(paymentMethodValue);
  const paymentProduct = readCheckoutPaymentProduct(readFirstString(item, ['paymentProduct']), paymentMethod);
  const nextAction = readCheckoutNextAction(readFirstString(item, ['nextAction']));
  const cashierUrl = readCheckoutCashierUrl(item, nextAction);
  const requestPaymentPayload = readCheckoutRequestPaymentPayload(item);
  return {
    orderNo,
    outTradeNo: readFirstString(item, ['outTradeNo', 'externalTradeNo']),
    amount,
    points: readFirstNonNegativeNumber(item, ['points', 'grantAmount'], 'Checkout points are required'),
    providerCode,
    paymentMethod,
    paymentProduct,
    orderStatus,
    paymentStatus,
    rechargeStatus,
    status,
    createdAt: readFirstString(item, ['createdAt']) || '-',
    expiresAt: readFirstString(item, ['expiresAt']) || '-',
    paidAt: readFirstString(item, ['paidAt']),
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
  const payload = readFirstString(item, ['cashierUrl', 'qrCodePayload']);
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
  const payload = readFirstString(item, ['qrCodePayload']) || cashierUrl;
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
  if (!Object.prototype.hasOwnProperty.call(item, 'requestPaymentPayload')) {
    return undefined;
  }
  const value = item.requestPaymentPayload;
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
