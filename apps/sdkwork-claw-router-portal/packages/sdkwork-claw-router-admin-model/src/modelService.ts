import {
  createIdempotencyParams,
  ensureSdkworkApiSuccess,
  getClawRouterBackendSdkClient,
  isRecord,
  readApiRecord,
  readBoolean,
  readNullableString,
  readNumber,
  readRequiredApiItems,
  readRequiredApiItem,
  requiredSafePathSegment,
  readRequiredString,
  readString,
  readStringArray,
  type ApiRecord,
} from 'sdkwork-claw-router-commons/runtime';
import type {
  AdminAiModelCreateRequest,
  AdminAiModelUpdateRequest,
  AdminModelCatalogSyncRequest,
  AdminModelCatalogSyncResponse,
  AdminModelVendorCreateRequest,
  ModelRankingItem,
  ModelRankingRefreshJobHistoryPage,
  ModelRankingRefreshJobItem,
  ModelRankingRefreshStatus,
  ModelRankingRefreshTriggerRequest,
  ModelRankingRefreshTriggerResponse,
} from '@sdkwork/clawrouter-backend-sdk';

export interface Vendor {
  id: string;
  vendorCode: string;
  name: string;
  status: 'active' | 'inactive';
  color: string;
  description: string;
}

export interface Model {
  id: string;
  vendorId: string;
  vendorCode: string;
  model: string;
  displayName: string;
  name: string;
  type: 'Chat' | 'Image' | 'Audio' | 'Embedding' | 'Music' | 'SoundEffect' | 'Video';
  priceIn: string;
  priceOut: string;
  cacheReadPrice: string;
  cacheWritePrice: string;
  status: 'active' | 'inactive';
  calls: string;
  description: string | null;
  modalities: string[];
  inputModalities: string[];
  outputModalities: string[];
  apiFormat: string | null;
  capabilityIntro: string | null;
  limitations: string[];
  supportedLanguages: string[];
  useCases: string[];
  trainingDataCutoff: string | null;
  contextTokens: number | null;
  maxOutputTokens: number | null;
  supportsStreaming: boolean;
  supportsTools: boolean;
  supportsJsonSchema: boolean;
  releaseStage: number | null;
  shelfState: number | null;
  routingState: number | null;
  replacementModel: string | null;
}

export type ModelCatalogSyncReport = {
  acceptedCount: number;
  capabilityCount: number;
  catalogRoot: string | null;
  catalogVersion: string;
  dryRun: boolean;
  familyCount: number;
  meterCount: number;
  mode: AdminModelCatalogSyncResponse['mode'];
  modelCount: number;
  priceCount: number;
  rankingCount: number;
  requestedCatalogVersion: string | null;
  snapshotId: string | null;
  source: string;
  sourceHash: string;
  syncRunId: string | null;
  synced: boolean;
  vendorCodes: string[];
  vendorCount: number;
  vendors: Vendor[];
  models: Model[];
};

export type InitializedModelCatalog = {
  initialized: boolean;
  vendors: Vendor[];
  models: Model[];
};

export type ModelRankingRefreshStatusView = {
  cacheMaxAgeSeconds: number;
  generatedAt: string;
  generatedCount: number;
  latestJob: ModelRankingRefreshJobItem | null;
  nextRefreshAt: string;
  organizationId: number;
  rankScope: string;
  refreshIntervalSeconds: number;
  snapshotDate: string;
  snapshotPeriod: string;
  sourceCount: number;
  sourceTables: string[];
  status: ModelRankingRefreshStatus['status'];
  tenantId: number;
  windowEnd: string;
  windowStart: string;
};

export type ModelRankingRefreshJobHistoryView = ModelRankingRefreshJobHistoryPage;

export type ModelRankingRefreshTriggerView = ModelRankingRefreshTriggerResponse;

export type VendorCreateInput = {
  name: string;
  status: Vendor['status'];
  color: string;
  description: string;
};

export type ModelRegionPriceInput = {
  regionCode: string;
  priceIn: string;
  priceOut: string;
  cacheReadPrice?: string;
  cacheWritePrice?: string;
};

export type ModelCreateInput = {
  vendorId: string;
  model?: string;
  displayName?: string | null;
  name?: string;
  type: Model['type'];
  priceIn: string;
  priceOut: string;
  cacheReadPrice: string;
  cacheWritePrice: string;
  regionPrices: ModelRegionPriceInput[];
  contextTokens: string;
  maxOutputTokens?: number | null;
  description?: string | null;
  capabilityIntro?: string | null;
  limitations?: string[];
  supportedLanguages?: string[];
  useCases?: string[];
  supportsStreaming?: boolean;
  supportsTools?: boolean;
  supportsJsonSchema?: boolean;
};

export type ModelUpdateInput = ModelCreateInput & {
  currentType?: Model['type'];
};

type ModelPatchInput = Partial<ModelUpdateInput> & Pick<AdminAiModelUpdateRequest, 'status'>;

export const KNOWN_VENDORS = [
  { id: 'v_openai', name: 'OpenAI', desc: 'Industry leading LLMs inclusive of GPT-4 and DALL-E.' },
  { id: 'v_anthropic', name: 'Anthropic', desc: 'Claude models focused on safety and high context windows.' },
  { id: 'v_google', name: 'Google', desc: 'Gemini models with native multimodal capabilities.' },
  { id: 'v_meta', name: 'Meta', desc: 'Llama series open source models.' },
  { id: 'v_deepseek', name: 'DeepSeek', desc: 'DeepSeek models focus on reasoning and coding.' },
  { id: 'v_mistral', name: 'Mistral AI', desc: 'High-performance open-weight models from Europe.' },
  { id: 'v_cohere', name: 'Cohere', desc: 'Enterprise focused LLMs and advanced RAG embeddings.' },
  { id: 'custom', name: 'Custom', desc: '' },
];

export function selectPreferredModelVendorId(
  vendors: readonly Vendor[],
  currentVendorId?: string,
): string {
  if (currentVendorId && vendors.some((vendor) => vendor.id === currentVendorId)) {
    return currentVendorId;
  }
  return vendors.find((vendor) => vendor.name.toLowerCase() === 'openai')?.id ?? vendors[0]?.id ?? '';
}

export class ModelService {
  static async fetchVendors(): Promise<Vendor[]> {
    const result = await getClawRouterBackendSdkClient().ai.modelVendors.list();
    ensureSdkworkApiSuccess(result, 'Failed to fetch vendors');
    return readRequiredApiItems(result, 'Failed to fetch vendors')
      .map(normalizeVendor);
  }

  static async fetchModels(): Promise<Model[]> {
    const modelsResult = await getClawRouterBackendSdkClient().ai.models.list();
    ensureSdkworkApiSuccess(modelsResult, 'Failed to fetch models');
    const models = readRequiredApiItems(modelsResult, 'Failed to fetch models')
      .map(normalizeModel);
    const rankingCalls = modelCallsByName(await fetchModelRankingCallStats());
    if (rankingCalls.size === 0) {
      return models;
    }
    return models.map((model) => ({
      ...model,
      calls: rankingCalls.get(model.displayName) ?? rankingCalls.get(model.model) ?? model.calls,
    }));
  }

  static async fetchInitializedCatalog(): Promise<InitializedModelCatalog> {
    const [vendors, models] = await Promise.all([
      ModelService.fetchVendors(),
      ModelService.fetchModels(),
    ]);
    if (vendors.length > 0 && models.length > 0) {
      return {
        initialized: false,
        vendors,
        models,
      };
    }
    const synced = await ModelService.syncVendorsAndModels();
    return {
      initialized: true,
      vendors: synced.vendors,
      models: synced.models,
    };
  }

  static async fetchModelRankings(): Promise<Pick<ModelRankingItem, 'name' | 'requests' | 'baseVolume'>[]> {
    const result = await getClawRouterBackendSdkClient().ai.modelRankings.list({ limit: 200 });
    ensureSdkworkApiSuccess(result, 'Failed to fetch model rankings');
    return readRequiredApiItems(readApiRecord(result), 'Failed to fetch model rankings', ['items'])
      .map(normalizeRankingItem)
      .filter((item): item is Pick<ModelRankingItem, 'name' | 'requests' | 'baseVolume'> => item !== null);
  }

  static async fetchModelRankingRefreshStatus(): Promise<ModelRankingRefreshStatusView> {
    const result = await getClawRouterBackendSdkClient().ai.modelRankings.status.retrieve();
    ensureSdkworkApiSuccess(result, 'Failed to fetch model ranking refresh status');
    return normalizeModelRankingRefreshStatus(readApiRecord(result));
  }

  static async fetchModelRankingRefreshJobs(): Promise<ModelRankingRefreshJobHistoryView> {
    const result = await getClawRouterBackendSdkClient().ai.modelRankings.jobs.list({ limit: 20 });
    ensureSdkworkApiSuccess(result, 'Failed to fetch model ranking refresh jobs');
    return {
      items: readRequiredApiItems(readApiRecord(result), 'Failed to fetch model ranking refresh jobs', ['items'])
        .map(normalizeModelRankingRefreshJob),
    };
  }

  static async triggerModelRankingRefresh(): Promise<ModelRankingRefreshTriggerView> {
    const result = await getClawRouterBackendSdkClient().ai.modelRankings.refresh(
      toModelRankingRefreshTriggerRequest(),
    );
    ensureSdkworkApiSuccess(result, 'Failed to trigger model ranking refresh');
    return normalizeModelRankingRefreshTrigger(readApiRecord(result));
  }

  static async syncVendorsAndModels(): Promise<ModelCatalogSyncReport> {
    const result = await getClawRouterBackendSdkClient().ai.models.refresh(
      toSyncCatalogRequest(),
      createIdempotencyParams('admin-model-catalog-sync'),
    );
    ensureSdkworkApiSuccess(result, 'Failed to sync vendors and models');
    const data = readApiRecord(result);
    return {
      synced: readRequiredBoolean(data, 'synced', 'Model catalog sync response is missing synced flag'),
      source: readRequiredString(data, 'source', 'Model catalog sync response is missing source'),
      mode: readSyncMode(data),
      dryRun: readRequiredBoolean(data, 'dryRun', 'Model catalog sync response is missing dryRun flag'),
      catalogVersion: readRequiredString(data, 'catalogVersion', 'Model catalog sync response is missing catalogVersion'),
      requestedCatalogVersion: readNullableString(data, 'requestedCatalogVersion'),
      catalogRoot: readNullableString(data, 'catalogRoot'),
      vendorCodes: readStringArray(data, 'vendorCodes'),
      sourceHash: readSourceHash(data),
      meterCount: readRequiredNonNegativeInteger(data, 'meterCount', 'Model catalog sync response meter count'),
      vendorCount: readRequiredNonNegativeInteger(data, 'vendorCount', 'Model catalog sync response vendor count'),
      familyCount: readRequiredNonNegativeInteger(data, 'familyCount', 'Model catalog sync response family count'),
      modelCount: readRequiredNonNegativeInteger(data, 'modelCount', 'Model catalog sync response model count'),
      capabilityCount: readRequiredNonNegativeInteger(data, 'capabilityCount', 'Model catalog sync response capability count'),
      priceCount: readRequiredNonNegativeInteger(data, 'priceCount', 'Model catalog sync response price count'),
      rankingCount: readRequiredNonNegativeInteger(data, 'rankingCount', 'Model catalog sync response ranking count'),
      acceptedCount: readRequiredNonNegativeInteger(data, 'acceptedCount', 'Model catalog sync response accepted count'),
      snapshotId: readNullableString(data, 'snapshotId'),
      syncRunId: readNullableString(data, 'syncRunId'),
      vendors: readRequiredApiItems(result, 'Failed to sync vendors and models', ['vendors'])
        .map(normalizeVendor),
      models: readRequiredApiItems(data, 'Failed to sync vendors and models', ['models'])
        .map(normalizeModel),
    };
  }

  static async addVendor(vendor: VendorCreateInput): Promise<Vendor> {
    const result = await getClawRouterBackendSdkClient().ai.modelVendors.create(
      toCreateVendorRequest(vendor),
      createIdempotencyParams('admin-model-vendor-create'),
    );
    ensureSdkworkApiSuccess(result, 'Failed to add vendor');
    return normalizeVendor(readRequiredApiItem(result, 'Created vendor response is missing data'));
  }

  static async addModel(model: ModelCreateInput): Promise<Model> {
    const result = await getClawRouterBackendSdkClient().ai.models.create(
      toCreateModelRequest(model),
      createIdempotencyParams('admin-ai-model-create'),
    );
    ensureSdkworkApiSuccess(result, 'Failed to add model');
    return normalizeModel(readRequiredApiItem(result, 'Created model response is missing data'));
  }

  static async updateModel(id: string, model: ModelUpdateInput): Promise<Model> {
    const result = await getClawRouterBackendSdkClient().ai.models.update(
      requiredSafePathSegment(id, 'modelId'),
      toUpdateModelRequest(model),
    );
    ensureSdkworkApiSuccess(result, 'Failed to update model');
    return normalizeModel(readRequiredApiItem(result, 'Updated model response is missing data'));
  }

  static updateModelStatus(id: string, status: Model['status']): Promise<Model> {
    return updateModelPatch(id, { status }, 'Failed to update model status');
  }

  static async deleteModel(id: string): Promise<boolean> {
    const result = await getClawRouterBackendSdkClient().ai.models.delete(requiredSafePathSegment(id, 'modelId'));
    ensureDeleteResult(result, 'Model delete confirmation is required');
    return true;
  }
}

async function updateModelPatch(
  id: string,
  model: ModelPatchInput,
  errorMessage: string,
): Promise<Model> {
  const result = await getClawRouterBackendSdkClient().ai.models.update(
    requiredSafePathSegment(id, 'modelId'),
    toUpdateModelRequest(model),
  );
  ensureSdkworkApiSuccess(result, errorMessage);
  return normalizeModel(readRequiredApiItem(result, 'Updated model response is missing data'));
}

function ensureDeleteResult(result: unknown, message: string): void {
  ensureSdkworkApiSuccess(result, message);
  if (readBoolean(readApiRecord(result), 'deleted') !== true) {
    throw new Error(message);
  }
}

function normalizeModelRankingRefreshStatus(value: ApiRecord): ModelRankingRefreshStatusView {
  const status = readRequiredString(value, 'status', 'Model ranking refresh status is required');
  if (status !== 'ready' && status !== 'empty' && status !== 'unavailable') {
    throw new Error(`Unsupported model ranking refresh status: ${status}`);
  }
  return {
    status,
    tenantId: readRequiredNonNegativeInteger(value, 'tenantId', 'Model ranking refresh status tenant id'),
    organizationId: readRequiredNonNegativeInteger(value, 'organizationId', 'Model ranking refresh status organization id'),
    rankScope: readRequiredString(value, 'rankScope', 'Model ranking refresh status is missing rankScope'),
    snapshotDate: readString(value, 'snapshotDate'),
    snapshotPeriod: readRequiredString(value, 'snapshotPeriod', 'Model ranking refresh status is missing snapshotPeriod'),
    windowStart: readString(value, 'windowStart'),
    windowEnd: readString(value, 'windowEnd'),
    generatedAt: readString(value, 'generatedAt'),
    refreshIntervalSeconds: readRequiredPositiveInteger(value, 'refreshIntervalSeconds', 'Model ranking refresh status refresh interval seconds'),
    nextRefreshAt: readString(value, 'nextRefreshAt'),
    cacheMaxAgeSeconds: readRequiredPositiveInteger(value, 'cacheMaxAgeSeconds', 'Model ranking refresh status cache max age seconds'),
    generatedCount: readRequiredNonNegativeInteger(value, 'generatedCount', 'Model ranking refresh status generated count'),
    sourceCount: readRequiredNonNegativeInteger(value, 'sourceCount', 'Model ranking refresh status source count'),
    sourceTables: readStringArray(value, 'sourceTables'),
    latestJob: isRecord(value.latestJob) ? normalizeModelRankingRefreshJob(value.latestJob) : null,
  };
}

function normalizeModelRankingRefreshJob(value: unknown): ModelRankingRefreshJobItem {
  const item = readRequiredRecord(value, 'Model ranking refresh job record is required');
  const status = readRequiredString(item, 'status', 'Model ranking refresh job status is required');
  if (status !== 'succeeded' && status !== 'failed' && status !== 'empty' && status !== 'skipped' && status !== 'running') {
    throw new Error(`Unsupported model ranking refresh job status: ${status}`);
  }
  return {
    id: readRequiredString(item, 'id', 'Model ranking refresh job id is required'),
    jobName: readRequiredString(item, 'jobName', 'Model ranking refresh job name is required'),
    status,
    tenantId: readRequiredNonNegativeInteger(item, 'tenantId', 'Model ranking refresh job tenant id'),
    organizationId: readRequiredNonNegativeInteger(item, 'organizationId', 'Model ranking refresh job organization id'),
    rankScope: readRequiredString(item, 'rankScope', 'Model ranking refresh job is missing rankScope'),
    snapshotDate: readString(item, 'snapshotDate'),
    snapshotPeriod: readRequiredString(item, 'snapshotPeriod', 'Model ranking refresh job is missing snapshotPeriod'),
    windowStart: readString(item, 'windowStart'),
    windowEnd: readString(item, 'windowEnd'),
    startedAt: readString(item, 'startedAt'),
    endedAt: readString(item, 'endedAt'),
    durationMs: readRequiredNonNegativeInteger(item, 'durationMs', 'Model ranking refresh job duration ms'),
    generatedCount: readRequiredNonNegativeInteger(item, 'generatedCount', 'Model ranking refresh job generated count'),
    sourceCount: readRequiredNonNegativeInteger(item, 'sourceCount', 'Model ranking refresh job source count'),
    successCount: readRequiredNonNegativeInteger(item, 'successCount', 'Model ranking refresh job success count'),
    failureCount: readRequiredNonNegativeInteger(item, 'failureCount', 'Model ranking refresh job failure count'),
    nextRefreshAt: readString(item, 'nextRefreshAt'),
    failureReason: readNullableString(item, 'failureReason'),
  };
}

function normalizeModelRankingRefreshTrigger(value: ApiRecord): ModelRankingRefreshTriggerView {
  const status = readRequiredString(value, 'status', 'Model ranking refresh trigger status is required');
  if (status !== 'succeeded' && status !== 'empty') {
    throw new Error(`Unsupported model ranking refresh trigger status: ${status}`);
  }
  return {
    triggered: readRequiredBoolean(value, 'triggered', 'Model ranking refresh trigger response is missing triggered flag'),
    status,
    tenantId: readRequiredNonNegativeInteger(value, 'tenantId', 'Model ranking refresh trigger tenant id'),
    organizationId: readRequiredNonNegativeInteger(value, 'organizationId', 'Model ranking refresh trigger organization id'),
    rankScope: readRequiredString(value, 'rankScope', 'Model ranking refresh trigger response is missing rankScope'),
    snapshotDate: readRequiredString(value, 'snapshotDate', 'Model ranking refresh trigger response is missing snapshotDate'),
    snapshotPeriod: readSnapshotPeriod(value, 'snapshotPeriod', 'Model ranking refresh trigger response is missing snapshotPeriod'),
    windowStart: readRequiredString(value, 'windowStart', 'Model ranking refresh trigger response is missing windowStart'),
    windowEnd: readRequiredString(value, 'windowEnd', 'Model ranking refresh trigger response is missing windowEnd'),
    generatedCount: readRequiredNonNegativeInteger(value, 'generatedCount', 'Model ranking refresh trigger generated count'),
    sourceCount: readRequiredNonNegativeInteger(value, 'sourceCount', 'Model ranking refresh trigger source count'),
    refreshIntervalSeconds: readRequiredPositiveInteger(value, 'refreshIntervalSeconds', 'Model ranking refresh trigger refresh interval seconds'),
    cacheMaxAgeSeconds: readRequiredPositiveInteger(value, 'cacheMaxAgeSeconds', 'Model ranking refresh trigger cache max age seconds'),
    nextRefreshAt: readRequiredString(value, 'nextRefreshAt', 'Model ranking refresh trigger response is missing nextRefreshAt'),
  };
}

function fetchModelRankingCallStats(): Promise<Pick<ModelRankingItem, 'name' | 'requests' | 'baseVolume'>[]> {
  return ModelService.fetchModelRankings().catch(() => []);
}

function toModelRankingRefreshTriggerRequest(): ModelRankingRefreshTriggerRequest {
  return {
    rankScope: 'commercial-default',
    snapshotPeriod: 'daily',
    limit: 200,
    lookbackDays: 7,
    refreshIntervalSeconds: 3600,
    cacheMaxAgeSeconds: 60,
  };
}

function toSyncCatalogRequest(): AdminModelCatalogSyncRequest {
  return {
    source: 'sdkwork_models',
    mode: 'official_refresh',
    force: true,
  };
}

function toCreateVendorRequest(vendor: VendorCreateInput): AdminModelVendorCreateRequest {
  return {
    name: requiredText(vendor.name, 'name'),
    status: vendor.status,
    color: safeStyleToken(vendor.color || 'bg-slate-700'),
    description: optionalText(vendor.description, 'description', 512),
  };
}

function toCreateModelRequest(model: ModelCreateInput): AdminAiModelCreateRequest {
  const regionPrices = normalizedRegionPrices(model);
  const runtimeModel = resolveModelIdentifier(model);
  const request: AdminAiModelCreateRequest = {
    vendorId: requiredText(model.vendorId, 'vendorId'),
    model: modelName(runtimeModel),
    displayName: optionalNullableText(model.displayName, 'displayName', 128) ?? undefined,
    type: modelType(model.type),
    priceIn: decimalAmount(model.priceIn, 'priceIn'),
    priceOut: decimalAmount(model.priceOut, 'priceOut'),
    cacheReadPrice: optionalDecimalAmount(model.cacheReadPrice, 'cacheReadPrice'),
    cacheWritePrice: optionalDecimalAmount(model.cacheWritePrice, 'cacheWritePrice'),
    regionPrices: regionPrices.map((regionPrice) => ({
      regionCode: regionCode(regionPrice.regionCode, 'regionPrices.regionCode'),
      priceIn: decimalAmount(regionPrice.priceIn, `regionPrices.${regionPrice.regionCode}.priceIn`),
      priceOut: decimalAmount(regionPrice.priceOut, `regionPrices.${regionPrice.regionCode}.priceOut`),
      cacheReadPrice: optionalDecimalAmount(regionPrice.cacheReadPrice, `regionPrices.${regionPrice.regionCode}.cacheReadPrice`),
      cacheWritePrice: optionalDecimalAmount(regionPrice.cacheWritePrice, `regionPrices.${regionPrice.regionCode}.cacheWritePrice`),
    })),
    contextTokens: requiredText(model.contextTokens, 'contextTokens'),
    ...defaultModelCreateMetadata(model.type),
    ...modelCapabilityMetadata(model),
  };
  return removeUndefinedProperties(request);
}

function toUpdateModelRequest(model: ModelPatchInput): AdminAiModelUpdateRequest {
  const request: AdminAiModelUpdateRequest = {
    ...modelCapabilityMetadata(model),
  };
  if (model.vendorId !== undefined) {
    request.vendorId = requiredText(model.vendorId, 'vendorId');
  }
  if (model.model !== undefined || model.name !== undefined) {
    request.model = modelName(resolveModelIdentifier(model));
  }
  if (model.displayName !== undefined) {
    request.displayName = optionalNullableText(model.displayName, 'displayName', 128) ?? undefined;
  }
  if (model.priceIn !== undefined) {
    request.priceIn = decimalAmount(model.priceIn, 'priceIn');
  }
  if (model.priceOut !== undefined) {
    request.priceOut = decimalAmount(model.priceOut, 'priceOut');
  }
  if (model.cacheReadPrice !== undefined) {
    request.cacheReadPrice = optionalDecimalAmount(model.cacheReadPrice, 'cacheReadPrice');
  }
  if (model.cacheWritePrice !== undefined) {
    request.cacheWritePrice = optionalDecimalAmount(model.cacheWritePrice, 'cacheWritePrice');
  }
  if (model.regionPrices !== undefined || model.priceIn !== undefined || model.priceOut !== undefined) {
    request.regionPrices = normalizedRegionPrices(model).map((regionPrice) => ({
      regionCode: regionCode(regionPrice.regionCode, 'regionPrices.regionCode'),
      priceIn: decimalAmount(regionPrice.priceIn, `regionPrices.${regionPrice.regionCode}.priceIn`),
      priceOut: decimalAmount(regionPrice.priceOut, `regionPrices.${regionPrice.regionCode}.priceOut`),
      cacheReadPrice: optionalDecimalAmount(regionPrice.cacheReadPrice, `regionPrices.${regionPrice.regionCode}.cacheReadPrice`),
      cacheWritePrice: optionalDecimalAmount(regionPrice.cacheWritePrice, `regionPrices.${regionPrice.regionCode}.cacheWritePrice`),
    }));
  }
  if (model.contextTokens !== undefined) {
    request.contextTokens = requiredText(model.contextTokens, 'contextTokens');
  }
  if (model.status !== undefined) {
    request.status = model.status;
  }
  if (model.type !== undefined) {
    const nextType = modelType(model.type);
    if (!model.currentType || model.currentType !== nextType) {
      Object.assign(request, defaultModelCreateMetadata(nextType));
      request.type = nextType;
    }
  }
  return request;
}

function normalizedRegionPrices(model: Partial<Pick<ModelCreateInput, 'priceIn' | 'priceOut' | 'cacheReadPrice' | 'cacheWritePrice'>> & {
  regionPrices?: ModelRegionPriceInput[];
}): ModelRegionPriceInput[] {
  if (Array.isArray(model.regionPrices) && model.regionPrices.length > 0) {
    return model.regionPrices;
  }
  return [{
    regionCode: 'global',
    priceIn: requiredText(model.priceIn ?? '', 'priceIn'),
    priceOut: requiredText(model.priceOut ?? '', 'priceOut'),
    cacheReadPrice: model.cacheReadPrice,
    cacheWritePrice: model.cacheWritePrice,
  }];
}

function requiredText(value: string, fieldName: string): string {
  const normalized = value.trim();
  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }
  return normalized;
}

function optionalText(value: string | undefined, fieldName: string, maxLength: number): string {
  if (value === undefined) {
    return '';
  }
  const normalized = value.trim();
  if (normalized.length > maxLength) {
    throw new Error(`${fieldName} must be at most ${maxLength} characters`);
  }
  return normalized;
}

function optionalNullableText(value: string | null | undefined, fieldName: string, maxLength: number): string | null {
  if (value === null) {
    return null;
  }
  const normalized = optionalText(value, fieldName, maxLength);
  return normalized || null;
}

function modelName(value: string): string {
  const normalized = requiredText(value, 'model');
  if (!/^[A-Za-z0-9._:/-]+$/.test(normalized)) {
    throw new Error('model must use ASCII letters, numbers, dot, underscore, colon, slash, or hyphen');
  }
  return normalized;
}

function resolveModelIdentifier(model: Pick<ModelCreateInput, 'model' | 'name'>): string {
  const runtimeModel = model.model?.trim() || model.name?.trim() || '';
  if (!runtimeModel) {
    throw new Error('model is required');
  }
  return runtimeModel;
}

function regionCode(value: string, fieldName: string): string {
  const normalized = requiredText(value, fieldName);
  if (!/^[a-z0-9][a-z0-9_-]{0,63}$/.test(normalized)) {
    throw new Error(`${fieldName} must be a lowercase region code`);
  }
  return normalized;
}

function modelType(value: Model['type']): AdminAiModelCreateRequest['type'] {
  if (value === 'Chat' || value === 'Image' || value === 'Audio' || value === 'Embedding' || value === 'Music' || value === 'SoundEffect' || value === 'Video') {
    return value;
  }
  throw new Error(value ? `Unsupported model type: ${value}` : 'Model type is required');
}

function decimalAmount(value: string, fieldName: string): string {
  const normalized = requiredText(value, fieldName).replace(/,/g, '');
  if (!/^[0-9]+(\.[0-9]{1,12})?$/.test(normalized)) {
    throw new Error(`${fieldName} must be a positive decimal amount`);
  }
  const numeric = Number(normalized);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    throw new Error(`${fieldName} must be greater than zero`);
  }
  return normalized;
}

function optionalDecimalAmount(value: string | undefined, fieldName: string): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  const normalized = value.trim().replace(/,/g, '');
  if (!normalized) {
    return '';
  }
  if (!/^[0-9]+(\.[0-9]{1,12})?$/.test(normalized)) {
    throw new Error(`${fieldName} must be a positive decimal amount`);
  }
  const numeric = Number(normalized);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    throw new Error(`${fieldName} must be greater than zero`);
  }
  return normalized;
}

function removeUndefinedProperties<T extends object>(value: T): T {
  const record = value as Record<string, unknown>;
  for (const key of Object.keys(value)) {
    if (record[key] === undefined) {
      delete record[key];
    }
  }
  return value;
}

function optionalNonNegativeInteger(value: number | null | undefined, fieldName: string): number | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(`${fieldName} must be a non-negative integer`);
  }
  return value;
}

function boundedStringArray(values: string[] | undefined, fieldName: string, maxItems: number, maxLength: number): string[] {
  const normalizedValues = values ?? [];
  if (normalizedValues.length > maxItems) {
    throw new Error(`${fieldName} must contain at most ${maxItems} items`);
  }
  return normalizedValues.map((value) => {
    const normalized = requiredText(value, fieldName);
    if (normalized.length > maxLength) {
      throw new Error(`${fieldName} items must be at most ${maxLength} characters`);
    }
    return normalized;
  });
}

function modelCapabilityMetadata(model: Partial<ModelCreateInput>): Partial<Pick<
  AdminAiModelCreateRequest,
  | 'description'
  | 'capabilityIntro'
  | 'limitations'
  | 'supportedLanguages'
  | 'useCases'
  | 'maxOutputTokens'
  | 'supportsStreaming'
  | 'supportsTools'
  | 'supportsJsonSchema'
>> {
  const metadata: Partial<AdminAiModelCreateRequest> = {};
  if (model.description !== undefined) {
    metadata.description = optionalNullableText(model.description, 'description', 2048);
  }
  if (model.capabilityIntro !== undefined) {
    metadata.capabilityIntro = optionalNullableText(model.capabilityIntro, 'capabilityIntro', 4096);
  }
  if (model.limitations !== undefined) {
    metadata.limitations = boundedStringArray(model.limitations, 'limitations', 64, 512);
  }
  if (model.supportedLanguages !== undefined) {
    metadata.supportedLanguages = boundedStringArray(model.supportedLanguages, 'supportedLanguages', 128, 128);
  }
  if (model.useCases !== undefined) {
    metadata.useCases = boundedStringArray(model.useCases, 'useCases', 64, 256);
  }
  if (model.maxOutputTokens !== undefined) {
    metadata.maxOutputTokens = optionalNonNegativeInteger(model.maxOutputTokens, 'maxOutputTokens');
  }
  if (typeof model.supportsStreaming === 'boolean') {
    metadata.supportsStreaming = model.supportsStreaming;
  }
  if (typeof model.supportsTools === 'boolean') {
    metadata.supportsTools = model.supportsTools;
  }
  if (typeof model.supportsJsonSchema === 'boolean') {
    metadata.supportsJsonSchema = model.supportsJsonSchema;
  }
  return metadata;
}

function safeStyleToken(value: string): string {
  const normalized = requiredText(value, 'color');
  if (!/^[A-Za-z0-9_:/#-]{1,64}$/.test(normalized)) {
    throw new Error('color must be a safe style token');
  }
  return normalized;
}

function normalizeVendor(value: unknown): Vendor {
  const item = readRequiredRecord(value, 'Vendor record is required');
  return {
    id: readRequiredString(item, 'id', 'Vendor id is required'),
    vendorCode: readRequiredString(item, 'vendorCode', 'Vendor code is required'),
    name: readRequiredString(item, 'name', 'Vendor name is required'),
    status: readVendorStatus(item),
    color: readRequiredString(item, 'color', 'Vendor color is required'),
    description: readRequiredString(item, 'description', 'Vendor description is required'),
  };
}

function normalizeModel(value: unknown): Model {
  const item = readRequiredRecord(value, 'Model record is required');
  const runtimeModel = readModelIdentifier(item);
  const displayName = readModelDisplayName(item, runtimeModel);
  return {
    id: readRequiredString(item, 'id', 'Model id is required'),
    vendorId: readRequiredString(item, 'vendorId', 'Model vendor id is required'),
    vendorCode: readRequiredString(item, 'vendorCode', 'Model vendor code is required'),
    model: runtimeModel,
    displayName,
    name: displayName,
    type: readModelType(item),
    priceIn: readRequiredStringField(item, 'priceIn', 'Model input price is required'),
    priceOut: readRequiredStringField(item, 'priceOut', 'Model output price is required'),
    cacheReadPrice: readRequiredStringField(item, 'cacheReadPrice', 'Model cache read price is required'),
    cacheWritePrice: readRequiredStringField(item, 'cacheWritePrice', 'Model cache write price is required'),
    status: readModelStatus(item),
    calls: readRequiredString(item, 'calls', 'Model calls are required'),
    description: readRequiredNullableString(item, 'description', 'Model description field is required'),
    modalities: readRequiredStringArray(item, 'modalities', 'Model modalities are required'),
    inputModalities: readRequiredStringArray(item, 'inputModalities', 'Model input modalities are required'),
    outputModalities: readRequiredStringArray(item, 'outputModalities', 'Model output modalities are required'),
    apiFormat: readRequiredNullableString(item, 'apiFormat', 'Model API format field is required'),
    capabilityIntro: readRequiredNullableString(item, 'capabilityIntro', 'Model capability intro field is required'),
    limitations: readRequiredStringArray(item, 'limitations', 'Model limitations are required'),
    supportedLanguages: readRequiredStringArray(item, 'supportedLanguages', 'Model supported languages are required'),
    useCases: readRequiredStringArray(item, 'useCases', 'Model use cases are required'),
    trainingDataCutoff: readRequiredNullableString(item, 'trainingDataCutoff', 'Model training data cutoff field is required'),
    contextTokens: readRequiredContextTokens(item),
    maxOutputTokens: readRequiredNullableNonNegativeInteger(item, 'maxOutputTokens', 'Model max output tokens field is required', 'Model max output tokens'),
    supportsStreaming: readRequiredBoolean(item, 'supportsStreaming', 'Model streaming support flag is required'),
    supportsTools: readRequiredBoolean(item, 'supportsTools', 'Model tools support flag is required'),
    supportsJsonSchema: readRequiredBoolean(item, 'supportsJsonSchema', 'Model JSON schema support flag is required'),
    releaseStage: readRequiredNullableNumber(item, 'releaseStage', 'Model release stage field is required', 'Model release stage'),
    shelfState: readRequiredNullableNumber(item, 'shelfState', 'Model shelf state field is required', 'Model shelf state'),
    routingState: readRequiredNullableNumber(item, 'routingState', 'Model routing state field is required', 'Model routing state'),
    replacementModel: readRequiredNullableString(item, 'replacementModel', 'Model replacement model field is required'),
  };
}

function readModelIdentifier(item: ApiRecord): string {
  return readRequiredStringField(item, 'model', 'Model model is required');
}

function readModelDisplayName(item: ApiRecord, runtimeModel: string): string {
  const displayName = readString(item, 'displayName').trim();
  if (displayName) {
    return displayName;
  }
  const name = readString(item, 'name').trim();
  return name || runtimeModel;
}

function modelCallsByName(items: Pick<ModelRankingItem, 'name' | 'requests' | 'baseVolume'>[]): Map<string, string> {
  const callsByName = new Map<string, string>();
  items
    .forEach((item) => {
      const calls = item.requests > 0 ? item.requests : item.baseVolume;
      callsByName.set(item.name, formatCount(calls));
    });
  return callsByName;
}

function normalizeRankingItem(value: unknown): Pick<ModelRankingItem, 'name' | 'requests' | 'baseVolume'> | null {
  if (!isRecord(value)) {
    return null;
  }
  const name = readString(value, 'name').trim();
  if (!name) {
    return null;
  }
  return {
    name,
    requests: readRequiredNonNegativeInteger(value, 'requests', 'Admin model ranking requests'),
    baseVolume: readRequiredNonNegativeInteger(value, 'baseVolume', 'Admin model ranking base volume'),
  };
}

function readRequiredNonNegativeInteger(record: ApiRecord, key: string, label: string): number {
  const value = readNumber(record, key, Number.NaN);
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${label} must be a non-negative integer`);
  }
  return value;
}

function readRequiredPositiveInteger(record: ApiRecord, key: string, label: string): number {
  const value = readNumber(record, key, Number.NaN);
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${label} must be a positive integer`);
  }
  return value;
}

function readRequiredStringArray(item: ApiRecord, key: string, message: string): string[] {
  if (!Array.isArray(item[key])) {
    throw new Error(message);
  }
  return readStringArray(item, key);
}

function readRequiredNullableString(item: ApiRecord, key: string, message: string): string | null {
  if (!(key in item)) {
    throw new Error(message);
  }
  return readNullableString(item, key);
}

function readRequiredStringField(item: ApiRecord, key: string, message: string): string {
  if (!(key in item)) {
    throw new Error(message);
  }
  return readString(item, key).trim();
}

function readRequiredNullableNumber(item: ApiRecord, key: string, message: string, label: string): number | null {
  if (!(key in item)) {
    throw new Error(message);
  }
  const value = item[key];
  if (value === null || value === '') {
    return null;
  }
  const parsed = readNumber(item, key, Number.NaN);
  if (!Number.isFinite(parsed)) {
    throw new Error(`${label} must be a number or null`);
  }
  return parsed;
}

function readRequiredContextTokens(item: ApiRecord): number | null {
  return readRequiredNullableNonNegativeInteger(
    item,
    'contextTokens',
    'Model context tokens field is required',
    'Model context tokens',
  );
}

function readRequiredNullableNonNegativeInteger(
  item: ApiRecord,
  key: string,
  missingMessage: string,
  label: string,
): number | null {
  if (!(key in item)) {
    throw new Error(missingMessage);
  }
  const value = item[key];
  if (value === null) {
    return null;
  }
  const parsed = readNumber(item, key, Number.NaN);
  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new Error(`${label} must be a non-negative integer`);
  }
  return parsed;
}

function formatCount(value: number): string {
  if (!Number.isFinite(value) || value <= 0) {
    return '0';
  }
  if (value >= 1_000_000_000) {
    return `${trimDecimal(value / 1_000_000_000)}B`;
  }
  if (value >= 1_000_000) {
    return `${trimDecimal(value / 1_000_000)}M`;
  }
  if (value >= 1_000) {
    return `${trimDecimal(value / 1_000)}k`;
  }
  return Math.trunc(value).toLocaleString();
}

function trimDecimal(value: number): string {
  return value.toFixed(1).replace(/\.0$/u, '');
}

function readRequiredRecord(value: unknown, message: string): ApiRecord {
  if (!isRecord(value)) {
    throw new Error(message);
  }
  return value;
}

function readRequiredBoolean(item: ApiRecord, key: string, message: string): boolean {
  const value = item[key];
  if (typeof value === 'boolean') {
    return value;
  }
  throw new Error(message);
}

function readVendorStatus(item: ApiRecord): Vendor['status'] {
  const status = readRequiredString(item, 'status', 'Vendor status is required');
  if (status === 'active' || status === 'inactive') {
    return status;
  }
  throw new Error(`Unsupported vendor status: ${status}`);
}

function readModelStatus(item: ApiRecord): Model['status'] {
  const status = readRequiredString(item, 'status', 'Model status is required');
  if (status === 'active' || status === 'inactive') {
    return status;
  }
  throw new Error(`Unsupported model status: ${status}`);
}

function readSyncMode(item: ApiRecord): AdminModelCatalogSyncResponse['mode'] {
  const mode = readRequiredString(item, 'mode', 'Model catalog sync response is missing mode');
  if (mode === 'official_refresh' || mode === 'vendor_refresh' || mode === 'catalog_version_refresh' || mode === 'dry_run') {
    return mode;
  }
  throw new Error(`Unsupported model catalog sync mode: ${mode}`);
}

function readSourceHash(item: ApiRecord): string {
  const value = readRequiredString(item, 'sourceHash', 'Model catalog sync response is missing sourceHash');
  if (!/^[a-f0-9]{64}$/.test(value)) {
    throw new Error('Model catalog sync sourceHash must be a 64 character lowercase SHA-256 hex digest');
  }
  return value;
}

function readSnapshotPeriod(
  item: ApiRecord,
  key: string,
  message: string,
): ModelRankingRefreshTriggerResponse['snapshotPeriod'] {
  const period = readRequiredString(item, key, message);
  if (period === 'hourly' || period === 'daily' || period === 'weekly' || period === 'monthly') {
    return period;
  }
  throw new Error(`Unsupported model ranking snapshot period: ${period}`);
}

function readModelType(item: ApiRecord): Model['type'] {
  const type = readString(item, 'type');
  if (type === 'Chat' || type === 'Image' || type === 'Audio' || type === 'Embedding' || type === 'Music' || type === 'SoundEffect' || type === 'Video') {
    return type;
  }
  throw new Error(type ? `Unsupported model type: ${type}` : 'Model type is required');
}

function readNullableNumber(item: ApiRecord, key: string): number | null {
  const value = item[key];
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const parsed = readNumber(item, key, Number.NaN);
  return Number.isFinite(parsed) ? parsed : null;
}

function defaultModelCreateMetadata(type: Model['type']): Pick<
  AdminAiModelCreateRequest,
  | 'modalities'
  | 'inputModalities'
  | 'outputModalities'
  | 'apiFormat'
  | 'supportsStreaming'
  | 'supportsTools'
  | 'supportsJsonSchema'
  | 'releaseStage'
  | 'shelfState'
  | 'routingState'
> {
  const common = {
    releaseStage: 1,
    shelfState: 1,
    routingState: 1,
  };
  switch (type) {
    case 'Image':
      return {
        ...common,
        modalities: ['image'],
        inputModalities: ['text', 'image'],
        outputModalities: ['image'],
        apiFormat: 'openai_compatible',
        supportsStreaming: false,
        supportsTools: false,
        supportsJsonSchema: false,
      };
    case 'Audio':
      return {
        ...common,
        modalities: ['audio'],
        inputModalities: ['audio', 'text'],
        outputModalities: ['audio', 'text'],
        apiFormat: 'openai_compatible',
        supportsStreaming: false,
        supportsTools: false,
        supportsJsonSchema: false,
      };
    case 'Embedding':
      return {
        ...common,
        modalities: ['embedding'],
        inputModalities: ['text'],
        outputModalities: ['embedding'],
        apiFormat: 'openai_compatible',
        supportsStreaming: false,
        supportsTools: false,
        supportsJsonSchema: false,
      };
    case 'Music':
      return {
        ...common,
        modalities: ['music'],
        inputModalities: ['text', 'audio'],
        outputModalities: ['audio'],
        apiFormat: 'openai_compatible',
        supportsStreaming: false,
        supportsTools: false,
        supportsJsonSchema: false,
      };
    case 'SoundEffect':
      return {
        ...common,
        modalities: ['sfx'],
        inputModalities: ['text', 'audio'],
        outputModalities: ['audio'],
        apiFormat: 'openai_compatible',
        supportsStreaming: false,
        supportsTools: false,
        supportsJsonSchema: false,
      };
    case 'Video':
      return {
        ...common,
        modalities: ['video'],
        inputModalities: ['text', 'image', 'video'],
        outputModalities: ['video'],
        apiFormat: 'openai_compatible',
        supportsStreaming: false,
        supportsTools: false,
        supportsJsonSchema: false,
      };
    default:
      return {
        ...common,
        modalities: ['text'],
        inputModalities: ['text', 'image'],
        outputModalities: ['text'],
        apiFormat: 'openai_responses',
        supportsStreaming: true,
        supportsTools: true,
        supportsJsonSchema: true,
      };
  }
}
