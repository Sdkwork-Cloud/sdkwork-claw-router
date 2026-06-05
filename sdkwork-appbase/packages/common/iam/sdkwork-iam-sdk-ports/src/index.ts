import { SDKWORK_IAM_OPERATION_IDS, SDKWORK_IAM_STANDARD } from "@sdkwork/iam-contracts";

export type IamSdkMethod = (...args: any[]) => Promise<unknown>;

export interface IamAppSdkClient {
  auth?: {
    oauthAuthorizationUrls?: {
      retrieve?: IamSdkMethod;
    };
    oauthSessions?: {
      create?: IamSdkMethod;
    };
    passwordResetRequests?: {
      create?: IamSdkMethod;
    };
    passwordResets?: {
      create?: IamSdkMethod;
    };
    registrations?: {
      create?: IamSdkMethod;
    };
    sessions?: {
      create?: IamSdkMethod;
      current?: {
        delete?: IamSdkMethod;
        retrieve?: IamSdkMethod;
        update?: IamSdkMethod;
      };
      refresh?: IamSdkMethod;
    };
    verificationCodes?: {
      create?: IamSdkMethod;
      verify?: IamSdkMethod;
    };
  };
  openPlatform?: IamAppOpenPlatformResourceClient;
  system?: IamAppSystemResourceClient;
  iam?: IamAppIamResourceClient;
}

export interface IamBackendSdkClient {
  auth?: unknown;
  iam?: IamBackendIamResourceClient;
}

export interface IamAppIamResourceClient {
  organizations?: {
    list?: IamSdkMethod;
    tree?: {
      retrieve?: IamSdkMethod;
    };
  };
  organizationMemberships?: {
    list?: IamSdkMethod;
  };
  departments?: {
    list?: IamSdkMethod;
    tree?: {
      retrieve?: IamSdkMethod;
    };
  };
  departmentAssignments?: {
    list?: IamSdkMethod;
  };
  positions?: {
    list?: IamSdkMethod;
  };
  positionAssignments?: {
    list?: IamSdkMethod;
  };
  roleBindings?: {
    list?: IamSdkMethod;
  };
  users?: {
    current?: {
      retrieve?: IamSdkMethod;
    };
  };
}

export interface IamAppSystemResourceClient {
  iam?: {
    runtime?: {
      retrieve?: IamSdkMethod;
    };
    verificationPolicy?: {
      retrieve?: IamSdkMethod;
    };
  };
}

export interface IamAppOpenPlatformResourceClient {
  qrAuth?: {
    sessions?: {
      create?: IamSdkMethod;
      retrieve?: IamSdkMethod;
      passwords?: {
        create?: IamSdkMethod;
      };
      scans?: {
        create?: IamSdkMethod;
      };
    };
  };
}

export interface IamBackendIamResourceClient {
  apiKeys?: {
    list?: IamSdkMethod;
    revoke?: IamSdkMethod;
  };
  auditEvents?: {
    list?: IamSdkMethod;
  };
  organizations?: {
    create?: IamSdkMethod;
    delete?: IamSdkMethod;
    retrieve?: IamSdkMethod;
    update?: IamSdkMethod;
  };
  organizationMemberships?: {
    create?: IamSdkMethod;
    update?: IamSdkMethod;
  };
  departments?: {
    create?: IamSdkMethod;
    delete?: IamSdkMethod;
    retrieve?: IamSdkMethod;
    update?: IamSdkMethod;
  };
  departmentAssignments?: {
    create?: IamSdkMethod;
    update?: IamSdkMethod;
  };
  permissions?: {
    create?: IamSdkMethod;
    delete?: IamSdkMethod;
    list?: IamSdkMethod;
    retrieve?: IamSdkMethod;
    update?: IamSdkMethod;
  };
  policies?: {
    create?: IamSdkMethod;
    delete?: IamSdkMethod;
    list?: IamSdkMethod;
    retrieve?: IamSdkMethod;
    update?: IamSdkMethod;
  };
  positions?: {
    create?: IamSdkMethod;
    delete?: IamSdkMethod;
    update?: IamSdkMethod;
  };
  positionAssignments?: {
    create?: IamSdkMethod;
    update?: IamSdkMethod;
  };
  roles?: {
    create?: IamSdkMethod;
    delete?: IamSdkMethod;
    list?: IamSdkMethod;
    retrieve?: IamSdkMethod;
    update?: IamSdkMethod;
    permissions?: {
      create?: IamSdkMethod;
      delete?: IamSdkMethod;
      list?: IamSdkMethod;
    };
  };
  roleBindings?: {
    create?: IamSdkMethod;
    delete?: IamSdkMethod;
  };
  securityEvents?: {
    list?: IamSdkMethod;
  };
  tenants?: {
    create?: IamSdkMethod;
    delete?: IamSdkMethod;
    list?: IamSdkMethod;
    retrieve?: IamSdkMethod;
    update?: IamSdkMethod;
    members?: {
      create?: IamSdkMethod;
      delete?: IamSdkMethod;
      list?: IamSdkMethod;
      update?: IamSdkMethod;
    };
  };
  users?: {
    create?: IamSdkMethod;
    delete?: IamSdkMethod;
    list?: IamSdkMethod;
    retrieve?: IamSdkMethod;
    update?: IamSdkMethod;
  };
}

export interface IamSdkResourceClient {
  apiKeys?: IamBackendIamResourceClient["apiKeys"];
  auditEvents?: IamBackendIamResourceClient["auditEvents"];
  organizations?: NonNullable<IamAppIamResourceClient["organizations"]> & NonNullable<IamBackendIamResourceClient["organizations"]>;
  organizationMemberships?: NonNullable<IamAppIamResourceClient["organizationMemberships"]> & NonNullable<IamBackendIamResourceClient["organizationMemberships"]>;
  departments?: NonNullable<IamAppIamResourceClient["departments"]> & NonNullable<IamBackendIamResourceClient["departments"]>;
  departmentAssignments?: NonNullable<IamAppIamResourceClient["departmentAssignments"]> & NonNullable<IamBackendIamResourceClient["departmentAssignments"]>;
  permissions?: IamBackendIamResourceClient["permissions"];
  positions?: NonNullable<IamAppIamResourceClient["positions"]> & NonNullable<IamBackendIamResourceClient["positions"]>;
  positionAssignments?: NonNullable<IamAppIamResourceClient["positionAssignments"]> & NonNullable<IamBackendIamResourceClient["positionAssignments"]>;
  policies?: IamBackendIamResourceClient["policies"];
  roles?: IamBackendIamResourceClient["roles"];
  roleBindings?: NonNullable<IamAppIamResourceClient["roleBindings"]> & NonNullable<IamBackendIamResourceClient["roleBindings"]>;
  securityEvents?: IamBackendIamResourceClient["securityEvents"];
  tenants?: IamBackendIamResourceClient["tenants"];
  users?: NonNullable<IamAppIamResourceClient["users"]> & NonNullable<IamBackendIamResourceClient["users"]>;
}

export const SDKWORK_IAM_APP_SDK_REQUIRED_METHODS = [
  ...requiredSdkMethodsForPrefix(SDKWORK_IAM_STANDARD.api.appPrefix),
] as const;

export const SDKWORK_IAM_BACKEND_SDK_REQUIRED_METHODS = [
  ...requiredSdkMethodsForPrefix(SDKWORK_IAM_STANDARD.api.backendPrefix),
] as const;

export const SDKWORK_IAM_BACKEND_SDK_FORBIDDEN_METHODS = [
  ...requiredSdkMethodsForPrefix(SDKWORK_IAM_STANDARD.api.appPrefix).filter((method) => method.startsWith("iam.")),
] as const;

export const SDKWORK_IAM_RETIRED_BACKEND_SDK_METHODS = [
  "iam.organizations.members.create",
  "iam.organizations.members.delete",
  "iam.organizations.members.list",
  "iam.organizations.members.update",
  "iam.users.roles.create",
  "iam.users.roles.delete",
  "iam.users.roles.list",
] as const;

const SDKWORK_IAM_RETIRED_ORGANIZATION_MEMBER_METHODS = [
  "iam.organizations.members.create",
  "iam.organizations.members.delete",
  "iam.organizations.members.list",
  "iam.organizations.members.update",
] as const;

const SDKWORK_IAM_RETIRED_DIRECT_USER_ROLE_METHODS = [
  "iam.users.roles.create",
  "iam.users.roles.delete",
  "iam.users.roles.list",
] as const;

const SDKWORK_IAM_APP_OPEN_PLATFORM_QR_METHODS = [
  "openPlatform.qrAuth.sessions.create",
  "openPlatform.qrAuth.sessions.passwords.create",
  "openPlatform.qrAuth.sessions.retrieve",
  "openPlatform.qrAuth.sessions.scans.create",
] as const;

export function assertIamAppSdkClient(client: unknown): asserts client is IamAppSdkClient {
  const surface = getIamSdkSurface(client);
  const retiredQrMethods = surface.filter((method) =>
    method.startsWith("auth.loginQrCodes.") || method.startsWith("auth.loginQrCodeCallbacks.")
  );
  if (retiredQrMethods.length > 0) {
    throw new Error(
      `Generated app SDK client exposes retired IAM QR login resources: ${retiredQrMethods.join(", ")}. Use openPlatform.qrAuth.sessions methods.`,
    );
  }

  const missingMethods = findMissingMethods(surface, SDKWORK_IAM_APP_SDK_REQUIRED_METHODS);

  if (missingMethods.length > 0) {
    throw new Error(`Generated app SDK client is missing standard IAM methods: ${missingMethods.join(", ")}`);
  }

  if (surface.includes("auth.createSession")) {
    throw new Error("Legacy app SDK method auth.createSession is forbidden; use auth.sessions.create");
  }

  const openPlatformQrMethods = surface.filter((method) => method.startsWith("openPlatform.qrAuth.sessions."));
  if (openPlatformQrMethods.length > 0) {
    const missingQrMethods = findMissingMethods(surface, SDKWORK_IAM_APP_OPEN_PLATFORM_QR_METHODS);
    if (missingQrMethods.length > 0) {
      throw new Error(`Generated app SDK client exposes incomplete IAM QR login resources: ${missingQrMethods.join(", ")}`);
    }
  }
}

export function assertIamBackendSdkClient(client: unknown): asserts client is IamBackendSdkClient {
  const surface = getIamSdkSurface(client);
  const missingMethods = findMissingMethods(surface, SDKWORK_IAM_BACKEND_SDK_REQUIRED_METHODS);

  if (surface.some((method) => method.startsWith("auth."))) {
    throw new Error("Generated backend SDK client must not expose an auth namespace; login and session APIs belong to app API only");
  }

  const forbiddenMethods = surface.filter((method) => SDKWORK_IAM_BACKEND_SDK_FORBIDDEN_METHODS.includes(method));
  if (forbiddenMethods.length > 0) {
    throw new Error(`Generated backend SDK client must not expose app-only IAM resources: ${forbiddenMethods.join(", ")}`);
  }

  const retiredOrganizationMemberMethods = surface.filter((method) =>
    SDKWORK_IAM_RETIRED_ORGANIZATION_MEMBER_METHODS.includes(method as (typeof SDKWORK_IAM_RETIRED_ORGANIZATION_MEMBER_METHODS)[number])
  );
  if (retiredOrganizationMemberMethods.length > 0) {
    throw new Error(
      `Generated backend SDK client exposes retired IAM organization member resources: ${retiredOrganizationMemberMethods.join(", ")}. Use iam.organizationMemberships methods.`,
    );
  }

  const retiredDirectUserRoleMethods = surface.filter((method) =>
    SDKWORK_IAM_RETIRED_DIRECT_USER_ROLE_METHODS.includes(method as (typeof SDKWORK_IAM_RETIRED_DIRECT_USER_ROLE_METHODS)[number])
  );
  if (retiredDirectUserRoleMethods.length > 0) {
    throw new Error(
      `Generated backend SDK client exposes retired IAM direct user role resources: ${retiredDirectUserRoleMethods.join(", ")}. Use iam.roleBindings for scoped role assignment.`,
    );
  }

  if (missingMethods.length > 0) {
    throw new Error(`Generated backend SDK client is missing standard IAM methods: ${missingMethods.join(", ")}`);
  }
}

export function getIamSdkSurface(client: unknown): string[] {
  const methods = new Set<string>();
  const visited = new WeakSet<object>();

  function visit(node: unknown, path: string[]) {
    if (!node || typeof node !== "object") {
      return;
    }
    if (visited.has(node)) {
      return;
    }
    visited.add(node);

    for (const [key, value] of Object.entries(node)) {
      const next = [...path, key];
      if (typeof value === "function") {
        methods.add(next.join("."));
      } else {
        visit(value, next);
      }
    }

    const prototype = Object.getPrototypeOf(node);
    if (!prototype || prototype === Object.prototype) {
      return;
    }

    for (const key of Object.getOwnPropertyNames(prototype)) {
      if (key === "constructor") {
        continue;
      }
      const descriptor = Object.getOwnPropertyDescriptor(prototype, key);
      if (typeof descriptor?.value === "function") {
        methods.add([...path, key].join("."));
      }
    }
  }

  visit(client, []);
  return [...methods].sort();
}

function findMissingMethods(
  surface: readonly string[],
  requiredMethods: readonly string[],
): string[] {
  const surfaceSet = new Set(surface);
  return requiredMethods.filter((method) => !surfaceSet.has(method));
}

function requiredSdkMethodsForPrefix(prefix: string): string[] {
  return Object.values(SDKWORK_IAM_OPERATION_IDS)
    .filter((operation) => operation.path.startsWith(prefix))
    .map((operation) => `${operation.tag}.${operation.operationId}`)
    .sort();
}
