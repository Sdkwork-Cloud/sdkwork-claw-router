import { describe, expect, it } from "vitest";
import {
  buildHomeQuickStart,
  createHomeEntryDigest,
  createHomeRecommendationRouteIntent,
  createHomeRouteIntent,
  createHomeWorkspaceManifest,
  evaluateHomeEntryReadiness,
  resolveHomeStartupRoute,
  summarizeHomeEntryDigests,
} from "../src";

const sections = [
  {
    id: "continue",
    priority: 1,
    title: "Continue",
  },
  {
    id: "discover",
    priority: 2,
    title: "Discover",
  },
  {
    id: "system",
    priority: 3,
    title: "System",
  },
] as const;

const shortcuts = [
  {
    id: "resume-chat",
    kind: "communication",
    priority: 1,
    recent: true,
    route: "/chat/session-1",
    sectionId: "continue",
    title: "Resume Chat",
  },
  {
    id: "open-dashboard",
    kind: "system",
    pinned: true,
    priority: 2,
    route: "/dashboard",
    sectionId: "system",
    title: "Open Dashboard",
  },
  {
    id: "browse-apps",
    kind: "app",
    priority: 1,
    route: "/apps",
    sectionId: "discover",
    title: "Browse Apps",
  },
  {
    id: "open-docs",
    kind: "docs",
    priority: 3,
    route: "/docs",
    sectionId: "discover",
    title: "Open Docs",
  },
] as const;

const recommendations = [
  {
    id: "finish-permissions",
    priority: 1,
    route: "/permissions?required=true",
    sectionId: "system",
    severity: "critical",
    title: "Finish required permissions",
  },
  {
    id: "install-sdkwork",
    priority: 2,
    route: "/apps/app-sdkwork",
    sectionId: "discover",
    severity: "warning",
    title: "Install Sdkwork",
  },
  {
    id: "read-quickstart",
    priority: 3,
    route: "/docs/quickstart",
    sectionId: "discover",
    severity: "info",
    title: "Read quickstart",
  },
] as const;

const extraShortcuts = [
  ...shortcuts,
  {
    id: "broken-shortcut",
    kind: "automation",
    priority: 4,
    recent: false,
    route: "",
    sectionId: "system",
    title: "Broken Shortcut",
  },
] as const;

describe("sdkwork-home-pc-react", () => {
  it("builds quick-start outputs with featured shortcuts, ordered recommendations, and section tones", () => {
    expect(
      buildHomeQuickStart({
        recommendations,
        sections,
        shortcuts,
      }),
    ).toEqual({
      featuredShortcutIds: ["open-dashboard", "resume-chat", "browse-apps"],
      recommendationIds: ["finish-permissions", "install-sdkwork", "read-quickstart"],
      sectionSummaries: [
        {
          id: "continue",
          priority: 1,
          recommendationIds: [],
          shortcutIds: ["resume-chat"],
          title: "Continue",
          tone: "featured",
        },
        {
          id: "discover",
          priority: 2,
          recommendationIds: ["install-sdkwork", "read-quickstart"],
          shortcutIds: ["browse-apps", "open-docs"],
          title: "Discover",
          tone: "attention",
        },
        {
          id: "system",
          priority: 3,
          recommendationIds: ["finish-permissions"],
          shortcutIds: ["open-dashboard"],
          title: "System",
          tone: "attention",
        },
      ],
      status: "attention",
    });
  });

  it("resolves startup routes from home, dashboard, last-route, and workspace modes", () => {
    expect(
      resolveHomeStartupRoute({
        startupMode: "dashboard",
      }),
    ).toBe("/dashboard");

    expect(
      resolveHomeStartupRoute({
        lastRoute: "/chat/session-1",
        startupMode: "last-route",
      }),
    ).toBe("/chat/session-1");

    expect(
      resolveHomeStartupRoute({
        startupMode: "workspace",
        workspaceRoute: "/workspace/main",
      }),
    ).toBe("/workspace/main");

    expect(
      resolveHomeStartupRoute({
        startupMode: "last-route",
        workspaceRoute: "/dashboard",
      }),
    ).toBe("/dashboard");
  });

  it("builds home workspace manifests and route intents", () => {
    expect(
      createHomeWorkspaceManifest({
        packageNames: [
          "@sdkwork/home-pc-react",
          "@sdkwork/dashboard-pc-react",
          "@sdkwork/home-pc-react",
        ],
        title: "Home",
      }),
    ).toEqual({
      architecture: "pc-react",
      capability: "home",
      description: "Home workspace for quick-start composition, personalized entry routing, and startup handoff.",
      host: "tauri",
      id: "sdkwork-home",
      packageNames: [
        "@sdkwork/home-pc-react",
        "@sdkwork/dashboard-pc-react",
      ],
      recommendationRoutePattern: "/home/recommendations/:recommendationId",
      routePath: "/home",
      theme: {
        color: "lobster",
        preset: "sdkwork",
        selection: "system",
      },
      title: "Home",
    });

    expect(
      createHomeRouteIntent({
        section: "discover",
      }),
    ).toEqual({
      focusWindow: true,
      route: "/home?section=discover",
      section: "discover",
      source: "home-workspace",
      type: "home-route-intent",
    });

    expect(createHomeRecommendationRouteIntent("finish-permissions")).toEqual({
      focusWindow: true,
      recommendationId: "finish-permissions",
      route: "/home/recommendations/finish-permissions",
      source: "home-workspace",
      type: "home-recommendation-route-intent",
    });
  });

  it("creates home entry digests and summarizes home entry state for startup hubs", () => {
    const digests = [
      ...extraShortcuts.map((shortcut) =>
        createHomeEntryDigest(shortcut, {
          activeSectionId: "discover",
          currentRoute: "/dashboard",
          entryTypeFilter: "shortcut",
          startupRoute: "/dashboard",
        }),
      ),
      ...recommendations.map((recommendation) =>
        createHomeEntryDigest(recommendation, {
          activeSectionId: "discover",
          currentRoute: "/dashboard",
          entryTypeFilter: "shortcut",
          startupRoute: "/dashboard",
        }),
      ),
    ];

    expect(digests).toEqual([
      {
        digestStatus: "featured",
        entryId: "resume-chat",
        entryType: "shortcut",
        isAvailable: true,
        isCurrent: false,
        isPinned: false,
        isRecent: true,
        isStartupTarget: false,
        kind: "communication",
        matchesSection: false,
        matchesType: true,
        priority: 1,
        route: "/chat/session-1",
        sectionId: "continue",
        title: "Resume Chat",
      },
      {
        digestStatus: "current",
        entryId: "open-dashboard",
        entryType: "shortcut",
        isAvailable: true,
        isCurrent: true,
        isPinned: true,
        isRecent: false,
        isStartupTarget: true,
        kind: "system",
        matchesSection: false,
        matchesType: true,
        priority: 2,
        route: "/dashboard",
        sectionId: "system",
        title: "Open Dashboard",
      },
      {
        digestStatus: "standard",
        entryId: "browse-apps",
        entryType: "shortcut",
        isAvailable: true,
        isCurrent: false,
        isPinned: false,
        isRecent: false,
        isStartupTarget: false,
        kind: "app",
        matchesSection: true,
        matchesType: true,
        priority: 1,
        route: "/apps",
        sectionId: "discover",
        title: "Browse Apps",
      },
      {
        digestStatus: "standard",
        entryId: "open-docs",
        entryType: "shortcut",
        isAvailable: true,
        isCurrent: false,
        isPinned: false,
        isRecent: false,
        isStartupTarget: false,
        kind: "docs",
        matchesSection: true,
        matchesType: true,
        priority: 3,
        route: "/docs",
        sectionId: "discover",
        title: "Open Docs",
      },
      {
        digestStatus: "restricted",
        entryId: "broken-shortcut",
        entryType: "shortcut",
        isAvailable: false,
        isCurrent: false,
        isPinned: false,
        isRecent: false,
        isStartupTarget: false,
        kind: "automation",
        matchesSection: false,
        matchesType: true,
        priority: 4,
        sectionId: "system",
        title: "Broken Shortcut",
      },
      {
        digestStatus: "attention",
        entryId: "finish-permissions",
        entryType: "recommendation",
        isAvailable: true,
        isCurrent: false,
        isStartupTarget: false,
        matchesSection: false,
        matchesType: false,
        priority: 1,
        route: "/permissions?required=true",
        sectionId: "system",
        severity: "critical",
        title: "Finish required permissions",
      },
      {
        digestStatus: "attention",
        entryId: "install-sdkwork",
        entryType: "recommendation",
        isAvailable: true,
        isCurrent: false,
        isStartupTarget: false,
        matchesSection: true,
        matchesType: false,
        priority: 2,
        route: "/apps/app-sdkwork",
        sectionId: "discover",
        severity: "warning",
        title: "Install Sdkwork",
      },
      {
        digestStatus: "standard",
        entryId: "read-quickstart",
        entryType: "recommendation",
        isAvailable: true,
        isCurrent: false,
        isStartupTarget: false,
        matchesSection: true,
        matchesType: false,
        priority: 3,
        route: "/docs/quickstart",
        sectionId: "discover",
        severity: "info",
        title: "Read quickstart",
      },
    ]);

    expect(summarizeHomeEntryDigests(digests)).toEqual({
      attentionEntries: 2,
      availableEntries: 7,
      currentEntries: 1,
      featuredEntries: 1,
      recommendationEntries: 3,
      restrictedEntries: 1,
      shortcutEntries: 5,
      startupEntries: 1,
      totalEntries: 8,
    });
  });

  it("evaluates home entry readiness for launch and startup-target flows", () => {
    const dashboardDigest = createHomeEntryDigest(shortcuts[1], {
      activeSectionId: "discover",
      currentRoute: "/dashboard",
      entryTypeFilter: "shortcut",
      startupRoute: "/dashboard",
    });
    const recommendationDigest = createHomeEntryDigest(recommendations[1], {
      activeSectionId: "discover",
      currentRoute: "/dashboard",
      entryTypeFilter: "shortcut",
      startupRoute: "/dashboard",
    });
    const brokenDigest = createHomeEntryDigest(extraShortcuts[4], {
      activeSectionId: "discover",
      currentRoute: "/dashboard",
      entryTypeFilter: "shortcut",
      startupRoute: "/dashboard",
    });

    expect(
      evaluateHomeEntryReadiness(recommendationDigest, {
        action: "open-entry",
      }),
    ).toEqual({
      capabilities: {
        canOpenEntry: true,
        canSetStartup: true,
      },
      checklist: {
        hasRoute: true,
        isAvailable: true,
        isStartupTarget: false,
        matchesSection: true,
        matchesType: false,
      },
      degraded: true,
      issues: ["entry-type-mismatch"],
      ready: true,
    });

    expect(
      evaluateHomeEntryReadiness(dashboardDigest, {
        action: "set-startup",
      }),
    ).toEqual({
      capabilities: {
        canOpenEntry: true,
        canSetStartup: false,
      },
      checklist: {
        hasRoute: true,
        isAvailable: true,
        isStartupTarget: true,
        matchesSection: false,
        matchesType: true,
      },
      degraded: true,
      issues: ["section-mismatch", "already-startup-target"],
      ready: false,
    });

    expect(
      evaluateHomeEntryReadiness(brokenDigest, {
        action: "open-entry",
      }),
    ).toEqual({
      capabilities: {
        canOpenEntry: false,
        canSetStartup: false,
      },
      checklist: {
        hasRoute: false,
        isAvailable: false,
        isStartupTarget: false,
        matchesSection: false,
        matchesType: true,
      },
      degraded: true,
      issues: ["section-mismatch", "missing-route"],
      ready: false,
    });
  });
});
