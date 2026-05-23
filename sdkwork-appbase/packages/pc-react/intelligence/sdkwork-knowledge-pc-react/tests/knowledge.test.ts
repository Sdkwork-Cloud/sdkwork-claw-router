import { describe, expect, it } from "vitest";
import {
  buildKnowledgeContextBlock,
  createKnowledgeLibraryRouteIntent,
  createKnowledgeSourceDetailRouteIntent,
  createKnowledgeSpaceDetailRouteIntent,
  createKnowledgeWorkspaceManifest,
  filterKnowledgeSpaces,
  summarizeKnowledgeRetrieval,
  summarizeKnowledgeSpace,
} from "../src";

const spaces = [
  {
    description: "Canonical documentation and product references.",
    id: "docs",
    name: "Product Docs",
    tags: ["docs", "product"],
    updatedAt: 1_710_000_000_000,
    visibility: "shared",
  },
  {
    description: "Operational procedures and incident runbooks.",
    id: "ops",
    name: "Ops Runbooks",
    tags: ["ops"],
    updatedAt: 1_700_000_000_000,
    visibility: "workspace",
  },
  {
    description: "Scratchpad space for drafts.",
    id: "drafts",
    name: "Empty Drafts",
    tags: ["notes"],
    updatedAt: 1_690_000_000_000,
    visibility: "private",
  },
] as const;

const sources = [
  {
    chunkCount: 120,
    id: "docs-home",
    kind: "website",
    lastIndexedAt: 1_710_000_000_000,
    name: "Docs Home",
    spaceId: "docs",
    status: "ready",
  },
  {
    chunkCount: 48,
    id: "sdk-repo",
    kind: "repository",
    lastIndexedAt: 1_709_000_000_000,
    name: "SDK Repo",
    spaceId: "docs",
    status: "ready",
  },
  {
    chunkCount: 0,
    id: "incident-checklist",
    kind: "file",
    lastIndexedAt: 1_708_000_000_000,
    name: "Incident Checklist",
    spaceId: "ops",
    status: "failed",
  },
  {
    chunkCount: 0,
    id: "rollback-sop",
    kind: "note",
    name: "Rollback SOP",
    spaceId: "ops",
    status: "indexing",
  },
] as const;

const retrieval = {
  citations: [
    {
      chunkId: "chunk-1",
      score: 0.94,
      sourceId: "docs-home",
      sourceName: "Docs Home",
      text: "Use the Sdkwork theme preset for every starter workspace.",
      title: "Getting Started",
    },
    {
      chunkId: "chunk-2",
      score: 0.88,
      sourceId: "sdk-repo",
      sourceName: "SDK Repo",
      text: "Packages live under packages/pc-react grouped by domain.",
      title: "Repository Layout",
    },
    {
      chunkId: "chunk-3",
      score: 0.81,
      sourceId: "docs-home",
      sourceName: "Docs Home",
      text: "Knowledge and memory stay separate so recall remains composable.",
      title: "Knowledge Model",
    },
  ],
  mode: "hybrid",
  query: "How should I structure a new intelligence workspace?",
} as const;

describe("sdkwork-knowledge-pc-react", () => {
  it("summarizes knowledge spaces and filters them by readiness, tags, and query", () => {
    expect(summarizeKnowledgeSpace(spaces[0], sources)).toEqual({
      kindCounts: {
        dataset: 0,
        file: 0,
        folder: 0,
        note: 0,
        repository: 1,
        website: 1,
      },
      readiness: "ready",
      sourceCount: 2,
      statusCounts: {
        failed: 0,
        indexing: 0,
        ready: 2,
        stale: 0,
      },
      totalChunks: 168,
    });

    expect(summarizeKnowledgeSpace(spaces[1], sources).readiness).toBe("requires-attention");
    expect(summarizeKnowledgeSpace(spaces[2], sources).readiness).toBe("empty");

    expect(
      filterKnowledgeSpaces(spaces, sources, {
        query: "docs",
        readiness: ["ready"],
        tags: ["docs"],
      }).map((space) => space.id),
    ).toEqual(["docs"]);
  });

  it("summarizes retrieval results and formats a prompt-ready context block", () => {
    expect(summarizeKnowledgeRetrieval(retrieval)).toEqual({
      averageScore: 0.88,
      citationCount: 3,
      hasLowConfidenceMatches: false,
      retrievalMode: "hybrid",
      topSourceIds: ["docs-home", "sdk-repo"],
    });

    expect(buildKnowledgeContextBlock(retrieval)).toEqual(
      [
        "Knowledge Context:",
        "1. Docs Home - Getting Started (score 0.94)",
        "Use the Sdkwork theme preset for every starter workspace.",
        "2. SDK Repo - Repository Layout (score 0.88)",
        "Packages live under packages/pc-react grouped by domain.",
        "3. Docs Home - Knowledge Model (score 0.81)",
        "Knowledge and memory stay separate so recall remains composable.",
      ].join("\n"),
    );
  });

  it("creates knowledge workspace manifests and route intents", () => {
    expect(
      createKnowledgeWorkspaceManifest({
        packageNames: ["@sdkwork/knowledge-pc-react", "@sdkwork/knowledge-pc-react"],
        title: "Knowledge",
      }),
    ).toEqual({
      architecture: "pc-react",
      capability: "knowledge",
      description: "Knowledge workspace for source catalogs, indexing readiness, and retrieval-aware routing.",
      detailRoutePattern: "/knowledge/:spaceId",
      host: "tauri",
      id: "sdkwork-knowledge",
      packageNames: ["@sdkwork/knowledge-pc-react"],
      routePath: "/knowledge",
      sourceDetailRoutePattern: "/knowledge/:spaceId/sources/:sourceId",
      theme: {
        color: "lobster",
        preset: "sdkwork",
        selection: "system",
      },
      title: "Knowledge",
    });

    expect(
      createKnowledgeLibraryRouteIntent({
        readiness: "ready",
        tag: "docs",
      }),
    ).toEqual({
      focusWindow: true,
      readiness: "ready",
      route: "/knowledge?tag=docs&readiness=ready",
      source: "knowledge-workspace",
      tag: "docs",
      type: "knowledge-library-route-intent",
    });

    expect(createKnowledgeSpaceDetailRouteIntent("docs")).toEqual({
      focusWindow: true,
      route: "/knowledge/docs",
      source: "knowledge-workspace",
      spaceId: "docs",
      type: "knowledge-space-detail-route-intent",
    });

    expect(createKnowledgeSourceDetailRouteIntent("docs", "docs-home")).toEqual({
      focusWindow: true,
      route: "/knowledge/docs/sources/docs-home",
      source: "knowledge-workspace",
      sourceId: "docs-home",
      spaceId: "docs",
      type: "knowledge-source-detail-route-intent",
    });
  });
});
