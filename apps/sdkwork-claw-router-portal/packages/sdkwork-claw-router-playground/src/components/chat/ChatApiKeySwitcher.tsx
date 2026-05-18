import { useRef, useState } from 'react';
import { AlertCircle, Check, ChevronDown, Loader2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { ChatApiKeyOption } from './chatTypes';
import { usePopoverDismiss } from '../usePopoverDismiss';

export function ChatApiKeySwitcher({
  apiKeys,
  selectedApiKeyId,
  onSelectApiKey,
  loading,
  error,
  disabled = false,
}: {
  apiKeys: ChatApiKeyOption[];
  selectedApiKeyId: string;
  onSelectApiKey: (apiKeyId: string) => void;
  loading: boolean;
  error: string | null;
  disabled?: boolean;
}) {
  const { t } = useTranslation();
  const [showApiKeyMenu, setShowApiKeyMenu] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedApiKey = apiKeys.find((apiKey) => apiKey.id === selectedApiKeyId) || apiKeys[0];

  usePopoverDismiss(containerRef, showApiKeyMenu, () => setShowApiKeyMenu(false));

  if (loading) {
    return (
      <div className="flex min-h-[38px] w-full max-w-[136px] items-center gap-2 rounded-xl bg-[#202024]/70 px-3 text-xs text-slate-500">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        {t('playground.chat.apiKey.loading')}
      </div>
    );
  }

  if (apiKeys.length === 0) {
    return (
      <div className="flex min-h-[38px] w-full max-w-[136px] items-center justify-between gap-2 rounded-xl bg-amber-500/10 px-3 text-xs text-amber-100">
        <div className="flex min-w-0 items-center gap-2">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{error || t('playground.chat.apiKey.empty')}</span>
        </div>
        <Link
          to="/console/api-keys"
          className="inline-flex shrink-0 items-center justify-center gap-1 rounded-lg bg-amber-300 px-2 py-1 font-semibold text-amber-950 transition-colors hover:bg-amber-200"
        >
          <Plus className="h-3 w-3" />
          {t('playground.chat.apiKey.create')}
        </Link>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-[136px]">
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            if (!disabled) {
              setShowApiKeyMenu(!showApiKeyMenu);
            }
          }}
          className="flex min-h-[38px] w-full items-center justify-between gap-2 rounded-xl bg-[#202024]/70 px-3 text-left text-xs text-slate-300 transition-colors hover:bg-[#24242a] disabled:cursor-not-allowed disabled:opacity-60"
          aria-expanded={showApiKeyMenu}
        >
          <span className="min-w-0 truncate whitespace-nowrap font-semibold text-slate-100">{selectedApiKey?.displayName}</span>
          <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-slate-500 transition-transform ${showApiKeyMenu ? 'rotate-180' : ''}`} />
        </button>

      {showApiKeyMenu && (
        <div className="absolute bottom-[calc(100%+8px)] left-0 z-50 max-h-[280px] w-[260px] max-w-[calc(100vw-32px)] overflow-hidden rounded-2xl bg-[#252528] shadow-2xl">
          <div className="border-b border-white/5 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {t('playground.chat.apiKey.label')}
          </div>
          <div className="custom-scrollbar max-h-[236px] overflow-y-auto p-1.5">
            {apiKeys.map((apiKey) => {
              const isActive = apiKey.id === selectedApiKey?.id;
              return (
                <button
                  key={apiKey.id}
                  type="button"
                  onClick={() => {
                    if (disabled) {
                      return;
                    }
                    onSelectApiKey(apiKey.id);
                    setShowApiKeyMenu(false);
                  }}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                    isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate whitespace-nowrap text-xs font-semibold">{apiKey.displayName}</span>
                    {apiKey.groupName && (
                      <span className="mt-1 block truncate text-[11px] text-slate-500">{apiKey.groupName}</span>
                    )}
                  </span>
                  {isActive && <Check className="h-4 w-4 shrink-0 text-cyan-300" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
