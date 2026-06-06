import { backendApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { CatalogCategoryAttributesCreateResult, CatalogCategoryAttributesDeleteResult, CatalogCategoryAttributesListResult, CatalogCategoryAttributesUpdateResult, CatalogCategorySeedsCreateResult, CatalogProductsDeleteResult, CatalogSkusDeleteResult, CommerceCategorySeedInitializeRequest, CommerceInventoryStockUpdateRequest, CommerceMembershipMemberStatusRequest, CommerceMembershipPackageGroupMutationRequest, CommerceMembershipPackageMutationRequest, CommerceMembershipPlanMutationRequest, CommercePaymentProviderAccountStatusUpdateRequest, CommerceProductCategoryAttributeMutationRequest, CommerceRechargeSettingsUpdateRequest, InventoryStocksUpdateResult, MembershipsMembersStatusUpdateResult, MembershipsPackageGroupsUpdateResult, MembershipsPackagesUpdateResult, MembershipsPlansUpdateResult, OrdersRetrieveResult, PaymentsProviderAccountsDeleteResult, PaymentsProviderAccountsStatusUpdateResult, PaymentsProvidersListResult, PaymentsRuntimeSnapshotRetrieveResult, RechargesPackagesDeleteResult, RechargesSettingsRetrieveResult, RechargesSettingsUpdateResult, ShipmentsTrackingEventsListResult } from '../types';


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

export class CommerceShipmentsApi {
  private client: HttpClient;
  public readonly trackingEvents: CommerceShipmentsTrackingEventsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.trackingEvents = new CommerceShipmentsTrackingEventsApi(client);
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

export class CommerceRechargesPackagesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Recharges Packages Delete */
  async delete(packageId: string): Promise<RechargesPackagesDeleteResult> {
    return this.client.delete<RechargesPackagesDeleteResult>(backendApiPath(`/recharges/packages/${serializePathParameter(packageId, { name: 'packageId', style: 'simple', explode: false })}`));
  }
}

export class CommerceRechargesApi {
  private client: HttpClient;
  public readonly packages: CommerceRechargesPackagesApi;
  public readonly settings: CommerceRechargesSettingsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.packages = new CommerceRechargesPackagesApi(client);
    this.settings = new CommerceRechargesSettingsApi(client);
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

export class CommercePaymentsProviderAccountsApi {
  private client: HttpClient;
  public readonly status: CommercePaymentsProviderAccountsStatusApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.status = new CommercePaymentsProviderAccountsStatusApi(client);
  }


/** Payments Provider Accounts Delete */
  async delete(providerAccountId: string): Promise<PaymentsProviderAccountsDeleteResult> {
    return this.client.delete<PaymentsProviderAccountsDeleteResult>(backendApiPath(`/payments/provider_accounts/${serializePathParameter(providerAccountId, { name: 'providerAccountId', style: 'simple', explode: false })}`));
  }
}

export class CommercePaymentsApi {
  private client: HttpClient;
  public readonly providerAccounts: CommercePaymentsProviderAccountsApi;
  public readonly providers: CommercePaymentsProvidersApi;
  public readonly runtime: CommercePaymentsRuntimeApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.providerAccounts = new CommercePaymentsProviderAccountsApi(client);
    this.providers = new CommercePaymentsProvidersApi(client);
    this.runtime = new CommercePaymentsRuntimeApi(client);
  }

}

export class CommerceOrdersApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Orders Retrieve */
  async retrieve(orderId: string): Promise<OrdersRetrieveResult> {
    return this.client.get<OrdersRetrieveResult>(backendApiPath(`/orders/${serializePathParameter(orderId, { name: 'orderId', style: 'simple', explode: false })}`));
  }
}

export interface CommerceMembershipsPlansUpdateParams {
  idempotencyKey: string;
}

export class CommerceMembershipsPlansApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
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

export interface CommerceMembershipsPackagesUpdateParams {
  idempotencyKey: string;
}

export class CommerceMembershipsPackagesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
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

export interface CommerceMembershipsPackageGroupsUpdateParams {
  idempotencyKey: string;
}

export class CommerceMembershipsPackageGroupsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
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

export class CommerceMembershipsMembersApi {
  private client: HttpClient;
  public readonly status: CommerceMembershipsMembersStatusApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.status = new CommerceMembershipsMembersStatusApi(client);
  }

}

export class CommerceMembershipsApi {
  private client: HttpClient;
  public readonly members: CommerceMembershipsMembersApi;
  public readonly packageGroups: CommerceMembershipsPackageGroupsApi;
  public readonly packages: CommerceMembershipsPackagesApi;
  public readonly plans: CommerceMembershipsPlansApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.members = new CommerceMembershipsMembersApi(client);
    this.packageGroups = new CommerceMembershipsPackageGroupsApi(client);
    this.packages = new CommerceMembershipsPackagesApi(client);
    this.plans = new CommerceMembershipsPlansApi(client);
  }

}

export interface CommerceInventoryStocksUpdateParams {
  idempotencyKey: string;
}

export class CommerceInventoryStocksApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
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

export class CommerceInventoryApi {
  private client: HttpClient;
  public readonly stocks: CommerceInventoryStocksApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.stocks = new CommerceInventoryStocksApi(client);
  }

}

export class CommerceCatalogSkusApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Delete product SKU */
  async delete(skuId: string): Promise<CatalogSkusDeleteResult> {
    return this.client.delete<CatalogSkusDeleteResult>(backendApiPath(`/catalog/skus/${serializePathParameter(skuId, { name: 'skuId', style: 'simple', explode: false })}`));
  }
}

export class CommerceCatalogProductsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Delete product SPU */
  async delete(productId: string): Promise<CatalogProductsDeleteResult> {
    return this.client.delete<CatalogProductsDeleteResult>(backendApiPath(`/catalog/products/${serializePathParameter(productId, { name: 'productId', style: 'simple', explode: false })}`));
  }
}

export interface CommerceCatalogCategorySeedsCreateParams {
  idempotencyKey: string;
}

export class CommerceCatalogCategorySeedsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Initialize admin category seed datasets */
  async create(body: CommerceCategorySeedInitializeRequest, params: CommerceCatalogCategorySeedsCreateParams): Promise<CatalogCategorySeedsCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<CatalogCategorySeedsCreateResult>(backendApiPath(`/catalog/category_seeds/initialize`), body, undefined, requestHeaders, 'application/json');
  }
}

export interface CommerceCatalogCategoryAttributesListParams {
  categoryId?: string;
  attributeId?: string;
  status?: string;
  page?: string;
  pageSize?: string;
}

export interface CommerceCatalogCategoryAttributesCreateParams {
  idempotencyKey: string;
}

export interface CommerceCatalogCategoryAttributesUpdateParams {
  idempotencyKey: string;
}

export class CommerceCatalogCategoryAttributesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List category attribute bindings */
  async list(params?: CommerceCatalogCategoryAttributesListParams): Promise<CatalogCategoryAttributesListResult> {
    const query = buildQueryString([
      { name: 'category_id', value: params?.categoryId, style: 'form', explode: true, allowReserved: false },
      { name: 'attribute_id', value: params?.attributeId, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CatalogCategoryAttributesListResult>(appendQueryString(backendApiPath(`/catalog/category_attributes`), query));
  }

/** Create category attribute binding */
  async create(body: CommerceProductCategoryAttributeMutationRequest, params: CommerceCatalogCategoryAttributesCreateParams): Promise<CatalogCategoryAttributesCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<CatalogCategoryAttributesCreateResult>(backendApiPath(`/catalog/category_attributes`), body, undefined, requestHeaders, 'application/json');
  }

/** Delete category attribute binding */
  async delete(bindingId: string): Promise<CatalogCategoryAttributesDeleteResult> {
    return this.client.delete<CatalogCategoryAttributesDeleteResult>(backendApiPath(`/catalog/category_attributes/${serializePathParameter(bindingId, { name: 'bindingId', style: 'simple', explode: false })}`));
  }

/** Update category attribute binding */
  async update(bindingId: string, body: CommerceProductCategoryAttributeMutationRequest, params: CommerceCatalogCategoryAttributesUpdateParams): Promise<CatalogCategoryAttributesUpdateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.patch<CatalogCategoryAttributesUpdateResult>(backendApiPath(`/catalog/category_attributes/${serializePathParameter(bindingId, { name: 'bindingId', style: 'simple', explode: false })}`), body, undefined, requestHeaders, 'application/json');
  }
}

export class CommerceCatalogApi {
  private client: HttpClient;
  public readonly categoryAttributes: CommerceCatalogCategoryAttributesApi;
  public readonly categorySeeds: CommerceCatalogCategorySeedsApi;
  public readonly products: CommerceCatalogProductsApi;
  public readonly skus: CommerceCatalogSkusApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.categoryAttributes = new CommerceCatalogCategoryAttributesApi(client);
    this.categorySeeds = new CommerceCatalogCategorySeedsApi(client);
    this.products = new CommerceCatalogProductsApi(client);
    this.skus = new CommerceCatalogSkusApi(client);
  }

}

export class CommerceApi {
  private client: HttpClient;
  public readonly catalog: CommerceCatalogApi;
  public readonly inventory: CommerceInventoryApi;
  public readonly memberships: CommerceMembershipsApi;
  public readonly orders: CommerceOrdersApi;
  public readonly payments: CommercePaymentsApi;
  public readonly recharges: CommerceRechargesApi;
  public readonly shipments: CommerceShipmentsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.catalog = new CommerceCatalogApi(client);
    this.inventory = new CommerceInventoryApi(client);
    this.memberships = new CommerceMembershipsApi(client);
    this.orders = new CommerceOrdersApi(client);
    this.payments = new CommercePaymentsApi(client);
    this.recharges = new CommerceRechargesApi(client);
    this.shipments = new CommerceShipmentsApi(client);
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
