import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Activity,
  Bot,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Crop,
  Download,
  Edit3,
  Eraser,
  FileAudio,
  Frame,
  Headphones,
  Image as ImageIcon,
  Maximize,
  Mic,
  MoreHorizontal,
  Music,
  PlaySquare,
  RefreshCw,
  Search,
  Share2,
  Sparkles,
  Star,
  Video,
  Wand2,
  X,
  Zap,
} from 'lucide-react';
import { AgentView } from '../components/views/AgentView';
import { ImageView } from '../components/views/ImageView';
import { VideoView } from '../components/views/VideoView';
import { MusicView } from '../components/views/MusicView';
import { AudioView } from '../components/views/AudioView';
import { SfxView } from '../components/views/SfxView';
import { IconSidebarItem } from '../components/IconSidebarItem';
import { PLAYGROUND_READ_ONLY_REASON, ReadOnlyPlaygroundButton } from '../components/ReadOnlyPlaygroundControl';
import { getDeterministicWaveBarStyle } from '../components/waveform';
import { PlaygroundService } from '../playgroundService';
import type { PlaygroundHistoryItem, PlaygroundMedia, PlaygroundModelBucket, PlaygroundModelGroup } from '../playgroundTypes';

export type Modality = 'agent' | 'image' | 'video' | 'music' | 'audio' | 'sfx' | 'package';

const DEFAULT_FILTER = 'all';

const READ_ONLY_VIDEO_ACTIONS = [
  { key: 'lipsync', labelKey: 'playground.preview.action.lipsync', icon: Mic },
  { key: 'bgm', labelKey: 'playground.preview.action.bgm', icon: Music },
  { key: 'upscale', labelKey: 'playground.preview.action.upscale', icon: Zap },
  { key: 'sfx', labelKey: 'playground.preview.action.sfx', icon: Activity },
  { key: 'interpolate', labelKey: 'playground.preview.action.interpolate', icon: RefreshCw },
] as const;

const READ_ONLY_IMAGE_ACTIONS = [
  { key: 'generate-video', labelKey: 'playground.preview.action.generateVideo', icon: PlaySquare },
  { key: 'canvas', labelKey: 'playground.preview.action.canvas', icon: Frame },
  { key: 'outpaint', labelKey: 'playground.preview.action.outpaint', icon: Wand2, className: 'col-span-2' },
  { key: 'hd', labelKey: 'playground.preview.action.hd', icon: Maximize },
  { key: 'fix-details', labelKey: 'playground.preview.action.fixDetails', icon: Sparkles },
  { key: 'inpaint', labelKey: 'playground.preview.action.inpaint', icon: Crop },
  { key: 'erase', labelKey: 'playground.preview.action.erase', icon: Eraser },
] as const;

const READ_ONLY_SECONDARY_ACTIONS = [
  { key: 'reedit', labelKey: 'playground.preview.action.reedit', icon: Edit3 },
  { key: 'regenerate', labelKey: 'playground.preview.action.regenerate', icon: RefreshCw },
] as const;

const typeOptions = [
  { id: DEFAULT_FILTER, label: 'All' },
  { id: 'image', label: 'Image' },
  { id: 'video', label: 'Video' },
  { id: 'music', label: 'Music' },
  { id: 'audio', label: 'Audio' },
  { id: 'sfx', label: 'SFX' },
] as const;

const timeOptions = [
  { id: DEFAULT_FILTER, label: 'All' },
  { id: '7d', label: 'Last 7 days' },
  { id: '30d', label: 'Last 30 days' },
  { id: '90d', label: 'Last 90 days' },
] as const;

function readMediaUrl(media: PlaygroundMedia | undefined) {
  if (typeof media === 'string') {
    return media;
  }
  return media?.url;
}

function readMediaThumb(media: PlaygroundMedia | undefined) {
  if (typeof media === 'string') {
    return media;
  }
  return media?.thumb || media?.url;
}

function isImageItem(item: PlaygroundHistoryItem) {
  return item.type === 'image' || item.type === 'images';
}

function getPreviewKind(item: PlaygroundHistoryItem) {
  if (item.type === 'video') {
    return 'video';
  }
  if (isImageItem(item)) {
    return 'image';
  }
  return 'audio';
}

function toModelBucket(value: Modality): PlaygroundModelBucket | null {
  switch (value) {
    case 'agent':
      return 'llms';
    case 'image':
      return 'images';
    case 'video':
      return 'videos';
    case 'music':
      return 'music';
    case 'audio':
      return 'audios';
    case 'sfx':
      return 'sfx';
    case 'package':
      return null;
  }
}

function readFirstModelId(groups: PlaygroundModelGroup[], bucket: PlaygroundModelBucket): string {
  for (const group of groups) {
    const first = group[bucket][0];
    if (first) {
      return first.id;
    }
  }
  return '';
}

function hasSelectedModel(groups: PlaygroundModelGroup[], bucket: PlaygroundModelBucket, selectedModelId: string): boolean {
  return groups.some((group) => group[bucket].some((model) => model.id === selectedModelId));
}

export function Playground() {
  const { t } = useTranslation();
  const [modality, setModality] = useState<Modality>('image');
  const [selectedModality, setSelectedModality] = useState<Modality>('image');
  const [previewItem, setPreviewItem] = useState<PlaygroundHistoryItem | null>(null);
  const [agentHistory, setAgentHistory] = useState<PlaygroundHistoryItem[]>([]);
  const [modelGroups, setModelGroups] = useState<PlaygroundModelGroup[]>([]);
  const activeIndex = previewItem?.activeIndex || 0;

  const [selectedModels, setSelectedModels] = useState<Record<Modality, string>>({
    agent: '',
    image: '',
    video: '',
    music: '',
    audio: '',
    sfx: '',
    package: '',
  });
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [openFilter, setOpenFilter] = useState<'time' | 'type' | 'action' | null>(null);
  const [timeFilter, setTimeFilter] = useState(DEFAULT_FILTER);
  const [typeFilter, setTypeFilter] = useState(DEFAULT_FILTER);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setOpenFilter(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    let cancelled = false;

    PlaygroundService.fetchGenerationHistory()
      .then((items) => {
        if (!cancelled) {
          setAgentHistory(items);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAgentHistory([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    PlaygroundService.fetchModelGroups()
      .then((groups) => {
        if (!cancelled) {
          setModelGroups(groups);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setModelGroups([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (modelGroups.length === 0) {
      return;
    }

    setSelectedModels((current) => {
      let next = current;
      (['agent', 'image', 'video', 'music', 'audio', 'sfx'] as Modality[]).forEach((targetModality) => {
        const bucket = toModelBucket(targetModality);
        if (!bucket || hasSelectedModel(modelGroups, bucket, current[targetModality])) {
          return;
        }
        const firstModelId = readFirstModelId(modelGroups, bucket);
        if (firstModelId) {
          if (next === current) {
            next = { ...current };
          }
          next[targetModality] = firstModelId;
        }
      });
      return next;
    });
  }, [modelGroups]);

  const filteredAgentHistory = useMemo(() => {
    let result = agentHistory;

    if (searchQuery.trim() !== '') {
      const normalizedQuery = searchQuery.trim().toLowerCase();
      result = result.filter((item) => item.prompt.toLowerCase().includes(normalizedQuery));
    }

    if (typeFilter !== DEFAULT_FILTER) {
      result = result.filter((item) => {
        if (typeFilter === 'image') {
          return isImageItem(item);
        }
        return item.type === typeFilter;
      });
    }

    return result;
  }, [searchQuery, typeFilter]);

  const updateSelectedModel = (targetModality: Modality) => (model: string) => {
    setSelectedModels((current) => ({ ...current, [targetModality]: model }));
  };

  const renderFilterOptions = (
    options: readonly { id: string; label: string }[],
    activeValue: string,
    onSelect: (value: string) => void,
  ) => (
    <div className="flex flex-col space-y-0.5">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => {
            onSelect(option.id);
            setOpenFilter(null);
          }}
          className="flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-[15px] text-slate-200 transition-colors hover:bg-[#2a2a2a]"
        >
          {option.label}
          {activeValue === option.id && <Check className="h-4 w-4 text-white" />}
        </button>
      ))}
    </div>
  );

  const previewKind = previewItem ? getPreviewKind(previewItem) : null;
  const previewVideoUrl = previewKind === 'video' ? readMediaUrl(previewItem?.videos?.[activeIndex]) || previewItem?.url : undefined;
  const previewImageUrl = previewKind === 'image' ? previewItem?.images?.[activeIndex] : undefined;
  const previewAudioUrl = previewKind === 'audio' ? previewItem?.url : undefined;
  const previewThumbnails = previewKind === 'video' ? previewItem?.videos : previewItem?.images;

  return (
    <div className="theme-aware-dark-surface flex h-[100dvh] w-full overflow-hidden bg-slate-50 dark:bg-[#0a0a0a] pt-[58px]">
      <div className="z-20 flex w-[80px] shrink-0 flex-col items-center gap-4 border-r border-white/5 bg-[#111111] py-4">
        <IconSidebarItem active={modality === 'agent'} icon={<Bot className="h-5 w-5" />} label={t('playground.modality.agent')} onClick={() => setModality('agent')} isPrimary />
        <div className="my-1 h-px w-8 bg-white/10" />
        <IconSidebarItem active={modality === 'image'} icon={<ImageIcon className="h-5 w-5" />} label={t('playground.modality.image')} onClick={() => setModality('image')} />
        <IconSidebarItem active={modality === 'video'} icon={<Video className="h-5 w-5" />} label={t('playground.modality.video')} onClick={() => setModality('video')} />
        <IconSidebarItem active={modality === 'music'} icon={<Music className="h-5 w-5" />} label={t('playground.modality.music')} onClick={() => setModality('music')} />
        <IconSidebarItem active={modality === 'audio'} icon={<Headphones className="h-5 w-5" />} label={t('playground.modality.audio')} onClick={() => setModality('audio')} />
        <IconSidebarItem active={modality === 'sfx'} icon={<FileAudio className="h-5 w-5" />} label={t('playground.modality.sfx')} onClick={() => setModality('sfx')} />
      </div>

      <div className="relative flex h-full min-w-0 flex-1 flex-col bg-[#111] text-white">
        {modality === 'agent' && (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-14 shrink-0 items-center justify-end px-6">
            <div ref={filterRef} className="pointer-events-auto flex items-center rounded-lg border border-white/5 bg-[#1a1a1a] p-1 px-2 shadow-sm transition-all">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded transition-colors ${isSearchOpen ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <Search className="h-4 w-4" />
              </button>
              {isSearchOpen && (
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search history..."
                  className="w-48 border-none bg-transparent px-2 text-sm text-white outline-none placeholder:text-slate-500"
                />
              )}

              <div className="mx-1 h-4 w-px bg-white/10" />

              <div className="relative">
                <button
                  onClick={() => setOpenFilter(openFilter === 'time' ? null : 'time')}
                  className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-sm transition-colors ${openFilter === 'time' ? 'bg-[#2a2a2a] text-white' : 'text-slate-300 hover:text-white'}`}
                >
                  Time <ChevronDown className={`h-4 w-4 transition-transform ${openFilter === 'time' ? 'rotate-180' : ''}`} />
                </button>
                {openFilter === 'time' && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-white/5 bg-[#1a1a1a] p-3 shadow-2xl">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="flex flex-1 items-center rounded-md bg-[#242424] px-3 py-2">
                        <span className="w-full text-sm text-slate-500">Start date</span>
                        <Calendar className="h-4 w-4 text-slate-500" />
                      </div>
                      <span className="text-slate-600">-</span>
                      <div className="flex flex-1 items-center rounded-md bg-[#242424] px-3 py-2">
                        <span className="w-full text-sm text-slate-500">End date</span>
                        <Calendar className="h-4 w-4 text-slate-500" />
                      </div>
                    </div>
                    {renderFilterOptions(timeOptions, timeFilter, setTimeFilter)}
                  </div>
                )}
              </div>

              <div className="mx-1 h-4 w-px bg-white/10" />

              <div className="relative">
                <button
                  onClick={() => setOpenFilter(openFilter === 'type' ? null : 'type')}
                  className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-sm transition-colors ${openFilter === 'type' ? 'bg-[#2a2a2a] text-white' : 'text-slate-300 hover:text-white'}`}
                >
                  Type <ChevronDown className={`h-4 w-4 transition-transform ${openFilter === 'type' ? 'rotate-180' : ''}`} />
                </button>
                {openFilter === 'type' && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-white/5 bg-[#1a1a1a] p-2 shadow-2xl lg:left-0 lg:right-auto">
                    {renderFilterOptions(typeOptions, typeFilter, setTypeFilter)}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
          {modality === 'agent' && (
            <AgentView
              agentHistory={filteredAgentHistory}
              setPreviewItem={setPreviewItem}
              selectedModality={selectedModality}
              setSelectedModality={setSelectedModality}
              modelGroups={modelGroups}
              selectedModels={selectedModels}
              setSelectedModel={updateSelectedModel}
            />
          )}

          {modality !== 'agent' && (
            <div className="flex h-full w-full flex-col">
              <div className="relative min-h-0 flex-1 overflow-hidden">
                {modality === 'image' && (
                  <ImageView
                    agentHistory={filteredAgentHistory}
                    setPreviewItem={setPreviewItem}
                    modelGroups={modelGroups}
                    selectedModelId={selectedModels.image}
                    setSelectedModelId={updateSelectedModel('image')}
                    showModelMenu={showModelMenu}
                    setShowModelMenu={setShowModelMenu}
                  />
                )}
                {modality === 'video' && (
                  <VideoView
                    agentHistory={filteredAgentHistory}
                    setPreviewItem={setPreviewItem}
                    modelGroups={modelGroups}
                    selectedModelId={selectedModels.video}
                    setSelectedModelId={updateSelectedModel('video')}
                    showModelMenu={showModelMenu}
                    setShowModelMenu={setShowModelMenu}
                  />
                )}
                {modality === 'music' && (
                  <MusicView
                    agentHistory={filteredAgentHistory}
                    setPreviewItem={setPreviewItem}
                    modelGroups={modelGroups}
                    selectedModelId={selectedModels.music}
                    setSelectedModelId={updateSelectedModel('music')}
                    showModelMenu={showModelMenu}
                    setShowModelMenu={setShowModelMenu}
                  />
                )}
                {modality === 'audio' && (
                  <AudioView
                    agentHistory={filteredAgentHistory}
                    setPreviewItem={setPreviewItem}
                    modelGroups={modelGroups}
                    selectedModelId={selectedModels.audio}
                    setSelectedModelId={updateSelectedModel('audio')}
                    showModelMenu={showModelMenu}
                    setShowModelMenu={setShowModelMenu}
                  />
                )}
                {modality === 'sfx' && (
                  <SfxView
                    agentHistory={filteredAgentHistory}
                    setPreviewItem={setPreviewItem}
                    modelGroups={modelGroups}
                    selectedModelId={selectedModels.sfx}
                    setSelectedModelId={updateSelectedModel('sfx')}
                    showModelMenu={showModelMenu}
                    setShowModelMenu={setShowModelMenu}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {previewItem && (
          <div className="fixed inset-0 z-[100] flex bg-[#0a0a0a]">
            <div className="z-20 flex w-[80px] shrink-0 flex-col items-center border-r border-white/5 bg-[#111111] py-4">
              <div className="mb-8 h-8 w-8 rounded bg-gradient-to-tr from-indigo-500 to-cyan-400" />
              <IconSidebarItem active={false} icon={<Bot className="h-5 w-5" />} label="Chat" onClick={() => undefined} />
            </div>

            <div className="relative flex flex-1">
              <button
                onClick={() => setPreviewItem(null)}
                className="pointer-events-auto absolute right-6 top-6 z-[60] flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="relative flex min-h-0 flex-1 flex-row items-center justify-center gap-8 p-6">
                <div className="relative flex h-full min-h-0 min-w-0 flex-1 items-center justify-center">
                  <div className="group relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl bg-black/20 shadow-2xl">
                    {previewKind === 'video' && previewVideoUrl && (
                      <video src={previewVideoUrl} controls autoPlay loop className="h-full w-full rounded-2xl object-contain" />
                    )}
                    {previewKind === 'image' && previewImageUrl && (
                      <img src={previewImageUrl} alt="Preview" className="h-full w-full rounded-2xl object-contain" />
                    )}
                    {previewKind === 'audio' && (
                      <div className="relative flex h-[600px] w-[800px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-tr from-[#111] to-[#1a1a24] text-slate-400">
                        <div className="mb-10 flex h-32 items-end gap-1.5">
                          {[...Array(24)].map((_, index) => (
                            <div key={index} className="w-2.5 rounded-t-sm bg-indigo-500/80" style={getDeterministicWaveBarStyle(index, 20, 70)} />
                          ))}
                        </div>
                        <Activity className="mb-4 h-10 w-10 text-indigo-400 opacity-80" />
                        <p className="text-sm font-medium tracking-wide">{t('playground.preview.audioWave')}</p>
                        {previewAudioUrl && <audio src={previewAudioUrl} controls autoPlay className="z-20 mt-8 w-[400px] rounded-full outline-none" />}
                      </div>
                    )}
                    {((previewKind === 'video' && !previewVideoUrl) || (previewKind === 'image' && !previewImageUrl)) && (
                      <div className="flex h-full w-full items-center justify-center rounded-2xl border border-white/5 bg-[#111] text-sm text-slate-500">
                        Preview asset is unavailable.
                      </div>
                    )}

                    {activeIndex > 0 && (
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          setPreviewItem({ ...previewItem, activeIndex: activeIndex - 1 });
                        }}
                        className="absolute left-6 z-20 flex h-10 w-10 items-center justify-center rounded-[12px] border border-white/5 bg-black/60 opacity-0 shadow-xl backdrop-blur-md transition-all hover:bg-black/90 group-hover:opacity-100"
                      >
                        <ChevronLeft className="h-5 w-5 text-white" />
                      </button>
                    )}

                    {activeIndex < ((previewItem.videos?.length || previewItem.images?.length || 1) - 1) && (
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          setPreviewItem({ ...previewItem, activeIndex: activeIndex + 1 });
                        }}
                        className="absolute right-6 z-20 flex h-10 w-10 items-center justify-center rounded-[12px] border border-white/5 bg-black/60 opacity-0 shadow-xl backdrop-blur-md transition-all hover:bg-black/90 group-hover:opacity-100"
                      >
                        <ChevronRight className="h-5 w-5 text-white" />
                      </button>
                    )}
                  </div>
                </div>

                {previewThumbnails && previewThumbnails.length > 1 && (
                  <div className="hide-scrollbar z-10 flex h-full min-h-0 w-[80px] shrink-0 flex-col items-center gap-3 overflow-y-auto py-1">
                    {previewThumbnails.map((media, index) => {
                      const thumbSrc = readMediaThumb(media);
                      if (!thumbSrc) {
                        return null;
                      }

                      return (
                        <button
                          key={`${thumbSrc}-${index}`}
                          onClick={() => setPreviewItem({ ...previewItem, activeIndex: index })}
                          className={`group relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all focus:outline-none md:h-20 md:w-20 ${
                            activeIndex === index ? 'scale-100 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'border-transparent opacity-60 hover:scale-[1.02] hover:border-white/20 hover:opacity-100'
                          }`}
                        >
                          <img src={thumbSrc} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          <div className={`absolute inset-0 ${activeIndex === index ? 'bg-black/0' : 'bg-black/20 group-hover:bg-black/0'} transition-colors`} />
                          <div className="absolute left-1.5 top-1 rounded bg-black/40 px-1.5 py-0.5 shadow-sm backdrop-blur-sm">
                            <span className="font-mono text-[9px] font-bold leading-none text-white/90">v{index + 1}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="custom-scrollbar flex w-[380px] shrink-0 flex-col items-stretch overflow-y-auto border-l border-white/5 bg-[#111111] p-6 pt-20">
                <div className="mb-8 flex items-center justify-between">
                  <ReadOnlyPlaygroundButton className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white">
                    <Download className="h-4 w-4" /> {t('playground.preview.download')}
                  </ReadOnlyPlaygroundButton>
                  <div className="flex gap-2">
                    <ReadOnlyPlaygroundButton className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400">
                      <Star className="h-4 w-4" />
                    </ReadOnlyPlaygroundButton>
                    <ReadOnlyPlaygroundButton className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400">
                      <Share2 className="h-4 w-4" />
                    </ReadOnlyPlaygroundButton>
                    <ReadOnlyPlaygroundButton className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400">
                      <MoreHorizontal className="h-4 w-4" />
                    </ReadOnlyPlaygroundButton>
                  </div>
                </div>

                <div className="mb-8 flex flex-col gap-3">
                  <h3 className="text-xs font-bold text-slate-500">
                    {previewKind === 'video' ? t('playground.preview.videoPrompt') : t('playground.preview.imagePrompt')}
                  </h3>
                  <p className="text-[14px] leading-relaxed text-slate-200">{previewItem.prompt || 'No prompt metadata available.'}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs font-mono text-slate-500">
                    <span>{previewItem.modelInfo || 'Contract pending'}</span>
                    <span>|</span>
                    <span className="flex items-center gap-1" title={PLAYGROUND_READ_ONLY_REASON}>
                      {t('playground.preview.details')} <Clock className="h-3 w-3" />
                    </span>
                  </div>
                </div>

                <div className="mt-auto flex flex-col gap-3 border-t border-white/5 pt-6">
                  <div className="mb-2 grid grid-cols-2 gap-2">
                    {(previewKind === 'video' ? READ_ONLY_VIDEO_ACTIONS : READ_ONLY_IMAGE_ACTIONS).map((action) => {
                      const Icon = action.icon;
                      return (
                        <ReadOnlyPlaygroundButton
                          key={action.key}
                          className={`flex items-center justify-center gap-2 rounded-xl border border-white/5 bg-[#1a1a1a] py-2.5 text-xs font-medium text-slate-300 ${'className' in action ? action.className : ''}`}
                        >
                          <Icon className="h-3.5 w-3.5" /> {t(action.labelKey)}
                        </ReadOnlyPlaygroundButton>
                      );
                    })}
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-2 border-t border-white/5 pt-4">
                    {READ_ONLY_SECONDARY_ACTIONS.map((action) => {
                      const Icon = action.icon;
                      return (
                        <ReadOnlyPlaygroundButton key={action.key} className="flex items-center justify-center gap-2 rounded-xl bg-transparent py-2.5 text-xs font-medium text-slate-300">
                          <Icon className="h-3.5 w-3.5" /> {t(action.labelKey)}
                        </ReadOnlyPlaygroundButton>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
