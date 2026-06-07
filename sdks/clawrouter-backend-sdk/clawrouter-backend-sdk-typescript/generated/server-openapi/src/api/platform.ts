import { backendApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { AdminAppCategoryCreateRequest, AdminAppCategoryUpdateRequest, AdminAppCreateRequest, AdminAppTemplateCreateRequest, AdminAppTemplateUpdateRequest, AdminAppUpdateRequest, AppsCategoriesCreateResult, AppsCategoriesDeleteResult, AppsCategoriesListResult, AppsCategoriesUpdateResult, AppsCreateResult, AppsDeleteResult, AppsDisableResult, AppsEnableResult, AppsListResult, AppsPublishResult, AppsRetrieveResult, AppsTemplatesCreateResult, AppsTemplatesDeleteResult, AppsTemplatesListResult, AppsTemplatesPublishResult, AppsTemplatesRetrieveResult, AppsTemplatesUnpublishResult, AppsTemplatesUpdateResult, AppsUnpublishResult, AppsUpdateResult } from '../types';


export interface PlatformAppsTemplatesListParams {
  q?: string;
  publishStatus?: 'DRAFT' | 'PUBLISHED' | 'OFFLINE';
  templateType?: string;
  runtime?: string;
  categoryId?: string;
  page?: string;
  pageSize?: string;
}

export class PlatformAppsTemplatesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List app templates */
  async list(params?: PlatformAppsTemplatesListParams): Promise<AppsTemplatesListResult> {
    const query = buildQueryString([
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'publish_status', value: params?.publishStatus, style: 'form', explode: true, allowReserved: false },
      { name: 'template_type', value: params?.templateType, style: 'form', explode: true, allowReserved: false },
      { name: 'runtime', value: params?.runtime, style: 'form', explode: true, allowReserved: false },
      { name: 'category_id', value: params?.categoryId, style: 'form', explode: true, allowReserved: false },
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<AppsTemplatesListResult>(appendQueryString(backendApiPath(`/platform/apps/templates`), query));
  }

/** Create app template */
  async create(body: AdminAppTemplateCreateRequest): Promise<AppsTemplatesCreateResult> {
    return this.client.post<AppsTemplatesCreateResult>(backendApiPath(`/platform/apps/templates`), body, undefined, undefined, 'application/json');
  }

/** Delete app template */
  async delete(templateId: string): Promise<AppsTemplatesDeleteResult> {
    return this.client.delete<AppsTemplatesDeleteResult>(backendApiPath(`/platform/apps/templates/${serializePathParameter(templateId, { name: 'templateId', style: 'simple', explode: false })}`));
  }

/** List app template */
  async retrieve(templateId: string): Promise<AppsTemplatesRetrieveResult> {
    return this.client.get<AppsTemplatesRetrieveResult>(backendApiPath(`/platform/apps/templates/${serializePathParameter(templateId, { name: 'templateId', style: 'simple', explode: false })}`));
  }

/** Update app template */
  async update(templateId: string, body: AdminAppTemplateUpdateRequest): Promise<AppsTemplatesUpdateResult> {
    return this.client.put<AppsTemplatesUpdateResult>(backendApiPath(`/platform/apps/templates/${serializePathParameter(templateId, { name: 'templateId', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
  }

/** Publish app template */
  async publish(templateId: string): Promise<AppsTemplatesPublishResult> {
    return this.client.post<AppsTemplatesPublishResult>(backendApiPath(`/platform/apps/templates/${serializePathParameter(templateId, { name: 'templateId', style: 'simple', explode: false })}/publish`));
  }

/** Offline app template */
  async unpublish(templateId: string): Promise<AppsTemplatesUnpublishResult> {
    return this.client.post<AppsTemplatesUnpublishResult>(backendApiPath(`/platform/apps/templates/${serializePathParameter(templateId, { name: 'templateId', style: 'simple', explode: false })}/unpublish`));
  }
}

export class PlatformAppsCategoriesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List app categories */
  async list(): Promise<AppsCategoriesListResult> {
    return this.client.get<AppsCategoriesListResult>(backendApiPath(`/platform/apps/categories`));
  }

/** Create app category */
  async create(body: AdminAppCategoryCreateRequest): Promise<AppsCategoriesCreateResult> {
    return this.client.post<AppsCategoriesCreateResult>(backendApiPath(`/platform/apps/categories`), body, undefined, undefined, 'application/json');
  }

/** Delete app category */
  async delete(categoryId: string): Promise<AppsCategoriesDeleteResult> {
    return this.client.delete<AppsCategoriesDeleteResult>(backendApiPath(`/platform/apps/categories/${serializePathParameter(categoryId, { name: 'categoryId', style: 'simple', explode: false })}`));
  }

/** Update app category */
  async update(categoryId: string, body: AdminAppCategoryUpdateRequest): Promise<AppsCategoriesUpdateResult> {
    return this.client.put<AppsCategoriesUpdateResult>(backendApiPath(`/platform/apps/categories/${serializePathParameter(categoryId, { name: 'categoryId', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
  }
}

export interface PlatformAppsListParams {
  q?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  marketStatus?: 'DRAFT' | 'PUBLISHED' | 'OFFLINE';
  appType?: string;
  categoryId?: string;
  page?: string;
  pageSize?: string;
}

export class PlatformAppsApi {
  private client: HttpClient;
  public readonly categories: PlatformAppsCategoriesApi;
  public readonly templates: PlatformAppsTemplatesApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.categories = new PlatformAppsCategoriesApi(client);
    this.templates = new PlatformAppsTemplatesApi(client);
  }


/** List apps */
  async list(params?: PlatformAppsListParams): Promise<AppsListResult> {
    const query = buildQueryString([
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'market_status', value: params?.marketStatus, style: 'form', explode: true, allowReserved: false },
      { name: 'app_type', value: params?.appType, style: 'form', explode: true, allowReserved: false },
      { name: 'category_id', value: params?.categoryId, style: 'form', explode: true, allowReserved: false },
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<AppsListResult>(appendQueryString(backendApiPath(`/platform/apps`), query));
  }

/** Create app */
  async create(body: AdminAppCreateRequest): Promise<AppsCreateResult> {
    return this.client.post<AppsCreateResult>(backendApiPath(`/platform/apps`), body, undefined, undefined, 'application/json');
  }

/** Delete app */
  async delete(appId: string): Promise<AppsDeleteResult> {
    return this.client.delete<AppsDeleteResult>(backendApiPath(`/platform/apps/${serializePathParameter(appId, { name: 'appId', style: 'simple', explode: false })}`));
  }

/** List app */
  async retrieve(appId: string): Promise<AppsRetrieveResult> {
    return this.client.get<AppsRetrieveResult>(backendApiPath(`/platform/apps/${serializePathParameter(appId, { name: 'appId', style: 'simple', explode: false })}`));
  }

/** Update app */
  async update(appId: string, body: AdminAppUpdateRequest): Promise<AppsUpdateResult> {
    return this.client.put<AppsUpdateResult>(backendApiPath(`/platform/apps/${serializePathParameter(appId, { name: 'appId', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
  }

/** Disable app */
  async disable(appId: string): Promise<AppsDisableResult> {
    return this.client.post<AppsDisableResult>(backendApiPath(`/platform/apps/${serializePathParameter(appId, { name: 'appId', style: 'simple', explode: false })}/disable`));
  }

/** Enable app */
  async enable(appId: string): Promise<AppsEnableResult> {
    return this.client.post<AppsEnableResult>(backendApiPath(`/platform/apps/${serializePathParameter(appId, { name: 'appId', style: 'simple', explode: false })}/enable`));
  }

/** Publish app */
  async publish(appId: string): Promise<AppsPublishResult> {
    return this.client.post<AppsPublishResult>(backendApiPath(`/platform/apps/${serializePathParameter(appId, { name: 'appId', style: 'simple', explode: false })}/publish`));
  }

/** Offline app */
  async unpublish(appId: string): Promise<AppsUnpublishResult> {
    return this.client.post<AppsUnpublishResult>(backendApiPath(`/platform/apps/${serializePathParameter(appId, { name: 'appId', style: 'simple', explode: false })}/unpublish`));
  }
}

export class PlatformApi {
  private client: HttpClient;
  public readonly apps: PlatformAppsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.apps = new PlatformAppsApi(client);
  }

}

export function createPlatformApi(client: HttpClient): PlatformApi {
  return new PlatformApi(client);
}

function appendQueryString(path: string, rawQueryString: string): string {
  const query = rawQueryString.replace(/^\?+/, '');
  if (!query) {
    return path;
  }
  return path.includes('?') ? `${path}&${query}` : `${path}?${query}`;
}

interface PathParameterSpec {
  name: string;
  style: string;
  explode: boolean;
}

function serializePathParameter(value: unknown, spec: PathParameterSpec): string {
  if (value === undefined || value === null) {
    return '';
  }

  const style = spec.style || 'simple';
  if (Array.isArray(value)) {
    return serializePathArray(spec.name, value, style, spec.explode);
  }
  if (typeof value === 'object') {
    return serializePathObject(spec.name, value as Record<string, unknown>, style, spec.explode);
  }
  return pathPrefix(spec.name, style, false) + encodePathValue(serializePathPrimitive(value));
}

function serializePathArray(name: string, values: unknown[], style: string, explode: boolean): string {
  const serialized = values
    .filter((item) => item !== undefined && item !== null)
    .map((item) => encodePathValue(serializePathPrimitive(item)));
  if (serialized.length === 0) {
    return pathPrefix(name, style, false);
  }
  if (style === 'matrix') {
    return explode
      ? serialized.map((item) => `;${name}=${item}`).join('')
      : `;${name}=${serialized.join(',')}`;
  }
  return pathPrefix(name, style, false) + serialized.join(explode ? '.' : ',');
}

function serializePathObject(name: string, value: Record<string, unknown>, style: string, explode: boolean): string {
  const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== undefined && entryValue !== null);
  if (entries.length === 0) {
    return pathPrefix(name, style, true);
  }
  if (style === 'matrix') {
    return explode
      ? entries.map(([key, entryValue]) => `;${encodePathValue(key)}=${encodePathValue(serializePathPrimitive(entryValue))}`).join('')
      : `;${name}=${entries.flatMap(([key, entryValue]) => [encodePathValue(key), encodePathValue(serializePathPrimitive(entryValue))]).join(',')}`;
  }
  const serialized = explode
    ? entries.map(([key, entryValue]) => `${encodePathValue(key)}=${encodePathValue(serializePathPrimitive(entryValue))}`).join(style === 'label' ? '.' : ',')
    : entries.flatMap(([key, entryValue]) => [encodePathValue(key), encodePathValue(serializePathPrimitive(entryValue))]).join(',');
  return pathPrefix(name, style, true) + serialized;
}

function pathPrefix(name: string, style: string, _objectValue: boolean): string {
  if (style === 'label') return '.';
  if (style === 'matrix') return `;${name}`;
  return '';
}

function encodePathValue(value: string): string {
  return encodeURIComponent(value);
}

function serializePathPrimitive(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}
interface QueryParameterSpec {
  name: string;
  value: unknown;
  style: string;
  explode: boolean;
  allowReserved: boolean;
  contentType?: string;
}

function buildQueryString(parameters: QueryParameterSpec[]): string {
  const pairs: string[] = [];
  for (const parameter of parameters) {
    appendSerializedParameter(pairs, parameter);
  }
  return pairs.join('&');
}

function appendSerializedParameter(pairs: string[], parameter: QueryParameterSpec): void {
  if (parameter.value === undefined || parameter.value === null) {
    return;
  }

  if (parameter.contentType) {
    pairs.push(`${encodeQueryComponent(parameter.name)}=${encodeQueryValue(JSON.stringify(parameter.value), parameter.allowReserved)}`);
    return;
  }

  const style = parameter.style || 'form';
  if (style === 'deepObject') {
    appendDeepObjectParameter(pairs, parameter.name, parameter.value, parameter.allowReserved);
    return;
  }

  if (Array.isArray(parameter.value)) {
    appendArrayParameter(pairs, parameter.name, parameter.value, style, parameter.explode, parameter.allowReserved);
    return;
  }

  if (typeof parameter.value === 'object') {
    appendObjectParameter(pairs, parameter.name, parameter.value as Record<string, unknown>, style, parameter.explode, parameter.allowReserved);
    return;
  }

  pairs.push(`${encodeQueryComponent(parameter.name)}=${encodeQueryValue(serializePrimitive(parameter.value), parameter.allowReserved)}`);
}

function appendArrayParameter(
  pairs: string[],
  name: string,
  value: unknown[],
  style: string,
  explode: boolean,
  allowReserved: boolean,
): void {
  const values = value
    .filter((item) => item !== undefined && item !== null)
    .map((item) => serializePrimitive(item));
  if (values.length === 0) {
    return;
  }

  if (style === 'form' && explode) {
    for (const item of values) {
      pairs.push(`${encodeQueryComponent(name)}=${encodeQueryValue(item, allowReserved)}`);
    }
    return;
  }

  pairs.push(`${encodeQueryComponent(name)}=${encodeQueryValue(values.join(','), allowReserved)}`);
}

function appendObjectParameter(
  pairs: string[],
  name: string,
  value: Record<string, unknown>,
  style: string,
  explode: boolean,
  allowReserved: boolean,
): void {
  const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== undefined && entryValue !== null);
  if (entries.length === 0) {
    return;
  }

  if (style === 'form' && explode) {
    for (const [key, entryValue] of entries) {
      pairs.push(`${encodeQueryComponent(key)}=${encodeQueryValue(serializePrimitive(entryValue), allowReserved)}`);
    }
    return;
  }

  const serialized = entries.flatMap(([key, entryValue]) => [key, serializePrimitive(entryValue)]).join(',');
  pairs.push(`${encodeQueryComponent(name)}=${encodeQueryValue(serialized, allowReserved)}`);
}

function appendDeepObjectParameter(
  pairs: string[],
  name: string,
  value: unknown,
  allowReserved: boolean,
): void {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    pairs.push(`${encodeQueryComponent(name)}=${encodeQueryValue(serializePrimitive(value), allowReserved)}`);
    return;
  }

  for (const [key, entryValue] of Object.entries(value as Record<string, unknown>)) {
    if (entryValue === undefined || entryValue === null) {
      continue;
    }
    pairs.push(`${encodeQueryComponent(`${name}[${key}]`)}=${encodeQueryValue(serializePrimitive(entryValue), allowReserved)}`);
  }
}

function serializePrimitive(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}

function encodeQueryComponent(value: string): string {
  return encodeURIComponent(value);
}

function encodeQueryValue(value: string, allowReserved: boolean): string {
  const encoded = encodeURIComponent(value);
  if (!allowReserved) {
    return encoded;
  }
  return encoded.replace(/%3A/gi, ':')
    .replace(/%2F/gi, '/')
    .replace(/%3F/gi, '?')
    .replace(/%23/gi, '#')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
    .replace(/%40/gi, '@')
    .replace(/%21/gi, '!')
    .replace(/%24/gi, '$')
    .replace(/%26/gi, '&')
    .replace(/%27/gi, "'")
    .replace(/%28/gi, '(')
    .replace(/%29/gi, ')')
    .replace(/%2A/gi, '*')
    .replace(/%2B/gi, '+')
    .replace(/%2C/gi, ',')
    .replace(/%3B/gi, ';')
    .replace(/%3D/gi, '=');
}
