import type { GenerationHistoryMediaItem } from './generation-history-media-item';

export interface GenerationHistoryItem {
  createdAt?: string;
  date: string;
  id: string;
  images: string[];
  modelInfo?: string;
  prompt: string;
  status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  type: 'image' | 'images' | 'video' | 'music' | 'audio' | 'sfx';
  updatedAt?: string;
  url?: string;
  videos: GenerationHistoryMediaItem[];
}
