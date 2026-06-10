import { getSdkworkCommerceService } from '@sdkwork/commerce-service';

type AdminListInput = {
  page?: number | string;
  pageSize?: number | string;
  [key: string]: unknown;
};
type CommerceOperationCommand = Record<string, unknown>;
type OrderSdkListParams = AdminListInput;
type RefundSdkListParams = AdminListInput;
type FulfillmentSdkListParams = AdminListInput;
type ShipmentSdkListParams = AdminListInput;
type OrderManagementService = ReturnType<typeof getSdkworkCommerceService>['admin']['orders']['management'];
type RefundManagementService = ReturnType<typeof getSdkworkCommerceService>['admin']['refunds']['management'];
type OrderListInput = AdminListInput | OrderSdkListParams;
type RefundListInput = AdminListInput | RefundSdkListParams;
type FulfillmentListInput = AdminListInput | FulfillmentSdkListParams;
type ShipmentListInput = AdminListInput | ShipmentSdkListParams;

export async function backendOrdersList(params?: Parameters<OrderManagementService['list']>[0]) {
  return getSdkworkCommerceService().admin.orders.management.list(
    toSdkListParams<OrderSdkListParams>(params as AdminListInput | undefined),
  );
}

export async function backendOrdersRetrieve(orderId: string) {
  return getSdkworkCommerceService().admin.orders.management.retrieve(orderId);
}

export async function backendOrdersManagementCancel(orderId: string, body: CommerceOperationCommand = {}) {
  return getSdkworkCommerceService().admin.orders.management.cancel(orderId, body);
}

export async function backendOrdersManagementClose(orderId: string, body: CommerceOperationCommand = {}) {
  return getSdkworkCommerceService().admin.orders.management.close(orderId, body);
}

export async function backendOrdersEventsList(orderId: string, params?: AdminListInput) {
  return getSdkworkCommerceService().admin.orders.events.management.list(orderId, toSdkListParams(params));
}

export async function backendRefundsList(params?: Parameters<RefundManagementService['list']>[0]) {
  return getSdkworkCommerceService().admin.refunds.management.list(
    toSdkListParams<RefundSdkListParams>(params as AdminListInput | undefined),
  );
}

export async function backendRefundsRetrieve(refundId: string) {
  return getSdkworkCommerceService().admin.refunds.management.retrieve(refundId);
}

export async function backendRefundApprovalCreate(refundId: string, body: CommerceOperationCommand = {}) {
  return getSdkworkCommerceService().admin.refunds.approvals.create(refundId, body);
}

export async function backendRefundAttemptCreate(refundId: string, body: CommerceOperationCommand = {}) {
  return getSdkworkCommerceService().admin.refunds.attempts.create(refundId, body);
}

export async function backendFulfillmentsList(params?: FulfillmentListInput) {
  return getSdkworkCommerceService().admin.fulfillments.list(toSdkListParams<FulfillmentSdkListParams>(params));
}

export async function backendFulfillmentCreate(body: CommerceOperationCommand = {}) {
  return getSdkworkCommerceService().admin.fulfillments.create(body);
}

export async function backendFulfillmentUpdate(fulfillmentId: string, body: CommerceOperationCommand = {}) {
  return getSdkworkCommerceService().admin.fulfillments.update(fulfillmentId, body);
}

export async function backendFulfillmentShipmentCreate(fulfillmentId: string, body: CommerceOperationCommand = {}) {
  return getSdkworkCommerceService().admin.fulfillments.shipments.create(fulfillmentId, body);
}

export async function backendFulfillmentShipmentUpdate(
  fulfillmentId: string,
  shipmentId: string,
  body: CommerceOperationCommand = {},
) {
  return getSdkworkCommerceService().admin.fulfillments.shipments.update(fulfillmentId, shipmentId, body);
}

export async function backendFulfillmentTrackingEventCreate(
  fulfillmentId: string,
  shipmentId: string,
  body: CommerceOperationCommand = {},
) {
  return getSdkworkCommerceService().admin.fulfillments.trackingEvents.create(fulfillmentId, shipmentId, body);
}

export async function backendShipmentsList(params?: ShipmentListInput) {
  return getSdkworkCommerceService().admin.shipments.list(toSdkListParams<ShipmentSdkListParams>(params));
}

export async function backendShipmentsRetrieve(shipmentId: string) {
  return getSdkworkCommerceService().admin.shipments.management.retrieve(shipmentId);
}

export async function backendShipmentsTrackingEventsList(
  shipmentId: string,
) {
  return getSdkworkCommerceService().admin.shipments.trackingEvents.list(shipmentId);
}

function toSdkListParams<T extends object>(params: AdminListInput | T | undefined): T | undefined {
  if (!params) {
    return undefined;
  }
  return Object.fromEntries(
    Object.entries(params)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [
        key,
        key === 'page' || key === 'pageSize'
          ? normalizeSdkPageNumber(value, key)
          : value,
      ]),
  ) as T;
}

function normalizeSdkPageNumber(value: unknown, key: string): number {
  const parsed = typeof value === 'number'
    ? value
    : typeof value === 'string'
      ? Number.parseInt(value.trim(), 10)
      : Number.NaN;
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error(`${key} must be a positive integer`);
  }
  return parsed;
}
