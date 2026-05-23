import { describe, expect, it } from "vitest";
import {
  buildAboutOverview,
  createAboutRuntimeDependencyDigest,
  createAboutLegalRouteIntent,
  createAboutRouteIntent,
  createAboutWorkspaceManifest,
  evaluateAboutRuntimeDependencyReadiness,
  summarizeAboutRuntimeDependencyDigests,
  summarizeAboutRuntime,
} from "../src";

const highlights = [
  {
    description: "Unify models, tools, apps, and agents on one shared shell.",
    id: "trust-layer",
    priority: 1,
    title: "Unified AI trust layer",
  },
  {
    description: "Make the first connection and first delivery faster.",
    id: "fast-onboarding",
    priority: 2,
    title: "Faster onboarding",
  },
  {
    description: "Keep production teams on one stable runtime path.",
    id: "production-ready",
    priority: 3,
    title: "Production ready",
  },
] as const;

const quickLinks = [
  {
    href: "/docs",
    id: "docs-center",
    kind: "docs",
    priority: 1,
    title: "Docs Center",
  },
  {
    href: "/support",
    id: "support-center",
    kind: "support",
    priority: 2,
    title: "Support Center",
  },
  {
    href: "/download",
    id: "download-desktop",
    kind: "download",
    priority: 3,
    title: "Desktop Download",
  },
  {
    href: "/news",
    id: "release-notes",
    kind: "news",
    priority: 4,
    title: "Release Notes",
  },
] as const;

const legalDocuments = [
  {
    id: "privacy",
    kind: "privacy",
    priority: 1,
    route: "/about/legal/privacy",
    title: "Privacy Policy",
    updatedAt: "2026-03-28T00:00:00.000Z",
  },
  {
    id: "terms",
    kind: "terms",
    priority: 2,
    route: "/about/legal/terms",
    title: "Terms of Service",
    updatedAt: "2026-03-29T00:00:00.000Z",
  },
  {
    id: "license",
    kind: "license",
    priority: 3,
    route: "/about/legal/license",
    title: "License",
  },
] as const;

const runtimeDependencies = [
  {
    currentVersion: "2.6.0",
    environment: "desktop",
    id: "app-runtime",
    priority: 1,
    status: "healthy",
    title: "SDKWORK Desktop",
  },
  {
    currentVersion: "0.9.0",
    environment: "windows",
    id: "codex-cli",
    latestVersion: "1.0.0",
    priority: 2,
    status: "outdated",
    title: "Codex CLI",
  },
  {
    environment: "wsl",
    id: "gemini-cli",
    priority: 3,
    status: "missing",
    title: "Gemini CLI",
  },
  {
    detail: "Runtime bridge unavailable.",
    environment: "desktop",
    id: "mcp-bridge",
    priority: 4,
    status: "error",
    title: "MCP Bridge",
  },
] as const;

describe("sdkwork-about-pc-react", () => {
  it("summarizes runtime dependencies with counts, attention ids, and status precedence", () => {
    expect(summarizeAboutRuntime(runtimeDependencies)).toEqual({
      attentionIds: ["mcp-bridge", "gemini-cli", "codex-cli"],
      healthyIds: ["app-runtime"],
      highestStatus: "error",
      outdatedIds: ["codex-cli"],
      statusCounts: {
        error: 1,
        healthy: 1,
        missing: 1,
        outdated: 1,
      },
    });
  });

  it("builds an about overview with sorted highlights, quick links, legal docs, and runtime posture", () => {
    expect(
      buildAboutOverview({
        highlights,
        legalDocuments,
        quickLinks,
        runtimeDependencies,
      }),
    ).toEqual({
      highlightIds: ["trust-layer", "fast-onboarding", "production-ready"],
      legalDocumentIds: ["privacy", "terms", "license"],
      quickLinkIds: [
        "docs-center",
        "support-center",
        "download-desktop",
        "release-notes",
      ],
      runtimeAttentionIds: ["mcp-bridge", "gemini-cli", "codex-cli"],
      runtimeStatus: "attention",
    });
  });

  it("builds about workspace manifests and route intents", () => {
    expect(
      createAboutWorkspaceManifest({
        packageNames: [
          "@sdkwork/about-pc-react",
          "@sdkwork/support-pc-react",
          "@sdkwork/about-pc-react",
        ],
        title: "About",
      }),
    ).toEqual({
      architecture: "pc-react",
      capability: "about",
      description: "About workspace for app identity, runtime metadata, and legal navigation.",
      host: "tauri",
      id: "sdkwork-about",
      legalRoutePattern: "/about/legal/:documentId",
      packageNames: [
        "@sdkwork/about-pc-react",
        "@sdkwork/support-pc-react",
      ],
      routePath: "/about",
      theme: {
        color: "lobster",
        preset: "sdkwork",
        selection: "system",
      },
      title: "About",
    });

    expect(
      createAboutRouteIntent({
        sectionId: "runtime",
      }),
    ).toEqual({
      focusWindow: true,
      route: "/about?section=runtime",
      sectionId: "runtime",
      source: "about-workspace",
      type: "about-route-intent",
    });

    expect(
      createAboutLegalRouteIntent("privacy"),
    ).toEqual({
      documentId: "privacy",
      focusWindow: true,
      route: "/about/legal/privacy",
      source: "about-workspace",
      type: "about-legal-route-intent",
    });
  });

  it("creates runtime dependency digests and summarizes runtime dependency posture", () => {
    const digests = runtimeDependencies.map((dependency) =>
      createAboutRuntimeDependencyDigest(dependency, {
        activeEnvironment: "desktop",
        currentDependencyId: "app-runtime",
        detailRoute:
          dependency.id === "mcp-bridge"
            ? undefined
            : `/about/runtime/${dependency.id}`,
        installHref:
          dependency.id === "gemini-cli"
            ? "https://sdkwork.dev/runtime/gemini/install"
            : undefined,
        updateHref:
          dependency.id === "codex-cli"
            ? "https://sdkwork.dev/runtime/codex/update"
            : undefined,
      }),
    );

    expect(digests).toEqual([
      {
        currentVersion: "2.6.0",
        dependencyId: "app-runtime",
        detailRoute: "/about/runtime/app-runtime",
        digestStatus: "current",
        environment: "desktop",
        hasInstalledVersion: true,
        hasUpdateAvailable: false,
        isCurrent: true,
        latestVersion: undefined,
        matchesEnvironment: true,
        status: "healthy",
        title: "SDKWORK Desktop",
      },
      {
        currentVersion: "0.9.0",
        dependencyId: "codex-cli",
        detailRoute: "/about/runtime/codex-cli",
        digestStatus: "outdated",
        environment: "windows",
        hasInstalledVersion: true,
        hasUpdateAvailable: true,
        isCurrent: false,
        latestVersion: "1.0.0",
        matchesEnvironment: false,
        status: "outdated",
        title: "Codex CLI",
        updateHref: "https://sdkwork.dev/runtime/codex/update",
      },
      {
        currentVersion: undefined,
        dependencyId: "gemini-cli",
        detailRoute: "/about/runtime/gemini-cli",
        digestStatus: "attention",
        environment: "wsl",
        hasInstalledVersion: false,
        hasUpdateAvailable: false,
        installHref: "https://sdkwork.dev/runtime/gemini/install",
        isCurrent: false,
        latestVersion: undefined,
        matchesEnvironment: false,
        status: "missing",
        title: "Gemini CLI",
      },
      {
        currentVersion: undefined,
        dependencyId: "mcp-bridge",
        digestStatus: "attention",
        environment: "desktop",
        hasInstalledVersion: false,
        hasUpdateAvailable: false,
        isCurrent: false,
        latestVersion: undefined,
        matchesEnvironment: true,
        status: "error",
        title: "MCP Bridge",
      },
    ]);

    expect(summarizeAboutRuntimeDependencyDigests(digests)).toEqual({
      attentionDependencies: 2,
      currentDependencies: 1,
      healthyDependencies: 1,
      installedDependencies: 2,
      missingDependencies: 1,
      outdatedDependencies: 1,
      totalDependencies: 4,
      updateAvailableDependencies: 1,
    });
  });

  it("evaluates runtime dependency readiness for detail, install, and update flows", () => {
    const codexDigest = createAboutRuntimeDependencyDigest(runtimeDependencies[1], {
      activeEnvironment: "desktop",
      detailRoute: "/about/runtime/codex-cli",
      updateHref: "https://sdkwork.dev/runtime/codex/update",
    });
    const geminiDigest = createAboutRuntimeDependencyDigest(runtimeDependencies[2], {
      activeEnvironment: "desktop",
      detailRoute: "/about/runtime/gemini-cli",
      installHref: "https://sdkwork.dev/runtime/gemini/install",
    });
    const bridgeDigest = createAboutRuntimeDependencyDigest(runtimeDependencies[3], {
      activeEnvironment: "desktop",
    });

    expect(
      evaluateAboutRuntimeDependencyReadiness(codexDigest, {
        action: "update",
      }),
    ).toEqual({
      capabilities: {
        canInstall: false,
        canOpenDetail: true,
        canUpdate: true,
      },
      checklist: {
        hasDetailRoute: true,
        hasInstallHref: false,
        hasInstalledVersion: true,
        hasUpdateAvailable: true,
        hasUpdateHref: true,
        matchesEnvironment: false,
        needsInstall: false,
        needsUpdate: true,
      },
      degraded: true,
      issues: ["environment-mismatch"],
      ready: true,
    });

    expect(
      evaluateAboutRuntimeDependencyReadiness(geminiDigest, {
        action: "install",
      }),
    ).toEqual({
      capabilities: {
        canInstall: true,
        canOpenDetail: true,
        canUpdate: false,
      },
      checklist: {
        hasDetailRoute: true,
        hasInstallHref: true,
        hasInstalledVersion: false,
        hasUpdateAvailable: false,
        hasUpdateHref: false,
        matchesEnvironment: false,
        needsInstall: true,
        needsUpdate: false,
      },
      degraded: true,
      issues: ["environment-mismatch"],
      ready: true,
    });

    expect(
      evaluateAboutRuntimeDependencyReadiness(bridgeDigest, {
        action: "open-detail",
      }),
    ).toEqual({
      capabilities: {
        canInstall: false,
        canOpenDetail: false,
        canUpdate: false,
      },
      checklist: {
        hasDetailRoute: false,
        hasInstallHref: false,
        hasInstalledVersion: false,
        hasUpdateAvailable: false,
        hasUpdateHref: false,
        matchesEnvironment: true,
        needsInstall: false,
        needsUpdate: false,
      },
      degraded: false,
      issues: ["detail-route-missing"],
      ready: false,
    });
  });
});
