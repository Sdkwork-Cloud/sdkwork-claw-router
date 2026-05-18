import React, { useState, useEffect } from 'react';
import { BusinessStateTableRow, CopyButton } from 'sdkwork-claw-router-commons';
import { Key } from 'lucide-react';
import { RoutingService, type RoutingApiKey } from '../routingService';

import { useTranslation } from 'react-i18next';

type TranslationFunction = ReturnType<typeof useTranslation>['t'];

function getRoutingApiKeyErrorMessage(error: unknown, fallback: string, t: TranslationFunction): string {
  if (error instanceof Error) {
    const message = error.message.trim();
    if (message.startsWith('console.')) {
      return t(message, fallback);
    }
    if (message) {
      return message;
    }
  }
  return fallback;
}

export function ApiKeysTab() {
  const { t } = useTranslation();
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
      setLoadError(getRoutingApiKeyErrorMessage(error, t('console.routing.states.apiKeys.loadErrorFallback', '路由 API Key 加载失败。'), t));
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
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t("console.routing.components.apikeystab.text.i4nq0r", "API Key 令牌管理")}</h3>
          <p className="text-sm text-slate-500 mt-1">{t("console.routing.components.apikeystab.text.tc54vy", "管理应用连接到此本地路由网关的访问令牌。")}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/5 rounded-xl shadow-sm overflow-hidden flex flex-col w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-[#1e1e1e]/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-white/5 select-none text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold w-1/4">{t("console.routing.components.apikeystab.text.1mo4rb9", "名称 & Key")}</th>
                <th className="px-6 py-4 font-semibold w-1/5 text-center">{t("admin.finance.index.text.1ccx4t4", "状态")}</th>
                <th className="px-6 py-4 font-semibold w-1/5 text-right">{t("console.routing.components.apikeystab.text.t1tbff", "消耗/调用量")}</th>
                <th className="px-6 py-4 font-semibold w-1/5 text-right">{t("admin.user.index.text.miy8ea", "创建时间")}</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <BusinessStateTableRow colSpan={4} kind="loading" title={t('console.routing.states.apiKeys.loading', '正在加载路由 API Key...')} />
              ) : loadError ? (
                <BusinessStateTableRow
                  colSpan={4}
                  kind="error"
                  title={t('console.routing.states.apiKeys.loadErrorTitle', '路由 API Key 加载失败')}
                  description={loadError}
                  onRetry={() => { void loadApiKeys(); }}
                  retryLabel={t('common.actions.retry')}
                />
              ) : keys.length === 0 ? (
                <BusinessStateTableRow
                  colSpan={4}
                  kind="empty"
                  title={t('console.routing.states.apiKeys.emptyTitle', '暂无路由 API Key')}
                  description={t('console.routing.states.apiKeys.emptyDescription', '当前还没有可用的路由 API Key。')}
                />
              ) : keys.map((k) => (
                <tr key={k.id} className="border-b border-slate-200 dark:border-white/5 last:border-0 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 dark:text-white">{k.name}</div>
                    <div className="text-xs text-slate-500 font-mono mt-1 flex items-center gap-1">
                      <Key className="w-3 h-3"/> {k.displayKey}
                      {k.copyableKey ? (
                        <CopyButton
                          text={k.copyableKey}
                          label={t('common.actions.copyApiKey')}
                          copiedLabel={t('common.actions.copiedApiKey')}
                          errorLabel={t('common.actions.copyFailed')}
                          className="ml-1 text-blue-500 hover:text-blue-600"
                          iconClassName="w-3 h-3"
                          title={t('common.actions.copyApiKey')}
                        />
                      ) : null}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded text-xs font-medium border ${k.status === 'enabled' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20'}`}>
                      {displayRoutingApiKeyStatus(k.status, t)}
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

function displayRoutingApiKeyStatus(status: RoutingApiKey['status'], t: TranslationFunction): string {
  return status === 'enabled'
    ? t('console.routing.status.active', '启用中')
    : t('console.routing.status.disabled', '已停用');
}
