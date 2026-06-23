import type {
  ForumCreateCommentRequest as SdkForumCreateCommentRequest,
  ForumCreateFeedRequest as SdkForumCreateFeedRequest,
  ForumReplyCommentRequest as SdkForumReplyCommentRequest,
  ForumFeedItem as SdkForumFeedItem,
  ForumCommentItem as SdkForumCommentItem,
} from '@sdkwork/clawrouter-app-sdk';
import { toDataURL } from 'qrcode';
import {
  ensureSdkworkApiSuccess,
  getClawRouterAppSdkClient,
  isRecord,
  optionalBoundedPositiveInteger,
  optionalBoundedPositiveInt64String,
  optionalInteger,
  optionalPositiveInt64String,
  optionalPositiveInteger,
  optionalText,
  readApiData,
  readBoolean,
  readMediaResource,
  readNumber,
  readApiRecord,
  readRequiredApiItem,
  readRequiredApiItems,
  readMediaResourceUrl,
  readString,
  readStringArray,
  requiredSafePathSegment,
  toExternalUrlMediaResource,
  type ClawRouterMediaResource,
} from 'sdkwork-clawrouter-pc-commons/runtime';
import {
  filterForumPostsForCatalog,
  type ForumAuthor,
  type ForumCategory,
  type ForumCommunityLinkView,
  type ForumComment,
  type ForumPost,
  type ForumSortKey,
} from './forumCatalog.ts';

const MAX_FORUM_PAGE_SIZE = 100;
const MAX_FORUM_QUERY_TEXT_LENGTH = 128;
const MAX_FEED_IMAGE_COUNT = 20;
const MAX_FEED_IMAGE_LENGTH = 2048;
const MAX_FEED_TAG_COUNT = 20;
const MAX_FEED_TAG_LENGTH = 64;
const FORUM_CATEGORY_BY_ID = new Map<number, ForumCategory>([
  [1000, 'General Discussion'],
  [1001, 'Performance'],
  [1002, 'Best Practices'],
  [1003, 'Help & Support'],
  [1004, 'Announcements'],
]);

export interface ForumFeedFilters {
  type?: 'recommend' | 'hot' | 'top';
  contentType?: 'all' | 'feeds' | 'FEEDS';
  searchQuery?: string;
  category?: string;
  sort?: ForumSortKey;
  page?: unknown;
  size?: unknown;
  authorId?: unknown;
}

interface ForumFeedLimitFilters extends ForumFeedFilters {
  limit?: unknown;
}

export interface ForumCommentQuery {
  contentType: 'feeds' | 'comments' | 'FEEDS' | 'COMMENTS';
  contentId: unknown;
  page?: unknown;
  size?: unknown;
}

export interface ForumFeedInput {
  title?: string;
  content: string;
  categoryId?: number;
  images?: ClawRouterMediaResource[];
  tags?: string[];
  source?: string;
  sourceUrl?: string;
}

export interface ForumFeedStatistics {
  totalComments: number;
}

export interface ForumOverviewStats {
  totalPosts: number;
  totalComments: number;
  memberCount: number;
  onlineMembers: number;
}

export interface ForumOverviewSource {
  sourceLabel: string;
  sourceDescription: string;
  sourceTables: string[];
  observedAt: string;
}

export interface ForumOverview {
  stats: ForumOverviewStats;
  communityLinks: ForumCommunityLinkView[];
  source: ForumOverviewSource;
}

export interface ForumCommentInput {
  contentType: 'feeds' | 'comments' | 'FEEDS' | 'COMMENTS';
  contentId: number;
  content: string;
  deviceInfo?: string;
}

export interface ForumCollectInput {
  folderId?: unknown;
}

export interface ForumReplyInput {
  content: string;
  deviceInfo?: string;
}

export const forumService = {
  async fetchForumOverview(): Promise<ForumOverview> {
    const result = await getClawRouterAppSdkClient().content.feeds.overview.retrieve();
    ensureSdkworkApiSuccess(result, 'Failed to fetch forum overview');
    return normalizeForumOverview(readRequiredApiItem(result, 'Forum overview response is missing data'));
  },

  async fetchForumFeeds(filters: ForumFeedFilters = {}): Promise<ForumPost[]> {
    const query = normalizeFeedQuery(filters);
    const result = await getClawRouterAppSdkClient().content.feeds.list({
      type_: query.type,
      contentType: query.contentType,
      q: query.searchQuery,
      authorId: query.authorId,
      page: query.page,
      pageSize: query.pageSize,
    });
    ensureSdkworkApiSuccess(result, 'Failed to fetch forum feeds');
    const items = readRequiredApiItems(result, 'Failed to fetch forum feeds')
      .map(normalizeForumPost)
      .filter((post): post is ForumPost => post !== null);
    return filterForumPostsForCatalog(items, {
      category: filters.category ?? 'All',
      searchQuery: filters.searchQuery ?? '',
      sort: filters.sort ?? 'latest',
    });
  },

  async fetchHotForumFeeds(filters: ForumFeedLimitFilters = {}): Promise<ForumPost[]> {
    const query = normalizeFeedQuery(filters);
    const result = await getClawRouterAppSdkClient().content.feeds.hot.list({ limit: query.limit });
    return readForumPostList(result, filters, 'Failed to fetch hot forum feeds');
  },

  async fetchRecommendedForumFeeds(filters: ForumFeedLimitFilters = {}): Promise<ForumPost[]> {
    const query = normalizeFeedQuery(filters);
    const result = await getClawRouterAppSdkClient().content.feeds.recommend.list({ limit: query.limit });
    return readForumPostList(result, filters, 'Failed to fetch recommended forum feeds');
  },

  async searchForumFeeds(filters: ForumFeedFilters = {}): Promise<ForumPost[]> {
    const query = normalizeFeedQuery(filters);
    if (!query.searchQuery) {
      return [];
    }
    const result = await getClawRouterAppSdkClient().content.feeds.list({
      q: query.searchQuery,
      page: query.page,
      pageSize: query.pageSize,
    });
    return readForumPostList(result, filters, 'Failed to search forum feeds');
  },

  async fetchTopForumFeeds(filters: ForumFeedLimitFilters = {}): Promise<ForumPost[]> {
    const query = normalizeFeedQuery(filters);
    const result = await getClawRouterAppSdkClient().content.feeds.top.list({ limit: query.limit });
    return readForumPostList(result, filters, 'Failed to fetch top forum feeds');
  },

  async fetchCategoryForumFeeds(categoryId: unknown, filters: ForumFeedFilters = {}): Promise<ForumPost[]> {
    const normalizedCategoryId = optionalPositiveInteger(categoryId, 'categoryId') ?? missingPositiveInteger('categoryId');
    const query = normalizeFeedQuery(filters);
    const result = await getClawRouterAppSdkClient().content.feeds.category.retrieve(String(normalizedCategoryId), {
      page: query.page,
      pageSize: query.pageSize,
    });
    return readForumPostList(result, filters, 'Failed to fetch category forum feeds');
  },

  async fetchMostViewedForumFeeds(filters: ForumFeedLimitFilters = {}): Promise<ForumPost[]> {
    const query = normalizeFeedQuery(filters);
    const result = await getClawRouterAppSdkClient().content.feeds.mostViewed.list({ limit: query.limit });
    return readForumPostList(result, filters, 'Failed to fetch most viewed forum feeds');
  },

  async fetchMostLikedForumFeeds(filters: ForumFeedLimitFilters = {}): Promise<ForumPost[]> {
    const query = normalizeFeedQuery(filters);
    const result = await getClawRouterAppSdkClient().content.feeds.mostLiked.list({ limit: query.limit });
    return readForumPostList(result, filters, 'Failed to fetch most liked forum feeds');
  },

  async fetchForumFeedDetail(feedId: string): Promise<ForumPost | undefined> {
    const result = await getClawRouterAppSdkClient().content.feeds.retrieve(requiredSafePathSegment(feedId, 'feedId'));
    if (readApiData(result) === null || readApiData(result) === undefined) {
      return undefined;
    }
    ensureSdkworkApiSuccess(result, 'Failed to fetch forum feed detail');
    return normalizeForumPost(readRequiredApiItem(result, 'Forum feed detail response is missing data')) ?? undefined;
  },

  async checkForumFeedCollected(feedId: string): Promise<boolean> {
    const result = await getClawRouterAppSdkClient().content.feeds.collections.current.retrieve(requiredSafePathSegment(feedId, 'feedId'));
    return readBooleanResult(result, 'Failed to check forum feed collection');
  },

  async fetchForumComments(query: ForumCommentQuery): Promise<ForumComment[]> {
    const normalized = normalizeCommentQuery(query);
    const result = await getClawRouterAppSdkClient().content.comments.list({
      contentType: normalized.contentType,
      contentId: normalized.contentId,
      page: normalized.page,
      pageSize: normalized.pageSize,
    });
    ensureSdkworkApiSuccess(result, 'Failed to fetch forum comments');
    return readForumCommentTree(result, 'Failed to fetch forum comments');
  },

  async fetchForumCommentReplies(commentId: string, query: Partial<ForumCommentQuery> = {}): Promise<ForumComment[]> {
    const normalizedCommentId = requiredSafePathSegment(commentId, 'commentId');
    const page = optionalPositiveInteger(query.page, 'page');
    const pageSize = optionalBoundedPositiveInteger(query.size, 'size', MAX_FORUM_PAGE_SIZE);
    const result = await getClawRouterAppSdkClient().content.comments.replies.list(normalizedCommentId, {
      page: page === undefined ? undefined : String(page),
      pageSize: pageSize === undefined ? undefined : String(pageSize),
    });
    ensureSdkworkApiSuccess(result, 'Failed to fetch forum comment replies');
    return readForumCommentTree(result, 'Failed to fetch forum comment replies');
  },

  async fetchForumCommentDetail(commentId: string): Promise<ForumComment | undefined> {
    const result = await getClawRouterAppSdkClient().content.comments.retrieve(requiredSafePathSegment(commentId, 'commentId'));
    if (readApiData(result) === null || readApiData(result) === undefined) {
      return undefined;
    }
    ensureSdkworkApiSuccess(result, 'Failed to fetch forum comment detail');
    return normalizeForumCommentDetail(readRequiredApiItem(result, 'Forum comment detail response is missing data')) ?? undefined;
  },

  async fetchMyForumComments(query: Partial<ForumCommentQuery> = {}): Promise<ForumComment[]> {
    const page = optionalPositiveInteger(query.page, 'page');
    const pageSize = optionalBoundedPositiveInteger(query.size, 'size', MAX_FORUM_PAGE_SIZE);
    const result = await getClawRouterAppSdkClient().content.users.current.comments.list({
      page: page === undefined ? undefined : String(page),
      pageSize: pageSize === undefined ? undefined : String(pageSize),
    });
    ensureSdkworkApiSuccess(result, 'Failed to fetch my forum comments');
    return readForumCommentTree(result, 'Failed to fetch my forum comments');
  },

  async fetchForumCommentStatistics(query: ForumCommentQuery): Promise<ForumFeedStatistics> {
    const normalized = normalizeCommentQuery(query);
    const result = await getClawRouterAppSdkClient().content.comments.statistics.list({
      contentType: normalized.contentType,
      contentId: normalized.contentId,
    });
    ensureSdkworkApiSuccess(result, 'Failed to fetch forum comment statistics');
    return {
      totalComments: Math.max(0, Math.round(readNumber(readApiRecord(result), 'totalComments', 0))),
    };
  },

  async createForumFeed(input: ForumFeedInput): Promise<ForumPost> {
    const result = await getClawRouterAppSdkClient().content.feeds.create(
      normalizeCreateFeedRequest(input),
    );
    ensureSdkworkApiSuccess(result, 'Failed to create forum feed');
    const post = normalizeForumPost(readRequiredApiItem(result, 'Created forum feed response is missing data'));
    if (!post) {
      throw new Error('Created forum feed response is invalid');
    }
    return post;
  },

  async deleteForumFeed(feedId: string): Promise<boolean> {
    const result = await getClawRouterAppSdkClient().content.feeds.delete(requiredSafePathSegment(feedId, 'feedId'));
    return readBooleanResult(result, 'Failed to delete forum feed');
  },

  async likeForumFeed(feedId: string): Promise<ForumPost> {
    return mutateFeed(feedId, (id) => getClawRouterAppSdkClient().content.feeds.likes.create(id), 'Failed to like forum feed');
  },

  async unlikeForumFeed(feedId: string): Promise<ForumPost> {
    return mutateFeed(feedId, (id) => getClawRouterAppSdkClient().content.feeds.likes.current.delete(id), 'Failed to unlike forum feed');
  },

  async collectForumFeed(feedId: string, input: ForumCollectInput = {}): Promise<ForumPost> {
  const folderId = optionalPositiveInteger(input.folderId, 'folderId');
  return mutateFeed(feedId, (id) => getClawRouterAppSdkClient().content.feeds.collections.create(id, {
      folderId: folderId === undefined ? undefined : String(folderId),
    }), 'Failed to collect forum feed');
  },

  async uncollectForumFeed(feedId: string): Promise<ForumPost> {
    return mutateFeed(feedId, (id) => getClawRouterAppSdkClient().content.feeds.collections.current.delete(id), 'Failed to uncollect forum feed');
  },

  async shareForumFeed(feedId: string): Promise<ForumPost> {
    return mutateFeed(feedId, (id) => getClawRouterAppSdkClient().content.feeds.shares.create(id), 'Failed to share forum feed');
  },

  async createForumComment(input: ForumCommentInput): Promise<ForumComment> {
    const result = await getClawRouterAppSdkClient().content.comments.create(
      normalizeCreateCommentRequest(input),
    );
    ensureSdkworkApiSuccess(result, 'Failed to create forum comment');
    const comment = normalizeForumComment(readRequiredApiItem(result, 'Created forum comment response is missing data'));
    if (!comment) {
      throw new Error('Created forum comment response is invalid');
    }
    return stripInternalCommentFields(comment);
  },

  async replyForumComment(commentId: string, input: ForumReplyInput): Promise<ForumComment> {
    return mutateComment(
      commentId,
      (id) => getClawRouterAppSdkClient().content.comments.replies.create(
        id,
        normalizeReplyCommentRequest(input),
      ),
      'Failed to reply forum comment',
    );
  },

  async deleteForumComment(commentId: string): Promise<boolean> {
    const result = await getClawRouterAppSdkClient().content.comments.delete(requiredSafePathSegment(commentId, 'commentId'));
    if (result === null || result === undefined) {
      return true;
    }
    ensureSdkworkApiSuccess(result, 'Failed to delete forum comment');
    return true;
  },

  async likeForumComment(commentId: string): Promise<ForumComment> {
    return mutateComment(
      commentId,
      (id) => getClawRouterAppSdkClient().content.comments.likes.create(id),
      'Failed to like forum comment',
    );
  },

  async unlikeForumComment(commentId: string): Promise<ForumComment> {
    return mutateComment(
      commentId,
      (id) => getClawRouterAppSdkClient().content.comments.likes.current.delete(id),
      'Failed to unlike forum comment',
    );
  },

  async pinForumComment(commentId: string): Promise<ForumComment> {
    return mutateComment(
      commentId,
      (id) => getClawRouterAppSdkClient().content.comments.pins.create(id),
      'Failed to pin forum comment',
    );
  },

  async unpinForumComment(commentId: string): Promise<ForumComment> {
    return mutateComment(
      commentId,
      (id) => getClawRouterAppSdkClient().content.comments.pins.current.delete(id),
      'Failed to unpin forum comment',
    );
  },
};

function readForumPostList(result: unknown, filters: ForumFeedFilters, message: string): ForumPost[] {
  ensureSdkworkApiSuccess(result, message);
  const items = readRequiredApiItems(result, message)
    .map(normalizeForumPost)
    .filter((post): post is ForumPost => post !== null);
  return filterForumPostsForCatalog(items, {
    category: filters.category ?? 'All',
    searchQuery: filters.searchQuery ?? '',
    sort: filters.sort ?? 'latest',
  });
}

function readForumCommentTree(result: unknown, message: string): ForumComment[] {
  const items = readRequiredApiItems(result, message)
    .map(normalizeForumComment)
    .filter((comment): comment is NormalizedForumComment => comment !== null);
  return buildForumCommentTree(items);
}

function readBooleanResult(result: unknown, message: string): boolean {
  if (typeof result === 'boolean') {
    return result;
  }
  ensureSdkworkApiSuccess(result, message);
  const data = readApiData(result);
  if (typeof data === 'boolean') {
    return data;
  }
  throw new Error('Forum boolean response is missing boolean data');
}

async function normalizeForumOverview(value: unknown): Promise<ForumOverview> {
  if (!isRecord(value)) {
    throw new Error('Forum overview response is invalid');
  }
  const stats = normalizeForumOverviewStats(value.stats);
  const source = normalizeForumOverviewSource(value.source);
  const communityLinks = await Promise.all(readRecordArray(value, 'communityLinks').map(normalizeForumCommunityLink));
  return {
    stats,
    source,
    communityLinks: communityLinks.filter((link): link is ForumCommunityLinkView => link !== null),
  };
}

function normalizeForumOverviewStats(value: unknown): ForumOverviewStats {
  const record = isRecord(value) ? value : {};
  return {
    totalPosts: readNonNegativeInteger(record, 'totalPosts'),
    totalComments: readNonNegativeInteger(record, 'totalComments'),
    memberCount: readNonNegativeInteger(record, 'memberCount'),
    onlineMembers: readNonNegativeInteger(record, 'onlineMembers'),
  };
}

function normalizeForumOverviewSource(value: unknown): ForumOverviewSource {
  const record = isRecord(value) ? value : {};
  return {
    sourceLabel: readString(record, 'sourceLabel').trim() || 'Live forum data',
    sourceDescription: readString(record, 'sourceDescription').trim()
      || 'Derived from PlusFeeds, PlusComments, vote, and favorite tables.',
    sourceTables: readStringArray(record, 'sourceTables').filter(Boolean),
    observedAt: readString(record, 'observedAt').trim(),
  };
}

async function normalizeForumCommunityLink(value: unknown): Promise<ForumCommunityLinkView | null> {
  if (!isRecord(value)) {
    return null;
  }
  const id = readString(value, 'id').trim();
  const label = readString(value, 'label').trim();
  const url = readString(value, 'url').trim();
  if (!id || !label || !isPublicUrl(url)) {
    return null;
  }
  return {
    id,
    label,
    tone: normalizeCommunityTone(readString(value, 'tone')),
    qrCode: await normalizeCommunityQrCode(value.qrCode, url),
  };
}

async function mutateFeed(
  feedId: string,
  operation: (feedId: string) => Promise<unknown>,
  message: string,
): Promise<ForumPost> {
  const result = await operation(requiredSafePathSegment(feedId, 'feedId'));
  ensureSdkworkApiSuccess(result, message);
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
  ensureSdkworkApiSuccess(result, message);
  const comment = normalizeForumComment(readRequiredApiItem(result, `${message}: response is missing data`));
  if (!comment) {
    throw new Error(`${message}: response is invalid`);
  }
  return stripInternalCommentFields(comment);
}

function normalizeFeedQuery(filters: ForumFeedFilters | ForumFeedLimitFilters): {
  type?: 'recommend' | 'hot' | 'top';
  contentType?: 'all' | 'feeds' | 'FEEDS';
  searchQuery?: string;
  authorId?: string;
  page?: string;
  pageSize?: string;
  limit?: string;
} {
  return {
    type: filters.type,
    contentType: normalizeFeedContentType(filters.contentType),
    searchQuery: optionalText(filters.searchQuery, 'searchQuery', MAX_FORUM_QUERY_TEXT_LENGTH),
    authorId: optionalPositiveInt64String(filters.authorId, 'authorId'),
    page: optionalPositiveInt64String(filters.page, 'page'),
    pageSize: optionalBoundedPositiveInt64String(filters.size, 'size', MAX_FORUM_PAGE_SIZE),
    limit: optionalBoundedPositiveInt64String('limit' in filters ? filters.limit : undefined, 'limit', MAX_FORUM_PAGE_SIZE),
  };
}

function normalizeFeedContentType(value: unknown): 'all' | 'feeds' | 'FEEDS' | undefined {
  const contentType = optionalText(value, 'contentType', 64);
  if (contentType === undefined) {
    return undefined;
  }
  if (contentType === 'all' || contentType === 'feeds' || contentType === 'FEEDS') {
    return contentType;
  }
  throw new Error('contentType must be all or feeds');
}

function normalizeCommentQuery(query: ForumCommentQuery): {
  contentType: 'feeds' | 'comments' | 'FEEDS' | 'COMMENTS';
  contentId: string;
  page?: string;
  pageSize?: string;
} {
  return {
    contentType: normalizeContentType(query.contentType),
    contentId: optionalPositiveInt64String(query.contentId, 'contentId') ?? missingPositiveInteger('contentId'),
    page: optionalPositiveInt64String(query.page, 'page'),
    pageSize: optionalBoundedPositiveInt64String(query.size, 'size', MAX_FORUM_PAGE_SIZE),
  };
}

function normalizeCreateFeedRequest(input: ForumFeedInput): SdkForumCreateFeedRequest {
  const content = optionalText(input.content, 'content', 2000);
  if (!content) {
    throw new Error('content is required');
  }
  return {
    content,
    title: optionalText(input.title, 'title', 255),
    categoryId: optionalNonNegativeInt64String(input.categoryId, 'categoryId'),
    images: normalizeMediaResourceList(input.images, 'images', MAX_FEED_IMAGE_COUNT),
    tags: normalizeStringList(input.tags, 'tags', MAX_FEED_TAG_COUNT, MAX_FEED_TAG_LENGTH),
    source: optionalText(input.source, 'source', 100),
    sourceUrl: optionalText(input.sourceUrl, 'sourceUrl', 500),
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
    contentId: optionalPositiveInt64String(input.contentId, 'contentId') ?? missingPositiveInteger('contentId'),
    deviceInfo: optionalText(input.deviceInfo, 'deviceInfo', 512),
  };
}

function normalizeReplyCommentRequest(input: ForumReplyInput): SdkForumReplyCommentRequest {
  const content = optionalText(input.content, 'content', 20_000);
  if (!content) {
    throw new Error('content is required');
  }
  return {
    content,
    deviceInfo: optionalText(input.deviceInfo, 'deviceInfo', 512),
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
    shareCount: Math.max(0, Math.round(readNumber(value, 'shareCount', 0))),
    isLiked: readBoolean(value, 'isLiked', false),
    isCollected: readBoolean(value, 'isCollected', false),
    publishedAt: readString(value, 'createdAt') || readString(value, 'updatedAt'),
    commentCount: Math.max(0, Math.round(readNumber(value, 'commentCount', 0))),
    comments: [],
    isPinned: readBoolean(value, 'isTop', false),
  };
}

function readRecordArray(record: Record<string, unknown>, key: string): Record<string, unknown>[] {
  const value = record[key];
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter(isRecord);
}

function readNonNegativeInteger(record: Record<string, unknown>, key: string): number {
  return Math.max(0, Math.round(readNumber(record, key, 0)));
}

function normalizeCommunityTone(value: string): ForumCommunityLinkView['tone'] {
  const tone = value.trim();
  if (tone === 'green' || tone === 'blue' || tone === 'teal' || tone === 'red' || tone === 'pink') {
    return tone;
  }
  return 'blue';
}

function isPublicUrl(value: string): boolean {
  if (!value) {
    return false;
  }
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
      return false;
    }
    if (url.username || url.password || /\s/u.test(value)) {
      return false;
    }
    const host = url.hostname.toLowerCase().replace(/\.$/u, '');
    if (
      !host
      || host.length > 253
      || host === 'localhost'
      || host.endsWith('.localhost')
      || host.endsWith('.local')
      || host.endsWith('.internal')
      || isIpAddressHost(host)
    ) {
      return false;
    }
    const labels = host.split('.');
    return labels.length >= 2
      && labels.every(isPublicDnsLabel)
      && /[a-z]/u.test(labels[labels.length - 1] ?? '');
  } catch {
    return false;
  }
}

function isPublicDnsLabel(value: string): boolean {
  return value.length > 0
    && value.length <= 63
    && /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/u.test(value);
}

function isIpAddressHost(host: string): boolean {
  if (/^\d{1,3}(?:\.\d{1,3}){3}$/u.test(host)) {
    return host.split('.').every((part) => Number(part) >= 0 && Number(part) <= 255);
  }
  return host.includes(':');
}

async function normalizeCommunityQrCode(value: unknown, communityUrl: string): Promise<ClawRouterMediaResource> {
  const resource = readMediaResource(value);
  const resourceUrl = readMediaResourceUrl(resource);
  if (resource && isDisplayableCommunityQrCodeResourceUrl(resourceUrl)) {
    return resource;
  }
  return createCommunityQrCodeResource(communityUrl);
}

function isDisplayableCommunityQrCodeResourceUrl(value: string): boolean {
  return value.startsWith('data:image/') || isPublicUrl(value);
}

async function createCommunityQrCodeResource(value: string): Promise<ClawRouterMediaResource> {
  const url = await toDataURL(value, {
    errorCorrectionLevel: 'M',
    margin: 1,
    width: 180,
    color: {
      dark: '#0f172a',
      light: '#ffffff',
    },
  });
  const resource = toExternalUrlMediaResource(url, 'image');
  if (!resource) {
    throw new Error('Community QR code media resource could not be created');
  }
  return resource;
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
    avatar: readMediaResource(record.avatar) || avatarForAuthor(name),
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

function normalizeStringList(
  values: string[] | undefined,
  fieldName: string,
  maxItems: number,
  maxItemLength: number,
): string[] | undefined {
  if (values === undefined || values === null) {
    return undefined;
  }
  if (!Array.isArray(values)) {
    throw new Error(`${fieldName} must be an array`);
  }
  if (values.length > maxItems) {
    throw new Error(`${fieldName} must contain at most ${maxItems} items`);
  }
  const normalized: string[] = [];
  for (const value of values) {
    if (typeof value !== 'string') {
      throw new Error(`${fieldName} item must be a string`);
    }
    const item = value.trim();
    if (!item) {
      continue;
    }
    if (item.length > maxItemLength) {
      throw new Error(`${fieldName} item must be at most ${maxItemLength} characters`);
    }
    normalized.push(item);
  }
  return normalized.length > 0 ? normalized : undefined;
}

function normalizeMediaResourceList(
  values: readonly ClawRouterMediaResource[] | undefined,
  fieldName: string,
  maxItems: number,
): ClawRouterMediaResource[] | undefined {
  if (values === undefined || values === null) {
    return undefined;
  }
  if (!Array.isArray(values)) {
    throw new Error(`${fieldName} must be an array`);
  }
  if (values.length > maxItems) {
    throw new Error(`${fieldName} must contain at most ${maxItems} items`);
  }
  const normalized: ClawRouterMediaResource[] = [];
  for (const value of values) {
    const resource = readMediaResource(value);
    if (!resource) {
      throw new Error(`${fieldName} item must be a MediaResource`);
    }
    normalized.push(resource);
  }
  return normalized.length > 0 ? normalized : undefined;
}

function avatarForAuthor(name: string): ClawRouterMediaResource {
  const label = authorInitials(name);
  const palette = avatarPalette(name);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" rx="48" fill="${palette.background}"/><text x="48" y="56" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="700" fill="${palette.foreground}">${escapeSvgText(label)}</text></svg>`;
  return toExternalUrlMediaResource(`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`, 'image')!;
}

function authorInitials(name: string): string {
  const words = name
    .trim()
    .split(/\s+/u)
    .filter(Boolean);
  if (words.length >= 2) {
    return `${words[0]?.[0] ?? ''}${words[1]?.[0] ?? ''}`.toUpperCase();
  }
  const first = words[0] ?? 'U';
  return Array.from(first).slice(0, 2).join('').toUpperCase() || 'U';
}

function avatarPalette(name: string): { background: string; foreground: string } {
  const palettes = [
    { background: '#0f766e', foreground: '#ecfeff' },
    { background: '#1d4ed8', foreground: '#eff6ff' },
    { background: '#7c2d12', foreground: '#fff7ed' },
    { background: '#166534', foreground: '#f0fdf4' },
    { background: '#6d28d9', foreground: '#faf5ff' },
    { background: '#be123c', foreground: '#fff1f2' },
    { background: '#374151', foreground: '#f9fafb' },
  ];
  let hash = 0;
  for (const character of name) {
    hash = ((hash << 5) - hash + character.charCodeAt(0)) | 0;
  }
  return palettes[Math.abs(hash) % palettes.length] ?? palettes[0];
}

function escapeSvgText(value: string): string {
  return value
    .replace(/&/gu, '&amp;')
    .replace(/</gu, '&lt;')
    .replace(/>/gu, '&gt;')
    .replace(/"/gu, '&quot;')
    .replace(/'/gu, '&apos;');
}

function missingPositiveInteger(fieldName: string): never {
  throw new Error(`${fieldName} must be a positive integer`);
}

function optionalNonNegativeInteger(value: unknown, fieldName: string): number | undefined {
  const numberValue = optionalInteger(value, fieldName);
  if (numberValue === undefined) {
    return undefined;
  }
  if (numberValue < 0) {
    throw new Error(`${fieldName} must be greater than or equal to 0`);
  }
  return numberValue;
}

function optionalNonNegativeInt64String(value: unknown, fieldName: string): string | undefined {
  const numberValue = optionalNonNegativeInteger(value, fieldName);
  return numberValue === undefined ? undefined : String(numberValue);
}

export type {
  SdkForumCommentItem,
  SdkForumFeedItem,
};
