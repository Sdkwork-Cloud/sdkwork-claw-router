import { describe, expect, it } from "vitest";
import {
  buildImMessageTimeline,
  createImConversationDigest,
  createImDesktopNotificationIntent,
  createImContentPartsFromDraft,
  createImWorkspaceManifest,
  evaluateImSendReadiness,
  filterImConversations,
  getImAttachmentDeliveryUrl,
  resolveImComposerCapabilities,
  sortImConversations,
  summarizeImConversationDigests,
  summarizeImUnread,
  type SdkworkImConversation,
  type SdkworkImMessage,
} from "../src";

const conversations: SdkworkImConversation[] = [
  {
    id: "assistant",
    isPinned: true,
    kind: "assistant",
    lastActivityAt: "2026-04-02T09:10:00.000Z",
    mentionCount: 0,
    preview: "Model context refreshed",
    tags: ["ai", "workspace"],
    title: "Sdkwork Copilot",
    unreadCount: 2,
  },
  {
    id: "design",
    kind: "group",
    lastActivityAt: "2026-04-02T09:14:00.000Z",
    mentionCount: 3,
    preview: "Need final review on the shell polish",
    tags: ["design", "review"],
    title: "Design Review",
    unreadCount: 5,
  },
  {
    id: "ops",
    isMuted: true,
    kind: "channel",
    lastActivityAt: "2026-04-02T09:12:00.000Z",
    mentionCount: 0,
    preview: "Nightly deploy completed",
    tags: ["ops"],
    title: "Release Ops",
    unreadCount: 4,
  },
  {
    id: "archive",
    isArchived: true,
    kind: "direct",
    lastActivityAt: "2026-04-01T18:00:00.000Z",
    preview: "Old notes",
    title: "Archived DM",
    unreadCount: 0,
  },
];

const sendAttachment = {
  id: "att-1",
  mediaAssetId: "media-asset-1",
  mediaRole: "attachment",
  resource: {
    bucketId: "im-media",
    fileName: "shell-polish.png",
    id: "media-resource-1",
    kind: "image",
    mimeType: "image/png",
    objectKey: "conversations/design/shell-polish.png",
    publicUrl: "https://cdn.sdkwork.ai/im/shell-polish.png",
    sizeBytes: "2048",
    source: "object_storage",
    url: "https://signed.sdkwork.ai/im/shell-polish.png",
  },
} as const;

const messages: SdkworkImMessage[] = [
  {
    authorId: "u1",
    authorName: "Ada",
    content: "First draft is ready.",
    conversationId: "design",
    createdAt: "2026-04-01T10:00:00.000Z",
    id: "m1",
    kind: "text",
    status: "read",
  },
  {
    authorId: "u1",
    authorName: "Ada",
    content: "Posting one more screenshot.",
    conversationId: "design",
    createdAt: "2026-04-01T10:03:00.000Z",
    id: "m2",
    kind: "image",
    status: "read",
  },
  {
    authorId: "u2",
    authorName: "Lin",
    content: "Looks good, ship it.",
    conversationId: "design",
    createdAt: "2026-04-01T10:15:00.000Z",
    id: "m3",
    kind: "text",
    status: "delivered",
  },
  {
    authorId: "u2",
    authorName: "Lin",
    content: "Following up the next day.",
    conversationId: "design",
    createdAt: "2026-04-02T09:00:00.000Z",
    id: "m4",
    kind: "text",
    status: "sent",
  },
];

describe("sdkwork-im-pc-react", () => {
  it("sorts pinned conversations first and filters conversations by query and capability kind", () => {
    expect(sortImConversations(conversations).map((conversation) => conversation.id)).toEqual([
      "assistant",
      "design",
      "ops",
      "archive",
    ]);

    expect(
      filterImConversations(conversations, {
        kinds: ["assistant", "group"],
        query: "review",
      }).map((conversation) => conversation.id),
    ).toEqual(["design"]);
  });

  it("summarizes unread state across mentions and muted channels", () => {
    expect(summarizeImUnread(conversations)).toEqual({
      hasAttentionDemand: true,
      mentionedMessages: 3,
      mutedMessages: 4,
      unreadConversations: 3,
      unreadMessages: 11,
    });
  });

  it("creates conversation digests and summarizes digest collections", () => {
    expect(
      createImConversationDigest(conversations[0], {
        activeConversationId: "assistant",
      }),
    ).toEqual({
      id: "assistant",
      isActive: true,
      isPinned: true,
      kind: "assistant",
      lastActivityAt: "2026-04-02T09:10:00.000Z",
      mentionCount: 0,
      participantCount: 0,
      preview: "Model context refreshed",
      status: "attention",
      title: "Sdkwork Copilot",
      unreadCount: 2,
    });

    expect(
      summarizeImConversationDigests(conversations.map((conversation) => createImConversationDigest(conversation))),
    ).toEqual({
      archivedConversations: 1,
      attentionConversations: 2,
      mutedConversations: 1,
      pinnedConversations: 1,
      totalConversations: 4,
      totalUnreadMessages: 11,
      unreadConversations: 3,
    });
  });

  it("builds a timeline grouped by day and message continuity", () => {
    const timeline = buildImMessageTimeline(messages);

    expect(timeline).toHaveLength(2);
    expect(timeline[0]).toMatchObject({
      dateKey: "2026-04-01",
      items: [
        { clusterPosition: "start", id: "m1" },
        { clusterPosition: "end", id: "m2" },
        { clusterPosition: "single", id: "m3" },
      ],
    });
    expect(timeline[1]).toMatchObject({
      dateKey: "2026-04-02",
      items: [{ clusterPosition: "single", id: "m4" }],
    });
  });

  it("resolves composer capabilities from connection and conversation state", () => {
    expect(
      resolveImComposerCapabilities(conversations[0], {
        connectionStatus: "online",
      }),
    ).toEqual({
      canAttachFiles: true,
      canRecordAudio: true,
      canSendMessages: true,
      canUseCommands: true,
      reason: undefined,
    });

    expect(
      resolveImComposerCapabilities(
        {
          ...conversations[1],
          isReadOnly: true,
        },
        {
          connectionStatus: "online",
        },
      ),
    ).toEqual({
      canAttachFiles: false,
      canRecordAudio: false,
      canSendMessages: false,
      canUseCommands: false,
      reason: "read-only",
    });
  });

  it("evaluates send readiness from conversation state, draft content, and connection health", () => {
    expect(getImAttachmentDeliveryUrl(sendAttachment)).toBe("https://cdn.sdkwork.ai/im/shell-polish.png");
    expect(
      createImContentPartsFromDraft({
        attachments: [sendAttachment],
        text: "  Ship the shell polish tonight.  ",
      }),
    ).toEqual([
      {
        kind: "text",
        text: "Ship the shell polish tonight.",
      },
      {
        kind: "media",
        mediaAssetId: "media-asset-1",
        resource: sendAttachment.resource,
      },
    ]);

    expect(
      evaluateImSendReadiness(
        conversations[1],
        {
          attachments: [sendAttachment],
          text: "  Ship the shell polish tonight.  ",
        },
        {
          connectionStatus: "online",
        },
      ),
    ).toEqual({
      capabilities: {
        canAttachFiles: true,
        canRecordAudio: true,
        canSendMessages: true,
        canUseCommands: false,
        reason: undefined,
      },
      degraded: false,
      issues: [],
      payload: {
        attachmentCount: 1,
        attachments: [sendAttachment],
        contentParts: [
          {
            kind: "text",
            text: "Ship the shell polish tonight.",
          },
          {
            kind: "media",
            mediaAssetId: "media-asset-1",
            resource: sendAttachment.resource,
          },
        ],
        conversationId: "design",
        hasAttachments: true,
        hasText: true,
        text: "Ship the shell polish tonight.",
      },
      ready: true,
    });

    expect(
      evaluateImSendReadiness(
        conversations[3],
        {
          text: "Archived follow-up",
        },
        {
          connectionStatus: "online",
        },
      ),
    ).toEqual({
      capabilities: {
        canAttachFiles: false,
        canRecordAudio: false,
        canSendMessages: false,
        canUseCommands: false,
        reason: "archived",
      },
      degraded: false,
      issues: ["archived"],
      ready: false,
    });

    expect(
      evaluateImSendReadiness(
        conversations[0],
        {
          text: "  ",
        },
        {
          connectionStatus: "reconnecting",
        },
      ),
    ).toEqual({
      capabilities: {
        canAttachFiles: true,
        canRecordAudio: true,
        canSendMessages: true,
        canUseCommands: true,
        reason: undefined,
      },
      degraded: true,
      issues: ["degraded-connection", "empty-draft"],
      payload: {
        attachmentCount: 0,
        attachments: [],
        contentParts: [],
        conversationId: "assistant",
        hasAttachments: false,
        hasText: false,
        text: "",
      },
      ready: false,
    });
  });

  it("creates a sdkwork-aligned workspace manifest and desktop notification intent", () => {
    const manifest = createImWorkspaceManifest({
      badgeBehavior: "mentions-first",
      packageNames: ["@sdkwork/im-pc-react", "@sdkwork/notification-pc-react"],
      title: "Messages",
    });

    expect(manifest).toMatchObject({
      badgeBehavior: "mentions-first",
      capability: "im",
      detailRoutePattern: "/messages/conversations/:conversationId",
      routePath: "/messages",
      title: "Messages",
    });
    expect(manifest.packageNames).toEqual([
      "@sdkwork/im-pc-react",
      "@sdkwork/notification-pc-react",
    ]);

    expect(
      createImDesktopNotificationIntent({
        body: "Need your final sign-off on the desktop shell.",
        conversationId: "design",
        conversationTitle: "Design Review",
        messageId: "m3",
      }),
    ).toEqual({
      body: "Need your final sign-off on the desktop shell.",
      conversationId: "design",
      focusWindow: true,
      messageId: "m3",
      route: "/messages/conversations/design?message=m3",
      source: "desktop-notification",
      title: "Design Review",
      type: "im-notification-intent",
    });
  });
});
