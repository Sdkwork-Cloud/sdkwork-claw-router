import { describe, expect, it } from "vitest";
import {
  buildAppsLauncherEntries,
  collectInstallableAppIds,
  collectPriorityInstallableAppIds,
  createAppDetailRouteIntent,
  createAppCatalogDigest,
  createAppsLibraryRouteIntent,
  createAppsMetadataFields,
  createAppsOverview,
  createAppsWorkspaceManifest,
  evaluateAppInstallReadiness,
  filterAppCategories,
  summarizeAppCatalogDigests,
} from "../src";

const categories = [
  {
    apps: [
      {
        category: "AI Agents",
        description: "Install Sdkwork from the shared hub-installer catalog.",
        developer: "Sdkwork Labs",
        id: "app-sdkwork",
        installSummary: "Rust-backed installer catalog entry.",
        installTags: ["docker", "assistant"],
        installable: true,
        name: "Sdkwork",
      },
      {
        category: "AI Agents",
        description: "Terminal-first coding agent.",
        developer: "OpenAI",
        id: "app-codex",
        installSummary: "Bring Codex into the desktop workspace.",
        installTags: ["cli"],
        installable: true,
        name: "Codex",
      },
    ],
    title: "AI Agents",
  },
  {
    apps: [
      {
        category: "Tools",
        description: "Fast package manager for JavaScript.",
        developer: "pnpm",
        id: "app-pnpm",
        installSummary: "Install pnpm on the current host.",
        installTags: ["nodejs", "package-manager"],
        installable: true,
        name: "pnpm",
      },
      {
        category: "Tools",
        description: "Documentation and quickstart space.",
        developer: "SDKWORK",
        id: "app-docs",
        installTags: ["guide"],
        installable: false,
        name: "Docs",
      },
    ],
    title: "Tools",
  },
] as const;

const installSurfaceById = {
  "app-codex": {
    appId: "app-codex",
    blockingIssueCount: 0,
    dependencyAttentionCount: 0,
    ready: true,
    state: "ready",
    warningIssueCount: 0,
  },
  "app-sdkwork": {
    appId: "app-sdkwork",
    blockingIssueCount: 0,
    dependencyAttentionCount: 0,
    ready: true,
    state: "installed",
    warningIssueCount: 0,
  },
  "app-pnpm": {
    appId: "app-pnpm",
    blockingIssueCount: 1,
    dependencyAttentionCount: 1,
    ready: false,
    state: "attention",
    warningIssueCount: 0,
  },
} as const;

const usageRecords = [
  {
    appId: "app-codex",
    lastOpenedAt: "2026-04-02T10:00:00.000Z",
    launchCount: 8,
    pinned: true,
  },
  {
    appId: "app-sdkwork",
    lastOpenedAt: "2026-04-02T11:00:00.000Z",
    launchCount: 5,
  },
  {
    appId: "app-docs",
    lastOpenedAt: "2026-04-01T09:30:00.000Z",
    launchCount: 2,
  },
] as const;

describe("sdkwork-apps-pc-react", () => {
  it("filters catalog categories and collects installable ids", () => {
    expect(filterAppCategories(categories, "docker")).toEqual([
      {
        apps: [categories[0].apps[0]],
        title: "AI Agents",
      },
    ]);

    expect(collectInstallableAppIds(categories)).toEqual([
      "app-sdkwork",
      "app-codex",
      "app-pnpm",
    ]);
    expect(collectPriorityInstallableAppIds(categories, 2)).toEqual([
      "app-sdkwork",
      "app-codex",
    ]);
  });

  it("creates app-center overview totals and prioritized launcher entries", () => {
    expect(createAppsOverview(categories, installSurfaceById)).toEqual({
      attentionApps: 1,
      installableApps: 3,
      installedApps: 1,
      readyApps: 1,
      totalApps: 4,
      totalCategories: 2,
    });

    expect(
      buildAppsLauncherEntries(categories, {
        installSurfaceById,
        usageRecords,
      }),
    ).toEqual([
      {
        appId: "app-codex",
        lastOpenedAt: "2026-04-02T10:00:00.000Z",
        launchCount: 8,
        pinned: true,
        reason: "pinned",
        state: "ready",
      },
      {
        appId: "app-sdkwork",
        lastOpenedAt: "2026-04-02T11:00:00.000Z",
        launchCount: 5,
        pinned: false,
        reason: "recent",
        state: "installed",
      },
      {
        appId: "app-docs",
        lastOpenedAt: "2026-04-01T09:30:00.000Z",
        launchCount: 2,
        pinned: false,
        reason: "recent",
        state: "unknown",
      },
      {
        appId: "app-pnpm",
        launchCount: 0,
        pinned: false,
        reason: "install-state",
        state: "attention",
      },
    ]);
  });

  it("creates app digests and summary counters for app-center cards", () => {
    const digestApps = [
      {
        ...categories[0].apps[0],
        supportedHostLabels: ["Windows", "Linux"],
      },
      {
        ...categories[0].apps[1],
        supportedHostLabels: ["Windows"],
      },
      {
        ...categories[1].apps[0],
        supportedHostLabels: ["Windows"],
      },
      categories[1].apps[1],
      {
        category: "Tools",
        description: "Install Node.js on the current host.",
        developer: "Node.js",
        id: "app-nodejs",
        installSummary: "Runtime dependency for package tooling.",
        installTags: ["runtime"],
        installable: true,
        name: "Node.js",
        supportedHostLabels: ["Windows"],
      },
    ] as const;

    const digests = digestApps.map((app) =>
      createAppCatalogDigest(app, {
        activeCategory: "AI Agents",
        activeState: "installed",
        currentAppId: "app-sdkwork",
        hostLabel: "Windows",
        installSurfaceById,
        usageRecords,
      }),
    );

    expect(
      Object.fromEntries(digests.map((digest) => [digest.appId, digest.digestStatus])),
    ).toEqual({
      "app-codex": "ready",
      "app-docs": "restricted",
      "app-nodejs": "installable",
      "app-sdkwork": "current",
      "app-pnpm": "attention",
    });

    expect(digests.find((digest) => digest.appId === "app-sdkwork")).toMatchObject({
      blockingIssueCount: 0,
      dependencyAttentionCount: 0,
      isCompatibleHost: true,
      isCurrent: true,
      isInstallable: true,
      route: "/apps/app-sdkwork",
      supportedHostCount: 2,
      tagCount: 2,
    });

    expect(digests.find((digest) => digest.appId === "app-codex")).toMatchObject({
      isPinned: true,
      launchCount: 8,
      matchesCategory: true,
      matchesState: false,
      state: "ready",
    });

    expect(digests.find((digest) => digest.appId === "app-nodejs")).toMatchObject({
      isAvailable: true,
      matchesCategory: false,
      matchesState: false,
      state: "unknown",
    });

    expect(summarizeAppCatalogDigests(digests)).toEqual({
      attentionApps: 1,
      currentApps: 1,
      installableApps: 4,
      installedApps: 1,
      pinnedApps: 1,
      readyApps: 1,
      restrictedApps: 1,
      totalApps: 5,
    });
  });

  it("treats category and state mismatch as degraded while allowing supported installs", () => {
    const readiness = evaluateAppInstallReadiness(
      {
        ...categories[0].apps[1],
        supportedHostLabels: ["Windows"],
      },
      {
        action: "install",
        activeCategory: "Tools",
        activeState: "installed",
        hostLabel: "Windows",
        installSurface: installSurfaceById["app-codex"],
      },
    );

    expect(readiness).toEqual({
      capabilities: {
        canInstall: true,
        canLaunch: false,
        canOpenDetail: true,
        canUninstall: false,
      },
      checklist: {
        hasInstallSurface: true,
        isCompatibleHost: true,
        isInstallable: true,
        isInstalled: false,
        isReady: true,
        matchesCategory: false,
        matchesState: false,
      },
      degraded: true,
      issues: ["category-mismatch", "state-mismatch"],
      ready: true,
    });
  });

  it("blocks unsupported install and launch actions while keeping installed apps uninstallable", () => {
    expect(
      evaluateAppInstallReadiness(
        {
          ...categories[1].apps[0],
          supportedHostLabels: ["Windows"],
        },
        {
          action: "install",
          hostLabel: "macOS",
          installSurface: installSurfaceById["app-pnpm"],
        },
      ),
    ).toEqual({
      capabilities: {
        canInstall: false,
        canLaunch: false,
        canOpenDetail: true,
        canUninstall: false,
      },
      checklist: {
        hasInstallSurface: true,
        isCompatibleHost: false,
        isInstallable: true,
        isInstalled: false,
        isReady: false,
        matchesCategory: true,
        matchesState: true,
      },
      degraded: false,
      issues: ["host-unsupported", "blocking-issues", "dependency-attention"],
      ready: false,
    });

    expect(
      evaluateAppInstallReadiness(
        {
          category: "Tools",
          developer: "Node.js",
          id: "app-nodejs",
          installable: true,
          name: "Node.js",
          supportedHostLabels: ["Windows"],
        },
        {
          action: "install",
          hostLabel: "Windows",
        },
      ),
    ).toEqual({
      capabilities: {
        canInstall: false,
        canLaunch: false,
        canOpenDetail: true,
        canUninstall: false,
      },
      checklist: {
        hasInstallSurface: false,
        isCompatibleHost: true,
        isInstallable: true,
        isInstalled: false,
        isReady: false,
        matchesCategory: true,
        matchesState: true,
      },
      degraded: false,
      issues: ["install-surface-missing"],
      ready: false,
    });

    expect(
      evaluateAppInstallReadiness(
        {
          ...categories[0].apps[1],
          supportedHostLabels: ["Windows"],
        },
        {
          action: "launch",
          hostLabel: "Windows",
          installSurface: installSurfaceById["app-codex"],
        },
      ),
    ).toEqual({
      capabilities: {
        canInstall: true,
        canLaunch: false,
        canOpenDetail: true,
        canUninstall: false,
      },
      checklist: {
        hasInstallSurface: true,
        isCompatibleHost: true,
        isInstallable: true,
        isInstalled: false,
        isReady: true,
        matchesCategory: true,
        matchesState: true,
      },
      degraded: false,
      issues: ["not-installed"],
      ready: false,
    });

    expect(
      evaluateAppInstallReadiness(
        {
          ...categories[0].apps[0],
          supportedHostLabels: ["Windows", "Linux"],
        },
        {
          action: "uninstall",
          hostLabel: "Windows",
          installSurface: installSurfaceById["app-sdkwork"],
        },
      ),
    ).toEqual({
      capabilities: {
        canInstall: false,
        canLaunch: true,
        canOpenDetail: true,
        canUninstall: true,
      },
      checklist: {
        hasInstallSurface: true,
        isCompatibleHost: true,
        isInstallable: true,
        isInstalled: true,
        isReady: true,
        matchesCategory: true,
        matchesState: true,
      },
      degraded: false,
      issues: [],
      ready: true,
    });
  });

  it("creates metadata fields without inventing empty values", () => {
    expect(
      createAppsMetadataFields({
        defaultSoftwareName: "sdkwork-wsl",
        registryName: "Hub Installer Official Registry",
        selectedSoftwareName: "",
        supportedHostLabels: ["Windows", "Ubuntu", "Windows"],
      }),
    ).toEqual([
      {
        id: "registry",
        value: "Hub Installer Official Registry",
      },
      {
        id: "defaultSoftwareName",
        value: "sdkwork-wsl",
      },
      {
        id: "supportedHosts",
        value: "Windows, Ubuntu",
      },
    ]);
  });

  it("builds apps workspace manifests and route intents", () => {
    expect(
      createAppsWorkspaceManifest({
        packageNames: [
          "@sdkwork/apps-pc-react",
          "@sdkwork/dashboard-pc-react",
          "@sdkwork/apps-pc-react",
        ],
        title: "Apps",
      }),
    ).toEqual({
      architecture: "pc-react",
      capability: "apps",
      description: "Apps workspace for catalog browsing, install readiness, and launcher routing.",
      detailRoutePattern: "/apps/:appId",
      host: "tauri",
      id: "sdkwork-apps",
      packageNames: [
        "@sdkwork/apps-pc-react",
        "@sdkwork/dashboard-pc-react",
      ],
      routePath: "/apps",
      theme: {
        color: "lobster",
        preset: "sdkwork",
        selection: "system",
      },
      title: "Apps",
    });

    expect(
      createAppsLibraryRouteIntent({
        category: "agents",
        state: "ready",
      }),
    ).toEqual({
      category: "agents",
      focusWindow: true,
      route: "/apps?category=agents&state=ready",
      source: "apps-workspace",
      state: "ready",
      type: "apps-library-route-intent",
    });

    expect(createAppDetailRouteIntent("app-sdkwork")).toEqual({
      appId: "app-sdkwork",
      focusWindow: true,
      route: "/apps/app-sdkwork",
      source: "apps-workspace",
      type: "app-detail-route-intent",
    });
  });
});
