import React from 'react';
import { AlertTriangle, RefreshCw, ShieldCheck } from 'lucide-react';

export function FallbackTab() {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Fallback & Circuit Breaker</h3>
        <p className="text-sm text-slate-500 mt-1">
          Channel-level timeout and retry controls are configured on each routing channel.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/5 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Channel-level retry</h4>
              <p className="text-sm text-slate-500 mt-2">
                Configure max attempts, retryable HTTP statuses, backoff, and provider timeout from the channel add/edit dialog.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-300">
                <span className="px-2 py-1 rounded bg-slate-100 dark:bg-white/10">408</span>
                <span className="px-2 py-1 rounded bg-slate-100 dark:bg-white/10">429</span>
                <span className="px-2 py-1 rounded bg-slate-100 dark:bg-white/10">500</span>
                <span className="px-2 py-1 rounded bg-slate-100 dark:bg-white/10">502</span>
                <span className="px-2 py-1 rounded bg-slate-100 dark:bg-white/10">503</span>
                <span className="px-2 py-1 rounded bg-slate-100 dark:bg-white/10">504</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/5 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Runtime protection</h4>
              <p className="text-sm text-slate-500 mt-2">
                Health checks and channel status operations are active today. Global circuit-breaker rules require a dedicated backend policy endpoint before they can be edited here.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4 text-sm text-amber-800 dark:text-amber-200 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>
            No global fallback policy has been exposed by the API contract yet, so this page intentionally avoids editable controls that cannot be persisted.
          </span>
        </div>
      </div>
    </div>
  );
}
