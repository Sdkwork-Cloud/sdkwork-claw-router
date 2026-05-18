import React, { useState, useEffect } from 'react';
import { CopyButton } from 'sdkwork-claw-router-commons';
import { Search, ChevronDown, ChevronRight, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { RoutingService, RequestTrace } from '../routingService';

function buildRequestAudit(req: RequestTrace): string {
  return JSON.stringify({
    requestId: req.requestId || req.id,
    traceId: req.traceId,
    method: req.httpMethod,
    path: req.requestPath,
    model: req.model,
    channel: req.channel,
    streaming: req.streaming,
    requestBytes: req.requestBytes,
    requestPayloadHash: req.requestPayloadHash,
    startedAt: req.startedAt || req.time,
  }, null, 2);
}

function buildResponseAudit(req: RequestTrace): string {
  return JSON.stringify({
    status: req.status,
    duration: req.duration,
    tokens: req.tokens,
    responseBytes: req.responseBytes,
    responsePayloadHash: req.responsePayloadHash,
    providerErrorCode: req.providerErrorCode,
    errorType: req.errorType,
    errorMessageMasked: req.errorMessageMasked,
    endedAt: req.endedAt,
  }, null, 2);
}

export function RequestDataTab() {
  const { t } = useTranslation();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [requestTraces, setRequestTraces] = useState<RequestTrace[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    RoutingService.fetchRequestTraces().then(setRequestTraces);
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const normalizedSearch = search.trim().toLowerCase();
  const filteredRequestTraces = requestTraces.filter((req) => {
    if (!normalizedSearch) {
      return true;
    }
    return [
      req.id,
      req.requestId,
      req.traceId,
      req.model,
      req.channel,
      req.requestPath,
      req.httpMethod,
      req.status,
    ].some((value) => String(value).toLowerCase().includes(normalizedSearch));
  });

  const exportLogs = () => {
    if (filteredRequestTraces.length === 0) {
      return;
    }
    const payload = JSON.stringify(
      filteredRequestTraces.map((req) => ({
        request: JSON.parse(buildRequestAudit(req)),
        response: JSON.parse(buildResponseAudit(req)),
      })),
      null,
      2,
    );
    const blob = new Blob([payload], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `routing-request-traces-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('console.routing.components.requestdatatab.title', '请求数据审计')}</h3>
          <p className="text-sm text-slate-500 mt-1">{t('console.routing.components.requestdatatab.description', '查看安全的请求与响应审计元数据、载荷哈希和脱敏错误详情。')}</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="text" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t('console.routing.components.requestdatatab.searchPlaceholder', '搜索请求 ID 或追踪 ID...')} className="bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/5 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 w-64 text-slate-900 dark:text-white placeholder-slate-600 transition-colors" />
          </div>
          <button onClick={exportLogs} disabled={filteredRequestTraces.length === 0} className="flex items-center gap-2 bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            <Download className="w-4 h-4" /> {t('common.actions.exportLogs')}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/5 rounded-xl flex flex-col overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 px-6 bg-slate-50 dark:bg-[#1e1e1e]/50 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-white/5">
           <div className="col-span-3">{t('console.routing.components.requestdatatab.headers.request', '请求 ID 和时间')}</div>
           <div className="col-span-2">{t('console.routing.components.requestdatatab.headers.model', '模型')}</div>
           <div className="col-span-3">{t('console.routing.components.requestdatatab.headers.channel', '渠道')}</div>
           <div className="col-span-1">{t('console.routing.components.requestdatatab.headers.status', '状态')}</div>
           <div className="col-span-1">{t('console.routing.components.requestdatatab.headers.latency', '延迟')}</div>
           <div className="col-span-1">{t('console.routing.components.requestdatatab.headers.tokens', 'Token')}</div>
           <div className="col-span-1 text-right">{t('console.routing.components.requestdatatab.headers.details', '详情')}</div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredRequestTraces.map((req) => (
            <React.Fragment key={req.id}>
              <div
                className={`grid grid-cols-12 gap-4 p-4 px-6 items-center border-b border-slate-200 dark:border-white/5 transition-colors cursor-pointer ${expandedId === req.id ? 'bg-slate-50 dark:bg-[#1e1e1e]/50' : 'hover:bg-slate-100 dark:hover:bg-white/5'}`}
                onClick={() => toggleExpand(req.id)}
              >
                <div className="col-span-3 flex flex-col">
                  <span className="text-slate-900 dark:text-white font-mono text-xs">{req.requestId || req.id}</span>
                  <span className="text-slate-500 text-xs mt-0.5">{req.time}</span>
                </div>
                <div className="col-span-2 text-blue-400 font-mono text-xs">{req.model}</div>
                <div className="col-span-3 text-slate-700 dark:text-slate-300 text-sm">{req.channel}</div>
                <div className="col-span-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-mono border ${req.status === 200 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                    {req.status}
                  </span>
                </div>
                <div className="col-span-1 text-slate-400 text-xs">{req.duration}</div>
                <div className="col-span-1 text-slate-400 text-xs">{req.tokens}</div>
                <div className="col-span-1 flex justify-end text-slate-500">
                  {expandedId === req.id ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </div>
              </div>

              {expandedId === req.id && (
                <div className="bg-slate-50 dark:bg-[#121212] border-b border-slate-200 dark:border-white/5 p-6">
                  <div className="grid grid-cols-2 gap-6">
                    {(() => {
                      const requestAudit = buildRequestAudit(req);
                      const responseAudit = buildResponseAudit(req);

                      return (
                        <>
                    <div className="space-y-2">
                       <div className="flex items-center justify-between">
                         <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('console.routing.components.requestdatatab.requestAudit', '请求审计')}</h5>
                         <CopyButton
                           text={requestAudit}
                           label={t('common.actions.copyRequestAudit')}
                           copiedLabel={t('common.actions.copiedRequestAudit')}
                           className="text-slate-500 hover:text-slate-900 dark:text-white"
                           iconClassName="w-3.5 h-3.5"
                           title={t('common.actions.copyRequestAudit')}
                         />
                       </div>
                       <div className="bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/5 rounded-lg p-4 font-mono text-xs text-slate-700 dark:text-slate-300 overflow-x-auto">
                         <pre>{requestAudit}</pre>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <div className="flex items-center justify-between">
                         <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('console.routing.components.requestdatatab.responseAudit', '响应审计')}</h5>
                         <CopyButton
                           text={responseAudit}
                           label={t('common.actions.copyResponseAudit')}
                           copiedLabel={t('common.actions.copiedResponseAudit')}
                           className="text-slate-500 hover:text-slate-900 dark:text-white"
                           iconClassName="w-3.5 h-3.5"
                           title={t('common.actions.copyResponseAudit')}
                         />
                       </div>
                       <div className="bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/5 rounded-lg p-4 font-mono text-xs text-emerald-400 overflow-x-auto">
                         {req.status === 200 ? (
                           <pre>{responseAudit}</pre>
                         ) : (
                           <pre className="text-red-400">{responseAudit}</pre>
                         )}
                       </div>
                    </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
