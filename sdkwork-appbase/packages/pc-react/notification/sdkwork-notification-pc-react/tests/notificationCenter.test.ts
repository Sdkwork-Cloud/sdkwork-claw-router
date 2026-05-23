import { describe, expect, it } from "vitest";
import {
  applyNotificationCenterAction,
  createNotificationDigest,
  createNotificationCenterState,
  createNotificationRouteIntent,
  createNotificationWorkspaceManifest,
  evaluateNotificationDeliveryReadiness,
  groupNotificationsByDay,
  summarizeNotificationDigests,
} from "../src";

describe("sdkwork-notification-pc-react", () => {
  it("builds notification center state with unread counts and kind totals", () => {
    const state = createNotificationCenterState([
      {
        createdAt: "2026-04-02T10:30:00.000Z",
        id: "a",
        kind: "task",
        status: "unread",
        title: "Task completed",
      },
      {
        createdAt: "2026-04-02T10:35:00.000Z",
        id: "b",
        kind: "security",
        status: "read",
        title: "New sign-in detected",
      },
      {
        createdAt: "2026-04-02T10:40:00.000Z",
        id: "c",
        kind: "task",
        status: "unread",
        title: "Task failed",
      },
    ]);

    expect(state.unreadCount).toBe(2);
    expect(state.kindCounts.task).toBe(2);
    expect(state.items.map((item) => item.id)).toEqual([
      "c",
      "b",
      "a",
    ]);
  });

  it("reduces notification center actions and groups items by day", () => {
    const initialState = createNotificationCenterState([
      {
        createdAt: "2026-04-02T10:30:00.000Z",
        id: "a",
        kind: "task",
        status: "unread",
        title: "Task completed",
      },
      {
        createdAt: "2026-04-01T10:30:00.000Z",
        id: "b",
        kind: "message",
        status: "unread",
        title: "New reply",
      },
    ]);

    const nextState = applyNotificationCenterAction(initialState, {
      ids: [
        "a",
      ],
      type: "mark-read",
    });
    const archivedState = applyNotificationCenterAction(nextState, {
      ids: [
        "b",
      ],
      type: "archive",
    });

    expect(nextState.unreadCount).toBe(1);
    expect(archivedState.items.map((item) => item.id)).toEqual(["a"]);
    expect(groupNotificationsByDay(initialState.items).map((group) => group.day)).toEqual([
      "2026-04-02",
      "2026-04-01",
    ]);
  });

  it("creates notification digests and summarizes routed desktop-aware notification collections", () => {
    const notifications = [
      {
        channels: ["desktop", "in-app"],
        createdAt: "2026-04-02T11:00:00.000Z",
        id: "security-1",
        kind: "security",
        route: "/security/sessions/current",
        status: "unread",
        title: "New sign-in detected",
      },
      {
        createdAt: "2026-04-02T11:05:00.000Z",
        id: "message-1",
        kind: "message",
        status: "unread",
        title: "Ada replied in Design Review",
      },
      {
        channels: [],
        createdAt: "2026-04-02T11:10:00.000Z",
        id: "info-1",
        kind: "info",
        status: "unread",
        title: "Background sync completed",
      },
      {
        channels: ["in-app"],
        createdAt: "2026-04-02T11:15:00.000Z",
        id: "task-1",
        kind: "task",
        route: "/tasks/t-1",
        status: "read",
        title: "Workflow published",
      },
      {
        channels: ["desktop"],
        createdAt: "2026-04-02T11:20:00.000Z",
        id: "warning-1",
        kind: "warning",
        route: "/warnings/w-1",
        status: "archived",
        title: "Storage almost full",
      },
    ] as const;

    expect(createNotificationDigest(notifications[0])).toEqual({
      channelCount: 2,
      createdAt: "2026-04-02T11:00:00.000Z",
      hasRoute: true,
      id: "security-1",
      isUnread: true,
      kind: "security",
      primaryChannel: "desktop",
      status: "actionable",
      title: "New sign-in detected",
    });

    expect(createNotificationDigest(notifications[2])).toEqual({
      channelCount: 0,
      createdAt: "2026-04-02T11:10:00.000Z",
      hasRoute: false,
      id: "info-1",
      isUnread: true,
      kind: "info",
      status: "silent",
      title: "Background sync completed",
    });

    expect(
      summarizeNotificationDigests(notifications.map((notification) => createNotificationDigest(notification))),
    ).toEqual({
      actionableNotifications: 1,
      archivedNotifications: 1,
      desktopNotifications: 2,
      routedNotifications: 3,
      securityNotifications: 1,
      totalNotifications: 5,
      unreadNotifications: 3,
    });
  });

  it("evaluates delivery readiness from channel availability, preferred routing, and notification state", () => {
    expect(
      evaluateNotificationDeliveryReadiness(
        {
          channels: ["desktop", "in-app"],
          createdAt: "2026-04-02T11:00:00.000Z",
          id: "security-1",
          kind: "security",
          route: "/security/sessions/current",
          status: "unread",
          title: "New sign-in detected",
        },
        {
          enabledChannels: {
            desktop: true,
            "in-app": true,
          },
          preferredChannel: "desktop",
          requireRoute: true,
        },
      ),
    ).toEqual({
      degraded: false,
      delivery: {
        allowedChannels: ["desktop", "in-app"],
        blockedChannels: [],
        primaryChannel: "desktop",
      },
      issues: [],
      ready: true,
    });

    expect(
      evaluateNotificationDeliveryReadiness(
        {
          channels: ["desktop", "in-app"],
          createdAt: "2026-04-02T11:03:00.000Z",
          id: "message-1",
          kind: "message",
          route: "/messages/conversations/design",
          status: "unread",
          title: "Ada replied in Design Review",
        },
        {
          enabledChannels: {
            desktop: false,
            "in-app": true,
          },
          preferredChannel: "desktop",
          requireRoute: true,
        },
      ),
    ).toEqual({
      degraded: true,
      delivery: {
        allowedChannels: ["in-app"],
        blockedChannels: ["desktop"],
        primaryChannel: "in-app",
      },
      issues: ["preferred-channel-disabled"],
      ready: true,
    });

    expect(
      evaluateNotificationDeliveryReadiness(
        {
          channels: ["desktop"],
          createdAt: "2026-04-02T11:20:00.000Z",
          id: "warning-1",
          kind: "warning",
          route: "/warnings/w-1",
          status: "archived",
          title: "Storage almost full",
        },
        {
          enabledChannels: {
            desktop: true,
          },
          preferredChannel: "desktop",
          requireRoute: true,
        },
      ),
    ).toEqual({
      degraded: false,
      delivery: {
        allowedChannels: ["desktop"],
        blockedChannels: [],
        primaryChannel: "desktop",
      },
      issues: ["archived"],
      ready: false,
    });
  });

  it("creates a notification workspace manifest and route intents for desktop shells", () => {
    const manifest = createNotificationWorkspaceManifest({
      packageNames: ["@sdkwork/notification-pc-react", "@sdkwork/desktop-pc-react"],
      title: "Notifications",
    });

    expect(manifest).toMatchObject({
      capability: "notification",
      detailRoutePattern: "/notifications/:notificationId",
      routePath: "/notifications",
      settingsRoutePath: "/settings/notifications",
      title: "Notifications",
    });
    expect(manifest.packageNames).toEqual([
      "@sdkwork/notification-pc-react",
      "@sdkwork/desktop-pc-react",
    ]);

    expect(
      createNotificationRouteIntent(
        {
          createdAt: "2026-04-02T11:00:00.000Z",
          id: "message-1",
          kind: "message",
          route: "/messages/conversations/design",
          status: "unread",
          title: "Ada replied in Design Review",
        },
        {
          focusWindow: true,
        },
      ),
    ).toEqual({
      focusWindow: true,
      notificationId: "message-1",
      route: "/messages/conversations/design",
      source: "notification-center",
      type: "notification-route-intent",
    });
  });
});
