import { appApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { AccountPointsExchangeRateRetrieveResult, AccountPointsExchangesCreateResult, AccountPointsExchangesRetrieveResult, AccountPointsExchangesRulesListResult, AccountPointsHistoryListResult, AccountPointsRechargesCreateResult, AccountPointsRechargesOrdersCancelResult, AccountPointsRechargesOrdersRetrieveResult, AccountPointsRechargesPackagesListResult, AccountPointsRechargesRecordsListResult, AccountPointsRetrieveResult, AccountPointsTransfersCreateResult, AccountSummaryRetrieveResult, AccountTokensDeductionsCreateResult, AccountTokensRetrieveResult, CommerceCouponClaimRequest, CommerceCouponUsageRequest, CommerceCouponUsageRollbackRequest, CommerceEmptyCommandRequest, CommercePreflightRequest, CommerceRechargeOrderCancelRequest, CommerceVipPrivilegeSpeedUpRequest, CommerceVipPurchaseRequest, CommerceWalletCommandRequest, CouponsCatalogListResult, CouponsCatalogRetrieveResult, CouponsClaimsCreateResult, CouponsRedeemCreateResult, CouponsUsageCreateResult, CouponsUsageReversalsCreateResult, PaymentsCheckoutRetrieveResult, PaymentsRecordsListResult, PaymentsRecordsRetrieveResult, PreflightEstimatesCreateResult, PreflightPrechecksCreateResult, PreflightPreholdsCreateResult, PreflightReleasesCreateResult, PreflightSettlementsCreateResult, RedeemCodeRequest, SettlementsDashboardListResult, SubmitRechargeRequest, UsersCurrentCouponsListResult, UsersCurrentCouponsRetrieveResult, VipBenefitsListResult, VipInfoRetrieveResult, VipLevelsListResult, VipPackGroupsListResult, VipPackGroupsPacksListResult, VipPackGroupsRetrieveResult, VipPacksListResult, VipPacksRetrieveResult, VipPointsBalanceRetrieveResult, VipPointsDailyRewardsCreateResult, VipPointsDailyRewardsStatusRetrieveResult, VipPointsHistoryListResult, VipPrivilegesSpeedUpsCreateResult, VipPrivilegesUsageRetrieveResult, VipPurchaseCreateResult, VipPurchaseRenewResult, VipPurchaseUpgradeResult, VipStatusRetrieveResult, WalletAccountsListResult, WalletExchangesCreateResult, WalletOperationsRetrieveResult, WalletOverviewRetrieveResult, WalletTopupsCreateResult, WalletTransactionsListResult, WalletTransactionsRetrieveResult, WalletTransfersCreateResult, WalletWithdrawalsCreateResult } from '../types';


export interface BillingWalletWithdrawalsCreateParams {
  idempotencyKey: string;
  xRequestId?: string;
}

export class BillingWalletWithdrawalsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Create wallet withdrawal */
  async create(body: CommerceWalletCommandRequest, params: BillingWalletWithdrawalsCreateParams): Promise<WalletWithdrawalsCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
        'X-Request-Id': { value: params.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<WalletWithdrawalsCreateResult>(appApiPath(`/billing/wallet/withdrawals`), body, undefined, requestHeaders, 'application/json');
  }
}

export interface BillingWalletTransfersCreateParams {
  idempotencyKey: string;
  xRequestId?: string;
}

export class BillingWalletTransfersApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Create wallet transfer */
  async create(body: CommerceWalletCommandRequest, params: BillingWalletTransfersCreateParams): Promise<WalletTransfersCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
        'X-Request-Id': { value: params.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<WalletTransfersCreateResult>(appApiPath(`/billing/wallet/transfers`), body, undefined, requestHeaders, 'application/json');
  }
}

export interface BillingWalletTransactionsListParams {
  page?: number;
  pageSize?: number;
  cursor?: string;
}

export class BillingWalletTransactionsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List wallet transactions */
  async list(params?: BillingWalletTransactionsListParams): Promise<WalletTransactionsListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<WalletTransactionsListResult>(appendQueryString(appApiPath(`/billing/wallet/transactions`), query));
  }

/** Retrieve wallet transaction */
  async retrieve(transactionId: string): Promise<WalletTransactionsRetrieveResult> {
    return this.client.get<WalletTransactionsRetrieveResult>(appApiPath(`/billing/wallet/transactions/${serializePathParameter(transactionId, { name: 'transactionId', style: 'simple', explode: false })}`));
  }
}

export interface BillingWalletTopupsCreateParams {
  idempotencyKey: string;
  xRequestId?: string;
}

export class BillingWalletTopupsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Create wallet topup */
  async create(body: CommerceWalletCommandRequest, params: BillingWalletTopupsCreateParams): Promise<WalletTopupsCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
        'X-Request-Id': { value: params.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<WalletTopupsCreateResult>(appApiPath(`/billing/wallet/topups`), body, undefined, requestHeaders, 'application/json');
  }
}

export class BillingWalletOverviewApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Retrieve wallet overview */
  async retrieve(): Promise<WalletOverviewRetrieveResult> {
    return this.client.get<WalletOverviewRetrieveResult>(appApiPath(`/billing/wallet/overview`));
  }
}

export class BillingWalletOperationsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Retrieve wallet operation */
  async retrieve(requestNo: string): Promise<WalletOperationsRetrieveResult> {
    return this.client.get<WalletOperationsRetrieveResult>(appApiPath(`/billing/wallet/operations/${serializePathParameter(requestNo, { name: 'requestNo', style: 'simple', explode: false })}`));
  }
}

export interface BillingWalletExchangesCreateParams {
  idempotencyKey: string;
  xRequestId?: string;
}

export class BillingWalletExchangesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Create wallet exchange */
  async create(body: CommerceWalletCommandRequest, params: BillingWalletExchangesCreateParams): Promise<WalletExchangesCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
        'X-Request-Id': { value: params.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<WalletExchangesCreateResult>(appApiPath(`/billing/wallet/exchanges`), body, undefined, requestHeaders, 'application/json');
  }
}

export interface BillingWalletAccountsListParams {
  assetType?: string;
}

export class BillingWalletAccountsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List wallet accounts */
  async list(params?: BillingWalletAccountsListParams): Promise<WalletAccountsListResult> {
    const query = buildQueryString([
      { name: 'asset_type', value: params?.assetType, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<WalletAccountsListResult>(appendQueryString(appApiPath(`/billing/wallet/accounts`), query));
  }
}

export class BillingWalletApi {
  private client: HttpClient;
  public readonly accounts: BillingWalletAccountsApi;
  public readonly exchanges: BillingWalletExchangesApi;
  public readonly operations: BillingWalletOperationsApi;
  public readonly overview: BillingWalletOverviewApi;
  public readonly topups: BillingWalletTopupsApi;
  public readonly transactions: BillingWalletTransactionsApi;
  public readonly transfers: BillingWalletTransfersApi;
  public readonly withdrawals: BillingWalletWithdrawalsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.accounts = new BillingWalletAccountsApi(client);
    this.exchanges = new BillingWalletExchangesApi(client);
    this.operations = new BillingWalletOperationsApi(client);
    this.overview = new BillingWalletOverviewApi(client);
    this.topups = new BillingWalletTopupsApi(client);
    this.transactions = new BillingWalletTransactionsApi(client);
    this.transfers = new BillingWalletTransfersApi(client);
    this.withdrawals = new BillingWalletWithdrawalsApi(client);
  }

}

export class BillingVipStatusApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Retrieve VIP status */
  async retrieve(): Promise<VipStatusRetrieveResult> {
    return this.client.get<VipStatusRetrieveResult>(appApiPath(`/billing/vip/status`));
  }
}

export interface BillingVipPurchaseCreateParams {
  idempotencyKey: string;
  xRequestId?: string;
}

export interface BillingVipPurchaseRenewParams {
  idempotencyKey: string;
  xRequestId?: string;
}

export interface BillingVipPurchaseUpgradeParams {
  idempotencyKey: string;
  xRequestId?: string;
}

export class BillingVipPurchaseApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Create VIP purchase */
  async create(body: CommerceVipPurchaseRequest, params: BillingVipPurchaseCreateParams): Promise<VipPurchaseCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
        'X-Request-Id': { value: params.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<VipPurchaseCreateResult>(appApiPath(`/billing/vip/purchase`), body, undefined, requestHeaders, 'application/json');
  }

/** Renew VIP purchase */
  async renew(body: CommerceVipPurchaseRequest, params: BillingVipPurchaseRenewParams): Promise<VipPurchaseRenewResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
        'X-Request-Id': { value: params.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<VipPurchaseRenewResult>(appApiPath(`/billing/vip/purchase/renew`), body, undefined, requestHeaders, 'application/json');
  }

/** Upgrade VIP purchase */
  async upgrade(body: CommerceVipPurchaseRequest, params: BillingVipPurchaseUpgradeParams): Promise<VipPurchaseUpgradeResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
        'X-Request-Id': { value: params.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<VipPurchaseUpgradeResult>(appApiPath(`/billing/vip/purchase/upgrade`), body, undefined, requestHeaders, 'application/json');
  }
}

export class BillingVipPrivilegesUsageApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Retrieve VIP privilege usage */
  async retrieve(): Promise<VipPrivilegesUsageRetrieveResult> {
    return this.client.get<VipPrivilegesUsageRetrieveResult>(appApiPath(`/billing/vip/privileges/usage`));
  }
}

export interface BillingVipPrivilegesSpeedUpsCreateParams {
  idempotencyKey: string;
  xRequestId?: string;
}

export class BillingVipPrivilegesSpeedUpsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Create VIP privilege speed up */
  async create(body: CommerceVipPrivilegeSpeedUpRequest, params: BillingVipPrivilegesSpeedUpsCreateParams): Promise<VipPrivilegesSpeedUpsCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
        'X-Request-Id': { value: params.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<VipPrivilegesSpeedUpsCreateResult>(appApiPath(`/billing/vip/privileges/speed_ups`), body, undefined, requestHeaders, 'application/json');
  }
}

export class BillingVipPrivilegesApi {
  private client: HttpClient;
  public readonly speedUps: BillingVipPrivilegesSpeedUpsApi;
  public readonly usage: BillingVipPrivilegesUsageApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.speedUps = new BillingVipPrivilegesSpeedUpsApi(client);
    this.usage = new BillingVipPrivilegesUsageApi(client);
  }

}

export interface BillingVipPointsHistoryListParams {
  page?: number;
  pageSize?: number;
  cursor?: string;
}

export class BillingVipPointsHistoryApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List VIP points history */
  async list(params?: BillingVipPointsHistoryListParams): Promise<VipPointsHistoryListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<VipPointsHistoryListResult>(appendQueryString(appApiPath(`/billing/vip/points/history`), query));
  }
}

export class BillingVipPointsDailyRewardsStatusApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Retrieve VIP daily reward status */
  async retrieve(): Promise<VipPointsDailyRewardsStatusRetrieveResult> {
    return this.client.get<VipPointsDailyRewardsStatusRetrieveResult>(appApiPath(`/billing/vip/points/daily_rewards/status`));
  }
}

export interface BillingVipPointsDailyRewardsCreateParams {
  idempotencyKey: string;
  xRequestId?: string;
}

export class BillingVipPointsDailyRewardsApi {
  private client: HttpClient;
  public readonly status: BillingVipPointsDailyRewardsStatusApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.status = new BillingVipPointsDailyRewardsStatusApi(client);
  }


/** Create VIP daily reward */
  async create(body: CommerceEmptyCommandRequest, params: BillingVipPointsDailyRewardsCreateParams): Promise<VipPointsDailyRewardsCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
        'X-Request-Id': { value: params.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<VipPointsDailyRewardsCreateResult>(appApiPath(`/billing/vip/points/daily_rewards`), body, undefined, requestHeaders, 'application/json');
  }
}

export class BillingVipPointsBalanceApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Retrieve VIP points balance */
  async retrieve(): Promise<VipPointsBalanceRetrieveResult> {
    return this.client.get<VipPointsBalanceRetrieveResult>(appApiPath(`/billing/vip/points/balance`));
  }
}

export class BillingVipPointsApi {
  private client: HttpClient;
  public readonly balance: BillingVipPointsBalanceApi;
  public readonly dailyRewards: BillingVipPointsDailyRewardsApi;
  public readonly history: BillingVipPointsHistoryApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.balance = new BillingVipPointsBalanceApi(client);
    this.dailyRewards = new BillingVipPointsDailyRewardsApi(client);
    this.history = new BillingVipPointsHistoryApi(client);
  }

}

export class BillingVipPacksApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List VIP packs */
  async list(): Promise<VipPacksListResult> {
    return this.client.get<VipPacksListResult>(appApiPath(`/billing/vip/packs`));
  }

/** Retrieve VIP pack */
  async retrieve(packId: string): Promise<VipPacksRetrieveResult> {
    return this.client.get<VipPacksRetrieveResult>(appApiPath(`/billing/vip/packs/${serializePathParameter(packId, { name: 'packId', style: 'simple', explode: false })}`));
  }
}

export class BillingVipPackGroupsPacksApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List VIP pack group packs */
  async list(packGroupId: string): Promise<VipPackGroupsPacksListResult> {
    return this.client.get<VipPackGroupsPacksListResult>(appApiPath(`/billing/vip/pack_groups/${serializePathParameter(packGroupId, { name: 'packGroupId', style: 'simple', explode: false })}/packs`));
  }
}

export class BillingVipPackGroupsApi {
  private client: HttpClient;
  public readonly packs: BillingVipPackGroupsPacksApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.packs = new BillingVipPackGroupsPacksApi(client);
  }


/** List VIP pack groups */
  async list(): Promise<VipPackGroupsListResult> {
    return this.client.get<VipPackGroupsListResult>(appApiPath(`/billing/vip/pack_groups`));
  }

/** Retrieve VIP pack group */
  async retrieve(packGroupId: string): Promise<VipPackGroupsRetrieveResult> {
    return this.client.get<VipPackGroupsRetrieveResult>(appApiPath(`/billing/vip/pack_groups/${serializePathParameter(packGroupId, { name: 'packGroupId', style: 'simple', explode: false })}`));
  }
}

export class BillingVipLevelsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List VIP levels */
  async list(): Promise<VipLevelsListResult> {
    return this.client.get<VipLevelsListResult>(appApiPath(`/billing/vip/levels`));
  }
}

export class BillingVipInfoApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Retrieve VIP info */
  async retrieve(): Promise<VipInfoRetrieveResult> {
    return this.client.get<VipInfoRetrieveResult>(appApiPath(`/billing/vip/info`));
  }
}

export class BillingVipBenefitsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List VIP benefits */
  async list(): Promise<VipBenefitsListResult> {
    return this.client.get<VipBenefitsListResult>(appApiPath(`/billing/vip/benefits`));
  }
}

export class BillingVipApi {
  private client: HttpClient;
  public readonly benefits: BillingVipBenefitsApi;
  public readonly info: BillingVipInfoApi;
  public readonly levels: BillingVipLevelsApi;
  public readonly packGroups: BillingVipPackGroupsApi;
  public readonly packs: BillingVipPacksApi;
  public readonly points: BillingVipPointsApi;
  public readonly privileges: BillingVipPrivilegesApi;
  public readonly purchase: BillingVipPurchaseApi;
  public readonly status: BillingVipStatusApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.benefits = new BillingVipBenefitsApi(client);
    this.info = new BillingVipInfoApi(client);
    this.levels = new BillingVipLevelsApi(client);
    this.packGroups = new BillingVipPackGroupsApi(client);
    this.packs = new BillingVipPacksApi(client);
    this.points = new BillingVipPointsApi(client);
    this.privileges = new BillingVipPrivilegesApi(client);
    this.purchase = new BillingVipPurchaseApi(client);
    this.status = new BillingVipStatusApi(client);
  }

}

export class BillingUsersCurrentCouponsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List redeem history */
  async list(): Promise<UsersCurrentCouponsListResult> {
    return this.client.get<UsersCurrentCouponsListResult>(appApiPath(`/billing/users/current/coupons`));
  }

/** Retrieve current user coupon */
  async retrieve(userCouponId: string): Promise<UsersCurrentCouponsRetrieveResult> {
    return this.client.get<UsersCurrentCouponsRetrieveResult>(appApiPath(`/billing/users/current/coupons/${serializePathParameter(userCouponId, { name: 'userCouponId', style: 'simple', explode: false })}`));
  }
}

export class BillingUsersCurrentApi {
  private client: HttpClient;
  public readonly coupons: BillingUsersCurrentCouponsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.coupons = new BillingUsersCurrentCouponsApi(client);
  }

}

export class BillingUsersApi {
  private client: HttpClient;
  public readonly current: BillingUsersCurrentApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.current = new BillingUsersCurrentApi(client);
  }

}

export interface BillingSettlementsDashboardListParams {
  year?: number;
}

export class BillingSettlementsDashboardApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List dashboard data */
  async list(params?: BillingSettlementsDashboardListParams): Promise<SettlementsDashboardListResult> {
    const query = buildQueryString([
      { name: 'year', value: params?.year, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<SettlementsDashboardListResult>(appendQueryString(appApiPath(`/billing/settlements/dashboard`), query));
  }
}

export class BillingSettlementsApi {
  private client: HttpClient;
  public readonly dashboard: BillingSettlementsDashboardApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.dashboard = new BillingSettlementsDashboardApi(client);
  }

}

export interface BillingPreflightSettlementsCreateParams {
  idempotencyKey: string;
  xRequestId?: string;
}

export class BillingPreflightSettlementsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Create preflight settlement */
  async create(body: CommercePreflightRequest, params: BillingPreflightSettlementsCreateParams): Promise<PreflightSettlementsCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
        'X-Request-Id': { value: params.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<PreflightSettlementsCreateResult>(appApiPath(`/billing/preflight/settlements`), body, undefined, requestHeaders, 'application/json');
  }
}

export interface BillingPreflightReleasesCreateParams {
  idempotencyKey: string;
  xRequestId?: string;
}

export class BillingPreflightReleasesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Create preflight release */
  async create(body: CommercePreflightRequest, params: BillingPreflightReleasesCreateParams): Promise<PreflightReleasesCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
        'X-Request-Id': { value: params.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<PreflightReleasesCreateResult>(appApiPath(`/billing/preflight/releases`), body, undefined, requestHeaders, 'application/json');
  }
}

export interface BillingPreflightPreholdsCreateParams {
  idempotencyKey: string;
  xRequestId?: string;
}

export class BillingPreflightPreholdsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Create preflight prehold */
  async create(body: CommercePreflightRequest, params: BillingPreflightPreholdsCreateParams): Promise<PreflightPreholdsCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
        'X-Request-Id': { value: params.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<PreflightPreholdsCreateResult>(appApiPath(`/billing/preflight/preholds`), body, undefined, requestHeaders, 'application/json');
  }
}

export class BillingPreflightPrechecksApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Create preflight precheck */
  async create(body: CommercePreflightRequest): Promise<PreflightPrechecksCreateResult> {
    return this.client.post<PreflightPrechecksCreateResult>(appApiPath(`/billing/preflight/prechecks`), body, undefined, undefined, 'application/json');
  }
}

export class BillingPreflightEstimatesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Create preflight estimate */
  async create(body: CommercePreflightRequest): Promise<PreflightEstimatesCreateResult> {
    return this.client.post<PreflightEstimatesCreateResult>(appApiPath(`/billing/preflight/estimates`), body, undefined, undefined, 'application/json');
  }
}

export class BillingPreflightApi {
  private client: HttpClient;
  public readonly estimates: BillingPreflightEstimatesApi;
  public readonly prechecks: BillingPreflightPrechecksApi;
  public readonly preholds: BillingPreflightPreholdsApi;
  public readonly releases: BillingPreflightReleasesApi;
  public readonly settlements: BillingPreflightSettlementsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.estimates = new BillingPreflightEstimatesApi(client);
    this.prechecks = new BillingPreflightPrechecksApi(client);
    this.preholds = new BillingPreflightPreholdsApi(client);
    this.releases = new BillingPreflightReleasesApi(client);
    this.settlements = new BillingPreflightSettlementsApi(client);
  }

}

export class BillingPaymentsRecordsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List recharge history */
  async list(): Promise<PaymentsRecordsListResult> {
    return this.client.get<PaymentsRecordsListResult>(appApiPath(`/billing/payments/records`));
  }

/** Retrieve payment record */
  async retrieve(paymentId: string): Promise<PaymentsRecordsRetrieveResult> {
    return this.client.get<PaymentsRecordsRetrieveResult>(appApiPath(`/billing/payments/records/${serializePathParameter(paymentId, { name: 'paymentId', style: 'simple', explode: false })}`));
  }
}

export class BillingPaymentsCheckoutApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List checkout status */
  async retrieve(orderNo: string): Promise<PaymentsCheckoutRetrieveResult> {
    return this.client.get<PaymentsCheckoutRetrieveResult>(appApiPath(`/billing/payments/checkout/${serializePathParameter(orderNo, { name: 'orderNo', style: 'simple', explode: false })}`));
  }
}

export class BillingPaymentsApi {
  private client: HttpClient;
  public readonly checkout: BillingPaymentsCheckoutApi;
  public readonly records: BillingPaymentsRecordsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.checkout = new BillingPaymentsCheckoutApi(client);
    this.records = new BillingPaymentsRecordsApi(client);
  }

}

export interface BillingCouponsUsageReversalsCreateParams {
  idempotencyKey: string;
  xRequestId?: string;
}

export class BillingCouponsUsageReversalsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Create coupon usage reversal */
  async create(body: CommerceCouponUsageRollbackRequest, params: BillingCouponsUsageReversalsCreateParams): Promise<CouponsUsageReversalsCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
        'X-Request-Id': { value: params.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<CouponsUsageReversalsCreateResult>(appApiPath(`/billing/coupons/usage_reversals`), body, undefined, requestHeaders, 'application/json');
  }
}

export interface BillingCouponsUsageCreateParams {
  idempotencyKey: string;
  xRequestId?: string;
}

export class BillingCouponsUsageApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Create coupon usage */
  async create(body: CommerceCouponUsageRequest, params: BillingCouponsUsageCreateParams): Promise<CouponsUsageCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
        'X-Request-Id': { value: params.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<CouponsUsageCreateResult>(appApiPath(`/billing/coupons/usage`), body, undefined, requestHeaders, 'application/json');
  }
}

export interface BillingCouponsRedeemCreateParams {
  idempotencyKey: string;
  xRequestId?: string;
}

export class BillingCouponsRedeemApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Redeem code */
  async create(body: RedeemCodeRequest, params: BillingCouponsRedeemCreateParams): Promise<CouponsRedeemCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
        'X-Request-Id': { value: params.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<CouponsRedeemCreateResult>(appApiPath(`/billing/coupons/redeem`), body, undefined, requestHeaders, 'application/json');
  }
}

export interface BillingCouponsClaimsCreateParams {
  idempotencyKey: string;
  xRequestId?: string;
}

export class BillingCouponsClaimsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Create coupon claim */
  async create(body: CommerceCouponClaimRequest, params: BillingCouponsClaimsCreateParams): Promise<CouponsClaimsCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
        'X-Request-Id': { value: params.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<CouponsClaimsCreateResult>(appApiPath(`/billing/coupons/claims`), body, undefined, requestHeaders, 'application/json');
  }
}

export interface BillingCouponsCatalogListParams {
  status?: string;
  page?: number;
  pageSize?: number;
  cursor?: string;
}

export class BillingCouponsCatalogApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List coupon catalog */
  async list(params?: BillingCouponsCatalogListParams): Promise<CouponsCatalogListResult> {
    const query = buildQueryString([
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CouponsCatalogListResult>(appendQueryString(appApiPath(`/billing/coupons/catalog`), query));
  }

/** Retrieve coupon catalog item */
  async retrieve(couponId: string): Promise<CouponsCatalogRetrieveResult> {
    return this.client.get<CouponsCatalogRetrieveResult>(appApiPath(`/billing/coupons/catalog/${serializePathParameter(couponId, { name: 'couponId', style: 'simple', explode: false })}`));
  }
}

export class BillingCouponsApi {
  private client: HttpClient;
  public readonly catalog: BillingCouponsCatalogApi;
  public readonly claims: BillingCouponsClaimsApi;
  public readonly redeem: BillingCouponsRedeemApi;
  public readonly usage: BillingCouponsUsageApi;
  public readonly usageReversals: BillingCouponsUsageReversalsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.catalog = new BillingCouponsCatalogApi(client);
    this.claims = new BillingCouponsClaimsApi(client);
    this.redeem = new BillingCouponsRedeemApi(client);
    this.usage = new BillingCouponsUsageApi(client);
    this.usageReversals = new BillingCouponsUsageReversalsApi(client);
  }

}

export interface BillingAccountTokensDeductionsCreateParams {
  idempotencyKey: string;
  xRequestId?: string;
}

export class BillingAccountTokensDeductionsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Create account token deduction */
  async create(body: CommerceWalletCommandRequest, params: BillingAccountTokensDeductionsCreateParams): Promise<AccountTokensDeductionsCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
        'X-Request-Id': { value: params.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<AccountTokensDeductionsCreateResult>(appApiPath(`/billing/account/tokens/deductions`), body, undefined, requestHeaders, 'application/json');
  }
}

export class BillingAccountTokensApi {
  private client: HttpClient;
  public readonly deductions: BillingAccountTokensDeductionsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.deductions = new BillingAccountTokensDeductionsApi(client);
  }


/** Retrieve account tokens */
  async retrieve(): Promise<AccountTokensRetrieveResult> {
    return this.client.get<AccountTokensRetrieveResult>(appApiPath(`/billing/account/tokens`));
  }
}

export class BillingAccountSummaryApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List account details */
  async retrieve(): Promise<AccountSummaryRetrieveResult> {
    return this.client.get<AccountSummaryRetrieveResult>(appApiPath(`/billing/account/summary`));
  }
}

export interface BillingAccountPointsTransfersCreateParams {
  idempotencyKey: string;
  xRequestId?: string;
}

export class BillingAccountPointsTransfersApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Create account points transfer */
  async create(body: CommerceWalletCommandRequest, params: BillingAccountPointsTransfersCreateParams): Promise<AccountPointsTransfersCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
        'X-Request-Id': { value: params.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<AccountPointsTransfersCreateResult>(appApiPath(`/billing/account/points/transfers`), body, undefined, requestHeaders, 'application/json');
  }
}

export interface BillingAccountPointsRechargesRecordsListParams {
  page?: number;
  pageSize?: number;
  cursor?: string;
}

export class BillingAccountPointsRechargesRecordsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List account points recharge records */
  async list(params?: BillingAccountPointsRechargesRecordsListParams): Promise<AccountPointsRechargesRecordsListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<AccountPointsRechargesRecordsListResult>(appendQueryString(appApiPath(`/billing/account/points/recharges/records`), query));
  }
}

export class BillingAccountPointsRechargesPackagesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List packages */
  async list(): Promise<AccountPointsRechargesPackagesListResult> {
    return this.client.get<AccountPointsRechargesPackagesListResult>(appApiPath(`/billing/account/points/recharges/packages`));
  }
}

export interface BillingAccountPointsRechargesOrdersCancelParams {
  idempotencyKey: string;
  xRequestId?: string;
}

export class BillingAccountPointsRechargesOrdersApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Retrieve account points recharge order */
  async retrieve(orderNo: string): Promise<AccountPointsRechargesOrdersRetrieveResult> {
    return this.client.get<AccountPointsRechargesOrdersRetrieveResult>(appApiPath(`/billing/account/points/recharges/orders/${serializePathParameter(orderNo, { name: 'orderNo', style: 'simple', explode: false })}`));
  }

/** Cancel account points recharge order */
  async cancel(orderNo: string, body: CommerceRechargeOrderCancelRequest, params: BillingAccountPointsRechargesOrdersCancelParams): Promise<AccountPointsRechargesOrdersCancelResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
        'X-Request-Id': { value: params.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<AccountPointsRechargesOrdersCancelResult>(appApiPath(`/billing/account/points/recharges/orders/${serializePathParameter(orderNo, { name: 'orderNo', style: 'simple', explode: false })}/cancel`), body, undefined, requestHeaders, 'application/json');
  }
}

export interface BillingAccountPointsRechargesCreateParams {
  idempotencyKey: string;
  xRequestId?: string;
}

export class BillingAccountPointsRechargesApi {
  private client: HttpClient;
  public readonly orders: BillingAccountPointsRechargesOrdersApi;
  public readonly packages: BillingAccountPointsRechargesPackagesApi;
  public readonly records: BillingAccountPointsRechargesRecordsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.orders = new BillingAccountPointsRechargesOrdersApi(client);
    this.packages = new BillingAccountPointsRechargesPackagesApi(client);
    this.records = new BillingAccountPointsRechargesRecordsApi(client);
  }


/** Create recharge */
  async create(body: SubmitRechargeRequest, params: BillingAccountPointsRechargesCreateParams): Promise<AccountPointsRechargesCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
        'X-Request-Id': { value: params.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<AccountPointsRechargesCreateResult>(appApiPath(`/billing/account/points/recharges`), body, undefined, requestHeaders, 'application/json');
  }
}

export interface BillingAccountPointsHistoryListParams {
  page?: number;
  pageSize?: number;
  cursor?: string;
}

export class BillingAccountPointsHistoryApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List account points history */
  async list(params?: BillingAccountPointsHistoryListParams): Promise<AccountPointsHistoryListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<AccountPointsHistoryListResult>(appendQueryString(appApiPath(`/billing/account/points/history`), query));
  }
}

export interface BillingAccountPointsExchangesRulesListParams {
  sourceAssetType?: string;
  targetAssetType?: string;
}

export class BillingAccountPointsExchangesRulesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List account points exchange rules */
  async list(params?: BillingAccountPointsExchangesRulesListParams): Promise<AccountPointsExchangesRulesListResult> {
    const query = buildQueryString([
      { name: 'source_asset_type', value: params?.sourceAssetType, style: 'form', explode: true, allowReserved: false },
      { name: 'target_asset_type', value: params?.targetAssetType, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<AccountPointsExchangesRulesListResult>(appendQueryString(appApiPath(`/billing/account/points/exchanges/rules`), query));
  }
}

export interface BillingAccountPointsExchangesCreateParams {
  idempotencyKey: string;
  xRequestId?: string;
}

export class BillingAccountPointsExchangesApi {
  private client: HttpClient;
  public readonly rules: BillingAccountPointsExchangesRulesApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.rules = new BillingAccountPointsExchangesRulesApi(client);
  }


/** Create account points exchange */
  async create(body: CommerceWalletCommandRequest, params: BillingAccountPointsExchangesCreateParams): Promise<AccountPointsExchangesCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
        'X-Request-Id': { value: params.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<AccountPointsExchangesCreateResult>(appApiPath(`/billing/account/points/exchanges`), body, undefined, requestHeaders, 'application/json');
  }

/** Retrieve account points exchange */
  async retrieve(exchangeNo: string): Promise<AccountPointsExchangesRetrieveResult> {
    return this.client.get<AccountPointsExchangesRetrieveResult>(appApiPath(`/billing/account/points/exchanges/${serializePathParameter(exchangeNo, { name: 'exchangeNo', style: 'simple', explode: false })}`));
  }
}

export class BillingAccountPointsExchangeRateApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Retrieve account points exchange rate */
  async retrieve(): Promise<AccountPointsExchangeRateRetrieveResult> {
    return this.client.get<AccountPointsExchangeRateRetrieveResult>(appApiPath(`/billing/account/points/exchange_rate`));
  }
}

export class BillingAccountPointsApi {
  private client: HttpClient;
  public readonly exchangeRate: BillingAccountPointsExchangeRateApi;
  public readonly exchanges: BillingAccountPointsExchangesApi;
  public readonly history: BillingAccountPointsHistoryApi;
  public readonly recharges: BillingAccountPointsRechargesApi;
  public readonly transfers: BillingAccountPointsTransfersApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.exchangeRate = new BillingAccountPointsExchangeRateApi(client);
    this.exchanges = new BillingAccountPointsExchangesApi(client);
    this.history = new BillingAccountPointsHistoryApi(client);
    this.recharges = new BillingAccountPointsRechargesApi(client);
    this.transfers = new BillingAccountPointsTransfersApi(client);
  }


/** Retrieve account points */
  async retrieve(): Promise<AccountPointsRetrieveResult> {
    return this.client.get<AccountPointsRetrieveResult>(appApiPath(`/billing/account/points`));
  }
}

export class BillingAccountApi {
  private client: HttpClient;
  public readonly points: BillingAccountPointsApi;
  public readonly summary: BillingAccountSummaryApi;
  public readonly tokens: BillingAccountTokensApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.points = new BillingAccountPointsApi(client);
    this.summary = new BillingAccountSummaryApi(client);
    this.tokens = new BillingAccountTokensApi(client);
  }

}

export class BillingApi {
  private client: HttpClient;
  public readonly account: BillingAccountApi;
  public readonly coupons: BillingCouponsApi;
  public readonly payments: BillingPaymentsApi;
  public readonly preflight: BillingPreflightApi;
  public readonly settlements: BillingSettlementsApi;
  public readonly users: BillingUsersApi;
  public readonly vip: BillingVipApi;
  public readonly wallet: BillingWalletApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.account = new BillingAccountApi(client);
    this.coupons = new BillingCouponsApi(client);
    this.payments = new BillingPaymentsApi(client);
    this.preflight = new BillingPreflightApi(client);
    this.settlements = new BillingSettlementsApi(client);
    this.users = new BillingUsersApi(client);
    this.vip = new BillingVipApi(client);
    this.wallet = new BillingWalletApi(client);
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
