import { getClawRouterBackendSdkClient } from 'sdkwork-claw-router-commons/runtime';

type BackendCommerce = ReturnType<typeof getClawRouterBackendSdkClient>['commerce'];

export async function backendOrdersList(params?: Parameters<BackendCommerce['orders']['list']>[0]) {
  return getClawRouterBackendSdkClient().commerce.orders.list(params);
}

export async function backendOrdersRetrieve(orderId: string) {
  return getClawRouterBackendSdkClient().commerce.orders.retrieve(orderId);
}

export async function backendOrdersEventsList(orderId: string, params?: Parameters<BackendCommerce['orders']['events']['list']>[1]) {
  return getClawRouterBackendSdkClient().commerce.orders.events.list(orderId, params);
}

export async function backendRefundsList(params?: Parameters<BackendCommerce['refunds']['list']>[0]) {
  return getClawRouterBackendSdkClient().commerce.refunds.list(params);
}

export async function backendRefundsRetrieve(refundId: string) {
  return getClawRouterBackendSdkClient().commerce.refunds.retrieve(refundId);
}

export async function backendFulfillmentsList(params?: Parameters<BackendCommerce['fulfillments']['list']>[0]) {
  return getClawRouterBackendSdkClient().commerce.fulfillments.list(params);
}

export async function backendShipmentsList(params?: Parameters<BackendCommerce['shipments']['list']>[0]) {
  return getClawRouterBackendSdkClient().commerce.shipments.list(params);
}

export async function backendShipmentsTrackingEventsList(
  shipmentId: string,
  params?: Parameters<BackendCommerce['shipments']['trackingEvents']['list']>[1],
) {
  return getClawRouterBackendSdkClient().commerce.shipments.trackingEvents.list(shipmentId, params);
}
