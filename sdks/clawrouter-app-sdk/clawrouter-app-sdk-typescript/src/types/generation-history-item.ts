import type { MediaResource } from './media-resource';

/** Generation history item schema exposed by Claw Router. */
export interface GenerationHistoryItem {
  /** Aspect ratio field on generation history item. */
  aspectRatio?: '1:1' | '16:9' | '9:16';
  /** Asset field on generation history item. */
  asset?: MediaResource;
  /** Created at field on generation history item. */
  createdAt?: string;
  /** Date field on generation history item. */
  date: string;
  /** Duration seconds field on generation history item. */
  durationSeconds?: number;
  /** Id field on generation history item. */
  id: string;
  /** Images field on generation history item. */
  images: MediaResource[];
  /** Model catalog key field on generation history item. */
  modelCatalogKey?: string;
  /** Model info field on generation history item. */
  modelInfo?: string;
  /** Output text field on generation history item. */
  outputText?: string;
  /** Prompt field on generation history item. */
  prompt: string;
  /** Status field on generation history item. */
  status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  /** Type field on generation history item. */
  type: 'text' | 'image' | 'images' | 'video' | 'music' | 'audio' | 'sfx';
  /** Updated at field on generation history item. */
  updatedAt?: string;
  /** Videos field on generation history item. */
  videos: MediaResource[];
}
