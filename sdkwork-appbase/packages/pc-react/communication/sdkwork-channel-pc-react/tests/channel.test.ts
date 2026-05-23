import { describe, expect, it } from "vitest";
import {
  createChannelConnectorDigest,
  createChannelRouteIntent,
  createChannelWorkspaceManifest,
  evaluateChannelSetupReadiness,
  filterChannelConnectors,
  getChannelMeta,
  partitionChannelConnectorsByRegion,
  resolveChannelQuickActions,
  sortChannelConnectors,
  summarizeChannelConnectorDigests,
  summarizeChannelConnectors,
  type SdkworkChannelConnector,
} from "../src";

const connectors: SdkworkChannelConnector[] = [
  {
    displayName: "Slack Support",
    id: "slack-support",
    kind: "slack",
    lastActivityAt: "2026-04-02T10:10:00.000Z",
    mentionCount: 2,
    status: "connected",
    unreadCount: 6,
  },
  {
    displayName: "Discord Community",
    id: "discord-community",
    kind: "discord",
    lastActivityAt: "2026-04-02T10:00:00.000Z",
    status: "degraded",
    unreadCount: 3,
  },
  {
    displayName: "Feishu Sales",
    id: "feishu-sales",
    kind: "feishu",
    status: "setup-required",
  },
  {
    displayName: "WhatsApp Ops",
    id: "whatsapp-ops",
    kind: "whatsapp",
    lastActivityAt: "2026-04-02T09:55:00.000Z",
    status: "connected",
    unreadCount: 2,
  },
  {
    displayName: "Webhook Alerts",
    enabled: false,
    id: "webhook-alerts",
    kind: "webhook",
    status: "disabled",
  },
];

describe("sdkwork-channel-pc-react", () => {
  it("sorts connectors by status and attention, then filters by query and region", () => {
    expect(sortChannelConnectors(connectors).map((connector) => connector.id)).toEqual([
      "slack-support",
      "whatsapp-ops",
      "discord-community",
      "feishu-sales",
      "webhook-alerts",
    ]);

    expect(
      filterChannelConnectors(connectors, {
        query: "sales",
        regions: ["domestic"],
        statuses: ["setup-required", "connected"],
      }).map((connector) => connector.id),
    ).toEqual(["feishu-sales"]);
  });

  it("partitions connectors by region and summarizes health and unread attention", () => {
    expect(partitionChannelConnectorsByRegion(connectors)).toEqual({
      domestic: [connectors[2]],
      global: [connectors[0], connectors[1], connectors[3], connectors[4]],
    });

    expect(summarizeChannelConnectors(connectors)).toEqual({
      attentionChannels: 1,
      connectedChannels: 2,
      degradedChannels: 1,
      setupRequiredChannels: 1,
      unreadMessages: 11,
    });
  });

  it("resolves quick actions from connector status and setup state", () => {
    expect(resolveChannelQuickActions(connectors[0])).toEqual({
      canDisable: true,
      canOpenInbox: true,
      canOpenSetup: false,
      canRetryConnection: false,
      reason: undefined,
    });

    expect(resolveChannelQuickActions(connectors[2])).toEqual({
      canDisable: false,
      canOpenInbox: false,
      canOpenSetup: true,
      canRetryConnection: false,
      reason: "setup-required",
    });

    expect(resolveChannelQuickActions(connectors[4])).toEqual({
      canDisable: false,
      canOpenInbox: false,
      canOpenSetup: true,
      canRetryConnection: false,
      reason: "channel-disabled",
    });
  });

  it("creates connector digests and summarizes channel catalog collections", () => {
    const slackDigest = createChannelConnectorDigest(connectors[0], {
      activeChannelId: "slack-support",
      configuredFieldCount: 3,
      requiredFieldCount: 3,
    });

    expect(slackDigest).toEqual({
      configuredFieldCount: 3,
      displayName: "Slack Support",
      hasOfficialDocs: true,
      id: "slack-support",
      isActive: true,
      kind: "slack",
      lastActivityAt: "2026-04-02T10:10:00.000Z",
      mentionCount: 2,
      region: "global",
      requiredFieldCount: 3,
      setupCompletionRatio: 1,
      status: "attention",
      unreadCount: 6,
    });

    const digests = [
      slackDigest,
      createChannelConnectorDigest(connectors[1], {
        configuredFieldCount: 2,
        requiredFieldCount: 2,
      }),
      createChannelConnectorDigest(connectors[2], {
        configuredFieldCount: 1,
        requiredFieldCount: 3,
      }),
      createChannelConnectorDigest(connectors[3], {
        configuredFieldCount: 0,
        requiredFieldCount: 0,
      }),
      createChannelConnectorDigest(connectors[4], {
        configuredFieldCount: 0,
        requiredFieldCount: 0,
      }),
    ];

    expect(summarizeChannelConnectorDigests(digests)).toEqual({
      attentionChannels: 1,
      connectedChannels: 1,
      disabledChannels: 1,
      domesticChannels: 1,
      globalChannels: 4,
      issueChannels: 1,
      setupChannels: 1,
      totalChannels: 5,
      totalUnreadMessages: 11,
      channelsWithOfficialDocs: 3,
    });
  });

  it("evaluates channel setup readiness from connector health, setup progress, and granted scopes", () => {
    expect(
      evaluateChannelSetupReadiness(connectors[0], {
        configuredFieldCount: 3,
        grantedScopes: ["channels:read", "chat:write"],
        requiredFieldCount: 3,
        requiredScopes: ["channels:read"],
        supportsStatusProbe: true,
      }),
    ).toEqual({
      degraded: false,
      issues: [],
      progress: {
        configuredFieldCount: 3,
        grantedScopeCount: 1,
        requiredFieldCount: 3,
        requiredScopeCount: 1,
        setupCompletionRatio: 1,
      },
      quickActions: {
        canDisable: true,
        canOpenInbox: true,
        canOpenSetup: false,
        canRetryConnection: false,
        reason: undefined,
      },
      ready: true,
    });

    expect(
      evaluateChannelSetupReadiness(connectors[1], {
        configuredFieldCount: 2,
        grantedScopes: ["guilds.read", "messages.read"],
        requiredFieldCount: 2,
        requiredScopes: ["guilds.read"],
        supportsStatusProbe: true,
      }),
    ).toEqual({
      degraded: true,
      issues: ["degraded-connection"],
      progress: {
        configuredFieldCount: 2,
        grantedScopeCount: 1,
        requiredFieldCount: 2,
        requiredScopeCount: 1,
        setupCompletionRatio: 1,
      },
      quickActions: {
        canDisable: true,
        canOpenInbox: false,
        canOpenSetup: true,
        canRetryConnection: true,
        reason: undefined,
      },
      ready: true,
    });

    expect(
      evaluateChannelSetupReadiness(connectors[2], {
        configuredFieldCount: 1,
        grantedScopes: [],
        requiredFieldCount: 3,
        requiredScopes: ["im:message", "contacts:read"],
        supportsStatusProbe: true,
      }),
    ).toEqual({
      degraded: false,
      issues: ["setup-required", "missing-fields", "missing-scopes"],
      progress: {
        configuredFieldCount: 1,
        grantedScopeCount: 0,
        requiredFieldCount: 3,
        requiredScopeCount: 2,
        setupCompletionRatio: 0.33,
      },
      quickActions: {
        canDisable: false,
        canOpenInbox: false,
        canOpenSetup: true,
        canRetryConnection: false,
        reason: "setup-required",
      },
      ready: false,
    });
  });

  it("returns stable channel metadata for brand, region, and official links", () => {
    expect(getChannelMeta("slack")).toEqual({
      kind: "slack",
      label: "Slack",
      monogram: "SL",
      officialUrl: "https://api.slack.com/apps",
      region: "global",
    });

    expect(getChannelMeta("wecom")).toEqual({
      kind: "wecom",
      label: "WeCom",
      monogram: "WC",
      officialUrl:
        "https://work.weixin.qq.com/wework_admin/loginpage_wx?redirect_uri=https%3A%2F%2Fwork.weixin.qq.com%2Fwework_admin%2Fframe",
      region: "domestic",
    });
  });

  it("creates a channel workspace manifest and route intent for desktop shells", () => {
    expect(
      createChannelWorkspaceManifest({
        packageNames: ["@sdkwork/channel-pc-react", "@sdkwork/notification-pc-react"],
        title: "Channels",
      }),
    ).toEqual({
      architecture: "pc-react",
      capability: "channel",
      description: "Channel workspace for connector catalogs, inbox routing, and setup entry points.",
      detailRoutePattern: "/channels/:channelId",
      host: "tauri",
      id: "sdkwork-channel",
      packageNames: ["@sdkwork/channel-pc-react", "@sdkwork/notification-pc-react"],
      routePath: "/channels",
      setupRoutePattern: "/channels/:channelId/setup",
      theme: {
        color: "lobster",
        preset: "sdkwork",
        selection: "system",
      },
      title: "Channels",
    });

    expect(
      createChannelRouteIntent("slack-support", {
        accountId: "support",
      }),
    ).toEqual({
      accountId: "support",
      channelId: "slack-support",
      focusWindow: true,
      route: "/channels/slack-support?account=support",
      source: "channel-catalog",
      type: "channel-route-intent",
    });
  });
});
