import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { clearStoredAppSessionToken } from "./packages/sdkwork-claw-router-commons/src/app-session-token.ts";
import {
  toExternalUrlMediaResource,
  type ClawRouterMediaResource,
} from "./packages/sdkwork-claw-router-commons/src/media-resource.ts";
import { resetClawRouterSdkClients } from "./packages/sdkwork-claw-router-commons/src/sdk-clients.ts";
import {
  FORUM_CONTENT_SOURCE,
  deriveForumCatalogViewModel,
  deriveForumPostDetailView,
  filterForumPostsForCatalog,
  formatForumCount,
  type ForumCatalogFilters,
  type ForumPost,
} from "./packages/sdkwork-claw-router-forum/src/forumCatalog.ts";
import { forumService } from "./packages/sdkwork-claw-router-forum/src/forumService.ts";

const originalFetch = globalThis.fetch;
const originalWindowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");

type CapturedSdkRequest = {
  url: string;
  method: string;
  body: string;
};

const TEST_AVATAR = toExternalUrlMediaResource(
  "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2096%2096%22%3E%3Crect%20width%3D%2296%22%20height%3D%2296%22%20rx%3D%2248%22%20fill%3D%22%230f766e%22%2F%3E%3C%2Fsvg%3E",
  "image",
)!;
const CDN_FORUM_AVATAR = (path: string): ClawRouterMediaResource => toExternalUrlMediaResource(`https://cdn.example.test/${path}`, "image")!;

const FORUM_POSTS: ForumPost[] = [
  {
    id: "1",
    title: "How to optimize routing performance in the latest release?",
    author: {
      name: "Alex Johnson",
      avatar: TEST_AVATAR,
      role: "Maintainer",
    },
    content: "Radix indexing should be measured with a representative route corpus.",
    contentSnippet: "A focused radix indexing proposal for measuring route resolution behavior.",
    category: "Performance",
    tags: ["routing", "performance", "v2.0"],
    likes: 124,
    views: 3204,
    shareCount: 16,
    isLiked: false,
    isCollected: false,
    publishedAt: "2026-05-03 10:00 UTC",
    commentCount: 3,
    isPinned: true,
    comments: [
      {
        id: "c1",
        author: { name: "Sarah Chen", avatar: TEST_AVATAR },
        content: "Measure route lookup plus middleware resolution.",
        likes: 45,
        publishedAt: "2026-05-03 10:45 UTC",
        replies: [
          {
            id: "c1-1",
            author: {
              name: "Alex Johnson",
              avatar: TEST_AVATAR,
              role: "Maintainer",
            },
            content: "I will add a mixed route corpus.",
            likes: 12,
            publishedAt: "2026-05-03 11:15 UTC",
          },
        ],
      },
      {
        id: "c2",
        author: {
          name: "David Smith",
          avatar: TEST_AVATAR,
          role: "Core Team",
        },
        content: "Keep parameter precedence visible and testable.",
        likes: 89,
        publishedAt: "2026-05-03 11:30 UTC",
      },
    ],
  },
  {
    id: "2",
    title: "Best practices for organizing large API specs",
    author: { name: "Sarah Chen", avatar: TEST_AVATAR },
    content: "Ownership and release cadence should drive API spec boundaries.",
    contentSnippet: "A practical structure for splitting large OpenAPI definitions.",
    category: "Best Practices",
    tags: ["openapi", "architecture"],
    likes: 89,
    views: 1840,
    shareCount: 3,
    isLiked: true,
    isCollected: true,
    publishedAt: "2026-05-03 08:30 UTC",
    commentCount: 1,
    comments: [
      {
        id: "c3",
        author: { name: "Maya Lin", avatar: TEST_AVATAR },
        content: "Bounded surfaces kept our generated SDK packages clear.",
        likes: 26,
        publishedAt: "2026-05-03 09:10 UTC",
      },
    ],
  },
  {
    id: "3",
    title: "Introducing the new Middleware Hooks",
    author: {
      name: "David Smith",
      avatar: TEST_AVATAR,
      role: "Core Team",
    },
    content: "Middleware hooks separate enrichment, routing, relay, and settlement.",
    contentSnippet: "A release note for middleware hook extension points.",
    category: "Announcements",
    tags: ["features", "middleware"],
    likes: 256,
    views: 5200,
    shareCount: 31,
    isLiked: false,
    isCollected: false,
    publishedAt: "2026-05-02 16:00 UTC",
    commentCount: 1,
    comments: [
      {
        id: "c4",
        author: { name: "Noah Reed", avatar: TEST_AVATAR },
        content: "This makes the extension contract easier to reason about.",
        likes: 33,
        publishedAt: "2026-05-02 17:20 UTC",
      },
    ],
  },
  {
    id: "4",
    title: "How should API keys be rotated across environments?",
    author: { name: "Priya Shah", avatar: TEST_AVATAR },
    content: "We are standardizing API key rotation across environments.",
    contentSnippet: "A support thread about API key rotation policy boundaries.",
    category: "Help & Support",
    tags: ["api-keys", "security"],
    likes: 41,
    views: 936,
    shareCount: 4,
    isLiked: false,
    isCollected: false,
    publishedAt: "2026-05-02 09:45 UTC",
    commentCount: 0,
    comments: [],
  },
];

async function withAppSdkFetch<T>(
  handler: (url: string, init?: RequestInit) => unknown,
  fn: (captured: CapturedSdkRequest[]) => Promise<T>,
): Promise<T> {
  const captured: CapturedSdkRequest[] = [];
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    enumerable: true,
    value: {},
  });
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    captured.push({
      url,
      method: init?.method ?? "GET",
      body: typeof init?.body === "string" ? init.body : "",
    });
    const result = handler(url, init);
    return new Response(JSON.stringify({ code: "2000", data: result }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }) as typeof fetch;
  clearStoredAppSessionToken();
  resetClawRouterSdkClients();

  try {
    return await fn(captured);
  } finally {
    clearStoredAppSessionToken();
    resetClawRouterSdkClients();
    globalThis.fetch = originalFetch;
    if (originalWindowDescriptor) {
      Object.defineProperty(globalThis, "window", originalWindowDescriptor);
    } else {
      delete (globalThis as { window?: Window }).window;
    }
  }
}

test("forum content source metadata is live and database-backed", () => {
  assert.deepEqual(FORUM_CONTENT_SOURCE, {
    sourceLabel: "Live forum content",
    sourceDescription: "Derived from PlusFeeds, PlusComments, vote, and favorite tables.",
    observedAt: "",
    sourceTables: [
      "plus_feeds",
      "plus_comments",
      "plus_content_vote",
      "plus_favorite",
    ],
  });
});

test("forum catalog view model prefers backend live source metadata when available", () => {
  const view = deriveForumCatalogViewModel({
    posts: FORUM_POSTS,
    filters: {
      category: "All",
      searchQuery: "",
      sort: "latest",
    },
    overview: {
      totalPosts: 4,
      memberCount: 3,
      onlineMembers: 2,
      communityLinks: [],
      source: {
        sourceLabel: "Live forum data",
        sourceDescription: "Aggregated from deployment database state.",
        observedAt: "2026-05-11 10:00:00",
        sourceTables: ["plus_feeds", "plus_comments"],
      },
    },
  });

  assert.deepEqual(view.contentSource, {
    sourceLabel: "Live forum data",
    sourceDescription: "Aggregated from deployment database state.",
    observedAt: "2026-05-11 10:00:00",
    sourceTables: ["plus_feeds", "plus_comments"],
  });
});

test("forum catalog filters are pure case-insensitive and whitespace tolerant", () => {
  const filters: ForumCatalogFilters = {
    category: "  Performance  ",
    searchQuery: "  radix  ",
    sort: "latest",
  };
  const filtered = filterForumPostsForCatalog(FORUM_POSTS, filters);

  assert.deepEqual(filtered.map((post) => post.id), ["1"]);
  assert.notEqual(filtered, FORUM_POSTS);
  assert.deepEqual(FORUM_POSTS.map((post) => post.id), ["1", "2", "3", "4"]);
});

test("forum catalog view model derives categories stats tabs and filtered posts", () => {
  const view = deriveForumCatalogViewModel({
    posts: FORUM_POSTS,
    filters: {
      category: "All",
      searchQuery: " middleware ",
      sort: "top",
    },
  });

  assert.equal(view.contentSource.observedAt, "");
  assert.equal(view.categoryOptions[0].id, "All");
  assert.equal(view.categoryOptions[0].count, FORUM_POSTS.length);
  assert.deepEqual(view.sortTabs.map((tab) => tab.id), ["latest", "top", "unanswered"]);
  assert.deepEqual(view.filteredPosts.map((post) => post.id), ["3"]);
  assert.equal(view.resultCount, 1);
  assert.equal(view.stats.totalPostsLabel, "0");
  assert.equal(view.stats.onlineMembersLabel, "0");
});

test("forum detail view resolves route id comments and author metadata deterministically", () => {
  const detail = deriveForumPostDetailView(FORUM_POSTS, "2");

  assert.notEqual(detail, null);
  assert.equal(detail?.post.id, "2");
  assert.equal(detail?.contentSource.sourceLabel, "Live forum content");
  assert.equal(detail?.publishedAtLabel, "2026-05-03 08:30 UTC");
  assert.equal(detail?.viewsLabel, "1.8K");
  assert.equal(detail?.shareCountLabel, "3");
  assert.equal(detail?.isLiked, true);
  assert.equal(detail?.isCollected, true);
  assert.equal(detail?.totalCommentCount, 1);
  assert.equal(detail?.authorHandle, "@sarahchen");
  assert.deepEqual(detail?.relatedPosts.map((post) => post.id), ["1", "4", "3"]);
  assert.equal(detail?.relatedPosts.some((post) => post.id === "2"), false);
});

test("forum view models prefer live backend comment counts before comment trees are loaded", () => {
  const posts: ForumPost[] = [
    {
      id: "live-1",
      title: "Live statistics from feed list",
      author: { name: "Stats Maintainer", avatar: CDN_FORUM_AVATAR("stats.png") },
      content: "The feed list already includes comment totals.",
      contentSnippet: "The feed list already includes comment totals.",
      category: "Performance",
      tags: ["stats"],
      likes: 10,
      views: 300,
      shareCount: 0,
      isLiked: false,
      isCollected: false,
      publishedAt: "2026-05-11T10:00:00Z",
      commentCount: 5,
      comments: [],
    },
    {
      id: "live-2",
      title: "Related live statistics",
      author: { name: "Forum Operator", avatar: CDN_FORUM_AVATAR("operator.png") },
      content: "Related cards should use backend counts too.",
      contentSnippet: "Related cards should use backend counts too.",
      category: "Performance",
      tags: ["related"],
      likes: 8,
      views: 120,
      shareCount: 0,
      isLiked: false,
      isCollected: false,
      publishedAt: "2026-05-11T09:00:00Z",
      commentCount: 3,
      comments: [],
    },
  ];

  const catalog = deriveForumCatalogViewModel({
    posts,
    filters: { category: "All", searchQuery: "", sort: "latest" },
  });
  const detail = deriveForumPostDetailView(posts, "live-1");

  assert.equal(catalog.filteredPosts[0].commentsLabel, "5");
  assert.equal(detail?.totalCommentCount, 5);
  assert.equal(detail?.relatedPosts[0].commentsLabel, "3");
});

test("forum helpers handle missing detail and count formatting safely", () => {
  assert.equal(deriveForumPostDetailView(FORUM_POSTS, "missing"), null);
  assert.equal(deriveForumPostDetailView(FORUM_POSTS, undefined), null);
  assert.equal(formatForumCount(1_200_000_000), "1.2B");
  assert.equal(formatForumCount(1_200_000), "1.2M");
  assert.equal(formatForumCount(12_504), "12.5K");
  assert.equal(formatForumCount(842), "842");
});

test("forum service loads feeds detail and comments through generated app SDK endpoints", async () => {
  await withAppSdkFetch(
    (url) => {
      const requestUrl = new URL(url, "http://localhost");
      if (requestUrl.pathname === "/app/v3/api/content/feeds") {
        assert.equal(requestUrl.searchParams.get("content_type"), "feeds");
        assert.equal(requestUrl.searchParams.get("q"), "failover");
        assert.equal(requestUrl.searchParams.has("search_query"), false);
        assert.equal(requestUrl.searchParams.get("page"), "1");
        assert.equal(requestUrl.searchParams.get("page_size"), "10");
        return [
          {
            id: 42,
            title: "Provider failover checklist",
            content: "Use explicit health windows before rerouting traffic.",
            summary: "A checklist for provider fallback behavior.",
            contentType: "feeds",
            categoryId: 1001,
            tags: ["routing", "fallback"],
            author: { id: 7, name: "Route Maintainer", avatar: CDN_FORUM_AVATAR("u7.png") },
          viewCount: 1200,
          likeCount: 25,
          commentCount: 2,
          shareCount: 3,
          isLiked: true,
          isCollected: false,
          isTop: true,
          createdAt: "2026-05-09T08:00:00Z",
          },
        ];
      }
      if (requestUrl.pathname === "/app/v3/api/content/feeds/42") {
        return {
          id: 42,
          title: "Provider failover checklist",
          content: "Use explicit health windows before rerouting traffic.",
          summary: "A checklist for provider fallback behavior.",
          contentType: "feeds",
          contentId: 42,
          categoryId: 1001,
          tags: ["routing", "fallback"],
          author: { id: 7, name: "Route Maintainer", avatar: CDN_FORUM_AVATAR("u7.png") },
          viewCount: 1201,
          likeCount: 25,
          commentCount: 2,
          shareCount: 3,
          isLiked: true,
          isCollected: false,
          isTop: true,
          createdAt: "2026-05-09T08:00:00Z",
        };
      }
      if (requestUrl.pathname === "/app/v3/api/content/comments") {
        assert.equal(requestUrl.searchParams.get("content_type"), "feeds");
        assert.equal(requestUrl.searchParams.get("content_id"), "42");
        return {
          items: [
            {
              commentId: "100",
              content: "Keep retries observable.",
              contentType: "FEEDS",
              contentId: 42,
              userId: 8,
              status: "PUBLISHED",
              likes: 5,
              replyCount: 1,
              author: { id: 8, name: "Trace Reviewer", avatar: CDN_FORUM_AVATAR("u8.png") },
              createdAt: "2026-05-09T08:30:00Z",
            },
            {
              commentId: "101",
              content: "Expose retry reason in trace logs.",
              contentType: "FEEDS",
              contentId: 42,
              userId: 9,
              status: "PUBLISHED",
              likes: 2,
              replyCount: 0,
              parentId: 100,
              author: { id: 9, name: "Gateway Operator", avatar: CDN_FORUM_AVATAR("u9.png") },
              createdAt: "2026-05-09T08:35:00Z",
            },
          ],
          totalElements: 2,
          page: 1,
          size: 20,
        };
      }
      throw new Error(`Unexpected forum SDK request: ${requestUrl.pathname}`);
    },
    async (captured) => {
      const posts = await forumService.fetchForumFeeds({ contentType: "feeds", searchQuery: "failover", page: 1, size: 10 });
      const detail = await forumService.fetchForumFeedDetail("42");
      const comments = await forumService.fetchForumComments({ contentType: "feeds", contentId: 42 });

      assert.deepEqual(captured.map((request) => `${request.method} ${request.url}`), [
        "GET /app/v3/api/content/feeds?content_type=feeds&q=failover&page=1&page_size=10",
        "GET /app/v3/api/content/feeds/42",
        "GET /app/v3/api/content/comments?content_type=feeds&content_id=42",
      ]);
      assert.deepEqual(posts.map((post) => post.id), ["42"]);
      assert.equal(posts[0].category, "Performance");
      assert.equal(posts[0].likes, 25);
      assert.equal(posts[0].views, 1200);
      assert.equal(posts[0].isPinned, true);
      assert.equal(posts[0].commentCount, 2);
      assert.equal(posts[0].shareCount, 3);
      assert.equal(posts[0].isLiked, true);
      assert.equal(posts[0].isCollected, false);
      assert.equal(detail?.views, 1201);
      assert.equal(detail?.commentCount, 2);
      assert.equal(detail?.shareCount, 3);
      assert.equal(detail?.isLiked, true);
      assert.equal(detail?.isCollected, false);
      assert.deepEqual(comments.map((comment) => [comment.id, comment.replies?.length ?? 0]), [["100", 1]]);
      assert.equal(comments[0].replies?.[0]?.author.name, "Gateway Operator");
    },
  );
});

test("forum service publishes public discussions without a session bootstrap request", async () => {
  await withAppSdkFetch(
    (url, init) => {
      const requestUrl = new URL(url, "http://localhost");
      assert.notEqual(requestUrl.pathname, "/app/v3/api/auth/sessions");
      if (requestUrl.pathname === "/app/v3/api/content/feeds") {
        assert.equal(init?.method, "POST");
        assert.equal(
          init?.body,
          JSON.stringify({
            content: "Public community publishing should not require an app session.",
            title: "Public forum publishing",
            categoryId: "1000",
            tags: ["community"],
          }),
        );
        return {
          id: 44,
          title: "Public forum publishing",
          content: "Public community publishing should not require an app session.",
          summary: "Public community publishing should not require an app session.",
          contentType: "feeds",
          categoryId: 1000,
          tags: ["community"],
          author: { id: 0, name: "Community Member" },
          viewCount: 0,
          likeCount: 0,
          commentCount: 0,
          shareCount: 0,
          isLiked: false,
          isCollected: false,
          isTop: false,
          createdAt: "2026-05-11T10:00:00Z",
        };
      }
      throw new Error(`Unexpected forum SDK request: ${requestUrl.pathname}`);
    },
    async (captured) => {
      const post = await forumService.createForumFeed({
        title: "Public forum publishing",
        content: "Public community publishing should not require an app session.",
        categoryId: 1000,
        tags: ["community"],
      });

      assert.deepEqual(captured.map((request) => `${request.method} ${request.url}`), [
        "POST /app/v3/api/content/feeds",
      ]);
      assert.equal(post.id, "44");
      assert.equal(post.author.name, "Community Member");
    },
  );
});

test("forum service exposes the complete feed and comment SDK surface", async () => {
  await withAppSdkFetch(
    (url, init) => {
      const requestUrl = new URL(url, "http://localhost");
      const feedItem = {
        id: 42,
        title: "Provider failover checklist",
        content: "Use explicit health windows before rerouting traffic.",
        summary: "A checklist for provider fallback behavior.",
        contentType: "feeds",
        categoryId: 1001,
        tags: ["routing", "fallback"],
        author: { id: 7, name: "Route Maintainer", avatar: CDN_FORUM_AVATAR("u7.png") },
        viewCount: 1200,
        likeCount: 25,
        commentCount: 2,
        shareCount: 3,
        isTop: true,
        createdAt: "2026-05-09T08:00:00Z",
      };
      const commentItem = {
        commentId: "100",
        content: "Keep retries observable.",
        contentType: "FEEDS",
        contentId: 42,
        userId: 8,
        status: "PUBLISHED",
        likes: 5,
        replyCount: 1,
        isTop: false,
        author: { id: 8, name: "Trace Reviewer", avatar: CDN_FORUM_AVATAR("u8.png") },
        createdAt: "2026-05-09T08:30:00Z",
      };
      const replyItem = {
        ...commentItem,
        commentId: "101",
        content: "Expose retry reason in trace logs.",
        parentId: 100,
        userId: 9,
        author: { id: 9, name: "Gateway Operator", avatar: CDN_FORUM_AVATAR("u9.png") },
        createdAt: "2026-05-09T08:35:00Z",
      };
      const feedPage = [feedItem];
      const commentPage = { items: [commentItem], totalElements: 1, page: 1, size: 20 };

      if (requestUrl.pathname === "/app/v3/api/content/feeds/42/collections") {
        assert.equal(requestUrl.searchParams.get("folder_id"), "12");
        assert.equal(init?.body, undefined);
        return { ...feedItem, isCollected: true };
      }
      if (requestUrl.pathname === "/app/v3/api/content/feeds/42/collections/current") {
        return { code: "2000", data: true };
      }
      if (requestUrl.pathname === "/app/v3/api/content/feeds/42" && init?.method === "DELETE") {
        return { code: "2000", data: true };
      }
      if ([
        "/app/v3/api/content/feeds/hot",
        "/app/v3/api/content/feeds/recommend",
        "/app/v3/api/content/feeds",
        "/app/v3/api/content/feeds/top",
        "/app/v3/api/content/feeds/category/1001",
        "/app/v3/api/content/feeds/most_viewed",
        "/app/v3/api/content/feeds/most_liked",
      ].includes(requestUrl.pathname)) {
        return feedPage;
      }
      if (requestUrl.pathname.startsWith("/app/v3/api/content/feeds/")) {
        return feedItem;
      }

      if (requestUrl.pathname === "/app/v3/api/content/comments/100/replies") {
        return { items: [replyItem], totalElements: 1, page: 1, size: 20 };
      }
      if (requestUrl.pathname === "/app/v3/api/content/comments/100/reply") {
        assert.equal(init?.body, JSON.stringify({ content: "Thanks" }));
        return replyItem;
      }
      if (requestUrl.pathname === "/app/v3/api/content/comments/100/likes" && init?.method === "POST") {
        return { ...commentItem, likes: 6 };
      }
      if (requestUrl.pathname === "/app/v3/api/content/comments/100/likes/current" && init?.method === "DELETE") {
        return commentItem;
      }
      if (requestUrl.pathname === "/app/v3/api/content/comments/100/pins" && init?.method === "POST") {
        return { ...commentItem, isTop: true };
      }
      if (requestUrl.pathname === "/app/v3/api/content/comments/100/pins/current" && init?.method === "DELETE") {
        return commentItem;
      }
      if (requestUrl.pathname === "/app/v3/api/content/comments/100" && init?.method === "DELETE") {
        return null;
      }
      if (requestUrl.pathname === "/app/v3/api/content/comments/100") {
        return {
          ...commentItem,
          ipAddress: "127.0.0.1",
          deviceInfo: "node-test",
          updatedAt: "2026-05-09T08:31:00Z",
          replies: [replyItem],
        };
      }
      if (requestUrl.pathname === "/app/v3/api/content/users/current/comments") {
        return commentPage;
      }
      if (requestUrl.pathname === "/app/v3/api/content/comments/statistics") {
        return { totalComments: 2 };
      }
      throw new Error(`Unexpected forum SDK request: ${requestUrl.pathname}`);
    },
    async (captured) => {
      assert.equal((await forumService.fetchHotForumFeeds({ limit: 5 }))[0].id, "42");
      assert.equal((await forumService.fetchRecommendedForumFeeds({ limit: 5 }))[0].id, "42");
      assert.equal((await forumService.searchForumFeeds({ searchQuery: "failover", page: 1, size: 5 }))[0].category, "Performance");
      assert.equal((await forumService.fetchTopForumFeeds({ limit: 5 }))[0].id, "42");
      assert.equal((await forumService.fetchCategoryForumFeeds(1001, { page: 1, size: 5 }))[0].id, "42");
      assert.equal((await forumService.fetchMostViewedForumFeeds({ limit: 5 }))[0].views, 1200);
      assert.equal((await forumService.fetchMostLikedForumFeeds({ limit: 5 }))[0].likes, 25);
      assert.equal((await forumService.collectForumFeed("42", { folderId: 12 })).id, "42");
      assert.equal(await forumService.checkForumFeedCollected("42"), true);
      assert.equal(await forumService.deleteForumFeed("42"), true);

      assert.equal((await forumService.fetchForumCommentReplies("100"))[0].id, "101");
      assert.equal((await forumService.fetchForumCommentDetail("100"))?.replies?.[0]?.id, "101");
      assert.equal(await forumService.deleteForumComment("100"), true);
      assert.equal((await forumService.likeForumComment("100")).likes, 6);
      assert.equal((await forumService.unlikeForumComment("100")).likes, 5);
      assert.equal((await forumService.pinForumComment("100")).likes, 5);
      assert.equal((await forumService.unpinForumComment("100")).likes, 5);
      assert.equal((await forumService.fetchMyForumComments({ page: 1, size: 20 }))[0].id, "100");
      assert.deepEqual(await forumService.fetchForumCommentStatistics({ contentType: "feeds", contentId: 42 }), { totalComments: 2 });
      assert.equal((await forumService.replyForumComment("100", { content: "Thanks" })).id, "101");

      assert.deepEqual(captured.map((request) => `${request.method} ${new URL(request.url, "http://localhost").pathname}`), [
        "GET /app/v3/api/content/feeds/hot",
        "GET /app/v3/api/content/feeds/recommend",
        "GET /app/v3/api/content/feeds",
        "GET /app/v3/api/content/feeds/top",
        "GET /app/v3/api/content/feeds/category/1001",
        "GET /app/v3/api/content/feeds/most_viewed",
        "GET /app/v3/api/content/feeds/most_liked",
        "POST /app/v3/api/content/feeds/42/collections",
        "GET /app/v3/api/content/feeds/42/collections/current",
        "DELETE /app/v3/api/content/feeds/42",
        "GET /app/v3/api/content/comments/100/replies",
        "GET /app/v3/api/content/comments/100",
        "DELETE /app/v3/api/content/comments/100",
        "POST /app/v3/api/content/comments/100/likes",
        "DELETE /app/v3/api/content/comments/100/likes/current",
        "POST /app/v3/api/content/comments/100/pins",
        "DELETE /app/v3/api/content/comments/100/pins/current",
        "GET /app/v3/api/content/users/current/comments",
        "GET /app/v3/api/content/comments/statistics",
        "POST /app/v3/api/content/comments/100/reply",
      ]);
      assert.deepEqual(
        captured.map((request) => `${new URL(request.url, "http://localhost").pathname}?${new URL(request.url, "http://localhost").searchParams.toString()}`),
        [
          "/app/v3/api/content/feeds/hot?limit=5",
          "/app/v3/api/content/feeds/recommend?limit=5",
          "/app/v3/api/content/feeds?q=failover&page=1&page_size=5",
          "/app/v3/api/content/feeds/top?limit=5",
          "/app/v3/api/content/feeds/category/1001?page=1&page_size=5",
          "/app/v3/api/content/feeds/most_viewed?limit=5",
          "/app/v3/api/content/feeds/most_liked?limit=5",
          "/app/v3/api/content/feeds/42/collections?folder_id=12",
          "/app/v3/api/content/feeds/42/collections/current?",
          "/app/v3/api/content/feeds/42?",
          "/app/v3/api/content/comments/100/replies?",
          "/app/v3/api/content/comments/100?",
          "/app/v3/api/content/comments/100?",
          "/app/v3/api/content/comments/100/likes?",
          "/app/v3/api/content/comments/100/likes/current?",
          "/app/v3/api/content/comments/100/pins?",
          "/app/v3/api/content/comments/100/pins/current?",
          "/app/v3/api/content/users/current/comments?page=1&page_size=20",
          "/app/v3/api/content/comments/statistics?content_type=feeds&content_id=42",
          "/app/v3/api/content/comments/100/reply?",
        ],
      );
    },
  );
});

test("forum service loads live forum overview data through generated app SDK endpoints", async () => {
  await withAppSdkFetch(
    (url) => {
      const requestUrl = new URL(url, "http://localhost");
      if (requestUrl.pathname === "/app/v3/api/content/feeds/overview") {
        return {
          stats: {
            totalPosts: 4,
            totalComments: 5,
            memberCount: 3,
            onlineMembers: 2,
          },
          communityLinks: [
            {
              id: "wechat",
              label: "WeChat Group",
              url: "https://community.example.test/wechat",
              tone: "green",
            },
          ],
          source: {
            sourceLabel: "Live forum data",
            sourceTables: ["plus_feeds", "plus_comments"],
            observedAt: "2026-05-11 10:00:00",
          },
        };
      }
      throw new Error(`Unexpected forum SDK request: ${requestUrl.pathname}`);
    },
    async (captured) => {
      const overview = await forumService.fetchForumOverview();

      assert.deepEqual(captured.map((request) => `${request.method} ${request.url}`), [
        "GET /app/v3/api/content/feeds/overview",
      ]);
      assert.equal(overview.stats.totalPosts, 4);
      assert.equal(overview.stats.totalComments, 5);
      assert.equal(overview.stats.memberCount, 3);
      assert.equal(overview.stats.onlineMembers, 2);
      assert.equal(overview.source.sourceLabel, "Live forum data");
      assert.equal(overview.communityLinks[0].id, "wechat");
      assert.equal(overview.communityLinks[0].label, "WeChat Group");
      assert.equal(overview.communityLinks[0].tone, "green");
      assert.equal(overview.communityLinks[0].qrCode.kind, "image");
      assert.match(overview.communityLinks[0].qrCode.url ?? "", /^data:image\//u);
    },
  );
});

test("forum service ignores community links that are not real public URLs", async () => {
  await withAppSdkFetch(
    (url) => {
      const requestUrl = new URL(url, "http://localhost");
      if (requestUrl.pathname === "/app/v3/api/content/feeds/overview") {
        return {
          stats: {
            totalPosts: 0,
            totalComments: 0,
            memberCount: 0,
            onlineMembers: 0,
          },
          communityLinks: [
            {
              id: "public",
              label: "Public Community",
              url: "https://community.example.test/forum",
              qrCode: {
                kind: "image",
                publicUrl: "https://cdn.example.test/qrs/forum.png",
                source: "external_url",
                url: "https://cdn.example.test/qrs/forum.png",
              },
              tone: "teal",
            },
            {
              id: "local",
              label: "Local Community",
              url: "http://127.0.0.1:3900/forum",
              tone: "red",
            },
            {
              id: "userinfo-local",
              label: "Userinfo Local",
              url: "https://community.example.test@127.0.0.1/forum",
              tone: "green",
            },
            {
              id: "userinfo-public",
              label: "Userinfo Public",
              url: "https://operator@community.example.test/forum",
              tone: "green",
            },
            {
              id: "ipv6",
              label: "IPv6 Community",
              url: "https://[2001:db8::1]/forum",
              tone: "green",
            },
            {
              id: "internal",
              label: "Internal Community",
              url: "https://forum.service.internal/community",
              tone: "green",
            },
            {
              id: "script",
              label: "Script Community",
              url: "javascript:alert(1)",
              tone: "pink",
            },
            {
              id: "unsafeQr",
              label: "Unsafe QR",
              url: "https://community.example.test/unsafe-qr",
              qrCode: {
                kind: "image",
                publicUrl: "http://localhost/qrs/forum.png",
                source: "external_url",
                url: "http://localhost/qrs/forum.png",
              },
              tone: "green",
            },
          ],
          source: {
            sourceLabel: "Live forum data",
            sourceDescription: "Derived from PlusFeeds, PlusComments, vote, and favorite tables.",
            sourceTables: ["plus_feeds", "plus_comments"],
            observedAt: "2026-05-11 10:00:00",
          },
        };
      }
      throw new Error(`Unexpected forum SDK request: ${requestUrl.pathname}`);
    },
    async () => {
      const overview = await forumService.fetchForumOverview();

      assert.deepEqual(overview.communityLinks.map((link) => link.id), ["public", "unsafeQr"]);
      assert.equal(overview.communityLinks[0].qrCode.url, "https://cdn.example.test/qrs/forum.png");
      assert.equal(overview.communityLinks[0].tone, "teal");
      assert.match(overview.communityLinks[1].qrCode.url ?? "", /^data:image\//u);
    },
  );
});

test("forum service rejects stale ok-wrapper feed boolean results", async () => {
  await withAppSdkFetch(
    (url) => {
      const requestUrl = new URL(url, "http://localhost");
      if (
        requestUrl.pathname === "/app/v3/api/content/feeds/42/collections/current"
        || requestUrl.pathname === "/app/v3/api/content/feeds/42"
      ) {
        return { ok: true };
      }
      throw new Error(`Unexpected forum SDK request: ${requestUrl.pathname}`);
    },
    async () => {
      await assert.rejects(
        () => forumService.checkForumFeedCollected("42"),
        /boolean data/u,
      );
      await assert.rejects(
        () => forumService.deleteForumFeed("42"),
        /boolean data/u,
      );
    },
  );
});

test("forum service rejects forum request DTOs that violate the generated content API validation contract", async () => {
  await assert.rejects(
    () => forumService.createForumFeed({ content: "Valid content", categoryId: -1 }),
    /categoryId must be greater than or equal to 0/u,
  );
  await assert.rejects(
    () => forumService.createForumFeed({ content: "Valid content", images: Array.from({ length: 21 }, (_, index) => CDN_FORUM_AVATAR(`${index}.png`)) }),
    /images must contain at most 20 items/u,
  );
  await assert.rejects(
    () => forumService.createForumFeed({ content: "Valid content", images: Array.from({ length: 21 }, () => TEST_AVATAR) }),
    /images must contain at most 20 items/u,
  );
  await assert.rejects(
    () => forumService.createForumFeed({ content: "Valid content", images: ["https://cdn.example.test/legacy.png" as never] }),
    /images item must be a MediaResource/u,
  );
  await assert.rejects(
    () => forumService.createForumFeed({ content: "Valid content", tags: Array.from({ length: 21 }, (_, index) => `tag-${index}`) }),
    /tags must contain at most 20 items/u,
  );
  await assert.rejects(
    () => forumService.createForumFeed({ content: "Valid content", tags: ["x".repeat(65)] }),
    /tags item must be at most 64 characters/u,
  );
  await assert.rejects(
    () => forumService.createForumComment({ contentType: "feeds", contentId: 0, content: "Valid comment" }),
    /contentId must be a positive integer/u,
  );
  await assert.rejects(
    () => forumService.createForumComment({ contentType: "feeds", contentId: 42, content: "Valid comment", deviceInfo: "x".repeat(513) }),
    /deviceInfo must be at most 512 characters/u,
  );
  await assert.rejects(
    () => forumService.replyForumComment("100", { content: "Valid reply", deviceInfo: "x".repeat(513) }),
    /deviceInfo must be at most 512 characters/u,
  );
  await assert.rejects(
    () => forumService.collectForumFeed("42", { folderId: 0 }),
    /folderId must be a positive integer/u,
  );
});

test("forum pages use the service boundary instead of raw app HTTP calls", () => {
  const serviceSource = readFileSync(
    new URL("./packages/sdkwork-claw-router-forum/src/forumService.ts", import.meta.url),
    "utf8",
  );
  const forumViewSource = readFileSync(
    new URL("./packages/sdkwork-claw-router-forum/src/components/ForumView.tsx", import.meta.url),
    "utf8",
  );
  const postViewSource = readFileSync(
    new URL("./packages/sdkwork-claw-router-forum/src/components/ForumPostView.tsx", import.meta.url),
    "utf8",
  );

  assert.match(serviceSource, /from '@sdkwork\/clawrouter-app-sdk'/u);
  assert.doesNotMatch(serviceSource, /\bfetch\s*\(/u);
  assert.doesNotMatch(`${forumViewSource}\n${postViewSource}`, /\bfetch\s*\(/u);
  assert.match(forumViewSource, /forumService\.fetchForumFeeds/u);
  assert.match(postViewSource, /forumService\.fetchForumFeedDetail/u);
  assert.match(postViewSource, /forumService\.fetchForumComments/u);
});

test("forum overview page preserves backend live source metadata at the view-model boundary", () => {
  const forumViewSource = readFileSync(
    new URL("./packages/sdkwork-claw-router-forum/src/components/ForumView.tsx", import.meta.url),
    "utf8",
  );

  assert.match(forumViewSource, /source:\s*overview\.source/u);
});

test("forum runtime pages do not use curated static data as live fallback", () => {
  const catalogSource = readFileSync(
    new URL("./packages/sdkwork-claw-router-forum/src/forumCatalog.ts", import.meta.url),
    "utf8",
  );
  const forumViewSource = readFileSync(
    new URL("./packages/sdkwork-claw-router-forum/src/components/ForumView.tsx", import.meta.url),
    "utf8",
  );
  const postViewSource = readFileSync(
    new URL("./packages/sdkwork-claw-router-forum/src/components/ForumPostView.tsx", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(forumViewSource, /\bFORUM_POSTS\b/u);
  assert.doesNotMatch(postViewSource, /\bFORUM_POSTS\b/u);
  assert.doesNotMatch(catalogSource, /\bFORUM_POSTS\b/u);
  assert.doesNotMatch(catalogSource, new RegExp("snapshot" + "Source", "u"));
  assert.doesNotMatch(catalogSource, new RegExp("FORUM_CONTENT_" + "SNAPSHOT_SOURCE", "u"));
  assert.doesNotMatch(`${catalogSource}\n${forumViewSource}\n${postViewSource}`, new RegExp("Published " + "snapshot", "u"));
  assert.doesNotMatch(`${catalogSource}\n${forumViewSource}\n${postViewSource}`, /\bsnapshot\b/iu);
  assert.doesNotMatch(`${catalogSource}\n${forumViewSource}\n${postViewSource}`, /i\.pravatar/u);
  assert.match(forumViewSource, /forumService\.fetchForumOverview/u);
  assert.match(postViewSource, /forumService\.fetchForumFeeds/u);
  assert.doesNotMatch(catalogSource, /WeChatGroup_ClawRouter|OfficialAccount_ClawRouter|QQGroup_ClawRouter|FeishuGroup_ClawRouter|Douyin_ClawRouter/u);
});

test("forum detail view treats non-numeric route ids as not found before SDK calls", () => {
  const postViewSource = readFileSync(
    new URL("./packages/sdkwork-claw-router-forum/src/components/ForumPostView.tsx", import.meta.url),
    "utf8",
  );

  assert.match(postViewSource, /const numericPostId = parsePositiveIntegerId\(id\)/u);
  assert.match(postViewSource, /if \(!numericPostId\)/u);
  assert.match(postViewSource, /loadLiveForumPostDetail\(numericPostId\)/u);
  assert.doesNotMatch(postViewSource, /loadLiveForumPostDetail\(id\)/u);
});

test("forum service follows the generated content API forum contract shape", () => {
  const serviceSource = readFileSync(
    new URL("./packages/sdkwork-claw-router-forum/src/forumService.ts", import.meta.url),
    "utf8",
  );
  const postViewSource = readFileSync(
    new URL("./packages/sdkwork-claw-router-forum/src/components/ForumPostView.tsx", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(serviceSource, /fetchForumFeedCategories/u);
  assert.doesNotMatch(serviceSource, /ForumCollectFeedRequest/u);
  assert.doesNotMatch(serviceSource, /feedType/u);
  assert.doesNotMatch(serviceSource, /summary: optionalText\(input\.summary/u);
  assert.doesNotMatch(serviceSource, /fetchForumComments\([^)]*normalized\.limit/us);
  assert.doesNotMatch(serviceSource, /searchForumFeeds\([^)]*categoryId/us);
  assert.doesNotMatch(serviceSource, /contentType: 'feeds' \| 'comments' \| 'FEEDS' \| 'COMMENTS';\n  contentId: number;\n  content: string;\n  parentId/u);
  assert.match(serviceSource, /interface ForumReplyInput/u);
  assert.match(serviceSource, /async replyForumComment\(commentId: string, input: ForumReplyInput\)/u);
  assert.match(postViewSource, /forumService\.replyForumComment\(commentId,\s*\{\s*content,\s*\}\)/u);
  const replyCallStart = postViewSource.indexOf("forumService.replyForumComment(");
  assert.notEqual(replyCallStart, -1);
  const replyCallEnd = postViewSource.indexOf("});", replyCallStart);
  assert.notEqual(replyCallEnd, -1);
  const replyCallSource = postViewSource.slice(replyCallStart, replyCallEnd + 3);
  assert.doesNotMatch(replyCallSource, /contentType|contentId|parentId/u);
});

test("forum pages wire visible actions to the generated SDK service boundary", () => {
  const forumViewSource = readFileSync(
    new URL("./packages/sdkwork-claw-router-forum/src/components/ForumView.tsx", import.meta.url),
    "utf8",
  );
  const postViewSource = readFileSync(
    new URL("./packages/sdkwork-claw-router-forum/src/components/ForumPostView.tsx", import.meta.url),
    "utf8",
  );

  assert.match(forumViewSource, /forumService\.createForumFeed/u);
  assert.match(postViewSource, /forumService\.createForumComment/u);
  assert.match(postViewSource, /forumService\.replyForumComment/u);
  assert.match(postViewSource, /forumService\.likeForumFeed/u);
  assert.match(postViewSource, /forumService\.unlikeForumFeed/u);
  assert.match(postViewSource, /forumService\.collectForumFeed/u);
  assert.match(postViewSource, /forumService\.uncollectForumFeed/u);
  assert.match(postViewSource, /forumService\.shareForumFeed/u);
  assert.match(postViewSource, /forumService\.likeForumComment/u);
  assert.doesNotMatch(postViewSource, /More actions/u);
  assert.doesNotMatch(postViewSource, />\s*Report\s*</u);
});

test("forum private actions require login before generated SDK mutations", () => {
  const forumViewSource = readFileSync(
    new URL("./packages/sdkwork-claw-router-forum/src/components/ForumView.tsx", import.meta.url),
    "utf8",
  );
  const postViewSource = readFileSync(
    new URL("./packages/sdkwork-claw-router-forum/src/components/ForumPostView.tsx", import.meta.url),
    "utf8",
  );

  assert.match(forumViewSource, /useLocation/u);
  assert.match(forumViewSource, /useNavigate/u);
  assert.match(forumViewSource, /requirePortalLoginForAction/u);
  assert.match(forumViewSource, /buildPortalAuthLoginRedirect/u);
  assert.match(forumViewSource, /openComposer/u);
  assert.match(forumViewSource, /if \(!requirePortalLoginForAction\(\)\) \{\s*return;\s*\}/u);

  assert.match(postViewSource, /useLocation/u);
  assert.match(postViewSource, /useNavigate/u);
  assert.match(postViewSource, /requirePortalLoginForAction/u);
  assert.match(postViewSource, /buildPortalAuthLoginRedirect/u);
  assert.match(postViewSource, /const mutateFeed = async \(operation: \(feedId: string\) => Promise<ForumPost>\) => \{\s*if \(!requirePortalLoginForAction\(\)\) \{\s*return;\s*\}/u);
  assert.match(postViewSource, /const replyToComment = async \(commentId: string, content: string\) => \{\s*if \(!requirePortalLoginForAction\(\)\) \{\s*return;\s*\}/u);
  assert.match(postViewSource, /const likeComment = async \(commentId: string\) => \{\s*if \(!requirePortalLoginForAction\(\)\) \{\s*return;\s*\}/u);

  for (const guardedCall of [
    "forumService.createForumFeed",
    "forumService.createForumComment",
    "forumService.replyForumComment",
    "forumService.likeForumComment",
  ]) {
    const callIndex = `${forumViewSource}\n${postViewSource}`.indexOf(guardedCall);
    assert.notEqual(callIndex, -1, `${guardedCall} must remain wired`);
    const precedingSource = `${forumViewSource}\n${postViewSource}`.slice(Math.max(0, callIndex - 500), callIndex);
    assert.match(
      precedingSource,
      /requirePortalLoginForAction\(\)/u,
      `${guardedCall} must be guarded before the SDK mutation`,
    );
  }

  for (const feedMutation of [
    "forumService.unlikeForumFeed",
    "forumService.likeForumFeed",
    "forumService.uncollectForumFeed",
    "forumService.collectForumFeed",
    "forumService.shareForumFeed",
  ]) {
    assert.match(postViewSource, new RegExp(feedMutation.replaceAll(".", "\\."), "u"));
  }
  assert.match(postViewSource, /toggleLikeFeed[\s\S]*await mutateFeed\(\(feedId\) => \(/u);
  assert.match(postViewSource, /toggleCollectFeed[\s\S]*await mutateFeed\(\(feedId\) => \(/u);
  assert.match(postViewSource, /onClick=\{\(\) => void mutateFeed\(\(feedId\) => forumService\.shareForumFeed\(feedId\)\)\}/u);
});
