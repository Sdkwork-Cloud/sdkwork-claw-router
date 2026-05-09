import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AlignLeft, Activity, Server, Timer } from 'lucide-react';
import { BusinessStatePanel } from 'sdkwork-claw-router-commons';
import { GatewayService, type GatewayTrace } from './gatewayService';

const readOnlyGatewayActions =
  'Read-only gateway trace inventory. Security limits, compatibility switches, payload inspection, and request replay require explicit gateway command contracts before they can be enabled.';

type GatewaySummary = {
  total: number;
  success: number;
  failed: number;
  uniqueChannels: number;
};

function getLoadErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

function summarizeTraces(traces: GatewayTrace[]): GatewaySummary {
  return traces.reduce<GatewaySummary>(
    (summary, trace) => {
      summary.total += 1;
      if (trace.status >= 200 && trace.status < 400) {
        summary.success += 1;
      } else {
        summary.failed += 1;
      }
      return summary;
    },
    {
      total: 0,
      success: 0,
      failed: 0,
      uniqueChannels: new Set(traces.map((trace) => trace.channel).filter(Boolean)).size,
    },
  );
}

export function GatewayView() {
  const [traces, setTraces] = useState<GatewayTrace[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadTraces = useCallback(async (isActive: () => boolean = () => true) => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await GatewayService.fetchTraces();
      if (isActive()) {
        setTraces(data);
      }
    } catch (error) {
      if (isActive()) {
        setLoadError(getLoadErrorMessage(error, 'Failed to load gateway traces.'));
      }
    } finally {
      if (isActive()) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let active = true;
    void loadTraces(() => active);
    return () => {
      active = false;
    };
  }, [loadTraces]);

  const summary = useMemo(() => summarizeTraces(traces), [traces]);

  return (
    <div className="p-6 lg:p-8 w-full mx-auto space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Gateway & Logs
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Request trace observability backed by the app gateway trace API.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-left lg:text-right">
          <p className="max-w-2xl text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            {readOnlyGatewayActions}
          </p>
          <span className="shrink-0 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
            Read-only
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-white/10 p-2 rounded-xl shadow-sm">
        <SummaryItem icon={<AlignLeft className="w-4 h-4 text-blue-500" />} label="Trace Rows" value={summary.total.toString()} />
        <SummaryItem icon={<Activity className="w-4 h-4 text-emerald-500" />} label="Successful" value={summary.success.toString()} />
        <SummaryItem icon={<Timer className="w-4 h-4 text-rose-500" />} label="Failed" value={summary.failed.toString()} />
        <SummaryItem icon={<Server className="w-4 h-4 text-indigo-500" />} label="Channels" value={summary.uniqueChannels.toString()} />
      </div>

      <div className="space-y-4 flex flex-col items-start w-full">
        <div className="flex items-center justify-between w-full mb-2">
          <h3 className="font-semibold text-slate-900 dark:text-white">Request Traces</h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">Fetched from the gateway trace read model.</span>
        </div>

        <div className="bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-white/10 rounded-xl shadow-sm overflow-hidden flex flex-col w-full min-h-[420px]">
          {loading ? (
            <BusinessStatePanel
              kind="loading"
              title="Loading gateway traces..."
              className="min-h-[420px] border-0 bg-transparent"
            />
          ) : loadError ? (
            <BusinessStatePanel
              kind="error"
              title="Gateway traces could not be loaded"
              description={loadError}
              onRetry={() => void loadTraces()}
              className="min-h-[420px] border-0 bg-transparent"
            />
          ) : traces.length === 0 ? (
            <BusinessStatePanel
              kind="empty"
              title="No gateway traces found"
              description={readOnlyGatewayActions}
              className="min-h-[420px] border-0 bg-transparent"
            />
          ) : (
            <GatewayTraceTable traces={traces} />
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="p-4 border-l first:border-l-0 border-slate-100 dark:border-white/5">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">
        {icon}
        {label}
      </div>
      <div className="text-lg text-slate-900 dark:text-white font-bold">{value}</div>
    </div>
  );
}

function GatewayTraceTable({ traces }: { traces: GatewayTrace[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-white/10">
          <tr>
            <th className="px-5 py-3 font-medium">Trace ID</th>
            <th className="px-5 py-3 font-medium">Timestamp</th>
            <th className="px-5 py-3 font-medium">Client IP</th>
            <th className="px-5 py-3 font-medium">Method</th>
            <th className="px-5 py-3 font-medium">Endpoint</th>
            <th className="px-5 py-3 font-medium text-center">Status</th>
            <th className="px-5 py-3 font-medium text-right">Duration</th>
            <th className="px-5 py-3 font-medium">Routed Channel</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-white/5 text-slate-700 dark:text-slate-300">
          {traces.map((trace) => (
            <tr key={trace.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors font-mono text-xs">
              <td className="px-5 py-3 font-bold text-slate-900 dark:text-white">{trace.id}</td>
              <td className="px-5 py-3 text-slate-500">{trace.time}</td>
              <td className="px-5 py-3 text-slate-500">{trace.ip}</td>
              <td className="px-5 py-3">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                    trace.method === 'POST'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                  }`}
                >
                  {trace.method}
                </span>
              </td>
              <td className="px-5 py-3 text-slate-500">{trace.endpoint}</td>
              <td className="px-5 py-3 text-center">
                <span
                  className={`inline-block px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                    trace.status >= 200 && trace.status < 400
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                      : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'
                  }`}
                >
                  {trace.status}
                </span>
              </td>
              <td className="px-5 py-3 text-right">{trace.duration}</td>
              <td className="px-5 py-3 text-slate-500">{trace.channel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
