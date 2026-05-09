import { backendApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { AddProviderSecretResult, AdminProviderSecretCreateRequest, AdminProviderSecretListRequest, AdminProviderSecretUpdateRequest, PlusApiResult, UpdateProviderSecretResult } from '../types';


export class ProviderSecretApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

/** Create provider secret */
  async add(body: AdminProviderSecretCreateRequest, xRequestId?: string): Promise<AddProviderSecretResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.post<AddProviderSecretResult>(backendApiPath(`/provider-secrets`), body, undefined, requestHeaders, 'application/json');
  }

/** Update provider secret */
  async updateProviderSecret(body: AdminProviderSecretUpdateRequest, xRequestId?: string): Promise<UpdateProviderSecretResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.put<UpdateProviderSecretResult>(backendApiPath(`/provider-secrets`), body, undefined, requestHeaders, 'application/json');
  }

/** List provider secrets */
  async fetchProviderSecrets(body: AdminProviderSecretListRequest): Promise<PlusApiResult> {
    return this.client.post<PlusApiResult>(backendApiPath(`/provider-secrets/list`), body, undefined, undefined, 'application/json');
  }

/** Delete provider secret */
  async deleteProviderSecret(secretId: string | number): Promise<PlusApiResult> {
    return this.client.delete<PlusApiResult>(backendApiPath(`/provider-secrets/${secretId}`));
  }
}

export function createProviderSecretApi(client: HttpClient): ProviderSecretApi {
  return new ProviderSecretApi(client);
}

function appendQueryString(path: string, rawQueryString: string): string {
  const query = rawQueryString.replace(/^\?+/, '');
  if (!query) {
    return path;
  }
  return path.includes('?') ? `${path}&${query}` : `${path}?${query}`;
}


function buildRequestHeaders(
  headers: Record<string, unknown | undefined>,
  cookies: Record<string, unknown | undefined> = {},
): Record<string, string> | undefined {
  const requestHeaders: Record<string, string> = {};

  for (const [name, value] of Object.entries(headers)) {
    const serialized = serializeParameterValue(value);
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

function buildCookieHeader(cookies: Record<string, unknown | undefined>): string | undefined {
  const pairs: string[] = [];
  for (const [name, value] of Object.entries(cookies)) {
    const serialized = serializeParameterValue(value);
    if (serialized !== undefined) {
      pairs.push(`${encodeURIComponent(name)}=${encodeURIComponent(serialized)}`);
    }
  }
  return pairs.length > 0 ? pairs.join('; ') : undefined;
}

function serializeParameterValue(value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (Array.isArray(value)) {
    return value
      .map((item) => serializeParameterValue(item))
      .filter((item): item is string => item !== undefined)
      .join(',');
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}
