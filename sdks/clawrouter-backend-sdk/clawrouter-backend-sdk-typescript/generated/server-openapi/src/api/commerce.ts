import { backendApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { AuditCommerceEventsListResult, CommerceInventoryStockUpdateRequest, CommerceMembershipMemberStatusRequest, CommerceMembershipPackageGroupMutationRequest, CommerceMembershipPackageMutationRequest, CommerceMembershipPlanMutationRequest, CommercePaymentProviderAccountMutationRequest, CommercePaymentProviderAccountStatusUpdateRequest, CommerceRechargePackageMutationRequest, CommerceRechargeSettingsUpdateRequest, CommerceReportsOrderRevenueListResult, CommerceReportsPaymentReconciliationRetrieveResult, CommerceReportsRefundsListResult, CommerceStandardCommandRequest, FulfillmentsListResult, InventoryLedgerEntriesListResult, InventoryReservationsListResult, InventoryStocksListResult, InventoryStocksUpdateResult, InvoicesListResult, InvoicesRetrieveResult, InvoicesTitlesListResult, MembershipsEntitlementsListResult, MembershipsMembersListResult, MembershipsMembersStatusUpdateResult, MembershipsPackageGroupsCreateResult, MembershipsPackageGroupsDeleteResult, MembershipsPackageGroupsListResult, MembershipsPackageGroupsUpdateResult, MembershipsPackagesCreateResult, MembershipsPackagesDeleteResult, MembershipsPackagesListResult, MembershipsPackagesUpdateResult, MembershipsPlansCreateResult, MembershipsPlansDeleteResult, MembershipsPlansListResult, MembershipsPlansUpdateResult, OrdersEventsListResult, OrdersListResult, OrdersRetrieveResult, PaymentsAttemptsListResult, PaymentsChannelsListResult, PaymentsIntentsListResult, PaymentsMethodsListResult, PaymentsProviderAccountsCreateResult, PaymentsProviderAccountsDeleteResult, PaymentsProviderAccountsListResult, PaymentsProviderAccountsStatusUpdateResult, PaymentsProviderAccountsUpdateResult, PaymentsProvidersListResult, PaymentsReconciliationRunsListResult, PaymentsRouteRulesListResult, PaymentsRuntimeSnapshotRetrieveResult, PaymentsWebhookEventsListResult, RechargesOrdersListResult, RechargesPackagesCreateResult, RechargesPackagesDeleteResult, RechargesPackagesListResult, RechargesPackagesUpdateResult, RechargesSettingsRetrieveResult, RechargesSettingsUpdateResult, RefundsListResult, RefundsRetrieveResult, ShipmentsListResult, ShipmentsTrackingEventsListResult, WalletAccountsListResult, WalletAdjustmentsCreateResult, WalletExchangeRulesListResult, WalletLedgerEntriesListResult } from '../types';


export interface CommerceWalletLedgerEntriesListParams {
  page?: string;
  pageSize?: string;
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
    return this.client.get<WalletLedgerEntriesListResult>(appendQueryString(backendApiPath(`/wallet/ledger_entries`), query));
  }
}

export interface CommerceWalletExchangeRulesListParams {
  page?: string;
  pageSize?: string;
  status?: string;
}

export class CommerceWalletExchangeRulesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Wallet Exchange Rules List */
  async list(params?: CommerceWalletExchangeRulesListParams): Promise<WalletExchangeRulesListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<WalletExchangeRulesListResult>(appendQueryString(backendApiPath(`/wallet/exchange_rules`), query));
  }
}

export interface CommerceWalletAdjustmentsCreateParams {
  idempotencyKey: string;
}

export class CommerceWalletAdjustmentsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Wallet Adjustments Create */
  async create(body: CommerceStandardCommandRequest, params: CommerceWalletAdjustmentsCreateParams): Promise<WalletAdjustmentsCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<WalletAdjustmentsCreateResult>(backendApiPath(`/wallet/adjustments`), body, undefined, requestHeaders, 'application/json');
  }
}

export interface CommerceWalletAccountsListParams {
  page?: string;
  pageSize?: string;
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
    return this.client.get<WalletAccountsListResult>(appendQueryString(backendApiPath(`/wallet/accounts`), query));
  }
}

export class CommerceWalletApi {
  private client: HttpClient;
  public readonly accounts: CommerceWalletAccountsApi;
  public readonly adjustments: CommerceWalletAdjustmentsApi;
  public readonly exchangeRules: CommerceWalletExchangeRulesApi;
  public readonly ledgerEntries: CommerceWalletLedgerEntriesApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.accounts = new CommerceWalletAccountsApi(client);
    this.adjustments = new CommerceWalletAdjustmentsApi(client);
    this.exchangeRules = new CommerceWalletExchangeRulesApi(client);
    this.ledgerEntries = new CommerceWalletLedgerEntriesApi(client);
  }

}

export interface CommerceShipmentsTrackingEventsListParams {
  page?: string;
  pageSize?: string;
  status?: string;
}

export class CommerceShipmentsTrackingEventsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Shipments Tracking Events List */
  async list(shipmentId: string, params?: CommerceShipmentsTrackingEventsListParams): Promise<ShipmentsTrackingEventsListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<ShipmentsTrackingEventsListResult>(appendQueryString(backendApiPath(`/shipments/${serializePathParameter(shipmentId, { name: 'shipmentId', style: 'simple', explode: false })}/tracking_events`), query));
  }
}

export interface CommerceShipmentsListParams {
  page?: string;
  pageSize?: string;
  status?: string;
}

export class CommerceShipmentsApi {
  private client: HttpClient;
  public readonly trackingEvents: CommerceShipmentsTrackingEventsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.trackingEvents = new CommerceShipmentsTrackingEventsApi(client);
  }


/** Shipments List */
  async list(params?: CommerceShipmentsListParams): Promise<ShipmentsListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<ShipmentsListResult>(appendQueryString(backendApiPath(`/shipments`), query));
  }
}

export interface CommerceRefundsListParams {
  page?: string;
  pageSize?: string;
  status?: string;
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
    return this.client.get<RefundsListResult>(appendQueryString(backendApiPath(`/refunds`), query));
  }

/** Refunds Retrieve */
  async retrieve(refundId: string): Promise<RefundsRetrieveResult> {
    return this.client.get<RefundsRetrieveResult>(backendApiPath(`/refunds/${serializePathParameter(refundId, { name: 'refundId', style: 'simple', explode: false })}`));
  }
}

export class CommerceRechargesSettingsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Recharges Settings Retrieve */
  async retrieve(): Promise<RechargesSettingsRetrieveResult> {
    return this.client.get<RechargesSettingsRetrieveResult>(backendApiPath(`/recharges/settings`));
  }

/** Recharges Settings Update */
  async update(body: CommerceRechargeSettingsUpdateRequest): Promise<RechargesSettingsUpdateResult> {
    return this.client.put<RechargesSettingsUpdateResult>(backendApiPath(`/recharges/settings`), body, undefined, undefined, 'application/json');
  }
}

export interface CommerceRechargesPackagesListParams {
  page?: string;
  pageSize?: string;
  status?: string;
}

export interface CommerceRechargesPackagesCreateParams {
  idempotencyKey: string;
}

export interface CommerceRechargesPackagesUpdateParams {
  idempotencyKey: string;
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
    return this.client.get<RechargesPackagesListResult>(appendQueryString(backendApiPath(`/recharges/packages`), query));
  }

/** Recharges Packages Create */
  async create(body: CommerceRechargePackageMutationRequest, params: CommerceRechargesPackagesCreateParams): Promise<RechargesPackagesCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<RechargesPackagesCreateResult>(backendApiPath(`/recharges/packages`), body, undefined, requestHeaders, 'application/json');
  }

/** Recharges Packages Delete */
  async delete(packageId: string): Promise<RechargesPackagesDeleteResult> {
    return this.client.delete<RechargesPackagesDeleteResult>(backendApiPath(`/recharges/packages/${serializePathParameter(packageId, { name: 'packageId', style: 'simple', explode: false })}`));
  }

/** Recharges Packages Update */
  async update(packageId: string, body: CommerceRechargePackageMutationRequest, params: CommerceRechargesPackagesUpdateParams): Promise<RechargesPackagesUpdateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.patch<RechargesPackagesUpdateResult>(backendApiPath(`/recharges/packages/${serializePathParameter(packageId, { name: 'packageId', style: 'simple', explode: false })}`), body, undefined, requestHeaders, 'application/json');
  }
}

export interface CommerceRechargesOrdersListParams {
  page?: string;
  pageSize?: string;
  status?: string;
}

export class CommerceRechargesOrdersApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Recharges Orders List */
  async list(params?: CommerceRechargesOrdersListParams): Promise<RechargesOrdersListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<RechargesOrdersListResult>(appendQueryString(backendApiPath(`/recharges/orders`), query));
  }
}

export class CommerceRechargesApi {
  private client: HttpClient;
  public readonly orders: CommerceRechargesOrdersApi;
  public readonly packages: CommerceRechargesPackagesApi;
  public readonly settings: CommerceRechargesSettingsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.orders = new CommerceRechargesOrdersApi(client);
    this.packages = new CommerceRechargesPackagesApi(client);
    this.settings = new CommerceRechargesSettingsApi(client);
  }

}

export interface CommercePaymentsWebhookEventsListParams {
  providerCode?: 'wechat_pay' | 'alipay' | 'paypal' | 'stripe' | 'apple_pay' | 'google_pay';
  page?: string;
  pageSize?: string;
  status?: string;
}

export class CommercePaymentsWebhookEventsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Payments Webhook Events List */
  async list(params?: CommercePaymentsWebhookEventsListParams): Promise<PaymentsWebhookEventsListResult> {
    const query = buildQueryString([
      { name: 'provider_code', value: params?.providerCode, style: 'form', explode: true, allowReserved: false },
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<PaymentsWebhookEventsListResult>(appendQueryString(backendApiPath(`/payments/webhook_events`), query));
  }
}

export interface CommercePaymentsRuntimeSnapshotRetrieveParams {
  environment?: 'sandbox' | 'production';
}

export class CommercePaymentsRuntimeSnapshotApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Payments Runtime Snapshot Retrieve */
  async retrieve(params?: CommercePaymentsRuntimeSnapshotRetrieveParams): Promise<PaymentsRuntimeSnapshotRetrieveResult> {
    const query = buildQueryString([
      { name: 'environment', value: params?.environment, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<PaymentsRuntimeSnapshotRetrieveResult>(appendQueryString(backendApiPath(`/payments/runtime/snapshot`), query));
  }
}

export class CommercePaymentsRuntimeApi {
  private client: HttpClient;
  public readonly snapshot: CommercePaymentsRuntimeSnapshotApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.snapshot = new CommercePaymentsRuntimeSnapshotApi(client);
  }

}

export interface CommercePaymentsRouteRulesListParams {
  methodCode?: 'wechat_pay' | 'alipay' | 'paypal' | 'card' | 'apple_pay' | 'google_pay' | 'wallet_balance';
  countryCode?: string;
  currencyCode?: string;
  page?: string;
  pageSize?: string;
  status?: string;
}

export class CommercePaymentsRouteRulesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Payments Route Rules List */
  async list(params?: CommercePaymentsRouteRulesListParams): Promise<PaymentsRouteRulesListResult> {
    const query = buildQueryString([
      { name: 'method_code', value: params?.methodCode, style: 'form', explode: true, allowReserved: false },
      { name: 'country_code', value: params?.countryCode, style: 'form', explode: true, allowReserved: false },
      { name: 'currency_code', value: params?.currencyCode, style: 'form', explode: true, allowReserved: false },
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<PaymentsRouteRulesListResult>(appendQueryString(backendApiPath(`/payments/route_rules`), query));
  }
}

export interface CommercePaymentsReconciliationRunsListParams {
  providerCode?: 'wechat_pay' | 'alipay' | 'paypal' | 'stripe' | 'apple_pay' | 'google_pay';
  businessDate?: string;
  page?: string;
  pageSize?: string;
  status?: string;
}

export class CommercePaymentsReconciliationRunsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Payments Reconciliation Runs List */
  async list(params?: CommercePaymentsReconciliationRunsListParams): Promise<PaymentsReconciliationRunsListResult> {
    const query = buildQueryString([
      { name: 'provider_code', value: params?.providerCode, style: 'form', explode: true, allowReserved: false },
      { name: 'business_date', value: params?.businessDate, style: 'form', explode: true, allowReserved: false },
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<PaymentsReconciliationRunsListResult>(appendQueryString(backendApiPath(`/payments/reconciliation_runs`), query));
  }
}

export interface CommercePaymentsProvidersListParams {
  page?: string;
  pageSize?: string;
  status?: string;
}

export class CommercePaymentsProvidersApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Payments Providers List */
  async list(params?: CommercePaymentsProvidersListParams): Promise<PaymentsProvidersListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<PaymentsProvidersListResult>(appendQueryString(backendApiPath(`/payments/providers`), query));
  }
}

export interface CommercePaymentsProviderAccountsStatusUpdateParams {
  idempotencyKey: string;
}

export class CommercePaymentsProviderAccountsStatusApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Payments Provider Accounts Status Update */
  async update(providerAccountId: string, body: CommercePaymentProviderAccountStatusUpdateRequest, params: CommercePaymentsProviderAccountsStatusUpdateParams): Promise<PaymentsProviderAccountsStatusUpdateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.patch<PaymentsProviderAccountsStatusUpdateResult>(backendApiPath(`/payments/provider_accounts/${serializePathParameter(providerAccountId, { name: 'providerAccountId', style: 'simple', explode: false })}/status`), body, undefined, requestHeaders, 'application/json');
  }
}

export interface CommercePaymentsProviderAccountsListParams {
  providerCode?: 'wechat_pay' | 'alipay' | 'paypal' | 'stripe' | 'apple_pay' | 'google_pay';
  page?: string;
  pageSize?: string;
  status?: string;
}

export interface CommercePaymentsProviderAccountsCreateParams {
  idempotencyKey: string;
}

export interface CommercePaymentsProviderAccountsUpdateParams {
  idempotencyKey: string;
}

export class CommercePaymentsProviderAccountsApi {
  private client: HttpClient;
  public readonly status: CommercePaymentsProviderAccountsStatusApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.status = new CommercePaymentsProviderAccountsStatusApi(client);
  }


/** Payments Provider Accounts List */
  async list(params?: CommercePaymentsProviderAccountsListParams): Promise<PaymentsProviderAccountsListResult> {
    const query = buildQueryString([
      { name: 'provider_code', value: params?.providerCode, style: 'form', explode: true, allowReserved: false },
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<PaymentsProviderAccountsListResult>(appendQueryString(backendApiPath(`/payments/provider_accounts`), query));
  }

/** Payments Provider Accounts Create */
  async create(body: CommercePaymentProviderAccountMutationRequest, params: CommercePaymentsProviderAccountsCreateParams): Promise<PaymentsProviderAccountsCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<PaymentsProviderAccountsCreateResult>(backendApiPath(`/payments/provider_accounts`), body, undefined, requestHeaders, 'application/json');
  }

/** Payments Provider Accounts Delete */
  async delete(providerAccountId: string): Promise<PaymentsProviderAccountsDeleteResult> {
    return this.client.delete<PaymentsProviderAccountsDeleteResult>(backendApiPath(`/payments/provider_accounts/${serializePathParameter(providerAccountId, { name: 'providerAccountId', style: 'simple', explode: false })}`));
  }

/** Payments Provider Accounts Update */
  async update(providerAccountId: string, body: CommercePaymentProviderAccountMutationRequest, params: CommercePaymentsProviderAccountsUpdateParams): Promise<PaymentsProviderAccountsUpdateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.patch<PaymentsProviderAccountsUpdateResult>(backendApiPath(`/payments/provider_accounts/${serializePathParameter(providerAccountId, { name: 'providerAccountId', style: 'simple', explode: false })}`), body, undefined, requestHeaders, 'application/json');
  }
}

export interface CommercePaymentsMethodsListParams {
  page?: string;
  pageSize?: string;
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
    return this.client.get<PaymentsMethodsListResult>(appendQueryString(backendApiPath(`/payments/methods`), query));
  }
}

export interface CommercePaymentsIntentsListParams {
  orderId?: string;
  providerCode?: 'wechat_pay' | 'alipay' | 'paypal' | 'stripe' | 'apple_pay' | 'google_pay';
  page?: string;
  pageSize?: string;
  status?: string;
}

export class CommercePaymentsIntentsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Payments Intents List */
  async list(params?: CommercePaymentsIntentsListParams): Promise<PaymentsIntentsListResult> {
    const query = buildQueryString([
      { name: 'order_id', value: params?.orderId, style: 'form', explode: true, allowReserved: false },
      { name: 'provider_code', value: params?.providerCode, style: 'form', explode: true, allowReserved: false },
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<PaymentsIntentsListResult>(appendQueryString(backendApiPath(`/payments/intents`), query));
  }
}

export interface CommercePaymentsChannelsListParams {
  providerAccountId?: string;
  methodCode?: 'wechat_pay' | 'alipay' | 'paypal' | 'card' | 'apple_pay' | 'google_pay' | 'wallet_balance';
  page?: string;
  pageSize?: string;
  status?: string;
}

export class CommercePaymentsChannelsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Payments Channels List */
  async list(params?: CommercePaymentsChannelsListParams): Promise<PaymentsChannelsListResult> {
    const query = buildQueryString([
      { name: 'provider_account_id', value: params?.providerAccountId, style: 'form', explode: true, allowReserved: false },
      { name: 'method_code', value: params?.methodCode, style: 'form', explode: true, allowReserved: false },
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<PaymentsChannelsListResult>(appendQueryString(backendApiPath(`/payments/channels`), query));
  }
}

export interface CommercePaymentsAttemptsListParams {
  intentId?: string;
  providerCode?: 'wechat_pay' | 'alipay' | 'paypal' | 'stripe' | 'apple_pay' | 'google_pay';
  page?: string;
  pageSize?: string;
  status?: string;
}

export class CommercePaymentsAttemptsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Payments Attempts List */
  async list(params?: CommercePaymentsAttemptsListParams): Promise<PaymentsAttemptsListResult> {
    const query = buildQueryString([
      { name: 'intent_id', value: params?.intentId, style: 'form', explode: true, allowReserved: false },
      { name: 'provider_code', value: params?.providerCode, style: 'form', explode: true, allowReserved: false },
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<PaymentsAttemptsListResult>(appendQueryString(backendApiPath(`/payments/attempts`), query));
  }
}

export class CommercePaymentsApi {
  private client: HttpClient;
  public readonly attempts: CommercePaymentsAttemptsApi;
  public readonly channels: CommercePaymentsChannelsApi;
  public readonly intents: CommercePaymentsIntentsApi;
  public readonly methods: CommercePaymentsMethodsApi;
  public readonly providerAccounts: CommercePaymentsProviderAccountsApi;
  public readonly providers: CommercePaymentsProvidersApi;
  public readonly reconciliationRuns: CommercePaymentsReconciliationRunsApi;
  public readonly routeRules: CommercePaymentsRouteRulesApi;
  public readonly runtime: CommercePaymentsRuntimeApi;
  public readonly webhookEvents: CommercePaymentsWebhookEventsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.attempts = new CommercePaymentsAttemptsApi(client);
    this.channels = new CommercePaymentsChannelsApi(client);
    this.intents = new CommercePaymentsIntentsApi(client);
    this.methods = new CommercePaymentsMethodsApi(client);
    this.providerAccounts = new CommercePaymentsProviderAccountsApi(client);
    this.providers = new CommercePaymentsProvidersApi(client);
    this.reconciliationRuns = new CommercePaymentsReconciliationRunsApi(client);
    this.routeRules = new CommercePaymentsRouteRulesApi(client);
    this.runtime = new CommercePaymentsRuntimeApi(client);
    this.webhookEvents = new CommercePaymentsWebhookEventsApi(client);
  }

}

export interface CommerceOrdersEventsListParams {
  page?: string;
  pageSize?: string;
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
    return this.client.get<OrdersEventsListResult>(appendQueryString(backendApiPath(`/orders/${serializePathParameter(orderId, { name: 'orderId', style: 'simple', explode: false })}/events`), query));
  }
}

export interface CommerceOrdersListParams {
  page?: string;
  pageSize?: string;
  status?: string;
}

export class CommerceOrdersApi {
  private client: HttpClient;
  public readonly events: CommerceOrdersEventsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.events = new CommerceOrdersEventsApi(client);
  }


/** Orders List */
  async list(params?: CommerceOrdersListParams): Promise<OrdersListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<OrdersListResult>(appendQueryString(backendApiPath(`/orders`), query));
  }

/** Orders Retrieve */
  async retrieve(orderId: string): Promise<OrdersRetrieveResult> {
    return this.client.get<OrdersRetrieveResult>(backendApiPath(`/orders/${serializePathParameter(orderId, { name: 'orderId', style: 'simple', explode: false })}`));
  }
}

export interface CommerceMembershipsPlansListParams {
  page?: string;
  pageSize?: string;
  status?: string;
}

export interface CommerceMembershipsPlansCreateParams {
  idempotencyKey: string;
}

export interface CommerceMembershipsPlansUpdateParams {
  idempotencyKey: string;
}

export class CommerceMembershipsPlansApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Memberships Plans List */
  async list(params?: CommerceMembershipsPlansListParams): Promise<MembershipsPlansListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<MembershipsPlansListResult>(appendQueryString(backendApiPath(`/memberships/plans`), query));
  }

/** Memberships Plans Create */
  async create(body: CommerceMembershipPlanMutationRequest, params: CommerceMembershipsPlansCreateParams): Promise<MembershipsPlansCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<MembershipsPlansCreateResult>(backendApiPath(`/memberships/plans`), body, undefined, requestHeaders, 'application/json');
  }

/** Memberships Plans Delete */
  async delete(planId: string): Promise<MembershipsPlansDeleteResult> {
    return this.client.delete<MembershipsPlansDeleteResult>(backendApiPath(`/memberships/plans/${serializePathParameter(planId, { name: 'planId', style: 'simple', explode: false })}`));
  }

/** Memberships Plans Update */
  async update(planId: string, body: CommerceMembershipPlanMutationRequest, params: CommerceMembershipsPlansUpdateParams): Promise<MembershipsPlansUpdateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.put<MembershipsPlansUpdateResult>(backendApiPath(`/memberships/plans/${serializePathParameter(planId, { name: 'planId', style: 'simple', explode: false })}`), body, undefined, requestHeaders, 'application/json');
  }
}

export interface CommerceMembershipsPackagesListParams {
  page?: string;
  pageSize?: string;
  packageGroupId?: string;
  planId?: string;
  status?: string;
}

export interface CommerceMembershipsPackagesCreateParams {
  idempotencyKey: string;
}

export interface CommerceMembershipsPackagesUpdateParams {
  idempotencyKey: string;
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
      { name: 'package_group_id', value: params?.packageGroupId, style: 'form', explode: true, allowReserved: false },
      { name: 'plan_id', value: params?.planId, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<MembershipsPackagesListResult>(appendQueryString(backendApiPath(`/memberships/packages`), query));
  }

/** Memberships Packages Create */
  async create(body: CommerceMembershipPackageMutationRequest, params: CommerceMembershipsPackagesCreateParams): Promise<MembershipsPackagesCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<MembershipsPackagesCreateResult>(backendApiPath(`/memberships/packages`), body, undefined, requestHeaders, 'application/json');
  }

/** Memberships Packages Delete */
  async delete(packageId: string): Promise<MembershipsPackagesDeleteResult> {
    return this.client.delete<MembershipsPackagesDeleteResult>(backendApiPath(`/memberships/packages/${serializePathParameter(packageId, { name: 'packageId', style: 'simple', explode: false })}`));
  }

/** Memberships Packages Update */
  async update(packageId: string, body: CommerceMembershipPackageMutationRequest, params: CommerceMembershipsPackagesUpdateParams): Promise<MembershipsPackagesUpdateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.put<MembershipsPackagesUpdateResult>(backendApiPath(`/memberships/packages/${serializePathParameter(packageId, { name: 'packageId', style: 'simple', explode: false })}`), body, undefined, requestHeaders, 'application/json');
  }
}

export interface CommerceMembershipsPackageGroupsListParams {
  page?: string;
  pageSize?: string;
  status?: string;
}

export interface CommerceMembershipsPackageGroupsCreateParams {
  idempotencyKey: string;
}

export interface CommerceMembershipsPackageGroupsUpdateParams {
  idempotencyKey: string;
}

export class CommerceMembershipsPackageGroupsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Memberships Package Groups List */
  async list(params?: CommerceMembershipsPackageGroupsListParams): Promise<MembershipsPackageGroupsListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<MembershipsPackageGroupsListResult>(appendQueryString(backendApiPath(`/memberships/package_groups`), query));
  }

/** Memberships Package Groups Create */
  async create(body: CommerceMembershipPackageGroupMutationRequest, params: CommerceMembershipsPackageGroupsCreateParams): Promise<MembershipsPackageGroupsCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<MembershipsPackageGroupsCreateResult>(backendApiPath(`/memberships/package_groups`), body, undefined, requestHeaders, 'application/json');
  }

/** Memberships Package Groups Delete */
  async delete(packageGroupId: string): Promise<MembershipsPackageGroupsDeleteResult> {
    return this.client.delete<MembershipsPackageGroupsDeleteResult>(backendApiPath(`/memberships/package_groups/${serializePathParameter(packageGroupId, { name: 'packageGroupId', style: 'simple', explode: false })}`));
  }

/** Memberships Package Groups Update */
  async update(packageGroupId: string, body: CommerceMembershipPackageGroupMutationRequest, params: CommerceMembershipsPackageGroupsUpdateParams): Promise<MembershipsPackageGroupsUpdateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.put<MembershipsPackageGroupsUpdateResult>(backendApiPath(`/memberships/package_groups/${serializePathParameter(packageGroupId, { name: 'packageGroupId', style: 'simple', explode: false })}`), body, undefined, requestHeaders, 'application/json');
  }
}

export interface CommerceMembershipsMembersStatusUpdateParams {
  idempotencyKey: string;
}

export class CommerceMembershipsMembersStatusApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Memberships Members Status Update */
  async update(membershipId: string, body: CommerceMembershipMemberStatusRequest, params: CommerceMembershipsMembersStatusUpdateParams): Promise<MembershipsMembersStatusUpdateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.patch<MembershipsMembersStatusUpdateResult>(backendApiPath(`/memberships/members/${serializePathParameter(membershipId, { name: 'membershipId', style: 'simple', explode: false })}/status`), body, undefined, requestHeaders, 'application/json');
  }
}

export interface CommerceMembershipsMembersListParams {
  page?: string;
  pageSize?: string;
  cursor?: string;
  userId?: string;
  planId?: string;
  status?: string;
}

export class CommerceMembershipsMembersApi {
  private client: HttpClient;
  public readonly status: CommerceMembershipsMembersStatusApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.status = new CommerceMembershipsMembersStatusApi(client);
  }


/** Memberships Members List */
  async list(params?: CommerceMembershipsMembersListParams): Promise<MembershipsMembersListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'user_id', value: params?.userId, style: 'form', explode: true, allowReserved: false },
      { name: 'plan_id', value: params?.planId, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<MembershipsMembersListResult>(appendQueryString(backendApiPath(`/memberships/members`), query));
  }
}

export interface CommerceMembershipsEntitlementsListParams {
  page?: string;
  pageSize?: string;
  planId?: string;
  membershipId?: string;
  status?: string;
}

export class CommerceMembershipsEntitlementsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Memberships Entitlements List */
  async list(params?: CommerceMembershipsEntitlementsListParams): Promise<MembershipsEntitlementsListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'plan_id', value: params?.planId, style: 'form', explode: true, allowReserved: false },
      { name: 'membership_id', value: params?.membershipId, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<MembershipsEntitlementsListResult>(appendQueryString(backendApiPath(`/memberships/entitlements`), query));
  }
}

export class CommerceMembershipsApi {
  private client: HttpClient;
  public readonly entitlements: CommerceMembershipsEntitlementsApi;
  public readonly members: CommerceMembershipsMembersApi;
  public readonly packageGroups: CommerceMembershipsPackageGroupsApi;
  public readonly packages: CommerceMembershipsPackagesApi;
  public readonly plans: CommerceMembershipsPlansApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.entitlements = new CommerceMembershipsEntitlementsApi(client);
    this.members = new CommerceMembershipsMembersApi(client);
    this.packageGroups = new CommerceMembershipsPackageGroupsApi(client);
    this.packages = new CommerceMembershipsPackagesApi(client);
    this.plans = new CommerceMembershipsPlansApi(client);
  }

}

export interface CommerceInvoicesTitlesListParams {
  page?: string;
  pageSize?: string;
  status?: string;
}

export class CommerceInvoicesTitlesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Invoices Titles List */
  async list(params?: CommerceInvoicesTitlesListParams): Promise<InvoicesTitlesListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<InvoicesTitlesListResult>(appendQueryString(backendApiPath(`/invoices/titles`), query));
  }
}

export interface CommerceInvoicesListParams {
  page?: string;
  pageSize?: string;
  status?: string;
}

export class CommerceInvoicesApi {
  private client: HttpClient;
  public readonly titles: CommerceInvoicesTitlesApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.titles = new CommerceInvoicesTitlesApi(client);
  }


/** Invoices List */
  async list(params?: CommerceInvoicesListParams): Promise<InvoicesListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<InvoicesListResult>(appendQueryString(backendApiPath(`/invoices`), query));
  }

/** Invoices Retrieve */
  async retrieve(invoiceId: string): Promise<InvoicesRetrieveResult> {
    return this.client.get<InvoicesRetrieveResult>(backendApiPath(`/invoices/${serializePathParameter(invoiceId, { name: 'invoiceId', style: 'simple', explode: false })}`));
  }
}

export interface CommerceInventoryStocksListParams {
  skuId?: string;
  warehouseId?: string;
  status?: string;
  page?: string;
  pageSize?: string;
}

export interface CommerceInventoryStocksUpdateParams {
  idempotencyKey: string;
}

export class CommerceInventoryStocksApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List inventory stock records */
  async list(params?: CommerceInventoryStocksListParams): Promise<InventoryStocksListResult> {
    const query = buildQueryString([
      { name: 'sku_id', value: params?.skuId, style: 'form', explode: true, allowReserved: false },
      { name: 'warehouse_id', value: params?.warehouseId, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<InventoryStocksListResult>(appendQueryString(backendApiPath(`/inventory/stocks`), query));
  }

/** Update inventory stock */
  async update(stockId: string, body: CommerceInventoryStockUpdateRequest, params: CommerceInventoryStocksUpdateParams): Promise<InventoryStocksUpdateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.patch<InventoryStocksUpdateResult>(backendApiPath(`/inventory/stocks/${serializePathParameter(stockId, { name: 'stockId', style: 'simple', explode: false })}`), body, undefined, requestHeaders, 'application/json');
  }
}

export interface CommerceInventoryReservationsListParams {
  skuId?: string;
  orderId?: string;
  checkoutSessionId?: string;
  status?: string;
  page?: string;
  pageSize?: string;
}

export class CommerceInventoryReservationsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List inventory reservations */
  async list(params?: CommerceInventoryReservationsListParams): Promise<InventoryReservationsListResult> {
    const query = buildQueryString([
      { name: 'sku_id', value: params?.skuId, style: 'form', explode: true, allowReserved: false },
      { name: 'order_id', value: params?.orderId, style: 'form', explode: true, allowReserved: false },
      { name: 'checkout_session_id', value: params?.checkoutSessionId, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<InventoryReservationsListResult>(appendQueryString(backendApiPath(`/inventory/reservations`), query));
  }
}

export interface CommerceInventoryLedgerEntriesListParams {
  skuId?: string;
  warehouseId?: string;
  sourceType?: string;
  sourceId?: string;
  page?: string;
  pageSize?: string;
}

export class CommerceInventoryLedgerEntriesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List inventory ledger entries */
  async list(params?: CommerceInventoryLedgerEntriesListParams): Promise<InventoryLedgerEntriesListResult> {
    const query = buildQueryString([
      { name: 'sku_id', value: params?.skuId, style: 'form', explode: true, allowReserved: false },
      { name: 'warehouse_id', value: params?.warehouseId, style: 'form', explode: true, allowReserved: false },
      { name: 'source_type', value: params?.sourceType, style: 'form', explode: true, allowReserved: false },
      { name: 'source_id', value: params?.sourceId, style: 'form', explode: true, allowReserved: false },
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<InventoryLedgerEntriesListResult>(appendQueryString(backendApiPath(`/inventory/ledger_entries`), query));
  }
}

export class CommerceInventoryApi {
  private client: HttpClient;
  public readonly ledgerEntries: CommerceInventoryLedgerEntriesApi;
  public readonly reservations: CommerceInventoryReservationsApi;
  public readonly stocks: CommerceInventoryStocksApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.ledgerEntries = new CommerceInventoryLedgerEntriesApi(client);
    this.reservations = new CommerceInventoryReservationsApi(client);
    this.stocks = new CommerceInventoryStocksApi(client);
  }

}

export interface CommerceFulfillmentsListParams {
  page?: string;
  pageSize?: string;
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
    return this.client.get<FulfillmentsListResult>(appendQueryString(backendApiPath(`/fulfillments`), query));
  }
}

export interface CommerceCommerceReportsRefundsListParams {
  page?: string;
  pageSize?: string;
  status?: string;
}

export class CommerceCommerceReportsRefundsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Commerce Reports Refunds List */
  async list(params?: CommerceCommerceReportsRefundsListParams): Promise<CommerceReportsRefundsListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CommerceReportsRefundsListResult>(appendQueryString(backendApiPath(`/commerce_reports/refunds`), query));
  }
}

export class CommerceCommerceReportsPaymentReconciliationApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Commerce Reports Payment Reconciliation Retrieve */
  async retrieve(): Promise<CommerceReportsPaymentReconciliationRetrieveResult> {
    return this.client.get<CommerceReportsPaymentReconciliationRetrieveResult>(backendApiPath(`/commerce_reports/payment_reconciliation`));
  }
}

export interface CommerceCommerceReportsOrderRevenueListParams {
  page?: string;
  pageSize?: string;
  status?: string;
}

export class CommerceCommerceReportsOrderRevenueApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Commerce Reports Order Revenue List */
  async list(params?: CommerceCommerceReportsOrderRevenueListParams): Promise<CommerceReportsOrderRevenueListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CommerceReportsOrderRevenueListResult>(appendQueryString(backendApiPath(`/commerce_reports/order_revenue`), query));
  }
}

export class CommerceCommerceReportsApi {
  private client: HttpClient;
  public readonly orderRevenue: CommerceCommerceReportsOrderRevenueApi;
  public readonly paymentReconciliation: CommerceCommerceReportsPaymentReconciliationApi;
  public readonly refunds: CommerceCommerceReportsRefundsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.orderRevenue = new CommerceCommerceReportsOrderRevenueApi(client);
    this.paymentReconciliation = new CommerceCommerceReportsPaymentReconciliationApi(client);
    this.refunds = new CommerceCommerceReportsRefundsApi(client);
  }

}

export interface CommerceAuditCommerceEventsListParams {
  page?: string;
  pageSize?: string;
  status?: string;
}

export class CommerceAuditCommerceEventsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Audit Commerce Events List */
  async list(params?: CommerceAuditCommerceEventsListParams): Promise<AuditCommerceEventsListResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<AuditCommerceEventsListResult>(appendQueryString(backendApiPath(`/audit/commerce_events`), query));
  }
}

export class CommerceAuditApi {
  private client: HttpClient;
  public readonly commerceEvents: CommerceAuditCommerceEventsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.commerceEvents = new CommerceAuditCommerceEventsApi(client);
  }

}

export class CommerceApi {
  private client: HttpClient;
  public readonly audit: CommerceAuditApi;
  public readonly commerceReports: CommerceCommerceReportsApi;
  public readonly fulfillments: CommerceFulfillmentsApi;
  public readonly inventory: CommerceInventoryApi;
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
    this.audit = new CommerceAuditApi(client);
    this.commerceReports = new CommerceCommerceReportsApi(client);
    this.fulfillments = new CommerceFulfillmentsApi(client);
    this.inventory = new CommerceInventoryApi(client);
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
