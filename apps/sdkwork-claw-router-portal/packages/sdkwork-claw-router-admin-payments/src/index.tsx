import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, CreditCard, Receipt, ShieldCheck } from 'lucide-react';
import { AdminResourceCenter, type AdminResourceSection } from 'sdkwork-claw-router-commons';
import {
  backendPaymentsAttemptsList,
  backendPaymentsChannelsList,
  backendPaymentsIntentsList,
  backendPaymentsMethodsList,
  backendPaymentsProviderAccountsCreate,
  backendPaymentsProviderAccountsList,
  backendPaymentsProvidersList,
  backendPaymentsReconciliationRunsList,
  backendPaymentsRouteRulesList,
  backendPaymentsWebhookEventsList,
  type PaymentProviderAccountMutationInput,
} from './paymentsService';

type PaymentsAdminTab =
  | 'providers'
  | 'providerAccounts'
  | 'methods'
  | 'channels'
  | 'routeRules'
  | 'intents'
  | 'attempts'
  | 'webhookEvents'
  | 'reconciliationRuns';
type PaymentsAdminGroup = string;

type PaymentProviderAccountFormState = {
  accountNo: string;
  providerCode: string;
  merchantId: string;
  environment: string;
  countryCode: string;
  settlementCurrency: string;
  secretRef: string;
  certificateRef: string;
  webhookSecretRef: string;
  status: string;
};

const DEFAULT_PAGE_PARAMS = { page: 1, pageSize: 100 };
const DEFAULT_PAYMENTS_SECTION_ID: PaymentsAdminTab = 'providerAccounts';
const DEFAULT_PAYMENT_PROVIDER_ACCOUNT_FORM: PaymentProviderAccountFormState = {
  accountNo: '',
  providerCode: 'stripe',
  merchantId: '',
  environment: 'sandbox',
  countryCode: 'US',
  settlementCurrency: 'USD',
  secretRef: '',
  certificateRef: '',
  webhookSecretRef: '',
  status: 'active',
};

type PaymentsAdminProps = {
  sectionId?: string;
};

function resolvePaymentsSectionId(sectionId?: string): PaymentsAdminTab {
  if (
    sectionId === 'providers'
    || sectionId === 'providerAccounts'
    || sectionId === 'methods'
    || sectionId === 'channels'
    || sectionId === 'routeRules'
    || sectionId === 'intents'
    || sectionId === 'attempts'
    || sectionId === 'webhookEvents'
    || sectionId === 'reconciliationRuns'
  ) {
    return sectionId;
  }
  return DEFAULT_PAYMENTS_SECTION_ID;
}

export function PaymentsAdmin({ sectionId }: PaymentsAdminProps = {}) {
  const { t } = useTranslation();
  const activeSectionId = resolvePaymentsSectionId(sectionId);
  const [providerAccountFormOpen, setProviderAccountFormOpen] = useState(false);
  const [providerAccountForm, setProviderAccountForm] = useState<PaymentProviderAccountFormState>(
    DEFAULT_PAYMENT_PROVIDER_ACCOUNT_FORM,
  );
  const [providerAccountSaving, setProviderAccountSaving] = useState(false);
  const [providerAccountError, setProviderAccountError] = useState<string | null>(null);
  const [providerAccountSuccess, setProviderAccountSuccess] = useState<string | null>(null);

  const openProviderAccountForm = useCallback(() => {
    setProviderAccountForm(DEFAULT_PAYMENT_PROVIDER_ACCOUNT_FORM);
    setProviderAccountError(null);
    setProviderAccountSuccess(null);
    setProviderAccountFormOpen(true);
  }, []);

  const paymentSections = useMemo<AdminResourceSection<PaymentsAdminTab, PaymentsAdminGroup>[]>(() => [
    {
      id: 'providers',
      title: t('admin.commerce.payments.providers.title', 'Payment Providers'),
      description: t('admin.commerce.payments.providers.desc', 'Domestic and international provider definitions such as WeChat Pay, Alipay, PayPal, Stripe, Apple Pay, and Google Pay.'),
      icon: <CreditCard className="h-4 w-4" />,
      group: t('admin.commerce.payments.group.providerSetup', 'Provider Setup'),
      load: () => backendPaymentsProvidersList(DEFAULT_PAGE_PARAMS),
      columns: [
        { key: 'providerCode', label: t('admin.col.provider', 'Provider') },
        { key: 'displayName', label: t('admin.col.name', 'Name') },
        { key: 'providerType', label: t('admin.col.type', 'Type') },
        { key: 'status', label: t('admin.col.status', 'Status') },
        { key: 'updatedAt', label: t('admin.col.updated', 'Updated') },
      ],
      searchFields: ['providerCode', 'displayName', 'providerType', 'status'],
    },
    {
      id: 'providerAccounts',
      title: t('admin.commerce.payments.providerAccounts.title', 'Provider Accounts'),
      description: t('admin.commerce.payments.providerAccounts.desc', 'Merchant account configuration for provider environments, credentials, certificates, and webhook secrets.'),
      icon: <CreditCard className="h-4 w-4" />,
      group: t('admin.commerce.payments.group.providerSetup', 'Provider Setup'),
      load: () => backendPaymentsProviderAccountsList(DEFAULT_PAGE_PARAMS),
      action: { label: t('admin.commerce.payments.providerAccounts.addAction', 'Add provider account'), onClick: openProviderAccountForm },
      columns: [
        { key: 'accountNo', label: t('admin.col.accountNo', 'Account No') },
        { key: 'providerCode', label: t('admin.col.provider', 'Provider') },
        { key: 'merchantId', label: t('admin.col.merchant', 'Merchant') },
        { key: 'environment', label: t('admin.col.env', 'Env') },
        { key: 'settlementCurrency', label: t('admin.col.currency', 'Currency') },
        { key: 'status', label: t('admin.col.status', 'Status') },
      ],
      searchFields: ['accountNo', 'providerCode', 'merchantId', 'environment', 'countryCode', 'settlementCurrency', 'status'],
    },
    {
      id: 'methods',
      title: t('admin.commerce.payments.methods.title', 'Payment Methods'),
      description: t('admin.commerce.payments.methods.desc', 'Payment methods exposed to checkout, membership purchase, recharge, and wallet flows.'),
      icon: <CreditCard className="h-4 w-4" />,
      group: t('admin.commerce.payments.group.providerSetup', 'Provider Setup'),
      load: () => backendPaymentsMethodsList(DEFAULT_PAGE_PARAMS),
      columns: [
        { key: 'methodCode', label: t('admin.col.method', 'Method') },
        { key: 'displayName', label: t('admin.col.name', 'Name') },
        { key: 'providerCode', label: t('admin.col.provider', 'Provider') },
        { key: 'status', label: t('admin.col.status', 'Status') },
        { key: 'updatedAt', label: t('admin.col.updated', 'Updated') },
      ],
      searchFields: ['methodCode', 'displayName', 'providerCode', 'status'],
    },
    {
      id: 'channels',
      title: t('admin.commerce.payments.channels.title', 'Payment Channels'),
      description: t('admin.commerce.payments.channels.desc', 'Country, currency, scene, and provider-account routing channels.'),
      icon: <CreditCard className="h-4 w-4" />,
      group: t('admin.commerce.payments.group.providerSetup', 'Provider Setup'),
      load: () => backendPaymentsChannelsList(DEFAULT_PAGE_PARAMS),
      columns: [
        { key: 'channelNo', label: t('admin.col.channel', 'Channel') },
        { key: 'methodCode', label: t('admin.col.method', 'Method') },
        { key: 'providerAccountId', label: t('admin.col.account', 'Account') },
        { key: 'countryCode', label: t('admin.col.country', 'Country') },
        { key: 'currencyCode', label: t('admin.col.currency', 'Currency') },
        { key: 'status', label: t('admin.col.status', 'Status') },
      ],
      searchFields: ['channelNo', 'methodCode', 'providerAccountId', 'countryCode', 'currencyCode', 'sceneCode', 'status'],
    },
    {
      id: 'routeRules',
      title: t('admin.commerce.payments.routeRules.title', 'Route Rules'),
      description: t('admin.commerce.payments.routeRules.desc', 'Payment route rules by market, method, currency, priority, and fallback.'),
      icon: <ShieldCheck className="h-4 w-4" />,
      group: t('admin.commerce.payments.group.providerSetup', 'Provider Setup'),
      load: () => backendPaymentsRouteRulesList(DEFAULT_PAGE_PARAMS),
      columns: [
        { key: 'ruleNo', label: t('admin.col.rule', 'Rule') },
        { key: 'methodCode', label: t('admin.col.method', 'Method') },
        { key: 'currencyCode', label: t('admin.col.currency', 'Currency') },
        { key: 'priority', label: t('admin.col.priority', 'Priority'), align: 'right' },
        { key: 'status', label: t('admin.col.status', 'Status') },
      ],
      searchFields: ['ruleNo', 'methodCode', 'currencyCode', 'countryCode', 'sceneCode', 'status'],
    },
    {
      id: 'intents',
      title: t('admin.commerce.payments.intents.title', 'Payment Intents'),
      description: t('admin.commerce.payments.intents.desc', 'Unified payment intents created from orders, memberships, recharges, and wallet flows.'),
      icon: <Receipt className="h-4 w-4" />,
      group: t('admin.commerce.payments.group.paymentRuntime', 'Payment Runtime'),
      load: () => backendPaymentsIntentsList(DEFAULT_PAGE_PARAMS),
      columns: [
        { key: 'intentNo', label: t('admin.col.intent', 'Intent') },
        { key: 'orderId', label: t('admin.col.order', 'Order') },
        { key: 'amount', label: t('admin.col.amount', 'Amount'), align: 'right' },
        { key: 'currencyCode', label: t('admin.col.currency', 'Currency') },
        { key: 'status', label: t('admin.col.status', 'Status') },
        { key: 'createdAt', label: t('admin.col.created', 'Created') },
      ],
      searchFields: ['intentNo', 'orderId', 'status', 'currencyCode', 'providerCode'],
    },
    {
      id: 'attempts',
      title: t('admin.commerce.payments.attempts.title', 'Payment Attempts'),
      description: t('admin.commerce.payments.attempts.desc', 'Provider request attempts, external trade numbers, and payment result lifecycle.'),
      icon: <Receipt className="h-4 w-4" />,
      group: t('admin.commerce.payments.group.paymentRuntime', 'Payment Runtime'),
      load: () => backendPaymentsAttemptsList(DEFAULT_PAGE_PARAMS),
      columns: [
        { key: 'attemptNo', label: t('admin.col.attempt', 'Attempt') },
        { key: 'intentId', label: t('admin.col.intent', 'Intent') },
        { key: 'providerCode', label: t('admin.col.provider', 'Provider') },
        { key: 'amount', label: t('admin.col.amount', 'Amount'), align: 'right' },
        { key: 'status', label: t('admin.col.status', 'Status') },
        { key: 'createdAt', label: t('admin.col.created', 'Created') },
      ],
      searchFields: ['attemptNo', 'intentId', 'providerCode', 'status', 'externalTradeNo'],
    },
    {
      id: 'webhookEvents',
      title: t('admin.commerce.payments.webhookEvents.title', 'Webhook Events'),
      description: t('admin.commerce.payments.webhookEvents.desc', 'Inbound payment webhook events and idempotent processing state.'),
      icon: <ShieldCheck className="h-4 w-4" />,
      group: t('admin.commerce.payments.group.riskReconciliation', 'Risk & Reconciliation'),
      load: () => backendPaymentsWebhookEventsList(DEFAULT_PAGE_PARAMS),
      columns: [
        { key: 'eventNo', label: t('admin.col.event', 'Event') },
        { key: 'providerCode', label: t('admin.col.provider', 'Provider') },
        { key: 'eventType', label: t('admin.col.type', 'Type') },
        { key: 'processStatus', label: t('admin.col.process', 'Process') },
        { key: 'receivedAt', label: t('admin.col.received', 'Received') },
      ],
      searchFields: ['eventNo', 'providerCode', 'eventType', 'processStatus', 'externalEventId'],
    },
    {
      id: 'reconciliationRuns',
      title: t('admin.commerce.payments.reconciliationRuns.title', 'Reconciliation Runs'),
      description: t('admin.commerce.payments.reconciliationRuns.desc', 'Payment reconciliation batches, statement imports, and discrepancy tracking.'),
      icon: <BarChart3 className="h-4 w-4" />,
      group: t('admin.commerce.payments.group.riskReconciliation', 'Risk & Reconciliation'),
      load: () => backendPaymentsReconciliationRunsList(DEFAULT_PAGE_PARAMS),
      columns: [
        { key: 'runNo', label: t('admin.col.run', 'Run') },
        { key: 'providerCode', label: t('admin.col.provider', 'Provider') },
        { key: 'businessDate', label: t('admin.col.businessDate', 'Business Date') },
        { key: 'status', label: t('admin.col.status', 'Status') },
        { key: 'finishedAt', label: t('admin.col.finished', 'Finished') },
      ],
      searchFields: ['runNo', 'providerCode', 'businessDate', 'status'],
    },
  ], [t, openProviderAccountForm]);

  const submitPaymentProviderAccount = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProviderAccountSaving(true);
    setProviderAccountError(null);
    setProviderAccountSuccess(null);
    try {
      const response = await backendPaymentsProviderAccountsCreate(toPaymentProviderAccountRequest(providerAccountForm));
      setProviderAccountSuccess(t('admin.commerce.payments.providerAccounts.saveSuccess', 'Provider account request accepted: {{requestNo}}', { requestNo: readCommerceOperationRequestNo(response) }));
      setProviderAccountForm(DEFAULT_PAYMENT_PROVIDER_ACCOUNT_FORM);
      setProviderAccountFormOpen(false);
    } catch (error) {
      setProviderAccountError(error instanceof Error && error.message ? error.message : t('admin.commerce.payments.providerAccounts.saveError', 'Provider account could not be saved.'));
    } finally {
      setProviderAccountSaving(false);
    }
  };

  return (
    <>
      <AdminResourceCenter
        activeSectionId={activeSectionId}
        description={t('admin.commerce.payments.desc', 'Payment provider setup, routing, runtime attempts, webhook events, and reconciliation.')}
        emptyTitle={t('admin.commerce.payments.empty', 'No payment records')}
        errorTitle={t('admin.commerce.payments.error', 'Payment data could not be loaded')}
        icon={<CreditCard className="h-5 w-5 text-blue-500" />}
        initialSectionId="providerAccounts"
        loadingTitle={t('admin.commerce.payments.loading', 'Loading payment records...')}
        sections={paymentSections}
        showSectionNavigation={false}
        tableViewportDataAttribute="admin-payments-table-viewport"
        title={t('admin.commerce.payments.title', 'Payments')}
      />
      {providerAccountFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <form
            className="w-full max-w-2xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-[#1a1a1a]"
            onSubmit={submitPaymentProviderAccount}
          >
            <div className="border-b border-slate-200 p-5 dark:border-white/10">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{t('admin.commerce.payments.providerAccounts.formTitle', 'Add provider account')}</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {t('admin.commerce.payments.providerAccounts.formDesc', 'Store merchant account references for WeChat Pay, Alipay, PayPal, Stripe, Apple Pay, Google Pay, and other providers.')}
              </p>
            </div>
            <div className="grid gap-4 p-5 md:grid-cols-2">
              <PaymentProviderAccountInput label={t('admin.commerce.payments.providerAccounts.accountNo', 'Account No')} value={providerAccountForm.accountNo} onChange={(accountNo) => setProviderAccountForm((current) => ({ ...current, accountNo }))} required />
              <PaymentProviderAccountInput label={t('admin.commerce.payments.providerAccounts.providerCode', 'Provider code')} value={providerAccountForm.providerCode} onChange={(providerCode) => setProviderAccountForm((current) => ({ ...current, providerCode }))} required />
              <PaymentProviderAccountInput label={t('admin.commerce.payments.providerAccounts.merchantId', 'Merchant ID')} value={providerAccountForm.merchantId} onChange={(merchantId) => setProviderAccountForm((current) => ({ ...current, merchantId }))} required />
              <PaymentProviderAccountInput label={t('admin.commerce.payments.providerAccounts.environment', 'Environment')} value={providerAccountForm.environment} onChange={(environment) => setProviderAccountForm((current) => ({ ...current, environment }))} required />
              <PaymentProviderAccountInput label={t('admin.commerce.payments.providerAccounts.countryCode', 'Country code')} value={providerAccountForm.countryCode} onChange={(countryCode) => setProviderAccountForm((current) => ({ ...current, countryCode }))} required />
              <PaymentProviderAccountInput label={t('admin.commerce.payments.providerAccounts.settlementCurrency', 'Settlement currency')} value={providerAccountForm.settlementCurrency} onChange={(settlementCurrency) => setProviderAccountForm((current) => ({ ...current, settlementCurrency }))} required />
              <PaymentProviderAccountInput label={t('admin.commerce.payments.providerAccounts.secretRef', 'Secret ref')} value={providerAccountForm.secretRef} onChange={(secretRef) => setProviderAccountForm((current) => ({ ...current, secretRef }))} required />
              <PaymentProviderAccountInput label={t('admin.commerce.payments.providerAccounts.certificateRef', 'Certificate ref')} value={providerAccountForm.certificateRef} onChange={(certificateRef) => setProviderAccountForm((current) => ({ ...current, certificateRef }))} />
              <PaymentProviderAccountInput label={t('admin.commerce.payments.providerAccounts.webhookSecretRef', 'Webhook secret ref')} value={providerAccountForm.webhookSecretRef} onChange={(webhookSecretRef) => setProviderAccountForm((current) => ({ ...current, webhookSecretRef }))} />
              <PaymentProviderAccountInput label={t('admin.commerce.payments.providerAccounts.status', 'Status')} value={providerAccountForm.status} onChange={(status) => setProviderAccountForm((current) => ({ ...current, status }))} required />
            </div>
            {(providerAccountError || providerAccountSuccess) && (
              <div className="px-5 pb-4">
                <div className={`rounded-lg border px-3 py-2 text-sm ${
                  providerAccountError
                    ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300'
                    : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300'
                }`}>
                  {providerAccountError ?? providerAccountSuccess}
                </div>
              </div>
            )}
            <div className="flex justify-end gap-3 border-t border-slate-200 p-5 dark:border-white/10">
              <button
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                disabled={providerAccountSaving}
                onClick={() => setProviderAccountFormOpen(false)}
                type="button"
              >
                {t('admin.action.cancel', 'Cancel')}
              </button>
              <button
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
                disabled={providerAccountSaving}
                type="submit"
              >
                {providerAccountSaving ? t('admin.action.saving', 'Saving...') : t('admin.commerce.payments.providerAccounts.save', 'Save account')}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

function PaymentProviderAccountInput({
  label,
  onChange,
  required = false,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  required?: boolean;
  value: string;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-slate-700 dark:text-slate-300">{label}</span>
      <input
        className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 dark:border-white/10 dark:bg-[#1e1e1e] dark:text-white"
        onChange={(event) => onChange(event.target.value)}
        required={required}
        value={value}
      />
    </label>
  );
}

type PaymentProviderCode = PaymentProviderAccountMutationInput['providerCode'];
type PaymentProviderEnvironment = PaymentProviderAccountMutationInput['environment'];
type PaymentProviderAccountStatus = PaymentProviderAccountMutationInput['status'];

const PAYMENT_PROVIDER_CODES: readonly PaymentProviderCode[] = [
  'wechat_pay',
  'alipay',
  'paypal',
  'stripe',
  'apple_pay',
  'google_pay',
];
const PAYMENT_PROVIDER_ENVIRONMENTS: readonly PaymentProviderEnvironment[] = ['sandbox', 'production'];
const PAYMENT_PROVIDER_ACCOUNT_STATUSES: readonly PaymentProviderAccountStatus[] = ['active', 'inactive', 'disabled'];

function toPaymentProviderAccountRequest(form: PaymentProviderAccountFormState): PaymentProviderAccountMutationInput {
  return {
    accountNo: requiredText(form.accountNo, 'accountNo'),
    providerCode: requiredPaymentProviderCode(form.providerCode),
    merchantId: requiredText(form.merchantId, 'merchantId'),
    environment: requiredPaymentEnvironment(form.environment),
    countryCode: requiredText(form.countryCode, 'countryCode').toUpperCase(),
    settlementCurrency: requiredText(form.settlementCurrency, 'settlementCurrency').toUpperCase(),
    secretRef: requiredText(form.secretRef, 'secretRef'),
    status: requiredPaymentStatus(form.status),
    ...(form.certificateRef.trim() ? { certificateRef: form.certificateRef.trim() } : {}),
    ...(form.webhookSecretRef.trim() ? { webhookSecretRef: form.webhookSecretRef.trim() } : {}),
  };
}

function readCommerceOperationRequestNo(result: unknown): string {
  const data = readPaymentPayload(result);
  if (!isPaymentRecord(data)) {
    return 'accepted';
  }
  const payload = isPaymentRecord(data.item) ? data.item : data;
  const requestNo = payload.requestNo ?? payload.accountNo;
  return typeof requestNo === 'string' && requestNo.trim() ? requestNo.trim() : 'accepted';
}

function readPaymentPayload(value: unknown): unknown {
  if (!isPaymentRecord(value)) {
    return value;
  }
  return 'data' in value ? value.data : value;
}

function isPaymentRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requiredText(value: string, fieldName: string): string {
  const normalized = value.trim();
  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }
  return normalized;
}

function requiredPaymentProviderCode(value: string): PaymentProviderCode {
  const normalized = requiredText(value, 'providerCode').toLowerCase() as PaymentProviderCode;
  if (!PAYMENT_PROVIDER_CODES.includes(normalized)) {
    throw new Error(`providerCode must be one of ${PAYMENT_PROVIDER_CODES.join(', ')}`);
  }
  return normalized;
}

function requiredPaymentEnvironment(value: string): PaymentProviderEnvironment {
  const normalized = requiredText(value, 'environment').toLowerCase() as PaymentProviderEnvironment;
  if (!PAYMENT_PROVIDER_ENVIRONMENTS.includes(normalized)) {
    throw new Error(`environment must be one of ${PAYMENT_PROVIDER_ENVIRONMENTS.join(', ')}`);
  }
  return normalized;
}

function requiredPaymentStatus(value: string): PaymentProviderAccountStatus {
  const normalized = requiredText(value, 'status').toLowerCase() as PaymentProviderAccountStatus;
  if (!PAYMENT_PROVIDER_ACCOUNT_STATUSES.includes(normalized)) {
    throw new Error(`status must be one of ${PAYMENT_PROVIDER_ACCOUNT_STATUSES.join(', ')}`);
  }
  return normalized;
}
