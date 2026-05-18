import React from 'react';

import { useTranslation } from 'react-i18next';
export function LogsTab() {
  const { t } = useTranslation();
  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t("console.routing.components.logstab.text.jbi89z", "失败拦截与重试审计")}</h3>
          <p className="text-sm text-slate-500 mt-1">{t("console.routing.components.logstab.text.1fw3t3e", "追踪每一次被拦截或发生重试的请求明细及其返回内容。")}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/5 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-[#1e1e1e]/50 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-white/5">
               <th className="p-4 px-6">{t("console.routing.components.logstab.text.1psp7vv", "发生时间")}</th>
               <th className="p-4">{t("console.routing.components.logstab.text.1sg89r8", "请求模型")}</th>
               <th className="p-4">{t("console.routing.components.logstab.text.1qh3tx1", "触发节点")}</th>
               <th className="p-4">{t("console.routing.components.logstab.text.nvyjg", "错误状态")}</th>
               <th className="p-4">{t("console.routing.components.logstab.text.ndgx7r", "执行策略")}</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {[1, 2, 3, 4].map(idx => (
              <tr key={idx} className="border-b border-slate-200 dark:border-white/5 last:border-0 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                <td className="p-4 px-6 text-slate-400 font-mono text-xs">2026-04-22 13:00:1{idx}</td>
                <td className="p-4 text-emerald-400 font-mono text-xs">gpt-4-turbo</td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="text-slate-700 dark:text-slate-300">{t("console.routing.components.logstab.text.1mkkzyd", "Azure OpenAI 备用")}</span>
                    <span className="text-slate-500 text-xs">hk-azure-openai</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-mono">HTTP 429</span>
                </td>
                <td className="p-4 text-xs text-slate-400">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{t("console.routing.components.logstab.text.1rfoyzy", "触发重试")}</span> {t("console.routing.components.logstab.text.175n36d", "&rarr; 转发至 OpenAI主通道")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
