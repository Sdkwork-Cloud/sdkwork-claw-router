import {
  ensureSdkworkApiSuccess,
  isRecord,
  readRequiredApiItem,
  readRequiredApiItems,
  readRequiredString,
  readNumber,
  readString,
  type ApiRecord,
} from 'sdkwork-claw-router-commons/api-result';
import { createRequestToken } from 'sdkwork-claw-router-commons/request-id';
import { getClawRouterBackendSdkClient } from 'sdkwork-claw-router-commons/sdk-clients';
import type { StorageRecord } from './storageSectionDefinitions';

interface StorageProviderCreateInput {
  providerCode: string;
  providerType: string;
  region?: string;
  endpoint?: string;
  credentialRef: string;
  pathStyleEnabled?: boolean;
  multipart?: boolean;
  lifecycle?: boolean;
  objectLock?: boolean;
}

interface StorageBucketCreateInput {
  bucketName: string;
  providerId: string;
  logicalScope: string;
  bucketRegion?: string;
  dataResidencyRegion?: string;
  objectKeyPrefix?: string;
  storageClass?: string;
  encryption?: string;
  kmsKeyRef?: string;
  blockPublicAccess?: boolean;
  versioning?: boolean;
  objectLock?: boolean;
  lifecycle?: boolean;
}

interface StorageDefaultBucketCreateInput {
  logicalScope: string;
  bucketId: string;
  reason?: string;
}

interface StorageQuotaCreateInput {
  scopeType: string;
  scopeId: string;
  quotaLimit: string;
  enforcement?: string;
}

interface StorageReconciliationCreateInput {
  providerId: string;
  bucketId?: string;
  checkMode?: string;
  reason?: string;
}

interface StorageGarbageCollectionCreateInput {
  target: string;
  jobType?: string;
  retentionWindow?: string;
  dryRunSample?: string;
  dryRun?: boolean;
}

function resolveSdkOssClient() {
  return getClawRouterBackendSdkClient().oss;
}

function idempotencyParams() {
  return { idempotencyKey: createRequestToken('admin-storage-command') };
}

export async function fetchStorageProviders(): Promise<StorageRecord[]> {
  const client = resolveSdkOssClient();
  const result = await client.providers.list();
  ensureSdkworkApiSuccess(result, 'Failed to fetch storage providers');
  return readRequiredApiItems(result, 'Failed to fetch storage providers').map(normalizeProvider);
}

export async function createStorageProvider(input: StorageProviderCreateInput): Promise<StorageRecord> {
  const client = resolveSdkOssClient();
  const result = await client.providers.create(
    {
      providerCode: requiredText(input.providerCode, 'providerCode'),
      providerType: normalizeProviderType(input.providerType),
      credentialRef: requiredText(input.credentialRef, 'credentialRef'),
      endpointUrl: optionalText(input.endpoint),
      region: optionalText(input.region),
      pathStyleEnabled: input.pathStyleEnabled,
      supportsMultipart: input.multipart,
      supportsLifecycle: input.lifecycle,
      supportsObjectLock: input.objectLock,
    },
    idempotencyParams(),
  );
  ensureSdkworkApiSuccess(result, 'Failed to create storage provider');
  return normalizeProvider(readRequiredApiItem(result, 'Failed to create storage provider', ['provider']));
}

export async function deleteStorageProvider(providerId: string): Promise<boolean> {
  const client = resolveSdkOssClient();
  const result = await client.providers.update(
    requiredText(providerId, 'providerId'),
    { status: 'disabled', reason: 'Disabled from storage administration' },
  );
  ensureSdkworkApiSuccess(result, 'Failed to disable storage provider');
  return true;
}

export async function checkStorageProviderHealth(providerId: string): Promise<StorageRecord> {
  const client = resolveSdkOssClient();
  const result = await client.providers.healthChecks.create(requiredText(providerId, 'providerId'));
  ensureSdkworkApiSuccess(result, 'Failed to check storage provider health');
  return normalizeProviderHealth(readRequiredApiItem(result, 'Failed to check storage provider health'));
}

export async function fetchStorageBuckets(): Promise<StorageRecord[]> {
  const client = resolveSdkOssClient();
  const result = await client.buckets.list();
  ensureSdkworkApiSuccess(result, 'Failed to fetch buckets');
  return readRequiredApiItems(result, 'Failed to fetch buckets').map(normalizeBucket);
}

export async function createStorageBucket(input: StorageBucketCreateInput): Promise<StorageRecord> {
  const client = resolveSdkOssClient();
  const result = await client.buckets.create(
    {
      bucketName: requiredText(input.bucketName, 'bucketName'),
      providerId: requiredText(input.providerId, 'providerId'),
      logicalScope: normalizeLogicalScope(input.logicalScope),
      bucketRegion: optionalText(input.bucketRegion),
      dataResidencyRegion: optionalText(input.dataResidencyRegion),
      objectKeyPrefix: optionalText(input.objectKeyPrefix),
      defaultStorageClass: normalizeStorageClass(input.storageClass),
      defaultEncryptionMode: normalizeEncryptionMode(input.encryption),
      kmsKeyRef: optionalText(input.kmsKeyRef),
      publicAccessBlocked: input.blockPublicAccess,
      versioningEnabled: input.versioning,
      objectLockEnabled: input.objectLock,
      lifecycleEnabled: input.lifecycle,
    },
    idempotencyParams(),
  );
  ensureSdkworkApiSuccess(result, 'Failed to create bucket');
  return normalizeBucket(readRequiredApiItem(result, 'Failed to create bucket', ['bucket']));
}

export async function deleteStorageBucket(bucketId: string): Promise<boolean> {
  const client = resolveSdkOssClient();
  const result = await client.buckets.update(
    requiredText(bucketId, 'bucketId'),
    { status: 'archived', reason: 'Archived from storage administration' },
  );
  ensureSdkworkApiSuccess(result, 'Failed to archive bucket');
  return true;
}

export async function fetchStorageDefaultBuckets(): Promise<StorageRecord[]> {
  const client = resolveSdkOssClient();
  const result = await client.defaultBuckets.list();
  ensureSdkworkApiSuccess(result, 'Failed to fetch default buckets');
  return readRequiredApiItems(result, 'Failed to fetch default buckets').map(normalizeDefaultBucket);
}

export async function createStorageDefaultBucket(input: StorageDefaultBucketCreateInput): Promise<StorageRecord> {
  const client = resolveSdkOssClient();
  const logicalScope = normalizeLogicalScope(input.logicalScope);
  const result = await client.defaultBuckets.update(
    logicalScope,
    {
      bucketId: requiredText(input.bucketId, 'bucketId'),
      reason: requiredText(input.reason || 'Updated from storage administration', 'reason'),
    },
  );
  ensureSdkworkApiSuccess(result, 'Failed to create default bucket');
  return normalizeDefaultBucket(readRequiredApiItem(result, 'Failed to create default bucket', ['defaultBucket']));
}

export async function fetchStorageQuotas(): Promise<StorageRecord[]> {
  const client = resolveSdkOssClient();
  const result = await client.quotas.list();
  ensureSdkworkApiSuccess(result, 'Failed to fetch quotas');
  return readRequiredApiItems(result, 'Failed to fetch quotas').map(normalizeQuota);
}

export async function createStorageQuota(input: StorageQuotaCreateInput): Promise<StorageRecord> {
  const client = resolveSdkOssClient();
  const result = await client.quotas.create(
    {
      ...input,
      scopeType: normalizeQuotaScopeType(input.scopeType),
      scopeId: requiredText(input.scopeId, 'scopeId'),
      quotaLimit: requiredText(input.quotaLimit, 'quotaLimit'),
      quotaLimitBytes: parseRequiredBytes(input.quotaLimit, 'quotaLimit'),
    },
    idempotencyParams(),
  );
  ensureSdkworkApiSuccess(result, 'Failed to create quota');
  return normalizeQuota(readRequiredApiItem(result, 'Failed to create quota', ['quotaPolicy']));
}

export async function fetchStorageUsage(): Promise<StorageRecord[]> {
  const client = resolveSdkOssClient();
  const result = await client.usage.list();
  ensureSdkworkApiSuccess(result, 'Failed to fetch usage');
  return readRequiredApiItems(result, 'Failed to fetch usage').map(normalizeUsage);
}

export async function fetchStorageUsageLedgerRecords(): Promise<StorageRecord[]> {
  const client = resolveSdkOssClient();
  const result = await client.usage.ledger.list();
  ensureSdkworkApiSuccess(result, 'Failed to fetch usage ledger');
  return readRequiredApiItems(result, 'Failed to fetch usage ledger').map(normalizeUsageLedger);
}

export async function fetchStorageUsageSnapshotRecords(): Promise<StorageRecord[]> {
  const client = resolveSdkOssClient();
  const result = await client.usage.snapshots.list();
  ensureSdkworkApiSuccess(result, 'Failed to fetch usage snapshots');
  return readRequiredApiItems(result, 'Failed to fetch usage snapshots').map(normalizeUsageSnapshot);
}

export async function fetchStorageReconciliations(): Promise<StorageRecord[]> {
  const client = resolveSdkOssClient();
  const result = await client.reconciliationRuns.list();
  ensureSdkworkApiSuccess(result, 'Failed to fetch reconciliations');
  return readRequiredApiItems(result, 'Failed to fetch reconciliations').map(normalizeReconciliation);
}

export async function createStorageReconciliation(input: StorageReconciliationCreateInput): Promise<StorageRecord> {
  const client = resolveSdkOssClient();
  const result = await client.reconciliationRuns.create(
    {
      ...input,
      providerId: requiredText(input.providerId, 'providerId'),
      runType: input.checkMode || 'metadata',
      dryRun: true,
    },
    idempotencyParams(),
  );
  ensureSdkworkApiSuccess(result, 'Failed to create reconciliation');
  return normalizeReconciliation(readRequiredApiItem(result, 'Failed to create reconciliation', ['reconciliationRun']));
}

export async function fetchStorageGarbageCollections(): Promise<StorageRecord[]> {
  const client = resolveSdkOssClient();
  const result = await client.gcJobs.list();
  ensureSdkworkApiSuccess(result, 'Failed to fetch garbage collections');
  return readRequiredApiItems(result, 'Failed to fetch garbage collections').map(normalizeGarbageCollection);
}

export async function createStorageGarbageCollection(input: StorageGarbageCollectionCreateInput): Promise<StorageRecord> {
  const client = resolveSdkOssClient();
  const target = requiredText(input.target, 'target');
  const result = await client.gcJobs.create(
    {
      target,
      jobType: optionalText(input.jobType) || 'expired_uploads',
      retentionWindow: optionalText(input.retentionWindow),
      dryRunSample: optionalText(input.dryRunSample),
      dryRun: input.dryRun ?? true,
    },
    idempotencyParams(),
  );
  ensureSdkworkApiSuccess(result, 'Failed to create garbage collection');
  return normalizeGarbageCollection(readRequiredApiItem(result, 'Failed to create garbage collection', ['job']));
}

function requiredText(value: string, fieldName: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${fieldName} is required`);
  return normalized;
}

function optionalText(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized || undefined;
}

function parseRequiredBytes(value: string, fieldName: string): number {
  const normalized = requiredText(value, fieldName);
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`${fieldName} must be a non-negative byte count`);
  }
  return parsed;
}

function normalizeProviderType(value: string): 'aws_s3' | 'cloudflare_r2' | 'cos_s3' | 'local_dev_s3' | 'minio' | 'oss_s3' | 's3_compatible' {
  const normalized = requiredText(value, 'providerType');
  const allowed = ['aws_s3', 'cloudflare_r2', 'cos_s3', 'local_dev_s3', 'minio', 'oss_s3', 's3_compatible'] as const;
  if (!allowed.includes(normalized as typeof allowed[number])) {
    throw new Error(`providerType must be one of ${allowed.join(', ')}`);
  }
  return normalized as typeof allowed[number];
}

function normalizeLogicalScope(value: string): 'migration_import' | 'system_archive' | 'system_quarantine' | 'system_temp' | 'system_variant' | 'tenant_private' | 'tenant_public_asset' {
  const normalized = requiredText(value, 'logicalScope');
  const allowed = ['migration_import', 'system_archive', 'system_quarantine', 'system_temp', 'system_variant', 'tenant_private', 'tenant_public_asset'] as const;
  if (!allowed.includes(normalized as typeof allowed[number])) {
    throw new Error(`logicalScope must be one of ${allowed.join(', ')}`);
  }
  return normalized as typeof allowed[number];
}

function normalizeQuotaScopeType(value: string): 'app' | 'organization' | 'space' | 'tenant' | 'user' {
  const normalized = requiredText(value, 'scopeType');
  const allowed = ['app', 'organization', 'space', 'tenant', 'user'] as const;
  if (!allowed.includes(normalized as typeof allowed[number])) {
    throw new Error(`scopeType must be one of ${allowed.join(', ')}`);
  }
  return normalized as typeof allowed[number];
}

function normalizeStorageClass(value: string | undefined): 'STANDARD' | 'INTELLIGENT_TIERING' | 'STANDARD_IA' | 'ONEZONE_IA' | 'GLACIER_IR' | 'GLACIER' | 'DEEP_ARCHIVE' | undefined {
  if (!value) return undefined;
  const allowed = ['STANDARD', 'INTELLIGENT_TIERING', 'STANDARD_IA', 'ONEZONE_IA', 'GLACIER_IR', 'GLACIER', 'DEEP_ARCHIVE'] as const;
  return allowed.includes(value as typeof allowed[number]) ? value as typeof allowed[number] : undefined;
}

function normalizeEncryptionMode(value: string | undefined): 'none' | 'sse_kms' | 'sse_s3' | undefined {
  if (!value) return undefined;
  const allowed = ['none', 'sse_kms', 'sse_s3'] as const;
  return allowed.includes(value as typeof allowed[number]) ? value as typeof allowed[number] : undefined;
}

function normalizeProvider(value: unknown): StorageRecord {
  const item = isRecord(value) ? value as ApiRecord : {} as ApiRecord;
  return {
    id: readString(item, 'id') || readString(item, 'providerId'),
    providerId: readString(item, 'id') || readString(item, 'providerId'),
    providerCode: readRequiredString(item, 'providerCode', 'Provider code is required'),
    providerType: readRequiredString(item, 'providerType', 'Provider type is required'),
    region: readString(item, 'region') || '-',
    endpoint: readString(item, 'endpointUrl'),
    credentialRef: readString(item, 'credentialRef'),
    status: readString(item, 'status') || 'active',
    health: readString(item, 'health') || 'healthy',
  };
}

function normalizeProviderHealth(value: unknown): StorageRecord {
  const item = isRecord(value) ? value as ApiRecord : {} as ApiRecord;
  return {
    id: readString(item, 'providerId'),
    providerCode: readString(item, 'providerCode') || readString(item, 'providerId') || '-',
    providerType: readString(item, 'providerType') || '-',
    region: readString(item, 'region') || '-',
    status: readString(item, 'status') || 'unknown',
    health: readString(item, 'healthy') || readString(item, 'health') || 'unknown',
  };
}

function normalizeBucket(value: unknown): StorageRecord {
  const item = isRecord(value) ? value as ApiRecord : {} as ApiRecord;
  return {
    id: readString(item, 'id') || readString(item, 'bucketId'),
    bucketId: readString(item, 'id') || readString(item, 'bucketId'),
    bucketName: readRequiredString(item, 'bucketName', 'Bucket name is required'),
    logicalScope: readRequiredString(item, 'logicalScope', 'Logical scope is required'),
    providerId: readString(item, 'providerId'),
    providerCode: readString(item, 'providerCode') || '-',
    bucketRegion: readString(item, 'bucketRegion'),
    dataResidencyRegion: readString(item, 'dataResidencyRegion'),
    objectKeyPrefix: readString(item, 'objectKeyPrefix'),
    storageClass: readString(item, 'storageClass') || 'STANDARD',
    encryption: readString(item, 'encryption') || '-',
    kmsKeyRef: readString(item, 'kmsKeyRef'),
    versioningEnabled: readString(item, 'versioningEnabled'),
    objectLockEnabled: readString(item, 'objectLockEnabled'),
    lifecycleEnabled: readString(item, 'lifecycleEnabled'),
    publicAccessBlocked: readString(item, 'publicAccessBlocked'),
    status: readString(item, 'status') || 'active',
  };
}

function normalizeDefaultBucket(value: unknown): StorageRecord {
  const item = isRecord(value) ? value as ApiRecord : {} as ApiRecord;
  return {
    id: readString(item, 'id') || readString(item, 'logicalScope'),
    logicalScope: readRequiredString(item, 'logicalScope', 'Logical scope is required'),
    bucketId: readRequiredString(item, 'bucketId', 'Bucket ID is required'),
    bucketName: readRequiredString(item, 'bucketName', 'Bucket name is required'),
    providerId: readString(item, 'providerId'),
    providerCode: readString(item, 'providerCode') || '-',
    region: readString(item, 'region') || '-',
    updatedAt: readString(item, 'updatedAt') || '-',
  };
}

function normalizeQuota(value: unknown): StorageRecord {
  const item = isRecord(value) ? value as ApiRecord : {} as ApiRecord;
  const limit = readNonNegativeMetric(item, ['limit', 'quotaLimitBytes'], 'Quota limit is required');
  const used = readNonNegativeMetric(item, ['used', 'usedBytes'], 'Quota used is required');
  return {
    id: readString(item, 'id') || readString(item, 'policyId'),
    scopeType: readRequiredString(item, 'scopeType', 'Scope type is required'),
    scopeId: readRequiredString(item, 'scopeId', 'Scope ID is required'),
    limit: String(limit),
    used: String(used),
    status: readString(item, 'status') || 'active',
  };
}

function readNonNegativeMetric(item: ApiRecord, keys: string[], message: string): number {
  for (const key of keys) {
    const value = readNumber(item, key, Number.NaN);
    if (Number.isFinite(value) && value >= 0) {
      return value;
    }
  }
  throw new Error(message);
}

function normalizeUsage(value: unknown): StorageRecord {
  const item = isRecord(value) ? value as ApiRecord : {} as ApiRecord;
  return {
    id: readString(item, 'id'),
    scope: readString(item, 'scope') || `${readString(item, 'scopeType')}:${readString(item, 'scopeId')}`,
    used: readString(item, 'used') || readString(item, 'usedBytes') || '0',
    reserved: readString(item, 'reserved') || readString(item, 'reservedBytes') || '0',
    files: readString(item, 'files') || readString(item, 'fileCount') || '0',
    snapshotAt: readString(item, 'snapshotAt') || '-',
  };
}

function normalizeUsageLedger(value: unknown): StorageRecord {
  const item = isRecord(value) ? value as ApiRecord : {} as ApiRecord;
  return {
    id: readRequiredString(item, 'id', 'Ledger ID is required'),
    scope: `${readString(item, 'scopeType')}:${readString(item, 'scopeId')}`,
    eventType: readString(item, 'eventType') || '-',
    used: readString(item, 'deltaBytes') || '0',
    reserved: '-',
    files: readString(item, 'deltaFileCount') || '0',
    snapshotAt: readString(item, 'occurredAt') || '-',
  };
}

function normalizeUsageSnapshot(value: unknown): StorageRecord {
  const item = isRecord(value) ? value as ApiRecord : {} as ApiRecord;
  return {
    ...normalizeUsage(value),
    snapshotType: readString(item, 'snapshotType') || '-',
  };
}

function normalizeReconciliation(value: unknown): StorageRecord {
  const item = isRecord(value) ? value as ApiRecord : {} as ApiRecord;
  return {
    id: readString(item, 'id'),
    runId: readRequiredString(item, 'runId', 'Run ID is required'),
    providerId: readString(item, 'providerId'),
    providerCode: readRequiredString(item, 'providerCode', 'Provider code is required'),
    bucketId: readString(item, 'bucketId'),
    bucketName: readString(item, 'bucketName'),
    checkMode: readString(item, 'runType'),
    scope: readString(item, 'scope') || '-',
    issues: readString(item, 'issues') || readString(item, 'issueCount') || '0',
    status: readString(item, 'status') || 'pending',
  };
}

function normalizeGarbageCollection(value: unknown): StorageRecord {
  const item = isRecord(value) ? value as ApiRecord : {} as ApiRecord;
  return {
    id: readString(item, 'id'),
    jobId: readRequiredString(item, 'jobId', 'Job ID is required'),
    target: readString(item, 'target') || readString(item, 'jobType') || '-',
    candidateCount: String(readNonNegativeMetric(item, ['candidateCount'], 'Candidate count is required')),
    retention: readString(item, 'retention') || '-',
    status: readString(item, 'status') || 'pending',
  };
}
