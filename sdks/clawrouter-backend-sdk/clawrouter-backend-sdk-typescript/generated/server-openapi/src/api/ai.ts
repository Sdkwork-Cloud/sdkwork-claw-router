import { backendApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { AdminChannelGroupChannelBindingsReplaceRequest, AdminChannelGroupCreateRequest, AdminChannelGroupUpdateRequest, AdminRuntimeRouteExplainRequest, ChannelGroupsChannelBindingsListResult, ChannelGroupsChannelBindingsUpdateResult, ChannelGroupsCreateResult, ChannelGroupsDeleteResult, ChannelGroupsListResult, ChannelGroupsRouteExplainRetrieveResult, ChannelGroupsUpdateResult, RouteExplainCreateResult } from '../types';


export class AiRouteExplainApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List runtime route explain */
  async create(body: AdminRuntimeRouteExplainRequest): Promise<RouteExplainCreateResult> {
    return this.client.post<RouteExplainCreateResult>(backendApiPath(`/ai/route_explain`), body, undefined, undefined, 'application/json');
  }
}

export class AiChannelGroupsRouteExplainApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List group route explain */
  async retrieve(channelGroupId: string): Promise<ChannelGroupsRouteExplainRetrieveResult> {
    return this.client.get<ChannelGroupsRouteExplainRetrieveResult>(backendApiPath(`/ai/channel_groups/${serializePathParameter(channelGroupId, { name: 'channelGroupId', style: 'simple', explode: false })}/route_explain`));
  }
}

export class AiChannelGroupsChannelBindingsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List group channel bindings */
  async list(channelGroupId: string): Promise<ChannelGroupsChannelBindingsListResult> {
    return this.client.get<ChannelGroupsChannelBindingsListResult>(backendApiPath(`/ai/channel_groups/${serializePathParameter(channelGroupId, { name: 'channelGroupId', style: 'simple', explode: false })}/channel_bindings`));
  }

/** Replace group channel bindings */
  async update(channelGroupId: string, body: AdminChannelGroupChannelBindingsReplaceRequest): Promise<ChannelGroupsChannelBindingsUpdateResult> {
    return this.client.put<ChannelGroupsChannelBindingsUpdateResult>(backendApiPath(`/ai/channel_groups/${serializePathParameter(channelGroupId, { name: 'channelGroupId', style: 'simple', explode: false })}/channel_bindings`), body, undefined, undefined, 'application/json');
  }
}

export class AiChannelGroupsApi {
  private client: HttpClient;
  public readonly channelBindings: AiChannelGroupsChannelBindingsApi;
  public readonly routeExplain: AiChannelGroupsRouteExplainApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.channelBindings = new AiChannelGroupsChannelBindingsApi(client);
    this.routeExplain = new AiChannelGroupsRouteExplainApi(client);
  }


/** List groups */
  async list(): Promise<ChannelGroupsListResult> {
    return this.client.get<ChannelGroupsListResult>(backendApiPath(`/ai/channel_groups`));
  }

/** Create group */
  async create(body: AdminChannelGroupCreateRequest): Promise<ChannelGroupsCreateResult> {
    return this.client.post<ChannelGroupsCreateResult>(backendApiPath(`/ai/channel_groups`), body, undefined, undefined, 'application/json');
  }

/** Delete group */
  async delete(channelGroupId: string): Promise<ChannelGroupsDeleteResult> {
    return this.client.delete<ChannelGroupsDeleteResult>(backendApiPath(`/ai/channel_groups/${serializePathParameter(channelGroupId, { name: 'channelGroupId', style: 'simple', explode: false })}`));
  }

/** Update group */
  async update(channelGroupId: string, body: AdminChannelGroupUpdateRequest): Promise<ChannelGroupsUpdateResult> {
    return this.client.patch<ChannelGroupsUpdateResult>(backendApiPath(`/ai/channel_groups/${serializePathParameter(channelGroupId, { name: 'channelGroupId', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
  }
}

export class AiApi {
  private client: HttpClient;
  public readonly channelGroups: AiChannelGroupsApi;
  public readonly routeExplain: AiRouteExplainApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.channelGroups = new AiChannelGroupsApi(client);
    this.routeExplain = new AiRouteExplainApi(client);
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
