import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshCw, Search, TrendingUp } from 'lucide-react';
import {
  AdminTableShell,
  BusinessStatePanel,
  BusinessStateTableRow,
  CopyButton,
} from 'sdkwork-claw-router-commons';
import { MarketingService, ReferralStat } from './marketingService';

export function MarketingAdmin() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [referralStats, setReferralStats] = useState<ReferralStat[]>([]);

  const loadReferralStats = useCallback(async (isActive: () => boolean = () => true) => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await MarketingService.fetchReferralStats();
      if (isActive()) {
        setReferralStats(data);
      }
    } catch (error) {
      if (isActive()) {
        setReferralStats([]);
        setLoadError(error instanceof Error && error.message ? error.message : t('admin.commerce.marketing.referralStats.errorFallback', 'Referral statistics could not be loaded.'));
      }
    } finally {
      if (isActive()) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let active = true;
    void loadReferralStats(() => active);
    return () => {
      active = false;
    };
  }, [loadReferralStats]);

  const visibleStats = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return referralStats;
    }
    return referralStats.filter((item) => [
      item.id,
      item.inviter,
      item.link,
      item.total_revenue,
      item.bonus_awarded,
    ].some((value) => String(value).toLowerCase().includes(query)));
  }, [referralStats, search]);

  return (
    <div className="flex h-full min-h-0 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#1a1a1a]">
      <main className="flex min-w-0 flex-1 flex-col bg-white dark:bg-[#1a1a1a]">
        <div className="flex shrink-0 flex-col gap-4 border-b border-slate-200 p-5 dark:border-white/10 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-pink-500">
              <TrendingUp className="h-4 w-4" />
              {t('admin.commerce.marketing.title', 'Marketing')}
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{t('admin.commerce.marketing.referralStats.title', 'Referral Stats')}</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {t('admin.commerce.marketing.referralStats.desc', 'Invite links, successful invitations, revenue contribution, and awarded bonuses.')}
            </p>
          </div>
          <div className="flex w-full gap-3 md:w-auto">
            <div className="relative min-w-0 flex-1 md:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-pink-500 dark:border-white/10 dark:bg-[#1e1e1e] dark:text-white"
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t('admin.commerce.marketing.referralStats.searchPlaceholder', 'Search inviter or link')}
                type="text"
                value={search}
              />
            </div>
            <button
              className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
              onClick={() => void loadReferralStats()}
              type="button"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {t('admin.action.reload', 'Reload')}
            </button>
          </div>
        </div>

        {loadError ? (
          <BusinessStatePanel
            className="min-h-[360px]"
            description={loadError}
            kind="error"
            onRetry={() => void loadReferralStats()}
            title={t('admin.commerce.marketing.referralStats.errorTitle', 'Referral statistics could not be loaded')}
          />
        ) : (
          <AdminTableShell className="m-5 mt-4 rounded-xl" viewportProps={{ 'data-admin-marketing-table-viewport': true }}>
            <table className="w-full min-w-[760px] text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500 dark:border-white/10 dark:bg-[#121212] dark:text-slate-400">
                <tr>
                  <th className="px-6 py-4 font-semibold">{t('admin.commerce.marketing.referralStats.col.inviter', 'Inviter')}</th>
                  <th className="px-6 py-4 font-semibold">{t('admin.commerce.marketing.referralStats.col.link', 'Referral Link')}</th>
                  <th className="px-6 py-4 text-right font-semibold">{t('admin.commerce.marketing.referralStats.col.invited', 'Invited')}</th>
                  <th className="px-6 py-4 text-right font-semibold">{t('admin.commerce.marketing.referralStats.col.revenue', 'Revenue')}</th>
                  <th className="px-6 py-4 text-right font-semibold">{t('admin.commerce.marketing.referralStats.col.bonus', 'Bonus')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                {loading ? (
                  <BusinessStateTableRow colSpan={5} kind="loading" title={t('admin.commerce.marketing.referralStats.loading', 'Loading referral statistics...')} />
                ) : visibleStats.length === 0 ? (
                  <BusinessStateTableRow
                    colSpan={5}
                    description={t('admin.commerce.marketing.referralStats.emptyDesc', 'Referral activity appears here after invited users create commercial activity.')}
                    kind="empty"
                    title={t('admin.commerce.marketing.referralStats.empty', 'No referral statistics')}
                  />
                ) : visibleStats.map((item) => (
                  <tr className="transition-colors hover:bg-slate-50 dark:hover:bg-white/5" key={item.id}>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-200">{item.inviter}</td>
                    <td className="max-w-[280px] px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-mono text-xs text-blue-600 dark:text-blue-400" title={item.link}>{item.link}</span>
                        <CopyButton text={item.link} iconClassName="h-3.5 w-3.5" title={t('admin.commerce.marketing.referralStats.copyLink', 'Copy referral link')} />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right tabular-nums">{item.total_invited}</td>
                    <td className="px-6 py-4 text-right font-mono tabular-nums">{item.total_revenue}</td>
                    <td className="px-6 py-4 text-right font-mono tabular-nums text-pink-600 dark:text-pink-400">{item.bonus_awarded}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </AdminTableShell>
        )}
      </main>
    </div>
  );
}
