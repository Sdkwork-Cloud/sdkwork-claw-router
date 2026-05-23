import { describe, expect, it } from "vitest";
import {
  buildPermissionGate,
  createPermissionDescriptorDigest,
  createPermissionCenterRouteIntent,
  createPermissionDetailRouteIntent,
  createPermissionWorkspaceManifest,
  evaluatePermissionActionReadiness,
  filterPermissionCatalog,
  resolvePermissionActionability,
  summarizePermissionDescriptorDigests,
  summarizePermissionCatalog,
} from "../src";

const permissions = [
  {
    category: "device",
    description: "Allow audio capture for calls and voice commands.",
    hosts: ["tauri"],
    id: "microphone",
    label: "Microphone",
    relatedIds: ["camera"],
    required: true,
    risk: "high",
    scope: "device",
    status: "granted",
  },
  {
    category: "device",
    description: "Allow video capture for calls and recording.",
    hosts: ["tauri"],
    id: "camera",
    label: "Camera",
    relatedIds: ["microphone"],
    required: true,
    risk: "high",
    scope: "device",
    status: "prompt",
  },
  {
    category: "system",
    description: "Allow system notifications for workflow updates.",
    hosts: ["browser", "tauri"],
    id: "notifications",
    label: "Notifications",
    recommended: true,
    relatedIds: [],
    required: false,
    risk: "low",
    scope: "application",
    status: "managed",
  },
  {
    category: "filesystem",
    description: "Allow writing generated files into managed workspaces.",
    hosts: ["tauri"],
    id: "filesystem-write",
    label: "Filesystem Write",
    relatedIds: ["filesystem-read"],
    required: true,
    risk: "high",
    scope: "workspace",
    status: "denied",
  },
  {
    category: "device",
    description: "Allow screen sharing and capture.",
    hosts: ["tauri"],
    id: "screen-capture",
    label: "Screen Capture",
    relatedIds: ["camera"],
    required: false,
    risk: "high",
    scope: "window",
    status: "restricted",
  },
  {
    category: "privacy",
    description: "Allow copying generated output into the system clipboard.",
    hosts: ["browser", "tauri"],
    id: "clipboard-write",
    label: "Clipboard Write",
    relatedIds: [],
    required: false,
    risk: "medium",
    scope: "session",
    status: "unsupported",
  },
] as const;

describe("sdkwork-permission-pc-react", () => {
  it("resolves permission actionability across granted, requestable, managed, blocked, and unsupported states", () => {
    expect(resolvePermissionActionability(permissions[0])).toBe("granted");
    expect(resolvePermissionActionability(permissions[1])).toBe("request");
    expect(resolvePermissionActionability(permissions[2])).toBe("managed");
    expect(resolvePermissionActionability(permissions[3])).toBe("blocked");
    expect(resolvePermissionActionability(permissions[5])).toBe("unsupported");
  });

  it("summarizes and filters the permission catalog", () => {
    expect(summarizePermissionCatalog(permissions)).toEqual({
      blockedRequiredIds: ["filesystem-write"],
      categoryCounts: {
        automation: 0,
        device: 3,
        filesystem: 1,
        privacy: 1,
        system: 1,
      },
      readyIds: ["microphone", "notifications"],
      requestableIds: ["camera"],
      statusCounts: {
        denied: 1,
        granted: 1,
        managed: 1,
        planned: 0,
        prompt: 1,
        restricted: 1,
        unsupported: 1,
      },
    });

    expect(
      filterPermissionCatalog(permissions, {
        category: ["filesystem"],
        query: "write",
        required: true,
        status: ["denied"],
      }).map((permission) => permission.id),
    ).toEqual(["filesystem-write"]);
  });

  it("builds permission gates for ready, limited, and blocked feature states", () => {
    expect(
      buildPermissionGate(permissions, {
        requiredPermissionIds: ["microphone"],
      }),
    ).toEqual({
      blockedIds: [],
      managedIds: [],
      missingIds: [],
      promptIds: [],
      readyIds: ["microphone"],
      status: "ready",
      unsupportedIds: [],
    });

    expect(
      buildPermissionGate(permissions, {
        requiredPermissionIds: ["microphone", "camera"],
      }),
    ).toEqual({
      blockedIds: [],
      managedIds: [],
      missingIds: [],
      promptIds: ["camera"],
      readyIds: ["microphone"],
      status: "limited",
      unsupportedIds: [],
    });

    expect(
      buildPermissionGate(permissions, {
        requiredPermissionIds: ["filesystem-write", "notifications", "unknown-permission"],
      }),
    ).toEqual({
      blockedIds: ["filesystem-write"],
      managedIds: ["notifications"],
      missingIds: ["unknown-permission"],
      promptIds: [],
      readyIds: [],
      status: "blocked",
      unsupportedIds: [],
    });
  });

  it("builds permission workspace manifests and route intents", () => {
    expect(
      createPermissionWorkspaceManifest({
        packageNames: ["@sdkwork/permission-pc-react", "@sdkwork/permission-pc-react"],
        title: "Permissions",
      }),
    ).toEqual({
      architecture: "pc-react",
      capability: "permission",
      description: "Permission workspace for capability catalogs, access gating, and system consent routing.",
      detailRoutePattern: "/permissions/:permissionId",
      host: "tauri",
      id: "sdkwork-permission",
      packageNames: ["@sdkwork/permission-pc-react"],
      routePath: "/permissions",
      theme: {
        color: "lobster",
        preset: "sdkwork",
        selection: "system",
      },
      title: "Permissions",
    });

    expect(
      createPermissionCenterRouteIntent({
        category: "device",
        required: true,
        status: "prompt",
      }),
    ).toEqual({
      category: "device",
      focusWindow: true,
      required: true,
      route: "/permissions?category=device&status=prompt&required=true",
      source: "permission-workspace",
      status: "prompt",
      type: "permission-center-route-intent",
    });

    expect(createPermissionDetailRouteIntent("camera")).toEqual({
      focusWindow: true,
      permissionId: "camera",
      route: "/permissions/camera",
      source: "permission-workspace",
      type: "permission-detail-route-intent",
    });
  });

  it("creates permission digests and summarizes setup-relevant permission state", () => {
    const digests = permissions.map((permission) =>
      createPermissionDescriptorDigest(permission, {
        activeCategory: "device",
        activeStatus: "prompt",
        currentPermissionId: "microphone",
        host: "tauri",
        requiredOnly: true,
        settingsRoute:
          permission.id === "screen-capture"
            ? "/system/privacy/screen-capture"
            : undefined,
      }),
    );

    expect(digests).toEqual([
      {
        actionability: "granted",
        category: "device",
        digestStatus: "current",
        isAvailable: true,
        isCompatibleHost: true,
        isCurrent: true,
        isRequired: true,
        label: "Microphone",
        matchesCategory: true,
        matchesRequiredFilter: true,
        matchesStatus: false,
        permissionId: "microphone",
        relatedCount: 1,
        risk: "high",
        route: "/permissions/microphone",
        status: "granted",
      },
      {
        actionability: "request",
        category: "device",
        digestStatus: "requestable",
        isAvailable: true,
        isCompatibleHost: true,
        isCurrent: false,
        isRequired: true,
        label: "Camera",
        matchesCategory: true,
        matchesRequiredFilter: true,
        matchesStatus: true,
        permissionId: "camera",
        relatedCount: 1,
        risk: "high",
        route: "/permissions/camera",
        status: "prompt",
      },
      {
        actionability: "managed",
        category: "system",
        digestStatus: "ready",
        isAvailable: true,
        isCompatibleHost: true,
        isCurrent: false,
        isRequired: false,
        label: "Notifications",
        matchesCategory: false,
        matchesRequiredFilter: false,
        matchesStatus: false,
        permissionId: "notifications",
        relatedCount: 0,
        risk: "low",
        route: "/permissions/notifications",
        status: "managed",
      },
      {
        actionability: "blocked",
        category: "filesystem",
        digestStatus: "attention",
        isAvailable: true,
        isCompatibleHost: true,
        isCurrent: false,
        isRequired: true,
        label: "Filesystem Write",
        matchesCategory: false,
        matchesRequiredFilter: true,
        matchesStatus: false,
        permissionId: "filesystem-write",
        relatedCount: 1,
        risk: "high",
        route: "/permissions/filesystem-write",
        status: "denied",
      },
      {
        actionability: "blocked",
        category: "device",
        digestStatus: "attention",
        isAvailable: true,
        isCompatibleHost: true,
        isCurrent: false,
        isRequired: false,
        label: "Screen Capture",
        matchesCategory: true,
        matchesRequiredFilter: false,
        matchesStatus: false,
        permissionId: "screen-capture",
        relatedCount: 1,
        risk: "high",
        route: "/permissions/screen-capture",
        settingsRoute: "/system/privacy/screen-capture",
        status: "restricted",
      },
      {
        actionability: "unsupported",
        category: "privacy",
        digestStatus: "restricted",
        isAvailable: false,
        isCompatibleHost: true,
        isCurrent: false,
        isRequired: false,
        label: "Clipboard Write",
        matchesCategory: false,
        matchesRequiredFilter: false,
        matchesStatus: false,
        permissionId: "clipboard-write",
        relatedCount: 0,
        risk: "medium",
        route: "/permissions/clipboard-write",
        status: "unsupported",
      },
    ]);

    expect(summarizePermissionDescriptorDigests(digests)).toEqual({
      attentionPermissions: 2,
      availablePermissions: 5,
      currentPermissions: 1,
      highRiskPermissions: 4,
      readyPermissions: 2,
      requestablePermissions: 1,
      requiredPermissions: 3,
      restrictedPermissions: 1,
      totalPermissions: 6,
    });
  });

  it("evaluates permission action readiness for request, detail, and system-settings flows", () => {
    const cameraDigest = createPermissionDescriptorDigest(permissions[1], {
      activeCategory: "device",
      activeStatus: "prompt",
      host: "tauri",
      requiredOnly: true,
    });
    const notificationsDigest = createPermissionDescriptorDigest(permissions[2], {
      activeCategory: "device",
      activeStatus: "prompt",
      host: "tauri",
      requiredOnly: true,
    });
    const screenCaptureDigest = createPermissionDescriptorDigest(permissions[4], {
      activeCategory: "device",
      activeStatus: "prompt",
      host: "tauri",
      requiredOnly: true,
      settingsRoute: "/system/privacy/screen-capture",
    });
    const clipboardDigest = createPermissionDescriptorDigest(permissions[5], {
      activeCategory: "device",
      activeStatus: "prompt",
      host: "tauri",
      requiredOnly: true,
    });

    expect(
      evaluatePermissionActionReadiness(cameraDigest, {
        action: "request",
      }),
    ).toEqual({
      capabilities: {
        canOpenDetail: true,
        canOpenSystemSettings: false,
        canRequest: true,
      },
      checklist: {
        hasRoute: true,
        hasSettingsRoute: false,
        isAvailable: true,
        isCompatibleHost: true,
        isRequestable: true,
        matchesCategory: true,
        matchesRequiredFilter: true,
        matchesStatus: true,
      },
      degraded: false,
      issues: [],
      ready: true,
    });

    expect(
      evaluatePermissionActionReadiness(notificationsDigest, {
        action: "open-detail",
      }),
    ).toEqual({
      capabilities: {
        canOpenDetail: true,
        canOpenSystemSettings: false,
        canRequest: false,
      },
      checklist: {
        hasRoute: true,
        hasSettingsRoute: false,
        isAvailable: true,
        isCompatibleHost: true,
        isRequestable: false,
        matchesCategory: false,
        matchesRequiredFilter: false,
        matchesStatus: false,
      },
      degraded: true,
      issues: ["category-mismatch", "required-filter-mismatch", "status-mismatch"],
      ready: true,
    });

    expect(
      evaluatePermissionActionReadiness(screenCaptureDigest, {
        action: "open-system-settings",
      }),
    ).toEqual({
      capabilities: {
        canOpenDetail: true,
        canOpenSystemSettings: true,
        canRequest: false,
      },
      checklist: {
        hasRoute: true,
        hasSettingsRoute: true,
        isAvailable: true,
        isCompatibleHost: true,
        isRequestable: false,
        matchesCategory: true,
        matchesRequiredFilter: false,
        matchesStatus: false,
      },
      degraded: true,
      issues: ["required-filter-mismatch", "status-mismatch"],
      ready: true,
    });

    expect(
      evaluatePermissionActionReadiness(clipboardDigest, {
        action: "request",
      }),
    ).toEqual({
      capabilities: {
        canOpenDetail: true,
        canOpenSystemSettings: false,
        canRequest: false,
      },
      checklist: {
        hasRoute: true,
        hasSettingsRoute: false,
        isAvailable: false,
        isCompatibleHost: true,
        isRequestable: false,
        matchesCategory: false,
        matchesRequiredFilter: false,
        matchesStatus: false,
      },
      degraded: true,
      issues: [
        "category-mismatch",
        "required-filter-mismatch",
        "status-mismatch",
        "unsupported-permission",
        "not-requestable",
      ],
      ready: false,
    });
  });
});
