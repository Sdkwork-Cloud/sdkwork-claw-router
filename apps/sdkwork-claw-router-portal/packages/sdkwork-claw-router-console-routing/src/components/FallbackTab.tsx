import React from 'react';
import { AlertTriangle, RefreshCw, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function FallbackTab() {
  const { t } = useTranslation();

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('console.routing.components.fallbacktab.title', '故障退路与熔断')}</h3>
        <p className="text-sm text-slate-500 mt-1">
          {t('console.routing.components.fallbacktab.description', '渠道级超时与重试控制在各路由渠道中配置。')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/5 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">{t('console.routing.components.fallbacktab.channelRetryTitle', '渠道级重试')}</h4>
              <p className="text-sm text-slate-500 mt-2">
                {t('console.routing.components.fallbacktab.channelRetryDescription', '在渠道新增或编辑对话框中配置最大尝试次数、可重试 HTTP 状态码、退避时间和供应商超时。')}
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
              <h4 className="text-base font-bold text-slate-900 dark:text-white">{t('console.routing.components.fallbacktab.runtimeProtectionTitle', '运行时保护')}</h4>
              <p className="text-sm text-slate-500 mt-2">
                {t('console.routing.components.fallbacktab.runtimeProtectionDescription', '健康检查和渠道状态控制已生效；全局熔断控制可用后将在此处展示。')}
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4 text-sm text-amber-800 dark:text-amber-200 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>
            {t('console.routing.components.fallbacktab.emptyPolicy', '暂无全局故障退路策略。')}
          </span>
        </div>
      </div>
    </div>
  );
}
