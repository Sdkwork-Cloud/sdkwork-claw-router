import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BusinessStatePanel } from '@sdkwork/clawrouter-pc-commons';

type RechargePanelProps = {
  embedded?: boolean;
  showTabs?: boolean;
};

export function RechargePanel({ embedded = false, showTabs = true }: RechargePanelProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'redeem' | 'recharge'>('redeem');

  return (
    <section className={embedded ? 'space-y-4' : 'min-h-[calc(100vh-72px)] w-full bg-slate-50 p-[5px] dark:bg-[#121212]'}>
      {showTabs ? (
        <div className="flex gap-2">
          <button type="button" className={activeTab === 'redeem' ? 'text-lobster-500' : ''} onClick={() => setActiveTab('redeem')}>
            {t('console.recharge.tabs.redeem', '兑换')}
          </button>
          <button type="button" className={activeTab === 'recharge' ? 'text-lobster-500' : ''} onClick={() => setActiveTab('recharge')}>
            {t('console.recharge.tabs.online', '充值')}
          </button>
        </div>
      ) : null}
      <BusinessStatePanel
        kind="empty"
        title={activeTab === 'redeem'
          ? t('console.recharge.states.redeemEmpty', 'Enter a redeem code to exchange credits.')
          : t('console.recharge.states.rechargeEmpty', 'Choose a recharge package to continue.')}
      />
    </section>
  );
}

type RechargeRecordsTabsProps = {
  refreshSignal?: number;
};

export function RechargeRecordsTabs({ refreshSignal = 0 }: RechargeRecordsTabsProps) {
  const { t } = useTranslation();

  return (
    <section key={refreshSignal} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-[#1e1e1e]">
      <BusinessStatePanel kind="empty" title={t('console.recharge.records.empty', 'No recharge records yet.')} />
    </section>
  );
}

export function RechargeView() {
  return <RechargePanel />;
}
