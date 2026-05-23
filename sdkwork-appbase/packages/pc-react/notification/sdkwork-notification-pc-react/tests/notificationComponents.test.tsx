import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  SdkworkNotificationBell,
  type SdkworkNotificationGeneratedClient,
} from "../src";

describe("sdkwork notification React surfaces", () => {
  it("renders a header dropdown and a large flat popup using server-side popup-seen state", async () => {
    const client = createNotificationClient([
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
    ]);
    const { container } = render(
      <SdkworkNotificationBell
        appId="sdkwork-router"
        authenticated
        centerPath="/console/notifications"
        client={client}
      />,
    );

    expect(await screen.findByRole("dialog", { name: "Notification details" })).toBeInTheDocument();
    const modal = container.querySelector('[data-sdk-pattern="notification-detail-modal"]');
    expect(modal).toHaveAttribute("data-size", "large");
    expect(modal?.className).not.toMatch(/\bborder\b/);

    fireEvent.click(screen.getByRole("button", { name: "Acknowledge notification" }));

    await waitFor(() => {
      expect(client.notification.acknowledge.create).toHaveBeenCalledWith("notif-1", {
        appId: "sdkwork-router",
      });
    });
    expect(client.notification.popupSeen.create).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Notifications" }));

    expect(await screen.findByRole("menu", { name: "Notification center" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /Quota warning/ })).toBeInTheDocument();
  });

  it("does not reopen popup notifications that the server says were already seen", async () => {
    const client = createNotificationClient([
      {
        actionUrl: "/console/billing",
        appId: "sdkwork-router",
        archived: false,
        content: "Daily quota reached 90%.",
        desc: "Quota warning",
        id: "notif-1",
        popupSeen: true,
        read: false,
        showAsPopup: true,
        time: "2026-05-18T08:00:00.000Z",
        title: "Quota warning",
        type: "warning",
      },
    ]);
    render(
      <SdkworkNotificationBell
        appId="sdkwork-router"
        authenticated
        client={client}
      />,
    );

    await waitFor(() => {
      expect(client.notification.listNotifications).toHaveBeenCalled();
    });

    expect(screen.queryByRole("dialog", { name: "Notification details" })).not.toBeInTheDocument();
    expect(client.notification.popupSeen.create).not.toHaveBeenCalled();
  });

  it("does not open popup notifications that the server already marked read", async () => {
    const client = createNotificationClient([
      {
        actionUrl: "/console/billing",
        appId: "sdkwork-router",
        archived: false,
        content: "Daily quota reached 90%.",
        desc: "Quota warning",
        id: "notif-1",
        popupSeen: false,
        read: true,
        showAsPopup: true,
        time: "2026-05-18T08:00:00.000Z",
        title: "Quota warning",
        type: "warning",
      },
    ]);
    render(
      <SdkworkNotificationBell
        appId="sdkwork-router"
        authenticated
        client={client}
      />,
    );

    await waitFor(() => {
      expect(client.notification.listNotifications).toHaveBeenCalled();
    });

    expect(screen.queryByRole("dialog", { name: "Notification details" })).not.toBeInTheDocument();
    expect(client.notification.popupSeen.create).not.toHaveBeenCalled();
  });

  it("acknowledges notifications through the injected SDK when a user opens a detail", async () => {
    const client = createNotificationClient([
      {
        actionUrl: "/console/billing",
        appId: "sdkwork-router",
        archived: false,
        content: "Daily quota reached 90%.",
        desc: "Quota warning",
        id: "notif-1",
        popupSeen: true,
        read: false,
        showAsPopup: false,
        time: "2026-05-18T08:00:00.000Z",
        title: "Quota warning",
        type: "warning",
      },
    ]);
    render(
      <SdkworkNotificationBell
        appId="sdkwork-router"
        authenticated
        client={client}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Notifications" }));
    fireEvent.click(await screen.findByRole("menuitem", { name: /Quota warning/ }));

    await waitFor(() => {
      expect(client.notification.acknowledge.create).toHaveBeenCalledWith("notif-1", {
        appId: "sdkwork-router",
      });
    });
    expect(screen.getByRole("dialog", { name: "Notification details" })).toBeInTheDocument();
  });
});

function createNotificationClient(items: unknown[]): SdkworkNotificationGeneratedClient {
  return {
    notification: {
      listNotifications: vi.fn().mockResolvedValue({
        code: "2000",
        data: {
          items,
        },
      }),
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
