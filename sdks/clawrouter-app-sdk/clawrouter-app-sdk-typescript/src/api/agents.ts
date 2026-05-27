import { appApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { AgentCreateRequest, AgentDefinitionsCreateResult, AgentDefinitionsListResult, AgentDefinitionsRetrieveResult, AgentRunCompleteRequest, AgentRunCreateRequest, AgentRunsCreateResult, AgentRunsListResult, AgentRunsRetrieveResult, AgentRunsSubmitResult, AgentRunStepCompleteRequest, AgentRunStepCreateRequest, AgentRunStepsCreateResult, AgentRunStepsListResult, AgentRunStepsSubmitResult, AgentSessionCreateRequest, AgentSessionsCreateResult, AgentSessionsListResult, AgentSessionsRetrieveResult } from '../types';


export interface AgentsAgentSessionsListParams {
  page?: number;
  pageSize?: number;
}

export interface AgentsAgentSessionsCreateParams {
  idempotencyKey: string;
}

export class AgentsAgentSessionsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Retrieve Playground agent session */
  async retrieve(sessionId: string): Promise<AgentSessionsRetrieveResult> {
    return this.client.get<AgentSessionsRetrieveResult>(appApiPath(`/agents/sessions/${serializePathParameter(sessionId, { name: 'sessionId', style: 'simple', explode: false })}`));
  }

/** List Playground agent sessions */
  async list(agentId: string, params?: AgentsAgentSessionsListParams): Promise<AgentSessionsListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<AgentSessionsListResult>(appendQueryString(appApiPath(`/agents/${serializePathParameter(agentId, { name: 'agentId', style: 'simple', explode: false })}/sessions`), query));
  }

/** Create Playground agent session */
  async create(agentId: string, body: AgentSessionCreateRequest, params: AgentsAgentSessionsCreateParams): Promise<AgentSessionsCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<AgentSessionsCreateResult>(appApiPath(`/agents/${serializePathParameter(agentId, { name: 'agentId', style: 'simple', explode: false })}/sessions`), body, undefined, requestHeaders, 'application/json');
  }
}

export interface AgentsAgentRunStepsListParams {
  page?: number;
  pageSize?: number;
}

export interface AgentsAgentRunStepsCreateParams {
  idempotencyKey: string;
}

export interface AgentsAgentRunStepsSubmitParams {
  idempotencyKey: string;
}

export class AgentsAgentRunStepsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List Playground agent run steps */
  async list(runId: string, params?: AgentsAgentRunStepsListParams): Promise<AgentRunStepsListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<AgentRunStepsListResult>(appendQueryString(appApiPath(`/agents/runs/${serializePathParameter(runId, { name: 'runId', style: 'simple', explode: false })}/steps`), query));
  }

/** Create Playground agent run step */
  async create(runId: string, body: AgentRunStepCreateRequest, params: AgentsAgentRunStepsCreateParams): Promise<AgentRunStepsCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<AgentRunStepsCreateResult>(appApiPath(`/agents/runs/${serializePathParameter(runId, { name: 'runId', style: 'simple', explode: false })}/steps`), body, undefined, requestHeaders, 'application/json');
  }

/** Complete Playground agent run step */
  async submit(runId: string, stepId: string, body: AgentRunStepCompleteRequest, params: AgentsAgentRunStepsSubmitParams): Promise<AgentRunStepsSubmitResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<AgentRunStepsSubmitResult>(appApiPath(`/agents/runs/${serializePathParameter(runId, { name: 'runId', style: 'simple', explode: false })}/steps/${serializePathParameter(stepId, { name: 'stepId', style: 'simple', explode: false })}/complete`), body, undefined, requestHeaders, 'application/json');
  }
}

export interface AgentsAgentRunsSubmitParams {
  idempotencyKey: string;
}

export interface AgentsAgentRunsListParams {
  page?: number;
  pageSize?: number;
}

export interface AgentsAgentRunsCreateParams {
  idempotencyKey: string;
}

export class AgentsAgentRunsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Retrieve Playground agent run */
  async retrieve(runId: string): Promise<AgentRunsRetrieveResult> {
    return this.client.get<AgentRunsRetrieveResult>(appApiPath(`/agents/runs/${serializePathParameter(runId, { name: 'runId', style: 'simple', explode: false })}`));
  }

/** Complete Playground agent run */
  async submit(runId: string, body: AgentRunCompleteRequest, params: AgentsAgentRunsSubmitParams): Promise<AgentRunsSubmitResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<AgentRunsSubmitResult>(appApiPath(`/agents/runs/${serializePathParameter(runId, { name: 'runId', style: 'simple', explode: false })}/complete`), body, undefined, requestHeaders, 'application/json');
  }

/** List Playground agent runs */
  async list(sessionId: string, params?: AgentsAgentRunsListParams): Promise<AgentRunsListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<AgentRunsListResult>(appendQueryString(appApiPath(`/agents/sessions/${serializePathParameter(sessionId, { name: 'sessionId', style: 'simple', explode: false })}/runs`), query));
  }

/** Create Playground agent run */
  async create(sessionId: string, body: AgentRunCreateRequest, params: AgentsAgentRunsCreateParams): Promise<AgentRunsCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<AgentRunsCreateResult>(appApiPath(`/agents/sessions/${serializePathParameter(sessionId, { name: 'sessionId', style: 'simple', explode: false })}/runs`), body, undefined, requestHeaders, 'application/json');
  }
}

export interface AgentsAgentDefinitionsListParams {
  page?: number;
  pageSize?: number;
  q?: string;
}

export interface AgentsAgentDefinitionsCreateParams {
  idempotencyKey: string;
}

export class AgentsAgentDefinitionsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List Playground agent definitions */
  async list(params?: AgentsAgentDefinitionsListParams): Promise<AgentDefinitionsListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<AgentDefinitionsListResult>(appendQueryString(appApiPath(`/agents`), query));
  }

/** Create Playground agent definition */
  async create(body: AgentCreateRequest, params: AgentsAgentDefinitionsCreateParams): Promise<AgentDefinitionsCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<AgentDefinitionsCreateResult>(appApiPath(`/agents`), body, undefined, requestHeaders, 'application/json');
  }

/** Retrieve Playground agent definition */
  async retrieve(agentId: string): Promise<AgentDefinitionsRetrieveResult> {
    return this.client.get<AgentDefinitionsRetrieveResult>(appApiPath(`/agents/${serializePathParameter(agentId, { name: 'agentId', style: 'simple', explode: false })}`));
  }
}

export class AgentsApi {
  private client: HttpClient;
  public readonly agentDefinitions: AgentsAgentDefinitionsApi;
  public readonly agentRuns: AgentsAgentRunsApi;
  public readonly agentRunSteps: AgentsAgentRunStepsApi;
  public readonly agentSessions: AgentsAgentSessionsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.agentDefinitions = new AgentsAgentDefinitionsApi(client);
    this.agentRuns = new AgentsAgentRunsApi(client);
    this.agentRunSteps = new AgentsAgentRunStepsApi(client);
    this.agentSessions = new AgentsAgentSessionsApi(client);
  }

}

export function createAgentsApi(client: HttpClient): AgentsApi {
  return new AgentsApi(client);
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
