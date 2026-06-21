import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RechargePanel, RechargeRecordsTabs } from '@sdkwork/clawrouter-pc-console-recharge';

export function WalletView() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'redeem' | 'recharge'>('redeem');
  const [recordsRefreshSeed, setRecordsRefreshSeed] = useState(0);

  return (
    <div className="min-h-[calc(100vh-72px)] w-full space-y-[5px] bg-slate-50 p-[5px] dark:bg-[#121212]">
      <div className="flex gap-2 rounded-xl border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-[#1e1e1e]">
        <button
          type="button"
          className={activeTab === 'redeem' ? 'rounded-lg bg-lobster-50 px-3 py-2 text-sm font-medium text-lobster-600 dark:bg-lobster-500/10 dark:text-lobster-300' : 'rounded-lg px-3 py-2 text-sm text-slate-600 dark:text-slate-300'}
          onClick={() => setActiveTab('redeem')}
        >
          {t('console.billing.billingview.text.1iq97ql', '兑换')}
        </button>
        <button
          type="button"
          className={activeTab === 'recharge' ? 'rounded-lg bg-lobster-50 px-3 py-2 text-sm font-medium text-lobster-600 dark:bg-lobster-500/10 dark:text-lobster-300' : 'rounded-lg px-3 py-2 text-sm text-slate-600 dark:text-slate-300'}
          onClick={() => {
            setActiveTab('recharge');
            setRecordsRefreshSeed((value) => value + 1);
          }}
        >
          {t('console.billing.billingview.text.1wlfhep', '充值')}
        </button>
      </div>
      <RechargePanel embedded showTabs={false} />
      <RechargeRecordsTabs refreshSignal={recordsRefreshSeed} />
    </div>
  );
}
