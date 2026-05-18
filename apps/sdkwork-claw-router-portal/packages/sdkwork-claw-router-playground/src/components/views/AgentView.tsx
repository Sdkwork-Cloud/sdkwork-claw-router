import { useTranslation } from 'react-i18next';
import { Bot } from 'lucide-react';
import { ChatHistoryItem } from '../ChatHistoryItem';
import { GenerationChatInput } from '../GenerationChatInput';
import type { GenerationModality, Modality } from '../../pages/Playground';
import type { PlaygroundHistoryItem, PlaygroundModelGroup, PlaygroundPreviewSetter } from '../../playgroundTypes';

export function AgentView({
  agentHistory,
  setPreviewItem,
  selectedModality,
  setSelectedModality,
  modelGroups,
  selectedModels,
  setSelectedModel,
  onSubmitGeneration,
  submitting,
  submitError,
}: {
  agentHistory: PlaygroundHistoryItem[],
  setPreviewItem: PlaygroundPreviewSetter,
  selectedModality: GenerationModality,
  setSelectedModality: (value: GenerationModality) => void,
  modelGroups: PlaygroundModelGroup[],
  selectedModels: Record<Modality, string>,
  setSelectedModel: (targetModality: GenerationModality) => (modelId: string) => void,
  onSubmitGeneration: (input: { prompt: string; selectedModality: GenerationModality; selectedModel?: string }) => Promise<void>,
  submitting: boolean,
  submitError: string | null,
}) {
  const { t } = useTranslation();

  return (
    <div className="flex-1 min-h-0 relative flex flex-col bg-[#111]">
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
        <div className="flex flex-col min-h-full pb-[240px] pt-16 px-4 md:px-12">
          {agentHistory.length === 0 && (
            <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-cyan-300">
                <Bot className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-semibold text-white">{t('playground.agent.emptyTitle')}</h2>
              <p className="max-w-md text-sm leading-6 text-slate-400">{t('playground.agent.emptyDescription')}</p>
            </div>
          )}

          {agentHistory.length > 0 && <div className="flex-1 min-h-0" />}

          <div className="w-full max-w-3xl mx-auto flex flex-col gap-10 mt-4">
             {agentHistory.map((item, index) => {
                const isNewDate = index === 0 || agentHistory[index-1].date !== item.date;

                return (
                  <div key={item.id} className="flex flex-col gap-4">
                    {isNewDate && (
                      <h3 className="text-xl font-bold text-white mb-2 pt-4">
                        {item.date}
                      </h3>
                    )}
                    <ChatHistoryItem item={item} setPreviewItem={setPreviewItem} />
                  </div>
                );
             })}
          </div>
        </div>
      </div>

      {/* Input Fixed at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end z-50 pointer-events-none pb-6">
         <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#111] via-[#111]/80 to-transparent pointer-events-none" />
         <div className="w-full max-w-[1280px] pointer-events-auto px-4 md:px-12 relative z-10">
           {submitError && (
             <div className="mx-auto mb-3 max-w-[1280px] rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">
               {submitError}
             </div>
           )}
           <GenerationChatInput
             selectedModality={selectedModality}
             setSelectedModality={setSelectedModality}
             modelGroups={modelGroups}
             selectedModels={selectedModels}
             setSelectedModel={setSelectedModel}
             onSubmit={onSubmitGeneration}
             submitting={submitting}
           />
         </div>
      </div>
    </div>
  );
}
