import { appApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { CreateApiKeyRequest, CreateChannelResult, CreateKeyResult, CreateRoutingChannelRequest, DeleteChannelResult, FetchApiKeysResult, FetchChannelsResult, FetchDashboardDataResult, FetchDashboardOverviewResult, FetchKeysResult, FetchLogsResult, FetchModelRankingsResult, FetchModelsResult, FetchModelVendorsResult, FetchProvidersResult, FetchRequestTracesResult, FetchStrategyResult, FetchTracesResult, FetchUsageDataResult, OperationRequest, SetChannelStatusResult, SetRoutingChannelStatusRequest, TestChannelResult, UpdateChannelResult, UpdateRoutingChannelRequest, UpdateRoutingStrategyRequest, UpdateStrategyResult } from '../types';


export class RouterApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

/** List keys */
  async fetchKeys(pageNo?: number, pageSize?: number, keyword?: string, status?: string, startTime?: string, endTime?: string): Promise<FetchKeysResult> {
    const query = buildQueryString([
      { name: 'pageNo', value: pageNo, style: 'form', explode: true, allowReserved: false },
      { name: 'pageSize', value: pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'keyword', value: keyword, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: status, style: 'form', explode: true, allowReserved: false },
      { name: 'startTime', value: startTime, style: 'form', explode: true, allowReserved: false },
      { name: 'endTime', value: endTime, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<FetchKeysResult>(appendQueryString(appApiPath(`/router/api-keys`), query));
  }

/** Create key */
  async createKey(body: CreateApiKeyRequest, idempotencyKey: string, xRequestId?: string): Promise<CreateKeyResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': idempotencyKey,
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.post<CreateKeyResult>(appApiPath(`/router/api-keys`), body, undefined, requestHeaders, 'application/json');
  }

/** List dashboard overview */
  async fetchDashboardOverview(pageNo?: number, pageSize?: number, keyword?: string, status?: string, startTime?: string, endTime?: string): Promise<FetchDashboardOverviewResult> {
    const query = buildQueryString([
      { name: 'pageNo', value: pageNo, style: 'form', explode: true, allowReserved: false },
      { name: 'pageSize', value: pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'keyword', value: keyword, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: status, style: 'form', explode: true, allowReserved: false },
      { name: 'startTime', value: startTime, style: 'form', explode: true, allowReserved: false },
      { name: 'endTime', value: endTime, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<FetchDashboardOverviewResult>(appendQueryString(appApiPath(`/router/dashboard/overview`), query));
  }

/** List traces */
  async fetchTraces(pageNo?: number, pageSize?: number, keyword?: string, status?: string, startTime?: string, endTime?: string): Promise<FetchTracesResult> {
    const query = buildQueryString([
      { name: 'pageNo', value: pageNo, style: 'form', explode: true, allowReserved: false },
      { name: 'pageSize', value: pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'keyword', value: keyword, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: status, style: 'form', explode: true, allowReserved: false },
      { name: 'startTime', value: startTime, style: 'form', explode: true, allowReserved: false },
      { name: 'endTime', value: endTime, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<FetchTracesResult>(appendQueryString(appApiPath(`/router/gateway/traces`), query));
  }

/** List model rankings */
  async fetchModelRankings(rankScope?: string, vendorCode?: string, modality?: string, searchQuery?: string, limit?: number): Promise<FetchModelRankingsResult> {
    const query = buildQueryString([
      { name: 'rankScope', value: rankScope, style: 'form', explode: true, allowReserved: false },
      { name: 'vendorCode', value: vendorCode, style: 'form', explode: true, allowReserved: false },
      { name: 'modality', value: modality, style: 'form', explode: true, allowReserved: false },
      { name: 'searchQuery', value: searchQuery, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<FetchModelRankingsResult>(appendQueryString(appApiPath(`/router/model-rankings`), query));
  }

/** List ranking vendor filters */
  async fetchModelVendors(): Promise<FetchModelVendorsResult> {
    return this.client.get<FetchModelVendorsResult>(appApiPath(`/router/model-vendors`));
  }

/** List models */
  async fetchModels(billingMeter?: string, vendorCode?: string, vendorCodes?: string, modalities?: string, capabilities?: string, categories?: string, groups?: string, searchQuery?: string, limit?: number): Promise<FetchModelsResult> {
    const query = buildQueryString([
      { name: 'billingMeter', value: billingMeter, style: 'form', explode: true, allowReserved: false },
      { name: 'vendorCode', value: vendorCode, style: 'form', explode: true, allowReserved: false },
      { name: 'vendorCodes', value: vendorCodes, style: 'form', explode: true, allowReserved: false },
      { name: 'modalities', value: modalities, style: 'form', explode: true, allowReserved: false },
      { name: 'capabilities', value: capabilities, style: 'form', explode: true, allowReserved: false },
      { name: 'categories', value: categories, style: 'form', explode: true, allowReserved: false },
      { name: 'groups', value: groups, style: 'form', explode: true, allowReserved: false },
      { name: 'searchQuery', value: searchQuery, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<FetchModelsResult>(appendQueryString(appApiPath(`/router/models`), query));
  }

/** List providers */
  async fetchProviders(pageNo?: number, pageSize?: number, keyword?: string, status?: string, startTime?: string, endTime?: string): Promise<FetchProvidersResult> {
    const query = buildQueryString([
      { name: 'pageNo', value: pageNo, style: 'form', explode: true, allowReserved: false },
      { name: 'pageSize', value: pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'keyword', value: keyword, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: status, style: 'form', explode: true, allowReserved: false },
      { name: 'startTime', value: startTime, style: 'form', explode: true, allowReserved: false },
      { name: 'endTime', value: endTime, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<FetchProvidersResult>(appendQueryString(appApiPath(`/router/providers`), query));
  }

/** List API keys */
  async fetchApiKeys(pageNo?: number, pageSize?: number, keyword?: string, status?: string, startTime?: string, endTime?: string): Promise<FetchApiKeysResult> {
    const query = buildQueryString([
      { name: 'pageNo', value: pageNo, style: 'form', explode: true, allowReserved: false },
      { name: 'pageSize', value: pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'keyword', value: keyword, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: status, style: 'form', explode: true, allowReserved: false },
      { name: 'startTime', value: startTime, style: 'form', explode: true, allowReserved: false },
      { name: 'endTime', value: endTime, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<FetchApiKeysResult>(appendQueryString(appApiPath(`/router/routing/api-keys`), query));
  }

/** List channels */
  async fetchChannels(pageNo?: number, pageSize?: number, keyword?: string, status?: string, startTime?: string, endTime?: string): Promise<FetchChannelsResult> {
    const query = buildQueryString([
      { name: 'pageNo', value: pageNo, style: 'form', explode: true, allowReserved: false },
      { name: 'pageSize', value: pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'keyword', value: keyword, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: status, style: 'form', explode: true, allowReserved: false },
      { name: 'startTime', value: startTime, style: 'form', explode: true, allowReserved: false },
      { name: 'endTime', value: endTime, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<FetchChannelsResult>(appendQueryString(appApiPath(`/router/routing/channels`), query));
  }

/** Create channel */
  async createChannel(body: CreateRoutingChannelRequest, xRequestId?: string): Promise<CreateChannelResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.post<CreateChannelResult>(appApiPath(`/router/routing/channels`), body, undefined, requestHeaders, 'application/json');
  }

/** Delete channel */
  async deleteChannel(channelId: string | number): Promise<DeleteChannelResult> {
    return this.client.delete<DeleteChannelResult>(appApiPath(`/router/routing/channels/${channelId}`));
  }

/** Update channel */
  async updateChannel(channelId: string | number, body: UpdateRoutingChannelRequest, xRequestId?: string): Promise<UpdateChannelResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.put<UpdateChannelResult>(appApiPath(`/router/routing/channels/${channelId}`), body, undefined, requestHeaders, 'application/json');
  }

/** Set channel status */
  async setChannelStatus(channelId: string | number, body: SetRoutingChannelStatusRequest, xRequestId?: string): Promise<SetChannelStatusResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.put<SetChannelStatusResult>(appApiPath(`/router/routing/channels/${channelId}/status`), body, undefined, requestHeaders, 'application/json');
  }

/** Test channel */
  async testChannel(channelId: string | number, body?: OperationRequest, xRequestId?: string): Promise<TestChannelResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.post<TestChannelResult>(appApiPath(`/router/routing/channels/${channelId}/test`), body, undefined, requestHeaders, 'application/json');
  }

/** List request traces */
  async fetchRequestTraces(pageNo?: number, pageSize?: number, keyword?: string, status?: string, startTime?: string, endTime?: string): Promise<FetchRequestTracesResult> {
    const query = buildQueryString([
      { name: 'pageNo', value: pageNo, style: 'form', explode: true, allowReserved: false },
      { name: 'pageSize', value: pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'keyword', value: keyword, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: status, style: 'form', explode: true, allowReserved: false },
      { name: 'startTime', value: startTime, style: 'form', explode: true, allowReserved: false },
      { name: 'endTime', value: endTime, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<FetchRequestTracesResult>(appendQueryString(appApiPath(`/router/routing/request-traces`), query));
  }

/** List strategy */
  async fetchStrategy(pageNo?: number, pageSize?: number, keyword?: string, status?: string, startTime?: string, endTime?: string): Promise<FetchStrategyResult> {
    const query = buildQueryString([
      { name: 'pageNo', value: pageNo, style: 'form', explode: true, allowReserved: false },
      { name: 'pageSize', value: pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'keyword', value: keyword, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: status, style: 'form', explode: true, allowReserved: false },
      { name: 'startTime', value: startTime, style: 'form', explode: true, allowReserved: false },
      { name: 'endTime', value: endTime, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<FetchStrategyResult>(appendQueryString(appApiPath(`/router/routing/strategy`), query));
  }

/** Update strategy */
  async updateStrategy(body: UpdateRoutingStrategyRequest): Promise<UpdateStrategyResult> {
    return this.client.put<UpdateStrategyResult>(appApiPath(`/router/routing/strategy`), body, undefined, undefined, 'application/json');
  }

/** List usage data */
  async fetchUsageData(pageNo?: number, pageSize?: number, keyword?: string, status?: string, startTime?: string, endTime?: string): Promise<FetchUsageDataResult> {
    const query = buildQueryString([
      { name: 'pageNo', value: pageNo, style: 'form', explode: true, allowReserved: false },
      { name: 'pageSize', value: pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'keyword', value: keyword, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: status, style: 'form', explode: true, allowReserved: false },
      { name: 'startTime', value: startTime, style: 'form', explode: true, allowReserved: false },
      { name: 'endTime', value: endTime, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<FetchUsageDataResult>(appendQueryString(appApiPath(`/router/routing/usage`), query));
  }

/** List dashboard data */
  async fetchDashboardData(year?: number): Promise<FetchDashboardDataResult> {
    const query = buildQueryString([
      { name: 'year', value: year, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<FetchDashboardDataResult>(appendQueryString(appApiPath(`/router/settlements/dashboard`), query));
  }

/** List logs */
  async fetchLogs(pageNo?: number, pageSize?: number, keyword?: string, status?: string, startTime?: string, endTime?: string): Promise<FetchLogsResult> {
    const query = buildQueryString([
      { name: 'pageNo', value: pageNo, style: 'form', explode: true, allowReserved: false },
      { name: 'pageSize', value: pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'keyword', value: keyword, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: status, style: 'form', explode: true, allowReserved: false },
      { name: 'startTime', value: startTime, style: 'form', explode: true, allowReserved: false },
      { name: 'endTime', value: endTime, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<FetchLogsResult>(appendQueryString(appApiPath(`/router/usage/logs`), query));
  }
}

export function createRouterApi(client: HttpClient): RouterApi {
  return new RouterApi(client);
}

function appendQueryString(path: string, rawQueryString: string): string {
  const query = rawQueryString.replace(/^\?+/, '');
  if (!query) {
    return path;
  }
  return path.includes('?') ? `${path}&${query}` : `${path}?${query}`;
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
