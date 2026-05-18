export type PlaygroundMedia = string | { url?: string; thumb?: string };

export type PlaygroundModelBucket = 'llms' | 'images' | 'videos' | 'audios' | 'music' | 'sfx';

export type PlaygroundGenerationTargetType = 'image' | 'video' | 'music' | 'audio' | 'sfx';

export type PlaygroundGenerationRunStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface PlaygroundGenerationConfig {
  imageCount?: number;
  aspectRatio?: '1:1' | '16:9' | '9:16';
  durationSeconds?: number;
  quality?: 'standard' | 'high';
}

export interface PlaygroundReferenceImageInput {
  name: string;
  mimeType?: string;
  sizeBytes?: number;
  dataUrl?: string;
  url?: string;
  assetId?: string;
}

export interface PlaygroundHistoryItem {
  id: string;
  date: string;
  prompt: string;
  type: 'image' | 'images' | 'video' | 'music' | 'audio' | 'sfx';
  modelInfo?: string;
  modelCatalogKey?: string;
  url?: string;
  images?: string[];
  videos?: PlaygroundMedia[];
  aspectRatio?: PlaygroundGenerationConfig['aspectRatio'];
  durationSeconds?: number;
  activeIndex?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GenerationAgentRunCreateInput {
  prompt: string;
  targetType?: PlaygroundGenerationTargetType;
  selectedModel?: string;
  generationConfig?: PlaygroundGenerationConfig;
  referenceImages?: PlaygroundReferenceImageInput[];
}

export interface PlaygroundGenerationSubmitInput {
  prompt: string;
  selectedModality: PlaygroundGenerationTargetType | 'agent';
  targetType?: PlaygroundGenerationTargetType;
  selectedModel?: string;
  generationConfig?: PlaygroundGenerationConfig;
  referenceImages?: PlaygroundReferenceImageInput[];
}

export interface GenerationAgentSnapshot {
  id: string;
  versionId: string;
  name: string;
  model?: string;
}

export type GenerationAgentRunStatus = 'queued' | 'planning' | 'running' | 'waiting_for_tool' | 'succeeded' | 'failed' | 'cancelled';

export interface GenerationAgentRunSnapshot {
  id: string;
  requestId: string;
  source: 'generation-agent';
  status: GenerationAgentRunStatus;
}

export type GenerationAgentStepType =
  | 'input'
  | 'memory_retrieval'
  | 'model_call'
  | 'skill_call'
  | 'mcp_tool_call'
  | 'media_generation'
  | 'metering'
  | 'output';

export type GenerationAgentStepStatus = 'queued' | 'running' | 'succeeded' | 'failed' | 'skipped';

export interface GenerationAgentRunStepSnapshot {
  id: string;
  index: number;
  type: GenerationAgentStepType;
  status: GenerationAgentStepStatus;
  title: string;
}

export type GenerationAgentMeteringEventType =
  | 'token'
  | 'image'
  | 'video'
  | 'audio'
  | 'tool'
  | 'mcp'
  | 'skill'
  | 'storage'
  | 'network';

export interface GenerationAgentUsageFactMetadata {
  agentId: string;
  agentVersionId: string;
  runId: string;
  stepId: string;
  userId: string;
  skillId?: string;
  mcpServerId?: string;
  toolId?: string;
  meteringSource: 'agent-runtime';
}

export interface GenerationAgentMeteringEvent {
  type: GenerationAgentMeteringEventType;
  quantity: string;
  usageFactMetadata: GenerationAgentUsageFactMetadata;
}

export interface GenerationAgentUsageSummary {
  promptTokens: number;
  cachedTokens: number;
  completionTokens: number;
  totalTokens: number;
  imageCount: number;
  videoSeconds: string;
  events: GenerationAgentMeteringEvent[];
}

export interface GenerationAgentRunCreateResult {
  agent: GenerationAgentSnapshot;
  item: PlaygroundHistoryItem;
  meteringEvents: GenerationAgentMeteringEvent[];
  run: GenerationAgentRunSnapshot;
  steps: GenerationAgentRunStepSnapshot[];
  targetType: PlaygroundGenerationTargetType;
  status: PlaygroundGenerationRunStatus;
  usage: GenerationAgentUsageSummary;
}

export type PlaygroundPreviewSetter = (item: PlaygroundHistoryItem) => void;

export interface PlaygroundModelVendor {
  code: string;
  name: string;
}

export interface PlaygroundModelReferencePrice {
  billingMeter: string;
  unitPrice: string;
  currency: string;
}

export interface PlaygroundModelPriceAvailability {
  status: 'reference' | 'unavailable';
  reason?: string | null;
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
  officialReferenceUnitPrice?: string | null;
  officialReferenceCurrency?: string | null;
  officialReferencePrices: PlaygroundModelReferencePrice[];
  priceAvailability: PlaygroundModelPriceAvailability;
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
  onSubmitGeneration: (input: PlaygroundGenerationSubmitInput) => Promise<void>;
  submitting: boolean;
  submitError: string | null;
}
