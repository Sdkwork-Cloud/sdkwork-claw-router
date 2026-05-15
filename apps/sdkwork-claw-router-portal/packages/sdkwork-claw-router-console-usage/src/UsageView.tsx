import React, { useCallback, useEffect, useState } from 'react';
import {
  BarChart3,
  Calendar,
  ChevronDown,
  ChevronRight,
  Cpu,
  Layers,
  RefreshCw,
  Search,
  Zap,
} from 'lucide-react';
import { BusinessStatePanel } from 'sdkwork-claw-router-commons';
import {
  formatDecimalAmount,
  sumDecimalStrings,
} from 'sdkwork-claw-router-commons/runtime';
import { UsageService, UsageLog } from './usageService';

const DEFAULT_PAGE_SIZE = 10;

const readOnlyUsageActions =
  'Read-only usage log explorer. Filtering and pagination use the usage logs read API; exports and advanced report jobs require explicit usage command contracts before they can be enabled.';

type UsageLogStatus = 'all' | 'success' | 'error';

type UsageLogQueryState = {
  page: number;
  pageSize: number;
  searchQuery: string;
  status: UsageLogStatus;
  startTime: string;
  endTime: string;
};

const defaultUsageLogQuery: UsageLogQueryState = {
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  searchQuery: '',
  status: 'all',
  startTime: '',
  endTime: '',
};

function getUsageLoadErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

function buildUsageLogQuery(query: UsageLogQueryState): Record<string, string | number> {
  const params: Record<string, string | number> = {
    page: query.page,
    pageSize: query.pageSize,
  };
  const searchQuery = query.searchQuery.trim();
  const startTime = query.startTime.trim();
  const endTime = query.endTime.trim();

  if (searchQuery) {
    params.searchQuery = searchQuery;
  }
  if (query.status !== 'all') {
    params.status = query.status;
  }
  if (startTime) {
    params.startTime = startTime;
  }
  if (endTime) {
    params.endTime = endTime;
  }
  return params;
}

export function UsageView() {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [usageLogs, setUsageLogs] = useState<UsageLog[]>([]);
  const [totalLogs, setTotalLogs] = useState(0);
  const [query, setQuery] = useState<UsageLogQueryState>(defaultUsageLogQuery);
  const [draftQuery, setDraftQuery] = useState<UsageLogQueryState>(defaultUsageLogQuery);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const page = query.page;
  const pageSize = query.pageSize;
  const pageCount = Math.max(1, Math.ceil(totalLogs / pageSize));
  const visibleStart = usageLogs.length > 0 ? (page - 1) * pageSize + 1 : 0;
  const visibleEnd = usageLogs.length > 0 ? visibleStart + usageLogs.length - 1 : 0;
  const loadedCostTotal = sumDecimalStrings(usageLogs.map(log => log.cost), 6);
  const loadedTokenTotal = usageLogs.reduce((sum, log) => sum + log.inputTokens + log.outputTokens, 0);

  const loadUsageLogs = useCallback(async (isActive: () => boolean = () => true) => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await UsageService.fetchLogs(buildUsageLogQuery(query));
      if (isActive()) {
        setUsageLogs(data.logs);
        setTotalLogs(data.total);
        setExpandedIds(data.logs.length > 0 ? [data.logs[0].id] : []);
      }
    } catch (error) {
      if (isActive()) {
        setUsageLogs([]);
        setTotalLogs(0);
        setExpandedIds([]);
        setLoadError(getUsageLoadErrorMessage(error, 'Failed to load usage logs.'));
      }
    } finally {
      if (isActive()) {
        setLoading(false);
      }
    }
  }, [query]);

  useEffect(() => {
    let active = true;
    void loadUsageLogs(() => active);
    return () => {
      active = false;
    };
  }, [loadUsageLogs]);

  const applyFilters = useCallback(() => {
    const nextQuery = {
      ...draftQuery,
      page: 1,
    };
    setDraftQuery(nextQuery);
    setQuery(nextQuery);
  }, [draftQuery]);

  const resetFilters = useCallback(() => {
    setDraftQuery(defaultUsageLogQuery);
    setQuery(defaultUsageLogQuery);
  }, []);

  const goToPage = useCallback((targetPage: number) => {
    const nextPage = Math.min(Math.max(1, targetPage), pageCount);
    const nextQuery = {
      ...query,
      page: nextPage,
    };
    setDraftQuery(nextQuery);
    setQuery(nextQuery);
  }, [pageCount, query]);

  const updateDraftQuery = useCallback(
    (patch: Partial<UsageLogQueryState>) => {
      setDraftQuery(current => ({
        ...current,
        ...patch,
      }));
    },
    [],
  );

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-4 lg:p-6 w-full mx-auto space-y-6 animate-in fade-in duration-500 min-h-[calc(100vh-72px)] bg-slate-50 dark:bg-[#121212]">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/5">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-lobster-500" />
          <h1 className="text-xl lg:text-2xl font-bold text-slate-800 dark:text-white tracking-tight">API usage logs</h1>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="flex items-center gap-3 bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/5 rounded-lg p-1.5 shadow-sm text-sm">
            <div className="px-3 py-1 flex items-center gap-1.5 border-r border-slate-200 dark:border-white/10">
              <span className="text-slate-500 dark:text-slate-400">Loaded cost</span>
              <span className="font-bold text-rose-500 flex items-center"><Zap className="w-3.5 h-3.5 mr-0.5" /> {loadedCostTotal}</span>
            </div>
            <div className="px-3 py-1 flex items-center gap-1.5 border-r border-slate-200 dark:border-white/10">
              <span className="text-slate-500 dark:text-slate-400">Rows</span>
              <span className="font-bold text-slate-800 dark:text-white">{usageLogs.length}/{totalLogs}</span>
            </div>
            <div className="px-3 py-1 flex items-center gap-1.5">
              <span className="text-slate-500 dark:text-slate-400">Tokens</span>
              <span className="font-bold text-slate-800 dark:text-white">{loadedTokenTotal}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-left lg:text-right">
            <p className="max-w-2xl text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              {readOnlyUsageActions}
            </p>
            <span className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
              Read-only
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/5 rounded-xl p-3 shadow-sm flex flex-col md:flex-row flex-wrap items-center gap-3">
        <div className="relative w-full md:w-auto flex-1 min-w-[180px]">
          <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={draftQuery.startTime}
            onChange={(event) => updateDraftQuery({ startTime: event.target.value })}
            placeholder="startTime, for example 2026-04-21T00:00:00Z"
            className="w-full bg-slate-50 dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:border-lobster-500 focus:ring-1 focus:ring-lobster-500/20 text-slate-800 dark:text-white transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm md:shadow-none"
          />
        </div>

        <div className="relative w-full md:w-auto flex-1 min-w-[180px]">
          <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={draftQuery.endTime}
            onChange={(event) => updateDraftQuery({ endTime: event.target.value })}
            placeholder="endTime, for example 2026-04-21T23:59:59Z"
            className="w-full bg-slate-50 dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:border-lobster-500 focus:ring-1 focus:ring-lobster-500/20 text-slate-800 dark:text-white transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm md:shadow-none"
          />
        </div>

        <div className="relative w-full md:w-auto flex-1 min-w-[180px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={draftQuery.searchQuery}
            onChange={(event) => updateDraftQuery({ searchQuery: event.target.value })}
            placeholder="Search key, model, request, path..."
            className="w-full bg-slate-50 dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:border-lobster-500 focus:ring-1 focus:ring-lobster-500/20 text-slate-800 dark:text-white transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm md:shadow-none"
          />
        </div>

        <div className="relative w-full md:w-auto flex-[0.5] min-w-[140px]">
          <Layers className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={draftQuery.status}
            onChange={(event) => updateDraftQuery({ status: event.target.value as UsageLogStatus })}
            className="w-full appearance-none bg-slate-50 dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 pl-9 pr-8 py-2 rounded-lg text-sm focus:outline-none focus:border-lobster-500 focus:ring-1 focus:ring-lobster-500/20 text-slate-800 dark:text-white transition-all cursor-pointer shadow-sm md:shadow-none"
          >
            <option value="all">All statuses</option>
            <option value="success">Success</option>
            <option value="error">Error</option>
          </select>
          <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={() => void applyFilters()}
            className="flex-1 md:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            Query
          </button>
          <button
            type="button"
            onClick={() => void resetFilters()}
            className="px-4 py-2 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors border border-slate-200 dark:border-white/10 shadow-sm md:shadow-none"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => void loadUsageLogs()}
            className="px-2.5 py-2 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 rounded-lg text-sm transition-colors border border-slate-200 dark:border-white/10 shadow-sm md:shadow-none"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/5 rounded-xl shadow-sm overflow-hidden flex flex-col w-full min-h-[500px]">
        {loading ? (
          <BusinessStatePanel
            kind="loading"
            title="Loading usage logs..."
            className="min-h-[500px] border-0 bg-transparent"
          />
        ) : loadError ? (
          <BusinessStatePanel
            kind="error"
            title="Usage logs could not be loaded"
            description={loadError}
            onRetry={() => void loadUsageLogs()}
            className="min-h-[500px] border-0 bg-transparent"
          />
        ) : usageLogs.length === 0 ? (
          <BusinessStatePanel
            kind="empty"
            title="No usage logs found"
            description="The usage logs API returned an empty page for the current query."
            onRetry={() => void loadUsageLogs()}
            className="min-h-[500px] border-0 bg-transparent"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap min-w-[1200px]">
              <thead className="bg-slate-50 dark:bg-[#1e1e1e]/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-white/5 select-none text-xs">
                <tr>
                  <th className="px-4 py-3.5 font-medium">Time</th>
                  <th className="px-4 py-3.5 font-medium">Key</th>
                  <th className="px-4 py-3.5 font-medium">Group</th>
                  <th className="px-4 py-3.5 font-medium">Type</th>
                  <th className="px-4 py-3.5 font-medium">Model</th>
                  <th className="px-4 py-3.5 font-medium text-center">Latency</th>
                  <th className="px-4 py-3.5 font-medium text-right">Input</th>
                  <th className="px-4 py-3.5 font-medium text-right">Output</th>
                  <th className="px-4 py-3.5 font-medium text-right">Cost</th>
                  <th className="px-4 py-3.5 font-medium text-center">IP</th>
                  <th className="px-4 py-3.5 font-medium">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-300 relative text-xs">
                {usageLogs.map((log) => {
                  const expanded = expandedIds.includes(log.id);
                  return (
                    <React.Fragment key={log.id}>
                      <tr
                        onClick={(e) => toggleExpand(log.id, e)}
                        className={`group cursor-pointer transition-colors ${
                          expanded
                            ? 'bg-blue-50 dark:bg-blue-900/10'
                            : 'hover:bg-slate-50 dark:hover:bg-white/[0.02]'
                        }`}
                      >
                        <td className="px-4 py-3.5 font-mono text-xs flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                          <span className="p-0.5 rounded-md hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                            {expanded ? <ChevronDown className="w-4 h-4 text-blue-600 dark:text-blue-500" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                          </span>
                          {log.time}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="font-mono text-[11px] px-2 py-0.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded">
                            {log.tokenName}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                            {log.group}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                            {log.type}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 opacity-70" />
                          {log.model}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <span className="text-amber-600 dark:text-amber-400 font-mono text-[10px] bg-amber-50 dark:bg-amber-500/10 px-1.5 rounded border border-amber-100 dark:border-transparent">{log.totalTime}</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[10px] bg-emerald-50 dark:bg-emerald-500/10 px-1.5 rounded border border-emerald-100 dark:border-transparent">{log.ttft}</span>
                            {log.isStream && (
                              <span className="text-[10px] bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 px-1.5 rounded font-bold border border-blue-200 dark:border-transparent">stream</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-right flex flex-col items-end justify-center h-full min-h-[48px]">
                          <span className="font-mono text-slate-800 dark:text-slate-200">{log.inputTokens}</span>
                          <span className="text-[9px] text-slate-500 font-mono mt-0.5">
                            cache {log.cacheReadTokens}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right font-mono text-slate-800 dark:text-slate-200 align-top pt-4">
                          {log.outputTokens}
                        </td>
                        <td className="px-4 py-3.5 text-right font-mono font-medium text-rose-600 dark:text-rose-500 flex items-center justify-end gap-1 min-h-[48px] align-top pt-4 justify-self-end w-full text-xs">
                          <Zap className="w-3.5 h-3.5 text-amber-500" />
                          {formatDecimalAmount(log.cost, 6)}
                        </td>
                        <td className="px-4 py-3.5 text-center align-top pt-4">
                          <span className="font-mono text-xs text-slate-500 border-b border-dashed border-slate-300 dark:border-white/20">
                            {log.ip || '-'}
                          </span>
                        </td>
                        <td className="px-4 py-2 align-top pt-3 text-[11px] leading-relaxed">
                          <div className="text-slate-500 dark:text-slate-400">
                            multiplier <span className="text-slate-800 dark:text-slate-300 font-mono">{formatDecimalAmount(log.multiplier, 6)}x</span>
                          </div>
                          <div className="flex items-center gap-1 whitespace-nowrap text-slate-500">
                            input <Zap className="w-3 h-3 text-rose-500/70" /> {formatDecimalAmount(log.baseInputPrice, 6)} / 1M
                          </div>
                          <div className="flex items-center gap-1 whitespace-nowrap text-slate-500">
                            cache <Zap className="w-3 h-3 text-rose-500/70" /> {formatDecimalAmount(log.cacheReadPrice, 6)} / 1M
                          </div>
                        </td>
                      </tr>

                      {expanded && (
                        <tr className="bg-slate-50 dark:bg-[#1e1e1e]">
                          <td colSpan={11} className="p-0 border-t border-b border-slate-200 dark:border-white/5">
                            <div className="py-5 px-6 flex gap-6 text-xs">
                              <div className="flex flex-col gap-3 text-slate-500 text-right font-medium min-w-[100px] shrink-0">
                                <div>Request ID</div>
                                <div>Cache tokens</div>
                                <div>Pricing</div>
                                <div className="mt-7">Formula</div>
                                <div className="mt-[72px]">Reasoning</div>
                                <div>Path</div>
                              </div>

                              <div className="flex flex-col gap-3 text-slate-700 dark:text-slate-300">
                                <div className="font-mono text-[11px] py-0.5 text-slate-500 dark:text-slate-400">{log.requestId}</div>
                                <div className="font-mono text-[11px] py-0.5 text-slate-500 dark:text-slate-400">{log.cacheReadTokens}</div>

                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 py-1 px-3 bg-white dark:bg-white/5 rounded border border-slate-200 dark:border-white/5 w-fit shadow-sm dark:shadow-none">
                                  <span>input <Zap className="w-3 h-3 inline-block text-rose-500 -mt-0.5" /> {formatDecimalAmount(log.baseInputPrice, 6)} / 1M tokens,</span>
                                  <span>output <Zap className="w-3 h-3 inline-block text-rose-500 -mt-0.5" /> {formatDecimalAmount(log.baseOutputPrice, 6)} / 1M tokens,</span>
                                  <span>cache <Zap className="w-3 h-3 inline-block text-rose-500 -mt-0.5" /> {formatDecimalAmount(log.cacheReadPrice, 6)} / 1M tokens,</span>
                                  <span>multiplier {formatDecimalAmount(log.multiplier, 6)}x</span>
                                </div>

                                <div className="mt-1 flex flex-col gap-1.5 p-3 bg-white dark:bg-[#161616] rounded-lg border border-slate-200 dark:border-white/5 font-mono text-[11px] shadow-sm dark:shadow-none">
                                  <div className="text-slate-500 dark:text-slate-400">input price: <Zap className="w-3 h-3 inline-block text-rose-500/80 -mt-0.5" /> {formatDecimalAmount(log.baseInputPrice, 6)} / 1M tokens</div>
                                  <div className="text-slate-500 dark:text-slate-400">output price: <Zap className="w-3 h-3 inline-block text-rose-500/80 -mt-0.5" /> {formatDecimalAmount(log.baseOutputPrice, 6)} / 1M tokens</div>
                                  <div className="text-slate-500 dark:text-slate-400 mb-1">cache price: <Zap className="w-3 h-3 inline-block text-rose-500/80 -mt-0.5" /> {formatDecimalAmount(log.cacheReadPrice, 6)} / 1M tokens</div>
                                  <div className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-white/5 p-2 rounded">
                                    {`(input ${log.inputTokens - log.cacheReadTokens} / 1M * `}
                                    <Zap className="w-3 h-3 inline-block text-rose-500/80 -mt-0.5" />
                                    {` ${formatDecimalAmount(log.baseInputPrice, 6)} + cache ${log.cacheReadTokens} / 1M * `}
                                    <Zap className="w-3 h-3 inline-block text-rose-500/80 -mt-0.5" />
                                    {` ${formatDecimalAmount(log.cacheReadPrice, 6)} + output ${log.outputTokens} / 1M * `}
                                    <Zap className="w-3 h-3 inline-block text-rose-500/80 -mt-0.5" />
                                    {` ${formatDecimalAmount(log.baseOutputPrice, 6)}) * multiplier ${formatDecimalAmount(log.multiplier, 6)} = `}
                                    <Zap className="w-3 h-3 inline-block text-rose-500 -mt-0.5" />
                                    <span className="font-bold text-rose-600 dark:text-rose-500 ml-1">{formatDecimalAmount(log.cost, 6)}</span>
                                  </div>
                                  <div className="text-slate-400 dark:text-slate-500 mt-1 italic">Reference only; the ledger is the source of truth.</div>
                                </div>

                                <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400">{log.reasoningEffort}</div>
                                <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400">{log.path}</div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-4 border-t border-slate-200 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs mt-auto bg-slate-50 dark:bg-[#1e1e1e]/50">
          <div className="text-slate-500">
            Showing {visibleStart} - {visibleEnd} of {totalLogs}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 mr-2">Page {page} / {pageCount}</span>
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => void goToPage(page - 1)}
              className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5 disabled:opacity-50"
            >
              <ChevronRight className="w-3.5 h-3.5 rotate-180" />
            </button>
            <span className="w-7 h-7 flex items-center justify-center rounded bg-blue-600 text-white font-medium">{page}</span>
            <button
              type="button"
              disabled={page >= pageCount || loading}
              onClick={() => void goToPage(page + 1)}
              className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5 disabled:opacity-50"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <select
              value={draftQuery.pageSize}
              onChange={(event) => {
                const nextPageSize = Number(event.target.value);
                const nextQuery = {
                  ...draftQuery,
                  page: 1,
                  pageSize: nextPageSize,
                };
                setDraftQuery(nextQuery);
                setQuery(nextQuery);
              }}
              className="ml-2 bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded px-2 py-1 focus:outline-none focus:border-lobster-500 text-slate-700 dark:text-slate-300"
            >
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
