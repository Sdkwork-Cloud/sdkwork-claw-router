import React from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

export function FallbackTab() {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">高可用避孕与熔断 (Fallback & Circuit Breaker)</h3>
        <p className="text-sm text-slate-500 mt-1">设置自动重试、备用节点与错误熔断机制，提升服务 99.99% 的可用性。</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/5 rounded-xl p-6">
           <div className="flex justify-between items-center mb-6 border-b border-slate-200 dark:border-white/5 pb-4">
             <div>
               <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-emerald-400" /> 自动故障转移 (Failover)</h4>
               <p className="text-xs text-slate-500 mt-1">遇到指定的 HTTP 错误或超时的请求，系统会自动重发到同一组备用渠道端点。</p>
             </div>
             <div className="w-12 h-6 bg-emerald-500 rounded-full relative cursor-pointer shadow-inner shadow-black/50">
                <div className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full shadow"></div>
             </div>
           </div>

           <div className="grid grid-cols-2 gap-8">
             <div>
               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">触发重试的状态码</label>
               <input type="text" defaultValue="429, 500, 502, 503, 504" className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/5 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white text-sm" />
             </div>
             <div>
               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">超时阈值 (秒)</label>
               <input type="number" defaultValue="60" className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/5 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white text-sm" />
             </div>
           </div>
        </div>

        <div className="bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/5 rounded-xl p-6">
           <div className="flex justify-between items-center mb-6">
             <div>
               <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-400" /> 渠道熔断规则 (Circuit Breaker)</h4>
               <p className="text-xs text-slate-500 mt-1">当一个渠道在短时间内连续失败达到阈值，将其暂时剔除出轮询池。</p>
             </div>
           </div>

           <div className="flex items-center gap-4 bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-white/5">
             <span className="text-sm text-slate-400">在</span>
             <input type="number" defaultValue="5" className="w-16 bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/5 rounded text-center py-1 text-slate-900 dark:text-white text-sm focus:border-blue-500 outline-none" />
             <span className="text-sm text-slate-400">分钟内，如果连续失败</span>
             <input type="number" defaultValue="10" className="w-16 bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/5 rounded text-center py-1 text-slate-900 dark:text-white text-sm focus:border-blue-500 outline-none" />
             <span className="text-sm text-slate-400">次请求，则将渠道熔断停用</span>
             <input type="number" defaultValue="30" className="w-16 bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/5 rounded text-center py-1 text-slate-900 dark:text-white text-sm focus:border-blue-500 outline-none" />
             <span className="text-sm text-slate-400">分钟。</span>
           </div>
        </div>
      </div>
    </div>
  );
}
