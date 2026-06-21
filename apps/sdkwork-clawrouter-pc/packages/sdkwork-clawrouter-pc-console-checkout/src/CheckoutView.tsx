import React from 'react';
import { useTranslation } from 'react-i18next';
import { BusinessStatePanel } from '@sdkwork/clawrouter-pc-commons';

export function CheckoutView() {
  const { t } = useTranslation();

  return (
    <div className="min-h-[calc(100vh-72px)] w-full bg-slate-50 p-[5px] dark:bg-[#121212]">
      <BusinessStatePanel kind="empty" title={t('console.billing.checkoutview.states.emptyTitle', 'No checkout session is active.')} />
    </div>
  );
}
