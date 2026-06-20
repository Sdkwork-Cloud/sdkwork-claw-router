import type { ClawRouterMediaResource } from 'sdkwork-clawrouter-pc-commons/runtime';

export type ForumCategory =
  | 'Announcements'
  | 'General Discussion'
  | 'Help & Support'
  | 'Best Practices'
  | 'Performance';

export type ForumCategoryFilter = 'All' | ForumCategory;
export type ForumSortKey = 'latest' | 'top' | 'unanswered';

export type ForumAuthor = {
  name: string;
  avatar: ClawRouterMediaResource;
  role?: string;
};

export type ForumComment = {
  id: string;
  author: ForumAuthor;
  content: string;
  likes: number;
  publishedAt: string;
  replies?: ForumComment[];
};

export type ForumPost = {
  id: string;
  title: string;
  author: ForumAuthor;
  content: string;
  contentSnippet: string;
  category: ForumCategory;
  tags: string[];
  likes: number;
  views: number;
  shareCount: number;
  isLiked: boolean;
  isCollected: boolean;
  publishedAt: string;
  commentCount: number;
  comments: ForumComment[];
  isPinned?: boolean;
};

export type ForumCatalogFilters = {
  category: string;
  searchQuery: string;
  sort: ForumSortKey;
};

export type ForumFilterOption = {
  id: ForumCategoryFilter;
  label: string;
  count: number;
};

export type ForumSortTabView = {
  id: ForumSortKey;
  label: string;
};

export type ForumPostCardView = {
  id: string;
  title: string;
  author: ForumAuthor;
  contentSnippet: string;
  category: ForumCategory;
  tags: string[];
  likesLabel: string;
  commentsLabel: string;
  publishedAtLabel: string;
  isPinned: boolean;
};

export type ForumStatsView = {
  membersLabel: string;
  totalPostsLabel: string;
  onlineMembersLabel: string;
};

export type ForumCommunityLinkView = {
  id: string;
  label: string;
  qrCode: ClawRouterMediaResource;
  tone: 'green' | 'blue' | 'teal' | 'red' | 'pink';
};

export type ForumOverviewViewInput = {
  totalPosts: number;
  memberCount: number;
  onlineMembers: number;
  communityLinks: ForumCommunityLinkView[];
  source?: ForumContentSource;
};

export type ForumCatalogViewModel = {
  contentSource: ForumContentSource;
  categoryOptions: ForumFilterOption[];
  sortTabs: ForumSortTabView[];
  filteredPosts: ForumPostCardView[];
  resultCount: number;
  stats: ForumStatsView;
  communityLinks: ForumCommunityLinkView[];
};

export type ForumRelatedPostView = {
  id: string;
  title: string;
  category: ForumCategory;
  commentsLabel: string;
};

export type ForumPostDetailViewModel = {
  post: ForumPost;
  contentSource: ForumContentSource;
  authorHandle: string;
  publishedAtLabel: string;
  viewsLabel: string;
  likesLabel: string;
  shareCountLabel: string;
  isLiked: boolean;
  isCollected: boolean;
  totalCommentCount: number;
  relatedPosts: ForumRelatedPostView[];
};

export type ForumContentSource = {
  sourceLabel: string;
  sourceDescription: string;
  observedAt: string;
  sourceTables: readonly string[];
};

export const FORUM_CONTENT_SOURCE = {
  sourceLabel: 'Live forum content',
  sourceDescription: 'Derived from PlusFeeds, PlusComments, vote, and favorite tables.',
  observedAt: '',
  sourceTables: [
    'content_forum_post',
    'content_comment',
    'content_reaction',
    'content_favorite',
  ],
} as const satisfies ForumContentSource;

export function filterForumPostsForCatalog(
  posts: readonly ForumPost[],
  filters: ForumCatalogFilters,
): ForumPost[] {
  const normalizedCategory = normalizeSearchText(filters.category);
  const normalizedSearch = normalizeSearchText(filters.searchQuery);
  const filtered = posts.filter((post) => {
    const matchCategory = normalizedCategory === '' || normalizedCategory === 'all'
      || normalizeSearchText(post.category) === normalizedCategory;
    const searchableText = normalizeSearchText([
      post.title,
      post.contentSnippet,
      post.category,
      post.author.name,
      ...post.tags,
    ].join(' '));
    const matchSearch = normalizedSearch === '' || searchableText.includes(normalizedSearch);
    return matchCategory && matchSearch;
  });

  return sortForumPosts(filtered, filters.sort);
}

export function deriveForumCatalogViewModel({
  posts,
  filters,
  overview,
}: {
  posts: readonly ForumPost[];
  filters: ForumCatalogFilters;
  overview?: ForumOverviewViewInput;
}): ForumCatalogViewModel {
  const filteredPosts = filterForumPostsForCatalog(posts, filters);
  const categoryOrder: ForumCategoryFilter[] = [
    'All',
    'Announcements',
    'General Discussion',
    'Help & Support',
    'Best Practices',
    'Performance',
  ];

  return {
    contentSource: overview?.source ?? FORUM_CONTENT_SOURCE,
    categoryOptions: categoryOrder.map((category) => ({
      id: category,
      label: category === 'All' ? 'All Categories' : category,
      count: category === 'All' ? posts.length : posts.filter((post) => post.category === category).length,
    })),
    sortTabs: [
      { id: 'latest', label: 'Latest' },
      { id: 'top', label: 'Top' },
      { id: 'unanswered', label: 'Unanswered' },
    ],
    filteredPosts: filteredPosts.map(deriveForumPostCard),
    resultCount: filteredPosts.length,
    stats: {
      membersLabel: formatForumCount(overview?.memberCount ?? 0),
      totalPostsLabel: formatForumCount(overview?.totalPosts ?? 0),
      onlineMembersLabel: formatForumCount(overview?.onlineMembers ?? 0),
    },
    communityLinks: overview?.communityLinks ?? [],
  };
}

export function deriveForumPostDetailView(
  posts: readonly ForumPost[],
  postId: string | undefined,
): ForumPostDetailViewModel | null {
  const post = posts.find((item) => item.id === postId);
  if (!post) {
    return null;
  }

  return {
    post,
    contentSource: FORUM_CONTENT_SOURCE,
    authorHandle: `@${normalizeHandle(post.author.name)}`,
    publishedAtLabel: post.publishedAt,
    viewsLabel: formatForumCount(post.views),
    likesLabel: formatForumCount(post.likes),
    shareCountLabel: formatForumCount(post.shareCount),
    isLiked: post.isLiked,
    isCollected: post.isCollected,
    totalCommentCount: forumPostCommentCount(post),
    relatedPosts: deriveRelatedForumPosts(posts, post),
  };
}

export function countForumComments(comments: readonly ForumComment[]): number {
  return comments.reduce((total, comment) => total + 1 + countForumComments(comment.replies ?? []), 0);
}

export function formatForumCount(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return String(Math.max(0, Math.round(value)));
}

function deriveForumPostCard(post: ForumPost): ForumPostCardView {
  return {
    id: post.id,
    title: post.title,
    author: post.author,
    contentSnippet: post.contentSnippet,
    category: post.category,
    tags: [...post.tags],
    likesLabel: formatForumCount(post.likes),
    commentsLabel: formatForumCount(forumPostCommentCount(post)),
    publishedAtLabel: post.publishedAt,
    isPinned: post.isPinned === true,
  };
}

function forumPostCommentCount(post: ForumPost): number {
  return Math.max(0, Math.round(post.commentCount), countForumComments(post.comments));
}

function deriveRelatedForumPosts(posts: readonly ForumPost[], post: ForumPost): ForumRelatedPostView[] {
  const sameCategory = posts.filter((candidate) => candidate.id !== post.id && candidate.category === post.category);
  const otherPosts = posts
    .filter((candidate) => candidate.id !== post.id && candidate.category !== post.category)
    .sort((left, right) => Math.abs(left.likes - post.likes) - Math.abs(right.likes - post.likes));

  return [...sameCategory, ...otherPosts].slice(0, 3).map((candidate) => ({
    id: candidate.id,
    title: candidate.title,
    category: candidate.category,
    commentsLabel: formatForumCount(forumPostCommentCount(candidate)),
  }));
}

function sortForumPosts(posts: ForumPost[], sort: ForumSortKey): ForumPost[] {
  const sorted = [...posts];
  if (sort === 'top') {
    return sorted.sort((left, right) => right.likes - left.likes || left.id.localeCompare(right.id));
  }
  if (sort === 'unanswered') {
    return sorted
      .filter((post) => forumPostCommentCount(post) === 0)
      .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));
  }
  return sorted.sort((left, right) => {
    if (left.isPinned !== right.isPinned) {
      return left.isPinned ? -1 : 1;
    }
    return right.publishedAt.localeCompare(left.publishedAt);
  });
}

function normalizeSearchText(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLowerCase();
}

function normalizeHandle(value: string): string {
  return value.trim().replace(/\s+/g, '').toLowerCase();
}
