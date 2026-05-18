import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RoutingService, RoutingUsageData, RoutingModelStats } from '../routingService';

import { useTranslation } from 'react-i18next';
export function UsageTab() {
  const { t } = useTranslation();
  const [usageData, setUsageData] = useState<RoutingUsageData[]>([]);
  const [modelStats, setModelStats] = useState<RoutingModelStats[]>([]);

  useEffect(() => {
    RoutingService.fetchUsageData().then((data) => {
      setUsageData(data.chartData);
      setModelStats(data.modelStats);
    });
  }, []);

  return (
    <div className="animate-in fade-in duration-300 space-y-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t("console.routing.components.usagetab.text.nfli79", "调用记录统计")}</h3>
          <p className="text-sm text-slate-500 mt-1">{t("console.routing.components.usagetab.text.11gi6ch", "查看经过本地路由的 API 请求量和响应延迟趋势。")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Requests Chart */}
        <div className="bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/5 rounded-xl p-5">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-6 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" />
            {t("console.routing.components.usagetab.text.15aa6tk", "请求吞吐量 (Requests)")}</h4>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e232b', borderColor: '#30363d', color: '#fff', borderRadius: '8px' }}
                  itemStyle={{ color: '#3b82f6' }}
                />
                <Area type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorRequests)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Latency Chart */}
        <div className="bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/5 rounded-xl p-5">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-6 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            {t("console.routing.components.usagetab.text.1qhsv48", "平均响应延迟 (Latency)")}</h4>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 50', 'dataMax + 50']} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e232b', borderColor: '#30363d', color: '#fff', borderRadius: '8px' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Area type="monotone" dataKey="latency" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorLatency)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/5 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-[#1e1e1e]/50 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-white/5">
               <th className="p-4 px-6">{t("admin.record.index.text.1ow6qt", "模型")}</th>
               <th className="p-4">{t("console.routing.components.usagetab.text.j9xgw0", "总请求量")}</th>
               <th className="p-4">{t("console.routing.components.usagetab.text.1dq7mc5", "成功率")}</th>
               <th className="p-4">{t("console.routing.components.usagetab.text.15byhd7", "平均 Tokens")}</th>
               <th className="p-4">{t("console.routing.components.usagetab.text.1hjzsd5", "P90 延迟")}</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {modelStats.map(row => (
              <tr key={row.m} className="border-b border-slate-200 dark:border-white/5 last:border-0 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                <td className="p-4 px-6 text-slate-900 dark:text-white font-mono text-xs">{row.m}</td>
                <td className="p-4 text-slate-700 dark:text-slate-300">{row.req}</td>
                <td className="p-4 text-emerald-400">{row.sr}</td>
                <td className="p-4 text-slate-400">{row.tok}</td>
                <td className="p-4 text-slate-400">{row.lat}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
