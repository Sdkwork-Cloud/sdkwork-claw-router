import { appApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { ApiKeysCreateResult, ApiKeysDeleteResult, ApiKeysListResult, ApiKeysUpdateResult, CreateApiKeyRequest, DepartmentAssignmentsListResult, DepartmentsListResult, DepartmentsTreeRetrieveResult, IamCurrentSessionUpdateRequest, IamOauthAuthorizationUrlCreateRequest, IamOauthSessionCreateRequest, IamPasswordResetCreateRequest, IamPasswordResetRequestCreateRequest, IamRegistrationCreateRequest, IamSessionCreateRequest, IamSessionRefreshRequest, IamVerificationCodeCreateRequest, IamVerificationCodeVerifyRequest, OauthAuthorizationUrlsCreateResult, OauthSessionsCreateResult, OrganizationMembershipsListResult, OrganizationsListResult, OrganizationsTreeRetrieveResult, PasswordResetRequestsCreateResult, PasswordResetsCreateResult, PositionAssignmentsListResult, PositionsListResult, RegistrationsCreateResult, RoleBindingsListResult, SessionsCreateResult, SessionsCurrentDeleteResult, SessionsCurrentRetrieveResult, SessionsCurrentUpdateResult, SessionsRefreshResult, UpdateApiKeyRequest, UpdateSettingsRequest, UsersCurrentRetrieveResult, UsersSettingsRetrieveResult, UsersSettingsUpdateResult, VerificationCodesCreateResult, VerificationCodesVerifyResult } from '../types';


export class IamOauthSessionsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Create OAuth IAM session */
  async create(body: IamOauthSessionCreateRequest): Promise<OauthSessionsCreateResult> {
    return this.client.post<OauthSessionsCreateResult>(appApiPath(`/oauth/sessions`), body, undefined, undefined, 'application/json');
  }
}

export class IamOauthAuthorizationUrlsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Retrieve OAuth authorization URL */
  async create(body: IamOauthAuthorizationUrlCreateRequest): Promise<OauthAuthorizationUrlsCreateResult> {
    return this.client.post<OauthAuthorizationUrlsCreateResult>(appApiPath(`/oauth/authorization_urls`), body, undefined, undefined, 'application/json');
  }
}

export class IamOauthApi {
  private client: HttpClient;
  public readonly authorizationUrls: IamOauthAuthorizationUrlsApi;
  public readonly sessions: IamOauthSessionsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.authorizationUrls = new IamOauthAuthorizationUrlsApi(client);
    this.sessions = new IamOauthSessionsApi(client);
  }

}

export class IamVerificationCodesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Create verification code */
  async create(body: IamVerificationCodeCreateRequest): Promise<VerificationCodesCreateResult> {
    return this.client.post<VerificationCodesCreateResult>(appApiPath(`/iam/verification_codes`), body, undefined, undefined, 'application/json');
  }

/** Verify verification code */
  async verify(body: IamVerificationCodeVerifyRequest): Promise<VerificationCodesVerifyResult> {
    return this.client.post<VerificationCodesVerifyResult>(appApiPath(`/iam/verification_codes/verify`), body, undefined, undefined, 'application/json');
  }
}

export class IamUsersSettingsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List settings */
  async retrieve(): Promise<UsersSettingsRetrieveResult> {
    return this.client.get<UsersSettingsRetrieveResult>(appApiPath(`/iam/users/settings`));
  }

/** Update settings */
  async update(body: UpdateSettingsRequest): Promise<UsersSettingsUpdateResult> {
    return this.client.put<UsersSettingsUpdateResult>(appApiPath(`/iam/users/settings`), body, undefined, undefined, 'application/json');
  }
}

export class IamUsersCurrentApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Retrieve current IAM user */
  async retrieve(): Promise<UsersCurrentRetrieveResult> {
    return this.client.get<UsersCurrentRetrieveResult>(appApiPath(`/iam/users/current`));
  }
}

export class IamUsersApi {
  private client: HttpClient;
  public readonly current: IamUsersCurrentApi;
  public readonly settings: IamUsersSettingsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.current = new IamUsersCurrentApi(client);
    this.settings = new IamUsersSettingsApi(client);
  }

}

export class IamSessionsCurrentApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Delete current IAM session */
  async delete(): Promise<SessionsCurrentDeleteResult> {
    return this.client.delete<SessionsCurrentDeleteResult>(appApiPath(`/iam/sessions/current`));
  }

/** Retrieve current IAM session */
  async retrieve(): Promise<SessionsCurrentRetrieveResult> {
    return this.client.get<SessionsCurrentRetrieveResult>(appApiPath(`/iam/sessions/current`));
  }

/** Update current IAM session */
  async update(body: IamCurrentSessionUpdateRequest): Promise<SessionsCurrentUpdateResult> {
    return this.client.patch<SessionsCurrentUpdateResult>(appApiPath(`/iam/sessions/current`), body, undefined, undefined, 'application/json');
  }
}

export class IamSessionsApi {
  private client: HttpClient;
  public readonly current: IamSessionsCurrentApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.current = new IamSessionsCurrentApi(client);
  }


/** Create IAM session */
  async create(body: IamSessionCreateRequest): Promise<SessionsCreateResult> {
    return this.client.post<SessionsCreateResult>(appApiPath(`/iam/sessions`), body, undefined, undefined, 'application/json');
  }

/** Refresh IAM session */
  async refresh(body: IamSessionRefreshRequest): Promise<SessionsRefreshResult> {
    return this.client.post<SessionsRefreshResult>(appApiPath(`/iam/sessions/refresh`), body, undefined, undefined, 'application/json');
  }
}

export interface IamRoleBindingsListParams {
  organizationId?: string;
  departmentId?: string;
  userId?: string;
  scopeId?: string;
  status?: string;
  q?: string;
  page?: number;
  pageSize?: number;
}

export class IamRoleBindingsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List current IAM role bindings */
  async list(params?: IamRoleBindingsListParams): Promise<RoleBindingsListResult> {
    const query = buildQueryString([
      { name: 'organization_id', value: params?.organizationId, style: 'form', explode: true, allowReserved: false },
      { name: 'department_id', value: params?.departmentId, style: 'form', explode: true, allowReserved: false },
      { name: 'user_id', value: params?.userId, style: 'form', explode: true, allowReserved: false },
      { name: 'scope_id', value: params?.scopeId, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<RoleBindingsListResult>(appendQueryString(appApiPath(`/iam/role_bindings`), query));
  }
}

export class IamRegistrationsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Create IAM registration */
  async create(body: IamRegistrationCreateRequest): Promise<RegistrationsCreateResult> {
    return this.client.post<RegistrationsCreateResult>(appApiPath(`/iam/registrations`), body, undefined, undefined, 'application/json');
  }
}

export interface IamPositionsListParams {
  organizationId?: string;
  departmentId?: string;
  userId?: string;
  scopeId?: string;
  status?: string;
  q?: string;
  page?: number;
  pageSize?: number;
}

export class IamPositionsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List current IAM positions */
  async list(params?: IamPositionsListParams): Promise<PositionsListResult> {
    const query = buildQueryString([
      { name: 'organization_id', value: params?.organizationId, style: 'form', explode: true, allowReserved: false },
      { name: 'department_id', value: params?.departmentId, style: 'form', explode: true, allowReserved: false },
      { name: 'user_id', value: params?.userId, style: 'form', explode: true, allowReserved: false },
      { name: 'scope_id', value: params?.scopeId, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<PositionsListResult>(appendQueryString(appApiPath(`/iam/positions`), query));
  }
}

export interface IamPositionAssignmentsListParams {
  organizationId?: string;
  departmentId?: string;
  userId?: string;
  scopeId?: string;
  status?: string;
  q?: string;
  page?: number;
  pageSize?: number;
}

export class IamPositionAssignmentsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List current IAM position assignments */
  async list(params?: IamPositionAssignmentsListParams): Promise<PositionAssignmentsListResult> {
    const query = buildQueryString([
      { name: 'organization_id', value: params?.organizationId, style: 'form', explode: true, allowReserved: false },
      { name: 'department_id', value: params?.departmentId, style: 'form', explode: true, allowReserved: false },
      { name: 'user_id', value: params?.userId, style: 'form', explode: true, allowReserved: false },
      { name: 'scope_id', value: params?.scopeId, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<PositionAssignmentsListResult>(appendQueryString(appApiPath(`/iam/position_assignments`), query));
  }
}

export class IamPasswordResetsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Create password reset */
  async create(body: IamPasswordResetCreateRequest): Promise<PasswordResetsCreateResult> {
    return this.client.post<PasswordResetsCreateResult>(appApiPath(`/iam/password_resets`), body, undefined, undefined, 'application/json');
  }
}

export class IamPasswordResetRequestsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Create password reset request */
  async create(body: IamPasswordResetRequestCreateRequest): Promise<PasswordResetRequestsCreateResult> {
    return this.client.post<PasswordResetRequestsCreateResult>(appApiPath(`/iam/password_reset_requests`), body, undefined, undefined, 'application/json');
  }
}

export interface IamOrganizationsTreeRetrieveParams {
  organizationId?: string;
  departmentId?: string;
  userId?: string;
  scopeId?: string;
  status?: string;
  q?: string;
  page?: number;
  pageSize?: number;
}

export class IamOrganizationsTreeApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Retrieve current IAM organization tree */
  async retrieve(params?: IamOrganizationsTreeRetrieveParams): Promise<OrganizationsTreeRetrieveResult> {
    const query = buildQueryString([
      { name: 'organization_id', value: params?.organizationId, style: 'form', explode: true, allowReserved: false },
      { name: 'department_id', value: params?.departmentId, style: 'form', explode: true, allowReserved: false },
      { name: 'user_id', value: params?.userId, style: 'form', explode: true, allowReserved: false },
      { name: 'scope_id', value: params?.scopeId, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<OrganizationsTreeRetrieveResult>(appendQueryString(appApiPath(`/iam/organizations/tree`), query));
  }
}

export interface IamOrganizationsListParams {
  organizationId?: string;
  departmentId?: string;
  userId?: string;
  scopeId?: string;
  status?: string;
  q?: string;
  page?: number;
  pageSize?: number;
}

export class IamOrganizationsApi {
  private client: HttpClient;
  public readonly tree: IamOrganizationsTreeApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.tree = new IamOrganizationsTreeApi(client);
  }


/** List current IAM organizations */
  async list(params?: IamOrganizationsListParams): Promise<OrganizationsListResult> {
    const query = buildQueryString([
      { name: 'organization_id', value: params?.organizationId, style: 'form', explode: true, allowReserved: false },
      { name: 'department_id', value: params?.departmentId, style: 'form', explode: true, allowReserved: false },
      { name: 'user_id', value: params?.userId, style: 'form', explode: true, allowReserved: false },
      { name: 'scope_id', value: params?.scopeId, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<OrganizationsListResult>(appendQueryString(appApiPath(`/iam/organizations`), query));
  }
}

export interface IamOrganizationMembershipsListParams {
  organizationId?: string;
  departmentId?: string;
  userId?: string;
  scopeId?: string;
  status?: string;
  q?: string;
  page?: number;
  pageSize?: number;
}

export class IamOrganizationMembershipsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List current IAM organization memberships */
  async list(params?: IamOrganizationMembershipsListParams): Promise<OrganizationMembershipsListResult> {
    const query = buildQueryString([
      { name: 'organization_id', value: params?.organizationId, style: 'form', explode: true, allowReserved: false },
      { name: 'department_id', value: params?.departmentId, style: 'form', explode: true, allowReserved: false },
      { name: 'user_id', value: params?.userId, style: 'form', explode: true, allowReserved: false },
      { name: 'scope_id', value: params?.scopeId, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<OrganizationMembershipsListResult>(appendQueryString(appApiPath(`/iam/organization_memberships`), query));
  }
}

export interface IamDepartmentsTreeRetrieveParams {
  organizationId?: string;
  departmentId?: string;
  userId?: string;
  scopeId?: string;
  status?: string;
  q?: string;
  page?: number;
  pageSize?: number;
}

export class IamDepartmentsTreeApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Retrieve current IAM department tree */
  async retrieve(params?: IamDepartmentsTreeRetrieveParams): Promise<DepartmentsTreeRetrieveResult> {
    const query = buildQueryString([
      { name: 'organization_id', value: params?.organizationId, style: 'form', explode: true, allowReserved: false },
      { name: 'department_id', value: params?.departmentId, style: 'form', explode: true, allowReserved: false },
      { name: 'user_id', value: params?.userId, style: 'form', explode: true, allowReserved: false },
      { name: 'scope_id', value: params?.scopeId, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<DepartmentsTreeRetrieveResult>(appendQueryString(appApiPath(`/iam/departments/tree`), query));
  }
}

export interface IamDepartmentsListParams {
  organizationId?: string;
  departmentId?: string;
  userId?: string;
  scopeId?: string;
  status?: string;
  q?: string;
  page?: number;
  pageSize?: number;
}

export class IamDepartmentsApi {
  private client: HttpClient;
  public readonly tree: IamDepartmentsTreeApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.tree = new IamDepartmentsTreeApi(client);
  }


/** List current IAM departments */
  async list(params?: IamDepartmentsListParams): Promise<DepartmentsListResult> {
    const query = buildQueryString([
      { name: 'organization_id', value: params?.organizationId, style: 'form', explode: true, allowReserved: false },
      { name: 'department_id', value: params?.departmentId, style: 'form', explode: true, allowReserved: false },
      { name: 'user_id', value: params?.userId, style: 'form', explode: true, allowReserved: false },
      { name: 'scope_id', value: params?.scopeId, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<DepartmentsListResult>(appendQueryString(appApiPath(`/iam/departments`), query));
  }
}

export interface IamDepartmentAssignmentsListParams {
  organizationId?: string;
  departmentId?: string;
  userId?: string;
  scopeId?: string;
  status?: string;
  q?: string;
  page?: number;
  pageSize?: number;
}

export class IamDepartmentAssignmentsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List current IAM department assignments */
  async list(params?: IamDepartmentAssignmentsListParams): Promise<DepartmentAssignmentsListResult> {
    const query = buildQueryString([
      { name: 'organization_id', value: params?.organizationId, style: 'form', explode: true, allowReserved: false },
      { name: 'department_id', value: params?.departmentId, style: 'form', explode: true, allowReserved: false },
      { name: 'user_id', value: params?.userId, style: 'form', explode: true, allowReserved: false },
      { name: 'scope_id', value: params?.scopeId, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<DepartmentAssignmentsListResult>(appendQueryString(appApiPath(`/iam/department_assignments`), query));
  }
}

export interface IamApiKeysCreateParams {
  idempotencyKey: string;
}

export class IamApiKeysApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List keys */
  async list(): Promise<ApiKeysListResult> {
    return this.client.get<ApiKeysListResult>(appApiPath(`/iam/api_keys`));
  }

/** Create key */
  async create(body: CreateApiKeyRequest, params: IamApiKeysCreateParams): Promise<ApiKeysCreateResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<ApiKeysCreateResult>(appApiPath(`/iam/api_keys`), body, undefined, requestHeaders, 'application/json');
  }

/** Delete key */
  async delete(apiKeyId: string): Promise<ApiKeysDeleteResult> {
    return this.client.delete<ApiKeysDeleteResult>(appApiPath(`/iam/api_keys/${serializePathParameter(apiKeyId, { name: 'apiKeyId', style: 'simple', explode: false })}`));
  }

/** Update key */
  async update(apiKeyId: string, body: UpdateApiKeyRequest): Promise<ApiKeysUpdateResult> {
    return this.client.patch<ApiKeysUpdateResult>(appApiPath(`/iam/api_keys/${serializePathParameter(apiKeyId, { name: 'apiKeyId', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
  }
}

export class IamApi {
  private client: HttpClient;
  public readonly apiKeys: IamApiKeysApi;
  public readonly departmentAssignments: IamDepartmentAssignmentsApi;
  public readonly departments: IamDepartmentsApi;
  public readonly organizationMemberships: IamOrganizationMembershipsApi;
  public readonly organizations: IamOrganizationsApi;
  public readonly passwordResetRequests: IamPasswordResetRequestsApi;
  public readonly passwordResets: IamPasswordResetsApi;
  public readonly positionAssignments: IamPositionAssignmentsApi;
  public readonly positions: IamPositionsApi;
  public readonly registrations: IamRegistrationsApi;
  public readonly roleBindings: IamRoleBindingsApi;
  public readonly sessions: IamSessionsApi;
  public readonly users: IamUsersApi;
  public readonly verificationCodes: IamVerificationCodesApi;
  public readonly oauth: IamOauthApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.apiKeys = new IamApiKeysApi(client);
    this.departmentAssignments = new IamDepartmentAssignmentsApi(client);
    this.departments = new IamDepartmentsApi(client);
    this.organizationMemberships = new IamOrganizationMembershipsApi(client);
    this.organizations = new IamOrganizationsApi(client);
    this.passwordResetRequests = new IamPasswordResetRequestsApi(client);
    this.passwordResets = new IamPasswordResetsApi(client);
    this.positionAssignments = new IamPositionAssignmentsApi(client);
    this.positions = new IamPositionsApi(client);
    this.registrations = new IamRegistrationsApi(client);
    this.roleBindings = new IamRoleBindingsApi(client);
    this.sessions = new IamSessionsApi(client);
    this.users = new IamUsersApi(client);
    this.verificationCodes = new IamVerificationCodesApi(client);
    this.oauth = new IamOauthApi(client);
  }

}

export function createIamApi(client: HttpClient): IamApi {
  return new IamApi(client);
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
