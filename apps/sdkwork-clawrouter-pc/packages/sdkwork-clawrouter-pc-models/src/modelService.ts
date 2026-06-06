import {
  ensureSdkworkApiSuccess,
  getClawRouterAppSdkClient,
  readApiRecord,
  readNumber,
  readRecordArray,
  readRequiredApiItems,
  readString,
} from 'sdkwork-clawrouter-pc-commons/runtime';
import type { Model, ModelCategoryKey, ModelGroupKey } from './data/models';
import {
  findModelByCatalogRouteId,
  mergeRuntimeModelCatalog,
  resolveRuntimeModelCatalog,
  type RuntimeModelCatalogItem,
} from './runtimeModelCatalog.ts';

export type { RuntimeModelCatalogItem };
export { findModelByCatalogRouteId, mergeRuntimeModelCatalog, resolveRuntimeModelCatalog };

export interface ModelCatalogServiceFilters {
  billingMeter?: string;
  vendorCodes?: string[];
  modalities?: string[];
  capabilities?: string[];
  categories?: ModelCategoryKey[] | string[];
  groups?: ModelGroupKey[] | string[];
  searchQuery?: string;
  limit?: number;
}

export interface ModelCatalogGroup {
  key: ModelGroupKey;
  label: string;
  modelCount: number;
}

export interface ModelCatalogResult {
  models: Model[];
  groups: ModelCatalogGroup[];
}

export class ModelService {
  static async fetchModels(filters: ModelCatalogServiceFilters = {}): Promise<Model[]> {
    return (await fetchModelCatalogResult(filters)).models;
  }

  static fetchModelCatalog(filters: ModelCatalogServiceFilters = {}): Promise<ModelCatalogResult> {
    return fetchModelCatalogResult(filters);
  }
}

async function fetchModelCatalogResult(filters: ModelCatalogServiceFilters): Promise<ModelCatalogResult> {
  const result = await getClawRouterAppSdkClient().ai.models.list({
    billingMeter: normalizeQueryString(filters.billingMeter),
    vendorCodes: normalizeQueryValues(filters.vendorCodes),
    modalities: normalizeQueryValues(filters.modalities),
    capabilities: normalizeQueryValues(filters.capabilities),
    categories: normalizeQueryValues(filters.categories),
    groups: normalizeQueryValues(filters.groups),
    q: normalizeQueryString(filters.searchQuery),
    limit: filters.limit === undefined ? undefined : String(filters.limit),
  });
  ensureSdkworkApiSuccess(result, 'Failed to fetch models');
  const data = readApiRecord(result);
  return {
    models: resolveRuntimeModelCatalog(readRequiredApiItems(result, 'Failed to fetch models')),
    groups: resolveRuntimeModelCatalogGroups(readRecordArray(data, 'groups')),
  };
}

function resolveRuntimeModelCatalogGroups(records: readonly Record<string, unknown>[]): ModelCatalogGroup[] {
  const groups = new Map<string, ModelCatalogGroup>();
  for (const record of records) {
    const key = readString(record, 'key').trim();
    if (key.length === 0 || groups.has(key)) {
      continue;
    }
    const label = readString(record, 'label').trim() || key;
    const modelCount = Math.max(0, Math.trunc(readNumber(record, 'modelCount', 0)));
    groups.set(key, { key, label, modelCount });
  }
  return Array.from(groups.values());
}

function normalizeQueryValues(values: readonly string[] | undefined): string[] | undefined {
  const normalized = values
    ?.map((value) => value.trim())
    .filter(Boolean);
  return normalized && normalized.length > 0 ? [...normalized] : undefined;
}

function normalizeQueryString(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized && normalized.length > 0 ? normalized : undefined;
}
