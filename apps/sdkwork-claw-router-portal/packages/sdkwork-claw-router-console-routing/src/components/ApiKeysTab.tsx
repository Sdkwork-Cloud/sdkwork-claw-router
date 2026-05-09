import React, { useState, useEffect } from 'react';
import { BusinessStateTableRow, CopyButton } from 'sdkwork-claw-router-commons';
import { Key } from 'lucide-react';
import { RoutingService, type RoutingApiKey } from '../routingService';

const readOnlyApiKeyActions = 'Read-only routing key inventory. Create, rotate, disable, and delete keys from the API Keys console.';

export function ApiKeysTab() {
  const [keys, setKeys] = useState<RoutingApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadApiKeys = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await RoutingService.fetchApiKeys();
      setKeys(data);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Failed to load routing API keys');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadApiKeys();
  }, []);

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">API Key 令牌管理</h3>
          <p className="text-sm text-slate-500 mt-1">管理应用连接到此本地路由网关的访问令牌。</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
          {readOnlyApiKeyActions}
        </div>
      </div>

      <div className="bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/5 rounded-xl shadow-sm overflow-hidden flex flex-col w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-[#1e1e1e]/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-white/5 select-none text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold w-1/4">名称 & Key</th>
                <th className="px-6 py-4 font-semibold w-1/5 text-center">状态</th>
                <th className="px-6 py-4 font-semibold w-1/5 text-right">消耗/调用量</th>
                <th className="px-6 py-4 font-semibold w-1/5 text-right">创建时间</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <BusinessStateTableRow colSpan={4} kind="loading" title="Loading routing API keys..." />
              ) : loadError ? (
                <BusinessStateTableRow
                  colSpan={4}
                  kind="error"
                  title="Routing API keys could not be loaded"
                  description={loadError}
                  onRetry={() => { void loadApiKeys(); }}
                  retryLabel="Retry"
                />
              ) : keys.length === 0 ? (
                <BusinessStateTableRow
                  colSpan={4}
                  kind="empty"
                  title="No routing API keys yet"
                  description="No routing API keys are visible to this read-only inventory yet."
                />
              ) : keys.map((k) => (
                <tr key={k.id} className="border-b border-slate-200 dark:border-white/5 last:border-0 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 dark:text-white">{k.name}</div>
                    <div className="text-xs text-slate-500 font-mono mt-1 flex items-center gap-1">
                      <Key className="w-3 h-3"/> {k.key}
                      <CopyButton
                        text={k.key}
                        label="Copy API key"
                        copiedLabel="Copied API key"
                        errorLabel="Copy failed"
                        className="ml-1 text-blue-500 hover:text-blue-600"
                        iconClassName="w-3 h-3"
                        title="Copy API key"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded text-xs font-medium border ${k.status === 'enabled' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20'}`}>
                      {displayRoutingApiKeyStatus(k.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-slate-700 dark:text-slate-300">{k.totalUsage}</td>
                  <td className="px-6 py-4 text-right text-slate-500">{k.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function displayRoutingApiKeyStatus(status: RoutingApiKey['status']): string {
  return status === 'enabled' ? 'Active' : 'Disabled';
}
