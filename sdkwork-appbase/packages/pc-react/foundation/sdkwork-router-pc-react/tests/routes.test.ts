import { describe, expect, it, vi } from "vitest";
import {
  createNavigationGroups,
  createPathIntent,
  createRouteCatalog,
  createRouteIntent,
  createRoutePrefetchController,
  createRouterManifest,
  filterRoutesByCapabilities,
  flattenRoutes,
  resolveRoutePath,
} from "../src";

const dashboardPrefetch = vi.fn(async () => "dashboard");
const modelsPrefetch = vi.fn(async () => "models");

const routes = [
  {
    capability: "dashboard",
    id: "dashboard",
    navigation: { group: "Workspace", order: 1 },
    path: "/dashboard",
    prefetch: dashboardPrefetch,
    title: "Dashboard",
  },
  {
    capability: "settings",
    id: "settings",
    navigation: { group: "Workspace", hidden: true, order: 2 },
    path: "/settings",
    title: "Settings",
  },
  {
    children: [
      {
        capability: "knowledge",
        id: "knowledge-list",
        navigation: { group: "AI", order: 2 },
        path: "knowledge",
        title: "Knowledge",
      },
      {
        capability: "models",
        id: "models-list",
        navigation: { group: "AI", order: 1 },
        path: "models",
        prefetch: modelsPrefetch,
        title: "Models",
      },
    ],
    id: "ai-root",
    path: "/ai",
  },
] as const;

describe("sdkwork-router-pc-react", () => {
  it("filters route trees, resolves full paths, and builds a route catalog", () => {
    const filtered = filterRoutesByCapabilities(routes, ["dashboard", "models"]);
    const catalog = createRouteCatalog(filtered);

    expect(flattenRoutes(filtered).map((item) => item.id)).toEqual([
      "dashboard",
      "ai-root",
      "models-list",
    ]);

    expect(catalog.routes.map((item) => ({
      fullPath: item.fullPath,
      id: item.id,
      parentId: item.parentId,
    }))).toEqual([
      {
        fullPath: "/dashboard",
        id: "dashboard",
        parentId: undefined,
      },
      {
        fullPath: "/ai",
        id: "ai-root",
        parentId: undefined,
      },
      {
        fullPath: "/ai/models",
        id: "models-list",
        parentId: "ai-root",
      },
    ]);
    expect(resolveRoutePath(catalog, "models-list")).toBe("/ai/models");
    expect(catalog.routesByPath["/ai/models"]?.id).toBe("models-list");
  });

  it("builds navigation groups and creates generic route intents from ids or raw paths", () => {
    const filtered = filterRoutesByCapabilities(routes, ["dashboard", "knowledge", "models"]);
    const catalog = createRouteCatalog(filtered);

    expect(createNavigationGroups(filtered)).toEqual([
      {
        id: "ai",
        items: [
          expect.objectContaining({ id: "models-list", title: "Models" }),
          expect.objectContaining({ id: "knowledge-list", title: "Knowledge" }),
        ],
        title: "AI",
      },
      {
        id: "workspace",
        items: [expect.objectContaining({ id: "dashboard", title: "Dashboard" })],
        title: "Workspace",
      },
    ]);

    expect(
      createRouteIntent(catalog, "models-list", {
        focusWindow: false,
        hash: "pricing",
        query: {
          tab: "providers",
        },
        replace: true,
      }),
    ).toEqual({
      focusWindow: false,
      replace: true,
      route: "/ai/models?tab=providers#pricing",
      routeId: "models-list",
      source: "router",
      type: "route-intent",
    });

    expect(
      createPathIntent("/settings/account", {
        focusWindow: false,
        query: {
          tab: "security",
        },
        source: "settings-workspace",
      }),
    ).toEqual({
      focusWindow: false,
      replace: false,
      route: "/settings/account?tab=security",
      source: "settings-workspace",
      type: "route-intent",
    });
  });

  it("schedules, cancels, and executes route prefetch work by resolved route prefix", async () => {
    const filtered = filterRoutesByCapabilities(routes, ["dashboard", "models"]);
    const catalog = createRouteCatalog(filtered);
    const scheduled = new Map<string, () => void>();
    const cleared: string[] = [];
    let handleCount = 0;

    const controller = createRoutePrefetchController({
      catalog,
      clearScheduled: (handle) => {
        cleared.push(String(handle));
      },
      schedule: (callback) => {
        handleCount += 1;
        const handle = `handle-${handleCount}`;
        scheduled.set(handle, callback);
        return handle;
      },
    });

    controller.schedule("/ai/models/run-1");
    expect(modelsPrefetch).not.toHaveBeenCalled();

    controller.cancel("/ai/models/run-1");
    expect(cleared).toEqual(["handle-1"]);

    controller.schedule("/ai/models/run-1");
    const scheduledCallback = scheduled.get("handle-2");
    expect(scheduledCallback).toBeTypeOf("function");

    scheduledCallback?.();
    await Promise.resolve();

    expect(modelsPrefetch).toHaveBeenCalledTimes(1);

    controller.prefetch("/dashboard");
    await Promise.resolve();

    expect(dashboardPrefetch).toHaveBeenCalledTimes(1);
  });

  it("creates a router manifest with route and navigation metadata", () => {
    const catalog = createRouteCatalog(
      filterRoutesByCapabilities(routes, ["dashboard", "knowledge", "models"]),
    );

    expect(
      createRouterManifest({
        catalog,
        defaultRouteId: "dashboard",
        packageNames: [
          "@sdkwork/router-pc-react",
          "@sdkwork/router-pc-react",
        ],
        theme: {
          color: "lobster",
        },
      }),
    ).toEqual({
      architecture: "pc-react",
      capability: "router",
      defaultRouteId: "dashboard",
      description: "Route catalog for workspace navigation, generic route intents, and prefetch orchestration.",
      host: "tauri",
      id: "sdkwork-router",
      navigationGroupIds: ["ai", "workspace"],
      packageNames: ["@sdkwork/router-pc-react"],
      routeIds: ["dashboard", "ai-root", "knowledge-list", "models-list"],
      theme: {
        color: "lobster",
        preset: "sdkwork",
        selection: "system",
      },
      title: "Router",
    });
  });
});
