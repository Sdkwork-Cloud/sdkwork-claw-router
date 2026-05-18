import React, { useCallback, useState, useEffect } from 'react';
import { CreditCard, Gift, Wallet, Zap, CheckCircle2, AlertCircle, RefreshCw, Link as LinkIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { BusinessStatePanel, BusinessStateTableRow } from 'sdkwork-claw-router-commons';
import { AccountService, AccountStats } from 'sdkwork-claw-router-console-account';
import { RechargePackage, RechargeService } from 'sdkwork-claw-router-console-recharge';
import { BillingService, RedeemHistoryItem, RechargeHistoryItem } from './billingService';

import { useTranslation } from 'react-i18next';
type TranslationFunction = ReturnType<typeof useTranslation>['t'];

function getBillingErrorMessage(error: unknown, fallback: string, t: TranslationFunction): string {
  if (error instanceof Error) {
    return getBillingMessageText(error.message, fallback, t);
  }
  return fallback;
}

function getBillingMessageText(message: string, fallback: string, t: TranslationFunction): string {
  const normalized = message.trim();
  if (normalized.startsWith('console.')) {
    return t(normalized, fallback);
  }
  return normalized || fallback;
}

export function BillingView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') as 'redeem' | 'recharge' || 'redeem';

  const [activeTab, setActiveTab] = useState<'redeem' | 'recharge'>(initialTab); // Default to redeem or url param

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl === 'recharge' || tabFromUrl === 'redeem') {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const handleTabChange = (tab: 'redeem' | 'recharge') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };
  const [historyTab, setHistoryTab] = useState<'redeem' | 'recharge'>('redeem'); // History tabs
  const [rechargeAmount, setRechargeAmount] = useState<string>('');
  const [redeemCode, setRedeemCode] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [accountSummary, setAccountSummary] = useState<AccountStats | null>(null);
  const [accountLoading, setAccountLoading] = useState(true);
  const [accountLoadError, setAccountLoadError] = useState<string | null>(null);
  const [rechargePackages, setRechargePackages] = useState<RechargePackage[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const [packagesLoadError, setPackagesLoadError] = useState<string | null>(null);
  const [redeemSuccessMsg, setRedeemSuccessMsg] = useState('');
  const [redeemErrorMsg, setRedeemErrorMsg] = useState('');

  const [redeemHistory, setRedeemHistory] = useState<RedeemHistoryItem[]>([]);
  const [rechargeHistory, setRechargeHistory] = useState<RechargeHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historyLoadError, setHistoryLoadError] = useState<string | null>(null);
  const loadError = accountLoadError || historyLoadError || packagesLoadError;

  const loadAccountSummary = useCallback(async (isActive: () => boolean = () => true) => {
    setAccountLoading(true);
    setAccountLoadError(null);
    try {
      const data = await AccountService.fetchAccountDetails();
      if (isActive()) {
        setAccountSummary(data);
      }
    } catch (error) {
      if (isActive()) {
        setAccountSummary(null);
        setAccountLoadError(getBillingErrorMessage(error, t('console.billing.accountLoadError', '账户余额加载失败'), t));
      }
    } finally {
      if (isActive()) {
        setAccountLoading(false);
      }
    }
  }, [t]);

  const loadHistory = useCallback(async (isActive: () => boolean = () => true) => {
    setLoadingHistory(true);
    setHistoryLoadError(null);
    try {
      if (historyTab === 'redeem') {
        const data = await BillingService.fetchRedeemHistory();
        if (isActive()) {
          setRedeemHistory(data);
        }
      } else {
        const data = await BillingService.fetchRechargeHistory();
        if (isActive()) {
          setRechargeHistory(data);
        }
      }
    } catch (error) {
      if (isActive()) {
        setHistoryLoadError(getBillingErrorMessage(error, t('console.billing.historyLoadError', '账单记录加载失败'), t));
        if (historyTab === 'redeem') {
          setRedeemHistory([]);
        } else {
          setRechargeHistory([]);
        }
      }
    } finally {
      if (isActive()) {
        setLoadingHistory(false);
      }
    }
  }, [historyTab, t]);

  const loadRechargePackages = useCallback(async (isActive: () => boolean = () => true) => {
    setPackagesLoading(true);
    setPackagesLoadError(null);
    try {
      const data = await RechargeService.fetchPackages();
      if (isActive()) {
        setRechargePackages(data);
      }
    } catch (error) {
      if (isActive()) {
        setRechargePackages([]);
        setPackagesLoadError(getBillingErrorMessage(error, t('console.billing.packagesLoadError', '充值套餐加载失败'), t));
      }
    } finally {
      if (isActive()) {
        setPackagesLoading(false);
      }
    }
  }, [t]);

  useEffect(() => {
    let active = true;
    void loadHistory(() => active);
    return () => {
      active = false;
    };
  }, [loadHistory]);

  useEffect(() => {
    let active = true;
    void loadAccountSummary(() => active);
    void loadRechargePackages(() => active);
    return () => {
      active = false;
    };
  }, [loadAccountSummary, loadRechargePackages]);

  const availableCredits = accountSummary ? accountSummary.availableCredits : 0;
  const monthlyConsumption = accountSummary ? accountSummary.monthlyConsumption : 0;
  const estDaysRemaining = accountSummary ? accountSummary.estDaysRemaining : 0;

  const selectedPackage = selectedAmount ? rechargePackages.find(item => item.id === selectedAmount) : undefined;
  const currentRechargeAmount = selectedPackage?.rmb || normalizeCustomAmount(rechargeAmount);
  const currentRechargeCents = moneyCents(currentRechargeAmount);

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRechargeAmount(sanitizeMoneyInput(e.target.value));
    setSelectedAmount(null);
  };

  const handlePayment = () => {
    const amount = formatMoneyAmount(currentRechargeAmount);
    if (moneyCents(amount) <= 0) return;

    navigate(`/console/checkout?amount=${encodeURIComponent(amount)}`);
  };

  const handleRedeem = async () => {
    if (!redeemCode.trim()) return;
    setIsProcessing(true);
    setRedeemErrorMsg('');
    setRedeemSuccessMsg('');

    try {
      const res = await BillingService.redeemCode(redeemCode.trim());
      if (res.success) {
        setRedeemSuccessMsg(res.message);
        setRedeemCode('');
        await Promise.all([loadAccountSummary(), loadHistory()]);
      } else {
        setRedeemErrorMsg(getBillingMessageText(res.message, t('console.billing.errors.redeemFallback', '兑换码处理失败。'), t));
      }
    } catch (e) {
      setRedeemErrorMsg(t("console.billing.billingview.text.1o78fak", "兑换出错，请重试"));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      data-business-state={loadError ? 'error' : undefined}
      className="p-4 lg:p-6 w-full mx-auto space-y-6 animate-in fade-in duration-500 min-h-[calc(100vh-72px)] bg-slate-50 dark:bg-[#121212]"
    >

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-slate-200 dark:border-white/5 pb-4">
        <div className="flex items-center gap-2">
          <Wallet className="w-6 h-6 text-lobster-500" />
          <h1 className="text-xl lg:text-2xl font-bold text-slate-800 dark:text-white tracking-tight">{t("console.billing.billingview.text.gd62li", "钱包与充值")}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left Column: Actions */}
        <div className="xl:col-span-2 space-y-6">

          {/* Balance Overview Card */}
          <div className="bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm overflow-hidden relative border-t-4 border-t-lobster-500">
            <div className="absolute right-0 top-0 w-32 h-32 bg-lobster-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

            {accountLoading ? (
              <BusinessStatePanel
                kind="loading"
                title={t('console.billing.loadingBalance', '正在加载账户余额...')}
                className="min-h-32 relative z-10"
              />
            ) : accountLoadError ? (
              <BusinessStatePanel
                kind="error"
                title={t('console.billing.balanceLoadFailed', '账户余额加载失败')}
                description={accountLoadError}
                onRetry={() => { void loadAccountSummary(); }}
                className="min-h-32 relative z-10"
              />
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-2">
                    {t("console.billing.billingview.text.1wg7yq3", "当前可用积分")}</p>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold text-slate-800 dark:text-white tracking-tight">{availableCredits.toLocaleString('en-US')} {t("console.account.accountview.text.1f5u8y0", "积分")}</span>
                    <span className="text-sm text-emerald-500 dark:text-emerald-400 font-medium mb-1.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {t("console.billing.billingview.text.1nfgcpn", "状态正常")}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 bg-slate-50 dark:bg-[#1e1e1e] p-4 rounded-xl border border-slate-200 dark:border-white/5 min-w-[200px]">
                  <div className="flex justify-between items-center text-sm">
                     <span className="text-slate-500 dark:text-slate-400">{t("console.billing.billingview.text.15sx3s4", "本月已消耗")}</span>
                     <span className="text-slate-800 dark:text-white font-medium">{monthlyConsumption.toLocaleString('en-US')} {t("console.account.accountview.text.1f5u8y0", "积分")}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                     <span className="text-slate-500 dark:text-slate-400">{t("console.billing.billingview.text.ys5lbk", "预计可用天数")}</span>
                     <span className="text-slate-800 dark:text-white font-medium">{t("console.billing.billingview.text.19cx4gp", "约")}{estDaysRemaining.toLocaleString('en-US')} {t("console.account.accountview.text.cae2ro", "天")}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Tabs & Content */}
          <div className="bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden flex flex-col">

            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-white/5">
              <button
                onClick={() => handleTabChange('redeem')}
                className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-medium transition-colors border-b-2 relative ${
                  activeTab === 'redeem'
                  ? 'text-slate-800 dark:text-white border-lobster-500 bg-slate-50 dark:bg-white/[0.02]'
                  : 'text-slate-500 dark:text-slate-400 border-transparent hover:bg-slate-50 dark:hover:bg-white/[0.01] hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <Gift className="w-4 h-4" /> {t("console.billing.billingview.text.1iq97ql", "卡密兑换")}</button>
              <button
                onClick={() => handleTabChange('recharge')}
                className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-medium transition-colors border-b-2 relative ${
                  activeTab === 'recharge'
                  ? 'text-slate-800 dark:text-white border-lobster-500 bg-slate-50 dark:bg-white/[0.02]'
                  : 'text-slate-500 dark:text-slate-400 border-transparent hover:bg-slate-50 dark:hover:bg-white/[0.01] hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <CreditCard className="w-4 h-4" /> {t("console.billing.billingview.text.1wlfhep", "在线充值")}</button>
            </div>

            <div className="p-6 md:p-8">
              <AnimatePresence mode="wait">
                {activeTab === 'redeem' ? (
                  <motion.div
                    key="redeem"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4 flex gap-3 text-blue-600 dark:text-blue-400 text-sm shadow-sm md:shadow-none">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <p>
                        {t("console.billing.billingview.text.1p5a2ge", "输入您的兑换码即可为账户补充余额。每个兑换码仅限使用一次。兑换后的余额不支持提取。")}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">{t("console.billing.billingview.text.17khw81", "兑换码")}</label>
                      <input
                        type="text"
                        value={redeemCode}
                        onChange={e => setRedeemCode(e.target.value)}
                        placeholder={t("console.billing.billingview.text.zreqwb", "例如: ABCD-1234-WXYZ-5678")}
                        className="w-full bg-slate-50 dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 px-4 py-3.5 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-lobster-500 focus:ring-2 focus:ring-lobster-500/20 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 font-mono text-center tracking-widest uppercase shadow-sm md:shadow-none"
                      />
                    </div>

                    <div className="pt-4 space-y-4">
                      {redeemSuccessMsg && (
                        <div className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-3 rounded-xl flex items-start gap-2 text-sm font-medium border border-emerald-200 dark:border-emerald-500/20">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                          <span>{redeemSuccessMsg}</span>
                        </div>
                      )}

                      {redeemErrorMsg && (
                        <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-3 rounded-xl flex items-start gap-2 text-sm font-medium border border-red-200 dark:border-red-500/20">
                          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                          <span>{redeemErrorMsg}</span>
                        </div>
                      )}

                      <button
                        onClick={handleRedeem}
                        disabled={!redeemCode || isProcessing}
                        className="w-full bg-lobster-600 hover:bg-lobster-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold transition-colors shadow-md flex items-center justify-center gap-2 text-sm"
                      >
                        {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Gift className="w-5 h-5" />}
                        {isProcessing ? t("console.billing.billingview.text.aac7xl", "兑换中...") : t("console.billing.billingview.text.cl1a9g", "立即兑换")}
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="recharge"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">{t("console.billing.billingview.text.9e2jz7", "选择充值金额 (USD)")}</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {packagesLoading ? (
                          <BusinessStatePanel
                            kind="loading"
                            title={t('console.billing.loadingPackages', '正在加载充值套餐...')}
                            className="col-span-full min-h-32 rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-[#1e1e1e]"
                          />
                        ) : packagesLoadError ? (
                          <BusinessStatePanel
                            kind="error"
                            title={t('console.billing.packagesLoadFailed', '充值套餐加载失败')}
                            description={packagesLoadError}
                            onRetry={() => { void loadRechargePackages(); }}
                            className="col-span-full min-h-32 rounded-xl border border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-500/10"
                          />
                        ) : rechargePackages.length === 0 ? (
                          <BusinessStatePanel
                            kind="empty"
                            title={t('console.billing.noPackages', '暂无充值套餐')}
                            description={t('console.billing.customAmountHint', '可以使用自定义金额创建充值订单。')}
                            className="col-span-full min-h-32 rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-[#1e1e1e]"
                          />
                        ) : rechargePackages.map(pkg => (
                          <button
                            key={pkg.id}
                            onClick={() => { setSelectedAmount(pkg.id); setRechargeAmount(''); }}
                            className={`py-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                              selectedAmount === pkg.id
                              ? 'border-lobster-500 bg-lobster-50 dark:bg-lobster-500/10 text-lobster-600 dark:text-white shadow-sm ring-1 ring-lobster-500/50'
                              : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1e1e1e] text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/30 hover:bg-slate-100 dark:hover:bg-[#2a2a2a]'
                            }`}
                          >
                            <span className="text-xl font-bold">${formatMoneyAmount(pkg.rmb)}</span>
                            <span className="text-xs mt-1 text-slate-500 dark:text-slate-400">{t("console.billing.billingview.text.14l2wpi", "得")}{pkg.points.toLocaleString()} {t("console.account.accountview.text.1f5u8y0", "积分")}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">{t("console.billing.billingview.text.11d44gm", "自定义金额")}</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                        <input
                          type="text"
                          value={rechargeAmount}
                          onChange={handleCustomAmountChange}
                          placeholder={t("console.billing.billingview.text.vlu06j", "输入其他金额")}
                          className="w-full bg-slate-50 dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 pl-8 pr-4 py-3 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-lobster-500 focus:ring-2 focus:ring-lobster-500/20 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium shadow-sm md:shadow-none"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 dark:border-white/5">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{t("console.billing.billingview.text.r4xphg", "获得积分:")}</span>
                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {selectedPackage
                            ? t("console.billing.billingview.text.pointsAmount", "{{points}} 积分", { points: selectedPackage.points.toLocaleString() })
                            : t("console.billing.billingview.text.1jktktr", "创建订单后确认")}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-6">
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{t("console.billing.billingview.text.1wwq5mp", "实际支付金额:")}</span>
                        <span className="text-2xl font-bold text-slate-800 dark:text-white">
                          ${formatMoneyAmount(currentRechargeAmount)}
                        </span>
                      </div>
                      <button
                        onClick={handlePayment}
                        disabled={currentRechargeCents <= 0}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold transition-colors shadow-sm flex items-center justify-center gap-2 text-sm"
                      >
                        {t("console.billing.billingview.text.1iptuc5", "去支付")}</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Column: Promotion */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-slate-50 dark:bg-gradient-to-b dark:from-[#252525] dark:to-[#1e1e1e] border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm flex flex-col overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-lobster-400 to-amber-500 opacity-70"></div>

            <div className="p-6 border-b border-slate-200 dark:border-white/5 relative z-10">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-amber-500 fill-amber-500/20" />
                {t("console.billing.billingview.text.1qywqye", "邀请奖励计划")}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {t("console.billing.billingview.text.ulf9ee", "邀请好友注册并充值，您将获得其充值金额等值积分的")}<span className="text-lobster-500 dark:text-lobster-400 font-bold">10%</span> {t("console.billing.billingview.text.6eqybf", "作为奖励积分。")}</p>
            </div>

            <div className="p-6 space-y-5 relative z-10 flex-1">

              {/* Promo Link */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5" /> {t("console.billing.billingview.text.1qp7wtk", "专属推广链接")}</label>
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-700 shadow-sm dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
                  {t("console.billing.billingview.text.1901jjl", "专属邀请码暂不可用。")}
                </div>
              </div>

              {/* Promo Code */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5" /> {t("console.billing.billingview.text.r36wy8", "专属邀请码")}</label>
                <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-500 shadow-sm dark:border-white/10 dark:bg-[#151515] dark:text-slate-400">
                  {t("console.billing.billingview.text.1om3err", "暂不可用")}</div>
              </div>

              {/* QR Code */}
              <div className="pt-2">
                <div className="border border-slate-200 dark:border-white/10 rounded-xl p-5 bg-white dark:bg-[#151515] flex flex-col items-center justify-center gap-4 shadow-sm dark:shadow-none">
                  <div className="flex h-32 w-32 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 p-3 text-center text-xs font-medium text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                    {t("console.billing.billingview.text.1ch47qi", "二维码暂不可用")}</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Bottom Table: History */}
      <div className="bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden mt-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 p-4 sm:px-6">
           <div className="flex gap-4">
             <button
               onClick={() => setHistoryTab('redeem')}
               className={`text-sm font-medium transition-colors pb-1 border-b-2 ${historyTab === 'redeem' ? 'text-lobster-600 dark:text-white border-lobster-500' : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-800 dark:hover:text-slate-200'}`}
             >
               {t("admin.user.index.text.65nh81", "兑换记录")}</button>
             <button
               onClick={() => setHistoryTab('recharge')}
               className={`text-sm font-medium transition-colors pb-1 border-b-2 ${historyTab === 'recharge' ? 'text-lobster-600 dark:text-white border-lobster-500' : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-800 dark:hover:text-slate-200'}`}
             >
               {t("admin.user.index.text.9z0mxn", "充值记录")}</button>
           </div>
           <button onClick={() => { void loadHistory(); }} disabled={loadingHistory} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors flex items-center gap-1.5 text-xs">
             <RefreshCw className={`w-3.5 h-3.5 ${loadingHistory ? 'animate-spin' : ''}`} /> {t("console.billing.billingview.text.12qo56a", "刷新")}</button>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-[#1e1e1e]/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-white/5 text-xs">
              <tr>
                {historyTab === 'redeem' ? (
                  <>
                    <th className="px-6 py-3 font-medium">{t("console.billing.billingview.text.1j0afxi", "卡密 (Code)")}</th>
                    <th className="px-6 py-3 font-medium">{t("admin.finance.index.text.1jl9r8z", "金额")}</th>
                    <th className="px-6 py-3 font-medium">{t("admin.finance.index.text.1ccx4t4", "状态")}</th>
                    <th className="px-6 py-3 font-medium">{t("admin.marketing.index.text.1k661o0", "兑换时间")}</th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-3 font-medium">{t("console.billing.billingview.text.18930i1", "订单号 (Order No)")}</th>
                    <th className="px-6 py-3 font-medium">{t("admin.finance.index.text.1jl9r8z", "金额")}</th>
                    <th className="px-6 py-3 font-medium">{t("admin.marketing.index.text.igot2y", "支付方式")}</th>
                    <th className="px-6 py-3 font-medium">{t("admin.finance.index.text.1ccx4t4", "状态")}</th>
                    <th className="px-6 py-3 font-medium">{t("console.billing.billingview.text.ma93ti", "充值时间")}</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-300 text-xs">
              {historyTab === 'redeem' ? (
                loadingHistory ? (
                  <BusinessStateTableRow colSpan={4} kind="loading" title={t('console.billing.loadingRedeemHistory', '正在加载兑换记录...')} />
                ) : historyLoadError ? (
                  <BusinessStateTableRow
                    colSpan={4}
                    kind="error"
                    title={t('console.billing.redeemHistoryLoadFailed', '兑换记录加载失败')}
                    description={historyLoadError}
                    onRetry={() => { void loadHistory(); }}
                  />
                ) : redeemHistory.length > 0 ? (
                  redeemHistory.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-3 font-mono text-slate-800 dark:text-slate-300">{item.code}</td>
                      <td className="px-6 py-3 font-medium text-emerald-500 dark:text-emerald-400">+{formatMoneyAmount(item.amount)} USD</td>
                      <td className="px-6 py-3">
                        <span className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 px-2 py-0.5 rounded text-[10px]">
                          {item.status === 'success' ? t("console.billing.billingview.text.11zp40j", "兑换成功") : t("console.billing.billingview.text.12db3qz", "失败")}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-slate-500 dark:text-slate-400">{item.date}</td>
                    </tr>
                  ))
                ) : (
                  <BusinessStateTableRow
                    colSpan={4}
                    kind="empty"
                    title={t('console.billing.noRedeemHistory', '暂无兑换记录')}
                    description={t('console.billing.redeemHistoryHint', '兑换成功后会在这里显示记录。')}
                  />
                )
              ) : (
                loadingHistory ? (
                  <BusinessStateTableRow colSpan={5} kind="loading" title={t('console.billing.loadingRechargeHistory', '正在加载充值记录...')} />
                ) : historyLoadError ? (
                  <BusinessStateTableRow
                    colSpan={5}
                    kind="error"
                    title={t('console.billing.rechargeHistoryLoadFailed', '充值记录加载失败')}
                    description={historyLoadError}
                    onRetry={() => { void loadHistory(); }}
                  />
                ) : rechargeHistory.length > 0 ? (
                  rechargeHistory.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-3 font-mono text-slate-800 dark:text-slate-300">{item.orderNo}</td>
                      <td className="px-6 py-3 font-medium text-emerald-500 dark:text-emerald-400">+{formatMoneyAmount(item.amount)} USD</td>
                      <td className="px-6 py-3">
                        <span className="bg-slate-50 dark:bg-white/5 px-2 py-0.5 rounded border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400">
                          {item.method}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 px-2 py-0.5 rounded text-[10px]">
                          {item.status === 'success' ? t("console.billing.billingview.text.1gjg4cp", "充值成功") : t("console.billing.billingview.text.12db3qz", "失败")}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-slate-500 dark:text-slate-400">{item.date}</td>
                    </tr>
                  ))
                ) : (
                  <BusinessStateTableRow
                    colSpan={5}
                    kind="empty"
                    title={t('console.billing.noRechargeHistory', '暂无充值记录')}
                    description={t('console.billing.rechargeHistoryHint', '充值成功后会在这里显示支付记录。')}
                  />
                )
              )}
            </tbody>
          </table>
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

function formatMoneyAmount(amount: string): string {
  const cents = moneyCents(amount);
  const whole = Math.floor(cents / 100);
  const fraction = String(cents % 100).padStart(2, '0');
  return `${whole}.${fraction}`;
}
