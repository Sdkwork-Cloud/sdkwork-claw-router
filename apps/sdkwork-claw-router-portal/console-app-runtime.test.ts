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
import { PlaygroundService } from "./packages/sdkwork-claw-router-playground/src/playgroundService.ts";

const originalFetch = globalThis.fetch;
const originalWindowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");

function readPortalFile(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

type CapturedSdkRequest = {
  url: string;
  method: string;
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

      assert.equal(captured[0].url, "/app/v3/api/billing/account/summary");
      assert.equal(result.id, "acct-1");
      assert.equal(result.email, "ops@example.com");
      assert.equal(result.availableCredits, 125.5);
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
        /Account summary response missing data/,
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
          },
        ],
      },
    },
    async (captured) => {
      const result = await MessagesService.fetchMessages();

      assert.equal(captured[0].url, "/app/v3/api/communication/notifications");
      assert.deepEqual(result.map((item) => item.id), ["msg-1"]);
    },
  );
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
            showAsPopup: true,
          },
          {
            id: "notif-2",
            title: "Routine update",
            desc: "No popup requested",
            content: "This should stay in the notification center.",
            time: "2026-05-05T09:00:00Z",
            type: "info",
            read: true,
          },
        ],
      },
    },
    async (captured) => {
      const result = await NotificationService.fetchNotifications();

      assert.equal(captured[0].url, "/app/v3/api/communication/notifications");
      assert.deepEqual(result.map((item) => item.id), ["notif-1", "notif-2"]);
      assert.equal(result[0].type, "warning");
      assert.equal(result[0].read, false);
      assert.equal(result[0].showAsPopup, true);
      assert.equal(result[1].showAsPopup, false);
    },
  );
});

test("navbar queues popup notifications and renders only one popup modal at a time", () => {
  const navbarSource = readPortalFile("./packages/sdkwork-claw-router-commons/src/components/Navbar.tsx");

  assert.match(navbarSource, /popupNotificationQueue/, "Navbar must maintain an explicit popup queue");
  assert.match(navbarSource, /activePopupNotification/, "Navbar must track a single active popup notification");
  assert.match(navbarSource, /showAsPopup/, "Navbar must filter notifications marked for popup display");
  assert.match(navbarSource, /dismissedPopupNotificationIdsRef/, "Navbar must avoid reopening dismissed popups during the same page session");
  assert.match(navbarSource, /setPopupNotificationQueue\(popupCandidates\)/, "Navbar must enqueue popup candidates after notifications load");
  assert.match(navbarSource, /setActivePopupNotification\(nextPopup\)/, "Navbar must advance one popup at a time");
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
          },
          {
            id: "msg-2",
            title: "Broken",
            read: false,
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

test("playground service creates agent generation runs through the generated app SDK", async () => {
  await withAppSdkResponse(
    {
      code: "2000",
      data: {
        agent: {
          id: "default-generation-agent",
          versionId: "default-generation-agent-v1",
          name: "Generation Agent",
          model: "kling-v2",
        },
        item: {
          id: "run-1",
          date: "2026-05-17",
          prompt: "Create a 10 second product launch video",
          type: "video",
          modelInfo: "kling-v2",
          images: [],
          videos: [],
          status: "pending",
          createdAt: "2026-05-17T08:00:00Z",
          updatedAt: "2026-05-17T08:00:00Z",
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
        targetType: "video",
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
      const result = await PlaygroundService.runAgentGeneration({
        prompt: "  Create a 10 second product launch video  ",
        targetType: "video",
        selectedModel: "kling-v2",
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

      assert.equal(captured[0].url, "/app/v3/api/ai/generation/agents/runs");
      assert.equal(captured[0].method, "POST");
      assert.deepEqual(captured[0].body, {
        prompt: "Create a 10 second product launch video",
        targetType: "video",
        selectedModel: "kling-v2",
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
      assert.equal(result.targetType, "video");
      assert.equal(result.status, "pending");
      assert.equal(result.agent.id, "default-generation-agent");
      assert.equal(result.run.status, "queued");
      assert.equal(result.steps[0].type, "input");
      assert.equal(result.usage.events[0].usageFactMetadata.meteringSource, "agent-runtime");
      assert.equal(result.item.id, "run-1");
      assert.equal(result.item.type, "video");
      assert.equal(result.item.status, "pending");
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
