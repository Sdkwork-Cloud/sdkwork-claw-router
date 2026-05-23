import { describe, expect, it } from "vitest";
import {
  buildDocsOverview,
  buildDocsQuickstart,
  createDocsArticleDigest,
  createDocsArticleRouteIntent,
  createDocsLibraryRouteIntent,
  createDocsWorkspaceManifest,
  evaluateDocsNavigationReadiness,
  extractDocsOutline,
  resolveDocsLandingRoute,
  summarizeDocsArticleDigests,
} from "../src";

const collections = [
  {
    id: "getting-started",
    priority: 1,
    title: "Getting Started",
  },
  {
    id: "api",
    priority: 2,
    title: "API",
  },
  {
    enabled: false,
    id: "archived",
    priority: 3,
    title: "Archived",
  },
] as const;

const sections = [
  {
    collectionId: "getting-started",
    id: "overview",
    priority: 1,
    title: "Overview",
  },
  {
    collectionId: "getting-started",
    id: "install",
    priority: 2,
    title: "Install",
  },
  {
    collectionId: "api",
    id: "reference",
    priority: 1,
    title: "Reference",
  },
  {
    collectionId: "archived",
    id: "legacy",
    priority: 1,
    title: "Legacy",
  },
] as const;

const articles = [
  {
    collectionId: "getting-started",
    estimatedReadMinutes: 6,
    featured: true,
    id: "quickstart",
    kind: "quickstart",
    priority: 1,
    sectionId: "overview",
    slug: "quickstart",
    tags: ["install", "gateway"],
    title: "Quickstart",
    updatedAt: "2026-04-02T10:00:00.000Z",
  },
  {
    collectionId: "getting-started",
    estimatedReadMinutes: 8,
    id: "installation",
    kind: "guide",
    priority: 2,
    sectionId: "install",
    slug: "install-cli",
    tags: ["cli"],
    title: "Install CLI",
    updatedAt: "2026-04-01T09:00:00.000Z",
  },
  {
    collectionId: "api",
    estimatedReadMinutes: 7,
    featured: true,
    id: "architecture",
    kind: "concept",
    priority: 2,
    sectionId: "reference",
    slug: "architecture",
    tags: ["system"],
    title: "Architecture",
    updatedAt: "2026-03-29T09:00:00.000Z",
  },
  {
    collectionId: "api",
    estimatedReadMinutes: 12,
    id: "cli-reference",
    kind: "reference",
    priority: 1,
    sectionId: "reference",
    slug: "cli-reference",
    tags: ["cli", "api"],
    title: "CLI Reference",
    updatedAt: "2026-03-30T09:00:00.000Z",
  },
  {
    collectionId: "api",
    estimatedReadMinutes: 15,
    id: "draft-api",
    kind: "reference",
    priority: 3,
    published: false,
    sectionId: "reference",
    slug: "draft-api",
    tags: ["draft"],
    title: "Draft API",
    updatedAt: "2026-03-20T09:00:00.000Z",
  },
  {
    collectionId: "archived",
    estimatedReadMinutes: 10,
    id: "legacy-article",
    kind: "guide",
    priority: 1,
    sectionId: "legacy",
    slug: "legacy-guide",
    tags: ["legacy"],
    title: "Legacy Guide",
    updatedAt: "2026-03-01T09:00:00.000Z",
  },
] as const;

const steps = [
  {
    articleId: "quickstart",
    id: "install-gateway",
    priority: 1,
    title: "Install gateway",
  },
  {
    articleId: "quickstart",
    id: "register-device",
    priority: 2,
    title: "Register device",
  },
  {
    articleId: "installation",
    id: "configure-cli",
    optional: true,
    priority: 1,
    title: "Configure CLI",
  },
  {
    articleId: "draft-api",
    id: "draft-step",
    priority: 3,
    title: "Draft step",
  },
] as const;

describe("sdkwork-docs-pc-react", () => {
  it("builds a docs overview with ordered collections, featured articles, recent updates, and quickstart ids", () => {
    expect(
      buildDocsOverview({
        articles,
        collections,
        quickstartSteps: steps,
        sections,
      }),
    ).toEqual({
      collectionSummaries: [
        {
          articleIds: ["quickstart", "installation"],
          featuredArticleIds: ["quickstart"],
          id: "getting-started",
          priority: 1,
          sectionSummaries: [
            {
              articleIds: ["quickstart"],
              featuredArticleIds: ["quickstart"],
              id: "overview",
              priority: 1,
              title: "Overview",
            },
            {
              articleIds: ["installation"],
              featuredArticleIds: [],
              id: "install",
              priority: 2,
              title: "Install",
            },
          ],
          title: "Getting Started",
        },
        {
          articleIds: ["architecture", "cli-reference"],
          featuredArticleIds: ["architecture"],
          id: "api",
          priority: 2,
          sectionSummaries: [
            {
              articleIds: ["architecture", "cli-reference"],
              featuredArticleIds: ["architecture"],
              id: "reference",
              priority: 1,
              title: "Reference",
            },
          ],
          title: "API",
        },
      ],
      featuredArticleIds: ["quickstart", "architecture"],
      quickstartStepIds: ["install-gateway", "register-device", "configure-cli"],
      recentlyUpdatedArticleIds: ["quickstart", "installation", "cli-reference", "architecture"],
      totalPublishedArticles: 4,
    });
  });

  it("builds quickstart summaries from visible docs articles only", () => {
    expect(
      buildDocsQuickstart({
        articles,
        steps,
      }),
    ).toEqual({
      articleIds: ["quickstart", "installation"],
      requiredStepIds: ["install-gateway", "register-device"],
      stepIds: ["install-gateway", "register-device", "configure-cli"],
    });
  });

  it("resolves docs landing routes for roots, collections, and preferred article slugs", () => {
    expect(
      resolveDocsLandingRoute({
        articles,
      }),
    ).toBe("/docs/getting-started/quickstart");

    expect(
      resolveDocsLandingRoute({
        articles,
        collectionId: "api",
      }),
    ).toBe("/docs/api/architecture");

    expect(
      resolveDocsLandingRoute({
        articles,
        collectionId: "getting-started",
        preferredArticleSlug: "install-cli",
      }),
    ).toBe("/docs/getting-started/install-cli");

    expect(
      resolveDocsLandingRoute({
        articles: [],
        fallbackRoute: "/docs",
      }),
    ).toBe("/docs");
  });

  it("extracts markdown outlines with stable slugs and duplicate heading suffixes", () => {
    expect(
      extractDocsOutline(`
# Quickstart
## Install Gateway
## Install Gateway
### 安装 网关
      `.trim()),
    ).toEqual([
      {
        id: "quickstart",
        level: 1,
        title: "Quickstart",
      },
      {
        id: "install-gateway",
        level: 2,
        title: "Install Gateway",
      },
      {
        id: "install-gateway-2",
        level: 2,
        title: "Install Gateway",
      },
      {
        id: "安装-网关",
        level: 3,
        title: "安装 网关",
      },
    ]);
  });

  it("creates article digests and summarizes docs discovery state", () => {
    expect(
      createDocsArticleDigest(articles[0], {
        activeCollectionId: "getting-started",
        activeSectionId: "overview",
        collections,
        currentArticleId: "quickstart",
        now: "2026-04-03T12:00:00.000Z",
        quickstartSteps: steps,
        recentWindowDays: 3,
        sections,
      }),
    ).toEqual({
      collectionId: "getting-started",
      collectionTitle: "Getting Started",
      digestStatus: "current",
      estimatedReadMinutes: 6,
      hasQuickstart: true,
      id: "quickstart",
      isAvailable: true,
      isCurrent: true,
      isFeatured: true,
      isFresh: true,
      isPublished: true,
      kind: "quickstart",
      matchesCollection: true,
      matchesSection: true,
      route: "/docs/getting-started/quickstart",
      sectionId: "overview",
      sectionTitle: "Overview",
      tagCount: 2,
      title: "Quickstart",
      updatedAt: "2026-04-02T10:00:00.000Z",
    });

    expect(
      createDocsArticleDigest(articles[3], {
        activeCollectionId: "getting-started",
        activeSectionId: "overview",
        collections,
        currentArticleId: "quickstart",
        now: "2026-04-03T12:00:00.000Z",
        quickstartSteps: steps,
        recentWindowDays: 3,
        sections,
      }),
    ).toEqual({
      collectionId: "api",
      collectionTitle: "API",
      digestStatus: "reference",
      estimatedReadMinutes: 12,
      hasQuickstart: false,
      id: "cli-reference",
      isAvailable: true,
      isCurrent: false,
      isFeatured: false,
      isFresh: false,
      isPublished: true,
      kind: "reference",
      matchesCollection: false,
      matchesSection: false,
      route: "/docs/api/cli-reference",
      sectionId: "reference",
      sectionTitle: "Reference",
      tagCount: 2,
      title: "CLI Reference",
      updatedAt: "2026-03-30T09:00:00.000Z",
    });

    expect(
      createDocsArticleDigest(articles[5], {
        collections,
        now: "2026-04-03T12:00:00.000Z",
        quickstartSteps: steps,
        recentWindowDays: 3,
        sections,
      }),
    ).toEqual({
      collectionId: "archived",
      collectionTitle: "Archived",
      digestStatus: "restricted",
      estimatedReadMinutes: 10,
      hasQuickstart: false,
      id: "legacy-article",
      isAvailable: false,
      isCurrent: false,
      isFeatured: false,
      isFresh: false,
      isPublished: true,
      kind: "guide",
      matchesCollection: true,
      matchesSection: true,
      route: "/docs/archived/legacy-guide",
      sectionId: "legacy",
      sectionTitle: "Legacy",
      tagCount: 1,
      title: "Legacy Guide",
      updatedAt: "2026-03-01T09:00:00.000Z",
    });

    expect(
      summarizeDocsArticleDigests(
        articles.map((article) =>
          createDocsArticleDigest(article, {
            activeCollectionId: "getting-started",
            activeSectionId: "overview",
            collections,
            currentArticleId: "quickstart",
            now: "2026-04-03T12:00:00.000Z",
            quickstartSteps: steps,
            recentWindowDays: 3,
            sections,
          }),
        ),
      ),
    ).toEqual({
      availableArticles: 4,
      currentArticles: 1,
      featuredArticles: 2,
      freshArticles: 2,
      quickstartArticles: 2,
      referenceArticles: 2,
      restrictedArticles: 2,
      totalArticles: 6,
      totalEstimatedReadMinutes: 58,
    });
  });

  it("evaluates docs navigation readiness for healthy, degraded, and blocked launch paths", () => {
    expect(
      evaluateDocsNavigationReadiness(articles[0], {
        action: "continue-quickstart",
        activeCollectionId: "getting-started",
        activeSectionId: "overview",
        anchorId: "install-gateway",
        collections,
        outline: extractDocsOutline(`
# Quickstart
## Install gateway
        `.trim()),
        quickstartSteps: steps,
        sections,
      }),
    ).toEqual({
      capabilities: {
        canBookmark: true,
        canContinueQuickstart: true,
        canFocusAnchor: true,
        canOpen: true,
        canShare: true,
      },
      degraded: false,
      issues: [],
      ready: true,
    });

    expect(
      evaluateDocsNavigationReadiness(articles[2], {
        action: "open",
        activeCollectionId: "getting-started",
        activeSectionId: "install",
        anchorId: "missing-anchor",
        collections,
        outline: extractDocsOutline(`
# Architecture
## Overview
        `.trim()),
        quickstartSteps: steps,
        sections,
      }),
    ).toEqual({
      capabilities: {
        canBookmark: true,
        canContinueQuickstart: false,
        canFocusAnchor: false,
        canOpen: true,
        canShare: true,
      },
      degraded: true,
      issues: ["collection-mismatch", "section-mismatch", "anchor-missing"],
      ready: true,
    });

    expect(
      evaluateDocsNavigationReadiness(articles[2], {
        action: "continue-quickstart",
        collections,
        quickstartSteps: steps,
        sections,
      }),
    ).toEqual({
      capabilities: {
        canBookmark: true,
        canContinueQuickstart: false,
        canFocusAnchor: false,
        canOpen: true,
        canShare: true,
      },
      degraded: false,
      issues: ["quickstart-unavailable"],
      ready: false,
    });

    expect(
      evaluateDocsNavigationReadiness(articles[4], {
        action: "open",
        collections,
        quickstartSteps: steps,
        sections,
      }),
    ).toEqual({
      capabilities: {
        canBookmark: false,
        canContinueQuickstart: false,
        canFocusAnchor: false,
        canOpen: false,
        canShare: false,
      },
      degraded: false,
      issues: ["unpublished"],
      ready: false,
    });
  });

  it("builds docs workspace manifests and route intents", () => {
    expect(
      createDocsWorkspaceManifest({
        packageNames: [
          "@sdkwork/docs-pc-react",
          "@sdkwork/home-pc-react",
          "@sdkwork/docs-pc-react",
        ],
        title: "Docs",
      }),
    ).toEqual({
      architecture: "pc-react",
      articleRoutePattern: "/docs/:collectionId/:articleSlug",
      capability: "docs",
      collectionRoutePattern: "/docs/:collectionId",
      description: "Docs workspace for embedded learning libraries, quickstart progression, and article routing.",
      host: "tauri",
      id: "sdkwork-docs",
      packageNames: [
        "@sdkwork/docs-pc-react",
        "@sdkwork/home-pc-react",
      ],
      routePath: "/docs",
      theme: {
        color: "lobster",
        preset: "sdkwork",
        selection: "system",
      },
      title: "Docs",
    });

    expect(
      createDocsLibraryRouteIntent({
        collectionId: "getting-started",
        sectionId: "install",
      }),
    ).toEqual({
      collectionId: "getting-started",
      focusWindow: true,
      route: "/docs/getting-started?section=install",
      sectionId: "install",
      source: "docs-workspace",
      type: "docs-library-route-intent",
    });

    expect(
      createDocsArticleRouteIntent("getting-started", "quickstart", {
        anchorId: "install-gateway",
      }),
    ).toEqual({
      anchorId: "install-gateway",
      articleSlug: "quickstart",
      collectionId: "getting-started",
      focusWindow: true,
      route: "/docs/getting-started/quickstart#install-gateway",
      source: "docs-workspace",
      type: "docs-article-route-intent",
    });
  });
});
