import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ClipboardList, Receipt, Truck } from 'lucide-react';
import { AdminResourceCenter, type AdminResourceSection } from 'sdkwork-claw-router-commons';
import {
  backendFulfillmentsList,
  backendOrdersList,
  backendRefundsList,
  backendShipmentsList,
} from './ordersService';

type OrdersAdminTab = 'orders' | 'refunds' | 'fulfillments' | 'shipments';
type OrdersAdminGroup = string;

const DEFAULT_PAGE_PARAMS = { page: 1, pageSize: 100 };
const DEFAULT_ORDERS_SECTION_ID: OrdersAdminTab = 'orders';

type OrdersAdminProps = {
  sectionId?: string;
};

function resolveOrdersSectionId(sectionId?: string): OrdersAdminTab {
  if (sectionId === 'orders' || sectionId === 'refunds' || sectionId === 'fulfillments' || sectionId === 'shipments') {
    return sectionId;
  }
  return DEFAULT_ORDERS_SECTION_ID;
}

function buildOrderSections(t: ReturnType<typeof useTranslation>['t']): AdminResourceSection<OrdersAdminTab, OrdersAdminGroup>[] {
  return [
    {
      id: 'orders',
      title: t('admin.commerce.orders.orders.title', 'Orders'),
      description: t('admin.commerce.orders.orders.desc', 'Unified order center for physical goods, virtual goods, memberships, and recharges.'),
      icon: <ClipboardList className="h-4 w-4" />,
      group: 'Orders',
      load: () => backendOrdersList(DEFAULT_PAGE_PARAMS),
      columns: [
        { key: 'order_no', label: t('admin.col.orderNo', 'Order No') },
        { key: 'order_type', label: t('admin.col.type', 'Type') },
        { key: 'status', label: t('admin.col.status', 'Status') },
        { key: 'pay_status', label: t('admin.col.payStatus', 'Pay Status') },
        { key: 'total_amount', label: t('admin.col.total', 'Total'), align: 'right' },
        { key: 'created_at', label: t('admin.col.created', 'Created') },
      ],
      searchFields: ['id', 'order_no', 'order_type', 'status', 'pay_status', 'owner_user_id'],
    },
    {
      id: 'refunds',
      title: t('admin.commerce.orders.refunds.title', 'Refunds'),
      description: t('admin.commerce.orders.refunds.desc', 'Refund requests, refund items, provider attempts, and lifecycle state.'),
      icon: <Receipt className="h-4 w-4" />,
      group: 'Refunds & Fulfillment',
      load: () => backendRefundsList(DEFAULT_PAGE_PARAMS),
      columns: [
        { key: 'refund_no', label: t('admin.col.refund', 'Refund') },
        { key: 'order_id', label: t('admin.col.order', 'Order') },
        { key: 'amount', label: t('admin.col.amount', 'Amount'), align: 'right' },
        { key: 'currency_code', label: t('admin.col.currency', 'Currency') },
        { key: 'status', label: t('admin.col.status', 'Status') },
        { key: 'created_at', label: t('admin.col.created', 'Created') },
      ],
      searchFields: ['refund_no', 'order_id', 'payment_intent_id', 'status', 'currency_code'],
    },
    {
      id: 'fulfillments',
      title: t('admin.commerce.orders.fulfillments.title', 'Fulfillments'),
      description: t('admin.commerce.orders.fulfillments.desc', 'Fulfillment orders for physical delivery, virtual delivery, membership entitlement, and recharge grant.'),
      icon: <Truck className="h-4 w-4" />,
      group: 'Refunds & Fulfillment',
      load: () => backendFulfillmentsList(DEFAULT_PAGE_PARAMS),
      columns: [
        { key: 'fulfillment_no', label: t('admin.col.fulfillment', 'Fulfillment') },
        { key: 'order_id', label: t('admin.col.order', 'Order') },
        { key: 'fulfillment_type', label: t('admin.col.fulfillmentType', 'Type') },
        { key: 'status', label: t('admin.col.status', 'Status') },
        { key: 'created_at', label: t('admin.col.created', 'Created') },
      ],
      searchFields: ['fulfillment_no', 'order_id', 'fulfillment_type', 'status'],
    },
    {
      id: 'shipments',
      title: t('admin.commerce.orders.shipments.title', 'Shipments'),
      description: t('admin.commerce.orders.shipments.desc', 'Physical shipment records and carrier tracking state.'),
      icon: <Truck className="h-4 w-4" />,
      group: 'Refunds & Fulfillment',
      load: () => backendShipmentsList(DEFAULT_PAGE_PARAMS),
      columns: [
        { key: 'shipment_no', label: t('admin.col.shipment', 'Shipment') },
        { key: 'fulfillment_id', label: t('admin.col.fulfillment', 'Fulfillment') },
        { key: 'carrier_code', label: t('admin.col.carrier', 'Carrier') },
        { key: 'tracking_no', label: t('admin.col.tracking', 'Tracking') },
        { key: 'status', label: t('admin.col.status', 'Status') },
      ],
      searchFields: ['shipment_no', 'fulfillment_id', 'carrier_code', 'tracking_no', 'status'],
    },
  ];
}

export function OrdersAdmin({ sectionId }: OrdersAdminProps = {}) {
  const { t } = useTranslation();
  const sections = useMemo(() => buildOrderSections(t), [t]);
  const activeSectionId = resolveOrdersSectionId(sectionId);

  return (
    <AdminResourceCenter
      activeSectionId={activeSectionId}
      emptyTitle={t('admin.commerce.orders.empty', 'No order records')}
      errorTitle={t('admin.commerce.orders.error', 'Order data could not be loaded')}
      loadingTitle={t('admin.commerce.orders.loading', 'Loading order records...')}
      sections={sections}
      showSectionNavigation={false}
      tableViewportDataAttribute="admin-orders-table-viewport"
    />
  );
}
