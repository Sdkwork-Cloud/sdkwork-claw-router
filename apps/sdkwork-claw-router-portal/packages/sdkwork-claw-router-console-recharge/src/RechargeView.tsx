import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, CreditCard, Gift, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { RechargeService, type RechargePackage } from './rechargeService';

type TranslationFunction = ReturnType<typeof useTranslation>['t'];

type RechargeOption = {
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

const referenceRechargeOptions: RechargeOption[] = [
  { id: 'reference-usd-10', amount: '10.00', bonus: 0, points: 100 },
  { id: 'reference-usd-50', amount: '50.00', bonus: 0, points: 500 },
  { id: 'reference-usd-100', amount: '100.00', bonus: 0, points: 1000 },
  { id: 'reference-usd-200', amount: '200.00', bonus: 0, points: 2000 },
  { id: 'reference-usd-500', amount: '500.00', bonus: 0, points: 5000 },
  { id: 'reference-usd-1000', amount: '1000.00', bonus: 0, points: 10000 },
  { id: 'reference-usd-2000', amount: '2000.00', bonus: 0, points: 20000 },
  { id: 'reference-usd-5000', amount: '5000.00', bonus: 0, points: 50000 },
];

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
    <div className="min-h-[calc(100vh-72px)] w-full bg-[#121212] px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <RechargePanel />
    </div>
  );
}

export function RechargePanel({ embedded = false, showTabs = true }: RechargePanelProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [packages, setPackages] = useState<RechargePackage[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
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
    if (packages.length === 0) {
      return referenceRechargeOptions;
    }
    return packages.map(mapRechargePackageToOption);
  }, [packages]);

  const selectedOption = selectedOptionId
    ? rechargeOptions.find(option => option.id === selectedOptionId)
    : undefined;
  const customSelectionAmount = normalizeCustomAmount(customAmount);
  const currentSelectionAmount = selectedOption?.amount || customSelectionAmount;
  const currentSelectionCents = moneyCents(currentSelectionAmount);
  const currentPoints = currentSelectionCents > 0
    ? selectedOption?.points ?? pointsForAmount(currentSelectionAmount)
    : 0;
  const isPayDisabled = currentSelectionCents <= 0 || isSubmitting;

  const handleCustomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOptionId('');
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
      data-business-state={packagesLoadError ? 'error' : undefined}
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
        <div className="space-y-4">
          <div className="flex min-h-6 items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-white">
              {t('console.recharge.amountTitle', '选择充值金额 (USD)')}
            </h2>
            {packagesLoading ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                {t('console.recharge.syncingPackages', '正在同步套餐')}
              </span>
            ) : null}
          </div>

          {packagesLoadError ? (
            <div className="flex items-start gap-2 rounded-md border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{t('console.recharge.defaultPackagesActive', '充值套餐同步失败，已展示默认金额。')}</span>
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {rechargeOptions.map(option => {
              const isSelected = selectedOptionId === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    setSelectedOptionId(option.id);
                    setCustomAmount('');
                    setSuccessMsg('');
                    setSubmitError(null);
                  }}
                  className={`relative flex min-h-[92px] flex-col items-center justify-center rounded-md border px-2 py-4 text-center transition-colors ${
                    isSelected
                      ? 'border-[#1677ff] bg-[#142b45] text-white'
                      : 'border-[#383838] bg-[#262626] text-slate-100 hover:border-[#1677ff]/70 hover:bg-[#2b2b2b]'
                  }`}
                >
                  {isSelected ? (
                    <CheckCircle2 className="absolute right-2 top-2 h-4 w-4 text-[#1677ff]" />
                  ) : null}
                  <span className="text-xl font-semibold leading-none">${formatDisplayAmount(option.amount)}</span>
                  <span className="mt-2 text-xs font-medium text-slate-400">
                    {t('console.recharge.pointsIncluded', '得 {{points}} 积分', { points: option.points.toLocaleString('en-US') })}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

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
