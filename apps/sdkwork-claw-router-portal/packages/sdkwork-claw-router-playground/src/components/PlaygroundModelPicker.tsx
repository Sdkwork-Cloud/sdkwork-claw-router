import { useEffect, useMemo, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import type { PlaygroundModelBucket, PlaygroundModelGroup, PlaygroundModelOption } from '../playgroundTypes';

export function PlaygroundModelPicker({
  bucket,
  modelGroups,
  selectedModelId,
  onSelectModel,
  showModelMenu,
  setShowModelMenu,
  fallback,
}: {
  bucket: PlaygroundModelBucket;
  modelGroups: PlaygroundModelGroup[];
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
  showModelMenu: boolean;
  setShowModelMenu: (value: boolean) => void;
  fallback: PlaygroundModelOption;
}) {
  const groupsWithModels = useMemo(() => modelGroups.filter((group) => group[bucket].length > 0), [bucket, modelGroups]);
  const selectedGroup = findModelGroup(groupsWithModels, bucket, selectedModelId) || groupsWithModels[0];
  const selectedModel = findModel(groupsWithModels, bucket, selectedModelId) || firstModel(selectedGroup, bucket) || fallback;
  const [activeVendorCode, setActiveVendorCode] = useState(selectedGroup?.vendor.code || selectedModel.vendorCode);
  const activeGroup = groupsWithModels.find((group) => group.vendor.code === activeVendorCode) || selectedGroup;
  const activeVendorModels = activeGroup ? activeGroup[bucket] : [];

  useEffect(() => {
    setActiveVendorCode(selectedGroup?.vendor.code || selectedModel.vendorCode);
  }, [selectedGroup?.vendor.code, selectedModel.vendorCode]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowModelMenu(!showModelMenu)}
        className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-white/5 bg-[#1a1a1a] p-3 text-left shadow-sm transition-colors hover:border-indigo-500/50"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 p-[1.5px] shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <div className="flex h-full w-full items-center justify-center rounded-[6px] bg-[#1a1a1a] px-1 font-mono text-[9px] font-bold text-white">
              {selectedModel.versionLabel || selectedModel.ver}
            </div>
          </div>
          <div className="min-w-0">
            <div className="mb-0.5 truncate text-[13px] font-bold tracking-wide text-slate-200">{selectedModel.name}</div>
            <div className="line-clamp-1 text-[10px] tracking-wide text-slate-500">
              {selectedModel.vendorName} | {selectedModel.desc}
            </div>
          </div>
        </div>
        <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-slate-500 transition-transform duration-300 ${showModelMenu ? 'rotate-180' : ''}`} />
      </button>

      {showModelMenu && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 grid max-h-[460px] origin-top grid-cols-[150px_minmax(0,1fr)] overflow-hidden rounded-xl border border-white/10 bg-[#252528] shadow-2xl">
          <div className="custom-scrollbar max-h-[460px] overflow-y-auto border-r border-white/5 bg-black/10 p-1.5">
            {groupsWithModels.length === 0 ? (
              <div className="px-3 py-2 text-xs text-slate-500">No vendors</div>
            ) : (
              groupsWithModels.map((group) => {
                const isActive = group.vendor.code === activeVendorCode;
                return (
                  <button
                    key={group.vendor.code}
                    type="button"
                    onMouseEnter={() => {
                      setActiveVendorCode(group.vendor.code);
                    }}
                    onClick={() => setActiveVendorCode(group.vendor.code)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-semibold transition-colors ${
                      isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                  >
                    <span className="truncate">{group.vendor.name}</span>
                    <span className="ml-2 shrink-0 font-mono text-[10px] opacity-60">{group[bucket].length}</span>
                  </button>
                );
              })
            )}
          </div>

          <div className="custom-scrollbar max-h-[460px] min-w-0 overflow-y-auto py-1.5">
            {activeVendorModels.length === 0 ? (
              <div className="p-4 text-sm text-slate-500">No models are available for this vendor.</div>
            ) : (
              activeVendorModels.map((model) => {
                const isActive = model.id === selectedModel.id;
                return (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => {
                      onSelectModel(model.id);
                      setShowModelMenu(false);
                    }}
                    className="flex w-full cursor-pointer items-center justify-between gap-3 border-b border-white/5 p-3 text-left transition-colors last:border-b-0 hover:bg-white/5"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-7 w-8 shrink-0 items-center justify-center rounded border border-white/10 bg-black/20 px-1 font-mono text-[9px] font-semibold text-slate-400">
                        {model.versionLabel}
                      </div>
                      <div className="min-w-0">
                        <div className={`truncate text-sm font-bold tracking-wide ${isActive ? 'text-indigo-400' : 'text-slate-300'}`}>{model.name}</div>
                        <div className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-slate-500">{model.desc}</div>
                      </div>
                    </div>
                    {isActive && <Check className="h-4 w-4 shrink-0 text-cyan-400" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function createFallbackModel(name: string, desc: string, versionLabel: string, bucket: string): PlaygroundModelOption {
  const outputModality = bucket === 'llms' ? 'text' : bucket === 'audios' ? 'audio' : bucket.replace(/s$/, '');
  return {
    id: `fallback/${bucket}/${name}`,
    catalogKey: `fallback/${bucket}/${name}`,
    model: name,
    name,
    displayName: name,
    desc,
    description: desc,
    ver: versionLabel,
    versionLabel,
    vendorCode: 'pending',
    vendorName: 'Pending',
    modalities: [bucket],
    inputModalities: [],
    outputModalities: [outputModality],
    capabilities: [],
    supportsStreaming: false,
    supportsTools: false,
    supportsJsonSchema: false,
  };
}

function findModelGroup(groups: PlaygroundModelGroup[], bucket: PlaygroundModelBucket, modelId: string): PlaygroundModelGroup | undefined {
  return groups.find((group) => group[bucket].some((model) => model.id === modelId));
}

function findModel(groups: PlaygroundModelGroup[], bucket: PlaygroundModelBucket, modelId: string): PlaygroundModelOption | undefined {
  for (const group of groups) {
    const model = group[bucket].find((item) => item.id === modelId);
    if (model) {
      return model;
    }
  }
  return undefined;
}

function firstModel(group: PlaygroundModelGroup | undefined, bucket: PlaygroundModelBucket): PlaygroundModelOption | undefined {
  return group ? group[bucket][0] : undefined;
}
