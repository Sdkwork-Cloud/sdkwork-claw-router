import { createIamAppContext, type IamAppContext } from "@sdkwork/iam-contracts";
import type { IamAppSdkClient, IamBackendIamResourceClient, IamBackendSdkClient, IamSdkResourceClient } from "@sdkwork/iam-sdk-ports";

export interface IamUser {
  avatarUrl?: string;
  displayName: string;
  email?: string;
  id?: string;
  username?: string;
}

export interface IamSession {
  accessToken: string;
  authToken: string;
  context?: IamAppContext;
  expiresAt?: string;
  refreshToken?: string;
  sessionId?: string;
  user?: IamUser;
}

export interface IamStoredSession {
  accessToken?: string;
  authToken?: string;
  refreshToken?: string;
}

export interface IamCreateSessionInput {
  password?: string;
  username?: string;
  [key: string]: unknown;
}

export interface IamRefreshSessionInput {
  refreshToken?: string;
  [key: string]: unknown;
}

export interface IamCreateRegistrationInput {
  password: string;
  username: string;
  verificationCode?: string;
  [key: string]: unknown;
}

export interface CreateSdkworkIamServiceInput {
  appClient: IamAppSdkClient;
  backendClient?: IamBackendSdkClient;
  onSessionCleared?: () => unknown;
  onSessionChanged?: (session: IamSession) => unknown;
  persistSession?: (session: IamStoredSession) => unknown;
}

export interface SdkworkIamService {
  auth: {
    oauthAuthorizationUrls: {
      retrieve(params?: Record<string, unknown>): Promise<unknown>;
    };
    oauthSessions: {
      create(body: Record<string, unknown>): Promise<IamSession>;
    };
    passwordResetRequests: {
      create(body: Record<string, unknown>): Promise<unknown>;
    };
    passwordResets: {
      create(body: Record<string, unknown>): Promise<unknown>;
    };
    registrations: {
      create(body: IamCreateRegistrationInput): Promise<IamSession>;
    };
    sessions: {
      create(body: IamCreateSessionInput): Promise<IamSession>;
      current: {
        delete(): Promise<void>;
        retrieve(): Promise<IamSession>;
        update(body?: Record<string, unknown>): Promise<IamSession>;
      };
      refresh(body: IamRefreshSessionInput): Promise<IamSession>;
    };
    verificationCodes: {
      create(body: Record<string, unknown>): Promise<unknown>;
      verify(body: Record<string, unknown>): Promise<unknown>;
    };
  };
  openPlatform: {
    qrAuth: {
      sessions: {
        create(body: Record<string, unknown>): Promise<unknown>;
        retrieve(sessionKey: string): Promise<unknown>;
        scans: {
          create(sessionKey: string, body?: Record<string, unknown>): Promise<unknown>;
        };
        passwords: {
          create(sessionKey: string, body: Record<string, unknown>): Promise<unknown>;
        };
      };
    };
  };
  system: {
    iam: {
      runtime: {
        retrieve(params?: Record<string, unknown>): Promise<unknown>;
      };
      verificationPolicy: {
        retrieve(): Promise<unknown>;
      };
    };
  };
  iam: {
    apiKeys: {
      list(params?: Record<string, unknown>): Promise<unknown>;
      revoke(apiKeyId: string): Promise<unknown>;
    };
    auditEvents: {
      list(params?: Record<string, unknown>): Promise<unknown>;
    };
    organizations: {
      create(body: Record<string, unknown>): Promise<unknown>;
      delete(organizationId: string): Promise<unknown>;
      list(params?: Record<string, unknown>): Promise<unknown>;
      retrieve(organizationId: string): Promise<unknown>;
      tree: {
        retrieve(params?: Record<string, unknown>): Promise<unknown>;
      };
      update(organizationId: string, body: Record<string, unknown>): Promise<unknown>;
      members: {
        create(organizationId: string, body: Record<string, unknown>): Promise<unknown>;
        delete(organizationId: string, userId: string): Promise<unknown>;
        list(organizationId: string, params?: Record<string, unknown>): Promise<unknown>;
        update(organizationId: string, userId: string, body: Record<string, unknown>): Promise<unknown>;
      };
    };
    permissions: {
      create(body: Record<string, unknown>): Promise<unknown>;
      delete(permissionId: string): Promise<unknown>;
      list(params?: Record<string, unknown>): Promise<unknown>;
      retrieve(permissionId: string): Promise<unknown>;
      update(permissionId: string, body: Record<string, unknown>): Promise<unknown>;
    };
    policies: {
      create(body: Record<string, unknown>): Promise<unknown>;
      delete(policyId: string): Promise<unknown>;
      list(params?: Record<string, unknown>): Promise<unknown>;
      retrieve(policyId: string): Promise<unknown>;
      update(policyId: string, body: Record<string, unknown>): Promise<unknown>;
    };
    roles: {
      create(body: Record<string, unknown>): Promise<unknown>;
      delete(roleId: string): Promise<unknown>;
      list(params?: Record<string, unknown>): Promise<unknown>;
      retrieve(roleId: string): Promise<unknown>;
      update(roleId: string, body: Record<string, unknown>): Promise<unknown>;
      permissions: {
        create(roleId: string, permissionId: string): Promise<unknown>;
        delete(roleId: string, permissionId: string): Promise<unknown>;
        list(roleId: string, params?: Record<string, unknown>): Promise<unknown>;
      };
    };
    securityEvents: {
      list(params?: Record<string, unknown>): Promise<unknown>;
    };
    tenants: {
      create(body: Record<string, unknown>): Promise<unknown>;
      delete(tenantId: string): Promise<unknown>;
      list(params?: Record<string, unknown>): Promise<unknown>;
      retrieve(tenantId: string): Promise<unknown>;
      update(tenantId: string, body: Record<string, unknown>): Promise<unknown>;
      members: {
        create(tenantId: string, body: Record<string, unknown>): Promise<unknown>;
        delete(tenantId: string, userId: string): Promise<unknown>;
        list(tenantId: string, params?: Record<string, unknown>): Promise<unknown>;
        update(tenantId: string, userId: string, body: Record<string, unknown>): Promise<unknown>;
      };
    };
    users: {
      current: {
        retrieve(): Promise<IamUser>;
      };
      create(body: Record<string, unknown>): Promise<unknown>;
      delete(userId: string): Promise<unknown>;
      list(params?: Record<string, unknown>): Promise<unknown>;
      retrieve(userId: string): Promise<IamUser>;
      update(userId: string, body: Record<string, unknown>): Promise<unknown>;
      roles: {
        create(userId: string, roleId: string): Promise<unknown>;
        delete(userId: string, roleId: string): Promise<unknown>;
        list(userId: string, params?: Record<string, unknown>): Promise<unknown>;
      };
    };
  };
}

interface Envelope<T> {
  code?: number | string;
  data?: T;
  message?: string;
  msg?: string;
}

interface RemoteSession {
  accessToken?: string;
  authToken?: string;
  context?: IamAppContext;
  expiresAt?: string;
  refreshToken?: string;
  sessionId?: string;
  user?: unknown;
  userInfo?: unknown;
}

interface RemoteUser {
  avatar?: string;
  avatarUrl?: string;
  displayName?: string;
  email?: string;
  id?: string;
  name?: string;
  nickname?: string;
  userId?: string;
  username?: string;
}

export function createSdkworkIamService(input: CreateSdkworkIamServiceInput): SdkworkIamService {
  const appSessions = input.appClient.auth?.sessions;
  const appSystem = input.appClient.system;
  const appOpenPlatform = input.appClient.openPlatform;
  const backendIam = input.backendClient?.iam;
  const appIam = input.appClient.iam;

  return {
    auth: {
      oauthAuthorizationUrls: {
        retrieve: (params) =>
          callOAuthAuthorizationUrlRetrieve(
            input.appClient.auth?.oauthAuthorizationUrls,
            "appClient.auth.oauthAuthorizationUrls.retrieve",
            params,
          ),
      },
      oauthSessions: {
        create: async (body) => handleSession(await callResourceMethod(input.appClient.auth?.oauthSessions, "create", "appClient.auth.oauthSessions.create", body), input),
      },
      passwordResetRequests: {
        create: (body) => callRaw(input.appClient.auth?.passwordResetRequests, "create", "appClient.auth.passwordResetRequests.create", body),
      },
      passwordResets: {
        create: (body) => callRaw(input.appClient.auth?.passwordResets, "create", "appClient.auth.passwordResets.create", body),
      },
      registrations: {
        create: async (body) => handleSession(
          await callResourceMethod(
            input.appClient.auth?.registrations,
            "create",
            "appClient.auth.registrations.create",
            body,
          ),
          input,
        ),
      },
      sessions: {
        create: async (body) => handleSession(await callResourceMethod(appSessions, "create", "appClient.auth.sessions.create", body), input),
        current: {
          delete: async () => {
            await callRaw(appSessions?.current, "delete", "appClient.auth.sessions.current.delete");
            input.onSessionCleared?.();
          },
          retrieve: async () => handleSession(await callResourceMethod(appSessions?.current, "retrieve", "appClient.auth.sessions.current.retrieve"), input),
          update: async (body) => handleSession(await callResourceMethod(appSessions?.current, "update", "appClient.auth.sessions.current.update", body), input),
        },
        refresh: async (body) => handleSession(await callResourceMethod(appSessions, "refresh", "appClient.auth.sessions.refresh", body), input),
      },
      verificationCodes: {
        create: (body) => callRaw(input.appClient.auth?.verificationCodes, "create", "appClient.auth.verificationCodes.create", body),
        verify: (body) => callRaw(input.appClient.auth?.verificationCodes, "verify", "appClient.auth.verificationCodes.verify", body),
      },
    },
    openPlatform: {
      qrAuth: {
        sessions: {
          create: (body) => callRaw(appOpenPlatform?.qrAuth?.sessions, "create", "appClient.openPlatform.qrAuth.sessions.create", body),
          retrieve: (sessionKey) => callRaw(appOpenPlatform?.qrAuth?.sessions, "retrieve", "appClient.openPlatform.qrAuth.sessions.retrieve", sessionKey),
          scans: {
            create: (sessionKey, body) => callRaw(appOpenPlatform?.qrAuth?.sessions?.scans, "create", "appClient.openPlatform.qrAuth.sessions.scans.create", sessionKey, body),
          },
          passwords: {
            create: (sessionKey, body) => callRaw(appOpenPlatform?.qrAuth?.sessions?.passwords, "create", "appClient.openPlatform.qrAuth.sessions.passwords.create", sessionKey, body),
          },
        },
      },
    },
    system: {
      iam: {
        runtime: {
          retrieve: (params) => callRaw(appSystem?.iam?.runtime, "retrieve", "appClient.system.iam.runtime.retrieve", params),
        },
        verificationPolicy: {
          retrieve: () => callRaw(appSystem?.iam?.verificationPolicy, "retrieve", "appClient.system.iam.verificationPolicy.retrieve"),
        },
      },
    },
    iam: {
      apiKeys: {
        list: (params) => callBackendIam(backendIam, (iam) => iam.apiKeys, "list", "iam.apiKeys.list", params),
        revoke: (apiKeyId) => callBackendIam(backendIam, (iam) => iam.apiKeys, "revoke", "iam.apiKeys.revoke", apiKeyId),
      },
      auditEvents: {
        list: (params) => callBackendIam(backendIam, (iam) => iam.auditEvents, "list", "iam.auditEvents.list", params),
      },
      organizations: {
        create: (body) => callBackendIam(backendIam, (iam) => iam.organizations, "create", "iam.organizations.create", body),
        delete: (organizationId) => callBackendIam(backendIam, (iam) => iam.organizations, "delete", "iam.organizations.delete", organizationId),
        list: (params) => callBackendIam(backendIam, (iam) => iam.organizations, "list", "iam.organizations.list", params),
        retrieve: (organizationId) => callBackendIam(backendIam, (iam) => iam.organizations, "retrieve", "iam.organizations.retrieve", organizationId),
        tree: {
          retrieve: (params) => callBackendIam(backendIam, (iam) => iam.organizations?.tree, "retrieve", "iam.organizations.tree.retrieve", params),
        },
        update: (organizationId, body) => callBackendIam(backendIam, (iam) => iam.organizations, "update", "iam.organizations.update", organizationId, body),
        members: {
          create: (organizationId, body) => callBackendIam(backendIam, (iam) => iam.organizations?.members, "create", "iam.organizations.members.create", organizationId, body),
          delete: (organizationId, userId) => callBackendIam(backendIam, (iam) => iam.organizations?.members, "delete", "iam.organizations.members.delete", organizationId, userId),
          list: (organizationId, params) => callBackendIam(backendIam, (iam) => iam.organizations?.members, "list", "iam.organizations.members.list", organizationId, params),
          update: (organizationId, userId, body) => callBackendIam(backendIam, (iam) => iam.organizations?.members, "update", "iam.organizations.members.update", organizationId, userId, body),
        },
      },
      permissions: {
        create: (body) => callBackendIam(backendIam, (iam) => iam.permissions, "create", "iam.permissions.create", body),
        delete: (permissionId) => callBackendIam(backendIam, (iam) => iam.permissions, "delete", "iam.permissions.delete", permissionId),
        list: (params) => callBackendIam(backendIam, (iam) => iam.permissions, "list", "iam.permissions.list", params),
        retrieve: (permissionId) => callBackendIam(backendIam, (iam) => iam.permissions, "retrieve", "iam.permissions.retrieve", permissionId),
        update: (permissionId, body) => callBackendIam(backendIam, (iam) => iam.permissions, "update", "iam.permissions.update", permissionId, body),
      },
      policies: {
        create: (body) => callBackendIam(backendIam, (iam) => iam.policies, "create", "iam.policies.create", body),
        delete: (policyId) => callBackendIam(backendIam, (iam) => iam.policies, "delete", "iam.policies.delete", policyId),
        list: (params) => callBackendIam(backendIam, (iam) => iam.policies, "list", "iam.policies.list", params),
        retrieve: (policyId) => callBackendIam(backendIam, (iam) => iam.policies, "retrieve", "iam.policies.retrieve", policyId),
        update: (policyId, body) => callBackendIam(backendIam, (iam) => iam.policies, "update", "iam.policies.update", policyId, body),
      },
      roles: {
        create: (body) => callBackendIam(backendIam, (iam) => iam.roles, "create", "iam.roles.create", body),
        delete: (roleId) => callBackendIam(backendIam, (iam) => iam.roles, "delete", "iam.roles.delete", roleId),
        list: (params) => callBackendIam(backendIam, (iam) => iam.roles, "list", "iam.roles.list", params),
        retrieve: (roleId) => callBackendIam(backendIam, (iam) => iam.roles, "retrieve", "iam.roles.retrieve", roleId),
        update: (roleId, body) => callBackendIam(backendIam, (iam) => iam.roles, "update", "iam.roles.update", roleId, body),
        permissions: {
          create: (roleId, permissionId) => callBackendIam(backendIam, (iam) => iam.roles?.permissions, "create", "iam.roles.permissions.create", roleId, permissionId),
          delete: (roleId, permissionId) => callBackendIam(backendIam, (iam) => iam.roles?.permissions, "delete", "iam.roles.permissions.delete", roleId, permissionId),
          list: (roleId, params) => callBackendIam(backendIam, (iam) => iam.roles?.permissions, "list", "iam.roles.permissions.list", roleId, params),
        },
      },
      securityEvents: {
        list: (params) => callBackendIam(backendIam, (iam) => iam.securityEvents, "list", "iam.securityEvents.list", params),
      },
      tenants: {
        create: (body) => callBackendIam(backendIam, (iam) => iam.tenants, "create", "iam.tenants.create", body),
        delete: (tenantId) => callBackendIam(backendIam, (iam) => iam.tenants, "delete", "iam.tenants.delete", tenantId),
        list: (params) => callBackendIam(backendIam, (iam) => iam.tenants, "list", "iam.tenants.list", params),
        retrieve: (tenantId) => callBackendIam(backendIam, (iam) => iam.tenants, "retrieve", "iam.tenants.retrieve", tenantId),
        update: (tenantId, body) => callBackendIam(backendIam, (iam) => iam.tenants, "update", "iam.tenants.update", tenantId, body),
        members: {
          create: (tenantId, body) => callBackendIam(backendIam, (iam) => iam.tenants?.members, "create", "iam.tenants.members.create", tenantId, body),
          delete: (tenantId, userId) => callBackendIam(backendIam, (iam) => iam.tenants?.members, "delete", "iam.tenants.members.delete", tenantId, userId),
          list: (tenantId, params) => callBackendIam(backendIam, (iam) => iam.tenants?.members, "list", "iam.tenants.members.list", tenantId, params),
          update: (tenantId, userId, body) => callBackendIam(backendIam, (iam) => iam.tenants?.members, "update", "iam.tenants.members.update", tenantId, userId, body),
        },
      },
      users: {
        current: {
          retrieve: async () => toUser(unwrap(await callResourceMethod(appIam?.users?.current, "retrieve", "appClient.iam.users.current.retrieve"), "appClient.iam.users.current.retrieve")),
        },
        create: (body) => callBackendIam(backendIam, (iam) => iam.users, "create", "iam.users.create", body),
        delete: (userId) => callBackendIam(backendIam, (iam) => iam.users, "delete", "iam.users.delete", userId),
        list: (params) => callBackendIam(backendIam, (iam) => iam.users, "list", "iam.users.list", params),
        retrieve: async (userId) => toUser(unwrap(await callBackendIam(backendIam, (iam) => iam.users, "retrieve", "iam.users.retrieve", userId), "iam.users.retrieve")),
        update: (userId, body) => callBackendIam(backendIam, (iam) => iam.users, "update", "iam.users.update", userId, body),
        roles: {
          create: (userId, roleId) => callBackendIam(backendIam, (iam) => iam.users?.roles, "create", "iam.users.roles.create", userId, roleId),
          delete: (userId, roleId) => callBackendIam(backendIam, (iam) => iam.users?.roles, "delete", "iam.users.roles.delete", userId, roleId),
          list: (userId, params) => callBackendIam(backendIam, (iam) => iam.users?.roles, "list", "iam.users.roles.list", userId, params),
        },
      },
    },
  };
}

function handleSession(value: unknown, input: CreateSdkworkIamServiceInput): IamSession {
  const session = toSession(unwrap<RemoteSession>(value, "iam.session"));
  input.persistSession?.({
    accessToken: session.accessToken,
    authToken: session.authToken,
    refreshToken: session.refreshToken,
  });
  input.onSessionChanged?.(session);
  return session;
}

async function callRaw(
  resource: object | undefined,
  key: string,
  name: string,
  ...args: unknown[]
): Promise<unknown> {
  return unwrap(await callResourceMethod(resource, key, name, ...args), name);
}

async function callOAuthAuthorizationUrlRetrieve(
  resource: NonNullable<NonNullable<IamAppSdkClient["auth"]>["oauthAuthorizationUrls"]> | undefined,
  name: string,
  params?: Record<string, unknown>,
): Promise<unknown> {
  const retrieve = requireResourceMethod(resource, "retrieve", name);
  if (retrieve.length > 1) {
    return unwrap(
      await retrieve.call(
        resource,
        params?.provider,
        params?.redirectUri,
        params?.state,
        params?.scope,
      ),
      name,
    );
  }

  return unwrap(await retrieve.call(resource, params), name);
}

async function callBackendIam(
  backendIam: IamBackendIamResourceClient | undefined,
  selectResource: (iam: IamBackendIamResourceClient) => object | undefined,
  key: string,
  name: string,
  ...args: unknown[]
): Promise<unknown> {
  return callRaw(backendIam ? selectResource(backendIam) : undefined, key, name, ...args);
}

async function callResourceMethod(
  resource: object | undefined,
  key: string,
  name: string,
  ...args: unknown[]
): Promise<unknown> {
  return requireResourceMethod(resource, key, name).call(resource, ...args);
}

function requireResourceMethod(
  resource: object | undefined,
  key: string,
  name: string,
): (...args: unknown[]) => Promise<unknown> {
  const method = resource && (resource as Record<string, unknown>)[key];
  if (typeof method !== "function") {
    return (async () => {
      throw new Error(`Missing SDKWork IAM SDK resource: ${name}`);
    }) as (...args: unknown[]) => Promise<unknown>;
  }

  return method as (...args: unknown[]) => Promise<unknown>;
}

function unwrap<T>(value: unknown, name: string): T {
  if (!value || typeof value !== "object") {
    return value as T;
  }

  if (!("data" in value) && !("code" in value)) {
    return value as T;
  }

  const envelope = value as Envelope<T>;
  if (!isSuccessCode(envelope.code)) {
    throw new Error(String(envelope.message || envelope.msg || `${name} failed`));
  }

  return envelope.data as T;
}

function isSuccessCode(code: number | string | undefined): boolean {
  if (code === undefined || code === null) {
    return true;
  }

  const normalized = String(code).trim();
  return normalized === "0" || normalized === "200" || normalized === "2000";
}

function toSession(value: unknown): IamSession {
  const remote = value && typeof value === "object" ? value as RemoteSession : {};
  const accessToken = optionalString(remote.accessToken);
  const authToken = optionalString(remote.authToken);

  if (!accessToken) {
    throw new Error("SDKWork IAM session is missing accessToken");
  }

  if (!authToken) {
    throw new Error("SDKWork IAM session is missing authToken");
  }

  return {
    accessToken,
    authToken,
    ...(remote.context ? { context: createIamAppContext(remote.context) } : {}),
    ...(optionalString(remote.expiresAt) ? { expiresAt: optionalString(remote.expiresAt) } : {}),
    ...(optionalString(remote.refreshToken) ? { refreshToken: optionalString(remote.refreshToken) } : {}),
    ...(optionalString(remote.sessionId) ? { sessionId: optionalString(remote.sessionId) } : {}),
    ...(remote.user || remote.userInfo ? { user: toUser(remote.user ?? remote.userInfo) } : {}),
  };
}

function toUser(value: unknown): IamUser {
  const remote = value && typeof value === "object" ? value as RemoteUser : {};
  const displayName =
    optionalString(remote.displayName)
    || optionalString(remote.nickname)
    || optionalString(remote.name)
    || optionalString(remote.username)
    || optionalString(remote.email)
    || "SDKWork User";

  return {
    ...(optionalString(remote.avatarUrl) || optionalString(remote.avatar)
      ? { avatarUrl: optionalString(remote.avatarUrl) || optionalString(remote.avatar) }
      : {}),
    displayName,
    ...(optionalString(remote.email) ? { email: optionalString(remote.email) } : {}),
    ...(optionalString(remote.userId) || optionalString(remote.id) ? { id: optionalString(remote.userId) || optionalString(remote.id) } : {}),
    ...(optionalString(remote.username) ? { username: optionalString(remote.username) } : {}),
  };
}

function optionalString(value: unknown): string | undefined {
  const normalized = typeof value === "string" ? value.trim() : "";
  return normalized || undefined;
}

export type { IamAppSdkClient, IamBackendSdkClient, IamSdkResourceClient };
