import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, CreditCard, Gift, Loader2, ReceiptText, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { RechargeService, type BillingHistoryItem, type BillingHistoryTab, type RechargePackage } from './rechargeService';

type TranslationFunction = ReturnType<typeof useTranslation>['t'];

export type RechargeOption = {
  amount: string;
  bonus: number;
  id: string;
  packageId?: string;
  points: number;
};

export interface RechargePanelProps {
  embedded?: boolean;
  showTabs?: boolean;
}

export interface RechargePackageSelectorProps {
  className?: string;
  disabled?: boolean;
  onSelectionChange: (option: RechargeOption | null) => void;
  selectedOptionId: string;
  variant?: 'console' | 'vip';
}

function getRechargeErrorMessage(error: unknown, fallback: string, t: TranslationFunction): string {
  if (error instanceof Error) {
    const message = error.message.trim();
    if (message.startsWith('console.')) {
      return t(message, fallback);
    }
    if (message) {
      return message;
    }
  }
  return fallback;
}

export function RechargeView() {
  return (
    <div className="min-h-[calc(100vh-72px)] w-full bg-[#121212] p-[5px] text-slate-100">
      <div className="mx-auto w-full max-w-[960px] space-y-6">
        <RechargePanel />
        <RechargeRecordsTabs />
      </div>
    </div>
  );
}

export function RechargePackageSelector({
  className = '',
  disabled = false,
  onSelectionChange,
  selectedOptionId,
  variant = 'console',
}: RechargePackageSelectorProps) {
  const { t } = useTranslation();
  const [packages, setPackages] = useState<RechargePackage[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const [packagesLoadError, setPackagesLoadError] = useState<string | null>(null);

  const loadRechargePackages = useCallback(async (isActive: () => boolean = () => true) => {
    setPackagesLoading(true);
    setPackagesLoadError(null);
    try {
      const data = await RechargeService.fetchPackages();
      if (isActive()) {
        setPackages(data);
      }
    } catch (error) {
      if (isActive()) {
        setPackages([]);
        setPackagesLoadError(getRechargeErrorMessage(error, t('console.recharge.packagesLoadError', '充值套餐加载失败'), t));
      }
    } finally {
      if (isActive()) {
        setPackagesLoading(false);
      }
    }
  }, [t]);

  useEffect(() => {
    let active = true;
    void loadRechargePackages(() => active);
    return () => {
      active = false;
    };
  }, [loadRechargePackages]);

  const rechargeOptions = useMemo<RechargeOption[]>(() => {
    return packages.map(mapRechargePackageToOption);
  }, [packages]);

  useEffect(() => {
    if (!selectedOptionId || packagesLoading) {
      return;
    }
    if (!rechargeOptions.some(option => option.id === selectedOptionId)) {
      onSelectionChange(null);
    }
  }, [onSelectionChange, packagesLoading, rechargeOptions, selectedOptionId]);

  const optionGridClassName = variant === 'vip'
    ? 'grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4'
    : 'grid grid-cols-2 gap-3 sm:grid-cols-4';
  const amountPrefix = variant === 'vip' ? '¥' : '$';

  return (
    <div
      data-business-state={packagesLoadError ? 'error' : packages.length === 0 && !packagesLoading ? 'empty' : undefined}
      data-console-recharge-options="server-configured"
      className={className}
    >
      <div className="mb-4 flex min-h-6 items-center justify-between gap-3">
        <h2 className="text-left text-base font-semibold text-white">
          {variant === 'vip'
            ? t('vip.pointsPurchase.packageTitle', 'Choose a credit package')
            : t('console.recharge.amountTitle', '选择充值金额 (USD)')}
        </h2>
        {packagesLoading ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            {t('console.recharge.syncingPackages', '正在同步套餐')}
          </span>
        ) : null}
      </div>

      {packagesLoading ? (
        <RechargePackageSelectorState
          title={t('console.recharge.loadingPackages', 'Loading recharge packages...')}
        />
      ) : packagesLoadError ? (
        <RechargePackageSelectorState
          actionLabel={t('console.recharge.retryPackages', 'Retry')}
          kind="error"
          onAction={() => { void loadRechargePackages(); }}
          title={packagesLoadError}
        />
      ) : rechargeOptions.length === 0 ? (
        <RechargePackageSelectorState
          title={t('console.recharge.emptyPackages', 'No recharge packages are configured.')}
        />
      ) : (
        <div className={optionGridClassName}>
          {rechargeOptions.map(option => {
            const isSelected = selectedOptionId === option.id;
            const pointsLabel = option.points.toLocaleString('en-US');
            return (
              <button
                key={option.id}
                type="button"
                disabled={disabled}
                onClick={() => onSelectionChange(option)}
                className={`relative flex min-h-[104px] flex-col items-start justify-between rounded-md border px-3 py-4 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                  isSelected
                    ? 'border-[#1677ff] bg-[#142b45] text-white'
                    : variant === 'vip'
                      ? 'border-transparent bg-[#363b44] text-slate-100 hover:border-white/40 hover:bg-[#3c414b]'
                      : 'border-[#383838] bg-[#262626] text-slate-100 hover:border-[#1677ff]/70 hover:bg-[#2b2b2b]'
                }`}
              >
                {isSelected ? (
                  <CheckCircle2 className="absolute right-2 top-2 h-4 w-4 text-[#1677ff]" />
                ) : null}
                <span className="pr-6 text-xl font-semibold leading-none">
                  {amountPrefix}{formatDisplayAmount(option.amount)}
                </span>
                <span className="mt-3 text-xs font-medium leading-5 text-slate-400">
                  {t('console.recharge.pointsIncluded', '得 {{points}} 积分', { points: pointsLabel })}
                </span>
                {option.bonus > 0 ? (
                  <span className="mt-1 text-[11px] font-semibold leading-4 text-emerald-300">
                    {t('console.recharge.bonusIncluded', '+{{bonus}} bonus', { bonus: option.bonus.toLocaleString('en-US') })}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RechargePackageSelectorState({
  actionLabel,
  kind = 'empty',
  onAction,
  title,
}: {
  actionLabel?: string;
  kind?: 'empty' | 'error';
  onAction?: () => void;
  title: string;
}) {
  const iconClassName = kind === 'error' ? 'text-red-300' : 'text-slate-400';
  return (
    <div className={`flex min-h-[164px] flex-col items-start justify-center gap-3 rounded-md border px-4 py-5 text-left text-sm ${
      kind === 'error'
        ? 'border-red-500/25 bg-red-500/10 text-red-100'
        : 'border-[#383838] bg-[#262626] text-slate-300'
    }`}
    >
      <AlertCircle className={`h-5 w-5 ${iconClassName}`} />
      <p className="font-semibold leading-6">{title}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex h-9 items-center gap-2 rounded-md border border-white/15 px-3 text-xs font-semibold text-white transition-colors hover:bg-white/10"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

export function RechargePanel({ embedded = false, showTabs = true }: RechargePanelProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedOptionId, setSelectedOptionId] = useState('');
  const [selectedOption, setSelectedOption] = useState<RechargeOption | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleOptionChange = useCallback((option: RechargeOption | null) => {
    setSelectedOption(option);
    setSelectedOptionId(option?.id ?? '');
    if (option) {
      setCustomAmount('');
    }
    setSuccessMsg('');
    setSubmitError(null);
  }, []);

  const customSelectionAmount = normalizeCustomAmount(customAmount);
  const currentSelectionAmount = selectedOption?.amount || customSelectionAmount;
  const currentSelectionCents = moneyCents(currentSelectionAmount);
  const currentPoints = currentSelectionCents > 0
    ? selectedOption?.points ?? pointsForAmount(currentSelectionAmount)
    : 0;
  const isPayDisabled = currentSelectionCents <= 0 || isSubmitting;

  const handleCustomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOptionId('');
    setSelectedOption(null);
    setCustomAmount(sanitizeMoneyInput(event.target.value));
    setSuccessMsg('');
    setSubmitError(null);
  };

  const handlePay = async () => {
    if (isPayDisabled) return;
    setIsSubmitting(true);
    setSuccessMsg('');
    setSubmitError(null);
    try {
      const response = await RechargeService.submitRecharge(
        formatMoneyAmount(currentSelectionAmount),
        'card',
        selectedOption?.packageId,
      );
      if (response.success && response.orderNo) {
        setSuccessMsg(t("console.recharge.rechargeview.text.orderSubmitted", "充值订单已提交，订单号：{{orderNo}}", { orderNo: response.orderNo }));
        navigate(`/console/checkout?orderNo=${encodeURIComponent(response.orderNo)}`);
      } else {
        setSubmitError(t('console.recharge.orderCreateFailed', '充值订单创建失败，请重试。'));
      }
    } catch (error) {
      setSubmitError(getRechargeErrorMessage(error, t('console.recharge.submitFailed', '充值订单提交失败'), t));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      data-console-recharge-reference-panel
      className={`${embedded ? 'w-full' : 'mx-auto w-full max-w-[760px]'} overflow-hidden rounded-lg border border-[#303030] bg-[#1f1f1f] shadow-[0_18px_44px_rgba(0,0,0,0.24)]`}
    >
      {showTabs ? (
        <div className="grid grid-cols-2 border-b border-[#333333] bg-[#202020]">
          <button
            type="button"
            onClick={() => navigate('/console/wallet')}
            className="flex min-h-14 items-center justify-center gap-2 border-b-2 border-transparent px-3 text-sm font-semibold text-slate-400 transition-colors hover:bg-white/[0.03] hover:text-slate-100"
          >
            <Gift className="h-4 w-4" />
            {t('console.recharge.tabs.redeem', '兑换')}
          </button>
          <button
            type="button"
            aria-current="page"
            className="flex min-h-14 items-center justify-center gap-2 border-b-2 border-[#ff4d4f] bg-white/[0.02] px-3 text-sm font-semibold text-white"
          >
            <CreditCard className="h-4 w-4" />
            {t('console.recharge.tabs.online', '充值')}
          </button>
        </div>
      ) : null}

      <div className={`space-y-6 ${showTabs ? 'p-5 sm:p-6' : 'p-4 sm:p-5'}`}>
        <RechargePackageSelector
          disabled={isSubmitting}
          onSelectionChange={handleOptionChange}
          selectedOptionId={selectedOptionId}
        />

        <div className="space-y-3">
          <label htmlFor={embedded ? 'console-wallet-recharge-custom-amount' : 'console-recharge-custom-amount'} className="block text-base font-semibold text-white">
            {t('console.recharge.customAmount', '自定义金额')}
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">$</span>
            <input
              id={embedded ? 'console-wallet-recharge-custom-amount' : 'console-recharge-custom-amount'}
              type="text"
              inputMode="decimal"
              value={customAmount}
              onChange={handleCustomChange}
              placeholder={t('console.recharge.customPlaceholder', '输入其他金额')}
              className="h-12 w-full rounded-md border border-[#3a3a3a] bg-[#252525] pl-8 pr-4 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-[#1677ff] focus:ring-2 focus:ring-[#1677ff]/20"
            />
          </div>
        </div>

        <div className="space-y-4 border-t border-[#333333] pt-5 text-sm">
          <div className="flex items-center justify-between gap-4 text-slate-300">
            <span>{t('console.recharge.pointsEarned', '获得积分:')}</span>
            <span className="font-semibold text-[#1677ff]">{currentPoints.toLocaleString('en-US')} {t('console.account.accountview.text.1f5u8y0', '积分')}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-slate-300">
            <span>{t('console.recharge.actualPayment', '实际支付金额:')}</span>
            <span className="font-semibold text-white">${formatMoneyAmount(currentSelectionAmount)}</span>
          </div>
        </div>

        {successMsg ? (
          <div className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
            {successMsg}
          </div>
        ) : null}

        {submitError ? (
          <div role="alert" className="flex items-start gap-2 rounded-md border border-red-500/25 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{submitError}</span>
          </div>
        ) : null}

        <button
          type="button"
          disabled={isPayDisabled}
          onClick={handlePay}
          className={`flex h-12 w-full items-center justify-center rounded-md text-sm font-semibold transition-colors ${
            isPayDisabled
              ? 'cursor-not-allowed bg-[#1b5c9d] text-white/55'
              : 'bg-[#1677ff] text-white hover:bg-[#0f68e6]'
          }`}
        >
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isSubmitting ? t('console.recharge.submittingPayment', '正在提交...') : t('console.recharge.pay', '去支付')}
        </button>
      </div>
    </section>
  );
}

const rechargeRecordTabs: Array<{ key: BillingHistoryTab; labelKey: string; fallback: string }> = [
  { key: 'all', labelKey: 'console.recharge.records.tabs.all', fallback: 'All' },
  { key: 'redeem', labelKey: 'console.recharge.records.tabs.redeem', fallback: 'Redeem records' },
  { key: 'recharge', labelKey: 'console.recharge.records.tabs.recharge', fallback: 'Recharge records' },
];

export interface RechargeRecordsTabsProps {
  defaultTab?: BillingHistoryTab;
  refreshSignal?: number;
}

export function RechargeRecordsTabs({ defaultTab = 'all', refreshSignal = 0 }: RechargeRecordsTabsProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<BillingHistoryTab>(defaultTab);
  const [records, setRecords] = useState<BillingHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadRecords = useCallback(async (isActive: () => boolean = () => true) => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await RechargeService.fetchBillingHistory(
        activeTab === 'all' ? {} : { type: activeTab },
      );
      if (isActive()) {
        setRecords(data);
      }
    } catch (error) {
      if (isActive()) {
        setRecords([]);
        setLoadError(getRechargeErrorMessage(error, t('console.recharge.records.errors.loadFallback', 'Billing history loading failed.'), t));
      }
    } finally {
      if (isActive()) {
        setIsLoading(false);
      }
    }
  }, [activeTab, t]);

  useEffect(() => {
    let active = true;
    void loadRecords(() => active);
    return () => {
      active = false;
    };
  }, [loadRecords, refreshSignal]);

  return (
    <section className="mx-auto w-full overflow-hidden rounded-lg border border-[#303030] bg-[#1f1f1f] text-slate-100 shadow-[0_18px_44px_rgba(0,0,0,0.22)]">
      <div className="flex flex-col gap-3 border-b border-[#333333] bg-[#202020] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <ReceiptText className="h-4 w-4 text-[#1677ff]" />
          <h2 className="text-sm font-semibold text-white">
            {t('console.recharge.records.title', 'Billing history')}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => { void loadRecords(); }}
          disabled={isLoading}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-[#3a3a3a] px-3 text-xs font-semibold text-slate-300 transition-colors hover:border-[#1677ff]/70 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          {t('console.recharge.records.refresh', 'Refresh')}
        </button>
      </div>

      <div className="grid grid-cols-3 border-b border-[#333333] bg-[#202020]">
        {rechargeRecordTabs.map(tab => {
          const selected = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`min-h-11 border-b-2 px-2 text-xs font-semibold transition-colors sm:text-sm ${
                selected
                  ? 'border-[#1677ff] bg-white/[0.03] text-white'
                  : 'border-transparent text-slate-400 hover:bg-white/[0.02] hover:text-slate-100'
              }`}
            >
              {t(tab.labelKey, tab.fallback)}
            </button>
          );
        })}
      </div>

      <div className="min-h-[280px] overflow-x-auto">
        <table className="w-full table-fixed text-left text-xs">
          <thead className="border-b border-[#333333] bg-[#1a1a1a] text-slate-400">
            <tr>
              <th className="w-[110px] px-4 py-3 font-medium">{t('console.recharge.records.table.type', 'Type')}</th>
              <th className="w-[180px] px-4 py-3 font-medium">{t('console.recharge.records.table.title', 'Title')}</th>
              <th className="w-[150px] px-4 py-3 font-medium">{t('console.recharge.records.table.amount', 'Amount')}</th>
              <th className="w-[160px] px-4 py-3 font-medium">{t('console.recharge.records.table.reference', 'Reference')}</th>
              <th className="w-[120px] px-4 py-3 font-medium">{t('console.recharge.records.table.status', 'Status')}</th>
              <th className="w-[210px] px-4 py-3 font-medium">{t('console.recharge.records.table.time', 'Time')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#303030] text-slate-300">
            {isLoading ? (
              <RechargeRecordsStateRow
                colSpan={6}
                title={t('console.recharge.records.loading', 'Loading billing history...')}
              />
            ) : loadError ? (
              <RechargeRecordsStateRow
                colSpan={6}
                title={t('console.recharge.records.loadFailed', 'Billing history loading failed')}
                description={loadError}
              />
            ) : records.length > 0 ? (
              records.map(record => (
                <tr key={record.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded border border-[#3a3a3a] px-2 py-0.5 text-[11px] font-semibold text-slate-200">
                      {billingTypeLabel(record.type, t)}
                    </span>
                  </td>
                  <td className="truncate px-4 py-3 font-medium text-white" title={record.title}>{record.title}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-emerald-300">{formatPointsDelta(record.pointsDelta)}</div>
                    <div className="mt-1 text-[11px] text-slate-500">{formatBillingAmount(record)}</div>
                  </td>
                  <td className="truncate px-4 py-3 font-mono text-slate-300" title={billingReference(record)}>{billingReference(record)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded px-2 py-0.5 text-[11px] font-semibold ${billingStatusClass(record.status)}`}>
                      {billingStatusLabel(record.status, t)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{record.occurredAt}</td>
                </tr>
              ))
            ) : (
              <RechargeRecordsStateRow
                colSpan={6}
                title={t('console.recharge.records.empty', 'No billing history')}
                description={t('console.recharge.records.emptyHint', 'Recharge and redeem records will appear here.')}
              />
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function RechargeRecordsStateRow({ colSpan, title, description }: { colSpan: number; title: string; description?: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-12 text-center">
        <div className="mx-auto max-w-sm space-y-1">
          <div className="text-sm font-semibold text-slate-200">{title}</div>
          {description ? <div className="text-xs text-slate-500">{description}</div> : null}
        </div>
      </td>
    </tr>
  );
}

function billingTypeLabel(type: BillingHistoryItem['type'], t: TranslationFunction): string {
  return type === 'recharge'
    ? t('console.recharge.records.type.recharge', 'Recharge')
    : t('console.recharge.records.type.redeem', 'Redeem');
}

function billingStatusLabel(status: string, t: TranslationFunction): string {
  const normalized = status.trim().toLowerCase();
  if (normalized === 'success' || normalized === 'succeeded' || normalized === 'posted' || normalized === 'redeemed') {
    return t('console.recharge.records.status.success', 'Success');
  }
  if (normalized === 'pending' || normalized === 'processing' || normalized === 'created') {
    return t('console.recharge.records.status.pending', 'Pending');
  }
  if (normalized === 'failed' || normalized === 'closed' || normalized === 'cancelled' || normalized === 'canceled') {
    return t('console.recharge.records.status.failed', 'Failed');
  }
  return status;
}

function billingStatusClass(status: string): string {
  const normalized = status.trim().toLowerCase();
  if (normalized === 'success' || normalized === 'succeeded' || normalized === 'posted' || normalized === 'redeemed') {
    return 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-300';
  }
  if (normalized === 'pending' || normalized === 'processing' || normalized === 'created') {
    return 'border border-amber-500/20 bg-amber-500/10 text-amber-300';
  }
  return 'border border-red-500/20 bg-red-500/10 text-red-300';
}

function formatPointsDelta(pointsDelta: number): string {
  const sign = pointsDelta > 0 ? '+' : '';
  return `${sign}${pointsDelta.toLocaleString('en-US')} pts`;
}

function formatBillingAmount(record: BillingHistoryItem): string {
  const currency = record.currencyCode || 'USD';
  return `${record.amount} ${currency}`;
}

function billingReference(record: BillingHistoryItem): string {
  return record.relatedOrderNo || record.referenceNo || record.sourceId || record.historyNo;
}

function mapRechargePackageToOption(pkg: RechargePackage): RechargeOption {
  return {
    amount: pkg.rmb,
    bonus: pkg.bonus,
    id: `package-${pkg.id}`,
    packageId: pkg.id,
    points: pkg.points > 0 ? pkg.points : pointsForAmount(pkg.rmb),
  };
}

function sanitizeMoneyInput(value: string): string {
  const cleaned = value.replace(/[^\d.]/g, '');
  const [whole = '', ...fractionParts] = cleaned.split('.');
  const normalizedWhole = whole.replace(/^0+(?=\d)/, '');
  if (fractionParts.length === 0) {
    return normalizedWhole;
  }
  return `${normalizedWhole}.${fractionParts.join('').slice(0, 2)}`;
}

function normalizeCustomAmount(value: string): string {
  const trimmed = value.trim();
  if (!trimmed || trimmed === '.') {
    return '0.00';
  }
  const [whole = '0', fraction = ''] = trimmed.split('.');
  const normalizedWhole = whole || '0';
  return `${normalizedWhole}.${fraction.padEnd(2, '0').slice(0, 2)}`;
}

function moneyCents(amount: string): number {
  const value = amount.trim();
  if (!/^\d+(?:\.\d{1,2})?$/.test(value)) {
    return 0;
  }
  const [whole, fraction = ''] = value.split('.');
  const cents = Number.parseInt(whole, 10) * 100 + Number.parseInt(fraction.padEnd(2, '0'), 10);
  return Number.isSafeInteger(cents) ? cents : 0;
}

function pointsForAmount(amount: string): number {
  return Math.floor(moneyCents(amount) / 10);
}

function formatDisplayAmount(amount: string): string {
  const formatted = formatMoneyAmount(amount);
  return formatted.endsWith('.00') ? formatted.slice(0, -3) : formatted;
}

function formatMoneyAmount(amount: string): string {
  const cents = moneyCents(amount);
  const whole = Math.floor(cents / 100);
  const fraction = String(cents % 100).padStart(2, '0');
  return `${whole}.${fraction}`;
}
