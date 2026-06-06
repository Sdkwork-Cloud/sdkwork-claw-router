import React, { useCallback, useEffect, useState } from 'react';
import { Activity, Calendar, ChevronDown, FileText, Filter, Image as ImageIcon, MessageSquare, Music, PieChart, Sparkles, TrendingUp, Video, Zap } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from 'recharts';
import { BusinessStatePanel } from 'sdkwork-clawrouter-pc-commons';
import {
  decimalNumber,
  formatDecimalAmount,
} from 'sdkwork-clawrouter-pc-commons/runtime';
import { SettlementsService, type Bill, type SettlementChartData } from './settlementsService';
import {
  buildSettlementDisplayData,
  buildSettlementYearOptions,
  getDefaultSettlementYear,
} from './settlementViewModel';

import { useTranslation } from 'react-i18next';
type TranslationFunction = ReturnType<typeof useTranslation>['t'];
const COLLAPSED_SETTLEMENT_BILL_ID = '__collapsed_settlement_bill__';

function getSettlementLoadErrorMessage(error: unknown, fallback: string, t: TranslationFunction): string {
  if (!(error instanceof Error) || !error.message) {
    return fallback;
  }
  return error.message.startsWith('console.') ? t(error.message, fallback) : error.message;
}

export function SettlementsView() {
  const { t } = useTranslation();
  const [selectedYear, setSelectedYear] = useState(() => getDefaultSettlementYear());
  const [expandedBill, setExpandedBill] = useState<string | null>(null);
  const [chartData, setChartData] = useState<SettlementChartData[]>([]);
  const [settlementBills, setSettlementBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadSettlementDashboard = useCallback(async (isActive: () => boolean = () => true) => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await SettlementsService.fetchDashboardData({ year: selectedYear });
      if (isActive()) {
        setChartData(data.chartData);
        setSettlementBills(data.bills);
        setExpandedBill(data.bills[0]?.id ?? null);
      }
    } catch (error) {
      if (isActive()) {
        setChartData([]);
        setSettlementBills([]);
        setExpandedBill(null);
        setLoadError(getSettlementLoadErrorMessage(
          error,
          t('console.settlements.states.loadErrorFallback', '账单报表加载失败。'),
          t,
        ));
      }
    } finally {
      if (isActive()) {
        setLoading(false);
      }
    }
  }, [selectedYear, t]);

  useEffect(() => {
    let active = true;
    void loadSettlementDashboard(() => active);
    return () => {
      active = false;
    };
  }, [loadSettlementDashboard]);

  const settlementDisplayData = buildSettlementDisplayData({
    selectedYear,
    chartData,
    bills: settlementBills,
  });
  const chartDataForRendering = settlementDisplayData.chartData.map(item => ({
    ...item,
    text: decimalNumber(item.text),
    image: decimalNumber(item.image),
    video: decimalNumber(item.video),
    audio: decimalNumber(item.audio),
    music: decimalNumber(item.music),
  }));
  const formatCurrency = (val: string) => t(
    "console.settlements.settlementsview.text.pointsAmount",
    "{{amount}} 积分",
    { amount: formatDecimalAmount(val, 6) },
  );
  const yearOptions = buildSettlementYearOptions({ selectedYear, bills: settlementBills });
  const settlementSummary = settlementDisplayData.summary;
  const billsForRendering = settlementDisplayData.bills;
  const activeExpandedBill = expandedBill ?? (
    settlementDisplayData.isUsingDefaultVisuals
      ? billsForRendering[0]?.id ?? null
      : null
  );

  return (
    <div className="theme-aware-dark-surface w-full mx-auto space-y-6 animate-in fade-in duration-500 min-h-[calc(100vh-72px)] bg-slate-50 p-[5px] dark:bg-[#1e1e1e]">
      {loading ? (
        <BusinessStatePanel
          kind="loading"
          title={t('console.settlements.states.loading', '正在加载账单报表...')}
          description={t('console.settlements.states.loadingDescription', '正在获取结算图表和账单数据。')}
          className="rounded-2xl border border-white/5 bg-[#252525]"
        />
      ) : loadError ? (
        <BusinessStatePanel
          kind="error"
          title={t('console.settlements.states.loadErrorTitle', '账单报表加载失败')}
          description={loadError}
          onRetry={() => void loadSettlementDashboard()}
          className="rounded-2xl border border-white/5 bg-[#252525]"
        />
      ) : (
        <>
          {settlementDisplayData.isUsingDefaultVisuals && (
            <div className="flex flex-col gap-3 rounded-2xl border border-amber-400/15 bg-amber-400/[0.06] px-4 py-3 text-sm text-amber-100 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-amber-300/20 bg-amber-300/10">
                  <Sparkles className="h-4 w-4 text-amber-200" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-amber-50">
                    {t('console.settlements.states.defaultVisualTitle', 'Default settlement view')}
                  </div>
                  <div className="mt-0.5 text-xs leading-5 text-amber-100/75">
                    {t('console.settlements.states.defaultVisualDescription', 'No settlement records were returned for this year, so the dashboard is showing its default visual layout with zero real spend.')}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => void loadSettlementDashboard()}
                className="inline-flex h-8 shrink-0 items-center justify-center rounded-lg border border-amber-300/20 bg-amber-300/10 px-3 text-xs font-semibold text-amber-50 transition-colors hover:bg-amber-300/15"
              >
                {t('common.action.refresh', 'Refresh')}
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="flex flex-col gap-6 lg:col-span-1">
              <SettlementStatCard
                action={<SettlementYearSelect selectedYear={selectedYear} yearOptions={yearOptions} onChange={setSelectedYear} t={t} />}
                icon={<Zap className="w-32 h-32 text-amber-500" />}
                label={t("console.settlements.settlementsview.text.75sy32", "今年累计账单总计")}
                value={formatCurrency(settlementSummary.annualTotalCost)}
                footer={<><TrendingUp className="w-3 h-3 mr-1" /> {settlementSummary.billCount} {t("console.settlements.settlementsview.text.9aqxhh", "笔账单来自结算看板")}</>}
              />
              <SettlementStatCard
                icon={<Calendar className="w-32 h-32 text-white" />}
                label={t("console.settlements.settlementsview.text.18xl5lh", "当月未出账预估消耗")}
                value={formatCurrency(settlementSummary.currentMonthUnbilledCost)}
                valueClassName="text-amber-500"
                footer={<>{t("console.settlements.settlementsview.text.1o8o3u3", "结算日期:")}<span className="text-slate-300 font-mono">{settlementSummary.nextSettlementDate}</span></>}
              />
            </div>

            <div className="bg-[#252525] border border-white/5 rounded-2xl p-6 shadow-sm lg:col-span-2 relative overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-lobster-500" /> {t("console.settlements.settlementsview.text.1nwe0xs", "本月多模态日均消耗趋势")}</h3>
                <div className="hidden gap-3 text-xs font-medium text-slate-400 md:flex">
                  <LegendDot className="bg-amber-500" label={t("console.settlements.settlementsview.text.rljyf2", "文本")} />
                  <LegendDot className="bg-pink-500" label={t("console.dashboard.dashboardview.text.mzatm2", "图像")} />
                  <LegendDot className="bg-purple-500" label={t("console.dashboard.dashboardview.text.q79se0", "视频")} />
                  <LegendDot className="bg-emerald-500" label={t("admin.dashboard.index.text.113w1g1", "语音")} />
                  <LegendDot className="bg-sky-500" label={t("console.dashboard.dashboardview.text.1focu8m", "音乐")} />
                </div>
              </div>

              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartDataForRendering} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--theme-aware-chart-grid)" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => String(v)} />
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: 'var(--theme-aware-tooltip)', border: '1px solid var(--theme-aware-border)', borderRadius: '8px' }}
                      itemStyle={{ fontSize: 12, fontWeight: 500 }}
                      formatter={(value: number) => [formatCurrency(String(value)), '']}
                    />
                    <Area type="monotone" dataKey="music" stackId="1" fill="#0ea5e9" stroke="#0ea5e9" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="audio" stackId="1" fill="#10b981" stroke="#10b981" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="video" stackId="1" fill="#8b5cf6" stroke="#8b5cf6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="image" stackId="1" fill="#ec4899" stroke="#ec4899" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="text" stackId="1" fill="#eab308" stroke="#eab308" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-white">{t("console.settlements.settlementsview.text.1cxv2g7", "月度账单分析报告")}</h2>
              <span className="text-xs text-slate-500 font-medium bg-white/5 px-2 py-1 rounded">{t("console.settlements.settlementsview.text.ogoiqg", "所有消耗均以积分结算")}</span>
            </div>

            {billsForRendering.map((bill) => {
              const isExpanded = activeExpandedBill === bill.id;
              return (
                <div key={bill.id} className="bg-[#252525] border border-white/5 rounded-2xl overflow-hidden shadow-sm transition-all hover:border-white/10">
                  <div
                    className="p-5 sm:p-6 flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center cursor-pointer hover:bg-white/[0.02]"
                    onClick={() => setExpandedBill(isExpanded ? COLLAPSED_SETTLEMENT_BILL_ID : bill.id)}
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                        <FileText className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-bold text-white tracking-wide">{bill.period}</h3>
                          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
                            {bill.status}
                          </span>
                        </div>
                        <div className="text-sm text-slate-400 flex items-center gap-2">
                          <span className="font-mono">{bill.id}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                          <span>{bill.startDate} {t("console.settlements.settlementsview.text.wj6yv6", "至")}{bill.endDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between lg:justify-end gap-6 w-full lg:w-auto shrink-0">
                      <div className="text-right">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-0.5">{t("admin.finance.index.text.byap0k", "总金额")}</p>
                        <div className="text-2xl font-bold text-white font-mono">{formatCurrency(bill.totalCost)}</div>
                      </div>
                      <div className="p-2 text-slate-400 hover:text-white transition-colors bg-white/5 rounded-lg border border-white/5">
                        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-white/5 bg-[#1e1e1e]/50 p-6">
                      <h4 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                        <PieChart className="w-4 h-4 text-slate-400" /> {t("console.settlements.settlementsview.text.1wmsouy", "API 使用类型费用分布")}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        <BreakdownCard icon={<MessageSquare className="w-4 h-4" />} label={t("console.settlements.settlementsview.text.1ljc32i", "文本/LLM")} tone="text-amber-500 bg-amber-500/10" cost={bill.breakdown.text.cost} usage={bill.breakdown.text.usage} models={bill.breakdown.text.models} formatCurrency={formatCurrency} />
                        <BreakdownCard icon={<ImageIcon className="w-4 h-4" />} label={t("console.dashboard.dashboardview.text.k704rx", "图像生成")} tone="text-pink-500 bg-pink-500/10" cost={bill.breakdown.image.cost} usage={bill.breakdown.image.usage} models={bill.breakdown.image.models} formatCurrency={formatCurrency} />
                        <BreakdownCard icon={<Video className="w-4 h-4" />} label={t("console.dashboard.dashboardview.text.79ganj", "视频生成")} tone="text-purple-500 bg-purple-500/10" cost={bill.breakdown.video.cost} usage={bill.breakdown.video.usage} models={bill.breakdown.video.models} formatCurrency={formatCurrency} />
                        <BreakdownCard icon={<Music className="w-4 h-4" />} label={t("console.settlements.settlementsview.text.5vdjtb", "语音识别/合成")} tone="text-emerald-500 bg-emerald-500/10" cost={bill.breakdown.audio.cost} usage={bill.breakdown.audio.usage} models={bill.breakdown.audio.models} formatCurrency={formatCurrency} />
                        <BreakdownCard icon={<Music className="w-4 h-4" />} label={t("console.settlements.settlementsview.text.1rt8tn", "AI音乐生成")} tone="text-sky-500 bg-sky-500/10" cost={bill.breakdown.music.cost} usage={bill.breakdown.music.usage} models={bill.breakdown.music.models} formatCurrency={formatCurrency} />
                      </div>
                      <div className="mt-6 flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/5">
                        <div className="text-sm text-slate-400">
                          <span className="font-bold text-slate-300">{t("console.settlements.settlementsview.text.1q72xeg", "账单提示：")}</span>{t("console.settlements.settlementsview.text.1rst64x", "此费用明细只显示消耗额，您的最终发票金额可能包含充值折扣或平台补贴。")}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function SettlementStatCard({
  action,
  footer,
  icon,
  label,
  value,
  valueClassName = 'text-white',
}: {
  action?: React.ReactNode;
  footer: React.ReactNode;
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="bg-[#252525] border border-white/5 rounded-2xl p-6 relative overflow-hidden shadow-sm flex flex-col justify-center min-h-[160px] group">
      <div className="absolute -right-6 -top-6 p-6 opacity-10 group-hover:opacity-20 transition-opacity">{icon}</div>
      <div className="relative z-10">
        <div className="mb-2 flex items-start justify-between gap-3">
          <p className="flex min-w-0 items-center gap-2 text-sm font-medium text-slate-400">{label}</p>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
        <div className={`text-4xl font-bold mb-2 tracking-tight flex items-center gap-2 ${valueClassName}`}>{value}</div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">{footer}</div>
      </div>
    </div>
  );
}

function SettlementYearSelect({
  onChange,
  selectedYear,
  t,
  yearOptions,
}: {
  onChange: (year: string) => void;
  selectedYear: string;
  t: TranslationFunction;
  yearOptions: string[];
}) {
  return (
    <label className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 text-xs font-medium text-slate-300 shadow-sm">
      <Filter className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
      <span className="sr-only">{t("console.settlements.settlementsview.text.12ywuzu", "年度账单")}</span>
      <select
        aria-label={t("console.settlements.settlementsview.text.12ywuzu", "年度账单")}
        value={selectedYear}
        onChange={(event) => onChange(event.target.value)}
        className="max-w-[5rem] cursor-pointer bg-transparent text-xs font-semibold text-slate-200 outline-none"
      >
        {yearOptions.map(year => (
          <option key={year} value={year} className="bg-[#252525] text-slate-100">{year}</option>
        ))}
      </select>
    </label>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return <span className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${className}`}></span>{label}</span>;
}

function BreakdownCard({
  cost,
  formatCurrency,
  icon,
  label,
  models,
  tone,
  usage,
}: {
  cost: string;
  formatCurrency: (value: string) => string;
  icon: React.ReactNode;
  label: string;
  models: string[];
  tone: string;
  usage: string;
}) {
  return (
    <div className="bg-[#252525] border border-white/5 p-5 rounded-xl hover:border-white/10 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tone}`}>{icon}</div>
          <span className="font-bold text-slate-200">{label}</span>
        </div>
        <span className="font-mono font-bold text-lg text-white">{formatCurrency(cost)}</span>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between border-b border-white/5 pb-2">
          <span className="text-sm text-slate-500">Usage</span>
          <span className="text-sm font-mono text-slate-300">{usage}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {models.length > 0 ? models.map(model => (
            <span key={model} className="px-2 py-1 bg-[#1e1e1e] border border-white/10 rounded-md text-[10px] text-slate-300 font-mono">{model}</span>
          )) : (
            <span className="px-2 py-1 bg-[#1e1e1e] border border-white/10 rounded-md text-[10px] text-slate-500 font-mono">-</span>
          )}
        </div>
      </div>
    </div>
  );
}
