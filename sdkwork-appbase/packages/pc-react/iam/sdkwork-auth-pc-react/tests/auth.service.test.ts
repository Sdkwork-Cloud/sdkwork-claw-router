import { describe, expect, it, vi } from "vitest";
import {
  createSdkworkAuthService,
  createSdkworkCanonicalRuntimeAuthAuthorityService,
  createSdkworkIamRuntimeAuthController,
  createSdkworkLocalAuthService,
  type SdkworkAuthClient,
} from "../src";

interface LocalAuthTestUser {
  email: string;
  id: string;
  name: string;
}

const authAvatar = {
  kind: "image",
  publicUrl: "https://cdn.sdkwork.ai/avatar.png",
  source: "external_url",
  url: "https://cdn.sdkwork.ai/avatar.png",
} as const;

const runtimeQrCode = {
  kind: "image",
  publicUrl: "https://cdn.sdkwork.ai/auth/qr-runtime.png",
  source: "external_url",
  url: "https://cdn.sdkwork.ai/auth/qr-runtime.png",
} as const;

const resourceQrCode = {
  kind: "image",
  publicUrl: "https://cdn.sdkwork.ai/auth/qr-resource.png",
  source: "external_url",
  url: "https://cdn.sdkwork.ai/auth/qr-resource.png",
} as const;

describe("sdkwork-auth-pc-react service", () => {
  it("creates an auth controller from a standard IAM runtime without product-specific auth adapters", async () => {
    const tokenStore = {
      clear: vi.fn(),
      get: vi.fn().mockResolvedValue({
        accessToken: "stored-access-token",
        authToken: "stored-auth-token",
        refreshToken: "stored-refresh-token",
      }),
      set: vi.fn(),
    };
    const contextStore = {
      clear: vi.fn(),
      getAppContext: vi.fn(),
      getShardingContext: vi.fn(),
      setAppContext: vi.fn(),
    };
    const runtime = {
      config: {
        appId: "sdkwork-test-app",
        deploymentMode: "saas",
        environment: "test",
      },
      contextStore,
      getAuthHeaders: vi.fn(),
      service: {
        auth: {
          oauthAuthorizationUrls: {
            retrieve: vi.fn().mockResolvedValue({
              authUrl: "https://auth.sdkwork.ai/oauth/github",
            }),
          },
          oauthSessions: {
            create: vi.fn().mockResolvedValue({
              accessToken: "oauth-access-token",
              authToken: "oauth-auth-token",
              user: {
                displayName: "OAuth Operator",
                email: "oauth@sdkwork.ai",
                id: "oauth-user-1",
              },
            }),
          },
          passwordResetRequests: {
            create: vi.fn().mockResolvedValue({ requestId: "reset-request-1" }),
          },
          passwordResets: {
            create: vi.fn().mockResolvedValue({ reset: true }),
          },
          registrations: {
            create: vi.fn().mockResolvedValue({
              accessToken: "registered-access-token",
              authToken: "registered-auth-token",
              refreshToken: "registered-refresh-token",
              user: {
                displayName: "Registered Operator",
                email: "registered@sdkwork.ai",
                id: "registered-user-1",
              },
            }),
          },
          sessions: {
            create: vi.fn().mockResolvedValue({
              accessToken: "session-access-token",
              authToken: "session-auth-token",
              refreshToken: "session-refresh-token",
              user: {
                displayName: "Session Operator",
                email: "session@sdkwork.ai",
                id: "session-user-1",
              },
            }),
            current: {
              delete: vi.fn().mockImplementation(async () => {
                await tokenStore.clear();
                await contextStore.clear();
              }),
              retrieve: vi.fn().mockResolvedValue({
                accessToken: "current-access-token",
                authToken: "current-auth-token",
                user: {
                  displayName: "Current Operator",
                  email: "current@sdkwork.ai",
                  id: "current-user-1",
                },
              }),
              update: vi.fn().mockResolvedValue({
                accessToken: "updated-access-token",
                authToken: "updated-auth-token",
                refreshToken: "updated-refresh-token",
                user: {
                  displayName: "Updated Operator",
                  email: "updated@sdkwork.ai",
                  id: "updated-user-1",
                },
              }),
            },
            refresh: vi.fn().mockResolvedValue({
              accessToken: "refreshed-access-token",
              authToken: "refreshed-auth-token",
              refreshToken: "refreshed-refresh-token",
              user: {
                displayName: "Refreshed Operator",
                email: "refreshed@sdkwork.ai",
                id: "refreshed-user-1",
              },
            }),
          },
          verificationCodes: {
            create: vi.fn().mockResolvedValue({ codeId: "code-1" }),
            verify: vi.fn().mockResolvedValue({ verified: true }),
          },
        },
        iam: {
          users: {
            current: {
              retrieve: vi.fn().mockResolvedValue({
                displayName: "Profile Operator",
                email: "profile@sdkwork.ai",
                id: "profile-user-1",
                username: "profile",
              }),
            },
          },
        },
        system: {
          iam: {
            verificationPolicy: {
              retrieve: vi.fn().mockResolvedValue({
                emailCodeLoginEnabled: true,
                emailRegisterVerificationRequired: true,
                phoneCodeLoginEnabled: false,
                phoneRegisterVerificationRequired: false,
              }),
            },
          },
        },
        openPlatform: {
          qrAuth: {
            sessions: {
              create: vi.fn().mockResolvedValue({
                qrContent: {
                  content: "sdkwork://auth/qr-login?key=qr-runtime-1",
                  mode: "fallback_url",
                },
                sessionKey: "qr-runtime-1",
                status: "pending",
                title: "Desktop QR Login",
              }),
              retrieve: vi.fn().mockResolvedValue({
                sessionKey: "qr-runtime-1",
                status: "completed",
              }),
              passwords: {
                create: vi.fn().mockResolvedValue({
                  accessToken: "qr-password-access-token",
                  authToken: "qr-password-auth-token",
                  expiresIn: 3600,
                  userId: "qr-runtime-user",
                }),
              },
              scans: {
                create: vi.fn().mockResolvedValue({
                  sessionKey: "qr-runtime-1",
                  status: "scanned",
                }),
              },
            },
          },
        },
      },
      tokenStore,
    };
    const controller = createSdkworkIamRuntimeAuthController({
      getRuntime: () => runtime as never,
    });

    await expect(controller.bootstrap()).resolves.toMatchObject({
      isAuthenticated: true,
      user: {
        email: "current@sdkwork.ai",
        id: "current-user-1",
      },
    });
    await expect(controller.signIn({
      password: "secret",
      username: "sdkwork",
    })).resolves.toMatchObject({
      accessToken: "session-access-token",
      authToken: "session-auth-token",
      user: {
        email: "session@sdkwork.ai",
        firstName: "Session",
        id: "session-user-1",
        initials: "SO",
        lastName: "Operator",
      },
    });
    await expect(controller.signInWithSessionBridge({
      email: " bridge@sdkwork.ai ",
      name: "Bridge Operator",
      subject: "sdkwork:bridge-user",
    })).resolves.toMatchObject({
      accessToken: "session-access-token",
      authToken: "session-auth-token",
    });
    await expect(controller.register({
      channel: "EMAIL",
      confirmPassword: "secret",
      email: "registered@sdkwork.ai",
      password: "secret",
      username: "registered",
      verificationCode: "123456",
    })).resolves.toMatchObject({
      accessToken: "registered-access-token",
      authToken: "registered-auth-token",
      user: {
        id: "registered-user-1",
      },
    });
    await expect(controller.getVerificationPolicy()).resolves.toEqual({
      emailCodeLoginEnabled: true,
      emailRegistrationVerificationRequired: true,
      phoneCodeLoginEnabled: false,
      phoneRegistrationVerificationRequired: false,
    });
    await controller.sendVerifyCode({
      scene: "REGISTER",
      target: " registered@sdkwork.ai ",
      verifyType: "EMAIL",
    });
    await expect(controller.verifyCode({
      code: "123456",
      scene: "REGISTER",
      target: "registered@sdkwork.ai",
      verifyType: "EMAIL",
    })).resolves.toBe(true);
    await controller.requestPasswordReset({
      account: "registered@sdkwork.ai",
      channel: "EMAIL",
    });
    await controller.resetPassword({
      account: "registered@sdkwork.ai",
      code: "123456",
      newPassword: "new-secret",
    });
    await expect(controller.getOAuthAuthorizationUrl({
      provider: "github",
      redirectUri: "https://app.sdkwork.ai/oauth/callback",
      scope: "profile email",
      state: "state-1",
    })).resolves.toBe("https://auth.sdkwork.ai/oauth/github");
    await expect(controller.updateCurrentSession({
      organizationId: "org-1",
    })).resolves.toMatchObject({
      accessToken: "updated-access-token",
      authToken: "updated-auth-token",
      user: {
        email: "updated@sdkwork.ai",
      },
    });
    await expect(controller.refreshSession({
      refreshToken: "stored-refresh-token",
    })).resolves.toMatchObject({
      accessToken: "refreshed-access-token",
      authToken: "refreshed-auth-token",
      user: {
        email: "refreshed@sdkwork.ai",
      },
    });
    await expect(controller.generateLoginQrCode({
      purpose: "login",
    })).resolves.toMatchObject({
      qrContent: "sdkwork://auth/qr-login?key=qr-runtime-1",
      sessionKey: "qr-runtime-1",
      title: "Desktop QR Login",
    });
    await expect(controller.checkLoginQrCodeStatus(" qr-runtime-1 ")).resolves.toMatchObject({
      status: "confirmed",
    });
    await expect(controller.confirmLoginQrCode({
      password: "qr-secret",
      sessionKey: " qr-runtime-1 ",
      username: "qr-user",
    })).resolves.toMatchObject({
      status: "confirmed",
    });
    await expect(controller.callbackLoginQrCode({
      event: "passwordRequired",
      sessionKey: " qr-runtime-1 ",
      scanSource: "browser",
    })).resolves.toMatchObject({
      status: "scanned",
    });
    await controller.signInWithOAuth({
      code: "oauth-code",
      provider: "github",
      state: "state-1",
    });
    await controller.signOut();

    expect(runtime.service.auth.sessions.current.retrieve).toHaveBeenCalledOnce();
    expect(runtime.service.auth.sessions.create).toHaveBeenCalledWith({
      grantType: "password",
      password: "secret",
      username: "sdkwork",
    });
    expect(runtime.service.auth.sessions.create).toHaveBeenCalledWith({
      email: "bridge@sdkwork.ai",
      grantType: "session_bridge",
      name: "Bridge Operator",
      subject: "sdkwork:bridge-user",
    });
    expect(runtime.service.auth.registrations.create).toHaveBeenCalledWith({
      channel: "EMAIL",
      confirmPassword: "secret",
      email: "registered@sdkwork.ai",
      password: "secret",
      phone: undefined,
      username: "registered",
      verificationCode: "123456",
    });
    expect(runtime.service.system.iam.verificationPolicy.retrieve).toHaveBeenCalledOnce();
    expect(runtime.service.auth.verificationCodes.create).toHaveBeenCalledWith({
      scene: "REGISTER",
      target: "registered@sdkwork.ai",
      verifyType: "EMAIL",
    });
    expect(runtime.service.auth.oauthAuthorizationUrls.retrieve).toHaveBeenCalledWith({
      provider: "GITHUB",
      redirectUri: "https://app.sdkwork.ai/oauth/callback",
      scope: "profile email",
      state: "state-1",
    });
    expect(runtime.service.auth.oauthSessions.create).toHaveBeenCalledWith({
      code: "oauth-code",
      deviceId: undefined,
      deviceType: undefined,
      provider: "GITHUB",
      state: "state-1",
    });
    expect(runtime.service.auth.sessions.current.update).toHaveBeenCalledWith({
      organizationId: "org-1",
    });
    expect(runtime.service.auth.sessions.refresh).toHaveBeenCalledWith({
      refreshToken: "stored-refresh-token",
    });
    expect(runtime.service.openPlatform.qrAuth.sessions.create).toHaveBeenCalledWith({
      purpose: "login",
    });
    expect(runtime.service.openPlatform.qrAuth.sessions.retrieve).toHaveBeenCalledWith("qr-runtime-1");
    expect(runtime.service.openPlatform.qrAuth.sessions.passwords.create).toHaveBeenCalledWith("qr-runtime-1", {
      password: "qr-secret",
      username: "qr-user",
    });
    expect(runtime.service.openPlatform.qrAuth.sessions.scans.create).toHaveBeenCalledWith("qr-runtime-1", {
      scanSource: "browser",
    });
    expect(runtime.service.auth.sessions.current.delete).toHaveBeenCalledOnce();
    expect(tokenStore.clear).toHaveBeenCalledOnce();
    expect(contextStore.clear).toHaveBeenCalledOnce();
  });

  it("persists IAM runtime QR password completion tokens and applies the scanner session", async () => {
    const tokenStore = {
      clear: vi.fn(),
      get: vi.fn().mockResolvedValue({}),
      set: vi.fn(),
    };
    const passwordsCreate = vi.fn().mockResolvedValue({
      accessToken: "runtime-qr-password-access-token",
      authToken: "runtime-qr-password-auth-token",
      refreshToken: "runtime-qr-password-refresh-token",
      user: {
        displayName: "Runtime QR Password Operator",
        email: "runtime-qr-password@sdkwork.ai",
        id: "runtime-qr-password-user-1",
      },
    });
    const controller = createSdkworkIamRuntimeAuthController({
      getRuntime: () => ({
        service: {
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
              },
            },
            verificationCodes: {
              create: vi.fn(),
              verify: vi.fn(),
            },
          },
          iam: {
            users: {
              current: {
                retrieve: vi.fn(),
              },
            },
          },
          openPlatform: {
            qrAuth: {
              sessions: {
                create: vi.fn(),
                retrieve: vi.fn(),
                passwords: {
                  create: passwordsCreate,
                },
              },
            },
          },
        },
        tokenStore,
      } as never),
    });

    await expect(controller.confirmLoginQrCode({
      password: "runtime-secret",
      sessionKey: " runtime_qr_password_1 ",
      username: "runtime-user",
    })).resolves.toMatchObject({
      session: {
        accessToken: "runtime-qr-password-access-token",
        authToken: "runtime-qr-password-auth-token",
        refreshToken: "runtime-qr-password-refresh-token",
        user: {
          email: "runtime-qr-password@sdkwork.ai",
          id: "runtime-qr-password-user-1",
        },
      },
      status: "confirmed",
    });
    expect(passwordsCreate).toHaveBeenCalledWith("runtime_qr_password_1", {
      password: "runtime-secret",
      username: "runtime-user",
    });
    expect(tokenStore.set).toHaveBeenCalledWith({
      accessToken: "runtime-qr-password-access-token",
      authToken: "runtime-qr-password-auth-token",
      refreshToken: "runtime-qr-password-refresh-token",
    });
    expect(controller.getState()).toMatchObject({
      isAuthenticated: true,
      status: "authenticated",
      user: {
        email: "runtime-qr-password@sdkwork.ai",
      },
    });
  });

  it("rejects IAM runtime QR password completion without standard credentials", async () => {
    const create = vi.fn();
    const controller = createSdkworkIamRuntimeAuthController({
      getRuntime: () => ({
        service: {
          auth: {
            sessions: {
              current: {
                retrieve: vi.fn().mockResolvedValue(null),
              },
            },
          },
          openPlatform: {
            qrAuth: {
              sessions: {
                passwords: {
                  create,
                },
              },
            },
          },
        },
        tokenStore: {
          clear: vi.fn(),
          get: vi.fn().mockResolvedValue({}),
          set: vi.fn(),
        },
      } as never),
    });

    await expect(controller.confirmLoginQrCode({
      sessionKey: "runtime_qr_missing_credentials",
    })).rejects.toThrow(/username/i);
    await expect(controller.confirmLoginQrCode({
      sessionKey: "runtime_qr_missing_password",
      username: "runtime-user",
      password: " ",
    })).rejects.toThrow(/password/i);
    expect(create).not.toHaveBeenCalled();
  });

  it("rejects IAM runtime QR scans with a non-standard scan source", async () => {
    const create = vi.fn();
    const controller = createSdkworkIamRuntimeAuthController({
      getRuntime: () => ({
        service: {
          auth: {
            sessions: {
              current: {
                retrieve: vi.fn().mockResolvedValue(null),
              },
            },
          },
          openPlatform: {
            qrAuth: {
              sessions: {
                scans: {
                  create,
                },
              },
            },
          },
        },
        tokenStore: {
          clear: vi.fn(),
          get: vi.fn().mockResolvedValue({}),
          set: vi.fn(),
        },
      } as never),
    });

    await expect(controller.callbackLoginQrCode({
      sessionKey: "runtime_qr_invalid_scan_source",
      scanSource: "wechat",
    })).rejects.toThrow(/scan source/i);
    expect(create).not.toHaveBeenCalled();
  });

  it("rejects IAM runtime QR session creation with a non-standard purpose", async () => {
    const create = vi.fn();
    const controller = createSdkworkIamRuntimeAuthController({
      getRuntime: () => ({
        service: {
          auth: {
            sessions: {
              current: {
                retrieve: vi.fn().mockResolvedValue(null),
              },
            },
          },
          openPlatform: {
            qrAuth: {
              sessions: {
                create,
              },
            },
          },
        },
        tokenStore: {
          clear: vi.fn(),
          get: vi.fn().mockResolvedValue({}),
          set: vi.fn(),
        },
      } as never),
    });

    await expect(controller.generateLoginQrCode({
      purpose: "reset_password",
    } as never)).rejects.toThrow(/purpose/i);
    expect(create).not.toHaveBeenCalled();
  });

  it("preserves backend QR images as MediaResource objects from IAM runtime responses", async () => {
    const controller = createSdkworkIamRuntimeAuthController({
      getRuntime: () => ({
        service: {
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
              },
            },
            verificationCodes: {
              create: vi.fn(),
              verify: vi.fn(),
            },
          },
          openPlatform: {
            qrAuth: {
              sessions: {
                create: vi.fn().mockResolvedValue({
                  qrCode: runtimeQrCode,
                  qrContent: "sdkwork://auth/runtime-url-fallback",
                  sessionKey: "qr-runtime-url-1",
                }),
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
        },
      }),
    });

    await expect(controller.generateLoginQrCode()).resolves.toMatchObject({
      qrContent: "sdkwork://auth/runtime-url-fallback",
      qrCode: runtimeQrCode,
      sessionKey: "qr-runtime-url-1",
    });
  });

  it("keeps text-only IAM runtime QR content separate from QR image resources", async () => {
    const controller = createSdkworkIamRuntimeAuthController({
      getRuntime: () => ({
        service: {
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
              },
            },
            verificationCodes: {
              create: vi.fn(),
              verify: vi.fn(),
            },
          },
          openPlatform: {
            qrAuth: {
              sessions: {
                create: vi.fn().mockResolvedValue({
                  qrContent: "https://mp.weixin.qq.com/sdkwork-login?session_key=qr-runtime-content-1",
                  sessionKey: "qr-runtime-content-1",
                }),
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
        },
      }),
    });

    await expect(controller.generateLoginQrCode()).resolves.toMatchObject({
      qrContent: "https://mp.weixin.qq.com/sdkwork-login?session_key=qr-runtime-content-1",
      qrCode: undefined,
      sessionKey: "qr-runtime-content-1",
    });
  });

  it("keeps IAM runtime fallback URLs as QR content instead of rendered image assets", async () => {
    const controller = createSdkworkIamRuntimeAuthController({
      getRuntime: () => ({
        service: {
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
              },
            },
            verificationCodes: {
              create: vi.fn(),
              verify: vi.fn(),
            },
          },
          openPlatform: {
            qrAuth: {
              sessions: {
                create: vi.fn().mockResolvedValue({
                  qrContent: {
                    content: "https://console.example.test/auth/qr/qr-runtime-alias-1?session_key=qr-runtime-alias-1&purpose=login",
                    mode: "fallback_url",
                  },
                  sessionKey: "qr-runtime-alias-1",
                }),
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
        },
      }),
    });

    await expect(controller.generateLoginQrCode()).resolves.toMatchObject({
      qrContent: "https://console.example.test/auth/qr/qr-runtime-alias-1?session_key=qr-runtime-alias-1&purpose=login",
      qrCode: undefined,
      sessionKey: "qr-runtime-alias-1",
      type: "fallback_url",
    });
  });

  it("maps login responses and persists runtime session tokens through standard resource SDK methods", async () => {
    const persistSession = vi.fn();
    const client = {
      auth: {
        sessions: {
          create: vi.fn().mockResolvedValue({
            code: "2000",
            data: {
              accessToken: "access-token-1",
              authToken: "auth-token-1",
              refreshToken: "refresh-token-1",
              user: {
                email: "sdkwork@sdkwork.ai",
                displayName: "Sdkwork Operator",
              },
            },
          }),
        },
      },
      iam: {
        users: {
          current: {
            retrieve: vi.fn().mockResolvedValue({
              code: "2000",
              data: {
                avatar: authAvatar,
                email: "sdkwork@sdkwork.ai",
                displayName: "Sdkwork Operator",
                userId: "user-1",
                username: "sdkwork",
              },
            }),
          },
        },
      },
    };

    const service = createSdkworkAuthService({
      getClient: () => client,
      persistSession,
      resolveAccessToken: () => "access-token-1",
    });

    const session = await service.signIn({
      password: "secret",
      username: "sdkwork",
    });

    expect(client.auth.sessions.create).toHaveBeenCalledWith({
      grantType: "password",
      password: "secret",
      username: "sdkwork",
    });
    expect(persistSession).toHaveBeenCalledWith({
      accessToken: "access-token-1",
      authToken: "auth-token-1",
      refreshToken: "refresh-token-1",
    });
    expect(session).toEqual({
      accessToken: "access-token-1",
      authToken: "auth-token-1",
      refreshToken: "refresh-token-1",
      user: {
        avatar: authAvatar,
        displayName: "Sdkwork Operator",
        email: "sdkwork@sdkwork.ai",
        firstName: "Sdkwork",
        id: "user-1",
        initials: "SO",
        lastName: "Operator",
        username: "sdkwork",
      },
    });
  });

  it("creates registrations through auth.registrations.create without falling back to password login", async () => {
    const persistSession = vi.fn();
    const registrationsCreate = vi.fn().mockResolvedValue({
      data: {
        accessToken: "registered-access-token",
        authToken: "registered-auth-token",
        refreshToken: "registered-refresh-token",
        user: {
          displayName: "Registered Operator",
          email: "registered@sdkwork.ai",
          userId: "registered-user-1",
          username: "registered",
        },
      },
    });
    const sessionsCreate = vi.fn();
    const client = {
      auth: {
        registrations: {
          create: registrationsCreate,
        },
        sessions: {
          create: sessionsCreate,
        },
      },
      iam: {
        users: {
          current: {
            retrieve: vi.fn().mockResolvedValue({
              data: {
                displayName: "Registered Operator",
                email: "registered@sdkwork.ai",
                userId: "registered-user-1",
                username: "registered",
              },
            }),
          },
        },
      },
    };

    const service = createSdkworkAuthService({
      getClient: () => client,
      persistSession,
    });

    const session = await service.register({
      channel: "EMAIL",
      confirmPassword: "secret",
      email: "registered@sdkwork.ai",
      password: "secret",
      username: "registered",
      verificationCode: "123456",
    });

    expect(registrationsCreate).toHaveBeenCalledWith({
      channel: "EMAIL",
      confirmPassword: "secret",
      email: "registered@sdkwork.ai",
      password: "secret",
      phone: undefined,
      username: "registered",
      verificationCode: "123456",
    });
    expect(sessionsCreate).not.toHaveBeenCalled();
    expect(persistSession).toHaveBeenCalledWith({
      accessToken: "registered-access-token",
      authToken: "registered-auth-token",
      refreshToken: "registered-refresh-token",
    });
    expect(session).toMatchObject({
      accessToken: "registered-access-token",
      authToken: "registered-auth-token",
      user: {
        email: "registered@sdkwork.ai",
        id: "registered-user-1",
      },
    });
  });

  it("allows registration without verificationCode when the app policy does not require one", async () => {
    const legacyRegister = vi.fn().mockResolvedValue({});
    const legacyLogin = vi.fn().mockResolvedValue({
      data: {
        authToken: "legacy-auth-token",
      },
    });
    const registrationsCreate = vi.fn().mockResolvedValue({
      data: {
        accessToken: "registered-access-token",
        authToken: "registered-auth-token",
        user: {
          displayName: "Missing Code Operator",
          email: "missing-code@sdkwork.ai",
          userId: "missing-code-user",
        },
      },
    });
    const service = createSdkworkAuthService({
      getClient: () => ({
        auth: {
          login: legacyLogin,
          register: legacyRegister,
          registrations: {
            create: registrationsCreate,
          },
        },
      } as unknown as SdkworkAuthClient),
      resolveAccessToken: () => "access-token",
    });

    await expect(service.register({
      channel: "EMAIL",
      confirmPassword: "secret",
      email: "missing-code@sdkwork.ai",
      password: "secret",
      username: "missing-code",
    })).resolves.toMatchObject({
      authToken: "registered-auth-token",
      user: {
        email: "missing-code@sdkwork.ai",
      },
    });
    expect(registrationsCreate).toHaveBeenCalledWith({
      channel: "EMAIL",
      confirmPassword: "secret",
      email: "missing-code@sdkwork.ai",
      password: "secret",
      phone: undefined,
      username: "missing-code",
    });
    expect(legacyRegister).not.toHaveBeenCalled();
    expect(legacyLogin).not.toHaveBeenCalled();
  });

  it("retrieves and normalizes public IAM verification policy through the system IAM resource SDK", async () => {
    const retrieve = vi.fn().mockResolvedValue({
      data: {
        emailCodeLoginEnabled: true,
        emailRegisterVerificationRequired: true,
        phoneCodeLoginEnabled: false,
        phoneRegisterVerificationRequired: false,
      },
    });
    const service = createSdkworkAuthService({
      getClient: () => ({
        auth: {
        },
        system: {
          iam: {
            verificationPolicy: {
              retrieve,
            },
          },
        },
      } as unknown as SdkworkAuthClient),
    });

    await expect(service.getVerificationPolicy()).resolves.toEqual({
      emailCodeLoginEnabled: true,
      emailRegistrationVerificationRequired: true,
      phoneCodeLoginEnabled: false,
      phoneRegistrationVerificationRequired: false,
    });
    expect(retrieve).toHaveBeenCalledOnce();
  });

  it("passes optional registration verificationCode through the IAM runtime only when provided", async () => {
    const registrationsCreate = vi.fn().mockResolvedValue({
      accessToken: "registered-access-token",
      authToken: "registered-auth-token",
      user: {
        displayName: "Runtime Registered",
        email: "runtime@sdkwork.ai",
        id: "runtime-user",
      },
    });
    const controller = createSdkworkIamRuntimeAuthController({
      getRuntime: () => ({
        service: {
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
              create: registrationsCreate,
            },
            sessions: {
              create: vi.fn(),
              current: {
                delete: vi.fn(),
                retrieve: vi.fn(),
              },
            },
            verificationCodes: {
              create: vi.fn(),
              verify: vi.fn(),
            },
          },
          iam: {
            users: {
              current: {
                retrieve: vi.fn(),
              },
            },
          },
        },
      }),
    });

    await controller.register({
      channel: "EMAIL",
      confirmPassword: "secret",
      email: "runtime@sdkwork.ai",
      password: "secret",
      username: "runtime",
    });
    await controller.register({
      channel: "EMAIL",
      confirmPassword: "secret",
      email: "runtime@sdkwork.ai",
      password: "secret",
      username: "runtime",
      verificationCode: " 123456 ",
    });

    expect(registrationsCreate).toHaveBeenNthCalledWith(1, {
      channel: "EMAIL",
      confirmPassword: "secret",
      email: "runtime@sdkwork.ai",
      password: "secret",
      phone: undefined,
      username: "runtime",
    });
    expect(registrationsCreate).toHaveBeenNthCalledWith(2, {
      channel: "EMAIL",
      confirmPassword: "secret",
      email: "runtime@sdkwork.ai",
      password: "secret",
      phone: undefined,
      username: "runtime",
      verificationCode: "123456",
    });
  });

  it("passes optional registration verificationCode through canonical runtime authority only when provided", async () => {
    const register = vi.fn()
      .mockResolvedValueOnce({
        sessionId: "canonical-session-1",
        user: {
          email: "runtime@sdkwork.ai",
          id: "runtime-user",
          name: "Runtime User",
        },
      } satisfies {
        sessionId: string;
        user: LocalAuthTestUser;
      })
      .mockResolvedValueOnce({
        sessionId: "canonical-session-2",
        user: {
          email: "runtime@sdkwork.ai",
          id: "runtime-user",
          name: "Runtime User",
        },
      } satisfies {
        sessionId: string;
        user: LocalAuthTestUser;
      });
    const authority = createSdkworkCanonicalRuntimeAuthAuthorityService({
      clearSessionToken: vi.fn(),
      login: vi.fn(),
      mapProfileUser: (profile: LocalAuthTestUser) => profile,
      mapSessionUser: (session: {
        sessionId: string;
        user: LocalAuthTestUser;
      }) => session.user,
      readSessionToken: vi.fn().mockReturnValue(null),
      register,
      writeSessionToken: vi.fn((token: string) => token),
    });

    await expect(authority.register({
      email: " runtime@sdkwork.ai ",
      password: "secret",
      username: " runtime ",
    })).resolves.toMatchObject({
      email: "runtime@sdkwork.ai",
    });
    await authority.register({
      email: " runtime@sdkwork.ai ",
      password: "secret",
      username: " runtime ",
      verificationCode: " 123456 ",
    });

    expect(register).toHaveBeenNthCalledWith(1, {
      channel: undefined,
      confirmPassword: undefined,
      email: "runtime@sdkwork.ai",
      name: "runtime",
      password: "secret",
      phone: undefined,
      username: "runtime",
    });
    expect(register).toHaveBeenNthCalledWith(2, {
      channel: undefined,
      confirmPassword: undefined,
      email: "runtime@sdkwork.ai",
      name: "runtime",
      password: "secret",
      phone: undefined,
      username: "runtime",
      verificationCode: "123456",
    });
  });

  it("routes secondary auth flows through the resource-style app SDK surface", async () => {
    const clearSession = vi.fn();
    const oauthAuthorizationUrlsRetrieve = vi.fn().mockResolvedValue({
      data: {
        url: "https://auth.sdkwork.ai/oauth/github",
      },
    });
    const oauthSessionsCreate = vi.fn().mockResolvedValue({
      data: {
        accessToken: "oauth-access-token",
        authToken: "oauth-auth-token",
      },
    });
    const passwordResetRequestsCreate = vi.fn().mockResolvedValue({ data: { requestId: "reset-1" } });
    const passwordResetsCreate = vi.fn().mockResolvedValue({ data: { reset: true } });
    const sessionsCreate = vi.fn().mockResolvedValue({
      data: {
        accessToken: "code-access-token",
        authToken: "code-auth-token",
      },
    });
    const sessionsCurrentDelete = vi.fn().mockResolvedValue({ data: undefined });
    const verificationCodesCreate = vi.fn().mockResolvedValue({ data: { codeId: "code-1" } });
    const verificationCodesVerify = vi.fn().mockResolvedValue({ data: { verified: true } });
    const client = {
      auth: {
        oauthAuthorizationUrls: {
          retrieve: oauthAuthorizationUrlsRetrieve,
        },
        oauthSessions: {
          create: oauthSessionsCreate,
        },
        passwordResetRequests: {
          create: passwordResetRequestsCreate,
        },
        passwordResets: {
          create: passwordResetsCreate,
        },
        sessions: {
          create: sessionsCreate,
          current: {
            delete: sessionsCurrentDelete,
          },
        },
        verificationCodes: {
          create: verificationCodesCreate,
          verify: verificationCodesVerify,
        },
      },
    };
    const service = createSdkworkAuthService({
      clearSession,
      getClient: () => client,
    });

    await service.signInWithPhoneCode({
      code: "123456",
      deviceId: "device-1",
      phone: " 13800138000 ",
    });
    await service.signInWithEmailCode({
      code: "654321",
      email: " operator@sdkwork.ai ",
    });
    await service.sendVerifyCode({
      scene: "REGISTER",
      target: " operator@sdkwork.ai ",
      verifyType: "EMAIL",
    });
    await expect(service.verifyCode({
      code: "123456",
      scene: "REGISTER",
      target: "operator@sdkwork.ai",
      verifyType: "EMAIL",
    })).resolves.toBe(true);
    await service.requestPasswordReset({
      account: "operator@sdkwork.ai",
      channel: "EMAIL",
    });
    await service.resetPassword({
      account: "operator@sdkwork.ai",
      code: "123456",
      newPassword: "new-secret",
    });
    await expect(service.getOAuthAuthorizationUrl({
      provider: "github",
      redirectUri: "https://app.sdkwork.ai/callback",
      scope: "profile email",
      state: "state-1",
    })).resolves.toBe("https://auth.sdkwork.ai/oauth/github");
    await service.signInWithOAuth({
      code: "oauth-code",
      provider: "github",
      state: "state-1",
    });
    await service.signOut();

    expect(sessionsCreate).toHaveBeenCalledWith({
      appVersion: undefined,
      code: "123456",
      deviceId: "device-1",
      deviceName: undefined,
      deviceType: undefined,
      grantType: "phone_code",
      phone: "13800138000",
    });
    expect(sessionsCreate).toHaveBeenCalledWith({
      appVersion: undefined,
      code: "654321",
      deviceId: undefined,
      deviceName: undefined,
      deviceType: undefined,
      email: "operator@sdkwork.ai",
      grantType: "email_code",
    });
    expect(verificationCodesCreate).toHaveBeenCalledWith({
      scene: "REGISTER",
      target: "operator@sdkwork.ai",
      verifyType: "EMAIL",
    });
    expect(verificationCodesVerify).toHaveBeenCalledWith({
      code: "123456",
      scene: "REGISTER",
      target: "operator@sdkwork.ai",
      verifyType: "EMAIL",
    });
    expect(passwordResetRequestsCreate).toHaveBeenCalledWith({
      account: "operator@sdkwork.ai",
      channel: "EMAIL",
    });
    expect(passwordResetsCreate).toHaveBeenCalledWith({
      account: "operator@sdkwork.ai",
      code: "123456",
      confirmPassword: "new-secret",
      newPassword: "new-secret",
    });
    expect(oauthAuthorizationUrlsRetrieve).toHaveBeenCalledWith(
      "GITHUB",
      "https://app.sdkwork.ai/callback",
      "state-1",
      "profile email",
    );
    expect(oauthSessionsCreate).toHaveBeenCalledWith({
      code: "oauth-code",
      deviceId: undefined,
      deviceType: undefined,
      provider: "GITHUB",
      state: "state-1",
    });
    expect(sessionsCurrentDelete).toHaveBeenCalledOnce();
    expect(clearSession).toHaveBeenCalledOnce();
  });

  it("creates QR auth sessions through the openPlatform SDK", async () => {
    const create = vi.fn().mockResolvedValue({
      data: {
        expiresAt: "2026-05-21T05:05:00.000Z",
        fallbackUrl: "https://auth.example.test/qr?session_key=session_1&purpose=login",
        qrContent: {
          content: "https://auth.example.test/qr?session_key=session_1&purpose=login",
          mode: "fallback_url",
        },
        sessionKey: "session_1",
        status: "pending",
      },
    });
    const service = createSdkworkAuthService({
      getClient: () => ({
        auth: {},
        openPlatform: {
          qrAuth: {
            sessions: {
              create,
            },
          },
        },
      } as unknown as SdkworkAuthClient),
    });

    const result = await service.generateLoginQrCode();
    expect(result).toMatchObject({
      expireTime: Date.parse("2026-05-21T05:05:00.000Z"),
      qrContent: "https://auth.example.test/qr?session_key=session_1&purpose=login",
      sessionKey: "session_1",
      type: "fallback_url",
    });
    expect(result).not.toHaveProperty("qrKey");
    expect(create).toHaveBeenCalledWith({
      purpose: "login",
    });
  });

  it("creates register QR auth sessions through the openPlatform SDK when requested", async () => {
    const create = vi.fn().mockResolvedValue({
      data: {
        qrContent: {
          content: "weixin://dl/business/?t=mini_login",
          mode: "mini_app_url",
        },
        sessionKey: "session_register_1",
        status: "pending",
      },
    });
    const service = createSdkworkAuthService({
      getClient: () => ({
        auth: {},
        openPlatform: {
          qrAuth: {
            sessions: {
              create,
            },
          },
        },
      } as unknown as SdkworkAuthClient),
    });

    await expect(service.generateLoginQrCode({
      purpose: "register",
    })).resolves.toMatchObject({
      qrContent: "weixin://dl/business/?t=mini_login",
      sessionKey: "session_register_1",
      type: "mini_app_url",
    });
    expect(create).toHaveBeenCalledWith({
      purpose: "register",
    });
  });

  it("rejects QR auth session creation with a non-standard purpose", async () => {
    const create = vi.fn();
    const service = createSdkworkAuthService({
      getClient: () => ({
        auth: {},
        openPlatform: {
          qrAuth: {
            sessions: {
              create,
            },
          },
        },
      } as unknown as SdkworkAuthClient),
    });

    await expect(service.generateLoginQrCode({
      purpose: "reset_password",
    } as never)).rejects.toThrow(/purpose/i);
    expect(create).not.toHaveBeenCalled();
  });

  it("maps completed QR auth sessions without requiring platform token payloads", async () => {
    const retrieve = vi.fn().mockResolvedValue({
      data: {
        sessionKey: "session_completed_1",
        status: "completed",
      },
    });
    const service = createSdkworkAuthService({
      getClient: () => ({
        auth: {},
        openPlatform: {
          qrAuth: {
            sessions: {
              retrieve,
            },
          },
        },
      } as unknown as SdkworkAuthClient),
    });

    await expect(service.checkLoginQrCodeStatus(" session_completed_1 ")).resolves.toEqual({
      status: "confirmed",
      user: undefined,
    });
    expect(retrieve).toHaveBeenCalledWith("session_completed_1");
  });

  it("reports browser QR entry scans through openPlatform qrAuth sessions", async () => {
    const create = vi.fn().mockResolvedValue({
      data: {
        status: "scanned",
      },
    });
    const service = createSdkworkAuthService({
      getClient: () => ({
        auth: {},
        openPlatform: {
          qrAuth: {
            sessions: {
              scans: {
                create,
              },
            },
          },
        },
      } as unknown as SdkworkAuthClient),
    });

    await expect(service.callbackLoginQrCode({
      event: "passwordRequired",
      sessionKey: " session_scan_1 ",
      scanSource: "browser",
    })).resolves.toEqual({
      status: "scanned",
      user: undefined,
    });

    expect(create).toHaveBeenCalledWith("session_scan_1", {
      scanSource: "browser",
    });
  });

  it("reports standardized QR scan metadata through openPlatform qrAuth sessions", async () => {
    const create = vi.fn().mockResolvedValue({
      data: {
        id: "qr_auth_scan_1",
        scanSource: "official_account",
        sessionKey: "session_scan_standard_1",
      },
    });
    const service = createSdkworkAuthService({
      getClient: () => ({
        auth: {},
        openPlatform: {
          qrAuth: {
            sessions: {
              scans: {
                create,
              },
            },
          },
        },
      } as unknown as SdkworkAuthClient),
    });

    await expect(service.callbackLoginQrCode({
      accountId: "account_official_1",
      entryId: "entry_official_1",
      externalUserId: "openid_1",
      ipHash: "ip_hash_1",
      sessionKey: " session_scan_standard_1 ",
      scanSource: "official_account",
      userAgent: "MicroMessenger",
    })).resolves.toEqual({
      status: "scanned",
      user: undefined,
    });

    expect(create).toHaveBeenCalledWith("session_scan_standard_1", {
      accountId: "account_official_1",
      entryId: "entry_official_1",
      externalUserId: "openid_1",
      ipHash: "ip_hash_1",
      scanSource: "official_account",
      userAgent: "MicroMessenger",
    });
  });

  it("rejects QR entry scans with a non-standard scan source", async () => {
    const create = vi.fn();
    const service = createSdkworkAuthService({
      getClient: () => ({
        auth: {},
        openPlatform: {
          qrAuth: {
            sessions: {
              scans: {
                create,
              },
            },
          },
        },
      } as unknown as SdkworkAuthClient),
    });

    await expect(service.callbackLoginQrCode({
      sessionKey: "session_invalid_scan_source",
      scanSource: "wechat",
    })).rejects.toThrow(/scan source/i);
    expect(create).not.toHaveBeenCalled();
  });

  it("treats platform QR scan records without status as scanned after the SDK call succeeds", async () => {
    const create = vi.fn().mockResolvedValue({
      data: {
        id: "qr_auth_scan_1",
        scanSource: "browser",
        sessionKey: "session_scan_record_1",
      },
    });
    const service = createSdkworkAuthService({
      getClient: () => ({
        auth: {},
        openPlatform: {
          qrAuth: {
            sessions: {
              scans: {
                create,
              },
            },
          },
        },
      } as unknown as SdkworkAuthClient),
    });

    await expect(service.callbackLoginQrCode({
      sessionKey: " session_scan_record_1 ",
      scanSource: "browser",
    })).resolves.toEqual({
      status: "scanned",
      user: undefined,
    });

    expect(create).toHaveBeenCalledWith("session_scan_record_1", {
      scanSource: "browser",
    });
  });

  it("completes browser QR entry password login through openPlatform qrAuth passwords", async () => {
    const create = vi.fn().mockResolvedValue({
      data: {
        accessToken: "access_password_alice",
        authToken: "auth_password_alice",
        expiresIn: 3600,
        userId: "alice",
      },
    });
    const service = createSdkworkAuthService({
      getClient: () => ({
        auth: {},
        openPlatform: {
          qrAuth: {
            sessions: {
              passwords: {
                create,
              },
            },
          },
        },
      } as unknown as SdkworkAuthClient),
      persistSession: vi.fn(),
    });

    await expect(service.confirmLoginQrCode({
      password: "login-secret",
      sessionKey: " session_password_1 ",
      username: "alice",
    })).resolves.toMatchObject({
      session: {
        accessToken: "access_password_alice",
        authToken: "auth_password_alice",
        user: {
          id: "alice",
        },
      },
      status: "confirmed",
    });

    expect(create).toHaveBeenCalledWith("session_password_1", {
      password: "login-secret",
      username: "alice",
    });
  });

  it("maps non-token QR password completion statuses instead of forcing confirmed", async () => {
    const create = vi.fn().mockResolvedValue({
      data: {
        status: "cancelled",
      },
    });
    const service = createSdkworkAuthService({
      getClient: () => ({
        auth: {},
        openPlatform: {
          qrAuth: {
            sessions: {
              passwords: {
                create,
              },
            },
          },
        },
      } as unknown as SdkworkAuthClient),
      persistSession: vi.fn(),
    });

    await expect(service.confirmLoginQrCode({
      password: "login-secret",
      sessionKey: " session_password_cancelled_1 ",
      username: "alice",
    })).resolves.toEqual({
      status: "failed",
      user: undefined,
    });

    expect(create).toHaveBeenCalledWith("session_password_cancelled_1", {
      password: "login-secret",
      username: "alice",
    });
  });

  it("rejects browser QR entry password completion without standard credentials", async () => {
    const create = vi.fn();
    const service = createSdkworkAuthService({
      getClient: () => ({
        auth: {},
        openPlatform: {
          qrAuth: {
            sessions: {
              passwords: {
                create,
              },
            },
          },
        },
      } as unknown as SdkworkAuthClient),
    });

    await expect(service.confirmLoginQrCode({
      sessionKey: "session_password_missing_credentials",
    })).rejects.toThrow(/username/i);
    await expect(service.confirmLoginQrCode({
      sessionKey: "session_password_missing_password",
      username: "alice",
      password: "",
    })).rejects.toThrow(/password/i);
    expect(create).not.toHaveBeenCalled();
  });

  it("persists scanner browser sessions returned by QR password completion", async () => {
    const create = vi.fn().mockResolvedValue({
      data: {
        accessToken: "qr-password-access-token",
        authToken: "qr-password-auth-token",
        refreshToken: "qr-password-refresh-token",
        user: {
          displayName: "QR Password Operator",
          email: "qr-password@sdkwork.ai",
          id: "qr-password-user-1",
        },
      },
    });
    const persistSession = vi.fn();
    const service = createSdkworkAuthService({
      getClient: () => ({
        auth: {},
        iam: {
          users: {
            current: {
              retrieve: vi.fn().mockResolvedValue({
                data: {
                  displayName: "QR Password Profile",
                  email: "qr-password-profile@sdkwork.ai",
                  id: "qr-password-profile-user-1",
                },
              }),
            },
          },
        },
        openPlatform: {
          qrAuth: {
            sessions: {
              passwords: {
                create,
              },
            },
          },
        },
      } as unknown as SdkworkAuthClient),
      persistSession,
    });

    await expect(service.confirmLoginQrCode({
      password: "login-secret",
      sessionKey: " session_password_2 ",
      username: "alice",
    })).resolves.toMatchObject({
      session: {
        accessToken: "qr-password-access-token",
        authToken: "qr-password-auth-token",
        refreshToken: "qr-password-refresh-token",
        user: {
          email: "qr-password-profile@sdkwork.ai",
          id: "qr-password-profile-user-1",
        },
      },
      status: "confirmed",
      user: {
        email: "qr-password-profile@sdkwork.ai",
      },
    });
    expect(create).toHaveBeenCalledWith("session_password_2", {
      password: "login-secret",
      username: "alice",
    });
    expect(persistSession).toHaveBeenCalledWith({
      accessToken: "qr-password-access-token",
      authToken: "qr-password-auth-token",
      refreshToken: "qr-password-refresh-token",
    });
  });

  it("preserves platform QR images as MediaResource objects from SDK responses", async () => {
    const service = createSdkworkAuthService({
      getClient: () => ({
        auth: {},
        openPlatform: {
          qrAuth: {
            sessions: {
            create: vi.fn().mockResolvedValue({
              data: {
                expiresAt: "2026-05-21T05:05:00.000Z",
                qrContent: "sdkwork://auth/resource-url-fallback",
                qrCode: resourceQrCode,
                sessionKey: "qr-resource-url-1",
              },
            }),
            },
          },
        },
      } as unknown as SdkworkAuthClient),
    });

    await expect(service.generateLoginQrCode()).resolves.toMatchObject({
      qrContent: "sdkwork://auth/resource-url-fallback",
      qrCode: resourceQrCode,
      sessionKey: "qr-resource-url-1",
    });
  });

  it("keeps text-only QR content separate from QR image resources", async () => {
    const service = createSdkworkAuthService({
      getClient: () => ({
        auth: {},
        openPlatform: {
          qrAuth: {
            sessions: {
            create: vi.fn().mockResolvedValue({
              data: {
                qrContent: "https://wxaurl.cn/sdkwork-login?session_key=qr-resource-content-1",
                sessionKey: "qr-resource-content-1",
              },
            }),
            },
          },
        },
      } as unknown as SdkworkAuthClient),
    });

    await expect(service.generateLoginQrCode()).resolves.toMatchObject({
      qrContent: "https://wxaurl.cn/sdkwork-login?session_key=qr-resource-content-1",
      qrCode: undefined,
      sessionKey: "qr-resource-content-1",
    });
  });

  it("keeps fallback QR URLs as content instead of rendered image assets", async () => {
    const service = createSdkworkAuthService({
      getClient: () => ({
        auth: {},
        openPlatform: {
          qrAuth: {
            sessions: {
              create: vi.fn().mockResolvedValue({
                data: {
                  qrContent: {
                    content: "https://console.example.test/auth/qr/qr-resource-alias-1?session_key=qr-resource-alias-1&purpose=login",
                    mode: "fallback_url",
                  },
                  sessionKey: "qr-resource-alias-1",
                },
              }),
            },
          },
        },
      } as unknown as SdkworkAuthClient),
    });

    await expect(service.generateLoginQrCode()).resolves.toMatchObject({
      qrContent: "https://console.example.test/auth/qr/qr-resource-alias-1?session_key=qr-resource-alias-1&purpose=login",
      qrCode: undefined,
      sessionKey: "qr-resource-alias-1",
      type: "fallback_url",
    });
  });

  it("maps official-account QR auth content from the configured default openPlatform entry", async () => {
    const create = vi.fn().mockResolvedValue({
      data: {
        qrContent: {
          content: "https://mp.weixin.qq.com/s/sdkwork-login",
          mode: "official_account_entry",
        },
        sessionKey: "qr-official-account-1",
      },
    });
    const service = createSdkworkAuthService({
      getClient: () => ({
        auth: {},
        openPlatform: {
          qrAuth: {
            sessions: {
              create,
            },
          },
        },
      } as unknown as SdkworkAuthClient),
    });

    await expect(service.generateLoginQrCode()).resolves.toMatchObject({
      qrContent: "https://mp.weixin.qq.com/s/sdkwork-login",
      sessionKey: "qr-official-account-1",
      type: "official_account_entry",
    });

    expect(create).toHaveBeenCalledWith({
      purpose: "login",
    });
  });

  it("normalizes expired QR status errors from the openPlatform SDK", async () => {
    const retrieve = vi.fn().mockResolvedValue({
      code: "4001",
      msg: "Invalid or expired QR login code",
    });
    const service = createSdkworkAuthService({
      getClient: () => ({
        auth: {},
        openPlatform: {
          qrAuth: {
            sessions: {
              retrieve,
            },
          },
        },
      } as unknown as SdkworkAuthClient),
    });

    await expect(service.checkLoginQrCodeStatus(" qr-expired-1 ")).resolves.toEqual({
      status: "expired",
      user: undefined,
    });
    expect(retrieve).toHaveBeenCalledWith("qr-expired-1");
  });

  it("accepts confirmed QR status sessions when an IAM exchange response is available", async () => {
    const retrieve = vi.fn().mockResolvedValue({
      data: {
        session: {
          accessToken: "qr-session-access-token",
          authToken: "qr-session-auth-token",
          user: {
            displayName: "QR Session Operator",
            email: "qr-session@sdkwork.ai",
            id: "qr-session-user-1",
          },
        },
        status: "confirmed",
      },
    });
    const persistSession = vi.fn();
    const service = createSdkworkAuthService({
      getClient: () => ({
        auth: {
        },
        openPlatform: {
          qrAuth: {
            sessions: {
              retrieve,
            },
          },
        },
      } as unknown as SdkworkAuthClient),
      persistSession,
    });

    await expect(service.checkLoginQrCodeStatus(" qr-session-1 ")).resolves.toMatchObject({
      session: {
        accessToken: "qr-session-access-token",
        authToken: "qr-session-auth-token",
        user: {
          email: "qr-session@sdkwork.ai",
          id: "qr-session-user-1",
        },
      },
      status: "confirmed",
    });
    expect(retrieve).toHaveBeenCalledWith("qr-session-1");
    expect(persistSession).toHaveBeenCalledWith(expect.objectContaining({
      accessToken: "qr-session-access-token",
      authToken: "qr-session-auth-token",
    }));
  });

  it("keeps accepting confirmed QR status tokens when an IAM exchange response is available", async () => {
    const retrieve = vi.fn().mockResolvedValue({
      data: {
        status: "confirmed",
        token: {
          accessToken: "qr-token-access-token",
          authToken: "qr-token-auth-token",
          user: {
            displayName: "QR Token Operator",
            email: "qr-token@sdkwork.ai",
            id: "qr-token-user-1",
          },
        },
      },
    });
    const persistSession = vi.fn();
    const service = createSdkworkAuthService({
      getClient: () => ({
        auth: {
        },
        openPlatform: {
          qrAuth: {
            sessions: {
              retrieve,
            },
          },
        },
      } as unknown as SdkworkAuthClient),
      persistSession,
    });

    await expect(service.checkLoginQrCodeStatus(" qr-token-1 ")).resolves.toMatchObject({
      session: {
        accessToken: "qr-token-access-token",
        authToken: "qr-token-auth-token",
        user: {
          email: "qr-token@sdkwork.ai",
          id: "qr-token-user-1",
        },
      },
      status: "confirmed",
    });
    expect(retrieve).toHaveBeenCalledWith("qr-token-1");
    expect(persistSession).toHaveBeenCalledWith(expect.objectContaining({
      accessToken: "qr-token-access-token",
      authToken: "qr-token-auth-token",
    }));
  });

  it("normalizes expired QR status errors from IAM runtime openPlatform services", async () => {
    const retrieve = vi.fn().mockRejectedValue(new Error("Invalid or expired QR login code"));
    const controller = createSdkworkIamRuntimeAuthController({
      getRuntime: () => ({
        service: {
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
              },
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
                retrieve,
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
        },
      }),
    });

    await expect(controller.checkLoginQrCodeStatus(" qr-expired-runtime-1 ")).resolves.toEqual({
      status: "expired",
    });
    expect(retrieve).toHaveBeenCalledWith("qr-expired-runtime-1");
  });

  it("creates a reusable local auth service for product adapters", async () => {
    const register = vi.fn().mockResolvedValue({
      email: "example@sdkwork.ai",
      id: "example-user-1",
      name: "SDKWork Example Operator",
    } satisfies LocalAuthTestUser);
    const refreshSession = vi.fn().mockResolvedValue({
      email: "refreshed@sdkwork.ai",
      id: "refreshed-user-1",
      name: "Refreshed Operator",
    } satisfies LocalAuthTestUser);
    const updateCurrentSession = vi.fn().mockResolvedValue({
      email: "updated@sdkwork.ai",
      id: "updated-user-1",
      name: "Updated Operator",
    } satisfies LocalAuthTestUser);
    const service = createSdkworkLocalAuthService<LocalAuthTestUser>({
      register: async (input) =>
        register({
          email: input.email,
          password: input.password,
          username: input.username,
          verificationCode: input.verificationCode,
        }),
      refreshSession,
      signIn: async () => ({
        email: "example@sdkwork.ai",
        id: "example-user-1",
        name: "SDKWork Example Operator",
      }),
      signInWithSessionBridge: async (input) => ({
        email: input.email,
        id: "bridge-user",
        name: input.name || "Bridge User",
      }),
      signOut: vi.fn(),
      toSession(user: LocalAuthTestUser) {
        return {
          accessToken: `session:${user.id}`,
          authToken: `session:${user.id}`,
          user: {
            displayName: user.name,
            email: user.email,
            firstName: "SDKWork",
            id: user.id,
            initials: "BO",
            lastName: "Operator",
            username: user.email,
          },
        };
      },
      toUser(user: LocalAuthTestUser) {
        return {
          displayName: user.name,
          email: user.email,
          firstName: "SDKWork",
          id: user.id,
          initials: "BO",
          lastName: "Operator",
          username: user.email,
        };
      },
      updateCurrentSession,
      user: null,
    });

    const session = await service.register({
      email: "example@sdkwork.ai",
      password: "secret",
      username: "example",
      verificationCode: "123456",
    });
    const bridgeSession = await service.signInWithSessionBridge({
      email: "bridge@sdkwork.ai",
      name: "Bridge User",
      subject: "external-user-center:bridge@sdkwork.ai",
    });
    const refreshedSession = await service.refreshSession({
      refreshToken: "refresh-token-1",
    });
    const updatedSession = await service.updateCurrentSession({
      organizationId: "org-1",
    });

    expect(register).toHaveBeenCalledWith({
      email: "example@sdkwork.ai",
      password: "secret",
      username: "example",
      verificationCode: "123456",
    });
    expect(session).toMatchObject({
      accessToken: "session:example-user-1",
      authToken: "session:example-user-1",
      user: {
        email: "example@sdkwork.ai",
        id: "example-user-1",
      },
    });
    expect(bridgeSession).toMatchObject({
      accessToken: "session:bridge-user",
      authToken: "session:bridge-user",
      user: {
        email: "bridge@sdkwork.ai",
        id: "bridge-user",
      },
    });
    expect(refreshSession).toHaveBeenCalledWith({
      refreshToken: "refresh-token-1",
    });
    expect(refreshedSession).toMatchObject({
      accessToken: "session:refreshed-user-1",
      authToken: "session:refreshed-user-1",
      user: {
        email: "refreshed@sdkwork.ai",
        id: "refreshed-user-1",
      },
    });
    expect(updateCurrentSession).toHaveBeenCalledWith({
      organizationId: "org-1",
    });
    expect(updatedSession).toMatchObject({
      accessToken: "session:updated-user-1",
      authToken: "session:updated-user-1",
      user: {
        email: "updated@sdkwork.ai",
        id: "updated-user-1",
      },
    });
  });

  it("uses the default verification policy when a local auth adapter does not provide one", async () => {
    const service = createSdkworkLocalAuthService<LocalAuthTestUser>({
      signIn: async () => ({
        email: "example@sdkwork.ai",
        id: "example-user-1",
        name: "SDKWork Example Operator",
      }),
      signOut: vi.fn(),
      toSession(user: LocalAuthTestUser) {
        return {
          accessToken: `session:${user.id}`,
          authToken: `session:${user.id}`,
          user: {
            displayName: user.name,
            email: user.email,
            firstName: "SDKWork",
            id: user.id,
            initials: "BO",
            lastName: "Operator",
            username: user.email,
          },
        };
      },
      toUser(user: LocalAuthTestUser) {
        return {
          displayName: user.name,
          email: user.email,
          firstName: "SDKWork",
          id: user.id,
          initials: "BO",
          lastName: "Operator",
          username: user.email,
        };
      },
    });

    await expect(service.getVerificationPolicy()).resolves.toEqual({
      emailCodeLoginEnabled: false,
      emailRegistrationVerificationRequired: false,
      phoneCodeLoginEnabled: false,
      phoneRegistrationVerificationRequired: false,
    });
  });
});
