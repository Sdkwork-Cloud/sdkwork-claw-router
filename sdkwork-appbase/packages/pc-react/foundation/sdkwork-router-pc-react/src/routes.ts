import {
  createSdkworkAppCapabilityManifest,
  type CreateSdkworkAppCapabilityManifestOptions,
  type SdkworkAppCapabilityManifest,
} from "@sdkwork/appbase-pc-react";
import type { ReactNode } from "react";
import { useRoutes, type RouteObject } from "react-router-dom";

export interface SdkworkRouteNavigationMeta {
  group?: string;
  hidden?: boolean;
  icon?: ReactNode;
  order?: number;
}

export interface SdkworkRouteDefinition {
  capability?: string;
  children?: readonly SdkworkRouteDefinition[];
  element?: ReactNode;
  id: string;
  index?: boolean;
  navigation?: SdkworkRouteNavigationMeta;
  path?: string;
  prefetch?: () => Promise<unknown>;
  title?: string;
}

export interface SdkworkNavigationItem {
  capability?: string;
  fullPath: string;
  icon?: ReactNode;
  id: string;
  order: number;
  path?: string;
  title: string;
}

export interface SdkworkNavigationGroup {
  id: string;
  items: SdkworkNavigationItem[];
  title: string;
}

export interface SdkworkRouteCatalogItem {
  capability?: string;
  fullPath: string;
  id: string;
  navigation?: SdkworkRouteNavigationMeta;
  parentId?: string;
  path?: string;
  prefetch?: () => Promise<unknown>;
  title?: string;
}

export interface SdkworkRouteCatalog {
  navigationGroups: SdkworkNavigationGroup[];
  routes: SdkworkRouteCatalogItem[];
  routesById: Record<string, SdkworkRouteCatalogItem>;
  routesByPath: Record<string, SdkworkRouteCatalogItem>;
}

export interface SdkworkRouteIntent {
  focusWindow: boolean;
  replace: boolean;
  route: string;
  routeId?: string;
  source: string;
  type: "route-intent";
}

export interface CreatePathIntentOptions {
  focusWindow?: boolean;
  hash?: string;
  query?: Record<string, boolean | number | string | null | undefined>;
  replace?: boolean;
  source?: string;
}

export interface CreateRouteIntentOptions extends CreatePathIntentOptions {}

type ScheduledPrefetchHandle = unknown;

export interface CreateRoutePrefetchControllerInput {
  catalog: SdkworkRouteCatalog;
  clearScheduled?: (handle: ScheduledPrefetchHandle) => void;
  schedule?: (callback: () => void, delayMs: number) => ScheduledPrefetchHandle;
  scheduleDelayMs?: number;
}

export interface SdkworkRouterManifest extends SdkworkAppCapabilityManifest {
  capability: "router";
  defaultRouteId?: string;
  navigationGroupIds: string[];
  routeIds: string[];
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
  return routes
    .flatMap((route) => {
      if (route.capability && !enabledCapabilities.has(route.capability)) {
        return [];
      }

      const children = route.children
        ? filterRouteTree(route.children, enabledCapabilities)
        : undefined;

      if (route.children && (!children || children.length === 0) && !route.element && !route.index) {
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

export function filterRoutesByCapabilities(
  routes: readonly SdkworkRouteDefinition[],
  enabledCapabilities: Iterable<string>,
): SdkworkRouteDefinition[] {
  return filterRouteTree(routes, new Set(enabledCapabilities));
}

export function flattenRoutes(
  routes: readonly SdkworkRouteDefinition[],
): SdkworkRouteDefinition[] {
  return routes.flatMap((route) => [
    route,
    ...(route.children ? flattenRoutes(route.children) : []),
  ]);
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

function joinRoutePath(parentPath: string | undefined, path: string | undefined, index: boolean | undefined): string {
  const normalizedParent = normalizePathSegment(parentPath);
  const normalizedPath = normalizePathSegment(path);

  if (index) {
    return normalizedParent || "/";
  }

  if (!normalizedPath) {
    return normalizedParent || "/";
  }

  if (normalizedPath.startsWith("/")) {
    return normalizedPath;
  }

  const parentBase = normalizedParent && normalizedParent !== "/" ? normalizedParent : "";
  return `${parentBase}/${normalizedPath}` || "/";
}

function createCatalogItems(
  routes: readonly SdkworkRouteDefinition[],
  parentId?: string,
  parentPath?: string,
): SdkworkRouteCatalogItem[] {
  return routes.flatMap((route) => {
    const fullPath = joinRoutePath(parentPath, route.path, route.index);
    const item: SdkworkRouteCatalogItem = {
      capability: route.capability,
      fullPath,
      id: route.id,
      navigation: route.navigation,
      ...(parentId ? { parentId } : {}),
      path: route.path,
      prefetch: route.prefetch,
      title: route.title,
    };

    return [
      item,
      ...(route.children ? createCatalogItems(route.children, route.id, fullPath) : []),
    ];
  });
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

function createHash(hash: string | undefined): string {
  if (!hash) {
    return "";
  }

  const normalized = hash.trim().replace(/^#+/, "");
  return normalized ? `#${normalized}` : "";
}

export function normalizeRoutePath(pathname: string): string {
  return pathname.split(/[?#]/, 1)[0] || pathname;
}

export function createNavigationGroups(
  routes: readonly SdkworkRouteDefinition[],
): SdkworkNavigationGroup[] {
  const visibleRoutes = createRouteCatalog(routes).routes.filter(
    (route) => route.title && !route.navigation?.hidden,
  );

  const grouped = new Map<string, SdkworkNavigationItem[]>();

  for (const route of visibleRoutes) {
    const group = route.navigation?.group ?? "General";
    const existing = grouped.get(group) ?? [];
    existing.push({
      capability: route.capability,
      fullPath: route.fullPath,
      icon: route.navigation?.icon,
      id: route.id,
      order: route.navigation?.order ?? Number.MAX_SAFE_INTEGER,
      path: route.fullPath,
      title: route.title ?? route.id,
    });
    grouped.set(group, existing);
  }

  return Array.from(grouped.entries())
    .map(([title, items]) => ({
      id: title.toLowerCase().replace(/\s+/g, "-"),
      items: items.sort((left, right) => left.order - right.order || left.title.localeCompare(right.title)),
      title,
    }))
    .sort((left, right) => left.title.localeCompare(right.title));
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
      return accumulator;
    },
    {},
  );

  return {
    navigationGroups: createNavigationGroupsFromCatalogRoutes(catalogRoutes),
    routes: catalogRoutes,
    routesById,
    routesByPath,
  };
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
      icon: route.navigation?.icon,
      id: route.id,
      order: route.navigation?.order ?? Number.MAX_SAFE_INTEGER,
      path: route.fullPath,
      title: route.title ?? route.id,
    });
    grouped.set(group, existing);
  }

  return Array.from(grouped.entries())
    .map(([title, items]) => ({
      id: title.toLowerCase().replace(/\s+/g, "-"),
      items: items.sort((left, right) => left.order - right.order || left.title.localeCompare(right.title)),
      title,
    }))
    .sort((left, right) => left.title.localeCompare(right.title));
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

export function createPathIntent(
  path: string,
  options: CreatePathIntentOptions = {},
): SdkworkRouteIntent {
  return {
    focusWindow: options.focusWindow !== false,
    replace: options.replace === true,
    route: `${normalizeRoutePath(path)}${createQueryString(options.query)}${createHash(options.hash)}`,
    source: options.source ?? "router",
    type: "route-intent",
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

function resolvePrefetchRoute(
  catalog: SdkworkRouteCatalog,
  pathname: string,
): SdkworkRouteCatalogItem | undefined {
  const normalizedPath = normalizeRoutePath(pathname);
  return [...catalog.routes]
    .filter((route) => route.prefetch)
    .sort((left, right) => right.fullPath.length - left.fullPath.length)
    .find((route) =>
      normalizedPath === route.fullPath || normalizedPath.startsWith(`${route.fullPath}/`),
    );
}

export function createRoutePrefetchController({
  catalog,
  clearScheduled = (handle) => window.clearTimeout(handle as number),
  schedule = (callback, delayMs) => window.setTimeout(callback, delayMs),
  scheduleDelayMs = 120,
}: CreateRoutePrefetchControllerInput) {
  const prefetchedRoutes = new Map<string, Promise<unknown>>();
  const scheduledRoutes = new Map<string, ScheduledPrefetchHandle>();

  const prefetch = (pathname: string) => {
    const route = resolvePrefetchRoute(catalog, pathname);
    if (!route?.prefetch) {
      return;
    }

    if (prefetchedRoutes.has(route.id)) {
      return;
    }

    const pending = route.prefetch().catch((error) => {
      prefetchedRoutes.delete(route.id);
      throw error;
    });

    prefetchedRoutes.set(route.id, pending);
  };

  const cancel = (pathname: string) => {
    const route = resolvePrefetchRoute(catalog, pathname);
    if (!route) {
      return;
    }

    const scheduled = scheduledRoutes.get(route.id);
    if (!scheduled) {
      return;
    }

    clearScheduled(scheduled);
    scheduledRoutes.delete(route.id);
  };

  const queue = (pathname: string) => {
    const route = resolvePrefetchRoute(catalog, pathname);
    if (!route) {
      return;
    }

    if (prefetchedRoutes.has(route.id) || scheduledRoutes.has(route.id)) {
      return;
    }

    const handle = schedule(() => {
      scheduledRoutes.delete(route.id);
      prefetch(pathname);
    }, scheduleDelayMs);

    scheduledRoutes.set(route.id, handle);
  };

  return {
    cancel,
    prefetch,
    schedule: queue,
  };
}

export function createRouterManifest({
  catalog,
  defaultRouteId,
  description = "Route catalog for workspace navigation, generic route intents, and prefetch orchestration.",
  host,
  id = "sdkwork-router",
  packageNames = ["@sdkwork/router-pc-react"],
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
    routeIds: catalog.routes.map((route) => route.id),
  };
}

export function toRouteObjects(
  routes: readonly SdkworkRouteDefinition[],
): RouteObject[] {
  return routes.map((route) => {
    if (route.index) {
      return {
        element: route.element,
        id: route.id,
        index: true,
      } satisfies RouteObject;
    }

    return {
      children: route.children ? toRouteObjects(route.children) : undefined,
      element: route.element,
      id: route.id,
      path: route.path,
    } satisfies RouteObject;
  });
}

export interface SdkworkCapabilityRoutesProps {
  enabledCapabilities: Iterable<string>;
  routes: readonly SdkworkRouteDefinition[];
}

export function SdkworkCapabilityRoutes({
  enabledCapabilities,
  routes,
}: SdkworkCapabilityRoutesProps) {
  return useRoutes(toRouteObjects(filterRoutesByCapabilities(routes, enabledCapabilities)));
}

export const routerPackageMeta = {
  architecture: "pc-react",
  domain: "foundation",
  package: "@sdkwork/router-pc-react",
  status: "ready",
} as const;

export type RouterPackageMeta = typeof routerPackageMeta;
