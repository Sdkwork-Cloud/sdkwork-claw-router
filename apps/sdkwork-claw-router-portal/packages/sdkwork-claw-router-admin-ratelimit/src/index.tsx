import React, { useCallback, useEffect, useState } from 'react';
import { ShieldAlert, Plus, Search, Globe, Key, Database, X, Lock, Gauge, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { BusinessStateTableRow, ConfirmDialog } from 'sdkwork-claw-router-commons';
import { RateLimitService, IpLimitRule, TokenLimitRule, ModelLimitRule, FirewallRule } from './ratelimitService';
import {
  createFirewallInputFromForm,
  createIpLimitInputFromForm,
  createModelLimitInputFromForm,
  createTokenLimitInputFromForm,
} from './ratelimitForm';

const RATELIMIT_TABS = [
  { id: 'dashboard', label: '风控拦截总览', icon: <Gauge className="w-4 h-4" /> },
  { id: 'ip', label: 'IP访问限流', icon: <Globe className="w-4 h-4" /> },
  { id: 'token', label: '令牌限额', icon: <Key className="w-4 h-4" /> },
  { id: 'model', label: '模型频控策略', icon: <Database className="w-4 h-4" /> },
  { id: 'firewall', label: '黑白名单(WAF)', icon: <Lock className="w-4 h-4" /> },
];

export function RateLimitAdmin() {
  const [activeTab, setActiveTab] = useState('ip');
  const [search, setSearch] = useState('');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <RiskDashboardView />;
      case 'ip':
        return <IpRateLimitView search={search} setSearch={setSearch} />;
      case 'token':
        return <TokenRateLimitView search={search} setSearch={setSearch} />;
      case 'model':
        return <ModelRateLimitView search={search} setSearch={setSearch} />;
      case 'firewall':
        return <FirewallView search={search} setSearch={setSearch} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex overflow-hidden border border-slate-200 dark:border-white/10 rounded-xl bg-white dark:bg-[#1a1a1a] shadow-sm">
      {/* Internal Sidebar */}
      <div className="w-64 border-r border-slate-200 dark:border-white/10 flex flex-col bg-slate-50 dark:bg-[#121212] shrink-0">
        <div className="p-5 border-b border-slate-200 dark:border-white/10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            限流与安全风控
          </h2>
          <p className="text-xs text-slate-500 mt-1">全局流量控制及访问频率防护规则</p>
        </div>
        <div className="flex-1 py-4 flex flex-col gap-1 px-3 overflow-y-auto">
          {RATELIMIT_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSearch('');
              }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col bg-white dark:bg-[#1a1a1a]">
        {renderContent()}
      </div>
    </div>
  );
}

// 1. 全局风控大盘
function RiskDashboardView() {
  const [snapshot, setSnapshot] = useState<{
    ipLimits: IpLimitRule[];
    tokenLimits: TokenLimitRule[];
    modelLimits: ModelLimitRule[];
    firewallRules: FirewallRule[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadDashboard = useCallback(async (isActive: () => boolean = () => true) => {
    setLoading(true);
    setLoadError(null);
    try {
      const [ipLimits, tokenLimits, modelLimits, firewallRules] = await Promise.all([
        RateLimitService.fetchIpLimits(),
        RateLimitService.fetchTokenLimits(),
        RateLimitService.fetchModelLimits(),
        RateLimitService.fetchFirewalls(),
      ]);
      if (isActive()) {
        setSnapshot({ ipLimits, tokenLimits, modelLimits, firewallRules });
      }
    } catch (error) {
      if (isActive()) {
        setSnapshot(null);
        setLoadError(getLoadErrorMessage(error, 'Failed to load risk control dashboard.'));
      }
    } finally {
      if (isActive()) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let active = true;
    void loadDashboard(() => active);
    return () => {
      active = false;
    };
  }, [loadDashboard]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
        <Loader2 className="w-8 h-8 mb-3 animate-spin text-red-500" />
        <span className="text-sm">Loading risk control rule aggregates...</span>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 text-slate-500">
        <AlertTriangle className="w-10 h-10 mb-3 text-amber-500" />
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">风控规则概览加载失败</h3>
        <p className="text-sm max-w-lg mb-4">{loadError}</p>
        <button
          type="button"
          onClick={() => void loadDashboard()}
          className="px-4 py-2 rounded-lg bg-red-600 text-sm font-medium text-white hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const ipLimits = snapshot?.ipLimits ?? [];
  const tokenLimits = snapshot?.tokenLimits ?? [];
  const modelLimits = snapshot?.modelLimits ?? [];
  const firewallRules = snapshot?.firewallRules ?? [];
  const activeIpLimits = ipLimits.filter(rule => rule.status === 'active').length;
  const exhaustedTokenLimits = tokenLimits.filter(rule => rule.status === 'exhausted').length;
  const activeModelLimits = modelLimits.filter(rule => rule.status === 'active').length;
  const totalFirewallRules = firewallRules.length;
  const totalConfiguredRules = ipLimits.length + tokenLimits.length + modelLimits.length + firewallRules.length;

  return (
    <div className="flex-1 overflow-auto p-5 space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Gauge className="w-5 h-5 text-red-500" />
          安全防护规则概览
        </h3>
        <p className="text-sm text-slate-500 mt-1">基于当前后端已配置的限流、限额和 WAF 规则汇总。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: '生效 IP 限流', value: activeIpLimits, detail: `${ipLimits.length} 条 IP 规则`, icon: Globe, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
          { title: '耗尽令牌限额', value: exhaustedTokenLimits, detail: `${tokenLimits.length} 条 API Key 规则`, icon: Key, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
          { title: '强制模型频控', value: activeModelLimits, detail: `${modelLimits.length} 条模型规则`, icon: Database, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' },
          { title: 'WAF 名单规则', value: totalFirewallRules, detail: `${totalConfiguredRules} 条总规则`, icon: Lock, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10' },
        ].map(item => (
          <div key={item.title} className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{item.title}</p>
              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{item.value}</p>
              <p className="mt-1 text-xs text-slate-500">{item.detail}</p>
            </div>
            <div className={`p-3 rounded-lg ${item.bg} ${item.color}`}>
              <item.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl p-5 shadow-sm">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">最高 IP RPS 限制</h4>
          <div className="space-y-3">
            {[...ipLimits].sort((a, b) => b.rps - a.rps).slice(0, 5).map(rule => (
              <div key={rule.id} className="flex items-center justify-between gap-4 text-sm">
                <div className="min-w-0">
                  <div className="font-medium text-slate-900 dark:text-white truncate">{rule.ruleName}</div>
                  <div className="text-xs text-slate-500 font-mono truncate">{rule.targetIp}</div>
                </div>
                <div className="font-mono text-red-600 dark:text-red-400">{rule.rps} rps</div>
              </div>
            ))}
            {ipLimits.length === 0 && <p className="text-sm text-slate-500">No IP rate limit rules configured.</p>}
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl p-5 shadow-sm">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">模型频控覆盖</h4>
          <div className="space-y-3">
            {[...modelLimits].sort((a, b) => b.tpm - a.tpm).slice(0, 5).map(rule => (
              <div key={rule.id} className="flex items-center justify-between gap-4 text-sm">
                <div className="min-w-0">
                  <div className="font-medium text-slate-900 dark:text-white truncate">{rule.model}</div>
                  <div className="text-xs text-slate-500 truncate">{rule.group}</div>
                </div>
                <div className="font-mono text-red-600 dark:text-red-400">{rule.tpm.toLocaleString()} tpm</div>
              </div>
            ))}
            {modelLimits.length === 0 && <p className="text-sm text-slate-500">No model rate limit rules configured.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function getLoadErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

// 2. IP访问限流
function IpRateLimitView({ search, setSearch }: { search: string, setSearch: (s: string) => void }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [limits, setLimits] = useState<IpLimitRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadIpLimits = useCallback(async (isActive: () => boolean = () => true) => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await RateLimitService.fetchIpLimits();
      if (isActive()) {
        setLimits(data);
      }
    } catch (error) {
      if (isActive()) {
        setLoadError(getLoadErrorMessage(error, 'Failed to load IP limit rules.'));
      }
    } finally {
      if (isActive()) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let active = true;
    void loadIpLimits(() => active);
    return () => {
      active = false;
    };
  }, [loadIpLimits]);

  const handleAddRule = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const added = await RateLimitService.addIpLimit(createIpLimitInputFromForm(formData));
    setLimits(current => [added, ...current]);
    setLoadError(null);
    setIsModalOpen(false);
  };

  const filteredLimits = limits.filter(r => r.ruleName.toLowerCase().includes(search.toLowerCase()) || r.targetIp.includes(search));

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-5 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50/50 dark:bg-[#121212]/50">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Globe className="w-5 h-5 text-slate-400" />
          IP 层面限流配置
        </h3>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="搜索规则或IP网段..." value={search} onChange={e => setSearch(e.target.value)} className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-red-500 w-64 text-slate-900 dark:text-white" />
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> 新增IP限流规则
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-5 relative">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 rounded-lg overflow-hidden">
          <thead className="bg-slate-50 dark:bg-[#121212] border-b border-slate-200 dark:border-white/10">
            <tr>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">规则名</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">目标 IP/网段</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">每秒请求限制 (RPS)</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">每分钟请求限制 (RPM)</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">惩罚封禁时长</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">状态</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/5 bg-white dark:bg-transparent">
            {loading ? (
              <BusinessStateTableRow colSpan={6} kind="loading" title="Loading IP limit rules..." />
            ) : loadError ? (
              <BusinessStateTableRow
                colSpan={6}
                kind="error"
                title="IP limit rules could not be loaded"
                description={loadError}
                onRetry={() => void loadIpLimits()}
              />
            ) : filteredLimits.length === 0 ? (
              <BusinessStateTableRow
                colSpan={6}
                kind="empty"
                title="No IP limit rules found"
                description="Create a rule to control request rates for an IP address or CIDR range."
                action={{ label: 'Add IP rule', onClick: () => setIsModalOpen(true) }}
              />
            ) : filteredLimits.map(rule => (
              <tr key={rule.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-200">{rule.ruleName}</td>
                <td className="px-4 py-3 font-mono text-blue-600 dark:text-blue-400"><span className="bg-slate-100 dark:bg-white/10 px-2 py-1 rounded">{rule.targetIp}</span></td>
                <td className="px-4 py-3 font-mono">{rule.rps} req/s</td>
                <td className="px-4 py-3 font-mono">{rule.rpm} req/m</td>
                <td className="px-4 py-3 text-red-600 dark:text-red-400 text-xs font-semibold">{rule.blockDuration}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${rule.status === 'active' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400'}`}>{rule.status === 'active' ? '生效中' : '已停用'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-white/10">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">配置IP限流规则</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRule} className="flex flex-col flex-1">
              <div className="p-5 space-y-4 flex-1">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">规则名称</label>
                  <input required name="ruleName" type="text" placeholder="例如: 恶意爬虫防护" className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500 text-slate-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">目标IP网段</label>
                  <input required name="targetIp" type="text" placeholder="0.0.0.0/0 (代表全部)" className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500 text-slate-900 dark:text-white font-mono" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">每秒限制 (RPS)</label>
                    <input required name="rps" type="number" min="1" step="1" placeholder="10" className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500 text-slate-900 dark:text-white font-mono" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">每分钟限制 (RPM)</label>
                    <input required name="rpm" type="number" min="1" step="1" placeholder="300" className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500 text-slate-900 dark:text-white font-mono" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">惩罚封禁时长</label>
                  <input required name="blockDuration" type="text" placeholder="例如: 10m, 1h, 24h" className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500 text-slate-900 dark:text-white font-mono" />
                </div>
              </div>
              <div className="p-5 border-t border-slate-200 dark:border-white/10 flex justify-end gap-3 bg-slate-50 dark:bg-[#121212] rounded-b-2xl">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg transition-colors">
                  取消
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors">
                  确认添加
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// 3. 令牌与API Key限流
function TokenRateLimitView({ search, setSearch }: { search: string, setSearch: (s: string) => void }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [limits, setLimits] = useState<TokenLimitRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadTokenLimits = useCallback(async (isActive: () => boolean = () => true) => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await RateLimitService.fetchTokenLimits();
      if (isActive()) {
        setLimits(data);
      }
    } catch (error) {
      if (isActive()) {
        setLoadError(getLoadErrorMessage(error, 'Failed to load token limit rules.'));
      }
    } finally {
      if (isActive()) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let active = true;
    void loadTokenLimits(() => active);
    return () => {
      active = false;
    };
  }, [loadTokenLimits]);

  const handleAddTokenLimit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const added = await RateLimitService.addTokenLimit(createTokenLimitInputFromForm(formData));
    setLimits(current => [added, ...current]);
    setLoadError(null);
    setIsModalOpen(false);
  };

  const filteredLimits = limits.filter(t => t.user.toLowerCase().includes(search.toLowerCase()) || t.keyPrefix.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-5 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50/50 dark:bg-[#121212]/50">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Key className="w-5 h-5 text-slate-400" />
          API 密钥限速配置
        </h3>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="搜索 API 密钥或账户..." value={search} onChange={e => setSearch(e.target.value)} className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-red-500 w-64 text-slate-900 dark:text-white" />
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> 自定义限速
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-5 relative">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 rounded-lg overflow-hidden">
          <thead className="bg-slate-50 dark:bg-[#121212] border-b border-slate-200 dark:border-white/10">
            <tr>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">API Key (前缀)</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">关联用户</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">每秒限速 (RPS)</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">并发缓冲 (Burst)</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">每日调用上限 (RPD)</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">额度状态</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/5 bg-white dark:bg-transparent">
            {loading ? (
              <BusinessStateTableRow colSpan={6} kind="loading" title="Loading token limit rules..." />
            ) : loadError ? (
              <BusinessStateTableRow
                colSpan={6}
                kind="error"
                title="Token limit rules could not be loaded"
                description={loadError}
                onRetry={() => void loadTokenLimits()}
              />
            ) : filteredLimits.length === 0 ? (
              <BusinessStateTableRow
                colSpan={6}
                kind="empty"
                title="No token limit rules found"
                description="Create a token rule to control per-key request rates and daily quotas."
                action={{ label: 'Add token rule', onClick: () => setIsModalOpen(true) }}
              />
            ) : filteredLimits.map(token => (
              <tr key={token.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                <td className="px-4 py-3 font-mono text-xs">{token.keyPrefix}</td>
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-200">{token.user}</td>
                <td className="px-4 py-3 font-mono">{token.rps} rq/s</td>
                <td className="px-4 py-3 font-mono">{token.burst}</td>
                <td className="px-4 py-3 font-mono">{token.rpd} rq/d</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${token.status === 'active' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'}`}>{token.status === 'active' ? '健康可用' : '触发熔断'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-white/10">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                 <Key className="w-5 h-5 text-red-500" /> 添加自定义令牌限速
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTokenLimit} className="flex flex-col flex-1">
              <div className="p-5 space-y-4 flex-1">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">目标用户或邮箱</label>
                  <input required name="user" type="text" placeholder="例如: bob@corp.com" className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500 text-slate-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">API Key (留空影响所有此用户的Key)</label>
                  <input required name="keyPrefix" type="text" placeholder="sk-proj-..." className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500 text-slate-900 dark:text-white font-mono" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">RPS</label>
                    <input required name="rps" type="number" min="1" step="1" placeholder="5" className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500 text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Burst</label>
                    <input required name="burst" type="number" min="1" step="1" placeholder="10" className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500 text-slate-900 dark:text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">RPD</label>
                  <input required name="rpd" type="number" min="1" step="1" placeholder="1000" className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500 text-slate-900 dark:text-white" />
                </div>
              </div>
              <div className="p-5 border-t border-slate-200 dark:border-white/10 flex justify-end gap-3 bg-slate-50 dark:bg-[#121212]">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium bg-white dark:bg-[#1a1a1a] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 rounded-lg">取消</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg">确定</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// 4. 特定模型频控 (TPM/RPM)
function ModelRateLimitView({ search, setSearch }: { search: string, setSearch: (s: string) => void }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [limits, setLimits] = useState<ModelLimitRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadModelLimits = useCallback(async (isActive: () => boolean = () => true) => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await RateLimitService.fetchModelLimits();
      if (isActive()) {
        setLimits(data);
      }
    } catch (error) {
      if (isActive()) {
        setLoadError(getLoadErrorMessage(error, 'Failed to load model limit rules.'));
      }
    } finally {
      if (isActive()) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let active = true;
    void loadModelLimits(() => active);
    return () => {
      active = false;
    };
  }, [loadModelLimits]);

  const handleAddModelLimit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const added = await RateLimitService.addModelLimit(createModelLimitInputFromForm(formData));
    setLimits(current => [added, ...current]);
    setLoadError(null);
    setIsModalOpen(false);
  };

  const filteredLimits = limits.filter(m => m.model.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-5 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50/50 dark:bg-[#121212]/50">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-slate-400" />
          模型级频控与令牌速率限制
        </h3>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="搜索模型名称..." value={search} onChange={e => setSearch(e.target.value)} className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-red-500 w-64 text-slate-900 dark:text-white" />
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> 覆盖默认限速
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-5 relative">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 rounded-lg overflow-hidden">
          <thead className="bg-slate-50 dark:bg-[#121212] border-b border-slate-200 dark:border-white/10">
            <tr>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">高净值模型</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">作用范围 (用户分组)</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">分钟级请求限度 (RPM)</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">分钟级Token吞吐 (TPM)</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">控制状态</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/5 bg-white dark:bg-transparent">
             {loading ? (
               <BusinessStateTableRow colSpan={5} kind="loading" title="Loading model limit rules..." />
             ) : loadError ? (
               <BusinessStateTableRow
                 colSpan={5}
                 kind="error"
                 title="Model limit rules could not be loaded"
                 description={loadError}
                 onRetry={() => void loadModelLimits()}
               />
             ) : filteredLimits.length === 0 ? (
               <BusinessStateTableRow
                 colSpan={5}
                 kind="empty"
                 title="No model limit rules found"
                 description="Create a model rule to control RPM and TPM limits for a model and group."
                 action={{ label: 'Add model rule', onClick: () => setIsModalOpen(true) }}
               />
             ) : filteredLimits.map(m => (
               <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                 <td className="px-4 py-3 font-medium font-mono text-slate-900 dark:text-slate-200"><span className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 px-2 py-1 rounded text-xs">{m.model}</span></td>
                 <td className="px-4 py-3">{m.group}</td>
                 <td className="px-4 py-3 font-mono text-red-600 dark:text-red-400">{m.rpm} <span className="text-slate-400 text-xs font-sans">RPM</span></td>
                 <td className="px-4 py-3 font-mono text-red-600 dark:text-red-400">{m.tpm} <span className="text-slate-400 text-xs font-sans">TPM</span></td>
                 <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${m.status === 'active' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400'}`}>{m.status === 'active' ? '强制控制中' : '静默监控'}</span>
                 </td>
               </tr>
             ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-white/10">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                 <Database className="w-5 h-5 text-red-500" /> 新建模型限速规则
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddModelLimit} className="flex flex-col flex-1">
              <div className="p-5 space-y-4 flex-1">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">目标模型</label>
                  <input required name="model" type="text" placeholder="例如: gpt-4" className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500 text-slate-900 dark:text-white font-mono" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">作用范围 (用户分组)</label>
                  <input required name="group" type="text" placeholder="例如: 默认分组" className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500 text-slate-900 dark:text-white" defaultValue="默认分组" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">分钟级请求限度 (RPM)</label>
                    <input required name="rpm" type="number" min="1" step="1" placeholder="5" className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500 text-slate-900 dark:text-white font-mono" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">分钟级Token吞吐 (TPM)</label>
                    <input required name="tpm" type="number" min="1" step="1" placeholder="20000" className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500 text-slate-900 dark:text-white font-mono" />
                  </div>
                </div>
              </div>
              <div className="p-5 border-t border-slate-200 dark:border-white/10 flex justify-end gap-3 bg-slate-50 dark:bg-[#121212]">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium bg-white dark:bg-[#1a1a1a] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 rounded-lg">取消</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg">确定</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// 5. WAF
function FirewallView({ search, setSearch }: { search: string, setSearch: (s: string) => void }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rules, setRules] = useState<FirewallRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [removeTarget, setRemoveTarget] = useState<FirewallRule | null>(null);
  const [removingFirewallId, setRemovingFirewallId] = useState<string | null>(null);

  const loadFirewalls = useCallback(async (isActive: () => boolean = () => true) => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await RateLimitService.fetchFirewalls();
      if (isActive()) {
        setRules(data);
      }
    } catch (error) {
      if (isActive()) {
        setLoadError(getLoadErrorMessage(error, 'Failed to load firewall rules.'));
      }
    } finally {
      if (isActive()) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let active = true;
    void loadFirewalls(() => active);
    return () => {
      active = false;
    };
  }, [loadFirewalls]);

  const handleAddFirewall = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const added = await RateLimitService.addFirewall(createFirewallInputFromForm(formData));
    setRules(current => [added, ...current]);
    setLoadError(null);
    setIsModalOpen(false);
  };

  const closeRemoveConfirmation = () => {
    if (removingFirewallId) {
      return;
    }
    setRemoveTarget(null);
  };

  const executeRemove = async () => {
    if (!removeTarget) {
      return;
    }
    const id = removeTarget.id;
    setRemovingFirewallId(id);
    try {
      const ok = await RateLimitService.removeFirewall(id);
      if (ok) {
        setRules(current => current.filter(r => r.id !== id));
      }
      setRemoveTarget(null);
    } finally {
      setRemovingFirewallId(null);
    }
  };

  const filteredRules = rules.filter(f => f.value.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-5 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50/50 dark:bg-[#121212]/50">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-slate-400" />
          系统防火墙黑白名单规则
        </h3>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="搜索拦截对象..." value={search} onChange={e => setSearch(e.target.value)} className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-red-500 w-64 text-slate-900 dark:text-white" />
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> 封禁新对象
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-5 relative">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 rounded-lg overflow-hidden">
          <thead className="bg-slate-50 dark:bg-[#121212] border-b border-slate-200 dark:border-white/10">
            <tr>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">名单类型</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">拦截/放行对象</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">拦截原因 / 备注</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">处置时间</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-white">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/5 bg-white dark:bg-transparent">
             {loading ? (
               <BusinessStateTableRow colSpan={5} kind="loading" title="Loading firewall rules..." />
             ) : loadError ? (
               <BusinessStateTableRow
                 colSpan={5}
                 kind="error"
                 title="Firewall rules could not be loaded"
                 description={loadError}
                 onRetry={() => void loadFirewalls()}
               />
             ) : filteredRules.length === 0 ? (
               <BusinessStateTableRow
                 colSpan={5}
                 kind="empty"
                 title="No firewall rules found"
                 description="Create a firewall rule to block or allow a specific IP, range, or identity."
                 action={{ label: 'Add firewall rule', onClick: () => setIsModalOpen(true) }}
               />
             ) : filteredRules.map(f => (
               <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                 <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-200">{f.type}</td>
                 <td className="px-4 py-3 font-mono font-medium text-red-600 dark:text-red-400">{f.value}</td>
                 <td className="px-4 py-3 text-slate-500">{f.reason}</td>
                 <td className="px-4 py-3 text-xs text-slate-500">{f.time}</td>
                 <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => setRemoveTarget(f)}
                    disabled={removingFirewallId === f.id}
                    className="text-slate-400 hover:text-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-xs border border-slate-200 dark:border-white/10 px-2 py-1 rounded"
                  >
                    解除
                  </button>
                 </td>
               </tr>
             ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-white/10">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                 <Lock className="w-5 h-5 text-red-500" /> 添加系统防火墙拦截规则
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddFirewall} className="flex flex-col flex-1">
              <div className="p-5 space-y-4 flex-1">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">拦截/放行对象</label>
                  <input required name="value" type="text" placeholder="IP, IP段 或 邮箱后缀" className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500 text-slate-900 dark:text-white font-mono" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">名单类型</label>
                  <select required name="type" className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500 text-slate-900 dark:text-white">
                    <option value="IP 黑名单屏蔽">IP 黑名单屏蔽 (拒绝所有请求)</option>
                    <option value="邮箱黑名单">邮箱黑名单 (禁止注册/使用)</option>
                    <option value="IP 白名单">IP 白名单 (豁免限流)</option>
                    <option value="邮箱白名单">邮箱白名单 (豁免限流)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">处置原因</label>
                  <input required name="reason" type="text" placeholder="例如: 恶意撞库" className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500 text-slate-900 dark:text-white" />
                </div>
              </div>
              <div className="p-5 border-t border-slate-200 dark:border-white/10 flex justify-end gap-3 bg-slate-50 dark:bg-[#121212]">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium bg-white dark:bg-[#1a1a1a] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 rounded-lg">取消</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg">确定封禁</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {removeTarget && (
        <ConfirmDialog
          title="Remove firewall rule?"
          description={`This removes the firewall rule for "${removeTarget.value}". Traffic matching this object will no longer use this override after confirmation.`}
          confirmLabel="Remove rule"
          tone="danger"
          icon={<Trash2 className="h-4 w-4" />}
          isBusy={removingFirewallId === removeTarget.id}
          onConfirm={() => void executeRemove()}
          onCancel={closeRemoveConfirmation}
        />
      )}
    </div>
  );
}
