import { appApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { AppSkillConfigRequest, SkillsCategoriesListResult, SkillsConfigUpdateResult, SkillsDisableResult, SkillsEnableResult, SkillsListResult, SkillsRetrieveResult, UsersCurrentSkillsListResult } from '../types';


export class EcosystemUsersCurrentSkillsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Get my skills */
  async list(): Promise<UsersCurrentSkillsListResult> {
    return this.client.get<UsersCurrentSkillsListResult>(appApiPath(`/ecosystem/users/current/skills`));
  }
}

export class EcosystemUsersCurrentApi {
  private client: HttpClient;
  public readonly skills: EcosystemUsersCurrentSkillsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.skills = new EcosystemUsersCurrentSkillsApi(client);
  }

}

export class EcosystemUsersApi {
  private client: HttpClient;
  public readonly current: EcosystemUsersCurrentApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.current = new EcosystemUsersCurrentApi(client);
  }

}

export class EcosystemSkillsConfigApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Update skill config */
  async update(skillId: string, body: AppSkillConfigRequest): Promise<SkillsConfigUpdateResult> {
    return this.client.put<SkillsConfigUpdateResult>(appApiPath(`/ecosystem/skills/${serializePathParameter(skillId, { name: 'skillId', style: 'simple', explode: false })}/config`), body, undefined, undefined, 'application/json');
  }
}

export class EcosystemSkillsCategoriesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Get categories */
  async list(): Promise<SkillsCategoriesListResult> {
    return this.client.get<SkillsCategoriesListResult>(appApiPath(`/ecosystem/skills/categories`));
  }
}

export interface EcosystemSkillsListParams {
  q?: string;
  page?: string;
  pageSize?: string;
  status?: string;
  startTime?: string;
  endTime?: string;
}

export class EcosystemSkillsApi {
  private client: HttpClient;
  public readonly categories: EcosystemSkillsCategoriesApi;
  public readonly config: EcosystemSkillsConfigApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.categories = new EcosystemSkillsCategoriesApi(client);
    this.config = new EcosystemSkillsConfigApi(client);
  }


/** Get skills */
  async list(params?: EcosystemSkillsListParams): Promise<SkillsListResult> {
    const query = buildQueryString([
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'start_time', value: params?.startTime, style: 'form', explode: true, allowReserved: false },
      { name: 'end_time', value: params?.endTime, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<SkillsListResult>(appendQueryString(appApiPath(`/ecosystem/skills`), query));
  }

/** Get skill by ID */
  async retrieve(skillId: string): Promise<SkillsRetrieveResult> {
    return this.client.get<SkillsRetrieveResult>(appApiPath(`/ecosystem/skills/${serializePathParameter(skillId, { name: 'skillId', style: 'simple', explode: false })}`));
  }

/** Disable skill */
  async disable(skillId: string): Promise<SkillsDisableResult> {
    return this.client.post<SkillsDisableResult>(appApiPath(`/ecosystem/skills/${serializePathParameter(skillId, { name: 'skillId', style: 'simple', explode: false })}/disable`));
  }

/** Enable skill */
  async enable(skillId: string, body: AppSkillConfigRequest): Promise<SkillsEnableResult> {
    return this.client.post<SkillsEnableResult>(appApiPath(`/ecosystem/skills/${serializePathParameter(skillId, { name: 'skillId', style: 'simple', explode: false })}/enable`), body, undefined, undefined, 'application/json');
  }
}

export class EcosystemApi {
  private client: HttpClient;
  public readonly skills: EcosystemSkillsApi;
  public readonly users: EcosystemUsersApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.skills = new EcosystemSkillsApi(client);
    this.users = new EcosystemUsersApi(client);
  }

}

export function createEcosystemApi(client: HttpClient): EcosystemApi {
  return new EcosystemApi(client);
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
