import {
  createSdkworkAppCapabilityManifest,
  type CreateSdkworkAppCapabilityManifestOptions,
  type SdkworkAppCapabilityManifest,
} from "@sdkwork/appbase-pc-react";

export type SdkworkPermissionId =
  | "automation"
  | "camera"
  | "clipboard-read"
  | "clipboard-write"
  | "filesystem-read"
  | "filesystem-write"
  | "location"
  | "microphone"
  | "notifications"
  | "open-external"
  | "screen-capture"
  | (string & {});
export type SdkworkPermissionCategory =
  | "automation"
  | "device"
  | "filesystem"
  | "privacy"
  | "system";
export type SdkworkPermissionScope =
  | "application"
  | "device"
  | "session"
  | "window"
  | "workspace";
export type SdkworkPermissionRisk = "high" | "low" | "medium";
export type SdkworkPermissionHost = "browser" | "tauri";
export type SdkworkPermissionStatus =
  | "denied"
  | "granted"
  | "managed"
  | "planned"
  | "prompt"
  | "restricted"
  | "unsupported";
export type SdkworkPermissionActionability =
  | "blocked"
  | "granted"
  | "managed"
  | "request"
  | "unsupported";
export type SdkworkPermissionCatalogSortMode = "label" | "risk" | "status";
export type SdkworkPermissionGateStatus = "blocked" | "limited" | "ready";

export interface SdkworkPermissionDescriptor {
  category: SdkworkPermissionCategory;
  description: string;
  hosts: readonly SdkworkPermissionHost[];
  id: SdkworkPermissionId;
  label: string;
  recommended?: boolean;
  relatedIds: readonly string[];
  required: boolean;
  risk: SdkworkPermissionRisk;
  scope: SdkworkPermissionScope;
  status: SdkworkPermissionStatus;
}

export interface SdkworkPermissionCatalogSummary {
  blockedRequiredIds: string[];
  categoryCounts: Record<SdkworkPermissionCategory, number>;
  readyIds: string[];
  requestableIds: string[];
  statusCounts: Record<SdkworkPermissionStatus, number>;
}

export interface FilterPermissionCatalogOptions {
  category?: readonly SdkworkPermissionCategory[];
  query?: string;
  required?: boolean;
  sort?: SdkworkPermissionCatalogSortMode;
  status?: readonly SdkworkPermissionStatus[];
}

export interface BuildPermissionGateOptions {
  requiredPermissionIds?: readonly string[];
}

export interface SdkworkPermissionGateSummary {
  blockedIds: string[];
  managedIds: string[];
  missingIds: string[];
  promptIds: string[];
  readyIds: string[];
  status: SdkworkPermissionGateStatus;
  unsupportedIds: string[];
}

export type SdkworkPermissionDescriptorDigestStatus =
  | "attention"
  | "current"
  | "ready"
  | "requestable"
  | "restricted";

export interface CreatePermissionDescriptorDigestOptions {
  activeCategory?: SdkworkPermissionCategory;
  activeStatus?: SdkworkPermissionStatus;
  basePath?: string;
  currentPermissionId?: string;
  host?: SdkworkPermissionHost;
  requiredOnly?: boolean;
  route?: string | null;
  settingsRoute?: string | null;
}

export interface SdkworkPermissionDescriptorDigest {
  actionability: SdkworkPermissionActionability;
  category: SdkworkPermissionCategory;
  digestStatus: SdkworkPermissionDescriptorDigestStatus;
  isAvailable: boolean;
  isCompatibleHost: boolean;
  isCurrent: boolean;
  isRequired: boolean;
  label: string;
  matchesCategory: boolean;
  matchesRequiredFilter: boolean;
  matchesStatus: boolean;
  permissionId: string;
  relatedCount: number;
  risk: SdkworkPermissionRisk;
  route?: string;
  settingsRoute?: string;
  status: SdkworkPermissionStatus;
}

export interface SdkworkPermissionDescriptorDigestSummary {
  attentionPermissions: number;
  availablePermissions: number;
  currentPermissions: number;
  highRiskPermissions: number;
  readyPermissions: number;
  requestablePermissions: number;
  requiredPermissions: number;
  restrictedPermissions: number;
  totalPermissions: number;
}

export type SdkworkPermissionActionReadinessAction =
  | "open-detail"
  | "open-system-settings"
  | "request";

export type SdkworkPermissionActionReadinessIssue =
  | "already-ready"
  | "category-mismatch"
  | "host-unsupported"
  | "missing-route"
  | "not-requestable"
  | "required-filter-mismatch"
  | "settings-route-missing"
  | "status-mismatch"
  | "system-settings-not-needed"
  | "unsupported-permission";

export interface EvaluatePermissionActionReadinessOptions {
  action?: SdkworkPermissionActionReadinessAction;
}

export interface SdkworkPermissionActionChecklist {
  hasRoute: boolean;
  hasSettingsRoute: boolean;
  isAvailable: boolean;
  isCompatibleHost: boolean;
  isRequestable: boolean;
  matchesCategory: boolean;
  matchesRequiredFilter: boolean;
  matchesStatus: boolean;
}

export interface SdkworkPermissionActionCapabilities {
  canOpenDetail: boolean;
  canOpenSystemSettings: boolean;
  canRequest: boolean;
}

export interface SdkworkPermissionActionReadiness {
  capabilities: SdkworkPermissionActionCapabilities;
  checklist: SdkworkPermissionActionChecklist;
  degraded: boolean;
  issues: SdkworkPermissionActionReadinessIssue[];
  ready: boolean;
}

export interface SdkworkPermissionWorkspaceManifest extends SdkworkAppCapabilityManifest {
  capability: "permission";
  detailRoutePattern: string;
  routePath: string;
}

export interface CreatePermissionWorkspaceManifestOptions
  extends Partial<
    Pick<CreateSdkworkAppCapabilityManifestOptions, "description" | "host" | "id" | "packageNames" | "theme" | "title">
  > {
  routePath?: string;
}

export interface SdkworkPermissionCenterRouteIntent {
  category?: SdkworkPermissionCategory;
  focusWindow: boolean;
  required?: boolean;
  route: string;
  source: "permission-workspace";
  status?: SdkworkPermissionStatus;
  type: "permission-center-route-intent";
}

export interface CreatePermissionCenterRouteIntentOptions {
  basePath?: string;
  category?: SdkworkPermissionCategory;
  focusWindow?: boolean;
  required?: boolean;
  status?: SdkworkPermissionStatus;
}

export interface SdkworkPermissionDetailRouteIntent {
  focusWindow: boolean;
  permissionId: string;
  route: string;
  source: "permission-workspace";
  type: "permission-detail-route-intent";
}

export interface CreatePermissionDetailRouteIntentOptions {
  basePath?: string;
  focusWindow?: boolean;
}

const STATUS_ORDER: readonly SdkworkPermissionStatus[] = [
  "granted",
  "managed",
  "prompt",
  "denied",
  "restricted",
  "planned",
  "unsupported",
];
const RISK_ORDER: readonly SdkworkPermissionRisk[] = ["high", "medium", "low"];

function createCategoryCounts(): Record<SdkworkPermissionCategory, number> {
  return {
    automation: 0,
    device: 0,
    filesystem: 0,
    privacy: 0,
    system: 0,
  };
}

function createStatusCounts(): Record<SdkworkPermissionStatus, number> {
  return {
    denied: 0,
    granted: 0,
    managed: 0,
    planned: 0,
    prompt: 0,
    restricted: 0,
    unsupported: 0,
  };
}

function normalizeQuery(value: string | undefined): string {
  return value?.trim().toLowerCase() ?? "";
}

function compareStatus(
  left: SdkworkPermissionStatus,
  right: SdkworkPermissionStatus,
): number {
  return STATUS_ORDER.indexOf(left) - STATUS_ORDER.indexOf(right);
}

function compareRisk(left: SdkworkPermissionRisk, right: SdkworkPermissionRisk): number {
  return RISK_ORDER.indexOf(left) - RISK_ORDER.indexOf(right);
}

function permissionSearchValues(permission: SdkworkPermissionDescriptor): string[] {
  return [
    permission.id,
    permission.label,
    permission.description,
    permission.category,
    permission.scope,
    permission.risk,
    permission.status,
    ...permission.hosts,
    ...permission.relatedIds,
  ];
}

function toUniquePackages(packageNames: readonly string[]): string[] {
  return Array.from(new Set(packageNames.map((packageName) => packageName.trim()).filter(Boolean)));
}

function normalizeRoute(route: string | null | undefined): string | undefined {
  const normalizedRoute = route?.trim();
  return normalizedRoute ? normalizedRoute : undefined;
}

function resolvePermissionRoute(
  permissionId: string,
  options: Pick<CreatePermissionDescriptorDigestOptions, "basePath" | "route">,
): string | undefined {
  if (Object.prototype.hasOwnProperty.call(options, "route")) {
    return normalizeRoute(options.route);
  }

  return `${options.basePath ?? "/permissions"}/${permissionId}`;
}

function resolvePermissionSettingsRoute(
  options: Pick<CreatePermissionDescriptorDigestOptions, "settingsRoute">,
): string | undefined {
  return normalizeRoute(options.settingsRoute);
}

function isPermissionHostCompatible(
  permission: Pick<SdkworkPermissionDescriptor, "hosts">,
  host: SdkworkPermissionHost | undefined,
): boolean {
  if (!host) {
    return true;
  }

  return permission.hosts.length === 0 || permission.hosts.includes(host);
}

function isPermissionAvailable(
  permission: Pick<SdkworkPermissionDescriptor, "hosts" | "status">,
  host: SdkworkPermissionHost | undefined,
): boolean {
  return isPermissionHostCompatible(permission, host) && permission.status !== "unsupported";
}

function needsSystemSettings(permission: Pick<SdkworkPermissionDescriptorDigest, "status">): boolean {
  return permission.status === "denied" || permission.status === "restricted";
}

export function resolvePermissionActionability(
  permission: Pick<SdkworkPermissionDescriptor, "status">,
): SdkworkPermissionActionability {
  switch (permission.status) {
    case "granted":
      return "granted";
    case "managed":
      return "managed";
    case "prompt":
      return "request";
    case "unsupported":
      return "unsupported";
    default:
      return "blocked";
  }
}

export function summarizePermissionCatalog(
  permissions: readonly SdkworkPermissionDescriptor[],
): SdkworkPermissionCatalogSummary {
  const categoryCounts = createCategoryCounts();
  const statusCounts = createStatusCounts();
  const blockedRequiredIds: string[] = [];
  const readyIds: string[] = [];
  const requestableIds: string[] = [];

  for (const permission of permissions) {
    categoryCounts[permission.category] += 1;
    statusCounts[permission.status] += 1;

    const actionability = resolvePermissionActionability(permission);
    if (permission.required && actionability === "blocked") {
      blockedRequiredIds.push(permission.id);
    }

    if (actionability === "granted" || actionability === "managed") {
      readyIds.push(permission.id);
    }

    if (actionability === "request") {
      requestableIds.push(permission.id);
    }
  }

  blockedRequiredIds.sort((left, right) => left.localeCompare(right));
  readyIds.sort((left, right) => left.localeCompare(right));
  requestableIds.sort((left, right) => left.localeCompare(right));

  return {
    blockedRequiredIds,
    categoryCounts,
    readyIds,
    requestableIds,
    statusCounts,
  };
}

export function filterPermissionCatalog(
  permissions: readonly SdkworkPermissionDescriptor[],
  options: FilterPermissionCatalogOptions = {},
): SdkworkPermissionDescriptor[] {
  const category = options.category ? new Set(options.category) : null;
  const status = options.status ? new Set(options.status) : null;
  const query = normalizeQuery(options.query);

  return [...permissions]
    .filter((permission) => (category ? category.has(permission.category) : true))
    .filter((permission) => (status ? status.has(permission.status) : true))
    .filter((permission) =>
      options.required !== undefined ? permission.required === options.required : true,
    )
    .filter((permission) =>
      query
        ? permissionSearchValues(permission).some((value) => value.toLowerCase().includes(query))
        : true,
    )
    .sort((left, right) => {
      if (options.sort === "status") {
        const statusDifference = compareStatus(left.status, right.status);
        if (statusDifference !== 0) {
          return statusDifference;
        }
      }

      if (options.sort === "risk") {
        const riskDifference = compareRisk(left.risk, right.risk);
        if (riskDifference !== 0) {
          return riskDifference;
        }
      }

      return left.label.localeCompare(right.label);
    });
}

export function buildPermissionGate(
  permissions: readonly SdkworkPermissionDescriptor[],
  options: BuildPermissionGateOptions = {},
): SdkworkPermissionGateSummary {
  const permissionMap = new Map(permissions.map((permission) => [permission.id, permission] as const));
  const requiredPermissionIds = options.requiredPermissionIds
    ? [...options.requiredPermissionIds]
    : permissions.filter((permission) => permission.required).map((permission) => permission.id);
  const blockedIds: string[] = [];
  const managedIds: string[] = [];
  const missingIds: string[] = [];
  const promptIds: string[] = [];
  const readyIds: string[] = [];
  const unsupportedIds: string[] = [];

  for (const permissionId of requiredPermissionIds) {
    const permission = permissionMap.get(permissionId);
    if (!permission) {
      missingIds.push(permissionId);
      continue;
    }

    const actionability = resolvePermissionActionability(permission);
    switch (actionability) {
      case "granted":
        readyIds.push(permissionId);
        break;
      case "managed":
        managedIds.push(permissionId);
        break;
      case "request":
        promptIds.push(permissionId);
        break;
      case "unsupported":
        unsupportedIds.push(permissionId);
        break;
      default:
        blockedIds.push(permissionId);
        break;
    }
  }

  const status: SdkworkPermissionGateStatus =
    blockedIds.length > 0 || missingIds.length > 0 || unsupportedIds.length > 0
      ? "blocked"
      : promptIds.length > 0
        ? "limited"
        : "ready";

  return {
    blockedIds: blockedIds.sort((left, right) => left.localeCompare(right)),
    managedIds: managedIds.sort((left, right) => left.localeCompare(right)),
    missingIds: missingIds.sort((left, right) => left.localeCompare(right)),
    promptIds: promptIds.sort((left, right) => left.localeCompare(right)),
    readyIds: readyIds.sort((left, right) => left.localeCompare(right)),
    status,
    unsupportedIds: unsupportedIds.sort((left, right) => left.localeCompare(right)),
  };
}

export function createPermissionDescriptorDigest(
  permission: SdkworkPermissionDescriptor,
  options: CreatePermissionDescriptorDigestOptions = {},
): SdkworkPermissionDescriptorDigest {
  const actionability = resolvePermissionActionability(permission);
  const isCompatibleHost = isPermissionHostCompatible(permission, options.host);
  const isAvailable = isPermissionAvailable(permission, options.host);
  const isCurrent = options.currentPermissionId === permission.id;
  const matchesCategory = options.activeCategory ? options.activeCategory === permission.category : true;
  const matchesStatus = options.activeStatus ? options.activeStatus === permission.status : true;
  const matchesRequiredFilter = options.requiredOnly ? permission.required : true;
  const route = resolvePermissionRoute(permission.id, options);
  const settingsRoute = resolvePermissionSettingsRoute(options);

  let digestStatus: SdkworkPermissionDescriptorDigestStatus = "attention";
  if (!isAvailable) {
    digestStatus = "restricted";
  } else if (isCurrent) {
    digestStatus = "current";
  } else if (actionability === "granted" || actionability === "managed") {
    digestStatus = "ready";
  } else if (actionability === "request") {
    digestStatus = "requestable";
  }

  return {
    actionability,
    category: permission.category,
    digestStatus,
    isAvailable,
    isCompatibleHost,
    isCurrent,
    isRequired: permission.required,
    label: permission.label,
    matchesCategory,
    matchesRequiredFilter,
    matchesStatus,
    permissionId: permission.id,
    relatedCount: permission.relatedIds.length,
    risk: permission.risk,
    ...(route ? { route } : {}),
    ...(settingsRoute ? { settingsRoute } : {}),
    status: permission.status,
  };
}

export function summarizePermissionDescriptorDigests(
  digests: readonly SdkworkPermissionDescriptorDigest[],
): SdkworkPermissionDescriptorDigestSummary {
  return digests.reduce<SdkworkPermissionDescriptorDigestSummary>(
    (summary, digest) => {
      summary.totalPermissions += 1;

      if (digest.isAvailable) {
        summary.availablePermissions += 1;
      }

      if (digest.isCurrent) {
        summary.currentPermissions += 1;
      }

      if (digest.isRequired) {
        summary.requiredPermissions += 1;
      }

      if (digest.risk === "high") {
        summary.highRiskPermissions += 1;
      }

      if (digest.digestStatus === "restricted") {
        summary.restrictedPermissions += 1;
      }

      if (
        digest.isAvailable
        && (digest.actionability === "granted" || digest.actionability === "managed")
      ) {
        summary.readyPermissions += 1;
      }

      if (digest.isAvailable && digest.actionability === "request") {
        summary.requestablePermissions += 1;
      }

      if (digest.isAvailable && digest.actionability === "blocked") {
        summary.attentionPermissions += 1;
      }

      return summary;
    },
    {
      attentionPermissions: 0,
      availablePermissions: 0,
      currentPermissions: 0,
      highRiskPermissions: 0,
      readyPermissions: 0,
      requestablePermissions: 0,
      requiredPermissions: 0,
      restrictedPermissions: 0,
      totalPermissions: 0,
    },
  );
}

export function evaluatePermissionActionReadiness(
  digest: SdkworkPermissionDescriptorDigest,
  options: EvaluatePermissionActionReadinessOptions = {},
): SdkworkPermissionActionReadiness {
  const action = options.action ?? "open-detail";
  const isRequestable = digest.isAvailable && digest.actionability === "request";
  const capabilities: SdkworkPermissionActionCapabilities = {
    canOpenDetail: Boolean(digest.route),
    canOpenSystemSettings: digest.isAvailable && needsSystemSettings(digest) && Boolean(digest.settingsRoute),
    canRequest: isRequestable,
  };
  const checklist: SdkworkPermissionActionChecklist = {
    hasRoute: Boolean(digest.route),
    hasSettingsRoute: Boolean(digest.settingsRoute),
    isAvailable: digest.isAvailable,
    isCompatibleHost: digest.isCompatibleHost,
    isRequestable,
    matchesCategory: digest.matchesCategory,
    matchesRequiredFilter: digest.matchesRequiredFilter,
    matchesStatus: digest.matchesStatus,
  };

  const issues: SdkworkPermissionActionReadinessIssue[] = [];
  if (!digest.matchesCategory) {
    issues.push("category-mismatch");
  }

  if (!digest.matchesRequiredFilter) {
    issues.push("required-filter-mismatch");
  }

  if (!digest.matchesStatus) {
    issues.push("status-mismatch");
  }

  if (action === "open-detail" && !digest.route) {
    issues.push("missing-route");
  }

  if (action === "request") {
    if (!digest.isCompatibleHost) {
      issues.push("host-unsupported");
    }

    if (digest.status === "unsupported") {
      issues.push("unsupported-permission");
    }

    if (digest.actionability === "granted" || digest.actionability === "managed") {
      issues.push("already-ready");
    } else if (!isRequestable) {
      issues.push("not-requestable");
    }
  }

  if (action === "open-system-settings") {
    if (!digest.isCompatibleHost) {
      issues.push("host-unsupported");
    }

    if (digest.status === "unsupported") {
      issues.push("unsupported-permission");
    }

    if (!needsSystemSettings(digest)) {
      issues.push("system-settings-not-needed");
    }

    if (!digest.settingsRoute) {
      issues.push("settings-route-missing");
    }
  }

  const ready =
    action === "request"
      ? capabilities.canRequest
      : action === "open-system-settings"
        ? capabilities.canOpenSystemSettings
        : capabilities.canOpenDetail;

  return {
    capabilities,
    checklist,
    degraded:
      issues.includes("category-mismatch")
      || issues.includes("required-filter-mismatch")
      || issues.includes("status-mismatch"),
    issues,
    ready,
  };
}

export function createPermissionWorkspaceManifest({
  description = "Permission workspace for capability catalogs, access gating, and system consent routing.",
  host,
  id = "sdkwork-permission",
  packageNames = ["@sdkwork/permission-pc-react"],
  routePath = "/permissions",
  theme,
  title = "Permissions",
}: CreatePermissionWorkspaceManifestOptions = {}): SdkworkPermissionWorkspaceManifest {
  return {
    ...createSdkworkAppCapabilityManifest({
      description,
      host,
      id,
      packageNames: toUniquePackages(packageNames),
      theme,
      title,
    }),
    capability: "permission",
    detailRoutePattern: `${routePath}/:permissionId`,
    routePath,
  };
}

export function createPermissionCenterRouteIntent(
  options: CreatePermissionCenterRouteIntentOptions = {},
): SdkworkPermissionCenterRouteIntent {
  const queryParams = new URLSearchParams();

  if (options.category) {
    queryParams.set("category", options.category);
  }

  if (options.status) {
    queryParams.set("status", options.status);
  }

  if (options.required) {
    queryParams.set("required", "true");
  }

  const querySuffix = queryParams.toString() ? `?${queryParams.toString()}` : "";

  return {
    ...(options.category ? { category: options.category } : {}),
    focusWindow: options.focusWindow !== false,
    ...(options.required ? { required: true } : {}),
    route: `${options.basePath ?? "/permissions"}${querySuffix}`,
    source: "permission-workspace",
    ...(options.status ? { status: options.status } : {}),
    type: "permission-center-route-intent",
  };
}

export function createPermissionDetailRouteIntent(
  permissionId: string,
  options: CreatePermissionDetailRouteIntentOptions = {},
): SdkworkPermissionDetailRouteIntent {
  return {
    focusWindow: options.focusWindow !== false,
    permissionId,
    route: `${options.basePath ?? "/permissions"}/${permissionId}`,
    source: "permission-workspace",
    type: "permission-detail-route-intent",
  };
}

export const permissionPackageMeta = {
  architecture: "pc-react",
  domain: "system",
  package: "@sdkwork/permission-pc-react",
  status: "ready",
} as const;

export type PermissionPackageMeta = typeof permissionPackageMeta;
