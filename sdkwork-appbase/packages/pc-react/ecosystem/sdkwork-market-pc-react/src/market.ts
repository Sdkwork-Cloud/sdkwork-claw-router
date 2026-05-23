import {
  createSdkworkAppCapabilityManifest,
  type CreateSdkworkAppCapabilityManifestOptions,
  type SdkworkAppCapabilityManifest,
} from "@sdkwork/appbase-pc-react";

export type SdkworkMarketItemKind = "app" | "model" | "plugin" | "skill" | "template";
export type SdkworkMarketSourceKind = "bundled" | "local" | "market" | "private";
export type SdkworkMarketSortBy = "alphabetical" | "downloads" | "newest" | "rating" | "recommended";

export interface SdkworkMarketItem {
  author: string;
  categories: string[];
  categoryId: string;
  description: string;
  downloads: number;
  featured: boolean;
  id: string;
  installRoute: string;
  installed: boolean;
  kind: SdkworkMarketItemKind;
  lastUpdatedAt: string;
  rating: number;
  recommended: boolean;
  route: string;
  sourceKind: SdkworkMarketSourceKind;
  tags: string[];
  title: string;
}

export interface SdkworkMarketSummary {
  categoryCount: number;
  featuredItemId: string | null;
  installedItems: number;
  itemCount: number;
  recommendedItemIds: string[];
}

export interface SdkworkMarketContext {
  isAuthenticated: boolean;
  workspaceId?: string;
}

export interface SdkworkMarketFilterOption<T extends string> {
  count: number;
  id: T | "all";
  label: string;
}

export interface SdkworkMarketSortOption {
  id: SdkworkMarketSortBy;
  label: string;
}

export interface SdkworkMarketFilters {
  categories: SdkworkMarketFilterOption<string>[];
  kindOptions: SdkworkMarketFilterOption<SdkworkMarketItemKind>[];
  sortOptions: SdkworkMarketSortOption[];
  sourceOptions: SdkworkMarketFilterOption<SdkworkMarketSourceKind>[];
}

export interface SdkworkMarketCatalogData {
  context: SdkworkMarketContext;
  filters: SdkworkMarketFilters;
  items: SdkworkMarketItem[];
  summary: SdkworkMarketSummary;
}

export interface SdkworkMarketWorkspaceManifest extends SdkworkAppCapabilityManifest {
  capability: "market";
  routePath: string;
}

export interface CreateMarketWorkspaceManifestOptions
  extends Partial<
    Pick<CreateSdkworkAppCapabilityManifestOptions, "description" | "host" | "id" | "packageNames" | "theme" | "title">
  > {
  routePath?: string;
}

export interface SdkworkMarketRouteIntent {
  categoryId?: string;
  focusWindow: boolean;
  kind?: SdkworkMarketItemKind;
  searchQuery?: string;
  sortBy?: SdkworkMarketSortBy;
  route: string;
  source: "market-workspace";
  type: "market-route-intent";
}

export interface CreateMarketRouteIntentOptions {
  basePath?: string;
  categoryId?: string;
  focusWindow?: boolean;
  kind?: SdkworkMarketItemKind;
  searchQuery?: string;
  sortBy?: SdkworkMarketSortBy;
}

export interface SdkworkMarketInstallRouteIntent {
  focusWindow: boolean;
  itemId: string;
  kind?: SdkworkMarketItemKind;
  route: string;
  source: "market-workspace";
  sourceKind?: SdkworkMarketSourceKind;
  type: "market-install-route-intent";
}

export interface CreateMarketInstallRouteIntentOptions {
  basePath?: string;
  focusWindow?: boolean;
  itemId: string;
  kind?: SdkworkMarketItemKind;
  sourceKind?: SdkworkMarketSourceKind;
}

export interface FilterSdkworkMarketItemsOptions {
  activeCategoryId: string;
  activeKind: SdkworkMarketItemKind | "all";
  activeSourceKind: SdkworkMarketSourceKind | "all";
  query: string;
  sortBy: SdkworkMarketSortBy;
}

export interface CreateEmptySdkworkMarketCatalogOptions {
  context?: Partial<SdkworkMarketContext>;
  items?: readonly SdkworkMarketItem[];
}

const SORT_OPTIONS: SdkworkMarketSortOption[] = [
  {
    id: "recommended",
    label: "Recommended",
  },
  {
    id: "rating",
    label: "Rating",
  },
  {
    id: "downloads",
    label: "Downloads",
  },
  {
    id: "newest",
    label: "Newest",
  },
  {
    id: "alphabetical",
    label: "Name",
  },
];

const KIND_LABELS: Record<SdkworkMarketItemKind, string> = {
  app: "Apps",
  model: "Models",
  plugin: "Plugins",
  skill: "Skills",
  template: "Templates",
};

const SOURCE_LABELS: Record<SdkworkMarketSourceKind, string> = {
  bundled: "Bundled",
  local: "Local",
  market: "Market",
  private: "Private",
};

function normalizeBasePath(basePath: string | undefined, fallback: string): string {
  const normalized = (basePath ?? fallback).trim();
  if (!normalized || normalized === "/") {
    return fallback;
  }

  return normalized.endsWith("/") ? normalized.slice(0, -1) : normalized;
}

function normalizeText(value: string | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function toTimestamp(value: string): number {
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function toTitleCase(value: string): string {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function countBy<T extends string>(
  values: readonly T[],
): Record<T, number> {
  return values.reduce<Record<T, number>>((accumulator, value) => {
    accumulator[value] = (accumulator[value] ?? 0) + 1;
    return accumulator;
  }, {} as Record<T, number>);
}

function createDefaultSdkworkMarketItems(): SdkworkMarketItem[] {
  return [
    {
      author: "SDKWORK",
      categories: ["automation", "plugin"],
      categoryId: "automation",
      description: "Featured plugin pack for desktop agent operations and release automation.",
      downloads: 4200,
      featured: true,
      id: "plugin-agentops",
      installRoute: "/plugins/install?id=plugin-agentops",
      installed: true,
      kind: "plugin",
      lastUpdatedAt: "2026-03-11T12:00:00.000Z",
      rating: 4.9,
      recommended: true,
      route: "/market/items/plugin-agentops",
      sourceKind: "market",
      tags: ["agent", "ops", "automation"],
      title: "AgentOps Plugin",
    },
    {
      author: "SDKWORK",
      categories: ["apps", "automation"],
      categoryId: "apps",
      description: "Operations workspace application with install-ready routing and health dashboards.",
      downloads: 3300,
      featured: false,
      id: "app-ops-center",
      installRoute: "/apps/install?id=app-ops-center",
      installed: false,
      kind: "app",
      lastUpdatedAt: "2026-03-01T09:00:00.000Z",
      rating: 4.6,
      recommended: false,
      route: "/market/items/app-ops-center",
      sourceKind: "market",
      tags: ["ops", "workspace"],
      title: "Ops Center",
    },
    {
      author: "SDKWORK",
      categories: ["templates"],
      categoryId: "templates",
      description: "Reusable workflow templates for guided launch and review flows.",
      downloads: 900,
      featured: false,
      id: "template-workflow-pack",
      installRoute: "/templates/open?id=template-workflow-pack",
      installed: false,
      kind: "template",
      lastUpdatedAt: "2026-02-01T09:00:00.000Z",
      rating: 4.3,
      recommended: false,
      route: "/market/items/template-workflow-pack",
      sourceKind: "bundled",
      tags: ["template", "workflow"],
      title: "Workflow Template Pack",
    },
    {
      author: "SDKWORK",
      categories: ["models"],
      categoryId: "models",
      description: "Production model routing package for premium coding and evaluation workloads.",
      downloads: 2700,
      featured: true,
      id: "model-pro-routes",
      installRoute: "/models/open?id=model-pro-routes",
      installed: false,
      kind: "model",
      lastUpdatedAt: "2026-02-18T08:00:00.000Z",
      rating: 4.7,
      recommended: true,
      route: "/market/items/model-pro-routes",
      sourceKind: "bundled",
      tags: ["model", "route"],
      title: "Pro Routes Model Pack",
    },
    {
      author: "SDKWORK",
      categories: ["skills", "automation"],
      categoryId: "skills",
      description: "Skill bundle for deterministic task orchestration and handoff flows.",
      downloads: 1900,
      featured: false,
      id: "skills-release-flow",
      installRoute: "/skills/open?id=skills-release-flow",
      installed: false,
      kind: "skill",
      lastUpdatedAt: "2026-03-21T08:00:00.000Z",
      rating: 4.5,
      recommended: false,
      route: "/market/items/skills-release-flow",
      sourceKind: "market",
      tags: ["skill", "automation"],
      title: "Release Flow Skills",
    },
  ];
}

function buildCategoryOptions(
  items: readonly SdkworkMarketItem[],
): SdkworkMarketFilterOption<string>[] {
  const counts = countBy(items.map((item) => item.categoryId));
  const keys = Object.keys(counts).sort((left, right) => (counts[right] ?? 0) - (counts[left] ?? 0) || left.localeCompare(right));

  return [
    {
      count: items.length,
      id: "all",
      label: "All",
    },
    ...keys.map((key) => ({
      count: counts[key] ?? 0,
      id: key,
      label: toTitleCase(key),
    })),
  ];
}

function buildKindOptions(
  items: readonly SdkworkMarketItem[],
): SdkworkMarketFilterOption<SdkworkMarketItemKind>[] {
  const counts = countBy(items.map((item) => item.kind));
  const keys: SdkworkMarketItemKind[] = ["app", "plugin", "skill", "model", "template"];

  return [
    {
      count: items.length,
      id: "all",
      label: "All kinds",
    },
    ...keys.filter((key) => (counts[key] ?? 0) > 0).map((key) => ({
      count: counts[key] ?? 0,
      id: key,
      label: KIND_LABELS[key],
    })),
  ];
}

function buildSourceOptions(
  items: readonly SdkworkMarketItem[],
): SdkworkMarketFilterOption<SdkworkMarketSourceKind>[] {
  const counts = countBy(items.map((item) => item.sourceKind));
  const keys: SdkworkMarketSourceKind[] = ["bundled", "market", "private", "local"];

  return [
    {
      count: items.length,
      id: "all",
      label: "All sources",
    },
    ...keys.filter((key) => (counts[key] ?? 0) > 0).map((key) => ({
      count: counts[key] ?? 0,
      id: key,
      label: SOURCE_LABELS[key],
    })),
  ];
}

export function sortSdkworkMarketItems(
  items: readonly SdkworkMarketItem[],
  sortBy: SdkworkMarketSortBy = "recommended",
): SdkworkMarketItem[] {
  return [...items].sort((left, right) => {
    if (sortBy === "alphabetical") {
      return left.title.localeCompare(right.title);
    }

    if (sortBy === "rating") {
      return right.rating - left.rating
        || right.downloads - left.downloads
        || left.title.localeCompare(right.title);
    }

    if (sortBy === "downloads") {
      return right.downloads - left.downloads
        || right.rating - left.rating
        || left.title.localeCompare(right.title);
    }

    if (sortBy === "newest") {
      return toTimestamp(right.lastUpdatedAt) - toTimestamp(left.lastUpdatedAt)
        || right.rating - left.rating
        || left.title.localeCompare(right.title);
    }

    return Number(right.featured) - Number(left.featured)
      || Number(right.recommended) - Number(left.recommended)
      || right.rating - left.rating
      || right.downloads - left.downloads
      || toTimestamp(right.lastUpdatedAt) - toTimestamp(left.lastUpdatedAt)
      || left.title.localeCompare(right.title);
  });
}

export function filterSdkworkMarketItems(
  items: readonly SdkworkMarketItem[],
  options: FilterSdkworkMarketItemsOptions,
): SdkworkMarketItem[] {
  const query = normalizeText(options.query);
  const filtered = items.filter((item) => {
    if (options.activeCategoryId !== "all" && item.categoryId !== options.activeCategoryId) {
      return false;
    }

    if (options.activeKind !== "all" && item.kind !== options.activeKind) {
      return false;
    }

    if (options.activeSourceKind !== "all" && item.sourceKind !== options.activeSourceKind) {
      return false;
    }

    if (!query) {
      return true;
    }

    const fields = [
      item.id,
      item.title,
      item.description,
      item.author,
      item.categoryId,
      ...item.categories,
      ...item.tags,
    ];

    return fields.some((value) => normalizeText(value).includes(query));
  });

  return sortSdkworkMarketItems(filtered, options.sortBy);
}

export function summarizeSdkworkMarketItems(
  items: readonly SdkworkMarketItem[],
): SdkworkMarketSummary {
  const featuredItem = items.find((item) => item.featured) ?? items[0] ?? null;
  const recommendedItemIds = sortSdkworkMarketItems(
    items.filter((item) => item.recommended),
    "recommended",
  ).map((item) => item.id);

  return {
    categoryCount: new Set(items.map((item) => item.categoryId)).size,
    featuredItemId: featuredItem?.id ?? null,
    installedItems: items.filter((item) => item.installed).length,
    itemCount: items.length,
    recommendedItemIds,
  };
}

export function createEmptySdkworkMarketCatalog(
  options: CreateEmptySdkworkMarketCatalogOptions = {},
): SdkworkMarketCatalogData {
  const items = options.items?.length
    ? sortSdkworkMarketItems(options.items, "recommended")
    : sortSdkworkMarketItems(createDefaultSdkworkMarketItems(), "recommended");

  return {
    context: {
      isAuthenticated: false,
      ...options.context,
    },
    filters: {
      categories: buildCategoryOptions(items),
      kindOptions: buildKindOptions(items),
      sortOptions: SORT_OPTIONS,
      sourceOptions: buildSourceOptions(items),
    },
    items,
    summary: summarizeSdkworkMarketItems(items),
  };
}

export function createMarketWorkspaceManifest({
  description = "Marketplace center for normalized listing, category filters, recommendations, and install-intent routing.",
  host,
  id = "sdkwork-market",
  packageNames = [
    "@sdkwork/market-pc-react",
    "@sdkwork/plugin-pc-react",
    "@sdkwork/apps-pc-react",
    "@sdkwork/skills-pc-react",
    "@sdkwork/models-pc-react",
  ],
  routePath = "/market",
  theme,
  title = "Market",
}: CreateMarketWorkspaceManifestOptions = {}): SdkworkMarketWorkspaceManifest {
  return {
    ...createSdkworkAppCapabilityManifest({
      description,
      host,
      id,
      packageNames,
      theme,
      title,
    }),
    capability: "market",
    routePath: normalizeBasePath(routePath, "/market"),
  };
}

export function createMarketRouteIntent(
  options: CreateMarketRouteIntentOptions = {},
): SdkworkMarketRouteIntent {
  const basePath = normalizeBasePath(options.basePath, "/market");
  const queryParams = new URLSearchParams();

  if (options.kind) {
    queryParams.set("kind", options.kind);
  }

  if (options.categoryId) {
    queryParams.set("categoryId", options.categoryId);
  }

  if (options.searchQuery) {
    queryParams.set("q", options.searchQuery);
  }

  if (options.sortBy) {
    queryParams.set("sort", options.sortBy);
  }

  const querySuffix = queryParams.toString() ? `?${queryParams.toString()}` : "";

  return {
    ...(options.categoryId ? { categoryId: options.categoryId } : {}),
    focusWindow: options.focusWindow !== false,
    ...(options.kind ? { kind: options.kind } : {}),
    ...(options.searchQuery ? { searchQuery: options.searchQuery } : {}),
    ...(options.sortBy ? { sortBy: options.sortBy } : {}),
    route: `${basePath}${querySuffix}`,
    source: "market-workspace",
    type: "market-route-intent",
  };
}

export function createMarketInstallRouteIntent(
  options: CreateMarketInstallRouteIntentOptions,
): SdkworkMarketInstallRouteIntent {
  const basePath = normalizeBasePath(options.basePath, "/market/install");
  const queryParams = new URLSearchParams();

  if (options.kind) {
    queryParams.set("kind", options.kind);
  }

  queryParams.set("itemId", options.itemId);

  if (options.sourceKind) {
    queryParams.set("source", options.sourceKind);
  }

  return {
    focusWindow: options.focusWindow !== false,
    ...(options.kind ? { kind: options.kind } : {}),
    itemId: options.itemId,
    route: `${basePath}?${queryParams.toString()}`,
    source: "market-workspace",
    ...(options.sourceKind ? { sourceKind: options.sourceKind } : {}),
    type: "market-install-route-intent",
  };
}

export const marketPackageMeta = {
  architecture: "pc-react",
  domain: "ecosystem",
  package: "@sdkwork/market-pc-react",
  status: "ready",
} as const;

export type MarketPackageMeta = typeof marketPackageMeta;
