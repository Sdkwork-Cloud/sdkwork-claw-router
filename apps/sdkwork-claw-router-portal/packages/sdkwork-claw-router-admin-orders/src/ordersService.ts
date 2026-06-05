import { getClawRouterBackendSdkClient } from 'sdkwork-claw-router-commons/runtime';

type BackendCommerce = ReturnType<typeof getClawRouterBackendSdkClient>['commerce'];
type AdminListInput = {
  page?: number | string;
  pageSize?: number | string;
  [key: string]: unknown;
};
type OrderListInput = AdminListInput | Parameters<BackendCommerce['orders']['list']>[0];
type RefundListInput = AdminListInput | Parameters<BackendCommerce['refunds']['list']>[0];
type FulfillmentListInput = AdminListInput | Parameters<BackendCommerce['fulfillments']['list']>[0];
type ShipmentListInput = AdminListInput | Parameters<BackendCommerce['shipments']['list']>[0];

export function backendOrdersList(params?: Parameters<BackendCommerce['orders']['list']>[0]): Promise<unknown>;
export function backendOrdersList(params?: AdminListInput): Promise<unknown>;
export async function backendOrdersList(params?: OrderListInput) {
  return getClawRouterBackendSdkClient().commerce.orders.list(toSdkListParams(params));
}

export async function backendOrdersRetrieve(orderId: string) {
  return getClawRouterBackendSdkClient().commerce.orders.retrieve(orderId);
}

export async function backendOrdersEventsList(orderId: string, params?: Parameters<BackendCommerce['orders']['events']['list']>[1]) {
  return getClawRouterBackendSdkClient().commerce.orders.events.list(orderId, toSdkListParams(params));
}

export function backendRefundsList(params?: Parameters<BackendCommerce['refunds']['list']>[0]): Promise<unknown>;
export function backendRefundsList(params?: AdminListInput): Promise<unknown>;
export async function backendRefundsList(params?: RefundListInput) {
  return getClawRouterBackendSdkClient().commerce.refunds.list(toSdkListParams(params));
}

export async function backendRefundsRetrieve(refundId: string) {
  return getClawRouterBackendSdkClient().commerce.refunds.retrieve(refundId);
}

export function backendFulfillmentsList(params?: Parameters<BackendCommerce['fulfillments']['list']>[0]): Promise<unknown>;
export function backendFulfillmentsList(params?: AdminListInput): Promise<unknown>;
export async function backendFulfillmentsList(params?: FulfillmentListInput) {
  return getClawRouterBackendSdkClient().commerce.fulfillments.list(toSdkListParams(params));
}

export function backendShipmentsList(params?: Parameters<BackendCommerce['shipments']['list']>[0]): Promise<unknown>;
export function backendShipmentsList(params?: AdminListInput): Promise<unknown>;
export async function backendShipmentsList(params?: ShipmentListInput) {
  return getClawRouterBackendSdkClient().commerce.shipments.list(toSdkListParams(params));
}

export async function backendShipmentsTrackingEventsList(
  shipmentId: string,
  params?: Parameters<BackendCommerce['shipments']['trackingEvents']['list']>[1],
) {
  return getClawRouterBackendSdkClient().commerce.shipments.trackingEvents.list(shipmentId, toSdkListParams(params));
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
