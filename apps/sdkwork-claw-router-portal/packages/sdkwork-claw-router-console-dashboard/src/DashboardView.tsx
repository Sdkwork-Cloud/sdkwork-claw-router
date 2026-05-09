import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Bell,
  Clock,
  Image as ImageIcon,
  PieChart as PieChartIcon,
  RefreshCw,
  TrendingUp,
  Wallet,
  Zap,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BusinessStatePanel } from 'sdkwork-claw-router-commons';

import {
  DashboardService,
  type DashboardTimeRange,
} from './dashboardService';

const SERIES = [
  { key: 'llm (Text)', label: '文本对话', color: '#eab308' },
  { key: 'image (Midjourney/DALL-E)', label: '图像生成', color: '#ec4899' },
  { key: 'video (Runway/Sora)', label: '视频生成', color: '#8b5cf6' },
  { key: 'audio (Whisper)', label: '语音生成', color: '#10b981' },
  { key: 'music (Suno)', label: '音乐生成', color: '#0ea5e9' },
] as const;

const DEFAULT_VISIBLE_SERIES = SERIES.reduce<Record<string, boolean>>((acc, item) => {
  acc[item.label] = true;
  return acc;
}, {});

const TIME_RANGE_LABELS: Record<DashboardTimeRange, string> = {
  hourly: '24 小时',
  daily: '30 天',
  monthly: '12 个月',
  yearly: '3 年',
};

const readOnlyDashboardActions =
  'Read-only dashboard overview. Search, export, download, and shortcut command actions require explicit dashboard command contracts before they can be enabled.';

function getDashboardLoadErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

export function DashboardView() {
  const [metricType, setMetricType] = useState<'cost' | 'requests'>('cost');
  const [timeRange, setTimeRange] = useState<DashboardTimeRange>('daily');
  const [chartType, setChartType] = useState<'bar' | 'area'>('area');
  const [visibleSeries, setVisibleSeries] = useState(DEFAULT_VISIBLE_SERIES);
  const [snapshot, setSnapshot] = useState(() => DashboardService.emptyDashboardSnapshot());
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadMessage, setLoadMessage] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    setLoadMessage(null);
    try {
      const data = await DashboardService.fetchDashboardOverview(timeRange);
      setSnapshot(data);
      setLoadMessage(data.warnings[0] ?? null);
    } catch (error) {
      setSnapshot(DashboardService.emptyDashboardSnapshot());
      setLoadError(getDashboardLoadErrorMessage(error, 'Failed to load dashboard overview.'));
    } finally {
      setIsLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const chartData = useMemo(() => {
    return snapshot.chartData.map((item) => {
      const row: Record<string, number | string> = { time: item.time };
      for (const series of SERIES) {
        const value = item[series.key];
        row[series.label] = metricType === 'cost' ? value : Math.round(value);
      }
      return row;
    });
  }, [metricType, snapshot.chartData]);

  const totalValue = useMemo(() => {
    return chartData.reduce((sum, item) => {
      return sum + SERIES.reduce((seriesSum, series) => seriesSum + numberFrom(item[series.label]), 0);
    }, 0);
  }, [chartData]);

  const pieData = useMemo(() => {
    const totalRequests = snapshot.topModels.reduce((sum, item) => sum + item.requests, 0);
    return SERIES.map((series) => {
      const modality = modalityFromLabel(series.label);
      const requests = snapshot.topModels
        .filter((item) => item.modality === modality)
        .reduce((sum, item) => sum + item.requests, 0);
      return {
        name: series.label,
        value: totalRequests > 0 ? Math.round((requests / totalRequests) * 100) : 0,
        color: series.color,
      };
    }).filter((item) => item.value > 0);
  }, [snapshot.topModels]);

  const chartTooltipStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid rgba(148, 163, 184, 0.35)',
    borderRadius: '8px',
    boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.12)',
    color: '#1e293b',
  };

  const toggleSeries = (label: string) => {
    setVisibleSeries((current) => ({ ...current, [label]: !current[label] }));
  };

  const maxModelRequests = snapshot.topModels[0]?.requests ?? 0;
  const hasDashboardData =
    snapshot.chartData.length > 0 ||
    snapshot.topModels.length > 0 ||
    snapshot.announcements.length > 0 ||
    snapshot.summary.requestCount > 0 ||
    snapshot.summary.usedCredits > 0 ||
    snapshot.summary.availableCredits > 0;

  return (
    <div className="min-h-[calc(100vh-72px)] w-full space-y-5 bg-slate-50 p-4 text-slate-800 dark:bg-[#121212] dark:text-slate-100 lg:p-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 dark:border-white/5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold lg:text-2xl">控制台概览</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {TIME_RANGE_LABELS[timeRange]}业务用量、模型排行与系统消息
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
            Read-only
          </span>
          <button
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/5 dark:bg-[#252525] dark:text-slate-300 dark:hover:bg-white/10"
            disabled={isLoading}
            onClick={() => void loadDashboard()}
            title="刷新数据"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <p className="max-w-3xl text-xs leading-5 text-slate-500 dark:text-slate-400">
        {readOnlyDashboardActions}
      </p>

      {loadMessage && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          {loadMessage}
        </div>
      )}

      {isLoading ? (
        <BusinessStatePanel
          kind="loading"
          title="Loading dashboard overview..."
          description="Fetching usage, model ranking, and announcement data from the dashboard overview contract."
          className="rounded-lg border border-slate-200 bg-white dark:border-white/5 dark:bg-[#252525]"
        />
      ) : loadError ? (
        <BusinessStatePanel
          kind="error"
          title="Dashboard overview could not be loaded"
          description={loadError}
          onRetry={() => void loadDashboard()}
          className="rounded-lg border border-slate-200 bg-white dark:border-white/5 dark:bg-[#252525]"
        />
      ) : !hasDashboardData ? (
        <BusinessStatePanel
          kind="empty"
          title="No dashboard data found"
          description="The selected time range has no usage, model ranking, or announcement rows returned by the dashboard overview contract."
          onRetry={() => void loadDashboard()}
          className="rounded-lg border border-slate-200 bg-white dark:border-white/5 dark:bg-[#252525]"
        />
      ) : (
        <>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={<Wallet className="h-4 w-4 text-blue-500" />}
          title="可用额度"
          value={`${formatNumber(snapshot.summary.availableCredits)} 点`}
          footerLabel="本周期消耗"
          footerValue={`${formatNumber(snapshot.summary.usedCredits)} 点`}
        />
        <MetricCard
          icon={<TrendingUp className="h-4 w-4 text-emerald-500" />}
          title="请求量"
          value={formatNumber(snapshot.summary.requestCount)}
          footerLabel="失败请求"
          footerValue={`${formatNumber(snapshot.summary.errorCount)} 次`}
          sparkline={snapshot.requestSparkline}
          sparklineColor="#10b981"
        />
        <MetricCard
          icon={<ImageIcon className="h-4 w-4 text-pink-500" />}
          title="多模态用量"
          value={formatNumber(
            snapshot.summary.imageRequests +
              snapshot.summary.videoRequests +
              snapshot.summary.audioRequests +
              snapshot.summary.musicRequests,
          )}
          footerLabel="图像 / 视频 / 音频 / 音乐"
          footerValue={`${formatNumber(snapshot.summary.imageRequests)} / ${formatNumber(snapshot.summary.videoRequests)} / ${formatNumber(snapshot.summary.audioRequests)} / ${formatNumber(snapshot.summary.musicRequests)}`}
          sparkline={snapshot.multimodalSparkline}
          sparklineColor="#ec4899"
        />
        <MetricCard
          icon={<Clock className="h-4 w-4 text-indigo-500" />}
          title="吞吐性能"
          value={`${formatNumber(snapshot.summary.rpm)} RPM`}
          footerLabel="Tokens per minute"
          footerValue={formatNumber(snapshot.summary.tpm)}
          sparkline={snapshot.performanceSparkline}
          sparklineColor="#6366f1"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="flex flex-col gap-6 xl:col-span-2">
          <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-white/5 dark:bg-[#252525]">
            <div className="flex flex-col gap-4 border-b border-slate-100 p-5 dark:border-white/5 md:flex-row md:items-center md:justify-between">
              <h2 className="flex items-center gap-2 text-base font-bold">
                <Activity className="h-5 w-5 text-blue-500" /> 用量趋势
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                <SegmentedControl
                  options={[
                    { value: 'cost', label: '费用' },
                    { value: 'requests', label: '请求' },
                  ]}
                  value={metricType}
                  onChange={(value) => setMetricType(value as 'cost' | 'requests')}
                />
                <SegmentedControl
                  options={Object.entries(TIME_RANGE_LABELS).map(([value, label]) => ({ value, label }))}
                  value={timeRange}
                  onChange={(value) => setTimeRange(value as DashboardTimeRange)}
                />
                <SegmentedControl
                  options={[
                    { value: 'area', label: '面积图' },
                    { value: 'bar', label: '柱状图' },
                  ]}
                  value={chartType}
                  onChange={(value) => setChartType(value as 'bar' | 'area')}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 bg-slate-50 px-6 py-4 dark:border-white/5 dark:bg-[#1e1e1e]/50">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">合计</span>
                <span className="flex items-center gap-1 font-mono text-xl font-bold">
                  {metricType === 'cost' && <Zap className="h-4 w-4 text-amber-500" />}
                  {formatNumber(totalValue)}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-600 dark:text-slate-300">
                {SERIES.map((series) => (
                  <button
                    key={series.label}
                    className={`flex items-center gap-1.5 transition-opacity ${visibleSeries[series.label] ? 'hover:opacity-80' : 'opacity-40 grayscale'}`}
                    onClick={() => toggleSeries(series.label)}
                  >
                    <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: series.color }} />
                    {series.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative h-[380px] w-full p-6">
              {chartData.length === 0 ? (
                <EmptyState label="暂无趋势数据" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'bar' ? (
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.14} />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }} tickFormatter={formatAxis} width={50} />
                      <Tooltip contentStyle={chartTooltipStyle} formatter={(value: number) => [formatNumber(value), undefined]} />
                      {SERIES.map((series) =>
                        visibleSeries[series.label] ? <Bar key={series.label} dataKey={series.label} stackId="usage" fill={series.color} radius={[4, 4, 0, 0]} /> : null,
                      )}
                    </BarChart>
                  ) : (
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.14} />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }} tickFormatter={formatAxis} width={50} />
                      <Tooltip contentStyle={chartTooltipStyle} formatter={(value: number) => [formatNumber(value), undefined]} />
                      {SERIES.map((series) =>
                        visibleSeries[series.label] ? (
                          <Area key={series.label} type="monotone" dataKey={series.label} stackId="usage" stroke={series.color} fill={series.color} fillOpacity={0.2} strokeWidth={2} />
                        ) : null,
                      )}
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              )}
            </div>
          </section>

          <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-white/5 dark:bg-[#252525]">
            <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-white/5">
              <h3 className="flex items-center gap-2 text-sm font-bold">
                <TrendingUp className="h-4 w-4 text-emerald-500" /> 模型排行
              </h3>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Read-only</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                <thead className="border-b border-slate-100 bg-slate-50/70 text-xs uppercase text-slate-500 dark:border-white/5 dark:bg-white/[0.02] dark:text-slate-400">
                  <tr>
                    <th className="w-16 px-6 py-4 text-center font-semibold">排名</th>
                    <th className="px-6 py-4 font-semibold">模型 / 供应商</th>
                    <th className="px-6 py-4 font-semibold">模态</th>
                    <th className="px-6 py-4 text-right font-semibold">请求量</th>
                    <th className="px-6 py-4 text-right font-semibold">费用</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {snapshot.topModels.length === 0 ? (
                    <tr>
                      <td className="px-6 py-8 text-center text-slate-400" colSpan={5}>暂无模型排行数据</td>
                    </tr>
                  ) : (
                    snapshot.topModels.map((row) => {
                      const widthPercent = maxModelRequests > 0 ? Math.max(2, Math.round((row.requests / maxModelRequests) * 100)) : 0;
                      return (
                        <tr key={`${row.rank}-${row.name}`} className="transition-colors hover:bg-slate-50 dark:hover:bg-white/5">
                          <td className="px-6 py-4 text-center">
                            <span className="inline-block h-6 w-6 rounded-md bg-slate-100 text-center text-xs font-bold leading-6 text-slate-500 dark:bg-white/5 dark:text-slate-400">{row.rank}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              <span className="font-mono text-[13px] font-semibold text-slate-800 dark:text-slate-100">{row.name}</span>
                              <span className="text-[11px] text-slate-500">{row.supplier}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:bg-white/10 dark:text-slate-300">{row.modality}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col items-end gap-1">
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold ${row.isUp ? 'text-emerald-500' : 'text-rose-500'}`}>{row.trend}</span>
                                <span className="font-mono text-sm font-medium">{formatNumber(row.requests)}</span>
                              </div>
                              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100 dark:bg-[#1e1e1e]">
                                <div className="h-full rounded-full bg-blue-500/50 dark:bg-blue-400/50" style={{ width: `${widthPercent}%` }} />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="font-mono text-sm font-bold text-slate-800 dark:text-white">{formatNumber(row.cost)} 点</span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-6 xl:col-span-1">
          <section className="flex h-[280px] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-white/5 dark:bg-[#252525]">
            <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-white/5">
              <h3 className="flex items-center gap-2 text-sm font-bold">
                <PieChartIcon className="h-4 w-4 text-blue-500" /> 模态分布
              </h3>
            </div>
            <div className="flex flex-1 items-center p-4">
              {pieData.length === 0 ? (
                <EmptyState label="暂无分布数据" />
              ) : (
                <>
                  <div className="h-full w-1/2">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" dataKey="value" innerRadius={45} outerRadius={70} paddingAngle={5} stroke="none">
                          {pieData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                        </Pie>
                        <Tooltip contentStyle={chartTooltipStyle} formatter={(value: number) => [`${value}%`, '占比']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex w-1/2 flex-col justify-center gap-3 pl-2">
                    {pieData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                          {item.name}
                        </span>
                        <span className="text-xs font-bold">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>

          <section className="flex min-h-[250px] flex-1 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-white/5 dark:bg-[#252525]">
            <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-white/5">
              <h3 className="flex items-center gap-2 text-sm font-bold">
                <Bell className="h-4 w-4 text-blue-500" /> 系统消息
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {snapshot.announcements.length === 0 ? (
                <EmptyState label="暂无系统消息" />
              ) : (
                <div className="space-y-4">
                  {snapshot.announcements.map((notice) => (
                    <div key={notice.id} className="group relative border-l-2 border-slate-200 pl-4 dark:border-white/10">
                      <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full ring-4 ring-white dark:ring-[#252525]" style={{ backgroundColor: announcementColor(notice.type) }} />
                      <div className="mb-1 line-clamp-1 cursor-pointer text-sm text-slate-700 transition-colors hover:text-blue-600 dark:text-slate-300 dark:hover:text-white">{notice.text}</div>
                      <div className="font-mono text-[11px] text-slate-500">{notice.time || '-'}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
        </>
      )}
    </div>
  );
}

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  footerLabel: string;
  footerValue: string;
  sparkline?: { value: number }[];
  sparklineColor?: string;
}

function MetricCard({ icon, title, value, footerLabel, footerValue, sparkline = [], sparklineColor = '#3b82f6' }: MetricCardProps) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-colors hover:border-blue-500/30 dark:border-white/5 dark:bg-[#252525]">
      <div className="relative z-10">
        <div className="mb-1 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            {icon} {title}
          </div>
        </div>
        <div className="mb-5 mt-2 flex items-center gap-1.5 text-2xl font-bold text-slate-800 dark:text-white lg:text-3xl">
          <Zap className="h-6 w-6 text-amber-500" />
          {value}
        </div>
        <div className="border-t border-slate-100 pt-4 dark:border-white/5">
          <div className="mb-1 flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Activity className="h-3.5 w-3.5 text-purple-400" /> {footerLabel}
          </div>
          <div className="text-sm font-bold text-slate-600 dark:text-slate-300">{footerValue}</div>
        </div>
      </div>
      {sparkline.length > 0 && (
        <div className="absolute bottom-6 right-0 h-16 w-1/2 opacity-30">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkline}>
              <Line type="monotone" dataKey="value" stroke={sparklineColor} strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

interface SegmentedControlProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

function SegmentedControl({ options, value, onChange }: SegmentedControlProps) {
  return (
    <div className="flex rounded-lg border border-slate-200 bg-slate-100 p-1 dark:border-white/5 dark:bg-[#1e1e1e]">
      {options.map((option) => (
        <button
          key={option.value}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
            value === option.value
              ? 'bg-white text-slate-800 shadow-sm dark:bg-white/10 dark:text-white'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">{label}</div>;
}

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return '0';
  }
  return new Intl.NumberFormat('zh-CN', { maximumFractionDigits: value >= 100 ? 0 : 2 }).format(value);
}

function formatAxis(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}k`;
  }
  return String(value);
}

function numberFrom(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function modalityFromLabel(label: string): string {
  if (label.includes('图像')) {
    return 'image';
  }
  if (label.includes('视频')) {
    return 'video';
  }
  if (label.includes('语音')) {
    return 'audio';
  }
  if (label.includes('音乐')) {
    return 'music';
  }
  return 'text';
}

function announcementColor(type: string): string {
  if (type === 'error') {
    return '#f43f5e';
  }
  if (type === 'success') {
    return '#10b981';
  }
  if (type === 'warning') {
    return '#f59e0b';
  }
  return '#3b82f6';
}
