import type {
  AppCatalogResponse as SdkAppCatalogResponse,
  AppCategoriesResponse as SdkAppCategoriesResponse,
  AppDetailResponse as SdkAppDetailResponse,
} from '@sdkwork/clawrouter-app-sdk';
import {
  ensureSdkworkApiSuccess,
  getClawRouterAppSdkClient,
  isRecord,
  optionalBoundedPositiveInteger,
  optionalPositiveInteger,
  optionalText,
  pruneUndefinedQueryParams,
  readApiData,
  readRequiredApiItem,
  readRequiredApiItems,
  readString,
  requiredSafePathSegment,
} from 'sdkwork-claw-router-commons/runtime';
import {
  normalizeAppApiRecord,
  type App,
  type AppSortKey,
  type PlatformType,
} from '../appRuntime.ts';

const MAX_APP_CATALOG_PAGE_SIZE = 100;
const MAX_APP_CATALOG_QUERY_TEXT_LENGTH = 128;
const MAX_APP_CATALOG_TIMESTAMP_LENGTH = 64;
type AppCatalogStatus = 'ACTIVE' | 'INACTIVE';
type AppCatalogSdkSort = 'popular_desc' | 'rating_desc' | 'newest_desc';
type AppCatalogQueryParams = {
  page?: number;
  pageSize?: number;
  q?: string;
  category?: string;
  platformTypes?: PlatformType[];
  sort?: AppCatalogSdkSort;
  status?: AppCatalogStatus;
  startTime?: string;
  endTime?: string;
};

export interface AppFilters {
  searchQuery?: string;
  platformTypes?: PlatformType[];
  categories?: string[];
  sortBy?: AppSortKey;
  page?: unknown;
  pageSize?: unknown;
}

export interface AppCatalogPage {
  items: App[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}

type AppCatalogQueryFilterInput = AppFilters & {
  searchQuery?: unknown;
  page?: unknown;
  pageSize?: unknown;
  status?: unknown;
  startTime?: unknown;
  endTime?: unknown;
};

export const appService = {
  async getApps(filters?: AppFilters): Promise<AppCatalogPage> {
    const query = toAppCatalogQueryParams(filters);
    const result = await getClawRouterAppSdkClient().platform.apps.store.list(query);
    ensureSdkworkApiSuccess(result, 'Failed to fetch apps');
    const data = readApiData(result);
    if (!isRecord(data)) {
      throw new Error('Failed to fetch apps');
    }
    const items: SdkAppCatalogResponse['items'] = readRequiredApiItems(
      result,
      'Failed to fetch apps',
    ) as SdkAppCatalogResponse['items'];
    const fallbackPage = query.page ?? 1;
    const fallbackPageSize = query.pageSize ?? MAX_APP_CATALOG_PAGE_SIZE;
    return {
      items: items.map(normalizeAppApiRecord),
      total: readOptionalNonNegativeInteger(data, 'total', items.length),
      page: readOptionalNonNegativeInteger(data, 'page', fallbackPage) || fallbackPage,
      pageSize: readOptionalNonNegativeInteger(data, 'pageSize', fallbackPageSize) || fallbackPageSize,
      hasNextPage: readOptionalBoolean(data, 'hasNextPage', items.length >= fallbackPageSize),
    };
  },

  async getAppById(id: string): Promise<App | undefined> {
    const result = await getClawRouterAppSdkClient().platform.apps.store.retrieve(requiredSafePathSegment(id, 'appId'));
    if (result === null || result === undefined) {
      return undefined;
    }
    ensureSdkworkApiSuccess(result, 'Failed to fetch app details');
    if (readApiData(result) === null || readApiData(result) === undefined) {
      return undefined;
    }
    const item: SdkAppDetailResponse = readRequiredApiItem(result, 'App detail response is missing data') as unknown as SdkAppDetailResponse;
    return normalizeAppApiRecord(item);
  },

  async getCategories(): Promise<string[]> {
    const result = await getClawRouterAppSdkClient().platform.apps.store.categories.list();
    ensureSdkworkApiSuccess(result, 'Failed to fetch app categories');
    const items: SdkAppCategoriesResponse['items'] = readRequiredApiItems(
      result,
      'Failed to fetch app categories',
    ) as SdkAppCategoriesResponse['items'];
    return items
      .map((item) => {
        if (typeof item === 'string') {
          return item;
        }
        return isRecord(item) ? readString(item, 'name') || readString(item, 'category') : '';
      })
      .filter((item): item is string => item.length > 0)
      .sort();
  },
};

function toAppCatalogQueryParams(filters: AppCatalogQueryFilterInput | undefined = {}): AppCatalogQueryParams {
  const searchQuery = optionalText(filters.searchQuery, 'searchQuery', MAX_APP_CATALOG_QUERY_TEXT_LENGTH);

  return pruneUndefinedQueryParams({
    page: optionalPositiveInteger(filters.page, 'page'),
    pageSize: optionalBoundedPositiveInteger(filters.pageSize, 'pageSize', MAX_APP_CATALOG_PAGE_SIZE),
    q: searchQuery,
    category: optionalSingleCategory(filters.categories),
    platformTypes: optionalPlatformTypes(filters.platformTypes),
    sort: optionalAppCatalogSort(filters.sortBy),
    status: optionalAppCatalogStatus(filters.status),
    startTime: optionalText(filters.startTime, 'startTime', MAX_APP_CATALOG_TIMESTAMP_LENGTH),
    endTime: optionalText(filters.endTime, 'endTime', MAX_APP_CATALOG_TIMESTAMP_LENGTH),
  }) as AppCatalogQueryParams;
}

function optionalSingleCategory(value: unknown): string | undefined {
  if (!Array.isArray(value) || value.length === 0) {
    return undefined;
  }
  const category = optionalText(value[0], 'category', MAX_APP_CATALOG_QUERY_TEXT_LENGTH);
  if (category === 'All') {
    return undefined;
  }
  return category;
}

function optionalPlatformTypes(value: unknown): PlatformType[] | undefined {
  if (!Array.isArray(value) || value.length === 0) {
    return undefined;
  }
  const platformTypes: PlatformType[] = [];
  for (const item of value) {
    const platformType = optionalText(item, 'platformType', 32);
    if (!platformType) {
      continue;
    }
    if (platformType === 'Desktop' || platformType === 'Mobile' || platformType === 'Web' || platformType === 'Mini Program') {
      if (!platformTypes.includes(platformType)) {
        platformTypes.push(platformType);
      }
      continue;
    }
    throw new Error('platformType must be Desktop, Mobile, Web, or Mini Program');
  }
  return platformTypes.length > 0 ? platformTypes : undefined;
}

function optionalAppCatalogSort(value: unknown): AppCatalogSdkSort | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (value === 'Highest Rated') {
    return 'rating_desc';
  }
  if (value === 'Newest') {
    return 'newest_desc';
  }
  if (value === 'Most Popular') {
    return 'popular_desc';
  }
  throw new Error('sortBy must be Most Popular, Highest Rated, or Newest');
}

function optionalAppCatalogStatus(value: unknown): AppCatalogStatus | undefined {
  const status = optionalText(value, 'status', 32);
  if (!status) {
    return undefined;
  }
  if (status === 'ACTIVE' || status === 'INACTIVE') {
    return status;
  }
  throw new Error('status must be ACTIVE or INACTIVE');
}

function readOptionalNonNegativeInteger(record: Record<string, unknown>, key: string, fallback: number): number {
  const value = record[key];
  if (value === undefined || value === null) {
    return fallback;
  }
  const numericValue = typeof value === 'string' ? Number(value.trim()) : value;
  if (typeof numericValue !== 'number' || !Number.isSafeInteger(numericValue) || numericValue < 0) {
    throw new Error(`${key} must be a non-negative integer`);
  }
  return numericValue;
}

function readOptionalBoolean(record: Record<string, unknown>, key: string, fallback: boolean): boolean {
  const value = record[key];
  if (value === undefined || value === null) {
    return fallback;
  }
  if (typeof value !== 'boolean') {
    throw new Error(`${key} must be a boolean`);
  }
  return value;
}
