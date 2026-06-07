import { getSdkworkCommerceService } from '@sdkwork/commerce-service';

type BackendCommerceService = ReturnType<typeof getSdkworkCommerceService>['admin'];
type AdminListInput = {
  page?: number | string;
  pageSize?: number | string;
  [key: string]: unknown;
};
type CommerceOperationCommand = Record<string, unknown>;
type OrderManagementService = BackendCommerceService['orders']['management'];
type RefundManagementService = BackendCommerceService['refunds']['management'];
type FulfillmentService = BackendCommerceService['fulfillments'];
type OrderListInput = AdminListInput | Parameters<OrderManagementService['list']>[0];
type RefundListInput = AdminListInput | Parameters<RefundManagementService['list']>[0];
type FulfillmentListInput = AdminListInput | Parameters<BackendCommerceService['fulfillments']['list']>[0];
type ShipmentListInput = AdminListInput | Parameters<BackendCommerceService['shipments']['list']>[0];

export function backendOrdersList(params?: Parameters<OrderManagementService['list']>[0]): Promise<unknown>;
export function backendOrdersList(params?: AdminListInput): Promise<unknown>;
export async function backendOrdersList(params?: OrderListInput) {
  return getSdkworkCommerceService().admin.orders.management.list(toSdkListParams(params));
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

export async function backendOrdersEventsList(orderId: string, params?: Parameters<BackendCommerceService['orders']['events']['list']>[1]) {
  return getSdkworkCommerceService().admin.orders.events.list(orderId, toSdkListParams(params));
}

export function backendRefundsList(params?: Parameters<RefundManagementService['list']>[0]): Promise<unknown>;
export function backendRefundsList(params?: AdminListInput): Promise<unknown>;
export async function backendRefundsList(params?: RefundListInput) {
  return getSdkworkCommerceService().admin.refunds.management.list(toSdkListParams(params));
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

export function backendFulfillmentsList(params?: Parameters<FulfillmentService['list']>[0]): Promise<unknown>;
export function backendFulfillmentsList(params?: AdminListInput): Promise<unknown>;
export async function backendFulfillmentsList(params?: FulfillmentListInput) {
  return getSdkworkCommerceService().admin.fulfillments.list(toSdkListParams(params));
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

export function backendShipmentsList(params?: Parameters<BackendCommerceService['shipments']['list']>[0]): Promise<unknown>;
export function backendShipmentsList(params?: AdminListInput): Promise<unknown>;
export async function backendShipmentsList(params?: ShipmentListInput) {
  return getSdkworkCommerceService().admin.shipments.list(toSdkListParams(params));
}

export async function backendShipmentsRetrieve(shipmentId: string) {
  return getSdkworkCommerceService().admin.shipments.retrieve(shipmentId);
}

export async function backendShipmentsTrackingEventsList(
  shipmentId: string,
  params?: Parameters<BackendCommerceService['shipments']['trackingEvents']['list']>[1],
) {
  return getSdkworkCommerceService().admin.shipments.trackingEvents.list(shipmentId, toSdkListParams(params));
}

function toSdkListParams<T extends object | undefined>(params: T): T extends undefined ? undefined : Record<string, string> {
  if (!params) {
    return undefined as T extends undefined ? undefined : Record<string, string>;
  }
  return Object.fromEntries(
    Object.entries(params)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [key, String(value)]),
  ) as T extends undefined ? undefined : Record<string, string>;
}
