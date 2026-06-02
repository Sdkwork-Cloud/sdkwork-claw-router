import { describe, expect, it, vi } from "vitest";

import {
  SDKWORK_CONVERSATION_API_ROUTES,
  SDKWORK_CONVERSATION_APP_SDK_REQUIRED_METHODS,
  SDKWORK_CONVERSATION_BACKEND_SDK_REQUIRED_METHODS,
  SDKWORK_CONVERSATION_CAPABILITIES,
  SDKWORK_CONVERSATION_DOMAIN_MODELS,
  SDKWORK_CONVERSATION_MESSAGE_CHANNELS,
  SDKWORK_CONVERSATION_OPERATION_IDS,
  SDKWORK_CONVERSATION_ROLES,
  SDKWORK_CONVERSATION_STANDARD,
  SDKWORK_CONVERSATION_TABLES,
  assertConversationAppSdkClient,
  assertConversationBackendSdkClient,
  createConversationPolicy,
  getConversationSdkSurface,
} from "../src/index";

describe("SDKWork conversation standard", () => {
  it("defines conversation as the shared message system for platform and support dialogs", () => {
    expect(SDKWORK_CONVERSATION_STANDARD.domain).toBe("conversation");
    expect(SDKWORK_CONVERSATION_STANDARD.architecture).toBe("common");
    expect(SDKWORK_CONVERSATION_STANDARD.api.appPrefix).toBe("/app/v3/api");
    expect(SDKWORK_CONVERSATION_STANDARD.api.backendPrefix).toBe("/backend/v3/api");
    expect(SDKWORK_CONVERSATION_STANDARD.sdkNamespaces).toEqual(["conversations"]);
    expect(SDKWORK_CONVERSATION_STANDARD.acceptedSources).toEqual(
      expect.arrayContaining(["open_platform", "customer_service", "agent", "user", "system"]),
    );
    expect(SDKWORK_CONVERSATION_MESSAGE_CHANNELS).toEqual(
      expect.arrayContaining(["official_account", "mini_app", "web", "customer_service"]),
    );
    expect(SDKWORK_CONVERSATION_ROLES).toEqual(
      expect.arrayContaining(["user", "assistant", "support", "system"]),
    );
  });

  it("uses /conversations paths and never creates a chat or support API root", () => {
    expect(SDKWORK_CONVERSATION_API_ROUTES.app.conversations.messages.list.path).toBe(
      "/app/v3/api/conversations/{conversationId}/messages",
    );
    expect(SDKWORK_CONVERSATION_API_ROUTES.app.conversations.turns.create.path).toBe(
      "/app/v3/api/conversations/{conversationId}/turns",
    );
    expect(SDKWORK_CONVERSATION_API_ROUTES.backend.conversations.externalLinks.create.path).toBe(
      "/backend/v3/api/conversations/{conversationId}/external_links",
    );

    const paths = Object.values(SDKWORK_CONVERSATION_OPERATION_IDS).map((operation) => operation.path);
    expect(paths).toEqual(
      expect.arrayContaining([
        "/app/v3/api/conversations",
        "/app/v3/api/conversations/{conversationId}",
        "/app/v3/api/conversations/{conversationId}/messages",
        "/app/v3/api/conversations/{conversationId}/turns",
        "/app/v3/api/conversations/{conversationId}/turns/{turnId}/response",
        "/backend/v3/api/conversations",
        "/backend/v3/api/conversations/{conversationId}/messages",
        "/backend/v3/api/conversations/{conversationId}/external_links",
      ]),
    );

    for (const path of paths) {
      expect(path).toMatch(/^\/(app|backend)\/v3\/api\//);
      expect(path).not.toContain("/chat/");
      expect(path).not.toContain("/support");
      expect(path).not.toContain("/threads");

      const staticSegments = path
        .split("/")
        .filter((segment) => segment && !segment.startsWith("{") && !["app", "backend", "v3", "api"].includes(segment));
      for (const segment of staticSegments) {
        expect(segment).toMatch(/^[a-z0-9_]+$/);
      }
    }
  });

  it("uses resource-tree operationIds and conversation SDK root", () => {
    const operationIds = Object.values(SDKWORK_CONVERSATION_OPERATION_IDS).map((operation) => operation.operationId);
    expect(operationIds).toEqual(
      expect.arrayContaining([
        "conversations.list",
        "conversations.create",
        "conversations.retrieve",
        "conversations.update",
        "conversations.delete",
        "conversations.messages.list",
        "conversations.messages.create",
        "conversations.turns.create",
        "conversations.turns.retrieve",
        "conversations.turns.response.create",
        "conversations.externalLinks.create",
        "conversations.handoffs.create",
      ]),
    );

    for (const retired of [
      "chat.conversations.list",
      "conversationMessages.list",
      "conversationTurns.create",
      "supportSessions.list",
      "supportMessages.list",
    ]) {
      expect(operationIds).not.toContain(retired);
    }

    expect(SDKWORK_CONVERSATION_APP_SDK_REQUIRED_METHODS).toEqual(
      expect.arrayContaining([
        "conversations.messages.list",
        "conversations.messages.create",
        "conversations.turns.create",
        "conversations.turns.response.create",
      ]),
    );
    expect(SDKWORK_CONVERSATION_BACKEND_SDK_REQUIRED_METHODS).toEqual(
      expect.arrayContaining([
        "conversations.messages.list",
        "conversations.externalLinks.create",
        "conversations.handoffs.create",
      ]),
    );
  });

  it("defines neutral conversation tables for public-account messages and customer-service replies", () => {
    expect(SDKWORK_CONVERSATION_TABLES).toEqual({
      conversation: "conversation",
      conversationExternal: "conversation_external",
      item: "conversation_item",
      message: "conversation_message",
      messageExternal: "conversation_message_external",
      messagePart: "conversation_message_part",
      turn: "conversation_turn",
    });

    for (const tableName of Object.values(SDKWORK_CONVERSATION_TABLES)) {
      expect(tableName).toMatch(/^(conversation|conversation_[a-z0-9_]+)$/);
      expect(tableName).not.toContain("ai_chat");
      expect(tableName).not.toContain("support");
    }

    expect(SDKWORK_CONVERSATION_DOMAIN_MODELS.find((model) => model.name === "message")?.fields).toEqual(
      expect.arrayContaining(["role", "source", "channel", "conversation_id", "turn_id"]),
    );
    const messagePartFields = SDKWORK_CONVERSATION_DOMAIN_MODELS.find((model) => model.name === "messagePart")?.fields ?? [];
    expect(messagePartFields).toEqual(
      expect.arrayContaining([
        "media_resource_id",
        "media_resource_snapshot",
        "media_role",
        "object_blob_id",
        "part_type",
      ]),
    );
    expect(messagePartFields).not.toEqual(
      expect.arrayContaining(["attachment_url", "media_url", "object_key", "url"]),
    );
    expect(SDKWORK_CONVERSATION_DOMAIN_MODELS.find((model) => model.name === "conversationExternal")?.fields).toEqual(
      expect.arrayContaining(["provider", "account_id", "external_user_id"]),
    );
  });

  it("assigns every operation to conversation capabilities", () => {
    const operationKeys = Object.keys(SDKWORK_CONVERSATION_OPERATION_IDS).sort();
    const capabilityOperationKeys = SDKWORK_CONVERSATION_CAPABILITIES.flatMap((capability) => capability.operations).sort();

    expect(SDKWORK_CONVERSATION_CAPABILITIES.map((capability) => capability.name)).toEqual([
      "conversation",
      "turn",
      "message",
      "externalIdentity",
      "handoff",
    ]);
    expect(capabilityOperationKeys).toEqual(operationKeys);
  });

  it("accepts official account and customer-service messages through the same conversation policy", () => {
    expect(createConversationPolicy()).toEqual({
      canonicalUnit: "conversation",
      externalIdentityTable: "conversation_external",
      messageTable: "conversation_message",
      turnTable: "conversation_turn",
      allowedExternalSources: ["open_platform"],
      customerServiceRole: "support",
      officialAccountChannel: "official_account",
      requireTenantIsolation: true,
      supportSessionTable: null,
      supportMessageTable: null,
    });
  });

  it("accepts generated SDK clients without a chat root or support aliases", () => {
    const appClient = createClient(SDKWORK_CONVERSATION_APP_SDK_REQUIRED_METHODS);
    const backendClient = createClient(SDKWORK_CONVERSATION_BACKEND_SDK_REQUIRED_METHODS);

    expect(() => assertConversationAppSdkClient(appClient)).not.toThrow();
    expect(() => assertConversationBackendSdkClient(backendClient)).not.toThrow();
    expect(getConversationSdkSurface(appClient)).toContain("conversations.turns.response.create");

    expect(() =>
      assertConversationAppSdkClient({
        ...appClient,
        chat: {
          conversations: {
            messages: { list: vi.fn() },
          },
        },
      }),
    ).toThrow(/retired.*chat/i);

    expect(() =>
      assertConversationBackendSdkClient({
        ...backendClient,
        supportMessages: { list: vi.fn() },
      }),
    ).toThrow(/retired.*supportMessages/i);
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
