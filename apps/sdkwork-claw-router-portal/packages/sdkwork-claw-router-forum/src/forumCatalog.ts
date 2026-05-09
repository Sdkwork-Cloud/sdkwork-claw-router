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
  avatar: string;
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
  publishedAt: string;
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
  qrCodeUrl: string;
  tone: string;
};

export type ForumCatalogViewModel = {
  snapshotSource: typeof FORUM_CONTENT_SNAPSHOT_SOURCE;
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
  snapshotSource: typeof FORUM_CONTENT_SNAPSHOT_SOURCE;
  authorHandle: string;
  publishedAtLabel: string;
  viewsLabel: string;
  likesLabel: string;
  totalCommentCount: number;
  relatedPosts: ForumRelatedPostView[];
};

export const FORUM_CONTENT_SNAPSHOT_SOURCE = {
  sourceLabel: 'Curated forum content snapshot',
  sourceDescription: 'Derived from Java-compatible PlusFeeds, PlusComments, vote, and favorite seed content.',
  observedAt: '2026-05-03',
  sourceTables: [
    'plus_feeds',
    'plus_comments',
    'plus_content_vote',
    'plus_favorite',
  ],
} as const;

export const FORUM_POSTS: ForumPost[] = [
  {
    id: '1',
    title: 'How to optimize routing performance in the latest release?',
    author: {
      name: 'Alex Johnson',
      avatar: 'https://i.pravatar.cc/150?u=1',
      role: 'Maintainer',
    },
    content: `I have been looking into the recent changes in the router architecture and noticed specific opportunities for improving route resolution speed.

The current dynamic segment matching path still behaves like a linear scan in highly dynamic route maps. A radix tree based index would keep static and dynamic path branches easier to inspect while improving lookup behavior for large API surfaces.

The benchmark target should compare the current path against an indexed path matcher using the same route corpus, request mix, and middleware chain. That keeps the discussion tied to measurable routing behavior instead of synthetic microbenchmarks.`,
    contentSnippet: 'A focused radix indexing proposal for measuring and improving route resolution behavior in large dynamic route maps.',
    category: 'Performance',
    tags: ['routing', 'performance', 'v2.0'],
    likes: 124,
    views: 3204,
    publishedAt: '2026-05-03 10:00 UTC',
    isPinned: true,
    comments: [
      {
        id: 'c1',
        author: { name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?u=2' },
        content: 'We saw a similar pattern in a large API workspace. The useful benchmark was route lookup plus middleware resolution, not lookup alone.',
        likes: 45,
        publishedAt: '2026-05-03 10:45 UTC',
        replies: [
          {
            id: 'c1-1',
            author: {
              name: 'Alex Johnson',
              avatar: 'https://i.pravatar.cc/150?u=1',
              role: 'Maintainer',
            },
            content: 'That makes sense. I will add a mixed route corpus and middleware chain to the benchmark notes.',
            likes: 12,
            publishedAt: '2026-05-03 11:15 UTC',
          },
        ],
      },
      {
        id: 'c2',
        author: {
          name: 'David Smith',
          avatar: 'https://i.pravatar.cc/150?u=3',
          role: 'Core Team',
        },
        content: 'The indexed matcher is worth exploring. The key constraint is keeping parameter precedence visible and testable.',
        likes: 89,
        publishedAt: '2026-05-03 11:30 UTC',
      },
    ],
  },
  {
    id: '2',
    title: 'Best practices for organizing large API specs',
    author: { name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?u=2' },
    content: `Large OpenAPI documents become easier to maintain when ownership and release cadence drive the split, not only file size.

We use one package per bounded API surface, shared schema components only for stable cross-surface concepts, and generated SDK compatibility checks for every published operation.`,
    contentSnippet: 'A practical structure for splitting large OpenAPI definitions without losing ownership or SDK compatibility.',
    category: 'Best Practices',
    tags: ['openapi', 'architecture'],
    likes: 89,
    views: 1840,
    publishedAt: '2026-05-03 08:30 UTC',
    comments: [
      {
        id: 'c3',
        author: { name: 'Maya Lin', avatar: 'https://i.pravatar.cc/150?u=4' },
        content: 'The bounded-surface rule helped us keep generated SDK packages from depending on unrelated admin models.',
        likes: 26,
        publishedAt: '2026-05-03 09:10 UTC',
      },
    ],
  },
  {
    id: '3',
    title: 'Introducing the new Middleware Hooks',
    author: {
      name: 'David Smith',
      avatar: 'https://i.pravatar.cc/150?u=3',
      role: 'Core Team',
    },
    content: `The new middleware hooks separate request enrichment, route selection, provider relay, and response settlement into clearer extension points.

This should make custom policy checks easier to test without patching the provider relay path directly.`,
    contentSnippet: 'A release note for the middleware hook structure used by routing, policy, and provider relay extensions.',
    category: 'Announcements',
    tags: ['features', 'middleware'],
    likes: 256,
    views: 5200,
    publishedAt: '2026-05-02 16:00 UTC',
    comments: [
      {
        id: 'c4',
        author: { name: 'Noah Reed', avatar: 'https://i.pravatar.cc/150?u=5' },
        content: 'Keeping provider relay outside policy middleware makes the extension contract much easier to reason about.',
        likes: 33,
        publishedAt: '2026-05-02 17:20 UTC',
      },
    ],
  },
  {
    id: '4',
    title: 'How should API keys be rotated across environments?',
    author: { name: 'Priya Shah', avatar: 'https://i.pravatar.cc/150?u=6' },
    content: `We are standardizing API key rotation across development, staging, and production workspaces.

The main question is whether rotation should be driven by a single policy per tenant or by separate policies per key group.`,
    contentSnippet: 'A support thread about API key rotation policy boundaries for tenant and key-group workflows.',
    category: 'Help & Support',
    tags: ['api-keys', 'security'],
    likes: 41,
    views: 936,
    publishedAt: '2026-05-02 09:45 UTC',
    comments: [],
  },
];

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
}: {
  posts: readonly ForumPost[];
  filters: ForumCatalogFilters;
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
    snapshotSource: FORUM_CONTENT_SNAPSHOT_SOURCE,
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
      membersLabel: formatForumCount(45_219),
      totalPostsLabel: formatForumCount(12_504),
      onlineMembersLabel: formatForumCount(842),
    },
    communityLinks: deriveCommunityLinks(),
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
    snapshotSource: FORUM_CONTENT_SNAPSHOT_SOURCE,
    authorHandle: `@${normalizeHandle(post.author.name)}`,
    publishedAtLabel: post.publishedAt,
    viewsLabel: formatForumCount(post.views),
    likesLabel: formatForumCount(post.likes),
    totalCommentCount: countForumComments(post.comments),
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
    commentsLabel: formatForumCount(countForumComments(post.comments)),
    publishedAtLabel: post.publishedAt,
    isPinned: post.isPinned === true,
  };
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
    commentsLabel: formatForumCount(countForumComments(candidate.comments)),
  }));
}

function deriveCommunityLinks(): ForumCommunityLinkView[] {
  return [
    { id: 'wechat', label: 'WeChat', qrCodeUrl: qrCodeUrl('WeChatGroup_ClawRouter'), tone: 'green' },
    { id: 'official', label: 'Official Account', qrCodeUrl: qrCodeUrl('OfficialAccount_ClawRouter'), tone: 'green' },
    { id: 'qq', label: 'QQ Group', qrCodeUrl: qrCodeUrl('QQGroup_ClawRouter'), tone: 'blue' },
    { id: 'feishu', label: 'Feishu', qrCodeUrl: qrCodeUrl('FeishuGroup_ClawRouter'), tone: 'teal' },
    { id: 'video', label: 'Video Account', qrCodeUrl: qrCodeUrl('VideoAccount_ClawRouter'), tone: 'red' },
    { id: 'douyin', label: 'Douyin', qrCodeUrl: qrCodeUrl('Douyin_ClawRouter'), tone: 'pink' },
  ];
}

function sortForumPosts(posts: ForumPost[], sort: ForumSortKey): ForumPost[] {
  const sorted = [...posts];
  if (sort === 'top') {
    return sorted.sort((left, right) => right.likes - left.likes || left.id.localeCompare(right.id));
  }
  if (sort === 'unanswered') {
    return sorted
      .filter((post) => countForumComments(post.comments) === 0)
      .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));
  }
  return sorted.sort((left, right) => {
    if (left.isPinned !== right.isPinned) {
      return left.isPinned ? -1 : 1;
    }
    return right.publishedAt.localeCompare(left.publishedAt);
  });
}

function qrCodeUrl(value: string): string {
  const url = new URL('https://api.qrserver.com/v1/create-qr-code/');
  url.searchParams.set('size', '150x150');
  url.searchParams.set('data', value);
  return url.toString();
}

function normalizeSearchText(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLowerCase();
}

function normalizeHandle(value: string): string {
  return value.trim().replace(/\s+/g, '').toLowerCase();
}
