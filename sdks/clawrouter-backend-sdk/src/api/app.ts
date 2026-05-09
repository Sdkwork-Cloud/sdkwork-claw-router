import { backendApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { AdminAppCreateRequest, AdminAppListRequest, AdminAppUpdateRequest, CreateAppResult, DeleteAppResult, DisableAppResult, EnableAppResult, FetchAppResult, FetchAppsResult, OfflineAppResult, OperationRequest, PublishAppResult, UpdateAppResult } from '../types';


export class AppApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

/** Create app */
  async createApp(body: AdminAppCreateRequest, xRequestId?: string): Promise<CreateAppResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.post<CreateAppResult>(backendApiPath(`/app`), body, undefined, requestHeaders, 'application/json');
  }

/** List apps */
  async fetchApps(body?: AdminAppListRequest, xRequestId?: string): Promise<FetchAppsResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.post<FetchAppsResult>(backendApiPath(`/app/list`), body, undefined, requestHeaders, 'application/json');
  }

/** Delete app */
  async deleteApp(appId: string | number, xRequestId?: string): Promise<DeleteAppResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.delete<DeleteAppResult>(backendApiPath(`/app/${appId}`), undefined, requestHeaders);
  }

/** List app */
  async fetchApp(appId: string | number, xRequestId?: string): Promise<FetchAppResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.get<FetchAppResult>(backendApiPath(`/app/${appId}`), undefined, requestHeaders);
  }

/** Update app */
  async updateApp(appId: string | number, body: AdminAppUpdateRequest, xRequestId?: string): Promise<UpdateAppResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.put<UpdateAppResult>(backendApiPath(`/app/${appId}`), body, undefined, requestHeaders, 'application/json');
  }

/** Disable app */
  async disableApp(appId: string | number, body?: OperationRequest, xRequestId?: string): Promise<DisableAppResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.post<DisableAppResult>(backendApiPath(`/app/${appId}/disable`), body, undefined, requestHeaders, 'application/json');
  }

/** Enable app */
  async enableApp(appId: string | number, body?: OperationRequest, xRequestId?: string): Promise<EnableAppResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.post<EnableAppResult>(backendApiPath(`/app/${appId}/enable`), body, undefined, requestHeaders, 'application/json');
  }

/** Offline app */
  async offlineApp(appId: string | number, body?: OperationRequest, xRequestId?: string): Promise<OfflineAppResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.post<OfflineAppResult>(backendApiPath(`/app/${appId}/offline`), body, undefined, requestHeaders, 'application/json');
  }

/** Publish app */
  async publishApp(appId: string | number, body?: OperationRequest, xRequestId?: string): Promise<PublishAppResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.post<PublishAppResult>(backendApiPath(`/app/${appId}/publish`), body, undefined, requestHeaders, 'application/json');
  }
}

export function createAppApi(client: HttpClient): AppApi {
  return new AppApi(client);
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
