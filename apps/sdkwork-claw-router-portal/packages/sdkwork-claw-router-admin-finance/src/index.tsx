import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BadgePercent, BarChart3, FileText, ShieldCheck } from 'lucide-react';
import { AdminResourceCenter, type AdminResourceSection } from 'sdkwork-claw-router-commons';
import {
  backendAuditCommerceEventsList,
  backendCommerceReportsOrderRevenueList,
  backendCommerceReportsPaymentReconciliationRetrieve,
  backendCommerceReportsRefundsList,
  backendCouponsCampaignsList,
  backendCouponsCodesList,
  backendCouponsRedemptionsList,
  backendCouponsTemplatesList,
  backendInvoicesList,
  backendInvoicesTitlesList,
} from './financeService';

type FinanceAdminTab =
  | 'invoiceTitles'
  | 'invoices'
  | 'couponTemplates'
  | 'couponCampaigns'
  | 'couponCodes'
  | 'couponRedemptions'
  | 'paymentReconciliationReport'
  | 'orderRevenueReport'
  | 'refundsReport'
  | 'auditEvents';
type FinanceAdminGroup = string;

const DEFAULT_PAGE_PARAMS = { page: 1, pageSize: 100 };
const DEFAULT_FINANCE_SECTION_ID: FinanceAdminTab = 'orderRevenueReport';
const DEFAULT_MARKETING_COUPON_SECTION_ID: FinanceAdminTab = 'couponTemplates';

type FinanceAdminProps = {
  sectionId?: string;
  surface?: 'finance' | 'marketing';
};

function resolveFinanceSectionId(sectionId: string | undefined, surface: FinanceAdminProps['surface'] = 'finance'): FinanceAdminTab {
  if (surface === 'marketing') {
    if (
      sectionId === 'couponTemplates'
      || sectionId === 'couponCampaigns'
      || sectionId === 'couponCodes'
      || sectionId === 'couponRedemptions'
    ) {
      return sectionId;
    }
    return DEFAULT_MARKETING_COUPON_SECTION_ID;
  }
  if (
    sectionId === 'invoiceTitles'
    || sectionId === 'invoices'
    || sectionId === 'couponTemplates'
    || sectionId === 'couponCampaigns'
    || sectionId === 'couponCodes'
    || sectionId === 'couponRedemptions'
    || sectionId === 'paymentReconciliationReport'
    || sectionId === 'orderRevenueReport'
    || sectionId === 'refundsReport'
    || sectionId === 'auditEvents'
  ) {
    return sectionId;
  }
  return DEFAULT_FINANCE_SECTION_ID;
}

function buildFinanceSections(t: ReturnType<typeof useTranslation>['t']): AdminResourceSection<FinanceAdminTab, FinanceAdminGroup>[] {
  return [
    {
      id: 'invoiceTitles',
      title: t('admin.commerce.finance.invoiceTitles.title', 'Invoice Titles'),
      description: t('admin.commerce.finance.invoiceTitles.desc', 'User invoice title records and tax identity snapshots.'),
      icon: <FileText className="h-4 w-4" />,
      group: t('admin.commerce.finance.group.invoices', 'Invoices'),
      load: () => backendInvoicesTitlesList(DEFAULT_PAGE_PARAMS),
      columns: [
        { key: 'title_no', label: t('admin.col.title', 'Title') },
        { key: 'owner_user_id', label: t('admin.col.user', 'User') },
        { key: 'invoice_type', label: t('admin.col.invoiceType', 'Type') },
        { key: 'tax_no', label: t('admin.col.taxNo', 'Tax No') },
        { key: 'status', label: t('admin.col.status', 'Status') },
      ],
      searchFields: ['title_no', 'owner_user_id', 'invoice_type', 'tax_no', 'status'],
    },
    {
      id: 'invoices',
      title: t('admin.commerce.finance.invoices.title', 'Invoices'),
      description: t('admin.commerce.finance.invoices.desc', 'Invoice applications, issued invoices, provider attempts, and invoice events.'),
      icon: <FileText className="h-4 w-4" />,
      group: t('admin.commerce.finance.group.invoices', 'Invoices'),
      load: () => backendInvoicesList(DEFAULT_PAGE_PARAMS),
      columns: [
        { key: 'invoice_no', label: t('admin.col.invoice', 'Invoice') },
        { key: 'order_id', label: t('admin.col.order', 'Order') },
        { key: 'amount', label: t('admin.col.amount', 'Amount'), align: 'right' },
        { key: 'currency_code', label: t('admin.col.currency', 'Currency') },
        { key: 'status', label: t('admin.col.status', 'Status') },
        { key: 'created_at', label: t('admin.col.created', 'Created') },
      ],
      searchFields: ['invoice_no', 'order_id', 'title_id', 'currency_code', 'status'],
    },
    {
      id: 'couponTemplates',
      title: t('admin.commerce.finance.couponTemplates.title', 'Coupon Templates'),
      description: t('admin.commerce.finance.couponTemplates.desc', 'Coupon template rules for discount, threshold, validity, and applicable product scope.'),
      icon: <BadgePercent className="h-4 w-4" />,
      group: t('admin.commerce.finance.group.coupons', 'Coupons'),
      load: () => backendCouponsTemplatesList(DEFAULT_PAGE_PARAMS),
      columns: [
        { key: 'template_no', label: t('admin.col.template', 'Template') },
        { key: 'coupon_type', label: t('admin.col.couponType', 'Type') },
        { key: 'discount_value', label: t('admin.col.value', 'Value'), align: 'right' },
        { key: 'status', label: t('admin.col.status', 'Status') },
        { key: 'updated_at', label: t('admin.col.updated', 'Updated') },
      ],
      searchFields: ['template_no', 'coupon_type', 'status'],
    },
    {
      id: 'couponCampaigns',
      title: t('admin.commerce.finance.couponCampaigns.title', 'Coupon Campaigns'),
      description: t('admin.commerce.finance.couponCampaigns.desc', 'Coupon issuance campaigns, channel limits, and campaign lifecycle.'),
      icon: <BadgePercent className="h-4 w-4" />,
      group: t('admin.commerce.finance.group.coupons', 'Coupons'),
      load: () => backendCouponsCampaignsList(DEFAULT_PAGE_PARAMS),
      columns: [
        { key: 'campaign_no', label: t('admin.col.campaign', 'Campaign') },
        { key: 'template_id', label: t('admin.col.template', 'Template') },
        { key: 'channel_code', label: t('admin.col.channel', 'Channel') },
        { key: 'status', label: t('admin.col.status', 'Status') },
        { key: 'starts_at', label: t('admin.col.starts', 'Starts') },
      ],
      searchFields: ['campaign_no', 'template_id', 'channel_code', 'status'],
    },
    {
      id: 'couponCodes',
      title: t('admin.commerce.finance.couponCodes.title', 'Coupon Codes'),
      description: t('admin.commerce.finance.couponCodes.desc', 'Issued coupon codes and per-user claim state.'),
      icon: <BadgePercent className="h-4 w-4" />,
      group: t('admin.commerce.finance.group.coupons', 'Coupons'),
      load: () => backendCouponsCodesList(DEFAULT_PAGE_PARAMS),
      columns: [
        { key: 'coupon_code', label: t('admin.col.code', 'Code') },
        { key: 'campaign_id', label: t('admin.col.campaign', 'Campaign') },
        { key: 'owner_user_id', label: t('admin.col.user', 'User') },
        { key: 'status', label: t('admin.col.status', 'Status') },
        { key: 'expires_at', label: t('admin.col.expires', 'Expires') },
      ],
      searchFields: ['coupon_code', 'campaign_id', 'owner_user_id', 'status'],
    },
    {
      id: 'couponRedemptions',
      title: t('admin.commerce.finance.couponRedemptions.title', 'Coupon Redemptions'),
      description: t('admin.commerce.finance.couponRedemptions.desc', 'Coupon redemption records bound to checkout sessions and orders.'),
      icon: <BadgePercent className="h-4 w-4" />,
      group: t('admin.commerce.finance.group.coupons', 'Coupons'),
      load: () => backendCouponsRedemptionsList(DEFAULT_PAGE_PARAMS),
      columns: [
        { key: 'redemption_no', label: t('admin.col.redemption', 'Redemption') },
        { key: 'coupon_id', label: t('admin.col.coupon', 'Coupon') },
        { key: 'order_id', label: t('admin.col.order', 'Order') },
        { key: 'discount_amount', label: t('admin.col.discount', 'Discount'), align: 'right' },
        { key: 'status', label: t('admin.col.status', 'Status') },
      ],
      searchFields: ['redemption_no', 'coupon_id', 'order_id', 'status'],
    },
    {
      id: 'paymentReconciliationReport',
      title: t('admin.commerce.finance.paymentReconciliation.title', 'Payment Reconciliation'),
      description: t('admin.commerce.finance.paymentReconciliation.desc', 'Payment reconciliation metrics by provider, date, and discrepancy state.'),
      icon: <BarChart3 className="h-4 w-4" />,
      group: t('admin.commerce.finance.group.reportsAudit', 'Reports & Audit'),
      load: () => backendCommerceReportsPaymentReconciliationRetrieve(),
      columns: [
        { key: 'metric', label: t('admin.col.metric', 'Metric') },
        { key: 'value', label: t('admin.col.value', 'Value') },
      ],
      searchFields: ['metric', 'value'],
    },
    {
      id: 'orderRevenueReport',
      title: t('admin.commerce.finance.orderRevenue.title', 'Order Revenue'),
      description: t('admin.commerce.finance.orderRevenue.desc', 'Order revenue report by period, currency, channel, and product type.'),
      icon: <BarChart3 className="h-4 w-4" />,
      group: t('admin.commerce.finance.group.reportsAudit', 'Reports & Audit'),
      load: () => backendCommerceReportsOrderRevenueList(DEFAULT_PAGE_PARAMS),
      columns: [
        { key: 'period', label: t('admin.col.period', 'Period') },
        { key: 'order_count', label: t('admin.col.orders', 'Orders'), align: 'right' },
        { key: 'gross_amount', label: t('admin.col.gross', 'Gross'), align: 'right' },
        { key: 'currency_code', label: t('admin.col.currency', 'Currency') },
        { key: 'product_type', label: t('admin.col.productType', 'Product Type') },
      ],
      searchFields: ['period', 'currency_code', 'product_type'],
    },
    {
      id: 'refundsReport',
      title: t('admin.commerce.finance.refundReport.title', 'Refund Report'),
      description: t('admin.commerce.finance.refundReport.desc', 'Refund report by period, status, provider, and currency.'),
      icon: <BarChart3 className="h-4 w-4" />,
      group: t('admin.commerce.finance.group.reportsAudit', 'Reports & Audit'),
      load: () => backendCommerceReportsRefundsList(DEFAULT_PAGE_PARAMS),
      columns: [
        { key: 'period', label: t('admin.col.period', 'Period') },
        { key: 'refund_count', label: t('admin.col.refunds', 'Refunds'), align: 'right' },
        { key: 'refund_amount', label: t('admin.col.refundAmount', 'Amount'), align: 'right' },
        { key: 'currency_code', label: t('admin.col.currency', 'Currency') },
        { key: 'status', label: t('admin.col.status', 'Status') },
      ],
      searchFields: ['period', 'currency_code', 'status'],
    },
    {
      id: 'auditEvents',
      title: t('admin.commerce.finance.auditEvents.title', 'Commerce Audit'),
      description: t('admin.commerce.finance.auditEvents.desc', 'Commercial operation audit events for admin governance.'),
      icon: <ShieldCheck className="h-4 w-4" />,
      group: t('admin.commerce.finance.group.reportsAudit', 'Reports & Audit'),
      load: () => backendAuditCommerceEventsList(DEFAULT_PAGE_PARAMS),
      columns: [
        { key: 'event_no', label: t('admin.col.event', 'Event') },
        { key: 'resource_type', label: t('admin.col.resource', 'Resource') },
        { key: 'action', label: t('admin.col.action', 'Action') },
        { key: 'actor_id', label: t('admin.col.actor', 'Actor') },
        { key: 'created_at', label: t('admin.col.created', 'Created') },
      ],
      searchFields: ['event_no', 'resource_type', 'action', 'actor_id'],
    },
  ];
}

export function FinanceAdmin({ sectionId, surface = 'finance' }: FinanceAdminProps = {}) {
  const { t } = useTranslation();
  const sections = useMemo(() => buildFinanceSections(t), [t]);
  const isMarketingSurface = surface === 'marketing';
  const activeSectionId = resolveFinanceSectionId(sectionId, surface);

  return (
    <AdminResourceCenter
      activeSectionId={activeSectionId}
      description={isMarketingSurface
        ? t('admin.commerce.marketing.coupons.desc', 'Coupon templates, campaigns, issued codes, and redemption records for growth campaigns.')
        : t('admin.commerce.finance.desc', 'Invoices, revenue reports, reconciliation reports, and commerce audit events.')}
      emptyTitle={isMarketingSurface
        ? t('admin.commerce.marketing.coupons.empty', 'No coupon records')
        : t('admin.commerce.finance.empty', 'No finance records')}
      errorTitle={isMarketingSurface
        ? t('admin.commerce.marketing.coupons.error', 'Coupon data could not be loaded')
        : t('admin.commerce.finance.error', 'Finance data could not be loaded')}
      icon={isMarketingSurface
        ? <BadgePercent className="h-5 w-5 text-pink-500" />
        : <FileText className="h-5 w-5 text-violet-500" />}
      loadingTitle={isMarketingSurface
        ? t('admin.commerce.marketing.coupons.loading', 'Loading coupon records...')
        : t('admin.commerce.finance.loading', 'Loading finance records...')}
      sections={sections}
      showSectionNavigation={false}
      tableViewportDataAttribute="admin-finance-table-viewport"
      title={isMarketingSurface
        ? t('admin.commerce.marketing.coupons.title', 'Coupons')
        : t('admin.commerce.finance.title', 'Finance')}
    />
  );
}
