import assert from "node:assert/strict";
import test from "node:test";

import { clearStoredAppSessionToken } from "./packages/sdkwork-claw-router-commons/src/app-session-token.ts";
import { resetClawRouterSdkClients } from "./packages/sdkwork-claw-router-commons/src/sdk-clients.ts";
import { AccountService } from "./packages/sdkwork-claw-router-console-account/src/accountService.ts";
import { DashboardService } from "./packages/sdkwork-claw-router-console-dashboard/src/dashboardService.ts";
import { ProviderService } from "./packages/sdkwork-claw-router-console-providers/src/providerService.ts";
import { RechargeService } from "./packages/sdkwork-claw-router-console-recharge/src/rechargeService.ts";
import { SettingsService } from "./packages/sdkwork-claw-router-console-settings/src/settingsService.ts";
import { SettlementsService } from "./packages/sdkwork-claw-router-console-settlements/src/settlementsService.ts";
import { UsageService } from "./packages/sdkwork-claw-router-console-usage/src/usageService.ts";

const originalFetch = globalThis.fetch;
const originalWindowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");

type CapturedSdkRequest = {
  url: string;
  method: string;
  body: string;
};

async function withAppSdkFetch<T>(
  handler: (url: string, init?: RequestInit) => unknown,
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
      body: typeof init?.body === "string" ? init.body : "",
    });
    const result = handler(url, init);
    return new Response(JSON.stringify({ code: "2000", data: result }), {
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

test("console dashboard service reads overview data from generated app SDK", async () => {
  await withAppSdkFetch(
    (url) => {
      const requestUrl = new URL(url, "http://localhost");
      assert.equal(requestUrl.pathname, "/app/v3/api/router/dashboard/overview");
      assert.equal(requestUrl.searchParams.get("keyword"), "daily");
      return {
        summary: {
          availableCredits: "125.5",
          usedCredits: "30.25",
          requestCount: "42",
          errorCount: 1,
          imageRequests: 3,
          rpm: 20,
          tpm: 1200,
        },
        chartData: [
          {
            day: "2026-05-05",
            textRequests: 20,
            imageRequests: 3,
            videoRequests: 2,
            audioRequests: 1,
            musicRequests: 0,
          },
        ],
        topModels: [
          {
            model: "gpt-4o-mini",
            vendor: "openai",
            type: "text",
            requestCount: 20,
            costAmount: "0.42",
            trend: "+10%",
          },
        ],
        announcements: [
          {
            id: "7",
            title: "Routing update",
            createdAt: "2026-05-05T08:00:00Z",
            messageType: "warning",
          },
        ],
      };
    },
    async (captured) => {
      const result = await DashboardService.fetchDashboardOverview("daily");

      assert.equal(captured.length, 1);
      assert.match(captured[0].url, /keyword=daily/);
      assert.equal(result.summary.availableCredits, 125.5);
      assert.equal(result.chartData[0].time, "2026-05-05");
      assert.equal(result.topModels[0].name, "gpt-4o-mini");
      assert.equal(result.announcements[0].type, "warning");
    },
  );
});

test("console dashboard service fails closed when app SDK returns malformed overview rows", async () => {
  for (const [field, row, message] of [
    ["chartData", "not-a-chart-record", /Dashboard overview chart record is required/],
    ["topModels", "not-a-model-record", /Dashboard top model record is required/],
    ["announcements", "not-an-announcement-record", /Dashboard announcement record is required/],
    ["requestSparkline", "not-a-sparkline-record", /Dashboard request sparkline record is required/],
  ] as const) {
    await withAppSdkFetch(
      (url) => {
        const requestUrl = new URL(url, "http://localhost");
        if (requestUrl.pathname === "/app/v3/api/router/dashboard/overview") {
          return {
            summary: {
              availableCredits: "125.5",
              usedCredits: "30.25",
              requestCount: "42",
              errorCount: 1,
              imageRequests: 3,
              rpm: 20,
              tpm: 1200,
            },
            chartData: [],
            topModels: [],
            announcements: [],
            requestSparkline: [],
            [field]: [row],
          };
        }
        throw new Error(`unexpected SDK URL: ${url}`);
      },
      async () => {
        await assert.rejects(
          () => DashboardService.fetchDashboardOverview("daily"),
          message,
        );
      },
    );
  }
});

test("console dashboard service fails closed when app SDK omits required overview fields", async () => {
  await withAppSdkFetch(
    (url) => {
      const requestUrl = new URL(url, "http://localhost");
      if (requestUrl.pathname === "/app/v3/api/router/dashboard/overview") {
        return {
          summary: {
            availableCredits: "125.5",
            usedCredits: "30.25",
            requestCount: "42",
            errorCount: 1,
            imageRequests: 3,
            rpm: 20,
            tpm: 1200,
          },
          chartData: [{ textRequests: 20, imageRequests: 3, videoRequests: 2, audioRequests: 1, musicRequests: 0 }],
          topModels: [],
          announcements: [],
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => DashboardService.fetchDashboardOverview("daily"),
        /Dashboard overview chart time is required/,
      );
    },
  );

  await withAppSdkFetch(
    (url) => {
      const requestUrl = new URL(url, "http://localhost");
      if (requestUrl.pathname === "/app/v3/api/router/dashboard/overview") {
        return {
          summary: {
            availableCredits: "125.5",
            usedCredits: "30.25",
            requestCount: "42",
            errorCount: 1,
            imageRequests: 3,
            rpm: 20,
            tpm: 1200,
          },
          chartData: [],
          topModels: [{ vendor: "openai", type: "text", requestCount: 20, costAmount: "0.42", trend: "+10%" }],
          announcements: [],
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => DashboardService.fetchDashboardOverview("daily"),
        /Dashboard top model name is required/,
      );
    },
  );

  await withAppSdkFetch(
    (url) => {
      const requestUrl = new URL(url, "http://localhost");
      if (requestUrl.pathname === "/app/v3/api/router/dashboard/overview") {
        return {
          summary: {
            availableCredits: "125.5",
            usedCredits: "30.25",
            requestCount: "42",
            errorCount: 1,
            imageRequests: 3,
            rpm: 20,
            tpm: 1200,
          },
          chartData: [],
          topModels: [],
          announcements: [{ id: "7", createdAt: "2026-05-05T08:00:00Z", messageType: "warning" }],
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => DashboardService.fetchDashboardOverview("daily"),
        /Dashboard announcement text is required/,
      );
    },
  );
});

test("console usage service reads logs and total from generated app SDK data", async () => {
  await withAppSdkFetch(
    (url) => {
      const requestUrl = new URL(url, "http://localhost");
      assert.equal(requestUrl.pathname, "/app/v3/api/router/usage/logs");
      assert.equal(requestUrl.searchParams.get("keyword"), "gpt-4o-mini");
      return {
        total: "1",
        logs: [
          {
            id: "usage-1",
            requestId: "req-1",
            time: "2026-05-05T08:00:00Z",
            tokenName: "prod-key",
            group: "default",
            type: "chat",
            model: "gpt-4o-mini",
            totalTime: "120ms",
            ttft: "30ms",
            isStream: true,
            inputTokens: "100",
            cacheReadTokens: 20,
            outputTokens: 40,
            cost: "0.012345",
            multiplier: "1.5",
            baseInputPrice: "0.15",
            baseOutputPrice: "0.60",
            cacheReadPrice: "0.02",
            path: "/v1/chat/completions",
            reasoningEffort: "medium",
            ip: "10.0.0.11",
          },
        ],
      };
    },
    async (captured) => {
      const result = await UsageService.fetchLogs({ keyword: "gpt-4o-mini" });

      assert.equal(captured.length, 1);
      assert.match(captured[0].url, /keyword=gpt-4o-mini/);
      assert.equal(result.total, 1);
      assert.equal(result.logs[0].inputTokens, 100);
      assert.equal(result.logs[0].cost, "0.012345");
    },
  );
});

test("console usage service normalizes log query params before generated app SDK call", async () => {
  await withAppSdkFetch(
    (url) => {
      const requestUrl = new URL(url, "http://localhost");
      assert.equal(requestUrl.pathname, "/app/v3/api/router/usage/logs");
      assert.equal(requestUrl.searchParams.get("pageNo"), "2");
      assert.equal(requestUrl.searchParams.get("pageSize"), "100");
      assert.equal(requestUrl.searchParams.get("keyword"), "gpt-4o");
      assert.equal(requestUrl.searchParams.get("status"), "success");
      assert.equal(requestUrl.searchParams.get("startTime"), "2026-05-05T00:00:00Z");
      assert.equal(requestUrl.searchParams.get("endTime"), "2026-05-05T23:59:59Z");
      assert.equal(requestUrl.searchParams.has("model"), false);
      assert.equal(requestUrl.searchParams.has("ignored"), false);
      assert.equal(requestUrl.searchParams.has("empty"), false);
      return { total: 0, logs: [] };
    },
    async (captured) => {
      const result = await UsageService.fetchLogs({
        pageNo: "2",
        pageSize: "100",
        keyword: "  gpt-4o  ",
        status: " SUCCESS ",
        startTime: " 2026-05-05T00:00:00Z ",
        endTime: " 2026-05-05T23:59:59Z ",
        model: "gpt-5",
        ignored: "<script>",
        empty: "",
      });

      assert.equal(captured.length, 1);
      assert.equal(result.total, 0);
      assert.deepEqual(result.logs, []);
    },
  );
});

test("console usage service rejects invalid log query params before generated app SDK call", async () => {
  await withAppSdkFetch(
    () => {
      throw new Error("app SDK must not be called for invalid usage log queries");
    },
    async (captured) => {
      await assert.rejects(() => UsageService.fetchLogs({ pageNo: 0 }), /pageNo must be a positive integer/);
      await assert.rejects(() => UsageService.fetchLogs({ pageNo: "abc" }), /pageNo must be a positive integer/);
      await assert.rejects(() => UsageService.fetchLogs({ pageSize: 0 }), /pageSize must be between 1 and 100/);
      await assert.rejects(() => UsageService.fetchLogs({ pageSize: 101 }), /pageSize must be between 1 and 100/);
      await assert.rejects(() => UsageService.fetchLogs({ status: "pending" }), /status must be one of all, success, error/);
      await assert.rejects(
        () => UsageService.fetchLogs({ keyword: "x".repeat(129) }),
        /keyword must be at most 128 characters/,
      );
      await assert.rejects(
        () => UsageService.fetchLogs({ startTime: { value: "2026-05-05T00:00:00Z" } }),
        /startTime must be a string/,
      );
      assert.equal(captured.length, 0);
    },
  );
});

test("console settlements service reads dashboard decimals from generated app SDK data", async () => {
  await withAppSdkFetch(
    (url) => {
      assert.equal(url, "/app/v3/api/router/settlements/dashboard?year=2026");
      return {
        chartData: [{ day: "05-05", text: "1.234567", image: "2", video: "0", audio: "0", music: "0" }],
        bills: [
          {
            id: "bill-1",
            period: "2026-05",
            startDate: "2026-05-01",
            endDate: "2026-05-31",
            totalTokens: "12000",
            totalCost: "36.500000",
            status: "open",
            breakdown: {
              text: { cost: "12.345678", usage: "10k", models: ["gpt-4o-mini"] },
              image: { cost: "2", usage: "3", models: ["dall-e"] },
              video: { cost: "0", usage: "0", models: [] },
              audio: { cost: "0", usage: "0", models: [] },
              music: { cost: "0", usage: "0", models: [] },
            },
          },
        ],
      };
    },
    async (captured) => {
      const result = await SettlementsService.fetchDashboardData({ year: "2026" });

      assert.equal(captured.length, 1);
      assert.equal(result.chartData[0].text, "1.234567");
      assert.equal(result.bills[0].totalCost, "36.500000");
      assert.equal(result.bills[0].breakdown.text.cost, "12.345678");
      assert.deepEqual(result.bills[0].breakdown.image.models, ["dall-e"]);
    },
  );
});

test("console settlements lists fail closed when app SDK returns malformed dashboard rows", async () => {
  for (const [field, row, message] of [
    ["chartData", "not-a-chart-record", /Settlement chart record is required/],
    ["bills", "not-a-bill-record", /Settlement bill record is required/],
  ] as const) {
    await withAppSdkFetch(
      (url) => {
        if (url === "/app/v3/api/router/settlements/dashboard") {
          return {
            chartData: [],
            bills: [],
            [field]: [row],
          };
        }
        throw new Error(`unexpected SDK URL: ${url}`);
      },
      async () => {
        await assert.rejects(
          () => SettlementsService.fetchDashboardData(),
          message,
        );
      },
    );
  }
});

test("console settlements chart fails closed when app SDK omits or corrupts decimal fields", async () => {
  await withAppSdkFetch(
    (url) => {
      if (url === "/app/v3/api/router/settlements/dashboard") {
        return {
          chartData: [{ text: "1.234567", image: "0", video: "0", audio: "0", music: "0" }],
          bills: [],
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => SettlementsService.fetchDashboardData(),
        /Settlement chart day is required/,
      );
    },
  );

  await withAppSdkFetch(
    (url) => {
      if (url === "/app/v3/api/router/settlements/dashboard") {
        return {
          chartData: [{ day: "05-05", image: "0", video: "0", audio: "0", music: "0" }],
          bills: [],
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => SettlementsService.fetchDashboardData(),
        /Settlement chart text is required/,
      );
    },
  );

  await withAppSdkFetch(
    (url) => {
      if (url === "/app/v3/api/router/settlements/dashboard") {
        return {
          chartData: [{ day: "05-05", text: "bad-decimal", image: "0", video: "0", audio: "0", music: "0" }],
          bills: [],
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => SettlementsService.fetchDashboardData(),
        /Settlement chart text must be a decimal string/,
      );
    },
  );
});

test("console settlements service normalizes year query before generated app SDK call", async () => {
  await withAppSdkFetch(
    (url) => {
      assert.equal(url, "/app/v3/api/router/settlements/dashboard?year=2025");
      return { chartData: [], bills: [] };
    },
    async (captured) => {
      const result = await SettlementsService.fetchDashboardData({
        year: " 2025 ",
        ignored: "drop-me",
        empty: "",
      });

      assert.equal(captured.length, 1);
      assert.deepEqual(result, { chartData: [], bills: [] });
    },
  );
});

test("console settlements service rejects invalid year query before generated app SDK call", async () => {
  await withAppSdkFetch(
    () => {
      throw new Error("app SDK must not be called for invalid settlement dashboard queries");
    },
    async (captured) => {
      await assert.rejects(() => SettlementsService.fetchDashboardData({ year: "1999" }), /year must be between 2000 and 2100/);
      await assert.rejects(() => SettlementsService.fetchDashboardData({ year: "2101" }), /year must be between 2000 and 2100/);
      await assert.rejects(() => SettlementsService.fetchDashboardData({ year: "2025.5" }), /year must be an integer/);
      await assert.rejects(
        () => SettlementsService.fetchDashboardData({ year: { value: "2025" } }),
        /year must be an integer/,
      );
      assert.equal(captured.length, 0);
    },
  );
});

test("console settlement bills fail closed when app SDK omits required bill breakdowns", async () => {
  await withAppSdkFetch(
    (url) => {
      if (url === "/app/v3/api/router/settlements/dashboard") {
        return {
          chartData: [],
          bills: [
            {
              id: "bill-1",
              period: "2026-05",
              startDate: "2026-05-01",
              endDate: "2026-05-31",
              totalTokens: "12000",
              totalCost: "36.500000",
              status: "open",
            },
          ],
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => SettlementsService.fetchDashboardData(),
        /Settlement bill breakdown is required/,
      );
    },
  );

  await withAppSdkFetch(
    (url) => {
      if (url === "/app/v3/api/router/settlements/dashboard") {
        return {
          chartData: [],
          bills: [
            {
              id: "bill-1",
              period: "2026-05",
              startDate: "2026-05-01",
              endDate: "2026-05-31",
              totalTokens: "12000",
              totalCost: "36.500000",
              status: "open",
              breakdown: {
                text: { cost: "12.345678", usage: "10k", models: ["gpt-4o-mini"] },
                video: { cost: "0", usage: "0", models: [] },
                audio: { cost: "0", usage: "0", models: [] },
                music: { cost: "0", usage: "0", models: [] },
              },
            },
          ],
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => SettlementsService.fetchDashboardData(),
        /Settlement image breakdown is required/,
      );
    },
  );
});

test("console settlement bills fail closed when app SDK returns invalid breakdown models", async () => {
  await withAppSdkFetch(
    (url) => {
      if (url === "/app/v3/api/router/settlements/dashboard") {
        return {
          chartData: [],
          bills: [
            {
              id: "bill-1",
              period: "2026-05",
              startDate: "2026-05-01",
              endDate: "2026-05-31",
              totalTokens: "12000",
              totalCost: "36.500000",
              status: "open",
              breakdown: {
                text: { cost: "12.345678", usage: "10k", models: ["gpt-4o-mini", {}] },
                image: { cost: "2", usage: "3", models: ["dall-e"] },
                video: { cost: "0", usage: "0", models: [] },
                audio: { cost: "0", usage: "0", models: [] },
                music: { cost: "0", usage: "0", models: [] },
              },
            },
          ],
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => SettlementsService.fetchDashboardData(),
        /Settlement breakdown models must be strings/,
      );
    },
  );
});

test("console account service reads account summary from generated app SDK", async () => {
  await withAppSdkFetch(
    (url) => {
      assert.equal(url, "/app/v3/api/account/summary");
      return {
        id: "user-1",
        name: "Owner",
        email: "owner@example.com",
        isVerified: true,
        tier: "enterprise",
        organization: "SDKWork",
        availableCredits: "125.5",
        estDaysRemaining: "30",
        monthlyConsumption: "40.25",
        consumptionByService: [{ name: "Text", value: "30", color: "#2563eb", percentage: 75 }],
        invoiceSettings: {
          orgFull: "SDKWork Inc.",
          taxId: "tax-1",
          paymentMethod: "Corporate account",
          invoiceType: "VAT",
        },
        security: {
          mfaEnabled: true,
          qpsLimit: "120",
          ipWhitelistCount: 2,
        },
        loginLogs: [
          {
            ip: "10.0.0.***",
            location: "Shanghai",
            device: "Chrome",
            time: "2026-05-05T08:00:00Z",
            status: "warning",
          },
        ],
      };
    },
    async (captured) => {
      const result = await AccountService.fetchAccountDetails();

      assert.equal(captured.length, 1);
      assert.equal(result.id, "user-1");
      assert.equal(result.availableCredits, 125.5);
      assert.equal(result.consumptionByService[0].value, 30);
      assert.equal(result.security.qpsLimit, 120);
      assert.equal(result.loginLogs[0].status, "warning");
    },
  );
});

test("console account service fails closed when app SDK returns malformed account rows", async () => {
  for (const [field, row, message] of [
    ["consumptionByService", "not-a-consumption-record", /Account consumption record is required/],
    ["loginLogs", "not-a-login-record", /Account login log record is required/],
  ] as const) {
    await withAppSdkFetch(
      (url) => {
        if (url === "/app/v3/api/account/summary") {
          return {
            id: "user-1",
            name: "Owner",
            email: "owner@example.com",
            isVerified: true,
            tier: "enterprise",
            organization: "SDKWork",
            availableCredits: "125.5",
            estDaysRemaining: "30",
            monthlyConsumption: "40.25",
            consumptionByService: [],
            invoiceSettings: {
              orgFull: "SDKWork Inc.",
              taxId: "tax-1",
              paymentMethod: "Corporate account",
              invoiceType: "VAT",
            },
            security: {
              mfaEnabled: true,
              qpsLimit: "120",
              ipWhitelistCount: 2,
            },
            loginLogs: [],
            [field]: [row],
          };
        }
        throw new Error(`unexpected SDK URL: ${url}`);
      },
      async () => {
        await assert.rejects(
          () => AccountService.fetchAccountDetails(),
          message,
        );
      },
    );
  }
});

test("console account service fails closed when app SDK omits required account fields", async () => {
  await withAppSdkFetch(
    (url) => {
      if (url === "/app/v3/api/account/summary") {
        return {
          id: "user-1",
          name: "Owner",
          email: "owner@example.com",
          tier: "enterprise",
          organization: "SDKWork",
          availableCredits: "125.5",
          estDaysRemaining: "30",
          monthlyConsumption: "40.25",
          consumptionByService: [],
          invoiceSettings: {
            orgFull: "SDKWork Inc.",
            taxId: "tax-1",
            paymentMethod: "Corporate account",
            invoiceType: "VAT",
          },
          security: {
            mfaEnabled: true,
            qpsLimit: "120",
            ipWhitelistCount: 2,
          },
          loginLogs: [],
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => AccountService.fetchAccountDetails(),
        /Account verification status is required/,
      );
    },
  );

  await withAppSdkFetch(
    (url) => {
      if (url === "/app/v3/api/account/summary") {
        return {
          id: "user-1",
          name: "Owner",
          email: "owner@example.com",
          isVerified: true,
          tier: "enterprise",
          organization: "SDKWork",
          availableCredits: "125.5",
          estDaysRemaining: "30",
          monthlyConsumption: "40.25",
          consumptionByService: [{ value: 30, color: "#2563eb", percentage: 75 }],
          invoiceSettings: {
            orgFull: "SDKWork Inc.",
            taxId: "tax-1",
            paymentMethod: "Corporate account",
            invoiceType: "VAT",
          },
          security: {
            mfaEnabled: true,
            qpsLimit: "120",
            ipWhitelistCount: 2,
          },
          loginLogs: [],
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => AccountService.fetchAccountDetails(),
        /Account consumption service name is required/,
      );
    },
  );

  await withAppSdkFetch(
    (url) => {
      if (url === "/app/v3/api/account/summary") {
        return {
          id: "user-1",
          name: "Owner",
          email: "owner@example.com",
          isVerified: true,
          tier: "enterprise",
          organization: "SDKWork",
          availableCredits: "125.5",
          estDaysRemaining: "30",
          monthlyConsumption: "40.25",
          consumptionByService: [],
          invoiceSettings: {
            orgFull: "SDKWork Inc.",
            taxId: "tax-1",
            paymentMethod: "Corporate account",
            invoiceType: "VAT",
          },
          security: {
            mfaEnabled: true,
            qpsLimit: "120",
            ipWhitelistCount: 2,
          },
          loginLogs: [
            {
              ip: "10.0.0.***",
              location: "Shanghai",
              device: "Chrome",
              time: "2026-05-05T08:00:00Z",
              status: "muted",
            },
          ],
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => AccountService.fetchAccountDetails(),
        /Unsupported account login status: muted/,
      );
    },
  );
});

test("console recharge service reads packages and submits recharge through generated app SDK", async () => {
  await withAppSdkFetch(
    (url, init) => {
      if (url === "/app/v3/api/vip/pack-groups/packs") {
        return { items: [{ id: "pack-1", rmb: "99.9", bonus: "20" }] };
      }
      if (url === "/app/v3/api/account/points/recharge") {
        assert.equal(init?.method ?? "GET", "POST");
        assert.match(typeof init?.body === "string" ? init.body : "", /"amount":"99.90"/);
        return {
          success: true,
          orderNo: "order-1",
          amount: "99.90",
          paymentMethod: "wechat",
          points: 999,
          status: "pending",
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async (captured) => {
      const packages = await RechargeService.fetchPackages();
      const submitted = await RechargeService.submitRecharge("99.90", "wechat");

      assert.deepEqual(captured.map((request) => request.url), [
        "/app/v3/api/vip/pack-groups/packs",
        "/app/v3/api/account/points/recharge",
      ]);
      assert.equal(packages[0].rmb, "99.90");
      assert.equal(packages[0].bonus, 20);
      assert.deepEqual(submitted, { success: true, orderNo: "order-1" });
    },
  );
});

test("console recharge service rejects invalid submit commands before calling generated app SDK", async () => {
  await withAppSdkFetch(
    () => {
      throw new Error("app SDK must not be called for invalid recharge commands");
    },
    async (captured) => {
      await assert.rejects(
        () => RechargeService.submitRecharge("0", "wechat"),
        /amount must be greater than zero/,
      );
      await assert.rejects(
        () => RechargeService.submitRecharge("10.00", ""),
        /method is required/,
      );
      assert.equal(captured.length, 0);
    },
  );
});

test("console recharge service submits large exact decimal strings without binary float conversion", async () => {
  const largeAmount = `${"9".repeat(320)}.99`;

  await withAppSdkFetch(
    (url, init) => {
      assert.equal(url, "/app/v3/api/account/points/recharge");
      assert.equal(init?.method ?? "GET", "POST");
      assert.equal(
        typeof init?.body === "string" ? JSON.parse(init.body).amount : "",
        largeAmount,
      );
      return {
        success: true,
        orderNo: "order-large",
        amount: largeAmount,
        paymentMethod: "wechat",
        points: 999999,
        status: "pending",
      };
    },
    async (captured) => {
      const result = await RechargeService.submitRecharge(largeAmount, "wechat");

      assert.equal(captured.length, 1);
      assert.deepEqual(result, { success: true, orderNo: "order-large" });
    },
  );
});

test("console settings service reads and updates settings through generated app SDK", async () => {
  await withAppSdkFetch(
    (url, init) => {
      if (url === "/app/v3/api/user/settings") {
        if ((init?.method ?? "GET") === "GET") {
          return {
            language: "zh-CN",
            timezone: "Asia/Shanghai",
            webhookUrl: "https://hooks.example.test/router",
            notifications: {
              billReminder: true,
              quotaWarning: false,
              apiMonitor: true,
            },
          };
        }
        assert.equal(init?.method, "PUT");
        assert.match(typeof init.body === "string" ? init.body : "", /"language":"en"/);
        return { success: true };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async (captured) => {
      const settings = await SettingsService.fetchSettings();
      await SettingsService.updateSettings({
        language: "en",
        timezone: "UTC",
        webhookUrl: "",
        notifications: {
          billReminder: false,
          quotaWarning: true,
          apiMonitor: false,
        },
      });

      assert.deepEqual(captured.map((request) => `${request.method} ${request.url}`), [
        "GET /app/v3/api/user/settings",
        "PUT /app/v3/api/user/settings",
      ]);
      assert.equal(settings.timezone, "Asia/Shanghai");
      assert.equal(settings.notifications.billReminder, true);
      assert.equal(settings.notifications.quotaWarning, false);
    },
  );
});

test("console settings service validates outbound settings before calling generated app SDK", async () => {
  await withAppSdkFetch(
    () => {
      throw new Error("app SDK must not be called for invalid settings commands");
    },
    async (captured) => {
      await assert.rejects(
        () =>
          SettingsService.updateSettings({
            language: "",
            timezone: "UTC",
            webhookUrl: "",
            notifications: {
              billReminder: false,
              quotaWarning: true,
              apiMonitor: false,
            },
          }),
        /language is required/,
      );
      await assert.rejects(
        () =>
          SettingsService.updateSettings({
            language: "en",
            timezone: "",
            webhookUrl: "",
            notifications: {
              billReminder: false,
              quotaWarning: true,
              apiMonitor: false,
            },
          }),
        /timezone is required/,
      );
      await assert.rejects(
        () =>
          SettingsService.updateSettings({
            language: "en",
            timezone: "UTC",
            webhookUrl: "ftp://hooks.example.test/router",
            notifications: {
              billReminder: false,
              quotaWarning: true,
              apiMonitor: false,
            },
          }),
        /webhookUrl must use http or https/,
      );
      assert.equal(captured.length, 0);
    },
  );
});

test("console provider service reads provider configs through generated app SDK", async () => {
  await withAppSdkFetch(
    (url) => {
      assert.equal(url, "/app/v3/api/router/providers");
      return {
        items: [
          {
            id: "provider-1",
            providerFamily: "gemini",
            integrationType: "model_vendor_direct",
            name: "Gemini",
            description: "Google model provider",
            url: "https://generativelanguage.googleapis.com",
            status: "inactive",
          },
        ],
      };
    },
    async (captured) => {
      const result = await ProviderService.fetchProviders();

      assert.equal(captured.length, 1);
      assert.equal(result[0].providerFamily, "gemini");
      assert.equal(result[0].integrationType, "model_vendor_direct");
      assert.equal(result[0].status, "inactive");
    },
  );
});

test("console usage logs fail closed when app SDK omits stable usage log ids", async () => {
  await withAppSdkFetch(
    (url) => {
      const requestUrl = new URL(url, "http://localhost");
      if (requestUrl.pathname === "/app/v3/api/router/usage/logs") {
        return {
          total: 1,
          logs: [
            {
              requestId: "req-1",
              time: "2026-05-05T08:00:00Z",
              tokenName: "prod-key",
              group: "default",
              type: "chat",
              model: "gpt-4o-mini",
              totalTime: "120ms",
              ttft: "30ms",
              isStream: true,
              inputTokens: "100",
              cacheReadTokens: 20,
              outputTokens: 40,
              cost: "0.012345",
              multiplier: "1.5",
              baseInputPrice: "0.15",
              baseOutputPrice: "0.60",
              cacheReadPrice: "0.02",
              path: "/v1/chat/completions",
              reasoningEffort: "medium",
              ip: "10.0.0.11",
            },
          ],
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => UsageService.fetchLogs(),
        /Usage log id is required/,
      );
    },
  );
});

test("console usage logs fail closed when app SDK returns malformed usage rows", async () => {
  await withAppSdkFetch(
    (url) => {
      const requestUrl = new URL(url, "http://localhost");
      if (requestUrl.pathname === "/app/v3/api/router/usage/logs") {
        return {
          total: 1,
          logs: ["not-a-usage-log-record"],
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => UsageService.fetchLogs(),
        /Usage log record is required/,
      );
    },
  );
});

test("console usage logs fail closed when app SDK omits required audit fields", async () => {
  for (const [field, message] of [
    ["requestId", /Usage log request id is required/],
    ["inputTokens", /Usage log input tokens are required/],
    ["cost", /Usage log cost is required/],
  ] as const) {
    await withAppSdkFetch(
      (url) => {
        const requestUrl = new URL(url, "http://localhost");
        if (requestUrl.pathname === "/app/v3/api/router/usage/logs") {
          const log = {
            id: "usage-1",
            requestId: "req-1",
            time: "2026-05-05T08:00:00Z",
            tokenName: "prod-key",
            group: "default",
            type: "chat",
            model: "gpt-4o-mini",
            totalTime: "120ms",
            ttft: "30ms",
            isStream: true,
            inputTokens: "100",
            cacheReadTokens: 20,
            outputTokens: 40,
            cost: "0.012345",
            multiplier: "1.5",
            baseInputPrice: "0.15",
            baseOutputPrice: "0.60",
            cacheReadPrice: "0.02",
            path: "/v1/chat/completions",
            reasoningEffort: "medium",
            ip: "10.0.0.11",
          } as Record<string, unknown>;
          delete log[field];
          return {
            total: 1,
            logs: [log],
          };
        }
        throw new Error(`unexpected SDK URL: ${url}`);
      },
      async () => {
        await assert.rejects(
          () => UsageService.fetchLogs(),
          message,
        );
      },
    );
  }
});

test("console usage logs fail closed when app SDK returns invalid decimal audit values", async () => {
  await withAppSdkFetch(
    (url) => {
      const requestUrl = new URL(url, "http://localhost");
      if (requestUrl.pathname === "/app/v3/api/router/usage/logs") {
        return {
          total: 1,
          logs: [
            {
              id: "usage-1",
              requestId: "req-1",
              time: "2026-05-05T08:00:00Z",
              tokenName: "prod-key",
              group: "default",
              type: "chat",
              model: "gpt-4o-mini",
              totalTime: "120ms",
              ttft: "30ms",
              isStream: true,
              inputTokens: "100",
              cacheReadTokens: 20,
              outputTokens: 40,
              cost: "not-a-decimal",
              multiplier: "1.5",
              baseInputPrice: "0.15",
              baseOutputPrice: "0.60",
              cacheReadPrice: "0.02",
              path: "/v1/chat/completions",
              reasoningEffort: "medium",
              ip: "10.0.0.11",
            },
          ],
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => UsageService.fetchLogs(),
        /Usage log cost must be a decimal string/,
      );
    },
  );
});

test("console usage logs fail closed when app SDK omits or corrupts pagination total", async () => {
  for (const total of [undefined, -1, "not-a-number"]) {
    await withAppSdkFetch(
      (url) => {
        const requestUrl = new URL(url, "http://localhost");
        if (requestUrl.pathname === "/app/v3/api/router/usage/logs") {
          return {
            ...(total === undefined ? {} : { total }),
            logs: [
              {
                id: "usage-1",
                requestId: "req-1",
                time: "2026-05-05T08:00:00Z",
                tokenName: "prod-key",
                group: "default",
                type: "chat",
                model: "gpt-4o-mini",
                totalTime: "120ms",
                ttft: "30ms",
                isStream: true,
                inputTokens: "100",
                cacheReadTokens: 20,
                outputTokens: 40,
                cost: "0.012345",
                multiplier: "1.5",
                baseInputPrice: "0.15",
                baseOutputPrice: "0.60",
                cacheReadPrice: "0.02",
                path: "/v1/chat/completions",
                reasoningEffort: "medium",
                ip: "10.0.0.11",
              },
            ],
          };
        }
        throw new Error(`unexpected SDK URL: ${url}`);
      },
      async () => {
        await assert.rejects(
          () => UsageService.fetchLogs(),
          /Usage log total is required/,
        );
      },
    );
  }
});

test("console settlement bills fail closed when app SDK omits stable bill ids", async () => {
  await withAppSdkFetch(
    (url) => {
      if (url === "/app/v3/api/router/settlements/dashboard") {
        return {
          chartData: [],
          bills: [
            {
              period: "2026-05",
              startDate: "2026-05-01",
              endDate: "2026-05-31",
              totalTokens: "12000",
              totalCost: "36.500000",
              status: "open",
              breakdown: {},
            },
          ],
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => SettlementsService.fetchDashboardData(),
        /Settlement bill id is required/,
      );
    },
  );
});

test("console recharge packages fail closed when app SDK omits stable package ids", async () => {
  await withAppSdkFetch(
    (url) => {
      if (url === "/app/v3/api/vip/pack-groups/packs") {
        return { items: [{ rmb: "99.9", bonus: "20" }] };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => RechargeService.fetchPackages(),
        /Recharge package id is required/,
      );
    },
  );
});

test("console recharge packages fail closed when app SDK returns malformed package rows", async () => {
  await withAppSdkFetch(
    (url) => {
      if (url === "/app/v3/api/vip/pack-groups/packs") {
        return { items: [{ id: "pack-1", rmb: "99.9", bonus: "20" }, "malformed-row"] };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => RechargeService.fetchPackages(),
        /Recharge package record is required/,
      );
    },
  );
});

test("console recharge packages fail closed when app SDK omits package money amounts", async () => {
  await withAppSdkFetch(
    (url) => {
      if (url === "/app/v3/api/vip/pack-groups/packs") {
        return { items: [{ id: "pack-1", bonus: "20" }] };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => RechargeService.fetchPackages(),
        /Recharge package money amount is required/,
      );
    },
  );
});

test("console recharge packages fail closed when app SDK returns invalid package money amounts", async () => {
  await withAppSdkFetch(
    (url) => {
      if (url === "/app/v3/api/vip/pack-groups/packs") {
        return { items: [{ id: "pack-1", rmb: "free", bonus: "20" }] };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => RechargeService.fetchPackages(),
        /Recharge package money amount must be a money string/,
      );
    },
  );
});

test("console recharge packages fail closed when app SDK omits bonus points", async () => {
  await withAppSdkFetch(
    (url) => {
      if (url === "/app/v3/api/vip/pack-groups/packs") {
        return { items: [{ id: "pack-1", rmb: "99.90" }] };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => RechargeService.fetchPackages(),
        /Recharge package bonus is required/,
      );
    },
  );
});

test("console recharge submit fails closed when app SDK omits order numbers", async () => {
  await withAppSdkFetch(
    (url) => {
      if (url === "/app/v3/api/account/points/recharge") {
        return {
          success: true,
          amount: "99.90",
          paymentMethod: "wechat",
          points: 999,
          status: "pending",
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => RechargeService.submitRecharge("99.90", "wechat"),
        /Recharge order number is required/,
      );
    },
  );
});

test("console recharge submit fails closed when app SDK reports unsuccessful orders", async () => {
  await withAppSdkFetch(
    (url) => {
      if (url === "/app/v3/api/account/points/recharge") {
        return { success: false, orderNo: "order-1" };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => RechargeService.submitRecharge("99.90", "wechat"),
        /Recharge submission was not accepted/,
      );
    },
  );
});

test("console recharge submit fails closed when app SDK omits confirmed amounts", async () => {
  await withAppSdkFetch(
    (url) => {
      if (url === "/app/v3/api/account/points/recharge") {
        return { success: true, orderNo: "order-1", paymentMethod: "wechat", points: 999, status: "pending" };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => RechargeService.submitRecharge("99.90", "wechat"),
        /Recharge amount is required/,
      );
    },
  );
});

test("console recharge submit fails closed when app SDK returns invalid confirmed points", async () => {
  await withAppSdkFetch(
    (url) => {
      if (url === "/app/v3/api/account/points/recharge") {
        return {
          success: true,
          orderNo: "order-1",
          amount: "99.90",
          paymentMethod: "wechat",
          points: "invalid",
          status: "pending",
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => RechargeService.submitRecharge("99.90", "wechat"),
        /Recharge points are required/,
      );
    },
  );
});

test("console provider configs fail closed when app SDK omits stable provider ids", async () => {
  await withAppSdkFetch(
    (url) => {
      if (url === "/app/v3/api/router/providers") {
        return {
          items: [
            {
              providerFamily: "gemini",
              integrationType: "model_vendor_direct",
              name: "Gemini",
              description: "Google model provider",
              url: "https://generativelanguage.googleapis.com",
              status: "inactive",
            },
          ],
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => ProviderService.fetchProviders(),
        /Provider id is required/,
      );
    },
  );
});

test("console provider configs fail closed when app SDK returns malformed provider rows", async () => {
  await withAppSdkFetch(
    (url) => {
      if (url === "/app/v3/api/router/providers") {
        return {
          items: [
            {
              id: "provider-1",
              providerFamily: "gemini",
              integrationType: "model_vendor_direct",
              name: "Gemini",
              description: "Google model provider",
              url: "https://generativelanguage.googleapis.com",
              status: "inactive",
            },
            "malformed-row",
          ],
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => ProviderService.fetchProviders(),
        /Provider record is required/,
      );
    },
  );
});

test("console provider configs fail closed when app SDK returns unsupported provider families", async () => {
  await withAppSdkFetch(
    (url) => {
      if (url === "/app/v3/api/router/providers") {
        return {
          items: [
            {
              id: "provider-1",
              providerFamily: "unknown-provider",
              integrationType: "model_vendor_direct",
              name: "Unknown",
              description: "Unsupported provider",
              url: "https://provider.example.test",
              status: "inactive",
            },
          ],
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => ProviderService.fetchProviders(),
        /Unsupported provider family: unknown-provider/,
      );
    },
  );
});
