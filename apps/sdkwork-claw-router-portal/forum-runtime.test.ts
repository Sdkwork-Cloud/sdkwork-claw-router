import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { clearStoredAppSessionToken } from "./packages/sdkwork-claw-router-commons/src/app-session-token.ts";
import { resetClawRouterSdkClients } from "./packages/sdkwork-claw-router-commons/src/sdk-clients.ts";
import {
  FORUM_CONTENT_SNAPSHOT_SOURCE,
  FORUM_POSTS,
  deriveForumCatalogViewModel,
  deriveForumPostDetailView,
  filterForumPostsForCatalog,
  formatForumCount,
  type ForumCatalogFilters,
} from "./packages/sdkwork-claw-router-forum/src/forumCatalog.ts";
import { forumService } from "./packages/sdkwork-claw-router-forum/src/forumService.ts";

const originalFetch = globalThis.fetch;
const originalWindowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");

type CapturedSdkRequest = {
  url: string;
  method: string;
  body: string;
};

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

test("forum content snapshot metadata is explicit and release-bound", () => {
  assert.deepEqual(FORUM_CONTENT_SNAPSHOT_SOURCE, {
    sourceLabel: "Curated forum content snapshot",
    sourceDescription: "Derived from Java-compatible PlusFeeds, PlusComments, vote, and favorite seed content.",
    observedAt: "2026-05-03",
    sourceTables: [
      "plus_feeds",
      "plus_comments",
      "plus_content_vote",
      "plus_favorite",
    ],
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

  assert.equal(view.snapshotSource.observedAt, "2026-05-03");
  assert.equal(view.categoryOptions[0].id, "All");
  assert.equal(view.categoryOptions[0].count, FORUM_POSTS.length);
  assert.deepEqual(view.sortTabs.map((tab) => tab.id), ["latest", "top", "unanswered"]);
  assert.deepEqual(view.filteredPosts.map((post) => post.id), ["3"]);
  assert.equal(view.resultCount, 1);
  assert.equal(view.stats.totalPostsLabel, "12.5K");
  assert.equal(view.stats.onlineMembersLabel, "842");
});

test("forum detail view resolves route id comments and author metadata deterministically", () => {
  const detail = deriveForumPostDetailView(FORUM_POSTS, "2");

  assert.notEqual(detail, null);
  assert.equal(detail?.post.id, "2");
  assert.equal(detail?.snapshotSource.sourceLabel, "Curated forum content snapshot");
  assert.equal(detail?.publishedAtLabel, "2026-05-03 08:30 UTC");
  assert.equal(detail?.viewsLabel, "1.8K");
  assert.equal(detail?.totalCommentCount, 1);
  assert.equal(detail?.authorHandle, "@sarahchen");
  assert.deepEqual(detail?.relatedPosts.map((post) => post.id), ["1", "4", "3"]);
  assert.equal(detail?.relatedPosts.some((post) => post.id === "2"), false);
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
      if (requestUrl.pathname === "/app/v3/api/feeds/list") {
        assert.equal(requestUrl.searchParams.get("keyword"), "failover");
        assert.equal(requestUrl.searchParams.get("page"), "1");
        assert.equal(requestUrl.searchParams.get("size"), "10");
        return {
          items: [
            {
              id: "42",
              title: "Provider failover checklist",
              content: "Use explicit health windows before rerouting traffic.",
              summary: "A checklist for provider fallback behavior.",
              contentType: "feeds",
              contentId: 42,
              categoryId: 1001,
              tags: ["routing", "fallback"],
              author: { id: 7, name: "Route Maintainer", avatar: "https://cdn.example.test/u7.png" },
              viewCount: 1200,
              likeCount: 25,
              commentCount: 2,
              isTop: true,
              createdAt: "2026-05-09T08:00:00Z",
            },
          ],
          totalElements: 1,
        };
      }
      if (requestUrl.pathname === "/app/v3/api/feeds/detail/42") {
        return {
          id: "42",
          title: "Provider failover checklist",
          content: "Use explicit health windows before rerouting traffic.",
          summary: "A checklist for provider fallback behavior.",
          contentType: "feeds",
          contentId: 42,
          categoryId: 1001,
          tags: ["routing", "fallback"],
          author: { id: 7, name: "Route Maintainer", avatar: "https://cdn.example.test/u7.png" },
          viewCount: 1201,
          likeCount: 25,
          commentCount: 2,
          isTop: true,
          createdAt: "2026-05-09T08:00:00Z",
        };
      }
      if (requestUrl.pathname === "/app/v3/api/comments/list") {
        assert.equal(requestUrl.searchParams.get("contentType"), "feeds");
        assert.equal(requestUrl.searchParams.get("contentId"), "42");
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
              author: { id: 8, name: "Trace Reviewer", avatar: "https://cdn.example.test/u8.png" },
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
              author: { id: 9, name: "Gateway Operator", avatar: "https://cdn.example.test/u9.png" },
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
      const posts = await forumService.fetchForumFeeds({ search: "failover", page: 1, size: 10 });
      const detail = await forumService.fetchForumFeedDetail("42");
      const comments = await forumService.fetchForumComments({ contentType: "feeds", contentId: 42 });

      assert.deepEqual(captured.map((request) => `${request.method} ${request.url}`), [
        "GET /app/v3/api/feeds/list?keyword=failover&page=1&size=10",
        "GET /app/v3/api/feeds/detail/42",
        "GET /app/v3/api/comments/list?contentType=feeds&contentId=42",
      ]);
      assert.deepEqual(posts.map((post) => post.id), ["42"]);
      assert.equal(posts[0].category, "Performance");
      assert.equal(posts[0].likes, 25);
      assert.equal(posts[0].views, 1200);
      assert.equal(posts[0].isPinned, true);
      assert.equal(detail?.views, 1201);
      assert.deepEqual(comments.map((comment) => [comment.id, comment.replies?.length ?? 0]), [["100", 1]]);
      assert.equal(comments[0].replies?.[0]?.author.name, "Gateway Operator");
    },
  );
});

test("forum service exposes the complete feed and comment SDK surface", async () => {
  await withAppSdkFetch(
    (url, init) => {
      const requestUrl = new URL(url, "http://localhost");
      const feedItem = {
        id: "42",
        title: "Provider failover checklist",
        content: "Use explicit health windows before rerouting traffic.",
        summary: "A checklist for provider fallback behavior.",
        contentType: "feeds",
        contentId: 42,
        categoryId: 1001,
        tags: ["routing", "fallback"],
        author: { id: 7, name: "Route Maintainer", avatar: "https://cdn.example.test/u7.png" },
        viewCount: 1200,
        likeCount: 25,
        commentCount: 2,
        shareCount: 3,
        favoriteCount: 4,
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
        author: { id: 8, name: "Trace Reviewer", avatar: "https://cdn.example.test/u8.png" },
        createdAt: "2026-05-09T08:30:00Z",
      };
      const replyItem = {
        ...commentItem,
        commentId: "101",
        content: "Expose retry reason in trace logs.",
        parentId: 100,
        userId: 9,
        author: { id: 9, name: "Gateway Operator", avatar: "https://cdn.example.test/u9.png" },
        createdAt: "2026-05-09T08:35:00Z",
      };
      const feedPage = { items: [feedItem], totalElements: 1 };
      const commentPage = { items: [commentItem], totalElements: 1, page: 1, size: 20 };

      if (requestUrl.pathname === "/app/v3/api/feeds/categories") {
        return ["1001", "1004"];
      }
      if (requestUrl.pathname === "/app/v3/api/feeds/check-collected/42") {
        return { ok: true };
      }
      if (requestUrl.pathname === "/app/v3/api/feeds/42" && init?.method === "DELETE") {
        return { ok: true };
      }
      if ([
        "/app/v3/api/feeds/hot",
        "/app/v3/api/feeds/recommend",
        "/app/v3/api/feeds/search",
        "/app/v3/api/feeds/top",
        "/app/v3/api/feeds/category/1001",
        "/app/v3/api/feeds/most-viewed",
        "/app/v3/api/feeds/most-liked",
      ].includes(requestUrl.pathname)) {
        return feedPage;
      }
      if (requestUrl.pathname.startsWith("/app/v3/api/feeds/")) {
        return feedItem;
      }

      if (requestUrl.pathname === "/app/v3/api/comments/100/replies") {
        return { items: [replyItem], totalElements: 1, page: 1, size: 20 };
      }
      if (requestUrl.pathname === "/app/v3/api/comments/100/reply") {
        return replyItem;
      }
      if (requestUrl.pathname === "/app/v3/api/comments/100/like" && init?.method === "POST") {
        return { ...commentItem, likes: 6 };
      }
      if (requestUrl.pathname === "/app/v3/api/comments/100/like" && init?.method === "DELETE") {
        return commentItem;
      }
      if (requestUrl.pathname === "/app/v3/api/comments/100/pin" && init?.method === "POST") {
        return { ...commentItem, isTop: true };
      }
      if (requestUrl.pathname === "/app/v3/api/comments/100/pin" && init?.method === "DELETE") {
        return commentItem;
      }
      if (requestUrl.pathname === "/app/v3/api/comments/100" && init?.method === "DELETE") {
        return { ok: true };
      }
      if (requestUrl.pathname === "/app/v3/api/comments/100") {
        return {
          ...commentItem,
          ipAddress: "127.0.0.1",
          deviceInfo: "node-test",
          updatedAt: "2026-05-09T08:31:00Z",
          replies: [replyItem],
        };
      }
      if (requestUrl.pathname === "/app/v3/api/comments/my") {
        return commentPage;
      }
      if (requestUrl.pathname === "/app/v3/api/comments/statistics") {
        return { totalComments: 2 };
      }
      throw new Error(`Unexpected forum SDK request: ${requestUrl.pathname}`);
    },
    async (captured) => {
      assert.equal((await forumService.fetchHotForumFeeds({ search: "failover", page: 1, size: 5 }))[0].id, "42");
      assert.equal((await forumService.fetchRecommendedForumFeeds({ search: "failover" }))[0].id, "42");
      assert.equal((await forumService.searchForumFeeds({ search: "failover", categoryId: 1001 }))[0].category, "Performance");
      assert.equal((await forumService.fetchTopForumFeeds({ limit: 5 }))[0].id, "42");
      assert.equal((await forumService.fetchCategoryForumFeeds(1001, { page: 1, size: 5 }))[0].id, "42");
      assert.equal((await forumService.fetchMostViewedForumFeeds({ limit: 5 }))[0].views, 1200);
      assert.equal((await forumService.fetchMostLikedForumFeeds({ limit: 5 }))[0].likes, 25);
      assert.deepEqual(await forumService.fetchForumFeedCategories(), ["Performance", "Announcements"]);
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
      assert.equal((await forumService.replyForumComment("100", { contentType: "feeds", contentId: 42, content: "Thanks" })).id, "101");

      assert.deepEqual(captured.map((request) => `${request.method} ${new URL(request.url, "http://localhost").pathname}`), [
        "GET /app/v3/api/feeds/hot",
        "GET /app/v3/api/feeds/recommend",
        "GET /app/v3/api/feeds/search",
        "GET /app/v3/api/feeds/top",
        "GET /app/v3/api/feeds/category/1001",
        "GET /app/v3/api/feeds/most-viewed",
        "GET /app/v3/api/feeds/most-liked",
        "GET /app/v3/api/feeds/categories",
        "GET /app/v3/api/feeds/check-collected/42",
        "DELETE /app/v3/api/feeds/42",
        "GET /app/v3/api/comments/100/replies",
        "GET /app/v3/api/comments/100",
        "DELETE /app/v3/api/comments/100",
        "POST /app/v3/api/comments/100/like",
        "DELETE /app/v3/api/comments/100/like",
        "POST /app/v3/api/comments/100/pin",
        "DELETE /app/v3/api/comments/100/pin",
        "GET /app/v3/api/comments/my",
        "GET /app/v3/api/comments/statistics",
        "POST /app/v3/api/comments/100/reply",
      ]);
    },
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
  assert.match(postViewSource, /forumService\.shareForumFeed/u);
  assert.match(postViewSource, /forumService\.likeForumComment/u);
  assert.doesNotMatch(postViewSource, /More actions/u);
  assert.doesNotMatch(postViewSource, />\s*Report\s*</u);
});
