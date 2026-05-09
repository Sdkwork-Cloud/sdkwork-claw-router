import { backendApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { AddChannelResult, AdminChannelCreateRequest, AdminChannelListRequest, AdminChannelUpdateRequest, OperationRequest, PlusApiResult, TestChannelResult, UpdateChannelResult } from '../types';


export class ChannelApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

/** Create channel */
  async add(body: AdminChannelCreateRequest, xRequestId?: string): Promise<AddChannelResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.post<AddChannelResult>(backendApiPath(`/channel`), body, undefined, requestHeaders, 'application/json');
  }

/** Update channel */
  async updateChannel(body: AdminChannelUpdateRequest, xRequestId?: string): Promise<UpdateChannelResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.put<UpdateChannelResult>(backendApiPath(`/channel`), body, undefined, requestHeaders, 'application/json');
  }

/** List channels */
  async fetchChannels(body: AdminChannelListRequest): Promise<PlusApiResult> {
    return this.client.post<PlusApiResult>(backendApiPath(`/channel/list`), body, undefined, undefined, 'application/json');
  }

/** Delete channel */
  async deleteChannel(channelId: string | number): Promise<PlusApiResult> {
    return this.client.delete<PlusApiResult>(backendApiPath(`/channel/${channelId}`));
  }

/** Test channel */
  async test(channelId: string | number, body?: OperationRequest, xRequestId?: string): Promise<TestChannelResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.post<TestChannelResult>(backendApiPath(`/channel/${channelId}/test`), body, undefined, requestHeaders, 'application/json');
  }
}

export function createChannelApi(client: HttpClient): ChannelApi {
  return new ChannelApi(client);
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
