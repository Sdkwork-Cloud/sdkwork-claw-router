export type PlaygroundMedia = string | { url?: string; thumb?: string };

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

export interface PlaygroundModelOption {
  name: string;
  desc: string;
  ver: string;
}

export interface PlaygroundAssetViewProps {
  agentHistory: PlaygroundHistoryItem[];
  setPreviewItem: PlaygroundPreviewSetter;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  activeSelectedModel: PlaygroundModelOption;
  activeModelOptions: PlaygroundModelOption[];
  showModelMenu: boolean;
  setShowModelMenu: (value: boolean) => void;
}
