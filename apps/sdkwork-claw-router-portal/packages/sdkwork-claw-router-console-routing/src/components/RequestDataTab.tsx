import React, { useState, useEffect } from 'react';
import { CopyButton } from 'sdkwork-claw-router-commons';
import { Search, ChevronDown, ChevronRight, Download } from 'lucide-react';
import { RoutingService, RequestTrace } from '../routingService';

function buildRequestPayload(req: RequestTrace): string {
  return JSON.stringify(
    {
      model: req.model,
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Explain quantum computing in simple terms.' },
      ],
      temperature: 0.7,
    },
    null,
    2,
  );
}

function buildResponsePayload(req: RequestTrace): string {
  const payload =
    req.status === 200
      ? {
          id: 'chatcmpl-123',
          object: 'chat.completion',
          created: 1677652288,
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                content: 'Quantum computing is a rapidly-emerging technology...',
              },
              finish_reason: 'stop',
            },
          ],
          usage: {
            prompt_tokens: 18,
            completion_tokens: req.tokens,
            total_tokens: req.tokens + 18,
          },
        }
      : {
          error: {
            message: 'Rate limit reached for requests',
            type: 'requests',
            param: null,
            code: 'rate_limit_exceeded',
          },
        };

  return JSON.stringify(payload, null, 2);
}

export function RequestDataTab() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [requestTraces, setRequestTraces] = useState<RequestTrace[]>([]);

  useEffect(() => {
    RoutingService.fetchRequestTraces().then(setRequestTraces);
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">请求数据审计</h3>
          <p className="text-sm text-slate-500 mt-1">查看详细的 API 请求体 (Input) 和响应体 (Output) 数据，用于调试和追溯。</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="text" placeholder="搜索 Request ID 或摘要..." className="bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/5 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 w-64 text-slate-900 dark:text-white placeholder-slate-600 transition-colors" />
          </div>
          <button className="flex items-center gap-2 bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer">
            <Download className="w-4 h-4" /> 导出日志
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/5 rounded-xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="grid grid-cols-12 gap-4 p-4 px-6 bg-slate-50 dark:bg-[#1e1e1e]/50 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-white/5">
           <div className="col-span-3">请求 ID & 时间</div>
           <div className="col-span-2">请求模型</div>
           <div className="col-span-3">处理通道</div>
           <div className="col-span-1">状态</div>
           <div className="col-span-1">耗时</div>
           <div className="col-span-1">Tokens</div>
           <div className="col-span-1 text-right">详情</div>
        </div>

        {/* Rows */}
        <div className="flex-1 overflow-y-auto">
          {requestTraces.map((req) => (
            <React.Fragment key={req.id}>
              <div
                className={`grid grid-cols-12 gap-4 p-4 px-6 items-center border-b border-slate-200 dark:border-white/5 transition-colors cursor-pointer ${expandedId === req.id ? 'bg-slate-50 dark:bg-[#1e1e1e]/50' : 'hover:bg-slate-100 dark:hover:bg-white/5'}`}
                onClick={() => toggleExpand(req.id)}
              >
                <div className="col-span-3 flex flex-col">
                  <span className="text-slate-900 dark:text-white font-mono text-xs">{req.id}</span>
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

              {/* Expanded Data Panel */}
              {expandedId === req.id && (
                <div className="bg-slate-50 dark:bg-[#121212] border-b border-slate-200 dark:border-white/5 p-6">
                  <div className="grid grid-cols-2 gap-6">
                    {(() => {
                      const requestPayload = buildRequestPayload(req);
                      const responsePayload = buildResponsePayload(req);

                      return (
                        <>
                    {/* Request payload */}
                    <div className="space-y-2">
                       <div className="flex items-center justify-between">
                         <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Request Payload (Input)</h5>
                         <CopyButton
                           text={requestPayload}
                           label="Copy request payload"
                           copiedLabel="Copied request payload"
                           className="text-slate-500 hover:text-slate-900 dark:text-white"
                           iconClassName="w-3.5 h-3.5"
                           title="Copy request payload"
                         />
                       </div>
                       <div className="bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/5 rounded-lg p-4 font-mono text-xs text-slate-700 dark:text-slate-300 overflow-x-auto">
                         <pre>{requestPayload}</pre>
                       </div>
                    </div>
                    {/* Response payload */}
                    <div className="space-y-2">
                       <div className="flex items-center justify-between">
                         <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Response Payload (Output)</h5>
                         <CopyButton
                           text={responsePayload}
                           label="Copy response payload"
                           copiedLabel="Copied response payload"
                           className="text-slate-500 hover:text-slate-900 dark:text-white"
                           iconClassName="w-3.5 h-3.5"
                           title="Copy response payload"
                         />
                       </div>
                       <div className="bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/5 rounded-lg p-4 font-mono text-xs text-emerald-400 overflow-x-auto">
                         {req.status === 200 ? (
                           <pre>{responsePayload}</pre>
                         ) : (
                           <pre className="text-red-400">{responsePayload}</pre>
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
