import { appApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { ApiKeysCreateResult, ApiKeysListResult, CreateApiKeyRequest, UpdateSettingsRequest, UsersCurrentRetrieveResult, UsersSettingsRetrieveResult, UsersSettingsUpdateResult } from '../types';


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
}

export class IamApi {
  private client: HttpClient;
  public readonly apiKeys: IamApiKeysApi;
  public readonly users: IamUsersApi;

  constructor(client: HttpClient) {
    this.client = client;
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
