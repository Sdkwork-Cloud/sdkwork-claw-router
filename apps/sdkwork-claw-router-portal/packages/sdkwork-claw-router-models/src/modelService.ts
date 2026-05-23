import { ensureSdkworkApiSuccess, getClawRouterAppSdkClient, readRequiredApiItems } from 'sdkwork-claw-router-commons/runtime';
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

export class ModelService {
  static async fetchModels(filters: ModelCatalogServiceFilters = {}): Promise<Model[]> {
    const result = await getClawRouterAppSdkClient().ai.models.list({
      billingMeter: normalizeQueryString(filters.billingMeter),
      vendorCodes: normalizeQueryValues(filters.vendorCodes),
      modalities: normalizeQueryValues(filters.modalities),
      capabilities: normalizeQueryValues(filters.capabilities),
      categories: normalizeQueryValues(filters.categories),
      groups: normalizeQueryValues(filters.groups),
      q: normalizeQueryString(filters.searchQuery),
      limit: filters.limit,
    });
    ensureSdkworkApiSuccess(result, 'Failed to fetch models');
    return resolveRuntimeModelCatalog(readRequiredApiItems(result, 'Failed to fetch models'));
  }
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
