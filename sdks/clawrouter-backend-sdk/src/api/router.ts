import { backendApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { AddAnnouncementResult, AddFirewallResult, AddGroupResult, AddIpLimitResult, AddModelLimitResult, AddTokenLimitResult, AddVendorResult, AdminAccessGroupCreateRequest, AdminAccessGroupUpdateRequest, AdminAnnouncementCreateRequest, AdminAnnouncementUpdateRequest, AdminCouponBatchGenerateRequest, AdminFirewallRuleCreateRequest, AdminIpLimitCreateRequest, AdminModelCatalogSyncRequest, AdminModelLimitCreateRequest, AdminModelVendorCreateRequest, AdminPromoCodeStatusUpdateRequest, AdminTokenLimitCreateRequest, AdminUserBalanceAdjustmentRequest, FetchAlertsResult, FetchAnnouncementsResult, FetchBatchesResult, FetchFirewallsResult, FetchIpLimitsResult, FetchModelRankingRefreshJobsResult, FetchModelRankingRefreshStatusResult, FetchModelRankingsResult, FetchPerformanceDataResult, FetchReferralStatsResult, FetchVendorsResult, GenerateBatchResult, ModelRankingRefreshTriggerRequest, PlusApiResult, SyncVendorsAndModelsResult, TriggerModelRankingRefreshResult, UpdateAnnouncementResult, UpdateBalanceResult, UpdateGroupResult, UpdatePromoCodeStatusResult } from '../types';


export class RouterApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

/** List groups */
  async fetchGroups(pageNo?: number, pageSize?: number, keyword?: string, status?: string, startTime?: string, endTime?: string): Promise<PlusApiResult> {
    const query = buildQueryString([
      { name: 'pageNo', value: pageNo, style: 'form', explode: true, allowReserved: false },
      { name: 'pageSize', value: pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'keyword', value: keyword, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: status, style: 'form', explode: true, allowReserved: false },
      { name: 'startTime', value: startTime, style: 'form', explode: true, allowReserved: false },
      { name: 'endTime', value: endTime, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<PlusApiResult>(appendQueryString(backendApiPath(`/router/access-groups`), query));
  }

/** Create group */
  async addGroup(body: AdminAccessGroupCreateRequest, xRequestId?: string): Promise<AddGroupResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.post<AddGroupResult>(backendApiPath(`/router/access-groups`), body, undefined, requestHeaders, 'application/json');
  }

/** Delete group */
  async deleteGroup(groupId: string | number): Promise<PlusApiResult> {
    return this.client.delete<PlusApiResult>(backendApiPath(`/router/access-groups/${groupId}`));
  }

/** Update group */
  async updateGroup(groupId: string | number, body: AdminAccessGroupUpdateRequest, xRequestId?: string): Promise<UpdateGroupResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.patch<UpdateGroupResult>(backendApiPath(`/router/access-groups/${groupId}`), body, undefined, requestHeaders, 'application/json');
  }

/** List announcements */
  async fetchAnnouncements(pageNo?: number, pageSize?: number, keyword?: string, status?: string, startTime?: string, endTime?: string): Promise<FetchAnnouncementsResult> {
    const query = buildQueryString([
      { name: 'pageNo', value: pageNo, style: 'form', explode: true, allowReserved: false },
      { name: 'pageSize', value: pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'keyword', value: keyword, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: status, style: 'form', explode: true, allowReserved: false },
      { name: 'startTime', value: startTime, style: 'form', explode: true, allowReserved: false },
      { name: 'endTime', value: endTime, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<FetchAnnouncementsResult>(appendQueryString(backendApiPath(`/router/announcements`), query));
  }

/** Create announcement */
  async addAnnouncement(body: AdminAnnouncementCreateRequest, xRequestId?: string): Promise<AddAnnouncementResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.post<AddAnnouncementResult>(backendApiPath(`/router/announcements`), body, undefined, requestHeaders, 'application/json');
  }

/** Delete announcement */
  async deleteAnnouncement(announcementId: string | number): Promise<PlusApiResult> {
    return this.client.delete<PlusApiResult>(backendApiPath(`/router/announcements/${announcementId}`));
  }

/** Update announcement */
  async updateAnnouncement(announcementId: string | number, body: AdminAnnouncementUpdateRequest, xRequestId?: string): Promise<UpdateAnnouncementResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.patch<UpdateAnnouncementResult>(backendApiPath(`/router/announcements/${announcementId}`), body, undefined, requestHeaders, 'application/json');
  }

/** List batches */
  async fetchBatches(pageNo?: number, pageSize?: number, keyword?: string, status?: string, startTime?: string, endTime?: string): Promise<FetchBatchesResult> {
    const query = buildQueryString([
      { name: 'pageNo', value: pageNo, style: 'form', explode: true, allowReserved: false },
      { name: 'pageSize', value: pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'keyword', value: keyword, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: status, style: 'form', explode: true, allowReserved: false },
      { name: 'startTime', value: startTime, style: 'form', explode: true, allowReserved: false },
      { name: 'endTime', value: endTime, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<FetchBatchesResult>(appendQueryString(backendApiPath(`/router/coupon-batches`), query));
  }

/** Generate batch */
  async generateBatch(body: AdminCouponBatchGenerateRequest, xRequestId?: string): Promise<GenerateBatchResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.post<GenerateBatchResult>(backendApiPath(`/router/coupon-batches/generate`), body, undefined, requestHeaders, 'application/json');
  }

/** List promo codes */
  async fetchPromoCodes(pageNo?: number, pageSize?: number, keyword?: string, status?: string, startTime?: string, endTime?: string): Promise<PlusApiResult> {
    const query = buildQueryString([
      { name: 'pageNo', value: pageNo, style: 'form', explode: true, allowReserved: false },
      { name: 'pageSize', value: pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'keyword', value: keyword, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: status, style: 'form', explode: true, allowReserved: false },
      { name: 'startTime', value: startTime, style: 'form', explode: true, allowReserved: false },
      { name: 'endTime', value: endTime, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<PlusApiResult>(appendQueryString(backendApiPath(`/router/coupon-codes`), query));
  }

/** Update promo code status */
  async updatePromoCodeStatus(promoCodeId: string | number, body: AdminPromoCodeStatusUpdateRequest, xRequestId?: string): Promise<UpdatePromoCodeStatusResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.patch<UpdatePromoCodeStatusResult>(backendApiPath(`/router/coupon-codes/${promoCodeId}/status`), body, undefined, requestHeaders, 'application/json');
  }

/** List billing */
  async fetchBilling(pageNo?: number, pageSize?: number, keyword?: string, status?: string, startTime?: string, endTime?: string): Promise<PlusApiResult> {
    const query = buildQueryString([
      { name: 'pageNo', value: pageNo, style: 'form', explode: true, allowReserved: false },
      { name: 'pageSize', value: pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'keyword', value: keyword, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: status, style: 'form', explode: true, allowReserved: false },
      { name: 'startTime', value: startTime, style: 'form', explode: true, allowReserved: false },
      { name: 'endTime', value: endTime, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<PlusApiResult>(appendQueryString(backendApiPath(`/router/finance/usage-statements`), query));
  }

/** List firewalls */
  async fetchFirewalls(pageNo?: number, pageSize?: number, keyword?: string, status?: string, startTime?: string, endTime?: string): Promise<FetchFirewallsResult> {
    const query = buildQueryString([
      { name: 'pageNo', value: pageNo, style: 'form', explode: true, allowReserved: false },
      { name: 'pageSize', value: pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'keyword', value: keyword, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: status, style: 'form', explode: true, allowReserved: false },
      { name: 'startTime', value: startTime, style: 'form', explode: true, allowReserved: false },
      { name: 'endTime', value: endTime, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<FetchFirewallsResult>(appendQueryString(backendApiPath(`/router/firewall/rules`), query));
  }

/** Create firewall */
  async addFirewall(body: AdminFirewallRuleCreateRequest, xRequestId?: string): Promise<AddFirewallResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.post<AddFirewallResult>(backendApiPath(`/router/firewall/rules`), body, undefined, requestHeaders, 'application/json');
  }

/** Delete firewall */
  async removeFirewall(ruleId: string | number): Promise<PlusApiResult> {
    return this.client.delete<PlusApiResult>(backendApiPath(`/router/firewall/rules/${ruleId}`));
  }

/** List model rankings */
  async fetchModelRankings(rankScope?: string, vendorCode?: string, modality?: string, searchQuery?: string, limit?: number): Promise<FetchModelRankingsResult> {
    const query = buildQueryString([
      { name: 'rankScope', value: rankScope, style: 'form', explode: true, allowReserved: false },
      { name: 'vendorCode', value: vendorCode, style: 'form', explode: true, allowReserved: false },
      { name: 'modality', value: modality, style: 'form', explode: true, allowReserved: false },
      { name: 'searchQuery', value: searchQuery, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<FetchModelRankingsResult>(appendQueryString(backendApiPath(`/router/model-rankings`), query));
  }

/** List model ranking refresh jobs */
  async fetchModelRankingRefreshJobs(rankScope?: string, limit?: number): Promise<FetchModelRankingRefreshJobsResult> {
    const query = buildQueryString([
      { name: 'rankScope', value: rankScope, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<FetchModelRankingRefreshJobsResult>(appendQueryString(backendApiPath(`/router/model-rankings/jobs`), query));
  }

/** Trigger model ranking refresh */
  async triggerModelRankingRefresh(body: ModelRankingRefreshTriggerRequest, xRequestId?: string): Promise<TriggerModelRankingRefreshResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.post<TriggerModelRankingRefreshResult>(backendApiPath(`/router/model-rankings/refresh`), body, undefined, requestHeaders, 'application/json');
  }

/** List model ranking refresh status */
  async fetchModelRankingRefreshStatus(rankScope?: string): Promise<FetchModelRankingRefreshStatusResult> {
    const query = buildQueryString([
      { name: 'rankScope', value: rankScope, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<FetchModelRankingRefreshStatusResult>(appendQueryString(backendApiPath(`/router/model-rankings/status`), query));
  }

/** List vendors */
  async fetchVendors(pageNo?: number, pageSize?: number, keyword?: string, status?: string, startTime?: string, endTime?: string): Promise<FetchVendorsResult> {
    const query = buildQueryString([
      { name: 'pageNo', value: pageNo, style: 'form', explode: true, allowReserved: false },
      { name: 'pageSize', value: pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'keyword', value: keyword, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: status, style: 'form', explode: true, allowReserved: false },
      { name: 'startTime', value: startTime, style: 'form', explode: true, allowReserved: false },
      { name: 'endTime', value: endTime, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<FetchVendorsResult>(appendQueryString(backendApiPath(`/router/model-vendors`), query));
  }

/** Create vendor */
  async addVendor(body: AdminModelVendorCreateRequest, xRequestId?: string): Promise<AddVendorResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.post<AddVendorResult>(backendApiPath(`/router/model-vendors`), body, undefined, requestHeaders, 'application/json');
  }

/** Sync vendors and models */
  async syncVendorsAndModels(body: AdminModelCatalogSyncRequest, xRequestId?: string): Promise<SyncVendorsAndModelsResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.post<SyncVendorsAndModelsResult>(backendApiPath(`/router/models/sync`), body, undefined, requestHeaders, 'application/json');
  }

/** List alerts */
  async fetchAlerts(pageNo?: number, pageSize?: number, keyword?: string, status?: string, startTime?: string, endTime?: string): Promise<FetchAlertsResult> {
    const query = buildQueryString([
      { name: 'pageNo', value: pageNo, style: 'form', explode: true, allowReserved: false },
      { name: 'pageSize', value: pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'keyword', value: keyword, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: status, style: 'form', explode: true, allowReserved: false },
      { name: 'startTime', value: startTime, style: 'form', explode: true, allowReserved: false },
      { name: 'endTime', value: endTime, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<FetchAlertsResult>(appendQueryString(backendApiPath(`/router/monitor/alerts`), query));
  }

/** List nodes */
  async fetchNodes(pageNo?: number, pageSize?: number, keyword?: string, status?: string, startTime?: string, endTime?: string): Promise<PlusApiResult> {
    const query = buildQueryString([
      { name: 'pageNo', value: pageNo, style: 'form', explode: true, allowReserved: false },
      { name: 'pageSize', value: pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'keyword', value: keyword, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: status, style: 'form', explode: true, allowReserved: false },
      { name: 'startTime', value: startTime, style: 'form', explode: true, allowReserved: false },
      { name: 'endTime', value: endTime, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<PlusApiResult>(appendQueryString(backendApiPath(`/router/monitor/nodes`), query));
  }

/** List performance data */
  async fetchPerformanceData(pageNo?: number, pageSize?: number, keyword?: string, status?: string, startTime?: string, endTime?: string): Promise<FetchPerformanceDataResult> {
    const query = buildQueryString([
      { name: 'pageNo', value: pageNo, style: 'form', explode: true, allowReserved: false },
      { name: 'pageSize', value: pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'keyword', value: keyword, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: status, style: 'form', explode: true, allowReserved: false },
      { name: 'startTime', value: startTime, style: 'form', explode: true, allowReserved: false },
      { name: 'endTime', value: endTime, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<FetchPerformanceDataResult>(appendQueryString(backendApiPath(`/router/monitor/performance`), query));
  }

/** List token limits */
  async fetchTokenLimits(pageNo?: number, pageSize?: number, keyword?: string, status?: string, startTime?: string, endTime?: string): Promise<PlusApiResult> {
    const query = buildQueryString([
      { name: 'pageNo', value: pageNo, style: 'form', explode: true, allowReserved: false },
      { name: 'pageSize', value: pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'keyword', value: keyword, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: status, style: 'form', explode: true, allowReserved: false },
      { name: 'startTime', value: startTime, style: 'form', explode: true, allowReserved: false },
      { name: 'endTime', value: endTime, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<PlusApiResult>(appendQueryString(backendApiPath(`/router/rate-limits/api-keys`), query));
  }

/** Create token limit */
  async addTokenLimit(body: AdminTokenLimitCreateRequest, xRequestId?: string): Promise<AddTokenLimitResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.post<AddTokenLimitResult>(backendApiPath(`/router/rate-limits/api-keys`), body, undefined, requestHeaders, 'application/json');
  }

/** List IP limits */
  async fetchIpLimits(pageNo?: number, pageSize?: number, keyword?: string, status?: string, startTime?: string, endTime?: string): Promise<FetchIpLimitsResult> {
    const query = buildQueryString([
      { name: 'pageNo', value: pageNo, style: 'form', explode: true, allowReserved: false },
      { name: 'pageSize', value: pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'keyword', value: keyword, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: status, style: 'form', explode: true, allowReserved: false },
      { name: 'startTime', value: startTime, style: 'form', explode: true, allowReserved: false },
      { name: 'endTime', value: endTime, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<FetchIpLimitsResult>(appendQueryString(backendApiPath(`/router/rate-limits/ip`), query));
  }

/** Create IP limit */
  async addIpLimit(body: AdminIpLimitCreateRequest, xRequestId?: string): Promise<AddIpLimitResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.post<AddIpLimitResult>(backendApiPath(`/router/rate-limits/ip`), body, undefined, requestHeaders, 'application/json');
  }

/** List model limits */
  async fetchModelLimits(pageNo?: number, pageSize?: number, keyword?: string, status?: string, startTime?: string, endTime?: string): Promise<PlusApiResult> {
    const query = buildQueryString([
      { name: 'pageNo', value: pageNo, style: 'form', explode: true, allowReserved: false },
      { name: 'pageSize', value: pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'keyword', value: keyword, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: status, style: 'form', explode: true, allowReserved: false },
      { name: 'startTime', value: startTime, style: 'form', explode: true, allowReserved: false },
      { name: 'endTime', value: endTime, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<PlusApiResult>(appendQueryString(backendApiPath(`/router/rate-limits/models`), query));
  }

/** Create model limit */
  async addModelLimit(body: AdminModelLimitCreateRequest, xRequestId?: string): Promise<AddModelLimitResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.post<AddModelLimitResult>(backendApiPath(`/router/rate-limits/models`), body, undefined, requestHeaders, 'application/json');
  }

/** List referral stats */
  async fetchReferralStats(pageNo?: number, pageSize?: number, keyword?: string, status?: string, startTime?: string, endTime?: string): Promise<FetchReferralStatsResult> {
    const query = buildQueryString([
      { name: 'pageNo', value: pageNo, style: 'form', explode: true, allowReserved: false },
      { name: 'pageSize', value: pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'keyword', value: keyword, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: status, style: 'form', explode: true, allowReserved: false },
      { name: 'startTime', value: startTime, style: 'form', explode: true, allowReserved: false },
      { name: 'endTime', value: endTime, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<FetchReferralStatsResult>(appendQueryString(backendApiPath(`/router/referrals/stats`), query));
  }

/** Update balance */
  async updateBalance(userId: string | number, body: AdminUserBalanceAdjustmentRequest, xRequestId?: string): Promise<UpdateBalanceResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.post<UpdateBalanceResult>(backendApiPath(`/router/users/${userId}/balance-adjustments`), body, undefined, requestHeaders, 'application/json');
  }
}

export function createRouterApi(client: HttpClient): RouterApi {
  return new RouterApi(client);
}

function appendQueryString(path: string, rawQueryString: string): string {
  const query = rawQueryString.replace(/^\?+/, '');
  if (!query) {
    return path;
  }
  return path.includes('?') ? `${path}&${query}` : `${path}?${query}`;
}

interface QueryParameterSpec {
  name: string;
  value: unknown;
  style: string;
  explode: boolean;
  allowReserved: boolean;
  contentType?: string;
}

function buildQueryString(parameters: QueryParameterSpec[]): string {
  const pairs: string[] = [];
  for (const parameter of parameters) {
    appendSerializedParameter(pairs, parameter);
  }
  return pairs.join('&');
}

function appendSerializedParameter(pairs: string[], parameter: QueryParameterSpec): void {
  if (parameter.value === undefined || parameter.value === null) {
    return;
  }

  if (parameter.contentType) {
    pairs.push(`${encodeQueryComponent(parameter.name)}=${encodeQueryValue(JSON.stringify(parameter.value), parameter.allowReserved)}`);
    return;
  }

  const style = parameter.style || 'form';
  if (style === 'deepObject') {
    appendDeepObjectParameter(pairs, parameter.name, parameter.value, parameter.allowReserved);
    return;
  }

  if (Array.isArray(parameter.value)) {
    appendArrayParameter(pairs, parameter.name, parameter.value, style, parameter.explode, parameter.allowReserved);
    return;
  }

  if (typeof parameter.value === 'object') {
    appendObjectParameter(pairs, parameter.name, parameter.value as Record<string, unknown>, style, parameter.explode, parameter.allowReserved);
    return;
  }

  pairs.push(`${encodeQueryComponent(parameter.name)}=${encodeQueryValue(serializePrimitive(parameter.value), parameter.allowReserved)}`);
}

function appendArrayParameter(
  pairs: string[],
  name: string,
  value: unknown[],
  style: string,
  explode: boolean,
  allowReserved: boolean,
): void {
  const values = value
    .filter((item) => item !== undefined && item !== null)
    .map((item) => serializePrimitive(item));
  if (values.length === 0) {
    return;
  }

  if (style === 'form' && explode) {
    for (const item of values) {
      pairs.push(`${encodeQueryComponent(name)}=${encodeQueryValue(item, allowReserved)}`);
    }
    return;
  }

  pairs.push(`${encodeQueryComponent(name)}=${encodeQueryValue(values.join(','), allowReserved)}`);
}

function appendObjectParameter(
  pairs: string[],
  name: string,
  value: Record<string, unknown>,
  style: string,
  explode: boolean,
  allowReserved: boolean,
): void {
  const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== undefined && entryValue !== null);
  if (entries.length === 0) {
    return;
  }

  if (style === 'form' && explode) {
    for (const [key, entryValue] of entries) {
      pairs.push(`${encodeQueryComponent(key)}=${encodeQueryValue(serializePrimitive(entryValue), allowReserved)}`);
    }
    return;
  }

  const serialized = entries.flatMap(([key, entryValue]) => [key, serializePrimitive(entryValue)]).join(',');
  pairs.push(`${encodeQueryComponent(name)}=${encodeQueryValue(serialized, allowReserved)}`);
}

function appendDeepObjectParameter(
  pairs: string[],
  name: string,
  value: unknown,
  allowReserved: boolean,
): void {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    pairs.push(`${encodeQueryComponent(name)}=${encodeQueryValue(serializePrimitive(value), allowReserved)}`);
    return;
  }

  for (const [key, entryValue] of Object.entries(value as Record<string, unknown>)) {
    if (entryValue === undefined || entryValue === null) {
      continue;
    }
    pairs.push(`${encodeQueryComponent(`${name}[${key}]`)}=${encodeQueryValue(serializePrimitive(entryValue), allowReserved)}`);
  }
}

function serializePrimitive(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}

function encodeQueryComponent(value: string): string {
  return encodeURIComponent(value);
}

function encodeQueryValue(value: string, allowReserved: boolean): string {
  const encoded = encodeURIComponent(value);
  if (!allowReserved) {
    return encoded;
  }
  return encoded.replace(/%3A/gi, ':')
    .replace(/%2F/gi, '/')
    .replace(/%3F/gi, '?')
    .replace(/%23/gi, '#')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
    .replace(/%40/gi, '@')
    .replace(/%21/gi, '!')
    .replace(/%24/gi, '$')
    .replace(/%26/gi, '&')
    .replace(/%27/gi, "'")
    .replace(/%28/gi, '(')
    .replace(/%29/gi, ')')
    .replace(/%2A/gi, '*')
    .replace(/%2B/gi, '+')
    .replace(/%2C/gi, ',')
    .replace(/%3B/gi, ';')
    .replace(/%3D/gi, '=');
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
