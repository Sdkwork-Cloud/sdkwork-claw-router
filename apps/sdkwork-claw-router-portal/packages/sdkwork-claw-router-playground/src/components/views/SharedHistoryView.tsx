import { useEffect, useState } from 'react';
import { ChatHistoryItem } from '../ChatHistoryItem';
import type { PlaygroundHistoryItem, PlaygroundPreviewSetter } from '../../playgroundTypes';

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'image', label: 'Images' },
  { id: 'video', label: 'Videos' },
  { id: 'music', label: 'Music' },
  { id: 'audio', label: 'Audio' },
  { id: 'sfx', label: 'SFX' },
];

export function SharedHistoryView({
  agentHistory,
  setPreviewItem,
  modality,
}: {
  agentHistory: PlaygroundHistoryItem[];
  setPreviewItem: PlaygroundPreviewSetter;
  modality: string;
}) {
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    setActiveTab(modality === 'agent' ? 'all' : modality);
  }, [modality]);

  const filteredHistory = agentHistory.filter((item) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'image') return item.type === 'images' || item.type === 'image';
    return item.type === activeTab;
  });

  return (
    <div className="custom-scrollbar flex flex-1 flex-col items-center overflow-y-auto bg-[#0a0a0a] px-8 pt-0">
      <div className="sticky top-0 z-10 mb-6 flex w-full items-center justify-between border-b border-white/5 bg-[#0a0a0a] pb-4 pt-6">
        <div className="hide-scrollbar flex items-center gap-6 overflow-x-auto text-[14px] font-bold tracking-wide text-slate-400">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative whitespace-nowrap pb-1 transition-colors ${activeTab === tab.id ? 'text-white drop-shadow-sm' : 'hover:text-white'}`}
            >
              {tab.label}
              {activeTab === tab.id && <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-t-full bg-indigo-500" />}
            </button>
          ))}
        </div>
      </div>

      <div className="flex w-full flex-col gap-10 pb-20">
        {filteredHistory.length === 0 ? (
          <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] text-sm text-slate-500">
            No generated assets are available until the Playground API contract is closed.
          </div>
        ) : (
          filteredHistory.map((item, index) => {
            const isNewDate = index === 0 || filteredHistory[index - 1].date !== item.date;

            return (
              <div key={item.id} className="flex flex-col gap-4">
                {isNewDate && <h3 className="mb-2 pt-4 text-xl font-bold text-white">{item.date}</h3>}
                <ChatHistoryItem item={item} setPreviewItem={setPreviewItem} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
