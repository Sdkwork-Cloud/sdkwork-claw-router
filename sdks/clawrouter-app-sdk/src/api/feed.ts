import { appApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { CheckForumFeedCollectedResult, CollectForumFeedResult, CreateForumFeedResult, DeleteForumFeedResult, FetchCategoryForumFeedsResult, FetchForumFeedCategoriesResult, FetchForumFeedDetailResult, FetchForumFeedsResult, FetchHotForumFeedsResult, FetchMostLikedForumFeedsResult, FetchMostViewedForumFeedsResult, FetchRecommendedForumFeedsResult, FetchTopForumFeedsResult, ForumCollectFeedRequest, ForumCreateFeedRequest, LikeForumFeedResult, OperationRequest, SearchForumFeedsResult, ShareForumFeedResult, UncollectForumFeedResult, UnlikeForumFeedResult } from '../types';


export class FeedApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

/** Create forum feed */
  async createForum(body: ForumCreateFeedRequest, xRequestId?: string): Promise<CreateForumFeedResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.post<CreateForumFeedResult>(appApiPath(`/feeds`), body, undefined, requestHeaders, 'application/json');
  }

/** List forum feed categories */
  async fetchForumFeedCategories(): Promise<FetchForumFeedCategoriesResult> {
    return this.client.get<FetchForumFeedCategoriesResult>(appApiPath(`/feeds/categories`));
  }

/** List category forum feeds */
  async fetchCategoryForumFeeds(categoryId: string | number, keyword?: string, page?: number, size?: number, limit?: number): Promise<FetchCategoryForumFeedsResult> {
    const query = buildQueryString([
      { name: 'keyword', value: keyword, style: 'form', explode: true, allowReserved: false },
      { name: 'page', value: page, style: 'form', explode: true, allowReserved: false },
      { name: 'size', value: size, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<FetchCategoryForumFeedsResult>(appendQueryString(appApiPath(`/feeds/category/${categoryId}`), query));
  }

/** Check forum feed collected */
  async checkForumFeedCollected(feedId: string | number): Promise<CheckForumFeedCollectedResult> {
    return this.client.get<CheckForumFeedCollectedResult>(appApiPath(`/feeds/check-collected/${feedId}`));
  }

/** Collect forum feed */
  async collectForum(feedId: string | number, body?: ForumCollectFeedRequest, xRequestId?: string): Promise<CollectForumFeedResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.post<CollectForumFeedResult>(appApiPath(`/feeds/collect/${feedId}`), body, undefined, requestHeaders, 'application/json');
  }

/** List forum feed detail */
  async fetchForumFeedDetail(feedId: string | number): Promise<FetchForumFeedDetailResult> {
    return this.client.get<FetchForumFeedDetailResult>(appApiPath(`/feeds/detail/${feedId}`));
  }

/** List hot forum feeds */
  async fetchHotForumFeeds(keyword?: string, page?: number, size?: number, limit?: number): Promise<FetchHotForumFeedsResult> {
    const query = buildQueryString([
      { name: 'keyword', value: keyword, style: 'form', explode: true, allowReserved: false },
      { name: 'page', value: page, style: 'form', explode: true, allowReserved: false },
      { name: 'size', value: size, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<FetchHotForumFeedsResult>(appendQueryString(appApiPath(`/feeds/hot`), query));
  }

/** Like forum feed */
  async likeForum(feedId: string | number, body?: OperationRequest, xRequestId?: string): Promise<LikeForumFeedResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.post<LikeForumFeedResult>(appApiPath(`/feeds/like/${feedId}`), body, undefined, requestHeaders, 'application/json');
  }

/** List forum feeds */
  async fetchForumFeeds(feedType?: 'hot' | 'recommend' | 'top' | 'most-viewed' | 'most-liked', contentType?: 'feeds', keyword?: string, authorId?: number, categoryId?: number, page?: number, size?: number, limit?: number): Promise<FetchForumFeedsResult> {
    const query = buildQueryString([
      { name: 'feedType', value: feedType, style: 'form', explode: true, allowReserved: false },
      { name: 'contentType', value: contentType, style: 'form', explode: true, allowReserved: false },
      { name: 'keyword', value: keyword, style: 'form', explode: true, allowReserved: false },
      { name: 'authorId', value: authorId, style: 'form', explode: true, allowReserved: false },
      { name: 'categoryId', value: categoryId, style: 'form', explode: true, allowReserved: false },
      { name: 'page', value: page, style: 'form', explode: true, allowReserved: false },
      { name: 'size', value: size, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<FetchForumFeedsResult>(appendQueryString(appApiPath(`/feeds/list`), query));
  }

/** List most liked forum feeds */
  async fetchMostLikedForumFeeds(page?: number, size?: number, limit?: number): Promise<FetchMostLikedForumFeedsResult> {
    const query = buildQueryString([
      { name: 'page', value: page, style: 'form', explode: true, allowReserved: false },
      { name: 'size', value: size, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<FetchMostLikedForumFeedsResult>(appendQueryString(appApiPath(`/feeds/most-liked`), query));
  }

/** List most viewed forum feeds */
  async fetchMostViewedForumFeeds(page?: number, size?: number, limit?: number): Promise<FetchMostViewedForumFeedsResult> {
    const query = buildQueryString([
      { name: 'page', value: page, style: 'form', explode: true, allowReserved: false },
      { name: 'size', value: size, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<FetchMostViewedForumFeedsResult>(appendQueryString(appApiPath(`/feeds/most-viewed`), query));
  }

/** List recommended forum feeds */
  async fetchRecommendedForumFeeds(keyword?: string, page?: number, size?: number, limit?: number): Promise<FetchRecommendedForumFeedsResult> {
    const query = buildQueryString([
      { name: 'keyword', value: keyword, style: 'form', explode: true, allowReserved: false },
      { name: 'page', value: page, style: 'form', explode: true, allowReserved: false },
      { name: 'size', value: size, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<FetchRecommendedForumFeedsResult>(appendQueryString(appApiPath(`/feeds/recommend`), query));
  }

/** List forum feeds */
  async searchForumFeeds(keyword?: string, categoryId?: number, page?: number, size?: number, limit?: number): Promise<SearchForumFeedsResult> {
    const query = buildQueryString([
      { name: 'keyword', value: keyword, style: 'form', explode: true, allowReserved: false },
      { name: 'categoryId', value: categoryId, style: 'form', explode: true, allowReserved: false },
      { name: 'page', value: page, style: 'form', explode: true, allowReserved: false },
      { name: 'size', value: size, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<SearchForumFeedsResult>(appendQueryString(appApiPath(`/feeds/search`), query));
  }

/** Share forum feed */
  async shareForum(feedId: string | number, body?: OperationRequest, xRequestId?: string): Promise<ShareForumFeedResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.post<ShareForumFeedResult>(appApiPath(`/feeds/share/${feedId}`), body, undefined, requestHeaders, 'application/json');
  }

/** List top forum feeds */
  async fetchTopForumFeeds(page?: number, size?: number, limit?: number): Promise<FetchTopForumFeedsResult> {
    const query = buildQueryString([
      { name: 'page', value: page, style: 'form', explode: true, allowReserved: false },
      { name: 'size', value: size, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<FetchTopForumFeedsResult>(appendQueryString(appApiPath(`/feeds/top`), query));
  }

/** Uncollect forum feed */
  async uncollectForum(feedId: string | number, body?: OperationRequest, xRequestId?: string): Promise<UncollectForumFeedResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.post<UncollectForumFeedResult>(appApiPath(`/feeds/uncollect/${feedId}`), body, undefined, requestHeaders, 'application/json');
  }

/** Unlike forum feed */
  async unlikeForum(feedId: string | number, body?: OperationRequest, xRequestId?: string): Promise<UnlikeForumFeedResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.post<UnlikeForumFeedResult>(appApiPath(`/feeds/unlike/${feedId}`), body, undefined, requestHeaders, 'application/json');
  }

/** Delete forum feed */
  async deleteForum(feedId: string | number): Promise<DeleteForumFeedResult> {
    return this.client.delete<DeleteForumFeedResult>(appApiPath(`/feeds/${feedId}`));
  }
}

export function createFeedApi(client: HttpClient): FeedApi {
  return new FeedApi(client);
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
