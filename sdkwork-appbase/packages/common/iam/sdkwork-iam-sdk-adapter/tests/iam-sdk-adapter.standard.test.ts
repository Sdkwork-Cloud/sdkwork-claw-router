import { describe, expect, it, vi } from "vitest";

import { assertIamAppSdkClient, assertIamBackendSdkClient, getIamSdkSurface } from "@sdkwork/iam-sdk-ports";

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
      iam: {
        organizations: {
          list: vi.fn().mockResolvedValue({ data: [{ organizationId: "org-1" }] }),
          tree: {
            retrieve: vi.fn().mockResolvedValue({ data: [{ organizationId: "org-1", children: [] }] }),
          },
        },
        organizationMemberships: {
          list: vi.fn().mockResolvedValue({ data: [{ id: "membership-1", organizationId: "org-1", userId: "u1" }] }),
        },
        departments: {
          list: vi.fn().mockResolvedValue({ data: [{ departmentId: "dept-1", organizationId: "org-1" }] }),
          tree: {
            retrieve: vi.fn().mockResolvedValue({ data: [{ departmentId: "dept-1", children: [] }] }),
          },
        },
        departmentAssignments: {
          list: vi.fn().mockResolvedValue({ data: [{ departmentId: "dept-1", userId: "u1" }] }),
        },
        positions: {
          list: vi.fn().mockResolvedValue({ data: [{ positionId: "position-1" }] }),
        },
        positionAssignments: {
          list: vi.fn().mockResolvedValue({ data: [{ positionId: "position-1", userId: "u1" }] }),
        },
        roleBindings: {
          list: vi.fn().mockResolvedValue({ data: [{ roleId: "role-1", scopeId: "org-1" }] }),
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
    await appClient.iam?.organizations?.list?.({ tenantId: "tenant-1" });
    await appClient.iam?.organizations?.tree?.retrieve?.({ tenantId: "tenant-1" });
    await appClient.iam?.organizationMemberships?.list?.({ organizationId: "org-1" });
    await appClient.iam?.departments?.list?.({ organizationId: "org-1" });
    await appClient.iam?.departments?.tree?.retrieve?.({ organizationId: "org-1" });
    await appClient.iam?.departmentAssignments?.list?.({ departmentId: "dept-1" });
    await appClient.iam?.positions?.list?.({ departmentId: "dept-1" });
    await appClient.iam?.positionAssignments?.list?.({ departmentAssignmentId: "assignment-1" });
    await appClient.iam?.roleBindings?.list?.({ scopeId: "org-1" });

    expect(generatedAppClient.auth.login).toHaveBeenCalledWith({ password: "secret", username: "alice" });
    expect(generatedAppClient.auth.register).toHaveBeenCalledWith({ password: "secret", username: "alice", verificationCode: "123456" });
    expect(generatedAppClient.system.iam.runtime.retrieve).toHaveBeenCalledWith({ tenantCode: "default" });
    expect(generatedAppClient.system.iam.verificationPolicy.retrieve).toHaveBeenCalledTimes(1);
    expect(generatedAppClient.auth.createSendSmsCode).toHaveBeenCalledWith({ target: "a@example.com" });
    expect(generatedAppClient.user.getUserProfile).toHaveBeenCalled();
    expect(generatedAppClient.iam.organizations.list).toHaveBeenCalledWith({ tenantId: "tenant-1" });
    expect(generatedAppClient.iam.organizations.tree.retrieve).toHaveBeenCalledWith({ tenantId: "tenant-1" });
    expect(generatedAppClient.iam.departments.list).toHaveBeenCalledWith({ organizationId: "org-1" });
    expect(generatedAppClient.iam.departmentAssignments.list).toHaveBeenCalledWith({ departmentId: "dept-1" });
  });

  it("adapts the current generated backend SDK management surface into standard IAM ports", async () => {
    const generatedBackendClient = {
      iam: {
        apiKeys: {
          list: vi.fn().mockResolvedValue({ data: [] }),
          revoke: vi.fn().mockResolvedValue({ data: true }),
        },
        auditEvents: {
          list: vi.fn().mockResolvedValue({ data: [] }),
        },
        organizations: {
          create: vi.fn().mockResolvedValue({ data: { id: "organization-1" } }),
          delete: vi.fn().mockResolvedValue({ data: true }),
          retrieve: vi.fn().mockResolvedValue({ data: { id: "organization-1" } }),
          update: vi.fn().mockResolvedValue({ data: { id: "organization-1" } }),
        },
        organizationMemberships: {
          create: vi.fn().mockResolvedValue({ data: { id: "membership-1" } }),
          update: vi.fn().mockResolvedValue({ data: { id: "membership-1" } }),
        },
        departments: {
          create: vi.fn().mockResolvedValue({ data: { id: "department-1" } }),
          delete: vi.fn().mockResolvedValue({ data: true }),
          retrieve: vi.fn().mockResolvedValue({ data: { id: "department-1" } }),
          update: vi.fn().mockResolvedValue({ data: { id: "department-1" } }),
        },
        departmentAssignments: {
          create: vi.fn().mockResolvedValue({ data: { id: "department-assignment-1" } }),
          update: vi.fn().mockResolvedValue({ data: { id: "department-assignment-1" } }),
        },
        permissions: {
          create: vi.fn().mockResolvedValue({ data: { id: "permission-1" } }),
          delete: vi.fn().mockResolvedValue({ data: true }),
          list: vi.fn().mockResolvedValue({ data: [] }),
          retrieve: vi.fn().mockResolvedValue({ data: { id: "permission-1" } }),
          update: vi.fn().mockResolvedValue({ data: { id: "permission-1" } }),
        },
        policies: {
          create: vi.fn().mockResolvedValue({ data: { id: "policy-1" } }),
          delete: vi.fn().mockResolvedValue({ data: true }),
          list: vi.fn().mockResolvedValue({ data: [] }),
          retrieve: vi.fn().mockResolvedValue({ data: { id: "policy-1" } }),
          update: vi.fn().mockResolvedValue({ data: { id: "policy-1" } }),
        },
        positions: {
          create: vi.fn().mockResolvedValue({ data: { id: "position-1" } }),
          delete: vi.fn().mockResolvedValue({ data: true }),
          update: vi.fn().mockResolvedValue({ data: { id: "position-1" } }),
        },
        positionAssignments: {
          create: vi.fn().mockResolvedValue({ data: { id: "position-assignment-1" } }),
          update: vi.fn().mockResolvedValue({ data: { id: "position-assignment-1" } }),
        },
        roles: {
          create: vi.fn().mockResolvedValue({ data: { id: "role-1" } }),
          delete: vi.fn().mockResolvedValue({ data: true }),
          list: vi.fn().mockResolvedValue({ data: [] }),
          retrieve: vi.fn().mockResolvedValue({ data: { id: "role-1" } }),
          update: vi.fn().mockResolvedValue({ data: { id: "role-1" } }),
          permissions: {
            create: vi.fn().mockResolvedValue({ data: { id: "rp-1" } }),
            delete: vi.fn().mockResolvedValue({ data: true }),
            list: vi.fn().mockResolvedValue({ data: [] }),
          },
        },
        roleBindings: {
          create: vi.fn().mockResolvedValue({ data: { id: "role-binding-1" } }),
          delete: vi.fn().mockResolvedValue({ data: true }),
        },
        securityEvents: {
          list: vi.fn().mockResolvedValue({ data: [] }),
        },
        tenants: {
          create: vi.fn().mockResolvedValue({ data: { id: "tenant-1" } }),
          delete: vi.fn().mockResolvedValue({ data: true }),
          list: vi.fn().mockResolvedValue({ data: [] }),
          retrieve: vi.fn().mockResolvedValue({ data: { id: "tenant-1" } }),
          update: vi.fn().mockResolvedValue({ data: { id: "tenant-1" } }),
          members: {
            create: vi.fn().mockResolvedValue({ data: { id: "tenant-member-1" } }),
            delete: vi.fn().mockResolvedValue({ data: true }),
            list: vi.fn().mockResolvedValue({ data: [] }),
            update: vi.fn().mockResolvedValue({ data: { id: "tenant-member-1" } }),
          },
        },
        users: {
          create: vi.fn().mockResolvedValue({ data: { id: "user-1" } }),
          delete: vi.fn().mockResolvedValue({ data: true }),
          list: vi.fn().mockResolvedValue({ data: [] }),
          retrieve: vi.fn().mockResolvedValue({ data: { id: "u1" } }),
          update: vi.fn().mockResolvedValue({ data: { id: "u1" } }),
        },
      },
    };

    const backendClient = createIamBackendSdkAdapter(generatedBackendClient);

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
    await backendClient.iam?.apiKeys?.list?.();
    await backendClient.iam?.apiKeys?.revoke?.("api-key-1");
    await backendClient.iam?.auditEvents?.list?.({ tenantId: "tenant-1" });
    await backendClient.iam?.securityEvents?.list?.({ tenantId: "tenant-1" });
    await backendClient.iam?.organizations?.create?.({ name: "Org" });
    await backendClient.iam?.organizations?.delete?.("o1");
    await backendClient.iam?.organizations?.retrieve?.("o1");
    await backendClient.iam?.organizations?.update?.("o1", { name: "Org 2" });
    await backendClient.iam?.organizationMemberships?.create?.({ organizationId: "o1", userId: "u1" });
    await backendClient.iam?.organizationMemberships?.update?.("membership-1", { status: "active" });
    await backendClient.iam?.departments?.create?.({ organizationId: "o1", name: "Product" });
    await backendClient.iam?.departments?.delete?.("department-1");
    await backendClient.iam?.departments?.retrieve?.("department-1");
    await backendClient.iam?.departments?.update?.("department-1", { name: "Platform" });
    await backendClient.iam?.departmentAssignments?.create?.({ departmentId: "department-1", userId: "u1" });
    await backendClient.iam?.departmentAssignments?.update?.("department-assignment-1", { isPrimary: true });
    expect(Object.prototype.hasOwnProperty.call(backendClient.iam?.organizations ?? {}, "members")).toBe(false);
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
    await backendClient.iam?.positions?.create?.({ name: "Product Owner" });
    await backendClient.iam?.positions?.delete?.("position-1");
    await backendClient.iam?.positions?.update?.("position-1", { name: "Senior Product Owner" });
    await backendClient.iam?.positionAssignments?.create?.({ positionId: "position-1", userId: "u1" });
    await backendClient.iam?.positionAssignments?.update?.("position-assignment-1", { isPrimary: true });
    await backendClient.iam?.roleBindings?.create?.({ roleId: "role-1", scopeId: "o1" });
    await backendClient.iam?.roleBindings?.delete?.("role-binding-1");
    expect(Object.prototype.hasOwnProperty.call(backendClient.iam?.users ?? {}, "roles")).toBe(false);

    expect(generatedBackendClient.iam.tenants.create).toHaveBeenCalledWith({ name: "Tenant" });
    expect(generatedBackendClient.iam.tenants.delete).toHaveBeenCalledWith("t1");
    expect(generatedBackendClient.iam.tenants.retrieve).toHaveBeenCalledWith("t1");
    expect(generatedBackendClient.iam.tenants.update).toHaveBeenCalledWith("t1", { name: "Tenant 2" });
    expect(generatedBackendClient.iam.tenants.members.create).toHaveBeenCalledWith("t1", { userId: "u1" });
    expect(generatedBackendClient.iam.tenants.members.delete).toHaveBeenCalledWith("t1", "u1");
    expect(generatedBackendClient.iam.tenants.members.update).toHaveBeenCalledWith("t1", "u1", { status: "active" });
    expect(generatedBackendClient.iam.tenants.list).toHaveBeenCalled();
    expect(generatedBackendClient.iam.apiKeys.list).toHaveBeenCalled();
    expect(generatedBackendClient.iam.apiKeys.revoke).toHaveBeenCalledWith("api-key-1");
    expect(generatedBackendClient.iam.auditEvents.list).toHaveBeenCalledWith({ tenantId: "tenant-1" });
    expect(generatedBackendClient.iam.securityEvents.list).toHaveBeenCalledWith({ tenantId: "tenant-1" });
    expect(generatedBackendClient.iam.organizations.create).toHaveBeenCalledWith({ name: "Org" });
    expect(generatedBackendClient.iam.organizations.delete).toHaveBeenCalledWith("o1");
    expect(generatedBackendClient.iam.organizations.retrieve).toHaveBeenCalledWith("o1");
    expect(generatedBackendClient.iam.organizations.update).toHaveBeenCalledWith("o1", { name: "Org 2" });
    expect(generatedBackendClient.iam.organizationMemberships.create).toHaveBeenCalledWith({ organizationId: "o1", userId: "u1" });
    expect(generatedBackendClient.iam.organizationMemberships.update).toHaveBeenCalledWith("membership-1", { status: "active" });
    expect(generatedBackendClient.iam.departments.create).toHaveBeenCalledWith({ organizationId: "o1", name: "Product" });
    expect(generatedBackendClient.iam.departments.delete).toHaveBeenCalledWith("department-1");
    expect(generatedBackendClient.iam.departments.retrieve).toHaveBeenCalledWith("department-1");
    expect(generatedBackendClient.iam.departments.update).toHaveBeenCalledWith("department-1", { name: "Platform" });
    expect(generatedBackendClient.iam.departmentAssignments.create).toHaveBeenCalledWith({ departmentId: "department-1", userId: "u1" });
    expect(generatedBackendClient.iam.departmentAssignments.update).toHaveBeenCalledWith("department-assignment-1", { isPrimary: true });
    expect(generatedBackendClient.iam.users.create).toHaveBeenCalledWith({ username: "alice" });
    expect(generatedBackendClient.iam.users.delete).toHaveBeenCalledWith("u1");
    expect(generatedBackendClient.iam.users.retrieve).toHaveBeenCalledWith("u1");
    expect(generatedBackendClient.iam.users.update).toHaveBeenCalledWith("u1", { displayName: "Alice" });
    expect(generatedBackendClient.iam.roles.create).toHaveBeenCalledWith({ code: "admin" });
    expect(generatedBackendClient.iam.roles.delete).toHaveBeenCalledWith("r1");
    expect(generatedBackendClient.iam.roles.retrieve).toHaveBeenCalledWith("r1");
    expect(generatedBackendClient.iam.roles.update).toHaveBeenCalledWith("r1", { name: "Admin" });
    expect(generatedBackendClient.iam.roles.permissions.create).toHaveBeenCalledWith("r1", "p1");
    expect(generatedBackendClient.iam.roles.permissions.delete).toHaveBeenCalledWith("r1", "p1");
    expect(generatedBackendClient.iam.roles.permissions.list).toHaveBeenCalledWith("r1");
    expect(generatedBackendClient.iam.permissions.create).toHaveBeenCalledWith({ code: "iam.users.read" });
    expect(generatedBackendClient.iam.permissions.delete).toHaveBeenCalledWith("p1");
    expect(generatedBackendClient.iam.permissions.retrieve).toHaveBeenCalledWith("p1");
    expect(generatedBackendClient.iam.permissions.update).toHaveBeenCalledWith("p1", { name: "Read users" });
    expect(generatedBackendClient.iam.policies.create).toHaveBeenCalledWith({ code: "policy" });
    expect(generatedBackendClient.iam.policies.delete).toHaveBeenCalledWith("po1");
    expect(generatedBackendClient.iam.policies.retrieve).toHaveBeenCalledWith("po1");
    expect(generatedBackendClient.iam.policies.update).toHaveBeenCalledWith("po1", { name: "Policy" });
    expect(generatedBackendClient.iam.positions.create).toHaveBeenCalledWith({ name: "Product Owner" });
    expect(generatedBackendClient.iam.positions.delete).toHaveBeenCalledWith("position-1");
    expect(generatedBackendClient.iam.positions.update).toHaveBeenCalledWith("position-1", { name: "Senior Product Owner" });
    expect(generatedBackendClient.iam.positionAssignments.create).toHaveBeenCalledWith({ positionId: "position-1", userId: "u1" });
    expect(generatedBackendClient.iam.positionAssignments.update).toHaveBeenCalledWith("position-assignment-1", { isPrimary: true });
    expect(generatedBackendClient.iam.roleBindings.create).toHaveBeenCalledWith({ roleId: "role-1", scopeId: "o1" });
    expect(generatedBackendClient.iam.roleBindings.delete).toHaveBeenCalledWith("role-binding-1");
    expect(getIamSdkSurface(backendClient)).not.toContain("iam.organizations.list");
    expect(getIamSdkSurface(backendClient)).not.toContain("iam.organizations.tree.retrieve");
    expect(getIamSdkSurface(backendClient)).not.toContain("iam.organizations.members.create");
    expect(getIamSdkSurface(backendClient)).not.toContain("iam.organizations.members.delete");
    expect(getIamSdkSurface(backendClient)).not.toContain("iam.organizations.members.list");
    expect(getIamSdkSurface(backendClient)).not.toContain("iam.organizations.members.update");
    expect(getIamSdkSurface(backendClient)).not.toContain("iam.users.roles.create");
    expect(getIamSdkSurface(backendClient)).not.toContain("iam.users.roles.delete");
    expect(getIamSdkSurface(backendClient)).not.toContain("iam.users.roles.list");
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
