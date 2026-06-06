import {
  ensureSdkworkApiSuccess,
  getClawRouterAppSdkClient,
  isRecord,
  optionalBoundedPositiveInteger,
  optionalPositiveInteger,
  optionalText,
  readApiData,
  readApiRecord,
  readNumber,
  readRequiredApiItem,
  readRequiredApiItems,
  readMediaResource,
  readMediaResourceUrl,
  readString,
  readStringArray,
  readRequiredMediaResource,
  requiredSafePathSegment,
  toExternalUrlMediaResource,
  type ClawRouterMediaResource,
} from 'sdkwork-clawrouter-pc-commons/runtime';
import type {
  Course,
  CourseChapterView,
  CourseCommentView,
  CourseCommentsView,
  CourseDetailViewModel,
  CourseEngagementMetrics,
  CourseLevel,
  CourseLevelFilter,
  CourseLessonView,
  CourseOverviewSource,
  CoursePlaylistView,
  CourseRelatedCardView,
} from './data.ts';
import {
  COURSE_CONTENT_SNAPSHOT_SOURCE,
  buildBilibiliEmbedUrl,
  deriveCourseCatalogViewModel,
  deriveCourseEngagementMetrics,
  formatCourseCount,
} from './data.ts';

const MAX_COURSE_PAGE_SIZE = 240;
const MAX_COURSE_QUERY_TEXT_LENGTH = 128;
const MAX_COURSE_CATEGORY_LENGTH = 64;

export type CourseCategory = {
  id: string;
  code: string;
  label: string;
  name: string;
  description: string;
  iconKey: string;
  sortWeight: number;
  courseCount: number;
};

export type CourseOverviewStats = {
  totalCourses: number;
  totalLessons: number;
  totalStudents: number;
  totalCategories: number;
};

export type CourseOverview = {
  stats: CourseOverviewStats;
  source: CourseOverviewSource;
};

export interface CourseQuery {
  level?: CourseLevelFilter | CourseLevel | number;
  category?: string;
  searchQuery?: string;
  page?: unknown;
  size?: unknown;
}

export interface CourseCatalogResult {
  courses: Course[];
  categories: CourseCategory[];
  page: number;
  size: number;
  totalElements: number;
  source: CourseOverviewSource;
}

export interface CourseDetailResult {
  detail: CourseDetailViewModel;
  course: Course;
  source: CourseOverviewSource;
}

export interface CourseApplicationInput {
  title: string;
  category: string;
  description?: string;
  sourceProvider?: 'bilibili' | 'local';
  externalBvid?: string;
  video?: ClawRouterMediaResource;
  contactName?: string;
  contactEmail?: string;
  notes?: string;
}

export interface CourseApplicationResult {
  id: string;
  applicationId?: number;
  title: string;
  category: string;
  sourceProvider: string;
  externalBvid?: string;
  video?: ClawRouterMediaResource;
  contactName: string;
  contactEmail: string;
  status: string;
  submittedAt: string;
}

export interface CourseApplicationVideoUploadInput {
  file: Blob;
  fileName?: string;
}

export interface CourseApplicationVideoUploadResult {
  video: ClawRouterMediaResource;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  sha256: string;
  uploadedAt: string;
}

export function selectCourseLesson(
  detail: CourseDetailViewModel,
  lessonId: string,
): CourseDetailViewModel {
  const selectedLesson = findLessonById(detail.playlist, lessonId);
  if (!selectedLesson) {
    return detail;
  }

  const playlist = {
    ...detail.playlist,
    currentLessonNumber: selectedLesson.number,
    chapters: detail.playlist.chapters.map((chapter) => ({
      ...chapter,
      lessons: chapter.lessons.map((lesson) => ({
        ...lesson,
        active: lesson.id === selectedLesson.id,
      })),
    })),
  };
  const lessonEmbedUrl = buildCourseLessonEmbedUrl(selectedLesson);

  return {
    ...detail,
    info: {
      ...detail.info,
      description: selectedLesson.content || selectedLesson.description || detail.info.description,
    },
    video: {
      embedUrl: lessonEmbedUrl ?? detail.video.embedUrl,
      sourceProvider: selectedLesson.sourceProvider || detail.video.sourceProvider,
      unavailableMessage: detail.video.unavailableMessage,
      title: selectedLesson.title || detail.video.title,
    },
    playlist,
  };
}

export const courseService = {
  async fetchCourses(query: CourseQuery = {}): Promise<CourseCatalogResult> {
    const normalized = normalizeCourseQuery(query);
    const result = await getClawRouterAppSdkClient().content.courses.list({
      level: normalized.level,
      category: normalized.category,
      q: normalized.searchQuery,
      page: normalized.page,
      pageSize: normalized.pageSize,
    });
    ensureSdkworkApiSuccess(result, 'Failed to fetch courses');
    const catalog = normalizeCourseCatalogPayload(result);
    return {
      ...catalog,
      page: catalog.page || Number(normalized.page ?? 1),
      size: catalog.size || Number(normalized.pageSize ?? MAX_COURSE_PAGE_SIZE),
    };
  },

  async fetchCourseCategories(): Promise<CourseCategory[]> {
    const result = await getClawRouterAppSdkClient().content.courses.categories.list();
    ensureSdkworkApiSuccess(result, 'Failed to fetch course categories');
    return readRequiredApiItems(result, 'Course categories response is missing items')
      .map(normalizeCourseCategory)
      .filter((category): category is CourseCategory => category !== null);
  },

  async fetchCourseOverview(): Promise<CourseOverview> {
    const result = await getClawRouterAppSdkClient().content.courses.overview.retrieve();
    ensureSdkworkApiSuccess(result, 'Failed to fetch course overview');
    return normalizeCourseOverview(readRequiredApiItem(result, 'Course overview response is missing data'));
  },

  async fetchCourseDetail(courseId: string): Promise<CourseDetailResult | null> {
    const result = await getClawRouterAppSdkClient().content.courses.retrieve(
      requiredSafePathSegment(courseId, 'courseId'),
    );
    if (readApiData(result) === null || readApiData(result) === undefined) {
      return null;
    }
    ensureSdkworkApiSuccess(result, 'Failed to fetch course detail');
    return normalizeCourseDetailPayload(result);
  },

  async submitCourseApplication(input: CourseApplicationInput): Promise<CourseApplicationResult> {
    const request = normalizeCourseApplicationInput(input);
    const result = await getClawRouterAppSdkClient().content.applications.create(request);
    ensureSdkworkApiSuccess(result, 'Failed to submit course application');
    return normalizeCourseApplicationResult(readRequiredApiItem(result, 'Course application response is missing data'));
  },

  async uploadCourseApplicationVideo(input: CourseApplicationVideoUploadInput): Promise<CourseApplicationVideoUploadResult> {
    const request = {
      file: input.file,
      fileName: normalizeUploadFileName(input),
    };
    const result = await getClawRouterAppSdkClient().content.applications.videos.create(request);
    ensureSdkworkApiSuccess(result, 'Failed to upload course application video');
    return normalizeCourseApplicationVideoUploadResult(
      readRequiredApiItem(result, 'Course application video upload response is missing data'),
    );
  },
};

export const fetchCourses = courseService.fetchCourses;
export const fetchCourseCategories = courseService.fetchCourseCategories;
export const fetchCourseOverview = courseService.fetchCourseOverview;
export const fetchCourseDetail = courseService.fetchCourseDetail;
export const submitCourseApplication = courseService.submitCourseApplication;
export const uploadCourseApplicationVideo = courseService.uploadCourseApplicationVideo;

export function buildCourseCatalogView(
  result: CourseCatalogResult,
  filters: {
    level: CourseLevelFilter;
    category: string;
    searchQuery: string;
  },
) {
  const view = deriveCourseCatalogViewModel({
    catalog: result.courses,
    filters,
  });

  const categoryOptions = [
    {
      id: 'All',
      label: 'All Categories',
      count: result.totalElements,
    },
    ...result.categories.map((category) => ({
      id: category.code || category.id,
      label: category.label,
      count: category.courseCount,
    })),
  ];

  return {
    ...view,
    snapshotSource: result.source,
    categoryOptions,
    heading: filters.category === 'All'
      ? view.heading
      : categoryOptions.find((category) => category.id === filters.category)?.label ?? view.heading,
    resultCount: result.totalElements,
  };
}

export function normalizeCourseCatalogPayload(result: unknown): CourseCatalogResult {
  const data = readApiRecord(result);
  const items = readRequiredApiItems(result, 'Courses response is missing items')
    .map(normalizeCourseItem)
    .filter((course): course is Course => course !== null);

  return {
    courses: items,
    categories: deriveCategoriesFromCourses(items),
    page: readPositiveInteger(data, 'page', 1),
    size: readPositiveInteger(data, 'size', MAX_COURSE_PAGE_SIZE),
    totalElements: readNonNegativeInteger(data, 'totalElements', items.length),
    source: COURSE_CONTENT_SNAPSHOT_SOURCE,
  };
}

export function normalizeCourseDetailPayload(result: unknown): CourseDetailResult | null {
  if (readApiData(result) === null || readApiData(result) === undefined) {
    return null;
  }
  const record = readRequiredApiItem(result, 'Course detail response is missing data');
  const course = normalizeCourseItem(record);
  if (!course) {
    return null;
  }

  const sections = normalizeCourseSections(record.sections);
  const relatedCourses = readRecordArray(record, 'relatedCourses')
    .map(normalizeCourseItem)
    .filter((related): related is Course => related !== null);
  const source = normalizeCourseSource(record.source);
  const detail = createCourseDetailView(course, sections, relatedCourses, source);
  return { detail, course, source };
}

function normalizeCourseQuery(query: CourseQuery): {
  level?: string;
  category?: string;
  searchQuery?: string;
  page?: string;
  pageSize?: string;
} {
  const page = optionalPositiveInteger(query.page, 'page');
  const pageSize = optionalBoundedPositiveInteger(query.size, 'size', MAX_COURSE_PAGE_SIZE);
  const level = normalizeCourseLevelQuery(query.level);
  return {
    level: level === undefined ? undefined : String(level),
    category: normalizeCategoryQuery(query.category),
    searchQuery: optionalText(query.searchQuery, 'searchQuery', MAX_COURSE_QUERY_TEXT_LENGTH),
    page: page === undefined ? undefined : String(page),
    pageSize: pageSize === undefined ? undefined : String(pageSize),
  };
}

function normalizeCourseLevelQuery(value: CourseQuery['level']): number | undefined {
  if (value === undefined || value === null || value === 'All') {
    return undefined;
  }
  if (value === 'Beginner') {
    return 1;
  }
  if (value === 'Intermediate') {
    return 2;
  }
  if (value === 'Advanced') {
    return 3;
  }
  const level = optionalPositiveInteger(value, 'level');
  if (level === undefined) {
    return undefined;
  }
  if (level > 3) {
    throw new Error('level must be 1, 2, or 3');
  }
  return level;
}

function normalizeCategoryQuery(value: unknown): string | undefined {
  const category = optionalText(value, 'category', MAX_COURSE_CATEGORY_LENGTH);
  if (!category || category.toLowerCase() === 'all') {
    return undefined;
  }
  return category;
}

function normalizeCourseItem(value: unknown): Course | null {
  if (!isRecord(value)) {
    return null;
  }
  const id = readString(value, 'id').trim() || readString(value, 'courseCode').trim();
  const title = readString(value, 'title').trim();
  if (!id || !title) {
    return null;
  }
  const instructor = normalizeCourseInstructor(value.instructor);
  const categoryLabel = readString(value, 'categoryLabel').trim()
    || titleCaseSlug(readString(value, 'category'));
  return {
    id,
    contentId: readNonNegativeInteger(value, 'contentId') || undefined,
    courseCode: readString(value, 'courseCode').trim() || id,
    title,
    description: readString(value, 'description'),
    thumbnail: readRequiredMediaResource(value.thumbnail, 'Course thumbnail is required'),
    instructor,
    duration: readString(value, 'durationText'),
    lessonsCount: readNonNegativeInteger(value, 'lessonsCount'),
    rating: clampRating(readNumber(value, 'ratingScore', 0)),
    studentsCount: readNonNegativeInteger(value, 'studentsCount'),
    level: normalizeCourseLevel(value.level, readString(value, 'levelLabel')),
    category: categoryLabel,
    tags: readStringArray(value, 'tags').filter(Boolean),
    bilibiliBvid: readString(value, 'externalBvid') || undefined,
    content: readString(value, 'content') || readString(value, 'description'),
    price: normalizePrice(value.priceAmount),
    isCollection: readBooleanCompat(value, 'isCollection'),
    publishedAt: readString(value, 'publishedAt') || undefined,
    relatedCourseIds: [],
    engagement: normalizeCourseEngagement(value.engagement, {
      studentsCount: readNonNegativeInteger(value, 'studentsCount'),
      lessonsCount: readNonNegativeInteger(value, 'lessonsCount'),
      commentCount: readNonNegativeInteger(value, 'commentCount'),
    }),
  };
}

function normalizeCourseInstructor(value: unknown): Course['instructor'] {
  const record = isRecord(value) ? value : {};
  return {
    name: readString(record, 'name').trim() || 'SDKWork Academy',
    avatar: readRequiredMediaResource(record.avatar, 'Course instructor avatar is required'),
    title: readString(record, 'title'),
    bio: readString(record, 'bio'),
  };
}

function normalizeCourseEngagement(
  value: unknown,
  fallback: { studentsCount: number; lessonsCount: number; commentCount: number },
): NonNullable<Course['engagement']> {
  const record = isRecord(value) ? value : {};
  return {
    views: readNonNegativeInteger(record, 'views', fallback.studentsCount),
    likes: readNonNegativeInteger(record, 'likes'),
    saves: readNonNegativeInteger(record, 'saves'),
    shares: readNonNegativeInteger(record, 'shares'),
    discussions: readNonNegativeInteger(record, 'discussions', fallback.commentCount || fallback.lessonsCount),
  };
}

function normalizeCourseCategory(value: unknown): CourseCategory | null {
  if (!isRecord(value)) {
    return null;
  }
  const code = readString(value, 'code').trim();
  const id = readString(value, 'id').trim() || code;
  const label = readString(value, 'label').trim() || readString(value, 'name').trim() || titleCaseSlug(code);
  if (!id || !label) {
    return null;
  }
  return {
    id,
    code,
    label,
    name: readString(value, 'name').trim() || label,
    description: readString(value, 'description'),
    iconKey: readString(value, 'iconKey'),
    sortWeight: readNumber(value, 'sortWeight', 0),
    courseCount: readNonNegativeInteger(value, 'courseCount'),
  };
}

function normalizeCourseOverview(value: unknown): CourseOverview {
  const record = isRecord(value) ? value : {};
  const statsRecord = isRecord(record.stats) ? record.stats : {};
  return {
    stats: {
      totalCourses: readNonNegativeInteger(statsRecord, 'totalCourses'),
      totalLessons: readNonNegativeInteger(statsRecord, 'totalLessons'),
      totalStudents: readNonNegativeInteger(statsRecord, 'totalStudents'),
      totalCategories: readNonNegativeInteger(statsRecord, 'totalCategories'),
    },
    source: normalizeCourseSource(record.source),
  };
}

function normalizeCourseSource(value: unknown): CourseOverviewSource {
  const record = isRecord(value) ? value : {};
  const sourceTables = readStringArray(record, 'sourceTables').filter(Boolean);
  return {
    sourceLabel: readString(record, 'sourceLabel').trim() || 'Live course data',
    sourceDescription: readString(record, 'sourceDescription').trim()
      || 'Derived from Java-compatible course, category, comment, and reaction tables.',
    observedAt: readString(record, 'observedAt').trim() || COURSE_CONTENT_SNAPSHOT_SOURCE.observedAt,
    sourceTables: sourceTables.length > 0 ? sourceTables : [...COURSE_CONTENT_SNAPSHOT_SOURCE.sourceTables],
  };
}

function normalizeCourseSections(value: unknown): CourseChapterView[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter(isRecord).map((section, sectionIndex) => {
    const sectionNumber = readPositiveInteger(section, 'sectionNo', sectionIndex + 1);
    const lessons = readRecordArray(section, 'lessons').map((lesson, lessonIndex) => {
      const lessonNumber = readPositiveInteger(lesson, 'number', readPositiveInteger(lesson, 'lessonNo', lessonIndex + 1));
      return {
        id: readString(lesson, 'id').trim() || `${readString(section, 'id')}-lesson-${lessonNumber}`,
        number: lessonNumber,
        title: readString(lesson, 'title').trim() || `Lesson ${lessonNumber}`,
        description: readString(lesson, 'description'),
        duration: readString(lesson, 'durationText') || formatDuration(readNonNegativeInteger(lesson, 'durationSeconds')),
        active: sectionIndex === 0 && lessonIndex === 0,
        video: readMediaResource(lesson.video),
        externalBvid: readString(lesson, 'externalBvid'),
        sourceProvider: readString(lesson, 'sourceProvider'),
        content: readString(lesson, 'content'),
        freePreview: readBooleanCompat(lesson, 'freePreview'),
      } satisfies CourseLessonView;
    });
    return {
      id: readString(section, 'id').trim() || `section-${sectionNumber}`,
      title: readString(section, 'title').trim() || `${sectionNumber}. Section`,
      lessons,
    };
  });
}

function createCourseDetailView(
  course: Course,
  sections: CourseChapterView[],
  relatedCourses: Course[],
  source: CourseOverviewSource,
): CourseDetailViewModel {
  const metrics = deriveCourseEngagementMetrics(course);
  const playlist = createCoursePlaylist(course, sections);
  const activeLesson = getActiveLesson(playlist);
  const activeLessonEmbedUrl = activeLesson ? buildCourseLessonEmbedUrl(activeLesson) : null;
  return {
    course,
    snapshotSource: source,
    info: {
      title: course.title,
      description: activeLesson?.content || activeLesson?.description || course.content || course.description,
      category: course.category,
      tags: course.tags,
      publishedAt: source.observedAt,
      lessonsLabel: `${course.lessonsCount} lessons`,
      viewsLabel: `${metrics.views} views`,
      reactions: metrics,
    },
    video: {
      embedUrl: activeLessonEmbedUrl ?? buildBilibiliEmbedUrl(course.bilibiliBvid),
      sourceProvider: activeLesson?.sourceProvider,
      unavailableMessage: 'Video content unavailable',
      title: activeLesson?.title || course.title,
    },
    playlist,
    relatedCourses: relatedCourses.map(createRelatedCourseCard),
    comments: createCourseComments(course),
    publisher: {
      name: course.instructor.name,
      avatar: course.instructor.avatar,
      title: course.instructor.title,
      bio: course.instructor.bio,
      followersLabel: `${formatCourseCount(course.studentsCount)} learners`,
    },
  };
}

function createCoursePlaylist(course: Course, sections: CourseChapterView[]): CoursePlaylistView {
  if (sections.length === 0) {
    return {
      totalLessons: course.lessonsCount,
      currentLessonNumber: course.lessonsCount > 0 ? 1 : 0,
      chapters: [],
    };
  }
  const totalLessons = sections.reduce((count, chapter) => count + chapter.lessons.length, 0);
  return {
    totalLessons: Math.max(totalLessons, course.lessonsCount),
    currentLessonNumber: totalLessons > 0 ? 1 : 0,
    chapters: sections,
  };
}

function findLessonById(playlist: CoursePlaylistView, lessonId: string): CourseLessonView | null {
  for (const chapter of playlist.chapters) {
    const lesson = chapter.lessons.find((item) => item.id === lessonId);
    if (lesson) {
      return lesson;
    }
  }
  return null;
}

function getActiveLesson(playlist: CoursePlaylistView): CourseLessonView | null {
  for (const chapter of playlist.chapters) {
    const lesson = chapter.lessons.find((item) => item.active);
    if (lesson) {
      return lesson;
    }
  }
  return playlist.chapters[0]?.lessons[0] ?? null;
}

function buildCourseLessonEmbedUrl(lesson: CourseLessonView): string | null {
  const videoPlaybackSrc = readMediaResourceUrl(lesson.video);
  if (!videoPlaybackSrc && lesson.sourceProvider !== 'bilibili') {
    return buildBilibiliEmbedUrl(lesson.externalBvid);
  }
  if (videoPlaybackSrc) {
    const safeVideoSrc = buildSafeVideoUrl(videoPlaybackSrc);
    if (safeVideoSrc) {
      return safeVideoSrc;
    }
  }
  return buildBilibiliEmbedUrl(lesson.externalBvid);
}

function buildSafeVideoUrl(value: string): string | null {
  const rawUrl = value.trim();
  if (!rawUrl) {
    return null;
  }
  if (rawUrl.startsWith('/uploads/courses/')) {
    return rawUrl;
  }
  try {
    const parsed = new URL(rawUrl);
    return parsed.protocol === 'https:' ? parsed.toString() : null;
  } catch {
    return null;
  }
}

function normalizeCourseApplicationInput(input: CourseApplicationInput) {
  return {
    title: optionalText(input.title, 'title', 200) ?? '',
    category: optionalText(input.category, 'category', 64) ?? '',
    description: optionalText(input.description, 'description', 2048) ?? '',
    sourceProvider: normalizeCourseApplicationSourceProvider(input.sourceProvider),
    externalBvid: optionalText(input.externalBvid, 'externalBvid', 128),
    video: input.video,
    contactName: optionalText(input.contactName, 'contactName', 128),
    contactEmail: optionalText(input.contactEmail, 'contactEmail', 256),
    notes: optionalText(input.notes, 'notes', 2000),
  };
}

function normalizeCourseApplicationSourceProvider(value: CourseApplicationInput['sourceProvider']): 'bilibili' | 'local' {
  const sourceProvider = optionalText(value, 'sourceProvider', 64) ?? 'bilibili';
  if (sourceProvider !== 'bilibili' && sourceProvider !== 'local') {
    throw new Error('sourceProvider must be bilibili or local');
  }
  return sourceProvider;
}

function normalizeCourseApplicationResult(value: unknown): CourseApplicationResult {
  const record = isRecord(value) ? value : {};
  return {
    id: readString(record, 'id').trim(),
    applicationId: readNonNegativeInteger(record, 'applicationId') || undefined,
    title: readString(record, 'title').trim(),
    category: readString(record, 'category').trim(),
    sourceProvider: readString(record, 'sourceProvider').trim(),
    externalBvid: readString(record, 'externalBvid') || undefined,
    video: readMediaResource(record.video),
    contactName: readString(record, 'contactName').trim(),
    contactEmail: readString(record, 'contactEmail').trim(),
    status: readString(record, 'status').trim(),
    submittedAt: readString(record, 'submittedAt').trim(),
  };
}

function normalizeUploadFileName(input: CourseApplicationVideoUploadInput): string {
  const explicitName = optionalText(input.fileName, 'fileName', 255);
  if (explicitName) {
    return explicitName;
  }
  const namedFile = input.file as Blob & { name?: unknown };
  if (typeof namedFile.name === 'string') {
    return optionalText(namedFile.name, 'fileName', 255) ?? 'course-video.mp4';
  }
  return 'course-video.mp4';
}

function normalizeCourseApplicationVideoUploadResult(value: unknown): CourseApplicationVideoUploadResult {
  const record = isRecord(value) ? value : {};
  return {
    video: readRequiredMediaResource(record.video, 'Course application uploaded video is required'),
    fileName: readString(record, 'fileName').trim(),
    contentType: readString(record, 'contentType').trim(),
    sizeBytes: readNonNegativeInteger(record, 'sizeBytes'),
    sha256: readString(record, 'sha256').trim(),
    uploadedAt: readString(record, 'uploadedAt').trim(),
  };
}

function createRelatedCourseCard(course: Course): CourseRelatedCardView {
  const metrics = deriveCourseEngagementMetrics(course);
  return {
    id: course.id,
    title: course.title,
    thumbnail: course.thumbnail,
    instructorName: course.instructor.name,
    duration: course.duration,
    viewsLabel: metrics.views,
    discussionsLabel: metrics.discussions,
  };
}

function createCourseComments(course: Course): CourseCommentsView {
  const totalCount = Math.max(0, Math.round(course.engagement?.discussions ?? 0));
  const items: CourseCommentView[] = totalCount > 0
    ? [{
      id: `${course.id}-discussion-summary`,
      author: 'SDKWork Academy',
      avatar: course.instructor.avatar || avatarForName('SDKWork Academy'),
      level: 5,
      body: `${formatCourseCount(totalCount)} discussion entries are available for this course.`,
      createdAt: course.publishedAt ?? '',
      likes: Math.max(0, Math.round(course.engagement?.likes ?? 0)),
    }]
    : [];
  return { totalCount, items };
}

function deriveCategoriesFromCourses(courses: Course[]): CourseCategory[] {
  const counts = new Map<string, { label: string; count: number }>();
  for (const course of courses) {
    const code = slugifyCategory(course.category);
    const current = counts.get(code);
    counts.set(code, {
      label: course.category,
      count: (current?.count ?? 0) + 1,
    });
  }
  return Array.from(counts.entries())
    .map(([code, item], index) => ({
      id: code,
      code,
      label: item.label,
      name: item.label,
      description: '',
      iconKey: '',
      sortWeight: index,
      courseCount: item.count,
    }))
    .sort((left, right) => left.sortWeight - right.sortWeight || left.label.localeCompare(right.label));
}

function readRecordArray(record: Record<string, unknown>, key: string): Record<string, unknown>[] {
  const value = record[key];
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter(isRecord);
}

function readPositiveInteger(record: Record<string, unknown>, key: string, fallback: number): number {
  const value = readNumber(record, key, fallback);
  return Number.isFinite(value) && value > 0 ? Math.round(value) : fallback;
}

function readNonNegativeInteger(record: Record<string, unknown>, key: string, fallback = 0): number {
  const value = readNumber(record, key, fallback);
  return Number.isFinite(value) ? Math.max(0, Math.round(value)) : fallback;
}

function readBooleanCompat(record: Record<string, unknown>, key: string): boolean {
  const value = record[key];
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'number') {
    return value !== 0;
  }
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' || value === '1';
  }
  return false;
}

function clampRating(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.min(5, Math.max(0, value));
}

function normalizePrice(value: unknown): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeCourseLevel(value: unknown, label: string): CourseLevel {
  if (value === 1 || label === 'Beginner') {
    return 'Beginner';
  }
  if (value === 2 || label === 'Intermediate') {
    return 'Intermediate';
  }
  if (value === 3 || label === 'Advanced') {
    return 'Advanced';
  }
  return 'Beginner';
}

function titleCaseSlug(value: string): string {
  return value
    .trim()
    .split(/[-_\s]+/u)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1).toLowerCase()}`)
    .join(' ');
}

function slugifyCategory(value: string): string {
  const normalized = value.trim().toLowerCase().replace(/[^a-z0-9]+/gu, '-').replace(/^-|-$/gu, '');
  return normalized || 'uncategorized';
}

function formatDuration(seconds: number): string {
  if (seconds <= 0) {
    return '';
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}

function avatarForName(name: string): ClawRouterMediaResource {
  return {
    kind: 'image',
    source: 'external_url',
    url: '/assets/courses/avatars/learner.svg',
    publicUrl: '/assets/courses/avatars/learner.svg',
    title: name,
  };
}

export type {
  CourseEngagementMetrics,
};
