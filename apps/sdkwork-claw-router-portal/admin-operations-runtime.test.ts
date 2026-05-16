import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { resetClawRouterSdkClients } from "./packages/sdkwork-claw-router-commons/src/sdk-clients.ts";
import { AdminDashboardService } from "./packages/sdkwork-claw-router-admin-dashboard/src/dashboardService.ts";
import { FinanceService } from "./packages/sdkwork-claw-router-admin-finance/src/financeService.ts";
import { buildFinanceOverviewCards, buildFinanceReportCsv } from "./packages/sdkwork-claw-router-admin-finance/src/financeViewModel.ts";
import { MonitorService } from "./packages/sdkwork-claw-router-admin-monitor/src/monitorService.ts";
import { createModelInputFromForm, updateModelInputFromForm } from "./packages/sdkwork-claw-router-admin-model/src/modelForm.ts";
import { ModelService, type Model } from "./packages/sdkwork-claw-router-admin-model/src/modelService.ts";
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

function isSystemRecordsRequest(url: string, init?: RequestInit): boolean {
  return new URL(url, "http://localhost").pathname === "/backend/v3/api/system/records"
    && (init?.method ?? "GET") === "GET";
}

function readAdminRecordSource(): string {
  return readFileSync(
    new URL("./packages/sdkwork-claw-router-admin-record/src/index.tsx", import.meta.url),
    "utf8",
  );
}

function readAdminMonitorSource(): string {
  return readFileSync(
    new URL("./packages/sdkwork-claw-router-admin-monitor/src/index.tsx", import.meta.url),
    "utf8",
  );
}

function readAdminFinanceSource(): string {
  return readFileSync(
    new URL("./packages/sdkwork-claw-router-admin-finance/src/index.tsx", import.meta.url),
    "utf8",
  );
}

function readAdminDashboardSource(): string {
  return readFileSync(
    new URL("./packages/sdkwork-claw-router-admin-dashboard/src/index.tsx", import.meta.url),
    "utf8",
  );
}

function adminDashboardFixture(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    userConsumption: [],
    multimodal: [],
    traffic: [],
    modelDistribution: [],
    recentUsage: [],
    ...overrides,
  };
}

test("admin dashboard service reads generated backend SDK dashboard data", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      assert.equal(init?.method ?? "GET", "GET");
      assert.equal(url, "/backend/v3/api/system/dashboard/admin/overview");
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

test("admin dashboard service derives summary cards from backend snapshot without synthetic traffic", async () => {
  const serviceSource = readFileSync(
    new URL("./packages/sdkwork-claw-router-admin-dashboard/src/dashboardService.ts", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(serviceSource, /generateTrafficData/);
  assert.doesNotMatch(serviceSource, /Math\.(sin|cos|random)/);

  await withBackendSdkFetch(
    (url) => {
      assert.equal(url, "/backend/v3/api/system/dashboard/admin/overview");
      return {
        userConsumption: [
          { name: "alice@example.com", value: 12.5, color: "#2563eb" },
          { name: "bob@example.com", value: 7.5, color: "#16a34a" },
        ],
        multimodal: [
          { name: "text", value: 3, color: "#2563eb" },
          { name: "image", value: 2, color: "#7c3aed" },
        ],
        traffic: [
          { time: "2026-05-15", tokens: 1500, requests: 3, cost: 0.12 },
          { time: "2026-05-16", tokens: 2500, requests: 5, cost: 0.2 },
        ],
        modelDistribution: [
          { name: "gpt-4o-mini", value: 4, color: "#16a34a" },
          { name: "claude-sonnet", value: 2, color: "#7c3aed" },
        ],
        recentUsage: [
          {
            id: "usage-1",
            user: "alice@example.com",
            isApiUser: true,
            model: "gpt-4o-mini",
            type: "text",
            billingMode: "usage",
            usageIn: 100,
            usageOut: 50,
            usageCount: 2,
            time: "2026-05-16T08:00:00Z",
            status: "success",
            cost: "0.030000",
          },
          {
            id: "usage-2",
            user: "bob@example.com",
            isApiUser: false,
            model: "claude-sonnet",
            type: "image",
            billingMode: "usage",
            usageIn: 10,
            usageOut: 5,
            usageCount: 1,
            time: "2026-05-16T08:01:00Z",
            status: "failed",
            cost: "0.010000",
          },
        ],
      };
    },
    async () => {
      const result = await AdminDashboardService.fetchDashboardData();

      assert.deepEqual(result.traffic, [
        { time: "2026-05-15", tokens: 1500, requests: 3, cost: 0.12 },
        { time: "2026-05-16", tokens: 2500, requests: 5, cost: 0.2 },
      ]);
      assert.deepEqual(
        result.summaryCards.map((card) => [card.label, card.value, card.detail]),
        [
          ["活跃用户", "2", "$20.00 用户消费"],
          ["模型覆盖", "2", "6 次模型调用"],
          ["总请求", "8", "来自后端 traffic 快照"],
          ["总 Tokens", "4K", "累计计费 $0.32"],
          ["模态调用", "5", "2 个模态"],
          ["实时流水", "2", "1 成功 / 1 失败"],
          ["最近 API 调用", "1", "50.0% API Key"],
          ["平均单次成本", "$0.04", "按请求数计算"],
        ],
      );
    },
  );
});

test("admin model form keeps persisted capability fields from the model editor", () => {
  const form = new FormData();
  form.set("name", "gpt-capability-pro");
  form.set("type", "Chat");
  form.set("priceIn", "0.120000");
  form.set("priceOut", "0.450000");
  form.set("contextTokens", "128k");
  form.set("maxOutputTokens", "8192");
  form.set("description", "Commercial chat model for production traffic.");
  form.set("capabilityIntro", "Low latency chat, structured output, and tool calling.");
  form.set("limitations", "No medical diagnosis, No legal advice");
  form.set("supportedLanguages", "English, Chinese, English");
  form.set("useCases", "Customer support, Data extraction");
  form.set("supportsStreaming", "on");
  form.set("supportsTools", "true");
  form.set("supportsJsonSchema", "1");

  const created = createModelInputFromForm(form, "vendor-1");
  assert.deepEqual(created, {
    vendorId: "vendor-1",
    name: "gpt-capability-pro",
    type: "Chat",
    priceIn: "0.120000",
    priceOut: "0.450000",
    contextTokens: "128k",
    maxOutputTokens: 8192,
    description: "Commercial chat model for production traffic.",
    capabilityIntro: "Low latency chat, structured output, and tool calling.",
    limitations: ["No medical diagnosis", "No legal advice"],
    supportedLanguages: ["English", "Chinese"],
    useCases: ["Customer support", "Data extraction"],
    supportsStreaming: true,
    supportsTools: true,
    supportsJsonSchema: true,
  });

  const currentModel = {
    id: "model-1",
    vendorId: "vendor-1",
    name: "gpt-capability-pro",
    type: "Chat",
    priceIn: "0.120000",
    priceOut: "0.450000",
    status: "active",
    calls: "0",
    description: null,
    modalities: ["text"],
    inputModalities: ["text"],
    outputModalities: ["text"],
    apiFormat: "openai_responses",
    capabilityIntro: null,
    limitations: [],
    supportedLanguages: [],
    useCases: [],
    trainingDataCutoff: null,
    contextTokens: 128000,
    maxOutputTokens: null,
    supportsStreaming: true,
    supportsTools: true,
    supportsJsonSchema: true,
    releaseStage: 1,
    shelfState: 1,
    routingState: 1,
    replacementModel: null,
  } satisfies Model;

  assert.deepEqual(updateModelInputFromForm(form, "vendor-1", currentModel), {
    ...created,
    currentType: "Chat",
  });
});

test("admin model service sends capability fields through the generated backend SDK", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      assert.equal(url, "/backend/v3/api/ai/models");
      assert.equal(init?.method ?? "GET", "POST");
      assert.deepEqual(JSON.parse(String(init?.body ?? "{}")), {
        vendorId: "vendor-1",
        name: "gpt-capability-pro",
        type: "Chat",
        priceIn: "0.120000",
        priceOut: "0.450000",
        contextTokens: "128k",
        description: "Commercial chat model for production traffic.",
        capabilityIntro: "Low latency chat, structured output, and tool calling.",
        limitations: ["No medical diagnosis", "No legal advice"],
        supportedLanguages: ["English", "Chinese"],
        useCases: ["Customer support", "Data extraction"],
        maxOutputTokens: 8192,
        supportsStreaming: true,
        supportsTools: true,
        supportsJsonSchema: true,
        modalities: ["text"],
        inputModalities: ["text", "image"],
        outputModalities: ["text"],
        apiFormat: "openai_responses",
        releaseStage: 1,
        shelfState: 1,
        routingState: 1,
      });
      return {
        item: {
          id: "model-1",
          vendorId: "vendor-1",
          vendorCode: "openai",
          name: "gpt-capability-pro",
          type: "Chat",
          priceIn: "0.120000",
          priceOut: "0.450000",
          status: "active",
          calls: "0",
          description: "Commercial chat model for production traffic.",
          modalities: ["text"],
          inputModalities: ["text", "image"],
          outputModalities: ["text"],
          apiFormat: "openai_responses",
          capabilityIntro: "Low latency chat, structured output, and tool calling.",
          limitations: ["No medical diagnosis", "No legal advice"],
          supportedLanguages: ["English", "Chinese"],
          useCases: ["Customer support", "Data extraction"],
          trainingDataCutoff: null,
          contextTokens: 128000,
          maxOutputTokens: 8192,
          supportsStreaming: true,
          supportsTools: true,
          supportsJsonSchema: true,
          releaseStage: 1,
          shelfState: 1,
          routingState: 1,
          replacementModel: null,
        },
      };
    },
    async () => {
      const result = await ModelService.addModel({
        vendorId: "vendor-1",
        name: "gpt-capability-pro",
        type: "Chat",
        priceIn: "0.120000",
        priceOut: "0.450000",
        contextTokens: "128k",
        description: "Commercial chat model for production traffic.",
        capabilityIntro: "Low latency chat, structured output, and tool calling.",
        limitations: ["No medical diagnosis", "No legal advice"],
        supportedLanguages: ["English", "Chinese"],
        useCases: ["Customer support", "Data extraction"],
        maxOutputTokens: 8192,
        supportsStreaming: true,
        supportsTools: true,
        supportsJsonSchema: true,
      });

      assert.equal(result.maxOutputTokens, 8192);
      assert.equal(result.supportsTools, true);
    },
  );
});
test("admin finance service reads transaction and billing lists from generated backend SDK data", async () => {
  await withBackendSdkFetch(
    (url) => {
      if (url === "/backend/v3/api/billing/finance/ledger") {
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
      if (url === "/backend/v3/api/billing/finance/usage_statements") {
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
        "/backend/v3/api/billing/finance/ledger",
        "/backend/v3/api/billing/finance/usage_statements",
      ]);
      assert.equal(transactions[0].amount, "12.50");
      assert.equal(transactions[0].status, "pending");
      assert.equal(billing[0].totalTokens, 12000);
      assert.equal(billing[0].totalCost, "36.50");
      assert.equal(billing[0].status, "overdue");
    },
  );
});

test("admin finance page derives overview and report export from loaded backend data", () => {
  const source = readAdminFinanceSource();

  assert.match(source, /const overviewCards = buildFinanceOverviewCards\(transactions, billing\)/);
  assert.match(source, /const exportCurrentReport = \(\) => \{/);
  assert.match(source, /buildFinanceReportCsv\(activeTab === 'transactions' \? filteredTransactions : filteredBilling, activeTab\)/);
  assert.match(source, /new Blob\(\[csv\], \{ type: 'text\/csv;charset=utf-8;' \}\)/);
  assert.match(source, /disabled=\{totalItems === 0\}/);
  assert.doesNotMatch(source, /12450\.00/);
  assert.doesNotMatch(source, /98230\.50/);
  assert.doesNotMatch(source, /14 笔/);
  assert.doesNotMatch(source, /<Filter\b/);
  assert.doesNotMatch(source, />\s*查看详情\s*</);

  const transactions = [
    {
      id: "txn-1",
      time: "2026-05-16T01:00:00Z",
      userId: "user-1",
      type: "recharge",
      amount: "125.50",
      balance: "125.50",
      description: "Recharge",
      status: "success",
    },
    {
      id: "txn-2",
      time: "2026-05-16T02:00:00Z",
      userId: "user-2",
      type: "refund",
      amount: "-20.00",
      balance: "10.00",
      description: "Refund",
      status: "pending",
    },
    {
      id: "txn-3",
      time: "2026-05-15T02:00:00Z",
      userId: "user-3",
      type: "consume",
      amount: "-3.25",
      balance: "8.00",
      description: "Usage",
      status: "failed",
    },
  ] satisfies Awaited<ReturnType<typeof FinanceService.fetchTransactions>>;
  const billing = [
    {
      id: "bill-1",
      userId: "user-1",
      period: "2026-05",
      totalTokens: 1200,
      totalCost: "1.50",
      status: "unpaid",
      dueDate: "2026-06-01",
    },
    {
      id: "bill-2",
      userId: "user-2",
      period: "2026-05",
      totalTokens: 3400,
      totalCost: "2.25",
      status: "overdue",
      dueDate: "2026-06-02",
    },
  ] satisfies Awaited<ReturnType<typeof FinanceService.fetchBilling>>;

  assert.deepEqual(
    buildFinanceOverviewCards(transactions, billing, "2026-05-16").map(card => [card.title, card.value, card.target]),
    [
      ["今日充值总计", "$125.50", "1 笔成功充值"],
      ["本月消费总计", "$3.25", "1 笔消费流水"],
      ["今日退款", "$20.00", "1 笔退款流水"],
      ["待结算账单", "2 笔", "$3.75 待处理"],
    ],
  );

  assert.match(
    buildFinanceReportCsv(transactions.slice(0, 1), "transactions"),
    /^id,time,userId,type,amount,balance,status,description\r?\ntxn-1,2026-05-16T01:00:00Z,user-1,recharge,125.50,125.50,success,Recharge$/,
  );
  assert.match(
    buildFinanceReportCsv(billing.slice(0, 1), "billing"),
    /^id,period,userId,totalTokens,totalCost,status,dueDate\r?\nbill-1,2026-05,user-1,1200,1.50,unpaid,2026-06-01$/,
  );
});

test("admin dashboard live traces link to full records and render backend status", () => {
  const source = readAdminDashboardSource();

  assert.match(source, /import \{ Link \} from 'react-router-dom'/);
  assert.match(source, /<Link\s+to="\/admin\/record"/);
  assert.doesNotMatch(source, /<button className="text-xs text-blue-500/);
  assert.match(source, /item\.status\.trim\(\)\.toLowerCase\(\) === 'success'/);
  assert.match(source, /item\.status\.trim\(\) \|\| 'unknown'/);
  assert.doesNotMatch(source, /<div className="w-1\.5 h-1\.5 rounded-full bg-emerald-500" \/> 成功/);
});

test("admin monitor service reads nodes alerts and performance through backend SDK paths", async () => {
  await withBackendSdkFetch(
    (url) => {
      if (url === "/backend/v3/api/system/monitor/nodes") {
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
      if (url === "/backend/v3/api/system/monitor/alerts") {
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
      if (url === "/backend/v3/api/system/monitor/performance") {
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
        "/backend/v3/api/system/monitor/nodes",
        "/backend/v3/api/system/monitor/alerts",
        "/backend/v3/api/system/monitor/performance",
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
      const requestUrl = new URL(url, "http://localhost");
      assert.equal(requestUrl.pathname, "/backend/v3/api/system/records");
      assert.equal(init?.method ?? "GET", "GET");
      assert.equal(requestUrl.searchParams.get("user"), "user-1");
      assert.equal(requestUrl.searchParams.get("model"), "gpt-4o-mini");
      assert.equal(typeof init?.body === "string" ? init.body : "", "");
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
      const requestUrl = new URL(url, "http://localhost");
      assert.equal(requestUrl.pathname, "/backend/v3/api/system/records");
      assert.equal(init?.method ?? "GET", "GET");
      assert.equal(requestUrl.searchParams.get("page"), "2");
      assert.equal(requestUrl.searchParams.get("page_size"), "200");
      assert.equal(requestUrl.searchParams.get("user"), "owner@example.com");
      assert.equal(requestUrl.searchParams.get("token"), "prod-key");
      assert.equal(requestUrl.searchParams.get("model"), "gpt-4o-mini");
      assert.equal(requestUrl.searchParams.has("pageNo"), false);
      return { total: 0, logs: [] };
    },
    async (captured) => {
      const result = await RecordService.fetchLogs({
        page: "2",
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

test("admin record page uses backend-backed pagination instead of static fake pages", () => {
  const source = readAdminRecordSource();

  assert.match(source, /const \[page, setPage\] = useState\(1\)/);
  assert.match(source, /const \[pageSize, setPageSize\] = useState\(20\)/);
  assert.match(source, /RecordService\.fetchLogs\(\{ \.\.\.filters, page, pageSize \}\)/);
  assert.match(source, /onClick=\{\(\) => setPage\(\(current\) => Math\.max\(1, current - 1\)\)\}/);
  assert.match(source, /onClick=\{\(\) => setPage\(\(current\) => Math\.min\(totalPages, current \+ 1\)\)\}/);
  assert.match(source, /value=\{pageSize\}/);
  assert.match(source, /onChange=\{\(event\) => \{/);
  assert.equal(source.includes(">2</button>"), false);
  assert.equal(source.includes(">325</button>"), false);
  assert.equal(source.includes("<SlidersHorizontal"), false);
  assert.equal(source.includes("readOnly"), false);
});

test("admin monitor page exposes only local filters and no unsupported alert mutations", () => {
  const source = readAdminMonitorSource();

  assert.match(source, /const \[nodeSearch, setNodeSearch\] = useState\(''\)/);
  assert.match(source, /const filteredNodes = nodes\.filter/);
  assert.match(source, /value=\{nodeSearch\}/);
  assert.match(source, /onChange=\{\(event\) => setNodeSearch\(event\.target\.value\)\}/);
  assert.match(source, /const \[severityFilter, setSeverityFilter\] = useState<'all' \| Alert\['severity'\]>\('all'\)/);
  assert.match(source, /const \[statusFilter, setStatusFilter\] = useState<'all' \| Alert\['status'\]>\('all'\)/);
  assert.match(source, /const filteredAlerts = alerts\.filter/);
  assert.match(source, /Critical Alerts/);
  assert.match(source, /alerts\.filter\(\(alert\) => alert\.severity === 'critical' && alert\.status === 'active'\)\.length/);
  assert.equal(source.includes("Acknowledge"), false);
  assert.equal(source.includes("value: '1,248'"), false);
  assert.equal(source.includes("value: '98.5%'"), false);
});

test("admin record service rejects invalid log filters before generated backend SDK call", async () => {
  await withBackendSdkFetch(
    () => {
      throw new Error("backend SDK must not be called for invalid record log filters");
    },
    async (captured) => {
      await assert.rejects(() => RecordService.fetchLogs({ page: 0 }), /page must be a positive integer/);
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
      if (url === "/backend/v3/api/system/dashboard/admin/overview") {
        return adminDashboardFixture({
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
        });
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
    ["multimodal", "not-a-pie-record", /Dashboard pie chart record is required/],
    ["traffic", "not-a-traffic-record", /Dashboard traffic record is required/],
    ["modelDistribution", "not-a-pie-record", /Dashboard pie chart record is required/],
    ["recentUsage", "not-a-usage-record", /Recent usage trace record is required/],
  ] as const) {
    await withBackendSdkFetch(
      (url) => {
        if (url === "/backend/v3/api/system/dashboard/admin/overview") {
          return adminDashboardFixture({
            [field]: [row],
          });
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

test("admin dashboard lists fail closed when backend omits required top-level dashboard fields", async () => {
  for (const [field, message] of [
    ["userConsumption", /Dashboard userConsumption is required/],
    ["multimodal", /Dashboard multimodal is required/],
    ["traffic", /Dashboard traffic is required/],
    ["modelDistribution", /Dashboard modelDistribution is required/],
    ["recentUsage", /Dashboard recentUsage is required/],
  ] as const) {
    await withBackendSdkFetch(
      (url) => {
        if (url === "/backend/v3/api/system/dashboard/admin/overview") {
          const response = adminDashboardFixture();
          delete response[field];
          return response;
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
      if (url === "/backend/v3/api/system/dashboard/admin/overview") {
        return adminDashboardFixture({
          userConsumption: [{ value: 80, color: "#2563eb" }],
        });
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
      if (url === "/backend/v3/api/system/dashboard/admin/overview") {
        return adminDashboardFixture({
          userConsumption: [{ name: "Enterprise", value: 80 }],
        });
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async () => {
      await assert.rejects(
        () => AdminDashboardService.fetchDashboardData(),
        /Dashboard pie chart color is required/,
      );
    },
  );

  await withBackendSdkFetch(
    (url) => {
      if (url === "/backend/v3/api/system/dashboard/admin/overview") {
        return adminDashboardFixture({
          traffic: [{ tokens: 1200, requests: 12, cost: 0.24 }],
        });
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
      if (url === "/backend/v3/api/system/dashboard/admin/overview") {
        return adminDashboardFixture({
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
        });
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
      if (url === "/backend/v3/api/system/dashboard/admin/overview") {
        return adminDashboardFixture({
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
        });
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
      if (url === "/backend/v3/api/billing/finance/ledger") {
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
      if (url === "/backend/v3/api/billing/finance/ledger") {
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
      if (url === "/backend/v3/api/billing/finance/ledger") {
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
        if (url === "/backend/v3/api/billing/finance/ledger") {
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
        if (url === "/backend/v3/api/billing/finance/ledger") {
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
      if (url === "/backend/v3/api/billing/finance/usage_statements") {
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
      if (url === "/backend/v3/api/billing/finance/usage_statements") {
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
        if (url === "/backend/v3/api/billing/finance/usage_statements") {
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
        if (url === "/backend/v3/api/billing/finance/usage_statements") {
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
      if (url === "/backend/v3/api/system/monitor/nodes") {
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
      if (url === "/backend/v3/api/system/monitor/alerts") {
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
      if (url === "/backend/v3/api/system/monitor/nodes") {
        return { items: ["not-a-node-record"] };
      }
      if (url === "/backend/v3/api/system/monitor/alerts") {
        return { items: ["not-an-alert-record"] };
      }
      if (url === "/backend/v3/api/system/monitor/performance") {
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
      if (url === "/backend/v3/api/system/monitor/nodes") {
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
      if (url === "/backend/v3/api/system/monitor/alerts") {
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
      if (url === "/backend/v3/api/system/monitor/performance") {
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
      if (url === "/backend/v3/api/system/monitor/nodes") {
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
      if (url === "/backend/v3/api/system/monitor/alerts") {
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
      if (isSystemRecordsRequest(url, init)) {
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
      if (isSystemRecordsRequest(url, init)) {
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
        if (isSystemRecordsRequest(url, init)) {
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
      if (isSystemRecordsRequest(url, init)) {
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
        if (isSystemRecordsRequest(url, init)) {
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
