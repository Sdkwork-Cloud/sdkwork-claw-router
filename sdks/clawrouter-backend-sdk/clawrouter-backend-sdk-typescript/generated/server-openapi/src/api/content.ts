import { backendApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { AdminAnnouncementCreateRequest, AdminAnnouncementUpdateRequest, AdminCourseApplicationReviewRequest, AdminCourseCommentModerationRequest, AdminCourseLessonMutationRequest, AdminCourseMutationRequest, AdminCourseRelationsReplaceRequest, AdminCourseSectionMutationRequest, AnnouncementsCreateResult, AnnouncementsDeleteResult, AnnouncementsListResult, AnnouncementsUpdateResult, CourseApplicationsListResult, CourseApplicationsReviewResult, CourseCommentsListResult, CourseCommentsModerateResult, CourseEngagementListResult, CourseLessonsDeleteResult, CourseLessonsUpdateResult, CoursesCreateResult, CoursesDashboardRetrieveResult, CoursesDeleteResult, CourseSectionsDeleteResult, CourseSectionsUpdateResult, CoursesLessonsCreateResult, CoursesLessonsListResult, CoursesListResult, CoursesRelationsListResult, CoursesRelationsReplaceResult, CoursesSectionsCreateResult, CoursesSectionsListResult, CoursesUpdateResult } from '../types';


export interface ContentCourseEngagementListParams {
  page?: string;
  pageSize?: string;
  q?: string;
  status?: string;
}

export class ContentCourseEngagementApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Admin Course Engagement List */
  async list(params?: ContentCourseEngagementListParams): Promise<CourseEngagementListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CourseEngagementListResult>(appendQueryString(backendApiPath(`/content/courses/engagement`), query));
  }
}

export interface ContentCourseCommentsListParams {
  page?: string;
  pageSize?: string;
  q?: string;
  status?: string;
}

export class ContentCourseCommentsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Admin Course Comments List */
  async list(params?: ContentCourseCommentsListParams): Promise<CourseCommentsListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CourseCommentsListResult>(appendQueryString(backendApiPath(`/content/courses/comments`), query));
  }

/** Admin Course Comment Moderate */
  async moderate(commentId: string, body: AdminCourseCommentModerationRequest): Promise<CourseCommentsModerateResult> {
    return this.client.patch<CourseCommentsModerateResult>(backendApiPath(`/content/courses/comments/${serializePathParameter(commentId, { name: 'commentId', style: 'simple', explode: false })}/moderation`), body, undefined, undefined, 'application/json');
  }
}

export interface ContentCoursesSectionsListParams {
  page?: string;
  pageSize?: string;
  q?: string;
  status?: string;
}

export class ContentCoursesSectionsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Admin Course Sections List */
  async list(courseId: string, params?: ContentCoursesSectionsListParams): Promise<CoursesSectionsListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CoursesSectionsListResult>(appendQueryString(backendApiPath(`/content/courses/${serializePathParameter(courseId, { name: 'courseId', style: 'simple', explode: false })}/sections`), query));
  }

/** Admin Course Section Create */
  async create(courseId: string, body: AdminCourseSectionMutationRequest): Promise<CoursesSectionsCreateResult> {
    return this.client.post<CoursesSectionsCreateResult>(backendApiPath(`/content/courses/${serializePathParameter(courseId, { name: 'courseId', style: 'simple', explode: false })}/sections`), body, undefined, undefined, 'application/json');
  }
}

export interface ContentCoursesRelationsListParams {
  page?: string;
  pageSize?: string;
  q?: string;
  status?: string;
}

export class ContentCoursesRelationsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Admin Course Relations List */
  async list(courseId: string, params?: ContentCoursesRelationsListParams): Promise<CoursesRelationsListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CoursesRelationsListResult>(appendQueryString(backendApiPath(`/content/courses/${serializePathParameter(courseId, { name: 'courseId', style: 'simple', explode: false })}/relations`), query));
  }

/** Admin Course Relations Replace */
  async replace(courseId: string, body: AdminCourseRelationsReplaceRequest): Promise<CoursesRelationsReplaceResult> {
    return this.client.put<CoursesRelationsReplaceResult>(backendApiPath(`/content/courses/${serializePathParameter(courseId, { name: 'courseId', style: 'simple', explode: false })}/relations`), body, undefined, undefined, 'application/json');
  }
}

export interface ContentCoursesLessonsListParams {
  page?: string;
  pageSize?: string;
  q?: string;
  status?: string;
}

export class ContentCoursesLessonsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Admin Course Lessons List */
  async list(courseId: string, params?: ContentCoursesLessonsListParams): Promise<CoursesLessonsListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CoursesLessonsListResult>(appendQueryString(backendApiPath(`/content/courses/${serializePathParameter(courseId, { name: 'courseId', style: 'simple', explode: false })}/lessons`), query));
  }

/** Admin Course Lesson Create */
  async create(courseId: string, body: AdminCourseLessonMutationRequest): Promise<CoursesLessonsCreateResult> {
    return this.client.post<CoursesLessonsCreateResult>(backendApiPath(`/content/courses/${serializePathParameter(courseId, { name: 'courseId', style: 'simple', explode: false })}/lessons`), body, undefined, undefined, 'application/json');
  }
}

export class ContentCoursesDashboardApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Course Dashboard Retrieve */
  async retrieve(): Promise<CoursesDashboardRetrieveResult> {
    return this.client.get<CoursesDashboardRetrieveResult>(backendApiPath(`/content/courses/dashboard`));
  }
}

export interface ContentCoursesListParams {
  page?: string;
  pageSize?: string;
  q?: string;
  status?: string;
}

export class ContentCoursesApi {
  private client: HttpClient;
  public readonly dashboard: ContentCoursesDashboardApi;
  public readonly lessons: ContentCoursesLessonsApi;
  public readonly relations: ContentCoursesRelationsApi;
  public readonly sections: ContentCoursesSectionsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.dashboard = new ContentCoursesDashboardApi(client);
    this.lessons = new ContentCoursesLessonsApi(client);
    this.relations = new ContentCoursesRelationsApi(client);
    this.sections = new ContentCoursesSectionsApi(client);
  }


/** Admin Courses List */
  async list(params?: ContentCoursesListParams): Promise<CoursesListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CoursesListResult>(appendQueryString(backendApiPath(`/content/courses`), query));
  }

/** Admin Course Create */
  async create(body: AdminCourseMutationRequest): Promise<CoursesCreateResult> {
    return this.client.post<CoursesCreateResult>(backendApiPath(`/content/courses`), body, undefined, undefined, 'application/json');
  }

/** Admin Course Delete */
  async delete(courseId: string): Promise<CoursesDeleteResult> {
    return this.client.delete<CoursesDeleteResult>(backendApiPath(`/content/courses/${serializePathParameter(courseId, { name: 'courseId', style: 'simple', explode: false })}`));
  }

/** Admin Course Update */
  async update(courseId: string, body: AdminCourseMutationRequest): Promise<CoursesUpdateResult> {
    return this.client.patch<CoursesUpdateResult>(backendApiPath(`/content/courses/${serializePathParameter(courseId, { name: 'courseId', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
  }
}

export class ContentCourseSectionsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Admin Course Section Delete */
  async delete(sectionId: string): Promise<CourseSectionsDeleteResult> {
    return this.client.delete<CourseSectionsDeleteResult>(backendApiPath(`/content/course-sections/${serializePathParameter(sectionId, { name: 'sectionId', style: 'simple', explode: false })}`));
  }

/** Admin Course Section Update */
  async update(sectionId: string, body: AdminCourseSectionMutationRequest): Promise<CourseSectionsUpdateResult> {
    return this.client.patch<CourseSectionsUpdateResult>(backendApiPath(`/content/course-sections/${serializePathParameter(sectionId, { name: 'sectionId', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
  }
}

export class ContentCourseLessonsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Admin Course Lesson Delete */
  async delete(lessonId: string): Promise<CourseLessonsDeleteResult> {
    return this.client.delete<CourseLessonsDeleteResult>(backendApiPath(`/content/course-lessons/${serializePathParameter(lessonId, { name: 'lessonId', style: 'simple', explode: false })}`));
  }

/** Admin Course Lesson Update */
  async update(lessonId: string, body: AdminCourseLessonMutationRequest): Promise<CourseLessonsUpdateResult> {
    return this.client.patch<CourseLessonsUpdateResult>(backendApiPath(`/content/course-lessons/${serializePathParameter(lessonId, { name: 'lessonId', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
  }
}

export interface ContentCourseApplicationsListParams {
  page?: string;
  pageSize?: string;
  q?: string;
  status?: string;
}

export class ContentCourseApplicationsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Admin Course Applications List */
  async list(params?: ContentCourseApplicationsListParams): Promise<CourseApplicationsListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CourseApplicationsListResult>(appendQueryString(backendApiPath(`/content/course-applications`), query));
  }

/** Admin Course Application Review */
  async review(applicationId: string, body: AdminCourseApplicationReviewRequest): Promise<CourseApplicationsReviewResult> {
    return this.client.patch<CourseApplicationsReviewResult>(backendApiPath(`/content/course-applications/${serializePathParameter(applicationId, { name: 'applicationId', style: 'simple', explode: false })}/review`), body, undefined, undefined, 'application/json');
  }
}

export class ContentAnnouncementsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List announcements */
  async list(): Promise<AnnouncementsListResult> {
    return this.client.get<AnnouncementsListResult>(backendApiPath(`/content/announcements`));
  }

/** Create announcement */
  async create(body: AdminAnnouncementCreateRequest): Promise<AnnouncementsCreateResult> {
    return this.client.post<AnnouncementsCreateResult>(backendApiPath(`/content/announcements`), body, undefined, undefined, 'application/json');
  }

/** Delete announcement */
  async delete(announcementId: string): Promise<AnnouncementsDeleteResult> {
    return this.client.delete<AnnouncementsDeleteResult>(backendApiPath(`/content/announcements/${serializePathParameter(announcementId, { name: 'announcementId', style: 'simple', explode: false })}`));
  }

/** Update announcement */
  async update(announcementId: string, body: AdminAnnouncementUpdateRequest): Promise<AnnouncementsUpdateResult> {
    return this.client.patch<AnnouncementsUpdateResult>(backendApiPath(`/content/announcements/${serializePathParameter(announcementId, { name: 'announcementId', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
  }
}

export class ContentApi {
  private client: HttpClient;
  public readonly announcements: ContentAnnouncementsApi;
  public readonly courseApplications: ContentCourseApplicationsApi;
  public readonly courseLessons: ContentCourseLessonsApi;
  public readonly courseSections: ContentCourseSectionsApi;
  public readonly courses: ContentCoursesApi;
  public readonly courseComments: ContentCourseCommentsApi;
  public readonly courseEngagement: ContentCourseEngagementApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.announcements = new ContentAnnouncementsApi(client);
    this.courseApplications = new ContentCourseApplicationsApi(client);
    this.courseLessons = new ContentCourseLessonsApi(client);
    this.courseSections = new ContentCourseSectionsApi(client);
    this.courses = new ContentCoursesApi(client);
    this.courseComments = new ContentCourseCommentsApi(client);
    this.courseEngagement = new ContentCourseEngagementApi(client);
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
