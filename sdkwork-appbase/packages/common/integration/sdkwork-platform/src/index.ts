import { SDKWORK_CONVERSATION_TABLES } from "@sdkwork/conversation";

import type {
  PlatformAccountType,
  PlatformCap,
  PlatformCapabilityName,
  PlatformEntryType,
  PlatformHookMode,
  PlatformOperationMethod,
  PlatformOperationSecurity,
  PlatformPayMode,
  PlatformPayScene,
  PlatformProvider,
  PlatformQrAuthPurpose,
  PlatformQrAuthStatus,
  PlatformSdkNamespace,
} from "./platform-types";

export type {
  PlatformAccountType,
  PlatformCap,
  PlatformCapabilityName,
  PlatformEntryType,
  PlatformHookMode,
  PlatformOperationMethod,
  PlatformOperationSecurity,
  PlatformPayMode,
  PlatformPayScene,
  PlatformProvider,
  PlatformQrAuthPurpose,
  PlatformQrAuthStatus,
  PlatformSdkNamespace,
} from "./platform-types";
export * from "./account-config-service";
export * from "./qr-auth-service";

export type PlatformDomainModelName = keyof typeof SDKWORK_PLATFORM_TABLES;

export interface PlatformOperationContract {
  apiSurface: "app" | "backend";
  method: PlatformOperationMethod;
  operationId: string;
  operationKey: string;
  path: string;
  queryParameters?: readonly string[];
  security: PlatformOperationSecurity;
  tag: PlatformSdkNamespace;
}

export interface PlatformDomainModelContract {
  capabilities: readonly PlatformCapabilityName[];
  domain: "platform";
  fields: readonly string[];
  name: PlatformDomainModelName;
  table: (typeof SDKWORK_PLATFORM_TABLES)[PlatformDomainModelName];
}

export interface PlatformCapabilityContract {
  domain: "platform";
  models: readonly PlatformDomainModelName[];
  name: PlatformCapabilityName;
  operations: readonly string[];
  sdkNamespaces: readonly PlatformSdkNamespace[];
}

export interface PlatformSecretSlot {
  name: "aesKey" | "appId" | "appSecret" | "certificate" | "token";
  required: boolean;
}

export interface PlatformReplySpec {
  customer: boolean;
  passive: boolean;
  passiveDeadlineMs: number;
  passiveSafetyMs: number;
  payloadFormats: readonly ("json" | "text" | "xml")[];
}

export interface PlatformWindowSpec {
  durationSeconds: number;
  type: "customer" | "notice" | "passive";
}

export interface PlatformMenuSpec {
  publish: boolean;
  maxDepth: number;
  maxItems: number;
}

export interface PlatformNoticeSpec {
  mode: "subscription" | "template";
  requiresUserConsent: boolean;
}

export interface PlatformPaySpec {
  mode: PlatformPayMode;
  scenes: readonly PlatformPayScene[];
}

export interface PlatformConfigSchema {
  properties: Record<string, { required?: boolean; type: "boolean" | "number" | "string" }>;
  required: readonly string[];
}

export interface PlatformProviderManifest {
  caps: readonly PlatformCap[];
  entries: readonly PlatformEntryType[];
  events: readonly string[];
  hooks: readonly PlatformHookMode[];
  key: string;
  menus?: PlatformMenuSpec;
  notices?: readonly PlatformNoticeSpec[];
  pays?: readonly PlatformPaySpec[];
  provider: PlatformProvider;
  replies: PlatformReplySpec;
  schema: PlatformConfigSchema;
  secrets: readonly PlatformSecretSlot[];
  type: PlatformAccountType;
  version: string;
  windows?: readonly PlatformWindowSpec[];
}

export interface CreatePlatformProviderManifestInput {
  key: string;
  provider: PlatformProvider;
  type: PlatformAccountType;
  version: string;
}

export interface PlatformConversationBridge {
  assistantReply: {
    channel: "official_account";
    role: "assistant";
    source: "agent";
  };
  conversationPackage: "@sdkwork/conversation";
  customerServiceReply: {
    channel: "customer_service";
    role: "support";
    source: "customer_service";
  };
  externalIdentityTable: "conversation_external";
  inboundOfficialAccountMessage: {
    channel: "official_account";
    role: "user";
    source: "open_platform";
  };
  messageTable: "conversation_message";
  supportMessageTable: null;
  supportSessionTable: null;
}

export interface PlatformConversationPolicy {
  conversationBridge: PlatformConversationBridge;
  deliveryCreatesConversationEvent: boolean;
  eventLinksConversationMessage: boolean;
  outboxSendsConversationMessage: boolean;
  windowControlsExternalDeliveryOnly: boolean;
}

export type PlatformSdkResponse<T> = Promise<T | { code?: number | string; data?: T; message?: string; msg?: string }>;
export type PlatformSdkMethod = (...args: any[]) => PlatformSdkResponse<any>;

export interface PlatformSdkConversationBoundary {
  conversationPackage: "@sdkwork/conversation";
  customerServiceReplyMethod: "conversations.messages.create";
  forbiddenOpenPlatformMethods: readonly [
    "openPlatform.customerServiceMessages.create",
    "openPlatform.supportMessages.create",
    "openPlatform.supportSessions.create",
  ];
  officialAccountInboundMethod: "conversations.messages.create";
  openPlatformDeliveryAttemptMethod: "openPlatform.outbox.attempts.create";
}

export interface PlatformQrAuthPolicy {
  defaultEntryOnly: boolean;
  fallbackUrlWhenNoAccount: boolean;
  frontendStatusModes: readonly ["poll", "event_stream"];
  iamTokenIssuer: "@sdkwork/iam";
  passwordFallback: boolean;
  qrContentModes: readonly ["fallback_url", "official_account_entry", "mini_app_url"];
  scanLogRequired: boolean;
  sessionTtlSeconds: number;
  webhookCompletionRequired: boolean;
}

type MethodTree = {
  readonly [key: string]: true | MethodTree;
};

type ClientFromMethodTree<TTree extends MethodTree> = {
  readonly [TKey in keyof TTree]: TTree[TKey] extends true
    ? PlatformSdkMethod
    : TTree[TKey] extends MethodTree
      ? ClientFromMethodTree<TTree[TKey]>
      : never;
};

export const SDKWORK_PLATFORM_STANDARD = {
  api: {
    appPrefix: "/app/v3/api",
    backendPrefix: "/backend/v3/api",
    openapi: "3.1.2",
  },
  apiNamespace: "open_platform",
  architecture: "common",
  databasePrefix: "open_platform",
  domain: "platform",
  packageName: "@sdkwork/platform",
  providers: ["wechat", "alipay", "douyin", "baidu", "kuaishou", "feishu"],
  sdkNamespaces: ["openPlatform"],
} as const;

export const SDKWORK_PLATFORM_TABLES = {
  account: "open_platform_account",
  delivery: "open_platform_delivery",
  entry: "open_platform_entry",
  event: "open_platform_event",
  hook: "open_platform_hook",
  log: "open_platform_log",
  manifest: "open_platform_manifest",
  menu: "open_platform_menu",
  menuPublish: "open_platform_menu_publish",
  notice: "open_platform_notice",
  noticeAttempt: "open_platform_notice_attempt",
  noticeTemplate: "open_platform_notice_template",
  outbox: "open_platform_outbox",
  outboxAttempt: "open_platform_outbox_attempt",
  payBinding: "open_platform_pay_binding",
  provider: "open_platform_provider",
  qrAuthEvent: "open_platform_qr_auth_event",
  qrAuthLog: "open_platform_qr_auth_log",
  qrAuthScan: "open_platform_qr_auth_scan",
  qrAuthSession: "open_platform_qr_auth_session",
  window: "open_platform_window",
} as const;

export const SDKWORK_PLATFORM_CONVERSATION_BRIDGE = {
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
  externalIdentityTable: SDKWORK_CONVERSATION_TABLES.conversationExternal,
  messageTable: SDKWORK_CONVERSATION_TABLES.message,
  supportMessageTable: null,
  supportSessionTable: null,
} as const satisfies PlatformConversationBridge;

export const SDKWORK_PLATFORM_QR_AUTH_POLICY = {
  defaultEntryOnly: true,
  fallbackUrlWhenNoAccount: true,
  passwordFallback: true,
  frontendStatusModes: ["poll", "event_stream"],
  sessionTtlSeconds: 300,
  scanLogRequired: true,
  webhookCompletionRequired: true,
  iamTokenIssuer: "@sdkwork/iam",
  qrContentModes: ["fallback_url", "official_account_entry", "mini_app_url"],
} as const satisfies PlatformQrAuthPolicy;

const app = SDKWORK_PLATFORM_STANDARD.api.appPrefix;
const backend = SDKWORK_PLATFORM_STANDARD.api.backendPrefix;

export const SDKWORK_PLATFORM_API_ROUTES = {
  app: {
    openPlatform: {
      entries: {
        retrieve: operation("GET", `${app}/open_platform/entries/{entryKey}`, "entries.retrieve", undefined, "public"),
        visits: {
          create: operation("POST", `${app}/open_platform/entries/{entryKey}/visits`, "entries.visits.create"),
        },
      },
      hooks: {
        verify: operation("GET", `${app}/open_platform/hooks/{hookKey}/verify`, "hooks.verify", undefined, "public"),
        deliveries: {
          create: operation(
            "POST",
            `${app}/open_platform/hooks/{hookKey}/deliveries`,
            "hooks.deliveries.create",
            undefined,
            "public",
          ),
        },
      },
      qrAuth: {
        sessions: {
          create: operation("POST", `${app}/open_platform/qr_auth/sessions`, "qrAuth.sessions.create"),
          retrieve: operation("GET", `${app}/open_platform/qr_auth/sessions/{sessionKey}`, "qrAuth.sessions.retrieve"),
          events: {
            list: operation(
              "GET",
              `${app}/open_platform/qr_auth/sessions/{sessionKey}/events`,
              "qrAuth.sessions.events.list",
              ["cursor"],
            ),
          },
          passwords: {
            create: operation(
              "POST",
              `${app}/open_platform/qr_auth/sessions/{sessionKey}/passwords`,
              "qrAuth.sessions.passwords.create",
            ),
          },
          scans: {
            create: operation(
              "POST",
              `${app}/open_platform/qr_auth/sessions/{sessionKey}/scans`,
              "qrAuth.sessions.scans.create",
            ),
          },
        },
      },
    },
  },
  backend: {
    openPlatform: {
      providers: {
        list: operation("GET", `${backend}/open_platform/providers`, "providers.list", ["status"]),
      },
      manifests: {
        list: operation("GET", `${backend}/open_platform/manifests`, "manifests.list", ["provider", "type"]),
      },
      accounts: {
        list: operation("GET", `${backend}/open_platform/accounts`, "accounts.list", [
          "provider",
          "type",
          "status",
          "page",
          "page_size",
        ]),
        create: operation("POST", `${backend}/open_platform/accounts`, "accounts.create"),
        retrieve: operation("GET", `${backend}/open_platform/accounts/{accountId}`, "accounts.retrieve"),
        update: operation("PATCH", `${backend}/open_platform/accounts/{accountId}`, "accounts.update"),
        delete: operation("DELETE", `${backend}/open_platform/accounts/{accountId}`, "accounts.delete"),
        entries: {
          list: operation("GET", `${backend}/open_platform/accounts/{accountId}/entries`, "accounts.entries.list"),
          create: operation("POST", `${backend}/open_platform/accounts/{accountId}/entries`, "accounts.entries.create"),
          update: operation(
            "PATCH",
            `${backend}/open_platform/accounts/{accountId}/entries/{entryId}`,
            "accounts.entries.update",
          ),
          delete: operation(
            "DELETE",
            `${backend}/open_platform/accounts/{accountId}/entries/{entryId}`,
            "accounts.entries.delete",
          ),
        },
        hooks: {
          list: operation("GET", `${backend}/open_platform/accounts/{accountId}/hooks`, "accounts.hooks.list"),
          create: operation("POST", `${backend}/open_platform/accounts/{accountId}/hooks`, "accounts.hooks.create"),
          update: operation(
            "PATCH",
            `${backend}/open_platform/accounts/{accountId}/hooks/{hookId}`,
            "accounts.hooks.update",
          ),
          delete: operation(
            "DELETE",
            `${backend}/open_platform/accounts/{accountId}/hooks/{hookId}`,
            "accounts.hooks.delete",
          ),
        },
        menus: {
          list: operation("GET", `${backend}/open_platform/accounts/{accountId}/menus`, "accounts.menus.list"),
          create: operation("POST", `${backend}/open_platform/accounts/{accountId}/menus`, "accounts.menus.create"),
        },
        payBindings: {
          list: operation(
            "GET",
            `${backend}/open_platform/accounts/{accountId}/pay_bindings`,
            "accounts.payBindings.list",
          ),
          create: operation(
            "POST",
            `${backend}/open_platform/accounts/{accountId}/pay_bindings`,
            "accounts.payBindings.create",
          ),
          delete: operation(
            "DELETE",
            `${backend}/open_platform/accounts/{accountId}/pay_bindings/{bindingId}`,
            "accounts.payBindings.delete",
          ),
        },
      },
      deliveries: {
        list: operation("GET", `${backend}/open_platform/deliveries`, "deliveries.list", ["account_id", "status"]),
        retrieve: operation("GET", `${backend}/open_platform/deliveries/{deliveryId}`, "deliveries.retrieve"),
        replays: {
          create: operation("POST", `${backend}/open_platform/deliveries/{deliveryId}/replays`, "deliveries.replays.create"),
        },
      },
      events: {
        list: operation("GET", `${backend}/open_platform/events`, "events.list", ["account_id", "event_type"]),
        retrieve: operation("GET", `${backend}/open_platform/events/{eventId}`, "events.retrieve"),
      },
      windows: {
        list: operation("GET", `${backend}/open_platform/windows`, "windows.list", ["account_id", "external_user_id"]),
        update: operation("PATCH", `${backend}/open_platform/windows/{windowId}`, "windows.update"),
      },
      outbox: {
        list: operation("GET", `${backend}/open_platform/outbox`, "outbox.list", ["account_id", "status"]),
        retrieve: operation("GET", `${backend}/open_platform/outbox/{outboxId}`, "outbox.retrieve"),
        attempts: {
          create: operation("POST", `${backend}/open_platform/outbox/{outboxId}/attempts`, "outbox.attempts.create"),
        },
      },
      menus: {
        list: operation("GET", `${backend}/open_platform/menus`, "menus.list", ["account_id", "status"]),
        publishes: {
          create: operation("POST", `${backend}/open_platform/menus/{menuId}/publishes`, "menus.publishes.create"),
        },
      },
      noticeTemplates: {
        list: operation("GET", `${backend}/open_platform/notice_templates`, "noticeTemplates.list", [
          "account_id",
          "status",
        ]),
      },
      notices: {
        list: operation("GET", `${backend}/open_platform/notices`, "notices.list", ["account_id", "status"]),
        create: operation("POST", `${backend}/open_platform/notices`, "notices.create"),
        attempts: {
          create: operation("POST", `${backend}/open_platform/notices/{noticeId}/attempts`, "notices.attempts.create"),
        },
      },
      logs: {
        list: operation("GET", `${backend}/open_platform/logs`, "logs.list", ["account_id", "level", "page", "page_size"]),
      },
      qrAuth: {
        sessions: {
          list: operation("GET", `${backend}/open_platform/qr_auth/sessions`, "qrAuth.sessions.list", [
            "purpose",
            "status",
            "page",
            "page_size",
          ]),
          complete: operation(
            "POST",
            `${backend}/open_platform/qr_auth/sessions/{sessionKey}/completions`,
            "qrAuth.sessions.complete",
          ),
          webhooks: {
            create: operation(
              "POST",
              `${backend}/open_platform/qr_auth/sessions/{sessionKey}/webhooks`,
              "qrAuth.sessions.webhooks.create",
            ),
          },
          logs: {
            list: operation(
              "GET",
              `${backend}/open_platform/qr_auth/sessions/{sessionKey}/logs`,
              "qrAuth.sessions.logs.list",
            ),
          },
        },
      },
    },
  },
} as const;

export const SDKWORK_PLATFORM_OPERATION_IDS = flattenOperations(SDKWORK_PLATFORM_API_ROUTES);

export const SDKWORK_PLATFORM_DOMAIN_MODELS = [
  model("provider", ["provider"], ["id", "tenant_id", "organization_id", "provider", "name", "status", "created_at", "updated_at"]),
  model("manifest", ["provider"], ["id", "tenant_id", "organization_id", "provider", "account_type", "manifest_key", "version", "schema_json", "status", "created_at", "updated_at"]),
  model("account", ["account"], ["id", "tenant_id", "organization_id", "provider", "account_type", "account_key", "name", "app_id", "secret_ref", "token_ref", "aes_key_ref", "default_entry_id", "qr_default", "status", "created_at", "updated_at"]),
  model("entry", ["entry"], ["id", "tenant_id", "organization_id", "account_id", "entry_key", "entry_type", "target_url", "status", "created_at", "updated_at"]),
  model("hook", ["hook"], ["id", "tenant_id", "organization_id", "account_id", "hook_key", "mode", "secret_ref", "status", "created_at", "updated_at"]),
  model("delivery", ["delivery", "hook"], ["id", "tenant_id", "organization_id", "account_id", "hook_id", "delivery_no", "signature_status", "processing_status", "raw_body_ref", "created_at", "updated_at"]),
  model("event", ["event", "delivery"], ["id", "tenant_id", "organization_id", "delivery_id", "account_id", "event_type", "external_user_id", "conversation_id", "message_id", "created_at"]),
  model("window", ["window"], ["id", "tenant_id", "organization_id", "account_id", "external_user_id", "window_type", "opens_at", "expires_at", "status", "created_at", "updated_at"]),
  model("outbox", ["outbox"], ["id", "tenant_id", "organization_id", "account_id", "conversation_id", "message_id", "external_user_id", "mode", "status", "created_at", "updated_at"]),
  model("outboxAttempt", ["outbox"], ["id", "tenant_id", "organization_id", "outbox_id", "attempt_no", "provider_status", "provider_error_code", "created_at"]),
  model("menu", ["menu"], ["id", "tenant_id", "organization_id", "account_id", "menu_key", "name", "payload_json", "status", "created_at", "updated_at"]),
  model("menuPublish", ["menu"], ["id", "tenant_id", "organization_id", "menu_id", "publish_no", "status", "provider_revision", "created_at", "updated_at"]),
  model("noticeTemplate", ["notice"], ["id", "tenant_id", "organization_id", "account_id", "template_key", "provider_template_id", "status", "created_at", "updated_at"]),
  model("notice", ["notice"], ["id", "tenant_id", "organization_id", "account_id", "template_id", "recipient_external_user_id", "payload_json", "status", "created_at", "updated_at"]),
  model("noticeAttempt", ["notice"], ["id", "tenant_id", "organization_id", "notice_id", "attempt_no", "provider_status", "provider_error_code", "created_at"]),
  model("payBinding", ["pay"], ["id", "tenant_id", "organization_id", "account_id", "payment_account_id", "payment_channel_id", "scene", "mode", "status", "created_at", "updated_at"]),
  model("log", ["log"], ["id", "tenant_id", "organization_id", "account_id", "level", "operation_id", "source_type", "source_id", "created_at"]),
  model("qrAuthSession", ["qrAuth"], [
    "id",
    "tenant_id",
    "organization_id",
    "session_key",
    "purpose",
    "default_provider",
    "default_account_type",
    "default_account_id",
    "default_entry_id",
    "qr_mode",
    "qr_content",
    "fallback_url",
    "status",
    "scanned_at",
    "expires_at",
    "completed_at",
    "created_at",
    "updated_at",
  ]),
  model("qrAuthScan", ["qrAuth"], [
    "id",
    "tenant_id",
    "organization_id",
    "session_id",
    "account_id",
    "entry_id",
    "external_user_id",
    "scan_source",
    "user_agent",
    "ip_hash",
    "created_at",
  ]),
  model("qrAuthEvent", ["qrAuth"], [
    "id",
    "tenant_id",
    "organization_id",
    "session_id",
    "event_type",
    "delivery_id",
    "conversation_id",
    "message_id",
    "payload_json",
    "created_at",
  ]),
  model("qrAuthLog", ["qrAuth"], [
    "id",
    "tenant_id",
    "organization_id",
    "session_id",
    "actor_type",
    "actor_id",
    "event_type",
    "result",
    "created_at",
  ]),
] as const satisfies readonly PlatformDomainModelContract[];

export const SDKWORK_PLATFORM_CAPABILITIES = [
  capability("provider", ["provider", "manifest"], operationsMatching(/^backend\.(providers|manifests)\./)),
  capability("account", ["account"], operationsMatching(/^backend\.accounts\.(list|create|retrieve|update|delete)$/)),
  capability("entry", ["entry"], operationsMatching(/^(app\.entries|backend\.accounts\.entries)\./)),
  capability("hook", ["hook"], operationsMatching(/^(app\.hooks|backend\.accounts\.hooks)\./)),
  capability("delivery", ["delivery"], operationsMatching(/^backend\.deliveries\./)),
  capability("event", ["event"], operationsMatching(/^backend\.events\./)),
  capability("window", ["window"], operationsMatching(/^backend\.windows\./)),
  capability("outbox", ["outbox", "outboxAttempt"], operationsMatching(/^backend\.outbox\./)),
  capability("menu", ["menu", "menuPublish"], operationsMatching(/^backend\.(accounts\.menus|menus)\./)),
  capability("notice", ["noticeTemplate", "notice", "noticeAttempt"], operationsMatching(/^backend\.(noticeTemplates|notices)\./)),
  capability("pay", ["payBinding"], operationsMatching(/^backend\.accounts\.payBindings\./)),
  capability("log", ["log"], operationsMatching(/^backend\.logs\./)),
  capability("qrAuth", ["qrAuthSession", "qrAuthScan", "qrAuthEvent", "qrAuthLog"], operationsMatching(/\bqrAuth\./)),
] as const satisfies readonly PlatformCapabilityContract[];

export const APP_PLATFORM_METHOD_TREE = {
  openPlatform: {
    entries: {
      retrieve: true,
      visits: {
        create: true,
      },
    },
    hooks: {
      verify: true,
      deliveries: {
        create: true,
      },
    },
    qrAuth: {
      sessions: {
        create: true,
        retrieve: true,
        events: {
          list: true,
        },
        passwords: {
          create: true,
        },
        scans: {
          create: true,
        },
      },
    },
  },
} as const satisfies MethodTree;

export const BACKEND_PLATFORM_METHOD_TREE = {
  openPlatform: {
    providers: { list: true },
    manifests: { list: true },
    accounts: {
      list: true,
      create: true,
      retrieve: true,
      update: true,
      delete: true,
      entries: { list: true, create: true, update: true, delete: true },
      hooks: { list: true, create: true, update: true, delete: true },
      menus: { list: true, create: true },
      payBindings: { list: true, create: true, delete: true },
    },
    deliveries: {
      list: true,
      retrieve: true,
      replays: { create: true },
    },
    events: {
      list: true,
      retrieve: true,
    },
    windows: {
      list: true,
      update: true,
    },
    outbox: {
      list: true,
      retrieve: true,
      attempts: { create: true },
    },
    menus: {
      list: true,
      publishes: { create: true },
    },
    noticeTemplates: { list: true },
    notices: {
      list: true,
      create: true,
      attempts: { create: true },
    },
    logs: { list: true },
    qrAuth: {
      sessions: {
        list: true,
        complete: true,
        webhooks: {
          create: true,
        },
        logs: {
          list: true,
        },
      },
    },
  },
} as const satisfies MethodTree;

export type PlatformAppSdkClient = ClientFromMethodTree<typeof APP_PLATFORM_METHOD_TREE>;
export type PlatformBackendSdkClient = ClientFromMethodTree<typeof BACKEND_PLATFORM_METHOD_TREE>;

export const SDKWORK_PLATFORM_APP_SDK_REQUIRED_METHODS = flattenRequiredMethods(APP_PLATFORM_METHOD_TREE);
export const SDKWORK_PLATFORM_BACKEND_SDK_REQUIRED_METHODS = flattenRequiredMethods(BACKEND_PLATFORM_METHOD_TREE);

export const SDKWORK_PLATFORM_SDK_CONVERSATION_BOUNDARY = {
  conversationPackage: "@sdkwork/conversation",
  customerServiceReplyMethod: "conversations.messages.create",
  officialAccountInboundMethod: "conversations.messages.create",
  openPlatformDeliveryAttemptMethod: "openPlatform.outbox.attempts.create",
  forbiddenOpenPlatformMethods: [
    "openPlatform.customerServiceMessages.create",
    "openPlatform.supportMessages.create",
    "openPlatform.supportSessions.create",
  ],
} as const satisfies PlatformSdkConversationBoundary;

const RETIRED_PLATFORM_RESOURCES = new Set([
  "accountEntries",
  "accountHooks",
  "accountPayBindings",
  "customerServiceMessages",
  "deliveryReplays",
  "menuPublishes",
  "noticeAttempts",
  "outboxAttempts",
  "supportMessages",
  "supportSessions",
  "wechat",
]);

export function createPlatformConversationPolicy(): PlatformConversationPolicy {
  return {
    deliveryCreatesConversationEvent: true,
    eventLinksConversationMessage: true,
    outboxSendsConversationMessage: true,
    windowControlsExternalDeliveryOnly: true,
    conversationBridge: SDKWORK_PLATFORM_CONVERSATION_BRIDGE,
  };
}

export function createPlatformQrAuthPolicy(): PlatformQrAuthPolicy {
  return SDKWORK_PLATFORM_QR_AUTH_POLICY;
}

export function createPlatformProviderManifest(input: CreatePlatformProviderManifestInput): PlatformProviderManifest {
  return {
    key: input.key,
    provider: input.provider,
    type: input.type,
    version: input.version,
    caps: ["account", "entry", "hook", "message", "reply", "window", "menu", "notice", "login", "pay"],
    secrets: [
      { name: "appId", required: true },
      { name: "appSecret", required: true },
      { name: "token", required: false },
      { name: "aesKey", required: false },
    ],
    entries: ["url", "qr", "mini_app_url"],
    hooks: ["verify", "receive"],
    events: ["message.text", "message.image", "subscribe", "unsubscribe", "menu.click", "notice.status"],
    replies: {
      passive: true,
      customer: true,
      passiveDeadlineMs: 5000,
      passiveSafetyMs: 700,
      payloadFormats: ["xml", "json", "text"],
    },
    windows: [
      {
        type: "customer",
        durationSeconds: 172800,
      },
    ],
    menus: {
      publish: true,
      maxDepth: 2,
      maxItems: 15,
    },
    notices: [
      {
        mode: "template",
        requiresUserConsent: true,
      },
      {
        mode: "subscription",
        requiresUserConsent: true,
      },
    ],
    pays: [
      {
        mode: "direct",
        scenes: ["official_account", "mini_app"],
      },
    ],
    schema: {
      required: ["appId", "appSecret"],
      properties: {
        appId: { type: "string", required: true },
        appSecretRef: { type: "string", required: true },
        encrypted: { type: "boolean", required: false },
        messageMode: { type: "string", required: false },
      },
    },
  };
}

export function assertPlatformAppSdkClient(client: unknown): asserts client is PlatformAppSdkClient {
  assertNoRetiredPlatformShape(client, "app");
  const missingMethods = findMissingMethods(getPlatformSdkSurface(client), SDKWORK_PLATFORM_APP_SDK_REQUIRED_METHODS);
  if (missingMethods.length > 0) {
    throw new Error(`Generated app platform SDK client is missing methods: ${missingMethods.join(", ")}`);
  }
}

export function assertPlatformBackendSdkClient(client: unknown): asserts client is PlatformBackendSdkClient {
  assertNoRetiredPlatformShape(client, "backend");
  const missingMethods = findMissingMethods(getPlatformSdkSurface(client), SDKWORK_PLATFORM_BACKEND_SDK_REQUIRED_METHODS);
  if (missingMethods.length > 0) {
    throw new Error(`Generated backend platform SDK client is missing methods: ${missingMethods.join(", ")}`);
  }
}

export function getPlatformSdkSurface(client: unknown): string[] {
  const methods: string[] = [];

  function visit(node: unknown, path: string[]) {
    if (!node || typeof node !== "object") {
      return;
    }

    for (const [key, value] of Object.entries(node)) {
      const next = [...path, key];
      if (typeof value === "function") {
        methods.push(next.join("."));
      } else {
        visit(value, next);
      }
    }
  }

  visit(client, []);
  return methods.sort();
}

function assertNoRetiredPlatformShape(client: unknown, surface: "app" | "backend"): void {
  const retiredResources = findRetiredPlatformResources(client);
  if (retiredResources.length > 0) {
    throw new Error(
      `Generated ${surface} platform SDK client exposes retired resources: ${retiredResources.join(", ")}. Use openPlatform resource-tree methods.`,
    );
  }
}

function findRetiredPlatformResources(client: unknown): string[] {
  if (!client || typeof client !== "object") {
    return [];
  }

  const matches: string[] = [];

  function visit(node: unknown, path: readonly string[]) {
    if (!node || typeof node !== "object") {
      return;
    }

    for (const [key, value] of Object.entries(node)) {
      const next = [...path, key];
      if (RETIRED_PLATFORM_RESOURCES.has(key)) {
        matches.push(next.join("."));
      }
      visit(value, next);
    }
  }

  visit(client, []);
  return matches.sort();
}

function operation(
  method: PlatformOperationMethod,
  path: string,
  operationId: string,
  queryParameters?: readonly string[],
  security?: PlatformOperationSecurity,
): PlatformOperationContract {
  const apiSurface = path.startsWith(`${backend}/`) ? "backend" : "app";
  return {
    apiSurface,
    method,
    operationId,
    operationKey: `${apiSurface}.${operationId}`,
    ...(queryParameters ? { queryParameters } : {}),
    path,
    security: security ?? (apiSurface === "backend" ? "adminToken" : "dualToken"),
    tag: "openPlatform",
  };
}

function model(
  name: PlatformDomainModelName,
  capabilities: readonly PlatformCapabilityName[],
  fields: readonly string[],
): PlatformDomainModelContract {
  return {
    capabilities,
    domain: "platform",
    fields,
    name,
    table: SDKWORK_PLATFORM_TABLES[name],
  };
}

function capability(
  name: PlatformCapabilityName,
  models: readonly PlatformDomainModelName[],
  operations: readonly string[],
): PlatformCapabilityContract {
  return {
    domain: "platform",
    models,
    name,
    operations,
    sdkNamespaces: ["openPlatform"],
  };
}

function operationsMatching(pattern: RegExp): string[] {
  return Object.keys(SDKWORK_PLATFORM_OPERATION_IDS)
    .filter((operationKey) => pattern.test(operationKey))
    .sort();
}

function findMissingMethods(surface: readonly string[], requiredMethods: readonly string[]): string[] {
  const surfaceSet = new Set(surface);
  return requiredMethods.filter((method) => !surfaceSet.has(method));
}

function flattenRequiredMethods(tree: MethodTree, path: readonly string[] = []): string[] {
  const methods: string[] = [];
  for (const [key, marker] of Object.entries(tree)) {
    const nextPath = [...path, key];
    if (marker === true) {
      methods.push(nextPath.join("."));
    } else {
      methods.push(...flattenRequiredMethods(marker, nextPath));
    }
  }
  return methods.sort();
}

function flattenOperations(value: unknown): Record<string, PlatformOperationContract> {
  const operations: PlatformOperationContract[] = [];

  function visit(node: unknown) {
    if (!node || typeof node !== "object") {
      return;
    }

    if ("operationId" in node && "path" in node) {
      operations.push(node as PlatformOperationContract);
      return;
    }

    for (const child of Object.values(node)) {
      visit(child);
    }
  }

  visit(value);
  return Object.fromEntries(
    operations
      .slice()
      .sort((left, right) => left.operationKey.localeCompare(right.operationKey))
      .map((operation) => [operation.operationKey, operation]),
  );
}
