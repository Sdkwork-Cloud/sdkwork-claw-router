import { describe, expect, it } from "vitest";
import {
  buildCommunityRecommendations,
  createCommunityEntryDigest,
  createCommunityPostRouteIntent,
  createCommunityWorkspaceManifest,
  evaluateCommunityPublicationReadiness,
  filterCommunityEntries,
  normalizeCommunityReviewState,
  sortCommunityEntries,
  summarizeCommunityEntryDigests,
  summarizeCommunityFeed,
  type SdkworkCommunityEntry,
} from "../src";

const teamAvatar = {
  bucketId: "community-media",
  fileName: "sdkwork-team.png",
  id: "media-resource-community-team",
  kind: "image",
  mimeType: "image/png",
  objectKey: "authors/sdkwork-team/avatar.png",
  publicUrl: "https://cdn.sdkwork.ai/community/sdkwork-team.png",
  sizeBytes: "6144",
  source: "object_storage",
} as const;

const entries: SdkworkCommunityEntry[] = [
  {
    author: {
      avatar: teamAvatar,
      id: "author-1",
      name: "Sdkwork Team",
    },
    categoryId: "product",
    id: "assistant-release",
    isFeatured: true,
    isPinned: true,
    kind: "announcement",
    lastActivityAt: "2026-04-02T10:00:00.000Z",
    reviewState: "approved",
    stats: {
      commentCount: 18,
      reactionCount: 60,
      shareCount: 6,
      viewCount: 900,
    },
    tags: ["release", "assistant"],
    title: "Assistant release notes",
  },
  {
    author: {
      id: "author-2",
      name: "Rita",
    },
    categoryId: "support",
    hasAcceptedAnswer: false,
    id: "pricing-help-question",
    kind: "question",
    lastActivityAt: "2026-04-02T10:20:00.000Z",
    reviewState: "approved",
    stats: {
      commentCount: 7,
      reactionCount: 12,
      shareCount: 1,
      viewCount: 200,
    },
    tags: ["pricing", "assistant"],
    title: "How should we package assistant pricing?",
  },
  {
    author: {
      id: "author-3",
      name: "Nina",
    },
    categoryId: "support",
    id: "billing-playbook",
    kind: "discussion",
    lastActivityAt: "2026-04-02T10:10:00.000Z",
    reviewState: "approved",
    stats: {
      commentCount: 9,
      reactionCount: 20,
      shareCount: 3,
      viewCount: 480,
    },
    tags: ["pricing", "billing", "assistant"],
    title: "Billing playbook for assistant plans",
  },
  {
    author: {
      id: "author-4",
      name: "Morgan",
    },
    categoryId: "developer",
    hasAcceptedAnswer: true,
    id: "api-answers",
    kind: "question",
    lastActivityAt: "2026-04-02T10:30:00.000Z",
    reviewState: "approved",
    stats: {
      commentCount: 11,
      reactionCount: 30,
      shareCount: 4,
      viewCount: 620,
    },
    tags: ["api", "assistant"],
    title: "API answers for assistant routing",
  },
  {
    author: {
      id: "author-5",
      name: "Studio Partner",
    },
    categoryId: "marketplace",
    id: "service-design",
    kind: "service",
    lastActivityAt: "2026-04-02T09:30:00.000Z",
    reviewState: "pending-review",
    stats: {
      commentCount: 2,
      reactionCount: 5,
      shareCount: 0,
      viewCount: 110,
    },
    tags: ["design", "assistant"],
    title: "Design service for assistant launch pages",
  },
  {
    author: {
      id: "author-6",
      name: "Mod Bot",
    },
    categoryId: "support",
    id: "spam-thread",
    kind: "discussion",
    lastActivityAt: "2026-04-02T09:40:00.000Z",
    reviewState: "flagged",
    stats: {
      commentCount: 0,
      reactionCount: 1,
      shareCount: 0,
      viewCount: 30,
    },
    tags: ["moderation"],
    title: "Spam thread",
  },
];

describe("sdkwork-community-pc-react", () => {
  it("sorts entries by feed mode and filters them by feed facets", () => {
    expect(sortCommunityEntries(entries, { mode: "trending" }).map((entry) => entry.id)).toEqual([
      "assistant-release",
      "api-answers",
      "billing-playbook",
      "pricing-help-question",
      "service-design",
      "spam-thread",
    ]);

    expect(
      filterCommunityEntries(entries, {
        categories: ["support"],
        query: "pricing",
        reviewStates: ["approved"],
        tags: ["assistant", "billing"],
      }).map((entry) => entry.id),
    ).toEqual([
      "pricing-help-question",
      "billing-playbook",
    ]);
  });

  it("summarizes the feed and normalizes raw moderation states", () => {
    expect(summarizeCommunityFeed(entries)).toEqual({
      featuredEntries: 1,
      flaggedEntries: 1,
      pendingReviewEntries: 1,
      totalEntries: 6,
      unansweredQuestions: 1,
    });

    expect(normalizeCommunityReviewState("published")).toBe("approved");
    expect(normalizeCommunityReviewState("queued")).toBe("pending-review");
    expect(normalizeCommunityReviewState("reported")).toBe("flagged");
    expect(normalizeCommunityReviewState("removed")).toBe("rejected");
    expect(normalizeCommunityReviewState(undefined)).toBe("draft");
  });

  it("builds recommendation rails from category, tags, and engagement", () => {
    expect(buildCommunityRecommendations(entries[1], entries)).toEqual([
      {
        entry: entries[2],
        reasons: ["shared-category", "shared-tag", "trending"],
        score: 69,
      },
      {
        entry: entries[3],
        reasons: ["shared-kind", "shared-tag", "answered", "trending"],
        score: 35,
      },
      {
        entry: entries[0],
        reasons: ["shared-tag", "featured", "trending"],
        score: 23,
      },
    ]);
  });

  it("creates entry digests and summarizes moderation and discovery state", () => {
    const draftEntry: SdkworkCommunityEntry = {
      author: {
        id: "author-7",
        name: "Draft Author",
      },
      categoryId: "support",
      excerpt: "Working draft for the launch support guide.",
      id: "draft-guide",
      kind: "resource",
      reviewState: "draft",
      stats: {
        commentCount: 0,
        reactionCount: 0,
        shareCount: 0,
        viewCount: 12,
      },
      tags: ["guide"],
      title: "Draft support guide",
    };

    const rejectedEntry: SdkworkCommunityEntry = {
      author: {
        id: "author-8",
        name: "Rejected Author",
      },
      categoryId: "support",
      excerpt: "Rejected template copy.",
      id: "rejected-template",
      kind: "discussion",
      reviewState: "rejected",
      stats: {
        commentCount: 0,
        reactionCount: 0,
        shareCount: 0,
        viewCount: 4,
      },
      tags: ["template"],
      title: "Rejected template",
    };

    expect(
      createCommunityEntryDigest(entries[0], {
        activeEntryId: "assistant-release",
      }),
    ).toEqual({
      authorAvatar: teamAvatar,
      authorName: "Sdkwork Team",
      categoryId: "product",
      commentCount: 18,
      digestStatus: "featured",
      id: "assistant-release",
      isActive: true,
      isFeatured: true,
      isPinned: true,
      isTrending: true,
      isUnanswered: false,
      kind: "announcement",
      lastActivityAt: "2026-04-02T10:00:00.000Z",
      reactionCount: 60,
      reviewState: "approved",
      shareCount: 6,
      tagCount: 2,
      title: "Assistant release notes",
      viewCount: 900,
    });

    expect(
      summarizeCommunityEntryDigests([
        createCommunityEntryDigest(entries[0], { activeEntryId: "assistant-release" }),
        createCommunityEntryDigest(entries[1]),
        createCommunityEntryDigest(entries[4]),
        createCommunityEntryDigest(entries[5]),
        createCommunityEntryDigest(draftEntry),
        createCommunityEntryDigest(rejectedEntry),
      ]),
    ).toEqual({
      attentionEntries: 2,
      draftEntries: 1,
      featuredEntries: 1,
      liveEntries: 1,
      rejectedEntries: 1,
      totalEntries: 6,
      trendingEntries: 1,
      unansweredQuestions: 1,
    });
  });

  it("evaluates publication readiness for healthy, degraded, and blocked submission paths", () => {
    expect(
      evaluateCommunityPublicationReadiness(entries[0], {
        hasBody: true,
        minimumTags: 2,
      }),
    ).toEqual({
      checklist: {
        hasBody: true,
        hasCategory: true,
        hasExcerpt: true,
        hasMinimumTags: true,
        hasTitle: true,
      },
      degraded: false,
      issues: [],
      ready: true,
    });

    expect(
      evaluateCommunityPublicationReadiness(
        {
          ...entries[4],
          excerpt: "Design service sprints for AI product launches.",
        },
        {
          allowPendingReview: true,
          hasBody: true,
        },
      ),
    ).toEqual({
      checklist: {
        hasBody: true,
        hasCategory: true,
        hasExcerpt: true,
        hasMinimumTags: true,
        hasTitle: true,
      },
      degraded: true,
      issues: ["pending-review"],
      ready: true,
    });

    expect(
      evaluateCommunityPublicationReadiness(
        {
          ...entries[5],
          kind: "service",
        },
        {
          hasBody: false,
          minimumTags: 2,
        },
      ),
    ).toEqual({
      checklist: {
        hasBody: false,
        hasCategory: true,
        hasExcerpt: false,
        hasMinimumTags: false,
        hasTitle: true,
      },
      degraded: false,
      issues: ["flagged", "missing-body", "missing-excerpt", "missing-tags"],
      ready: false,
    });
  });

  it("creates a community workspace manifest and route intent for desktop shells", () => {
    expect(
      createCommunityWorkspaceManifest({
        packageNames: ["@sdkwork/community-pc-react", "@sdkwork/search-pc-react"],
        title: "Community",
      }),
    ).toEqual({
      architecture: "pc-react",
      capability: "community",
      composerRoutePath: "/community/new",
      description: "Community workspace for discussions, recommendations, and public post routing.",
      detailRoutePattern: "/community/:entryId",
      host: "tauri",
      id: "sdkwork-community",
      packageNames: ["@sdkwork/community-pc-react", "@sdkwork/search-pc-react"],
      routePath: "/community",
      theme: {
        color: "lobster",
        preset: "sdkwork",
        selection: "system",
      },
      title: "Community",
    });

    expect(
      createCommunityPostRouteIntent("pricing-help-question", {
        commentId: "comment-9",
      }),
    ).toEqual({
      commentId: "comment-9",
      entryId: "pricing-help-question",
      focusWindow: true,
      route: "/community/pricing-help-question?comment=comment-9",
      source: "community-feed",
      type: "community-post-route-intent",
    });
  });
});
