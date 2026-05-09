import { appApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { AppSkillConfigRequest, DisableSkillResult, EnableSkillResult, GetMySkillsResult, GetSkillByIdResult, GetSkillsResult, OperationRequest, SkillsGetCategoriesResult, UpdateSkillConfigResult } from '../types';


export class SkillApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

/** Get skills */
  async getSkills(pageNo?: number, pageSize?: number, keyword?: string, status?: string, startTime?: string, endTime?: string): Promise<GetSkillsResult> {
    const query = buildQueryString([
      { name: 'pageNo', value: pageNo, style: 'form', explode: true, allowReserved: false },
      { name: 'pageSize', value: pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'keyword', value: keyword, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: status, style: 'form', explode: true, allowReserved: false },
      { name: 'startTime', value: startTime, style: 'form', explode: true, allowReserved: false },
      { name: 'endTime', value: endTime, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<GetSkillsResult>(appendQueryString(appApiPath(`/skills`), query));
  }

/** Get categories */
  async skillsGetCategories(pageNo?: number, pageSize?: number, keyword?: string, status?: string, startTime?: string, endTime?: string): Promise<SkillsGetCategoriesResult> {
    const query = buildQueryString([
      { name: 'pageNo', value: pageNo, style: 'form', explode: true, allowReserved: false },
      { name: 'pageSize', value: pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'keyword', value: keyword, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: status, style: 'form', explode: true, allowReserved: false },
      { name: 'startTime', value: startTime, style: 'form', explode: true, allowReserved: false },
      { name: 'endTime', value: endTime, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<SkillsGetCategoriesResult>(appendQueryString(appApiPath(`/skills/categories`), query));
  }

/** Get my skills */
  async getMySkills(pageNo?: number, pageSize?: number, keyword?: string, status?: string, startTime?: string, endTime?: string): Promise<GetMySkillsResult> {
    const query = buildQueryString([
      { name: 'pageNo', value: pageNo, style: 'form', explode: true, allowReserved: false },
      { name: 'pageSize', value: pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'keyword', value: keyword, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: status, style: 'form', explode: true, allowReserved: false },
      { name: 'startTime', value: startTime, style: 'form', explode: true, allowReserved: false },
      { name: 'endTime', value: endTime, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<GetMySkillsResult>(appendQueryString(appApiPath(`/skills/my`), query));
  }

/** Get skill by ID */
  async getSkillById(skillId: string | number, pageNo?: number, pageSize?: number, keyword?: string, status?: string, startTime?: string, endTime?: string): Promise<GetSkillByIdResult> {
    const query = buildQueryString([
      { name: 'pageNo', value: pageNo, style: 'form', explode: true, allowReserved: false },
      { name: 'pageSize', value: pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'keyword', value: keyword, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: status, style: 'form', explode: true, allowReserved: false },
      { name: 'startTime', value: startTime, style: 'form', explode: true, allowReserved: false },
      { name: 'endTime', value: endTime, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<GetSkillByIdResult>(appendQueryString(appApiPath(`/skills/${skillId}`), query));
  }

/** Update skill config */
  async updateSkillConfig(skillId: string | number, body: AppSkillConfigRequest, xRequestId?: string): Promise<UpdateSkillConfigResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.put<UpdateSkillConfigResult>(appApiPath(`/skills/${skillId}/config`), body, undefined, requestHeaders, 'application/json');
  }

/** Disable skill */
  async disableSkill(skillId: string | number, body?: OperationRequest, xRequestId?: string): Promise<DisableSkillResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.post<DisableSkillResult>(appApiPath(`/skills/${skillId}/disable`), body, undefined, requestHeaders, 'application/json');
  }

/** Enable skill */
  async enableSkill(skillId: string | number, body: AppSkillConfigRequest, xRequestId?: string): Promise<EnableSkillResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.post<EnableSkillResult>(appApiPath(`/skills/${skillId}/enable`), body, undefined, requestHeaders, 'application/json');
  }
}

export function createSkillApi(client: HttpClient): SkillApi {
  return new SkillApi(client);
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
