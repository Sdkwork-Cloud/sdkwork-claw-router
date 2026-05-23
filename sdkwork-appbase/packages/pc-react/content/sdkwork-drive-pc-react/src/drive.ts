export type SdkworkDriveEntryKind = "file" | "folder";
export type SdkworkDriveSyncPosture = "attention" | "blocked" | "healthy";
export type SdkworkDriveStoragePosture = "balanced" | "heavy" | "restricted";

export interface SdkworkDriveEntry {
  id: string;
  kind: SdkworkDriveEntryKind;
  locationId: string;
  sizeLabel: string;
  syncPosture: SdkworkDriveSyncPosture;
  title: string;
  updatedAt: string;
}

export interface SdkworkDriveLocation {
  entryCount: number;
  id: string;
  storagePosture: SdkworkDriveStoragePosture;
  syncPosture: SdkworkDriveSyncPosture;
  title: string;
}

export interface SdkworkDriveRecentAction {
  action: string;
  id: string;
  timestamp: string;
}

export interface SdkworkDriveDigest {
  healthySyncs: number;
  sharedSpaces: number;
  totalEntries: number;
  totalLocations: number;
}

export interface SdkworkDriveWorkspaceData {
  digest: SdkworkDriveDigest;
  entries: SdkworkDriveEntry[];
  isAuthenticated: boolean;
  locations: SdkworkDriveLocation[];
  recentActions: SdkworkDriveRecentAction[];
}

export interface SdkworkDriveCapabilityManifest {
  description: string;
  host?: string;
  id: string;
  packageNames: string[];
  theme?: string;
  title: string;
}

export interface SdkworkDriveWorkspaceManifest extends SdkworkDriveCapabilityManifest {
  capability: "drive";
  routePath: string;
}

export interface CreateDriveWorkspaceManifestOptions
  extends Partial<
    Pick<SdkworkDriveCapabilityManifest, "description" | "host" | "id" | "packageNames" | "theme" | "title">
  > {
  routePath?: string;
}

export interface SdkworkDriveRouteIntent {
  entryId?: string;
  focusWindow: boolean;
  locationId?: string;
  route: string;
  source: "drive-workspace";
  type: "drive-route-intent";
}

export interface CreateDriveRouteIntentOptions {
  basePath?: string;
  entryId?: string;
  focusWindow?: boolean;
  locationId?: string;
}

export interface CreateEmptySdkworkDriveWorkspaceOptions {
  entries?: readonly SdkworkDriveEntry[];
  isAuthenticated?: boolean;
  locations?: readonly SdkworkDriveLocation[];
  recentActions?: readonly SdkworkDriveRecentAction[];
}

export const drivePackageMeta = {
  architecture: "pc-react",
  domain: "content",
  package: "@sdkwork/drive-pc-react",
  status: "ready",
} as const;

export type DrivePackageMeta = typeof drivePackageMeta;

function normalizeBasePath(basePath: string | undefined): string {
  const normalized = (basePath ?? "/drive").trim();
  if (!normalized || normalized === "/") {
    return "/drive";
  }

  return normalized.endsWith("/") ? normalized.slice(0, -1) : normalized;
}

function toTimestamp(value: string): number {
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function sortSdkworkDriveEntries(entries: readonly SdkworkDriveEntry[]): SdkworkDriveEntry[] {
  return [...entries].sort(
    (left, right) => toTimestamp(right.updatedAt) - toTimestamp(left.updatedAt) || left.title.localeCompare(right.title),
  );
}

export function createDefaultSdkworkDriveLocations(): SdkworkDriveLocation[] {
  return [
    { entryCount: 2, id: "shared-ops", storagePosture: "balanced", syncPosture: "attention", title: "Shared Ops" },
    { entryCount: 1, id: "design-vault", storagePosture: "heavy", syncPosture: "healthy", title: "Design Vault" },
    { entryCount: 1, id: "legal-archive", storagePosture: "restricted", syncPosture: "healthy", title: "Legal Archive" },
  ];
}

export function createDefaultSdkworkDriveEntries(): SdkworkDriveEntry[] {
  return [
    { id: "entry-ops-spec", kind: "file", locationId: "shared-ops", sizeLabel: "820 KB", syncPosture: "attention", title: "Ops Spec", updatedAt: "2026-04-03T04:00:00.000Z" },
    { id: "entry-release-checklist", kind: "file", locationId: "shared-ops", sizeLabel: "220 KB", syncPosture: "healthy", title: "Release Checklist", updatedAt: "2026-04-02T08:00:00.000Z" },
    { id: "entry-design-archive", kind: "folder", locationId: "design-vault", sizeLabel: "12 GB", syncPosture: "healthy", title: "Design Archive", updatedAt: "2026-04-01T07:00:00.000Z" },
    { id: "entry-nda-archive", kind: "folder", locationId: "legal-archive", sizeLabel: "4 GB", syncPosture: "blocked", title: "NDA Archive", updatedAt: "2026-03-31T06:00:00.000Z" },
  ];
}

export function createDefaultSdkworkDriveRecentActions(): SdkworkDriveRecentAction[] {
  return [
    { action: "Synced runbook bundle", id: "action-sync-runbook", timestamp: "2026-04-03T01:15:00.000Z" },
    { action: "Reviewed design vault share", id: "action-review-share", timestamp: "2026-04-02T22:10:00.000Z" },
  ];
}

export function summarizeSdkworkDriveWorkspace(
  entries: readonly SdkworkDriveEntry[],
  locations: readonly SdkworkDriveLocation[],
): SdkworkDriveDigest {
  return {
    healthySyncs: entries.filter((entry) => entry.syncPosture === "healthy").length,
    sharedSpaces: locations.filter((location) => location.id.includes("shared")).length,
    totalEntries: entries.length,
    totalLocations: locations.length,
  };
}

export function createDriveWorkspaceManifest({
  description = "Drive workspace for shared spaces, sync posture, and storage-aware entry browsing.",
  host,
  id = "sdkwork-drive",
  packageNames = [
    "@sdkwork/drive-pc-react",
    "@sdkwork/assets-pc-react",
  ],
  routePath = "/drive",
  theme,
  title = "Drive Workspace",
}: CreateDriveWorkspaceManifestOptions = {}): SdkworkDriveWorkspaceManifest {
  return {
    capability: "drive",
    description,
    ...(host ? { host } : {}),
    id,
    packageNames: [...packageNames],
    routePath: normalizeBasePath(routePath),
    ...(theme ? { theme } : {}),
    title,
  };
}

export function createDriveRouteIntent(
  options: CreateDriveRouteIntentOptions = {},
): SdkworkDriveRouteIntent {
  const basePath = normalizeBasePath(options.basePath);
  const params = new URLSearchParams();

  if (options.locationId) {
    params.set("locationId", options.locationId);
  }
  if (options.entryId) {
    params.set("entryId", options.entryId);
  }

  return {
    ...(options.entryId ? { entryId: options.entryId } : {}),
    focusWindow: options.focusWindow !== false,
    ...(options.locationId ? { locationId: options.locationId } : {}),
    route: params.toString() ? `${basePath}?${params.toString()}` : basePath,
    source: "drive-workspace",
    type: "drive-route-intent",
  };
}

export function createEmptySdkworkDriveWorkspace(
  options: CreateEmptySdkworkDriveWorkspaceOptions = {},
): SdkworkDriveWorkspaceData {
  const locations = options.locations?.length ? [...options.locations] : createDefaultSdkworkDriveLocations();
  const entries = sortSdkworkDriveEntries(options.entries?.length ? options.entries : createDefaultSdkworkDriveEntries());
  const recentActions = options.recentActions?.length ? [...options.recentActions] : createDefaultSdkworkDriveRecentActions();

  return {
    digest: summarizeSdkworkDriveWorkspace(entries, locations),
    entries,
    isAuthenticated: Boolean(options.isAuthenticated),
    locations,
    recentActions,
  };
}
