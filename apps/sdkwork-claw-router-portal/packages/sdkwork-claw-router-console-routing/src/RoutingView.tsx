import React, { useState } from 'react';
import {
  Network, Server, ShieldCheck, Zap, AlertTriangle, Activity, Link2, LineChart, FileJson, Wrench, Key
} from 'lucide-react';
import { ChannelsTab } from './components/ChannelsTab';
import { StrategyTab } from './components/StrategyTab';
import { FallbackTab } from './components/FallbackTab';
import { LogsTab } from './components/LogsTab';
import { UsageTab } from './components/UsageTab';
import { RequestDataTab } from './components/RequestDataTab';
import { ApiKeysTab } from './components/ApiKeysTab';

import { useTranslation } from 'react-i18next';
type TabType = 'channels' | 'strategy' | 'fallback' | 'logs' | 'usage' | 'data' | 'apikeys';

type NavItemProps = {
  active: boolean;
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
};

type MetricCardProps = {
  title: string;
  value: string;
  subtext: string;
  trend?: string;
  icon: React.ReactNode;
};

export function RoutingView() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('channels');

  return (
    <div className="flex h-full bg-slate-50 dark:bg-[#121212] text-slate-700 dark:text-slate-300 relative overflow-hidden animate-in fade-in duration-300">

      {/* Left Navigation Area */}
      <div className="w-[220px] bg-white dark:bg-[#1e1e1e] border-r border-slate-200 dark:border-white/5 flex flex-col pt-6 shrink-0 z-10 hidden md:flex">
        <div className="px-5 mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-blue-500" /> {t("console.core.consolelayout.text.1x2j5b5", "本地路由")}</h2>
          <p className="text-xs text-slate-500 mt-2">{t("console.routing.routingview.text.7xsw6p", "API 路由网关控制平面")}</p>
        </div>

        <div className="flex flex-col px-3 space-y-1">
          <NavItem active={activeTab === 'channels'} onClick={() => setActiveTab('channels')} icon={<Server className="w-4 h-4" />} text={t("console.routing.routingview.text.184dsbn", "渠道账号")} />
          <NavItem active={activeTab === 'strategy'} onClick={() => setActiveTab('strategy')} icon={<Zap className="w-4 h-4" />} text={t("console.routing.routingview.text.jbae6l", "路由与负载均衡")} />
          <NavItem active={activeTab === 'fallback'} onClick={() => setActiveTab('fallback')} icon={<ShieldCheck className="w-4 h-4" />} text={t("console.routing.routingview.text.t90s34", "高可用与降级 (HA)")} />
          <div className="h-px bg-slate-200 dark:bg-white/5 my-2 mx-2"></div>
          <NavItem active={activeTab === 'apikeys'} onClick={() => setActiveTab('apikeys')} icon={<Key className="w-4 h-4" />} text={t("console.routing.components.apikeystab.text.i4nq0r", "API Key 令牌管理")} />
          <div className="h-px bg-slate-200 dark:bg-white/5 my-2 mx-2"></div>
          <NavItem active={activeTab === 'usage'} onClick={() => setActiveTab('usage')} icon={<LineChart className="w-4 h-4" />} text={t("console.routing.components.usagetab.text.nfli79", "调用记录统计")} />
          <NavItem active={activeTab === 'data'} onClick={() => setActiveTab('data')} icon={<FileJson className="w-4 h-4" />} text={t("console.routing.routingview.text.1dbc1b8", "请求数据审计")} />
          <NavItem active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} icon={<AlertTriangle className="w-4 h-4" />} text={t("console.routing.routingview.text.z67mbt", "失败拦截分析")} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-[#121212] overflow-y-auto relative">
        <div className="p-6 md:p-8 w-full  mx-auto space-y-8">

          {/* Top Global Metrics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard title={t("console.routing.routingview.text.1akxezw", "活跃路由通道")} value="12" subtext={t("console.routing.routingview.text.1ar6ucz", "个可用 endpoint")} trend={t("console.routing.routingview.text.10y9ibg", "+2 本周")} icon={<Link2 className="w-5 h-5 text-blue-400" />} />
            <MetricCard title={t("console.routing.routingview.text.1amhl2g", "全局负载策略")} value={t("console.routing.routingview.text.13uiy8p", "动态延迟")} subtext={t("console.routing.routingview.text.z0up3f", "基于最近1分钟 P90")} icon={<Activity className="w-5 h-5 text-emerald-400" />} />
            <MetricCard title={t("console.routing.routingview.text.mbajnh", "熔断干预次数")} value="34" subtext={t("console.routing.routingview.text.1xbv77z", "次 (过去 24h)")} trend={t("console.routing.routingview.text.yzbqat", "-12% 环比")} icon={<ShieldCheck className="w-5 h-5 text-amber-400" />} />
            <MetricCard title={t("console.routing.routingview.text.16wa928", "近期失败率")} value="0.08%" subtext="1.2k reqs/min" trend={t("console.routing.components.channelstab.text.zwn6k5", "健康")} icon={<HeartbeatIcon />} />
          </div>

          <div className="mt-8 border-t border-slate-200 dark:border-white/5 pt-8">
            {activeTab === 'channels' && <ChannelsTab />}
            {activeTab === 'strategy' && <StrategyTab />}
            {activeTab === 'fallback' && <FallbackTab />}
            {activeTab === 'apikeys' && <ApiKeysTab />}
            {activeTab === 'usage' && <UsageTab />}
            {activeTab === 'data' && <RequestDataTab />}
            {activeTab === 'logs' && <LogsTab />}
          </div>

        </div>
      </div>

    </div>
  );
}

function NavItem({ active, icon, text, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full min-w-0 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-blue-500/10 text-blue-400'
          : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-700 dark:text-slate-300'
      }`}
    >
      <span className="shrink-0">{icon}</span>
      <span className="min-w-0 flex-1 truncate whitespace-nowrap text-left">{text}</span>
    </button>
  );
}

function MetricCard({ title, value, subtext, trend, icon }: MetricCardProps) {
  return (
    <div className="bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/5 rounded-xl p-5 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/5 flex items-center justify-center">
          {icon}
        </div>
        {trend && (
           <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">{trend}</span>
        )}
      </div>
      <h3 className="text-sm font-medium text-slate-400">{title}</h3>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-900 dark:text-white">{value}</span>
        <span className="text-xs text-slate-500">{subtext}</span>
      </div>
    </div>
  );
}

function HeartbeatIcon() {
  return <svg className="w-5 h-5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>;
}
