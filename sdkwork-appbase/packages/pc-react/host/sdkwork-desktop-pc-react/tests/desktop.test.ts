import { createTauriHostBridge } from "@sdkwork/host-tauri-pc-react";
import { describe, expect, it, vi } from "vitest";
import {
  createDesktopManifest,
  createDesktopWindowController,
  createDesktopWindowControllerFromBridge,
  createTrayRouteIntent,
  evaluateDesktopShellReadiness,
  isTrayRouteIntent,
} from "../src";

describe("sdkwork-desktop-pc-react", () => {
  it("creates a desktop manifest with host manifest composition and required desktop window operations", () => {
    const manifest = createDesktopManifest({
      entryRoute: "/dashboard",
      featurePackages: [
        "@sdkwork/settings-pc-react",
        "@sdkwork/notification-pc-react",
        "@sdkwork/settings-pc-react",
      ],
      hostCapabilities: ["fs"],
      id: "sdkwork-drive",
      packageNames: [
        "@sdkwork/desktop-pc-react",
        "@sdkwork/sdkwork-desktop",
      ],
      title: "SDKWORK Drive",
    });

    expect(manifest.host.kind).toBe("tauri");
    expect(manifest.closeStrategy).toBe("hide-to-tray");
    expect(manifest.entryRoute).toBe("/dashboard");
    expect(manifest.featurePackages).toEqual([
      "@sdkwork/settings-pc-react",
      "@sdkwork/notification-pc-react",
    ]);
    expect(manifest.events).toEqual({
      trayNavigate: "tray://navigate",
      trayRestore: "tray://restore",
    });
    expect(manifest.hostManifest).toMatchObject({
      capability: "host",
      hostKind: "tauri",
      requiredCapabilities: [
        "window-controls",
        "tray",
        "fs",
      ],
      commandIds: [
        "window:show_main_window",
        "window:toggle_maximize",
      ],
      eventTopics: [
        "tray://navigate",
        "tray://restore",
      ],
      title: "SDKWORK Drive Desktop Host",
    });
    expect(manifest.hostManifest.packageNames).toEqual([
      "@sdkwork/host-pc-react",
      "@sdkwork/host-tauri-pc-react",
      "@sdkwork/desktop-pc-react",
      "@sdkwork/sdkwork-desktop",
    ]);
    expect(manifest.requiredWindowOperations).toEqual([
      "show",
      "minimize",
      "toggleMaximize",
      "hide",
    ]);
  });

  it("creates generic and bridge-backed desktop window controllers", async () => {
    const minimize = vi.fn(async () => undefined);
    const toggleMaximize = vi.fn(async () => undefined);
    const close = vi.fn(async () => undefined);

    const controller = createDesktopWindowController({
      close,
      labels: {
        close: "Quit Desktop",
      },
      minimize,
      toggleMaximize,
    });

    await controller.minimize();
    await controller.maximize();
    await controller.close();

    expect(minimize).toHaveBeenCalledTimes(1);
    expect(toggleMaximize).toHaveBeenCalledTimes(1);
    expect(close).toHaveBeenCalledTimes(1);
    expect(controller.labels.close).toBe("Quit Desktop");

    const hide = vi.fn(async () => undefined);
    const closeWindow = vi.fn(async () => undefined);
    const maximizeWindow = vi.fn(async () => undefined);
    const unmaximizeWindow = vi.fn(async () => undefined);
    const bridge = createTauriHostBridge({
      transport: {
        invoke: async () => undefined,
        listen: async () => () => undefined,
        window: {
          close: closeWindow,
          hide,
          isMaximized: async () => false,
          maximize: maximizeWindow,
          minimize,
          unmaximize: unmaximizeWindow,
        },
      },
    });

    const hideToTrayController = createDesktopWindowControllerFromBridge(bridge);
    await hideToTrayController.close();
    await hideToTrayController.minimize();
    await hideToTrayController.maximize();

    expect(hide).toHaveBeenCalledTimes(1);
    expect(closeWindow).toHaveBeenCalledTimes(0);
    expect(maximizeWindow).toHaveBeenCalledTimes(1);

    const quitController = createDesktopWindowControllerFromBridge(bridge, {
      closeStrategy: "quit",
    });
    await quitController.close();

    expect(closeWindow).toHaveBeenCalledTimes(1);
  });

  it("creates tray route intents and evaluates desktop shell readiness from the tauri bridge", () => {
    const manifest = createDesktopManifest({
      closeStrategy: "quit",
      entryRoute: "/settings/account",
      hostCapabilities: ["fs"],
      id: "sdkwork-drive",
      title: "SDKWORK Drive",
    });

    const bridge = createTauriHostBridge({
      descriptor: {
        capabilities: ["fs"],
      },
      transport: {
        available: () => true,
        invoke: async () => undefined,
        listen: async () => () => undefined,
        window: {
          isMaximized: async () => false,
          maximize: async () => undefined,
          minimize: async () => undefined,
          show: async () => undefined,
          unmaximize: async () => undefined,
        },
      },
    });

    const trayIntent = createTrayRouteIntent("/settings/account", {
      preserveFocus: false,
      source: "notification",
    });
    expect(isTrayRouteIntent(trayIntent)).toBe(true);
    expect(trayIntent).toEqual({
      focusWindow: false,
      route: "/settings/account",
      source: "notification",
      type: "tray-route-intent",
    });

    expect(evaluateDesktopShellReadiness(manifest, bridge)).toEqual({
      available: true,
      closeStrategy: "quit",
      entryRoute: "/settings/account",
      missingCapabilities: [],
      missingCommands: [],
      missingEvents: [],
      missingWindowOperations: ["close"],
      ready: false,
      requiredCapabilities: [
        "window-controls",
        "tray",
        "fs",
      ],
      requiredCommands: [
        "window:show_main_window",
        "window:toggle_maximize",
      ],
      requiredEvents: [
        "tray://navigate",
        "tray://restore",
      ],
      requiredWindowOperations: [
        "show",
        "minimize",
        "toggleMaximize",
        "close",
      ],
      supportsCustomChrome: true,
      supportsTrayRecovery: true,
    });
  });
});
