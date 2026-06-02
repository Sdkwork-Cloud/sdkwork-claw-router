import {
  ensureSdkworkApiSuccess,
  getClawRouterBackendSdkClient,
  isRecord,
  readApiData,
  readApiRecord,
  readBoolean,
  readNullableString,
  readNumber,
  readRequiredApiItem,
  readRequiredApiItems,
  readRequiredString,
  readString,
  readMediaResource,
  readRequiredMediaResource,
  requiredSafePathSegment,
  toExternalUrlMediaResource,
  type ApiRecord,
  type ClawRouterMediaResource,
} from 'sdkwork-claw-router-commons/runtime';
import type {
  AdminAppCategoryCreateRequest,
  AdminAppCategoryUpdateRequest,
  AdminAppConfig,
  AdminAppCreateRequest,
  AdminAppItemResponse,
  AdminAppTemplateCreateRequest,
  AdminAppTemplateItemResponse,
  AdminAppTemplateUpdateRequest,
  AdminAppUpdateRequest,
} from '@sdkwork/clawrouter-backend-sdk';

export type AdminAppStatus = AdminAppItemResponse['status'];
export type AdminAppMarketStatus = AdminAppItemResponse['marketStatus'];
export type AdminAppTemplateVisibility = AdminAppTemplateItemResponse['visibility'];
export type AdminAppTemplatePublishStatus = AdminAppTemplateItemResponse['publishStatus'];

export interface AdminAppCategory {
  id: string;
  name: string;
  description: string;
  code: string;
  icon?: ClawRouterMediaResource;
  sortWeight: number;
  parentId: string | null;
  path: string;
  visible: boolean;
  status: number;
  type: 999999;
}

export interface AdminAppCategoryCreateInput {
  name: string;
  description?: string;
  code?: string;
  icon?: ClawRouterMediaResource;
  sortWeight?: number;
  parentId?: string | null;
  path?: string;
  visible?: boolean;
  status?: number;
}

export interface AdminAppCategoryUpdateInput {
  name?: string;
  description?: string | null;
  code?: string | null;
  icon?: ClawRouterMediaResource;
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
  icon: ClawRouterMediaResource;
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
  artifact?: ClawRouterMediaResource | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminAppCreateInput {
  userId?: string | null;
  name: string;
  description?: string | null;
  version?: string | null;
  icon?: ClawRouterMediaResource;
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
  artifact?: ClawRouterMediaResource | null;
}

export interface AdminAppUpdateInput {
  userId?: string | null;
  name?: string;
  description?: string | null;
  version?: string | null;
  icon?: ClawRouterMediaResource;
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
  artifact?: ClawRouterMediaResource | null;
}

export interface AdminAppListInput {
  searchQuery?: unknown;
  status?: AdminAppStatus;
  marketStatus?: AdminAppMarketStatus;
  appType?: unknown;
  categoryId?: unknown;
  page?: unknown;
  pageSize?: unknown;
}

interface AdminAppListSdkParams {
  q?: string;
  status?: AdminAppStatus;
  marketStatus?: AdminAppMarketStatus;
  appType?: string;
  categoryId?: number;
  page?: number;
  pageSize?: number;
}

export interface AdminAppPage {
  items: AdminApp[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}

export interface AdminAppTemplate {
  id: string;
  uuid: string;
  templateNo: string;
  templateCode: string;
  templateName: string;
  description: string | null;
  categoryId: string | null;
  categoryCode: string | null;
  templateType: string | null;
  runtime: string | null;
  framework: string | null;
  language: string | null;
  icon?: ClawRouterMediaResource;
  cover?: ClawRouterMediaResource;
  visibility: AdminAppTemplateVisibility;
  publishStatus: AdminAppTemplatePublishStatus;
  featured: boolean;
  sortWeight: number;
  sourceAppId: string | null;
  gitRepoUrl: string | null;
  gitRef: string | null;
  gitSubPath: string | null;
  currentVersionId: string | null;
  appConfigSchema: Record<string, unknown>;
  defaultAppConfig: Record<string, unknown>;
  variableSchema: Record<string, unknown>;
  dependencyManifest: Record<string, unknown>[];
  capabilityManifest: Record<string, unknown>[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminAppTemplateCreateInput {
  templateNo?: string;
  templateCode: string;
  templateName: string;
  description?: string | null;
  categoryId?: string | null;
  categoryCode?: string | null;
  templateType?: string | null;
  runtime?: string | null;
  framework?: string | null;
  language?: string | null;
  icon?: ClawRouterMediaResource;
  cover?: ClawRouterMediaResource;
  visibility?: AdminAppTemplateVisibility;
  publishStatus?: AdminAppTemplatePublishStatus;
  featured?: boolean;
  sortWeight?: number;
  sourceAppId?: string | null;
  gitRepoUrl?: string | null;
  gitRef?: string | null;
  gitSubPath?: string | null;
  appConfigSchema?: Record<string, unknown>;
  defaultAppConfig?: Record<string, unknown>;
  variableSchema?: Record<string, unknown>;
  dependencyManifest?: Record<string, unknown>[];
  capabilityManifest?: Record<string, unknown>[];
}

export interface AdminAppTemplateUpdateInput {
  templateName?: string;
  description?: string | null;
  categoryId?: string | null;
  categoryCode?: string | null;
  templateType?: string | null;
  runtime?: string | null;
  framework?: string | null;
  language?: string | null;
  icon?: ClawRouterMediaResource;
  cover?: ClawRouterMediaResource;
  visibility?: AdminAppTemplateVisibility;
  publishStatus?: AdminAppTemplatePublishStatus;
  featured?: boolean;
  sortWeight?: number;
  sourceAppId?: string | null;
  gitRepoUrl?: string | null;
  gitRef?: string | null;
  gitSubPath?: string | null;
  appConfigSchema?: Record<string, unknown>;
  defaultAppConfig?: Record<string, unknown>;
  variableSchema?: Record<string, unknown>;
  dependencyManifest?: Record<string, unknown>[];
  capabilityManifest?: Record<string, unknown>[];
}

export interface AdminAppTemplateListInput {
  searchQuery?: unknown;
  publishStatus?: AdminAppTemplatePublishStatus;
  templateType?: unknown;
  runtime?: unknown;
  categoryId?: unknown;
  page?: unknown;
  pageSize?: unknown;
}

interface AdminAppTemplateListSdkParams {
  q?: string;
  publishStatus?: AdminAppTemplatePublishStatus;
  templateType?: string;
  runtime?: string;
  categoryId?: number;
  page?: number;
  pageSize?: number;
}

export interface AdminAppTemplatePage {
  items: AdminAppTemplate[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
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
    );
    ensureSdkworkApiSuccess(result, 'Failed to create app category');
    return normalizeAppCategory(readRequiredApiItem(result, 'Created app category response is missing data'));
  }

  static async updateAppCategory(categoryId: string, input: AdminAppCategoryUpdateInput): Promise<AdminAppCategory> {
    const result = await getClawRouterBackendSdkClient().platform.apps.categories.update(
      requiredSafePathSegment(categoryId, 'categoryId'),
      normalizeUpdateCategoryRequest(input),
    );
    ensureSdkworkApiSuccess(result, 'Failed to update app category');
    return normalizeAppCategory(readRequiredApiItem(result, 'Updated app category response is missing data'));
  }

  static async deleteAppCategory(categoryId: string): Promise<boolean> {
    const result = await getClawRouterBackendSdkClient().platform.apps.categories.delete(
      requiredSafePathSegment(categoryId, 'categoryId'),
    );
    ensureDeleteResult(result, 'App category delete confirmation is required');
    return true;
  }

  static async fetchApps(query: AdminAppListInput = {}): Promise<AdminAppPage> {
    const request = normalizeListRequest(query);
    const result = await getClawRouterBackendSdkClient().platform.apps.list(
      request,
    );
    ensureSdkworkApiSuccess(result, 'Failed to fetch apps');
    const data = readRequiredRecord(readApiData(result), 'Failed to fetch apps');
    const items = readRequiredApiItems(result, 'Failed to fetch apps')
      .map(normalizeAdminApp);
    const fallbackPage = request.page ?? 1;
    const fallbackPageSize = request.pageSize ?? 100;
    return {
      items,
      total: readOptionalNonNegativeInteger(data, 'total', items.length),
      page: readOptionalNonNegativeInteger(data, 'page', fallbackPage) || fallbackPage,
      pageSize: readOptionalNonNegativeInteger(data, 'pageSize', fallbackPageSize) || fallbackPageSize,
      hasNextPage: readOptionalBoolean(data, 'hasNextPage', items.length >= fallbackPageSize),
    };
  }

  static async fetchApp(appId: string): Promise<AdminApp> {
    const result = await getClawRouterBackendSdkClient().platform.apps.retrieve(
      requiredSafePathSegment(appId, 'appId'),
    );
    ensureSdkworkApiSuccess(result, 'Failed to fetch app');
    return normalizeAdminApp(readRequiredApiItem(result, 'App response is missing data'));
  }

  static async createApp(input: AdminAppCreateInput): Promise<AdminApp> {
    const result = await getClawRouterBackendSdkClient().platform.apps.create(
      normalizeCreateRequest(input),
    );
    ensureSdkworkApiSuccess(result, 'Failed to create app');
    return normalizeAdminApp(readRequiredApiItem(result, 'Created app response is missing data'));
  }

  static async updateApp(appId: string, input: AdminAppUpdateInput): Promise<AdminApp> {
    const result = await getClawRouterBackendSdkClient().platform.apps.update(
      requiredSafePathSegment(appId, 'appId'),
      normalizeUpdateRequest(input),
    );
    ensureSdkworkApiSuccess(result, 'Failed to update app');
    return normalizeAdminApp(readRequiredApiItem(result, 'Updated app response is missing data'));
  }

  static async deleteApp(appId: string): Promise<boolean> {
    const result = await getClawRouterBackendSdkClient().platform.apps.delete(
      requiredSafePathSegment(appId, 'appId'),
    );
    ensureDeleteResult(result, 'App delete confirmation is required');
    return true;
  }

  static async enableApp(appId: string): Promise<AdminApp> {
    const result = await getClawRouterBackendSdkClient().platform.apps.enable(
      requiredSafePathSegment(appId, 'appId'),
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
    );
    ensureSdkworkApiSuccess(result, 'Failed to offline app');
    return ensureAppMarketStatus(
      normalizeAdminApp(readRequiredApiItem(result, 'Offline app response is missing data')),
      'OFFLINE',
      'Offline app response must have OFFLINE market status',
    );
  }

  static async fetchAppTemplates(query: AdminAppTemplateListInput = {}): Promise<AdminAppTemplatePage> {
    const request = normalizeTemplateListRequest(query);
    const result = await getClawRouterBackendSdkClient().platform.apps.templates.list(
      request,
    );
    ensureSdkworkApiSuccess(result, 'Failed to fetch app templates');
    const data = readRequiredRecord(readApiData(result), 'Failed to fetch app templates');
    const items = readRequiredApiItems(result, 'Failed to fetch app templates')
      .map(normalizeAdminAppTemplate);
    const fallbackPage = request.page ?? 1;
    const fallbackPageSize = request.pageSize ?? 100;
    return {
      items,
      total: readOptionalNonNegativeInteger(data, 'total', items.length),
      page: readOptionalNonNegativeInteger(data, 'page', fallbackPage) || fallbackPage,
      pageSize: readOptionalNonNegativeInteger(data, 'pageSize', fallbackPageSize) || fallbackPageSize,
      hasNextPage: readOptionalBoolean(data, 'hasNextPage', items.length >= fallbackPageSize),
    };
  }

  static async createAppTemplate(input: AdminAppTemplateCreateInput): Promise<AdminAppTemplate> {
    const result = await getClawRouterBackendSdkClient().platform.apps.templates.create(
      normalizeCreateTemplateRequest(input),
    );
    ensureSdkworkApiSuccess(result, 'Failed to create app template');
    return normalizeAdminAppTemplate(readRequiredApiItem(result, 'Created app template response is missing data'));
  }

  static async fetchAppTemplate(templateId: string): Promise<AdminAppTemplate> {
    const result = await getClawRouterBackendSdkClient().platform.apps.templates.retrieve(
      requiredSafePathSegment(templateId, 'templateId'),
    );
    ensureSdkworkApiSuccess(result, 'Failed to fetch app template');
    return normalizeAdminAppTemplate(readRequiredApiItem(result, 'App template response is missing data'));
  }

  static async updateAppTemplate(templateId: string, input: AdminAppTemplateUpdateInput): Promise<AdminAppTemplate> {
    const result = await getClawRouterBackendSdkClient().platform.apps.templates.update(
      requiredSafePathSegment(templateId, 'templateId'),
      normalizeUpdateTemplateRequest(input),
    );
    ensureSdkworkApiSuccess(result, 'Failed to update app template');
    return normalizeAdminAppTemplate(readRequiredApiItem(result, 'Updated app template response is missing data'));
  }

  static async publishAppTemplate(templateId: string): Promise<AdminAppTemplate> {
    const result = await getClawRouterBackendSdkClient().platform.apps.templates.publish(
      requiredSafePathSegment(templateId, 'templateId'),
    );
    ensureSdkworkApiSuccess(result, 'Failed to publish app template');
    return ensureTemplatePublishStatus(
      normalizeAdminAppTemplate(readRequiredApiItem(result, 'Published app template response is missing data')),
      'PUBLISHED',
      'Published app template response must have PUBLISHED publish status',
    );
  }

  static async offlineAppTemplate(templateId: string): Promise<AdminAppTemplate> {
    const result = await getClawRouterBackendSdkClient().platform.apps.templates.unpublish(
      requiredSafePathSegment(templateId, 'templateId'),
    );
    ensureSdkworkApiSuccess(result, 'Failed to offline app template');
    return ensureTemplatePublishStatus(
      normalizeAdminAppTemplate(readRequiredApiItem(result, 'Offline app template response is missing data')),
      'OFFLINE',
      'Offline app template response must have OFFLINE publish status',
    );
  }

  static async deleteAppTemplate(templateId: string): Promise<boolean> {
    const result = await getClawRouterBackendSdkClient().platform.apps.templates.delete(
      requiredSafePathSegment(templateId, 'templateId'),
    );
    ensureDeleteResult(result, 'App template delete confirmation is required');
    return true;
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

export function createAdminAppTemplateInputFromForm(form: FormData): AdminAppTemplateCreateInput {
  const input: AdminAppTemplateCreateInput = {
    templateCode: requiredFormText(form, 'templateCode', 128),
    templateName: requiredFormText(form, 'templateName', 255),
    visibility: readTemplateVisibility(optionalFormText(form, 'visibility', 32) ?? 'TENANT'),
    publishStatus: readTemplatePublishStatus(optionalFormText(form, 'publishStatus', 32) ?? 'DRAFT'),
  };
  mergeSharedTemplateFormFields(input, form, 'create');
  return input;
}

export function updateAdminAppTemplateInputFromForm(form: FormData): AdminAppTemplateUpdateInput {
  const input: AdminAppTemplateUpdateInput = {};
  const templateName = optionalFormText(form, 'templateName', 255);
  if (templateName) {
    input.templateName = templateName;
  }
  mergeSharedTemplateFormFields(input, form, 'update');
  return input;
}

function normalizeCreateCategoryRequest(input: AdminAppCategoryCreateInput): AdminAppCategoryCreateRequest {
  return pruneUndefined({
    name: requiredText(input.name, 'name', 255),
    description: optionalText(input.description, 'description', 4000),
    code: optionalCategoryCode(input.code, 'code', 128),
    icon: input.icon,
    parentId: normalizeNullableId(input.parentId),
    path: optionalPath(input.path, 'path', 1024),
    sortWeight: input.sortWeight === undefined ? undefined : boundedInteger(input.sortWeight, 'sortWeight', -1_000_000, 1_000_000),
    status: input.status === undefined ? undefined : boundedInteger(input.status, 'status', -1_000_000, 1_000_000),
    visible: input.visible,
  });
}

function normalizeUpdateCategoryRequest(input: AdminAppCategoryUpdateInput): AdminAppCategoryUpdateRequest {
  return pruneUndefined({
    name: optionalText(input.name, 'name', 255),
    description: normalizeNullableText(input.description, 'description', 4000),
    code: normalizeNullableCategoryCode(input.code, 'code', 128),
    icon: input.icon,
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
  if (input.categoryId !== undefined) {
    request.categoryId = positiveInteger(input.categoryId, 'categoryId', 1_000_000_000_000);
  }
  if (input.page !== undefined) {
    request.page = positiveInteger(input.page, 'page', 1_000_000);
  }
  if (input.pageSize !== undefined) {
    request.pageSize = positiveInteger(input.pageSize, 'pageSize', 200);
  }
  return request;
}

function normalizeTemplateListRequest(input: AdminAppTemplateListInput): AdminAppTemplateListSdkParams {
  const request: AdminAppTemplateListSdkParams = {};
  const searchQuery = optionalText(input.searchQuery, 'searchQuery', 128);
  if (searchQuery) {
    request.q = searchQuery;
  }
  if (input.publishStatus) {
    request.publishStatus = readTemplatePublishStatus(input.publishStatus);
  }
  const templateType = optionalCode(input.templateType, 'templateType', 64);
  if (templateType) {
    request.templateType = templateType;
  }
  const runtime = optionalCode(input.runtime, 'runtime', 64);
  if (runtime) {
    request.runtime = runtime;
  }
  if (input.categoryId !== undefined) {
    request.categoryId = positiveInteger(input.categoryId, 'categoryId', 1_000_000_000_000);
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
    userId: normalizeNullableId(input.userId),
    name,
    description: optionalText(input.description, 'description', 4000),
    version: optionalText(input.version, 'version', 64),
    icon: input.icon,
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
    artifact: input.artifact,
  }) as AdminAppCreateRequest;
}

function normalizeCreateTemplateRequest(input: AdminAppTemplateCreateInput): AdminAppTemplateCreateRequest {
  return pruneUndefined({
    templateNo: optionalCode(input.templateNo, 'templateNo', 64),
    templateCode: requiredCode(input.templateCode, 'templateCode', 128),
    templateName: requiredText(input.templateName, 'templateName', 255),
    description: optionalText(input.description, 'description', 4000),
    categoryId: normalizeNullableId(input.categoryId),
    categoryCode: optionalCode(input.categoryCode, 'categoryCode', 128),
    templateType: optionalCode(input.templateType, 'templateType', 64),
    runtime: optionalCode(input.runtime, 'runtime', 64),
    framework: optionalCode(input.framework, 'framework', 64),
    language: optionalCode(input.language, 'language', 64),
    icon: input.icon,
    cover: input.cover,
    visibility: readTemplateVisibility(input.visibility ?? 'TENANT'),
    publishStatus: readTemplatePublishStatus(input.publishStatus ?? 'DRAFT'),
    featured: input.featured ?? false,
    sortWeight: input.sortWeight === undefined ? 0 : boundedInteger(input.sortWeight, 'sortWeight', -1_000_000, 1_000_000),
    sourceAppId: normalizeNullableId(input.sourceAppId),
    gitRepoUrl: optionalGitRepoUrl(input.gitRepoUrl, 'gitRepoUrl', 1024),
    gitRef: optionalGitRef(input.gitRef, 'gitRef', 128),
    gitSubPath: optionalGitSubPath(input.gitSubPath, 'gitSubPath', 1024),
    appConfigSchema: normalizeObject(input.appConfigSchema, 'appConfigSchema'),
    defaultAppConfig: normalizeObject(input.defaultAppConfig, 'defaultAppConfig'),
    variableSchema: normalizeObject(input.variableSchema, 'variableSchema'),
    dependencyManifest: normalizeRecordArray(input.dependencyManifest, 'dependencyManifest'),
    capabilityManifest: normalizeRecordArray(input.capabilityManifest, 'capabilityManifest'),
  }) as AdminAppTemplateCreateRequest;
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

function ensureTemplatePublishStatus(
  template: AdminAppTemplate,
  publishStatus: AdminAppTemplatePublishStatus,
  message: string,
): AdminAppTemplate {
  if (template.publishStatus !== publishStatus) {
    throw new Error(message);
  }
  return template;
}

function normalizeUpdateRequest(input: AdminAppUpdateInput): AdminAppUpdateRequest {
  const config = input.config === undefined ? undefined : normalizeAppConfig(input.config);
  return pruneUndefined({
    userId: normalizeNullableId(input.userId),
    name: optionalText(input.name, 'name', 255),
    description: normalizeNullableText(input.description, 'description', 4000),
    version: normalizeNullableText(input.version, 'version', 64),
    icon: input.icon,
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
    artifact: input.artifact,
  }) as AdminAppUpdateRequest;
}

function normalizeUpdateTemplateRequest(input: AdminAppTemplateUpdateInput): AdminAppTemplateUpdateRequest {
  return pruneUndefined({
    templateName: optionalText(input.templateName, 'templateName', 255),
    description: normalizeNullableText(input.description, 'description', 4000),
    categoryId: normalizeNullableId(input.categoryId),
    categoryCode: normalizeNullableCode(input.categoryCode, 'categoryCode', 128),
    templateType: normalizeNullableCode(input.templateType, 'templateType', 64),
    runtime: normalizeNullableCode(input.runtime, 'runtime', 64),
    framework: normalizeNullableCode(input.framework, 'framework', 64),
    language: normalizeNullableCode(input.language, 'language', 64),
    icon: input.icon,
    cover: input.cover,
    visibility: input.visibility === undefined ? undefined : readTemplateVisibility(input.visibility),
    publishStatus: input.publishStatus === undefined ? undefined : readTemplatePublishStatus(input.publishStatus),
    featured: input.featured,
    sortWeight: input.sortWeight === undefined ? undefined : boundedInteger(input.sortWeight, 'sortWeight', -1_000_000, 1_000_000),
    sourceAppId: normalizeNullableId(input.sourceAppId),
    gitRepoUrl: normalizeNullableGitRepoUrl(input.gitRepoUrl, 'gitRepoUrl', 1024),
    gitRef: normalizeNullableGitRef(input.gitRef, 'gitRef', 128),
    gitSubPath: normalizeNullableGitSubPath(input.gitSubPath, 'gitSubPath', 1024),
    appConfigSchema: input.appConfigSchema === undefined ? undefined : normalizeObject(input.appConfigSchema, 'appConfigSchema'),
    defaultAppConfig: input.defaultAppConfig === undefined ? undefined : normalizeObject(input.defaultAppConfig, 'defaultAppConfig'),
    variableSchema: input.variableSchema === undefined ? undefined : normalizeObject(input.variableSchema, 'variableSchema'),
    dependencyManifest: input.dependencyManifest === undefined ? undefined : normalizeRecordArray(input.dependencyManifest, 'dependencyManifest'),
    capabilityManifest: input.capabilityManifest === undefined ? undefined : normalizeRecordArray(input.capabilityManifest, 'capabilityManifest'),
  }) as AdminAppTemplateUpdateRequest;
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
    icon: readRequiredMediaResource(item.icon, 'App icon is required'),
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
    artifact: readMediaResource(item.artifact),
    createdAt: readRequiredString(item, 'createdAt', 'App created time is required'),
    updatedAt: readRequiredString(item, 'updatedAt', 'App updated time is required'),
  };
}

function normalizeAdminAppTemplate(value: unknown): AdminAppTemplate {
  const item = readRequiredRecord(value, 'App template record is required');
  return {
    id: readRequiredString(item, 'id', 'App template id is required'),
    uuid: readRequiredString(item, 'uuid', 'App template uuid is required'),
    templateNo: readRequiredString(item, 'templateNo', 'App template number is required'),
    templateCode: readRequiredString(item, 'templateCode', 'App template code is required'),
    templateName: readRequiredString(item, 'templateName', 'App template name is required'),
    description: readNullableString(item, 'description'),
    categoryId: readNullableString(item, 'categoryId'),
    categoryCode: readNullableString(item, 'categoryCode'),
    templateType: readNullableString(item, 'templateType'),
    runtime: readNullableString(item, 'runtime'),
    framework: readNullableString(item, 'framework'),
    language: readNullableString(item, 'language'),
    icon: readMediaResource(item.icon),
    cover: readMediaResource(item.cover),
    visibility: readTemplateVisibility(readRequiredString(item, 'visibility', 'App template visibility is required')),
    publishStatus: readTemplatePublishStatus(readRequiredString(item, 'publishStatus', 'App template publish status is required')),
    featured: readRequiredBoolean(item, 'featured', 'App template featured flag is required'),
    sortWeight: readRequiredInteger(item, 'sortWeight', 'App template sort weight is required'),
    sourceAppId: readNullableString(item, 'sourceAppId'),
    gitRepoUrl: readNullableString(item, 'gitRepoUrl'),
    gitRef: readNullableString(item, 'gitRef'),
    gitSubPath: readNullableString(item, 'gitSubPath'),
    currentVersionId: readNullableString(item, 'currentVersionId'),
    appConfigSchema: readRequiredRecordField(item, 'appConfigSchema', 'App template config schema is required'),
    defaultAppConfig: readRequiredRecordField(item, 'defaultAppConfig', 'App template default app config is required'),
    variableSchema: readRequiredRecordField(item, 'variableSchema', 'App template variable schema is required'),
    dependencyManifest: readRequiredRecordArray(item, 'dependencyManifest', 'App template dependency manifest is required'),
    capabilityManifest: readRequiredRecordArray(item, 'capabilityManifest', 'App template capability manifest is required'),
    createdAt: readRequiredString(item, 'createdAt', 'App template created time is required'),
    updatedAt: readRequiredString(item, 'updatedAt', 'App template updated time is required'),
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
    icon: readMediaResource(item.icon),
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
    ['projectId', 128],
    ['accessUrl', 512],
    ['appType', 64],
    ['packageName', 255],
    ['bundleId', 255],
    ['storeUrl', 512],
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
  const icon = optionalFormMediaResource(form, 'icon', 'image', 512);
  if (icon !== undefined) {
    input.icon = icon;
  }
  const artifact = mode === 'create'
    ? optionalFormMediaResource(form, 'artifact', 'archive', 512)
    : optionalNullableFormMediaResource(form, 'artifact', 'archive', 512);
  if (artifact !== undefined) {
    input.artifact = artifact;
  }
  if (mode === 'update' && form.has('userId')) {
    input.userId = nullableFormText(form, 'userId', 128);
  } else {
    const userId = optionalFormText(form, 'userId', 128);
    if (userId !== undefined) {
      input.userId = userId;
    }
  }
  for (const key of ['resourceList', 'config', 'platforms', 'installPlatforms', 'installSkill', 'installConfig'] as const) {
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
  const icon = optionalFormMediaResource(form, 'icon', 'image', 255);
  if (icon !== undefined) {
    input.icon = icon;
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

function mergeSharedTemplateFormFields(
  input: AdminAppTemplateCreateInput | AdminAppTemplateUpdateInput,
  form: FormData,
  mode: 'create' | 'update',
): void {
  for (const [key, maxLength] of [
    ['templateNo', 64],
    ['description', 4000],
    ['categoryId', 128],
    ['categoryCode', 128],
    ['templateType', 64],
    ['runtime', 64],
    ['framework', 64],
    ['language', 64],
    ['sourceAppId', 128],
  ] as const) {
    if (key === 'templateNo' && mode === 'update') {
      continue;
    }
    const value = mode === 'create'
      ? optionalFormText(form, key, maxLength)
      : optionalNullableFormText(form, key, maxLength);
    if (value !== undefined) {
      input[key] = value;
    }
  }
  const icon = optionalFormMediaResource(form, 'icon', 'image', 1024);
  if (icon !== undefined) {
    input.icon = icon;
  }
  const cover = optionalFormMediaResource(form, 'cover', 'image', 1024);
  if (cover !== undefined) {
    input.cover = cover;
  }
  const gitRepoUrl = mode === 'create'
    ? optionalGitRepoUrl(formString(form, 'gitRepoUrl'), 'gitRepoUrl', 1024)
    : normalizeNullableGitRepoUrl(form.has('gitRepoUrl') ? formString(form, 'gitRepoUrl') ?? '' : undefined, 'gitRepoUrl', 1024);
  if (gitRepoUrl !== undefined) {
    input.gitRepoUrl = gitRepoUrl;
  }
  const gitRef = mode === 'create'
    ? optionalGitRef(formString(form, 'gitRef'), 'gitRef', 128)
    : normalizeNullableGitRef(form.has('gitRef') ? formString(form, 'gitRef') ?? '' : undefined, 'gitRef', 128);
  if (gitRef !== undefined) {
    input.gitRef = gitRef;
  }
  const gitSubPath = mode === 'create'
    ? optionalGitSubPath(formString(form, 'gitSubPath'), 'gitSubPath', 1024)
    : normalizeNullableGitSubPath(form.has('gitSubPath') ? formString(form, 'gitSubPath') ?? '' : undefined, 'gitSubPath', 1024);
  if (gitSubPath !== undefined) {
    input.gitSubPath = gitSubPath;
  }

  const visibility = optionalFormText(form, 'visibility', 32);
  if (visibility) {
    input.visibility = readTemplateVisibility(visibility);
  }
  const publishStatus = optionalFormText(form, 'publishStatus', 32);
  if (publishStatus) {
    input.publishStatus = readTemplatePublishStatus(publishStatus);
  }
  const featured = optionalFormBoolean(form, 'featured');
  if (featured !== undefined) {
    input.featured = featured;
  }
  const sortWeight = optionalFormBoundedInteger(form, 'sortWeight', -1_000_000, 1_000_000);
  if (sortWeight !== undefined) {
    input.sortWeight = sortWeight;
  }
  for (const key of ['appConfigSchema', 'defaultAppConfig', 'variableSchema'] as const) {
    const value = optionalJsonObjectFormField(form, key);
    if (value !== undefined) {
      input[key] = value;
    }
  }
  for (const key of ['dependencyManifest', 'capabilityManifest'] as const) {
    const value = optionalJsonArrayFormField(form, key);
    if (value !== undefined) {
      input[key] = value;
    }
  }
}

function requiredFormText(form: FormData, key: string, maxLength: number): string {
  return requiredText(formString(form, key), key, maxLength);
}

function optionalFormMediaResource(
  form: FormData,
  key: string,
  kind: ClawRouterMediaResource['kind'],
  maxLength: number,
): ClawRouterMediaResource | undefined {
  const value = optionalFormText(form, key, maxLength);
  return toExternalUrlMediaResource(value, kind);
}

function optionalNullableFormMediaResource(
  form: FormData,
  key: string,
  kind: ClawRouterMediaResource['kind'],
  maxLength: number,
): ClawRouterMediaResource | null | undefined {
  if (!form.has(key)) {
    return undefined;
  }
  const value = optionalFormText(form, key, maxLength);
  return toExternalUrlMediaResource(value, kind) ?? null;
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

function requiredCode(value: unknown, fieldName: string, maxLength: number): string {
  const normalized = optionalCode(value, fieldName, maxLength);
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

function optionalGitRepoUrl(value: unknown, fieldName: string, maxLength: number): string | undefined {
  const normalized = optionalText(value, fieldName, maxLength);
  if (normalized) {
    validateGitRepoUrl(normalized, fieldName);
  }
  return normalized;
}

function normalizeNullableGitRepoUrl(value: unknown, fieldName: string, maxLength: number): string | null | undefined {
  if (value === null) {
    return null;
  }
  return optionalGitRepoUrl(value, fieldName, maxLength) ?? (typeof value === 'string' && value.trim() === '' ? null : undefined);
}

function optionalGitRef(value: unknown, fieldName: string, maxLength: number): string | undefined {
  const normalized = optionalText(value, fieldName, maxLength);
  if (normalized) {
    validateGitRef(normalized, fieldName);
  }
  return normalized;
}

function normalizeNullableGitRef(value: unknown, fieldName: string, maxLength: number): string | null | undefined {
  if (value === null) {
    return null;
  }
  return optionalGitRef(value, fieldName, maxLength) ?? (typeof value === 'string' && value.trim() === '' ? null : undefined);
}

function optionalGitSubPath(value: unknown, fieldName: string, maxLength: number): string | undefined {
  const normalized = optionalText(value, fieldName, maxLength);
  if (normalized === '.') {
    return undefined;
  }
  if (normalized) {
    validateGitSubPath(normalized, fieldName);
  }
  return normalized;
}

function normalizeNullableGitSubPath(value: unknown, fieldName: string, maxLength: number): string | null | undefined {
  if (value === null) {
    return null;
  }
  const normalized = typeof value === 'string' ? value.trim() : value;
  return optionalGitSubPath(value, fieldName, maxLength) ?? (normalized === '' || normalized === '.' ? null : undefined);
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

function validateGitRepoUrl(value: string, fieldName: string): void {
  if (/\s/.test(value)) {
    throw new Error(`${fieldName} must not contain whitespace`);
  }
  const supportedUrl = value.startsWith('http://')
    || value.startsWith('https://')
    || value.startsWith('ssh://')
    || value.startsWith('git://');
  const scpLike = /^git@[^:]+:.+/.test(value);
  if (!supportedUrl && !scpLike) {
    throw new Error(`${fieldName} must be an http(s), ssh, git, or git@host:path repository URL`);
  }
}

function validateGitRef(value: string, fieldName: string): void {
  if (/\s|\\|\.\./.test(value) || value.endsWith('/') || value.endsWith('.')) {
    throw new Error(`${fieldName} must be a valid branch, tag, or commit reference`);
  }
}

function validateGitSubPath(value: string, fieldName: string): void {
  if (value.startsWith('/') || value.includes('\\')) {
    throw new Error(`${fieldName} must be a relative repository path`);
  }
  if (value.split('/').some((segment) => !segment || segment === '.' || segment === '..')) {
    throw new Error(`${fieldName} must not contain empty, dot, or parent path segments`);
  }
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

function readTemplateVisibility(value: string): AdminAppTemplateVisibility {
  const normalized = value.trim();
  if (normalized === 'PRIVATE' || normalized === 'TENANT' || normalized === 'PUBLIC') {
    return normalized;
  }
  throw new Error(`Unsupported app template visibility: ${value}`);
}

function readTemplatePublishStatus(value: string): AdminAppTemplatePublishStatus {
  const normalized = value.trim();
  if (normalized === 'DRAFT' || normalized === 'PUBLISHED' || normalized === 'OFFLINE') {
    return normalized;
  }
  throw new Error(`Unsupported app template publish status: ${value}`);
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

function readOptionalNonNegativeInteger(record: ApiRecord, key: string, fallback: number): number {
  const numberValue = readNumber(record, key, fallback);
  if (!Number.isSafeInteger(numberValue) || numberValue < 0) {
    throw new Error(`${key} must be a non-negative integer`);
  }
  return numberValue;
}

function readOptionalBoolean(record: ApiRecord, key: string, fallback: boolean): boolean {
  const value = record[key];
  if (value === undefined || value === null) {
    return fallback;
  }
  if (typeof value !== 'boolean') {
    throw new Error(`${key} must be a boolean`);
  }
  return value;
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
