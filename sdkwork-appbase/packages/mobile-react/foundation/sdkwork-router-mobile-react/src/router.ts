import {
  createSdkworkAppCapabilityManifest,
  type CreateSdkworkAppCapabilityManifestOptions,
  type SdkworkAppCapabilityManifest,
} from "@sdkwork/appbase-mobile-react";

export type SdkworkRouteAccess = "protected" | "public";
export type SdkworkRoutePresentation = "push" | "replace-root" | "sheet" | "tab";

export interface SdkworkRouteNavigationMeta {
  group?: string;
  hidden?: boolean;
  order?: number;
  tabId?: string;
}

export interface SdkworkRouteDefinition {
  access?: SdkworkRouteAccess;
  aliases?: readonly string[];
  capability?: string;
  children?: readonly SdkworkRouteDefinition[];
  id: string;
  navigation?: SdkworkRouteNavigationMeta;
  path?: string;
  presentation?: SdkworkRoutePresentation;
  title?: string;
}

export interface SdkworkNavigationItem {
  capability?: string;
  fullPath: string;
  id: string;
  order: number;
  path?: string;
  tabId?: string;
  title: string;
}

export interface SdkworkNavigationGroup {
  id: string;
  items: SdkworkNavigationItem[];
  title: string;
}

export interface SdkworkRouteCatalogItem {
  access: SdkworkRouteAccess;
  aliases: string[];
  capability?: string;
  fullPath: string;
  id: string;
  navigation?: SdkworkRouteNavigationMeta;
  parentId?: string;
  path?: string;
  presentation: SdkworkRoutePresentation;
  title?: string;
}

export interface SdkworkRouteCatalog {
  navigationGroups: SdkworkNavigationGroup[];
  publicRouteIds: string[];
  routes: SdkworkRouteCatalogItem[];
  routesById: Record<string, SdkworkRouteCatalogItem>;
  routesByPath: Record<string, SdkworkRouteCatalogItem>;
  tabRouteIds: string[];
}

export interface SdkworkRouteIntent {
  focusApp: boolean;
  replace: boolean;
  route: string;
  routeId?: string;
  source: string;
  type: "mobile-route-intent";
}

export interface CreatePathIntentOptions {
  focusApp?: boolean;
  query?: Record<string, boolean | number | string | null | undefined>;
  replace?: boolean;
  source?: string;
}

export interface CreateRouteIntentOptions extends CreatePathIntentOptions {}

export interface ResolveRouteTargetSuccess {
  canonicalPath: string;
  ok: true;
  path: string;
  routeId: string;
}

export interface ResolveRouteTargetFailure {
  ok: false;
  path: string;
  reason: "unknown-route";
}

export type ResolveRouteTargetResult = ResolveRouteTargetSuccess | ResolveRouteTargetFailure;

export interface ResolveRouteTargetInput {
  catalog: SdkworkRouteCatalog;
  rawPath: string;
}

export interface ResolveInitialRouteInput extends ResolveRouteTargetInput {
  fallbackPath: string;
}

export type SdkworkBackNavigationDecision =
  | {
      action: "history-back";
      fallbackPath: string;
    }
  | {
      action: "navigate";
      targetPath: string;
    };

export interface CreateBackNavigationDecisionInput {
  fallbackPath: string;
  historyIndex?: number | null;
}

export interface SdkworkRouterManifest extends SdkworkAppCapabilityManifest {
  capability: "router";
  defaultRouteId?: string;
  navigationGroupIds: string[];
  publicRouteIds: string[];
  routeIds: string[];
  tabRouteIds: string[];
}

export interface CreateRouterManifestOptions
  extends Partial<
    Pick<CreateSdkworkAppCapabilityManifestOptions, "description" | "host" | "id" | "packageNames" | "theme" | "title">
  > {
  catalog: SdkworkRouteCatalog;
  defaultRouteId?: string;
}

function filterRouteTree(
  routes: readonly SdkworkRouteDefinition[],
  enabledCapabilities: ReadonlySet<string>,
): SdkworkRouteDefinition[] {
  return routes.flatMap((route) => {
    if (route.capability && !enabledCapabilities.has(route.capability)) {
      return [];
    }

    const children = route.children ? filterRouteTree(route.children, enabledCapabilities) : undefined;

    if (route.children && (!children || children.length === 0) && !route.path) {
      return [];
    }

    return [
      {
        ...route,
        children,
      },
    ];
  });
}

function normalizePathSegment(path: string | undefined): string {
  if (!path) {
    return "";
  }

  const trimmed = path.trim();
  if (!trimmed) {
    return "";
  }

  if (trimmed === "/") {
    return "/";
  }

  return trimmed.replace(/\/+$/, "");
}

function joinRoutePath(parentPath: string | undefined, path: string | undefined): string {
  const normalizedParent = normalizePathSegment(parentPath);
  const normalizedPath = normalizePathSegment(path);

  if (!normalizedPath) {
    return normalizedParent || "/";
  }

  if (normalizedPath.startsWith("/")) {
    return normalizedPath;
  }

  const parentBase = normalizedParent && normalizedParent !== "/" ? normalizedParent : "";
  return `${parentBase}/${normalizedPath}` || "/";
}

function slugify(value: string): string {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "general"
  );
}

function createCatalogItems(
  routes: readonly SdkworkRouteDefinition[],
  parentId?: string,
  parentPath?: string,
): SdkworkRouteCatalogItem[] {
  return routes.flatMap((route) => {
    const fullPath = joinRoutePath(parentPath, route.path);
    const item: SdkworkRouteCatalogItem = {
      access: route.access ?? "protected",
      aliases: (route.aliases ?? []).map((alias) => joinRoutePath(parentPath, alias)),
      capability: route.capability,
      fullPath,
      id: route.id,
      navigation: route.navigation,
      ...(parentId ? { parentId } : {}),
      path: route.path,
      presentation: route.presentation ?? "push",
      title: route.title,
    };

    return [
      item,
      ...(route.children ? createCatalogItems(route.children, route.id, fullPath) : []),
    ];
  });
}

function createNavigationGroupsFromCatalogRoutes(
  routes: readonly SdkworkRouteCatalogItem[],
): SdkworkNavigationGroup[] {
  const visibleRoutes = routes.filter((route) => route.title && !route.navigation?.hidden);
  const grouped = new Map<string, SdkworkNavigationItem[]>();

  for (const route of visibleRoutes) {
    const group = route.navigation?.group ?? "General";
    const existing = grouped.get(group) ?? [];
    existing.push({
      capability: route.capability,
      fullPath: route.fullPath,
      id: route.id,
      order: route.navigation?.order ?? Number.MAX_SAFE_INTEGER,
      path: route.fullPath,
      ...(route.navigation?.tabId ? { tabId: route.navigation.tabId } : {}),
      title: route.title ?? route.id,
    });
    grouped.set(group, existing);
  }

  return Array.from(grouped.entries())
    .map(([title, items]) => ({
      id: slugify(title),
      items: items.sort((left, right) => left.order - right.order || left.title.localeCompare(right.title)),
      title,
    }))
    .sort((left, right) => left.title.localeCompare(right.title));
}

function createQueryString(
  query: Record<string, boolean | number | string | null | undefined> | undefined,
): string {
  if (!query) {
    return "";
  }

  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }

    searchParams.set(key, String(value));
  }

  const serialized = searchParams.toString();
  return serialized ? `?${serialized}` : "";
}

export function filterRoutesByCapabilities(
  routes: readonly SdkworkRouteDefinition[],
  enabledCapabilities: Iterable<string>,
): SdkworkRouteDefinition[] {
  return filterRouteTree(routes, new Set(enabledCapabilities));
}

export function flattenRoutes(
  routes: readonly SdkworkRouteDefinition[],
): SdkworkRouteDefinition[] {
  return routes.flatMap((route) => [route, ...(route.children ? flattenRoutes(route.children) : [])]);
}

export function normalizeRoutePath(pathname: string): string {
  const trimmed = (pathname || "").trim();
  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  const withoutQueryOrHash = withLeadingSlash.split(/[?#]/, 1)[0] || "/";
  const compact = withoutQueryOrHash.replace(/\/{2,}/g, "/");
  if (compact.length <= 1) {
    return "/";
  }

  return compact.replace(/\/+$/, "");
}

export function createNavigationGroups(
  routes: readonly SdkworkRouteDefinition[],
): SdkworkNavigationGroup[] {
  return createRouteCatalog(routes).navigationGroups;
}

export function createRouteCatalog(
  routes: readonly SdkworkRouteDefinition[],
): SdkworkRouteCatalog {
  const catalogRoutes = createCatalogItems(routes);
  const routesById = catalogRoutes.reduce<Record<string, SdkworkRouteCatalogItem>>(
    (accumulator, route) => {
      accumulator[route.id] = route;
      return accumulator;
    },
    {},
  );
  const routesByPath = catalogRoutes.reduce<Record<string, SdkworkRouteCatalogItem>>(
    (accumulator, route) => {
      accumulator[route.fullPath] = route;

      for (const alias of route.aliases) {
        accumulator[alias] = route;
      }

      return accumulator;
    },
    {},
  );

  return {
    navigationGroups: createNavigationGroupsFromCatalogRoutes(catalogRoutes),
    publicRouteIds: catalogRoutes.filter((route) => route.access === "public").map((route) => route.id),
    routes: catalogRoutes,
    routesById,
    routesByPath,
    tabRouteIds: catalogRoutes.filter((route) => route.presentation === "tab").map((route) => route.id),
  };
}

export function resolveRoutePath(
  catalog: SdkworkRouteCatalog,
  routeId: string,
): string {
  const route = catalog.routesById[routeId];
  if (!route) {
    throw new Error(`Unknown route id: ${routeId}`);
  }

  return route.fullPath;
}

export function resolveRouteTarget({
  catalog,
  rawPath,
}: ResolveRouteTargetInput): ResolveRouteTargetResult {
  const normalizedPath = normalizeRoutePath(rawPath);
  const route = catalog.routesByPath[normalizedPath];

  if (!route) {
    return {
      ok: false,
      path: normalizedPath,
      reason: "unknown-route",
    };
  }

  return {
    canonicalPath: route.fullPath,
    ok: true,
    path: normalizedPath,
    routeId: route.id,
  };
}

export function resolveInitialRoute({
  catalog,
  fallbackPath,
  rawPath,
}: ResolveInitialRouteInput): string {
  const resolved = resolveRouteTarget({
    catalog,
    rawPath,
  });

  return resolved.ok ? resolved.canonicalPath : normalizeRoutePath(fallbackPath);
}

export function createPathIntent(
  path: string,
  options: CreatePathIntentOptions = {},
): SdkworkRouteIntent {
  return {
    focusApp: options.focusApp !== false,
    replace: options.replace === true,
    route: `${normalizeRoutePath(path)}${createQueryString(options.query)}`,
    source: options.source ?? "router",
    type: "mobile-route-intent",
  };
}

export function createRouteIntent(
  catalog: SdkworkRouteCatalog,
  routeId: string,
  options: CreateRouteIntentOptions = {},
): SdkworkRouteIntent {
  return {
    ...createPathIntent(resolveRoutePath(catalog, routeId), options),
    routeId,
  };
}

export function createBackNavigationDecision({
  fallbackPath,
  historyIndex,
}: CreateBackNavigationDecisionInput): SdkworkBackNavigationDecision {
  if (historyIndex !== null && historyIndex !== undefined && historyIndex > 0) {
    return {
      action: "history-back",
      fallbackPath: normalizeRoutePath(fallbackPath),
    };
  }

  return {
    action: "navigate",
    targetPath: normalizeRoutePath(fallbackPath),
  };
}

export function createRouterManifest({
  catalog,
  defaultRouteId,
  description = "Route catalog for scene navigation, deep-link-safe route intents, and app-managed back-stack decisions.",
  host,
  id = "sdkwork-router",
  packageNames = ["@sdkwork/router-mobile-react"],
  theme,
  title = "Router",
}: CreateRouterManifestOptions): SdkworkRouterManifest {
  return {
    ...createSdkworkAppCapabilityManifest({
      description,
      host,
      id,
      packageNames: Array.from(new Set(packageNames)),
      theme,
      title,
    }),
    capability: "router",
    ...(defaultRouteId ? { defaultRouteId } : {}),
    navigationGroupIds: catalog.navigationGroups.map((group) => group.id),
    publicRouteIds: catalog.publicRouteIds,
    routeIds: catalog.routes.map((route) => route.id),
    tabRouteIds: catalog.tabRouteIds,
  };
}

export const routerPackageMeta = {
  architecture: "mobile-react",
  domain: "foundation",
  package: "@sdkwork/router-mobile-react",
  status: "ready",
} as const;

export type RouterPackageMeta = typeof routerPackageMeta;
