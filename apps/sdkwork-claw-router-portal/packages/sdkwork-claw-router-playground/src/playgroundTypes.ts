export type PlaygroundMedia = string | { url?: string; thumb?: string };

export type PlaygroundModelBucket = 'llms' | 'images' | 'videos' | 'audios' | 'music' | 'sfx';

export interface PlaygroundHistoryItem {
  id: string;
  date: string;
  prompt: string;
  type: 'image' | 'images' | 'video' | 'music' | 'audio' | 'sfx';
  modelInfo?: string;
  url?: string;
  images?: string[];
  videos?: PlaygroundMedia[];
  activeIndex?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type PlaygroundPreviewSetter = (item: PlaygroundHistoryItem) => void;

export interface PlaygroundModelVendor {
  code: string;
  name: string;
}

export interface PlaygroundModelOption {
  id: string;
  catalogKey: string;
  model: string;
  name: string;
  displayName: string;
  desc: string;
  description?: string;
  ver: string;
  versionLabel: string;
  vendorCode: string;
  vendorName: string;
  modalities: string[];
  inputModalities: string[];
  outputModalities: string[];
  capabilities: string[];
  apiFormat?: string;
  contextTokens?: number;
  maxOutputTokens?: number;
  supportsStreaming: boolean;
  supportsTools: boolean;
  supportsJsonSchema: boolean;
}

export interface PlaygroundModelGroup {
  id: string;
  vendor: PlaygroundModelVendor;
  llms: PlaygroundModelOption[];
  images: PlaygroundModelOption[];
  videos: PlaygroundModelOption[];
  audios: PlaygroundModelOption[];
  music: PlaygroundModelOption[];
  sfx: PlaygroundModelOption[];
}

export interface PlaygroundAssetViewProps {
  agentHistory: PlaygroundHistoryItem[];
  setPreviewItem: PlaygroundPreviewSetter;
  modelGroups: PlaygroundModelGroup[];
  selectedModelId: string;
  setSelectedModelId: (modelId: string) => void;
  showModelMenu: boolean;
  setShowModelMenu: (value: boolean) => void;
}
