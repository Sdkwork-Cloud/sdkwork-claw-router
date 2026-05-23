import type { AdminAiModelRegionPrice } from './admin-ai-model-region-price';

/** Admin ai model update request schema exposed by Claw Router. */
export interface AdminAiModelUpdateRequest {
  /** Api format field on admin ai model update request. */
  apiFormat?: string | null;
  /** Optional official reference cache-read unit price in USD. Empty string clears the cache-read price. */
  cacheReadPrice?: string;
  /** Optional official reference cache-write unit price in USD. Empty string clears the cache-write price. */
  cacheWritePrice?: string;
  /** Capability intro field on admin ai model update request. */
  capabilityIntro?: string | null;
  /** Optional positive token window, accepting plain integers or K/M suffixes. */
  contextTokens?: string;
  /** Description field on admin ai model update request. */
  description?: string | null;
  /** Display name field on admin ai model update request. */
  displayName?: string | null;
  /** Input modalities field on admin ai model update request. */
  inputModalities?: string[];
  /** Limitations field on admin ai model update request. */
  limitations?: string[];
  /** Max output tokens field on admin ai model update request. */
  maxOutputTokens?: number | null;
  /** Modalities field on admin ai model update request. */
  modalities?: string[];
  /** Optional runtime model identifier update. */
  model?: string;
  /** Deprecated compatibility alias for model. */
  name?: string;
  /** Output modalities field on admin ai model update request. */
  outputModalities?: string[];
  /** Optional official reference input unit price in USD. */
  priceIn?: string;
  /** Optional official reference output unit price in USD. */
  priceOut?: string;
  /** Optional official reference prices by region. */
  regionPrices?: AdminAiModelRegionPrice[];
  /** Release stage field on admin ai model update request. */
  releaseStage?: number | null;
  /** Replacement model field on admin ai model update request. */
  replacementModel?: string | null;
  /** Routing state field on admin ai model update request. */
  routingState?: number | null;
  /** Shelf state field on admin ai model update request. */
  shelfState?: number | null;
  /** Optional model catalog status. */
  status?: 'active' | 'inactive';
  /** Supported languages field on admin ai model update request. */
  supportedLanguages?: string[];
  /** Supports json schema field on admin ai model update request. */
  supportsJsonSchema?: boolean;
  /** Supports streaming field on admin ai model update request. */
  supportsStreaming?: boolean;
  /** Supports tools field on admin ai model update request. */
  supportsTools?: boolean;
  /** Training data cutoff field on admin ai model update request. */
  trainingDataCutoff?: string | null;
  /** Optional primary model modality update. */
  type?: 'Chat' | 'Image' | 'Audio' | 'Embedding' | 'Music' | 'SoundEffect' | 'Video';
  /** Use cases field on admin ai model update request. */
  useCases?: string[];
  /** Optional vendor row id or vendor code selected in the admin console. */
  vendorId?: string;
}
