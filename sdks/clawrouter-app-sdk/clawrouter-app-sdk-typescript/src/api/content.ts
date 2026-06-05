import { appApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { ApplicationsCreateResult, ApplicationsVideosCreateResult, CommentsCreateResult, CommentsDeleteResult, CommentsLikesCreateResult, CommentsLikesCurrentDeleteResult, CommentsListResult, CommentsPinsCreateResult, CommentsPinsCurrentDeleteResult, CommentsRepliesListResult, CommentsReplyCreateResult, CommentsRetrieveResult, CommentsStatisticsListResult, CourseApplicationCreateRequest, CourseApplicationVideoUploadRequest, CoursesCategoriesListResult, CoursesListResult, CoursesOverviewRetrieveResult, CoursesRetrieveResult, FeedsCategoryRetrieveResult, FeedsCollectionsCreateResult, FeedsCollectionsCurrentDeleteResult, FeedsCollectionsCurrentRetrieveResult, FeedsCreateResult, FeedsDeleteResult, FeedsHotListResult, FeedsLikesCreateResult, FeedsLikesCurrentDeleteResult, FeedsListResult, FeedsMostLikedListResult, FeedsMostViewedListResult, FeedsOverviewRetrieveResult, FeedsRecommendListResult, FeedsRetrieveResult, FeedsSharesCreateResult, FeedsTopListResult, ForumCreateCommentRequest, ForumCreateFeedRequest, ForumReplyCommentRequest, UsersCurrentCommentsListResult } from '../types';


export class ContentApplicationsVideosApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Upload course application video */
  async create(body: CourseApplicationVideoUploadRequest): Promise<ApplicationsVideosCreateResult> {
    return this.client.post<ApplicationsVideosCreateResult>(appApiPath(`/courses/applications/videos`), body, undefined, undefined, 'multipart/form-data');
  }
}

export class ContentApplicationsApi {
  private client: HttpClient;
  public readonly videos: ContentApplicationsVideosApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.videos = new ContentApplicationsVideosApi(client);
  }


/** Create course application */
  async create(body: CourseApplicationCreateRequest): Promise<ApplicationsCreateResult> {
    return this.client.post<ApplicationsCreateResult>(appApiPath(`/courses/applications`), body, undefined, undefined, 'application/json');
  }
}

export class ContentCoursesOverviewApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List course overview */
  async retrieve(): Promise<CoursesOverviewRetrieveResult> {
    return this.client.get<CoursesOverviewRetrieveResult>(appApiPath(`/courses/overview`));
  }
}

export class ContentCoursesCategoriesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List course categories */
  async list(): Promise<CoursesCategoriesListResult> {
    return this.client.get<CoursesCategoriesListResult>(appApiPath(`/courses/categories`));
  }
}

export interface ContentCoursesListParams {
  level?: string;
  category?: string;
  q?: string;
  page?: string;
  pageSize?: string;
}

export class ContentCoursesApi {
  private client: HttpClient;
  public readonly categories: ContentCoursesCategoriesApi;
  public readonly overview: ContentCoursesOverviewApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.categories = new ContentCoursesCategoriesApi(client);
    this.overview = new ContentCoursesOverviewApi(client);
  }


/** List courses */
  async list(params?: ContentCoursesListParams): Promise<CoursesListResult> {
    const query = buildQueryString([
      { name: 'level', value: params?.level, style: 'form', explode: true, allowReserved: false },
      { name: 'category', value: params?.category, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CoursesListResult>(appendQueryString(appApiPath(`/courses`), query));
  }

/** List course detail */
  async retrieve(courseId: string): Promise<CoursesRetrieveResult> {
    return this.client.get<CoursesRetrieveResult>(appApiPath(`/courses/${serializePathParameter(courseId, { name: 'courseId', style: 'simple', explode: false })}`));
  }
}

export interface ContentUsersCurrentCommentsListParams {
  page?: string;
  pageSize?: string;
}

export class ContentUsersCurrentCommentsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List my forum comments */
  async list(params?: ContentUsersCurrentCommentsListParams): Promise<UsersCurrentCommentsListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<UsersCurrentCommentsListResult>(appendQueryString(appApiPath(`/content/users/current/comments`), query));
  }
}

export class ContentUsersCurrentApi {
  private client: HttpClient;
  public readonly comments: ContentUsersCurrentCommentsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.comments = new ContentUsersCurrentCommentsApi(client);
  }

}

export class ContentUsersApi {
  private client: HttpClient;
  public readonly current: ContentUsersCurrentApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.current = new ContentUsersCurrentApi(client);
  }

}

export class ContentFeedsSharesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Share forum feed */
  async create(id: string): Promise<FeedsSharesCreateResult> {
    return this.client.post<FeedsSharesCreateResult>(appApiPath(`/content/feeds/${serializePathParameter(id, { name: 'id', style: 'simple', explode: false })}/shares`));
  }
}

export class ContentFeedsLikesCurrentApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Unlike forum feed */
  async delete(id: string): Promise<FeedsLikesCurrentDeleteResult> {
    return this.client.delete<FeedsLikesCurrentDeleteResult>(appApiPath(`/content/feeds/${serializePathParameter(id, { name: 'id', style: 'simple', explode: false })}/likes/current`));
  }
}

export class ContentFeedsLikesApi {
  private client: HttpClient;
  public readonly current: ContentFeedsLikesCurrentApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.current = new ContentFeedsLikesCurrentApi(client);
  }


/** Like forum feed */
  async create(id: string): Promise<FeedsLikesCreateResult> {
    return this.client.post<FeedsLikesCreateResult>(appApiPath(`/content/feeds/${serializePathParameter(id, { name: 'id', style: 'simple', explode: false })}/likes`));
  }
}

export class ContentFeedsCollectionsCurrentApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Uncollect forum feed */
  async delete(id: string): Promise<FeedsCollectionsCurrentDeleteResult> {
    return this.client.delete<FeedsCollectionsCurrentDeleteResult>(appApiPath(`/content/feeds/${serializePathParameter(id, { name: 'id', style: 'simple', explode: false })}/collections/current`));
  }

/** Check forum feed collected */
  async retrieve(id: string): Promise<FeedsCollectionsCurrentRetrieveResult> {
    return this.client.get<FeedsCollectionsCurrentRetrieveResult>(appApiPath(`/content/feeds/${serializePathParameter(id, { name: 'id', style: 'simple', explode: false })}/collections/current`));
  }
}

export interface ContentFeedsCollectionsCreateParams {
  folderId?: string;
}

export class ContentFeedsCollectionsApi {
  private client: HttpClient;
  public readonly current: ContentFeedsCollectionsCurrentApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.current = new ContentFeedsCollectionsCurrentApi(client);
  }


/** Collect forum feed */
  async create(id: string, params?: ContentFeedsCollectionsCreateParams): Promise<FeedsCollectionsCreateResult> {
    const query = buildQueryString([
      { name: 'folder_id', value: params?.folderId, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.post<FeedsCollectionsCreateResult>(appendQueryString(appApiPath(`/content/feeds/${serializePathParameter(id, { name: 'id', style: 'simple', explode: false })}/collections`), query));
  }
}

export interface ContentFeedsTopListParams {
  limit?: string;
}

export class ContentFeedsTopApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List top forum feeds */
  async list(params?: ContentFeedsTopListParams): Promise<FeedsTopListResult> {
    const query = buildQueryString([
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<FeedsTopListResult>(appendQueryString(appApiPath(`/content/feeds/top`), query));
  }
}

export interface ContentFeedsRecommendListParams {
  limit?: string;
}

export class ContentFeedsRecommendApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List recommended forum feeds */
  async list(params?: ContentFeedsRecommendListParams): Promise<FeedsRecommendListResult> {
    const query = buildQueryString([
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<FeedsRecommendListResult>(appendQueryString(appApiPath(`/content/feeds/recommend`), query));
  }
}

export class ContentFeedsOverviewApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List forum overview */
  async retrieve(): Promise<FeedsOverviewRetrieveResult> {
    return this.client.get<FeedsOverviewRetrieveResult>(appApiPath(`/content/feeds/overview`));
  }
}

export interface ContentFeedsMostViewedListParams {
  limit?: string;
}

export class ContentFeedsMostViewedApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List most viewed forum feeds */
  async list(params?: ContentFeedsMostViewedListParams): Promise<FeedsMostViewedListResult> {
    const query = buildQueryString([
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<FeedsMostViewedListResult>(appendQueryString(appApiPath(`/content/feeds/most_viewed`), query));
  }
}

export interface ContentFeedsMostLikedListParams {
  limit?: string;
}

export class ContentFeedsMostLikedApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List most liked forum feeds */
  async list(params?: ContentFeedsMostLikedListParams): Promise<FeedsMostLikedListResult> {
    const query = buildQueryString([
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<FeedsMostLikedListResult>(appendQueryString(appApiPath(`/content/feeds/most_liked`), query));
  }
}

export interface ContentFeedsHotListParams {
  limit?: string;
}

export class ContentFeedsHotApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List hot forum feeds */
  async list(params?: ContentFeedsHotListParams): Promise<FeedsHotListResult> {
    const query = buildQueryString([
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<FeedsHotListResult>(appendQueryString(appApiPath(`/content/feeds/hot`), query));
  }
}

export interface ContentFeedsCategoryRetrieveParams {
  page?: string;
  pageSize?: string;
}

export class ContentFeedsCategoryApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List category forum feeds */
  async retrieve(categoryId: string, params?: ContentFeedsCategoryRetrieveParams): Promise<FeedsCategoryRetrieveResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<FeedsCategoryRetrieveResult>(appendQueryString(appApiPath(`/content/feeds/category/${serializePathParameter(categoryId, { name: 'categoryId', style: 'simple', explode: false })}`), query));
  }
}

export interface ContentFeedsListParams {
  type_?: 'recommend' | 'hot' | 'top';
  contentType?: 'all' | 'feeds' | 'FEEDS';
  q?: string;
  authorId?: string;
  page?: string;
  pageSize?: string;
}

export class ContentFeedsApi {
  private client: HttpClient;
  public readonly category: ContentFeedsCategoryApi;
  public readonly hot: ContentFeedsHotApi;
  public readonly mostLiked: ContentFeedsMostLikedApi;
  public readonly mostViewed: ContentFeedsMostViewedApi;
  public readonly overview: ContentFeedsOverviewApi;
  public readonly recommend: ContentFeedsRecommendApi;
  public readonly top: ContentFeedsTopApi;
  public readonly collections: ContentFeedsCollectionsApi;
  public readonly likes: ContentFeedsLikesApi;
  public readonly shares: ContentFeedsSharesApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.category = new ContentFeedsCategoryApi(client);
    this.hot = new ContentFeedsHotApi(client);
    this.mostLiked = new ContentFeedsMostLikedApi(client);
    this.mostViewed = new ContentFeedsMostViewedApi(client);
    this.overview = new ContentFeedsOverviewApi(client);
    this.recommend = new ContentFeedsRecommendApi(client);
    this.top = new ContentFeedsTopApi(client);
    this.collections = new ContentFeedsCollectionsApi(client);
    this.likes = new ContentFeedsLikesApi(client);
    this.shares = new ContentFeedsSharesApi(client);
  }


/** List forum feeds */
  async list(params?: ContentFeedsListParams): Promise<FeedsListResult> {
    const query = buildQueryString([
      { name: 'type', value: params?.type_, style: 'form', explode: true, allowReserved: false },
      { name: 'content_type', value: params?.contentType, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'author_id', value: params?.authorId, style: 'form', explode: true, allowReserved: false },
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<FeedsListResult>(appendQueryString(appApiPath(`/content/feeds`), query));
  }

/** Create forum feed */
  async create(body: ForumCreateFeedRequest): Promise<FeedsCreateResult> {
    return this.client.post<FeedsCreateResult>(appApiPath(`/content/feeds`), body, undefined, undefined, 'application/json');
  }

/** Delete forum feed */
  async delete(id: string): Promise<FeedsDeleteResult> {
    return this.client.delete<FeedsDeleteResult>(appApiPath(`/content/feeds/${serializePathParameter(id, { name: 'id', style: 'simple', explode: false })}`));
  }

/** List forum feed detail */
  async retrieve(id: string): Promise<FeedsRetrieveResult> {
    return this.client.get<FeedsRetrieveResult>(appApiPath(`/content/feeds/${serializePathParameter(id, { name: 'id', style: 'simple', explode: false })}`));
  }
}

export interface ContentCommentsRepliesListParams {
  page?: string;
  pageSize?: string;
}

export class ContentCommentsRepliesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List forum comment replies */
  async list(commentId: string, params?: ContentCommentsRepliesListParams): Promise<CommentsRepliesListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CommentsRepliesListResult>(appendQueryString(appApiPath(`/content/comments/${serializePathParameter(commentId, { name: 'commentId', style: 'simple', explode: false })}/replies`), query));
  }

/** Reply forum comment */
  async create(commentId: string, body: ForumReplyCommentRequest): Promise<CommentsReplyCreateResult> {
    return this.client.post<CommentsReplyCreateResult>(appApiPath(`/content/comments/${serializePathParameter(commentId, { name: 'commentId', style: 'simple', explode: false })}/reply`), body, undefined, undefined, 'application/json');
  }
}

export class ContentCommentsPinsCurrentApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Unpin forum comment */
  async delete(commentId: string): Promise<CommentsPinsCurrentDeleteResult> {
    return this.client.delete<CommentsPinsCurrentDeleteResult>(appApiPath(`/content/comments/${serializePathParameter(commentId, { name: 'commentId', style: 'simple', explode: false })}/pins/current`));
  }
}

export class ContentCommentsPinsApi {
  private client: HttpClient;
  public readonly current: ContentCommentsPinsCurrentApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.current = new ContentCommentsPinsCurrentApi(client);
  }


/** Pin forum comment */
  async create(commentId: string): Promise<CommentsPinsCreateResult> {
    return this.client.post<CommentsPinsCreateResult>(appApiPath(`/content/comments/${serializePathParameter(commentId, { name: 'commentId', style: 'simple', explode: false })}/pins`));
  }
}

export class ContentCommentsLikesCurrentApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Unlike forum comment */
  async delete(commentId: string): Promise<CommentsLikesCurrentDeleteResult> {
    return this.client.delete<CommentsLikesCurrentDeleteResult>(appApiPath(`/content/comments/${serializePathParameter(commentId, { name: 'commentId', style: 'simple', explode: false })}/likes/current`));
  }
}

export class ContentCommentsLikesApi {
  private client: HttpClient;
  public readonly current: ContentCommentsLikesCurrentApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.current = new ContentCommentsLikesCurrentApi(client);
  }


/** Like forum comment */
  async create(commentId: string): Promise<CommentsLikesCreateResult> {
    return this.client.post<CommentsLikesCreateResult>(appApiPath(`/content/comments/${serializePathParameter(commentId, { name: 'commentId', style: 'simple', explode: false })}/likes`));
  }
}

export interface ContentCommentsStatisticsListParams {
  contentType: 'feeds' | 'comments' | 'course' | 'courses' | 'FEEDS' | 'COMMENTS' | 'COURSE' | 'COURSES';
  contentId: string;
}

export class ContentCommentsStatisticsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List forum comment statistics */
  async list(params: ContentCommentsStatisticsListParams): Promise<CommentsStatisticsListResult> {
    const query = buildQueryString([
      { name: 'content_type', value: params.contentType, style: 'form', explode: true, allowReserved: false },
      { name: 'content_id', value: params.contentId, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CommentsStatisticsListResult>(appendQueryString(appApiPath(`/content/comments/statistics`), query));
  }
}

export interface ContentCommentsListParams {
  contentType: 'feeds' | 'comments' | 'course' | 'courses' | 'FEEDS' | 'COMMENTS' | 'COURSE' | 'COURSES';
  contentId: string;
  page?: string;
  pageSize?: string;
}

export class ContentCommentsApi {
  private client: HttpClient;
  public readonly statistics: ContentCommentsStatisticsApi;
  public readonly likes: ContentCommentsLikesApi;
  public readonly pins: ContentCommentsPinsApi;
  public readonly replies: ContentCommentsRepliesApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.statistics = new ContentCommentsStatisticsApi(client);
    this.likes = new ContentCommentsLikesApi(client);
    this.pins = new ContentCommentsPinsApi(client);
    this.replies = new ContentCommentsRepliesApi(client);
  }


/** List forum comments */
  async list(params: ContentCommentsListParams): Promise<CommentsListResult> {
    const query = buildQueryString([
      { name: 'content_type', value: params.contentType, style: 'form', explode: true, allowReserved: false },
      { name: 'content_id', value: params.contentId, style: 'form', explode: true, allowReserved: false },
      { name: 'page', value: params.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params.pageSize, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CommentsListResult>(appendQueryString(appApiPath(`/content/comments`), query));
  }

/** Create forum comment */
  async create(body: ForumCreateCommentRequest): Promise<CommentsCreateResult> {
    return this.client.post<CommentsCreateResult>(appApiPath(`/content/comments`), body, undefined, undefined, 'application/json');
  }

/** Delete forum comment */
  async delete(commentId: string): Promise<CommentsDeleteResult> {
    return this.client.delete<CommentsDeleteResult>(appApiPath(`/content/comments/${serializePathParameter(commentId, { name: 'commentId', style: 'simple', explode: false })}`));
  }

/** List forum comment detail */
  async retrieve(commentId: string): Promise<CommentsRetrieveResult> {
    return this.client.get<CommentsRetrieveResult>(appApiPath(`/content/comments/${serializePathParameter(commentId, { name: 'commentId', style: 'simple', explode: false })}`));
  }
}

export class ContentApi {
  private client: HttpClient;
  public readonly comments: ContentCommentsApi;
  public readonly feeds: ContentFeedsApi;
  public readonly users: ContentUsersApi;
  public readonly courses: ContentCoursesApi;
  public readonly applications: ContentApplicationsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.comments = new ContentCommentsApi(client);
    this.feeds = new ContentFeedsApi(client);
    this.users = new ContentUsersApi(client);
    this.courses = new ContentCoursesApi(client);
    this.applications = new ContentApplicationsApi(client);
  }

}

export function createContentApi(client: HttpClient): ContentApi {
  return new ContentApi(client);
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
