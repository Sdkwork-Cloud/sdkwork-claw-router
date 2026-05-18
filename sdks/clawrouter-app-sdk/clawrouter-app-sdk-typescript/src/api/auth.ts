import { appApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { IamCurrentSessionUpdateRequest, IamLoginQrCodeConfirmRequest, IamOauthSessionCreateRequest, IamPasswordResetCreateRequest, IamPasswordResetRequestCreateRequest, IamRegistrationCreateRequest, IamSessionCreateRequest, IamSessionRefreshRequest, IamVerificationCodeCreateRequest, IamVerificationCodeVerifyRequest, LoginQrCodesConfirmResult, LoginQrCodesCreateResult, LoginQrCodesRetrieveResult, OauthAuthorizationUrlsRetrieveResult, OauthSessionsCreateResult, PasswordResetRequestsCreateResult, PasswordResetsCreateResult, RegistrationsCreateResult, RuntimeSettingsRetrieveResult, SessionsCreateResult, SessionsCurrentDeleteResult, SessionsCurrentRetrieveResult, SessionsCurrentUpdateResult, SessionsRefreshResult, VerificationCodesCreateResult, VerificationCodesVerifyResult, VerificationPolicyRetrieveResult } from '../types';


export class AuthVerificationPolicyApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Retrieve public IAM verification policy */
  async retrieve(): Promise<VerificationPolicyRetrieveResult> {
    return this.client.get<VerificationPolicyRetrieveResult>(appApiPath(`/auth/verification_policy`));
  }
}

export class AuthVerificationCodesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Create verification code */
  async create(body: IamVerificationCodeCreateRequest): Promise<VerificationCodesCreateResult> {
    return this.client.post<VerificationCodesCreateResult>(appApiPath(`/auth/verification_codes`), body, undefined, undefined, 'application/json');
  }

/** Verify verification code */
  async verify(body: IamVerificationCodeVerifyRequest): Promise<VerificationCodesVerifyResult> {
    return this.client.post<VerificationCodesVerifyResult>(appApiPath(`/auth/verification_codes/verify`), body, undefined, undefined, 'application/json');
  }
}

export class AuthSessionsCurrentApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Delete current IAM session */
  async delete(): Promise<SessionsCurrentDeleteResult> {
    return this.client.delete<SessionsCurrentDeleteResult>(appApiPath(`/auth/sessions/current`));
  }

/** Retrieve current IAM session */
  async retrieve(): Promise<SessionsCurrentRetrieveResult> {
    return this.client.get<SessionsCurrentRetrieveResult>(appApiPath(`/auth/sessions/current`));
  }

/** Update current IAM session */
  async update(body: IamCurrentSessionUpdateRequest): Promise<SessionsCurrentUpdateResult> {
    return this.client.patch<SessionsCurrentUpdateResult>(appApiPath(`/auth/sessions/current`), body, undefined, undefined, 'application/json');
  }
}

export interface AuthSessionsCreateParams {
  xRequestId?: string;
}

export class AuthSessionsApi {
  private client: HttpClient;
  public readonly current: AuthSessionsCurrentApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.current = new AuthSessionsCurrentApi(client);
  }


/** Create IAM session */
  async create(body: IamSessionCreateRequest, params?: AuthSessionsCreateParams): Promise<SessionsCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': { value: params?.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<SessionsCreateResult>(appApiPath(`/auth/sessions`), body, undefined, requestHeaders, 'application/json');
  }

/** Refresh IAM session */
  async refresh(body: IamSessionRefreshRequest): Promise<SessionsRefreshResult> {
    return this.client.post<SessionsRefreshResult>(appApiPath(`/auth/sessions/refresh`), body, undefined, undefined, 'application/json');
  }
}

export interface AuthRuntimeSettingsRetrieveParams {
  tenantCode?: string;
  organizationCode?: string;
}

export class AuthRuntimeSettingsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Retrieve public IAM auth runtime settings */
  async retrieve(params?: AuthRuntimeSettingsRetrieveParams): Promise<RuntimeSettingsRetrieveResult> {
    const query = buildQueryString([
      { name: 'tenant_code', value: params?.tenantCode, style: 'form', explode: true, allowReserved: false },
      { name: 'organization_code', value: params?.organizationCode, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<RuntimeSettingsRetrieveResult>(appendQueryString(appApiPath(`/auth/runtime_settings`), query));
  }
}

export interface AuthRegistrationsCreateParams {
  xRequestId?: string;
}

export class AuthRegistrationsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Create IAM registration */
  async create(body: IamRegistrationCreateRequest, params?: AuthRegistrationsCreateParams): Promise<RegistrationsCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': { value: params?.xRequestId, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<RegistrationsCreateResult>(appApiPath(`/auth/registrations`), body, undefined, requestHeaders, 'application/json');
  }
}

export class AuthLoginQrCodesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Create QR login code */
  async create(): Promise<LoginQrCodesCreateResult> {
    return this.client.post<LoginQrCodesCreateResult>(appApiPath(`/auth/qr_login_codes`));
  }

/** Confirm QR login code */
  async confirm(body: IamLoginQrCodeConfirmRequest): Promise<LoginQrCodesConfirmResult> {
    return this.client.post<LoginQrCodesConfirmResult>(appApiPath(`/auth/qr_login_codes/confirm`), body, undefined, undefined, 'application/json');
  }

/** Retrieve QR login status */
  async retrieve(qrKey: string): Promise<LoginQrCodesRetrieveResult> {
    return this.client.get<LoginQrCodesRetrieveResult>(appApiPath(`/auth/qr_login_codes/${serializePathParameter(qrKey, { name: 'qrKey', style: 'simple', explode: false })}`));
  }
}

export class AuthPasswordResetsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Create password reset */
  async create(body: IamPasswordResetCreateRequest): Promise<PasswordResetsCreateResult> {
    return this.client.post<PasswordResetsCreateResult>(appApiPath(`/auth/password_resets`), body, undefined, undefined, 'application/json');
  }
}

export class AuthPasswordResetRequestsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Create password reset request */
  async create(body: IamPasswordResetRequestCreateRequest): Promise<PasswordResetRequestsCreateResult> {
    return this.client.post<PasswordResetRequestsCreateResult>(appApiPath(`/auth/password_reset_requests`), body, undefined, undefined, 'application/json');
  }
}

export class AuthOauthSessionsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Create OAuth IAM session */
  async create(body: IamOauthSessionCreateRequest): Promise<OauthSessionsCreateResult> {
    return this.client.post<OauthSessionsCreateResult>(appApiPath(`/auth/oauth_sessions`), body, undefined, undefined, 'application/json');
  }
}

export interface AuthOauthAuthorizationUrlsRetrieveParams {
  provider: string;
  redirectUri: string;
  state?: string;
  scope?: string;
}

export class AuthOauthAuthorizationUrlsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Retrieve OAuth authorization URL */
  async retrieve(params: AuthOauthAuthorizationUrlsRetrieveParams): Promise<OauthAuthorizationUrlsRetrieveResult> {
    const query = buildQueryString([
      { name: 'provider', value: params.provider, style: 'form', explode: true, allowReserved: false },
      { name: 'redirect_uri', value: params.redirectUri, style: 'form', explode: true, allowReserved: false },
      { name: 'state', value: params.state, style: 'form', explode: true, allowReserved: false },
      { name: 'scope', value: params.scope, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<OauthAuthorizationUrlsRetrieveResult>(appendQueryString(appApiPath(`/auth/oauth_authorization_urls`), query));
  }
}

export class AuthApi {
  private client: HttpClient;
  public readonly oauthAuthorizationUrls: AuthOauthAuthorizationUrlsApi;
  public readonly oauthSessions: AuthOauthSessionsApi;
  public readonly passwordResetRequests: AuthPasswordResetRequestsApi;
  public readonly passwordResets: AuthPasswordResetsApi;
  public readonly loginQrCodes: AuthLoginQrCodesApi;
  public readonly registrations: AuthRegistrationsApi;
  public readonly runtimeSettings: AuthRuntimeSettingsApi;
  public readonly sessions: AuthSessionsApi;
  public readonly verificationCodes: AuthVerificationCodesApi;
  public readonly verificationPolicy: AuthVerificationPolicyApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.oauthAuthorizationUrls = new AuthOauthAuthorizationUrlsApi(client);
    this.oauthSessions = new AuthOauthSessionsApi(client);
    this.passwordResetRequests = new AuthPasswordResetRequestsApi(client);
    this.passwordResets = new AuthPasswordResetsApi(client);
    this.loginQrCodes = new AuthLoginQrCodesApi(client);
    this.registrations = new AuthRegistrationsApi(client);
    this.runtimeSettings = new AuthRuntimeSettingsApi(client);
    this.sessions = new AuthSessionsApi(client);
    this.verificationCodes = new AuthVerificationCodesApi(client);
    this.verificationPolicy = new AuthVerificationPolicyApi(client);
  }

}

export function createAuthApi(client: HttpClient): AuthApi {
  return new AuthApi(client);
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
