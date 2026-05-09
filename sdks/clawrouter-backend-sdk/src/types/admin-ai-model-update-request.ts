export interface AdminAiModelUpdateRequest {
  apiFormat?: string | null;
  capabilityIntro?: string | null;
  /** Optional positive token window, accepting plain integers or K/M suffixes. */
  contextTokens?: string;
  description?: string | null;
  inputModalities?: string[];
  limitations?: string[];
  maxOutputTokens?: number | null;
  modalities?: string[];
  /** Optional AI model identifier update. */
  name?: string;
  outputModalities?: string[];
  /** Optional official reference input unit price in USD. */
  priceIn?: string;
  /** Optional official reference output unit price in USD. */
  priceOut?: string;
  releaseStage?: number | null;
  replacementModel?: string | null;
  routingState?: number | null;
  shelfState?: number | null;
  /** Optional model catalog status. */
  status?: 'active' | 'inactive';
  supportedLanguages?: string[];
  supportsJsonSchema?: boolean;
  supportsStreaming?: boolean;
  supportsTools?: boolean;
  trainingDataCutoff?: string | null;
  /** Optional primary model modality update. */
  type?: 'Chat' | 'Image' | 'Audio' | 'Embedding' | 'Music' | 'SoundEffect' | 'Video';
  useCases?: string[];
  /** Optional vendor row id or vendor code selected in the admin console. */
  vendorId?: string;
}
