import { describe, expect, it } from "vitest";
import {
  buildSupportOverview,
  createSupportChannelDigest,
  createSupportEscalationRouteIntent,
  createSupportRouteIntent,
  createSupportWorkspaceManifest,
  evaluateSupportEscalationReadiness,
  filterSupportFaqs,
  recommendSupportChannels,
  summarizeSupportChannelDigests,
  summarizeSupportSystemStatus,
} from "../src";

const categories = [
  {
    description: "Setup and first connection workflows.",
    id: "connect",
    priority: 1,
    title: "Connect",
  },
  {
    description: "Runtime incidents and deployment health.",
    id: "runtime",
    priority: 2,
    title: "Runtime",
  },
  {
    description: "Billing and invoices.",
    id: "billing",
    priority: 3,
    title: "Billing",
  },
] as const;

const faqs = [
  {
    answer: "Use the shared cloud connect flow and install the default skill bundle.",
    categoryId: "connect",
    id: "connect-cloud",
    priority: 1,
    question: "How do I connect the workspace to cloud services?",
    tags: ["connect", "skill"],
  },
  {
    answer: "Check queue latency, rate limits, and timeout budgets first.",
    categoryId: "runtime",
    id: "slow-response",
    priority: 2,
    question: "Why is response time unstable?",
    tags: ["latency", "timeout"],
  },
  {
    answer: "Invoices can be requested from the billing center after payment settles.",
    categoryId: "billing",
    id: "invoice-request",
    priority: 3,
    question: "How do I request an invoice?",
    tags: ["invoice"],
  },
] as const;

const systemSignals = [
  {
    detail: "Operational",
    id: "api-gateway",
    priority: 1,
    status: "operational",
    title: "API Gateway",
  },
  {
    detail: "Partial delays",
    id: "task-queue",
    priority: 2,
    status: "degraded",
    title: "Task Queue",
  },
  {
    detail: "Scheduled window",
    id: "docs-sync",
    priority: 3,
    status: "maintenance",
    title: "Docs Sync",
  },
] as const;

const channels = [
  {
    categoryIds: ["connect", "runtime", "billing"],
    id: "ticket",
    kind: "ticket",
    maxSeverity: "critical",
    priority: 1,
    recommended: true,
    route: "/support/ticket",
    supportsHuman: true,
    title: "Submit Ticket",
  },
  {
    categoryIds: ["connect", "runtime"],
    id: "community",
    kind: "community",
    maxSeverity: "high",
    priority: 2,
    route: "/support/community",
    supportsHuman: false,
    title: "Community Support",
  },
  {
    categoryIds: ["billing", "trust"],
    id: "sales",
    kind: "business",
    maxSeverity: "high",
    priority: 3,
    route: "/support/business",
    supportsHuman: true,
    title: "Contact Sales",
  },
  {
    categoryIds: ["connect", "runtime", "billing", "trust"],
    id: "email",
    kind: "email",
    maxSeverity: "normal",
    priority: 4,
    route: "/support/email",
    supportsHuman: true,
    title: "Email Support",
  },
] as const;

const quickLinks = [
  {
    categoryIds: ["connect", "runtime"],
    description: "Open the shared documentation center.",
    id: "docs-center",
    priority: 1,
    route: "/docs",
    title: "Docs Center",
  },
  {
    categoryIds: ["runtime"],
    description: "Check live service health.",
    id: "status-page",
    priority: 2,
    route: "/status",
    title: "Status Page",
  },
  {
    categoryIds: ["billing"],
    description: "Open billing and invoices.",
    id: "billing-center",
    priority: 3,
    route: "/pricing",
    title: "Billing Center",
  },
] as const;

describe("sdkwork-support-pc-react", () => {
  it("filters support FAQs by question, answer, and tags while keeping stable order", () => {
    expect(filterSupportFaqs(faqs, "")).toEqual(faqs);

    expect(filterSupportFaqs(faqs, "latency").map((item) => item.id)).toEqual([
      "slow-response",
    ]);

    expect(filterSupportFaqs(faqs, "invoice").map((item) => item.id)).toEqual([
      "invoice-request",
    ]);
  });

  it("summarizes support system status with counts, attention ids, and highest status", () => {
    expect(summarizeSupportSystemStatus(systemSignals)).toEqual({
      attentionIds: ["task-queue"],
      highestStatus: "degraded",
      operationalIds: ["api-gateway"],
      statusCounts: {
        degraded: 1,
        maintenance: 1,
        operational: 1,
        outage: 0,
      },
    });
  });

  it("recommends escalation channels by severity, category fit, and human support preference", () => {
    expect(
      recommendSupportChannels(channels, {
        categoryId: "runtime",
        prefersHuman: true,
        severity: "high",
      }),
    ).toEqual(["ticket", "community", "sales"]);
  });

  it("builds a support overview with category summaries, featured faqs, recommended channels, and status", () => {
    expect(
      buildSupportOverview({
        categories,
        channels,
        faqs,
        quickLinks,
        systemSignals,
      }),
    ).toEqual({
      categorySummaries: [
        {
          channelIds: ["ticket", "email", "community"],
          faqIds: ["connect-cloud"],
          id: "connect",
          priority: 1,
          quickLinkIds: ["docs-center"],
          title: "Connect",
        },
        {
          channelIds: ["ticket", "email", "community"],
          faqIds: ["slow-response"],
          id: "runtime",
          priority: 2,
          quickLinkIds: ["docs-center", "status-page"],
          title: "Runtime",
        },
        {
          channelIds: ["ticket", "email", "sales"],
          faqIds: ["invoice-request"],
          id: "billing",
          priority: 3,
          quickLinkIds: ["billing-center"],
          title: "Billing",
        },
      ],
      featuredFaqIds: ["connect-cloud", "slow-response", "invoice-request"],
      quickLinkIds: ["docs-center", "status-page", "billing-center"],
      recommendedChannelIds: ["ticket", "sales", "community"],
      status: "monitoring",
      systemAttentionIds: ["task-queue"],
    });
  });

  it("creates support channel digests and summarizes channel availability for launch surfaces", () => {
    expect(
      createSupportChannelDigest(channels[0], {
        activeChannelId: "ticket",
        categoryId: "runtime",
        severity: "high",
      }),
    ).toEqual({
      categoryMatch: true,
      digestStatus: "recommended",
      id: "ticket",
      isActive: true,
      isRecommended: true,
      kind: "ticket",
      maxSeverity: "critical",
      route: "/support/ticket",
      supportsHuman: true,
      supportsRequestedSeverity: true,
      title: "Submit Ticket",
    });

    expect(
      summarizeSupportChannelDigests(
        channels.map((channel) =>
          createSupportChannelDigest(channel, {
            categoryId: "runtime",
            severity: "high",
          }),
        ),
      ),
    ).toEqual({
      humanChannels: 3,
      readyChannels: 3,
      recommendedChannels: 1,
      restrictedChannels: 1,
      standbyChannels: 1,
      ticketChannels: 1,
      totalChannels: 4,
    });
  });

  it("evaluates escalation readiness for healthy, degraded, and blocked channel routing", () => {
    expect(
      evaluateSupportEscalationReadiness(channels[0], {
        categoryId: "runtime",
        requiresHuman: true,
        severity: "high",
      }),
    ).toEqual({
      capabilities: {
        acceptsSeverity: true,
        canEscalate: true,
        categoryMatch: true,
        supportsHuman: true,
      },
      degraded: false,
      issues: [],
      ready: true,
    });

    expect(
      evaluateSupportEscalationReadiness(channels[2], {
        categoryId: "runtime",
        requiresHuman: true,
        severity: "high",
        systemSignals,
      }),
    ).toEqual({
      capabilities: {
        acceptsSeverity: true,
        canEscalate: true,
        categoryMatch: false,
        supportsHuman: true,
      },
      degraded: true,
      issues: ["category-mismatch", "incident-active"],
      ready: true,
    });

    expect(
      evaluateSupportEscalationReadiness(channels[1], {
        categoryId: "runtime",
        requiresHuman: true,
        severity: "critical",
      }),
    ).toEqual({
      capabilities: {
        acceptsSeverity: false,
        canEscalate: false,
        categoryMatch: true,
        supportsHuman: false,
      },
      degraded: false,
      issues: ["severity-unsupported", "human-support-required"],
      ready: false,
    });
  });

  it("builds support workspace manifests and route intents", () => {
    expect(
      createSupportWorkspaceManifest({
        packageNames: [
          "@sdkwork/support-pc-react",
          "@sdkwork/docs-pc-react",
          "@sdkwork/support-pc-react",
        ],
        title: "Support",
      }),
    ).toEqual({
      architecture: "pc-react",
      capability: "support",
      channelRoutePattern: "/support/channels/:channelId",
      description: "Support workspace for FAQ discovery, escalation routing, and operational help surfaces.",
      host: "tauri",
      id: "sdkwork-support",
      packageNames: [
        "@sdkwork/support-pc-react",
        "@sdkwork/docs-pc-react",
      ],
      routePath: "/support",
      theme: {
        color: "lobster",
        preset: "sdkwork",
        selection: "system",
      },
      title: "Support",
    });

    expect(
      createSupportRouteIntent({
        categoryId: "runtime",
        query: "latency",
      }),
    ).toEqual({
      categoryId: "runtime",
      focusWindow: true,
      query: "latency",
      route: "/support?category=runtime&query=latency",
      source: "support-workspace",
      type: "support-route-intent",
    });

    expect(
      createSupportEscalationRouteIntent("ticket", {
        categoryId: "runtime",
        severity: "high",
      }),
    ).toEqual({
      categoryId: "runtime",
      channelId: "ticket",
      focusWindow: true,
      route: "/support/channels/ticket?category=runtime&severity=high",
      severity: "high",
      source: "support-workspace",
      type: "support-escalation-route-intent",
    });
  });
});
