import React, { useCallback, useState, useEffect } from 'react';
import { Settings, Globe, Bell, Palette, Moon, Sun, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useOutletContext } from 'react-router-dom';
import { ConsoleContextProps } from 'sdkwork-claw-router-console-core';
import { BusinessStatePanel } from 'sdkwork-claw-router-commons';
import { SettingsService, SettingsData } from './settingsService';

import { useTranslation } from 'react-i18next';
type TranslationFunction = ReturnType<typeof useTranslation>['t'];

function getSettingsErrorMessage(error: unknown, fallback: string, t: TranslationFunction): string {
  if (!(error instanceof Error) || !error.message) {
    return fallback;
  }
  return error.message.startsWith('console.') ? t(error.message, fallback) : error.message;
}

const Toggle = ({ checked, onChange, disabled = false, label }: { checked: boolean, onChange: () => void, disabled?: boolean, label: string }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={onChange}
    className={`relative inline-flex h-5 w-10 shrink-0 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#1e1e1e] transition-colors duration-200 ease-in-out disabled:cursor-not-allowed disabled:opacity-60 ${checked ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}
  >
    <span className="sr-only">{label}</span>
    <span aria-hidden="true" className={`pointer-events-none absolute left-0.5 inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

export function SettingsView() {
  const { t } = useTranslation();
  const { isDark, setTheme } = useOutletContext<ConsoleContextProps>();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [savingNotificationKey, setSavingNotificationKey] = useState<keyof SettingsData['notifications'] | null>(null);

  const [data, setData] = useState<SettingsData>({
    language: 'zh-CN',
    timezone: 'UTC+08:00',
    webhookUrl: '',
    notifications: {
      billReminder: true,
      quotaWarning: true,
      apiMonitor: false
    }
  });

  const loadSettings = useCallback(async (isActive: () => boolean = () => true) => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await SettingsService.fetchSettings();
      if (isActive()) {
        setData(res);
      }
    } catch (error) {
      if (isActive()) {
        setLoadError(getSettingsErrorMessage(
          error,
          t('console.settings.states.loadErrorFallback', '控制台设置加载失败。'),
          t,
        ));
      }
    } finally {
      if (isActive()) {
        setLoading(false);
      }
    }
  }, [t]);

  useEffect(() => {
    let active = true;
    void loadSettings(() => active);
    return () => {
      active = false;
    };
  }, [loadSettings]);

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(null);
    try {
      await SettingsService.updateSettings(data);
      setSaveSuccess(t('console.settings.states.saved', '设置已保存。'));
    } catch (error) {
      setSaveError(getSettingsErrorMessage(
        error,
        t('console.settings.states.saveErrorFallback', '设置保存失败。'),
        t,
      ));
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationToggle = async (key: keyof SettingsData['notifications']) => {
    const previousData = data;
    const nextData = {
      ...data,
      notifications: {
        ...data.notifications,
        [key]: !data.notifications[key],
      },
    };
    setData(nextData);
    setSavingNotificationKey(key);
    setSaveError(null);
    setSaveSuccess(null);
    try {
      await SettingsService.updateSettings(nextData);
      setSaveSuccess(t('console.settings.states.saved', '设置已保存。'));
    } catch (error) {
      setData(previousData);
      setSaveError(getSettingsErrorMessage(
        error,
        t('console.settings.states.saveErrorFallback', '设置保存失败。'),
        t,
      ));
    } finally {
      setSavingNotificationKey(null);
    }
  };

  const tabs = [
    { id: 'general', label: t("console.settings.settingsview.text.103js93", "通用设置"), icon: Globe },
    { id: 'appearance', label: t("console.settings.settingsview.text.r3vl7p", "外观偏好"), icon: Palette },
    { id: 'notifications', label: t("console.settings.settingsview.text.186jwwc", "通知与提醒"), icon: Bell },
  ];

  return (
    <div className="p-4 lg:p-6 w-full mx-auto space-y-6 animate-in fade-in duration-500 min-h-[calc(100vh-72px)] bg-slate-50 dark:bg-[#121212]">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-slate-200 dark:border-white/5 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6 text-lobster-500" />
          <h1 className="text-xl lg:text-2xl font-bold text-slate-800 dark:text-white tracking-tight">{t("console.settings.settingsview.text.18giiv0", "控制台设置")}</h1>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">

        {/* Left Nav */}
        <div className="w-full md:w-64 shrink-0">
           <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible custom-scrollbar pb-2 md:pb-0">
             {tabs.map(tab => {
               const Icon = tab.icon;
               const isActive = activeTab === tab.id;
               return (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                     isActive
                     ? 'bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-500 border border-blue-200 dark:border-blue-500/20'
                     : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent'
                   }`}
                 >
                   <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-500' : 'text-slate-500'}`} />
                   {tab.label}
                 </button>
               )
             })}
           </nav>
        </div>

        {/* Right Content */}
        <div className="flex-1 bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm min-h-[500px]">
          <AnimatePresence mode="wait">
            {loading ? (
              <BusinessStatePanel
                kind="loading"
                title={t('console.settings.states.loading', '正在加载设置...')}
                className="min-h-[500px]"
              />
            ) : loadError ? (
              <BusinessStatePanel
                kind="error"
                title={t('console.settings.states.loadErrorTitle', '设置加载失败')}
                description={loadError}
                onRetry={() => void loadSettings()}
                className="min-h-[500px]"
              />
            ) : activeTab === 'general' ? (
              <motion.div
                key="general"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="p-6 md:p-8 space-y-8"
              >
                <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-1">{t("console.settings.settingsview.text.103js93", "通用设置")}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{t("console.settings.settingsview.text.7nlzoj", "管理您的语言、时区及跨区请求路由默认偏好。")}</p>

                  <div className="space-y-6 max-w-2xl">
                    {saveError ? (
                      <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                        {saveError}
                      </div>
                    ) : null}
                    {saveSuccess ? (
                      <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                        {saveSuccess}
                      </div>
                    ) : null}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                       <div>
                         <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t("console.settings.settingsview.text.acqlsz", "系统首选语言")}</label>
                         <select
                           value={data.language}
                           onChange={e => setData({...data, language: e.target.value})}
                           className="w-full bg-slate-50 dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer shadow-sm">
                           <option value="zh-CN">{t("console.settings.settingsview.text.vi603f", "简体中文 (zh-CN)")}</option>
                           <option value="en-US">English (en-US)</option>
                           <option value="ja-JP">{t("console.settings.settingsview.text.17iwdgf", "日本語 (ja-JP)")}</option>
                         </select>
                       </div>
                       <div>
                         <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t("console.settings.settingsview.text.1n1edp0", "默认报表时区")}</label>
                         <select
                           value={data.timezone}
                           onChange={e => setData({...data, timezone: e.target.value})}
                           className="w-full bg-slate-50 dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer shadow-sm">
                           <option value="UTC+08:00">(UTC+08:00) Beijing, Shanghai</option>
                           <option value="UTC+00:00">(UTC+00:00) Coordinated Universal Time</option>
                           <option value="UTC-08:00">(UTC-08:00) Pacific Time (US & Canada)</option>
                         </select>
                       </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 dark:border-white/5">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t("console.settings.settingsview.text.2oob40", "全局默认回调 URL配置")}</label>
                      <p className="text-[13px] text-slate-500 mb-3 leading-relaxed">
                        {t("console.settings.settingsview.text.xs2e5v", "当开启异步多模态任务生成（如视频生成、大批量图像生成）时，如果未在 API 请求体内置顶 Notify URL，平台将默认采用此地址进行状态回推。")}</p>
                      <input
                        type="url"
                        value={data.webhookUrl}
                        onChange={e => setData({...data, webhookUrl: e.target.value})}
                        placeholder="https://api.yourdomain.com/webhook/callback"
                        className="w-full bg-slate-50 dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 transition-colors font-mono placeholder:text-slate-400 dark:placeholder:text-slate-600 shadow-sm" />
                    </div>

                    <div className="pt-6 flex justify-end">
                      <button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors shadow-sm">
                        {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                        {t("console.settings.settingsview.text.sig5u1", "保存全部修改")}</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : activeTab === 'appearance' ? (
              <motion.div
                key="appearance"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="p-6 md:p-8 space-y-8"
              >
                <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-1">{t("console.settings.settingsview.text.qwhdeg", "外观与排版体验")}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{t("console.settings.settingsview.text.8f9wf1", "控制台作为极度沉浸的数据分析及网关监管中心，极力推荐您在暗色模式下获得最专业的多模态聚合操作体验。")}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-xl">
                    <button
                      onClick={() => setTheme('light')}
                      className={`flex flex-col items-center gap-4 p-5 rounded-xl border-2 transition-colors relative ${!isDark ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/5' : 'border-slate-200 dark:border-transparent hover:border-blue-300 dark:hover:bg-white/10'}`}
                    >
                      {!isDark && (
                        <div className="absolute top-2 right-2 p-1.5 bg-blue-500 rounded-full shadow-sm z-10">
                           <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                      <div className="w-full h-28 bg-slate-50 dark:bg-white rounded-lg border border-slate-200 flex items-center justify-center shadow-sm">
                        <Sun className="w-8 h-8 text-amber-500" />
                      </div>
                      <span className={`text-sm font-medium ${!isDark ? 'text-blue-600' : 'text-slate-600 dark:text-slate-300'}`}>{t("console.settings.settingsview.text.1h50oex", "浅色模式 (Light)")}</span>
                    </button>

                    <button
                      onClick={() => setTheme('dark')}
                      className={`flex flex-col items-center gap-4 p-5 rounded-xl border-2 transition-colors relative ${isDark ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/5' : 'border-slate-200 dark:border-transparent hover:border-blue-300 dark:hover:bg-white/10'}`}
                    >
                      {isDark && (
                        <div className="absolute top-2 right-2 p-1.5 bg-blue-500 rounded-full shadow-sm z-10">
                           <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                      <div className="w-full h-28 bg-slate-800 dark:bg-[#121212] rounded-lg border border-slate-700 dark:border-[#333] flex items-center justify-center shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-transparent to-blue-500/10"></div>
                        <Moon className="w-8 h-8 text-blue-200 dark:text-slate-500 relative z-10" />
                      </div>
                      <span className={`text-sm font-medium ${isDark ? 'text-blue-600 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>{t("console.settings.settingsview.text.mhupa5", "深色控制台模式 (Dark Pro)")}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : activeTab === 'notifications' ? (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="p-6 md:p-8 space-y-8"
              >
                <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-1">{t("console.settings.settingsview.text.1f88e0w", "关键事件通知中心")}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{t("console.settings.settingsview.text.1xl34cr", "配置当业务数据、账单以及大模型 API 网关状态发生异动时，系统与邮件如何通知您。")}</p>

                  <div className="space-y-6 max-w-2xl">
                    {saveError ? (
                      <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                        {saveError}
                      </div>
                    ) : null}
                    {saveSuccess ? (
                      <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                        {saveSuccess}
                      </div>
                    ) : null}

                    <div className="bg-slate-50 dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/5 rounded-xl p-6 shadow-sm space-y-7">

                      <div className="flex items-start justify-between gap-6">
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{t("console.settings.settingsview.text.nvk1uw", "月度账单出账提醒")}</h4>
                          <p className="text-[13px] text-slate-500 mt-1.5 leading-relaxed">{t("console.settings.settingsview.text.13ohdai", "每月初系统完成并生成上月所有多模态大模型的并发调用清单与扣费统计后，向您发送详尽邮件提醒。")}</p>
                        </div>
                        <div className="pt-1">
                          <Toggle
                            checked={data.notifications.billReminder}
                            onChange={() => void handleNotificationToggle('billReminder')}
                            disabled={savingNotificationKey === 'billReminder'}
                            label={t('common.actions.useSetting')}
                          />
                        </div>
                      </div>

                      <div className="flex items-start justify-between gap-6">
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{t("console.settings.settingsview.text.1wzexb9", "可用余额/额度熔断告警")}</h4>
                          <p className="text-[13px] text-slate-500 mt-1.5 leading-relaxed">{t("console.settings.settingsview.text.1eriz46", "当您关联的结算账户预估可用余额不足 $50 或单日额度消耗大于 90% 时，立即发送系统紧急站内信与邮件熔断通知。")}</p>
                        </div>
                        <div className="pt-1">
                          <Toggle
                            checked={data.notifications.quotaWarning}
                            onChange={() => void handleNotificationToggle('quotaWarning')}
                            disabled={savingNotificationKey === 'quotaWarning'}
                            label={t('common.actions.useSetting')}
                          />
                        </div>
                      </div>

                      <div className="flex items-start justify-between gap-6">
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            {t("console.settings.settingsview.text.luzgc3", "网关监控异常跌落报警")}<span className="px-2 py-0.5 rounded border border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] uppercase font-bold tracking-wider">{t("console.settings.settingsview.text.6erjpp", "Pro级")}</span>
                          </h4>
                          <p className="text-[13px] text-slate-500 mt-1.5 leading-relaxed">{t("console.settings.settingsview.text.1pcv9so", "当您的所有下发令牌在中继网关发生大面积无法访问（如大量出现上游 429、500/5xx 状态码）时，启用高防监控告警。")}</p>
                        </div>
                        <div className="pt-1">
                          <Toggle
                            checked={data.notifications.apiMonitor}
                            onChange={() => void handleNotificationToggle('apiMonitor')}
                            disabled={savingNotificationKey === 'apiMonitor'}
                            label={t('common.actions.useSetting')}
                          />
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
