import {
  createRequestParams,
  ensurePlusApiSuccess,
  getClawRouterBackendSdkClient,
  isRecord,
  normalizeJsonObject,
  readApiRecord,
  readBoolean,
  readNullableString,
  readNumber,
  readRequiredApiItem,
  readRequiredApiItems,
  readRequiredString,
  readString,
  readStringArray,
  requiredSafePathSegment,
  type ApiRecord,
  type JsonObject,
} from 'sdkwork-claw-router-commons/runtime';
import type {
  AdminSkillArtifactCreateRequest,
  AdminSkillArtifactItem,
  AdminSkillArtifactUpdateRequest,
  AdminSkillAssetCreateRequest,
  AdminSkillAssetItem,
  AdminSkillAssetUpdateRequest,
  AdminSkillCategoryCreateRequest,
  AdminSkillCreateRequest,
  AdminSkillItem,
  AdminSkillPackageCreateRequest,
  AdminSkillPackageUpdateRequest,
  AdminSkillReviewRequest,
  AdminSkillUpdateRequest,
} from '@sdkwork/clawrouter-backend-sdk';

export type SkillMarketStatus = AdminSkillItem['marketStatus'];
export type SkillReviewStatus = AdminSkillItem['reviewStatus'];
export type SkillVisibility = AdminSkillItem['visibility'];
export type SkillSourceType = AdminSkillItem['sourceType'];

export interface AdminSkillCategory {
  id: string;
  name: string;
  description: string;
  code: string;
  icon: string;
  sortWeight: number;
  parentId: string | null;
  path: string;
  visible: boolean;
  status: number;
  type: 19 | 20;
}

export interface AdminSkillCategoryCreateInput extends AdminSkillCategoryCreateRequest {
  name: string;
  code?: string;
  description?: string;
  icon?: string;
  sortWeight?: number;
  parentId?: string | null;
  path?: string;
  visible?: boolean;
  status?: number;
  type?: 19 | 20;
}

export interface AdminSkillPackage {
  id: string;
  packageKey: string;
  name: string;
  summary: string;
  description: string | null;
  icon: string;
  coverImage: string;
  categoryId: string | null;
  enabled: boolean;
  featured: boolean;
  sortWeight: number;
  tags: string[];
  latestPublishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminSkillPackageCreateInput extends AdminSkillPackageCreateRequest {
  packageKey: string;
  name: string;
  summary?: string;
  description?: string;
  icon?: string;
  coverImage?: string;
  categoryId?: string | null;
  enabled?: boolean;
  featured?: boolean;
  sortWeight?: number;
  tags?: string[];
}

export interface AdminSkillPackageUpdateInput extends AdminSkillPackageUpdateRequest {
  packageKey?: string;
  name?: string;
  summary?: string;
  description?: string | null;
  icon?: string | null;
  coverImage?: string | null;
  categoryId?: string | null;
  enabled?: boolean;
  featured?: boolean;
  sortWeight?: number;
  tags?: string[];
}

export interface AdminSkill {
  id: string;
  skillKey: string;
  name: string;
  summary: string;
  description: string | null;
  icon: string;
  coverImage: string;
  categoryId: string | null;
  packageId: string | null;
  provider: string;
  version: string;
  versionName: string;
  runtime: string;
  entrypoint: string;
  manifestUrl: string;
  repositoryUrl: string;
  homepageUrl: string;
  documentationUrl: string;
  licenseName: string;
  sourceType: SkillSourceType;
  marketStatus: SkillMarketStatus;
  visibility: SkillVisibility;
  reviewStatus: SkillReviewStatus;
  reviewComment: string;
  reviewedBy: string;
  reviewedAt: string;
  builtin: boolean;
  isBuiltin: boolean;
  enabled: boolean;
  featured: boolean;
  recommendWeight: number;
  price: string | null;
  currency: string;
  installCount: string;
  ratingAvg: string;
  ratingCount: string;
  tags: string[];
  capabilities: string[];
  configSchema: JsonObject;
  defaultConfig: JsonObject;
  latestPublishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminSkillCreateInput extends AdminSkillCreateRequest {
  skillKey: string;
  name: string;
  summary?: string;
  description?: string;
  icon?: string;
  coverImage?: string;
  categoryId?: string | null;
  packageId?: string | null;
  provider?: string;
  version?: string;
  versionName?: string;
  runtime?: string;
  entrypoint?: string;
  manifestUrl?: string;
  repositoryUrl?: string;
  homepageUrl?: string;
  documentationUrl?: string;
  licenseName?: string;
  sourceType?: SkillSourceType;
  marketStatus?: SkillMarketStatus;
  visibility?: SkillVisibility;
  reviewStatus?: SkillReviewStatus;
  builtin?: boolean;
  isBuiltin?: boolean;
  enabled?: boolean;
  featured?: boolean;
  recommendWeight?: number;
  price?: string | null;
  currency?: string;
  tags?: string[];
  capabilities?: string[];
  configSchema?: JsonObject;
  defaultConfig?: JsonObject;
}

export interface AdminSkillUpdateInput extends AdminSkillUpdateRequest {
  skillKey?: string;
  name?: string;
  summary?: string;
  description?: string | null;
  icon?: string | null;
  coverImage?: string | null;
  categoryId?: string | null;
  packageId?: string | null;
  provider?: string | null;
  version?: string;
  versionName?: string | null;
  runtime?: string | null;
  entrypoint?: string | null;
  manifestUrl?: string | null;
  repositoryUrl?: string | null;
  homepageUrl?: string | null;
  documentationUrl?: string | null;
  licenseName?: string | null;
  sourceType?: SkillSourceType;
  visibility?: SkillVisibility;
  builtin?: boolean;
  isBuiltin?: boolean;
  featured?: boolean;
  recommendWeight?: number;
  price?: string | null;
  currency?: string;
  tags?: string[];
  capabilities?: string[];
  configSchema?: JsonObject;
  defaultConfig?: JsonObject;
}

export interface AdminSkillAsset extends AdminSkillAssetItem {
  id: string;
  skillId: string;
  targetType: 35;
  targetId: string;
  artifactId?: string | null;
  assetType: number;
  assetUrl: string;
  thumbnailUrl?: string | null;
  title?: string | null;
  altText?: string | null;
  mimeType?: string | null;
  width?: number | null;
  height?: number | null;
  durationSeconds?: string | null;
  fileSize?: number | null;
  sortOrder: number;
  status: number;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminSkillAssetCreateInput extends AdminSkillAssetCreateRequest {
  artifactId?: string | null;
  assetType?: number;
  assetUrl: string;
  thumbnailUrl?: string;
  title?: string;
  altText?: string;
  mimeType?: string;
  width?: number;
  height?: number;
  durationSeconds?: string;
  fileSize?: number;
  sortOrder?: number;
  status?: number;
  publishedAt?: string;
}

export interface AdminSkillAssetUpdateInput extends AdminSkillAssetUpdateRequest {
  artifactId?: string | null;
  assetType?: number;
  assetUrl?: string;
  thumbnailUrl?: string | null;
  title?: string | null;
  altText?: string | null;
  mimeType?: string | null;
  width?: number | null;
  height?: number | null;
  durationSeconds?: string | null;
  fileSize?: number | null;
  sortOrder?: number;
  status?: number;
  publishedAt?: string | null;
}

export interface AdminSkillArtifact extends AdminSkillArtifactItem {
  id: string;
  skillId: string;
  targetType: 35;
  targetId: string;
  artifactType: number;
  version: string;
  platformType: string;
  osName: string;
  artifactRef?: string | null;
  artifactUrl?: string | null;
  artifactSizeBytes: number;
  runtime?: string | null;
  frameworks: string[];
  licenseName?: string | null;
  checksumHash?: string | null;
  releaseNotes?: string | null;
  status: number;
  publishedAt?: string | null;
  deprecatedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminSkillArtifactCreateInput extends AdminSkillArtifactCreateRequest {
  artifactType?: number;
  version?: string;
  platformType?: string;
  osName?: string;
  artifactRef?: string;
  artifactUrl?: string;
  artifactSizeBytes?: number;
  runtime?: string;
  frameworks?: string[];
  licenseName?: string;
  checksumHash?: string;
  releaseNotes?: string;
  status?: number;
  publishedAt?: string;
  deprecatedAt?: string;
}

export interface AdminSkillArtifactUpdateInput extends AdminSkillArtifactUpdateRequest {
  artifactType?: number;
  version?: string;
  platformType?: string;
  osName?: string;
  artifactRef?: string | null;
  artifactUrl?: string | null;
  artifactSizeBytes?: number;
  runtime?: string | null;
  frameworks?: string[];
  licenseName?: string | null;
  checksumHash?: string | null;
  releaseNotes?: string | null;
  status?: number;
  publishedAt?: string | null;
  deprecatedAt?: string | null;
}

export interface AdminSkillListInput {
  searchQuery?: unknown;
  marketStatus?: SkillMarketStatus;
  reviewStatus?: SkillReviewStatus;
  visibility?: SkillVisibility;
  enabled?: boolean;
  categoryId?: unknown;
  page?: unknown;
  pageSize?: unknown;
}

export interface AdminSkillPackageListInput {
  searchQuery?: unknown;
  enabled?: boolean;
  categoryId?: unknown;
  page?: unknown;
  pageSize?: unknown;
}

interface AdminSkillListSdkParams {
  q?: string;
  marketStatus?: SkillMarketStatus;
  reviewStatus?: SkillReviewStatus;
  visibility?: SkillVisibility;
  enabled?: boolean;
  categoryId?: string;
  page?: number;
  pageSize?: number;
}

interface AdminSkillPackageListSdkParams {
  q?: string;
  enabled?: boolean;
  categoryId?: string;
  page?: number;
  pageSize?: number;
}

export class AdminSkillService {
  static async fetchSkillCategories(): Promise<AdminSkillCategory[]> {
    const result = await getClawRouterBackendSdkClient().ecosystem.skills.categories.list();
    ensurePlusApiSuccess(result, 'Failed to fetch skill categories');
    return readRequiredApiItems(result, 'Failed to fetch skill categories')
      .map(normalizeSkillCategory);
  }

  static async createSkillCategory(input: AdminSkillCategoryCreateInput): Promise<AdminSkillCategory> {
    const result = await getClawRouterBackendSdkClient().ecosystem.skills.categories.create(
      normalizeCreateCategoryRequest(input),
      createRequestParams('admin-skill-category-create'),
    );
    ensurePlusApiSuccess(result, 'Failed to create skill category');
    return normalizeSkillCategory(readRequiredApiItem(result, 'Created skill category response is missing data'));
  }

  static async fetchSkillPackages(query: AdminSkillPackageListInput = {}): Promise<AdminSkillPackage[]> {
    const result = await getClawRouterBackendSdkClient().ecosystem.skills.package.list(normalizePackageListRequest(query));
    ensurePlusApiSuccess(result, 'Failed to fetch skill packages');
    return readRequiredApiItems(result, 'Failed to fetch skill packages')
      .map(normalizeSkillPackage);
  }

  static async getSkillPackage(packageId: string): Promise<AdminSkillPackage> {
    const result = await getClawRouterBackendSdkClient().ecosystem.skills.package.retrieve(
      requiredSafePathSegment(packageId, 'packageId'),
    );
    ensurePlusApiSuccess(result, 'Failed to fetch skill package');
    return normalizeSkillPackage(readRequiredApiItem(result, 'Skill package response is missing data'));
  }

  static async createSkillPackage(input: AdminSkillPackageCreateInput): Promise<AdminSkillPackage> {
    const result = await getClawRouterBackendSdkClient().ecosystem.skills.package.create(
      normalizeCreatePackageRequest(input),
      createRequestParams('admin-skill-package-create'),
    );
    ensurePlusApiSuccess(result, 'Failed to create skill package');
    return normalizeSkillPackage(readRequiredApiItem(result, 'Created skill package response is missing data'));
  }

  static async updateSkillPackage(packageId: string, input: AdminSkillPackageUpdateInput): Promise<AdminSkillPackage> {
    const result = await getClawRouterBackendSdkClient().ecosystem.skills.package.update(
      requiredSafePathSegment(packageId, 'packageId'),
      normalizeUpdatePackageRequest(input),
      createRequestParams('admin-skill-package-update'),
    );
    ensurePlusApiSuccess(result, 'Failed to update skill package');
    return normalizeSkillPackage(readRequiredApiItem(result, 'Updated skill package response is missing data'));
  }

  static async deleteSkillPackage(packageId: string): Promise<boolean> {
    const result = await getClawRouterBackendSdkClient().ecosystem.skills.package.delete(
      requiredSafePathSegment(packageId, 'packageId'),
    );
    ensurePlusApiSuccess(result, 'Failed to delete skill package');
    return readBoolean(readApiRecord(result), 'deleted', false);
  }

  static async enableSkillPackage(packageId: string): Promise<AdminSkillPackage> {
    const result = await getClawRouterBackendSdkClient().ecosystem.skills.package.enable(
      requiredSafePathSegment(packageId, 'packageId'),
      createRequestParams('admin-skill-package-enable'),
    );
    ensurePlusApiSuccess(result, 'Failed to enable skill package');
    return normalizeSkillPackage(readRequiredApiItem(result, 'Enabled skill package response is missing data'));
  }

  static async disableSkillPackage(packageId: string): Promise<AdminSkillPackage> {
    const result = await getClawRouterBackendSdkClient().ecosystem.skills.package.disable(
      requiredSafePathSegment(packageId, 'packageId'),
      createRequestParams('admin-skill-package-disable'),
    );
    ensurePlusApiSuccess(result, 'Failed to disable skill package');
    return normalizeSkillPackage(readRequiredApiItem(result, 'Disabled skill package response is missing data'));
  }

  static async fetchSkills(query: AdminSkillListInput = {}): Promise<AdminSkill[]> {
    const result = await getClawRouterBackendSdkClient().ecosystem.skills.list(normalizeListRequest(query));
    ensurePlusApiSuccess(result, 'Failed to fetch skills');
    return readRequiredApiItems(result, 'Failed to fetch skills')
      .map(normalizeSkill);
  }

  static async getSkill(skillId: string): Promise<AdminSkill> {
    const result = await getClawRouterBackendSdkClient().ecosystem.skills.retrieve(
      requiredSafePathSegment(skillId, 'skillId'),
    );
    ensurePlusApiSuccess(result, 'Failed to fetch skill');
    return normalizeSkill(readRequiredApiItem(result, 'Skill response is missing data'));
  }

  static async createSkill(input: AdminSkillCreateInput): Promise<AdminSkill> {
    const result = await getClawRouterBackendSdkClient().ecosystem.skills.create(
      normalizeCreateSkillRequest(input),
      createRequestParams('admin-skill-create'),
    );
    ensurePlusApiSuccess(result, 'Failed to create skill');
    return normalizeSkill(readRequiredApiItem(result, 'Created skill response is missing data'));
  }

  static async updateSkill(skillId: string, input: AdminSkillUpdateInput): Promise<AdminSkill> {
    const result = await getClawRouterBackendSdkClient().ecosystem.skills.update(
      requiredSafePathSegment(skillId, 'skillId'),
      normalizeUpdateSkillRequest(input),
      createRequestParams('admin-skill-update'),
    );
    ensurePlusApiSuccess(result, 'Failed to update skill');
    return normalizeSkill(readRequiredApiItem(result, 'Updated skill response is missing data'));
  }

  static async deleteSkill(skillId: string): Promise<boolean> {
    const result = await getClawRouterBackendSdkClient().ecosystem.skills.delete(
      requiredSafePathSegment(skillId, 'skillId'),
    );
    ensurePlusApiSuccess(result, 'Failed to delete skill');
    return readBoolean(readApiRecord(result), 'deleted', false);
  }

  static async enableSkill(skillId: string): Promise<AdminSkill> {
    const result = await getClawRouterBackendSdkClient().ecosystem.skills.enable(
      requiredSafePathSegment(skillId, 'skillId'),
      createRequestParams('admin-skill-enable'),
    );
    ensurePlusApiSuccess(result, 'Failed to enable skill');
    return normalizeSkill(readRequiredApiItem(result, 'Enabled skill response is missing data'));
  }

  static async disableSkill(skillId: string): Promise<AdminSkill> {
    const result = await getClawRouterBackendSdkClient().ecosystem.skills.disable(
      requiredSafePathSegment(skillId, 'skillId'),
      createRequestParams('admin-skill-disable'),
    );
    ensurePlusApiSuccess(result, 'Failed to disable skill');
    return normalizeSkill(readRequiredApiItem(result, 'Disabled skill response is missing data'));
  }

  static async publishSkill(skillId: string): Promise<AdminSkill> {
    const result = await getClawRouterBackendSdkClient().ecosystem.skills.publish(
      requiredSafePathSegment(skillId, 'skillId'),
      createRequestParams('admin-skill-publish'),
    );
    ensurePlusApiSuccess(result, 'Failed to publish skill');
    return normalizeSkill(readRequiredApiItem(result, 'Published skill response is missing data'));
  }

  static async offlineSkill(skillId: string): Promise<AdminSkill> {
    const result = await getClawRouterBackendSdkClient().ecosystem.skills.unpublish(
      requiredSafePathSegment(skillId, 'skillId'),
      createRequestParams('admin-skill-offline'),
    );
    ensurePlusApiSuccess(result, 'Failed to offline skill');
    return normalizeSkill(readRequiredApiItem(result, 'Offline skill response is missing data'));
  }

  static async approveSkill(skillId: string, reviewComment?: string): Promise<AdminSkill> {
    const result = await getClawRouterBackendSdkClient().ecosystem.skills.review.approve(
      requiredSafePathSegment(skillId, 'skillId'),
      normalizeReviewRequest({ reviewComment }),
      createRequestParams('admin-skill-review-approve'),
    );
    ensurePlusApiSuccess(result, 'Failed to approve skill');
    return normalizeSkill(readRequiredApiItem(result, 'Approved skill response is missing data'));
  }

  static async rejectSkill(skillId: string, reviewComment?: string): Promise<AdminSkill> {
    const result = await getClawRouterBackendSdkClient().ecosystem.skills.review.reject(
      requiredSafePathSegment(skillId, 'skillId'),
      normalizeReviewRequest({ reviewComment }),
      createRequestParams('admin-skill-review-reject'),
    );
    ensurePlusApiSuccess(result, 'Failed to reject skill');
    return normalizeSkill(readRequiredApiItem(result, 'Rejected skill response is missing data'));
  }

  static async fetchSkillAssets(skillId: string): Promise<AdminSkillAsset[]> {
    const result = await getClawRouterBackendSdkClient().ecosystem.skills.assets.list(
      requiredSafePathSegment(skillId, 'skillId'),
    );
    ensurePlusApiSuccess(result, 'Failed to fetch skill assets');
    return readRequiredApiItems(result, 'Failed to fetch skill assets')
      .map(normalizeSkillAsset);
  }

  static async getSkillAsset(skillId: string, assetId: string): Promise<AdminSkillAsset> {
    const result = await getClawRouterBackendSdkClient().ecosystem.skills.assets.retrieve(
      requiredSafePathSegment(skillId, 'skillId'),
      requiredSafePathSegment(assetId, 'assetId'),
    );
    ensurePlusApiSuccess(result, 'Failed to fetch skill asset');
    return normalizeSkillAsset(readRequiredApiItem(result, 'Skill asset response is missing data'));
  }

  static async createSkillAsset(skillId: string, input: AdminSkillAssetCreateInput): Promise<AdminSkillAsset> {
    const result = await getClawRouterBackendSdkClient().ecosystem.skills.assets.create(
      requiredSafePathSegment(skillId, 'skillId'),
      normalizeCreateAssetRequest(input),
      createRequestParams('admin-skill-asset-create'),
    );
    ensurePlusApiSuccess(result, 'Failed to create skill asset');
    return normalizeSkillAsset(readRequiredApiItem(result, 'Created skill asset response is missing data'));
  }

  static async updateSkillAsset(skillId: string, assetId: string, input: AdminSkillAssetUpdateInput): Promise<AdminSkillAsset> {
    const result = await getClawRouterBackendSdkClient().ecosystem.skills.assets.update(
      requiredSafePathSegment(skillId, 'skillId'),
      requiredSafePathSegment(assetId, 'assetId'),
      normalizeUpdateAssetRequest(input),
      createRequestParams('admin-skill-asset-update'),
    );
    ensurePlusApiSuccess(result, 'Failed to update skill asset');
    return normalizeSkillAsset(readRequiredApiItem(result, 'Updated skill asset response is missing data'));
  }

  static async deleteSkillAsset(skillId: string, assetId: string): Promise<boolean> {
    const result = await getClawRouterBackendSdkClient().ecosystem.skills.assets.delete(
      requiredSafePathSegment(skillId, 'skillId'),
      requiredSafePathSegment(assetId, 'assetId'),
      createRequestParams('admin-skill-asset-delete'),
    );
    ensurePlusApiSuccess(result, 'Failed to delete skill asset');
    return readBoolean(readApiRecord(result), 'deleted', false);
  }

  static async fetchSkillArtifacts(skillId: string): Promise<AdminSkillArtifact[]> {
    const result = await getClawRouterBackendSdkClient().ecosystem.skills.artifacts.list(
      requiredSafePathSegment(skillId, 'skillId'),
    );
    ensurePlusApiSuccess(result, 'Failed to fetch skill artifacts');
    return readRequiredApiItems(result, 'Failed to fetch skill artifacts')
      .map(normalizeSkillArtifact);
  }

  static async getSkillArtifact(skillId: string, artifactId: string): Promise<AdminSkillArtifact> {
    const result = await getClawRouterBackendSdkClient().ecosystem.skills.artifacts.retrieve(
      requiredSafePathSegment(skillId, 'skillId'),
      requiredSafePathSegment(artifactId, 'artifactId'),
    );
    ensurePlusApiSuccess(result, 'Failed to fetch skill artifact');
    return normalizeSkillArtifact(readRequiredApiItem(result, 'Skill artifact response is missing data'));
  }

  static async createSkillArtifact(skillId: string, input: AdminSkillArtifactCreateInput): Promise<AdminSkillArtifact> {
    const result = await getClawRouterBackendSdkClient().ecosystem.skills.artifacts.create(
      requiredSafePathSegment(skillId, 'skillId'),
      normalizeCreateArtifactRequest(input),
      createRequestParams('admin-skill-artifact-create'),
    );
    ensurePlusApiSuccess(result, 'Failed to create skill artifact');
    return normalizeSkillArtifact(readRequiredApiItem(result, 'Created skill artifact response is missing data'));
  }

  static async updateSkillArtifact(skillId: string, artifactId: string, input: AdminSkillArtifactUpdateInput): Promise<AdminSkillArtifact> {
    const result = await getClawRouterBackendSdkClient().ecosystem.skills.artifacts.update(
      requiredSafePathSegment(skillId, 'skillId'),
      requiredSafePathSegment(artifactId, 'artifactId'),
      normalizeUpdateArtifactRequest(input),
      createRequestParams('admin-skill-artifact-update'),
    );
    ensurePlusApiSuccess(result, 'Failed to update skill artifact');
    return normalizeSkillArtifact(readRequiredApiItem(result, 'Updated skill artifact response is missing data'));
  }

  static async deleteSkillArtifact(skillId: string, artifactId: string): Promise<boolean> {
    const result = await getClawRouterBackendSdkClient().ecosystem.skills.artifacts.delete(
      requiredSafePathSegment(skillId, 'skillId'),
      requiredSafePathSegment(artifactId, 'artifactId'),
      createRequestParams('admin-skill-artifact-delete'),
    );
    ensurePlusApiSuccess(result, 'Failed to delete skill artifact');
    return readBoolean(readApiRecord(result), 'deleted', false);
  }
}

export function createSkillCategoryInputFromForm(form: FormData): AdminSkillCategoryCreateInput {
  const input: AdminSkillCategoryCreateInput = {
    name: requiredFormText(form, 'name', 255),
  };
  const code = optionalFormText(form, 'code', 128);
  if (code !== undefined) {
    input.code = code;
  }
  const description = optionalFormText(form, 'description', 512);
  if (description !== undefined) {
    input.description = description;
  }
  const icon = optionalFormText(form, 'icon', 255);
  if (icon !== undefined) {
    input.icon = icon;
  }
  const parentId = optionalFormText(form, 'parentId', 128);
  if (parentId !== undefined) {
    input.parentId = parentId;
  }
  const path = optionalFormText(form, 'path', 1024);
  if (path !== undefined) {
    input.path = path;
  }
  const sortWeight = optionalFormInteger(form, 'sortWeight');
  if (sortWeight !== undefined) {
    input.sortWeight = sortWeight;
  }
  const status = optionalFormInteger(form, 'status');
  if (status !== undefined) {
    input.status = status;
  }
  assignOptionalCategoryType(input, optionalFormInteger(form, 'type'));
  const visible = optionalFormBoolean(form, 'visible');
  if (visible !== undefined) {
    input.visible = visible;
  }
  return input;
}

export function createSkillPackageInputFromForm(form: FormData): AdminSkillPackageCreateInput {
  const input: AdminSkillPackageCreateInput = {
    packageKey: requiredFormText(form, 'packageKey', 128),
    name: requiredFormText(form, 'name', 255),
    enabled: optionalFormBoolean(form, 'enabled') ?? true,
    featured: optionalFormBoolean(form, 'featured') ?? false,
  };
  mergeSharedPackageFormFields(input, form);
  return input;
}

export function updateSkillPackageInputFromForm(form: FormData): AdminSkillPackageUpdateInput {
  const input: AdminSkillPackageUpdateInput = {};
  const packageKey = optionalFormText(form, 'packageKey', 128);
  if (packageKey) {
    input.packageKey = packageKey;
  }
  const name = optionalFormText(form, 'name', 255);
  if (name) {
    input.name = name;
  }
  mergeSharedPackageFormFields(input, form);
  return input;
}

export function createSkillInputFromForm(form: FormData): AdminSkillCreateInput {
  const input: AdminSkillCreateInput = {
    skillKey: requiredFormText(form, 'skillKey', 128),
    name: requiredFormText(form, 'name', 255),
    sourceType: readSourceType(optionalFormText(form, 'sourceType', 32) ?? 'COMMUNITY'),
    marketStatus: readMarketStatus(optionalFormText(form, 'marketStatus', 32) ?? 'DRAFT'),
    visibility: readVisibility(optionalFormText(form, 'visibility', 32) ?? 'PUBLIC'),
    reviewStatus: readReviewStatus(optionalFormText(form, 'reviewStatus', 32) ?? 'PENDING'),
    enabled: optionalFormBoolean(form, 'enabled') ?? true,
    featured: optionalFormBoolean(form, 'featured') ?? false,
    builtin: optionalFormBoolean(form, 'builtin') ?? false,
    isBuiltin: optionalFormBoolean(form, 'isBuiltin') ?? false,
  };
  mergeSharedSkillFormFields(input, form, 'create');
  return input;
}

export function updateSkillInputFromForm(form: FormData): AdminSkillUpdateInput {
  const input: AdminSkillUpdateInput = {};
  const skillKey = optionalFormText(form, 'skillKey', 128);
  if (skillKey) {
    input.skillKey = skillKey;
  }
  const name = optionalFormText(form, 'name', 255);
  if (name) {
    input.name = name;
  }
  mergeSharedSkillFormFields(input, form, 'update');
  const sourceType = optionalFormText(form, 'sourceType', 32);
  if (sourceType) {
    input.sourceType = readSourceType(sourceType);
  }
  const visibility = optionalFormText(form, 'visibility', 32);
  if (visibility) {
    input.visibility = readVisibility(visibility);
  }
  for (const key of ['builtin', 'isBuiltin', 'featured'] as const) {
    const value = optionalFormBoolean(form, key);
    if (value !== undefined) {
      input[key] = value;
    }
  }
  return input;
}

export function createSkillAssetInputFromForm(form: FormData): AdminSkillAssetCreateInput {
  const input: AdminSkillAssetCreateInput = {
    assetUrl: requiredFormText(form, 'assetUrl', 1024),
  };
  mergeSharedAssetFormFields(input, form);
  return input;
}

export function updateSkillAssetInputFromForm(form: FormData): AdminSkillAssetUpdateInput {
  const input: AdminSkillAssetUpdateInput = {};
  mergeSharedAssetFormFields(input, form);
  return input;
}

export function createSkillArtifactInputFromForm(form: FormData): AdminSkillArtifactCreateInput {
  const input: AdminSkillArtifactCreateInput = {};
  mergeSharedArtifactFormFields(input, form);
  if (!input.artifactRef && !input.artifactUrl) {
    throw new Error('artifactRef or artifactUrl is required');
  }
  return input;
}

export function updateSkillArtifactInputFromForm(form: FormData): AdminSkillArtifactUpdateInput {
  const input: AdminSkillArtifactUpdateInput = {};
  mergeSharedArtifactFormFields(input, form);
  return input;
}

function normalizeCreateCategoryRequest(input: AdminSkillCategoryCreateInput): AdminSkillCategoryCreateRequest {
  return {
    ...input,
    name: requiredText(input.name, 'name', 255),
    code: optionalText(input.code, 'code', 128),
    description: optionalText(input.description, 'description', 512),
    icon: optionalText(input.icon, 'icon', 255),
    parentId: normalizeNullableId(input.parentId),
    path: optionalText(input.path, 'path', 1024),
  };
}

function normalizeListRequest(input: AdminSkillListInput): AdminSkillListSdkParams {
  const request: AdminSkillListSdkParams = {};
  const searchQuery = optionalText(input.searchQuery, 'searchQuery', 128);
  if (searchQuery) {
    request.q = searchQuery;
  }
  if (input.marketStatus) {
    request.marketStatus = readMarketStatus(input.marketStatus);
  }
  if (input.reviewStatus) {
    request.reviewStatus = readReviewStatus(input.reviewStatus);
  }
  if (input.visibility) {
    request.visibility = readVisibility(input.visibility);
  }
  if (typeof input.enabled === 'boolean') {
    request.enabled = input.enabled;
  }
  const categoryId = optionalText(input.categoryId, 'categoryId', 128);
  if (categoryId) {
    request.categoryId = categoryId;
  }
  if (input.page !== undefined) {
    request.page = positiveInteger(input.page, 'page', 1_000_000);
  }
  if (input.pageSize !== undefined) {
    request.pageSize = positiveInteger(input.pageSize, 'pageSize', 200);
  }
  return request;
}

function normalizePackageListRequest(input: AdminSkillPackageListInput): AdminSkillPackageListSdkParams {
  const request: AdminSkillPackageListSdkParams = {};
  const searchQuery = optionalText(input.searchQuery, 'searchQuery', 128);
  if (searchQuery) {
    request.q = searchQuery;
  }
  if (typeof input.enabled === 'boolean') {
    request.enabled = input.enabled;
  }
  const categoryId = optionalText(input.categoryId, 'categoryId', 128);
  if (categoryId) {
    request.categoryId = categoryId;
  }
  if (input.page !== undefined) {
    request.page = positiveInteger(input.page, 'page', 1_000_000);
  }
  if (input.pageSize !== undefined) {
    request.pageSize = positiveInteger(input.pageSize, 'pageSize', 200);
  }
  return request;
}

function normalizeCreatePackageRequest(input: AdminSkillPackageCreateInput): AdminSkillPackageCreateRequest {
  return pruneUndefined({
    ...input,
    packageKey: requiredText(input.packageKey, 'packageKey', 128),
    name: requiredText(input.name, 'name', 255),
    summary: optionalText(input.summary, 'summary', 512),
    description: optionalText(input.description, 'description', 4000),
    icon: optionalUrlOrPath(input.icon, 'icon', 255),
    coverImage: optionalUrlOrPath(input.coverImage, 'coverImage', 255),
    categoryId: normalizeNullableId(input.categoryId),
    tags: normalizeStringArray(input.tags, 'tags'),
  });
}

function normalizeUpdatePackageRequest(input: AdminSkillPackageUpdateInput): AdminSkillPackageUpdateRequest {
  return pruneUndefined({
    ...input,
    packageKey: optionalCode(input.packageKey, 'packageKey', 128),
    name: optionalText(input.name, 'name', 255),
    summary: optionalText(input.summary, 'summary', 512),
    description: normalizeNullableText(input.description, 'description', 4000),
    icon: normalizeNullableUrlOrPath(input.icon, 'icon', 255),
    coverImage: normalizeNullableUrlOrPath(input.coverImage, 'coverImage', 255),
    categoryId: normalizeNullableId(input.categoryId),
    tags: input.tags ? normalizeStringArray(input.tags, 'tags') : undefined,
  });
}

function normalizeCreateSkillRequest(input: AdminSkillCreateInput): AdminSkillCreateRequest {
  return pruneUndefined({
    ...input,
    skillKey: requiredText(input.skillKey, 'skillKey', 128),
    name: requiredText(input.name, 'name', 255),
    summary: optionalText(input.summary, 'summary', 512),
    description: optionalText(input.description, 'description', 4000),
    icon: optionalUrlOrPath(input.icon, 'icon', 255),
    coverImage: optionalUrlOrPath(input.coverImage, 'coverImage', 255),
    categoryId: normalizeNullableId(input.categoryId),
    packageId: normalizeNullableId(input.packageId),
    provider: optionalText(input.provider, 'provider', 128),
    version: optionalText(input.version, 'version', 64),
    versionName: optionalText(input.versionName, 'versionName', 64),
    runtime: optionalText(input.runtime, 'runtime', 64),
    entrypoint: optionalText(input.entrypoint, 'entrypoint', 255),
    manifestUrl: optionalUrlOrPath(input.manifestUrl, 'manifestUrl', 500),
    repositoryUrl: optionalUrlOrPath(input.repositoryUrl, 'repositoryUrl', 500),
    homepageUrl: optionalUrlOrPath(input.homepageUrl, 'homepageUrl', 500),
    documentationUrl: optionalUrlOrPath(input.documentationUrl, 'documentationUrl', 500),
    licenseName: optionalText(input.licenseName, 'licenseName', 128),
    sourceType: readSourceType(input.sourceType ?? 'COMMUNITY'),
    marketStatus: readMarketStatus(input.marketStatus ?? 'DRAFT'),
    visibility: readVisibility(input.visibility ?? 'PUBLIC'),
    reviewStatus: readReviewStatus(input.reviewStatus ?? 'PENDING'),
    price: normalizeNullableDecimal(input.price),
    currency: normalizeCurrency(input.currency ?? 'CNY'),
    tags: normalizeStringArray(input.tags, 'tags'),
    capabilities: normalizeStringArray(input.capabilities, 'capabilities'),
    configSchema: normalizeObject(input.configSchema, 'configSchema'),
    defaultConfig: normalizeObject(input.defaultConfig, 'defaultConfig'),
  });
}

function normalizeUpdateSkillRequest(input: AdminSkillUpdateInput): AdminSkillUpdateRequest {
  const request: AdminSkillUpdateInput = pruneUndefined({
    ...input,
    skillKey: optionalCode(input.skillKey, 'skillKey', 128),
    name: optionalText(input.name, 'name', 255),
    summary: optionalText(input.summary, 'summary', 512),
    description: normalizeNullableText(input.description, 'description', 4000),
    icon: normalizeNullableUrlOrPath(input.icon, 'icon', 255),
    coverImage: normalizeNullableUrlOrPath(input.coverImage, 'coverImage', 255),
    categoryId: normalizeNullableId(input.categoryId),
    packageId: normalizeNullableId(input.packageId),
    provider: normalizeNullableText(input.provider, 'provider', 128),
    version: optionalText(input.version, 'version', 64),
    versionName: normalizeNullableText(input.versionName, 'versionName', 64),
    runtime: normalizeNullableText(input.runtime, 'runtime', 64),
    entrypoint: normalizeNullableText(input.entrypoint, 'entrypoint', 255),
    manifestUrl: normalizeNullableUrlOrPath(input.manifestUrl, 'manifestUrl', 500),
    repositoryUrl: normalizeNullableUrlOrPath(input.repositoryUrl, 'repositoryUrl', 500),
    homepageUrl: normalizeNullableUrlOrPath(input.homepageUrl, 'homepageUrl', 500),
    documentationUrl: normalizeNullableUrlOrPath(input.documentationUrl, 'documentationUrl', 500),
    licenseName: normalizeNullableText(input.licenseName, 'licenseName', 128),
    sourceType: input.sourceType ? readSourceType(input.sourceType) : undefined,
    visibility: input.visibility ? readVisibility(input.visibility) : undefined,
    price: normalizeNullableDecimal(input.price),
    currency: input.currency ? normalizeCurrency(input.currency) : undefined,
    tags: input.tags ? normalizeStringArray(input.tags, 'tags') : undefined,
    capabilities: input.capabilities ? normalizeStringArray(input.capabilities, 'capabilities') : undefined,
    configSchema: input.configSchema === undefined ? undefined : normalizeObject(input.configSchema, 'configSchema'),
    defaultConfig: input.defaultConfig === undefined ? undefined : normalizeObject(input.defaultConfig, 'defaultConfig'),
  });
  return request;
}

function normalizeReviewRequest(input: AdminSkillReviewRequest): AdminSkillReviewRequest {
  const reviewComment = optionalText(input.reviewComment ?? input.comment, 'reviewComment', 1000);
  return reviewComment ? { reviewComment } : {};
}

function normalizeCreateAssetRequest(input: AdminSkillAssetCreateInput): AdminSkillAssetCreateRequest {
  return pruneUndefined({
    ...input,
    artifactId: normalizeNullableId(input.artifactId),
    assetType: input.assetType === undefined ? undefined : nonNegativeInteger(input.assetType, 'assetType', 1_000_000),
    assetUrl: requiredResourceRef(input.assetUrl, 'assetUrl'),
    thumbnailUrl: optionalResourceRef(input.thumbnailUrl, 'thumbnailUrl'),
    title: optionalText(input.title, 'title', 255),
    altText: optionalText(input.altText, 'altText', 512),
    mimeType: optionalText(input.mimeType, 'mimeType', 128),
    width: input.width === undefined ? undefined : nonNegativeInteger(input.width, 'width', 1_000_000),
    height: input.height === undefined ? undefined : nonNegativeInteger(input.height, 'height', 1_000_000),
    durationSeconds: optionalText(input.durationSeconds, 'durationSeconds', 64),
    fileSize: input.fileSize === undefined ? undefined : nonNegativeInteger(input.fileSize, 'fileSize', Number.MAX_SAFE_INTEGER),
    sortOrder: input.sortOrder === undefined ? undefined : nonNegativeInteger(input.sortOrder, 'sortOrder', 1_000_000),
    status: input.status === undefined ? undefined : nonNegativeInteger(input.status, 'status', 1_000_000),
    publishedAt: optionalText(input.publishedAt, 'publishedAt', 64),
  });
}

function normalizeUpdateAssetRequest(input: AdminSkillAssetUpdateInput): AdminSkillAssetUpdateRequest {
  return pruneUndefined({
    ...input,
    artifactId: normalizeNullableId(input.artifactId),
    assetType: input.assetType === undefined ? undefined : nonNegativeInteger(input.assetType, 'assetType', 1_000_000),
    assetUrl: optionalResourceRef(input.assetUrl, 'assetUrl'),
    thumbnailUrl: normalizeNullableResourceRef(input.thumbnailUrl, 'thumbnailUrl'),
    title: normalizeNullableText(input.title, 'title', 255),
    altText: normalizeNullableText(input.altText, 'altText', 512),
    mimeType: normalizeNullableText(input.mimeType, 'mimeType', 128),
    width: input.width === null ? null : input.width === undefined ? undefined : nonNegativeInteger(input.width, 'width', 1_000_000),
    height: input.height === null ? null : input.height === undefined ? undefined : nonNegativeInteger(input.height, 'height', 1_000_000),
    durationSeconds: normalizeNullableText(input.durationSeconds, 'durationSeconds', 64),
    fileSize: input.fileSize === null ? null : input.fileSize === undefined ? undefined : nonNegativeInteger(input.fileSize, 'fileSize', Number.MAX_SAFE_INTEGER),
    sortOrder: input.sortOrder === undefined ? undefined : nonNegativeInteger(input.sortOrder, 'sortOrder', 1_000_000),
    status: input.status === undefined ? undefined : nonNegativeInteger(input.status, 'status', 1_000_000),
    publishedAt: normalizeNullableText(input.publishedAt, 'publishedAt', 64),
  });
}

function normalizeCreateArtifactRequest(input: AdminSkillArtifactCreateInput): AdminSkillArtifactCreateRequest {
  const artifactRef = optionalResourceRef(input.artifactRef, 'artifactRef');
  const artifactUrl = optionalResourceRef(input.artifactUrl, 'artifactUrl');
  if (!artifactRef && !artifactUrl) {
    throw new Error('artifactRef or artifactUrl is required');
  }
  return pruneUndefined({
    ...input,
    artifactType: input.artifactType === undefined ? undefined : nonNegativeInteger(input.artifactType, 'artifactType', 1_000_000),
    version: optionalText(input.version, 'version', 64),
    platformType: optionalText(input.platformType, 'platformType', 128),
    osName: optionalText(input.osName, 'osName', 128),
    artifactRef,
    artifactUrl,
    artifactSizeBytes: input.artifactSizeBytes === undefined ? undefined : nonNegativeInteger(input.artifactSizeBytes, 'artifactSizeBytes', Number.MAX_SAFE_INTEGER),
    runtime: optionalText(input.runtime, 'runtime', 64),
    frameworks: input.frameworks ? normalizeLabelArray(input.frameworks, 'frameworks') : undefined,
    licenseName: optionalText(input.licenseName, 'licenseName', 128),
    checksumHash: normalizeOptionalChecksumHash(input.checksumHash),
    releaseNotes: optionalText(input.releaseNotes, 'releaseNotes', 4000),
    status: input.status === undefined ? undefined : nonNegativeInteger(input.status, 'status', 1_000_000),
    publishedAt: optionalText(input.publishedAt, 'publishedAt', 64),
    deprecatedAt: optionalText(input.deprecatedAt, 'deprecatedAt', 64),
  });
}

function normalizeUpdateArtifactRequest(input: AdminSkillArtifactUpdateInput): AdminSkillArtifactUpdateRequest {
  return pruneUndefined({
    ...input,
    artifactType: input.artifactType === undefined ? undefined : nonNegativeInteger(input.artifactType, 'artifactType', 1_000_000),
    version: optionalText(input.version, 'version', 64),
    platformType: optionalText(input.platformType, 'platformType', 128),
    osName: optionalText(input.osName, 'osName', 128),
    artifactRef: normalizeNullableResourceRef(input.artifactRef, 'artifactRef'),
    artifactUrl: normalizeNullableResourceRef(input.artifactUrl, 'artifactUrl'),
    artifactSizeBytes: input.artifactSizeBytes === undefined ? undefined : nonNegativeInteger(input.artifactSizeBytes, 'artifactSizeBytes', Number.MAX_SAFE_INTEGER),
    runtime: normalizeNullableText(input.runtime, 'runtime', 64),
    frameworks: input.frameworks ? normalizeLabelArray(input.frameworks, 'frameworks') : undefined,
    licenseName: normalizeNullableText(input.licenseName, 'licenseName', 128),
    checksumHash: normalizeNullableChecksumHash(input.checksumHash),
    releaseNotes: normalizeNullableText(input.releaseNotes, 'releaseNotes', 4000),
    status: input.status === undefined ? undefined : nonNegativeInteger(input.status, 'status', 1_000_000),
    publishedAt: normalizeNullableText(input.publishedAt, 'publishedAt', 64),
    deprecatedAt: normalizeNullableText(input.deprecatedAt, 'deprecatedAt', 64),
  });
}

function normalizeSkillCategory(value: unknown): AdminSkillCategory {
  const item = readRequiredRecord(value, 'Skill category record is required');
  const type = readNumber(item, 'type', 19);
  if (type !== 19 && type !== 20) {
    throw new Error(`Unsupported skill category type: ${type}`);
  }
  return {
    id: readRequiredString(item, 'id', 'Skill category id is required'),
    name: readRequiredString(item, 'name', 'Skill category name is required'),
    description: readString(item, 'description'),
    code: readString(item, 'code'),
    icon: readString(item, 'icon'),
    sortWeight: readNumber(item, 'sortWeight'),
    parentId: readNullableString(item, 'parentId'),
    path: readString(item, 'path'),
    visible: readBoolean(item, 'visible', true),
    status: readNumber(item, 'status', 1),
    type,
  };
}

function normalizeSkillPackage(value: unknown): AdminSkillPackage {
  const item = readRequiredRecord(value, 'Skill package record is required');
  return {
    id: readRequiredString(item, 'id', 'Skill package id is required'),
    packageKey: readRequiredString(item, 'packageKey', 'Skill package key is required'),
    name: readRequiredString(item, 'name', 'Skill package name is required'),
    summary: readString(item, 'summary'),
    description: readNullableString(item, 'description'),
    icon: readString(item, 'icon'),
    coverImage: readString(item, 'coverImage'),
    categoryId: readNullableString(item, 'categoryId'),
    enabled: readBoolean(item, 'enabled', true),
    featured: readBoolean(item, 'featured'),
    sortWeight: readNumber(item, 'sortWeight'),
    tags: uniqueStrings(readStringArray(item, 'tags')),
    latestPublishedAt: readString(item, 'latestPublishedAt'),
    createdAt: readString(item, 'createdAt'),
    updatedAt: readString(item, 'updatedAt'),
  };
}

function normalizeSkill(value: unknown): AdminSkill {
  const item = readRequiredRecord(value, 'Skill record is required');
  return {
    id: readRequiredString(item, 'id', 'Skill id is required'),
    skillKey: readRequiredString(item, 'skillKey', 'Skill key is required'),
    name: readRequiredString(item, 'name', 'Skill name is required'),
    summary: readString(item, 'summary'),
    description: readNullableString(item, 'description'),
    icon: readString(item, 'icon'),
    coverImage: readString(item, 'coverImage'),
    categoryId: readNullableString(item, 'categoryId'),
    packageId: readNullableString(item, 'packageId'),
    provider: readString(item, 'provider'),
    version: readString(item, 'version'),
    versionName: readString(item, 'versionName'),
    runtime: readString(item, 'runtime'),
    entrypoint: readString(item, 'entrypoint'),
    manifestUrl: readString(item, 'manifestUrl'),
    repositoryUrl: readString(item, 'repositoryUrl'),
    homepageUrl: readString(item, 'homepageUrl'),
    documentationUrl: readString(item, 'documentationUrl'),
    licenseName: readString(item, 'licenseName'),
    sourceType: readSourceType(readString(item, 'sourceType', 'COMMUNITY')),
    marketStatus: readMarketStatus(readString(item, 'marketStatus', 'DRAFT')),
    visibility: readVisibility(readString(item, 'visibility', 'PUBLIC')),
    reviewStatus: readReviewStatus(readString(item, 'reviewStatus', 'PENDING')),
    reviewComment: readString(item, 'reviewComment'),
    reviewedBy: readString(item, 'reviewedBy'),
    reviewedAt: readString(item, 'reviewedAt'),
    builtin: readBoolean(item, 'builtin'),
    isBuiltin: readBoolean(item, 'isBuiltin'),
    enabled: readBoolean(item, 'enabled'),
    featured: readBoolean(item, 'featured'),
    recommendWeight: readNumber(item, 'recommendWeight'),
    price: readNullableString(item, 'price'),
    currency: readString(item, 'currency', 'CNY'),
    installCount: readString(item, 'installCount', '0'),
    ratingAvg: readString(item, 'ratingAvg', '0'),
    ratingCount: readString(item, 'ratingCount', '0'),
    tags: uniqueStrings(readStringArray(item, 'tags')),
    capabilities: uniqueStrings(readStringArray(item, 'capabilities')),
    configSchema: readRecord(item, 'configSchema'),
    defaultConfig: readRecord(item, 'defaultConfig'),
    latestPublishedAt: readString(item, 'latestPublishedAt'),
    createdAt: readString(item, 'createdAt'),
    updatedAt: readString(item, 'updatedAt'),
  };
}

function normalizeSkillAsset(value: unknown): AdminSkillAsset {
  const item = readRequiredRecord(value, 'Skill asset record is required');
  const targetType = readNumber(item, 'targetType', 35);
  if (targetType !== 35) {
    throw new Error(`Unsupported skill asset target type: ${targetType}`);
  }
  return {
    id: readRequiredString(item, 'id', 'Skill asset id is required'),
    skillId: readRequiredString(item, 'skillId', 'Skill asset skill id is required'),
    targetType,
    targetId: readRequiredString(item, 'targetId', 'Skill asset target id is required'),
    artifactId: readNullableString(item, 'artifactId'),
    assetType: readNumber(item, 'assetType', 1),
    assetUrl: readRequiredString(item, 'assetUrl', 'Skill asset URL is required'),
    thumbnailUrl: readNullableString(item, 'thumbnailUrl'),
    title: readNullableString(item, 'title'),
    altText: readNullableString(item, 'altText'),
    mimeType: readNullableString(item, 'mimeType'),
    width: readNullableNumber(item, 'width'),
    height: readNullableNumber(item, 'height'),
    durationSeconds: readNullableString(item, 'durationSeconds'),
    fileSize: readNullableNumber(item, 'fileSize'),
    sortOrder: readNumber(item, 'sortOrder'),
    status: readNumber(item, 'status', 1),
    publishedAt: readNullableString(item, 'publishedAt'),
    createdAt: readString(item, 'createdAt'),
    updatedAt: readString(item, 'updatedAt'),
  };
}

function normalizeSkillArtifact(value: unknown): AdminSkillArtifact {
  const item = readRequiredRecord(value, 'Skill artifact record is required');
  const targetType = readNumber(item, 'targetType', 35);
  if (targetType !== 35) {
    throw new Error(`Unsupported skill artifact target type: ${targetType}`);
  }
  return {
    id: readRequiredString(item, 'id', 'Skill artifact id is required'),
    skillId: readRequiredString(item, 'skillId', 'Skill artifact skill id is required'),
    targetType,
    targetId: readRequiredString(item, 'targetId', 'Skill artifact target id is required'),
    artifactType: readNumber(item, 'artifactType', 1),
    version: readRequiredString(item, 'version', 'Skill artifact version is required'),
    platformType: readRequiredString(item, 'platformType', 'Skill artifact platform type is required'),
    osName: readRequiredString(item, 'osName', 'Skill artifact OS name is required'),
    artifactRef: readNullableString(item, 'artifactRef'),
    artifactUrl: readNullableString(item, 'artifactUrl'),
    artifactSizeBytes: readNumber(item, 'artifactSizeBytes'),
    runtime: readNullableString(item, 'runtime'),
    frameworks: uniqueStrings(readStringArray(item, 'frameworks')),
    licenseName: readNullableString(item, 'licenseName'),
    checksumHash: readNullableString(item, 'checksumHash'),
    releaseNotes: readNullableString(item, 'releaseNotes'),
    status: readNumber(item, 'status', 1),
    publishedAt: readNullableString(item, 'publishedAt'),
    deprecatedAt: readNullableString(item, 'deprecatedAt'),
    createdAt: readString(item, 'createdAt'),
    updatedAt: readString(item, 'updatedAt'),
  };
}

function mergeSharedSkillFormFields(input: AdminSkillCreateInput | AdminSkillUpdateInput, form: FormData, mode: 'create' | 'update'): void {
  for (const [key, maxLength] of [
    ['summary', 512],
    ['description', 4000],
    ['icon', 255],
    ['coverImage', 255],
    ['categoryId', 128],
    ['packageId', 128],
    ['provider', 128],
    ['version', 64],
    ['versionName', 64],
    ['runtime', 64],
    ['entrypoint', 255],
    ['manifestUrl', 500],
    ['repositoryUrl', 500],
    ['homepageUrl', 500],
    ['documentationUrl', 500],
    ['licenseName', 128],
    ['price', 64],
    ['currency', 16],
  ] as const) {
    const value = optionalFormText(form, key, maxLength);
    if (value !== undefined) {
      input[key] = value;
    }
  }
  const recommendWeight = optionalFormInteger(form, 'recommendWeight');
  if (recommendWeight !== undefined) {
    input.recommendWeight = recommendWeight;
  }
  const tags = splitCsvFormField(form, 'tags');
  if (tags.length > 0) {
    input.tags = tags;
  }
  const capabilities = splitCsvFormField(form, 'capabilities');
  if (capabilities.length > 0) {
    input.capabilities = capabilities;
  }
  const configSchema = optionalJsonObjectFormField(form, 'configSchema');
  if (configSchema !== undefined) {
    input.configSchema = configSchema;
  }
  const defaultConfig = optionalJsonObjectFormField(form, 'defaultConfig');
  if (defaultConfig !== undefined) {
    input.defaultConfig = defaultConfig;
  }
  if (mode === 'create') {
    const createInput = input as AdminSkillCreateInput;
    const marketStatus = optionalFormText(form, 'marketStatus', 32);
    if (marketStatus) {
      createInput.marketStatus = readMarketStatus(marketStatus);
    }
    const reviewStatus = optionalFormText(form, 'reviewStatus', 32);
    if (reviewStatus) {
      createInput.reviewStatus = readReviewStatus(reviewStatus);
    }
  }
}

function mergeSharedPackageFormFields(input: AdminSkillPackageCreateInput | AdminSkillPackageUpdateInput, form: FormData): void {
  for (const [key, maxLength] of [
    ['summary', 512],
    ['description', 4000],
    ['icon', 255],
    ['coverImage', 255],
    ['categoryId', 128],
  ] as const) {
    const value = optionalFormText(form, key, maxLength);
    if (value !== undefined) {
      input[key] = value;
    }
  }
  const sortWeight = optionalFormInteger(form, 'sortWeight');
  if (sortWeight !== undefined) {
    input.sortWeight = sortWeight;
  }
  for (const key of ['enabled', 'featured'] as const) {
    const value = optionalFormBoolean(form, key);
    if (value !== undefined) {
      input[key] = value;
    }
  }
  const tags = splitCsvFormField(form, 'tags');
  if (tags.length > 0) {
    input.tags = tags;
  }
}

function mergeSharedAssetFormFields(input: AdminSkillAssetCreateInput | AdminSkillAssetUpdateInput, form: FormData): void {
  const artifactId = optionalFormText(form, 'artifactId', 128);
  if (artifactId !== undefined) {
    input.artifactId = artifactId;
  }
  for (const key of ['assetType', 'width', 'height', 'fileSize', 'sortOrder', 'status'] as const) {
    const value = optionalFormInteger(form, key);
    if (value !== undefined) {
      input[key] = value;
    }
  }
  for (const [key, maxLength] of [
    ['thumbnailUrl', 1024],
    ['title', 255],
    ['altText', 512],
    ['mimeType', 128],
    ['durationSeconds', 64],
    ['publishedAt', 64],
  ] as const) {
    const value = optionalFormText(form, key, maxLength);
    if (value !== undefined) {
      input[key] = value;
    }
  }
  const assetUrl = optionalFormText(form, 'assetUrl', 1024);
  if (assetUrl !== undefined) {
    input.assetUrl = assetUrl;
  }
}

function mergeSharedArtifactFormFields(input: AdminSkillArtifactCreateInput | AdminSkillArtifactUpdateInput, form: FormData): void {
  for (const key of ['artifactType', 'artifactSizeBytes', 'status'] as const) {
    const value = optionalFormInteger(form, key);
    if (value !== undefined) {
      input[key] = value;
    }
  }
  for (const [key, maxLength] of [
    ['version', 64],
    ['platformType', 128],
    ['osName', 128],
    ['artifactRef', 1024],
    ['artifactUrl', 1024],
    ['runtime', 64],
    ['licenseName', 128],
    ['checksumHash', 128],
    ['releaseNotes', 4000],
    ['publishedAt', 64],
    ['deprecatedAt', 64],
  ] as const) {
    const value = optionalFormText(form, key, maxLength);
    if (value !== undefined) {
      input[key] = value;
    }
  }
  const frameworks = splitCsvFormField(form, 'frameworks');
  if (frameworks.length > 0) {
    input.frameworks = frameworks;
  }
}

function requiredFormText(form: FormData, key: string, maxLength: number): string {
  return requiredText(formString(form, key), key, maxLength);
}

function optionalFormText(form: FormData, key: string, maxLength: number): string | undefined {
  return optionalText(formString(form, key), key, maxLength);
}

function optionalFormInteger(form: FormData, key: string): number | undefined {
  const value = optionalFormText(form, key, 32);
  if (value === undefined) {
    return undefined;
  }
  if (!/^-?\d+$/.test(value)) {
    throw new Error(`${key} must be an integer`);
  }
  const numberValue = Number(value);
  if (!Number.isSafeInteger(numberValue)) {
    throw new Error(`${key} must be an integer`);
  }
  return numberValue;
}

function optionalFormBoolean(form: FormData, key: string): boolean | undefined {
  const value = optionalFormText(form, key, 16);
  if (value === undefined) {
    return undefined;
  }
  const normalized = value.toLowerCase();
  if (['true', '1', 'yes', 'on'].includes(normalized)) {
    return true;
  }
  if (['false', '0', 'no', 'off'].includes(normalized)) {
    return false;
  }
  throw new Error(`${key} must be a boolean`);
}

function optionalJsonObjectFormField(form: FormData, key: string): JsonObject | undefined {
  const value = optionalFormText(form, key, 65_536);
  if (value === undefined) {
    return undefined;
  }
  try {
    const parsed: unknown = JSON.parse(value);
    return normalizeJsonObject(parsed, key);
  } catch (error) {
    if (error instanceof Error && error.message === `${key} must be a JSON object`) {
      throw error;
    }
    throw new Error(`${key} must be valid JSON`);
  }
}

function splitCsvFormField(form: FormData, key: string): string[] {
  const value = optionalFormText(form, key, 4096);
  if (!value) {
    return [];
  }
  return uniqueStrings(value.split(',').map((item) => item.trim()).filter(Boolean));
}

function formString(form: FormData, key: string): string | undefined {
  const value = form.get(key);
  return typeof value === 'string' ? value : undefined;
}

function requiredText(value: unknown, fieldName: string, maxLength: number): string {
  const normalized = optionalText(value, fieldName, maxLength);
  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }
  return normalized;
}

function optionalText(value: unknown, fieldName: string, maxLength: number): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (typeof value !== 'string') {
    throw new Error(`${fieldName} must be a string`);
  }
  const normalized = value.trim();
  if (!normalized) {
    return undefined;
  }
  if (normalized.length > maxLength) {
    throw new Error(`${fieldName} must be at most ${maxLength} characters`);
  }
  if (/[\x00-\x1f\x7f]/.test(normalized)) {
    throw new Error(`${fieldName} must not contain control characters`);
  }
  return normalized;
}

function optionalCode(value: unknown, fieldName: string, maxLength: number): string | undefined {
  const normalized = optionalText(value, fieldName, maxLength);
  if (normalized && !/^[A-Za-z0-9_-]+$/.test(normalized)) {
    throw new Error(`${fieldName} must use ASCII letters, numbers, hyphen, or underscore`);
  }
  return normalized;
}

function normalizeNullableText(value: unknown, fieldName: string, maxLength: number): string | null | undefined {
  if (value === null) {
    return null;
  }
  return optionalText(value, fieldName, maxLength);
}

function optionalUrlOrPath(value: unknown, fieldName: string, maxLength: number): string | undefined {
  const normalized = optionalText(value, fieldName, maxLength);
  if (normalized) {
    validateUrlOrPath(normalized, fieldName);
  }
  return normalized;
}

function normalizeNullableUrlOrPath(value: unknown, fieldName: string, maxLength: number): string | null | undefined {
  if (value === null) {
    return null;
  }
  return optionalUrlOrPath(value, fieldName, maxLength);
}

function validateUrlOrPath(value: string, fieldName: string): void {
  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('artifact://') || value.startsWith('/')) {
    return;
  }
  throw new Error(`${fieldName} must be an http(s), artifact, or absolute path reference`);
}

function requiredResourceRef(value: unknown, fieldName: string): string {
  const normalized = requiredText(value, fieldName, 1024);
  validateResourceRef(normalized, fieldName);
  return normalized;
}

function optionalResourceRef(value: unknown, fieldName: string): string | undefined {
  const normalized = optionalText(value, fieldName, 1024);
  if (normalized) {
    validateResourceRef(normalized, fieldName);
  }
  return normalized;
}

function normalizeNullableResourceRef(value: unknown, fieldName: string): string | null | undefined {
  if (value === null) {
    return null;
  }
  return optionalResourceRef(value, fieldName);
}

function validateResourceRef(value: string, fieldName: string): void {
  if (
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('artifact://') ||
    value.startsWith('builtin://') ||
    value.startsWith('data/skills/') ||
    value.startsWith('/')
  ) {
    return;
  }
  throw new Error(`${fieldName} must be an http(s), builtin, artifact, data/skills, or absolute path reference`);
}

function normalizeNullableId(value: unknown): string | null | undefined {
  if (value === null) {
    return null;
  }
  const normalized = optionalText(value, 'id', 128);
  if (normalized === undefined) {
    return undefined;
  }
  if (!/^\d+$/.test(normalized) || Number(normalized) <= 0) {
    throw new Error('id must be a positive integer');
  }
  return normalized;
}

function normalizeNullableDecimal(value: unknown): string | null | undefined {
  if (value === null) {
    return null;
  }
  if (value === undefined || value === '') {
    return undefined;
  }
  const normalized = typeof value === 'number' ? String(value) : optionalText(value, 'price', 64);
  if (normalized === undefined) {
    return undefined;
  }
  const withoutFormatting = normalized.trim().replace(/^\$/, '').replace(/,/g, '');
  if (!/^\d+(?:\.\d{1,12})?$/.test(withoutFormatting)) {
    throw new Error('price must be a positive decimal amount');
  }
  return trimDecimal(withoutFormatting);
}

function normalizeCurrency(value: string): string {
  const normalized = requiredText(value, 'currency', 16).toUpperCase();
  if (!/^[A-Z]+$/.test(normalized)) {
    throw new Error('currency must be an uppercase ISO-style code');
  }
  return normalized;
}

function normalizeStringArray(values: string[] | undefined, fieldName: string): string[] {
  return uniqueStrings(values ?? []).map((item) => {
    const normalized = requiredText(item, fieldName, 64);
    if (!/^[A-Za-z0-9._:-]+$/.test(normalized)) {
      throw new Error(`${fieldName} items contain unsupported characters`);
    }
    return normalized;
  });
}

function normalizeLabelArray(values: string[] | undefined, fieldName: string): string[] {
  return uniqueStrings(values ?? []).map((item) => requiredText(item, fieldName, 64));
}

function normalizeOptionalChecksumHash(value: unknown): string | undefined {
  const normalized = optionalText(value, 'checksumHash', 128);
  if (normalized) {
    validateChecksumHash(normalized);
  }
  return normalized;
}

function normalizeNullableChecksumHash(value: unknown): string | null | undefined {
  if (value === null) {
    return null;
  }
  return normalizeOptionalChecksumHash(value);
}

function validateChecksumHash(value: string): void {
  if (!/^sha256:[a-f0-9]{64}$/.test(value)) {
    throw new Error('checksumHash must use sha256:<64 lowercase hex>');
  }
}

function normalizeObject(value: unknown, fieldName: string): JsonObject {
  return normalizeJsonObject(value, fieldName);
}

function positiveInteger(value: unknown, fieldName: string, maxValue: number): number {
  const numberValue = typeof value === 'string' ? Number(value.trim()) : value;
  if (typeof numberValue !== 'number') {
    throw new Error(`${fieldName} must be between 1 and ${maxValue}`);
  }
  if (!Number.isSafeInteger(numberValue) || numberValue < 1 || numberValue > maxValue) {
    throw new Error(`${fieldName} must be between 1 and ${maxValue}`);
  }
  return numberValue;
}

function nonNegativeInteger(value: unknown, fieldName: string, maxValue: number): number {
  const numberValue = typeof value === 'string' ? Number(value.trim()) : value;
  if (typeof numberValue !== 'number') {
    throw new Error(`${fieldName} must be between 0 and ${maxValue}`);
  }
  if (!Number.isSafeInteger(numberValue) || numberValue < 0 || numberValue > maxValue) {
    throw new Error(`${fieldName} must be between 0 and ${maxValue}`);
  }
  return numberValue;
}

function readNullableNumber(record: ApiRecord, key: string): number | null {
  const value = record[key];
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const numberValue = readNumber(record, key, Number.NaN);
  return Number.isFinite(numberValue) ? numberValue : null;
}

function readSourceType(value: string): SkillSourceType {
  const normalized = value.trim().toUpperCase();
  if (
    normalized === 'OFFICIAL' ||
    normalized === 'COMMUNITY' ||
    normalized === 'ENTERPRISE' ||
    normalized === 'PRIVATE' ||
    normalized === 'CUSTOM'
  ) {
    return normalized;
  }
  throw new Error(`Unsupported skill source type: ${value}`);
}

function readMarketStatus(value: string): SkillMarketStatus {
  const normalized = value.trim().toUpperCase();
  if (normalized === 'DRAFT' || normalized === 'PUBLISHED' || normalized === 'OFFLINE' || normalized === 'DEPRECATED') {
    return normalized;
  }
  throw new Error(`Unsupported skill market status: ${value}`);
}

function readReviewStatus(value: string): SkillReviewStatus {
  const normalized = value.trim().toUpperCase();
  if (normalized === 'PENDING' || normalized === 'APPROVED' || normalized === 'REJECTED') {
    return normalized;
  }
  throw new Error(`Unsupported skill review status: ${value}`);
}

function readVisibility(value: string): SkillVisibility {
  const normalized = value.trim().toUpperCase();
  if (normalized === 'PUBLIC' || normalized === 'PRIVATE' || normalized === 'UNLISTED') {
    return normalized;
  }
  throw new Error(`Unsupported skill visibility: ${value}`);
}

function assignOptionalCategoryType(target: AdminSkillCategoryCreateInput, value: number | undefined): void {
  if (value === undefined) {
    return;
  }
  if (value !== 19 && value !== 20) {
    throw new Error('type must be 19 or 20');
  }
  target.type = value;
}

function readRecord(record: ApiRecord, key: string): JsonObject {
  const value = record[key];
  return isRecord(value) ? normalizeJsonObject(value, key) : {};
}

function readRequiredRecord(value: unknown, message: string): ApiRecord {
  if (!isRecord(value)) {
    throw new Error(message);
  }
  return value;
}

function uniqueStrings(values: string[]): string[] {
  return Array.from(new Set(values.map((item) => item.trim()).filter(Boolean)));
}

function trimDecimal(value: string): string {
  const [wholeRaw, fractionRaw = ''] = value.split('.');
  const whole = wholeRaw.replace(/^0+(?=\d)/, '') || '0';
  const fraction = fractionRaw.replace(/0+$/g, '');
  return fraction ? `${whole}.${fraction}` : whole;
}

function pruneUndefined<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined)) as T;
}
