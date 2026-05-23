import { describe, expect, it } from "vitest";
import {
  buildSocialDiscoverySuggestions,
  createSocialPostDigest,
  createSocialPostRouteIntent,
  createSocialProfileRouteIntent,
  createSocialWorkspaceManifest,
  evaluateSocialEngagementReadiness,
  filterSocialPosts,
  resolveSocialProfileActions,
  sortSocialPosts,
  summarizeSocialPostDigests,
  summarizeSocialProfile,
  type SdkworkSocialPost,
  type SdkworkSocialProfile,
} from "../src";

const profiles: SdkworkSocialProfile[] = [
  {
    displayName: "Current User",
    followerCount: 240,
    followingCount: 180,
    id: "current-user",
    postCount: 18,
    relationship: "mutual",
    tags: ["ai", "design"],
  },
  {
    displayName: "Creator Alpha",
    followerCount: 1200,
    followingCount: 120,
    id: "creator-alpha",
    isVerified: true,
    kind: "creator",
    mutualFollowerCount: 4,
    postCount: 44,
    relationship: "not-following",
    tags: ["ai", "video"],
  },
  {
    displayName: "Operator Zen",
    followerCount: 300,
    followingCount: 240,
    id: "operator-zen",
    mutualFollowerCount: 5,
    postCount: 30,
    relationship: "not-following",
    tags: ["ops", "ai"],
  },
  {
    displayName: "Private Team",
    followerCount: 80,
    followingCount: 32,
    id: "private-team",
    isPrivate: true,
    mutualFollowerCount: 1,
    postCount: 9,
    relationship: "follow-requested",
    tags: ["design", "ai"],
  },
  {
    displayName: "Blocked Spam",
    followerCount: 10,
    followingCount: 999,
    id: "blocked-spam",
    postCount: 200,
    relationship: "blocked",
    tags: ["growth"],
  },
];

const posts: SdkworkSocialPost[] = [
  {
    author: profiles[1],
    content: "AI launch recap and visual system notes.",
    createdAt: "2026-04-02T10:30:00.000Z",
    id: "launch-moment",
    isPinned: true,
    media: [{ type: "image", url: "https://example.com/launch.png" }],
    relevanceScore: 82,
    stats: {
      commentCount: 8,
      likeCount: 30,
      repostCount: 4,
      viewCount: 800,
    },
    tags: ["launch", "ai"],
    visibility: "public",
  },
  {
    author: profiles[2],
    content: "AI ops playbook for small teams.",
    createdAt: "2026-04-02T10:40:00.000Z",
    id: "ops-playbook",
    relevanceScore: 91,
    stats: {
      commentCount: 5,
      likeCount: 18,
      repostCount: 2,
      viewCount: 420,
    },
    tags: ["ops", "ai"],
    visibility: "public",
  },
  {
    author: profiles[3],
    content: "Private design sketch for the next campaign.",
    createdAt: "2026-04-02T10:20:00.000Z",
    id: "private-sketch",
    media: [{ type: "image", url: "https://example.com/sketch.png" }],
    relevanceScore: 75,
    stats: {
      commentCount: 3,
      likeCount: 12,
      repostCount: 1,
      viewCount: 210,
    },
    tags: ["design"],
    visibility: "followers",
  },
  {
    author: profiles[0],
    content: "Shipping log from today's iteration.",
    createdAt: "2026-04-02T10:35:00.000Z",
    id: "ship-log",
    relevanceScore: 88,
    stats: {
      commentCount: 2,
      likeCount: 9,
      repostCount: 1,
      viewCount: 180,
    },
    tags: ["engineering"],
    visibility: "public",
  },
  {
    author: profiles[1],
    content: "Video demo reel for the AI authoring flow.",
    createdAt: "2026-04-02T10:10:00.000Z",
    id: "demo-reel",
    media: [{ type: "video", url: "https://example.com/demo.mp4" }],
    relevanceScore: 60,
    stats: {
      commentCount: 11,
      likeCount: 42,
      repostCount: 6,
      viewCount: 1200,
    },
    tags: ["video", "ai"],
    visibility: "public",
  },
];

describe("sdkwork-social-pc-react", () => {
  it("sorts posts by feed mode and filters them by social feed facets", () => {
    expect(sortSocialPosts(posts, { mode: "trending" }).map((post) => post.id)).toEqual([
      "launch-moment",
      "demo-reel",
      "ops-playbook",
      "private-sketch",
      "ship-log",
    ]);

    expect(
      filterSocialPosts(posts, {
        authors: ["creator-alpha", "operator-zen"],
        query: "ai",
        tags: ["launch", "ops"],
        visibilities: ["public"],
      }).map((post) => post.id),
    ).toEqual([
      "launch-moment",
      "ops-playbook",
    ]);
  });

  it("summarizes profile output and resolves follow actions from relationship state", () => {
    expect(summarizeSocialProfile(profiles[1], posts)).toEqual({
      followerCount: 1200,
      followingCount: 120,
      mediaPosts: 2,
      publicPosts: 2,
      totalEngagement: 101,
      totalPosts: 2,
    });

    expect(resolveSocialProfileActions(profiles[4], { supportsMessaging: true })).toEqual({
      canCancelRequest: false,
      canFollow: false,
      canMessage: false,
      canRequestFollow: false,
      canViewPosts: false,
      reason: "blocked",
    });

    expect(resolveSocialProfileActions(profiles[3], { supportsMessaging: true })).toEqual({
      canCancelRequest: true,
      canFollow: false,
      canMessage: false,
      canRequestFollow: false,
      canViewPosts: false,
      reason: "request-pending",
    });
  });

  it("builds discovery suggestions from shared interests, mutuals, and creator signals", () => {
    expect(buildSocialDiscoverySuggestions(profiles[0], profiles)).toEqual([
      {
        profile: profiles[1],
        reasons: ["shared-interest", "mutuals", "verified", "creator"],
        score: 41,
      },
      {
        profile: profiles[2],
        reasons: ["shared-interest", "mutuals"],
        score: 40,
      },
    ]);
  });

  it("creates post digests and summarizes social feed state for creator and timeline surfaces", () => {
    expect(
      createSocialPostDigest(posts[0], {
        activePostId: "launch-moment",
      }),
    ).toEqual({
      authorId: "creator-alpha",
      authorName: "Creator Alpha",
      commentCount: 8,
      contentPreview: "AI launch recap and visual system notes.",
      createdAt: "2026-04-02T10:30:00.000Z",
      digestStatus: "pinned",
      hasMedia: true,
      id: "launch-moment",
      isActive: true,
      isCreator: true,
      isPinned: true,
      isRestricted: false,
      isTrending: true,
      likeCount: 30,
      mediaCount: 1,
      relationship: "not-following",
      repostCount: 4,
      viewCount: 800,
      visibility: "public",
    });

    expect(
      summarizeSocialPostDigests(posts.map((post) => createSocialPostDigest(post))),
    ).toEqual({
      creatorPosts: 2,
      mediaPosts: 3,
      pinnedPosts: 1,
      restrictedPosts: 1,
      totalEngagement: 154,
      totalPosts: 5,
      totalViews: 2810,
      trendingPosts: 2,
    });
  });

  it("evaluates engagement readiness for healthy, degraded, and blocked social actions", () => {
    const restrictedMutualPost: SdkworkSocialPost = {
      author: profiles[0],
      content: "Followers-only product notes.",
      createdAt: "2026-04-02T10:50:00.000Z",
      id: "followers-note",
      stats: {
        commentCount: 1,
        likeCount: 4,
        repostCount: 0,
        viewCount: 120,
      },
      visibility: "followers",
    };

    expect(
      evaluateSocialEngagementReadiness(posts[0], {
        action: "like",
        supportsMessaging: true,
      }),
    ).toEqual({
      capabilities: {
        canComment: true,
        canLike: true,
        canMessageAuthor: false,
        canRepost: true,
      },
      degraded: false,
      issues: [],
      ready: true,
    });

    expect(
      evaluateSocialEngagementReadiness(restrictedMutualPost, {
        action: "comment",
        commentText: "Keep shipping this direction.",
        supportsMessaging: true,
      }),
    ).toEqual({
      capabilities: {
        canComment: true,
        canLike: true,
        canMessageAuthor: true,
        canRepost: false,
      },
      degraded: true,
      issues: ["restricted-visibility"],
      ready: true,
    });

    expect(
      evaluateSocialEngagementReadiness(posts[2], {
        action: "repost",
        supportsMessaging: true,
      }),
    ).toEqual({
      capabilities: {
        canComment: false,
        canLike: false,
        canMessageAuthor: false,
        canRepost: false,
        reason: "request-pending",
      },
      degraded: false,
      issues: ["request-pending", "repost-restricted"],
      ready: false,
    });
  });

  it("creates a social workspace manifest and navigation intents", () => {
    expect(
      createSocialWorkspaceManifest({
        packageNames: ["@sdkwork/social-pc-react", "@sdkwork/search-pc-react"],
        title: "Social",
      }),
    ).toEqual({
      architecture: "pc-react",
      capability: "social",
      description: "Social workspace for timelines, profile discovery, and creator routing.",
      host: "tauri",
      id: "sdkwork-social",
      packageNames: ["@sdkwork/social-pc-react", "@sdkwork/search-pc-react"],
      postRoutePattern: "/social/posts/:postId",
      profileRoutePattern: "/social/profiles/:profileId",
      routePath: "/social",
      theme: {
        color: "lobster",
        preset: "sdkwork",
        selection: "system",
      },
      title: "Social",
    });

    expect(
      createSocialPostRouteIntent("demo-reel", {
        profileId: "creator-alpha",
      }),
    ).toEqual({
      focusWindow: true,
      postId: "demo-reel",
      profileId: "creator-alpha",
      route: "/social/posts/demo-reel?profile=creator-alpha",
      source: "social-feed",
      type: "social-post-route-intent",
    });

    expect(createSocialProfileRouteIntent("creator-alpha")).toEqual({
      focusWindow: true,
      profileId: "creator-alpha",
      route: "/social/profiles/creator-alpha",
      source: "social-discovery",
      type: "social-profile-route-intent",
    });
  });
});
