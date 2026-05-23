import {
  createSdkworkAppCapabilityManifest,
  type CreateSdkworkAppCapabilityManifestOptions,
  type SdkworkAppCapabilityManifest,
} from "@sdkwork/appbase-pc-react";

export type SdkworkKnowledgeSourceKind =
  | "dataset"
  | "file"
  | "folder"
  | "note"
  | "repository"
  | "website";
export type SdkworkKnowledgeSourceStatus = "failed" | "indexing" | "ready" | "stale";
export type SdkworkKnowledgeSpaceVisibility = "private" | "shared" | "workspace";
export type SdkworkKnowledgeIndexReadiness = "empty" | "indexing" | "ready" | "requires-attention";
export type SdkworkKnowledgeCatalogSortMode = "latest" | "name" | "readiness";
export type SdkworkKnowledgeRetrievalMode = "hybrid" | "keyword" | "vector";

export interface SdkworkKnowledgeSpace {
  description?: string;
  id: string;
  name: string;
  tags: readonly string[];
  updatedAt: number;
  visibility: SdkworkKnowledgeSpaceVisibility;
}

export interface SdkworkKnowledgeSource {
  chunkCount?: number;
  id: string;
  kind: SdkworkKnowledgeSourceKind;
  lastIndexedAt?: number;
  name: string;
  spaceId: string;
  status: SdkworkKnowledgeSourceStatus;
}

export interface SdkworkKnowledgeSpaceSummary {
  kindCounts: Record<SdkworkKnowledgeSourceKind, number>;
  readiness: SdkworkKnowledgeIndexReadiness;
  sourceCount: number;
  statusCounts: Record<SdkworkKnowledgeSourceStatus, number>;
  totalChunks: number;
}

export interface FilterKnowledgeSpacesOptions {
  query?: string;
  readiness?: readonly SdkworkKnowledgeIndexReadiness[];
  sort?: SdkworkKnowledgeCatalogSortMode;
  tags?: readonly string[];
  visibility?: readonly SdkworkKnowledgeSpaceVisibility[];
}

export interface SdkworkKnowledgeCitation {
  chunkId: string;
  score: number;
  sourceId: string;
  sourceName: string;
  text: string;
  title?: string;
}

export interface SdkworkKnowledgeRetrievalResult {
  citations: readonly SdkworkKnowledgeCitation[];
  mode: SdkworkKnowledgeRetrievalMode;
  query: string;
}

export interface SdkworkKnowledgeRetrievalSummary {
  averageScore: number | undefined;
  citationCount: number;
  hasLowConfidenceMatches: boolean;
  retrievalMode: SdkworkKnowledgeRetrievalMode;
  topSourceIds: string[];
}

export interface SdkworkKnowledgeWorkspaceManifest extends SdkworkAppCapabilityManifest {
  capability: "knowledge";
  detailRoutePattern: string;
  routePath: string;
  sourceDetailRoutePattern: string;
}

export interface CreateKnowledgeWorkspaceManifestOptions
  extends Partial<
    Pick<CreateSdkworkAppCapabilityManifestOptions, "description" | "host" | "id" | "packageNames" | "theme" | "title">
  > {
  routePath?: string;
}

export interface SdkworkKnowledgeLibraryRouteIntent {
  focusWindow: boolean;
  readiness?: SdkworkKnowledgeIndexReadiness;
  route: string;
  source: "knowledge-workspace";
  tag?: string;
  type: "knowledge-library-route-intent";
}

export interface CreateKnowledgeLibraryRouteIntentOptions {
  basePath?: string;
  focusWindow?: boolean;
  readiness?: SdkworkKnowledgeIndexReadiness;
  tag?: string;
}

export interface SdkworkKnowledgeSpaceDetailRouteIntent {
  focusWindow: boolean;
  route: string;
  source: "knowledge-workspace";
  spaceId: string;
  type: "knowledge-space-detail-route-intent";
}

export interface CreateKnowledgeSpaceDetailRouteIntentOptions {
  basePath?: string;
  focusWindow?: boolean;
}

export interface SdkworkKnowledgeSourceDetailRouteIntent {
  focusWindow: boolean;
  route: string;
  source: "knowledge-workspace";
  sourceId: string;
  spaceId: string;
  type: "knowledge-source-detail-route-intent";
}

export interface CreateKnowledgeSourceDetailRouteIntentOptions {
  basePath?: string;
  focusWindow?: boolean;
}

const KNOWLEDGE_KIND_KEYS: readonly SdkworkKnowledgeSourceKind[] = [
  "dataset",
  "file",
  "folder",
  "note",
  "repository",
  "website",
];
const KNOWLEDGE_STATUS_KEYS: readonly SdkworkKnowledgeSourceStatus[] = [
  "failed",
  "indexing",
  "ready",
  "stale",
];
const KNOWLEDGE_READINESS_ORDER: readonly SdkworkKnowledgeIndexReadiness[] = [
  "ready",
  "indexing",
  "requires-attention",
  "empty",
];

function createKindCounts(): Record<SdkworkKnowledgeSourceKind, number> {
  return {
    dataset: 0,
    file: 0,
    folder: 0,
    note: 0,
    repository: 0,
    website: 0,
  };
}

function createStatusCounts(): Record<SdkworkKnowledgeSourceStatus, number> {
  return {
    failed: 0,
    indexing: 0,
    ready: 0,
    stale: 0,
  };
}

function normalizeQuery(value: string | undefined): string {
  return value?.trim().toLowerCase() ?? "";
}

function knowledgeSearchValues(
  space: SdkworkKnowledgeSpace,
  relatedSources: readonly SdkworkKnowledgeSource[],
): string[] {
  return [
    space.name,
    space.description ?? "",
    ...space.tags,
    ...relatedSources.flatMap((source) => [source.name, source.kind, source.status]),
  ];
}

function sortKnowledgeSpaces(
  spaces: readonly SdkworkKnowledgeSpace[],
  sources: readonly SdkworkKnowledgeSource[],
  mode: SdkworkKnowledgeCatalogSortMode = "latest",
): SdkworkKnowledgeSpace[] {
  return [...spaces].sort((left, right) => {
    if (mode === "readiness") {
      const leftReadiness = summarizeKnowledgeSpace(left, sources).readiness;
      const rightReadiness = summarizeKnowledgeSpace(right, sources).readiness;
      const readinessDifference =
        KNOWLEDGE_READINESS_ORDER.indexOf(leftReadiness) -
        KNOWLEDGE_READINESS_ORDER.indexOf(rightReadiness);

      if (readinessDifference !== 0) {
        return readinessDifference;
      }
    }

    if (mode === "latest") {
      const updatedDifference = right.updatedAt - left.updatedAt;
      if (updatedDifference !== 0) {
        return updatedDifference;
      }
    }

    return left.name.localeCompare(right.name);
  });
}

function toUniquePackages(packageNames: readonly string[]): string[] {
  return Array.from(new Set(packageNames.map((packageName) => packageName.trim()).filter(Boolean)));
}

function formatScore(score: number): string {
  return score.toFixed(2);
}

export function summarizeKnowledgeSpace(
  space: Pick<SdkworkKnowledgeSpace, "id">,
  sources: readonly SdkworkKnowledgeSource[],
): SdkworkKnowledgeSpaceSummary {
  const relatedSources = sources.filter((source) => source.spaceId === space.id);
  const kindCounts = createKindCounts();
  const statusCounts = createStatusCounts();
  let totalChunks = 0;

  for (const source of relatedSources) {
    kindCounts[source.kind] += 1;
    statusCounts[source.status] += 1;
    totalChunks += source.chunkCount ?? 0;
  }

  let readiness: SdkworkKnowledgeIndexReadiness = "ready";
  if (relatedSources.length === 0) {
    readiness = "empty";
  } else if (statusCounts.failed > 0 || statusCounts.stale > 0) {
    readiness = "requires-attention";
  } else if (statusCounts.indexing > 0) {
    readiness = "indexing";
  }

  return {
    kindCounts,
    readiness,
    sourceCount: relatedSources.length,
    statusCounts,
    totalChunks,
  };
}

export function filterKnowledgeSpaces(
  spaces: readonly SdkworkKnowledgeSpace[],
  sources: readonly SdkworkKnowledgeSource[],
  options: FilterKnowledgeSpacesOptions = {},
): SdkworkKnowledgeSpace[] {
  const readiness = options.readiness ? new Set(options.readiness) : null;
  const visibility = options.visibility ? new Set(options.visibility) : null;
  const tags = options.tags ?? [];
  const query = normalizeQuery(options.query);

  return sortKnowledgeSpaces(spaces, sources, options.sort).filter((space) => {
    const summary = summarizeKnowledgeSpace(space, sources);
    const relatedSources = sources.filter((source) => source.spaceId === space.id);

    if (readiness && !readiness.has(summary.readiness)) {
      return false;
    }

    if (visibility && !visibility.has(space.visibility)) {
      return false;
    }

    if (tags.length > 0 && !tags.every((tag) => space.tags.includes(tag))) {
      return false;
    }

    if (!query) {
      return true;
    }

    return knowledgeSearchValues(space, relatedSources).some((value) =>
      value.toLowerCase().includes(query),
    );
  });
}

export function summarizeKnowledgeRetrieval(
  result: SdkworkKnowledgeRetrievalResult,
): SdkworkKnowledgeRetrievalSummary {
  const uniqueSources = new Map<string, number>();
  let totalScore = 0;

  for (const citation of result.citations) {
    totalScore += citation.score;
    uniqueSources.set(citation.sourceId, (uniqueSources.get(citation.sourceId) ?? 0) + 1);
  }

  return {
    averageScore:
      result.citations.length > 0
        ? Number((totalScore / result.citations.length).toFixed(2))
        : undefined,
    citationCount: result.citations.length,
    hasLowConfidenceMatches: result.citations.some((citation) => citation.score < 0.6),
    retrievalMode: result.mode,
    topSourceIds: [...uniqueSources.entries()]
      .sort((left, right) => {
        if (right[1] !== left[1]) {
          return right[1] - left[1];
        }
        return left[0].localeCompare(right[0]);
      })
      .map(([sourceId]) => sourceId),
  };
}

export function buildKnowledgeContextBlock(
  result: SdkworkKnowledgeRetrievalResult,
): string {
  if (result.citations.length === 0) {
    return "";
  }

  return [
    "Knowledge Context:",
    ...result.citations.flatMap((citation, index) => [
      `${index + 1}. ${citation.sourceName} - ${citation.title ?? "Untitled Citation"} (score ${formatScore(citation.score)})`,
      citation.text,
    ]),
  ].join("\n");
}

export function createKnowledgeWorkspaceManifest({
  description = "Knowledge workspace for source catalogs, indexing readiness, and retrieval-aware routing.",
  host,
  id = "sdkwork-knowledge",
  packageNames = ["@sdkwork/knowledge-pc-react"],
  routePath = "/knowledge",
  theme,
  title = "Knowledge",
}: CreateKnowledgeWorkspaceManifestOptions = {}): SdkworkKnowledgeWorkspaceManifest {
  return {
    ...createSdkworkAppCapabilityManifest({
      description,
      host,
      id,
      packageNames: toUniquePackages(packageNames),
      theme,
      title,
    }),
    capability: "knowledge",
    detailRoutePattern: `${routePath}/:spaceId`,
    routePath,
    sourceDetailRoutePattern: `${routePath}/:spaceId/sources/:sourceId`,
  };
}

export function createKnowledgeLibraryRouteIntent(
  options: CreateKnowledgeLibraryRouteIntentOptions = {},
): SdkworkKnowledgeLibraryRouteIntent {
  const queryParams = new URLSearchParams();

  if (options.tag) {
    queryParams.set("tag", options.tag);
  }

  if (options.readiness) {
    queryParams.set("readiness", options.readiness);
  }

  const querySuffix = queryParams.toString() ? `?${queryParams.toString()}` : "";

  return {
    focusWindow: options.focusWindow !== false,
    ...(options.readiness ? { readiness: options.readiness } : {}),
    route: `${options.basePath ?? "/knowledge"}${querySuffix}`,
    source: "knowledge-workspace",
    ...(options.tag ? { tag: options.tag } : {}),
    type: "knowledge-library-route-intent",
  };
}

export function createKnowledgeSpaceDetailRouteIntent(
  spaceId: string,
  options: CreateKnowledgeSpaceDetailRouteIntentOptions = {},
): SdkworkKnowledgeSpaceDetailRouteIntent {
  return {
    focusWindow: options.focusWindow !== false,
    route: `${options.basePath ?? "/knowledge"}/${spaceId}`,
    source: "knowledge-workspace",
    spaceId,
    type: "knowledge-space-detail-route-intent",
  };
}

export function createKnowledgeSourceDetailRouteIntent(
  spaceId: string,
  sourceId: string,
  options: CreateKnowledgeSourceDetailRouteIntentOptions = {},
): SdkworkKnowledgeSourceDetailRouteIntent {
  return {
    focusWindow: options.focusWindow !== false,
    route: `${options.basePath ?? "/knowledge"}/${spaceId}/sources/${sourceId}`,
    source: "knowledge-workspace",
    sourceId,
    spaceId,
    type: "knowledge-source-detail-route-intent",
  };
}

export const knowledgePackageMeta = {
  architecture: "pc-react",
  domain: "intelligence",
  package: "@sdkwork/knowledge-pc-react",
  status: "ready",
} as const;

export type KnowledgePackageMeta = typeof knowledgePackageMeta;
