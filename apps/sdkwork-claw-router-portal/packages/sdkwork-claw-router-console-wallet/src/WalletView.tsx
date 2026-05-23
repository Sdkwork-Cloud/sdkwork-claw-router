import React, { useCallback, useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Gift, Link as LinkIcon, RefreshCw, Wallet, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BusinessStatePanel, BusinessStateTableRow } from 'sdkwork-claw-router-commons';
import { AccountService, type AccountStats } from 'sdkwork-claw-router-console-account';
import { RechargePanel } from 'sdkwork-claw-router-console-recharge';
import { WalletService, type RedeemHistoryItem } from './walletService';

import { useTranslation } from 'react-i18next';
type TranslationFunction = ReturnType<typeof useTranslation>['t'];

function getWalletErrorMessage(error: unknown, fallback: string, t: TranslationFunction): string {
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

function getWalletMessageText(message: string, fallback: string, t: TranslationFunction): string {
  const normalized = message.trim();
  if (normalized.startsWith('console.')) {
    return t(normalized, fallback);
  }
  return normalized || fallback;
}

export function WalletView() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'redeem' | 'recharge'>('redeem');
  const [redeemCode, setRedeemCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [accountSummary, setAccountSummary] = useState<AccountStats | null>(null);
  const [accountLoading, setAccountLoading] = useState(true);
  const [accountLoadError, setAccountLoadError] = useState<string | null>(null);
  const [redeemSuccessMsg, setRedeemSuccessMsg] = useState('');
  const [redeemErrorMsg, setRedeemErrorMsg] = useState('');
  const [redeemHistory, setRedeemHistory] = useState<RedeemHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historyLoadError, setHistoryLoadError] = useState<string | null>(null);
  const loadError = accountLoadError || (activeTab === 'redeem' ? historyLoadError : null);

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
        setAccountLoadError(getWalletErrorMessage(error, t('console.billing.accountLoadError', '账户余额加载失败'), t));
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
      const data = await WalletService.fetchRedeemHistory();
      if (isActive()) {
        setRedeemHistory(data);
      }
    } catch (error) {
      if (isActive()) {
        setHistoryLoadError(getWalletErrorMessage(error, t('console.billing.historyLoadError', '账单记录加载失败'), t));
        setRedeemHistory([]);
      }
    } finally {
      if (isActive()) {
        setLoadingHistory(false);
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
    return () => {
      active = false;
    };
  }, [loadAccountSummary]);

  const availableCredits = accountSummary ? accountSummary.availableCredits : 0;
  const monthlyConsumption = accountSummary ? accountSummary.monthlyConsumption : 0;
  const estDaysRemaining = accountSummary ? accountSummary.estDaysRemaining : 0;
  const referralProgramUnavailable = t("console.billing.referralProgramUnavailable", "专属邀请码暂不可用。");

  const handleRedeem = async () => {
    if (!redeemCode.trim()) return;
    setIsProcessing(true);
    setRedeemErrorMsg('');
    setRedeemSuccessMsg('');

    try {
      const res = await WalletService.redeemCode(redeemCode.trim());
      if (res.success) {
        setRedeemSuccessMsg(res.message);
        setRedeemCode('');
        await Promise.all([loadAccountSummary(), loadHistory()]);
      } else {
        setRedeemErrorMsg(getWalletMessageText(res.message, t('console.billing.errors.redeemFallback', '兑换码处理失败。'), t));
      }
    } catch {
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-slate-200 dark:border-white/5 pb-4">
        <div className="flex items-center gap-2">
          <Wallet className="w-6 h-6 text-lobster-500" />
          <h1 className="text-xl lg:text-2xl font-bold text-slate-800 dark:text-white tracking-tight">{t("console.billing.billingview.text.gd62li", "充值兑换")}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
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

          <div className="bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="flex border-b border-slate-200 dark:border-white/5">
              <button
                onClick={() => setActiveTab('redeem')}
                className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-medium transition-colors border-b-2 relative ${
                  activeTab === 'redeem'
                  ? 'text-slate-800 dark:text-white border-lobster-500 bg-slate-50 dark:bg-white/[0.02]'
                  : 'text-slate-500 dark:text-slate-400 border-transparent hover:bg-slate-50 dark:hover:bg-white/[0.01] hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <Gift className="w-4 h-4" /> {t("console.billing.billingview.text.1iq97ql", "兑换")}</button>
              <button
                onClick={() => setActiveTab('recharge')}
                className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-medium transition-colors border-b-2 relative ${
                  activeTab === 'recharge'
                  ? 'text-slate-800 dark:text-white border-lobster-500 bg-slate-50 dark:bg-white/[0.02]'
                  : 'text-slate-500 dark:text-slate-400 border-transparent hover:bg-slate-50 dark:hover:bg-white/[0.01] hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <Wallet className="w-4 h-4" /> {t("console.billing.billingview.text.1wlfhep", "充值")}</button>
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
                        <Gift className="w-5 h-5" />
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
                    className="overflow-hidden"
                  >
                    <RechargePanel embedded showTabs={false} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

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
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5" /> {t("console.billing.billingview.text.1qp7wtk", "专属推广链接")}</label>
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-700 shadow-sm dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
                  {referralProgramUnavailable}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5" /> {t("console.billing.billingview.text.r36wy8", "专属邀请码")}</label>
                <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-500 shadow-sm dark:border-white/10 dark:bg-[#151515] dark:text-slate-400">
                  {t("console.billing.billingview.text.1om3err", "暂不可用")}</div>
              </div>

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

      {activeTab === 'redeem' ? (
        <div className="bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden mt-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 p-4 sm:px-6">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-white">
              {t('console.billing.redeemHistoryTitle', '兑换记录')}
            </h2>
            <button onClick={() => { void loadHistory(); }} disabled={loadingHistory} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors flex items-center gap-1.5 text-xs">
              <RefreshCw className={`w-3.5 h-3.5 ${loadingHistory ? 'animate-spin' : ''}`} /> {t("console.billing.billingview.text.12qo56a", "刷新")}</button>
          </div>

          <RedeemHistoryTable
            loadingHistory={loadingHistory}
            historyLoadError={historyLoadError}
            redeemHistory={redeemHistory}
            loadHistory={loadHistory}
            t={t}
          />
        </div>
      ) : null}
    </div>
  );
}

function RedeemHistoryTable({
  loadingHistory,
  historyLoadError,
  redeemHistory,
  loadHistory,
  t,
}: {
  loadingHistory: boolean;
  historyLoadError: string | null;
  redeemHistory: RedeemHistoryItem[];
  loadHistory: () => Promise<void>;
  t: ReturnType<typeof useTranslation>['t'];
}) {
  return (
    <div className="overflow-x-auto min-h-[300px]">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-slate-50 dark:bg-[#1e1e1e]/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-white/5 text-xs">
          <tr>
            <th className="px-6 py-3 font-medium">{t("console.billing.billingview.text.1j0afxi", "卡密 (Code)")}</th>
            <th className="px-6 py-3 font-medium">{t("admin.finance.index.text.1jl9r8z", "金额")}</th>
            <th className="px-6 py-3 font-medium">{t("admin.finance.index.text.1ccx4t4", "状态")}</th>
            <th className="px-6 py-3 font-medium">{t("admin.marketing.index.text.1k661o0", "兑换时间")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-300 text-xs">
          {loadingHistory ? (
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
          )}
        </tbody>
      </table>
    </div>
  );
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
