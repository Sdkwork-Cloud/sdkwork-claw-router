import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Ban, ClipboardList, Eye, Receipt, Truck } from 'lucide-react';
import {
  AdminResourceCenter,
  type AdminResourceRecord,
  type AdminResourceSection,
} from 'sdkwork-clawrouter-pc-commons';
import {
  backendFulfillmentsList,
  backendOrdersList,
  backendRefundsList,
  backendShipmentsList,
} from './ordersService';

type OrdersAdminTab = 'orders' | 'refunds' | 'fulfillments' | 'shipments';
type OrdersAdminGroup = string;

const DEFAULT_ORDERS_SECTION_ID: OrdersAdminTab = 'orders';
const CANCELLABLE_ORDER_STATUSES = new Set(['created', 'pending', 'pending_payment', 'unpaid']);

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
      load: (params) => backendOrdersList(params),
      pagination: { initialPageSize: 50 },
      columns: [
        { key: 'order_no', label: t('admin.col.orderNo', 'Order No') },
        { key: 'order_type', label: t('admin.col.type', 'Type') },
        { key: 'status', label: t('admin.col.status', 'Status') },
        { key: 'pay_status', label: t('admin.col.payStatus', 'Pay Status') },
        { key: 'total_amount', label: t('admin.col.total', 'Total'), align: 'right' },
        { key: 'created_at', label: t('admin.col.created', 'Created') },
      ],
      rowActions: [
        {
          label: t('admin.commerce.orders.actions.view', 'View'),
          icon: <Eye className="h-3.5 w-3.5" />,
          onClick: noopOrderAction,
        },
        {
          label: t('admin.commerce.orders.actions.cancel', 'Cancel order'),
          icon: <Ban className="h-3.5 w-3.5" />,
          isDisabled: (record) => !canCancelOrderRecord(record),
          onClick: noopOrderAction,
          title: (record) => canCancelOrderRecord(record)
            ? t('admin.commerce.orders.actions.cancelPendingBackend', 'Backend cancellation API is not available yet')
            : t('admin.commerce.orders.actions.cancelUnavailable', 'Only unpaid pending orders can be cancelled'),
          tone: 'danger',
        },
      ],
      searchFields: ['id', 'order_no', 'order_type', 'status', 'pay_status', 'owner_user_id'],
    },
    {
      id: 'refunds',
      title: t('admin.commerce.orders.refunds.title', 'Refunds'),
      description: t('admin.commerce.orders.refunds.desc', 'Refund requests, refund items, provider attempts, and lifecycle state.'),
      icon: <Receipt className="h-4 w-4" />,
      group: 'Refunds & Fulfillment',
      load: (params) => backendRefundsList(params),
      pagination: { initialPageSize: 50 },
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
      load: (params) => backendFulfillmentsList(params),
      pagination: { initialPageSize: 50 },
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
      load: (params) => backendShipmentsList(params),
      pagination: { initialPageSize: 50 },
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

function noopOrderAction() {
  // Backend admin order mutations are not exposed in the generated backend SDK yet.
}

function canCancelOrderRecord(record: AdminResourceRecord): boolean {
  const status = normalizeOrderStatus(record.status);
  if (!CANCELLABLE_ORDER_STATUSES.has(status)) {
    return false;
  }
  if (normalizeOrderStatus(record.pay_status || record.payStatus) === 'paid') {
    return false;
  }
  return !record.cancelled_at && !record.cancelledAt;
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
      paginationPageLabel={t('admin.commerce.orders.pagination.page', 'Page')}
      paginationPageSizeLabel={t('admin.commerce.orders.pagination.pageSize', 'Rows')}
      paginationShowingLabel={t('admin.commerce.orders.pagination.showing', 'Showing')}
      recordActionColumnLabel={t('common.columns.actions', 'Actions')}
      sections={sections}
      showSectionNavigation={false}
      tableViewportDataAttribute="admin-orders-table-viewport"
    />
  );
}

function normalizeOrderStatus(value: unknown): string {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}
