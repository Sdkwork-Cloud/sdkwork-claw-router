import {
  ensurePlusApiSuccess,
  getClawRouterAppSdkClient,
  getStoredAppSessionAuthToken,
  hasStoredPortalSession,
  isRecord,
  readBoolean,
  readNullableString,
  readNumber,
  readRequiredApiItems,
  readRequiredString,
  readStringArray,
  type ApiRecord,
} from 'sdkwork-claw-router-commons/runtime';
import { mapGenerationHistoryItems } from './historyMapper.ts';
export type { PlaygroundHistoryItem, PlaygroundMedia, PlaygroundModelGroup, PlaygroundModelOption } from './playgroundTypes.ts';
import type * as SdkworkGeneration from '@sdkwork/generation-pc-react';
import type { PlaygroundHistoryItem, PlaygroundModelBucket, PlaygroundModelGroup, PlaygroundModelOption } from './playgroundTypes.ts';

const MODEL_BUCKETS: PlaygroundModelBucket[] = ['llms', 'images', 'videos', 'audios', 'music', 'sfx'];
const UNKNOWN_MODEL_LABEL = 'Unknown model';
const TITLE_MAX_LENGTH = 96;

type CreateSdkworkGenerationServiceOptions = SdkworkGeneration.CreateSdkworkGenerationServiceOptions;
type SdkworkGenerationRun = SdkworkGeneration.SdkworkGenerationRun;
type SdkworkGenerationService = SdkworkGeneration.SdkworkGenerationService;
type SdkworkGenerationStatus = SdkworkGeneration.SdkworkGenerationStatus;
type SdkworkGenerationWorkspaceData = SdkworkGeneration.SdkworkGenerationWorkspaceData;
type SdkworkGenerationServiceFactory = (
  options?: CreateSdkworkGenerationServiceOptions,
) => SdkworkGenerationService;

export class PlaygroundService {
  static async fetchGenerationHistory(): Promise<PlaygroundHistoryItem[]> {
    if (!hasStoredPortalSession()) {
      return [];
    }
    const result = await getClawRouterAppSdkClient().ai.generations.list();
    ensurePlusApiSuccess(result, 'Failed to fetch Playground history');
    return mapGenerationHistoryItems(readRequiredApiItems(result, 'Failed to fetch Playground history'));
  }

  static fetchGenerationWorkspace(): Promise<SdkworkGenerationWorkspaceData> {
    return fetchGenerationWorkspaceData();
  }

  static async fetchModelGroups(): Promise<PlaygroundModelGroup[]> {
    const result = await getClawRouterAppSdkClient().ai.models.list();
    ensurePlusApiSuccess(result, 'Failed to fetch Playground model groups');
    const items = readRequiredApiItems(result, 'Playground model catalog response missing items');
    return groupModelCatalogItems(items);
  }
}

async function fetchGenerationWorkspaceData(): Promise<SdkworkGenerationWorkspaceData> {
  const runs = mapHistoryToGenerationRuns(await PlaygroundService.fetchGenerationHistory());
  const createSdkworkGenerationService = await loadSdkworkGenerationServiceFactory();
  const service = createSdkworkGenerationService({
    getSessionTokens: readGenerationSessionTokens,
    listRuns: async () => runs,
    runs,
  });
  const workspace = await service.getWorkspace();

  if (runs.length === 0 && workspace.runs.length > 0) {
    return createGenerationWorkspaceData({
      isAuthenticated: isGenerationAuthenticated(),
      runs,
    });
  }
  return workspace;
}

async function loadSdkworkGenerationServiceFactory(): Promise<SdkworkGenerationServiceFactory> {
  try {
    const generationModule = await import('@sdkwork/generation-pc-react');
    if (typeof generationModule.createSdkworkGenerationService === 'function') {
      return generationModule.createSdkworkGenerationService as SdkworkGenerationServiceFactory;
    }
  } catch (error) {
    if (isMissingGenerationModule(error)) {
      return createFallbackSdkworkGenerationService;
    }
    throw error;
  }
  return createFallbackSdkworkGenerationService;
}

function createFallbackSdkworkGenerationService(
  options: CreateSdkworkGenerationServiceOptions = {},
): SdkworkGenerationService {
  const fallbackRuns = options.runs ?? [];

  return {
    getEmptyWorkspace: () => {
      return createGenerationWorkspaceData({
        isAuthenticated: isGenerationAuthenticated(options),
        runs: fallbackRuns,
      });
    },

    getWorkspace: async () => {
      const runs = options.listRuns ? await options.listRuns() : fallbackRuns;
      return createGenerationWorkspaceData({
        isAuthenticated: isGenerationAuthenticated(options),
        runs,
      });
    },
  };
}

function mapHistoryToGenerationRuns(items: PlaygroundHistoryItem[]): SdkworkGenerationRun[] {
  return items.map((item): SdkworkGenerationRun => ({
    id: item.id,
    latencyMs: 0,
    model: normalizeText(item.modelInfo) || UNKNOWN_MODEL_LABEL,
    promptPreview: item.prompt,
    status: normalizeGenerationStatus(item.status),
    title: createGenerationRunTitle(item),
    tokensUsed: 0,
    updatedAt: readGenerationUpdatedAt(item),
  }));
}

function createGenerationRunTitle(item: PlaygroundHistoryItem): string {
  const title = normalizeText(item.prompt) || item.id;
  if (title.length <= TITLE_MAX_LENGTH) {
    return title;
  }
  return `${title.slice(0, TITLE_MAX_LENGTH - 3).trimEnd()}...`;
}

function normalizeGenerationStatus(value: string | undefined): SdkworkGenerationStatus {
  switch (normalizeText(value)) {
    case 'pending':
    case 'queued':
      return 'queued';
    case 'processing':
    case 'running':
      return 'running';
    case 'failed':
    case 'cancelled':
      return 'failed';
    case 'completed':
    default:
      return 'completed';
  }
}

function readGenerationUpdatedAt(item: PlaygroundHistoryItem): string {
  return normalizeText(item.updatedAt) || normalizeText(item.createdAt) || `${item.date}T00:00:00Z`;
}

function createGenerationWorkspaceData({
  isAuthenticated,
  runs,
}: {
  isAuthenticated: boolean;
  runs: readonly SdkworkGenerationRun[];
}): SdkworkGenerationWorkspaceData {
  const sortedRuns = sortGenerationRunsByRecent(runs);
  return {
    digest: {
      completedRuns: sortedRuns.filter((run) => run.status === 'completed').length,
      failedRuns: sortedRuns.filter((run) => run.status === 'failed').length,
      runningRuns: sortedRuns.filter((run) => run.status === 'running').length,
      totalRuns: sortedRuns.length,
      totalTokensUsed: sortedRuns.reduce((total, run) => total + run.tokensUsed, 0),
    },
    isAuthenticated,
    runs: sortedRuns,
  };
}

function sortGenerationRunsByRecent(runs: readonly SdkworkGenerationRun[]): SdkworkGenerationRun[] {
  return [...runs].sort((left, right) => (
    readTimestamp(right.updatedAt) - readTimestamp(left.updatedAt)
    || left.title.localeCompare(right.title)
  ));
}

function readTimestamp(value: string): number {
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function readGenerationSessionTokens(): { authToken?: string } {
  return {
    authToken: getStoredAppSessionAuthToken(),
  };
}

function isGenerationAuthenticated(options?: Pick<CreateSdkworkGenerationServiceOptions, 'getSessionTokens'>): boolean {
  const authToken = options?.getSessionTokens?.().authToken ?? getStoredAppSessionAuthToken();
  return Boolean(normalizeText(authToken));
}

function normalizeText(value: string | undefined): string {
  return (value ?? '').trim();
}

function isMissingGenerationModule(error: unknown): boolean {
  return error instanceof Error && (
    error.message.includes('Cannot find module')
    || error.message.includes('Cannot find package')
  );
}

function groupModelCatalogItems(items: unknown[]): PlaygroundModelGroup[] {
  const groupsByVendor = new Map<string, PlaygroundModelGroup>();

  for (const value of items) {
    const option = normalizeModelOption(value);
    const vendorCode = option.vendorCode;
    const group = groupsByVendor.get(vendorCode) ?? createModelGroup(option);
    groupsByVendor.set(vendorCode, group);

    for (const bucket of modelBucketsForOption(option)) {
      group[bucket].push(option);
    }
  }

  const groups = [...groupsByVendor.values()].filter(hasAnyModels);
  for (const group of groups) {
    for (const bucket of MODEL_BUCKETS) {
      group[bucket].sort(compareModelOptions);
    }
  }
  groups.sort((left, right) => (
    left.vendor.name.toLowerCase().localeCompare(right.vendor.name.toLowerCase())
    || left.vendor.code.localeCompare(right.vendor.code)
  ));
  return groups;
}

function createModelGroup(option: PlaygroundModelOption): PlaygroundModelGroup {
  return {
    id: option.vendorCode,
    vendor: {
      code: option.vendorCode,
      name: option.vendorName,
    },
    llms: [],
    images: [],
    videos: [],
    audios: [],
    music: [],
    sfx: [],
  };
}

function normalizeModelOption(value: unknown): PlaygroundModelOption {
  const item = readRequiredRecord(value, 'Playground model option record is required');
  const catalogKey = readRequiredString(item, 'catalogKey', 'Playground model catalog key is required');
  const model = readRequiredString(item, 'model', 'Playground model id is required');
  const displayName = readRequiredString(item, 'displayName', 'Playground model display name is required');
  const vendorCode = readRequiredString(item, 'vendorCode', 'Playground model vendor code is required');
  const vendorName = readCatalogVendorName(item, vendorCode);
  const description = readNullableString(item, 'description') ?? undefined;
  const contextTokens = readOptionalNumber(item, 'contextTokens');
  const maxOutputTokens = readOptionalNumber(item, 'maxOutputTokens');
  const apiFormat = readNullableString(item, 'apiFormat') ?? undefined;
  const versionLabel = deriveVersionLabel(displayName, model, apiFormat, item);

  return {
    id: catalogKey,
    catalogKey,
    model,
    name: displayName,
    displayName,
    desc: description || `${vendorName} ${model}`,
    description,
    ver: versionLabel,
    versionLabel,
    vendorCode,
    vendorName,
    modalities: readStringArray(item, 'modalities'),
    inputModalities: readStringArray(item, 'inputModalities'),
    outputModalities: readStringArray(item, 'outputModalities'),
    capabilities: readStringArray(item, 'capabilities'),
    apiFormat,
    contextTokens,
    maxOutputTokens,
    supportsStreaming: readBoolean(item, 'supportsStreaming', false),
    supportsTools: readBoolean(item, 'supportsTools', false),
    supportsJsonSchema: readBoolean(item, 'supportsJsonSchema', false),
  };
}

function readCatalogVendorName(item: ApiRecord, vendorCode: string): string {
  const explicitName = readNullableString(item, 'vendorName');
  if (explicitName) {
    return explicitName;
  }
  return formatVendorName(readNullableString(item, 'vendor') || vendorCode);
}

function formatVendorName(value: string): string {
  const normalized = value.trim();
  if (!normalized) {
    return 'Unknown vendor';
  }
  const known: Record<string, string> = {
    anthropic: 'Anthropic',
    elevenlabs: 'ElevenLabs',
    kuaishou: 'Kuaishou',
    openai: 'OpenAI',
  };
  return known[normalized.toLowerCase()] ?? normalized
    .split(/[_\-\s]+/u)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

function modelBucketsForOption(option: PlaygroundModelOption): PlaygroundModelBucket[] {
  const capabilities = normalizedTokens(option.capabilities);
  const outputs = normalizedTokens(option.outputModalities);
  const allModalities = normalizedTokens([
    ...option.modalities,
    ...option.inputModalities,
    ...option.outputModalities,
  ]);
  const signal = normalizedTokens([
    ...option.capabilities,
    ...option.outputModalities,
    ...option.modalities,
    option.apiFormat ?? '',
    option.model,
    option.displayName,
  ]);
  const buckets: PlaygroundModelBucket[] = [];

  if (
    hasAnyToken(capabilities, ['chat', 'responses', 'tools', 'json_schema', 'function_calling', 'reasoning'])
    || hasAnyToken(outputs, ['text', 'chat', 'llm'])
    || (outputs.length === 0
      && hasAnyToken(allModalities, ['text', 'chat', 'llm'])
      && !hasAnyToken(allModalities, ['image', 'video', 'audio', 'speech', 'voice', 'music', 'sfx', 'sound_effect', 'sound_effects']))
  ) {
    buckets.push('llms');
  }
  if (hasAnyToken(capabilities, ['image']) || hasAnyToken(outputs, ['image'])) {
    buckets.push('images');
  }
  if (hasAnyToken(capabilities, ['video']) || hasAnyToken(outputs, ['video'])) {
    buckets.push('videos');
  }
  if (hasAnyToken(capabilities, ['music']) || hasAnyToken(outputs, ['music'])) {
    buckets.push('music');
  }
  if (
    hasAnyToken(capabilities, ['sfx', 'sound_effect', 'sound_effects'])
    || hasAnyToken(outputs, ['sfx', 'sound_effect', 'sound_effects'])
    || signal.some((value) => value.includes('text_to_sound'))
  ) {
    buckets.push('sfx');
  } else if (
    hasAnyToken(capabilities, ['audio', 'speech', 'voice', 'tts', 'stt'])
    || hasAnyToken(outputs, ['audio', 'speech', 'voice'])
  ) {
    buckets.push('audios');
  }

  return MODEL_BUCKETS.filter((bucket) => buckets.includes(bucket));
}

function normalizedTokens(values: readonly string[]): string[] {
  const tokens = values
    .flatMap((value) => normalizeModelToken(value))
    .filter((value) => value.length > 0);
  tokens.sort();
  return [...new Set(tokens)];
}

function normalizeModelToken(value: string): string[] {
  const normalized = value.trim().toLowerCase().replace(/[\s-]+/gu, '_');
  switch (normalized) {
    case 'text':
    case 'chat':
    case 'llm':
      return ['text', 'chat', 'llm'];
    case 'speech':
    case 'voice':
    case 'audio':
      return ['audio', 'speech', 'voice'];
    case 'json':
    case 'json_mode':
      return ['json_schema'];
    case 'function_call':
    case 'function_calling':
    case 'tool_calling':
      return ['tools'];
    default:
      return [normalized];
  }
}

function hasAnyToken(values: readonly string[], needles: readonly string[]): boolean {
  return values.some((value) => needles.includes(value));
}

function compareModelOptions(left: PlaygroundModelOption, right: PlaygroundModelOption): number {
  return left.displayName.toLowerCase().localeCompare(right.displayName.toLowerCase())
    || left.catalogKey.localeCompare(right.catalogKey);
}

function deriveVersionLabel(displayName: string, model: string, apiFormat: string | undefined, item: ApiRecord): string {
  const versionMatch = `${displayName} ${model}`.match(/\bv?\d+(?:\.\d+){0,2}\b/iu);
  if (versionMatch) {
    return versionMatch[0].replace(/^v/iu, '').toUpperCase();
  }
  const signal = [
    ...readStringArray(item, 'outputModalities'),
    ...readStringArray(item, 'modalities'),
    ...readStringArray(item, 'capabilities'),
    apiFormat || '',
    model,
    displayName,
  ].join(' ').toLowerCase();
  if (signal.includes('image')) {
    return 'GEN';
  }
  if (signal.includes('video')) {
    return 'VID';
  }
  if (signal.includes('music')) {
    return 'MUS';
  }
  if (signal.includes('sfx') || signal.includes('sound')) {
    return 'SFX';
  }
  if (signal.includes('audio') || signal.includes('voice') || signal.includes('speech')) {
    return 'AUD';
  }
  const tierMatch = `${displayName} ${model}`.match(/\b(?:pro|lite|mini|ultra|max|flash|turbo|preview)\b/iu);
  if (tierMatch) {
    return tierMatch[0].toUpperCase();
  }
  return 'AI';
}

function readOptionalNumber(record: ApiRecord, key: string): number | undefined {
  if (record[key] === null || record[key] === undefined || record[key] === '') {
    return undefined;
  }
  const value = readNumber(record, key, Number.NaN);
  return Number.isFinite(value) ? value : undefined;
}

function readRequiredRecord(value: unknown, message: string): ApiRecord {
  if (!isRecord(value)) {
    throw new Error(message);
  }
  return value;
}

function hasAnyModels(group: PlaygroundModelGroup): boolean {
  return MODEL_BUCKETS.some((bucket) => group[bucket].length > 0);
}
