import React, { useCallback, useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Crown, Loader2 } from 'lucide-react';
import { BusinessStatePanel } from 'sdkwork-claw-router-commons';
import { AccountService, type AccountStats } from 'sdkwork-claw-router-console-account';
import { WalletService, type RechargeHistoryItem } from 'sdkwork-claw-router-console-wallet';
import { MembershipService, type MembershipPackage, type MembershipSummary } from './membershipService';

import { useTranslation } from 'react-i18next';
type TranslationFunction = ReturnType<typeof useTranslation>['t'];

function getMembershipErrorMessage(error: unknown, fallback: string, t: TranslationFunction): string {
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

export function MembershipsView() {
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [accountSummary, setAccountSummary] = useState<AccountStats | null>(null);
  const [membershipSummary, setMembershipSummary] = useState<MembershipSummary | null>(null);
  const [membershipPackages, setMembershipPackages] = useState<MembershipPackage[]>([]);
  const [membershipsLoading, setMembershipsLoading] = useState(true);
  const [membershipsLoadError, setMembershipsLoadError] = useState<string | null>(null);
  const [membershipPurchaseSuccessMsg, setMembershipPurchaseSuccessMsg] = useState('');
  const [membershipPurchaseErrorMsg, setMembershipPurchaseErrorMsg] = useState('');
  const [selectedMembershipPackageId, setSelectedMembershipPackageId] = useState<string | null>(null);
  const [rechargeHistory, setRechargeHistory] = useState<RechargeHistoryItem[]>([]);

  const loadAccountSummary = useCallback(async () => {
    try {
      setAccountSummary(await AccountService.fetchAccountDetails());
    } catch {
      setAccountSummary(null);
    }
  }, []);

  const loadHistory = useCallback(async () => {
    try {
      setRechargeHistory(await WalletService.fetchRechargeHistory());
    } catch {
      setRechargeHistory([]);
    }
  }, []);

  const loadMemberships = useCallback(async (isActive: () => boolean = () => true) => {
    setMembershipsLoading(true);
    setMembershipsLoadError(null);
    try {
      const [summary, packages] = await Promise.all([
        MembershipService.fetchMembershipSummary(),
        MembershipService.fetchMembershipPackages(),
      ]);
      if (isActive()) {
        setMembershipSummary(summary);
        setMembershipPackages(packages);
        setSelectedMembershipPackageId((current) => current ?? packages[0]?.id ?? null);
      }
    } catch (error) {
      if (isActive()) {
        setMembershipSummary(null);
        setMembershipPackages([]);
        setMembershipsLoadError(getMembershipErrorMessage(error, t('console.commerce.membershipsLoadError', 'Membership packages could not be loaded'), t));
      }
    } finally {
      if (isActive()) {
        setMembershipsLoading(false);
      }
    }
  }, [t]);

  useEffect(() => {
    let active = true;
    void loadMemberships(() => active);
    void loadAccountSummary();
    void loadHistory();
    return () => {
      active = false;
    };
  }, [loadAccountSummary, loadHistory, loadMemberships]);

  const selectedMembershipPackage = selectedMembershipPackageId
    ? membershipPackages.find(item => item.id === selectedMembershipPackageId)
    : undefined;

  const handleMembershipPurchase = async () => {
    if (!selectedMembershipPackage) return;
    setIsProcessing(true);
    setMembershipPurchaseSuccessMsg('');
    setMembershipPurchaseErrorMsg('');
    try {
      const result = await MembershipService.purchaseMembership(selectedMembershipPackage.id);
      setMembershipPurchaseSuccessMsg(
        t('console.commerce.membershipOrderCreated', 'Membership purchase request created: {{requestNo}}', { requestNo: result.requestNo }),
      );
      await Promise.all([loadMemberships(), loadAccountSummary(), loadHistory()]);
    } catch (error) {
      setMembershipPurchaseErrorMsg(getMembershipErrorMessage(error, t('console.commerce.membershipOrderCreateError', 'Membership purchase could not be created'), t));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      data-business-state={membershipsLoadError ? 'error' : undefined}
      className="p-4 lg:p-6 w-full mx-auto space-y-6 animate-in fade-in duration-500 min-h-[calc(100vh-72px)] bg-slate-50 dark:bg-[#121212]"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-slate-200 dark:border-white/5 pb-4">
        <div className="flex items-center gap-2">
          <Crown className="w-6 h-6 text-lobster-500" />
          <h1 className="text-xl lg:text-2xl font-bold text-slate-800 dark:text-white tracking-tight">{t('console.commerce.membershipTab', 'Membership')}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 md:p-8 space-y-6">
              {membershipsLoading ? (
                <BusinessStatePanel
                  kind="loading"
                  title={t('console.commerce.loadingMemberships', 'Loading membership packages...')}
                  className="min-h-64 rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-[#1e1e1e]"
                />
              ) : membershipsLoadError ? (
                <BusinessStatePanel
                  kind="error"
                  title={t('console.commerce.membershipsLoadFailed', 'Membership packages failed to load')}
                  description={membershipsLoadError}
                  onRetry={() => { void loadMemberships(); }}
                  className="min-h-64 rounded-xl border border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-500/10"
                />
              ) : (
                <>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-[#1e1e1e]">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                          {t('console.commerce.currentMembership', 'Current membership')}
                        </p>
                        <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                          {membershipSummary
                            ? t('console.commerce.membershipPlan', 'Plan {{planId}}', { planId: membershipSummary.planId })
                            : t('console.commerce.noMembership', 'No active membership')}
                        </h3>
                      </div>
                      <span className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                        membershipSummary
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300'
                          : 'border-slate-200 bg-white text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400'
                      }`}>
                        {membershipSummary?.status ?? t('console.commerce.inactiveMembership', 'inactive')}
                      </span>
                    </div>
                    {membershipSummary ? (
                      <div className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                        <MembershipMeta label={t('console.commerce.membershipNo', 'Membership No.')} value={membershipSummary.membershipNo} />
                        <MembershipMeta label={t('console.commerce.startsAt', 'Starts at')} value={membershipSummary.startsAt} />
                        <MembershipMeta label={t('console.commerce.expiresAt', 'Expires at')} value={membershipSummary.expiresAt} />
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                        {t('console.commerce.membershipEmptyHint', 'Choose a membership package to create a standard purchase order.')}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                      {t('console.commerce.selectMembershipPackage', 'Select membership package')}
                    </label>
                    {membershipPackages.length === 0 ? (
                      <BusinessStatePanel
                        kind="empty"
                        title={t('console.commerce.noMembershipPackages', 'No membership packages')}
                        description={t('console.commerce.noMembershipPackagesHint', 'Membership packages are managed by the commerce membership center.')}
                        className="min-h-40 rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-[#1e1e1e]"
                      />
                    ) : (
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {membershipPackages.map(pkg => {
                          const selected = selectedMembershipPackageId === pkg.id;
                          return (
                            <button
                              key={pkg.id}
                              onClick={() => setSelectedMembershipPackageId(pkg.id)}
                              className={`rounded-xl border p-4 text-left transition-all ${
                                selected
                                  ? 'border-lobster-500 bg-lobster-50 text-slate-900 shadow-sm ring-1 ring-lobster-500/50 dark:bg-lobster-500/10 dark:text-white'
                                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100 dark:border-white/10 dark:bg-[#1e1e1e] dark:text-slate-300 dark:hover:border-white/30 dark:hover:bg-[#2a2a2a]'
                              }`}
                              type="button"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-bold">{pkg.packageNo}</p>
                                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    {t('console.commerce.packagePlan', 'Plan {{planId}}', { planId: pkg.planId })}
                                  </p>
                                </div>
                                <span className="shrink-0 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                                  {pkg.status}
                                </span>
                              </div>
                              <div className="mt-4 flex items-end justify-between gap-3">
                                <div>
                                  <span className="text-2xl font-bold">{formatCurrency(pkg.priceAmount, pkg.currencyCode)}</span>
                                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    {pkg.durationDays} {t('console.commerce.days', 'days')} / {pkg.recurrenceCycle}
                                  </p>
                                </div>
                                {selected && <CheckCircle2 className="h-5 w-5 text-lobster-500" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-white/5">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {t('console.commerce.selectedPackage', 'Selected package')}
                      </span>
                      <span className="text-lg font-bold text-slate-800 dark:text-white">
                        {selectedMembershipPackage
                          ? formatCurrency(selectedMembershipPackage.priceAmount, selectedMembershipPackage.currencyCode)
                          : t('console.commerce.notSelected', 'Not selected')}
                      </span>
                    </div>
                    {membershipPurchaseSuccessMsg && (
                      <div className="mb-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-3 rounded-xl flex items-start gap-2 text-sm font-medium border border-emerald-200 dark:border-emerald-500/20">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>{membershipPurchaseSuccessMsg}</span>
                      </div>
                    )}
                    {membershipPurchaseErrorMsg && (
                      <div className="mb-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-3 rounded-xl flex items-start gap-2 text-sm font-medium border border-red-200 dark:border-red-500/20">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>{membershipPurchaseErrorMsg}</span>
                      </div>
                    )}
                    <button
                      onClick={handleMembershipPurchase}
                      disabled={!selectedMembershipPackage || isProcessing}
                      className="w-full bg-lobster-600 hover:bg-lobster-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold transition-colors shadow-sm flex items-center justify-center gap-2 text-sm"
                    >
                      {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Crown className="w-5 h-5" />}
                      {isProcessing ? t('console.commerce.membershipPurchasing', 'Creating purchase request...') : t('console.commerce.purchaseMembership', 'Purchase membership')}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{t('console.commerce.membershipAccountSnapshot', 'Account snapshot')}</p>
            <div className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
              {accountSummary?.availableCredits.toLocaleString('en-US') ?? '-'}
            </div>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {t('console.commerce.availableCredits', 'Available credits')}
            </p>
          </div>
          <div className="bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{t('console.commerce.recentRechargeOrders', 'Recent recharge records')}</p>
            <div className="mt-3 space-y-2">
              {rechargeHistory.slice(0, 4).map(item => (
                <div key={item.id} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 text-xs dark:bg-[#1e1e1e]">
                  <span className="truncate font-mono text-slate-600 dark:text-slate-300">{item.orderNo}</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">{item.amount}</span>
                </div>
              ))}
              {rechargeHistory.length === 0 && (
                <div className="rounded-lg border border-dashed border-slate-200 px-3 py-6 text-center text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
                  {t('console.commerce.noRecentRechargeOrders', 'No recent recharge records')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MembershipMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-[#151515]">
      <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-1 truncate font-mono text-xs font-semibold text-slate-800 dark:text-slate-200" title={value}>
        {value}
      </div>
    </div>
  );
}

function formatCurrency(amount: string, currencyCode: string): string {
  const normalizedCurrency = currencyCode.trim().toUpperCase() || 'USD';
  const normalizedAmount = amount.trim() || '0.00';
  return `${normalizedCurrency} ${normalizedAmount}`;
}
