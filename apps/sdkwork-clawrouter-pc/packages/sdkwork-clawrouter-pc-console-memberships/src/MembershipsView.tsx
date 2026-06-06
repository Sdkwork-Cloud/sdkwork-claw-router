import React, { useCallback, useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Gift,
  Loader2,
  ShieldCheck,
  Sparkles,
  WalletCards,
  Zap,
} from 'lucide-react';
import { BusinessStatePanel } from 'sdkwork-clawrouter-pc-commons';
import { useTranslation } from 'react-i18next';
import {
  MembershipService,
  type MembershipBenefit,
  type MembershipOverview,
  type MembershipPackage,
} from './membershipService';

type TranslationFunction = ReturnType<typeof useTranslation>['t'];
type MembershipActionState =
  | { type: 'dailyReward' }
  | { type: 'speedUp' }
  | { type: 'purchase'; packageId: string }
  | null;
type EntitlementAccessStatus = 'included' | 'inactive' | 'unavailable';
type EntitlementRow = {
  accessStatus: EntitlementAccessStatus;
  benefit: MembershipBenefit;
  period: string;
  quota: string;
};
type EntitlementAccessCounts = Record<EntitlementAccessStatus, number>;

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
  const [overview, setOverview] = useState<MembershipOverview | null>(null);
  const [purchasePackages, setPurchasePackages] = useState<MembershipPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionState, setActionState] = useState<MembershipActionState>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');
  const [actionErrorMsg, setActionErrorMsg] = useState('');

  const loadMemberships = useCallback(async (isActive: () => boolean = () => true) => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const [nextOverview, nextSummary, nextPackages] = await Promise.all([
        MembershipService.fetchMembershipOverview(),
        MembershipService.fetchMembershipSummary().catch(() => null),
        MembershipService.fetchMembershipPackages().catch(() => []),
      ]);
      if (!isActive()) {
        return;
      }
      setOverview({
        ...nextOverview,
        summary: nextOverview.summary ?? nextSummary,
      });
      setPurchasePackages(
        nextPackages.length > 0
          ? nextPackages
          : collectMembershipPackages(nextOverview),
      );
    } catch (error) {
      if (isActive()) {
        setOverview(null);
        setPurchasePackages([]);
        setLoadError(getMembershipErrorMessage(error, t('console.memberships.errors.overviewFallback', 'Membership center could not be loaded.'), t));
      }
    } finally {
      if (isActive()) {
        setIsLoading(false);
      }
    }
  }, [t]);

  useEffect(() => {
    let active = true;
    void loadMemberships(() => active);
    return () => {
      active = false;
    };
  }, [loadMemberships]);

  const refreshMembershipsAfterAction = useCallback(async () => {
    await loadMemberships();
  }, [loadMemberships]);

  const handleMembershipPurchase = async (membershipPackage: MembershipPackage) => {
    if (!membershipPackage.isPurchasable || actionState !== null) {
      return;
    }
    setActionState({ type: 'purchase', packageId: membershipPackage.id });
    setActionSuccessMsg('');
    setActionErrorMsg('');
    try {
      const result = await MembershipService.purchaseMembership(membershipPackage.id);
      setActionSuccessMsg(t('console.memberships.success.purchase', 'Membership purchase submitted. Request: {{requestNo}}', { requestNo: result.requestNo }));
      await refreshMembershipsAfterAction();
    } catch (error) {
      setActionErrorMsg(getMembershipErrorMessage(error, t('console.memberships.errors.purchaseFallback', 'Membership purchase could not be submitted.'), t));
    } finally {
      setActionState(null);
    }
  };

  const handleDailyReward = async () => {
    if (!overview?.dailyReward.available) {
      return;
    }
    setActionState({ type: 'dailyReward' });
    setActionSuccessMsg('');
    setActionErrorMsg('');
    try {
      const result = await MembershipService.claimDailyReward();
      setActionSuccessMsg(t('console.memberships.success.dailyReward', 'Daily reward claimed. Request: {{requestNo}}', { requestNo: result.requestNo }));
      await refreshMembershipsAfterAction();
    } catch (error) {
      setActionErrorMsg(getMembershipErrorMessage(error, t('console.memberships.errors.dailyRewardFallback', 'Daily reward could not be claimed.'), t));
    } finally {
      setActionState(null);
    }
  };

  const handleSpeedUp = async () => {
    if (!overview?.privilegeUsage.speedUpAvailable) {
      return;
    }
    setActionState({ type: 'speedUp' });
    setActionSuccessMsg('');
    setActionErrorMsg('');
    try {
      const result = await MembershipService.activateSpeedUp();
      setActionSuccessMsg(t('console.memberships.success.speedUp', 'Speed-up activated. Request: {{requestNo}}', { requestNo: result.requestNo }));
      await refreshMembershipsAfterAction();
    } catch (error) {
      setActionErrorMsg(getMembershipErrorMessage(error, t('console.memberships.errors.speedUpFallback', 'Speed-up could not be activated.'), t));
    } finally {
      setActionState(null);
    }
  };

  return (
    <div
      data-business-state={loadError ? 'error' : undefined}
      className="min-h-[calc(100vh-72px)] w-full box-border bg-slate-50 p-[5px] animate-in fade-in duration-500 dark:bg-[#121212]"
    >
      <div className="w-full min-w-0 space-y-6">
        {isLoading ? (
          <BusinessStatePanel
            kind="loading"
            title={t('console.memberships.loading', 'Loading membership center...')}
            className="min-h-96 rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#252525]"
          />
        ) : loadError ? (
          <BusinessStatePanel
            kind="error"
            title={t('console.memberships.loadFailed', 'Membership center failed to load')}
            description={loadError}
            onRetry={() => { void loadMemberships(); }}
            className="min-h-96 rounded-xl border border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-500/10"
          />
        ) : overview ? (
          <>
            <MembershipStatusHero
              packageCount={purchasePackages.length}
              overview={overview}
              t={t}
            />

            {(actionSuccessMsg || actionErrorMsg) ? (
              <div className="grid gap-3 lg:grid-cols-2">
                {actionSuccessMsg ? <InlineNotice kind="success" message={actionSuccessMsg} /> : null}
                {actionErrorMsg ? <InlineNotice kind="error" message={actionErrorMsg} /> : null}
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
              <div className="min-w-0 space-y-6">
                <MembershipPurchasePanel
                  actionState={actionState}
                  onPurchase={handleMembershipPurchase}
                  packages={purchasePackages}
                  t={t}
                />
                <EntitlementOverviewPanel overview={overview} t={t} />
              </div>

              <div className="min-w-0 space-y-6">
                <UsageSnapshotPanel
                  actionState={actionState}
                  onDailyReward={handleDailyReward}
                  onSpeedUp={handleSpeedUp}
                  overview={overview}
                  t={t}
                />
                <PointsHistoryPanel overview={overview} t={t} />
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

function MembershipStatusHero({
  overview,
  packageCount,
  t,
}: {
  overview: MembershipOverview;
  packageCount: number;
  t: TranslationFunction;
}) {
  const summary = overview.summary;
  const active = hasActiveMembership(overview);
  const planLabel = summary
    ? (summary.planName || t('console.memberships.current.planId', 'Plan {{planId}}', { planId: summary.planId }))
    : t('console.memberships.current.noActive', 'No active membership');

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-white/5 dark:bg-[#252525]">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
        <div className="p-5 lg:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase text-lobster-600 dark:text-lobster-300">
                {t('console.memberships.dashboard.heroEyebrow', 'Membership profile')}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white lg:text-3xl">
                  {planLabel}
                </h2>
                <StatusBadge active={active} status={summary?.status ?? 'inactive'} t={t} />
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {summary
                  ? t('console.memberships.dashboard.activeDescription', 'Your membership benefits are attached to this account and settle through the unified commerce center.')
                  : t('console.memberships.dashboard.noActiveDescription', 'Choose a server-configured package and activate membership benefits.')}
              </p>
            </div>
            <div className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
              <ArrowUpRight className="h-4 w-4" />
              {t('console.memberships.dashboard.packageOptions', '{{count}} package options', { count: packageCount })}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
            <MetricTile
              icon={<BadgeCheck className="h-4 w-4" />}
              label={t('console.memberships.fields.membershipNo', 'Membership No.')}
              value={summary?.membershipNo ?? '-'}
            />
            <MetricTile
              icon={<CalendarDays className="h-4 w-4" />}
              label={t('console.memberships.fields.expiresAt', 'Expires at')}
              value={formatMembershipLocalTime(summary?.expiresAt)}
            />
            <MetricTile
              icon={<Sparkles className="h-4 w-4" />}
              label={t('console.memberships.dashboard.pointsBalance', 'Points balance')}
              value={overview.pointsBalance.balance.toLocaleString('en-US')}
            />
          </div>
        </div>

        <div className="border-t border-slate-200 bg-slate-50 p-5 dark:border-white/5 dark:bg-[#1e1e1e] lg:border-l lg:border-t-0">
          <div className="grid h-full content-between gap-5">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                {t('console.memberships.dashboard.assetSnapshot', 'Asset snapshot')}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <CompactStat
                  label={t('console.memberships.dashboard.benefitsCount', 'Benefits')}
                  value={overview.benefits.length.toLocaleString('en-US')}
                />
                <CompactStat
                  label={t('console.memberships.dashboard.usageRecords', 'Usage records')}
                  value={overview.privilegeUsage.items.length.toLocaleString('en-US')}
                />
              </div>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
              <div className="flex items-center gap-2 text-sm font-bold">
                <ShieldCheck className="h-4 w-4" />
                {active
                  ? t('console.memberships.dashboard.activePlan', 'Membership protection is active')
                  : t('console.memberships.dashboard.noActiveTitle', 'Membership is not active')}
              </div>
              <p className="mt-2 text-xs leading-5">
                {active
                  ? t('console.memberships.current.activeHint', 'Membership privileges are active for the current account.')
                  : t('console.memberships.current.emptyHint', 'Choose a membership package to activate the current account.')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MembershipPurchasePanel({
  actionState,
  onPurchase,
  packages,
  t,
}: {
  actionState: MembershipActionState;
  onPurchase: (membershipPackage: MembershipPackage) => void;
  packages: MembershipPackage[];
  t: TranslationFunction;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/5 dark:bg-[#252525]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <WalletCards className="h-4 w-4 text-lobster-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t('console.memberships.packageGroups.title', 'Membership packages')}
            </h2>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t('console.memberships.packageGroups.description', 'Packages are loaded from the server-side membership configuration.')}
          </p>
        </div>
        <span className="inline-flex w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
          {t('console.memberships.packages.packageCount', '{{count}} options', { count: packages.length })}
        </span>
      </div>

      {packages.length === 0 ? (
        <BusinessStatePanel
          kind="empty"
          title={t('console.memberships.packageGroups.empty', 'No membership packages')}
          description={t('console.memberships.packageGroups.emptyHint', 'Membership packages are managed by the admin membership center.')}
          className="mt-5 min-h-40 rounded-xl border border-dashed border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-[#1e1e1e]"
        />
      ) : (
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {packages.slice(0, 4).map((membershipPackage) => (
            <MembershipPurchaseOption
              key={membershipPackage.id}
              actionState={actionState}
              membershipPackage={membershipPackage}
              onPurchase={onPurchase}
              t={t}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function MembershipPurchaseOption({
  actionState,
  membershipPackage,
  onPurchase,
  t,
}: {
  actionState: MembershipActionState;
  membershipPackage: MembershipPackage;
  onPurchase: (membershipPackage: MembershipPackage) => void;
  t: TranslationFunction;
}) {
  const processing = actionState?.type === 'purchase' && actionState.packageId === membershipPackage.id;
  const disabled = !membershipPackage.isPurchasable || actionState !== null;

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-[#1e1e1e]">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-bold text-slate-900 dark:text-white" title={membershipPackage.planName}>
            {membershipPackage.planName}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>{t('console.memberships.package.durationDays', '{{days}} days', { days: membershipPackage.durationDays })}</span>
            <span>{formatRecurrenceCycle(membershipPackage.recurrenceCycle, t)}</span>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="font-mono text-sm font-bold text-slate-900 dark:text-white">
            {membershipPackage.currencyCode} {membershipPackage.priceAmount}
          </div>
          <StatusBadge compact active={normalizeStatus(membershipPackage.status) === 'active'} status={membershipPackage.status} t={t} />
        </div>
      </div>
      <button
        className="mt-4 inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 text-xs font-bold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        disabled={disabled}
        onClick={() => onPurchase(membershipPackage)}
        type="button"
      >
        {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUpRight className="h-4 w-4" />}
        {processing
          ? t('console.memberships.actions.processing', 'Submitting...')
          : t('console.memberships.actions.purchase', 'Purchase membership')}
      </button>
    </div>
  );
}

function EntitlementOverviewPanel({ overview, t }: { overview: MembershipOverview; t: TranslationFunction }) {
  const entitlementRows = overview.benefits.map((benefit): EntitlementRow => ({
    accessStatus: getEntitlementAccessStatus(benefit, overview),
    benefit,
    period: formatEntitlementPeriod(benefit),
    quota: benefit.quotaAmount || '-',
  }));
  const entitlementAccessCounts = calculateEntitlementAccessCounts(entitlementRows);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/5 dark:bg-[#252525]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-lobster-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t('console.memberships.entitlements.includedTitle', 'Included member benefits')}
            </h2>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t('console.memberships.entitlements.description', 'Benefits come from the server-side membership entitlement configuration.')}
          </p>
        </div>
        <span className="inline-flex w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
          {t('console.memberships.entitlements.total', '{{count}} configured', { count: entitlementRows.length })}
        </span>
      </div>

      {entitlementRows.length === 0 ? (
        <BusinessStatePanel
          kind="empty"
          title={t('console.memberships.benefits.empty', 'No membership benefits configured')}
          description={t('console.memberships.entitlements.emptyHint', 'After admin configures entitlements, active members will see quotas here.')}
          className="mt-5 min-h-48 rounded-xl border border-dashed border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-[#1e1e1e]"
        />
      ) : (
        <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#1e1e1e]">
          <EntitlementStatusSummary
            counts={entitlementAccessCounts}
            t={t}
            total={entitlementRows.length}
          />

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] table-fixed border-collapse">
              <colgroup>
                <col className="w-[42%]" />
                <col className="w-[18%]" />
                <col className="w-[20%]" />
                <col className="w-[20%]" />
              </colgroup>
              <thead>
                <tr className="border-y border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500 dark:border-white/10 dark:bg-[#202020] dark:text-slate-400">
                  <th className="px-4 py-3">{t('console.memberships.entitlements.tableHeaderBenefit', 'Benefit')}</th>
                  <th className="px-4 py-3">{t('console.memberships.entitlements.tableHeaderQuota', 'Quota')}</th>
                  <th className="px-4 py-3">{t('console.memberships.entitlements.tableHeaderPeriod', 'Period')}</th>
                  <th className="px-4 py-3">{t('console.memberships.entitlements.tableHeaderAccess', 'Access')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                {entitlementRows.map((row) => (
                  <tr
                    key={row.benefit.code}
                    className="transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                  >
                    <td className="px-4 py-4 align-middle">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-lobster-100 bg-lobster-50 text-lobster-600 dark:border-lobster-500/20 dark:bg-lobster-500/10 dark:text-lobster-300">
                          <ShieldCheck className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-bold text-slate-900 dark:text-white" title={row.benefit.name}>
                            {row.benefit.name}
                          </div>
                          <div className="mt-1 truncate font-mono text-xs text-slate-500 dark:text-slate-400" title={row.benefit.code}>
                            {row.benefit.code}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 align-middle">
                      <EntitlementValueText value={row.quota} />
                    </td>
                    <td className="px-4 py-4 align-middle">
                      <EntitlementValueText value={row.period} />
                    </td>
                    <td className="px-4 py-4 align-middle">
                      <EntitlementAccessBadge status={row.accessStatus} t={t} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}

function EntitlementStatusSummary({
  counts,
  t,
  total,
}: {
  counts: EntitlementAccessCounts;
  t: TranslationFunction;
  total: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-px bg-slate-200 dark:bg-white/10 sm:grid-cols-4">
      <EntitlementSummaryCell
        label={t('console.memberships.entitlements.total', '{{count}} configured', { count: total })}
        tone="neutral"
        value={total.toLocaleString('en-US')}
      />
      <EntitlementSummaryCell
        label={t('console.memberships.entitlements.accessIncluded', 'Included')}
        tone="success"
        value={counts.included.toLocaleString('en-US')}
      />
      <EntitlementSummaryCell
        label={t('console.memberships.entitlements.accessInactive', 'Activate membership')}
        tone="warning"
        value={counts.inactive.toLocaleString('en-US')}
      />
      <EntitlementSummaryCell
        label={t('console.memberships.entitlements.accessUnavailable', 'Unavailable')}
        tone="muted"
        value={counts.unavailable.toLocaleString('en-US')}
      />
    </div>
  );
}

function EntitlementSummaryCell({
  label,
  tone,
  value,
}: {
  label: string;
  tone: 'muted' | 'neutral' | 'success' | 'warning';
  value: string;
}) {
  const toneClassName = {
    muted: 'text-slate-500 dark:text-slate-400',
    neutral: 'text-slate-900 dark:text-white',
    success: 'text-emerald-700 dark:text-emerald-300',
    warning: 'text-amber-700 dark:text-amber-300',
  }[tone];

  return (
    <div className="min-w-0 bg-white px-4 py-3 dark:bg-[#1e1e1e]">
      <div className={`truncate text-lg font-bold ${toneClassName}`} title={value}>
        {value}
      </div>
      <div className="mt-1 truncate text-xs font-medium text-slate-500 dark:text-slate-400" title={label}>
        {label}
      </div>
    </div>
  );
}

function EntitlementValueText({ value }: { value: string }) {
  return (
    <span className="block min-w-0 truncate text-sm font-semibold text-slate-700 dark:text-slate-200" title={value}>
      {value}
    </span>
  );
}

function EntitlementAccessBadge({
  status,
  t,
}: {
  status: EntitlementAccessStatus;
  t: TranslationFunction;
}) {
  const config = {
    included: {
      className: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300',
      icon: CheckCircle2,
      label: t('console.memberships.entitlements.accessIncluded', 'Included'),
    },
    inactive: {
      className: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300',
      icon: Clock3,
      label: t('console.memberships.entitlements.accessInactive', 'Activate membership'),
    },
    unavailable: {
      className: 'border-slate-200 bg-slate-50 text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400',
      icon: AlertCircle,
      label: t('console.memberships.entitlements.accessUnavailable', 'Unavailable'),
    },
  }[status];
  const Icon = config.icon;

  return (
    <span className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${config.className}`}>
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}

function UsageSnapshotPanel({
  actionState,
  onDailyReward,
  onSpeedUp,
  overview,
  t,
}: {
  actionState: MembershipActionState;
  onDailyReward: () => void;
  onSpeedUp: () => void;
  overview: MembershipOverview;
  t: TranslationFunction;
}) {
  const dailyRewardProcessing = actionState?.type === 'dailyReward';
  const speedUpProcessing = actionState?.type === 'speedUp';

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/5 dark:bg-[#252525]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
            {t('console.memberships.usage.title', 'Usage snapshot')}
          </p>
          <h2 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
            {t('console.memberships.points.title', 'Membership points')}
          </h2>
        </div>
        <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
          <WalletCards className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <CompactStat
          label={t('console.memberships.points.balance', 'Available points')}
          value={overview.pointsBalance.balance.toLocaleString('en-US')}
        />
        <CompactStat
          label={t('console.memberships.privileges.speedUps', '{{count}} speed-ups remaining', {
            count: overview.privilegeUsage.speedUpRemaining,
          })}
          value={overview.privilegeUsage.speedUpRemaining.toLocaleString('en-US')}
        />
      </div>

      <div className="mt-5 grid gap-3">
        <ActionRow
          description={overview.dailyReward.available
            ? t('console.memberships.points.rewardAvailable', '{{points}} points available', { points: overview.dailyReward.rewardPoints.toLocaleString('en-US') })
            : t('console.memberships.points.rewardUnavailable', 'No reward available right now')}
          disabled={!overview.dailyReward.available || actionState !== null}
          icon={dailyRewardProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Gift className="h-4 w-4" />}
          onClick={onDailyReward}
          title={t('console.memberships.usage.dailyRewardTitle', 'Daily reward')}
        >
          {dailyRewardProcessing
            ? t('console.memberships.actions.processing', 'Submitting...')
            : t('console.memberships.actions.claimDailyReward', 'Claim')}
        </ActionRow>

        <ActionRow
          description={t('console.memberships.privileges.speedUps', '{{count}} speed-ups remaining', {
            count: overview.privilegeUsage.speedUpRemaining,
          })}
          disabled={!overview.privilegeUsage.speedUpAvailable || actionState !== null}
          icon={speedUpProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
          onClick={onSpeedUp}
          title={t('console.memberships.usage.speedUpTitle', 'Speed-up privilege')}
        >
          {speedUpProcessing
            ? t('console.memberships.actions.processing', 'Submitting...')
            : t('console.memberships.actions.activateSpeedUp', 'Activate speed-up')}
        </ActionRow>
      </div>

      <div className="mt-5 border-t border-slate-200 pt-4 dark:border-white/10">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-sky-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {t('console.memberships.privileges.title', 'Usage privileges')}
          </h3>
        </div>
        <div className="mt-3 space-y-2">
          {overview.privilegeUsage.items.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-200 px-3 py-4 text-center text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
              {t('console.memberships.privileges.empty', 'No privilege usage records')}
            </div>
          ) : overview.privilegeUsage.items.slice(0, 5).map((item) => (
            <div key={item.code} className="rounded-lg bg-slate-50 px-3 py-2 text-xs dark:bg-[#1e1e1e]">
              <div className="flex items-center justify-between gap-3">
                <span className="truncate font-semibold text-slate-700 dark:text-slate-200">{item.name}</span>
                <span className="font-mono text-slate-500 dark:text-slate-400">{item.remaining}</span>
              </div>
              <div className="mt-1 text-slate-500 dark:text-slate-400">
                {t('console.memberships.privileges.usageLine', 'Used {{used}} / {{quota}}', { quota: item.quota, used: item.used })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PointsHistoryPanel({ overview, t }: { overview: MembershipOverview; t: TranslationFunction }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/5 dark:bg-[#252525]">
      <div className="flex items-center gap-2">
        <Clock3 className="h-4 w-4 text-slate-500" />
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
          {t('console.memberships.history.title', 'Recent point records')}
        </h2>
      </div>
      <div className="mt-4 space-y-2">
        {overview.pointsHistory.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 px-3 py-4 text-center text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
            {t('console.memberships.history.empty', 'No point records')}
          </div>
        ) : overview.pointsHistory.slice(0, 5).map((item) => (
          <div key={item.id} className="rounded-lg bg-slate-50 px-3 py-2 text-xs dark:bg-[#1e1e1e]">
            <div className="flex items-center justify-between gap-3">
              <span className="truncate font-semibold text-slate-700 dark:text-slate-200">{item.title}</span>
              <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                {formatPointsAmount(item.amount, t)}
              </span>
            </div>
            <div className="mt-1 font-mono text-slate-500 dark:text-slate-400">{formatMembershipLocalTime(item.occurredAt)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function MetricTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-[#1e1e1e]">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <span className="text-lobster-500 dark:text-lobster-300">{icon}</span>
        {label}
      </div>
      <div className="mt-2 truncate font-mono text-sm font-bold text-slate-900 dark:text-white" title={value}>
        {value}
      </div>
    </div>
  );
}

function CompactStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-[#252525]">
      <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-1 truncate text-sm font-bold text-slate-900 dark:text-white" title={value}>
        {value}
      </div>
    </div>
  );
}

function ActionRow({
  children,
  description,
  disabled,
  icon,
  onClick,
  title,
}: {
  children: React.ReactNode;
  description: string;
  disabled: boolean;
  icon: React.ReactNode;
  onClick: () => void;
  title: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-[#1e1e1e]">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">{title}</div>
          <div className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">{description}</div>
        </div>
        <button
          className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg bg-slate-900 px-3 text-xs font-bold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          disabled={disabled}
          onClick={onClick}
          type="button"
        >
          {icon}
          {children}
        </button>
      </div>
    </div>
  );
}

function StatusBadge({
  active,
  compact = false,
  status,
  t,
}: {
  active: boolean;
  compact?: boolean;
  status: string;
  t: TranslationFunction;
}) {
  return (
    <span className={`inline-flex w-fit items-center rounded-full border font-semibold ${
      compact ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
    } ${
      active
        ? 'border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300'
        : 'border-slate-200 bg-white text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400'
    }`}>
      {formatStatus(status, t)}
    </span>
  );
}

function InlineNotice({ kind, message }: { kind: 'error' | 'success'; message: string }) {
  const Icon = kind === 'success' ? CheckCircle2 : AlertCircle;
  return (
    <div className={`rounded-xl border px-3 py-3 text-sm font-medium ${
      kind === 'success'
        ? 'border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400'
        : 'border-red-200 bg-red-50 text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400'
    }`}>
      <div className="flex items-start gap-2">
        <Icon className="mt-0.5 h-4 w-4 shrink-0" />
        <span>{message}</span>
      </div>
    </div>
  );
}

function hasActiveMembership(overview: MembershipOverview): boolean {
  return Boolean(overview.summary) && normalizeStatus(overview.summary?.status ?? '') === 'active';
}

function isBenefitAvailable(benefit: MembershipBenefit): boolean {
  return ['active', 'available', 'enabled'].includes(normalizeStatus(benefit.status));
}

function getEntitlementAccessStatus(
  benefit: MembershipBenefit,
  overview: MembershipOverview,
): EntitlementAccessStatus {
  if (!isBenefitAvailable(benefit)) {
    return 'unavailable';
  }
  return hasActiveMembership(overview) ? 'included' : 'inactive';
}

function calculateEntitlementAccessCounts(rows: EntitlementRow[]): EntitlementAccessCounts {
  return rows.reduce<EntitlementAccessCounts>(
    (counts, row) => ({
      ...counts,
      [row.accessStatus]: counts[row.accessStatus] + 1,
    }),
    { included: 0, inactive: 0, unavailable: 0 },
  );
}

function formatEntitlementPeriod(benefit: MembershipBenefit): string {
  return benefit.quotaPeriod ?? benefit.resetPolicy ?? '-';
}

function formatStatus(status: string, t: TranslationFunction): string {
  const normalized = normalizeStatus(status) || 'unknown';
  return t(`console.memberships.status.${normalized}`, status || '-');
}

function formatPointsAmount(value: string, t: TranslationFunction): string {
  const normalized = value.trim();
  if (!normalized) {
    return t('console.memberships.points.amount', '{{amount}} pts', { amount: '0' });
  }
  return t('console.memberships.points.amount', '{{amount}} pts', { amount: normalized });
}

function normalizeStatus(value: string): string {
  return value.trim().toLowerCase().replace(/[\s_]+/g, '-');
}

function padDateTimePart(value: number): string {
  return String(value).padStart(2, '0');
}

export function formatMembershipLocalTime(value: string | null | undefined): string {
  const normalized = value?.trim() ?? '';
  if (!normalized) {
    return '-';
  }

  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) {
    return normalized.replace('T', ' ');
  }

  const datePart = [
    date.getFullYear(),
    padDateTimePart(date.getMonth() + 1),
    padDateTimePart(date.getDate()),
  ].join('-');
  const timePart = [
    padDateTimePart(date.getHours()),
    padDateTimePart(date.getMinutes()),
    padDateTimePart(date.getSeconds()),
  ].join(':');

  return `${datePart} ${timePart}`;
}

function collectMembershipPackages(overview: MembershipOverview): MembershipPackage[] {
  const packagesById = new Map<string, MembershipPackage>();
  for (const group of overview.packageGroups) {
    for (const membershipPackage of group.packages) {
      packagesById.set(membershipPackage.id, membershipPackage);
    }
  }
  return [...packagesById.values()];
}

function formatRecurrenceCycle(value: string, t: TranslationFunction): string {
  return t(`console.memberships.recurrence.${normalizeStatus(value)}`, value || '-');
}
