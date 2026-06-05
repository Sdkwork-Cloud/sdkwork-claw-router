import type { IamAppSdkClient, IamBackendSdkClient, IamSdkMethod } from "@sdkwork/iam-sdk-ports";

export interface CreateIamSdkAdaptersInput {
  appClient: unknown;
  backendClient?: unknown;
}

export interface IamSdkAdapters {
  app: IamAppSdkClient;
  backend?: IamBackendSdkClient;
}

type AnyRecord = Record<string, any>;

export interface IamSdkResponseEnvelope<T = unknown> {
  code?: number | string;
  data?: T;
  message?: string;
  msg?: string;
}

export function createIamSdkAdapters(input: CreateIamSdkAdaptersInput): IamSdkAdapters {
  return {
    app: createIamAppSdkAdapter(input.appClient),
    ...(input.backendClient ? { backend: createIamBackendSdkAdapter(input.backendClient) } : {}),
  };
}

export function unwrapIamSdkResponse<T = unknown>(
  value: unknown,
  fallbackMessage = "SDKWork IAM request failed.",
): T {
  if (!value || typeof value !== "object") {
    return value as T;
  }

  if (!("data" in value) && !("code" in value)) {
    return value as T;
  }

  const envelope = value as IamSdkResponseEnvelope<T>;
  if (!isSuccessCode(envelope.code)) {
    throw new Error(String(envelope.message || envelope.msg || fallbackMessage).trim());
  }

  return (envelope.data ?? null) as T;
}

export function createIamAppSdkAdapter(client: unknown): IamAppSdkClient {
  const source = toRecord(client);
  const auth = toRecord(source.auth);
  const authOauthAuthorizationUrls = toRecord(auth.oauthAuthorizationUrls);
  const authOauthSessions = toRecord(auth.oauthSessions);
  const authPasswordResetRequests = toRecord(auth.passwordResetRequests);
  const authPasswordResets = toRecord(auth.passwordResets);
  const authRegistrations = toRecord(auth.registrations);
  const authSessions = toRecord(auth.sessions);
  const authSessionsCurrent = toRecord(authSessions.current);
  const authVerificationCodes = toRecord(auth.verificationCodes);
  const openPlatform = toRecord(source.openPlatform);
  const qrAuthSessions = toRecord(openPlatform.qrAuth?.sessions);
  const qrAuthSessionScans = toRecord(qrAuthSessions.scans);
  const qrAuthSessionPasswords = toRecord(qrAuthSessions.passwords);
  const system = toRecord(source.system);
  const systemIam = toRecord(system.iam);
  const systemIamRuntime = toRecord(systemIam.runtime);
  const systemIamVerificationPolicy = toRecord(systemIam.verificationPolicy);
  const iam = toRecord(source.iam);
  const iamOrganizations = toRecord(iam.organizations);
  const iamOrganizationsTree = toRecord(iamOrganizations.tree);
  const iamOrganizationMemberships = toRecord(iam.organizationMemberships);
  const iamDepartments = toRecord(iam.departments);
  const iamDepartmentsTree = toRecord(iamDepartments.tree);
  const iamDepartmentAssignments = toRecord(iam.departmentAssignments);
  const iamPositions = toRecord(iam.positions);
  const iamPositionAssignments = toRecord(iam.positionAssignments);
  const iamRoleBindings = toRecord(iam.roleBindings);
  const iamUsers = toRecord(iam.users);
  const iamUsersCurrent = toRecord(iamUsers.current);
  const user = toRecord(source.user);

  return {
    auth: {
      oauthAuthorizationUrls: {
        retrieve: selectMethod(
          getBoundMethod(authOauthAuthorizationUrls, "retrieve"),
          (params?: Record<string, unknown>) => auth.getOauthUrl?.(params),
        ),
      },
      oauthSessions: {
        create: selectMethod(
          getBoundMethod(authOauthSessions, "create"),
          (body: Record<string, unknown>) => auth.oauthLogin?.(body),
        ),
      },
      passwordResetRequests: {
        create: selectMethod(
          getBoundMethod(authPasswordResetRequests, "create"),
          (body: Record<string, unknown>) => auth.requestPasswordResetChallenge?.(body),
        ),
      },
      passwordResets: {
        create: selectMethod(
          getBoundMethod(authPasswordResets, "create"),
          (body: Record<string, unknown>) => auth.resetPassword?.(body),
        ),
      },
      registrations: {
        create: selectMethod(
          getBoundMethod(authRegistrations, "create"),
          (body: Record<string, unknown>) => auth.register?.(body),
        ),
      },
      sessions: {
        create: selectMethod(
          getBoundMethod(authSessions, "create"),
          (body: Record<string, unknown>) => auth.login?.(body),
        ),
        current: {
          delete: selectMethod(
            getBoundMethod(authSessionsCurrent, "delete"),
            () => auth.logout?.(),
          ),
          retrieve: selectMethod(
            getBoundMethod(authSessionsCurrent, "retrieve"),
            () => user.getUserProfile?.() ?? auth.getCurrentUser?.(),
          ),
          update: selectMethod(
            getBoundMethod(authSessionsCurrent, "update"),
            (body?: Record<string, unknown>) => user.updateUserProfile?.(body),
          ),
        },
        refresh: selectMethod(
          getBoundMethod(authSessions, "refresh"),
          (body: Record<string, unknown>) => auth.refreshToken?.(body),
        ),
      },
      verificationCodes: {
        create: selectMethod(
          getBoundMethod(authVerificationCodes, "create"),
          (body: Record<string, unknown>) => auth.createSendSmsCode?.(body) ?? auth.sendSmsCode?.(body),
        ),
        verify: selectMethod(
          getBoundMethod(authVerificationCodes, "verify"),
          (body: Record<string, unknown>) => auth.verifySmsCode?.(body) ?? auth.createVerifySmsCode?.(body),
        ),
      },
    },
    openPlatform: {
      qrAuth: {
        sessions: {
          create: selectMethod(
            getBoundMethod(qrAuthSessions, "create"),
            (body: Record<string, unknown>) => callOptionalMethod(qrAuthSessions, "create", body),
          ),
          retrieve: selectGeneratedSdkMethod(
            (sessionKey: string) => callQrAuthPathMethod(qrAuthSessions, "retrieve", sessionKey),
          ),
          scans: {
            create: selectGeneratedSdkMethod(
              (sessionKey: string, body?: Record<string, unknown>) => callQrAuthPathMethod(qrAuthSessionScans, "create", sessionKey, body),
            ),
          },
          passwords: {
            create: selectGeneratedSdkMethod(
              (sessionKey: string, body: Record<string, unknown>) => callQrAuthPathMethod(qrAuthSessionPasswords, "create", sessionKey, body),
            ),
          },
        },
      },
    },
    system: {
      iam: {
        runtime: {
          retrieve: selectMethod(
            getBoundMethod(systemIamRuntime, "retrieve"),
            (params?: Record<string, unknown>) => callOptionalMethod(systemIamRuntime, "retrieve", params),
          ),
        },
        verificationPolicy: {
          retrieve: selectMethod(
            getBoundMethod(systemIamVerificationPolicy, "retrieve"),
            () => callOptionalMethod(systemIamVerificationPolicy, "retrieve"),
          ),
        },
      },
    },
    iam: {
      organizations: {
        list: selectMethod(
          getBoundMethod(iamOrganizations, "list"),
          (params?: Record<string, unknown>) => callOptionalMethod(iamOrganizations, "list", params),
        ),
        tree: {
          retrieve: selectMethod(
            getBoundMethod(iamOrganizationsTree, "retrieve"),
            (params?: Record<string, unknown>) => callOptionalMethod(iamOrganizationsTree, "retrieve", params),
          ),
        },
      },
      organizationMemberships: {
        list: selectMethod(
          getBoundMethod(iamOrganizationMemberships, "list"),
          (params?: Record<string, unknown>) => callOptionalMethod(iamOrganizationMemberships, "list", params),
        ),
      },
      departments: {
        list: selectMethod(
          getBoundMethod(iamDepartments, "list"),
          (params?: Record<string, unknown>) => callOptionalMethod(iamDepartments, "list", params),
        ),
        tree: {
          retrieve: selectMethod(
            getBoundMethod(iamDepartmentsTree, "retrieve"),
            (params?: Record<string, unknown>) => callOptionalMethod(iamDepartmentsTree, "retrieve", params),
          ),
        },
      },
      departmentAssignments: {
        list: selectMethod(
          getBoundMethod(iamDepartmentAssignments, "list"),
          (params?: Record<string, unknown>) => callOptionalMethod(iamDepartmentAssignments, "list", params),
        ),
      },
      positions: {
        list: selectMethod(
          getBoundMethod(iamPositions, "list"),
          (params?: Record<string, unknown>) => callOptionalMethod(iamPositions, "list", params),
        ),
      },
      positionAssignments: {
        list: selectMethod(
          getBoundMethod(iamPositionAssignments, "list"),
          (params?: Record<string, unknown>) => callOptionalMethod(iamPositionAssignments, "list", params),
        ),
      },
      roleBindings: {
        list: selectMethod(
          getBoundMethod(iamRoleBindings, "list"),
          (params?: Record<string, unknown>) => callOptionalMethod(iamRoleBindings, "list", params),
        ),
      },
      users: {
        current: {
          retrieve: selectMethod(
            getBoundMethod(iamUsersCurrent, "retrieve"),
            () => user.getUserProfile?.() ?? auth.getCurrentUser?.(),
          ),
        },
      },
    },
  };
}

export function createIamBackendSdkAdapter(client: unknown): IamBackendSdkClient {
  const source = toRecord(client);
  const iam = toRecord(source.iam);
  const iamOrganizations = toRecord(iam.organizations);
  const iamOrganizationMemberships = toRecord(iam.organizationMemberships);
  const iamDepartments = toRecord(iam.departments);
  const iamDepartmentAssignments = toRecord(iam.departmentAssignments);
  const iamPositions = toRecord(iam.positions);
  const iamPositionAssignments = toRecord(iam.positionAssignments);
  const iamRoleBindings = toRecord(iam.roleBindings);
  const apikey = toRecord(source.apikey ?? source.apiKey);
  const permission = toRecord(source.permission);
  const policy = toRecord(source.policy);
  const role = toRecord(source.role);
  const security = toRecord(source.security);
  const tenant = toRecord(source.tenant);
  const user = toRecord(source.user);

  return {
    iam: {
      apiKeys: {
        list: selectMethod(iam.apiKeys?.list, (params?: Record<string, unknown>) => apikey.listAllEntities?.(params)),
        revoke: selectMethod(iam.apiKeys?.revoke, (apiKeyId: string) => apikey.delete?.(apiKeyId)),
      },
      auditEvents: {
        list: selectMethod(iam.auditEvents?.list, (params?: Record<string, unknown>) => tenant.listAuditLogs?.(params?.tenantId ?? params?.tenant_id ?? params?.id, params)),
      },
      organizations: {
        create: selectGeneratedSdkMethod((body: Record<string, unknown>) => callOptionalMethod(iamOrganizations, "create", body)),
        delete: selectGeneratedSdkMethod((organizationId: string) => callOptionalMethod(iamOrganizations, "delete", organizationId)),
        retrieve: selectGeneratedSdkMethod((organizationId: string) => callOptionalMethod(iamOrganizations, "retrieve", organizationId)),
        update: selectGeneratedSdkMethod((organizationId: string, body: Record<string, unknown>) => callOptionalMethod(iamOrganizations, "update", organizationId, body)),
      },
      organizationMemberships: {
        create: selectGeneratedSdkMethod((body: Record<string, unknown>) => callOptionalMethod(iamOrganizationMemberships, "create", body)),
        update: selectGeneratedSdkMethod((membershipId: string, body: Record<string, unknown>) => callOptionalMethod(iamOrganizationMemberships, "update", membershipId, body)),
      },
      departments: {
        create: selectGeneratedSdkMethod((body: Record<string, unknown>) => callOptionalMethod(iamDepartments, "create", body)),
        delete: selectGeneratedSdkMethod((departmentId: string) => callOptionalMethod(iamDepartments, "delete", departmentId)),
        retrieve: selectGeneratedSdkMethod((departmentId: string) => callOptionalMethod(iamDepartments, "retrieve", departmentId)),
        update: selectGeneratedSdkMethod((departmentId: string, body: Record<string, unknown>) => callOptionalMethod(iamDepartments, "update", departmentId, body)),
      },
      departmentAssignments: {
        create: selectGeneratedSdkMethod((body: Record<string, unknown>) => callOptionalMethod(iamDepartmentAssignments, "create", body)),
        update: selectGeneratedSdkMethod((assignmentId: string, body: Record<string, unknown>) => callOptionalMethod(iamDepartmentAssignments, "update", assignmentId, body)),
      },
      permissions: {
        create: selectMethod(iam.permissions?.create, (body: Record<string, unknown>) => callCreate(permission, body)),
        delete: selectMethod(iam.permissions?.delete, (permissionId: string) => callDelete(permission, permissionId)),
        list: selectMethod(iam.permissions?.list, (params?: Record<string, unknown>) => permission.listAllEntities?.(params)),
        retrieve: selectMethod(iam.permissions?.retrieve, (permissionId: string) => callRetrieve(permission, permissionId)),
        update: selectMethod(iam.permissions?.update, (permissionId: string, body: Record<string, unknown>) => callUpdate(permission, permissionId, body)),
      },
      policies: {
        create: selectMethod(iam.policies?.create, (body: Record<string, unknown>) => callCreate(policy, body) ?? callCreate(security, body)),
        delete: selectMethod(iam.policies?.delete, (policyId: string) => callDelete(policy, policyId) ?? callDelete(security, policyId)),
        list: selectMethod(iam.policies?.list, (params?: Record<string, unknown>) => policy.listAllEntities?.(params) ?? security.listAllEntities?.(params)),
        retrieve: selectMethod(iam.policies?.retrieve, (policyId: string) => callRetrieve(policy, policyId) ?? callRetrieve(security, policyId)),
        update: selectMethod(iam.policies?.update, (policyId: string, body: Record<string, unknown>) => callUpdate(policy, policyId, body) ?? callUpdate(security, policyId, body)),
      },
      positions: {
        create: selectGeneratedSdkMethod((body: Record<string, unknown>) => callOptionalMethod(iamPositions, "create", body)),
        delete: selectGeneratedSdkMethod((positionId: string) => callOptionalMethod(iamPositions, "delete", positionId)),
        update: selectGeneratedSdkMethod((positionId: string, body: Record<string, unknown>) => callOptionalMethod(iamPositions, "update", positionId, body)),
      },
      positionAssignments: {
        create: selectGeneratedSdkMethod((body: Record<string, unknown>) => callOptionalMethod(iamPositionAssignments, "create", body)),
        update: selectGeneratedSdkMethod((assignmentId: string, body: Record<string, unknown>) => callOptionalMethod(iamPositionAssignments, "update", assignmentId, body)),
      },
      roles: {
        create: selectMethod(iam.roles?.create, (body: Record<string, unknown>) => callCreate(role, body)),
        delete: selectMethod(iam.roles?.delete, (roleId: string) => callDelete(role, roleId)),
        list: selectMethod(iam.roles?.list, (params?: Record<string, unknown>) => role.createListAllEntitiesRole?.(params)),
        retrieve: selectMethod(iam.roles?.retrieve, (roleId: string) => callRetrieve(role, roleId)),
        update: selectMethod(iam.roles?.update, (roleId: string, body: Record<string, unknown>) => callUpdate(role, roleId, body)),
        permissions: {
          create: selectMethod(
            iam.roles?.permissions?.create,
            (roleId: string, permissionId: string) => role.createPermission?.({ permissionId, roleId }),
          ),
          delete: selectMethod(
            iam.roles?.permissions?.delete,
            (_roleId: string, permissionId: string) => role.deletePermission?.(permissionId),
          ),
          list: selectMethod(iam.roles?.permissions?.list, (params?: Record<string, unknown>) => role.createListAllEntities?.(params)),
        },
      },
      roleBindings: {
        create: selectGeneratedSdkMethod((body: Record<string, unknown>) => callOptionalMethod(iamRoleBindings, "create", body)),
        delete: selectGeneratedSdkMethod((roleBindingId: string) => callOptionalMethod(iamRoleBindings, "delete", roleBindingId)),
      },
      securityEvents: {
        list: selectMethod(iam.securityEvents?.list, (params?: Record<string, unknown>) => security.listAllEntities?.(params)),
      },
      tenants: {
        create: selectMethod(iam.tenants?.create, (body: Record<string, unknown>) => callCreate(tenant, body)),
        delete: selectMethod(iam.tenants?.delete, (tenantId: string) => callDelete(tenant, tenantId)),
        list: selectMethod(iam.tenants?.list, (params?: Record<string, unknown>) => tenant.listAllEntities?.(params)),
        retrieve: selectMethod(iam.tenants?.retrieve, (tenantId: string) => callRetrieve(tenant, tenantId)),
        update: selectMethod(iam.tenants?.update, (tenantId: string, body: Record<string, unknown>) => callUpdate(tenant, tenantId, body)),
        members: {
          create: selectMethod(
            iam.tenants?.members?.create,
            (tenantId: string, body: Record<string, unknown>) => tenant.createMember?.({ ...body, tenantId }) ?? user.create?.({ ...body, tenantId }),
          ),
          delete: selectMethod(
            iam.tenants?.members?.delete,
            (tenantId: string, userId: string) => tenant.deleteMember?.({ tenantId, userId }) ?? user.delete?.(userId),
          ),
          list: selectMethod(iam.tenants?.members?.list, (_tenantId: string, params?: Record<string, unknown>) => user.createListAllEntitiesUser?.(params)),
          update: selectMethod(
            iam.tenants?.members?.update,
            (tenantId: string, userId: string, body: Record<string, unknown>) => tenant.updateMember?.({ ...body, tenantId, userId }) ?? user.update?.(userId, body),
          ),
        },
      },
      users: {
        create: selectMethod(iam.users?.create, (body: Record<string, unknown>) => callCreate(user, body)),
        delete: selectMethod(iam.users?.delete, (userId: string) => callDelete(user, userId)),
        list: selectMethod(iam.users?.list, (params?: Record<string, unknown>) => user.createListAllEntitiesUser?.(params)),
        retrieve: selectMethod(iam.users?.retrieve, (userId: string) => user.getById?.(userId)),
        update: selectMethod(iam.users?.update, (userId: string, body: Record<string, unknown>) => callUpdate(user, userId, body)),
      },
    },
  };
}

function selectMethod(
  standardMethod: IamSdkMethod | undefined,
  legacyMethod: (...args: any[]) => Promise<unknown> | unknown,
): IamSdkMethod {
  if (typeof standardMethod === "function") {
    return async (...args: any[]) => unwrapIamSdkResponse(await standardMethod(...args));
  }

  return async (...args: any[]) => {
    const result = await legacyMethod(...args);
    if (result === undefined) {
      throw new Error("SDKWork IAM adapter target method is missing on the generated SDK client");
    }
    return unwrapIamSdkResponse(result);
  };
}

function selectGeneratedSdkMethod(
  callGeneratedMethod: (...args: any[]) => Promise<unknown> | unknown,
): IamSdkMethod {
  return async (...args: any[]) => {
    const result = await callGeneratedMethod(...args);
    if (result === undefined) {
      throw new Error("SDKWork IAM adapter target method is missing on the generated SDK client");
    }
    return unwrapIamSdkResponse(result);
  };
}

function getBoundMethod(target: AnyRecord, methodName: string): IamSdkMethod | undefined {
  const method = target[methodName];
  if (typeof method !== "function") {
    return undefined;
  }

  return (...args: any[]) => method.call(target, ...args);
}

function callOptionalMethod(
  target: AnyRecord,
  methodName: string,
  ...args: any[]
): Promise<unknown> | unknown {
  const method = target[methodName];
  if (typeof method !== "function") {
    return undefined;
  }

  return method.call(target, ...args);
}

function callQrAuthPathMethod(
  target: AnyRecord,
  methodName: string,
  sessionKey: string,
  ...args: any[]
): Promise<unknown> | unknown {
  const method = target[methodName];
  if (typeof method !== "function") {
    return undefined;
  }

  if (prefersPathParamsObject(method)) {
    return method.call(target, { sessionKey }, ...args);
  }

  try {
    return method.call(target, sessionKey, ...args);
  } catch (error) {
    if (isPathParameterShapeError(error)) {
      return method.call(target, { sessionKey }, ...args);
    }
    throw error;
  }
}

function prefersPathParamsObject(method: (...args: any[]) => unknown): boolean {
  const mockImplementation = (method as { getMockImplementation?: () => unknown }).getMockImplementation?.();
  const source = String(mockImplementation ?? method);
  return /\bpathParams\b/.test(source);
}

function isPathParameterShapeError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return /path parameter|pathParams|sessionKey/i.test(message);
}

function isSuccessCode(code: number | string | undefined): boolean {
  if (code === undefined || code === null) {
    return true;
  }

  const normalized = String(code).trim();
  return normalized === "0" || normalized === "200" || normalized === "2000";
}

function toRecord(value: unknown): AnyRecord {
  return value && typeof value === "object" ? value as AnyRecord : {};
}

function callCreate(resource: AnyRecord, body: Record<string, unknown>): unknown {
  return resource.create?.(body) ?? resource.createEntity?.(body);
}

function callDelete(resource: AnyRecord, id: string): unknown {
  return resource.delete?.(id) ?? resource.deleteById?.(id) ?? resource.remove?.(id);
}

function callRetrieve(resource: AnyRecord, id: string): unknown {
  return resource.retrieve?.(id) ?? resource.get?.(id) ?? resource.getById?.(id);
}

function callUpdate(resource: AnyRecord, id: string, body: Record<string, unknown>): unknown {
  return resource.update?.(id, body) ?? resource.updateById?.(id, body) ?? resource.patch?.(id, body);
}
