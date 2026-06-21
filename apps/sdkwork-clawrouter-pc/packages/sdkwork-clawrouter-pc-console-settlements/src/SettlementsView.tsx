import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BusinessStatePanel } from '@sdkwork/clawrouter-pc-commons';
import { SettlementsService, type Bill, type SettlementChartData } from './settlementsService';

type SettlementDisplayData = {
  bills: Bill[];
  chartData: SettlementChartData[];
  hasSettlementData: boolean;
};

function buildSettlementDisplayData(bills: Bill[], chartData: SettlementChartData[]): SettlementDisplayData {
  return {
    bills,
    chartData,
    hasSettlementData: bills.length > 0 || chartData.length > 0,
  };
}

function isUsingDefaultVisuals(display: SettlementDisplayData): boolean {
  return !display.hasSettlementData;
}

type SettlementYearSelectProps = {
  value: number;
  onChange: (year: number) => void;
};

function SettlementYearSelect({ value, onChange }: SettlementYearSelectProps) {
  const { t } = useTranslation();
  const years = useMemo(() => [value - 1, value, value + 1], [value]);

  return (
    <select
      aria-label={t("console.settlements.settlementsview.text.12ywuzu", "annual bill")}
      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-[#252525]"
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
    >
      {years.map((year) => (
        <option key={year} value={year}>{year}</option>
      ))}
    </select>
  );
}

export function SettlementsView() {
  const { t } = useTranslation();
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [display, setDisplay] = useState<SettlementDisplayData>(() => buildSettlementDisplayData([], []));

  const loadSettlements = useCallback(async (isActive: () => boolean = () => true) => {
    setLoading(true);
    setLoadError(null);
    try {
      const bills = await SettlementsService.fetchBills();
      if (isActive()) {
        setDisplay(buildSettlementDisplayData(bills, []));
      }
    } catch (error) {
      if (isActive()) {
        setLoadError(error instanceof Error && error.message ? error.message : t('console.settlements.states.loadErrorFallback', 'Settlement reports could not be loaded.'));
      }
    } finally {
      if (isActive()) {
        setLoading(false);
      }
    }
  }, [t]);

  useEffect(() => {
    let active = true;
    void loadSettlements(() => active);
    return () => {
      active = false;
    };
  }, [loadSettlements]);

  const usingDefaultVisuals = isUsingDefaultVisuals(display);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-72px)] w-full bg-slate-50 p-[5px] dark:bg-[#121212]">
        <BusinessStatePanel kind="loading" title={t('console.settlements.states.loading', 'Loading settlement reports...')} />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-[calc(100vh-72px)] w-full bg-slate-50 p-[5px] dark:bg-[#121212]">
        <BusinessStatePanel kind="error" title={loadError} onRetry={() => void loadSettlements()} retryLabel={t('commons.actions.retry', 'Retry')} />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-72px)] w-full space-y-[5px] bg-slate-50 p-[5px] dark:bg-[#121212]">
      <BusinessStatePanel
        kind="empty"
        title={usingDefaultVisuals
          ? t('console.settlements.states.defaultVisualTitle', 'Default settlement view')
          : t('console.settlements.states.readyTitle', 'Settlement dashboard')}
        action={<SettlementYearSelect value={year} onChange={setYear} />}
      />
      {display.hasSettlementData ? (
        <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-[#1e1e1e]">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {t('console.settlements.states.summaryCount', '{{count}} bills loaded', { count: display.bills.length })}
          </p>
        </section>
      ) : null}
    </div>
  );
}
