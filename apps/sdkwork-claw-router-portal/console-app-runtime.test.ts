import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  clearStoredAppSessionToken,
  storeAppSessionFromResult,
} from "./packages/sdkwork-claw-router-commons/src/app-session-token.ts";
import { resetClawRouterSdkClients } from "./packages/sdkwork-claw-router-commons/src/sdk-clients.ts";
import { AccountService } from "./packages/sdkwork-claw-router-console-account/src/accountService.ts";
import { GatewayService } from "./packages/sdkwork-claw-router-console-gateway/src/gatewayService.ts";
import { NotificationService } from "./packages/sdkwork-claw-router-commons/src/notificationService.ts";
import { MessagesService } from "./packages/sdkwork-claw-router-console-messages/src/messagesService.ts";
import { UserService } from "./packages/sdkwork-claw-router-console-user/src/userService.ts";
import { ChatService } from "./packages/sdkwork-claw-router-playground/src/components/chat/chatService.ts";
import { PlaygroundService } from "./packages/sdkwork-claw-router-playground/src/playgroundService.ts";

const originalFetch = globalThis.fetch;
const originalWindowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");

function readPortalFile(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

type CapturedSdkRequest = {
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: unknown;
};

async function withAppSdkResponse<T>(
  responseBody: unknown,
  fn: (captured: CapturedSdkRequest[]) => Promise<T>,
  options: { authenticated?: boolean } = {},
): Promise<T> {
  const captured: CapturedSdkRequest[] = [];
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    enumerable: true,
    value: { dispatchEvent: () => true },
  });
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    captured.push({
      url,
      method: init?.method ?? "GET",
      headers: Object.fromEntries(new Headers(init?.headers).entries()),
      body: typeof init?.body === "string" ? JSON.parse(init.body) : undefined,
    });
    return new Response(JSON.stringify(responseBody), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }) as typeof fetch;
  clearStoredAppSessionToken();
  if (options.authenticated) {
    storeAppSessionFromResult({
      accessToken: "test-access-token",
      authToken: "test-auth-token",
      storedAt: 1,
    });
  }
  resetClawRouterSdkClients();

  try {
    return await fn(captured);
  } finally {
    clearStoredAppSessionToken();
    resetClawRouterSdkClients();
    globalThis.fetch = originalFetch;
    if (originalWindowDescriptor) {
      Object.defineProperty(globalThis, "window", originalWindowDescriptor);
    } else {
      delete (globalThis as { window?: Window }).window;
    }
  }
}

async function withAppSdkResponses<T>(
  responseBodies: unknown[],
  fn: (captured: CapturedSdkRequest[]) => Promise<T>,
  options: { authenticated?: boolean } = {},
): Promise<T> {
  const captured: CapturedSdkRequest[] = [];
  const responses = [...responseBodies];
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    enumerable: true,
    value: { dispatchEvent: () => true },
  });
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    captured.push({
      url,
      method: init?.method ?? "GET",
      headers: Object.fromEntries(new Headers(init?.headers).entries()),
      body: typeof init?.body === "string" ? JSON.parse(init.body) : undefined,
    });
    const responseBody = responses.shift();
    if (responseBody === undefined) {
      throw new Error(`Unexpected SDK request: ${init?.method ?? "GET"} ${url}`);
    }
    if (typeof responseBody === "string") {
      return new Response(responseBody, {
        status: 200,
        headers: { "content-type": "text/event-stream" },
      });
    }
    return new Response(JSON.stringify(responseBody), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }) as typeof fetch;
  clearStoredAppSessionToken();
  if (options.authenticated) {
    storeAppSessionFromResult({
      accessToken: "test-access-token",
      authToken: "test-auth-token",
      storedAt: 1,
    });
  }
  resetClawRouterSdkClients();

  try {
    const result = await fn(captured);
    assert.equal(responses.length, 0, "All queued SDK responses must be consumed");
    return result;
  } finally {
    clearStoredAppSessionToken();
    resetClawRouterSdkClients();
    globalThis.fetch = originalFetch;
    if (originalWindowDescriptor) {
      Object.defineProperty(globalThis, "window", originalWindowDescriptor);
    } else {
      delete (globalThis as { window?: Window }).window;
    }
  }
}

function createChatTestModel() {
  return {
    id: "gpt-4.1-mini",
    catalogKey: "openai/gpt-4.1-mini",
    model: "gpt-4.1-mini",
    name: "GPT-4.1 Mini",
    displayName: "GPT-4.1 Mini",
    desc: "OpenAI GPT-4.1 Mini",
    versionLabel: "4.1",
    ver: "4.1",
    vendorCode: "openai",
    vendorName: "OpenAI",
    modalities: ["text"],
    inputModalities: ["text"],
    outputModalities: ["text"],
    capabilities: ["chat"],
    officialReferencePrices: [],
    priceAvailability: { status: "unavailable" },
    supportsStreaming: true,
    supportsTools: false,
    supportsJsonSchema: false,
  };
}

function createChatConversationResponse() {
  return {
    code: "2000",
    data: {
      item: {
        id: "conversation-1",
        title: "Say hello",
        sourceSurface: "playground",
        status: "active",
        defaultModel: "gpt-4.1-mini",
        defaultProvider: "openai",
        messageCount: 0,
        turnCount: 0,
        createdAt: "2026-05-17T08:00:00Z",
        updatedAt: "2026-05-17T08:00:00Z",
      },
    },
  };
}

function createChatTurnResponse() {
  return {
    code: "2000",
    data: {
      turn: {
        id: "turn-1",
        conversationId: "conversation-1",
        turnNo: 1,
        role: "user",
        mode: "chat",
        status: "running",
        userMessageId: "message-user-1",
        createdAt: "2026-05-17T08:00:00Z",
        updatedAt: "2026-05-17T08:00:00Z",
      },
      messages: [
        {
          id: "message-user-1",
          conversationId: "conversation-1",
          turnId: "turn-1",
          role: "user",
          direction: "input",
          content: "Say hello",
          status: "completed",
          createdAt: "2026-05-17T08:00:00Z",
        },
      ],
    },
  };
}

function createChatRuntimeInvocationResponse() {
  return {
    code: "2000",
    data: {
      item: {
        id: "runtime-invocation-1",
        invocationNo: 1,
        invocationType: "chat_response",
        runtime: "openai_compatible",
        model: "gpt-4.1-mini",
        provider: "openai",
        status: "streaming",
        streaming: true,
        attemptNo: 1,
        conversationId: "conversation-1",
        chatTurnId: "turn-1",
        chatItemId: "message-user-1",
        createdAt: "2026-05-17T08:00:00Z",
      },
    },
  };
}

function createFailedRuntimeInvocationResponse() {
  return {
    code: "2000",
    data: {
      item: {
        id: "runtime-invocation-1",
        invocationNo: 1,
        invocationType: "agent_run",
        runtime: "openai_compatible",
        model: "kling-v2",
        status: "failed",
        streaming: true,
        attemptNo: 1,
        completedAt: "2026-05-17T08:00:01Z",
        createdAt: "2026-05-17T08:00:00Z",
      },
    },
  };
}

function createFailedChatTurnCompletionResponse(message = "Runtime stream completed without assistant output") {
  return {
    code: "2000",
    data: {
      turn: {
        id: "turn-1",
        conversationId: "conversation-1",
        turnNo: 1,
        role: "user",
        mode: "chat",
        status: "failed",
        userMessageId: "message-user-1",
        assistantMessageId: "message-assistant-1",
        createdAt: "2026-05-17T08:00:00Z",
        updatedAt: "2026-05-17T08:00:01Z",
      },
      messages: [
        {
          id: "message-assistant-1",
          conversationId: "conversation-1",
          turnId: "turn-1",
          role: "assistant",
          direction: "output",
          content: message,
          status: "failed",
          model: "gpt-4.1-mini",
          provider: "openai",
          runtimeInvocationId: "runtime-invocation-1",
          createdAt: "2026-05-17T08:00:01Z",
        },
      ],
    },
  };
}

function createPlaygroundAgentListResponse() {
  return {
    code: "2000",
    data: {
      items: [
        {
          id: "101",
          ownerUserId: 30,
          code: "playground-generation-agent",
          name: "Playground Generation Agent",
          description: "Routes playground generation requests through Runtime SSE.",
          visibility: "private",
          status: "active",
          createdAt: "2026-05-17T08:00:00Z",
          updatedAt: "2026-05-17T08:00:00Z",
          defaultVersion: {
            id: "201",
            versionNo: 1,
            releaseStatus: "published",
            model: "kling-v2",
            systemPrompt: "You are the Playground generation runtime coordinator.",
            toolPolicy: {},
            memoryPolicy: {},
            mcpPolicy: {},
            skillPolicy: {},
            runtimePolicy: {},
            createdAt: "2026-05-17T08:00:00Z",
            updatedAt: "2026-05-17T08:00:00Z",
          },
          capabilities: {
            memoryEnabled: false,
            mcpServerCount: 0,
            skillBindingCount: 0,
          },
        },
      ],
    },
  };
}

function createPlaygroundAgentSessionResponse() {
  return {
    code: "2000",
    data: {
      item: {
        id: "agent-session-1",
        agentId: "101",
        agentVersionId: "201",
        title: "Create a launch title",
        sessionKind: "interactive",
        sourceSurface: "playground",
        status: "active",
        runtime: "openai",
        defaultModel: "kling-v2",
        runCount: 0,
        stepCount: 0,
        toolCallCount: 0,
        createdAt: "2026-05-17T08:00:00Z",
        updatedAt: "2026-05-17T08:00:00Z",
      },
    },
  };
}

function createPlaygroundAgentRunResponse() {
  return {
    code: "2000",
    data: {
      item: {
        id: "agent-run-1",
        sessionId: "agent-session-1",
        agentId: "101",
        agentVersionId: "201",
        requestId: "request-1",
        status: "running",
        sourceSurface: "playground",
        inputMessage: "Create a launch title",
        runtime: "openai_compatible",
        model: "kling-v2",
        executionMode: "interactive",
        totalSteps: 0,
        createdAt: "2026-05-17T08:00:00Z",
      },
    },
  };
}

function createAgentRuntimeInvocationResponse() {
  return {
    code: "2000",
    data: {
      item: {
        id: "runtime-invocation-1",
        invocationNo: 1,
        invocationType: "agent_run",
        runtime: "openai_compatible",
        model: "kling-v2",
        status: "streaming",
        streaming: true,
        attemptNo: 1,
        agentSessionId: "agent-session-1",
        agentRunId: "agent-run-1",
        createdAt: "2026-05-17T08:00:00Z",
      },
    },
  };
}

function createAgentRunStepResponse() {
  return {
    code: "2000",
    data: {
      item: {
        id: "agent-run-step-1",
        runId: "agent-run-1",
        stepIndex: 1,
        stepType: "runtime",
        status: "running",
        title: "Runtime stream",
        model: "kling-v2",
        runtimeInvocationId: "runtime-invocation-1",
        createdAt: "2026-05-17T08:00:00Z",
      },
    },
  };
}

function createCompletedAgentRunStepResponse() {
  return {
    code: "2000",
    data: {
      item: {
        ...createAgentRunStepResponse().data.item,
        status: "completed",
        completedAt: "2026-05-17T08:00:03Z",
      },
    },
  };
}

function createFailedAgentRunStepResponse() {
  return {
    code: "2000",
    data: {
      item: {
        ...createAgentRunStepResponse().data.item,
        status: "failed",
        completedAt: "2026-05-17T08:00:01Z",
      },
    },
  };
}

function createFailedAgentRunResponse() {
  return {
    code: "2000",
    data: {
      item: {
        id: "agent-run-1",
        sessionId: "agent-session-1",
        agentId: "101",
        agentVersionId: "201",
        requestId: "request-1",
        status: "failed",
        sourceSurface: "playground",
        inputMessage: "Create a launch title",
        runtime: "openai_compatible",
        model: "kling-v2",
        executionMode: "interactive",
        totalSteps: 1,
        completedAt: "2026-05-17T08:00:01Z",
        createdAt: "2026-05-17T08:00:00Z",
      },
    },
  };
}

test("console account service reads account data returned by the generated app SDK", async () => {
  await withAppSdkResponse(
    {
      code: "2000",
      data: {
        id: "acct-1",
        name: "SDKWork",
        email: "ops@example.com",
        isVerified: true,
        tier: "pro",
        organization: "SDKWork",
        availableCredits: 125.5,
        estDaysRemaining: 20,
        monthlyConsumption: 300.25,
        consumptionByService: [],
        invoiceSettings: {
          orgFull: "SDKWork Inc.",
          taxId: "tax-1",
          paymentMethod: "wire",
          invoiceType: "enterprise",
        },
        security: {
          mfaEnabled: true,
          qpsLimit: 300,
          ipWhitelistCount: 2,
        },
        loginLogs: [],
      },
    },
    async (captured) => {
      const result = await AccountService.fetchAccountDetails();

      assert.equal(captured[0].url, "/app/v3/api/accounts/current/summary");
      assert.equal(result.id, "acct-1");
      assert.equal(result.email, "ops@example.com");
      assert.equal(result.availableCredits, 125.5);
    },
  );
});

test("console account service fails closed when the generated app SDK returns an empty account id", async () => {
  await withAppSdkResponse(
    {
      code: "2000",
      data: {
        id: "",
        name: "",
        email: "",
        isVerified: false,
        tier: "",
        organization: "",
        availableCredits: 0,
        estDaysRemaining: 0,
        monthlyConsumption: 0,
        consumptionByService: [],
        invoiceSettings: {
          orgFull: "",
          taxId: "",
          paymentMethod: "",
          invoiceType: "",
        },
        security: {
          mfaEnabled: false,
          qpsLimit: 0,
          ipWhitelistCount: 0,
        },
        loginLogs: [],
      },
    },
    async (captured) => {
      await assert.rejects(
        () => AccountService.fetchAccountDetails(),
        /Account summary id is required/,
      );
      assert.equal(captured[0].url, "/app/v3/api/accounts/current/summary");
    },
  );
});

test("console user service reads current user data returned by the generated app SDK", async () => {
  await withAppSdkResponse(
    {
      code: "2000",
      data: {
        displayName: "Ada",
        email: "ada@example.com",
        phone: "",
        language: "en",
        avatarUrl: "A",
        isVerified: true,
        status: "active",
        registeredAt: "2026-05-01T00:00:00Z",
        lastLogin: "2026-05-05T08:00:00Z",
        lastLoginIp: "10.***.***.10",
        passwordLastChanged: "2026-04-01T00:00:00Z",
        twoFactorEnabled: true,
        thirdPartyBound: "GitHub",
      },
    },
    async (captured) => {
      const result = await UserService.fetchCurrentUser();

      assert.equal(captured[0].url, "/app/v3/api/iam/users/current");
      assert.equal(result.email, "ada@example.com");
      assert.equal(result.twoFactorEnabled, true);
    },
  );
});

test("console account service fails closed when the generated app SDK omits account id", async () => {
  await withAppSdkResponse(
    {
      code: "2000",
      data: {
        name: "SDKWork",
        email: "ops@example.com",
        isVerified: true,
        tier: "pro",
        organization: "SDKWork",
        availableCredits: 125.5,
        estDaysRemaining: 20,
        monthlyConsumption: 300.25,
        consumptionByService: [],
        invoiceSettings: {
          orgFull: "SDKWork Inc.",
          taxId: "tax-1",
          paymentMethod: "wire",
          invoiceType: "enterprise",
        },
        security: {
          mfaEnabled: true,
          qpsLimit: 300,
          ipWhitelistCount: 2,
        },
        loginLogs: [],
      },
    },
    async () => {
      await assert.rejects(
        () => AccountService.fetchAccountDetails(),
        /Account summary id is required/,
      );
    },
  );
});

test("console user service fails closed when the generated app SDK omits current user email", async () => {
  await withAppSdkResponse(
    {
      code: "2000",
      data: {
        displayName: "Ada",
        phone: "",
        language: "en",
        avatarUrl: "A",
        isVerified: true,
        status: "active",
        registeredAt: "2026-05-01T00:00:00Z",
        lastLogin: "2026-05-05T08:00:00Z",
        lastLoginIp: "10.***.***.10",
        passwordLastChanged: "2026-04-01T00:00:00Z",
        twoFactorEnabled: true,
        thirdPartyBound: "GitHub",
      },
    },
    async () => {
      await assert.rejects(
        () => UserService.fetchCurrentUser(),
        /User profile response missing data/,
      );
    },
  );
});

test("console user service fails closed when the generated app SDK omits required current user fields", async () => {
  for (const [field, message] of [
    ["displayName", /User profile display name is required/],
    ["phone", /User profile phone is required/],
    ["isVerified", /User profile verification status is required/],
    ["twoFactorEnabled", /User profile two-factor status is required/],
    ["thirdPartyBound", /User profile third-party binding summary is required/],
  ] as const) {
    await withAppSdkResponse(
      {
        code: "2000",
        data: (() => {
          const profile = {
            displayName: "Ada",
            email: "ada@example.com",
            phone: "",
            language: "en",
            avatarUrl: "A",
            isVerified: true,
            status: "active",
            registeredAt: "2026-05-01T00:00:00Z",
            lastLogin: "2026-05-05T08:00:00Z",
            lastLoginIp: "10.***.***.10",
            passwordLastChanged: "2026-04-01T00:00:00Z",
            twoFactorEnabled: true,
            thirdPartyBound: "GitHub",
          } as Record<string, unknown>;
          delete profile[field];
          return profile;
        })(),
      },
      async () => {
        await assert.rejects(
          () => UserService.fetchCurrentUser(),
          message,
        );
      },
    );
  }
});

test("console user service preserves contract-defined empty current user display strings", async () => {
  await withAppSdkResponse(
    {
      code: "2000",
      data: {
        displayName: "Ada",
        email: "ada@example.com",
        phone: "",
        language: "en",
        avatarUrl: "A",
        isVerified: true,
        status: "active",
        registeredAt: "2026-05-01T00:00:00Z",
        lastLogin: "2026-05-05T08:00:00Z",
        lastLoginIp: "",
        passwordLastChanged: "",
        twoFactorEnabled: false,
        thirdPartyBound: "",
      },
    },
    async () => {
      const result = await UserService.fetchCurrentUser();

      assert.equal(result.phone, "");
      assert.equal(result.lastLoginIp, "");
      assert.equal(result.passwordLastChanged, "");
      assert.equal(result.thirdPartyBound, "");
      assert.equal(result.twoFactorEnabled, false);
    },
  );
});

test("console messages service reads message items returned by the generated app SDK", async () => {
  await withAppSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            id: "msg-1",
            title: "Billing",
            desc: "Recharge completed",
            content: "Credits are available.",
            time: "2026-05-05T08:00:00Z",
            type: "billing",
            read: false,
            appId: "claw-router",
            showAsPopup: false,
            popupSeen: false,
            archived: false,
            actionUrl: null,
          },
        ],
      },
    },
    async (captured) => {
      const result = await MessagesService.fetchMessages();

      assert.equal(captured[0].url, "/app/v3/api/notification/notifications?include_archived=false&page=1&page_size=50");
      assert.deepEqual(result.map((item) => item.id), ["msg-1"]);
    },
  );
});

test("console messages service acknowledges viewed messages through the generated app SDK", async () => {
  await withAppSdkResponse(
    {
      code: "2000",
      data: {},
    },
    async (captured) => {
      await MessagesService.acknowledge("msg-1");

      assert.deepEqual(
        captured.map((request) => `${request.method} ${request.url}`),
        ["POST /app/v3/api/notification/notifications/msg-1/acknowledge"],
      );
    },
  );
});

test("console messages view marks opened unread messages as read and persists acknowledgement", () => {
  const source = readPortalFile("./packages/sdkwork-claw-router-console-messages/src/MessagesView.tsx");

  for (const marker of [
    "function markMessageReadFeedback",
    "const handleSelectMessage = useCallback(",
    "setMessages((current) => markMessageReadFeedback(current, message.id))",
    "void MessagesService.acknowledge(message.id)",
    "onSelect={() => handleSelectMessage(message)}",
  ]) {
    assert.ok(source.includes(marker), `missing console message read feedback marker: ${marker}`);
  }
});

test("shared notification service reads notification items returned by the generated app SDK", async () => {
  await withAppSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            id: "notif-1",
            title: "Quota warning",
            desc: "Daily quota is almost exhausted",
            content: "The default API key has used 90% of its daily quota.",
            time: "2026-05-05T08:00:00Z",
            type: "warning",
            read: false,
            appId: "claw-router",
            archived: false,
            popupSeen: false,
            showAsPopup: true,
            actionUrl: null,
          },
          {
            id: "notif-2",
            title: "Routine update",
            desc: "No popup requested",
            content: "This should stay in the notification center.",
            time: "2026-05-05T09:00:00Z",
            type: "info",
            read: true,
            appId: "claw-router",
            archived: false,
            popupSeen: true,
            showAsPopup: false,
            actionUrl: null,
          },
        ],
      },
    },
    async (captured) => {
      const result = await NotificationService.fetchNotifications();

      assert.equal(captured[0].url, "/app/v3/api/notification/notifications?include_archived=false&page=1&page_size=50");
      assert.deepEqual(result.map((item) => item.id), ["notif-1", "notif-2"]);
      assert.equal(result[0].type, "warning");
      assert.equal(result[0].read, false);
      assert.equal(result[0].showAsPopup, true);
      assert.equal(result[1].showAsPopup, false);
    },
  );
});

test("navbar delegates popup queue and persisted acknowledgement state to the appbase notification component", () => {
  const navbarSource = readPortalFile("./packages/sdkwork-claw-router-commons/src/components/Navbar.tsx");
  const appbaseNotificationSource = readPortalFile("../../../sdkwork-appbase/packages/pc-react/notification/sdkwork-notification-pc-react/src/NotificationBell.tsx");

  assert.match(navbarSource, /SdkworkNotificationBell/, "Navbar must render the shared appbase notification component");
  assert.match(navbarSource, /getPortalNotificationClient\(\)/, "Navbar must inject the generated Claw Router app SDK client");
  assert.doesNotMatch(navbarSource, /popupNotificationQueue/, "Navbar must not keep a package-local popup queue");
  assert.doesNotMatch(navbarSource, /activePopupNotification/, "Navbar must not keep package-local popup state");
  assert.match(appbaseNotificationSource, /popupQueue/, "The appbase component owns popup queue behavior");
  assert.match(appbaseNotificationSource, /!item\.popupSeen/, "The appbase component must respect server persisted popup-seen state");
  assert.match(appbaseNotificationSource, /service\.acknowledge/, "The appbase component must persist acknowledgement state through the generated SDK");
  assert.match(appbaseNotificationSource, /service\.markPopupSeen/, "The appbase component must persist popup-seen state through the generated SDK");
  assert.doesNotMatch(appbaseNotificationSource, /service\.markRead/, "The appbase component must not split acknowledgement into a separate read write");
  assert.doesNotMatch(navbarSource, /notifications\.filter\([^)]*showAsPopup[^)]*\)\.map/s, "Navbar must not render multiple popup modals directly from the notification list");
});

test("app SDK message contract exposes popup display flag", () => {
  const messageTypeSource = readPortalFile("../../sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/src/types/notification-item.ts");

  assert.match(messageTypeSource, /showAsPopup\??: boolean;/);
});

test("console messages service fails closed when SDK message items omit required fields", async () => {
  await withAppSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            id: "msg-1",
            title: "Billing",
            desc: "Recharge completed",
            content: "Credits are available.",
            time: "2026-05-05T08:00:00Z",
            type: "billing",
            read: false,
            appId: "claw-router",
            showAsPopup: false,
            popupSeen: false,
            archived: false,
            actionUrl: null,
          },
          {
            id: "msg-2",
            title: "Broken",
            appId: "claw-router",
            content: "Broken item",
            time: "2026-05-05T08:00:00Z",
            type: "billing",
            read: false,
            showAsPopup: false,
            popupSeen: false,
            archived: false,
            actionUrl: null,
          },
        ],
      },
    },
    async () => {
      await assert.rejects(
        () => MessagesService.fetchMessages(),
        /Notification description is required/,
      );
    },
  );
});

test("console gateway service reads trace items returned by the generated app SDK", async () => {
  await withAppSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            id: "trace-1",
            time: "2026-05-05T08:00:00Z",
            ip: "10.***.***.11",
            endpoint: "/v1/chat/completions",
            method: "POST",
            status: 200,
            duration: "128ms",
            channel: "openai-main",
          },
        ],
      },
    },
    async (captured) => {
      const result = await GatewayService.fetchTraces();

      assert.equal(captured[0].url, "/app/v3/api/ai/gateway/traces");
      assert.deepEqual(result.map((item) => item.id), ["trace-1"]);
    },
  );
});

test("console gateway service fails closed when SDK trace items omit required fields", async () => {
  await withAppSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            id: "trace-1",
            time: "2026-05-05T08:00:00Z",
            ip: "10.***.***.11",
            endpoint: "/v1/chat/completions",
            method: "POST",
            status: 200,
            duration: "128ms",
            channel: "openai-main",
          },
          {
            id: "trace-2",
            time: "2026-05-05T08:00:00Z",
            ip: "10.***.***.12",
            endpoint: "/v1/chat/completions",
            method: "TRACE",
            status: "200",
            duration: "128ms",
            channel: "openai-main",
          },
        ],
      },
    },
    async () => {
      await assert.rejects(
        () => GatewayService.fetchTraces(),
        /Gateway trace method is required/,
      );
    },
  );
});

test("console gateway service fails closed when SDK trace list contains malformed rows", async () => {
  await withAppSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            id: "trace-1",
            time: "2026-05-05T08:00:00Z",
            ip: "10.***.***.11",
            endpoint: "/v1/chat/completions",
            method: "POST",
            status: 200,
            duration: "128ms",
            channel: "openai-main",
          },
          "malformed-row",
        ],
      },
    },
    async () => {
      await assert.rejects(
        () => GatewayService.fetchTraces(),
        /Gateway trace record is required/,
      );
    },
  );
});

test("playground service reads generation history returned by the generated app SDK", async () => {
  await withAppSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            id: "gen-1",
            date: "2026-05-05",
            prompt: "A precise router diagram",
            type: "image",
            images: ["https://example.com/result.png"],
            videos: [],
            createdAt: "2026-05-05T08:00:00Z",
          },
        ],
      },
    },
    async (captured) => {
      const result = await PlaygroundService.fetchGenerationHistory();

      assert.equal(captured[0].url, "/app/v3/api/ai/generations");
      assert.deepEqual(result.map((item) => item.id), ["gen-1"]);
      assert.equal(result[0].type, "images");
      assert.deepEqual(result[0].images, ["https://example.com/result.png"]);
    },
    { authenticated: true },
  );
});

test("playground service creates agent generation runs through standard Agent and Runtime SSE SDK resources", async () => {
  await withAppSdkResponses(
    [
      {
        code: "2000",
        data: {
          items: [
            {
              id: "101",
              ownerUserId: 30,
              code: "playground-generation-agent",
              name: "Playground Generation Agent",
              description: "Routes playground generation requests through Runtime SSE.",
              visibility: "private",
              status: "active",
              createdAt: "2026-05-17T08:00:00Z",
              updatedAt: "2026-05-17T08:00:00Z",
              defaultVersion: {
                id: "201",
                versionNo: 1,
                releaseStatus: "published",
                model: "kling-v2",
                systemPrompt: "You are the Playground generation runtime coordinator.",
                toolPolicy: {},
                memoryPolicy: {},
                mcpPolicy: {},
                skillPolicy: {},
                runtimePolicy: {},
                createdAt: "2026-05-17T08:00:00Z",
                updatedAt: "2026-05-17T08:00:00Z",
              },
              capabilities: {
                memoryEnabled: false,
                mcpServerCount: 0,
                skillBindingCount: 0,
              },
            },
          ],
        },
      },
      {
        code: "2000",
        data: {
          item: {
            id: "agent-session-1",
            agentId: "101",
            agentVersionId: "201",
            title: "Create a 10 second product launch video",
            sessionKind: "interactive",
            sourceSurface: "playground",
            status: "active",
            runtime: "openai",
            defaultModel: "kling-v2",
            runCount: 0,
            stepCount: 0,
            toolCallCount: 0,
            createdAt: "2026-05-17T08:00:00Z",
            updatedAt: "2026-05-17T08:00:00Z",
          },
        },
      },
      {
        code: "2000",
        data: {
          item: {
            id: "agent-run-1",
            sessionId: "agent-session-1",
            agentId: "101",
            agentVersionId: "201",
            requestId: "request-1",
            status: "running",
            sourceSurface: "playground",
            inputMessage: "Create a 10 second product launch video",
            runtime: "openai_compatible",
            model: "kling-v2",
            executionMode: "interactive",
            totalSteps: 0,
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
      {
        code: "2000",
        data: {
          item: {
            id: "runtime-invocation-1",
            invocationNo: 1,
            invocationType: "agent_run",
            runtime: "openai_compatible",
            model: "kling-v2",
            status: "streaming",
            streaming: true,
            attemptNo: 1,
            agentSessionId: "agent-session-1",
            agentRunId: "agent-run-1",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
      {
        code: "2000",
        data: {
          item: {
            id: "agent-run-step-1",
            runId: "agent-run-1",
            stepIndex: 1,
            stepType: "runtime",
            status: "running",
            title: "Runtime stream",
            model: "kling-v2",
            runtimeInvocationId: "runtime-invocation-1",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
      [
        'data: {"id":"runtime-event-1","invocationId":"runtime-invocation-1","eventNo":1,"eventType":"message.delta","eventSource":"runtime","textDelta":"Storyboard ready","createdAt":"2026-05-17T08:00:01Z"}',
        'data: {"id":"runtime-event-2","invocationId":"runtime-invocation-1","eventNo":2,"eventType":"message.delta","eventSource":"runtime","textDelta":" for launch.","createdAt":"2026-05-17T08:00:02Z"}',
        "data: [DONE]",
        "",
      ].join("\n"),
      {
        code: "2000",
        data: {
          item: {
            id: "runtime-invocation-1",
            invocationNo: 1,
            invocationType: "agent_run",
            runtime: "openai_compatible",
            model: "kling-v2",
            status: "completed",
            streaming: true,
            attemptNo: 1,
            agentSessionId: "agent-session-1",
            agentRunId: "agent-run-1",
            completedAt: "2026-05-17T08:00:03Z",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
      createCompletedAgentRunStepResponse(),
      {
        code: "2000",
        data: {
          item: {
            id: "agent-run-1",
            sessionId: "agent-session-1",
            agentId: "101",
            agentVersionId: "201",
            requestId: "request-1",
            status: "completed",
            sourceSurface: "playground",
            inputMessage: "Create a 10 second product launch video",
            outputMessage: "Storyboard ready for launch.",
            runtime: "openai_compatible",
            model: "kling-v2",
            executionMode: "interactive",
            totalSteps: 1,
            inputTokens: 0,
            outputTokens: 0,
            cachedTokens: 0,
            totalTokens: 0,
            completedAt: "2026-05-17T08:00:03Z",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
    ],
    async (captured) => {
      const deltas: string[] = [];
      const result = await PlaygroundService.runAgentGeneration({
        prompt: "  Create a 10 second product launch video  ",
        targetType: "video",
        selectedModel: "kling-v2",
        onDelta: (delta) => {
          deltas.push(delta);
        },
        generationConfig: {
          durationSeconds: 10,
          quality: "high",
        },
        referenceImages: [
          {
            name: "storyboard.png",
            mimeType: "image/png",
            sizeBytes: 128,
            dataUrl: "data:image/png;base64,cmVmZXJlbmNl",
          },
        ],
      });

      assert.deepEqual(captured.map((request) => `${request.method} ${request.url}`), [
        "GET /app/v3/api/agents?page_size=100&q=Playground%20Generation%20Agent",
        "POST /app/v3/api/agents/101/sessions",
        "POST /app/v3/api/agents/sessions/agent-session-1/runs",
        "POST /app/v3/api/runtime/invocations",
        "POST /app/v3/api/agents/runs/agent-run-1/steps",
        "GET /app/v3/api/runtime/invocations/runtime-invocation-1/events/stream",
        "POST /app/v3/api/runtime/invocations/runtime-invocation-1/complete",
        "POST /app/v3/api/agents/runs/agent-run-1/steps/agent-run-step-1/complete",
        "POST /app/v3/api/agents/runs/agent-run-1/complete",
      ]);
      assert.equal(captured[5].headers?.accept, "text/event-stream");
      assert.equal(captured[1].body.agentVersionId, "201");
      assert.equal(captured[2].body.agentId, "101");
      assert.equal(captured[2].body.agentVersionId, "201");
      assert.equal(captured[3].body.streaming, true);
      assert.equal(captured[4].body.runtimeInvocationId, "runtime-invocation-1");
      assert.deepEqual(captured[6].body.responseJson, {
        outputText: "Storyboard ready for launch.",
      });
      assert.equal(captured[7].body.status, "completed");
      assert.deepEqual(captured[7].body.outputJson, {
        outputText: "Storyboard ready for launch.",
      });
      assert.equal(captured[8].body.outputMessage, "Storyboard ready for launch.");
      assert.deepEqual(deltas, ["Storyboard ready", " for launch."]);
      assert.equal(result.targetType, "video");
      assert.equal(result.status, "completed");
      assert.equal(result.agent.id, "101");
      assert.equal(result.run.status, "succeeded");
      assert.equal(result.steps[0].type, "model_call");
      assert.deepEqual(result.usage.events, []);
      assert.equal(result.item.id, "agent-run-1");
      assert.equal(result.item.type, "video");
      assert.equal(result.item.status, "completed");
      assert.equal(result.item.modelInfo, "kling-v2");
      assert.deepEqual(result.item.images, []);
      assert.deepEqual(result.item.videos, []);
    },
    { authenticated: true },
  );
});

test("playground generation agent normalizes media assets from Runtime SSE into reusable Generation results", async () => {
  await withAppSdkResponses(
    [
      createPlaygroundAgentListResponse(),
      createPlaygroundAgentSessionResponse(),
      createPlaygroundAgentRunResponse(),
      createAgentRuntimeInvocationResponse(),
      createAgentRunStepResponse(),
      [
        'data: {"id":"runtime-event-1","invocationId":"runtime-invocation-1","eventNo":1,"eventType":"message.delta","eventSource":"runtime","textDelta":"Generating launch video.","payloadJson":{},"createdAt":"2026-05-17T08:00:01Z"}',
        'data: {"id":"runtime-event-2","invocationId":"runtime-invocation-1","eventNo":2,"eventType":"generation.asset","eventSource":"generation","payloadJson":{"modality":"video","url":"https://cdn.example.test/generated/launch.mp4","thumb":"https://cdn.example.test/generated/launch.jpg","durationSeconds":10},"createdAt":"2026-05-17T08:00:02Z"}',
        "data: [DONE]",
        "",
      ].join("\n"),
      {
        code: "2000",
        data: {
          item: {
            id: "runtime-invocation-1",
            invocationNo: 1,
            invocationType: "agent_run",
            runtime: "openai_compatible",
            model: "kling-v2",
            status: "completed",
            streaming: true,
            attemptNo: 1,
            agentSessionId: "agent-session-1",
            agentRunId: "agent-run-1",
            completedAt: "2026-05-17T08:00:03Z",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
      createCompletedAgentRunStepResponse(),
      {
        code: "2000",
        data: {
          item: {
            id: "agent-run-1",
            sessionId: "agent-session-1",
            agentId: "101",
            agentVersionId: "201",
            requestId: "request-1",
            status: "completed",
            sourceSurface: "playground",
            inputMessage: "Create a launch title",
            outputMessage: "Generating launch video.",
            runtime: "openai_compatible",
            model: "kling-v2",
            executionMode: "interactive",
            totalSteps: 1,
            inputTokens: 0,
            outputTokens: 0,
            cachedTokens: 0,
            totalTokens: 0,
            completedAt: "2026-05-17T08:00:03Z",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
    ],
    async (captured) => {
      const result = await PlaygroundService.runAgentGeneration({
        prompt: "Create a launch title",
        targetType: "video",
        selectedModel: "kling-v2",
        generationConfig: {
          durationSeconds: 10,
        },
      });

      assert.equal(result.item.type, "video");
      assert.deepEqual(result.item.videos, [
        {
          url: "https://cdn.example.test/generated/launch.mp4",
          thumb: "https://cdn.example.test/generated/launch.jpg",
        },
      ]);
      assert.equal(result.item.url, "https://cdn.example.test/generated/launch.mp4");
      assert.equal(result.item.durationSeconds, 10);
      assert.equal(result.steps.some((step) => step.type === "media_generation"), true);
      assert.equal(result.usage.videoSeconds, "10");
      assert.deepEqual(captured[6].body.responseJson, {
        media: [
          {
            durationSeconds: 10,
            modality: "video",
            thumb: "https://cdn.example.test/generated/launch.jpg",
            url: "https://cdn.example.test/generated/launch.mp4",
          },
        ],
        outputText: "Generating launch video.",
      });
      assert.deepEqual(captured[7].body.outputJson, {
        media: [
          {
            durationSeconds: 10,
            modality: "video",
            thumb: "https://cdn.example.test/generated/launch.jpg",
            url: "https://cdn.example.test/generated/launch.mp4",
          },
        ],
        outputText: "Generating launch video.",
      });
    },
    { authenticated: true },
  );
});

test("playground generation agent derives broad agent result type from Runtime media artifacts", async () => {
  await withAppSdkResponses(
    [
      createPlaygroundAgentListResponse(),
      createPlaygroundAgentSessionResponse(),
      createPlaygroundAgentRunResponse(),
      createAgentRuntimeInvocationResponse(),
      createAgentRunStepResponse(),
      [
        'data: {"id":"runtime-event-1","invocationId":"runtime-invocation-1","eventNo":1,"eventType":"message.delta","eventSource":"runtime","textDelta":"Generating launch video.","payloadJson":{},"createdAt":"2026-05-17T08:00:01Z"}',
        'data: {"id":"runtime-event-2","invocationId":"runtime-invocation-1","eventNo":2,"eventType":"generation.asset","eventSource":"generation","payloadJson":{"modality":"video","url":"https://cdn.example.test/generated/broad-agent-video.mp4","thumb":"https://cdn.example.test/generated/broad-agent-video.jpg","durationSeconds":8},"createdAt":"2026-05-17T08:00:02Z"}',
        "data: [DONE]",
        "",
      ].join("\n"),
      {
        code: "2000",
        data: {
          item: {
            id: "runtime-invocation-1",
            invocationNo: 1,
            invocationType: "agent_run",
            runtime: "openai_compatible",
            model: "kling-v2",
            status: "completed",
            streaming: true,
            attemptNo: 1,
            agentSessionId: "agent-session-1",
            agentRunId: "agent-run-1",
            completedAt: "2026-05-17T08:00:03Z",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
      createCompletedAgentRunStepResponse(),
      {
        code: "2000",
        data: {
          item: {
            id: "agent-run-1",
            sessionId: "agent-session-1",
            agentId: "101",
            agentVersionId: "201",
            requestId: "request-1",
            status: "completed",
            sourceSurface: "playground",
            inputMessage: "Create media",
            outputMessage: "Generating launch video.",
            runtime: "openai_compatible",
            model: "kling-v2",
            executionMode: "interactive",
            totalSteps: 1,
            completedAt: "2026-05-17T08:00:03Z",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
    ],
    async (captured) => {
      const result = await PlaygroundService.runAgentGeneration({
        prompt: "Create media",
        selectedModel: "kling-v2",
      });

      assert.equal(captured[1].body.metadata?.targetType, undefined);
      assert.equal(captured[2].body.metadata?.targetType, undefined);
      assert.equal(captured[3].body.metadata?.targetType, undefined);
      assert.equal(captured[3].body.requestJson?.targetType, undefined);
      assert.equal(captured[4].body.inputJson?.targetType, undefined);
      assert.equal(result.targetType, "video");
      assert.equal(result.item.type, "video");
      assert.equal(result.item.url, "https://cdn.example.test/generated/broad-agent-video.mp4");
      assert.deepEqual(result.item.videos, [
        {
          url: "https://cdn.example.test/generated/broad-agent-video.mp4",
          thumb: "https://cdn.example.test/generated/broad-agent-video.jpg",
        },
      ]);
      assert.deepEqual(result.item.images, []);
      assert.equal(result.item.durationSeconds, 8);
    },
    { authenticated: true },
  );
});

test("playground generation agent completes media-only Runtime SSE streams", async () => {
  await withAppSdkResponses(
    [
      createPlaygroundAgentListResponse(),
      createPlaygroundAgentSessionResponse(),
      createPlaygroundAgentRunResponse(),
      createAgentRuntimeInvocationResponse(),
      createAgentRunStepResponse(),
      [
        'data: {"id":"runtime-event-1","invocationId":"runtime-invocation-1","eventNo":1,"eventType":"generation.asset","eventSource":"generation","payloadJson":{"modality":"image","url":"https://cdn.example.test/generated/media-only.png"},"createdAt":"2026-05-17T08:00:01Z"}',
        "data: [DONE]",
        "",
      ].join("\n"),
      {
        code: "2000",
        data: {
          item: {
            id: "runtime-invocation-1",
            invocationNo: 1,
            invocationType: "agent_run",
            runtime: "openai_compatible",
            model: "kling-v2",
            status: "completed",
            streaming: true,
            attemptNo: 1,
            agentSessionId: "agent-session-1",
            agentRunId: "agent-run-1",
            completedAt: "2026-05-17T08:00:03Z",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
      createCompletedAgentRunStepResponse(),
      {
        code: "2000",
        data: {
          item: {
            id: "agent-run-1",
            sessionId: "agent-session-1",
            agentId: "101",
            agentVersionId: "201",
            requestId: "request-1",
            status: "completed",
            sourceSurface: "playground",
            inputMessage: "Create image",
            runtime: "openai_compatible",
            model: "kling-v2",
            executionMode: "interactive",
            totalSteps: 1,
            inputTokens: 0,
            outputTokens: 0,
            cachedTokens: 0,
            totalTokens: 0,
            completedAt: "2026-05-17T08:00:03Z",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
    ],
    async (captured) => {
      const artifacts: string[] = [];
      const result = await PlaygroundService.runAgentGeneration({
        prompt: "Create image",
        targetType: "image",
        selectedModel: "kling-v2",
        onArtifact: (artifact) => {
          artifacts.push(artifact.url);
        },
      });

      assert.deepEqual(artifacts, ["https://cdn.example.test/generated/media-only.png"]);
      assert.deepEqual(result.item.images, ["https://cdn.example.test/generated/media-only.png"]);
      assert.equal(result.item.outputText, undefined);
      assert.deepEqual(captured[6].body.responseJson, {
        media: [
          {
            modality: "image",
            url: "https://cdn.example.test/generated/media-only.png",
          },
        ],
      });
      assert.equal(captured[8].body.outputMessage, undefined);
    },
    { authenticated: true },
  );
});

test("playground generation agent maps image and audio family assets from Runtime SSE into Generation history items", async () => {
  for (const [targetType, assetUrl, expectedField] of [
    ["image", "https://cdn.example.test/generated/image.png", "images"],
    ["audio", "https://cdn.example.test/generated/voice.mp3", "url"],
    ["music", "https://cdn.example.test/generated/music.mp3", "url"],
    ["sfx", "https://cdn.example.test/generated/effect.wav", "url"],
  ] as const) {
    await withAppSdkResponses(
      [
        createPlaygroundAgentListResponse(),
        createPlaygroundAgentSessionResponse(),
        createPlaygroundAgentRunResponse(),
        createAgentRuntimeInvocationResponse(),
        createAgentRunStepResponse(),
        [
          'data: {"id":"runtime-event-1","invocationId":"runtime-invocation-1","eventNo":1,"eventType":"message.delta","eventSource":"runtime","textDelta":"Asset ready.","payloadJson":{},"createdAt":"2026-05-17T08:00:01Z"}',
          `data: {"id":"runtime-event-2","invocationId":"runtime-invocation-1","eventNo":2,"eventType":"generation.asset","eventSource":"generation","payloadJson":{"modality":"${targetType}","url":"${assetUrl}","durationSeconds":6},"createdAt":"2026-05-17T08:00:02Z"}`,
          "data: [DONE]",
          "",
        ].join("\n"),
        {
          code: "2000",
          data: {
            item: {
              id: "runtime-invocation-1",
              invocationNo: 1,
              invocationType: "agent_run",
              runtime: "openai_compatible",
              model: "kling-v2",
              status: "completed",
              streaming: true,
              attemptNo: 1,
              agentSessionId: "agent-session-1",
              agentRunId: "agent-run-1",
              completedAt: "2026-05-17T08:00:03Z",
              createdAt: "2026-05-17T08:00:00Z",
            },
          },
        },
        createCompletedAgentRunStepResponse(),
        {
          code: "2000",
          data: {
            item: {
              id: "agent-run-1",
              sessionId: "agent-session-1",
              agentId: "101",
              agentVersionId: "201",
              requestId: "request-1",
              status: "completed",
              sourceSurface: "playground",
              inputMessage: "Create media",
              outputMessage: "Asset ready.",
              runtime: "openai_compatible",
              model: "kling-v2",
              executionMode: "interactive",
              totalSteps: 1,
              inputTokens: 0,
              outputTokens: 0,
              cachedTokens: 0,
              totalTokens: 0,
              completedAt: "2026-05-17T08:00:03Z",
              createdAt: "2026-05-17T08:00:00Z",
            },
          },
        },
      ],
      async () => {
        const result = await PlaygroundService.runAgentGeneration({
          prompt: "Create media",
          targetType,
          selectedModel: "kling-v2",
        });

        assert.equal(result.item.type, targetType === "image" ? "images" : targetType);
        if (expectedField === "images") {
          assert.deepEqual(result.item.images, [assetUrl]);
        } else {
          assert.equal(result.item.url, assetUrl);
          assert.equal(result.item.durationSeconds, 6);
        }
        assert.equal(result.steps.some((step) => step.type === "media_generation"), true);
      },
      { authenticated: true },
    );
  }
});

test("playground generation agent infers artifact modality from MIME type when Runtime SSE omits modality", async () => {
  for (const [targetType, assetUrl, mimeType] of [
    ["image", "https://cdn.example.test/generated/inferred.png", "image/png"],
    ["video", "https://cdn.example.test/generated/inferred.mp4", "video/mp4"],
    ["audio", "https://cdn.example.test/generated/inferred.mp3", "audio/mpeg"],
  ] as const) {
    await withAppSdkResponses(
      [
        createPlaygroundAgentListResponse(),
        createPlaygroundAgentSessionResponse(),
        createPlaygroundAgentRunResponse(),
        createAgentRuntimeInvocationResponse(),
        createAgentRunStepResponse(),
        [
          `data: {"id":"runtime-event-1","invocationId":"runtime-invocation-1","eventNo":1,"eventType":"generation.asset","eventSource":"generation","payloadJson":{"url":"${assetUrl}","mimeType":"${mimeType}","durationSeconds":5},"createdAt":"2026-05-17T08:00:01Z"}`,
          "data: [DONE]",
          "",
        ].join("\n"),
        {
          code: "2000",
          data: {
            item: {
              id: "runtime-invocation-1",
              invocationNo: 1,
              invocationType: "agent_run",
              runtime: "openai_compatible",
              model: "kling-v2",
              status: "completed",
              streaming: true,
              attemptNo: 1,
              agentSessionId: "agent-session-1",
              agentRunId: "agent-run-1",
              completedAt: "2026-05-17T08:00:03Z",
              createdAt: "2026-05-17T08:00:00Z",
            },
          },
        },
        createCompletedAgentRunStepResponse(),
        {
          code: "2000",
          data: {
            item: {
              id: "agent-run-1",
              sessionId: "agent-session-1",
              agentId: "101",
              agentVersionId: "201",
              requestId: "request-1",
              status: "completed",
              sourceSurface: "playground",
              inputMessage: "Create media",
              runtime: "openai_compatible",
              model: "kling-v2",
              executionMode: "interactive",
              totalSteps: 1,
              inputTokens: 0,
              outputTokens: 0,
              cachedTokens: 0,
              totalTokens: 0,
              completedAt: "2026-05-17T08:00:03Z",
              createdAt: "2026-05-17T08:00:00Z",
            },
          },
        },
      ],
      async (captured) => {
        const artifacts: string[] = [];
        const result = await PlaygroundService.runAgentGeneration({
          prompt: "Create media",
          targetType,
          selectedModel: "kling-v2",
          onArtifact: (artifact) => {
            artifacts.push(`${artifact.modality}:${artifact.url}`);
          },
        });

        assert.deepEqual(artifacts, [`${targetType}:${assetUrl}`]);
        assert.deepEqual(captured[6].body.responseJson.media, [
          {
            durationSeconds: 5,
            mimeType,
            modality: targetType,
            url: assetUrl,
          },
        ]);
        if (targetType === "image") {
          assert.deepEqual(result.item.images, [assetUrl]);
        } else if (targetType === "video") {
          assert.deepEqual(result.item.videos, [{ url: assetUrl }]);
        } else {
          assert.equal(result.item.url, assetUrl);
        }
      },
      { authenticated: true },
    );
  }
});

test("playground generation agent reads nested Runtime SSE artifact envelopes and deduplicates assets", async () => {
  await withAppSdkResponses(
    [
      createPlaygroundAgentListResponse(),
      createPlaygroundAgentSessionResponse(),
      createPlaygroundAgentRunResponse(),
      createAgentRuntimeInvocationResponse(),
      createAgentRunStepResponse(),
      [
        'data: {"id":"runtime-event-1","invocationId":"runtime-invocation-1","eventNo":1,"eventType":"runtime.output","eventSource":"generation","payloadJson":{"data":{"assets":[{"type":"image","assetUrl":"https://cdn.example.test/generated/nested-1.png"},{"type":"image","storageUrl":"https://cdn.example.test/generated/nested-1.png"},{"type":"image","href":"https://cdn.example.test/generated/nested-2.png"}]}},"createdAt":"2026-05-17T08:00:01Z"}',
        'data: {"id":"runtime-event-2","invocationId":"runtime-invocation-1","eventNo":2,"eventType":"artifact.created","eventSource":"runtime","payloadJson":{"result":{"asset":{"type":"image","url":"https://cdn.example.test/generated/nested-3.png"}}},"createdAt":"2026-05-17T08:00:02Z"}',
        "data: [DONE]",
        "",
      ].join("\n"),
      {
        code: "2000",
        data: {
          item: {
            id: "runtime-invocation-1",
            invocationNo: 1,
            invocationType: "agent_run",
            runtime: "openai_compatible",
            model: "kling-v2",
            status: "completed",
            streaming: true,
            attemptNo: 1,
            agentSessionId: "agent-session-1",
            agentRunId: "agent-run-1",
            completedAt: "2026-05-17T08:00:03Z",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
      createCompletedAgentRunStepResponse(),
      {
        code: "2000",
        data: {
          item: {
            id: "agent-run-1",
            sessionId: "agent-session-1",
            agentId: "101",
            agentVersionId: "201",
            requestId: "request-1",
            status: "completed",
            sourceSurface: "playground",
            inputMessage: "Create nested images",
            runtime: "openai_compatible",
            model: "kling-v2",
            executionMode: "interactive",
            totalSteps: 1,
            inputTokens: 0,
            outputTokens: 0,
            cachedTokens: 0,
            totalTokens: 0,
            completedAt: "2026-05-17T08:00:03Z",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
    ],
    async (captured) => {
      const artifacts: string[] = [];
      const result = await PlaygroundService.runAgentGeneration({
        prompt: "Create nested images",
        targetType: "image",
        selectedModel: "kling-v2",
        onArtifact: (artifact) => {
          artifacts.push(artifact.url);
        },
      });

      assert.deepEqual(artifacts, [
        "https://cdn.example.test/generated/nested-1.png",
        "https://cdn.example.test/generated/nested-2.png",
        "https://cdn.example.test/generated/nested-3.png",
      ]);
      assert.deepEqual(result.item.images, artifacts);
      assert.deepEqual(captured[6].body.responseJson.media, [
        {
          modality: "image",
          url: "https://cdn.example.test/generated/nested-1.png",
        },
        {
          modality: "image",
          url: "https://cdn.example.test/generated/nested-2.png",
        },
        {
          modality: "image",
          url: "https://cdn.example.test/generated/nested-3.png",
        },
      ]);
    },
    { authenticated: true },
  );
});

test("playground generation agent propagates Runtime SSE usage into Agent run and step completion", async () => {
  await withAppSdkResponses(
    [
      createPlaygroundAgentListResponse(),
      createPlaygroundAgentSessionResponse(),
      createPlaygroundAgentRunResponse(),
      createAgentRuntimeInvocationResponse(),
      createAgentRunStepResponse(),
      [
        'data: {"id":"runtime-event-1","invocationId":"runtime-invocation-1","eventNo":1,"eventType":"message.delta","eventSource":"runtime","textDelta":"Usage aware answer.","payloadJson":{},"createdAt":"2026-05-17T08:00:01Z"}',
        'data: {"id":"runtime-event-2","invocationId":"runtime-invocation-1","eventNo":2,"eventType":"runtime.usage","eventSource":"runtime","payloadJson":{"usage":{"prompt_tokens":12,"completion_tokens":8,"cached_tokens":3,"total_tokens":23}},"createdAt":"2026-05-17T08:00:02Z"}',
        "data: [DONE]",
        "",
      ].join("\n"),
      {
        code: "2000",
        data: {
          item: {
            id: "runtime-invocation-1",
            invocationNo: 1,
            invocationType: "agent_run",
            runtime: "openai_compatible",
            model: "kling-v2",
            status: "completed",
            streaming: true,
            attemptNo: 1,
            agentSessionId: "agent-session-1",
            agentRunId: "agent-run-1",
            completedAt: "2026-05-17T08:00:03Z",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
      {
        code: "2000",
        data: {
          item: {
            ...createAgentRunStepResponse().data.item,
            status: "completed",
            inputTokens: 12,
            outputTokens: 8,
            cachedTokens: 3,
            totalTokens: 23,
            completedAt: "2026-05-17T08:00:03Z",
          },
        },
      },
      {
        code: "2000",
        data: {
          item: {
            id: "agent-run-1",
            sessionId: "agent-session-1",
            agentId: "101",
            agentVersionId: "201",
            requestId: "request-1",
            status: "completed",
            sourceSurface: "playground",
            inputMessage: "Create a launch title",
            outputMessage: "Usage aware answer.",
            runtime: "openai_compatible",
            model: "kling-v2",
            executionMode: "interactive",
            totalSteps: 1,
            inputTokens: 12,
            outputTokens: 8,
            cachedTokens: 3,
            totalTokens: 23,
            completedAt: "2026-05-17T08:00:03Z",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
    ],
    async (captured) => {
      const result = await PlaygroundService.runAgentGeneration({
        prompt: "Create a launch title",
        selectedModel: "kling-v2",
      });

      const expectedUsage = {
        cachedTokens: 3,
        inputTokens: 12,
        outputTokens: 8,
        totalTokens: 23,
      };
      assert.deepEqual(captured[6].body.usageJson, expectedUsage);
      assert.deepEqual(captured[7].body.usageJson, expectedUsage);
      assert.deepEqual(captured[8].body.usageJson, expectedUsage);
      assert.equal(result.usage.promptTokens, 12);
      assert.equal(result.usage.completionTokens, 8);
      assert.equal(result.usage.cachedTokens, 3);
      assert.equal(result.usage.totalTokens, 23);
    },
    { authenticated: true },
  );
});

test("playground generation agent ignores non-media URLs in Runtime SSE generation payloads", async () => {
  await withAppSdkResponses(
    [
      createPlaygroundAgentListResponse(),
      createPlaygroundAgentSessionResponse(),
      createPlaygroundAgentRunResponse(),
      createAgentRuntimeInvocationResponse(),
      createAgentRunStepResponse(),
      [
        'data: {"id":"runtime-event-1","invocationId":"runtime-invocation-1","eventNo":1,"eventType":"runtime.output","eventSource":"generation","payloadJson":{"data":{"url":"https://api.example.test/jobs/job-1"}},"createdAt":"2026-05-17T08:00:01Z"}',
        "data: [DONE]",
        "",
      ].join("\n"),
      {
        code: "2000",
        data: {
          item: {
            id: "runtime-invocation-1",
            invocationNo: 1,
            invocationType: "agent_run",
            runtime: "openai_compatible",
            model: "kling-v2",
            status: "failed",
            streaming: true,
            attemptNo: 1,
            agentSessionId: "agent-session-1",
            agentRunId: "agent-run-1",
            completedAt: "2026-05-17T08:00:01Z",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
      createFailedAgentRunStepResponse(),
      createFailedAgentRunResponse(),
    ],
    async (captured) => {
      await assert.rejects(
        () => PlaygroundService.runAgentGeneration({
          prompt: "Create media",
          targetType: "image",
          selectedModel: "kling-v2",
        }),
        /playground\.agent\.errors\.runtimeUnavailable/,
      );

      assert.equal(captured[6].body.status, "failed");
      assert.equal(captured[6].body.errorCode, "runtime_stream_empty");
    },
    { authenticated: true },
  );
});

test("playground generation agent ignores media-shaped URLs from non-artifact Runtime SSE payloads", async () => {
  await withAppSdkResponses(
    [
      createPlaygroundAgentListResponse(),
      createPlaygroundAgentSessionResponse(),
      createPlaygroundAgentRunResponse(),
      createAgentRuntimeInvocationResponse(),
      createAgentRunStepResponse(),
      [
        'data: {"id":"runtime-event-1","invocationId":"runtime-invocation-1","eventNo":1,"eventType":"message.delta","eventSource":"runtime","textDelta":"See https://cdn.example.test/reference.png","payloadJson":{"data":{"url":"https://cdn.example.test/reference.png"}},"createdAt":"2026-05-17T08:00:01Z"}',
        "data: [DONE]",
        "",
      ].join("\n"),
      {
        code: "2000",
        data: {
          item: {
            id: "runtime-invocation-1",
            invocationNo: 1,
            invocationType: "agent_run",
            runtime: "openai_compatible",
            model: "kling-v2",
            status: "completed",
            streaming: true,
            attemptNo: 1,
            agentSessionId: "agent-session-1",
            agentRunId: "agent-run-1",
            completedAt: "2026-05-17T08:00:03Z",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
      createCompletedAgentRunStepResponse(),
      {
        code: "2000",
        data: {
          item: {
            id: "agent-run-1",
            sessionId: "agent-session-1",
            agentId: "101",
            agentVersionId: "201",
            requestId: "request-1",
            status: "completed",
            sourceSurface: "playground",
            inputMessage: "Create media",
            outputMessage: "See https://cdn.example.test/reference.png",
            runtime: "openai_compatible",
            model: "kling-v2",
            executionMode: "interactive",
            totalSteps: 1,
            inputTokens: 0,
            outputTokens: 0,
            cachedTokens: 0,
            totalTokens: 0,
            completedAt: "2026-05-17T08:00:03Z",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
    ],
    async (captured) => {
      const artifacts: string[] = [];
      const result = await PlaygroundService.runAgentGeneration({
        prompt: "Create media",
        targetType: "image",
        selectedModel: "kling-v2",
        onArtifact: (artifact) => {
          artifacts.push(artifact.url);
        },
      });

      assert.deepEqual(artifacts, []);
      assert.deepEqual(result.item.images, []);
      assert.deepEqual(captured[6].body.responseJson, {
        outputText: "See https://cdn.example.test/reference.png",
      });
    },
    { authenticated: true },
  );
});

test("playground generation agent ignores top-level media URLs from non-artifact Runtime SSE payloads", async () => {
  await withAppSdkResponses(
    [
      createPlaygroundAgentListResponse(),
      createPlaygroundAgentSessionResponse(),
      createPlaygroundAgentRunResponse(),
      createAgentRuntimeInvocationResponse(),
      createAgentRunStepResponse(),
      [
        'data: {"id":"runtime-event-1","invocationId":"runtime-invocation-1","eventNo":1,"eventType":"message.delta","eventSource":"runtime","textDelta":"Reference image URL received.","payloadJson":{"url":"https://cdn.example.test/reference.png"},"createdAt":"2026-05-17T08:00:01Z"}',
        "data: [DONE]",
        "",
      ].join("\n"),
      {
        code: "2000",
        data: {
          item: {
            id: "runtime-invocation-1",
            invocationNo: 1,
            invocationType: "agent_run",
            runtime: "openai_compatible",
            model: "kling-v2",
            status: "completed",
            streaming: true,
            attemptNo: 1,
            agentSessionId: "agent-session-1",
            agentRunId: "agent-run-1",
            completedAt: "2026-05-17T08:00:03Z",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
      createCompletedAgentRunStepResponse(),
      {
        code: "2000",
        data: {
          item: {
            id: "agent-run-1",
            sessionId: "agent-session-1",
            agentId: "101",
            agentVersionId: "201",
            requestId: "request-1",
            status: "completed",
            sourceSurface: "playground",
            inputMessage: "Create media",
            outputMessage: "Reference image URL received.",
            runtime: "openai_compatible",
            model: "kling-v2",
            executionMode: "interactive",
            totalSteps: 1,
            inputTokens: 0,
            outputTokens: 0,
            cachedTokens: 0,
            totalTokens: 0,
            completedAt: "2026-05-17T08:00:03Z",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
    ],
    async (captured) => {
      const artifacts: string[] = [];
      const result = await PlaygroundService.runAgentGeneration({
        prompt: "Create media",
        targetType: "image",
        selectedModel: "kling-v2",
        onArtifact: (artifact) => {
          artifacts.push(artifact.url);
        },
      });

      assert.deepEqual(artifacts, []);
      assert.deepEqual(result.item.images, []);
      assert.deepEqual(captured[6].body.responseJson, {
        outputText: "Reference image URL received.",
      });
    },
    { authenticated: true },
  );
});

test("playground generation agent falls back to Runtime artifact list when SSE only signals artifact creation", async () => {
  await withAppSdkResponses(
    [
      createPlaygroundAgentListResponse(),
      createPlaygroundAgentSessionResponse(),
      createPlaygroundAgentRunResponse(),
      createAgentRuntimeInvocationResponse(),
      createAgentRunStepResponse(),
      [
        'data: {"id":"runtime-event-1","invocationId":"runtime-invocation-1","eventNo":1,"eventType":"artifact.created","eventSource":"runtime","payloadJson":{"artifactId":"runtime-artifact-1"},"createdAt":"2026-05-17T08:00:01Z"}',
        "data: [DONE]",
        "",
      ].join("\n"),
      {
        code: "2000",
        data: {
          items: [
            {
              id: "runtime-artifact-1",
              invocationId: "runtime-invocation-1",
              artifactType: "image",
              name: "generated.png",
              mimeType: "image/png",
              storageUrl: "https://cdn.example.test/generated/from-artifact-list.png",
              createdAt: "2026-05-17T08:00:01Z",
            },
          ],
        },
      },
      {
        code: "2000",
        data: {
          item: {
            id: "runtime-invocation-1",
            invocationNo: 1,
            invocationType: "agent_run",
            runtime: "openai_compatible",
            model: "kling-v2",
            status: "completed",
            streaming: true,
            attemptNo: 1,
            agentSessionId: "agent-session-1",
            agentRunId: "agent-run-1",
            completedAt: "2026-05-17T08:00:03Z",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
      createCompletedAgentRunStepResponse(),
      {
        code: "2000",
        data: {
          item: {
            id: "agent-run-1",
            sessionId: "agent-session-1",
            agentId: "101",
            agentVersionId: "201",
            requestId: "request-1",
            status: "completed",
            sourceSurface: "playground",
            inputMessage: "Create image",
            runtime: "openai_compatible",
            model: "kling-v2",
            executionMode: "interactive",
            totalSteps: 1,
            inputTokens: 0,
            outputTokens: 0,
            cachedTokens: 0,
            totalTokens: 0,
            completedAt: "2026-05-17T08:00:03Z",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
    ],
    async (captured) => {
      const artifacts: string[] = [];
      const result = await PlaygroundService.runAgentGeneration({
        prompt: "Create image",
        targetType: "image",
        selectedModel: "kling-v2",
        onArtifact: (artifact) => {
          artifacts.push(artifact.url);
        },
      });

      assert.deepEqual(captured.map((request) => `${request.method} ${request.url}`), [
        "GET /app/v3/api/agents?page_size=100&q=Playground%20Generation%20Agent",
        "POST /app/v3/api/agents/101/sessions",
        "POST /app/v3/api/agents/sessions/agent-session-1/runs",
        "POST /app/v3/api/runtime/invocations",
        "POST /app/v3/api/agents/runs/agent-run-1/steps",
        "GET /app/v3/api/runtime/invocations/runtime-invocation-1/events/stream",
        "GET /app/v3/api/runtime/invocations/runtime-invocation-1/artifacts?page_size=100",
        "POST /app/v3/api/runtime/invocations/runtime-invocation-1/complete",
        "POST /app/v3/api/agents/runs/agent-run-1/steps/agent-run-step-1/complete",
        "POST /app/v3/api/agents/runs/agent-run-1/complete",
      ]);
      assert.deepEqual(artifacts, ["https://cdn.example.test/generated/from-artifact-list.png"]);
      assert.deepEqual(result.item.images, ["https://cdn.example.test/generated/from-artifact-list.png"]);
      assert.deepEqual(captured[7].body.responseJson, {
        media: [
          {
            mimeType: "image/png",
            modality: "image",
            url: "https://cdn.example.test/generated/from-artifact-list.png",
          },
        ],
      });
    },
    { authenticated: true },
  );
});

test("playground generation agent does not query Runtime artifacts when SSE already contains artifact URLs", async () => {
  await withAppSdkResponses(
    [
      createPlaygroundAgentListResponse(),
      createPlaygroundAgentSessionResponse(),
      createPlaygroundAgentRunResponse(),
      createAgentRuntimeInvocationResponse(),
      createAgentRunStepResponse(),
      [
        'data: {"id":"runtime-event-1","invocationId":"runtime-invocation-1","eventNo":1,"eventType":"artifact.created","eventSource":"runtime","payloadJson":{"artifactId":"runtime-artifact-1","artifactType":"image","storageUrl":"https://cdn.example.test/generated/direct-artifact.png","mimeType":"image/png"},"createdAt":"2026-05-17T08:00:01Z"}',
        "data: [DONE]",
        "",
      ].join("\n"),
      {
        code: "2000",
        data: {
          item: {
            id: "runtime-invocation-1",
            invocationNo: 1,
            invocationType: "agent_run",
            runtime: "openai_compatible",
            model: "kling-v2",
            status: "completed",
            streaming: true,
            attemptNo: 1,
            agentSessionId: "agent-session-1",
            agentRunId: "agent-run-1",
            completedAt: "2026-05-17T08:00:03Z",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
      createCompletedAgentRunStepResponse(),
      {
        code: "2000",
        data: {
          item: {
            id: "agent-run-1",
            sessionId: "agent-session-1",
            agentId: "101",
            agentVersionId: "201",
            requestId: "request-1",
            status: "completed",
            sourceSurface: "playground",
            inputMessage: "Create image",
            runtime: "openai_compatible",
            model: "kling-v2",
            executionMode: "interactive",
            totalSteps: 1,
            inputTokens: 0,
            outputTokens: 0,
            cachedTokens: 0,
            totalTokens: 0,
            completedAt: "2026-05-17T08:00:03Z",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
    ],
    async (captured) => {
      const artifacts: string[] = [];
      const result = await PlaygroundService.runAgentGeneration({
        prompt: "Create image",
        targetType: "image",
        selectedModel: "kling-v2",
        onArtifact: (artifact) => {
          artifacts.push(artifact.url);
        },
      });

      assert.deepEqual(captured.map((request) => `${request.method} ${request.url}`), [
        "GET /app/v3/api/agents?page_size=100&q=Playground%20Generation%20Agent",
        "POST /app/v3/api/agents/101/sessions",
        "POST /app/v3/api/agents/sessions/agent-session-1/runs",
        "POST /app/v3/api/runtime/invocations",
        "POST /app/v3/api/agents/runs/agent-run-1/steps",
        "GET /app/v3/api/runtime/invocations/runtime-invocation-1/events/stream",
        "POST /app/v3/api/runtime/invocations/runtime-invocation-1/complete",
        "POST /app/v3/api/agents/runs/agent-run-1/steps/agent-run-step-1/complete",
        "POST /app/v3/api/agents/runs/agent-run-1/complete",
      ]);
      assert.deepEqual(artifacts, ["https://cdn.example.test/generated/direct-artifact.png"]);
      assert.deepEqual(result.item.images, ["https://cdn.example.test/generated/direct-artifact.png"]);
      assert.deepEqual(captured[6].body.responseJson.media, [
        {
          mimeType: "image/png",
          modality: "image",
          url: "https://cdn.example.test/generated/direct-artifact.png",
        },
      ]);
    },
    { authenticated: true },
  );
});

test("playground generation agent falls back to Runtime artifact list for nested SSE artifact references", async () => {
  await withAppSdkResponses(
    [
      createPlaygroundAgentListResponse(),
      createPlaygroundAgentSessionResponse(),
      createPlaygroundAgentRunResponse(),
      createAgentRuntimeInvocationResponse(),
      createAgentRunStepResponse(),
      [
        'data: {"id":"runtime-event-1","invocationId":"runtime-invocation-1","eventNo":1,"eventType":"runtime.artifact","eventSource":"runtime","payloadJson":{"artifact":{"id":"runtime-artifact-2"}},"createdAt":"2026-05-17T08:00:01Z"}',
        "data: [DONE]",
        "",
      ].join("\n"),
      {
        code: "2000",
        data: {
          items: [
            {
              id: "runtime-artifact-2",
              invocationId: "runtime-invocation-1",
              artifactType: "video",
              name: "generated.mp4",
              mimeType: "video/mp4",
              storageUrl: "https://cdn.example.test/generated/from-nested-artifact-list.mp4",
              createdAt: "2026-05-17T08:00:01Z",
            },
          ],
        },
      },
      {
        code: "2000",
        data: {
          item: {
            id: "runtime-invocation-1",
            invocationNo: 1,
            invocationType: "agent_run",
            runtime: "openai_compatible",
            model: "kling-v2",
            status: "completed",
            streaming: true,
            attemptNo: 1,
            agentSessionId: "agent-session-1",
            agentRunId: "agent-run-1",
            completedAt: "2026-05-17T08:00:03Z",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
      createCompletedAgentRunStepResponse(),
      {
        code: "2000",
        data: {
          item: {
            id: "agent-run-1",
            sessionId: "agent-session-1",
            agentId: "101",
            agentVersionId: "201",
            requestId: "request-1",
            status: "completed",
            sourceSurface: "playground",
            inputMessage: "Create video",
            runtime: "openai_compatible",
            model: "kling-v2",
            executionMode: "interactive",
            totalSteps: 1,
            inputTokens: 0,
            outputTokens: 0,
            cachedTokens: 0,
            totalTokens: 0,
            completedAt: "2026-05-17T08:00:03Z",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
    ],
    async (captured) => {
      const artifacts: string[] = [];
      const result = await PlaygroundService.runAgentGeneration({
        prompt: "Create video",
        targetType: "video",
        selectedModel: "kling-v2",
        onArtifact: (artifact) => {
          artifacts.push(`${artifact.modality}:${artifact.url}`);
        },
      });

      assert.deepEqual(captured.map((request) => `${request.method} ${request.url}`), [
        "GET /app/v3/api/agents?page_size=100&q=Playground%20Generation%20Agent",
        "POST /app/v3/api/agents/101/sessions",
        "POST /app/v3/api/agents/sessions/agent-session-1/runs",
        "POST /app/v3/api/runtime/invocations",
        "POST /app/v3/api/agents/runs/agent-run-1/steps",
        "GET /app/v3/api/runtime/invocations/runtime-invocation-1/events/stream",
        "GET /app/v3/api/runtime/invocations/runtime-invocation-1/artifacts?page_size=100",
        "POST /app/v3/api/runtime/invocations/runtime-invocation-1/complete",
        "POST /app/v3/api/agents/runs/agent-run-1/steps/agent-run-step-1/complete",
        "POST /app/v3/api/agents/runs/agent-run-1/complete",
      ]);
      assert.deepEqual(artifacts, ["video:https://cdn.example.test/generated/from-nested-artifact-list.mp4"]);
      assert.deepEqual(result.item.videos, [
        { url: "https://cdn.example.test/generated/from-nested-artifact-list.mp4" },
      ]);
      assert.deepEqual(captured[7].body.responseJson.media, [
        {
          mimeType: "video/mp4",
          modality: "video",
          url: "https://cdn.example.test/generated/from-nested-artifact-list.mp4",
        },
      ]);
    },
    { authenticated: true },
  );
});

test("playground generation agent normalizes common media URL aliases and millisecond durations from Runtime artifacts", async () => {
  await withAppSdkResponses(
    [
      createPlaygroundAgentListResponse(),
      createPlaygroundAgentSessionResponse(),
      createPlaygroundAgentRunResponse(),
      createAgentRuntimeInvocationResponse(),
      createAgentRunStepResponse(),
      [
        'data: {"id":"runtime-event-1","invocationId":"runtime-invocation-1","eventNo":1,"eventType":"runtime.artifact","eventSource":"runtime","payloadJson":{"artifact":{"id":"runtime-artifact-3"}},"createdAt":"2026-05-17T08:00:01Z"}',
        "data: [DONE]",
        "",
      ].join("\n"),
      {
        code: "2000",
        data: {
          items: [
            {
              id: "runtime-artifact-3",
              invocationId: "runtime-invocation-1",
              artifactType: "video",
              name: "generated.mp4",
              mimeType: "video/mp4",
              downloadUrl: "https://cdn.example.test/generated/download-url-video.mp4",
              posterUrl: "https://cdn.example.test/generated/download-url-video.jpg",
              durationMs: 12000,
              createdAt: "2026-05-17T08:00:01Z",
            },
          ],
        },
      },
      {
        code: "2000",
        data: {
          item: {
            id: "runtime-invocation-1",
            invocationNo: 1,
            invocationType: "agent_run",
            runtime: "openai_compatible",
            model: "kling-v2",
            status: "completed",
            streaming: true,
            attemptNo: 1,
            agentSessionId: "agent-session-1",
            agentRunId: "agent-run-1",
            completedAt: "2026-05-17T08:00:03Z",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
      createCompletedAgentRunStepResponse(),
      {
        code: "2000",
        data: {
          item: {
            id: "agent-run-1",
            sessionId: "agent-session-1",
            agentId: "101",
            agentVersionId: "201",
            requestId: "request-1",
            status: "completed",
            sourceSurface: "playground",
            inputMessage: "Create video",
            runtime: "openai_compatible",
            model: "kling-v2",
            executionMode: "interactive",
            totalSteps: 1,
            inputTokens: 0,
            outputTokens: 0,
            cachedTokens: 0,
            totalTokens: 0,
            completedAt: "2026-05-17T08:00:03Z",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
    ],
    async (captured) => {
      const artifacts: string[] = [];
      const result = await PlaygroundService.runAgentGeneration({
        prompt: "Create video",
        targetType: "video",
        selectedModel: "kling-v2",
        onArtifact: (artifact) => {
          artifacts.push(`${artifact.url}:${artifact.durationSeconds}:${artifact.thumb}`);
        },
      });

      assert.deepEqual(artifacts, [
        "https://cdn.example.test/generated/download-url-video.mp4:12:https://cdn.example.test/generated/download-url-video.jpg",
      ]);
      assert.equal(result.item.durationSeconds, 12);
      assert.deepEqual(result.item.videos, [
        {
          url: "https://cdn.example.test/generated/download-url-video.mp4",
          thumb: "https://cdn.example.test/generated/download-url-video.jpg",
        },
      ]);
      assert.deepEqual(captured[7].body.responseJson.media, [
        {
          durationSeconds: 12,
          mimeType: "video/mp4",
          modality: "video",
          thumb: "https://cdn.example.test/generated/download-url-video.jpg",
          url: "https://cdn.example.test/generated/download-url-video.mp4",
        },
      ]);
    },
    { authenticated: true },
  );
});

test("playground agent SSE preserves whitespace-only runtime deltas", async () => {
  await withAppSdkResponses(
    [
      {
        code: "2000",
        data: {
          items: [
            {
              id: "101",
              ownerUserId: 30,
              code: "playground-generation-agent",
              name: "Playground Generation Agent",
              description: "Routes playground generation requests through Runtime SSE.",
              visibility: "private",
              status: "active",
              createdAt: "2026-05-17T08:00:00Z",
              updatedAt: "2026-05-17T08:00:00Z",
              defaultVersion: {
                id: "201",
                versionNo: 1,
                releaseStatus: "published",
                model: "kling-v2",
                systemPrompt: "You are the Playground generation runtime coordinator.",
                toolPolicy: {},
                memoryPolicy: {},
                mcpPolicy: {},
                skillPolicy: {},
                runtimePolicy: {},
                createdAt: "2026-05-17T08:00:00Z",
                updatedAt: "2026-05-17T08:00:00Z",
              },
              capabilities: {
                memoryEnabled: false,
                mcpServerCount: 0,
                skillBindingCount: 0,
              },
            },
          ],
        },
      },
      {
        code: "2000",
        data: {
          item: {
            id: "agent-session-1",
            agentId: "101",
            agentVersionId: "201",
            title: "Create a launch title",
            sessionKind: "interactive",
            sourceSurface: "playground",
            status: "active",
            runtime: "openai",
            defaultModel: "kling-v2",
            runCount: 0,
            stepCount: 0,
            toolCallCount: 0,
            createdAt: "2026-05-17T08:00:00Z",
            updatedAt: "2026-05-17T08:00:00Z",
          },
        },
      },
      {
        code: "2000",
        data: {
          item: {
            id: "agent-run-1",
            sessionId: "agent-session-1",
            agentId: "101",
            agentVersionId: "201",
            requestId: "request-1",
            status: "running",
            sourceSurface: "playground",
            inputMessage: "Create a launch title",
            runtime: "openai_compatible",
            model: "kling-v2",
            executionMode: "interactive",
            totalSteps: 0,
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
      {
        code: "2000",
        data: {
          item: {
            id: "runtime-invocation-1",
            invocationNo: 1,
            invocationType: "agent_run",
            runtime: "openai_compatible",
            model: "kling-v2",
            status: "streaming",
            streaming: true,
            attemptNo: 1,
            agentSessionId: "agent-session-1",
            agentRunId: "agent-run-1",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
      {
        code: "2000",
        data: {
          item: {
            id: "agent-run-step-1",
            runId: "agent-run-1",
            stepIndex: 1,
            stepType: "runtime",
            status: "running",
            title: "Runtime stream",
            model: "kling-v2",
            runtimeInvocationId: "runtime-invocation-1",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
      [
        'data: {"id":"runtime-event-1","invocationId":"runtime-invocation-1","eventNo":1,"eventType":"message.delta","eventSource":"runtime","textDelta":"Hello","createdAt":"2026-05-17T08:00:01Z"}',
        'data: {"id":"runtime-event-2","invocationId":"runtime-invocation-1","eventNo":2,"eventType":"message.delta","eventSource":"runtime","textDelta":" ","createdAt":"2026-05-17T08:00:02Z"}',
        'data: {"id":"runtime-event-3","invocationId":"runtime-invocation-1","eventNo":3,"eventType":"message.delta","eventSource":"runtime","textDelta":"world","createdAt":"2026-05-17T08:00:03Z"}',
        "data: [DONE]",
        "",
      ].join("\n"),
      {
        code: "2000",
        data: {
          item: {
            id: "runtime-invocation-1",
            invocationNo: 1,
            invocationType: "agent_run",
            runtime: "openai_compatible",
            model: "kling-v2",
            status: "completed",
            streaming: true,
            attemptNo: 1,
            agentSessionId: "agent-session-1",
            agentRunId: "agent-run-1",
            completedAt: "2026-05-17T08:00:04Z",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
      createCompletedAgentRunStepResponse(),
      {
        code: "2000",
        data: {
          item: {
            id: "agent-run-1",
            sessionId: "agent-session-1",
            agentId: "101",
            agentVersionId: "201",
            requestId: "request-1",
            status: "completed",
            sourceSurface: "playground",
            inputMessage: "Create a launch title",
            outputMessage: "Hello world",
            runtime: "openai_compatible",
            model: "kling-v2",
            executionMode: "interactive",
            totalSteps: 1,
            inputTokens: 0,
            outputTokens: 0,
            cachedTokens: 0,
            totalTokens: 0,
            completedAt: "2026-05-17T08:00:04Z",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
    ],
    async (captured) => {
      const deltas: string[] = [];
      const result = await PlaygroundService.runAgentGeneration({
        prompt: "Create a launch title",
        selectedModel: "kling-v2",
        onDelta: (delta) => {
          deltas.push(delta);
        },
      });

      assert.deepEqual(deltas, ["Hello", " ", "world"]);
      assert.equal(captured[6].body.responseJson.outputText, "Hello world");
      assert.equal(captured[7].body.status, "completed");
      assert.equal(captured[7].body.outputJson.outputText, "Hello world");
      assert.equal(captured[8].body.outputMessage, "Hello world");
      assert.equal(result.item.outputText, "Hello world");
    },
    { authenticated: true },
  );
});

test("playground agent SSE reads provider-compatible payload-only runtime deltas", async () => {
  await withAppSdkResponses(
    [
      createPlaygroundAgentListResponse(),
      createPlaygroundAgentSessionResponse(),
      createPlaygroundAgentRunResponse(),
      createAgentRuntimeInvocationResponse(),
      createAgentRunStepResponse(),
      [
        'data: {"id":"runtime-event-1","invocationId":"runtime-invocation-1","eventNo":1,"eventType":"message.delta","eventSource":"runtime","payloadJson":{"textDelta":"Hello"},"createdAt":"2026-05-17T08:00:01Z"}',
        'data: {"id":"runtime-event-2","invocationId":"runtime-invocation-1","eventNo":2,"eventType":"message.delta","eventSource":"runtime","payloadJson":{"choices":[{"delta":{"content":" "}}]},"createdAt":"2026-05-17T08:00:02Z"}',
        'data: {"id":"runtime-event-3","invocationId":"runtime-invocation-1","eventNo":3,"eventType":"message.delta","eventSource":"runtime","payloadJson":{"content":"world"},"createdAt":"2026-05-17T08:00:03Z"}',
        "data: [DONE]",
        "",
      ].join("\n"),
      {
        code: "2000",
        data: {
          item: {
            id: "runtime-invocation-1",
            invocationNo: 1,
            invocationType: "agent_run",
            runtime: "openai_compatible",
            model: "kling-v2",
            status: "completed",
            streaming: true,
            attemptNo: 1,
            agentSessionId: "agent-session-1",
            agentRunId: "agent-run-1",
            completedAt: "2026-05-17T08:00:04Z",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
      createCompletedAgentRunStepResponse(),
      {
        code: "2000",
        data: {
          item: {
            id: "agent-run-1",
            sessionId: "agent-session-1",
            agentId: "101",
            agentVersionId: "201",
            requestId: "request-1",
            status: "completed",
            sourceSurface: "playground",
            inputMessage: "Create a launch title",
            outputMessage: "Hello world",
            runtime: "openai_compatible",
            model: "kling-v2",
            executionMode: "interactive",
            totalSteps: 1,
            inputTokens: 0,
            outputTokens: 0,
            cachedTokens: 0,
            totalTokens: 0,
            completedAt: "2026-05-17T08:00:04Z",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
    ],
    async (captured) => {
      const deltas: string[] = [];
      const result = await PlaygroundService.runAgentGeneration({
        prompt: "Create a launch title",
        selectedModel: "kling-v2",
        onDelta: (delta) => {
          deltas.push(delta);
        },
      });

      assert.deepEqual(deltas, ["Hello", " ", "world"]);
      assert.equal(captured[6].body.responseJson.outputText, "Hello world");
      assert.equal(captured[7].body.outputJson.outputText, "Hello world");
      assert.equal(result.item.outputText, "Hello world");
    },
    { authenticated: true },
  );
});

test("playground agent SSE ignores text-shaped payloads on non-text Runtime events", async () => {
  await withAppSdkResponses(
    [
      createPlaygroundAgentListResponse(),
      createPlaygroundAgentSessionResponse(),
      createPlaygroundAgentRunResponse(),
      createAgentRuntimeInvocationResponse(),
      createAgentRunStepResponse(),
      [
        'data: {"id":"runtime-event-1","invocationId":"runtime-invocation-1","eventNo":1,"eventType":"runtime.artifact","eventSource":"runtime","textDelta":"Top-level artifact text must not become output text.","payloadJson":{"content":"This artifact description must not become output text.","artifact":{"id":"runtime-artifact-4","type":"image","url":"https://cdn.example.test/generated/non-text-event.png"}},"createdAt":"2026-05-17T08:00:01Z"}',
        "data: [DONE]",
        "",
      ].join("\n"),
      {
        code: "2000",
        data: {
          item: {
            id: "runtime-invocation-1",
            invocationNo: 1,
            invocationType: "agent_run",
            runtime: "openai_compatible",
            model: "kling-v2",
            status: "completed",
            streaming: true,
            attemptNo: 1,
            agentSessionId: "agent-session-1",
            agentRunId: "agent-run-1",
            completedAt: "2026-05-17T08:00:04Z",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
      createCompletedAgentRunStepResponse(),
      {
        code: "2000",
        data: {
          item: {
            id: "agent-run-1",
            sessionId: "agent-session-1",
            agentId: "101",
            agentVersionId: "201",
            requestId: "request-1",
            status: "completed",
            sourceSurface: "playground",
            inputMessage: "Create an image",
            runtime: "openai_compatible",
            model: "kling-v2",
            executionMode: "interactive",
            totalSteps: 1,
            completedAt: "2026-05-17T08:00:04Z",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
    ],
    async (captured) => {
      const deltas: string[] = [];
      const result = await PlaygroundService.runAgentGeneration({
        prompt: "Create an image",
        selectedModel: "kling-v2",
        onDelta: (delta) => {
          deltas.push(delta);
        },
      });

      assert.deepEqual(deltas, []);
      assert.equal(result.item.outputText, undefined);
      assert.deepEqual(result.item.images, ["https://cdn.example.test/generated/non-text-event.png"]);
      assert.deepEqual(captured[6].body.responseJson, {
        media: [
          {
            modality: "image",
            url: "https://cdn.example.test/generated/non-text-event.png",
          },
        ],
      });
    },
    { authenticated: true },
  );
});

test("playground agent SSE empty output fails the runtime invocation and run", async () => {
  await withAppSdkResponses(
    [
      {
        code: "2000",
        data: {
          items: [
            {
              id: "101",
              ownerUserId: 30,
              code: "playground-generation-agent",
              name: "Playground Generation Agent",
              description: "Routes playground generation requests through Runtime SSE.",
              visibility: "private",
              status: "active",
              createdAt: "2026-05-17T08:00:00Z",
              updatedAt: "2026-05-17T08:00:00Z",
              defaultVersion: {
                id: "201",
                versionNo: 1,
                releaseStatus: "published",
                model: "kling-v2",
                systemPrompt: "You are the Playground generation runtime coordinator.",
                toolPolicy: {},
                memoryPolicy: {},
                mcpPolicy: {},
                skillPolicy: {},
                runtimePolicy: {},
                createdAt: "2026-05-17T08:00:00Z",
                updatedAt: "2026-05-17T08:00:00Z",
              },
              capabilities: {
                memoryEnabled: false,
                mcpServerCount: 0,
                skillBindingCount: 0,
              },
            },
          ],
        },
      },
      {
        code: "2000",
        data: {
          item: {
            id: "agent-session-1",
            agentId: "101",
            agentVersionId: "201",
            title: "Create an empty stream",
            sessionKind: "interactive",
            sourceSurface: "playground",
            status: "active",
            runtime: "openai",
            defaultModel: "kling-v2",
            runCount: 0,
            stepCount: 0,
            toolCallCount: 0,
            createdAt: "2026-05-17T08:00:00Z",
            updatedAt: "2026-05-17T08:00:00Z",
          },
        },
      },
      {
        code: "2000",
        data: {
          item: {
            id: "agent-run-1",
            sessionId: "agent-session-1",
            agentId: "101",
            agentVersionId: "201",
            requestId: "request-1",
            status: "running",
            sourceSurface: "playground",
            inputMessage: "Create an empty stream",
            runtime: "openai_compatible",
            model: "kling-v2",
            executionMode: "interactive",
            totalSteps: 0,
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
      {
        code: "2000",
        data: {
          item: {
            id: "runtime-invocation-1",
            invocationNo: 1,
            invocationType: "agent_run",
            runtime: "openai_compatible",
            model: "kling-v2",
            status: "streaming",
            streaming: true,
            attemptNo: 1,
            agentSessionId: "agent-session-1",
            agentRunId: "agent-run-1",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
      {
        code: "2000",
        data: {
          item: {
            id: "agent-run-step-1",
            runId: "agent-run-1",
            stepIndex: 1,
            stepType: "runtime",
            status: "running",
            title: "Runtime stream",
            model: "kling-v2",
            runtimeInvocationId: "runtime-invocation-1",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
      ["data: [DONE]", ""].join("\n"),
      {
        code: "2000",
        data: {
          item: {
            id: "runtime-invocation-1",
            invocationNo: 1,
            invocationType: "agent_run",
            runtime: "openai_compatible",
            model: "kling-v2",
            status: "failed",
            streaming: true,
            attemptNo: 1,
            agentSessionId: "agent-session-1",
            agentRunId: "agent-run-1",
            completedAt: "2026-05-17T08:00:01Z",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
      createFailedAgentRunStepResponse(),
      {
        code: "2000",
        data: {
          item: {
            id: "agent-run-1",
            sessionId: "agent-session-1",
            agentId: "101",
            agentVersionId: "201",
            requestId: "request-1",
            status: "failed",
            sourceSurface: "playground",
            inputMessage: "Create an empty stream",
            runtime: "openai_compatible",
            model: "kling-v2",
            executionMode: "interactive",
            totalSteps: 1,
            completedAt: "2026-05-17T08:00:01Z",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
    ],
    async (captured) => {
      await assert.rejects(
        () => PlaygroundService.runAgentGeneration({
          prompt: "Create an empty stream",
          selectedModel: "kling-v2",
        }),
        /playground\.agent\.errors\.runtimeUnavailable/,
      );

      assert.deepEqual(captured.map((request) => `${request.method} ${request.url}`), [
        "GET /app/v3/api/agents?page_size=100&q=Playground%20Generation%20Agent",
        "POST /app/v3/api/agents/101/sessions",
        "POST /app/v3/api/agents/sessions/agent-session-1/runs",
        "POST /app/v3/api/runtime/invocations",
        "POST /app/v3/api/agents/runs/agent-run-1/steps",
        "GET /app/v3/api/runtime/invocations/runtime-invocation-1/events/stream",
        "POST /app/v3/api/runtime/invocations/runtime-invocation-1/complete",
        "POST /app/v3/api/agents/runs/agent-run-1/steps/agent-run-step-1/complete",
        "POST /app/v3/api/agents/runs/agent-run-1/complete",
      ]);
      assert.equal(captured[6].body.status, "failed");
      assert.equal(captured[6].body.errorCode, "runtime_stream_empty");
      assert.equal(captured[7].body.status, "failed");
      assert.equal(captured[7].body.errorMessageMasked, "Runtime stream completed without agent output");
      assert.equal(captured[8].body.status, "failed");
      assert.equal(captured[8].body.outputMessage, undefined);
    },
    { authenticated: true },
  );
});

test("playground chat SSE preserves whitespace-only runtime deltas", async () => {
  await withAppSdkResponses(
    [
      {
        code: "2000",
        data: {
          item: {
            id: "conversation-1",
            title: "Say hello",
            sourceSurface: "playground",
            status: "active",
            defaultModel: "gpt-4.1-mini",
            defaultProvider: "openai",
            messageCount: 0,
            turnCount: 0,
            createdAt: "2026-05-17T08:00:00Z",
            updatedAt: "2026-05-17T08:00:00Z",
          },
        },
      },
      {
        code: "2000",
        data: {
          turn: {
            id: "turn-1",
            conversationId: "conversation-1",
            turnNo: 1,
            role: "user",
            mode: "chat",
            status: "running",
            userMessageId: "message-user-1",
            createdAt: "2026-05-17T08:00:00Z",
            updatedAt: "2026-05-17T08:00:00Z",
          },
          messages: [
            {
              id: "message-user-1",
              conversationId: "conversation-1",
              turnId: "turn-1",
              role: "user",
              direction: "input",
              content: "Say hello",
              status: "completed",
              createdAt: "2026-05-17T08:00:00Z",
            },
          ],
        },
      },
      {
        code: "2000",
        data: {
          item: {
            id: "runtime-invocation-1",
            invocationNo: 1,
            invocationType: "chat_response",
            runtime: "openai_compatible",
            model: "gpt-4.1-mini",
            provider: "openai",
            status: "streaming",
            streaming: true,
            attemptNo: 1,
            conversationId: "conversation-1",
            chatTurnId: "turn-1",
            chatItemId: "message-user-1",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
      [
        'data: {"id":"runtime-event-1","invocationId":"runtime-invocation-1","eventNo":1,"eventType":"message.delta","eventSource":"runtime","textDelta":"Hello","createdAt":"2026-05-17T08:00:01Z"}',
        'data: {"id":"runtime-event-2","invocationId":"runtime-invocation-1","eventNo":2,"eventType":"message.delta","eventSource":"runtime","textDelta":" ","createdAt":"2026-05-17T08:00:02Z"}',
        'data: {"id":"runtime-event-3","invocationId":"runtime-invocation-1","eventNo":3,"eventType":"message.delta","eventSource":"runtime","textDelta":"there","createdAt":"2026-05-17T08:00:03Z"}',
        "data: [DONE]",
        "",
      ].join("\n"),
      {
        code: "2000",
        data: {
          item: {
            id: "runtime-invocation-1",
            invocationNo: 1,
            invocationType: "chat_response",
            runtime: "openai_compatible",
            model: "gpt-4.1-mini",
            provider: "openai",
            status: "completed",
            streaming: true,
            attemptNo: 1,
            conversationId: "conversation-1",
            chatTurnId: "turn-1",
            chatItemId: "message-user-1",
            completedAt: "2026-05-17T08:00:04Z",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
      {
        code: "2000",
        data: {
          turn: {
            id: "turn-1",
            conversationId: "conversation-1",
            turnNo: 1,
            role: "user",
            mode: "chat",
            status: "completed",
            userMessageId: "message-user-1",
            assistantMessageId: "message-assistant-1",
            createdAt: "2026-05-17T08:00:00Z",
            updatedAt: "2026-05-17T08:00:04Z",
          },
          messages: [
            {
              id: "message-user-1",
              conversationId: "conversation-1",
              turnId: "turn-1",
              role: "user",
              direction: "input",
              content: "Say hello",
              status: "completed",
              createdAt: "2026-05-17T08:00:00Z",
            },
            {
              id: "message-assistant-1",
              conversationId: "conversation-1",
              turnId: "turn-1",
              role: "assistant",
              direction: "output",
              content: "Hello there",
              status: "completed",
              model: "gpt-4.1-mini",
              provider: "openai",
              createdAt: "2026-05-17T08:00:04Z",
            },
          ],
        },
      },
    ],
    async (captured) => {
      const deltas: string[] = [];
      const result = await ChatService.sendMessage({
        messages: [],
        onDelta: (delta) => {
          deltas.push(delta);
        },
        prompt: "Say hello",
        selectedModel: {
          id: "gpt-4.1-mini",
          catalogKey: "openai/gpt-4.1-mini",
          model: "gpt-4.1-mini",
          name: "GPT-4.1 Mini",
          displayName: "GPT-4.1 Mini",
          desc: "OpenAI GPT-4.1 Mini",
          versionLabel: "4.1",
          ver: "4.1",
          vendorCode: "openai",
          vendorName: "OpenAI",
          modalities: ["text"],
          inputModalities: ["text"],
          outputModalities: ["text"],
          capabilities: ["chat"],
          officialReferencePrices: [],
          priceAvailability: { status: "unavailable" },
          supportsStreaming: true,
          supportsTools: false,
          supportsJsonSchema: false,
        },
      });

      assert.deepEqual(deltas, ["Hello", " ", "there"]);
      assert.equal(captured[4].body.responseJson.outputText, "Hello there");
      assert.equal(captured[5].body.message, "Hello there");
      assert.equal(result.assistantMessage.content, "Hello there");
      assert.equal(result.session.preview, "Hello there");
    },
    { authenticated: true },
  );
});

test("playground chat SSE reads provider-compatible payload-only runtime deltas", async () => {
  await withAppSdkResponses(
    [
      createChatConversationResponse(),
      createChatTurnResponse(),
      createChatRuntimeInvocationResponse(),
      [
        'data: {"id":"runtime-event-1","invocationId":"runtime-invocation-1","eventNo":1,"eventType":"message.delta","eventSource":"runtime","payloadJson":{"textDelta":"Hello"},"createdAt":"2026-05-17T08:00:01Z"}',
        'data: {"id":"runtime-event-2","invocationId":"runtime-invocation-1","eventNo":2,"eventType":"message.delta","eventSource":"runtime","payloadJson":{"choices":[{"delta":{"content":" "}}]},"createdAt":"2026-05-17T08:00:02Z"}',
        'data: {"id":"runtime-event-3","invocationId":"runtime-invocation-1","eventNo":3,"eventType":"message.delta","eventSource":"runtime","payloadJson":{"content":"there"},"createdAt":"2026-05-17T08:00:03Z"}',
        "data: [DONE]",
        "",
      ].join("\n"),
      {
        code: "2000",
        data: {
          item: {
            id: "runtime-invocation-1",
            invocationNo: 1,
            invocationType: "chat_response",
            runtime: "openai_compatible",
            model: "gpt-4.1-mini",
            provider: "openai",
            status: "completed",
            streaming: true,
            attemptNo: 1,
            conversationId: "conversation-1",
            chatTurnId: "turn-1",
            chatItemId: "message-user-1",
            completedAt: "2026-05-17T08:00:04Z",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
      {
        code: "2000",
        data: {
          turn: {
            id: "turn-1",
            conversationId: "conversation-1",
            turnNo: 1,
            role: "user",
            mode: "chat",
            status: "completed",
            userMessageId: "message-user-1",
            assistantMessageId: "message-assistant-1",
            createdAt: "2026-05-17T08:00:00Z",
            updatedAt: "2026-05-17T08:00:04Z",
          },
          messages: [
            {
              id: "message-user-1",
              conversationId: "conversation-1",
              turnId: "turn-1",
              role: "user",
              direction: "input",
              content: "Say hello",
              status: "completed",
              createdAt: "2026-05-17T08:00:00Z",
            },
            {
              id: "message-assistant-1",
              conversationId: "conversation-1",
              turnId: "turn-1",
              role: "assistant",
              direction: "output",
              content: "Hello there",
              status: "completed",
              model: "gpt-4.1-mini",
              provider: "openai",
              createdAt: "2026-05-17T08:00:04Z",
            },
          ],
        },
      },
    ],
    async (captured) => {
      const deltas: string[] = [];
      const result = await ChatService.sendMessage({
        messages: [],
        onDelta: (delta) => {
          deltas.push(delta);
        },
        prompt: "Say hello",
        selectedModel: createChatTestModel(),
      });

      assert.deepEqual(deltas, ["Hello", " ", "there"]);
      assert.equal(captured[4].body.responseJson.outputText, "Hello there");
      assert.equal(captured[5].body.message, "Hello there");
      assert.equal(result.assistantMessage.content, "Hello there");
      assert.equal(result.session.preview, "Hello there");
    },
    { authenticated: true },
  );
});

test("playground chat SSE propagates Runtime usage into invocation and turn response completion", async () => {
  await withAppSdkResponses(
    [
      createChatConversationResponse(),
      createChatTurnResponse(),
      createChatRuntimeInvocationResponse(),
      [
        'data: {"id":"runtime-event-1","invocationId":"runtime-invocation-1","eventNo":1,"eventType":"message.delta","eventSource":"runtime","payloadJson":{"textDelta":"Hello usage"},"createdAt":"2026-05-17T08:00:01Z"}',
        'data: {"id":"runtime-event-2","invocationId":"runtime-invocation-1","eventNo":2,"eventType":"runtime.usage","eventSource":"runtime","payloadJson":{"usage":{"input_tokens":9,"output_tokens":4,"cached_tokens":2,"total_tokens":15}},"createdAt":"2026-05-17T08:00:02Z"}',
        "data: [DONE]",
        "",
      ].join("\n"),
      {
        code: "2000",
        data: {
          item: {
            id: "runtime-invocation-1",
            invocationNo: 1,
            invocationType: "chat_response",
            runtime: "openai_compatible",
            model: "gpt-4.1-mini",
            provider: "openai",
            status: "completed",
            streaming: true,
            attemptNo: 1,
            conversationId: "conversation-1",
            chatTurnId: "turn-1",
            chatItemId: "message-user-1",
            completedAt: "2026-05-17T08:00:04Z",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
      {
        code: "2000",
        data: {
          turn: {
            id: "turn-1",
            conversationId: "conversation-1",
            turnNo: 1,
            role: "user",
            mode: "chat",
            status: "completed",
            userMessageId: "message-user-1",
            assistantMessageId: "message-assistant-1",
            createdAt: "2026-05-17T08:00:00Z",
            updatedAt: "2026-05-17T08:00:04Z",
          },
          messages: [
            {
              id: "message-assistant-1",
              conversationId: "conversation-1",
              turnId: "turn-1",
              role: "assistant",
              direction: "output",
              content: "Hello usage",
              status: "completed",
              model: "gpt-4.1-mini",
              provider: "openai",
              usage: {
                cachedTokens: 2,
                inputTokens: 9,
                outputTokens: 4,
                totalTokens: 15,
              },
              createdAt: "2026-05-17T08:00:04Z",
            },
          ],
        },
      },
    ],
    async (captured) => {
      const result = await ChatService.sendMessage({
        messages: [],
        prompt: "Say hello",
        selectedModel: createChatTestModel(),
      });

      const expectedUsage = {
        cachedTokens: 2,
        inputTokens: 9,
        outputTokens: 4,
        totalTokens: 15,
      };
      assert.deepEqual(captured[4].body.usageJson, expectedUsage);
      assert.deepEqual(captured[5].body.usage, expectedUsage);
      assert.equal(result.assistantMessage.content, "Hello usage");
    },
    { authenticated: true },
  );
});

test("playground chat merges final Runtime completion usage into turn response completion", async () => {
  await withAppSdkResponses(
    [
      createChatConversationResponse(),
      createChatTurnResponse(),
      createChatRuntimeInvocationResponse(),
      [
        'data: {"id":"runtime-event-1","invocationId":"runtime-invocation-1","eventNo":1,"eventType":"message.delta","eventSource":"runtime","payloadJson":{"textDelta":"Hello final usage"},"createdAt":"2026-05-17T08:00:01Z"}',
        "data: [DONE]",
        "",
      ].join("\n"),
      {
        code: "2000",
        data: {
          item: {
            id: "runtime-invocation-1",
            invocationNo: 1,
            invocationType: "chat_response",
            runtime: "openai_compatible",
            model: "gpt-4.1-mini",
            provider: "openai",
            status: "completed",
            streaming: true,
            attemptNo: 1,
            conversationId: "conversation-1",
            chatTurnId: "turn-1",
            chatItemId: "message-user-1",
            usageJson: {
              inputTokens: 11,
              outputTokens: 5,
              cachedTokens: 3,
              totalTokens: 19,
            },
            completedAt: "2026-05-17T08:00:04Z",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
      {
        code: "2000",
        data: {
          turn: {
            id: "turn-1",
            conversationId: "conversation-1",
            turnNo: 1,
            role: "user",
            mode: "chat",
            status: "completed",
            userMessageId: "message-user-1",
            assistantMessageId: "message-assistant-1",
            createdAt: "2026-05-17T08:00:00Z",
            updatedAt: "2026-05-17T08:00:04Z",
          },
          messages: [
            {
              id: "message-assistant-1",
              conversationId: "conversation-1",
              turnId: "turn-1",
              role: "assistant",
              direction: "output",
              content: "Hello final usage",
              status: "completed",
              model: "gpt-4.1-mini",
              provider: "openai",
              usage: {
                cachedTokens: 3,
                inputTokens: 11,
                outputTokens: 5,
                totalTokens: 19,
              },
              createdAt: "2026-05-17T08:00:04Z",
            },
          ],
        },
      },
    ],
    async (captured) => {
      const result = await ChatService.sendMessage({
        messages: [],
        prompt: "Say hello",
        selectedModel: createChatTestModel(),
      });

      const expectedUsage = {
        cachedTokens: 3,
        inputTokens: 11,
        outputTokens: 5,
        totalTokens: 19,
      };
      assert.deepEqual(captured[4].body.usageJson, {
        cachedTokens: 0,
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
      });
      assert.deepEqual(captured[5].body.usage, expectedUsage);
      assert.equal(result.assistantMessage.content, "Hello final usage");
    },
    { authenticated: true },
  );
});

test("playground chat recomputes total Runtime usage when cached tokens arrive in a later SSE event", async () => {
  await withAppSdkResponses(
    [
      createChatConversationResponse(),
      createChatTurnResponse(),
      createChatRuntimeInvocationResponse(),
      [
        'data: {"id":"runtime-event-1","invocationId":"runtime-invocation-1","eventNo":1,"eventType":"message.delta","eventSource":"runtime","payloadJson":{"textDelta":"Hello split usage"},"createdAt":"2026-05-17T08:00:01Z"}',
        'data: {"id":"runtime-event-2","invocationId":"runtime-invocation-1","eventNo":2,"eventType":"runtime.usage","eventSource":"runtime","payloadJson":{"usage":{"input_tokens":9,"output_tokens":4}},"createdAt":"2026-05-17T08:00:02Z"}',
        'data: {"id":"runtime-event-3","invocationId":"runtime-invocation-1","eventNo":3,"eventType":"runtime.usage","eventSource":"runtime","payloadJson":{"usage":{"cached_tokens":2}},"createdAt":"2026-05-17T08:00:03Z"}',
        "data: [DONE]",
        "",
      ].join("\n"),
      {
        code: "2000",
        data: {
          item: {
            id: "runtime-invocation-1",
            invocationNo: 1,
            invocationType: "chat_response",
            runtime: "openai_compatible",
            model: "gpt-4.1-mini",
            provider: "openai",
            status: "completed",
            streaming: true,
            attemptNo: 1,
            conversationId: "conversation-1",
            chatTurnId: "turn-1",
            chatItemId: "message-user-1",
            completedAt: "2026-05-17T08:00:04Z",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
      {
        code: "2000",
        data: {
          turn: {
            id: "turn-1",
            conversationId: "conversation-1",
            turnNo: 1,
            role: "user",
            mode: "chat",
            status: "completed",
            userMessageId: "message-user-1",
            assistantMessageId: "message-assistant-1",
            createdAt: "2026-05-17T08:00:00Z",
            updatedAt: "2026-05-17T08:00:04Z",
          },
          messages: [
            {
              id: "message-assistant-1",
              conversationId: "conversation-1",
              turnId: "turn-1",
              role: "assistant",
              direction: "output",
              content: "Hello split usage",
              status: "completed",
              model: "gpt-4.1-mini",
              provider: "openai",
              usage: {
                cachedTokens: 2,
                inputTokens: 9,
                outputTokens: 4,
                totalTokens: 15,
              },
              createdAt: "2026-05-17T08:00:04Z",
            },
          ],
        },
      },
    ],
    async (captured) => {
      const result = await ChatService.sendMessage({
        messages: [],
        prompt: "Say hello",
        selectedModel: createChatTestModel(),
      });

      const expectedUsage = {
        cachedTokens: 2,
        inputTokens: 9,
        outputTokens: 4,
        totalTokens: 15,
      };
      assert.deepEqual(captured[4].body.usageJson, expectedUsage);
      assert.deepEqual(captured[5].body.usage, expectedUsage);
      assert.equal(result.assistantMessage.content, "Hello split usage");
    },
    { authenticated: true },
  );
});

test("playground chat SSE ignores text-shaped payloads on non-text Runtime events", async () => {
  await withAppSdkResponses(
    [
      createChatConversationResponse(),
      createChatTurnResponse(),
      createChatRuntimeInvocationResponse(),
      [
        'data: {"id":"runtime-event-1","invocationId":"runtime-invocation-1","eventNo":1,"eventType":"runtime.metric","eventSource":"runtime","textDelta":"Top-level metric text must not become assistant text.","payloadJson":{"content":"Token accounting must not become assistant text."},"createdAt":"2026-05-17T08:00:01Z"}',
        "data: [DONE]",
        "",
      ].join("\n"),
      createFailedRuntimeInvocationResponse(),
      createFailedChatTurnCompletionResponse(),
    ],
    async (captured) => {
      const deltas: string[] = [];
      await assert.rejects(
        () => ChatService.sendMessage({
          messages: [],
          onDelta: (delta) => {
            deltas.push(delta);
          },
          prompt: "Say hello",
          selectedModel: createChatTestModel(),
        }),
        /playground\.chat\.errors\.runtimeUnavailable/,
      );

      assert.deepEqual(deltas, []);
      assert.equal(captured[4].body.status, "failed");
      assert.equal(captured[4].body.errorCode, "runtime_stream_empty");
      assert.equal(captured[5].body.status, "failed");
      assert.equal(captured[5].body.metadata.errorCode, "runtime_stream_empty");
    },
    { authenticated: true },
  );
});

test("playground chat SSE empty output fails the runtime invocation and chat turn response", async () => {
  await withAppSdkResponses(
    [
      {
        code: "2000",
        data: {
          item: {
            id: "conversation-1",
            title: "Say hello",
            sourceSurface: "playground",
            status: "active",
            defaultModel: "gpt-4.1-mini",
            defaultProvider: "openai",
            messageCount: 0,
            turnCount: 0,
            createdAt: "2026-05-17T08:00:00Z",
            updatedAt: "2026-05-17T08:00:00Z",
          },
        },
      },
      {
        code: "2000",
        data: {
          turn: {
            id: "turn-1",
            conversationId: "conversation-1",
            turnNo: 1,
            role: "user",
            mode: "chat",
            status: "running",
            userMessageId: "message-user-1",
            createdAt: "2026-05-17T08:00:00Z",
            updatedAt: "2026-05-17T08:00:00Z",
          },
          messages: [
            {
              id: "message-user-1",
              conversationId: "conversation-1",
              turnId: "turn-1",
              role: "user",
              direction: "input",
              content: "Say hello",
              status: "completed",
              createdAt: "2026-05-17T08:00:00Z",
            },
          ],
        },
      },
      {
        code: "2000",
        data: {
          item: {
            id: "runtime-invocation-1",
            invocationNo: 1,
            invocationType: "chat_response",
            runtime: "openai_compatible",
            model: "gpt-4.1-mini",
            provider: "openai",
            status: "streaming",
            streaming: true,
            attemptNo: 1,
            conversationId: "conversation-1",
            chatTurnId: "turn-1",
            chatItemId: "message-user-1",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
      ["data: [DONE]", ""].join("\n"),
      {
        code: "2000",
        data: {
          item: {
            id: "runtime-invocation-1",
            invocationNo: 1,
            invocationType: "chat_response",
            runtime: "openai_compatible",
            model: "gpt-4.1-mini",
            provider: "openai",
            status: "failed",
            streaming: true,
            attemptNo: 1,
            conversationId: "conversation-1",
            chatTurnId: "turn-1",
            chatItemId: "message-user-1",
            completedAt: "2026-05-17T08:00:01Z",
            createdAt: "2026-05-17T08:00:00Z",
          },
        },
      },
      createFailedChatTurnCompletionResponse(),
    ],
    async (captured) => {
      await assert.rejects(
        () => ChatService.sendMessage({
          messages: [],
          prompt: "Say hello",
          selectedModel: createChatTestModel(),
        }),
        /playground\.chat\.errors\.runtimeUnavailable/,
      );

      assert.deepEqual(captured.map((request) => `${request.method} ${request.url}`), [
        "POST /app/v3/api/chat/conversations",
        "POST /app/v3/api/chat/conversations/conversation-1/turns",
        "POST /app/v3/api/runtime/invocations",
        "GET /app/v3/api/runtime/invocations/runtime-invocation-1/events/stream",
        "POST /app/v3/api/runtime/invocations/runtime-invocation-1/complete",
        "POST /app/v3/api/chat/conversations/conversation-1/turns/turn-1/response",
      ]);
      assert.equal(captured[4].body.status, "failed");
      assert.equal(captured[4].body.errorCode, "runtime_stream_empty");
      assert.equal(captured[5].body.status, "failed");
      assert.equal(captured[5].body.runtimeInvocationId, "runtime-invocation-1");
      assert.equal(captured[5].body.message, "Runtime stream completed without assistant output");
      assert.equal(captured[5].body.metadata.errorCode, "runtime_stream_empty");
      assert.equal(captured[5].body.metadata.surface, "playground");
    },
    { authenticated: true },
  );
});

test("playground chat SSE stream errors fail the runtime invocation", async () => {
  await withAppSdkResponses(
    [
      createChatConversationResponse(),
      createChatTurnResponse(),
      createChatRuntimeInvocationResponse(),
      "data: {not-json}\n\ndata: [DONE]\n\n",
      createFailedRuntimeInvocationResponse(),
      createFailedChatTurnCompletionResponse("Runtime stream failed before completion"),
    ],
    async (captured) => {
      await assert.rejects(
        () => ChatService.sendMessage({
          messages: [],
          prompt: "Say hello",
          selectedModel: createChatTestModel(),
        }),
        /playground\.chat\.errors\.runtimeFailed/,
      );

      assert.deepEqual(captured.map((request) => `${request.method} ${request.url}`), [
        "POST /app/v3/api/chat/conversations",
        "POST /app/v3/api/chat/conversations/conversation-1/turns",
        "POST /app/v3/api/runtime/invocations",
        "GET /app/v3/api/runtime/invocations/runtime-invocation-1/events/stream",
        "POST /app/v3/api/runtime/invocations/runtime-invocation-1/complete",
        "POST /app/v3/api/chat/conversations/conversation-1/turns/turn-1/response",
      ]);
      assert.equal(captured[4].body.status, "failed");
      assert.equal(captured[4].body.errorCode, "runtime_stream_failed");
      assert.equal(captured[5].body.status, "failed");
      assert.equal(captured[5].body.runtimeInvocationId, "runtime-invocation-1");
      assert.equal(captured[5].body.message, "Runtime stream failed before completion");
      assert.equal(captured[5].body.metadata.errorCode, "runtime_stream_failed");
    },
    { authenticated: true },
  );
});

test("playground agent SSE stream errors fail the runtime invocation and run", async () => {
  await withAppSdkResponses(
    [
      createPlaygroundAgentListResponse(),
      createPlaygroundAgentSessionResponse(),
      createPlaygroundAgentRunResponse(),
      createAgentRuntimeInvocationResponse(),
      createAgentRunStepResponse(),
      "data: {not-json}\n\ndata: [DONE]\n\n",
      createFailedRuntimeInvocationResponse(),
      createFailedAgentRunStepResponse(),
      createFailedAgentRunResponse(),
    ],
    async (captured) => {
      await assert.rejects(
        () => PlaygroundService.runAgentGeneration({
          prompt: "Create a launch title",
          selectedModel: "kling-v2",
        }),
        /playground\.agent\.errors\.runtimeUnavailable/,
      );

      assert.deepEqual(captured.map((request) => `${request.method} ${request.url}`), [
        "GET /app/v3/api/agents?page_size=100&q=Playground%20Generation%20Agent",
        "POST /app/v3/api/agents/101/sessions",
        "POST /app/v3/api/agents/sessions/agent-session-1/runs",
        "POST /app/v3/api/runtime/invocations",
        "POST /app/v3/api/agents/runs/agent-run-1/steps",
        "GET /app/v3/api/runtime/invocations/runtime-invocation-1/events/stream",
        "POST /app/v3/api/runtime/invocations/runtime-invocation-1/complete",
        "POST /app/v3/api/agents/runs/agent-run-1/steps/agent-run-step-1/complete",
        "POST /app/v3/api/agents/runs/agent-run-1/complete",
      ]);
      assert.equal(captured[6].body.status, "failed");
      assert.equal(captured[6].body.errorCode, "runtime_stream_failed");
      assert.equal(captured[7].body.status, "failed");
      assert.equal(captured[7].body.errorMessageMasked, "Runtime stream failed before completion");
      assert.equal(captured[8].body.status, "failed");
      assert.equal(captured[8].body.errorMessageMasked, "Runtime stream failed before completion");
    },
    { authenticated: true },
  );
});

test("playground service does not create agent generation runs without a portal session", async () => {
  await withAppSdkResponse(
    {
      code: "2000",
      data: {
        agent: {
          id: "default-generation-agent",
          versionId: "default-generation-agent-v1",
          name: "Generation Agent",
          model: null,
        },
        item: {
          id: "run-1",
          date: "2026-05-17",
          prompt: "Create an image",
          type: "image",
          images: [],
          videos: [],
        },
        meteringEvents: [
          {
            type: "token",
            quantity: "0",
            usageFactMetadata: {
              agentId: "default-generation-agent",
              agentVersionId: "default-generation-agent-v1",
              runId: "run-1",
              stepId: "run-1-step-input",
              userId: "30",
              meteringSource: "agent-runtime",
            },
          },
        ],
        run: {
          id: "run-1",
          requestId: "generation-agent-run-1",
          source: "generation-agent",
          status: "queued",
        },
        steps: [
          {
            id: "run-1-step-input",
            index: 0,
            type: "input",
            status: "succeeded",
            title: "User input accepted",
          },
        ],
        targetType: "image",
        status: "pending",
        usage: {
          promptTokens: 0,
          cachedTokens: 0,
          completionTokens: 0,
          totalTokens: 0,
          imageCount: 0,
          videoSeconds: "0",
          events: [
            {
              type: "token",
              quantity: "0",
              usageFactMetadata: {
                agentId: "default-generation-agent",
                agentVersionId: "default-generation-agent-v1",
                runId: "run-1",
                stepId: "run-1-step-input",
                userId: "30",
                meteringSource: "agent-runtime",
              },
            },
          ],
        },
      },
    },
    async (captured) => {
      await assert.rejects(
        () => PlaygroundService.runAgentGeneration({ prompt: "Create an image" }),
        /Portal session is required to run generation agent/,
      );
      assert.deepEqual(captured, []);
    },
  );
});

test("playground service rejects blank agent generation prompts before calling the SDK", async () => {
  await withAppSdkResponse(
    {
      code: "2000",
      data: {
        agent: {
          id: "default-generation-agent",
          versionId: "default-generation-agent-v1",
          name: "Generation Agent",
          model: null,
        },
        item: {
          id: "run-1",
          date: "2026-05-17",
          prompt: "Create an image",
          type: "image",
          images: [],
          videos: [],
        },
        meteringEvents: [
          {
            type: "token",
            quantity: "0",
            usageFactMetadata: {
              agentId: "default-generation-agent",
              agentVersionId: "default-generation-agent-v1",
              runId: "run-1",
              stepId: "run-1-step-input",
              userId: "30",
              meteringSource: "agent-runtime",
            },
          },
        ],
        run: {
          id: "run-1",
          requestId: "generation-agent-run-1",
          source: "generation-agent",
          status: "queued",
        },
        steps: [
          {
            id: "run-1-step-input",
            index: 0,
            type: "input",
            status: "succeeded",
            title: "User input accepted",
          },
        ],
        targetType: "image",
        status: "pending",
        usage: {
          promptTokens: 0,
          cachedTokens: 0,
          completionTokens: 0,
          totalTokens: 0,
          imageCount: 0,
          videoSeconds: "0",
          events: [
            {
              type: "token",
              quantity: "0",
              usageFactMetadata: {
                agentId: "default-generation-agent",
                agentVersionId: "default-generation-agent-v1",
                runId: "run-1",
                stepId: "run-1-step-input",
                userId: "30",
                meteringSource: "agent-runtime",
              },
            },
          ],
        },
      },
    },
    async (captured) => {
      await assert.rejects(
        () => PlaygroundService.runAgentGeneration({ prompt: "  " }),
        /Generation agent prompt is required/,
      );
      assert.deepEqual(captured, []);
    },
    { authenticated: true },
  );
});

test("playground service does not read user generation history without a portal session", async () => {
  await withAppSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            id: "gen-1",
            date: "2026-05-05",
            prompt: "A private generation",
            type: "image",
            images: ["https://example.com/private.png"],
            videos: [],
            createdAt: "2026-05-05T08:00:00Z",
          },
        ],
      },
    },
    async (captured) => {
      const result = await PlaygroundService.fetchGenerationHistory();

      assert.deepEqual(result, []);
      assert.deepEqual(captured, []);
    },
  );
});

test("playground service exposes generation workspace state through the appbase generation service", async () => {
  await withAppSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            id: "gen-1",
            date: "2026-05-05",
            prompt: "A precise router diagram",
            type: "image",
            modelInfo: "openai/gpt-image-1",
            images: ["https://example.com/result.png"],
            videos: [],
            createdAt: "2026-05-05T08:00:00Z",
            updatedAt: "2026-05-05T08:01:00Z",
            status: "completed",
          },
        ],
      },
    },
    async (captured) => {
      const workspace = await PlaygroundService.fetchGenerationWorkspace();

      assert.equal(captured[0].url, "/app/v3/api/ai/generations");
      assert.equal(workspace.isAuthenticated, true);
      assert.equal(workspace.runs[0]?.id, "gen-1");
      assert.equal(workspace.runs[0]?.title, "A precise router diagram");
      assert.equal(workspace.runs[0]?.model, "openai/gpt-image-1");
      assert.equal(workspace.runs[0]?.status, "completed");
      assert.equal(workspace.digest.totalRuns, 1);
      assert.equal(workspace.digest.completedRuns, 1);
    },
    { authenticated: true },
  );
});

test("playground service derives vendor grouped models from the standard app model catalog", async () => {
  await withAppSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            catalogKey: "openai/global/gpt-4o-mini",
            model: "gpt-4o-mini",
            displayName: "GPT-4o mini",
            description: "Fast public model.",
            vendorCode: "openai",
            vendor: "openai",
            regionCode: "global",
            modalities: ["text"],
            inputModalities: ["text"],
            outputModalities: ["text"],
            capabilities: ["chat", "tools"],
            groups: ["default", "enterprise"],
            categories: ["Recommended", "Proprietary"],
            apiFormat: "openai_responses",
            capabilityIntro: null,
            limitations: [],
            supportedLanguages: [],
            useCases: [],
            trainingDataCutoff: null,
            contextTokens: 128000,
            maxOutputTokens: 16000,
            supportsStreaming: true,
            supportsTools: true,
            supportsJsonSchema: false,
            releaseStage: 1,
            shelfState: 1,
            routingState: 1,
            replacementModel: null,
            providerCodes: ["openrouter"],
            officialReferencePrices: [],
            priceAvailability: { status: "unavailable", reason: "Public reference price is not configured for this model." },
          },
          {
            catalogKey: "openai/global/image-gen-pro",
            model: "image-gen-pro",
            displayName: "Image Gen Pro",
            description: "High quality image generation.",
            vendorCode: "openai",
            vendor: "openai",
            regionCode: "global",
            modalities: ["image"],
            inputModalities: ["text"],
            outputModalities: ["image"],
            capabilities: ["image"],
            groups: ["default"],
            categories: ["Recommended"],
            apiFormat: "openai_images",
            capabilityIntro: null,
            limitations: [],
            supportedLanguages: [],
            useCases: [],
            trainingDataCutoff: null,
            contextTokens: null,
            maxOutputTokens: null,
            supportsStreaming: false,
            supportsTools: false,
            supportsJsonSchema: false,
            releaseStage: 1,
            shelfState: 1,
            routingState: 1,
            replacementModel: null,
            providerCodes: [],
            officialReferencePrices: [],
            priceAvailability: { status: "unavailable", reason: "Public reference price is not configured for this model." },
          },
          {
            catalogKey: "kuaishou/cn/kling-v2",
            model: "kling-v2",
            displayName: "Kling v2",
            description: "Video generation model.",
            vendorCode: "kuaishou",
            vendor: "kuaishou",
            regionCode: "cn",
            modalities: ["video"],
            inputModalities: ["text", "image"],
            outputModalities: ["video"],
            capabilities: ["video"],
            groups: ["default"],
            categories: ["Recommended"],
            apiFormat: "kling",
            capabilityIntro: null,
            limitations: [],
            supportedLanguages: [],
            useCases: [],
            trainingDataCutoff: null,
            contextTokens: null,
            maxOutputTokens: null,
            supportsStreaming: false,
            supportsTools: false,
            supportsJsonSchema: false,
            releaseStage: 1,
            shelfState: 1,
            routingState: 1,
            replacementModel: null,
            providerCodes: [],
            officialReferencePrices: [],
            priceAvailability: { status: "unavailable", reason: "Public reference price is not configured for this model." },
          },
          {
            catalogKey: "elevenlabs/global/voice-pro",
            model: "voice-pro",
            displayName: "Voice Pro",
            description: "Speech generation model.",
            vendorCode: "elevenlabs",
            vendor: "elevenlabs",
            regionCode: "global",
            modalities: ["audio"],
            inputModalities: ["text"],
            outputModalities: ["audio"],
            capabilities: ["voice"],
            groups: ["default"],
            categories: ["Recommended"],
            apiFormat: "tts",
            capabilityIntro: null,
            limitations: [],
            supportedLanguages: [],
            useCases: [],
            trainingDataCutoff: null,
            contextTokens: null,
            maxOutputTokens: null,
            supportsStreaming: false,
            supportsTools: false,
            supportsJsonSchema: false,
            releaseStage: 1,
            shelfState: 1,
            routingState: 1,
            replacementModel: null,
            providerCodes: [],
            officialReferencePrices: [],
            priceAvailability: { status: "unavailable", reason: "Public reference price is not configured for this model." },
          },
        ],
      },
    },
    async (captured) => {
      const result = await PlaygroundService.fetchModelGroups();

      assert.equal(captured[0].url, "/app/v3/api/ai/models");
      assert.equal(captured[0].method, "GET");
      assert.equal(result.length, 3);
      const openai = result.find((group) => group.id === "openai");
      const kuaishou = result.find((group) => group.id === "kuaishou");
      const elevenlabs = result.find((group) => group.id === "elevenlabs");
      assert.ok(openai);
      assert.ok(kuaishou);
      assert.ok(elevenlabs);
      assert.deepEqual(openai.vendor, { code: "openai", name: "OpenAI" });
      assert.deepEqual(openai.llms.map((model) => model.name), ["GPT-4o mini"]);
      assert.deepEqual(openai.images.map((model) => model.name), ["Image Gen Pro"]);
      assert.deepEqual(openai.videos.map((model) => model.name), []);
      assert.deepEqual(kuaishou.videos.map((model) => model.name), ["Kling v2"]);
      assert.deepEqual(elevenlabs.audios.map((model) => model.name), ["Voice Pro"]);
      assert.equal(openai.images[0].vendorCode, "openai");
      assert.equal(openai.images[0].versionLabel, "GEN");
      assert.equal(Object.hasOwn(openai, "agents"), false);
    },
  );
});

test("playground service fails closed when standard model catalog response omits items array", async () => {
  await withAppSdkResponse(
    {
      code: "2000",
      data: {
        items: null,
      },
    },
    async () => {
      await assert.rejects(
        () => PlaygroundService.fetchModelGroups(),
        /Playground model catalog response missing items/,
      );
    },
  );
});

test("playground service fails closed when standard model catalog item omits required fields", async () => {
  await withAppSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            catalogKey: "openai/global/broken",
            model: "broken",
            vendorCode: "openai",
          },
        ],
      },
    },
    async () => {
      await assert.rejects(
        () => PlaygroundService.fetchModelGroups(),
        /Playground model display name is required/,
      );
    },
  );
});

test("playground service fails closed when SDK generation history contains unsupported types", async () => {
  await withAppSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            id: "gen-1",
            date: "2026-05-05",
            prompt: "A precise router diagram",
            type: "image",
            images: ["https://example.com/result.png"],
            videos: [],
            createdAt: "2026-05-05T08:00:00Z",
          },
          {
            id: "gen-2",
            date: "2026-05-05",
            prompt: "Invalid type",
            type: "unknown",
            images: [],
            videos: [],
          },
        ],
      },
    },
    async () => {
      await assert.rejects(
        () => PlaygroundService.fetchGenerationHistory(),
        /Playground history type is required/,
      );
    },
    { authenticated: true },
  );
});
