import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Zap, CheckCircle2, ChevronRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { BusinessStatePanel } from 'sdkwork-claw-router-commons';
import { AccountService, AccountStats } from 'sdkwork-claw-router-console-account';
import { RechargeService, RechargePackage } from './rechargeService';

const EXCHANGE_RATE = 10;
const readOnlyRechargeHistory =
  'Recharge records are available from the billing history contract; this page only creates recharge orders.';

function getRechargeErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

export function RechargeView() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<RechargePackage[]>([]);
  const [selectedPkg, setSelectedPkg] = useState<string>('');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'alipay' | 'wechat' | 'card'>('alipay');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [accountSummary, setAccountSummary] = useState<AccountStats | null>(null);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const [packagesLoadError, setPackagesLoadError] = useState<string | null>(null);
  const [accountLoading, setAccountLoading] = useState(true);
  const [accountLoadError, setAccountLoadError] = useState<string | null>(null);

  const loadRechargePackages = useCallback(async (isActive: () => boolean = () => true) => {
    setPackagesLoading(true);
    setPackagesLoadError(null);
    try {
      const data = await RechargeService.fetchPackages();
      if (isActive()) {
        setPackages(data);
        setSelectedPkg(prev => prev || data[0]?.id || '');
      }
    } catch (error) {
      if (isActive()) {
        setPackages([]);
        setSelectedPkg('');
        setPackagesLoadError(getRechargeErrorMessage(error, 'Failed to load recharge packages.'));
      }
    } finally {
      if (isActive()) {
        setPackagesLoading(false);
      }
    }
  }, []);

  const loadAccountSummary = useCallback(async (isActive: () => boolean = () => true) => {
    setAccountLoading(true);
    setAccountLoadError(null);
    try {
      const account = await AccountService.fetchAccountDetails();
      if (isActive()) {
        setAccountSummary(account);
      }
    } catch (error) {
      if (isActive()) {
        setAccountSummary(null);
        setAccountLoadError(getRechargeErrorMessage(error, 'Failed to load account balance.'));
      }
    } finally {
      if (isActive()) {
        setAccountLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let active = true;
    void loadRechargePackages(() => active);
    void loadAccountSummary(() => active);
    return () => {
      active = false;
    };
  }, [loadAccountSummary, loadRechargePackages]);

  const selectedPackage = selectedPkg ? packages.find(p => p.id === selectedPkg) : undefined;
  const currentSelectionAmount = selectedPackage?.rmb || normalizeCustomAmount(customAmount);
  const currentSelectionCents = moneyCents(currentSelectionAmount);
  const bonus = selectedPackage?.bonus || 0;
  const creditsReceived = pointsForAmount(currentSelectionAmount) + bonus;
  const loadError = packagesLoadError || accountLoadError;

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPkg('');
    setCustomAmount(sanitizeMoneyInput(e.target.value));
  };

  const handlePay = async () => {
    if (currentSelectionCents <= 0) return;
    setIsSubmitting(true);
    setSuccessMsg('');
    setSubmitError(null);
    try {
      const res = await RechargeService.submitRecharge(formatMoneyAmount(currentSelectionAmount), paymentMethod);
      if (res.success && res.orderNo) {
        setSuccessMsg(`充值订单已提交，订单号：${res.orderNo}`);
        navigate(`/console/checkout?orderNo=${encodeURIComponent(res.orderNo)}`);
      } else {
        setSubmitError('Recharge order could not be created. Please try again.');
      }
    } catch (error) {
      setSubmitError(getRechargeErrorMessage(error, 'Failed to submit recharge order.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      data-business-state={loadError ? 'error' : undefined}
      className="p-4 lg:p-6 w-full mx-auto space-y-6 animate-in fade-in duration-500 max-w-6xl"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/5">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            余额充值
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">按需购买，灵活充值，用于在此平台调用所有提供商的 API。</p>
        </div>
        <span className="bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 shadow-sm max-w-sm">
          {readOnlyRechargeHistory}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            {accountLoading ? (
              <BusinessStatePanel
                kind="loading"
                title="Loading account balance..."
                className="relative z-10 min-h-24 text-white"
              />
            ) : accountLoadError ? (
              <BusinessStatePanel
                kind="error"
                title="Account balance could not be loaded"
                description={accountLoadError}
                onRetry={() => { void loadAccountSummary(); }}
                className="relative z-10 min-h-24 text-white"
              />
            ) : !accountSummary ? (
              <BusinessStatePanel
                kind="empty"
                title="Account balance is unavailable"
                description="The account API returned no displayable balance data."
                onRetry={() => { void loadAccountSummary(); }}
                className="relative z-10 min-h-24 text-white"
              />
            ) : (
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">当前可用虚拟余额</p>
                <div className="text-3xl lg:text-4xl font-bold flex items-center gap-2">
                  <Zap className="w-7 h-7 text-amber-300 fill-amber-300" />
                  {accountSummary.availableCredits.toLocaleString('en-US')}
                </div>
              </div>
              <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex flex-col items-end">
                 <p className="text-xs text-white/70 mb-1">当前充值比例</p>
                 <div className="text-lg font-bold">1 RMB = {EXCHANGE_RATE} Credits</div>
              </div>
            </div>
            )}
          </div>

          <div className="bg-white dark:bg-[#252525] rounded-2xl border border-slate-200 dark:border-white/5 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">选择充值金额</h2>

            {packagesLoading ? (
              <BusinessStatePanel
                kind="loading"
                title="Loading recharge packages..."
                className="mb-6 min-h-32 rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-[#1e1e1e]"
              />
            ) : packagesLoadError ? (
              <BusinessStatePanel
                kind="error"
                title="Recharge packages could not be loaded"
                description={packagesLoadError}
                onRetry={() => { void loadRechargePackages(); }}
                className="mb-6 min-h-32 rounded-xl border border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-500/10"
              />
            ) : packages.length === 0 ? (
              <BusinessStatePanel
                kind="empty"
                title="No recharge packages"
                description="Use a custom amount to create a recharge order."
                className="mb-6 min-h-32 rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-[#1e1e1e]"
              />
            ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => { setSelectedPkg(pkg.id); setCustomAmount(''); }}
                  className={`relative cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center justify-center transition-all ${
                    selectedPkg === pkg.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
                      : 'border-slate-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-500/50'
                  }`}
                >
                  {selectedPkg === pkg.id && (
                    <div className="absolute top-0 right-0 bg-blue-500 text-white rounded-bl-lg rounded-tr-lg p-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  )}
                  {pkg.bonus > 0 && (
                    <div className="absolute -top-2.5 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                      赠送 {pkg.bonus}
                    </div>
                  )}
                  <span className="text-xl font-bold text-slate-800 dark:text-white">¥{pkg.rmb}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    得 {pointsForAmount(pkg.rmb)} Credits
                  </span>
                </div>
              ))}
            </div>
            )}

            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">¥</span>
                <input
                  type="text"
                  value={customAmount}
                  onChange={handleCustomChange}
                  placeholder="其他金额"
                  className={`w-full pl-8 pr-4 py-3 rounded-xl border-2 outline-none transition-all bg-transparent ${
                    customAmount && !selectedPkg
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/5 text-slate-800 dark:text-white'
                      : 'border-slate-200 dark:border-white/10 text-slate-800 dark:text-white focus:border-blue-400'
                  }`}
                />
              </div>
              <span className="text-sm text-slate-500 border border-slate-200 dark:border-white/10 px-3 py-1 rounded-full whitespace-nowrap">最高 ¥10,000</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#252525] rounded-2xl border border-slate-200 dark:border-white/5 p-6 shadow-sm">
             <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">支付方式</h2>
             <div className="space-y-3">
                <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'alipay' ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-500/10' : 'border-slate-200 dark:border-white/10 hover:border-blue-300'
                }`}>
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-[#1677FF]/10 rounded-lg flex items-center justify-center text-[#1677FF] font-bold text-sm">
                       支
                     </div>
                     <div>
                       <div className="font-semibold text-slate-800 dark:text-white">支付宝 (Alipay)</div>
                       <div className="text-xs text-slate-500">支持大陆及部分海外地区</div>
                     </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'alipay' ? 'border-blue-500' : 'border-slate-300'}`}>
                    {paymentMethod === 'alipay' && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>}
                  </div>
                  <input type="radio" className="hidden" checked={paymentMethod === 'alipay'} onChange={() => setPaymentMethod('alipay')} />
                </label>
                <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'wechat' ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-500/10' : 'border-slate-200 dark:border-white/10 hover:border-emerald-300'
                }`}>
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-[#09B83E]/10 rounded-lg flex items-center justify-center text-[#09B83E] font-bold text-sm">
                       微
                     </div>
                     <div>
                       <div className="font-semibold text-slate-800 dark:text-white">微信支付 (WeChat Pay)</div>
                       <div className="text-xs text-slate-500">仅支持大陆地区微信账号</div>
                     </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'wechat' ? 'border-emerald-500' : 'border-slate-300'}`}>
                    {paymentMethod === 'wechat' && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>}
                  </div>
                  <input type="radio" className="hidden" checked={paymentMethod === 'wechat'} onChange={() => setPaymentMethod('wechat')} />
                </label>
                <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'card' ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-500/10' : 'border-slate-200 dark:border-white/10 hover:border-blue-300'
                }`}>
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-slate-100 dark:bg-[#1e1e1e] rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300">
                       <CreditCard className="w-5 h-5" />
                     </div>
                     <div>
                       <div className="font-semibold text-slate-800 dark:text-white">国际信用卡 (Stripe)</div>
                       <div className="text-xs text-slate-500">支持 Visa, Mastercard 等</div>
                     </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-blue-500' : 'border-slate-300'}`}>
                    {paymentMethod === 'card' && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>}
                  </div>
                  <input type="radio" className="hidden" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                </label>
             </div>
          </div>
        </div>

        <div className="col-span-1">
          <div className="bg-white dark:bg-[#252525] rounded-2xl border border-slate-200 dark:border-white/5 p-6 shadow-sm sticky top-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6">充值确认</h2>
            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span>充值金额</span>
                <span className="font-semibold text-slate-800 dark:text-white">¥{formatMoneyAmount(currentSelectionAmount)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span>基础兑换 (1:{EXCHANGE_RATE})</span>
                <span className="font-mono">{pointsForAmount(currentSelectionAmount)} Credits</span>
              </div>
              {bonus > 0 && (
                <div className="flex justify-between items-center text-rose-500">
                  <span>活动赠送</span>
                  <span className="font-mono">+{bonus} Credits</span>
                </div>
              )}
              <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex justify-between items-center">
                <span className="font-bold text-slate-800 dark:text-white">实际到账余额</span>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 font-mono">
                  <Zap className="w-4 h-4" />
                  {creditsReceived.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-[#1e1e1e] rounded-xl p-4 mb-6 text-xs text-slate-500 flex gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-blue-500" />
              <p>充值后不支持退款，虚拟余额不设过期时间。发票将在消费后自动生成。</p>
            </div>

            {successMsg && (
              <div className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-3 rounded-xl flex items-start gap-2 text-sm font-medium border border-emerald-200 dark:border-emerald-500/20 mb-6">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {submitError && (
              <div role="alert" className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-3 rounded-xl flex items-start gap-2 text-sm font-medium border border-red-200 dark:border-red-500/20 mb-6">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <button
              disabled={currentSelectionCents <= 0 || isSubmitting}
              onClick={handlePay}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                currentSelectionCents > 0 && !isSubmitting
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {isSubmitting ? '支付中...' : `立刻支付 ¥${formatMoneyAmount(currentSelectionAmount)}`}
              {!isSubmitting && <ChevronRight className="w-5 h-5" />}
            </button>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
              <ShieldCheck className="w-4 h-4" /> 支付环境安全加密
            </div>
          </div>
        </div>
      </div>
    </div>
  );
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
  const cents = moneyCents(amount);
  return cents > 0 ? Math.max(1, Math.floor((cents + 5) / 10)) : 0;
}

function formatMoneyAmount(amount: string): string {
  const cents = moneyCents(amount);
  const whole = Math.floor(cents / 100);
  const fraction = String(cents % 100).padStart(2, '0');
  return `${whole}.${fraction}`;
}
