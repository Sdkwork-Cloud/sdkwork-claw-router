import { appApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { AccountsCurrentSummaryRetrieveResult, AddressesCreateResult, AddressesDefaultSelectionCreateResult, AddressesDeleteResult, AddressesListResult, AddressesUpdateResult, BillingHistoryListResult, CartCurrentRetrieveResult, CartItemsCreateResult, CartItemsDeleteResult, CartItemsUpdateResult, CatalogCategoriesListResult, CatalogProductsListResult, CatalogProductsRetrieveResult, CatalogSkusRetrieveResult, CheckoutSessionsCreateResult, CheckoutSessionsOrdersCreateResult, CheckoutSessionsQuotesCreateResult, CheckoutSessionsRetrieveResult, CommerceMembershipPurchaseRequest, CommercePaymentAttemptCreateRequest, CommercePaymentIntentCreateRequest, CommerceStandardCommandRequest, FulfillmentsListResult, FulfillmentsRetrieveResult, InvoicesCreateResult, InvoicesListResult, InvoicesRetrieveResult, MembershipsBenefitsListResult, MembershipsCurrentRetrieveResult, MembershipsCurrentStatusRetrieveResult, MembershipsPackageGroupsListResult, MembershipsPackageGroupsPackagesListResult, MembershipsPackageGroupsRetrieveResult, MembershipsPackagesListResult, MembershipsPackagesRetrieveResult, MembershipsPlansListResult, MembershipsPointsBalanceRetrieveResult, MembershipsPointsDailyRewardsCreateRequest, MembershipsPointsDailyRewardsCreateResult, MembershipsPointsDailyRewardsStatusRetrieveResult, MembershipsPointsHistoryListResult, MembershipsPrivilegesSpeedUpsCreateRequest, MembershipsPrivilegesSpeedUpsCreateResult, MembershipsPrivilegesUsageRetrieveResult, MembershipsPurchasesCreateResult, MembershipsPurchasesRenewResult, MembershipsPurchasesUpgradeResult, OrdersCancellationsCreateResult, OrdersEventsListResult, OrdersListResult, OrdersRetrieveResult, PaymentsAttemptsRetrieveResult, PaymentsIntentsAttemptsCreateResult, PaymentsIntentsCreateResult, PaymentsIntentsRetrieveResult, PaymentsMethodsListResult, RechargesOrdersCreateResult, RechargesOrdersRetrieveResult, RechargesPackagesListResult, RefundsCreateResult, RefundsListResult, RefundsRetrieveResult, ShipmentsRetrieveResult, WalletAccountsListResult, WalletExchangeRateRetrieveResult, WalletLedgerEntriesListResult, WalletOverviewRetrieveResult, WalletPointsExchangeRulesListResult, WalletTokensRetrieveResult } from '../types';


export class CommerceWalletTokensApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Wallet Tokens Retrieve */
  async retrieve(): Promise<WalletTokensRetrieveResult> {
    return this.client.get<WalletTokensRetrieveResult>(appApiPath(`/wallet/tokens`));
  }
}

export interface CommerceWalletPointsExchangeRulesListParams {
  sourceAssetType?: string;
  targetAssetType?: string;
}

export class CommerceWalletPointsExchangeRulesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Wallet Points Exchange Rules List */
  async list(params?: CommerceWalletPointsExchangeRulesListParams): Promise<WalletPointsExchangeRulesListResult> {
    const query = buildQueryString([
      { name: 'source_asset_type', value: params?.sourceAssetType, style: 'form', explode: true, allowReserved: false },
      { name: 'target_asset_type', value: params?.targetAssetType, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<WalletPointsExchangeRulesListResult>(appendQueryString(appApiPath(`/wallet/points/exchanges/rules`), query));
  }
}

export class CommerceWalletPointsApi {
  private client: HttpClient;
  public readonly exchangeRules: CommerceWalletPointsExchangeRulesApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.exchangeRules = new CommerceWalletPointsExchangeRulesApi(client);
  }

}

export class CommerceWalletOverviewApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Wallet Overview Retrieve */
  async retrieve(): Promise<WalletOverviewRetrieveResult> {
    return this.client.get<WalletOverviewRetrieveResult>(appApiPath(`/wallet/overview`));
  }
}

export interface CommerceWalletLedgerEntriesListParams {
  page?: number;
  pageSize?: number;
  status?: string;
}

export class CommerceWalletLedgerEntriesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Wallet Ledger Entries List */
  async list(params?: CommerceWalletLedgerEntriesListParams): Promise<WalletLedgerEntriesListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<WalletLedgerEntriesListResult>(appendQueryString(appApiPath(`/wallet/ledger_entries`), query));
  }
}

export class CommerceWalletExchangeRateApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Wallet Exchange Rate Retrieve */
  async retrieve(): Promise<WalletExchangeRateRetrieveResult> {
    return this.client.get<WalletExchangeRateRetrieveResult>(appApiPath(`/wallet/exchange_rate`));
  }
}

export interface CommerceWalletAccountsListParams {
  page?: number;
  pageSize?: number;
  status?: string;
}

export class CommerceWalletAccountsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Wallet Accounts List */
  async list(params?: CommerceWalletAccountsListParams): Promise<WalletAccountsListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<WalletAccountsListResult>(appendQueryString(appApiPath(`/wallet/accounts`), query));
  }
}

export class CommerceWalletApi {
  private client: HttpClient;
  public readonly accounts: CommerceWalletAccountsApi;
  public readonly exchangeRate: CommerceWalletExchangeRateApi;
  public readonly ledgerEntries: CommerceWalletLedgerEntriesApi;
  public readonly overview: CommerceWalletOverviewApi;
  public readonly points: CommerceWalletPointsApi;
  public readonly tokens: CommerceWalletTokensApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.accounts = new CommerceWalletAccountsApi(client);
    this.exchangeRate = new CommerceWalletExchangeRateApi(client);
    this.ledgerEntries = new CommerceWalletLedgerEntriesApi(client);
    this.overview = new CommerceWalletOverviewApi(client);
    this.points = new CommerceWalletPointsApi(client);
    this.tokens = new CommerceWalletTokensApi(client);
  }

}

export class CommerceShipmentsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Shipments Retrieve */
  async retrieve(shipmentId: string): Promise<ShipmentsRetrieveResult> {
    return this.client.get<ShipmentsRetrieveResult>(appApiPath(`/shipments/${serializePathParameter(shipmentId, { name: 'shipmentId', style: 'simple', explode: false })}`));
  }
}

export interface CommerceRefundsListParams {
  page?: number;
  pageSize?: number;
  status?: string;
}

export interface CommerceRefundsCreateParams {
  idempotencyKey: string;
}

export class CommerceRefundsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Refunds List */
  async list(params?: CommerceRefundsListParams): Promise<RefundsListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<RefundsListResult>(appendQueryString(appApiPath(`/refunds`), query));
  }

/** Refunds Create */
  async create(body: CommerceStandardCommandRequest, params: CommerceRefundsCreateParams): Promise<RefundsCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<RefundsCreateResult>(appApiPath(`/refunds`), body, undefined, requestHeaders, 'application/json');
  }

/** Refunds Retrieve */
  async retrieve(refundId: string): Promise<RefundsRetrieveResult> {
    return this.client.get<RefundsRetrieveResult>(appApiPath(`/refunds/${serializePathParameter(refundId, { name: 'refundId', style: 'simple', explode: false })}`));
  }
}

export interface CommerceRechargesPackagesListParams {
  page?: number;
  pageSize?: number;
  status?: string;
}

export class CommerceRechargesPackagesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Recharges Packages List */
  async list(params?: CommerceRechargesPackagesListParams): Promise<RechargesPackagesListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<RechargesPackagesListResult>(appendQueryString(appApiPath(`/recharges/packages`), query));
  }
}

export interface CommerceRechargesOrdersCreateParams {
  idempotencyKey: string;
}

export class CommerceRechargesOrdersApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Recharges Orders Create */
  async create(body: CommerceStandardCommandRequest, params: CommerceRechargesOrdersCreateParams): Promise<RechargesOrdersCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<RechargesOrdersCreateResult>(appApiPath(`/recharges/orders`), body, undefined, requestHeaders, 'application/json');
  }

/** Recharges Orders Retrieve */
  async retrieve(orderId: string): Promise<RechargesOrdersRetrieveResult> {
    return this.client.get<RechargesOrdersRetrieveResult>(appApiPath(`/recharges/orders/${serializePathParameter(orderId, { name: 'orderId', style: 'simple', explode: false })}`));
  }
}

export class CommerceRechargesApi {
  private client: HttpClient;
  public readonly orders: CommerceRechargesOrdersApi;
  public readonly packages: CommerceRechargesPackagesApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.orders = new CommerceRechargesOrdersApi(client);
    this.packages = new CommerceRechargesPackagesApi(client);
  }

}

export interface CommercePaymentsMethodsListParams {
  page?: number;
  pageSize?: number;
  status?: string;
}

export class CommercePaymentsMethodsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Payments Methods List */
  async list(params?: CommercePaymentsMethodsListParams): Promise<PaymentsMethodsListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<PaymentsMethodsListResult>(appendQueryString(appApiPath(`/payments/methods`), query));
  }
}

export interface CommercePaymentsIntentsAttemptsCreateParams {
  idempotencyKey: string;
}

export class CommercePaymentsIntentsAttemptsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Payments Intents Attempts Create */
  async create(paymentIntentId: string, body: CommercePaymentAttemptCreateRequest, params: CommercePaymentsIntentsAttemptsCreateParams): Promise<PaymentsIntentsAttemptsCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<PaymentsIntentsAttemptsCreateResult>(appApiPath(`/payments/intents/${serializePathParameter(paymentIntentId, { name: 'paymentIntentId', style: 'simple', explode: false })}/attempts`), body, undefined, requestHeaders, 'application/json');
  }
}

export interface CommercePaymentsIntentsCreateParams {
  idempotencyKey: string;
}

export class CommercePaymentsIntentsApi {
  private client: HttpClient;
  public readonly attempts: CommercePaymentsIntentsAttemptsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.attempts = new CommercePaymentsIntentsAttemptsApi(client);
  }


/** Payments Intents Create */
  async create(body: CommercePaymentIntentCreateRequest, params: CommercePaymentsIntentsCreateParams): Promise<PaymentsIntentsCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<PaymentsIntentsCreateResult>(appApiPath(`/payments/intents`), body, undefined, requestHeaders, 'application/json');
  }

/** Payments Intents Retrieve */
  async retrieve(paymentIntentId: string): Promise<PaymentsIntentsRetrieveResult> {
    return this.client.get<PaymentsIntentsRetrieveResult>(appApiPath(`/payments/intents/${serializePathParameter(paymentIntentId, { name: 'paymentIntentId', style: 'simple', explode: false })}`));
  }
}

export class CommercePaymentsAttemptsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Payments Attempts Retrieve */
  async retrieve(paymentAttemptId: string): Promise<PaymentsAttemptsRetrieveResult> {
    return this.client.get<PaymentsAttemptsRetrieveResult>(appApiPath(`/payments/attempts/${serializePathParameter(paymentAttemptId, { name: 'paymentAttemptId', style: 'simple', explode: false })}`));
  }
}

export class CommercePaymentsApi {
  private client: HttpClient;
  public readonly attempts: CommercePaymentsAttemptsApi;
  public readonly intents: CommercePaymentsIntentsApi;
  public readonly methods: CommercePaymentsMethodsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.attempts = new CommercePaymentsAttemptsApi(client);
    this.intents = new CommercePaymentsIntentsApi(client);
    this.methods = new CommercePaymentsMethodsApi(client);
  }

}

export interface CommerceOrdersEventsListParams {
  page?: number;
  pageSize?: number;
  status?: string;
}

export class CommerceOrdersEventsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Orders Events List */
  async list(orderId: string, params?: CommerceOrdersEventsListParams): Promise<OrdersEventsListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<OrdersEventsListResult>(appendQueryString(appApiPath(`/orders/${serializePathParameter(orderId, { name: 'orderId', style: 'simple', explode: false })}/events`), query));
  }
}

export interface CommerceOrdersCancellationsCreateParams {
  idempotencyKey: string;
}

export class CommerceOrdersCancellationsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Orders Cancellations Create */
  async create(orderId: string, body: CommerceStandardCommandRequest, params: CommerceOrdersCancellationsCreateParams): Promise<OrdersCancellationsCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<OrdersCancellationsCreateResult>(appApiPath(`/orders/${serializePathParameter(orderId, { name: 'orderId', style: 'simple', explode: false })}/cancellations`), body, undefined, requestHeaders, 'application/json');
  }
}

export interface CommerceOrdersListParams {
  page?: number;
  pageSize?: number;
  status?: string;
}

export class CommerceOrdersApi {
  private client: HttpClient;
  public readonly cancellations: CommerceOrdersCancellationsApi;
  public readonly events: CommerceOrdersEventsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.cancellations = new CommerceOrdersCancellationsApi(client);
    this.events = new CommerceOrdersEventsApi(client);
  }


/** Orders List */
  async list(params?: CommerceOrdersListParams): Promise<OrdersListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<OrdersListResult>(appendQueryString(appApiPath(`/orders`), query));
  }

/** Orders Retrieve */
  async retrieve(orderId: string): Promise<OrdersRetrieveResult> {
    return this.client.get<OrdersRetrieveResult>(appApiPath(`/orders/${serializePathParameter(orderId, { name: 'orderId', style: 'simple', explode: false })}`));
  }
}

export interface CommerceMembershipsPurchasesCreateParams {
  idempotencyKey: string;
}

export interface CommerceMembershipsPurchasesRenewParams {
  idempotencyKey: string;
}

export interface CommerceMembershipsPurchasesUpgradeParams {
  idempotencyKey: string;
}

export class CommerceMembershipsPurchasesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Memberships Purchases Create */
  async create(body: CommerceMembershipPurchaseRequest, params: CommerceMembershipsPurchasesCreateParams): Promise<MembershipsPurchasesCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<MembershipsPurchasesCreateResult>(appApiPath(`/memberships/purchases`), body, undefined, requestHeaders, 'application/json');
  }

/** Memberships Purchases Renew */
  async renew(body: CommerceMembershipPurchaseRequest, params: CommerceMembershipsPurchasesRenewParams): Promise<MembershipsPurchasesRenewResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<MembershipsPurchasesRenewResult>(appApiPath(`/memberships/purchases/renew`), body, undefined, requestHeaders, 'application/json');
  }

/** Memberships Purchases Upgrade */
  async upgrade(body: CommerceMembershipPurchaseRequest, params: CommerceMembershipsPurchasesUpgradeParams): Promise<MembershipsPurchasesUpgradeResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<MembershipsPurchasesUpgradeResult>(appApiPath(`/memberships/purchases/upgrade`), body, undefined, requestHeaders, 'application/json');
  }
}

export class CommerceMembershipsPrivilegesUsageApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Memberships Privileges Usage Retrieve */
  async retrieve(): Promise<MembershipsPrivilegesUsageRetrieveResult> {
    return this.client.get<MembershipsPrivilegesUsageRetrieveResult>(appApiPath(`/memberships/privileges/usage`));
  }
}

export class CommerceMembershipsPrivilegesSpeedUpsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Memberships Privileges Speed Ups Create */
  async create(body?: MembershipsPrivilegesSpeedUpsCreateRequest): Promise<MembershipsPrivilegesSpeedUpsCreateResult> {
    return this.client.post<MembershipsPrivilegesSpeedUpsCreateResult>(appApiPath(`/memberships/privileges/speed_ups`), body, undefined, undefined, 'application/json');
  }
}

export class CommerceMembershipsPrivilegesApi {
  private client: HttpClient;
  public readonly speedUps: CommerceMembershipsPrivilegesSpeedUpsApi;
  public readonly usage: CommerceMembershipsPrivilegesUsageApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.speedUps = new CommerceMembershipsPrivilegesSpeedUpsApi(client);
    this.usage = new CommerceMembershipsPrivilegesUsageApi(client);
  }

}

export interface CommerceMembershipsPointsHistoryListParams {
  page?: number;
  pageSize?: number;
  cursor?: string;
}

export class CommerceMembershipsPointsHistoryApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Memberships Points History List */
  async list(params?: CommerceMembershipsPointsHistoryListParams): Promise<MembershipsPointsHistoryListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<MembershipsPointsHistoryListResult>(appendQueryString(appApiPath(`/memberships/points/history`), query));
  }
}

export class CommerceMembershipsPointsDailyRewardsStatusApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Memberships Points Daily Rewards Status Retrieve */
  async retrieve(): Promise<MembershipsPointsDailyRewardsStatusRetrieveResult> {
    return this.client.get<MembershipsPointsDailyRewardsStatusRetrieveResult>(appApiPath(`/memberships/points/daily_rewards/status`));
  }
}

export class CommerceMembershipsPointsDailyRewardsApi {
  private client: HttpClient;
  public readonly status: CommerceMembershipsPointsDailyRewardsStatusApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.status = new CommerceMembershipsPointsDailyRewardsStatusApi(client);
  }


/** Memberships Points Daily Rewards Create */
  async create(body?: MembershipsPointsDailyRewardsCreateRequest): Promise<MembershipsPointsDailyRewardsCreateResult> {
    return this.client.post<MembershipsPointsDailyRewardsCreateResult>(appApiPath(`/memberships/points/daily_rewards`), body, undefined, undefined, 'application/json');
  }
}

export class CommerceMembershipsPointsBalanceApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Memberships Points Balance Retrieve */
  async retrieve(): Promise<MembershipsPointsBalanceRetrieveResult> {
    return this.client.get<MembershipsPointsBalanceRetrieveResult>(appApiPath(`/memberships/points/balance`));
  }
}

export class CommerceMembershipsPointsApi {
  private client: HttpClient;
  public readonly balance: CommerceMembershipsPointsBalanceApi;
  public readonly dailyRewards: CommerceMembershipsPointsDailyRewardsApi;
  public readonly history: CommerceMembershipsPointsHistoryApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.balance = new CommerceMembershipsPointsBalanceApi(client);
    this.dailyRewards = new CommerceMembershipsPointsDailyRewardsApi(client);
    this.history = new CommerceMembershipsPointsHistoryApi(client);
  }

}

export class CommerceMembershipsPlansApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Memberships Plans List */
  async list(): Promise<MembershipsPlansListResult> {
    return this.client.get<MembershipsPlansListResult>(appApiPath(`/memberships/plans`));
  }
}

export interface CommerceMembershipsPackagesListParams {
  page?: number;
  pageSize?: number;
  status?: string;
}

export class CommerceMembershipsPackagesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Memberships Packages List */
  async list(params?: CommerceMembershipsPackagesListParams): Promise<MembershipsPackagesListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<MembershipsPackagesListResult>(appendQueryString(appApiPath(`/memberships/packages`), query));
  }

/** Memberships Packages Retrieve */
  async retrieve(packageId: string): Promise<MembershipsPackagesRetrieveResult> {
    return this.client.get<MembershipsPackagesRetrieveResult>(appApiPath(`/memberships/packages/${serializePathParameter(packageId, { name: 'packageId', style: 'simple', explode: false })}`));
  }
}

export interface CommerceMembershipsPackageGroupsPackagesListParams {
  planId?: number;
}

export class CommerceMembershipsPackageGroupsPackagesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Memberships Package Groups Packages List */
  async list(packageGroupId: string, params?: CommerceMembershipsPackageGroupsPackagesListParams): Promise<MembershipsPackageGroupsPackagesListResult> {
    const query = buildQueryString([
      { name: 'plan_id', value: params?.planId, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<MembershipsPackageGroupsPackagesListResult>(appendQueryString(appApiPath(`/memberships/package_groups/${serializePathParameter(packageGroupId, { name: 'packageGroupId', style: 'simple', explode: false })}/packages`), query));
  }
}

export interface CommerceMembershipsPackageGroupsListParams {
  planId?: number;
  recommendedOnly?: boolean;
}

export class CommerceMembershipsPackageGroupsApi {
  private client: HttpClient;
  public readonly packages: CommerceMembershipsPackageGroupsPackagesApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.packages = new CommerceMembershipsPackageGroupsPackagesApi(client);
  }


/** Memberships Package Groups List */
  async list(params?: CommerceMembershipsPackageGroupsListParams): Promise<MembershipsPackageGroupsListResult> {
    const query = buildQueryString([
      { name: 'plan_id', value: params?.planId, style: 'form', explode: true, allowReserved: false },
      { name: 'recommended_only', value: params?.recommendedOnly, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<MembershipsPackageGroupsListResult>(appendQueryString(appApiPath(`/memberships/package_groups`), query));
  }

/** Memberships Package Groups Retrieve */
  async retrieve(packageGroupId: string): Promise<MembershipsPackageGroupsRetrieveResult> {
    return this.client.get<MembershipsPackageGroupsRetrieveResult>(appApiPath(`/memberships/package_groups/${serializePathParameter(packageGroupId, { name: 'packageGroupId', style: 'simple', explode: false })}`));
  }
}

export class CommerceMembershipsCurrentStatusApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Memberships Current Status Retrieve */
  async retrieve(): Promise<MembershipsCurrentStatusRetrieveResult> {
    return this.client.get<MembershipsCurrentStatusRetrieveResult>(appApiPath(`/memberships/current/status`));
  }
}

export class CommerceMembershipsCurrentApi {
  private client: HttpClient;
  public readonly status: CommerceMembershipsCurrentStatusApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.status = new CommerceMembershipsCurrentStatusApi(client);
  }


/** Memberships Current Retrieve */
  async retrieve(): Promise<MembershipsCurrentRetrieveResult> {
    return this.client.get<MembershipsCurrentRetrieveResult>(appApiPath(`/memberships/current`));
  }
}

export interface CommerceMembershipsBenefitsListParams {
  planId?: number;
}

export class CommerceMembershipsBenefitsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Memberships Benefits List */
  async list(params?: CommerceMembershipsBenefitsListParams): Promise<MembershipsBenefitsListResult> {
    const query = buildQueryString([
      { name: 'plan_id', value: params?.planId, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<MembershipsBenefitsListResult>(appendQueryString(appApiPath(`/memberships/benefits`), query));
  }
}

export class CommerceMembershipsApi {
  private client: HttpClient;
  public readonly benefits: CommerceMembershipsBenefitsApi;
  public readonly current: CommerceMembershipsCurrentApi;
  public readonly packageGroups: CommerceMembershipsPackageGroupsApi;
  public readonly packages: CommerceMembershipsPackagesApi;
  public readonly plans: CommerceMembershipsPlansApi;
  public readonly points: CommerceMembershipsPointsApi;
  public readonly privileges: CommerceMembershipsPrivilegesApi;
  public readonly purchases: CommerceMembershipsPurchasesApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.benefits = new CommerceMembershipsBenefitsApi(client);
    this.current = new CommerceMembershipsCurrentApi(client);
    this.packageGroups = new CommerceMembershipsPackageGroupsApi(client);
    this.packages = new CommerceMembershipsPackagesApi(client);
    this.plans = new CommerceMembershipsPlansApi(client);
    this.points = new CommerceMembershipsPointsApi(client);
    this.privileges = new CommerceMembershipsPrivilegesApi(client);
    this.purchases = new CommerceMembershipsPurchasesApi(client);
  }

}

export interface CommerceInvoicesListParams {
  page?: number;
  pageSize?: number;
  status?: string;
}

export interface CommerceInvoicesCreateParams {
  idempotencyKey: string;
}

export class CommerceInvoicesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Invoices List */
  async list(params?: CommerceInvoicesListParams): Promise<InvoicesListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<InvoicesListResult>(appendQueryString(appApiPath(`/invoices`), query));
  }

/** Invoices Create */
  async create(body: CommerceStandardCommandRequest, params: CommerceInvoicesCreateParams): Promise<InvoicesCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<InvoicesCreateResult>(appApiPath(`/invoices`), body, undefined, requestHeaders, 'application/json');
  }

/** Invoices Retrieve */
  async retrieve(invoiceId: string): Promise<InvoicesRetrieveResult> {
    return this.client.get<InvoicesRetrieveResult>(appApiPath(`/invoices/${serializePathParameter(invoiceId, { name: 'invoiceId', style: 'simple', explode: false })}`));
  }
}

export interface CommerceFulfillmentsListParams {
  page?: number;
  pageSize?: number;
  status?: string;
}

export class CommerceFulfillmentsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Fulfillments List */
  async list(params?: CommerceFulfillmentsListParams): Promise<FulfillmentsListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<FulfillmentsListResult>(appendQueryString(appApiPath(`/fulfillments`), query));
  }

/** Fulfillments Retrieve */
  async retrieve(fulfillmentId: string): Promise<FulfillmentsRetrieveResult> {
    return this.client.get<FulfillmentsRetrieveResult>(appApiPath(`/fulfillments/${serializePathParameter(fulfillmentId, { name: 'fulfillmentId', style: 'simple', explode: false })}`));
  }
}

export interface CommerceCheckoutSessionsQuotesCreateParams {
  idempotencyKey: string;
}

export class CommerceCheckoutSessionsQuotesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Checkout Sessions Quotes Create */
  async create(checkoutSessionId: string, body: CommerceStandardCommandRequest, params: CommerceCheckoutSessionsQuotesCreateParams): Promise<CheckoutSessionsQuotesCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<CheckoutSessionsQuotesCreateResult>(appApiPath(`/checkout/sessions/${serializePathParameter(checkoutSessionId, { name: 'checkoutSessionId', style: 'simple', explode: false })}/quotes`), body, undefined, requestHeaders, 'application/json');
  }
}

export interface CommerceCheckoutSessionsOrdersCreateParams {
  idempotencyKey: string;
}

export class CommerceCheckoutSessionsOrdersApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Checkout Sessions Orders Create */
  async create(checkoutSessionId: string, body: CommerceStandardCommandRequest, params: CommerceCheckoutSessionsOrdersCreateParams): Promise<CheckoutSessionsOrdersCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<CheckoutSessionsOrdersCreateResult>(appApiPath(`/checkout/sessions/${serializePathParameter(checkoutSessionId, { name: 'checkoutSessionId', style: 'simple', explode: false })}/orders`), body, undefined, requestHeaders, 'application/json');
  }
}

export interface CommerceCheckoutSessionsCreateParams {
  idempotencyKey: string;
}

export class CommerceCheckoutSessionsApi {
  private client: HttpClient;
  public readonly orders: CommerceCheckoutSessionsOrdersApi;
  public readonly quotes: CommerceCheckoutSessionsQuotesApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.orders = new CommerceCheckoutSessionsOrdersApi(client);
    this.quotes = new CommerceCheckoutSessionsQuotesApi(client);
  }


/** Checkout Sessions Create */
  async create(body: CommerceStandardCommandRequest, params: CommerceCheckoutSessionsCreateParams): Promise<CheckoutSessionsCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<CheckoutSessionsCreateResult>(appApiPath(`/checkout/sessions`), body, undefined, requestHeaders, 'application/json');
  }

/** Checkout Sessions Retrieve */
  async retrieve(checkoutSessionId: string): Promise<CheckoutSessionsRetrieveResult> {
    return this.client.get<CheckoutSessionsRetrieveResult>(appApiPath(`/checkout/sessions/${serializePathParameter(checkoutSessionId, { name: 'checkoutSessionId', style: 'simple', explode: false })}`));
  }
}

export class CommerceCheckoutApi {
  private client: HttpClient;
  public readonly sessions: CommerceCheckoutSessionsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.sessions = new CommerceCheckoutSessionsApi(client);
  }

}

export class CommerceCatalogSkusApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Retrieve catalog SKU detail */
  async retrieve(skuId: string): Promise<CatalogSkusRetrieveResult> {
    return this.client.get<CatalogSkusRetrieveResult>(appApiPath(`/catalog/skus/${serializePathParameter(skuId, { name: 'skuId', style: 'simple', explode: false })}`));
  }
}

export interface CommerceCatalogProductsListParams {
  q?: string;
  categoryId?: string;
  productType?: string;
  status?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
}

export class CommerceCatalogProductsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List visible catalog products */
  async list(params?: CommerceCatalogProductsListParams): Promise<CatalogProductsListResult> {
    const query = buildQueryString([
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'category_id', value: params?.categoryId, style: 'form', explode: true, allowReserved: false },
      { name: 'product_type', value: params?.productType, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'sort', value: params?.sort, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CatalogProductsListResult>(appendQueryString(appApiPath(`/catalog/products`), query));
  }

/** Retrieve catalog product detail */
  async retrieve(productId: string): Promise<CatalogProductsRetrieveResult> {
    return this.client.get<CatalogProductsRetrieveResult>(appApiPath(`/catalog/products/${serializePathParameter(productId, { name: 'productId', style: 'simple', explode: false })}`));
  }
}

export interface CommerceCatalogCategoriesListParams {
  parentId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export class CommerceCatalogCategoriesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List visible product categories */
  async list(params?: CommerceCatalogCategoriesListParams): Promise<CatalogCategoriesListResult> {
    const query = buildQueryString([
      { name: 'parent_id', value: params?.parentId, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CatalogCategoriesListResult>(appendQueryString(appApiPath(`/catalog/categories`), query));
  }
}

export class CommerceCatalogApi {
  private client: HttpClient;
  public readonly categories: CommerceCatalogCategoriesApi;
  public readonly products: CommerceCatalogProductsApi;
  public readonly skus: CommerceCatalogSkusApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.categories = new CommerceCatalogCategoriesApi(client);
    this.products = new CommerceCatalogProductsApi(client);
    this.skus = new CommerceCatalogSkusApi(client);
  }

}

export interface CommerceCartItemsCreateParams {
  idempotencyKey: string;
}

export interface CommerceCartItemsDeleteParams {
  idempotencyKey: string;
}

export interface CommerceCartItemsUpdateParams {
  idempotencyKey: string;
}

export class CommerceCartItemsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Cart Items Create */
  async create(body: CommerceStandardCommandRequest, params: CommerceCartItemsCreateParams): Promise<CartItemsCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<CartItemsCreateResult>(appApiPath(`/cart/items`), body, undefined, requestHeaders, 'application/json');
  }

/** Cart Items Delete */
  async delete(cartItemId: string, params: CommerceCartItemsDeleteParams): Promise<CartItemsDeleteResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.delete<CartItemsDeleteResult>(appApiPath(`/cart/items/${serializePathParameter(cartItemId, { name: 'cartItemId', style: 'simple', explode: false })}`), undefined, requestHeaders);
  }

/** Cart Items Update */
  async update(cartItemId: string, body: CommerceStandardCommandRequest, params: CommerceCartItemsUpdateParams): Promise<CartItemsUpdateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.patch<CartItemsUpdateResult>(appApiPath(`/cart/items/${serializePathParameter(cartItemId, { name: 'cartItemId', style: 'simple', explode: false })}`), body, undefined, requestHeaders, 'application/json');
  }
}

export class CommerceCartCurrentApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Cart Current Retrieve */
  async retrieve(): Promise<CartCurrentRetrieveResult> {
    return this.client.get<CartCurrentRetrieveResult>(appApiPath(`/cart/current`));
  }
}

export class CommerceCartApi {
  private client: HttpClient;
  public readonly current: CommerceCartCurrentApi;
  public readonly items: CommerceCartItemsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.current = new CommerceCartCurrentApi(client);
    this.items = new CommerceCartItemsApi(client);
  }

}

export interface CommerceBillingHistoryListParams {
  page?: number;
  pageSize?: number;
  type_?: 'redeem' | 'recharge';
  status?: string;
}

export class CommerceBillingHistoryApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Billing History List */
  async list(params?: CommerceBillingHistoryListParams): Promise<BillingHistoryListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'type', value: params?.type_, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<BillingHistoryListResult>(appendQueryString(appApiPath(`/billing/history`), query));
  }
}

export class CommerceBillingApi {
  private client: HttpClient;
  public readonly history: CommerceBillingHistoryApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.history = new CommerceBillingHistoryApi(client);
  }

}

export interface CommerceAddressesDefaultSelectionCreateParams {
  idempotencyKey: string;
}

export class CommerceAddressesDefaultSelectionApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Addresses Default Selection Create */
  async create(addressId: string, body: CommerceStandardCommandRequest, params: CommerceAddressesDefaultSelectionCreateParams): Promise<AddressesDefaultSelectionCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<AddressesDefaultSelectionCreateResult>(appApiPath(`/addresses/${serializePathParameter(addressId, { name: 'addressId', style: 'simple', explode: false })}/default_selection`), body, undefined, requestHeaders, 'application/json');
  }
}

export interface CommerceAddressesListParams {
  page?: number;
  pageSize?: number;
  status?: string;
}

export interface CommerceAddressesCreateParams {
  idempotencyKey: string;
}

export interface CommerceAddressesDeleteParams {
  idempotencyKey: string;
}

export interface CommerceAddressesUpdateParams {
  idempotencyKey: string;
}

export class CommerceAddressesApi {
  private client: HttpClient;
  public readonly defaultSelection: CommerceAddressesDefaultSelectionApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.defaultSelection = new CommerceAddressesDefaultSelectionApi(client);
  }


/** Addresses List */
  async list(params?: CommerceAddressesListParams): Promise<AddressesListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<AddressesListResult>(appendQueryString(appApiPath(`/addresses`), query));
  }

/** Addresses Create */
  async create(body: CommerceStandardCommandRequest, params: CommerceAddressesCreateParams): Promise<AddressesCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<AddressesCreateResult>(appApiPath(`/addresses`), body, undefined, requestHeaders, 'application/json');
  }

/** Addresses Delete */
  async delete(addressId: string, params: CommerceAddressesDeleteParams): Promise<AddressesDeleteResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.delete<AddressesDeleteResult>(appApiPath(`/addresses/${serializePathParameter(addressId, { name: 'addressId', style: 'simple', explode: false })}`), undefined, requestHeaders);
  }

/** Addresses Update */
  async update(addressId: string, body: CommerceStandardCommandRequest, params: CommerceAddressesUpdateParams): Promise<AddressesUpdateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.patch<AddressesUpdateResult>(appApiPath(`/addresses/${serializePathParameter(addressId, { name: 'addressId', style: 'simple', explode: false })}`), body, undefined, requestHeaders, 'application/json');
  }
}

export class CommerceAccountsCurrentSummaryApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Accounts Current Summary Retrieve */
  async retrieve(): Promise<AccountsCurrentSummaryRetrieveResult> {
    return this.client.get<AccountsCurrentSummaryRetrieveResult>(appApiPath(`/accounts/current/summary`));
  }
}

export class CommerceAccountsCurrentApi {
  private client: HttpClient;
  public readonly summary: CommerceAccountsCurrentSummaryApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.summary = new CommerceAccountsCurrentSummaryApi(client);
  }

}

export class CommerceAccountsApi {
  private client: HttpClient;
  public readonly current: CommerceAccountsCurrentApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.current = new CommerceAccountsCurrentApi(client);
  }

}

export class CommerceApi {
  private client: HttpClient;
  public readonly accounts: CommerceAccountsApi;
  public readonly addresses: CommerceAddressesApi;
  public readonly billing: CommerceBillingApi;
  public readonly cart: CommerceCartApi;
  public readonly catalog: CommerceCatalogApi;
  public readonly checkout: CommerceCheckoutApi;
  public readonly fulfillments: CommerceFulfillmentsApi;
  public readonly invoices: CommerceInvoicesApi;
  public readonly memberships: CommerceMembershipsApi;
  public readonly orders: CommerceOrdersApi;
  public readonly payments: CommercePaymentsApi;
  public readonly recharges: CommerceRechargesApi;
  public readonly refunds: CommerceRefundsApi;
  public readonly shipments: CommerceShipmentsApi;
  public readonly wallet: CommerceWalletApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.accounts = new CommerceAccountsApi(client);
    this.addresses = new CommerceAddressesApi(client);
    this.billing = new CommerceBillingApi(client);
    this.cart = new CommerceCartApi(client);
    this.catalog = new CommerceCatalogApi(client);
    this.checkout = new CommerceCheckoutApi(client);
    this.fulfillments = new CommerceFulfillmentsApi(client);
    this.invoices = new CommerceInvoicesApi(client);
    this.memberships = new CommerceMembershipsApi(client);
    this.orders = new CommerceOrdersApi(client);
    this.payments = new CommercePaymentsApi(client);
    this.recharges = new CommerceRechargesApi(client);
    this.refunds = new CommerceRefundsApi(client);
    this.shipments = new CommerceShipmentsApi(client);
    this.wallet = new CommerceWalletApi(client);
  }

}

export function createCommerceApi(client: HttpClient): CommerceApi {
  return new CommerceApi(client);
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
