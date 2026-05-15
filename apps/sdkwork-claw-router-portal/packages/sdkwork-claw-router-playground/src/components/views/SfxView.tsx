import { FileAudio } from 'lucide-react';
import { createFallbackModel, PlaygroundModelPicker } from '../PlaygroundModelPicker';
import { PLAYGROUND_READ_ONLY_REASON, ReadOnlyPlaygroundButton } from '../ReadOnlyPlaygroundControl';
import { SharedHistoryView } from './SharedHistoryView';
import type { PlaygroundAssetViewProps } from '../../playgroundTypes';

const FALLBACK_SFX_MODEL = createFallbackModel('SFX Engine', 'Sound effect generation contract pending', 'SFX', 'sfx');

export function SfxView({
  agentHistory,
  setPreviewItem,
  modelGroups,
  selectedModelId,
  setSelectedModelId,
  showModelMenu,
  setShowModelMenu,
}: PlaygroundAssetViewProps) {
  return (
    <div className="relative z-10 flex h-full w-full flex-row bg-[#0a0a0a]">
      <div className="custom-scrollbar relative z-20 flex w-[450px] shrink-0 flex-col overflow-y-auto border-r border-white/5 bg-[#151515] xl:w-[510px]">
        <div className="mt-2 flex w-full flex-col gap-6 p-4">
          <PlaygroundModelPicker
            bucket="sfx"
            modelGroups={modelGroups}
            selectedModelId={selectedModelId}
            onSelectModel={setSelectedModelId}
            showModelMenu={showModelMenu}
            setShowModelMenu={setShowModelMenu}
            fallback={FALLBACK_SFX_MODEL}
          />

          <div className="flex flex-col overflow-hidden rounded-xl border border-white/5 bg-[#1a1a1a] shadow-sm focus-within:border-indigo-500/50">
            <textarea className="custom-scrollbar min-h-[160px] w-full resize-none bg-transparent p-4 text-sm text-white outline-none placeholder:text-slate-500" placeholder="Describe the sound effect you want to generate..." />
            <div className="flex items-center justify-between border-t border-white/5 bg-[#1f1f1f] p-3">
              <ReadOnlyPlaygroundButton className="flex items-center gap-1.5 rounded border border-white/5 bg-[#252525] px-3 py-1.5 text-xs text-slate-300">
                <FileAudio className="h-3.5 w-3.5 text-indigo-400" /> SFX settings
              </ReadOnlyPlaygroundButton>
              <ReadOnlyPlaygroundButton title={PLAYGROUND_READ_ONLY_REASON} className="rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 px-6 py-2 text-sm font-bold text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                Generate
              </ReadOnlyPlaygroundButton>
            </div>
          </div>
        </div>
      </div>

      <SharedHistoryView agentHistory={agentHistory} setPreviewItem={setPreviewItem} modality="sfx" />
    </div>
  );
}
