import { describe, expect, it } from "vitest";
import {
  buildDashboardOverview,
  calculateDashboardHealthScore,
  createDashboardSectionDigest,
  createDashboardOverviewRouteIntent,
  createDashboardSectionRouteIntent,
  createDashboardWorkspaceManifest,
  createInitialDashboardDeferredSections,
  evaluateDashboardActionReadiness,
  mergeDashboardDeferredSections,
  scheduleDashboardSectionHydration,
  summarizeDashboardSectionDigests,
  summarizeDashboardSignals,
} from "../src";

const sections = [
  {
    id: "overview",
    priority: 1,
    title: "Overview",
  },
  {
    id: "permissions",
    priority: 2,
    title: "Permissions",
  },
  {
    deferred: true,
    id: "automation",
    priority: 3,
    title: "Automation",
  },
] as const;

const cards = [
  {
    id: "health",
    priority: 1,
    sectionId: "overview",
    severity: "warning",
    title: "Workspace Health",
    value: 58,
  },
  {
    id: "blocked-permissions",
    priority: 1,
    route: "/permissions?required=true",
    sectionId: "permissions",
    severity: "critical",
    title: "Blocked Permissions",
    value: 1,
  },
  {
    id: "active-workflows",
    priority: 2,
    sectionId: "automation",
    severity: "healthy",
    title: "Active Workflows",
    value: 12,
  },
  {
    id: "notifications",
    priority: 3,
    sectionId: "overview",
    severity: "info",
    title: "Unread Notifications",
    value: 5,
  },
] as const;

const signals = [
  {
    capabilityId: "permission",
    id: "filesystem-write",
    route: "/permissions/filesystem-write",
    score: 32,
    sectionId: "permissions",
    severity: "critical",
    tags: ["system", "security"],
    title: "Filesystem Write",
  },
  {
    capabilityId: "notification",
    id: "notification-delivery",
    route: "/notifications",
    score: 92,
    sectionId: "overview",
    severity: "healthy",
    tags: ["system"],
    title: "Notification Delivery",
  },
  {
    capabilityId: "workflow",
    id: "workflow-failures",
    route: "/workflows",
    score: 64,
    sectionId: "automation",
    severity: "warning",
    tags: ["automation"],
    title: "Workflow Failures",
  },
  {
    capabilityId: "llm",
    id: "model-spend",
    route: "/models",
    score: 78,
    sectionId: "overview",
    severity: "info",
    tags: ["cost"],
    title: "Model Spend",
  },
] as const;

const actions = [
  {
    id: "fix-permissions",
    priority: 1,
    route: "/permissions?required=true",
    sectionId: "permissions",
    severity: "critical",
    title: "Resolve blocked permissions",
  },
  {
    id: "repair-workflows",
    priority: 2,
    route: "/workflows",
    sectionId: "automation",
    severity: "warning",
    title: "Repair failed workflows",
  },
  {
    id: "review-costs",
    priority: 3,
    route: "/models",
    sectionId: "overview",
    severity: "info",
    title: "Review model spend",
  },
] as const;

const extendedSections = [
  ...sections,
  {
    id: "activity",
    priority: 4,
    title: "Activity",
  },
  {
    enabled: false,
    id: "operations",
    priority: 5,
    title: "Operations",
  },
] as const;

const sectionSummariesById = {
  overview: {
    actionIds: ["review-costs"],
    cardIds: ["health", "notifications"],
    deferred: false,
    id: "overview",
    itemCount: 5,
    severity: "warning",
    signalIds: ["model-spend", "notification-delivery"],
    title: "Overview",
  },
  permissions: {
    actionIds: ["fix-permissions"],
    cardIds: ["blocked-permissions"],
    deferred: false,
    id: "permissions",
    itemCount: 3,
    severity: "critical",
    signalIds: ["filesystem-write"],
    title: "Permissions",
  },
  automation: {
    actionIds: ["repair-workflows"],
    cardIds: ["active-workflows"],
    deferred: true,
    id: "automation",
    itemCount: 3,
    severity: "warning",
    signalIds: ["workflow-failures"],
    title: "Automation",
  },
  activity: {
    actionIds: [],
    cardIds: ["activity-feed"],
    deferred: false,
    id: "activity",
    itemCount: 1,
    severity: "info",
    signalIds: [],
    title: "Activity",
  },
} as const;

describe("sdkwork-dashboard-pc-react", () => {
  it("summarizes dashboard signals and derives a deterministic health score", () => {
    expect(summarizeDashboardSignals(signals)).toEqual({
      attentionIds: ["filesystem-write", "workflow-failures"],
      averageScore: 67,
      healthyIds: ["notification-delivery"],
      highestSeverity: "critical",
      severityCounts: {
        critical: 1,
        healthy: 1,
        info: 1,
        warning: 1,
      },
    });

    expect(calculateDashboardHealthScore(signals)).toBe(58);
  });

  it("builds a dashboard overview with prioritized cards, actions, and section summaries", () => {
    expect(
      buildDashboardOverview({
        actions,
        cards,
        sections,
        signals,
      }),
    ).toEqual({
      attentionSignalIds: ["filesystem-write", "workflow-failures"],
      featuredCardIds: ["blocked-permissions", "health", "notifications"],
      healthScore: 58,
      recommendedActionIds: ["fix-permissions", "repair-workflows", "review-costs"],
      sectionSummaries: [
        {
          actionIds: ["review-costs"],
          cardIds: ["health", "notifications"],
          deferred: false,
          id: "overview",
          itemCount: 5,
          severity: "warning",
          signalIds: ["model-spend", "notification-delivery"],
          title: "Overview",
        },
        {
          actionIds: ["fix-permissions"],
          cardIds: ["blocked-permissions"],
          deferred: false,
          id: "permissions",
          itemCount: 3,
          severity: "critical",
          signalIds: ["filesystem-write"],
          title: "Permissions",
        },
        {
          actionIds: ["repair-workflows"],
          cardIds: ["active-workflows"],
          deferred: true,
          id: "automation",
          itemCount: 3,
          severity: "warning",
          signalIds: ["workflow-failures"],
          title: "Automation",
        },
      ],
      status: "attention",
    });
  });

  it("creates deferred hydration state and schedules section batches", () => {
    const initialState = createInitialDashboardDeferredSections([
      "overview",
      "permissions",
      "overview",
    ]);

    expect(initialState).toEqual({
      overview: false,
      permissions: false,
    });

    expect(
      mergeDashboardDeferredSections(initialState, {
        permissions: true,
      }),
    ).toEqual({
      overview: false,
      permissions: true,
    });
    expect(
      mergeDashboardDeferredSections(initialState, {
        permissions: undefined,
      }),
    ).toEqual({
      overview: false,
      permissions: false,
    });

    const scheduled: Array<{ callback: () => void; delay: number; handle: number }> = [];
    const cleared: number[] = [];
    const patches: Array<Record<string, boolean>> = [];

    const cancel = scheduleDashboardSectionHydration({
      batches: [["permissions"], ["automation", "overview"]],
      clearScheduledTimeout: (handle) => {
        cleared.push(handle);
      },
      onBatchReady: (patch) => {
        patches.push(patch);
      },
      scheduleTimeout: (callback, delay) => {
        const handle = scheduled.length + 1;
        scheduled.push({ callback, delay, handle });
        return handle;
      },
    });

    expect(scheduled.map((entry) => entry.delay)).toEqual([80]);

    scheduled[0]?.callback();

    expect(patches).toEqual([
      {
        permissions: true,
      },
    ]);
    expect(scheduled.map((entry) => entry.delay)).toEqual([80, 120]);

    cancel();
    expect(cleared).toEqual([2]);

    scheduled[1]?.callback();

    expect(patches).toEqual([
      {
        permissions: true,
      },
    ]);
  });

  it("builds dashboard workspace manifests and route intents", () => {
    expect(
      createDashboardWorkspaceManifest({
        packageNames: [
          "@sdkwork/dashboard-pc-react",
          "@sdkwork/permission-pc-react",
          "@sdkwork/dashboard-pc-react",
        ],
        title: "Dashboard",
      }),
    ).toEqual({
      architecture: "pc-react",
      capability: "dashboard",
      description: "Dashboard workspace for cross-capability health, overview composition, and operational routing.",
      detailRoutePattern: "/dashboard/:sectionId",
      host: "tauri",
      id: "sdkwork-dashboard",
      packageNames: [
        "@sdkwork/dashboard-pc-react",
        "@sdkwork/permission-pc-react",
      ],
      routePath: "/dashboard",
      theme: {
        color: "lobster",
        preset: "sdkwork",
        selection: "system",
      },
      title: "Dashboard",
    });

    expect(
      createDashboardOverviewRouteIntent({
        section: "permissions",
        severity: "critical",
      }),
    ).toEqual({
      focusWindow: true,
      route: "/dashboard?section=permissions&severity=critical",
      section: "permissions",
      severity: "critical",
      source: "dashboard-workspace",
      type: "dashboard-overview-route-intent",
    });

    expect(createDashboardSectionRouteIntent("permissions")).toEqual({
      focusWindow: true,
      route: "/dashboard/permissions",
      sectionId: "permissions",
      source: "dashboard-workspace",
      type: "dashboard-section-route-intent",
    });
  });

  it("creates dashboard section digests and summarizes section state for dashboard shells", () => {
    const digests = extendedSections.map((section) =>
      createDashboardSectionDigest(section, {
        activeSectionId: "overview",
        activeSeverity: "warning",
        hydratedSectionIds: ["overview", "permissions"],
        summary: sectionSummariesById[section.id as keyof typeof sectionSummariesById],
      }),
    );

    expect(digests).toEqual([
      {
        actionCount: 1,
        cardCount: 2,
        digestStatus: "current",
        hasItems: true,
        id: "overview",
        isAvailable: true,
        isCurrent: true,
        isDeferred: false,
        isHydrated: true,
        itemCount: 5,
        matchesSection: true,
        matchesSeverity: true,
        route: "/dashboard/overview",
        severity: "warning",
        signalCount: 2,
        title: "Overview",
      },
      {
        actionCount: 1,
        cardCount: 1,
        digestStatus: "attention",
        hasItems: true,
        id: "permissions",
        isAvailable: true,
        isCurrent: false,
        isDeferred: false,
        isHydrated: true,
        itemCount: 3,
        matchesSection: false,
        matchesSeverity: false,
        route: "/dashboard/permissions",
        severity: "critical",
        signalCount: 1,
        title: "Permissions",
      },
      {
        actionCount: 1,
        cardCount: 1,
        digestStatus: "deferred",
        hasItems: true,
        id: "automation",
        isAvailable: true,
        isCurrent: false,
        isDeferred: true,
        isHydrated: false,
        itemCount: 3,
        matchesSection: false,
        matchesSeverity: true,
        route: "/dashboard/automation",
        severity: "warning",
        signalCount: 1,
        title: "Automation",
      },
      {
        actionCount: 0,
        cardCount: 1,
        digestStatus: "standard",
        hasItems: true,
        id: "activity",
        isAvailable: true,
        isCurrent: false,
        isDeferred: false,
        isHydrated: true,
        itemCount: 1,
        matchesSection: false,
        matchesSeverity: false,
        route: "/dashboard/activity",
        severity: "info",
        signalCount: 0,
        title: "Activity",
      },
      {
        actionCount: 0,
        cardCount: 0,
        digestStatus: "restricted",
        hasItems: false,
        id: "operations",
        isAvailable: false,
        isCurrent: false,
        isDeferred: false,
        isHydrated: false,
        itemCount: 0,
        matchesSection: false,
        matchesSeverity: false,
        route: "/dashboard/operations",
        severity: "healthy",
        signalCount: 0,
        title: "Operations",
      },
    ]);

    expect(summarizeDashboardSectionDigests(digests)).toEqual({
      attentionSections: 3,
      currentSections: 1,
      deferredSections: 1,
      healthySections: 0,
      hydratedSections: 3,
      populatedSections: 4,
      restrictedSections: 1,
      standardSections: 1,
      totalSections: 5,
    });
  });

  it("evaluates dashboard action readiness for open, route, and hydration flows", () => {
    const deferredDigest = createDashboardSectionDigest(extendedSections[2], {
      activeSectionId: "overview",
      activeSeverity: "warning",
      hydratedSectionIds: ["overview", "permissions"],
      summary: sectionSummariesById.automation,
    });
    const activityDigest = createDashboardSectionDigest(extendedSections[3], {
      activeSectionId: "overview",
      activeSeverity: "warning",
      route: "",
      summary: sectionSummariesById.activity,
    });
    const restrictedDigest = createDashboardSectionDigest(extendedSections[4], {
      activeSectionId: "overview",
      activeSeverity: "warning",
    });

    expect(
      evaluateDashboardActionReadiness(deferredDigest, {
        action: "open-section",
      }),
    ).toEqual({
      capabilities: {
        canHydrateSection: true,
        canOpenRoute: false,
        canOpenSection: false,
      },
      checklist: {
        hasRoute: true,
        isAvailable: true,
        isDeferred: true,
        isHydrated: false,
        matchesSection: false,
        matchesSeverity: true,
      },
      degraded: true,
      issues: ["section-mismatch", "section-not-hydrated"],
      ready: false,
    });

    expect(
      evaluateDashboardActionReadiness(deferredDigest, {
        action: "hydrate-section",
      }),
    ).toEqual({
      capabilities: {
        canHydrateSection: true,
        canOpenRoute: false,
        canOpenSection: false,
      },
      checklist: {
        hasRoute: true,
        isAvailable: true,
        isDeferred: true,
        isHydrated: false,
        matchesSection: false,
        matchesSeverity: true,
      },
      degraded: true,
      issues: ["section-mismatch"],
      ready: true,
    });

    expect(
      evaluateDashboardActionReadiness(activityDigest, {
        action: "open-route",
      }),
    ).toEqual({
      capabilities: {
        canHydrateSection: false,
        canOpenRoute: false,
        canOpenSection: true,
      },
      checklist: {
        hasRoute: false,
        isAvailable: true,
        isDeferred: false,
        isHydrated: true,
        matchesSection: false,
        matchesSeverity: false,
      },
      degraded: true,
      issues: ["section-mismatch", "severity-mismatch", "missing-route"],
      ready: false,
    });

    expect(
      evaluateDashboardActionReadiness(restrictedDigest, {
        action: "open-section",
      }),
    ).toEqual({
      capabilities: {
        canHydrateSection: false,
        canOpenRoute: false,
        canOpenSection: false,
      },
      checklist: {
        hasRoute: true,
        isAvailable: false,
        isDeferred: false,
        isHydrated: false,
        matchesSection: false,
        matchesSeverity: false,
      },
      degraded: true,
      issues: ["section-disabled", "section-mismatch", "severity-mismatch"],
      ready: false,
    });
  });
});
