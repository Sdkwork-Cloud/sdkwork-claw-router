import { ensurePlusApiSuccess, getClawRouterAppSdkClient, readRequiredApiItems } from 'sdkwork-claw-router-commons/runtime';
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
    const result = await getClawRouterAppSdkClient().router.fetchModels(
      normalizeQueryString(filters.billingMeter),
      undefined,
      joinQueryValues(filters.vendorCodes),
      joinQueryValues(filters.modalities),
      joinQueryValues(filters.capabilities),
      joinQueryValues(filters.categories),
      joinQueryValues(filters.groups),
      normalizeQueryString(filters.searchQuery),
      filters.limit,
    );
    ensurePlusApiSuccess(result, 'Failed to fetch models');
    return resolveRuntimeModelCatalog(readRequiredApiItems(result, 'Failed to fetch models'));
  }
}

function joinQueryValues(values: readonly string[] | undefined): string | undefined {
  const normalized = values
    ?.map((value) => value.trim())
    .filter(Boolean);
  return normalized && normalized.length > 0 ? normalized.join(',') : undefined;
}

function normalizeQueryString(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized && normalized.length > 0 ? normalized : undefined;
}
