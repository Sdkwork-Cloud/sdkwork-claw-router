import {
  createSdkworkAppCapabilityManifest,
  type CreateSdkworkAppCapabilityManifestOptions,
  type SdkworkAppCapabilityManifest,
  type SdkworkMediaResource,
} from "@sdkwork/appbase-pc-react";

export type SdkworkSocialFeedMode = "following" | "for-you" | "media" | "trending";
export type SdkworkSocialMediaType = SdkworkMediaResource["kind"];
export type SdkworkSocialProfileKind = "creator" | "personal" | "studio";
export type SdkworkSocialRelationship =
  | "blocked"
  | "follow-requested"
  | "following"
  | "mutual"
  | "not-following";
export type SdkworkSocialVisibility = "followers" | "private" | "public";

export type SdkworkSocialMediaItem = SdkworkMediaResource;

export interface SdkworkSocialProfile {
  avatar?: SdkworkMediaResource;
  bio?: string;
  displayName: string;
  followerCount?: number;
  followingCount?: number;
  id: string;
  isPrivate?: boolean;
  isVerified?: boolean;
  kind?: SdkworkSocialProfileKind;
  lastActiveAt?: Date | number | string | null;
  mutualFollowerCount?: number;
  postCount?: number;
  relationship: SdkworkSocialRelationship;
  tags?: readonly string[];
}

export interface SdkworkSocialPostStats {
  commentCount?: number;
  likeCount?: number;
  repostCount?: number;
  viewCount?: number;
}

export interface SdkworkSocialPost {
  author: SdkworkSocialProfile;
  content: string;
  createdAt: Date | number | string;
  id: string;
  isPinned?: boolean;
  media?: readonly SdkworkSocialMediaItem[];
  relevanceScore?: number;
  stats: SdkworkSocialPostStats;
  tags?: readonly string[];
  updatedAt?: Date | number | string | null;
  visibility: SdkworkSocialVisibility;
}

export interface SortSocialPostsOptions {
  mode?: SdkworkSocialFeedMode;
}

export interface FilterSocialPostsOptions extends SortSocialPostsOptions {
  authors?: readonly string[];
  mediaOnly?: boolean;
  query?: string;
  tags?: readonly string[];
  visibilities?: readonly SdkworkSocialVisibility[];
}

export interface SdkworkSocialProfileSummary {
  followerCount: number;
  followingCount: number;
  mediaPosts: number;
  publicPosts: number;
  totalEngagement: number;
  totalPosts: number;
}

export interface ResolveSocialProfileActionsOptions {
  supportsMessaging?: boolean;
}

export interface SdkworkSocialProfileActions {
  canCancelRequest: boolean;
  canFollow: boolean;
  canMessage: boolean;
  canRequestFollow: boolean;
  canViewPosts: boolean;
  reason?: "blocked" | "private" | "request-pending";
}

export type SdkworkSocialDiscoveryReason =
  | "creator"
  | "mutuals"
  | "shared-interest"
  | "verified";

export interface SdkworkSocialDiscoverySuggestion {
  profile: SdkworkSocialProfile;
  reasons: SdkworkSocialDiscoveryReason[];
  score: number;
}

export interface BuildSocialDiscoverySuggestionsOptions {
  limit?: number;
}

export type SdkworkSocialPostDigestStatus = "pinned" | "restricted" | "standard" | "trending";

export interface CreateSocialPostDigestOptions {
  activePostId?: string;
}

export interface SdkworkSocialPostDigest {
  authorId: string;
  authorName: string;
  commentCount: number;
  contentPreview: string;
  createdAt: Date | number | string;
  digestStatus: SdkworkSocialPostDigestStatus;
  hasMedia: boolean;
  id: string;
  isActive: boolean;
  isCreator: boolean;
  isPinned: boolean;
  isRestricted: boolean;
  isTrending: boolean;
  likeCount: number;
  mediaCount: number;
  relationship: SdkworkSocialRelationship;
  repostCount: number;
  viewCount: number;
  visibility: SdkworkSocialVisibility;
}

export interface SdkworkSocialPostDigestSummary {
  creatorPosts: number;
  mediaPosts: number;
  pinnedPosts: number;
  restrictedPosts: number;
  totalEngagement: number;
  totalPosts: number;
  totalViews: number;
  trendingPosts: number;
}

export interface SdkworkSocialWorkspaceManifest extends SdkworkAppCapabilityManifest {
  capability: "social";
  postRoutePattern: string;
  profileRoutePattern: string;
  routePath: string;
}

export interface CreateSocialWorkspaceManifestOptions
  extends Partial<
    Pick<CreateSdkworkAppCapabilityManifestOptions, "description" | "host" | "id" | "packageNames" | "theme" | "title">
  > {
  routePath?: string;
}

export interface SdkworkSocialPostRouteIntent {
  focusWindow: boolean;
  postId: string;
  profileId?: string;
  route: string;
  source: "social-feed";
  type: "social-post-route-intent";
}

export interface CreateSocialPostRouteIntentOptions {
  basePath?: string;
  focusWindow?: boolean;
  profileId?: string;
}

export interface SdkworkSocialProfileRouteIntent {
  focusWindow: boolean;
  profileId: string;
  route: string;
  source: "social-discovery";
  type: "social-profile-route-intent";
}

export interface CreateSocialProfileRouteIntentOptions {
  basePath?: string;
  focusWindow?: boolean;
}

export type SdkworkSocialEngagementAction = "comment" | "like" | "message-author" | "repost";
export type SdkworkSocialEngagementIssue =
  | "blocked"
  | "empty-comment"
  | "private"
  | "request-pending"
  | "repost-restricted"
  | "restricted-visibility";

export interface EvaluateSocialEngagementReadinessOptions extends ResolveSocialProfileActionsOptions {
  action?: SdkworkSocialEngagementAction;
  commentText?: string;
}

export interface SdkworkSocialEngagementCapabilities {
  canComment: boolean;
  canLike: boolean;
  canMessageAuthor: boolean;
  canRepost: boolean;
  reason?: "blocked" | "private" | "request-pending";
}

export interface SdkworkSocialEngagementReadiness {
  capabilities: SdkworkSocialEngagementCapabilities;
  degraded: boolean;
  issues: SdkworkSocialEngagementIssue[];
  ready: boolean;
}

function toTimestamp(value: Date | number | string | null | undefined): number {
  if (value === null || value === undefined) {
    return 0;
  }

  const timestamp = value instanceof Date ? value.getTime() : new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function normalizeQuery(value: string | undefined): string {
  return value?.trim().toLowerCase() ?? "";
}

function includesNormalized(value: string | undefined, query: string): boolean {
  return Boolean(value?.toLowerCase().includes(query));
}

function activityTimestamp(post: SdkworkSocialPost): number {
  return toTimestamp(post.updatedAt ?? post.createdAt);
}

function engagementScore(post: SdkworkSocialPost): number {
  return (
    (post.stats.likeCount ?? 0) * 8 +
    (post.stats.commentCount ?? 0) * 10 +
    (post.stats.repostCount ?? 0) * 12 +
    Math.floor((post.stats.viewCount ?? 0) / 25)
  );
}

function hasMedia(post: SdkworkSocialPost): boolean {
  return (post.media?.length ?? 0) > 0;
}

function isTrendingPost(post: SdkworkSocialPost): boolean {
  return engagementScore(post) >= 300;
}

function resolveSocialPostDigestStatus(
  post: SdkworkSocialPost,
): SdkworkSocialPostDigestStatus {
  if (post.isPinned) {
    return "pinned";
  }

  if (post.visibility !== "public") {
    return "restricted";
  }

  if (isTrendingPost(post)) {
    return "trending";
  }

  return "standard";
}

function createContentPreview(content: string): string {
  const normalized = content.trim().replace(/\s+/g, " ");
  return normalized.length <= 120 ? normalized : `${normalized.slice(0, 117)}...`;
}

function toUniqueSocialEngagementIssues(
  issues: readonly SdkworkSocialEngagementIssue[],
): SdkworkSocialEngagementIssue[] {
  return Array.from(new Set(issues));
}

function toUniquePackages(packageNames: readonly string[]): string[] {
  return Array.from(new Set(packageNames.map((packageName) => packageName.trim()).filter(Boolean)));
}

function matchingTagCount(currentProfile: SdkworkSocialProfile, candidate: SdkworkSocialProfile): number {
  const currentTags = new Set((currentProfile.tags ?? []).map((tag) => tag.toLowerCase()));
  let count = 0;

  for (const tag of candidate.tags ?? []) {
    if (currentTags.has(tag.toLowerCase())) {
      count += 1;
    }
  }

  return count;
}

export function sortSocialPosts(
  posts: readonly SdkworkSocialPost[],
  options: SortSocialPostsOptions = {},
): SdkworkSocialPost[] {
  const mode = options.mode ?? "following";

  return [...posts].sort((left, right) => {
    const pinnedDifference = Number(Boolean(right.isPinned)) - Number(Boolean(left.isPinned));
    if (pinnedDifference !== 0) {
      return pinnedDifference;
    }

    if (mode === "media") {
      const mediaDifference = Number(hasMedia(right)) - Number(hasMedia(left));
      if (mediaDifference !== 0) {
        return mediaDifference;
      }
    }

    if (mode === "for-you") {
      const relevanceDifference = (right.relevanceScore ?? 0) - (left.relevanceScore ?? 0);
      if (relevanceDifference !== 0) {
        return relevanceDifference;
      }
    }

    if (mode === "trending") {
      const scoreDifference = engagementScore(right) - engagementScore(left);
      if (scoreDifference !== 0) {
        return scoreDifference;
      }
    }

    const activityDifference = activityTimestamp(right) - activityTimestamp(left);
    if (activityDifference !== 0) {
      return activityDifference;
    }

    const scoreDifference = engagementScore(right) - engagementScore(left);
    if (scoreDifference !== 0) {
      return scoreDifference;
    }

    return left.id.localeCompare(right.id);
  });
}

export function filterSocialPosts(
  posts: readonly SdkworkSocialPost[],
  options: FilterSocialPostsOptions = {},
): SdkworkSocialPost[] {
  const authors = options.authors ? new Set(options.authors) : null;
  const tags = options.tags ? new Set(options.tags.map((tag) => tag.toLowerCase())) : null;
  const visibilities = options.visibilities ? new Set(options.visibilities) : null;
  const query = normalizeQuery(options.query);

  return sortSocialPosts(posts, { mode: options.mode }).filter((post) => {
    if (authors && !authors.has(post.author.id)) {
      return false;
    }

    if (options.mediaOnly && !hasMedia(post)) {
      return false;
    }

    if (visibilities && !visibilities.has(post.visibility)) {
      return false;
    }

    if (tags && !post.tags?.some((tag) => tags.has(tag.toLowerCase()))) {
      return false;
    }

    if (!query) {
      return true;
    }

    return (
      includesNormalized(post.content, query) ||
      includesNormalized(post.author.displayName, query) ||
      Boolean(post.tags?.some((tag) => tag.toLowerCase().includes(query)))
    );
  });
}

export function summarizeSocialProfile(
  profile: SdkworkSocialProfile,
  posts: readonly SdkworkSocialPost[],
): SdkworkSocialProfileSummary {
  const authoredPosts = posts.filter((post) => post.author.id === profile.id);

  return {
    followerCount: profile.followerCount ?? 0,
    followingCount: profile.followingCount ?? 0,
    mediaPosts: authoredPosts.filter((post) => hasMedia(post)).length,
    publicPosts: authoredPosts.filter((post) => post.visibility === "public").length,
    totalEngagement: authoredPosts.reduce(
      (sum, post) => sum + (post.stats.likeCount ?? 0) + (post.stats.commentCount ?? 0) + (post.stats.repostCount ?? 0),
      0,
    ),
    totalPosts: authoredPosts.length,
  };
}

export function resolveSocialProfileActions(
  profile: SdkworkSocialProfile,
  options: ResolveSocialProfileActionsOptions = {},
): SdkworkSocialProfileActions {
  if (profile.relationship === "blocked") {
    return {
      canCancelRequest: false,
      canFollow: false,
      canMessage: false,
      canRequestFollow: false,
      canViewPosts: false,
      reason: "blocked",
    };
  }

  if (profile.relationship === "follow-requested") {
    return {
      canCancelRequest: true,
      canFollow: false,
      canMessage: false,
      canRequestFollow: false,
      canViewPosts: false,
      reason: "request-pending",
    };
  }

  if (profile.isPrivate && profile.relationship === "not-following") {
    return {
      canCancelRequest: false,
      canFollow: false,
      canMessage: false,
      canRequestFollow: true,
      canViewPosts: false,
      reason: "private",
    };
  }

  if (profile.relationship === "following" || profile.relationship === "mutual") {
    return {
      canCancelRequest: false,
      canFollow: false,
      canMessage: Boolean(options.supportsMessaging),
      canRequestFollow: false,
      canViewPosts: true,
      reason: undefined,
    };
  }

  return {
    canCancelRequest: false,
    canFollow: true,
    canMessage: false,
    canRequestFollow: false,
    canViewPosts: true,
    reason: undefined,
  };
}

export function createSocialPostDigest(
  post: SdkworkSocialPost,
  options: CreateSocialPostDigestOptions = {},
): SdkworkSocialPostDigest {
  return {
    authorId: post.author.id,
    authorName: post.author.displayName,
    commentCount: post.stats.commentCount ?? 0,
    contentPreview: createContentPreview(post.content),
    createdAt: post.createdAt,
    digestStatus: resolveSocialPostDigestStatus(post),
    hasMedia: hasMedia(post),
    id: post.id,
    isActive: post.id === options.activePostId,
    isCreator: post.author.kind === "creator",
    isPinned: Boolean(post.isPinned),
    isRestricted: post.visibility !== "public",
    isTrending: isTrendingPost(post),
    likeCount: post.stats.likeCount ?? 0,
    mediaCount: post.media?.length ?? 0,
    relationship: post.author.relationship,
    repostCount: post.stats.repostCount ?? 0,
    viewCount: post.stats.viewCount ?? 0,
    visibility: post.visibility,
  };
}

export function summarizeSocialPostDigests(
  digests: readonly SdkworkSocialPostDigest[],
): SdkworkSocialPostDigestSummary {
  let creatorPosts = 0;
  let mediaPosts = 0;
  let pinnedPosts = 0;
  let restrictedPosts = 0;
  let totalEngagement = 0;
  let totalViews = 0;
  let trendingPosts = 0;

  for (const digest of digests) {
    totalEngagement += digest.likeCount + digest.commentCount + digest.repostCount;
    totalViews += digest.viewCount;

    if (digest.isCreator) {
      creatorPosts += 1;
    }

    if (digest.hasMedia) {
      mediaPosts += 1;
    }

    if (digest.isPinned) {
      pinnedPosts += 1;
    }

    if (digest.isRestricted) {
      restrictedPosts += 1;
    }

    if (digest.isTrending) {
      trendingPosts += 1;
    }
  }

  return {
    creatorPosts,
    mediaPosts,
    pinnedPosts,
    restrictedPosts,
    totalEngagement,
    totalPosts: digests.length,
    totalViews,
    trendingPosts,
  };
}

export function evaluateSocialEngagementReadiness(
  post: SdkworkSocialPost,
  options: EvaluateSocialEngagementReadinessOptions = {},
): SdkworkSocialEngagementReadiness {
  const action = options.action ?? "like";
  const profileActions = resolveSocialProfileActions(post.author, options);
  const restrictedVisibility = post.visibility !== "public";
  const commentText = options.commentText?.trim() ?? "";
  const capabilities: SdkworkSocialEngagementCapabilities = {
    canComment: profileActions.canViewPosts,
    canLike: profileActions.canViewPosts,
    canMessageAuthor: profileActions.canMessage,
    canRepost: profileActions.canViewPosts && post.visibility === "public",
    ...(profileActions.reason ? { reason: profileActions.reason } : {}),
  };
  const issues = toUniqueSocialEngagementIssues([
    ...(profileActions.reason ? [profileActions.reason] : []),
    ...(action === "comment" && commentText.length === 0 ? ["empty-comment" as const] : []),
    ...(action !== "message-author" && restrictedVisibility && profileActions.canViewPosts
      ? ["restricted-visibility" as const]
      : []),
    ...(action === "repost" && post.visibility !== "public" ? ["repost-restricted" as const] : []),
  ]);
  const blockedIssues = new Set<SdkworkSocialEngagementIssue>([
    "blocked",
    "empty-comment",
    "private",
    "request-pending",
    "repost-restricted",
  ]);
  const ready =
    action === "comment"
      ? capabilities.canComment && issues.every((issue) => !blockedIssues.has(issue))
      : action === "message-author"
        ? capabilities.canMessageAuthor && issues.every((issue) => !blockedIssues.has(issue))
        : action === "repost"
          ? capabilities.canRepost && issues.every((issue) => !blockedIssues.has(issue))
          : capabilities.canLike && issues.every((issue) => !blockedIssues.has(issue));

  return {
    capabilities,
    degraded: ready && issues.includes("restricted-visibility"),
    issues,
    ready,
  };
}

export function buildSocialDiscoverySuggestions(
  currentProfile: SdkworkSocialProfile,
  profiles: readonly SdkworkSocialProfile[],
  options: BuildSocialDiscoverySuggestionsOptions = {},
): SdkworkSocialDiscoverySuggestion[] {
  return profiles
    .filter((profile) => profile.id !== currentProfile.id && profile.relationship === "not-following")
    .map((profile) => {
      const reasons: SdkworkSocialDiscoveryReason[] = [];
      let score = 0;

      const sharedInterests = matchingTagCount(currentProfile, profile);
      if (sharedInterests > 0) {
        reasons.push("shared-interest");
        score += sharedInterests * 10;
      }

      if ((profile.mutualFollowerCount ?? 0) > 0) {
        reasons.push("mutuals");
        score += (profile.mutualFollowerCount ?? 0) * 6;
      }

      if (profile.isVerified) {
        reasons.push("verified");
        score += 4;
      }

      if (profile.kind === "creator") {
        reasons.push("creator");
        score += 3;
      }

      return {
        profile,
        reasons,
        score,
      };
    })
    .filter((item) => item.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return (right.profile.followerCount ?? 0) - (left.profile.followerCount ?? 0);
    })
    .slice(0, options.limit ?? 3);
}

export function createSocialWorkspaceManifest({
  description = "Social workspace for timelines, profile discovery, and creator routing.",
  host,
  id = "sdkwork-social",
  packageNames = ["@sdkwork/social-pc-react"],
  routePath = "/social",
  theme,
  title = "Social",
}: CreateSocialWorkspaceManifestOptions = {}): SdkworkSocialWorkspaceManifest {
  return {
    ...createSdkworkAppCapabilityManifest({
      description,
      host,
      id,
      packageNames: toUniquePackages(packageNames),
      theme,
      title,
    }),
    capability: "social",
    postRoutePattern: `${routePath}/posts/:postId`,
    profileRoutePattern: `${routePath}/profiles/:profileId`,
    routePath,
  };
}

export function createSocialPostRouteIntent(
  postId: string,
  options: CreateSocialPostRouteIntentOptions = {},
): SdkworkSocialPostRouteIntent {
  const query = options.profileId ? `?profile=${encodeURIComponent(options.profileId)}` : "";

  return {
    focusWindow: options.focusWindow !== false,
    postId,
    profileId: options.profileId,
    route: `${options.basePath ?? "/social"}/posts/${postId}${query}`,
    source: "social-feed",
    type: "social-post-route-intent",
  };
}

export function createSocialProfileRouteIntent(
  profileId: string,
  options: CreateSocialProfileRouteIntentOptions = {},
): SdkworkSocialProfileRouteIntent {
  return {
    focusWindow: options.focusWindow !== false,
    profileId,
    route: `${options.basePath ?? "/social"}/profiles/${profileId}`,
    source: "social-discovery",
    type: "social-profile-route-intent",
  };
}

export const socialPackageMeta = {
  architecture: "pc-react",
  domain: "communication",
  package: "@sdkwork/social-pc-react",
  status: "ready",
} as const;

export type SocialPackageMeta = typeof socialPackageMeta;
