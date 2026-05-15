import { ChatHistoryItem } from '../ChatHistoryItem';
import { GenerationChatInput } from '../GenerationChatInput';
import type { Modality } from '../../pages/Playground';
import type { PlaygroundHistoryItem, PlaygroundModelGroup, PlaygroundPreviewSetter } from '../../playgroundTypes';

export function AgentView({
  agentHistory,
  setPreviewItem,
  selectedModality,
  setSelectedModality,
  modelGroups,
  selectedModels,
  setSelectedModel,
}: {
  agentHistory: PlaygroundHistoryItem[],
  setPreviewItem: PlaygroundPreviewSetter,
  selectedModality: Modality,
  setSelectedModality: (value: Modality) => void,
  modelGroups: PlaygroundModelGroup[],
  selectedModels: Record<Modality, string>,
  setSelectedModel: (targetModality: Modality) => (modelId: string) => void,
}) {
  return (
    <div className="flex-1 min-h-0 relative flex flex-col bg-[#111]">
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
        <div className="flex flex-col min-h-full pb-[140px] pt-16 px-4 md:px-12">
          {/* Spacer to push content to bottom when few messages */}
          <div className="flex-1 min-h-0"></div>

          <div className="w-full max-w-3xl mx-auto flex flex-col gap-10 w-full mt-4">
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
           <GenerationChatInput
             selectedModality={selectedModality}
             setSelectedModality={setSelectedModality}
             modelGroups={modelGroups}
             selectedModels={selectedModels}
             setSelectedModel={setSelectedModel}
           />
         </div>
      </div>
    </div>
  );
}
