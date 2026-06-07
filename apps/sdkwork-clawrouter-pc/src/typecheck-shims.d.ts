declare module '@sdkwork/iam-service' {
  export interface IamStoredSession {
    accessToken?: string;
    authToken?: string;
    refreshToken?: string;
  }
}

declare module '@sdkwork/appbase-app-sdk' {
  export type SdkworkAppbaseSdkResponse = unknown;

  export interface SdkworkAppbaseListResource {
    list(params?: Record<string, unknown>): Promise<SdkworkAppbaseSdkResponse>;
  }

  export interface SdkworkAppbaseTreeResource {
    retrieve(): Promise<SdkworkAppbaseSdkResponse>;
  }

  export interface SdkworkAppbaseCurrentResource {
    delete(): Promise<SdkworkAppbaseSdkResponse>;
    retrieve(): Promise<SdkworkAppbaseSdkResponse>;
  }

  export interface SdkworkAppConfig {
    baseUrl?: string;
    platform?: string;
    timeout?: number;
    tokenManager?: unknown;
  }

  export class SdkworkAppClient {
    auth: {
      sessions: {
        create(input?: Record<string, unknown>): Promise<SdkworkAppbaseSdkResponse>;
        current: SdkworkAppbaseCurrentResource;
      };
    };
    http: unknown;
    iam: {
      departmentAssignments: SdkworkAppbaseListResource;
      departments: SdkworkAppbaseListResource & { tree: SdkworkAppbaseTreeResource };
      organizationMemberships: SdkworkAppbaseListResource;
      organizations: SdkworkAppbaseListResource & { tree: SdkworkAppbaseTreeResource };
      positionAssignments: SdkworkAppbaseListResource;
      positions: SdkworkAppbaseListResource;
      roleBindings: SdkworkAppbaseListResource;
      users: {
        current: SdkworkAppbaseTreeResource;
      };
    };
    system: {
      iam: {
        runtime: SdkworkAppbaseTreeResource;
        verificationPolicy: SdkworkAppbaseTreeResource;
      };
    };

    constructor(config?: SdkworkAppConfig);
  }
}

declare module '@sdkwork/appbase-backend-sdk' {
  export type SdkworkAppbaseBackendSdkResponse = unknown;

  export interface SdkworkAppbaseBackendListResource {
    list(params?: Record<string, unknown>): Promise<SdkworkAppbaseBackendSdkResponse>;
  }

  export interface SdkworkAppbaseBackendTreeResource {
    retrieve(): Promise<SdkworkAppbaseBackendSdkResponse>;
  }

  export interface SdkworkAppbaseBackendCrudResource extends SdkworkAppbaseBackendListResource {
    create(input?: Record<string, unknown>): Promise<SdkworkAppbaseBackendSdkResponse>;
    delete(id: string): Promise<SdkworkAppbaseBackendSdkResponse>;
    update(id: string, input?: Record<string, unknown>): Promise<SdkworkAppbaseBackendSdkResponse>;
  }

  export interface SdkworkAppbaseBackendApiKeysResource extends SdkworkAppbaseBackendListResource {
    revoke(id: string, input?: Record<string, unknown>): Promise<SdkworkAppbaseBackendSdkResponse>;
  }

  export interface SdkworkBackendConfig {
    baseUrl?: string;
    platform?: string;
    timeout?: number;
    tokenManager?: unknown;
  }

  export class SdkworkBackendClient {
    http: unknown;
    iam: {
      departmentAssignments: Omit<SdkworkAppbaseBackendCrudResource, 'delete'>;
      departments: SdkworkAppbaseBackendCrudResource & { tree: SdkworkAppbaseBackendTreeResource };
      organizationMemberships: Omit<SdkworkAppbaseBackendCrudResource, 'delete'>;
      organizations: SdkworkAppbaseBackendCrudResource & { tree: SdkworkAppbaseBackendTreeResource };
      permissions: SdkworkAppbaseBackendCrudResource;
      positionAssignments: Omit<SdkworkAppbaseBackendCrudResource, 'delete'>;
      positions: SdkworkAppbaseBackendCrudResource;
      roleBindings: SdkworkAppbaseBackendListResource & {
        create(input?: Record<string, unknown>): Promise<SdkworkAppbaseBackendSdkResponse>;
        delete(id: string): Promise<SdkworkAppbaseBackendSdkResponse>;
      };
      roles: SdkworkAppbaseBackendCrudResource & {
        permissions: {
          create(roleId: string, input?: Record<string, unknown>): Promise<SdkworkAppbaseBackendSdkResponse>;
          delete(roleId: string, permissionId: string): Promise<SdkworkAppbaseBackendSdkResponse>;
          list(roleId: string, params?: Record<string, unknown>): Promise<SdkworkAppbaseBackendSdkResponse>;
        };
      };
      apiKeys: SdkworkAppbaseBackendApiKeysResource;
      users: SdkworkAppbaseBackendCrudResource;
    };

    constructor(config?: SdkworkBackendConfig);
  }
}

declare module '@sdkwork/file-sdk-ports' {
  export type SdkworkStorageBucketLogicalScope =
    | 'migration_import'
    | 'system_archive'
    | 'system_quarantine'
    | 'system_temp'
    | 'system_variant'
    | 'tenant_private'
    | 'tenant_public_asset';

  export type SdkworkStorageBucketStorageClass =
    | 'STANDARD'
    | 'INTELLIGENT_TIERING'
    | 'STANDARD_IA'
    | 'ONEZONE_IA'
    | 'GLACIER_IR'
    | 'GLACIER'
    | 'DEEP_ARCHIVE';

  export type SdkworkStorageEncryptionMode = 'none' | 'sse_kms' | 'sse_s3';
  export type SdkworkStorageProviderType = 'aws_s3' | 'cloudflare_r2' | 'cos_s3' | 'local_dev_s3' | 'minio' | 'oss_s3' | 's3_compatible';
  export type SdkworkStorageResourceStatus = 'active' | 'archived' | 'disabled';
  export type SdkworkStorageUsageScopeType = 'app' | 'business_domain' | 'organization' | 'space' | 'tenant' | 'user';

  export interface AdminStorageDefaultBucket {
    bucketId: string;
    bucketName: string;
    dataResidencyRegion?: string;
    logicalScope: SdkworkStorageBucketLogicalScope;
    providerCode: string;
    providerId: string;
    providerType: SdkworkStorageProviderType;
    status: SdkworkStorageResourceStatus;
    updatedAt?: string;
  }

  export interface AdminStorageUsageQuery {
    cursor?: string;
    limit?: number;
    scopeId?: string;
    scopeType?: SdkworkStorageUsageScopeType;
  }

  export interface AdminStorageUsageLedgerQuery extends AdminStorageUsageQuery {
    occurredAfter?: string;
    occurredBefore?: string;
  }

  export interface AdminStorageUsageSnapshotQuery extends AdminStorageUsageQuery {
    periodEndAt?: string;
    periodStartAt?: string;
    snapshotType?: string;
  }

  export interface AdminStorageBucketQuery {
    cursor?: string;
    limit?: number;
    logicalScope?: SdkworkStorageBucketLogicalScope;
    providerId?: string;
    status?: string;
  }

  export interface AdminStorageDefaultBucketQuery {
    logicalScope?: SdkworkStorageBucketLogicalScope;
  }

  export interface AdminStorageProviderHealthCheckResult {
    checkedAt?: string;
    healthy: boolean;
    providerId: string;
    requestId: string;
    status: string;
  }

  export interface AdminStorageUpdateProviderInput {
    providerId: string;
    reason: string;
    status: SdkworkStorageResourceStatus;
  }

  export interface AdminStorageUpdateBucketInput {
    bucketId: string;
    reason: string;
    status: SdkworkStorageResourceStatus;
  }

  export interface AdminStorageCreateProviderInput {
    credentialRef: string;
    endpointUrl?: string;
    idempotencyKey: string;
    pathStyleEnabled?: boolean;
    providerCode: string;
    providerType: SdkworkStorageProviderType;
    region?: string;
    supportsLifecycle?: boolean;
    supportsMultipart?: boolean;
    supportsObjectLock?: boolean;
  }

  export interface AdminStorageCreateBucketInput {
    bucketName: string;
    bucketRegion?: string;
    dataResidencyRegion?: string;
    defaultEncryptionMode?: SdkworkStorageEncryptionMode;
    defaultStorageClass?: SdkworkStorageBucketStorageClass;
    idempotencyKey: string;
    kmsKeyRef?: string;
    lifecycleEnabled?: boolean;
    logicalScope: SdkworkStorageBucketLogicalScope;
    objectKeyPrefix?: string;
    objectLockEnabled?: boolean;
    providerId: string;
    publicAccessBlocked?: boolean;
    versioningEnabled?: boolean;
  }

  export interface AdminStorageCreateQuotaPolicyInput {
    idempotencyKey: string;
    quotaLimitBytes: number;
    scopeId: string;
    scopeType: Exclude<SdkworkStorageUsageScopeType, 'business_domain'>;
    singleFileLimitBytes?: number;
  }

  export interface AdminStorageReconciliationRunQuery {
    cursor?: string;
    limit?: number;
    runType?: string;
    status?: string;
  }

  export interface AdminStorageCreateReconciliationRunInput {
    bucketId?: string;
    dryRun: boolean;
    idempotencyKey: string;
    providerId?: string;
    runType: string;
  }

  export interface AdminStorageCreateGarbageCollectionJobInput {
    criteria?: Record<string, unknown>;
    dryRun: boolean;
    idempotencyKey: string;
    jobType: string;
  }

  export interface AdminStorageSetDefaultBucketInput {
    bucketId: string;
    logicalScope: SdkworkStorageBucketLogicalScope;
    reason: string;
  }

  export interface AdminStoragePort {
    createProvider(input: AdminStorageCreateProviderInput): Promise<{ provider: unknown; requestId: string }>;
    updateProvider(input: AdminStorageUpdateProviderInput): Promise<{ provider: unknown; requestId: string }>;
    createBucket(input: AdminStorageCreateBucketInput): Promise<{ bucket: unknown; requestId: string }>;
    updateBucket(input: AdminStorageUpdateBucketInput): Promise<{ bucket: unknown; requestId: string }>;
    createQuotaPolicy(input: AdminStorageCreateQuotaPolicyInput): Promise<{ quotaPolicy: unknown; requestId: string }>;
    createReconciliationRun(input: AdminStorageCreateReconciliationRunInput): Promise<{ reconciliationRun: unknown; requestId: string }>;
    createGarbageCollectionJob(input: AdminStorageCreateGarbageCollectionJobInput): Promise<{ job: unknown; requestId: string }>;
    healthCheckProvider(input: { providerId: string }): Promise<AdminStorageProviderHealthCheckResult>;
    listProviders(input?: Record<string, unknown>): Promise<{ items: unknown[]; requestId: string }>;
    listBuckets(input: AdminStorageBucketQuery): Promise<{ items: unknown[]; nextCursor?: string; requestId: string }>;
    listDefaultBuckets(input: AdminStorageDefaultBucketQuery): Promise<{ items: AdminStorageDefaultBucket[]; requestId: string }>;
    listQuotaPolicies(input?: Record<string, unknown>): Promise<{ items: unknown[]; requestId: string }>;
    listReconciliationRuns(input: AdminStorageReconciliationRunQuery): Promise<{ items: unknown[]; nextCursor?: string; requestId: string }>;
    listUsageCounters(input: AdminStorageUsageQuery): Promise<{ items: unknown[]; nextCursor?: string; requestId: string }>;
    listUsageLedger(input: AdminStorageUsageLedgerQuery): Promise<{ items: unknown[]; nextCursor?: string; requestId: string }>;
    listUsageSnapshots(input: AdminStorageUsageSnapshotQuery): Promise<{ items: unknown[]; nextCursor?: string; requestId: string }>;
    setDefaultBucket(input: AdminStorageSetDefaultBucketInput): Promise<{ defaultBucket: AdminStorageDefaultBucket; requestId: string }>;
  }
}

declare module '@sdkwork/file-service' {
  export interface FilePlatformService {
    abortUpload(input: unknown): Promise<unknown>;
    bindFile(input: unknown): Promise<unknown>;
    completeUpload(input: unknown): Promise<unknown>;
    deleteBinding(input: unknown): Promise<unknown>;
    getFile(input: unknown): Promise<unknown>;
    getStorageUsage(input: unknown): Promise<unknown>;
    getSlot(slotCode: string): unknown;
    issueDownloadUrl(input: unknown): Promise<unknown>;
    issuePreviewUrl(input: unknown): Promise<unknown>;
    listBindings(input: unknown): Promise<unknown>;
    listDriveNodes(input: { parentNodeId?: string; spaceId: string }): Promise<{ items: unknown[]; requestId?: string }>;
    listDriveSpaces(input?: Record<string, unknown>): Promise<{ items: unknown[]; requestId?: string }>;
    listFiles(input?: Record<string, unknown>): Promise<{ items: unknown[]; requestId?: string }>;
    uploadFile(input: unknown): Promise<unknown>;
  }
}

declare module '@sdkwork/drive-app-sdk' {
  export interface DriveSpace {
    displayName: string;
    id: string;
    lifecycleStatus: string;
    ownerSubjectId: string;
    ownerSubjectType: string;
    spaceType: 'ai_generated' | 'app' | 'app_upload' | 'knowledge_base' | 'personal' | 'team';
    tenantId: string;
    version: string;
  }

  export interface DriveNode {
    id: string;
    lifecycleStatus: 'active' | 'deleted' | 'trashed';
    nodeName: string;
    nodeType: 'file' | 'folder' | 'shortcut' | 'virtual_reference';
    parentNodeId?: string;
    spaceId: string;
    tenantId: string;
    version: string;
  }

  export interface SdkworkDriveAppClient {
    drive: {
      nodes: {
        list(spaceId: string, params: {
          pageSize?: string;
          pageToken?: string;
          parentNodeId?: string;
          tenantId: string;
        }): Promise<{ items: DriveNode[]; nextPageToken?: string }>;
      };
      spaces: {
        list(params: { tenantId: string }): Promise<{ items: DriveSpace[] }>;
      };
    };
    http: unknown;
    setTokenManager?(manager: unknown): unknown;
    uploader: {
      uploadByProfile(profile: string, request: Record<string, unknown>): Promise<unknown>;
    };
  }

  export interface SdkworkAppConfig {
    baseUrl?: string;
    platform?: string;
    timeout?: number;
    tokenManager?: unknown;
  }

  export function createDriveAppClient(config: SdkworkAppConfig): SdkworkDriveAppClient;
}

declare module '@sdkwork/file-sdk-adapter' {
  import type { FilePlatformService } from '@sdkwork/file-service';

  export function createFilePlatformServiceFromSdkClient(options: {
    app: unknown;
    drive?: unknown;
    slots?: readonly unknown[];
  }): FilePlatformService;
}

declare module '@sdkwork/file-platform-pc-react' {
  import type { ReactElement } from 'react';
  import type { AdminStoragePort } from '@sdkwork/file-sdk-ports';
  import type { FilePlatformService } from '@sdkwork/file-service';

  export interface StorageOperationsSettingsProps {
    onError?: (error: Error) => void;
    port: AdminStoragePort;
    title?: string;
  }

  export function StorageOperationsSettings(props: StorageOperationsSettingsProps): ReactElement;

  export interface DriveBrowserProps {
    onError?: (error: Error) => void;
    service: FilePlatformService;
    title?: string;
  }

  export function DriveBrowser(props: DriveBrowserProps): ReactElement;
}

declare module '@sdkwork/iam-runtime' {
  import type { IamStoredSession } from '@sdkwork/iam-service';

  export interface IamRuntimeConfig {
    appApiBaseUrl?: string;
    appId: string;
    backendApiBaseUrl?: string;
    deploymentMode: 'local' | 'private' | 'saas';
    environment: 'dev' | 'prod' | 'test';
  }

  export interface IamTokenStore {
    clear(): Promise<void> | void;
    get(): Promise<IamStoredSession> | IamStoredSession;
    set(session: IamStoredSession): Promise<void> | void;
  }

  export interface IamRuntime {
    config: IamRuntimeConfig;
    getAuthHeaders(): Promise<Record<string, string>>;
    hydrateTokenManager(): Promise<Record<string, string | undefined>>;
    service: unknown;
    tokenManager: unknown;
    tokenStore: IamTokenStore;
  }

  export interface CreateIamRuntimeInput {
    clients: {
      appbaseApp: unknown;
      appbaseBackend?: unknown;
      sdkClients?: readonly unknown[];
    };
    config: IamRuntimeConfig;
    contextStore?: unknown;
    localeProvider?: () => string | undefined;
    tokenManager?: unknown;
    tokenStore: IamTokenStore;
  }

  export function createIamRuntime(input: CreateIamRuntimeInput): IamRuntime;
}

declare module '@sdkwork/generation-pc-react' {
  export type SdkworkGenerationStatus = 'completed' | 'failed' | 'queued' | 'running';

  export interface SdkworkGenerationRun {
    id: string;
    latencyMs: number;
    model: string;
    promptPreview: string;
    status: SdkworkGenerationStatus;
    title: string;
    tokensUsed: number;
    updatedAt: string;
  }

  export interface SdkworkGenerationDigest {
    completedRuns: number;
    failedRuns: number;
    runningRuns: number;
    totalRuns: number;
    totalTokensUsed: number;
  }

  export interface SdkworkGenerationWorkspaceData {
    digest: SdkworkGenerationDigest;
    isAuthenticated: boolean;
    runs: SdkworkGenerationRun[];
  }

  export interface CreateSdkworkGenerationServiceOptions {
    getSessionTokens?: () => {
      authToken?: string;
    };
    includeSampleRuns?: boolean;
    listRuns?: () => Promise<readonly SdkworkGenerationRun[]>;
    runs?: readonly SdkworkGenerationRun[];
  }

  export interface SdkworkGenerationService {
    getEmptyWorkspace(): SdkworkGenerationWorkspaceData;
    getWorkspace(): Promise<SdkworkGenerationWorkspaceData>;
  }

  export function createSdkworkGenerationService(
    options?: CreateSdkworkGenerationServiceOptions,
  ): SdkworkGenerationService;
}

declare module 'sdkwork-commerce-pc-admin-product' {
  import type { ReactNode } from 'react';

  export type ProductStatusTone = 'success' | 'warning' | 'neutral' | 'danger';
  export type ProductPageWindowItem = number | 'ellipsis';
  export type ProductSubmitMode = 'draft' | 'active';

  export interface ProductPaginationState {
    page: number;
    pageSize: number;
    total: number;
  }

  export type ProductCollectionMeta = Record<string, unknown>;
  export type ProductRecord = Record<string, unknown>;
  export type CategoryRecord = Record<string, unknown>;
  export type CategoryTreeNode = Record<string, unknown>;
  export type CategoryColumnModel = Record<string, unknown>;
  export type SeedSummary = Record<string, unknown>;
  export type CommerceProductAdminService = Record<string, unknown>;
  export type ProductDraftState = Record<string, unknown>;
  export type ProductSpecGroup = Record<string, unknown>;
  export type ProductSkuDraft = Record<string, unknown>;

  export const CATEGORY_SEED_DATASETS: readonly string[];

  export function AttributeManagementPage(): ReactNode;
  export function CatalogAdmin(props?: { sectionId?: string }): ReactNode;
  export function CategoryManagementPage(): ReactNode;
  export function CommerceProductAdmin(props?: { sectionId?: string }): ReactNode;
  export function ProductCreatePage(props?: Record<string, unknown>): ReactNode;
  export function ProductListPage(): ReactNode;
  export function SkuManagementPage(): ReactNode;

  export function createCommerceProductAdminService(options?: Record<string, unknown>): CommerceProductAdminService;
  export function createCommerceProductAdminWorkspaceManifest(): unknown;

  export function createCommerceAttribute(body: Record<string, unknown>): Promise<unknown>;
  export function createCommerceCategory(body: Record<string, unknown>): Promise<unknown>;
  export function createCommerceCategoryAttribute(body: Record<string, unknown>): Promise<unknown>;
  export function createCommercePriceList(body: Record<string, unknown>): Promise<unknown>;
  export function createCommerceProduct(body: Record<string, unknown>): Promise<unknown>;
  export function createCommerceSku(body: Record<string, unknown>): Promise<unknown>;
  export function deleteCommerceCategory(categoryId: string): Promise<unknown>;
  export function deleteCommerceCategoryAttribute(bindingId: string): Promise<unknown>;
  export function deleteCommerceProduct(productId: string): Promise<unknown>;
  export function deleteCommerceSku(skuId: string): Promise<unknown>;
  export function initializeCommerceCategorySeeds(body: Record<string, unknown>): Promise<unknown>;
  export function listCommerceAttributes(params?: Record<string, unknown>): Promise<unknown>;
  export function listCommerceCategories(params?: Record<string, unknown>): Promise<unknown>;
  export function listCommerceCategoryAttributes(params?: Record<string, unknown>): Promise<unknown>;
  export function listCommercePriceLists(params?: Record<string, unknown>): Promise<unknown>;
  export function listCommerceProducts(params?: Record<string, unknown>): Promise<unknown>;
  export function listCommerceSkus(params?: Record<string, unknown>): Promise<unknown>;
  export function updateCommerceCategory(categoryId: string, body: Record<string, unknown>): Promise<unknown>;
  export function updateCommerceCategoryAttribute(bindingId: string, body: Record<string, unknown>): Promise<unknown>;
  export function updateCommerceProduct(productId: string, body: Record<string, unknown>): Promise<unknown>;
  export function updateCommerceSku(skuId: string, body: Record<string, unknown>): Promise<unknown>;

  export function calculateProductTotalPages(total: number, pageSize: number): number;
  export function clampProductPage(page: number, totalPages: number): number;
  export function formatProductDate(value: string): string;
  export function normalizeProductPagination(value: Partial<ProductPaginationState>): ProductPaginationState;
  export function productStatusLabel(status: string): string;
  export function productStatusTone(status: string): ProductStatusTone;
  export function productTypeLabel(productType: string): string;
  export function readProductCollectionMeta(value: unknown): ProductCollectionMeta | null;
  export function readProductCoverResource(record: ProductRecord): unknown;
  export function readProductRecords(value: unknown): ProductRecord[];
  export function readProductString(record: ProductRecord, keys: string[]): string;
  export function renderProductPageWindow(page: number, totalPages: number): ProductPageWindowItem[];

  export function buildProductCreatePayload(draft: ProductDraftState, mode: ProductSubmitMode): Record<string, unknown>;
  export function buildSkuCreatePayloads(
    draft: ProductDraftState,
    productId: string,
    mode: ProductSubmitMode,
    attributeIdByName: Map<string, string>,
  ): Record<string, unknown>[];
  export function buildSkuMutationPayloads(
    draft: ProductDraftState,
    productId: string,
    mode: ProductSubmitMode,
    attributeIdByName: Map<string, string>,
  ): Array<{ backendSkuId?: string; body: Record<string, unknown> }>;
  export function createDefaultProductDraft(): ProductDraftState;
  export function filterCategoryPathEntries(entries: unknown[]): unknown[];
  export function formatCategoryPath(entries: unknown[]): string;
  export function generateSkuDraftsFromSpecGroups(
    specGroups: ProductSpecGroup[],
    options: Record<string, unknown>,
  ): ProductSkuDraft[];
  export function normalizeProductCategoryTree(records: unknown[]): CategoryTreeNode[];
  export function normalizeSelectedCategoryIds(categoryIds: unknown[]): string[];
  export function normalizeSpecGroups(specGroups: ProductSpecGroup[]): ProductSpecGroup[];
  export function readSelectedCategoryPaths(draft: ProductDraftState, tree: CategoryTreeNode[]): unknown[];
  export function validateProductDraft(draft: ProductDraftState): string[];

  export function buildCategoryColumns(activePathIds: string[], tree: CategoryTreeNode[]): CategoryColumnModel[];
  export function buildCategoryParentColumns(activePathIds: string[], tree: CategoryTreeNode[]): CategoryColumnModel[];
  export function buildCategoryRows(records: CategoryRecord[]): CategoryRecord[];
  export function buildCategoryTree(records: CategoryRecord[]): CategoryTreeNode[];
  export function findCategoryPathIds(categoryId: string, tree: CategoryTreeNode[]): string[];
  export function generateCategoryNo(records: CategoryRecord[], now?: Date): string;
  export function loadAllCategoryRecords(): Promise<CategoryRecord[]>;
  export function readCategoryRecords(result: unknown): CategoryRecord[];
  export function readCategoryTotal(result: unknown): number | null;
  export function readSeedSummaries(result: unknown): SeedSummary[];
}

declare module '@sdkwork/generation-pc-react/generation-service' {
  export type SdkworkGenerationStatus = 'completed' | 'failed' | 'queued' | 'running';

  export interface SdkworkGenerationRun {
    id: string;
    latencyMs: number;
    model: string;
    promptPreview: string;
    status: SdkworkGenerationStatus;
    title: string;
    tokensUsed: number;
    updatedAt: string;
  }

  export interface SdkworkGenerationDigest {
    completedRuns: number;
    failedRuns: number;
    runningRuns: number;
    totalRuns: number;
    totalTokensUsed: number;
  }

  export interface SdkworkGenerationWorkspaceData {
    digest: SdkworkGenerationDigest;
    isAuthenticated: boolean;
    runs: SdkworkGenerationRun[];
  }

  export interface CreateSdkworkGenerationServiceOptions {
    getSessionTokens?: () => {
      authToken?: string;
    };
    includeSampleRuns?: boolean;
    listRuns?: () => Promise<readonly SdkworkGenerationRun[]>;
    runs?: readonly SdkworkGenerationRun[];
  }

  export interface SdkworkGenerationService {
    getEmptyWorkspace(): SdkworkGenerationWorkspaceData;
    getWorkspace(): Promise<SdkworkGenerationWorkspaceData>;
  }

  export function createSdkworkGenerationService(
    options?: CreateSdkworkGenerationServiceOptions,
  ): SdkworkGenerationService;
}

declare module '@sdkwork/generations-pc-workspace/generation-service' {
  export type SdkworkGenerationStatus = 'completed' | 'failed' | 'queued' | 'running';

  export interface SdkworkGenerationRun {
    id: string;
    latencyMs: number;
    model: string;
    promptPreview: string;
    status: SdkworkGenerationStatus;
    title: string;
    tokensUsed: number;
    updatedAt: string;
  }

  export interface SdkworkGenerationDigest {
    completedRuns: number;
    failedRuns: number;
    runningRuns: number;
    totalRuns: number;
    totalTokensUsed: number;
  }

  export interface SdkworkGenerationWorkspaceData {
    digest: SdkworkGenerationDigest;
    isAuthenticated: boolean;
    runs: SdkworkGenerationRun[];
  }

  export type SdkworkGenerationCommandModality = 'audio' | 'image' | 'music' | 'sfx' | 'video' | 'voice';
  export type SdkworkGenerationOperationType =
    | 'image_edit'
    | 'image_to_video'
    | 'lyrics_to_music'
    | 'speech'
    | 'sound_effect'
    | 'text_to_image'
    | 'text_to_music'
    | 'text_to_video'
    | 'transcription'
    | 'translation'
    | 'video_extend';

  export type SdkworkGenerationRemoteStatus =
    | 'canceled'
    | 'failed'
    | 'queued'
    | 'requires_action'
    | 'running'
    | 'succeeded';

  export interface SdkworkGenerationCommandInput {
    idempotencyKey?: string;
    inputAssetIds?: readonly string[];
    modality: SdkworkGenerationCommandModality;
    model?: string;
    operationType: SdkworkGenerationOperationType;
    organizationId?: string;
    parameters?: Record<string, unknown>;
    prompt: string;
    tenantId: string;
  }

  export interface SdkworkGenerationRecord {
    createdAt: string;
    favorite?: boolean;
    id: string;
    modality: string;
    operationType: string;
    organizationId?: string;
    promptPreview?: string;
    resultCount?: number;
    sourceProvider?: string;
    sourceJobId?: string;
    status: SdkworkGenerationRemoteStatus;
    tenantId?: string;
    updatedAt: string;
    userId?: string;
  }

  export interface SdkworkGenerationCommandResult {
    generation: SdkworkGenerationRun;
    record: SdkworkGenerationRecord;
  }

  export interface SdkworkGenerationResult {
    assetId?: string;
    createdAt: string;
    driveNodeId?: string;
    driveSpaceId?: string;
    driveUri?: string;
    generationId: string;
    id: string;
    previewText?: string;
    resourceSnapshot?: unknown;
    resultType: string;
  }

  export interface SdkworkGenerationResultPage {
    items?: readonly SdkworkGenerationResult[];
    nextCursor?: string;
  }

  export interface SdkworkGenerationSdkClients {
    generationsApp?: unknown;
    tokenManager?: unknown;
  }

  export interface CreateSdkworkGenerationServiceOptions {
    getSessionTokens?: () => {
      authToken?: string;
    };
    includeSampleRuns?: boolean;
    listRuns?: () => Promise<readonly SdkworkGenerationRun[]>;
    pageSize?: number;
    runs?: readonly SdkworkGenerationRun[];
    sdkClients?: SdkworkGenerationSdkClients;
  }

  export interface SdkworkGenerationService {
    createGenerationCommand(input: SdkworkGenerationCommandInput): Promise<SdkworkGenerationCommandResult>;
    getEmptyWorkspace(): SdkworkGenerationWorkspaceData;
    getWorkspace(): Promise<SdkworkGenerationWorkspaceData>;
    listGenerationResults(input: { cursor?: string; generationId: string; pageSize?: number }): Promise<SdkworkGenerationResultPage>;
  }

  export function createSdkworkGenerationService(
    options?: CreateSdkworkGenerationServiceOptions,
  ): SdkworkGenerationService;
}

declare module '@sdkwork/generations-pc-workspace' {
  export * from '@sdkwork/generations-pc-workspace/generation-asset-config';
  export * from '@sdkwork/generations-pc-workspace/generation-service';
  export * from '@sdkwork/generations-pc-workspace/generation-history';
}

declare module '@sdkwork/generations-pc-workspace/generation-asset-config' {
  export type SdkworkGenerationAssetModality = 'audio' | 'image' | 'music' | 'sfx' | 'video';
  export type SdkworkGenerationAssetAspectRatio = '1:1' | '16:9' | '9:16';
  export type SdkworkGenerationAssetQuality = 'high' | 'standard';
  export type SdkworkGenerationModelBucket = 'llms' | 'images' | 'videos' | 'audios' | 'music' | 'sfx';

  export interface SdkworkGenerationImageModeConfig {
    aspectRatio: 'auto' | '1:1' | '16:9' | '21:9' | '2:3' | '3:2' | '3:4' | '4:3' | '9:16';
    count: number;
    quality: '1k' | '2k';
  }

  export interface SdkworkGenerationVideoModeConfig {
    aspectRatio: SdkworkGenerationAssetAspectRatio;
    count: number;
    duration: number;
    resolution: '4k' | '720p' | '1080p';
    syncAudioVideo: boolean;
  }

  export interface SdkworkGenerationSpeechModeConfig {
    responseFormat?: 'aac' | 'flac' | 'mp3' | 'opus' | 'pcm' | 'wav';
    speed?: number;
    voice?: string;
  }

  export interface SdkworkGenerationSfxModeConfig {
    loop: boolean;
    promptInfluence: number;
    responseFormat?: 'mp3' | 'wav';
  }

  export interface SdkworkGenerationAssetConfig {
    aspectRatio: SdkworkGenerationAssetAspectRatio;
    durationSeconds: number;
    imageCount: number;
    imageMode?: SdkworkGenerationImageModeConfig;
    quality: SdkworkGenerationAssetQuality;
    sfxMode?: SdkworkGenerationSfxModeConfig;
    speechMode?: SdkworkGenerationSpeechModeConfig;
    videoMode?: SdkworkGenerationVideoModeConfig;
  }

  export interface SdkworkGenerationSerializedAssetConfig {
    aspectRatio?: SdkworkGenerationAssetAspectRatio;
    durationSeconds?: number;
    imageCount?: number;
    imageMode?: SdkworkGenerationImageModeConfig;
    loop?: boolean;
    promptInfluence?: number;
    quality?: SdkworkGenerationAssetQuality;
    responseFormat?: SdkworkGenerationSpeechModeConfig['responseFormat'] | SdkworkGenerationSfxModeConfig['responseFormat'];
    resolution?: SdkworkGenerationVideoModeConfig['resolution'];
    sfxMode?: SdkworkGenerationSfxModeConfig;
    speechMode?: SdkworkGenerationSpeechModeConfig;
    speed?: number;
    syncAudioVideo?: boolean;
    videoMode?: SdkworkGenerationVideoModeConfig;
    voice?: string;
  }

  export interface SdkworkGenerationReferencePrice {
    billingMeter?: string;
    currency: string;
    unitPrice: string;
    usageMeter?: string;
  }

  export interface SdkworkGenerationPriceAvailability {
    status: 'reference' | 'unavailable';
    reason?: string | null;
  }

  export interface SdkworkGenerationPricedModel {
    officialReferenceCurrency?: string | null;
    officialReferencePrices: readonly SdkworkGenerationReferencePrice[];
    officialReferenceUnitPrice?: string | null;
    priceAvailability: SdkworkGenerationPriceAvailability;
  }

  export type SdkworkGenerationModelBuckets<TModel> = {
    [Bucket in SdkworkGenerationModelBucket]: readonly TModel[];
  };

  export interface SdkworkGenerationCreditEstimate {
    detail: string;
    points: number | null;
    reference: boolean;
  }

  export interface EstimateSdkworkGenerationCreditsInput<TModel extends SdkworkGenerationPricedModel> {
    config: SdkworkGenerationAssetConfig;
    modality: SdkworkGenerationAssetModality;
    model: TModel | null | undefined;
    pointsPerUsd?: number;
    unavailableDetail?: string;
  }

  export const DEFAULT_SDKWORK_GENERATION_IMAGE_MODE_CONFIG: SdkworkGenerationImageModeConfig;
  export const DEFAULT_SDKWORK_GENERATION_SFX_MODE_CONFIG: SdkworkGenerationSfxModeConfig;
  export const DEFAULT_SDKWORK_GENERATION_SPEECH_MODE_CONFIG: SdkworkGenerationSpeechModeConfig;
  export const DEFAULT_SDKWORK_GENERATION_VIDEO_MODE_CONFIG: SdkworkGenerationVideoModeConfig;
  export function createDefaultSdkworkGenerationAssetConfig(
    modality: SdkworkGenerationAssetModality,
  ): SdkworkGenerationAssetConfig;
  export function createSdkworkGenerationAssetConfigFromSerialized(
    serialized: SdkworkGenerationSerializedAssetConfig | undefined,
    modality: SdkworkGenerationAssetModality,
  ): SdkworkGenerationAssetConfig;
  export function estimateSdkworkGenerationCredits<TModel extends SdkworkGenerationPricedModel>(
    input: EstimateSdkworkGenerationCreditsInput<TModel>,
  ): SdkworkGenerationCreditEstimate;
  export function findFirstSdkworkGenerationModelForModality<TModel>(
    groups: readonly SdkworkGenerationModelBuckets<TModel>[],
    modality: SdkworkGenerationAssetModality,
  ): TModel | null;
  export function findSdkworkGenerationModelById<TModel extends { id: string }>(
    groups: readonly SdkworkGenerationModelBuckets<TModel>[],
    modelId: string,
  ): TModel | null;
  export function getDefaultSdkworkGenerationDurationSeconds(
    modality: SdkworkGenerationAssetModality,
  ): number;
  export function getSdkworkGenerationDurationOptions(
    modality: SdkworkGenerationAssetModality,
  ): number[];
  export function getSdkworkGenerationModelBucket(
    modality: SdkworkGenerationAssetModality,
  ): Exclude<SdkworkGenerationModelBucket, 'llms'>;
  export function reconcileSdkworkGenerationAssetConfig(
    config: SdkworkGenerationAssetConfig,
    modality: SdkworkGenerationAssetModality,
  ): SdkworkGenerationAssetConfig;
  export function serializeSdkworkGenerationAssetConfig(
    config: SdkworkGenerationAssetConfig,
    modality: SdkworkGenerationAssetModality,
  ): SdkworkGenerationSerializedAssetConfig;
  export function updateSdkworkGenerationImageModeConfig(
    config: SdkworkGenerationAssetConfig,
    imageMode: SdkworkGenerationImageModeConfig,
  ): SdkworkGenerationAssetConfig;
  export function updateSdkworkGenerationSpeechModeConfig(
    config: SdkworkGenerationAssetConfig,
    speechMode: SdkworkGenerationSpeechModeConfig,
  ): SdkworkGenerationAssetConfig;
  export function updateSdkworkGenerationSfxModeConfig(
    config: SdkworkGenerationAssetConfig,
    sfxMode: SdkworkGenerationSfxModeConfig,
  ): SdkworkGenerationAssetConfig;
  export function updateSdkworkGenerationVideoModeConfig(
    config: SdkworkGenerationAssetConfig,
    videoMode: SdkworkGenerationVideoModeConfig,
  ): SdkworkGenerationAssetConfig;
}

declare module '@sdkwork/generations-pc-workspace/generation-history' {
  import type { SdkworkMediaResource } from '@sdkwork/appbase-pc-react';
  import type {
    SdkworkGenerationAssetModality,
    SdkworkGenerationSerializedAssetConfig,
  } from '@sdkwork/generations-pc-workspace/generation-asset-config';

  export type {
    SdkworkGenerationAssetModality,
    SdkworkGenerationSerializedAssetConfig,
  } from '@sdkwork/generations-pc-workspace/generation-asset-config';

  export type SdkworkGenerationHistoryType = 'text' | 'image' | 'images' | 'video' | 'music' | 'audio' | 'sfx';
  export type SdkworkGenerationPreviewKind = 'audio' | 'image' | 'text' | 'video';
  export type SdkworkGenerationMediaResource = SdkworkMediaResource;
  export type SdkworkGenerationMedia = SdkworkGenerationMediaResource;

  export interface SdkworkGenerationArtifact {
    asset: SdkworkGenerationMediaResource;
    modality: SdkworkGenerationAssetModality;
  }

  export interface SdkworkGenerationHistoryItem {
    activeIndex?: number;
    aspectRatio?: SdkworkGenerationSerializedAssetConfig['aspectRatio'];
    createdAt?: string;
    date: string;
    durationSeconds?: number;
    generationConfig?: SdkworkGenerationSerializedAssetConfig;
    id: string;
    asset?: SdkworkGenerationMediaResource;
    images?: SdkworkGenerationMediaResource[];
    modelCatalogKey?: string;
    modelInfo?: string;
    outputText?: string;
    prompt: string;
    status?: string;
    type: SdkworkGenerationHistoryType;
    updatedAt?: string;
    videos?: SdkworkGenerationMediaResource[];
  }

  export function appendSdkworkGenerationArtifactToHistoryItem<TItem extends SdkworkGenerationHistoryItem>(
    item: TItem,
    artifact: SdkworkGenerationArtifact,
    options?: { updatedAt?: string },
  ): TItem;
  export function createSdkworkGenerationPendingHistoryItem(input: {
    createdAt?: string;
    generationConfig?: SdkworkGenerationSerializedAssetConfig;
    id: string;
    prompt: string;
    selectedModel?: string;
    status?: string;
    targetType?: SdkworkGenerationAssetModality;
  }): SdkworkGenerationHistoryItem;
  export function getSdkworkGenerationPreviewKind(historyType: SdkworkGenerationHistoryType): SdkworkGenerationPreviewKind;
  export function isSdkworkGenerationImageHistoryType(historyType: SdkworkGenerationHistoryType): boolean;
  export function mapSdkworkGenerationArtifactsToHistoryMedia(
    artifacts: readonly SdkworkGenerationArtifact[],
    targetType?: SdkworkGenerationAssetModality,
  ): {
    asset?: SdkworkGenerationMediaResource;
    durationSeconds?: number;
    images: SdkworkGenerationMediaResource[];
    videos: SdkworkGenerationMediaResource[];
  };
  export function mapSdkworkGenerationHistoryTypeToModality(
    historyType: SdkworkGenerationHistoryType,
  ): SdkworkGenerationAssetModality | undefined;
  export function mapSdkworkGenerationModalityToHistoryType(
    modality: SdkworkGenerationAssetModality | undefined,
  ): SdkworkGenerationHistoryType;
  export function normalizeSdkworkGenerationHistoryType(value: unknown): SdkworkGenerationHistoryType;
  export function readSdkworkGenerationMediaThumb(media: SdkworkGenerationMedia | undefined): string | undefined;
  export function readSdkworkGenerationMediaUrl(media: SdkworkGenerationMedia | undefined): string | undefined;
  export function restoreSdkworkGenerationSerializedConfigFromHistoryItem(
    item: SdkworkGenerationHistoryItem,
  ): SdkworkGenerationSerializedAssetConfig | undefined;
}

declare module 'sdkwork-generations-app-sdk-generated-typescript' {
  export interface SdkworkAppConfig {
    baseUrl?: string;
    platform?: string;
    timeout?: number;
    tokenManager?: unknown;
  }

  export class SdkworkAppClient {
    generations: unknown;
    http: unknown;
    constructor(config: SdkworkAppConfig);
    setTokenManager(manager: unknown): this;
  }

  export function createClient(config: SdkworkAppConfig): SdkworkAppClient;
}

declare module '@sdkwork/generation-pc-react/generation-history' {
  import type { SdkworkMediaResource } from '@sdkwork/appbase-pc-react';

  export type SdkworkGenerationAssetModality = 'audio' | 'image' | 'music' | 'sfx' | 'video';
  export type SdkworkGenerationAssetAspectRatio = '1:1' | '16:9' | '9:16';
  export type SdkworkGenerationHistoryType = 'text' | 'image' | 'images' | 'video' | 'music' | 'audio' | 'sfx';
  export type SdkworkGenerationPreviewKind = 'audio' | 'image' | 'text' | 'video';
  export type SdkworkGenerationMediaResource = SdkworkMediaResource;
  export type SdkworkGenerationMedia = SdkworkGenerationMediaResource;

  export interface SdkworkGenerationSerializedAssetConfig {
    aspectRatio?: SdkworkGenerationAssetAspectRatio;
    durationSeconds?: number;
    imageCount?: number;
    imageMode?: unknown;
    loop?: boolean;
    promptInfluence?: number;
    quality?: 'high' | 'standard';
    responseFormat?: 'aac' | 'flac' | 'mp3' | 'opus' | 'pcm' | 'wav';
    resolution?: '4k' | '720p' | '1080p';
    sfxMode?: unknown;
    speechMode?: unknown;
    speed?: number;
    syncAudioVideo?: boolean;
    videoMode?: unknown;
    voice?: string;
  }

  export interface SdkworkGenerationArtifact {
    asset: SdkworkGenerationMediaResource;
    modality: SdkworkGenerationAssetModality;
  }

  export interface SdkworkGenerationHistoryItem {
    activeIndex?: number;
    aspectRatio?: SdkworkGenerationSerializedAssetConfig['aspectRatio'];
    createdAt?: string;
    date: string;
    durationSeconds?: number;
    generationConfig?: SdkworkGenerationSerializedAssetConfig;
    id: string;
    asset?: SdkworkGenerationMediaResource;
    images?: SdkworkGenerationMediaResource[];
    modelCatalogKey?: string;
    modelInfo?: string;
    outputText?: string;
    prompt: string;
    status?: string;
    type: SdkworkGenerationHistoryType;
    updatedAt?: string;
    videos?: SdkworkGenerationMediaResource[];
  }

  export function appendSdkworkGenerationArtifactToHistoryItem<TItem extends SdkworkGenerationHistoryItem>(
    item: TItem,
    artifact: SdkworkGenerationArtifact,
    options?: { updatedAt?: string },
  ): TItem;
  export function createSdkworkGenerationPendingHistoryItem(input: {
    createdAt?: string;
    generationConfig?: SdkworkGenerationSerializedAssetConfig;
    id: string;
    prompt: string;
    selectedModel?: string;
    status?: string;
    targetType?: SdkworkGenerationAssetModality;
  }): SdkworkGenerationHistoryItem;
  export function getSdkworkGenerationPreviewKind(historyType: SdkworkGenerationHistoryType): SdkworkGenerationPreviewKind;
  export function isSdkworkGenerationImageHistoryType(historyType: SdkworkGenerationHistoryType): boolean;
  export function mapSdkworkGenerationArtifactsToHistoryMedia(
    artifacts: readonly SdkworkGenerationArtifact[],
    targetType?: SdkworkGenerationAssetModality,
  ): {
    asset?: SdkworkGenerationMediaResource;
    durationSeconds?: number;
    images: SdkworkGenerationMediaResource[];
    videos: SdkworkGenerationMediaResource[];
  };
  export function mapSdkworkGenerationHistoryTypeToModality(
    historyType: SdkworkGenerationHistoryType,
  ): SdkworkGenerationAssetModality | undefined;
  export function mapSdkworkGenerationModalityToHistoryType(
    modality: SdkworkGenerationAssetModality | undefined,
  ): SdkworkGenerationHistoryType;
  export function normalizeSdkworkGenerationHistoryType(value: unknown): SdkworkGenerationHistoryType;
  export function readSdkworkGenerationMediaThumb(media: SdkworkGenerationMedia | undefined): string | undefined;
  export function readSdkworkGenerationMediaUrl(media: SdkworkGenerationMedia | undefined): string | undefined;
  export function restoreSdkworkGenerationSerializedConfigFromHistoryItem(
    item: SdkworkGenerationHistoryItem,
  ): SdkworkGenerationSerializedAssetConfig | undefined;
}

declare module '@sdkwork/generation-pc-react/react' {
  import type { ReactNode } from 'react';
  import type { SdkworkMediaResource } from '@sdkwork/appbase-pc-react';

  export type SdkworkGenerationAssetModality = 'audio' | 'image' | 'music' | 'sfx' | 'video';
  export type SdkworkGenerationAssetAspectRatio = '1:1' | '16:9' | '9:16';
  export type SdkworkGenerationAssetQuality = 'high' | 'standard';
  export type SdkworkGenerationModelBucket = 'llms' | 'images' | 'videos' | 'audios' | 'music' | 'sfx';
  export type SdkworkGenerationHistoryType = 'text' | 'image' | 'images' | 'video' | 'music' | 'audio' | 'sfx';
  export type SdkworkGenerationPreviewKind = 'audio' | 'image' | 'text' | 'video';
  export type SdkworkGenerationMediaResource = SdkworkMediaResource;
  export type SdkworkGenerationMedia = SdkworkGenerationMediaResource;

  export interface SdkworkGenerationImageModeConfig {
    aspectRatio: 'auto' | '1:1' | '16:9' | '21:9' | '2:3' | '3:2' | '3:4' | '4:3' | '9:16';
    count: number;
    quality: '1k' | '2k';
  }

  export interface SdkworkGenerationVideoModeConfig {
    aspectRatio: SdkworkGenerationAssetAspectRatio;
    count: number;
    duration: number;
    resolution: '4k' | '720p' | '1080p';
    syncAudioVideo: boolean;
  }

  export interface SdkworkGenerationSpeechModeConfig {
    responseFormat?: 'aac' | 'flac' | 'mp3' | 'opus' | 'pcm' | 'wav';
    speed?: number;
    voice?: string;
  }

  export interface SdkworkGenerationSfxModeConfig {
    loop: boolean;
    promptInfluence: number;
    responseFormat?: 'mp3' | 'wav';
  }

  export interface SdkworkGenerationAssetConfig {
    aspectRatio: SdkworkGenerationAssetAspectRatio;
    durationSeconds: number;
    imageCount: number;
    imageMode?: SdkworkGenerationImageModeConfig;
    quality: SdkworkGenerationAssetQuality;
    sfxMode?: SdkworkGenerationSfxModeConfig;
    speechMode?: SdkworkGenerationSpeechModeConfig;
    videoMode?: SdkworkGenerationVideoModeConfig;
  }

  export interface SdkworkGenerationSerializedAssetConfig {
    aspectRatio?: SdkworkGenerationAssetAspectRatio;
    durationSeconds?: number;
    imageCount?: number;
    imageMode?: SdkworkGenerationImageModeConfig;
    loop?: boolean;
    promptInfluence?: number;
    quality?: SdkworkGenerationAssetQuality;
    responseFormat?: SdkworkGenerationSpeechModeConfig['responseFormat'] | SdkworkGenerationSfxModeConfig['responseFormat'];
    resolution?: SdkworkGenerationVideoModeConfig['resolution'];
    sfxMode?: SdkworkGenerationSfxModeConfig;
    speechMode?: SdkworkGenerationSpeechModeConfig;
    speed?: number;
    syncAudioVideo?: boolean;
    videoMode?: SdkworkGenerationVideoModeConfig;
    voice?: string;
  }

  export interface SdkworkGenerationReferencePrice {
    regionCode: string;
    billingMeter: string;
    currency: string;
    unitPrice: string;
  }

  export interface SdkworkGenerationPriceAvailability {
    status: 'reference' | 'unavailable';
    reason?: string | null;
  }

  export interface SdkworkGenerationPricedModel {
    officialReferencePrices: readonly SdkworkGenerationReferencePrice[];
    priceAvailability: SdkworkGenerationPriceAvailability;
  }

  export interface SdkworkGenerationCreditEstimate {
    detail: string;
    points: number | null;
    reference: boolean;
  }

  export interface SdkworkGenerationArtifact {
    asset: SdkworkGenerationMediaResource;
    modality: SdkworkGenerationAssetModality;
  }

  export interface SdkworkGenerationHistoryItem {
    activeIndex?: number;
    aspectRatio?: SdkworkGenerationSerializedAssetConfig['aspectRatio'];
    createdAt?: string;
    date: string;
    durationSeconds?: number;
    generationConfig?: SdkworkGenerationSerializedAssetConfig;
    id: string;
    asset?: SdkworkGenerationMediaResource;
    images?: SdkworkGenerationMediaResource[];
    modelCatalogKey?: string;
    modelInfo?: string;
    outputText?: string;
    prompt: string;
    status?: string;
    type: SdkworkGenerationHistoryType;
    updatedAt?: string;
    videos?: SdkworkGenerationMediaResource[];
  }

  export interface SdkworkGenerationModeOption<TValue = string | number | boolean> {
    icon?: ReactNode;
    isVip?: boolean;
    label: string;
    value: TValue;
  }

  export interface SdkworkGenerationModeSection<TConfig extends object = Record<string, unknown>> {
    id: string;
    label: string;
    max?: number;
    min?: number;
    options?: readonly SdkworkGenerationModeOption[];
    step?: number;
    type: 'select' | 'slider' | 'switch';
    unit?: string;
    valueKey: keyof TConfig;
  }

  export const DEFAULT_SDKWORK_GENERATION_IMAGE_MODE_CONFIG: SdkworkGenerationImageModeConfig;
  export const DEFAULT_SDKWORK_GENERATION_SFX_MODE_CONFIG: SdkworkGenerationSfxModeConfig;
  export const DEFAULT_SDKWORK_GENERATION_SPEECH_MODE_CONFIG: SdkworkGenerationSpeechModeConfig;
  export const DEFAULT_SDKWORK_GENERATION_VIDEO_MODE_CONFIG: SdkworkGenerationVideoModeConfig;
  export function SdkworkGenerationModePopupBase(props: Record<string, unknown>): ReactNode;
  export function appendSdkworkGenerationArtifactToHistoryItem<TItem extends SdkworkGenerationHistoryItem>(
    item: TItem,
    artifact: SdkworkGenerationArtifact,
    options?: { updatedAt?: string },
  ): TItem;
  export function createDefaultSdkworkGenerationAssetConfig(
    modality: SdkworkGenerationAssetModality,
  ): SdkworkGenerationAssetConfig;
  export function createSdkworkGenerationPendingHistoryItem(input: {
    createdAt?: string;
    generationConfig?: SdkworkGenerationSerializedAssetConfig;
    id: string;
    prompt: string;
    selectedModel?: string;
    status?: string;
    targetType?: SdkworkGenerationAssetModality;
  }): SdkworkGenerationHistoryItem;
  export function estimateSdkworkGenerationCredits(input: Record<string, unknown>): SdkworkGenerationCreditEstimate;
  export type SdkworkGenerationModelBuckets<TModel> = {
    [Bucket in SdkworkGenerationModelBucket]: readonly TModel[];
  };

  export function findFirstSdkworkGenerationModelForModality<TModel>(
    groups: readonly SdkworkGenerationModelBuckets<TModel>[],
    modality: SdkworkGenerationAssetModality,
  ): TModel | null;
  export function findSdkworkGenerationModelById<TModel extends { id: string }>(
    groups: readonly SdkworkGenerationModelBuckets<TModel>[],
    modelId: string,
  ): TModel | null;
  export function getSdkworkGenerationDurationOptions(modality: SdkworkGenerationAssetModality): number[];
  export function getSdkworkGenerationModelBucket(modality: SdkworkGenerationAssetModality): SdkworkGenerationModelBucket;
  export function getSdkworkGenerationPreviewKind(historyType: SdkworkGenerationHistoryType): SdkworkGenerationPreviewKind;
  export function isSdkworkGenerationImageHistoryType(historyType: SdkworkGenerationHistoryType): boolean;
  export function mapSdkworkGenerationHistoryTypeToModality(
    historyType: SdkworkGenerationHistoryType,
  ): SdkworkGenerationAssetModality | undefined;
  export function readSdkworkGenerationMediaThumb(media: SdkworkGenerationMedia | undefined): string | undefined;
  export function readSdkworkGenerationMediaUrl(media: SdkworkGenerationMedia | undefined): string | undefined;
  export function reconcileSdkworkGenerationAssetConfig(
    config: SdkworkGenerationAssetConfig,
    modality: SdkworkGenerationAssetModality,
  ): SdkworkGenerationAssetConfig;
  export function restoreSdkworkGenerationSerializedConfigFromHistoryItem(
    item: SdkworkGenerationHistoryItem,
  ): SdkworkGenerationSerializedAssetConfig | undefined;
  export function serializeSdkworkGenerationAssetConfig(
    config: SdkworkGenerationAssetConfig,
    modality: SdkworkGenerationAssetModality,
  ): SdkworkGenerationSerializedAssetConfig;
  export function updateSdkworkGenerationImageModeConfig(
    config: SdkworkGenerationAssetConfig,
    updates: Partial<SdkworkGenerationImageModeConfig>,
  ): SdkworkGenerationAssetConfig;
  export function updateSdkworkGenerationSpeechModeConfig(
    config: SdkworkGenerationAssetConfig,
    updates: Partial<SdkworkGenerationSpeechModeConfig>,
  ): SdkworkGenerationAssetConfig;
  export function updateSdkworkGenerationSfxModeConfig(
    config: SdkworkGenerationAssetConfig,
    updates: Partial<SdkworkGenerationSfxModeConfig>,
  ): SdkworkGenerationAssetConfig;
  export function updateSdkworkGenerationVideoModeConfig(
    config: SdkworkGenerationAssetConfig,
    updates: Partial<SdkworkGenerationVideoModeConfig>,
  ): SdkworkGenerationAssetConfig;
}

declare module '@sdkwork/platform' {
  export type PlatformAccountStatus = 'active' | 'inactive';
  export type PlatformEntryStatus = 'active' | 'inactive';
  export type PlatformEntryType = 'mini_app_url' | 'qr' | 'url';
  export type PlatformPayMode = 'cashier' | 'direct' | 'escrow';
  export type PlatformPayScene = 'app' | 'h5' | 'mini_app' | 'official_account';
  export type PlatformProvider = 'alipay' | 'baidu' | 'douyin' | 'feishu' | 'kuaishou' | 'wechat';
}

declare module '@sdkwork/open-platform-admin-pc-react' {
  import type { ReactNode } from 'react';
  import type {
    PlatformAccountStatus,
    PlatformEntryStatus,
    PlatformEntryType,
    PlatformPayMode,
    PlatformPayScene,
    PlatformProvider,
  } from '@sdkwork/platform';

  export interface SdkworkOpenPlatformAdminBackendClient {
    openPlatform: {
      accounts: {
        create(input: SdkworkOpenPlatformAdminAccountInput): Promise<unknown>;
        delete(accountId: string): Promise<unknown>;
        entries: {
          create(accountId: string, input: SdkworkOpenPlatformAdminEntryInput): Promise<unknown>;
          delete(accountId: string, entryId: string): Promise<unknown>;
          list(accountId: string): Promise<unknown>;
          update(accountId: string, entryId: string, input: SdkworkOpenPlatformAdminEntryUpdateInput): Promise<unknown>;
        };
        list(params?: SdkworkOpenPlatformAdminAccountListParams): Promise<unknown>;
        payBindings: {
          create(accountId: string, input: SdkworkOpenPlatformAdminPayBindingInput): Promise<unknown>;
          delete(accountId: string, bindingId: string): Promise<unknown>;
          list(accountId: string): Promise<unknown>;
        };
        retrieve(accountId: string): Promise<unknown>;
        update(accountId: string, input: SdkworkOpenPlatformAdminAccountUpdateInput): Promise<unknown>;
      };
      manifests?: {
        list(params?: Record<string, unknown>): Promise<unknown>;
      };
      providers?: {
        list(params?: Record<string, unknown>): Promise<unknown>;
      };
    };
  }

  export type SdkworkOpenPlatformAdminAccountType = 'mini_app' | 'official_account';

  export interface SdkworkOpenPlatformAdminAccountInput {
    aesKeyRef?: string | null;
    appId?: string | null;
    key: string;
    name: string;
    provider: PlatformProvider;
    secretRef?: string | null;
    tokenRef?: string | null;
    type: SdkworkOpenPlatformAdminAccountType;
  }

  export interface SdkworkOpenPlatformAdminAccountUpdateInput {
    aesKeyRef?: string | null;
    appId?: string | null;
    defaultEntryId?: string | null;
    name?: string;
    qrDefault?: boolean;
    secretRef?: string | null;
    status?: PlatformAccountStatus;
    tokenRef?: string | null;
  }

  export interface SdkworkOpenPlatformAdminAccountListParams {
    provider?: PlatformProvider;
    status?: PlatformAccountStatus;
    type?: SdkworkOpenPlatformAdminAccountType;
  }

  export interface SdkworkOpenPlatformAdminEntryInput {
    key: string;
    type: PlatformEntryType;
    url: string;
  }

  export interface SdkworkOpenPlatformAdminEntryUpdateInput {
    key?: string;
    status?: PlatformEntryStatus;
    type?: PlatformEntryType;
    url?: string;
  }

  export interface SdkworkOpenPlatformAdminPayBindingInput {
    mode: PlatformPayMode;
    paymentAccountId: string;
    paymentChannelId?: string | null;
    scene: PlatformPayScene;
  }

  export interface SdkworkOpenPlatformAdminDashboard {
    accounts: unknown[];
    entriesByAccountId: Record<string, unknown[]>;
    payBindingsByAccountId: Record<string, unknown[]>;
    summary: Record<string, number>;
  }

  export interface SdkworkOpenPlatformAdminService {
    getDashboard(): Promise<SdkworkOpenPlatformAdminDashboard>;
    refreshDashboard(): Promise<SdkworkOpenPlatformAdminDashboard>;
  }

  export interface SdkworkOpenPlatformAdminController {
    bootstrap(): Promise<unknown>;
    getState(): unknown;
    refresh(): Promise<unknown>;
    service: SdkworkOpenPlatformAdminService;
    subscribe(listener: () => void): () => void;
  }

  export function createSdkworkOpenPlatformAdminController(options: {
    service: SdkworkOpenPlatformAdminService;
  }): SdkworkOpenPlatformAdminController;
  export function createSdkworkOpenPlatformAdminService(options: {
    backendClient: SdkworkOpenPlatformAdminBackendClient;
  }): SdkworkOpenPlatformAdminService;
  export function SdkworkOpenPlatformAdminPage(props: {
    controller: SdkworkOpenPlatformAdminController;
  }): ReactNode;
}

declare module '@sdkwork/appbase-pc-react' {
  export {};
}

declare module '@sdkwork/conversation' {
  export {};
}

declare module '@sdkwork/ui-pc-react' {
  export {};
}

declare module '@sdkwork/ui-pc-react/components/ui/button' {
  import type { ReactNode } from 'react';
  export function Button(props: Record<string, unknown>): ReactNode;
}

declare module '@sdkwork/ui-pc-react/components/ui/feedback/states' {
  import type { ReactNode } from 'react';
  export function EmptyState(props: Record<string, unknown>): ReactNode;
  export function ErrorState(props: Record<string, unknown>): ReactNode;
  export function LoadingState(props: Record<string, unknown>): ReactNode;
}

declare module '@sdkwork/ui-pc-react/theme' {
  export {};
}

declare module '@sdkwork/distribution-pc-react/downloads' {
  import type { ReactNode } from 'react';

  export type SdkworkDownloadTargetKind =
    | 'container'
    | 'desktop'
    | 'documentation'
    | 'mobile'
    | 'package'
    | 'server';

  export type SdkworkDownloadPlatform =
    | 'android'
    | 'docker'
    | 'generic'
    | 'helm'
    | 'ios'
    | 'linux'
    | 'macos'
    | 'windows';

  export type SdkworkDownloadCardIcon =
    | 'desktop'
    | 'download'
    | 'mobile'
    | 'server'
    | 'terminal';

  export type SdkworkDownloadCardTone =
    | 'brand'
    | 'mobile'
    | 'neutral'
    | 'server';

  export type SdkworkDownloadPrimaryActionStrategy = 'detected-platform' | 'first-available';
  export type SdkworkDownloadSectionVariant = 'compact' | 'hero' | 'section';

  export interface SdkworkDownloadSource {
    ariaLabel?: string;
    disabled?: boolean;
    external?: boolean;
    href: string;
    id: string;
    label: string;
    primary?: boolean;
    unavailableLabel?: string;
  }

  export interface SdkworkDownloadAction {
    ariaLabel?: string;
    architecture?: string;
    ctaLabel?: string;
    disabled?: boolean;
    external?: boolean;
    fileName?: string;
    href: string;
    id: string;
    kind?: SdkworkDownloadTargetKind;
    label: string;
    platform?: SdkworkDownloadPlatform;
    releaseTag?: string;
    sha256?: string;
    sizeBytes?: number;
    sources?: readonly SdkworkDownloadSource[];
    unavailableLabel?: string;
    version?: string;
  }

  export interface SdkworkDownloadCard {
    actions: readonly SdkworkDownloadAction[];
    badge?: string;
    description: string;
    icon?: SdkworkDownloadCardIcon;
    id: string;
    kind: SdkworkDownloadTargetKind;
    primaryActionId?: string;
    primaryActionStrategy?: SdkworkDownloadPrimaryActionStrategy;
    title: string;
    tone?: SdkworkDownloadCardTone;
  }

  export interface SdkworkDownloadCatalogProduct {
    channel?: string;
    id: string;
    name: string;
    releaseTag?: string;
    releaseUrl?: string;
    version: string;
  }

  export interface SdkworkDownloadCatalog {
    cards: readonly SdkworkDownloadCard[];
    generatedAt: string;
    product: SdkworkDownloadCatalogProduct;
    schemaVersion: string;
  }

  export interface SdkworkProductDownloadSectionProps {
    cards?: readonly SdkworkDownloadCard[];
    className?: string;
    catalog?: SdkworkDownloadCatalog;
    detectedPlatform?: SdkworkDownloadPlatform;
    onDownloadSelect?: (
      action: SdkworkDownloadAction,
      card: SdkworkDownloadCard,
      source?: SdkworkDownloadSource,
    ) => void;
    subtitle?: string;
    title?: string;
    variant?: SdkworkDownloadSectionVariant;
  }

  export function SdkworkProductDownloadSection(
    props: SdkworkProductDownloadSectionProps,
  ): ReactNode;
}

declare module '@sdkwork/distribution-pc-react' {
  export * from '@sdkwork/distribution-pc-react/downloads';
}

declare module '@sdkwork/auth-pc-react' {
  import type { CSSProperties, ReactNode } from 'react';

  export type SdkworkAuthLoginMethod = 'emailCode' | 'password' | 'phoneCode' | 'sessionBridge';
  export type SdkworkAuthRegisterMethod = 'email' | 'phone';
  export type SdkworkAuthRecoveryMethod = 'email' | 'phone';
  export type SdkworkAuthLeftRailMode = 'auto' | 'highlights-only' | 'qr-only';
  export type SdkworkAuthOAuthProviderRegion = 'mainland' | 'overseas';
  export type SdkworkAuthQrLoginType = 'sdkwork_app' | 'wechat_mini_program' | 'wechat_official_account';

  export interface SdkworkAuthDevelopmentPrefillConfig {
    account?: string;
    email?: string;
    enabled?: boolean;
    loginMethod?: SdkworkAuthLoginMethod;
    password?: string;
    phone?: string;
    verificationCode?: string;
    verificationCodeBypassEnabled?: boolean;
  }

  export interface SdkworkAuthVerificationPolicyConfig {
    emailCodeLoginEnabled?: boolean;
    emailRegistrationVerificationRequired?: boolean;
    phoneCodeLoginEnabled?: boolean;
    phoneRegistrationVerificationRequired?: boolean;
  }

  export interface SdkworkAuthRuntimeConfig {
    developmentPrefill?: SdkworkAuthDevelopmentPrefillConfig;
    leftRailMode?: SdkworkAuthLeftRailMode;
    loginMethods?: SdkworkAuthLoginMethod[];
    oauthLoginEnabled?: boolean;
    oauthProviderRegion?: SdkworkAuthOAuthProviderRegion;
    oauthProviders?: string[];
    qrLoginEnabled?: boolean;
    qrLoginType?: SdkworkAuthQrLoginType;
    recoveryMethods?: SdkworkAuthRecoveryMethod[];
    registerMethods?: SdkworkAuthRegisterMethod[];
    verificationPolicy?: SdkworkAuthVerificationPolicyConfig;
  }

  export interface SdkworkIamRuntimeAuthRuntimeLike {
    service: unknown;
    tokenStore?: unknown;
  }

  export interface CreateSdkworkIamRuntimeAuthControllerOptions {
    getRuntime: () => Promise<SdkworkIamRuntimeAuthRuntimeLike> | SdkworkIamRuntimeAuthRuntimeLike;
    methodUnavailableMessage?: string;
  }

  export interface SdkworkIamAuthRoutesProps {
    basePath?: string;
    children?: ReactNode;
    className?: string;
    getRuntime: () => Promise<SdkworkIamRuntimeAuthRuntimeLike> | SdkworkIamRuntimeAuthRuntimeLike;
    homePath?: string;
    locale?: string | null;
    methodUnavailableMessage?: string;
    runtimeConfig?: SdkworkAuthRuntimeConfig;
    style?: CSSProperties;
  }

  export function createSdkworkIamRuntimeAuthController(
    options: CreateSdkworkIamRuntimeAuthControllerOptions,
  ): unknown;

  export function SdkworkIamAuthRoutes(props: SdkworkIamAuthRoutesProps): JSX.Element;
}

declare module '@sdkwork/host-tauri-pc-react' {
  export type SdkworkTauriUnlisten = () => void | Promise<void>;

  export interface SdkworkTauriEvent<TPayload = unknown> {
    event: string;
    payload: TPayload;
  }

  export interface SdkworkTauriWindowTransport {
    close?: () => Promise<void>;
    hide?: () => Promise<void>;
    isMaximized?: () => Promise<boolean>;
    maximize?: () => Promise<void>;
    minimize?: () => Promise<void>;
    show?: () => Promise<void>;
    unmaximize?: () => Promise<void>;
  }

  export interface SdkworkTauriTransport {
    available?: boolean | (() => boolean);
    invoke: (command: string, payload?: unknown) => Promise<unknown>;
    listen: <TPayload>(
      event: string,
      listener: (event: SdkworkTauriEvent<TPayload>) => void,
    ) => Promise<SdkworkTauriUnlisten>;
    window?: SdkworkTauriWindowTransport;
  }

  export interface SdkworkTauriHostBridge {
    descriptor: unknown;
    isAvailable(): boolean;
    transport: SdkworkTauriTransport;
  }

  export interface CreateSdkworkTauriHostBridgeOptions {
    descriptor?: Record<string, unknown>;
    transport: SdkworkTauriTransport;
  }

  export interface EvaluateTauriHostBridgeReadinessOptions {
    requiredCapabilities?: string[];
    requiredCommands?: string[];
    requiredEvents?: string[];
    requiredWindowOperations?: string[];
  }

  export interface SdkworkTauriHostBridgeReadinessSummary {
    available: boolean;
    missingCapabilities: string[];
    missingCommands: string[];
    missingEvents: string[];
    missingWindowOperations: string[];
    ready: boolean;
  }

  export function createTauriHostBridge(
    options: CreateSdkworkTauriHostBridgeOptions,
  ): SdkworkTauriHostBridge;

  export function evaluateTauriHostBridgeReadiness(
    bridge: SdkworkTauriHostBridge,
    options?: EvaluateTauriHostBridgeReadinessOptions,
  ): SdkworkTauriHostBridgeReadinessSummary;

  export const hostTauriPackageMeta: {
    architecture: string;
    domain: string;
    package: string;
    status: string;
  };
}

declare module '@sdkwork/auth-runtime-pc-react' {
  import type { IamRuntime } from '@sdkwork/iam-runtime';

  export interface SdkworkAppbasePcAuthRuntimeComposition {
    runtime: IamRuntime;
    tokenStore: unknown;
    tokenManager: unknown;
    contextStore: unknown;
  }

  export type SdkworkAppbasePcAuthRuntimeSdkClient = Partial<{
    setTokenManager(manager: unknown): unknown;
  }>;

  export function createSdkworkAppbasePcAuthRuntime(options: {
    app: {
      appId: string;
      deploymentMode: 'local' | 'private' | 'saas';
      environment: 'dev' | 'prod' | 'test';
      platform?: string;
    };
    baseUrls: {
      appbaseAppApiBaseUrl: string;
      appbaseBackendApiBaseUrl?: string;
    };
    createAppbaseAppClient?: (config: unknown) => unknown;
    createAppbaseBackendClient?: (config: unknown) => unknown;
    hooks?: {
      onSessionChanged?: (session: unknown) => Promise<unknown> | unknown;
    };
    sdkClients?: readonly SdkworkAppbasePcAuthRuntimeSdkClient[];
    sessionBridge?: {
      clearSession(): Promise<void> | void;
      commitSession(session: unknown): Promise<unknown> | unknown;
      readSession(): Promise<unknown> | unknown;
    };
    tokenManager?: unknown;
  }): SdkworkAppbasePcAuthRuntimeComposition;
}

declare module '@sdkwork/host-pc-react' {
  const hostPcReact: unknown;
  export default hostPcReact;
}

declare module '@sdkwork/i18n-pc-react' {
  const i18nPcReact: unknown;
  export default i18nPcReact;
}

  declare module '@sdkwork/notification-pc-react' {
    import type { ReactNode } from 'react';

  export interface SdkworkNotificationGeneratedClient {
    notification: {
      list(params?: {
        appId?: string;
        includeArchived?: boolean;
        page?: number;
        pageSize?: number;
      }): Promise<unknown>;
      popupSeen: {
        create(notificationId: string, params?: { appId?: string }): Promise<unknown>;
      };
      acknowledge: {
        create(notificationId: string, params?: { appId?: string }): Promise<unknown>;
      };
    };
  }

  export interface SdkworkNotificationItem {
    actionUrl?: string | null;
    appId?: string;
    archived?: boolean;
    content?: string;
    createdAt: string;
    desc?: string;
    id: string;
    kind: 'error' | 'info' | 'message' | 'security' | 'success' | 'task' | 'warning';
    popupSeen?: boolean;
    read?: boolean;
    route?: string;
    showAsPopup?: boolean;
    status: 'archived' | 'read' | 'unread';
    time?: string;
    title: string;
    type?: string;
  }

  export interface SdkworkNotificationServiceListOptions {
    includeArchived?: boolean;
    page?: number;
    pageSize?: number;
  }

  export interface SdkworkNotificationService {
    acknowledge(notificationId: string): Promise<void>;
    list(options?: SdkworkNotificationServiceListOptions): Promise<SdkworkNotificationItem[]>;
    markPopupSeen(notificationId: string): Promise<void>;
  }

  export interface SdkworkNotificationBellProps {
    appId: string;
    authenticated?: boolean;
    centerPath?: string;
    className?: string;
    client: SdkworkNotificationGeneratedClient;
    labels?: Record<string, string>;
    onNavigate?: (href: string) => void;
    pageSize?: number;
    service?: SdkworkNotificationService;
  }

  export function createSdkworkNotificationService(input: {
    appId: string;
    client: SdkworkNotificationGeneratedClient;
    pageSize?: number;
  }): SdkworkNotificationService;

  export function SdkworkNotificationBell(props: SdkworkNotificationBellProps): ReactNode;
  }

declare module '@sdkwork/notification-pc-react/service' {
  export {
    createSdkworkNotificationService,
    type SdkworkNotificationGeneratedClient,
    type SdkworkNotificationItem,
    type SdkworkNotificationService,
  } from '@sdkwork/notification-pc-react';
}

declare module '@sdkwork/iam-contracts' {
  const iamContracts: unknown;
  export default iamContracts;
}

declare module '@sdkwork/iam-core-pc-react' {
  const iamCorePcReact: unknown;
  export default iamCorePcReact;
}

declare module '@sdkwork/iam-react' {
  const iamReact: unknown;
  export default iamReact;
}

declare module '@sdkwork/iam-sdk-ports' {
  const iamSdkPorts: unknown;
  export default iamSdkPorts;
}
