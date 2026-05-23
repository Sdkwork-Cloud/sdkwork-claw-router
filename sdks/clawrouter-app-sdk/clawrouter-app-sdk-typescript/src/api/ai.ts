import { appApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { CreateRoutingChannelRequest, DashboardOverviewRetrieveResult, GatewayTracesListResult, GenerationListResult, ModelRankingsListResult, ModelsListResult, ModelVendorsListResult, ProvidersListResult, RoutingApiKeysListResult, RoutingChannelsCreateResult, RoutingChannelsDeleteResult, RoutingChannelsListResult, RoutingChannelsStatusUpdateResult, RoutingChannelsUpdateResult, RoutingChannelsVerifyResult, RoutingRequestTracesListResult, RoutingStrategyListResult, RoutingStrategyUpdateResult, RoutingUsageListResult, SetRoutingChannelStatusRequest, UpdateRoutingChannelRequest, UpdateRoutingStrategyRequest, UsageLogsListResult } from '../types';


export interface AiUsageLogsListParams {
  page?: number;
  pageSize?: number;
  q?: string;
  status?: string;
  startTime?: string;
  endTime?: string;
}

export class AiUsageLogsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List logs */
  async list(params?: AiUsageLogsListParams): Promise<UsageLogsListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'start_time', value: params?.startTime, style: 'form', explode: true, allowReserved: false },
      { name: 'end_time', value: params?.endTime, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<UsageLogsListResult>(appendQueryString(appApiPath(`/ai/usage/logs`), query));
  }
}

export class AiUsageApi {
  private client: HttpClient;
  public readonly logs: AiUsageLogsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.logs = new AiUsageLogsApi(client);
  }

}

export class AiRoutingUsageApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List usage data */
  async list(): Promise<RoutingUsageListResult> {
    return this.client.get<RoutingUsageListResult>(appApiPath(`/ai/routing/usage`));
  }
}

export class AiRoutingStrategyApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List strategy */
  async list(): Promise<RoutingStrategyListResult> {
    return this.client.get<RoutingStrategyListResult>(appApiPath(`/ai/routing/strategy`));
  }

/** Update strategy */
  async update(body: UpdateRoutingStrategyRequest): Promise<RoutingStrategyUpdateResult> {
    return this.client.put<RoutingStrategyUpdateResult>(appApiPath(`/ai/routing/strategy`), body, undefined, undefined, 'application/json');
  }
}

export class AiRoutingRequestTracesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List request traces */
  async list(): Promise<RoutingRequestTracesListResult> {
    return this.client.get<RoutingRequestTracesListResult>(appApiPath(`/ai/routing/request_traces`));
  }
}

export interface AiRoutingChannelsStatusUpdateParams {
  xRequestId?: string;
}

export class AiRoutingChannelsStatusApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Set channel status */
  async update(channelId: string, body: SetRoutingChannelStatusRequest, params?: AiRoutingChannelsStatusUpdateParams): Promise<RoutingChannelsStatusUpdateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': { value: params?.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.put<RoutingChannelsStatusUpdateResult>(appApiPath(`/ai/routing/channels/${serializePathParameter(channelId, { name: 'channelId', style: 'simple', explode: false })}/status`), body, undefined, requestHeaders, 'application/json');
  }
}

export interface AiRoutingChannelsCreateParams {
  xRequestId?: string;
}

export interface AiRoutingChannelsUpdateParams {
  xRequestId?: string;
}

export interface AiRoutingChannelsVerifyParams {
  xRequestId?: string;
}

export class AiRoutingChannelsApi {
  private client: HttpClient;
  public readonly status: AiRoutingChannelsStatusApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.status = new AiRoutingChannelsStatusApi(client);
  }


/** List channels */
  async list(): Promise<RoutingChannelsListResult> {
    return this.client.get<RoutingChannelsListResult>(appApiPath(`/ai/routing/channels`));
  }

/** Create channel */
  async create(body: CreateRoutingChannelRequest, params?: AiRoutingChannelsCreateParams): Promise<RoutingChannelsCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': { value: params?.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<RoutingChannelsCreateResult>(appApiPath(`/ai/routing/channels`), body, undefined, requestHeaders, 'application/json');
  }

/** Delete channel */
  async delete(channelId: string): Promise<RoutingChannelsDeleteResult> {
    return this.client.delete<RoutingChannelsDeleteResult>(appApiPath(`/ai/routing/channels/${serializePathParameter(channelId, { name: 'channelId', style: 'simple', explode: false })}`));
  }

/** Update channel */
  async update(channelId: string, body: UpdateRoutingChannelRequest, params?: AiRoutingChannelsUpdateParams): Promise<RoutingChannelsUpdateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': { value: params?.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.put<RoutingChannelsUpdateResult>(appApiPath(`/ai/routing/channels/${serializePathParameter(channelId, { name: 'channelId', style: 'simple', explode: false })}`), body, undefined, requestHeaders, 'application/json');
  }

/** Test channel */
  async verify(channelId: string, params?: AiRoutingChannelsVerifyParams): Promise<RoutingChannelsVerifyResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': { value: params?.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<RoutingChannelsVerifyResult>(appApiPath(`/ai/routing/channels/${serializePathParameter(channelId, { name: 'channelId', style: 'simple', explode: false })}/verify`), undefined, undefined, requestHeaders);
  }
}

export class AiRoutingApiKeysApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List API keys */
  async list(): Promise<RoutingApiKeysListResult> {
    return this.client.get<RoutingApiKeysListResult>(appApiPath(`/ai/routing/api_keys`));
  }
}

export class AiRoutingApi {
  private client: HttpClient;
  public readonly apiKeys: AiRoutingApiKeysApi;
  public readonly channels: AiRoutingChannelsApi;
  public readonly requestTraces: AiRoutingRequestTracesApi;
  public readonly strategy: AiRoutingStrategyApi;
  public readonly usage: AiRoutingUsageApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.apiKeys = new AiRoutingApiKeysApi(client);
    this.channels = new AiRoutingChannelsApi(client);
    this.requestTraces = new AiRoutingRequestTracesApi(client);
    this.strategy = new AiRoutingStrategyApi(client);
    this.usage = new AiRoutingUsageApi(client);
  }

}

export class AiProvidersApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List providers */
  async list(): Promise<ProvidersListResult> {
    return this.client.get<ProvidersListResult>(appApiPath(`/ai/providers`));
  }
}

export interface AiModelsListParams {
  billingMeter?: string;
  vendorCode?: string;
  vendorCodes?: string[];
  modalities?: string[];
  capabilities?: string[];
  categories?: string[];
  groups?: string[];
  q?: string;
  limit?: number;
}

export class AiModelsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List models */
  async list(params?: AiModelsListParams): Promise<ModelsListResult> {
    const query = buildQueryString([
      { name: 'billing_meter', value: params?.billingMeter, style: 'form', explode: true, allowReserved: false },
      { name: 'vendor_code', value: params?.vendorCode, style: 'form', explode: true, allowReserved: false },
      { name: 'vendor_codes', value: params?.vendorCodes, style: 'form', explode: false, allowReserved: false },
      { name: 'modalities', value: params?.modalities, style: 'form', explode: false, allowReserved: false },
      { name: 'capabilities', value: params?.capabilities, style: 'form', explode: false, allowReserved: false },
      { name: 'categories', value: params?.categories, style: 'form', explode: false, allowReserved: false },
      { name: 'groups', value: params?.groups, style: 'form', explode: false, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<ModelsListResult>(appendQueryString(appApiPath(`/ai/models`), query));
  }
}

export class AiModelVendorsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List ranking vendor filters */
  async list(): Promise<ModelVendorsListResult> {
    return this.client.get<ModelVendorsListResult>(appApiPath(`/ai/model_vendors`));
  }
}

export interface AiModelRankingsListParams {
  rankScope?: string;
  vendorCode?: string;
  modality?: string;
  q?: string;
  limit?: number;
}

export class AiModelRankingsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List model rankings */
  async list(params?: AiModelRankingsListParams): Promise<ModelRankingsListResult> {
    const query = buildQueryString([
      { name: 'rank_scope', value: params?.rankScope, style: 'form', explode: true, allowReserved: false },
      { name: 'vendor_code', value: params?.vendorCode, style: 'form', explode: true, allowReserved: false },
      { name: 'modality', value: params?.modality, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<ModelRankingsListResult>(appendQueryString(appApiPath(`/ai/model_rankings`), query));
  }
}

export class AiGenerationApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List generation history */
  async list(): Promise<GenerationListResult> {
    return this.client.get<GenerationListResult>(appApiPath(`/ai/generations`));
  }
}

export class AiGatewayTracesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List traces */
  async list(): Promise<GatewayTracesListResult> {
    return this.client.get<GatewayTracesListResult>(appApiPath(`/ai/gateway/traces`));
  }
}

export class AiGatewayApi {
  private client: HttpClient;
  public readonly traces: AiGatewayTracesApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.traces = new AiGatewayTracesApi(client);
  }

}

export interface AiDashboardOverviewRetrieveParams {
  timeRange?: 'hourly' | 'daily' | 'monthly' | 'yearly';
  startTime?: string;
  endTime?: string;
}

export class AiDashboardOverviewApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List dashboard overview */
  async retrieve(params?: AiDashboardOverviewRetrieveParams): Promise<DashboardOverviewRetrieveResult> {
    const query = buildQueryString([
      { name: 'time_range', value: params?.timeRange, style: 'form', explode: true, allowReserved: false },
      { name: 'start_time', value: params?.startTime, style: 'form', explode: true, allowReserved: false },
      { name: 'end_time', value: params?.endTime, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<DashboardOverviewRetrieveResult>(appendQueryString(appApiPath(`/ai/dashboard/overview`), query));
  }
}

export class AiDashboardApi {
  private client: HttpClient;
  public readonly overview: AiDashboardOverviewApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.overview = new AiDashboardOverviewApi(client);
  }

}

export class AiApi {
  private client: HttpClient;
  public readonly dashboard: AiDashboardApi;
  public readonly gateway: AiGatewayApi;
  public readonly generation: AiGenerationApi;
  public readonly modelRankings: AiModelRankingsApi;
  public readonly modelVendors: AiModelVendorsApi;
  public readonly models: AiModelsApi;
  public readonly providers: AiProvidersApi;
  public readonly routing: AiRoutingApi;
  public readonly usage: AiUsageApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.dashboard = new AiDashboardApi(client);
    this.gateway = new AiGatewayApi(client);
    this.generation = new AiGenerationApi(client);
    this.modelRankings = new AiModelRankingsApi(client);
    this.modelVendors = new AiModelVendorsApi(client);
    this.models = new AiModelsApi(client);
    this.providers = new AiProvidersApi(client);
    this.routing = new AiRoutingApi(client);
    this.usage = new AiUsageApi(client);
  }

}

export function createAiApi(client: HttpClient): AiApi {
  return new AiApi(client);
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
