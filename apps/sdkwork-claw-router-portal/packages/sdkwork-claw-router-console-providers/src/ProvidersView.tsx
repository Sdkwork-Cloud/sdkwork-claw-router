import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Check, Cloud, Cpu, Search } from 'lucide-react';
import { BusinessStatePanel } from 'sdkwork-claw-router-commons';
import { ProviderService, type ProviderConfig, type ProviderFamily } from './providerService';
import { useTranslation } from 'react-i18next';
type TranslationFunction = ReturnType<typeof useTranslation>['t'];

type CategoryItemProps = {
  providerFamily: ProviderFamily;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onSelect: (providerFamily: ProviderFamily) => void;
};

function getLoadErrorMessage(error: unknown, fallback: string, t: TranslationFunction): string {
  if (!(error instanceof Error) || !error.message) {
    return fallback;
  }
  return error.message.startsWith('console.') ? t(error.message, fallback) : error.message;
}

export function ProvidersView() {
  const { t } = useTranslation();
  const [selectedProviderFamily, setSelectedProviderFamily] = useState<ProviderFamily>('claude');
  const [search, setSearch] = useState('');
  const [providers, setProviders] = useState<ProviderConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadProviders = useCallback(async (isActive: () => boolean = () => true) => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await ProviderService.fetchProviders();
      if (isActive()) {
        setProviders(data);
      }
    } catch (error) {
      if (isActive()) {
        setLoadError(getLoadErrorMessage(
          error,
          t('console.providers.states.loadErrorFallback', '工具配置加载失败。'),
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
    void loadProviders(() => active);
    return () => {
      active = false;
    };
  }, [loadProviders]);

  const currentProviders = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return providers.filter((provider) => {
      const matchesFamily = provider.providerFamily === selectedProviderFamily;
      const searchable = [provider.name, provider.description, provider.url].join(' ').toLowerCase();
      return matchesFamily && (!keyword || searchable.includes(keyword));
    });
  }, [providers, search, selectedProviderFamily]);

  return (
    <div className="theme-aware-dark-surface flex h-full bg-slate-50 dark:bg-[#1e1e1e] text-slate-700 dark:text-slate-300 relative">
      <div className="w-[200px] border-r border-white/5 flex flex-col pt-6 shrink-0 z-10">
        <div className="flex flex-col gap-2 px-4">
          <CategoryItem
            providerFamily="claude"
            title="Claude"
            subtitle="ANTHROPIC"
            icon={<Cpu className="w-5 h-5 text-orange-400" />}
            isSelected={selectedProviderFamily === 'claude'}
            onSelect={setSelectedProviderFamily}
          />
          <CategoryItem
            providerFamily="codex"
            title="Codex"
            subtitle="OPENAI"
            icon={<Box className="w-5 h-5 text-emerald-400" />}
            isSelected={selectedProviderFamily === 'codex'}
            onSelect={setSelectedProviderFamily}
          />
          <CategoryItem
            providerFamily="gemini"
            title="Gemini"
            subtitle="GOOGLE"
            icon={<Cloud className="w-5 h-5 text-blue-400" />}
            isSelected={selectedProviderFamily === 'gemini'}
            onSelect={setSelectedProviderFamily}
          />
          <CategoryItem
            providerFamily="opencode"
            title="OpenCode"
            subtitle="ROUTER"
            icon={<Box className="w-5 h-5 text-slate-400" />}
            isSelected={selectedProviderFamily === 'opencode'}
            onSelect={setSelectedProviderFamily}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col pt-6 px-8 relative overflow-hidden">
        <div className="flex justify-between items-center mb-6 gap-6">
          <div className="text-sm">
            <span className="text-white font-medium">{t('console.providers.summaryCount', '{{count}} 个提供方', { count: currentProviders.length })}</span>
            <p className="text-slate-500 text-xs mt-1">{t('console.providers.summaryDescription', '查看当前可用的工具提供方和路由端点。')}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder={t('console.providers.searchPlaceholder', '搜索提供方')}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-white/20 transition-colors w-64"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <BusinessStatePanel
              kind="loading"
              title={t('console.providers.states.loading', '正在加载工具配置...')}
              className="min-h-80 rounded-xl border border-white/10 bg-white/5"
            />
          ) : loadError ? (
            <BusinessStatePanel
              kind="error"
              title={t('console.providers.states.loadErrorTitle', '工具配置加载失败')}
              description={loadError}
              onRetry={() => void loadProviders()}
              className="min-h-80 rounded-xl border border-white/10 bg-white/5"
            />
          ) : currentProviders.length === 0 ? (
            <BusinessStatePanel
              kind="empty"
              title={t('console.providers.states.emptyTitle', '未找到 {{name}} 提供方', { name: selectedProviderFamily })}
              description={
                providers.length === 0
                  ? t('console.providers.states.emptyNoDataDescription', '可用工具配置会在这里显示。')
                  : t('console.providers.states.emptySearchDescription', '调整搜索关键词或提供方分类以查找匹配配置。')
              }
              className="min-h-80 rounded-xl border border-dashed border-white/10 bg-white/5"
            />
          ) : (
            currentProviders.map((provider) => <ProviderRow key={provider.id} provider={provider} />)
          )}
        </div>
      </div>
    </div>
  );
}

function ProviderRow({ provider }: { provider: ProviderConfig }) {
  const { t } = useTranslation();
  const isActive = provider.status === 'active';

  return (
    <div
      className={`border rounded-xl p-4 flex items-center justify-between group transition-colors ${
        isActive ? 'border-emerald-500/50 bg-emerald-500/10' : 'bg-white/5 border-white/10 hover:border-white/20'
      }`}
    >
      <div className="flex items-center gap-4 min-w-0">
        <div
          className={`w-8 h-8 rounded overflow-hidden flex items-center justify-center text-xs font-bold font-mono shrink-0 ${
            isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white'
          }`}
        >
          {provider.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <h3 className="text-white font-medium flex items-center gap-2">
            <span className="truncate">{provider.name}</span>
            {isActive && (
              <span className="shrink-0 text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider border border-emerald-500/20">
                {t('console.providers.status.active', '启用中')}
              </span>
            )}
          </h3>
          <a
            href={provider.url}
            target="_blank"
            rel="noreferrer"
            className={`${
              isActive ? 'text-emerald-400/70 hover:text-emerald-400' : 'text-blue-400 hover:text-blue-300'
            } text-xs hover:underline mt-0.5 inline-block max-w-[520px] truncate`}
          >
            {provider.url}
          </a>
        </div>
      </div>
      <div
        className={`flex border rounded-md p-1 ml-4 gap-1 items-center px-3 shrink-0 ${
          isActive
            ? 'bg-emerald-500/20 border-emerald-500/30'
            : 'bg-white/5 border-white/10 text-slate-400'
        }`}
      >
        {isActive && <Check className="w-3.5 h-3.5 text-emerald-400" />}
        <span className={`text-xs font-medium tracking-wide ${isActive ? 'text-emerald-400' : 'text-slate-400'}`}>
          {isActive
            ? t('console.providers.status.inUse', '使用中')
            : t('console.providers.status.inactive', '未启用')}
        </span>
      </div>
    </div>
  );
}

function CategoryItem({ providerFamily, title, subtitle, icon, isSelected, onSelect }: CategoryItemProps) {
  return (
    <button
      onClick={() => onSelect(providerFamily)}
      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
        isSelected
          ? 'bg-white/5 border border-white/10 shadow-sm'
          : 'hover:bg-white/5 border border-transparent opacity-60 hover:opacity-100'
      }`}
    >
      <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="text-left flex-1 min-w-0">
        <div className="text-[10px] font-bold tracking-wider text-slate-500 leading-none mb-1 uppercase">{subtitle}</div>
        <div className={`text-sm font-medium truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>{title}</div>
      </div>
    </button>
  );
}
