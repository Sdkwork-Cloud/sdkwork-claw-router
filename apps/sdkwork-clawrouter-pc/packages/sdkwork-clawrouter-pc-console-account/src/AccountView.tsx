import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BusinessStatePanel } from '@sdkwork/clawrouter-pc-commons';
import { AccountService, type AccountStats } from './accountService';

function getLoadErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

export function AccountView() {
  const { t } = useTranslation();
  const [account, setAccount] = useState<AccountStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadAccount = useCallback(async (isActive: () => boolean = () => true) => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await AccountService.fetchAccountDetails();
      if (isActive()) {
        setAccount(data);
      }
    } catch (error) {
      if (isActive()) {
        setLoadError(getLoadErrorMessage(error, t('console.account.states.loadErrorFallback', 'Account summary could not be loaded.')));
      }
    } finally {
      if (isActive()) {
        setLoading(false);
      }
    }
  }, [t]);

  useEffect(() => {
    let active = true;
    void loadAccount(() => active);
    return () => {
      active = false;
    };
  }, [loadAccount]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-72px)] w-full max-w-6xl mx-auto bg-slate-50 p-[5px] dark:bg-[#121212]">
        <BusinessStatePanel kind="loading" title={t('console.account.states.loading', 'Loading account summary...')} />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-[calc(100vh-72px)] w-full max-w-6xl mx-auto bg-slate-50 p-[5px] dark:bg-[#121212]">
        <BusinessStatePanel kind="error" title={loadError} onRetry={() => void loadAccount()} retryLabel={t('commons.actions.retry', 'Retry')} />
      </div>
    );
  }

  if (!account) {
    return (
      <div className="min-h-[calc(100vh-72px)] w-full max-w-6xl mx-auto bg-slate-50 p-[5px] dark:bg-[#121212]">
        <BusinessStatePanel kind="empty" title={t('console.account.states.emptyTitle', 'No account summary available.')} />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-72px)] w-full max-w-6xl mx-auto space-y-6 bg-slate-50 p-[5px] animate-in fade-in duration-500 dark:bg-[#121212]">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#1e1e1e]">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('console.account.accountview.text.email', 'Email')}</p>
            <p className="text-base font-medium text-slate-900 dark:text-white">{account.email}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('console.account.accountview.text.organization', 'Organization')}</p>
            <p className="text-base font-medium text-slate-900 dark:text-white">{account.organization}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('console.account.accountview.text.availableCredits', 'Available credits')}</p>
            <p className="text-base font-medium text-slate-900 dark:text-white">{account.availableCredits}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('console.account.accountview.text.monthlyConsumption', 'Monthly consumption')}</p>
            <p className="text-base font-medium text-slate-900 dark:text-white">{account.monthlyConsumption}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
