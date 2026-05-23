import { describe, expect, it } from "vitest";
import {
  createBackNavigationDecision,
  createNavigationGroups,
  createPathIntent,
  createRouteCatalog,
  createRouteIntent,
  createRouterManifest,
  filterRoutesByCapabilities,
  flattenRoutes,
  normalizeRoutePath,
  resolveInitialRoute,
  resolveRoutePath,
  resolveRouteTarget,
} from "../src";

const routes = [
  {
    access: "protected",
    capability: "home",
    id: "home",
    navigation: { group: "Tabs", order: 1, tabId: "home" },
    path: "/",
    presentation: "tab",
    title: "Home",
  },
  {
    access: "public",
    aliases: ["/oauth/callback"],
    id: "auth-callback",
    navigation: { hidden: true },
    path: "/auth/callback",
    presentation: "replace-root",
    title: "OAuth Callback",
  },
  {
    children: [
      {
        access: "protected",
        capability: "user",
        id: "profile",
        navigation: { group: "Me", order: 1 },
        path: "profile",
        presentation: "push",
        title: "Profile",
      },
      {
        access: "protected",
        capability: "auth",
        id: "security",
        navigation: { group: "Me", order: 2 },
        path: "security",
        presentation: "push",
        title: "Security",
      },
    ],
    id: "settings-root",
    path: "/settings",
  },
  {
    access: "public",
    id: "join-group",
    navigation: { group: "Utility", hidden: true },
    path: "/join-group",
    presentation: "sheet",
    title: "Join Group",
  },
] as const;

describe("sdkwork-router-mobile-react", () => {
  it("filters route trees, resolves full paths, and indexes canonical plus alias paths", () => {
    const filtered = filterRoutesByCapabilities(routes, ["home", "auth"]);
    const catalog = createRouteCatalog(filtered);

    expect(flattenRoutes(filtered).map((item) => item.id)).toEqual([
      "home",
      "auth-callback",
      "settings-root",
      "security",
      "join-group",
    ]);

    expect(catalog.routes.map((item) => ({
      access: item.access,
      fullPath: item.fullPath,
      id: item.id,
      parentId: item.parentId,
      presentation: item.presentation,
    }))).toEqual([
      {
        access: "protected",
        fullPath: "/",
        id: "home",
        parentId: undefined,
        presentation: "tab",
      },
      {
        access: "public",
        fullPath: "/auth/callback",
        id: "auth-callback",
        parentId: undefined,
        presentation: "replace-root",
      },
      {
        access: "protected",
        fullPath: "/settings",
        id: "settings-root",
        parentId: undefined,
        presentation: "push",
      },
      {
        access: "protected",
        fullPath: "/settings/security",
        id: "security",
        parentId: "settings-root",
        presentation: "push",
      },
      {
        access: "public",
        fullPath: "/join-group",
        id: "join-group",
        parentId: undefined,
        presentation: "sheet",
      },
    ]);
    expect(catalog.routesByPath["/oauth/callback"]?.id).toBe("auth-callback");
    expect(resolveRoutePath(catalog, "security")).toBe("/settings/security");
    expect(catalog.publicRouteIds).toEqual(["auth-callback", "join-group"]);
    expect(catalog.tabRouteIds).toEqual(["home"]);
  });

  it("builds navigation groups and normalizes raw route targets through canonical aliases", () => {
    const catalog = createRouteCatalog(routes);

    expect(createNavigationGroups(routes)).toEqual([
      {
        id: "me",
        items: [
          expect.objectContaining({ id: "profile", title: "Profile" }),
          expect.objectContaining({ id: "security", title: "Security" }),
        ],
        title: "Me",
      },
      {
        id: "tabs",
        items: [expect.objectContaining({ id: "home", title: "Home", tabId: "home" })],
        title: "Tabs",
      },
    ]);

    expect(normalizeRoutePath("oauth/callback?code=1#state")).toBe("/oauth/callback");
    expect(
      resolveRouteTarget({
        catalog,
        rawPath: "oauth/callback?code=1#state",
      }),
    ).toEqual({
      canonicalPath: "/auth/callback",
      ok: true,
      path: "/oauth/callback",
      routeId: "auth-callback",
    });

    expect(
      resolveInitialRoute({
        catalog,
        fallbackPath: "/",
        rawPath: "/unknown/path",
      }),
    ).toBe("/");
  });

  it("creates mobile route intents from raw paths and route ids", () => {
    const catalog = createRouteCatalog(routes);

    expect(
      createRouteIntent(catalog, "security", {
        focusApp: false,
        query: {
          tab: "passkey",
        },
        replace: true,
      }),
    ).toEqual({
      focusApp: false,
      replace: true,
      route: "/settings/security?tab=passkey",
      routeId: "security",
      source: "router",
      type: "mobile-route-intent",
    });

    expect(
      createPathIntent("/join-group", {
        focusApp: true,
        query: {
          invite: "demo",
        },
        source: "invite-link",
      }),
    ).toEqual({
      focusApp: true,
      replace: false,
      route: "/join-group?invite=demo",
      source: "invite-link",
      type: "mobile-route-intent",
    });
  });

  it("creates back-navigation decisions from app-managed history index", () => {
    expect(
      createBackNavigationDecision({
        fallbackPath: "/",
        historyIndex: 3,
      }),
    ).toEqual({
      action: "history-back",
      fallbackPath: "/",
    });

    expect(
      createBackNavigationDecision({
        fallbackPath: "/",
        historyIndex: 0,
      }),
    ).toEqual({
      action: "navigate",
      targetPath: "/",
    });
  });

  it("creates a mobile router manifest with route, public-route, and navigation metadata", () => {
    const catalog = createRouteCatalog(routes);

    expect(
      createRouterManifest({
        catalog,
        defaultRouteId: "home",
        packageNames: [
          "@sdkwork/router-mobile-react",
          "@sdkwork/router-mobile-react",
        ],
        theme: {
          color: "lobster",
        },
      }),
    ).toEqual({
      architecture: "mobile-react",
      capability: "router",
      defaultRouteId: "home",
      description: "Route catalog for scene navigation, deep-link-safe route intents, and app-managed back-stack decisions.",
      host: "capacitor",
      id: "sdkwork-router",
      navigationGroupIds: ["me", "tabs"],
      packageNames: ["@sdkwork/router-mobile-react"],
      publicRouteIds: ["auth-callback", "join-group"],
      routeIds: ["home", "auth-callback", "settings-root", "profile", "security", "join-group"],
      tabRouteIds: ["home"],
      theme: {
        color: "lobster",
        preset: "sdkwork",
        selection: "system",
      },
      title: "Router",
    });
  });
});
