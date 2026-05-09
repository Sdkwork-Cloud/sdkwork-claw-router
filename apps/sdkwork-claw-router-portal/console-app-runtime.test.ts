import assert from "node:assert/strict";
import test from "node:test";

import { clearStoredAppSessionToken } from "./packages/sdkwork-claw-router-commons/src/app-session-token.ts";
import { resetClawRouterSdkClients } from "./packages/sdkwork-claw-router-commons/src/sdk-clients.ts";
import { AccountService } from "./packages/sdkwork-claw-router-console-account/src/accountService.ts";
import { GatewayService } from "./packages/sdkwork-claw-router-console-gateway/src/gatewayService.ts";
import { MessagesService } from "./packages/sdkwork-claw-router-console-messages/src/messagesService.ts";
import { UserService } from "./packages/sdkwork-claw-router-console-user/src/userService.ts";
import { PlaygroundService } from "./packages/sdkwork-claw-router-playground/src/playgroundService.ts";

const originalFetch = globalThis.fetch;
const originalWindowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");

type CapturedSdkRequest = {
  url: string;
  method: string;
};

async function withAppSdkResponse<T>(
  responseBody: unknown,
  fn: (captured: CapturedSdkRequest[]) => Promise<T>,
): Promise<T> {
  const captured: CapturedSdkRequest[] = [];
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    enumerable: true,
    value: {},
  });
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    captured.push({
      url,
      method: init?.method ?? "GET",
    });
    return new Response(JSON.stringify(responseBody), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }) as typeof fetch;
  clearStoredAppSessionToken();
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

      assert.equal(captured[0].url, "/app/v3/api/account/summary");
      assert.equal(result.id, "acct-1");
      assert.equal(result.email, "ops@example.com");
      assert.equal(result.availableCredits, 125.5);
    },
  );
});

test("console user service reads profile data returned by the generated app SDK", async () => {
  await withAppSdkResponse(
    {
      code: "2000",
      data: {
        name: "Ada",
        email: "ada@example.com",
        phone: "",
        language: "en",
        avatar: "A",
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
      const result = await UserService.fetchUserProfile();

      assert.equal(captured[0].url, "/app/v3/api/user/profile");
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

test("console user service fails closed when the generated app SDK omits profile email", async () => {
  await withAppSdkResponse(
    {
      code: "2000",
      data: {
        name: "Ada",
        phone: "",
        language: "en",
        avatar: "A",
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
        () => UserService.fetchUserProfile(),
        /User profile response missing data/,
      );
    },
  );
});

test("console user service fails closed when the generated app SDK omits required profile fields", async () => {
  for (const [field, message] of [
    ["name", /User profile name is required/],
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
            name: "Ada",
            email: "ada@example.com",
            phone: "",
            language: "en",
            avatar: "A",
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
          () => UserService.fetchUserProfile(),
          message,
        );
      },
    );
  }
});

test("console user service preserves contract-defined empty display strings", async () => {
  await withAppSdkResponse(
    {
      code: "2000",
      data: {
        name: "Ada",
        email: "ada@example.com",
        phone: "",
        language: "en",
        avatar: "A",
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
      const result = await UserService.fetchUserProfile();

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

      assert.equal(captured[0].url, "/app/v3/api/notification");
      assert.deepEqual(result.map((item) => item.id), ["msg-1"]);
    },
  );
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
        /Message description is required/,
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

      assert.equal(captured[0].url, "/app/v3/api/router/gateway/traces");
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

      assert.equal(captured[0].url, "/app/v3/api/playground/history");
      assert.deepEqual(result.map((item) => item.id), ["gen-1"]);
      assert.equal(result[0].type, "images");
      assert.deepEqual(result[0].images, ["https://example.com/result.png"]);
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
  );
});
