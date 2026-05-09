import { backendApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { AdminApiKeyCreateRequest, CreateApiKeyResult, OperationRequest, PlusApiResult } from '../types';


export class ApikeyApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

/** Create API key */
  async createApiKey(body: AdminApiKeyCreateRequest, idempotencyKey: string, xRequestId?: string): Promise<CreateApiKeyResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': idempotencyKey,
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.post<CreateApiKeyResult>(backendApiPath(`/apikey`), body, undefined, requestHeaders, 'application/json');
  }

/** List API key map */
  async fetchApiKeysMap(body?: OperationRequest): Promise<PlusApiResult> {
    return this.client.post<PlusApiResult>(backendApiPath(`/apikey/list`), body, undefined, undefined, 'application/json');
  }

/** Delete API key */
  async deleteApiKey(apiKeyId: string | number): Promise<PlusApiResult> {
    return this.client.delete<PlusApiResult>(backendApiPath(`/apikey/${apiKeyId}`));
  }
}

export function createApikeyApi(client: HttpClient): ApikeyApi {
  return new ApikeyApi(client);
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
