import { backendApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { CreateStorageBucketRequest, CreateStorageGarbageCollectionJobRequest, CreateStorageProviderRequest, CreateStorageQuotaPolicyRequest, CreateStorageReconciliationRunRequest, OssBucketsCreateResult, OssBucketsListResult, OssBucketsUpdateResult, OssDefaultBucketsListResult, OssDefaultBucketsUpdateResult, OssGcJobsCreateResult, OssGcJobsListResult, OssProvidersCreateResult, OssProvidersHealthChecksCreateResult, OssProvidersListResult, OssProvidersUpdateResult, OssQuotasCreateResult, OssQuotasListResult, OssReconciliationRunsCreateResult, OssReconciliationRunsListResult, OssUsageLedgerListResult, OssUsageListResult, OssUsageSnapshotsListResult, SetStorageDefaultBucketRequest, UpdateStorageBucketRequest, UpdateStorageProviderRequest } from '../types';


export interface OssUsageSnapshotsListParams {
  cursor?: string;
  limit?: number;
  scopeType?: 'app' | 'business_domain' | 'organization' | 'space' | 'tenant' | 'user';
  scopeId?: string;
}

export class OssUsageSnapshotsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List storage usage snapshots */
  async list(params?: OssUsageSnapshotsListParams): Promise<OssUsageSnapshotsListResult> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
      { name: 'scope_type', value: params?.scopeType, style: 'form', explode: true, allowReserved: false },
      { name: 'scope_id', value: params?.scopeId, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<OssUsageSnapshotsListResult>(appendQueryString(backendApiPath(`/storage/usage/snapshots`), query));
  }
}

export interface OssUsageLedgerListParams {
  cursor?: string;
  limit?: number;
  scopeType?: 'app' | 'business_domain' | 'organization' | 'space' | 'tenant' | 'user';
  scopeId?: string;
}

export class OssUsageLedgerApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List storage usage ledger */
  async list(params?: OssUsageLedgerListParams): Promise<OssUsageLedgerListResult> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
      { name: 'scope_type', value: params?.scopeType, style: 'form', explode: true, allowReserved: false },
      { name: 'scope_id', value: params?.scopeId, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<OssUsageLedgerListResult>(appendQueryString(backendApiPath(`/storage/usage/ledger`), query));
  }
}

export interface OssUsageListParams {
  cursor?: string;
  limit?: number;
  scopeType?: 'app' | 'business_domain' | 'organization' | 'space' | 'tenant' | 'user';
  scopeId?: string;
}

export class OssUsageApi {
  private client: HttpClient;
  public readonly ledger: OssUsageLedgerApi;
  public readonly snapshots: OssUsageSnapshotsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.ledger = new OssUsageLedgerApi(client);
    this.snapshots = new OssUsageSnapshotsApi(client);
  }


/** List storage usage counters */
  async list(params?: OssUsageListParams): Promise<OssUsageListResult> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
      { name: 'scope_type', value: params?.scopeType, style: 'form', explode: true, allowReserved: false },
      { name: 'scope_id', value: params?.scopeId, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<OssUsageListResult>(appendQueryString(backendApiPath(`/storage/usage`), query));
  }
}

export interface OssReconciliationRunsListParams {
  cursor?: string;
  limit?: number;
  runType?: string;
  status?: 'canceled' | 'completed' | 'created' | 'failed' | 'running';
}

export interface OssReconciliationRunsCreateParams {
  idempotencyKey: string;
}

export class OssReconciliationRunsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List storage reconciliation runs */
  async list(params?: OssReconciliationRunsListParams): Promise<OssReconciliationRunsListResult> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
      { name: 'run_type', value: params?.runType, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<OssReconciliationRunsListResult>(appendQueryString(backendApiPath(`/storage/reconciliation_runs`), query));
  }

/** Create storage reconciliation run */
  async create(body: CreateStorageReconciliationRunRequest, params: OssReconciliationRunsCreateParams): Promise<OssReconciliationRunsCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<OssReconciliationRunsCreateResult>(backendApiPath(`/storage/reconciliation_runs`), body, undefined, requestHeaders, 'application/json');
  }
}

export interface OssQuotasCreateParams {
  idempotencyKey: string;
}

export class OssQuotasApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List storage quota policies */
  async list(): Promise<OssQuotasListResult> {
    return this.client.get<OssQuotasListResult>(backendApiPath(`/storage/quotas`));
  }

/** Create storage quota policy */
  async create(body: CreateStorageQuotaPolicyRequest, params: OssQuotasCreateParams): Promise<OssQuotasCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<OssQuotasCreateResult>(backendApiPath(`/storage/quotas`), body, undefined, requestHeaders, 'application/json');
  }
}

export class OssProvidersHealthChecksApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Check storage provider health */
  async create(providerId: string): Promise<OssProvidersHealthChecksCreateResult> {
    return this.client.post<OssProvidersHealthChecksCreateResult>(backendApiPath(`/storage/providers/${serializePathParameter(providerId, { name: 'providerId', style: 'simple', explode: false })}/health_check`));
  }
}

export interface OssProvidersCreateParams {
  idempotencyKey: string;
}

export class OssProvidersApi {
  private client: HttpClient;
  public readonly healthChecks: OssProvidersHealthChecksApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.healthChecks = new OssProvidersHealthChecksApi(client);
  }


/** List storage providers */
  async list(): Promise<OssProvidersListResult> {
    return this.client.get<OssProvidersListResult>(backendApiPath(`/storage/providers`));
  }

/** Create storage provider */
  async create(body: CreateStorageProviderRequest, params: OssProvidersCreateParams): Promise<OssProvidersCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<OssProvidersCreateResult>(backendApiPath(`/storage/providers`), body, undefined, requestHeaders, 'application/json');
  }

/** Update storage provider status */
  async update(providerId: string, body: UpdateStorageProviderRequest): Promise<OssProvidersUpdateResult> {
    return this.client.patch<OssProvidersUpdateResult>(backendApiPath(`/storage/providers/${serializePathParameter(providerId, { name: 'providerId', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
  }
}

export interface OssGcJobsListParams {
  cursor?: string;
  limit?: number;
  status?: 'canceled' | 'completed' | 'created' | 'failed' | 'running';
}

export interface OssGcJobsCreateParams {
  idempotencyKey: string;
}

export class OssGcJobsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List storage garbage collection jobs */
  async list(params?: OssGcJobsListParams): Promise<OssGcJobsListResult> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<OssGcJobsListResult>(appendQueryString(backendApiPath(`/storage/gc_jobs`), query));
  }

/** Create storage garbage collection job */
  async create(body: CreateStorageGarbageCollectionJobRequest, params: OssGcJobsCreateParams): Promise<OssGcJobsCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<OssGcJobsCreateResult>(backendApiPath(`/storage/gc_jobs`), body, undefined, requestHeaders, 'application/json');
  }
}

export interface OssDefaultBucketsListParams {
  logicalScope?: 'migration_import' | 'system_archive' | 'system_quarantine' | 'system_temp' | 'system_variant' | 'tenant_private' | 'tenant_public_asset';
}

export class OssDefaultBucketsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List default storage bucket routes */
  async list(params?: OssDefaultBucketsListParams): Promise<OssDefaultBucketsListResult> {
    const query = buildQueryString([
      { name: 'logical_scope', value: params?.logicalScope, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<OssDefaultBucketsListResult>(appendQueryString(backendApiPath(`/storage/default_buckets`), query));
  }

/** Set default storage bucket route */
  async update(logicalScope: string, body: SetStorageDefaultBucketRequest): Promise<OssDefaultBucketsUpdateResult> {
    return this.client.patch<OssDefaultBucketsUpdateResult>(backendApiPath(`/storage/default_buckets/${serializePathParameter(logicalScope, { name: 'logicalScope', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
  }
}

export interface OssBucketsListParams {
  cursor?: string;
  limit?: number;
  status?: 'active' | 'archived' | 'disabled';
}

export interface OssBucketsCreateParams {
  idempotencyKey: string;
}

export class OssBucketsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List storage buckets */
  async list(params?: OssBucketsListParams): Promise<OssBucketsListResult> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<OssBucketsListResult>(appendQueryString(backendApiPath(`/storage/buckets`), query));
  }

/** Create storage bucket */
  async create(body: CreateStorageBucketRequest, params: OssBucketsCreateParams): Promise<OssBucketsCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<OssBucketsCreateResult>(backendApiPath(`/storage/buckets`), body, undefined, requestHeaders, 'application/json');
  }

/** Update storage bucket status */
  async update(bucketId: string, body: UpdateStorageBucketRequest): Promise<OssBucketsUpdateResult> {
    return this.client.patch<OssBucketsUpdateResult>(backendApiPath(`/storage/buckets/${serializePathParameter(bucketId, { name: 'bucketId', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
  }
}

export class OssApi {
  private client: HttpClient;
  public readonly buckets: OssBucketsApi;
  public readonly defaultBuckets: OssDefaultBucketsApi;
  public readonly gcJobs: OssGcJobsApi;
  public readonly providers: OssProvidersApi;
  public readonly quotas: OssQuotasApi;
  public readonly reconciliationRuns: OssReconciliationRunsApi;
  public readonly usage: OssUsageApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.buckets = new OssBucketsApi(client);
    this.defaultBuckets = new OssDefaultBucketsApi(client);
    this.gcJobs = new OssGcJobsApi(client);
    this.providers = new OssProvidersApi(client);
    this.quotas = new OssQuotasApi(client);
    this.reconciliationRuns = new OssReconciliationRunsApi(client);
    this.usage = new OssUsageApi(client);
  }

}

export function createOssApi(client: HttpClient): OssApi {
  return new OssApi(client);
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
