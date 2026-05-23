import type { SdkworkIamService } from "@sdkwork/iam-service";

export interface SdkworkIamRole {
  code?: string;
  id: string;
  name: string;
  roleId: string;
  status?: string;
  tenantId?: string;
}

export interface SdkworkIamPermission {
  action?: string;
  code: string;
  id: string;
  name: string;
  permissionId: string;
  resource?: string;
}

export interface SdkworkIamPolicy {
  code?: string;
  id: string;
  name: string;
  policyId: string;
  status?: string;
  tenantId?: string;
}

export interface SdkworkIamUserRole {
  id: string;
  organizationId?: string;
  roleCode?: string;
  roleId: string;
  userId?: string;
}

export interface SdkworkAuthorizationHint {
  action?: string;
  mode?: "all" | "any";
  permissionCode?: string;
  permissionCodes?: readonly string[];
  resource?: string;
  roleIds?: readonly string[];
}

export interface SdkworkIamPermissionState {
  lastUserId?: string;
  permissionScope: readonly string[];
  permissions: readonly SdkworkIamPermission[];
  policies: readonly SdkworkIamPolicy[];
  rolePermissions: Readonly<Record<string, readonly SdkworkIamPermission[]>>;
  roles: readonly SdkworkIamRole[];
  status: "idle" | "loading" | "ready" | "error";
  userRoles: readonly SdkworkIamUserRole[];
}

export interface CreateSdkworkIamPermissionControllerInput {
  permissionScope?: readonly string[];
  service: SdkworkIamService;
}

export interface SdkworkIamPermissionController {
  assignRolePermission(roleId: string, permissionId: string): Promise<unknown>;
  assignUserRole(userId: string, roleId: string): Promise<unknown>;
  can(hint: string | SdkworkAuthorizationHint): boolean;
  getState(): SdkworkIamPermissionState;
  listPermissions(params?: Record<string, unknown>): Promise<readonly SdkworkIamPermission[]>;
  listPolicies(params?: Record<string, unknown>): Promise<readonly SdkworkIamPolicy[]>;
  listRolePermissions(roleId: string, params?: Record<string, unknown>): Promise<readonly SdkworkIamPermission[]>;
  listRoles(params?: Record<string, unknown>): Promise<readonly SdkworkIamRole[]>;
  listUserRoles(userId: string, params?: Record<string, unknown>): Promise<readonly SdkworkIamUserRole[]>;
  revokeRolePermission(roleId: string, permissionId: string): Promise<unknown>;
  revokeUserRole(userId: string, roleId: string): Promise<unknown>;
}

export function createSdkworkIamPermissionController(
  input: SdkworkIamService | CreateSdkworkIamPermissionControllerInput,
): SdkworkIamPermissionController {
  const resolved = resolveInput(input);
  let state: SdkworkIamPermissionState = {
    lastUserId: undefined,
    permissionScope: [...new Set((resolved.permissionScope ?? []).map(normalizeRequiredCode))],
    permissions: [],
    policies: [],
    rolePermissions: {},
    roles: [],
    status: "idle",
    userRoles: [],
  };

  const setState = (patch: Partial<SdkworkIamPermissionState>) => {
    state = {
      ...state,
      ...patch,
    };
  };

  return {
    assignRolePermission: async (roleId, permissionId) => {
      const result = await resolved.service.iam.roles.permissions.create(
        requireId(roleId, "roleId"),
        requireId(permissionId, "permissionId"),
      );
      return result;
    },
    assignUserRole: async (userId, roleId) => resolved.service.iam.users.roles.create(
      requireId(userId, "userId"),
      requireId(roleId, "roleId"),
    ),
    can: (hint) => evaluateAuthorization(state, hint),
    getState: () => ({
      ...state,
      permissionScope: [...state.permissionScope],
      permissions: [...state.permissions],
      policies: [...state.policies],
      rolePermissions: Object.fromEntries(
        Object.entries(state.rolePermissions).map(([roleId, permissions]) => [roleId, [...permissions]]),
      ),
      roles: [...state.roles],
      userRoles: [...state.userRoles],
    }),
    listPermissions: async (params) => {
      setState({ status: "loading" });
      try {
        const permissions = extractList(await resolved.service.iam.permissions.list(params))
          .map(toPermission)
          .filter(Boolean) as SdkworkIamPermission[];
        setState({ permissions, status: "ready" });
        return permissions;
      } catch (error) {
        setState({ status: "error" });
        throw error;
      }
    },
    listPolicies: async (params) => {
      setState({ status: "loading" });
      try {
        const policies = extractList(await resolved.service.iam.policies.list(params))
          .map(toPolicy)
          .filter(Boolean) as SdkworkIamPolicy[];
        setState({ policies, status: "ready" });
        return policies;
      } catch (error) {
        setState({ status: "error" });
        throw error;
      }
    },
    listRolePermissions: async (roleId, params) => {
      const normalizedRoleId = requireId(roleId, "roleId");
      setState({ status: "loading" });
      try {
        const permissions = extractList(await resolved.service.iam.roles.permissions.list(normalizedRoleId, params))
          .map(toPermission)
          .filter(Boolean) as SdkworkIamPermission[];
        setState({
          rolePermissions: {
            ...state.rolePermissions,
            [normalizedRoleId]: permissions,
          },
          status: "ready",
        });
        return permissions;
      } catch (error) {
        setState({ status: "error" });
        throw error;
      }
    },
    listRoles: async (params) => {
      setState({ status: "loading" });
      try {
        const roles = extractList(await resolved.service.iam.roles.list(params))
          .map(toRole)
          .filter(Boolean) as SdkworkIamRole[];
        setState({ roles, status: "ready" });
        return roles;
      } catch (error) {
        setState({ status: "error" });
        throw error;
      }
    },
    listUserRoles: async (userId, params) => {
      const normalizedUserId = requireId(userId, "userId");
      setState({ status: "loading" });
      try {
        const roles = extractList(await resolved.service.iam.users.roles.list(normalizedUserId, params))
          .map((role) => toUserRole(role, normalizedUserId))
          .filter(Boolean) as SdkworkIamUserRole[];
        setState({ lastUserId: normalizedUserId, status: "ready", userRoles: roles });
        return roles;
      } catch (error) {
        setState({ status: "error" });
        throw error;
      }
    },
    revokeRolePermission: async (roleId, permissionId) => resolved.service.iam.roles.permissions.delete(
      requireId(roleId, "roleId"),
      requireId(permissionId, "permissionId"),
    ),
    revokeUserRole: async (userId, roleId) => resolved.service.iam.users.roles.delete(
      requireId(userId, "userId"),
      requireId(roleId, "roleId"),
    ),
  };
}

function resolveInput(
  input: SdkworkIamService | CreateSdkworkIamPermissionControllerInput,
): CreateSdkworkIamPermissionControllerInput {
  if ("service" in input) {
    return input;
  }

  return { service: input };
}

function evaluateAuthorization(
  state: SdkworkIamPermissionState,
  hint: string | SdkworkAuthorizationHint,
): boolean {
  const normalizedHint = typeof hint === "string" ? { permissionCode: hint } : hint;
  const requiredCodes = getRequiredPermissionCodes(state.permissions, normalizedHint);
  if (requiredCodes.length === 0) {
    return false;
  }

  const grantedCodes = new Set(state.permissionScope.map(normalizeRequiredCode));
  const roleIds = new Set([
    ...state.userRoles.map((role) => role.roleId),
    ...(normalizedHint.roleIds ?? []).map(normalizeRequiredCode),
  ]);

  for (const roleId of roleIds) {
    for (const permission of state.rolePermissions[roleId] ?? []) {
      grantedCodes.add(normalizeRequiredCode(permission.code));
    }
  }

  if (grantedCodes.has("*")) {
    return true;
  }

  const mode = normalizedHint.mode ?? "any";
  const checks = requiredCodes.map((code) => isGranted(grantedCodes, code));
  return mode === "all" ? checks.every(Boolean) : checks.some(Boolean);
}

function getRequiredPermissionCodes(
  knownPermissions: readonly SdkworkIamPermission[],
  hint: SdkworkAuthorizationHint,
): string[] {
  const codes = new Set<string>();

  if (hint.permissionCode) {
    codes.add(normalizeRequiredCode(hint.permissionCode));
  }

  for (const code of hint.permissionCodes ?? []) {
    codes.add(normalizeRequiredCode(code));
  }

  if (hint.resource && hint.action) {
    const resource = normalizeRequiredCode(hint.resource);
    const action = normalizeRequiredCode(hint.action);
    codes.add(`${resource}.${action}`);
    codes.add(`${resource}:${action}`);

    for (const permission of knownPermissions) {
      if (
        normalizeRequiredCode(permission.resource) === resource
        && normalizeRequiredCode(permission.action) === action
      ) {
        codes.add(normalizeRequiredCode(permission.code));
      }
    }
  }

  return [...codes].filter(Boolean);
}

function isGranted(grantedCodes: ReadonlySet<string>, requiredCode: string): boolean {
  if (grantedCodes.has(requiredCode)) {
    return true;
  }

  for (const grantedCode of grantedCodes) {
    if (!grantedCode.endsWith(".*")) {
      continue;
    }

    const resourcePrefix = grantedCode.slice(0, -2);
    if (
      requiredCode === resourcePrefix
      || requiredCode.startsWith(`${resourcePrefix}.`)
      || requiredCode.startsWith(`${resourcePrefix}:`)
    ) {
      return true;
    }
  }

  return false;
}

function extractList(value: unknown): unknown[] {
  if (Array.isArray(value)) {
    return value;
  }

  if (!value || typeof value !== "object") {
    return [];
  }

  const record = value as Record<string, unknown>;
  for (const key of ["records", "items", "list", "rows", "content", "data"]) {
    const nested = record[key];
    if (Array.isArray(nested)) {
      return nested;
    }
  }

  return [];
}

function toRole(value: unknown): SdkworkIamRole | undefined {
  const record = toRecord(value);
  const roleId = optionalString(record.roleId) || optionalString(record.role_id) || optionalString(record.id);
  if (!roleId) {
    return undefined;
  }

  return {
    code: optionalString(record.code),
    id: optionalString(record.id) || roleId,
    name: optionalString(record.name) || optionalString(record.roleName) || roleId,
    roleId,
    status: optionalString(record.status),
    tenantId: optionalString(record.tenantId) || optionalString(record.tenant_id),
  };
}

function toPermission(value: unknown): SdkworkIamPermission | undefined {
  const record = toRecord(value);
  const permissionId = optionalString(record.permissionId) || optionalString(record.permission_id) || optionalString(record.id) || optionalString(record.code);
  const code = optionalString(record.code) || optionalString(record.permissionCode);
  if (!permissionId || !code) {
    return undefined;
  }

  return {
    action: optionalString(record.action),
    code,
    id: optionalString(record.id) || permissionId,
    name: optionalString(record.name) || optionalString(record.permissionName) || code,
    permissionId,
    resource: optionalString(record.resource),
  };
}

function toPolicy(value: unknown): SdkworkIamPolicy | undefined {
  const record = toRecord(value);
  const policyId = optionalString(record.policyId) || optionalString(record.policy_id) || optionalString(record.id);
  if (!policyId) {
    return undefined;
  }

  return {
    code: optionalString(record.code),
    id: optionalString(record.id) || policyId,
    name: optionalString(record.name) || optionalString(record.policyName) || policyId,
    policyId,
    status: optionalString(record.status),
    tenantId: optionalString(record.tenantId) || optionalString(record.tenant_id),
  };
}

function toUserRole(value: unknown, fallbackUserId: string): SdkworkIamUserRole | undefined {
  const record = toRecord(value);
  const roleId = optionalString(record.roleId) || optionalString(record.role_id) || optionalString(record.id);
  if (!roleId) {
    return undefined;
  }

  return {
    id: optionalString(record.id) || roleId,
    organizationId: optionalString(record.organizationId) || optionalString(record.organization_id),
    roleCode: optionalString(record.roleCode) || optionalString(record.code),
    roleId,
    userId: optionalString(record.userId) || optionalString(record.user_id) || fallbackUserId,
  };
}

function toRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? value as Record<string, unknown> : {};
}

function optionalString(value: unknown): string | undefined {
  const normalized = typeof value === "string" ? value.trim() : value === undefined || value === null ? "" : String(value).trim();
  return normalized || undefined;
}

function normalizeRequiredCode(value: unknown): string {
  return optionalString(value)?.replace(/\s+/gu, "").toLowerCase() ?? "";
}

function requireId(value: unknown, name: string): string {
  const normalized = optionalString(value);
  if (!normalized) {
    throw new Error(`SDKWork IAM permission controller requires ${name}`);
  }

  return normalized;
}
