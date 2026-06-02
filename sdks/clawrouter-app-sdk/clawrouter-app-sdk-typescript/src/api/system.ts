import { appApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { IamRuntimeRetrieveResult, IamVerificationPolicyRetrieveResult, PromotionCodeRedemptionRequest, PromotionCommandRequest, PromotionsCodesRedemptionsCreateResult, PromotionsDiscountApplicationsCreateResult, PromotionsDiscountApplicationsReleaseResult, PromotionsDiscountApplicationsReversalsCreateResult, PromotionsDiscountApplicationsSettleResult, PromotionsUserCouponsClaimsCreateResult, PromotionsUserCouponsWalletListResult } from '../types';


export class SystemIamVerificationPolicyApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Retrieve public IAM verification policy */
  async retrieve(): Promise<IamVerificationPolicyRetrieveResult> {
    return this.client.get<IamVerificationPolicyRetrieveResult>(appApiPath(`/system/iam/verification_policy`));
  }
}

export interface SystemIamRuntimeRetrieveParams {
  tenantCode?: string;
  organizationCode?: string;
}

export class SystemIamRuntimeApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Retrieve public IAM runtime settings */
  async retrieve(params?: SystemIamRuntimeRetrieveParams): Promise<IamRuntimeRetrieveResult> {
    const query = buildQueryString([
      { name: 'tenant_code', value: params?.tenantCode, style: 'form', explode: true, allowReserved: false },
      { name: 'organization_code', value: params?.organizationCode, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<IamRuntimeRetrieveResult>(appendQueryString(appApiPath(`/system/iam/runtime`), query));
  }
}

export class SystemIamApi {
  private client: HttpClient;
  public readonly runtime: SystemIamRuntimeApi;
  public readonly verificationPolicy: SystemIamVerificationPolicyApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.runtime = new SystemIamRuntimeApi(client);
    this.verificationPolicy = new SystemIamVerificationPolicyApi(client);
  }

}

export interface SystemPromotionsUserCouponsWalletListParams {
  status?: string;
}

export class SystemPromotionsUserCouponsWalletApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Promotion User Coupons Wallet List */
  async list(params?: SystemPromotionsUserCouponsWalletListParams): Promise<PromotionsUserCouponsWalletListResult> {
    const query = buildQueryString([
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<PromotionsUserCouponsWalletListResult>(appendQueryString(appApiPath(`/promotions/user_coupons`), query));
  }
}

export interface SystemPromotionsUserCouponsClaimsCreateParams {
  idempotencyKey: string;
}

export class SystemPromotionsUserCouponsClaimsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Promotion User Coupon Claim Create */
  async create(body: PromotionCommandRequest, params: SystemPromotionsUserCouponsClaimsCreateParams): Promise<PromotionsUserCouponsClaimsCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<PromotionsUserCouponsClaimsCreateResult>(appApiPath(`/promotions/user_coupon_claims`), body, undefined, requestHeaders, 'application/json');
  }
}

export class SystemPromotionsUserCouponsApi {
  private client: HttpClient;
  public readonly claims: SystemPromotionsUserCouponsClaimsApi;
  public readonly wallet: SystemPromotionsUserCouponsWalletApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.claims = new SystemPromotionsUserCouponsClaimsApi(client);
    this.wallet = new SystemPromotionsUserCouponsWalletApi(client);
  }

}

export interface SystemPromotionsDiscountApplicationsReversalsCreateParams {
  idempotencyKey: string;
}

export class SystemPromotionsDiscountApplicationsReversalsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Promotion Discount Application Reversal Create */
  async create(body: PromotionCommandRequest, params: SystemPromotionsDiscountApplicationsReversalsCreateParams): Promise<PromotionsDiscountApplicationsReversalsCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<PromotionsDiscountApplicationsReversalsCreateResult>(appApiPath(`/promotions/discount_applications/reversals`), body, undefined, requestHeaders, 'application/json');
  }
}

export interface SystemPromotionsDiscountApplicationsCreateParams {
  idempotencyKey: string;
}

export interface SystemPromotionsDiscountApplicationsReleaseParams {
  idempotencyKey: string;
}

export interface SystemPromotionsDiscountApplicationsSettleParams {
  idempotencyKey: string;
}

export class SystemPromotionsDiscountApplicationsApi {
  private client: HttpClient;
  public readonly reversals: SystemPromotionsDiscountApplicationsReversalsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.reversals = new SystemPromotionsDiscountApplicationsReversalsApi(client);
  }


/** Promotion Discount Application Create */
  async create(body: PromotionCommandRequest, params: SystemPromotionsDiscountApplicationsCreateParams): Promise<PromotionsDiscountApplicationsCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<PromotionsDiscountApplicationsCreateResult>(appApiPath(`/promotions/discount_applications`), body, undefined, requestHeaders, 'application/json');
  }

/** Promotion Discount Application Release */
  async release(applicationId: string, body: PromotionCommandRequest, params: SystemPromotionsDiscountApplicationsReleaseParams): Promise<PromotionsDiscountApplicationsReleaseResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<PromotionsDiscountApplicationsReleaseResult>(appApiPath(`/promotions/discount_applications/${serializePathParameter(applicationId, { name: 'applicationId', style: 'simple', explode: false })}/releases`), body, undefined, requestHeaders, 'application/json');
  }

/** Promotion Discount Application Settle */
  async settle(applicationId: string, body: PromotionCommandRequest, params: SystemPromotionsDiscountApplicationsSettleParams): Promise<PromotionsDiscountApplicationsSettleResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<PromotionsDiscountApplicationsSettleResult>(appApiPath(`/promotions/discount_applications/${serializePathParameter(applicationId, { name: 'applicationId', style: 'simple', explode: false })}/settlements`), body, undefined, requestHeaders, 'application/json');
  }
}

export interface SystemPromotionsCodesRedemptionsCreateParams {
  idempotencyKey: string;
}

export class SystemPromotionsCodesRedemptionsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Promotion Code Redemption Create */
  async create(body: PromotionCodeRedemptionRequest, params: SystemPromotionsCodesRedemptionsCreateParams): Promise<PromotionsCodesRedemptionsCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<PromotionsCodesRedemptionsCreateResult>(appApiPath(`/promotions/codes/redemptions`), body, undefined, requestHeaders, 'application/json');
  }
}

export class SystemPromotionsCodesApi {
  private client: HttpClient;
  public readonly redemptions: SystemPromotionsCodesRedemptionsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.redemptions = new SystemPromotionsCodesRedemptionsApi(client);
  }

}

export class SystemPromotionsApi {
  private client: HttpClient;
  public readonly codes: SystemPromotionsCodesApi;
  public readonly discountApplications: SystemPromotionsDiscountApplicationsApi;
  public readonly userCoupons: SystemPromotionsUserCouponsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.codes = new SystemPromotionsCodesApi(client);
    this.discountApplications = new SystemPromotionsDiscountApplicationsApi(client);
    this.userCoupons = new SystemPromotionsUserCouponsApi(client);
  }

}

export class SystemApi {
  private client: HttpClient;
  public readonly promotions: SystemPromotionsApi;
  public readonly iam: SystemIamApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.promotions = new SystemPromotionsApi(client);
    this.iam = new SystemIamApi(client);
  }

}

export function createSystemApi(client: HttpClient): SystemApi {
  return new SystemApi(client);
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
