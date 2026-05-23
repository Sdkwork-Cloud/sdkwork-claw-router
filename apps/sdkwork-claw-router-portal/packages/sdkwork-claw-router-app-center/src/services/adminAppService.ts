import {
  createRequestParams,
  ensureSdkworkApiSuccess,
  getClawRouterBackendSdkClient,
  isRecord,
  readApiRecord,
  readBoolean,
  readNullableString,
  readNumber,
  readRequiredApiItem,
  readRequiredApiItems,
  readRequiredString,
  readString,
  requiredSafePathSegment,
  type ApiRecord,
} from 'sdkwork-claw-router-commons/runtime';
import type {
  AdminAppCategoryCreateRequest,
  AdminAppCategoryUpdateRequest,
  AdminAppConfig,
  AdminAppCreateRequest,
  AdminAppItemResponse,
  AdminAppUpdateRequest,
} from '@sdkwork/clawrouter-backend-sdk';

export type AdminAppStatus = AdminAppItemResponse['status'];
export type AdminAppMarketStatus = AdminAppItemResponse['marketStatus'];

export interface AdminAppCategory {
  id: string;
  name: string;
  description: string;
  code: string;
  icon: string;
  sortWeight: number;
  parentId: string | null;
  path: string;
  visible: boolean;
  status: number;
  type: 999999;
}

export interface AdminAppCategoryCreateInput extends AdminAppCategoryCreateRequest {
  name: string;
  description?: string;
  code?: string;
  icon?: string;
  sortWeight?: number;
  parentId?: string | null;
  path?: string;
  visible?: boolean;
  status?: number;
}

export interface AdminAppCategoryUpdateInput extends AdminAppCategoryUpdateRequest {
  name?: string;
  description?: string | null;
  code?: string | null;
  icon?: string | null;
  sortWeight?: number;
  parentId?: string | null;
  path?: string | null;
  visible?: boolean;
  status?: number;
}

export interface AdminApp {
  id: string;
  uuid: string;
  userId: string | null;
  name: string;
  description: string | null;
  version: string | null;
  icon: Record<string, unknown>;
  iconUrl: string | null;
  resourceList: Record<string, unknown>;
  projectId: string | null;
  accessUrl: string | null;
  config: AdminAppConfig;
  appKey: string | null;
  status: AdminAppStatus;
  marketStatus: AdminAppMarketStatus;
  appType: string | null;
  platforms: Record<string, unknown>;
  installPlatforms: Record<string, unknown>;
  installSkill: Record<string, unknown>;
  installConfig: Record<string, unknown>;
  releaseNotes: Record<string, unknown>[];
  packageName: string | null;
  bundleId: string | null;
  storeUrl: string | null;
  downloadUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminAppCreateInput {
  userId?: string | null;
  name: string;
  description?: string | null;
  version?: string | null;
  icon?: Record<string, unknown>;
  iconUrl?: string | null;
  resourceList?: Record<string, unknown>;
  projectId?: string | null;
  accessUrl?: string | null;
  config?: Record<string, unknown>;
  status?: AdminAppCreateRequest['status'];
  marketStatus?: AdminAppCreateRequest['marketStatus'];
  appType?: string | null;
  platforms?: Record<string, unknown>;
  installPlatforms?: Record<string, unknown>;
  installSkill?: Record<string, unknown>;
  installConfig?: Record<string, unknown>;
  releaseNotes?: Record<string, unknown>[];
  packageName?: string | null;
  bundleId?: string | null;
  storeUrl?: string | null;
  downloadUrl?: string | null;
}

export interface AdminAppUpdateInput {
  userId?: string | null;
  name?: string;
  description?: string | null;
  version?: string | null;
  icon?: Record<string, unknown>;
  iconUrl?: string | null;
  resourceList?: Record<string, unknown>;
  projectId?: string | null;
  accessUrl?: string | null;
  config?: Record<string, unknown>;
  appType?: string | null;
  platforms?: Record<string, unknown>;
  installPlatforms?: Record<string, unknown>;
  installSkill?: Record<string, unknown>;
  installConfig?: Record<string, unknown>;
  releaseNotes?: Record<string, unknown>[];
  packageName?: string | null;
  bundleId?: string | null;
  storeUrl?: string | null;
  downloadUrl?: string | null;
}

export interface AdminAppListInput {
  searchQuery?: unknown;
  status?: AdminAppStatus;
  marketStatus?: AdminAppMarketStatus;
  appType?: unknown;
  page?: unknown;
  pageSize?: unknown;
}

interface AdminAppListSdkParams {
  q?: string;
  status?: AdminAppStatus;
  marketStatus?: AdminAppMarketStatus;
  appType?: string;
  page?: number;
  pageSize?: number;
}

export class AdminAppService {
  static async fetchAppCategories(): Promise<AdminAppCategory[]> {
    const result = await getClawRouterBackendSdkClient().platform.apps.categories.list();
    ensureSdkworkApiSuccess(result, 'Failed to fetch app categories');
    return readRequiredApiItems(result, 'Failed to fetch app categories')
      .map(normalizeAppCategory);
  }

  static async createAppCategory(input: AdminAppCategoryCreateInput): Promise<AdminAppCategory> {
    const result = await getClawRouterBackendSdkClient().platform.apps.categories.create(
      normalizeCreateCategoryRequest(input),
      createRequestParams('admin-app-category-create'),
    );
    ensureSdkworkApiSuccess(result, 'Failed to create app category');
    return normalizeAppCategory(readRequiredApiItem(result, 'Created app category response is missing data'));
  }

  static async updateAppCategory(categoryId: string, input: AdminAppCategoryUpdateInput): Promise<AdminAppCategory> {
    const result = await getClawRouterBackendSdkClient().platform.apps.categories.update(
      requiredSafePathSegment(categoryId, 'categoryId'),
      normalizeUpdateCategoryRequest(input),
      createRequestParams('admin-app-category-update'),
    );
    ensureSdkworkApiSuccess(result, 'Failed to update app category');
    return normalizeAppCategory(readRequiredApiItem(result, 'Updated app category response is missing data'));
  }

  static async deleteAppCategory(categoryId: string): Promise<boolean> {
    const result = await getClawRouterBackendSdkClient().platform.apps.categories.delete(
      requiredSafePathSegment(categoryId, 'categoryId'),
      createRequestParams('admin-app-category-delete'),
    );
    ensureDeleteResult(result, 'App category delete confirmation is required');
    return true;
  }

  static async fetchApps(query: AdminAppListInput = {}): Promise<AdminApp[]> {
    const result = await getClawRouterBackendSdkClient().platform.apps.list(
      {
        ...normalizeListRequest(query),
        ...createRequestParams('admin-app-list'),
      },
    );
    ensureSdkworkApiSuccess(result, 'Failed to fetch apps');
    return readRequiredApiItems(result, 'Failed to fetch apps')
      .map(normalizeAdminApp);
  }

  static async fetchApp(appId: string): Promise<AdminApp> {
    const result = await getClawRouterBackendSdkClient().platform.apps.retrieve(
      requiredSafePathSegment(appId, 'appId'),
      createRequestParams('admin-app-fetch'),
    );
    ensureSdkworkApiSuccess(result, 'Failed to fetch app');
    return normalizeAdminApp(readRequiredApiItem(result, 'App response is missing data'));
  }

  static async createApp(input: AdminAppCreateInput): Promise<AdminApp> {
    const result = await getClawRouterBackendSdkClient().platform.apps.create(
      normalizeCreateRequest(input),
      createRequestParams('admin-app-create'),
    );
    ensureSdkworkApiSuccess(result, 'Failed to create app');
    return normalizeAdminApp(readRequiredApiItem(result, 'Created app response is missing data'));
  }

  static async updateApp(appId: string, input: AdminAppUpdateInput): Promise<AdminApp> {
    const result = await getClawRouterBackendSdkClient().platform.apps.update(
      requiredSafePathSegment(appId, 'appId'),
      normalizeUpdateRequest(input),
      createRequestParams('admin-app-update'),
    );
    ensureSdkworkApiSuccess(result, 'Failed to update app');
    return normalizeAdminApp(readRequiredApiItem(result, 'Updated app response is missing data'));
  }

  static async deleteApp(appId: string): Promise<boolean> {
    const result = await getClawRouterBackendSdkClient().platform.apps.delete(
      requiredSafePathSegment(appId, 'appId'),
      createRequestParams('admin-app-delete'),
    );
    ensureDeleteResult(result, 'App delete confirmation is required');
    return true;
  }

  static async enableApp(appId: string): Promise<AdminApp> {
    const result = await getClawRouterBackendSdkClient().platform.apps.enable(
      requiredSafePathSegment(appId, 'appId'),
      createRequestParams('admin-app-enable'),
    );
    ensureSdkworkApiSuccess(result, 'Failed to enable app');
    return ensureAppStatus(
      normalizeAdminApp(readRequiredApiItem(result, 'Enabled app response is missing data')),
      'ACTIVE',
      'Enabled app response must have ACTIVE status',
    );
  }

  static async disableApp(appId: string): Promise<AdminApp> {
    const result = await getClawRouterBackendSdkClient().platform.apps.disable(
      requiredSafePathSegment(appId, 'appId'),
      createRequestParams('admin-app-disable'),
    );
    ensureSdkworkApiSuccess(result, 'Failed to disable app');
    return ensureAppStatus(
      normalizeAdminApp(readRequiredApiItem(result, 'Disabled app response is missing data')),
      'INACTIVE',
      'Disabled app response must have INACTIVE status',
    );
  }

  static async publishApp(appId: string): Promise<AdminApp> {
    const result = await getClawRouterBackendSdkClient().platform.apps.publish(
      requiredSafePathSegment(appId, 'appId'),
      createRequestParams('admin-app-publish'),
    );
    ensureSdkworkApiSuccess(result, 'Failed to publish app');
    return ensureAppMarketStatus(
      normalizeAdminApp(readRequiredApiItem(result, 'Published app response is missing data')),
      'PUBLISHED',
      'Published app response must have PUBLISHED market status',
    );
  }

  static async offlineApp(appId: string): Promise<AdminApp> {
    const result = await getClawRouterBackendSdkClient().platform.apps.unpublish(
      requiredSafePathSegment(appId, 'appId'),
      createRequestParams('admin-app-offline'),
    );
    ensureSdkworkApiSuccess(result, 'Failed to offline app');
    return ensureAppMarketStatus(
      normalizeAdminApp(readRequiredApiItem(result, 'Offline app response is missing data')),
      'OFFLINE',
      'Offline app response must have OFFLINE market status',
    );
  }
}

export function createAdminAppInputFromForm(form: FormData): AdminAppCreateInput {
  const input: AdminAppCreateInput = {
    name: requiredFormText(form, 'name', 255),
    status: readStatus(optionalFormText(form, 'status', 32) ?? 'ACTIVE'),
    marketStatus: readMarketStatus(optionalFormText(form, 'marketStatus', 32) ?? 'DRAFT'),
  };
  mergeSharedFormFields(input, form, 'create');
  return input;
}

export function updateAdminAppInputFromForm(form: FormData): AdminAppUpdateInput {
  const input: AdminAppUpdateInput = {};
  const name = optionalFormText(form, 'name', 255);
  if (name) {
    input.name = name;
  }
  mergeSharedFormFields(input, form, 'update');
  return input;
}

export function createAppCategoryInputFromForm(form: FormData): AdminAppCategoryCreateInput {
  const input: AdminAppCategoryCreateInput = {
    name: requiredFormText(form, 'name', 255),
  };
  mergeSharedCategoryFormFields(input, form, 'create');
  return input;
}

export function updateAppCategoryInputFromForm(form: FormData): AdminAppCategoryUpdateInput {
  const input: AdminAppCategoryUpdateInput = {};
  const name = optionalFormText(form, 'name', 255);
  if (name) {
    input.name = name;
  }
  mergeSharedCategoryFormFields(input, form, 'update');
  return input;
}

function normalizeCreateCategoryRequest(input: AdminAppCategoryCreateInput): AdminAppCategoryCreateRequest {
  return pruneUndefined({
    ...input,
    name: requiredText(input.name, 'name', 255),
    description: optionalText(input.description, 'description', 4000),
    code: optionalCategoryCode(input.code, 'code', 128),
    icon: optionalText(input.icon, 'icon', 255),
    parentId: normalizeNullableId(input.parentId),
    path: optionalPath(input.path, 'path', 1024),
    sortWeight: input.sortWeight === undefined ? undefined : boundedInteger(input.sortWeight, 'sortWeight', -1_000_000, 1_000_000),
    status: input.status === undefined ? undefined : boundedInteger(input.status, 'status', -1_000_000, 1_000_000),
    visible: input.visible,
  });
}

function normalizeUpdateCategoryRequest(input: AdminAppCategoryUpdateInput): AdminAppCategoryUpdateRequest {
  return pruneUndefined({
    ...input,
    name: optionalText(input.name, 'name', 255),
    description: normalizeNullableText(input.description, 'description', 4000),
    code: normalizeNullableCategoryCode(input.code, 'code', 128),
    icon: normalizeNullableText(input.icon, 'icon', 255),
    parentId: normalizeNullableId(input.parentId),
    path: normalizeNullablePath(input.path, 'path', 1024),
    sortWeight: input.sortWeight === undefined ? undefined : boundedInteger(input.sortWeight, 'sortWeight', -1_000_000, 1_000_000),
    status: input.status === undefined ? undefined : boundedInteger(input.status, 'status', -1_000_000, 1_000_000),
    visible: input.visible,
  });
}

function normalizeListRequest(input: AdminAppListInput): AdminAppListSdkParams {
  const request: AdminAppListSdkParams = {};
  const searchQuery = optionalText(input.searchQuery, 'searchQuery', 128);
  if (searchQuery) {
    request.q = searchQuery;
  }
  if (input.status) {
    request.status = readStatus(input.status);
  }
  if (input.marketStatus) {
    request.marketStatus = readMarketStatus(input.marketStatus);
  }
  const appType = optionalCode(input.appType, 'appType', 64);
  if (appType) {
    request.appType = appType;
  }
  if (input.page !== undefined) {
    request.page = positiveInteger(input.page, 'page', 1_000_000);
  }
  if (input.pageSize !== undefined) {
    request.pageSize = positiveInteger(input.pageSize, 'pageSize', 200);
  }
  return request;
}

function normalizeCreateRequest(input: AdminAppCreateInput): AdminAppCreateRequest {
  const name = requiredText(input.name, 'name', 255);
  const config = normalizeAppConfig(input.config);
  return pruneUndefined({
    ...input,
    userId: normalizeNullableId(input.userId),
    name,
    description: optionalText(input.description, 'description', 4000),
    version: optionalText(input.version, 'version', 64),
    icon: normalizeObject(input.icon, 'icon'),
    iconUrl: optionalUrl(input.iconUrl, 'iconUrl', 512),
    resourceList: normalizeObject(input.resourceList, 'resourceList'),
    projectId: normalizeNullableId(input.projectId),
    accessUrl: optionalUrl(input.accessUrl, 'accessUrl', 512),
    config,
    status: readStatus(input.status ?? 'ACTIVE'),
    marketStatus: readMarketStatus(input.marketStatus ?? 'DRAFT'),
    appType: optionalCode(input.appType, 'appType', 64),
    platforms: normalizeObject(input.platforms, 'platforms'),
    installPlatforms: normalizeObject(input.installPlatforms, 'installPlatforms'),
    installSkill: normalizeObject(input.installSkill, 'installSkill'),
    installConfig: normalizeObject(input.installConfig, 'installConfig'),
    releaseNotes: normalizeRecordArray(input.releaseNotes, 'releaseNotes'),
    packageName: optionalText(input.packageName, 'packageName', 255),
    bundleId: optionalText(input.bundleId, 'bundleId', 255),
    storeUrl: optionalUrl(input.storeUrl, 'storeUrl', 512),
    downloadUrl: optionalUrl(input.downloadUrl, 'downloadUrl', 512),
  });
}

function ensureDeleteResult(result: unknown, message: string): void {
  ensureSdkworkApiSuccess(result, message);
  if (readBoolean(readApiRecord(result), 'deleted') !== true) {
    throw new Error(message);
  }
}

function ensureAppStatus(app: AdminApp, status: AdminAppStatus, message: string): AdminApp {
  if (app.status !== status) {
    throw new Error(message);
  }
  return app;
}

function ensureAppMarketStatus(app: AdminApp, marketStatus: AdminAppMarketStatus, message: string): AdminApp {
  if (app.marketStatus !== marketStatus) {
    throw new Error(message);
  }
  return app;
}

function normalizeUpdateRequest(input: AdminAppUpdateInput): AdminAppUpdateRequest {
  const config = input.config === undefined ? undefined : normalizeAppConfig(input.config);
  return pruneUndefined({
    ...input,
    userId: normalizeNullableId(input.userId),
    name: optionalText(input.name, 'name', 255),
    description: normalizeNullableText(input.description, 'description', 4000),
    version: normalizeNullableText(input.version, 'version', 64),
    icon: input.icon === undefined ? undefined : normalizeObject(input.icon, 'icon'),
    iconUrl: normalizeNullableUrl(input.iconUrl, 'iconUrl', 512),
    resourceList: input.resourceList === undefined ? undefined : normalizeObject(input.resourceList, 'resourceList'),
    projectId: normalizeNullableId(input.projectId),
    accessUrl: normalizeNullableUrl(input.accessUrl, 'accessUrl', 512),
    config,
    appType: normalizeNullableCode(input.appType, 'appType', 64),
    platforms: input.platforms === undefined ? undefined : normalizeObject(input.platforms, 'platforms'),
    installPlatforms: input.installPlatforms === undefined ? undefined : normalizeObject(input.installPlatforms, 'installPlatforms'),
    installSkill: input.installSkill === undefined ? undefined : normalizeObject(input.installSkill, 'installSkill'),
    installConfig: input.installConfig === undefined ? undefined : normalizeObject(input.installConfig, 'installConfig'),
    releaseNotes: input.releaseNotes === undefined ? undefined : normalizeRecordArray(input.releaseNotes, 'releaseNotes'),
    packageName: normalizeNullableText(input.packageName, 'packageName', 255),
    bundleId: normalizeNullableText(input.bundleId, 'bundleId', 255),
    storeUrl: normalizeNullableUrl(input.storeUrl, 'storeUrl', 512),
    downloadUrl: normalizeNullableUrl(input.downloadUrl, 'downloadUrl', 512),
  });
}

function normalizeAdminApp(value: unknown): AdminApp {
  const item = readRequiredRecord(value, 'App record is required');
  const config = normalizeAppConfig(readRequiredRecordField(item, 'config', 'App config is required'));
  return {
    id: readRequiredString(item, 'id', 'App id is required'),
    uuid: readRequiredString(item, 'uuid', 'App uuid is required'),
    userId: readNullableString(item, 'userId'),
    name: readRequiredString(item, 'name', 'App name is required'),
    description: readNullableString(item, 'description'),
    version: readNullableString(item, 'version'),
    icon: readRequiredRecordField(item, 'icon', 'App icon is required'),
    iconUrl: readNullableString(item, 'iconUrl'),
    resourceList: readRequiredRecordField(item, 'resourceList', 'App resource list is required'),
    projectId: readNullableString(item, 'projectId'),
    accessUrl: readNullableString(item, 'accessUrl'),
    config,
    appKey: readNullableString(item, 'appKey'),
    status: readStatus(readRequiredString(item, 'status', 'App status is required')),
    marketStatus: readMarketStatus(readRequiredString(item, 'marketStatus', 'App market status is required')),
    appType: readNullableString(item, 'appType'),
    platforms: readRequiredRecordField(item, 'platforms', 'App platforms are required'),
    installPlatforms: readRequiredRecordField(item, 'installPlatforms', 'App install platforms are required'),
    installSkill: readRequiredRecordField(item, 'installSkill', 'App install skill is required'),
    installConfig: readRequiredRecordField(item, 'installConfig', 'App install config is required'),
    releaseNotes: readRequiredRecordArray(item, 'releaseNotes', 'App release notes are required'),
    packageName: readNullableString(item, 'packageName'),
    bundleId: readNullableString(item, 'bundleId'),
    storeUrl: readNullableString(item, 'storeUrl'),
    downloadUrl: readNullableString(item, 'downloadUrl'),
    createdAt: readRequiredString(item, 'createdAt', 'App created time is required'),
    updatedAt: readRequiredString(item, 'updatedAt', 'App updated time is required'),
  };
}

function normalizeAppCategory(value: unknown): AdminAppCategory {
  const item = readRequiredRecord(value, 'App category record is required');
  const type = readRequiredInteger(item, 'type', 'App category type is required');
  if (type !== 999999) {
    throw new Error(`Unsupported app category type: ${type}`);
  }
  return {
    id: readRequiredString(item, 'id', 'App category id is required'),
    name: readRequiredString(item, 'name', 'App category name is required'),
    description: readString(item, 'description'),
    code: readString(item, 'code'),
    icon: readString(item, 'icon'),
    sortWeight: readRequiredInteger(item, 'sortWeight', 'App category sort weight is required'),
    parentId: readNullableString(item, 'parentId'),
    path: readString(item, 'path'),
    visible: readRequiredBoolean(item, 'visible', 'App category visibility is required'),
    status: readRequiredInteger(item, 'status', 'App category status is required'),
    type,
  };
}

function mergeSharedFormFields(input: AdminAppCreateInput | AdminAppUpdateInput, form: FormData, mode: 'create' | 'update'): void {
  for (const [key, maxLength] of [
    ['description', 4000],
    ['version', 64],
    ['iconUrl', 512],
    ['projectId', 128],
    ['accessUrl', 512],
    ['appType', 64],
    ['packageName', 255],
    ['bundleId', 255],
    ['storeUrl', 512],
    ['downloadUrl', 512],
  ] as const) {
    if (mode === 'update' && form.has(key)) {
      input[key] = nullableFormText(form, key, maxLength);
    } else {
      const value = optionalFormText(form, key, maxLength);
      if (value !== undefined) {
        input[key] = value;
      }
    }
  }
  if (mode === 'update' && form.has('userId')) {
    input.userId = nullableFormText(form, 'userId', 128);
  } else {
    const userId = optionalFormText(form, 'userId', 128);
    if (userId !== undefined) {
      input.userId = userId;
    }
  }
  for (const key of ['icon', 'resourceList', 'config', 'platforms', 'installPlatforms', 'installSkill', 'installConfig'] as const) {
    const value = optionalJsonObjectFormField(form, key);
    if (value !== undefined) {
      input[key] = value;
    }
  }
  const releaseNotes = optionalJsonArrayFormField(form, 'releaseNotes');
  if (releaseNotes !== undefined) {
    input.releaseNotes = releaseNotes;
  }
  const appKey = optionalFormText(form, 'appKey', 128);
  if (appKey) {
    input.config = mergeAppKeyIntoConfig(input.config, appKey);
  }
  if (mode === 'create') {
    const createInput = input as AdminAppCreateInput;
    const status = optionalFormText(form, 'status', 32);
    if (status) {
      createInput.status = readStatus(status);
    }
    const marketStatus = optionalFormText(form, 'marketStatus', 32);
    if (marketStatus) {
      createInput.marketStatus = readMarketStatus(marketStatus);
    }
  }
}

function mergeSharedCategoryFormFields(
  input: AdminAppCategoryCreateInput | AdminAppCategoryUpdateInput,
  form: FormData,
  mode: 'create' | 'update',
): void {
  for (const [key, maxLength] of [
    ['code', 128],
    ['description', 4000],
    ['icon', 255],
    ['parentId', 128],
    ['path', 1024],
  ] as const) {
    const value = mode === 'create'
      ? optionalFormText(form, key, maxLength)
      : optionalNullableFormText(form, key, maxLength);
    if (value !== undefined) {
      input[key] = value;
    }
  }
  for (const key of ['sortWeight', 'status'] as const) {
    const value = optionalFormBoundedInteger(form, key, -1_000_000, 1_000_000);
    if (value !== undefined) {
      input[key] = value;
    }
  }
  const visible = optionalFormBoolean(form, 'visible');
  if (visible !== undefined) {
    input.visible = visible;
  }
}

function requiredFormText(form: FormData, key: string, maxLength: number): string {
  return requiredText(formString(form, key), key, maxLength);
}

function optionalFormText(form: FormData, key: string, maxLength: number): string | undefined {
  return optionalText(formString(form, key), key, maxLength);
}

function optionalNullableFormText(form: FormData, key: string, maxLength: number): string | null | undefined {
  if (!form.has(key)) {
    return undefined;
  }
  return optionalText(formString(form, key), key, maxLength) ?? null;
}

function nullableFormText(form: FormData, key: string, maxLength: number): string | null {
  return optionalText(formString(form, key), key, maxLength) ?? null;
}

function optionalFormBoundedInteger(form: FormData, key: string, minValue: number, maxValue: number): number | undefined {
  const value = optionalFormText(form, key, 32);
  if (value === undefined) {
    return undefined;
  }
  if (!/^-?\d+$/.test(value)) {
    throw new Error(`${key} must be an integer`);
  }
  return boundedInteger(Number(value), key, minValue, maxValue);
}

function optionalFormBoolean(form: FormData, key: string): boolean | undefined {
  const value = optionalFormText(form, key, 16);
  if (value === undefined) {
    return undefined;
  }
  const normalized = value.toLowerCase();
  if (['true', '1', 'yes', 'on'].includes(normalized)) {
    return true;
  }
  if (['false', '0', 'no', 'off'].includes(normalized)) {
    return false;
  }
  throw new Error(`${key} must be a boolean`);
}

function optionalJsonObjectFormField(form: FormData, key: string): Record<string, unknown> | undefined {
  const value = optionalFormText(form, key, 65_536);
  if (value === undefined) {
    return undefined;
  }
  return parseJsonObject(value, key);
}

function optionalJsonArrayFormField(form: FormData, key: string): Record<string, unknown>[] | undefined {
  const value = optionalFormText(form, key, 65_536);
  if (value === undefined) {
    return undefined;
  }
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed) || parsed.some((item) => !isRecord(item))) {
      throw new Error(`${key} must be a JSON array of objects`);
    }
    return parsed as Record<string, unknown>[];
  } catch (error) {
    if (error instanceof Error && error.message === `${key} must be a JSON array of objects`) {
      throw error;
    }
    throw new Error(`${key} must be valid JSON`);
  }
}

function formString(form: FormData, key: string): string | undefined {
  const value = form.get(key);
  return typeof value === 'string' ? value : undefined;
}

function requiredText(value: unknown, fieldName: string, maxLength: number): string {
  const normalized = optionalText(value, fieldName, maxLength);
  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }
  return normalized;
}

function optionalText(value: unknown, fieldName: string, maxLength: number): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (typeof value !== 'string') {
    throw new Error(`${fieldName} must be a string`);
  }
  const normalized = value.trim();
  if (!normalized) {
    return undefined;
  }
  if (normalized.length > maxLength) {
    throw new Error(`${fieldName} must be at most ${maxLength} characters`);
  }
  if (/[\x00-\x1f\x7f]/.test(normalized)) {
    throw new Error(`${fieldName} must not contain control characters`);
  }
  return normalized;
}

function optionalCode(value: unknown, fieldName: string, maxLength: number): string | undefined {
  const normalized = optionalText(value, fieldName, maxLength);
  if (normalized && !/^[A-Za-z0-9._:-]+$/.test(normalized)) {
    throw new Error(`${fieldName} contains unsupported characters`);
  }
  return normalized;
}

function optionalCategoryCode(value: unknown, fieldName: string, maxLength: number): string | undefined {
  const normalized = optionalText(value, fieldName, maxLength);
  if (normalized && !/^[A-Za-z0-9_-]+$/.test(normalized)) {
    throw new Error(`${fieldName} must use ASCII letters, numbers, hyphen, or underscore`);
  }
  return normalized;
}

function normalizeNullableText(value: unknown, fieldName: string, maxLength: number): string | null | undefined {
  if (value === null) {
    return null;
  }
  return optionalText(value, fieldName, maxLength);
}

function normalizeNullableCode(value: unknown, fieldName: string, maxLength: number): string | null | undefined {
  if (value === null) {
    return null;
  }
  return optionalCode(value, fieldName, maxLength);
}

function normalizeNullableCategoryCode(value: unknown, fieldName: string, maxLength: number): string | null | undefined {
  if (value === null) {
    return null;
  }
  return optionalCategoryCode(value, fieldName, maxLength);
}

function optionalUrl(value: unknown, fieldName: string, maxLength: number): string | undefined {
  const normalized = optionalText(value, fieldName, maxLength);
  if (normalized) {
    validateUrl(normalized, fieldName);
  }
  return normalized;
}

function normalizeNullableUrl(value: unknown, fieldName: string, maxLength: number): string | null | undefined {
  if (value === null) {
    return null;
  }
  return optionalUrl(value, fieldName, maxLength);
}

function optionalPath(value: unknown, fieldName: string, maxLength: number): string | undefined {
  const normalized = optionalText(value, fieldName, maxLength);
  if (normalized && !normalized.startsWith('/')) {
    throw new Error(`${fieldName} must start with /`);
  }
  return normalized;
}

function normalizeNullablePath(value: unknown, fieldName: string, maxLength: number): string | null | undefined {
  if (value === null) {
    return null;
  }
  return optionalPath(value, fieldName, maxLength);
}

function validateUrl(value: string, fieldName: string): void {
  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('artifact://') || value.startsWith('/')) {
    return;
  }
  throw new Error(`${fieldName} must be an http(s), artifact, or absolute path reference`);
}

function normalizeNullableId(value: unknown): string | null | undefined {
  if (value === null) {
    return null;
  }
  const normalized = optionalText(value, 'id', 128);
  if (normalized === undefined) {
    return undefined;
  }
  if (!/^\d+$/.test(normalized) || Number(normalized) <= 0) {
    throw new Error('id must be a positive integer');
  }
  return normalized;
}

function normalizeObject(value: unknown, fieldName: string): Record<string, unknown> {
  if (value === undefined) {
    return {};
  }
  if (!isRecord(value)) {
    throw new Error(`${fieldName} must be a JSON object`);
  }
  return value;
}

function normalizeAppConfig(value: unknown): AdminAppConfig {
  const config = normalizeObject(value, 'config');
  const standard = config.standard;
  if (!isRecord(standard)) {
    throw new Error('config.standard.appKey is required');
  }
  const appKey = optionalText(standard.appKey, 'appKey', 128);
  if (!appKey) {
    throw new Error('config.standard.appKey is required');
  }
  if (!isStandardAppKey(appKey)) {
    throw new Error('appKey must use lowercase kebab-case');
  }
  return {
    ...config,
    standard: {
      ...standard,
      appKey,
    },
  } as AdminAppConfig;
}

function mergeAppKeyIntoConfig(value: unknown, appKey: string): Record<string, unknown> {
  const config = normalizeObject(value, 'config');
  const standard = config.standard;
  if (standard !== undefined && !isRecord(standard)) {
    throw new Error('config.standard must be a JSON object');
  }
  return {
    ...config,
    standard: {
      ...(isRecord(standard) ? standard : {}),
      appKey,
    },
  };
}

function isStandardAppKey(value: string): boolean {
  return /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(value);
}

function normalizeRecordArray(value: unknown, fieldName: string): Record<string, unknown>[] {
  if (value === undefined) {
    return [];
  }
  if (!Array.isArray(value) || value.some((item) => !isRecord(item))) {
    throw new Error(`${fieldName} must be a JSON array of objects`);
  }
  return value as Record<string, unknown>[];
}

function positiveInteger(value: unknown, fieldName: string, maxValue: number): number {
  const numberValue = typeof value === 'string' ? Number(value.trim()) : value;
  if (typeof numberValue !== 'number' || !Number.isSafeInteger(numberValue) || numberValue < 1 || numberValue > maxValue) {
    throw new Error(`${fieldName} must be between 1 and ${maxValue}`);
  }
  return numberValue;
}

function boundedInteger(value: unknown, fieldName: string, minValue: number, maxValue: number): number {
  const numberValue = typeof value === 'string' ? Number(value.trim()) : value;
  if (typeof numberValue !== 'number' || !Number.isSafeInteger(numberValue) || numberValue < minValue || numberValue > maxValue) {
    throw new Error(`${fieldName} must be between ${minValue} and ${maxValue}`);
  }
  return numberValue;
}

function readStatus(value: string): AdminAppStatus {
  const normalized = value.trim();
  if (normalized === 'ACTIVE' || normalized === 'INACTIVE') {
    return normalized;
  }
  throw new Error(`Unsupported app status: ${value}`);
}

function readMarketStatus(value: string): AdminAppMarketStatus {
  const normalized = value.trim();
  if (normalized === 'DRAFT' || normalized === 'PUBLISHED' || normalized === 'OFFLINE') {
    return normalized;
  }
  throw new Error(`Unsupported app market status: ${value}`);
}

function readRequiredRecordField(record: ApiRecord, key: string, message: string): Record<string, unknown> {
  const value = record[key];
  if (!isRecord(value)) {
    throw new Error(message);
  }
  return value;
}

function readRequiredRecordArray(record: ApiRecord, key: string, message: string): Record<string, unknown>[] {
  const value = record[key];
  if (!Array.isArray(value) || value.some((item) => !isRecord(item))) {
    throw new Error(message);
  }
  return value;
}

function readRequiredRecord(value: unknown, message: string): ApiRecord {
  if (!isRecord(value)) {
    throw new Error(message);
  }
  return value;
}

function readRequiredBoolean(record: ApiRecord, key: string, message: string): boolean {
  const value = record[key];
  if (typeof value !== 'boolean') {
    throw new Error(message);
  }
  return value;
}

function readRequiredInteger(record: ApiRecord, key: string, message: string): number {
  const numberValue = readNumber(record, key, Number.NaN);
  if (!Number.isSafeInteger(numberValue)) {
    throw new Error(message);
  }
  return numberValue;
}

function parseJsonObject(value: string, fieldName: string): Record<string, unknown> {
  try {
    const parsed: unknown = JSON.parse(value);
    if (!isRecord(parsed)) {
      throw new Error(`${fieldName} must be a JSON object`);
    }
    return parsed;
  } catch (error) {
    if (error instanceof Error && error.message === `${fieldName} must be a JSON object`) {
      throw error;
    }
    throw new Error(`${fieldName} must be valid JSON`);
  }
}

function pruneUndefined<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined)) as T;
}
