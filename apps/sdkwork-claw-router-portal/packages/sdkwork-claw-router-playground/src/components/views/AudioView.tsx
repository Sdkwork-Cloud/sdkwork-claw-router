import { ChevronDown, Headphones } from 'lucide-react';
import { PLAYGROUND_READ_ONLY_REASON, ReadOnlyPlaygroundButton } from '../ReadOnlyPlaygroundControl';
import { SharedHistoryView } from './SharedHistoryView';
import type { PlaygroundAssetViewProps } from '../../playgroundTypes';

export function AudioView({
  agentHistory,
  setPreviewItem,
  setSelectedModel,
  activeSelectedModel,
  activeModelOptions,
  showModelMenu,
  setShowModelMenu,
}: PlaygroundAssetViewProps) {
  return (
    <div className="relative z-10 flex h-full w-full flex-row bg-[#0a0a0a]">
      <div className="custom-scrollbar relative z-20 flex w-[450px] shrink-0 flex-col overflow-y-auto border-r border-white/5 bg-[#151515] xl:w-[510px]">
        <div className="mt-2 flex w-full flex-col gap-6 p-4">
          <div className="relative">
            <div onClick={() => setShowModelMenu(!showModelMenu)} className="flex cursor-pointer items-center justify-between rounded-xl border border-white/5 bg-[#1a1a1a] p-3 shadow-sm transition-colors hover:border-indigo-500/50">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 p-[1.5px]">
                  <div className="flex h-full w-full items-center justify-center rounded-[6px] bg-[#1a1a1a] font-mono text-[10px] font-bold text-white">{activeSelectedModel?.ver || 'Pro'}</div>
                </div>
                <div>
                  <div className="mb-0.5 text-[13px] font-bold tracking-wide text-slate-200">{activeSelectedModel?.name || 'Voice Pro'}</div>
                  <div className="line-clamp-1 text-[10px] tracking-wide text-slate-500">{activeSelectedModel?.desc || PLAYGROUND_READ_ONLY_REASON}</div>
                </div>
              </div>
              <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-slate-500 transition-transform duration-300 ${showModelMenu ? 'rotate-180' : ''}`} />
            </div>
            {showModelMenu && (
              <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 rounded-xl border border-white/10 bg-[#252528] py-1.5 shadow-2xl">
                {activeModelOptions.map((model) => (
                  <div key={model.name} onClick={() => { setSelectedModel(model.name); setShowModelMenu(false); }} className="cursor-pointer border-b border-white/5 p-3 text-sm font-bold tracking-wide text-slate-300 transition-colors last:border-b-0 hover:bg-white/5">
                    {model.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col overflow-hidden rounded-xl border border-white/5 bg-[#1a1a1a] shadow-sm focus-within:border-indigo-500/50">
            <textarea className="custom-scrollbar min-h-[160px] w-full resize-none bg-transparent p-4 text-sm text-white outline-none placeholder:text-slate-500" placeholder="Describe the voice or audio you want to generate..." />
            <div className="flex items-center justify-between border-t border-white/5 bg-[#1f1f1f] p-3">
              <ReadOnlyPlaygroundButton className="flex items-center gap-1.5 rounded border border-white/5 bg-[#252525] px-3 py-1.5 text-xs text-slate-300">
                <Headphones className="h-3.5 w-3.5 text-indigo-400" /> Voice settings
              </ReadOnlyPlaygroundButton>
              <ReadOnlyPlaygroundButton title={PLAYGROUND_READ_ONLY_REASON} className="rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 px-6 py-2 text-sm font-bold text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                Generate
              </ReadOnlyPlaygroundButton>
            </div>
          </div>
        </div>
      </div>

      <SharedHistoryView agentHistory={agentHistory} setPreviewItem={setPreviewItem} modality="audio" />
    </div>
  );
}
