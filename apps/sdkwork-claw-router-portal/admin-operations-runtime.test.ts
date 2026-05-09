import assert from "node:assert/strict";
import test from "node:test";

import { resetClawRouterSdkClients } from "./packages/sdkwork-claw-router-commons/src/sdk-clients.ts";
import { AdminDashboardService } from "./packages/sdkwork-claw-router-admin-dashboard/src/dashboardService.ts";
import { FinanceService } from "./packages/sdkwork-claw-router-admin-finance/src/financeService.ts";
import { MonitorService } from "./packages/sdkwork-claw-router-admin-monitor/src/monitorService.ts";
import { RecordService } from "./packages/sdkwork-claw-router-admin-record/src/recordService.ts";

const originalFetch = globalThis.fetch;
const originalWindowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");

type CapturedSdkRequest = {
  url: string;
  method: string;
  body: string;
};

async function withBackendSdkFetch<T>(
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
  resetClawRouterSdkClients();

  try {
    return await fn(captured);
  } finally {
    resetClawRouterSdkClients();
    globalThis.fetch = originalFetch;
    if (originalWindowDescriptor) {
      Object.defineProperty(globalThis, "window", originalWindowDescriptor);
    } else {
      delete (globalThis as { window?: Window }).window;
    }
  }
}

test("admin dashboard service reads generated backend SDK dashboard data", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      assert.equal(init?.method ?? "GET", "GET");
      assert.equal(url, "/backend/v3/api/dashboard/admin/overview");
      return {
        userConsumption: [{ name: "Enterprise", value: 80, color: "#2563eb" }],
        multimodal: [{ name: "image", value: 12, color: "#7c3aed" }],
        traffic: [{ time: "10:00", tokens: 1200, requests: 12, cost: 0.24 }],
        modelDistribution: [{ name: "gpt-4o-mini", value: 55, color: "#16a34a" }],
        recentUsage: [
          {
            id: "usage-1",
            user: "ops@example.com",
            isApiUser: true,
            model: "gpt-4o-mini",
            type: "text",
            billingMode: "tokens",
            usageIn: "128",
            usageOut: 256,
            time: "2026-05-05T08:00:00Z",
            status: "success",
            cost: "0.03",
          },
        ],
      };
    },
    async (captured) => {
      const result = await AdminDashboardService.fetchDashboardData();

      assert.equal(captured.length, 1);
      assert.deepEqual(result.userConsumption.map((item) => item.name), ["Enterprise"]);
      assert.equal(result.traffic[0].tokens, 1200);
      assert.equal(result.recentUsage[0].usageIn, 128);
      assert.equal(result.recentUsage[0].isApiUser, true);
    },
  );
});

test("admin finance service reads transaction and billing lists from generated backend SDK data", async () => {
  await withBackendSdkFetch(
    (url) => {
      if (url === "/backend/v3/api/finance/admin/ledger") {
        return {
          items: [
            {
              id: "txn-1",
              time: "2026-05-05T08:00:00Z",
              userId: "user-1",
              type: "refund",
              amount: "12.5",
              balance: "100",
              description: "Credit refund",
              status: "pending",
            },
          ],
        };
      }
      if (url === "/backend/v3/api/router/finance/usage-statements") {
        return {
          items: [
            {
              id: "bill-1",
              userId: "user-1",
              period: "2026-05",
              totalTokens: "12000",
              totalCost: "36.5",
              status: "overdue",
              dueDate: "2026-06-01",
            },
          ],
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async (captured) => {
      const transactions = await FinanceService.fetchTransactions();
      const billing = await FinanceService.fetchBilling();

      assert.deepEqual(captured.map((request) => request.url), [
        "/backend/v3/api/finance/admin/ledger",
        "/backend/v3/api/router/finance/usage-statements",
      ]);
      assert.equal(transactions[0].amount, "12.50");
      assert.equal(transactions[0].status, "pending");
      assert.equal(billing[0].totalTokens, 12000);
      assert.equal(billing[0].totalCost, "36.50");
      assert.equal(billing[0].status, "overdue");
    },
  );
});

test("admin monitor service reads nodes alerts and performance through backend SDK paths", async () => {
  await withBackendSdkFetch(
    (url) => {
      if (url === "/backend/v3/api/router/monitor/nodes") {
        return {
          items: [
            {
              id: "node-1",
              name: "edge-shanghai",
              region: "cn-east",
              status: "warning",
              cpu: "72.5",
              memory: 61,
              uptime: "99.99%",
              ip: "10.0.0.10",
            },
          ],
        };
      }
      if (url === "/backend/v3/api/router/monitor/alerts") {
        return {
          items: [
            {
              id: "alert-1",
              severity: "critical",
              title: "High latency",
              message: "P95 latency exceeded threshold",
              time: "2026-05-05T08:00:00Z",
              status: "resolved",
              source: "gateway",
            },
          ],
        };
      }
      if (url === "/backend/v3/api/router/monitor/performance") {
        return {
          items: [{ time: "10:00", cpu: 70, memory: "64", network: 220 }],
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async (captured) => {
      const nodes = await MonitorService.fetchNodes();
      const alerts = await MonitorService.fetchAlerts();
      const performance = await MonitorService.fetchPerformanceData();

      assert.deepEqual(captured.map((request) => request.url), [
        "/backend/v3/api/router/monitor/nodes",
        "/backend/v3/api/router/monitor/alerts",
        "/backend/v3/api/router/monitor/performance",
      ]);
      assert.equal(nodes[0].status, "warning");
      assert.equal(nodes[0].cpu, 72.5);
      assert.equal(alerts[0].severity, "critical");
      assert.equal(alerts[0].status, "resolved");
      assert.equal(performance[0].memory, 64);
    },
  );
});

test("admin record service reads backend logs and total from generated backend SDK data", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      assert.equal(url, "/backend/v3/api/record/list");
      assert.equal(init?.method ?? "GET", "POST");
      assert.deepEqual(JSON.parse(typeof init?.body === "string" ? init.body : "{}"), {
        user: "user-1",
        model: "gpt-4o-mini",
      });
      return {
        total: "1",
        logs: [
          {
            id: "log-1",
            user: "user-1",
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
            baseOutputPrice: "0.6",
            cacheReadPrice: "0.02",
            path: "/v1/chat/completions",
            reasoningEffort: "medium",
            ip: "10.0.0.11",
          },
        ],
      };
    },
    async (captured) => {
      const result = await RecordService.fetchLogs({ user: "user-1", model: "gpt-4o-mini" });

      assert.equal(captured.length, 1);
      assert.equal(result.total, 1);
      assert.equal(result.logs[0].requestId, "req-1");
      assert.equal(result.logs[0].inputTokens, 100);
      assert.equal(result.logs[0].isStream, true);
      assert.equal(result.logs[0].cost, "0.012345");
    },
  );
});

test("admin record service normalizes log filters before generated backend SDK call", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      assert.equal(url, "/backend/v3/api/record/list");
      assert.equal(init?.method ?? "GET", "POST");
      assert.deepEqual(JSON.parse(typeof init?.body === "string" ? init.body : "{}"), {
        pageNo: 2,
        pageSize: 200,
        user: "owner@example.com",
        token: "prod-key",
        model: "gpt-4o-mini",
      });
      return { total: 0, logs: [] };
    },
    async (captured) => {
      const result = await RecordService.fetchLogs({
        pageNo: "2",
        pageSize: "200",
        user: " owner@example.com ",
        token: " prod-key ",
        model: " gpt-4o-mini ",
        ignored: "drop-me",
        empty: "",
      });

      assert.equal(captured.length, 1);
      assert.equal(result.total, 0);
      assert.deepEqual(result.logs, []);
    },
  );
});

test("admin record service rejects invalid log filters before generated backend SDK call", async () => {
  await withBackendSdkFetch(
    () => {
      throw new Error("backend SDK must not be called for invalid record log filters");
    },
    async (captured) => {
      await assert.rejects(() => RecordService.fetchLogs({ pageNo: 0 }), /pageNo must be a positive integer/);
      await assert.rejects(() => RecordService.fetchLogs({ pageSize: 0 }), /pageSize must be between 1 and 200/);
      await assert.rejects(() => RecordService.fetchLogs({ pageSize: 201 }), /pageSize must be between 1 and 200/);
      await assert.rejects(
        () => RecordService.fetchLogs({ user: "x".repeat(129) }),
        /user must be visible ASCII and at most 128 characters/,
      );
      await assert.rejects(
        () => RecordService.fetchLogs({ model: "bad\u0001model" }),
        /model must be visible ASCII and at most 128 characters/,
      );
      await assert.rejects(
        () => RecordService.fetchLogs({ token: { value: "prod-key" } }),
        /token must be a string/,
      );
      assert.equal(captured.length, 0);
    },
  );
});

test("admin dashboard recent usage fails closed when backend omits stable row ids", async () => {
  await withBackendSdkFetch(
    (url) => {
      if (url === "/backend/v3/api/dashboard/admin/overview") {
        return {
          userConsumption: [],
          multimodal: [],
          traffic: [],
          modelDistribution: [],
          recentUsage: [
            {
              user: "ops@example.com",
              isApiUser: true,
              model: "gpt-4o-mini",
              type: "text",
              billingMode: "tokens",
              usageIn: "128",
              time: "2026-05-05T08:00:00Z",
              status: "success",
              cost: "0.03",
            },
          ],
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => AdminDashboardService.fetchDashboardData(),
        /Recent usage trace id is required/,
      );
    },
  );
});

test("admin dashboard lists fail closed when backend returns malformed dashboard rows", async () => {
  for (const [field, row, message] of [
    ["userConsumption", "not-a-pie-record", /Dashboard pie chart record is required/],
    ["traffic", "not-a-traffic-record", /Dashboard traffic record is required/],
    ["recentUsage", "not-a-usage-record", /Recent usage trace record is required/],
  ] as const) {
    await withBackendSdkFetch(
      (url) => {
        if (url === "/backend/v3/api/dashboard/admin/overview") {
          return {
            userConsumption: [],
            multimodal: [],
            traffic: [],
            modelDistribution: [],
            recentUsage: [],
            [field]: [row],
          };
        }
        throw new Error(`unexpected SDK URL: ${url}`);
      },
      async () => {
        await assert.rejects(
          () => AdminDashboardService.fetchDashboardData(),
          message,
        );
      },
    );
  }
});

test("admin dashboard lists fail closed when backend omits required dashboard fields", async () => {
  await withBackendSdkFetch(
    (url) => {
      if (url === "/backend/v3/api/dashboard/admin/overview") {
        return {
          userConsumption: [{ value: 80, color: "#2563eb" }],
          multimodal: [],
          traffic: [],
          modelDistribution: [],
          recentUsage: [],
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => AdminDashboardService.fetchDashboardData(),
        /Dashboard pie chart name is required/,
      );
    },
  );

  await withBackendSdkFetch(
    (url) => {
      if (url === "/backend/v3/api/dashboard/admin/overview") {
        return {
          userConsumption: [],
          multimodal: [],
          traffic: [{ tokens: 1200, requests: 12, cost: 0.24 }],
          modelDistribution: [],
          recentUsage: [],
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => AdminDashboardService.fetchDashboardData(),
        /Dashboard traffic time is required/,
      );
    },
  );

  await withBackendSdkFetch(
    (url) => {
      if (url === "/backend/v3/api/dashboard/admin/overview") {
        return {
          userConsumption: [],
          multimodal: [],
          traffic: [],
          modelDistribution: [],
          recentUsage: [
            {
              id: "usage-1",
              isApiUser: true,
              model: "gpt-4o-mini",
              type: "text",
              billingMode: "tokens",
              time: "2026-05-05T08:00:00Z",
              status: "success",
              cost: "0.03",
            },
          ],
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => AdminDashboardService.fetchDashboardData(),
        /Recent usage trace user is required/,
      );
    },
  );
});

test("admin dashboard recent usage fails closed when backend returns invalid money values", async () => {
  await withBackendSdkFetch(
    (url) => {
      if (url === "/backend/v3/api/dashboard/admin/overview") {
        return {
          userConsumption: [],
          multimodal: [],
          traffic: [],
          modelDistribution: [],
          recentUsage: [
            {
              id: "usage-1",
              user: "ops@example.com",
              isApiUser: true,
              model: "gpt-4o-mini",
              type: "text",
              billingMode: "tokens",
              time: "2026-05-05T08:00:00Z",
              status: "success",
              cost: "not-a-decimal",
            },
          ],
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => AdminDashboardService.fetchDashboardData(),
        /Recent usage trace cost must be a decimal string/,
      );
    },
  );
});

test("admin finance transaction list fails closed when backend omits stable transaction ids", async () => {
  await withBackendSdkFetch(
    (url) => {
      if (url === "/backend/v3/api/finance/admin/ledger") {
        return {
          items: [
            {
              time: "2026-05-05T08:00:00Z",
              userId: "user-1",
              type: "refund",
              amount: "12.5",
              balance: "100",
              description: "Credit refund",
              status: "pending",
            },
          ],
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => FinanceService.fetchTransactions(),
        /Transaction id is required/,
      );
    },
  );
});

test("admin finance transaction list fails closed when backend returns malformed rows", async () => {
  await withBackendSdkFetch(
    (url) => {
      if (url === "/backend/v3/api/finance/admin/ledger") {
        return {
          items: [
            {
              id: "txn-1",
              time: "2026-05-05T08:00:00Z",
              userId: "user-1",
              type: "refund",
              amount: "12.5",
              balance: "100",
              description: "Credit refund",
              status: "pending",
            },
            "malformed-row",
          ],
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => FinanceService.fetchTransactions(),
        /Transaction record is required/,
      );
    },
  );
});

test("admin finance transaction list fails closed when backend returns unsupported transaction types", async () => {
  await withBackendSdkFetch(
    (url) => {
      if (url === "/backend/v3/api/finance/admin/ledger") {
        return {
          items: [
            {
              id: "txn-1",
              time: "2026-05-05T08:00:00Z",
              userId: "user-1",
              type: "manual-adjustment",
              amount: "12.5",
              balance: "100",
              description: "Manual adjustment",
              status: "pending",
            },
          ],
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => FinanceService.fetchTransactions(),
        /Unsupported transaction type: manual-adjustment/,
      );
    },
  );
});

test("admin finance transaction list fails closed when backend omits required ledger fields", async () => {
  for (const [field, message] of [
    ["time", /Transaction time is required/],
    ["userId", /Transaction user id is required/],
    ["amount", /Transaction amount is required/],
    ["balance", /Transaction balance is required/],
    ["description", /Transaction description is required/],
  ] as const) {
    await withBackendSdkFetch(
      (url) => {
        if (url === "/backend/v3/api/finance/admin/ledger") {
          const transaction = {
            id: "txn-1",
            time: "2026-05-05T08:00:00Z",
            userId: "user-1",
            type: "refund",
            amount: "12.5",
            balance: "100",
            description: "Credit refund",
            status: "pending",
          } as Record<string, unknown>;
          delete transaction[field];
          return { items: [transaction] };
        }
        throw new Error(`unexpected SDK URL: ${url}`);
      },
      async () => {
        await assert.rejects(
          () => FinanceService.fetchTransactions(),
          message,
        );
      },
    );
  }
});

test("admin finance transaction list fails closed when backend returns invalid money or status values", async () => {
  for (const [patch, message] of [
    [{ amount: "not-money" }, /Transaction amount must be a money string/],
    [{ balance: "12.345" }, /Transaction balance must be a money string/],
    [{ status: "settled" }, /Unsupported transaction status: settled/],
  ] as const) {
    await withBackendSdkFetch(
      (url) => {
        if (url === "/backend/v3/api/finance/admin/ledger") {
          return {
            items: [
              {
                id: "txn-1",
                time: "2026-05-05T08:00:00Z",
                userId: "user-1",
                type: "refund",
                amount: "12.5",
                balance: "100",
                description: "Credit refund",
                status: "pending",
                ...patch,
              },
            ],
          };
        }
        throw new Error(`unexpected SDK URL: ${url}`);
      },
      async () => {
        await assert.rejects(
          () => FinanceService.fetchTransactions(),
          message,
        );
      },
    );
  }
});

test("admin finance billing list fails closed when backend omits stable billing ids", async () => {
  await withBackendSdkFetch(
    (url) => {
      if (url === "/backend/v3/api/router/finance/usage-statements") {
        return {
          items: [
            {
              userId: "user-1",
              period: "2026-05",
              totalTokens: "12000",
              totalCost: "36.5",
              status: "overdue",
              dueDate: "2026-06-01",
            },
          ],
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => FinanceService.fetchBilling(),
        /Billing record id is required/,
      );
    },
  );
});

test("admin finance billing list fails closed when backend returns malformed rows", async () => {
  await withBackendSdkFetch(
    (url) => {
      if (url === "/backend/v3/api/router/finance/usage-statements") {
        return {
          items: [
            {
              id: "bill-1",
              userId: "user-1",
              period: "2026-05",
              totalTokens: "12000",
              totalCost: "36.5",
              status: "overdue",
              dueDate: "2026-06-01",
            },
            "malformed-row",
          ],
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => FinanceService.fetchBilling(),
        /Billing record is required/,
      );
    },
  );
});

test("admin finance billing list fails closed when backend omits required statement fields", async () => {
  for (const [field, message] of [
    ["userId", /Billing user id is required/],
    ["period", /Billing period is required/],
    ["totalTokens", /Billing total tokens are required/],
    ["totalCost", /Billing total cost is required/],
    ["status", /Billing status is required/],
    ["dueDate", /Billing due date is required/],
  ] as const) {
    await withBackendSdkFetch(
      (url) => {
        if (url === "/backend/v3/api/router/finance/usage-statements") {
          const billing = {
            id: "bill-1",
            userId: "user-1",
            period: "2026-05",
            totalTokens: "12000",
            totalCost: "36.5",
            status: "overdue",
            dueDate: "2026-06-01",
          } as Record<string, unknown>;
          delete billing[field];
          return { items: [billing] };
        }
        throw new Error(`unexpected SDK URL: ${url}`);
      },
      async () => {
        await assert.rejects(
          () => FinanceService.fetchBilling(),
          message,
        );
      },
    );
  }
});

test("admin finance billing list fails closed when backend returns invalid statement values", async () => {
  for (const [patch, message] of [
    [{ totalTokens: -1 }, /Billing total tokens are required/],
    [{ totalCost: "not-money" }, /Billing total cost must be a money string/],
    [{ status: "archived" }, /Unsupported billing status: archived/],
  ] as const) {
    await withBackendSdkFetch(
      (url) => {
        if (url === "/backend/v3/api/router/finance/usage-statements") {
          return {
            items: [
              {
                id: "bill-1",
                userId: "user-1",
                period: "2026-05",
                totalTokens: "12000",
                totalCost: "36.5",
                status: "overdue",
                dueDate: "2026-06-01",
                ...patch,
              },
            ],
          };
        }
        throw new Error(`unexpected SDK URL: ${url}`);
      },
      async () => {
        await assert.rejects(
          () => FinanceService.fetchBilling(),
          message,
        );
      },
    );
  }
});

test("admin monitor lists fail closed when backend omits stable node or alert ids", async () => {
  await withBackendSdkFetch(
    (url) => {
      if (url === "/backend/v3/api/router/monitor/nodes") {
        return {
          items: [
            {
              name: "edge-shanghai",
              region: "cn-east",
              status: "warning",
              cpu: "72.5",
              memory: 61,
              uptime: "99.99%",
              ip: "10.0.0.10",
            },
          ],
        };
      }
      if (url === "/backend/v3/api/router/monitor/alerts") {
        return {
          items: [
            {
              severity: "critical",
              title: "High latency",
              message: "P95 latency exceeded threshold",
              time: "2026-05-05T08:00:00Z",
              status: "resolved",
              source: "gateway",
            },
          ],
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => MonitorService.fetchNodes(),
        /System node id is required/,
      );
      await assert.rejects(
        () => MonitorService.fetchAlerts(),
        /Alert id is required/,
      );
    },
  );
});

test("admin monitor lists fail closed when backend returns malformed monitor rows", async () => {
  await withBackendSdkFetch(
    (url) => {
      if (url === "/backend/v3/api/router/monitor/nodes") {
        return { items: ["not-a-node-record"] };
      }
      if (url === "/backend/v3/api/router/monitor/alerts") {
        return { items: ["not-an-alert-record"] };
      }
      if (url === "/backend/v3/api/router/monitor/performance") {
        return { items: ["not-a-performance-record"] };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => MonitorService.fetchNodes(),
        /System node record is required/,
      );
      await assert.rejects(
        () => MonitorService.fetchAlerts(),
        /Alert record is required/,
      );
      await assert.rejects(
        () => MonitorService.fetchPerformanceData(),
        /Performance record is required/,
      );
    },
  );
});

test("admin monitor lists fail closed when backend omits required monitor fields", async () => {
  await withBackendSdkFetch(
    (url) => {
      if (url === "/backend/v3/api/router/monitor/nodes") {
        return {
          items: [
            {
              id: "node-1",
              region: "cn-east",
              status: "warning",
              cpu: "72.5",
              memory: 61,
              uptime: "99.99%",
              ip: "10.0.0.10",
            },
          ],
        };
      }
      if (url === "/backend/v3/api/router/monitor/alerts") {
        return {
          items: [
            {
              id: "alert-1",
              severity: "critical",
              message: "P95 latency exceeded threshold",
              time: "2026-05-05T08:00:00Z",
              status: "resolved",
              source: "gateway",
            },
          ],
        };
      }
      if (url === "/backend/v3/api/router/monitor/performance") {
        return {
          items: [{ cpu: 70, memory: "64", network: 220 }],
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => MonitorService.fetchNodes(),
        /System node name is required/,
      );
      await assert.rejects(
        () => MonitorService.fetchAlerts(),
        /Alert title is required/,
      );
      await assert.rejects(
        () => MonitorService.fetchPerformanceData(),
        /Performance time is required/,
      );
    },
  );
});

test("admin monitor lists fail closed when backend returns unsupported monitor enums", async () => {
  await withBackendSdkFetch(
    (url) => {
      if (url === "/backend/v3/api/router/monitor/nodes") {
        return {
          items: [
            {
              id: "node-1",
              name: "edge-shanghai",
              region: "cn-east",
              status: "degraded",
              cpu: "72.5",
              memory: 61,
              uptime: "99.99%",
              ip: "10.0.0.10",
            },
          ],
        };
      }
      if (url === "/backend/v3/api/router/monitor/alerts") {
        return {
          items: [
            {
              id: "alert-1",
              severity: "urgent",
              title: "High latency",
              message: "P95 latency exceeded threshold",
              time: "2026-05-05T08:00:00Z",
              status: "muted",
              source: "gateway",
            },
          ],
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => MonitorService.fetchNodes(),
        /Unsupported system node status: degraded/,
      );
      await assert.rejects(
        () => MonitorService.fetchAlerts(),
        /Unsupported alert severity: urgent/,
      );
    },
  );
});

test("admin record log list fails closed when backend omits stable log ids", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      if (url === "/backend/v3/api/record/list" && (init?.method ?? "GET") === "POST") {
        return {
          total: 1,
          logs: [
            {
              user: "user-1",
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
              baseOutputPrice: "0.6",
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
        () => RecordService.fetchLogs(),
        /Log record id is required/,
      );
    },
  );
});

test("admin record log list fails closed when backend returns malformed log rows", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      if (url === "/backend/v3/api/record/list" && (init?.method ?? "GET") === "POST") {
        return {
          total: 1,
          logs: ["not-a-log-record"],
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => RecordService.fetchLogs(),
        /Log record is required/,
      );
    },
  );
});

test("admin record log list fails closed when backend omits required audit fields", async () => {
  for (const [field, message] of [
    ["requestId", /Log request id is required/],
    ["inputTokens", /Log input tokens are required/],
    ["cost", /Log cost is required/],
  ] as const) {
    await withBackendSdkFetch(
      (url, init) => {
        if (url === "/backend/v3/api/record/list" && (init?.method ?? "GET") === "POST") {
          const log = {
            id: "log-1",
            user: "user-1",
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
            baseOutputPrice: "0.6",
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
          () => RecordService.fetchLogs(),
          message,
        );
      },
    );
  }
});

test("admin record log list fails closed when backend returns invalid decimal audit values", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      if (url === "/backend/v3/api/record/list" && (init?.method ?? "GET") === "POST") {
        return {
          total: 1,
          logs: [
            {
              id: "log-1",
              user: "user-1",
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
              baseOutputPrice: "0.6",
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
        () => RecordService.fetchLogs(),
        /Log cost must be a decimal string/,
      );
    },
  );
});

test("admin record log list fails closed when backend omits or corrupts pagination total", async () => {
  for (const total of [undefined, -1, "not-a-number"]) {
    await withBackendSdkFetch(
      (url, init) => {
        if (url === "/backend/v3/api/record/list" && (init?.method ?? "GET") === "POST") {
          return {
            ...(total === undefined ? {} : { total }),
            logs: [
              {
                id: "log-1",
                user: "user-1",
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
                baseOutputPrice: "0.6",
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
          () => RecordService.fetchLogs(),
          /Backend log total is required/,
        );
      },
    );
  }
});
