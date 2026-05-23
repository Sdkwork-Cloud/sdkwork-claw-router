import { describe, expect, it, vi } from "vitest";
import {
  createSdkworkNotificationService,
  notificationPackageMeta,
} from "../src";

describe("sdkwork notification generated SDK service", () => {
  it("lists notifications through an injected generated app SDK client and normalizes server state", async () => {
    const client = createNotificationClient({
      listResult: {
        code: "2000",
        data: {
          items: [
            {
              actionUrl: "/console/billing",
              appId: "sdkwork-router",
              archived: false,
              content: "Daily quota reached 90%.",
              desc: "Quota warning",
              id: "notif-1",
              popupSeen: false,
              read: false,
              showAsPopup: true,
              time: "2026-05-18T08:00:00.000Z",
              title: "Quota warning",
              type: "warning",
            },
          ],
        },
      },
    });
    const service = createSdkworkNotificationService({
      appId: "sdkwork-router",
      client,
      pageSize: 25,
    });

    const result = await service.list();

    expect(client.notification.listNotifications).toHaveBeenCalledWith({
      appId: "sdkwork-router",
      includeArchived: false,
      page: 1,
      pageSize: 25,
    });
    expect(result).toEqual([
      {
        actionUrl: "/console/billing",
        appId: "sdkwork-router",
        archived: false,
        content: "Daily quota reached 90%.",
        createdAt: "2026-05-18T08:00:00.000Z",
        desc: "Quota warning",
        id: "notif-1",
        kind: "warning",
        popupSeen: false,
        read: false,
        route: "/console/billing",
        showAsPopup: true,
        status: "unread",
        time: "2026-05-18T08:00:00.000Z",
        title: "Quota warning",
        type: "warning",
      },
    ]);
  });

  it("accepts notification list responses that expose items at the top level", async () => {
    const client = createNotificationClient({
      listResult: {
        code: "2000",
        items: [
          {
            actionUrl: "/console/billing",
            appId: "sdkwork-router",
            archived: false,
            content: "Daily quota reached 90%.",
            desc: "Quota warning",
            id: "notif-1",
            popupSeen: false,
            read: false,
            showAsPopup: true,
            time: "2026-05-18T08:00:00.000Z",
            title: "Quota warning",
            type: "warning",
          },
        ],
      },
    });
    const service = createSdkworkNotificationService({
      appId: "sdkwork-router",
      client,
    });

    const result = await service.list();

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("notif-1");
  });

  it("acknowledges notifications through one generated SDK resource method", async () => {
    const client = createNotificationClient();
    const service = createSdkworkNotificationService({
      appId: "sdkwork-router",
      client,
    });

    await service.acknowledge("notif-1");

    expect(client.notification.acknowledge.create).toHaveBeenCalledWith("notif-1", {
      appId: "sdkwork-router",
    });
    expect(client.notification.popupSeen.create).not.toHaveBeenCalled();
  });

  it("persists popup presentation without marking read when a popup is dismissed", async () => {
    const client = createNotificationClient();
    const service = createSdkworkNotificationService({
      appId: "sdkwork-router",
      client,
    });

    await service.markPopupSeen("notif-1");

    expect(client.notification.popupSeen.create).toHaveBeenCalledWith("notif-1", {
      appId: "sdkwork-router",
    });
    expect(client.notification.acknowledge.create).not.toHaveBeenCalled();
  });

  it("fails closed when generated SDK responses omit required notification fields", async () => {
    const client = createNotificationClient({
      listResult: {
        code: "2000",
        data: {
          items: [
            {
              appId: "sdkwork-router",
              archived: false,
              content: "Broken row",
              desc: "Missing title",
              id: "broken",
              popupSeen: false,
              read: false,
              showAsPopup: false,
              time: "2026-05-18T08:00:00.000Z",
              type: "info",
            },
          ],
        },
      },
    });
    const service = createSdkworkNotificationService({
      appId: "sdkwork-router",
      client,
    });

    await expect(service.list()).rejects.toThrow("Notification title is required");
  });

  it("declares notification as its own first-class appbase domain", () => {
    expect(notificationPackageMeta).toEqual({
      architecture: "pc-react",
      domain: "notification",
      package: "@sdkwork/notification-pc-react",
      status: "ready",
    });
  });
});

function createNotificationClient(options: { listResult?: unknown } = {}) {
  return {
    notification: {
      listNotifications: vi.fn().mockResolvedValue(
        options.listResult ?? {
          code: "2000",
          data: {
            items: [],
          },
        },
      ),
      acknowledge: {
        create: vi.fn().mockResolvedValue({
          code: "2000",
          data: {
            state: "acknowledged",
            updated: true,
          },
        }),
      },
      popupSeen: {
        create: vi.fn().mockResolvedValue({
          code: "2000",
          data: {
            state: "popup_seen",
            updated: true,
          },
        }),
      },
    },
  };
}
