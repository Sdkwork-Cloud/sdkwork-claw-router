export interface AdminAiModelCreateRequest {
  apiFormat?: string | null;
  capabilityIntro?: string | null;
  /** Positive token window, accepting plain integers or K/M suffixes. */
  contextTokens: string;
  description?: string | null;
  inputModalities?: string[];
  limitations?: string[];
  maxOutputTokens?: number | null;
  modalities?: string[];
  /** AI model identifier. */
  name: string;
  outputModalities?: string[];
  /** Official reference input unit price in USD. */
  priceIn: string;
  /** Official reference output unit price in USD. */
  priceOut: string;
  releaseStage?: number | null;
  replacementModel?: string | null;
  routingState?: number | null;
  shelfState?: number | null;
  supportedLanguages?: string[];
  supportsJsonSchema?: boolean;
  supportsStreaming?: boolean;
  supportsTools?: boolean;
  trainingDataCutoff?: string | null;
  /** Primary model modality shown in the admin console. */
  type: 'Chat' | 'Image' | 'Audio' | 'Embedding' | 'Music' | 'SoundEffect' | 'Video';
  useCases?: string[];
  /** Vendor row id or vendor code selected in the admin console. */
  vendorId: string;
}
