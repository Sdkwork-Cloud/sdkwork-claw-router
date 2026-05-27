import { backendApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { AccountsCreateResult, AccountsDeleteResult, AccountsEntriesCreateResult, AccountsEntriesDeleteResult, AccountsEntriesListResult, AccountsEntriesUpdateResult, AccountsListResult, AccountsPayBindingsCreateResult, AccountsPayBindingsDeleteResult, AccountsPayBindingsListResult, AccountsRetrieveResult, AccountsUpdateResult, ManifestsListResult, OpenPlatformAccountCreateRequest, OpenPlatformAccountUpdateRequest, OpenPlatformEntryCreateRequest, OpenPlatformEntryUpdateRequest, OpenPlatformPayBindingCreateRequest, ProvidersListResult } from '../types';


export interface OpenPlatformProvidersListParams {
  status?: 'active' | 'inactive';
}

export class OpenPlatformProvidersApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List open platform providers */
  async list(params?: OpenPlatformProvidersListParams): Promise<ProvidersListResult> {
    const query = buildQueryString([
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<ProvidersListResult>(appendQueryString(backendApiPath(`/open_platform/providers`), query));
  }
}

export interface OpenPlatformManifestsListParams {
  provider?: 'wechat' | 'alipay' | 'douyin' | 'baidu' | 'kuaishou' | 'feishu';
  type_?: 'official_account' | 'mini_app' | 'life_account' | 'bot';
}

export class OpenPlatformManifestsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List open platform manifests */
  async list(params?: OpenPlatformManifestsListParams): Promise<ManifestsListResult> {
    const query = buildQueryString([
      { name: 'provider', value: params?.provider, style: 'form', explode: true, allowReserved: false },
      { name: 'type', value: params?.type_, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<ManifestsListResult>(appendQueryString(backendApiPath(`/open_platform/manifests`), query));
  }
}

export class OpenPlatformAccountsPayBindingsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List open platform account pay bindings */
  async list(accountId: string): Promise<AccountsPayBindingsListResult> {
    return this.client.get<AccountsPayBindingsListResult>(backendApiPath(`/open_platform/accounts/${serializePathParameter(accountId, { name: 'accountId', style: 'simple', explode: false })}/pay_bindings`));
  }

/** Create open platform account pay binding */
  async create(accountId: string, body: OpenPlatformPayBindingCreateRequest): Promise<AccountsPayBindingsCreateResult> {
    return this.client.post<AccountsPayBindingsCreateResult>(backendApiPath(`/open_platform/accounts/${serializePathParameter(accountId, { name: 'accountId', style: 'simple', explode: false })}/pay_bindings`), body, undefined, undefined, 'application/json');
  }

/** Delete open platform account pay binding */
  async delete(accountId: string, bindingId: string): Promise<AccountsPayBindingsDeleteResult> {
    return this.client.delete<AccountsPayBindingsDeleteResult>(backendApiPath(`/open_platform/accounts/${serializePathParameter(accountId, { name: 'accountId', style: 'simple', explode: false })}/pay_bindings/${serializePathParameter(bindingId, { name: 'bindingId', style: 'simple', explode: false })}`));
  }
}

export class OpenPlatformAccountsEntriesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List open platform account entries */
  async list(accountId: string): Promise<AccountsEntriesListResult> {
    return this.client.get<AccountsEntriesListResult>(backendApiPath(`/open_platform/accounts/${serializePathParameter(accountId, { name: 'accountId', style: 'simple', explode: false })}/entries`));
  }

/** Create open platform account entry */
  async create(accountId: string, body: OpenPlatformEntryCreateRequest): Promise<AccountsEntriesCreateResult> {
    return this.client.post<AccountsEntriesCreateResult>(backendApiPath(`/open_platform/accounts/${serializePathParameter(accountId, { name: 'accountId', style: 'simple', explode: false })}/entries`), body, undefined, undefined, 'application/json');
  }

/** Delete open platform account entry */
  async delete(accountId: string, entryId: string): Promise<AccountsEntriesDeleteResult> {
    return this.client.delete<AccountsEntriesDeleteResult>(backendApiPath(`/open_platform/accounts/${serializePathParameter(accountId, { name: 'accountId', style: 'simple', explode: false })}/entries/${serializePathParameter(entryId, { name: 'entryId', style: 'simple', explode: false })}`));
  }

/** Update open platform account entry */
  async update(accountId: string, entryId: string, body: OpenPlatformEntryUpdateRequest): Promise<AccountsEntriesUpdateResult> {
    return this.client.patch<AccountsEntriesUpdateResult>(backendApiPath(`/open_platform/accounts/${serializePathParameter(accountId, { name: 'accountId', style: 'simple', explode: false })}/entries/${serializePathParameter(entryId, { name: 'entryId', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
  }
}

export interface OpenPlatformAccountsListParams {
  provider?: 'wechat' | 'alipay' | 'douyin' | 'baidu' | 'kuaishou' | 'feishu';
  type_?: 'official_account' | 'mini_app' | 'life_account' | 'bot';
  status?: 'active' | 'inactive';
  page?: number;
  pageSize?: number;
}

export class OpenPlatformAccountsApi {
  private client: HttpClient;
  public readonly entries: OpenPlatformAccountsEntriesApi;
  public readonly payBindings: OpenPlatformAccountsPayBindingsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.entries = new OpenPlatformAccountsEntriesApi(client);
    this.payBindings = new OpenPlatformAccountsPayBindingsApi(client);
  }


/** List open platform accounts */
  async list(params?: OpenPlatformAccountsListParams): Promise<AccountsListResult> {
    const query = buildQueryString([
      { name: 'provider', value: params?.provider, style: 'form', explode: true, allowReserved: false },
      { name: 'type', value: params?.type_, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<AccountsListResult>(appendQueryString(backendApiPath(`/open_platform/accounts`), query));
  }

/** Create open platform account */
  async create(body: OpenPlatformAccountCreateRequest): Promise<AccountsCreateResult> {
    return this.client.post<AccountsCreateResult>(backendApiPath(`/open_platform/accounts`), body, undefined, undefined, 'application/json');
  }

/** Delete open platform account */
  async delete(accountId: string): Promise<AccountsDeleteResult> {
    return this.client.delete<AccountsDeleteResult>(backendApiPath(`/open_platform/accounts/${serializePathParameter(accountId, { name: 'accountId', style: 'simple', explode: false })}`));
  }

/** Retrieve open platform account */
  async retrieve(accountId: string): Promise<AccountsRetrieveResult> {
    return this.client.get<AccountsRetrieveResult>(backendApiPath(`/open_platform/accounts/${serializePathParameter(accountId, { name: 'accountId', style: 'simple', explode: false })}`));
  }

/** Update open platform account */
  async update(accountId: string, body: OpenPlatformAccountUpdateRequest): Promise<AccountsUpdateResult> {
    return this.client.patch<AccountsUpdateResult>(backendApiPath(`/open_platform/accounts/${serializePathParameter(accountId, { name: 'accountId', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
  }
}

export class OpenPlatformApi {
  private client: HttpClient;
  public readonly accounts: OpenPlatformAccountsApi;
  public readonly manifests: OpenPlatformManifestsApi;
  public readonly providers: OpenPlatformProvidersApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.accounts = new OpenPlatformAccountsApi(client);
    this.manifests = new OpenPlatformManifestsApi(client);
    this.providers = new OpenPlatformProvidersApi(client);
  }

}

export function createOpenPlatformApi(client: HttpClient): OpenPlatformApi {
  return new OpenPlatformApi(client);
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
