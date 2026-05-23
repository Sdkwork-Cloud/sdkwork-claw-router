import { describe, expect, it, vi } from "vitest";

import {
  SDKWORK_PLATFORM_API_ROUTES,
  SDKWORK_PLATFORM_APP_SDK_REQUIRED_METHODS,
  SDKWORK_PLATFORM_BACKEND_SDK_REQUIRED_METHODS,
  SDKWORK_PLATFORM_CAPABILITIES,
  SDKWORK_PLATFORM_CONVERSATION_BRIDGE,
  SDKWORK_PLATFORM_DOMAIN_MODELS,
  SDKWORK_PLATFORM_OPERATION_IDS,
  SDKWORK_PLATFORM_QR_AUTH_POLICY,
  SDKWORK_PLATFORM_SDK_CONVERSATION_BOUNDARY,
  SDKWORK_PLATFORM_STANDARD,
  SDKWORK_PLATFORM_TABLES,
  assertPlatformAppSdkClient,
  assertPlatformBackendSdkClient,
  createPlatformConversationPolicy,
  createPlatformProviderManifest,
  createPlatformQrAuthPolicy,
  getPlatformSdkSurface,
} from "../src/index";

describe("SDKWork platform standard", () => {
  it("is one provider-neutral business package with open_platform API and openPlatform SDK namespace", () => {
    expect(SDKWORK_PLATFORM_STANDARD.packageName).toBe("@sdkwork/platform");
    expect(SDKWORK_PLATFORM_STANDARD.domain).toBe("platform");
    expect(SDKWORK_PLATFORM_STANDARD.apiNamespace).toBe("open_platform");
    expect(SDKWORK_PLATFORM_STANDARD.sdkNamespaces).toEqual(["openPlatform"]);
    expect(SDKWORK_PLATFORM_STANDARD.providers).toEqual(
      expect.arrayContaining(["wechat", "alipay", "douyin"]),
    );
  });

  it("keeps API_SPEC-compliant open_platform paths", () => {
    expect(SDKWORK_PLATFORM_API_ROUTES.app.openPlatform.hooks.deliveries.create.path).toBe(
      "/app/v3/api/open_platform/hooks/{hookKey}/deliveries",
    );
    expect(SDKWORK_PLATFORM_API_ROUTES.backend.openPlatform.accounts.payBindings.create.path).toBe(
      "/backend/v3/api/open_platform/accounts/{accountId}/pay_bindings",
    );

    const paths = Object.values(SDKWORK_PLATFORM_OPERATION_IDS).map((operation) => operation.path);
    expect(paths).toEqual(
      expect.arrayContaining([
        "/app/v3/api/open_platform/entries/{entryKey}",
        "/app/v3/api/open_platform/hooks/{hookKey}/verify",
        "/backend/v3/api/open_platform/accounts/{accountId}/entries",
        "/backend/v3/api/open_platform/outbox/{outboxId}/attempts",
        "/backend/v3/api/open_platform/menus/{menuId}/publishes",
      ]),
    );

    for (const path of paths) {
      expect(path).toMatch(/^\/(app|backend)\/v3\/api\/open_platform/);
      expect(path).not.toContain("/open-platform");
      expect(path).not.toContain("/wechat");
    }
  });

  it("owns platform tables and links messages through conversation records", () => {
    expect(SDKWORK_PLATFORM_TABLES).toEqual(
      expect.objectContaining({
        account: "open_platform_account",
        delivery: "open_platform_delivery",
        event: "open_platform_event",
        outbox: "open_platform_outbox",
        payBinding: "open_platform_pay_binding",
      }),
    );
    expect(SDKWORK_PLATFORM_DOMAIN_MODELS.find((model) => model.name === "event")?.fields).toEqual(
      expect.arrayContaining(["conversation_id", "message_id"]),
    );
    expect(SDKWORK_PLATFORM_DOMAIN_MODELS.find((model) => model.name === "account")?.fields).toEqual(
      expect.arrayContaining(["app_id", "secret_ref", "token_ref", "aes_key_ref", "default_entry_id", "qr_default"]),
    );
    expect(SDKWORK_PLATFORM_DOMAIN_MODELS.find((model) => model.name === "outbox")?.fields).toEqual(
      expect.arrayContaining(["conversation_id", "message_id"]),
    );

    for (const model of SDKWORK_PLATFORM_DOMAIN_MODELS) {
      expect(model.domain).toBe("platform");
      expect(model.name).not.toMatch(/supportSession|supportMessage/i);
    }
  });

  it("bridges official-account messages and customer-service replies into @sdkwork/conversation", () => {
    expect(SDKWORK_PLATFORM_CONVERSATION_BRIDGE).toEqual({
      conversationPackage: "@sdkwork/conversation",
      inboundOfficialAccountMessage: {
        role: "user",
        source: "open_platform",
        channel: "official_account",
      },
      customerServiceReply: {
        role: "support",
        source: "customer_service",
        channel: "customer_service",
      },
      assistantReply: {
        role: "assistant",
        source: "agent",
        channel: "official_account",
      },
      externalIdentityTable: "conversation_external",
      messageTable: "conversation_message",
      supportMessageTable: null,
      supportSessionTable: null,
    });
    expect(createPlatformConversationPolicy().conversationBridge).toBe(SDKWORK_PLATFORM_CONVERSATION_BRIDGE);
  });

  it("keeps generated SDK methods in openPlatform while conversation writes stay in conversations", () => {
    expect(SDKWORK_PLATFORM_APP_SDK_REQUIRED_METHODS).toEqual(
      expect.arrayContaining([
        "openPlatform.entries.retrieve",
        "openPlatform.hooks.verify",
        "openPlatform.hooks.deliveries.create",
      ]),
    );
    expect(SDKWORK_PLATFORM_BACKEND_SDK_REQUIRED_METHODS).toEqual(
      expect.arrayContaining([
        "openPlatform.accounts.entries.list",
        "openPlatform.accounts.payBindings.create",
        "openPlatform.outbox.attempts.create",
      ]),
    );
    expect(SDKWORK_PLATFORM_SDK_CONVERSATION_BOUNDARY).toEqual({
      conversationPackage: "@sdkwork/conversation",
      customerServiceReplyMethod: "conversations.messages.create",
      officialAccountInboundMethod: "conversations.messages.create",
      openPlatformDeliveryAttemptMethod: "openPlatform.outbox.attempts.create",
      forbiddenOpenPlatformMethods: [
        "openPlatform.customerServiceMessages.create",
        "openPlatform.supportMessages.create",
        "openPlatform.supportSessions.create",
      ],
    });
  });

  it("accepts complete generated SDK clients and rejects support aliases", () => {
    const appClient = createClient(SDKWORK_PLATFORM_APP_SDK_REQUIRED_METHODS);
    const backendClient = createClient(SDKWORK_PLATFORM_BACKEND_SDK_REQUIRED_METHODS);

    expect(() => assertPlatformAppSdkClient(appClient)).not.toThrow();
    expect(() => assertPlatformBackendSdkClient(backendClient)).not.toThrow();
    expect(getPlatformSdkSurface(backendClient)).toContain("openPlatform.outbox.attempts.create");

    expect(() =>
      assertPlatformBackendSdkClient({
        ...backendClient,
        openPlatform: {
          ...backendClient.openPlatform,
          supportMessages: { create: vi.fn() },
        },
      }),
    ).toThrow(/retired.*supportMessages/i);
  });

  it("defines provider manifests and capability coverage", () => {
    const manifest = createPlatformProviderManifest({
      key: "wechat_official",
      provider: "wechat",
      type: "official_account",
      version: "2026-05-21",
    });

    expect(manifest.caps).toEqual(
      expect.arrayContaining(["hook", "message", "reply", "window", "menu", "notice", "login", "pay"]),
    );
    expect(manifest.replies.customer).toBe(true);
    expect(manifest.windows).toEqual(expect.arrayContaining([expect.objectContaining({ type: "customer" })]));

    const operationKeys = Object.keys(SDKWORK_PLATFORM_OPERATION_IDS).sort();
    const capabilityOperationKeys = SDKWORK_PLATFORM_CAPABILITIES.flatMap((capability) => capability.operations).sort();
    expect(capabilityOperationKeys).toEqual(operationKeys);
  });

  it("defines QR login/register tables without owning IAM credentials", () => {
    expect(SDKWORK_PLATFORM_TABLES).toEqual(
      expect.objectContaining({
        qrAuthSession: "open_platform_qr_auth_session",
        qrAuthScan: "open_platform_qr_auth_scan",
        qrAuthEvent: "open_platform_qr_auth_event",
        qrAuthLog: "open_platform_qr_auth_log",
      }),
    );

    expect(SDKWORK_PLATFORM_DOMAIN_MODELS.find((model) => model.name === "qrAuthSession")?.fields).toEqual(
      expect.arrayContaining([
        "session_key",
        "purpose",
        "default_account_id",
        "fallback_url",
        "status",
        "expires_at",
      ]),
    );
    expect(SDKWORK_PLATFORM_DOMAIN_MODELS.find((model) => model.name === "qrAuthScan")?.fields).toEqual(
      expect.arrayContaining(["session_id", "account_id", "entry_id", "external_user_id", "scan_source"]),
    );
    expect(SDKWORK_PLATFORM_DOMAIN_MODELS.find((model) => model.name === "qrAuthEvent")?.fields).toEqual(
      expect.arrayContaining(["session_id", "event_type", "delivery_id", "conversation_id", "message_id"]),
    );
    expect(SDKWORK_PLATFORM_DOMAIN_MODELS.find((model) => model.name === "qrAuthLog")?.fields).toEqual(
      expect.arrayContaining(["session_id", "actor_type", "event_type", "result", "created_at"]),
    );

    for (const model of SDKWORK_PLATFORM_DOMAIN_MODELS.filter((model) => model.name.toString().startsWith("qrAuth"))) {
      expect(model.fields).not.toContain("password_hash");
      expect(model.fields).not.toContain("access_token");
      expect(model.fields).not.toContain("refresh_token");
    }
  });

  it("defines QR auth API paths for creation, status, client events, scans, and webhook completion", () => {
    expect(SDKWORK_PLATFORM_API_ROUTES.app.openPlatform.qrAuth.sessions.create.path).toBe(
      "/app/v3/api/open_platform/qr_auth/sessions",
    );
    expect(SDKWORK_PLATFORM_API_ROUTES.app.openPlatform.qrAuth.sessions.retrieve.path).toBe(
      "/app/v3/api/open_platform/qr_auth/sessions/{sessionKey}",
    );
    expect(SDKWORK_PLATFORM_API_ROUTES.app.openPlatform.qrAuth.sessions.events.list.path).toBe(
      "/app/v3/api/open_platform/qr_auth/sessions/{sessionKey}/events",
    );
    expect(SDKWORK_PLATFORM_API_ROUTES.app.openPlatform.qrAuth.sessions.passwords.create.path).toBe(
      "/app/v3/api/open_platform/qr_auth/sessions/{sessionKey}/passwords",
    );
    expect(SDKWORK_PLATFORM_API_ROUTES.app.openPlatform.qrAuth.sessions.scans.create.path).toBe(
      "/app/v3/api/open_platform/qr_auth/sessions/{sessionKey}/scans",
    );
    expect(SDKWORK_PLATFORM_API_ROUTES.backend.openPlatform.qrAuth.sessions.complete.path).toBe(
      "/backend/v3/api/open_platform/qr_auth/sessions/{sessionKey}/completions",
    );
    expect(SDKWORK_PLATFORM_API_ROUTES.backend.openPlatform.qrAuth.sessions.webhooks.create.path).toBe(
      "/backend/v3/api/open_platform/qr_auth/sessions/{sessionKey}/webhooks",
    );

    const operationIds = Object.values(SDKWORK_PLATFORM_OPERATION_IDS).map((operation) => operation.operationId);
    expect(operationIds).toEqual(
      expect.arrayContaining([
        "qrAuth.sessions.create",
        "qrAuth.sessions.retrieve",
        "qrAuth.sessions.events.list",
        "qrAuth.sessions.passwords.create",
        "qrAuth.sessions.scans.create",
        "qrAuth.sessions.complete",
        "qrAuth.sessions.webhooks.create",
        "qrAuth.sessions.logs.list",
      ]),
    );
  });

  it("publishes QR auth SDK methods and policy for fallback URL and default account selection", () => {
    expect(SDKWORK_PLATFORM_APP_SDK_REQUIRED_METHODS).toEqual(
      expect.arrayContaining([
        "openPlatform.qrAuth.sessions.create",
        "openPlatform.qrAuth.sessions.retrieve",
        "openPlatform.qrAuth.sessions.events.list",
        "openPlatform.qrAuth.sessions.passwords.create",
        "openPlatform.qrAuth.sessions.scans.create",
      ]),
    );
    expect(SDKWORK_PLATFORM_BACKEND_SDK_REQUIRED_METHODS).toEqual(
      expect.arrayContaining([
        "openPlatform.qrAuth.sessions.complete",
        "openPlatform.qrAuth.sessions.webhooks.create",
        "openPlatform.qrAuth.sessions.logs.list",
      ]),
    );

    expect(SDKWORK_PLATFORM_QR_AUTH_POLICY).toEqual({
      defaultEntryOnly: true,
      fallbackUrlWhenNoAccount: true,
      passwordFallback: true,
      frontendStatusModes: ["poll", "event_stream"],
      sessionTtlSeconds: 300,
      scanLogRequired: true,
      webhookCompletionRequired: true,
      iamTokenIssuer: "@sdkwork/iam",
      qrContentModes: ["fallback_url", "official_account_entry", "mini_app_url"],
    });
    expect(createPlatformQrAuthPolicy()).toEqual(SDKWORK_PLATFORM_QR_AUTH_POLICY);
  });
});

function createClient(methods: readonly string[]) {
  const root: Record<string, any> = {};
  for (const method of methods) {
    let node = root;
    const segments = method.split(".");
    for (const segment of segments.slice(0, -1)) {
      node[segment] ??= {};
      node = node[segment];
    }
    node[segments.at(-1)!] = vi.fn();
  }
  return root;
}
