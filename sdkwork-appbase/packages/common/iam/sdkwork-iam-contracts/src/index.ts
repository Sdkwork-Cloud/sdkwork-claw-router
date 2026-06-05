export type IamEnvironment = "dev" | "test" | "prod";
export type IamDeploymentMode = "saas" | "local" | "private";
export type IamAuthLevel = "anonymous" | "password" | "mfa" | "system";
export type IamShardingStrategy = "tenant" | "organization" | "user" | "single";
export type IamDomainModelName = keyof typeof SDKWORK_IAM_TABLES;
export type IamDomainModelOwnership = "tenant" | "global";
export type IamCapabilityName =
  | "accountIdentity"
  | "accessControl"
  | "apiAccess"
  | "departmentManagement"
  | "organizationManagement"
  | "positionManagement"
  | "securityAudit"
  | "sessionSecurity"
  | "tenantManagement"
  | "userDirectory";

export interface IamAppContext {
  appId: string;
  authLevel: IamAuthLevel;
  dataScope: string[];
  deploymentMode: IamDeploymentMode;
  environment: IamEnvironment;
  organizationId?: string;
  permissionScope: string[];
  sessionId: string;
  tenantId: string;
  userId: string;
}

export interface IamShardingContext {
  databaseKey?: string;
  schema?: string;
  shardingKey: string;
  shardingStrategy: IamShardingStrategy;
  tablePartition?: string;
}

export interface IamOperationContract {
  method: "DELETE" | "GET" | "PATCH" | "POST" | "PUT";
  operationId: string;
  path: string;
  queryParameters?: readonly string[];
  security: "dualToken" | "public" | "refreshToken";
  tag: "auth" | "iam" | "openPlatform" | "system";
}

export interface IamDomainModelContract {
  capabilities: readonly IamCapabilityName[];
  domain: "iam";
  fields: readonly string[];
  name: IamDomainModelName;
  ownership: IamDomainModelOwnership;
  table: (typeof SDKWORK_IAM_TABLES)[IamDomainModelName];
}

export interface IamCapabilityContract {
  domain: "iam";
  models: readonly IamDomainModelName[];
  name: IamCapabilityName;
  operations: readonly string[];
  sdkNamespaces: readonly ("auth" | "iam" | "openPlatform" | "system")[];
}

export const SDKWORK_IAM_STANDARD = {
  api: {
    appPrefix: "/app/v3/api",
    backendPrefix: "/backend/v3/api",
    openapi: "3.1.2",
  },
  databasePrefix: "iam",
  domain: "iam",
  sdkNamespaces: ["auth", "iam", "openPlatform", "system"],
} as const;

export const SDKWORK_IAM_HEADERS = {
  accessToken: "Access-Token",
  authToken: {
    header: "Authorization",
    scheme: "Bearer",
  },
} as const;

export const SDKWORK_STANDARD_PAGE_QUERY_PARAMS = ["page", "page_size", "cursor", "sort", "q"] as const;

export function isSdkworkQueryParameterName(name: string): boolean {
  if (!/^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$/.test(name)) {
    return false;
  }
  return !["search_query", "keyword", "search", "pageNo", "pageSize", "searchQuery", "size", "page_no"].includes(name);
}

export const SDKWORK_IAM_TABLES = {
  apiKey: "iam_api_key",
  auditEvent: "iam_audit_event",
  credential: "iam_credential",
  device: "iam_device",
  mfaFactor: "iam_mfa_factor",
  department: "iam_department",
  departmentAssignment: "iam_department_assignment",
  departmentClosure: "iam_department_closure",
  organization: "iam_organization",
  organizationClosure: "iam_organization_closure",
  organizationMembership: "iam_organization_membership",
  permission: "iam_permission",
  policy: "iam_policy",
  position: "iam_position",
  positionAssignment: "iam_position_assignment",
  role: "iam_role",
  roleBinding: "iam_role_binding",
  rolePermission: "iam_role_permission",
  securityEvent: "iam_security_event",
  session: "iam_session",
  tenant: "iam_tenant",
  user: "iam_user",
  userIdentity: "iam_user_identity",
} as const;

export const SDKWORK_IAM_DOMAIN_MODELS = [
  model("tenant", "tenant", ["tenantManagement"], [
    "id",
    "tenant_id",
    "code",
    "name",
    "status",
    "created_at",
    "updated_at",
  ]),
  model("organization", "tenant", ["organizationManagement"], [
    "id",
    "tenant_id",
    "parent_organization_id",
    "code",
    "name",
    "organization_kind",
    "tenant_boundary_kind",
    "data_boundary_kind",
    "app_boundary_enabled",
    "verification_status",
    "path",
    "status",
    "created_at",
    "updated_at",
  ]),
  model("organizationClosure", "tenant", ["organizationManagement"], [
    "id",
    "tenant_id",
    "ancestor_organization_id",
    "descendant_organization_id",
    "depth",
    "created_at",
  ]),
  model("organizationMembership", "tenant", ["organizationManagement", "userDirectory"], [
    "id",
    "tenant_id",
    "organization_id",
    "user_id",
    "membership_kind",
    "employee_no",
    "display_name",
    "status",
    "joined_at",
    "left_at",
    "remark",
  ]),
  model("department", "tenant", ["departmentManagement", "organizationManagement"], [
    "id",
    "tenant_id",
    "organization_id",
    "parent_department_id",
    "code",
    "name",
    "path",
    "status",
    "created_at",
    "updated_at",
  ]),
  model("departmentClosure", "tenant", ["departmentManagement", "organizationManagement"], [
    "id",
    "tenant_id",
    "organization_id",
    "ancestor_department_id",
    "descendant_department_id",
    "depth",
    "created_at",
  ]),
  model("departmentAssignment", "tenant", ["departmentManagement", "userDirectory"], [
    "id",
    "tenant_id",
    "organization_id",
    "organization_membership_id",
    "department_id",
    "user_id",
    "assignment_kind",
    "is_primary",
    "effective_from",
    "effective_to",
    "status",
    "created_at",
    "updated_at",
  ]),
  model("position", "tenant", ["positionManagement", "departmentManagement"], [
    "id",
    "tenant_id",
    "organization_id",
    "department_id",
    "code",
    "name",
    "position_kind",
    "rank_level",
    "status",
    "created_at",
    "updated_at",
  ]),
  model("positionAssignment", "tenant", ["positionManagement", "departmentManagement", "userDirectory"], [
    "id",
    "tenant_id",
    "organization_id",
    "department_assignment_id",
    "position_id",
    "user_id",
    "is_primary",
    "effective_from",
    "effective_to",
    "status",
    "created_at",
    "updated_at",
  ]),
  model("roleBinding", "tenant", ["accessControl", "organizationManagement", "departmentManagement"], [
    "id",
    "tenant_id",
    "role_id",
    "principal_kind",
    "principal_id",
    "scope_kind",
    "scope_id",
    "effect",
    "condition_json",
    "status",
    "created_at",
    "updated_at",
  ]),
  model("user", "tenant", ["userDirectory", "accountIdentity"], [
    "id",
    "tenant_id",
    "username",
    "display_name",
    "email",
    "phone",
    "avatar_media_resource_id",
    "avatar_object_blob_id",
    "avatar_resource_snapshot",
    "status",
    "created_at",
    "updated_at",
  ]),
  model("userIdentity", "tenant", ["accountIdentity"], [
    "id",
    "tenant_id",
    "user_id",
    "provider",
    "subject",
    "email",
    "created_at",
  ]),
  model("credential", "tenant", ["accountIdentity", "sessionSecurity"], [
    "id",
    "tenant_id",
    "user_id",
    "credential_type",
    "credential_hash",
    "status",
    "expires_at",
    "created_at",
    "updated_at",
  ]),
  model("session", "tenant", ["sessionSecurity"], [
    "id",
    "tenant_id",
    "organization_id",
    "user_id",
    "app_id",
    "environment",
    "deployment_mode",
    "auth_level",
    "auth_token_hash",
    "access_token_hash",
    "refresh_token_hash",
    "sharding_key",
    "sharding_strategy",
    "data_scope_json",
    "permission_scope_json",
    "expires_at",
    "revoked_at",
    "created_at",
    "updated_at",
  ]),
  model("mfaFactor", "tenant", ["sessionSecurity"], [
    "id",
    "tenant_id",
    "user_id",
    "factor_type",
    "secret_ref",
    "status",
    "created_at",
    "updated_at",
  ]),
  model("device", "tenant", ["sessionSecurity"], [
    "id",
    "tenant_id",
    "user_id",
    "device_fingerprint",
    "name",
    "trusted",
    "last_seen_at",
    "created_at",
  ]),
  model("role", "tenant", ["accessControl"], [
    "id",
    "tenant_id",
    "code",
    "name",
    "status",
    "created_at",
    "updated_at",
  ]),
  model("permission", "global", ["accessControl"], [
    "id",
    "code",
    "name",
    "resource",
    "action",
    "created_at",
  ]),
  model("policy", "tenant", ["accessControl"], [
    "id",
    "tenant_id",
    "code",
    "name",
    "policy_json",
    "status",
    "created_at",
    "updated_at",
  ]),
  model("rolePermission", "tenant", ["accessControl"], [
    "id",
    "tenant_id",
    "role_id",
    "permission_id",
    "created_at",
  ]),
  model("apiKey", "tenant", ["apiAccess"], [
    "id",
    "tenant_id",
    "user_id",
    "name",
    "key_hash",
    "permission_scope_json",
    "status",
    "expires_at",
    "created_at",
    "updated_at",
  ]),
  model("securityEvent", "tenant", ["securityAudit"], [
    "id",
    "tenant_id",
    "user_id",
    "session_id",
    "event_type",
    "severity",
    "detail_json",
    "created_at",
  ]),
  model("auditEvent", "tenant", ["securityAudit"], [
    "id",
    "tenant_id",
    "organization_id",
    "actor_user_id",
    "action",
    "resource_type",
    "resource_id",
    "request_id",
    "app_id",
    "environment",
    "sharding_key",
    "detail_json",
    "created_at",
  ]),
] as const satisfies readonly IamDomainModelContract[];

const app = SDKWORK_IAM_STANDARD.api.appPrefix;
const backend = SDKWORK_IAM_STANDARD.api.backendPrefix;

export const SDKWORK_IAM_API_ROUTES = {
  auth: {
    oauthAuthorizationUrls: {
      retrieve: operation("GET", `${app}/auth/oauth_authorization_urls`, "auth", "oauthAuthorizationUrls.retrieve", "public"),
    },
    oauthSessions: {
      create: operation("POST", `${app}/auth/oauth_sessions`, "auth", "oauthSessions.create", "public"),
    },
    passwordResetRequests: {
      create: operation("POST", `${app}/auth/password_reset_requests`, "auth", "passwordResetRequests.create", "public"),
    },
    passwordResets: {
      create: operation("POST", `${app}/auth/password_resets`, "auth", "passwordResets.create", "public"),
    },
    registrations: {
      create: operation("POST", `${app}/auth/registrations`, "auth", "registrations.create", "public"),
    },
    sessions: {
      create: operation("POST", `${app}/auth/sessions`, "auth", "sessions.create", "public"),
      current: {
        delete: operation("DELETE", `${app}/auth/sessions/current`, "auth", "sessions.current.delete", "dualToken"),
        retrieve: operation("GET", `${app}/auth/sessions/current`, "auth", "sessions.current.retrieve", "dualToken"),
        update: operation("PATCH", `${app}/auth/sessions/current`, "auth", "sessions.current.update", "dualToken"),
      },
      refresh: operation("POST", `${app}/auth/sessions/refresh`, "auth", "sessions.refresh", "refreshToken"),
    },
    verificationCodes: {
      create: operation("POST", `${app}/auth/verification_codes`, "auth", "verificationCodes.create", "public"),
      verify: operation("POST", `${app}/auth/verification_codes/verify`, "auth", "verificationCodes.verify", "public"),
    },
  },
  openPlatform: {
    qrAuth: {
      sessions: {
        create: operation(
          "POST",
          `${app}/open_platform/qr_auth/sessions`,
          "openPlatform",
          "qrAuth.sessions.create",
          "public",
        ),
        retrieve: operation(
          "GET",
          `${app}/open_platform/qr_auth/sessions/{sessionKey}`,
          "openPlatform",
          "qrAuth.sessions.retrieve",
          "public",
        ),
        scans: {
          create: operation(
            "POST",
            `${app}/open_platform/qr_auth/sessions/{sessionKey}/scans`,
            "openPlatform",
            "qrAuth.sessions.scans.create",
            "public",
          ),
        },
        passwords: {
          create: operation(
            "POST",
            `${app}/open_platform/qr_auth/sessions/{sessionKey}/passwords`,
            "openPlatform",
            "qrAuth.sessions.passwords.create",
            "public",
          ),
        },
      },
    },
  },
  system: {
    iam: {
      runtime: {
        retrieve: operation("GET", `${app}/system/iam/runtime`, "system", "iam.runtime.retrieve", "public"),
      },
      verificationPolicy: {
        retrieve: operation("GET", `${app}/system/iam/verification_policy`, "system", "iam.verificationPolicy.retrieve", "public"),
      },
    },
  },
  iam: {
    apiKeys: {
      list: operation("GET", `${backend}/iam/api_keys`, "iam", "apiKeys.list", "dualToken"),
      revoke: operation("POST", `${backend}/iam/api_keys/{apiKeyId}/revoke`, "iam", "apiKeys.revoke", "dualToken"),
    },
    auditEvents: {
      list: operation("GET", `${backend}/iam/audit_events`, "iam", "auditEvents.list", "dualToken"),
    },
    organizations: {
      create: operation("POST", `${backend}/iam/organizations`, "iam", "organizations.create", "dualToken"),
      delete: operation("DELETE", `${backend}/iam/organizations/{organizationId}`, "iam", "organizations.delete", "dualToken"),
      list: operation("GET", `${app}/iam/organizations`, "iam", "organizations.list", "dualToken"),
      retrieve: operation("GET", `${backend}/iam/organizations/{organizationId}`, "iam", "organizations.retrieve", "dualToken"),
      tree: {
        retrieve: operation("GET", `${app}/iam/organizations/tree`, "iam", "organizations.tree.retrieve", "dualToken"),
      },
      update: operation("PATCH", `${backend}/iam/organizations/{organizationId}`, "iam", "organizations.update", "dualToken"),
    },
    organizationMemberships: {
      create: operation("POST", `${backend}/iam/organization_memberships`, "iam", "organizationMemberships.create", "dualToken"),
      list: operation("GET", `${app}/iam/organization_memberships`, "iam", "organizationMemberships.list", "dualToken"),
      update: operation("PATCH", `${backend}/iam/organization_memberships/{membershipId}`, "iam", "organizationMemberships.update", "dualToken"),
    },
    departments: {
      create: operation("POST", `${backend}/iam/departments`, "iam", "departments.create", "dualToken"),
      delete: operation("DELETE", `${backend}/iam/departments/{departmentId}`, "iam", "departments.delete", "dualToken"),
      list: operation("GET", `${app}/iam/departments`, "iam", "departments.list", "dualToken"),
      retrieve: operation("GET", `${backend}/iam/departments/{departmentId}`, "iam", "departments.retrieve", "dualToken"),
      tree: {
        retrieve: operation("GET", `${app}/iam/departments/tree`, "iam", "departments.tree.retrieve", "dualToken"),
      },
      update: operation("PATCH", `${backend}/iam/departments/{departmentId}`, "iam", "departments.update", "dualToken"),
    },
    departmentAssignments: {
      create: operation("POST", `${backend}/iam/department_assignments`, "iam", "departmentAssignments.create", "dualToken"),
      list: operation("GET", `${app}/iam/department_assignments`, "iam", "departmentAssignments.list", "dualToken"),
      update: operation("PATCH", `${backend}/iam/department_assignments/{assignmentId}`, "iam", "departmentAssignments.update", "dualToken"),
    },
    permissions: {
      create: operation("POST", `${backend}/iam/permissions`, "iam", "permissions.create", "dualToken"),
      delete: operation("DELETE", `${backend}/iam/permissions/{permissionId}`, "iam", "permissions.delete", "dualToken"),
      list: operation("GET", `${backend}/iam/permissions`, "iam", "permissions.list", "dualToken"),
      retrieve: operation("GET", `${backend}/iam/permissions/{permissionId}`, "iam", "permissions.retrieve", "dualToken"),
      update: operation("PATCH", `${backend}/iam/permissions/{permissionId}`, "iam", "permissions.update", "dualToken"),
    },
    positions: {
      create: operation("POST", `${backend}/iam/positions`, "iam", "positions.create", "dualToken"),
      delete: operation("DELETE", `${backend}/iam/positions/{positionId}`, "iam", "positions.delete", "dualToken"),
      list: operation("GET", `${app}/iam/positions`, "iam", "positions.list", "dualToken"),
      update: operation("PATCH", `${backend}/iam/positions/{positionId}`, "iam", "positions.update", "dualToken"),
    },
    positionAssignments: {
      create: operation("POST", `${backend}/iam/position_assignments`, "iam", "positionAssignments.create", "dualToken"),
      list: operation("GET", `${app}/iam/position_assignments`, "iam", "positionAssignments.list", "dualToken"),
      update: operation("PATCH", `${backend}/iam/position_assignments/{assignmentId}`, "iam", "positionAssignments.update", "dualToken"),
    },
    policies: {
      create: operation("POST", `${backend}/iam/policies`, "iam", "policies.create", "dualToken"),
      delete: operation("DELETE", `${backend}/iam/policies/{policyId}`, "iam", "policies.delete", "dualToken"),
      list: operation("GET", `${backend}/iam/policies`, "iam", "policies.list", "dualToken"),
      retrieve: operation("GET", `${backend}/iam/policies/{policyId}`, "iam", "policies.retrieve", "dualToken"),
      update: operation("PATCH", `${backend}/iam/policies/{policyId}`, "iam", "policies.update", "dualToken"),
    },
    roles: {
      create: operation("POST", `${backend}/iam/roles`, "iam", "roles.create", "dualToken"),
      delete: operation("DELETE", `${backend}/iam/roles/{roleId}`, "iam", "roles.delete", "dualToken"),
      list: operation("GET", `${backend}/iam/roles`, "iam", "roles.list", "dualToken"),
      retrieve: operation("GET", `${backend}/iam/roles/{roleId}`, "iam", "roles.retrieve", "dualToken"),
      update: operation("PATCH", `${backend}/iam/roles/{roleId}`, "iam", "roles.update", "dualToken"),
      permissions: {
        create: operation("POST", `${backend}/iam/roles/{roleId}/permissions`, "iam", "roles.permissions.create", "dualToken"),
        delete: operation("DELETE", `${backend}/iam/roles/{roleId}/permissions/{permissionId}`, "iam", "roles.permissions.delete", "dualToken"),
        list: operation("GET", `${backend}/iam/roles/{roleId}/permissions`, "iam", "roles.permissions.list", "dualToken"),
      },
    },
    roleBindings: {
      create: operation("POST", `${backend}/iam/role_bindings`, "iam", "roleBindings.create", "dualToken"),
      delete: operation("DELETE", `${backend}/iam/role_bindings/{roleBindingId}`, "iam", "roleBindings.delete", "dualToken"),
      list: operation("GET", `${app}/iam/role_bindings`, "iam", "roleBindings.list", "dualToken"),
    },
    securityEvents: {
      list: operation("GET", `${backend}/iam/security_events`, "iam", "securityEvents.list", "dualToken"),
    },
    tenants: {
      create: operation("POST", `${backend}/iam/tenants`, "iam", "tenants.create", "dualToken"),
      delete: operation("DELETE", `${backend}/iam/tenants/{tenantId}`, "iam", "tenants.delete", "dualToken"),
      list: operation("GET", `${backend}/iam/tenants`, "iam", "tenants.list", "dualToken"),
      retrieve: operation("GET", `${backend}/iam/tenants/{tenantId}`, "iam", "tenants.retrieve", "dualToken"),
      update: operation("PATCH", `${backend}/iam/tenants/{tenantId}`, "iam", "tenants.update", "dualToken"),
      members: {
        create: operation("POST", `${backend}/iam/tenants/{tenantId}/members`, "iam", "tenants.members.create", "dualToken"),
        delete: operation("DELETE", `${backend}/iam/tenants/{tenantId}/members/{userId}`, "iam", "tenants.members.delete", "dualToken"),
        list: operation("GET", `${backend}/iam/tenants/{tenantId}/members`, "iam", "tenants.members.list", "dualToken"),
        update: operation("PATCH", `${backend}/iam/tenants/{tenantId}/members/{userId}`, "iam", "tenants.members.update", "dualToken"),
      },
    },
    users: {
      current: {
        retrieve: operation("GET", `${app}/iam/users/current`, "iam", "users.current.retrieve", "dualToken"),
      },
      create: operation("POST", `${backend}/iam/users`, "iam", "users.create", "dualToken"),
      delete: operation("DELETE", `${backend}/iam/users/{userId}`, "iam", "users.delete", "dualToken"),
      list: operation("GET", `${backend}/iam/users`, "iam", "users.list", "dualToken"),
      retrieve: operation("GET", `${backend}/iam/users/{userId}`, "iam", "users.retrieve", "dualToken"),
      update: operation("PATCH", `${backend}/iam/users/{userId}`, "iam", "users.update", "dualToken"),
    },
  },
} as const;

export const SDKWORK_IAM_OPERATION_IDS = flattenOperations(SDKWORK_IAM_API_ROUTES);

export const SDKWORK_IAM_CAPABILITIES = [
  capability(
    "tenantManagement",
    ["iam"],
    ["tenant"],
    [
      "tenants.create",
      "tenants.delete",
      "tenants.list",
      "tenants.members.create",
      "tenants.members.delete",
      "tenants.members.list",
      "tenants.members.update",
      "tenants.retrieve",
      "tenants.update",
    ],
  ),
  capability(
    "organizationManagement",
    ["iam"],
    ["organization", "organizationClosure", "organizationMembership"],
    [
      "organizations.create",
      "organizations.delete",
      "organizations.list",
      "organizationMemberships.create",
      "organizationMemberships.list",
      "organizationMemberships.update",
      "organizations.retrieve",
      "organizations.tree.retrieve",
      "organizations.update",
    ],
  ),
  capability(
    "departmentManagement",
    ["iam"],
    ["department", "departmentClosure", "departmentAssignment"],
    [
      "departmentAssignments.create",
      "departmentAssignments.list",
      "departmentAssignments.update",
      "departments.create",
      "departments.delete",
      "departments.list",
      "departments.retrieve",
      "departments.tree.retrieve",
      "departments.update",
    ],
  ),
  capability(
    "positionManagement",
    ["iam"],
    ["position", "positionAssignment"],
    [
      "positionAssignments.create",
      "positionAssignments.list",
      "positionAssignments.update",
      "positions.create",
      "positions.delete",
      "positions.list",
      "positions.update",
    ],
  ),
  capability(
    "userDirectory",
    ["iam"],
    ["user", "organizationMembership", "departmentAssignment", "positionAssignment"],
    ["users.create", "users.delete", "users.list", "users.retrieve", "users.update"],
  ),
  capability(
    "accountIdentity",
    ["auth", "iam", "system"],
    ["user", "userIdentity", "credential"],
    [
      "iam.runtime.retrieve",
      "iam.verificationPolicy.retrieve",
      "passwordResetRequests.create",
      "passwordResets.create",
      "registrations.create",
      "verificationCodes.create",
      "verificationCodes.verify",
      "users.current.retrieve",
    ],
  ),
  capability(
    "sessionSecurity",
    ["auth", "openPlatform"],
    ["session", "credential", "mfaFactor", "device"],
    [
      "oauthAuthorizationUrls.retrieve",
      "oauthSessions.create",
      "qrAuth.sessions.create",
      "qrAuth.sessions.passwords.create",
      "qrAuth.sessions.retrieve",
      "qrAuth.sessions.scans.create",
      "sessions.create",
      "sessions.current.delete",
      "sessions.current.retrieve",
      "sessions.current.update",
      "sessions.refresh",
    ],
  ),
  capability(
    "accessControl",
    ["iam"],
    ["role", "roleBinding", "permission", "policy", "rolePermission"],
    [
      "permissions.create",
      "permissions.delete",
      "permissions.list",
      "permissions.retrieve",
      "permissions.update",
      "policies.create",
      "policies.delete",
      "policies.list",
      "policies.retrieve",
      "policies.update",
      "roles.create",
      "roles.delete",
      "roles.list",
      "roles.retrieve",
      "roles.permissions.create",
      "roles.permissions.delete",
      "roles.permissions.list",
      "roles.update",
      "roleBindings.create",
      "roleBindings.delete",
      "roleBindings.list",
    ],
  ),
  capability(
    "apiAccess",
    ["iam"],
    ["apiKey"],
    ["apiKeys.list", "apiKeys.revoke"],
  ),
  capability(
    "securityAudit",
    ["iam"],
    ["securityEvent", "auditEvent"],
    ["securityEvents.list", "auditEvents.list"],
  ),
] as const satisfies readonly IamCapabilityContract[];

export function createIamAppContext(input: IamAppContext): IamAppContext {
  return {
    ...input,
    dataScope: [...input.dataScope],
    permissionScope: [...input.permissionScope],
  };
}

export function createIamShardingContext(input: IamAppContext): IamShardingContext {
  if (input.organizationId) {
    return {
      shardingKey: input.organizationId,
      shardingStrategy: "organization",
    };
  }

  if (input.tenantId) {
    return {
      shardingKey: input.tenantId,
      shardingStrategy: "tenant",
    };
  }

  return {
    shardingKey: input.userId || input.appId,
    shardingStrategy: input.userId ? "user" : "single",
  };
}

function operation(
  method: IamOperationContract["method"],
  path: string,
  tag: IamOperationContract["tag"],
  operationId: string,
  security: IamOperationContract["security"],
): IamOperationContract {
  return {
    method,
    operationId,
    path,
    security,
    tag,
  };
}

function model(
  name: IamDomainModelName,
  ownership: IamDomainModelOwnership,
  capabilities: readonly IamCapabilityName[],
  fields: readonly string[],
): IamDomainModelContract {
  return {
    capabilities,
    domain: "iam",
    fields,
    name,
    ownership,
    table: SDKWORK_IAM_TABLES[name],
  };
}

function capability(
  name: IamCapabilityName,
  sdkNamespaces: readonly ("auth" | "iam" | "openPlatform" | "system")[],
  models: readonly IamDomainModelName[],
  operations: readonly string[],
): IamCapabilityContract {
  return {
    domain: "iam",
    models,
    name,
    operations,
    sdkNamespaces,
  };
}

function flattenOperations(value: unknown): Record<string, IamOperationContract> {
  const result: Record<string, IamOperationContract> = {};

  function visit(node: unknown) {
    if (!node || typeof node !== "object") {
      return;
    }

    if ("operationId" in node && "path" in node) {
      const operation = node as IamOperationContract;
      result[operation.operationId] = operation;
      return;
    }

    for (const child of Object.values(node)) {
      visit(child);
    }
  }

  visit(value);
  return result;
}
