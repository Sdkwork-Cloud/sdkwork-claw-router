import {
  createSdkworkAppCapabilityManifest,
  type CreateSdkworkAppCapabilityManifestOptions,
  type SdkworkAppCapabilityManifest,
} from "@sdkwork/appbase-pc-react";

export type SdkworkDocsArticleKind = "concept" | "guide" | "quickstart" | "reference";

export interface SdkworkDocsCollection {
  enabled?: boolean;
  id: string;
  priority: number;
  title: string;
}

export interface SdkworkDocsSection {
  collectionId: string;
  enabled?: boolean;
  id: string;
  priority: number;
  title: string;
}

export interface SdkworkDocsArticle {
  collectionId: string;
  estimatedReadMinutes?: number;
  featured?: boolean;
  id: string;
  kind: SdkworkDocsArticleKind;
  priority: number;
  published?: boolean;
  sectionId: string;
  slug: string;
  summary?: string;
  tags?: readonly string[];
  title: string;
  updatedAt?: string;
}

export interface SdkworkDocsQuickstartStep {
  anchorId?: string;
  articleId: string;
  id: string;
  optional?: boolean;
  priority: number;
  title: string;
}

export interface SdkworkDocsSectionSummary {
  articleIds: string[];
  featuredArticleIds: string[];
  id: string;
  priority: number;
  title: string;
}

export interface SdkworkDocsCollectionSummary {
  articleIds: string[];
  featuredArticleIds: string[];
  id: string;
  priority: number;
  sectionSummaries: SdkworkDocsSectionSummary[];
  title: string;
}

export interface SdkworkDocsOverview {
  collectionSummaries: SdkworkDocsCollectionSummary[];
  featuredArticleIds: string[];
  quickstartStepIds: string[];
  recentlyUpdatedArticleIds: string[];
  totalPublishedArticles: number;
}

export interface BuildDocsOverviewInput {
  articles: readonly SdkworkDocsArticle[];
  collections: readonly SdkworkDocsCollection[];
  quickstartSteps?: readonly SdkworkDocsQuickstartStep[];
  sections: readonly SdkworkDocsSection[];
}

export type SdkworkDocsArticleDigestStatus =
  | "current"
  | "featured"
  | "fresh"
  | "reference"
  | "restricted"
  | "standard";

export interface CreateDocsArticleDigestOptions {
  activeCollectionId?: string;
  activeSectionId?: string;
  basePath?: string;
  collections?: readonly SdkworkDocsCollection[];
  currentArticleId?: string;
  now?: string;
  quickstartSteps?: readonly SdkworkDocsQuickstartStep[];
  recentWindowDays?: number;
  sections?: readonly SdkworkDocsSection[];
}

export interface SdkworkDocsArticleDigest {
  collectionId: string;
  collectionTitle?: string;
  digestStatus: SdkworkDocsArticleDigestStatus;
  estimatedReadMinutes: number;
  hasQuickstart: boolean;
  id: string;
  isAvailable: boolean;
  isCurrent: boolean;
  isFeatured: boolean;
  isFresh: boolean;
  isPublished: boolean;
  kind: SdkworkDocsArticleKind;
  matchesCollection: boolean;
  matchesSection: boolean;
  route: string;
  sectionId: string;
  sectionTitle?: string;
  tagCount: number;
  title: string;
  updatedAt?: string;
}

export interface SdkworkDocsArticleDigestSummary {
  availableArticles: number;
  currentArticles: number;
  featuredArticles: number;
  freshArticles: number;
  quickstartArticles: number;
  referenceArticles: number;
  restrictedArticles: number;
  totalArticles: number;
  totalEstimatedReadMinutes: number;
}

export interface SdkworkDocsQuickstart {
  articleIds: string[];
  requiredStepIds: string[];
  stepIds: string[];
}

export interface BuildDocsQuickstartInput {
  articles: readonly SdkworkDocsArticle[];
  steps: readonly SdkworkDocsQuickstartStep[];
}

export interface ResolveDocsLandingRouteOptions {
  articles: readonly SdkworkDocsArticle[];
  basePath?: string;
  collectionId?: string;
  fallbackRoute?: string;
  preferredArticleSlug?: string;
}

export interface SdkworkDocsOutlineItem {
  id: string;
  level: number;
  title: string;
}

export type SdkworkDocsNavigationAction =
  | "bookmark"
  | "continue-quickstart"
  | "open"
  | "share";

export type SdkworkDocsNavigationIssue =
  | "anchor-missing"
  | "collection-disabled"
  | "collection-mismatch"
  | "quickstart-unavailable"
  | "section-disabled"
  | "section-mismatch"
  | "unpublished";

export interface EvaluateDocsNavigationReadinessOptions {
  action?: SdkworkDocsNavigationAction;
  activeCollectionId?: string;
  activeSectionId?: string;
  anchorId?: string;
  collections?: readonly SdkworkDocsCollection[];
  outline?: readonly SdkworkDocsOutlineItem[];
  quickstartSteps?: readonly SdkworkDocsQuickstartStep[];
  sections?: readonly SdkworkDocsSection[];
}

export interface SdkworkDocsNavigationCapabilities {
  canBookmark: boolean;
  canContinueQuickstart: boolean;
  canFocusAnchor: boolean;
  canOpen: boolean;
  canShare: boolean;
}

export interface SdkworkDocsNavigationReadiness {
  capabilities: SdkworkDocsNavigationCapabilities;
  degraded: boolean;
  issues: SdkworkDocsNavigationIssue[];
  ready: boolean;
}

export interface SdkworkDocsWorkspaceManifest extends SdkworkAppCapabilityManifest {
  articleRoutePattern: string;
  capability: "docs";
  collectionRoutePattern: string;
  routePath: string;
}

export interface CreateDocsWorkspaceManifestOptions
  extends Partial<
    Pick<CreateSdkworkAppCapabilityManifestOptions, "description" | "host" | "id" | "packageNames" | "theme" | "title">
  > {
  routePath?: string;
}

export interface SdkworkDocsLibraryRouteIntent {
  collectionId?: string;
  focusWindow: boolean;
  route: string;
  sectionId?: string;
  source: "docs-workspace";
  type: "docs-library-route-intent";
}

export interface CreateDocsLibraryRouteIntentOptions {
  basePath?: string;
  collectionId?: string;
  focusWindow?: boolean;
  sectionId?: string;
}

export interface SdkworkDocsArticleRouteIntent {
  anchorId?: string;
  articleSlug: string;
  collectionId: string;
  focusWindow: boolean;
  route: string;
  source: "docs-workspace";
  type: "docs-article-route-intent";
}

export interface CreateDocsArticleRouteIntentOptions {
  anchorId?: string;
  basePath?: string;
  focusWindow?: boolean;
}

function isEnabled(value: { enabled?: boolean }): boolean {
  return value.enabled !== false;
}

function isPublished(article: SdkworkDocsArticle): boolean {
  return article.published !== false;
}

function comparePriorityTitle(
  left: { priority: number; title: string },
  right: { priority: number; title: string },
): number {
  if (left.priority !== right.priority) {
    return left.priority - right.priority;
  }

  return left.title.localeCompare(right.title);
}

function parseTimestamp(value: string | undefined): number {
  if (!value) {
    return 0;
  }

  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function sortDocsArticles(
  articles: readonly SdkworkDocsArticle[],
): SdkworkDocsArticle[] {
  return [...articles].sort((left, right) => {
    const leftFeatured = left.featured === true;
    const rightFeatured = right.featured === true;
    if (leftFeatured !== rightFeatured) {
      return leftFeatured ? -1 : 1;
    }

    const priorityDifference = comparePriorityTitle(left, right);
    if (priorityDifference !== 0) {
      return priorityDifference;
    }

    const leftUpdatedAt = parseTimestamp(left.updatedAt);
    const rightUpdatedAt = parseTimestamp(right.updatedAt);
    if (leftUpdatedAt !== rightUpdatedAt) {
      return rightUpdatedAt - leftUpdatedAt;
    }

    return left.slug.localeCompare(right.slug);
  });
}

function sortRecentArticles(
  articles: readonly SdkworkDocsArticle[],
): SdkworkDocsArticle[] {
  return [...articles].sort((left, right) => {
    const leftUpdatedAt = parseTimestamp(left.updatedAt);
    const rightUpdatedAt = parseTimestamp(right.updatedAt);
    if (leftUpdatedAt !== rightUpdatedAt) {
      return rightUpdatedAt - leftUpdatedAt;
    }

    const leftFeatured = left.featured === true;
    const rightFeatured = right.featured === true;
    if (leftFeatured !== rightFeatured) {
      return leftFeatured ? -1 : 1;
    }

    const priorityDifference = comparePriorityTitle(left, right);
    if (priorityDifference !== 0) {
      return priorityDifference;
    }

    return left.slug.localeCompare(right.slug);
  });
}

function sortQuickstartSteps(
  steps: readonly SdkworkDocsQuickstartStep[],
): SdkworkDocsQuickstartStep[] {
  return [...steps].sort((left, right) => {
    const leftOptional = left.optional === true;
    const rightOptional = right.optional === true;
    if (leftOptional !== rightOptional) {
      return leftOptional ? 1 : -1;
    }

    const priorityDifference = comparePriorityTitle(left, right);
    if (priorityDifference !== 0) {
      return priorityDifference;
    }

    return left.id.localeCompare(right.id);
  });
}

function toUniqueStrings(values: readonly string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function toUniquePackages(packageNames: readonly string[]): string[] {
  return toUniqueStrings(packageNames);
}

function normalizeBasePath(basePath: string | undefined): string {
  const normalized = (basePath ?? "/docs").trim();
  if (!normalized || normalized === "/") {
    return "/docs";
  }

  return normalized.endsWith("/") ? normalized.slice(0, -1) : normalized;
}

function createDocsArticleRoute(
  collectionId: string,
  articleSlug: string,
  options: Pick<CreateDocsArticleRouteIntentOptions, "anchorId" | "basePath"> = {},
): string {
  const route = `${normalizeBasePath(options.basePath)}/${collectionId}/${articleSlug}`;
  return options.anchorId ? `${route}#${options.anchorId}` : route;
}

function findDocsCollection(
  collections: readonly SdkworkDocsCollection[] | undefined,
  collectionId: string,
): SdkworkDocsCollection | undefined {
  return collections?.find((collection) => collection.id === collectionId);
}

function findDocsSection(
  sections: readonly SdkworkDocsSection[] | undefined,
  sectionId: string,
): SdkworkDocsSection | undefined {
  return sections?.find((section) => section.id === sectionId);
}

function isDocsCollectionEnabled(
  collections: readonly SdkworkDocsCollection[] | undefined,
  collectionId: string,
): boolean {
  const collection = findDocsCollection(collections, collectionId);
  return collection ? isEnabled(collection) : true;
}

function isDocsSectionEnabled(
  sections: readonly SdkworkDocsSection[] | undefined,
  sectionId: string,
): boolean {
  const section = findDocsSection(sections, sectionId);
  return section ? isEnabled(section) : true;
}

function hasDocsQuickstartSteps(
  articleId: string,
  quickstartSteps: readonly SdkworkDocsQuickstartStep[] | undefined,
): boolean {
  return quickstartSteps?.some((step) => step.articleId === articleId) ?? false;
}

function isDocsArticleAvailable(
  article: SdkworkDocsArticle,
  options: Pick<CreateDocsArticleDigestOptions, "collections" | "sections">,
): boolean {
  return (
    isPublished(article) &&
    isDocsCollectionEnabled(options.collections, article.collectionId) &&
    isDocsSectionEnabled(options.sections, article.sectionId)
  );
}

function isDocsArticleFresh(
  article: SdkworkDocsArticle,
  options: Pick<CreateDocsArticleDigestOptions, "collections" | "now" | "recentWindowDays" | "sections">,
): boolean {
  if (!isDocsArticleAvailable(article, options)) {
    return false;
  }

  const updatedAt = parseTimestamp(article.updatedAt);
  if (updatedAt <= 0) {
    return false;
  }

  const nowTimestamp = options.now ? parseTimestamp(options.now) : Date.now();
  if (nowTimestamp <= 0 || updatedAt > nowTimestamp) {
    return false;
  }

  const recentWindowDays = Math.max(0, options.recentWindowDays ?? 14);
  return nowTimestamp - updatedAt <= recentWindowDays * 24 * 60 * 60 * 1000;
}

function resolveDocsArticleDigestStatus(
  article: SdkworkDocsArticle,
  options: Pick<
    CreateDocsArticleDigestOptions,
    "collections" | "currentArticleId" | "now" | "recentWindowDays" | "sections"
  >,
): SdkworkDocsArticleDigestStatus {
  if (!isDocsArticleAvailable(article, options)) {
    return "restricted";
  }

  if (article.id === options.currentArticleId) {
    return "current";
  }

  if (article.featured === true) {
    return "featured";
  }

  if (isDocsArticleFresh(article, options)) {
    return "fresh";
  }

  if (article.kind === "reference") {
    return "reference";
  }

  return "standard";
}

function hasDocsAnchor(
  outline: readonly SdkworkDocsOutlineItem[] | undefined,
  anchorId: string | undefined,
): boolean {
  if (!anchorId) {
    return false;
  }

  return outline?.some((item) => item.id === anchorId) ?? false;
}

function toUniqueDocsNavigationIssues(
  issues: readonly SdkworkDocsNavigationIssue[],
): SdkworkDocsNavigationIssue[] {
  return Array.from(new Set(issues));
}

function createOutlineSlug(title: string): string {
  const slug = title
    .trim()
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return slug || "section";
}

export function buildDocsQuickstart(
  input: BuildDocsQuickstartInput,
): SdkworkDocsQuickstart {
  const visibleArticlesById = new Map(
    input.articles
      .filter((article) => isPublished(article))
      .map((article) => [article.id, article] as const),
  );
  const visibleSteps = sortQuickstartSteps(input.steps).filter((step) =>
    visibleArticlesById.has(step.articleId),
  );

  return {
    articleIds: Array.from(new Set(visibleSteps.map((step) => step.articleId))),
    requiredStepIds: visibleSteps
      .filter((step) => step.optional !== true)
      .map((step) => step.id),
    stepIds: visibleSteps.map((step) => step.id),
  };
}

export function createDocsArticleDigest(
  article: SdkworkDocsArticle,
  options: CreateDocsArticleDigestOptions = {},
): SdkworkDocsArticleDigest {
  const collection = findDocsCollection(options.collections, article.collectionId);
  const section = findDocsSection(options.sections, article.sectionId);

  return {
    collectionId: article.collectionId,
    ...(collection ? { collectionTitle: collection.title } : {}),
    digestStatus: resolveDocsArticleDigestStatus(article, options),
    estimatedReadMinutes: article.estimatedReadMinutes ?? 0,
    hasQuickstart: hasDocsQuickstartSteps(article.id, options.quickstartSteps),
    id: article.id,
    isAvailable: isDocsArticleAvailable(article, options),
    isCurrent: article.id === options.currentArticleId,
    isFeatured: article.featured === true,
    isFresh: isDocsArticleFresh(article, options),
    isPublished: isPublished(article),
    kind: article.kind,
    matchesCollection: options.activeCollectionId ? options.activeCollectionId === article.collectionId : true,
    matchesSection: options.activeSectionId ? options.activeSectionId === article.sectionId : true,
    route: createDocsArticleRoute(article.collectionId, article.slug, {
      basePath: options.basePath,
    }),
    sectionId: article.sectionId,
    ...(section ? { sectionTitle: section.title } : {}),
    tagCount: article.tags?.length ?? 0,
    title: article.title,
    ...(article.updatedAt ? { updatedAt: article.updatedAt } : {}),
  };
}

export function summarizeDocsArticleDigests(
  digests: readonly SdkworkDocsArticleDigest[],
): SdkworkDocsArticleDigestSummary {
  let availableArticles = 0;
  let currentArticles = 0;
  let featuredArticles = 0;
  let freshArticles = 0;
  let quickstartArticles = 0;
  let referenceArticles = 0;
  let restrictedArticles = 0;
  let totalEstimatedReadMinutes = 0;

  for (const digest of digests) {
    if (digest.isAvailable) {
      availableArticles += 1;
    }

    if (digest.isCurrent) {
      currentArticles += 1;
    }

    if (digest.isFeatured) {
      featuredArticles += 1;
    }

    if (digest.isFresh) {
      freshArticles += 1;
    }

    if (digest.hasQuickstart && digest.isAvailable) {
      quickstartArticles += 1;
    }

    if (digest.kind === "reference") {
      referenceArticles += 1;
    }

    if (digest.digestStatus === "restricted") {
      restrictedArticles += 1;
    }

    totalEstimatedReadMinutes += digest.estimatedReadMinutes;
  }

  return {
    availableArticles,
    currentArticles,
    featuredArticles,
    freshArticles,
    quickstartArticles,
    referenceArticles,
    restrictedArticles,
    totalArticles: digests.length,
    totalEstimatedReadMinutes,
  };
}

export function evaluateDocsNavigationReadiness(
  article: SdkworkDocsArticle,
  options: EvaluateDocsNavigationReadinessOptions = {},
): SdkworkDocsNavigationReadiness {
  const anchorAvailable = hasDocsAnchor(options.outline, options.anchorId);
  const available = isDocsArticleAvailable(article, options);
  const canContinueQuickstart = available && hasDocsQuickstartSteps(article.id, options.quickstartSteps);
  const issues = toUniqueDocsNavigationIssues([
    ...(isPublished(article) ? [] : ["unpublished" as const]),
    ...(isDocsCollectionEnabled(options.collections, article.collectionId)
      ? []
      : ["collection-disabled" as const]),
    ...(isDocsSectionEnabled(options.sections, article.sectionId) ? [] : ["section-disabled" as const]),
    ...(options.activeCollectionId && options.activeCollectionId !== article.collectionId
      ? ["collection-mismatch" as const]
      : []),
    ...(options.activeSectionId && options.activeSectionId !== article.sectionId
      ? ["section-mismatch" as const]
      : []),
    ...(options.anchorId && !anchorAvailable ? ["anchor-missing" as const] : []),
    ...(options.action === "continue-quickstart" && !hasDocsQuickstartSteps(article.id, options.quickstartSteps)
      ? ["quickstart-unavailable" as const]
      : []),
  ]);
  const blockedIssues = new Set<SdkworkDocsNavigationIssue>([
    "collection-disabled",
    "section-disabled",
    "unpublished",
    ...(options.action === "continue-quickstart" ? (["quickstart-unavailable"] as const) : []),
  ]);

  return {
    capabilities: {
      canBookmark: available,
      canContinueQuickstart,
      canFocusAnchor: available && !!options.anchorId && anchorAvailable,
      canOpen: available,
      canShare: available,
    },
    degraded: issues.length > 0 && issues.every((issue) => !blockedIssues.has(issue)),
    issues,
    ready: issues.every((issue) => !blockedIssues.has(issue)),
  };
}

export function buildDocsOverview(
  input: BuildDocsOverviewInput,
): SdkworkDocsOverview {
  const enabledCollectionIds = new Set(
    input.collections.filter((collection) => isEnabled(collection)).map((collection) => collection.id),
  );
  const enabledSections = input.sections.filter(
    (section) => isEnabled(section) && enabledCollectionIds.has(section.collectionId),
  );
  const enabledSectionIds = new Set(enabledSections.map((section) => section.id));
  const visibleArticles = input.articles.filter(
    (article) =>
      isPublished(article) &&
      enabledCollectionIds.has(article.collectionId) &&
      enabledSectionIds.has(article.sectionId),
  );
  const sectionArticles = new Map<string, SdkworkDocsArticle[]>();

  for (const article of sortDocsArticles(visibleArticles)) {
    const bucket = sectionArticles.get(article.sectionId) ?? [];
    bucket.push(article);
    sectionArticles.set(article.sectionId, bucket);
  }

  const collectionSummaries = input.collections
    .filter((collection) => isEnabled(collection))
    .sort(comparePriorityTitle)
    .map((collection) => {
      const sectionSummaries = enabledSections
        .filter((section) => section.collectionId === collection.id)
        .sort(comparePriorityTitle)
        .map((section) => {
          const articles = sectionArticles.get(section.id) ?? [];
          return {
            articleIds: articles.map((article) => article.id),
            featuredArticleIds: articles
              .filter((article) => article.featured === true)
              .map((article) => article.id),
            id: section.id,
            priority: section.priority,
            title: section.title,
          } satisfies SdkworkDocsSectionSummary;
        });

      return {
        articleIds: sectionSummaries.flatMap((section) => section.articleIds),
        featuredArticleIds: sectionSummaries.flatMap((section) => section.featuredArticleIds),
        id: collection.id,
        priority: collection.priority,
        sectionSummaries,
        title: collection.title,
      } satisfies SdkworkDocsCollectionSummary;
    })
    .filter((collection) => collection.sectionSummaries.length > 0 || enabledCollectionIds.has(collection.id));

  return {
    collectionSummaries,
    featuredArticleIds: sortDocsArticles(
      visibleArticles.filter((article) => article.featured === true),
    ).map((article) => article.id),
    quickstartStepIds: buildDocsQuickstart({
      articles: visibleArticles,
      steps: input.quickstartSteps ?? [],
    }).stepIds,
    recentlyUpdatedArticleIds: sortRecentArticles(
      visibleArticles.filter((article) => parseTimestamp(article.updatedAt) > 0),
    ).map((article) => article.id),
    totalPublishedArticles: visibleArticles.length,
  };
}

export function resolveDocsLandingRoute(
  options: ResolveDocsLandingRouteOptions,
): string {
  const basePath = normalizeBasePath(options.basePath);
  const visibleArticles = options.articles.filter((article) => isPublished(article));
  const scopedArticles = options.collectionId
    ? visibleArticles.filter((article) => article.collectionId === options.collectionId)
    : visibleArticles;

  if (options.preferredArticleSlug) {
    const preferredArticle = sortDocsArticles(scopedArticles).find(
      (article) => article.slug === options.preferredArticleSlug,
    );
    if (preferredArticle) {
      return createDocsArticleRoute(preferredArticle.collectionId, preferredArticle.slug, {
        basePath,
      });
    }
  }

  if (options.collectionId) {
    const collectionArticle = sortDocsArticles(scopedArticles)[0];
    if (collectionArticle) {
      return createDocsArticleRoute(collectionArticle.collectionId, collectionArticle.slug, {
        basePath,
      });
    }
  } else {
    const featuredArticle = sortDocsArticles(
      visibleArticles.filter((article) => article.featured === true),
    )[0];
    if (featuredArticle) {
      return createDocsArticleRoute(featuredArticle.collectionId, featuredArticle.slug, {
        basePath,
      });
    }

    const firstArticle = sortDocsArticles(visibleArticles)[0];
    if (firstArticle) {
      return createDocsArticleRoute(firstArticle.collectionId, firstArticle.slug, {
        basePath,
      });
    }
  }

  return options.fallbackRoute ?? basePath;
}

export function extractDocsOutline(content: string): SdkworkDocsOutlineItem[] {
  const counts = new Map<string, number>();
  const outline: SdkworkDocsOutlineItem[] = [];

  for (const line of content.split(/\r?\n/)) {
    const match = /^(#{1,6})\s+(.*\S)\s*$/.exec(line);
    if (!match) {
      continue;
    }

    const level = match[1]?.length ?? 1;
    const title = match[2] ?? "";
    const baseId = createOutlineSlug(title);
    const nextCount = (counts.get(baseId) ?? 0) + 1;
    counts.set(baseId, nextCount);

    outline.push({
      id: nextCount === 1 ? baseId : `${baseId}-${nextCount}`,
      level,
      title,
    });
  }

  return outline;
}

export function createDocsWorkspaceManifest({
  description = "Docs workspace for embedded learning libraries, quickstart progression, and article routing.",
  host,
  id = "sdkwork-docs",
  packageNames = [
    "@sdkwork/docs-pc-react",
    "@sdkwork/home-pc-react",
  ],
  routePath = "/docs",
  theme,
  title = "Docs",
}: CreateDocsWorkspaceManifestOptions = {}): SdkworkDocsWorkspaceManifest {
  return {
    ...createSdkworkAppCapabilityManifest({
      description,
      host,
      id,
      packageNames: toUniquePackages(packageNames),
      theme,
      title,
    }),
    articleRoutePattern: `${routePath}/:collectionId/:articleSlug`,
    capability: "docs",
    collectionRoutePattern: `${routePath}/:collectionId`,
    routePath,
  };
}

export function createDocsLibraryRouteIntent(
  options: CreateDocsLibraryRouteIntentOptions = {},
): SdkworkDocsLibraryRouteIntent {
  const basePath = normalizeBasePath(options.basePath);
  const queryParams = new URLSearchParams();
  if (options.sectionId) {
    queryParams.set("section", options.sectionId);
  }

  const routeBase = options.collectionId ? `${basePath}/${options.collectionId}` : basePath;
  const querySuffix = queryParams.toString() ? `?${queryParams.toString()}` : "";

  return {
    ...(options.collectionId ? { collectionId: options.collectionId } : {}),
    focusWindow: options.focusWindow !== false,
    route: `${routeBase}${querySuffix}`,
    ...(options.sectionId ? { sectionId: options.sectionId } : {}),
    source: "docs-workspace",
    type: "docs-library-route-intent",
  };
}

export function createDocsArticleRouteIntent(
  collectionId: string,
  articleSlug: string,
  options: CreateDocsArticleRouteIntentOptions = {},
): SdkworkDocsArticleRouteIntent {
  return {
    ...(options.anchorId ? { anchorId: options.anchorId } : {}),
    articleSlug,
    collectionId,
    focusWindow: options.focusWindow !== false,
    route: createDocsArticleRoute(collectionId, articleSlug, options),
    source: "docs-workspace",
    type: "docs-article-route-intent",
  };
}

export const docsPackageMeta = {
  architecture: "pc-react",
  domain: "system",
  package: "@sdkwork/docs-pc-react",
  status: "ready",
} as const;

export type DocsPackageMeta = typeof docsPackageMeta;
