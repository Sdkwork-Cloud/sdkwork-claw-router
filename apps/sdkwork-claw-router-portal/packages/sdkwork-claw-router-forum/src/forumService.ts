import type {
  ForumCollectFeedRequest as SdkForumCollectFeedRequest,
  ForumCreateCommentRequest as SdkForumCreateCommentRequest,
  ForumCreateFeedRequest as SdkForumCreateFeedRequest,
  ForumFeedItem as SdkForumFeedItem,
  ForumCommentItem as SdkForumCommentItem,
} from '@sdkwork/clawrouter-app-sdk';
import {
  createRequestToken,
  ensurePlusApiSuccess,
  getClawRouterAppSdkClient,
  isRecord,
  optionalBoundedPositiveInteger,
  optionalPositiveInteger,
  optionalText,
  readApiData,
  readBoolean,
  readNumber,
  readApiRecord,
  readRequiredApiItem,
  readRequiredApiItems,
  readString,
  readStringArray,
  requiredSafePathSegment,
} from 'sdkwork-claw-router-commons/runtime';
import {
  filterForumPostsForCatalog,
  type ForumAuthor,
  type ForumCategory,
  type ForumComment,
  type ForumPost,
  type ForumSortKey,
} from './forumCatalog.ts';

const MAX_FORUM_PAGE_SIZE = 100;
const MAX_FORUM_QUERY_TEXT_LENGTH = 128;
const FORUM_CATEGORY_BY_ID = new Map<number, ForumCategory>([
  [1000, 'General Discussion'],
  [1001, 'Performance'],
  [1002, 'Best Practices'],
  [1003, 'Help & Support'],
  [1004, 'Announcements'],
]);

export interface ForumFeedFilters {
  search?: string;
  category?: string;
  sort?: ForumSortKey;
  page?: unknown;
  size?: unknown;
  limit?: unknown;
  categoryId?: unknown;
  authorId?: unknown;
  feedType?: 'hot' | 'recommend' | 'top' | 'most-viewed' | 'most-liked';
}

export interface ForumCommentQuery {
  contentType: 'feeds' | 'comments' | 'FEEDS' | 'COMMENTS';
  contentId: unknown;
  page?: unknown;
  size?: unknown;
  limit?: unknown;
}

export interface ForumFeedInput {
  title?: string;
  content: string;
  summary?: string;
  categoryId?: number;
  images?: string[];
  tags?: string[];
  source?: string;
  sourceUrl?: string;
}

export interface ForumFeedStatistics {
  totalComments: number;
}

export interface ForumCommentInput {
  contentType: 'feeds' | 'comments' | 'FEEDS' | 'COMMENTS';
  contentId: number;
  content: string;
  parentId?: number;
  deviceInfo?: string;
  ipAddress?: string;
}

export const forumService = {
  async fetchForumFeeds(filters: ForumFeedFilters = {}): Promise<ForumPost[]> {
    const query = normalizeFeedQuery(filters);
    const result = await getClawRouterAppSdkClient().feed.fetchForumFeeds(
      query.feedType,
      undefined,
      query.keyword,
      query.authorId,
      query.categoryId,
      query.page,
      query.size,
      query.limit,
    );
    ensurePlusApiSuccess(result, 'Failed to fetch forum feeds');
    const items = readRequiredApiItems(result, 'Failed to fetch forum feeds')
      .map(normalizeForumPost)
      .filter((post): post is ForumPost => post !== null);
    return filterForumPostsForCatalog(items, {
      category: filters.category ?? 'All',
      searchQuery: filters.search ?? '',
      sort: filters.sort ?? 'latest',
    });
  },

  async fetchHotForumFeeds(filters: ForumFeedFilters = {}): Promise<ForumPost[]> {
    const query = normalizeFeedQuery(filters);
    const result = await getClawRouterAppSdkClient().feed.fetchHotForumFeeds(
      query.keyword,
      query.page,
      query.size,
      query.limit,
    );
    return readForumPostList(result, filters, 'Failed to fetch hot forum feeds');
  },

  async fetchRecommendedForumFeeds(filters: ForumFeedFilters = {}): Promise<ForumPost[]> {
    const query = normalizeFeedQuery(filters);
    const result = await getClawRouterAppSdkClient().feed.fetchRecommendedForumFeeds(
      query.keyword,
      query.page,
      query.size,
      query.limit,
    );
    return readForumPostList(result, filters, 'Failed to fetch recommended forum feeds');
  },

  async searchForumFeeds(filters: ForumFeedFilters = {}): Promise<ForumPost[]> {
    const query = normalizeFeedQuery(filters);
    const result = await getClawRouterAppSdkClient().feed.searchForumFeeds(
      query.keyword,
      query.categoryId,
      query.page,
      query.size,
      query.limit,
    );
    return readForumPostList(result, filters, 'Failed to search forum feeds');
  },

  async fetchTopForumFeeds(filters: ForumFeedFilters = {}): Promise<ForumPost[]> {
    const query = normalizeFeedQuery(filters);
    const result = await getClawRouterAppSdkClient().feed.fetchTopForumFeeds(query.page, query.size, query.limit);
    return readForumPostList(result, filters, 'Failed to fetch top forum feeds');
  },

  async fetchCategoryForumFeeds(categoryId: unknown, filters: ForumFeedFilters = {}): Promise<ForumPost[]> {
    const normalizedCategoryId = optionalPositiveInteger(categoryId, 'categoryId') ?? missingPositiveInteger('categoryId');
    const query = normalizeFeedQuery(filters);
    const result = await getClawRouterAppSdkClient().feed.fetchCategoryForumFeeds(
      normalizedCategoryId,
      query.keyword,
      query.page,
      query.size,
      query.limit,
    );
    return readForumPostList(result, filters, 'Failed to fetch category forum feeds');
  },

  async fetchMostViewedForumFeeds(filters: ForumFeedFilters = {}): Promise<ForumPost[]> {
    const query = normalizeFeedQuery(filters);
    const result = await getClawRouterAppSdkClient().feed.fetchMostViewedForumFeeds(query.page, query.size, query.limit);
    return readForumPostList(result, filters, 'Failed to fetch most viewed forum feeds');
  },

  async fetchMostLikedForumFeeds(filters: ForumFeedFilters = {}): Promise<ForumPost[]> {
    const query = normalizeFeedQuery(filters);
    const result = await getClawRouterAppSdkClient().feed.fetchMostLikedForumFeeds(query.page, query.size, query.limit);
    return readForumPostList(result, filters, 'Failed to fetch most liked forum feeds');
  },

  async fetchForumFeedCategories(): Promise<string[]> {
    const result = await getClawRouterAppSdkClient().feed.fetchForumFeedCategories();
    ensurePlusApiSuccess(result, 'Failed to fetch forum feed categories');
    const data = readApiData(result);
    if (Array.isArray(data)) {
      return normalizeForumCategoryValues(data);
    }
    return normalizeForumCategoryValues(readRequiredApiItems(result, 'Failed to fetch forum feed categories'));
  },

  async fetchForumFeedDetail(feedId: string): Promise<ForumPost | undefined> {
    const result = await getClawRouterAppSdkClient().feed.fetchForumFeedDetail(requiredSafePathSegment(feedId, 'feedId'));
    if (readApiData(result) === null || readApiData(result) === undefined) {
      return undefined;
    }
    ensurePlusApiSuccess(result, 'Failed to fetch forum feed detail');
    return normalizeForumPost(readRequiredApiItem(result, 'Forum feed detail response is missing data')) ?? undefined;
  },

  async checkForumFeedCollected(feedId: string): Promise<boolean> {
    const result = await getClawRouterAppSdkClient().feed.checkForumFeedCollected(requiredSafePathSegment(feedId, 'feedId'));
    ensurePlusApiSuccess(result, 'Failed to check forum feed collection');
    return readBoolean(readApiRecord(result), 'ok', false);
  },

  async fetchForumComments(query: ForumCommentQuery): Promise<ForumComment[]> {
    const normalized = normalizeCommentQuery(query);
    const result = await getClawRouterAppSdkClient().comment.fetchForumComments(
      normalized.contentType,
      normalized.contentId,
      normalized.page,
      normalized.size,
      normalized.limit,
    );
    ensurePlusApiSuccess(result, 'Failed to fetch forum comments');
    return readForumCommentTree(result, 'Failed to fetch forum comments');
  },

  async fetchForumCommentReplies(commentId: string, query: Partial<ForumCommentQuery> = {}): Promise<ForumComment[]> {
    const normalizedCommentId = requiredSafePathSegment(commentId, 'commentId');
    const page = optionalPositiveInteger(query.page, 'page');
    const size = optionalBoundedPositiveInteger(query.size, 'size', MAX_FORUM_PAGE_SIZE);
    const limit = optionalBoundedPositiveInteger(query.limit, 'limit', MAX_FORUM_PAGE_SIZE);
    const result = await getClawRouterAppSdkClient().comment.fetchForumCommentReplies(normalizedCommentId, page, size, limit);
    ensurePlusApiSuccess(result, 'Failed to fetch forum comment replies');
    return readForumCommentTree(result, 'Failed to fetch forum comment replies');
  },

  async fetchForumCommentDetail(commentId: string): Promise<ForumComment | undefined> {
    const result = await getClawRouterAppSdkClient().comment.fetchForumCommentDetail(requiredSafePathSegment(commentId, 'commentId'));
    if (readApiData(result) === null || readApiData(result) === undefined) {
      return undefined;
    }
    ensurePlusApiSuccess(result, 'Failed to fetch forum comment detail');
    return normalizeForumCommentDetail(readRequiredApiItem(result, 'Forum comment detail response is missing data')) ?? undefined;
  },

  async fetchMyForumComments(query: Partial<ForumCommentQuery> = {}): Promise<ForumComment[]> {
    const page = optionalPositiveInteger(query.page, 'page');
    const size = optionalBoundedPositiveInteger(query.size, 'size', MAX_FORUM_PAGE_SIZE);
    const limit = optionalBoundedPositiveInteger(query.limit, 'limit', MAX_FORUM_PAGE_SIZE);
    const result = await getClawRouterAppSdkClient().comment.fetchMyForumComments(page, size, limit);
    ensurePlusApiSuccess(result, 'Failed to fetch my forum comments');
    return readForumCommentTree(result, 'Failed to fetch my forum comments');
  },

  async fetchForumCommentStatistics(query: ForumCommentQuery): Promise<ForumFeedStatistics> {
    const normalized = normalizeCommentQuery(query);
    const result = await getClawRouterAppSdkClient().comment.fetchForumCommentStatistics(
      normalized.contentType,
      normalized.contentId,
    );
    ensurePlusApiSuccess(result, 'Failed to fetch forum comment statistics');
    return {
      totalComments: Math.max(0, Math.round(readNumber(readApiRecord(result), 'totalComments', 0))),
    };
  },

  async createForumFeed(input: ForumFeedInput): Promise<ForumPost> {
    const result = await getClawRouterAppSdkClient().feed.createForum(
      normalizeCreateFeedRequest(input),
      createRequestToken('forum-feed-create'),
    );
    ensurePlusApiSuccess(result, 'Failed to create forum feed');
    const post = normalizeForumPost(readRequiredApiItem(result, 'Created forum feed response is missing data'));
    if (!post) {
      throw new Error('Created forum feed response is invalid');
    }
    return post;
  },

  async deleteForumFeed(feedId: string): Promise<boolean> {
    const result = await getClawRouterAppSdkClient().feed.deleteForum(requiredSafePathSegment(feedId, 'feedId'));
    ensurePlusApiSuccess(result, 'Failed to delete forum feed');
    return readBoolean(readApiRecord(result), 'ok', false);
  },

  async likeForumFeed(feedId: string): Promise<ForumPost> {
    return mutateFeed(feedId, (id) => getClawRouterAppSdkClient().feed.likeForum(id, undefined, createRequestToken('forum-feed-like')), 'Failed to like forum feed');
  },

  async unlikeForumFeed(feedId: string): Promise<ForumPost> {
    return mutateFeed(feedId, (id) => getClawRouterAppSdkClient().feed.unlikeForum(id, undefined, createRequestToken('forum-feed-unlike')), 'Failed to unlike forum feed');
  },

  async collectForumFeed(feedId: string, request: SdkForumCollectFeedRequest = {}): Promise<ForumPost> {
    return mutateFeed(feedId, (id) => getClawRouterAppSdkClient().feed.collectForum(id, request, createRequestToken('forum-feed-collect')), 'Failed to collect forum feed');
  },

  async uncollectForumFeed(feedId: string): Promise<ForumPost> {
    return mutateFeed(feedId, (id) => getClawRouterAppSdkClient().feed.uncollectForum(id, undefined, createRequestToken('forum-feed-uncollect')), 'Failed to uncollect forum feed');
  },

  async shareForumFeed(feedId: string): Promise<ForumPost> {
    return mutateFeed(feedId, (id) => getClawRouterAppSdkClient().feed.shareForum(id, undefined, createRequestToken('forum-feed-share')), 'Failed to share forum feed');
  },

  async createForumComment(input: ForumCommentInput): Promise<ForumComment> {
    const result = await getClawRouterAppSdkClient().comment.createForum(
      normalizeCreateCommentRequest(input),
      createRequestToken('forum-comment-create'),
    );
    ensurePlusApiSuccess(result, 'Failed to create forum comment');
    const comment = normalizeForumComment(readRequiredApiItem(result, 'Created forum comment response is missing data'));
    if (!comment) {
      throw new Error('Created forum comment response is invalid');
    }
    return stripInternalCommentFields(comment);
  },

  async replyForumComment(commentId: string, input: ForumCommentInput): Promise<ForumComment> {
    return mutateComment(
      commentId,
      (id) => getClawRouterAppSdkClient().comment.replyForum(
        id,
        normalizeCreateCommentRequest(input),
        createRequestToken('forum-comment-reply'),
      ),
      'Failed to reply forum comment',
    );
  },

  async deleteForumComment(commentId: string): Promise<boolean> {
    const result = await getClawRouterAppSdkClient().comment.deleteForum(requiredSafePathSegment(commentId, 'commentId'));
    ensurePlusApiSuccess(result, 'Failed to delete forum comment');
    return readBoolean(readApiRecord(result), 'ok', false);
  },

  async likeForumComment(commentId: string): Promise<ForumComment> {
    return mutateComment(
      commentId,
      (id) => getClawRouterAppSdkClient().comment.likeForum(id, undefined, createRequestToken('forum-comment-like')),
      'Failed to like forum comment',
    );
  },

  async unlikeForumComment(commentId: string): Promise<ForumComment> {
    return mutateComment(
      commentId,
      (id) => getClawRouterAppSdkClient().comment.unlikeForum(id),
      'Failed to unlike forum comment',
    );
  },

  async pinForumComment(commentId: string): Promise<ForumComment> {
    return mutateComment(
      commentId,
      (id) => getClawRouterAppSdkClient().comment.pinForum(id, undefined, createRequestToken('forum-comment-pin')),
      'Failed to pin forum comment',
    );
  },

  async unpinForumComment(commentId: string): Promise<ForumComment> {
    return mutateComment(
      commentId,
      (id) => getClawRouterAppSdkClient().comment.unpinForum(id),
      'Failed to unpin forum comment',
    );
  },
};

function readForumPostList(result: unknown, filters: ForumFeedFilters, message: string): ForumPost[] {
  ensurePlusApiSuccess(result, message);
  const items = readRequiredApiItems(result, message)
    .map(normalizeForumPost)
    .filter((post): post is ForumPost => post !== null);
  return filterForumPostsForCatalog(items, {
    category: filters.category ?? 'All',
    searchQuery: filters.search ?? '',
    sort: filters.sort ?? 'latest',
  });
}

function readForumCommentTree(result: unknown, message: string): ForumComment[] {
  const items = readRequiredApiItems(result, message)
    .map(normalizeForumComment)
    .filter((comment): comment is NormalizedForumComment => comment !== null);
  return buildForumCommentTree(items);
}

function normalizeForumCategoryValues(values: unknown[]): string[] {
  const seen = new Set<string>();
  const categories: string[] = [];
  for (const value of values) {
    const category = normalizeForumCategoryValue(value);
    if (!category || seen.has(category)) {
      continue;
    }
    seen.add(category);
    categories.push(category);
  }
  return categories;
}

function normalizeForumCategoryValue(value: unknown): string | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return categoryFromId(value);
  }
  if (typeof value === 'string') {
    const normalized = value.trim();
    if (!normalized) {
      return null;
    }
    const categoryId = Number(normalized);
    if (Number.isSafeInteger(categoryId)) {
      return categoryFromId(categoryId);
    }
    return normalized;
  }
  if (isRecord(value)) {
    const categoryId = readNumber(value, 'categoryId', Number.NaN);
    if (Number.isFinite(categoryId)) {
      return categoryFromId(categoryId);
    }
    return readString(value, 'name').trim() || readString(value, 'label').trim() || null;
  }
  return null;
}

async function mutateFeed(
  feedId: string,
  operation: (feedId: string) => Promise<unknown>,
  message: string,
): Promise<ForumPost> {
  const result = await operation(requiredSafePathSegment(feedId, 'feedId'));
  ensurePlusApiSuccess(result, message);
  const post = normalizeForumPost(readRequiredApiItem(result, `${message}: response is missing data`));
  if (!post) {
    throw new Error(`${message}: response is invalid`);
  }
  return post;
}

async function mutateComment(
  commentId: string,
  operation: (commentId: string) => Promise<unknown>,
  message: string,
): Promise<ForumComment> {
  const result = await operation(requiredSafePathSegment(commentId, 'commentId'));
  ensurePlusApiSuccess(result, message);
  const comment = normalizeForumComment(readRequiredApiItem(result, `${message}: response is missing data`));
  if (!comment) {
    throw new Error(`${message}: response is invalid`);
  }
  return stripInternalCommentFields(comment);
}

function normalizeFeedQuery(filters: ForumFeedFilters): {
  feedType?: 'hot' | 'recommend' | 'top' | 'most-viewed' | 'most-liked';
  keyword?: string;
  authorId?: number;
  categoryId?: number;
  page?: number;
  size?: number;
  limit?: number;
} {
  return {
    feedType: filters.feedType,
    keyword: optionalText(filters.search, 'search', MAX_FORUM_QUERY_TEXT_LENGTH),
    authorId: optionalPositiveInteger(filters.authorId, 'authorId'),
    categoryId: optionalPositiveInteger(filters.categoryId, 'categoryId'),
    page: optionalPositiveInteger(filters.page, 'page'),
    size: optionalBoundedPositiveInteger(filters.size, 'size', MAX_FORUM_PAGE_SIZE),
    limit: optionalBoundedPositiveInteger(filters.limit, 'limit', MAX_FORUM_PAGE_SIZE),
  };
}

function normalizeCommentQuery(query: ForumCommentQuery): {
  contentType: 'feeds' | 'comments' | 'FEEDS' | 'COMMENTS';
  contentId: number;
  page?: number;
  size?: number;
  limit?: number;
} {
  return {
    contentType: normalizeContentType(query.contentType),
    contentId: optionalPositiveInteger(query.contentId, 'contentId') ?? missingPositiveInteger('contentId'),
    page: optionalPositiveInteger(query.page, 'page'),
    size: optionalBoundedPositiveInteger(query.size, 'size', MAX_FORUM_PAGE_SIZE),
    limit: optionalBoundedPositiveInteger(query.limit, 'limit', MAX_FORUM_PAGE_SIZE),
  };
}

function normalizeCreateFeedRequest(input: ForumFeedInput): SdkForumCreateFeedRequest {
  const content = optionalText(input.content, 'content', 20_000);
  if (!content) {
    throw new Error('content is required');
  }
  return {
    content,
    title: optionalText(input.title, 'title', 255),
    summary: optionalText(input.summary, 'summary', 1024),
    categoryId: input.categoryId,
    images: normalizeStringList(input.images, 20),
    tags: normalizeStringList(input.tags, 32),
    source: optionalText(input.source, 'source', 128),
    sourceUrl: optionalText(input.sourceUrl, 'sourceUrl', 2048),
  };
}

function normalizeCreateCommentRequest(input: ForumCommentInput): SdkForumCreateCommentRequest {
  const content = optionalText(input.content, 'content', 20_000);
  if (!content) {
    throw new Error('content is required');
  }
  return {
    content,
    contentType: normalizeContentType(input.contentType),
    contentId: input.contentId,
    parentId: input.parentId,
    deviceInfo: optionalText(input.deviceInfo, 'deviceInfo', 512),
    ipAddress: optionalText(input.ipAddress, 'ipAddress', 128),
  };
}

function normalizeForumPost(value: unknown): ForumPost | null {
  if (!isRecord(value)) {
    return null;
  }
  const id = readString(value, 'id').trim() || String(readNumber(value, 'contentId', 0));
  const title = readString(value, 'title').trim();
  if (!id || !title) {
    return null;
  }
  const categoryId = readNumber(value, 'categoryId', 0);
  const content = readString(value, 'content');
  const summary = readString(value, 'summary') || content.slice(0, 180);
  return {
    id,
    title,
    author: normalizeForumAuthor(value.author),
    content,
    contentSnippet: summary,
    category: categoryFromId(categoryId),
    tags: readStringArray(value, 'tags'),
    likes: Math.max(0, Math.round(readNumber(value, 'likeCount', 0))),
    views: Math.max(0, Math.round(readNumber(value, 'viewCount', 0))),
    publishedAt: readString(value, 'createdAt') || readString(value, 'updatedAt'),
    comments: [],
    isPinned: readBoolean(value, 'isTop', false),
  };
}

type NormalizedForumComment = ForumComment & {
  parentId?: string;
  rawCreatedAt: string;
};

function normalizeForumComment(value: unknown): NormalizedForumComment | null {
  if (!isRecord(value)) {
    return null;
  }
  const id = readString(value, 'commentId').trim();
  const content = readString(value, 'content').trim();
  if (!id || !content) {
    return null;
  }
  const parentId = readOptionalId(value, 'parentId');
  const rawCreatedAt = readString(value, 'createdAt');
  return {
    id,
    parentId,
    rawCreatedAt,
    author: normalizeForumAuthor(value.author),
    content,
    likes: Math.max(0, Math.round(readNumber(value, 'likes', 0))),
    publishedAt: rawCreatedAt,
    replies: [],
  };
}

function normalizeForumCommentDetail(value: unknown): ForumComment | null {
  const comment = normalizeForumComment(value);
  if (!comment) {
    return null;
  }
  const replies = isRecord(value) && Array.isArray(value.replies)
    ? value.replies
      .map(normalizeForumComment)
      .filter((reply): reply is NormalizedForumComment => reply !== null)
      .map(stripInternalCommentFields)
    : [];
  return {
    ...stripInternalCommentFields(comment),
    replies,
  };
}

function buildForumCommentTree(items: NormalizedForumComment[]): ForumComment[] {
  const commentsById = new Map(items.map((item) => [item.id, stripInternalCommentFields(item)]));
  const roots: ForumComment[] = [];

  for (const item of items) {
    const comment = commentsById.get(item.id);
    if (!comment) {
      continue;
    }
    if (item.parentId && commentsById.has(item.parentId)) {
      const parent = commentsById.get(item.parentId);
      parent?.replies?.push(comment);
      continue;
    }
    roots.push(comment);
  }

  sortComments(roots);
  return roots;
}

function stripInternalCommentFields(comment: NormalizedForumComment): ForumComment {
  return {
    id: comment.id,
    author: comment.author,
    content: comment.content,
    likes: comment.likes,
    publishedAt: comment.publishedAt,
    replies: comment.replies ?? [],
  };
}

function sortComments(comments: ForumComment[]): void {
  comments.sort((left, right) => left.publishedAt.localeCompare(right.publishedAt) || left.id.localeCompare(right.id));
  for (const comment of comments) {
    if (comment.replies) {
      sortComments(comment.replies);
    }
  }
}

function normalizeForumAuthor(value: unknown): ForumAuthor {
  const record = isRecord(value) ? value : {};
  const name = readString(record, 'name').trim() || `User-${readNumber(record, 'id', 0)}`;
  return {
    name,
    avatar: readString(record, 'avatar') || avatarForAuthor(name),
    role: readBoolean(record, 'isFollowing', false) ? 'Following' : undefined,
  };
}

function categoryFromId(categoryId: number): ForumCategory {
  return FORUM_CATEGORY_BY_ID.get(categoryId) ?? 'General Discussion';
}

function readOptionalId(record: Record<string, unknown>, key: string): string | undefined {
  const value = record[key];
  if (value === null || value === undefined || value === '') {
    return undefined;
  }
  if (typeof value === 'number' && Number.isSafeInteger(value) && value > 0) {
    return String(value);
  }
  if (typeof value === 'string' && /^[1-9]\d*$/u.test(value.trim())) {
    return value.trim();
  }
  return undefined;
}

function normalizeContentType(value: string): 'feeds' | 'comments' | 'FEEDS' | 'COMMENTS' {
  if (value === 'feeds' || value === 'comments' || value === 'FEEDS' || value === 'COMMENTS') {
    return value;
  }
  throw new Error('contentType must be feeds or comments');
}

function normalizeStringList(values: string[] | undefined, maxItems: number): string[] | undefined {
  const normalized = (values ?? []).map((value) => value.trim()).filter(Boolean).slice(0, maxItems);
  return normalized.length > 0 ? normalized : undefined;
}

function avatarForAuthor(name: string): string {
  return `https://i.pravatar.cc/150?u=${encodeURIComponent(name)}`;
}

function missingPositiveInteger(fieldName: string): never {
  throw new Error(`${fieldName} must be a positive integer`);
}

export type {
  SdkForumCommentItem,
  SdkForumFeedItem,
};
