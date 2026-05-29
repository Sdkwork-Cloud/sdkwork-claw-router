import {
  createIdempotencyParams,
  getClawRouterAppSdkClient,
  isRecord,
  readApiRecord,
  readString,
  type ApiRecord,
} from 'sdkwork-claw-router-commons/runtime';

export type CheckoutStatusValue = 'pending' | 'success' | 'failed' | 'expired' | 'refunding' | 'refunded';

export interface CheckoutStatus {
  orderNo: string;
  outTradeNo: string;
  amount: string;
  points: number;
  paymentMethod: string;
  orderStatus: CheckoutStatusValue;
  paymentStatus: CheckoutStatusValue;
  rechargeStatus: CheckoutStatusValue;
  status: CheckoutStatusValue;
  createdAt: string;
  expiresAt: string;
  paidAt: string;
  nextAction: string;
  qrCodePayload: string;
}

export class CheckoutService {
  static async fetchCheckoutStatus(orderNo: string): Promise<CheckoutStatus> {
    const safeOrderNo = requiredText(orderNo, 'orderNo');
    const result = await appRechargesOrdersRetrieve(safeOrderNo);
    return normalizeCheckoutStatus(readCommerceResourceRecord(result, 'Checkout order record is required'), safeOrderNo);
  }
}

type AppCommerce = ReturnType<typeof getClawRouterAppSdkClient>['commerce'];
type AppSystem = ReturnType<typeof getClawRouterAppSdkClient>['system'];

export async function appAddressesList(params?: Parameters<AppCommerce['addresses']['list']>[0]) {
  return getClawRouterAppSdkClient().commerce.addresses.list(params);
}

export async function appAddressesCreate(body: Parameters<AppCommerce['addresses']['create']>[0]) {
  return getClawRouterAppSdkClient().commerce.addresses.create(body, createIdempotencyParams('app-address-create'));
}

export async function appAddressesUpdate(addressId: string, body: Parameters<AppCommerce['addresses']['update']>[1]) {
  return getClawRouterAppSdkClient().commerce.addresses.update(addressId, body, createIdempotencyParams('app-address-update'));
}

export async function appAddressesDelete(addressId: string) {
  return getClawRouterAppSdkClient().commerce.addresses.delete(addressId, createIdempotencyParams('app-address-delete'));
}

export async function appAddressesDefaultSelectionCreate(addressId: string) {
  return getClawRouterAppSdkClient().commerce.addresses.defaultSelection.create(
    addressId,
    { clientRequestNo: createIdempotencyParams('app-address-default-selection').idempotencyKey, metadata: {} },
    createIdempotencyParams('app-address-default-selection'),
  );
}

export async function appCartCurrentRetrieve() {
  return getClawRouterAppSdkClient().commerce.cart.current.retrieve();
}

export async function appCartItemsCreate(body: Parameters<AppCommerce['cart']['items']['create']>[0]) {
  return getClawRouterAppSdkClient().commerce.cart.items.create(body, createIdempotencyParams('app-cart-item-create'));
}

export async function appCartItemsUpdate(cartItemId: string, body: Parameters<AppCommerce['cart']['items']['update']>[1]) {
  return getClawRouterAppSdkClient().commerce.cart.items.update(cartItemId, body, createIdempotencyParams('app-cart-item-update'));
}

export async function appCartItemsDelete(cartItemId: string) {
  return getClawRouterAppSdkClient().commerce.cart.items.delete(cartItemId, createIdempotencyParams('app-cart-item-delete'));
}

export async function appCheckoutSessionsCreate(body: Parameters<AppCommerce['checkout']['sessions']['create']>[0]) {
  return getClawRouterAppSdkClient().commerce.checkout.sessions.create(body, createIdempotencyParams('app-checkout-session-create'));
}

export async function appCheckoutSessionsRetrieve(checkoutSessionId: string) {
  return getClawRouterAppSdkClient().commerce.checkout.sessions.retrieve(checkoutSessionId);
}

export async function appCheckoutSessionsOrdersCreate(
  checkoutSessionId: string,
  body: Parameters<AppCommerce['checkout']['sessions']['orders']['create']>[1],
) {
  return getClawRouterAppSdkClient().commerce.checkout.sessions.orders.create(
    checkoutSessionId,
    body,
    createIdempotencyParams('app-checkout-session-order-create'),
  );
}

export async function appCheckoutSessionsQuotesCreate(
  checkoutSessionId: string,
  body: Parameters<AppCommerce['checkout']['sessions']['quotes']['create']>[1],
) {
  return getClawRouterAppSdkClient().commerce.checkout.sessions.quotes.create(
    checkoutSessionId,
    body,
    createIdempotencyParams('app-checkout-session-quote-create'),
  );
}

export async function appOrdersList(params?: Parameters<AppCommerce['orders']['list']>[0]) {
  return getClawRouterAppSdkClient().commerce.orders.list(params);
}

export async function appOrdersRetrieve(orderId: string) {
  return getClawRouterAppSdkClient().commerce.orders.retrieve(orderId);
}

export async function appOrdersEventsList(orderId: string, params?: Parameters<AppCommerce['orders']['events']['list']>[1]) {
  return getClawRouterAppSdkClient().commerce.orders.events.list(orderId, params);
}

export async function appOrdersCancellationsCreate(
  orderId: string,
  body: Parameters<AppCommerce['orders']['cancellations']['create']>[1],
) {
  return getClawRouterAppSdkClient().commerce.orders.cancellations.create(
    orderId,
    body,
    createIdempotencyParams('app-order-cancellation-create'),
  );
}

export async function appPaymentsMethodsList(params?: Parameters<AppCommerce['payments']['methods']['list']>[0]) {
  return getClawRouterAppSdkClient().commerce.payments.methods.list(params);
}

export async function appPaymentsIntentsCreate(body: Parameters<AppCommerce['payments']['intents']['create']>[0]) {
  return getClawRouterAppSdkClient().commerce.payments.intents.create(body, createIdempotencyParams('app-payment-intent-create'));
}

export async function appPaymentsIntentsRetrieve(paymentIntentId: string) {
  return getClawRouterAppSdkClient().commerce.payments.intents.retrieve(paymentIntentId);
}

export async function appPaymentsIntentsAttemptsCreate(
  paymentIntentId: string,
  body: Parameters<AppCommerce['payments']['intents']['attempts']['create']>[1],
) {
  return getClawRouterAppSdkClient().commerce.payments.intents.attempts.create(
    paymentIntentId,
    body,
    createIdempotencyParams('app-payment-intent-attempt-create'),
  );
}

export async function appPaymentsAttemptsRetrieve(paymentAttemptId: string) {
  return getClawRouterAppSdkClient().commerce.payments.attempts.retrieve(paymentAttemptId);
}

export async function appRechargesOrdersRetrieve(orderId: string) {
  return getClawRouterAppSdkClient().commerce.recharges.orders.retrieve(orderId);
}

export async function appRefundsList(params?: Parameters<AppCommerce['refunds']['list']>[0]) {
  return getClawRouterAppSdkClient().commerce.refunds.list(params);
}

export async function appRefundsCreate(body: Parameters<AppCommerce['refunds']['create']>[0]) {
  return getClawRouterAppSdkClient().commerce.refunds.create(body, createIdempotencyParams('app-refund-create'));
}

export async function appRefundsRetrieve(refundId: string) {
  return getClawRouterAppSdkClient().commerce.refunds.retrieve(refundId);
}

export async function appFulfillmentsList(params?: Parameters<AppCommerce['fulfillments']['list']>[0]) {
  return getClawRouterAppSdkClient().commerce.fulfillments.list(params);
}

export async function appFulfillmentsRetrieve(fulfillmentId: string) {
  return getClawRouterAppSdkClient().commerce.fulfillments.retrieve(fulfillmentId);
}

export async function appShipmentsRetrieve(shipmentId: string) {
  return getClawRouterAppSdkClient().commerce.shipments.retrieve(shipmentId);
}

export async function appPromotionDiscountApplicationsCreate(
  body: Parameters<AppSystem['promotions']['discountApplications']['create']>[0],
) {
  return getClawRouterAppSdkClient().system.promotions.discountApplications.create(
    body,
    createIdempotencyParams('app-promotion-discount-application-create'),
  );
}

export async function appPromotionDiscountApplicationsSettle(
  applicationId: string,
  body: Parameters<AppSystem['promotions']['discountApplications']['settle']>[1],
) {
  return getClawRouterAppSdkClient().system.promotions.discountApplications.settle(
    applicationId,
    body,
    createIdempotencyParams('app-promotion-discount-application-settle'),
  );
}

export async function appPromotionDiscountApplicationsRelease(
  applicationId: string,
  body: Parameters<AppSystem['promotions']['discountApplications']['release']>[1],
) {
  return getClawRouterAppSdkClient().system.promotions.discountApplications.release(
    applicationId,
    body,
    createIdempotencyParams('app-promotion-discount-application-release'),
  );
}

export async function appPromotionDiscountApplicationReversalsCreate(
  body: Parameters<AppSystem['promotions']['discountApplications']['reversals']['create']>[0],
) {
  return getClawRouterAppSdkClient().system.promotions.discountApplications.reversals.create(
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
  return {
    orderNo,
    outTradeNo: readFirstString(item, ['outTradeNo', 'out_trade_no', 'externalTradeNo', 'external_trade_no']),
    amount,
    points: readFirstNonNegativeNumber(item, ['points', 'grantAmount', 'grant_amount'], 'Checkout points are required'),
    paymentMethod: readFirstString(item, ['paymentMethod', 'payment_method', 'method']) || 'wechat',
    orderStatus,
    paymentStatus,
    rechargeStatus,
    status,
    createdAt: readFirstString(item, ['createdAt', 'created_at']) || '-',
    expiresAt: readFirstString(item, ['expiresAt', 'expires_at']) || '-',
    paidAt: readFirstString(item, ['paidAt', 'paid_at']),
    nextAction: readFirstString(item, ['nextAction', 'next_action']),
    qrCodePayload: readFirstString(item, ['qrCodePayload', 'qr_code_payload', 'paymentUrl', 'payment_url']),
  };
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
