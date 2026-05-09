import { backendApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { AdminSkillArtifactCreateRequest, AdminSkillArtifactUpdateRequest, AdminSkillAssetCreateRequest, AdminSkillAssetUpdateRequest, AdminSkillCategoryCreateRequest, AdminSkillCreateRequest, AdminSkillListRequest, AdminSkillPackageCreateRequest, AdminSkillPackageListRequest, AdminSkillPackageUpdateRequest, AdminSkillReviewRequest, AdminSkillUpdateRequest, ApproveSkillResult, CreateSkillArtifactResult, CreateSkillAssetResult, CreateSkillCategoryResult, CreateSkillPackageResult, CreateSkillResult, DeleteSkillArtifactResult, DeleteSkillAssetResult, DeleteSkillPackageResult, DeleteSkillResult, DisableSkillPackageResult, DisableSkillResult, EnableSkillPackageResult, EnableSkillResult, FetchSkillArtifactsResult, FetchSkillAssetsResult, FetchSkillCategoriesResult, FetchSkillPackagesResult, FetchSkillsResult, GetSkillArtifactResult, GetSkillAssetResult, GetSkillPackageResult, GetSkillResult, OfflineSkillResult, OperationRequest, PublishSkillResult, RejectSkillResult, UpdateSkillArtifactResult, UpdateSkillAssetResult, UpdateSkillPackageResult, UpdateSkillResult } from '../types';


export class SkillApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

/** Create skill */
  async createSkill(body: AdminSkillCreateRequest, xRequestId?: string): Promise<CreateSkillResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.post<CreateSkillResult>(backendApiPath(`/skill`), body, undefined, requestHeaders, 'application/json');
  }

/** List skill categories */
  async fetchSkillCategories(): Promise<FetchSkillCategoriesResult> {
    return this.client.get<FetchSkillCategoriesResult>(backendApiPath(`/skill/categories`));
  }

/** Create skill category */
  async createSkillCategory(body: AdminSkillCategoryCreateRequest, xRequestId?: string): Promise<CreateSkillCategoryResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.post<CreateSkillCategoryResult>(backendApiPath(`/skill/categories`), body, undefined, requestHeaders, 'application/json');
  }

/** List skills */
  async fetchSkills(body: AdminSkillListRequest): Promise<FetchSkillsResult> {
    return this.client.post<FetchSkillsResult>(backendApiPath(`/skill/list`), body, undefined, undefined, 'application/json');
  }

/** Create skill package */
  async createSkillPackage(body: AdminSkillPackageCreateRequest, xRequestId?: string): Promise<CreateSkillPackageResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.post<CreateSkillPackageResult>(backendApiPath(`/skill/package`), body, undefined, requestHeaders, 'application/json');
  }

/** List skill packages */
  async fetchSkillPackages(body: AdminSkillPackageListRequest): Promise<FetchSkillPackagesResult> {
    return this.client.post<FetchSkillPackagesResult>(backendApiPath(`/skill/package/list`), body, undefined, undefined, 'application/json');
  }

/** Delete skill package */
  async deleteSkillPackage(packageId: string | number): Promise<DeleteSkillPackageResult> {
    return this.client.delete<DeleteSkillPackageResult>(backendApiPath(`/skill/package/${packageId}`));
  }

/** Get skill package */
  async getSkillPackage(packageId: string | number): Promise<GetSkillPackageResult> {
    return this.client.get<GetSkillPackageResult>(backendApiPath(`/skill/package/${packageId}`));
  }

/** Update skill package */
  async updateSkillPackage(packageId: string | number, body: AdminSkillPackageUpdateRequest, xRequestId?: string): Promise<UpdateSkillPackageResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.put<UpdateSkillPackageResult>(backendApiPath(`/skill/package/${packageId}`), body, undefined, requestHeaders, 'application/json');
  }

/** Disable skill package */
  async disableSkillPackage(packageId: string | number, body?: OperationRequest, xRequestId?: string): Promise<DisableSkillPackageResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.post<DisableSkillPackageResult>(backendApiPath(`/skill/package/${packageId}/disable`), body, undefined, requestHeaders, 'application/json');
  }

/** Enable skill package */
  async enableSkillPackage(packageId: string | number, body?: OperationRequest, xRequestId?: string): Promise<EnableSkillPackageResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.post<EnableSkillPackageResult>(backendApiPath(`/skill/package/${packageId}/enable`), body, undefined, requestHeaders, 'application/json');
  }

/** Delete skill */
  async deleteSkill(skillId: string | number): Promise<DeleteSkillResult> {
    return this.client.delete<DeleteSkillResult>(backendApiPath(`/skill/${skillId}`));
  }

/** Get skill */
  async getSkill(skillId: string | number): Promise<GetSkillResult> {
    return this.client.get<GetSkillResult>(backendApiPath(`/skill/${skillId}`));
  }

/** Update skill */
  async updateSkill(skillId: string | number, body: AdminSkillUpdateRequest, xRequestId?: string): Promise<UpdateSkillResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.put<UpdateSkillResult>(backendApiPath(`/skill/${skillId}`), body, undefined, requestHeaders, 'application/json');
  }

/** List skill artifacts */
  async fetchSkillArtifacts(skillId: string | number): Promise<FetchSkillArtifactsResult> {
    return this.client.get<FetchSkillArtifactsResult>(backendApiPath(`/skill/${skillId}/artifacts`));
  }

/** Create skill artifact */
  async createSkillArtifact(skillId: string | number, body: AdminSkillArtifactCreateRequest, xRequestId?: string): Promise<CreateSkillArtifactResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.post<CreateSkillArtifactResult>(backendApiPath(`/skill/${skillId}/artifacts`), body, undefined, requestHeaders, 'application/json');
  }

/** Delete skill artifact */
  async deleteSkillArtifact(skillId: string | number, artifactId: string | number, xRequestId?: string): Promise<DeleteSkillArtifactResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.delete<DeleteSkillArtifactResult>(backendApiPath(`/skill/${skillId}/artifacts/${artifactId}`), undefined, requestHeaders);
  }

/** Get skill artifact */
  async getSkillArtifact(skillId: string | number, artifactId: string | number): Promise<GetSkillArtifactResult> {
    return this.client.get<GetSkillArtifactResult>(backendApiPath(`/skill/${skillId}/artifacts/${artifactId}`));
  }

/** Update skill artifact */
  async updateSkillArtifact(skillId: string | number, artifactId: string | number, body: AdminSkillArtifactUpdateRequest, xRequestId?: string): Promise<UpdateSkillArtifactResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.put<UpdateSkillArtifactResult>(backendApiPath(`/skill/${skillId}/artifacts/${artifactId}`), body, undefined, requestHeaders, 'application/json');
  }

/** List skill assets */
  async fetchSkillAssets(skillId: string | number): Promise<FetchSkillAssetsResult> {
    return this.client.get<FetchSkillAssetsResult>(backendApiPath(`/skill/${skillId}/assets`));
  }

/** Create skill asset */
  async createSkillAsset(skillId: string | number, body: AdminSkillAssetCreateRequest, xRequestId?: string): Promise<CreateSkillAssetResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.post<CreateSkillAssetResult>(backendApiPath(`/skill/${skillId}/assets`), body, undefined, requestHeaders, 'application/json');
  }

/** Delete skill asset */
  async deleteSkillAsset(skillId: string | number, assetId: string | number, xRequestId?: string): Promise<DeleteSkillAssetResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.delete<DeleteSkillAssetResult>(backendApiPath(`/skill/${skillId}/assets/${assetId}`), undefined, requestHeaders);
  }

/** Get skill asset */
  async getSkillAsset(skillId: string | number, assetId: string | number): Promise<GetSkillAssetResult> {
    return this.client.get<GetSkillAssetResult>(backendApiPath(`/skill/${skillId}/assets/${assetId}`));
  }

/** Update skill asset */
  async updateSkillAsset(skillId: string | number, assetId: string | number, body: AdminSkillAssetUpdateRequest, xRequestId?: string): Promise<UpdateSkillAssetResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.put<UpdateSkillAssetResult>(backendApiPath(`/skill/${skillId}/assets/${assetId}`), body, undefined, requestHeaders, 'application/json');
  }

/** Disable skill */
  async disableSkill(skillId: string | number, body?: OperationRequest, xRequestId?: string): Promise<DisableSkillResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.post<DisableSkillResult>(backendApiPath(`/skill/${skillId}/disable`), body, undefined, requestHeaders, 'application/json');
  }

/** Enable skill */
  async enableSkill(skillId: string | number, body?: OperationRequest, xRequestId?: string): Promise<EnableSkillResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.post<EnableSkillResult>(backendApiPath(`/skill/${skillId}/enable`), body, undefined, requestHeaders, 'application/json');
  }

/** Offline skill */
  async offlineSkill(skillId: string | number, body?: OperationRequest, xRequestId?: string): Promise<OfflineSkillResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.post<OfflineSkillResult>(backendApiPath(`/skill/${skillId}/offline`), body, undefined, requestHeaders, 'application/json');
  }

/** Publish skill */
  async publishSkill(skillId: string | number, body?: OperationRequest, xRequestId?: string): Promise<PublishSkillResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.post<PublishSkillResult>(backendApiPath(`/skill/${skillId}/publish`), body, undefined, requestHeaders, 'application/json');
  }

/** Approve skill */
  async approveSkill(skillId: string | number, body: AdminSkillReviewRequest, xRequestId?: string): Promise<ApproveSkillResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.post<ApproveSkillResult>(backendApiPath(`/skill/${skillId}/review/approve`), body, undefined, requestHeaders, 'application/json');
  }

/** Reject skill */
  async rejectSkill(skillId: string | number, body: AdminSkillReviewRequest, xRequestId?: string): Promise<RejectSkillResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.post<RejectSkillResult>(backendApiPath(`/skill/${skillId}/review/reject`), body, undefined, requestHeaders, 'application/json');
  }
}

export function createSkillApi(client: HttpClient): SkillApi {
  return new SkillApi(client);
}

function appendQueryString(path: string, rawQueryString: string): string {
  const query = rawQueryString.replace(/^\?+/, '');
  if (!query) {
    return path;
  }
  return path.includes('?') ? `${path}&${query}` : `${path}?${query}`;
}


function buildRequestHeaders(
  headers: Record<string, unknown | undefined>,
  cookies: Record<string, unknown | undefined> = {},
): Record<string, string> | undefined {
  const requestHeaders: Record<string, string> = {};

  for (const [name, value] of Object.entries(headers)) {
    const serialized = serializeParameterValue(value);
    if (serialized !== undefined) {
      requestHeaders[name] = serialized;
    }
  }

  const cookieHeader = buildCookieHeader(cookies);
  if (cookieHeader) {
    requestHeaders.Cookie = requestHeaders.Cookie
      ? `${requestHeaders.Cookie}; ${cookieHeader}`
      : cookieHeader;
  }

  return Object.keys(requestHeaders).length > 0 ? requestHeaders : undefined;
}

function buildCookieHeader(cookies: Record<string, unknown | undefined>): string | undefined {
  const pairs: string[] = [];
  for (const [name, value] of Object.entries(cookies)) {
    const serialized = serializeParameterValue(value);
    if (serialized !== undefined) {
      pairs.push(`${encodeURIComponent(name)}=${encodeURIComponent(serialized)}`);
    }
  }
  return pairs.length > 0 ? pairs.join('; ') : undefined;
}

function serializeParameterValue(value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (Array.isArray(value)) {
    return value
      .map((item) => serializeParameterValue(item))
      .filter((item): item is string => item !== undefined)
      .join(',');
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}
