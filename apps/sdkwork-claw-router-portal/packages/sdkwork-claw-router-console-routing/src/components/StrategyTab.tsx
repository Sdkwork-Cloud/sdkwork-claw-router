import React, { useCallback, useState, useEffect } from 'react';
import { Settings, Zap, RotateCcw, Box, Plus, X, ArrowRight } from 'lucide-react';
import { BusinessStatePanel } from 'sdkwork-claw-router-commons';
import { RoutingService, type MappingRule, type StrategyType } from '../routingService';
import { createMappingRuleDraft, hasDuplicateSourceModel, isValidMappingModelName } from '../strategyRules';

function getStrategyErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

export function StrategyTab() {
  const [activeStrategy, setActiveStrategy] = useState<StrategyType>('latency');
  const [showMappingModal, setShowMappingModal] = useState(false);
  const [mappingRules, setMappingRules] = useState<MappingRule[]>([]);
  const [newSource, setNewSource] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [loadingStrategy, setLoadingStrategy] = useState(true);
  const [savingStrategy, setSavingStrategy] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const loadStrategy = useCallback(async (isActive: () => boolean = () => true) => {
    setLoadingStrategy(true);
    setLoadError(null);
    try {
      const snapshot = await RoutingService.fetchStrategy();
      if (isActive()) {
        setActiveStrategy(snapshot.strategy);
        setMappingRules(snapshot.mappingRules);
      }
    } catch (error) {
      if (isActive()) {
        setLoadError(getStrategyErrorMessage(error, 'Failed to load routing strategy.'));
      }
    } finally {
      if (isActive()) {
        setLoadingStrategy(false);
      }
    }
  }, []);

  useEffect(() => {
    let active = true;
    void loadStrategy(() => active);
    return () => {
      active = false;
    };
  }, [loadStrategy]);

  const persistStrategy = useCallback(async (strategy: StrategyType, rules: MappingRule[]) => {
    setSavingStrategy(true);
    setSaveError(null);
    setSaveSuccess(null);
    try {
      await RoutingService.updateStrategy({ strategy, mappingRules: rules });
      setSaveSuccess('Routing strategy saved.');
    } catch (error) {
      setSaveError(getStrategyErrorMessage(error, 'Failed to save routing strategy.'));
      await loadStrategy();
    } finally {
      setSavingStrategy(false);
    }
  }, [loadStrategy]);

  const handleStrategyChange = (strategy: StrategyType) => {
    setActiveStrategy(strategy);
    void persistStrategy(strategy, mappingRules);
  };

  const addMappingRule = () => {
    const sourceModel = newSource.trim();
    const targetModel = newTarget.trim();
    if (!isValidMappingModelName(sourceModel) || !isValidMappingModelName(targetModel)) return;
    if (hasDuplicateSourceModel(mappingRules, sourceModel)) return;
    const newRule = createMappingRuleDraft(mappingRules, sourceModel, targetModel);
    const updatedRules = [...mappingRules, newRule];
    setMappingRules(updatedRules);
    void persistStrategy(activeStrategy, updatedRules);
    setNewSource('');
    setNewTarget('');
  };

  const removeMappingRule = (id: string) => {
    const updatedRules = mappingRules.filter(r => r.id !== id);
    setMappingRules(updatedRules);
    void persistStrategy(activeStrategy, updatedRules);
  };

  return (
    <div data-business-state={loadError ? 'error' : undefined} className="animate-in fade-in duration-300">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">负载均衡与分发策略</h3>
        <p className="text-sm text-slate-500 mt-1">全局定义如何将模型请求调度分发给后端的多个渠道端点。</p>
      </div>

      {loadingStrategy ? (
        <BusinessStatePanel
          kind="loading"
          title="Loading routing strategy..."
          className="min-h-64 rounded-xl border border-slate-200 bg-white dark:border-white/5 dark:bg-[#252525]"
        />
      ) : loadError ? (
        <BusinessStatePanel
          kind="error"
          title="Routing strategy could not be loaded"
          description={loadError}
          onRetry={() => { void loadStrategy(); }}
          className="min-h-64 rounded-xl border border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-500/10"
        />
      ) : (
        <>
      {saveError ? (
        <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
          {saveError}
        </div>
      ) : null}
      {saveSuccess ? (
        <div role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
          {saveSuccess}
        </div>
      ) : null}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Strategy Options */}
        <div className="lg:col-span-2 space-y-4">
          <StrategyOption
            title="动态延迟最低 (Lowest Latency)"
            desc="系统后台持续测速，优先将请求分配给最近 1 分钟内响应最快的节点。"
            active={activeStrategy === 'latency'}
            onClick={() => handleStrategyChange('latency')}
            icon={<Zap className="w-5 h-5 text-amber-400" />}
            disabled={savingStrategy}
          />
          <StrategyOption
            title="加权轮询 (Weighted Round Robin)"
            desc="根据渠道配置中的 Weight 参数，按比例轮询分配流量。适合混合昂贵与低价接口。"
            active={activeStrategy === 'weighted'}
            onClick={() => handleStrategyChange('weighted')}
            icon={<RotateCcw className="w-5 h-5 text-blue-400" />}
            disabled={savingStrategy}
          />
          <StrategyOption
            title="按使用成本 (Cost Optimised)"
            desc="尝试使用成本最低的可用渠道，仅在故障时切换到昂贵渠道。"
            active={activeStrategy === 'cost'}
            onClick={() => handleStrategyChange('cost')}
            icon={<Box className="w-5 h-5 text-emerald-400" />}
            disabled={savingStrategy}
          />
        </div>

        {/* Info Box */}
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-5 self-start">
          <Settings className="w-6 h-6 text-blue-400 mb-3" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">模型重写 (Model Remap)</h4>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            启用负载均衡后，建议开启<b>统一模型映射</b>功能。
            例如客户端统一请求 <code>gpt-4</code>，网关可自动映射路由至 <code>azure-gpt4-32k</code> 或 <code>claude-3-opus</code>。
          </p>

          <div className="space-y-2 mb-4">
            {mappingRules.slice(0, 3).map(rule => (
              <div key={rule.id} className="flex items-center gap-2 text-xs bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/5 p-2 rounded">
                <span className="text-slate-600 dark:text-slate-300 truncate w-20">{rule.sourceModel}</span>
                <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="text-blue-500 font-medium truncate flex-1">{rule.targetModel}</span>
              </div>
            ))}
            {mappingRules.length > 3 && (
              <div className="text-xs text-slate-500 text-center py-1">
                + {mappingRules.length - 3} 更多规则
              </div>
            )}
            {mappingRules.length === 0 && (
              <div className="text-xs text-slate-500 text-center py-2">
                暂无映射规则
              </div>
            )}
          </div>

          <button
            onClick={() => setShowMappingModal(true)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold py-2 rounded transition-colors"
          >
            管理映射规则
          </button>
        </div>
      </div>

      {/* Mapping Rules Modal */}
      {showMappingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-4 border-b border-slate-200 dark:border-white/5 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-500" />
                模型映射规则 (Model Remap)
              </h3>
              <button
                onClick={() => setShowMappingModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1">
              <div className="mb-4 text-sm text-slate-500 dark:text-slate-400">
                定义客户端请求的模型名称如何映射到真实的后端渠道模型名称。
              </div>

              {/* Add new rule */}
              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  placeholder="请求模型 (如: gpt-4)"
                  value={newSource}
                  onChange={e => setNewSource(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="目标模型 (如: azure-gpt4-32k)"
                  value={newTarget}
                  onChange={e => setNewTarget(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white"
                />
                <button
                  onClick={addMappingRule}
                  disabled={!newSource.trim() || !newTarget.trim() || savingStrategy}
                  className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-2 rounded-md transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Rules List */}
              <div className="space-y-2">
                {mappingRules.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-sm">
                    暂无映射规则
                  </div>
                ) : (
                  mappingRules.map(rule => (
                    <div key={rule.id} className="flex items-center justify-between bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/5 p-3 rounded-lg group">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-slate-700 dark:text-slate-200 text-sm">{rule.sourceModel}</span>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                        <span className="text-blue-500 font-medium text-sm">{rule.targetModel}</span>
                      </div>
                      <button
                        onClick={() => removeMappingRule(rule.id)}
                        disabled={savingStrategy}
                        className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-black/20 flex justify-end">
              <button
                onClick={() => setShowMappingModal(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/20 text-slate-800 dark:text-white text-sm font-medium rounded-md transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}

type StrategyOptionProps = {
  title: string;
  desc: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
};

function StrategyOption({ title, desc, icon, active, onClick, disabled = false }: StrategyOptionProps) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      aria-disabled={disabled}
      className={`p-5 rounded-xl border flex gap-4 cursor-pointer transition-all ${
        active ? 'bg-blue-500/10 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'bg-white dark:bg-[#252525] border-slate-200 dark:border-white/5 hover:border-white/20'
      } ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}>
       <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${active ? 'bg-blue-500/20' : 'bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/5'}`}>
         {icon}
       </div>
       <div className="flex-1">
         <div className="flex justify-between items-start">
           <h4 className={`text-base font-bold ${active ? 'text-blue-400' : 'text-slate-200'}`}>{title}</h4>
           {active && <span className="flex h-3 w-3"><span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span></span>}
         </div>
         <p className="text-sm text-slate-500 mt-1 leading-relaxed">{desc}</p>
       </div>
    </div>
  );
}
