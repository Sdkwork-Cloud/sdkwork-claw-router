import { backendApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { AdminCouponBatchGenerateRequest, AdminCouponCreateRequest, AdminPromoCodeStatusUpdateRequest, AdminUserBalanceAdjustmentRequest, CommerceExchangeRuleUpsertRequest, CommerceRechargePackageMutationRequest, CouponBatchesCreateResult, CouponBatchesListResult, CouponCodesListResult, CouponCodesStatusUpdateResult, CouponsCreateResult, CouponsDeleteResult, CouponsListResult, CouponsUpdateResult, ExchangeRulesListResult, ExchangeRulesUpdateResult, FinanceLedgerListResult, FinanceUsageStatementsListResult, PaymentsAttemptsListResult, RechargesPackagesCreateResult, RechargesPackagesDeleteResult, RechargesPackagesListResult, RechargesPackagesUpdateResult, RechargesRecordsListResult, RechargesRecordsRetrieveResult, ReferralsStatsListResult, UsersBalanceAdjustmentsCreateResult, UsersCouponsListResult } from '../types';


export interface BillingUsersBalanceAdjustmentsCreateParams {
  xRequestId?: string;
}

export class BillingUsersBalanceAdjustmentsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Update balance */
  async create(userId: string, body: AdminUserBalanceAdjustmentRequest, params?: BillingUsersBalanceAdjustmentsCreateParams): Promise<UsersBalanceAdjustmentsCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': { value: params?.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<UsersBalanceAdjustmentsCreateResult>(backendApiPath(`/billing/users/${serializePathParameter(userId, { name: 'userId', style: 'simple', explode: false })}/balance_adjustments`), body, undefined, requestHeaders, 'application/json');
  }
}

export interface BillingUsersCouponsListParams {
  userId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
  cursor?: string;
}

export class BillingUsersCouponsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List redemption records */
  async list(params?: BillingUsersCouponsListParams): Promise<UsersCouponsListResult> {
    const query = buildQueryString([
      { name: 'user_id', value: params?.userId, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<UsersCouponsListResult>(appendQueryString(backendApiPath(`/billing/users/coupons`), query));
  }
}

export class BillingUsersApi {
  private client: HttpClient;
  public readonly coupons: BillingUsersCouponsApi;
  public readonly balanceAdjustments: BillingUsersBalanceAdjustmentsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.coupons = new BillingUsersCouponsApi(client);
    this.balanceAdjustments = new BillingUsersBalanceAdjustmentsApi(client);
  }

}

export class BillingReferralsStatsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List referral stats */
  async list(): Promise<ReferralsStatsListResult> {
    return this.client.get<ReferralsStatsListResult>(backendApiPath(`/billing/referrals/stats`));
  }
}

export class BillingReferralsApi {
  private client: HttpClient;
  public readonly stats: BillingReferralsStatsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.stats = new BillingReferralsStatsApi(client);
  }

}

export interface BillingRechargesRecordsListParams {
  userId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
  cursor?: string;
}

export class BillingRechargesRecordsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List recharge records */
  async list(params?: BillingRechargesRecordsListParams): Promise<RechargesRecordsListResult> {
    const query = buildQueryString([
      { name: 'user_id', value: params?.userId, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<RechargesRecordsListResult>(appendQueryString(backendApiPath(`/billing/recharges/records`), query));
  }

/** Retrieve recharge record */
  async retrieve(orderNo: string): Promise<RechargesRecordsRetrieveResult> {
    return this.client.get<RechargesRecordsRetrieveResult>(backendApiPath(`/billing/recharges/records/${serializePathParameter(orderNo, { name: 'orderNo', style: 'simple', explode: false })}`));
  }
}

export interface BillingRechargesPackagesListParams {
  status?: string;
}

export interface BillingRechargesPackagesCreateParams {
  xRequestId?: string;
}

export interface BillingRechargesPackagesUpdateParams {
  xRequestId?: string;
}

export class BillingRechargesPackagesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List recharge packages */
  async list(params?: BillingRechargesPackagesListParams): Promise<RechargesPackagesListResult> {
    const query = buildQueryString([
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<RechargesPackagesListResult>(appendQueryString(backendApiPath(`/billing/recharges/packages`), query));
  }

/** Create recharge package */
  async create(body: CommerceRechargePackageMutationRequest, params?: BillingRechargesPackagesCreateParams): Promise<RechargesPackagesCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': { value: params?.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<RechargesPackagesCreateResult>(backendApiPath(`/billing/recharges/packages`), body, undefined, requestHeaders, 'application/json');
  }

/** Delete recharge package */
  async delete(packageId: string): Promise<RechargesPackagesDeleteResult> {
    return this.client.delete<RechargesPackagesDeleteResult>(backendApiPath(`/billing/recharges/packages/${serializePathParameter(packageId, { name: 'packageId', style: 'simple', explode: false })}`));
  }

/** Update recharge package */
  async update(packageId: string, body: CommerceRechargePackageMutationRequest, params?: BillingRechargesPackagesUpdateParams): Promise<RechargesPackagesUpdateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': { value: params?.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.put<RechargesPackagesUpdateResult>(backendApiPath(`/billing/recharges/packages/${serializePathParameter(packageId, { name: 'packageId', style: 'simple', explode: false })}`), body, undefined, requestHeaders, 'application/json');
  }
}

export class BillingRechargesApi {
  private client: HttpClient;
  public readonly packages: BillingRechargesPackagesApi;
  public readonly records: BillingRechargesRecordsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.packages = new BillingRechargesPackagesApi(client);
    this.records = new BillingRechargesRecordsApi(client);
  }

}

export interface BillingPaymentsAttemptsListParams {
  provider?: string;
  status?: string;
  page?: number;
  pageSize?: number;
  cursor?: string;
}

export class BillingPaymentsAttemptsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List payment attempts */
  async list(params?: BillingPaymentsAttemptsListParams): Promise<PaymentsAttemptsListResult> {
    const query = buildQueryString([
      { name: 'provider', value: params?.provider, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<PaymentsAttemptsListResult>(appendQueryString(backendApiPath(`/billing/payments/attempts`), query));
  }
}

export class BillingPaymentsApi {
  private client: HttpClient;
  public readonly attempts: BillingPaymentsAttemptsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.attempts = new BillingPaymentsAttemptsApi(client);
  }

}

export interface BillingFinanceUsageStatementsListParams {
  page?: number;
  pageSize?: number;
  q?: string;
  status?: string;
  startTime?: string;
  endTime?: string;
}

export class BillingFinanceUsageStatementsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List billing */
  async list(params?: BillingFinanceUsageStatementsListParams): Promise<FinanceUsageStatementsListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'start_time', value: params?.startTime, style: 'form', explode: true, allowReserved: false },
      { name: 'end_time', value: params?.endTime, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<FinanceUsageStatementsListResult>(appendQueryString(backendApiPath(`/billing/finance/usage_statements`), query));
  }
}

export interface BillingFinanceLedgerListParams {
  page?: number;
  pageSize?: number;
  q?: string;
  status?: string;
  startTime?: string;
  endTime?: string;
}

export class BillingFinanceLedgerApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List transactions */
  async list(params?: BillingFinanceLedgerListParams): Promise<FinanceLedgerListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'start_time', value: params?.startTime, style: 'form', explode: true, allowReserved: false },
      { name: 'end_time', value: params?.endTime, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<FinanceLedgerListResult>(appendQueryString(backendApiPath(`/billing/finance/ledger`), query));
  }
}

export class BillingFinanceApi {
  private client: HttpClient;
  public readonly ledger: BillingFinanceLedgerApi;
  public readonly usageStatements: BillingFinanceUsageStatementsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.ledger = new BillingFinanceLedgerApi(client);
    this.usageStatements = new BillingFinanceUsageStatementsApi(client);
  }

}

export interface BillingExchangeRulesListParams {
  sourceAssetType?: string;
  targetAssetType?: string;
  status?: string;
}

export interface BillingExchangeRulesUpdateParams {
  xRequestId?: string;
}

export class BillingExchangeRulesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List exchange rules */
  async list(params?: BillingExchangeRulesListParams): Promise<ExchangeRulesListResult> {
    const query = buildQueryString([
      { name: 'source_asset_type', value: params?.sourceAssetType, style: 'form', explode: true, allowReserved: false },
      { name: 'target_asset_type', value: params?.targetAssetType, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<ExchangeRulesListResult>(appendQueryString(backendApiPath(`/billing/exchange_rules`), query));
  }

/** Upsert exchange rule */
  async update(body: CommerceExchangeRuleUpsertRequest, params?: BillingExchangeRulesUpdateParams): Promise<ExchangeRulesUpdateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': { value: params?.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.put<ExchangeRulesUpdateResult>(backendApiPath(`/billing/exchange_rules`), body, undefined, requestHeaders, 'application/json');
  }
}

export interface BillingCouponsListParams {
  status?: string;
  page?: number;
  pageSize?: number;
  cursor?: string;
}

export interface BillingCouponsCreateParams {
  xRequestId?: string;
}

export interface BillingCouponsUpdateParams {
  xRequestId?: string;
}

export class BillingCouponsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List coupons */
  async list(params?: BillingCouponsListParams): Promise<CouponsListResult> {
    const query = buildQueryString([
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CouponsListResult>(appendQueryString(backendApiPath(`/billing/coupons`), query));
  }

/** Create coupon */
  async create(body: AdminCouponCreateRequest, params?: BillingCouponsCreateParams): Promise<CouponsCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': { value: params?.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<CouponsCreateResult>(backendApiPath(`/billing/coupons`), body, undefined, requestHeaders, 'application/json');
  }

/** Delete coupon */
  async delete(couponId: string): Promise<CouponsDeleteResult> {
    return this.client.delete<CouponsDeleteResult>(backendApiPath(`/billing/coupons/${serializePathParameter(couponId, { name: 'couponId', style: 'simple', explode: false })}`));
  }

/** Update coupon */
  async update(couponId: string, body: AdminCouponCreateRequest, params?: BillingCouponsUpdateParams): Promise<CouponsUpdateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': { value: params?.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.put<CouponsUpdateResult>(backendApiPath(`/billing/coupons/${serializePathParameter(couponId, { name: 'couponId', style: 'simple', explode: false })}`), body, undefined, requestHeaders, 'application/json');
  }
}

export interface BillingCouponCodesStatusUpdateParams {
  xRequestId?: string;
}

export class BillingCouponCodesStatusApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Update promo code status */
  async update(codeId: string, body: AdminPromoCodeStatusUpdateRequest, params?: BillingCouponCodesStatusUpdateParams): Promise<CouponCodesStatusUpdateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': { value: params?.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.patch<CouponCodesStatusUpdateResult>(backendApiPath(`/billing/coupon_codes/${serializePathParameter(codeId, { name: 'codeId', style: 'simple', explode: false })}/status`), body, undefined, requestHeaders, 'application/json');
  }
}

export interface BillingCouponCodesListParams {
  couponId?: string;
  batchId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
  cursor?: string;
}

export class BillingCouponCodesApi {
  private client: HttpClient;
  public readonly status: BillingCouponCodesStatusApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.status = new BillingCouponCodesStatusApi(client);
  }


/** List promo codes */
  async list(params?: BillingCouponCodesListParams): Promise<CouponCodesListResult> {
    const query = buildQueryString([
      { name: 'coupon_id', value: params?.couponId, style: 'form', explode: true, allowReserved: false },
      { name: 'batch_id', value: params?.batchId, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CouponCodesListResult>(appendQueryString(backendApiPath(`/billing/coupon_codes`), query));
  }
}

export interface BillingCouponBatchesListParams {
  couponId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
  cursor?: string;
}

export interface BillingCouponBatchesCreateParams {
  xRequestId?: string;
}

export class BillingCouponBatchesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List batches */
  async list(params?: BillingCouponBatchesListParams): Promise<CouponBatchesListResult> {
    const query = buildQueryString([
      { name: 'coupon_id', value: params?.couponId, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CouponBatchesListResult>(appendQueryString(backendApiPath(`/billing/coupon_batches`), query));
  }

/** Generate batch */
  async create(body: AdminCouponBatchGenerateRequest, params?: BillingCouponBatchesCreateParams): Promise<CouponBatchesCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': { value: params?.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<CouponBatchesCreateResult>(backendApiPath(`/billing/coupon_batches`), body, undefined, requestHeaders, 'application/json');
  }
}

export class BillingApi {
  private client: HttpClient;
  public readonly couponBatches: BillingCouponBatchesApi;
  public readonly couponCodes: BillingCouponCodesApi;
  public readonly coupons: BillingCouponsApi;
  public readonly exchangeRules: BillingExchangeRulesApi;
  public readonly finance: BillingFinanceApi;
  public readonly payments: BillingPaymentsApi;
  public readonly recharges: BillingRechargesApi;
  public readonly referrals: BillingReferralsApi;
  public readonly users: BillingUsersApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.couponBatches = new BillingCouponBatchesApi(client);
    this.couponCodes = new BillingCouponCodesApi(client);
    this.coupons = new BillingCouponsApi(client);
    this.exchangeRules = new BillingExchangeRulesApi(client);
    this.finance = new BillingFinanceApi(client);
    this.payments = new BillingPaymentsApi(client);
    this.recharges = new BillingRechargesApi(client);
    this.referrals = new BillingReferralsApi(client);
    this.users = new BillingUsersApi(client);
  }

}

export function createBillingApi(client: HttpClient): BillingApi {
  return new BillingApi(client);
}

function appendQueryString(path: string, rawQueryString: string): string {
  const query = rawQueryString.replace(/^\?+/, '');
  if (!query) {
    return path;
  }
  return path.includes('?') ? `${path}&${query}` : `${path}?${query}`;
}

interface PathParameterSpec {
  name: string;
  style: string;
  explode: boolean;
}

function serializePathParameter(value: unknown, spec: PathParameterSpec): string {
  if (value === undefined || value === null) {
    return '';
  }

  const style = spec.style || 'simple';
  if (Array.isArray(value)) {
    return serializePathArray(spec.name, value, style, spec.explode);
  }
  if (typeof value === 'object') {
    return serializePathObject(spec.name, value as Record<string, unknown>, style, spec.explode);
  }
  return pathPrefix(spec.name, style, false) + encodePathValue(serializePathPrimitive(value));
}

function serializePathArray(name: string, values: unknown[], style: string, explode: boolean): string {
  const serialized = values
    .filter((item) => item !== undefined && item !== null)
    .map((item) => encodePathValue(serializePathPrimitive(item)));
  if (serialized.length === 0) {
    return pathPrefix(name, style, false);
  }
  if (style === 'matrix') {
    return explode
      ? serialized.map((item) => `;${name}=${item}`).join('')
      : `;${name}=${serialized.join(',')}`;
  }
  return pathPrefix(name, style, false) + serialized.join(explode ? '.' : ',');
}

function serializePathObject(name: string, value: Record<string, unknown>, style: string, explode: boolean): string {
  const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== undefined && entryValue !== null);
  if (entries.length === 0) {
    return pathPrefix(name, style, true);
  }
  if (style === 'matrix') {
    return explode
      ? entries.map(([key, entryValue]) => `;${encodePathValue(key)}=${encodePathValue(serializePathPrimitive(entryValue))}`).join('')
      : `;${name}=${entries.flatMap(([key, entryValue]) => [encodePathValue(key), encodePathValue(serializePathPrimitive(entryValue))]).join(',')}`;
  }
  const serialized = explode
    ? entries.map(([key, entryValue]) => `${encodePathValue(key)}=${encodePathValue(serializePathPrimitive(entryValue))}`).join(style === 'label' ? '.' : ',')
    : entries.flatMap(([key, entryValue]) => [encodePathValue(key), encodePathValue(serializePathPrimitive(entryValue))]).join(',');
  return pathPrefix(name, style, true) + serialized;
}

function pathPrefix(name: string, style: string, _objectValue: boolean): string {
  if (style === 'label') return '.';
  if (style === 'matrix') return `;${name}`;
  return '';
}

function encodePathValue(value: string): string {
  return encodeURIComponent(value);
}

function serializePathPrimitive(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
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
  headers: Record<string, HeaderParameterSpec | undefined>,
  cookies: Record<string, HeaderParameterSpec | undefined> = {},
): Record<string, string> | undefined {
  const requestHeaders: Record<string, string> = {};

  for (const [name, parameter] of Object.entries(headers)) {
    const serialized = serializeParameterValue(parameter);
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

interface HeaderParameterSpec {
  value: unknown;
  style: string;
  explode: boolean;
  contentType?: string;
}

function buildCookieHeader(cookies: Record<string, HeaderParameterSpec | undefined>): string | undefined {
  const pairs: string[] = [];
  for (const [name, parameter] of Object.entries(cookies)) {
    const serialized = serializeParameterValue(parameter);
    if (serialized !== undefined) {
      pairs.push(`${encodeURIComponent(name)}=${encodeURIComponent(serialized)}`);
    }
  }
  return pairs.length > 0 ? pairs.join('; ') : undefined;
}

function serializeParameterValue(parameter: HeaderParameterSpec | undefined): string | undefined {
  const value = parameter?.value;
  if (value === undefined || value === null) {
    return undefined;
  }
  if (parameter?.contentType) {
    return JSON.stringify(value);
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (Array.isArray(value)) {
    return value.map((item) => serializeHeaderPrimitive(item)).join(',');
  }
  if (typeof value === 'object' && value !== null) {
    return serializeHeaderObject(value as Record<string, unknown>, parameter?.explode === true);
  }
  return serializeHeaderPrimitive(value);
}

function serializeHeaderObject(value: Record<string, unknown>, explode: boolean): string {
  const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== undefined && entryValue !== null);
  if (explode) {
    return entries.map(([key, entryValue]) => `${key}=${serializeHeaderPrimitive(entryValue)}`).join(',');
  }
  return entries.flatMap(([key, entryValue]) => [key, serializeHeaderPrimitive(entryValue)]).join(',');
}

function serializeHeaderPrimitive(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString();
  }
  return String(value);
}
