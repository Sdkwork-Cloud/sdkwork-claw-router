import { describe, expect, it, vi } from "vitest";

import { createIamRuntime, createMemoryIamTokenStore } from "../src/index";

describe("SDKWork IAM runtime", () => {
  it("bootstraps SaaS or local deployments through injected app and backend SDK clients", () => {
    const runtime = createIamRuntime({
      clients: {
        app: createStandardAppClient(),
        backend: {
          iam: createStandardBackendIamClient(),
        },
      },
      config: {
        appApiBaseUrl: "https://api.example.com",
        appId: "sdkwork-router",
        backendApiBaseUrl: "https://admin-api.example.com",
        deploymentMode: "saas",
        environment: "dev",
      },
      tokenStore: createMemoryIamTokenStore(),
    });

    expect(runtime.config).toEqual({
      appApiBaseUrl: "https://api.example.com/app/v3/api",
      appId: "sdkwork-router",
      backendApiBaseUrl: "https://admin-api.example.com/backend/v3/api",
      deploymentMode: "saas",
      environment: "dev",
    });
    expect(runtime.service).toBeDefined();
  });

  it("persists dual tokens and exposes standard auth headers without client request ids", async () => {
    const runtime = createIamRuntime({
      clients: {
        app: createStandardAppClient({
          accessToken: "Access-Token",
          authLevel: "password",
          authToken: "auth-token",
          dataScope: ["tenant:t1"],
          deploymentMode: "local",
          environment: "test",
          permissionScope: ["iam.users.read"],
          refreshToken: "refresh-token",
          sessionId: "s1",
          tenantId: "t1",
          userId: "u1",
        }),
      },
      config: {
        appId: "sdkwork-router",
        deploymentMode: "local",
        environment: "test",
      },
      localeProvider: () => "zh-CN",
      tokenStore: createMemoryIamTokenStore(),
    });

    await runtime.service.auth.sessions.create({
      password: "secret",
      username: "alice",
    });

    expect(await runtime.tokenStore.get()).toEqual({
      accessToken: "Access-Token",
      authToken: "auth-token",
      refreshToken: "refresh-token",
    });
    expect(await runtime.getAuthHeaders()).toEqual({
      "Accept-Language": "zh-CN",
      Authorization: "Bearer auth-token",
      "Access-Token": "Access-Token",
    });
  });

  it("stores AppContext and derives ShardingContext after session creation", async () => {
    const runtime = createIamRuntime({
      clients: {
        app: createStandardAppClient({
          accessToken: "Access-Token",
          authLevel: "mfa",
          authToken: "auth-token",
          dataScope: ["tenant:t1", "organization:o1"],
          deploymentMode: "saas",
          environment: "prod",
          organizationId: "o1",
          permissionScope: ["iam.organizations.read"],
          sessionId: "s1",
          tenantId: "t1",
          userId: "u1",
        }),
      },
      config: {
        appId: "sdkwork-router",
        deploymentMode: "saas",
        environment: "prod",
      },
      tokenStore: createMemoryIamTokenStore(),
    });

    await runtime.service.auth.sessions.create({
      password: "secret",
      username: "alice",
    });

    expect(await runtime.contextStore.getAppContext()).toMatchObject({
      organizationId: "o1",
      tenantId: "t1",
      userId: "u1",
    });
    expect(await runtime.contextStore.getShardingContext()).toEqual({
      shardingKey: "o1",
      shardingStrategy: "organization",
    });
  });

  it("clears local token and context stores after current session deletion", async () => {
    const runtime = createIamRuntime({
      clients: {
        app: createStandardAppClient({
          accessToken: "Access-Token",
          authToken: "auth-token",
          dataScope: ["tenant:t1"],
          permissionScope: ["iam.users.read"],
          tenantId: "t1",
          userId: "u1",
        }),
      },
      config: {
        appId: "sdkwork-router",
        deploymentMode: "saas",
        environment: "test",
      },
      tokenStore: createMemoryIamTokenStore(),
    });

    await runtime.service.auth.sessions.create({
      password: "secret",
      username: "alice",
    });
    await runtime.service.auth.sessions.current.delete();

    expect(await runtime.tokenStore.get()).toEqual({});
    expect(await runtime.contextStore.getAppContext()).toBeUndefined();
    expect(await runtime.contextStore.getShardingContext()).toBeUndefined();
    expect(await runtime.getAuthHeaders()).toEqual({});
  });

  it("validates generated app and backend SDK clients during runtime bootstrap", () => {
    expect(() =>
      createIamRuntime({
        clients: {
          app: {
            auth: {
              sessions: {
                create: vi.fn(),
              },
            },
          },
        },
        config: {
          appId: "sdkwork-router",
          deploymentMode: "saas",
          environment: "prod",
        },
        tokenStore: createMemoryIamTokenStore(),
      }),
    ).toThrow(/auth\.sessions\.current\.retrieve/);

    expect(() =>
      createIamRuntime({
        clients: {
          app: createStandardAppClient(),
          backend: {
            auth: {
              sessions: {
                create: vi.fn(),
              },
            },
            iam: createStandardBackendIamClient(),
          },
        },
        config: {
          appId: "sdkwork-router",
          deploymentMode: "saas",
          environment: "prod",
        },
        tokenStore: createMemoryIamTokenStore(),
      }),
    ).toThrow(/backend SDK client must not expose an auth namespace/);
  });
});

interface StandardSessionOptions {
  accessToken?: string;
  authLevel?: "anonymous" | "password" | "mfa" | "system";
  authToken?: string;
  dataScope?: string[];
  deploymentMode?: "saas" | "local" | "private";
  environment?: "dev" | "test" | "prod";
  organizationId?: string;
  permissionScope?: string[];
  refreshToken?: string;
  sessionId?: string;
  tenantId?: string;
  userId?: string;
}

function createStandardAppClient(session: StandardSessionOptions = {}) {
  const sessionData = {
    accessToken: session.accessToken ?? "Access-Token",
    authToken: session.authToken ?? "auth-token",
    context: {
      appId: "sdkwork-router",
      authLevel: session.authLevel ?? "password",
      dataScope: session.dataScope ?? [],
      deploymentMode: session.deploymentMode ?? "saas",
      environment: session.environment ?? "test",
      ...(session.organizationId ? { organizationId: session.organizationId } : {}),
      permissionScope: session.permissionScope ?? [],
      sessionId: session.sessionId ?? "session-id",
      tenantId: session.tenantId ?? "tenant-id",
      userId: session.userId ?? "user-id",
    },
    ...(session.refreshToken ? { refreshToken: session.refreshToken } : {}),
    sessionId: session.sessionId ?? "session-id",
  };

  return {
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
        create: vi.fn().mockResolvedValue({ data: sessionData }),
      },
      sessions: {
        create: vi.fn().mockResolvedValue({ data: sessionData }),
        current: {
          delete: vi.fn().mockResolvedValue({ data: undefined }),
          retrieve: vi.fn().mockResolvedValue({ data: sessionData }),
          update: vi.fn().mockResolvedValue({ data: sessionData }),
        },
        refresh: vi.fn().mockResolvedValue({ data: sessionData }),
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
          scans: {
            create: vi.fn(),
          },
          passwords: {
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
      organizations: {
        list: vi.fn(),
        tree: {
          retrieve: vi.fn(),
        },
      },
      organizationMemberships: {
        list: vi.fn(),
      },
      departments: {
        list: vi.fn(),
        tree: {
          retrieve: vi.fn(),
        },
      },
      departmentAssignments: {
        list: vi.fn(),
      },
      positions: {
        list: vi.fn(),
      },
      positionAssignments: {
        list: vi.fn(),
      },
      roleBindings: {
        list: vi.fn(),
      },
      users: {
        current: {
          retrieve: vi.fn(),
        },
      },
    },
  };
}

function createStandardBackendIamClient() {
  return {
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
      retrieve: vi.fn(),
      update: vi.fn(),
    },
    organizationMemberships: {
      create: vi.fn(),
      update: vi.fn(),
    },
    departments: {
      create: vi.fn(),
      delete: vi.fn(),
      retrieve: vi.fn(),
      update: vi.fn(),
    },
    departmentAssignments: {
      create: vi.fn(),
      update: vi.fn(),
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
    positions: {
      create: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
    },
    positionAssignments: {
      create: vi.fn(),
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
    roleBindings: {
      create: vi.fn(),
      delete: vi.fn(),
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
    },
  };
}
