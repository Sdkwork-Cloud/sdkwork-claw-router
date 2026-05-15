import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Check, Cloud, Cpu, Search } from 'lucide-react';
import { BusinessStatePanel } from 'sdkwork-claw-router-commons';
import { ProviderService, type ProviderConfig, type ProviderFamily } from './providerService';

const readOnlyProviderActions =
  'Read-only provider inventory. Create, edit, activate, and delete provider configurations from the backend provider administration console.';

type CategoryItemProps = {
  providerFamily: ProviderFamily;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onSelect: (providerFamily: ProviderFamily) => void;
};

function getLoadErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

export function ProvidersView() {
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
        setLoadError(getLoadErrorMessage(error, 'Failed to load provider configurations.'));
      }
    } finally {
      if (isActive()) {
        setLoading(false);
      }
    }
  }, []);

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
            <span className="text-white font-medium">{currentProviders.length} providers</span>
            <p className="text-slate-500 text-xs mt-1">Search and inspect live provider routing inventory.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden xl:block max-w-[440px] text-right text-[11px] leading-relaxed text-slate-500">
              {readOnlyProviderActions}
            </div>
            <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300">
              Read-only
            </span>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search providers"
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
              title="Loading providers..."
              className="min-h-80 rounded-xl border border-white/10 bg-white/5"
            />
          ) : loadError ? (
            <BusinessStatePanel
              kind="error"
              title="Provider configurations could not be loaded"
              description={loadError}
              onRetry={() => void loadProviders()}
              className="min-h-80 rounded-xl border border-white/10 bg-white/5"
            />
          ) : currentProviders.length === 0 ? (
            <BusinessStatePanel
              kind="empty"
              title={`No ${selectedProviderFamily} providers found`}
              description={
                providers.length === 0
                  ? readOnlyProviderActions
                  : 'Adjust the search query or provider category to find matching configurations.'
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
                active
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
          {isActive ? 'In use' : 'Inactive'}
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
