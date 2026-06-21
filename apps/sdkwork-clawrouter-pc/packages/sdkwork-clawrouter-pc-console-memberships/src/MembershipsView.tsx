import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BusinessStatePanel } from '@sdkwork/clawrouter-pc-commons';
import { MembershipService } from './membershipService';

export function MembershipsView() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadOverview = useCallback(async (isActive: () => boolean = () => true) => {
    setLoading(true);
    setLoadError(null);
    try {
      await MembershipService.fetchOverview();
      if (!isActive()) {
        return;
      }
    } catch (error) {
      if (isActive()) {
        setLoadError(error instanceof Error && error.message ? error.message : t('console.memberships.states.loadErrorFallback', 'Membership overview could not be loaded.'));
      }
    } finally {
      if (isActive()) {
        setLoading(false);
      }
    }
  }, [t]);

  useEffect(() => {
    let active = true;
    void loadOverview(() => active);
    return () => {
      active = false;
    };
  }, [loadOverview]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-72px)] w-full bg-slate-50 p-[5px] dark:bg-[#121212]">
        <BusinessStatePanel kind="loading" title={t('console.memberships.states.loading', 'Loading memberships...')} />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-[calc(100vh-72px)] w-full bg-slate-50 p-[5px] dark:bg-[#121212]">
        <BusinessStatePanel kind="error" title={loadError} onRetry={() => void loadOverview()} retryLabel={t('commons.actions.retry', 'Retry')} />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-72px)] w-full bg-slate-50 p-[5px] dark:bg-[#121212]">
      <BusinessStatePanel kind="empty" title={t('console.memberships.states.emptyTitle', 'Choose a membership package to get started.')} />
    </div>
  );
}
