import { appApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { ApiKeyGroupsListResult, ApiKeysCreateResult, ApiKeysDeleteResult, ApiKeysListResult, ApiKeysUpdateResult, CreateApiKeyRequest, UpdateApiKeyRequest, UpdateSettingsRequest, UsersCurrentRetrieveResult, UsersSettingsRetrieveResult, UsersSettingsUpdateResult } from '../types';


export class IamUsersSettingsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List settings */
  async retrieve(): Promise<UsersSettingsRetrieveResult> {
    return this.client.get<UsersSettingsRetrieveResult>(appApiPath(`/iam/users/settings`));
  }

/** Update settings */
  async update(body: UpdateSettingsRequest): Promise<UsersSettingsUpdateResult> {
    return this.client.put<UsersSettingsUpdateResult>(appApiPath(`/iam/users/settings`), body, undefined, undefined, 'application/json');
  }
}

export class IamUsersCurrentApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Retrieve current IAM user */
  async retrieve(): Promise<UsersCurrentRetrieveResult> {
    return this.client.get<UsersCurrentRetrieveResult>(appApiPath(`/iam/users/current`));
  }
}

export class IamUsersApi {
  private client: HttpClient;
  public readonly current: IamUsersCurrentApi;
  public readonly settings: IamUsersSettingsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.current = new IamUsersCurrentApi(client);
    this.settings = new IamUsersSettingsApi(client);
  }

}

export interface IamApiKeysCreateParams {
  idempotencyKey: string;
  xRequestId?: string;
}

export interface IamApiKeysUpdateParams {
  xRequestId?: string;
}

export class IamApiKeysApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List keys */
  async list(): Promise<ApiKeysListResult> {
    return this.client.get<ApiKeysListResult>(appApiPath(`/iam/api_keys`));
  }

/** Create key */
  async create(body: CreateApiKeyRequest, params: IamApiKeysCreateParams): Promise<ApiKeysCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
        'X-Request-Id': { value: params.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<ApiKeysCreateResult>(appApiPath(`/iam/api_keys`), body, undefined, requestHeaders, 'application/json');
  }

/** Delete key */
  async delete(apiKeyId: string): Promise<ApiKeysDeleteResult> {
    return this.client.delete<ApiKeysDeleteResult>(appApiPath(`/iam/api_keys/${serializePathParameter(apiKeyId, { name: 'apiKeyId', style: 'simple', explode: false })}`));
  }

/** Update key */
  async update(apiKeyId: string, body: UpdateApiKeyRequest, params?: IamApiKeysUpdateParams): Promise<ApiKeysUpdateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': { value: params?.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.patch<ApiKeysUpdateResult>(appApiPath(`/iam/api_keys/${serializePathParameter(apiKeyId, { name: 'apiKeyId', style: 'simple', explode: false })}`), body, undefined, requestHeaders, 'application/json');
  }
}

export class IamApiKeyGroupsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List groups */
  async list(): Promise<ApiKeyGroupsListResult> {
    return this.client.get<ApiKeyGroupsListResult>(appApiPath(`/iam/api_key_groups`));
  }
}

export class IamApi {
  private client: HttpClient;
  public readonly apiKeyGroups: IamApiKeyGroupsApi;
  public readonly apiKeys: IamApiKeysApi;
  public readonly users: IamUsersApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.apiKeyGroups = new IamApiKeyGroupsApi(client);
    this.apiKeys = new IamApiKeysApi(client);
    this.users = new IamUsersApi(client);
  }

}

export function createIamApi(client: HttpClient): IamApi {
  return new IamApi(client);
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
