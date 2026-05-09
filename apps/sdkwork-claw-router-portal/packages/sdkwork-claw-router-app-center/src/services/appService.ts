import type {
  AppCatalogResponse as SdkAppCatalogResponse,
  AppCategoriesResponse as SdkAppCategoriesResponse,
  AppDetailResponse as SdkAppDetailResponse,
} from '@sdkwork/clawrouter-app-sdk';
import {
  ensurePlusApiSuccess,
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
  filterAppsForCatalog,
  normalizeAppApiRecord,
  type App,
  type AppSortKey,
  type PlatformType,
} from '../appRuntime.ts';

const MAX_APP_CATALOG_PAGE_SIZE = 100;
const MAX_APP_CATALOG_QUERY_TEXT_LENGTH = 128;
const MAX_APP_CATALOG_TIMESTAMP_LENGTH = 64;
type AppCatalogStatus = 'ACTIVE' | 'INACTIVE';
type AppCatalogQueryArguments = [
  pageNo?: number,
  pageSize?: number,
  keyword?: string,
  status?: AppCatalogStatus,
  startTime?: string,
  endTime?: string,
];
type AppCatalogQueryParams = {
  pageNo?: number;
  pageSize?: number;
  keyword?: string;
  status?: AppCatalogStatus;
  startTime?: string;
  endTime?: string;
};

export interface AppFilters {
  search?: string;
  platformTypes?: PlatformType[];
  categories?: string[];
  sortBy?: AppSortKey;
}

type AppCatalogQueryFilterInput = AppFilters & {
  keyword?: unknown;
  pageNo?: unknown;
  pageSize?: unknown;
  status?: unknown;
  startTime?: unknown;
  endTime?: unknown;
};

export const appService = {
  async getApps(filters?: AppFilters): Promise<App[]> {
    const result = await getClawRouterAppSdkClient().app.getApps(...appCatalogQueryArguments(filters));
    ensurePlusApiSuccess(result, 'Failed to fetch apps');
    const items: SdkAppCatalogResponse['items'] = readRequiredApiItems(
      result,
      'Failed to fetch apps',
    ) as SdkAppCatalogResponse['items'];
    return filterAppsForCatalog(
      items.map(normalizeAppApiRecord),
      {
        searchQuery: filters?.search ?? '',
        platformTypes: filters?.platformTypes ?? [],
        categories: filters?.categories ?? [],
        sortBy: filters?.sortBy ?? 'Most Popular',
      },
    );
  },

  async getAppById(id: string): Promise<App | undefined> {
    const result = await getClawRouterAppSdkClient().app.getAppById(requiredSafePathSegment(id, 'appId'));
    if (result === null || result === undefined) {
      return undefined;
    }
    ensurePlusApiSuccess(result, 'Failed to fetch app details');
    if (readApiData(result) === null || readApiData(result) === undefined) {
      return undefined;
    }
    const item: SdkAppDetailResponse = readRequiredApiItem(result, 'App detail response is missing data') as unknown as SdkAppDetailResponse;
    return normalizeAppApiRecord(item);
  },

  async getCategories(): Promise<string[]> {
    const result = await getClawRouterAppSdkClient().app.getCategories();
    ensurePlusApiSuccess(result, 'Failed to fetch app categories');
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
  const keyword = optionalText(filters.keyword ?? filters.search, 'search', MAX_APP_CATALOG_QUERY_TEXT_LENGTH);

  return pruneUndefinedQueryParams({
    pageNo: optionalPositiveInteger(filters.pageNo, 'pageNo'),
    pageSize: optionalBoundedPositiveInteger(filters.pageSize, 'pageSize', MAX_APP_CATALOG_PAGE_SIZE),
    keyword,
    status: optionalAppCatalogStatus(filters.status),
    startTime: optionalText(filters.startTime, 'startTime', MAX_APP_CATALOG_TIMESTAMP_LENGTH),
    endTime: optionalText(filters.endTime, 'endTime', MAX_APP_CATALOG_TIMESTAMP_LENGTH),
  }) as AppCatalogQueryParams;
}

function appCatalogQueryArguments(filters: AppCatalogQueryFilterInput | undefined = {}): AppCatalogQueryArguments {
  const params = toAppCatalogQueryParams(filters);
  return [
    params.pageNo,
    params.pageSize,
    params.keyword,
    params.status,
    params.startTime,
    params.endTime,
  ];
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
