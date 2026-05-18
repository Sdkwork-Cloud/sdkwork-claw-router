import React, { useCallback, useState, useEffect } from 'react';
import { FileText, Calendar, PieChart, Activity, Filter, ChevronDown, Image as ImageIcon, Video, Music, MessageSquare, Zap, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { BusinessStatePanel } from 'sdkwork-claw-router-commons';
import {
  decimalNumber,
  formatDecimalAmount,
  sumDecimalStrings,
} from 'sdkwork-claw-router-commons/runtime';
import { SettlementsService, SettlementChartData, Bill } from './settlementsService';
import {
  buildSettlementSummary,
  buildSettlementYearOptions,
  getDefaultSettlementYear,
} from './settlementViewModel';

import { useTranslation } from 'react-i18next';
type TranslationFunction = ReturnType<typeof useTranslation>['t'];

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

  const chartDecimalNumber = (value: string) => decimalNumber(value);
  const chartDataForRendering = chartData.map(item => ({
    ...item,
    text: chartDecimalNumber(item.text),
    image: chartDecimalNumber(item.image),
    video: chartDecimalNumber(item.video),
    audio: chartDecimalNumber(item.audio),
    music: chartDecimalNumber(item.music),
  }));
  const formatCurrency = (val: string) => t(
    "console.settlements.settlementsview.text.pointsAmount",
    "{{amount}} 积分",
    { amount: formatDecimalAmount(val, 6) },
  );
  const yearOptions = buildSettlementYearOptions({ selectedYear, bills: settlementBills });
  const annualTotalCost = sumDecimalStrings(settlementBills.map(bill => bill.totalCost), 6);
  const settlementSummary = {
    ...buildSettlementSummary({
      selectedYear,
      chartData,
      bills: settlementBills,
    }),
    annualTotalCost,
  };
  const hasSettlementData = chartData.length > 0 || settlementBills.length > 0;

  return (
    <div className="theme-aware-dark-surface p-4 lg:p-6 w-full mx-auto space-y-6 animate-in fade-in duration-500 min-h-[calc(100vh-72px)] bg-slate-50 dark:bg-[#1e1e1e]">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <FileText className="w-6 h-6 text-lobster-500" />
          <h1 className="text-xl lg:text-2xl font-bold text-white tracking-tight">{t("console.settlements.settlementsview.text.fqxisc", "账单与多模态结算")}</h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#252525] border border-white/5 rounded-lg px-3 py-1.5 shadow-sm">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent text-sm text-slate-300 focus:outline-none cursor-pointer"
            >
              {yearOptions.map(year => (
                <option key={year} value={year}>{year}{t("console.settlements.settlementsview.text.12ywuzu", "年度账单")}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

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
      ) : !hasSettlementData ? (
        <BusinessStatePanel
          kind="empty"
          title={t('console.settlements.states.emptyTitle', '暂无账单报表数据')}
          description={t('console.settlements.states.emptyDescription', '当前年份还没有结算图表或账单记录。')}
          onRetry={() => void loadSettlementDashboard()}
          className="rounded-2xl border border-white/5 bg-[#252525]"
        />
      ) : (
        <>

      {/* Advanced Trend Preview (Modality Focus) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Stats Column */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          {/* Total Spend */}
          <div className="bg-[#252525] border border-white/5 rounded-2xl p-6 relative overflow-hidden shadow-sm flex flex-col justify-center min-h-[160px] group">
            <div className="absolute -right-6 -top-6 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap className="w-32 h-32 text-amber-500" />
            </div>
            <div className="relative z-10">
              <p className="text-sm font-medium text-slate-400 mb-1 flex items-center gap-2">{t("console.settlements.settlementsview.text.75sy32", "今年累计账单总计")}</p>
              <div className="text-4xl font-bold text-white mb-2 tracking-tight flex items-center gap-2">
                {formatCurrency(settlementSummary.annualTotalCost)}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="text-emerald-400 flex items-center font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  <TrendingUp className="w-3 h-3 mr-1" /> {settlementSummary.billCount}
                </span>{t("console.settlements.settlementsview.text.9aqxhh", "笔账单来自结算看板")}</div>
            </div>
          </div>

          {/* Current Month Unbilled */}
          <div className="bg-[#252525] border border-white/5 rounded-2xl p-6 relative overflow-hidden shadow-sm flex flex-col justify-center min-h-[160px] group">
             <div className="absolute -right-6 -top-6 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Calendar className="w-32 h-32 text-white" />
            </div>
            <div className="relative z-10">
              <p className="text-sm font-medium text-slate-400 mb-1 flex items-center gap-2">{t("console.settlements.settlementsview.text.18xl5lh", "当月未出账预估消耗")}</p>
              <div className="text-4xl font-bold text-amber-500 mb-2 tracking-tight">{formatCurrency(settlementSummary.currentMonthUnbilledCost)}</div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                {t("console.settlements.settlementsview.text.1o8o3u3", "结算日期:")}<span className="text-slate-300 font-mono">{settlementSummary.nextSettlementDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Chart Column - Mini Dashboard inside Settlements */}
        <div className="bg-[#252525] border border-white/5 rounded-2xl p-6 shadow-sm lg:col-span-2 relative overflow-hidden">
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-sm font-bold text-white flex items-center gap-2">
               <Activity className="w-4 h-4 text-lobster-500" /> {t("console.settlements.settlementsview.text.1nwe0xs", "本月多模态日均消耗趋势")}</h3>
                             <div className="flex gap-3 text-xs font-medium text-slate-400">
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div>{t("console.settlements.settlementsview.text.rljyf2", "文本")}</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-pink-500"></div>{t("console.dashboard.dashboardview.text.mzatm2", "图像")}</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-500"></div>{t("console.dashboard.dashboardview.text.q79se0", "视频")}</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div>{t("admin.dashboard.index.text.113w1g1", "语音")}</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-sky-500"></div>{t("console.dashboard.dashboardview.text.1focu8m", "音乐")}</span>
             </div>
           </div>

           <div className="h-[220px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={chartDataForRendering} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--theme-aware-chart-grid)" />
                 <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v)=>v} />
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

      {/* Detailed Monthly Bills */}
      <div className="space-y-4 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-white">{t("console.settlements.settlementsview.text.1cxv2g7", "月度账单分析报告")}</h2>
          <span className="text-xs text-slate-500 font-medium bg-white/5 px-2 py-1 rounded">{t("console.settlements.settlementsview.text.ogoiqg", "所有消耗均以积分结算")}</span>
        </div>

        {settlementBills.map((bill) => {
          const isExpanded = expandedBill === bill.id;

          return (
            <div key={bill.id} className="bg-[#252525] border border-white/5 rounded-2xl overflow-hidden shadow-sm transition-all hover:border-white/10">

              {/* Header Row (Clickable) */}
              <div
                className="p-5 sm:p-6 flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center cursor-pointer hover:bg-white/[0.02]"
                onClick={() => setExpandedBill(isExpanded ? null : bill.id)}
              >
                {/* Left: Info */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                    <FileText className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-white tracking-wide">{bill.period}</h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                        bill.status === t("admin.finance.index.text.1wu2z9", "已结清") ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}>
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

                {/* Right: Cost and expand control */}
                <div className="flex items-center justify-between lg:justify-end gap-6 w-full lg:w-auto shrink-0">
                  <div className="text-right">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-0.5">{t("admin.finance.index.text.byap0k", "总金额")}</p>
                    <div className="text-2xl font-bold text-white font-mono">{formatCurrency(bill.totalCost)}</div>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <div className="p-2 text-slate-400 hover:text-white transition-colors bg-white/5 rounded-lg border border-white/5">
                      <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Breakdown */}
              {isExpanded && (
                <div className="border-t border-white/5 bg-[#1e1e1e]/50 p-6">
                  <h4 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-slate-400" /> {t("console.settlements.settlementsview.text.1wmsouy", "API 使用类型费用分布")}</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">

                    {/* Text Models */}
                    <div className="bg-[#252525] border border-white/5 p-5 rounded-xl hover:border-amber-500/30 transition-colors">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                            <MessageSquare className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-slate-200">{t("console.settlements.settlementsview.text.1ljc32i", "文本/LLM")}</span>
                        </div>
                        <span className="font-mono font-bold text-lg text-white">{formatCurrency(bill.breakdown.text.cost)}</span>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between border-b border-white/5 pb-2">
                          <span className="text-sm text-slate-500">{t("console.settlements.settlementsview.text.1mq0pl7", "请求规模")}</span>
                          <span className="text-sm font-mono text-amber-500">{bill.breakdown.text.usage}</span>
                        </div>
                        <div>
                          <span className="text-xs text-slate-500 block mb-2">{t("console.settlements.settlementsview.text.10pwf64", "主要消耗模型")}</span>
                          <div className="flex flex-wrap gap-1.5">
                            {bill.breakdown.text.models.map(m => (
                              <span key={m} className="px-2 py-1 bg-[#1e1e1e] border border-white/10 rounded-md text-[10px] text-slate-300 font-mono">{m}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Image Models */}
                    <div className="bg-[#252525] border border-white/5 p-5 rounded-xl hover:border-pink-500/30 transition-colors">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-500">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-slate-200">{t("console.dashboard.dashboardview.text.k704rx", "图像生成")}</span>
                        </div>
                        <span className="font-mono font-bold text-lg text-white">{formatCurrency(bill.breakdown.image.cost)}</span>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between border-b border-white/5 pb-2">
                          <span className="text-sm text-slate-500">{t("console.settlements.settlementsview.text.17qwce9", "生成规模")}</span>
                          <span className="text-sm font-mono text-pink-500">{bill.breakdown.image.usage}</span>
                        </div>
                        <div>
                          <span className="text-xs text-slate-500 block mb-2">{t("console.settlements.settlementsview.text.10pwf64", "主要消耗模型")}</span>
                          <div className="flex flex-wrap gap-1.5">
                            {bill.breakdown.image.models.map(m => (
                              <span key={m} className="px-2 py-1 bg-[#1e1e1e] border border-white/10 rounded-md text-[10px] text-slate-300 font-mono">{m}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Video Models */}
                    <div className="bg-[#252525] border border-white/5 p-5 rounded-xl hover:border-purple-500/30 transition-colors">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                            <Video className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-slate-200">{t("console.dashboard.dashboardview.text.79ganj", "视频生成")}</span>
                        </div>
                        <span className="font-mono font-bold text-lg text-white">{formatCurrency(bill.breakdown.video.cost)}</span>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between border-b border-white/5 pb-2">
                          <span className="text-sm text-slate-500">{t("console.settlements.settlementsview.text.1zysje", "计算规模")}</span>
                          <span className="text-sm font-mono text-purple-500">{bill.breakdown.video.usage}</span>
                        </div>
                        <div>
                          <span className="text-xs text-slate-500 block mb-2">{t("console.settlements.settlementsview.text.10pwf64", "主要消耗模型")}</span>
                          <div className="flex flex-wrap gap-1.5">
                            {bill.breakdown.video.models.map(m => (
                              <span key={m} className="px-2 py-1 bg-[#1e1e1e] border border-white/10 rounded-md text-[10px] text-slate-300 font-mono">{m}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Audio Models */}
                    <div className="bg-[#252525] border border-white/5 p-5 rounded-xl hover:border-emerald-500/30 transition-colors">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <Music className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-slate-200">{t("console.settlements.settlementsview.text.5vdjtb", "语音识别/合成")}</span>
                        </div>
                        <span className="font-mono font-bold text-lg text-white">{formatCurrency(bill.breakdown.audio.cost)}</span>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between border-b border-white/5 pb-2">
                          <span className="text-sm text-slate-500">{t("console.settlements.settlementsview.text.p9oxe4", "处理时长")}</span>
                          <span className="text-sm font-mono text-emerald-500">{bill.breakdown.audio.usage}</span>
                        </div>
                        <div>
                          <span className="text-xs text-slate-500 block mb-2">{t("console.settlements.settlementsview.text.10pwf64", "主要消耗模型")}</span>
                          <div className="flex flex-wrap gap-1.5">
                            {bill.breakdown.audio.models.map(m => (
                              <span key={m} className="px-2 py-1 bg-[#1e1e1e] border border-white/10 rounded-md text-[10px] text-slate-300 font-mono">{m}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Music Models */}
                    <div className="bg-[#252525] border border-white/5 p-5 rounded-xl hover:border-sky-500/30 transition-colors">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-500">
                            <Music className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-slate-200">{t("console.settlements.settlementsview.text.1rt8tn", "AI音乐生成")}</span>
                        </div>
                        <span className="font-mono font-bold text-lg text-white">{formatCurrency(bill.breakdown.music.cost)}</span>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between border-b border-white/5 pb-2">
                          <span className="text-sm text-slate-500">{t("console.settlements.settlementsview.text.gkai01", "生成时长")}</span>
                          <span className="text-sm font-mono text-sky-500">{bill.breakdown.music.usage}</span>
                        </div>
                        <div>
                          <span className="text-xs text-slate-500 block mb-2">{t("console.settlements.settlementsview.text.10pwf64", "主要消耗模型")}</span>
                          <div className="flex flex-wrap gap-1.5">
                            {bill.breakdown.music.models.map(m => (
                              <span key={m} className="px-2 py-1 bg-[#1e1e1e] border border-white/10 rounded-md text-[10px] text-slate-300 font-mono">{m}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Footer bill notice inside expanded bill */}
                  <div className="mt-6 flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/5">
                     <div className="text-sm text-slate-400">
                       <span className="font-bold text-slate-300">{t("console.settlements.settlementsview.text.1q72xeg", "账单提示：")}</span>{t("console.settlements.settlementsview.text.1rst64x", "此费用明细只显示消耗额，您的最终发票金额可能包含充值折扣或平台补贴。")}</div>
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
