import {
  createSdkworkAppCapabilityManifest,
  type CreateSdkworkAppCapabilityManifestOptions,
  type SdkworkAppCapabilityManifest,
} from "@sdkwork/appbase-pc-react";

export type SdkworkMemoryRecordKind = "fact" | "preference" | "profile" | "task";
export type SdkworkMemoryRecallScope = "agent" | "session" | "user" | "workspace";
export type SdkworkMemoryRecordStatus = "active" | "archived";
export type SdkworkMemorySortMode = "kind" | "latest" | "scope";
export type SdkworkMemoryRetentionMode = "forever" | "rolling";
export type SdkworkMemoryRetentionState = "expired" | "expiring-soon" | "retained";

export interface SdkworkMemoryRecord {
  content: string;
  createdAt: number;
  id: string;
  kind: SdkworkMemoryRecordKind;
  scope: SdkworkMemoryRecallScope;
  status: SdkworkMemoryRecordStatus;
  tags: readonly string[];
  updatedAt: number;
}

export interface SdkworkMemoryRetentionPolicy {
  expiringSoonDays?: number;
  mode: SdkworkMemoryRetentionMode;
  retentionDays?: number;
}

export interface SdkworkMemoryRecordSummary {
  activeCount: number;
  archivedCount: number;
  expiredCount: number;
  expiringSoonCount: number;
  kindCounts: Record<SdkworkMemoryRecordKind, number>;
  scopeCounts: Record<SdkworkMemoryRecallScope, number>;
}

export interface FilterMemoryRecordsOptions {
  query?: string;
  scopes?: readonly SdkworkMemoryRecallScope[];
  sort?: SdkworkMemorySortMode;
  status?: readonly SdkworkMemoryRecordStatus[];
  tags?: readonly string[];
}

export interface SdkworkMemoryWorkspaceManifest extends SdkworkAppCapabilityManifest {
  capability: "memory";
  detailRoutePattern: string;
  routePath: string;
}

export interface CreateMemoryWorkspaceManifestOptions
  extends Partial<
    Pick<CreateSdkworkAppCapabilityManifestOptions, "description" | "host" | "id" | "packageNames" | "theme" | "title">
  > {
  routePath?: string;
}

export interface SdkworkMemoryLibraryRouteIntent {
  focusWindow: boolean;
  route: string;
  scope?: SdkworkMemoryRecallScope;
  source: "memory-workspace";
  status?: SdkworkMemoryRecordStatus;
  type: "memory-library-route-intent";
}

export interface CreateMemoryLibraryRouteIntentOptions {
  basePath?: string;
  focusWindow?: boolean;
  scope?: SdkworkMemoryRecallScope;
  status?: SdkworkMemoryRecordStatus;
}

export interface SdkworkMemoryRecordDetailRouteIntent {
  focusWindow: boolean;
  recordId: string;
  route: string;
  source: "memory-workspace";
  type: "memory-record-detail-route-intent";
}

export interface CreateMemoryRecordDetailRouteIntentOptions {
  basePath?: string;
  focusWindow?: boolean;
}

function createKindCounts(): Record<SdkworkMemoryRecordKind, number> {
  return {
    fact: 0,
    preference: 0,
    profile: 0,
    task: 0,
  };
}

function createScopeCounts(): Record<SdkworkMemoryRecallScope, number> {
  return {
    agent: 0,
    session: 0,
    user: 0,
    workspace: 0,
  };
}

function normalizeQuery(value: string | undefined): string {
  return value?.trim().toLowerCase() ?? "";
}

function sortMemoryRecords(
  records: readonly SdkworkMemoryRecord[],
  mode: SdkworkMemorySortMode = "latest",
): SdkworkMemoryRecord[] {
  return [...records].sort((left, right) => {
    if (mode === "scope") {
      const scopeDifference = left.scope.localeCompare(right.scope);
      if (scopeDifference !== 0) {
        return scopeDifference;
      }
    }

    if (mode === "kind") {
      const kindDifference = left.kind.localeCompare(right.kind);
      if (kindDifference !== 0) {
        return kindDifference;
      }
    }

    const updatedDifference = right.updatedAt - left.updatedAt;
    if (updatedDifference !== 0) {
      return updatedDifference;
    }

    return left.id.localeCompare(right.id);
  });
}

function toUniquePackages(packageNames: readonly string[]): string[] {
  return Array.from(new Set(packageNames.map((packageName) => packageName.trim()).filter(Boolean)));
}

function memorySearchValues(record: SdkworkMemoryRecord): string[] {
  return [record.content, record.kind, record.scope, record.status, ...record.tags];
}

export function evaluateMemoryRetention(
  record: Pick<SdkworkMemoryRecord, "updatedAt">,
  policy: SdkworkMemoryRetentionPolicy,
  now = Date.now(),
): SdkworkMemoryRetentionState {
  if (policy.mode === "forever") {
    return "retained";
  }

  const retentionDays = Math.max(policy.retentionDays ?? 0, 0);
  const expiringSoonDays = Math.max(policy.expiringSoonDays ?? 0, 0);
  const ageMs = Math.max(now - record.updatedAt, 0);
  const ageDays = ageMs / (24 * 60 * 60 * 1000);

  if (retentionDays === 0 || ageDays >= retentionDays) {
    return "expired";
  }

  if (ageDays >= Math.max(retentionDays - expiringSoonDays, 0)) {
    return "expiring-soon";
  }

  return "retained";
}

export function summarizeMemoryRecords(
  records: readonly SdkworkMemoryRecord[],
  policy: SdkworkMemoryRetentionPolicy,
  now = Date.now(),
): SdkworkMemoryRecordSummary {
  const kindCounts = createKindCounts();
  const scopeCounts = createScopeCounts();
  let activeCount = 0;
  let archivedCount = 0;
  let expiredCount = 0;
  let expiringSoonCount = 0;

  for (const record of records) {
    kindCounts[record.kind] += 1;
    scopeCounts[record.scope] += 1;

    if (record.status === "active") {
      activeCount += 1;
    } else {
      archivedCount += 1;
    }

    const retention = evaluateMemoryRetention(record, policy, now);
    if (retention === "expired") {
      expiredCount += 1;
    } else if (retention === "expiring-soon") {
      expiringSoonCount += 1;
    }
  }

  return {
    activeCount,
    archivedCount,
    expiredCount,
    expiringSoonCount,
    kindCounts,
    scopeCounts,
  };
}

export function filterMemoryRecords(
  records: readonly SdkworkMemoryRecord[],
  options: FilterMemoryRecordsOptions = {},
): SdkworkMemoryRecord[] {
  const scopes = options.scopes ? new Set(options.scopes) : null;
  const status = options.status ? new Set(options.status) : null;
  const tags = options.tags ?? [];
  const query = normalizeQuery(options.query);

  return sortMemoryRecords(records, options.sort)
    .filter((record) => (scopes ? scopes.has(record.scope) : true))
    .filter((record) => (status ? status.has(record.status) : true))
    .filter((record) => (tags.length > 0 ? tags.every((tag) => record.tags.includes(tag)) : true))
    .filter((record) =>
      query ? memorySearchValues(record).some((value) => value.toLowerCase().includes(query)) : true,
    );
}

export function buildMemoryRecallBlock(
  records: readonly SdkworkMemoryRecord[],
): string {
  const activeRecords = filterMemoryRecords(records, {
    status: ["active"],
  });

  if (activeRecords.length === 0) {
    return "";
  }

  return [
    "Memory Recall:",
    ...activeRecords.map(
      (record, index) => `${index + 1}. [${record.scope}/${record.kind}] ${record.content}`,
    ),
  ].join("\n");
}

export function createMemoryWorkspaceManifest({
  description = "Memory workspace for recall scopes, retention summaries, and assistant-aware routing.",
  host,
  id = "sdkwork-memory",
  packageNames = ["@sdkwork/memory-pc-react"],
  routePath = "/memory",
  theme,
  title = "Memory",
}: CreateMemoryWorkspaceManifestOptions = {}): SdkworkMemoryWorkspaceManifest {
  return {
    ...createSdkworkAppCapabilityManifest({
      description,
      host,
      id,
      packageNames: toUniquePackages(packageNames),
      theme,
      title,
    }),
    capability: "memory",
    detailRoutePattern: `${routePath}/:recordId`,
    routePath,
  };
}

export function createMemoryLibraryRouteIntent(
  options: CreateMemoryLibraryRouteIntentOptions = {},
): SdkworkMemoryLibraryRouteIntent {
  const queryParams = new URLSearchParams();

  if (options.scope) {
    queryParams.set("scope", options.scope);
  }

  if (options.status) {
    queryParams.set("status", options.status);
  }

  const querySuffix = queryParams.toString() ? `?${queryParams.toString()}` : "";

  return {
    focusWindow: options.focusWindow !== false,
    route: `${options.basePath ?? "/memory"}${querySuffix}`,
    ...(options.scope ? { scope: options.scope } : {}),
    source: "memory-workspace",
    ...(options.status ? { status: options.status } : {}),
    type: "memory-library-route-intent",
  };
}

export function createMemoryRecordDetailRouteIntent(
  recordId: string,
  options: CreateMemoryRecordDetailRouteIntentOptions = {},
): SdkworkMemoryRecordDetailRouteIntent {
  return {
    focusWindow: options.focusWindow !== false,
    recordId,
    route: `${options.basePath ?? "/memory"}/${recordId}`,
    source: "memory-workspace",
    type: "memory-record-detail-route-intent",
  };
}

export const memoryPackageMeta = {
  architecture: "pc-react",
  domain: "intelligence",
  package: "@sdkwork/memory-pc-react",
  status: "ready",
} as const;

export type MemoryPackageMeta = typeof memoryPackageMeta;
