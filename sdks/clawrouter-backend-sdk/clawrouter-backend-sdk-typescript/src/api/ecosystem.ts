import { backendApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { AdminSkillArtifactCreateRequest, AdminSkillArtifactUpdateRequest, AdminSkillAssetCreateRequest, AdminSkillAssetUpdateRequest, AdminSkillCategoryCreateRequest, AdminSkillCreateRequest, AdminSkillPackageCreateRequest, AdminSkillPackageUpdateRequest, AdminSkillReviewRequest, AdminSkillUpdateRequest, SkillsArtifactsCreateResult, SkillsArtifactsDeleteResult, SkillsArtifactsListResult, SkillsArtifactsRetrieveResult, SkillsArtifactsUpdateResult, SkillsAssetsCreateResult, SkillsAssetsDeleteResult, SkillsAssetsListResult, SkillsAssetsRetrieveResult, SkillsAssetsUpdateResult, SkillsCategoriesCreateResult, SkillsCategoriesListResult, SkillsCreateResult, SkillsDeleteResult, SkillsDisableResult, SkillsEnableResult, SkillsListResult, SkillsPackageCreateResult, SkillsPackageDeleteResult, SkillsPackageDisableResult, SkillsPackageEnableResult, SkillsPackageListResult, SkillsPackageRetrieveResult, SkillsPackageUpdateResult, SkillsPublishResult, SkillsRetrieveResult, SkillsReviewApproveResult, SkillsReviewRejectResult, SkillsUnpublishResult, SkillsUpdateResult } from '../types';


export interface EcosystemSkillsReviewApproveParams {
  xRequestId?: string;
}

export interface EcosystemSkillsReviewRejectParams {
  xRequestId?: string;
}

export class EcosystemSkillsReviewApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Approve skill */
  async approve(skillId: string, body: AdminSkillReviewRequest, params?: EcosystemSkillsReviewApproveParams): Promise<SkillsReviewApproveResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': { value: params?.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<SkillsReviewApproveResult>(backendApiPath(`/ecosystem/skills/${serializePathParameter(skillId, { name: 'skillId', style: 'simple', explode: false })}/review/approve`), body, undefined, requestHeaders, 'application/json');
  }

/** Reject skill */
  async reject(skillId: string, body: AdminSkillReviewRequest, params?: EcosystemSkillsReviewRejectParams): Promise<SkillsReviewRejectResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': { value: params?.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<SkillsReviewRejectResult>(backendApiPath(`/ecosystem/skills/${serializePathParameter(skillId, { name: 'skillId', style: 'simple', explode: false })}/review/reject`), body, undefined, requestHeaders, 'application/json');
  }
}

export interface EcosystemSkillsAssetsCreateParams {
  xRequestId?: string;
}

export interface EcosystemSkillsAssetsDeleteParams {
  xRequestId?: string;
}

export interface EcosystemSkillsAssetsUpdateParams {
  xRequestId?: string;
}

export class EcosystemSkillsAssetsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List skill assets */
  async list(skillId: string): Promise<SkillsAssetsListResult> {
    return this.client.get<SkillsAssetsListResult>(backendApiPath(`/ecosystem/skills/${serializePathParameter(skillId, { name: 'skillId', style: 'simple', explode: false })}/assets`));
  }

/** Create skill asset */
  async create(skillId: string, body: AdminSkillAssetCreateRequest, params?: EcosystemSkillsAssetsCreateParams): Promise<SkillsAssetsCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': { value: params?.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<SkillsAssetsCreateResult>(backendApiPath(`/ecosystem/skills/${serializePathParameter(skillId, { name: 'skillId', style: 'simple', explode: false })}/assets`), body, undefined, requestHeaders, 'application/json');
  }

/** Delete skill asset */
  async delete(skillId: string, assetId: string, params?: EcosystemSkillsAssetsDeleteParams): Promise<SkillsAssetsDeleteResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': { value: params?.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.delete<SkillsAssetsDeleteResult>(backendApiPath(`/ecosystem/skills/${serializePathParameter(skillId, { name: 'skillId', style: 'simple', explode: false })}/assets/${serializePathParameter(assetId, { name: 'assetId', style: 'simple', explode: false })}`), undefined, requestHeaders);
  }

/** Get skill asset */
  async retrieve(skillId: string, assetId: string): Promise<SkillsAssetsRetrieveResult> {
    return this.client.get<SkillsAssetsRetrieveResult>(backendApiPath(`/ecosystem/skills/${serializePathParameter(skillId, { name: 'skillId', style: 'simple', explode: false })}/assets/${serializePathParameter(assetId, { name: 'assetId', style: 'simple', explode: false })}`));
  }

/** Update skill asset */
  async update(skillId: string, assetId: string, body: AdminSkillAssetUpdateRequest, params?: EcosystemSkillsAssetsUpdateParams): Promise<SkillsAssetsUpdateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': { value: params?.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.put<SkillsAssetsUpdateResult>(backendApiPath(`/ecosystem/skills/${serializePathParameter(skillId, { name: 'skillId', style: 'simple', explode: false })}/assets/${serializePathParameter(assetId, { name: 'assetId', style: 'simple', explode: false })}`), body, undefined, requestHeaders, 'application/json');
  }
}

export interface EcosystemSkillsArtifactsCreateParams {
  xRequestId?: string;
}

export interface EcosystemSkillsArtifactsDeleteParams {
  xRequestId?: string;
}

export interface EcosystemSkillsArtifactsUpdateParams {
  xRequestId?: string;
}

export class EcosystemSkillsArtifactsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List skill artifacts */
  async list(skillId: string): Promise<SkillsArtifactsListResult> {
    return this.client.get<SkillsArtifactsListResult>(backendApiPath(`/ecosystem/skills/${serializePathParameter(skillId, { name: 'skillId', style: 'simple', explode: false })}/artifacts`));
  }

/** Create skill artifact */
  async create(skillId: string, body: AdminSkillArtifactCreateRequest, params?: EcosystemSkillsArtifactsCreateParams): Promise<SkillsArtifactsCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': { value: params?.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<SkillsArtifactsCreateResult>(backendApiPath(`/ecosystem/skills/${serializePathParameter(skillId, { name: 'skillId', style: 'simple', explode: false })}/artifacts`), body, undefined, requestHeaders, 'application/json');
  }

/** Delete skill artifact */
  async delete(skillId: string, artifactId: string, params?: EcosystemSkillsArtifactsDeleteParams): Promise<SkillsArtifactsDeleteResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': { value: params?.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.delete<SkillsArtifactsDeleteResult>(backendApiPath(`/ecosystem/skills/${serializePathParameter(skillId, { name: 'skillId', style: 'simple', explode: false })}/artifacts/${serializePathParameter(artifactId, { name: 'artifactId', style: 'simple', explode: false })}`), undefined, requestHeaders);
  }

/** Get skill artifact */
  async retrieve(skillId: string, artifactId: string): Promise<SkillsArtifactsRetrieveResult> {
    return this.client.get<SkillsArtifactsRetrieveResult>(backendApiPath(`/ecosystem/skills/${serializePathParameter(skillId, { name: 'skillId', style: 'simple', explode: false })}/artifacts/${serializePathParameter(artifactId, { name: 'artifactId', style: 'simple', explode: false })}`));
  }

/** Update skill artifact */
  async update(skillId: string, artifactId: string, body: AdminSkillArtifactUpdateRequest, params?: EcosystemSkillsArtifactsUpdateParams): Promise<SkillsArtifactsUpdateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': { value: params?.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.put<SkillsArtifactsUpdateResult>(backendApiPath(`/ecosystem/skills/${serializePathParameter(skillId, { name: 'skillId', style: 'simple', explode: false })}/artifacts/${serializePathParameter(artifactId, { name: 'artifactId', style: 'simple', explode: false })}`), body, undefined, requestHeaders, 'application/json');
  }
}

export interface EcosystemSkillsPackageListParams {
  q?: string;
  enabled?: boolean;
  categoryId?: string;
  page?: number;
  pageSize?: number;
}

export interface EcosystemSkillsPackageCreateParams {
  xRequestId?: string;
}

export interface EcosystemSkillsPackageUpdateParams {
  xRequestId?: string;
}

export interface EcosystemSkillsPackageDisableParams {
  xRequestId?: string;
}

export interface EcosystemSkillsPackageEnableParams {
  xRequestId?: string;
}

export class EcosystemSkillsPackageApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List skill packages */
  async list(params?: EcosystemSkillsPackageListParams): Promise<SkillsPackageListResult> {
    const query = buildQueryString([
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'enabled', value: params?.enabled, style: 'form', explode: true, allowReserved: false },
      { name: 'category_id', value: params?.categoryId, style: 'form', explode: true, allowReserved: false },
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<SkillsPackageListResult>(appendQueryString(backendApiPath(`/ecosystem/skills/package`), query));
  }

/** Create skill package */
  async create(body: AdminSkillPackageCreateRequest, params?: EcosystemSkillsPackageCreateParams): Promise<SkillsPackageCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': { value: params?.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<SkillsPackageCreateResult>(backendApiPath(`/ecosystem/skills/package`), body, undefined, requestHeaders, 'application/json');
  }

/** Delete skill package */
  async delete(packageId: string): Promise<SkillsPackageDeleteResult> {
    return this.client.delete<SkillsPackageDeleteResult>(backendApiPath(`/ecosystem/skills/package/${serializePathParameter(packageId, { name: 'packageId', style: 'simple', explode: false })}`));
  }

/** Get skill package */
  async retrieve(packageId: string): Promise<SkillsPackageRetrieveResult> {
    return this.client.get<SkillsPackageRetrieveResult>(backendApiPath(`/ecosystem/skills/package/${serializePathParameter(packageId, { name: 'packageId', style: 'simple', explode: false })}`));
  }

/** Update skill package */
  async update(packageId: string, body: AdminSkillPackageUpdateRequest, params?: EcosystemSkillsPackageUpdateParams): Promise<SkillsPackageUpdateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': { value: params?.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.put<SkillsPackageUpdateResult>(backendApiPath(`/ecosystem/skills/package/${serializePathParameter(packageId, { name: 'packageId', style: 'simple', explode: false })}`), body, undefined, requestHeaders, 'application/json');
  }

/** Disable skill package */
  async disable(packageId: string, params?: EcosystemSkillsPackageDisableParams): Promise<SkillsPackageDisableResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': { value: params?.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<SkillsPackageDisableResult>(backendApiPath(`/ecosystem/skills/package/${serializePathParameter(packageId, { name: 'packageId', style: 'simple', explode: false })}/disable`), undefined, undefined, requestHeaders);
  }

/** Enable skill package */
  async enable(packageId: string, params?: EcosystemSkillsPackageEnableParams): Promise<SkillsPackageEnableResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': { value: params?.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<SkillsPackageEnableResult>(backendApiPath(`/ecosystem/skills/package/${serializePathParameter(packageId, { name: 'packageId', style: 'simple', explode: false })}/enable`), undefined, undefined, requestHeaders);
  }
}

export interface EcosystemSkillsCategoriesCreateParams {
  xRequestId?: string;
}

export class EcosystemSkillsCategoriesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List skill categories */
  async list(): Promise<SkillsCategoriesListResult> {
    return this.client.get<SkillsCategoriesListResult>(backendApiPath(`/ecosystem/skills/categories`));
  }

/** Create skill category */
  async create(body: AdminSkillCategoryCreateRequest, params?: EcosystemSkillsCategoriesCreateParams): Promise<SkillsCategoriesCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': { value: params?.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<SkillsCategoriesCreateResult>(backendApiPath(`/ecosystem/skills/categories`), body, undefined, requestHeaders, 'application/json');
  }
}

export interface EcosystemSkillsListParams {
  q?: string;
  marketStatus?: 'DRAFT' | 'PUBLISHED' | 'OFFLINE' | 'DEPRECATED';
  reviewStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  visibility?: 'PUBLIC' | 'PRIVATE' | 'UNLISTED';
  enabled?: boolean;
  categoryId?: string;
  page?: number;
  pageSize?: number;
}

export interface EcosystemSkillsCreateParams {
  xRequestId?: string;
}

export interface EcosystemSkillsUpdateParams {
  xRequestId?: string;
}

export interface EcosystemSkillsDisableParams {
  xRequestId?: string;
}

export interface EcosystemSkillsEnableParams {
  xRequestId?: string;
}

export interface EcosystemSkillsPublishParams {
  xRequestId?: string;
}

export interface EcosystemSkillsUnpublishParams {
  xRequestId?: string;
}

export class EcosystemSkillsApi {
  private client: HttpClient;
  public readonly categories: EcosystemSkillsCategoriesApi;
  public readonly package: EcosystemSkillsPackageApi;
  public readonly artifacts: EcosystemSkillsArtifactsApi;
  public readonly assets: EcosystemSkillsAssetsApi;
  public readonly review: EcosystemSkillsReviewApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.categories = new EcosystemSkillsCategoriesApi(client);
    this.package = new EcosystemSkillsPackageApi(client);
    this.artifacts = new EcosystemSkillsArtifactsApi(client);
    this.assets = new EcosystemSkillsAssetsApi(client);
    this.review = new EcosystemSkillsReviewApi(client);
  }


/** List skills */
  async list(params?: EcosystemSkillsListParams): Promise<SkillsListResult> {
    const query = buildQueryString([
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'market_status', value: params?.marketStatus, style: 'form', explode: true, allowReserved: false },
      { name: 'review_status', value: params?.reviewStatus, style: 'form', explode: true, allowReserved: false },
      { name: 'visibility', value: params?.visibility, style: 'form', explode: true, allowReserved: false },
      { name: 'enabled', value: params?.enabled, style: 'form', explode: true, allowReserved: false },
      { name: 'category_id', value: params?.categoryId, style: 'form', explode: true, allowReserved: false },
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<SkillsListResult>(appendQueryString(backendApiPath(`/ecosystem/skills`), query));
  }

/** Create skill */
  async create(body: AdminSkillCreateRequest, params?: EcosystemSkillsCreateParams): Promise<SkillsCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': { value: params?.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<SkillsCreateResult>(backendApiPath(`/ecosystem/skills`), body, undefined, requestHeaders, 'application/json');
  }

/** Delete skill */
  async delete(skillId: string): Promise<SkillsDeleteResult> {
    return this.client.delete<SkillsDeleteResult>(backendApiPath(`/ecosystem/skills/${serializePathParameter(skillId, { name: 'skillId', style: 'simple', explode: false })}`));
  }

/** Get skill */
  async retrieve(skillId: string): Promise<SkillsRetrieveResult> {
    return this.client.get<SkillsRetrieveResult>(backendApiPath(`/ecosystem/skills/${serializePathParameter(skillId, { name: 'skillId', style: 'simple', explode: false })}`));
  }

/** Update skill */
  async update(skillId: string, body: AdminSkillUpdateRequest, params?: EcosystemSkillsUpdateParams): Promise<SkillsUpdateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': { value: params?.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.put<SkillsUpdateResult>(backendApiPath(`/ecosystem/skills/${serializePathParameter(skillId, { name: 'skillId', style: 'simple', explode: false })}`), body, undefined, requestHeaders, 'application/json');
  }

/** Disable skill */
  async disable(skillId: string, params?: EcosystemSkillsDisableParams): Promise<SkillsDisableResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': { value: params?.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<SkillsDisableResult>(backendApiPath(`/ecosystem/skills/${serializePathParameter(skillId, { name: 'skillId', style: 'simple', explode: false })}/disable`), undefined, undefined, requestHeaders);
  }

/** Enable skill */
  async enable(skillId: string, params?: EcosystemSkillsEnableParams): Promise<SkillsEnableResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': { value: params?.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<SkillsEnableResult>(backendApiPath(`/ecosystem/skills/${serializePathParameter(skillId, { name: 'skillId', style: 'simple', explode: false })}/enable`), undefined, undefined, requestHeaders);
  }

/** Publish skill */
  async publish(skillId: string, params?: EcosystemSkillsPublishParams): Promise<SkillsPublishResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': { value: params?.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<SkillsPublishResult>(backendApiPath(`/ecosystem/skills/${serializePathParameter(skillId, { name: 'skillId', style: 'simple', explode: false })}/publish`), undefined, undefined, requestHeaders);
  }

/** Offline skill */
  async unpublish(skillId: string, params?: EcosystemSkillsUnpublishParams): Promise<SkillsUnpublishResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': { value: params?.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<SkillsUnpublishResult>(backendApiPath(`/ecosystem/skills/${serializePathParameter(skillId, { name: 'skillId', style: 'simple', explode: false })}/unpublish`), undefined, undefined, requestHeaders);
  }
}

export class EcosystemApi {
  private client: HttpClient;
  public readonly skills: EcosystemSkillsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.skills = new EcosystemSkillsApi(client);
  }

}

export function createEcosystemApi(client: HttpClient): EcosystemApi {
  return new EcosystemApi(client);
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
function buildRequestHeaders(
  headers: Record<string, HeaderParameterSpec | undefined>,
  cookies: Record<string, HeaderParameterSpec | undefined> = {},
): Record<string, string> | undefined {
  const requestHeaders: Record<string, string> = {};

  for (const [name, parameter] of Object.entries(headers)) {
    const serialized = serializeParameterValue(parameter);
    if (serialized !== undefined) {
      requestHeaders[name] = serialized;
    }
  }

  const cookieHeader = buildCookieHeader(cookies);
  if (cookieHeader) {
    requestHeaders.Cookie = requestHeaders.Cookie
      ? `${requestHeaders.Cookie}; ${cookieHeader}`
      : cookieHeader;
  }

  return Object.keys(requestHeaders).length > 0 ? requestHeaders : undefined;
}

interface HeaderParameterSpec {
  value: unknown;
  style: string;
  explode: boolean;
  contentType?: string;
}

function buildCookieHeader(cookies: Record<string, HeaderParameterSpec | undefined>): string | undefined {
  const pairs: string[] = [];
  for (const [name, parameter] of Object.entries(cookies)) {
    const serialized = serializeParameterValue(parameter);
    if (serialized !== undefined) {
      pairs.push(`${encodeURIComponent(name)}=${encodeURIComponent(serialized)}`);
    }
  }
  return pairs.length > 0 ? pairs.join('; ') : undefined;
}

function serializeParameterValue(parameter: HeaderParameterSpec | undefined): string | undefined {
  const value = parameter?.value;
  if (value === undefined || value === null) {
    return undefined;
  }
  if (parameter?.contentType) {
    return JSON.stringify(value);
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (Array.isArray(value)) {
    return value.map((item) => serializeHeaderPrimitive(item)).join(',');
  }
  if (typeof value === 'object' && value !== null) {
    return serializeHeaderObject(value as Record<string, unknown>, parameter?.explode === true);
  }
  return serializeHeaderPrimitive(value);
}

function serializeHeaderObject(value: Record<string, unknown>, explode: boolean): string {
  const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== undefined && entryValue !== null);
  if (explode) {
    return entries.map(([key, entryValue]) => `${key}=${serializeHeaderPrimitive(entryValue)}`).join(',');
  }
  return entries.flatMap(([key, entryValue]) => [key, serializeHeaderPrimitive(entryValue)]).join(',');
}

function serializeHeaderPrimitive(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString();
  }
  return String(value);
}
