import { describe, expect, it, vi } from "vitest";

import { assertIamAppSdkClient, assertIamBackendSdkClient } from "@sdkwork/iam-sdk-ports";

import {
  createIamAppSdkAdapter,
  createIamBackendSdkAdapter,
  createIamSdkAdapters,
  unwrapIamSdkResponse,
} from "../src/index";

describe("SDKWork IAM generated SDK adapters", () => {
  it("unwraps standard response envelopes at the IAM app SDK adapter boundary", async () => {
    const generatedAppClient = {
      auth: {
        sessions: {
          create: vi.fn().mockResolvedValue({
            code: "2000",
            msg: "SUCCESS",
            data: {
              accessToken: "access",
              authToken: "auth",
            },
          }),
        },
      },
      openPlatform: {
        qrAuth: {
          sessions: {
            create: vi.fn().mockResolvedValue({
              code: 2000,
              data: {
                qrContent: {
                  content: "https://127.0.0.1:3900/auth/qr/session-1",
                  mode: "fallback_url",
                },
                sessionKey: "session-1",
                status: "pending",
              },
              msg: "SUCCESS",
            }),
          },
        },
      },
    };

    const appClient = createIamAppSdkAdapter(generatedAppClient);

    await expect(appClient.auth?.sessions?.create?.({
      password: "secret",
      username: "alice",
    })).resolves.toEqual({
      accessToken: "access",
      authToken: "auth",
    });
    await expect(appClient.openPlatform?.qrAuth?.sessions?.create?.({ purpose: "login" })).resolves.toEqual({
      qrContent: {
        content: "https://127.0.0.1:3900/auth/qr/session-1",
        mode: "fallback_url",
      },
      sessionKey: "session-1",
      status: "pending",
    });
  });

  it("adapts generated openPlatform QR path-parameter methods to standard IAM ports", async () => {
    const qrSession = (sessionKey: string, status: string) => ({
      id: `qr_auth_session_${sessionKey}`,
      sessionKey,
      purpose: "login",
      defaultAccountId: null,
      defaultEntryId: null,
      defaultProvider: null,
      defaultAccountType: null,
      qrContent: {
        content: `https://127.0.0.1:3900/auth/qr/${sessionKey}?session_key=${sessionKey}&purpose=login&scan_source=browser`,
        mode: "fallback_url",
      },
      fallbackUrl: `https://127.0.0.1:3900/auth/qr/${sessionKey}?session_key=${sessionKey}&purpose=login&scan_source=browser`,
      status,
      scannedAt: null,
      completedAt: null,
      expiresAt: "2099-01-01T00:00:00Z",
      createdAt: "2026-06-03T00:00:00Z",
      updatedAt: "2026-06-03T00:00:00Z",
    });
    const generatedAppClient = {
      openPlatform: {
        qrAuth: {
          sessions: {
            create: vi.fn().mockResolvedValue({
              code: "2000",
              msg: "SUCCESS",
              data: qrSession("qr-session-1", "pending"),
            }),
            retrieve: vi.fn().mockImplementation((pathParams: { sessionKey: string }) => Promise.resolve({
              code: "2000",
              msg: "SUCCESS",
              data: qrSession(pathParams.sessionKey, "pending"),
            })),
            scans: {
              create: vi.fn().mockImplementation((pathParams: { sessionKey: string }, body: Record<string, unknown>) => Promise.resolve({
                code: "2000",
                msg: "SUCCESS",
                data: {
                  ...qrSession(pathParams.sessionKey, "scanned"),
                  scannedAt: "2026-06-03T00:01:00Z",
                  scanSource: body.scanSource,
                },
              })),
            },
            passwords: {
              create: vi.fn().mockImplementation((pathParams: { sessionKey: string }, body: Record<string, unknown>) => Promise.resolve({
                code: "2000",
                msg: "SUCCESS",
                data: {
                  ...qrSession(pathParams.sessionKey, "completed"),
                  completedAt: "2026-06-03T00:02:00Z",
                  session: {
                    accessToken: "access-token",
                    authToken: "auth-token",
                    user: {
                      email: body.username,
                      id: "user-1",
                    },
                  },
                },
              })),
            },
          },
        },
      },
    };

    const appClient = createIamAppSdkAdapter(generatedAppClient);

    await expect(appClient.openPlatform?.qrAuth?.sessions?.create?.({ purpose: "login" })).resolves.toMatchObject({
      qrContent: { mode: "fallback_url" },
      sessionKey: "qr-session-1",
      status: "pending",
    });
    await expect(appClient.openPlatform?.qrAuth?.sessions?.retrieve?.("qr-session-1")).resolves.toMatchObject({
      sessionKey: "qr-session-1",
      status: "pending",
    });
    await expect(appClient.openPlatform?.qrAuth?.sessions?.scans?.create?.("qr-session-1", {
      scanSource: "browser",
    })).resolves.toMatchObject({
      sessionKey: "qr-session-1",
      status: "scanned",
    });
    await expect(appClient.openPlatform?.qrAuth?.sessions?.passwords?.create?.("qr-session-1", {
      password: "secret",
      username: "alice@example.com",
    })).resolves.toMatchObject({
      session: {
        accessToken: "access-token",
        authToken: "auth-token",
      },
      sessionKey: "qr-session-1",
      status: "completed",
    });

    expect(generatedAppClient.openPlatform.qrAuth.sessions.retrieve).toHaveBeenCalledWith({ sessionKey: "qr-session-1" });
    expect(generatedAppClient.openPlatform.qrAuth.sessions.scans.create).toHaveBeenCalledWith({ sessionKey: "qr-session-1" }, {
      scanSource: "browser",
    });
    expect(generatedAppClient.openPlatform.qrAuth.sessions.passwords.create).toHaveBeenCalledWith({ sessionKey: "qr-session-1" }, {
      password: "secret",
      username: "alice@example.com",
    });
  });

  it("adapts string path-parameter openPlatform QR methods from claw-router style generated SDKs", async () => {
    const qrSession = (sessionKey: string, status: string) => ({
      id: `qr_auth_session_${sessionKey}`,
      sessionKey,
      purpose: "login",
      defaultAccountId: null,
      defaultEntryId: null,
      defaultProvider: null,
      defaultAccountType: null,
      qrContent: {
        content: `https://127.0.0.1:3900/auth/qr/${sessionKey}?session_key=${sessionKey}&purpose=login&scan_source=browser`,
        mode: "fallback_url",
      },
      fallbackUrl: `https://127.0.0.1:3900/auth/qr/${sessionKey}?session_key=${sessionKey}&purpose=login&scan_source=browser`,
      status,
      scannedAt: null,
      completedAt: null,
      expiresAt: "2099-01-01T00:00:00Z",
      createdAt: "2026-06-03T00:00:00Z",
      updatedAt: "2026-06-03T00:00:00Z",
    });
    const generatedAppClient = {
      openPlatform: {
        qrAuth: {
          sessions: {
            retrieve: vi.fn().mockImplementation((sessionKey: string) => Promise.resolve({
              code: "2000",
              msg: "SUCCESS",
              data: qrSession(sessionKey, "pending"),
            })),
            scans: {
              create: vi.fn().mockImplementation((sessionKey: string, body: Record<string, unknown>) => Promise.resolve({
                code: "2000",
                msg: "SUCCESS",
                data: {
                  ...qrSession(sessionKey, "scanned"),
                  scannedAt: "2026-06-03T00:01:00Z",
                  scanSource: body.scanSource,
                },
              })),
            },
            passwords: {
              create: vi.fn().mockImplementation((sessionKey: string, body: Record<string, unknown>) => Promise.resolve({
                code: "2000",
                msg: "SUCCESS",
                data: {
                  ...qrSession(sessionKey, "completed"),
                  completedAt: "2026-06-03T00:02:00Z",
                  session: {
                    accessToken: "access-token",
                    authToken: "auth-token",
                    user: {
                      email: body.username,
                      id: "user-1",
                    },
                  },
                },
              })),
            },
          },
        },
      },
    };

    const appClient = createIamAppSdkAdapter(generatedAppClient);

    await expect(appClient.openPlatform?.qrAuth?.sessions?.retrieve?.("qr-session-1")).resolves.toMatchObject({
      sessionKey: "qr-session-1",
      status: "pending",
    });
    await expect(appClient.openPlatform?.qrAuth?.sessions?.scans?.create?.("qr-session-1", {
      scanSource: "browser",
    })).resolves.toMatchObject({
      sessionKey: "qr-session-1",
      status: "scanned",
    });
    await expect(appClient.openPlatform?.qrAuth?.sessions?.passwords?.create?.("qr-session-1", {
      password: "secret",
      username: "alice@example.com",
    })).resolves.toMatchObject({
      session: {
        accessToken: "access-token",
        authToken: "auth-token",
      },
      sessionKey: "qr-session-1",
      status: "completed",
    });

    expect(generatedAppClient.openPlatform.qrAuth.sessions.retrieve).toHaveBeenCalledWith("qr-session-1");
    expect(generatedAppClient.openPlatform.qrAuth.sessions.scans.create).toHaveBeenCalledWith("qr-session-1", {
      scanSource: "browser",
    });
    expect(generatedAppClient.openPlatform.qrAuth.sessions.passwords.create).toHaveBeenCalledWith("qr-session-1", {
      password: "secret",
      username: "alice@example.com",
    });
  });

  it("preserves class method this-binding for generated app SDK IAM resources", async () => {
    const transport = {
      request: vi.fn().mockImplementation((operation: string, payload?: unknown) => Promise.resolve({
        code: "2000",
        msg: "SUCCESS",
        data: {
          operation,
          payload,
          sessionKey: operation.includes("qrAuth.sessions")
            ? (Array.isArray(payload) ? payload[0] : "qr-session-1")
            : undefined,
          status: operation.includes("passwords") ? "completed" : "pending",
        },
      })),
    };

    class SessionsApi {
      constructor(private readonly apiTransport: typeof transport) {}

      create(body: Record<string, unknown>) {
        return this.apiTransport.request("auth.sessions.create", body);
      }
    }

    class QrAuthSessionPasswordsApi {
      constructor(private readonly apiTransport: typeof transport) {}

      create(sessionKey: string, body: Record<string, unknown>) {
        return this.apiTransport.request("openPlatform.qrAuth.sessions.passwords.create", [sessionKey, body]);
      }
    }

    class QrAuthSessionsApi {
      readonly passwords: QrAuthSessionPasswordsApi;

      constructor(private readonly apiTransport: typeof transport) {
        this.passwords = new QrAuthSessionPasswordsApi(apiTransport);
      }

      create(body: Record<string, unknown>) {
        return this.apiTransport.request("openPlatform.qrAuth.sessions.create", body);
      }

      retrieve(sessionKey: string) {
        return this.apiTransport.request("openPlatform.qrAuth.sessions.retrieve", [sessionKey]);
      }
    }

    const generatedAppClient = {
      auth: {
        sessions: new SessionsApi(transport),
      },
      openPlatform: {
        qrAuth: {
          sessions: new QrAuthSessionsApi(transport),
        },
      },
    };

    const appClient = createIamAppSdkAdapter(generatedAppClient);

    await expect(appClient.auth?.sessions?.create?.({
      password: "secret",
      username: "alice",
    })).resolves.toMatchObject({
      operation: "auth.sessions.create",
    });
    await expect(appClient.openPlatform?.qrAuth?.sessions?.create?.({ purpose: "login" })).resolves.toMatchObject({
      operation: "openPlatform.qrAuth.sessions.create",
    });
    await expect(appClient.openPlatform?.qrAuth?.sessions?.retrieve?.("qr-session-1")).resolves.toMatchObject({
      operation: "openPlatform.qrAuth.sessions.retrieve",
      sessionKey: "qr-session-1",
    });
    await expect(appClient.openPlatform?.qrAuth?.sessions?.passwords?.create?.("qr-session-1", {
      password: "secret",
      username: "alice",
    })).resolves.toMatchObject({
      operation: "openPlatform.qrAuth.sessions.passwords.create",
      sessionKey: "qr-session-1",
      status: "completed",
    });
  });

  it("keeps raw DTOs and rejects non-success standard IAM envelopes", () => {
    expect(unwrapIamSdkResponse({ sessionKey: "session-1", status: "pending" })).toEqual({
      sessionKey: "session-1",
      status: "pending",
    });
    expect(unwrapIamSdkResponse({ code: "0", data: { ok: true } })).toEqual({ ok: true });
    expect(unwrapIamSdkResponse({ code: 200, data: ["a"] })).toEqual(["a"]);
    expect(() => unwrapIamSdkResponse({
      code: "5000",
      data: null,
      msg: "QR session unavailable",
    }, "QR auth failed")).toThrow("QR session unavailable");
  });

  it("adapts the current generated app SDK auth and system IAM surfaces into standard IAM ports", async () => {
    const generatedAppClient = {
      auth: {
        createSendSmsCode: vi.fn().mockResolvedValue({ data: true }),
        getOauthUrl: vi.fn().mockResolvedValue({ data: { url: "https://auth.example" } }),
        login: vi.fn().mockResolvedValue({ data: { accessToken: "access", authToken: "auth" } }),
        logout: vi.fn().mockResolvedValue({ data: undefined }),
        oauthLogin: vi.fn().mockResolvedValue({ data: { accessToken: "oauth-access", authToken: "oauth-auth" } }),
        refreshToken: vi.fn().mockResolvedValue({ data: { accessToken: "refresh-access", authToken: "refresh-auth" } }),
        register: vi.fn().mockResolvedValue({ data: { accessToken: "registered-access", authToken: "registered-auth" } }),
        requestPasswordResetChallenge: vi.fn().mockResolvedValue({ data: true }),
        resetPassword: vi.fn().mockResolvedValue({ data: true }),
        verifySmsCode: vi.fn().mockResolvedValue({ data: { verified: true } }),
      },
      system: {
        iam: {
          runtime: {
            retrieve: vi.fn().mockResolvedValue({
              data: {
                loginMethods: ["password", "emailCode"],
              },
            }),
          },
          verificationPolicy: {
            retrieve: vi.fn().mockResolvedValue({
              data: {
                emailCodeLoginEnabled: true,
                emailRegistrationVerificationRequired: true,
                phoneCodeLoginEnabled: false,
                phoneRegistrationVerificationRequired: false,
              },
            }),
          },
        },
      },
      user: {
        getUserProfile: vi.fn().mockResolvedValue({ data: { displayName: "Alice", id: "u1" } }),
        updateUserProfile: vi.fn().mockResolvedValue({ data: { displayName: "Alice Updated", id: "u1" } }),
      },
    };

    const appClient = createIamAppSdkAdapter(generatedAppClient);

    expect(() => assertIamAppSdkClient(appClient)).not.toThrow();
    await appClient.auth?.sessions?.create?.({ password: "secret", username: "alice" });
    await appClient.auth?.registrations?.create?.({ password: "secret", username: "alice", verificationCode: "123456" });
    await appClient.system?.iam?.runtime?.retrieve?.({ tenantCode: "default" });
    await appClient.system?.iam?.verificationPolicy?.retrieve?.();
    await appClient.auth?.verificationCodes?.create?.({ target: "a@example.com" });
    await appClient.iam?.users?.current?.retrieve?.();

    expect(generatedAppClient.auth.login).toHaveBeenCalledWith({ password: "secret", username: "alice" });
    expect(generatedAppClient.auth.register).toHaveBeenCalledWith({ password: "secret", username: "alice", verificationCode: "123456" });
    expect(generatedAppClient.system.iam.runtime.retrieve).toHaveBeenCalledWith({ tenantCode: "default" });
    expect(generatedAppClient.system.iam.verificationPolicy.retrieve).toHaveBeenCalledTimes(1);
    expect(generatedAppClient.auth.createSendSmsCode).toHaveBeenCalledWith({ target: "a@example.com" });
    expect(generatedAppClient.user.getUserProfile).toHaveBeenCalled();
  });

  it("adapts the current generated backend SDK management surface into standard IAM ports", async () => {
    const legacyBackendClient = {
      apikey: {
        delete: vi.fn().mockResolvedValue({ data: true }),
        listAllEntities: vi.fn().mockResolvedValue({ data: [] }),
      },
      organization: {
        create: vi.fn().mockResolvedValue({ data: { id: "organization-1" } }),
        createListAllEntitiesOrganization: vi.fn().mockResolvedValue({ data: [] }),
        delete: vi.fn().mockResolvedValue({ data: true }),
        getById: vi.fn().mockResolvedValue({ data: { id: "organization-1" } }),
        getTree: vi.fn().mockResolvedValue({ data: [] }),
        update: vi.fn().mockResolvedValue({ data: { id: "organization-1" } }),
      },
      organizationMember: {
        create: vi.fn().mockResolvedValue({ data: { id: "member-1" } }),
        delete: vi.fn().mockResolvedValue({ data: true }),
        getMemberRoleIds: vi.fn().mockResolvedValue({ data: ["role-1"] }),
        listAllEntities: vi.fn().mockResolvedValue({ data: [] }),
        update: vi.fn().mockResolvedValue({ data: { id: "member-1" } }),
      },
      permission: {
        create: vi.fn().mockResolvedValue({ data: { id: "permission-1" } }),
        delete: vi.fn().mockResolvedValue({ data: true }),
        getById: vi.fn().mockResolvedValue({ data: { id: "permission-1" } }),
        listAllEntities: vi.fn().mockResolvedValue({ data: [] }),
        update: vi.fn().mockResolvedValue({ data: { id: "permission-1" } }),
      },
      policy: {
        create: vi.fn().mockResolvedValue({ data: { id: "policy-1" } }),
        delete: vi.fn().mockResolvedValue({ data: true }),
        getById: vi.fn().mockResolvedValue({ data: { id: "policy-1" } }),
        listAllEntities: vi.fn().mockResolvedValue({ data: [] }),
        update: vi.fn().mockResolvedValue({ data: { id: "policy-1" } }),
      },
      role: {
        create: vi.fn().mockResolvedValue({ data: { id: "role-1" } }),
        createListAllEntities: vi.fn().mockResolvedValue({ data: [] }),
        createListAllEntitiesRole: vi.fn().mockResolvedValue({ data: [] }),
        createPermission: vi.fn().mockResolvedValue({ data: { id: "rp-1" } }),
        delete: vi.fn().mockResolvedValue({ data: true }),
        deletePermission: vi.fn().mockResolvedValue({ data: true }),
        getById: vi.fn().mockResolvedValue({ data: { id: "role-1" } }),
        update: vi.fn().mockResolvedValue({ data: { id: "role-1" } }),
      },
      security: {
        listAllEntities: vi.fn().mockResolvedValue({ data: [] }),
      },
      tenant: {
        create: vi.fn().mockResolvedValue({ data: { id: "tenant-1" } }),
        createMember: vi.fn().mockResolvedValue({ data: { id: "tenant-member-1" } }),
        delete: vi.fn().mockResolvedValue({ data: true }),
        deleteMember: vi.fn().mockResolvedValue({ data: true }),
        getById: vi.fn().mockResolvedValue({ data: { id: "tenant-1" } }),
        listAllEntities: vi.fn().mockResolvedValue({ data: [] }),
        listAuditLogs: vi.fn().mockResolvedValue({ data: [] }),
        update: vi.fn().mockResolvedValue({ data: { id: "tenant-1" } }),
        updateMember: vi.fn().mockResolvedValue({ data: { id: "tenant-member-1" } }),
      },
      user: {
        create: vi.fn().mockResolvedValue({ data: { id: "user-1" } }),
        createListAllEntitiesUser: vi.fn().mockResolvedValue({ data: [] }),
        delete: vi.fn().mockResolvedValue({ data: true }),
        getById: vi.fn().mockResolvedValue({ data: { id: "u1" } }),
        update: vi.fn().mockResolvedValue({ data: { id: "u1" } }),
      },
    };

    const backendClient = createIamBackendSdkAdapter(legacyBackendClient);

    expect(() => assertIamBackendSdkClient(backendClient)).not.toThrow();
    await backendClient.iam?.tenants?.create?.({ name: "Tenant" });
    await backendClient.iam?.tenants?.delete?.("t1");
    await backendClient.iam?.tenants?.list?.();
    await backendClient.iam?.tenants?.retrieve?.("t1");
    await backendClient.iam?.tenants?.update?.("t1", { name: "Tenant 2" });
    await backendClient.iam?.tenants?.members?.create?.("t1", { userId: "u1" });
    await backendClient.iam?.tenants?.members?.delete?.("t1", "u1");
    await backendClient.iam?.tenants?.members?.list?.("t1");
    await backendClient.iam?.tenants?.members?.update?.("t1", "u1", { status: "active" });
    await backendClient.iam?.organizations?.create?.({ name: "Org" });
    await backendClient.iam?.organizations?.delete?.("o1");
    await backendClient.iam?.organizations?.list?.();
    await backendClient.iam?.organizations?.retrieve?.("o1");
    await backendClient.iam?.organizations?.tree?.retrieve?.({ q: "Org" });
    await backendClient.iam?.organizations?.update?.("o1", { name: "Org 2" });
    await backendClient.iam?.organizations?.members?.create?.("o1", { userId: "u1" });
    await backendClient.iam?.organizations?.members?.delete?.("o1", "u1");
    await backendClient.iam?.organizations?.members?.list?.("o1");
    await backendClient.iam?.organizations?.members?.update?.("o1", "u1", { roleCode: "owner" });
    await backendClient.iam?.users?.create?.({ username: "alice" });
    await backendClient.iam?.users?.delete?.("u1");
    await backendClient.iam?.users?.list?.();
    await backendClient.iam?.users?.retrieve?.("u1");
    await backendClient.iam?.users?.update?.("u1", { displayName: "Alice" });
    await backendClient.iam?.roles?.create?.({ code: "admin" });
    await backendClient.iam?.roles?.delete?.("r1");
    await backendClient.iam?.roles?.list?.();
    await backendClient.iam?.roles?.retrieve?.("r1");
    await backendClient.iam?.roles?.update?.("r1", { name: "Admin" });
    await backendClient.iam?.roles?.permissions?.create?.("r1", "p1");
    await backendClient.iam?.roles?.permissions?.delete?.("r1", "p1");
    await backendClient.iam?.roles?.permissions?.list?.("r1");
    await backendClient.iam?.permissions?.create?.({ code: "iam.users.read" });
    await backendClient.iam?.permissions?.delete?.("p1");
    await backendClient.iam?.permissions?.list?.();
    await backendClient.iam?.permissions?.retrieve?.("p1");
    await backendClient.iam?.permissions?.update?.("p1", { name: "Read users" });
    await backendClient.iam?.policies?.create?.({ code: "policy" });
    await backendClient.iam?.policies?.delete?.("po1");
    await backendClient.iam?.policies?.list?.();
    await backendClient.iam?.policies?.retrieve?.("po1");
    await backendClient.iam?.policies?.update?.("po1", { name: "Policy" });
    await backendClient.iam?.users?.roles?.list?.("u1");

    expect(legacyBackendClient.tenant.create).toHaveBeenCalledWith({ name: "Tenant" });
    expect(legacyBackendClient.tenant.delete).toHaveBeenCalledWith("t1");
    expect(legacyBackendClient.tenant.getById).toHaveBeenCalledWith("t1");
    expect(legacyBackendClient.tenant.update).toHaveBeenCalledWith("t1", { name: "Tenant 2" });
    expect(legacyBackendClient.tenant.createMember).toHaveBeenCalledWith({ tenantId: "t1", userId: "u1" });
    expect(legacyBackendClient.tenant.deleteMember).toHaveBeenCalledWith({ tenantId: "t1", userId: "u1" });
    expect(legacyBackendClient.tenant.updateMember).toHaveBeenCalledWith({ status: "active", tenantId: "t1", userId: "u1" });
    expect(legacyBackendClient.tenant.listAllEntities).toHaveBeenCalled();
    expect(legacyBackendClient.organization.create).toHaveBeenCalledWith({ name: "Org" });
    expect(legacyBackendClient.organization.delete).toHaveBeenCalledWith("o1");
    expect(legacyBackendClient.organization.getById).toHaveBeenCalledWith("o1");
    expect(legacyBackendClient.organization.getTree).toHaveBeenCalledWith({ q: "Org" });
    expect(legacyBackendClient.organization.update).toHaveBeenCalledWith("o1", { name: "Org 2" });
    expect(legacyBackendClient.organizationMember.create).toHaveBeenCalledWith({ organizationId: "o1", userId: "u1" });
    expect(legacyBackendClient.organizationMember.delete).toHaveBeenCalledWith("o1", "u1");
    expect(legacyBackendClient.organizationMember.update).toHaveBeenCalledWith("o1", "u1", { roleCode: "owner" });
    expect(legacyBackendClient.user.create).toHaveBeenCalledWith({ username: "alice" });
    expect(legacyBackendClient.user.delete).toHaveBeenCalledWith("u1");
    expect(legacyBackendClient.user.getById).toHaveBeenCalledWith("u1");
    expect(legacyBackendClient.user.update).toHaveBeenCalledWith("u1", { displayName: "Alice" });
    expect(legacyBackendClient.role.create).toHaveBeenCalledWith({ code: "admin" });
    expect(legacyBackendClient.role.delete).toHaveBeenCalledWith("r1");
    expect(legacyBackendClient.role.getById).toHaveBeenCalledWith("r1");
    expect(legacyBackendClient.role.update).toHaveBeenCalledWith("r1", { name: "Admin" });
    expect(legacyBackendClient.role.createPermission).toHaveBeenCalledWith({ permissionId: "p1", roleId: "r1" });
    expect(legacyBackendClient.role.deletePermission).toHaveBeenCalledWith("p1");
    expect(legacyBackendClient.permission.create).toHaveBeenCalledWith({ code: "iam.users.read" });
    expect(legacyBackendClient.permission.delete).toHaveBeenCalledWith("p1");
    expect(legacyBackendClient.permission.getById).toHaveBeenCalledWith("p1");
    expect(legacyBackendClient.permission.update).toHaveBeenCalledWith("p1", { name: "Read users" });
    expect(legacyBackendClient.policy.create).toHaveBeenCalledWith({ code: "policy" });
    expect(legacyBackendClient.policy.delete).toHaveBeenCalledWith("po1");
    expect(legacyBackendClient.policy.getById).toHaveBeenCalledWith("po1");
    expect(legacyBackendClient.policy.update).toHaveBeenCalledWith("po1", { name: "Policy" });
    expect(legacyBackendClient.organizationMember.getMemberRoleIds).toHaveBeenCalledWith("u1");
  });

  it("returns app and backend adapters together for runtime bootstrap", () => {
    const adapters = createIamSdkAdapters({
      appClient: {
        auth: {},
        user: {},
      },
      backendClient: {},
    });

    expect(adapters.app.auth?.sessions?.create).toBeTypeOf("function");
    expect(adapters.backend?.iam?.tenants?.list).toBeTypeOf("function");
  });
});
