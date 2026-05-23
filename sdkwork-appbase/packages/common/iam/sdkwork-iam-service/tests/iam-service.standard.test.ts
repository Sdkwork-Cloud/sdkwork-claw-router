import { describe, expect, it, vi } from "vitest";

import {
  SDKWORK_IAM_APP_SDK_REQUIRED_METHODS,
  SDKWORK_IAM_BACKEND_SDK_REQUIRED_METHODS,
  getIamSdkSurface,
} from "@sdkwork/iam-sdk-ports";

import { createSdkworkIamService } from "../src/index";

describe("SDKWork IAM service", () => {
  it("exposes the same resource facade surface as the canonical app and backend SDK ports", () => {
    const service = createSdkworkIamService({
      appClient: {},
      backendClient: {},
    });

    expect(getIamSdkSurface(service)).toEqual(
      [...SDKWORK_IAM_APP_SDK_REQUIRED_METHODS, ...SDKWORK_IAM_BACKEND_SDK_REQUIRED_METHODS].sort(),
    );
  });

  it("creates app sessions through app SDK auth.sessions.create and persists dual tokens", async () => {
    const persistSession = vi.fn();
    const create = vi.fn().mockResolvedValue({
      data: {
        accessToken: "access-token",
        authToken: "auth-token",
        context: {
          appId: "sdkwork-router",
          authLevel: "password",
          dataScope: ["tenant:t1"],
          deploymentMode: "saas",
          environment: "dev",
          permissionScope: ["iam.users.read"],
          sessionId: "s1",
          tenantId: "t1",
          userId: "u1",
        },
        expiresAt: "2026-05-11T00:00:00.000Z",
        refreshToken: "refresh-token",
        sessionId: "s1",
        user: {
          displayName: "Alice",
          id: "u1",
          username: "alice",
        },
      },
    });
    const service = createSdkworkIamService({
      appClient: {
        auth: {
          sessions: {
            create,
          },
        },
      },
      persistSession,
    });

    const session = await service.auth.sessions.create({
      password: "secret",
      username: "alice",
    });

    expect(create).toHaveBeenCalledWith({
      password: "secret",
      username: "alice",
    });
    expect(session).toMatchObject({
      accessToken: "access-token",
      authToken: "auth-token",
      refreshToken: "refresh-token",
      sessionId: "s1",
      user: {
        displayName: "Alice",
        id: "u1",
      },
    });
    expect(persistSession).toHaveBeenCalledWith({
      accessToken: "access-token",
      authToken: "auth-token",
      refreshToken: "refresh-token",
    });
  });

  it("always resolves session APIs from app client even when backend client is injected", async () => {
    const appSessionCreate = vi.fn().mockResolvedValue({
      data: {
        accessToken: "app-access",
        authToken: "app-auth",
        context: {
          appId: "app",
          authLevel: "password",
          dataScope: [],
          deploymentMode: "local",
          environment: "test",
          permissionScope: [],
          sessionId: "s1",
          tenantId: "t1",
          userId: "u1",
        },
      },
    });
    const backendSessionCreate = vi.fn();

    const service = createSdkworkIamService({
      appClient: {
        auth: {
          sessions: {
            create: appSessionCreate,
          },
        },
      },
      backendClient: {
        auth: {
          sessions: {
            create: backendSessionCreate,
          },
        },
        iam: {},
      },
    });

    await service.auth.sessions.create({ password: "secret", username: "alice" });

    expect(appSessionCreate).toHaveBeenCalledTimes(1);
    expect(backendSessionCreate).not.toHaveBeenCalled();
  });

  it("routes administrative IAM resources to backend SDK and current user self-service to app SDK", async () => {
    const backendUsersList = vi.fn().mockResolvedValue({ data: [{ id: "u1" }] });
    const appCurrentUserRetrieve = vi.fn().mockResolvedValue({
      data: {
        displayName: "Alice",
        id: "u1",
      },
    });
    const service = createSdkworkIamService({
      appClient: {
        iam: {
          users: {
            current: {
              retrieve: appCurrentUserRetrieve,
            },
          },
        },
      },
      backendClient: {
        iam: {
          users: {
            list: backendUsersList,
          },
        },
      },
    });

    await expect(service.iam.users.list()).resolves.toEqual([{ id: "u1" }]);
    await expect(service.iam.users.current.retrieve()).resolves.toEqual({
      displayName: "Alice",
      id: "u1",
    });

    expect(backendUsersList).toHaveBeenCalledTimes(1);
    expect(appCurrentUserRetrieve).toHaveBeenCalledTimes(1);
  });

  it("does not fall back administrative IAM resources to app SDK self-service clients", async () => {
    const appUsersList = vi.fn().mockResolvedValue({ data: [{ id: "app-user" }] });
    const service = createSdkworkIamService({
      appClient: ({
        iam: {
          users: {
            current: {
              retrieve: vi.fn(),
            },
            list: appUsersList,
          },
        },
      }) as unknown as Parameters<typeof createSdkworkIamService>[0]["appClient"],
    });

    await expect(service.iam.users.list()).rejects.toThrow("Missing SDKWork IAM SDK resource: iam.users.list");
    expect(appUsersList).not.toHaveBeenCalled();
  });

  it("covers every generated IAM resource port through the common service facade", async () => {
    const backendClient = {
      iam: {
        apiKeys: {
          list: vi.fn().mockResolvedValue({ data: ["api-key"] }),
          revoke: vi.fn().mockResolvedValue({ data: "api-key-revoked" }),
        },
        auditEvents: {
          list: vi.fn().mockResolvedValue({ data: ["audit-event"] }),
        },
        organizations: {
          create: vi.fn().mockResolvedValue({ data: "organization-created" }),
          delete: vi.fn().mockResolvedValue({ data: "organization-deleted" }),
          list: vi.fn().mockResolvedValue({ data: ["organization"] }),
          retrieve: vi.fn().mockResolvedValue({ data: "organization-retrieved" }),
          tree: {
            retrieve: vi.fn().mockResolvedValue({ data: ["organization-tree"] }),
          },
          update: vi.fn().mockResolvedValue({ data: "organization-updated" }),
          members: {
            create: vi.fn().mockResolvedValue({ data: "organization-member-created" }),
            delete: vi.fn().mockResolvedValue({ data: "organization-member-deleted" }),
            list: vi.fn().mockResolvedValue({ data: ["organization-member"] }),
            update: vi.fn().mockResolvedValue({ data: "organization-member-updated" }),
          },
        },
        permissions: {
          create: vi.fn().mockResolvedValue({ data: "permission-created" }),
          delete: vi.fn().mockResolvedValue({ data: "permission-deleted" }),
          list: vi.fn().mockResolvedValue({ data: ["permission"] }),
          retrieve: vi.fn().mockResolvedValue({ data: "permission-retrieved" }),
          update: vi.fn().mockResolvedValue({ data: "permission-updated" }),
        },
        policies: {
          create: vi.fn().mockResolvedValue({ data: "policy-created" }),
          delete: vi.fn().mockResolvedValue({ data: "policy-deleted" }),
          list: vi.fn().mockResolvedValue({ data: ["policy"] }),
          retrieve: vi.fn().mockResolvedValue({ data: "policy-retrieved" }),
          update: vi.fn().mockResolvedValue({ data: "policy-updated" }),
        },
        roles: {
          create: vi.fn().mockResolvedValue({ data: "role-created" }),
          delete: vi.fn().mockResolvedValue({ data: "role-deleted" }),
          list: vi.fn().mockResolvedValue({ data: ["role"] }),
          retrieve: vi.fn().mockResolvedValue({ data: "role-retrieved" }),
          update: vi.fn().mockResolvedValue({ data: "role-updated" }),
          permissions: {
            create: vi.fn().mockResolvedValue({ data: "role-permission-created" }),
            delete: vi.fn().mockResolvedValue({ data: "role-permission-deleted" }),
            list: vi.fn().mockResolvedValue({ data: ["role-permission"] }),
          },
        },
        securityEvents: {
          list: vi.fn().mockResolvedValue({ data: ["security-event"] }),
        },
        tenants: {
          create: vi.fn().mockResolvedValue({ data: "tenant-created" }),
          delete: vi.fn().mockResolvedValue({ data: "tenant-deleted" }),
          list: vi.fn().mockResolvedValue({ data: ["tenant"] }),
          retrieve: vi.fn().mockResolvedValue({ data: "tenant-retrieved" }),
          update: vi.fn().mockResolvedValue({ data: "tenant-updated" }),
          members: {
            create: vi.fn().mockResolvedValue({ data: "tenant-member-created" }),
            delete: vi.fn().mockResolvedValue({ data: "tenant-member-deleted" }),
            list: vi.fn().mockResolvedValue({ data: ["tenant-member"] }),
            update: vi.fn().mockResolvedValue({ data: "tenant-member-updated" }),
          },
        },
        users: {
          create: vi.fn().mockResolvedValue({ data: "user-created" }),
          delete: vi.fn().mockResolvedValue({ data: "user-deleted" }),
          list: vi.fn().mockResolvedValue({ data: ["user"] }),
          retrieve: vi.fn().mockResolvedValue({ data: { displayName: "Bob", id: "u1" } }),
          update: vi.fn().mockResolvedValue({ data: "user-updated" }),
          roles: {
            create: vi.fn().mockResolvedValue({ data: "user-role-created" }),
            delete: vi.fn().mockResolvedValue({ data: "user-role-deleted" }),
            list: vi.fn().mockResolvedValue({ data: ["user-role"] }),
          },
        },
      },
    };
    const service = createSdkworkIamService({
      appClient: {
        iam: {
          users: {
            current: {
              retrieve: vi.fn().mockResolvedValue({ data: { displayName: "Alice", id: "current-user" } }),
            },
          },
        },
      },
      backendClient,
    });

    await expect(service.iam.apiKeys.list({ page: 1 })).resolves.toEqual(["api-key"]);
    await expect(service.iam.apiKeys.revoke("ak1")).resolves.toBe("api-key-revoked");
    await expect(service.iam.auditEvents.list({ tenantId: "t1" })).resolves.toEqual(["audit-event"]);
    await expect(service.iam.organizations.create({ name: "Org" })).resolves.toBe("organization-created");
    await expect(service.iam.organizations.delete("o1")).resolves.toBe("organization-deleted");
    await expect(service.iam.organizations.list()).resolves.toEqual(["organization"]);
    await expect(service.iam.organizations.retrieve("o1")).resolves.toBe("organization-retrieved");
    await expect(service.iam.organizations.tree.retrieve({ q: "Org" })).resolves.toEqual(["organization-tree"]);
    await expect(service.iam.organizations.update("o1", { name: "Updated Org" })).resolves.toBe("organization-updated");
    await expect(service.iam.organizations.members.create("o1", { userId: "u1" })).resolves.toBe("organization-member-created");
    await expect(service.iam.organizations.members.delete("o1", "u1")).resolves.toBe("organization-member-deleted");
    await expect(service.iam.organizations.members.list("o1")).resolves.toEqual(["organization-member"]);
    await expect(service.iam.organizations.members.update("o1", "u1", { roleCode: "owner" })).resolves.toBe("organization-member-updated");
    await expect(service.iam.permissions.create({ code: "iam.users.read" })).resolves.toBe("permission-created");
    await expect(service.iam.permissions.delete("p1")).resolves.toBe("permission-deleted");
    await expect(service.iam.permissions.list()).resolves.toEqual(["permission"]);
    await expect(service.iam.permissions.retrieve("p1")).resolves.toBe("permission-retrieved");
    await expect(service.iam.permissions.update("p1", { name: "Read users" })).resolves.toBe("permission-updated");
    await expect(service.iam.policies.create({ code: "policy" })).resolves.toBe("policy-created");
    await expect(service.iam.policies.delete("po1")).resolves.toBe("policy-deleted");
    await expect(service.iam.policies.list()).resolves.toEqual(["policy"]);
    await expect(service.iam.policies.retrieve("po1")).resolves.toBe("policy-retrieved");
    await expect(service.iam.policies.update("po1", { name: "Policy" })).resolves.toBe("policy-updated");
    await expect(service.iam.roles.create({ code: "admin" })).resolves.toBe("role-created");
    await expect(service.iam.roles.delete("r1")).resolves.toBe("role-deleted");
    await expect(service.iam.roles.list()).resolves.toEqual(["role"]);
    await expect(service.iam.roles.retrieve("r1")).resolves.toBe("role-retrieved");
    await expect(service.iam.roles.update("r1", { name: "Admin" })).resolves.toBe("role-updated");
    await expect(service.iam.roles.permissions.create("r1", "p1")).resolves.toBe("role-permission-created");
    await expect(service.iam.roles.permissions.delete("r1", "p1")).resolves.toBe("role-permission-deleted");
    await expect(service.iam.roles.permissions.list("r1")).resolves.toEqual(["role-permission"]);
    await expect(service.iam.securityEvents.list()).resolves.toEqual(["security-event"]);
    await expect(service.iam.tenants.create({ name: "Tenant" })).resolves.toBe("tenant-created");
    await expect(service.iam.tenants.delete("t1")).resolves.toBe("tenant-deleted");
    await expect(service.iam.tenants.list()).resolves.toEqual(["tenant"]);
    await expect(service.iam.tenants.retrieve("t1")).resolves.toBe("tenant-retrieved");
    await expect(service.iam.tenants.update("t1", { name: "Updated Tenant" })).resolves.toBe("tenant-updated");
    await expect(service.iam.tenants.members.create("t1", { userId: "u1" })).resolves.toBe("tenant-member-created");
    await expect(service.iam.tenants.members.delete("t1", "u1")).resolves.toBe("tenant-member-deleted");
    await expect(service.iam.tenants.members.list("t1")).resolves.toEqual(["tenant-member"]);
    await expect(service.iam.tenants.members.update("t1", "u1", { status: "active" })).resolves.toBe("tenant-member-updated");
    await expect(service.iam.users.current.retrieve()).resolves.toEqual({
      displayName: "Alice",
      id: "current-user",
    });
    await expect(service.iam.users.create({ username: "bob" })).resolves.toBe("user-created");
    await expect(service.iam.users.delete("u1")).resolves.toBe("user-deleted");
    await expect(service.iam.users.list()).resolves.toEqual(["user"]);
    await expect(service.iam.users.retrieve("u1")).resolves.toEqual({
      displayName: "Bob",
      id: "u1",
    });
    await expect(service.iam.users.update("u1", { displayName: "Bob" })).resolves.toBe("user-updated");
    await expect(service.iam.users.roles.create("u1", "r1")).resolves.toBe("user-role-created");
    await expect(service.iam.users.roles.delete("u1", "r1")).resolves.toBe("user-role-deleted");
    await expect(service.iam.users.roles.list("u1")).resolves.toEqual(["user-role"]);

    expect(backendClient.iam.organizations.create).toHaveBeenCalledWith({ name: "Org" });
    expect(backendClient.iam.organizations.delete).toHaveBeenCalledWith("o1");
    expect(backendClient.iam.organizations.retrieve).toHaveBeenCalledWith("o1");
    expect(backendClient.iam.organizations.tree.retrieve).toHaveBeenCalledWith({ q: "Org" });
    expect(backendClient.iam.organizations.update).toHaveBeenCalledWith("o1", { name: "Updated Org" });
    expect(backendClient.iam.organizations.members.delete).toHaveBeenCalledWith("o1", "u1");
    expect(backendClient.iam.organizations.members.update).toHaveBeenCalledWith("o1", "u1", { roleCode: "owner" });
    expect(backendClient.iam.permissions.update).toHaveBeenCalledWith("p1", { name: "Read users" });
    expect(backendClient.iam.roles.update).toHaveBeenCalledWith("r1", { name: "Admin" });
    expect(backendClient.iam.tenants.members.create).toHaveBeenCalledWith("t1", { userId: "u1" });
    expect(backendClient.iam.tenants.members.delete).toHaveBeenCalledWith("t1", "u1");
    expect(backendClient.iam.tenants.members.update).toHaveBeenCalledWith("t1", "u1", { status: "active" });
    expect(backendClient.iam.tenants.members.list).toHaveBeenCalledWith("t1", undefined);
    expect(backendClient.iam.users.create).toHaveBeenCalledWith({ username: "bob" });
    expect(backendClient.iam.users.delete).toHaveBeenCalledWith("u1");
    expect(backendClient.iam.users.retrieve).toHaveBeenCalledWith("u1");
    expect(backendClient.iam.users.update).toHaveBeenCalledWith("u1", { displayName: "Bob" });
    expect(backendClient.iam.users.roles.create).toHaveBeenCalledWith("u1", "r1");
  });

  it("covers every generated app auth resource through the common service facade", async () => {
    const appClient = {
      auth: {
        oauthAuthorizationUrls: {
          retrieve: vi.fn().mockResolvedValue({ data: { url: "https://auth.sdkwork.local/oauth" } }),
        },
        oauthSessions: {
          create: vi.fn().mockResolvedValue({
            data: {
              accessToken: "oauth-access",
              authToken: "oauth-auth",
            },
          }),
        },
        passwordResetRequests: {
          create: vi.fn().mockResolvedValue({ data: { requestId: "reset-request-1" } }),
        },
        passwordResets: {
          create: vi.fn().mockResolvedValue({ data: { reset: true } }),
        },
        registrations: {
          create: vi.fn().mockResolvedValue({
            data: {
              accessToken: "registered-access",
              authToken: "registered-auth",
              user: {
                displayName: "Registered User",
                id: "registered-user",
              },
            },
          }),
        },
        verificationPolicy: {
          retrieve: vi.fn().mockResolvedValue({
            data: {
              emailCodeLoginEnabled: true,
              emailRegisterVerificationRequired: true,
              phoneCodeLoginEnabled: false,
              phoneRegisterVerificationRequired: false,
            },
          }),
        },
        sessions: {
          create: vi.fn().mockResolvedValue({
            data: {
              accessToken: "session-access",
              authToken: "session-auth",
            },
          }),
          current: {
            delete: vi.fn().mockResolvedValue({ data: undefined }),
            retrieve: vi.fn().mockResolvedValue({
              data: {
                accessToken: "current-access",
                authToken: "current-auth",
              },
            }),
            update: vi.fn().mockResolvedValue({
              data: {
                accessToken: "updated-access",
                authToken: "updated-auth",
              },
            }),
          },
          refresh: vi.fn().mockResolvedValue({
            data: {
              accessToken: "refreshed-access",
              authToken: "refreshed-auth",
            },
          }),
        },
        verificationCodes: {
          create: vi.fn().mockResolvedValue({ data: { codeId: "code-1" } }),
          verify: vi.fn().mockResolvedValue({ data: { verified: true } }),
        },
      },
    };
    const service = createSdkworkIamService({ appClient });

    await expect(service.auth.oauthAuthorizationUrls.retrieve({ provider: "github" })).resolves.toEqual({
      url: "https://auth.sdkwork.local/oauth",
    });
    await expect(service.auth.oauthSessions.create({ code: "oauth-code", provider: "github" })).resolves.toMatchObject({
      accessToken: "oauth-access",
      authToken: "oauth-auth",
    });
    await expect(service.auth.passwordResetRequests.create({ email: "a@example.com" })).resolves.toEqual({
      requestId: "reset-request-1",
    });
    await expect(service.auth.passwordResets.create({ password: "new-secret", token: "token" })).resolves.toEqual({
      reset: true,
    });
    await expect(service.auth.registrations.create({
      password: "secret",
      username: "new-user",
      verificationCode: "123456",
    })).resolves.toMatchObject({
      accessToken: "registered-access",
      authToken: "registered-auth",
      user: {
        displayName: "Registered User",
        id: "registered-user",
      },
    });
    await expect(service.auth.verificationPolicy.retrieve()).resolves.toEqual({
      emailCodeLoginEnabled: true,
      emailRegisterVerificationRequired: true,
      phoneCodeLoginEnabled: false,
      phoneRegisterVerificationRequired: false,
    });
    await expect(service.auth.verificationCodes.create({ target: "a@example.com" })).resolves.toEqual({
      codeId: "code-1",
    });
    await expect(service.auth.verificationCodes.verify({ code: "123456", codeId: "code-1" })).resolves.toEqual({
      verified: true,
    });

    expect(appClient.auth.oauthAuthorizationUrls.retrieve).toHaveBeenCalledWith({ provider: "github" });
    expect(appClient.auth.oauthSessions.create).toHaveBeenCalledWith({ code: "oauth-code", provider: "github" });
    expect(appClient.auth.registrations.create).toHaveBeenCalledWith({
      password: "secret",
      username: "new-user",
      verificationCode: "123456",
    });
    expect(appClient.auth.verificationPolicy.retrieve).toHaveBeenCalledTimes(1);
    expect(appClient.auth.verificationCodes.verify).toHaveBeenCalledWith({ code: "123456", codeId: "code-1" });
  });

  it("keeps OAuth authorization URL service calls object-shaped while adapting positional generated SDK methods", async () => {
    const calls: unknown[][] = [];
    async function retrieve(
      provider: string,
      redirectUri: string,
      state?: string,
      scope?: string,
    ) {
      calls.push([provider, redirectUri, state, scope]);
      return {
        data: {
          url: "https://auth.sdkwork.local/oauth/github",
        },
      };
    }
    const service = createSdkworkIamService({
      appClient: {
        auth: {
          oauthAuthorizationUrls: {
            retrieve,
          },
        },
      },
    });

    await expect(service.auth.oauthAuthorizationUrls.retrieve({
      provider: "GITHUB",
      redirectUri: "https://app.sdkwork.local/oauth/callback",
      scope: "profile email",
      state: "state-1",
    })).resolves.toEqual({
      url: "https://auth.sdkwork.local/oauth/github",
    });

    expect(calls).toEqual([[
      "GITHUB",
      "https://app.sdkwork.local/oauth/callback",
      "state-1",
      "profile email",
    ]]);
  });

  it("calls generated SDK class resource methods with their owning resource as this", async () => {
    class GeneratedAuthSessionsResource {
      client = {
        post: vi.fn().mockResolvedValue({
          data: {
            accessToken: "bound-access",
            authToken: "bound-auth",
          },
        }),
      };

      async create(body: Record<string, unknown>) {
        return this.client.post("/auth/sessions", body);
      }
    }

    const sessions = new GeneratedAuthSessionsResource();
    const service = createSdkworkIamService({
      appClient: {
        auth: {
          sessions,
        },
      },
    });

    await expect(service.auth.sessions.create({
      password: "secret",
      username: "alice",
    })).resolves.toMatchObject({
      accessToken: "bound-access",
      authToken: "bound-auth",
    });
    expect(sessions.client.post).toHaveBeenCalledWith("/auth/sessions", {
      password: "secret",
      username: "alice",
    });
  });

  it("allows registration without verificationCode so backend policy decides whether it is required", async () => {
    const create = vi.fn().mockResolvedValue({
      data: {
        accessToken: "registered-access",
        authToken: "registered-auth",
      },
    });
    const service = createSdkworkIamService({
      appClient: {
        auth: {
          registrations: {
            create,
          },
        },
      },
    });

    await expect(service.auth.registrations.create({
      password: "secret",
      username: "new-user",
    })).resolves.toMatchObject({
      accessToken: "registered-access",
      authToken: "registered-auth",
    });
    expect(create).toHaveBeenCalledWith({
      password: "secret",
      username: "new-user",
    });
  });
});
