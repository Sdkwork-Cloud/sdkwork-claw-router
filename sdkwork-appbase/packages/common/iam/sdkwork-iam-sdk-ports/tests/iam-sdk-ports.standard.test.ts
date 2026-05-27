import { describe, expect, it, vi } from "vitest";

import { SDKWORK_IAM_OPERATION_IDS } from "@sdkwork/iam-contracts";

import {
  SDKWORK_IAM_APP_SDK_REQUIRED_METHODS,
  SDKWORK_IAM_BACKEND_SDK_REQUIRED_METHODS,
  assertIamAppSdkClient,
  assertIamBackendSdkClient,
  getIamSdkSurface,
} from "../src/index";

describe("SDKWork IAM SDK port contracts", () => {
  it("derives required SDK methods from the canonical IAM OpenAPI operation contracts", () => {
    const appOperationIds = Object.values(SDKWORK_IAM_OPERATION_IDS)
      .filter((operation) => operation.path.startsWith("/app/v3/api"))
      .map((operation) => operation.operationId)
      .sort();
    const backendOperationIds = Object.values(SDKWORK_IAM_OPERATION_IDS)
      .filter((operation) => operation.path.startsWith("/backend/v3/api"))
      .map((operation) => operation.operationId)
      .sort();

    expect([...SDKWORK_IAM_APP_SDK_REQUIRED_METHODS].sort()).toEqual(
      Object.values(SDKWORK_IAM_OPERATION_IDS)
        .filter((operation) => operation.path.startsWith("/app/v3/api"))
        .map((operation) => `${operation.tag}.${operation.operationId}`)
        .sort(),
    );
    expect([...SDKWORK_IAM_BACKEND_SDK_REQUIRED_METHODS].sort()).toEqual(
      Object.values(SDKWORK_IAM_OPERATION_IDS)
        .filter((operation) => operation.path.startsWith("/backend/v3/api"))
        .map((operation) => `${operation.tag}.${operation.operationId}`)
        .sort(),
    );
    expect(SDKWORK_IAM_BACKEND_SDK_REQUIRED_METHODS).not.toContain("iam.users.current.retrieve");
  });

  it("accepts generated app SDK clients with resource-oriented auth and iam namespaces", () => {
    const appClient = {
      auth: {
        oauthAuthorizationUrls: {
          retrieve: vi.fn(),
        },
        oauthSessions: {
          create: vi.fn(),
        },
        passwordResetRequests: {
          create: vi.fn(),
        },
        passwordResets: {
          create: vi.fn(),
        },
        registrations: {
          create: vi.fn(),
        },
        sessions: {
          create: vi.fn(),
          current: {
            delete: vi.fn(),
            retrieve: vi.fn(),
            update: vi.fn(),
          },
          refresh: vi.fn(),
        },
        verificationCodes: {
          create: vi.fn(),
          verify: vi.fn(),
        },
      },
      openPlatform: {
        qrAuth: {
          sessions: {
            create: vi.fn(),
            retrieve: vi.fn(),
            passwords: {
              create: vi.fn(),
            },
            scans: {
              create: vi.fn(),
            },
          },
        },
      },
      system: {
        iam: {
          runtime: {
            retrieve: vi.fn(),
          },
          verificationPolicy: {
            retrieve: vi.fn(),
          },
        },
      },
      iam: {
        users: {
          current: {
            retrieve: vi.fn(),
          },
        },
      },
    };

    expect(() => assertIamAppSdkClient(appClient)).not.toThrow();
    expect(getIamSdkSurface(appClient)).toContain("auth.sessions.create");
    expect(getIamSdkSurface(appClient)).not.toContain("auth.loginQrCodeCallbacks.create");
    expect(getIamSdkSurface(appClient)).not.toContain("auth.loginQrCodes.confirm");
    expect(getIamSdkSurface(appClient)).not.toContain("auth.loginQrCodes.create");
    expect(getIamSdkSurface(appClient)).not.toContain("auth.loginQrCodes.retrieve");
    expect(getIamSdkSurface(appClient)).toContain("openPlatform.qrAuth.sessions.create");
    expect(getIamSdkSurface(appClient)).toContain("openPlatform.qrAuth.sessions.retrieve");
    expect(getIamSdkSurface(appClient)).toContain("openPlatform.qrAuth.sessions.scans.create");
    expect(getIamSdkSurface(appClient)).toContain("openPlatform.qrAuth.sessions.passwords.create");
    expect(getIamSdkSurface(appClient)).toContain("auth.registrations.create");
    expect(getIamSdkSurface(appClient)).toContain("auth.sessions.current.retrieve");
    expect(getIamSdkSurface(appClient)).not.toContain("auth.verificationPolicy.retrieve");
    expect(getIamSdkSurface(appClient)).toContain("system.iam.runtime.retrieve");
    expect(getIamSdkSurface(appClient)).toContain("system.iam.verificationPolicy.retrieve");
    expect(getIamSdkSurface(appClient)).toContain("auth.verificationCodes.create");
    expect(getIamSdkSurface(appClient)).toContain("auth.passwordResetRequests.create");
    expect(getIamSdkSurface(appClient)).toContain("auth.oauthAuthorizationUrls.retrieve");
    expect(getIamSdkSurface(appClient)).toContain("iam.users.current.retrieve");
  });

  it("accepts generated app SDK clients whose operation methods live on class prototypes", () => {
    class OperationResource {
      async confirm() {
        return {};
      }

      async create() {
        return {};
      }

      async retrieve() {
        return {};
      }

      async update() {
        return {};
      }

      async delete() {
        return {};
      }

      async refresh() {
        return {};
      }

      async verify() {
        return {};
      }
    }

    const appClient = {
      auth: {
        oauthAuthorizationUrls: new OperationResource(),
        oauthSessions: new OperationResource(),
        passwordResetRequests: new OperationResource(),
        passwordResets: new OperationResource(),
        registrations: new OperationResource(),
        sessions: {
          create: new OperationResource().create,
          current: new OperationResource(),
          refresh: new OperationResource().refresh,
        },
        verificationCodes: new OperationResource(),
      },
      system: {
        iam: {
          runtime: new OperationResource(),
          verificationPolicy: new OperationResource(),
        },
      },
      iam: {
        users: {
          current: new OperationResource(),
        },
      },
    };

    expect(() => assertIamAppSdkClient(appClient)).not.toThrow();
    expect(getIamSdkSurface(appClient)).toContain("auth.sessions.current.retrieve");
    expect(getIamSdkSurface(appClient)).toContain("system.iam.runtime.retrieve");
    expect(getIamSdkSurface(appClient)).toContain("system.iam.verificationPolicy.retrieve");
    expect(getIamSdkSurface(appClient)).toContain("iam.users.current.retrieve");
  });

  it("rejects retired IAM QR login resources because platform qrAuth owns QR login", () => {
    const appClient = {
      auth: {
        loginQrCodeCallbacks: {
          create: vi.fn(),
        },
        loginQrCodes: {
          confirm: vi.fn(),
          create: vi.fn(),
          retrieve: vi.fn(),
        },
        oauthAuthorizationUrls: {
          retrieve: vi.fn(),
        },
        oauthSessions: {
          create: vi.fn(),
        },
        passwordResetRequests: {
          create: vi.fn(),
        },
        passwordResets: {
          create: vi.fn(),
        },
        registrations: {
          create: vi.fn(),
        },
        sessions: {
          create: vi.fn(),
          current: {
            delete: vi.fn(),
            retrieve: vi.fn(),
            update: vi.fn(),
          },
          refresh: vi.fn(),
        },
        verificationCodes: {
          create: vi.fn(),
          verify: vi.fn(),
        },
      },
      system: {
        iam: {
          runtime: {
            retrieve: vi.fn(),
          },
          verificationPolicy: {
            retrieve: vi.fn(),
          },
        },
      },
      iam: {
        users: {
          current: {
            retrieve: vi.fn(),
          },
        },
      },
    };

    expect(() => assertIamAppSdkClient(appClient)).toThrow(/retired IAM QR login resources/i);
  });

  it("rejects legacy flat app SDK methods that would produce client.auth.createSession", () => {
    const legacyAppClient = {
      auth: {
        createSession: vi.fn(),
      },
    };

    expect(() => assertIamAppSdkClient(legacyAppClient)).toThrow(/auth\.sessions\.create/);
  });

  it("rejects partial open platform QR login resources before runtime integration", () => {
    const partialQrAppClient = {
      auth: {
        oauthAuthorizationUrls: {
          retrieve: vi.fn(),
        },
        oauthSessions: {
          create: vi.fn(),
        },
        passwordResetRequests: {
          create: vi.fn(),
        },
        passwordResets: {
          create: vi.fn(),
        },
        registrations: {
          create: vi.fn(),
        },
        sessions: {
          create: vi.fn(),
          current: {
            delete: vi.fn(),
            retrieve: vi.fn(),
            update: vi.fn(),
          },
          refresh: vi.fn(),
        },
        verificationCodes: {
          create: vi.fn(),
          verify: vi.fn(),
        },
      },
      openPlatform: {
        qrAuth: {
          sessions: {
            create: vi.fn(),
          },
        },
      },
      system: {
        iam: {
          runtime: {
            retrieve: vi.fn(),
          },
          verificationPolicy: {
            retrieve: vi.fn(),
          },
        },
      },
      iam: {
        users: {
          current: {
            retrieve: vi.fn(),
          },
        },
      },
    };

    expect(() => assertIamAppSdkClient(partialQrAppClient)).toThrow(
      /openPlatform\.qrAuth\.sessions\.passwords\.create/,
    );
  });

  it("rejects incomplete generated app SDK clients before application integration", () => {
    const incompleteAppClient = {
      auth: {
        sessions: {
          create: vi.fn(),
        },
      },
      iam: {
        users: {
          current: {
            retrieve: vi.fn(),
          },
        },
      },
    };

    expect(() => assertIamAppSdkClient(incompleteAppClient)).toThrow(
      /auth\.sessions\.current\.retrieve/,
    );
  });

  it("rejects backend SDK clients that expose login or session creation", () => {
    const invalidBackendClient = {
      auth: {
        sessions: {
          create: vi.fn(),
        },
      },
      iam: {
        users: {
          list: vi.fn(),
        },
      },
    };

    expect(() => assertIamBackendSdkClient(invalidBackendClient)).toThrow(/backend.*auth namespace/i);
  });

  it("rejects backend SDK clients with any auth namespace to keep login only in app API", () => {
    const invalidBackendClient = {
      auth: {
        verificationCodes: {
          create: vi.fn(),
        },
      },
      iam: {
        users: {
          list: vi.fn(),
        },
      },
    };

    expect(() => assertIamBackendSdkClient(invalidBackendClient)).toThrow(/backend.*auth namespace/i);
  });

  it("rejects backend SDK clients that expose app-only IAM self-service resources", () => {
    const invalidBackendClient = {
      iam: {
        apiKeys: { list: vi.fn(), revoke: vi.fn() },
        auditEvents: { list: vi.fn() },
        organizations: {
          list: vi.fn(),
          members: { create: vi.fn(), list: vi.fn() },
        },
        permissions: { list: vi.fn() },
        policies: { list: vi.fn() },
        roles: {
          list: vi.fn(),
          permissions: { create: vi.fn(), delete: vi.fn(), list: vi.fn() },
        },
        securityEvents: { list: vi.fn() },
        tenants: {
          list: vi.fn(),
          members: { list: vi.fn() },
        },
        users: {
          current: {
            retrieve: vi.fn(),
          },
          list: vi.fn(),
          retrieve: vi.fn(),
          roles: { create: vi.fn(), delete: vi.fn(), list: vi.fn() },
        },
      },
    };

    expect(() => assertIamBackendSdkClient(invalidBackendClient)).toThrow(
      /app-only IAM resource.*iam\.users\.current\.retrieve/i,
    );
  });

  it("accepts backend SDK clients that only manage IAM resources", () => {
    const backendClient = {
      iam: {
        apiKeys: {
          list: vi.fn(),
          revoke: vi.fn(),
        },
        auditEvents: {
          list: vi.fn(),
        },
        organizations: {
          create: vi.fn(),
          delete: vi.fn(),
          list: vi.fn(),
          retrieve: vi.fn(),
          tree: {
            retrieve: vi.fn(),
          },
          update: vi.fn(),
          members: {
            create: vi.fn(),
            delete: vi.fn(),
            list: vi.fn(),
            update: vi.fn(),
          },
        },
        permissions: {
          create: vi.fn(),
          delete: vi.fn(),
          list: vi.fn(),
          retrieve: vi.fn(),
          update: vi.fn(),
        },
        policies: {
          create: vi.fn(),
          delete: vi.fn(),
          list: vi.fn(),
          retrieve: vi.fn(),
          update: vi.fn(),
        },
        roles: {
          create: vi.fn(),
          delete: vi.fn(),
          list: vi.fn(),
          retrieve: vi.fn(),
          update: vi.fn(),
          permissions: {
            create: vi.fn(),
            delete: vi.fn(),
            list: vi.fn(),
          },
        },
        securityEvents: {
          list: vi.fn(),
        },
        tenants: {
          create: vi.fn(),
          delete: vi.fn(),
          list: vi.fn(),
          retrieve: vi.fn(),
          update: vi.fn(),
          members: {
            create: vi.fn(),
            delete: vi.fn(),
            list: vi.fn(),
            update: vi.fn(),
          },
        },
        users: {
          create: vi.fn(),
          delete: vi.fn(),
          list: vi.fn(),
          retrieve: vi.fn(),
          update: vi.fn(),
          roles: {
            create: vi.fn(),
            delete: vi.fn(),
            list: vi.fn(),
          },
        },
      },
    };

    expect(() => assertIamBackendSdkClient(backendClient)).not.toThrow();
    expect(getIamSdkSurface(backendClient)).toContain("iam.organizations.tree.retrieve");
    expect(getIamSdkSurface(backendClient)).toContain("iam.roles.permissions.delete");
    expect(getIamSdkSurface(backendClient)).toContain("iam.tenants.members.update");
  });

  it("rejects incomplete backend SDK clients before administrative IAM integration", () => {
    const incompleteBackendClient = {
      iam: {
        users: {
          list: vi.fn(),
        },
      },
    };

    expect(() => assertIamBackendSdkClient(incompleteBackendClient)).toThrow(
      /iam\.apiKeys\.list/,
    );
  });
});
