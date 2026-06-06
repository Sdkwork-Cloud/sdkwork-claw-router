import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  ClipboardList,
  Database,
  Gauge,
  HardDrive,
  Route,
  Trash2,
} from 'lucide-react';

export type StorageAdminSectionId =
  | 'buckets'
  | 'defaultBuckets'
  | 'garbageCollection'
  | 'providers'
  | 'quotas'
  | 'reconciliation'
  | 'usage';

export const STORAGE_SECTION_IDS: readonly StorageAdminSectionId[] = [
  'providers',
  'buckets',
  'defaultBuckets',
  'quotas',
  'usage',
  'reconciliation',
  'garbageCollection',
] as const;

export type StorageRecord = Record<string, string>;

export type StorageColumn = {
  key: string;
  label: string;
  align?: 'right';
};

export type StorageSectionDefinition = {
  id: StorageAdminSectionId;
  title: string;
  description: string;
  icon: LucideIcon;
  accentClass: string;
  columns: StorageColumn[];
  emptyTitle: string;
  emptyDescription: string;
  actionTitle: string;
  actionDescription: string;
  buttonLabel: string;
};

export const STORAGE_SECTION_DEFINITIONS: Record<StorageAdminSectionId, StorageSectionDefinition> = {
  providers: {
    id: 'providers',
    title: 'Provider Registry',
    description: 'Object-store provider inventory, credentials references, capability flags, and health state.',
    icon: HardDrive,
    accentClass: 'text-cyan-500',
    columns: [
      { key: 'providerCode', label: 'Provider' },
      { key: 'providerType', label: 'Type' },
      { key: 'region', label: 'Region' },
      { key: 'status', label: 'Status' },
      { key: 'health', label: 'Health' },
    ],
    emptyTitle: 'No storage providers',
    emptyDescription: 'Provider records will appear here after object-store providers are registered.',
    actionTitle: 'Register provider',
    actionDescription: 'Bind an object store by code, type, endpoint, region, and credential reference.',
    buttonLabel: 'Add Provider',
  },
  buckets: {
    id: 'buckets',
    title: 'Bucket Topology',
    description: 'Logical bucket inventory, storage class defaults, encryption, object lock, and lifecycle posture.',
    icon: Database,
    accentClass: 'text-blue-500',
    columns: [
      { key: 'bucketName', label: 'Bucket' },
      { key: 'logicalScope', label: 'Scope' },
      { key: 'providerCode', label: 'Provider' },
      { key: 'storageClass', label: 'Class' },
      { key: 'encryption', label: 'Encryption' },
    ],
    emptyTitle: 'No buckets',
    emptyDescription: 'Bucket records will appear here after provider-backed storage administration is available.',
    actionTitle: 'Create bucket',
    actionDescription: 'Assign a provider, logical scope, storage class, encryption mode, and object-key prefix.',
    buttonLabel: 'Add Bucket',
  },
  defaultBuckets: {
    id: 'defaultBuckets',
    title: 'Default Bucket Routing',
    description: 'Default upload and object routing per logical scope, including data residency boundaries.',
    icon: Route,
    accentClass: 'text-emerald-500',
    columns: [
      { key: 'logicalScope', label: 'Scope' },
      { key: 'bucketName', label: 'Bucket' },
      { key: 'providerCode', label: 'Provider' },
      { key: 'region', label: 'Region' },
      { key: 'updatedAt', label: 'Updated' },
    ],
    emptyTitle: 'No default routes',
    emptyDescription: 'Default bucket policies will appear here after logical scope routes are configured.',
    actionTitle: 'Set default route',
    actionDescription: 'Route a logical file scope to a verified provider bucket with an auditable reason.',
    buttonLabel: 'Set Route',
  },
  quotas: {
    id: 'quotas',
    title: 'Quota Policies',
    description: 'Storage quota policy registry for organizations, users, drive spaces, and upload reservations.',
    icon: Gauge,
    accentClass: 'text-amber-500',
    columns: [
      { key: 'scopeType', label: 'Scope type' },
      { key: 'scopeId', label: 'Scope ID' },
      { key: 'limit', label: 'Limit', align: 'right' },
      { key: 'used', label: 'Used', align: 'right' },
      { key: 'status', label: 'Status' },
    ],
    emptyTitle: 'No quota policies',
    emptyDescription: 'Quota policies will appear here after organization, tenant, or user limits are configured.',
    actionTitle: 'Create quota',
    actionDescription: 'Define a quota boundary and enforcement mode without exposing object-store internals.',
    buttonLabel: 'Add Quota',
  },
  usage: {
    id: 'usage',
    title: 'Usage Signals',
    description: 'Usage counters, snapshots, ledger deltas, reservation pressure, and growth signals.',
    icon: BarChart3,
    accentClass: 'text-indigo-500',
    columns: [
      { key: 'scope', label: 'Scope' },
      { key: 'used', label: 'Used', align: 'right' },
      { key: 'reserved', label: 'Reserved', align: 'right' },
      { key: 'files', label: 'Files', align: 'right' },
      { key: 'snapshotAt', label: 'Snapshot' },
    ],
    emptyTitle: 'No usage snapshots',
    emptyDescription: 'Usage snapshots and quota counters will appear here after storage activity is recorded.',
    actionTitle: 'Refresh usage',
    actionDescription: 'Reload storage counters, ledger entries, and quota snapshots from the OSS management surface.',
    buttonLabel: 'Refresh',
  },
  reconciliation: {
    id: 'reconciliation',
    title: 'Reconciliation Runs',
    description: 'Provider-object reconciliation, drift detection, checksum verification, and repair workflow tracking.',
    icon: ClipboardList,
    accentClass: 'text-teal-500',
    columns: [
      { key: 'runId', label: 'Run' },
      { key: 'providerCode', label: 'Provider' },
      { key: 'scope', label: 'Scope' },
      { key: 'issues', label: 'Issues', align: 'right' },
      { key: 'status', label: 'Status' },
    ],
    emptyTitle: 'No reconciliation runs',
    emptyDescription: 'Reconciliation jobs will appear here after consistency checks are scheduled.',
    actionTitle: 'Start reconciliation',
    actionDescription: 'Run a scoped provider and bucket consistency check with an auditable reason.',
    buttonLabel: 'Start Run',
  },
  garbageCollection: {
    id: 'garbageCollection',
    title: 'Garbage Collection',
    description: 'Expired upload sessions, orphaned blobs, stale previews, tombstones, and retention cleanup jobs.',
    icon: Trash2,
    accentClass: 'text-red-500',
    columns: [
      { key: 'jobId', label: 'Job' },
      { key: 'target', label: 'Target' },
      { key: 'candidateCount', label: 'Candidates', align: 'right' },
      { key: 'retention', label: 'Retention' },
      { key: 'status', label: 'Status' },
    ],
    emptyTitle: 'No cleanup jobs',
    emptyDescription: 'Garbage-collection jobs will appear here after cleanup work is scheduled.',
    actionTitle: 'Schedule cleanup',
    actionDescription: 'Queue cleanup for expired sessions, orphaned objects, or stale derived files.',
    buttonLabel: 'Schedule',
  },
};

export function resolveStorageSectionId(sectionId: string | undefined): StorageAdminSectionId {
  return STORAGE_SECTION_IDS.includes(sectionId as StorageAdminSectionId)
    ? sectionId as StorageAdminSectionId
    : 'providers';
}
